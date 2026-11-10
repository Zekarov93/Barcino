// ===================== ESCENAS: eventos con actores visibles sobre el mapa =====================
// Un evento es una corrutina: yield S.walk(...), S.say(...), S.ask(...), S.fight(...)…
const SCN={cur:null,seq:0};
const SC_RUN=3.4,SC_WALK=1.9;
function sceneActive(){return !!SCN.cur}
function scene(id,fn,o){if(SCN.cur||!G||!G.pc)return null;o=o||{};const sc=SCN.cur={id,zone:G.zone,actors:[],gen:null,wait:null,done:false,t:0,bub:[]};
 const S=sceneExtras2(sceneExtras(sceneAPI(sc)));sc.gen=fn(S);R.grace=Math.max(R.grace||0,6);sceneAdvance(sc,undefined);return{scene:true,id}}
function sceneRelease(a){a.busy=false;a.think=0;a.tgtKey=null;a.tgt=null;a.path=null;a.roam=0;a.ring=false;a.fast=false;a.moving=false;a.real=false;a.stop=1}
function sceneEnd(sc,why){if(!sc||sc.done)return;sc.done=true;sc.actors.forEach(a=>{if(a.real)sceneRelease(a)});try{sc.gen&&sc.gen.return&&sc.gen.return()}catch(e){}sc.actors.forEach(a=>sceneBubble(a,null));sc.bub.forEach(b=>b.el.remove());sc.bub=[];SCN.cur=null;bus.emit('sceneend',sc.id,why)}
function sceneAdvance(sc,val){if(sc.done)return;let r;try{r=sc.gen.next(val)}catch(e){console.error(e);sceneEnd(sc,'error');return}
 if(r.done){sceneEnd(sc,'done');return}sc.wait=r.value||{upd:()=>true}}
function sceneTick(dt){petTick(dt);const sc=SCN.cur;if(!sc||sc.done)return;if(G.zone!==sc.zone){sceneEnd(sc,'zone');return}
 sc.t+=dt;if(sc.t>300&&!R.modal){sceneEnd(sc,'timeout');return}for(const a of sc.actors)sceneMove(sc,a,dt);
 sceneBubbles(sc,dt);
 if(sc.wait&&!R.modal||sc.wait&&sc.wait.modal){const w=sc.wait;if(w.upd(dt,sc)){sc.wait=null;sceneAdvance(sc,w.res)}}}
function sceneAPI(sc){
 const S={sc,
  look:null,
  actor(k){return sc.actors.find(a=>a.k===k)},
  spawn(k,o){const a=Object.assign({k,name:'',x:G.px,y:G.py,dx:0,dy:1,moving:false,path:null,spd:SC_WALK,hidden:false,scale:1,ring:false,tint:null,sayT:0,tgt:null,repath:0,gone:false},o);
   if(a.cr){a.sheet=creatureSheet(a.cr,{coat:a.coat==null?.5:a.coat,size:1});a.scale=o.scale||1}else if(a.look){a.sheet=charSheet(a.look);a.scale=(SPECIES[a.look.sp]||{}).scale||1}
   sc.actors.push(a);return a},
  // punto transitable visible a distancia [d0,d1] del jugador, con camino hasta el jugador
  point(d0,d1,o){o=o||{};const z=getZone(G.zone);const base=o.ang==null?Math.random()*6.28:o.ang;for(let i=0;i<60;i++){const ang=base+(i%2?1:-1)*Math.floor(i/2)*.21;const d=d0+Math.random()*(d1-d0);const x=G.px+Math.cos(ang)*d,y=G.py+Math.sin(ang)*d;const xi=Math.floor(x),yi=Math.floor(y);
    if(!tileFree(z,xi,yi))continue;if(o.noPath)return[xi+.5,yi+.5];const p=findPath(z,xi+.5,yi+.5,G.px,G.py,1500);if(p&&p.length&&p.length<d*2.6)return[xi+.5,yi+.5]}
   const p=nearestFree(z,G.px+d0*.6,G.py);return[p[0],p[1]]},
  at(k,o,d0,d1,po){const p=S.point(d0||11,d1||14,po);return S.spawn(k,Object.assign({x:p[0],y:p[1]},o))},
  group(prefix,n,mk,d0,d1){const p=S.point(d0||11,d1||14);const out=[];for(let i=0;i<n;i++){const z=getZone(G.zone);const q=nearestFree(z,p[0]+(i%2?1:-1)*(.8+i*.3),p[1]+(i>1?.8:0));out.push(S.spawn(prefix+i,Object.assign({x:q[0],y:q[1]},mk(i))))}return out},
  remove(a){if(a){sceneBubble(a,null);if(a.real)sceneRelease(a);else a.gone=true;const i=sc.actors.indexOf(a);if(i>=0)sc.actors.splice(i,1)}},
  adopt(n){if(!n||n.hidden||!n.alive||n.busy)return null;n.busy=true;n.real=true;n.k=n.id;n.scale=(SPECIES[n.sp]||{}).scale||1;n.tgt=null;n.path=null;n.gone=false;sc.actors.push(n);return n},
  prop(k,t,x,y,o){const a=Object.assign({k,prop:t,x,y,dx:0,dy:1,moving:false,hidden:false,scale:1,gone:false,ring:false},o||{});sc.actors.push(a);return a},
  body(a){R.bodies=R.bodies||[];R.bodies.push({zone:G.zone,x:a.x,y:a.y,t:G.t,look:a.look,cr:a.cr})},
  face(a,x,y){const dx=x-a.x,dy=y-a.y,l=Math.hypot(dx,dy)||1;a.dx=dx/l;a.dy=dy/l},
  // andar hacia un punto fijo o hacia una función dinámica; termina al llegar a `stop` tiles o tras `timeout` s
  walk(as,tx,ty,o){o=o||{};const arr=Array.isArray(as)?as:[as];const stop=o.stop==null?1.2:o.stop;const to=o.timeout||30;let el=0;const tgt=typeof tx==='function'?tx:()=>({x:tx,y:ty});
   arr.forEach(a=>{a.roam=0;a.spd=o.spd||SC_WALK;a.tgt=tgt;a.stop=stop;a.repath=0;a.arrived=false});
   return{upd:dt=>{el+=dt;if(arr.every(a=>a.arrived||a.gone))return true;if(el>to){arr.forEach(a=>{a.tgt=null;a.path=null;a.moving=false});S.timedOut=true;return true}return false}}},
  toPlayer(as,o){o=o||{};const arr=Array.isArray(as)?as:[as];const n=arr.length;const ang0=Math.atan2(arr[0].y-G.py,arr[0].x-G.px);const rad=(o.rad||1.7);
   const w=S.walk(arr,()=>({x:G.px,y:G.py}),0,Object.assign({stop:rad+.3,spd:SC_RUN},o));
   arr.forEach((a,i)=>{const an=ang0+(n>1?(i-(n-1)/2)*(2.1/Math.max(1,n-1)):0);a.tgt=()=>({x:G.px+Math.cos(an)*rad,y:G.py+Math.sin(an)*rad});a.stop=.5});return w},
  // bocadillo + línea de registro; espera el tiempo de lectura
  say(a,text,sec,o){o=o||{};sceneBubble(a,text,o.icon);if(!o.nolog)log((a.name?a.name+': ':'')+'«'+text+'»','');const t=sec||Math.max(1.8,Math.min(5,text.length*.045));let el=0;return{upd:dt=>{el+=dt;if(el>=t){if(!o.keep)sceneBubble(a,null);return true}return false}}},
  emote(a,ic,sec){sceneBubble(a,ic,ic,true);let el=0;const t=sec||1.2;return{upd:dt=>{el+=dt;if(el>=t){sceneBubble(a,null);return true}return false}}},
  wait(sec){let el=0;return{upd:dt=>{el+=dt;return el>=sec}}},
  note(msg,cls){log(msg,cls||'');return S.wait(.01)},
  // diálogo con decisiones: opts=[{l,v|run,cls,chk}]; devuelve el valor elegido
  ask(text,opts,title,icon){const w={res:undefined,got:false,modal:true,node:null};
   w.node=EVN(text,opts.map(o=>O(o.l,()=>{const v=o.run?o.run():o.v;w.res=v;w.got=true;return null},{cls:o.cls,chk:o.chk?1:0})),title||'Suceso',icon||'!');w.node.sceneAsk=true;
   let shown=false;w.upd=()=>{if(w.got)return true;if(!R.modal){showEvent(w.node)}return false};return w},
  fight(actors,enemies,o){const arr=(actors||[]).filter(Boolean);arr.forEach(a=>{a.hidden=true;a.moving=false});const w={res:null,modal:true,started:false,got:false};
   const onEnd=res=>{w.res=res||'won';w.got=true;bus.off&&bus.off('endcombat',onEnd)};bus.on('endcombat',onEnd);
   w.upd=()=>{if(!w.started){w.started=true;startCombat(enemies,o||{});return false}if(w.got){if(w.res==='won')arr.forEach(a=>{if(!a.real)S.body(a);S.remove(a)});else arr.forEach(a=>{a.hidden=false});return !R.modal&&!G.combat}return false};return w},
  leave(as,o){const arr=(Array.isArray(as)?as:[as]).filter(Boolean);const z=getZone(G.zone);const far=S.point(24,30,{noPath:1,ang:Math.atan2(arr[0].y-G.py,arr[0].x-G.px)});
   arr.forEach(a=>{a.spd=(o&&o.spd)||SC_RUN*.8;a.tgt=()=>({x:far[0],y:far[1]});a.stop=1.5;a.arrived=false;a.repath=0;a.leaving=true;a.roam=0});let el=0;
   return{upd:dt=>{el+=dt;const d=arr.filter(a=>!a.gone).every(a=>a.arrived||(a.real?el>(o&&o.rt||6):Math.hypot(a.x-G.px,a.y-G.py)>22));if(d||el>26){arr.forEach(a=>S.remove(a));return true}return false}}},
  dist(a){return Math.hypot(a.x-G.px,a.y-G.py)},
  fauna(sp){return animalCombatant(newAnimal(sp,G.zone,Math.random,CREAT[sp].mat*1.5))},
  log(m,c){log(m,c||'')}
 };return S}
function sceneMove(sc,a,dt){if(a.hidden||a.gone)return;
 if(a.roam&&!a.tgt&&!(a.path&&a.path.length)){a.rt-=dt;if(a.rt<=0){a.rt=a.fast?.35+Math.random()*.5:1.5+Math.random()*3;const z=getZone(G.zone);const x=a.home.x+(Math.random()-.5)*a.roam,y=a.home.y+(Math.random()-.5)*a.roam;if(tileFree(z,Math.floor(x),Math.floor(y))){const p=findPath(z,a.x,a.y,x,y,400);if(p&&p.length)a.path=p}a.spd=a.fast?SC_RUN:SC_WALK*.55}}
 if(a.tgt){const t=a.tgt();const d=Math.hypot(t.x-a.x,t.y-a.y);if(d<=a.stop){a.arrived=true;if(!a.keep){a.tgt=null}a.path=null;a.moving=false;return}
  a.repath-=dt;if(a.repath<=0||!a.path||!a.path.length){a.repath=.7+Math.random()*.4;const z=getZone(G.zone);const p=a.fly?[{x:t.x,y:t.y}]:findPath(z,a.x,a.y,t.x,t.y,1500);a.path=p||[];if(!p||!p.length){if(d<4)a.path=[{x:t.x,y:t.y}]}}}
 if(a.path&&a.path.length){const w=a.path[0];const dx=w.x-a.x,dy=w.y-a.y,d=Math.hypot(dx,dy),st=a.spd*dt*(a.cr?1:1);if(d<=st+.02){a.x=w.x;a.y=w.y;a.path.shift()}else{a.x+=dx/d*st;a.y+=dy/d*st;a.dx=dx/d;a.dy=dy/d}a.moving=true}else a.moving=false}
// --- bocadillos (DOM sobre el mapa) ---
function sceneBubble(a,text,icon,big){const sc=SCN.cur;if(!sc)return;let b=sc.bub.find(x=>x.a===a);if(!text){if(b){b.el.remove();sc.bub.splice(sc.bub.indexOf(b),1)}return}
 if(!b){const el=document.createElement('div');el.className='sbub';$('#hud').append(el);b={a,el};sc.bub.push(b)}b.el.textContent=text;b.el.classList.toggle('big',!!big)}
function sceneBubbles(sc,dt){const z=getZone(G.zone);for(const b of sc.bub){const a=b.a;const gy=groundY(z,a.x,a.y)+FH*CSC*(a.scale||1)+.35;const q=GL.project(a.x,gy,a.y);if(!q||a.hidden){b.el.style.display='none';continue}b.el.style.display='';b.el.style.left=q.x+'px';b.el.style.top=q.y+'px'}}
function sceneDraw(list,z,shadow,sh){const T0=G.t;petDraw(list,z,shadow);
 if(R.bodies){R.bodies=R.bodies.filter(b=>b.zone===G.zone&&T0-b.t<180);for(const b of R.bodies){const o=propSpr('corpse',0);list.push({x:b.x,y:groundY(z,b.x,b.y),z:b.y,w:o.w,h:o.h,uv:o.uv})}}
 const sc=SCN.cur;if(!sc)return;
 for(const a of sc.actors){if(a.hidden||a.gone)continue;const gy=groundY(z,a.x,a.y)+(a.fly?(a.alt||1.2):(a.lift||0));
  if(a.prop){const o=propSpr(a.prop,a.pv||0,Math.floor(R.anim*3)%4);list.push({x:a.x,y:gy,z:a.y,w:o.w,h:o.h,uv:o.uv,em:a.prop==='campfire'?1:0});shadow(a.x,a.y,gy,o.w*.8);continue}
  if(a.real){if(a.ring)sh.push({x:a.x,y:gy+.06,z:a.y,w:1.3,d:1.3,uv:tuv(T.RING),c:a.ring===2?[1,.5,.4]:[1,1,.6]});continue}
  if(!a.sheet)continue;shadow(a.x,a.y,groundY(z,a.x,a.y),.9*(a.scale||1));
  if(a.cr){const fd=faceDir(a.dx,a.dy);const fr=a.moving?Math.floor(R.anim*7)%4:0;const dxs=a.dx*GL.right[0]+a.dy*GL.right[2];list.push({x:a.x,y:gy,z:a.y,w:a.sheet.fw*CRS*a.scale,h:a.sheet.fh*CRS*a.scale,uv:sheetUV(a.sheet,fr,0),flip:dxs<0,c:a.tint||undefined})}
  else charSprite(list,a.sheet,a.x,gy,a.y,a.dx,a.dy,a.moving,R.anim+(a.k.length*.37),a.scale||1,0,a.tint);
  if(a.ring)sh.push({x:a.x,y:gy+.06,z:a.y,w:1.3,d:1.3,uv:tuv(T.RING),c:a.ring===2?[1,.5,.4]:[1,1,.6]})}}
function sceneExtras2(S){
 // muestra un nodo de evento ya construido (opciones con sus funciones) y espera a que se cierre
 S.node=node=>{node.sceneAsk=true;let shown=false,t=0;return{modal:true,upd:dt=>{if(!shown){shown=true;showEvent(node);return false}if(!DLG&&!R.modal)return true;return false}}};
 S.brawl=as=>{const arr=Array.isArray(as)?as:[as];S.roamBg(arr,1.5);arr.forEach(a=>a.fast=true)};
 S.calm=as=>{(Array.isArray(as)?as:[as]).forEach(a=>{a.fast=false;S.still(a)})};
 // gritos sueltos de un grupo durante `sec` segundos
 S.shout=(as,words,sec)=>{const arr=Array.isArray(as)?as:[as];let el=0,nx=0;return{upd:dt=>{el+=dt;nx-=dt;if(nx<=0){nx=.9+Math.random()*.6;arr.forEach(a=>sceneBubble(a,null));const a=pick(arr);sceneBubble(a,pick(words));if(a.fast)sceneSfx('clash')}if(el>=sec){arr.forEach(a=>sceneBubble(a,null));return true}return false}}};
 S.pickNear=(c,f)=>{const l=c.near.filter(f||(()=>true));return l.length?pick(l):null};
 return S}
function sceneExtras(S){
 S.until=(fn,timeout)=>{let el=0;const w={res:true,upd:dt=>{el+=dt;if(fn()){w.res=true;return true}if(el>=(timeout||40)){w.res=false;return true}return false}};return w};
 S.near=(a,d)=>S.until(()=>S.dist(a)<=d,40);
 S.roamBg=(as,r)=>{(Array.isArray(as)?as:[as]).forEach(a=>{a.home={x:a.x,y:a.y};a.roam=r||4;a.rt=Math.random()*2})};
 S.still=as=>{(Array.isArray(as)?as:[as]).forEach(a=>{a.roam=0;a.tgt=null;a.path=null;a.moving=false})};
 S.roam=(as,sec,r)=>{S.roamBg(as,r);let el=0;return{upd:dt=>{el+=dt;if(el>=sec){S.still(as);return true}return false}}};
 S.follow=(a,d)=>{a.spd=SC_RUN*.7;a.stop=d||2.5;a.arrived=false;a.tgt=()=>({x:G.px,y:G.py})};
 return S}

// ---------- perro compañero ----------
function petTick(dt){if(!G||!G.pc||!G.pc.flags||!G.pc.flags.dog){R.pet=null;return}
 let p=R.pet;if(!p||p.zone!==G.zone){const z=getZone(G.zone);const q=nearestFree(z,G.px-1.2,G.py+1);p=R.pet={zone:G.zone,x:q[0],y:q[1],dx:1,dy:0,moving:false,path:null,rp:0};}
 const d=Math.hypot(G.px-p.x,G.py-p.y);if(d>30){const z=getZone(G.zone);const q=nearestFree(z,G.px-1.2,G.py+1);p.x=q[0];p.y=q[1];p.path=null;return}
 if(d>2.8){p.rp-=dt;if(p.rp<=0||!p.path||!p.path.length){p.rp=.6;const z=getZone(G.zone);const pt=findPath(z,p.x,p.y,G.px,G.py,900);p.path=pt||[]}}
 if(p.path&&p.path.length&&d>2.0){const w=p.path[0];const dx=w.x-p.x,dy=w.y-p.y,l=Math.hypot(dx,dy),st=(d>6?4.6:3.2)*dt;if(l<=st+.02){p.x=w.x;p.y=w.y;p.path.shift()}else{p.x+=dx/l*st;p.y+=dy/l*st;p.dx=dx/l;p.dy=dy/l}p.moving=true}else p.moving=false}
function petDraw(list,z,shadow){const p=R.pet;if(!p||p.zone!==G.zone)return;const sh=creatureSheet('perro',{coat:.5,size:1});const gy=groundY(z,p.x,p.y);const fr=p.moving?Math.floor(R.anim*8)%4:0;const dxs=p.dx*GL.right[0]+p.dy*GL.right[2];
 shadow(p.x,p.y,gy,.6);list.push({x:p.x,y:gy,z:p.y,w:sh.fw*CRS*.8,h:sh.fh*CRS*.8,uv:sheetUV(sh,fr,0),flip:dxs<0})}
// ---------- sonido y cámara de escena ----------
function sceneSfx(k){try{if(UI.mute||!AUD.ctx)return;const c=AUD.ctx,t=c.currentTime,out=AUD.master||c.destination;
 const tone=(f,d,type,v,t0,f2)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t+t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+t0+d);g.gain.setValueAtTime(v,t+t0);g.gain.exponentialRampToValueAtTime(.001,t+t0+d);o.connect(g);g.connect(out);o.start(t+t0);o.stop(t+t0+d+.02)};
 if(k==='pop')tone(520+Math.random()*120,.07,'triangle',.05,0);
 else if(k==='alert'){tone(660,.09,'square',.06,0);tone(880,.12,'square',.06,.1)}
 else if(k==='clash'){const n=c.createBufferSource(),b=c.createBuffer(1,c.sampleRate*.12,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);n.buffer=b;const g=c.createGain();g.gain.value=.12;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=1800;n.connect(f);f.connect(g);g.connect(out);n.start(t);tone(1400,.08,'square',.04,0,700)}
 else if(k==='lute'){[392,494,587,494].forEach((f,i)=>tone(f,.35,'triangle',.07,i*.28))}
 else if(k==='bell'){tone(1040,.9,'sine',.07,0);tone(1560,.7,'sine',.04,0)}}catch(e){}}
(function(){const _sb=sceneBubble;sceneBubble=function(a,text,icon,big){if(text&&SCN.cur){const old=SCN.cur.bub.find(x=>x.a===a);if(!old||old.el.textContent!==text)sceneSfx(text==='!'?'alert':text.indexOf('♪')>=0?'lute':text==='🔔'?'bell':'pop')}return _sb(a,text,icon,big)}})();
(function(){const _tick=sceneTick;let cf={x:0,y:0,k:0};sceneTick=function(dt){_tick(dt);const sc=SCN.cur;let tx=0,ty=0,n=0;if(sc&&!sc.done){for(const a of sc.actors){if(a.hidden||a.gone||a.prop)continue;const d=Math.hypot(a.x-G.px,a.y-G.py);if(d<26){tx+=a.x;ty+=a.y;n++}}}
  const want=n?1:0;cf.k+=(want-cf.k)*Math.min(1,dt*1.5);if(n){cf.x=tx/n;cf.y=ty/n}R.focus=cf.k>.02?{x:cf.x,y:cf.y,k:cf.k}:null}})();
