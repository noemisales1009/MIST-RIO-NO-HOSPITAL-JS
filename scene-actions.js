'use strict';
(()=>{
 const $=id=>document.getElementById(id),item=window.HospitalActiveCase,lesson=HospitalLessons.find(l=>l.case===item.id),action=lesson.action;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=null,version=0;
 const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const screen=()=>'<rect x="38" y="29" width="224" height="140" rx="9" fill="#526f61"/><rect x="49" y="40" width="202" height="112" rx="3" fill="#142c24"/><path d="M150 170v25m-45 0h90" stroke="#80927a" stroke-width="10"/><g class="device-before"><text x="150" y="88" text-anchor="middle" fill="#d6b16f" font-size="14">AGUARDANDO DADOS</text><path d="M78 114h144" stroke="#556f52" stroke-width="5"/></g><g class="device-after"><path d="M119 91l21 22 45-48" fill="none" stroke="#b6db91" stroke-width="9"/><text x="150" y="139" text-anchor="middle" fill="#d1e4a9" font-size="13">DADOS APLICADOS</text></g>';
 function graphic(type){
  const objects={
   door:'<rect x="79" y="12" width="142" height="194" rx="4" fill="#7b8e73"/><rect x="91" y="23" width="118" height="176" fill="#20382b"/><g fill="#a9b894"><rect x="102" y="50" width="95" height="9"/><rect x="102" y="97" width="95" height="9"/><rect x="102" y="144" width="95" height="9"/></g><g transform="translate(91 23)"><g class="door-leaf"><rect width="118" height="176" fill="#bda477" stroke="#e2cca0" stroke-width="3"/><rect x="15" y="15" width="87" height="58" fill="#819b84"/><rect x="87" y="101" width="21" height="39" rx="3" fill="#405c49"/><circle class="device-led" cx="97" cy="111" r="5"/><path d="M20 93h43m-43 12h43" stroke="#968363" stroke-width="3"/></g></g><path d="M73 208h156" stroke="#759076" stroke-width="5"/>',
   radio:'<rect x="35" y="64" width="230" height="120" rx="12" fill="#586f5b" stroke="#a5b895" stroke-width="4"/><path d="M230 62l20-48" stroke="#688574" stroke-width="6"/><circle cx="94" cy="123" r="42" fill="#203b31"/><g stroke="#78916b" stroke-width="3"><path d="M65 106h58m-65 12h72m-72 12h72m-65 12h58"/></g><rect x="158" y="86" width="79" height="31" rx="3" fill="#152e25"/><circle class="device-led" cx="174" cy="101" r="5"/><circle cx="181" cy="151" r="17" fill="#b5be8f"/><circle cx="226" cy="151" r="10" fill="#c8b77e"/><g class="device-after" fill="none" stroke="#cbdc99" stroke-width="4"><path d="M143 24q22 13 0 26m14-35q38 24 0 46"/></g>',
   file:'<path d="M67 18h117l49 47v133H67z" fill="#f6edd0" stroke="#b7b990" stroke-width="3"/><path d="M184 18v47h49" fill="#dfd5b0"/><g stroke="#a8b395" stroke-width="5"><path d="M91 90h116m-116 20h100m-100 20h111"/></g><g class="device-before" stroke="#af8161" stroke-width="5"><path d="M94 151l84 29m-84 0l84-29"/></g><g class="device-after"><circle cx="157" cy="162" r="26" fill="#d4e3af"/><path d="M143 161l10 11 22-25" stroke="#4c794e" stroke-width="5" fill="none"/></g>',
   printer:'<rect x="48" y="73" width="204" height="98" rx="8" fill="#738a76"/><rect x="83" y="24" width="134" height="63" fill="#f2e9cc"/><rect x="75" y="116" width="150" height="21" fill="#233d32"/><g class="paper-feed"><rect x="88" y="125" width="124" height="63" rx="2" fill="#f7e8b3"/><path d="M105 143h88m-88 12h70" stroke="#9fa882" stroke-width="4"/></g><circle class="device-led" cx="227" cy="94" r="5"/>',
   drawer:'<rect x="55" y="36" width="190" height="155" rx="5" fill="#708571"/><rect x="66" y="49" width="168" height="64" fill="#aec09a"/><rect x="126" y="74" width="49" height="11" rx="3" fill="#657b5c"/><rect x="66" y="122" width="168" height="60" fill="#314b3c"/><g class="drawer-front"><rect x="66" y="121" width="168" height="60" fill="#aec09a" stroke="#cbd1a8" stroke-width="3"/><rect x="126" y="145" width="49" height="11" rx="3" fill="#657b5c"/></g><g class="device-after"><rect x="96" y="123" width="109" height="41" fill="#f5e8bb"/><path d="M110 135h78m-78 11h55" stroke="#a5ad8a" stroke-width="3"/></g>',
   reader:'<rect x="93" y="22" width="114" height="176" rx="10" fill="#486757"/><rect x="106" y="40" width="88" height="54" fill="#172f25"/><circle class="device-led" cx="150" cy="66" r="12"/><path d="M108 125h85" stroke="#213c2c" stroke-width="12"/><g class="scan-card"><rect x="63" y="120" width="114" height="65" rx="6" fill="#ede1b4" stroke="#bcbb91" stroke-width="2"/><circle cx="85" cy="143" r="10" fill="#89a485"/><path d="M104 140h55m-55 13h38" stroke="#8b9c77" stroke-width="5"/></g>',
   alarm:'<circle cx="150" cy="109" r="80" fill="#e6ddbc" stroke="#718970" stroke-width="10"/><path d="M150 49v60l41-24" stroke="#50684d" stroke-width="7" fill="none" stroke-linecap="round"/><g class="device-before" stroke="#bd8460" stroke-width="5"><path d="M55 45L38 31m207 14l17-14"/></g><g class="device-after"><circle cx="209" cy="164" r="28" fill="#cdddac"/><path d="M193 163l11 11 22-25" stroke="#4d7a4a" stroke-width="5" fill="none"/></g>',
   key:'<rect x="49" y="29" width="203" height="167" rx="5" fill="#5e795f"/><path d="M65 73h171m-171 43h171m-171 43h171" stroke="#9eaf83" stroke-width="3"/><g class="device-after" fill="none" stroke="#e9c875" stroke-width="10"><circle cx="145" cy="82" r="25"/><path d="M145 108v65m0-18h23m-23-16h18"/></g>',
   route:'<rect x="35" y="25" width="230" height="168" rx="5" fill="#e5ddbd"/><path d="M73 73h83v71h72" stroke="#a8b193" stroke-width="9" fill="none"/><path class="route-line" d="M73 73h83v71h72" stroke="#60835e" stroke-width="9" fill="none" pathLength="1"/><g fill="#8a9f77"><circle cx="73" cy="73" r="14"/><circle cx="156" cy="73" r="14"/><circle cx="156" cy="144" r="14"/><circle cx="228" cy="144" r="14"/></g>',
   stock:'<rect x="40" y="27" width="220" height="166" rx="5" fill="#6e896c"/>'+[0,1,2,3].map((v)=>`<g transform="translate(${62+v%2*103} ${46+Math.floor(v/2)*77})"><rect width="70" height="55" fill="${v%2?'#d9d4b0':'#324f3b'}" stroke="#b7c09b" stroke-width="3"/><text x="35" y="35" text-anchor="middle" font-size="23" fill="${v%2?'#71835c':'#e7c783'}">${v%2?'4':'0'}</text></g>`).join(''),
   sensor:screen(),monitor:screen(),table:screen(),
   message:'<rect x="44" y="59" width="212" height="123" rx="6" fill="#cfbd8a" stroke="#9da780" stroke-width="3"/><path d="M44 59l106 74L256 59" fill="#e6d8ac" stroke="#9da780" stroke-width="3"/><g class="device-after"><rect x="78" y="24" width="144" height="96" fill="#faf0d1"/><path d="M99 47h101m-101 20h101m-101 20h73" stroke="#94a680" stroke-width="5"/></g>'
  };
  return `<svg viewBox="0 0 300 220" role="img" aria-label="${escape(action.title)}"><ellipse cx="150" cy="203" rx="111" ry="10" fill="#c0cab0"/>${objects[type]||objects.file}</svg>`;
 }
 function setState(state){$('action-stage').setAttribute('data-state',state);$('action-progress').textContent=state==='walking'?'1 · Código certo → 2 · Indo ao objeto':state==='working'?'2 · '+action.title+'…':'3 · Pista revelada';}
 function finish(){
  if(!current)return;const pending=current;current=null;window.HospitalInteraction?.finish();
  setState('complete');$('action-title').textContent=action.title;$('action-intro').textContent=action.description;$('action-record').hidden=false;$('action-record-text').textContent=item.reveal;$('action-next').hidden=false;$('close-action').textContent='Voltar ao computador';
  pending.resolve();
 }
 function play(){
  if(current)finish();const token=++version;window.HospitalInteraction?.reset();
  setState('walking');$('action-title').textContent='Seu código está agindo no caso';$('action-intro').textContent='A detetive vai até '+action.object+' para aplicar os dados do seu JavaScript.';$('action-record').hidden=true;$('action-next').hidden=true;$('close-action').textContent='Mostrar a pista agora';
  $('action-stage').append($('investigation-room'));if(!$('action-dialog').open)$('action-dialog').showModal();
  const promise=new Promise(resolve=>{current={resolve};});
  (async()=>{try{
   await window.HospitalWalk?.(item.sceneFocus.x,350);
   if(token!==version||!current)return;
   setState('working');$('action-intro').textContent='Aplicando os dados: '+lesson.action.name+'('+lesson.action.args.join(', ')+').';
   if(window.HospitalInteraction)await window.HospitalInteraction.play(graphic(action.type),action.type);else if(!reduced.matches)await new Promise(resolve=>setTimeout(resolve,950));
  }catch{}finally{if(token===version)finish();}})();
  return promise;
 }
 $('action-dialog').addEventListener('close',()=>{finish();});
 $('action-next').addEventListener('click',()=>{$('action-dialog').close();const person=window.HospitalCast.find(p=>p.id===item.suspects[0]);if(person)window.HospitalConsultByCode?.(person.name);});
 window.HospitalCaseAction={play,restore(){setState('complete');},reset(){version++;finish();window.HospitalInteraction?.reset();setState('waiting');}};
})();
