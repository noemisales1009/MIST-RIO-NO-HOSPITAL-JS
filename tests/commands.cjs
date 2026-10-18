const fs=require('fs'),vm=require('vm'),assert=require('assert'),root=require('path').join(__dirname,'../');const c={};vm.runInNewContext(fs.readFileSync(root+'lessons.js','utf8'),c);const lessons=c.HospitalLessons;
async function run(phase,code,extra={}){let result;const context={self:{postMessage:data=>result=data},importScripts:()=>context.HospitalLessons=lessons};vm.runInNewContext(fs.readFileSync(root+'worker.js','utf8'),context);await context.self.onmessage({data:{phase,code,context:{title:'Ocorrência de teste',description:'História da ocorrência',location:'Arquivos',reveal:'Registro recuperado'},...extra}});return result;}
(async()=>{
 const noAction=await run(1,'const senha="4271"; console.log(senha);');assert(!noAction.passed);assert(noAction.problems.some(text=>text.includes('abrirPorta')));
 const orderedAction=await run(1,'lerOcorrencia();\n'+lessons[0].solution);assert.equal(orderedAction.commands.at(-1).kind,'action');
 const wrongArgument=await run(1,'const senha="4271"; console.log(senha); abrirPorta("0000");');assert(!wrongArgument.passed);assert.equal(wrongArgument.actions.length,0);
 const occurrence=await run(1,'lerOcorrencia();');assert(occurrence.ok);assert.equal(occurrence.commands[0].kind,'occurrence');assert.equal(occurrence.commands[0].body,'História da ocorrência');assert(!occurrence.passed);
 const fichas=[{id:'maya',name:'Maya',role:'Gestão',badge:'GES-01',statement:'Registro'}];
 const readThenFicha=await run(1,'lerOcorrencia(); conferirFicha("Maya");',{fichas});assert.equal(readThenFicha.commands.at(-1).kind,'ficha');
 const fichaThenRead=await run(1,'conferirFicha("Maya"); lerOcorrencia();',{fichas});assert.equal(fichaThenRead.commands.at(-1).kind,'occurrence');
 const object=await run(1,'examinarObjeto("terminal");');assert.equal(object.commands[0].kind,'object');assert(object.commands[0].body.includes('4271'));
 assert(!(await run(1,'examinarObjeto("inexistente");')).ok);
 const note=await run(1,'anotar("A senha é um texto");');assert.equal(note.commands[0].kind,'note');assert.equal(note.commands[0].body,'A senha é um texto');
 const earlyCollect=await run(1,'coletarPista();',{preview:true});assert.equal(earlyCollect.commands[0].kind,'notice');
 const collected=await run(1,lessons[0].solution+'\ncoletarPista();');assert.equal(collected.commands.at(-1).kind,'collect');
 const previewCollect=await run(1,lessons[0].solution+'\ncoletarPista();',{preview:true});assert.equal(previewCollect.commands.at(-1).kind,'notice');
 const conclusionFichas=[{id:'person-1',name:'João',badge:'GES-01'},{id:'person-2',name:'Maya',badge:'GES-02'}];
 const conclusionContext={canCollect:true,culpritId:'person-1'};
 const lockedConclusion=await run(1,'concluirCaso("João");',{fichas:conclusionFichas,preview:true});assert.equal(lockedConclusion.commands.at(-1).kind,'notice');
 const wrongConclusion=await run(1,'concluirCaso("Maya");',{fichas:conclusionFichas,context:conclusionContext,preview:true});assert.equal(wrongConclusion.commands.at(-1).correct,false);
 const correctConclusion=await run(1,'const pessoa="JOAO"; concluirCaso(pessoa);',{fichas:conclusionFichas,context:conclusionContext,preview:true});assert.equal(correctConclusion.commands.at(-1).kind,'conclusion');assert.equal(correctConclusion.commands.at(-1).correct,true);assert.equal(correctConclusion.commands.at(-1).personId,'person-1');
 assert(!(await run(1,'concluirCaso("Outra pessoa");',{fichas:conclusionFichas,context:conclusionContext})).ok);
 const together=await run(1,lessons[0].solution+'\nconcluirCaso("João");',{fichas:conclusionFichas,context:{culpritId:'person-1'}});assert(together.passed);assert(together.commands.at(-1).correct);
 const castContext={window:{}};vm.runInNewContext(fs.readFileSync(root+'cases.js','utf8'),castContext);
 assert.equal(new Set(castContext.window.HospitalCases.map(item=>item.analysis.question)).size,24);
 assert.equal(new Set(castContext.window.HospitalCases.map(item=>item.analysis.explanation)).size,24);
 const lockedAnalysis=await run(1,'analisarPistas();',{context:{reveal:'NÃO MOSTRAR'},preview:true});assert.equal(lockedAnalysis.commands.at(-1).kind,'notice');assert(!JSON.stringify(lockedAnalysis).includes('NÃO MOSTRAR'));
 for(const item of castContext.window.HospitalCases){const analyzed=await run(item.id,'const analise=analisarPistas();console.log(analise.registro);',{context:{canCollect:true,reveal:item.reveal,analysis:item.analysis},preview:true});assert.equal(analyzed.commands.at(-1).kind,'analysis');assert(analyzed.commands.at(-1).body.includes(item.analysis.question));assert(analyzed.commands.at(-1).body.includes(item.analysis.compare));assert.equal(analyzed.logs[0],item.reveal);assert(!analyzed.commands.at(-1).body.includes(item.analysis.explanation),'Desfecho não deve aparecer na análise do caso '+item.id);}
 for(const item of castContext.window.HospitalCases){const people=castContext.window.HospitalCast.filter(p=>item.suspects.includes(p.id)),culprit=people.find(p=>p.id===item.culprit);const checked=await run(item.id,'concluirCaso('+JSON.stringify(culprit.name)+');',{fichas:people,context:{canCollect:true,culpritId:item.culprit},preview:true});assert(checked.commands.at(-1).correct,'Conclusão do caso '+item.id);}
 for(const lesson of lessons){const result=await run(lesson.id,lesson.solution);assert(result.passed,'Ação do caso '+lesson.id);assert.equal(result.actions.length,1);assert.equal(result.actions[0].name,lesson.action.name);assert.deepEqual(JSON.parse(JSON.stringify(result.data)),JSON.parse(JSON.stringify(lesson.expected)));}
 console.log('Comandos: ler, examinar, anotar, coletar e 24 ações com argumentos verificados; dados corretos sem ação não concluem o desafio.');
})().catch(error=>{console.error(error);process.exit(1)});
