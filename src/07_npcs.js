// ===================== NPC: oficios, personalidad, rutinas, relaciones =====================
function mkStack(id,n,q,c){const s={id,n:n||1};if(q)s.q=q;if(c)s.c=c;return s}
function invAdd(inv,id,n,q,c){q=q||0;for(const s of inv){if(s.id===id&&(s.q||0)===q&&(s.c||'')===(c||'')){s.n+=n;return s}}const s=mkStack(id,n,q,c);inv.push(s);return s}
function invCount(inv,id){const F=FAMILY[id];let n=0;for(const s of inv)if(s.id===id||(F&&F.includes(s.id)))n+=s.n;return n}
function invTake(inv,id,n){const F=FAMILY[id];let need=n;for(let i=inv.length-1;i>=0&&need>0;i--){const s=inv[i];if(!(s.id===id||(F&&F.includes(s.id))))continue;const t=Math.min(s.n,need);s.n-=t;need-=t;if(s.n<=0)inv.splice(i,1)}return n-need}
function stackVis(id,c){const I=ITEMS[id];if(!I||!I.vis)return null;const v=Object.assign({},I.vis);if(c&&I.dy)v.c=c;return v}
function eqVis(eq){const o={};for(const k of['head','body','legs','feet','cloak','main','off','neck']){const s=eq[k];if(s){const v=stackVis(s.id,s.c);if(v)o[k]=v}}return o}

const JOB={
posadero:{n:'Posadero',inside:1,sched:'shop',lvl:2,sk:['persu','insight'],ab:'cha',tag:'inn',items:['vino','pan','queso','estofado'],gold:[40,120],out:['tunica','zapatos']},
herrero:{n:'Herrero',inside:1,sched:'shop',lvl:3,sk:['athl','invest'],ab:'str',tag:'smith',items:['lingote','daga','hacha_tala','pico','carbon'],gold:[30,100],out:['armadura_cuero','botas']},
boticario:{n:'Boticario',inside:1,sched:'shop',lvl:2,sk:['medic','nature'],ab:'int',tag:'apo',items:['hierbas','pocion','antidoto','setas'],gold:[30,90],out:['tunica_ropaje','zapatos']},
sacerdote:{n:'Sacerdote',inside:1,sched:'monk',lvl:3,sk:['relig','insight'],ab:'wis',tag:'temple',items:['vino','pan'],gold:[10,40],out:['tunica_ropaje','sandalias']},
concejal:{n:'Consejero',inside:1,sched:'shop',lvl:3,sk:['persu','hist'],ab:'cha',tag:'hall',items:['libro_g','tinta'],gold:[120,400],out:['tunica_noble','zapatos']},
mercader:{n:'Mercader',stall:1,sched:'market',lvl:2,sk:['persu','insight'],ab:'cha',tag:'merch',items:['tela','vino','aceite','sal','cuerda'],gold:[40,150],out:['tunica_fina','sombrero_ala','zapatos']},
guardia:{n:'Guardia',patrol:1,sched:'guard',lvl:3,sk:['percep','athl'],ab:'str',tag:'guard',items:['pan','pocion'],gold:[5,25],out:['camisote_malla','casco_hierro','botas'],weap:['lanza','escudo']},
erudito:{n:'Erudito',inside:1,sched:'shop',lvl:3,sk:['arcana','hist','invest'],ab:'int',tag:'sage',items:['libro_g','tinta','cristal'],gold:[30,120],out:['tunica_ropaje','sombrero','zapatos']},
panadero:{n:'Panadero',inside:1,sched:'shop',lvl:1,sk:['invest','persu'],ab:'con',tag:'bread',items:['pan','harina','dulces'],gold:[15,50],out:['tunica','zapatos']},
molinero:{n:'Molinero',inside:1,sched:'shop',lvl:1,sk:['athl','invest'],ab:'str',tag:'mill',items:['harina','grano'],gold:[15,50],out:['tunica','botas']},
granjero:{n:'Granjero',outdoor:1,sched:'outdoor',lvl:1,sk:['animal','nature','survival'],ab:'con',tag:'farm',items:['grano','verdura','huevos','leche','semilla_trigo'],gold:[5,35],out:['tunica','sombrero_ala','botas']},
pescador:{n:'Pescador',outdoor:1,sched:'outdoor',lvl:1,sk:['survival','percep'],ab:'dex',tag:'fish',items:['pescado','cuerda','cana'],gold:[5,30],out:['tunica','gorro','botas']},
lenador:{n:'Leñador',outdoor:1,sched:'outdoor',lvl:2,sk:['athl','survival'],ab:'str',tag:'lumber',items:['madera','hacha_tala','cuerda'],gold:[10,50],out:['tunica','botas']},
cazador:{n:'Cazador',outdoor:1,sched:'outdoor',lvl:3,sk:['stealth','survival','animal'],ab:'dex',tag:'hunter',items:['carne','piel','arco_corto','trampa'],gold:[10,40],out:['armadura_cuero','capucha','botas_altas'],weap:['arco_largo']},
minero:{n:'Minero',outdoor:1,sched:'outdoor',lvl:2,sk:['athl','invest'],ab:'str',tag:'mine',items:['mineral','piedra','carbon','pico'],gold:[5,40],out:['tunica','casco_hierro','botas']},
cantero:{n:'Cantero',outdoor:1,sched:'outdoor',lvl:2,sk:['athl'],ab:'str',tag:'quarry',items:['piedra','pico'],gold:[5,40],out:['tunica','botas']},
curtidor:{n:'Curtidor',inside:1,sched:'shop',lvl:1,sk:['nature','invest'],ab:'con',tag:'tan',items:['cuero','piel'],gold:[10,40],out:['tunica','botas']},
tejedor:{n:'Tejedor',inside:1,sched:'shop',lvl:1,sk:['invest'],ab:'dex',tag:'weave',items:['tela','lana','cuerda'],gold:[10,40],out:['tunica','zapatos']},
monje:{n:'Monje',inside:1,sched:'monk',lvl:2,sk:['relig','hist','medic'],ab:'wis',tag:'monk',items:['miel','queso','vino','libro_g'],gold:[0,15],out:['tunica','sandalias']},
druida:{n:'Druida',outdoor:1,sched:'wild',lvl:4,sk:['nature','animal','medic'],ab:'wis',tag:'druid',items:['hierbas','setas','hiperico'],gold:[0,20],out:['pieles','capucha','capa_viaje'],weap:['baston']},
ladron:{n:'Ladrón',sched:'night',lvl:2,sk:['stealth','sleight'],ab:'dex',tag:'thief',items:['anillo','daga','vino'],gold:[20,90],out:['armadura_cuero','capucha','botas'],weap:['estoque']},
mendigo:{n:'Mendigo',beg:1,sched:'beggar',lvl:1,sk:['insight','percep'],ab:'wis',tag:'beg',items:['pan'],gold:[0,6],out:['ropa']},
juglar:{n:'Juglar',sched:'civil',lvl:2,sk:['perf','persu'],ab:'cha',tag:'bard',items:['laud','vino'],gold:[10,50],out:['tunica_fina','sombrero_pluma','zapatos'],weap:['laud']},
aldeano:{n:'Aldeano',sched:'civil',lvl:1,sk:['percep'],ab:'con',tag:'civ',items:['pan','verdura'],gold:[3,25],out:['tunica','botas']},
pastor:{n:'Pastor',outdoor:1,sched:'outdoor',lvl:1,sk:['animal','survival'],ab:'wis',tag:'herd',items:['lana','leche','queso'],gold:[5,25],out:['tunica','sombrero_ala','botas']},
marinero:{n:'Marinero',sched:'civil',lvl:2,sk:['athl','acro'],ab:'str',tag:'sail',items:['cuerda','pescado','vino'],gold:[10,50],out:['tunica','gorro','botas']},
viajero:{n:'Viajero',traveler:1,sched:'trav',lvl:3,sk:['survival','persu','insight'],ab:'dex',tag:'trav',items:['cristal','orquidea','escama'],gold:[80,400],out:['capa_viaje','botas_altas','tunica_fina']},
noble:{n:'Noble',sched:'civil',lvl:2,sk:['persu','hist'],ab:'cha',tag:'noble',items:['anillo','vino'],gold:[150,500],out:['tunica_noble','manto_fino','zapatos']}
};

const TRAITS=['warm','honest','brave','greed','curious','pious','humor','temper']; // 0..10
const TRAIT_N={warm:'Cordial',honest:'Honesto',brave:'Valiente',greed:'Codicioso',curious:'Curioso',pious:'Devoto',humor:'Bromista',temper:'Irascible'};
const TRAIT_NEG={warm:'Frío',honest:'Mentiroso',brave:'Cobarde',greed:'Desprendido',curious:'Apático',pious:'Descreído',humor:'Serio',temper:'Pacífico'};
const QUIRKS=['silba cuando está nervioso','lleva siempre una piedra de río en el bolsillo','habla a veces con un gato que nadie ve','cuenta sus pasos al caminar','colecciona botones de todas las formas','nunca bebe vino, solo agua con anís','llama «jefe» a todo el mundo','tiene pánico a los gatos negros','se sabe todos los refranes de la comarca','se ríe antes de dar malas noticias','dibuja garabatos en cualquier superficie','siempre ofrece castañas asadas','habla con acento del Empordà','toca madera cada vez que dice algo afortunado','tararea sardanas sin darse cuenta','guarda cada moneda en un calcetín'];
const ORIGINS=['nació en el Raval, entre almacenes y tabernas','creció en una masía cerca de Martorell','huyó de joven de una familia noble del Barri Gòtic','es hijo de pescadores del Port Vell','llegó de tierras lejanas siguiendo una caravana','se crió a la sombra del monasterio de Montserrat','vivió años en Collserola con un tío ermitaño','fue aprendiz en Collbató bajo un maestro severo','nació durante una nevada que cerró los caminos','creció en las calles de Barcino, de puerta en puerta'];
const HARD=['perdió a un hermano en una tormenta','vio arruinado su negocio por una estafa','estuvo a punto de morir por unas fiebres','cumplió condena por un delito que no cometió','fue abandonado el día de su boda','vio cómo un lobo gigante mataba a todo su ganado','combatió en las guerras del vizcondado y no habla de ello','perdió la fe tras una plegaria sin respuesta','enterró a su pareja hace unos años','fue traicionado por su mejor amigo'];
const GOALS=['quiere reunir dinero para comprar una casa en Gràcia','sueña con subir a lo alto de una torre de castells','busca a un hermano desaparecido','quiere ser aprendiz de un maestro arcano','desea que sus hijos tengan una vida mejor','espera ver alguna vez al Drac de Sant Jordi','ahorra para peregrinar a la Santa Cova','quiere vengarse de quien lo arruinó','sueña con abrir su propio negocio','quiere que lo dejen en paz de una vez'];
const SECRETS=[
 {id:'deuda_sombra',t:'debe una fortuna a La Sombra del Raval y teme que vengan a cobrarla',lev:'sombra'},
 {id:'noble_exiliado',t:'es en realidad un noble exiliado que huyó con un nombre falso',lev:'concejo'},
 {id:'cadaver',t:'enterró un cadáver bajo su huerto hace años, y no fue un accidente',lev:'crimen'},
 {id:'culto',t:'adora en secreto a un antiguo culto prohibido de la montaña',lev:'orden'},
 {id:'informante',t:'informa a la Guardia sobre sus propios vecinos a cambio de monedas',lev:'concejo'},
 {id:'roba_gremio',t:'roba poco a poco a su propio gremio y falsea las cuentas',lev:'mercaderes'},
 {id:'amor',t:'está enamorado en secreto de {rel} pero nunca ha tenido valor para decírselo',lev:'amor'},
 {id:'arnau',t:'vio una noche al fantasma del Comte Arnau cabalgando sobre su caballo de fuego',lev:'folk'},
 {id:'tesoro',t:'conoce el escondite de un botín de trasgos en las cuevas',lev:'tesoro'},
 {id:'espia',t:'es espía del vizcondado y anota todo lo que se dice por aquí',lev:'concejo'},
 {id:'hijo_bandido',t:'su hijo se ha convertido en bandido de camino y le lleva comida a escondidas',lev:'crimen'},
 {id:'veneno',t:'preparó un veneno para alguien y aún no sabe si fue usado',lev:'crimen'},
 {id:'huevo',t:'guarda en su sótano un huevo de piedra que late y que cree de dragón',lev:'folk'},
 {id:'hermano_muerto',t:'mató sin querer a su hermano en una pelea y dijo que fue un accidente',lev:'crimen'},
 {id:'reliquia',t:'esconde una reliquia robada del monasterio que le quema la conciencia',lev:'orden'},
 {id:'curandera',t:'practica magia curativa prohibida por la Iglesia y ayuda a quien no puede pagar',lev:'orden'}
];
const GREET={warm:['¡Hola, {t}! Qué alegría verte.','¡Vaya, {t}! Pasa, pasa.','Me alegra verte por aquí, {t}.','¡{t}! Justo pensaba en ti.'],neutral:['Buenas, {t}.','Dime, ¿qué se te ofrece?','Hola. ¿Necesitas algo?','Buenas. ¿Qué te trae por aquí?'],cold:['¿Qué quieres?','No tengo mucho tiempo.','Ah, eres tú.','Habla rápido.'],hostile:['Aléjate de mí.','No quiero problemas contigo.','Largo.','Un paso más y llamo a la guardia.']};
const WEATHER_LINE={rain:['Menudo día de lluvia.','Con esta lluvia no hay quien trabaje.'],storm:['Con esta tormenta, mejor estar bajo techo.','Qué truenos... el cielo está furioso.'],snow:['Cae nieve; el frío se mete en los huesos.','Hacía años que no nevaba así.'],hail:['¡Granizo! Mis pobres cultivos...','Esas piedras de hielo rompen tejados.'],wind:['Este vendaval se lo lleva todo.','El viento hoy está de mal humor.'],heat:['Qué calor, ¿verdad? No se puede ni respirar.','Con este calor hasta las lagartijas se esconden.'],fog:['Esta niebla no deja ver a tres pasos.'],cloudy:['Parece que va a llover.'],clear:['Buen día, el cielo está despejado.','Hace un día precioso.']};

// ---------- apariencia ----------
function randLook(sp,sex,r,job,rich){r=r||rnd;const S=SPECIES[sp];const L={sex,sp,skin:pick(S.skin,r),hair:pick(HAIR_S,r)[0],hairC:pick(HAIR_C,r),eyeC:pick(EYE_C,r),facial:'none',scar:'none',mark:'none',build:Math.floor(r()*3),eq:{}};
 if(sex==='m'&&r()<.45)L.facial=pick(FACIAL,r)[0];if(sp==='dwarf'&&sex==='m'&&r()<.7)L.facial=r()<.6?'long':'short';if(sp==='dwarf'&&r()<.6)L.hair=pick(['braids','pony','short'],r);
 if(r()<.12)L.scar=pick(SCARS,r)[0];if(r()<.15)L.mark=pick(MARKS,r)[0];
 if(sp==='elf')L.ears=r()<.5?'long':'pointed';if(sp==='orc'){L.tusks=1;if(r()<.4)L.hair='mohawk'}
 if(sp==='tiefling'){L.horns=pick(['curved','ram','straight'],r);L.hornC=pick(['#2a2420','#6a5a4a','#8a2a2a'],r);L.tail=1}
 if(sp==='dragonborn'){L.snout=1;L.scales=1;L.hair='bald';L.facial='none';L.hairC='#3a2a1a'}
 if(sp==='goliath'){L.goliath=1;L.hair=r()<.7?'bald':L.hair;L.mark=r()<.5?'tribal':L.mark}
 if(S.skin===SKIN_H&&r()<.1)L.hairC=pick(['#e8e8e8','#8a8a8a'],r);
 return L}
function outfitFor(L,jobId,r,sexF){r=r||rnd;const J=JOB[jobId]||JOB.aldeano;const eq={};const dye=()=>pick(DYES,r);
 const put=(id)=>{const I=ITEMS[id];if(!I)return;eq[I.slot]=mkStack(id,1,0,I.dy?dye():null)};
 for(const id of J.out){let u=id;if(sexF&&id==='tunica'&&r()<.5)u='vestido';if(sexF&&id==='tunica_fina'&&r()<.4)u='vestido';put(u)}
 if(!eq.legs&&!['robe','dress'].includes((eq.body&&ITEMS[eq.body.id].vis.k)||'')&&r()<.8)put(pick(['pantalon','pantalon','calzones'],r));
 if(J.weap)J.weap.forEach(w=>put(w));
 if(jobId==='sacerdote'||jobId==='monje')eq.body=mkStack(jobId==='monje'?'tunica':'tunica_ropaje',1,0,jobId==='monje'?'#5a4a3a':'#d8d0c0');
 if(jobId==='mendigo'){eq.body=mkStack('ropa',1,0,'#6a6258')}
 return eq}
function npcSprite(n){const L=Object.assign({},n.look);L.eq=eqVis(n.eq||{});return L}

// ---------- stats ----------
function npcStats(J,lvl,r,sp){const ab={str:8,dex:8,con:8,int:8,wis:8,cha:8};AB.forEach(a=>ab[a]=8+Math.floor(r()*5));ab[J.ab]+=4+Math.floor(r()*3);ab[pick(AB,r)]+=2;
 const S=SPECIES[sp];return ab}

// ---------- NPCs hechos a mano ----------
const NPC_SPECS=[
{id:'jordina',nm:'Jordina Casals',sp:'human',sex:'f',age:38,job:'posadero',zone:'barcino',home:'casa_dragon',work:'casa_dragon',tr:{warm:9,humor:8,honest:7,brave:5,greed:3,curious:6,pious:4,temper:3},q:'colecciona escamas que dice que son del Drac de Sant Jordi',
 bio:['Heredó la Casa del Dragón de su padre, que juraba que el edificio se levantó sobre el espinazo del dragón de Sant Jordi.','Su marido, un marinero del Port Vell, no volvió de una tormenta hace seis años. Aun así enciende un farol cada noche en la ventana.','Cree que el huevo de piedra que guarda en el sótano es de dragón, y lo calienta con una manta cada noche.'],sec:'huevo',fac:'sombra',hair:'curly',hairC:'#6b4423',rel:{oriol:['pareja_futura',20],griselda:['rival',-10]}},
{id:'bernat',nm:'Bernat Vidal',sp:'human',sex:'m',age:56,job:'concejal',zone:'barcino',home:'ayuntamiento',work:'ayuntamiento',tr:{warm:3,honest:2,brave:3,greed:9,curious:4,pious:5,humor:2,temper:6},q:'se atusa el bigote antes de mentir',
 bio:['Consejero Mayor de Barcino desde hace veinte años. Presume de haber «ordenado» la ciudad.','Tuvo una hija con una mujer del Raval que nunca reconoció, y sigue pagando para que nadie hable.','Vende licencias de comercio y de obras a quien mejor pague, y reparte la mitad con la Llotja.'],sec:'roba_gremio',fac:'concejo',facial:'short',hairC:'#8a8a8a',rel:{guillem:['socio',30],griselda:['hija_oculta',-20]}},
{id:'dagna',nm:'Dagna Ferrer',sp:'dwarf',sex:'f',age:87,job:'herrero',zone:'barcino',home:'herreria',work:'herreria',tr:{warm:4,honest:8,brave:8,greed:5,curious:5,pious:3,humor:4,temper:8},q:'golpea el yunque al ritmo de sus pensamientos',
 bio:['Maestra herrera de la Hermandad de Sant Eloi. Llegó de las canteras de Collbató hace sesenta años con un martillo y mal genio.','Forjó la espada de su hijo, que murió en una escaramuza contra los bandidos; ya no hace armas por encargo sin verle los ojos al cliente.','Lleva años forjando armas para La Sombra por deudas con una prestamista; se avergüenza cada vez que cobra.'],sec:'deuda_sombra',fac:'artesanos',facial:'long',hair:'braids',hairC:'#8a8a8a',rel:{griselda:['deudora',-15],harbek:['primo',50]}},
{id:'anselm',nm:'Mestre Anselm',sp:'elf',sex:'m',age:212,job:'erudito',zone:'barcino',home:'colegio',work:'colegio',tr:{warm:5,honest:6,brave:4,greed:3,curious:10,pious:2,humor:5,temper:2},q:'olvida su propio nombre y lo escribe en la manga',
 bio:['Bibliotecario mayor del Colegio de Arcanos. Ha leído todo lo que se ha escrito sobre Barcino y sospecha que aún falta lo importante.','Perdió a su aprendiz más brillante en una excursión a las cuevas del Salnitre y desde entonces no sale de la biblioteca.','Estudia los cristales que laten bajo la Aguja Sagrada: cree que la torre es un resonador diseñado para algo que aún no ha sucedido.'],sec:'arnau',fac:null,hair:'long',hairC:'#e8e8e8',rel:{sylvar:['colega',40]}},
{id:'griselda',nm:'Griselda Pla',sp:'tiefling',sex:'f',age:41,job:'posadero',zone:'barcino',home:'taberna_raval',work:'taberna_raval',tr:{warm:5,honest:3,brave:8,greed:8,curious:7,pious:1,humor:7,temper:5},q:'cuenta monedas con los dedos sin darse cuenta',
 bio:['Dueña de la Taberna del Raval. Dice que es «solo una posadera». Nadie le cree, pero nadie lo dice en voz alta.','Creció en la calle porque su madre, una costurera, no pudo reconocerla ante un padre poderoso. Se prometió que nadie volvería a mirarla por encima del hombro.','Es la cabecilla de La Sombra del Raval, y su padre, aunque no lo sabe ella con certeza, es el Consejero Bernat.'],sec:'noble_exiliado',fac:'sombra',horns:'curved',hair:'bob',hairC:'#2a1a2a',rel:{bernat:['padre',-20],dagna:['acreedora',15],oriol:['enemigo',-35]}},
{id:'oriol',nm:'Oriol Serra',sp:'human',sex:'m',age:45,job:'guardia',zone:'barcino',home:'cuartel',work:'cuartel',tr:{warm:6,honest:9,brave:7,greed:2,curious:4,pious:5,humor:4,temper:5},q:'saluda a todos los gatos callejeros por su nombre',
 bio:['Capitán de la Guardia de Barcino. Incorruptible, terco y cansado.','Perdió el pulso en un combate con bandidos; desde entonces duda cada vez que desenvaina la espada.','Está enamorado de Jordina y nunca ha tenido el valor de decírselo; viaja a su posada «a vigilar el orden» casi cada noche.'],sec:'amor',relName:'jordina',fac:'concejo',facial:'stubble',hairC:'#3b2616',rel:{jordina:['amor',40],griselda:['enemigo',-35]}},
{id:'mireia',nm:'Mireia Camps',sp:'halfling',sex:'f',age:29,job:'boticario',zone:'barcino',home:'botica',work:'botica',tr:{warm:8,honest:5,brave:4,greed:3,curious:9,pious:5,humor:7,temper:2},q:'huele todo lo que le dan antes de aceptarlo',
 bio:['Boticaria del Herbolario de Sant Pau. Aprendió de su abuela, que curaba hasta lo incurable con romero y paciencia.','Su abuela murió por un veneno que nadie supo identificar y desde entonces estudia toxinas para poder detenerlas.','Alguien compra venenos anónimos en su tienda con notas firmadas «Un amigo». Sospecha de La Sombra pero no se atreve a denunciar.'],sec:'veneno',fac:'artesanos',hair:'bun',hairC:'#a2682a',rel:{griselda:['sospecha',-5]}},
{id:'nuria',nm:'Núria Ribas',sp:'human',sex:'f',age:33,job:'aldeano',zone:'barcino',home:'casa1',work:null,tr:{warm:9,honest:6,brave:9,greed:3,curious:6,pious:4,humor:8,temper:4},q:'cuenta las torres humanas con los dedos como si fueran de verdad',
 bio:['Cap de colla de la Colla Castellera de la Rambla. Ha levantado torres de cinco pisos con un puñado de vecinos y mucho cariño.','Su hermano cayó de una torre en la Mercè y no volvió a andar; ella sigue levantando castells «por los dos».','Debe dinero por apostar en torres imposibles y vende flores en la plaza para pagar sin que nadie lo sepa.'],sec:'deuda_sombra',fac:'castellers',hair:'pony',hairC:'#b83a1c',rel:{pau:['hermano',50]}},
{id:'narcis',nm:'Padre Narcís Mas',sp:'human',sex:'m',age:61,job:'sacerdote',zone:'barcino',home:'catedral',work:'catedral',tr:{warm:6,honest:6,brave:3,greed:2,curious:5,pious:8,humor:4,temper:2},q:'bendice a las palomas',
 bio:['Párroco de la Catedral del Mar. Bautizó a media ciudad y enterró a la otra media.','Su iglesia se llenaba cada domingo; tras la Gran Peste, nadie volvió con la misma fe, ni él.','Hace años que no cree, y bebe vino de misa para no oír el silencio de las campanas.'],sec:'reliquia',fac:'orden',hair:'bald',facial:'none',rel:{}},
{id:'guillem',nm:'Guillem Pons',sp:'human',sex:'m',age:49,job:'mercader',zone:'barcino',home:'llotja',work:'llotja',tr:{warm:4,honest:3,brave:3,greed:10,curious:5,pious:3,humor:5,temper:4},q:'tasa a la gente con la mirada antes de saludarla',inside:1,
 bio:['Prohombre del Gremio de Mercaderes de la Llotja. Empezó con un carro y hoy mueve naves enteras.','Jamás perdona una deuda ni olvida un favor, y guarda los dos en libros distintos.','Soborna al Consejero Bernat para que las licencias de otros comerciantes se «pierdan».'],sec:'roba_gremio',fac:'mercaderes',hair:'short',hairC:'#6b4423',rel:{bernat:['socio',30]}},
{id:'pau',nm:'Pau Garriga',sp:'human',sex:'m',age:36,job:'pescador',zone:'barcino',home:'casa2',work:'lonja',tr:{warm:7,honest:7,brave:7,greed:3,curious:5,pious:4,humor:6,temper:5},q:'huele el mar antes de salir',
 bio:['Pescador del Port Vell y hermano de Núria.','Su padre desapareció en el mar; él sigue saliendo cada madrugada.','Guarda un mapa con el lugar donde vio una sirena de verdad y no se lo ha contado a nadie.'],sec:'arnau',hair:'short',hairC:'#2a1a10',rel:{nuria:['hermana',50]}},
{id:'elisenda',nm:'Elisenda Vives',sp:'human',sex:'f',age:55,job:'panadero',zone:'barcino',home:'forn',work:'forn',tr:{warm:7,honest:5,brave:3,greed:4,curious:9,pious:6,humor:6,temper:3},q:'sabe todo lo que se dice en la Rambla',
 bio:['Panadera del Forn de la Rambla. Levanta a la ciudad con el olor del pan.','Cuida a una madre enferma y se queja solo con la masa.','Su hijo se ha unido a una banda de bandidos y ella le deja pan en el alféizar cada noche.'],sec:'hijo_bandido',hair:'bun',hairC:'#8a8a8a',rel:{}},
// Collserola
{id:'aelwen',nm:'Aelwen Sylvanis',sp:'elf',sex:'f',age:341,job:'druida',zone:'collserola',home:'claro',work:'claro',tr:{warm:6,honest:9,brave:7,greed:1,curious:8,pious:7,humor:3,temper:2},q:'habla con los árboles y se disculpa antes de talar',
 bio:['Hierofante del Círculo de Collserola. Lleva más de tres siglos protegiendo el bosque de los que lo llaman «recurso».','Vio arder media sierra hace cien años y desde entonces cuenta los árboles cada otoño.','Cuida la última orquídea de la Moreneta fuera de Montserrat y la esconde de los coleccionistas.'],sec:'curandera',fac:'circulo',hair:'long',hairC:'#e8d28a',rel:{quim:['enemigo',-40],garret:['alumno',40]}},
{id:'quim',nm:'Quim Mestres',sp:'human',sex:'m',age:50,job:'lenador',zone:'collserola',home:'aserradero',work:'aserradero',tr:{warm:3,honest:3,brave:6,greed:8,curious:3,pious:2,humor:3,temper:8},q:'mide cada árbol con la mirada y le pone precio',
 bio:['Dueño del aserradero de Can Mestres. Dice que el bosque se hizo para cortarlo.','Perdió a su mujer por una fiebre y cree que el bosque «se la llevó».','Ha talado encinas centenarias protegidas por el Círculo y las vende como «madera de importación».'],sec:'roba_gremio',facial:'long',hairC:'#6b4423',rel:{aelwen:['enemigo',-40]}},
{id:'garret',nm:'Garret Bosch',sp:'halfling',sex:'m',age:35,job:'cazador',zone:'collserola',home:'cabana_caza',work:'cabana_caza',tr:{warm:8,honest:5,brave:6,greed:4,curious:7,pious:3,humor:9,temper:2},q:'baraja los nombres de los animales como si fueran de amigos',
 bio:['Cazador de Collserola. Conoce cada sendero y cada madriguera.','Perdió a su perro en una trampa de trasgos y desde entonces no lleva a nadie al bosque de noche.','Caza más lobos de los que dice, y siente cada vez más remordimiento.'],sec:'veneno',fac:'circulo',hair:'short',hairC:'#a2682a',rel:{aelwen:['maestra',40]}},
{id:'sylvar',nm:'Sylvar el Viento',sp:'elf',sex:'m',age:402,job:'erudito',zone:'collserola',home:'torre_vientos',work:'torre_vientos',tr:{warm:4,honest:7,brave:5,greed:2,curious:10,pious:2,humor:6,temper:3},q:'responde con preguntas',
 bio:['Habita la Torre de los Vientos, una antena arcana que capta murmullos de toda la comarca.','Fue discípulo del mismo maestro que Anselm; se separaron por una discusión sobre si el conocimiento debe ser libre o guardado.','La torre capta una voz que repite el nombre de Barcino en una lengua que nadie conoce.'],sec:'arnau',hair:'long',hairC:'#2c3e6b',rel:{anselm:['colega',40]}},
{id:'fra_ramon',nm:'Fra Ramon',sp:'human',sex:'m',age:72,job:'monje',zone:'collserola',home:'ermita_medir',work:'ermita_medir',tr:{warm:8,honest:8,brave:4,greed:1,curious:6,pious:9,humor:6,temper:1},q:'bendice cada hoja que cae',
 bio:['Ermitaño de Sant Medir. Reza por los viajeros que cruzan el bosque.','Fue soldado joven y no ha vuelto a sostener una espada.','Bendice en secreto a los trasgos enfermos que se arrastran hasta su puerta.'],sec:'curandera',fac:'orden',hair:'bald',facial:'long',hairC:'#e8e8e8',rel:{}},
// Martorell
{id:'marc',nm:'Marc Oliver',sp:'human',sex:'m',age:44,job:'posadero',zone:'martorell',home:'posada_pont',work:'posada_pont',tr:{warm:7,honest:5,brave:4,greed:6,curious:6,pious:3,humor:7,temper:4},q:'cuenta la leyenda del puente con cada vez más detalles',
 bio:['Posadero de la Posada del Pont. Jura que el Diablo en persona pidió una jarra allí.','Se enamoró de una viajera que se marchó sin despedirse y deja siempre una silla libre.','Recibe a viajeros sospechosos y los avisa a La Sombra por unas monedas.'],sec:'informante',hair:'short',hairC:'#3b2616',rel:{xavi:['amigo',30],laia:['conocida',10]}},
{id:'roser',nm:'Roser Torras',sp:'human',sex:'f',age:36,job:'molinero',zone:'martorell',home:'molino',work:'molino',tr:{warm:6,honest:7,brave:5,greed:4,curious:5,pious:6,humor:5,temper:4},q:'muele palabras como si fueran harina',
 bio:['Molinera del Llobregat, hija y nieta de molineros.','El río se llevó a su padre cuando intentaba arreglar la rueda en plena crecida.','Descubrió que alguien ha desviado una acequia y envenena poco a poco la tierra de sus vecinos.'],sec:'veneno',hair:'braids',hairC:'#6b4423',rel:{}},
{id:'pere',nm:'Pere Carbonell',sp:'human',sex:'m',age:58,job:'herrero',zone:'martorell',home:'forja_mt',work:'forja_mt',tr:{warm:5,honest:7,brave:6,greed:4,curious:4,pious:6,humor:3,temper:7},q:'solo habla de hierro',
 bio:['Herrero de la Fragua de Martorell.','Su mujer se marchó a Barcino con un mercader.','Enseña a Laia sus secretos de fragua, aunque ella solo quiere pescar.'],sec:'amor',relName:'roser',fac:'artesanos',hair:'bald',facial:'short',hairC:'#8a8a8a',rel:{roser:['amor',20]}},
{id:'xavi',nm:'Xavi «el Diable»',sp:'tiefling',sex:'m',age:33,job:'aldeano',zone:'martorell',home:'casa_mt1',work:null,tr:{warm:6,honest:5,brave:8,greed:4,curious:8,pious:2,humor:10,temper:3},q:'finge un trato con el Diablo cada vez que cruza el puente',
 bio:['Cobra el peaje del Pont del Diable y se hace llamar «el Diable» para asustar a los niños.','Los vecinos no lo han tratado con cariño; él aprendió a reírse antes que ellos.','Sabe que el puente está hueco por dentro y que algo vive allí, y duerme con la espalda contra la pared.'],sec:'arnau',fac:'sombra',horns:'ram',hair:'short',hairC:'#2a1a10',rel:{marc:['amigo',30]}},
{id:'laia',nm:'Laia Costa',sp:'human',sex:'f',age:24,job:'pescador',zone:'martorell',home:'pescador_mt',work:'pescador_mt',tr:{warm:8,honest:8,brave:8,greed:2,curious:9,pious:3,humor:8,temper:4},q:'lanza piedras planas al río y cuenta los saltos',
 bio:['Pescadora del Llobregat. Siempre con una caña y una sonrisa.','Quería ser aprendiz de Pere en la fragua, pero el río la llamó más fuerte.','Vio algo en el fondo del río: unas escamas del tamaño de platos que se mueven.'],sec:'huevo',hair:'pony',hairC:'#a2682a',rel:{pere:['maestro',20]}},
// Collbató
{id:'harbek',nm:'Harbek Roca',sp:'dwarf',sex:'m',age:121,job:'minero',zone:'cam_collbato',home:'mina',work:'mina',tr:{warm:5,honest:8,brave:8,greed:6,curious:5,pious:3,humor:4,temper:7},q:'golpea la pared antes de entrar a cualquier sitio para «escuchar»',
 bio:['Capataz de la mina de hierro de Collbató. Su familia lleva cuatro generaciones bajo tierra.','Perdió a media cuadrilla en un derrumbe y duerme con el pico bajo la almohada.','Sabe de una veta de cristal arcano que nunca ha comunicado al Concejo.'],sec:'tesoro',fac:'artesanos',facial:'long',hair:'braids',hairC:'#a2682a',rel:{dagna:['primo',50]}},
{id:'violant',nm:'Violant Saura',sp:'human',sex:'f',age:47,job:'posadero',zone:'collbato',home:'fonda_coves',work:'fonda_coves',tr:{warm:8,honest:6,brave:5,greed:5,curious:6,pious:6,humor:8,temper:4},q:'siempre tiene una tapa gratis para quien llegue con hambre',
 bio:['Dueña de la Fonda de les Coves.','Su marido desapareció en las cuevas del Salnitre persiguiendo un tesoro.','Guarda el mapa que su marido dibujó antes de desaparecer.'],sec:'tesoro',hair:'bun',hairC:'#6b4423',rel:{}},
{id:'kuori',nm:'Kuori Piedra Viva',sp:'goliath',sex:'m',age:31,job:'cantero',zone:'cam_collbato',home:'barracon_cb2',work:'cantera',tr:{warm:6,honest:9,brave:9,greed:3,curious:4,pious:6,humor:5,temper:4},q:'levanta sin esfuerzo piedras de media tonelada y pide perdón a la piedra',
 bio:['Cantero de la cantera de conglomerado y casteller de la colla de Collbató.','Su clan bajó de Montserrat por un conflicto con los monjes sobre los derechos de pasto.','Quiere subir al «pom de dalt» de un castell y vencer a un gigante en una prueba de fuerza ante la ciudad.'],sec:'culto',fac:'castellers',hair:'bald',mark:'tribal',rel:{}},
// Montserrat
{id:'guifre',nm:'Abad Guifré',sp:'human',sex:'m',age:66,job:'monje',zone:'montserrat',home:'monasterio',work:'monasterio',tr:{warm:6,honest:7,brave:5,greed:2,curious:7,pious:9,humor:5,temper:3},q:'cita santos que quizá nunca existieron',
 bio:['Abad de Montserrat. Guarda la imagen de la Moreneta y las llaves de la biblioteca.','En su juventud fue soldado y escapó a la montaña para no volver a matar.','Sabe que la Moreneta no fue «hallada» sino «escondida» para protegerla; protege el secreto con su vida.'],sec:'reliquia',fac:'orden',hair:'bald',facial:'short',hairC:'#8a8a8a',rel:{biel:['maestro',40]}},
{id:'biel',nm:'Fra Biel',sp:'human',sex:'m',age:29,job:'monje',zone:'montserrat',home:'monasterio',work:'monasterio',tr:{warm:8,honest:7,brave:4,greed:1,curious:9,pious:7,humor:7,temper:2},q:'canta mientras trabaja y desafina a propósito',
 bio:['Maestro de la Escolanía, el coro de niños de Montserrat.','Llegó huérfano al monasterio y ahora enseña a otros a cantar en paz.','Tiene una voz sobrenatural: cuando canta, algunas piedras de la montaña vibran con él.'],sec:'curandera',fac:'orden',hair:'short',hairC:'#2a1a10',rel:{guifre:['maestro',40]}},
{id:'eulalia',nm:'Germana Eulàlia',sp:'human',sex:'f',age:52,job:'boticario',zone:'montserrat',home:'recuerdos',work:'recuerdos',tr:{warm:8,honest:8,brave:4,greed:2,curious:6,pious:8,humor:4,temper:3},q:'regala siempre un pellizco de romero',
 bio:['Hermana de la Comunidad que gestiona la tienda y la botica del monasterio.','Desterrada de un convento de Barcino por curar a quien no debía.','Lleva en un frasco la savia de la última orquídea de la Moreneta, que dice que cura incluso la peste.'],sec:'curandera',fac:'orden',hair:'bald',rel:{}},
{id:'joan_gari',nm:'Ermitaño Joan',sp:'human',sex:'m',age:81,job:'monje',zone:'ascenso',home:'ermita_joan',work:'ermita_joan',tr:{warm:5,honest:4,brave:6,greed:1,curious:8,pious:7,humor:7,temper:5},q:'habla con los que ya murieron',
 bio:['Hermano ermitaño de la ermita de Sant Joan. Dicen que es descendiente de aquel Joan Garí que hizo penitencia entre estas rocas.','Pasó años solo en una cueva y regresó con la barba larga y los ojos distintos.','Afirma haber visto a La Víbria y haberle devuelto la mirada.'],sec:'arnau',fac:'orden',hair:'bald',facial:'long',hairC:'#e8e8e8',rel:{}}
];

// ---------- generador de NPCs adicionales ----------
const GEN_PLAN={
barcino:[['guardia',3],['mercader',4],['mendigo',2],['juglar',1],['marinero',2],['aldeano',5],['noble',1],['tejedor',1],['curtidor',0],['ladron',2]],
collserola:[['cazador',1],['lenador',1],['aldeano',1],['druida',1]],
martorell:[['granjero',4],['aldeano',4],['curtidor',1],['tejedor',1],['panadero',1],['mercader',1],['guardia',1],['mendigo',1],['pastor',1]],
collbato:[['aldeano',5],['pastor',2],['mercader',1],['curtidor',0],['sacerdote',1],['guardia',1],['mendigo',1]],
montserrat:[['monje',3],['mercader',1],['aldeano',1],['guardia',1]],
vega:[['granjero',3],['aldeano',2],['pastor',1],['pescador',1]],
pas_molins:[['pastor',1],['cazador',1],['aldeano',1],['guardia',1],['ladron',1]],
cam_collbato:[['minero',3],['cantero',2],['aldeano',1],['guardia',1]],
ascenso:[['pastor',1],['monje',1],['aldeano',1]],
marjal:[['pescador',2],['aldeano',1],['marinero',1]],
cornisa:[['pastor',1],['cazador',1],['ladron',1],['guardia',1]]
};
const SPEC_W=[['human',60],['elf',7],['dwarf',8],['halfling',7],['gnome',4],['dragonborn',2],['goliath',2],['orc',4],['tiefling',6]];
const SPEC_BY_ZONE={collbato:{dwarf:20,goliath:6},barcino:{tiefling:8,orc:5},montserrat:{human:90}};
function pickSpecies(z,r){const m=SPEC_BY_ZONE[z]||{};return wpick(SPEC_W,s=>(m[s[0]]!==undefined?m[s[0]]:s[1]),r)[0]}
function buildNPC(spec,r){const J=JOB[spec.job]||JOB.aldeano;const sp=spec.sp,sex=spec.sex;const look=randLook(sp,sex,r,spec.job);
 ['hair','hairC','facial','horns','mark','skin','scar'].forEach(k=>{if(spec[k])look[k]=spec[k]});
 const lvl=spec.lvl||J.lvl;const ab=npcStats(J,lvl,r,sp);const tr={};TRAITS.forEach(t=>tr[t]=spec.tr?spec.tr[t]:Math.floor(r()*11));
 const eq=outfitFor(look,spec.job,r,sex==='f');const hpMax=Math.max(4,Math.round((8+mod(ab.con))*lvl*.7+4));
 const n={id:spec.id,name:spec.nm,sp,sex,age:spec.age||20+Math.floor(r()*40),job:spec.job,zone:spec.zone,home:spec.home||null,work:spec.work||null,lvl,abil:ab,hp:hpMax,maxHp:hpMax,look,eq,
  tr,quirk:spec.q||pick(QUIRKS,r),bio:spec.bio||null,sec:spec.sec||null,secName:spec.relName||null,fac:spec.fac||null,rel:{},aff:0,romance:0,orient:r()<.8?'any':pick(['m','f'],r),met:false,known:0,alive:true,gold:0,inv:[],x:0,y:0,hidden:true,loc:null,mood:50,
  skills:{},flags:{},lastTalk:-9999,gifts:0,spec:!!spec.nm&&!!spec.bio,stolen:[],home2:null};
 J.sk.forEach(s=>n.skills[s]=1);if(lvl>=4)J.sk.forEach(s=>n.skills[s]=1);
 const g=J.gold;n.gold=g[0]+Math.floor(r()*(g[1]-g[0]+1));
 J.items.forEach(id=>{if(FAMILY[id])id=famPick(id,n.zone);if(ITEMS[id]&&r()<.75)invAdd(n.inv,id,1+Math.floor(r()*3),Math.floor(r()*3))});
 if(spec.rel)for(const k in spec.rel)n.rel[k]={k:spec.rel[k][0],v:spec.rel[k][1]};
 n.orient=spec.orient||n.orient;
 // trazos de aversión por especie
 n.prej={};['orc','tiefling','dragonborn','goliath','elf','dwarf','gnome','halfling'].forEach(s=>{if(s!==sp&&r()<.18)n.prej[s]=-(5+Math.floor(r()*18));else if(s===sp&&r()<.5)n.prej[s]=8});
 makePrefs(n,mulberry32(hashStr(n.id)+7));
 return n}
function genNPCSpec(zone,job,idx,r){const sp=pickSpecies(zone,r);const sex=r()<.5?'m':'f';const nm=genName(sp,sex,r);const id='g_'+zone+'_'+job+idx;return{id,nm,sp,sex,job,zone}}
function makeBackstory(n,r){const J=JOB[n.job];const orig=pick(ORIGINS,r),hard=pick(HARD,r),goal=pick(GOALS,r);n.goalK=GOALS.indexOf(goal);n.hardK=HARD.indexOf(hard);
 const pr=n.sex==='f'?'Ella':'Él';return[cap(n.name.split(' ')[0])+' '+orig+'. Hoy trabaja como '+J.n.toLowerCase()+': '+pick(HOWJOB,r)+'.',cap(pr)+' '+hard+'. '+goal.replace(/^quiere/,'Desde entonces quiere').replace(/^sueña/,'Desde entonces sueña'),pr+' guarda un secreto.']}
function assignSecret(n,r,all){if(n.sec){const s=SECRETS.find(x=>x.id===n.sec);n.secT=(s?s.t:SECRETS[0].t);if(n.secName){const o=all.find(m=>m.id===n.secName);n.secT=n.secT.replace('{rel}',o?o.name:'alguien')}else n.secT=n.secT.replace('{rel}','alguien cercano');return}
 const s=pick(SECRETS,r);n.sec=s.id;let t=s.t;if(t.includes('{rel}')){const c=all.filter(m=>m.zone===n.zone&&m.id!==n.id);const o=c.length?pick(c,r):null;t=t.replace('{rel}',o?o.name:'alguien cercano');if(o)n.secName=o.id}n.secT=t}
function assignRelations(all,r){const byZ={};all.forEach(n=>{(byZ[n.zone]=byZ[n.zone]||[]).push(n)});
 for(const z in byZ){const arr=byZ[z];arr.forEach(n=>{const k=1+Math.floor(r()*3);for(let i=0;i<k;i++){const o=pick(arr,r);if(o.id===n.id||n.rel[o.id])continue;const same=o.job===n.job;const q=r();let kind,v;if(same&&q<.5){kind='rival';v=-10-Math.floor(r()*30)}else if(q<.45){kind='amigo';v=15+Math.floor(r()*40)}else if(q<.6){kind='familia';v=25+Math.floor(r()*40)}else if(q<.8){kind='conocido';v=Math.floor(r()*20)}else{kind='enemigo';v=-20-Math.floor(r()*40)}
   n.rel[o.id]={k:kind,v};if(!o.rel[n.id])o.rel[n.id]={k:kind,v:v+Math.floor((r()-.5)*10)}}})}}
function genSchedule(n,r){const J=JOB[n.job];const sh=J.shift==='night'?1:n.id.length%3;const S=[];const add=(a,b,act,loc)=>S.push({a,b,act,loc});
 const inn=null;const sched=J.sched;
 if(sched==='shop'){add(0,6,'sleep','home');add(6,7,'eat','home');add(7,14,'work','work');add(14,15,'eat','home');add(15,20,'work','work');add(20,22,'tavern','inn');add(22,24,'sleep','home')}
 else if(sched==='outdoor'||sched==='wild'){add(0,6,'sleep','home');add(6,7,'eat','home');add(7,13,'work','spot');add(13,14,'eat','home');add(14,19,'work','spot');add(19,22,n.job==='druida'?'work':'tavern',n.job==='druida'?'spot':'inn');add(22,24,'sleep','home')}
 else if(sched==='monk'){add(0,4,'sleep','home');add(4,6,'temple','work');add(6,12,'work','work');add(12,13,'eat','home');add(13,18,'work','work');add(18,19,'temple','work');add(19,21,'plaza','plaza');add(21,24,'sleep','home')}
 else if(sched==='guard'){if(sh===0){add(0,6,'sleep','home');add(6,14,'patrol','patrol');add(14,16,'eat','home');add(16,18,'tavern','inn');add(18,24,'sleep','home')}else{add(0,6,'patrol','patrol');add(6,14,'sleep','home');add(14,16,'eat','home');add(16,22,'patrol','patrol');add(22,24,'sleep','home')}}
 else if(sched==='market'){add(0,7,'sleep','home');add(7,8,'eat','home');add(8,14,'market','stall');add(14,15,'eat','home');add(15,19,'market','stall');add(19,22,'tavern','inn');add(22,24,'sleep','home')}
 else if(sched==='inn'){add(0,3,'work','work');add(3,10,'sleep','home');add(10,11,'eat','home');add(11,24,'work','work')}
 else if(sched==='beggar'){add(0,8,'sleep','spot');add(8,20,'beg','beg');add(20,24,'sleep','spot')}
 else if(sched==='night'){add(0,5,'work','alley');add(5,12,'sleep','home');add(12,14,'eat','home');add(14,19,'wander','plaza');add(19,24,'tavern','inn');}
 else{add(0,7,'sleep','home');add(7,9,'wander','plaza');add(9,13,n.work?'work':'wander',n.work?'work':'plaza');add(13,14,'eat','home');add(14,19,n.work?'work':'wander',n.work?'work':'market');add(19,22,'tavern','inn');add(22,24,'sleep','home')}
 return S}
function pickInn(zone){const z=getZone(zone);const inns=z.buildings.filter(b=>b.kind==='inn');return inns.length?inns[0].id:null}

function createWorldNPCs(seed){return buildPopulation(seed)}

// posición/estado de un NPC según hora
function npcWhere(n,t){const D=dateOf(t);const h=D.hf;const ph=phaseOf(t);let blk=n.sched.find(b=>h>=b.a&&h<b.b)||n.sched[0];if(!blk)return{act:'wander',loc:'plaza'};
 if(D.dow===6&&blk.act!=='sleep'&&h>=10&&h<12&&n.job!=='guardia'&&n.job!=='mendigo'&&!JOB[n.job].stall)return{act:'temple',loc:'temple'};
 const f=festAt(t);if(f&&h>=18&&h<23&&!n.traveler&&!['guardia'].includes(n.job)&&n.alive)return{act:'plaza',loc:'plaza',fest:1};
 const wx=G&&G.wx&&G.wx[n.zone];if(wx&&['storm','hail'].includes(wx.type)||(wx&&wx.type==='rain'&&wx.int>.6)||(wx&&wx.type==='snow'&&wx.int>.7)){if(['work','wander','market','beg','plaza','patrol'].includes(blk.act)&&n.job!=='guardia'&&n.job!=='druida')return{act:'shelter',loc:n.home||'inn'}}
 return{act:blk.act,loc:blk.loc}}
// resuelve destino físico: {b:buildingId} (dentro) o {x,y} (fuera)
function npcTarget(n,t){const z=getZone(n.zone);const w=npcWhere(n,t);const J=JOB[n.job];const bld=id=>z.buildings.find(b=>b.id===id);const rr=mulberry32(hashStr(n.id)+Math.floor(t/45));
 const near=(p,rad)=>({x:p.x+(rr()-.5)*rad*2,y:p.y+(rr()-.5)*rad*2});
 const inside=id=>{const b=bld(id);return b?{b:id}:null};
 let tg=null;
 switch(w.act){
  case'sleep':case'eat':{if(w.loc==='spot'){tg={x:n.spotX||z.spawn.x,y:n.spotY||z.spawn.y,sleep:1}}else tg=inside(n.home)||near(z.spots.plaza||z.spawn,4);break}
  case'shelter':tg=inside(w.loc==='inn'?(n.fav||pickInn(n.zone)):w.loc)||inside(n.home)||inside(n.fav||pickInn(n.zone));break;
  case'work':{if(w.loc==='work'){const b=bld(n.work);if(b&&(J.inside||J.sched==='shop'||J.sched==='monk'))tg={b:n.work};else if(b&&b.entry)tg={x:b.entry.x+.5+(rr()-.5)*5,y:b.entry.y+.5+rr()*3}}else if(w.loc==='spot'){tg={x:(n.spotX||z.spawn.x),y:(n.spotY||z.spawn.y),work:1}}else if(w.loc==='alley'){tg={x:(z.spots.plaza||z.spawn).x+6,y:(z.spots.plaza||z.spawn).y+8,work:1}}else tg=near(z.spots.plaza||z.spawn,5);break}
  case'temple':{const tb=z.buildings.find(b=>b.kind==='temple'||b.kind==='chapel'||b.kind==='monasterio');tg=tb?{b:tb.id}:near(z.spots.plaza||z.spawn,4);break}
  case'tavern':{const ib=n.fav||pickInn(n.zone);tg=ib?{b:ib}:near(z.spots.plaza||z.spawn,4);break}
  case'market':{const m=z.spots.market||z.spots.plaza||z.spawn;const st=z.stalls[Math.abs(hashStr(n.id))%Math.max(1,z.stalls.length)];tg=st?{x:st.x,y:st.y+1,work:1,stall:st.id}:near(m,3);break}
  case'plaza':{const p=z.spots.plaza||z.spawn;tg=near(p,w.fest?5:3.5);break}
  case'wander':{const p=(w.loc==='market'?(z.spots.market||z.spots.plaza):(z.spots.plaza))||z.spawn;tg=near(p,6);break}
  case'beg':{const bs=z.spots.beggar&&z.spots.beggar.length?z.spots.beggar[Math.abs(hashStr(n.id))%z.spots.beggar.length]:[z.spawn.x,z.spawn.y];tg={x:bs[0]+.5,y:bs[1]+.5,work:1};break}
  case'patrol':{const pp=z.spots.patrol&&z.spots.patrol.length?z.spots.patrol:[[z.spawn.x,z.spawn.y]];const i=(Math.floor(t/20)+Math.abs(hashStr(n.id)))%pp.length;tg={x:pp[i][0]+.5,y:pp[i][1]+.5};break}
  default:tg=near(z.spots.plaza||z.spawn,5)}
 if(!tg)tg=near(z.spots.plaza||z.spawn,4);return{tg,act:w.act}}
function npcSpots(){ // puntos de trabajo al aire libre
 for(const id in G.npcs){const n=G.npcs[id];if(n.traveler)continue;const z=getZone(n.zone);const J=JOB[n.job];let b=n.work?z.buildings.find(x=>x.id===n.work):null;let sx=null,sy=null;const hh=Math.abs(hashStr(n.id));
  if(n.spotKind&&!b){const SP=z.spots;const base=n.spotKind==='market'?(SP.market||SP.plaza):n.spotKind==='port'?(SP.port||SP.plaza):n.spotKind==='river'?(SP.river||SP.port||SP.plaza):n.spotKind==='bridge'?(SP.bridge||SP.plaza):n.spotKind==='alley'?(SP.alley||SP.plaza):n.spotKind==='forest'?{x:z.spawn.x+(hh%11-5),y:z.spawn.y+3+(hh%7)}:(SP.plaza||z.spawn);sx=base.x+(hh%9-4)*.8;sy=base.y+((hh>>3)%9-4)*.8}
  else if(n.job==='granjero'||n.job==='pastor'){if(b){sx=b.x+b.w/2+(Math.abs(hashStr(n.id))%7-3);sy=b.y+b.h+3+(Math.abs(hashStr(n.id+'y'))%4)}else{sx=z.spawn.x+(hashStr(n.id)%9-4);sy=z.spawn.y+3}}
  else if(n.job==='pescador'){if(z.spots.river){sx=z.spots.river.x;sy=z.spots.river.y+Math.abs(hashStr(n.id))%5}else if(z.spots.port){sx=z.spots.port.x+3;sy=z.spots.port.y+Math.abs(hashStr(n.id))%4}else{sx=z.spawn.x;sy=z.spawn.y}}
  else if(n.job==='druida'){const c=z.buildings.find(x=>x.kind==='claro');sx=c?c.entry.x+(Math.abs(hashStr(n.id))%5-2):z.spawn.x;sy=c?c.entry.y+1:z.spawn.y}
  else if(n.job==='cazador'||n.job==='lenador'){if(b){sx=b.entry.x+(hashStr(n.id)%5-2);sy=b.entry.y+3+Math.abs(hashStr(n.id+'z'))%5}else{sx=z.spawn.x;sy=z.spawn.y}}
  else if(b){sx=b.entry.x+(hashStr(n.id)%5-2);sy=b.entry.y+2}else{sx=z.spawn.x+(hashStr(n.id)%7-3);sy=z.spawn.y+2}
  // ajusta a casilla libre
  let tx=Math.floor(sx),ty=Math.floor(sy);let ok=tileFree(z,tx,ty);for(let r=1;r<5&&!ok;r++){for(let dy=-r;dy<=r&&!ok;dy++)for(let dx=-r;dx<=r&&!ok;dx++){if(tileFree(z,tx+dx,ty+dy)){tx+=dx;ty+=dy;ok=true}}}
  n.spotX=tx+.5;n.spotY=ty+.5}}
// afinidad efectiva del NPC hacia el jugador
function attitude(n){let v=n.aff;const S=G.pc.species;if(n.prej&&n.prej[S])v+=n.prej[S];v+=(G.zrep[n.zone]||0)*.15;if(n.fac&&G.fac[n.fac])v+=G.fac[n.fac].st*.2;if(n.tr.honest>=6)v-=G.infamy*.12;v+=G.fame*.06*(n.tr.curious>5?1.2:.6);if(n.mood<25)v-=5;if(n.likes)v+=attractMatch(n).length*3;return Math.round(clamp(v,-100,100))}
function moodWord(a){return a<=-40?'hostile':a<=-12?'cold':a<25?'neutral':'warm'}
