'use strict';
(()=>{
 const $=id=>document.getElementById(id),item=window.HospitalActiveCase;
 const profiles=[
  {id:1,kind:'archive',steps:[[0,'A detetive alcança a gaveta dos arquivos.','reach'],[1,'Puxa a gaveta pelo puxador.','open'],[2,'Procura entre as pastas.','search'],[3,'Retira a pasta com o registro.','take'],[4,'Segura a pasta para examinar.','read'],[5,'Fecha a gaveta e confere o registro.','complete']]},
  {id:2,steps:[[0,'O rádio continua sem comunicação.','ready'],[1,'Alcança o controle do rádio.','reach'],[9,'Gira o seletor e liga o rádio.','operate'],[9,'O sinal volta e uma transmissão é recebida.','signal'],[7,'Anota o identificador transmitido.','read']]},
  {id:3,steps:[[0,'A ficha está sem identificação.','ready'],[1,'Seleciona a ficha no balcão.','reach'],[3,'Prende a identificação no documento.','operate'],[5,'Levanta a ficha identificada.','take'],[6,'Lê o setor e o código recuperados.','read']]},
  {id:4,steps:[[0,'A impressora aguarda o código completo.','ready'],[1,'Alcança o botão da impressora.','reach'],[2,'Envia o código preservando os zeros.','operate'],[3,'A etiqueta sai pela bandeja.','print'],[4,'Recolhe a etiqueta impressa.','take'],[6,'Confere o registro da impressão.','read']]},
  {id:5,steps:[[0,'As gavetas da farmácia estão trocadas.','ready'],[1,'Procura o destino formado no código.','reach'],[3,'Segura o puxador da gaveta correta.','grip'],[4,'Abre a gaveta indicada pelo programa.','operate'],[5,'Retira o documento guardado nela.','take'],[6,'Examina a ficha recuperada.','read']]},
  {id:6,steps:[[0,'O relatório está incompleto.','ready'],[10,'Recompõe o texto no terminal.','reach'],[2,'Solicita a versão recuperada.','operate'],[4,'Recolhe o relatório restaurado.','take'],[6,'Lê os dados que faltavam.','read']]},
  {id:7,steps:[[0,'O alarme guarda o horário da madrugada.','ready'],[1,'Alcança o painel do relógio.','reach'],[2,'Consulta o histórico do alarme.','operate'],[2,'O horário suspeito fica destacado.','time'],[7,'Registra o horário encontrado.','read']]},
  {id:8,steps:[[0,'O leitor está em modo de teste.','ready'],[1,'Leva o cartão até o leitor.','reach'],[3,'Apresenta o crachá para validação.','operate'],[4,'Retira o cartão após a confirmação.','take'],[6,'Lê o registro da validação.','read']]},
  {id:9,steps:[[0,'O leitor recusou a entrada.','ready'],[1,'Aproxima o cartão para conferir a recusa.','reach'],[3,'Consulta a regra registrada no leitor.','operate'],[4,'A luz indica a recusa; o registro é preservado.','denied'],[6,'Lê o motivo da entrada recusada.','read']]},
  {id:10,steps:[[0,'A escala de plantão contém uma divergência.','ready'],[5,'Abre a escala para comparar os dados.','reach'],[2,'Marca o turno que o programa verificou.','operate'],[6,'Confere as condições de entrada.','compare'],[7,'Anota a divergência da escala.','read']]},
  {id:11,steps:[[0,'Um perfil recebeu uma permissão suspeita.','ready'],[10,'Abre o perfil no terminal.','reach'],[2,'Solicita a revisão da permissão.','operate'],[2,'O acesso é sinalizado para revisão.','review'],[6,'Confere o registro do perfil.','read']]},
  {id:12,steps:[[0,'Uma entrada irregular precisa ser reconstruída.','ready'],[1,'Abre a consulta ao leitor.','reach'],[3,'Confere as condições do acesso.','operate'],[4,'A irregularidade é destacada no registro.','denied'],[6,'Lê a sequência de entrada.','read']]},
  {id:13,steps:[[0,'As pulseiras precisam ser conferidas.','ready'],[1,'Seleciona a primeira pulseira da lista.','reach'],[2,'Aciona a impressão de conferência.','operate'],[3,'Uma faixa de identificação sai da impressora.','print'],[4,'Recolhe a faixa para comparar.','take'],[7,'Registra a identificação da pulseira.','read']]},
  {id:14,steps:[[0,'Uma chave ficou fora da lista.','ready'],[8,'Apresenta a chave encontrada.','reach'],[8,'Coloca a chave no lugar indicado do chaveiro.','operate'],[2,'Confirma o novo registro.','key'],[7,'Anota a inclusão da chave.','read']]},
  {id:15,steps:[[0,'O roteiro do corredor precisa ser reconstruído.','ready'],[1,'Aponta o início da rota.','reach'],[2,'Marca a primeira passagem.','operate'],[2,'Percorre os pontos do roteiro em sequência.','route'],[7,'Anota o percurso completo.','read']]},
  {id:16,steps:[[0,'As quantidades do estoque não conferem.','ready'],[1,'Alcança os compartimentos para conferir.','reach'],[3,'Verifica os itens da lista.','operate'],[4,'Destaca os compartimentos sem estoque.','stock'],[7,'Anota somente o que está em falta.','read']]},
  {id:17,steps:[[0,'Uma propriedade da ficha foi rasurada.','ready'],[5,'Abre a ficha para revisão.','reach'],[2,'Restaura a informação do setor.','operate'],[6,'Relê a propriedade recuperada.','compare'],[7,'Guarda a informação restaurada.','read']]},
  {id:18,steps:[[0,'O mesmo nome aparece com escritas diferentes.','ready'],[5,'Separa os dois registros do cadastro.','reach'],[10,'Limpa os espaços e normaliza o texto.','operate'],[6,'Compara os cadastros já normalizados.','merge'],[7,'Anota a correspondência encontrada.','read']]},
  {id:19,steps:[[0,'A gaveta secreta espera o resultado da função.','ready'],[2,'Aplica o resultado da função à fechadura.','reach'],[3,'Destranca o mecanismo da gaveta.','operate'],[4,'Puxa a gaveta secreta.','open'],[5,'Retira o arquivo que estava escondido.','take'],[6,'Lê a ficha que estava escondida.','read']]},
  {id:20,steps:[[0,'O sensor exibe leituras descalibradas.','ready'],[1,'Alcança o ajuste do sensor.','reach'],[9,'Calibra as leituras com os valores transformados.','operate'],[9,'O visor se estabiliza nas leituras corrigidas.','sensor'],[7,'Registra a calibração.','read']]},
  {id:21,steps:[[0,'O arquivo chegou como um texto JSON.','ready'],[10,'Abre o arquivo corrompido no terminal.','reach'],[2,'Converte o texto em dados do cadastro.','operate'],[6,'Lê a propriedade recuperada do arquivo.','decode'],[7,'Anota o terminal e o horário encontrados.','read']]},
  {id:22,steps:[[0,'A resposta ainda está a caminho.','ready'],[10,'Solicita a mensagem no terminal.','reach'],[0,'Aguarda a resposta chegar.','waiting'],[1,'A mensagem recebida fica disponível.','operate'],[6,'Abre e lê o conteúdo recebido.','read']]},
  {id:23,steps:[[0,'O painel foi sabotado e perdeu o aviso.','ready'],[10,'Localiza o elemento do painel.','reach'],[2,'Envia o novo texto ao aviso.','operate'],[2,'O painel volta a exibir a mensagem.','monitor'],[6,'Confere o aviso restaurado.','read']]},
  {id:24,steps:[[0,'O arquivo final está na tabela de treino.','ready'],[10,'Prepara a consulta no terminal.','reach'],[2,'Envia a leitura para o modelo de treino do Supabase.','operate'],[0,'Aguarda os dados da consulta.','waiting'],[6,'Confere as duas linhas retornadas.','rows'],[7,'Registra o resultado da leitura.','read']]}
 ];
 const profile=profiles.find(p=>p.id===item.id),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const root=document.createElement('div');root.id='physical-interaction';root.className='physical-interaction';root.hidden=true;$('action-stage').append(root);
 const anchors=[{x:175.5,y:409},{x:152.1,y:409},{x:148.54,y:408},{x:145.3,y:408},{x:175.72,y:408},{x:154.52,y:408},{x:152.05,y:408},{x:148.67,y:408},{x:173.54,y:407},{x:154.68,y:407},{x:154.2,y:407},{x:151.54,y:407}];
 const actor={width:1254,height:1254,columns:4,rows:3,scale:.65};
 const rooms=['arquivos','tecnica','recepcao','laboratorio','farmacia','gestao'];
 let version=0,timer=null,release=null,visible=false,currentType='';
 function wait(ms){return new Promise(resolve=>{release=resolve;timer=setTimeout(()=>{timer=null;release=null;resolve();},ms);});}
 function stop(){version++;clearTimeout(timer);timer=null;if(release){release();release=null;}}
 function render(graphic,type){
  currentType=type;
  const roomIndex=Math.max(0,rooms.indexOf(item.room)),column=roomIndex%3,row=Math.floor(roomIndex/3);
  if(profile.kind==='archive')root.innerHTML='<svg class="interaction-scene archive-interaction" viewBox="0 0 600 600" role="img" aria-label="A detetive abre a gaveta dos arquivos e retira uma pasta"><svg id="archive-interaction-frame" width="600" height="600" viewBox="12 12 488 488" overflow="hidden"><image href="assets/archive-interaction-v1.png" width="1536" height="1024"/></svg></svg>';
  else{
   const hot={radio:[181,151],file:[140,162],printer:[227,94],drawer:[150,74],reader:[150,66],alarm:[150,109],key:[145,82],route:[156,73],stock:[200,75],sensor:[150,100],monitor:[150,100],table:[150,100],message:[150,100]}[type]||[150,100];
   const scale=.83,objectX=344-hot[0]*scale,objectY=165-hot[1]*scale,base=objectY+205*scale;
   graphic=graphic.replace(/fill="#324f3b"/g,'class="empty-stock-slot" fill="#324f3b"');
   const prop=graphic.replace('<svg ','<svg class="interaction-prop" x="'+objectX+'" y="'+objectY+'" width="249" height="182.6" ');
   const extra=item.id===18?'<g class="duplicate-cadastro" transform="translate(70 12)">'+prop+'</g>':item.id===20?'<g class="sensor-probe"><path d="M420 250q50 10 45 48h50" fill="none" stroke="#526e60" stroke-width="5"/><circle cx="515" cy="298" r="26" fill="#e8e6c9" stroke="#53725b" stroke-width="4"/><path class="sensor-needle" d="M515 298l-15-13" stroke="#b58a56" stroke-width="4"/></g>':'';
   root.innerHTML='<svg class="interaction-scene" viewBox="0 0 600 400" role="img" aria-label="A detetive interage com o objeto desta investigação"><defs><clipPath id="interaction-room-clip"><rect width="600" height="400"/></clipPath></defs><g clip-path="url(#interaction-room-clip)"><image href="assets/rooms-v2.png" x="'+(-column*600)+'" y="'+(-row*400)+'" width="1800" height="800" preserveAspectRatio="none" style="filter:'+(window.HospitalSceneVariant?.filter||'none')+'"/><rect width="600" height="400" fill="#e6e8d9" opacity=".58"/><rect width="600" height="400" fill="'+(window.HospitalSceneVariant?.wash||'#ffffff')+'" opacity="'+(window.HospitalSceneVariant?.alpha||0)+'"/></g><ellipse cx="240" cy="352" rx="44" ry="9" fill="#354738" opacity=".23"/><g class="interaction-workbench"><rect x="'+(objectX+10)+'" y="'+base+'" width="230" height="14" rx="3" fill="#9e8054"/><path d="M'+(objectX+25)+' '+(base+14)+'V355m200-'+(355-base-14)+'V355" fill="none" stroke="#4d6450" stroke-width="10"/></g>'+extra+prop+'<g class="interaction-signal"><path d="M420 78q27 20 0 40m14-52q44 32 0 64" fill="none" stroke="#d6ba63" stroke-width="5"/></g><g class="interaction-status"><rect x="400" y="110" width="130" height="37" rx="5" fill="#244b3a"/><text id="interaction-status-text" x="465" y="134" text-anchor="middle" fill="#eef0cc" font-family="monospace" font-size="11"></text></g><g class="interaction-results"><rect x="405" y="164" width="154" height="95" rx="5" fill="#f7f1d8" stroke="#7e9b71"/><path d="M418 191h124m-124 24h124" stroke="#a8b895" stroke-width="3"/><text x="418" y="183" font-size="10" fill="#3e6247">id · descrição</text><text x="418" y="207" font-size="10" fill="#3e6247">1 · Registro</text><text x="418" y="232" font-size="10" fill="#3e6247">2 · Crachá</text></g><svg id="interaction-actor-frame" overflow="hidden" width="203.775" height="271.7" viewBox="0 0 313.5 418"><image href="assets/detective-interactions-v1.png" width="1254" height="1254"/></svg></svg>';
  }
 }
 function show(index){
  const [pose,caption,effect]=profile.steps[index];root.setAttribute('data-step',String(index));root.setAttribute('data-effect',effect);root.setAttribute('data-case',String(item.id));root.setAttribute('data-type',currentType);
  root.setAttribute('data-activated',String(index>=profile.steps.findIndex(step=>step[2]==='operate')));$('interaction-caption').textContent=caption;
  if(profile.kind==='archive')$('archive-interaction-frame').setAttribute('viewBox',(pose%3*512+12)+' '+(Math.floor(pose/3)*512+12)+' 488 488');
  else{const tileW=actor.width/actor.columns,tileH=actor.height/actor.rows,anchor=anchors[pose],frame=$('interaction-actor-frame');frame.setAttribute('viewBox',(pose%4*tileW)+' '+(Math.floor(pose/4)*tileH)+' '+tileW+' '+tileH);frame.setAttribute('x',String(240-anchor.x*actor.scale));frame.setAttribute('y',String(350-anchor.y*actor.scale));const label={denied:'RECUSADO',review:'REVISAR',signal:'SINAL RECEBIDO',sensor:'CALIBRADO',monitor:'PAINEL RESTAURADO',decode:'JSON → DADOS',merge:'MESMO CADASTRO',time:'HORÁRIO MARCADO',key:'CHAVE REGISTRADA'}[effect]||'DADOS APLICADOS';$('interaction-status-text').textContent=label;}
 }
 window.HospitalInteraction={profiles,
  play(graphic,type){stop();const token=version;render(graphic,type);root.hidden=false;visible=true;$('action-stage').setAttribute('data-mode','interaction');
   return(async()=>{for(let index=0;index<profile.steps.length;index++){if(token!==version)return;show(index);if(!reduced.matches)await wait(index===profile.steps.length-1?700:420);}})();
  },
  finish(){stop();if(visible)show(profile.steps.length-1);},
  reset(){stop();root.hidden=true;visible=false;$('action-stage').setAttribute('data-mode','room');$('interaction-caption').textContent='';}
 };
 // Decodifica as poses da ação num momento ocioso, para a primeira troca de pose não travar.
 const idle=window.requestIdleCallback||(typeof Image==='function'?callback=>setTimeout(callback,1500):null);
 idle?.(()=>{const picture=new Image();picture.src=item?.id===1?'assets/archive-interaction-v1.png':'assets/detective-interactions-v1.png';picture.decode?.().catch(()=>{});window.HospitalInteraction.preloaded=picture;});
})();
