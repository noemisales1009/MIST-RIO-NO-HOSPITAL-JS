const fs=require('fs'),vm=require('vm'),assert=require('assert'),root=require('path').join(__dirname,'../');
// Sincronização com o Supabase: o código digitado vai para a nuvem, inclusive nos casos reescritos (chave com versão).
(async()=>{
 const uid='3f2a9c1e-8b7d-4e6f-9a0b-1c2d3e4f5a6b',sent=[];
 class Storage{constructor(){this.data={};}setItem(key,value){this.data[key]=String(value);}getItem(key){return this.data[key]??null;}}
 const client={from:table=>({upsert:async rows=>{sent.push({table,rows});return{error:null};}})};
 const window={HospitalAuth:{mode:'nuvem',client},HospitalProfileReady:Promise.resolve({id:uid,name:'Teste'}),addEventListener(){}};
 const localStorage=new Storage();window.localStorage=localStorage;
 const context={window,Storage,localStorage,document:{querySelectorAll:()=>[],addEventListener(){}},navigator:{onLine:true},setTimeout:(fn,ms)=>setTimeout(fn,ms>=1500?5:ms),clearTimeout,AbortController,Date,JSON,Map,Set,Promise};
 vm.runInNewContext(fs.readFileSync(root+'sync.js','utf8'),context);
 await new Promise(r=>setTimeout(r,5));
 localStorage.setItem('hospital-code:'+uid+':7:v2','const jonasCedo = horaJonas < 6;');
 localStorage.setItem('hospital-code:'+uid+':3','const setor = "Arquivos";');
 localStorage.setItem('hospital-attempts:'+uid+':7:v2','2');
 localStorage.setItem('hospital-tutorial:'+uid,'done');
 // Modos de treino (código próprio) e progresso dos treinos também vão como "codigo": a tabela só aceita nota, config e codigo.
 localStorage.setItem('hospital-code:'+uid+':7:v2:zero','const horaJonas = 2;');
 localStorage.setItem('hospital-code:'+uid+':7:v2:t1','const febre = temperatura > 37.5;');
 localStorage.setItem('hospital-code:'+uid+':7:v2:treino','["zero","t1"]');
 localStorage.setItem('hospital-code:'+uid+':7:v2:Invalido','x');
 await new Promise(r=>setTimeout(r,60));
 const rows=sent.flatMap(batch=>batch.rows);
 assert(sent.every(batch=>batch.table==='hospital_dados'));
 assert.deepEqual(rows.map(row=>row.chave).sort(),['3','7:v2','7:v2:t1','7:v2:treino','7:v2:zero'],'Só o código digitado sincroniza, inclusive com versão e modo de treino');
 assert(rows.every(row=>/^[A-Za-z0-9_.:-]{1,120}$/.test(row.chave)),'Toda chave respeita a regra da tabela');
 assert(rows.every(row=>row.tipo==='codigo'&&row.user_id===uid));
 assert.equal(rows.find(row=>row.chave==='7:v2').valor,'const jonasCedo = horaJonas < 6;');
 assert(/^[A-Za-z0-9_.:-]{1,120}$/.test('7:v2'),'A chave com versão respeita a regra da tabela');
 console.log('Sincronização: código digitado enviado à tabela hospital_dados, inclusive dos casos reescritos (7:v2); tentativas e guia ficam só no aparelho.');
})().catch(e=>{console.error(e);process.exit(1)});
