// ===================== PRINCIPAL: arranque, bucle, entrada =====================
let _last=0,_tacc=0,_hudT=0,_mmT=0,_evHour=-1,_started=false;
function startPlaying(){buildHUD();intRestore();R.zid=null;R.pcSheet=null;R.sheets={};invalidateMeshes();const z=getZone(G.zone);placeNPCs(G.zone);const c=GL.cam;c.tx=G.px;c.tz=G.py;c.ty=heightAt(z,G.px,G.py)+1;c.yaw=.7;c.pitch=1.0;c.dist=22;UI.speed=UI.speed||1;_evHour=dateOf(G.t).h;$('#hud').style.display='block';$('#title').style.display='none';R.running=true;R.grace=30;updateHUD();updateLogBox();if(!_started){_started=true;requestAnimationFrame(loop)}}
function loop(ts){requestAnimationFrame(loop);const dt=Math.min(.05,(ts-_last)/1000||0.016);_last=ts;if(!R.running||!G||!G.pc)return;R.anim+=dt;
 // vigilancia: bloqueos de estado que dejarían al jugador inmóvil
 if(R.modal&&!UI.stack.length&&!CV&&!(typeof SCN!=='undefined'&&SCN.cur&&SCN.cur.ask)){R._mw=(R._mw||0)+dt;if(R._mw>1.2){R.modal=false;R._mw=0}}else R._mw=0;
 if(G.combat&&!CV&&!(G.combat.over===false&&R._cvOpening)){R._cw=(R._cw||0)+dt;if(R._cw>3){G.combat=null;R._cw=0}}else R._cw=0;
 const fighting=G.combat&&!G.combat.over;const paused=R.modal||fighting;
 try{
 if(!paused){playerTick(dt);npcTick(dt);intTick(dt);faunaTick(dt);sceneTick(dt);_tacc+=dt*2*(UI.speed||1);if(_tacc>=1){const m=Math.floor(_tacc);_tacc-=m;advance(m,{step:m})}
  const h=dateOf(G.t).h;if(h!==_evHour){_evHour=h;pqTick();if(!G.zone.startsWith('int:')){if(Math.random()<.24){const n=tryEvent();if(n)showEvent(n)}}}
  if(G.pc.hp<=0&&!G.combat){G.pc.hp=1;G.pc.needs.hunger=60;G.pc.needs.thirst=45;addGold(-Math.floor(G.pc.gold*.2));log('Caes desfallecido. Alguien te socorre.','bad');teleportSafe();msgBox('Desfallecido','Pierdes el sentido por el hambre y las heridas. Despiertas en un lugar seguro, algo más pobre.')}}
 cameraTick(dt);updateEnv(dt);updateParticles(dt);drawScene();
 _hudT+=dt;if(_hudT>.2){_hudT=0;updateHUD()}_mmT+=dt;if(_mmT>.4){_mmT=0;drawMinimap()}
 }catch(e){if(!R.err){R.err=1;console.error(e);toast('Error: '+e.message,'bad')}}}
// ---------- entrada ----------
function setupInput(cv){let drag=null,tdist=0;
 window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;const k=e.key.toLowerCase();
  if(k==='escape'){if(G&&G.combat)return;if(UI.stack.length){const t=UI.stack[UI.stack.length-1];if(t===DLG)showNode(null);else if(!t._noclose)closeModal(t)}else if(R.buildSel){R.buildSel=null;showBuildBar()}else if(R.running)openPanel('menu');return}
  if(R.modal){return}
  R.keys[k]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();
  if(!R.running)return;const m={i:'inv',c:'sheet',j:'journal',m:'map',k:'fac',b:'build',n:'bestiary',p:'comp',t:'wait'}[k];if(m){openPanel(m);return}
  if(k==='f'||k===' '){const it=nearestInteract();if(it)doInteract(it)}});
 window.addEventListener('keyup',e=>{R.keys[e.key.toLowerCase()]=false});window.addEventListener('blur',()=>{R.keys={}});
 cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('mousedown',e=>{drag={x:e.clientX,y:e.clientY,b:e.button,moved:0,sx:e.clientX,sy:e.clientY}});
 window.addEventListener('mousemove',e=>{if(R.buildSel&&R.running&&e.target===cv){const r=cv.getBoundingClientRect();const h=pickAt(e.clientX-r.left,e.clientY-r.top);if(h&&h.type==='ground')R.cursor={x:Math.floor(h.target.x)+.5,y:Math.floor(h.target.y)+.5}}
  if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved+=Math.abs(dx)+Math.abs(dy);if(drag.b===2||drag.b===1){GL.cam.yaw-=dx*.008;GL.cam.pitch=clamp(GL.cam.pitch+dy*.006,.35,1.35)}drag.x=e.clientX;drag.y=e.clientY});
 window.addEventListener('mouseup',e=>{if(!drag)return;const d=drag;drag=null;if(e.target!==cv||!R.running)return;const r=cv.getBoundingClientRect();
  if(d.b===0&&d.moved<6){const px=e.clientX-r.left,py=e.clientY-r.top;if(R.buildSel){const h=pickAt(px,py);if(h&&h.type==='ground'){if(placeItem(h.target.x,h.target.y))updateHUD()}}else handleClick(px,py)}
  else if(d.b===2&&d.moved<6&&R.buildSel){R.buildSel=null;showBuildBar()}});
 cv.addEventListener('wheel',e=>{e.preventDefault();GL.cam.dist=clamp(GL.cam.dist*(1+Math.sign(e.deltaY)*.08),6,30)},{passive:false});
 // táctil
 let tstart=null;cv.addEventListener('touchstart',e=>{e.preventDefault();if(e.targetTouches.length===2){tdist=Math.hypot(e.targetTouches[0].clientX-e.targetTouches[1].clientX,e.targetTouches[0].clientY-e.targetTouches[1].clientY);tstart=null}else tstart={x:e.targetTouches[0].clientX,y:e.targetTouches[0].clientY,lx:e.targetTouches[0].clientX,ly:e.targetTouches[0].clientY,moved:0}},{passive:false});
 cv.addEventListener('touchmove',e=>{e.preventDefault();if(e.targetTouches.length===2){const d=Math.hypot(e.targetTouches[0].clientX-e.targetTouches[1].clientX,e.targetTouches[0].clientY-e.targetTouches[1].clientY);if(tdist)GL.cam.dist=clamp(GL.cam.dist*tdist/d,6,30);tdist=d}else if(tstart){const t=e.targetTouches[0];const dx=t.clientX-tstart.lx;const dy=t.clientY-tstart.ly;tstart.moved+=Math.abs(dx)+Math.abs(dy);tstart.lx=t.clientX;tstart.ly=t.clientY;if(tstart.moved>12){GL.cam.yaw-=dx*.008;GL.cam.pitch=clamp(GL.cam.pitch+dy*.005,.35,1.35)}}},{passive:false});
 cv.addEventListener('touchend',e=>{if(tstart&&tstart.moved<12&&R.running){const r=cv.getBoundingClientRect();if(R.buildSel){const h=pickAt(tstart.x-r.left,tstart.y-r.top);if(h&&h.type==='ground')placeItem(h.target.x,h.target.y)}else handleClick(tstart.x-r.left,tstart.y-r.top)}tstart=null;tdist=0});
 // joystick
 const joy=$('#joy');let jact=false,jid=null;const jt=(e)=>{for(const t of e.touches)if(t.identifier===jid)return t;return null};const jm=(t)=>{const j=$('#joy');if(!j||!t)return;const r=j.getBoundingClientRect();let x=(t.clientX-r.left-r.width/2)/(r.width/2),y=(t.clientY-r.top-r.height/2)/(r.height/2);const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}R.joy=[Math.abs(x)<.2?0:x,Math.abs(y)<.2?0:y];const k=$('#joyk');if(k)k.style.transform='translate('+x*28+'px,'+y*28+'px)'};
 const jend=()=>{jact=false;jid=null;R.joy=[0,0];const k=$('#joyk');if(k)k.style.transform=''};
 document.addEventListener('touchstart',e=>{if(!jact&&e.target.closest&&e.target.closest('#joy')){const t=e.changedTouches[0];jact=true;jid=t.identifier;jm(t)}},{passive:true});document.addEventListener('touchmove',e=>{if(jact){const t=jt(e);if(t)jm(t)}},{passive:true});document.addEventListener('touchend',e=>{if(jact&&!jt(e))jend()});document.addEventListener('touchcancel',()=>{if(jact)jend()});
 window.addEventListener('resize',()=>{if(GL.gl)GL.resize()})}
window.addEventListener('DOMContentLoaded',()=>{const cv=$('#gl');try{GL.init(cv)}catch(e){document.body.innerHTML='<div style="padding:40px;color:#eee;font:18px sans-serif">Tu navegador no admite WebGL, necesario para este juego.<br><small>'+e.message+'</small></div>';return}
 setupInput(cv);titleScreen()});
