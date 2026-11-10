// ===================== NUEVOS MAPAS: Sant Cugat y las Salinas =====================
ZINFO.sant_cugat={n:'Sant Cugat del Vallès',biome:'hills',settle:'town',wall:{style:'stone2'},cols:44,rows:44,amp:.5,desc:'Villa fortificada en torno a un monasterio benedictino, con scriptorium, hospital de peregrinos y mercado de lana. Aquí se copian los libros que luego leen en Barcino.'};
ZINFO.salinas={n:'Salinas de Cardona',biome:'mountain',cols:44,rows:44,amp:1.2,desc:'Una montaña de sal blanca horadada de galerías. Mineros, contrabandistas de sal y una capilla excavada en la roca bajo un cielo siempre despejado.'};
['sant_cugat','salinas'].forEach(z=>ZIDS.push(z));
(function(){const L=[['sant_cugat','collserola'],['sant_cugat','pas_molins'],['salinas','ascenso'],['salinas','cam_collbato']];ZIDS.forEach(z=>TRAVEL[z]=TRAVEL[z]||{});L.forEach(([a,b])=>{TRAVEL[a][b]=1;TRAVEL[b][a]=1})})();
const LEGACY=()=>typeof G!=='undefined'&&G&&G.legacy;
// enlaces desde las zonas existentes (sólo en partidas nuevas)
function linkExits(id,fn){const old=ZONE_BUILD[id];ZONE_BUILD[id]=function(z){old(z);if(!LEGACY())fn(z)}}
linkExits('collserola',z=>{exitR(z,43,20,1,4,'sant_cugat',2.5,22.5);z.arrive.sant_cugat={x:41.5,y:22}});
linkExits('pas_molins',z=>{exitR(z,32,0,4,1,'sant_cugat',33.5,41.5);z.arrive.sant_cugat={x:33.5,y:2.5}});
linkExits('ascenso',z=>{exitR(z,43,20,1,4,'salinas',2.5,22.5);z.arrive.salinas={x:41.5,y:22}});
linkExits('cam_collbato',z=>{exitR(z,43,10,1,4,'salinas',2.5,11.5);z.arrive.salinas={x:41.5,y:12}});

ZONE_BUILD.sant_cugat=function(z){
 floorR(z,15,17,14,10,T.COBBLE);
 roadPoly(z,[[0,22.5],[15,22.5]],2,T.PATH);roadPoly(z,[[29,22.5],[40,22.5]],2,T.PATH);roadPoly(z,[[33.5,43],[33.5,34],[33.5,27]],2,T.PATH);
 roadPoly(z,[[21.5,17],[21.5,11]],2,T.PATH);roadPoly(z,[[8,22.5],[8,14]],2,T.PATH);roadPoly(z,[[22,27],[22,36],[10,36]],2,T.PATH);
 bld(z,{id:'claustro_sc',name:'Monasterio de Sant Cugat',kind:'monasterio',x:15,y:3,w:9,h:7,door:4,style:'stone',roof:'slate',floors:3});
 bld(z,{id:'biblioteca_sc',name:'Scriptorium y Biblioteca',kind:'library',x:26,y:4,w:6,h:5,door:2,style:'ochre',roof:'terra',floors:2});
 bld(z,{id:'ayuntamiento_sc',name:'Casa de la Vila',kind:'ayuntamiento',x:34,y:5,w:6,h:5,door:3,style:'stone',roof:'slate',floors:2});
 bld(z,{id:'posada_sc',name:'Posada del Peregrino',kind:'inn',x:3,y:15,w:6,h:5,door:2,style:'timber',roof:'terra',floors:2,shop:'inn',rent:6});
 bld(z,{id:'forja_sc',name:'Fragua del Claustre',kind:'smith',x:10,y:13,w:4,h:4,door:2,style:'brick',roof:'slate',shop:'smith',fac:'artesanos',st:['forge']});
 bld(z,{id:'tienda_sc',name:'Mercat de la Llana',kind:'shop',x:31,y:14,w:5,h:4,door:2,style:'ochre',roof:'terra',shop:'general'});
 bld(z,{id:'forn_sc',name:'Forn de Sant Cugat',kind:'bakery',x:37,y:14,w:4,h:4,door:1,style:'white',roof:'terra',prod:'bakery',shop:'bread',st:['kitchen']});
 bld(z,{id:'botica_sc',name:'Herbolario del Monestir',kind:'apothecary',x:4,y:27,w:5,h:4,door:2,style:'white',roof:'terra',floors:2,shop:'apo',st:['alchemy']});
 bld(z,{id:'cuartel_sc',name:'Cuartel de la Vila',kind:'barracks',x:36,y:26,w:5,h:4,door:2,style:'stone',roof:'slate'});
 bld(z,{id:'capilla_sc',name:'Hospital de Peregrinos',kind:'chapel',x:37,y:33,w:5,h:4,door:2,style:'stone',roof:'terra'});
 bld(z,{id:'granja_sc',name:'Masía de Can Cugat',kind:'farm',x:4,y:35,w:6,h:5,door:2,style:'ochre',roof:'terra',prod:'farm',floors:2,shop:'farm'});
 bld(z,{id:'molino_sc',name:'Molino del Rec',kind:'mill',x:12,y:30,w:4,h:4,door:1,style:'stone',roof:'thatch',prod:'mill'});
 [[16,30],[20,30],[24,30],[28,30],[16,37],[22,37],[28,37]].forEach((p,i)=>bld(z,{id:'casa_sc'+(i+1),name:['Casa dels Arcs','Casa de la Font','Casa del Teuler','Casa del Pi','Casa de Ca l\'Aixada','Casa del Cabasser','Casa de la Rovira'][i],kind:'house',x:p[0],y:p[1],w:4,h:4,door:1,style:['white','ochre','stone','timber','white','ochre','stone'][i],roof:i%2?'terra':'slate',forSale:i===6?380:undefined}));
 fillR(z,2,38,9,5,T.FARM,true);
 plot(z,'sc_p1',33,36,8,6,260,'Terrenos del Camí Ral',0);
 for(let i=0;i<3;i++)stall(z,'sst'+i,[18.5,21.5,24.5][i],[19.5,19.5,19.5][i]);
 [[17,21],[27,21],[22,16],[22,28],[9,22],[34,22]].forEach(p=>prop(z,'lamp',p[0]+.5,p[1]+.5));
 prop(z,'well',21.5,22.5,{solid:1});[[19,25],[26,24],[14,33],[40,20]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));prop(z,'cart',24.5,25.2,{});prop(z,'haystack',3.5,34.5,{solid:1});
 for(let i=0;i<10;i++)prop(z,'flowers',[5,12,18,26,30,38,12,6,40,33][i]+.5,[12,20,12,12,24,12,26,24,31,40][i]+.5,{v:i});
 exitR(z,0,21,1,4,'collserola',41.5,22);exitR(z,32,43,4,1,'pas_molins',33.5,2.5);
 z.arrive={collserola:{x:2.5,y:22.5},pas_molins:{x:33.5,y:41.5}};z.spawn={x:22,y:22.5};
 z.spots={plaza:{x:22,y:21},market:{x:21.5,y:20},patrol:[[3,22],[22,22],[34,22],[33,38],[22,12]],beggar:[[17,24],[26,19]]};
};
ZONE_BUILD.salinas=function(z){
 fillR(z,8,6,28,30,T.SAND,true);
 waterR(z,26,10,6,3);waterR(z,28,13,4,3);waterR(z,12,30,8,3);
 roadPoly(z,[[0,22.5],[12,22.5],[22,20],[32,20]],2,T.PATH);roadPoly(z,[[0,11.5],[10,11.5],[16,16],[22,20]],2,T.PATH);roadPoly(z,[[22,20],[22,34],[30,38]],2,T.PATH);
 bld(z,{id:'mina_sal',name:'Mina de Sal (galería principal)',kind:'mine',virtual:true,ex:34,ey:20,w:0,h:0});
 bld(z,{id:'cantina_sal',name:'Cantina de los Salineros',kind:'inn',x:14,y:15,w:6,h:5,door:2,style:'rockc',roof:'thatch',shop:'inn',rent:4});
 bld(z,{id:'almacen_sal',name:'Almacén de la Sal',kind:'shop',x:24,y:23,w:5,h:4,door:2,style:'rockc',roof:'thatch',shop:'general'});
 bld(z,{id:'capilla_sal',name:'Capilla de Sant Miquel',kind:'chapel',x:12,y:25,w:4,h:4,door:2,style:'stone',roof:'slate'});
 bld(z,{id:'barracon_sal1',name:'Barracón de los Salineros',kind:'house',x:16,y:28,w:5,h:4,door:2,style:'rockc',roof:'thatch'});
 bld(z,{id:'barracon_sal2',name:'Casa del Capataz',kind:'house',x:30,y:26,w:4,h:4,door:1,style:'timber',roof:'slate'});
 bld(z,{id:'casa_sal1',name:'Cabaña de Sal Vella',kind:'house',x:8,y:18,w:4,h:3,door:1,style:'rockc',roof:'thatch'});
 bld(z,{id:'cuartel_sal',name:'Puesto de Guardia del Rey',kind:'barracks',x:21,y:12,w:5,h:4,door:2,style:'stone',roof:'slate'});
 [[22,22],[28,28],[18,18]].forEach(p=>prop(z,'campfire',p[0]+.5,p[1]+.5,{}));[[27,22],[30,24],[24,28],[19,26]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));[[27,26],[34,22]].forEach(p=>prop(z,'cart',p[0]+.5,p[1]+.5,{}));[[20,22],[32,22]].forEach(p=>prop(z,'crate',p[0]+.5,p[1]+.5,{solid:1}));
 prop(z,'lamp',22.5,18.5);prop(z,'lamp',15.5,22.5);
 stall(z,'sal_st0',26.5,22.5);stall(z,'sal_st1',28.5,22.5);
 rockyDeco(z,[[4,4],[38,6],[40,16],[40,30],[36,38],[6,36],[3,26],[26,36],[34,4],[12,4]],[[6,12],[12,6],[36,12],[38,24],[32,34],[10,38],[22,38],[4,30],[18,6],[26,6],[40,40]],[[14,10],[20,36],[30,32],[6,20],[36,28]]);
 exitR(z,0,21,1,4,'ascenso',41.5,22);exitR(z,0,10,1,4,'cam_collbato',41.5,12);
 z.arrive={ascenso:{x:2.5,y:22.5},cam_collbato:{x:2.5,y:11.5}};z.spawn={x:4,y:22};
 z.spots={plaza:{x:22,y:21},market:{x:25,y:22},patrol:[[3,22],[22,20],[30,20],[22,34]],beggar:[[17,22]]};
};
