const fs=require('fs'),vm=require('vm'),assert=require('assert'),root=require('path').join(__dirname,'../public/');
const sandbox={};vm.runInNewContext(fs.readFileSync(root+'lessons.js','utf8'),sandbox);const lessons=sandbox.HospitalLessons;
const ctx={window:{HospitalLessons:lessons},document:{getElementById:()=>null}};vm.runInNewContext(fs.readFileSync(root+'professor.js','utf8'),ctx);
const ada=ctx.window.HospitalProfessor,worker=fs.readFileSync(root+'worker.js','utf8');
async function run(phase,code){let out;const c={self:{postMessage:d=>{out=d}},importScripts:()=>{c.HospitalLessons=lessons}};vm.runInNewContext(worker,c);await c.self.onmessage({data:{phase,code,preview:true}});return out;}
const answers=lesson=>Object.values(lesson.expected).filter(value=>typeof value==='string'&&value.length>2);
const text=items=>items.map(item=>[item.title,item.text,item.example,item.q,item.a,item.x].filter(Boolean).join(' ')).join(' ');
(async()=>{
 // Perguntas frequentes nos 24 casos, sem a resposta do caso.
 for(const lesson of lessons){const entries=ada.faq[lesson.id];assert(entries&&entries.length>=3,'Perguntas do caso '+lesson.id);for(const entry of entries)assert(entry.q&&entry.a&&entry.k);for(const value of answers(lesson))assert(!text(entries).includes(value),'A pergunta frequente do caso '+lesson.id+' entrega '+value);}
 // Explicações do código inicial e de erros comuns: específicas e sem a resposta.
 const seen=new Set();
 for(const lesson of lessons){
  for(const code of [lesson.starter,lesson.starter.replace(/console\.log\([^)]*\);?/,''),'console.log("oi");']){
   const result=await run(lesson.id,code);for(const issue of result.issues||[])seen.add(issue.code);
   const explanations=ada.explainResult(result,lesson);assert(explanations.length,'Explicação do caso '+lesson.id);
   for(const explanation of explanations){assert.notEqual(explanation.title,'Vamos olhar juntos','Problema sem explicação própria: '+JSON.stringify(result.issues));for(const value of answers(lesson))assert(!text([explanation]).includes(value),'A explicação do caso '+lesson.id+' entrega '+value);}
  }
 }
 const typed=await run(4,'const horario = "217";\nconst codigo = 42;\nconsole.log(horario);');for(const issue of typed.issues)seen.add(issue.code);
 assert(ada.explainResult(typed,lessons[3])[0].text.includes('número'),'Tipo errado explicado');
 for(const code of ['missing','type','value','console','action-missing','action-waiting'])assert(seen.has(code),'Problema '+code+' apareceu nos testes');
 for(const issue of [{code:'function-missing',name:'f'},{code:'function-test',name:'f'},{code:'function-error',name:'f'},{code:'dom',name:'aviso'},{code:'variant'},{code:'action-args'},{code:'mutable',name:'x'},{code:'requires',name:'for'}])assert.notEqual(ada.explainIssue(issue,lessons[0]).title,'Vamos olhar juntos',issue.code);
 assert.equal(ada.explainResult(await run(1,lessons[0].solution),lessons[0])[0].title,'Seu programa está pronto!');
 // Erros reais do JavaScript traduzidos para português.
 // Mesmo embrulho do corretor do jogo, para gerar as mensagens que a jogadora vê.
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const errorOf=code=>{try{new AsyncFunction('"use strict";\n'+code+'\n;const __snapshot=1;return 1;');new Function(code)();}catch(error){return{name:error.name,message:error.message};}};
 const cases=[['const a = (1','Falta fechar parêntese'],['const a = (1;','Falta fechar parêntese'],['if (x) {\n  y = 1;','Falta fechar chave'],['const lista = [1, 2;','Falta fechar colchete'],['console.log(1));','Sobrou parêntese'],['const a = "oi;','Um texto ficou sem fechar'],['const nome = "Ana;\nconsole.log(nome);','Um texto ficou sem fechar'],['console.log("a" "b");','Falta uma vírgula ou um +'],['console.log(1 2);','Falta uma vírgula ou um +'],['console.log(semNome);','O JavaScript não conhece semNome'],['const a=1; a=2;','Essa variável não pode mudar'],['let b=1; let b=2;','b foi criada duas vezes'],['const p=undefined; p.nome;','Tentou ler .nome de algo vazio'],['"OI".toLowercase();','não é uma função'],['JSON.parse("{nome:1}");','não é um JSON válido'],['const x = 1 const y = 2;','Algo fora do lugar']];
 for(const [code,title]of cases){const error=errorOf(code);assert(error,'Deveria dar erro: '+code);const explanation=ada.explainError(error,code);assert(explanation.title.includes(title),code+' → '+explanation.title);}
 // Perguntas escritas de jeitos diferentes encontram a resposta certa, mesmo de outro caso.
 const find=(question,id)=>ada.search(question,id)?.q||'';
 assert(find('pra que servem as aspas?',1).includes('aspas'));
 assert(find('o que é um array',1).includes('lista'));
 assert(find('como uso o push',3).includes('acrescento'));
 assert(find('o que significa &&',7).includes('&&'));
 assert(find('diferença entre const e let',20).includes('const e let'));
 assert(find('o que faz o return?',19).includes('return'));
 assert.equal(ada.search('xyz qwerty',5),null);
 // Dúvida de outro caso vem marcada com o caso que ensina aquilo; exemplos usam o tema do caso.
 assert.equal(ada.search('o que é um array',4).lessonId,13);assert.equal(ada.search('pra que servem as aspas?',1).lessonId,1);
 assert(ada.explainIssue({code:'type',name:'horario',expected:'number'},lessons[3]).example.includes('Impressora'),'Exemplo com o tema do caso');
 assert(ada.explainIssue({code:'mutable',name:'acesso'},lessons[1]).example.includes('Radio'));
 assert.equal(ada.intent('me dá a resposta'),'answer');assert.equal(ada.intent('deu erro aqui'),'error');assert.equal(ada.intent('olha meu código'),'check');
 console.log('Tira-dúvidas: perguntas frequentes nos 24 casos, explicações próprias para cada problema e erro comum, nada entrega a resposta e perguntas livres encontram a explicação certa.');
})().catch(e=>{console.error(e);process.exit(1)});
