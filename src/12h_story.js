// ===================== HISTORIA PRINCIPAL: «El huevo que late» =====================
GD('huevo_piedra','Huevo de piedra','quest',0,3,{});
const ST_FRAG={abad:{z:'montserrat',t:'Quien guarda la crónica lo sabe: «Los monjes del primer siglo vieron a la Víbria posarse sobre un nido de piedra caliente. Cada cien años pone un huevo y lo deja aprender el mundo bajo techo humano.»'},
 druida:{z:'collserola',t:'Quien cuida el bosque lo confirma: «El huevo no es de piedra: es una crisálida. Late más fuerte con la tormenta, y sólo eclosiona en la roca donde fue puesto, en el Ascenso, al caer la tarde.»'},
 faro:{z:'garraf',t:'Quien conoce el mar lo recuerda: «Mi abuelo vio a la Víbria bajar a la Cala a buscar su huevo robado. Quien lo devolvió, salvó la costa. Quien lo vendió, la vio arder.»'}};
function stGet(){G.story=G.story||{ch:0,frag:{},who:{},end:null,egg:0};return G.story}
function stAlive(id){const n=G.npcs[id];return n&&n.alive?n:null}
function stRole(r){const A=Object.values(G.npcs).filter(n=>n.alive);
 if(r==='keeper')return stAlive('jordina');
 if(r==='scholar')return stAlive('anselm')||A.find(n=>n.job==='erudito')||A.find(n=>n.job==='copista');
 if(r==='abad')return stAlive('guifre')||A.find(n=>n.job==='monje'&&n.zone==='montserrat')||A.find(n=>n.job==='monje');
 if(r==='druida')return A.find(n=>n.job==='druida'&&n.zone==='collserola')||A.find(n=>n.job==='druida');
 if(r==='faro')return A.find(n=>n.job==='farero')||A.find(n=>n.job==='anciano'&&n.zone==='garraf')||A.find(n=>n.job==='marinero'&&n.zone==='garraf')||A.find(n=>n.job==='anciano')}
function stQuest(title,text,state){const S=stGet();let q=G.quests.find(x=>x.id==='q_story');if(!q){q={id:'q_story',type:'story',giver:null,title,text,state:'open',reward:{xp:0,gold:0}};G.quests.push(q)}q.title=title;q.text=text;q.state=state||'open';return q}
function stNote(m){G.journal.push({t:G.t,k:'story',m})}
function stText(){const S=stGet();const names=r=>{const n=stRole(r);return n?n.name+' ('+ZINFO[n.zone].n+')':'(ya no vive)'};
 if(S.ch===1)return 'La Casa del Dragón guarda un huevo de piedra que late. Mestre Anselm, en Barcino, tal vez sepa qué es.';
 if(S.ch===2){const f=S.frag;return 'Anselm necesita tres testimonios sobre la Víbria y su huevo: '+['abad','druida','faro'].map(k=>(f[k]?'✔ ':'· ')+names(k)).join(' — ')+'.'}
 if(S.ch===3)return 'Tienes los tres testimonios. Vuelve con Mestre Anselm para descifrarlos.';
 if(S.ch===4)return S.egg?'Lleva el huevo de piedra al Ascenso de Montserrat y espera allí a que caiga la tarde.':'Pide a Jordina el huevo de piedra y llévalo al Ascenso de Montserrat al caer la tarde.';
 return ''}
function stAdvance(ch){const S=stGet();S.ch=ch;stQuest('El huevo que late',stText())}
// ---------- opciones de diálogo ----------
const _svc2=serviceOpts;
serviceOpts=function(n,opts){_svc2(n,opts);const S=stGet();if(S.done)return;const keep=stRole('keeper'),sch=stRole('scholar');const a=attitude(n);
 if(n===keep&&S.ch===0)opts.push(O('Preguntarle por los ruidos del sótano',()=>{const t='Baja la voz: «Hay un huevo de piedra en mi sótano, heredado. Late. Desde el otoño late más fuerte, y mi gato no se acerca. Alguien con estudios debería verlo.»';
  if(a<0)return D(n,'«No es asunto tuyo.»',[O('Volver',()=>mainMenu(n))]);
  return D(n,t,[O('Prometer averiguar qué es',()=>{stAdvance(1);learn(n,'quirk',true);log('Nueva misión: El huevo que late.','sys');stNote('Jordina Casals me confió que guarda un huevo de piedra que late en su sótano.');return D(n,'«Gracias. Mestre Anselm, en el colegio, sabe de leyendas viejas.»',[O('Volver',()=>mainMenu(n))])}),O('Ahora no',()=>mainMenu(n))],{noReact:0})},{cls:'soc'}));
 if(n===sch&&S.ch===0&&!keep)opts.push(O('Preguntar por el huevo de piedra de la Casa del Dragón',()=>{S.egg=1;giveItem('huevo_piedra',1);stAdvance(2);stNote('Encontré el huevo de piedra en el sótano de la Casa del Dragón, ya sin dueña.');return D(n,'«La pobre Jordina… Su huevo debe de seguir en el sótano; tómalo. Y busquemos entre tres voces antiguas qué hacer con él.»',[O('Volver',()=>mainMenu(n))])},{cls:'soc'}));
 if(n===sch&&S.ch===1)opts.push(O('Hablarle del huevo de piedra que late',()=>{stAdvance(2);S.frag={};stNote('Anselm cree que es un huevo de la Víbria. Necesita tres testimonios antiguos.');return D(n,'«¿Late, dices? Entonces no es piedra: es un huevo de la Víbria, el que desapareció hace siglos. Para saber cómo devolverlo necesito tres testimonios: un monje que guarde la crónica, un druida que conozca su nido y un viejo del mar que recuerde la última vez. Búscalos.»\n'+stText(),[O('Volver',()=>mainMenu(n))])},{cls:'soc'}));
 if(n===sch&&S.ch===3)opts.push(O('Contarle lo que has averiguado',()=>{stAdvance(4);stNote('Anselm descifró los testimonios: hay que devolver el huevo al nido, en el Ascenso, al caer la tarde.');return D(n,'«Así que es verdad. Hay que llevarlo al nido del Ascenso al caer la tarde y dejarlo en la roca. La Víbria vendrá. Tú decidirás qué hacer cuando llegue… Yo no tendría el valor.»',[O('Volver',()=>mainMenu(n))])},{cls:'soc'}));
 if(n===keep&&S.ch===4&&!S.egg)opts.push(O('Pedirle el huevo de piedra para devolverlo',()=>{const go=()=>{S.egg=1;giveItem('huevo_piedra',1);stAdvance(4);stNote('Jordina me entregó el huevo de piedra.');return D(n,'«Llévatelo. Y que Dios acompañe al dragón y a ti.»',[O('Volver',()=>mainMenu(n))])};
  if(a>=20)return go();const dc=14;return D(n,'«¿Mi huevo? No sé quién eres para pedírmelo.» (Necesitas actitud 20 o convencerla.)',[O('Convencerla [Persuasión CD '+dc+']',()=>{const r=check('persu',dc);if(r.ok)return go();npcAdj(n,-4);return D(n,'«No. Es de mi familia.»',[O('Volver',()=>mainMenu(n))])},{chk:1}),O('Volver',()=>mainMenu(n))])},{cls:'soc'}));
 if(S.ch===2){for(const k of ['abad','druida','faro']){const g=stRole(k);if(g===n&&!S.frag[k]){const need={abad:15,druida:10,faro:12}[k];
   opts.push(O('Preguntarle por el huevo de piedra y la Víbria',()=>{const give=()=>{S.frag[k]=1;learn(n,'bio0',true);gainXp(40);npcAdj(n,4);const done=['abad','druida','faro'].every(x=>S.frag[x]||!stRole(x));if(done){stAdvance(3)}else stQuest('El huevo que late',stText());stNote(n.name+': '+ST_FRAG[k].t);return D(n,ST_FRAG[k].t+(done?'\n\n(Ya tienes los tres testimonios. Vuelve con Anselm.)':'\n\n(Testimonio anotado en tu diario.)'),[O('Volver',()=>mainMenu(n))])};
    if(a>=need)return give();
    const alts=[];if(k==='abad')alts.push(O('Ofrecer un donativo para el monasterio (25 fl)',()=>{if(G.pc.gold<25)return D(n,'«La generosidad también se mide.»',[O('Volver',()=>mainMenu(n))]);addGold(-25);return give()}));
    if(k==='druida')alts.push(O('Demostrar que respetas el bosque [Naturaleza CD 13]',()=>{const r=check('nature',13);return r.ok?give():D(n,'«El bosque aún no te conoce.»',[O('Volver',()=>mainMenu(n))])},{chk:1}));
    if(k==='faro')alts.push(O('Invitarle a una jarra [Persuasión CD 12]',()=>{if(G.pc.gold<3)return D(n,'«Sin jarra no hay historia.»',[O('Volver',()=>mainMenu(n))]);addGold(-3);const r=check('persu',12);return r.ok?give():D(n,'Calla, mira al mar y cambia de tema.',[O('Volver',()=>mainMenu(n))])},{chk:1}));
    return D(n,'«No sé si debo hablar de eso contigo, forastero.» (Necesitas más confianza: actitud '+need+'+, tienes '+a+'.)',alts.concat([O('Volver',()=>mainMenu(n))]))},{cls:'soc'}));break}}}
 if(S.end==='codicia'&&n===sch&&S.egg===1&&!S.sold)opts.push(O('Vender el huevo de piedra (500 fl)',()=>{if(!have('huevo_piedra')){return D(n,'«¿Y el huevo?»',[O('Volver',()=>mainMenu(n))])}takeItem('huevo_piedra',1);addGold(500);S.sold=1;stNote('Vendí el huevo de la Víbria a Anselm por 500 florines.');return D(n,'«Será para estudio, te lo juro.» (No lo parece.)',[O('Volver',()=>mainMenu(n))])},{cls:'dark'}));
};
// rumores guían la búsqueda
const _rumor2=rumorFor;rumorFor=function(n){const S=stGet();if(S.ch===2&&Math.random()<.3){const k=['abad','druida','faro'].find(x=>!S.frag[x]&&stRole(x));if(k){const g=stRole(k);learn(g,'job',true);learn(g,'home',true);return 'Si buscas historias viejas de la Víbria, habla con '+g.name+' ('+npcTitle(g).toLowerCase()+') en '+ZINFO[g.zone].n+'.'}}
 if(S.end==='paz'&&Math.random()<.2)return 'Dicen que la Víbria ya no baja a los valles: alguien le devolvió su huevo.';if(S.end==='codicia'&&S.rampage&&Math.random()<.35)return 'La Víbria vuela otra vez cada noche. Dicen que le robaron lo suyo.';return _rumor2(n)};
// ---------- final en el Ascenso ----------
function stFinale(){const S=stGet();scene('vib_final',function*(S2){
 const v=S2.spawn('v',{name:'La Víbria',cr:'vibria',coat:.5,scale:1.9,fly:true,alt:6,x:G.px-20,y:G.py-14});v.spd=3;
 log('El huevo late en tus manos. El cielo se tiñe de rojo y las rocas tiemblan.','warn');v.tgt=()=>({x:G.px+8,y:G.py-4});v.stop=.6;yield S2.wait(5);
 const ch=yield S2.ask('La Víbria desciende sobre el nido. Sus ojos van del huevo a ti. No muestra odio… sólo espera.',[{l:'Dejar el huevo en la roca y retroceder',v:'paz'},{l:'Atacarla mientras está distraída',v:'lucha',cls:'dark'},{l:'Guardarte el huevo y huir',v:'huir',cls:'dark'}],'La Víbria','🐉');
 const SS=stGet();
 if(ch==='paz'){takeItem('huevo_piedra',1);SS.egg=0;yield S2.wait(3);log('La Víbria toma el huevo con una delicadeza imposible. Inclina la cabeza ante ti y alza el vuelo.','good');giveItem('escama',1);gainXp(700);G.pc.inspiration=true;SS.end='paz';repGain('montserrat',25);repGain('barcino',10);const k=stRole('keeper');if(k)npcAdj(k,30,true)}
 else if(ch==='lucha'){yield S2.say(v,'…',1.4);const an={sp:'vibria',hp:70,maxHp:70,gn:{coat:.5,size:1,hard:1},zone:G.zone,sex:'f',name:'La Víbria',alive:true,x:G.px,y:G.py};const real=(G.fauna[G.zone]||[]).find(a=>a.sp==='vibria'&&a.alive);const en=[animalCombatant(real||an)];
  const res=yield S2.fight([v],en,{});if(res==='won'){SS.end='sangre';gainXp(900);addGold(200);repGain('montserrat',-10);const ab=stRole('abad');if(ab)npcAdj(ab,-30,true);stNote('Maté a la Víbria. El huevo dejó de latir.')}else{log('La Víbria te deja ir. El huevo sigue contigo, pero ya no es el mismo.','warn');SS.end='huida'}}
 else{log('Echas a correr con el huevo bajo el brazo. Detrás, un rugido que parte las rocas.','bad');SS.end='codicia';SS.rampage=1;infamyGain(8);const k=stRole('keeper');if(k)npcAdj(k,-60,true)}
 S2.remove(v);
 SS.done=SS.end&&SS.end!=='huida';
 if(SS.end==='huida'){SS.ch=4}else{SS.ch=5;const T={paz:'La Víbria recuperó su huevo y se retiró a las cumbres. Montserrat respira.',sangre:'La Víbria cayó. Los monjes rezan por ella y los cazadores brindan.',codicia:'Robaste el huevo a la Víbria. Su furia no tardará en caer sobre los valles.'}[SS.end];stQuest('El huevo que late',T,'closed');stNote(T);bus.emit('news',T)}
 })}
function storyHour(){const S=stGet();if(S.ch!==4||S.done||G.zone!=='ascenso'||!have('huevo_piedra')||SCN.cur||R.modal||G.combat)return;const ph=phaseOf(G.t).id;if(ph<4&&ph!==6)return;stFinale()}
const _hourTick=hourTick;hourTick=function(){_hourTick();try{storyHour()}catch(e){console.error(e)}};
// consecuencias diarias de los finales
bus.on('day',()=>{const S=stGet();if(S.end==='paz'){for(const z of ['montserrat','collbato','ascenso','cam_collbato']){const s=zsGet(z);s.m=Math.min(100,s.m+1.2);s.c=Math.max(0,s.c-.5)}}
 if(S.end==='codicia'&&S.rampage){for(const z of ['montserrat','collbato','ascenso','cam_collbato']){const s=zsGet(z);s.o=Math.max(0,s.o-2);s.m=Math.max(0,s.m-1.5)}
  if(Math.random()<.12){const v=Object.values(G.npcs).filter(n=>n.alive&&!n.traveler&&['montserrat','collbato','cam_collbato','ascenso'].includes(n.zone));if(v.length){const t=pick(v);t.alive=false;t.hp=0;t.hidden=true;t.killedBy='vibria';G.dead[t.id]=G.t;const m='La Víbria ha atacado '+ZINFO[t.zone].n+': '+t.name+' no ha sobrevivido.';addGossip(t.zone,m,t);bus.emit('news',m)}}}});
