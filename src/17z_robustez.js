// ===================== ROBUSTEZ: nunca dejar al jugador inmóvil =====================
(function(){
 const W={still:0,lx:0,ly:0,lz:'',bad:0,esc:0,escT:0,toast:0};
 const fighting=()=>G&&G.combat&&!G.combat.over;
 // región alcanzable (en baldosas) desde la posición, con tope
 function region(z,x,y,cap){const seen=new Set();const q=[[Math.floor(x),Math.floor(y)]];const key=(a,b)=>a*4096+b;seen.add(key(q[0][0],q[0][1]));
  while(q.length&&seen.size<cap){const[a,b]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=a+dx,e=b+dy;if(c<0||e<0||c>=z.cols||e>=z.rows)continue;const k=key(c,e);if(seen.has(k))continue;if(!fitsAt(z,c+.5,e+.5))continue;seen.add(k);q.push([c,e])}}
  return seen}
 function unstick(){const z=getZone(G.zone);if(!z)return;const reg=region(z,G.px,G.py,220);R.path=null;R.dest=null;R.pending=null;
  if(reg.size>=200){W.still=0;return false} // no está encerrado: sólo era un choque contra un muro
  // buscar el hueco libre más cercano que no esté en la región pequeña
  const px=Math.floor(G.px),py=Math.floor(G.py);let best=null,bd=1e9;
  for(let r=2;r<40&&!best;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const c=px+dx,e=py+dy;if(c<0||e<0||c>=z.cols||e>=z.rows)continue;if(reg.has(c*4096+e))continue;if(!fitsAt(z,c+.5,e+.5))continue;const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[c+.5,e+.5]}}
  if(best){G.px=best[0];G.py=best[1]}else teleportSafe();
  R.keys={};R.joy=[0,0];toast('Te has soltado de un atasco.','');log('Quedabas encerrado entre obstáculos: te recolocas en un lugar libre.','');return true}
 function purgeModals(){let ch=false;for(let i=UI.stack.length-1;i>=0;i--){const b=UI.stack[i];if(!b||!b.isConnected){UI.stack.splice(i,1);ch=true}}
  if(ch&&!UI.stack.length&&!CV&&!fighting()){R.modal=false}}
 function deadModal(){const t=UI.stack[UI.stack.length-1];if(!t)return W.bad=0;
  const btns=[...t.querySelectorAll('button')].filter(e=>!e.disabled);
  if(t._noclose&&!btns.length){if(++W.bad>=4){W.bad=0;t._force=1;closeModal(t);log('Se cierra un cuadro de diálogo que había quedado vacío.','')}}else W.bad=0}
 setInterval(()=>{try{
  if(!G||!G.pc||!R.running)return;purgeModals();deadModal();
  // diálogo de dado huérfano: sin continuación posible
  const db=document.getElementById('dicebox');if(db&&!db.querySelector('.d20')){db.remove()}
  // inmovilidad con intención de moverse
  const K=R.keys||{};const want=K.w||K.a||K.s||K.d||K.arrowup||K.arrowdown||K.arrowleft||K.arrowright||(R.joy&&(R.joy[0]||R.joy[1]))||(R.path&&R.path.length);
  if(R.modal||fighting()||G.zone!==W.lz){W.still=0;W.lz=G.zone;W.lx=G.px;W.ly=G.py;return}
  if(want&&Math.hypot(G.px-W.lx,G.py-W.ly)<.02){W.still+=.5;if(W.still>=2){W.still=0;unstick()}}else{W.still=0}
  W.lx=G.px;W.ly=G.py;
  // restos de escena sin modal ni espera
  const sc=SCN.cur;if(sc&&!sc.done&&sc.t>40&&!sc.wait&&!R.modal){sc.stale=(sc.stale||0)+.5;if(sc.stale>8){sceneEnd(sc,'stale');}}else if(sc)sc.stale=0;
 }catch(e){}},500);
 // Esc dos veces seguidas: sale de cualquier cuadro (también los que no se pueden cerrar)
 window.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const n=performance.now();if(n-W.escT<900)W.esc++;else W.esc=1;W.escT=n;
  if(W.esc>=2&&UI.stack.length&&!fighting()&&!document.getElementById('dicebox')){W.esc=0;try{closeAll()}catch(x){}R.modal=false}},true);
})();
