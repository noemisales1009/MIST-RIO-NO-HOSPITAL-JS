'use strict';
// Sincronização com o Supabase.
// O jogo continua gravando no navegador (IndexedDB e localStorage), como antes. Este arquivo:
//  1) observa as gravações do caderno, do progresso e do código digitado e envia uma cópia para a tabela hospital_dados;
//  2) ao abrir o jogo, traz da nuvem o que estiver mais novo e envia o que só existe aqui.
// Sem login na nuvem (modo local), não faz nada.
(()=>{
 const BASE='misterio-hospital-js-caderno:',CODE_PREFIX='hospital-code:',TABLE='hospital_dados';
 const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 const KEY_OK=/^[A-Za-z0-9_.:-]{1,120}$/,TYPES=new Set(['nota','config','codigo']);
 const MAX_VALUE=6000000,BATCH_BYTES=1500000; // limite por registro e por envio
 const DEVICE_ONLY=new Set(['legacy-migrated','legacy-owner']); // controle interno deste navegador, não sincroniza
 const auth=window.HospitalAuth,client=auth&&auth.mode==='nuvem'?auth.client:null;
 const pending=new Map();
 let suppress=false,timer=null,flushing=false,retry=0,user=null;
 if(!client){window.HospitalSync={pull:async()=>{},flush:async()=>{},status:()=>'local'};return;}
 window.HospitalProfileReady.then(profile=>{user=profile&&UUID.test(profile.id)?profile:null;});

 // ---------- indicador discreto no cabeçalho ----------
 let state='ok';
 const LABELS={ok:'☁ Salvo na nuvem',sync:'☁ Salvando…',off:'☁ Sem internet · será enviado depois',err:'☁ Não consegui salvar · tentando de novo'};
 function setStatus(next){
  state=next;
  document.querySelectorAll('[data-player-badge]').forEach(chip=>{
   let badge=chip.parentNode.querySelector('[data-sync-chip]');
   if(!badge){badge=document.createElement('span');badge.className='sync-chip';badge.setAttribute('data-sync-chip','');badge.setAttribute('role','status');chip.parentNode.insertBefore(badge,chip);}
   badge.textContent=LABELS[next]||'';badge.setAttribute('data-state',next);
  });
 }

 // ---------- carimbos de data de cada registro (para decidir quem é mais novo) ----------
 const mtKey=uid=>'hospital-mt:'+uid;
 function loadMt(uid){try{const parsed=JSON.parse(localStorage.getItem(mtKey(uid))||'{}');return parsed&&typeof parsed==='object'?parsed:{};}catch{return{};}}
 function saveMt(uid,map){try{localStorage.setItem(mtKey(uid),JSON.stringify(map));}catch{}}
 function touchMt(uid,key,at){const map=loadMt(uid);map[key]=at;saveMt(uid,map);}

 // ---------- fila de envio ----------
 function validRow(tipo,chave,valor){
  if(!TYPES.has(tipo)||!KEY_OK.test(String(chave)))return false;
  let size;try{size=JSON.stringify(valor).length;}catch{return false;}
  return size>0&&size<=MAX_VALUE;
 }
 function enqueue(uid,tipo,chave,valor){
  if(!user||uid!==user.id||!validRow(tipo,chave,valor))return;
  const at=Date.now();touchMt(uid,tipo+'/'+chave,at);
  pending.set(tipo+'/'+chave,{tipo,chave:String(chave),valor,at});
  clearTimeout(timer);timer=setTimeout(flush,1500);setStatus('sync');
 }
 async function flush(){
  if(flushing||!pending.size||!user)return;
  flushing=true;clearTimeout(timer);setStatus('sync');
  try{
   while(pending.size){
    const batch=[];let bytes=0;
    for(const item of pending.values()){const size=JSON.stringify(item.valor).length;if(batch.length&&bytes+size>BATCH_BYTES)break;batch.push(item);bytes+=size;}
    const rows=batch.map(item=>({user_id:user.id,tipo:item.tipo,chave:item.chave,valor:item.valor,atualizado_em:new Date(item.at).toISOString()}));
    const {error}=await client.from(TABLE).upsert(rows,{onConflict:'user_id,tipo,chave'});
    if(error)throw error;
    for(const item of batch)if(pending.get(item.tipo+'/'+item.chave)===item)pending.delete(item.tipo+'/'+item.chave);
   }
   retry=0;flushing=false;setStatus('ok');
  }catch{
   flushing=false;retry=Math.min(retry+1,6);setStatus(navigator.onLine===false?'off':'err');
   timer=setTimeout(flush,Math.min(60000,2000*2**retry));
  }
 }

 // ---------- observa as gravações do jogo (não muda o código das telas) ----------
 if(typeof IDBObjectStore!=='undefined'){
  const originalPut=IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put=function(value,key){
   const request=originalPut.apply(this,arguments);
   try{
    const name=this.name,dbName=this.transaction.db.name;
    if(!suppress&&dbName.startsWith(BASE)&&(name==='notes'||name==='settings')&&value&&typeof value.id==='string'&&!DEVICE_ONLY.has(value.id)){
     const uid=dbName.slice(BASE.length),copy=JSON.parse(JSON.stringify(value));
     this.transaction.addEventListener('complete',()=>enqueue(uid,name==='notes'?'nota':'config',copy.id,copy));
    }
   }catch{}
   return request;
  };
 }
 if(typeof Storage!=='undefined'){
  const originalSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   originalSet.apply(this,arguments);
   try{
    if(!suppress&&this===window.localStorage&&typeof key==='string'&&key.startsWith(CODE_PREFIX)){
     // O código pode ter versão (ex.: 7:v2) quando o desafio do caso foi reescrito.
     const match=/^hospital-code:([^:]+):(\d{1,3}(?::v\d{1,3})?)$/.exec(key);if(match)enqueue(match[1],'codigo',match[2],String(value));
    }
   }catch{}
  };
 }
 window.addEventListener('online',()=>{if(pending.size)flush();});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&pending.size)flush();});
 window.addEventListener('pagehide',()=>{if(pending.size)flush();});

 // ---------- junção entre o que há aqui e o que há na nuvem ----------
 const request=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 const same=(a,b)=>{try{return JSON.stringify(a)===JSON.stringify(b);}catch{return false;}};
 const union=(a,b)=>[...new Set([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])])].sort((x,y)=>(typeof x==='number'&&typeof y==='number')?x-y:String(x).localeCompare(String(y)));
 // Progresso nunca deve diminuir: some a lista de casos concluídos de cada lado.
 function mergeProgress(key,local,remote,remoteNewer){
  if(key==='config/progress')return{...remote,...local,id:'progress',completed:union(local.completed,remote.completed)};
  if(key==='config/cases-solved')return{...remote,...local,id:'cases-solved',cases:union(local.cases,remote.cases)};
  if(key==='config/board'){const older=remoteNewer?local:remote,newer=remoteNewer?remote:local;return{...older,...newer,id:'board',found:union(local.found,remote.found),positions:{...(older.positions||{}),...(newer.positions||{})}};}
  return undefined;
 }
 function validRemote(row){
  if(!row||!TYPES.has(row.tipo)||!KEY_OK.test(String(row.chave))||row.valor==null)return false;
  if(row.tipo==='codigo')return typeof row.valor==='string'&&row.valor.length<=200000;
  return typeof row.valor==='object'&&!Array.isArray(row.valor)&&row.valor.id===row.chave;
 }
 async function pull(profile,db){
  if(!profile||!UUID.test(profile.id))return;
  const uid=profile.id;user=profile;setStatus('sync');
  let rows;
  const controller=new AbortController(),giveUp=setTimeout(()=>controller.abort(),8000);
  try{
   const {data,error}=await client.from(TABLE).select('tipo,chave,valor,atualizado_em').eq('user_id',uid).abortSignal(controller.signal);
   if(error)throw error;rows=(data||[]).filter(validRemote);
  }catch{clearTimeout(giveUp);setStatus(navigator.onLine===false?'off':'err');return;}
  clearTimeout(giveUp);
  try{
   const [notes,settings]=await Promise.all([request(db.transaction('notes','readonly').objectStore('notes').getAll()),request(db.transaction('settings','readonly').objectStore('settings').getAll())]);
   const local=new Map();
   for(const note of notes)local.set('nota/'+note.id,note);
   for(const setting of settings)if(!DEVICE_ONLY.has(setting.id))local.set('config/'+setting.id,setting);
   for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i),match=key&&key.startsWith(CODE_PREFIX+uid+':')?/^hospital-code:[^:]+:(\d{1,3}(?::v\d{1,3})?)$/.exec(key):null;if(match)local.set('codigo/'+match[1],localStorage.getItem(key));}
   const remote=new Map(rows.map(row=>[row.tipo+'/'+row.chave,row])),mt=loadMt(uid),toLocal=[],toRemote=[],now=Date.now();
   for(const key of new Set([...local.keys(),...remote.keys()])){
    const [tipo,...rest]=key.split('/'),chave=rest.join('/'),mine=local.get(key),theirs=remote.get(key);
    const mineAt=mt[key]||0,theirsAt=theirs?Date.parse(theirs.atualizado_em)||0:0;
    if(!theirs){toRemote.push({tipo,chave,valor:mine,at:mineAt||now});continue;}
    if(mine===undefined){toLocal.push({tipo,chave,valor:theirs.valor,at:theirsAt});continue;}
    if(same(mine,theirs.valor)){mt[key]=Math.max(mineAt,theirsAt);continue;}
    const merged=tipo==='config'?mergeProgress(key,mine,theirs.valor,theirsAt>mineAt):undefined;
    if(merged!==undefined){
     if(!same(merged,theirs.valor))toRemote.push({tipo,chave,valor:merged,at:now});
     if(!same(merged,mine))toLocal.push({tipo,chave,valor:merged,at:now});
     continue;
    }
    if(theirsAt>mineAt)toLocal.push({tipo,chave,valor:theirs.valor,at:theirsAt});
    else if(mineAt>theirsAt)toRemote.push({tipo,chave,valor:mine,at:mineAt});
   }
   if(toLocal.length){
    suppress=true;
    try{
     const tx=db.transaction(['notes','settings'],'readwrite'),done=new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
     for(const item of toLocal){
      if(item.tipo==='nota')tx.objectStore('notes').put(item.valor);
      else if(item.tipo==='config')tx.objectStore('settings').put(item.valor);
      else try{localStorage.setItem(CODE_PREFIX+uid+':'+item.chave,item.valor);}catch{}
      mt[item.tipo+'/'+item.chave]=item.at;
     }
     await done;
    }finally{suppress=false;}
   }
   saveMt(uid,mt);
   for(const item of toRemote)if(validRow(item.tipo,item.chave,item.valor)){mt[item.tipo+'/'+item.chave]=item.at;pending.set(item.tipo+'/'+item.chave,item);}
   saveMt(uid,mt);
  }catch{setStatus('err');return;}
  if(pending.size)flush();else setStatus('ok');
 }
 window.HospitalSync={pull,flush,status:()=>state};
})();
