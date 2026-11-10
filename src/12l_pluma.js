// ===================== HISTORIA 2: «La pluma que muerde» =====================
// Alguien chantajea a los vecinos con sus propios secretos. El jugador reúne tres pistas
// en boca de tres víctimas, deduce quién es «La Pluma» y decide qué hacer con él.
GD('carta_anonima','Carta anónima','quest',0,1,{});
const PL_WRITERS=['escribano','copista','erudito','bibliotecario','notario','pregonero','usurero'];
const PL_JOBN={escribano:'un oficio de pluma y contratos',copista:'un oficio de pluma y pergamino',erudito:'un oficio de libros y estudio',bibliotecario:'un oficio de libros y estudio',notario:'un oficio de pluma y contratos',pregonero:'un oficio de voz y de calles',usurero:'un oficio de cuentas y deudas'};
function plGet(){G.story2=G.story2||{ch:0,victims:[],clues:{},culprit:null,t0:0,leaks:0,end:null,wrong:0,paid:0};return G.story2}
function plAlive(id){const n=G.npcs[id];return n&&n.alive&&!n.hidden?n:(n&&n.alive?n:null)}
function plCulprit(){const S=plGet();return S.culprit?plAlive(S.culprit):null}
function plInit(first){const S=plGet();const A=Object.values(G.npcs).filter(n=>n.alive&&!n.traveler&&n.job!=='guardia');
 // culpable: gente de pluma de Barcino (o la más cercana)
 let pool=A.filter(n=>n.zone==='barcino'&&PL_WRITERS.includes(n.job)&&n!==first);
 if(!pool.length)pool=A.filter(n=>PL_WRITERS.includes(n.job)&&n!==first);
 if(!pool.length)pool=A.filter(n=>n.tr.greed>=6&&n!==first);
 if(!pool.length)return false;
 const c=pick(pool);S.culprit=c.id;
 // víctimas: gente con secreto, cerca
 const vs=[first];const sec=A.filter(n=>n.sec&&n!==first&&n!==c&&!vs.includes(n));
 sec.sort((a,b)=>(a.zone===first.zone?0:1)-(b.zone===first.zone?0:1)+(Math.random()-.5)*.8);
 for(const v of sec){if(vs.length>=3)break;vs.push(v)}
 const rest=A.filter(n=>n!==c&&!vs.includes(n));while(vs.length<3&&rest.length)vs.push(rest.splice(Math.floor(Math.random()*rest.length),1)[0]);
 S.victims=vs.map(n=>n.id);S.clues={};S.t0=G.t;S.leaks=0;S.wrong=0;S.paid=0;
 S.facts={job:c.job,zone:c.zone,init:c.name.trim()[0].toUpperCase()};
 for(const v of vs)if(!v.sec){v.sec='deuda_sombra';v.secT='guarda un secreto que no quiere que se sepa'}
 return true}
function plClueText(k){const S=plGet();const f=S.facts;
 if(k==='job')return 'La letra es firme y cuidada, de quien escribe a diario: «'+(PL_JOBN[f.job]||'un oficio de pluma')+'».';
 if(k==='zone')return 'El papel huele a '+(ZINFO[f.zone]||{n:'…'}).n+': quien lo escribió vive o trabaja allí.';
 return 'La firma «La Pluma» esconde un nombre: bajo la mancha de tinta asoma una inicial, la «'+f.init+'».'}
const PL_ORDER=['job','zone','init'];
function plCands(){const S=plGet();if(!S.facts)return[];const f=S.facts;const c=S.clues;
 return Object.values(G.npcs).filter(n=>n.alive&&!n.traveler&&(!c.job||PL_WRITERS.includes(n.job)&&(PL_JOBN[n.job]===PL_JOBN[f.job]))&&(!c.zone||n.zone===f.zone)&&(!c.init||n.name.trim()[0].toUpperCase()===f.init))}
function plQuest(title,text,state){let q=G.quests.find(x=>x.id==='q_pluma');if(!q){q={id:'q_pluma',type:'story',giver:null,title,text,state:'open',reward:{xp:0,gold:0}};G.quests.push(q)}q.title=title;q.text=text;q.state=state||'open';return q}
function plText(){const S=plGet();const vn=S.victims.map((id,i)=>{const n=G.npcs[id];const have_=S.clues[PL_ORDER[i]];return (have_?'✔ ':'· ')+(n?n.name+' ('+ZINFO[n.zone].n+')':'?')}).join(' — ');
 const lines=PL_ORDER.filter(k=>S.clues[k]).map(plClueText);
 if(S.ch===1)return 'Alguien firma «La Pluma» y chantajea a los vecinos con sus secretos. Habla con las tres víctimas para reunir pistas: '+vn+'.'+(lines.length?'\nPistas: '+lines.join(' '):'');
 if(S.ch===2){const cs=plCands().map(n=>n.name+' ('+ZINFO[n.zone].n+')');return 'Tienes las tres pistas. Busca a quien encaja y acúsalo cara a cara; un error le costará la confianza a un inocente.\nPistas: '+lines.join(' ')+(cs.length?'\nEncajan: '+cs.join(', ')+'.':'')}
 return ''}
function plAdvance(ch){const S=plGet();S.ch=ch;if(ch>0&&ch<3)plQuest('La pluma que muerde',plText())}
function plNote(m){G.journal.push({t:G.t,k:'story',m})}
function plEnd(end,title,text){const S=plGet();S.end=end;S.done=true;S.ch=3;const q=plQuest(title,text,'done');q.state='done'}
// ---------- evento de inicio ----------
EVENTS.push({id:'pluma_inicio',w:5,ok:c=>{const S=plGet();return S.ch===0&&!S.done&&dateOf(G.t).days>=6&&(c.city||c.town)&&!c.night&&c.near.some(n=>!n.traveler&&n.job!=='guardia'&&attitude(n)>=0)},
 run:c=>{const n=npcNear(c,x=>!x.traveler&&x.job!=='guardia'&&attitude(x)>=0);if(!n)return null;
  return EVN(n.name+' se te acerca pálido, con un papel arrugado: «Alguien sabe lo mío. Pide cuarenta florines en la fuente o lo cuenta a todo el barrio. Firma como La Pluma.»',[
   O('Prometer ayuda para dar con él',()=>{if(!plInit(n))return EVN('No encuentras cabos de los que tirar.',[evEnd()]);const S=plGet();S.clues.job=1;n.flags.plSeen=1;npcAdj(n,10,true);learn(n,'quirk',true);plAdvance(1);log('Nueva misión: La pluma que muerde.','sys');plNote(n.name+' me enseñó una carta de chantaje firmada «La Pluma». Hay que averiguar quién es.');
    return EVN('«Gracias. Mira el papel: '+plClueText('job')+' Hay otras dos personas a las que han escrito; pregúntales.»',[evEnd()],'La Pluma','✉')}),
   O('Pagar tú los 40 florines por él',()=>{if(G.pc.gold<40)return EVN('No llevas tanto.',[evEnd()]);addGold(-40);npcAdj(n,25,true);const S=plGet();S.paid++;return EVN('«No sé cómo agradecértelo.» Pero la carta no se detendrá solo con dinero.',[evEnd()])}),
   O('Decir que no es asunto tuyo',()=>{npcAdj(n,-6);addGossip(c.z,n.name+' ha recibido una carta anónima y nadie quiere meterse.',n);return null})],'Carta anónima','✉')}});
// ---------- opciones de diálogo ----------
const _svcPl=serviceOpts;
serviceOpts=function(n,opts){_svcPl(n,opts);const S=plGet();if(S.done||S.ch<1)return;const a=attitude(n);
 const vi=S.victims.indexOf(n.id);
 if(S.ch===1&&vi>=0&&!S.clues[PL_ORDER[vi]]){const k=PL_ORDER[vi];
  opts.push(O('Preguntarle por la carta anónima',()=>{const give=()=>{S.clues[k]=1;npcAdj(n,5,true);gainXp(40);learn(n,'sec',true);const left=PL_ORDER.filter(x=>!S.clues[x]).length;
    if(!left){plAdvance(2);plNote('Reuní las tres pistas sobre La Pluma.');}else plQuest('La pluma que muerde',plText());
    log('Pista: '+plClueText(k),'lore');return D(n,'Te enseña el papel con manos temblorosas. «Mira.» '+plClueText(k)+(left?'':' (Con esto, ya sabes qué buscar.)'),[O('Volver',()=>mainMenu(n))])};
   if(a>=10)return give();
   return D(n,'«¿Quién te ha dicho que he recibido nada?»',[O('Ganarte su confianza [Persuasión CD 12]',()=>{const r=check('persu',12);return r.ok?give():(npcAdj(n,-3),D(n,'«No sé de qué hablas.»',[O('Volver',()=>mainMenu(n))]))},{chk:1}),O('Volver',()=>mainMenu(n))])},{cls:'soc'}))}
 if(S.ch===2&&!n.flags.plCleared&&plCands().includes(n)&&!(n.id===S.victims[0]&&0)){
  opts.push(O('Acusarle de ser La Pluma',()=>plAccuse(n),{cls:'dark'}))}
 if(S.end==='perdon'&&n.id===S.culprit)opts.push(O('Pedirle noticias de la ciudad',()=>{const z=pick(Object.keys(ZINFO).filter(z=>zsGet(z)));const s=zsGet(z);return D(n,'«Aún tengo mis oídos. En '+ZINFO[z].n+' ahora mismo '+(s.o<45?'hay inquietud y poco orden':s.h<45?'se pasa penas y enfermedad':s.m<40?'falta moral':'va todo razonablemente bien')+'.»',[O('Volver',()=>mainMenu(n))])},{cls:'soc'}));
};
function plAccuse(n){const S=plGet();const right=n.id===S.culprit;
 if(!right){n.flags.plCleared=1;S.wrong++;npcAdj(n,-25,true);addGossip(n.zone,'Alguien ha acusado a '+n.name+' de ser La Pluma. Se rumorea que fue un error.',n);
  return D(n,'«¿Yo? ¡Qué insolencia! Vete antes de que llame a la guardia.» (Era inocente. Tus pistas aún te señalan a otras personas.)',[O('Disculparte',()=>{npcAdj(n,6);return mainMenu(n)}),O('Marcharte',()=>null)])}
 return D(n,'Se queda inmóvil. Después sonríe, derrotado. «Qué rápido. ¿Cuánto sabes?»',[
  O('Mostrar las tres pistas',()=>plConfront(n),{cls:'soc'}),O('Volver',()=>mainMenu(n))])}
function plMotive(n){if(n.tr.greed>=7)return 'Las deudas me ahogaban. Los secretos eran moneda, y la gente siempre tiene alguno.';if(n.tr.temper>=6)return 'Me humillaron durante años. Una carta bien escrita da más miedo que una espada.';if(n.tr.curious>=6)return 'Empezó como un juego: leer lo que otros esconden. Después ya no pude parar.';return 'Nadie me escuchaba. Con una carta, por fin, todos se detenían a pensar en mí.'}
function plConfront(n){const S=plGet();const vs=S.victims.map(id=>G.npcs[id]).filter(Boolean);
 return D(n,'«'+plMotive(n)+' Hecho está. ¿Qué piensas hacer conmigo?»',[
  O('Entregarlo a la Guardia',()=>plEndJusticia(n),{cls:'soc'}),
  O('Obligarlo a trabajar para ti (chantaje)',()=>plEndChantaje(n),{cls:'dark'}),
  O('Exponer sus cartas ante todo el barrio',()=>plEndExponer(n),{cls:'dark'}),
  O('Dejar que queme las cartas y se redima',()=>plEndPerdon(n),{cls:'soc'})])}
function plEndJusticia(n){const S=plGet();const g=Object.values(G.npcs).find(m=>m.alive&&m.job==='guardia'&&m.zone===n.zone);
 n.hidden=true;n.flags.jailUntil=G.t+1440*14;n.flags.jailed=1;npcAdj(n,-40);
 for(const id of S.victims){const v=G.npcs[id];if(v&&v.alive){npcAdj(v,18,true);v.mood=Math.min(100,(v.mood||50)+15)}}
 repGain(n.zone,6);facGain('concejo',3);const s=zsGet(n.zone);s.o=Math.min(100,s.o+8);s.m=Math.min(100,s.m+5);gainXp(650);addGold(60);
 addGossip(n.zone,(g?g.name+' ha arrestado a ':'Han arrestado a ')+n.name+': era La Pluma, el autor de las cartas.',n);
 plNote('Entregué a '+n.name+' a la Guardia: era La Pluma.');
 plEnd('justicia','La pluma que muerde','La Guardia ha detenido a '+n.name+'. Las víctimas respiran y el barrio confía un poco más en sus vecinos.');
 log('La Pluma queda en manos de la Guardia. Las víctimas te lo agradecen.','good');
 return D(null,'La Guardia se lleva a '+n.name+' con las cartas como prueba. Las víctimas, al saberlo, te dan las gracias en silencio. Recibes una gratificación de 60 fl.',[O('Cerrar',()=>null)])}
function plEndChantaje(n){const S=plGet();npcAdj(n,-15);n.flags.plSlave=1;S.tribute=1;infamyGain(7);gainXp(300);
 plNote('Obligué a '+n.name+' a trabajar para mí: cada día me paga a escondidas.');
 plEnd('chantaje','La pluma que muerde','Ahora '+n.name+' escribe para ti. Cobras cada día un tributo… mientras las víctimas no lo descubran.');
 log('«La Pluma» te paga ahora a ti.','warn');
 return D(n,'«Tú ganas… pero algún día alguien lo adivinará.» Sonríe sin ganas. «Cada día tendrás tu parte.»',[O('Cerrar',()=>null)])}
function plEndExponer(n){const S=plGet();const vs=S.victims.map(id=>G.npcs[id]).filter(Boolean);
 for(const v of vs){learn(v,'sec',true);v.flags.secretKnown=true;npcAdj(v,-18,true);v.mood=Math.max(0,(v.mood||50)-25);addGossip(v.zone,'Se ha hecho pública la carta de La Pluma sobre '+v.name+': '+(v.secT||'tenía algo que ocultar')+'.',v)}
 npcAdj(n,-60,true);n.mood=0;n.flags.disgraced=1;repGain(n.zone,-4);const s=zsGet(n.zone);s.o=Math.max(0,s.o-6);s.m=Math.max(0,s.m-8);s.c=Math.min(100,s.c+6);gainXp(350);infamyGain(2);
 for(const z of new Set(vs.map(v=>v.zone)))addGossip(z,'El barrio entero habla del escándalo de las cartas.',null);
 plNote('Expuse a La Pluma ante el barrio. Todos los secretos acabaron en la calle.');
 plEnd('exponer','La pluma que muerde','Las cartas se leyeron en voz alta. '+n.name+' quedó desacreditado, pero las víctimas pagaron el precio de la verdad.');
 return D(null,'Lees las cartas en la plaza. '+n.name+' se hunde; pero los secretos de las víctimas ya no lo son. Algunos te miran con rencor.',[O('Cerrar',()=>null)])}
function plEndPerdon(n){const S=plGet();npcAdj(n,35,true);n.mood=70;n.flags.plRedeem=1;
 for(const id of S.victims){const v=G.npcs[id];if(v&&v.alive){npcAdj(v,6,true);v.mood=Math.min(100,(v.mood||50)+8)}}
 repGain(n.zone,2);facGain('orden',3);gainXp(500);const s=zsGet(n.zone);s.m=Math.min(100,s.m+6);giveItem('carta_anonima',1);
 plNote(n.name+' quemó las cartas y prometió enmendarse.');
 plEnd('perdon','La pluma que muerde','Las cartas arden en el fuego. '+n.name+' promete usar su pluma para algo mejor. Ahora te cuenta lo que sabe de la ciudad.');
 return D(n,'Las cartas arden una a una. «Me has dado una segunda oportunidad. Cuando quieras saber algo de la ciudad, pregúntame.»',[O('Cerrar',()=>null)])}
// ---------- consecuencias diarias ----------
bus.on('day',()=>{const S=plGet();const dd=dateOf(G.t).days;
 if(S.ch>=1&&S.ch<3&&!S.done&&S.t0){const el=dd-Math.floor(S.t0/1440);if(el>=10&&(el-10)%7===0){const vs=S.victims.map(id=>G.npcs[id]).filter(n=>n&&n.alive);const v=vs[S.leaks%Math.max(1,vs.length)];
   if(v){S.leaks++;npcAdj(v,-10,true);v.mood=Math.max(0,(v.mood||50)-25);addGossip(v.zone,v.name+' ha sufrido la filtración de un secreto. Nadie sabe quién envió las cartas.',v);const s=zsGet(v.zone);s.o=Math.max(0,s.o-4);s.m=Math.max(0,s.m-5);log('Un secreto de '+v.name+' ha salido a la luz. La Pluma sigue libre.','warn');
    if(S.leaks>=3){S.end='fracaso';S.done=true;S.ch=3;const q=plQuest('La pluma que muerde','La Pluma siguió escribiendo. Las víctimas dejaron de confiar en nadie.','done');q.state='failed';for(const z of new Set(vs.map(x=>x.zone))){const s2=zsGet(z);s2.c=Math.min(100,s2.c+8)}plNote('No logré detener a La Pluma a tiempo.')}}}}
 if(S.end==='chantaje'&&S.tribute){const c=plAlive(S.culprit);if(c){addGold(10+Math.floor(Math.random()*8));S.paid++;
   if(Math.random()<.035){S.tribute=0;infamyGain(8);for(const id of S.victims){const v=G.npcs[id];if(v&&v.alive)npcAdj(v,-18,true)}c.flags.plSlave=0;npcAdj(c,-30);addGossip(c.zone,'Se ha descubierto que '+c.name+' pagaba a alguien con el dinero de las cartas… y el rastro lleva a ti.',c);log('Se descubre tu chantaje: pierdes tu fuente de ingresos.','bad')}}}
 if(S.end==='perdon'&&Math.random()<.25){const c=plAlive(S.culprit);if(c)addGossip(c.zone,c.name+' ha empezado a escribir cartas para quien no sabe: pagan lo justo.',c)}
 // liberación de la cárcel
 for(const id in G.npcs){const n=G.npcs[id];if(n.flags&&n.flags.jailed&&G.t>=n.flags.jailUntil){n.flags.jailed=0;if(n.alive){n.hidden=false;n.mood=Math.max(20,n.mood||0);addGossip(n.zone,n.name+' ha salido de la cárcel. Dicen que viene cambiado.',n)}}}
});
// ---------- rumores ----------
const _rumorPl=rumorFor;rumorFor=function(n){const S=plGet();if(S.ch>=1&&!S.done&&Math.random()<.25)return pick(['Dicen que alguien reparte cartas anónimas con amenazas. Yo dormiría con un ojo abierto.','Han llegado cartas a la puerta de gente decente. Firman como «La Pluma».','Mi vecina no sale de casa desde que le llegó un sobre sin remitente.']);
 if(S.end==='justicia'&&Math.random()<.2)return 'Desde que cayó La Pluma, la gente vuelve a dejar la puerta abierta.';
 if(S.end==='exponer'&&Math.random()<.2)return 'Aquel escándalo de las cartas lo recuerda todo el barrio. Algunos aún no se hablan.';
 return _rumorPl(n)};
