'use strict';
// Identidade do jogador: login simples (e-mail + senha) pelo Supabase Auth.
// Sem configuração do Supabase, funciona em "modo local": só pede um nome e guarda tudo neste navegador.
// Contrato mantido: window.HospitalProfileReady resolve com {id, name}; as demais telas esperam por ele.
(()=>{
 const cfg=window.HospitalConfig||{};
 const remote=!!(cfg.supabaseUrl&&cfg.supabaseKey&&/^https:\/\//.test(cfg.supabaseUrl)&&window.supabase&&window.supabase.createClient);
 const client=remote?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey,{auth:{storageKey:'hospital-js-auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
 const LOCAL_NAME='hospital-local-name';
 const $$=selector=>document.querySelectorAll(selector);
 const el=(tag,props={},...children)=>{const node=document.createElement(tag);for(const [key,value]of Object.entries(props)){if(key==='text')node.textContent=value;else if(key in node)node[key]=value;else node.setAttribute(key,value);}node.append(...children);return node;};
 const cleanName=value=>typeof value==='string'&&value.trim()?value.trim().replace(/[\u0000-\u001f<>]/g,'').slice(0,100)||'Detetive':'Detetive';
 const emailOk=value=>value.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
 // Mensagens genéricas: o detalhe técnico não vai para a tela.
 function friendly(error){
  const code=error&&error.code,status=error&&error.status;
  if(code==='invalid_credentials')return 'E-mail ou senha incorretos.';
  if(code==='email_not_confirmed')return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if(code==='user_already_exists'||code==='email_exists')return 'Não foi possível criar a conta com esses dados. Se você já tem conta, use Entrar.';
  if(code==='weak_password')return 'Escolha uma senha mais forte (mínimo de 8 caracteres).';
  if(status===429||code==='over_request_rate_limit'||code==='over_email_send_rate_limit')return 'Muitas tentativas. Aguarde um minuto e tente de novo.';
  if(!navigator.onLine)return 'Sem internet no momento. Conecte-se para entrar.';
  return 'Não foi possível concluir. Tente novamente.';
 }
 function fillPage(user){
  window.HospitalUser=user;
  $$('[data-player-name]').forEach(node=>node.textContent=user.name);
  $$('[data-player-badge]').forEach(node=>{node.hidden=false;if(!node.parentNode.querySelector('[data-sign-out]')){const button=el('button',{type:'button',className:'sign-out-button',text:'Sair'});button.setAttribute('data-sign-out','');button.addEventListener('click',signOut);node.after(button);}});
  $$('[data-account-status]').forEach(node=>node.textContent=remote?'Seu arquivo está pronto e salvo na sua conta.':'Seu arquivo está pronto (salvo só neste navegador).');
 }
 async function signOut(){
  try{if(client)await client.auth.signOut();else localStorage.removeItem(LOCAL_NAME);}catch{}
  location.href='index.html';
 }
 function fromSession(session){const meta=session.user.user_metadata||{};return{id:String(session.user.id),name:cleanName(meta.nome||meta.name)};}
 // ---------- tela de entrada ----------
 function showLogin(mode){
  return new Promise(resolve=>{
   let tab='entrar',failures=0,lockedUntil=0;const recovery=mode==='recovery';
   const title=el('h2',{id:'login-title'}),lead=el('p',{className:'login-lead'});
   const nameInput=el('input',{id:'login-name',type:'text',autocomplete:'name',maxLength:100});
   const emailInput=el('input',{id:'login-email',type:'email',autocomplete:'email',maxLength:254,inputMode:'email'});
   const passInput=el('input',{id:'login-pass',type:'password',maxLength:72});
   const nameRow=el('label',{className:'login-field'},el('span',{text:'Seu nome'}),nameInput);
   const emailRow=el('label',{className:'login-field'},el('span',{text:'E-mail'}),emailInput);
   const passLabel=el('span');const passRow=el('label',{className:'login-field'},passLabel,passInput);
   const message=el('p',{className:'login-message',role:'status'});
   const submit=el('button',{type:'submit',className:'run login-submit'});
   const switchTab=el('button',{type:'button',className:'login-link'}),forgot=el('button',{type:'button',className:'login-link',text:'Esqueci minha senha'});
   const form=el('form',{className:'login-form'},nameRow,emailRow,passRow,submit,message,el('div',{className:'login-links'},switchTab,forgot));
   form.noValidate=true;
   const hero=el('div',{className:'login-hero'},el('span',{className:'login-avatar'},el('img',{src:'assets/detective-v2.png',alt:''})),el('div',{className:'login-brand'},el('strong',{text:'Mistério no Hospital'}),el('small',{text:'Uma aventura com JavaScript'})));
   // A lupa do cabeçalho vira uma marca d'água na faixa; o carimbo dá o clima de arquivo de investigação.
   const mark=document.querySelector('.brand-icon svg')?.cloneNode(true);if(mark){mark.classList.add('login-mark');hero.append(mark);}
   const card=el('div',{className:'login-card'},hero,el('span',{className:'login-stamp',text:'Arquivo confidencial'}),el('div',{className:'login-body'},title,lead,form));
   const overlay=el('div',{className:'login-overlay',role:'dialog'},card);overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','login-title');
   const say=(text,bad)=>{message.textContent=text;message.setAttribute('data-bad',bad?'true':'false');};
   function paint(){
    const local=!remote;
    nameRow.hidden=!(local||tab==='criar')||recovery;emailRow.hidden=local||recovery;passRow.hidden=local;forgot.hidden=local||tab!=='entrar'||recovery;switchTab.hidden=local||recovery;
    passLabel.textContent=recovery?'Nova senha (mínimo 8 caracteres)':tab==='criar'?'Crie uma senha (mínimo 8 caracteres)':'Senha';
    passInput.autocomplete=tab==='criar'||recovery?'new-password':'current-password';
    title.textContent=recovery?'Escolha uma nova senha':local?'Quem vai investigar?':tab==='criar'?'Criar minha conta':'Entrar no meu arquivo';
    lead.textContent=recovery?'Digite a nova senha para continuar.':local?'Digite seu nome. Seu progresso fica salvo neste navegador.':tab==='criar'?'Sua conta guarda seu progresso, anotações e fotos na nuvem.':'Entre para abrir seus casos e continuar de onde parou.';
    submit.textContent=recovery?'Salvar nova senha':local?'Começar a investigar':tab==='criar'?'Criar conta':'Entrar';
    switchTab.textContent=tab==='criar'?'Já tenho conta · Entrar':'Ainda não tenho conta · Criar';
   }
   switchTab.addEventListener('click',()=>{tab=tab==='criar'?'entrar':'criar';paint();say('');});
   forgot.addEventListener('click',async()=>{
    const email=emailInput.value.trim().toLowerCase();if(!emailOk(email)){say('Digite seu e-mail acima para receber o link.',true);emailInput.focus();return;}
    forgot.disabled=true;
    try{const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/index.html'});if(error)throw error;say('Se esse e-mail tiver conta, enviamos um link para criar uma nova senha.');}
    catch(error){say(friendly(error),true);}
    finally{setTimeout(()=>{forgot.disabled=false;},15000);}
   });
   function done(user){overlay.remove();document.documentElement.classList.remove('login-open');resolve(user);}
   form.addEventListener('submit',async event=>{
    event.preventDefault();if(submit.disabled)return;
    if(Date.now()<lockedUntil){say('Aguarde alguns segundos antes de tentar de novo.',true);return;}
    const name=cleanName(nameInput.value),email=emailInput.value.trim().toLowerCase(),password=passInput.value;
    if(!remote){if(!nameInput.value.trim()){say('Digite seu nome.',true);nameInput.focus();return;}try{localStorage.setItem(LOCAL_NAME,name);}catch{}done({id:'local',name});return;}
    if(!recovery&&!emailOk(email)){say('Confira o e-mail digitado.',true);emailInput.focus();return;}
    if(password.length<8||password.length>72){say('A senha precisa ter de 8 a 72 caracteres.',true);passInput.focus();return;}
    if(!recovery&&tab==='criar'&&!nameInput.value.trim()){say('Digite seu nome.',true);nameInput.focus();return;}
    submit.disabled=true;say('Um instante…');
    try{
     if(recovery){const {error}=await client.auth.updateUser({password});if(error)throw error;const {data}=await client.auth.getSession();if(data.session)return done(fromSession(data.session));}
     else if(tab==='criar'){
      const {data,error}=await client.auth.signUp({email,password,options:{data:{nome:name},emailRedirectTo:location.origin+'/index.html'}});if(error)throw error;
      if(data.session)return done(fromSession(data.session));
      tab='entrar';paint();say('Conta criada! Enviamos um link de confirmação para o seu e-mail. Confirme e depois entre aqui.');
     }else{
      const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;
      if(data.session)return done(fromSession(data.session));
     }
    }catch(error){failures++;if(failures>=5){lockedUntil=Date.now()+30000;failures=0;}say(friendly(error),true);}
    finally{submit.disabled=false;passInput.value='';}
   });
   document.documentElement.classList.add('login-open');document.body.append(overlay);paint();
   (remote&&!recovery?emailInput:nameInput).focus();
  });
 }
 window.HospitalAuth={mode:remote?'nuvem':'local',client,signOut};
 window.HospitalProfileReady=(async()=>{
  try{
   let user=null;
   if(client){
    client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'&&window.HospitalUser)location.reload();});
    // Link de "esqueci a senha": a biblioteca cria uma sessão temporária; o endereço traz type=recovery.
    const recovering=/type=recovery/.test(location.hash||'');
    const {data}=await client.auth.getSession();
    if(recovering){history.replaceState(null,'',location.pathname);user=await showLogin('recovery');}
    else if(data.session)user=fromSession(data.session);
   }else{
    let saved=null;try{saved=localStorage.getItem(LOCAL_NAME);}catch{}
    if(saved)user={id:'local',name:cleanName(saved)};
   }
   if(!user)user=await showLogin();
   fillPage(user);return user;
  }catch{
   $$('[data-account-status]').forEach(node=>{node.textContent='Atualize a página para abrir seu arquivo.';});return null;
  }
 })();
})();
