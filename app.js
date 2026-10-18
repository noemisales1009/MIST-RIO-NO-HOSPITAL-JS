'use strict';
const $=id=>document.getElementById(id),activeCase=window.HospitalActiveCase,currentLesson=HospitalLessons.find(lesson=>lesson.case===activeCase.id);
let account=null,worker=null,timeout=null,running=false,solvedCode=false,previewWorker=null,previewTimer=null,previewTimeout=null,previewVersion=0,lastGameCommand='';
window.HospitalCurrentPhase=currentLesson.id;
const consoleStatement='console.log('+(currentLesson.consoleArgs||Object.keys(currentLesson.expected)).join(', ')+');',actionStatement=currentLesson.action.name+'('+currentLesson.action.args.join(', ')+');';
let investigationWorker=null,investigationTimer=null,investigationTimeout=null,investigationVersion=0;
const lessonKey=()=>account.user.id+':'+currentLesson.id+(currentLesson.version?':v'+currentLesson.version:''),codeKey=()=> 'hospital-code:'+lessonKey()+modeSuffix(),attemptsKey=()=>'hospital-attempts:'+lessonKey()+modeSuffix(),byCode=activeCase.deduction==='codigo';
// Depois de resolver o caso, dá para treinar: escrever o mesmo programa do zero ou fazer os treinos extras do caso.
// Cada modo guarda o próprio código e as próprias tentativas (sufixo na chave).
const drills=(window.HospitalDrills||{})[currentLesson.id]||[];
let mode={kind:'case'};
const target=()=>mode.kind==='drill'?mode.drill:currentLesson;
const modeSuffix=()=>mode.kind==='zero'?':zero':mode.kind==='drill'?':'+mode.drill.id:'';
const consoleLine=()=>mode.kind==='drill'?'console.log('+(mode.drill.consoleArgs||Object.keys(mode.drill.expected)).join(', ')+');':consoleStatement;
const starterFor=()=>mode.kind==='zero'?'// Escreva o programa inteiro, do zero.\n':target().starter;
const trainingKey=()=>'hospital-code:'+lessonKey()+':treino';
function trainingDoneList(){try{const list=JSON.parse(localStorage.getItem(trainingKey())||'[]');return Array.isArray(list)?list.filter(id=>typeof id==='string'):[];}catch{return[];}}
function trainingDone(current){const id=current.kind==='zero'?'zero':current.drill.id,list=trainingDoneList();if(!list.includes(id))list.push(id);try{localStorage.setItem(trainingKey(),JSON.stringify(list));}catch{}renderTraining();}
function feedback(text,error=false){$('feedback').textContent=text;$('feedback').className=error?'error':'success';}
function updateLines(){$('line-numbers').textContent=Array.from({length:$('code').value.split('\n').length},(_,index)=>index+1).join('\n');}
function storeCode(){if(!account)return;try{localStorage.setItem(codeKey(),$('code').value);}catch{}}
function setRunning(value){running=value;for(const id of ['run','reset','use-solution','run-investigation','insert-console','insert-action','run-conclusion'])$(id).disabled=value||!account;$('run').textContent=value?'Executando…':'▶ Executar programa';}
function stopWorker(){if(worker){worker.terminate();worker=null;}clearTimeout(timeout);}
// Conta o resultado de cada execução para quem acompanha (o tira-dúvidas da professora Mica).
const announce=detail=>window.dispatchEvent(new CustomEvent('hospital-run-result',{detail}));
function terminalState(state){$('investigation-computer').setAttribute('data-result',state);}
function playCodeAction(data){return window.HospitalCaseAction?.play(data);}
$('close-action').addEventListener('click',()=>$('action-dialog').close());
$('action-dialog').addEventListener('close',()=>{$('case-scene').append($('investigation-room'));$('run').focus({preventScroll:true});});
function commandContext(){return{title:activeCase.title,description:activeCase.description,location:activeCase.location,reveal:activeCase.reveal,analysis:activeCase.analysis,canCollect:solvedCode,culpritId:activeCase.culprit,deduction:activeCase.deduction};}
function reportGameCommands(result){
 for(const entry of result.commands||[]){if(entry.kind==='collect')window.dispatchEvent(new CustomEvent('hospital-evidence-found',{detail:{id:entry.evidence}}));if(entry.kind==='note'){try{window.HospitalAddCaseNote?.(entry.body);}catch(error){entry.title='Não consegui guardar a anotação';entry.body=error.message;}}}
 const command=result.commands?.[result.commands.length-1];if(!command)return;
 const signature=JSON.stringify(command);if(signature===lastGameCommand)return;lastGameCommand=signature;
 if(command.kind==='action')return;
 if(command.kind==='conclusion'){if(command.correct&&solvedCode){for(const id of ['action-dialog','command-dialog','suspect-dialog'])if($(id).open)$(id).close();window.dispatchEvent(new CustomEvent('hospital-conclusion-by-code',{detail:{case:activeCase.id,personId:command.personId}}));}else{$('deduction-feedback').textContent=command.body;$('deduction-form').setAttribute('data-result','error');}return;}
 if(command.kind==='ficha'){if($('action-dialog').open)$('action-dialog').close();if($('command-dialog').open)$('command-dialog').close();window.dispatchEvent(new CustomEvent('hospital-ficha-consultada',{detail:{id:command.id}}));return;}
 if($('action-dialog').open)$('action-dialog').close();
 $('command-title').textContent=command.title;$('command-location').textContent=command.location||'';$('command-body').textContent=command.body;$('command-learning').textContent=command.learning||'';
 if(!$('command-dialog').open)$('command-dialog').showModal();
}
for(const id of ['close-command','command-return'])$(id).addEventListener('click',()=>$('command-dialog').close());
$('command-dialog').addEventListener('close',()=>($('investigation-command-panel').open?$('investigation-code'):$('code')).focus({preventScroll:true}));
function updateChecks(result){
 for(const [key,id]of [['data','check-data'],['output','check-output'],['action','check-action']])$(id).setAttribute('data-complete',String(!!result?.checks?.[key]));
 $('program-next-step').textContent=!result?.ok?'Comece pelo passo 1. O computador vai conferir os dados enquanto você escreve.':!result.checks?.data?'Passo 1: confira os dados pedidos na missão.':!result.checks?.output?'Passo 2: adicione '+consoleLine()+' para mostrar o resultado.':mode.kind==='drill'?'Dados e console prontos. Clique em Executar programa para conferir o treino.':!result.checks?.action?'Passo 3: adicione '+actionStatement+' para agir no caso.':'As três partes estão prontas. Clique em Executar programa para ver a ação.';
}
function insertProgramLine(line,pattern){
 if(running||!account)return;const code=$('code'),source=code.value,match=source.match(pattern);let start,notice;
 if(match){start=match.index;notice='Essa linha já está no programa. Confira os dados usados nela.';}
 else{const separator=source.trimEnd()?'\n':'',addition=separator+line;start=source.trimEnd().length+separator.length;code.value=source.trimEnd()+addition;notice='Linha inserida no programa. Leia o comando e clique em Executar programa.';}
 code.focus({preventScroll:true});code.setSelectionRange(start,code.value.indexOf('\n',start)<0?code.value.length:code.value.indexOf('\n',start));code.scrollIntoView({block:'nearest',behavior:'auto'});updateLines();storeCode();schedulePreview();feedback(notice);
}
$('prepare-data-help').textContent=(currentLesson.id===1?'const cria uma variável. senha é o nome dela, = guarda o valor e as aspas indicam texto. ':'')+'Crie e preencha: '+(currentLesson.consoleArgs||Object.keys(currentLesson.expected)).join(', ')+'. Use a pista e a explicação da missão.';
$('console-line-example').textContent=consoleStatement;$('action-line-example').textContent=actionStatement;
$('action-command-help').textContent=currentLesson.action.name+' é a função pronta do jogo que usa seus dados: '+currentLesson.action.description;
$('insert-console').addEventListener('click',()=>insertProgramLine(consoleLine(),/\bconsole\s*\.\s*log\s*\(/));
$('insert-action').addEventListener('click',()=>insertProgramLine(actionStatement,new RegExp(currentLesson.action.name+' *[(]')));
function stopInvestigation(){investigationVersion++;clearTimeout(investigationTimer);clearTimeout(investigationTimeout);if(investigationWorker){investigationWorker.terminate();investigationWorker=null;}}
function runInvestigation(options={}){
 stopInvestigation();if(!account||running)return;const version=investigationVersion,conclusion=options.conclusion===true,code=conclusion?options.code:$('investigation-code').value;
 const resultTarget=conclusion?$('deduction-feedback'):$('investigation-feedback');
 if(conclusion)$('deduction-form').setAttribute('data-result','typing');
 resultTarget.textContent=conclusion?'Conferindo sua conclusão…':'Consultando…';
 try{investigationWorker=new Worker('worker.js');}catch{resultTarget.textContent='Atualize a página para abrir a consulta.';return;}
 const query=investigationWorker;investigationTimeout=setTimeout(()=>{if(version!==investigationVersion)return;stopInvestigation();resultTarget.textContent='A consulta demorou. Confira se o comando consegue terminar.';},2000);
 query.onmessage=event=>{if(version!==investigationVersion)return;clearTimeout(investigationTimeout);query.terminate();investigationWorker=null;const result=event.data;if(!result.ok){resultTarget.textContent=result.error?.name==='SyntaxError'?'Continue escrevendo: o comando ainda não está completo.':result.error?.message||'Confira o comando.';return;}const command=result.commands?.at(-1);if(!command||command.kind==='action'){resultTarget.textContent='Use um comando de consulta neste campo. O programa e a ação do desafio ficam no monitor acima.';return;}if(conclusion&&command.kind!=='conclusion'&&command.kind!=='notice'){resultTarget.textContent='Para concluir, use concluirCaso("nome da pessoa"); com o nome encontrado nas fichas.';return;}lastGameCommand='';reportGameCommands(result);if(command.kind==='conclusion'){resultTarget.textContent=command.correct?'✓ Código certo! Caso concluído.':command.body;if(conclusion)$('deduction-form').setAttribute('data-result',command.correct?'success':'error');}else if(conclusion){resultTarget.textContent=command.body;}else resultTarget.textContent='Consulta aberta. Seu programa do desafio foi preservado.';};
 query.onerror=event=>{event.preventDefault();stopInvestigation();resultTarget.textContent='Não consegui abrir a consulta. Tente novamente.';};
 query.postMessage({code,phase:currentLesson.id,fichas:currentFichas(),context:commandContext(),preview:true});
}
window.HospitalSubmitConclusion=code=>runInvestigation({code,conclusion:true});
window.HospitalPreviewConclusion=code=>{stopInvestigation();if(!account||running)return;investigationTimer=setTimeout(()=>runInvestigation({code,conclusion:true}),550);};
function scheduleInvestigation(){stopInvestigation();if(!account||running)return;if(/^\s*anotar\s*[(]/.test($('investigation-code').value)){$('investigation-feedback').textContent='Quando terminar de escrever sua anotação, clique em Executar comando para guardar o post-it.';return;}investigationTimer=setTimeout(runInvestigation,550);}
function selectInvestigation(command,edit=false){
 stopPreview();$('investigation-command-panel').open=true;$('investigation-code').value=command;$('investigation-code').focus({preventScroll:true});
 if(edit){const start=command.indexOf('"')+1;$('investigation-code').setSelectionRange(start,start);$('investigation-feedback').textContent='Escreva sua descoberta entre as aspas. O texto será guardado como post-it.';}
 else scheduleInvestigation();
}
const guide=[['Ler a ocorrência','lerOcorrencia();','Abre o relato do que aconteceu.'],['Examinar o objeto','examinarObjeto('+JSON.stringify(currentLesson.action.object)+');','Mostra a pista de '+currentLesson.action.object+'.'],['Consultar uma ficha','conferirFicha('+JSON.stringify((window.HospitalCast||[]).find(p=>(activeCase.suspects||[]).includes(p.id))?.name||'Nome')+');','Mostra o crachá e o depoimento.'],['Coletar a pista','coletarPista();','Guarda o registro depois de recuperá-lo.'],['Escrever uma anotação','anotar("");','Escreva seu texto e execute para guardar um post-it.'],['Analisar as pistas','analisarPistas();','Depois de recuperar o registro, mostra o que foi encontrado e como comparar as evidências.']];
for(const [label,command,explanation]of guide){const button=document.createElement('button'),name=document.createElement('strong'),description=document.createElement('span'),syntax=document.createElement('code');syntax.textContent=command;button.type='button';name.textContent=label;description.textContent=explanation;button.append(name,description,syntax);button.addEventListener('click',()=>selectInvestigation(command,command.startsWith('anotar(')));$('game-command-buttons').append(button);}
const reference=[
 ['lerOcorrencia();','Não recebe dados. Os parênteses ficam vazios.','Abre o relato e o local da ocorrência. Use para entender o problema antes de programar.'],
 ['examinarObjeto('+JSON.stringify(currentLesson.action.object)+');','Recebe o nome do objeto como texto entre aspas.','Abre a pista de '+currentLesson.action.object+'. Leia o que foi encontrado e use essa informação no desafio.'],
 [actionStatement,'Recebe '+currentLesson.action.args.join(', ')+': os valores das variáveis que você preparou.','Execute esta linha no programa do monitor. '+currentLesson.action.description+' A ação recupera o registro que será usado para investigar as fichas.'],
 ['conferirFicha('+JSON.stringify(currentFichas()[0]?.name||'Nome')+');','Recebe o nome de uma das três pessoas, entre aspas.',byCode?'Abre a ficha com função, crachá e depoimento. Compare o depoimento com o resultado que o seu programa mostrou no console.':'Abre a ficha com função, crachá e depoimento. Compare o crachá da ficha com o identificador do registro recuperado. O mesmo crachá liga a pessoa à ocorrência.'],
 ['analisarPistas();','Não recebe dados. Recupere primeiro o registro do caso.','Organiza o resultado do programa, a pergunta da investigação e o que comparar nas fichas. A análise orienta sua investigação; a conclusão fica para você.'],
 ['concluirCaso("Nome da pessoa");',byCode?'Recebe o nome da pessoa que o resultado do programa e as fichas apontam.':'Recebe o nome da pessoa cuja ficha tem o mesmo crachá do registro.','Confere sua conclusão. Com o nome correto e o registro recuperado, o caso é concluído e salvo automaticamente.'],
 ['coletarPista();','Não recebe dados. Primeiro recupere o registro com o programa.','Guarda a evidência no quadro do caderno. Se o registro ainda não foi recuperado, o jogo explica o que falta.'],
 ['anotar("O crachá do registro aparece nesta ficha.");','Recebe o texto que você quiser guardar, entre aspas.','Cria um post-it no caderno desta investigação. Registre uma hipótese, uma dúvida ou o que você aprendeu.'],
 [consoleStatement,'Recebe uma ou mais variáveis ou valores.','Mostra os valores na saída do console. No desafio, use para conferir os dados antes de aplicar a ação.']
];
for(const [syntax,input,result]of reference){const card=document.createElement('section'),code=document.createElement('code'),argument=document.createElement('p'),explanation=document.createElement('p');code.textContent=syntax;argument.textContent='O que recebe: '+input;explanation.textContent='O que faz: '+result;card.append(code,argument,explanation);$('command-reference-list').append(card);}
$('run-investigation').addEventListener('click',runInvestigation);$('investigation-code').addEventListener('input',scheduleInvestigation);
$('investigation-code').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();runInvestigation();}});
function currentFichas(){return (window.HospitalCast||[]).filter(person=>(activeCase.suspects||[]).includes(person.id));}
window.HospitalConsultByCode=name=>selectInvestigation('conferirFicha('+JSON.stringify(name)+');');
function stopPreview(){previewVersion++;clearTimeout(previewTimer);clearTimeout(previewTimeout);if(previewWorker){previewWorker.terminate();previewWorker=null;}}
function schedulePreview(){
 stopPreview();if(!account||running)return;
 const version=previewVersion;terminalState('preview');$('feedback').textContent='';$('execution-status').textContent='Digitando…';
 previewTimer=setTimeout(()=>{
  if(version!==previewVersion||running)return;
  try{previewWorker=new Worker('worker.js');}catch{return;}
  const preview=previewWorker;
  previewTimeout=setTimeout(()=>{if(version!==previewVersion)return;stopPreview();$('execution-status').textContent='Prévia pausada';$('output').textContent='A prévia demorou para responder. Confira se a repetição consegue terminar.';},800);
  preview.onmessage=event=>{
   if(version!==previewVersion)return;clearTimeout(previewTimeout);preview.terminate();previewWorker=null;
   const result=event.data;updateChecks(result);$('execution-status').textContent='PRÉVIA DO PROGRAMA';
   $('output').textContent=!result.ok?result.error?.name==='SyntaxError'?'Continue digitando: o código ainda não está completo.':result.error?.message||'Confira o comando da ficha.':result.logs?.length?result.logs.map(line=>line===''?'""':line).join('\n'):'Para ver o valor aqui, adicione '+consoleStatement;
   if(result.ok){reportGameCommands(result);if(result.dom)$('aviso').textContent=result.dom.aviso;}
  };
  preview.onerror=event=>{event.preventDefault();if(version!==previewVersion)return;stopPreview();$('execution-status').textContent='Prévia indisponível';};
  preview.postMessage({code:$('code').value,phase:currentLesson.id,drill:mode.kind==='drill'?mode.drill.id:undefined,fichas:currentFichas(),context:commandContext(),preview:true});
 },550);
}
function showRecord(){window.HospitalCaseAction?.restore(currentLesson.expected);solvedCode=true;$('success-title').textContent='Registro recuperado!';$('success-description').textContent=byCode?'Seu código abriu uma nova evidência. Use o resultado do console e os depoimentos das fichas para concluir a história.':'Seu código abriu uma nova evidência. Compare o registro com os crachás nas fichas para concluir a história.';$('success').hidden=false;$('code-step').classList.add('path-done');$('conclusion-step').classList.add('path-current');$('mission-status').textContent='✓ CÓDIGO CONFERIDO';$('scene-tag').textContent='✓ REGISTRO RECUPERADO';$('lia-speech').textContent=activeCase.reveal;$('phase-visual-status').textContent='Nova evidência no quadro';$('phase-visual-status').hidden=false;window.dispatchEvent(new CustomEvent('hospital-record-opened',{detail:{case:activeCase.id}}));renderTraining();}
function describeError(error){if(error.name==='SyntaxError')return 'Confira as aspas, chaves e parênteses. A dica pode ajudar.\n\nJavaScript: '+error.message;if(error.name==='ReferenceError')return 'Um nome não foi reconhecido. Confira os nomes das variáveis e as letras maiúsculas e minúsculas.\n\nJavaScript: '+error.message;return 'O código não terminou como esperado. Confira a dica e tente novamente.\n\n'+error.name+': '+error.message;}
function run(){
 if(running||!account)return;stopInvestigation();stopPreview();stopWorker();storeCode();setRunning(true);terminalState('running');$('execution-status').textContent='Executando';$('feedback').textContent='';
 try{worker=new Worker('worker.js');}catch{setRunning(false);feedback('Não consegui iniciar o terminal. Atualize a página para tentar novamente.',true);return;}
 timeout=setTimeout(()=>{stopWorker();setRunning(false);registerAttempt();announce({ok:false,timeout:true,failedRuns});$('execution-status').textContent='Interrompido';feedback('O código demorou mais de dois segundos e foi interrompido. Confira se existe uma repetição sem fim e tente de novo.',true);},2000);
 worker.onerror=event=>{event.preventDefault();stopWorker();setRunning(false);feedback('O terminal não conseguiu carregar. Atualize a página e tente novamente.',true);};
 worker.onmessage=async event=>{const result=event.data;stopWorker();setRunning(false);updateChecks(result);$('output').textContent=result.logs?.length?result.logs.join('\n'):'Nenhum valor foi mostrado. Adicione '+consoleStatement;terminalState(result.ok&&result.passed?'success':'error');$('execution-status').textContent=result.ok&&result.passed?'✓ CÓDIGO CERTO':result.ok?'↻ AINDA NÃO':'↻ CONFIRA O CÓDIGO';if(!result.ok){registerAttempt();announce({ok:false,error:result.error,failedRuns});feedback(describeError(result.error),true);return;}if(result.dom)$('aviso').textContent=result.dom.aviso;if(!result.passed){registerAttempt();announce({ok:true,passed:false,issues:result.issues||[],failedRuns});reportGameCommands(result);feedback('Faltam estas partes no programa:\n• '+result.problems.join('\n• '),true);return;}announce({ok:true,passed:true,failedRuns});if(mode.kind!=='case'){trainingDone(mode);$('execution-status').textContent='✓ TREINO CONCLUÍDO';feedback(mode.kind==='zero'?'Você escreveu o programa inteiro do zero. Isso é programar de verdade!':'Treino concluído! Escolha outro treino ou volte ao caso.');reportGameCommands(result);return;}feedback('Código certo! Veja a ação no objeto do caso.');setRunning(true);$('run').textContent='Revelando pista…';try{await playCodeAction(result.data);showRecord();window.dispatchEvent(new CustomEvent('hospital-phase-completed',{detail:{phase:currentLesson.id}}));reportGameCommands(result);}finally{setRunning(false);}};
 worker.postMessage({code:$('code').value,phase:currentLesson.id,drill:mode.kind==='drill'?mode.drill.id:undefined,fichas:currentFichas(),context:commandContext()});
}
$('lia-speech').textContent='Vamos investigar: '+currentLesson.clue+' Observe a pista e use o terminal para recuperar o registro.';$('mission-title').textContent=currentLesson.title;$('lesson-concept').textContent=currentLesson.concept;$('lesson-story').textContent=currentLesson.story;$('lesson-explanation').textContent=currentLesson.explanation;$('lesson-task').textContent=currentLesson.mission;$('clue-text').textContent=currentLesson.clue;$('clue-caption').textContent='Uma pista desta história.';$('code').value=currentLesson.starter;$('mission-status').textContent='UM OBJETIVO POR VEZ';updateLines();
$('run').addEventListener('click',run);$('code').addEventListener('input',()=>{updateLines();storeCode();schedulePreview();});$('code').addEventListener('scroll',()=>{$('line-numbers').scrollTop=$('code').scrollTop;});$('code').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();run();}if(event.key==='Tab'){event.preventDefault();event.currentTarget.setRangeText('  ',event.currentTarget.selectionStart,event.currentTarget.selectionEnd,'end');updateLines();storeCode();schedulePreview();}});
function reset(){if(running)return;stopInvestigation();stopPreview();updateChecks(null);window.HospitalResetPosition?.();window.HospitalCaseAction?.reset();$('code').value=starterFor();updateLines();storeCode();$('output').textContent='Seu resultado aparece aqui.';$('execution-status').textContent='Aguardando';terminalState('idle');$('feedback').textContent='';$('code').focus();}
// Dicas em três níveis: o conceito fica aberto; a dica com código e a solução só aparecem depois de tentativas que não deram certo.
let failedRuns=0;
const conceptHint=document.createElement('details'),conceptSummary=document.createElement('summary'),conceptText=document.createElement('p'),hintStatus=document.createElement('p');
conceptHint.id='hint-concept';conceptSummary.textContent='Dica 1 · Pense no conceito';conceptText.textContent=currentLesson.conceptHint||currentLesson.explanation;conceptHint.append(conceptSummary,conceptText);
hintStatus.className='hint-status';hintStatus.setAttribute('role','status');hintStatus.setAttribute('aria-live','polite');$('hint').before?.(hintStatus,conceptHint);
const hintLevels=[[$('hint'),'Dica 2 · Meio caminho',1],[$('solution'),'Dica 3 · Ver e entender a solução',2]],hintUnlocked=need=>failedRuns>=need;
function renderHints(){
 for(const [details,label,need]of hintLevels){const open=hintUnlocked(need),summary=details.querySelector?.('summary');details.hidden=!open;details.setAttribute('data-locked',String(!open));if(summary)summary.textContent=label;if(!open)details.open=false;}
 $('hint-content').textContent=hintUnlocked(1)?target().hint:'';$('solution-code').textContent=hintUnlocked(2)?target().solution:'';$('solution-explanation').textContent=hintUnlocked(2)?(target().explainSolution||''):'';
 hintStatus.textContent=hintUnlocked(2)?'Apareceu a dica 3, com a solução comentada.':hintUnlocked(1)?'Apareceu a dica 2. Se o código ainda não der certo, a solução aparece depois da próxima tentativa.':'Se o código não der certo, novas dicas aparecem aqui.';
}
for(const [details,,need]of hintLevels)details.querySelector?.('summary')?.addEventListener('click',event=>{if(!hintUnlocked(need))event.preventDefault();});
function registerAttempt(){if(!account)return;failedRuns++;try{localStorage.setItem(attemptsKey(),String(failedRuns));}catch{}renderHints();}
renderHints();
$('reset').addEventListener('click',reset);$('replay').addEventListener('click',()=>setMode({kind:'zero'}));$('use-solution').addEventListener('click',()=>{if(running||!hintUnlocked(2))return;$('code').value=target().solution;updateLines();storeCode();schedulePreview();$('code').focus();feedback('Solução colocada no terminal. Leia o código e execute para ver o resultado.');});
$('review-suspects').addEventListener('click',()=>{$('suspect-panel').scrollIntoView({block:'start',behavior:'smooth'});$('conclusion-code').focus({preventScroll:true});});$('soundless').addEventListener('click',()=>$('about').showModal());$('close-about').addEventListener('click',()=>$('about').close());
window.addEventListener('hospital-progress-loaded',event=>{if(event.detail.completed.includes(currentLesson.id))showRecord();});
// ---------- treino depois do caso ----------
const training=document.createElement('section'),trainingTitle=document.createElement('h3'),trainingText=document.createElement('p'),trainingList=document.createElement('div'),trainingBack=document.createElement('button');
training.className='training';training.id='training';training.hidden=true;training.setAttribute('aria-labelledby','training-title');trainingTitle.id='training-title';trainingTitle.textContent='Treino extra';trainingList.className='training-list';
trainingBack.type='button';trainingBack.className='small-button training-back';trainingBack.textContent='← Voltar ao caso';trainingBack.hidden=true;trainingBack.addEventListener('click',()=>setMode({kind:'case'}));
training.append(trainingTitle,trainingText,trainingList,trainingBack);$('investigation-computer').after?.(training);
function renderTraining(){
 if(!account||!solvedCode){training.hidden=true;return;}
 const done=trainingDoneList(),options=[{id:'zero',title:'Escrever do zero',detail:'O mesmo desafio, com o editor vazio.'},...drills.map(drill=>({id:drill.id,title:drill.title,detail:drill.story||drill.mission,drill}))],finished=options.filter(option=>done.includes(option.id)).length;
 training.hidden=false;trainingList.replaceChildren();
 trainingText.textContent=finished===options.length?'Você fez todos os treinos deste caso. Resolver de novo sem olhar nada é o melhor jeito de fixar.':'Resolver o caso é o começo. Para aprender de verdade, escreva o programa do zero e faça os treinos: '+finished+' de '+options.length+' feitos.';
 for(const option of options){
  const button=document.createElement('button'),name=document.createElement('span'),detail=document.createElement('small');
  button.type='button';name.textContent=option.title;detail.textContent=option.detail;button.append(name,detail);
  const active=option.id==='zero'?mode.kind==='zero':mode.kind==='drill'&&mode.drill.id===option.id;
  button.setAttribute('aria-pressed',String(active));button.setAttribute('data-done',String(done.includes(option.id)));
  button.addEventListener('click',()=>setMode(option.id==='zero'?{kind:'zero'}:{kind:'drill',drill:option.drill}));
  trainingList.append(button);
 }
 trainingBack.hidden=mode.kind==='case';
}
function setMode(next){
 if(running||!account)return;stopInvestigation();stopPreview();mode=next;
 const drill=mode.kind==='drill'?mode.drill:null;
 $('mission-title').textContent=drill?drill.title:mode.kind==='zero'?currentLesson.title+' · do zero':currentLesson.title;
 $('lesson-story').textContent=drill?(drill.story||''):currentLesson.story;
 $('lesson-task').textContent=drill?drill.mission:mode.kind==='zero'?'Escreva o programa inteiro sem olhar a solução. '+currentLesson.mission:currentLesson.mission;
 $('mission-status').textContent=mode.kind==='case'?(solvedCode?'✓ CÓDIGO CONFERIDO':'UM OBJETIVO POR VEZ'):mode.kind==='zero'?'TREINO · DO ZERO':'TREINO EXTRA';
 conceptText.textContent=target().conceptHint||currentLesson.conceptHint||currentLesson.explanation;
 $('prepare-data-help').textContent='Crie e preencha: '+(target().consoleArgs||Object.keys(target().expected)).join(', ')+'. Use a missão e a explicação.';
 $('console-line-example').textContent=consoleLine();$('insert-action').hidden=mode.kind==='drill';
 const steps=document.querySelectorAll?.('.program-checklist li')||[];if(steps[2])steps[2].hidden=mode.kind==='drill';
 try{$('code').value=localStorage.getItem(codeKey())??starterFor();failedRuns=Number(localStorage.getItem(attemptsKey()))||0;}catch{$('code').value=starterFor();failedRuns=0;}
 renderHints();updateLines();updateChecks(null);$('output').textContent='Seu resultado aparece aqui.';$('execution-status').textContent='Aguardando';terminalState('idle');$('feedback').textContent='';
 renderTraining();
 if(mode.kind!=='case'){$('investigation-computer').scrollIntoView?.({block:'start',behavior:'smooth'});$('code').focus?.({preventScroll:true});}
}
window.HospitalTrainingMode=setMode;
window.addEventListener('beforeunload',()=>{stopWorker();stopPreview();stopInvestigation();});
updateChecks(null);setRunning(true);
(async()=>{try{account=await window.HospitalStorageReady;try{$('code').value=localStorage.getItem(codeKey())??starterFor();failedRuns=Number(localStorage.getItem(attemptsKey()))||0;}catch{}renderHints();updateLines();setRunning(false);if(account.completed.includes(currentLesson.id))showRecord();}catch{setRunning(false);feedback('Entre para abrir seu arquivo, ou atualize a página para tentar novamente.',true);}})();
