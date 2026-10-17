const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'../public/');
class Element{constructor(){this.dataset={};this.hidden=false;this.textContent='';this.innerHTML='';}}
const casesContext={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'cases.js'),'utf8'),casesContext);
const cases=casesContext.window.HospitalCases;
assert.equal(cases.length,24);
const illustrations=new Set(),looks=[];
for(const item of cases){
 const elements=new Map(),get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
 const win={...casesContext.window,HospitalWalkableArea:null};
 const context={window:win,HospitalCases:cases,document:{title:'',body:{dataset:{case:String(item.id)}},getElementById:get}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'case-bootstrap.js'),'utf8'),context);
 const svg=get('case-scene').innerHTML;
 const focus=item.sceneFocus;
 assert(focus.label,'Cada fase precisa identificar sua pista visual');
 assert(focus.x>=100&&focus.x<=660,'A pista deve ficar dentro da área caminhável');
 assert(focus.y>=80&&focus.y<=230,'A pista deve permanecer na área dos móveis');
 assert(svg.includes(`viewBox="0 0 760 428"`),'O cenário precisa escalar em telas menores');
 assert(svg.includes(`transform="translate(${focus.x} ${focus.y})"`),'A marca visual deve corresponder à fase');
 assert(svg.includes(focus.label.toUpperCase()),'O objeto investigado deve estar identificado');
 const art=svg.match(/<g class="scene-clue-art">([\s\S]*?)<\/g>/);
 assert(art,`A fase ${item.id} precisa mostrar sua pista ilustrada`);
 illustrations.add(art[1]);
 looks.push(item.room+'|'+win.HospitalSceneVariant.name);
 assert(svg.includes('id="detective-position" transform="translate(194 348)"'),'A detetive deve começar ancorada ao piso');
 assert(svg.includes('id="detective-idle" href="assets/detective-v2.png" x="-48" y="-125" width="97" height="129"'),'A escala proporcional da detetive deve permanecer igual entre fases');
 assert.deepEqual(win.HospitalWalkableArea,{minX:84,maxX:678,minY:302,maxY:369});
}
assert.equal(illustrations.size,24,'As 24 fases devem ter ilustrações próprias');
assert.equal(new Set(cases.map(item=>item.location)).size,24,'Cada fase precisa de um local diferente');
assert.equal(new Set(looks).size,24,'Cada fase precisa de ângulo e iluminação diferentes');
console.log('24 cenários responsivos verificados: pista visual única por fase, foco caminhável e detetive em escala e posição consistentes.');
