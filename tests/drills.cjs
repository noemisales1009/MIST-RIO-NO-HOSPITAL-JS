const fs=require('fs'),vm=require('vm'),assert=require('assert'),root=require('path').join(__dirname,'../public/');
// Treinos extras: cada um tem os campos que a tela usa, a solução passa no corretor, o início não passa,
// escrever o resultado pronto não passa, e o corretor em modo treino não exige a ação no cenário.
const sandbox={};vm.runInNewContext(fs.readFileSync(root+'lessons.js','utf8'),sandbox);vm.runInNewContext(fs.readFileSync(root+'drills.js','utf8'),sandbox);
const lessons=sandbox.HospitalLessons,drills=sandbox.HospitalDrills,worker=fs.readFileSync(root+'worker.js','utf8');
async function run(phase,code,drill){let output;const context={self:{postMessage:data=>{output=data}},importScripts:()=>{context.HospitalLessons=lessons;context.HospitalDrills=drills}};vm.runInNewContext(worker,context);await context.self.onmessage({data:{phase,code,drill}});return output;}
(async()=>{
 let total=0;
 for(const lesson of lessons){
  const list=drills[lesson.id];assert(Array.isArray(list)&&list.length>=2,'Caso '+lesson.id+' precisa de pelo menos dois treinos');
  assert.equal(new Set(list.map(d=>d.id)).size,list.length,'ids repetidos no caso '+lesson.id);
  for(const drill of list){
   total++;const where='treino '+lesson.id+'/'+drill.id;
   for(const field of ['id','title','mission','starter','solution','hint','explainSolution','expected'])assert(field in drill,where+' sem '+field);
   assert(/^t\d$/.test(drill.id),where+': id deve ser t1, t2…');
   const ok=await run(lesson.id,drill.solution,drill.id);assert(ok.ok&&ok.passed,where+': a solução não passou: '+JSON.stringify(ok.problems||ok.error));
   assert.equal(ok.checks.action,true,where+': o treino não deve exigir a ação do caso');
   const start=await run(lesson.id,drill.starter,drill.id);assert(!start.passed,where+': o início já passa sem trabalho');
   if(drill.variants?.length&&Object.keys(drill.expected).length){
    const fake=drill.starter+'\n'+Object.entries(drill.expected).map(([name,value])=>'const '+name+' = '+JSON.stringify(value)+';').join('\n')+'\nconsole.log('+Object.keys(drill.expected).join(', ')+');';
    assert(!(await run(lesson.id,fake,drill.id)).passed,where+': escrever o resultado pronto não pode passar');
   }
   assert(!drill.solution.includes(lesson.action.name),where+': treino não deve chamar a ação do caso');
  }
 }
 // Fora do modo treino, o caso continua exigindo a ação.
 const plain=await run(1,lessons[0].solution.replace(/abrirPorta\(senha\);?/,''));assert(!plain.passed&&plain.problems.some(p=>p.includes('abrirPorta')));
 const unknown=await run(1,'console.log(1)','t9');assert(!unknown.ok&&/treino/.test(unknown.error.message));
 console.log(total+' treinos extras conferidos nos 24 casos: solução passa, início não passa, resultado pronto não passa, sem ação do cenário.');
})().catch(e=>{console.error(e);process.exit(1)});
