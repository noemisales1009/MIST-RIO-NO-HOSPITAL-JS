'use strict';
// Treinos extras de cada caso: exercícios curtos, com o mesmo corretor do caso, para praticar o conceito
// depois de resolver o mistério. Não têm ação no cenário nem culpado: só código, console e conferência.
// Campos: id (t1, t2…), title, story, mission, starter, solution, hint (dica 2), explainSolution (dica 3),
// expected (variáveis e valores conferidos), consoleArgs, variants, functionTests, requires, mutable, domExpected.
globalThis.HospitalDrills = {
  1: [
    {
      id: 't1', title: 'O leito da ficha',
      story: 'Uma ficha chegou com o número do leito anotado à mão: B-12.',
      mission: 'Guarde o texto B-12 na variável leito e mostre no console.',
      starter: '// O leito anotado na ficha é B-12.\n',
      solution: 'const leito = "B-12";\nconsole.log(leito);',
      hint: 'const leito = "B-12"; cria a variável. Lembre das aspas: é um texto.',
      explainSolution: 'const cria a caixinha leito e guarda o texto "B-12". console.log mostra o que está dentro.',
      expected: { leito: 'B-12' }
    },
    {
      id: 't2', title: 'Duas caixinhas',
      story: 'A placa do quarto diz o nome da ala e o andar.',
      mission: 'Crie nomeAla com o texto "Aurora" e andar com o texto "3º andar". Mostre as duas no console.',
      starter: '// Ala: Aurora · andar: 3º andar\n',
      solution: 'const nomeAla = "Aurora";\nconst andar = "3º andar";\nconsole.log(nomeAla, andar);',
      hint: 'Cada informação ganha a própria linha com const. No console.log, separe as duas variáveis por vírgula.',
      explainSolution: 'Duas variáveis, dois textos. console.log(nomeAla, andar) mostra os dois valores na mesma linha.',
      expected: { nomeAla: 'Aurora', andar: '3º andar' }
    }
  ],
  2: [
    {
      id: 't1', title: 'Do aguardando ao atendimento',
      story: 'O painel da recepção mostra o estado de cada paciente.',
      mission: 'Crie status começando em "aguardando" e depois troque para "em atendimento". Mostre o valor final no console.',
      starter: '// Comece em "aguardando" e termine em "em atendimento".\n',
      solution: 'let status = "aguardando";\nstatus = "em atendimento";\nconsole.log(status);',
      hint: 'Use let para criar status. Na linha seguinte, troque o valor escrevendo só o nome, = e o texto novo.',
      explainSolution: 'let permite trocar o valor. A segunda linha não repete let: só atribui o novo texto.',
      expected: { status: 'em atendimento' }, mutable: 'status'
    },
    {
      id: 't2', title: 'Contando chamadas',
      story: 'A campainha do quarto tocou duas vezes.',
      mission: 'Crie contador começando em 0 e aumente o valor em 1 duas vezes, usando o valor anterior. Mostre no console.',
      starter: 'let contador = 0;\n// Aumente em 1, duas vezes.\n\nconsole.log(contador);',
      solution: 'let contador = 0;\ncontador = contador + 1;\ncontador = contador + 1;\nconsole.log(contador);',
      hint: 'contador = contador + 1; pega o valor atual, soma 1 e guarda de volta. Repita a linha.',
      explainSolution: 'Cada atribuição lê o valor que já está em contador e guarda o resultado da soma. Duas vezes: 2.',
      expected: { contador: 2 }, mutable: 'contador',
      variantHint: 'Some 1 ao valor que já está em contador, em vez de escrever 2.',
      variants: [{ given: { contador: 5 }, expected: { contador: 7 } }]
    }
  ],
  3: [
    {
      id: 't1', title: 'Três informações, três nomes',
      story: 'A pulseira traz o nome da paciente, o quarto e a médica responsável.',
      mission: 'Crie nomePaciente com "Dalva", numeroQuarto com o número 14 e medicaResponsavel com "Dra. Lina". Mostre as três no console.',
      starter: '// Paciente: Dalva · quarto: 14 · médica: Dra. Lina\n',
      solution: 'const nomePaciente = "Dalva";\nconst numeroQuarto = 14;\nconst medicaResponsavel = "Dra. Lina";\nconsole.log(nomePaciente, numeroQuarto, medicaResponsavel);',
      hint: 'Os nomes seguem o padrão camelCase: primeira palavra minúscula, as seguintes com inicial maiúscula. O quarto é um número, sem aspas.',
      explainSolution: 'Nomes descritivos dizem o que a variável guarda. numeroQuarto recebe 14 sem aspas, porque é número.',
      expected: { nomePaciente: 'Dalva', numeroQuarto: 14, medicaResponsavel: 'Dra. Lina' }
    },
    {
      id: 't2', title: 'Arrumando os nomes',
      story: 'Alguém escreveu os nomes das variáveis fora do padrão.',
      mission: 'Reescreva o programa com os nomes no padrão: nomeDoSetor com "Farmácia" e numeroDaSala com 2. Mostre as duas no console.',
      starter: '// Estes nomes estão fora do padrão. Reescreva com nomeDoSetor e numeroDaSala.\nconst NomeDoSetor = "Farmácia";\nconst numeroda_sala = 2;\nconsole.log(NomeDoSetor, numeroda_sala);',
      solution: 'const nomeDoSetor = "Farmácia";\nconst numeroDaSala = 2;\nconsole.log(nomeDoSetor, numeroDaSala);',
      hint: 'Troque os nomes nas duas linhas de criação e também dentro do console.log. Maiúsculas e minúsculas fazem diferença.',
      explainSolution: 'JavaScript diferencia NomeDoSetor de nomeDoSetor. O padrão camelCase começa com minúscula e não usa _.',
      expected: { nomeDoSetor: 'Farmácia', numeroDaSala: 2 }
    }
  ],
  4: [
    {
      id: 't1', title: 'Idade e prontuário',
      story: 'A idade serve para cálculos; o prontuário é um código que começa com zeros.',
      mission: 'Guarde 42 em idade (como número) e "00731" em prontuario (como texto). Mostre os dois no console.',
      starter: '// Idade: 42 · prontuário: 00731\n',
      solution: 'const idade = 42;\nconst prontuario = "00731";\nconsole.log(idade, prontuario);',
      hint: 'Número não usa aspas. O prontuário precisa das aspas para não perder os zeros da frente.',
      explainSolution: '42 sem aspas é number. "00731" com aspas é string e preserva os zeros.',
      expected: { idade: 42, prontuario: '00731' }
    },
    {
      id: 't2', title: 'Perguntando o tipo',
      story: 'Antes de usar um valor, vale conferir se ele é texto ou número.',
      mission: 'Guarde em tipoCodigo o tipo de codigo e em tipoDose o tipo de dose, usando typeof. Mostre os dois no console.',
      starter: 'const codigo = "0045";\nconst dose = 2;\n// Descubra o tipo de cada um.\n',
      solution: 'const codigo = "0045";\nconst dose = 2;\nconst tipoCodigo = typeof codigo;\nconst tipoDose = typeof dose;\nconsole.log(tipoCodigo, tipoDose);',
      hint: 'typeof codigo devolve o nome do tipo como texto. Guarde esse resultado numa variável.',
      explainSolution: 'typeof responde "string" para texto e "number" para número. Guardar o resultado permite mostrar ou comparar depois.',
      expected: { tipoCodigo: 'string', tipoDose: 'number' },
      variantHint: 'Use typeof para descobrir o tipo, em vez de escrever "string" ou "number".',
      variants: [{ given: { codigo: 12, dose: '2' }, expected: { tipoCodigo: 'number', tipoDose: 'string' } }]
    }
  ],
  5: [
    {
      id: 't1', title: 'Nome completo',
      story: 'O crachá mostra nome e sobrenome juntos, com um espaço no meio.',
      mission: 'Monte completo juntando nome, um espaço e sobrenome. Mostre no console.',
      starter: 'const nome = "Ana";\nconst sobrenome = "Reis";\n// Junte os dois com um espaço no meio.\n',
      solution: 'const nome = "Ana";\nconst sobrenome = "Reis";\nconst completo = nome + " " + sobrenome;\nconsole.log(completo);',
      hint: 'O espaço também é um texto: " ". Junte os três pedaços com +.',
      explainSolution: 'nome + " " + sobrenome une três textos. Sem o " " do meio, as palavras ficariam grudadas.',
      expected: { completo: 'Ana Reis' },
      variantHint: 'Monte completo a partir de nome e sobrenome, em vez de escrever o texto final.',
      variants: [{ given: { nome: 'Bia', sobrenome: 'Luz' }, expected: { completo: 'Bia Luz' } }]
    },
    {
      id: 't2', title: 'Texto com número',
      story: 'A etiqueta da porta diz "Quarto" e o número.',
      mission: 'Monte etiqueta com o texto "Quarto " seguido do número guardado em quarto. Mostre no console.',
      starter: 'const quarto = 7;\n// Monte a etiqueta: Quarto 7\n',
      solution: 'const quarto = 7;\nconst etiqueta = "Quarto " + quarto;\nconsole.log(etiqueta);',
      hint: 'Quando um texto é somado a um número, o número vira texto e os dois se juntam.',
      explainSolution: '"Quarto " + 7 resulta em "Quarto 7": o + com um texto de um lado junta em vez de somar.',
      expected: { etiqueta: 'Quarto 7' },
      variantHint: 'Use a variável quarto na montagem, em vez de digitar o número.',
      variants: [{ given: { quarto: 12 }, expected: { etiqueta: 'Quarto 12' } }]
    }
  ],
  6: [
    {
      id: 't1', title: 'Resumo do setor',
      story: 'O quadro de leitos precisa de uma linha por setor.',
      mission: 'Monte resumo no formato "UTI: 8 leitos" usando setor e leitos. Mostre no console.',
      starter: 'const setor = "UTI";\nconst leitos = 8;\n// Monte: UTI: 8 leitos\n',
      solution: 'const setor = "UTI";\nconst leitos = 8;\nconst resumo = setor + ": " + leitos + " leitos";\nconsole.log(resumo);',
      hint: 'Os pedaços fixos (": " e " leitos") ficam entre aspas; as variáveis entram sem aspas, unidas por +.',
      explainSolution: 'Quatro pedaços unidos por +: a variável setor, o texto ": ", o número leitos e o texto " leitos".',
      expected: { resumo: 'UTI: 8 leitos' },
      variantHint: 'Monte resumo a partir de setor e leitos, em vez de escrever o texto pronto.',
      variants: [{ given: { setor: 'Pediatria', leitos: 12 }, expected: { resumo: 'Pediatria: 12 leitos' } }]
    },
    {
      id: 't2', title: 'Completando o aviso',
      story: 'O aviso de visitas começa pela metade e recebe o horário depois.',
      mission: 'aviso começa com "Visitas: ". Acrescente o texto de horario ao final de aviso (a variável precisa aceitar a mudança). Mostre no console.',
      starter: 'let aviso = "Visitas: ";\nconst horario = "14h às 16h";\n// Acrescente o horário ao aviso.\n',
      solution: 'let aviso = "Visitas: ";\nconst horario = "14h às 16h";\naviso = aviso + horario;\nconsole.log(aviso);',
      hint: 'aviso = aviso + horario; usa o valor atual de aviso e guarda o texto maior de volta.',
      explainSolution: 'A variável criada com let aceita a nova atribuição. O texto antigo mais o horário vira o aviso completo.',
      expected: { aviso: 'Visitas: 14h às 16h' }, mutable: 'aviso',
      variantHint: 'Acrescente a variável horario ao aviso, em vez de digitar o horário.',
      variants: [{ given: { horario: '9h às 11h' }, expected: { aviso: 'Visitas: 9h às 11h' } }]
    }
  ],
  7: [
    {
      id: 't1', title: 'Tem febre?',
      story: 'O termômetro marcou 38.5. Febre é temperatura acima de 37.5.',
      mission: 'Guarde em febre se temperatura é maior que 37.5 (true ou false, calculado). Mostre no console.',
      starter: 'const temperatura = 38.5;\n// Compare com 37.5.\n',
      solution: 'const temperatura = 38.5;\nconst febre = temperatura > 37.5;\nconsole.log(febre);',
      hint: 'temperatura > 37.5 já resulta em true ou false. Guarde esse resultado em febre.',
      explainSolution: 'A comparação com > produz um boolean. 38.5 > 37.5 é true.',
      expected: { febre: true },
      variantHint: 'Calcule febre com a comparação, em vez de escrever true.',
      variants: [{ given: { temperatura: 36.4 }, expected: { febre: false } }]
    },
    {
      id: 't2', title: 'Estoque mínimo',
      story: 'Com 3 caixas em estoque e mínimo de 5, é hora de repor.',
      mission: 'Guarde em precisaRepor se estoque é menor que minimo e em estoqueZerado se estoque é exatamente 0. Mostre as duas no console.',
      starter: 'const estoque = 3;\nconst minimo = 5;\n// Duas comparações.\n',
      solution: 'const estoque = 3;\nconst minimo = 5;\nconst precisaRepor = estoque < minimo;\nconst estoqueZerado = estoque === 0;\nconsole.log(precisaRepor, estoqueZerado);',
      hint: '< compara se é menor; === confere se é exatamente igual. Cada resultado vai para a própria variável.',
      explainSolution: '3 < 5 é true, então precisaRepor é true. 3 === 0 é false, então estoqueZerado é false.',
      expected: { precisaRepor: true, estoqueZerado: false },
      variantHint: 'Calcule as duas variáveis com comparações, em vez de escrever true ou false.',
      variants: [{ given: { estoque: 0, minimo: 2 }, expected: { precisaRepor: true, estoqueZerado: true } }, { given: { estoque: 9 }, expected: { precisaRepor: false, estoqueZerado: false } }]
    }
  ],
  8: [
    {
      id: 't1', title: 'Alerta de febre alta',
      story: 'Acima de 38, o painel precisa avisar.',
      mission: 'Quando temperatura for maior que 38, alerta deve virar "Febre alta"; senão, continua vazio. Mostre alerta no console.',
      starter: 'const temperatura = 39;\nlet alerta = "";\n// Decida com if.\n\nconsole.log(alerta);',
      solution: 'const temperatura = 39;\nlet alerta = "";\nif (temperatura > 38) {\n  alerta = "Febre alta";\n}\nconsole.log(alerta);',
      hint: 'if (temperatura > 38) { ... } executa o bloco só quando a comparação for true. Dentro, troque o valor de alerta.',
      explainSolution: 'A condição 39 > 38 é true, o bloco roda e alerta recebe "Febre alta". Com 37, o bloco seria pulado.',
      expected: { alerta: 'Febre alta' }, mutable: 'alerta', requires: 'if',
      variantHint: 'Mude alerta dentro do if, para que o valor dependa de temperatura.',
      variants: [{ given: { temperatura: 37 }, expected: { alerta: '' } }]
    },
    {
      id: 't2', title: 'Senha conferida',
      story: 'A porta só abre se a senha digitada for igual à correta.',
      mission: 'porta começa "fechada". Se senhaDigitada for exatamente igual a senhaCorreta, troque porta para "aberta". Mostre porta no console.',
      starter: 'const senhaDigitada = "4271";\nconst senhaCorreta = "4271";\nlet porta = "fechada";\n// Compare as senhas com if.\n\nconsole.log(porta);',
      solution: 'const senhaDigitada = "4271";\nconst senhaCorreta = "4271";\nlet porta = "fechada";\nif (senhaDigitada === senhaCorreta) {\n  porta = "aberta";\n}\nconsole.log(porta);',
      hint: 'A condição do if compara os dois textos com ===. Lembre: = guarda, === compara.',
      explainSolution: 'Os dois textos são iguais, a condição é true e porta vira "aberta". Com outra senha, continuaria "fechada".',
      expected: { porta: 'aberta' }, mutable: 'porta', requires: 'if',
      variantHint: 'Compare as duas variáveis dentro do if, em vez de escrever "aberta" direto.',
      variants: [{ given: { senhaDigitada: '0000' }, expected: { porta: 'fechada' } }]
    }
  ],
  9: [
    {
      id: 't1', title: 'Há vagas?',
      story: 'O painel da enfermaria mostra se ainda há leitos livres.',
      mission: 'Se vagas for maior que 0, situacao deve ser "Há vagas"; caso contrário, "Lotado". Mostre situacao no console.',
      starter: 'const vagas = 0;\nlet situacao = "";\n// if e else.\n\nconsole.log(situacao);',
      solution: 'const vagas = 0;\nlet situacao = "";\nif (vagas > 0) {\n  situacao = "Há vagas";\n} else {\n  situacao = "Lotado";\n}\nconsole.log(situacao);',
      hint: 'O bloco do if cuida do caso verdadeiro; o bloco do else cuida do resto.',
      explainSolution: '0 > 0 é false, então o programa pula o bloco do if e roda o else: situacao vira "Lotado".',
      expected: { situacao: 'Lotado' }, mutable: 'situacao', requires: 'else',
      variantHint: 'Use if e else com vagas, para que situacao mude conforme o número.',
      variants: [{ given: { vagas: 2 }, expected: { situacao: 'Há vagas' } }]
    },
    {
      id: 't2', title: 'Manhã ou não',
      story: 'O relógio marca 22h. Antes do meio-dia é manhã.',
      mission: 'Se horario for menor que 12, periodo deve ser "manhã"; caso contrário, "tarde ou noite". Mostre periodo no console.',
      starter: 'const horario = 22;\nlet periodo = "";\n\nconsole.log(periodo);',
      solution: 'const horario = 22;\nlet periodo = "";\nif (horario < 12) {\n  periodo = "manhã";\n} else {\n  periodo = "tarde ou noite";\n}\nconsole.log(periodo);',
      hint: 'A condição é horario < 12. O else não tem condição: ele pega tudo o que não entrou no if.',
      explainSolution: '22 < 12 é false, então periodo recebe "tarde ou noite" pelo else.',
      expected: { periodo: 'tarde ou noite' }, mutable: 'periodo', requires: 'else',
      variantHint: 'Decida periodo com if e else a partir de horario.',
      variants: [{ given: { horario: 9 }, expected: { periodo: 'manhã' } }]
    }
  ],
  10: [
    {
      id: 't1', title: 'Senha e cargo',
      story: 'O armário de medicamentos abre só com senha e para a enfermagem.',
      mission: 'Guarde em podeAbrir se temSenha é true e, ao mesmo tempo, cargo é exatamente "enfermagem". Mostre no console.',
      starter: 'const temSenha = true;\nconst cargo = "enfermagem";\n// Duas condições ao mesmo tempo.\n',
      solution: 'const temSenha = true;\nconst cargo = "enfermagem";\nconst podeAbrir = temSenha && cargo === "enfermagem";\nconsole.log(podeAbrir);',
      hint: 'temSenha && cargo === "enfermagem": o && só dá true quando os dois lados forem true.',
      explainSolution: 'true && true resulta em true. Se qualquer lado fosse false, podeAbrir seria false.',
      expected: { podeAbrir: true },
      variantHint: 'Calcule podeAbrir com && a partir das duas variáveis.',
      variants: [{ given: { cargo: 'visitante' }, expected: { podeAbrir: false } }, { given: { temSenha: false }, expected: { podeAbrir: false } }]
    },
    {
      id: 't2', title: 'Alta liberada',
      story: 'A alta sai quando a temperatura está abaixo de 38 e a pressão está ok.',
      mission: 'Guarde em liberado se temperatura é menor que 38 e pressaoOk é true. Mostre no console.',
      starter: 'const temperatura = 37;\nconst pressaoOk = true;\n',
      solution: 'const temperatura = 37;\nconst pressaoOk = true;\nconst liberado = temperatura < 38 && pressaoOk;\nconsole.log(liberado);',
      hint: 'Uma comparação (temperatura < 38) pode ficar de um lado do && e um boolean (pressaoOk) do outro.',
      explainSolution: '37 < 38 é true e pressaoOk é true: true && true dá true.',
      expected: { liberado: true },
      variantHint: 'Calcule liberado com && em vez de escrever true.',
      variants: [{ given: { temperatura: 39 }, expected: { liberado: false } }, { given: { pressaoOk: false }, expected: { liberado: false } }]
    }
  ],
  11: [
    {
      id: 't1', title: 'Fim de semana',
      story: 'Aos sábados e domingos o horário de visita muda.',
      mission: 'Guarde em fimDeSemana se dia é "sábado" ou "domingo". Mostre no console.',
      starter: 'const dia = "sábado";\n',
      solution: 'const dia = "sábado";\nconst fimDeSemana = dia === "sábado" || dia === "domingo";\nconsole.log(fimDeSemana);',
      hint: 'Compare dia com cada opção e una as comparações com ||. Basta uma ser true.',
      explainSolution: 'dia === "sábado" é true, então o || já resulta em true sem precisar olhar o outro lado.',
      expected: { fimDeSemana: true },
      variantHint: 'Calcule fimDeSemana comparando dia com as duas opções, usando ||.',
      variants: [{ given: { dia: 'terça' }, expected: { fimDeSemana: false } }, { given: { dia: 'domingo' }, expected: { fimDeSemana: true } }]
    },
    {
      id: 't2', title: 'Fila prioritária',
      story: 'Tem prioridade quem chega em urgência ou quem é idoso.',
      mission: 'Guarde em prioridade se urgente ou idoso for true. Mostre no console.',
      starter: 'const urgente = false;\nconst idoso = true;\n',
      solution: 'const urgente = false;\nconst idoso = true;\nconst prioridade = urgente || idoso;\nconsole.log(prioridade);',
      hint: 'urgente || idoso: com || basta um dos dois ser true.',
      explainSolution: 'false || true resulta em true. Só daria false se os dois fossem false.',
      expected: { prioridade: true },
      variantHint: 'Calcule prioridade com || a partir das duas variáveis.',
      variants: [{ given: { idoso: false }, expected: { prioridade: false } }, { given: { urgente: true, idoso: false }, expected: { prioridade: true } }]
    }
  ],
  12: [
    {
      id: 't1', title: 'Horário de entrada',
      story: 'Visitas entram com autorização e só entre 7h e 21h.',
      mission: 'Se temAutorizacao for true e horario estiver entre 7 e 21 (incluindo os dois), entrada deve ser "Liberada"; caso contrário, "Bloqueada". Mostre no console.',
      starter: 'const temAutorizacao = true;\nconst horario = 23;\nlet entrada = "";\n\nconsole.log(entrada);',
      solution: 'const temAutorizacao = true;\nconst horario = 23;\nlet entrada = "";\nif (temAutorizacao && horario >= 7 && horario <= 21) {\n  entrada = "Liberada";\n} else {\n  entrada = "Bloqueada";\n}\nconsole.log(entrada);',
      hint: 'Três condições unidas por &&: a autorização, horario >= 7 e horario <= 21. O else cuida do resto.',
      explainSolution: '23 <= 21 é false, então o && inteiro é false e o else roda: entrada vira "Bloqueada".',
      expected: { entrada: 'Bloqueada' }, mutable: 'entrada', requires: 'if',
      variantHint: 'Escreva a condição com temAutorizacao e horario, para que entrada dependa dos dados.',
      variants: [{ given: { horario: 10 }, expected: { entrada: 'Liberada' } }, { given: { temAutorizacao: false, horario: 10 }, expected: { entrada: 'Bloqueada' } }]
    },
    {
      id: 't2', title: 'Subir ao andar',
      story: 'Sobe quem é da equipe ou quem está acompanhado.',
      mission: 'Se cargo for "equipe" ou acompanhado for true, acesso deve ser "Pode subir"; caso contrário, "Aguardar na recepção". Mostre no console.',
      starter: 'const cargo = "visitante";\nconst acompanhado = true;\nlet acesso = "";\n\nconsole.log(acesso);',
      solution: 'const cargo = "visitante";\nconst acompanhado = true;\nlet acesso = "";\nif (cargo === "equipe" || acompanhado) {\n  acesso = "Pode subir";\n} else {\n  acesso = "Aguardar na recepção";\n}\nconsole.log(acesso);',
      hint: 'cargo === "equipe" || acompanhado: basta uma das duas ser true para entrar no if.',
      explainSolution: 'cargo não é "equipe", mas acompanhado é true: o || resulta em true e acesso vira "Pode subir".',
      expected: { acesso: 'Pode subir' }, mutable: 'acesso', requires: 'if',
      variantHint: 'Escreva a condição com cargo e acompanhado, usando ||.',
      variants: [{ given: { acompanhado: false }, expected: { acesso: 'Aguardar na recepção' } }, { given: { cargo: 'equipe', acompanhado: false }, expected: { acesso: 'Pode subir' } }]
    }
  ],
  13: [
    {
      id: 't1', title: 'O último da lista',
      story: 'A lista de leitos da ala tem três códigos.',
      mission: 'Guarde em ultimo o terceiro item de leitos e em total quantos itens a lista tem. Mostre os dois no console.',
      starter: 'const leitos = ["B-01", "B-02", "B-03"];\n',
      solution: 'const leitos = ["B-01", "B-02", "B-03"];\nconst ultimo = leitos[2];\nconst total = leitos.length;\nconsole.log(ultimo, total);',
      hint: 'As posições começam em 0, então o terceiro item está em [2]. length diz quantos itens existem.',
      explainSolution: 'leitos[2] é "B-03", porque a contagem começa em 0. leitos.length é 3.',
      expected: { ultimo: 'B-03', total: 3 },
      variantHint: 'Leia o item pela posição e o tamanho com length, em vez de copiar os valores.',
      variants: [{ given: { leitos: ['Z-1', 'Z-2', 'Z-3'] }, expected: { ultimo: 'Z-3', total: 3 } }]
    },
    {
      id: 't2', title: 'O turno do meio',
      story: 'Os turnos estão em ordem: manhã, tarde e noite.',
      mission: 'Guarde em segundo o segundo item de turnos. Mostre no console.',
      starter: 'const turnos = ["manhã", "tarde", "noite"];\n',
      solution: 'const turnos = ["manhã", "tarde", "noite"];\nconst segundo = turnos[1];\nconsole.log(segundo);',
      hint: 'O primeiro item está em [0]; o segundo está em [1].',
      explainSolution: 'turnos[1] devolve "tarde": o índice é sempre um a menos que a posição falada.',
      expected: { segundo: 'tarde' },
      variantHint: 'Leia o item pela posição [1], em vez de escrever o texto.',
      variants: [{ given: { turnos: ['A', 'B', 'C'] }, expected: { segundo: 'B' } }]
    }
  ],
  14: [
    {
      id: 't1', title: 'Mais um na fila',
      story: 'Caio chegou e entra no fim da fila.',
      mission: 'Acrescente "Caio" ao fim de fila e guarde em caioNaFila se a lista contém "Caio". Mostre os dois no console.',
      starter: 'const fila = ["Ana", "Bia"];\n',
      solution: 'const fila = ["Ana", "Bia"];\nfila.push("Caio");\nconst caioNaFila = fila.includes("Caio");\nconsole.log(fila, caioNaFila);',
      hint: 'fila.push("Caio") acrescenta no fim. fila.includes("Caio") responde true ou false.',
      explainSolution: 'push altera a lista original. Depois, includes encontra "Caio" e devolve true.',
      expected: { fila: ['Ana', 'Bia', 'Caio'], caioNaFila: true },
      variantHint: 'Acrescente com push e confira com includes, sem reescrever a lista.',
      variants: [{ given: { fila: ['Zé'] }, expected: { fila: ['Zé', 'Caio'], caioNaFila: true } }]
    },
    {
      id: 't2', title: 'Antes e depois',
      story: 'A lista de alergias ganha um item novo.',
      mission: 'Guarde em antes se alergias contém "dipirona". Depois acrescente "dipirona" à lista e guarde em depois se agora contém. Mostre antes e depois no console.',
      starter: 'const alergias = ["penicilina"];\n',
      solution: 'const alergias = ["penicilina"];\nconst antes = alergias.includes("dipirona");\nalergias.push("dipirona");\nconst depois = alergias.includes("dipirona");\nconsole.log(antes, depois);',
      hint: 'A ordem importa: confira com includes, faça o push e confira de novo.',
      explainSolution: 'Antes do push, includes devolve false; depois, true. A mesma pergunta muda de resposta porque a lista mudou.',
      expected: { antes: false, depois: true, alergias: ['penicilina', 'dipirona'] },
      variantHint: 'Confira com includes antes e depois do push, em vez de escrever true ou false.',
      variants: [{ given: { alergias: ['dipirona'] }, expected: { antes: true, depois: true } }]
    }
  ],
  15: [
    {
      id: 't1', title: 'Somando as doses',
      story: 'As doses do dia estão numa lista. Quanto foi aplicado no total?',
      mission: 'Percorra doses e some cada valor em total, que começa em 0. Mostre total no console.',
      starter: 'const doses = [2, 3, 1];\nlet total = 0;\n// Some cada dose em total.\n\nconsole.log(total);',
      solution: 'const doses = [2, 3, 1];\nlet total = 0;\nfor (const dose of doses) {\n  total = total + dose;\n}\nconsole.log(total);',
      hint: 'for (const dose of doses) { ... } visita cada dose. Dentro, total = total + dose;',
      explainSolution: 'O laço passa por 2, 3 e 1. A cada volta, total cresce: 2, 5, 6.',
      expected: { total: 6 }, mutable: 'total', requires: 'for',
      variantHint: 'Some dentro do for...of, em vez de escrever 6.',
      variants: [{ given: { doses: [5, 5] }, expected: { total: 10 } }]
    },
    {
      id: 't2', title: 'Chamada da enfermaria',
      story: 'A chamada lê os nomes um por um, separados por vírgula.',
      mission: 'Percorra nomes e acrescente cada nome seguido de ", " ao texto chamada. Mostre chamada no console.',
      starter: 'const nomes = ["Ana", "Bia"];\nlet chamada = "";\n\nconsole.log(chamada);',
      solution: 'const nomes = ["Ana", "Bia"];\nlet chamada = "";\nfor (const nome of nomes) {\n  chamada = chamada + nome + ", ";\n}\nconsole.log(chamada);',
      hint: 'Dentro do laço, chamada = chamada + nome + ", "; acrescenta o nome e a vírgula.',
      explainSolution: 'A cada volta o texto cresce: "Ana, " e depois "Ana, Bia, ".',
      expected: { chamada: 'Ana, Bia, ' }, mutable: 'chamada', requires: 'for',
      variantHint: 'Monte chamada dentro do for...of, item por item.',
      variants: [{ given: { nomes: ['Rui'] }, expected: { chamada: 'Rui, ' } }]
    }
  ],
  16: [
    {
      id: 't1', title: 'Quantas febres?',
      story: 'As temperaturas do turno estão numa lista. Febre é acima de 37.8.',
      mission: 'Percorra temperaturas e conte em febres quantas são maiores que 37.8. Mostre febres no console.',
      starter: 'const temperaturas = [36.5, 38.2, 37.1, 39];\nlet febres = 0;\n\nconsole.log(febres);',
      solution: 'const temperaturas = [36.5, 38.2, 37.1, 39];\nlet febres = 0;\nfor (const temperatura of temperaturas) {\n  if (temperatura > 37.8) {\n    febres = febres + 1;\n  }\n}\nconsole.log(febres);',
      hint: 'Dentro do for...of, um if decide se aquela temperatura conta. Só então febres aumenta em 1.',
      explainSolution: 'O laço visita quatro valores; o if aprova 38.2 e 39. febres termina em 2.',
      expected: { febres: 2 }, mutable: 'febres', requires: 'for',
      variantHint: 'Conte dentro do laço com if, em vez de escrever 2.',
      variants: [{ given: { temperaturas: [36, 36.2] }, expected: { febres: 0 } }, { given: { temperaturas: [40, 39, 38] }, expected: { febres: 3 } }]
    },
    {
      id: 't2', title: 'Prateleiras vazias',
      story: 'A conferência do estoque trouxe várias quantidades.',
      mission: 'Percorra estoque e guarde em vazias a lista só com os valores iguais a 0. Mostre vazias no console.',
      starter: 'const estoque = [12, 0, 4, 0, 0];\nconst vazias = [];\n\nconsole.log(vazias);',
      solution: 'const estoque = [12, 0, 4, 0, 0];\nconst vazias = [];\nfor (const quantidade of estoque) {\n  if (quantidade === 0) {\n    vazias.push(quantidade);\n  }\n}\nconsole.log(vazias);',
      hint: 'for...of para visitar, if para escolher e push para guardar. O push fica dentro do if.',
      explainSolution: 'Cada 0 passa no if e entra em vazias. Os outros valores são ignorados.',
      expected: { vazias: [0, 0, 0] }, requires: 'for',
      variantHint: 'Use for...of, if e push, em vez de escrever a lista final.',
      variants: [{ given: { estoque: [1, 0] }, expected: { vazias: [0] } }]
    }
  ],
  17: [
    {
      id: 't1', title: 'Lendo a ficha',
      story: 'A ficha do paciente é um objeto com nome, idade e leito.',
      mission: 'Monte resumo no formato "Rui · leito C-4", lendo nome e leito de dentro de paciente. Mostre no console.',
      starter: 'const paciente = { nome: "Rui", idade: 61, leito: "C-4" };\n',
      solution: 'const paciente = { nome: "Rui", idade: 61, leito: "C-4" };\nconst resumo = paciente.nome + " · leito " + paciente.leito;\nconsole.log(resumo);',
      hint: 'paciente.nome lê a propriedade nome. Junte com + ao texto " · leito " e a paciente.leito.',
      explainSolution: 'O ponto acessa cada propriedade do objeto. Os valores lidos se juntam ao texto fixo.',
      expected: { resumo: 'Rui · leito C-4' },
      variantHint: 'Leia os valores de paciente com ponto, em vez de digitar o texto.',
      variants: [{ given: { paciente: { nome: 'Lia', idade: 30, leito: 'A-9' } }, expected: { resumo: 'Lia · leito A-9' } }]
    },
    {
      id: 't2', title: 'Criando um objeto',
      story: 'O remédio precisa virar um registro com nome, dose e unidade.',
      mission: 'Crie o objeto remedio com nome "Dipirona", dose 500 (número) e unidade "mg". Monte texto no formato "Dipirona 500mg" lendo do objeto. Mostre texto no console.',
      starter: '// Crie o objeto remedio: nome, dose e unidade.\n',
      solution: 'const remedio = { nome: "Dipirona", dose: 500, unidade: "mg" };\nconst texto = remedio.nome + " " + remedio.dose + remedio.unidade;\nconsole.log(texto);',
      hint: 'Um objeto fica entre chaves: { nome: "Dipirona", dose: 500, unidade: "mg" }. Cada par é propriedade: valor, separado por vírgula.',
      explainSolution: 'As chaves criam o objeto e os dois-pontos ligam cada propriedade ao valor. Depois, o ponto lê cada uma.',
      expected: { remedio: { nome: 'Dipirona', dose: 500, unidade: 'mg' }, texto: 'Dipirona 500mg' }
    },
    {
      id: 't3', title: 'Leitos livres',
      story: 'A lista de leitos é uma lista de objetos: cada um diz o número e se está ocupado.',
      mission: 'Percorra leitos e guarde em livres os números dos leitos que não estão ocupados. Mostre livres no console.',
      starter: 'const leitos = [\n  { numero: "A-1", ocupado: true },\n  { numero: "A-2", ocupado: false },\n  { numero: "A-3", ocupado: false }\n];\nconst livres = [];\n\nconsole.log(livres);',
      solution: 'const leitos = [\n  { numero: "A-1", ocupado: true },\n  { numero: "A-2", ocupado: false },\n  { numero: "A-3", ocupado: false }\n];\nconst livres = [];\nfor (const leito of leitos) {\n  if (!leito.ocupado) {\n    livres.push(leito.numero);\n  }\n}\nconsole.log(livres);',
      hint: 'Cada item do laço é um objeto: leito.ocupado e leito.numero. ! inverte o boolean: !leito.ocupado é true para leito livre.',
      explainSolution: 'O for...of entrega um objeto por vez. O if testa a propriedade ocupado e o push guarda só o número.',
      expected: { livres: ['A-2', 'A-3'] }, requires: 'for',
      variantHint: 'Percorra a lista e leia as propriedades, em vez de escrever os números.',
      variants: [{ given: { leitos: [{ numero: 'B-1', ocupado: false }, { numero: 'B-2', ocupado: true }] }, expected: { livres: ['B-1'] } }]
    },
    {
      id: 't4', title: 'Mudando a ficha',
      story: 'A ficha precisa ser atualizada: virou urgente e mudou de setor.',
      mission: 'Altere as propriedades de ficha: urgente deve virar true e setor deve virar "Emergência". Mostre ficha no console.',
      starter: 'const ficha = { setor: "Recepção", urgente: false };\n// Altere as duas propriedades.\n\nconsole.log(ficha);',
      solution: 'const ficha = { setor: "Recepção", urgente: false };\nficha.urgente = true;\nficha.setor = "Emergência";\nconsole.log(ficha);',
      hint: 'ficha.urgente = true; troca o valor da propriedade. O objeto foi criado com const, mas as propriedades dele podem mudar.',
      explainSolution: 'const impede trocar o objeto inteiro por outro, mas as propriedades internas continuam editáveis com ponto e =.',
      expected: { ficha: { setor: 'Emergência', urgente: true } }
    }
  ],
  18: [
    {
      id: 't1', title: 'E-mail padronizado',
      story: 'O e-mail veio com espaços e maiúsculas.',
      mission: 'Guarde em emailLimpo o texto de email sem espaços nas pontas e todo em minúsculas. Mostre no console.',
      starter: 'const email = "  LIA@Hospital.com ";\n',
      solution: 'const email = "  LIA@Hospital.com ";\nconst emailLimpo = email.trim().toLowerCase();\nconsole.log(emailLimpo);',
      hint: 'trim() tira os espaços das pontas; toLowerCase() deixa minúsculo. Pode encadear um após o outro.',
      explainSolution: 'Os métodos de texto devolvem um texto novo. Encadeados, aplicam uma limpeza depois da outra.',
      expected: { emailLimpo: 'lia@hospital.com' },
      variantHint: 'Transforme email com os métodos, em vez de escrever o resultado.',
      variants: [{ given: { email: ' RUI@HOSPITAL.COM' }, expected: { emailLimpo: 'rui@hospital.com' } }]
    },
    {
      id: 't2', title: 'Crachá em maiúsculas',
      story: 'Os crachás são sempre escritos em maiúsculas.',
      mission: 'Guarde em codigoPadrao o texto de codigo todo em maiúsculas. Mostre no console.',
      starter: 'const codigo = "far-24c";\n',
      solution: 'const codigo = "far-24c";\nconst codigoPadrao = codigo.toUpperCase();\nconsole.log(codigoPadrao);',
      hint: 'Existe o contrário de toLowerCase: toUpperCase(). Atenção às letras maiúsculas no meio do nome.',
      explainSolution: 'toUpperCase devolve o texto com todas as letras maiúsculas. O texto original não muda.',
      expected: { codigoPadrao: 'FAR-24C' },
      variantHint: 'Use toUpperCase em codigo, em vez de digitar o resultado.',
      variants: [{ given: { codigo: 'lab-01a' }, expected: { codigoPadrao: 'LAB-01A' } }]
    },
    {
      id: 't3', title: 'Procurando na observação',
      story: 'A observação da ficha pode mencionar uma alergia.',
      mission: 'Guarde em temAlergia se observacao, em minúsculas, contém o texto "alergia". Mostre no console.',
      starter: 'const observacao = "Paciente com ALERGIA a dipirona";\n',
      solution: 'const observacao = "Paciente com ALERGIA a dipirona";\nconst temAlergia = observacao.toLowerCase().includes("alergia");\nconsole.log(temAlergia);',
      hint: 'Textos também têm includes: "abc".includes("b") é true. Deixe em minúsculas antes, para não depender das maiúsculas.',
      explainSolution: 'toLowerCase padroniza o texto e includes procura o pedaço. A ordem garante que "ALERGIA" também seja encontrado.',
      expected: { temAlergia: true },
      variantHint: 'Use toLowerCase e includes em observacao, em vez de escrever true.',
      variants: [{ given: { observacao: 'Sem queixas' }, expected: { temAlergia: false } }]
    }
  ],
  19: [
    {
      id: 't1', title: 'O dobro',
      story: 'Uma função pequena para começar: receber um número e devolver o dobro.',
      mission: 'Crie a função dobro(n) que devolve n vezes 2. Guarde em resultado o valor de dobro(21). Mostre no console.',
      starter: '// function dobro(n) { ... }\n',
      solution: 'function dobro(n) {\n  return n * 2;\n}\nconst resultado = dobro(21);\nconsole.log(resultado);',
      hint: 'function dobro(n) { return n * 2; } define a regra. dobro(21) usa a regra com 21.',
      explainSolution: 'O parâmetro n recebe o valor de cada chamada. return devolve o resultado para quem chamou.',
      expected: { resultado: 42 }, requires: 'return',
      functionTests: [{ name: 'dobro', args: [5], expected: 10 }, { name: 'dobro', args: [0], expected: 0 }]
    },
    {
      id: 't2', title: 'Saudação',
      story: 'O painel cumprimenta cada pessoa pelo nome.',
      mission: 'Crie a função saudacao(nome) que devolve "Olá, " seguido do nome e de "!". Guarde em mensagem o resultado de saudacao("Lia"). Mostre no console.',
      starter: '',
      solution: 'function saudacao(nome) {\n  return "Olá, " + nome + "!";\n}\nconst mensagem = saudacao("Lia");\nconsole.log(mensagem);',
      hint: 'Dentro da função, monte o texto com + e devolva com return. Fora, chame saudacao("Lia").',
      explainSolution: 'A função recebe o nome e devolve o texto montado. A mesma função serve para qualquer nome.',
      expected: { mensagem: 'Olá, Lia!' }, requires: 'return',
      functionTests: [{ name: 'saudacao', args: ['Rui'], expected: 'Olá, Rui!' }, { name: 'saudacao', args: [''], expected: 'Olá, !' }]
    },
    {
      id: 't3', title: 'Uma regra, dois pacientes',
      story: 'A regra de febre vale para todo mundo: acima de 37.8.',
      mission: 'Crie a função temFebre(temperatura) que devolve true quando a temperatura é maior que 37.8. Guarde em lia o resultado para 38.4 e em teo o resultado para 36.9. Mostre os dois no console.',
      starter: '',
      solution: 'function temFebre(temperatura) {\n  return temperatura > 37.8;\n}\nconst lia = temFebre(38.4);\nconst teo = temFebre(36.9);\nconsole.log(lia, teo);',
      hint: 'A comparação já devolve true ou false: return temperatura > 37.8; basta.',
      explainSolution: 'Escrever a regra uma vez e chamar duas vezes evita repetir a comparação. Cada chamada recebe um valor diferente.',
      expected: { lia: true, teo: false }, requires: 'return',
      functionTests: [{ name: 'temFebre', args: [40], expected: true }, { name: 'temFebre', args: [37.8], expected: false }]
    },
    {
      id: 't4', title: 'Soma das doses',
      story: 'Uma função que recebe uma lista e devolve a soma.',
      mission: 'Crie a função totalDoses(doses) que percorre a lista e devolve a soma. Guarde em soma o resultado de totalDoses([2, 3, 4]). Mostre no console.',
      starter: '',
      solution: 'function totalDoses(doses) {\n  let total = 0;\n  for (const dose of doses) {\n    total = total + dose;\n  }\n  return total;\n}\nconst soma = totalDoses([2, 3, 4]);\nconsole.log(soma);',
      hint: 'Dentro da função: let total = 0, um for...of somando e, no fim, return total. O return fica depois do laço.',
      explainSolution: 'A função junta o que você já sabe: variável, laço e return. O resultado sai pronto para ser guardado.',
      expected: { soma: 9 }, requires: 'return',
      functionTests: [{ name: 'totalDoses', args: [[1, 1]], expected: 2 }, { name: 'totalDoses', args: [[]], expected: 0 }]
    },
    {
      id: 't5', title: 'Ocupados por função',
      story: 'A função recebe a lista de leitos (objetos) e devolve os números dos ocupados.',
      mission: 'Crie a função ocupados(leitos) que devolve uma lista com o numero de cada leito cuja propriedade ocupado é true. Guarde em resultado o valor de ocupados(lista). Mostre no console.',
      starter: 'const lista = [\n  { numero: "A-1", ocupado: true },\n  { numero: "A-2", ocupado: false },\n  { numero: "A-3", ocupado: true }\n];\n',
      solution: 'const lista = [\n  { numero: "A-1", ocupado: true },\n  { numero: "A-2", ocupado: false },\n  { numero: "A-3", ocupado: true }\n];\nfunction ocupados(leitos) {\n  const numeros = [];\n  for (const leito of leitos) {\n    if (leito.ocupado) {\n      numeros.push(leito.numero);\n    }\n  }\n  return numeros;\n}\nconst resultado = ocupados(lista);\nconsole.log(resultado);',
      hint: 'Dentro da função: uma lista vazia, um for...of com if e push, e return da lista no fim.',
      explainSolution: 'A função reúne laço, condição e lista. Como recebe a lista por parâmetro, funciona para qualquer conjunto de leitos.',
      expected: { resultado: ['A-1', 'A-3'] }, requires: 'return',
      functionTests: [{ name: 'ocupados', args: [[{ numero: 'B-1', ocupado: false }]], expected: [] }, { name: 'ocupados', args: [[{ numero: 'C-1', ocupado: true }, { numero: 'C-2', ocupado: true }]], expected: ['C-1', 'C-2'] }]
    }
  ],
  20: [
    {
      id: 't1', title: 'Metade do preço',
      story: 'Os preços do convênio têm 50% de desconto.',
      mission: 'Guarde em comDesconto uma lista nova com cada preço de precos dividido por 2. Mostre no console.',
      starter: 'const precos = [10, 20];\n',
      solution: 'const precos = [10, 20];\nconst comDesconto = precos.map(preco => preco / 2);\nconsole.log(comDesconto);',
      hint: 'precos.map(preco => preco / 2) aplica a divisão a cada item e devolve a lista nova.',
      explainSolution: 'map recebe uma função curta e a usa em cada item. A lista original continua igual.',
      expected: { comDesconto: [5, 10] },
      variantHint: 'Use precos.map para calcular, em vez de escrever os números.',
      variants: [{ given: { precos: [8] }, expected: { comDesconto: [4] } }]
    },
    {
      id: 't2', title: 'Nomes em maiúsculas',
      story: 'A lista de chamada precisa aparecer em maiúsculas.',
      mission: 'Guarde em maiusculos uma lista nova com cada nome de nomes em maiúsculas. Mostre no console.',
      starter: 'const nomes = ["ana", "bia"];\n',
      solution: 'const nomes = ["ana", "bia"];\nconst maiusculos = nomes.map(nome => nome.toUpperCase());\nconsole.log(maiusculos);',
      hint: 'Dentro do map, a função recebe cada nome e devolve nome.toUpperCase().',
      explainSolution: 'map funciona com textos também: cada item passa pela transformação e entra na lista nova.',
      expected: { maiusculos: ['ANA', 'BIA'] },
      variantHint: 'Transforme com map, em vez de escrever a lista final.',
      variants: [{ given: { nomes: ['rui'] }, expected: { maiusculos: ['RUI'] } }]
    },
    {
      id: 't3', title: 'Etiquetas dos pacientes',
      story: 'Cada paciente é um objeto; a etiqueta junta nome e leito.',
      mission: 'Guarde em etiquetas uma lista nova com um texto por paciente no formato "Lia · A-1", lendo nome e leito de cada objeto. Mostre no console.',
      starter: 'const pacientes = [\n  { nome: "Lia", leito: "A-1" },\n  { nome: "Teo", leito: "A-2" }\n];\n',
      solution: 'const pacientes = [\n  { nome: "Lia", leito: "A-1" },\n  { nome: "Teo", leito: "A-2" }\n];\nconst etiquetas = pacientes.map(paciente => paciente.nome + " · " + paciente.leito);\nconsole.log(etiquetas);',
      hint: 'No map, cada item é um objeto: paciente.nome e paciente.leito. Devolva o texto montado.',
      explainSolution: 'map transforma uma lista de objetos numa lista de textos. A função lê as propriedades de cada um.',
      expected: { etiquetas: ['Lia · A-1', 'Teo · A-2'] },
      variantHint: 'Monte cada etiqueta dentro do map, a partir das propriedades.',
      variants: [{ given: { pacientes: [{ nome: 'Rui', leito: 'C-4' }] }, expected: { etiquetas: ['Rui · C-4'] } }]
    },
    {
      id: 't4', title: 'Só as febres',
      story: 'map transforma; filter escolhe. Aqui, só as temperaturas de febre.',
      mission: 'Guarde em febres uma lista nova só com as temperaturas de temperaturas maiores que 37.8, usando filter. Mostre no console.',
      starter: 'const temperaturas = [36.5, 38.2, 39];\n',
      solution: 'const temperaturas = [36.5, 38.2, 39];\nconst febres = temperaturas.filter(temperatura => temperatura > 37.8);\nconsole.log(febres);',
      hint: 'filter é parente do map: temperaturas.filter(t => t > 37.8) mantém só os itens em que a função devolve true.',
      explainSolution: 'filter devolve uma lista nova com os itens aprovados. É o for...of com if e push, escrito numa linha.',
      expected: { febres: [38.2, 39] },
      variantHint: 'Use filter com a comparação, em vez de escrever a lista.',
      variants: [{ given: { temperaturas: [36, 40] }, expected: { febres: [40] } }]
    }
  ],
  21: [
    {
      id: 't1', title: 'Leito em JSON',
      story: 'O sistema enviou o leito como texto JSON.',
      mission: 'Transforme texto em objeto e guarde leito e ocupado lidos dele. Mostre os dois no console.',
      starter: 'const texto = \'{"leito":"B-3","ocupado":true}\';\n',
      solution: 'const texto = \'{"leito":"B-3","ocupado":true}\';\nconst dados = JSON.parse(texto);\nconst leito = dados.leito;\nconst ocupado = dados.ocupado;\nconsole.log(leito, ocupado);',
      hint: 'JSON.parse(texto) devolve um objeto. Depois, leia dados.leito e dados.ocupado.',
      explainSolution: 'O texto vira objeto com JSON.parse. true no JSON vira um boolean de verdade.',
      expected: { leito: 'B-3', ocupado: true },
      variantHint: 'Leia os valores do objeto criado por JSON.parse, em vez de copiar do texto.',
      variants: [{ given: { texto: '{"leito":"C-9","ocupado":false}' }, expected: { leito: 'C-9', ocupado: false } }]
    },
    {
      id: 't2', title: 'Lista em JSON',
      story: 'Um JSON também pode guardar uma lista.',
      mission: 'Transforme lista em dados e guarde em segunda o nome do segundo item e em quantas o tamanho da lista. Mostre no console.',
      starter: 'const lista = \'[{"nome":"Lia"},{"nome":"Teo"}]\';\n',
      solution: 'const lista = \'[{"nome":"Lia"},{"nome":"Teo"}]\';\nconst pessoas = JSON.parse(lista);\nconst segunda = pessoas[1].nome;\nconst quantas = pessoas.length;\nconsole.log(segunda, quantas);',
      hint: 'JSON.parse devolve uma lista aqui. pessoas[1] é o segundo objeto; pessoas[1].nome lê o nome dele.',
      explainSolution: 'Depois do parse, a lista funciona como qualquer array: índice e length.',
      expected: { segunda: 'Teo', quantas: 2 },
      variantHint: 'Leia da lista criada por JSON.parse, em vez de copiar os valores.',
      variants: [{ given: { lista: '[{"nome":"A"},{"nome":"B"},{"nome":"C"}]' }, expected: { segunda: 'B', quantas: 3 } }]
    },
    {
      id: 't3', title: 'De objeto para texto',
      story: 'Para enviar a ficha, o objeto precisa virar texto JSON.',
      mission: 'Guarde em texto a versão JSON do objeto ficha, usando JSON.stringify. Mostre no console.',
      starter: 'const ficha = { nome: "Rui", idade: 61 };\n',
      solution: 'const ficha = { nome: "Rui", idade: 61 };\nconst texto = JSON.stringify(ficha);\nconsole.log(texto);',
      hint: 'JSON.stringify é o caminho inverso do JSON.parse: recebe um objeto e devolve o texto.',
      explainSolution: 'O texto gerado usa aspas duplas nas chaves e nos textos, no formato que qualquer sistema entende.',
      expected: { texto: '{"nome":"Rui","idade":61}' },
      variantHint: 'Gere o texto com JSON.stringify, em vez de digitá-lo.',
      variants: [{ given: { ficha: { nome: 'Lia', idade: 30 } }, expected: { texto: '{"nome":"Lia","idade":30}' } }]
    }
  ],
  22: [
    {
      id: 't1', title: 'Exame pronto',
      story: 'O laboratório prometeu um resultado: ele chega numa Promise.',
      mission: 'Espere pedido e guarde o texto recebido em resultado. Mostre no console.',
      starter: 'const pedido = Promise.resolve("Exame pronto");\n',
      solution: 'const pedido = Promise.resolve("Exame pronto");\nconst resultado = await pedido;\nconsole.log(resultado);',
      hint: 'await pedido espera a resposta e entrega o valor. Guarde esse valor em resultado.',
      explainSolution: 'Sem await, resultado seria a própria Promise. Com await, é o texto que chegou.',
      expected: { resultado: 'Exame pronto' }, requires: 'await',
      variantHint: 'Guarde o resultado de await pedido, em vez de escrever o texto.',
      variants: [{ given: { pedido: { $code: 'Promise.resolve("Exame atrasado")' } }, expected: { resultado: 'Exame atrasado' } }]
    },
    {
      id: 't2', title: 'Função que demora',
      story: 'Uma função async também devolve uma Promise.',
      mission: 'Crie a função async buscarLeito() que devolve "C-7". Espere o resultado dela e guarde em leito. Mostre no console.',
      starter: '',
      solution: 'async function buscarLeito() {\n  return "C-7";\n}\nconst leito = await buscarLeito();\nconsole.log(leito);',
      hint: 'async function buscarLeito() { return "C-7"; } e, fora, const leito = await buscarLeito();',
      explainSolution: 'Uma função async sempre devolve uma Promise. Por isso a chamada precisa de await para pegar o texto.',
      expected: { leito: 'C-7' }, requires: 'await',
      functionTests: [{ name: 'buscarLeito', args: [], expected: 'C-7' }]
    },
    {
      id: 't3', title: 'Duas respostas',
      story: 'Dois setores respondem; o total depende dos dois.',
      mission: 'Espere as duas Promises, guarde os números em uti e em pediatria e some os dois em total. Mostre total no console.',
      starter: 'const respostaUti = Promise.resolve(2);\nconst respostaPediatria = Promise.resolve(3);\n',
      solution: 'const respostaUti = Promise.resolve(2);\nconst respostaPediatria = Promise.resolve(3);\nconst uti = await respostaUti;\nconst pediatria = await respostaPediatria;\nconst total = uti + pediatria;\nconsole.log(total);',
      hint: 'Um await para cada Promise. Só depois de ter os dois números é que dá para somar.',
      explainSolution: 'Cada await espera a própria resposta. Com os valores em mãos, a soma é comum.',
      expected: { uti: 2, pediatria: 3, total: 5 }, requires: 'await'
    }
  ],
  23: [
    {
      id: 't1', title: 'Sala liberada',
      story: 'O painel precisa mostrar um aviso novo.',
      mission: 'Encontre o elemento aviso e troque o texto dele para "Sala liberada". Guarde em painel o elemento e mostre painel.textContent no console.',
      starter: '// O elemento tem id "aviso".\n',
      solution: 'const painel = document.getElementById("aviso");\npainel.textContent = "Sala liberada";\nconsole.log(painel.textContent);',
      hint: 'document.getElementById("aviso") encontra o elemento. textContent é o texto que aparece nele.',
      explainSolution: 'Primeiro se encontra o elemento; depois se altera a propriedade textContent. A página muda na hora.',
      expected: {}, consoleArgs: ['painel.textContent'], domExpected: { aviso: 'Sala liberada' }
    },
    {
      id: 't2', title: 'Completando o aviso',
      story: 'O aviso antigo continua, com uma marca de atualização no fim.',
      mission: 'Guarde em antes o texto atual do elemento aviso. Depois, troque o texto para antes seguido de " · atualizado". Mostre antes no console.',
      starter: '',
      solution: 'const aviso = document.getElementById("aviso");\nconst antes = aviso.textContent;\naviso.textContent = antes + " · atualizado";\nconsole.log(antes);',
      hint: 'Leia aviso.textContent antes de mudar. Depois, atribua o texto antigo mais " · atualizado".',
      explainSolution: 'textContent serve para ler e para escrever. Guardar o texto antigo permite reaproveitá-lo.',
      expected: { antes: 'Painel indisponível' }, domExpected: { aviso: 'Painel indisponível · atualizado' }
    }
  ],
  24: [
    {
      id: 't1', title: 'A primeira pista',
      story: 'A consulta devolve uma lista de pistas; cada uma tem id e descricao.',
      mission: 'Consulte a tabela pistas_js_treino, espere a resposta e guarde em primeira a descricao da primeira pista de data. Mostre no console.',
      starter: 'const { data } = await supabase.from("pistas_js_treino").select("*");\n',
      solution: 'const { data } = await supabase.from("pistas_js_treino").select("*");\nconst primeira = data[0].descricao;\nconsole.log(primeira);',
      hint: 'data é uma lista de objetos. data[0] é a primeira pista e data[0].descricao, o texto dela.',
      explainSolution: 'A resposta do banco chega como lista de objetos. Índice e ponto bastam para ler o que interessa.',
      expected: { primeira: 'Registro da última ficha' }, requires: 'await',
      variantHint: 'Leia a descrição de data[0], em vez de escrever o texto.',
      variants: [{ tabela: [{ id: 1, descricao: 'Pista A' }, { id: 2, descricao: 'Pista B' }], expected: { primeira: 'Pista A' } }]
    },
    {
      id: 't2', title: 'Só as descrições',
      story: 'O quadro mostra só o texto de cada pista.',
      mission: 'Consulte a tabela pistas_js_treino e guarde em descricoes uma lista nova só com a descricao de cada pista de data. Mostre no console.',
      starter: 'const { data } = await supabase.from("pistas_js_treino").select("*");\n',
      solution: 'const { data } = await supabase.from("pistas_js_treino").select("*");\nconst descricoes = data.map(pista => pista.descricao);\nconsole.log(descricoes);',
      hint: 'data.map(pista => pista.descricao) transforma a lista de objetos numa lista de textos.',
      explainSolution: 'map, do caso 20, funciona com os dados do banco também. Cada objeto vira só a sua descrição.',
      expected: { descricoes: ['Registro da última ficha', 'Crachá FAR-24C'] }, requires: 'await',
      variantHint: 'Transforme data com map, em vez de escrever a lista.',
      variants: [{ tabela: [{ id: 1, descricao: 'Pista A' }], expected: { descricoes: ['Pista A'] } }]
    },
    {
      id: 't3', title: 'Deu erro?',
      story: 'Toda consulta devolve data e error. Antes de usar os dados, confira o erro.',
      mission: 'Consulte a tabela pistas_js_treino pegando data e error. Guarde em deuErro se error é diferente de null e em total quantas pistas vieram. Mostre os dois no console.',
      starter: '',
      solution: 'const { data, error } = await supabase.from("pistas_js_treino").select("*");\nconst deuErro = error !== null;\nconst total = data.length;\nconsole.log(deuErro, total);',
      hint: 'const { data, error } = await ... pega os dois campos. error !== null é true quando houve erro.',
      explainSolution: 'Quando a consulta funciona, error é null e deuErro fica false. Conferir isso evita usar data vazio.',
      expected: { deuErro: false, total: 2 }, requires: 'await',
      variantHint: 'Conte com data.length, em vez de escrever o número.',
      variants: [{ tabela: [{ id: 1, descricao: 'Pista A' }, { id: 2, descricao: 'Pista B' }, { id: 3, descricao: 'Pista C' }], expected: { deuErro: false, total: 3 } }]
    }
  ]
};
