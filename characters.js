'use strict';
(()=>{
  const item=window.HospitalActiveCase,$=id=>document.getElementById(id);
  if(!item)return;
  const people=item.suspects.map(id=>window.HospitalCast.find(person=>person.id===id));
  let codeDone=false,solved=false,storage=null,conclusions=new Set();
  function setPortrait(node,person){
    const {index,columns,rows,sheet}=person.portrait,column=index%columns,row=Math.floor(index/columns);
    const photo=document.createElement('img');photo.src=sheet;photo.alt='Retrato de '+person.name;photo.draggable=false;
    photo.style.width=(columns*100)+'%';photo.style.transform=`translate(${-column*100/columns}%, ${-row*100/rows-1.3}%)`;
    node.className='person-portrait';node.replaceChildren(photo);
  }
  function openFicha(person){$('suspect-dialog-title').textContent=person.name;setPortrait($('suspect-portrait'),person);$('suspect-role').textContent='Função: '+person.role;$('suspect-badge').textContent='Crachá: '+person.badge;$('suspect-statement').textContent='“'+person.statement+'”';$('suspect-dialog').showModal();}
  window.addEventListener('hospital-ficha-consultada',event=>{const person=people.find(person=>person.id===event.detail.id);if(person)openFicha(person);});
  $('ficha-command-example').textContent='conferirFicha('+JSON.stringify(people[0].name)+');';
  // Nos casos em que o programa encontra a pessoa, a conclusão vem do console e dos depoimentos, não de um crachá pronto.
  const byCode=item.deduction==='codigo';
  if(byCode){
    $('deduction-instructions').textContent='Use o resultado do console e os depoimentos das fichas. No comando abaixo, escreva entre as aspas o nome da pessoa que eles apontam. Quando o código estiver completo e correto, o caso será concluído e salvo automaticamente.';
    const steps=document.querySelector?.('.ficha-investigation-steps');
    if(steps){steps.replaceChildren();for(const [title,text]of [['Rode o programa:','ele calcula a pista a partir dos dados do caso.'],['Leia as fichas:','compare os depoimentos com o que apareceu no console.'],['Conclua o caso:','escreva concluirCaso("nome da pessoa"); com o nome que o programa e as fichas apontam.']]){const li=document.createElement('li'),b=document.createElement('b');b.textContent=title;li.append(b,' '+text);steps.append(li);}}
  }
  for(const person of people){
    const button=document.createElement('button');button.type='button';button.className='suspect-card';
    const image=document.createElement('span'),name=document.createElement('strong'),role=document.createElement('small'),openLabel=document.createElement('span');openLabel.className='suspect-open-label';openLabel.textContent='Consultar ficha →';button.setAttribute('aria-label','Consultar ficha de '+person.name+' e comparar o crachá');setPortrait(image,person);name.textContent=person.name;role.textContent=person.role;button.append(image,name,role,openLabel);
    button.addEventListener('click',()=>{if(window.HospitalConsultByCode)window.HospitalConsultByCode(person.name);else openFicha(person);});$('suspect-cards').append(button);
  }
  function render(){
    $('suspect-purpose').textContent=byCode?codeDone?'Seu programa mostrou a pista no console. Leia os depoimentos das três fichas, descubra quem combina com o resultado e escreva concluirCaso("nome da pessoa"); no campo de conclusão.':'Estas três pessoas estão ligadas à ocorrência. Primeiro, resolva o programa: o resultado dele é a pista. Depois, compare esse resultado com os depoimentos das fichas.':codeDone?'O registro abaixo mostra o crachá de quem fez a alteração. Consulte as fichas, encontre o mesmo crachá e escreva concluirCaso("nome da pessoa"); no campo de conclusão.':'Estas três pessoas estão ligadas à ocorrência. Primeiro, resolva o programa para recuperar um registro. Depois, compare o crachá encontrado com as fichas para identificar a pessoa responsável. Cada ficha mostra função, crachá e depoimento.';
    $('deduction-form').hidden=!codeDone;$('deduction-locked').hidden=codeDone;$('recovered-record').hidden=!codeDone;
    if(codeDone){$('record-content').textContent=item.reveal;$('analysis-question').textContent=item.analysis.question;$('analysis-instructions').textContent=item.analysis.compare;}
    $('case-conclusion').hidden=!solved;
    $('next-case-link').hidden=!solved;
    if(!solved)return;
    const culprit=people.find(person=>person.id===item.culprit);
    const stamp=document.createElement('span');stamp.className='culprit-stamp';stamp.textContent='CULPADO';stamp.setAttribute('aria-hidden','true');
    setPortrait($('conclusion-portrait'),culprit);$('conclusion-portrait').append(stamp);$('conclusion-person-name').textContent=culprit.name;$('conclusion-person-role').textContent=culprit.role;$('conclusion-person-badge').textContent=culprit.badge;
    $('conclusion-record').textContent=item.reveal;$('conclusion-reason').textContent=byCode?item.analysis.explanation:'O crachá '+culprit.badge+' pertence a '+culprit.name+'. '+item.analysis.explanation;
    $('conclusion-learning').textContent=item.topic;
    $('deduction-feedback').textContent=byCode?'✓ Caso concluído pelo código. O resultado do seu programa e as fichas apontam para '+culprit.name+'.':'✓ Caso concluído pelo código. O crachá '+culprit.badge+' pertence a '+culprit.name+'. Você ligou o registro à ficha correta.';
    $('conclusion-step').classList.remove('path-current');$('conclusion-step').classList.add('path-done');
    $('success').hidden=false;$('success-title').textContent='Caso '+String(item.id).padStart(2,'0')+' concluído!';
    $('success-description').textContent=item.id===24?'Você chegou à última investigação. Pode revisar qualquer caso e experimentar a conexão com seu projeto de estudos abaixo.':'A conclusão foi adicionada ao quadro desta investigação. Você pode seguir para outro mistério ou revisar o código.';
    $('next-case-link').href=item.id<24?'caso'+(item.id+1)+'.html':'index.html';$('next-case-link').textContent=item.id<24?'Próximo: '+window.HospitalCases[item.id].title+' →':'Voltar ao arquivo de 24 casos →';
    $('review-suspects').textContent='Rever as fichas';
  }
  async function saveConclusion(){
    if(!storage)throw new Error('O arquivo ainda não está disponível.');
    const db=await new Promise((resolve,reject)=>{const request=indexedDB.open(storage.dbName,1);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
    try{await new Promise((resolve,reject)=>{const tx=db.transaction('settings','readwrite'),store=tx.objectStore('settings'),request=store.get('cases-solved');request.onsuccess=()=>{for(const id of request.result?.cases||[])conclusions.add(id);conclusions.add(item.id);store.put({id:'cases-solved',cases:[...conclusions]});};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}
  }
  $('close-suspect').addEventListener('click',()=>$('suspect-dialog').close());
  $('conclusion-code').addEventListener('input',()=>window.HospitalPreviewConclusion?.($('conclusion-code').value));
  $('conclusion-code').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();window.HospitalSubmitConclusion?.($('conclusion-code').value);}});
  $('run-conclusion').addEventListener('click',()=>window.HospitalSubmitConclusion?.($('conclusion-code').value));
  window.addEventListener('hospital-conclusion-by-code',async event=>{
    if(!codeDone||solved||event.detail.case!==item.id||event.detail.personId!==item.culprit)return;
    solved=true;conclusions.add(item.id);$('deduction-form').setAttribute('data-result','success');render();window.dispatchEvent(new CustomEvent('hospital-case-solved',{detail:{case:item.id}}));
    $('case-conclusion').scrollIntoView?.({block:'nearest',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    try{await saveConclusion();}catch{$('deduction-feedback').textContent+=' Não consegui salvar a conclusão no navegador. Baixe uma cópia completa pelo caderno para guardar seu progresso.';}
  });
  window.addEventListener('hospital-record-opened',event=>{if(event.detail.case===item.id){codeDone=true;render();}});
  window.addEventListener('hospital-progress-loaded',event=>{codeDone=event.detail.completed.includes(item.id);for(const id of event.detail.solvedCases||[])conclusions.add(id);solved=conclusions.has(item.id);if(solved)codeDone=true;render();});
  window.HospitalStorageReady.then(account=>{storage=account;codeDone=account.completed.includes(item.id);for(const id of account.solvedCases||[])conclusions.add(id);solved=conclusions.has(item.id);if(solved)codeDone=true;render();}).catch(()=>{});
  render();
})();
