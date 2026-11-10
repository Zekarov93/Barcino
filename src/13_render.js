// ===================== RENDER: escena 3D con sprites 2D, entorno, entidades, control =====================
const R={zid:null,meshes:{},builtMesh:null,variant:0,anim:0,flash:0,keys:{},pdir:[0,1],pmov:false,pfr:0,path:null,pending:null,sel:null,prompt:null,hover:null,sheets:{},parts:null,pcSheet:null,cursor:null,modal:false,shake:0,bob:0,joy:[0,0],fallback:null};
const SC=1/16;const CRS=SC/HR;               // píxeles → unidades de mundo (props)
const CSC=1/(18*HR);              // personajes
const FLOORH=2.4,CELLH=1.2;
const WALL_T={stone:T.W_STONE,stone2:T.W_STONE2,brick:T.W_BRICK,white:T.W_WHITE,timber:T.W_TIMBER,ochre:T.W_OCHRE,trenc:T.W_TRENC,dark:T.W_DARK,rockc:T.W_ROCKC};
const ROOF_T={terra:T.R_TERRA,slate:T.R_SLATE,thatch:T.R_THATCH,goth:T.R_GOTH,trenc:T.R_TRENC};
function seasonVariant(zid){const w=G.wx[zid]||{snow:0};const s=seasonOf(dateOf(G.t).doy);return (w.snow>.45)?4:s}
function tuv(i){return tileUV(i)}
// ---------- helpers de malla ----------
function nrm(a,b,c){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let x=uy*vz-uz*vy,y=uz*vx-ux*vz,z=ux*vy-uy*vx;const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l]}
function quadUp(mb,a,b,c,d,uv,col,em){let n=nrm(a,b,c);if(n[1]<0)n=[-n[0],-n[1],-n[2]];mb.quad(a,b,c,d,uv,n,col,em)}
function wallCells(mb,x0,z0,x1,z1,yb,rows,tileOf,n,col,em){ // pared vertical dividida en celdas de 1×CELLH
 const len=Math.hypot(x1-x0,z1-z0);const cells=Math.max(1,Math.round(len));for(let i=0;i<cells;i++){const ax=x0+(x1-x0)*i/cells,az=z0+(z1-z0)*i/cells,bx=x0+(x1-x0)*(i+1)/cells,bz=z0+(z1-z0)*(i+1)/cells;
  for(let j=0;j<rows;j++){const t=tileOf(i,j,cells);if(t==null)continue;const y0=yb+j*CELLH,y1=y0+CELLH;const e=(typeof t==='object')?t.em:0;const tt=(typeof t==='object')?t.t:t;mb.quad([ax,y0,az],[bx,y0,bz],[bx,y1,bz],[ax,y1,az],tuv(tt),n,col,e)}}}
function boxTex(mb,x0,y0,z0,x1,y1,z1,tile,col,sub){const rows=sub?Math.max(1,Math.round((y1-y0)/CELLH)):1;const f=(a,b,c,d,n)=>{if(sub)wallCells(mb,a,b,c,d,y0,rows,()=>tile,n,col,0);else mb.quad([a,y0,b],[c,y0,d],[c,y1,d],[a,y1,b],tuv(tile),n,col,0)};
 f(x0,z1,x1,z1,[0,0,1]);f(x1,z1,x1,z0,[1,0,0]);f(x1,z0,x0,z0,[0,0,-1]);f(x0,z0,x0,z1,[-1,0,0]);mb.quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],tuv(tile),[0,1,0],col,0)}
function gableRoof(mb,x0,z0,w,h,yT,rh,tile,col){const o=.28;const alongX=w>=h;const X0=x0-o,X1=x0+w+o,Z0=z0-o,Z1=z0+h+o;const zc=z0+h/2,xc=x0+w/2;const tI=tuv(tile);
 const slope=(A,B,C,D,nc,ns)=>{for(let i=0;i<nc;i++)for(let j=0;j<ns;j++){const L=(p,q,u,v)=>[p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u,p[2]+(q[2]-p[2])*u];
   const p00=lerp3(lerp3(A,B,i/nc),lerp3(D,C,i/nc),j/ns),p10=lerp3(lerp3(A,B,(i+1)/nc),lerp3(D,C,(i+1)/nc),j/ns),p11=lerp3(lerp3(A,B,(i+1)/nc),lerp3(D,C,(i+1)/nc),(j+1)/ns),p01=lerp3(lerp3(A,B,i/nc),lerp3(D,C,i/nc),(j+1)/ns);quadUp(mb,p00,p10,p11,p01,tI,col,0)}};
 if(alongX){const nc=Math.ceil(X1-X0),ns=Math.max(2,Math.ceil(Math.hypot(h/2+o,rh)));
  slope([X0,yT-.1,Z1],[X1,yT-.1,Z1],[X1,yT+rh,zc],[X0,yT+rh,zc],nc,ns);slope([X0,yT-.1,Z0],[X1,yT-.1,Z0],[X1,yT+rh,zc],[X0,yT+rh,zc],nc,ns);
  const wt=tuv(tile===T.R_THATCH?T.W_TIMBER:T.W_STONE);const gw=(x)=>{mb.tri([x,yT,Z0+o],[x,yT,Z1-o],[x,yT+rh,zc],[wt[0],wt[3]],[wt[2],wt[3]],[(wt[0]+wt[2])/2,wt[1]],[x>xc?1:-1,0,0],[.85,.85,.85],0)};gw(x0);gw(x0+w)}
 else{const nc=Math.ceil(Z1-Z0),ns=Math.max(2,Math.ceil(Math.hypot(w/2+o,rh)));
  slope([X0,yT-.1,Z0],[X0,yT-.1,Z1],[xc,yT+rh,Z1],[xc,yT+rh,Z0],nc,ns);slope([X1,yT-.1,Z0],[X1,yT-.1,Z1],[xc,yT+rh,Z1],[xc,yT+rh,Z0],nc,ns);
  const wt=tuv(tile===T.R_THATCH?T.W_TIMBER:T.W_STONE);const gw=(z)=>{mb.tri([X0+o,yT,z],[X1-o,yT,z],[xc,yT+rh,z],[wt[0],wt[3]],[wt[2],wt[3]],[(wt[0]+wt[2])/2,wt[1]],[0,0,z>zc?1:-1],[.85,.85,.85],0)};gw(z0);gw(z0+h)}}
function lerp3(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
function addBuilding(mb,z,b){const x0=b.x,z0=b.y,w=b.w,h=b.h;let y0=1e9;for(let j=0;j<=h;j++)for(let i=0;i<=w;i++)y0=Math.min(y0,heightAt(z,x0+i,z0+j));y0-=.15;const fl=b.floors||1;const rows=fl*2;const wt=WALL_T[b.style]||T.W_STONE;const col=[1,1,1];
 const door=b.door;const isDoor=(i)=>i===door;
 // sur (frente, z+h)
 wallCells(mb,x0,z0+h,x0+w,z0+h,y0,rows,(i,j)=>{if(i===door&&j<2)return j===0?T.DOOR:null;if(j>=2&&(i%2===1||w<=3&&i===1)&&(j%2===1)&&b.kind!=='landmark')return{t:T.WINDOW,em:1};if(j>=2&&(i%2===1)&&j%2===0&&false)return T.WINDOW;if(j===1&&b.kind!=='tower'&&i!==door&&(i%2===1))return{t:b.kind==='temple'||b.kind==='monasterio'?T.WINDOW2:T.WINDOW,em:1};return wt},[0,0,1],col);
 if(b.w>0)mb.quad([x0+door,y0,z0+h+.01],[x0+door+1,y0,z0+h+.01],[x0+door+1,y0+FLOORH,z0+h+.01],[x0+door,y0+FLOORH,z0+h+.01],tuv(T.DOOR),[0,0,1],col,0);
 wallCells(mb,x0+w,z0+h,x0+w,z0,y0,rows,(i,j)=>(j%2===1&&i%2===1)?{t:T.WINDOW,em:1}:wt,[1,0,0],col);
 wallCells(mb,x0+w,z0,x0,z0,y0,rows,(i,j)=>(j%2===1&&i%2===1)?{t:T.WINDOW,em:1}:wt,[0,0,-1],col);
 wallCells(mb,x0,z0,x0,z0+h,y0,rows,(i,j)=>(j%2===1&&i%2===1)?{t:T.WINDOW,em:1}:wt,[-1,0,0],col);
 const yT=y0+fl*FLOORH;const rh=Math.min(2.6,Math.min(w,h)*.5+.35)*(b.kind==='tower'?1.6:1);gableRoof(mb,x0,z0,w,h,yT,rh,ROOF_T[b.roof]||T.R_TERRA,col);
 // detalles por tipo
 if(b.kind==='temple'||b.kind==='monasterio'){boxTex(mb,x0+w-1.6,yT-.1,z0+.2,x0+w-.4,yT+rh+2.4,z0+1.4,T.W_STONE,col,true);gableRoof(mb,x0+w-1.6,z0+.2,1.2,1.2,yT+rh+2.4,1.6,T.R_GOTH,col)}
 if(b.kind==='landmark'&&b.id==='aguja'){boxTex(mb,x0+1.5,yT,z0+1.5,x0+w-1.5,yT+3.2,z0+h-1.5,T.W_TRENC,col,true);gableRoof(mb,x0+1.5,z0+1.5,w-3,h-3,yT+3.2,1.6,T.R_TRENC,col)}
 // escalón/porche
 mb.quad([x0+door-.2,y0+.04,z0+h+.9],[x0+door+1.2,y0+.04,z0+h+.9],[x0+door+1.2,y0+.04,z0+h],[x0+door-.2,y0+.04,z0+h],tuv(T.FLAG),[0,1,0],col,0)}
function addCave(mb,z,b){const ex=b.entry.x,ey=b.entry.y;const y=heightAt(z,ex,ey)-.1;boxTex(mb,ex-2.2,y,ey-3.2,ex+2.2,y+3.1,ey-.8,T.ROCK,[.8,.78,.78],true);boxTex(mb,ex-3,y,ey-3.2,ex-2.2,y+2.2,ey-.6,T.MROCK,[.8,.78,.78],true);boxTex(mb,ex+2.2,y,ey-3.2,ex+3,y+2.2,ey-.6,T.MROCK,[.8,.78,.78],true);
 mb.quad([ex-1.2,y,ey-.78],[ex+1.2,y,ey-.78],[ex+1.2,y+2.4,ey-.78],[ex-1.2,y+2.4,ey-.78],tuv(T.ARCH),[0,0,1],[1,1,1],0)}
function buildZoneMeshes(zid){const z=getZone(zid);const v=seasonVariant(zid);const key=zid+'|'+v;if(R.meshes[key])return R.meshes[key];
 const ter=new MeshBuilder(),wat=new MeshBuilder(),str=new MeshBuilder();const W=z.cols,H=z.rows;const pad=z.indoor?0:14;const hm=z.hm;const hv=(i,j)=>{if(z.indoor)return 0;i=clamp(i,0,W),j=clamp(j,0,H);return hm[j*(W+1)+i]};
 const hAt=(i,j)=>z.indoor?0:(i>=0&&j>=0&&i<=W&&j<=H?heightAt(z,i,j):hv(i,j));
 const nAt=(i,j)=>{const a=hv(i-1,j),b=hv(i+1,j),c=hv(i,j-1),d=hv(i,j+1);const x=a-b,y=2,zz=c-d;const l=Math.hypot(x,y,zz);return[x/l,y/l,zz/l]};
 const bridgeAt=(x,y)=>z.bridges.some(br=>x>=br.x&&x<br.x+br.w&&y>=br.y&&y<br.y+br.h);
 for(let j=-pad;j<H+pad;j++)for(let i=-pad;i<W+pad;i++){const ci=clamp(i,0,W-1),cj=clamp(j,0,H-1);const k=cj*W+ci;let t=z.tiles[k];const inside=i>=0&&j>=0&&i<W&&j<H;const water=z.solid[k]===2||t===T.WATER;
  if(!inside&&!water&&t<=T.GF){t=z.biome==='mountain'?(((i+j)&3)?T.MROCK:T.ROCK):z.biome==='forest'?T.FOREST:z.biome==='hills'?(((i*7+j*3)&3)?T.DIRT:T.GRAVEL):z.biome==='coast'||z.biome==='river'?(((i+j)&5)?T.G0:T.G1):t}
  if(!inside&&!water&&(t===T.COBBLE||t===T.FLAG||t===T.PATH||t===T.WOODF))t=T.G0;
  if(inside&&bridgeAt(i,j)){t=T.PLANK;}
  const wt=water&&!(inside&&bridgeAt(i,j));const tt=wt?T.SAND:t;const u=tuv(tt);
  const p=[[i,j+1],[i+1,j+1],[i+1,j],[i,j]];const hs=p.map(q=>hAt(q[0],q[1]));const c=[1,1,1];
  const idx=ter.n;const uvs=[[u[0],u[3]],[u[2],u[3]],[u[2],u[1]],[u[0],u[1]]];
  for(let m=0;m<4;m++){const nn=nAt(p[m][0],p[m][1]);ter.vert(p[m][0],hs[m],p[m][1],uvs[m][0],uvs[m][1],nn[0],nn[1],nn[2],c,0)}ter.i.push(idx,idx+1,idx+2,idx,idx+2,idx+3);
  if(wt){const wu=tuv(T.WATER);const wy=-.18;wat.quad([i,wy,j+1],[i+1,wy,j+1],[i+1,wy,j],[i,wy,j],wu,[0,1,0],[1,1,1],0)}}
 // puentes: barandillas
 for(const br of z.bridges){const ax=br.axis==='x';const n=ax?br.w:br.h;for(const side of[0,1]){for(let s=0;s<n*2;s++){const t0=s/(n*2),t1=(s+1)/(n*2);const a=ax?[br.x+br.w*t0,br.y+(side?br.h-.12:.04)]:[br.x+(side?br.w-.12:.04),br.y+br.h*t0];const b=ax?[br.x+br.w*t1,a[1]]:[a[0],br.y+br.h*t1];const ha=heightAt(z,a[0],a[1])+.9,hb=heightAt(z,b[0],b[1])+.9;const th=.08;
   str.quad([a[0],ha-.25,a[1]],[b[0],hb-.25,b[1]],[b[0],hb,b[1]],[a[0],ha,a[1]],tuv(T.FENCE_W),ax?[0,0,side?1:-1]:[side?1:-1,0,0],[1,1,1],0)}}}
 // edificios y accidentes
 for(const b of z.buildings){if(b.virtual){if(b.kind==='cave')addCave(str,z,b);continue}addBuilding(str,z,b)}
 for(const w of (z.walls||[])){const S=WALLS[w.style]||WALLS.stone;for(let i=0;i<w.w;i++)for(let j=0;j<w.h;j++){const px=w.x+i,py=w.y+j;const gy=heightAt(z,px+.5,py+.5)-.25;
  if(S.post)boxTex(str,px+.06,gy,py+.06,px+.94,gy+S.ht,py+.94,T.FENCE_W,[1,1,1],true);
  else{boxTex(str,px,gy,py,px+1,gy+S.ht,py+1,T[S.tile],S.col,true);boxTex(str,px-.06,gy+S.ht,py-.06,px+1.06,gy+S.ht+.22,py+1.06,T.W_STONE2,[.8,.78,.74],false)}}}
 for(const p of z.pillars){const y=heightAt(z,p.x,p.y)-.2;const segs=4;for(let s=0;s<segs;s++){const r=p.r*(1-s*.12);const hh=p.h/segs;const sk=(s%2?.15:-.1);boxTex(str,p.x-r+sk,y+s*hh,p.y-r,p.x+r+sk,y+(s+1)*hh+.2,p.y+r,s%2?T.MROCK:T.ROCK,[.9,.85,.82],true)}}
 if(z.indoor){for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(z.solid[j*W+i]===1){const wt2=T.W_TIMBER;boxTex(str,i,0,j,i+1,z.wallH||FLOORH,j+1,wt2,[1,.95,.9],true)}}}
 const m={ter:GL.upload(ter),wat:GL.upload(wat),str:GL.upload(str),tex:tileTex(v)};R.meshes[key]=m;return m}
function invalidateMeshes(){for(const k in R.meshes){const m=R.meshes[k];GL.free(m.ter);GL.free(m.wat);GL.free(m.str)}R.meshes={}}
function buildBuiltMesh(){if(R.builtMesh){GL.free(R.builtMesh);R.builtMesh=null}const bl=G.built[G.zone]||[];if(!bl.length)return;const mb=new MeshBuilder();const z=getZone(G.zone);
 const fences=bl.filter(b=>PLACE[b.t]&&PLACE[b.t].cat==='valla');const has=(x,y)=>fences.find(f=>Math.floor(f.x)===x&&Math.floor(f.y)===y);
 for(const f of fences){const P=PLACE[f.t];const tile=P.mat==='stone'?T.FENCE_S:P.mat==='iron'?T.FENCE_I:T.FENCE_W;const x=Math.floor(f.x),y=Math.floor(f.y);const gy=heightAt(z,f.x,f.y);const th=P.mat==='stone'?.34:.2;
  boxTex(mb,f.x-th,gy,f.y-th,f.x+th,gy+P.fh+.1,f.y+th,tile,[1,1,1],false);
  const e=has(x+1,y);if(e){const gy2=heightAt(z,e.x,e.y);boxTex(mb,f.x+th,Math.min(gy,gy2),f.y-th*.6,e.x-th,Math.min(gy,gy2)+P.fh*.8,f.y+th*.6,tile,[.95,.95,.95],false)}
  const s=has(x,y+1);if(s){const gy2=heightAt(z,s.x,s.y);boxTex(mb,f.x-th*.6,Math.min(gy,gy2),f.y+th,f.x+th*.6,Math.min(gy,gy2)+P.fh*.8,s.y-th,tile,[.95,.95,.95],false)}}
 // lindes del terreno propio
 const dd=G.deeds[G.zone];if(dd&&!z.indoor){for(const k in dd){const p=dd[k];const pts=[];for(let i=0;i<=p.w;i++){pts.push([p.x+i,p.y]);pts.push([p.x+i,p.y+p.h])}for(let j=1;j<p.h;j++){pts.push([p.x,p.y+j]);pts.push([p.x+p.w,p.y+j])}
  for(const q of pts){const gy=heightAt(z,q[0],q[1]);boxTex(mb,q[0]-.05,gy,q[1]-.05,q[0]+.05,gy+.35,q[1]+.05,T.RING,[1,.85,.3],false)}}}
 if(mb.n)R.builtMesh=GL.upload(mb)}
// ---------- entorno ----------
const ENV_N={top:[.02,.03,.10],hor:[.05,.06,.14],amb:[.2,.22,.36]},ENV_D={top:[.30,.52,.88],hor:[.72,.84,.96],amb:[.62,.62,.66]};
const mixv=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const CLOUD={clear:.04,cloudy:.5,rain:.7,storm:.92,snow:.7,hail:.85,fog:.55,wind:.3,heat:0};
function updateEnv(dt){const e=GL.env;const z=getZone(G.zone);
 if(z.indoor){e.amb=[.78,.72,.64];e.sun=[.35,.3,.2];e.sunDir=[.2,.9,.3];e.moon=[0,0,0];e.moonDir=[0,1,0];e.fog=[.08,.07,.1];e.top=[.07,.06,.09];e.hor=[.08,.07,.1];e.fogN=20;e.fogF=60;e.glow=.8;e.flash=0;e.stars=0;e.cloud=0;return}
 const w=wxOf(G.zone);const el=sunLevel(G.t);const D_=dateOf(G.t);const st=sunTimes(D_.doy);
 const dayf=clamp(el*3+.25,0,1);const twi=clamp(1-Math.abs(el)*3.2,0,1)*(el>-.25?1:0);let cl=(CLOUD[w.type]||0)*(w.type==='clear'||w.type==='cloudy'?1:(.4+w.int*.6));
 let top=mixv(ENV_N.top,ENV_D.top,dayf),hor=mixv(ENV_N.hor,ENV_D.hor,dayf);hor=[hor[0]+twi*.45,hor[1]+twi*.2,hor[2]+twi*.0];top=[top[0]+twi*.12,top[1]+twi*.03,top[2]-twi*.05];
 const gray=dayf*.62+.05;top=mixv(top,[gray*.9,gray*.95,gray],cl*.8);hor=mixv(hor,[gray,gray,gray*1.02],cl*.75);
 let amb=mixv(ENV_N.amb,ENV_D.amb,dayf);amb=amb.map(v=>v*(1-cl*.22));
 const sunS=clamp(el*1.7,0,1)*(1-cl*.75);e.sun=[(1.0+twi*.15)*sunS,(.93-twi*.12)*sunS,(.78-twi*.32)*sunS];
 const t=clamp((D_.hf-st.rise)/(st.set-st.rise),0,1)*Math.PI;e.sunDir=norm3([Math.cos(t)*.9,Math.max(.12,Math.sin(t)),.38]);e.moonDir=norm3([-.5,.7,-.4]);
 const nightF=clamp(1-dayf*1.4,0,1);e.moon=[.10*nightF*(1-cl*.6),.13*nightF*(1-cl*.6),.24*nightF*(1-cl*.6)];e.amb=amb;
 e.top=top;e.hor=hor;e.cloud=cl;e.stars=clamp(1-dayf*2.2,0,1)*(1-cl);e.glow=clamp(1-dayf*1.5,0,1)*.95+(cl>.6?.1:0);e.fog=mixv(hor,[.5,.52,.56],.0);
 let fn=30,ff=85;if(w.type==='fog'){fn=4;ff=26+(1-w.int)*20}else if(w.type==='rain'){fn=18;ff=62-w.int*14}else if(w.type==='storm'){fn=14;ff=50}else if(w.type==='snow'){fn=10;ff=44-w.int*10}else if(w.type==='hail'){fn=16;ff=55}
 e.fogN=fn;e.fogF=ff;e.flash=R.flash*.55;e.sunDisk=[1,.88+.1*(1-twi),.6+.3*(1-twi)];GL.env.time=R.anim;R.flash=Math.max(0,R.flash-dt*2.6)}
function norm3(v){const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l]}
bus.on('lightning',()=>{R.flash=1;setTimeout(()=>{R.flash=Math.max(R.flash,.7)},140)});
// ---------- partículas de clima ----------
function updateParticles(dt){const w=wxOf(G.zone);const z=getZone(G.zone);if(z.indoor){R.rainL=null;R.snowP=null;R.hailP=null;return}const c=GL.cam;
 const rainish=w.type==='rain'||w.type==='storm';const N=Math.round(rainish?(w.type==='storm'?1700:700+w.int*900):w.type==='hail'?500:w.type==='snow'?900*w.int+250:0);
 if(!R.pArr||R.pArr.length<2000*3){R.pArr=new Float32Array(2000*3);R.pV=new Float32Array(2000);for(let i=0;i<2000;i++){R.pArr[i*3]=(Math.random()-.5)*34;R.pArr[i*3+1]=Math.random()*16;R.pArr[i*3+2]=(Math.random()-.5)*34;R.pV[i]=.7+Math.random()*.6}}
 const P=R.pArr,V=R.pV;const sp=rainish?22:w.type==='hail'?24:w.type==='snow'?2.2:0;const wind=(w.wind||.2)*(w.type==='storm'||w.type==='wind'?7:3);
 for(let i=0;i<N;i++){P[i*3+1]-=sp*V[i]*dt;P[i*3]+=wind*dt*(w.type==='snow'?.6+Math.sin(R.anim+i)*.3:1);P[i*3+2]+=Math.sin(R.anim*.7+i)*.2*dt;if(P[i*3+1]<0){P[i*3+1]=14+Math.random()*3;P[i*3]=(Math.random()-.5)*34;P[i*3+2]=(Math.random()-.5)*34}if(P[i*3]>17)P[i*3]-=34;if(P[i*3]<-17)P[i*3]+=34}
 R.pN=N;R.pType=rainish?'rain':w.type==='hail'?'hail':w.type==='snow'?'snow':null}
function drawWeatherParticles(){if(!R.pType||!R.pN)return;const c=GL.cam;const N=R.pN;const P=R.pArr;const gy=c.ty;const w=wxOf(G.zone);const wind=(w.wind||.2)*(R.pType==='rain'?7:3);
 if(R.pType==='rain'){const L=new Float32Array(N*6);for(let i=0;i<N;i++){const x=c.tx+P[i*3],y=gy+P[i*3+1]-1,z=c.tz+P[i*3+2];L.set([x,y,z,x-wind*.02,y+.6,z-.0],i*6)}GL.drawParticles(L,null,[.72,.78,.9,.55],1)}
 else{const Q=new Float32Array(N*3);for(let i=0;i<N;i++){Q[i*3]=c.tx+P[i*3];Q[i*3+1]=gy+P[i*3+1]-1;Q[i*3+2]=c.tz+P[i*3+2]}GL.drawParticles(null,Q,R.pType==='snow'?[1,1,1,.9]:[.85,.93,1,.9],R.pType==='snow'?3*(GL.h/700+.6):4*(GL.h/700+.6))}}
// ---------- escena, entidades ----------
function sheetOf(n){const k=n.id;const sig=JSON.stringify([n.look,Object.keys(n.eq||{}).map(s=>n.eq[s]&&n.eq[s].id+(n.eq[s].c||''))]);let s=R.sheets[k];if(!s||s.sig!==sig){s={sig,sh:charSheet(npcSprite(n))};R.sheets[k]=s}return s.sh}
function faceDir(dx,dz){const f=GL.fwd,r=GL.right;const dr=dx*r[0]+dz*r[2],df=dx*f[0]+dz*f[2];if(Math.abs(dr)>Math.abs(df)*1.05)return{row:2,flip:dr<0};return{row:df>0?1:0,flip:false}}
function charSprite(list,sh,x,y,z,dx,dz,moving,t,scale,em,tint){const fd=faceDir(dx,dz);const fr=moving?(Math.floor(t*8)%4):0;const uv=sheetUV(sh,fr,fd.row);const bob=moving?Math.abs(Math.sin(t*8))*.06:0;const sw=FW*CSC*scale,sh_=FH*CSC*scale;
 list.push({x,y:y+bob,z,w:sw,h:sh_*(moving?1:1+Math.sin(t*2.3)*.014),uv,flip:fd.flip,c:tint||[1,1,1],em:em||0})}
function groundY(z,x,y){return heightAt(z,x,y)}
function buildSprites(){const z=getZone(G.zone);const list=[],sh=[];const sUV=tuv(T.SHADOW);const v=seasonVariant(G.zone);const c=GL.cam;const near=(x,y,r)=>Math.abs(x-c.tx)<r&&Math.abs(y-c.tz)<r;const lampOn=GL.env.glow>.3;
 const shadow=(x,y,gz,w)=>sh.push({x,y:gz+.04,z:y,w:w,d:w*.55,uv:sUV,c:[0,0,0]});
 // flora silvestre
 const fl=G.flora[G.zone]||[];for(const p of fl){if(!near(p.x,p.y,42))continue;const F=FLORA[p.sp];if(!F)continue;const gy=groundY(z,p.x,p.y);let key,sc=1;
  if(F.k==='tree'){const grown=p.age>=F.mat*.55;key=grown?'tree_'+p.sp:'sap_'+p.sp+'_'+(p.age<F.mat*.25?0:1);const o=propSpr(key,v);const s=grown?(.75+Math.min(.5,p.age/(F.mat*3)))*(1+((p.id.charCodeAt(1)||0)%5)*.04):1;list.push({x:p.x,y:gy,z:p.y,w:o.w*s,h:o.h*s,uv:o.uv,flip:(p.x*7|0)%2===0});if(grown)shadow(p.x,p.y,gy,o.w*s*.7)}
  else{const stage=p.age<F.mat*.4?0:p.age<F.mat?1:2;key='pl_'+p.sp+'_'+stage;const o=propSpr(key,v);list.push({x:p.x,y:gy,z:p.y,w:o.w,h:o.h,uv:o.uv,flip:(p.id.charCodeAt(1)||0)%2===0,em:0})}}
 // decorado del bosque lejano
 for(const s of z.scen){if(!near(s.x,s.y,48))continue;const o=propSpr(s.t.startsWith('tree_')?s.t:s.t,v);const gy=groundY(z,clamp(s.x,.01,z.cols-.01),clamp(s.y,.01,z.rows-.01));list.push({x:s.x,y:gy,z:s.y,w:o.w*s.s,h:o.h*s.s,uv:o.uv,flip:((s.x*13)|0)%2===0})}
 // props del mapa
 for(const p of z.props){if(!near(p.x,p.y,40))continue;const gy=p.water?-.15:groundY(z,p.x,p.y);const o=propSpr(p.t,p.v||0,Math.floor(R.anim*4)%4);const night=lampOn&&(p.t==='lamp'||p.t==='campfire');list.push({x:p.x,y:gy,z:p.y,w:o.w,h:o.h,uv:o.uv,em:night||p.t==='campfire'?1:0,c:night?[1.2,1.1,.8]:[1,1,1]});if(!p.water&&p.t!=='flowers'&&p.t!=='banner')shadow(p.x,p.y,gy,o.w*.8)}
 // puestos
 for(const s of z.stalls){const o=propSpr('stall',0);const gy=groundY(z,s.x,s.y);list.push({x:s.x,y:gy,z:s.y,w:o.w,h:o.h,uv:o.uv})}
 // construcciones del jugador
 const bl=G.built[G.zone]||[];for(const b of bl){const P=PLACE[b.t];if(!P||P.cat==='valla')continue;const gy=groundY(z,b.x,b.y);if(P.cat==='cultivo'&&P.plot){const o=propSpr(P.spr,0);list.push({x:b.x,y:gy+.02,z:b.y,w:o.w,h:o.h,uv:o.uv});if(b.crop){const F=FLORA[b.crop.sp];const stage=b.crop.d<F.days*.35?0:b.crop.d<F.days?1:2;const o2=propSpr('pl_'+b.crop.sp+'_'+stage,v);list.push({x:b.x,y:gy+.04,z:b.y+.05,w:o2.w,h:o2.h,uv:o2.uv})}}
  else{const o=propSpr(P.spr,0,Math.floor(R.anim*3)%2);list.push({x:b.x,y:gy+(P.flat?.03:0),z:b.y,w:o.w,h:o.h,uv:o.uv,em:P.light&&lampOn?1:0});if(!P.flat)shadow(b.x,b.y,gy,o.w*.8);
   if(P.pen&&b.an)b.an.forEach((a,i)=>{const sh2=creatureSheet(a.sp,{coat:.5});const uv=sheetUV(sh2,Math.floor(R.anim*2+i)%4,0);list.push({x:b.x+(i%2?.4:-.4)+Math.sin(R.anim+i)*.1,y:gy,z:b.y+.3+(i>1?.3:0),w:sh2.fw*CRS,h:sh2.fh*CRS,uv})})}}
 // NPC
 for(const id in G.npcs){const n=G.npcs[id];if(!npcVisible(n))continue;if(!near(n.x,n.y,40))continue;const gy=groundY(z,n.x,n.y);const S=SPECIES[n.sp];const sc=S.scale||1;shadow(n.x,n.y,gy,.9);
  const em=0;charSprite(list,sheetOf(n),n.x,gy,n.y,n.dx||0,n.dy||1,n.moving,R.anim+n.id.length,sc,em);
  if(R.sel&&R.sel.npc===n){sh.push({x:n.x,y:gy+.06,z:n.y,w:1.3,d:1.3,uv:tuv(T.RING),c:[1,1,.6]})}
  if(n.exclaim)list.push({x:n.x,y:gy+FH*CSC*sc+.1+Math.sin(R.anim*4)*.08,z:n.y,w:.5,h:.5,uv:(()=>{const o=propSpr('exclam',0);return o.uv})()})}
 // fauna
 for(const a of (G.fauna[G.zone]||[])){if(a.e||!a.alive||!near(a.x,a.y,40))continue;const C=CREAT[a.sp];const sh2=creatureSheet(a.sp,a.gn);const gy=groundY(z,a.x,a.y)+(C.fly?(a.sp==='vibria'?4:1.4+Math.sin(R.anim*3+a.x)*.2):0);const sc=(.9+(a.gn.size-1)*.8)*(a.vs||1);const mv=a.mv;const dxs=a.dx||1;const fd=faceDir(dxs,a.dy||0);const fr=mv?Math.floor(R.anim*(C.fly?10:7))%4:0;
  list.push({x:a.x,y:gy,z:a.y,w:sh2.fw*CRS*sc*(C.sz>1.2?1:1),h:sh2.fh*CRS*sc,uv:sheetUV(sh2,fr,hasFB(a.sp)&&fd.row!==2?(fd.row===1?2:1):0),flip:(hasFB(a.sp)&&fd.row!==2)?false:(dxs*GL.right[0]+(a.dy||0)*GL.right[2])<0});shadow(a.x,a.y,groundY(z,a.x,a.y),sh2.fw*CRS*sc*.8)}
 sceneDraw(list,z,shadow,sh);
 // jugador
 const gy=groundY(z,G.px,G.py);const S=SPECIES[G.pc.species];shadow(G.px,G.py,gy,.9);if(!R.pcSheet)R.pcSheet=charSheet(pcSprite());charSprite(list,R.pcSheet,G.px,gy,G.py,R.pdir[0],R.pdir[1],R.pmov,R.anim,S.scale||1,0);
 if(R.sel&&R.sel.target&&R.sel.target.x!==undefined&&R.sel.type!=='npc'){const t=R.sel.target;sh.push({x:t.x,y:groundY(z,t.x,t.y)+.06,z:t.y,w:1.2,d:1.2,uv:tuv(T.RING),c:[1,1,.6]})}
 if(R.dest){sh.push({x:R.dest.x,y:groundY(z,R.dest.x,R.dest.y)+.06,z:R.dest.y,w:.9+Math.sin(R.anim*6)*.1,d:.9,uv:tuv(T.RING),c:[1,1,1]})}
 if(R.buildSel&&R.cursor){sh.push({x:R.cursor.x,y:groundY(z,R.cursor.x,R.cursor.y)+.07,z:R.cursor.y,w:1.1,d:1.1,uv:tuv(T.RING),c:[.4,1,.5]})}
 // ordenar de atrás hacia delante
 const f=GL.fwd;list.sort((a,b)=>((b.x-GL.eye[0])*f[0]+(b.z-GL.eye[2])*f[2])-((a.x-GL.eye[0])*f[0]+(a.z-GL.eye[2])*f[2]));return{list,sh}}
function drawScene(){const gl=GL.gl;const z=getZone(G.zone);if(R.zid!==G.zone){R.zid=G.zone;buildBuiltMesh();R.pcSheet=null}
 const v=seasonVariant(G.zone);if(R.lastV!==v||R.lastZ!==G.zone){R.lastV=v;R.lastZ=G.zone}
 const m=buildZoneMeshes(G.zone);GL.resize();GL.camSetup();const e=GL.env;
 gl.clearColor(e.hor[0],e.hor[1],e.hor[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(!z.indoor)GL.drawSky();
 const P=GL.prog.main;gl.useProgram(P.p);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,m.tex);gl.depthMask(true);
 GL.setMainUniforms(P,0,1,0);GL.drawMesh(m.ter);GL.drawMesh(m.str);if(R.builtMesh)GL.drawMesh(R.builtMesh);
 // agua animada
 if(m.wat.n){const fr=Math.floor(R.anim*3)%4;GL.setMainUniforms(P,0,.82,fr*16/256);GL.drawMesh(m.wat);GL.setMainUniforms(P,0,1,0)}
 const S=buildSprites();gl.depthMask(false);GL.setMainUniforms(P,0,1,0);GL.drawFlat(S.sh);gl.depthMask(true);
 gl.bindTexture(gl.TEXTURE_2D,GL.sprTex);GL.setMainUniforms(P,1,1,0);GL.drawSprites(S.list);
 drawWeatherParticles()}
// ---------- NPC y fauna en tiempo real ----------
function placeNPCs(zid){const z=getZone(zid);for(const id in G.npcs){const n=G.npcs[id];if(!n.alive||n.zone!==zid)continue;const r=npcTarget(n,G.t);n.act=r.act;const tg=r.tg;n.path=null;n.moving=false;n.think=Math.random()*2;
  if(tg.b){const b=z.buildings.find(x=>x.id===tg.b);n.hidden=true;n.loc=tg.b;n.x=b.entry.x+.5;n.y=b.entry.y+.5;n.tgKey='b:'+tg.b}
  else{const p=nearestFree(z,tg.x,tg.y);n.hidden=false;n.loc=null;n.x=p[0];n.y=p[1];n.tgKey='p:'+Math.round(tg.x)+','+Math.round(tg.y)}}}
function nearestFree(z,x,y){const xi=Math.floor(x),yi=Math.floor(y);if(tileFree(z,xi,yi))return[x,y];for(let r=1;r<6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(tileFree(z,xi+dx,yi+dy))return[xi+dx+.5,yi+dy+.5];return[z.spawn.x,z.spawn.y]}
function npcStep(n,z,dt){if(!n.path||!n.path.length){n.moving=false;return}const w=n.path[0];const dx=w.x-n.x,dy=w.y-n.y;const d=Math.hypot(dx,dy);const sp=(SPECIES[n.sp].spd||3)*.62*(n.act==='patrol'?1:1)*(n.job==='guardia'?1.1:1);const st=sp*dt;if(d<=st+.02){n.x=w.x;n.y=w.y;n.path.shift();if(!n.path.length)n.moving=false}else{n.x+=dx/d*st;n.y+=dy/d*st;n.dx=dx/d;n.dy=dy/d;n.moving=true}}
function npcTick(dt){const z=getZone(G.zone);for(const id in G.npcs){const n=G.npcs[id];if(!n.alive||n.zone!==G.zone)continue;if(n.busy)continue;n.think-=dt;
  if(n.think<=0){n.think=2+Math.random()*2;const r=npcTarget(n,G.t);const tg=r.tg;const key=tg.b?'b:'+tg.b:'p:'+Math.round(tg.x)+','+Math.round(tg.y);n.act=r.act;
   if(key!==n.tgKey){n.tgKey=key;n.dest=tg;let sx=n.x,sy=n.y;if(n.hidden){const b=z.buildings.find(x=>x.id===n.loc);if(b){sx=b.entry.x+.5;sy=b.entry.y+.5}if(!tg.b||tg.b!==n.loc){n.hidden=false;n.x=sx;n.y=sy;n.loc=null}}
    if(tg.b){const b=z.buildings.find(x=>x.id===tg.b);const p=b?findPath(z,sx,sy,b.entry.x+.5,b.entry.y+.5,1800):null;n.path=p||[];if(!p){n.hidden=true;n.loc=tg.b}}
    else{const p=findPath(z,sx,sy,tg.x,tg.y,1800);n.path=p||[]}}}
  if(!n.hidden)npcStep(n,z,dt);
  if(!n.hidden&&(!n.path||!n.path.length)&&n.dest&&n.dest.b&&!n.hidden){const b=z.buildings.find(x=>x.id===n.dest.b);if(b&&Math.hypot(n.x-(b.entry.x+.5),n.y-(b.entry.y+.5))<1.3){n.hidden=true;n.loc=b.id;n.moving=false}}}}
function faunaTick(dt){R.grace=Math.max(0,(R.grace||0)-dt);const z=getZone(G.zone);const arr=G.fauna[G.zone]||[];const sleepy=phaseOf(G.t).night;
 for(const a of arr){if(a.e||!a.alive)continue;const C=CREAT[a.sp];const dpx=G.px-a.x,dpy=G.py-a.y;const dist=Math.hypot(dpx,dpy);const spd=C.spd*a.gn.spd*.6;a.wait=(a.wait||0)-dt;
  const town=!!ZINFO[G.zone]&&!!ZINFO[G.zone].settle||z.indoor;const hostile=C.aggro>0&&(a.gn.bold+.2)*C.aggro>.25&&dist<(C.monster?7:4.5)&&R.grace<=0&&(a.lull||0)<G.t&&(C.monster||!town)&&(C.monster||C.sz>=.6)&&!G.combat&&!R.modal&&!(C.diet==='herb')&&G.pc.hp>0;
  if(hostile){a.stalk=(a.stalk||0)+dt;if(!a.warned){a.warned=1;log((a.name||C.n)+' te ha visto y se acerca con malas intenciones.','bad')}}else{a.stalk=0;if(dist>9)a.warned=0}
  const flee=!hostile&&C.flee>.3&&dist<(a.gn.bold>.6?4:6.5)&&C.diet!=='carn';
  if(hostile){a.tx=G.px;a.ty=G.py;a.run=1.35;if(dist<1.15&&a.stalk>1.2){const grp=arr.filter(b=>b.alive&&!b.e&&b.sp===a.sp&&Math.hypot(b.x-a.x,b.y-a.y)<7).slice(0,3);startCombat(grp.map(animalCombatant),{ambush:false});return}}
  else if(flee){a.tx=clamp(a.x-dpx/dist*6,1,z.cols-1);a.ty=clamp(a.y-dpy/dist*6,1,z.rows-1);a.run=1.5;a.wait=0}
  else{a.run=1;if(a.wait<=0||Math.hypot(a.tx-a.x,a.ty-a.y)<.3){a.wait=2+Math.random()*(sleepy&&C.aggro<.3?9:5);if(Math.random()<.6){const r=Math.random()*3+1,t=Math.random()*6.28;a.tx=clamp(a.x+Math.cos(t)*r,1,z.cols-1);a.ty=clamp(a.y+Math.sin(t)*r,1,z.rows-1)}else{a.tx=a.x;a.ty=a.y}}}
  const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d>.15){const st=Math.min(d,spd*a.run*dt*(C.fly?1.2:1));const nx=a.x+dx/d*st,ny=a.y+dy/d*st;if(C.fly||walkable(z,nx,ny)){a.x=nx;a.y=ny;a.dx=dx/d;a.dy=dy/d;a.mv=true}else{a.mv=false;a.tx=a.x;a.ty=a.y}}else a.mv=false}}
// ---------- jugador y control ----------
function pcSpeed(){const S=SPECIES[G.pc.species];let s=(S.spd||3)*1.05;const w=wxOf(G.zone);if(w.snow>.5)s*=.85;if(carryW(G.pc)>carryCap(G.pc)*.8)s*=.8;if(G.pc.needs&&G.pc.needs.fatigue>85)s*=.8;return s}
function tryMove(z,dx,dy){const ok=(x,y)=>fitsAt(z,x,y);let nx=G.px+dx,ny=G.py;if(ok(nx,ny))G.px=nx;nx=G.px;ny=G.py+dy;if(ok(nx,ny))G.py=ny}
function playerTick(dt){const z=getZone(G.zone);if(!fitsAt(z,G.px,G.py)){const t=safeSpot(z,G.px,G.py);G.px=t[0];G.py=t[1];R.path=null;R.dest=null}let mx=0,my=0;const K=R.keys;const up=K.w||K.arrowup,dn=K.s||K.arrowdown,lf=K.a||K.arrowleft,rt=K.d||K.arrowright;
 let f=(up?1:0)-(dn?1:0),s=(rt?1:0)-(lf?1:0);f+=-R.joy[1];s+=R.joy[0];
 if(f||s){R.path=null;R.dest=null;R.pending=null;const F=GL.fwd,Rr=GL.right;mx=F[0]*f+Rr[0]*s;my=F[2]*f+Rr[2]*s;const l=Math.hypot(mx,my);mx/=l;my/=l}
 else if(R.path&&R.path.length){const w=R.path[0];const dx=w.x-G.px,dy=w.y-G.py;const d=Math.hypot(dx,dy);if(d<.18){R.path.shift();if(!R.path.length){R.dest=null;if(R.pending){const p=R.pending;R.pending=null;doInteract(p)}}}else{mx=dx/d;my=dy/d}}
 if(mx||my){const sp=pcSpeed();const bx=G.px,by=G.py;tryMove(z,mx*sp*dt,my*sp*dt);R.pmov=Math.hypot(G.px-bx,G.py-by)>.001;if(R.pmov){R.pdir=[mx,my]}else if(R.path){R.path=null;R.dest=null;R.pending=null}}else R.pmov=false;
 // salidas
 if(!z.indoor){for(const e of z.exits){if(G.px>=e.x&&G.px<=e.x+e.w&&G.py>=e.y&&G.py<=e.y+e.h&&!R.modal){R.path=null;R.dest=null;bus.emit('exit',e);return}}}
 else{const e=z.exits[0];if(G.py>=e.y&&G.px>=e.x&&G.px<=e.x+e.w&&!R.modal){bus.emit('leaveHome');return}}
 G.px=clamp(G.px,.3,z.cols-.3);G.py=clamp(G.py,.3,z.rows-.3)}
function cameraTick(dt){const c=GL.cam;const z=getZone(G.zone);const gy=heightAt(z,G.px,G.py)+1.0;const k=Math.min(1,dt*7);let fx=G.px,fy=G.py;if(R.focus){const dx=R.focus.x-G.px,dy=R.focus.y-G.py,l=Math.hypot(dx,dy)||1,m=Math.min(l*.45,7)*R.focus.k;fx+=dx/l*m;fy+=dy/l*m}c.tx+=(fx-c.tx)*k;c.tz+=(fy-c.tz)*k;c.ty+=(gy-c.ty)*k;
 if(R.keys.q)c.yaw-=dt*1.6;if(R.keys.e)c.yaw+=dt*1.6;c.dist=clamp(c.dist,6,z.indoor?15:30);c.pitch=clamp(c.pitch,.35,1.35)}
// ---------- interacción ----------
function nearestInteract(){const z=getZone(G.zone);let best=null,bd=2.5;
 for(const id in G.npcs){const n=G.npcs[id];if(!npcVisible(n))continue;const d=Math.hypot(n.x-G.px,n.y-G.py);if(d<bd){bd=d;best={type:'npc',npc:n,target:n,label:'Hablar con '+n.name}}}
 for(const b of z.buildings){if(b.virtual||!b.entry)continue;const d=Math.hypot(b.entry.x+.5-G.px,b.entry.y+.5-G.py);if(d<bd+.2){bd=d-.2;best={type:'building',b,target:{x:b.entry.x+.5,y:b.entry.y+.5},label:'Entrar: '+b.name}}}
 for(const b of z.buildings){if(!b.virtual)continue;const d=Math.hypot(b.entry.x-G.px,b.entry.y-G.py);if(d<bd+1){bd=d-1;best={type:'place',b,target:{x:b.entry.x,y:b.entry.y},label:b.name}}}
 if(!z.indoor)for(const s of z.stalls){const d=Math.hypot(s.x-G.px,s.y+.6-G.py);if(d<bd){bd=d;best={type:'stall',stall:s,target:s,label:'Puesto de mercado'}}}
 for(const p of (G.flora[G.zone]||[])){const d=Math.hypot(p.x-G.px,p.y-G.py);if(d<Math.min(bd,1.8)){const F=FLORA[p.sp];bd=d;best={type:'flora',p,target:p,label:F.n+(p.age<F.mat?' (joven)':'')}}}
 for(const a of (G.fauna[G.zone]||[])){if(a.e||!a.alive)continue;const d=Math.hypot(a.x-G.px,a.y-G.py);if(d<Math.min(bd,2)){bd=d;best={type:'animal',a,target:a,label:'Atacar: '+CREAT[a.sp].n}}}
 for(const b of (G.built[G.zone]||[])){const P=PLACE[b.t];if(!P||P.cat==='valla')continue;const d=Math.hypot(b.x-G.px,b.y-G.py);if(d<Math.min(bd,2)){bd=d;best={type:'built',b,target:b,label:P.n}}}
 const ip=nearestIprop();if(ip&&Math.hypot(ip.p.x-G.px,ip.p.y+.4-G.py)<bd)best=ip;
 return best}
function doInteract(it){if(!it||R.modal)return;const z=getZone(G.zone);
 if(it.type==='npc'){if(Math.hypot(it.npc.x-G.px,it.npc.y-G.py)>2.8){setTargetPath(it.npc.x,it.npc.y,it);return}it.npc.busy=true;bus.emit('talk',it.npc)}
 else if(it.type==='building'){if(Math.hypot(it.target.x-G.px,it.target.y-G.py)>2.2){setTargetPath(it.target.x,it.target.y,it);return}bus.emit('building',it.b)}
 else if(it.type==='place'){if(Math.hypot(it.target.x-G.px,it.target.y-G.py)>2.6){setTargetPath(it.target.x,it.target.y,it);return}bus.emit('place',it.b)}
 else if(it.type==='stall'){if(Math.hypot(it.stall.x-G.px,it.stall.y-G.py)>2.6){setTargetPath(it.stall.x,it.stall.y+.8,it);return}bus.emit('stall',it.stall)}
 else if(it.type==='flora'){if(Math.hypot(it.p.x-G.px,it.p.y-G.py)>1.9){setTargetPath(it.p.x,it.p.y+.8,it);return}bus.emit('flora',it.p)}
 else if(it.type==='animal'){if(it.a.alive){if(Math.hypot(it.a.x-G.px,it.a.y-G.py)>1.7){setTargetPath(it.a.x,it.a.y,it);return}const grp=[it.a];startCombat(grp.map(animalCombatant),{})}}
 else if(it.type==='iprop'){if(Math.hypot(it.p.x-G.px,it.p.y+.4-G.py)>2.2){setTargetPath(it.p.x,it.p.y+1,it);return}useIprop(it.p)}
 else if(it.type==='built'){if(Math.hypot(it.b.x-G.px,it.b.y-G.py)>2){setTargetPath(it.b.x,it.b.y+.8,it);return}bus.emit('built_use',it.b)}}
function setTargetPath(x,y,pend){const z=getZone(G.zone);const p=findPath(z,G.px,G.py,x,y,2500);if(p&&p.length){R.path=p;R.dest={x,y};R.pending=pend||null}else if(pend&&Math.hypot(x-G.px,y-G.py)<4){R.pending=null;pend._force=1}}
// ---------- picking con ratón/táctil ----------
function pickAt(px,py){const z=getZone(G.zone);let best=null,bd=28;const cand=(type,obj,x,y,hh,extra)=>{const q=GL.project(x,heightAt(z,x,y)+hh,y);if(!q)return;const d=Math.hypot(q.x-px,q.y-py);if(d<bd){bd=d;best=Object.assign({type,target:{x,y}},extra)}};
 for(const id in G.npcs){const n=G.npcs[id];if(!npcVisible(n))continue;cand('npc',n,n.x,n.y,.9*(SPECIES[n.sp].scale||1),{npc:n,target:n})}
 for(const a of (G.fauna[G.zone]||[])){if(a.e||!a.alive)continue;cand('animal',a,a.x,a.y,.5,{a,target:a})}
 for(const b of z.buildings){if(!b.entry)continue;cand(b.virtual?'place':'building',b,b.entry.x+(b.virtual?0:.5),b.entry.y+(b.virtual?0:.5),.9,{b})}
 for(const s of z.stalls)cand('stall',s,s.x,s.y,.9,{stall:s,target:s});
 if(z.pub)for(const p of z.props){if(p.act)cand('iprop',p,p.x,p.y,.5,{p,target:{x:p.x,y:p.y+1}})}
 for(const p of (G.flora[G.zone]||[])){const F=FLORA[p.sp];if(F.k==='tree'&&!(F.harv||true))continue;cand('flora',p,p.x,p.y,F.k==='tree'?1.3:.3,{p,target:p})}
 for(const b of (G.built[G.zone]||[])){const P=PLACE[b.t];if(P&&P.cat!=='valla')cand('built',b,b.x,b.y,.5,{b,target:b})}
 if(best&&bd<26)return best;
 // suelo
 const r=GL.ray(px,py);let t=0,y=0;for(let i=0;i<60;i++){t+=1.2;const x=r.o[0]+r.d[0]*t,zz=r.o[2]+r.d[2]*t;y=heightAt(z,clamp(x,0,z.cols-.01),clamp(zz,0,z.rows-.01));if(r.o[1]+r.d[1]*t<y){let lo=t-1.2,hi=t;for(let k=0;k<12;k++){const m=(lo+hi)/2;const xm=r.o[0]+r.d[0]*m,zm=r.o[2]+r.d[2]*m;const ym=heightAt(z,clamp(xm,0,z.cols-.01),clamp(zm,0,z.rows-.01));if(r.o[1]+r.d[1]*m<ym)hi=m;else lo=m}const xf=r.o[0]+r.d[0]*hi,zf=r.o[2]+r.d[2]*hi;return{type:'ground',target:{x:xf,y:zf}}}}return null}
function handleClick(px,py,shift){if(R.modal)return;const hit=pickAt(px,py);if(!hit)return;R.sel=hit;if(hit.type==='ground'){const z=getZone(G.zone);const p=findPath(z,G.px,G.py,hit.target.x,hit.target.y,3000);if(p){R.path=p;R.dest=hit.target;R.pending=null}return}
 const d=Math.hypot(hit.target.x-G.px,hit.target.y-G.py);doInteract(hit);}
bus.on('endtalk',n=>{if(n&&n.met&&typeof voiceBye==='function')log(n.name+': «'+voiceBye(n)+'»','');if(n)n.busy=false;for(const id in G.npcs)G.npcs[id].busy=false});
bus.on('look',()=>{R.pcSheet=null});
bus.on('built',()=>{buildBuiltMesh()});
bus.on('zone',()=>{R.zid=null;R.grace=Math.max(R.grace||0,8);R.path=null;R.dest=null;placeNPCs(G.zone)});
bus.on('teleport',()=>{R.path=null;R.dest=null});
