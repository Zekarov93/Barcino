// ===================== SPRITES: atlas de baldosas, árboles, props, iconos =====================
const T={G0:0,G1:1,G2:2,GF:3,DIRT:4,PATH:5,COBBLE:6,SAND:7,ROCK:8,FOREST:9,FARM:10,WOODF:11,FLAG:12,GRAVEL:13,MROCK:14,MOSS:15,
 WATER:16,FOAM:20,W_STONE:32,W_STONE2:33,W_BRICK:34,W_WHITE:35,W_TIMBER:36,W_OCHRE:37,W_TRENC:38,W_DARK:39,W_ROCKC:40,
 WINDOW:44,WINDOW2:45,DOOR:46,ARCH:47,R_TERRA:48,R_SLATE:49,R_THATCH:50,R_GOTH:51,R_TRENC:52,R_RIDGE:53,
 SHADOW:60,BARK:61,PLANK:62,CARPET:63,FENCE_W:64,FENCE_S:65,FENCE_I:66,RING:67,ARROW:68};
const TILE_COL={}; // color medio para minimapa (se rellena al construir)
function tileUV(i){const c=i%16,r=i>>4;return[(c*16+.03)/256,(r*16+.03)/256,(c*16+15.97)/256,(r*16+15.97)/256]}
function nz(ctx,x,y,base,spots,seed,dens){const r=mulberry32(seed);ctx.fillStyle=base;ctx.fillRect(x,y,16,16);const n=Math.floor(256*(dens||.4));for(let i=0;i<n;i++){ctx.fillStyle=spots[Math.floor(r()*spots.length)];ctx.fillRect(x+Math.floor(r()*16),y+Math.floor(r()*16),1,1)}}
function blocks(ctx,x,y,bw,bh,cols,line,seed,stagger){const r=mulberry32(seed);ctx.fillStyle=line;ctx.fillRect(x,y,16,16);for(let yy=0;yy<16;yy+=bh){const off=stagger&&((yy/bh)&1)?Math.floor(bw/2):0;for(let xx=-off;xx<16;xx+=bw){const c=cols[Math.floor(r()*cols.length)];ctx.fillStyle=c;const x0=Math.max(0,xx),x1=Math.min(16,xx+bw-1);if(x1>x0)ctx.fillRect(x+x0,y+yy,x1-x0,bh-1);
  if(r()<.5){ctx.fillStyle=shade(c,.12);ctx.fillRect(x+x0,y+yy,Math.max(0,x1-x0),1)}}}}
const GRASS={0:['#5fa04a',['#6ab455','#528c3e','#7ac45f','#4a8038']],1:['#7a9a42',['#8aa84c','#6a8a34','#a8ae4a','#5f822e']],2:['#8a8c3e',['#a8a048','#7a8038','#c08a3a','#6a7030']],3:['#7e9478',['#8aa584','#6e8a68','#9cb098','#627e5e']],4:['#e6eef2',['#d6e2ea','#f4f8fa','#c4d2dc','#ffffff']]};
function buildTileAtlas(v){
 const c=mkc(256,256),x=c.getContext('2d');const g=GRASS[v];const snow=v===4,win=v>=3;
 const P=(i)=>[(i%16)*16,(i>>4)*16];
 const cell=(i,f)=>{const[a,b]=P(i);f(a,b,1000+i*97+v*13)};
 for(let k=0;k<3;k++)cell(k,(a,b,s)=>nz(x,a,b,g[0],g[1],s+k*7,.55));
 cell(T.GF,(a,b,s)=>{nz(x,a,b,g[0],g[1],s,.5);if(!snow){const cols=v===0?['#f4e04a','#f4f4f4','#e86aa0','#9a6af0']:v===1?['#f0d84a','#fff']:v===2?['#e8c06a']:[];const r=mulberry32(s);for(const cc of cols){for(let i=0;i<2;i++){x.fillStyle=cc;x.fillRect(a+Math.floor(r()*15),b+Math.floor(r()*15),1,1)}}}});
 cell(T.DIRT,(a,b,s)=>nz(x,a,b,snow?'#c9cfd2':'#8a6a44',snow?['#a89a84','#e4e8ea','#8a7a64']:['#7a5c3a','#9a7a52','#6a4e30'],s,.5));
 cell(T.PATH,(a,b,s)=>nz(x,a,b,snow?'#d0d4d0':'#a88a5c',snow?['#b0a890','#e8ecec','#98907c']:['#b89a68','#987a4c','#c8aa78'],s,.45));
 cell(T.COBBLE,(a,b,s)=>blocks(x,a,b,5,4,snow?['#b8bcc0','#c8ccd0','#a8acb2']:['#8a8a90','#9a9aa0','#7a7a82','#a4a09a'],snow?'#8a8e94':'#5a5a62',s,true));
 cell(T.SAND,(a,b,s)=>nz(x,a,b,'#d8c48a',['#e4d29c','#c8b478','#ecdcae'],s,.45));
 cell(T.ROCK,(a,b,s)=>{nz(x,a,b,'#7a7a82',['#8a8a92','#6a6a72','#9a9aa2'],s,.5);x.fillStyle='#55555c';x.fillRect(a+3,b+5,5,1);x.fillRect(a+9,b+11,4,1);if(snow){x.fillStyle='#f0f4f6';x.fillRect(a+1,b+1,6,2);x.fillRect(a+9,b+8,5,2)}});
 cell(T.FOREST,(a,b,s)=>nz(x,a,b,snow?'#cad6d4':win?'#5a6a48':'#3f6a38',snow?['#e8f0f0','#a8b8b4','#8a7a5a']:win?['#6a5a3a','#4a5a3a','#7a6a48']:['#4a7a40','#34592e','#7a5a30','#5a4a2a'],s,.6));
 cell(T.FARM,(a,b,s)=>{nz(x,a,b,snow?'#c8c8c8':'#6a4a2a',snow?['#e0e4e4','#a8a49c']:['#5a3e22','#7a5a38'],s,.3);x.fillStyle=snow?'#a8a49c':'#4e361c';for(let i=2;i<16;i+=4)x.fillRect(a,b+i,16,1)});
 cell(T.WOODF,(a,b,s)=>{x.fillStyle='#a07a4a';x.fillRect(a,b,16,16);const r=mulberry32(s);for(let i=0;i<16;i+=4){x.fillStyle='#6a4a2a';x.fillRect(a,b+i,16,1);x.fillStyle=shade('#a07a4a',(r()-.5)*.25);x.fillRect(a,b+i+1,16,3);x.fillStyle='#6a4a2a';x.fillRect(a+Math.floor(r()*16),b+i,1,4)}});
 cell(T.FLAG,(a,b,s)=>blocks(x,a,b,8,8,snow?['#d0d4d8','#c0c4ca']:['#b4aea0','#a8a294','#bcb6a8'],snow?'#98a0a8':'#7a7468',s,true));
 cell(T.GRAVEL,(a,b,s)=>nz(x,a,b,snow?'#c8ccd0':'#9a968c',snow?['#e0e4e8','#a8aab0']:['#aaa69c','#7a766c','#b8b4aa','#6a665c'],s,.7));
 cell(T.MROCK,(a,b,s)=>{x.fillStyle='#7a5a48';x.fillRect(a,b,16,16);const r=mulberry32(s);for(let i=0;i<14;i++){const cx=Math.floor(r()*14),cy=Math.floor(r()*14),cc=['#9a7a62','#8a6a54','#a88a70','#6a4a3a'][Math.floor(r()*4)];x.fillStyle=cc;x.fillRect(a+cx,b+cy,2+Math.floor(r()*2),2);x.fillStyle=shade(cc,.2);x.fillRect(a+cx,b+cy,1,1)}if(snow){x.fillStyle='#f4f6f8';for(let i=0;i<10;i++)x.fillRect(a+Math.floor(r()*14),b+Math.floor(r()*14),2,1)}});
 cell(T.MOSS,(a,b,s)=>nz(x,a,b,'#6a7a5a',['#5a8a4a','#7a9a6a','#4a6a3a'],s,.6));
 for(let f=0;f<4;f++){const[a,b]=P(T.WATER+f);x.fillStyle='#3a6aa8';x.fillRect(a,b,16,16);const r=mulberry32(77);for(let i=0;i<16;i++){x.fillStyle=i%3?'#4a7ab8':'#2e5a98';x.fillRect(a+Math.floor(r()*16),b+Math.floor(r()*16),3,1)}
  for(let k=0;k<5;k++){const yy=(k*3+1)%16;const xx=(k*7+f*4)%16;x.fillStyle='#8ab8e8';x.fillRect(a+xx,b+yy,3,1);x.fillRect(a+(xx+8)%16,b+(yy+7)%16,2,1)}}
 cell(T.FOAM,(a,b,s)=>nz(x,a,b,'#9ac0e0',['#e8f4ff','#c8e0f4','#fff'],s,.5));
 // paredes
 cell(T.W_STONE,(a,b,s)=>blocks(x,a,b,8,4,['#9a9488','#a8a296','#8a8478','#b0aa9c'],'#6a655c',s,true));
 cell(T.W_STONE2,(a,b,s)=>blocks(x,a,b,6,5,['#a89e90','#988e80','#b8ae9e'],'#6a6258',s,true));
 cell(T.W_BRICK,(a,b,s)=>blocks(x,a,b,8,4,['#a8553a','#b8624a','#9a4a32','#c0704e'],'#6a3a2a',s,true));
 cell(T.W_WHITE,(a,b,s)=>{nz(x,a,b,'#e8e0cc',['#f0e8d8','#dcd4c0','#e0d8c4'],s,.35);x.fillStyle='#c8bfa8';x.fillRect(a,b+15,16,1)});
 cell(T.W_TIMBER,(a,b,s)=>{nz(x,a,b,'#e0d6bc',['#ece2c8','#d4caae'],s,.3);x.fillStyle='#5a3e26';x.fillRect(a,b,16,2);x.fillRect(a,b+14,16,2);x.fillRect(a,b,2,16);x.fillRect(a+14,b,2,16);for(let i=0;i<14;i++){x.fillRect(a+2+i,b+13-i,1,1)}x.fillStyle='#7a5a3a';x.fillRect(a,b,16,1)});
 cell(T.W_OCHRE,(a,b,s)=>{nz(x,a,b,'#d8b060',['#e4be6c','#c8a050','#ecc880'],s,.35);x.fillStyle='#a88838';x.fillRect(a,b+15,16,1)});
 cell(T.W_TRENC,(a,b,s)=>{const r=mulberry32(s);x.fillStyle='#e8e4d8';x.fillRect(a,b,16,16);const cols=['#2a8a8a','#e8b83a','#d8503a','#3a6ab8','#6aa850','#f4f0e0','#8a4aa8'];for(let yy=0;yy<16;yy+=3)for(let xx=0;xx<16;xx+=3){x.fillStyle=cols[Math.floor(r()*cols.length)];x.fillRect(a+xx+Math.floor(r()*2),b+yy+Math.floor(r()*2),2+Math.floor(r()*2),2)}});
 cell(T.W_DARK,(a,b,s)=>blocks(x,a,b,8,4,['#6a6e78','#5a5e68','#767a84'],'#3a3e46',s,true));
 cell(T.W_ROCKC,(a,b,s)=>{x.fillStyle='#8a6a58';x.fillRect(a,b,16,16);const r=mulberry32(s);for(let i=0;i<10;i++){const cc=['#a88a72','#7a5a48','#b89a80'][Math.floor(r()*3)];x.fillStyle=cc;x.fillRect(a+Math.floor(r()*13),b+Math.floor(r()*13),3,3)}});
 cell(T.WINDOW,(a,b)=>{x.fillStyle='#4a3420';x.fillRect(a,b,16,16);x.fillStyle='#2a3a58';x.fillRect(a+2,b+2,12,12);x.fillStyle='#4a5e80';x.fillRect(a+2,b+2,12,2);x.fillStyle='#4a3420';x.fillRect(a+7,b+2,2,12);x.fillRect(a+2,b+7,12,2);x.fillStyle='#6a7ea0';x.fillRect(a+3,b+3,2,2);x.fillRect(a+10,b+8,2,2)});
 cell(T.WINDOW2,(a,b)=>{x.fillStyle='#4a3420';x.fillRect(a,b,16,16);x.fillStyle='#3a2a58';x.fillRect(a+2,b+3,12,11);x.fillRect(a+4,b+1,8,3);x.fillStyle='#c84a4a';x.fillRect(a+3,b+4,4,4);x.fillStyle='#4a8ac8';x.fillRect(a+9,b+4,4,4);x.fillStyle='#e8c040';x.fillRect(a+3,b+9,4,4);x.fillStyle='#4aa860';x.fillRect(a+9,b+9,4,4)});
 cell(T.DOOR,(a,b)=>{x.fillStyle='#3a2a1c';x.fillRect(a,b,16,16);x.fillStyle='#6a4a2a';x.fillRect(a+1,b+3,14,13);x.fillRect(a+3,b+1,10,3);x.fillStyle='#4a321c';for(let i=3;i<15;i+=4)x.fillRect(a+i,b+2,1,14);x.fillStyle='#c8a84a';x.fillRect(a+11,b+9,2,2);x.fillStyle='#8a6a3a';x.fillRect(a+1,b+6,14,1);x.fillRect(a+1,b+12,14,1)});
 cell(T.ARCH,(a,b)=>{blocks(x,a,b,4,4,['#a8a296','#8a8478'],'#5a554c',77,true);x.fillStyle='#1a1410';x.fillRect(a+3,b+4,10,12);x.fillRect(a+5,b+2,6,3)});
 // tejados
 const rf=(i,base,alt,ln,fn)=>cell(i,(a,b,s)=>{x.fillStyle=base;x.fillRect(a,b,16,16);for(let yy=0;yy<16;yy+=4){for(let xx=((yy/4)&1)*3;xx<16;xx+=6){x.fillStyle=alt;x.fillRect(a+xx,b+yy,5,3);x.fillStyle=ln;x.fillRect(a+xx,b+yy+3,5,1)}}if(fn)fn(a,b,s)});
 rf(T.R_TERRA,snow?'#e4ecf0':'#b8552e',snow?'#f4f8fa':'#c8643a',snow?'#a8b8c4':'#7a3a1e');
 rf(T.R_SLATE,snow?'#dfe6ec':'#4a4e5a',snow?'#f0f4f8':'#5a5e6c',snow?'#a8b4c0':'#2e3038');
 rf(T.R_THATCH,snow?'#e8ecee':'#b8a060',snow?'#f6f8fa':'#c8b070',snow?'#b0b8bc':'#8a7640');
 rf(T.R_GOTH,snow?'#dce2e8':'#6a7078',snow?'#eef2f6':'#7a8088',snow?'#a8b0b8':'#3e4248');
 cell(T.R_TRENC,(a,b,s)=>{const r=mulberry32(s);x.fillStyle='#2a8a8a';x.fillRect(a,b,16,16);const cols=['#2a8a8a','#e8b83a','#3a6ab8','#d8503a','#6aa850','#f4f0e0'];for(let yy=0;yy<16;yy+=3)for(let xx=0;xx<16;xx+=3){x.fillStyle=cols[Math.floor(r()*cols.length)];x.fillRect(a+xx,b+yy,3,3)}});
 cell(T.R_RIDGE,(a,b)=>{x.fillStyle='#7a3a1e';x.fillRect(a,b,16,16);x.fillStyle='#b8552e';x.fillRect(a,b+4,16,8)});
 cell(T.SHADOW,(a,b)=>{x.fillStyle='rgba(0,0,0,.4)';for(let yy=0;yy<16;yy++)for(let xx=0;xx<16;xx++){const dx=(xx-7.5)/7.5,dy=(yy-7.5)/7.5;if(dx*dx+dy*dy<=1)x.fillRect(a+xx,b+yy,1,1)}});
 cell(T.BARK,(a,b,s)=>nz(x,a,b,'#5a4028',['#4a3420','#6a4c30'],s,.5));
 cell(T.PLANK,(a,b,s)=>{x.fillStyle='#8a6a3e';x.fillRect(a,b,16,16);x.fillStyle='#5a3e22';for(let i=0;i<16;i+=4)x.fillRect(a,b+i,16,1);x.fillStyle='#a8844e';x.fillRect(a,b+1,16,1)});
 cell(T.CARPET,(a,b)=>{x.fillStyle='#8a2e3a';x.fillRect(a,b,16,16);x.fillStyle='#c8a84a';x.fillRect(a+1,b+1,14,1);x.fillRect(a+1,b+14,14,1);x.fillRect(a+1,b+1,1,14);x.fillRect(a+14,b+1,1,14);x.fillStyle='#5a1e28';x.fillRect(a+4,b+4,8,8)});
 cell(T.FENCE_W,(a,b)=>nz(x,a,b,'#8a6a3e',['#6a4a2a','#a8844e'],5,.4));cell(T.FENCE_S,(a,b)=>blocks(x,a,b,5,4,['#9a968c','#8a867c'],'#5a564c',9,true));cell(T.FENCE_I,(a,b)=>{x.fillStyle='#2a2a30';x.fillRect(a,b,16,16);x.fillStyle='#5a5a66';for(let i=1;i<16;i+=3)x.fillRect(a+i,b,1,16)});
 cell(T.RING,(a,b)=>{x.fillStyle='rgba(255,230,120,.9)';for(let yy=0;yy<16;yy++)for(let xx=0;xx<16;xx++){const dx=(xx-7.5)/7.5,dy=(yy-7.5)/7.5,d=dx*dx+dy*dy;if(d<=1&&d>.55)x.fillRect(a+xx,b+yy,1,1)}});
 cell(T.ARROW,(a,b)=>{x.fillStyle='rgba(255,236,140,.95)';x.fillRect(a+6,b+2,4,8);x.fillRect(a+3,b+8,10,2);x.fillRect(a+5,b+10,6,2);x.fillRect(a+7,b+12,2,2)});
 // color medio
 const id=x.getImageData(0,0,256,256).data;for(let i=0;i<64;i++){const ox=(i%16)*16,oy=(i>>4)*16;let r=0,gg=0,bb=0;for(let yy=0;yy<16;yy+=3)for(let xx=0;xx<16;xx+=3){const p=((oy+yy)*256+ox+xx)*4;r+=id[p];gg+=id[p+1];bb+=id[p+2]}const n=36;TILE_COL[v+'_'+i]='rgb('+Math.round(r/n)+','+Math.round(gg/n)+','+Math.round(bb/n)+')'}
 return c}
const TILE_TEX={};
function tileTex(v){if(!TILE_TEX[v])TILE_TEX[v]=GL.makeTex(buildTileAtlas(v));return TILE_TEX[v]}

// ---------- árboles y vegetación ----------
function blob(ctx,cx,cy,rx,ry,col,hi,lo,snow){for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){const d=(x*x)/(rx*rx+.4)+(y*y)/(ry*ry+.4);if(d>1.05)continue;let c=col;if(d>.62&&(x+y)>0)c=lo;else if(d<.55&&(x+y)<-1)c=hi;else if(((x*7+y*13)&7)===0)c=lo;
  if(snow&&y<-ry*.25&&((x*5+y*3)&3)!==0)c='#f2f7f9';ctx.fillStyle=c;ctx.fillRect(Math.round(cx+x),Math.round(cy+y),1,1)}}
function treeCanvas(kind,v,seed){const dec=kind==='castano';const snow=v===4,win=v>=3;let w=44,h=52;
 const sz={pino:[32,52],encina:[44,48],castano:[48,56],olivo:[38,36]}[kind];w=sz[0];h=sz[1];const c=mkc(w,h),x=c.getContext('2d');const r=mulberry32(seed||7);
 const trunk=(x0,y0,x1,y1,tw,col)=>{x.fillStyle=col;for(let y=y1;y>=y0;y--){const t=(y1-y)/(y1-y0);const cx=Math.round(lerp(x0,x1,t)+Math.sin(t*5+seed)*1.2);x.fillRect(cx-Math.floor(tw*(1-t*.3)/2),y,Math.max(1,Math.round(tw*(1-t*.3))),1)}x.fillStyle=shade(col,-.3);x.fillRect(x0+Math.floor(tw/2)-1,y1-1,2,2)};
 if(kind==='pino'){const g=win?['#44603a','#587a48','#2e4a2a']:['#4a7a38','#68a04a','#2e5428'];trunk(16,22,15,h-2,4,'#6a4a30');
  [[16,14,10,7],[9,22,7,5],[23,24,7,5],[15,31,7,5],[18,8,6,4]].forEach(b=>blob(x,b[0],b[1],b[2],b[3],g[0],g[1],g[2],snow))}
 else if(kind==='encina'){const g=win?['#3a5a30','#4e7040','#243e22']:['#3c6a34','#58883f','#24462a'];trunk(22,26,22,h-2,6,'#5a4028');
  [[22,16,16,12],[10,24,9,7],[34,24,9,7],[22,28,10,6]].forEach(b=>blob(x,b[0],b[1],b[2],b[3],g[0],g[1],g[2],snow));if(v===2)for(let i=0;i<8;i++){x.fillStyle='#8a6a30';x.fillRect(8+Math.floor(r()*28),10+Math.floor(r()*18),1,1)}}
 else if(kind==='castano'){let g=v===0?['#6aa850','#8ac868','#4a8838']:v===1?['#4a8a38','#6aaa4c','#2e6a2c']:v===2?['#c8802a','#e0a040','#a8501e']:null;trunk(24,28,24,h-2,6,'#5a4030');
  if(g){[[24,18,19,14],[11,28,10,8],[37,28,10,8],[24,32,13,7]].forEach(b=>blob(x,b[0],b[1],b[2],b[3],g[0],g[1],g[2],false));if(v===0)for(let i=0;i<14;i++){x.fillStyle='#f4f0d0';x.fillRect(8+Math.floor(r()*32),8+Math.floor(r()*24),1,1)}}
  else{x.fillStyle='#4a3a2a';const br=(x0,y0,x1,y1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++)x.fillRect(Math.round(lerp(x0,x1,i/n)),Math.round(lerp(y0,y1,i/n)),2,1)};
   br(24,30,10,12);br(24,30,38,12);br(24,26,24,4);br(17,20,6,18);br(31,20,42,18);br(24,16,16,6);br(24,16,32,6);br(10,12,4,6);br(38,12,44,8);
   if(snow){x.fillStyle='#f2f7f9';for(let i=0;i<40;i++)x.fillRect(4+Math.floor(r()*40),4+Math.floor(r()*26),2,1)}}}
 else{trunk(18,16,18,h-2,6,'#6a5a48');x.fillStyle='#3a2e22';x.fillRect(17,22,1,10);const g=win?['#7a9068','#98aa82','#566a4a']:['#7e9e6a','#a8c490','#566e48'];
  [[18,12,13,8],[8,18,7,5],[28,18,7,5],[18,20,9,5]].forEach(b=>blob(x,b[0],b[1],b[2],b[3],g[0],g[1],g[2],snow));if(v===2||v===3)for(let i=0;i<8;i++){x.fillStyle='#2a2a2a';x.fillRect(6+Math.floor(r()*26),8+Math.floor(r()*14),1,1)}}
 outlineCell(x,0,0,w,h,[24,30,20]);return c}
function sapCanvas(kind,v,stage){const c=mkc(20,26),x=c.getContext('2d');const col=v===2&&kind==='castano'?'#c8802a':v>=3?'#6a8a58':'#5aa040';
 if(stage===0){x.fillStyle='#6a4a2a';x.fillRect(8,22,5,2);x.fillStyle=col;x.fillRect(10,19,1,4);x.fillRect(9,19,3,1)}
 else{const hgt=stage===1?10:18;x.fillStyle='#5a4028';x.fillRect(10,26-hgt,2,hgt);blob(x,10,26-hgt,stage===1?4:7,stage===1?3:5,col,shade(col,.2),shade(col,-.3),v===4)}
 outlineCell(x,0,0,20,26,[24,30,20]);return c}
function plantCanvas(sp,v,stage,seed){const c=mkc(20,22),x=c.getContext('2d');const r=mulberry32(seed||3);const win=v>=3,snow=v===4;
 const tuft=(cx,by,hgt,col)=>{for(let i=0;i<hgt;i++){x.fillStyle=i>hgt*.6?shade(col,.2):col;x.fillRect(cx+Math.round(Math.sin(i*.8+cx)*1),by-i,1,1)}};
 if(sp==='romero'||sp==='tomillo'){const col=sp==='romero'?'#5a7a5a':'#7a9a62';for(let i=0;i<9;i++)tuft(4+i*1.4,20,6+Math.floor(r()*6),col);if(!win&&(sp==='romero'?true:v===1)){for(let i=0;i<5;i++){x.fillStyle=sp==='romero'?'#8ab8e0':'#d8a8d8';x.fillRect(4+Math.floor(r()*12),10+Math.floor(r()*8),1,1)}}if(snow){x.fillStyle='#f2f7f9';x.fillRect(5,14,10,1)}}
 else if(sp==='zarza'){blob(x,10,15,8,5,win?'#6a6a48':'#3f7a38','#5a9a48','#2a5a2a',snow);if(v===1||v===2)for(let i=0;i<7;i++){x.fillStyle=i%2?'#3a1a3a':'#a02a4a';x.fillRect(4+Math.floor(r()*12),11+Math.floor(r()*8),2,2)}}
 else if(sp==='niscalo'||sp==='rovellon'){const cc=sp==='niscalo'?'#c8782a':'#d8a86a';[[5,17,3],[11,18,4],[8,14,3]].forEach(m=>{x.fillStyle='#e8dcc0';x.fillRect(m[0],m[1],2,5);x.fillStyle=cc;x.fillRect(m[0]-m[2]+1,m[1]-2,m[2]*2,3);x.fillStyle=shade(cc,.25);x.fillRect(m[0]-m[2]+2,m[1]-2,m[2],1)})}
 else if(sp==='hiperico'){for(let i=0;i<6;i++){tuft(4+i*2,20,8+Math.floor(r()*5),'#5a8a40')}if(v===1)for(let i=0;i<6;i++){x.fillStyle='#f4d83a';x.fillRect(3+i*2,8+Math.floor(r()*6),2,2)}}
 else if(sp==='orquidea'){tuft(10,20,10,'#4a7a40');tuft(7,20,6,'#4a7a40');x.fillStyle='#b868d8';x.fillRect(9,7,3,3);x.fillRect(7,9,2,2);x.fillRect(12,9,2,2);x.fillStyle='#f8e8ff';x.fillRect(10,8,1,1)}
 else if(sp==='trigo'){if(stage===0){x.fillStyle='#6a4a2a';x.fillRect(5,18,10,3)}else{const hgt=[0,5,10,14][stage];for(let i=0;i<7;i++){const xx=3+i*2;for(let k=0;k<hgt;k++){x.fillStyle=stage===3?(k>hgt-4?'#e8c040':'#c8a030'):'#6aa848';x.fillRect(xx+(k>hgt-3?(i%2):0),21-k,1,1)}}}}
 else if(sp==='col'||sp==='cebolla'||sp==='zanahoria'){if(stage===0){x.fillStyle='#6a4a2a';x.fillRect(5,18,10,3)}else{const n=[0,2,3,4][stage];for(let i=0;i<n;i++){blob(x,5+i*4,17-stage,3,2+stage,'#5aa848','#7ac868','#3a7a30',false);if(stage===3){x.fillStyle=['#e8782a','#d84a4a','#8a4aa8','#e8d84a'][i%4];x.fillRect(4+i*4,18,3,3)}}}}
 else if(sp==='vid'){x.fillStyle='#6a4a2a';x.fillRect(4,6,1,15);x.fillRect(15,6,1,15);x.fillStyle='#8a6a3a';x.fillRect(4,8,12,1);if(stage>=1){const lv=stage>=2?'#4a8a38':'#7ab058';for(let i=0;i<8;i++){x.fillStyle=lv;x.fillRect(5+i*1.3,8+(i%2)*3,3,3)}}if(stage===3){for(let i=0;i<6;i++){x.fillStyle=i%2?'#4a1a5a':'#6a2a7a';x.fillRect(6+i*1.6,13+(i%2)*2,2,2)}}}
 outlineCell(x,0,0,20,22,[24,30,20]);return c}

// ---------- props genéricos ----------
function propCanvas(k,var_){const c=mkc(48,48),x=c.getContext('2d');let w=16,h=16;const R=(a,b,ww,hh,col)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh)};const v=var_||0;
 const mk=(ww,hh,f)=>{w=ww;h=hh;f()};
 if(k==='rock')mk(22,16,()=>{blob(x,11,9,9,6,'#8a8a92','#aaaab2','#5a5a62',v===4)});
 else if(k==='boulder')mk(34,26,()=>{blob(x,17,15,15,10,'#8a8a92','#b0b0b8','#55555e',v===4);blob(x,24,10,8,6,'#9a9aa2','#bcbcc4','#66666e',v===4)});
 else if(k==='ore')mk(24,18,()=>{blob(x,12,10,10,7,'#6a6a72','#8a8a92','#44444c',v===4);R(7,6,2,2,'#e8a050');R(14,9,2,2,'#e8a050');R(10,12,2,1,'#f4c880');R(16,5,1,2,'#c8e8ff')});
 else if(k==='bush')mk(20,14,()=>{blob(x,10,8,8,5,v>=3?'#5a7a48':'#3f7a38','#5a9a48','#2a5a2a',v===4)});
 else if(k==='flowers')mk(14,9,()=>{for(let i=0;i<5;i++){R(2+i*2,4+(i%2)*2,1,4,'#4a8a38');R(1+i*2,3+(i%2)*2,2,2,['#f4e04a','#e86aa0','#f4f4f4','#9a6af0','#e8782a'][(i+v)%5])}});
 else if(k==='lamp')mk(12,34,()=>{R(5,10,2,22,'#2a2a30');R(3,30,6,2,'#2a2a30');R(3,4,6,7,'#3a3a40');R(4,5,4,5,'#ffe8a0');R(2,3,8,2,'#2a2a30')});
 else if(k==='barrel')mk(14,16,()=>{blob(x,7,8,6,7,'#8a5a30','#a87a48','#5a3a1c',false);R(1,4,12,1,'#4a4a50');R(1,11,12,1,'#4a4a50')});
 else if(k==='crate')mk(16,16,()=>{R(1,3,14,12,'#9a7a48');R(1,3,14,1,'#b89a60');R(1,14,14,1,'#5a3e22');R(1,3,2,12,'#7a5a30');R(13,3,2,12,'#7a5a30');R(6,7,4,1,'#5a3e22')});
 else if(k==='stall'){mk(44,38,()=>{const cols=[['#c83a3a','#f0ead8'],['#2a6ab8','#f0ead8'],['#3a8a4a','#f0ead8'],['#c8a02a','#f0ead8']][v%4];R(4,10,3,26,'#6a4a2a');R(37,10,3,26,'#6a4a2a');for(let i=0;i<9;i++)R(2+i*4.4,2,5,10,i%2?cols[1]:cols[0]);for(let i=0;i<9;i++)R(2+i*4.4,12,5,2,i%2?shade(cols[1],-.2):shade(cols[0],-.2));R(4,24,36,12,'#8a6a3e');R(4,24,36,2,'#a8844e');
   const g=['#e8782a','#d84a4a','#6aa848','#e8d84a','#8a4aa8'];for(let i=0;i<7;i++){R(6+i*5,20+(i%2),4,4,g[(i+v)%5]);R(7+i*5,20+(i%2),1,1,'#fff')}})}
 else if(k==='fountain')mk(44,34,()=>{blob(x,22,24,20,8,'#9a9aa2','#bcbcc4','#6a6a72',false);blob(x,22,23,16,6,'#4a86c8','#8ac0f0','#2e5a98',false);R(20,8,4,16,'#aaaab2');R(18,6,8,3,'#bcbcc4');R(21,2,2,6,'#aad8ff');R(17,4,1,3,'#aad8ff');R(26,4,1,3,'#aad8ff')});
 else if(k==='statue')mk(18,36,()=>{R(3,28,12,6,'#8a8a92');R(5,10,8,18,'#aaaab2');R(6,2,6,8,'#bcbcc4');R(2,12,3,10,'#aaaab2');R(13,12,3,10,'#aaaab2');R(5,10,2,18,'#c8c8d0')});
 else if(k==='well')mk(26,28,()=>{blob(x,13,20,11,6,'#9a9488','#b8b2a4','#6a655c',false);blob(x,13,19,8,4,'#1a2a3a','#2a3a4a','#0a1a2a',false);R(3,6,2,16,'#6a4a2a');R(21,6,2,16,'#6a4a2a');R(2,4,22,3,'#8a3a2a');R(12,7,1,8,'#c8b890')});
 else if(k==='cart')mk(40,26,()=>{R(4,8,30,10,'#8a6a3e');R(4,8,30,2,'#a8844e');R(34,12,6,2,'#6a4a2a');blob(x,10,20,5,5,'#5a3e22','#7a5a38','#3a2a18',false);blob(x,28,20,5,5,'#5a3e22','#7a5a38','#3a2a18',false);R(8,4,8,5,'#d8c898');R(18,5,8,4,'#a8542a')});
 else if(k==='sign')mk(14,26,()=>{R(6,10,2,14,'#6a4a2a');R(1,3,12,8,'#9a7a48');R(1,3,12,1,'#b89a60');R(3,6,8,1,'#5a3e22');R(3,8,6,1,'#5a3e22')});
 else if(k==='tent')mk(32,26,()=>{for(let i=0;i<12;i++){R(16-i*1.3,6+i,Math.round(i*2.6)+1,1,i%2?'#c8b898':'#b8a888')}R(13,18,6,8,'#3a2a1c')});
 else if(k==='haystack')mk(26,22,()=>{blob(x,13,13,11,8,'#d8b84a','#ecd270','#a8882a',false)});
 else if(k==='stump')mk(14,10,()=>{blob(x,7,6,5,3,'#8a6a3e','#a8844e','#5a3e22',v===4);R(3,6,8,3,'#5a4028')});
 else if(k==='bench')mk(24,14,()=>{R(2,5,20,3,'#8a6a3e');R(2,4,20,1,'#a8844e');R(4,8,2,5,'#5a3e22');R(18,8,2,5,'#5a3e22')});
 else if(k==='egg')mk(8,9,()=>{blob(x,4,5,3,4,'#f0ead8','#fff','#c8c0a8',false)});
 else if(k==='corpse')mk(22,10,()=>{blob(x,11,6,8,3,'#6a1a1a','#8a2a2a','#3a0a0a',false);R(6,4,2,2,'#e8e0d0');R(12,6,3,1,'#e8e0d0');R(16,5,1,3,'#e8e0d0')});
 else if(k==='campfire')mk(18,18,()=>{R(3,12,12,3,'#4a3420');R(5,11,8,2,'#6a4a2a');const f=(v%2);R(6,6-f,6,6,'#e8782a');R(7,4-f,4,5,'#f4b030');R(8,3-f,2,4,'#ffe27a')});
 else if(k==='grave')mk(14,18,()=>{R(2,4,10,14,'#9a9aa2');R(3,2,8,3,'#9a9aa2');R(5,6,4,1,'#5a5a62');R(6,5,2,5,'#5a5a62');R(0,16,14,2,'#4a7a38')});
 else if(k==='boat')mk(46,30,()=>{R(2,18,42,6,'#6a4a2a');R(4,24,38,2,'#4a3420');R(22,2,2,18,'#6a4a2a');for(let i=0;i<12;i++)R(24,3+i*0.5,Math.round(i*1.4)+2,1,'#e8e0d0')});
 else if(k==='banner')mk(12,36,()=>{R(5,2,2,32,'#4a3420');R(7,4,4,18,v%2?'#c83a3a':'#2a6ab8');R(7,22,4,2,v%2?'#8a2020':'#1a4a88');R(8,8,2,2,'#e8c040')});
 else if(k==='cross')mk(14,26,()=>{R(6,2,2,22,'#9a9aa2');R(2,8,10,2,'#9a9aa2')});
 else if(k==='stalag')mk(18,28,()=>{for(let i=0;i<26;i++){R(9-Math.round((26-i)*.3),i+1,Math.round((26-i)*.6)+1,1,i%3?'#8a8478':'#6a645a')}});
 else if(k==='arrow')mk(16,16,()=>{R(6,2,4,8,'#ffec8c');R(3,8,10,2,'#ffec8c');R(5,10,6,2,'#ffec8c');R(7,12,2,2,'#ffec8c')});
 else if(k==='exclam')mk(10,16,()=>{R(4,1,2,9,'#ffe040');R(4,12,2,2,'#ffe040');R(3,0,4,1,'#8a6a00')});
 else if(k==='pot')mk(12,14,()=>{blob(x,6,8,4,5,'#a8542a','#c8743a','#7a3a1e',false);R(3,3,6,2,'#8a4a22');R(5,0,2,4,'#3a8a38')});
 const o=mkc(w,h);o.getContext('2d').drawImage(c,0,0,w,h,0,0,w,h);outlineCell(o.getContext('2d'),0,0,w,h,[26,18,14]);return o}
function furnCanvas(k,fr){const c=mkc(32,32),x=c.getContext('2d');let w=16,h=16;const R=(a,b,ww,hh,col)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh)};const mk=(ww,hh,f)=>{w=ww;h=hh;f()};
 if(k==='furn_bed')mk(20,24,()=>{R(1,4,18,18,'#6a4a2a');R(2,6,16,14,'#e8e0d0');R(2,6,16,5,'#f4f0e8');R(2,12,16,8,'#a8423a');R(2,12,16,1,'#c85a4a');R(1,2,18,3,'#5a3e22')});
 else if(k==='furn_table')mk(18,16,()=>{R(1,3,16,5,'#9a7a48');R(1,3,16,1,'#b89a60');R(2,8,2,7,'#6a4a2a');R(14,8,2,7,'#6a4a2a');R(6,1,3,2,'#e8e0d0')});
 else if(k==='furn_chair')mk(12,16,()=>{R(2,2,8,6,'#8a6a3e');R(2,8,8,2,'#a8844e');R(2,10,2,5,'#5a3e22');R(8,10,2,5,'#5a3e22')});
 else if(k==='furn_chest')mk(16,14,()=>{R(1,3,14,10,'#7a5a30');R(1,3,14,4,'#9a7a48');R(1,7,14,1,'#3a2a18');R(7,6,2,3,'#e8c040');R(1,3,14,1,'#b89a60')});
 else if(k==='furn_shelf')mk(18,28,()=>{R(1,1,16,26,'#6a4a2a');R(2,2,14,24,'#3a2a18');for(let i=0;i<3;i++){R(2,9+i*8,14,1,'#8a6a3e');R(3,3+i*8,3,5,['#a8423a','#2a6ab8','#3a8a4a'][i]);R(7,4+i*8,3,4,['#e8c040','#8a4aa8','#c8a02a'][i]);R(11,3+i*8,3,5,['#2a8a8a','#a8423a','#e8e0d0'][i])}});
 else if(k==='furn_stove')mk(18,22,()=>{R(1,4,16,16,'#6a6a72');R(1,4,16,2,'#8a8a92');R(4,9,10,8,'#1a1410');R(5,12,8,4,fr%2?'#e8782a':'#f4b030');R(5,0,3,5,'#4a4a52');R(1,20,16,1,'#3a3a42')});
 else if(k==='furn_forge')mk(26,24,()=>{R(1,6,24,14,'#5a5a62');R(1,6,24,3,'#7a7a82');R(5,10,16,8,'#1a1410');R(6,12,14,5,fr%2?'#e8782a':'#f4a030');R(8,13,10,2,'#ffe27a');R(18,2,6,5,'#3a3a42');R(0,20,26,2,'#3a3a42')});
 else if(k==='furn_alch')mk(22,22,()=>{R(1,8,20,12,'#6a4a2a');R(1,8,20,2,'#8a6a3e');R(4,2,4,7,'#7ad8a0');R(5,1,2,2,'#c8f4d8');R(11,4,5,5,'#c85ad8');R(17,3,3,6,'#e8c040')});
 else if(k==='furn_loom')mk(26,26,()=>{R(2,2,3,22,'#6a4a2a');R(21,2,3,22,'#6a4a2a');R(2,2,22,3,'#6a4a2a');for(let i=0;i<9;i++)R(6+i*2,5,1,16,'#e8e0d0');R(5,14,16,3,'#a8423a')});
 else if(k==='furn_bench')mk(24,18,()=>{R(1,6,22,4,'#9a7a48');R(1,6,22,1,'#b89a60');R(3,10,3,7,'#5a3e22');R(18,10,3,7,'#5a3e22');R(5,2,8,4,'#c9ced6');R(16,3,4,3,'#6a4a2a')});
 else if(k==='furn_tan')mk(22,24,()=>{R(2,2,2,20,'#5a3e22');R(18,2,2,20,'#5a3e22');R(2,2,18,2,'#5a3e22');R(5,4,12,14,'#a8743a');R(6,5,10,2,'#c8945a')});
 else if(k==='furn_lamp')mk(10,28,()=>{R(4,10,2,16,'#2a2a30');R(2,3,6,7,'#3a3a40');R(3,4,4,5,'#ffe8a0');R(1,2,8,2,'#2a2a30')});
 else if(k==='furn_statue')return propCanvas('statue');else if(k==='furn_fountain')return propCanvas('fountain');
 else if(k==='furn_trough')mk(18,10,()=>{R(1,3,16,6,'#7a5a30');R(2,3,14,2,'#d8b84a');R(1,8,16,1,'#4a3420')});

 else if(k==='furn_counter')mk(32,20,()=>{R(0,4,32,14,'#7a5a30');R(0,4,32,3,'#b89a60');R(0,7,32,1,'#4a3420');for(let i=0;i<4;i++)R(2+i*8,9,6,7,'#6a4a2a');R(4,1,3,3,'#c8a84a');R(20,2,5,2,'#e8e0d0');R(26,1,3,3,'#9a3a30')});
 else if(k==='furn_barrel')mk(14,18,()=>{R(1,2,12,14,'#7a5030');R(2,1,10,2,'#9a7040');R(1,5,12,1,'#3a2a18');R(1,11,12,1,'#3a2a18');R(5,3,1,12,'#5a3a20');R(9,3,1,12,'#5a3a20')});
 else if(k==='furn_altar')mk(28,24,()=>{R(2,10,24,12,'#9a9aa2');R(2,10,24,2,'#c8c8d0');R(4,12,20,9,'#8a8a92');R(2,9,24,3,'#d8d0c0');R(2,11,24,1,'#a83a3a');R(5,3,2,7,'#e8e0d0');R(5,2,2,1,'#ffd860');R(21,3,2,7,'#e8e0d0');R(21,2,2,1,'#ffd860');R(13,1,2,9,'#c8a84a');R(10,4,8,2,'#c8a84a')});
 else if(k==='furn_pew')mk(32,16,()=>{R(0,2,32,5,'#7a5a30');R(0,2,32,1,'#9a7a48');R(0,8,32,3,'#8a6a3e');R(1,11,3,4,'#4a3420');R(28,11,3,4,'#4a3420')});
 else if(k==='furn_hearth')mk(26,26,()=>{R(1,3,24,22,'#6a6a72');R(1,3,24,3,'#8a8a92');R(5,8,16,15,'#1a1410');R(7,14,12,7,fr%2?'#e8782a':'#f4a030');R(9,16,8,4,'#ffe27a');R(5,22,16,2,'#4a4a52');R(11,0,4,4,'#4a4a52')});
 else if(k==='furn_crate')mk(14,14,()=>{R(1,1,12,12,'#8a6a3e');R(1,1,12,2,'#b89a60');R(1,6,12,1,'#5a3e22');R(1,1,1,12,'#5a3e22');R(12,1,1,12,'#5a3e22')});
 else if(k==='furn_sacks')mk(22,16,()=>{R(1,5,9,10,'#c8b484');R(2,3,7,3,'#c8b484');R(3,2,5,2,'#a89464');R(11,7,10,8,'#b8a474');R(12,5,8,3,'#b8a474');R(1,12,20,1,'#8a7a50')});
 else if(k==='furn_anvil')mk(18,14,()=>{R(2,2,14,4,'#5a5a62');R(0,3,4,2,'#5a5a62');R(2,2,14,1,'#8a8a92');R(6,6,6,4,'#44444c');R(4,10,10,3,'#3a3a42')});
 else if(k==='furn_oven')mk(26,26,()=>{R(1,6,24,18,'#8a4a32');R(1,6,24,3,'#a8603e');R(5,11,16,10,'#1a1410');R(7,14,12,5,fr%2?'#e8782a':'#f4a030');R(1,12,3,1,'#6a3a28');R(22,12,3,1,'#6a3a28');R(10,1,6,6,'#5a3a2a');R(5,24,16,1,'#4a2a1a')});
 else if(k==='furn_cauldron')mk(20,18,()=>{R(2,5,16,11,'#2a2a30');R(1,4,18,3,'#44444c');R(4,5,12,2,'#5ab86a');R(3,16,3,2,'#2a2a30');R(14,16,3,2,'#2a2a30');R(0,9,2,3,'#44444c');R(18,9,2,3,'#44444c')});
 else if(k==='furn_rack')mk(24,26,()=>{R(1,2,22,2,'#6a4a2a');R(1,12,22,2,'#6a4a2a');R(2,2,2,22,'#5a3e22');R(20,2,2,22,'#5a3e22');for(let i=0;i<4;i++){R(5+i*4,3,1,16,'#c9ced6');R(4+i*4,3,3,2,'#8a6a3e')}R(4,18,16,5,'#8a8a92')});
 else if(k==='furn_desk')mk(26,20,()=>{R(1,4,24,6,'#7a5a30');R(1,4,24,1,'#b89a60');R(2,10,3,9,'#4a3420');R(21,10,3,9,'#4a3420');R(5,1,7,4,'#efe6cf');R(15,2,4,3,'#e8e0d0');R(20,1,1,4,'#2a2a30')});
 else if(k==='furn_throne')mk(16,28,()=>{R(2,2,12,14,'#7a2a2a');R(2,2,12,2,'#c8a84a');R(1,10,14,8,'#8a3a3a');R(0,10,2,10,'#c8a84a');R(14,10,2,10,'#c8a84a');R(3,18,10,8,'#5a3e22')});
 else if(k==='furn_nets')mk(24,22,()=>{R(1,1,22,1,'#6a4a2a');for(let i=0;i<6;i++)R(2+i*4,2,1,17,'#8a9ab0');for(let j=0;j<5;j++)R(2,4+j*3,20,1,'#8a9ab0');R(4,18,4,3,'#c86a7a');R(14,19,5,2,'#9ab4d0')});
 else if(k==='furn_hay')mk(22,16,()=>{R(1,4,20,11,'#c8a84a');R(3,2,16,4,'#d8b858');for(let i=0;i<8;i++)R(2+i*2,5+i%3*3,1,6,'#a8883a')});
 else if(k==='furn_tablel')mk(32,18,()=>{R(1,3,30,5,'#9a7a48');R(1,3,30,1,'#b89a60');R(3,8,3,9,'#6a4a2a');R(26,8,3,9,'#6a4a2a');R(6,1,3,3,'#e8e0d0');R(14,1,4,3,'#c8a84a');R(23,1,3,3,'#e8e0d0')});
 else if(k==='furn_stool')mk(10,12,()=>{R(1,2,8,3,'#9a7a48');R(2,5,2,6,'#5a3e22');R(6,5,2,6,'#5a3e22')});
 else if(k==='furn_cot')mk(22,16,()=>{R(1,3,20,10,'#6a4a2a');R(2,4,18,8,'#9aa0a8');R(2,4,6,8,'#e8e0d0');R(1,12,2,3,'#4a3420');R(19,12,2,3,'#4a3420')});
 else if(k==='furn_cradle')mk(14,14,()=>{R(1,5,12,7,'#8a6a3e');R(2,6,10,4,'#e8e0d0');R(0,11,14,2,'#5a3e22')});
 else if(k==='furn_tub')mk(22,16,()=>{R(1,4,20,11,'#7a5a30');R(3,5,16,5,'#6ab0d8');R(1,4,20,1,'#b89a60')});
 else if(k==='furn_wheel')mk(20,20,()=>{R(8,0,4,20,'#5a3e22');R(0,8,20,4,'#5a3e22');R(2,2,16,16,'#7a5a30');R(5,5,10,10,'#3a2a18');R(8,8,4,4,'#9a9aa2')});
 else if(k==='furn_pots')mk(20,16,()=>{R(2,5,7,10,'#a8603e');R(2,4,7,2,'#c8805a');R(11,7,7,8,'#8a4a32');R(11,6,7,2,'#a8603e');R(4,2,3,3,'#3a8a4a')});
 else mk(16,16,()=>{R(2,2,12,12,'#8a6a3e')});
 const o=mkc(w,h);o.getContext('2d').drawImage(c,0,0,w,h,0,0,w,h);outlineCell(o.getContext('2d'),0,0,w,h,[26,18,14]);return o}

// caché de sprites (props, árboles…): devuelve {sh,w,h} con uv
const PSPR={};
function propSpr(key,v,fr){const k=key+'|'+(v||0)+'|'+(fr||0);if(PSPR[k])return PSPR[k];let cv;
 if(key.startsWith('tree_'))cv=treeCanvas(key.slice(5),v||0,hashStr(key)%97+3);
 else if(key.startsWith('sap_')){const p=key.slice(4).split('_');cv=sapCanvas(p[0],v||0,+p[1])}
 else if(key.startsWith('pl_')){const p=key.slice(3).split('_');cv=plantCanvas(p[0],v||0,+(p[1]||0),hashStr(key))}
 else if(key.startsWith('furn_'))cv=furnCanvas(key,fr||0);
 else cv=propCanvas(key,(key==='campfire'?fr:v)||0);
 const rect=GL.allocSprite(cv);const A=GL.ATL;const o={uv:[(rect.x+.02)/A,(rect.y+.02)/A,(rect.x+cv.width-.02)/A,(rect.y+cv.height-.02)/A],w:cv.width/16,h:cv.height/16,pw:cv.width,ph:cv.height};PSPR[k]=o;return o}

// ---------- iconos de objeto (UI) ----------
const ICONC={};
const ICOL={sardina:'#9ab4d0',anchoa:'#7a90a8',merluza:'#b8c0c8',dorada:'#d8c070',pulpo:'#c86a7a',trucha:'#8ab090',carne_cerdo:'#d87a7a',carne_cordero:'#c04a4a',carne_conejo:'#d8908a',carne_corzo:'#8a2a2a',carne_jabali:'#7a2a2a',carne_cabra:'#a83a3a',pollo:'#e8b890',cebolla:'#e0c8a0',col:'#7ac860',ajo:'#f0ead8',zanahoria:'#e88a2a',nabo:'#e0d0e0',habas:'#6ab050',manzana:'#d84a2a',pera:'#b8c84a',higo:'#6a3a5a',mora:'#3a2a5a',bellota:'#8a6a3a',granada:'#c02a3a',madera_pino:'#c8a468',madera_encina:'#8a6a3e',madera_castano:'#9a6a4a',madera_olivo:'#b89a5a',caliza:'#c8c4b8',conglomerado:'#a0705a',piel_conejo:'#b8a890',piel_corzo:'#a8743a',piel_jabali:'#5a4a40',piel_lobo:'#7a7a80',piel_zorro:'#c8742a',piel_cabra:'#9a8a70',piel_oveja:'#e0d8c0',piel_vibora:'#5a8a4a',piel_rata:'#6a5a50',piel_ogro:'#7a8a50',membrana:'#4a3a5a',niscalo:'#c8782a',rovellon:'#d8883a',romero_h:'#5a8a5a',tomillo_h:'#7a9a5a',salvia_h:'#8aa89a'};
function itemIcon(id,col){const key=id+(col||'');if(ICONC[key])return ICONC[key];const I=ITEMS[id]||{};const fam=famOf(id);const c=mkc(16,16),x=c.getContext('2d');const R=(a,b,w,h,cc)=>{x.fillStyle=cc;x.fillRect(a,b,w,h)};
 const vis=I.vis||{};const cc=col||vis.c||'#a0a0a8';
 if(I.slot==='main'){const k=vis.k;if(k==='bow'){for(let i=0;i<12;i++)R(4+Math.round(Math.sin(i/11*Math.PI)*4),2+i,2,1,cc);R(4,2,1,12,'#e8e0c8')}else if(k==='staff'||k==='spear'){for(let i=0;i<14;i++)R(2+i,13-i,1,1,'#6a4a2a');R(11,3,3,3,k==='staff'?'#7ad0ff':'#c9ced6')}else if(k==='axe'||k==='gaxe'||k==='hammer'||k==='mace'){for(let i=0;i<12;i++)R(3+i,12-i,1,1,'#6a4a2a');R(9,2,5,5,cc);R(9,2,5,1,shade(cc,.3))}else if(k==='crossbow'){R(2,8,12,2,'#6a4a2a');R(4,4,2,10,cc);R(10,4,2,10,cc)}else{for(let i=0;i<12;i++){R(3+i,12-i,2,1,cc)}R(2,11,5,2,'#8a7a4a');R(1,13,3,2,'#6a4a2a')}}
 else if(I.slot==='body'){R(3,3,10,11,cc);R(0,3,4,6,cc);R(12,3,4,6,cc);R(6,3,4,2,shade(cc,-.3));R(3,10,10,1,vis.c2?vis.c2.slice(0,7):shade(cc,-.3))}
 else if(I.slot==='head'){R(3,4,10,8,cc);R(2,10,12,2,shade(cc,-.2));R(5,2,6,3,cc);R(4,5,8,1,shade(cc,.3))}
 else if(I.slot==='legs'){R(3,2,10,4,cc);R(3,6,4,9,cc);R(9,6,4,9,cc)}
 else if(I.slot==='feet'){R(3,4,5,8,cc);R(3,10,10,4,cc);R(3,13,10,1,shade(cc,-.4))}
 else if(I.slot==='cloak'){R(3,2,10,12,cc);R(3,12,10,2,shade(cc,-.3));R(6,2,4,2,'#e8c040')}
 else if(I.slot==='off'){if(vis.k==='shield'){R(3,2,10,11,cc);R(5,13,6,2,cc);R(6,5,4,4,vis.c2||'#c0c0c8')}else if(vis.k==='tome'){R(3,2,10,12,cc);R(3,2,10,2,vis.c2);R(5,5,6,6,shade(cc,.3))}else if(vis.k==='lute'){R(4,7,8,7,cc);R(10,1,2,8,'#3a2a1a')}else{R(5,3,6,10,cc)}}
 else if(I.slot==='neck'||I.slot==='ring'){R(5,2,6,1,'#c8c8c8');R(4,3,1,5,'#c8c8c8');R(11,3,1,5,'#c8c8c8');R(6,8,4,4,cc);R(7,9,1,1,'#fff')}
 else if(I.cat==='potion'){R(6,2,4,3,'#c8b090');R(4,5,8,9,id==='antidoto'?'#4ac870':'#d84a5a');R(5,6,2,4,'#ffffff55');R(4,13,8,1,'#00000044')}
 else if(I.cat==='food'){if(fam==='pan'||fam==='panellets'||fam==='cocas'||fam==='dulces'){R(2,6,12,6,'#c8883a');R(3,5,10,2,'#e0a050');R(4,8,2,1,'#f0d098')}else if(fam==='pescado'){R(2,6,10,5,ICOL[id]||'#8aa8c8');R(11,5,3,7,ICOL[id]||'#8aa8c8');R(4,7,1,1,'#14100c')}else if(fam==='carne'){R(3,4,9,8,ICOL[id]||'#c84a4a');R(10,3,3,3,'#e8e0d0');R(5,6,4,2,'#e87a7a')}else if(fam==='vino'||fam==='cerveza'){R(5,2,6,3,'#7a5a3a');R(4,5,8,9,fam==='vino'?'#7a1a3a':'#d8a82a')}else if(fam==='queso'){R(2,6,12,7,'#e8c840');R(2,6,12,1,'#f4e07a');R(5,9,2,2,'#c8a020')}else if(fam==='estofado'||fam==='escudella'){R(2,7,12,6,'#5a5a62');R(3,6,10,2,'#a8542a');R(4,5,8,1,'#e8c070')}else{R(4,4,8,9,'#c8883a');R(5,5,3,2,'#e8b060')}}
 else if(I.cat==='agri'||I.cat==='herb'){if(fam==='grano'||fam==='harina'){R(4,3,8,11,fam==='harina'?'#f0ead8':'#d8b84a');R(4,3,8,2,shade(fam==='harina'?'#f0ead8':'#d8b84a',-.2))}else if(fam==='rosas'){R(7,7,2,8,'#4a8a38');R(5,3,6,5,'#d83a4a');R(7,5,2,2,'#f08a8a')}else if(fam==='setas'){R(7,8,2,5,'#e8dcc0');R(3,4,10,5,ICOL[id]||'#c8782a')}else if(fam==='uvas'||fam==='aceituna'||fam==='fruta'||fam==='verdura'){R(4,4,8,8,fam==='uvas'?'#6a2a7a':fam==='aceituna'?'#4a5a28':(ICOL[id]||'#d84a2a'));R(7,2,2,3,'#4a8a38')}else if(fam==='sal'){R(4,4,8,9,'#e8e8f0');R(5,5,3,3,'#fff')}else{for(let i=0;i<4;i++)R(3+i*3,4+i%2*2,2,10-i%2*2,'#5a8a48');R(5,12,6,2,'#6a4a2a')}}
 else if(I.cat==='raw'){if(fam==='madera'){R(2,6,12,5,ICOL[id]||'#8a6a3e');R(2,6,3,5,'#e0c890')}else if(fam==='piedra'||fam==='mineral'){R(3,6,10,7,fam==='mineral'?'#6a6a72':(ICOL[id]||'#9a9aa2'));R(4,6,4,2,'#c8c8d0');if(fam==='mineral')R(9,9,2,2,'#e8a050')}else if(fam==='lingote'){R(2,8,12,5,'#b8bcc8');R(3,7,10,2,'#e0e4f0')}else if(fam==='piel'||fam==='cuero'||id==='membrana'){R(2,3,12,10,fam==='cuero'?'#a8743a':(ICOL[id]||'#8a6a50'));R(1,5,2,3,'#8a6a50');R(13,5,2,3,'#8a6a50')}else if(fam==='lana'||fam==='tela'){R(3,4,10,9,fam==='lana'?'#f0ead8':'#5a7ab8');R(3,4,10,2,'#fff6')}else if(fam==='carbon'){R(3,6,10,7,'#2a2a30')}else if(fam==='cuerda'){R(3,3,10,10,'#c8b080');R(5,5,6,6,'#00000033')}else if(fam==='cristal'||fam==='escama'){R(6,2,4,12,fam==='cristal'?'#7ad8ff':'#3f8a4a');R(4,5,8,6,fam==='cristal'?'#aef0ff':'#6ac870')}else if(/^(colmillo|cuerno)/.test(id)){R(5,3,5,10,'#e8e0c8');R(9,3,2,3,'#e8e0c8')}else{R(4,4,8,8,'#a8a090')}}
 else if(I.cat==='seed'){R(7,8,2,6,'#4a8a38');R(4,5,4,4,'#6ac848');R(8,4,4,4,'#6ac848');R(4,13,8,2,'#6a4a2a')}
 else if(I.cat==='tool'){for(let i=0;i<12;i++)R(3+i,12-i,1,1,'#6a4a2a');R(9,2,5,3,'#b8bcc8')}
 else if(I.cat==='misc'||id==='libro_g'){R(3,2,10,12,'#7a3a2a');R(3,2,10,2,'#c8a84a');R(5,5,6,7,'#e8e0c8')}
 else{R(4,4,8,8,cc)}
 outlineCell(x,0,0,16,16,[26,18,14]);ICONC[key]=c;return c}
function iconURL(id,col){return itemIcon(id,col).toDataURL()}
