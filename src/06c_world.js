// ===================== MURALLAS, VALLAS Y MAPAS INTERMEDIOS (se cruza el mundo andando) =====================
const WALLS={stone:{tile:'W_STONE',ht:2.7,col:[1,1,1],cap:1},stone2:{tile:'W_STONE2',ht:2.3,col:[1,1,1],cap:1},tower:{tile:'W_STONE2',ht:3.8,col:[.95,.95,.95],cap:1},pal:{tile:'FENCE_W',ht:1.9,post:1},fence:{tile:'FENCE_W',ht:1.0,post:1}};
function wallR(z,x,y,w,h,style){z.walls=z.walls||[];z.walls.push({x,y,w,h,style});for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(inZ(z,i,j)){const k=ZI(z,i,j);if(z.solid[k]!==2){z.solid[k]=1;z.flat[k]=Math.max(z.flat[k],.9)}}}
function wallRing(z,o){const skip=o.skip||[];const ex=z.exits;const gate=(x,y)=>ex.some(e=>x>=e.x&&x<e.x+e.w&&y>=e.y&&y<e.y+e.h);const W=z.cols,H=z.rows;const tw=o.style==='stone'||o.style==='stone2';
 const put=(x,y)=>{if(!gate(x,y))wallR(z,x,y,1,1,o.style)};
 for(let x=0;x<W;x++){if(!skip.includes('N'))put(x,0);if(!skip.includes('S'))put(x,H-1)}
 for(let y=1;y<H-1;y++){if(!skip.includes('W'))put(0,y);if(!skip.includes('E'))put(W-1,y)}
 if(tw){for(const e of ex){const hor=e.w>=e.h;const a=hor?[[e.x-1,e.y],[e.x+e.w,e.y]]:[[e.x,e.y-1],[e.x,e.y+e.h]];a.forEach(p=>{if(inZ(z,p[0],p[1])){z.walls=z.walls.filter(w=>!(w.x===p[0]&&w.y===p[1]));wallR(z,p[0],p[1],1,1,'tower')}})}
  [[0,0,'N','W'],[W-1,0,'N','E'],[0,H-1,'S','W'],[W-1,H-1,'S','E']].forEach(c=>{if(skip.includes(c[2])||skip.includes(c[3]))return;z.walls=z.walls.filter(w=>!(w.x===c[0]&&w.y===c[1]));wallR(z,c[0],c[1],1,1,'tower')})}}
// recinto vallado con puerta (lado S/N/E/W y posición)
function compound(z,x,y,w,h,style,gate){const g=gate||{};const has=(side,px,py)=>g.side===side&&(side==='N'||side==='S'?(px>=g.at&&px<g.at+(g.w||2)):(py>=g.at&&py<g.at+(g.w||2)));
 for(let i=0;i<w;i++){if(!has('N',x+i,y))wallR(z,x+i,y,1,1,style);if(!has('S',x+i,y+h-1))wallR(z,x+i,y+h-1,1,1,style)}
 for(let j=1;j<h-1;j++){if(!has('W',x,y+j))wallR(z,x,y+j,1,1,style);if(!has('E',x+w-1,y+j))wallR(z,x+w-1,y+j,1,1,style)}}
function riverCol(z,cx,w,amp,fr){for(let y=0;y<z.rows;y++){waterR(z,cx+Math.round(Math.sin(y*fr)*amp),y,w,1)}}
function rockyDeco(z,pil,bou,fl){(pil||[]).forEach((p,i)=>pillar(z,p[0]+.5,p[1]+.5,5+i%4*2,1.5+(i%3)*.4));(bou||[]).forEach(p=>prop(z,'boulder',p[0]+.5,p[1]+.5,{solid:1,deco:1}));(fl||[]).forEach((p,i)=>prop(z,'flowers',p[0]+.5,p[1]+.5,{v:i}))}

ZINFO.vega={n:'Vega del Llobregat',biome:'river',cols:44,rows:44,amp:.3,desc:'Huertas, norias y caminos de tierra junto al río. Una masía fortificada y una venta protegen a quienes cruzan la comarca.'};
ZINFO.pas_molins={n:'Paso de Molins',biome:'hills',cols:44,rows:44,amp:1.0,desc:'Colinas pedregosas que estrechan el camino real. Una venta amurallada, una atalaya en ruinas y mala fama de salteadores.'};
ZINFO.cam_collbato={n:'Canteras y Cuevas de Collbató',biome:'hills',cols:44,rows:44,amp:1.3,desc:'Camino de carros entre canteras de conglomerado, una mina de hierro y las cuevas del salitre. Aquí no hay muros: hay trasgos, murciélagos y algo peor.'};
ZINFO.ascenso={n:'Sendas de Montserrat',biome:'mountain',cols:44,rows:44,amp:1.9,desc:'La senda de los peregrinos entre agujas de roca: ermitas, la Santa Cova y, dicen, la Víbria.'};
ZINFO.marjal={n:'Marjal del Prat',biome:'coast',cols:44,rows:44,amp:.2,desc:'Lagunas, carrizales y aves marinas entre la ciudad y los acantilados del Garraf.'};
ZINFO.cornisa={n:'Cornisa de Garraf',biome:'hills',cols:44,rows:44,amp:.9,desc:'Un camino colgado sobre el mar entre pinos y roca caliza. Jabalíes, víboras y, de noche, luces en la costa.'};
['vega','pas_molins','cam_collbato','ascenso','marjal','cornisa'].forEach(z=>ZIDS.push(z));
(function(){const L=[['barcino','vega'],['vega','pas_molins'],['pas_molins','martorell'],['pas_molins','collserola'],['barcino','collserola'],['martorell','cam_collbato'],['cam_collbato','collbato'],['collbato','ascenso'],['ascenso','montserrat'],['barcino','marjal'],['marjal','cornisa'],['cornisa','garraf']];
 ZIDS.forEach(z=>TRAVEL[z]=TRAVEL[z]||{});L.forEach(([a,b])=>{TRAVEL[a][b]=1;TRAVEL[b][a]=1})})();

ZONE_BUILD.vega=function(z){
 riverCol(z,26,3,1.5,.3);
 for(let i=25;i<31;i++)for(let j=19;j<21;j++){const k=ZI(z,i,j);z.tiles[k]=T.FLAG;z.solid[k]=0;z.flat[k]=1}z.bridges.push({x:25,y:19,w:6,h:2,axis:'x',peak:.9});
 roadPoly(z,[[43,20],[34,20],[22,19],[8,20],[0,20]],2,T.PATH);roadPoly(z,[[12,21],[12,25]],2,T.PATH);
 bld(z,{id:'granja_vega',name:'Masía de Can Tries',kind:'farm',x:7,y:27,w:6,h:5,door:2,style:'ochre',roof:'terra',prod:'farm',floors:2,shop:'farm'});
 bld(z,{id:'casa_vg1',name:'Casa del Hortelano',kind:'house',x:14,y:28,w:4,h:4,door:1,style:'white',roof:'terra'});
 bld(z,{id:'casa_vg2',name:'Casa de la Noria',kind:'house',x:14,y:33,w:4,h:3,door:1,style:'stone',roof:'slate',forSale:280});
 compound(z,5,24,15,15,'pal',{side:'N',at:11,w:3});
 bld(z,{id:'venta_llobregat',name:'Venta del Llobregat',kind:'inn',x:33,y:12,w:6,h:5,door:2,style:'timber',roof:'terra',floors:2,shop:'inn',rent:5});
 compound(z,31,10,12,9,'pal',{side:'S',at:35,w:3});roadPoly(z,[[36,18],[36,20]],2,T.PATH);
 bld(z,{id:'atalaya_vega',name:'Atalaya en ruinas',kind:'landmark',x:8,y:8,w:3,h:3,style:'dark',roof:'goth',floors:6,tall:1});
 fillR(z,2,38,16,5,T.FARM,true);fillR(z,33,26,9,8,T.FARM,true);fillR(z,2,2,10,4,T.FARM,true);
 plot(z,'vega_p1',32,36,9,6,200,'Huerta del Meandre',0);
 [[10,26],[18,30],[35,28]].forEach(p=>prop(z,'haystack',p[0]+.5,p[1]+.5,{solid:1}));[[16,26],[34,17]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));prop(z,'cart',20.5,18.2,{});prop(z,'well',12.5,31.5,{solid:1});
 [[27,8],[28,32],[27,40]].forEach(p=>prop(z,'boat',p[0]+.5,p[1]+.5,{deco:1,water:1}));prop(z,'lamp',35.5,19.5);prop(z,'lamp',12.5,23.5);
 rockyDeco(z,[],[[20,8],[36,40],[4,14],[22,30]],[[6,17],[15,15],[22,22],[40,24],[2,26],[24,36],[18,6],[38,6]]);
 exitR(z,43,19,1,3,'barcino',2,27);exitR(z,0,19,1,3,'pas_molins',41,22);
 z.arrive={barcino:{x:41,y:20.5},pas_molins:{x:2,y:20.5}};z.spawn={x:22,y:20.5};
 z.spots={plaza:{x:36,y:20.5},market:{x:36,y:20},patrol:[[40,20],[30,20],[22,19],[12,20],[4,20]],beggar:[[34,21]],river:{x:25,y:22}};
};
ZONE_BUILD.pas_molins=function(z){
 roadPoly(z,[[43,22],[34,24],[24,21],[12,23],[0,22]],2,T.PATH);roadPoly(z,[[24,21],[22,12],[22,0]],2,T.PATH);
 bld(z,{id:'venta_paso',name:'Venta del Paso',kind:'inn',x:18,y:25,w:6,h:5,door:2,style:'stone',roof:'slate',floors:2,shop:'inn',rent:5});
 compound(z,16,23,10,9,'pal',{side:'N',at:20,w:3});roadPoly(z,[[21,22],[21,24]],2,T.PATH);
 bld(z,{id:'torre_molins',name:'Torre de Molins',kind:'landmark',x:30,y:8,w:3,h:3,style:'dark',roof:'goth',floors:7,tall:1});
 bld(z,{id:'casa_pm1',name:'Pastoría de Can Sala',kind:'house',x:8,y:32,w:4,h:3,door:1,style:'rockc',roof:'thatch'});
 compound(z,6,30,9,8,'fence',{side:'E',at:33,w:2});
 bld(z,{id:'cueva_paso',name:'Cueva del Contrabandista',kind:'cave',virtual:true,ex:7,ey:9,w:0,h:0});
 bld(z,{id:'peaje_bandidos',name:'Campamento del Peaje',kind:'camp',virtual:true,ex:36,ey:36,w:0,h:0});
 [[34,33],[38,34],[35,38],[39,38]].forEach((p,i)=>prop(z,i<2?'tent':'campfire',p[0]+.5,p[1]+.5,{solid:i<2}));prop(z,'crate',37.5,36.5,{solid:1});
 compound(z,32,32,9,9,'pal',{side:'N',at:35,w:2});
 prop(z,'cart',29.5,23.2,{});prop(z,'barrel',17.5,26.5,{solid:1});prop(z,'lamp',20.5,22.5);prop(z,'well',25.5,28.5,{solid:1});
 rockyDeco(z,[[4,4],[38,4],[3,22],[40,14],[10,40],[28,41]],[[12,10],[16,6],[30,20],[10,26],[36,26],[26,14],[6,38],[20,38],[40,28],[4,16]],[[8,14],[14,18],[20,16],[30,30],[22,36],[12,34],[34,18],[5,28]]);
 exitR(z,43,21,1,3,'vega',2,20.5);exitR(z,0,21,1,3,'martorell',41,19);exitR(z,20,0,4,1,'collserola',2,22.5);
 z.arrive={vega:{x:41,y:22.5},martorell:{x:2,y:22.5},collserola:{x:22,y:2.5}};z.spawn={x:24,y:22};
 z.spots={plaza:{x:21,y:24},market:{x:21,y:24.5},patrol:[[40,23],[30,24],[22,22],[10,22],[22,8]],beggar:[[20,22]]};
};
ZONE_BUILD.cam_collbato=function(z){
 roadPoly(z,[[9.5,43],[9.5,34],[16,28],[26,24],[31,16],[24,9],[12,5],[9.5,0]],2,T.PATH);
 bld(z,{id:'mina',name:'Mina de hierro',kind:'mine',x:3,y:16,w:5,h:4,door:2,style:'dark',roof:'slate',prod:'mine'});
 roadPoly(z,[[6,21],[9.5,26]],2,T.PATH);
 bld(z,{id:'cantera',name:'Cantera de conglomerado',kind:'quarry',x:34,y:8,w:5,h:4,door:2,style:'rockc',roof:'slate',prod:'quarry'});roadPoly(z,[[31,16],[36,13]],2,T.PATH);
 bld(z,{id:'cuevas',name:'Cuevas del Salnitre',kind:'cave',virtual:true,ex:38,ey:20,w:0,h:0});
 bld(z,{id:'guarida_ogro',name:'Guarida del ogro',kind:'camp',virtual:true,ex:40,ey:4,w:0,h:0});
 bld(z,{id:'barracon_cb1',name:'Barracón de los mineros',kind:'house',x:2,y:29,w:4,h:3,door:1,style:'timber',roof:'thatch'});
 bld(z,{id:'barracon_cb2',name:'Barracón de los canteros',kind:'house',x:2,y:33,w:4,h:3,door:1,style:'timber',roof:'thatch'});
 compound(z,1,28,7,11,'pal',{side:'E',at:31,w:2});roadPoly(z,[[8,32],[10,32]],2,T.PATH);
 prop(z,'cart',14.5,27.2,{});[[12,30],[24,22],[30,12]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));prop(z,'crate',33.5,13.5,{solid:1});prop(z,'lamp',9.5,36.5);
 rockyDeco(z,[[36,6],[39,10],[41,16],[6,4],[14,10],[40,30],[3,40],[28,6],[20,14],[36,28]],[[10,8],[36,36],[40,22],[5,24],[12,36],[30,38],[38,38],[4,10],[26,34],[16,20],[22,30],[34,20]],[[12,12],[18,36],[24,34],[30,30],[8,40],[38,32],[20,8],[26,28]]);
 exitR(z,8,43,4,1,'martorell',9.5,2);exitR(z,8,0,4,1,'collbato',9.5,41);
 z.arrive={martorell:{x:9.5,y:41},collbato:{x:9.5,y:2}};z.spawn={x:9.5,y:40};
 z.spots={plaza:{x:12,y:30},market:{x:12,y:30.5},patrol:[[9.5,40],[14,30],[26,24],[31,16]],beggar:[]};
};
ZONE_BUILD.ascenso=function(z){
 roadPoly(z,[[22,43],[22,36],[12,32],[22,26],[32,20],[22,14],[16,8],[22,3],[22,0]],2,T.PATH);
 bld(z,{id:'santa_cova',name:'Santa Cova',kind:'shrine',x:34,y:29,w:4,h:4,door:1,style:'rockc',roof:'goth',floors:2});roadPoly(z,[[27,23],[35,28]],2,T.PATH);
 bld(z,{id:'ermita_joan',name:'Ermita de Sant Joan',kind:'chapel',x:6,y:6,w:3,h:3,door:1,style:'rockc',roof:'thatch'});roadPoly(z,[[7,10],[16,8]],2,T.PATH);
 bld(z,{id:'cima',name:'Cruz de Sant Jeroni',kind:'peak',virtual:true,ex:30,ey:5,w:0,h:0});prop(z,'cross',30.5,4.5,{solid:1});
 bld(z,{id:'refugio_peregrinos',name:'Refugio de los Peregrinos',kind:'inn',x:6,y:25,w:6,h:4,door:2,style:'rockc',roof:'slate',floors:2,shop:'inn',rent:3});
 bld(z,{id:'casa_as1',name:'Casa del Guardasendas',kind:'house',x:11,y:29,w:4,h:3,door:1,style:'rockc',roof:'terra',forSale:180});
 compound(z,4,23,12,11,'pal',{side:'S',at:8,w:2});roadPoly(z,[[9,34],[12,32]],2,T.PATH);
 [[10,8],[3,18],[39,10],[40,18],[3,34],[40,40],[14,3],[34,4],[8,40],[34,40],[28,12],[16,16],[26,36]].forEach((p,i)=>pillar(z,p[0]+.5,p[1]+.5,7+i%4*2,1.8+(i%3)*.4));
 [[10,16],[30,12],[35,8],[6,26],[14,36],[26,30],[38,34],[4,38],[28,40],[18,22],[12,26],[36,22]].forEach(p=>prop(z,'boulder',p[0]+.5,p[1]+.5,{solid:1,deco:1}));
 prop(z,'lamp',22.5,41.5);prop(z,'banner',34.5,28.5,{v:0});
 exitR(z,20,43,4,1,'collbato',22,2);exitR(z,20,0,4,1,'montserrat',22,41);
 z.arrive={collbato:{x:22,y:41},montserrat:{x:22,y:2}};z.spawn={x:22,y:41};
 z.spots={plaza:{x:14,y:30},market:{x:14,y:30.5},patrol:[[22,40],[16,32],[26,24],[22,14]],beggar:[]};
};
ZONE_BUILD.marjal=function(z){
 waterR(z,41,0,3,44);fillR(z,39,0,2,44,T.SAND);
 roadPoly(z,[[23.5,0],[23.5,12],[21,22],[24,32],[23.5,43]],2,T.PATH);
 waterR(z,6,8,8,4);waterR(z,8,10,5,5);waterR(z,8,28,9,5);waterR(z,30,22,6,4);waterR(z,32,36,5,4);
 bld(z,{id:'cabana_marjal',name:'Cabaña del Marjal',kind:'fisher',x:27,y:8,w:4,h:3,door:1,style:'timber',roof:'thatch',prod:'fisher'});
 bld(z,{id:'casa_mj1',name:'Casa de las Salinas',kind:'house',x:32,y:8,w:3,h:3,door:1,style:'white',roof:'thatch'});
 compound(z,26,6,10,10,'fence',{side:'S',at:29,w:2});roadPoly(z,[[23.5,16],[30,16]],2,T.PATH);
 bld(z,{id:'torre_prat',name:'Torre de guardia del Prat',kind:'landmark',x:31,y:30,w:3,h:3,style:'stone',roof:'goth',floors:5,tall:1});
 [[36,14],[37,28],[36,40]].forEach(p=>prop(z,'boat',p[0]+.5,p[1]+.5,{deco:1,water:1}));prop(z,'lamp',24.5,13.5);prop(z,'barrel',27.5,15.5,{solid:1});prop(z,'campfire',36.5,18.5,{});
 rockyDeco(z,[],[[16,18],[18,36],[28,28],[4,22],[12,40]],[[10,6],[16,10],[12,26],[30,20],[34,34],[20,28],[6,34],[14,16],[26,18],[18,6],[4,12],[22,40]]);
 exitR(z,22,0,4,1,'barcino',23.5,41.5);exitR(z,22,43,4,1,'cornisa',23.5,2.5);
 z.arrive={barcino:{x:23.5,y:2.5},cornisa:{x:23.5,y:41}};z.spawn={x:23.5,y:3};
 z.spots={plaza:{x:25,y:11},market:{x:25,y:11.5},patrol:[[23,4],[23,14],[22,24],[24,34]],beggar:[],port:{x:37,y:19}};z.sea=1;
};
ZONE_BUILD.cornisa=function(z){
 waterR(z,41,0,3,44);fillR(z,39,0,2,44,T.SAND);
 roadPoly(z,[[22,0],[22,10],[18,20],[24,30],[22,43]],2,T.PATH);
 bld(z,{id:'torre_cornisa',name:'Atalaya de la Cornisa',kind:'landmark',x:12,y:12,w:3,h:3,style:'stone',roof:'goth',floors:5,tall:1});
 bld(z,{id:'cueva_cornisa',name:'Cueva de la Cornisa',kind:'cave',virtual:true,ex:6,ey:31,w:0,h:0});
 bld(z,{id:'atalaya_contrabando',name:'Mirador de los contrabandistas',kind:'camp',virtual:true,ex:35,ey:14,w:0,h:0});
 [[33,12],[36,15]].forEach((p,i)=>prop(z,i?'campfire':'tent',p[0]+.5,p[1]+.5,{solid:!i}));prop(z,'crate',34.5,15.5,{solid:1});
 bld(z,{id:'casa_cn1',name:'Corral de Can Roca',kind:'house',x:8,y:34,w:4,h:3,door:1,style:'rockc',roof:'thatch'});
 compound(z,6,32,9,8,'fence',{side:'E',at:35,w:2});
 prop(z,'lamp',22.5,5.5);prop(z,'banner',20.5,41.5,{v:1});
 rockyDeco(z,[[4,6],[8,20],[3,26],[12,40],[30,6],[34,24],[34,36],[28,40],[4,40]],[[10,6],[16,8],[28,16],[30,26],[10,28],[20,36],[14,24],[36,32],[6,14],[26,4],[32,20]],[[12,18],[18,30],[24,38],[26,10],[8,10],[30,34],[16,36],[34,8]]);
 exitR(z,20,0,4,1,'marjal',23.5,41);exitR(z,20,43,4,1,'garraf',23.5,2.5);
 z.arrive={marjal:{x:22,y:2.5},garraf:{x:22,y:41}};z.spawn={x:22,y:3};
 z.spots={plaza:{x:22,y:20},market:{x:22,y:20.5},patrol:[[22,4],[20,16],[22,28],[22,40]],beggar:[]};z.sea=1;
};
