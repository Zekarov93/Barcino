// ===================== SOCIAL: diálogo, rumores, saber, encargos =====================
const LORE=[
{id:'arnau',z:['barcino','collserola','martorell'],sk:'hist',dc:11,t:'El Comte Arnau, dicen, fue un noble cruel condenado a cabalgar eternamente sobre un caballo de fuego por los bosques de Collserola. Quien lo ve, no duerme tres noches.'},
{id:'drac',z:['barcino'],sk:'hist',dc:9,t:'La Casa del Dragón se levantó, según la leyenda, sobre el lugar donde Sant Jordi mató al dragón. De su sangre brotó el primer rosal, y de sus huesos, las columnas de la Casa.'},
{id:'diable',z:['martorell'],sk:'hist',dc:12,t:'El Pont del Diable lo construyó el Diablo en una noche a cambio del alma del primero que lo cruzara. Los vecinos hicieron pasar un perro: el Diablo, burlado, arrojó una roca al río.'},
{id:'moreneta',z:['montserrat','collbato'],sk:'relig',dc:11,t:'La Moreneta, la Virgen negra, fue hallada por unos pastores guiados por luces y música celestial. Los monjes aseguran que la imagen no pudo moverse de la cueva: pesaba como la montaña.'},
{id:'sagrada',z:['barcino'],sk:'arcana',dc:14,t:'La Aguja Sagrada de Barcino está hueca y sus muros contienen cristales arcanos. Los eruditos del Colegio creen que fue construida para resonar con algo que duerme bajo la ciudad.'},
{id:'vibria',z:['montserrat','collbato'],sk:'nature',dc:13,t:'La Víbria, dragona alada de Montserrat, sólo sale en los crepúsculos de tormenta. Su mirada petrifica, dicen, pero solo si te ve antes de que la veas.'},
{id:'trasgos',z:['collserola'],sk:'nature',dc:10,t:'Los trasgos de Collserola odian el hierro frío y adoran la leche derramada. Quien deja un cuenco ante la puerta suele dormir sin ser molestado.'},
{id:'salnitre',z:['collbato'],sk:'arcana',dc:12,t:'Las cuevas de Collbató cantan por el salnitre cuando sopla viento del norte. Los mineros evitan la Cueva del Salnitre: el eco te devuelve palabras que no pronunciaste.'},
{id:'castells',z:['barcino','collbato'],sk:'hist',dc:8,t:'Los castells son torres humanas que cada colla levanta para honrar la fiesta. El enxaneta, el niño que corona la torre, hace el «aleta» al llegar arriba: el gesto de la mano que dice «hemos llegado».'},
{id:'peste',z:['barcino'],sk:'hist',dc:13,t:'La Gran Peste vació barrios enteros de Barcino. La Hermandad de Sant Eloi dice que el herbolario de Sant Pau encontró una cura, pero que un noble la compró y la enterró.'},
{id:'oro',z:['barcino','martorell'],sk:'hist',dc:15,t:'Existe un tesoro de la antigua Barcino romana enterrado bajo la plaza del Rey. Mapas falsos de él circulan desde hace siglos, pero uno es verdadero.'},
{id:'monjes',z:['montserrat'],sk:'relig',dc:9,t:'La Escolanía de Montserrat es el coro de niños más antiguo del mundo. Su canto, dicen, aquieta las tormentas del Llobregat.'},
{id:'circulo',z:['collserola'],sk:'nature',dc:12,t:'El Círculo de Collserola protege un claro donde los árboles responden con crujidos cuando oyen mentiras. Allí no se puede mentir sin que el viento lo note.'},
{id:'sirena',z:['barcino'],sk:'nature',dc:14,t:'Los pescadores del Port Vell cuentan que en las noches sin luna, entre las olas, una mujer de piel perlada canta nombres que nadie ha oído. A algunos les devuelve la memoria.'},
{id:'santjoan',z:['barcino','collserola','martorell'],sk:'nature',dc:10,t:'La noche de Sant Joan se recoge la flor de hipérico (herba de Sant Joan): protege del mal de ojo y cura heridas lentas. Debe cogerse antes del alba.'},
{id:'cardona',z:['collbato','martorell'],sk:'hist',dc:11,t:'La sal de Cardona se vende en toda la comarca. Dicen que las minas se abrieron cuando un pastor halló una montaña de cristal rosado que sabía a mar.'}
];
function loreAvailable(zone){return LORE.filter(l=>l.z.includes(zone))}
function learnLore(l,silent){if(G.lore[l.id])return false;G.lore[l.id]=G.t;if(!silent){log('Recuerdas: '+l.t,'lore');toast('Nuevo saber: '+l.id,'lore')}gainXp(15);G.journal.push({t:G.t,k:'lore',m:l.t});return true}
function passiveLore(zone){ // el jugador "recuerda" espontáneamente
 const cand=loreAvailable(zone).filter(l=>!G.lore[l.id]&&passive(l.sk)>=l.dc+2);if(cand.length&&Math.random()<.35){const l=pick(cand);learnLore(l);return l}return null}

const GIFT_LIKE={greed:['anillo','amuleto','cristal','vino'],pious:['romero_h','libro_g','miel','rosas'],curious:['libro_g','tinta','cristal','orquidea'],warm:['pan','turron','panellets','rosas','miel'],humor:['vino','cerveza','laud'],brave:['espada_corta','daga','vino'],honest:['pan','queso_cabra','libro_g'],temper:['vino','cerveza','carne_cordero']};
function giftValue(n,s){const I=ITEMS[s.id];let v=Math.min(12,(I.v*qMult(s.q))/6+1);for(const t of TRAITS){if(n.tr[t]>=6&&(GIFT_LIKE[t]||[]).includes(s.id))v+=3}const tp=itemTopic(s.id);if(tp&&n.likes){if(n.likes.includes(tp)){v+=4;discover(n,'likes',tp)}else if(n.dislikes.includes(tp)){v-=4;discover(n,'dislikes',tp)}}if(s.id==='veneno')v=-8;if(I.cat==='raw'&&!I.rare)v*=.4;return Math.round(v)}

// ---------- rumores ----------
function rumorFor(n){const pool=[];const z=n.zone;const E=G.econ[z];
 const exp=ECO_ITEMS.filter(i=>E&&E.t[i]>=8&&scarcity(z,i)>1.6),cheap=ECO_ITEMS.filter(i=>E&&E.t[i]>=8&&scarcity(z,i)<.7);
 if(exp.length){const i=pick(exp);pool.push('Escasea '+ITEMS[i].n.toLowerCase()+' por aquí; los precios están por las nubes.')}
 if(cheap.length){const i=pick(cheap);pool.push('Hay '+ITEMS[i].n.toLowerCase()+' de sobra y se vende barato; buen momento para comprar.')}
 const cc=animalCounts(z);const pr=['lobo','trasgo','ogro','vibria','jabali'].filter(s=>cc[s]>=3);if(pr.length&&z!=='barcino')pool.push('Se oyen '+CREAT[pick(pr)].n.toLowerCase()+'s cerca de los caminos. Mejor no viajar de noche.');
 if(G.extinct&&Object.keys(G.extinct).some(k=>k.startsWith(z)&&G.killed[k]))pool.push('Dicen que alguien ha acabado con '+CREAT[Object.keys(G.extinct).find(k=>k.startsWith(z)&&G.killed[k]).slice(z.length)].n.toLowerCase()+'s por aquí. Los bosques están raros.');
 if(G.bounty[z]>20)pool.push('La Guardia busca a un forastero que anda dando problemas...'+(G.bounty[z]>40?' y alguien dice que se parece a ti.':''));
 const f=nextFest(G.t);if(f&&f.days<=7)pool.push('Se acerca '+f.f.n+'. '+f.f.desc);
 const others=Object.values(G.npcs).filter(o=>o.alive&&o.zone===z&&o.id!==n.id&&!o.traveler);
 if(others.length){const o=pick(others);const r=n.rel[o.id];if(r){const w=r.v<=-25?'no se llevan nada bien':r.v>=35?'son uña y carne':'se conocen de hace tiempo';pool.push(o.name+' ('+JOB[o.job].n.toLowerCase()+') y yo '+w+'.')}
  pool.push(o.name+' anda raro últimamente. '+(o.tr.temper>6?'Tiene un humor de perros.':o.tr.curious>6?'Hace demasiadas preguntas.':'Está distraído.'))}
 pool.push('Dicen que '+pick(['hay un tesoro bajo la Aguja','el Comte Arnau cabalgó anoche','la Víbria bajó a beber al Llobregat','una sirena cantó en el Port Vell','el huevo de piedra de la Casa del Dragón ha empezado a latir','unos monjes vieron luces sobre la Santa Cova'])+', aunque yo no lo creo... del todo.');
 if(n.sec&&n.tr.honest<4&&Math.random()<.2)pool.push('Entre nosotros, mi vecino oculta algo gordo; pero no he dicho nada.');
 return pick(pool)}
function weatherLine(n){const w=G.wx[n.zone];const L=WEATHER_LINE[w.type];return L?pick(L):''}
function timeLine(n){const ph=phaseOf(G.t);return{0:'A estas horas lo sensato es dormir.',1:'Madrugas mucho, ¿eh?',2:'Buena mañana para trabajar.',3:'El día está en lo más alto.',4:'Ya cae la tarde.',5:'Casi anochece; ve pensando dónde pasar la noche.',6:'Es de noche... ¿no deberías estar a cubierto?'}[ph.id]}
// ---------- nodos de diálogo ----------
function D(n,text,opts,o){return Object.assign({npc:n,text,opts:opts||[]},o||{})}
function O(l,f,o){return Object.assign({l,f},o||{})}
function bye(n){return null}
function mainMenu(n){const a=attitude(n);const opts=[];const J=JOB[n.job];const ph=phaseOf(G.t);
 opts.push(O('Charlar un rato',()=>chat(n)));
 opts.push(O('Hablar de un tema…',()=>topicMenu(n)));
 if(canGoal(n))opts.push(O('Hablar de sus sueños y esperanzas',()=>goalTalk(n),{cls:'soc'}));
 opts.push(O('Preguntar por su vida',()=>askLife(n)));if(Object.keys(n.rel).length)opts.push(O('Preguntar por su gente…',()=>aboutMenu(n)));
 opts.push(O('Observar a '+n.name+' [Perspicacia]',()=>observeNpc(n),{chk:1}));
 opts.push(O('Ver su ficha',()=>{npcSheet(n);return D(n,'«¿Algo más?»',[O('Volver',()=>mainMenu(n))])}));
 opts.push(O('¿Hay algo nuevo por aquí? (rumores)',()=>{n.aff=Math.min(100,n.aff+.5);const r=rumorFor(n);return D(n,'«'+r+'»',[O('Seguir hablando',()=>mainMenu(n)),O('Despedirse',bye)])}));
 const shopB=shopOf(n);if(shopB||n.job==='mercader'||n.job==='viajero'||n.job==='juglar'){opts.push(O('Comerciar',()=>{bus.emit('trade',{n,b:shopB});return null},{cls:'trade'}))}
 serviceOpts(n,opts);
 if(a>=-10){const questTxt=questOffer(n);if(questTxt)opts.push(O(questTxt.l,questTxt.f))}
 questTurnins(n,opts);
 const bk=Object.keys(n.rel).length;
 opts.push(O('Hablar con tacto, seducir, presionar…',()=>socialMenu(n),{cls:'soc'}));
 if(skillMod('hist')>=2||skillMod('arcana')>=2||skillMod('relig')>=2||skillMod('nature')>=2)opts.push(O('Evocar una leyenda (saber)',()=>loreTalk(n),{cls:'lore'}));
 opts.push(O('Acciones turbias…',()=>shady(n),{cls:'dark'}));
 opts.push(O('Despedirse',bye));
 return D(n,greetText(n),opts)}
function greetText(n){const a=attitude(n);const m=moodWord(a);const first=!n.met;let t;
 if(first){n.met=true;n.known=Math.max(n.known,1);ensureKn(n).job=1;n.kn.age=1;t='«'+(voiceGreet(n,true)||'Buenas.').replace('{t}',G.pc.name)+' Soy '+n.name+', '+npcTitle(n).toLowerCase()+'.»'}
 else{const vg=(m==='warm'||m==='neutral')?voiceGreet(n,false):null;t=(vg?vg:pick(GREET[m])).replace('{t}',G.pc.name);t='«'+t.replace(/^«|»$/g,'')+'»'}
 if(Math.random()<.35)t+=' «'+weatherLine(n)+'»';else if(Math.random()<.25)t+=' «'+timeLine(n)+'»';
 const f=festAt(G.t);if(f&&Math.random()<.4)t+=' «¡Estamos en '+f.n+'!»';
 return t}
function chat(n){ensurePrefs(n);const opts=[O('Seguir hablando',()=>mainMenu(n)),O('Despedirse',bye)];const cd=G.t-n.lastTalk;let gain=0;
 if(n.social<=2&&Math.random()<.45){npcAdj(n,-1);if(!n.disc.social)n.disc.social=1;return D(n,'«Mira, no soy de mucha charla. Si no necesitas nada…» Se le nota incómodo.',[O('Volver',()=>mainMenu(n)),O('Despedirse',bye)])}
 if(n.social>=8&&!n.disc.social)n.disc.social=1;
 if(cd>240){gain=1+(n.tr.warm>=6?1:0)+(abMod('cha')>=2?1:0);npcAdj(n,gain);n.lastTalk=G.t;if(!n.met)n.met=true}
 const topics=[()=>'«'+weatherLine(n)+'»',()=>'«'+rumorFor(n)+'»',()=>'«Siempre me ha gustado mi oficio. '+(n.quirk?cap(n.quirk)+'; ya sabes cómo soy.':'')+'»',()=>'«No me quejo. '+pick(['Podría ser peor.','Hay que seguir.','Hoy me levanté con buen pie.'])+'»',()=>'«¿Has probado el estofado de la posada? Ni una gota de agua, te lo juro.»',()=>'«Dicen que el invierno va a ser duro.»'];
 const lore=Math.random()<.18?passiveLore(n.zone):null;let text=pick(topics)();if(chatLearn(n))text+='\n(Has aprendido algo nuevo de '+n.name+'.)';if(lore)text+='\n(Tu memoria se despierta: '+lore.t+')';if(gain)text+='\n'+(gain>=2?'(Os caéis bien.)':'');return D(n,text,opts)}
function askLife(n){const a=attitude(n);const opts=[];const ch=n.bio||[];const lvl=n.known;const needs=[0,12,30];const unlocked=Math.min(3,1+(a>=needs[1]?1:0)+(a>=needs[2]?1:0));
 let text='';const shown=Math.max(n.bioKnown||1,1);
 const show=(i)=>{learn(n,'bio'+i,true);if(i===0)learn(n,'home',true);if(!n.bioKnown)n.bioKnown=0;n.bioKnown=Math.max(n.bioKnown,i+1);n.known=Math.max(n.known,Math.min(3,i+1));return ch[i]};
 const next=n.bioKnown||0;
 if(next<ch.length){if(next===0||a>=needs[Math.min(next,2)]){text='«'+show(next)+'»';npcAdj(n,1);gainXp(2)}else{text='«No te voy a contar mi vida a la primera de cambio.» (Necesitas más confianza: actitud '+needs[Math.min(next,2)]+'+, tienes '+a+'.)';}}
 else text='«Ya te lo he contado todo, ¿no?»';
 const insightDC=13+Math.floor(n.lvl/2);
 if(next<ch.length&&a<needs[Math.min(next,2)])opts.push(O('Leer su lenguaje corporal [Perspicacia CD '+insightDC+']',()=>{const r=check('insight',insightDC);if(r.ok){text='«…»  Notas que le duele hablar de ello. Intuyes: '+ch[Math.min(next,ch.length-1)].split('.')[0]+'.';n.bioKnown=Math.max(n.bioKnown||0,next+1);learn(n,'bio'+next,true);return D(n,text,[O('Volver',()=>mainMenu(n))])}else return D(n,'Te mira con recelo: «¿Qué miras?»',[O('Volver',()=>mainMenu(n))],{aff:-1})},{chk:1}));
 if(n.sec&&a>=18&&!n.flags.secretKnown)opts.push(O('Insistir con delicadeza: «Sé que ocultas algo» [Persuasión/Perspicacia CD '+(15+Math.floor(n.lvl/2))+']',()=>askSecret(n),{cls:'dark'}));
 if(n.flags.secretKnown)opts.push(O('Hablar de su secreto…',()=>secretMenu(n),{cls:'dark'}));
 opts.push(O('Seguir hablando',()=>mainMenu(n)));opts.push(O('Despedirse',bye));
 const relInfo=Object.keys(n.rel).filter(id=>G.npcs[id]&&n.rel[id].v!==0&&Math.abs(n.rel[id].v)>=20).slice(0,2).map(id=>G.npcs[id].name+' ('+n.rel[id].k+')');if(relInfo.length&&next>=1)text+='\n(Menciona a: '+relInfo.join(', ')+'.)';
 return D(n,text,opts)}
function askSecret(n){const dc=15+Math.floor(n.lvl/2);const r=check('insight',dc,{label:'Perspicacia',silent:true});const r2=check('persu',dc+1,{silent:true,bonus:Math.floor(attitude(n)/15)});log(r.txt+' / '+r2.txt.replace('Persuasión','Persuasión'),'');
 if(r.ok||r2.ok){n.flags.secretKnown=true;learn(n,'sec',true);n.known=3;npcAdj(n,-2);return D(n,'Se queda pálido un momento y baja la voz: «...Está bien. Pero esto no sale de aquí. '+cap(n.secT)+'.»',[O('Es un secreto que guardaré',()=>{npcAdj(n,15,true);n.flags.kept=1;return mainMenu(n)}),O('Hablar de lo que sé…',()=>secretMenu(n)),O('Marcharse',bye)])}
 npcAdj(n,-5);return D(n,'«No sé de qué me hablas. Y no me gusta que lo insinúes.»',[O('Volver',()=>mainMenu(n))])}
function secretMenu(n){const S=SECRETS.find(s=>s.id===n.sec)||{};const opts=[];
 opts.push(O('Chantajear: «Pagarás por mi silencio» [Intimidación CD '+(13+Math.floor(n.lvl/2))+']',()=>{const r=check('intim',13+Math.floor(n.lvl/2));if(r.ok){const g=Math.min(n.gold,20+n.lvl*15);n.gold-=g;addGold(g);npcAdj(n,-35,true);infamyGain(6);n.flags.blackmailed=1;log('Obtienes '+fmtGold(g)+' de '+n.name+'.','bad');return D(n,'«Está bien, toma... y que Dios te perdone.» Te da '+fmtGold(g)+'.',[O('Volver',()=>mainMenu(n))])}else{npcAdj(n,-25,true);return D(n,'«¡Fuera de mi vista! ¡Eres una rata!»',[O('Volver',()=>mainMenu(n))])}},{cls:'dark'}));
 const lev=S.lev;if(lev&&FACTIONS[lev]&&lev!=='crimen'){opts.push(O('Informar a '+FACTIONS[lev].n+' de lo que sabes',()=>{npcAdj(n,-45,true);facGain(lev,12);gainXp(25);n.flags.betrayed=1;log('Delatas a '+n.name+' ante '+FACTIONS[lev].n+'.','bad');return D(n,'(Su mirada lo dice todo. Ya no te hablará igual.)',[O('Marcharse',bye)])},{cls:'dark'}))}
 if(lev==='crimen'){opts.push(O('Entregar a la Guardia lo que sabes',()=>{npcAdj(n,-55,true);facGain('concejo',10);repGain(G.zone,5);gainXp(30);n.flags.betrayed=1;return D(n,'(Pálido, comprende. No volverá a confiar en ti.)',[O('Marcharse',bye)])},{cls:'dark'}))}
 opts.push(O('Ofrecer tu ayuda para resolverlo',()=>{npcAdj(n,10,true);n.flags.help=1;const pq=pqStart(n);G.quests.push({id:'q_sec_'+n.id,type:'secret',giver:n.id,title:'El secreto de '+n.name,text:cap(n.secT)+'. Ayúdale a resolverlo.'+(pq?' '+pq.hint+(pq.zone!==n.zone?' (Ve a '+ZINFO[pq.zone].n+'.)':''):''),state:'open',pq:pq?pq.pq:null,zone:pq?pq.zone:null,reward:{xp:60,gold:40,aff:25}});return D(n,'«¿De verdad? ...Gracias. Te lo debo. Anota esto en tu diario.»',[O('Volver',()=>mainMenu(n))])}));
 opts.push(O('Volver',()=>mainMenu(n)));return D(n,'«¿Qué piensas hacer con eso que sabes?»',opts)}
function loreTalk(n){const cand=loreAvailable(n.zone);const opts=[];const l=cand.filter(x=>!G.lore[x.id]);let text;
 if(!l.length){text='Ya recuerdas todo lo que sabías de este lugar. '+n.name+' asiente: «Sabes más que yo.»';return D(n,text,[O('Volver',()=>mainMenu(n))])}
 const pick_=pick(l);const sk=SK[pick_.sk];text='Piensas en el lugar... en su historia. ('+sk.n+' CD '+pick_.dc+')';
 return D(n,text,[O('Intentar recordar ['+sk.n+' CD '+pick_.dc+', '+fmt(skillMod(pick_.sk))+']',()=>{const r=check(pick_.sk,pick_.dc);if(r.ok){learnLore(pick_,true);n.aff=Math.min(100,n.aff+3);return D(n,'Recuerdas: '+pick_.t+'\n\n'+n.name+' te mira con interés: «Vaya, sabes de lo que hablas.»',[O('Volver',()=>mainMenu(n))])}return D(n,'No logras recordar los detalles. Se te escapa como arena entre los dedos.',[O('Volver',()=>mainMenu(n))])},{chk:1}),O('Volver',()=>mainMenu(n))])}
function questOffer(n){return null}
function questTurnins(n,opts){}
// ---------- servicios por oficio ----------
function shopOf(n){const z=getZone(n.zone);if(n.work){const b=z.buildings.find(x=>x.id===n.work);if(b&&b.shop)return b}return null}
function serviceOpts(n,opts){const J=JOB[n.job];const z=n.zone;
 if(n.job==='posadero'){const b=shopOf(n);opts.push(O('Alquilar una habitación (8 fl / noche)',()=>{if(G.pc.gold<8)return D(n,'«Sin dinero no hay cama, amigo.»',[O('Volver',()=>mainMenu(n))]);addGold(-8);bus.emit('sleep',{where:'inn',n,b});return null},{cls:'svc'}));
  opts.push(O('Pedir de comer (estofado, 4 fl)',()=>{if(G.pc.gold<4)return D(n,'«No te alcanza.»',[O('Volver',()=>mainMenu(n))]);addGold(-4);drinkSome(1);G.pc.needs.hunger=Math.max(0,G.pc.needs.hunger-45);log('Comes un plato caliente.','ok');return D(n,'Te sirven un plato humeante. Te sientes mucho mejor.',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}))}
 if(n.job==='sacerdote'||n.job==='monje'){opts.push(O('Pedir una bendición (donativo 10 fl)',()=>{if(G.pc.gold<10)return D(n,'«La fe no tiene precio, hijo, pero la vela sí.»',[O('Volver',()=>mainMenu(n))]);addGold(-10);facGain('orden',1);if(!G.pc.inspiration&&Math.random()<.6){G.pc.inspiration=true;log('Sientes la inspiración heroica.','ok')}G.pc.hp=Math.min(G.pc.maxHp,G.pc.hp+Math.ceil(G.pc.maxHp*.2));return D(n,'Murmura una plegaria y te toca la frente. Te sientes aliviado.',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
  opts.push(O('Pedir sanación (30 fl)',()=>{if(G.pc.gold<30)return D(n,'«Lo siento, hijo.»',[O('Volver',()=>mainMenu(n))]);addGold(-30);G.pc.hp=G.pc.maxHp;G.pc.poison=0;return D(n,'Te imponen las manos y tus heridas se cierran.',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}))}
 if(n.job==='boticario')opts.push(O('Pedir un remedio (curación, 20 fl)',()=>{if(G.pc.gold<20)return D(n,'«No hay milagros sin monedas.»',[O('Volver',()=>mainMenu(n))]);addGold(-20);G.pc.hp=Math.min(G.pc.maxHp,G.pc.hp+Math.ceil(G.pc.maxHp*.6));G.pc.poison=0;return D(n,'Te prepara un cataplasma y una infusión amarga.',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.job==='herrero'||n.job==='panadero'||n.job==='boticario'||n.job==='tejedor'||n.job==='curtidor'){const tool={herrero:'smith',panadero:'cook',boticario:'alch',tejedor:'weav',curtidor:'leath'}[n.job];const cost=60;if(!G.pc.tools.includes(tool)&&!(G.pc.crafts&&G.pc.crafts[tool]>0))opts.push(O('Aprender el oficio ('+(TOOLS[tool]||tool)+', '+cost+' fl)',()=>{if(G.pc.gold<cost)return D(n,'«La enseñanza se paga.»',[O('Volver',()=>mainMenu(n))]);addGold(-cost);G.pc.crafts[tool]=1;G.pc.tools.push(tool);npcAdj(n,8);log('Aprendes los rudimentos de '+(TOOLS[tool]||tool)+'.','lvl');return D(n,'«Bien. Observa y repite. Lo demás es práctica.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}))}
 if(n.job==='guardia'&&G.bounty[G.zone]>0){opts.push(O('Pagar la multa ('+fmtGold(G.bounty[G.zone])+')',()=>{const f=G.bounty[G.zone];if(G.pc.gold<f)return D(n,'«No te alcanza. O pagas o te vienes al calabozo.»',[O('Entregarte (calabozo)',()=>{jail(n);return null}),O('Volver',()=>mainMenu(n))]);addGold(-f);G.bounty[G.zone]=0;return D(n,'«Queda saldado. Que no se repita.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));opts.push(O('Entregarte al calabozo',()=>{jail(n);return null},{cls:'svc'}))}
 if(n.job==='concejal'){const R=G.fac.concejo.rank;if(R<2)opts.push(O('Solicitar la ciudadanía ('+(150)+' fl y reputación)',()=>{if(G.pc.gold<150)return D(n,'«La ciudadanía tiene sus tasas.»',[O('Volver',()=>mainMenu(n))]);const r=check('persu',13);if(r.ok||G.zrep.barcino>=15){addGold(-150);facGain('concejo',35);return D(n,'«Firma aquí. Desde hoy eres ciudadano de Barcino.»',[O('Volver',()=>mainMenu(n))])}return D(n,'«Debes ganarte la confianza de los vecinos primero.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}))}
 if(n.job==='mercader'&&n.fac!=='mercaderes'&&G.fac.mercaderes.rank<1&&n.id==='guillem')opts.push(O('Pedir ingreso en el Gremio (100 fl)',()=>{if(G.pc.gold<100)return D(n,'«El gremio no admite pobres.»',[O('Volver',()=>mainMenu(n))]);addGold(-100);facGain('mercaderes',12);return D(n,'«Bienvenido. Ya puedes montar puesto.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.id==='guillem'&&G.fac.mercaderes.rank<1)opts.push(O('Pedir ingreso en el Gremio (100 fl)',()=>{if(G.pc.gold<100)return D(n,'«El gremio no admite pobres.»',[O('Volver',()=>mainMenu(n))]);addGold(-100);facGain('mercaderes',12);return D(n,'«Bienvenido. Ya puedes montar puesto.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.job==='erudito')opts.push(O('Consultar la biblioteca (saber, 10 fl)',()=>{if(G.pc.gold<10)return D(n,'«Los libros no se leen gratis.»',[O('Volver',()=>mainMenu(n))]);const c=LORE.filter(l=>!G.lore[l.id]);if(!c.length)return D(n,'«Ya has leído todo lo que tengo.»',[O('Volver',()=>mainMenu(n))]);addGold(-10);const l=pick(c);learnLore(l,true);return D(n,'Tras horas de lectura, aprendes: '+l.t,[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.id==='nuria'&&G.fac.castellers.rank<1)opts.push(O('Unirte a la colla (probar tu fuerza) [Atletismo CD 11]',()=>{const r=check('athl',11);if(r.ok){facGain('castellers',15);return D(n,'«¡Bienvenido a la colla! ¡Tú vas en la pinya!»',[O('Volver',()=>mainMenu(n))])}return D(n,'«Hmm, entrena y vuelve.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.job==='druida'&&G.fac.circulo.rank<1)opts.push(O('Demostrar respeto por la naturaleza [Naturaleza CD 13]',()=>{const r=check('nature',13);if(r.ok){facGain('circulo',14);return D(n,'«Hay verdad en tus palabras. El Círculo te escucha.»',[O('Volver',()=>mainMenu(n))])}return D(n,'«El bosque aún no te conoce.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.id==='griselda'&&G.fac.sombra.rank<1)opts.push(O('Susurrar: «Busco trabajo... discreto» [Engaño/Sigilo CD 13]',()=>{const r=check('decep',13);if(r.ok&&attitude(n)>=-5){facGain('sombra',13);return D(n,'Te mira largo rato. «Vuelve a medianoche. Pregunta por "la Mano".»',[O('Volver',()=>mainMenu(n))])}return D(n,'«No sé de qué hablas, forastero.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.id==='guifre'&&G.fac.orden.rank<1)opts.push(O('Ofrecerte como novicio/ayudante (donativo 20 fl)',()=>{if(G.pc.gold<20)return D(n,'«La fe no se compra, pero el pan sí.»',[O('Volver',()=>mainMenu(n))]);addGold(-20);facGain('orden',14);return D(n,'«Que el Señor te guíe, hijo.»',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
 if(n.job==='juglar')opts.push(O('Pedir una canción (2 fl)',()=>{if(G.pc.gold<2)return D(n,'«Sin monedas, sin música.»',[O('Volver',()=>mainMenu(n))]);addGold(-2);const r=Math.random();G.pc.needs.fatigue=Math.max(0,G.pc.needs.fatigue-6);if(r<.2){const l=passiveLore(n.zone);if(l)return D(n,'La balada te recuerda algo...',[O('Volver',()=>mainMenu(n))])}return D(n,'Toca una canción alegre. Te sientes más descansado.',[O('Volver',()=>mainMenu(n))])},{cls:'svc'}))}
// ---------- menú social ----------
function needAb(a,v){return G.pc.abil[a]>=v}
function socialMenu(n){const a=attitude(n);const opts=[];const dcB=Math.max(8,12+Math.floor(n.lvl/2)-Math.floor(a/20));
 opts.push(O('Persuadir: pedir un favor / descuento [Persuasión CD '+dcB+', '+fmt(skillMod('persu'))+']',()=>{const r=check('persu',dcB);if(r.ok){n.flags.disc=G.t+1440*2;npcAdj(n,2);return D(n,'«Está bien, por ti haré un esfuerzo.» (Descuento durante 2 días con '+n.name+'.)',[O('Volver',()=>socialMenu(n))])}npcAdj(n,-2);return D(n,'«No, lo siento. No va a ser posible.»',[O('Volver',()=>socialMenu(n))])},{chk:1}));
 const chr=needAb('cha',14);opts.push(O('Camelar con encanto [Carisma 14+: '+G.pc.abil.cha+']',()=>{if(!chr)return null;const r=check('persu',10,{adv:1,label:'Encanto'});if(r.ok){npcAdj(n,6+(n.tr.warm>5?2:0));return D(n,'Sonríe a pesar de sí mismo: «Tienes labia, '+G.pc.name+'.»',[O('Volver',()=>socialMenu(n))])}return D(n,'«No pienses que me engatusas.»',[O('Volver',()=>socialMenu(n))])},{dis:!chr,why:'Carisma 14+',chk:1}));
 const str=needAb('str',15);opts.push(O('Imponer respeto [Fuerza 15+: '+G.pc.abil.str+']',()=>{if(!str)return null;const r=check('intim',12,{ab:'str'});if(r.ok){n.flags.fear=G.t+1440*3;npcAdj(n,-6);infamyGain(1);return D(n,'Traga saliva: «Está bien, está bien. No busco problemas.»',[O('Volver',()=>socialMenu(n))])}npcAdj(n,-12,true);return D(n,'Se aparta con desprecio: «Los matones no me asustan.»',[O('Volver',()=>socialMenu(n))])},{dis:!str,why:'Fuerza 15+',chk:1}));
 opts.push(O('Engañar: contar una buena mentira [Engaño CD '+(12+Math.floor(n.lvl/2))+']',()=>{const r=check('decep',12+Math.floor(n.lvl/2));if(r.ok){n.flags.lied=G.t;n.flags.disc=G.t+720;return D(n,'Se lo traga. «Entonces tenía razón...»',[O('Volver',()=>socialMenu(n))])}npcAdj(n,-10,true);return D(n,'«Mientes. Se te nota en los ojos.»',[O('Volver',()=>socialMenu(n))])},{chk:1}));
 opts.push(O('Regalar algo…',()=>giftMenu(n)));
 if(n.age>=16){const ok=orientOk(n);opts.push(O('Coquetear'+(ok?'':' (no parece interesado en ti)'),()=>flirt(n),{dis:!ok,why:'No le interesas'}));if(n.romance>=60&&a>=50&&ok&&!n.spouse&&!G.pc.spouse)opts.push(O('Proponer matrimonio (anillo 40 fl)',()=>propose(n)));if(G.pc.spouse===n.id)opts.push(O('Vida en pareja…',()=>spouseMenu(n)))}
 opts.push(O('Sobornar (20 fl) para ganar su favor',()=>{if(G.pc.gold<20)return D(n,'No tienes tanto.',[O('Volver',()=>socialMenu(n))]);addGold(-20);if(n.tr.honest>=8){npcAdj(n,-12);return D(n,'«¿Pretendes comprarme? ¡Ofendes!»',[O('Volver',()=>socialMenu(n))])}n.gold+=20;npcAdj(n,5+(n.tr.greed>=6?5:0));n.flags.bribed=G.t;return D(n,'Guarda las monedas con disimulo. «Quizás pueda ayudarte, sí.»',[O('Volver',()=>socialMenu(n))])}));
 opts.push(O('Volver',()=>mainMenu(n)));return D(n,'¿Cómo quieres tratar con '+n.name+'? (Actitud: '+relWord(a)+' '+a+')',opts)}
function orientOk(n){if(n.orient==='any')return true;return n.orient===G.pc.sex}
function giftMenu(n){const opts=[];const inv=G.pc.inv.map((s,i)=>({s,i})).filter(x=>ITEMS[x.s.id]&&(ITEMS[x.s.id].v>=1)).slice(0,14);
 inv.forEach(({s,i})=>opts.push(O(itemName(s)+' ×'+s.n+' (≈'+Math.round(ITEMS[s.id].v*qMult(s.q))+' fl)',()=>{const v=giftValue(n,s);consume(i);n.gifts++;npcAdj(n,v);bus.emit('inv');return D(n,v>6?'Sus ojos brillan: «¡Es perfecto! No debías...»':v>0?'«Gracias, es un detalle.»':'Frunce el ceño: «...¿En serio?»',[O('Volver',()=>socialMenu(n))])})));
 opts.push(O('Volver',()=>socialMenu(n)));return D(n,'¿Qué quieres regalar?',opts)}
function flirt(n){const dc=12+(attitude(n)<20?4:0)+(n.tr.honest>=7?1:0);const r=check('persu',dc,{ab:'cha',label:'Seducción'});const opts=[O('Volver',()=>socialMenu(n))];
 if(r.ok){n.romance=clamp(n.romance+8+(n.tr.warm>=6?3:0),0,100);npcAdj(n,3);return D(n,pick(['Se sonroja y aparta la mirada con una sonrisa.','«Eres encantador/a... ¿lo sabes?»','Ríe bajito. «Me gustaría verte más a menudo.»']),opts)}
 npcAdj(n,-4);n.romance=Math.max(0,n.romance-3);return D(n,pick(['«Hmm... no, gracias.»','Te mira incómodo.','«Qué ocurrencia.»']),opts)}
function propose(n){if(attitude(n)<50||n.romance<60)return D(n,'«Aún no...»',[O('Volver',()=>socialMenu(n))]);if(G.pc.gold<40)return D(n,'Te falta el anillo (40 fl).',[O('Volver',()=>socialMenu(n))]);addGold(-40);const r=check('persu',14,{ab:'cha'});if(r.ok||n.romance>=85){n.spouse=G.pc.id||'pc';G.pc.spouse=n.id;n.romance=100;npcAdj(n,20);G.fame=clamp(G.fame+2,0,100);log('¡Te casas con '+n.name+'!','lvl');return D(n,'Con los ojos húmedos: «¡Sí! ¡Mil veces sí!»',[O('Volver',()=>socialMenu(n))])}npcAdj(n,-5);return D(n,'«Necesito más tiempo.»',[O('Volver',()=>socialMenu(n))])}
function spouseMenu(n){const opts=[O('Pasar tiempo juntos',()=>{npcAdj(n,2);n.romance=Math.min(100,n.romance+2);advance(60);return D(n,'Pasáis una hora tranquila juntos.',[O('Volver',()=>spouseMenu(n))])}),O('Volver',()=>socialMenu(n))];return D(n,'«Mi vida...»',opts)}
// ---------- acciones turbias ----------
function shady(n){const opts=[];const dc=11+Math.floor(passiveOf(n)-10)+1;
 opts.push(O('Robarle discretamente [Juego de manos CD '+dc+']',()=>pickpocket(n),{cls:'dark',chk:1}));
 opts.push(O('Registrar su casa/puesto (más tarde)',()=>D(n,'(Ahora no es el momento.)',[O('Volver',()=>shady(n))])));
 if(n.job==='mercader'||n.job==='posadero'||n.job==='herrero')opts.push(O('Engañarle en el precio [Engaño CD '+(12+Math.floor(n.lvl/2))+']',()=>{const r=check('decep',12+Math.floor(n.lvl/2));if(r.ok){const g=Math.min(n.gold,15+n.lvl*5);n.gold-=g;addGold(g);npcAdj(n,-8,true);infamyGain(2);return D(n,'Le sacas '+fmtGold(g)+' con una historia plausible.',[O('Volver',()=>shady(n))])}npcAdj(n,-15,true);return D(n,'«¡Estafador!»',[O('Volver',()=>shady(n))])},{cls:'dark',chk:1}));
 opts.push(O('Atacarle',()=>{startCombat([npcCombatant(n)],{npc:n,murder:true,zone:G.zone});return null},{cls:'dark'}));
 opts.push(O('Volver',()=>mainMenu(n)));return D(n,'(Algo que quizá no deberías hacer...)',opts)}
function pickpocket(n){const dc=11+Math.max(0,passiveOf(n)-10)+1;const r=check('sleight',dc);const opts=[O('Volver',()=>shady(n))];
 if(r.ok){const g=Math.min(n.gold,Math.floor(5+n.lvl*10*Math.random()));n.gold-=g;addGold(g);G.stats.steal++;let msg='Sacas '+fmtGold(g)+' sin que se dé cuenta.';
  if(n.inv.length&&Math.random()<.45){const s=pick(n.inv);const k=1;invTake(n.inv,s.id,k);giveItem(s.id,k,s.q||0);msg+=' Además, te llevas '+ITEMS[s.id].n+'.';n.stolen.push(s.id)}
  if(g<=0&&msg.startsWith('Sacas 0'))msg='No lleva nada de valor.';if(G.fac.sombra.rank>=1)facGain('sombra',1);return D(n,msg,opts)}
 npcAdj(n,-25,true);const c=crime('robo',20,n,{victimSees:true,noStealth:true});return D(n,'«¡Ladrón! ¡Mi dinero!» Te ha descubierto.'+(c.guards?' Un guardia se acerca...':''),[O('Huir',bye),O('Volver',()=>shady(n))])}
function jail(g){const f=G.bounty[G.zone]||0;const days=Math.max(1,Math.ceil(f/30));advance(days*1440,{step:240});G.bounty[G.zone]=0;G.arrests++;const lost=G.pc.inv.filter(s=>(ITEMS[s.id].v>40&&ITEMS[s.id].cat!=='tool')).slice(0,2);lost.forEach(s=>invTake(G.pc.inv,s.id,s.n));G.pc.hp=Math.max(1,G.pc.hp-2);log('Pasas '+days+' día(s) en el calabozo.'+(lost.length?' Te confiscan objetos.':''),'bad');facGain('concejo',-3);bus.emit('inv')}
