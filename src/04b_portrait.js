// ===================== RETRATOS: busto pixel-art 64×64 con sombreado tramado =====================
const PORT={};
const B4=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const JOB_BG={guardia:['#3a4a6a','#1c2438'],herrero:['#6a3a24','#2a160c'],boticario:['#3c5a44','#14241a'],posadero:['#6a4a2a','#2a1a0c'],mercader:['#5a4a6a','#20182c'],monje:['#5a5040','#221e16'],sacerdote:['#5a4a60','#1e1824'],ladron:['#2c2c3c','#0c0c14'],juglar:['#7a4a5a','#2c1620'],erudito:['#3a4a60','#141c2c'],pescador:['#3a5a6a','#12242c'],marinero:['#3a5a6a','#12242c'],granjero:['#5a6a3a','#1e260e'],pastor:['#5a6a3a','#1e260e'],lenador:['#4a5a34','#181e0e'],cazador:['#4a5a34','#181e0e'],minero:['#4a4a54','#16161c'],cantero:['#5a5a60','#1c1c20'],curtidor:['#5a4030','#201410'],tejedor:['#6a4a60','#26141e'],panadero:['#6a5a3a','#241e0e'],molinero:['#6a5a3a','#241e0e'],druida:['#3a5a3a','#0e2410'],noble:['#6a3a50','#26101c'],concejal:['#4a3a60','#18102a'],mendigo:['#4a4a44','#161612'],viajero:['#4a5a6a','#161e28'],aldeano:['#5a5a44','#1c1c12'],pc:['#4a4468','#18142a']};
function portraitCanvas(look,o){o=o||{};const key=charKey(look)+'|'+(o.expr||'')+'|'+(o.bg||'');if(PORT[key])return PORT[key];
 const W=64;const S=mkc(W,W),x=S.getContext('2d');const E=look.eq||{};const spn=look.sp||'human';
 const skin=look.skin||'#e8c4a0',skD=shade(skin,-.2),skDD=shade(skin,-.4),skL=shade(skin,.13),skLL=shade(skin,.26);
 const hair=look.hairC||'#3b2616',hD=shade(hair,-.3),hDD=shade(hair,-.52),hL=shade(hair,.25),hLL=shade(hair,.45);const hs=look.hair||'short';
 const fem=look.sex==='f';const build=look.build==null?1:look.build;const expr=o.expr||'neutral';
 const px=(a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(a|0,b|0,w,h)};const P=(a,b,c)=>px(a,b,1,1,c);
 const dith=(X,Y,v,cols)=>{v=Math.max(0,Math.min(.999,v));const s=v*(cols.length-1),i=Math.floor(s),f=s-i;return f>B4[(Y&3)*4+(X&3)]/16?cols[i+1]:cols[i]};
 // región elíptica sombreada
 const ell=(cx,cy,rx,ry,cols,k,fn)=>{k=k||[.28,.3];for(let Y=Math.floor(cy-ry);Y<=Math.ceil(cy+ry);Y++)for(let X=Math.floor(cx-rx);X<=Math.ceil(cx+rx);X++){const tx=(X+.5-cx)/rx,ty=(Y+.5-cy)/ry;if(tx*tx+ty*ty>1)continue;if(fn&&!fn(X,Y,tx,ty))continue;P(X,Y,dith(X,Y,.5+k[0]*tx+k[1]*ty,cols))}};
 const isOrc=spn==='orc',isDwarf=spn==='dwarf',isSmall=spn==='halfling'||spn==='gnome',isElf=spn==='elf',isDrag=spn==='dragonborn'||look.snout,isTief=spn==='tiefling',isGol=spn==='goliath';
 const cx=32,cy=isSmall?29:27;let rx=isOrc?13.5:isDwarf?13:isElf?11:isSmall?12.5:isDrag?11.5:isGol?13:12,ry=isSmall?13.5:isElf?15.5:isDwarf?14:isDrag?14.5:15;if(build===2)rx+=.8;if(build===0)rx-=.7;
 const bust=build===0?17:build===2?25:21;
 const sk5=[skLL,skL,skin,skD,skDD];
 // ---- pelo trasero / capa
 const cl=E.cloak;if(cl&&cl.c){ell(32,66,bust+5,20,[shade(cl.c,.1),cl.c,shade(cl.c,-.25),shade(cl.c,-.45)],[.2,.3])}
 const backHair=()=>{if(hs==='bald'||look.snout||isDrag)return;const hc=[hL,hair,hD,hDD];
  if(hs==='long'||hs==='braids'){ell(cx,cy+8,rx+4.5,22,hc,[.25,.35],(X,Y)=>Y>cy-6)}
  else if(hs==='pony'){ell(cx+rx+2,cy-3,3.5,6,hc);ell(cx+rx+3,cy+4,2.5,8,hc)}
  else if(hs==='bob'){ell(cx,cy+2,rx+3.5,16,hc,[.25,.3],(X,Y)=>Y>cy-8&&Y<cy+13)}
  else if(hs==='curly'){ell(cx,cy-2,rx+5,ry+3,hc)}};
 backHair();
 // ---- busto
 const body=E.body;
 const bustPix=(fn)=>{for(let Y=46;Y<64;Y++){const t=(64-Y)/18;const hw=bust*Math.sqrt(Math.max(0,1-t*t*.8))+2;for(let X=Math.floor(cx-hw);X<=Math.ceil(cx+hw);X++){const tx=(X+.5-cx)/hw;if(Math.abs(tx)>1)continue;fn(X,Y,tx,(Y-46)/18)}}};
 if(!body){bustPix((X,Y,tx,ty)=>P(X,Y,dith(X,Y,.5+.3*tx+.25*ty,sk5)));
  px(cx-bust+2,56,bust*2-4,2,'#6a5a3a');for(let i=0;i<bust*2-4;i+=3)P(cx-bust+2+i,58,'#4a3a22')}
 else{const c=body.c,c2=body.c2||shade(c,.25),k=body.k;const bc=[shade(c,.2),c,shade(c,-.18),shade(c,-.36)];
  bustPix((X,Y,tx,ty)=>{let col=dith(X,Y,.42+.3*tx+.22*ty,bc);
   if(k==='chain'&&((X+Y)&1))col=shade(col,.16);
   if(k==='plate'){if(Math.abs(tx)>.62&&ty<.55)col=dith(X,Y,.15+.3*Math.abs(tx)-.2*ty,[shade(c,.4),shade(c,.2),c,shade(c,-.3)])}
   if(k==='padded'&&((X+2)%4===0))col=shade(col,-.2);
   if(k==='hide'&&(Y<52)&&((X*7+Y*3)%5<2))col=shade(c2,.1);
   P(X,Y,col)});
  if(k==='leather'||k==='hide'){for(let i=0;i<14;i++)px(cx-12+i,47+i,2,1,c2)}
  if(k==='noble'){px(cx-1,50,2,14,c2);for(let i=0;i<4;i++)P(cx,52+i*3,'#f0d890');px(cx-bust+1,47,bust*2-2,1,c2)}
  if(k==='robe'||k==='dress'){px(cx-bust+2,46,bust*2-4,1,c2);px(cx-1,50,2,14,shade(c,-.3))}
  if(k==='tunic'){px(cx-bust+1,63,bust*2-2,1,shade(c,-.3))}
  if(k==='plate'){px(cx-7,47,14,2,shade(c,.35));px(cx-7,49,14,1,shade(c,-.3))}
  if(k==='chain'){px(cx-8,46,16,2,shade(c,.1));px(cx-8,48,16,1,shade(c,-.3))}}
 // cuello
 for(let Y=40;Y<50;Y++)for(let X=cx-5;X<=cx+5;X++){const tx=(X-cx)/5;P(X,Y,dith(X,Y,.42+.3*tx+(Y>44?.25:0),sk5))}
 for(let X=cx-4;X<=cx+4;X++)P(X,44,skDD),P(X,45,skD);
 // escote
 if(body&&['tunic','noble','padded','robe','dress','leather','hide'].includes(body.k)){for(let i=0;i<5;i++)px(cx-4+i,46+i,9-2*i,1,i===0?skD:skin);px(cx-5,45,1,1,shade(body.c,-.3));px(cx+5,45,1,1,shade(body.c,-.3))}
 const nk=E.neck;if(nk&&nk.c){if(nk.k==='amulet'){for(let i=0;i<6;i++){P(cx-5+i,46+i,'#6a5030');P(cx+5-i,46+i,'#6a5030')}px(cx-1,52,3,3,nk.c);P(cx,52,'#fff6c0')}else if(nk.k==='scarf'){px(cx-8,44,16,4,nk.c);px(cx-8,47,16,1,shade(nk.c,-.25));px(cx+2,48,4,8,shade(nk.c,-.1));px(cx+2,55,4,1,shade(nk.c,-.3))}}
 if(cl&&cl.c){px(cx-bust,46,3,18,shade(cl.c,-.2));px(cx+bust-3,46,3,18,shade(cl.c,-.3));px(cx-2,47,4,3,'#d8b84a');P(cx-1,47,'#fff0a0')}
 // ---- cabeza (silueta con mandíbula según especie)
 const jaw=isOrc?-.18:isDwarf?-.05:isElf?.42:isSmall?.15:isDrag?.1:.28;
 const faceW=(Y)=>{const t=(Y-cy)/ry;if(Math.abs(t)>1)return 0;let w=Math.sqrt(1-t*t);if(t>0)w*=(1-jaw*t*t*(isOrc?.2:1));return rx*w};
 // orejas
 const ey=cy+1;
 if(isElf){for(let i=0;i<9;i++){const w=Math.max(1,3-Math.floor(i/3));px(cx-rx-2-i*.9,ey-2-i*.7,w+2,2,i%3?skin:skD);px(cx+rx-1+i*.9,ey-2-i*.7,w+2,2,i%3?skin:skD)}}
 else if(!isDrag){const L=isOrc?3:2;ell(cx-rx-.4,ey,L,3.6,[skL,skin,skD]);ell(cx+rx+.4,ey,L,3.6,[skin,skD,skDD]);P(cx-rx-.4,ey,skDD);P(cx+rx+.4,ey,skDD)}
 // cara
 for(let Y=Math.floor(cy-ry);Y<=Math.ceil(cy+ry);Y++){const w=faceW(Y+.5);for(let X=Math.floor(cx-w);X<=Math.ceil(cx+w);X++){const tx=(X+.5-cx)/Math.max(1,w),ty=(Y+.5-cy)/ry;if(Math.abs(tx)>1)continue;P(X,Y,dith(X,Y,.46+.26*tx+.28*ty,sk5))}}
 // hocico dracónido
 if(isDrag){ell(cx,cy+8,9,6.5,[skL,skin,skD,skDD],[.2,.34]);P(cx-3,cy+6,'#161210');P(cx+3,cy+6,'#161210');px(cx-5,cy+11,10,1,skDD);for(let i=0;i<5;i++)P(cx-4+i*2,cy+12,'#f4ecd8');
  for(let Y=cy-ry;Y<cy+ry;Y+=3)for(let X=cx-rx+1;X<cx+rx-1;X+=3)if(((X+Y)&1)===0&&faceW(Y)>Math.abs(X-cx))P(X,Y,skD);
  const sc=skD;for(let i=0;i<5;i++){px(cx-8+i*4,cy-ry-3+Math.abs(2-i),2,4,sc);P(cx-8+i*4,cy-ry-3+Math.abs(2-i),skL)}}
 // mejillas y sombras
 if(fem||isSmall){ell(cx-7,cy+7,3,1.8,['#d88a82','#e8a8a0'].map(c=>mixc(skin,c,.35)),[0,0]);ell(cx+7,cy+7,3,1.8,['#d88a82','#e8a8a0'].map(c=>mixc(skin,c,.35)),[0,0])}
 // ojos
 const ew=isSmall?6:5,eh=isSmall?4:3,ex=isSmall?7:isOrc?7:6.5,eyY=cy-1;const ir=look.eyeC||'#3b2a1a';
 const eye=(sx,left)=>{if(isDrag){px(sx,eyY,4,2,'#161210');px(sx+1,eyY,2,2,ir);P(sx+1,eyY,'#fff6c0');return}
  px(sx,eyY,ew,eh,'#f4f0ec');px(sx,eyY+eh-1,ew,1,mixc('#f4f0ec',skD,.5));
  const ix=sx+(left?1:ew-3);px(ix,eyY,3,eh,ir);px(ix,eyY,3,1,shade(ir,-.45));P(ix+1,eyY+1,'#0a0806');P(ix,eyY+1,'#ffffff');
  px(sx,eyY-1,ew,1,hDD);if(fem){P(sx,eyY-1,hDD);P(left?sx-1:sx+ew,eyY-2,hDD)}};
 const lx=Math.round(cx-ex-ew/2+.5),rxp=Math.round(cx+ex-ew/2+.5);eye(lx,true);eye(rxp,false);
 // cejas
 const bh=isOrc?2:1;const bcol=hair==='#ffffff'?'#aaa':shade(hair,-.15);
 const brow=(sx,left)=>{const a=expr==='stern'?(left?1:-1):expr==='sad'?(left?-1:1):0;for(let i=0;i<ew+1;i++){const t=left?i:ew-i;px(sx-1+i,eyY-3-(i>2?0:0)+Math.round(a*(i/ew)*(left?1:-1)*1),1,bh,bcol)}};
 if(!isDrag){brow(lx,true);brow(rxp,false)}
 // nariz
 if(!isDrag){const nw=isDwarf?5:isOrc?5:isElf?2:3;px(cx-1,eyY+3,2,3,skL);px(cx-Math.floor(nw/2),eyY+6,nw,1,skD);P(cx-Math.floor(nw/2),eyY+6,skDD);P(cx+Math.floor(nw/2),eyY+6,skDD);if(isDwarf||isOrc){px(cx-2,eyY+4,4,2,skin);px(cx-3,eyY+6,6,1,skD)}}
 // boca
 const my=cy+9+(isSmall?-1:0);const lip=fem?mixc(skin,'#b04a50',.62):mixc(skin,'#8a4a3a',.45);
 if(!isDrag){if(expr==='smile'){px(cx-3,my,6,1,lip);P(cx-4,my-1,lip);P(cx+3,my-1,lip);px(cx-2,my+1,4,1,shade(lip,.18))}
  else if(expr==='stern'||expr==='sad'){px(cx-3,my,6,1,shade(lip,-.3));px(cx-2,my+1,4,1,shade(lip,.05));if(expr==='sad'){P(cx-4,my+1,shade(lip,-.3));P(cx+3,my+1,shade(lip,-.3))}}
  else{px(cx-3,my,6,1,shade(lip,-.25));px(cx-2,my+1,4,1,lip);if(fem)px(cx-2,my-1,4,1,lip)}
  px(cx-2,my+3,4,1,skD)}
 if(look.tusks){px(cx-6,my-1,2,4,'#f4ecd8');px(cx+4,my-1,2,4,'#f4ecd8');P(cx-6,my-1,'#fff');P(cx+5,my-1,'#fff')}
 // cicatrices y marcas
 const sc=look.scar,mk=look.mark;
 if(sc==='eye'){for(let i=0;i<9;i++)P(lx+1+Math.floor(i/3),eyY-4+i,'#a8444a');}
 if(sc==='cheek'){for(let i=0;i<5;i++)P(rxp+1+i,eyY+4+Math.floor(i/2),'#a8444a')}
 if(sc==='brow'){for(let i=0;i<4;i++)P(rxp+2,eyY-5+i,'#a8444a')}
 if(mk==='freckles'){const f=shade(skin,-.26);for(let i=0;i<8;i++)P(cx-8+((i*5)%16)+(i>3?1:0),eyY+4+(i%2),f)}
 if(mk==='tribal'){const m=shade(skin,-.55);for(let i=0;i<6;i++){P(lx-2,eyY+i,m);P(rxp+ew+1,eyY+i,m)}}
 if(mk==='runes'){const m='#7ad8ff';px(cx-2,cy-9,4,1,m);P(cx,cy-8,m);P(cx-1,cy-7,m);P(cx+1,cy-7,m)}
 if(mk==='paint'){px(cx-rx,eyY-1,rx*2,3,'#a02020');px(cx-rx,eyY,rx*2,1,'#e8e0d0')}
 if(isGol){const m2=shade(skin,.22),m3=shade(skin,-.3);for(let i=0;i<4;i++){px(cx-9,cy-8+i*3,3,1,m2);px(cx+7,cy-7+i*3,3,1,m3)}}
 // vello facial
 const fa=look.facial;if(fa&&fa!=='none'&&!isDrag){const fc=[hL,hair,hD];const inBeard=(X,Y)=>Math.abs(X+.5-cx)<=faceW(Y+.5)+.5;
  if(fa==='stubble'){for(let Y=my-4;Y<=cy+ry;Y++)for(let X=cx-rx;X<=cx+rx;X++)if(inBeard(X,Y)&&((X*3+Y*5)%4===0)&&(Y>cy+4))P(X,Y,mixc(skin,hair,.5))}
  else if(fa==='short'||fa==='long'){const len=fa==='long'?13:4;for(let Y=my-5;Y<=cy+ry+len;Y++)for(let X=cx-rx-1;X<=cx+rx+1;X++){const w=Y<=cy+ry?faceW(Y+.5)+1:Math.max(0,(rx+1)*(1-(Y-(cy+ry))/(len+1)*(fa==='long'?.85:.6)));if(Math.abs(X+.5-cx)>w)continue;if(Y<my-1&&Math.abs(X+.5-cx)<rx-3)continue;if(Y>=my-1&&Y<=my+1&&Math.abs(X+.5-cx)<3.2)continue;P(X,Y,dith(X,Y,.4+.3*((X+.5-cx)/rx)+.25*((Y-my)/16),fc))}
   if(fa==='short'||true){px(cx-3,my,6,1,shade(lip,-.2))}}
  else if(fa==='moustache'){px(cx-5,my-2,10,2,hair);px(cx-6,my-1,2,2,hair);px(cx+4,my-1,2,2,hair);px(cx-5,my-2,10,1,hL)}
  else if(fa==='goatee'){px(cx-4,my+1,8,2,hair);px(cx-3,my+3,6,3,hair);px(cx-2,my+6,4,2,hD);px(cx-4,my-1,8,1,hair)}}
 // ---- pelo delantero
 const H=E.head;const covered=H&&(H.k==='helm'||H.k==='greathelm'||H.k==='hood');
 if(hs!=='bald'&&!isDrag&&!(H&&(H.k==='helm'||H.k==='greathelm'))){const hc=[hLL,hL,hair,hD,hDD];const top=cy-ry;
  const hat=H&&(H.k==='hat'||H.k==='hatp'||H.k==='wiz'||H.k==='cap'||H.k==='hood');
  if(hs==='mohawk'){for(let Y=top-6;Y<cy-4;Y++)for(let X=cx-3;X<=cx+2;X++)P(X,Y,dith(X,Y,.3+.4*((X-cx)/3)+.1*(Y-top+6)/8,[hL,hair,hD]));for(let i=0;i<5;i++)P(cx-3+i,top-7+(i%2),hair)}
  else{const hr=rx+1.6,hry=ry+3.2;
   for(let Y=Math.floor(cy-hry);Y<=cy+2;Y++)for(let X=Math.floor(cx-hr-3);X<=Math.ceil(cx+hr+3);X++){const tx=(X+.5-cx)/hr,ty=(Y+.5-cy)/hry;if(tx*tx+ty*ty>1)continue;
     // flequillo: se queda sólo la parte alta y los lados
     const fringe=Y<cy-ry+5+Math.round(Math.sin(X*1.7)*1.6+(X<cx?-1:0));const side=Math.abs(X+.5-cx)>faceW(Y+.5)-.5&&Y<cy+3;
     if(!fringe&&!side)continue;
     let col=dith(X,Y,.3+.28*tx+.3*ty+(((X*13+Y*7)%9)<2?-.18:0),hc);P(X,Y,col)}
   if(hs==='curly'){for(let i=0;i<12;i++){const a=i/12*Math.PI;ell(cx+Math.cos(a)*(rx+2),cy-ry+2-Math.sin(a)*(ry*.55),3.2,3.2,[hL,hair,hD],[.25,.3])}}
   if(hs==='bun'){ell(cx,cy-ry-3,4.5,4,[hLL,hL,hair,hD],[.3,.3]);px(cx-4,cy-ry-1,8,1,hD)}
   if(hs==='long'||hs==='braids'){for(const sgn of[-1,1]){const x0=cx+sgn*(rx+1);for(let Y=cy-4;Y<54;Y++){const w=hs==='braids'?3:4+(Y>cy+16?-1:0);for(let i=0;i<w;i++){const X=x0+sgn*i-(sgn<0?w-1:0);const v=hs==='braids'?((Y%4<2)?.25:.7):.35+.3*(sgn<0?-1:1)*i/w;P(X,Y,dith(X,Y,v,[hL,hair,hD]))}}}}
   if(hs==='bob'){for(const sgn of[-1,1]){for(let Y=cy-3;Y<cy+13;Y++){const x0=cx+sgn*(faceW(Y+.5)+.5);for(let i=0;i<4;i++)P(x0+sgn*i-(sgn<0?3:0),Y,dith(x0+i,Y,.3+.15*i,[hL,hair,hD]))}}}
   if(hs==='pony'){ell(cx+rx+4,cy-6,2.5,3,[hL,hair,hD]);}
   // hebras
   for(let i=0;i<10;i++){const X=cx-rx+1+((i*7)%(rx*2-1)),Y0=top+1+(i%3);for(let j=0;j<4;j++)P(X+(j>>1),Y0+j,hLL)}}
 }
 // ---- cuernos y tocados
 if(look.horns&&look.horns!=='none'){const hc=look.hornC||'#2a2420';const hl=shade(hc,.3);
  if(look.horns==='ram'){for(const s of[-1,1]){ell(cx+s*(rx+2),cy-6,3.5,4,[hl,hc,shade(hc,-.3)]);ell(cx+s*(rx+4),cy-1,2.5,3,[hl,hc,shade(hc,-.3)])}}
  else for(const s of[-1,1])for(let i=0;i<10;i++){const X=cx+s*(rx-3+i*.55),Y=cy-ry+2-i*1.1-(i>6?-.5*(i-6):0);px(X-(s<0?1:0),Y,2,2,i<3?hc:i<8?hc:hl)}}
 if(H&&H.c){const c=H.c,k=H.k,cs=[shade(c,.28),shade(c,.1),c,shade(c,-.25),shade(c,-.45)];const top=cy-ry;
  if(k==='hood'){for(let Y=top-5;Y<cy+16;Y++)for(let X=cx-rx-6;X<=cx+rx+6;X++){const tx=(X+.5-cx)/(rx+6),ty=(Y+.5-(cy-2))/(ry+9);if(tx*tx+ty*ty>1)continue;const fw=faceW(Y+.5)-.8;if(Y>=top+2&&Math.abs(X+.5-cx)<fw&&Y<cy+ry)continue;P(X,Y,dith(X,Y,.35+.3*tx+.3*ty,cs))}}
  else if(k==='cap'){ell(cx,top+3,rx+1.5,6,cs,[.3,.4],(X,Y)=>Y<top+6);px(cx-rx-1,top+5,rx*2+2,2,shade(c,-.3));P(cx,top-2,shade(c,.3))}
  else if(k==='hat'||k==='hatp'||k==='wiz'){ell(cx,top+6,rx+9,3,cs,[.2,.5]);if(k==='wiz'){for(let i=0;i<22;i++){const w=Math.max(1,10-i*.45);px(cx-w/2+Math.sin(i*.2)*1.2,top+3-i,w,1,dith(cx,i,.3+i/50,cs.slice(1)))}px(cx-rx,top+2,rx*2,2,'#c8a84a')}else{ell(cx,top+2,rx-1,7,cs,[.3,.4],(X,Y)=>Y<top+5);px(cx-rx+1,top+3,rx*2-2,2,shade(c,-.35));if(k==='hatp'){for(let i=0;i<9;i++)px(cx+rx-3+i*.6,top-3-i*.7,2,2,i%2?'#f0ece0':'#d8d0c0')}}}
  else if(k==='helm'||k==='greathelm'){ell(cx,cy-2,rx+2,ry+3,cs,[.3,.35],(X,Y,tx,ty)=>ty<.35||Math.abs(tx)>.8);
   if(k==='greathelm'){ell(cx,cy+3,rx+2,ry,cs,[.3,.35]);px(cx-rx,eyY,rx*2,2,'#0c0c12');for(let i=0;i<6;i++)P(cx-4+i*1.6,my+1,'#0c0c12');px(cx-1,cy-ry,2,ry*2,shade(c,.2))}
   else{px(cx-1,eyY-4,3,12,shade(c,.15));px(cx-rx-2,top+7,rx*2+4,2,shade(c,-.3));for(let i=0;i<10;i++)P(cx-rx+i*2.4,top+6,shade(c,.45))}}
  else if(k==='circlet'){px(cx-rx,top+4,rx*2,1,c);px(cx-rx,top+5,rx*2,1,shade(c,-.3));ell(cx,top+4,1.8,1.8,['#bff0ff','#7ad8ff','#3a98c8'],[.3,.3])}
  else if(k==='crown'){px(cx-rx+1,top+3,rx*2-2,4,c);px(cx-rx+1,top+6,rx*2-2,1,shade(c,-.35));for(let i=0;i<5;i++)px(cx-rx+1+i*(rx*2-3)/4,top-1+Math.abs(2-i)*.8,2,5,shade(c,.15));ell(cx,top+4.5,1.5,1.5,['#ff8a8a','#e04a4a','#902020'])}}
 // ---- contorno oscuro exterior
 outlineCell(x,0,0,W,W,[24,16,12]);
 // ---- fondo
 const C=mkc(W,W),g=C.getContext('2d');const bgc=(o.bg&&JOB_BG[o.bg])||JOB_BG.aldeano;
 for(let Y=0;Y<W;Y++)for(let X=0;X<W;X++){const v=Y/W*.8+.1+(((X-32)*(X-32)+(Y-24)*(Y-24))/2600)*.4;g.fillStyle=dith(X,Y,Math.min(.99,v),[shade(bgc[0],.15),bgc[0],mixc(bgc[0],bgc[1],.55),bgc[1]]);g.fillRect(X,Y,1,1)}
 g.fillStyle='rgba(0,0,0,.28)';g.drawImage(S,2,2);g.globalAlpha=.28;g.globalAlpha=1;g.drawImage(S,0,0);
 // luz de borde en el pelo/ropa por la izquierda
 g.fillStyle='rgba(255,236,190,.0)';
 PORT[key]=C;return C}
function exprOf(n){if(!n||!n.tr)return'neutral';const t=n.tr;if(n.mood<25)return'sad';if(t.warm>=7||t.humor>=8)return'smile';if(t.temper>=8||(t.brave>=8&&t.warm<=4))return'stern';return'neutral'}
// elemento <canvas> listo para insertar, escalado con píxeles nítidos
function portraitEl(look,size,o){const src=portraitCanvas(look,o);const c=document.createElement('canvas');c.width=64;c.height=64;c.getContext('2d').drawImage(src,0,0);c.className='portrait-px';c.style.width=size+'px';c.style.height=size+'px';c.style.imageRendering='pixelated';return c}
function npcPortrait(n,size){return portraitEl(npcSprite(n),size||96,{expr:exprOf(n),bg:n.job})}
