const fs=require('fs'),vm=require('vm'),assert=require('assert');
function harness(reducedMotion=false){
 let now=0,nextId=1;const frames=new Map(),els=new Map(),draws=[];let canvasId=0;
 function element(){return{attrs:{},listeners:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.listeners[k]=f;}};}
 for(const id of ['investigation-room','detective-position','detective-depth','detective-facing','detective-shadow','detective-walk','detective-idle','walk-target','detective-walk-sheet','detective-frame-clip'])els.set(id,element());
 const win=element(),doc={getElementById:id=>els.get(id),addEventListener(){},createElement(name){assert.equal(name,'canvas');const id=canvasId++;return{getContext:()=>({drawImage(...args){draws.push(args.slice(1))}}),toDataURL:()=>`data:image/png;base64,frame${id}`};}};
 const ctx={window:win,document:doc,Image:class{set src(value){this.onload?.()}},matchMedia:()=>({matches:reducedMotion,addEventListener(){}}),performance:{now:()=>now},requestAnimationFrame:f=>{const id=nextId++;frames.set(id,f);return id;},cancelAnimationFrame:id=>frames.delete(id),Math,Number};
 vm.runInNewContext(fs.readFileSync(__dirname+'/../movement.js','utf8'),ctx);
 const read=()=>els.get('detective-position').attrs.transform.match(/translate\(([-.\d]+) ([-.\d]+)\)/).slice(1).map(Number);
 function tick(ms=1000/60){now+=ms;const list=[...frames.values()];frames.clear();for(const f of list)f(now);const scale=Number(els.get('detective-depth').attrs.transform.match(/scale\(([^)]+)\)/)[1]);assert(scale>=1.84&&scale<=2.041);const [x,y]=read();assert(x>=84&&x<=678&&y>=302&&y<=369);return[x,y];}
 return{win,els,frames,read,tick,draws};
}
const h=harness();assert.equal(h.draws.length,8);for(let i=0;i<8;i++)assert.deepEqual(h.draws[i],[i%4*384,Math.floor(i/4)*512,384,512,0,0,384,512]);let prior=h.read(),distances=[],poses=new Set();
h.win.HospitalWalk(650,360);
for(let i=0;i<30;i++){const next=h.tick(),distance=Math.hypot(next[0]-prior[0],next[1]-prior[1]);distances.push(distance);assert(distance<=104/60+.01);prior=next;}
assert(distances[0]<distances[10]/3,'A partida deve acelerar suavemente');
assert.equal(h.els.get('detective-idle').attrs.opacity,'0');assert.equal(h.els.get('detective-walk').attrs.opacity,'1');
for(const [x,y]of [[1000,1000],[-500,-500],[375,358],[200,345]]){h.win.HospitalWalk(x,y);for(let i=0;i<650;i++){h.tick();if(h.els.get('detective-walk').attrs.opacity==='1')poses.add(h.els.get('detective-walk-sheet').attrs.href);}assert.equal(h.frames.size,0);assert(Math.hypot(h.read()[0]-Math.max(84,Math.min(678,x)),h.read()[1]-Math.max(302,Math.min(369,y)))<1);}
assert.equal(poses.size,8,'Oito poses devem aparecer durante o percurso');assert.equal(h.els.get('detective-idle').attrs.opacity,'1');assert.equal(h.els.get('detective-walk').attrs.opacity,'0');
assert.equal(h.els.get('detective-facing').attrs.transform,'scale(-1 1)');
h.win.HospitalWalk(NaN,100);assert.equal(h.frames.size,0);
assert.equal(h.els.get('investigation-room').listeners.click,undefined);assert.equal(h.els.get('investigation-room').listeners.keydown,undefined);
h.win.HospitalResetPosition();assert.deepEqual(h.read(),[194,348]);assert.equal(h.frames.size,0);
const reduced=harness(true);reduced.win.HospitalWalk(300,330);assert.deepEqual(reduced.read(),[300,330]);assert.equal(reduced.frames.size,0);
// Mesma distância em taxas de atualização diferentes.
const hz30=harness(),hz120=harness();hz30.win.HospitalWalk(650,350);hz120.win.HospitalWalk(650,350);for(let i=0;i<30;i++)hz30.tick(1000/30);for(let i=0;i<120;i++)hz120.tick(1000/120);assert(Math.hypot(hz30.read()[0]-hz120.read()[0],hz30.read()[1]-hz120.read()[1])<1);
console.log('Caminhada: aceleração e parada suaves, oito imagens independentes sem poses vizinhas, direção, limites, acionamento programático e reinício, movimento reduzido e telas de 30/120 Hz verificados.');
(async()=>{
 const arrival=harness(),trip=arrival.win.HospitalWalk(300,330);assert(trip&&typeof trip.then==='function','A caminhada deve avisar quando chegar');for(let i=0;i<650;i++)arrival.tick();
 await Promise.race([trip,new Promise((_,reject)=>setTimeout(()=>reject(new Error('A chegada não liberou a ação do objeto')),40))]);
 const cancelled=arrival.win.HospitalWalk(600,350);arrival.win.HospitalResetPosition();await cancelled;
 const instant=harness(true);await instant.win.HospitalWalk(300,330);
 console.log('Chegada da caminhada libera a ação seguinte; reinício e movimento reduzido resolvem a sequência.');
})().catch(error=>{console.error(error);process.exit(1)});
