'use strict';
(() => {
  const byId = id => document.getElementById(id);
  const cases = window.HospitalCases;
  let dbName;
  const contextCase=Number(document.body.dataset.case)||1;
  const dataFormat = 'hospital-js-notebook';
  const records = new Map();
  let db, selected = 'general', saveTimer, queue = Promise.resolve(), ready = false;
  let dirty = new Set(), completed = new Set(), solvedCases = new Set();
  const supportedImage = /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=\r\n]+$/;
  const evidenceCatalog = {};
  const legacyEvidence={bilhete:'case-1-clue',computador:'case-1-object',porta:'case-1-object',relatorio:'case-1-solution','c1-senha':'case-1-solution','c1-acesso':'case-2-solution','c1-ficha':'case-3-solution','c1-tipos':'case-4-solution','c1-etiqueta':'case-5-solution','c1-relatorio':'case-6-solution','c2-horario':'case-7-solution','c2-autorizacao':'case-8-solution','c2-negado':'case-9-solution','c2-turno':'case-10-solution','c2-cargo':'case-11-solution','c2-relatorio':'case-12-solution','c2-terminal':'case-12-object','c2-porta':'case-12-object','c2-conclusao':'case-12-conclusion'};
  const canonicalEvidence=id=>legacyEvidence[id]||id;
  for(const item of cases){
    const lesson=HospitalLessons.find(lesson=>lesson.case===item.id);
    const base={case:item.id,lesson:lesson.explainSolution};
    evidenceCatalog['case-'+item.id+'-clue']={...base,title:'A pista: '+item.title,tag:'PISTA DA OCORRÊNCIA',description:lesson.clue,picture:'note'};
    evidenceCatalog['case-'+item.id+'-object']={...base,title:'Objeto examinado · '+item.location,tag:'OBJETO EXAMINADO',description:item.description,picture:'computer'};
    evidenceCatalog[lesson.evidence]={...base,title:'O registro recuperado',tag:'EVIDÊNCIA CONFIRMADA',description:item.reveal+' Análise: '+item.analysis.question+' '+item.analysis.compare,picture:'report'};
    const person=window.HospitalCast.find(person=>person.id===item.culprit);
    evidenceCatalog['case-'+item.id+'-conclusion']={...base,title:'Conclusão · '+person.name,tag:'CASO CONCLUÍDO',description:item.deduction==='codigo'?item.reveal+' '+item.analysis.explanation:item.reveal+' O identificador pertence a '+person.name+', '+person.role+'. '+item.analysis.explanation,picture:'report'};
  }
  let found = new Set(['case-'+contextCase+'-clue']), boardPositions = {}, activePage = 'board', boardDrag = null;
  function caseRecord() {
    if(!records.has('case-'+contextCase))records.set('case-'+contextCase,defaultRecord('case-'+contextCase));
    return records.get('case-'+contextCase);
  }
  function evidenceForCase(id){return evidenceCatalog[id]?.case===contextCase;}
  function boardMessage(text) { byId('board-message').textContent=text; }
  function showPage(name) {
    activePage=name;
    for(const page of ['board','notes','folders','cheats']) {
      byId(page+'-page').hidden=page!==name;
      byId('tab-'+page).setAttribute('aria-pressed',String(page===name));
    }
    if(name==='board')requestAnimationFrame(renderBoard);
    if(name==='folders')renderFolders();
    if(name==='cheats')renderCheats();
  }
  function openFile(page) { showPage(page); byId('notebook-dialog').showModal();if(page==='board')requestAnimationFrame(renderBoard); }
  function serializeBoard() { return {id:'board',found:[...found],positions:structuredClone(boardPositions)}; }
  function persistBoard() {
    if(!ready)return;
    const snapshot=serializeBoard();
    queue=queue.catch(()=>{}).then(async()=>{
      const tx=db.transaction('settings','readwrite');tx.objectStore('settings').put(snapshot);await transactionDone(tx);
    }).catch(()=>{state('Quadro não salvo',true);boardMessage('Não foi possível salvar o quadro. Baixe uma cópia do arquivo para guardá-lo.');});
  }
  function discover(id) {
    id=canonicalEvidence(id);
    if(!evidenceCatalog[id]||found.has(id))return;
    found.add(id);persistBoard();renderBoard();renderFolders();
    byId('evidence-count').textContent=[...found].filter(evidenceForCase).length;
    const button=byId('open-evidence-board');button.classList.remove('new-evidence');void button.offsetWidth;button.classList.add('new-evidence');
  }
  function picture(kind) {
    const illustrations={
      note:'<rect x="30" y="24" width="150" height="100" rx="3" fill="#f4df9d" transform="rotate(-5 100 75)"/><path d="M52 45h103m-103 10h80" stroke="#b8a66f" stroke-width="2"/><text x="107" y="97" font-family="monospace" font-size="24" text-anchor="middle" fill="#5c6542">PISTA</text>',
      computer:'<rect x="29" y="23" width="152" height="91" rx="7" fill="#485a50"/><rect x="37" y="31" width="136" height="70" rx="2" fill="#203d30"/><text x="48" y="64" font-family="monospace" font-size="11" fill="#dee8b9">registro.js</text><path d="M90 114v14m-21 0h53" stroke="#7c9280" stroke-width="8"/>',
      door:'<rect x="43" y="14" width="125" height="127" fill="#749780"/><rect x="63" y="25" width="86" height="116" fill="#c4a871"/><rect x="74" y="39" width="63" height="39" fill="#b8cfb1"/><rect x="124" y="88" width="13" height="24" rx="2" fill="#55745a"/><circle cx="130" cy="94" r="2" fill="#e4c878"/><text x="106" y="63" text-anchor="middle" font-size="9" font-family="sans-serif" fill="#36573f">ARQUIVOS</text>',
      report:'<rect x="48" y="12" width="113" height="128" rx="3" fill="#f5f1d8"/><path d="M68 41h72m-72 14h50m-50 14h61" stroke="#acb89a" stroke-width="3"/><circle cx="106" cy="104" r="21" fill="#d9e7c5"/><path d="M94 104l8 9 16-19" stroke="#567e48" stroke-width="4" fill="none"/>'
    };
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="210" height="150" viewBox="0 0 210 150"><rect width="210" height="150" fill="#c7d6c1"/>'+illustrations[kind]+'</svg>');
  }
  function pinId(text) {let hash=0;for(const char of text)hash=((hash<<5)-hash+char.charCodeAt(0))|0;return 'postit-'+(hash>>>0);}
  function updateThreads() {
    const svg=byId('board-threads'),board=byId('evidence-board');svg.replaceChildren();
    svg.setAttribute('viewBox',`0 0 ${board.clientWidth||780} ${board.clientHeight||650}`);
    const cards=[...byId('board-cards').querySelectorAll('.evidence-card')];
    for(let i=1;i<cards.length;i++) {
      const first=cards[i-1],second=cards[i],line=document.createElementNS('http://www.w3.org/2000/svg','line');
      for(const [attribute,value]of Object.entries({x1:first.offsetLeft+first.offsetWidth/2,y1:first.offsetTop+10,x2:second.offsetLeft+second.offsetWidth/2,y2:second.offsetTop+10,stroke:'#9c4d3b','stroke-width':1.5,opacity:.7}))line.setAttribute(attribute,String(value));
      svg.append(line);
    }
  }
  function makeDraggable(card,key) {
    function move(event) {
      if(!boardDrag||boardDrag.key!==key)return;
      const board=byId('evidence-board'),x=Math.max(8,Math.min(board.clientWidth-card.offsetWidth-8,boardDrag.left+event.clientX-boardDrag.x));
      const y=Math.max(16,Math.min(board.clientHeight-card.offsetHeight-12,boardDrag.top+event.clientY-boardDrag.y));
      card.style.left=x/board.clientWidth*100+'%';card.style.top=y+'px';
      boardPositions[key]={x:x/board.clientWidth*100,y};updateThreads();
    }
    function stop(event) {
      if(!boardDrag||boardDrag.key!==key)return;
      if(card.hasPointerCapture(event.pointerId))card.releasePointerCapture(event.pointerId);
      boardDrag=null;card.classList.remove('dragging');persistBoard();
    }
    card.addEventListener('pointerdown',event=>{
      if(event.button!==0||event.target.closest('button,input,textarea'))return;
      boardDrag={key,x:event.clientX,y:event.clientY,left:card.offsetLeft,top:card.offsetTop};
      card.setPointerCapture(event.pointerId);card.classList.add('dragging');event.preventDefault();
    });
    card.addEventListener('pointermove',move);card.addEventListener('pointerup',stop);card.addEventListener('pointercancel',stop);
    card.tabIndex=0;card.setAttribute('aria-label',card.getAttribute('aria-label')+' · Use as setas para mover esta ficha');
    card.addEventListener('keydown',event=>{
      if(event.target!==card||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();const dx=event.key==='ArrowLeft'?-12:event.key==='ArrowRight'?12:0,dy=event.key==='ArrowUp'?-12:event.key==='ArrowDown'?12:0;
      const board=byId('evidence-board'),x=Math.max(8,Math.min(board.clientWidth-card.offsetWidth-8,card.offsetLeft+dx)),y=Math.max(16,Math.min(board.clientHeight-card.offsetHeight-12,card.offsetTop+dy));
      card.style.left=x/board.clientWidth*100+'%';card.style.top=y+'px';boardPositions[key]={x:x/board.clientWidth*100,y};updateThreads();persistBoard();
    });
  }
  function renderBoard() {
    byId('evidence-count').textContent=[...found].filter(evidenceForCase).length;
    const container=byId('board-cards');container.replaceChildren();
    const entries=[...found].filter(id=>evidenceCatalog[id]&&evidenceForCase(id)).map(id=>({key:'evidence-'+id,type:'evidence',...evidenceCatalog[id]}));
    const record=caseRecord();
    entries.push(...record.pins.map(text=>({key:'case-'+contextCase+'-'+pinId(text),type:'postit',text})),...record.photos.map(photo=>({key:'photo-'+photo.id,type:'photo',photo})));
    const board=byId('evidence-board');board.style.height=Math.max(650,Math.ceil(entries.length/4)*245+50)+'px';
    entries.forEach((item,index)=>{
      const card=document.createElement('article');card.className='board-card '+(item.type==='postit'?'postit-card':item.type==='photo'?'polaroid-card':'evidence-card');
      card.dataset.key=item.key;card.setAttribute('aria-label',item.title||item.text||item.photo.name);
      const position=boardPositions[item.key]||{x:3+(index%4)*24,y:30+Math.floor(index/4)*245};
      card.style.left=Math.max(1,Math.min(76,position.x))+'%';card.style.top=Math.max(16,Math.min(parseInt(board.style.height)-210,position.y))+'px';
      const pin=document.createElement('span');pin.className='board-pin';pin.setAttribute('aria-hidden','true');card.append(pin);
      if(item.type==='evidence') {
        const image=document.createElement('img'),tag=document.createElement('small'),title=document.createElement('h4'),description=document.createElement('p'),button=document.createElement('button');
        image.src=picture(item.picture);image.alt='Ilustração da pista: '+item.title;image.draggable=false;
        tag.textContent=item.tag;title.textContent=item.title;description.textContent=item.description;
        button.textContent='Examinar ficha ↗';button.type='button';button.className='board-examine';
        button.addEventListener('click',()=>{byId('evidence-detail-title').textContent=item.title;byId('evidence-detail-image').src=picture(item.picture);byId('evidence-detail-image').alt=item.title;byId('evidence-detail-description').textContent=item.description;byId('evidence-detail-learning').textContent=item.lesson;byId('evidence-detail').showModal();});
        card.append(image,tag,title,description,button);
      }else if(item.type==='postit') {
        const text=document.createElement('p');text.textContent=item.text;
        const remove=document.createElement('button');remove.className='board-remove';remove.type='button';remove.textContent='Remover';
        remove.addEventListener('click',()=>{const entry=caseRecord();entry.pins=entry.pins.filter(pin=>pin!==item.text);touch(entry);renderBoard();if(selected==='case-'+contextCase)renderEntry();});
        card.append(text,remove);
      }else{
        const image=document.createElement('img'),name=document.createElement('p'),remove=document.createElement('button');image.src=item.photo.data;image.alt=item.photo.name;image.draggable=false;name.textContent=item.photo.name;
        remove.textContent='Remover';remove.type='button';remove.className='board-remove';remove.addEventListener('click',()=>{const entry=caseRecord();entry.photos=entry.photos.filter(p=>p.id!==item.photo.id);touch(entry);renderBoard();if(selected==='case-'+contextCase)renderEntry();});
        const view=document.createElement('button');view.type='button';view.className='board-examine';view.textContent='Ampliar foto';view.addEventListener('click',()=>{byId('photo-view').src=item.photo.data;byId('photo-view').alt=item.photo.name;byId('photo-caption').textContent=item.photo.name;byId('photo-dialog').showModal();});
        card.append(image,name,view,remove);
      }
      container.append(card);makeDraggable(card,item.key);
    });
    requestAnimationFrame(updateThreads);
  }
  function renderFolders() {
    const container=byId('case-folders');container.replaceChildren();
    cases.forEach((item,index)=>{
      const button=document.createElement('a');button.href='caso'+(index+1)+'.html';button.className='case-folder';
      const label=document.createElement('small'),title=document.createElement('strong'),status=document.createElement('span');
      label.textContent='PASTA '+String(index+1).padStart(2,'0');title.textContent=item.title;status.textContent=solvedCases.has(item.id)?'✓ Caso concluído':completed.has(item.id)?'Registro recuperado · falta a conclusão':'Disponível para investigar';button.append(label,title,status);
      if(solvedCases.has(item.id)&&window.HospitalCulpritPhoto){button.setAttribute('data-solved','true');button.append(window.HospitalCulpritPhoto(item));}
      container.append(button);
    });
  }
  function showDossier(index) {
    const target=byId('case-dossier'),item=cases[index];target.replaceChildren();target.hidden=false;
    const title=document.createElement('h3'),description=document.createElement('p'),learning=document.createElement('p');
    title.textContent='Caso '+item.id+' · '+item.title;description.textContent=item.description;learning.textContent='Você vai praticar: '+item.topic+'.';target.append(title,description,learning);
    const list=document.createElement('ul');for(const id of found){if(evidenceCatalog[id]?.case!==item.id)continue;const li=document.createElement('li');li.textContent=evidenceCatalog[id].title;list.append(li);}target.append(list);
    if(item.id===contextCase){const open=document.createElement('button');open.type='button';open.className='small-button';open.textContent='Abrir quadro desta investigação →';open.addEventListener('click',()=>showPage('board'));target.append(open);}
    target.scrollIntoView({block:'nearest',behavior:'auto'});
  }

  function defaultRecord(id) { return {id, text:'', pins:[], photos:[], updatedAt:null}; }
  function current() { if (!records.has(selected)) records.set(selected, defaultRecord(selected)); return records.get(selected); }
  function message(text, error = false) {
    byId('notebook-message').textContent = text;
    byId('notebook-message').className = error ? 'notebook-error' : 'notebook-notice';
  }
  function state(text, error = false) {
    byId('note-save-state').textContent = text;
    byId('note-save-state').classList.toggle('save-error', error);
  }
  function requestResult(request) {
    return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
  }
  function transactionDone(tx) {
    return new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('Gravação cancelada.')); });
  }
  async function openDatabase() {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('notes', {keyPath:'id'});
      request.result.createObjectStore('settings', {keyPath:'id'});
    };
    return requestResult(request);
  }
  function saveRecord(entry) {
    const snapshot = structuredClone(entry);
    dirty.add(entry.id);
    state('Salvando…');
    queue = queue.catch(() => {}).then(async () => {
      const tx = db.transaction('notes','readwrite');
      tx.objectStore('notes').put(snapshot);
      await transactionDone(tx);
      // Uma versão mais nova pode ter sido digitada durante a gravação.
      if (records.get(snapshot.id)?.updatedAt === snapshot.updatedAt) dirty.delete(snapshot.id);
      if (!dirty.size) state('✓ Salvo neste navegador');
    }).catch(() => {
      state('Não foi possível salvar', true);
      message('O navegador não conseguiu gravar. Seu conteúdo continua aberto: baixe uma cópia para guardá-lo. Talvez o armazenamento esteja cheio.', true);
    });
    return queue;
  }
  function touch(entry = current()) {
    entry.updatedAt = new Date().toISOString();
    dirty.add(entry.id);
    state('Salvando…');
    clearTimeout(saveTimer);
    const id = entry.id;
    saveTimer = setTimeout(() => { saveRecord(records.get(id)); }, 450);
    updateMeta();
  }
  function flush() {
    clearTimeout(saveTimer);
    for (const id of dirty) saveRecord(records.get(id));
    return queue;
  }
  function updateMeta() {
    const entry = current();
    byId('note-count').textContent = `${entry.text.length.toLocaleString('pt-BR')} caracteres`;
    byId('note-updated').textContent = entry.updatedAt ? 'Última alteração: ' + new Date(entry.updatedAt).toLocaleString('pt-BR') : 'Seu espaço de descobertas.';
  }
  function renderPins() {
    const list = byId('pin-list'); list.replaceChildren();
    current().pins.forEach((text,index) => {
      const li = document.createElement('li'), content = document.createElement('span'), remove = document.createElement('button');
      content.textContent = text;
      remove.textContent = 'Remover'; remove.type='button'; remove.className='remove-note-item';
      remove.setAttribute('aria-label','Remover pista: '+text.slice(0,70));
      remove.addEventListener('click', () => { current().pins.splice(index,1); touch(); renderPins();if(selected==='case-'+contextCase)renderBoard(); });
      li.append(content,remove); list.append(li);
    });
  }
  function renderPhotos() {
    const grid = byId('photo-grid'); grid.replaceChildren();
    if (!current().photos.length) {
      const empty=document.createElement('p'); empty.className='photo-empty'; empty.textContent='Ainda sem fotos. Você pode começar com um print da sua primeira missão.'; grid.append(empty); return;
    }
    for (const photo of current().photos) {
      const card=document.createElement('figure'), button=document.createElement('button'), image=document.createElement('img'), caption=document.createElement('figcaption'), remove=document.createElement('button');
      card.className='photo-card'; button.className='photo-preview'; button.type='button'; button.setAttribute('aria-label','Ampliar '+photo.name);
      image.src=photo.data; image.alt=photo.name; image.loading='lazy'; button.append(image);
      button.addEventListener('click', () => {
        byId('photo-view').src=photo.data; byId('photo-view').alt=photo.name;
        byId('photo-caption').textContent=photo.name; byId('photo-view-title').textContent='Foto do caderno'; byId('photo-dialog').showModal();
      });
      const name=document.createElement('span'); name.textContent=photo.name; name.title=photo.name;
      remove.textContent='Remover'; remove.type='button'; remove.className='remove-note-item'; remove.setAttribute('aria-label','Remover foto '+photo.name);
      remove.addEventListener('click', () => { const entry=current(); entry.photos=entry.photos.filter(p=>p.id!==photo.id);touch();renderPhotos();if(selected==='case-'+contextCase)renderBoard(); });
      caption.append(name,remove); card.append(button,caption); grid.append(card);
    }
  }
  function renderEntry() {
    byId('note-text').value=current().text; byId('pin-input').value='';
    renderPhotos();renderPins();updateMeta();
  }
  function download(name,blob) {
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  async function exportNotebook() {
    await flush();
    const payload={format:dataFormat,version:1,exportedAt:new Date().toISOString(),completed:[...completed],solvedCases:[...solvedCases],board:serializeBoard(),entries:[...records.values()]};
    download('meu-caderno-javascript-'+new Date().toISOString().slice(0,10)+'.json',new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    message('Cópia completa preparada: ela inclui os textos, as fotos, as pistas e as desafios e as conclusões. Guarde o arquivo JSON para restaurá-lo depois.');
  }
  function readFile(file) {
    return new Promise((resolve,reject)=>{ const reader=new FileReader(); reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Não foi possível ler a imagem.'));reader.readAsDataURL(file); });
  }
  async function addPhotos(files, destination = selected) {
    const entry=records.get(destination)||defaultRecord(destination);
    records.set(destination,entry);
    if (entry.photos.length+files.length>20) { message('Você pode guardar até 20 fotos por anotação. Escolha menos imagens ou use outro caso.',true);return false; }
    const allowed=['image/jpeg','image/png','image/webp','image/gif'];
    for(const file of files) {
      if(!allowed.includes(file.type)) { message('Escolha imagens JPG, PNG, WebP ou GIF.',true);return false; }
      if(file.size>6*1024*1024) { message(`A imagem ${file.name} tem mais de 6 MB. Escolha uma versão menor.`,true);return false; }
    }
    const used=[...records.values()].reduce((total,note)=>total+note.photos.reduce((sum,photo)=>sum+photo.data.length,0),0);
    if(used+files.reduce((sum,file)=>sum+Math.ceil(file.size*4/3)+100,0)>60*1024*1024){message('Seu arquivo chegou ao limite de fotos de 60 MB. Baixe uma cópia e organize as imagens antes de adicionar mais.',true);return false;}
    byId('note-photos').disabled=true;
    byId('board-photos').disabled=true;
    try {
      const photos=await Promise.all(files.map(async file=>({id:crypto.randomUUID(),name:file.name.slice(0,200),data:await readFile(file)})));
      entry.photos.push(...photos);entry.updatedAt=new Date().toISOString();await saveRecord(entry);
      if(entry.id===selected) { renderPhotos();updateMeta(); }
      if(entry.id==='case-'+contextCase)renderBoard();
      if(!dirty.has(entry.id))message(photos.length===1?'Foto adicionada e salva.':'Fotos adicionadas e salvas.');
      return !dirty.has(entry.id);
    } catch { message('Não foi possível adicionar as fotos. Tente selecionar a imagem novamente.',true);return false; }
    finally {byId('note-photos').disabled=false;byId('board-photos').disabled=false;byId('note-photos').value='';byId('board-photos').value='';}
  }
  function validateBackup(data) {
    if(!data||data.format!==dataFormat||data.version!==1||!Array.isArray(data.entries)||data.entries.length>49)throw new Error('Escolha uma cópia criada pelo caderno deste jogo.');
    for(const entry of data.entries) {
      if(!entry || !/^(general|case-([1-9]|1[0-9]|2[0-4])|phase-([1-9]|1[0-9]|2[0-4]))$/.test(entry.id)||typeof entry.text!=='string'||entry.text.length>200000||!Array.isArray(entry.pins)||entry.pins.length>100||entry.pins.some(p=>typeof p!=='string'||p.length>500)||!Array.isArray(entry.photos)||entry.photos.length>20)throw new Error('A cópia tem uma anotação em formato inválido.');
      for(const photo of entry.photos)if(!photo||typeof photo.id!=='string'||typeof photo.name!=='string'||typeof photo.data!=='string'||photo.data.length>8500000||!supportedImage.test(photo.data))throw new Error('A cópia contém uma imagem inválida ou muito grande.');
    }
    if(data.completed && (!Array.isArray(data.completed)||data.completed.some(p=>!Number.isInteger(p)||p<1||p>24)))throw new Error('O progresso da cópia não é válido.');
    if(data.solvedCases && (!Array.isArray(data.solvedCases)||data.solvedCases.some(id=>!Number.isInteger(id)||id<1||id>24)))throw new Error('As conclusões da cópia não são válidas.');
    if(data.board && (!Array.isArray(data.board.found)||data.board.found.some(id=>!evidenceCatalog[canonicalEvidence(id)])||!data.board.positions||typeof data.board.positions!=='object'))throw new Error('O quadro da cópia não é válido.');
    if(data.board)for(const position of Object.values(data.board.positions))if(!position||!Number.isFinite(position.x)||!Number.isFinite(position.y))throw new Error('A posição de uma ficha não é válida.');
    return data;
  }
  async function importNotebook(file) {
    if(file.size>80*1024*1024)throw new Error('Essa cópia tem mais de 80 MB. Use um arquivo menor.');
    const data=validateBackup(JSON.parse(await file.text()));
    const merged=[];
    for(const incoming of data.entries) {
      const existing=records.get(incoming.id)||defaultRecord(incoming.id);
      const text=!existing.text?incoming.text:!incoming.text||existing.text===incoming.text?existing.text:existing.text+'\n\n— Anotação restaurada —\n'+incoming.text;
      const photos=[...existing.photos];
      for(const photo of incoming.photos)if(!photos.some(p=>p.id===photo.id||p.data===photo.data))photos.push({id:photo.id,name:photo.name.slice(0,200),data:photo.data});
      const pins=[...new Set([...existing.pins,...incoming.pins])];
      if(photos.length>20||pins.length>100||text.length>200000)throw new Error('A combinação das cópias excede o limite de uma anotação. Exporte o caderno atual antes de reorganizar os arquivos.');
      merged.push({id:incoming.id,text,pins,photos,updatedAt:new Date().toISOString()});
    }
    const proposed=new Map(records);for(const entry of merged)proposed.set(entry.id,entry);
    if([...proposed.values()].reduce((total,entry)=>total+entry.photos.reduce((sum,photo)=>sum+photo.data.length,0),0)>60*1024*1024)throw new Error('As fotos reunidas excedem 60 MB. Guarde as cópias separadas para não perder seus registros.');
    await flush();
    const tx=db.transaction(['notes','settings'],'readwrite');
    for(const entry of merged)tx.objectStore('notes').put(entry);
    const progress=new Set([...completed,...(data.completed||[])]);
    const conclusions=new Set([...solvedCases,...(data.solvedCases||[])]);
    for(const id of data.board?.found||[]){const match=canonicalEvidence(id).match(/^case-(\d+)-conclusion$/);if(match)conclusions.add(Number(match[1]));}
    for(const id of conclusions)progress.add(id);
    tx.objectStore('settings').put({id:'progress',completed:[...progress]});
    tx.objectStore('settings').put({id:'cases-solved',cases:[...conclusions]});
    await transactionDone(tx);
    for(const entry of merged)records.set(entry.id,entry);
    completed=progress;solvedCases=conclusions;
    if(data.board){for(const id of data.board.found)found.add(canonicalEvidence(id));boardPositions={...data.board.positions,...boardPositions};persistBoard();}
    renderEntry();renderMap();renderBoard();renderFolders();state('✓ Cópia restaurada');
    window.dispatchEvent(new CustomEvent('hospital-progress-loaded',{detail:{completed:[...completed],solvedCases:[...solvedCases],evidence:[...found]}}));
    message('Cópia restaurada. Seus registros anteriores foram preservados; textos diferentes foram reunidos.');
  }
  async function markComplete(phase) {
    completed.add(phase);const lesson=HospitalLessons.find(item=>item.id===phase);if(lesson)discover(lesson.evidence);renderMap();
    if(!ready)return;
    try{const tx=db.transaction('settings','readwrite');tx.objectStore('settings').put({id:'progress',completed:[...completed]});await transactionDone(tx);}catch{state('Progresso não salvo',true);}
  }
  function renderCheats() {
    const currentLesson=HospitalLessons.find(lesson=>lesson.case===contextCase),commands=byId('cheat-game-commands');commands.replaceChildren();
    const gameCommands=[['lerOcorrencia();','Abre o relato do que aconteceu.'],['examinarObjeto('+JSON.stringify(currentLesson.action.object)+');','Mostra a pista do objeto deste caso.'],['conferirFicha("Nome da pessoa");','Abre uma das fichas deste caso. Troque pelo nome apresentado.'],[currentLesson.action.name+'('+currentLesson.action.args.join(', ')+');','Usa os dados do desafio para agir no cenário. Clique em Executar.'],['coletarPista();','Guarda a evidência depois de recuperá-la.'],['anotar("Minha descoberta");','Cria um post-it com seu texto.'],['analisarPistas();','Organiza o registro recuperado e explica o que comparar nas fichas.'],['concluirCaso("Nome da pessoa");','Compara sua resposta com o registro. O nome correto conclui e salva o caso.']];
    for(const [syntax,explanation]of gameCommands){const card=document.createElement('div'),code=document.createElement('code'),text=document.createElement('p');card.className='cheat-game-command';code.textContent=syntax;text.textContent=explanation;card.append(code,text);commands.append(card);}
    const examples=[
      'const pista = "bilhete";\nconsole.log(pista);',
      'let estado = "fechado";\nestado = "aberto";\nconsole.log(estado);',
      'const nomeDaSala = "Arquivo";\nconsole.log(nomeDaSala); // o nome precisa ser igual',
      'const quantidade = 3;\nconst etiqueta = "3";\nconsole.log(typeof quantidade); // number\nconsole.log(typeof etiqueta); // string',
      'const sala = "Arquivo";\nconst local = "Sala: " + sala;\nconsole.log(local);',
      'const nome = "Lia";\nlet mensagem = "Olá, " + nome;\nconsole.log(mensagem);',
      'const horario = 18;\nconsole.log(horario > 17); // true',
      'const acesso = true;\nif (acesso) {\n  console.log("Pode entrar");\n}',
      'const acesso = false;\nif (acesso) {\n  console.log("Liberado");\n} else {\n  console.log("Confira o crachá");\n}',
      'const ativo = true;\nconst setor = "Arquivo";\nconsole.log(ativo && setor === "Arquivo");',
      'const cargo = "Auditoria";\nconsole.log(cargo === "Gestão" || cargo === "Auditoria");',
      'const ativo = true;\nconst turno = "noite";\nif (ativo && turno === "noite") {\n  console.log("Consultar");\n} else {\n  console.log("Revisar");\n}',
      'const pistas = ["foto", "bilhete"];\nconsole.log(pistas[0]); // foto',
      'const pistas = ["foto"];\npistas.push("bilhete");\nconsole.log(pistas.includes("bilhete")); // true',
      'const pistas = ["foto", "bilhete"];\nfor (const pista of pistas) {\n  console.log(pista);\n}',
      'const registros = [2, 0, 4];\nconst encontrados = [];\nfor (const quantidade of registros) {\n  if (quantidade > 0) encontrados.push(quantidade);\n}\nconsole.log(encontrados);',
      'const ficha = { setor: "Arquivo", numero: 8 };\nconsole.log(ficha.setor);',
      'const nome = "  ARQUIVO  ";\nconsole.log(nome.trim().toLowerCase()); // arquivo',
      'function somar(a, b) {\n  return a + b;\n}\nconsole.log(somar(2, 3)); // 5',
      'const leituras = [1, 2, 3];\nconst ajustadas = leituras.map(valor => valor + 1);\nconsole.log(ajustadas); // [2,3,4]',
      "const texto = '{\"setor\":\"Arquivo\"}';\nconst ficha = JSON.parse(texto);\nconsole.log(ficha.setor);",
      'const resposta = await Promise.resolve("Mensagem recebida");\nconsole.log(resposta);',
      'const aviso = document.getElementById("aviso");\naviso.textContent = "Painel restaurado";',
      'const { data, error } = await supabase\n  .from("pistas_js_treino")\n  .select("id, descricao");\nconsole.log(data);'
    ];
    const list=byId('cheat-list');list.replaceChildren();
    for(const lesson of HospitalLessons){const available=lesson.id===1||lesson.case===contextCase||completed.has(lesson.id),entry=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');entry.className=available?'cheat-available':'cheat-locked';summary.textContent=(available?'✓ ':'○ ')+'Caso '+String(lesson.case).padStart(2,'0')+' · '+lesson.concept;entry.append(summary);if(available){text.textContent=lesson.explanation;const code=document.createElement('pre');code.textContent=examples[lesson.id-1];entry.append(text,code);}else{text.textContent='Você encontra este conceito no Caso '+lesson.case+'. Abra o caso para consultar o exemplo.';const link=document.createElement('a');link.href='caso'+lesson.case+'.html';link.textContent='Ir para esse caso →';entry.append(text,link);}list.append(entry);}
  }
  function renderMap() { renderFolders(); renderCheats(); }
  cases.forEach((item,index)=>{
    const group=document.createElement('optgroup');group.label='Caso '+(index+1)+' · '+item.title;
    item.phases.forEach((name,i)=>{const number=item.id,option=document.createElement('option');option.value='phase-'+number;option.textContent=String(number).padStart(2,'0')+' · '+name;group.append(option);});
    byId('note-scope').append(group);
  });
  const folderGroup=document.createElement('optgroup');folderGroup.label='Pastas dos casos';
  cases.forEach((item,index)=>{const option=document.createElement('option');option.value='case-'+(index+1);option.textContent='Pasta do Caso '+(index+1)+' · '+item.title;folderGroup.append(option);});
  byId('note-scope').append(folderGroup);
  for(const page of ['board','notes','folders','cheats'])byId('tab-'+page).addEventListener('click',()=>showPage(page));
  byId('open-evidence-board').addEventListener('click',()=>openFile('board'));
  byId('open-case-folder').addEventListener('click',()=>{openFile('folders');showDossier(contextCase-1);});
  byId('inspect-computer').addEventListener('click',()=>{discover('case-'+contextCase+'-object');byId('lia-speech').textContent=cases[contextCase-1].description+' A ficha do objeto foi adicionada ao quadro.';});
  byId('inspect-door').addEventListener('click',()=>{discover('case-'+contextCase+'-clue');byId('lia-speech').textContent=HospitalLessons.find(item=>item.case===contextCase).clue;});
  byId('board-add-note').addEventListener('click',()=>{if(!ready){boardMessage('Aguarde a abertura do arquivo para escrever.');return;}byId('board-note-form').hidden=false;byId('board-note-input').focus();});
  byId('cancel-board-note').addEventListener('click',()=>{byId('board-note-form').hidden=true;});
  byId('save-board-note').addEventListener('click',()=>{const text=byId('board-note-input').value.trim();if(!text)return;const entry=caseRecord();if(entry.pins.length>=100){boardMessage('Esta pasta já tem 100 post-its. Use as anotações do caderno para continuar.');return;}entry.pins.push(text);touch(entry);byId('board-note-input').value='';byId('board-note-form').hidden=true;renderBoard();if(selected==='case-'+contextCase)renderEntry();boardMessage('Post-it preso no quadro. Você pode arrastá-lo para organizar as pistas.');});
  byId('board-photos').addEventListener('change',()=>{const files=[...byId('board-photos').files];if(files.length)addPhotos(files,'case-'+contextCase).then(ok=>boardMessage(ok?'Fotos presas no quadro.':byId('notebook-message').textContent)).finally(()=>{byId('board-photos').value='';});});
  byId('board-organize').addEventListener('click',()=>{boardPositions={};renderBoard();persistBoard();boardMessage('Fichas organizadas.');});
  byId('close-evidence-detail').addEventListener('click',()=>byId('evidence-detail').close());
  window.addEventListener('resize',()=>{if(activePage==='board'&&byId('notebook-dialog').open)updateThreads();});
  document.querySelectorAll('label[for="board-photos"],label[for="note-photos"],label[for="import-notebook"]').forEach(label=>{label.tabIndex=0;label.setAttribute('role','button');label.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();byId(label.htmlFor).click();}});});
  renderMap();renderBoard();renderFolders();
  byId('open-notebook').addEventListener('click',()=>{openFile('notes');if(ready)byId('note-text').focus();});
  byId('close-notebook').addEventListener('click',()=>{flush();byId('notebook-dialog').close();});
  byId('notebook-dialog').addEventListener('cancel',()=>flush());
  byId('close-photo').addEventListener('click',()=>byId('photo-dialog').close());
  byId('photo-dialog').addEventListener('close',()=>byId('photo-view').removeAttribute('src'));
  byId('note-scope').addEventListener('change',()=>{flush();selected=byId('note-scope').value;renderEntry();});
  byId('note-text').addEventListener('input',()=>{current().text=byId('note-text').value;touch();});
  byId('note-photos').addEventListener('change',()=>{if(byId('note-photos').files.length)addPhotos([...byId('note-photos').files]).finally(()=>{byId('note-photos').value='';});});
  byId('pin-form').addEventListener('submit',event=>{
    event.preventDefault();const text=byId('pin-input').value.trim();if(!text)return;
    if(current().pins.length>=100){message('Esta anotação já tem 100 pistas. Use outro caso para continuar.',true);return;}
    current().pins.push(text);byId('pin-input').value='';touch();renderPins();if(selected==='case-'+contextCase)renderBoard();
  });
  byId('export-notebook').addEventListener('click',()=>exportNotebook().catch(()=>message('Não foi possível gerar a cópia. Tente novamente.',true)));
  byId('import-notebook').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{await importNotebook(file);}catch(error){message(error instanceof SyntaxError?'Não consegui ler essa cópia. Escolha o arquivo JSON baixado pelo caderno.':error.message,true);}finally{event.target.value='';}
  });
  document.addEventListener('click',async event=>{
    const link=event.target.closest?.('a[href]');
    if(!link||link.hasAttribute('download')||!ready||!dirty.size||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target==='_blank')return;
    const target=new URL(link.href,window.location.href);
    if(!['http:','https:'].includes(target.protocol)||target.origin!==window.location.origin||target.pathname===window.location.pathname)return;
    event.preventDefault();await flush();
    if(dirty.size){openFile('notes');message('Não consegui salvar a última alteração. Baixe uma cópia do caderno antes de sair para outra tela.',true);return;}
    window.location.assign(target.href);
  });
  byId('mobile-board').addEventListener('click',()=>openFile('board'));
  byId('mobile-notes').addEventListener('click',()=>openFile('notes'));
  window.addEventListener('hospital-phase-changed',event=>{if(!ready)return;flush();selected='phase-'+event.detail.phase;byId('note-scope').value=selected;renderEntry();});
  window.addEventListener('hospital-case-solved',event=>{solvedCases.add(event.detail.case);discover('case-'+event.detail.case+'-conclusion');renderFolders();});
  window.HospitalAddCaseNote=text=>{if(!ready)throw new Error('Aguarde a abertura do caderno e tente de novo.');const entry=caseRecord();if(entry.pins.length>=100)throw new Error('Esta pasta já tem 100 post-its.');if(!entry.pins.includes(text)){entry.pins.push(text);touch(entry);renderBoard();if(selected==='case-'+contextCase)renderEntry();}};
  window.addEventListener('hospital-evidence-found',event=>discover(event.detail.id));
  window.addEventListener('hospital-phase-completed',event=>markComplete(event.detail.phase));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&ready)flush();});
  window.addEventListener('pagehide',()=>{if(ready)flush();});
  (async()=>{
    try{
      const storage=await window.HospitalStorageReady;dbName=storage.dbName;for(const id of storage.solvedCases||[])solvedCases.add(id);
      db=await openDatabase();
      const notesTx=db.transaction('notes','readonly'),settingsTx=db.transaction('settings','readonly');
      const boardTx=db.transaction('settings','readonly');
      const [notes,progress,savedBoard]=await Promise.all([requestResult(notesTx.objectStore('notes').getAll()),requestResult(settingsTx.objectStore('settings').get('progress')),requestResult(boardTx.objectStore('settings').get('board'))]);
      for(const entry of notes)records.set(entry.id,entry);
      for(const phase of progress?.completed||[])completed.add(phase);
      if(savedBoard){for(const id of savedBoard.found||[])if(evidenceCatalog[id])found.add(canonicalEvidence(id));boardPositions=savedBoard.positions||{};}
      for(const id of solvedCases){completed.add(id);found.add('case-'+id+'-conclusion');}
      ready=true;
      for(const id of ['note-text','note-photos','board-photos','pin-input','add-pin','export-notebook','import-notebook'])byId(id).disabled=false;
      selected='phase-'+(window.HospitalCurrentPhase||contextCase);byId('note-scope').value=selected;
      renderEntry();renderMap();renderBoard();renderFolders();persistBoard();state('✓ Caderno pronto');
      window.dispatchEvent(new CustomEvent('hospital-progress-loaded',{detail:{completed:[...completed],solvedCases:[...solvedCases],evidence:[...found]}}));
      for(const phase of completed){const lesson=HospitalLessons.find(item=>item.id===phase);if(lesson)found.add(lesson.evidence);}renderBoard();persistBoard();
    }catch{state('Armazenamento indisponível',true);message('O navegador bloqueou o armazenamento do caderno. Permita os dados deste site ou tente abrir o jogo em outra janela.',true);}
  })();
})();
