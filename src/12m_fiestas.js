// ===================== FIESTAS INTERACTIVAS: eventos propios de cada celebración =====================
GD('rosa','Rosa de Sant Jordi','misc',3,.1,{});GD('mascara','Máscara de carnaval','misc',4,.2,{});GD('farolillo','Farolillo de Sant Joan','misc',2,.2,{});
const FEST_Z=z=>['barcino','martorell','sant_cugat','montserrat','collbato','penedes','egara','montseny','maresme'].includes(z);
const festN=c=>npcNear(c,x=>!x.traveler&&x.job!=='guardia');
const fz=c=>zsGet(c.z);
function festBoost(c,m,o){const s=fz(c);s.m=Math.min(100,s.m+m);if(o)s.o=Math.min(100,s.o+o)}
const FEV=(id,fest,ex,run,w)=>({id,w:w||9,ok:c=>!!c.fest&&c.fest.id===fest&&(c.city||c.town)&&(!ex||ex(c)),run});
EVENTS.push(
FEV('fest_jordi','jordi',null,c=>{const n=festN(c);if(!n)return null;const lover=Object.keys(n.rel).map(i=>({r:n.rel[i],o:G.npcs[i]})).find(x=>x.o&&x.o.alive&&['conyuge','amante','enamorado','pretendido'].includes(x.r.k));
 return EVN('Sant Jordi: la calle huele a rosas y papel. '+n.name+' sostiene un puñado de flores sin vender, con la mirada triste.',[
  O('Comprar una rosa (3 fl) y regalársela',()=>{if(G.pc.gold<3)return EVN('No te llega ni para una rosa.',[evEnd()]);addGold(-3);npcAdj(n,10,true);repGain(c.z,1);gainXp(15);festBoost(c,1.5);learn(n,'fav',true);return EVN(n.name+' sonríe y la guarda junto al pecho. «Hacía años que nadie...»',[evEnd()],'Una rosa','🌹')}),
  O('Regalarle un libro',()=>{if(!have('libro_g'))return EVN('No llevas ningún libro.',[evEnd()]);takeItem('libro_g',1);npcAdj(n,['escribano','copista','erudito'].includes(n.job)?22:12,true);gainXp(30);festBoost(c,1);return EVN('Pasa las páginas con reverencia. «Es el mejor regalo de Sant Jordi.»',[evEnd()],'Un libro','📖')}),
  O(lover?'Llevarle la rosa a '+lover.o.name:'Ofrecerte de mensajero del amor',()=>{if(!lover)return EVN('No sabes a quién llevarla.',[evEnd()]);if(G.pc.gold<3)return EVN('No tienes dinero para la rosa.',[evEnd()]);addGold(-3);npcAdj(n,6,true);npcAdj(lover.o,6,true);addRel(n,lover.o,lover.r.k,6);addRel(lover.o,n,lover.r.k,6);gainXp(25);return EVN('Haces de mensajero. Los dos se miran y sonríen.',[evEnd()],'Mensajero','💌')}),
  evEnd('Seguir tu camino')],'Sant Jordi','🌹')}),
FEV('fest_joan','joan',c=>c.ph.id>=4,c=>EVN('Revetlla de Sant Joan: la plaza arde en hogueras, cohetes y música. Un grupo de jóvenes salta las llamas entre risas.',[
  O('Saltar la hoguera [Acrobacias CD 12]',()=>{const r=check('acro',12);if(r.ok){gainXp(35);repGain(c.z,2);festBoost(c,2);return EVN('Saltas con el cielo rojo encima. Te aplauden. «¡Eso da suerte todo el año!»',[evEnd()],'¡Salto!','🔥')}G.pc.hp=Math.max(1,G.pc.hp-3);gainXp(10);return EVN('Rozas las llamas y te chamuscas la bota (-3 PG). Se ríen contigo, no de ti.',[evEnd()],'Chamusquina','🔥')}),
  O('Comprar un farolillo de deseos (2 fl)',()=>{if(G.pc.gold<2)return EVN('Sin monedas no hay deseo.',[evEnd()]);addGold(-2);if(!G.pc.inspiration&&Math.random()<.5){G.pc.inspiration=true;log('Pides un deseo: sientes una chispa de inspiración.','good')}gainXp(12);festBoost(c,1);return EVN('Lo sueltas al cielo. Sube, tembloroso, hasta mezclarse con las estrellas.',[evEnd()],'Un deseo','🏮')}),
  O('Tirar al fuego un recuerdo viejo',()=>{gainXp(15);G.pc.hp=Math.min(G.pc.maxHp,G.pc.hp+4);return EVN('Dejas ir algo que pesaba. Respiras mejor.',[evEnd()],'Dejar ir','🕯')}),
  evEnd('Mirar desde lejos')],'Revetlla','🔥')),
FEV('fest_merce','merce',null,c=>EVN('La Mercè: tambores, diablos con cohetes y la gran bestia de fuego recorren las calles. Una chispa suelta rueda hacia el público.',[
  O('Apartar a la gente [Atletismo CD 12]',()=>{const r=check('athl',12);repGain(c.z,r.ok?4:1);gainXp(r.ok?40:15);if(!r.ok)G.pc.hp=Math.max(1,G.pc.hp-2);facGain('castellers',r.ok?2:0);return EVN(r.ok?'Empujas a un grupo de niños a tiempo. Sólo se chamuscan los pies de los gigantes.':'Llegas tarde: la chispa quema una manga (-2 PG), pero nadie sale herido.',[evEnd()],'La chispa','🧯')}),
  O('Unirte a la danza de los diablos [Interpretación CD 11]',()=>{const r=check('perf',11);gainXp(r.ok?35:12);festBoost(c,r.ok?3:1);if(r.ok)infamyGain(-1);return EVN(r.ok?'Bailas entre chispas con el diablo mayor. La plaza vibra.':'Tropiezas con la cola del diablo. Risas y aplausos amables.',[evEnd()],'Correfoc','👹')}),
  O('Buscar bolsillos ajenos entre el gentío [Juego de manos CD 14]',()=>{const r=check('sleight',14);if(r.ok){const g=3+Math.floor(Math.random()*12);addGold(g);infamyGain(1);return EVN('Entre el humo, '+g+' fl cambian de manos sin que nadie lo note.',[evEnd()],'Entre humo','🪙')}infamyGain(3);G.bounty[c.z]=(G.bounty[c.z]||0)+15;return EVN('Una mano te sujeta la muñeca. «¡Ladrón!» Te señalan (multa 15 fl).',[evEnd()],'Pillado','⚠')},{cls:'dark'}),
  evEnd('Ver el espectáculo')],'La Mercè','👹')),
FEV('fest_castanyada','castanyada',null,c=>{const n=festN(c);const gr=Object.values(G.npcs).find(x=>x.alive&&x.zone===c.z&&x.flags&&x.flags.grief);
 return EVN('La Castanyada: huele a castañas asadas y a cirios. '+(gr?gr.name+' lleva flores al cementerio, solo/a.':'Una anciana reparte castañas a los niños.'),[
  O('Acompañar al cementerio',()=>{if(!gr)return EVN('Acompañas a la anciana un rato. Habla de quienes ya no están.',[evEnd()],'Memoria','🕯');npcAdj(gr,14,true);gr.mood=Math.min(100,(gr.mood||40)+15);gr.flags.grief=null;gainXp(30);festBoost(c,2);return EVN('Dejáis flores en silencio. '+gr.name+' te aprieta la mano. «Gracias por no dejarme solo/a hoy.»',[evEnd()],'Los difuntos','🕯')}),
  O('Comprar castañas y panellets (5 fl) para repartir',()=>{if(G.pc.gold<5)return EVN('Sin monedas.',[evEnd()]);addGold(-5);repGain(c.z,2);if(n)npcAdj(n,8,true);gainXp(20);festBoost(c,1.5);return EVN('Repartes un cucurucho a cada niño. Te llaman «el de las castañas» todo el mes.',[evEnd()],'Castañas','🌰')}),
  evEnd('Seguir tu camino')],'Castanyada','🌰')}),
FEV('fest_carnaval','carnaval',null,c=>EVN('Carnestoltes: máscaras, serpentinas y un desfile que lleva en andas una sardina enorme. Un vendedor te ofrece una máscara.',[
  O('Comprar una máscara (4 fl) y disfrazarte',()=>{if(G.pc.gold<4)return EVN('No tienes dinero.',[evEnd()]);addGold(-4);giveItem('mascara',1);infamyGain(-3);G.bounty[c.z]=Math.max(0,(G.bounty[c.z]||0)-10);gainXp(15);return EVN('Con la máscara puesta, nadie sabe quién eres. Hoy, el pasado queda atrás.',[evEnd()],'Disfraz','🎭')}),
  O('Cantar en el entierro de la sardina [Interpretación CD 10]',()=>{const r=check('perf',10);gainXp(r.ok?30:10);festBoost(c,r.ok?2.5:1);repGain(c.z,r.ok?2:0);return EVN(r.ok?'Compones unos versos soeces y emotivos. El gentío llora de risa.':'Desafinas, pero la sardina no se queja.',[evEnd()],'La sardina','🐟')}),
  evEnd('Mirar el desfile')],'Carnestoltes','🎭')),
FEV('fest_reyes','reyes',null,c=>EVN('Cabalgata de Reyes: carrozas, caramelos y niños subidos a hombros. Una niña pierde su zapato en el gentío.',[
  O('Devolverle el zapato',()=>{repGain(c.z,2);gainXp(15);festBoost(c,1.5);return EVN('La niña te regala un caramelo mordido y una sonrisa sin dientes.',[evEnd()],'El zapato','👞')}),
  O('Repartir caramelos (6 fl)',()=>{if(G.pc.gold<6)return EVN('Sin monedas.',[evEnd()]);addGold(-6);repGain(c.z,3);gainXp(25);festBoost(c,2);return EVN('Te rodean los niños. Los mayores te saludan con respeto.',[evEnd()],'Dulces','🍬')}),
  evEnd('Seguir viendo')],'Reyes','👑')),
FEV('fest_eulalia','eulalia',null,c=>EVN('Santa Eulàlia: los gigantes bailan por la plaza. Uno cojea: falta un portador y la comparsa no encuentra relevo.',[
  O('Cargar con el gigante [Atletismo CD 13]',()=>{const r=check('athl',13);gainXp(r.ok?45:15);facGain('castellers',r.ok?3:1);repGain(c.z,r.ok?3:1);return EVN(r.ok?'Aguantas la mole al ritmo de la gralla. Te vitorean desde las ventanas.':'Se te dobla la espalda a mitad de baile. Otro te releva entre risas.',[evEnd()],'El gigante','🗿')}),
  evEnd('Aplaudir')],'Santa Eulàlia','🗿')),
FEV('fest_moreneta','moreneta',c=>['barcino','montserrat','collbato'].includes(c.z),c=>EVN('Fiesta de la Moreneta: una larga fila de peregrinos sube hacia Montserrat. Un anciano se detiene, jadeante, y mira el camino.',[
  O('Ayudarle a subir',()=>{facGain('orden',3);repGain(c.z,2);gainXp(35);festBoost(c,2);return EVN('Subes con él paso a paso. Al llegar, reza por ti sin que se lo pidas.',[evEnd()],'Peregrino','⛪')}),
  O('Dejar un donativo (10 fl)',()=>{if(G.pc.gold<10)return EVN('No llevas tanto.',[evEnd()]);addGold(-10);facGain('orden',4);gainXp(20);return EVN('El monje anota tu nombre en el libro de benefactores.',[evEnd()],'Donativo','🕊')}),
  evEnd('Seguir tu camino')],'La Moreneta','⛪')),
FEV('fest_gracia','gracia',null,c=>EVN('Fiesta Mayor de Gràcia: cada calle compite con su decorado. La vuestra pierde por falta de papel y pintura.',[
  O('Aportar 15 fl a la decoración',()=>{if(G.pc.gold<15)return EVN('No llevas tanto.',[evEnd()]);addGold(-15);repGain(c.z,4);gainXp(30);festBoost(c,3,2);return EVN('Los vecinos pintan hasta el amanecer. Ganáis un premio de papel y estrellas.',[evEnd()],'La calle','🏮')}),
  O('Ayudar a montar [Atletismo CD 11]',()=>{const r=check('athl',11);repGain(c.z,r.ok?3:1);gainXp(r.ok?30:12);festBoost(c,r.ok?2:.5);return EVN(r.ok?'Cuelgas guirnaldas a seis metros y ni te mareas.':'Te caes de la escalera sobre unas flores de papel. Sobrevives.',[evEnd()],'Montaje','🪜')}),
  evEnd('Pasear')],'Fiesta Mayor','🏮')),
FEV('fest_anyo','anyo',null,c=>EVN('Cap d\'Any: las campanas dan las doce y todo el mundo intenta tragarse doce uvas, una por campanada.',[
  O('Intentar las doce uvas [Constitución CD 12]',()=>{const r=check('athl',12,{ab:'con'});if(r.ok){G.pc.inspiration=true;gainXp(30);return EVN('Doce uvas, doce campanadas, ni una trampa. «¡Este año te irá bien!»',[evEnd()],'Doce uvas','🍇')}gainXp(10);return EVN('Te atragantas en la octava. Te dan palmadas y brindis.',[evEnd()],'Doce uvas','🍇')}),
  evEnd('Brindar')],'Cap d\'Any','🍇'))
);

EVENTS.push(
FEV('fest_diada','diada',null,c=>{const n=festN(c);return EVN('Diada: banderas en las plazas y velas por quienes cayeron. Un grupo discute con voz baja sobre qué se debe recordar.',[
  O('Escuchar las historias de los mayores',()=>{if(n){npcAdj(n,6,true);learn(n,'bio0',true)}gainXp(25);festBoost(c,1.5);return EVN('Te cuentan lo que no sale en los libros: nombres, casas, miedos. Algo de eso se queda contigo.',[evEnd()],'Memoria','🕯')}),
  O('Mediar entre posturas [Persuasión CD 13]',()=>{const r=check('persu',13);const s=fz(c);if(r.ok){s.o=Math.min(100,s.o+4);s.m=Math.min(100,s.m+3);repGain(c.z,3);gainXp(35);return EVN('Consigues que cada quien escuche al otro. La plaza termina en un brindis tenso pero sincero.',[evEnd()],'Concordia','🕊')}s.c=Math.min(100,s.c+2);gainXp(10);return EVN('Tus palabras caen como aceite en el fuego. Mejor irte antes de que sea peor.',[evEnd()],'Mal paso','🔥')}),
  evEnd('Mirar y callar')],'Diada','🕯')}),
FEV('fest_nadal','nadal',null,c=>{const n=festN(c);return EVN('Nadal: unos niños golpean a un tronco con cara, el Tió, cantando para que «cague» regalos. Falta alguien que lo cubra con la manta y deje caer algo.',[
  O('Esconder dulces bajo la manta (4 fl)',()=>{if(G.pc.gold<4)return EVN('Sin monedas.',[evEnd()]);addGold(-4);repGain(c.z,2);if(n)npcAdj(n,6,true);gainXp(20);festBoost(c,2);return EVN('Los niños gritan al ver aparecer turrón. Nadie sospecha de ti… o todos fingen no hacerlo.',[evEnd()],'El Tió','🪵')}),
  O('Sumarte a la escudella de la plaza',()=>{G.pc.hp=Math.min(G.pc.maxHp,G.pc.hp+6);if(n)npcAdj(n,5,true);gainXp(15);festBoost(c,1);return EVN('Un cuenco humeante y buena compañía. Recuperas fuerzas (+6 PG).',[evEnd()],'Escudella','🍲')}),
  evEnd('Seguir tu camino')],'Nadal','🪵')})
);
// los días de fiesta suben la moral de la zona y la afluencia
bus.on('day',()=>{const f=festAt(G.t);if(!f)return;for(const z of Object.keys(ZINFO)){if(!FEST_Z(z))continue;const s=zsGet(z);s.m=Math.min(100,s.m+1.5)}});
// los carteristas aprovechan las fiestas
EVENTS.push({id:'fest_carterista',w:6,ok:c=>!!c.fest&&(c.city||c.town)&&G.pc.gold>20,run:c=>EVN('Entre el gentío de '+c.fest.n+', notas un roce sospechoso en tu bolsillo.',[
  O('Agarrar la mano [Percepción CD 13]',()=>{const r=check('percep',13);if(r.ok){gainXp(30);repGain(c.z,1);return EVN('Atrapas a un muchacho flaco por la muñeca. Suplica; lo dejas ir con un buen susto.',[evEnd()],'Pillado','🧤')}const l=Math.min(G.pc.gold,5+Math.floor(Math.random()*10));addGold(-l);return EVN('Cuando te das cuenta, ya has perdido '+l+' fl.',[evEnd()],'Robado','👛')}),
  O('Ignorarlo',()=>{const l=Math.min(G.pc.gold,6);addGold(-l);return EVN('Pierdes '+l+' fl, pero evitas una discusión.',[evEnd()],'Robado','👛')})],'Carterista','👛')});
