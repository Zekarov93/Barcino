// ===================== FLORA PROPIA DE MONTSENY, PENEDÈS Y EGARA =====================
const W_=(id,n,v,w)=>GD(id,n,'raw',v,w||2);
[['madera_haya','Madera de haya',2],['madera_abeto','Madera de abeto',2],['madera_acebo','Madera de acebo',3],['madera_almendro','Madera de almendro',3],['madera_algarrobo','Madera de algarrobo',3],['madera_higuera','Madera de higuera',2],['madera_chopo','Madera de chopo',1]].forEach(a=>W_(a[0],a[1],a[2]));
GD('hayucos','Hayucos','agri',1,.2,{nut:9});GD('resina','Resina de abeto','raw',5,.3);GD('acebo_ramas','Ramas de acebo','raw',2,.3);GD('helecho','Helechos','herb',1,.4);GD('brezo_flor','Flor de brezo','herb',2,.2);GD('arandano','Arándanos','agri',3,.2,{nut:7});GD('trufa','Trufa negra','herb',70,.1,{rare:1,nut:3});GD('amanita','Amanita muscaria','herb',4,.2);GD('genciana','Raíz de genciana','herb',22,.3,{rare:1});
GD('almendra','Almendras','agri',2,.2,{nut:12});GD('algarroba','Algarrobas','agri',1,.3,{nut:9});GD('lavanda','Lavanda','herb',3,.2);GD('cardo','Cardo corredor','agri',2,.4,{nut:8});GD('esparrago','Espárragos silvestres','agri',3,.2,{nut:8});GD('alcaparra','Alcaparras','agri',3,.1,{nut:3});
GD('lino','Lino','raw',2,.3);GD('canamo','Cáñamo','raw',2,.4);GD('cardencha','Cardencha','raw',2,.2);GD('canya','Cañas','raw',1,.5);GD('olla_barro','Olla de barro cocido','misc',6,1.2);
GD('ceniza','Ceniza','raw',1,.4);GD('arena_silice','Arena de sílice','raw',2,1.2);GD('cuarzo','Cristal de cuarzo','raw',9,.3);GD('cera','Cera de abeja','raw',6,.3);GD('arcilla','Arcilla','raw',2,1.5);GD('mosto','Mosto de uva','food',3,1,{nut:6,drink:1});GD('ceramica_antigua','Cerámica antigua','misc',24,.6);GD('moneda_antigua','Moneda antigua','misc',35,.1);GD('agua_mineral','Agua mineral de la Font','food',4,1,{nut:0,drink:1});
Object.assign(THIRST_DR,{arandano:8,uvas:12,mosto:30,agua_mineral:50});
SD('semilla_lavanda','Semillas de lavanda','lavanda',3);SD('semilla_almendro','Almendra para plantar','almendro',5);SD('semilla_haya','Hayuco para plantar','haya',4);SD('semilla_lino','Semillas de lino','lino',2);SD('semilla_canamo','Semillas de cáñamo','canamo',2);SD('semilla_cepa','Esqueje de cepa','cepa',6);SD('semilla_higuera','Esqueje de higuera','higuera',5);SD('semilla_arandano','Esqueje de arándano','arandano',4);
SHOPS.farm.push('semilla_lavanda','semilla_lino','semilla_canamo','semilla_cepa','semilla_almendro','semilla_higuera');
['madera_haya','madera_abeto','madera_almendro','madera_algarrobo','madera_higuera','madera_chopo'].forEach(i=>FAMILY.madera.push(i));FAMILY.hierbas.push('lavanda');FAMILY.fruta.push('arandano','almendra');FAMILY.setas.push('trufa');
const _dz=(zs,o)=>Object.assign({z:zs},o);
Object.assign(FLORA,{
 haya:_dz(['montseny'],{n:'Haya',k:'tree',bi:['forest'],w:2.2,mat:30,chop:{item:'madera_haya',n:[4,6]},harv:{item:'hayucos',n:[1,3],months:[8,9,10],name:'hayucos'},seedR:3,life:5000}),
 abeto:_dz(['montseny'],{n:'Abeto blanco',k:'tree',bi:['forest'],w:1.2,mat:35,chop:{item:'madera_abeto',n:[4,7]},harv:{item:'resina',n:[1,2],months:[4,5,6,7,8],name:'resina'},seedR:3,life:5000}),
 acebo:_dz(['montseny'],{n:'Acebo',k:'tree',bi:['forest'],w:.6,mat:20,chop:{item:'madera_acebo',n:[2,3]},harv:{item:'acebo_ramas',n:[2,3],months:[10,11,0],name:'ramas de acebo'},seedR:2,life:3000}),
 helecho:_dz(['montseny','collserola'],{n:'Helecho',k:'herb',bi:['forest'],w:1.6,mat:6,harv:{item:'helecho',n:[2,4],months:[3,4,5,6,7,8,9]},seedR:3,life:900}),
 brezo:_dz(['montseny'],{n:'Brezo',k:'herb',bi:['forest'],w:1.2,mat:10,harv:{item:'brezo_flor',n:[2,3],months:[7,8,9]},seedR:3,life:1500}),
 arandano:_dz(['montseny'],{n:'Arándano',k:'herb',bi:['forest'],mat:12,harv:{item:'arandano',n:[2,5],months:[5,6,7]},seedR:3,life:1200}),
 trufa:_dz(['montseny','penedes'],{n:'Trufa negra (hongo)',k:'fungus',bi:['forest','hills'],w:.45,mat:4,harv:{item:'trufa',n:[1,1],months:[10,11,0,1]},seedR:3,life:40,kill:1,wet:1,rare:1}),
 amanita:_dz(['montseny'],{n:'Amanita muscaria (seta)',k:'fungus',bi:['forest'],mat:3,harv:{item:'amanita',n:[1,2],months:[8,9,10]},seedR:4,life:25,kill:1,wet:1}),
 genciana:_dz(['montseny'],{n:'Genciana amarilla',k:'herb',bi:['forest'],w:.5,mat:20,harv:{item:'genciana',n:[1,1],months:[6,7,8]},seedR:2,life:900,kill:1,rare:1}),
 almendro:_dz(['penedes'],{n:'Almendro',k:'tree',bi:['hills'],w:1.7,mat:15,chop:{item:'madera_almendro',n:[2,4]},harv:{item:'almendra',n:[3,6],months:[7,8,9],name:'almendras'},seedR:3,life:4000}),
 algarrobo:_dz(['penedes'],{n:'Algarrobo',k:'tree',bi:['hills'],w:1.2,mat:25,chop:{item:'madera_algarrobo',n:[3,5]},harv:{item:'algarroba',n:[3,6],months:[8,9,10],name:'algarrobas'},seedR:3,life:5000}),
 cepa:_dz(['penedes'],{n:'Cepa silvestre',k:'herb',bi:['hills'],w:2.2,mat:14,harv:{item:'uvas',n:[3,6],months:[7,8,9]},seedR:2,life:3000}),
 lavanda:_dz(['penedes'],{n:'Lavanda',k:'herb',bi:['hills'],w:1.6,mat:8,harv:{item:'lavanda',n:[2,4],months:[5,6,7]},seedR:3,life:1500}),
 cardo:_dz(['penedes','egara'],{n:'Cardo corredor',k:'herb',bi:['hills'],mat:6,harv:{item:'cardo',n:[1,3],months:[5,6,7,8]},seedR:3,life:900,kill:1}),
 esparrago:_dz(['penedes','egara'],{n:'Espárrago silvestre',k:'herb',bi:['hills'],mat:4,harv:{item:'esparrago',n:[2,4],months:[2,3,4]},seedR:3,life:700,kill:1}),
 alcaparra:_dz(['penedes'],{n:'Alcaparra',k:'herb',bi:['hills'],mat:10,harv:{item:'alcaparra',n:[2,4],months:[4,5,6,7]},seedR:2,life:1200}),
 higuera:_dz(['egara','penedes'],{n:'Higuera',k:'tree',bi:['hills'],w:1.2,mat:15,chop:{item:'madera_higuera',n:[2,3]},harv:{item:'higo',n:[3,6],months:[6,7,8],name:'higos'},seedR:3,life:4000}),
 chopo:_dz(['egara'],{n:'Chopo',k:'tree',bi:['hills'],w:1.5,mat:18,chop:{item:'madera_chopo',n:[3,5]},seedR:2,life:3500}),
 lino:_dz(['egara'],{n:'Lino',k:'herb',bi:['hills'],w:1.6,mat:10,harv:{item:'lino',n:[2,4],months:[5,6]},seedR:3,life:700,kill:1}),
 canamo:_dz(['egara'],{n:'Cáñamo',k:'herb',bi:['hills'],mat:10,harv:{item:'canamo',n:[2,4],months:[7,8]},seedR:3,life:700,kill:1}),
 cardencha:_dz(['egara'],{n:'Cardencha',k:'herb',bi:['hills'],mat:12,harv:{item:'cardencha',n:[2,3],months:[6,7,8]},seedR:3,life:900}),
 canya:_dz(['egara','montseny'],{n:'Caña común',k:'herb',bi:['hills','forest'],w:1.4,mat:8,harv:{item:'canya',n:[2,4],months:[3,4,5,6,7,8,9]},seedR:2,life:1500})});
['haya','abeto','acebo','almendro','algarrobo','higuera','chopo'].forEach(t=>TREE_SP.push(t));
// ---- sprites de árboles ----
const TREE_SPEC={
 haya:{w:46,h:56,tr:[23,26,23,54,6,'#8a8478'],bl:[[23,16,17,13],[10,26,9,8],[36,26,9,8],[23,30,12,7]],cols:[['#7ab85a','#9ad878','#5a9840'],['#4a8838','#6aa84a','#2e6a2c'],['#c06a28','#e0883a','#9a4a1c'],null],fr:{v:2,c:'#6a4020',n:7}},
 abeto:{w:30,h:58,tr:[15,40,15,56,4,'#5a4030'],bl:[[15,10,6,5],[15,17,8,6],[15,25,10,7],[15,34,12,8],[15,44,13,8]],cols:[['#2e5a3a','#3e7248','#1e3c28'],['#2e5a3a','#3e7248','#1e3c28'],['#2a523a','#3a6a48','#1a3828'],['#244a34','#346040','#183226']]},
 acebo:{w:28,h:32,tr:[14,22,14,30,3,'#5a4a3a'],bl:[[14,14,9,9],[8,20,5,5],[20,20,5,5]],cols:[['#2a5a30','#3c7a40','#1a3a22'],['#2a5a30','#3c7a40','#1a3a22'],['#2a5a30','#3c7a40','#1a3a22'],['#2a5a30','#3c7a40','#1a3a22']],fr:{v:2,c:'#d83a3a',n:9,alt:3}},
 almendro:{w:40,h:38,tr:[20,20,20,36,5,'#5a4a3a'],bl:[[20,12,14,9],[9,18,8,6],[31,18,8,6]],cols:[['#f4d8e4','#f8ecf2','#d8a8bc'],['#7a9a4a','#9ab85c','#5a7a38'],['#b0a040','#d0c060','#8a7a2a'],null]},
 algarrobo:{w:42,h:40,tr:[21,22,21,38,6,'#4a3a2a'],bl:[[21,14,16,11],[9,22,9,7],[33,22,9,7],[21,26,12,6]],cols:[['#3a5a30','#4a7a3a','#1e3a1e'],['#3a5a30','#4a7a3a','#1e3a1e'],['#3a5a30','#4a7a3a','#1e3a1e'],['#32502a','#426a34','#1a321a']],fr:{v:1,c:'#5a2e18',n:6,alt:2}},
 higuera:{w:40,h:36,tr:[20,18,20,34,5,'#8a7a68'],bl:[[20,12,14,8],[9,18,8,6],[31,18,8,6]],cols:[['#8ac860','#a8e078','#68a840'],['#5a9a40','#7aba58','#3a7a30'],['#c8b038','#e0cc58','#a08a28'],null],fr:{v:1,c:'#6a2a6a',n:5}},
 chopo:{w:22,h:60,tr:[11,30,11,58,4,'#7a6e5c'],bl:[[11,12,7,10],[11,24,8,10],[11,36,8,10]],cols:[['#9ac860','#b8e078','#78a844'],['#5a9a3a','#7aba50','#3a7a2a'],['#e0c030','#f0dc50','#c0a020'],null]}};
const _treeCanvas=treeCanvas;treeCanvas=function(kind,v,seed){const S=TREE_SPEC[kind];if(!S)return _treeCanvas(kind,v,seed);
 const c=mkc(S.w,S.h),x=c.getContext('2d');const r=mulberry32(seed||7);const snow=v===4;const si=v===4?3:Math.min(3,v);
 const trunk=(x0,y0,x1,y1,tw,col)=>{x.fillStyle=col;for(let y=y1;y>=y0;y--){const t=(y1-y)/(y1-y0);const cx=Math.round(lerp(x0,x1,t)+Math.sin(t*5+seed)*1.2);x.fillRect(cx-Math.floor(tw*(1-t*.3)/2),y,Math.max(1,Math.round(tw*(1-t*.3))),1)}x.fillStyle=shade(col,-.3);x.fillRect(x0+Math.floor(tw/2)-1,y1-1,2,2)};
 trunk(...S.tr);const g=S.cols[si];
 if(g){S.bl.forEach(b=>blob(x,b[0],b[1],b[2],b[3],g[0],g[1],g[2],snow));if(S.fr&&(v===S.fr.v||v===S.fr.alt||(S.fr.alt!=null&&si===S.fr.alt)))for(let i=0;i<S.fr.n;i++){x.fillStyle=S.fr.c;x.fillRect(Math.floor(S.w*.2+r()*S.w*.6),Math.floor(S.h*.2+r()*S.h*.35),2,2)}}
 else{x.fillStyle=shade(S.tr[5],-.15);const br=(x0,y0,x1,y1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++)x.fillRect(Math.round(lerp(x0,x1,i/n)),Math.round(lerp(y0,y1,i/n)),2,1)};
  const cx=S.tr[0],cy=S.tr[1]+2;br(cx,cy,cx-S.w*.35,cy-S.h*.28);br(cx,cy,cx+S.w*.35,cy-S.h*.28);br(cx,cy-4,cx,cy-S.h*.45);br(cx-4,cy-8,cx-S.w*.4,cy-S.h*.2);br(cx+4,cy-8,cx+S.w*.4,cy-S.h*.2);
  if(snow){x.fillStyle='#f2f7f9';for(let i=0;i<30;i++)x.fillRect(2+Math.floor(r()*(S.w-4)),4+Math.floor(r()*(S.h*.5)),2,1)}}
 outlineCell(x,0,0,S.w,S.h,[24,30,20]);return c};
// ---- sprites de plantas ----
const PLANT_DRAW=(()=>{const tuft=(x,cx,by,hg,col)=>{for(let i=0;i<hg;i++){x.fillStyle=i>hg*.6?shade(col,.2):col;x.fillRect(cx+Math.round(Math.sin(i*.8+cx)*1),by-i,1,1)}};
 const dots=(x,r,n,x0,y0,w,h,col,s)=>{x.fillStyle=col;for(let i=0;i<n;i++)x.fillRect(x0+Math.floor(r()*w),y0+Math.floor(r()*h),s||1,s||1)};
 const sc=st=>[.55,.8,1][Math.min(2,st)];const wn=v=>v>=3;
 return{
 helecho:(x,r,v,st)=>{const col=wn(v)?'#8a6a3a':'#3f7a38';const n=3+st*2;for(let i=0;i<n;i++){const a=-2.4+i*(1.5/(n-1||1))*2;const L=Math.round(10*sc(st));for(let k=0;k<L;k++){const t=k/L;x.fillStyle=k>L*.7?shade(col,.2):col;x.fillRect(10+Math.round(Math.cos(a)*k*.9),20-Math.round(Math.abs(Math.sin(a))*k*.9+t*t*4),1,1);if(k%3===0)x.fillRect(10+Math.round(Math.cos(a)*k*.9),21-Math.round(Math.abs(Math.sin(a))*k*.9+t*t*4),1,1)}}},
 brezo:(x,r,v,st)=>{for(let i=0;i<8;i++)tuft(x,4+i*1.5,20,Math.round((5+Math.floor(r()*5))*sc(st)),wn(v)?'#5a5a48':'#4a6a42');if(st>=1&&(v===1||v===2))dots(x,r,10,4,9,12,6,v===1?'#c868a8':'#a84888',1)},
 arandano:(x,r,v,st)=>{blob(x,10,15,Math.round(8*sc(st)),Math.round(5*sc(st)),wn(v)?'#6a6a48':'#3a6a38','#5a8a48','#244a24',v===4);if(st>=2&&(v===1||v===2))dots(x,r,7,5,12,10,6,'#3a4a9a',2)},
 trufa:(x,r,v,st)=>{x.fillStyle='#6a4a2a';x.fillRect(4,18,12,3);x.fillStyle='#8a6a3a';x.fillRect(6,17,8,1);x.fillStyle='#1e1a1a';x.fillRect(7,16,3,3);x.fillRect(11,17,3,2);x.fillStyle='#3a3030';x.fillRect(8,16,1,1)},
 amanita:(x,r,v,st)=>{[[5,17,3],[11,18,4],[8,14,3]].forEach(m=>{x.fillStyle='#e8dcc0';x.fillRect(m[0],m[1],2,5);x.fillStyle='#d83a2a';x.fillRect(m[0]-m[2]+1,m[1]-2,m[2]*2,3);x.fillStyle='#fff';x.fillRect(m[0]-m[2]+2,m[1]-2,1,1);x.fillRect(m[0]+1,m[1]-1,1,1)})},
 genciana:(x,r,v,st)=>{const h_=Math.round(14*sc(st));x.fillStyle='#4a7a40';x.fillRect(10,21-h_,1,h_);for(let i=0;i<3;i++){x.fillRect(6+i,18-i*2,4,1);x.fillRect(11,17-i*2,4,1)}if(st>=2&&(v===1||v===2)){for(let k=0;k<3;k++){x.fillStyle='#f4d83a';x.fillRect(8,8+k*3,5,2);x.fillStyle='#d8a820';x.fillRect(10,9+k*3,1,1)}}},
 lavanda:(x,r,v,st)=>{for(let i=0;i<7;i++){const hh=Math.round((7+Math.floor(r()*5))*sc(st));tuft(x,3+i*2,20,hh,wn(v)?'#8a8a78':'#6a8a68');if(st>=1&&(v===1||v===2)){x.fillStyle=i%2?'#a888d8':'#8868c8';x.fillRect(3+i*2,20-hh-2,1,3)}}},
 cardo:(x,r,v,st)=>{for(let i=0;i<5;i++){const a=i*1.2-2.4;for(let k=0;k<8*sc(st);k++){x.fillStyle=wn(v)?'#8a8a70':'#8aa078';x.fillRect(10+Math.round(Math.cos(a)*k*.9),19-Math.round(Math.abs(Math.sin(a))*k*.7),1,1)}}if(st>=1){x.fillStyle='#a060b8';x.fillRect(9,10,3,3);x.fillStyle='#78489a';x.fillRect(10,9,1,1)}},
 esparrago:(x,r,v,st)=>{for(let i=0;i<6;i++){const hh=Math.round((6+Math.floor(r()*7))*sc(st));x.fillStyle='#5a8a40';x.fillRect(4+i*2,21-hh,1,hh);x.fillStyle='#7ab058';x.fillRect(4+i*2,21-hh,1,2)}},
 alcaparra:(x,r,v,st)=>{blob(x,10,16,Math.round(8*sc(st)),Math.round(4*sc(st)),wn(v)?'#7a8a62':'#5a8a52','#7aaa68','#3a6a3a',v===4);if(st>=1&&(v===1||v===2))dots(x,r,5,5,12,10,4,'#f8f4f0',2)},
 lino:(x,r,v,st)=>{for(let i=0;i<8;i++){const hh=Math.round((10+Math.floor(r()*5))*sc(st));x.fillStyle=wn(v)?'#a89a68':'#6a9a50';x.fillRect(3+i*1.8,21-hh,1,hh);if(st>=1&&(v===0||v===1)){x.fillStyle='#6a98e8';x.fillRect(2+i*1.8,21-hh-1,2,2)}}},
 canamo:(x,r,v,st)=>{x.fillStyle='#5a4a30';x.fillRect(10,6,1,15);for(let i=0;i<4;i++){const y=8+i*3;x.fillStyle=wn(v)?'#7a7a50':'#3a7a30';x.fillRect(6-(i%2),y,4,1);x.fillRect(11,y+1,4+(i%2),1);x.fillRect(7,y-1,2,1);x.fillRect(12,y,2,1)}},
 cardencha:(x,r,v,st)=>{for(let i=0;i<4;i++){const hh=Math.round((12+i*2)*sc(st));x.fillStyle='#6a8a48';x.fillRect(5+i*3,21-hh,1,hh);x.fillStyle='#8a6a3a';x.fillRect(4+i*3,19-hh,3,4);x.fillStyle='#c8a860';x.fillRect(4+i*3,19-hh,1,1);x.fillRect(6+i*3,21-hh,1,1)}},
 canya:(x,r,v,st)=>{for(let i=0;i<9;i++){const hh=Math.round((11+Math.floor(r()*8))*sc(st));x.fillStyle=wn(v)?'#a89a68':'#7a9a48';x.fillRect(3+i*1.6,21-hh,1,hh);if(st>=2){x.fillStyle='#a88a58';x.fillRect(2+i*1.6,21-hh,3,3)}}},
 cepa:(x,r,v,st)=>{x.fillStyle='#6a4a2a';x.fillRect(9,10,2,11);x.fillRect(7,9,2,2);x.fillRect(11,9,2,2);const lv=wn(v)?null:v===2?'#c8982a':'#4a8a38';if(lv){blob(x,10,8,Math.round(7*sc(st)),Math.round(4*sc(st)),lv,shade(lv,.2),shade(lv,-.3),false)}if(st>=2&&(v===1||v===2)){for(let i=0;i<5;i++){x.fillStyle=i%2?'#4a1a5a':'#6a2a7a';x.fillRect(6+i*2,11+(i%2)*2,2,2)}}}}})();
const _plantCanvas2=plantCanvas;plantCanvas=function(sp,v,stage,seed){const f=PLANT_DRAW[sp];if(!f)return _plantCanvas2(sp,v,stage,seed);const c=mkc(20,22),x=c.getContext('2d');const r=mulberry32(seed||3);f(x,r,v,stage);if(v===4){x.fillStyle='#f2f7f9';x.fillRect(5,16,10,1)}outlineCell(x,0,0,20,22,[24,30,20]);return c};
// ---- recetas ----
RECIPES.push({id:'r_vidrio',n:'Soplar frascos de vidrio',tool:'smith',st:'forge',in:{arena_silice:2,carbon:1},out:['frasco_vidrio',3],dc:10,min:60,xp:15},{id:'r_copa',n:'Soplar copas de vidrio fino',tool:'smith',st:'forge',in:{arena_silice:3,cuarzo:1,carbon:1},out:['vidrio_fino',1],dc:13,min:120,xp:30},
 {id:'r_olla',n:'Modelar y cocer ollas',tool:'cook',st:'kitchen',in:{arcilla:3,carbon:1},out:['olla_barro',1],dc:9,min:90,xp:10},{id:'r_tela_lino',n:'Hilar y tejer lino',tool:'weav',st:'loom',in:{lino:3},out:['tela',1],dc:10,min:120,xp:15},{id:'r_tela_lana',n:'Tejer lana peinada',tool:'weav',st:'loom',in:{lana_peinada:2},out:['tela',2],dc:9,min:90,xp:12},{id:'r_cuerda_c',n:'Trenzar cáñamo',tool:'weav',st:'loom',in:{canamo:3},out:['cuerda',1],dc:8,min:60,xp:8});
// ---- folclore de la flora ----
LORE.push(
{id:'hayedo',z:['montseny'],sk:'nature',dc:9,t:'El hayedo del Montseny es un bosque relicto de la última glaciación: aquí la haya vive muy al sur de donde debería. En otoño se vuelve cobre y ámbar, y los hayucos alimentan a jabalíes, ciervos y garduñas. Talarlas empobrece el bosque durante generaciones.'},
{id:'trufa',z:['montseny','penedes'],sk:'nature',dc:13,t:'La trufa negra crece bajo tierra, junto a las raíces de encinas y avellanos. Sólo un perro bien enseñado —o un cerdo, aunque los payeses ya no se fían— sabe encontrarla. En invierno, un puñado vale lo que una semana de jornal.'},
{id:'genciana',z:['montseny'],sk:'nature',dc:12,t:'La raíz de genciana amarilla se desentierra en verano en los prados altos. Es amarga como pocas, y los boticarios la usan para abrir el apetito y levantar el ánimo. Es rara porque tarda años en florecer.'},
{id:'lavanda',z:['penedes','garraf'],sk:'nature',dc:8,t:'La lavanda del Penedès florece a principios del verano, y los apicultores colocan sus colmenas entre los matorrales. Seca, se guarda entre la ropa para espantar polillas; en infusión, aquieta a los nerviosos.'},
{id:'almendros',z:['penedes','martorell'],sk:'nature',dc:8,t:'Los almendros del Penedès florecen en febrero, antes que ningún otro árbol. Si hiela esa noche, pierden la cosecha: por eso los payeses encienden hogueras de sarmientos entre las filas.'},
{id:'lino_egara',z:['egara'],sk:'hist',dc:9,t:'En Egara se cultivó lino y cáñamo mucho antes de la lana. Se enriaba en los remansos del torrente —con un olor que aleja a los visitantes— y las tejedoras lo hilan en invierno, junto al fuego.'},
{id:'cardencha_e',z:['egara'],sk:'nature',dc:9,t:'La cardencha es el cardo de los pelaires: sus cabezuelas espinosas se montan en tableros y se pasan sobre el paño para levantar el pelo. Ninguna herramienta de hierro lo hace con tanta suavidad.'});
