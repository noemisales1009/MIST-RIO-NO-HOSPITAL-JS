'use strict';
(()=>{
  const id=Number(document.body.dataset.case)||1;
  const item=HospitalCases.find(entry=>entry.id===id)||HospitalCases[0];
  window.HospitalActiveCase=item;
  const $=id=>document.getElementById(id),escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  document.title=item.title+' · Mistério no Hospital JS';
  $('case-breadcrumb-name').textContent='Caso '+String(id).padStart(2,'0')+' · '+item.title;
  $('case-number-label').textContent='CASO '+String(id).padStart(2,'0')+' DE 24 · '+item.level.toUpperCase();
  $('case-page-title').textContent=item.title;$('case-page-description').textContent=item.description;$('case-topic-label').textContent=item.topic;$('case-location').textContent=item.location.toUpperCase();$('board-case-label').textContent='CASO '+String(id).padStart(2,'0')+' · '+item.title.toUpperCase();
  $('dom-practice').hidden=id!==23;$('supabase-practice').hidden=id!==24;
  const rooms=['arquivos','tecnica','recepcao','laboratorio','farmacia','gestao'];
  const index=Math.max(0,rooms.indexOf(item.room)),column=index%3,row=Math.floor(index/3);
  // Cada fase ganha espelhamento e iluminação próprios; sem zoom, para a detetive manter a proporção do ambiente.
  // A regra fica em cases.js, compartilhada com as fotos das pastas da tela inicial.
  const variant=window.HospitalSceneVariantFor(item);
  window.HospitalSceneVariant=variant;
  const zoom=variant.zoom,panX=(760-760/zoom)*variant.pan,panY=400-400/zoom;
  item.sceneFocus=window.HospitalSceneFocusFor(item,variant);
  const focus=item.sceneFocus;
  // Efeito ambiente coerente com a sala: telas varrendo em técnica/laboratório, luz da janela nas demais e poeira no ar em todas.
  const motes=[0,1,2,3,4].map(n=>`<circle class="scene-mote" cx="${90+((id*97+n*131)%580)}" cy="${120+((id*53+n*47)%160)}" r="${1.4+n%2*.8}" style="animation-delay:${-(n*2.3+id%3)}s"/>`).join('');
  const roomEffect=(['tecnica','laboratorio'].includes(item.room)
    ?'<rect class="scene-screen-scan" y="-6" width="760" height="6"/>'
    :'<rect class="scene-window-light" x="30" y="0" width="150" height="300" fill="#fff3c5"/>')+motes;
  const sceneClues={
    1:'<rect x="-17" y="-17" width="34" height="34" rx="4" fill="#e9dfbd" stroke="#536d52" stroke-width="2"/><rect x="-11" y="-11" width="22" height="6" rx="1" fill="#263f32"/><g fill="#617958"><circle cx="-7" cy="2" r="2"/><circle cy="2" r="2"/><circle cx="7" cy="2" r="2"/><circle cx="-7" cy="9" r="2"/><circle cy="9" r="2"/><circle cx="7" cy="9" r="2"/></g>',
    2:'<rect x="-16" y="-17" width="32" height="34" rx="5" fill="#526d58" stroke="#e3d6ac" stroke-width="2"/><rect x="-10" y="-10" width="14" height="8" rx="1" fill="#1c3229"/><path d="M-10 3h18m-18 5h13M8-12l7-9" stroke="#e3d6ac" stroke-width="2"/><circle cx="9" cy="10" r="4" fill="#d3b878"/>',
    3:'<path d="M-15-18h20l10 10v26h-30z" fill="#f5edcf" stroke="#827e61" stroke-width="2"/><path d="M5-18v10h10m-23 2h12m-12 6h19m-19 6h13" fill="none" stroke="#859179" stroke-width="2"/><circle cx="8" cy="12" r="3" fill="#c27b5e"/>',
    4:'<path d="M-18-13h36v26h-36z" rx="2" fill="#f7efce" stroke="#85886a" stroke-width="2"/><path d="M-11-7v14m4-14v14m4-14v14m5-14v14m4-14v14m5-14v14" stroke="#455d43" stroke-width="2"/><path d="M-13 10h26" stroke="#c58d59" stroke-width="2"/>',
    5:'<rect x="-18" y="-15" width="36" height="30" rx="3" fill="#789078" stroke="#405d49" stroke-width="2"/><path d="M-14-5h28v16h-28z" fill="#c4cba6" stroke="#637b5c" stroke-width="2"/><rect x="-5" y="0" width="10" height="3" rx="1" fill="#536c50"/><path d="M-12-10h24" stroke="#eadcae" stroke-width="2"/>',
    6:'<path d="M-15-18h25l6 6v30h-31z" fill="#f2ebd1" stroke="#76836d" stroke-width="2"/><path d="M10-18v7h6m-25 1h17m-17 6h17m-17 6h17" stroke="#9c9d7b" stroke-width="2"/><path d="M-8 11l5-5 4 2 6-7" fill="none" stroke="#ad7655" stroke-width="2"/>',
    7:'<circle r="17" fill="#eee4c3" stroke="#8c7454" stroke-width="3"/><path d="M0-12v12l9 5" fill="none" stroke="#4d634a" stroke-width="2.5" stroke-linecap="round"/><path d="M-12-15l-4-4m28 4 4-4" stroke="#c4785b" stroke-width="3"/><circle cx="10" cy="10" r="3" fill="#c4785b"/>',
    8:'<rect x="-13" y="-19" width="26" height="38" rx="5" fill="#567663" stroke="#e8ddb5" stroke-width="2"/><rect x="-8" y="-12" width="16" height="11" rx="2" fill="#1d332a"/><circle cy="8" r="4" fill="#c9a45d"/><path d="M-7 14h14" stroke="#e8ddb5" stroke-width="2"/>',
    9:'<path d="M-17-13h34v26h-34z" rx="3" fill="#eadfbe" stroke="#756d54" stroke-width="2"/><circle cx="-8" cy="-4" r="4" fill="#8a9f7c"/><path d="M0-6h11m-11 6h8" stroke="#73826a" stroke-width="2"/><circle cx="10" cy="9" r="8" fill="#a95f4d"/><path d="M6 5l8 8m0-8l-8 8" stroke="#fff0d4" stroke-width="2"/>',
    10:'<rect x="-18" y="-16" width="36" height="32" rx="3" fill="#f0e8cc" stroke="#75816a" stroke-width="2"/><path d="M-18-7h36M-7-15v8m14-8v8" stroke="#75816a" stroke-width="2"/><g fill="#78916f"><rect x="-12" y="-2" width="7" height="5"/><rect x="0" y="-2" width="7" height="5"/><rect x="-12" y="7" width="7" height="5"/></g><path d="M3 9l4 4 7-9" fill="none" stroke="#b27552" stroke-width="2"/>',
    11:'<path d="M-16-17h32v34h-32z" rx="4" fill="#d9dec1" stroke="#58715a" stroke-width="2"/><circle cx="-5" cy="-6" r="5" fill="#829578"/><path d="M-12 5q7-9 14 0m4-10h7m-7 6h7m-22 9h22" fill="none" stroke="#58715a" stroke-width="2"/><path d="M10-17v7h7" fill="#e5d9b7"/>',
    12:'<path d="M0-19l16 6v11q0 12-16 21Q-16 10-16-2v-11z" fill="#e5e6ca" stroke="#55705a" stroke-width="2"/><path d="M-9-2l6 6 12-13m-18 17l5 5 8-8" fill="none" stroke="#71916c" stroke-width="2.5"/>',
    13:'<path d="M-18-10h36v9h-36zm0 12h36v9h-36z" rx="4" fill="#d8b875" stroke="#f3ebca" stroke-width="2"/><path d="M-10-10v9m9-9v9m9-9v9m-8 5v9m9-9v9" stroke="#8c7250" stroke-width="1.5"/><circle cx="13" cy="-5" r="2" fill="#a96551"/>',
    14:'<circle cx="-7" cy="-5" r="8" fill="none" stroke="#d5b66b" stroke-width="4"/><path d="M0 0l15 15m-5-5l5-5m-1 11l5-5" stroke="#d5b66b" stroke-width="4" stroke-linecap="round"/><circle cx="-7" cy="-5" r="2" fill="#fff0c4"/>',
    15:'<path d="M-17-15h34v30h-34z" fill="#eee7cd" stroke="#75816c" stroke-width="2"/><path d="M-10-8h17v8h-11v9h15" fill="none" stroke="#6d8b67" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-10" cy="-8" r="3" fill="#bf865b"/><circle cx="11" cy="9" r="3" fill="#bf865b"/><path d="M6 5l5 4-5 4" fill="none" stroke="#bf865b" stroke-width="2"/>',
    16:'<path d="M-18-15h36v30h-36z" fill="#617b5d" stroke="#e3d6ae" stroke-width="2"/><path d="M-14-5h28m-28 12h28" stroke="#d5d3ac" stroke-width="2"/><rect x="-12" y="-12" width="9" height="6" fill="#d9ba7a"/><rect x="3" y="-12" width="9" height="6" fill="#d9ba7a"/><path d="M-9 1h8v8h-8z" fill="none" stroke="#e1d7b6" stroke-width="2"/><path d="M5 2l7 7m0-7l-7 7" stroke="#bd795d" stroke-width="2"/>',
    17:'<path d="M-16-18h24l8 8v28h-32z" fill="#f4edcf" stroke="#7a8068" stroke-width="2"/><path d="M8-18v8h8m-25 3h17m-17 6h13m-13 6h10" stroke="#8c997d" stroke-width="2"/><path d="M-2 1l4 4-6 5 4 4" fill="none" stroke="#b9745b" stroke-width="2.5"/>',
    18:'<rect x="-19" y="-14" width="25" height="29" rx="3" fill="#e4dcc0" stroke="#74806a" stroke-width="2"/><rect x="-6" y="-18" width="25" height="29" rx="3" fill="#f2e9cb" stroke="#74806a" stroke-width="2"/><circle cx="-11" cy="-7" r="3" fill="#889678"/><circle cx="2" cy="-11" r="3" fill="#889678"/><path d="M-3 3h12m-22 8h12m-2 0h12" stroke="#71816b" stroke-width="2"/>',
    19:'<rect x="-18" y="-15" width="36" height="30" rx="3" fill="#728b70" stroke="#405b48" stroke-width="2"/><path d="M-13-7h26v18h-26z" fill="#b4c29c" stroke="#d6d4ad" stroke-width="2"/><rect x="-4" y="-1" width="8" height="3" rx="1" fill="#506b50"/><circle cx="12" cy="-10" r="5" fill="#d0b46e"/><path d="M12-5v8m0-3h4" stroke="#d0b46e" stroke-width="2"/>',
    20:'<rect x="-17" y="-17" width="34" height="34" rx="5" fill="#536f60" stroke="#e1d6b2" stroke-width="2"/><circle r="10" fill="#1e342a" stroke="#bac59b" stroke-width="2"/><path d="M0 0l7-6m-7-9v4m15 11h-4m-11 15v-4" stroke="#e2c779" stroke-width="2.5" stroke-linecap="round"/><circle r="2.5" fill="#c17b5c"/>',
    21:'<path d="M-14-18h20l8 8v28h-28z" fill="#eae4ca" stroke="#687a67" stroke-width="2"/><path d="M6-18v8h8m-22 1l-4 3 4 3m16-6l4 3-4 3m-8-5l-3 7" fill="none" stroke="#68805e" stroke-width="2"/>',
    22:'<path d="M-18-11h36v25h-36z" fill="#d8c99f" stroke="#7b8268" stroke-width="2"/><path d="M-18-10L0 3l18-13" fill="#eee5c8" stroke="#7b8268" stroke-width="2"/><circle cx="12" cy="-12" r="8" fill="#e8dfc0" stroke="#b97b59" stroke-width="2"/><path d="M12-17v5l3 2" fill="none" stroke="#576f58" stroke-width="1.8"/>',
    23:'<rect x="-19" y="-15" width="38" height="28" rx="3" fill="#647f6d" stroke="#e0d7b4" stroke-width="2"/><rect x="-14" y="-10" width="28" height="17" rx="1" fill="#1d332a"/><path d="M-10 0l5-5 5 7 5-6 5 4" fill="none" stroke="#d5be79" stroke-width="2"/><path d="M-8 18h16m-8-5v5" stroke="#84927a" stroke-width="3"/>',
    24:'<ellipse cy="-12" rx="17" ry="6" fill="#e6ddbd" stroke="#657e66" stroke-width="2"/><path d="M-17-12v21c0 8 34 8 34 0v-21m-34 10c0 8 34 8 34 0m-34 1c0 8 34 8 34 0" fill="#d9d2b1" stroke="#657e66" stroke-width="2"/><path d="M-8-11v24m8-25v26m8-25v24" stroke="#94a17f" stroke-width="1"/>'
  };
  // Todas as salas reservam o corredor da frente para a personagem.
  window.HospitalWalkableArea={minX:84,maxX:678,minY:302,maxY:369};
  $('case-scene').innerHTML=`<svg id="investigation-room" viewBox="0 0 760 428" role="img" aria-labelledby="room-title room-description">
    <title id="room-title">${escape(item.location)} · ${escape(item.title)}</title>
    <desc id="room-description">Investigue ${escape(focus.label)}. A detetive avança até o objeto quando o JavaScript do desafio é executado corretamente. O caminho fica no piso livre, em frente aos móveis.</desc>
    <defs><clipPath id="room-crop"><rect width="760" height="400"/></clipPath><linearGradient id="scene-floor-shade" x2="0" y2="1"><stop stop-color="#182f2700"/><stop offset="1" stop-color="#182f27" stop-opacity=".22"/></linearGradient><radialGradient id="foot-shadow"><stop stop-color="#1b2619" stop-opacity=".42"/><stop offset="1" stop-color="#1b2619" stop-opacity="0"/></radialGradient><radialGradient id="scene-focus-glow"><stop stop-color="#f5e7a5" stop-opacity=".64"/><stop offset="1" stop-color="#f5e7a5" stop-opacity="0"/></radialGradient></defs>
    <g clip-path="url(#room-crop)" aria-hidden="true"><g transform="${variant.flip?'translate(760 0) scale(-1 1)':''}"><svg width="760" height="400" viewBox="${column*760+panX} ${row*400+panY} ${760/zoom} ${400/zoom}" preserveAspectRatio="none" overflow="hidden"><image href="assets/rooms-v2.png" width="2280" height="800" preserveAspectRatio="none" style="filter:${variant.filter}"/></svg></g><rect class="scene-ambient ambient-${variant.key}" width="760" height="400" fill="${variant.wash}" opacity="${variant.alpha}"/>${roomEffect}</g>
    <rect y="240" width="760" height="160" fill="url(#scene-floor-shade)" pointer-events="none"/>
    <g class="scene-focus-marker" style="--focus-speed:${(2.2+(id%5)*.35).toFixed(2)}s;--focus-delay:${(id%4)*.3}s;--focus-color:${['#f5e7a5','#ffd08a','#a8e6ff','#c9f2b5','#ffb7a0','#e3c7ff'][id%6]}" transform="translate(${focus.x} ${focus.y})" aria-hidden="true"><circle class="scene-focus-glow" r="30" fill="url(#scene-focus-glow)"/><circle class="scene-focus-ring" r="27" fill="none" stroke="#f5e7a5" stroke-width="1.5"/><g class="scene-clue-art">${sceneClues[id]}</g><path d="M0-32v4m0 56v4m-32-32h4m56 0h4" stroke="#fff3c5" stroke-width="2"/><g transform="translate(0 -42)"><rect x="-59" y="-10" width="118" height="20" rx="10" fill="#203b33" fill-opacity=".94"/><circle cx="-47" r="2.5" fill="#e8d990"/><text x="2" y="3" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" letter-spacing=".5" fill="#fff8df">${escape(focus.label.toUpperCase())}</text></g></g>
    <g id="walk-target" opacity="0" pointer-events="none"><ellipse rx="14" ry="5" fill="none" stroke="#f1dfad" stroke-width="1.5"/><circle r="2" fill="#f1dfad"/></g>
    <g id="detective-position" transform="translate(194 348)" pointer-events="none"><ellipse id="detective-shadow" cy="1" rx="27" ry="8" fill="url(#foot-shadow)"/>
      <g id="detective-depth"><g id="detective-facing">
        <image id="detective-idle" href="assets/detective-v2.png" x="-48" y="-125" width="97" height="129"/>
        <g id="detective-walk" opacity="0" transform="scale(.25)"><image id="detective-walk-sheet" x="-192" y="-490" width="384" height="512"/></g>
      </g></g>
    </g>
    <rect y="400" width="760" height="28" fill="#243b33"/><text x="18" y="418" font-family="sans-serif" font-size="10" letter-spacing="1.4" fill="#e1dcc5">${escape(item.location.toUpperCase())}</text><text x="741" y="418" text-anchor="end" font-family="monospace" font-size="10" fill="#c2c9b5">CASO ${String(id).padStart(2,'0')}</text>
  </svg>`;
})();
