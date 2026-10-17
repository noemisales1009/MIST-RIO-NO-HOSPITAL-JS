'use strict';
(()=>{
 const $=id=>document.getElementById(id),room=$('investigation-room'),position=$('detective-position');
 if(!room||!position)return;
 const sheet=$('detective-walk-sheet'),depth=$('detective-depth'),facing=$('detective-facing'),shadow=$('detective-shadow'),walk=$('detective-walk'),idle=$('detective-idle'),marker=$('walk-target');
 const bounds=window.HospitalWalkableArea||{minX:84,maxX:678,minY:302,maxY:369};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),framesOfWalk=[];
 const config={maxSpeed:104,acceleration:340,braking:480,stride:104,characterScale:2};
 // Coordenadas dos pés. Todo o retângulo pertence ao piso livre das seis salas.
 let x=194,y=348,vx=0,vy=0,distanceWalked=0,direction=1,frame=0,lastTime=0,target=null,spriteReady=false,arrival=null;

 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const sprite={"width":1536,"height":1024,"columns":4,"rows":2,"scale":0.255319,"anchors":[{"x":226.28,"y":497},{"x":216.68,"y":498},{"x":206.47,"y":498},{"x":205.62,"y":491},{"x":217.04,"y":482},{"x":215.31,"y":478},{"x":206.65,"y":478},{"x":213.55,"y":477}]};
 function paint(){
  const speed=Math.hypot(vx,vy),moving=speed>2;
  position.setAttribute('transform',`translate(${x.toFixed(3)} ${y.toFixed(3)})`);
  const perspective=(0.92+(y-bounds.minY)/(bounds.maxY-bounds.minY)*0.1)*config.characterScale;
  depth.setAttribute('transform',`scale(${perspective.toFixed(4)})`);
  if(Math.abs(vx)>12)direction=vx<0?-1:1;
  facing.setAttribute('transform',`scale(${direction} 1)`);
  shadow.setAttribute('rx',(24*perspective).toFixed(2));shadow.setAttribute('opacity',moving?'0.8':'1');
  walk.setAttribute('opacity',moving&&spriteReady?'1':'0');idle.setAttribute('opacity',moving&&spriteReady?'0':'1');
  if(spriteReady&&moving){
   const pose=Math.floor(distanceWalked/config.stride*8)%8,tileW=sprite.width/sprite.columns,tileH=sprite.height/sprite.rows,anchor=sprite.anchors[pose];
   walk.setAttribute('transform',`scale(${sprite.scale})`);
   sheet.setAttribute('href',framesOfWalk[pose]);sheet.setAttribute('x',String(-anchor.x));sheet.setAttribute('y',String(-anchor.y));
   sheet.setAttribute('width',String(tileW));sheet.setAttribute('height',String(tileH));
  }
  marker.setAttribute('opacity',target?'0.8':'0');
  if(target)marker.setAttribute('transform',`translate(${target.x.toFixed(2)} ${target.y.toFixed(2)})`);
 }
 function schedule(){if(!frame){lastTime=performance.now();frame=requestAnimationFrame(step);}}
 function simulate(dt){
  let desiredX=0,desiredY=0,remaining=Infinity;
  if(target){const dx=target.x-x,dy=target.y-y;remaining=Math.hypot(dx,dy);if(remaining>0.35){const speed=Math.min(config.maxSpeed,remaining*5.4);desiredX=dx/remaining*speed;desiredY=dy/remaining*speed;}else{target=null;}}
  // Aceleração vetorial permite mudar o destino com uma curva curta e suave.
  const ax=desiredX-vx,ay=desiredY-vy,change=Math.hypot(ax,ay),braking=vx*desiredX+vy*desiredY<0||Math.hypot(desiredX,desiredY)<Math.hypot(vx,vy),limit=(braking?config.braking:config.acceleration)*dt;
  if(change<=limit){vx=desiredX;vy=desiredY;}else{vx+=ax/change*limit;vy+=ay/change*limit;}
  const oldX=x,oldY=y,nx=x+vx*dt,ny=y+vy*dt;
  if(target&&remaining<=Math.hypot(vx,vy)*dt&&vx*(target.x-x)+vy*(target.y-y)>0){x=target.x;y=target.y;vx=vy=0;target=null;}
  else{x=clamp(nx,bounds.minX,bounds.maxX);y=clamp(ny,bounds.minY,bounds.maxY);if(x!==nx)vx=0;if(y!==ny)vy=0;}
  distanceWalked+=Math.hypot(x-oldX,y-oldY);
  if(!target&&Math.hypot(vx,vy)<0.8)vx=vy=0;
 }
 function step(time){
  frame=0;let dt=Math.min(Math.max((time-lastTime)/1000,0),0.064);lastTime=time;
  // Subpassos mantêm a resposta semelhante em telas de 30, 60 ou 120 Hz.
  while(dt>0){const slice=Math.min(dt,1/120);simulate(slice);dt-=slice;}
  paint();if(target||Math.hypot(vx,vy)>0)frame=requestAnimationFrame(step);else if(arrival){const resolve=arrival;arrival=null;resolve();}
 }
 window.HospitalWalk=(nextX,nextY)=>{
  if(!Number.isFinite(nextX)||!Number.isFinite(nextY))return Promise.resolve();
  if(arrival)arrival();const promise=new Promise(resolve=>{arrival=resolve;});
  target={x:clamp(nextX,bounds.minX,bounds.maxX),y:clamp(nextY,bounds.minY,bounds.maxY)};
  if(reduced.matches){cancelAnimationFrame(frame);frame=0;x=target.x;y=target.y;vx=vy=0;target=null;paint();arrival();arrival=null;return promise;}
  schedule();paint();return promise;
 };
 window.HospitalResetPosition=()=>{if(arrival){arrival();arrival=null;}cancelAnimationFrame(frame);frame=0;target=null;vx=vy=0;x=194;y=348;distanceWalked=0;direction=1;paint();};
 function pause(){cancelAnimationFrame(frame);frame=0;vx=vy=0;paint();}
 window.addEventListener('pagehide',pause);window.addEventListener('blur',pause);window.addEventListener('focus',()=>{if(target)schedule();});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')pause();else if(target)schedule();});
 reduced.addEventListener?.('change',()=>{if(reduced.matches){if(target){x=target.x;y=target.y;target=null;}pause();}});
 const image=new Image();
 image.onload=()=>{
  try{
   const tileW=sprite.width/sprite.columns,tileH=sprite.height/sprite.rows;
   for(let pose=0;pose<8;pose++){
    const canvas=document.createElement('canvas');canvas.width=tileW;canvas.height=tileH;
    const context=canvas.getContext('2d');if(!context)throw new Error('Renderizador indisponível.');
    // Cada quadro vira uma imagem independente em memória. Uma pose nunca
    // pode revelar pés ou cabeças das células vizinhas do atlas.
    context.drawImage(image,pose%4*tileW,Math.floor(pose/4)*tileH,tileW,tileH,0,0,tileW,tileH);
    framesOfWalk.push(canvas.toDataURL('image/png'));
   }
   spriteReady=true;paint();
  }catch{framesOfWalk.length=0;spriteReady=false;paint();}
 };
 image.src='assets/detective-walk-v4.png';
 paint();
})();
