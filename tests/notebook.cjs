const fs=require('fs'),vm=require('vm'),assert=require('assert'),{webcrypto}=require('crypto');
const stores={notes:new Map(),settings:new Map()};let exportedBlob;
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.style={};this.dataset={};this.listeners={};this.attrs={};this.value='';this.textContent='';this.disabled=false;this.className='';this.hidden=false;this.clientWidth=780;this.clientHeight=650;this.offsetWidth=160;this.offsetHeight=200;this.classList={add:c=>{},remove:c=>{},toggle:c=>{}};}
 append(...children){this.children.push(...children)}replaceChildren(...children){this.children=[...children]}
 setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]||''}removeAttribute(k){delete this.attrs[k]}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}dispatch(type,event={}){for(const fn of this.listeners[type]||[])fn({target:this,preventDefault(){},...event})}
 querySelectorAll(selector){return this.children.filter(e=>e.className?.split(' ').includes(selector.slice(1)))}
 showModal(){this.open=true}close(){this.open=false;this.dispatch('close')}focus(){}scrollIntoView(){}click(){this.dispatch('click')}remove(){}setPointerCapture(){}hasPointerCapture(){return false}releasePointerCapture(){}
 get offsetLeft(){return parseFloat(this.style.left||0)*7.8}get offsetTop(){return parseFloat(this.style.top||0)}
}
const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)};
function tx(names){const t={error:null};t.objectStore=name=>({put(value){stores[name].set(value.id,structuredClone(value));setTimeout(()=>t.oncomplete?.(),0)},get(id){const r={};setTimeout(()=>{r.result=structuredClone(stores[name].get(id));r.onsuccess?.()},0);return r},getAll(){const r={};setTimeout(()=>{r.result=[...stores[name].values()].map(item=>structuredClone(item));r.onsuccess?.()},0);return r}});return t}
const db={transaction:tx,close(){}};const requestOpen=()=>{const r={};setTimeout(()=>{r.result=db;r.onsuccess?.()},0);return r};
const doc={getElementById:get,createElement:tag=>new Element(tag),createElementNS:(_,tag)=>new Element(tag),querySelectorAll:()=>[],addEventListener(){},body:new Element()};
const win=new Element();win.HospitalStorageReady=Promise.resolve({dbName:'misterio-hospital-js-caderno:teste',user:{id:'teste',name:'Noemi Sales'},completed:[]});win.dispatchEvent=event=>win.dispatch(event.type,{detail:event.detail});const context={CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail;}},document:doc,window:win,indexedDB:{open:requestOpen},setTimeout,clearTimeout,structuredClone,Map,Set,Date,Math,Number,JSON,Blob,URL:{createObjectURL:blob=>{exportedBlob=blob;return 'blob:test'},revokeObjectURL(){}},crypto:webcrypto,requestAnimationFrame:fn=>{setTimeout(fn,0);return 1},FileReader:class{readAsDataURL(){this.result='data:image/png;base64,AA==';setTimeout(()=>this.onload(),0)}}};
let code=fs.readFileSync(__dirname+'/../public/notebook.js','utf8');code=code.replace('  (async()=>{',"  window.test={validateBackup,importNotebook,exportNotebook,discover,markComplete,addPhotos,flush,current,caseRecord,touch,read:()=>({records,found,completed,solvedCases,ready,boardPositions})};\n  (async()=>{");
doc.body.dataset.case='1';
vm.runInNewContext(fs.readFileSync(__dirname+'/../public/cases.js','utf8'),context);
vm.runInNewContext(fs.readFileSync(__dirname+'/../public/lessons.js','utf8'),context);
vm.runInNewContext(code,context);const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await wait(30);const t=win.test;assert(t.read().ready);assert.equal(t.read().found.size,1);assert.equal(get('case-folders').children.length,24);assert.equal(get('cheat-list').children.length,24);assert.equal(get('cheat-list').children[0].className,'cheat-available');assert.equal(get('cheat-list').children[23].className,'cheat-locked');get('tab-cheats').click();assert(!get('cheats-page').hidden);assert(get('notes-page').hidden);assert.equal(get('cheat-game-commands').children.length,8);
t.discover('computador');t.discover('computador');assert.equal(t.read().found.size,2);await t.markComplete(2);assert.equal(get('cheat-list').children[1].className,'cheat-available');
t.caseRecord().pins.push('Guardar texto entre aspas');t.touch(t.caseRecord());await t.flush();assert.equal(stores.notes.get('case-1').pins.length,1);
assert(await t.addPhotos([{name:'captura.png',size:1,type:'image/png'}],'case-1'));assert.equal(stores.notes.get('case-1').photos.length,1);
assert.equal(await t.addPhotos([{name:'arquivo.svg',size:1,type:'image/svg+xml'}],'case-1'),false);
await t.markComplete(1);assert(t.read().found.has('case-1-solution'));assert(stores.settings.get('progress').completed.includes(1));
win.dispatchEvent(new context.CustomEvent('hospital-case-solved',{detail:{case:1}}));await t.exportNotebook();const backup=JSON.parse(await exportedBlob.text());assert.equal(backup.entries.find(x=>x.id==='case-1').photos.length,1);assert(backup.board.found.includes('case-1-object'));t.validateBackup(backup);assert(backup.solvedCases.includes(1));assert(backup.board.found.includes('case-1-conclusion'));
t.validateBackup({...backup,entries:[{id:'case-24',text:'último caso',pins:[],photos:[]}]});const before=t.caseRecord().photos.length;await t.importNotebook({size:100,text:async()=>JSON.stringify(backup)});assert.equal(t.caseRecord().photos.length,before);assert.equal(t.caseRecord().pins.length,1);assert(stores.settings.get('cases-solved').cases.includes(1));
const invalid=structuredClone(backup);invalid.entries[0].id='bad-id';assert.throws(()=>t.validateBackup(invalid));
const badImage=structuredClone(backup);badImage.entries.find(e=>e.photos.length).photos[0].data='data:text/html;base64,AA==';assert.throws(()=>t.validateBackup(badImage));
console.log('Verificados: inicialização, descoberta sem duplicar pistas, salvamento de post-it e foto, progresso, exportação completa, restauração sem duplicações e rejeição de cópias inválidas.');
process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
