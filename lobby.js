'use strict';
(()=>{
 const $=id=>document.getElementById(id),cards=new Map();let completed=new Set(),solved=new Set();
 function restoreCards(){for(const [id,{item,card,state,action,culprit}]of cards){card.removeAttribute('aria-busy');state.textContent=solved.has(id)?'✓ CONCLUÍDO':completed.has(id)?'FALTA SUA CONCLUSÃO':'DISPONÍVEL';action.textContent=solved.has(id)?'Revisitar o caso ↗':'Abrir a investigação ↗';
  // Pasta concluída: a foto de quem foi identificado fica presa à pasta, com o carimbo.
  card.setAttribute('data-solved',String(solved.has(id)));culprit.hidden=!solved.has(id);if(solved.has(id)&&!culprit.children.length&&window.HospitalCulpritPhoto)culprit.append(window.HospitalCulpritPhoto(item));}}
 for(const item of HospitalCases){
  const card=document.createElement('a');card.href='caso'+item.id+'.html';card.className='lobby-folder available-folder room-'+item.room;
  const tab=document.createElement('span');tab.className='folder-tab';tab.textContent='CASO '+String(item.id).padStart(2,'0');
  const top=document.createElement('div');top.className='folder-top';const location=document.createElement('span');location.textContent=item.location.toUpperCase();const state=document.createElement('span');state.className='folder-state';top.append(location,state);
  const number=document.createElement('div');number.className='folder-number';number.textContent=String(item.id).padStart(2,'0');number.setAttribute('aria-hidden','true');
  const title=document.createElement('h3');title.textContent=item.title;const description=document.createElement('p');description.textContent=item.description;
  const concepts=document.createElement('div');concepts.className='folder-concepts';const concept=document.createElement('span');concept.textContent=item.topic;concepts.append(concept);
  const bottom=document.createElement('div');bottom.className='folder-bottom';const short=document.createElement('span');short.textContent='Uma história · um desafio';const action=document.createElement('strong');bottom.append(short,action);
  const culprit=document.createElement('div');culprit.className='folder-culprit';culprit.hidden=true;
  card.append(tab,top,number,title,description,concepts,culprit,bottom);cards.set(item.id,{item,card,state,action,culprit});$('lobby-cases').append(card);
  card.addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;card.setAttribute('aria-busy','true');action.textContent='Abrindo pasta…';});
 }
 restoreCards();window.addEventListener('pageshow',restoreCards);
 window.HospitalStorageReady.then(account=>{
  completed=new Set(account.completed);solved=new Set(account.solvedCases||[]);restoreCards();
  $('lobby-progress').textContent=solved.size+' de 24 casos concluídos';$('player-progress').value=solved.size;
  $('player-level').textContent=solved.size===24?'Detetive especialista':solved.size>=12?'Investigador':solved.size>=6?'Explorador':'Aprendiz';
  const next=HospitalCases.find(item=>completed.has(item.id)&&!solved.has(item.id))||HospitalCases.find(item=>!solved.has(item.id))||HospitalCases[0];
  $('continue-case').href='caso'+next.id+'.html';$('continue-label').textContent=solved.size===24?'Revisitar as investigações →':completed.size||solved.size?'Continuar a investigar →':'Começar a investigar →';$('continue-title').textContent='Caso '+String(next.id).padStart(2,'0')+' · '+next.title;
 }).catch(error=>{$('lobby-storage-status').textContent=error.message||'Não consegui abrir seu arquivo. Atualize a página para tentar novamente.';});
})();
