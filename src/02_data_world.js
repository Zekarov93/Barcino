// ===================== DATOS DEL MUNDO: objetos, bienes, recetas, facciones, fauna, flora =====================
const ITEMS={};
function IT(id,n,o){ITEMS[id]=Object.assign({id,n,w:0.5,v:1},o);return ITEMS[id]}
// armas: dmg, rng, fin, two, vis
const WP=(id,n,dmg,v,w,k,c,o)=>IT(id,n,Object.assign({slot:'main',dmg,v,w,vis:{k,c:c||'#c9ced6'}},o||{}));
WP('daga','Daga','1d4',2,.5,'dagger',null,{fin:1});
WP('espada_corta','Espada corta','1d6',10,1,'sword',null,{fin:1});
WP('espada_larga','Espada larga','1d8',15,1.5,'sword');
WP('estoque','Estoque','1d8',25,1,'rapier',null,{fin:1});
WP('hacha_mano','Hacha de mano','1d6',5,1,'axe');
WP('hacha_grande','Gran hacha','1d12',30,3.5,'gaxe',null,{two:1});
WP('maza','Maza de hierro','1d6',5,2,'mace','#9aa0a8');
WP('martillo','Martillo de guerra','1d8',15,1,'hammer','#9aa0a8');
WP('lanza','Lanza','1d6',1,1.5,'spear');
WP('baston','Bastón de fresno','1d6',1,2,'staff','#7a5a36',{foc:1,two:1});
WP('garrote','Garrote','1d4',1,1,'club','#6a4a2a');
WP('arco_corto','Arco corto','1d6',25,1,'bow','#7a5a36',{rng:1,fin:1,two:1});
WP('arco_largo','Arco largo','1d8',50,1,'bow','#6a4a2a',{rng:1,fin:1,two:1});
WP('ballesta','Ballesta ligera','1d8',25,2.5,'crossbow','#6a4a2a',{rng:1,fin:1,two:1});
WP('varita','Varita','1d4',10,.2,'wand','#a08be0',{foc:1});
// armaduras (slot body)
const AR=(id,n,ac,dexcap,v,w,k,c,c2,o)=>IT(id,n,Object.assign({slot:'body',ac,dexcap,v,w,vis:{k,c,c2:c2||'#00000033'},dy:0},o||{}));
AR('ropa','Jubón de lino basto',10,null,1,1,'tunic','#8a7a62',null,{dy:1,tag:'ropa'});
AR('tunica','Túnica',10,null,2,1,'tunic','#8a6a4a',null,{dy:1,tag:'ropa'});
AR('tunica_fina','Túnica fina',10,null,15,1,'tunic','#5a5aa0','#d8c47a',{dy:1,tag:'ropa'});
AR('tunica_noble','Atuendo noble',10,null,60,1.5,'noble','#7a2e4a','#d8c47a',{dy:1,tag:'ropa'});
AR('vestido','Vestido',10,null,8,1,'dress','#a05a6a','#e8d8b0',{dy:1,tag:'ropa'});
AR('tunica_ropaje','Ropaje de erudito',10,null,10,1.5,'robe','#3a3a7a','#c8a84a',{dy:1,tag:'ropa'});
AR('acolchada','Armadura acolchada',11,null,5,4,'padded','#a89a78','#6a5a3a');
AR('armadura_cuero','Armadura de cuero',11,null,10,5,'leather','#8a5a30','#5a3a1c');
AR('cuero_tachonado','Cuero tachonado',12,null,45,6,'leather','#6a4a2a','#b8b8c0');
AR('pieles','Armadura de pieles',12,2,10,6,'hide','#8a6a40','#e8e0d0');
AR('camisote_malla','Camisote de malla',13,2,50,10,'chain','#a8aeb8','#6a7078');
AR('escamas','Cota de escamas',14,2,50,22,'chain','#8a9aa8','#4a5a68',{stealthDis:1});
AR('cota_malla','Cota de malla',16,0,75,25,'chain','#9aa0aa','#5a6068',{stealthDis:1,str:13});
AR('laminas','Armadura de láminas',17,0,200,30,'plate','#8f949c','#4a4f58',{stealthDis:1,str:15});
AR('placas','Armadura de placas',18,0,1500,32,'plate','#b8bec8','#6a7078',{stealthDis:1,str:15});
IT('escudo','Rodela de madera',{slot:'off',acb:2,v:10,w:3,vis:{k:'shield',c:'#7a5a36',c2:'#b8b8c0'}});
IT('libro','Libro de conjuros',{slot:'off',v:25,w:1.5,vis:{k:'tome',c:'#5a2e6a',c2:'#d8c47a'},foc:1});
IT('antorcha','Antorcha',{slot:'off',v:1,w:.5,vis:{k:'torch',c:'#6a4a2a',c2:'#ff9a3a'}});
IT('laud','Laúd',{slot:'off',v:35,w:1,vis:{k:'lute',c:'#9a6a36',c2:'#3a2a1a'},bon:{perf:2}});
IT('orbe','Orbe arcano',{slot:'off',v:80,w:1,vis:{k:'orb',c:'#7ac8ff',c2:'#fff'},foc:1,bon:{arcana:1}});
// ropa
const HD=(id,n,k,c,v,o)=>IT(id,n,Object.assign({slot:'head',v,w:.5,vis:{k,c},dy:1},o||{}));
HD('capucha','Capucha','hood','#4a4a4a',2);HD('gorro','Gorro de lana','cap','#6a8a4a',2);HD('sombrero_ala','Sombrero de ala ancha','hat','#8a6a3a',4);
HD('sombrero_pluma','Sombrero con pluma','hatp','#7a2e4a',10);HD('sombrero','Sombrero puntiagudo','wiz','#3a3a7a',8,{bon:{arcana:1}});
HD('casco_hierro','Casco de hierro','helm','#a8aeb8',20,{dy:0,acb:0});HD('yelmo','Yelmo completo','greathelm','#b8bec8',60,{dy:0,w:2});
HD('diadema','Diadema de plata','circlet','#d8dce6',90,{dy:0,bon:{persu:1}});HD('corona','Corona de oro','crown','#e8c040',400,{dy:0,bon:{persu:2}});
const LG=(id,n,k,c,v,o)=>IT(id,n,Object.assign({slot:'legs',v,w:.5,vis:{k,c},dy:1},o||{}));
LG('pantalon','Calzones de lana','pants','#6a5a3a',2);LG('falda','Falda','skirt','#7a4a5a',3);LG('calzas','Calzas de hierro','greaves','#9aa0aa',30,{dy:0,w:3});LG('calzones','Calzones','shorts','#7a6a4a',1);
const FT=(id,n,k,c,v,o)=>IT(id,n,Object.assign({slot:'feet',v,w:.5,vis:{k,c},dy:1},o||{}));
FT('botas','Botas de cuero','boots','#5a3a1c',4);FT('botas_altas','Botas de viaje','hboots','#4a3018',12);FT('zapatos','Zapatos','shoes','#3a2a1a',3);FT('sandalias','Sandalias','sandals','#8a6a3a',1);
IT('capa','Capa de lana',{slot:'cloak',v:5,w:1,vis:{c:'#6a2e2e'},dy:1});
IT('capa_viaje','Capa de viaje',{slot:'cloak',v:12,w:1.2,vis:{c:'#4a5a3a'},dy:1,bon:{survival:1}});
IT('manto_fino','Manto de terciopelo',{slot:'cloak',v:70,w:1.2,vis:{c:'#4a2a6a'},dy:1,bon:{persu:1}});
IT('amuleto','Amuleto de latón',{slot:'neck',v:15,w:.1,vis:{k:'amulet',c:'#e8c040'}});
IT('anillo','Anillo de sello',{slot:'ring',v:40,w:.1,bon:{persu:1}});
IT('bufanda','Bufanda',{slot:'neck',v:3,w:.3,vis:{k:'scarf',c:'#a8542a'},dy:1});
IT('amuleto_tacto','Amuleto de la Moreneta',{slot:'neck',v:120,w:.1,vis:{k:'amulet',c:'#d8d8ff'},bon:{relig:2,insight:1}});
IT('anillo_sombra','Anillo de la Sombra',{slot:'ring',v:150,w:.1,bon:{stealth:2,sleight:1}});
// bienes y recursos
const GD=(id,n,cat,v,w,o)=>IT(id,n,Object.assign({cat,v,w:w||.5},o||{}));
GD('grano','Grano de trigo','agri',1,1);GD('harina','Harina de trigo','agri',2,1);GD('pan','Pan de payés','food',2,.5,{nut:25});
GD('cebolla','Cebolla','agri',1,.4,{nut:10});GD('col','Col','agri',1,.8,{nut:8});GD('ajo','Cabeza de ajos','agri',1,.2,{nut:5});GD('zanahoria','Zanahoria','agri',1,.3,{nut:10});GD('nabo','Nabo','agri',1,.5,{nut:9});GD('habas','Habas frescas','agri',2,.4,{nut:14});
GD('manzana','Manzana','agri',1,.3,{nut:10});GD('pera','Pera','agri',1,.3,{nut:10});GD('higo','Higos','agri',2,.3,{nut:10});GD('mora','Moras silvestres','agri',1,.2,{nut:6});GD('bellota','Bellotas de encina','agri',1,.2,{nut:8});GD('granada','Granada','agri',3,.4,{nut:8});
GD('uvas','Uvas negras','agri',2,.5,{nut:6});GD('aceituna','Aceitunas','agri',1,.5,{nut:5});GD('vino','Vino tinto','food',4,1,{nut:6,drink:1});
GD('aceite','Aceite de oliva','food',3,1);GD('queso_cabra','Queso de cabra curado','food',3,.5,{nut:18});GD('mato','Mató de Montserrat','food',4,.4,{nut:14});
GD('sardina','Sardinas','food',2,.5,{nut:18});GD('anchoa','Anchoas de l\'Escala','food',2,.3,{nut:16});GD('merluza','Merluza','food',4,.8,{nut:24});GD('dorada','Dorada','food',5,.7,{nut:22});GD('pulpo','Pulpo','food',6,.9,{nut:24});GD('trucha','Trucha de río','food',4,.5,{nut:20});
GD('carne_cerdo','Carne de cerdo','food',3,1,{nut:28});GD('carne_cordero','Carne de cordero','food',4,1,{nut:28});GD('carne_conejo','Carne de conejo','food',2,.5,{nut:22});GD('carne_corzo','Carne de corzo','food',5,1,{nut:30});GD('carne_jabali','Carne de jabalí','food',5,1.2,{nut:32});GD('carne_cabra','Carne de cabra montés','food',4,1,{nut:28});GD('pollo','Pollo','food',3,.8,{nut:26});
GD('huevos','Huevos de gallina','food',1,.3,{nut:10});GD('leche_cabra','Leche de cabra','food',1,1,{nut:8});GD('leche_oveja','Leche de oveja','food',2,1,{nut:9});GD('miel','Miel de romero','food',4,.5,{nut:14});GD('sal','Sal de Cardona','agri',2,.5);
GD('castanas','Castañas asadas','food',1,.4,{nut:15});GD('panellets','Panellets de piñón','food',3,.3,{nut:20});GD('turron','Turrón de almendra','food',3,.3,{nut:14});
GD('cocas','Coca de Sant Joan','food',3,.5,{nut:22});GD('cerveza','Cerveza de cebada','food',2,1,{nut:7,drink:1});GD('estofado','Estofado de la casa','food',4,1,{nut:45});GD('escudella','Escudella catalana','food',5,1,{nut:50});
GD('madera_pino','Madera de pino','raw',1,2);GD('madera_encina','Madera de encina','raw',2,2.5);GD('madera_castano','Madera de castaño','raw',2,2);GD('madera_olivo','Madera de olivo','raw',3,2);
GD('caliza','Bloque de caliza','raw',1,3);GD('conglomerado','Conglomerado de Montserrat','raw',2,3);GD('mineral','Mineral de hierro','raw',3,3);GD('carbon','Carbón vegetal','raw',2,2);GD('lingote','Lingote de hierro','raw',10,2);
GD('piel_conejo','Piel de conejo','raw',2,.5);GD('piel_corzo','Piel de corzo','raw',4,1.5);GD('piel_jabali','Piel de jabalí','raw',4,1.5);GD('piel_lobo','Piel de lobo','raw',6,1.5);GD('piel_zorro','Piel de zorro','raw',4,.7);GD('piel_cabra','Piel de cabra montés','raw',4,1.2);GD('piel_oveja','Piel de oveja','raw',3,1.2);GD('piel_vibora','Piel de víbora gigante','raw',7,.6);GD('piel_rata','Piel de rata gigante','raw',1,.3);GD('piel_ogro','Piel de ogro','raw',15,3);GD('membrana','Membrana de murciélago gigante','raw',5,.3);
GD('cuero','Cuero curtido','raw',6,1);GD('lana','Lana de oveja','raw',2,.5);GD('tela','Tela de lino','raw',5,.5);GD('cuerda','Cuerda de cáñamo','raw',3,.5);
GD('romero_h','Romero','herb',2,.2);GD('tomillo_h','Tomillo','herb',2,.2);GD('salvia_h','Salvia','herb',3,.2);GD('niscalo','Níscalo','herb',3,.3,{nut:6});GD('rovellon','Rovelló','herb',3,.3,{nut:6});GD('rosas','Rosas rojas','herb',3,.2);GD('orquidea','Orquídea de la Moreneta','herb',45,.1,{rare:1});GD('hiperico','Flor de Sant Joan','herb',6,.1);
GD('libro_g','Códice de cuentas','misc',15,1);GD('tinta','Tinta de agalla','misc',4,.3);GD('pluma_cuervo','Pluma de cuervo','raw',1,.1);GD('pluma_gaviota','Pluma de gaviota','raw',1,.1);GD('pluma_gallina','Pluma de gallina','raw',1,.1);GD('colmillo_jabali','Colmillo de jabalí','raw',8,.5);GD('colmillo_ogro','Colmillo de ogro','raw',20,.8);GD('cuerno_cabra','Cuerno de cabra montés','raw',10,.7);GD('cristal','Cristal arcano','raw',60,.3,{rare:1});
GD('escama','Escama de víbria','raw',150,.3,{rare:1});GD('veneno','Glándula de veneno','raw',20,.2);
GD('pocion','Poción de curación','potion',25,.3,{heal:'2d4+2'});GD('antidoto','Antídoto','potion',15,.3,{cure:1});GD('pocion_gran','Poción de curación mayor','potion',80,.3,{heal:'4d4+4'});
// semillas / herramientas
const SD=(id,n,sp,v)=>IT(id,n,{cat:'seed',sp,v,w:.1});
SD('semilla_trigo','Semillas de trigo','trigo',2);SD('semilla_col','Semillas de col','col',2);SD('semilla_cebolla','Semillas de cebolla','cebolla',2);SD('semilla_zanahoria','Semillas de zanahoria','zanahoria',2);SD('semilla_vid','Esqueje de vid','vid',8);
SD('sap_pino','Piñón','pino',2);SD('sap_encina','Bellota','encina',2);SD('sap_olivo','Plantón de olivo','olivo',12);SD('sap_castano','Castaña para sembrar','castano',3);
SD('sem_romero','Esqueje de romero','romero',3);SD('sem_orquidea','Semilla de orquídea','orquidea',60);
const TL=(id,n,v,tool)=>IT(id,n,{cat:'tool',tool,v,w:2});
TL('hacha_tala','Hacha de leñador',8,'axe');TL('pico','Pico de minero',10,'pick');TL('cana','Caña de pescar',5,'rod');TL('hoz','Hoz',4,'sickle');TL('pala','Pala',5,'shovel');
IT('trampa','Trampa de caza',{cat:'tool',tool:'trap',v:12,w:2});
for(const k of Object.keys(ITEMS)){const I=ITEMS[k];if(I.cat==='food'&&!I.nut)I.nut=8}
// ---- FAMILIAS: grupos de objetos específicos (requisitos de recetas y listas). Nunca existen como objeto. ----
const FAMILY={verdura:['cebolla','col','ajo','zanahoria','nabo','habas'],fruta:['manzana','pera','higo','mora','bellota','granada'],
 carne:['carne_cerdo','carne_cordero','carne_conejo','carne_corzo','carne_jabali','carne_cabra','pollo'],pescado:['sardina','anchoa','merluza','dorada','pulpo','trucha'],
 hierbas:['romero_h','tomillo_h','salvia_h'],setas:['niscalo','rovellon'],madera:['madera_pino','madera_encina','madera_castano','madera_olivo'],piedra:['caliza','conglomerado'],
 piel:['piel_conejo','piel_corzo','piel_jabali','piel_lobo','piel_zorro','piel_cabra','piel_oveja','piel_vibora','piel_rata','piel_ogro'],
 leche:['leche_cabra','leche_oveja'],queso:['queso_cabra','mato'],dulces:['turron','panellets'],pluma:['pluma_cuervo','pluma_gaviota','pluma_gallina']};
const FAMN={verdura:'hortaliza (cualquiera)',fruta:'fruta (cualquiera)',carne:'carne (cualquiera)',pescado:'pescado (cualquiera)',hierbas:'hierba aromática (cualquiera)',setas:'seta (cualquiera)',madera:'madera (cualquiera)',piedra:'piedra de cantera (cualquiera)',piel:'piel (cualquiera)',leche:'leche (cualquiera)',queso:'queso (cualquiera)',dulces:'dulce (cualquiera)',pluma:'plumas (cualesquiera)'};
const FAM_REV={};for(const f in FAMILY)FAMILY[f].forEach(i=>FAM_REV[i]=f);FAM_REV.queso_cabra='queso';FAM_REV.mato='queso';FAM_REV.turron='dulces';FAM_REV.panellets='dulces';
function famOf(id){return FAM_REV[id]||id}
function iname(id){return ITEMS[id]?ITEMS[id].n:(FAMN[id]||id)}
function famPick(f,zone){const L=FAMILY[f];if(!L)return f;let pool=L;
 if(f==='pescado')pool=(zone==='martorell'||zone==='collbato'||zone==='montserrat')?['trucha']:['sardina','anchoa','merluza','dorada','pulpo'];
 else if(f==='carne')pool=(zone==='collserola')?['carne_conejo','carne_corzo','carne_jabali']:(zone==='collbato'||zone==='montserrat')?['carne_cabra','carne_cordero']:['carne_cerdo','carne_cordero','pollo'];
 else if(f==='madera')pool=(zone==='garraf')?['madera_pino','madera_olivo']:['madera_pino','madera_encina','madera_castano'];
 else if(f==='piedra')pool=(zone==='collbato'||zone==='montserrat')?['conglomerado']:['caliza'];
 else if(f==='piel')pool=(zone==='collserola')?['piel_conejo','piel_corzo','piel_jabali','piel_zorro']:['piel_oveja','piel_cabra','piel_conejo'];
 return pool[Math.floor(Math.random()*pool.length)]}
// muebles y construcciones (colocables)
const PLACE={};
function PL(id,n,cost,mats,o){PLACE[id]=Object.assign({id,n,cost,mats,w:1,h:1,solid:true,cat:'mueble'},o||{})}
PL('valla_madera_b','Valla de madera baja',4,{madera:1},{cat:'valla',fh:.7,hp:20,mat:'wood'});
PL('valla_madera_a','Valla de madera alta',8,{madera:2},{cat:'valla',fh:1.5,hp:35,mat:'wood'});
PL('valla_piedra_b','Muro de piedra bajo',10,{piedra:2},{cat:'valla',fh:.8,hp:60,mat:'stone'});
PL('valla_piedra_a','Muro de piedra alto',22,{piedra:4},{cat:'valla',fh:1.9,hp:100,mat:'stone'});
PL('valla_hierro','Reja de hierro',30,{lingote:1,madera:1},{cat:'valla',fh:1.6,hp:90,mat:'iron'});
PL('cama','Cama',30,{madera:3,tela:2},{bed:1,spr:'furn_bed'});PL('mesa','Mesa',15,{madera:3},{spr:'furn_table'});PL('silla','Silla',8,{madera:1},{spr:'furn_chair',solid:false});
PL('cofre','Cofre',20,{madera:2,lingote:1},{store:1,spr:'furn_chest'});PL('estanteria','Estantería',25,{madera:3},{spr:'furn_shelf'});
PL('fogon','Fogón de cocina',35,{piedra:4,lingote:1},{station:'kitchen',spr:'furn_stove'});PL('forja','Forja',90,{piedra:6,lingote:3,carbon:2},{station:'forge',spr:'furn_forge'});
PL('mesa_alq','Mesa de alquimia',70,{madera:3,cristal:1},{station:'alchemy',spr:'furn_alch'});PL('telar','Telar',50,{madera:5,cuerda:2},{station:'loom',spr:'furn_loom'});
PL('banco','Banco de carpintero',40,{madera:4,lingote:1},{station:'bench',spr:'furn_bench'});PL('curtidor','Bastidor de curtido',30,{madera:3,cuerda:2},{station:'tannery',spr:'furn_tan'});
PL('alfombra','Alfombra',20,{tela:2},{spr:'furn_rug',solid:false,flat:1});PL('farol','Farol',12,{lingote:1},{spr:'furn_lamp',light:1});PL('estatua','Estatua',120,{piedra:5},{spr:'furn_statue'});
PL('fuente','Fuente',150,{piedra:6},{spr:'furn_fountain'});PL('bancal','Bancal de cultivo',6,{madera:1},{cat:'cultivo',spr:'furn_plot',solid:false,flat:1,plot:1});
PL('corral','Comedero de corral',10,{madera:2},{cat:'cultivo',spr:'furn_trough',solid:false,pen:1});

// recetas: tool (competencia), st (estación), in, out, dc, min
const RECIPES=[
{id:'r_pan',n:'Hornear pan',tool:'cook',st:'kitchen',in:{harina:2},out:['pan',3],dc:8,min:60,xp:10},
{id:'r_estofado',n:'Cocinar estofado',tool:'cook',st:'kitchen',in:{carne:1,verdura:2},out:['estofado',2],dc:10,min:60,xp:15},
{id:'r_panellets',n:'Hacer panellets',tool:'cook',st:'kitchen',in:{harina:1,miel:1},out:['panellets',4],dc:11,min:90,xp:20},
{id:'r_queso',n:'Curar queso',tool:'cook',st:'kitchen',in:{leche:3},out:['queso_cabra',1],dc:9,min:90,xp:10},
{id:'r_lingote',n:'Fundir lingote',tool:'smith',st:'forge',in:{mineral:2,carbon:1},out:['lingote',1],dc:10,min:90,xp:20},
{id:'r_daga',n:'Forjar daga',tool:'smith',st:'forge',in:{lingote:1},out:['daga',1],dc:10,min:60,xp:25},
{id:'r_espada',n:'Forjar espada larga',tool:'smith',st:'forge',in:{lingote:2,cuero:1},out:['espada_larga',1],dc:13,min:150,xp:50},
{id:'r_hacha',n:'Forjar hacha de leñador',tool:'smith',st:'forge',in:{lingote:1,madera:1},out:['hacha_tala',1],dc:9,min:60,xp:20},
{id:'r_pico',n:'Forjar pico',tool:'smith',st:'forge',in:{lingote:1,madera:1},out:['pico',1],dc:9,min:60,xp:20},
{id:'r_malla',n:'Forjar cota de malla',tool:'smith',st:'forge',in:{lingote:6,cuero:2},out:['cota_malla',1],dc:15,min:360,xp:120},
{id:'r_cuero',n:'Curtir cuero',tool:'leath',st:'tannery',in:{piel:2},out:['cuero',2],dc:9,min:90,xp:10},
{id:'r_arm_cuero',n:'Coser armadura de cuero',tool:'leath',st:'tannery',in:{cuero:4},out:['armadura_cuero',1],dc:12,min:180,xp:40},
{id:'r_tela',n:'Tejer tela',tool:'weav',st:'loom',in:{lana:2},out:['tela',1],dc:9,min:60,xp:10},
{id:'r_tunica',n:'Confeccionar túnica',tool:'weav',st:'loom',in:{tela:3},out:['tunica',1],dc:10,min:120,xp:20},
{id:'r_capa',n:'Confeccionar capa de viaje',tool:'weav',st:'loom',in:{tela:3,cuero:1},out:['capa_viaje',1],dc:12,min:180,xp:30},
{id:'r_pocion',n:'Preparar poción de curación',tool:'alch',st:'alchemy',in:{hierbas:3,setas:1},out:['pocion',1],dc:12,min:90,xp:30},
{id:'r_antidoto',n:'Preparar antídoto',tool:'herb',st:'alchemy',in:{hierbas:2,veneno:1},out:['antidoto',1],dc:11,min:60,xp:25},
{id:'r_cuerda',n:'Trenzar cuerda',tool:'weav',st:'loom',in:{lana:2},out:['cuerda',2],dc:8,min:30,xp:5},
{id:'r_tinta',n:'Preparar tinta',tool:'alch',st:'alchemy',in:{hierbas:1,carbon:1},out:['tinta',2],dc:8,min:30,xp:5},
{id:'r_vino',n:'Prensar vino',tool:'brew',st:'kitchen',in:{uvas:4},out:['vino',2],dc:10,min:120,xp:15},
{id:'r_aceite',n:'Prensar aceite',tool:'brew',st:'kitchen',in:{aceituna:4},out:['aceite',2],dc:9,min:90,xp:10}
];
const QNAMES=['Tosco','Común','Fino','Excelente','Magistral'];
const QMULT=[.6,1,1.4,2,3];
const STATION_N={kitchen:'fogón',forge:'forja',alchemy:'mesa de alquimia',loom:'telar',bench:'banco de carpintero',tannery:'bastidor de curtido'};

// facciones
const FACTIONS={
concejo:{n:'Concejo de Barcino',c:'#c8a84a',d:'Gobierno de la ciudad: tributos, guardia y ciudadanía.',ranks:['Forastero','Residente','Ciudadano','Prohombre','Consejero'],req:[0,10,30,55,80],priv:['—','Sin tasas de entrada; puedes alquilar habitaciones','Puedes comprar casas y terrenos en la ciudad','Descuento en tasas; la Guardia te ayuda','Exención de impuestos; voz en el Concejo'],bld:'ayuntamiento'},
mercaderes:{n:'Gremio de Mercaderes de la Llotja',c:'#d8a040',d:'Controla el comercio de la Rambla.',ranks:['Ajeno','Aprendiz','Compañero','Maestro','Prohombre'],req:[0,10,30,55,80],priv:['—','Puedes montar un puesto en el mercado','−5% en compras','−10% en compras, +10% en ventas','−15% y subastas privadas'],bld:'llotja'},
artesanos:{n:'Hermandad de Artesanos de Sant Eloi',c:'#c06a3a',d:'Maestros herreros, tejedores y alquimistas.',ranks:['Ajeno','Aprendiz','Oficial','Maestro','Gran Maestro'],req:[0,10,30,55,80],priv:['—','Uso gratuito de talleres públicos','+1 a la fabricación','Recetas de maestro; +2 a la fabricación','Taller propio y aprendices'],bld:'herreria'},
orden:{n:'Comunidad de Montserrat',c:'#9aa8d8',d:'Monjes del monasterio de la Moreneta.',ranks:['Peregrino','Oblato','Hermano','Prior','Abad'],req:[0,10,30,55,80],priv:['—','Curación y refugio gratis','Acceso a la biblioteca (lore)','Bendiciones; −20% en curaciones','Voz en la comunidad y reliquias'],bld:'monasterio'},
circulo:{n:'Círculo de Collserola',c:'#6aa860',d:'Druidas y guardabosques que protegen los bosques.',ranks:['Ajeno','Amigo del bosque','Guardián','Hierofante','Archidruida'],req:[0,10,30,55,80],priv:['—','Las bestias te miran con menos recelo','Conocimiento de hierbas raras','Las criaturas pasivas no huyen','Aliado de los espíritus del bosque'],bld:'claro'},
sombra:{n:'La Sombra del Raval',c:'#8a6aa8',d:'Hermandad de ladrones, contrabandistas y espías.',ranks:['Desconocido','Mano','Sombra','Lugarteniente','Maestro de la Sombra'],req:[0,10,30,55,80],priv:['—','Compras en el mercado negro','Receptadores aceptan lo robado','Escondite seguro; −guardia','Controlas el Raval'],bld:'taberna_raval'},
castellers:{n:'Colla Castellera de la Rambla',c:'#d85a5a',d:'Levantan torres humanas: orgullo y fama popular.',ranks:['Espectador','Pinya','Tronc','Pom de dalt','Cap de colla'],req:[0,10,30,55,80],priv:['—','Popularidad en fiestas','+1 a Atletismo en festivos','Ovaciones: +fama','Líder carismático de las fiestas'],bld:'plaza_castells'}
};
const FAC_IDS=Object.keys(FACTIONS);

// fauna
const CREAT={
conejo:{n:'Conejo',diet:'herb',hp:2,ac:10,atk:0,dmg:'1',xp:5,spd:1.8,sz:.45,bi:['forest','coast','hills','river','mountain'],mat:8,gest:3,litter:[2,5],breed:[1,2,3,4,5,6,7,8,9],life:250,loot:{carne_conejo:[1,1],piel_conejo:[1,1]},flee:1,aggro:0,cap:{collserola:26,martorell:16,collbato:14,montserrat:10}},
ciervo:{n:'Corzo',diet:'herb',hp:11,ac:12,atk:3,dmg:'1d6',xp:30,spd:2.4,sz:.95,bi:['forest','hills'],mat:30,gest:8,litter:[1,2],breed:[4,5,6],life:700,loot:{carne_corzo:[3,5],piel_corzo:[1,2]},flee:.9,aggro:0,cap:{collserola:12}},
jabali:{n:'Jabalí',diet:'omni',hp:25,ac:11,atk:3,dmg:'1d6+1',xp:60,spd:2.2,sz:.9,bi:['forest','hills'],mat:30,gest:8,litter:[2,4],breed:[2,3,4,5],life:700,loot:{carne_jabali:[4,6],piel_jabali:[1,2],colmillo_jabali:[0,1]},flee:.2,aggro:.35,cap:{collserola:11,collbato:7}},
lobo:{n:'Lobo',diet:'carn',hp:11,ac:13,atk:4,dmg:'2d4+2',xp:100,spd:2.9,sz:.85,bi:['forest','hills','mountain'],mat:30,gest:8,litter:[2,4],breed:[2,3,4],life:800,loot:{piel_lobo:[1,2]},flee:.1,aggro:.6,prey:['conejo','ciervo','cabra','oveja','zorro','jabali'],cap:{collserola:7,collbato:4,montserrat:4}},
zorro:{n:'Zorro',diet:'carn',hp:7,ac:13,atk:2,dmg:'1d4',xp:25,spd:2.6,sz:.55,bi:['forest','river','hills'],mat:20,gest:6,litter:[2,4],breed:[1,2,3,4],life:500,loot:{piel_zorro:[1,1]},flee:.8,aggro:.05,prey:['conejo','gallina','rata','cuervo'],cap:{collserola:8,martorell:6,collbato:5}},
cabra:{n:'Cabra montés',diet:'herb',hp:13,ac:12,atk:3,dmg:'1d6',xp:40,spd:2.4,sz:.8,bi:['mountain','hills'],mat:25,gest:8,litter:[1,2],breed:[4,5,6],life:600,loot:{carne_cabra:[3,4],piel_cabra:[1,1],cuerno_cabra:[1,1]},flee:.6,aggro:.05,cap:{collbato:12,montserrat:20}},
cuervo:{n:'Cuervo',diet:'omni',hp:1,ac:12,atk:0,dmg:'1',xp:2,spd:2.2,sz:.4,bi:['forest','coast','river','hills','mountain'],mat:8,gest:2,litter:[2,3],breed:[2,3,4,5,6],life:400,eggs:1,loot:{pluma_cuervo:[1,2]},flee:1,aggro:0,fly:1,cap:{barcino:10,collserola:12,martorell:8,collbato:8,montserrat:12}},
gaviota:{n:'Gaviota',diet:'omni',hp:2,ac:12,atk:0,dmg:'1',xp:2,spd:2.3,sz:.45,bi:['coast'],mat:8,gest:2,litter:[2,3],breed:[3,4,5,6],life:400,eggs:1,loot:{pluma_gaviota:[1,2]},flee:1,aggro:0,fly:1,cap:{barcino:16}},
rata:{n:'Rata gigante',diet:'omni',hp:7,ac:12,atk:4,dmg:'1d4+2',xp:25,spd:2.2,sz:.5,bi:['coast','river','hills'],mat:4,gest:2,litter:[3,6],breed:[0,1,2,3,4,5,6,7,8,9,10,11],life:120,loot:{piel_rata:[0,1]},flee:.4,aggro:.5,plague:1,cap:{barcino:22,martorell:12,collbato:10}},
gato:{n:'Gato callejero',diet:'carn',hp:2,ac:12,atk:1,dmg:'1',xp:3,spd:2.4,sz:.4,bi:['coast','river'],mat:10,gest:5,litter:[2,4],breed:[2,3,4,5,6,7],life:600,loot:{},flee:.9,aggro:0,prey:['rata','cuervo'],cap:{barcino:10,martorell:5}},
murcielago:{n:'Murciélago gigante',diet:'carn',hp:22,ac:13,atk:4,dmg:'1d6+2',xp:50,spd:2.5,sz:.8,bi:['hills','mountain'],mat:12,gest:6,litter:[1,2],breed:[4,5,6],life:300,loot:{membrana:[0,1]},flee:.3,aggro:.55,fly:1,prey:['rata','conejo'],cap:{collbato:18,montserrat:9}},
vibora:{n:'Víbora gigante',diet:'carn',hp:11,ac:13,atk:4,dmg:'1d6+2',xp:50,spd:1.7,sz:.7,bi:['forest','hills','mountain','river'],mat:15,gest:6,litter:[3,6],breed:[4,5,6,7],life:500,eggs:1,loot:{veneno:[1,1],piel_vibora:[0,1]},flee:.2,aggro:.5,prey:['rata','conejo'],cap:{collserola:5,martorell:3,collbato:5,montserrat:6}},
trasgo:{n:'Trasgo',diet:'omni',hp:7,ac:15,atk:4,dmg:'1d6+2',xp:50,spd:2.4,sz:.62,bi:['forest','hills'],mat:20,gest:10,litter:[1,2],breed:[3,4,5,6,7,8],life:600,loot:{daga:[0,1]},gold:[2,12],flee:.1,aggro:.9,monster:1,hum:1,prey:['conejo','ciervo','oveja','jabali'],cap:{collserola:6,collbato:8}},
ogro:{n:'Ogro de las cuevas',diet:'omni',hp:59,ac:11,atk:6,dmg:'2d8+4',xp:450,spd:2.2,sz:1.5,bi:['hills'],mat:60,gest:14,litter:[1,1],breed:[5,6,7],life:1500,loot:{piel_ogro:[2,3],colmillo_ogro:[1,2]},gold:[10,60],flee:0,aggro:.9,monster:1,hum:1,prey:['ciervo','jabali','cabra','oveja'],cap:{collbato:2}},
vibria:{n:'La Víbria',diet:'carn',hp:70,ac:15,atk:7,dmg:'2d8+4',xp:1100,spd:2.3,sz:1.6,bi:['mountain'],mat:200,gest:60,litter:[1,1],breed:[5,6],life:20000,eggs:1,loot:{escama:[2,3],cristal:[1,1]},gold:[100,300],flee:0,aggro:.7,monster:1,fly:1,unique:1,prey:['cabra','lobo','ciervo'],cap:{montserrat:2}},
gallina:{n:'Gallina',diet:'herb',hp:2,ac:10,atk:0,dmg:'1',xp:1,spd:1.2,sz:.4,bi:[],mat:6,gest:1,litter:[1,2],breed:[0,1,2,3,4,5,6,7,8,9,10,11],life:500,eggs:1,dom:1,loot:{pollo:[1,1],pluma_gallina:[1,2]},flee:.5,aggro:0,prod:'huevos',cap:{}},
oveja:{n:'Oveja',diet:'herb',hp:6,ac:10,atk:0,dmg:'1',xp:2,spd:1.2,sz:.7,bi:[],mat:20,gest:8,litter:[1,2],breed:[8,9,10,11,0],life:900,dom:1,loot:{carne_cordero:[3,4],piel_oveja:[1,1],lana:[1,2]},flee:.5,aggro:0,prod:'lana',cap:{}},
cabra_d:{n:'Cabra doméstica',diet:'herb',hp:6,ac:10,atk:1,dmg:'1',xp:2,spd:1.4,sz:.65,bi:[],mat:20,gest:8,litter:[1,2],breed:[8,9,10,11,0],life:900,dom:1,loot:{carne_cabra:[3,3],piel_cabra:[1,1],leche_cabra:[1,2]},flee:.5,aggro:0,prod:'leche_cabra',cap:{}}
};
const BIOME_HAB={forest:['forest'],coast:['coast'],river:['river'],hills:['hills'],mountain:['mountain']};

// flora
const FLORA={
pino:{n:'Pino carrasco',k:'tree',bi:['forest','hills','mountain','coast'],mat:18,chop:{item:'madera_pino',n:[3,5]},seedR:3,life:3000},
encina:{n:'Encina',k:'tree',bi:['forest','hills','river'],mat:25,chop:{item:'madera_encina',n:[4,6]},harv:{item:'bellota',n:[1,2],months:[9,10,11],name:'bellotas'},seedR:3,life:4000},
castano:{n:'Castaño',k:'tree',bi:['forest','mountain'],mat:25,chop:{item:'madera_castano',n:[3,5]},harv:{item:'castanas',n:[2,4],months:[8,9,10]},seedR:3,life:4000},
olivo:{n:'Olivo',k:'tree',bi:['coast','hills','river'],mat:30,chop:{item:'madera_olivo',n:[2,3]},harv:{item:'aceituna',n:[3,6],months:[9,10,11]},seedR:2,life:5000},
romero:{n:'Romero',k:'herb',bi:['hills','coast','mountain','forest'],mat:8,harv:{item:'romero_h',n:[1,3],months:[0,1,2,3,4,5,6,7,8,9,10,11]},seedR:3,life:1500},
tomillo:{n:'Tomillo',k:'herb',bi:['hills','mountain','forest'],mat:6,harv:{item:'tomillo_h',n:[1,2],months:[2,3,4,5,6,7,8,9]},seedR:3,life:1000},
zarza:{n:'Zarzamora',k:'herb',bi:['forest','river'],mat:10,harv:{item:'mora',n:[2,4],months:[7,8,9]},seedR:3,life:1500},
niscalo:{n:'Níscalo (seta)',k:'fungus',bi:['forest'],mat:3,harv:{item:'niscalo',n:[1,3],months:[8,9,10,11]},seedR:4,life:25,kill:1,wet:1},
rovellon:{n:'Rovelló (seta)',k:'fungus',bi:['forest','hills'],mat:3,harv:{item:'rovellon',n:[1,2],months:[9,10,11]},seedR:4,life:25,kill:1,wet:1},
hiperico:{n:'Hipérico (hierba de Sant Joan)',k:'herb',bi:['hills','forest','river'],mat:8,harv:{item:'hiperico',n:[1,2],months:[5,6]},seedR:3,life:700,kill:1},
orquidea:{n:'Orquídea de la Moreneta',k:'herb',bi:['mountain'],mat:20,harv:{item:'orquidea',n:[1,1],months:[3,4,5]},seedR:2,life:900,kill:1,rare:1},
trigo:{n:'Trigo',k:'crop',days:16,harv:{item:'grano',n:[4,7]},kill:1,months:[2,3,4,5,9,10],ripe:[5,6,7]},
col:{n:'Col',k:'crop',days:12,harv:{item:'col',n:[3,5]},kill:1,months:[2,3,4,8,9],ripe:[5,6,7,10,11]},
cebolla:{n:'Cebolla',k:'crop',days:10,harv:{item:'cebolla',n:[4,7]},kill:1,months:[2,3,4,5,9],ripe:[5,6,7,8,9]},
zanahoria:{n:'Zanahoria',k:'crop',days:9,harv:{item:'zanahoria',n:[4,6]},kill:1,months:[2,3,4,5,6,8,9],ripe:[4,5,6,7,8,9]},
vid:{n:'Vid',k:'crop',days:40,harv:{item:'uvas',n:[4,8]},months:[2,3,4],ripe:[7,8,9],perm:1},
};
const TREE_SP=['pino','encina','castano','olivo'];

// nombres
const NM={
hum_m:['Jordi','Pau','Marc','Arnau','Bernat','Guillem','Ramon','Pere','Joan','Narcís','Miquel','Oriol','Roger','Quim','Ferran','Biel','Sergi','Aleix','Llorenç','Nil'],
hum_f:['Montserrat','Núria','Laia','Marta','Mercè','Eulàlia','Jordina','Carme','Maria','Anna','Rosa','Griselda','Blanca','Elisenda','Violant','Àngels','Mireia','Queralt','Roser','Ona'],
sur:['Puig','Vidal','Ferrer','Soler','Roca','Serra','Pons','Camps','Vila','Bosch','Mas','Martí','Costa','Casals','Ribas','Vives','Pla','Garriga','Oliver','Saura','Castells','Torras','Güell','Carbonell'],
elf_m:['Aelion','Thalor','Erevan','Sylvar','Caelum','Ilrane'],elf_f:['Aelwen','Sylvana','Liriel','Naivara','Elaith','Ysolde'],
dw_m:['Brunor','Thorik','Dain','Baldrek','Harbek','Orsik'],dw_f:['Brunhild','Dagna','Helga','Vistra','Torra','Gunnloda'],
hal_m:['Perrin','Milo','Cade','Garret','Osborn','Wellby'],hal_f:['Lidda','Merla','Seraphina','Verna','Andry','Kithri'],
gno_m:['Fizzwick','Nim','Boddynock','Zook','Orryn','Wrenn'],gno_f:['Nissa','Breena','Zanna','Lilli','Tana','Pip'],
dra_m:['Arjhan','Kriv','Balasar','Torinn','Medrash'],dra_f:['Kava','Sora','Harann','Akra','Jheri'],
gol_m:['Gae-Al','Kuori','Maveith','Nalla','Thotham'],gol_f:['Vimak','Ilikan','Kavaki','Orilo','Egre'],
orc_m:['Grunk','Shump','Dench','Gell','Krusk','Ront'],orc_f:['Baggi','Emen','Engong','Myev','Ovak','Shautha'],
tie_m:['Zariel','Mordai','Skamos','Orianna','Rieta'],tie_f:['Akta','Anakis','Kallista','Lerissa','Nemeia']
};
function genName(sp,sex,r){r=r||rnd;const g=sex==='f'?'f':'m';const pk=a=>a[Math.floor(r()*a.length)];
 const key={human:'hum',elf:'elf',dwarf:'dw',halfling:'hal',gnome:'gno',dragonborn:'dra',goliath:'gol',orc:'orc',tiefling:'tie'}[sp]||'hum';
 const arr=NM[key+'_'+g]||NM['hum_'+g];let n=pk(arr);if(sp==='human'||sp==='halfling'||sp==='gnome'||r()<.55)n+=' '+pk(NM.sur);return n}
