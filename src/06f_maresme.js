// ===================== EL MARESME (Iluro / Mataró): costa de pescadores, salazones y atalayas =====================
ZINFO.maresme={n:'Iluro del Maresme',biome:'coast',settle:'town',wall:{style:'stone'},cols:44,rows:44,amp:.3,fd:.6,desc:'Villa pesquera sobre las ruinas de la romana Iluro: lonja, salazones, atalayas contra los piratas moros y una playa de barcas varadas donde las mujeres remiendan redes.'};
ZIDS.push('maresme');
(function(){TRAVEL.maresme=TRAVEL.maresme||{};[['maresme','collserola'],['maresme','montseny']].forEach(([a,b])=>{TRAVEL[a][b]=1;TRAVEL[b][a]=1})})();
const LEGACY3=()=>typeof G!=='undefined'&&G&&(G.legacy3||G.legacy2);
function linkExits3(id,fn){const old=ZONE_BUILD[id];ZONE_BUILD[id]=function(z){old(z);if(!LEGACY3())fn(z)}}
linkExits3('collserola',z=>{exitR(z,43,20,1,4,'maresme',2.5,22);z.arrive.maresme={x:41.5,y:22}});
linkExits3('montseny',z=>{exitR(z,43,20,1,4,'maresme',15.5,2.5);z.arrive.maresme={x:41.5,y:22}});
ZONE_BUILD.maresme=function(z){
 waterR(z,40,0,4,44);fillR(z,36,0,4,44,T.SAND);floorR(z,14,16,13,10,T.FLAG);
 roadPoly(z,[[0,22],[14,22]],2,T.PATH);roadPoly(z,[[27,21.5],[37,21.5]],2,T.COBBLE);roadPoly(z,[[15.5,0],[15.5,16]],2,T.PATH);roadPoly(z,[[20,26],[20,40]],2,T.PATH);roadPoly(z,[[20,32],[34,32]],2,T.PATH);roadPoly(z,[[15.5,9],[34,9]],2,T.PATH);
 bld(z,{id:'ayto_mt',name:'Casa de la Vila d\'Iluro',kind:'ayuntamiento',x:17,y:3,w:7,h:5,door:3,style:'stone',roof:'slate',floors:2,fac:'concejo'});
 bld(z,{id:'seu_mt',name:'Santa Maria d\'Iluro',kind:'temple',x:28,y:3,w:6,h:6,door:2,style:'stone',roof:'goth',floors:3,tall:1});
 bld(z,{id:'lonja_mt',name:'Llotja del Peix',kind:'shop',x:28,y:13,w:6,h:5,door:2,style:'white',roof:'terra',floors:2,shop:'general',fac:'mercaderes'});
 bld(z,{id:'fonda_mt',name:'Fonda de la Sirena Vella',kind:'inn',x:5,y:15,w:7,h:5,door:3,style:'timber',roof:'terra',floors:2,shop:'inn',rent:6});
 bld(z,{id:'astillero_mt',name:'Drassana d\'Iluro',kind:'smith',x:28,y:24,w:6,h:5,door:2,style:'timber',roof:'thatch',shop:'smith',fac:'artesanos',st:['forge']});
 bld(z,{id:'forn_mt',name:'Forn del Moll',kind:'bakery',x:5,y:24,w:4,h:4,door:1,style:'white',roof:'terra',prod:'bakery',shop:'bread',st:['kitchen']});
 bld(z,{id:'botica_mt',name:'Botica de la Mar',kind:'apothecary',x:10,y:24,w:4,h:4,door:2,style:'ochre',roof:'terra',shop:'apo',st:['alchemy']});
 bld(z,{id:'salazon_mt',name:'Salazones de Can Garum',kind:'fisher',x:25,y:33,w:6,h:4,door:1,style:'stone',roof:'terra',prod:'fisher'});
 bld(z,{id:'cuartel_mt',name:'Cuartel de la Atalaya',kind:'barracks',x:4,y:4,w:5,h:4,door:2,style:'stone',roof:'slate'});
 bld(z,{id:'atalaya_mt',name:'Torre de Guaita',kind:'landmark',x:32,y:36,w:3,h:3,style:'dark',roof:'goth',floors:5,tall:2});
 bld(z,{id:'molino_mt',name:'Molino de Viento',kind:'mill',x:8,y:33,w:4,h:4,door:1,style:'stone',roof:'thatch',prod:'mill'});
 [[5,9],[10,9],[15,29],[14,34],[23,28],[22,38]].forEach((p,i)=>bld(z,{id:'casa_mt'+(i+1),name:['Casa del Pescador','Casa de la Xarxaire','Casa del Patró','Casa de les Salaó','Casa del Rec','Casa de la Veïna Vella'][i],kind:'house',x:p[0],y:p[1],w:4,h:4,door:1,style:HSTY[i],roof:i%2?'terra':'thatch',forSale:i===2?380:undefined}));
 fillR(z,2,38,14,5,T.FARM,true);plot(z,'mt_p1',2,38,7,5,210,'Horts del Rec',0);plot(z,'mt_p2',9,38,7,5,230,'Vinyes de la Vora',0);
 for(let i=0;i<4;i++)stall(z,'mtst'+i,[16.5,19.5,22.5,25.5][i],17.5);
 [[15,16],[26,16],[15,25],[26,25],[21,9],[21,32],[8,22],[34,21]].forEach(p=>prop(z,'lamp',p[0]+.5,p[1]+.5));
 prop(z,'well',12.5,28.5,{solid:1});prop(z,'fountain',20.5,20.5,{solid:1,deco:1});
 [[27,22],[18,35],[24,30]].forEach(p=>prop(z,'barrel',p[0]+.5,p[1]+.5,{solid:1}));[[23,14],[27,30]].forEach(p=>prop(z,'crate',p[0]+.5,p[1]+.5,{solid:1}));
 [[37,10],[37,28],[38,36],[37,16]].forEach((p,i)=>prop(z,'boat',p[0]+.5,p[1]+.5,{solid:1}));[[42,8],[42,24],[41,38]].forEach(p=>prop(z,'boat',p[0]+.5,p[1]+.5,{deco:1,water:1}));
 prop(z,'campfire',36.5,18.5,{});prop(z,'banner',20.5,15.5,{});
 for(let i=0;i<8;i++)prop(z,'flowers',[3,12,18,26,31,7,22,33][i]+.5,[13,12,24,20,28,31,40,18][i]+.5,{v:i});
 rockyDeco(z,[],[[34,6],[35,14],[35,30],[34,42]],[[3,20],[12,40],[30,41],[4,32],[13,6]]);
 exitR(z,0,20,1,4,'collserola',41.5,22);exitR(z,14,0,4,1,'montseny',41.5,22);
 z.arrive={collserola:{x:2.5,y:22},montseny:{x:15.5,y:2.5}};z.spawn={x:2.5,y:22};z.sea=1;
 z.spots={plaza:{x:20,y:21},market:{x:21,y:18.5},patrol:[[16,4],[20,21],[34,21],[8,22],[20,34]],beggar:[[17,24],[24,24]],port:{x:37,y:20}};
};
