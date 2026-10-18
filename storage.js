'use strict';
window.HospitalStorageReady=(async()=>{
  const user=await window.HospitalProfileReady;
  if(!user)throw new Error('Entre com sua conta para abrir seu arquivo.');
  const base='misterio-hospital-js-caderno',dbName=base+':'+user.id;
  const open=name=>new Promise((resolve,reject)=>{const request=indexedDB.open(name,1);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('notes'))db.createObjectStore('notes',{keyPath:'id'});if(!db.objectStoreNames.contains('settings'))db.createObjectStore('settings',{keyPath:'id'});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
  const read=(db,store,method,key)=>new Promise((resolve,reject)=>{const request=db.transaction(store,'readonly').objectStore(store)[method](key);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
  const done=tx=>new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  const db=await open(dbName);
  try{
    if(!await read(db,'settings','get','legacy-migrated')){
      const legacy=await open(base);
      try{
        const tx=legacy.transaction('settings','readwrite'),store=tx.objectStore('settings');
        let ownsLegacy=false;
        const check=store.get('legacy-owner');
        check.onsuccess=()=>{if(!check.result||check.result.userId===user.id){ownsLegacy=true;store.put({id:'legacy-owner',userId:user.id});}};
        await done(tx);
        if(ownsLegacy){
          const [notes,settings,currentNotes,currentSettings]=await Promise.all([read(legacy,'notes','getAll'),read(legacy,'settings','getAll'),read(db,'notes','getAll'),read(db,'settings','getAll')]);
          const noteIds=new Set(currentNotes.map(item=>item.id)),settingIds=new Set(currentSettings.map(item=>item.id));
          const migration=db.transaction(['notes','settings'],'readwrite');
          for(const note of notes)if(!noteIds.has(note.id))migration.objectStore('notes').put(note);
          for(const setting of settings)if(setting.id!=='legacy-owner'&&!settingIds.has(setting.id))migration.objectStore('settings').put(setting);
          migration.objectStore('settings').put({id:'legacy-migrated',at:new Date().toISOString()});await done(migration);
          try{const old=localStorage.getItem('noemi-hospital-js-missao1-v1');if(old!==null&&!localStorage.getItem('hospital-code:'+user.id+':1'))localStorage.setItem('hospital-code:'+user.id+':1',old);}catch{}
        }else{
          const tx=db.transaction('settings','readwrite');tx.objectStore('settings').put({id:'legacy-migrated',at:new Date().toISOString()});await done(tx);
        }
      }finally{legacy.close();}
    }
    // Traz da nuvem o que estiver mais novo (e envia o que só existe aqui) antes de ler o progresso.
    await window.HospitalSync?.pull(user,db);
    const [progress,verdict,board,solved]=await Promise.all([read(db,'settings','get','progress'),read(db,'settings','get','verdict-case2'),read(db,'settings','get','board'),read(db,'settings','get','cases-solved')]);
    return {dbName,user,completed:Array.isArray(progress?.completed)?progress.completed:[],solvedCases:Array.isArray(solved?.cases)?solved.cases:[],verdictCase2:verdict?.suspect==='nilo'||!!board?.found?.includes('c2-conclusao')};
  }finally{db.close();}
})();
// Os consumidores exibem o estado de erro na interface; evita rejeição não tratada.
window.HospitalStorageReady.catch(()=>{});
