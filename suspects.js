'use strict';
(()=>{
  const suspects=[
    {id:'maya',name:'Maya',role:'Gestora',badge:'G-03',statement:'Meu crachá é G-03. Eu estava conferindo a escala no posto de trabalho.',skin:'#b87950',hair:'#382f25',coat:'#769c87'},
    {id:'cora',name:'Cora',role:'Arquivista',badge:'A-08',statement:'Trabalhei durante o dia. Minha ficha é A-08 e deixei os documentos separados por setor.',skin:'#ddb58a',hair:'#825038',coat:'#b3ac7a'},
    {id:'nilo',name:'Nilo',role:'Manutenção',badge:'M-17',statement:'Passei no corredor durante a madrugada para conferir o terminal. Meu crachá é M-17.',skin:'#b68561',hair:'#383d30',coat:'#758795'},
    {id:'otto',name:'Otto',role:'Auditor',badge:'U-12',statement:'Eu tinha autorização de auditor. O identificador do meu crachá é U-12.',skin:'#d0a374',hair:'#68503a',coat:'#a38d6d'}
  ];
  const $=id=>document.getElementById(id);let done=new Set(),verdict=false,storage;
  function portrait(person){
    let pixels='';const rows=['....hhhhhhhh....','...hhhhhhhhhh...','..hhhsssssshhh..','..hhsssssssshh..','..hsskksskkssh..','...sswksswkss...','...ssssssssss...','....ssSSSSss....','.....ssssss.....','....cccccccc....','...cccccccccc...','..cccccccccccc..','..cccttttccccc..','..cccttttccccc..'];
    const colors={h:person.hair,s:person.skin,S:'#8e664e',k:'#292f25',w:'#fff2d4',c:person.coat,t:'#e5d9ae'};
    rows.forEach((row,y)=>Array.from(row).forEach((color,x)=>{if(colors[color])pixels+=`<rect x="${x*6}" y="${y*6}" width="6" height="6" fill="${colors[color]}"/>`;}));
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 90" shape-rendering="crispEdges"><rect width="96" height="90" fill="#d7dcbf"/>${pixels}</svg>`);
  }
  for(const person of suspects){
    const button=document.createElement('button');button.type='button';button.className='suspect-card';
    const image=document.createElement('img'),name=document.createElement('strong'),role=document.createElement('small');image.src=portrait(person);image.alt='Retrato em pixel art de '+person.name;name.textContent=person.name;role.textContent=person.role;button.append(image,name,role);
    button.addEventListener('click',()=>{$('suspect-dialog-title').textContent=person.name;$('suspect-portrait').src=portrait(person);$('suspect-portrait').alt=person.name;$('suspect-role').textContent='Função: '+person.role;$('suspect-badge').textContent='Crachá: '+person.badge;$('suspect-statement').textContent='“'+person.statement+'”';$('suspect-dialog').showModal();});$('suspect-cards').append(button);
    const option=document.createElement('option');option.value=person.id;option.textContent=person.name+' · '+person.role;$('suspect-choice').append(option);
  }
  function render(){const available=[7,8,9,10,11,12].every(id=>done.has(id));$('deduction-form').hidden=!available;$('deduction-locked').hidden=available;if(verdict){$('deduction-feedback').textContent='Conclusão confirmada: Nilo usou o crachá M-17 para entrar sem a permissão do cargo. Você cruzou o registro, a regra e a ficha correta.';$('suspect-choice').value='nilo';$('next-case-link').hidden=false;}}
  window.addEventListener('hospital-progress-loaded',event=>{done=new Set(event.detail.completed);if(event.detail.evidence?.includes('c2-conclusao'))verdict=true;render();});
  window.addEventListener('hospital-phase-completed',event=>{done.add(event.detail.phase);render();if(event.detail.phase===12)$('suspect-panel').scrollIntoView({block:'nearest',behavior:'smooth'});});
  $('close-suspect').addEventListener('click',()=>$('suspect-dialog').close());
  $('deduction-form').addEventListener('submit',async event=>{
    event.preventDefault();if(![7,8,9,10,11,12].every(id=>done.has(id)))return;
    if($('suspect-choice').value!=='nilo'){$('deduction-feedback').textContent='Volte ao registro M-17 e compare esse identificador com os crachás nas fichas. Você pode investigar e tentar de novo.';return;}
    verdict=true;render();window.dispatchEvent(new CustomEvent('hospital-evidence-found',{detail:{id:'c2-conclusao'}}));
    if(storage){const request=indexedDB.open(storage.dbName,1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('settings','readwrite');tx.objectStore('settings').put({id:'verdict-case2',suspect:'nilo'});tx.oncomplete=()=>db.close();tx.onerror=()=>{$('deduction-feedback').textContent+=' Não consegui salvar a conclusão. Ela já aparece no quadro; baixe uma cópia do arquivo.';db.close();};};}
  });
  window.HospitalStorageReady.then(account=>{storage=account;done=new Set(account.completed);const request=indexedDB.open(account.dbName,1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('settings','readonly'),get=tx.objectStore('settings').get('verdict-case2');get.onsuccess=()=>{verdict=get.result?.suspect==='nilo';const board=tx.objectStore('settings').get('board');board.onsuccess=()=>{if(board.result?.found?.includes('c2-conclusao'))verdict=true;render();};render();};tx.oncomplete=()=>db.close();};render();}).catch(()=>{});
})();
