// ===================== SPRITES: personajes (capas), criaturas =====================
function mkc(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function shade(hex,f){hex=(hex||'#808080').slice(0,7);const n=parseInt(hex.slice(1),16);let r=n>>16&255,g=n>>8&255,b=n&255;
 if(f<0){r*=1+f;g*=1+f;b*=1+f}else{r+=(255-r)*f;g+=(255-g)*f;b+=(255-b)*f}
 return'#'+[r,g,b].map(v=>Math.round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('')}
function mixc(a,b,t){a=a.slice(0,7);b=b.slice(0,7);const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);const f=(s)=>Math.round(lerp(x>>s&255,y>>s&255,t));return'#'+[16,8,0].map(s=>f(s).toString(16).padStart(2,'0')).join('')}
const HR=2;const LW=24,LH=32;const FW=LW*HR,FH=LH*HR;

// Dibuja un personaje humanoide. sp: {sex,skin,hair,hairC,eyeC,facial,scar,mark,build,ears,horns,tusks,tail,snout,scales,eq:{head,body,legs,feet,cloak,main,off,neck}}
function drawCharLo(ctx,ox,oy,sp,dir,fr){
 const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(ox+x,oy+y,w,h)};
 const E=sp.eq||{};const skin=sp.skin,skD=shade(skin,-.2),skL=shade(skin,.14);
 const bw=sp.build===0?-1:sp.build===2?1:0;const fem=sp.sex==='f';
 const up=(fr&1)?1:0,side=dir===2,back=dir===1;
 const hair=sp.hairC||'#3b2616',hs=sp.hair||'short';
 const hx=8,hy=4-up,hw=8,hh=8;
 // geometría torso / brazos / piernas
 let T,AL,AR,LL,RL,lL=0,rL=0;
 if(!side){const tw=10+2*bw-(fem?2:0),tx=Math.round(12-tw/2);T={x:tx,y:13-up,w:tw,h:9};AL={x:tx-2,y:13-up,w:2,h:8};AR={x:tx+tw,y:13-up,w:2,h:8};
  LL={x:8,w:4};RL={x:12,w:4};if(fr===1)lL=2;if(fr===3)rL=2;
  if(fr===1){AL.y+=1;AR.y-=1}if(fr===3){AL.y-=1;AR.y+=1}}
 else{T={x:9,y:13-up,w:6+(bw>0?1:0),h:9};const sw=(fr===1)?1:(fr===3)?-1:0;AL={x:10+sw,y:13-up,w:3,h:8};AR={x:10-sw,y:13-up,w:3,h:8};
  if(fr===0||fr===2){LL={x:10,w:3};RL={x:12,w:3}}else if(fr===1){LL={x:8,w:3};RL={x:13,w:3};lL=1}else{LL={x:11,w:3};RL={x:10,w:3};rL=1}}
 const legTop=22-up;
 // ---- cola / capa trasera
 if(sp.tail&&!back){const tc=sp.tailC||skD;if(side){R(6,22,2,2,tc);R(5,24,2,3,tc);R(6,27,2,1,tc)}else{R(T.x+T.w+1,23-up,1,4,tc);R(T.x+T.w+2,26,1,2,tc)}}
 const cl=E.cloak;
 if(cl&&!back){const c=cl.c;if(side){R(T.x-2,T.y,3,13,c);R(T.x-2,T.y+10,3,2,shade(c,-.25))}else{R(T.x-1,T.y,T.w+2,14,c);R(T.x-1,T.y+11,T.w+2,3,shade(c,-.25))}}
 // ---- piernas
 const bodyK=E.body&&E.body.k;const longBody=bodyK==='robe'||bodyK==='dress';
 const drawLeg=(L,lift,front)=>{const top=legTop,bot=30-lift;R(L.x,top,L.w,bot-top,skin);
  if(E.legs){const k=E.legs.k,c=E.legs.c;if(k==='pants'||k==='greaves'){R(L.x,top,L.w,bot-top-(k==='greaves'?0:0),c);if(k==='greaves'){R(L.x,top+3,L.w,bot-top-3,shade(c,.1));R(L.x,top+3,L.w,1,shade(c,-.3))}else if(front)R(L.x+L.w-1,top,1,bot-top,shade(c,-.15))}
   else if(k==='shorts'){R(L.x,top,L.w,3,c)}}
  else if(!E.legs&&E.body&&!longBody){R(L.x,top,L.w,2,shade(skin,-.1))}
  // pies
  const fy=bot-2;const fe=E.feet;
  if(fe){const c=fe.c,k=fe.k;if(k==='boots'){R(L.x,fy-1,L.w,3,c);R(L.x,fy+1,L.w+(side?1:0),1,shade(c,-.4))}else if(k==='hboots'){R(L.x,fy-3,L.w,5,c);R(L.x,fy-3,L.w,1,shade(c,.2));R(L.x,fy+1,L.w+(side?1:0),1,shade(c,-.4))}else if(k==='shoes'){R(L.x,fy,L.w+(side?1:0),2,c)}else if(k==='sandals'){R(L.x,fy+1,L.w,1,c);R(L.x,fy,1,1,c)}}
  else R(L.x,fy,L.w+(side?1:0),2,skD)};
 if(side){drawLeg(LL,lL,false);drawLeg(RL,rL,true)}else{drawLeg(LL,lL,false);drawLeg(RL,rL,false)}
 // faldas / ropajes largos / falda
 if(E.legs&&E.legs.k==='skirt'){R(T.x-1,legTop-1,T.w+2,6,E.legs.c);R(T.x-1,legTop+4,T.w+2,1,shade(E.legs.c,-.25))}
 if(longBody){const c=E.body.c,c2=E.body.c2;const bot=fem||bodyK==='dress'?27:28;R(T.x-1,legTop-1,T.w+2,bot-legTop+1,c);R(T.x-1,bot,T.w+2,1,c2);if(!side)R(Math.round(11.5-0.5),legTop,1,bot-legTop,shade(c,-.18))}
 // ---- torso
 const drawTorso=()=>{R(T.x,T.y,T.w,T.h,skin);const B=E.body;if(!B){// torso desnudo con taparrabos
   R(T.x,T.y,T.w,T.h,skin);R(T.x,T.y+7,T.w,2,'#6a5a3a');return}
  const c=B.c,c2=B.c2,k=B.k;R(T.x,T.y,T.w,T.h,c);
  if(k==='tunic'||k==='noble'||k==='padded'){R(T.x,T.y+6,T.w,1,shade(c,-.3));if(!back)R(T.x+(side?T.w-2:Math.floor(T.w/2)-1),T.y,2,1,skD);
   if(k==='noble'){if(!side)R(Math.floor(T.x+T.w/2)-1,T.y+1,1,7,c2);R(T.x,T.y,T.w,1,c2);R(T.x,T.y+8,T.w,1,c2)}
   if(k==='padded'){for(let i=0;i<T.w;i+=2)R(T.x+i,T.y+1,1,7,shade(c,-.15));R(T.x,T.y+4,T.w,1,shade(c,-.15))}
   if(k==='tunic'){R(T.x,T.y+8,T.w,1,shade(c,-.18))}}
  else if(k==='robe'||k==='dress'){R(T.x,T.y,T.w,1,c2);if(k==='dress'){R(T.x,T.y+5,T.w,1,c2)}else R(T.x,T.y+5,T.w,1,shade(c,-.3));if(!side&&!back)R(Math.floor(T.x+T.w/2)-1,T.y,2,5,shade(c,-.15))}
  else if(k==='leather'||k==='hide'){R(T.x,T.y+7,T.w,2,c2);if(k==='leather'){for(let i=0;i<7;i++){const xx=T.x+Math.floor(i*(T.w-1)/6);R(xx,T.y+i,1,1,c2)}}else{R(T.x,T.y,T.w,2,c2);R(T.x,T.y+8,T.w,1,c2);for(let i=0;i<T.w;i+=2)R(T.x+i,T.y+9,1,1,c2)}}
  else if(k==='chain'||k==='plate'){
   for(let yy=0;yy<T.h;yy++)for(let xx=0;xx<T.w;xx++){if(k==='chain'){if((xx+yy)%2===0)R(T.x+xx,T.y+yy,1,1,c2)}else{if(xx===0||yy===0||xx===T.w-1)R(T.x+xx,T.y+yy,1,1,shade(c,-.25))}}
   if(k==='plate'){R(T.x+1,T.y+1,T.w-2,3,shade(c,.18));R(T.x,T.y+7,T.w,2,shade(c,-.25));if(!side&&!back)R(Math.floor(T.x+T.w/2),T.y+2,1,6,shade(c,-.25))}
   else{R(T.x,T.y+7,T.w,2,c2);R(T.x,T.y+9,T.w,1,shade(c,-.3))}}
  // cuello
  if(!back&&!side){R(11,T.y,2,1,skD)}};
 // brazos (lado lejano primero en side)
 const drawArm=(A,far)=>{R(A.x,A.y,A.w,A.h,skin);R(A.x,A.y+A.h-2,A.w,2,skL);const B=E.body;if(B){const c=B.c,k=B.k;let sl=4;if(k==='robe'||k==='dress'&&false)sl=7;if(k==='chain'||k==='plate')sl=8;if(k==='leather')sl=5;if(k==='robe')sl=8;if(k==='hide')sl=4;
   R(A.x,A.y,A.w,sl,c);if(k==='plate'){R(A.x-(side?0:1),A.y-1,A.w+(side?0:2),3,shade(c,.2));R(A.x,A.y+3,A.w,1,shade(c,-.3))}if(k==='leather'){R(A.x,A.y+5,A.w,2,B.c2)}if(k==='chain')R(A.x,A.y+7,A.w,1,shade(c,-.3));
   if(far)R(A.x,A.y,A.w,sl,shade(c,-.18))}
  if(far&&!B)R(A.x,A.y,A.w,A.h,skD)};
 // ---- orden de dibujo
 if(side){drawArm(AR,true);drawTorso();}
 else drawTorso();
 // capa trasera encima en back
 if(cl&&back){const c=cl.c;R(T.x-1,T.y,T.w+2,14,c);R(T.x-1,T.y+11,T.w+2,3,shade(c,-.25));for(let i=0;i<T.w;i+=3)R(T.x+i,T.y+1,1,12,shade(c,-.12))}
 // ---- arma / escudo (fuera de la mano)
 const main=E.main,off=E.off;
 const weapon=(hxp,hyp,flip)=>{if(!main)return;const k=main.k,c=main.c||'#c9ced6',w='#6a4a2a';const X=hxp;const V=(x,y,wd,h,col)=>R(x,y,wd,h,col);
  if(k==='sword'||k==='rapier'||k==='dagger'){const len=k==='dagger'?4:k==='rapier'?11:9;V(X,hyp-len-1,1,len,c);V(X,hyp-len-1,1,1,shade(c,.3));V(X-1,hyp-1,3,1,k==='rapier'?'#c8a84a':'#8a7a4a');V(X,hyp,1,2,w);if(k==='rapier')V(X-1,hyp-2,3,1,'#c8a84a')}
  else if(k==='axe'){V(X,hyp-9,1,11,w);V(X-(flip?0:2),hyp-10,3,4,c);V(X+(flip?1:-3),hyp-9,1,2,shade(c,.25))}
  else if(k==='gaxe'){V(X,hyp-12,1,15,w);V(X-2,hyp-12,5,4,c);V(X-2,hyp-12,5,1,shade(c,.3));V(X,hyp-8,1,1,shade(c,-.3))}
  else if(k==='mace'){V(X,hyp-8,1,10,w);V(X-1,hyp-11,3,3,c);V(X-1,hyp-11,3,1,shade(c,.25))}
  else if(k==='hammer'){V(X,hyp-9,1,11,w);V(X-2,hyp-11,5,3,c);V(X-2,hyp-11,5,1,shade(c,.25))}
  else if(k==='spear'){V(X,hyp-15,1,18,w);V(X,hyp-18,1,3,c);V(X-1,hyp-16,3,1,c)}
  else if(k==='staff'){V(X,hyp-16,1,19,main.c||w);V(X-1,hyp-18,3,2,'#7ad0ff');V(X,hyp-19,1,1,'#d8f4ff')}
  else if(k==='club'){V(X,hyp-8,2,9,main.c||w);V(X-1,hyp-8,3,3,main.c||w)}
  else if(k==='bow'){const bc=main.c||w;V(X+1,hyp-11,1,1,bc);V(X,hyp-10,1,2,bc);V(X-1,hyp-8,1,6,bc);V(X,hyp-2,1,2,bc);V(X+1,hyp-1,1,1,bc);V(X+1,hyp-10,1,10,'#e8e0c8')}
  else if(k==='crossbow'){V(X-3,hyp-3,7,1,main.c||w);V(X-3,hyp-4,1,3,main.c||w);V(X+3,hyp-4,1,3,main.c||w);V(X-1,hyp-3,2,3,w)}
  else if(k==='wand'){V(X,hyp-4,1,5,w);V(X,hyp-6,1,2,main.c||'#a08be0')}};
 const offhand=(xp,yp)=>{if(!off)return;const k=off.k,c=off.c,c2=off.c2||'#b8b8c0';
  if(k==='shield'){const wd=side?3:6;const sx=xp-(side?1:2);R(sx,yp,wd,8,shade(c,-.3));R(sx+1,yp+1,wd-2,6,c);if(!side)R(sx+2,yp+3,2,2,c2);else R(sx+1,yp+3,1,2,c2)}
  else if(k==='tome'){R(xp-1,yp+1,4,5,c);R(xp-1,yp+1,4,1,c2);R(xp,yp+2,2,3,shade(c,.25))}
  else if(k==='torch'){R(xp,yp-3,1,6,c);const f=(fr%2===0);R(xp-1,yp-6,3,3,c2);R(xp,yp-7-(f?1:0),1,2,'#ffe27a');R(xp,yp-5,1,1,'#fff6c0')}
  else if(k==='lute'){R(xp-2,yp-1,5,5,c);R(xp-1,yp,3,3,c2);R(xp+1,yp-6,1,6,c)}
  else if(k==='orb'){R(xp-1,yp-4,4,4,c);R(xp,yp-3,1,1,c2)}};
 if(!side){
  if(!back){weapon(AL.x+0,AL.y+7,false);}
  drawArm(AL,false);drawArm(AR,false);
  if(!back){weapon(AL.x,AL.y+7,false);offhand(AR.x,AR.y+1)}else{weapon(AR.x+1,AR.y+7,true);offhand(AL.x,AL.y+1)}
 }else{
  drawArm(AL,false);weapon(AL.x+AL.w,AL.y+7,true);offhand(AR.x-1,AR.y+1);
 }
 // cuello / amuleto
 if(E.neck&&!back){const n=E.neck;if(n.k==='amulet'){R(side?T.x+T.w-2:11,T.y+1,2,2,n.c);R(side?T.x+T.w-2:11,T.y+1,1,1,'#fff6c0')}else if(n.k==='scarf'){R(T.x,T.y-1,T.w,2,n.c);R(side?T.x+T.w-2:T.x+2,T.y+1,2,3,shade(n.c,-.2))}}
 // ---- cabeza
 const head=()=>{
  R(hx,hy,hw,hh,skin);
  if(!side){R(hx,hy+hh-1,hw,1,skD);R(hx+hw-1,hy+1,1,hh-2,skD)}
  else{R(hx,hy+hh-1,hw,1,skD)}
  if(sp.snout&&!back){if(side){R(hx+hw,hy+4,3,3,skin);R(hx+hw,hy+6,3,1,skD);R(hx+hw+2,hy+4,1,1,'#1a1a1a')}else{R(hx+1,hy+5,6,3,skD);R(hx+2,hy+6,1,1,'#1a1a1a');R(hx+5,hy+6,1,1,'#1a1a1a')}}
  // orejas
  if(sp.ears==='pointed'||sp.ears==='long'){const L=sp.ears==='long'?4:2;if(side){R(hx+1,hy+2-L+2,2,L,skin);R(hx+1,hy+2-L+2,1,1,skD)}else{R(hx-2,hy+2,2,2,skin);R(hx-1-(L>2?1:0),hy+1-(L>2?2:0),1,2+(L>2?2:0),skin);R(hx+hw,hy+2,2,2,skin);R(hx+hw+(L>2?1:0),hy+1-(L>2?2:0),1,2+(L>2?2:0),skin)}}
  else if(!side&&sp.sp!=='dragonborn'){R(hx-1,hy+3,1,2,skin);R(hx+hw,hy+3,1,2,skin)}
  // cara
  if(!back){
   const ex=side?hx+5:hx+2;const ex2=side?hx+5:hx+5;
   if(sp.sp==='dragonborn'){if(!side){R(hx+2,hy+3,1,1,sp.eyeC||'#d8b83a');R(hx+5,hy+3,1,1,sp.eyeC||'#d8b83a')}else R(hx+5,hy+3,1,1,sp.eyeC||'#d8b83a')}
   else if(!side){R(hx+2,hy+4,1,1,'#fff');R(hx+5,hy+4,1,1,'#fff');R(hx+2,hy+4,1,1,sp.eyeC||'#3b2a1a');R(hx+5,hy+4,1,1,sp.eyeC||'#3b2a1a');R(hx+1,hy+3,2,1,shade(hair,-.1));R(hx+5,hy+3,2,1,shade(hair,-.1));
    if(!sp.snout)R(hx+3,hy+6,2,1,fem?'#b86a6a':skD)}
   else{R(hx+5,hy+4,1,1,sp.eyeC||'#3b2a1a');R(hx+5,hy+3,2,1,shade(hair,-.1));R(hx+hw,hy+5,1,1,skin);if(!sp.snout)R(hx+5,hy+6,2,1,fem?'#b86a6a':skD)}
   if(sp.tusks){if(side)R(hx+6,hy+hh-1,1,2,'#f0ead8');else{R(hx+1,hy+hh-2,1,2,'#f0ead8');R(hx+6,hy+hh-2,1,2,'#f0ead8')}}
   // cicatrices y marcas
   const sc=sp.scar,mk=sp.mark;
   if(sc==='eye'){if(side)R(hx+5,hy+2,1,4,'#a03a3a');else{R(hx+2,hy+2,1,4,'#a03a3a')}}
   if(sc==='cheek'){if(side)R(hx+4,hy+5,2,1,'#a03a3a');else R(hx+5,hy+5,2,1,'#a03a3a')}
   if(sc==='brow'){if(side)R(hx+5,hy+2,1,2,'#a03a3a');else R(hx+5,hy+2,1,2,'#a03a3a')}
   if(mk==='freckles'){const fc=shade(skin,-.22);if(side){R(hx+4,hy+5,1,1,fc);R(hx+6,hy+5,1,1,fc)}else{R(hx+1,hy+5,1,1,fc);R(hx+3,hy+5,1,1,fc);R(hx+4,hy+5,1,1,fc);R(hx+6,hy+5,1,1,fc)}}
   if(mk==='tribal'){const mc=shade(skin,-.5);if(side)R(hx+4,hy+4,1,3,mc);else{R(hx+1,hy+4,1,3,mc);R(hx+6,hy+4,1,3,mc)}}
   if(mk==='runes'){const mc='#7ad8ff';R(hx+3,hy+1,2,1,mc);if(!side)R(hx+3,hy+2,1,1,mc)}
   if(mk==='paint'){R(hx,hy+3,hw,2,'#a02020');R(hx,hy+4,hw,1,'#e8e0d0')}
   if(sp.goliath){const mk2=shade(skin,.2);R(hx+1,hy+1,1,2,mk2);R(hx+6,hy+2,1,1,mk2);R(AL.x,AL.y+2,2,1,mk2);R(AR.x,AR.y+3,2,1,mk2);R(T.x+1,T.y+2,2,1,mk2)}
   // vello facial
   const fa=sp.facial;if(fa&&fa!=='none'){const fc=hair;
    if(side){if(fa==='stubble')R(hx+4,hy+5,3,3,mixc(skin,fc,.35));else if(fa==='short'||fa==='goatee'){R(hx+3,hy+5,4,4,fc)}else if(fa==='long'){R(hx+3,hy+5,4,7,fc)}else if(fa==='moustache')R(hx+5,hy+5,3,1,fc)}
    else{if(fa==='stubble'){R(hx+1,hy+5,6,3,mixc(skin,fc,.3))}else if(fa==='short'){R(hx,hy+5,hw,3,fc);R(hx+3,hy+6,2,1,skD)}else if(fa==='long'){R(hx,hy+5,hw,3,fc);R(hx+1,hy+8,hw-2,4,fc);R(hx+2,hy+12,hw-4,2,fc);R(hx+3,hy+6,2,1,skD)}else if(fa==='moustache'){R(hx+1,hy+5,6,1,fc)}else if(fa==='goatee'){R(hx+2,hy+6,4,1,fc);R(hx+3,hy+7,2,2,fc)}}}
  }
  // pelo
  const hc=hair;if(hs!=='bald'&&!sp.snout&&!(E.head&&(E.head.k==='helm'||E.head.k==='greathelm'))){
   const top=()=>{R(hx,hy-1,hw,3,hc);R(hx+1,hy-2,hw-2,1,hc);R(hx+1,hy-1,2,1,shade(hc,.2))};
   if(back){
    if(hs==='mohawk'){R(hx+3,hy-3,2,hh+1,hc)}else{R(hx,hy-1,hw,hh+1,hc);R(hx+1,hy-2,hw-2,1,hc);
     if(hs==='long'||hs==='braids'){R(hx-1,hy+hh,hw+2,3,hc);R(hx,hy+hh+3,hw,2,hc)}
     if(hs==='pony'){R(hx+3,hy+hh,2,5,hc);R(hx+3,hy+hh+5,2,1,shade(hc,-.2))}
     if(hs==='bun'){R(hx+2,hy-4,4,3,hc);R(hx+2,hy-4,4,1,shade(hc,.2))}
     if(hs==='curly'){R(hx-1,hy-2,hw+2,hh,hc)}
     if(hs==='bob'){R(hx-1,hy+hh-1,hw+2,3,hc)}
     if(hs==='braids'){for(let i=0;i<5;i++){R(hx-1+(i%2),hy+hh+i,1,1,shade(hc,-.2))}}}
   }else if(side){
    if(hs==='mohawk'){R(hx+2,hy-3,4,3,hc)}else{R(hx,hy-1,hw-1,3,hc);R(hx+1,hy-2,hw-3,1,hc);R(hx,hy+2,3,hh-4,hc);R(hx+5,hy+2,2,1,hc);
     if(hs==='long'||hs==='braids'){R(hx-1,hy+hh-3,4,6,hc);R(hx-1,hy+hh+3,3,3,hc)}
     if(hs==='pony'){R(hx-2,hy,2,2,hc);R(hx-3,hy+2,2,7,hc)}
     if(hs==='bun'){R(hx+1,hy-4,4,3,hc)}
     if(hs==='curly'){R(hx-1,hy-3,hw+1,6,hc);R(hx-1,hy+2,3,4,hc)}
     if(hs==='bob'){R(hx-1,hy+hh-3,4,5,hc)}}
   }else{
    if(hs==='mohawk'){R(hx+3,hy-3,2,3,hc);R(hx+3,hy,2,2,hc)}
    else{top();R(hx,hy+2,1,3,hc);R(hx+hw-1,hy+2,1,3,hc);R(hx+1,hy+2,3,1,hc);R(hx+5,hy+2,2,1,hc);
     if(hs==='long'){R(hx-1,hy+1,2,hh+4,hc);R(hx+hw-1,hy+1,2,hh+4,hc)}
     if(hs==='braids'){for(let i=0;i<8;i++){R(hx-1,hy+1+i,2,1,i%2?hc:shade(hc,-.25));R(hx+hw-1,hy+1+i,2,1,i%2?hc:shade(hc,-.25))}}
     if(hs==='pony'){R(hx+hw,hy+1,1,2,hc)}
     if(hs==='bun'){R(hx+2,hy-4,4,3,hc);R(hx+2,hy-4,4,1,shade(hc,.2))}
     if(hs==='curly'){R(hx-1,hy-2,hw+2,5,hc);R(hx-1,hy+3,1,2,hc);R(hx+hw,hy+3,1,2,hc);R(hx+1,hy-3,hw-2,1,hc)}
     if(hs==='bob'){R(hx-1,hy+1,2,hh-1,hc);R(hx+hw-1,hy+1,2,hh-1,hc)}}}
  }
  // escamas / cresta dracónida
  if(sp.scales){const sc=shade(skin,.2);if(side){R(hx+1,hy-1,5,1,skD);R(hx,hy,2,3,skD)}else{R(hx+1,hy-1,hw-2,1,skD);R(hx,hy,1,3,skD);R(hx+hw-1,hy,1,3,skD)}if(!back)R(hx+3,hy+1,2,1,sc)}
  // cuernos
  if(sp.horns&&sp.horns!=='none'){const c=sp.hornC||'#2a2420',hh2=shade(c,.3);
   if(sp.horns==='curved'){if(side){R(hx+1,hy-3,1,3,c);R(hx,hy-4,1,1,c)}else{R(hx,hy-3,1,3,c);R(hx-1,hy-4,1,1,c);R(hx+hw-1,hy-3,1,3,c);R(hx+hw,hy-4,1,1,c)}}
   else if(sp.horns==='ram'){if(side){R(hx,hy-1,2,2,c);R(hx-1,hy+1,1,2,c)}else{R(hx-2,hy,2,2,c);R(hx-2,hy+2,1,2,c);R(hx+hw,hy,2,2,c);R(hx+hw+1,hy+2,1,2,c)}}
   else{if(side)R(hx+1,hy-4,1,4,c);else{R(hx+1,hy-4,1,4,c);R(hx+hw-2,hy-4,1,4,c)}}}
  // tocado
  const H=E.head;if(H){const c=H.c,k=H.k;
   if(k==='hood'){R(hx-1,hy-2,hw+2,5,c);R(hx-1,hy+3,2,hh-2,c);R(hx+hw-1,hy+3,2,hh-2,c);if(side){R(hx-1,hy+1,3,hh+1,c)}if(back)R(hx-1,hy-2,hw+2,hh+4,c);R(hx-1,hy-2,hw+2,1,shade(c,.2))}
   else if(k==='cap'){R(hx-1,hy-2,hw+2,3,c);R(hx,hy-3,hw,1,c);R(hx-1,hy+1,hw+2,1,shade(c,-.25));R(hx+3,hy-4,2,1,shade(c,.2))}
   else if(k==='hat'||k==='hatp'){R(hx-3,hy,hw+6,1,shade(c,-.15));R(hx-2,hy-1,hw+4,1,c);R(hx,hy-4,hw,3,c);R(hx,hy-2,hw,1,shade(c,-.3));if(k==='hatp'){R(hx+hw-1,hy-6,1,3,'#e8e0d0');R(hx+hw,hy-7,1,2,'#e8e0d0')}}
   else if(k==='wiz'){R(hx-3,hy,hw+6,1,shade(c,-.15));R(hx-2,hy-1,hw+4,1,c);R(hx,hy-3,hw,2,c);R(hx+1,hy-5,hw-2,2,c);R(hx+2,hy-7,hw-4,2,c);R(hx+3,hy-9,2,2,c);R(hx,hy-1,hw,1,'#c8a84a')}
   else if(k==='helm'||k==='greathelm'){R(hx-1,hy-2,hw+2,5,c);R(hx-1,hy-2,hw+2,1,shade(c,.25));R(hx-1,hy+3,2,hh-3,c);R(hx+hw-1,hy+3,2,hh-3,c);if(back)R(hx-1,hy-2,hw+2,hh+3,c);
    if(k==='greathelm'&&!back){R(hx-1,hy+3,hw+2,hh-2,c);R(hx+1,hy+5,hw-2,1,'#14141a');R(hx+hw/2-1,hy+6,2,3,shade(c,-.25))}
    else if(!back&&!side)R(hx+3,hy+3,2,3,shade(c,-.2))}
   else if(k==='circlet'){R(hx,hy+1,hw,1,c);R(hx+3,hy,2,2,'#7ad8ff')}
   else if(k==='crown'){R(hx,hy-1,hw,2,c);R(hx,hy-3,1,2,c);R(hx+3,hy-3,2,2,c);R(hx+hw-1,hy-3,1,2,c);R(hx+3,hy-1,2,1,'#e04a4a')}}
 };
 head();
 if(side){drawArm(AL,false);}
 // vuelve a dibujar arma en lado frontal para side
 if(side){weapon(AL.x+AL.w,AL.y+7,true)}
}


// ---------- ampliación 2× con suavizado de esquinas, bisel de luz y contorno de color ----------
// Entrada: canvas bajo (w×h) ya dibujado. Devuelve canvas (w*2 × h*2).
function hires2x(src){
 const w=src.width,h=src.height,W=w*2,H=h*2;const si=src.getContext('2d').getImageData(0,0,w,h).data;
 const eq=(a,b)=>{const i=a*4,j=b*4;if(si[i+3]<128&&si[j+3]<128)return true;return si[i]===si[j]&&si[i+1]===si[j+1]&&si[i+2]===si[j+2]&&si[i+3]===si[j+3]};
 const out=new Uint8ClampedArray(W*H*4);const put=(x,y,k)=>{const o=(y*W+x)*4,i=k*4;out[o]=si[i];out[o+1]=si[i+1];out[o+2]=si[i+2];out[o+3]=si[i+3]>128?255:0};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const P=y*w+x;const A=y>0?P-w:P,D=y<h-1?P+w:P,C=x>0?P-1:P,B=x<w-1?P+1:P;
  let p1=P,p2=P,p3=P,p4=P;
  if(eq(C,A)&&!eq(C,D)&&!eq(A,B))p1=A;if(eq(A,B)&&!eq(A,C)&&!eq(B,D))p2=B;if(eq(D,C)&&!eq(D,B)&&!eq(C,A))p3=C;if(eq(B,D)&&!eq(B,A)&&!eq(D,C))p4=D;
  // no rellenar píxeles transparentes con color (mantiene la silueta limpia)
  if(si[P*4+3]<128){p1=p2=p3=p4=P}
  put(x*2,y*2,p1);put(x*2+1,y*2,p2);put(x*2,y*2+1,p3);put(x*2+1,y*2+1,p4)}
 // bisel: luz arriba-izquierda, sombra abajo-derecha, con tinte cálido/frío
 const cp=new Uint8ClampedArray(out);const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&cp[(y*W+x)*4+3]>0;
 const same=(o,x,y)=>{const j=(y*W+x)*4;return Math.abs(cp[o]-cp[j])+Math.abs(cp[o+1]-cp[j+1])+Math.abs(cp[o+2]-cp[j+2])<18};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=(y*W+x)*4;if(!cp[o+3])continue;const lum=cp[o]*.3+cp[o+1]*.59+cp[o+2]*.11;if(lum<34)continue;
  let k=0;
  const up=op(x,y-1)?(same(o,x,y-1)?0:1):2,dn=op(x,y+1)?(same(o,x,y+1)?0:1):2,lf=op(x-1,y)?(same(o,x-1,y)?0:1):2,rt=op(x+1,y)?(same(o,x+1,y)?0:1):2;
  if(up&&(up===2||lum>60))k+=.16;if(lf===2)k+=.08;if(dn)k-=dn===2?.2:.14;if(rt)k-=rt===2?.14:.07;
  if(!k)continue;
  if(k>0){out[o]=Math.min(255,cp[o]+(255-cp[o])*k*1.1);out[o+1]=Math.min(255,cp[o+1]+(255-cp[o+1])*k);out[o+2]=Math.min(255,cp[o+2]+(255-cp[o+2])*k*.8)}
  else{const m=1+k;out[o]=cp[o]*m*.98;out[o+1]=cp[o+1]*m*.96;out[o+2]=cp[o+2]*m*1.04+(-k)*10}}
 // contorno de color: el tono del vecino oscurecido
 const fin=new Uint8ClampedArray(out);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=(y*W+x)*4;if(out[o+3])continue;let j=-1;
  for(const[dx,dy]of[[0,1],[-1,0],[1,0],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H&&out[(yy*W+xx)*4+3]){j=(yy*W+xx)*4;break}}
  if(j<0)continue;fin[o]=out[j]*.28+14;fin[o+1]=out[j+1]*.26+10;fin[o+2]=out[j+2]*.3+14;fin[o+3]=255}
 const c=mkc(W,H);c.getContext('2d').putImageData(new ImageData(fin,W,H),0,0);return c}
// detalle de cara a resolución completa (ojos con iris y brillo, cejas, nariz, boca, rubor)
function faceDetail(c,sp,dir,fr){
 const E=sp.eq||{};if(dir===1||sp.snout||sp.sp==='dragonborn'||(E.head&&E.head.k==='greathelm'))return;
 const x=c.getContext('2d');const P=(px,py,w,h,col)=>{x.fillStyle=col;x.fillRect(px,py,w,h)};
 const up=(fr&1)?1:0,HX=16,HY=2*(4-up);const skin=sp.skin,skD=shade(skin,-.22),skDD=shade(skin,-.42),fem=sp.sex==='f';
 const ey=sp.eyeC||'#3b2a1a',hair=sp.hairC||'#3b2616',brow=shade(mixc(hair,'#2a1a10',.4),-.1),W='#f4f0ea',iris=shade(ey,.1),pup=shade(ey,-.55),hl='#ffffff';
 const eye=(ex,ey0,flip)=>{P(ex,ey0-1,3,1,skDD);P(ex,ey0,3,2,W);const ix=flip?ex:ex+1;P(ix,ey0,2,2,iris);P(ix+(flip?0:1),ey0,1,2,pup);P(ix+(flip?1:0),ey0,1,1,hl);P(ex,ey0+2,3,1,skD)};
 if(dir===0){
  eye(HX+3,HY+8,false);eye(HX+10,HY+8,true);
  P(HX+3,HY+5,4,1,brow);P(HX+9,HY+5,4,1,brow);if(sp.scar!=='brow'){P(HX+3,HY+6,1,1,shade(brow,.1));P(HX+12,HY+6,1,1,shade(brow,.1))}
  P(HX+7,HY+10,2,2,skD);P(HX+7,HY+12,2,1,shade(skin,.1));
  const lip=fem?'#b8505a':shade(skin,-.35);P(HX+6,HY+13,4,1,lip);if(fem)P(HX+6,HY+13,4,1,'#c05a64');P(HX+7,HY+14,2,1,shade(skin,-.12));
  if(fem||sp.build===0){const bl=mixc(skin,'#e0707a',.3);P(HX+2,HY+11,2,1,bl);P(HX+12,HY+11,2,1,bl)}
 }else if(dir===2){
  P(HX+9,HY+7,3,1,skDD);P(HX+9,HY+8,3,2,W);P(HX+10,HY+8,2,2,iris);P(HX+11,HY+8,1,2,pup);P(HX+10,HY+8,1,1,hl);
  P(HX+8,HY+5,4,1,brow);P(HX+14,HY+10,2,2,skD);P(HX+13,HY+13,3,1,fem?'#b8505a':skD);
  if(fem)P(HX+8,HY+11,2,1,mixc(skin,'#e0707a',.3))}}
// cabeza chibi: se amplía ~25% la cabeza ya dibujada, anclada al cuello
const HEAD_K=1.26;
function bigHead(h,fr){const w=h.width,hh=h.height;const hx0=Math.round(w*.20),hx1=Math.round(w*.80);const y0=Math.round(hh*.035),y1=Math.round(hh*.40);// zona de cabeza (sin torso)
 const cw=hx1-hx0,ch=y1-y0;const tmp=mkc(cw,ch);const tx=tmp.getContext('2d');tx.drawImage(h,hx0,y0,cw,ch,0,0,cw,ch);
 const g=h.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(hx0,y0,cw,ch);
 const nw=Math.round(cw*HEAD_K),nh=Math.round(ch*HEAD_K);const nx=Math.round(w/2-nw/2),ny=y1-nh+Math.round(hh*.012)+((fr&1)?0:0);g.drawImage(tmp,0,0,cw,ch,nx,ny,nw,nh)}
function drawChar(ctx,ox,oy,sp,dir,fr){const t=mkc(LW,LH);drawCharLo(t.getContext('2d'),0,0,sp,dir,fr);const h=hires2x(t);faceDetail(h,sp,dir,fr);bigHead(h,fr);ctx.drawImage(h,ox,oy)}

// quita costuras y añade contorno oscuro a una celda del atlas
function outlineCell(ctx,x0,y0,w,h,col){const id=ctx.getImageData(x0,y0,w,h),d=id.data;const solid=new Uint8Array(w*h);for(let i=0;i<w*h;i++)solid[i]=d[i*4+3]>128?1:0;
 const out=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(solid[y*w+x])continue;let n=false;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<w&&yy<h&&solid[yy*w+xx])n=true}if(n)out.push(y*w+x)}
 for(const p of out){d[p*4]=col[0];d[p*4+1]=col[1];d[p*4+2]=col[2];d[p*4+3]=255}ctx.putImageData(id,x0,y0)}

function charKey(sp){const e=sp.eq||{};return JSON.stringify([sp.sex,sp.sp,sp.skin,sp.hair,sp.hairC,sp.eyeC,sp.facial,sp.scar,sp.mark,sp.build,sp.ears,sp.horns,sp.hornC,sp.tusks,sp.tail,sp.snout,sp.scales,sp.goliath,e.head,e.body,e.legs,e.feet,e.cloak,e.main,e.off,e.neck])}
const SHEETS={};
// devuelve {rect,fw,fh,key}
function charSheet(sp){const k=charKey(sp);if(SHEETS[k])return SHEETS[k];
 const c=mkc(FW*4,FH*3),ctx=c.getContext('2d');
 for(let d=0;d<3;d++)for(let f=0;f<4;f++){drawChar(ctx,f*FW,d*FH,sp,d,f)}
 const rect=GL.allocSprite(c);SHEETS[k]={rect,fw:FW,fh:FH,cols:4,key:k,canvas:c};return SHEETS[k]}
function sheetUV(sh,col,row){const A=GL.ATL;const x=sh.rect.x+col*sh.fw,y=sh.rect.y+row*sh.fh;return[(x+.02)/A,(y+.02)/A,(x+sh.fw-.02)/A,(y+sh.fh-.02)/A]}

// ---------- criaturas (vista lateral derecha) ----------
const CR_DEF={
conejo:{cw:20,ch:14,coat:['#a08060','#7a6a58'],bel:'#e0d4c0'},ciervo:{cw:30,ch:28,coat:['#a8703a','#8a5a30'],bel:'#e8d8b8'},jabali:{cw:28,ch:18,coat:['#5a4636','#3a2e26'],bel:'#8a7a66'},
perro:{cw:26,ch:16,coat:['#a8763a','#7a5226'],bel:'#e8d8b8'},lobo:{cw:28,ch:20,coat:['#7a7a80','#5a5a62'],bel:'#b8b8c0'},zorro:{cw:26,ch:16,coat:['#c8662a','#a8501e'],bel:'#f0e8d8'},cabra:{cw:26,ch:24,coat:['#8a7a62','#6a5a46'],bel:'#c8bca4'},
gato:{cw:20,ch:16,coat:['#6a6a6a','#c8802a'],bel:'#e8e0d0'},oveja:{cw:24,ch:18,coat:['#e8e4d8','#cfc8b8'],bel:'#c8c0b0'},cabra_d:{cw:22,ch:20,coat:['#e0d8c8','#a89a84'],bel:'#f4f0e8'},
cuervo:{cw:18,ch:14,coat:['#2a2a34','#1a1a24'],bel:'#3a3a46'},gaviota:{cw:20,ch:14,coat:['#e8e8ee','#c8ccd4'],bel:'#fff'},rata:{cw:22,ch:12,coat:['#6a6258','#4a443c'],bel:'#8a8478'},
murcielago:{cw:26,ch:18,coat:['#4a3a5a','#2a2036'],bel:'#6a5a7a'},vibora:{cw:30,ch:16,coat:['#6a8a3a','#8a7a2a'],bel:'#c8c070'},gallina:{cw:16,ch:14,coat:['#e8e0d0','#a8702a'],bel:'#fff'},
vibria:{cw:56,ch:44,coat:['#3f8a4a','#c8a82a'],bel:'#e0d080'},
trasgo:{cw:18,ch:24,coat:['#6a8a3a','#4a7a4a'],bel:'#a8b868'},ogro:{cw:36,ch:42,coat:['#8a7a5a','#7a6a50'],bel:'#b8a888'}
};
function drawCreature(ctx,ox,oy,sp,gn,fr){
 const df=CR_DEF[sp];const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(ox+Math.round(x),oy+Math.round(y),w,h)};
 const t=gn?gn.coat:.5;const body=mixc(df.coat[0],df.coat[1],t),dk=shade(body,-.25),lt=shade(body,.18),bel=df.bel;const step=(fr&1);const w=df.cw,h=df.ch;
 const ell=(cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){if((x*x)/(rx*rx+.3)+(y*y)/(ry*ry+.3)<=1.05)R(cx+x,cy+y,1,1,c)}};
 const legs=(xs,len,y0,c)=>{xs.forEach((x,i)=>{const lift=((i+(fr===1?0:fr===3?1:0))%2===0&&step)?1:0;R(x,y0,2,len-lift,i<2?dk:c)})};
 const eye=(x,y)=>R(x,y,1,1,'#14100c');
 if(sp==='conejo'){ell(9,9,5,3,body);R(5,8,4,3,lt);ell(14,7,3,3,body);R(13,1,1,5,body);R(15,0,1,6,body);R(13,2,1,3,'#e8a8a8');R(16,8,1,1,'#2a1a14');eye(15,6);R(3,7,3,3,'#f4f0e8');R(4,12,2,1,dk);R(10,12,2,1,dk);R(7,12+(step?0:0),2,1,dk);R(14,12,2,1,dk);R(7,10,6,2,bel)}
 else if(sp==='ciervo'){ell(13,15,8,4,body);R(7,17,12,2,bel);R(20,6,3,10,body);ell(24,6,3,3,body);R(26,7,3,2,lt);R(28,8,1,1,'#14100c');R(23,2,1,3,body);R(25,2,1,3,body);const a='#e0d0a8';R(21,0,1,4,a);R(20,0,1,1,a);R(25,0,1,4,a);R(26,0,1,1,a);R(24,2,1,1,a);R(24,4,1,1,body);eye(25,5);
  for(let i=0;i<7;i++)R(9+i*2,12+(i%2),1,1,'#f0e8d0');legs([7,10,17,20],10,17,body);R(5,13,2,3,lt)}
 else if(sp==='jabali'){ell(14,10,10,5,body);R(5,6,18,2,dk);for(let i=0;i<9;i++)R(5+i*2,4+(i%2),1,3,dk);ell(23,11,4,4,body);R(26,12,3,3,dk);R(27,13,1,1,'#14100c');R(25,14,3,1,'#f0ead8');R(26,13,1,2,'#f0ead8');eye(24,9);R(21,6,2,3,dk);legs([6,9,19,22],5,13,body);R(3,8,2,2,dk)}
 else if(sp==='lobo'){ell(12,11,8,4,body);R(5,13,12,2,bel);ell(21,9,3,3,body);R(23,10,4,2,lt);R(26,10,1,1,'#14100c');R(20,4,2,3,dk);R(22,5,1,1,dk);eye(22,8);R(5,10,3,5,body);R(2,12,3,5,dk);R(1,15,2,2,dk);legs([6,9,16,19],6,14,body);R(18,7,3,3,body)}
 else if(sp==='perro'){ell(11,9,6,3,body);R(7,11,8,1,bel);ell(18,7,3,3,body);R(20,8,4,2,body);R(23,8,1,1,'#14100c');R(17,3,2,4,dk);R(19,3,1,1,dk);R(21,9,2,1,'#f4eee0');eye(20,6);ell(4,8,3,2,body);R(2,6,2,2,body);legs([6,8,14,16],5,11,dk)}
 else if(sp==='zorro'){ell(11,9,6,3,body);R(7,11,8,1,bel);ell(18,7,3,3,body);R(20,8,4,2,body);R(23,8,1,1,'#14100c');R(18,2,2,3,body);R(20,3,1,1,dk);R(21,9,2,1,'#f4eee0');eye(20,6);ell(4,9,4,3,body);R(0,9,3,3,'#f4eee0');legs([6,8,14,16],5,11,dk)}
 else if(sp==='cabra'||sp==='cabra_d'){const big=sp==='cabra';ell(12,12,7,4,body);R(7,14,10,2,bel);R(17,6,3,8,body);ell(21,6,3,3,body);R(23,8,2,3,bel);R(24,10,1,2,bel);R(24,7,1,1,'#14100c');const hc=big?'#d8c8a0':'#8a7a66';R(18,2,2,3,hc);R(17,0,2,3,hc);R(16,-0,1,1,hc);if(big){R(15,1,2,1,hc)}eye(22,5);legs([6,9,14,16],big?9:8,14,dk);R(5,10,2,2,bel)}
 else if(sp==='gato'){ell(9,9,5,3,body);ell(15,7,3,3,body);R(14,3,1,2,body);R(17,3,1,2,body);R(15,4,1,1,'#e8a8a8');eye(16,6);R(17,8,1,1,'#e8a8a8');R(4,6,1,5,body);R(3,3,1,4,body);R(2,3,2,1,dk);legs([6,8,12,14],3,10,dk);R(7,9,6,1,bel)}
 else if(sp==='oveja'){for(let i=0;i<7;i++)ell(6+i*2,10+(i%2),3,4,body);R(6,13,14,1,dk);ell(21,9,3,3,'#3a3030');R(23,10,2,2,'#4a3a3a');R(22,6,2,2,'#3a3030');eye(22,8);legs([6,9,16,19],5,15,'#3a3030')}
 else if(sp==='cuervo'||sp==='gaviota'){const c2=sp==='gaviota'?'#aab2c0':dk;ell(8,8,5,3,body);R(3,6,3,3,c2);const fl=step;R(5,fl?3:5,6,fl?3:2,c2);ell(14,5,2,2,body);R(16,5,3,1,sp==='gaviota'?'#e8b82a':'#3a3a3a');eye(15,4);R(7,11,1,3,'#8a6a3a');R(10,11,1,3,'#8a6a3a');if(sp==='gaviota'){R(3,7,2,2,'#3a3a44')}}
 else if(sp==='rata'){ell(9,8,5,3,body);R(5,9,8,1,bel);ell(15,8,2,2,body);R(17,9,3,1,lt);R(19,9,1,1,'#e8a0a0');R(14,5,2,2,'#d8a0a0');eye(16,7);R(0,10,5,1,'#d8a0a0');R(0,9,1,1,'#d8a0a0');R(5,11,2,1,dk);R(12,11,2,1,dk);R(6,11,1,1,dk)}
 else if(sp==='murcielago'){ell(13,9,2,3,body);ell(13,6,2,2,body);R(11,3,1,2,dk);R(15,3,1,2,dk);R(12,6,1,1,'#ff5a5a');R(14,6,1,1,'#ff5a5a');
  const fl=step?-3:2;for(let i=0;i<8;i++){R(11-i,7+Math.round(i*fl/8)+(i>5?1:0),1,3+(i%2),dk);R(15+i,7+Math.round(i*fl/8)+(i>5?1:0),1,3+(i%2),dk)}R(12,12,1,2,dk);R(14,12,1,2,dk)}
 else if(sp==='vibora'){const L=26;for(let i=0;i<L;i++){const y=7+Math.round(Math.sin(i*.55+(fr*1.2))*2.5);const c=(i%4<2)?body:mixc(body,'#4a5a28',.5);R(i,y,2,3,c);R(i,y+2,2,1,dk)}R(L,6+Math.round(Math.sin(L*.55+fr*1.2)*2.5),4,4,lt);R(L+3,8+Math.round(Math.sin(L*.55+fr*1.2)*2.5),1,1,'#14100c');R(L+3,7+Math.round(Math.sin(L*.55+fr*1.2)*2.5),1,1,'#ffd84a');if(step)R(L+4,9+Math.round(Math.sin(L*.55+fr*1.2)*2.5),2,1,'#e04a4a')}
 else if(sp==='gallina'){ell(7,9,4,3,body);R(10,5,2,5,body);ell(11,4,2,2,body);R(13,4,2,1,'#e8a82a');R(11,1,2,2,'#d83a3a');eye(12,3);R(3,6,2,4,mixc(body,'#8a5a2a',.5));R(6,12,1,2,'#d8a82a');R(8,12,1,2,'#d8a82a')}
 else if(sp==='trasgo'){const lg=step?1:0;ell(8,13,4,5,body);R(6,10,6,2,'#5a3a22');ell(9,6,4,4,body);R(2,4,4,2,body);R(14,4,4,2,body);R(10,6,1,1,'#ffe04a');R(8,6,1,1,'#ffe04a');R(9,9,3,1,'#2a1a14');R(11,9,1,1,'#f4f0e0');R(6,18,2,5-lg,dk);R(10,18,2,5-(1-lg),dk);R(13,11,1,7,'#7a5a32');R(12,10,3,2,'#8a8a92')}
 else if(sp==='ogro'){const lg=step?2:0;ell(17,22,9,11,body);R(9,20,16,3,'#5a3a22');R(10,26,15,4,'#6a4a2a');ell(20,8,6,6,body);R(16,4,3,2,dk);R(24,5,2,2,dk);R(23,8,1,2,'#ffd84a');R(19,8,1,1,'#ffd84a');R(18,12,6,2,'#2a1a14');R(19,11,1,2,'#f4f0e0');R(23,11,1,2,'#f4f0e0');R(10,17,4,12,dk);R(26,17,4,12,body);R(28,14,3,2,'#6a4a2a');R(29,6,3,13,'#7a5a32');R(28,4,5,5,'#8a6a40');R(11,32,5,9-lg,dk);R(19,32,5,9-(2-lg),body)}
 else if(sp==='vibria'){// serpiente alada grande
  const fl=step?-8:5;const seg=(i)=>({x:6+i*1.6,y:30+Math.round(Math.sin(i*.45+fr*1.3)*5)});
  for(let i=0;i<24;i++){const p=seg(i);const rr=i<20?3:2;R(p.x,p.y,rr+1,rr+2,(i%3===0)?lt:body);R(p.x,p.y+rr+1,rr+1,1,dk)}
  const hp=seg(24);R(hp.x,hp.y-3,7,6,body);R(hp.x+5,hp.y-1,4,3,lt);R(hp.x+7,hp.y,1,1,'#14100c');R(hp.x+3,hp.y-2,1,1,'#ffd84a');R(hp.x+1,hp.y-5,1,3,'#e0d0a8');R(hp.x+3,hp.y-5,1,3,'#e0d0a8');if(step)R(hp.x+9,hp.y+1,3,1,'#e04a4a');
  // alas
  const wc='#2a6a38';for(let i=0;i<16;i++){R(16+i*1,18-i+Math.round(i*fl/10),1,10+Math.round(i*.4),i%3?wc:shade(wc,.25))}R(14,24,6,4,body);
  R(2,32,6,2,dk);R(0,33,3,2,dk)}
}

// ---------- criaturas: vistas frontal y trasera (genéricas por tipo) ----------
const CR_FB={conejo:{k:'quad',ears:'long',tail:'puff',hs:.26,bw:.4,lg:.2},ciervo:{k:'quad',ears:'antler',tail:'tiny',hs:.2,bw:.3,lg:.3,snout:1},jabali:{k:'quad',ears:'round',tail:'tiny',hs:.22,bw:.42,lg:.2,tusk:1,snout:1},
 perro:{k:'quad',ears:'floppy',tail:'hang',hs:.24,bw:.34,lg:.3,snout:1},lobo:{k:'quad',ears:'point',tail:'hang',hs:.24,bw:.34,lg:.3,snout:1},zorro:{k:'quad',ears:'point',tail:'bush',hs:.24,bw:.34,lg:.28,snout:1},
 cabra:{k:'quad',ears:'horn',tail:'tiny',hs:.2,bw:.32,lg:.34,snout:1},cabra_d:{k:'quad',ears:'horn',tail:'tiny',hs:.2,bw:.32,lg:.34,snout:1},gato:{k:'quad',ears:'point',tail:'curl',hs:.26,bw:.34,lg:.24},
 oveja:{k:'quad',ears:'floppy',tail:'puff',hs:.2,bw:.46,lg:.26,wool:1,snout:1},rata:{k:'quad',ears:'round',tail:'string',hs:.3,bw:.36,lg:.16,snout:1},
 cuervo:{k:'bird'},gaviota:{k:'bird',beak:'#e8a838'},gallina:{k:'bird',comb:1,beak:'#e8a838'},murcielago:{k:'bat'},trasgo:{k:'biped',ears:'big',eye:'#e8d040'},ogro:{k:'biped',eye:'#e8d040',big:1}};
function hasFB(sp){return !!CR_FB[sp]}
function drawCreatureFB(ctx,ox,oy,sp,gn,fr,back){const df=CR_DEF[sp],F=CR_FB[sp];const w=df.cw,h=df.ch;const t=gn?gn.coat:.5;const body=mixc(df.coat[0],df.coat[1],t),dk=shade(body,-.28),lt=shade(body,.18),bel=df.bel;const step=(fr&1);
 const R=(x,y,ww,hh,c)=>{ctx.fillStyle=c;ctx.fillRect(ox+Math.round(x),oy+Math.round(y),ww,hh)};
 const ell=(cx,cy,rx,ry,c)=>{for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++)for(let x=-Math.ceil(rx);x<=Math.ceil(rx);x++){if((x*x)/(rx*rx+.3)+(y*y)/(ry*ry+.3)<=1.05)R(cx+x,cy+y,1,1,c)}};
 const cx=Math.round(w/2);const eye=(x,y,c)=>R(x,y,1,1,c||'#14100c');
 if(F.k==='quad'){const bw=Math.max(5,Math.round(w*F.bw)),lgL=Math.max(2,Math.round(h*F.lg)),bh=Math.round(h*.4),hr=Math.max(3,Math.round(h*F.hs*1.1));
  const by=h-lgL-Math.round(bh/2)+1,lift=(fr===1?1:fr===3?0:0);
  const legW=bw>12?3:2;const lx=[cx-Math.round(bw/2)+1,cx+Math.round(bw/2)-legW-1];
  lx.forEach((x,i)=>{const l=(i===0?(fr===1?1:0):(fr===3?1:0));R(x,h-lgL-1,legW,lgL-l,i?dk:shade(body,-.15));R(x,h-2-l,legW,1,'#2a1e16')});
  if(F.wool){ell(cx,by,bw/2+1,bh/2+1,body);ell(cx-2,by-1,3,3,lt);ell(cx+2,by-1,3,3,lt)}else ell(cx,by,bw/2,bh/2,body);
  if(!back&&!F.wool)R(cx-1,by+1,3,Math.ceil(bh/2),bel);
  if(back){if(F.wool){ell(cx,by+1,bw/2,bh/2-1,shade(body,-.08))}R(cx-Math.round(bw/4),by-2,Math.round(bw/2),1,lt)}
  const hy=Math.max(by-Math.round(bh/2)-hr+3,hr+(F.ears==='antler'?7:F.ears==='long'?5:2));
  ell(cx,hy,hr*.95,hr,F.wool?'#4a3e38':back?body:body);
  if(F.ears){const e=F.ears;const ex=Math.round(hr*.7);
   if(e==='point'){R(cx-ex-1,hy-hr-1,2,3,body);R(cx+ex,hy-hr-1,2,3,body);if(!back){R(cx-ex,hy-hr+1,1,1,'#d8a0a0');R(cx+ex,hy-hr+1,1,1,'#d8a0a0')}}
   else if(e==='long'){R(cx-ex,hy-hr-4,2,5,body);R(cx+ex-1,hy-hr-4,2,5,body);if(!back){R(cx-ex+1,hy-hr-3,1,3,'#e8a8a8');R(cx+ex-1,hy-hr-3,1,3,'#e8a8a8')}}
   else if(e==='floppy'){R(cx-hr-1,hy-hr+1,2,hr+1,dk);R(cx+hr-1,hy-hr+1,2,hr+1,dk)}
   else if(e==='round'){R(cx-hr,hy-hr,2,2,dk);R(cx+hr-1,hy-hr,2,2,dk)}
   else if(e==='antler'){const ac='#d8c8a0';R(cx-ex,hy-hr-1,2,2,body);R(cx+ex-1,hy-hr-1,2,2,body);R(cx-ex-1,hy-hr-5,1,5,ac);R(cx+ex+1,hy-hr-5,1,5,ac);R(cx-ex-2,hy-hr-4,1,1,ac);R(cx+ex+2,hy-hr-4,1,1,ac);R(cx-ex-1,hy-hr-6,1,1,ac);R(cx+ex+1,hy-hr-6,1,1,ac)}
   else if(e==='horn'){const ac='#cfc6b0';R(cx-ex,hy-hr-1,1,3,ac);R(cx+ex,hy-hr-1,1,3,ac);R(cx-ex-1,hy-hr-3,1,2,ac);R(cx+ex+1,hy-hr-3,1,2,ac)}}
  if(!back){const ec='#14100c';eye(cx-Math.round(hr*.45),hy-1,ec);eye(cx+Math.round(hr*.45),hy-1,ec);
   if(F.snout){ell(cx,hy+Math.round(hr*.45),hr*.5,hr*.4,F.wool?'#6a5a52':shade(bel,-.05));R(cx,hy+Math.round(hr*.35),1,1,'#1a1210')}else{R(cx,hy+Math.round(hr*.4),1,1,'#c88a8a')}
   if(F.tusk){R(cx-hr+1,hy+Math.round(hr*.5),1,2,'#f0ead8');R(cx+hr-2,hy+Math.round(hr*.5),1,2,'#f0ead8')}}
  if(back&&F.tail){const ty=by-1,tl=F.tail;if(tl==='puff')ell(cx,ty+1,2,2,'#f4f0e8');else if(tl==='bush'){R(cx-2,ty,4,Math.round(bh*.8),body);R(cx-2,ty+Math.round(bh*.8)-2,4,2,'#f4f0e8')}else if(tl==='hang'){R(cx-1,ty,2,Math.round(bh*.9),dk)}else if(tl==='curl'){R(cx+bw/2,ty-3,1,6,body);R(cx+bw/2-1,ty-4,2,1,body)}else if(tl==='string'){R(cx,ty+2,1,5,'#b88a8a')}else R(cx,ty,1,2,dk)}
 } else if(F.k==='bird'){const bc=body;const bodyY=Math.round(h*.58);ell(cx,bodyY,Math.round(w*.26),Math.round(h*.3),bc);
  if(!back)ell(cx,bodyY+1,Math.round(w*.14),Math.round(h*.2),bel);
  ell(cx-Math.round(w*.26),bodyY,2,Math.round(h*.24),dk);ell(cx+Math.round(w*.26),bodyY,2,Math.round(h*.24),dk);
  const hy=bodyY-Math.round(h*.3);ell(cx,hy,Math.round(w*.14),Math.round(h*.16),bc);
  if(F.comb)R(cx-1,hy-Math.round(h*.18),2,2,'#c83030');
  if(!back){eye(cx-2,hy,'#fff6c0');eye(cx+1,hy,'#fff6c0');R(cx-1,hy+1,2,2,F.beak||'#7a6a3a')}else{R(cx-2,bodyY+Math.round(h*.25),4,2,dk)}
  const ly=h-3;R(cx-2,ly,1,3,'#3a2a1a');R(cx+1,ly,1,3,'#3a2a1a')
 } else if(F.k==='bat'){const by=Math.round(h*.5);ell(cx,by,2,Math.round(h*.22),body);ell(cx,by-Math.round(h*.2),2,2,body);
  const fl=step?2:0;for(let i=1;i<=Math.round(w*.4);i++){const yy=by-Math.round(i*.18)+fl*(i>6?1:0)-(i>8?1:0);R(cx-2-i,yy,1,Math.round(h*.3)-Math.round(i*.15),i%3?shade(body,-.15):body);R(cx+1+i,yy,1,Math.round(h*.3)-Math.round(i*.15),i%3?shade(body,-.15):body)}
  R(cx-2,by-Math.round(h*.3),1,2,body);R(cx+1,by-Math.round(h*.3),1,2,body);if(!back){eye(cx-1,by-Math.round(h*.2),'#e84040');eye(cx,by-Math.round(h*.2),'#e84040')}
 } else if(F.k==='biped'){const big=!!F.big;const lgL=Math.round(h*.28),tw=Math.round(w*(big?.5:.42)),th=Math.round(h*.38),hr=Math.round(h*(big?.13:.17));const legY=h-lgL;
  const l1=fr===1?1:0,l2=fr===3?1:0;R(cx-Math.round(tw*.4),legY,Math.round(tw*.3)+1,lgL-l1,dk);R(cx+Math.round(tw*.1),legY,Math.round(tw*.3)+1,lgL-l2,dk);
  R(cx-Math.round(tw*.45),h-2-l1,Math.round(tw*.3)+2,2,'#2a2018');R(cx+Math.round(tw*.08),h-2-l2,Math.round(tw*.3)+2,2,'#2a2018');
  const ty=legY-th+2;ell(cx,ty+Math.round(th/2),tw/2,th/2,body);if(big){R(cx-tw/2,ty+th-4,tw,3,'#6a4a2a');}else R(cx-3,ty+Math.round(th*.6),6,2,'#5a4a2a');
  if(!back)R(cx-2,ty+3,4,Math.round(th*.5),bel);
  const aw=big?Math.round(tw*.25):2;const ay=ty+2+(step?1:0);R(cx-Math.round(tw/2)-aw,ay,aw,Math.round(th*.8),shade(body,-.12));R(cx+Math.round(tw/2),ay+(step?-1:0),aw,Math.round(th*.8),shade(body,-.12));
  const hy=ty-hr+3;ell(cx,hy,hr+(big?1:0),hr,body);if(F.ears==='big'){R(cx-hr-4,hy-1,4,2,body);R(cx+hr,hy-1,4,2,body);R(cx-hr-5,hy-2,1,1,body);R(cx+hr+4,hy-2,1,1,body)}
  if(!back){eye(cx-2,hy-1,F.eye);eye(cx+1,hy-1,F.eye);R(cx-2,hy+hr-3,4,1,'#2a1a10');if(big){R(cx-2,hy+hr-4,1,2,'#f0ead8');R(cx+1,hy+hr-4,1,2,'#f0ead8')}}else{R(cx-hr+1,hy-hr+1,hr*2-1,2,dk)}
 }}
function creatureSheet(sp,gn){const df=CR_DEF[sp];const key='cr|'+sp+'|'+(gn?Math.round(gn.coat*6):3);if(SHEETS[key])return SHEETS[key];
 const cw=df.cw*HR,ch=df.ch*HR;const fb=hasFB(sp);const c=mkc(cw*4,ch*(fb?3:1)),ctx=c.getContext('2d');for(let f=0;f<4;f++){const t=mkc(df.cw,df.ch);drawCreature(t.getContext('2d'),0,0,sp,gn,f);ctx.drawImage(hires2x(t),f*cw,0);if(fb){for(let r=1;r<=2;r++){const t2=mkc(df.cw,df.ch);drawCreatureFB(t2.getContext('2d'),0,0,sp,gn,f,r===2);ctx.drawImage(hires2x(t2),f*cw,r*ch)}}}
 const rect=GL.allocSprite(c);SHEETS[key]={rect,fw:cw,fh:ch,cols:4,key,canvas:c};return SHEETS[key]}
