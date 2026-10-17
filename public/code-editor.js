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
  view.style.width=code.getBoundingClientRect().width+'px';view.style.top=code.offsetTop+'px';view.style.left=code.offsetLeft+'px';
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
  // O campo cresce até mostrar o programa inteiro, sem barra de rolagem interna.
  code.style.height='auto';
  const minimum=parseFloat(style.minHeight)||0;
  code.style.height=Math.max(minimum,view.scrollHeight)+'px';
 }
 const schedule=()=>{if(code.value!==last||!numbers.firstElementChild||area.dataset.width!==String(area.clientWidth)){area.dataset.width=String(area.clientWidth);render();}};
 code.addEventListener('input',render);
 addEventListener('resize',()=>{last=null;schedule();});
 // O programa também muda sem digitação (recomeçar, inserir linha, solução, cópia salva).
 const watch=()=>{schedule();requestAnimationFrame(watch);};
 document.fonts?.ready?.then(()=>{last=null;schedule();});
 render();requestAnimationFrame(watch);
})();
