const fs=require('fs'),vm=require('vm'),assert=require('assert'),root=require('path').join(__dirname,'../public/');
const sandbox={};vm.runInNewContext(fs.readFileSync(root+'lessons.js','utf8'),sandbox);const lessons=sandbox.HospitalLessons;
const cast={window:{}};vm.runInNewContext(fs.readFileSync(root+'cases.js','utf8'),cast);const cases=cast.window.HospitalCases,people=cast.window.HospitalCast;
const code=fs.readFileSync(root+'worker.js','utf8');
async function run(phase,source,extra={}){let output;const context={self:{postMessage:data=>{output=data}},importScripts:()=>{context.HospitalLessons=lessons}};vm.runInNewContext(code,context);await context.self.onmessage({data:{phase,code:source,...extra}});return output;}
(async()=>{
 // Escrever o resultado final direto não passa: o programa também roda com outros dados.
 const hardcoded={
  5:'const ala="B";const sala="Arquivos";const destino="Ala B - Arquivos";console.log(destino);abrirGaveta(destino);',
  7:'const horaElisa=23;const horaCelina=8;const horaJonas=2;const elisaCedo=false;const celinaCedo=false;const jonasCedo=true;console.log(jonasCedo);verificarAlarme(elisaCedo,celinaCedo,jonasCedo);',
  10:'const crachaValido=true;const turno="noite";const podeEntrar=true;console.log(podeEntrar);conferirEscala(podeEntrar);',
  13:'const pulseiras=["A-12","B-07","C-19"];const primeira="A-12";console.log(primeira);conferirPulseira(primeira);',
  15:'const setores=["UTI","Farmácia","Laboratório"];let roteiro="UTI;Farmácia;Laboratório;";for(const x of []){}console.log(roteiro);reconstruirRota(roteiro);',
  18:'const nome="  ANA  ";const nomeLimpo="ana";console.log(nomeLimpo);unificarCadastro(nomeLimpo);',
  19:'const horaDoSumico=21;function estavaNaSala(e,s,h){return e<=h&&h<=s;}const nelsonEstava=true;const claraEstava=false;const marinaEstava=false;console.log(nelsonEstava);abrirGavetaSecreta(nelsonEstava,claraEstava,marinaEstava);',
  20:'const leituras=[18,20,22];const corrigidas=[20,22,24];console.log(corrigidas);calibrarSensor(corrigidas);',
  21:'const arquivo=\'{"terminal":"T-07","salvoAs":"02:14"}\';const terminal="T-07";const horario="02:14";console.log(terminal,horario);abrirArquivo(terminal,horario);',
  23:'const aviso=document.getElementById("aviso");const mensagem="Painel recuperado";console.log(mensagem);restaurarPainel(mensagem);',
  24:'const {data,error}=await supabase.from("pistas_js_treino").select("id, descricao");const total=2;console.log(total);consultarPistas(total);'
 };
 for(const [id,source]of Object.entries(hardcoded)){const r=await run(Number(id),source);assert(r.ok,'Caso '+id+': '+JSON.stringify(r.error));assert(!r.passed,'Resultado escrito direto não pode passar no caso '+id);}
 // As soluções continuam aprovadas, mesmo escritas de outro jeito.
 assert((await run(7,'const horaElisa = 23;\nconst horaCelina = 8; // chegou cedo\nconst horaJonas = 2;\nconst elisaCedo = horaElisa < 6, celinaCedo = horaCelina < 6;\nconst jonasCedo = 6 > horaJonas;\nconsole.log(elisaCedo, celinaCedo, jonasCedo);\nverificarAlarme(elisaCedo, celinaCedo, jonasCedo);')).passed);
 assert((await run(13,'const pulseiras = [\n  "A-12", // primeira\n  "B-07",\n  "C-19"\n];\nconst primeira = pulseiras[0];\nconsole.log(primeira);\nconferirPulseira(primeira);')).passed);
 // As mensagens orientam sem entregar o valor esperado.
 for(const lesson of lessons){const r=await run(lesson.id,lesson.starter);for(const problem of r.problems||[])for(const value of Object.values(lesson.expected))if(typeof value==='string'&&value.length>2||Array.isArray(value))assert(!problem.includes(JSON.stringify(value)),'Caso '+lesson.id+' revela a resposta: '+problem);}
 const empty=await run(1,lessons[0].starter);assert(empty.problems.some(text=>text.includes('senha ainda está vazia')));assert(!empty.problems.join(' ').includes('4271'));
 assert((await run(5,'const ala="B";const sala="Arquivos";const destino="Ala B - Arquivos ";console.log(destino);abrirGaveta(destino);')).problems.some(text=>text.includes('espaços no começo ou no fim')));assert((await run(18,'const original="ana";const digitado1="  ANA  ";const digitado2=" Ana Paula ";const digitado3="ana lima";const repetido1=digitado1.toLowerCase()===original;const repetido2=false;const repetido3=false;console.log(repetido1,repetido2,repetido3);unificarCadastro(repetido1,repetido2,repetido3);')).problems.some(text=>text.includes('repetido1')&&text.includes('comparação')),'Sem trim, a comparação do caso 18 falha e o corretor aponta a variável');
 assert((await run(2,'let acesso="bloqueado";acesso="Liberado";console.log(acesso);ligarRadio(acesso);')).problems.some(text=>text.includes('maiúsculas e minúsculas')));
 assert((await run(5,'const ala="B";const sala="Arquivos";const destino="Ala "+ala+"-"+sala;console.log(destino);abrirGaveta(destino);')).problems.some(text=>text.includes('espaços dentro')));
 assert((await run(16,'const conferencias=["Teresa: 4","Bianca: 0"];const comZero=["Bianca: 0"];console.log(comZero);conferirEstoque(comZero);')).problems.some(text=>text.includes('tem 1 item')));
 // A ação já escrita no programa não é pedida de novo.
 const waiting=(await run(1,lessons[0].starter)).problems.join(' ');assert(!waiting.includes('adicione abrirPorta'));assert(waiting.includes('abrirPorta já está no programa'));
 const wrongCall=(await run(1,'const senha="4271";console.log(senha);abrirPorta("0000");')).problems.join(' ');assert(wrongCall.includes('não com os dados que você preparou'));
 assert((await run(1,'const senha="4271";console.log(senha);')).problems.some(text=>text.includes('adicione abrirPorta(senha);')));
 // Casos reescritos: o registro não entrega a pessoa; o programa e as fichas levam à conclusão.
 for(const id of [7,19,21]){
  const item=cases[id-1],suspects=people.filter(p=>item.suspects.includes(p.id)),lesson=lessons[id-1];
  assert.equal(item.deduction,'codigo');
  for(const person of suspects){assert(!item.reveal.includes(person.badge),'O registro do caso '+id+' não deve trazer o crachá');assert(!item.reveal.includes(person.name),'O registro do caso '+id+' não deve trazer o nome');assert(!lesson.clue.includes(person.badge));assert(!person.statement.startsWith('Meu identificador'));}
  const result=await run(id,lesson.solution);assert(result.passed);
  const culprit=suspects.find(p=>p.id===item.culprit),other=suspects.find(p=>p.id!==item.culprit);
  const context={canCollect:true,culpritId:item.culprit,deduction:'codigo'};
  assert((await run(id,'concluirCaso('+JSON.stringify(culprit.name)+');',{fichas:suspects,context,preview:true})).commands.at(-1).correct);
  const wrong=(await run(id,'concluirCaso('+JSON.stringify(other.name)+');',{fichas:suspects,context,preview:true})).commands.at(-1);assert(!wrong.correct);assert(wrong.body.includes('resultado do seu programa'));
 }
 assert.deepEqual((await run(7,lessons[6].solution)).logs,['false false true'],'O console aponta uma única pessoa');
 assert.deepEqual((await run(19,lessons[18].solution)).logs,['true false false']);
 assert.deepEqual((await run(21,lessons[20].solution)).logs,['T-07 02:14']);
 // Dicas em níveis: todos os casos têm a dica de conceito, diferente da dica com a resposta.
 for(const lesson of lessons){assert(lesson.conceptHint&&lesson.conceptHint!==lesson.hint,'Dica de conceito do caso '+lesson.id);for(const value of Object.values(lesson.expected))if(typeof value==='string'&&value.length>2)assert(!lesson.conceptHint.includes(value),'A dica 1 do caso '+lesson.id+' não deve trazer a resposta');}
 console.log('Investigação: resultados escritos direto bloqueados em 11 casos, mensagens sem revelar respostas, ação já escrita reconhecida, casos 7, 19 e 21 resolvidos pelo programa e dicas em níveis verificados.');
})().catch(e=>{console.error(e);process.exit(1)});
