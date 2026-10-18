const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').join(__dirname,'../');const sandbox={};vm.runInNewContext(fs.readFileSync(root+'lessons.js','utf8'),sandbox);const lessons=sandbox.HospitalLessons;
const code=fs.readFileSync(root+'worker.js','utf8');async function run(phase,source){let output;const context={self:{postMessage:data=>{output=data}},importScripts:()=>{context.HospitalLessons=lessons}};vm.runInNewContext(code,context);await context.self.onmessage({data:{phase,code:source}});return output;}
(async()=>{
assert.equal(lessons.length,24);
for(const lesson of lessons){let r=await run(lesson.id,lesson.solution);assert(r.ok&&r.passed,'Solução do caso '+lesson.id+': '+JSON.stringify(r));r=await run(lesson.id,lesson.starter);assert(!r.passed,'O código inicial do caso '+lesson.id+' deve precisar de trabalho.');}
for(const [id,source]of [[1,'const senha=4271; console.log(senha)'],[2,'const acesso="liberado";console.log(acesso)'],[1,'console.log("4271")'],[1,'const senha="4271";']])assert(!(await run(id,source)).passed);
assert(!(await run(1,'const senha = ;')).ok);
const f=lessons[18];assert(!(await run(19,f.solution.replace('return entrada <= hora && hora <= saida','return entrada === 19'))).passed,'Função deve funcionar com várias entradas');
assert((await run(23,lessons[22].solution)).dom.aviso==='Painel recuperado');
console.log('24 soluções aprovadas; 24 inícios exigem resolução. Tipos, mutabilidade, funções com várias entradas, await, DOM e modelo Supabase conferidos.');
})().catch(e=>{console.error(e);process.exit(1)});
