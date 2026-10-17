'use strict';
// Tema claro/escuro. Carregado sem defer no <head> para aplicar o tema antes da pintura.
// Também esconde a página até o identity.js saber quem está jogando (nada do arquivo aparece antes de entrar).
document.documentElement.classList.add('auth-pending');
(()=>{
 const key='hospital-theme',root=document.documentElement,system=window.matchMedia('(prefers-color-scheme: dark)');
 const saved=()=>{try{const value=localStorage.getItem(key);return value==='dark'||value==='light'?value:null;}catch{return null;}};
 const icons={dark:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',light:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z" fill="currentColor"/></svg>'};
 function apply(theme){
  root.dataset.theme=theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta=>meta.content=theme==='dark'?'#111916':'#173b35');
  document.querySelectorAll('.theme-toggle').forEach(button=>{button.setAttribute('aria-pressed',String(theme==='dark'));button.title=theme==='dark'?'Usar modo claro':'Usar modo escuro';button.innerHTML=icons[theme];});
 }
 apply(saved()||(system.matches?'dark':'light'));
 system.addEventListener('change',event=>{if(!saved())apply(event.matches?'dark':'light');});
 window.addEventListener('storage',event=>{if(event.key===key)apply(saved()||(system.matches?'dark':'light'));});
 document.addEventListener('DOMContentLoaded',()=>{
  const place=document.querySelector('header .header-right');if(!place)return;
  const button=document.createElement('button');button.type='button';button.className='icon-button theme-toggle';button.setAttribute('aria-label','Modo escuro');
  button.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,next);}catch{}apply(next);});
  place.append(button);apply(root.dataset.theme);
 });
})();
