'use strict';
(()=>{
 const $=id=>document.getElementById(id),cards=new Map(),rooms=['arquivos','tecnica','recepcao','laboratorio','farmacia','gestao'];let completed=new Set(),solved=new Set();
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
  // Foto da sala com o mesmo cenário do caso (espelho, luz e tom), a pista marcada e os três suspeitos ainda sem rosto.
  const scene=document.createElement('span'),view=document.createElement('span'),flip=document.createElement('span'),art=document.createElement('span'),wash=document.createElement('span');
  const room=Math.max(0,rooms.indexOf(item.room)),variant=window.HospitalSceneVariantFor?.(item);
  scene.className='folder-scene';scene.setAttribute('aria-hidden','true');view.className='folder-scene-view';flip.className='folder-scene-flip';art.className='folder-scene-art';wash.className='folder-scene-wash';
  art.setAttribute('style','background-position:'+room%3*50+'% '+Math.floor(room/3)*100+'%'+(variant?';filter:'+variant.filter+';transform:scale('+variant.zoom+');transform-origin:'+variant.pan*100+'% 100%':''));
  if(variant?.flip)flip.setAttribute('style','transform:scaleX(-1)');
  if(variant)wash.setAttribute('style','background:'+variant.wash+';opacity:'+variant.alpha);
  flip.append(art);view.append(flip,wash);scene.append(view);
  const focus=item.sceneFocus&&(window.HospitalSceneFocusFor?.(item,variant)||item.sceneFocus);
  if(focus){const clue=document.createElement('span'),label=document.createElement('span');clue.className='folder-clue';clue.setAttribute('style','left:'+(focus.x/760*100).toFixed(1)+'%;top:'+(focus.y/400*100).toFixed(1)+'%');label.textContent=focus.label;clue.append(label);scene.append(clue);}
  const suspects=document.createElement('div');suspects.className='folder-suspects';for(let n=0;n<3;n++){const face=document.createElement('span');face.className='folder-suspect';face.textContent='?';face.setAttribute('aria-hidden','true');suspects.append(face);}
  const count=document.createElement('small');count.textContent='3 suspeitos';suspects.append(count);
  card.append(tab,top,number,scene,title,description,concepts,suspects,culprit,bottom);cards.set(item.id,{item,card,state,action,culprit});$('lobby-cases').append(card);
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
