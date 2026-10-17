'use strict';
importScripts('lessons.js');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));return value;}
const equal=(left,right)=>JSON.stringify(canonical(left))===JSON.stringify(canonical(right));
const normalize=value=>String(value).normalize('NFD').replace(/[̀-ͯ]/g,'').trim().toLowerCase();
const trainingRows=[{id:1,descricao:'Registro da última ficha'},{id:2,descricao:'Crachá FAR-24C'}];
// Orienta sobre a diferença sem revelar o valor esperado.
function describeMismatch(name,actual,expected){
  if(typeof expected==='string'){
    if(actual==='')return `${name} ainda está vazia. Use a pista do caso para preencher.`;
    if(actual.trim()===expected.trim())return `Quase! Confira os espaços no começo ou no fim de ${name}.`;
    if(actual.toLowerCase()===expected.toLowerCase())return `Quase! Confira as letras maiúsculas e minúsculas de ${name}.`;
    if(normalize(actual)===normalize(expected))return `Quase! ${name} tem as letras certas: confira espaços nas pontas, maiúsculas e acentos.`;
    if(actual.replace(/\s+/g,'')===expected.replace(/\s+/g,''))return `Quase! Confira os espaços dentro do texto de ${name}.`;
    return `${name} ainda não corresponde à pista. Compare letra por letra, incluindo espaços e pontuação.`;
  }
  if(typeof expected==='number')return `${name} ainda não tem o número certo. Releia a pista e confira o cálculo.`;
  if(typeof expected==='boolean')return `${name} ainda não tem o resultado certo. Confira a comparação ou a condição que calcula esse valor.`;
  if(Array.isArray(expected)){if(!Array.isArray(actual))return `${name} precisa ser uma lista, entre colchetes.`;return actual.length===expected.length?`A lista ${name} tem a quantidade certa de itens, mas algum valor ou a ordem ainda não confere.`:`A lista ${name} tem ${actual.length} ${actual.length===1?'item':'itens'}. Confira se faltou ou sobrou algum.`;}
  return `Confira os valores guardados em ${name}.`;
}
// Troca o valor de uma declaração (const/let/var nome = ...) para testar o programa com outros dados.
function replaceDeclaration(source,name,replacement){
  const match=new RegExp('(?:^|[\\n;{}])[ \\t]*(?:const|let|var)\\s+'+name+'\\s*=(?!=)').exec(source);if(!match)return null;
  const start=match.index+match[0].length;let index=start,depth=0,quote=null;
  for(;index<source.length;index++){
    const char=source[index],next=source[index+1];
    if(quote){if(char==='\\')index++;else if(char===quote)quote=null;continue;}
    if(char==='"'||char==="'"||char==='`'){quote=char;continue;}
    if(char==='/'&&next==='/'){if(depth===0)break;const end=source.indexOf('\n',index);index=end<0?source.length:end;continue;}
    if(char==='/'&&next==='*'){const end=source.indexOf('*/',index+2);index=end<0?source.length:end+1;continue;}
    if('([{'.includes(char))depth++;
    else if(')]}'.includes(char)){if(depth===0)break;depth--;}
    else if(depth===0&&(char===';'||char===','||char==='\n')&&source.slice(start,index).trim())break;
  }
  return source.slice(0,start)+' '+replacement+source.slice(index);
}
const literal=value=>value&&typeof value==='object'&&typeof value.$code==='string'?value.$code:JSON.stringify(value);
// Executa o programa do jogador com os comandos do jogo. Cada execução tem o próprio estado.
async function runProgram(code,lesson,{logs,fichas,context,preview,rows=trainingRows}){
  const consulted=[],commands=[],actions=[],attempts=[];
  const format=value=>{if(typeof value==='string')return value;if(value===undefined)return 'undefined';try{return JSON.stringify(value);}catch{return String(value);}};
  const log=(...values)=>{if(logs.length<40)logs.push(values.map(format).join(' ').slice(0,1500));};
  const conferirFicha=name=>{const person=fichas.find(person=>normalize(person.name)===normalize(name));if(!person)throw new Error('Não encontrei essa ficha. Use um dos nomes apresentados neste caso.');if(!consulted.includes(person.id))consulted.push(person.id);commands.push({kind:'ficha',id:person.id});return{nome:person.name,funcao:person.role,cracha:person.badge,depoimento:person.statement};};
  const notify=(kind,title,body,extra={})=>{const command={kind,title,body,...extra};commands.push(command);return{titulo:title,descricao:body};};
  const lerOcorrencia=()=>notify('occurrence',context.title||'Ocorrência',context.description||lesson.story,{location:context.location||''});
  const examinarObjeto=(object=lesson.action.object)=>{if(normalize(object)!==normalize(lesson.action.object)&&normalize(object)!=='objeto')throw new Error('Neste caso, examine '+JSON.stringify(lesson.action.object)+'.');return notify('object','Objeto: '+lesson.action.object,lesson.clue,{learning:lesson.explanation});};
  const coletarPista=()=>(context.canCollect||(!preview&&actions.length>0))?notify('collect','Pista guardada',context.reveal||'',{evidence:lesson.evidence}):notify('notice','Ainda falta recuperar a pista','Resolva o desafio e execute '+lesson.action.name+' antes de coletar.');
  const analisarPistas=()=>{
    if(!context.canCollect&&!(actions.length&&!preview))return notify('notice','Primeiro recupere o registro','Execute o programa do desafio para revelar os dados que serão analisados. A análise ainda não está disponível.');
    const analysis=context.analysis||{},record=context.reveal||'';
    notify('analysis','Análise das pistas','O que o código encontrou:\n'+record+'\n\nO que investigar:\n'+(analysis.question||'A quem pertence o crachá do registro?')+'\n\nComo comparar:\n'+(analysis.compare||'Compare o identificador do registro com o campo crachá das fichas.'),{learning:'A análise organiza as evidências. Use conferirFicha("nome da pessoa"); para consultar uma ficha e concluirCaso("nome da pessoa"); quando tiver uma resposta.'});
    return{registro:record,pergunta:analysis.question||'A quem pertence o crachá do registro?',comparar:analysis.compare||'Compare os crachás das fichas.'};
  };
  const anotar=text=>{if(typeof text!=='string'||!text.trim()||text.length>500)throw new Error('Use anotar("sua descoberta") com até 500 caracteres.');return notify('note','Anotação enviada ao caderno',text.trim());};
  const byCode=context.deduction==='codigo';
  const concluirCaso=name=>{if(!context.canCollect&&!(actions.length&&!preview))return notify('notice','Primeiro recupere o registro',byCode?'Execute o programa do desafio e use o resultado do console para escolher a pessoa antes de concluir.':'Execute o programa do desafio e compare o crachá encontrado com as fichas antes de concluir.');const person=fichas.find(person=>normalize(person.name)===normalize(name));if(!person)throw new Error('Escreva entre as aspas o nome de uma das pessoas das fichas deste caso.');const correct=person.id===context.culpritId;return notify('conclusion',correct?'Caso concluído!':byCode?'Confira o resultado do programa':'Confira o crachá',correct?'Você identificou a pessoa responsável usando JavaScript.':byCode?'Essa pessoa não combina com o resultado do seu programa. Releia o console e os depoimentos das fichas.':'O crachá dessa pessoa não corresponde ao registro. Compare as fichas e tente novamente.',{correct,personId:person.id,name:person.name});};
  const actionFunction=(...args)=>{const expected=lesson.action.args.map(name=>lesson.expected[name]);if(!equal(args,expected)){attempts.push(args);return{ok:false,acao:lesson.action.name,mensagem:'Os dados ainda não correspondem à pista.'};}actions.push({name:lesson.action.name,args});commands.push({kind:'action',name:lesson.action.name});return{ok:true,acao:lesson.action.name,resultado:lesson.action.title};};
  const names=[...new Set([...Object.keys(lesson.expected),...(lesson.functionTests||[]).map(test=>test.name),...(lesson.variants||[]).flatMap(variant=>Object.keys(variant.expected))])];
  const snapshots=names.map(name=>`${JSON.stringify(name)}: (typeof ${name} === "undefined" ? {present:false} : {present:true,value:${name},type:typeof ${name}})`).join(',');
  const probe=lesson.mutable?`let __hospitalMutable=false;try{${lesson.mutable}="__teste_de_atribuicao__";__hospitalMutable=true;}catch{};`:'const __hospitalMutable=true;';
  const elements={aviso:{textContent:'Painel indisponível'}};
  const documentModel=Object.freeze({getElementById:id=>elements[id]||null,querySelector:selector=>typeof selector==='string'&&selector.startsWith('#')?elements[selector.slice(1)]||null:null});
  const supabaseModel=Object.freeze({from(table){return{async select(){if(table!=='pistas_js_treino')return{data:null,error:{message:'A tabela de treino se chama pistas_js_treino.'}};return{data:JSON.parse(JSON.stringify(rows)),error:null};}};}});
  const execute=new AsyncFunction('console','document','supabase','conferirFicha','lerOcorrencia','examinarObjeto','coletarPista','anotar','analisarPistas','concluirCaso',lesson.action.name,'"use strict";\n'+code+'\n;const __hospitalSnapshot={'+snapshots+'};\n'+probe+'\nreturn {values:__hospitalSnapshot,mutable:__hospitalMutable};');
  const result=await execute(Object.freeze({log,info:log,warn:log,error:log,clear:()=>{logs.length=0;}}),documentModel,supabaseModel,conferirFicha,lerOcorrencia,examinarObjeto,coletarPista,anotar,analisarPistas,concluirCaso,actionFunction);
  return{values:result.values,mutable:result.mutable,consulted,commands,actions,attempts,elements};
}
// Roda o mesmo programa com outros dados: quem escreveu o resultado final direto não passa.
async function passesVariant(code,lesson,variant,options){
  let source=code;
  for(const [name,value]of Object.entries(variant.given||{})){const changed=replaceDeclaration(source,name,literal(value));if(changed===null)return true;source=changed;}
  try{const run=await runProgram(source,lesson,{...options,logs:[],rows:variant.tabela||trainingRows});return Object.entries(variant.expected).every(([name,expected])=>run.values[name]?.present&&equal(run.values[name].value,expected));}
  catch{return false;}
}
self.onmessage=async function(event){
  const logs=[];
  try{
    const {code,phase}=event.data||{};
    if(typeof code!=='string'||code.length>20000)throw new Error('Código muito longo ou inválido. Experimente uma solução menor.');
    const lesson=HospitalLessons.find(item=>item.id===phase);if(!lesson)throw new Error('Este caso ainda não está disponível.');
    const options={logs,fichas:Array.isArray(event.data?.fichas)?event.data.fichas:[],context:event.data?.context||{},preview:!!event.data?.preview};
    const result=await runProgram(code,lesson,options);
    const problems=[],issues=[],add=(text,issue)=>{problems.push(text);issues.push(issue);};
    for(const [name,expected]of Object.entries(lesson.expected)){
      const actual=result.values[name];
      if(!actual.present)add(`Crie a variável ${name} com esse nome.`,{code:'missing',name});
      else if(actual.type!==typeof expected)add(`${name} precisa ser ${typeof expected==='string'?'um texto entre aspas':typeof expected==='number'?'um número sem aspas':typeof expected==='boolean'?'um booleano (true ou false, sem aspas)':'uma lista ou objeto, conforme a missão'}.`,{code:'type',name,expected:Array.isArray(expected)?'list':typeof expected,actual:actual.type});
      else if(!equal(actual.value,expected))add(describeMismatch(name,actual.value,expected),{code:'value',name,expected:Array.isArray(expected)?'list':typeof expected,empty:actual.value===''||(Array.isArray(actual.value)&&!actual.value.length)});
    }
    for(const test of lesson.functionTests||[]){const actual=result.values[test.name];if(!actual?.present||actual.type!=='function'){add(`Crie a função ${test.name}.`,{code:'function-missing',name:test.name});break;}try{if(!equal(await actual.value(...test.args),test.expected))add(`A função ${test.name} também precisa funcionar com ${JSON.stringify(test.args)}.`,{code:'function-test',name:test.name});}catch{add(`Não consegui testar ${test.name} com outras entradas.`,{code:'function-error',name:test.name});}}
    for(const [id,text]of Object.entries(lesson.domExpected||{}))if(String(result.elements[id]?.textContent)!==text)add(`O texto do elemento ${id} na página ainda não mudou. Altere ${id}.textContent.`,{code:'dom',name:id});
    if(!problems.length)for(const variant of lesson.variants||[])if(!await passesVariant(code,lesson,variant,options)){add('Seu programa acertou com os dados deste caso, mas não quando os dados mudam. '+(lesson.variantHint||'Calcule o resultado a partir das variáveis, em vez de escrever o valor final.'),{code:'variant'});break;}
    let dataReady=problems.length===0&&result.mutable;
    const call=lesson.action.name+'('+lesson.action.args.join(', ')+');';
    if(!logs.length)add('Mostre o valor no console: adicione console.log('+(lesson.consoleArgs||Object.keys(lesson.expected)).join(', ')+');',{code:'console'});
    if(!result.actions.length)add(!result.attempts.length?'Use os dados no objeto: adicione '+call:dataReady?lesson.action.name+' foi chamada, mas não com os dados que você preparou. Use '+call:lesson.action.name+' já está no programa. Ela vai funcionar quando os dados do passo 1 estiverem certos.',{code:!result.attempts.length?'action-missing':dataReady?'action-args':'action-waiting'});
    if(!result.mutable)add(`Use let para ${lesson.mutable}, pois ela precisa aceitar uma nova atribuição.`,{code:'mutable',name:lesson.mutable});
    const withoutComments=code.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');
    if(lesson.requires&&!new RegExp('\\b'+lesson.requires+'\\b').test(withoutComments)){dataReady=false;add(`Neste caso, pratique o comando ${lesson.requires}.`,{code:'requires',name:lesson.requires});}
    self.postMessage({ok:true,passed:problems.length===0,problems,issues,checks:{data:dataReady,output:logs.length>0,action:result.actions.length>0},logs,consulted:result.consulted,commands:result.commands,actions:result.actions,data:Object.fromEntries(Object.keys(lesson.expected).filter(name=>result.values[name]?.present).map(name=>[name,result.values[name].value])),dom:lesson.dom?{aviso:String(result.elements.aviso.textContent)}:null});
  }catch(error){self.postMessage({ok:false,logs,error:{name:error.name,message:String(error.message).slice(0,500)}});}
};
