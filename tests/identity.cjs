const fs=require('fs'),vm=require('vm'),assert=require('assert');const ts=require('typescript');let requestHeaders=new Headers();
function load(file,require){const module={exports:{}};const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(output,{module,exports:module.exports,require,Response,URL,decodeURIComponent});return module.exports;}
const auth=load(__dirname+'/../app/chatgpt-auth.ts',name=>name==='next/headers'?{headers:async()=>requestHeaders}:{redirect:path=>{throw new Error(path)}});
const route=load(__dirname+'/../app/api/profile/route.ts',()=>auth);
(async()=>{
let response=await route.GET();assert.equal(response.status,401);assert.equal((await response.json()).user,null);
requestHeaders=new Headers({'oai-authenticated-user-id':'user-1','oai-authenticated-user-email':'noemi@example.test','oai-authenticated-user-full-name':encodeURIComponent('Noemi Sales'),'oai-authenticated-user-full-name-encoding':'percent-encoded-utf-8'});
response=await route.GET();let data=await response.json();assert.equal(data.user.id,'user-1');assert.equal(data.user.name,'Noemi Sales');assert(response.headers.get('Cache-Control').includes('no-store'));assert(!('email'in data.user));
requestHeaders.set('oai-authenticated-user-full-name',encodeURIComponent('João Silva'));response=await route.GET();assert.deepEqual(await response.json(),{user:{id:'user-1',name:'João Silva'}});
requestHeaders.delete('oai-authenticated-user-full-name');response=await route.GET();assert.equal((await response.json()).user.name,'Detetive');
console.log('Identidade verificada: sessão obrigatória, nome autenticado com fallback sem e-mail e resposta sem cache compartilhado.');
})().catch(error=>{console.error(error);process.exit(1)});
