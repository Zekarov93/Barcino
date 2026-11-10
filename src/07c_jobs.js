// ===================== OFICIOS: todos los vecinos tienen un oficio y cumplen una función en la comunidad =====================
// eff: contribución diaria a la vida de la zona {o:orden, h:salud, m:ánimo, c:delincuencia}. wp: dónde trabaja.
// fn: lo que aporta (para bien o para mal) · ill: la cara oscura del oficio (opcional)
const NJ=(id,o)=>{JOB[id]=Object.assign({sched:'shop',lvl:1,sk:['percep'],ab:'con',items:[],gold:[5,30],out:['tunica','zapatos']},o)};
NJ('carpintero',{n:'Carpintero',nf:'Carpintera',inside:1,sched:'shop',lvl:1,sk:['athl','invest'],ab:'str',tag:'wood',items:['madera_pino','madera_encina','cuerda','hacha_mano'],gold:[10,50],out:['tunica','botas']});
NJ('albanil',{n:'Albañil',nf:'Albañila',outdoor:1,sched:'outdoor',lvl:1,sk:['athl'],ab:'str',tag:'mason',items:['piedra','caliza','pala'],gold:[8,40],out:['tunica','botas']});
NJ('zapatero',{n:'Zapatero',nf:'Zapatera',inside:1,sched:'shop',lvl:1,sk:['invest','sleight'],ab:'dex',tag:'shoe',items:['cuero','botas','zapatos','sandalias'],gold:[10,45],out:['tunica','zapatos']});
NJ('sastre',{n:'Sastre',nf:'Sastra',inside:1,sched:'shop',lvl:1,sk:['invest','persu'],ab:'dex',tag:'tailor',items:['tela','lana','tunica','capa'],gold:[15,60],out:['tunica_fina','zapatos']});
NJ('alfarero',{n:'Alfarero',nf:'Alfarera',inside:1,sched:'shop',lvl:1,sk:['invest'],ab:'dex',tag:'pot',items:['caliza','piedra'],gold:[8,35],out:['tunica','botas']});
NJ('tonelero',{n:'Tonelero',nf:'Tonelera',inside:1,sched:'shop',lvl:1,sk:['athl','invest'],ab:'str',tag:'cooper',items:['madera_encina','cuerda','vino'],gold:[10,45],out:['tunica','botas']});
NJ('cervecero',{sched:'inn',n:'Cervecero',nf:'Cervecera',inside:1,lvl:1,sk:['nature','invest'],ab:'con',tag:'brew',items:['cerveza','grano','miel'],gold:[15,55],out:['tunica','botas']});
NJ('cocinero',{sched:'inn',n:'Cocinero',nf:'Cocinera',inside:1,lvl:1,sk:['invest','persu'],ab:'con',tag:'cook',items:['estofado','escudella','pan','cebolla','carne_cordero'],gold:[8,35],out:['tunica','zapatos']});
NJ('camarero',{sched:'inn',n:'Mozo de taberna',nf:'Moza de taberna',inside:1,lvl:1,sk:['persu','percep'],ab:'cha',tag:'tap',items:['cerveza','vino','pan'],gold:[3,20],out:['tunica','zapatos']});
NJ('tendero',{n:'Tendero',nf:'Tendera',inside:1,sched:'shop',lvl:1,sk:['persu','insight'],ab:'cha',tag:'shop',items:['sal','cuerda','tela','antorcha','aceite','pan'],gold:[20,80],out:['tunica','zapatos']});
NJ('carnicero',{n:'Carnicero',nf:'Carnicera',stall:1,sched:'market',lvl:1,sk:['athl','survival'],ab:'str',tag:'butch',items:['carne_cerdo','carne_cordero','pollo','piel_oveja'],gold:[12,50],out:['tunica','botas']});
NJ('pregonero',{n:'Pregonero',nf:'Pregonera',sched:'outdoor',outdoor:1,lvl:1,sk:['perf','persu'],ab:'cha',tag:'crier',items:['pan'],gold:[5,25],out:['tunica_fina','sombrero','zapatos']});
NJ('escribano',{n:'Escribano',nf:'Escribana',inside:1,sched:'shop',lvl:2,sk:['invest','hist'],ab:'int',tag:'scribe',items:['tinta','libro_g','libro'],gold:[25,90],out:['tunica_ropaje','sombrero','zapatos']});
NJ('recaudador',{n:'Recaudador',nf:'Recaudadora',inside:1,sched:'shop',lvl:2,sk:['insight','intim'],ab:'cha',tag:'tax',items:['anillo'],gold:[60,200],out:['tunica_fina','sombrero_ala','zapatos']});
NJ('usurero',{n:'Prestamista',nf:'Prestamista',inside:1,sched:'shop',lvl:2,sk:['insight','persu'],ab:'cha',tag:'loan',items:['anillo','amuleto'],gold:[200,700],out:['tunica_fina','manto_fino','zapatos']});
NJ('maton',{n:'Matón',nf:'Matona',sched:'night',lvl:3,sk:['intim','athl'],ab:'str',tag:'thug',items:['vino','daga'],gold:[10,60],out:['cuero_tachonado','botas'],weap:['maza']});
NJ('contrabandista',{n:'Contrabandista',nf:'Contrabandista',sched:'night',lvl:3,sk:['stealth','decep'],ab:'dex',tag:'smug',items:['veneno','anillo_sombra','cristal','vino','escama'],gold:[60,240],out:['capa_viaje','botas_altas','capucha'],weap:['estoque']});
NJ('estafador',{n:'Embaucador',nf:'Embaucadora',sched:'civil',lvl:2,sk:['decep','persu'],ab:'cha',tag:'con',items:['anillo','amuleto','vino'],gold:[20,120],out:['tunica_fina','sombrero_pluma','zapatos']});
NJ('barbero',{n:'Barbero',nf:'Barbera',inside:1,sched:'shop',lvl:1,sk:['medic','persu'],ab:'dex',tag:'barber',items:['daga','tela','hierbas'],gold:[10,50],out:['tunica','zapatos']});
NJ('comadrona',{n:'Comadrona',nf:'Comadrona',inside:1,sched:'shop',lvl:2,sk:['medic','insight'],ab:'wis',tag:'midwife',items:['hierbas','antidoto','tela','miel'],gold:[8,40],out:['tunica_ropaje','zapatos']});
NJ('curandero',{n:'Curandero',nf:'Curandera',sched:'outdoor',outdoor:1,lvl:2,sk:['nature','medic','decep'],ab:'wis',tag:'quack',items:['hierbas','setas','hiperico','miel','veneno'],gold:[5,40],out:['tunica','sombrero_ala','botas']});
NJ('aguador',{n:'Aguador',nf:'Aguadora',sched:'outdoor',outdoor:1,lvl:1,sk:['athl','percep'],ab:'con',tag:'water',items:['cuerda','pan'],gold:[2,18],out:['tunica','botas']});
NJ('farolero',{n:'Farolero',nf:'Farolera',sched:'guard',shift:'night',outdoor:1,lvl:1,sk:['percep','acro'],ab:'dex',tag:'lamp',items:['antorcha','aceite'],gold:[3,18],out:['tunica','sombrero','botas']});
NJ('sereno',{n:'Sereno',nf:'Serena',patrol:1,sched:'guard',shift:'night',lvl:2,sk:['percep','insight'],ab:'wis',tag:'night',items:['antorcha','pan'],gold:[5,25],out:['capa','sombrero','botas'],weap:['baston']});
NJ('enterrador',{n:'Enterrador',nf:'Enterradora',outdoor:1,sched:'outdoor',lvl:1,sk:['relig','athl'],ab:'con',tag:'grave',items:['pala','antorcha'],gold:[6,30],out:['tunica','sombrero_ala','botas']});
NJ('campanero',{n:'Campanero',nf:'Campanera',inside:1,sched:'monk',lvl:1,sk:['relig','athl'],ab:'str',tag:'bell',items:['cuerda','vino'],gold:[2,12],out:['tunica','sandalias']});
NJ('sacristan',{n:'Sacristán',nf:'Sacristana',inside:1,sched:'monk',lvl:1,sk:['relig','invest'],ab:'wis',tag:'sacr',items:['vino','antorcha','miel'],gold:[2,14],out:['tunica','sandalias']});
NJ('carretero',{n:'Carretero',nf:'Carretera',outdoor:1,sched:'outdoor',lvl:1,sk:['animal','survival'],ab:'con',tag:'cart',items:['cuerda','madera_pino','grano'],gold:[10,45],out:['tunica','sombrero_ala','botas']});
NJ('maestro',{n:'Maestro de escuela',nf:'Maestra de escuela',inside:1,sched:'shop',lvl:2,sk:['hist','persu','invest'],ab:'int',tag:'teach',items:['libro','tinta'],gold:[12,45],out:['tunica_ropaje','sombrero','zapatos']});
NJ('criado',{n:'Criado',nf:'Criada',inside:1,sched:'shop',lvl:1,sk:['percep','stealth'],ab:'dex',tag:'servant',items:['pan','tela'],gold:[3,22],out:['tunica','zapatos']});
NJ('lavandera',{n:'Lavandero',nf:'Lavandera',outdoor:1,sched:'outdoor',lvl:1,sk:['percep','persu'],ab:'con',tag:'wash',items:['tela','sal'],gold:[2,16],out:['tunica','zapatos']});
NJ('florista',{n:'Florista',nf:'Florista',stall:1,sched:'market',lvl:1,sk:['nature','persu'],ab:'cha',tag:'flower',items:['rosas','hiperico','orquidea'],gold:[5,28],out:['tunica','zapatos']});
NJ('carbonero',{n:'Carbonero',nf:'Carbonera',outdoor:1,sched:'outdoor',lvl:1,sk:['survival','athl'],ab:'con',tag:'coal',items:['carbon','madera_pino','hacha_tala'],gold:[6,30],out:['tunica','sombrero_ala','botas']});
NJ('estibador',{n:'Estibador',nf:'Estibadora',outdoor:1,sched:'outdoor',lvl:1,sk:['athl'],ab:'str',tag:'dock',items:['cuerda','sal','pescado'],gold:[5,25],out:['tunica','gorro','botas']});
NJ('cordelero',{n:'Cordelero',nf:'Cordelera',inside:1,sched:'shop',lvl:1,sk:['invest'],ab:'dex',tag:'rope',items:['cuerda','tela','lana'],gold:[8,35],out:['tunica','zapatos']});
NJ('peajero',{n:'Peajero',nf:'Peajera',outdoor:1,sched:'outdoor',lvl:2,sk:['persu','insight'],ab:'cha',tag:'toll',items:['anillo'],gold:[20,80],out:['tunica_fina','sombrero_ala','botas']});
NJ('copista',{n:'Monje copista',nf:'Monja copista',inside:1,sched:'monk',lvl:2,sk:['hist','invest','relig'],ab:'int',tag:'copy',items:['tinta','libro_g','libro'],gold:[0,12],out:['tunica','sandalias']});
NJ('guia',{n:'Guía de montaña',nf:'Guía de montaña',outdoor:1,sched:'outdoor',lvl:3,sk:['survival','nature','percep'],ab:'wis',tag:'guide',items:['cuerda','antorcha','capa_viaje'],gold:[10,50],out:['capa_viaje','botas_altas','sombrero_ala'],weap:['baston']});
NJ('anciano',{n:'Anciano del barrio',nf:'Anciana del barrio',sched:'civil',lvl:1,sk:['hist','insight'],ab:'wis',tag:'elder',items:['pan','vino'],gold:[2,25],out:['tunica','zapatos']});
NJ('farero',{n:'Farero',nf:'Farera',inside:1,sched:'shop',lvl:2,sk:['percep','survival'],ab:'wis',tag:'light',items:['aceite','antorcha','cuerda'],gold:[8,35],out:['tunica','gorro','botas']});
NJ('hospitalero',{n:'Hospitalero',nf:'Hospitalera',inside:1,sched:'shop',lvl:1,sk:['persu','medic'],ab:'wis',tag:'host',items:['pan','vino','queso_cabra','miel'],gold:[6,30],out:['tunica','sandalias']});
NJ('cabrero',{n:'Cabrero',nf:'Cabrera',outdoor:1,sched:'outdoor',lvl:1,sk:['animal','survival'],ab:'wis',tag:'goat',items:['queso_cabra','leche_cabra','piel_cabra'],gold:[4,22],out:['pieles','sombrero_ala','botas']});
NJ('aprendiz',{n:'Aprendiz',nf:'Aprendiza',inside:1,sched:'shop',lvl:1,sk:['invest'],ab:'dex',tag:'appr',items:['pan'],gold:[1,10],out:['tunica','zapatos']});

// ---- Función de cada oficio ----
// eff: o orden · h salud · m ánimo · c delincuencia (por persona, por día) · wp: dónde trabaja ('home' = taller en su casa; 'street:<lugar>' = calle)
const JOBFN={
posadero:{fn:'Da cama y comida a viajeros y vecinos, y su sala es el corazón de los rumores.',ill:'Quien manda en la posada sabe quién duerme dónde… y a quién vender esa información.',eff:{m:3,c:-.5},wp:['inn']},
herrero:{fn:'Forja herramientas, rejas y armas. Sin su yunque, la comarca no tendría picos ni espadas.',eff:{o:1,m:.5},wp:['smith']},
boticario:{fn:'Prepara pociones, antídotos y remedios. Es la primera defensa contra las fiebres.',eff:{h:4},wp:['apothecary']},
sacerdote:{fn:'Oficia los ritos, consuela a los afligidos y reparte limosnas.',ill:'Su poder moral puede encender o apagar el ánimo de un barrio entero.',eff:{m:4,o:1,h:.5},wp:['temple','chapel']},
concejal:{fn:'Gobierna: dicta ordenanzas, concede licencias y decide los impuestos.',ill:'Quien manda también puede venderse. Las licencias tienen precio.',eff:{o:3,m:-1},wp:['ayuntamiento']},
mercader:{fn:'Trae y lleva mercancías: sin ellos, lo que sobra en un pueblo nunca llegaría a donde falta.',ill:'Si acapara, los precios suben.',eff:{m:1},wp:['market']},
guardia:{fn:'Patrulla las calles y los caminos, detiene a ladrones y hace respetar la ley.',ill:'No todos los guardias son incorruptibles.',eff:{o:5,c:-4},wp:['barracks']},
erudito:{fn:'Guarda, copia y estudia el saber: leyendas, hierbas, estrellas, hechizos.',eff:{o:1,m:.5},wp:['library','tower']},
panadero:{fn:'Amasa y hornea el pan de cada día. Sin pan, el barrio se agita.',eff:{h:1,m:2},wp:['bakery']},
molinero:{fn:'Muele el grano de los campos para convertirlo en harina.',eff:{h:1},wp:['mill']},
granjero:{fn:'Cultiva y cría lo que come la comarca.',eff:{h:1.5},wp:['farm']},
pescador:{fn:'Saca del mar y del río lo que llena los platos de los viernes.',eff:{h:1},wp:['fisher','port']},
lenador:{fn:'Tala y trocea la madera con la que se construye y se calienta la comarca.',ill:'Si tala de más, el bosque se resiente y el Círculo se enfurece.',eff:{m:.3},wp:['lumber']},
cazador:{fn:'Caza para la mesa y mantiene a raya a las alimañas de los caminos.',eff:{o:.5,h:.5},wp:['hunter']},
minero:{fn:'Extrae el mineral y el carbón que alimentan las fraguas.',ill:'Las galerías se cobran sus víctimas.',eff:{m:-.2},wp:['mine']},
cantero:{fn:'Corta la piedra con la que se levantan muros y puentes.',eff:{o:.5},wp:['quarry']},
curtidor:{fn:'Convierte las pieles en cuero para botas, correas y armaduras. Apesta, pero hace falta.',eff:{h:-.3,m:0},wp:['tannery']},
tejedor:{fn:'Teje la lana y el lino con los que se viste media comarca.',eff:{m:.5},wp:['home']},
monje:{fn:'Reza, copia libros y cultiva la tierra del monasterio. Su canto aquieta el valle.',eff:{m:3,h:1},wp:['monasterio','chapel']},
druida:{fn:'Guarda el equilibrio del bosque, cura animales y vigila a quienes lo explotan.',eff:{h:2},wp:['claro']},
ladron:{fn:'Vive de lo ajeno: bolsas, cerraduras y descuidos.',ill:'Cada robo deja a un vecino más desconfiado.',eff:{c:5,o:-1,m:-.5},wp:['street:alley']},
mendigo:{fn:'Pide limosna a las puertas de los templos. Los vecinos generosos dicen que se aprende más de ellos que de nadie.',eff:{m:-.3,c:.3},wp:['street:beggar']},
juglar:{fn:'Canta, cuenta historias y lleva noticias de un pueblo a otro.',eff:{m:4},wp:['street:plaza']},
aldeano:{fn:'(sin oficio definido)',eff:{},wp:['home']},
pastor:{fn:'Cuida los rebaños y provee lana, leche y queso.',eff:{h:.5},wp:['farm']},
marinero:{fn:'Navega, carga y descarga; trae noticias y mercancías del mar.',eff:{m:.5},wp:['port']},
viajero:{fn:'Recorre el mundo. Trae historias y mercancías… y se va.',eff:{},wp:[]},
noble:{fn:'Posee tierras y casas, y decide quién prospera. Un favor suyo vale más que una bolsa.',ill:'Los privilegios de unos pocos pesan sobre muchos.',eff:{o:1,m:-1},wp:['home']},
// nuevos
carpintero:{fn:'Construye y repara puertas, techos, carros y barcas.',eff:{o:1,m:.5},wp:['home']},
albanil:{fn:'Levanta y repara muros, tejados y chimeneas.',eff:{o:1},wp:['street:plaza']},
zapatero:{fn:'Hace y remienda el calzado de la comarca.',eff:{m:.5},wp:['home']},
sastre:{fn:'Corta y cose ropa a medida; los nobles y los marineros son sus mejores clientes.',eff:{m:1},wp:['home']},
alfarero:{fn:'Moldea ollas, jarras y tejas.',eff:{m:.3},wp:['home']},
tonelero:{fn:'Fabrica los toneles donde reposan el vino y el aceite.',eff:{m:.3},wp:['home']},
cervecero:{fn:'Elabora la cerveza de la taberna. Un barril bueno alegra una noche.',eff:{m:2.5,c:.3},wp:['inn']},
cocinero:{fn:'Prepara los guisos de la posada: nadie combate bien con la tripa vacía.',eff:{h:1.5,m:1.5},wp:['inn']},
camarero:{fn:'Sirve las mesas, escucha las conversaciones y lo recuerda todo.',eff:{m:1},wp:['inn']},
tendero:{fn:'Atiende el colmado: sal, cuerda, aceite y lo que haga falta.',eff:{m:.5},wp:['shop']},
carnicero:{fn:'Despieza y vende la carne que llega del campo.',eff:{h:.5},wp:['street:market']},
pregonero:{fn:'Anuncia a voces las ordenanzas, las fiestas y las noticias.',ill:'Lo que pregona decide de qué se habla en la plaza.',eff:{o:1,m:1},wp:['street:plaza']},
escribano:{fn:'Redacta contratos, cartas y testamentos. Sin su pluma, nada es oficial.',ill:'Quien escribe puede falsificar.',eff:{o:2},wp:['ayuntamiento','llotja']},
recaudador:{fn:'Cobra los impuestos que pagan las calles y la guardia.',ill:'Nadie lo quiere en su puerta.',eff:{o:2,m:-3},wp:['ayuntamiento']},
usurero:{fn:'Presta dinero a quien no tiene… a un precio.',ill:'Sus deudas hunden familias y alimentan a La Sombra.',eff:{m:-2,c:1},wp:['home']},
maton:{fn:'Cobra deudas «a la antigua» para La Sombra y mantiene el miedo en el barrio.',ill:'Su presencia ensombrece las calles.',eff:{c:3,o:-2,m:-1},wp:['street:alley']},
contrabandista:{fn:'Mueve mercancías sin pagar tasas: sal, vino… y cosas peores.',ill:'Sus rutas enriquecen a La Sombra y empobrecen a las arcas del concejo.',eff:{c:3,o:-1},wp:['street:port']},
estafador:{fn:'Vive de la palabra: promesas, falsas reliquias, mapas del tesoro.',ill:'Deja a los incautos sin un maravedí… y sin confianza.',eff:{c:2,m:-1},wp:['street:market']},
barbero:{fn:'Afeita, corta el pelo, sangra y arranca muelas. Y sabe todos los chismes del barrio.',eff:{m:1,h:.5},wp:['home']},
comadrona:{fn:'Asiste los partos y cuida de las madres y los recién nacidos.',eff:{h:3,m:1},wp:['home']},
curandero:{fn:'Vende ungüentos y remedios de la abuela. Algunos curan… otros solo consuelan.',ill:'Hay quien confunde la fe con la medicina.',eff:{h:.5,m:1},wp:['street:plaza']},
aguador:{fn:'Reparte agua limpia por las calles. Sin él, las fiebres se multiplicarían en verano.',eff:{h:2.5},wp:['street:plaza']},
farolero:{fn:'Enciende los faroles al anochecer y los apaga al alba. Las calles iluminadas son más seguras.',eff:{o:1,c:-1.5},wp:['street:plaza']},
sereno:{fn:'Vela las calles de noche y canta las horas.',eff:{o:2,c:-2},wp:['street:plaza']},
enterrador:{fn:'Entierra a los muertos antes de que las enfermedades se ceben con los vivos.',eff:{h:2,m:-.3},wp:['street:plaza']},
campanero:{fn:'Hace sonar las campanas: la hora, la misa, la alarma.',eff:{o:1,m:1},wp:['temple','chapel']},
sacristan:{fn:'Cuida el templo, ayuda al párroco y custodia las llaves.',eff:{m:1},wp:['temple','chapel']},
carretero:{fn:'Lleva mercancías de un pueblo a otro por los caminos. Sin carros, los precios se desbocan.',eff:{m:.3},wp:['street:market']},
maestro:{fn:'Enseña a leer, contar y rezar a los hijos del barrio.',eff:{m:1,o:1},wp:['library','home']},
criado:{fn:'Sirve en casas ricas. Ve, oye y calla… la mayor parte de las veces.',eff:{m:.2},wp:['ayuntamiento','home']},
lavandera:{fn:'Lava la ropa en el río y la fuente. Allí se cuentan los mejores chismes.',eff:{h:.5,m:1.5},wp:['street:river']},
florista:{fn:'Vende flores para bodas, funerales y enamorados.',eff:{m:2},wp:['street:market']},
carbonero:{fn:'Quema leña en el bosque para sacar carbón para las fraguas.',eff:{m:.2},wp:['street:forest']},
estibador:{fn:'Carga y descarga los barcos. Su espalda mueve el comercio del puerto.',eff:{m:.3},wp:['street:port']},
cordelero:{fn:'Trenza cuerdas y redes para marineros y pescadores.',eff:{m:.3},wp:['home']},
peajero:{fn:'Cobra el paso del puente y del camino.',ill:'Cada moneda que cobra es un motivo de queja.',eff:{o:1,m:-1},wp:['street:bridge']},
copista:{fn:'Copia libros a mano en el scriptorium. El saber de la comarca pasa por su pluma.',eff:{o:.5,m:.5},wp:['monasterio','library']},
guia:{fn:'Conoce cada sendero de la montaña y lleva peregrinos a salvo.',eff:{o:1},wp:['street:plaza']},
anciano:{fn:'Memoria viva del barrio: cuenta historias, aconseja y sabe quién es quién.',eff:{m:1.5,o:.5},wp:['street:plaza']},
farero:{fn:'Mantiene encendido el faro para que los barcos no encallen en la Cornisa.',eff:{o:1},wp:['lighthouse']},
hospitalero:{fn:'Acoge a peregrinos y caminantes con pan, lecho y conversación.',eff:{h:.5,m:2},wp:['inn']},
cabrero:{fn:'Guarda cabras en las laderas y vende queso y leche.',eff:{h:.5},wp:['street:forest']},
aprendiz:{fn:'Aprende un oficio de un maestro a cambio de trabajo duro.',eff:{m:.2},wp:['home']}
};
for(const id in JOB){JOB[id].fn=(JOBFN[id]||{}).fn||'';}

// ¿A qué oficios (por zona) se asigna cada puesto de trabajo?
const GEN_PLAN2={
sant_cugat:[['monje',4],['copista',3],['escribano',1],['erudito',1],['maestro',1],['concejal',1],['posadero',1],['herrero',1],['boticario',1],['panadero',1],['tendero',1],['guardia',3],['sacerdote',1],['sacristan',1],['campanero',1],['hospitalero',1],['granjero',2],['molinero',1],['mercader',2],['carretero',1],['cocinero',1],['camarero',1],['lavandera',1],['barbero',1],['comadrona',1],['curandero',1],['enterrador',1],['mendigo',1],['aguador',1],['anciano',1],['aprendiz',3]],
salinas:[['minero',6],['cantero',1],['carretero',2],['guardia',2],['posadero',1],['cocinero',1],['camarero',1],['tendero',1],['contrabandista',2],['sacerdote',1],['curandero',1],['mercader',1],['estibador',1],['anciano',1],['mendigo',1],['aprendiz',2]],
barcino:[['guardia',4],['sereno',2],['mercader',4],['mendigo',2],['juglar',1],['marinero',2],['noble',1],['tejedor',1],['ladron',2],
 ['carpintero',1],['albanil',1],['zapatero',1],['sastre',1],['aguador',2],['farolero',1],['pregonero',1],['escribano',2],['recaudador',1],['usurero',1],['maton',2],['contrabandista',1],['estafador',1],['barbero',1],['comadrona',1],['curandero',1],['enterrador',1],['campanero',1],['sacristan',1],['cocinero',2],['camarero',2],['cervecero',1],['lavandera',2],['carretero',2],['estibador',3],['criado',3],['maestro',1],['copista',1],['anciano',1],['carnicero',1],['florista',0],['cordelero',1],['alfarero',1],['tonelero',1],['aprendiz',3]],
collserola:[['cazador',1],['lenador',1],['carbonero',1],['curandero',1],['granjero',2],['druida',1],['cabrero',1],['aprendiz',1]],
martorell:[['granjero',4],['curtidor',1],['tejedor',1],['panadero',1],['mercader',1],['guardia',1],['mendigo',1],['pastor',1],['carpintero',1],['albanil',1],['lavandera',1],['carretero',2],['tonelero',1],['cocinero',1],['camarero',1],['tendero',1],['barbero',1],['comadrona',1],['sacerdote',1],['sacristan',1],['enterrador',1],['campanero',1],['curandero',1],['aprendiz',2]],
collbato:[['pastor',2],['mercader',1],['sacerdote',1],['guardia',1],['mendigo',1],['carpintero',1],['zapatero',1],['albanil',1],['lavandera',1],['cocinero',1],['camarero',1],['tendero',1],['barbero',1],['guia',1],['cabrero',1],['aprendiz',1]],
montserrat:[['monje',3],['mercader',1],['guardia',1],['hospitalero',1],['cocinero',1],['copista',2],['campanero',1],['guia',1],['tendero',1],['aprendiz',1]],
garraf:[['marinero',3],['pescador',4],['granjero',2],['guardia',2],['mendigo',1],['sacerdote',1],['pastor',1],['juglar',1],['mercader',2],['contrabandista',2],['farero',1],['carpintero',1],['cordelero',1],['tonelero',1],['lavandera',1],['cocinero',1],['camarero',1],['estibador',2],['curandero',1],['comadrona',1],['aprendiz',1]],
vega:[['granjero',3],['pastor',1],['pescador',1],['carretero',1],['lavandera',1],['curandero',1],['posadero',1]],
pas_molins:[['pastor',1],['cazador',1],['guardia',1],['posadero',1],['cocinero',1],['peajero',1],['carretero',1]],
cam_collbato:[['minero',4],['cantero',3],['guardia',1],['cocinero',1],['carretero',2],['aprendiz',1]],
ascenso:[['monje',2],['pastor',1],['guia',1],['hospitalero',1]],
marjal:[['pescador',2],['cordelero',1],['marinero',1],['lavandera',1]],
cornisa:[['pastor',1],['cazador',1],['contrabandista',1],['guardia',1]]};
