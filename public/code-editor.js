'use strict';
// Editor do computador: código colorido, quebra de linha com números alinhados e altura que acompanha o programa.
// Continua sendo o mesmo <textarea> (teclado, colar, desfazer e leitores de tela funcionam igual);
// por baixo dele, uma cópia colorida do texto, montada só com textContent.
(()=>{
 const code=document.getElementById('code'),numbers=document.getElementById('line-numbers'),area=code?.closest('.code-area');
 if(!code||!numbers||!area||typeof getComputedStyle!=='function')return;
 const lesson=(window.HospitalLessons||[]).find(item=>item.case===window.HospitalActiveCase?.id);
 const keywords=new Set(['const','let','var','function','return','if','else','for','of','in','while','await','async','new','typeof','true','false','null','undefined']);
 const gameNames=new Set(['console','log','document','JSON','parse','supabase','lerOcorrencia','examinarObjeto','conferirFicha','coletarPista','anotar','analisarPistas','concluirCaso',lesson?.action?.name].filter(Boolean));
 const view=document.createElement('pre');view.className='code-highlight';view.setAttribute('aria-hidden','true');
 area.insertBefore(view,code);area.classList.add('has-highlight');code.setAttribute('wrap','soft');
 // Divide uma linha em pedaços coloridos: comentário, texto, número, palavra do JavaScript, função do jogo.
 function tokens(line){
  const out=[],pattern=/(\/\/.*$)|("(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|`(?:\\.|[^`\\])*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\s\w$"'`]+)/g;
  let match;
  while((match=pattern.exec(line))){
   const [text,comment,string,number,word]=match;
   const kind=comment?'comment':string?'string':number?'number':word?(keywords.has(word)?(word==='true'||word==='false'?'boolean':'keyword'):gameNames.has(word)?'game':line[pattern.lastIndex]==='('?'call':'name'):text.trim()?'punct':'';
   out.push([text,kind]);
  }
  return out;
 }
 let last=null;
 function render(){
  last=code.value;
  // Copia a tipografia real do campo (ela muda conforme o aparelho).
  const style=getComputedStyle(code);
  for(const property of ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','tabSize','paddingTop','paddingRight','paddingBottom','paddingLeft'])view.style[property]=style[property];
  // Largura útil do campo (sem a barra de rolagem), para as linhas quebrarem no mesmo ponto.
  view.style.width=code.clientWidth+'px';view.style.top=code.offsetTop+'px';view.style.left=code.offsetLeft+'px';
  numbers.style.top=code.offsetTop+parseFloat(style.paddingTop)+'px';
  const lines=code.value.split('\n');view.replaceChildren();
  for(const line of lines){
   const row=document.createElement('span');row.className='code-line';
   for(const [text,kind]of tokens(line)){if(!kind){row.append(text);continue;}const piece=document.createElement('span');piece.className='tok-'+kind;piece.textContent=text;row.append(piece);}
   if(!line)row.append('​');
   view.append(row);
  }
  // Números de linha na altura de cada linha (uma linha longa ocupa mais de uma faixa).
  const rows=[...view.children];numbers.replaceChildren();
  rows.forEach((row,index)=>{const number=document.createElement('span');number.textContent=String(index+1);number.style.height=row.getBoundingClientRect().height+'px';numbers.append(number);});
  // O campo cresce com o programa até mais ou menos metade da tela; daí em diante, rola por dentro.
  code.style.height='auto';
  const minimum=parseFloat(style.minHeight)||0,content=view.scrollHeight,limit=Math.max(minimum,Math.round(innerHeight*.5)),height=Math.max(minimum,Math.min(content,limit));
  code.style.height=height+'px';view.style.height=height+'px';
  numbers.style.height=Math.max(0,height-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom))+'px';
  code.classList.toggle('code-scrolls',content>height);
  syncScroll();
 }
 // A cópia colorida e os números acompanham a rolagem do campo.
 function syncScroll(){view.scrollTop=code.scrollTop;numbers.scrollTop=code.scrollTop;}
 code.addEventListener('scroll',syncScroll);
 const schedule=()=>{if(code.value!==last||!numbers.firstElementChild||area.dataset.width!==String(area.clientWidth)){area.dataset.width=String(area.clientWidth);render();}};
 code.addEventListener('input',render);
 // Passos do programa numa faixa compacta: os botões de inserir linha vão para a barra do editor.
 const controls=document.querySelector('.editor-controls'),run=document.getElementById('run');
 let previous=run;
 for(const [id,label]of [['insert-console','＋ console.log'],['insert-action','＋ ação do caso']]){const button=document.getElementById(id);if(button&&controls&&previous){button.textContent=label;button.classList.add('editor-insert');previous.after(button);previous=button;}}
 const shortTitles=['Dados','Console','Ação'];
 document.querySelectorAll('.program-checklist li').forEach((step,index)=>{const title=step.querySelector('b');if(title&&shortTitles[index]){step.title=title.textContent;title.textContent=shortTitles[index];}});
 addEventListener('resize',()=>{last=null;schedule();});
 // O programa também muda sem digitação (recomeçar, inserir linha, solução, cópia salva).
 const watch=()=>{schedule();requestAnimationFrame(watch);};
 document.fonts?.ready?.then(()=>{last=null;schedule();});
 render();requestAnimationFrame(watch);
})();
