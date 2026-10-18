const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path'),root=path.join(__dirname,'../');
const lessonsContext={};vm.runInNewContext(fs.readFileSync(root+'lessons.js','utf8'),lessonsContext);const lessons=lessonsContext.HospitalLessons;
class E{constructor(){this.value='';this.textContent='';this.listeners={};this.attrs={};this.children=[];this.open=false;this.hidden=false;this.classList={add(){},remove(){}};this.summary=null;}addEventListener(type,fn){(this.listeners[type]??=[]).push(fn)}emit(type,event={}){let prevented=false;for(const fn of this.listeners[type]||[])fn({preventDefault(){prevented=true},...event});return prevented;}setAttribute(k,v){this.attrs[k]=v}removeAttribute(k){delete this.attrs[k]}append(...items){this.children.push(...items)}replaceChildren(...items){this.children=[...items]}before(...items){this.inserted=items}querySelector(selector){if(selector!=='summary')return null;return this.summary??=new E();}showModal(){this.open=true}close(){this.open=false;this.emit('close')}focus(){}setSelectionRange(){}scrollIntoView(){}}
async function setup({completed=[],stored={}}={}){
 const elements=new Map(),get=id=>{if(!elements.has(id))elements.set(id,new E());return elements.get(id);},saved={...stored};
 const win={HospitalActiveCase:{id:1,reveal:'Registro de teste',culprit:'p',suspects:['p']},HospitalCast:[{id:'p',name:'Maya',badge:'GES-01',role:'Gestora',statement:'Teste'}],HospitalStorageReady:Promise.resolve({user:{id:'teste'},completed}),addEventListener(){},dispatchEvent(){}};
 class Worker{postMessage(data){const worker=this;queueMicrotask(async()=>{if(worker.stopped)return;const c={self:{postMessage:result=>{if(!worker.stopped)worker.onmessage?.({data:result})}},importScripts:()=>{c.HospitalLessons=lessons}};vm.runInNewContext(fs.readFileSync(root+'worker.js','utf8'),c);await c.self.onmessage({data});});}terminate(){this.stopped=true;}}
 const context={document:{getElementById:get,createElement:()=>new E()},window:win,HospitalLessons:lessons,Worker,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail;}},localStorage:{getItem:key=>saved[key]??null,setItem:(key,value)=>{saved[key]=value}},setTimeout:(fn,ms)=>setTimeout(fn,ms===550?1:ms),clearTimeout};
 vm.runInNewContext(fs.readFileSync(root+'app.js','utf8'),context);await new Promise(r=>setTimeout(r,30));return{get,saved};
}
const wait=()=>new Promise(r=>setTimeout(r,60));
(async()=>{
 const {get,saved}=await setup(),lesson=lessons[0];
 const concept=get('hint').inserted?.[1];assert(concept,'A dica de conceito é criada antes da dica 2');assert.equal(concept.children[1].textContent,lesson.conceptHint);
 assert.equal(get('hint').attrs['data-locked'],'true');assert.equal(get('solution').attrs['data-locked'],'true');assert(get('hint').hidden&&get('solution').hidden,'Dicas 2 e 3 só aparecem depois de tentativas');assert.equal(get('hint-content').textContent,'');assert.equal(get('solution-code').textContent,'');
 assert(get('hint').summary.emit('click'),'A dica 2 bloqueada não abre');
 get('use-solution').emit('click');assert.equal(get('code').value,lesson.starter,'A solução bloqueada não é inserida');
 get('run').emit('click');await wait();
 assert.equal(get('hint').attrs['data-locked'],'false');assert(!get('hint').hidden);assert.equal(get('hint-content').textContent,lesson.hint);assert.equal(get('solution').attrs['data-locked'],'true');assert(get('solution').hidden);assert(!get('hint').summary.emit('click'),'A dica 2 abre depois da primeira tentativa');
 assert.equal(saved['hospital-attempts:teste:1'],'1');
 get('run').emit('click');await wait();
 assert.equal(get('solution').attrs['data-locked'],'false');assert.equal(get('solution-code').textContent,lesson.solution);
 get('use-solution').emit('click');assert.equal(get('code').value,lesson.solution);
 // As tentativas ficam guardadas. Acertar de primeira não mostra a dica 2 nem a solução.
 const again=await setup({stored:{'hospital-attempts:teste:1':'1'}});assert.equal(again.get('hint').attrs['data-locked'],'false');assert.equal(again.get('solution').attrs['data-locked'],'true');
 const done=await setup({completed:[1]});assert(done.get('hint').hidden&&done.get('solution').hidden,'Caso resolvido sem erros não revela as dicas');
 const first=await setup();first.get('code').value=lesson.solution;first.get('run').emit('click');await wait();assert(first.get('hint').hidden&&first.get('solution').hidden,'Acertar de primeira não libera dicas');
 // Pasta concluída: foto da pessoa identificada com o carimbo.
 class L{constructor(){this.children=[];this.attrs={};this.listeners={};this.hidden=false;}append(...c){this.children.push(...c)}setAttribute(k,v){this.attrs[k]=v}removeAttribute(k){delete this.attrs[k]}addEventListener(k,fn){this.listeners[k]=fn}}
 const lobbyElements=new Map(),lobbyGet=id=>{if(!lobbyElements.has(id))lobbyElements.set(id,new L());return lobbyElements.get(id)},lobbyWin={HospitalStorageReady:Promise.resolve({completed:[1,2],solvedCases:[1]}),addEventListener(){}},lc={window:lobbyWin,document:{getElementById:lobbyGet,createElement:()=>new L()}};
 vm.runInNewContext(fs.readFileSync(root+'cases.js','utf8'),lc);lc.HospitalCases=lobbyWin.HospitalCases;vm.runInNewContext(fs.readFileSync(root+'lobby.js','utf8'),lc);await new Promise(r=>setTimeout(r,5));
 const cards=lobbyGet('lobby-cases').children,find=(card,cls)=>card.children.find(child=>child.className===cls);
 const solvedPhoto=find(cards[0],'folder-culprit');assert.equal(cards[0].attrs['data-solved'],'true');assert(!solvedPhoto.hidden);
 const figure=solvedPhoto.children[0],culprit=lobbyWin.HospitalCast.find(p=>p.id===lobbyWin.HospitalCases[0].culprit);
 assert.equal(figure.className,'culprit-photo');assert.equal(figure.children.find(c=>c.className==='culprit-stamp').textContent,'CULPADO');assert.equal(figure.children.at(-1).textContent,culprit.name);assert.equal(figure.children[0].children[0].src,culprit.portrait.sheet);
 assert(find(cards[1],'folder-culprit').hidden,'Caso sem conclusão não mostra foto');assert.equal(find(cards[1],'folder-culprit').children.length,0);
 console.log('Dicas: conceito aberto, dica 2 após a primeira tentativa, solução após a segunda, dicas escondidas até lá, tentativas guardadas e acerto de primeira sem revelar a solução. Pasta concluída com foto e carimbo CULPADO verificada.');
})().catch(error=>{console.error(error);process.exit(1)});
