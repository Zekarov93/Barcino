// ===================== ZONAS: mapas, alturas, colisiones, rutas =====================
const ZINFO={
 barcino:{n:'Barcino',biome:'coast',settle:'city',wall:{style:'stone',skip:['E']},cols:48,rows:44,amp:.25,desc:'La gran ciudad amurallada junto al mar: la Rambla, el Barri Gòtic y el Port Vell.'},
 collserola:{n:'Bosque de Collserola',biome:'forest',cols:44,rows:44,amp:1.1,desc:'Un bosque viejo sobre la ciudad, lleno de pinos, encinas y secretos.'},
 martorell:{n:'Martorell y el Puente del Diablo',biome:'river',settle:'town',wall:{style:'stone2'},cols:44,rows:40,amp:.35,desc:'Villa fluvial del Llobregat, famosa por su puente de leyenda.'},
 collbato:{n:'Collbató',biome:'hills',settle:'town',wall:{style:'pal'},cols:44,rows:44,amp:1.3,desc:'Pueblo palizado de colinas áridas; las canteras y las cuevas quedan fuera, camino adelante.'},
 montserrat:{n:'Monasterio de Montserrat',biome:'mountain',settle:'town',wall:{style:'stone'},cols:44,rows:44,amp:1.9,desc:'El monasterio fortificado donde vive la Moreneta, protegido tras sus muros de la montaña salvaje.'}
};
const ZIDS=Object.keys(ZINFO);
const TRAVEL={};  // adyacencia entre mapas (sin viaje rápido: se cruza andando)
const ZONE_BUILD={};const ZCACHE={};
const ROADT=new Set([T.COBBLE,T.FLAG,T.PATH,T.WOODF,T.GRAVEL]);
function ZI(z,x,y){return y*z.cols+x}
function inZ(z,x,y){return x>=0&&y>=0&&x<z.cols&&y<z.rows}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const h=(a,b)=>{let n=Math.imul(a*374761+b*668265+s*127413,1274126177);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return lerp(lerp(h(xi,yi),h(xi+1,yi),u),lerp(h(xi,yi+1),h(xi+1,yi+1),u),v)}
function newZone(id){const I=ZINFO[id];const z={id,name:I.n,biome:I.biome,cols:I.cols,rows:I.rows,amp:I.amp,tiles:new Uint8Array(I.cols*I.rows).fill(T.G0),solid:new Uint8Array(I.cols*I.rows),occ:new Uint8Array(I.cols*I.rows),flat:new Float32Array(I.cols*I.rows),
 buildings:[],props:[],exits:[],plots:[],bridges:[],stalls:[],scen:[],pillars:[],nodes:[],spots:{},seed:hashStr(id)%1000};return z}
function fillR(z,x,y,w,h,t,flat){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(inZ(z,i,j)){const k=ZI(z,i,j);z.tiles[k]=t;if(flat)z.flat[k]=1}}
function floorR(z,x,y,w,h,t){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(inZ(z,i,j)){const k=ZI(z,i,j);z.tiles[k]=t;z.solid[k]=0;z.flat[k]=1}}
function waterR(z,x,y,w,h){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(inZ(z,i,j)){const k=ZI(z,i,j);z.tiles[k]=T.WATER;z.solid[k]=2}}
function roadPoly(z,pts,w,t){for(let s=0;s<pts.length-1;s++){const[a,b]=[pts[s],pts[s+1]];const n=Math.ceil(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1])))*2+1;for(let i=0;i<=n;i++){const px=lerp(a[0],b[0],i/n),py=lerp(a[1],b[1],i/n);for(let jj=0;jj<w;jj++)for(let ii=0;ii<w;ii++){const x=Math.floor(px-w/2+.5)+ii,y=Math.floor(py-w/2+.5)+jj;if(inZ(z,x,y)){const k=ZI(z,x,y);if(z.solid[k]===2)continue;z.tiles[k]=t;z.flat[k]=Math.max(z.flat[k],t===T.PATH?.7:1)}}}}}
function autoPath(z,x,y){for(let i=0;i<14;i++){const yy=y+i;if(!inZ(z,x,yy))return;const k=ZI(z,x,yy);if(z.solid[k]===1)return;if(i>0&&ROADT.has(z.tiles[k])&&z.tiles[k]!==T.WOODF)return;if(z.solid[k]===2)return;z.tiles[k]=T.PATH;z.flat[k]=1}}
function bld(z,o){const b=Object.assign({floors:1,style:'stone',roof:'terra',door:Math.floor((o.w||2)/2),virtual:false},o);b.zone=z.id;
 if(!b.virtual&&b.w>0){b.entry={x:b.x+b.door,y:b.y+b.h};for(let j=b.y;j<b.y+b.h;j++)for(let i=b.x;i<b.x+b.w;i++){if(!inZ(z,i,j))continue;const k=ZI(z,i,j);if(z.solid[k]===1)console.warn('solape edificio',b.id);z.solid[k]=1;z.flat[k]=1}
  for(let j=b.y-1;j<=b.y+b.h;j++)for(let i=b.x-1;i<=b.x+b.w;i++)if(inZ(z,i,j))z.flat[ZI(z,i,j)]=Math.max(z.flat[ZI(z,i,j)],.9);
  if(b.kind!=='landmark')autoPath(z,b.entry.x,b.entry.y)}
 else b.entry={x:b.ex,y:b.ey};
 z.buildings.push(b);return b}
function prop(z,t,x,y,o){const p=Object.assign({t,x,y,v:0},o||{});z.props.push(p);if(p.solid){const k=ZI(z,Math.floor(x),Math.floor(y));if(inZ(z,Math.floor(x),Math.floor(y)))z.solid[k]=Math.max(z.solid[k],1)}return p}
function exitR(z,x,y,w,h,to,ax,ay){z.exits.push({x,y,w,h,to,ax,ay})}
function plot(z,id,x,y,w,h,price,name,req){z.plots.push({id,zone:z.id,x,y,w,h,price,name,req:req||0})}
function stall(z,id,x,y){z.stalls.push({id,x,y})}
function pillar(z,x,y,h,r){z.pillars.push({x,y,h,r})}

// ---------- BARCINO ----------
ZONE_BUILD.barcino=function(z){
 waterR(z,41,0,7,44);fillR(z,39,0,2,44,T.SAND);floorR(z,40,34,7,2,T.WOODF);floorR(z,40,22,5,1,T.WOODF);
 floorR(z,22,0,4,41,T.COBBLE);floorR(z,23,0,2,41,T.FLAG);
 floorR(z,0,13,40,1,T.COBBLE);floorR(z,0,26,40,2,T.COBBLE);floorR(z,0,37,40,2,T.COBBLE);floorR(z,33,6,1,34,T.COBBLE);
 floorR(z,17,14,12,6,T.FLAG);floorR(z,30,14,9,5,T.FLAG);floorR(z,26,20,7,6,T.FLAG);
 bld(z,{id:'ayuntamiento',name:'Casa de la Ciutat',kind:'ayuntamiento',x:14,y:6,w:7,h:6,door:3,style:'stone',roof:'goth',floors:3,fac:'concejo'});
 bld(z,{id:'colegio',name:'Colegio de Arcanos',kind:'library',x:3,y:7,w:6,h:5,door:2,style:'dark',roof:'goth',floors:3});
 bld(z,{id:'llotja',name:'La Llotja de Mercaderes',kind:'llotja',x:27,y:6,w:6,h:6,door:2,style:'ochre',roof:'terra',floors:2,fac:'mercaderes',shop:'general'});
 bld(z,{id:'catedral',name:'Catedral del Mar',kind:'temple',x:35,y:5,w:5,h:8,door:2,style:'stone',roof:'goth',floors:4,tall:1});
 bld(z,{id:'aguja',name:'La Aguja Sagrada',kind:'landmark',x:29,y:0,w:5,h:5,style:'trenc',roof:'trenc',floors:6,tall:2});
 bld(z,{id:'herreria',name:'Ferrería del Raval',kind:'smith',x:3,y:21,w:5,h:5,door:2,style:'brick',roof:'slate',floors:2,shop:'smith',fac:'artesanos',st:['forge']});
 bld(z,{id:'taberna_raval',name:'Taberna del Raval',kind:'inn',x:13,y:21,w:5,h:5,door:2,style:'timber',roof:'terra',floors:2,fac:'sombra',shop:'inn',rent:6});
 bld(z,{id:'forn',name:'Forn de la Rambla',kind:'bakery',x:19,y:21,w:3,h:4,door:1,style:'white',roof:'terra',floors:1,prod:'bakery',shop:'bread',st:['kitchen']});
 bld(z,{id:'botica',name:'Herbolario de Sant Pau',kind:'apothecary',x:34,y:21,w:5,h:5,door:2,style:'white',roof:'terra',floors:2,shop:'apo',st:['alchemy']});
 bld(z,{id:'casa_dragon',name:'Posada de la Casa del Dragón',kind:'inn',x:8,y:14,w:6,h:5,door:3,style:'trenc',roof:'trenc',floors:3,shop:'inn',rent:12});
 bld(z,{id:'cuartel',name:'Cuartel de la Guardia',kind:'barracks',x:34,y:28,w:5,h:4,door:0,style:'dark',roof:'slate',floors:2,fac:'concejo'});
 bld(z,{id:'lonja',name:'Lonja del Pescado',kind:'port',x:35,y:33,w:4,h:4,door:2,style:'timber',roof:'slate',floors:1,prod:'fisher',shop:'fish'});
 bld(z,{id:'casa1',name:'Casa del Carrer Ferran',kind:'house',x:3,y:33,w:4,h:4,door:1,style:'ochre',roof:'terra'});
 bld(z,{id:'casa2',name:'Casa del Carrer Montcada',kind:'house',x:8,y:33,w:4,h:4,door:1,style:'white',roof:'terra'});
 bld(z,{id:'casa3',name:'Casa del Call',kind:'house',x:13,y:33,w:4,h:4,door:1,style:'stone',roof:'slate',forSale:650,floors:2});
 bld(z,{id:'casa4',name:'Casa del Carrer Argenteria',kind:'house',x:18,y:33,w:3,h:4,door:1,style:'brick',roof:'terra'});
 bld(z,{id:'torre_gracia',name:'Torre de Gràcia',kind:'house',x:27,y:32,w:5,h:5,door:2,style:'white',roof:'terra',forSale:1100,floors:2});
 plot(z,'barcino_p1',2,1,7,5,800,'Solar del Carrer del Bisbe',2);
 for(let i=0;i<6;i++)stall(z,'st'+i,[27.5,30.5,27.5,30.5,19.5,28][i],[21.5,21.5,24.5,24.5,17.5,17.5][i]);
 // gentío visual y decoración
 for(const y of[4,10,18,24,30,36]){prop(z,'lamp',21.5,y+.5);prop(z,'lamp',26.5,y+.5)}
 for(const[x,y]of[[21,8],[26,8],[21,16],[26,16],[21,31],[26,31]])z.props.push({t:'tree_encina',x:x+.5,y:y+.5,v:0,solid:0,deco:1,scale:.8});
 prop(z,'fountain',24,17,{solid:1,deco:1});z.solid[ZI(z,23,17)]=1;z.solid[ZI(z,24,17)]=1;
 [[12,25],[18,25],[2,25],[38,25],[34,36],[33,38]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));
 [[39,34],[38,37],[40,36]].forEach(p=>prop(z,'crate',p[0]+.5,p[1]+.5,{solid:1}));
 [[44,12],[45,28],[44,40],[43,5]].forEach(p=>prop(z,'boat',p[0],p[1],{deco:1,water:1}));
 [[18,15],[28,15],[31,15],[37,15]].forEach((p,i)=>prop(z,'banner',p[0]+.5,p[1]+.5,{v:i}));
 prop(z,'statue',24.5,12.5,{solid:1});prop(z,'well',11.5,29.5,{solid:1});prop(z,'bench',20.5,17.5,{});prop(z,'bench',27.5,17.5,{});
 for(let i=0;i<14;i++)prop(z,'flowers',[5,9,16,32,36,30,6,12,20,37,2,15,31,28][i]+.5,[3,5,31,9,31,2,18,29,43,30,29,40,14,42][i]+.5,{v:i});
 exitR(z,22,0,4,1,'collserola',23.5,41);exitR(z,0,26,1,2,'vega',41,19.5);exitR(z,22,43,4,1,'marjal',23.5,2.5);
 z.arrive={collserola:{x:23.5,y:2.5},vega:{x:2,y:27},marjal:{x:23.5,y:41.5}};z.spawn={x:23.5,y:30};
 z.spots={plaza:{x:23,y:15.5},market:{x:29,y:22.5},port:{x:38,y:33},gate_n:{x:23.5,y:3},gate_w:{x:2,y:27},patrol:[[23,5],[23,16],[23,28],[30,27],[14,27],[23,38]],beggar:[[21,18],[37,14]]};
 z.sea=1;
};
// ---------- COLLSERROLA ----------
ZONE_BUILD.collserola=function(z){
 roadPoly(z,[[21.5,43],[21.5,34],[22,26],[22,22]],2,T.PATH);roadPoly(z,[[22,26],[10,24],[0,23]],2,T.PATH);roadPoly(z,[[22,22],[28,14],[31,10]],2,T.PATH);
 roadPoly(z,[[22,30],[33,32]],2,T.PATH);roadPoly(z,[[21,36],[9,38]],2,T.PATH);roadPoly(z,[[22,26],[13,30]],2,T.PATH);roadPoly(z,[[22,22],[16,14]],2,T.PATH);
 fillR(z,17,17,10,9,T.G0,true);
 bld(z,{id:'torre_vientos',name:'Torre de los Vientos',kind:'tower',x:30,y:7,w:3,h:3,door:1,style:'dark',roof:'goth',floors:10,tall:2});
 bld(z,{id:'ermita_medir',name:'Ermita de Sant Medir',kind:'chapel',x:12,y:27,w:3,h:3,door:1,style:'stone',roof:'terra',floors:1});
 bld(z,{id:'granja_rierada',name:'Masía de la Rierada',kind:'farm',x:6,y:34,w:5,h:4,door:2,style:'ochre',roof:'terra',prod:'farm',floors:2,shop:'farm'});
 bld(z,{id:'aserradero',name:'Aserradero de Can Mestres',kind:'lumber',x:32,y:28,w:5,h:4,door:2,style:'timber',roof:'thatch',prod:'lumber',floors:1});
 bld(z,{id:'cabana_caza',name:'Cabaña de caza',kind:'hunter',x:14,y:12,w:4,h:3,door:1,style:'timber',roof:'thatch',prod:'hunter',floors:1});
 bld(z,{id:'claro',name:'Claro del Círculo',kind:'claro',virtual:true,ex:22,ey:21.5,w:0,h:0,fac:'circulo'});
 bld(z,{id:'cueva_hermitano',name:'Cueva del ermitaño',kind:'cave',virtual:true,ex:8,ey:11,w:0,h:0});
 bld(z,{id:'campo_trasgos',name:'Campamento de trasgos',kind:'camp',virtual:true,ex:36,ey:38,w:0,h:0});
 fillR(z,3,39,10,4,T.FARM,true);
 const stones=8;for(let i=0;i<stones;i++){const a=i/stones*Math.PI*2;prop(z,'boulder',22+Math.cos(a)*4.6,21.5+Math.sin(a)*3.6,{solid:1,deco:1})}prop(z,'campfire',22.5,21.8,{});
 [[33,37],[35,39],[37,36],[38,40]].forEach((p,i)=>prop(z,i<2?'tent':'campfire',p[0]+.5,p[1]+.5,{solid:i<2}));
 [[34,40],[38,38]].forEach(p=>prop(z,'crate',p[0]+.5,p[1]+.5,{solid:1}));
 compound(z,4,32,9,8,'pal',{side:'E',at:37,w:2});compound(z,30,26,9,8,'pal',{side:'W',at:31,w:2});compound(z,12,10,8,7,'pal',{side:'S',at:16,w:2});compound(z,31,34,10,8,'fence',{side:'W',at:37,w:2});
 plot(z,'collserola_p1',24,34,6,5,120,'Claro del leñador',0);
 exitR(z,20,43,4,1,'barcino',23.5,2.5);exitR(z,0,21,1,4,'pas_molins',22,2.5);
 z.arrive={barcino:{x:21.5,y:41},pas_molins:{x:2,y:22.5}};z.spawn={x:21.5,y:41};
 z.spots={plaza:{x:22,y:23},patrol:[[22,40],[22,28],[22,22]],beggar:[]};
};
// ---------- MARTORELL ----------
ZONE_BUILD.martorell=function(z){
 for(let y=0;y<z.rows;y++){const cx=18+Math.round(Math.sin(y*.35)*1);waterR(z,cx,y,4,1)}
 floorR(z,24,18,20,2,T.COBBLE);floorR(z,2,18,13,2,T.PATH);floorR(z,22,27,22,2,T.COBBLE);floorR(z,24,33,20,2,T.COBBLE);floorR(z,30,10,2,8,T.COBBLE);
 roadPoly(z,[[9.5,18],[9.5,0]],2,T.PATH);roadPoly(z,[[40.5,18],[40.5,0]],2,T.PATH);roadPoly(z,[[14.5,19],[14.5,34]],2,T.PATH);floorR(z,2,33,13,2,T.PATH);
 for(let i=15;i<=24;i++)for(let j=18;j<=19;j++){const k=ZI(z,i,j);z.tiles[k]=T.FLAG;z.solid[k]=0;z.flat[k]=1}
 z.bridges.push({x:15,y:18,w:10,h:2,axis:'x',peak:1.1});
 floorR(z,28,20,8,6,T.FLAG);
 bld(z,{id:'posada_pont',name:'Posada del Pont',kind:'inn',x:24,y:12,w:6,h:5,door:2,style:'timber',roof:'terra',floors:2,shop:'inn',rent:5});
 bld(z,{id:'forja_mt',name:'Fragua de Martorell',kind:'smith',x:34,y:13,w:4,h:4,door:2,style:'brick',roof:'slate',shop:'smith',fac:'artesanos',st:['forge']});
 bld(z,{id:'sant_esteve',name:'Iglesia de Sant Esteve',kind:'temple',x:28,y:5,w:6,h:6,door:3,style:'stone',roof:'terra',floors:3});
 bld(z,{id:'tienda_mt',name:'Colmado de la Plaza',kind:'shop',x:26,y:22,w:5,h:4,door:2,style:'ochre',roof:'terra',shop:'general'});
 bld(z,{id:'forn_mt',name:'Horno del Pont',kind:'bakery',x:32,y:22,w:4,h:4,door:1,style:'white',roof:'terra',prod:'bakery',shop:'bread',st:['kitchen']});
 bld(z,{id:'curtiduria',name:'Curtiduría de Martorell',kind:'tannery',x:37,y:22,w:5,h:4,door:2,style:'timber',roof:'thatch',prod:'tannery',fac:'artesanos',st:['tannery']});
 bld(z,{id:'molino',name:'Molino del Llobregat',kind:'mill',x:22,y:22,w:4,h:4,door:1,style:'stone',roof:'thatch',prod:'mill'});
 bld(z,{id:'pescador_mt',name:'Choza del pescador',kind:'fisher',x:12,y:14,w:4,h:3,door:1,style:'timber',roof:'thatch',prod:'fisher'});
 bld(z,{id:'casa_mt1',name:'Casa de la Riera',kind:'house',x:26,y:28,w:4,h:4,door:1,style:'white',roof:'terra'});
 bld(z,{id:'casa_mt2',name:'Casa del Molí',kind:'house',x:31,y:28,w:4,h:4,door:1,style:'ochre',roof:'terra'});
 bld(z,{id:'casa_mt3',name:'Casa del Pont',kind:'house',x:36,y:28,w:4,h:4,door:1,style:'stone',roof:'slate',forSale:420});
 bld(z,{id:'granja_mt',name:'Masía de Can Vidal',kind:'farm',x:7,y:27,w:6,h:5,door:2,style:'ochre',roof:'terra',prod:'farm',floors:2,shop:'farm'});
 bld(z,{id:'arco',name:'Arco de Aníbal',kind:'landmark',x:25,y:20,w:3,h:2,style:'stone',roof:'goth',floors:3,tall:1});
 fillR(z,2,35,12,5,T.FARM,true);fillR(z,2,21,5,6,T.FARM,true);
 plot(z,'martorell_p1',3,4,8,8,300,'Terrenos de la Ribera',0);
 for(let i=0;i<3;i++)stall(z,'st'+i,[29.5,32.5,34.5][i],[21.5,21.5,24.5][i]);
 [[26,17],[33,17],[24,21],[40,19],[41,24]].forEach((p,i)=>prop(z,'lamp',p[0]+.5,p[1]+.5));
 [[20,40],[16,25],[17,30],[23,35]].forEach(p=>prop(z,'boat',p[0]+.5,p[1]+.5,{deco:1,water:1}));
 [[38,20],[35,26],[11,34],[13,33]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));prop(z,'cart',27.5,20.2,{});prop(z,'haystack',5.5,32.5,{solid:1});prop(z,'haystack',12.5,36.5,{solid:1});
 prop(z,'well',31.5,19.5,{solid:1});
 for(let i=0;i<10;i++)prop(z,'flowers',[4,7,3,12,14,26,34,38,10,5][i]+.5,[3,8,14,10,24,16,20,34,22,30][i]+.5,{v:i});
 exitR(z,43,18,1,2,'pas_molins',2,22);exitR(z,8,0,3,1,'cam_collbato',9.5,41);
 z.arrive={pas_molins:{x:41,y:19},cam_collbato:{x:9.5,y:2}};z.spawn={x:30,y:19};
 z.spots={plaza:{x:32,y:22.5},market:{x:32,y:23},bridge:{x:19.5,y:19},patrol:[[40,19],[30,19],[19.5,19],[10,19],[30,13]],beggar:[[27,19],[35,12]],river:{x:17,y:20}};
};
// ---------- COLLBATÓ ----------
ZONE_BUILD.collbato=function(z){
 roadPoly(z,[[9.5,43],[9.5,30],[14,25]],2,T.PATH);roadPoly(z,[[24,22],[22,10],[21.5,0]],2,T.PATH);roadPoly(z,[[6,18],[6,24],[14,24]],2,T.PATH);roadPoly(z,[[34,10],[34,18],[34,24]],2,T.PATH);
 floorR(z,14,24,25,2,T.COBBLE);floorR(z,12,30,27,2,T.COBBLE);floorR(z,20,15,12,3,T.FLAG);
 bld(z,{id:'fonda_coves',name:'Fonda de les Coves',kind:'inn',x:22,y:19,w:6,h:5,door:2,style:'ochre',roof:'terra',floors:2,shop:'inn',rent:5});
 bld(z,{id:'herreria_cb',name:'Herrería de Collbató',kind:'smith',x:29,y:20,w:5,h:4,door:2,style:'stone',roof:'slate',shop:'smith',fac:'artesanos',st:['forge']});
 bld(z,{id:'capilla_cb',name:'Iglesia de Sant Corneli',kind:'temple',x:16,y:19,w:4,h:5,door:1,style:'stone',roof:'terra',floors:2});
 bld(z,{id:'tienda_cb',name:'Colmado de Collbató',kind:'shop',x:35,y:19,w:4,h:5,door:1,style:'white',roof:'terra',shop:'general'});
 for(let i=0;i<5;i++)bld(z,{id:'casa_cb'+(i+1),name:'Casa de Collbató '+(i+1),kind:'house',x:15+i*5,y:26,w:4,h:4,door:1,style:['stone','white','ochre','stone','white'][i],roof:['terra','terra','slate','terra','slate'][i],forSale:i===4?260:0});
 plot(z,'collbato_p1',4,34,8,6,150,'Ladera de Can Pere',0);
 [[20,24],[27,24],[15,30],[30,30]].forEach(p=>prop(z,'lamp',p[0]+.5,p[1]+.5));[[28,25],[26,25]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));prop(z,'well',25.5,17.5,{solid:1});
 [[36,6],[39,8],[41,12],[6,4],[12,8],[40,30],[3,26]].forEach((p,i)=>pillar(z,p[0]+.5,p[1]+.5,5+i%3*2,1.6+(i%2)*.5));
 for(let i=0;i<10;i++)prop(z,'boulder',[10,36,40,5,12,30,38,4,26,16][i]+.5,[8,15,22,22,37,38,34,30,40,10][i]+.5,{solid:1,deco:1});
 for(let i=0;i<8;i++)prop(z,'flowers',[12,18,24,30,8,38,22,16][i]+.5,[12,36,34,36,22,16,8,28][i]+.5,{v:i});
 exitR(z,8,43,4,1,'cam_collbato',9.5,2);exitR(z,20,0,4,1,'ascenso',22,41);
 z.arrive={cam_collbato:{x:9.5,y:41},ascenso:{x:22,y:2}};z.spawn={x:24,y:26};
 z.spots={plaza:{x:26,y:16},market:{x:26,y:16.5},patrol:[[9,40],[14,31],[25,25],[36,25]],beggar:[[24,27]]};
};
// ---------- MONTSERRAT ----------
ZONE_BUILD.montserrat=function(z){
 roadPoly(z,[[21.5,43],[21.5,34],[26,28],[22,24],[22,18]],2,T.PATH);roadPoly(z,[[29,25],[26,28]],2,T.PATH);roadPoly(z,[[13,25],[21,26]],2,T.PATH);roadPoly(z,[[38,30],[30,28]],2,T.PATH);roadPoly(z,[[7,9],[14,14],[19,17]],2,T.PATH);roadPoly(z,[[9,33],[21,33]],2,T.PATH);
 floorR(z,17,17,12,3,T.FLAG);floorR(z,20,20,5,4,T.FLAG);
 bld(z,{id:'monasterio',name:'Monasterio de Montserrat',kind:'monasterio',x:17,y:9,w:12,h:8,door:5,style:'stone',roof:'goth',floors:5,tall:1,fac:'orden',st:['kitchen']});
 bld(z,{id:'hostal',name:'Hostal de Peregrinos',kind:'inn',x:27,y:21,w:6,h:4,door:2,style:'ochre',roof:'terra',floors:2,shop:'inn',rent:4});
 bld(z,{id:'recuerdos',name:'Tienda del Monasterio',kind:'shop',x:11,y:21,w:5,h:4,door:2,style:'white',roof:'slate',shop:'general'});
 bld(z,{id:'masia_roca',name:'Masía de la Roca',kind:'house',x:8,y:30,w:4,h:3,door:1,style:'rockc',roof:'terra',forSale:200});
 [[3,10],[5,20],[39,10],[40,18],[3,32],[40,38],[14,3],[30,4],[8,40],[34,40]].forEach((p,i)=>pillar(z,p[0]+.5,p[1]+.5,7+i%4*2,1.8+(i%3)*.4));
 for(let i=0;i<12;i++)prop(z,'boulder',[10,30,35,6,14,26,38,4,28,18,12,36][i]+.5,[16,12,8,26,36,6,20,38,36,28,26,34][i]+.5,{solid:1,deco:1});
 [[20,24],[25,19],[19,17],[28,19]].forEach(p=>prop(z,'lamp',p[0]+.5,p[1]+.5));[[17,18],[29,18]].forEach((p,i)=>prop(z,'banner',p[0]+.5,p[1]+.5,{v:i}));
 exitR(z,20,43,4,1,'ascenso',22,2);
 z.arrive={ascenso:{x:22,y:41}};z.spawn={x:22,y:41};
 z.spots={plaza:{x:22,y:21},market:{x:22,y:21.5},patrol:[[22,40],[22,28],[22,19]],beggar:[[19,19]]};
};

// ---------- interiores de casas propias ----------
function buildInterior(bid){const z={id:'int:'+bid,name:'Interior',biome:'indoor',cols:14,rows:12,amp:0,tiles:new Uint8Array(14*12).fill(T.WOODF),solid:new Uint8Array(14*12),occ:new Uint8Array(14*12),flat:new Float32Array(14*12).fill(1),
 buildings:[],props:[],exits:[],plots:[],bridges:[],stalls:[],scen:[],pillars:[],nodes:[],spots:{},seed:5,indoor:1,parent:bid};
 for(let x=0;x<14;x++){z.solid[x]=1;z.solid[11*14+x]=1}for(let y=0;y<12;y++){z.solid[y*14]=1;z.solid[y*14+13]=1}
 z.exits.push({x:6,y:11,w:2,h:1,to:'__out',ax:0,ay:0});z.arrive={__out:{x:7,y:10}};z.spawn={x:7,y:9};
 z.plots.push({id:'int_'+bid,zone:z.id,x:1,y:1,w:12,h:10,price:0,name:'Interior',req:0,interior:1});return z}

// ---------- construcción de una zona (determinista) ----------
function ground_decor(z){const r=mulberry32(z.seed+5);for(let i=0;i<z.tiles.length;i++){if(z.tiles[i]===T.G0){const q=r();z.tiles[i]=q<.12?T.G1:q<.24?T.G2:q<.30?T.GF:T.G0}}
 if(z.biome==='forest'||z.biome==='hills'){for(let y=0;y<z.rows;y++)for(let x=0;x<z.cols;x++){const k=ZI(z,x,y);if(z.flat[k]>.3||z.solid[k])continue;const n=vnoise(x*.18,y*.18,z.seed+3);if(z.tiles[k]<=T.GF){if(z.biome==='forest'&&n>.5)z.tiles[k]=T.FOREST;else if(z.biome==='hills'&&n>.62)z.tiles[k]=T.GRAVEL;else if(z.biome==='hills'&&n>.5)z.tiles[k]=T.DIRT}}}
 if(z.biome==='mountain'){for(let y=0;y<z.rows;y++)for(let x=0;x<z.cols;x++){const k=ZI(z,x,y);if(z.flat[k]>.3||z.solid[k])continue;const n=vnoise(x*.15,y*.15,z.seed+4);if(z.tiles[k]<=T.GF){z.tiles[k]=n>.55?T.MROCK:n>.4?T.ROCK:(n>.3?T.MOSS:z.tiles[k])}}}
 if(z.biome==='coast'){for(let y=0;y<z.rows;y++)for(let x=36;x<41;x++){const k=ZI(z,x,y);if(z.flat[k]<.3&&z.tiles[k]<=T.GF&&!z.solid[k])z.tiles[k]=T.SAND}}
 if(z.biome==='river'){for(let y=0;y<z.rows;y++)for(let x=0;x<z.cols;x++){const k=ZI(z,x,y);if(z.solid[k]===2)continue;let near=false;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(inZ(z,xx,yy)&&z.solid[ZI(z,xx,yy)]===2)near=true}if(near&&z.tiles[k]<=T.GF&&z.flat[k]<.5)z.tiles[k]=T.SAND}}}
function buildHeights(z){const w=z.cols+1,h=z.rows+1;const fv=new Float32Array(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){let m=0;for(const[dx,dy]of[[0,0],[-1,0],[0,-1],[-1,-1]]){const xx=x+dx,yy=y+dy;if(inZ(z,xx,yy))m=Math.max(m,z.flat[ZI(z,xx,yy)])}fv[y*w+x]=m}
 const f2=new Float32Array(fv);for(let it=0;it<2;it++){for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;f2[i]=Math.max(fv[i],(fv[i-1]+fv[i+1]+fv[i-w]+fv[i+w])/4*.98)}fv.set(f2)}
 z.hm=new Float32Array(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const n=.65*vnoise(x*.09,y*.09,z.seed)+.35*vnoise(x*.23,y*.23,z.seed+9);let a=z.amp;let e=0;if(z.biome==='mountain'){const dx=Math.abs(x-w/2)/(w/2),dy=Math.abs(y-h/2)/(h/2);e=Math.pow(Math.max(dx,dy),2.2)*3.2}
  let H=(n*a+e)*(1-fv[y*w+x]);
  // agua: vértices rodeados de agua bajan
  let wc=0,cn=0;for(const[dx,dy]of[[0,0],[-1,0],[0,-1],[-1,-1]]){const xx=x+dx,yy=y+dy;if(inZ(z,xx,yy)){cn++;if(z.solid[ZI(z,xx,yy)]===2)wc++}}if(wc>0)H=Math.min(H,-.45+(cn-wc)*.15);if(wc===cn&&cn>0)H=-.55;
  z.hm[y*w+x]=H}
 if(z.sea){for(let y=0;y<h;y++)for(let x=39;x<w;x++)z.hm[y*w+x]=Math.min(z.hm[y*w+x],x>=41?-.55:-.1)}}
function heightAt(z,x,y){if(z.indoor)return 0;const w=z.cols+1;x=clamp(x,0,z.cols-.001);y=clamp(y,0,z.rows-.001);const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi;const a=z.hm[yi*w+xi],b=z.hm[yi*w+xi+1],c=z.hm[(yi+1)*w+xi],d=z.hm[(yi+1)*w+xi+1];let H=lerp(lerp(a,b,fx),lerp(c,d,fx),fy);
 for(const br of z.bridges){if(x>=br.x&&x<=br.x+br.w&&y>=br.y&&y<=br.y+br.h){const t=br.axis==='x'?(x-br.x)/br.w:(y-br.y)/br.h;H=Math.max(H,Math.sin(Math.PI*clamp(t,0,1))*br.peak+.05)}}return H}
function walkable(z,x,y){const xi=Math.floor(x),yi=Math.floor(y);if(!inZ(z,xi,yi))return false;const k=ZI(z,xi,yi);return z.solid[k]===0&&z.occ[k]===0}
// ¿cabe el jugador (radio .28) en esta posición?
function fitsAt(z,x,y,r){r=r||.28;return walkable(z,x-r,y-r)&&walkable(z,x+r,y-r)&&walkable(z,x-r,y+r)&&walkable(z,x+r,y+r)}
// posición libre más cercana (en espiral) donde cabe un personaje
function safeSpot(z,x,y){if(fitsAt(z,x,y))return[x,y];const xi=Math.floor(x),yi=Math.floor(y);for(let r=1;r<24;r++){let best=null,bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const cx=xi+dx+.5,cy=yi+dy+.5;if(fitsAt(z,cx,cy)){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[cx,cy]}}}if(best)return best}
 const sp=z.spawn||{x:z.cols/2,y:z.rows/2};return[sp.x,sp.y]}
function tileFree(z,xi,yi){if(!inZ(z,xi,yi))return false;const k=ZI(z,xi,yi);return z.solid[k]===0&&z.occ[k]===0}
function rebuildOcc(z){z.occ.fill(0);if(z.fix)for(const k of z.fix)z.occ[k]=1;if(!G)return;const fl=G.flora[z.id]||[];for(const p of fl){const F=FLORA[p.sp];if(F&&(F.k==='tree')&&p.age>=F.mat*.5){const xi=Math.floor(p.x),yi=Math.floor(p.y);if(inZ(z,xi,yi))z.occ[ZI(z,xi,yi)]=1}}
 const bl=G.built[z.id]||[];for(const b of bl){const P=PLACE[b.t];if(P&&P.solid&&!P.flat){const xi=Math.floor(b.x),yi=Math.floor(b.y);if(inZ(z,xi,yi))z.occ[ZI(z,xi,yi)]=1}}
 for(const pr of z.props){if(pr.solid){const xi=Math.floor(pr.x),yi=Math.floor(pr.y);if(inZ(z,xi,yi))z.solid[ZI(z,xi,yi)]=Math.max(z.solid[ZI(z,xi,yi)],1)}}}
function getZone(id){if(ZCACHE[id])return ZCACHE[id];let z;if(id.startsWith('int:'))z=makeInterior(id.slice(4));else{z=newZone(id);ZONE_BUILD[id](z);if(ZINFO[id].wall)wallRing(z,ZINFO[id].wall);ground_decor(z);buildHeights(z);
  // mar, pilares y escenario
  const r=mulberry32(z.seed+77);const pad=14;const sp={forest:['tree_pino','tree_encina','tree_castano'],coast:['tree_pino','tree_olivo'],river:['tree_encina','tree_olivo','tree_pino'],hills:['tree_pino','tree_olivo','boulder'],mountain:['boulder','tree_pino','boulder']}[z.biome];
  for(let i=0;i<260;i++){const x=r()*(z.cols+pad*2)-pad,y=r()*(z.rows+pad*2)-pad;if(x>=-.5&&y>=-.5&&x<=z.cols+.5&&y<=z.rows+.5)continue;if(z.sea&&x>z.cols-8)continue;z.scen.push({t:pick(sp,r),x,y,v:0,s:.8+r()*.5})}}
 rebuildOcc(z);ZCACHE[id]=z;return z}

// ---------- A* ----------
function findPath(z,sx,sy,tx,ty,maxIter){sx=Math.floor(sx);sy=Math.floor(sy);tx=Math.floor(tx);ty=Math.floor(ty);const W=z.cols,H=z.rows;if(!inZ(z,sx,sy))return null;
 if(!tileFree(z,tx,ty)){let best=null,bd=99;for(let r=1;r<=3;r++){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(tileFree(z,tx+dx,ty+dy)){const d=Math.hypot(dx,dy);if(d<bd){bd=d;best=[tx+dx,ty+dy]}}}if(best)break}if(!best)return null;tx=best[0];ty=best[1]}
 if(sx===tx&&sy===ty)return[];const N=W*H;const g=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),closed=new Uint8Array(N);
 const heap=[];const push=(i,f)=>{heap.push([f,i]);let c=heap.length-1;while(c>0){const p=(c-1)>>1;if(heap[p][0]<=heap[c][0])break;[heap[p],heap[c]]=[heap[c],heap[p]];c=p}};
 const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let c=0;for(;;){let l=c*2+1,r=l+1,m=c;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===c)break;[heap[m],heap[c]]=[heap[c],heap[m]];c=m}}return top};
 const s=sy*W+sx,t=ty*W+tx;g[s]=0;push(s,0);let it=0;const lim=maxIter||6000;const D=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.41],[-1,1,1.41],[1,-1,1.41],[-1,-1,1.41]];
 while(heap.length&&it++<lim){const[,c]=pop();if(closed[c])continue;closed[c]=1;if(c===t)break;const cx=c%W,cy=(c/W)|0;
  for(const[dx,dy,cost]of D){const nx=cx+dx,ny=cy+dy;if(!tileFree(z,nx,ny))continue;if(dx&&dy&&(!tileFree(z,cx+dx,cy)||!tileFree(z,cx,cy+dy)))continue;const n=ny*W+nx;const ng=g[c]+cost;if(ng<g[n]){g[n]=ng;from[n]=c;push(n,ng+Math.hypot(tx-nx,ty-ny))}}}
 if(from[t]<0)return null;const path=[];let c=t;while(c!==s){path.push({x:(c%W)+.5,y:((c/W)|0)+.5});c=from[c]}path.reverse();return path}
