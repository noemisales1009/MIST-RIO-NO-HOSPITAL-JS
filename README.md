# Mistério no Hospital JS
Jogo em português para aprender JavaScript resolvendo 24 investigações curtas em um hospital fictício, criado para Noemi Sales.

## Conteúdo
Cada caso tem uma ocorrência diferente, cenário, pista, um desafio de JavaScript, três fichas de personagens e uma conclusão. Todos os 24 casos estão disponíveis em páginas próprias. A seleção mostra as 24 pastas diretamente, sem cronômetro ou perda de vidas.

- Casos 01–06: variáveis, atribuição, nomes, tipos e textos.
- Casos 07–12: comparações, if/else e condições compostas.
- Casos 13–18: listas, repetição, objetos e tratamento de texto.
- Casos 19–23: funções, transformação de listas, JSON, async/await e DOM.
- Caso 24: leitura com JavaScript e Supabase. SQL aparece somente aqui.

O terminal mostra uma prévia dos dados após uma breve pausa na digitação, sem liberar registros ou mover a personagem. A função pronta conferirFicha("nome") abre a ficha em um pop-up quando o comando fica completo. Os retratos preparam esse comando em um campo de consulta separado, preservando o programa do desafio. O botão Executar valida os dados e o comando de ação do caso. Não basta imprimir a resposta: abrirPorta(senha), por exemplo, precisa receber a senha correta para destrancar a porta. A sequência aparece em pop-up no computador e no celular: aproximação, ação no objeto, dados aplicados e registro recuperado. A pista só é liberada depois da ação, com opção de pular a animação. Prévia e execução usam Workers separados; ao continuar digitando, a prévia anterior é cancelada. Código incompleto recebe uma indicação discreta, sem alertas a cada tecla.

O código é executado em Web Worker, com limite de dois segundos e limite de saída. Funções têm verificações com entradas diferentes. DOM e cliente Supabase são modelos locais explícitos para treino. O último caso também permite preparar uma tabela fictícia com SQL e testar uma conexão real de leitura pela API de um projeto Supabase informado pelo jogador. Não há projeto Supabase pré-configurado. Campos de URL e chave não são persistidos; só chaves públicas publishable/anon são aceitas. O SQL limita o acesso da tabela de treino à leitura com RLS.

Resolver o programa recupera um registro. Para concluir, compare o identificador com as fichas e escreva concluirCaso("nome da pessoa");. O comando correto conclui e salva automaticamente, sem seleção manual de pessoas. Progresso de código e conclusão são salvos separadamente.

## Personagem e interface
A detetive usa uma sequência ilustrada de oito poses para caminhar. A animação acompanha a distância percorrida, com aceleração, desaceleração e mudança de direção. Ela avança até a pista somente quando o código do desafio é aprovado. A execução correta abre o pop-up com a ação do objeto e o registro recuperado. Ao fechar, o cenário volta para a sala, mantendo a personagem e sua posição. O computador sinaliza acerto ou erro com texto e cor; código incorreto não abre o pop-up. Ao recomeçar a prática, ela volta ao ponto inicial. Os subpassos mantêm a resposta semelhante em telas com taxas de atualização diferentes. O desenho em repouso não é deformado por recortes de pernas.

As seis salas usam cenários detalhados próprios: arquivos, suporte técnico, recepção, laboratório, farmácia e gestão. Cada uma das 24 fases acrescenta uma ilustração de pista própria à sala, identifica o objeto investigado e posiciona a chegada da detetive junto a ele. A arte vetorial acompanha a largura disponível em celular, tablet e computador. Todo o corredor inferior é reservado para caminhar; os limites dos pés ficam em x=84–678 e y=302–369. A personagem mantém escala comum ao repouso e à caminhada, proporcional à mobília, com os pés ancorados ao piso. Somente uma pose é exibida por vez. Cada caso tem três suspeitos exclusivos: 72 nomes, crachás e retratos sem reutilizar personagens entre casos. Os retratos das pessoas usam a mesma linguagem visual da protagonista, em lugar de rostos geométricos. O nome autenticado aparece no cartão inicial e no cabeçalho, separado da personagem. Preferência por movimento reduzido é respeitada.

As imagens estão em `assets/`. O atlas é recortado na renderização, preservando os arquivos PNG e a transparência. Os oito quadros da caminhada são isolados em memória antes de serem exibidos, evitando cabeças ou pés de poses vizinhas. Consulte `ART_ASSETS.md` para caminhos e prompts das artes.
A interface inclui monitor sem teclado decorativo, pistas fora do desenho, atalhos móveis, botões confortáveis e editor com fonte de 16px em telas pequenas. Verificação visual em navegador e aparelho físico ainda é necessária; os testes automatizados não substituem essa avaliação.

## Arquivo pessoal
O login é por e-mail e senha no Supabase (identity.js); ver a seção de login abaixo.

O caderno usa IndexedDB separado pela conta. O arquivo antigo é preservado e migrado uma vez, sem copiá-lo para outras contas. Textos, fotos, post-its, posições das fichas, descobertas, desafios e conclusões podem ser exportados e restaurados em JSON. Não existe sincronização entre dispositivos. As evidências antigas têm aliases para restauração de cópias anteriores.

## Estrutura e validação
- `index.html`, `lobby.js`: seleção direta dos 24 casos, cartão pessoal e progresso.
- `caso1.html` a `caso24.html`: páginas das investigações.
- `cases.js`, `lessons.js`: histórias, personagens e desafios.
- `case-bootstrap.js`, `movement.js`: cenários e caminhada com limites.
- `app.js`, `worker.js`: editor, execução e correção.
- `characters.js`: fichas, conclusão e persistência dos casos resolvidos.
- `notebook.js`: quadro, fotos, caderno, pastas e cópias de segurança.
- `connection.js`: SQL didático e conexão real opcional do Caso 24.
- `identity.js`, `storage.js`: sessão, separação de contas e migração.
- `theme.js`, `dark-theme.css`: modo escuro. O botão de lua/sol no cabeçalho alterna o tema e guarda a escolha no navegador; sem escolha salva, o jogo segue o tema do sistema. `dark-theme.css` é gerado a partir de `style.css` por `node scripts/build-dark-theme.mjs`: rode de novo sempre que mudar cores no `style.css`. Cenários, retratos, animações e botões amarelos mantêm as cores originais.

`npm test` executa verificações das 24 soluções, 24 cenários ilustrados, conclusões, salvamento e restauração do caderno, isolamento de contas, identidade e limites da caminhada, aceleração, parada, acionamento pelo desafio e consistência de atualização. A conexão real com Supabase depende do projeto e da chave pública do jogador; os testes verificam o modelo de treino.

Não há etapa de compilação: o jogo é servido como está. `npm run build` apenas regenera o dark-theme.css a partir do style.css.

## Comandos de investigação
São funções prontas deste jogo para praticar JavaScript; não são funções nativas da linguagem. A interface mostra os exemplos de cada caso.

- `lerOcorrencia()` abre o relato e a localização.
- `examinarObjeto("terminal")` examina o objeto indicado naquele caso.
- `conferirFicha("Brisa")` abre a ficha de uma das pessoas daquele caso.
- `coletarPista()` envia a pista recuperada ao quadro.
- `anotar("Minha descoberta")` adiciona um post-it ao caderno do caso.
- Cada caso possui uma ação própria com os dados aprendidos: `abrirPorta(senha)`, `imprimirEtiqueta(codigo)`, `abrirGaveta(destino)` e outras.

Os comandos de leitura abrem o resultado após a digitação estar completa. Anotações são salvas apenas ao clicar em Executar comando, evitando post-its com fragmentos do texto. Ações no cenário exigem Executar e argumentos corretos. A prévia não concede progresso nem coleta uma pista ainda não liberada.

`scene-actions.js` controla a ação visual e a revelação. Os testes adicionais verificam as 24 sequências e os comandos com argumentos corretos/incorretos. A conferência visual em navegador e celular continua necessária.

A página Como jogar é acessível pelo menu superior. O caderno inclui a aba Cola de JavaScript: comandos do jogo e exemplos dos 24 conceitos, disponíveis no caso atual e nos concluídos. A seleção usa links nativos sem atrasar a navegação, resposta ao toque e restauração do estado ao voltar.

O monitor organiza o programa em três passos: preparar dados, mostrar valores com console.log e chamar a ação. A conferência informa cada etapa e mostra o que falta dentro do monitor. Inserir uma linha existente seleciona o comando em vez de duplicá-lo. Consultas de ocorrência, objetos e fichas usam um campo separado, preservando o programa do desafio, com exemplos de entrada e resultado. As fichas explicam como comparar o crachá do registro, abrir as pessoas e apresentar a conclusão. As pastas usam navegação direta, sem transformações ao passar o mouse ou transição visual entre páginas.

## Animações de interação
Os 24 casos têm sequências próprias em interactions.js. A caminhada termina antes de a interação começar. No Caso 01, seis quadros mostram a detetive abrir a gaveta, retirar uma pasta e examiná-la. Nos demais casos, 12 poses de interação são combinadas com o objeto da história: controles de rádio, impressão, leitura de crachá e recusa, conferência da escala, registro de chave, rota, estoque, restauração de fichas, normalização do cadastro, gaveta secreta, calibração, JSON, espera de mensagem, painel e leitura da tabela de treino. As animações aparecem no pop-up e têm legenda por etapa. A pista é revelada no fim, com opção explícita de pular. Fechar ou recomeçar cancela os temporizadores, e movimento reduzido mostra o resultado sem aguardar a animação.

Os cenários permanecem livres de elementos desenhados por cima dos móveis. A interação aparece como um detalhe ilustrado no pop-up. O Caso 24 mantém o modelo local de treino do Supabase; a animação não representa uma conexão real. Testes verificam a ordem das 24 sequências e sua integração com o editor. Conferência visual em navegador e aparelho físico continua pendente.

O pop-up de ação mostra a animação em uma única área. O quadro lateral com uma segunda ilustração do objeto e os valores das variáveis foi removido. Os valores continuam no console do programa, e a pista aparece depois da animação.

A conclusão dos 24 casos também usa JavaScript: concluirCaso("nome da pessoa");. O nome é validado contra as fichas do próprio caso, com normalização de acentos e maiúsculas. O registro precisa ter sido recuperado antes. Comando incompleto, nome desconhecido e resposta incorreta não avançam o caso; o acerto salva a conclusão, adiciona a evidência ao quadro e libera o próximo caso. O campo aceita também variáveis e código JavaScript válido. A conferência é feita após uma pausa na digitação ou por Executar conclusão.

As análises seguem o fluxo do jogo SQL de referência: o programa recupera um registro, `analisarPistas()` organiza os achados sem revelar a pessoa responsável, e a comparação com as fichas orienta `concluirCaso("Nome");`. Cada um dos 24 casos tem uma pergunta, uma orientação e um desfecho próprios. A conclusão mostra retrato, crachá, evidência, motivo da resposta e o conceito de JavaScript praticado; a explicação também fica no caderno.

## Investigação, dicas e guia
- Nos casos 7, 19 e 21, o resultado do programa é a pista: o registro não entrega a pessoa responsável, e a conclusão vem do console e dos depoimentos das fichas (`"deduction": "codigo"` em `cases.js`).
- O corretor (`worker.js`) também roda o programa com dados alternativos (`variants` em `lessons.js`). Escrever o resultado final direto não passa. As mensagens orientam sem revelar o valor esperado.
- Dicas em três níveis: a dica de conceito fica sempre visível; a dica 2 aparece depois da primeira tentativa que não deu certo, e a solução depois da segunda.
- O Caso 1 tem um guia passo a passo (`tutorial.js`), que abre na primeira visita e pode ser revisto pelo botão "Ver o guia do caso".
- Casos concluídos mostram, na pasta, a foto da pessoa identificada com o carimbo CULPADO.

## Rodar no seu computador, com login e Supabase
- Dê dois cliques em `INICIAR-JOGO.bat` (ou rode `npm run local`). O jogo abre em http://localhost:5174. Mantenha a janela preta aberta enquanto joga.
- **Login:** e-mail e senha pelo Supabase Auth (`identity.js`). Sem configuração do Supabase, o jogo pede só um nome e guarda tudo no navegador (modo local).
- **Configuração:** `supabase-config.js` (URL e chave pública *anon*; nunca use a chave *service_role* aqui).
- **Banco:** rode `supabase/schema.sql` no SQL Editor do Supabase. Cria a tabela `hospital_dados` com RLS: cada pessoa só lê e altera as próprias linhas.
- **Sincronização:** `sync.js`. O jogo continua gravando no navegador e envia uma cópia para a nuvem (caderno, fotos, progresso e código digitado). Ao abrir em outro aparelho, traz de volta. Casos concluídos nunca diminuem ao juntar dois aparelhos; no mais, vale a gravação mais recente.
- Biblioteca: `vendor/supabase.js` é o pacote oficial supabase-js 2.118.0, servido pelo próprio jogo.

## Computador e tira-dúvidas
- O editor do computador (`code-editor.js`) mostra o código colorido, quebra linhas longas com os números acompanhando e cresce até mostrar o programa inteiro. Continua sendo o mesmo campo de texto, com uma cópia colorida por baixo.
- A professora Mica (`professor.js`) fica fechada num botão com o rosto dela no canto da tela, em cada caso. A conversa abre em pop-up quando a jogadora toca no botão, quando o programa dá erro de JavaScript (o mesmo erro não reabre) ou depois de duas tentativas erradas; nas outras vezes só acende um “!” no botão. No celular o pop-up ocupa a parte de baixo da tela, acima da barra de navegação, e fecha no ✕ ou com Esc. Ela olha o código da jogadora e explica o que falta, traduz os erros do JavaScript para português (inclusive parênteses, chaves e aspas sem par, com a linha), responde dúvidas escritas e traz três perguntas frequentes por caso. Os exemplos nunca usam os dados do caso, para ensinar sem entregar a resposta.
- O corretor (`worker.js`) informa cada problema também como código (`issues`), que o tira-dúvidas usa para escolher a explicação.

## Treino depois do caso, barra de símbolos e símbolo do jogo
- **Casos resolvidos pelo código:** nos casos 7, 10, 16, 18, 19, 20 e 21 o próprio programa aponta a pessoa responsável (comparações, `&&`, `for...of` com `if`, `trim`/`toLowerCase`, função, `map`, `JSON.parse`); as fichas confirmam pelo depoimento. Nos demais, o código recupera um registro e o crachá liga a pessoa à ocorrência.
- **Missões sem receita:** o texto da missão diz o objetivo e os nomes das variáveis; a sintaxe (`if`, `for...of`, `map`…) fica nas dicas, que só aparecem depois de tentativas.
- **Treino extra (`drills.js`):** depois de resolver um caso aparece o painel "Treino extra": **Escrever do zero** (o mesmo desafio com o editor vazio) e de 2 a 5 treinos curtos por caso, com peso maior em funções, objetos e listas de objetos (casos 17, 19 e 20). O corretor é o mesmo (`worker.js` em modo treino: sem a ação do cenário), com dados alternativos e testes de função. O código de cada modo e os treinos feitos ficam em `hospital-code:<uid>:<id>[:vN]:<zero|tN|treino>` e sincronizam como tipo `codigo` (a tabela só aceita `nota`, `config` e `codigo`). `tests/drills.cjs` confere todos os treinos.
- **Barra de símbolos:** em telas de toque, `code-editor.js` mostra uma barra fixa acima do teclado com `{ }`, `( )`, `[ ]`, `" "`, `;`, `=`, `<`, `>`, `+`, `.`, `,`, `!`, `&&`, `||`, `=>`, recuo e nova linha, enquanto um campo de código está em foco. Ela acompanha o teclado pelo `visualViewport`.
- **Nome da pessoa:** quando a conta não tem nome guardado, um pop-up pergunta na primeira vez na tela inicial ("Como devo te chamar?"); tocar no nome no topo de qualquer página abre o mesmo pop-up para trocar. Na nuvem o nome fica na tabela `hospital_perfis` (rode `supabase/perfis.sql`; uma linha por conta, RLS), com cópia em `user_metadata.nome` da conta como reserva; no modo local, no navegador. "Sair" encerra a sessão só no aparelho atual (`signOut({scope:'local'})`): antes, sair no computador deslogava o celular. Se o servidor cancelou a sessão do aparelho (saída global antiga), o jogo percebe ao abrir e mostra a tela de entrar com o e-mail preenchido.
- **Fotos do caderno:** ao adicionar, a imagem é redimensionada (lado maior 1400 px, JPEG; PNG continua PNG e GIF é mantido) para caber no limite de 6 MB por anotação da nuvem.
- **Símbolo:** o mesmo ícone do aplicativo Android (pasta do caso com a foto do hospital e a lupa) é o `favicon.svg` e o símbolo do cabeçalho; a tela de entrar reaproveita o do cabeçalho como marca d'água.

## Publicar na Hostinger (ou em qualquer hospedagem estática)
O jogo é um site estático na raiz do repositório. `npm run build` regenera o tema escuro e monta `dist/` só com os arquivos do jogo (sem testes, scripts, SQL e documentação). Na Hostinger (Node.js app, *Implantação de GitHub*), use: **Framework** Other · **Ramo** main · **Comando de build** `build` · **Diretório de saída** `dist` · **Arquivo de entrada** vazio (assim ela publica `dist/` como site estático, sem processo Node). Se preferir rodar como app com servidor, coloque `server.js` no arquivo de entrada: é um servidor estático mínimo que escuta na porta de `PORT` e esconde testes, scripts e SQL. Um 503 na Hostinger significa que o processo Node não subiu: normalmente arquivo de entrada errado (ela tentava rodar o `app.js` do jogo, que é código de navegador). No Supabase, adicione o endereço do site em Authentication → URL Configuration (Site URL e Redirect URLs). Testes: `npm test`. Servidor local: `npm run local` ou INICIAR-JOGO.bat.
