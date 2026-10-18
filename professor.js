'use strict';
// Tira-dúvidas da professora Mica: explica o código da jogadora, traduz erros do JavaScript e responde dúvidas,
// sempre com exemplos diferentes dos dados do caso, para ensinar sem entregar a resposta.
(()=>{
 // ---------- perguntas frequentes de cada caso (q: pergunta, a: resposta, x: exemplo, k: palavras-chave) ----------
 const faq={
  1:[{q:'O que é uma variável?',a:'É uma caixinha com nome que guarda um valor para usar depois. Você cria com const, dá um nome e guarda o valor com =.',x:'const corDaPorta = "verde";',k:'variavel caixinha guardar valor criar'},
     {q:'Para que servem as aspas?',a:'As aspas avisam que aquilo é um texto. Sem aspas, o JavaScript acha que é um número ou o nome de outra variável.',x:'const animal = "gato";  // texto\nconst idade = 3;        // número',k:'aspas texto string'},
     {q:'O que o console.log faz?',a:'Mostra um valor na saída do computador, para você conferir o que está guardado.',x:'console.log(corDaPorta);',k:'console log mostrar saida ver'}],
  2:[{q:'Qual a diferença entre const e let?',a:'const guarda um valor que não muda. let guarda um valor que pode mudar depois. Se a informação vai ser atualizada, use let.',x:'let placar = 0;\nplacar = 3;',k:'const let diferenca mudar'},
     {q:'Como mudo o valor de uma variável?',a:'Escreva só o nome, o sinal = e o novo valor. Não repita let: ele só cria a variável uma vez.',x:'let luz = "apagada";\nluz = "acesa";',k:'mudar atualizar trocar valor atribuicao'},
     {q:'Por que dá erro escrever let duas vezes?',a:'let cria a variável. Criar de novo com o mesmo nome confunde o JavaScript. Para atualizar, use apenas o nome.',k:'let duas vezes declarar erro already declared'}],
  3:[{q:'Maiúsculas e minúsculas fazem diferença?',a:'Fazem! nomeAluno e nomealuno são nomes diferentes para o JavaScript. Escreva sempre do mesmo jeito que a missão pede.',k:'maiuscula minuscula diferenca nome'},
     {q:'Posso usar espaço ou acento no nome?',a:'Espaço não pode: junte as palavras e comece a segunda com maiúscula. Evite acentos e comece sempre com uma letra.',x:'const codigoDaSala = "C-12";',k:'espaco acento nome regra'},
     {q:'Como mostro duas variáveis no console?',a:'Separe com vírgula dentro do console.log. As duas aparecem na mesma linha.',x:'console.log(sala, andar);',k:'duas variaveis virgula console'}],
  4:[{q:'Qual a diferença entre número e texto?',a:'Número não usa aspas e serve para contas. Texto usa aspas e guarda os caracteres como estão. "7" + 1 vira "71"; 7 + 1 vira 8.',k:'numero texto diferenca string number'},
     {q:'O que o typeof mostra?',a:'Diz o tipo de um valor: "number" para números e "string" para textos.',x:'console.log(typeof 10);    // number\nconsole.log(typeof "oi");  // string',k:'typeof tipo'},
     {q:'Por que os zeros da frente somem?',a:'Em números, zeros à esquerda não contam: 007 vira 7. Para manter os zeros, guarde como texto, entre aspas.',x:'const senhaDoCofre = "007";',k:'zero zeros frente esquerda somem'}],
  5:[{q:'Como junto textos?',a:'Com o sinal +. Ele cola um texto no outro, exatamente como estão.',x:'const saudacao = "bom " + "dia";',k:'juntar junto juntos texto textos concatenar mais colar'},
     {q:'Por que meu texto saiu grudado?',a:'O + não coloca espaço sozinho. O espaço (ou o traço) precisa estar dentro das aspas de um dos textos.',x:'"Quarto " + numero',k:'grudado espaco junto colado'},
     {q:'Posso juntar texto com variável?',a:'Pode! A parte fixa vai entre aspas; a variável entra sem aspas.',x:'const aviso = "Olá, " + nome;',k:'texto variavel juntar'}],
  6:[{q:'Como monto uma frase com várias variáveis?',a:'Junte partes fixas e variáveis com +, uma depois da outra. Repare nos espaços e na pontuação das partes fixas.',x:'"Paciente: " + nome + " - Quarto: " + quarto',k:'frase montar varias variaveis relatorio'},
     {q:'Como confiro se a frase ficou certa?',a:'Mostre no console e compare letra por letra com a pista: espaços, dois-pontos e barras também contam.',k:'conferir frase certa comparar'},
     {q:'Por que usar variáveis em vez de escrever a frase pronta?',a:'Porque os dados mudam. Uma frase montada com variáveis se atualiza sozinha quando os valores mudarem.',k:'por que variaveis pronta escrever'}],
  7:[{q:'O que são true e false?',a:'São os valores booleanos: sim (true) e não (false). Toda comparação responde com um deles.',k:'true false booleano boolean'},
     {q:'Quais sinais de comparação existem?',a:'< menor, > maior, <= menor ou igual, >= maior ou igual, === igual e !== diferente.',x:'console.log(10 > 3);  // true',k:'comparacao sinais menor maior igual'},
     {q:'Por que não escrever true direto?',a:'Porque o programa precisa descobrir sozinho. Se os dados mudarem, a comparação calcula de novo; um true escrito à mão continuaria igual.',k:'true direto escrever calcular'}],
  8:[{q:'Como funciona o if?',a:'if (condição) { ... } roda o que está entre chaves somente quando a condição é true.',x:'if (temChave) {\n  porta = "aberta";\n}',k:'if se condicao funciona'},
     {q:'Preciso escrever === true no if?',a:'Não precisa. if (ligado) já pergunta se ligado é true.',k:'=== true if precisa'},
     {q:'Para que servem as chaves { }?',a:'Elas marcam o bloco que o if controla. Tudo dentro delas só roda quando a condição é verdadeira.',k:'chaves bloco {}'}],
  9:[{q:'O que o else faz?',a:'É o caminho do contrário: roda quando a condição do if é false.',x:'if (chovendo) {\n  roupa = "capa";\n} else {\n  roupa = "camiseta";\n}',k:'else senao contrario'},
     {q:'O else precisa de condição?',a:'Não. Ele pega todos os casos que não entraram no if.',k:'else condicao precisa'},
     {q:'Onde escrevo o else?',a:'Logo depois da chave } que fecha o if: } else { ... }',k:'onde escrever else'}],
  10:[{q:'O que significa &&?',a:'É o "e": só dá true se as duas partes forem true.',x:'temIngresso && maiorDeIdade',k:'&& e duas condicoes'},
      {q:'Qual a diferença entre = e ===?',a:'= guarda um valor numa variável. === compara dois valores e responde true ou false.',k:'= === igual diferenca comparar'},
      {q:'Por que usar === e não ==?',a:'=== compara valor e tipo juntos, sem surpresas: 5 === "5" é false, porque um é número e o outro é texto.',k:'== === por que'}],
  11:[{q:'O que significa ||?',a:'É o "ou": dá true se pelo menos uma das partes for true.',x:'dia === "sábado" || dia === "domingo"',k:'|| ou alternativa'},
      {q:'Posso escrever cargo === "a" || "b"?',a:'Não funciona como parece. Repita a comparação inteira dos dois lados do ||.',x:'tipo === "a" || tipo === "b"',k:'|| repetir comparacao'},
      {q:'Quando uso && e quando uso ||?',a:'&& quando as duas coisas precisam ser verdade; || quando basta uma delas.',k:'&& || quando usar'}],
  12:[{q:'Como combino && e || na mesma condição?',a:'Use parênteses para agrupar o que vai junto. Eles dizem o que é avaliado primeiro.',x:'temPasse && (setor === "x" || setor === "y")',k:'combinar && || parenteses'},
      {q:'Por que os parênteses importam?',a:'Sem eles, o && é resolvido antes do ||, e a regra pode mudar de sentido.',k:'parenteses importam ordem'},
      {q:'Como guardo o resultado do if numa variável?',a:'Crie com let antes do if e mude o valor dentro do if e do else.',x:'let aviso = "";\nif (pronto) {\n  aviso = "sim";\n} else {\n  aviso = "não";\n}',k:'guardar resultado if variavel'}],
  13:[{q:'O que é uma lista (array)?',a:'Uma variável que guarda vários valores em ordem, entre colchetes.',x:'const cores = ["azul", "verde", "roxo"];',k:'lista array colchetes'},
      {q:'Por que a primeira posição é 0?',a:'No JavaScript, a contagem das posições começa em zero: cores[0] é o primeiro item, cores[1] o segundo.',k:'posicao zero primeira indice'},
      {q:'Como pego o último item?',a:'Use o tamanho da lista menos um.',x:'cores[cores.length - 1]',k:'ultimo item length'}],
  14:[{q:'Como acrescento um item na lista?',a:'Com push. O item entra no fim da lista.',x:'cores.push("laranja");',k:'push acrescentar adicionar'},
      {q:'Como sei se um item está na lista?',a:'Com includes, que responde true ou false.',x:'cores.includes("azul")',k:'includes contem existe esta'},
      {q:'Por que consigo usar push numa lista criada com const?',a:'const impede trocar a lista por outra, mas deixa mexer no que está dentro dela.',k:'push const lista'}],
  15:[{q:'Como funciona o for...of?',a:'Ele visita cada item da lista, um de cada vez, e roda o bloco para cada um.',x:'for (const cor of cores) {\n  console.log(cor);\n}',k:'for of laco repeticao percorrer'},
      {q:'Como vou juntando texto dentro do laço?',a:'Crie um texto vazio com let antes do laço e acrescente a cada volta.',x:'let frase = "";\nfor (const p of palavras) {\n  frase += p + " ";\n}',k:'juntar texto laco acumular'},
      {q:'O que é +=?',a:'É um atalho: x += "a" é o mesmo que x = x + "a".',k:'+= mais igual atalho'}],
  16:[{q:'Como separo só alguns itens da lista?',a:'Percorra com for...of e use if para decidir. Quando o item passar no teste, faça push numa lista nova.',k:'separar filtrar alguns itens'},
      {q:'Onde coloco o push?',a:'Dentro do if, que fica dentro do for. Assim só os itens aprovados entram na lista nova.',x:'for (const nota of notas) {\n  if (nota >= 7) {\n    aprovadas.push(nota);\n  }\n}',k:'onde push dentro if for'},
      {q:'Por que a lista nova começa vazia?',a:'Porque ela vai sendo preenchida durante o laço, a cada item aprovado.',x:'const aprovadas = [];',k:'lista vazia comeca'}],
  17:[{q:'O que é um objeto?',a:'Uma variável que guarda vários dados, cada um com um nome (propriedade).',x:'const paciente = { nome: "Rui", quarto: 12 };',k:'objeto propriedades chaves'},
      {q:'Como leio uma propriedade?',a:'Com ponto: o nome do objeto, um ponto e o nome da propriedade.',x:'paciente.nome  // "Rui"',k:'ler leio propriedade campo objeto ponto acessar'},
      {q:'E se o nome da propriedade estiver errado?',a:'Você recebe undefined, que quer dizer "não existe". Confira o nome exato, com as mesmas letras.',k:'undefined propriedade errada'}],
  18:[{q:'O que o trim faz?',a:'Remove os espaços do começo e do fim do texto.',x:'"  oi  ".trim()  // "oi"',k:'trim espacos remover'},
      {q:'Como deixo tudo em minúsculas?',a:'Com toLowerCase(). Atenção ao L maiúsculo no nome do método.',x:'"BOM DIA".toLowerCase()  // "bom dia"',k:'minusculas tolowercase lower'},
      {q:'Posso usar os dois de uma vez?',a:'Pode encadear: primeiro um, depois o outro, cada um com seus parênteses.',x:'texto.trim().toLowerCase()',k:'encadear metodos seguidos trim tolowercase'}],
  19:[{q:'O que é uma função?',a:'Uma regra com nome que você pode usar várias vezes. Ela recebe valores (parâmetros) e devolve um resultado com return.',x:'function dobro(n) {\n  return n * 2;\n}',k:'funcao function regra'},
      {q:'O que o return faz?',a:'Devolve o resultado para quem chamou a função. Sem return, a função devolve undefined.',k:'return devolver retornar'},
      {q:'O que são parâmetros?',a:'São os nomes que recebem os valores na hora da chamada: em dobro(5), o parâmetro n vale 5.',k:'parametros argumentos receber'}],
  20:[{q:'O que o map faz?',a:'Cria uma lista nova aplicando a mesma transformação a cada item.',x:'[1, 2, 3].map(n => n * 10)  // [10, 20, 30]',k:'map transformar lista'},
      {q:'O que é essa seta =>?',a:'É uma função curta: n => n * 10 recebe n e devolve n * 10.',k:'=> seta arrow funcao curta'},
      {q:'O map muda a lista original?',a:'Não. Ele devolve uma lista nova, e a original continua igual.',k:'map original muda'}],
  21:[{q:'O que é JSON?',a:'Um formato de texto para guardar e enviar dados. Parece um objeto, mas chega como texto.',x:'\'{"cor":"azul"}\'',k:'json formato texto'},
      {q:'Por que preciso do JSON.parse?',a:'Porque o JSON chega como texto. JSON.parse transforma esse texto em objeto, e aí você lê os campos com ponto.',k:'json parse converter'},
      {q:'Como leio um campo depois do parse?',a:'Guarde o resultado numa variável e use o ponto.',x:'const dados = JSON.parse(texto);\nconsole.log(dados.cor);',k:'ler campo parse ponto'}],
  22:[{q:'O que é uma Promise?',a:'Uma promessa de valor que ainda vai chegar, como uma resposta que vem pela internet.',k:'promise promessa'},
      {q:'O que o await faz?',a:'Espera a Promise terminar e entrega o valor que ela trouxe.',x:'const valor = await promessa;',k:'await esperar'},
      {q:'Por que sem await aparece algo estranho?',a:'Sem esperar, você guarda a promessa, e não o valor que ela traz.',k:'sem await estranho promise'}],
  23:[{q:'O que é o DOM?',a:'É a página vista pelo JavaScript: cada parte da tela vira um elemento que o código pode ler e mudar.',k:'dom pagina elemento'},
      {q:'Como encontro um elemento?',a:'Com document.getElementById e o id do elemento entre aspas.',x:'const titulo = document.getElementById("titulo");',k:'encontrar elemento getelementbyid'},
      {q:'Como troco o texto da tela?',a:'Mude a propriedade textContent do elemento.',x:'titulo.textContent = "Novo título";',k:'trocar texto textcontent tela'}],
  24:[{q:'O que o Supabase faz aqui?',a:'Guarda dados numa tabela na internet. O JavaScript pede os dados com from("tabela").select().',k:'supabase banco tabela'},
      {q:'O que vem em data e em error?',a:'data traz as linhas encontradas, numa lista. error explica o que deu errado, ou é null quando deu tudo certo.',k:'data error resposta'},
      {q:'Como sei quantos itens uma lista tem?',a:'Toda lista tem a propriedade length.',x:'["a", "b", "c"].length  // 3',k:'quantos itens length tamanho contar'}]
 };
 const general=[
  {q:'Como funciona um caso?',a:'Leia a pista, complete o programa no computador e clique em Executar. Depois, compare as fichas e escreva concluirCaso("Nome da pessoa").',k:'como funciona caso jogar passos'},
  {q:'O que é a função de ação do caso?',a:'É uma função pronta do jogo que usa os dados que você preparou para agir no cenário, como abrir uma porta ou ligar um rádio.',k:'funcao acao jogo pronta'},
  {q:'Como concluo o caso?',a:'Depois de recuperar o registro, escreva concluirCaso("Nome da pessoa"); no campo de conclusão, com o nome que o registro e as fichas apontam.',k:'concluir caso concluircaso fim'},
  {q:'Por que a solução fica escondida?',a:'As dicas 2 e 3 aparecem depois que você tenta. Errar faz parte de aprender, e eu ajudo no caminho.',k:'solucao escondida dica'}
 ];
 // ---------- explicações para cada tipo de problema encontrado pelo corretor ----------
 const typeText={string:'precisa ser um texto. Texto vai entre aspas. Sem aspas, o JavaScript entende um número ou o nome de outra variável.',number:'precisa ser um número, sem aspas. "12" com aspas é texto; 12 sem aspas é número e serve para contas.',boolean:'precisa ser true ou false, sem aspas. Com aspas, "true" vira só um texto.',list:'precisa ser uma lista, entre colchetes [ ].',object:'precisa ser um objeto, entre chaves { }.'};
 // Exemplos com o tema do caso (o objeto investigado), sempre com outros nomes e valores, para não entregar a resposta.
 const camel=text=>normalize(text).split(/[^a-z0-9]+/).filter(Boolean).map(word=>word[0].toUpperCase()+word.slice(1)).join('');
 function examples(lesson){
  const thing=camel(lesson?.action?.object||'sala')||'Sala',lower=thing[0].toLowerCase()+thing.slice(1);
  return{string:'const modelo'+thing+' = "modelo B";',number:'const andar'+thing+' = 3;',boolean:'const '+lower+'Ligado = true;',list:'const pecas'+thing+' = ["cabo", "tampa"];',object:'const ficha'+thing+' = { andar: 3 };',variable:'const etiqueta'+thing+' = "verde";',log:'console.log(etiqueta'+thing+');',mutable:'let estado'+thing+' = "desligado";\nestado'+thing+' = "pronto";'};
 }
 const caseOf=lesson=>((typeof window!=='undefined'&&window.HospitalCases)||[]).find(entry=>entry.id===lesson?.case);
 const clueCard=lesson=>{const found=caseOf(lesson);return 'Releia o cartão “Pista da investigação”'+(found?' do caso “'+found.title+'”':'')+', ao lado do cenário';};
 function explainIssue(issue,lesson){
  const n=issue.name,action=lesson?.action?(lesson.action.name+'('+lesson.action.args.join(', ')+');'):'',ex=examples(lesson);
  switch(issue.code){
   case 'missing':return{title:'Falta criar '+n,text:'Ainda não encontrei a variável '+n+' no seu programa. Uma variável nasce com const ou let, um nome, o sinal = e um valor. Confira se o nome está igualzinho ao da missão, com as mesmas maiúsculas.',example:ex.variable};
   case 'type':return{title:n+' está com o tipo errado',text:n+' '+(typeText[issue.expected]||'está com o tipo errado.'),example:ex[issue.expected]};
   case 'value':
    if(issue.empty)return{title:n+' ainda está vazia',text:issue.expected==='list'?'A lista '+n+' ainda está vazia. Ela precisa receber itens: confira se o push está dentro do if e do laço.':n+' existe, mas ainda não guarda nada. '+clueCard(lesson)+', e coloque a informação no lugar certo.'};
    return{title:n+' ainda não tem o valor certo',text:issue.expected==='boolean'?'Leia a comparação em voz alta, como uma pergunta, e veja se a resposta seria sim (true) ou não (false).':issue.expected==='number'?n+' é um número, mas não o esperado. '+clueCard(lesson)+' e, se houver conta, confira a operação.':issue.expected==='list'?'A lista '+n+' tem itens diferentes do esperado. Mostre a lista no console e compare com o cartão “Pista da investigação”.':'Mostre '+n+' no console e compare com o cartão “Pista da investigação”, letra por letra: espaços, maiúsculas e pontuação contam.'};
   case 'function-missing':return{title:'Falta criar a função '+n,text:'Uma função começa com function, o nome, os parâmetros entre parênteses e o corpo entre chaves, com um return.',example:'function dobro(numero) {\n  return numero * 2;\n}'};
   case 'function-test':return{title:'A função '+n+' precisa servir para outros valores',text:'Ela funciona com os dados deste caso, mas não com outros. Confira se ela usa os parâmetros, e não números escritos à mão, e se devolve o resultado com return.'};
   case 'function-error':return{title:'A função '+n+' deu erro',text:'Quando testei com outros valores, ela parou com erro. Confira se tudo o que ela usa existe dentro dela.'};
   case 'dom':return{title:'O texto da página ainda não mudou',text:'Para trocar o texto de um elemento, mude a propriedade textContent dele.',example:'elemento.textContent = "Novo aviso";'};
   case 'variant':return{title:'Funciona hoje, mas e amanhã?',text:'Seu programa acertou com os dados de hoje. Um bom programa acerta com quaisquer dados: se a pista mudar, o resultado deve ser calculado a partir das variáveis, e não escrito à mão. '+(lesson?.conceptHint||'')};
   case 'console':return{title:'Falta mostrar o resultado',text:'O console.log mostra valores na saída do computador. Coloque entre os parênteses as variáveis que você quer ver.',example:ex.log};
   case 'action-missing':return{title:'Falta a última linha',text:'Falta chamar a função do jogo que usa seus dados no cenário: '+action};
   case 'action-args':return{title:'A ação recebeu outros dados',text:'A função foi chamada, mas com valores diferentes dos que você preparou. Passe as variáveis, sem aspas, como na missão: '+action};
   case 'action-waiting':return{title:'A última linha já está certa',text:'A chamada '+action+' está no lugar. Ela só vai funcionar quando os dados do passo 1 estiverem certos, então foque neles primeiro.'};
   case 'mutable':return{title:n+' precisa poder mudar',text:'Como o valor de '+n+' muda no meio do programa, ela deve ser criada com let, e não com const.',example:ex.mutable};
   case 'requires':return{title:'Este caso pede '+n,text:'O desafio aqui é praticar '+n+'. Tente resolver usando '+n+', do jeito que a missão pede.'};
   default:return{title:'Vamos olhar juntos',text:'Releia a missão com calma e compare com o seu programa, linha por linha.'};
  }
 }
 // Mostra no máximo duas explicações: primeiro os dados, depois o console e a ação.
 function explainResult(result,lesson,code){
  if(!result)return[];
  if(result.timeout)return[{title:'O programa não terminou',text:'Ele passou de dois segundos rodando. Normalmente é uma repetição que nunca acaba: confira se o laço tem um fim.'}];
  if(!result.ok)return[explainError(result.error,code)];
  if(result.passed)return[{title:'Seu programa está pronto!',text:'Está tudo no lugar. Clique em ▶ Executar programa para ver a detetive agir.'}];
  const issues=result.issues||[],data=issues.filter(i=>!['console','action-missing','action-args','action-waiting'].includes(i.code)),rest=issues.filter(i=>!data.includes(i));
  // Várias variáveis faltando viram uma fala só.
  const missing=data.filter(issue=>issue.code==='missing');
  if(missing.length>1){const names=missing.map(issue=>issue.name),list=names.slice(0,-1).join(', ')+' e '+names.at(-1);return[{title:'Faltam criar '+list,text:'Ainda não encontrei as variáveis '+list+' no seu programa. Cada variável nasce com const ou let, um nome, o sinal = e um valor. Confira se os nomes estão igualzinhos aos da missão, com as mesmas maiúsculas.',example:examples(lesson).variable},...data.filter(issue=>issue.code!=='missing').slice(0,1).map(issue=>explainIssue(issue,lesson))];}
  return(data.length?data:rest).slice(0,2).map(issue=>explainIssue(issue,lesson));
 }
 // ---------- erros do JavaScript em português ----------
 // Procura o par que faltou (parêntese, chave, colchete ou aspas) e em que linha ele abriu.
 const pairs={'(':')','[':']','{':'}'},names={'(':'um parêntese (','[':'um colchete [','{':'uma chave {',')':'um parêntese )',']':'um colchete ]','}':'uma chave }'};
 function balance(code){
  const stack=[];let line=1,quote=null,quoteLine=0;
  for(let i=0;i<code.length;i++){
   const char=code[i];
   if(char==='\n'){if(quote&&quote!=='`')return{kind:'string',line:quoteLine};line++;continue;}
   if(quote){if(char==='\\')i++;else if(char===quote)quote=null;continue;}
   if(char==='/'&&code[i+1]==='/'){while(i<code.length&&code[i+1]!=='\n')i++;continue;}
   if(char==='"'||char==="'"||char==='`'){quote=char;quoteLine=line;continue;}
   if(pairs[char])stack.push({char,line});
   else if(')]}'.includes(char)){const open=stack.pop();if(!open||pairs[open.char]!==char)return{kind:'close',char,line,open};}
  }
  if(quote)return{kind:'string',line:quoteLine};
  return stack.length?{kind:'open',...stack.at(-1)}:null;
 }
 function explainError(error,code){
  const message=String(error?.message||''),name=error?.name||'';
  if(name==='SyntaxError'&&typeof code==='string'){
   const found=balance(code),detail=name+': '+message;
   if(found?.kind==='string')return{title:'Um texto ficou sem fechar',text:'Na linha '+found.line+', um texto abriu aspas e não fechou. Confira se cada " tem a sua dupla na mesma linha.',detail};
   if(found?.kind==='open')return{title:'Falta fechar '+names[found.char].replace(/^(um|uma) /,''),text:'Na linha '+found.line+', '+names[found.char]+' abriu e não fechou. Procure onde ela deveria terminar e feche com '+pairs[found.char]+'.',detail};
   if(found?.kind==='close')return{title:'Sobrou '+names[found.char].replace(/^(um|uma) /,''),text:'Na linha '+found.line+' aparece '+names[found.char]+(found.open?' fechando '+names[found.open.char]+' da linha '+found.open.line+'. Confira se os pares estão na ordem certa.':' sem ter aberto antes. Talvez ela esteja sobrando.'),detail};
   // Parênteses completos, mas o JavaScript reclama da lista de valores: falta separar ou juntar.
   if(!found&&/missing \) after argument list/.test(message))return{title:'Falta uma vírgula ou um +',text:'Os parênteses estão completos, mas há dois valores lado a lado. Use vírgula para separar (console.log(a, b)) ou + para juntar textos ("a" + "b").',detail};
  }
  const rules=[
   [/Unexpected end of input/,()=>({title:'Falta fechar alguma coisa',text:'O programa acabou antes da hora: falta fechar um parêntese ), uma chave } ou um colchete ]. Confira se cada um que abre tem o seu par.'})],
   [/Invalid or unexpected token|Unterminated string/,()=>({title:'Um texto ficou sem fechar',text:'Parece que um texto ficou sem as aspas do fim, ou há um caractere estranho. Confira se cada " tem a sua dupla.'})],
   [/missing \) after argument list/,()=>({title:'Falta fechar um parêntese',text:'Numa chamada como console.log(...), faltou o ) do fim, ou uma vírgula entre os valores.'})],
   [/Unexpected identifier/,()=>({title:'Duas palavras juntas demais',text:'Há duas palavras lado a lado sem nada entre elas. Talvez falte um +, uma vírgula, um ponto e vírgula ou aspas.'})],
   [/Unexpected string/,()=>({title:'Dois textos lado a lado',text:'Há um texto logo depois de outro valor. Para juntar, use +; para separar valores, use vírgula.'})],
   [/Unexpected number/,()=>({title:'Um número fora do lugar',text:'Apareceu um número onde o JavaScript não esperava. Confira se falta um operador (+, <, =) ou uma vírgula perto dele.'})],
   [/Unexpected token '?([^'\s]+)'?/,match=>({title:'Algo fora do lugar: '+match[1],text:'O sinal '+match[1]+' apareceu onde o JavaScript não esperava. Confira as aspas, vírgulas e parênteses logo antes dele.'})],
   [/Assignment to constant variable/,()=>({title:'Essa variável não pode mudar',text:'Você tentou mudar uma variável criada com const. Para valores que mudam, crie com let.',example:'let placar = 0;\nplacar = 2;'})],
   [/Identifier '([^']+)' has already been declared/,match=>({title:match[1]+' foi criada duas vezes',text:'A variável '+match[1]+' foi criada mais de uma vez. Crie uma vez só (com const ou let) e depois use apenas o nome.'})],
   [/Cannot access '([^']+)' before initialization/,match=>({title:match[1]+' foi usada antes de ser criada',text:'Você usou '+match[1]+' numa linha acima da que a cria. Coloque a criação antes do uso.'})],
   [/([\w$]+) is not defined/,match=>({title:'O JavaScript não conhece '+match[1],text:'O nome '+match[1]+' não existe no programa. Pode ser um erro de digitação, uma maiúscula diferente ou uma variável que ainda não foi criada.'})],
   [/Cannot read properties of (undefined|null) \(reading '([^']+)'\)/,match=>({title:'Tentou ler .'+match[2]+' de algo vazio',text:'Antes do .'+match[2]+' há um valor vazio ('+match[1]+'). Confira se o objeto ou o elemento existe e se o nome está certo.'})],
   [/([\w$.]+) is not a function/,match=>({title:match[1]+' não é uma função',text:'Confira o nome, letra por letra (por exemplo, toLowerCase tem um L maiúsculo), e se essa função existe para esse tipo de dado.'})],
   [/JSON|is not valid JSON/,()=>({title:'Esse texto não é um JSON válido',text:'O JSON.parse só entende texto no formato JSON, com aspas duplas nos nomes dos campos.'})]
  ];
  for(const [pattern,build]of rules){const match=message.match(pattern);if(match)return{...build(match),detail:name+': '+message};}
  return{title:'O JavaScript avisou um problema',text:'Leia o aviso com calma. Ele costuma indicar o que está faltando ou sobrando.',detail:name?name+': '+message:message};
 }
 // ---------- entender a pergunta escrita ----------
 const normalize=value=>String(value).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 const stopwords=new Set('o a os as e de do da dos das um uma que para pra pro como eu meu minha no na nos nas se por qual quais serve servem fazer faz faco isso esse essa este esta com sem mais muito ja nao sim the ao aos e qual quando onde porque por que'.split(' '));
 const words=text=>(normalize(text).match(/===|!==|&&|\|\||\+=|=>|[a-z0-9.]+/g)||[]).filter(word=>!stopwords.has(word));
 const close=(a,b)=>a===b||(a.length>=5&&b.length>=5&&a.slice(0,5)===b.slice(0,5));
 function search(question,lessonId){
  const asked=words(question);if(!asked.length)return null;
  let best=null,source=null,currentId=null;
  // Palavras-chave escolhidas valem mais do que palavras soltas do texto da pergunta.
  const consider=(entry,bonus)=>{const keys=words(entry.k),title=words(entry.q);let score=0;for(const word of asked)score+=keys.some(key=>close(word,key))?1:title.some(key=>close(word,key))?.5:0;if(score&&(!best||score+bonus>best.score)){best={entry,score:score+bonus};source=currentId;}};
  currentId=lessonId;for(const entry of faq[lessonId]||[])consider(entry,.5);
  currentId=null;for(const entry of general)consider(entry,.25);
  for(const [id,entries]of Object.entries(faq))if(Number(id)!==lessonId){currentId=Number(id);for(const entry of entries)consider(entry,0);}
  return best?{...best.entry,lessonId:source}:null;
 }
 function intent(question){
  const text=normalize(question);
  if(/resposta|solucao|gabarito|cola/.test(text))return'answer';
  if(/\berro\b|deu errado|nao funciona|nao roda/.test(text))return'error';
  if(/meu codigo|olha|olhe|confere|confira|travei|nao sei|nao consigo|ajuda|o que falta/.test(text))return'check';
  return null;
 }
 window.HospitalProfessor={faq,general,explainIssue,explainResult,explainError,search,intent};

 // ---------- painel na página do caso ----------
 const computer=document.getElementById('investigation-computer'),item=window.HospitalActiveCase;
 if(!computer||!item||typeof document.createElement!=='function')return;
 const lesson=(window.HospitalLessons||[]).find(entry=>entry.case===item.id);
 const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
 const panel=el('section','professor-panel');panel.id='professor';panel.setAttribute('aria-labelledby','professor-title');
 const head=el('div','professor-head'),face=el('span','professor-avatar'),titles=el('div'),portrait=el('img');
 portrait.src='assets/professor-mica-avatar.jpg';portrait.alt='Retrato da professora Mica, com cabelo preto curto cacheado volumoso e óculos lilás';portrait.width=portrait.height=128;portrait.decoding='async';face.append(portrait);
 const title=el('h3','','Tira-dúvidas');title.id='professor-title';titles.append(title,el('p','','Mica · professora de JavaScript do Hospital Santa Aurora'));head.append(face,titles);
 const log=el('div','professor-log');log.setAttribute('role','log');log.setAttribute('aria-live','polite');
 const chips=el('div','professor-chips'),checkChip=el('button','professor-chip','🔍 Olhar meu código'),errorChip=el('button','professor-chip professor-chip-alert','⚠ Explicar o erro');
 checkChip.type=errorChip.type='button';errorChip.hidden=true;chips.append(checkChip,errorChip);
 for(const entry of faq[lesson?.id]||[]){const chip=el('button','professor-chip',entry.q);chip.type='button';chip.addEventListener('click',()=>{say('user',entry.q);answerEntry(entry);});chips.append(chip);}
 const form=el('form','professor-ask'),label=el('label','sr','Sua dúvida'),input=el('input'),ask=el('button','small-button','Perguntar');
 input.id='professor-question';label.htmlFor=input.id;input.type='text';input.maxLength=200;input.autocomplete='off';input.placeholder='Escreva sua dúvida… ex.: para que servem as aspas?';ask.type='submit';form.append(label,input,ask);
 // Fechada por padrão: um botão com o rosto da Mica fica no canto e abre a conversa num pop-up.
 const closeButton=el('button','professor-close','✕');closeButton.type='button';closeButton.setAttribute('aria-label','Fechar o tira-dúvidas');head.append(closeButton);
 panel.classList.add('professor-popup');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.hidden=true;
 const fab=el('button','mica-fab'),fabFace=el('img'),badge=el('span','mica-fab-badge','!');
 fab.type='button';fab.setAttribute('aria-controls','professor');fab.setAttribute('aria-expanded','false');fab.setAttribute('aria-label','Abrir o tira-dúvidas da professora Mica');
 fabFace.src=portrait.getAttribute('src');fabFace.alt='';fabFace.width=fabFace.height=96;badge.hidden=true;badge.setAttribute('aria-hidden','true');
 fab.append(fabFace,el('span','mica-fab-label','Dúvidas?'),badge);
 panel.append(head,log,chips,form);document.body.append(panel,fab);
 function openPanel(focusInput){
  if(panel.hidden){panel.hidden=false;fab.setAttribute('aria-expanded','true');fab.classList.add('is-open');}
  badge.hidden=true;log.scrollTop=log.scrollHeight;if(focusInput)input.focus({preventScroll:true});
 }
 function closePanel(){panel.hidden=true;fab.setAttribute('aria-expanded','false');fab.classList.remove('is-open');fab.focus({preventScroll:true});}
 fab.addEventListener('click',()=>panel.hidden?openPanel(true):closePanel());
 closeButton.addEventListener('click',closePanel);
 panel.addEventListener('keydown',event=>{if(event.key==='Escape')closePanel();});
 // Uma fala na conversa: título, texto, exemplo de código e, se houver, o aviso original do JavaScript.
 function say(who,text,extra={}){
  const bubble=el('div','professor-bubble professor-'+who);
  if(extra.title)bubble.append(el('strong','',extra.title));
  bubble.append(el('p','',text));
  if(extra.example){const pre=el('pre','professor-example');pre.textContent=extra.example;bubble.append(pre);}
  if(extra.detail){const small=el('small','professor-detail','Aviso do JavaScript: '+extra.detail);bubble.append(small);}
  log.append(bubble);while(log.children.length>14)log.firstElementChild.remove();
  log.scrollTop=log.scrollHeight;return bubble;
 }
 const teach=explanation=>say('ada',explanation.text,explanation);
 function answerEntry(entry){say('ada',entry.a,{title:entry.q,example:entry.x});}
 let lastResult=null,offered=false,checking=null;
 function checkCode(){
  if(checking)return;
  checkChip.disabled=true;say('ada','Deixa eu olhar o seu programa…');
  let worker;try{worker=new Worker('worker.js');}catch{checkChip.disabled=false;say('ada','Não consegui abrir o computador agora. Atualize a página e tente de novo.');return;}
  checking=worker;const source=document.getElementById('code').value;
  const done=()=>{worker.terminate();checking=null;checkChip.disabled=false;};
  const limit=setTimeout(()=>{done();teach(explainResult({timeout:true},lesson)[0]);},2500);
  worker.onmessage=event=>{clearTimeout(limit);done();for(const explanation of explainResult(event.data,lesson,source))teach(explanation);};
  worker.onerror=event=>{event.preventDefault();clearTimeout(limit);done();say('ada','Não consegui ler o programa agora. Tente de novo.');};
  worker.postMessage({code:source,phase:lesson?.id,fichas:[],context:{},preview:true});
 }
 checkChip.addEventListener('click',()=>{say('user','Olha o meu código?');checkCode();});
 errorChip.addEventListener('click',()=>{say('user','O que esse erro quer dizer?');for(const explanation of explainResult(lastResult,lesson,document.getElementById('code').value))teach(explanation);});
 form.addEventListener('submit',event=>{
  event.preventDefault();const question=input.value.trim();if(!question)return;input.value='';say('user',question);
  const wants=intent(question);
  if(wants==='answer'){say('ada','Resposta pronta eu não dou: a graça é você descobrir! Mas posso olhar o seu código e mostrar o que falta.');checkCode();return;}
  if(wants==='error'&&lastResult&&!lastResult.passed){for(const explanation of explainResult(lastResult,lesson,document.getElementById('code').value))teach(explanation);return;}
  if(wants==='check'||wants==='error'){checkCode();return;}
  const entry=search(question,lesson?.id);
  // Dúvida de outro caso: avisa qual caso ensina aquilo e volta ao assunto daqui; a resposta fica a um toque.
  if(entry&&entry.lessonId&&entry.lessonId!==lesson?.id){
   const other=(window.HospitalLessons||[]).find(candidate=>candidate.id===entry.lessonId);
   const bubble=say('ada','Boa pergunta! Isso é assunto do Caso '+String(entry.lessonId).padStart(2,'0')+' ('+(other?.concept||'outro conceito')+'), que vem '+(entry.lessonId>lesson.id?'mais adiante':'antes')+'. Aqui, no caso “'+item.title+'”, o foco é '+lesson.concept+'.');
   const more=el('button','professor-chip professor-more','Mostrar mesmo assim');more.type='button';more.addEventListener('click',()=>{more.remove();answerEntry(entry);});bubble.append(more);return;
  }
  if(entry){answerEntry(entry);return;}
  say('ada','Essa eu não sei responder ainda. Experimente perguntar com outras palavras, tocar em uma das perguntas abaixo ou pedir para eu olhar o seu código.');
 });
 // Abre sozinha só quando der erro de JavaScript (sem repetir o mesmo erro) ou depois de duas tentativas erradas.
 let lastAuto='';
 window.addEventListener('hospital-run-result',event=>{
  lastResult=event.detail;errorChip.hidden=!(lastResult&&(!lastResult.ok||lastResult.timeout));
  if(lastResult.passed){badge.hidden=true;return;}
  if(!lastResult.ok||lastResult.timeout){
   const key=lastResult.timeout?'timeout':String(lastResult.error?.message);
   // Explicar o erro já é a ajuda: não abre de novo só para oferecer ajuda.
   if(key!==lastAuto){lastAuto=key;offered=true;openPanel(false);say('ada','Ops, o programa deu erro. Vamos entender o que aconteceu:');for(const explanation of explainResult(lastResult,lesson,document.getElementById('code').value))teach(explanation);return;}
  }
  if(lastResult.failedRuns>=2&&!offered){offered=true;openPanel(false);say('ada','Vi que o caso “'+item.title+'” está difícil. Quer que eu olhe o seu código com você? Toque em "Olhar meu código".');return;}
  if(panel.hidden)badge.hidden=false;
 });
 say('ada','Oi! Eu sou a Mica e vou acompanhar você no caso “'+item.title+'”. Posso olhar o seu código, explicar um erro ou tirar uma dúvida sobre '+(lesson?.concept||'JavaScript')+'. Eu ajudo a pensar, mas não entrego a resposta pronta.');
})();
