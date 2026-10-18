'use strict';
(()=>{
  if(window.HospitalActiveCase?.id!==24)return;
  const $=id=>document.getElementById(id);
  const sql=`-- Projeto de estudos: somente pistas fictícias.
create table if not exists public.pistas_js_treino (
  id bigint primary key,
  descricao text not null
);

alter table public.pistas_js_treino enable row level security;
grant usage on schema public to anon, authenticated;
revoke all on public.pistas_js_treino from anon, authenticated;
grant select on public.pistas_js_treino to anon, authenticated;

drop policy if exists "Ler pistas ficticias" on public.pistas_js_treino;
create policy "Ler pistas ficticias"
on public.pistas_js_treino for select
to anon, authenticated using (true);

insert into public.pistas_js_treino (id, descricao) values
  (1, 'Registro da ultima ficha'),
  (2, 'Cracha FAR-24C')
on conflict (id) do nothing;`;
  $('supabase-sql').textContent=sql;
  $('connection-code').textContent=`// URL e chave pública vêm do seu projeto de estudos.
const resposta = await fetch(
  url + "/rest/v1/pistas_js_treino?select=id,descricao&order=id.asc",
  { headers: { apikey: chavePublica } }
);

if (!resposta.ok) {
  throw new Error("Não consegui ler a tabela: " + resposta.status);
}
const pistas = await resposta.json();
console.log(pistas);`;
  $('copy-sql').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(sql);$('copy-sql').textContent='✓ SQL copiado';}catch{$('connection-output').textContent='Selecione o SQL acima e copie para o SQL Editor do seu projeto.';}});
  function publicKey(key){
    if(key.startsWith('sb_secret_'))return false;
    if(/^sb_publishable_[A-Za-z0-9_-]+$/.test(key))return true;
    try{const part=key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(atob(part)).role==='anon';}catch{return false;}
  }
  $('connection-form').addEventListener('submit',async event=>{
    event.preventDefault();
    let origin;try{const url=new URL($('project-url').value.trim());if(url.protocol!=='https:'||!/^[-a-z0-9]+\.supabase\.co$/.test(url.hostname)||url.username||url.password||url.port||(url.pathname!=='/'&&url.pathname!=='')||url.search||url.hash)throw new Error();origin=url.origin;}catch{$('connection-output').textContent='Use a URL raiz HTTPS do seu projeto hospedado: https://seu-projeto.supabase.co';return;}
    const key=$('publishable-key').value.trim();if(!publicKey(key)){$('connection-output').textContent='Use a chave pública publishable ou anon. Chaves secret e service_role não são aceitas.';return;}
    $('test-connection').disabled=true;$('connection-output').textContent='Consultando sua tabela…';
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(origin+'/rest/v1/pistas_js_treino?select=id,descricao&order=id.asc',{headers:{apikey:key},credentials:'omit',signal:controller.signal,redirect:'error'});
      if(!response.ok){const messages={401:'Confira a chave pública do mesmo projeto.',403:'Confira a permissão SELECT e a política de leitura RLS do SQL de treino.',404:'Crie a tabela pistas_js_treino no SQL Editor do projeto.'};throw new Error('Resposta '+response.status+'. '+(messages[response.status]||'Confira a tabela e as permissões no projeto.'));}
      const data=await response.json();if(!Array.isArray(data))throw new Error('A API respondeu, mas a resposta não é uma lista de pistas.');
      $('connection-output').textContent='✓ Conexão real: '+data.length+' pista(s) recebida(s).\n'+JSON.stringify(data,null,2);
    }catch(error){$('connection-output').textContent=error.name==='AbortError'?'A consulta demorou mais de 10 segundos. Confira a URL e tente novamente.':error instanceof TypeError?'Não consegui alcançar o projeto. Confira sua conexão e se o projeto de estudos está ativo.':error.message;}
    finally{clearTimeout(timer);$('test-connection').disabled=false;}
  });
})();
