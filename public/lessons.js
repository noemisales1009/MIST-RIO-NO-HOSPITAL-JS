'use strict';
globalThis.HospitalLessons = [
  {
    "id": 1,
    "case": 1,
    "title": "Uma caixinha chamada senha",
    "concept": "const · texto · console.log",
    "story": "A sala de arquivos amanheceu trancada. Um bilhete esquecido pode revelar quem trocou a configuração do terminal.",
    "explanation": "Uma variável é como uma caixinha com uma etiqueta. const cria a variável; = guarda o valor; as aspas indicam um texto. abrirPorta é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Crie a variável senha e guarde nela o texto \"4271\". Mostre o valor no console. Depois, chame abrirPorta(senha); para aplicar os dados no caso.",
    "clue": "A senha de hoje é 4271.",
    "starter": "// Guarde a senha do bilhete.\nconst senha = \"\";\n\nconsole.log(senha);\n\n// Aplique os dados no objeto do caso.\nabrirPorta(senha);",
    "solution": "const senha = \"4271\";\nconsole.log(senha);\nabrirPorta(senha);",
    "conceptHint": "Uma variável guarda um valor com um nome. Textos ficam entre aspas. Onde está a senha na história?",
    "hint": "Coloque 4271 entre as aspas vazias. O nome da variável deve ser senha. Termine com abrirPorta(senha);",
    "explainSolution": "A primeira linha guarda o texto \"4271\" em senha. A segunda mostra o conteúdo no console. A última linha executa a ação visível no caso.",
    "expected": {
      "senha": "4271"
    },
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-1-solution",
    "effect": "record",
    "action": {
      "name": "abrirPorta",
      "args": [
        "senha"
      ],
      "object": "terminal",
      "type": "door",
      "title": "Porta destrancada",
      "description": "A senha foi aceita. A porta dos arquivos se abriu."
    }
  },
  {
    "id": 2,
    "case": 2,
    "title": "Uma informação que muda: let",
    "concept": "let · atribuição",
    "story": "O rádio da equipe parou de responder durante um teste. Atualize o estado do painel para abrir a ficha técnica.",
    "explanation": "Use let quando a variável precisar receber outro valor. Depois de criar a variável, escreva o nome, = e o novo valor. Você não repete let para atualizar. ligarRadio é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Crie acesso com let, começando em \"bloqueado\". Depois mude o valor para \"liberado\" e mostre no console. Depois, chame ligarRadio(acesso); para aplicar os dados no caso.",
    "clue": "Estado inicial: bloqueado → estado final: liberado.",
    "starter": "let acesso = \"bloqueado\";\n\n// Atualize acesso aqui.\n\nconsole.log(acesso);\n\n// Aplique os dados no objeto do caso.\nligarRadio(acesso);",
    "solution": "let acesso = \"bloqueado\";\nacesso = \"liberado\";\nconsole.log(acesso);\nligarRadio(acesso);",
    "conceptHint": "let permite trocar o valor depois. Para atualizar, escreva só o nome da variável, = e o novo valor, sem repetir let.",
    "hint": "Depois da primeira linha, escreva acesso = \"liberado\";. A variável precisa permitir uma nova atribuição. Termine com ligarRadio(acesso);",
    "explainSolution": "let permite mudar acesso. A segunda linha atualiza a mesma variável, em vez de criar outra. A última linha executa a ação visível no caso.",
    "expected": {
      "acesso": "liberado"
    },
    "mutable": "acesso",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-2-solution",
    "effect": "record",
    "action": {
      "name": "ligarRadio",
      "args": [
        "acesso"
      ],
      "object": "rádio",
      "type": "radio",
      "title": "Rádio restabelecido",
      "description": "O rádio saiu do bloqueio e recebeu o registro do teste."
    }
  },
  {
    "id": 3,
    "case": 3,
    "title": "Os nomes das nossas pistas",
    "concept": "nomes de variáveis · maiúsculas e minúsculas",
    "story": "Uma ficha chegou à recepção sem identificação. Recupere o setor e o código antes que ela seja arquivada no lugar errado.",
    "explanation": "Os nomes ajudam a entender o que cada variável guarda. setor e codigoFicha são nomes diferentes. JavaScript distingue letras maiúsculas e minúsculas: setor é diferente de Setor. identificarFicha é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Crie setor com o texto \"Arquivos\" e codigoFicha com o texto \"B-0042\". Mostre os dois valores no console. Depois, chame identificarFicha(setor, codigoFicha); para aplicar os dados no caso.",
    "clue": "Setor: Arquivos · ficha: B-0042.",
    "starter": "// Dê um nome a cada informação.\nconst setor = \"\";\nconst codigoFicha = \"\";\n\nconsole.log(setor, codigoFicha);\n\n// Aplique os dados no objeto do caso.\nidentificarFicha(setor, codigoFicha);",
    "solution": "const setor = \"Arquivos\";\nconst codigoFicha = \"B-0042\";\nconsole.log(setor, codigoFicha);\nidentificarFicha(setor, codigoFicha);",
    "conceptHint": "Cada informação ganha a própria variável. Os nomes precisam ser escritos exatamente como na missão, com as mesmas maiúsculas.",
    "hint": "Mantenha os nomes setor e codigoFicha, com F maiúsculo. Os dois valores são textos e precisam de aspas. Termine com identificarFicha(setor, codigoFicha);",
    "explainSolution": "Cada variável tem uma responsabilidade: setor guarda o local e codigoFicha guarda o identificador da ficha. A última linha executa a ação visível no caso.",
    "expected": {
      "setor": "Arquivos",
      "codigoFicha": "B-0042"
    },
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-3-solution",
    "effect": "record",
    "action": {
      "name": "identificarFicha",
      "args": [
        "setor",
        "codigoFicha"
      ],
      "object": "ficha",
      "type": "file",
      "title": "Ficha identificada",
      "description": "O setor e o código preencheram a ficha que estava em branco."
    }
  },
  {
    "id": 4,
    "case": 4,
    "title": "Texto ou número?",
    "concept": "number · string · typeof",
    "story": "A etiqueta de uma caixa perdeu os primeiros zeros. Separe texto de número para recuperar o código completo.",
    "explanation": "Um número serve para cálculos e comparações. Um texto preserva caracteres, inclusive os zeros à esquerda. typeof mostra o tipo de um valor: number para número e string para texto. imprimirEtiqueta é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Guarde 217 como número em horario e \"0042\" como texto em codigo. Mostre os valores e seus tipos no console. Depois, chame imprimirEtiqueta(codigo); para aplicar os dados no caso.",
    "clue": "Horário numérico: 217 · código completo: 0042.",
    "starter": "const horario = 0;\nconst codigo = \"\";\n\nconsole.log(horario, typeof horario);\nconsole.log(codigo, typeof codigo);\n\n// Aplique os dados no objeto do caso.\nimprimirEtiqueta(codigo);",
    "solution": "const horario = 217;\nconst codigo = \"0042\";\nconsole.log(horario, typeof horario);\nconsole.log(codigo, typeof codigo);\nimprimirEtiqueta(codigo);",
    "conceptHint": "Número não usa aspas; texto usa. O que acontece com os zeros à esquerda quando um código vira número?",
    "hint": "217 deve ficar sem aspas. \"0042\" precisa das aspas para manter os quatro caracteres. Termine com imprimirEtiqueta(codigo);",
    "explainSolution": "horario é number e codigo é string. Transformar o código em número faria os zeros à esquerda desaparecerem. A última linha executa a ação visível no caso.",
    "expected": {
      "horario": 217,
      "codigo": "0042"
    },
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-4-solution",
    "effect": "record",
    "action": {
      "name": "imprimirEtiqueta",
      "args": [
        "codigo"
      ],
      "object": "impressora",
      "type": "printer",
      "title": "Etiqueta reimpressa",
      "description": "A impressora preservou os zeros do código na nova etiqueta."
    }
  },
  {
    "id": 5,
    "case": 5,
    "title": "Juntando as informações",
    "concept": "concatenação · operador +",
    "story": "Uma gaveta recebeu uma etiqueta de outra ala. Monte o destino correto para descobrir a origem da troca.",
    "explanation": "O sinal + também pode juntar textos. Espaços e pontuação precisam fazer parte desses textos. Por exemplo, \"Sala \" + \"A\" produz \"Sala A\". abrirGaveta é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Use ala e sala para montar destino com o texto exato \"Ala B - Arquivos\". Mostre destino no console. Depois, chame abrirGaveta(destino); para aplicar os dados no caso.",
    "clue": "A etiqueta deve dizer: Ala B - Arquivos.",
    "starter": "const ala = \"B\";\nconst sala = \"Arquivos\";\n\nconst destino = \"\";\nconsole.log(destino);\n\n// Aplique os dados no objeto do caso.\nabrirGaveta(destino);",
    "solution": "const ala = \"B\";\nconst sala = \"Arquivos\";\nconst destino = \"Ala \" + ala + \" - \" + sala;\nconsole.log(destino);\nabrirGaveta(destino);",
    "conceptHint": "O + junta textos. Os espaços e o traço também são texto e precisam estar dentro de aspas.",
    "hint": "Junte \"Ala \", ala, \" - \" e sala usando +. Repare nos espaços dentro das aspas. Termine com abrirGaveta(destino);",
    "explainSolution": "As partes fixas do texto são juntadas aos valores das variáveis. Também seria possível usar uma template string. A última linha executa a ação visível no caso.",
    "expected": {
      "ala": "B",
      "sala": "Arquivos",
      "destino": "Ala B - Arquivos"
    },
    "variantHint": "Monte destino juntando ala e sala com +, em vez de escrever o texto final.",
    "variants": [
      {
        "given": {
          "ala": "C",
          "sala": "Farmácia"
        },
        "expected": {
          "destino": "Ala C - Farmácia"
        }
      }
    ],
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-5-solution",
    "effect": "record",
    "action": {
      "name": "abrirGaveta",
      "args": [
        "destino"
      ],
      "object": "gaveta",
      "type": "drawer",
      "title": "Gaveta localizada",
      "description": "A etiqueta corrigida levou à gaveta certa."
    }
  },
  {
    "id": 6,
    "case": 6,
    "title": "O primeiro relatório",
    "concept": "revisão · variáveis e textos",
    "story": "Um relatório ficou pela metade no fim do turno. Junte as informações para descobrir qual registro o interrompeu.",
    "explanation": "Um pequeno programa pode guardar informações, montar uma mensagem e exibir o resultado. Vamos juntar os passos que você já usou, sem adicionar um comando novo. recuperarRelatorio é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Guarde setor = \"Arquivos\" e status = \"liberado\". Monte relatorio com o texto \"Setor: Arquivos | Status: liberado\" e mostre no console. Depois, chame recuperarRelatorio(relatorio); para aplicar os dados no caso.",
    "clue": "Relatório esperado: Setor: Arquivos | Status: liberado.",
    "starter": "const setor = \"Arquivos\";\nconst status = \"liberado\";\n\nconst relatorio = \"\";\nconsole.log(relatorio);\n\n// Aplique os dados no objeto do caso.\nrecuperarRelatorio(relatorio);",
    "solution": "const setor = \"Arquivos\";\nconst status = \"liberado\";\nconst relatorio = \"Setor: \" + setor + \" | Status: \" + status;\nconsole.log(relatorio);\nrecuperarRelatorio(relatorio);",
    "conceptHint": "Monte o relatório juntando partes fixas, entre aspas, com as variáveis, usando +.",
    "hint": "Comece por \"Setor: \" + setor. Depois junte \" | Status: \" + status. Termine com recuperarRelatorio(relatorio);",
    "explainSolution": "O relatório é formado com duas variáveis e duas partes fixas. Você já consegue guardar e apresentar informações de uma investigação. A última linha executa a ação visível no caso.",
    "expected": {
      "setor": "Arquivos",
      "status": "liberado",
      "relatorio": "Setor: Arquivos | Status: liberado"
    },
    "variantHint": "Monte relatorio com as variáveis setor e status, em vez de escrever o texto final.",
    "variants": [
      {
        "given": {
          "setor": "Laboratório",
          "status": "pendente"
        },
        "expected": {
          "relatorio": "Setor: Laboratório | Status: pendente"
        }
      }
    ],
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-6-solution",
    "effect": "record",
    "action": {
      "name": "recuperarRelatorio",
      "args": [
        "relatorio"
      ],
      "object": "relatório",
      "type": "file",
      "title": "Relatório recuperado",
      "description": "O terminal recompôs o relatório com os dados que você juntou."
    }
  },
  {
    "id": 7,
    "case": 7,
    "title": "Quem passou de madrugada?",
    "concept": "comparação · boolean",
    "story": "Um teste disparou o alarme da sala técnica de madrugada. A porta do corredor registrou o horário de passagem de cada pessoa. Use comparações para descobrir quem passou por lá antes das 6h.",
    "explanation": "Uma comparação produz um valor booleano: true ou false. O operador < significa menor que: 3 < 5 resulta em true, e 9 < 5 resulta em false. verificarAlarme é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Compare o horário de cada pessoa com 6 e guarde o resultado (true ou false) nas três variáveis. Mostre as três no console. Depois, chame verificarAlarme(elisaCedo, celinaCedo, jonasCedo); para aplicar os dados no caso.",
    "clue": "A porta do corredor guarda o horário de passagem de cada pessoa. O alarme disparou antes das 6h.",
    "starter": "// Hora em que cada pessoa passou pela porta (0 a 23).\nconst horaElisa = 23;\nconst horaCelina = 8;\nconst horaJonas = 2;\n\n// O alarme disparou de madrugada: antes das 6h.\n// Compare cada hora com 6. A primeira já está pronta.\nconst elisaCedo = horaElisa < 6;\nconst celinaCedo = false;\nconst jonasCedo = false;\n\nconsole.log(elisaCedo, celinaCedo, jonasCedo);\n\n// Aplique os dados no objeto do caso.\nverificarAlarme(elisaCedo, celinaCedo, jonasCedo);",
    "solution": "const horaElisa = 23;\nconst horaCelina = 8;\nconst horaJonas = 2;\nconst elisaCedo = horaElisa < 6;\nconst celinaCedo = horaCelina < 6;\nconst jonasCedo = horaJonas < 6;\nconsole.log(elisaCedo, celinaCedo, jonasCedo);\nverificarAlarme(elisaCedo, celinaCedo, jonasCedo);",
    "conceptHint": "Uma comparação responde sim (true) ou não (false). A primeira linha já mostra o modelo: repita a ideia para as outras pessoas.",
    "hint": "Escreva celinaCedo = horaCelina < 6 e faça o mesmo para Jonas. Não escreva true ou false direto: deixe a comparação calcular. Termine com verificarAlarme(elisaCedo, celinaCedo, jonasCedo);",
    "explainSolution": "Cada comparação devolve true ou false a partir do horário. Só horaJonas < 6 resulta em true: Jonas é a única pessoa que passou pelo corredor de madrugada. A última linha executa a ação visível no caso.",
    "expected": {
      "horaElisa": 23,
      "horaCelina": 8,
      "horaJonas": 2,
      "elisaCedo": false,
      "celinaCedo": false,
      "jonasCedo": true
    },
    "consoleArgs": [
      "elisaCedo",
      "celinaCedo",
      "jonasCedo"
    ],
    "variantHint": "Calcule cada variável com a comparação, como na primeira linha, em vez de escrever true ou false.",
    "variants": [
      {
        "given": {
          "horaElisa": 4,
          "horaCelina": 14,
          "horaJonas": 9
        },
        "expected": {
          "elisaCedo": true,
          "celinaCedo": false,
          "jonasCedo": false
        }
      },
      {
        "given": {
          "horaElisa": 12,
          "horaCelina": 3,
          "horaJonas": 20
        },
        "expected": {
          "elisaCedo": false,
          "celinaCedo": true,
          "jonasCedo": false
        }
      }
    ],
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-7-solution",
    "effect": "record",
    "action": {
      "name": "verificarAlarme",
      "args": [
        "elisaCedo",
        "celinaCedo",
        "jonasCedo"
      ],
      "object": "alarme",
      "type": "alarm",
      "title": "Alarme analisado",
      "description": "O histórico do alarme foi cruzado com os horários da porta do corredor."
    },
    "version": 2
  },
  {
    "id": 8,
    "case": 8,
    "title": "Se isso, faça aquilo",
    "concept": "if · bloco de código",
    "story": "O leitor de crachás ficou em modo de teste. Faça o painel responder à autorização e confira quem ativou essa configuração.",
    "explanation": "if significa “se”. O código dentro das chaves só roda quando a condição entre parênteses é verdadeira. validarCracha é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Se autorizado for true, mude mensagem para \"Acesso liberado\". Use if e mostre a mensagem no console. Depois, chame validarCracha(mensagem); para aplicar os dados no caso.",
    "clue": "O leitor de teste retornou autorizado = true.",
    "starter": "const autorizado = true;\nlet mensagem = \"\";\n\n// Escreva a condição aqui.\n\nconsole.log(mensagem);\n\n// Aplique os dados no objeto do caso.\nvalidarCracha(mensagem);",
    "solution": "const autorizado = true;\nlet mensagem = \"\";\nif (autorizado) {\n  mensagem = \"Acesso liberado\";\n}\nconsole.log(mensagem);\nvalidarCracha(mensagem);",
    "conceptHint": "if executa o bloco entre chaves somente quando a condição é true.",
    "hint": "Escreva if (autorizado) { mensagem = \"Acesso liberado\"; }. As chaves delimitam o bloco. Termine com validarCracha(mensagem);",
    "explainSolution": "autorizado é true, então o bloco roda e atualiza mensagem. Se fosse false, esse bloco seria pulado. A última linha executa a ação visível no caso.",
    "expected": {
      "autorizado": true,
      "mensagem": "Acesso liberado"
    },
    "variantHint": "Mude mensagem dentro do if, para que ela dependa de autorizado.",
    "variants": [
      {
        "given": {
          "autorizado": false
        },
        "expected": {
          "mensagem": ""
        }
      }
    ],
    "requires": "if",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-8-solution",
    "effect": "record",
    "action": {
      "name": "validarCracha",
      "args": [
        "mensagem"
      ],
      "object": "leitor",
      "type": "reader",
      "title": "Autorização confirmada",
      "description": "O leitor exibiu a resposta produzida pelo seu if."
    }
  },
  {
    "id": 9,
    "case": 9,
    "title": "E se não for?",
    "concept": "else · caminho alternativo",
    "story": "Um crachá de teste foi recusado, mas o painel não explicou o motivo. Crie o caminho alternativo para recuperar a mensagem.",
    "explanation": "else significa “senão”. Ele define o caminho que será seguido quando a condição do if for falsa. explicarRecusa é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Use if e else: mostre \"Acesso liberado\" quando autorizado for true e \"Acesso negado\" quando for false. Depois, chame explicarRecusa(mensagem); para aplicar os dados no caso.",
    "clue": "Neste teste, autorizado = false.",
    "starter": "const autorizado = false;\nlet mensagem = \"\";\n\nif (autorizado) {\n  mensagem = \"Acesso liberado\";\n}\n// Acrescente o caminho alternativo.\n\nconsole.log(mensagem);\n\n// Aplique os dados no objeto do caso.\nexplicarRecusa(mensagem);",
    "solution": "const autorizado = false;\nlet mensagem = \"\";\nif (autorizado) {\n  mensagem = \"Acesso liberado\";\n} else {\n  mensagem = \"Acesso negado\";\n}\nconsole.log(mensagem);\nexplicarRecusa(mensagem);",
    "conceptHint": "else é o caminho que roda quando a condição do if é false.",
    "hint": "Depois da chave do if, adicione else { mensagem = \"Acesso negado\"; }. Termine com explicarRecusa(mensagem);",
    "explainSolution": "Como autorizado é false, o programa entra no else. O terminal agora consegue responder aos dois resultados possíveis. A última linha executa a ação visível no caso.",
    "expected": {
      "autorizado": false,
      "mensagem": "Acesso negado"
    },
    "variantHint": "Use if e else com autorizado, para que a mensagem mude conforme o valor.",
    "variants": [
      {
        "given": {
          "autorizado": true
        },
        "expected": {
          "mensagem": "Acesso liberado"
        }
      }
    ],
    "requires": "else",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-9-solution",
    "effect": "record",
    "action": {
      "name": "explicarRecusa",
      "args": [
        "mensagem"
      ],
      "object": "leitor",
      "type": "reader",
      "title": "Recusa explicada",
      "description": "O painel mostrou o motivo de a entrada ter sido recusada."
    }
  },
  {
    "id": 10,
    "case": 10,
    "title": "Duas condições ao mesmo tempo",
    "concept": "&& · igualdade estrita ===",
    "story": "O turno e o crachá precisam ser conferidos juntos. A escala tem um registro que só aparece quando as duas condições são analisadas.",
    "explanation": "&& significa “e”: as duas condições precisam ser verdadeiras. === compara o valor e o tipo. Para comparar o turno, usamos turno === \"noite\". conferirEscala é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Crie podeEntrar usando crachaValido && turno === \"noite\". Mostre o resultado no console. Depois, chame conferirEscala(podeEntrar); para aplicar os dados no caso.",
    "clue": "Crachá válido: true · turno: noite.",
    "starter": "const crachaValido = true;\nconst turno = \"noite\";\n\nconst podeEntrar = false;\nconsole.log(podeEntrar);\n\n// Aplique os dados no objeto do caso.\nconferirEscala(podeEntrar);",
    "solution": "const crachaValido = true;\nconst turno = \"noite\";\nconst podeEntrar = crachaValido && turno === \"noite\";\nconsole.log(podeEntrar);\nconferirEscala(podeEntrar);",
    "conceptHint": "&& só resulta em true quando as duas condições são verdadeiras. === confere se dois valores são iguais.",
    "hint": "Use && para unir o crachá válido à comparação do turno com \"noite\". Termine com conferirEscala(podeEntrar);",
    "explainSolution": "As duas condições são verdadeiras, por isso podeEntrar recebe true. Se qualquer uma fosse falsa, o resultado seria false. A última linha executa a ação visível no caso.",
    "expected": {
      "crachaValido": true,
      "turno": "noite",
      "podeEntrar": true
    },
    "variantHint": "Calcule podeEntrar com crachaValido e turno, em vez de escrever true ou false.",
    "variants": [
      {
        "given": {
          "crachaValido": true,
          "turno": "dia"
        },
        "expected": {
          "podeEntrar": false
        }
      },
      {
        "given": {
          "crachaValido": false,
          "turno": "noite"
        },
        "expected": {
          "podeEntrar": false
        }
      }
    ],
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-10-solution",
    "effect": "record",
    "action": {
      "name": "conferirEscala",
      "args": [
        "podeEntrar"
      ],
      "object": "escala",
      "type": "file",
      "title": "Escala conferida",
      "description": "O sistema conferiu o crachá e o turno juntos."
    }
  },
  {
    "id": 11,
    "case": 11,
    "title": "As alternativas do perfil",
    "concept": "|| · alternativas",
    "story": "Uma ficha de manutenção recebeu um perfil de consulta indevido. Confira as alternativas permitidas antes de abrir a auditoria.",
    "explanation": "|| significa “ou”. O resultado é true se pelo menos uma das comparações for verdadeira. revisarPerfil é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Compare cargo com \"auditor\" ou \"gestor\", usando ||. Guarde a resposta em podeConsultar. Para manutenção, o resultado deve ser false. Depois, chame revisarPerfil(podeConsultar); para aplicar os dados no caso.",
    "clue": "Crachá MAN-11B · cargo: manutencao.",
    "starter": "const cargo = \"manutencao\";\n\nconst podeConsultar = true;\nconsole.log(podeConsultar);\n\n// Aplique os dados no objeto do caso.\nrevisarPerfil(podeConsultar);",
    "solution": "const cargo = \"manutencao\";\nconst podeConsultar = cargo === \"auditor\" || cargo === \"gestor\";\nconsole.log(podeConsultar);\nrevisarPerfil(podeConsultar);",
    "conceptHint": "|| resulta em true quando pelo menos uma das condições é verdadeira. Compare cargo com cada opção permitida.",
    "hint": "Faça duas comparações completas: cargo === \"auditor\" || cargo === \"gestor\". Termine com revisarPerfil(podeConsultar);",
    "explainSolution": "As duas comparações são falsas: manutenção não é auditor nem gestor. Por isso o operador || retorna false. A última linha executa a ação visível no caso.",
    "expected": {
      "cargo": "manutencao",
      "podeConsultar": false
    },
    "variantHint": "Calcule podeConsultar comparando cargo com \"auditor\" e com \"gestor\", usando ||.",
    "variants": [
      {
        "given": {
          "cargo": "gestor"
        },
        "expected": {
          "podeConsultar": true
        }
      },
      {
        "given": {
          "cargo": "auditor"
        },
        "expected": {
          "podeConsultar": true
        }
      }
    ],
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-11-solution",
    "effect": "record",
    "action": {
      "name": "revisarPerfil",
      "args": [
        "podeConsultar"
      ],
      "object": "perfil",
      "type": "reader",
      "title": "Perfil revisado",
      "description": "O painel identificou que o cargo não pode fazer esta consulta."
    }
  },
  {
    "id": 12,
    "case": 12,
    "title": "Quem tinha permissão?",
    "concept": "revisão · if/else · && · ||",
    "story": "Uma entrada exige crachá válido e um cargo autorizado. Combine as regras para descobrir qual registro precisa de revisão.",
    "explanation": "Você pode agrupar alternativas entre parênteses e combiná-las com outra condição. Os parênteses deixam claro o que será verificado junto. revisarAcesso é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Se temCracha for true e cargo for \"auditor\" ou \"gestor\", guarde \"Acesso autorizado\" em resultado. Caso contrário, guarde \"Revisar acesso\". Depois, chame revisarAcesso(resultado); para aplicar os dados no caso.",
    "clue": "Registro TI-12B: temCracha = true · cargo = ti.",
    "starter": "const temCracha = true;\nconst cargo = \"ti\";\nlet resultado = \"\";\n\n// Combine as condições e preencha resultado.\n\nconsole.log(resultado);\n\n// Aplique os dados no objeto do caso.\nrevisarAcesso(resultado);",
    "solution": "const temCracha = true;\nconst cargo = \"ti\";\nlet resultado = \"\";\nif (temCracha && (cargo === \"auditor\" || cargo === \"gestor\")) {\n  resultado = \"Acesso autorizado\";\n} else {\n  resultado = \"Revisar acesso\";\n}\nconsole.log(resultado);\nrevisarAcesso(resultado);",
    "conceptHint": "O crachá precisa ser válido E o cargo precisa ser um OU outro. Junte as regras na condição do if e use else para o outro caminho.",
    "hint": "Use if (temCracha && (cargo === \"auditor\" || cargo === \"gestor\")) e depois adicione o else. Termine com revisarAcesso(resultado);",
    "explainSolution": "O crachá é válido, mas o cargo TI não é auditor nem gestor. A regra registra \"Revisar acesso\". A última linha executa a ação visível no caso.",
    "expected": {
      "temCracha": true,
      "cargo": "ti",
      "resultado": "Revisar acesso"
    },
    "variantHint": "Escreva a condição com temCracha e cargo, para que resultado dependa dos dados.",
    "variants": [
      {
        "given": {
          "temCracha": true,
          "cargo": "gestor"
        },
        "expected": {
          "resultado": "Acesso autorizado"
        }
      },
      {
        "given": {
          "temCracha": false,
          "cargo": "auditor"
        },
        "expected": {
          "resultado": "Revisar acesso"
        }
      }
    ],
    "requires": "if",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "evidence": "case-12-solution",
    "effect": "record",
    "action": {
      "name": "revisarAcesso",
      "args": [
        "resultado"
      ],
      "object": "registro de acesso",
      "type": "reader",
      "title": "Acesso sinalizado",
      "description": "O registro foi marcado para revisão, conforme a regra do código."
    }
  },
  {
    "id": 13,
    "title": "A primeira posição",
    "concept": "arrays · índice zero",
    "explanation": "Um array guarda uma lista. A primeira posição tem índice 0; a segunda tem índice 1. Para ler um item, use o nome da lista e o índice entre colchetes. conferirPulseira é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Guarde em primeira o primeiro código de pulseiras e mostre no console. Depois, chame conferirPulseira(primeira); para aplicar os dados no caso.",
    "clue": "Lista: A-12, B-07 e C-19. Qual vem primeiro?",
    "starter": "const pulseiras = [\"A-12\", \"B-07\", \"C-19\"];\nconst primeira = \"\";\nconsole.log(primeira);\n\n// Aplique os dados no objeto do caso.\nconferirPulseira(primeira);",
    "solution": "const pulseiras = [\"A-12\", \"B-07\", \"C-19\"];\nconst primeira = pulseiras[0];\nconsole.log(primeira);\nconferirPulseira(primeira);",
    "conceptHint": "As posições de uma lista começam em 0, não em 1.",
    "hint": "A primeira posição é 0. Leia pulseiras[0]. Termine com conferirPulseira(primeira);",
    "explainSolution": "pulseiras[0] lê A-12. Os colchetes permitem acessar uma posição da lista. A última linha executa a ação visível no caso.",
    "expected": {
      "primeira": "A-12"
    },
    "variantHint": "Leia o primeiro item pela posição na lista, em vez de copiar o código.",
    "variants": [
      {
        "given": {
          "pulseiras": [
            "Z-03",
            "A-12",
            "B-07"
          ]
        },
        "expected": {
          "primeira": "Z-03"
        }
      }
    ],
    "case": 13,
    "story": "Uma caixa de pulseiras fictícias foi colocada na ordem errada. Confira o primeiro código da lista e encontre a ficha de separação.",
    "evidence": "case-13-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "conferirPulseira",
      "args": [
        "primeira"
      ],
      "object": "pulseiras",
      "type": "printer",
      "title": "Pulseira localizada",
      "description": "A primeira posição da lista revelou a pulseira correta."
    }
  },
  {
    "id": 14,
    "title": "Uma lista que cresce",
    "concept": "arrays · push · includes",
    "explanation": "push adiciona um item ao final da lista. includes confere se um item existe e retorna true ou false. registrarChave é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Adicione \"Sala 3\" a chaves usando push. Guarde em existe o resultado de procurar \"Sala 3\" com includes. Depois, chame registrarChave(chaves); para aplicar os dados no caso.",
    "clue": "A chave Sala 3 precisa voltar ao inventário.",
    "starter": "const chaves = [\"Sala 1\", \"Sala 2\"];\n// Adicione a chave aqui.\nconst existe = false;\nconsole.log(chaves, existe);\n\n// Aplique os dados no objeto do caso.\nregistrarChave(chaves);",
    "solution": "const chaves = [\"Sala 1\", \"Sala 2\"];\nchaves.push(\"Sala 3\");\nconst existe = chaves.includes(\"Sala 3\");\nconsole.log(chaves, existe);\nregistrarChave(chaves);",
    "conceptHint": "push acrescenta um item no fim da lista. includes responde se um item está na lista.",
    "hint": "Use chaves.push(\"Sala 3\") e depois chaves.includes(\"Sala 3\"). Termine com registrarChave(chaves);",
    "explainSolution": "A lista criada com const pode ter o conteúdo alterado. O que const impede é atribuir uma lista diferente à mesma variável. A última linha executa a ação visível no caso.",
    "expected": {
      "chaves": [
        "Sala 1",
        "Sala 2",
        "Sala 3"
      ],
      "existe": true
    },
    "variantHint": "Acrescente a chave com push, sem reescrever a lista inteira.",
    "variants": [
      {
        "given": {
          "chaves": [
            "Sala 7"
          ]
        },
        "expected": {
          "chaves": [
            "Sala 7",
            "Sala 3"
          ],
          "existe": true
        }
      }
    ],
    "case": 14,
    "story": "Uma chave está fisicamente no armário, mas desapareceu do inventário. Atualize a lista para abrir o registro de retirada.",
    "evidence": "case-14-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "registrarChave",
      "args": [
        "chaves"
      ],
      "object": "chaves",
      "type": "key",
      "title": "Chave registrada",
      "description": "A chave que faltava entrou no inventário do armário."
    }
  },
  {
    "id": 15,
    "title": "Uma pista de cada vez",
    "concept": "for...of · repetição",
    "explanation": "for...of percorre os itens de uma lista, um de cada vez. O nome depois de const recebe o item atual. += junta um novo trecho ao texto que já existe. reconstruirRota é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Percorra setores e acrescente cada setor seguido de ; ao texto roteiro. Depois, chame reconstruirRota(roteiro); para aplicar os dados no caso.",
    "clue": "Roteiro esperado: UTI;Farmácia;Laboratório;",
    "starter": "const setores = [\"UTI\", \"Farmácia\", \"Laboratório\"];\nlet roteiro = \"\";\n// Percorra os setores.\nconsole.log(roteiro);\n\n// Aplique os dados no objeto do caso.\nreconstruirRota(roteiro);",
    "solution": "const setores = [\"UTI\", \"Farmácia\", \"Laboratório\"];\nlet roteiro = \"\";\nfor (const setor of setores) {\n  roteiro += setor + \";\";\n}\nconsole.log(roteiro);\nreconstruirRota(roteiro);",
    "conceptHint": "for...of visita cada item da lista, um de cada vez. Dentro do laço, acrescente o item ao texto.",
    "hint": "Use for (const setor of setores) { roteiro += setor + \";\"; }. Termine com reconstruirRota(roteiro);",
    "explainSolution": "O bloco roda uma vez para cada setor, mantendo a ordem da lista. A última linha executa a ação visível no caso.",
    "expected": {
      "roteiro": "UTI;Farmácia;Laboratório;"
    },
    "variantHint": "Monte roteiro dentro do for...of, acrescentando cada setor da lista.",
    "variants": [
      {
        "given": {
          "setores": [
            "Recepção",
            "UTI"
          ]
        },
        "expected": {
          "roteiro": "Recepção;UTI;"
        }
      }
    ],
    "requires": "for",
    "case": 15,
    "story": "O roteiro de ronda ficou preso no mesmo setor. Percorra a lista inteira para reconstruir o caminho correto.",
    "evidence": "case-15-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "reconstruirRota",
      "args": [
        "roteiro"
      ],
      "object": "roteiro",
      "type": "route",
      "title": "Rota reconstruída",
      "description": "A ronda passou por todos os setores da lista."
    }
  },
  {
    "id": 16,
    "title": "Separando o que falta",
    "concept": "for...of · if · listas",
    "explanation": "Você pode combinar uma repetição com uma condição: percorra as quantidades e guarde apenas as que forem iguais a zero. conferirEstoque é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Preencha emFalta apenas com as duas quantidades zeradas. Use for...of, if e push. Depois, chame conferirEstoque(emFalta); para aplicar os dados no caso.",
    "clue": "Quantidades: 0, 4, 0 e 7. Há duas posições zeradas.",
    "starter": "const quantidades = [0, 4, 0, 7];\nconst emFalta = [];\n// Separe os zeros aqui.\nconsole.log(emFalta);\n\n// Aplique os dados no objeto do caso.\nconferirEstoque(emFalta);",
    "solution": "const quantidades = [0, 4, 0, 7];\nconst emFalta = [];\nfor (const quantidade of quantidades) {\n  if (quantidade === 0) {\n    emFalta.push(quantidade);\n  }\n}\nconsole.log(emFalta);\nconferirEstoque(emFalta);",
    "conceptHint": "Percorra a lista com for...of. Para cada quantidade, pergunte com if se ela é zero; se for, use push.",
    "hint": "Dentro do for, confira quantidade === 0 antes de adicionar o valor a emFalta. Termine com conferirEstoque(emFalta);",
    "explainSolution": "Somente os valores que cumprem a condição entram na nova lista. A última linha executa a ação visível no caso.",
    "expected": {
      "emFalta": [
        0,
        0
      ]
    },
    "variantHint": "Use for...of e if para colocar em emFalta cada quantidade igual a 0 da lista.",
    "variants": [
      {
        "given": {
          "quantidades": [
            3,
            0,
            5
          ]
        },
        "expected": {
          "emFalta": [
            0
          ]
        }
      }
    ],
    "requires": "for",
    "case": 16,
    "story": "Duas prateleiras estão sem caixas, mas o painel mostra tudo normal. Separe as quantidades zeradas para revelar a conferência.",
    "evidence": "case-16-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "conferirEstoque",
      "args": [
        "emFalta"
      ],
      "object": "estoque",
      "type": "stock",
      "title": "Faltas encontradas",
      "description": "As posições zeradas foram destacadas na conferência."
    }
  },
  {
    "id": 17,
    "title": "Uma ficha estruturada",
    "concept": "objetos · propriedades",
    "explanation": "Um objeto reúne informações com nomes, chamados propriedades. ficha.setor acessa a propriedade setor da ficha. restaurarFicha é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Leia ficha.setor e guarde o texto em setorEncontrado. Depois, chame restaurarFicha(setorEncontrado); para aplicar os dados no caso.",
    "clue": "A ficha B-07 pertence ao Laboratório.",
    "starter": "const ficha = { codigo: \"B-07\", setor: \"Laboratório\" };\nconst setorEncontrado = \"\";\nconsole.log(setorEncontrado);\n\n// Aplique os dados no objeto do caso.\nrestaurarFicha(setorEncontrado);",
    "solution": "const ficha = { codigo: \"B-07\", setor: \"Laboratório\" };\nconst setorEncontrado = ficha.setor;\nconsole.log(setorEncontrado);\nrestaurarFicha(setorEncontrado);",
    "conceptHint": "Um objeto guarda valores em propriedades. Para ler uma, escreva o nome do objeto, um ponto e o nome da propriedade.",
    "hint": "Depois de =, use ficha.setor. Termine com restaurarFicha(setorEncontrado);",
    "explainSolution": "A notação com ponto lê um campo do objeto. Você não precisa decorar a posição do campo. A última linha executa a ação visível no caso.",
    "expected": {
      "setorEncontrado": "Laboratório"
    },
    "variantHint": "Leia o valor pela propriedade do objeto ficha, em vez de copiar o texto.",
    "variants": [
      {
        "given": {
          "ficha": {
            "codigo": "C-11",
            "setor": "Farmácia"
          }
        },
        "expected": {
          "setorEncontrado": "Farmácia"
        }
      }
    ],
    "case": 17,
    "story": "Uma ficha estruturada guarda a informação que falta em um relatório. Abra o campo certo para recuperar o setor original.",
    "evidence": "case-17-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "restaurarFicha",
      "args": [
        "setorEncontrado"
      ],
      "object": "ficha",
      "type": "file",
      "title": "Setor recuperado",
      "description": "O campo do objeto restaurou o setor da ficha."
    }
  },
  {
    "id": 18,
    "title": "Padronizar antes de comparar",
    "concept": "strings · trim · toLowerCase",
    "explanation": "trim remove espaços das pontas. toLowerCase transforma as letras em minúsculas. Você pode encadear essas operações. unificarCadastro é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Guarde em nomeLimpo o texto ana, sem espaços e em minúsculas. Depois, chame unificarCadastro(nomeLimpo); para aplicar os dados no caso.",
    "clue": "Cadastro recebido: \"  ANA  \".",
    "starter": "const nome = \"  ANA  \";\nconst nomeLimpo = \"\";\nconsole.log(nomeLimpo);\n\n// Aplique os dados no objeto do caso.\nunificarCadastro(nomeLimpo);",
    "solution": "const nome = \"  ANA  \";\nconst nomeLimpo = nome.trim().toLowerCase();\nconsole.log(nomeLimpo);\nunificarCadastro(nomeLimpo);",
    "conceptHint": "Textos têm métodos prontos: um remove os espaços das pontas e outro deixa tudo em minúsculas. Dá para usar os dois em sequência.",
    "hint": "Use nome.trim().toLowerCase(). Os parênteses chamam cada operação. Termine com unificarCadastro(nomeLimpo);",
    "explainSolution": "O texto é padronizado antes de ser usado numa comparação ou busca. A última linha executa a ação visível no caso.",
    "expected": {
      "nomeLimpo": "ana"
    },
    "variantHint": "Transforme nome com os métodos de texto, em vez de escrever o resultado.",
    "variants": [
      {
        "given": {
          "nome": "  BrUnO "
        },
        "expected": {
          "nomeLimpo": "bruno"
        }
      }
    ],
    "case": 18,
    "story": "Um nome com espaços e letras diferentes criou dois cadastros. Padronize o texto e confira a origem da duplicação.",
    "evidence": "case-18-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "unificarCadastro",
      "args": [
        "nomeLimpo"
      ],
      "object": "cadastro",
      "type": "file",
      "title": "Cadastro normalizado",
      "description": "O texto padronizado permitiu reconhecer os dois cadastros iguais."
    }
  },
  {
    "id": 19,
    "title": "Uma regra para todos",
    "concept": "funções · parâmetros · return",
    "explanation": "Uma função recebe valores pelos parâmetros e devolve um resultado com return. Você escreve a regra uma vez e a usa com entradas diferentes: aqui, uma vez para cada pessoa. abrirGavetaSecreta é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Complete a função estavaNaSala(entrada, saida, hora): ela deve devolver true quando a hora estiver entre a entrada e a saída, incluindo os dois limites, e false nos outros casos. As três chamadas já usam a função. Mostre os resultados no console e chame abrirGavetaSecreta(nelsonEstava, claraEstava, marinaEstava); para aplicar os dados no caso.",
    "clue": "A ficha foi escondida às 21h. A porta dos arquivos registra a entrada e a saída de cada pessoa.",
    "starter": "// A ficha foi escondida às 21h.\nconst horaDoSumico = 21;\n\n// Regra: a pessoa estava na sala se entrou até essa hora\n// e saiu nessa hora ou depois.\nfunction estavaNaSala(entrada, saida, hora) {\n  // Devolva true ou false com return.\n}\n\n// Entrada e saída de cada pessoa (porta dos arquivos).\nconst nelsonEstava = estavaNaSala(19, 23, horaDoSumico);\nconst claraEstava = estavaNaSala(7, 15, horaDoSumico);\nconst marinaEstava = estavaNaSala(13, 20, horaDoSumico);\n\nconsole.log(nelsonEstava, claraEstava, marinaEstava);\n\n// Aplique os dados no objeto do caso.\nabrirGavetaSecreta(nelsonEstava, claraEstava, marinaEstava);",
    "solution": "const horaDoSumico = 21;\nfunction estavaNaSala(entrada, saida, hora) {\n  return entrada <= hora && hora <= saida;\n}\nconst nelsonEstava = estavaNaSala(19, 23, horaDoSumico);\nconst claraEstava = estavaNaSala(7, 15, horaDoSumico);\nconst marinaEstava = estavaNaSala(13, 20, horaDoSumico);\nconsole.log(nelsonEstava, claraEstava, marinaEstava);\nabrirGavetaSecreta(nelsonEstava, claraEstava, marinaEstava);",
    "conceptHint": "A regra tem duas partes que precisam ser verdadeiras ao mesmo tempo. Lembra do && do Caso 10?",
    "hint": "Dentro da função, use return com duas comparações unidas por &&: entrada <= hora e hora <= saida. Termine com abrirGavetaSecreta(nelsonEstava, claraEstava, marinaEstava);",
    "explainSolution": "A função devolve true só quando as duas comparações são verdadeiras. Com a mesma regra, você conferiu as três pessoas: só Nelson estava na sala às 21h. Marina saiu às 20h, perto do horário, mas antes dele. A última linha executa a ação visível no caso.",
    "expected": {
      "horaDoSumico": 21,
      "nelsonEstava": true,
      "claraEstava": false,
      "marinaEstava": false
    },
    "consoleArgs": [
      "nelsonEstava",
      "claraEstava",
      "marinaEstava"
    ],
    "variantHint": "Guarde em cada variável o resultado de estavaNaSala, em vez de escrever true ou false.",
    "variants": [
      {
        "given": {
          "horaDoSumico": 14
        },
        "expected": {
          "nelsonEstava": false,
          "claraEstava": true,
          "marinaEstava": true
        }
      }
    ],
    "functionTests": [
      {
        "name": "estavaNaSala",
        "args": [
          8,
          12,
          10
        ],
        "expected": true
      },
      {
        "name": "estavaNaSala",
        "args": [
          8,
          12,
          13
        ],
        "expected": false
      },
      {
        "name": "estavaNaSala",
        "args": [
          14,
          18,
          9
        ],
        "expected": false
      },
      {
        "name": "estavaNaSala",
        "args": [
          8,
          12,
          12
        ],
        "expected": true
      }
    ],
    "case": 19,
    "story": "Uma ficha foi escondida na gaveta secreta dos arquivos às 21h. A porta registra a entrada e a saída de cada pessoa. Crie uma regra reutilizável para descobrir quem estava na sala naquele horário.",
    "evidence": "case-19-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "abrirGavetaSecreta",
      "args": [
        "nelsonEstava",
        "claraEstava",
        "marinaEstava"
      ],
      "object": "gaveta secreta",
      "type": "drawer",
      "title": "Gaveta secreta aberta",
      "description": "A regra conferiu os horários da porta e a gaveta secreta liberou a ficha escondida."
    },
    "version": 2
  },
  {
    "id": 20,
    "title": "Transformar uma lista",
    "concept": "map · função de transformação",
    "explanation": "map cria uma nova lista aplicando uma função a cada item. valor => valor + 2 é uma função curta que recebe valor e devolve valor + 2. calibrarSensor é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Use map para adicionar 2 a cada leitura e guarde a nova lista em corrigidas. Depois, chame calibrarSensor(corrigidas); para aplicar os dados no caso.",
    "clue": "Leituras de treino: 18, 20 e 22. Ajuste: +2 em cada uma.",
    "starter": "const leituras = [18, 20, 22];\nconst corrigidas = [];\nconsole.log(corrigidas);\n\n// Aplique os dados no objeto do caso.\ncalibrarSensor(corrigidas);",
    "solution": "const leituras = [18, 20, 22];\nconst corrigidas = leituras.map(valor => valor + 2);\nconsole.log(corrigidas);\ncalibrarSensor(corrigidas);",
    "conceptHint": "map cria uma lista nova aplicando a mesma transformação a cada item.",
    "hint": "Use leituras.map(valor => valor + 2). Termine com calibrarSensor(corrigidas);",
    "explainSolution": "map transforma cada leitura e devolve [20, 22, 24], sem alterar a lista original. A última linha executa a ação visível no caso.",
    "expected": {
      "corrigidas": [
        20,
        22,
        24
      ]
    },
    "variantHint": "Use leituras.map para calcular a nova lista, em vez de escrever os números.",
    "variants": [
      {
        "given": {
          "leituras": [
            5,
            10
          ]
        },
        "expected": {
          "corrigidas": [
            7,
            12
          ]
        }
      }
    ],
    "case": 20,
    "story": "Um sensor de treino está deslocado em duas unidades. Corrija a lista de leituras para acessar o registro de ajuste.",
    "evidence": "case-20-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "calibrarSensor",
      "args": [
        "corrigidas"
      ],
      "object": "sensor",
      "type": "sensor",
      "title": "Sensor calibrado",
      "description": "O painel recebeu a lista de leituras corrigidas."
    }
  },
  {
    "id": 21,
    "title": "Do texto para os dados",
    "concept": "JSON · JSON.parse",
    "explanation": "JSON é um formato de texto para transportar dados. JSON.parse transforma esse texto em um objeto, e cada campo é lido com ponto, como dados.terminal. abrirArquivo é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Converta arquivo com JSON.parse. Guarde o campo terminal em terminal e o campo salvoAs em horario. Mostre os dois no console. Depois, chame abrirArquivo(terminal, horario); para aplicar os dados no caso.",
    "clue": "O arquivo é um texto JSON com os campos terminal e salvoAs.",
    "starter": "// Parece ilegível, mas é um texto no formato JSON.\nconst arquivo = '{\"terminal\":\"T-07\",\"salvoAs\":\"02:14\"}';\n\n// Converta o texto em um objeto e leia os campos.\nconst terminal = \"\";\nconst horario = \"\";\n\nconsole.log(terminal, horario);\n\n// Aplique os dados no objeto do caso.\nabrirArquivo(terminal, horario);",
    "solution": "const arquivo = '{\"terminal\":\"T-07\",\"salvoAs\":\"02:14\"}';\nconst dados = JSON.parse(arquivo);\nconst terminal = dados.terminal;\nconst horario = dados.salvoAs;\nconsole.log(terminal, horario);\nabrirArquivo(terminal, horario);",
    "conceptHint": "O texto entre aspas simples ainda não é um objeto. Existe um comando que transforma texto JSON em objeto.",
    "hint": "Crie const dados = JSON.parse(arquivo); e depois leia dados.terminal e dados.salvoAs. Termine com abrirArquivo(terminal, horario);",
    "explainSolution": "JSON.parse transforma o texto em objeto; depois, cada campo é lido com ponto. O console mostra o terminal T-07 às 02:14, e as fichas dizem quem usava esse terminal de madrugada. A última linha executa a ação visível no caso.",
    "expected": {
      "terminal": "T-07",
      "horario": "02:14"
    },
    "variantHint": "Leia terminal e horario do objeto criado por JSON.parse, em vez de copiar os valores do texto.",
    "variants": [
      {
        "given": {
          "arquivo": "{\"terminal\":\"T-03\",\"salvoAs\":\"11:40\"}"
        },
        "expected": {
          "terminal": "T-03",
          "horario": "11:40"
        }
      }
    ],
    "case": 21,
    "story": "O arquivo da escala da noite foi salvo com erros. Ele parece ilegível, mas guarda um registro JSON. Leia os dados para descobrir em qual terminal e a que horas ele foi salvo.",
    "evidence": "case-21-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "abrirArquivo",
      "args": [
        "terminal",
        "horario"
      ],
      "object": "arquivo",
      "type": "file",
      "title": "Arquivo interpretado",
      "description": "O JSON foi lido: o terminal e o horário do salvamento apareceram."
    },
    "version": 2
  },
  {
    "id": 22,
    "title": "Esperar a resposta",
    "concept": "Promise · await",
    "explanation": "Uma Promise representa um resultado que pode chegar depois. await espera esse resultado antes de continuar. Neste terminal, você pode usar await diretamente. receberMensagem é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Espere a Promise e guarde o texto recebido em mensagem. Mostre a mensagem no console. Depois, chame receberMensagem(mensagem); para aplicar os dados no caso.",
    "clue": "Resposta esperada: Registro recebido.",
    "starter": "const resposta = Promise.resolve(\"Registro recebido\");\nconst mensagem = \"\";\nconsole.log(mensagem);\n\n// Aplique os dados no objeto do caso.\nreceberMensagem(mensagem);",
    "solution": "const resposta = Promise.resolve(\"Registro recebido\");\nconst mensagem = await resposta;\nconsole.log(mensagem);\nreceberMensagem(mensagem);",
    "conceptHint": "Uma Promise é uma resposta que ainda vai chegar. await espera essa resposta antes de continuar.",
    "hint": "Use const mensagem = await resposta;. Termine com receberMensagem(mensagem);",
    "explainSolution": "await obtém o resultado da Promise. Em uma função comum, você também precisa declará-la com async. A última linha executa a ação visível no caso.",
    "expected": {
      "mensagem": "Registro recebido"
    },
    "variantHint": "Guarde em mensagem o resultado de await resposta, em vez de escrever o texto.",
    "variants": [
      {
        "given": {
          "resposta": {
            "$code": "Promise.resolve(\"Confirmação recebida\")"
          }
        },
        "expected": {
          "mensagem": "Confirmação recebida"
        }
      }
    ],
    "requires": "await",
    "case": 22,
    "story": "Uma resposta ainda estava a caminho quando o painel foi fechado. Espere a confirmação antes de concluir o registro.",
    "evidence": "case-22-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "receberMensagem",
      "args": [
        "mensagem"
      ],
      "object": "mensagem",
      "type": "message",
      "title": "Mensagem recebida",
      "description": "A resposta terminou de chegar antes da abertura do registro."
    }
  },
  {
    "id": 23,
    "title": "O código altera a página",
    "concept": "DOM · getElementById · textContent",
    "explanation": "O DOM representa os elementos de uma página. document.getElementById encontra um elemento pelo identificador. textContent lê ou troca o texto desse elemento. restaurarPainel é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Encontre o elemento aviso, troque seu texto para \"Painel recuperado\" e guarde o texto final em mensagem. Depois, chame restaurarPainel(mensagem); para aplicar os dados no caso.",
    "clue": "O mini-painel deve mostrar: Painel recuperado.",
    "starter": "const aviso = document.getElementById(\"aviso\");\n// Troque o texto do aviso.\nconst mensagem = aviso.textContent;\nconsole.log(mensagem);\n\n// Aplique os dados no objeto do caso.\nrestaurarPainel(mensagem);",
    "solution": "const aviso = document.getElementById(\"aviso\");\naviso.textContent = \"Painel recuperado\";\nconst mensagem = aviso.textContent;\nconsole.log(mensagem);\nrestaurarPainel(mensagem);",
    "conceptHint": "Primeiro encontre o elemento; depois troque a propriedade textContent dele.",
    "hint": "Depois de encontrar aviso, escreva aviso.textContent = \"Painel recuperado\";. Termine com restaurarPainel(mensagem);",
    "explainSolution": "O terminal de treino aplica a alteração ao mini-painel visível abaixo. Esse mesmo comando é usado com elementos reais em páginas web. A última linha executa a ação visível no caso.",
    "expected": {
      "mensagem": "Painel recuperado"
    },
    "domExpected": {
      "aviso": "Painel recuperado"
    },
    "dom": true,
    "case": 23,
    "story": "O aviso do painel foi alterado. Recupere o texto da página para acessar a mensagem de auditoria.",
    "evidence": "case-23-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "restaurarPainel",
      "args": [
        "mensagem"
      ],
      "object": "painel",
      "type": "monitor",
      "title": "Painel restaurado",
      "description": "O texto correto voltou a aparecer na página."
    }
  },
  {
    "id": 24,
    "title": "JavaScript encontra o banco",
    "concept": "Supabase · dados · conexão SQL",
    "explanation": "No navegador, o JavaScript conversa com o Supabase pela API. O banco guarda os dados nas tabelas SQL. O cliente supabase deste terminal é um modelo local de treino, com duas pistas fictícias; a conexão real pode ser testada abaixo. consultarPistas é uma função pronta do jogo: ela usa os dados do seu código para agir no cenário.",
    "mission": "Use await na consulta da tabela pistas_js_treino. Guarde data.length em total. O modelo de treino contém duas pistas. Depois, chame consultarPistas(total); para aplicar os dados no caso.",
    "clue": "Tabela de treino: pistas_js_treino · duas pistas disponíveis.",
    "starter": "const { data, error } = await supabase\n  .from(\"pistas_js_treino\")\n  .select(\"id, descricao\");\n\nconst total = 0;\nconsole.log(total);\n\n// Aplique os dados no objeto do caso.\nconsultarPistas(total);",
    "solution": "const { data, error } = await supabase\n  .from(\"pistas_js_treino\")\n  .select(\"id, descricao\");\n\nif (error) {\n  console.log(error.message);\n}\nconst total = data.length;\nconsole.log(total);\nconsultarPistas(total);",
    "conceptHint": "A consulta devolve uma lista em data. Toda lista sabe quantos itens tem.",
    "hint": "data é a lista retornada. data.length conta seus itens. Termine com consultarPistas(total);",
    "explainSolution": "await espera a consulta e a desestruturação recupera data e error. No modo real, uma URL de projeto e uma chave pública identificam a conexão; as permissões e as políticas do banco controlam o acesso. A última linha executa a ação visível no caso.",
    "expected": {
      "total": 2
    },
    "variantHint": "Use data.length para contar as pistas retornadas, em vez de escrever o número.",
    "variants": [
      {
        "tabela": [
          {
            "id": 1,
            "descricao": "Pista A"
          },
          {
            "id": 2,
            "descricao": "Pista B"
          },
          {
            "id": 3,
            "descricao": "Pista C"
          }
        ],
        "expected": {
          "total": 3
        }
      }
    ],
    "supabase": true,
    "case": 24,
    "story": "A última pista está em uma tabela. Conecte o JavaScript ao modelo de treino do Supabase e depois experimente um projeto de estudos.",
    "evidence": "case-24-solution",
    "effect": "record",
    "success": "Código conferido. Você recuperou um registro para concluir este caso.",
    "action": {
      "name": "consultarPistas",
      "args": [
        "total"
      ],
      "object": "tabela de pistas",
      "type": "table",
      "title": "Pistas recebidas",
      "description": "O modelo local do Supabase devolveu duas pistas fictícias."
    }
  }
];
