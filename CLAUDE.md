# Mistério no Hospital JS — instruções para o Claude

Jogo educativo para aprender JavaScript (24 casos num hospital fictício). Estrutura e funcionamento: veja `README.md`.

## Regras de segurança (obrigatórias)

Ao gerar ou alterar código neste projeto, siga OBRIGATORIAMENTE estas regras. Se alguma regra não se aplicar ao contexto, ignore-a silenciosamente. Se precisar violar alguma regra por limitação técnica, avise explicitamente no final da resposta.

### 1. Injeções
- NUNCA monte queries SQL concatenando strings com input do usuário. Use SEMPRE queries parametrizadas / prepared statements / ORM (ou os métodos nativos do Supabase client).
- NUNCA passe input do usuário para comandos do sistema (`os.system`, `exec`, `subprocess` com `shell=True`, `eval`).
- Ao exibir dados do usuário em HTML, faça escape/sanitização para prevenir XSS. Em React, evite `dangerouslySetInnerHTML`.

### 2. Segredos e credenciais
- NUNCA escreva chaves de API, senhas, tokens ou URLs de conexão diretamente no código.
- Use variáveis de ambiente (`.env`) e lembre de manter `.env` no `.gitignore`.
- No frontend, use apenas chaves públicas (ex.: anon/publishable key do Supabase). Chaves secretas (`service_role`, `sb_secret_`) só no backend/edge functions.

### 3. Autenticação e autorização
- Toda rota/endpoint que acessa dados sensíveis deve verificar autenticação NO BACKEND (nunca só no frontend).
- No Supabase, sempre proponha políticas RLS para cada tabela criada, e avise se alguma tabela ficar sem RLS.
- Senhas devem ser armazenadas com hash forte (bcrypt/argon2), nunca em texto puro nem com MD5/SHA1.
- Implemente verificação de permissão por papel (role) no servidor: o usuário só pode ver/editar o que pertence a ele.

### 4. Validação de entrada
- Valide TODO input do usuário no backend: tipo, tamanho máximo, formato (regex quando fizer sentido) e valores permitidos (whitelist).
- Em uploads de arquivo: valide extensão E conteúdo (magic bytes), limite o tamanho, renomeie o arquivo e nunca use o nome original no caminho de gravação.
- Bloqueie path traversal: nunca use input do usuário diretamente em caminhos de arquivo.

### 5. Criptografia e transporte
- Use apenas HTTPS em URLs de API.
- Para tokens/valores aleatórios de segurança, use geradores criptográficos (`secrets` no Python, `crypto.randomUUID` no JS), nunca `random`/`Math.random`.
- Não use algoritmos obsoletos (MD5, SHA1, DES).

### 6. Dados perigosos e deserialização
- Nunca use `eval()`, `pickle.loads()` ou similares em dados que vêm de fora.
- Ao consumir JSON externo, valide a estrutura antes de usar (ex.: com zod).

### 7. Erros e logs
- Mensagens de erro para o usuário devem ser genéricas ("Erro ao processar solicitação"). Detalhes técnicos (stack trace) vão apenas para o log do servidor.
- NUNCA registre em log: senhas, tokens, dados de saúde de pacientes, CPF ou outros dados pessoais sensíveis (LGPD).
- Desative modo debug em produção.

### 8. Configurações de API/web
- Configure CORS restrito aos domínios necessários (nunca `*` em produção).
- Cookies de sessão com flags `Secure`, `HttpOnly` e `SameSite`.
- Adicione rate limiting em endpoints de login e endpoints públicos, quando a plataforma permitir.

### 9. Dependências
- Use apenas bibliotecas conhecidas e mantidas. Avise se alguma dependência sugerida tiver vulnerabilidade conhecida ou estiver abandonada.
- Fixe versões das dependências (`package.json` sem `^`/`~`; `package-lock.json` versionado).

### 10. Dados sensíveis e LGPD (contexto hospitalar)
- Trate dados de pacientes e funcionários como dados sensíveis: minimize o que é coletado, exibido e exportado.
- Nunca exponha dados de um paciente para usuários sem permissão sobre aquele paciente.
- Em relatórios/exportações, inclua apenas os campos necessários.

### Formato da resposta
Ao final de toda resposta que gere ou altere código, inclua uma seção **"🔒 Checklist de Segurança"** listando:
- Quais proteções foram aplicadas neste código.
- Quais riscos ainda dependem de configuração do usuário (ex.: ativar RLS, criar `.env`, configurar HTTPS).
- Qualquer ponto de atenção a revisar antes de colocar em produção.

## Como as regras se aplicam a este projeto

- **Execução do código do jogador (exceção à regra 6):** o jogo executa de propósito o JavaScript digitado pelo jogador, via `AsyncFunction` em `public/worker.js`. Nunca execute esse código na página principal; mantenha-o sempre num Worker descartável, com limite de tempo e de saída. O Worker é da mesma origem do site e por isso tem acesso a `fetch`, `indexedDB` e `importScripts`: qualquer mudança deve reduzir esse acesso, nunca ampliar.
- **Mensagens do Worker não são confiáveis:** o código do jogador pode chamar `self.postMessage` e forjar respostas. Na página principal, trate tudo o que vem do Worker como dado não confiável.
- **XSS:** exiba texto do jogador (caderno, post-its, nomes de fotos, saída do console, respostas do Supabase) somente com `textContent`/`value`. `innerHTML` só para SVG fixo do próprio jogo, com `escape()` em qualquer texto interpolado (padrão de `case-bootstrap.js` e `scene-actions.js`).
- **Autenticação:** `app/chatgpt-auth.ts` confia nos cabeçalhos `oai-authenticated-user-*`, que só são seguros atrás do proxy do ChatGPT Sites (que os remove e injeta). Todo endpoint novo deve chamar `getChatGPTUser()` no servidor. Se o site for hospedado em outra plataforma, a autenticação precisa ser substituída antes.
- **Supabase (Caso 24):** só chaves publishable/anon no navegador; só URLs `https://<projeto>.supabase.co`; `credentials: 'omit'`. Todo SQL de exemplo deve ativar RLS e liberar apenas `select`. A tabela de treino é pública por definição: só dados fictícios.
- **Caderno (dados do jogador):** textos e fotos ficam em IndexedDB, sem criptografia, no navegador. Backups JSON importados devem passar por validação estrita, como `validateBackup()` em `public/notebook.js`. Fotos: valide tipo, magic bytes e tamanho; nunca use o nome original do arquivo como chave ou caminho.
- **Dados fictícios:** personagens, crachás e "pacientes" dos casos são inventados. Nunca adicione dados reais de pessoas ao conteúdo do jogo.
