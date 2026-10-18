'use strict';
// Tutorial guiado do Caso 1: um passo por vez, com destaque no lugar certo e o resto da tela escurecido.
(()=>{
 const item=window.HospitalActiveCase;if(item?.id!==1)return;
 const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const visible=element=>!!element&&!element.hidden&&element.getClientRects().length>0,solved=()=>!$('case-conclusion').hidden;
 const steps=[
  {id:'start',title:'Boas-vindas, detetive!',text:['A sala de arquivos amanheceu trancada e alguém trocou a configuração do terminal. Este guia mostra o caminho do primeiro caso, um passo de cada vez.'],next:'Começar'},
  {id:'clue',target:'.clue-card',title:'1. Leia a pista',text:['Toda investigação começa por uma pista. Esta diz que a senha de hoje é ',{code:'4271'},'. Guarde esse número.'],next:'Entendi'},
  {id:'code',target:'.code-area',title:'2. Complete o código',text:['Este é o seu computador. Na linha ',{code:'const senha = "";'},' escreva 4271 entre as aspas. O resto do código já está pronto.'],wait:'O guia avança sozinho quando a linha estiver certa.',when:()=>$('check-data').getAttribute('data-complete')==='true'},
  {id:'run',target:'#run',title:'3. Execute o programa',text:['Agora clique em ',{strong:'▶ Executar programa'},'. A detetive vai usar a senha na porta. Quando a animação terminar, clique em ',{strong:'Voltar ao computador'},'.'],wait:'O guia avança quando o registro aparecer.',when:()=>visible($('recovered-record'))},
  {id:'record',target:'#recovered-record',title:'4. Leia o registro',text:['Seu código abriu a porta e recuperou este registro. Ele mostra o crachá de quem trocou a configuração do terminal.'],next:'Próximo'},
  {id:'fichas',target:'#suspect-cards',title:'5. Compare as fichas',text:['Clique em ',{strong:'Consultar ficha'},' e veja o crachá de cada pessoa. Quem tem o mesmo crachá do registro?'],next:'Já sei quem foi'},
  {id:'conclude',target:'#deduction-form',title:'6. Conclua o caso',text:['Escreva o nome dessa pessoa entre as aspas, assim: ',{code:'concluirCaso("Nome");'},' Depois clique em ',{strong:'Executar conclusão'},'.'],wait:'O guia avança quando o caso for encerrado.',when:solved},
  {id:'done',target:'#case-conclusion',title:'Caso encerrado!',text:['Todo caso segue este caminho: ler a pista → completar o código → executar → comparar as fichas → ',{code:'concluirCaso'},'. No Caso 2, você já sabe o caminho.'],next:'Concluir o guia'}
 ];
 let index=0,active=false,frame=0,account=null,revisiting=false;
 const card=document.createElement('section'),spot=document.createElement('div'),progress=document.createElement('p'),title=document.createElement('h2'),body=document.createElement('p'),wait=document.createElement('p'),actions=document.createElement('div'),skip=document.createElement('button'),next=document.createElement('button');
 card.className='tutorial-card';card.setAttribute('role','dialog');card.setAttribute('aria-modal','false');card.setAttribute('aria-labelledby','tutorial-title');card.setAttribute('aria-live','polite');
 spot.className='tutorial-spotlight';spot.setAttribute('aria-hidden','true');
 progress.className='tutorial-progress';title.id='tutorial-title';body.className='tutorial-text';wait.className='tutorial-wait';actions.className='tutorial-actions';
 skip.type='button';skip.className='tutorial-skip';skip.textContent='Pular o guia';next.type='button';next.className='run tutorial-next';
 actions.append(skip,next);card.append(progress,title,body,wait,actions);
 const storageKey=()=>'hospital-tutorial:'+account.user.id;
 function remember(state){try{localStorage.setItem(storageKey(),state);}catch{}}
 function render(parts){body.replaceChildren();for(const part of parts){if(typeof part==='string')body.append(part);else{const node=document.createElement(part.code?'code':'strong');node.textContent=part.code||part.strong;body.append(node);}}}
 function show(position){
  index=position;const step=steps[index];
  progress.textContent=index>0&&index<steps.length-1?'PASSO '+index+' DE '+(steps.length-2)+' · GUIA DO CASO 1':'GUIA DO CASO 1';title.textContent=step.title;render(step.text);
  // Num caso já resolvido, os passos que esperam uma ação também podem ser pulados.
  const label=step.next||(revisiting?'Próximo':'');wait.textContent=step.next||revisiting?'':step.wait||'';wait.hidden=!wait.textContent;next.hidden=!label;skip.hidden=index===steps.length-1;next.textContent=label+' →';
  const target=step.target&&document.querySelector(step.target);
  if(visible(target))reveal(target);
  if(step.id==='code'){const code=$('code'),at=code.value.indexOf('const senha = "');if(at>=0){code.focus({preventScroll:true});code.setSelectionRange(at+15,at+15);}}
  else if(label)next.focus({preventScroll:true});
 }
 function place(){
  if(!active)return;
  const dialogOpen=!!document.querySelector('dialog[open]'),step=steps[index];
  if(!dialogOpen&&step.when?.()){advance();}
  const current=steps[index],target=current.target&&document.querySelector(current.target);
  card.hidden=dialogOpen;spot.hidden=dialogOpen;
  if(!dialogOpen){
   if(visible(target)){
    const rect=target.getBoundingClientRect(),room=card.offsetHeight+32;spot.classList.remove('no-target');
    Object.assign(spot.style,{top:rect.top-8+'px',left:rect.left-8+'px',width:rect.width+16+'px',height:rect.height+16+'px'});
    card.dataset.place=rect.bottom>innerHeight-room&&rect.top>room?'top':'bottom';
   }else{spot.classList.add('no-target');Object.assign(spot.style,{top:'50%',left:'50%',width:'0px',height:'0px'});card.dataset.place='bottom';}
  }
  frame=requestAnimationFrame(place);
 }
 // Rola a página para o destaque ficar no espaço livre acima do cartão, sem ser coberto por ele.
 function reveal(target){
  const rect=target.getBoundingClientRect(),free=innerHeight-card.offsetHeight-(innerWidth<=760?92:32);
  scrollTo({top:scrollY+rect.top-Math.max(16,(free-rect.height)/2),behavior:reduced.matches?'auto':'smooth'});
 }
 function advance(){if(index<steps.length-1)show(index+1);else finish('done');}
 function start(){
  revisiting=solved();active=true;document.body.append(spot,card);
  show(revisiting||!visible($('recovered-record'))?0:steps.findIndex(step=>step.id==='record'));
  cancelAnimationFrame(frame);place();
 }
 function finish(state){active=false;cancelAnimationFrame(frame);spot.remove();card.remove();remember(state);restart.hidden=false;}
 next.addEventListener('click',advance);skip.addEventListener('click',()=>finish('skipped'));
 card.addEventListener('keydown',event=>{if(event.key==='Escape')finish('skipped');});
 const restart=document.createElement('button');restart.type='button';restart.className='tutorial-restart';restart.textContent='▶ Ver o guia do caso';restart.hidden=true;
 restart.addEventListener('click',()=>{if(!active&&account){restart.hidden=true;start();}});
 document.querySelector('.case-path')?.append(restart);
 window.HospitalStorageReady.then(user=>{
  account=user;let seen=null;try{seen=localStorage.getItem(storageKey());}catch{}
  if(seen||(user.solvedCases||[]).includes(1)){restart.hidden=false;return;}
  // Espera o restante da página aplicar o progresso antes de escolher o primeiro passo.
  setTimeout(start,300);
 }).catch(()=>{});
})();
