// ===================== EVENTOS ESCENIFICADOS (visibles y dinámicos en el mapa) =====================
function setEv(id,fn){const e=EVENTS.find(x=>x.id===id);if(!e)throw new Error('evento '+id);if(!e._orig)e._orig=e.run;e.run=c=>{const r=fn(c);return r}}
function humanLook(job,sex,sp){sex=sex||(Math.random()<.5?'m':'f');const L=randLook(sp||'human',sex,Math.random,job);L.sex=sex;try{L.eq=eqVis(outfitFor(L,job,Math.random,sex==='f'))}catch(e){L.eq={}}return L}
function banditTalk(S,boss,txt,opts){return S.say(boss,txt,opts)}
// ---------- Peaje de bandidos ----------
setEv('peaje_bandido',c=>{const lv=1+Math.floor(G.pc.level/3);const toll=Math.min(G.pc.gold,ri(15,40));
 return scene('peaje',function*(S){
  const en=[banditCombatant(lv),banditCombatant(1)];if(G.pc.level>=4)en.push(banditCombatant(1));
  const bs=S.group('b',en.length,i=>({name:en[i].name,look:en[i].spr.look}),12,15);const boss=bs[0];
  log('Oyes pasos y silbidos entre la maleza: alguien te ha visto.','warn');yield S.emote(boss,'!',1);
  yield S.toPlayer(bs,{timeout:30});
  if(S.timedOut){yield S.say(boss,'¡Maldita sea, se nos escapa!',2);yield S.leave(bs);log('Los bandidos se pierden de vista a tu espalda.','');return}
  S.face(boss,G.px,G.py);bs.forEach(b=>b.ring=2);
  yield S.say(boss,'Aquí se paga peaje, forastero. '+fmtGold(toll)+'.',3.2);
  let choice=yield S.ask('Los bandidos te rodean. «'+fmtGold(toll)+', o te quedas sin nada».',[
   {l:'Pagar el peaje',v:'pay'},
   {l:'Negociar [Persuasión CD 14]',chk:1,run:()=>check('persu',14).ok?'half':'greed'},
   {l:'Intimidar [Intimidación CD 15]',chk:1,run:()=>check('intim',15,{ab:'str'}).ok?'scare':'fight'},
   {l:'Luchar',v:'fight',cls:'dark'}],'Peaje de bandidos','🗡');
  if(choice==='greed'){yield S.say(boss,'Es el doble, listillo.',2.4);choice=yield S.ask('Se ríen de ti: «El doble, o desenvainamos».',[{l:'Pagar el doble',v:'pay2'},{l:'Luchar',v:'fight',cls:'dark'}],'Peaje de bandidos','🗡')}
  if(choice==='pay'||choice==='pay2'||choice==='half'){const amt=choice==='half'?Math.floor(toll/2):choice==='pay2'?Math.min(G.pc.gold,toll*2):toll;addGold(-amt);log('Entregas '+fmtGold(amt)+' a los bandidos.','');bs.forEach(b=>b.ring=false);
   yield S.say(boss,choice==='half'?'Está bien, está bien… pasa.':'Un placer hacer negocios.',2.2);yield S.leave(bs,{spd:SC_WALK*1.2});return}
  if(choice==='scare'){infamyGain(1);bs.forEach(b=>b.ring=false);yield S.say(boss,'No queremos problemas, amigo…',2.2);bs.forEach(b=>S.face(b,b.x*2-G.px,b.y*2-G.py));yield S.leave(bs);log('Los bandidos huyen entre los matorrales.','good');return}
  yield S.say(boss,'¡A por él!',1.6);
  const res=yield S.fight(bs,en,{});
  if(res==='fled'||res==='talked'){bs.forEach(b=>b.hidden=false);yield S.leave(bs)}
 })});
// ---------- Viajero herido (¿o señuelo?) ----------
setEv('viajero_herido',c=>{const trap=Math.random()<.35;
 return scene('herido',function*(S){
  const vt=S.at('v',{name:'Viajero herido',look:humanLook('viajero'),tint:[1,.78,.78],ring:1},9,12);
  log('Entre la maleza, junto al camino, distingues una figura tendida.','warn');yield S.emote(vt,'…',1.4);
  const came=yield S.near(vt,3);if(!came){S.remove(vt);log('Cuando por fin miras atrás, la figura ya no está.','');return}
  S.face(vt,G.px,G.py);yield S.say(vt,'Ayuda… por favor…',2.2);
  let done=false,known=false;
  const springTrap=function*(){vt.tint=null;vt.ring=2;yield S.say(vt,'¡Ja! ¡Ahora, muchachos!',1.8);const en=[banditCombatant(1),banditCombatant(1)];const bs=S.group('t',2,i=>({name:en[i].name,look:en[i].spr.look}),9,11);bs.forEach(b=>b.ring=2);yield S.toPlayer(bs,{timeout:14});const v=banditCombatant(1);v.spr={t:'hu',look:vt.look};v.name='Falso herido';const res=yield S.fight([vt,...bs],[v,...en],{});if(res==='fled'||res==='talked'){[vt,...bs].forEach(a=>a.hidden=false);yield S.leave([vt,...bs])}};
  while(!done){
   const opts=[{l:'Curarlo [Medicina CD 11]',chk:1,run:()=>trap?'trap':check('medic',11).ok?'heal':'failheal'},{l:'Registrar su mochila',cls:'dark',run:()=>trap?'trap':'rob'}];
   if(!known)opts.push({l:'¿Es una trampa? [Perspicacia CD 13]',chk:1,run:()=>{if(check('insight',13).ok)return trap?'sniff':'sincere';return 'unsure'}});
   opts.push({l:'Seguir tu camino',v:'go'});
   const ch=yield S.ask('Un viajero yace junto al camino, con la mochila revuelta. Respira débilmente.',opts,'Viajero herido','🩹');
   if(ch==='go'){S.remove(vt);return}
   if(ch==='unsure'){known=true;log('No consigues leer nada claro en su rostro.','');continue}
   if(ch==='sincere'){known=true;log('Sus heridas parecen verdaderas: no finge.','good');continue}
   if(ch==='sniff'){known=true;vt.ring=2;log('Notas que las heridas son falsas: es un señuelo de bandidos.','warn');
    const a2=yield S.ask('Las heridas son pintura y barro. Se mueve como quien espera.',[{l:'Atacar primero',v:'atk',cls:'dark'},{l:'Alejarte con cuidado',v:'go'}],'Es un señuelo','⚠');
    if(a2==='go'){yield S.say(vt,'¡Eh! ¡Vuelve aquí!',1.4);S.remove(vt);return}
    const en=[banditCombatant(1),banditCombatant(1)];const bs=S.group('t',2,i=>({name:en[i].name,look:en[i].spr.look}),10,12);yield S.say(vt,'¡Maldita sea! ¡A él!',1.5);bs.forEach(b=>b.ring=2);yield S.toPlayer(bs,{timeout:14});
    const v=banditCombatant(1);v.spr={t:'hu',look:vt.look};const res=yield S.fight([vt,...bs],[v,...en],{ambush:false});if(res==='fled'||res==='talked'){[vt,...bs].forEach(a=>a.hidden=false);yield S.leave([vt,...bs])}return}
   if(ch==='trap'){yield* springTrap();return}
   if(ch==='heal'){const g=ri(10,40);addGold(g);repGain(G.zone,2);G.fame=clamp(G.fame+1,0,100);gainXp(20);giveItem('pocion',1,1);vt.tint=null;vt.ring=false;yield S.say(vt,'Gracias… que tengas suerte siempre.',2.6);log('Te regala '+fmtGold(g)+' y una poción.','good');yield S.leave(vt,{spd:SC_WALK});return}
   if(ch==='failheal'){log('Haces lo que puedes, pero no consigues salvarlo.','bad');vt.ring=false;vt.tint=[.6,.6,.6];yield S.wait(1.5);S.remove(vt);return}
   if(ch==='rob'){const g=ri(5,30);addGold(g);infamyGain(2);log('Te llevas '+fmtGold(g)+' mientras gime. No te sientes bien.','bad');yield S.emote(vt,'…',1.6);S.remove(vt);return}
  }})});
// ---------- Trampa de trasgos ----------
setEv('trampa_trasgo',c=>scene('trasgos',function*(S){
 log('Algo no cuadra: hojas demasiado ordenadas, una cuerda fina entre dos ramas…','warn');
 const ch=yield S.ask('Algo no cuadra en el sendero: hojas demasiado ordenadas, una cuerda fina entre dos ramas…',[
  {l:'Examinar el sendero [Percepción CD 13]',chk:1,run:()=>{if(check('percep',13).ok)return 'ok';return 'bad'}},{l:'Rodear por otro lado',v:'go'}],'Camino sospechoso','🪤');
 const mk=()=>S.group('g',2,i=>({name:'Trasgo',cr:'trasgo',coat:.45+i*.1}),9,12);
 if(ch==='go'){return}
 if(ch==='ok'){gainXp(15);giveItem('cuerda',1,1);log('Descubres y desmontas una trampa de trasgos. Te llevas la cuerda.','good');
  const gs=mk();gs.forEach(g=>S.face(g,G.px,G.py));yield S.say(gs[0],'¡Ssss! ¡Nos han visto!',1.8);yield S.leave(gs);return}
 const dm=roll('1d6+1').total;G.pc.hp=Math.max(1,G.pc.hp-dm);log('¡Un lazo te atrapa el tobillo! '+dm+' de daño. Se oyen risas agudas…','bad');
 const gs=mk();gs.forEach(g=>g.ring=2);yield S.say(gs[0],'¡Hi hi hi hi!',1.6);yield S.toPlayer(gs,{timeout:12,rad:1.4});
 const en=gs.map(()=>S.fauna('trasgo'));const res=yield S.fight(gs,en,{ambush:true});if(res==='fled'||res==='talked'){gs.forEach(a=>a.hidden=false);yield S.leave(gs)}}));
// ---------- Leñador y lobo ----------
setEv('lenador_lobos',c=>scene('lenador',function*(S){
 const wc=S.fauna('lobo');const le=S.at('l',{name:'Leñador',look:humanLook('lenador','m'),ring:1},9,11);const lo=S.spawn('w',{name:'Lobo',cr:'lobo',coat:.5,x:le.x+1.4,y:le.y+.6});
 log('Oyes gritos entre los pinos: alguien pide socorro.','warn');lo.ring=2;S.face(lo,le.x,le.y);sceneBubble(le,'¡Socorro! ¡Un lobo!');
 const came=yield S.near(le,6.5);sceneBubble(le,null);if(!came){yield S.say(le,'¡Gracias a Dios, se aburrió!',2);yield S.leave(lo);return}
 yield S.roam([lo],2,1.6);
 const ch=yield S.ask('Un leñador está trepado a una rama mientras un lobo gruñe al pie del árbol.',[{l:'Ahuyentar al lobo',v:'fight'},
  {l:'Calmar al lobo [Trato con animales CD 14]',chk:1,run:()=>check('animal',14).ok?'calm':'angry'},{l:'Pasar de largo',v:'go'}],'Un leñador en apuros','🪓');
 if(ch==='go'){S.remove(lo);return}
 if(ch==='calm'){gainXp(40);repGain(G.zone,2);addGold(12);yield S.say(lo,'(gruñe, y retrocede despacio)',1.8,{nolog:1});yield S.leave(lo,{spd:SC_WALK});yield S.say(le,'¡Gracias! Toma, es lo que llevo.',2.4);log('El leñador te da unas monedas.','good');return}
 if(ch==='angry'){yield S.emote(lo,'!',1);}
 lo.ring=2;yield S.toPlayer([lo],{timeout:10,rad:1.2});const res=yield S.fight([lo],[wc],{ambush:ch==='angry'});if(res==='won'){yield S.say(le,'¡Me has salvado la vida!',2.4);S.remove(le)}}));
// ---------- Jabalina con crías ----------
setEv('jabali_cria',c=>scene('jabalina',function*(S){
 const sow=S.at('s',{name:'Jabalina',cr:'jabali',coat:.4,scale:1.05},9,12);const cr=[0,1,2].map(i=>S.spawn('c'+i,{name:'Jabato',cr:'jabali',coat:.7,scale:.5,x:sow.x+(i-1)*.9,y:sow.y+.8}));
 const grp=[sow,...cr];log('Entre los helechos ves una jabalina con sus crías rayadas.','');S.roamBg(grp,4);
 yield S.until(()=>S.dist(sow)<7.5,9);
 const ch=yield S.ask('Hozan la hojarasca. Aún no te ha notado.',[{l:'Observarla en silencio [Sigilo CD 11]',chk:1,run:()=>check('stealth',11).ok?'watch':'seen'},
  {l:'Cazarla',v:'hunt',cls:'dark'},{l:'Dejarla en paz',v:'go'}],'Jabalina con crías','🐗');
 if(ch==='go'){yield S.leave(grp,{spd:SC_WALK});return}
 if(ch==='watch'){yield S.roam(grp,8,5);gainXp(15);log('Pasas un rato maravilloso observando a la familia. Aprendes algo sobre sus costumbres.','good');yield S.leave(grp,{spd:SC_WALK});return}
 if(ch==='seen'){yield S.emote(sow,'!',1);log('Una rama crujiente delata tu presencia. La jabalina bufa.','warn');yield S.leave(grp,{spd:SC_RUN});return}
 yield S.emote(sow,'!',.8);sow.ring=2;cr.forEach(x=>{S.remove(x)});yield S.toPlayer([sow],{timeout:12,rad:1.2});const res=yield S.fight([sow],[S.fauna('jabali')],{})}));
// ---------- Zorro en el corral ----------
setEv('zorro_gallinas',c=>scene('zorro',function*(S){
 const fx=S.at('z',{name:'Zorro',cr:'zorro',coat:.5,ring:2},8,11);const hs=[0,1,2].map(i=>S.spawn('h'+i,{name:'Gallina',cr:'gallina',coat:.5,x:fx.x+1.5+i*.7,y:fx.y+(i%2?.7:-.5)}));
 log('Antes del amanecer oyes alboroto: un zorro ha entrado y las gallinas cacarean enloquecidas.','warn');hs.forEach(h=>{h.spd=SC_RUN;h.tgt=null});
 S.roamBg(hs,6);fx.home={x:fx.x,y:fx.y};S.roamBg([fx],6);
 yield S.until(()=>S.dist(fx)<7,9);
 const ch=yield S.ask('Un zorro persigue a las gallinas por el corral.',[{l:'Espantar al zorro [Trato con animales CD 11]',chk:1,run:()=>check('animal',11).ok?'ok':'bad'},{l:'Volver a dormir',v:'go'}],'Zorro en el corral','🦊');
 if(ch==='go'){yield S.leave(fx);hs.forEach(h=>S.remove(h));return}
 yield S.walk([fx],()=>({x:G.px,y:G.py}),0,{stop:3,spd:SC_RUN,timeout:8});
 if(ch==='ok'){gainXp(15);repGain(G.zone,1);giveItem('huevos',3,1);fx.ring=false;yield S.emote(fx,'!',.6);yield S.leave(fx);log('La dueña, agradecida, te da unos huevos.','good');hs.forEach(h=>S.remove(h));return}
 log('El zorro se escapa llevándose una gallina.','bad');S.remove(hs[0]);fx.ring=false;yield S.leave(fx);hs.slice(1).forEach(h=>S.remove(h)) }));
// ===================== LOTE 2: eventos con vecinos reales =====================
// ---------- Mendigo ----------
setEv('mendigo_pan',c=>{const n0=npcNear(c,x=>x.job==='mendigo');if(!n0)return null;
 return scene('mendigo',function*(S){const n=S.adopt(n0);if(!n)return;
  S.walk(n,()=>({x:G.px,y:G.py}),0,{stop:1.5,spd:SC_WALK});yield S.emote(n,'🙏',1.2);yield S.walk(n,()=>({x:G.px,y:G.py}),0,{stop:1.5,spd:SC_WALK,timeout:20});
  if(S.timedOut){S.remove(n);return}
  S.face(n,G.px,G.py);yield S.say(n,'Una migaja, por caridad…',2.4);
  const ch=yield S.ask('Ves a '+n.name+', un mendigo, que te mira con ojos hundidos.',[{l:'Darle pan',v:'give'},{l:'Ignorarlo',v:'ign'},{l:'Echarlo con malas formas',v:'push',cls:'dark'}],'Un mendigo','🙏');
  if(ch==='give'){takeItem('pan',1);npcAdj(n,15);repGain(G.zone,1.5);facGain('orden',1);let t='Que la Moreneta te proteja.';if(n.sec&&!n.flags.secretKnown&&Math.random()<.3)t='Dios te lo pague. Te diré algo: '+rumorFor(n);yield S.say(n,t,3.4);yield S.leave(n);return}
  if(ch==='push'){npcAdj(n,-10);repGain(G.zone,-1);yield S.emote(n,'💢',.8);yield S.leave(n,{spd:SC_RUN});return}
  yield S.emote(n,'…',1.2);yield S.leave(n)})});
// ---------- Carterista ----------
setEv('carterista',c=>{const n0=npcNear(c,x=>x.job==='ladron')||npcNear(c,x=>x.job==='aldeano');if(!n0)return null;
 return scene('carterista',function*(S){const n=S.adopt(n0);if(!n)return;
  const dc=12+Math.floor(n.lvl/2);const pp=passive('percep');
  yield S.walk(n,()=>({x:G.px,y:G.py}),0,{stop:1.1,spd:SC_WALK,timeout:24});if(S.timedOut){S.remove(n);return}
  if(pp>=dc){S.face(n,G.px,G.py);n.ring=2;log('Notas una mano que se desliza hacia tu bolsa. Es '+n.name+'.','warn');yield S.emote(n,'!',.8);
   const ch=yield S.ask('Notas una mano que se desliza hacia tu bolsa. Es '+n.name+'. Te giras y lo agarras de la muñeca.',[{l:'Denunciarlo a la Guardia',v:'rep'},{l:'Soltarlo con una advertencia',v:'let'},{l:'Darle una paliza',v:'beat',cls:'dark'}],'¡Carterista!','🖐');
   n.ring=false;if(ch==='rep'){npcAdj(n,-40);facGain('concejo',2);repGain(G.zone,2);yield S.say(n,'¡Suéltame! ¡Me las pagarás!',2);yield S.leave(n,{spd:SC_RUN});return}
   if(ch==='let'){npcAdj(n,5);yield S.say(n,'Eh… gracias, forastero.',2);yield S.leave(n);return}
   const res=yield S.fight([],[npcCombatant(n)],{npc:n,murder:true});S.remove(n);return}
  const lost=Math.min(G.pc.gold,ri(5,25));addGold(-lost);yield S.wait(.3);log('Entre el gentío, alguien te roza. Tu bolsa pesa '+fmtGold(lost)+' menos. (Percepción pasiva '+pp+' vs CD '+dc+')','bad');
  S.face(n,n.x*2-G.px,n.y*2-G.py);yield S.emote(n,'💰',.9);n.ring=2;yield S.ask('Entre el gentío, alguien te roza. Cuando te das cuenta, tu bolsa pesa '+fmtGold(lost)+' menos. (Percepción pasiva '+pp+' vs CD '+dc+')',[{l:'Maldecir y seguir',v:'x'}],'Te han robado','💸');
  n.ring=false;yield S.leave(n,{spd:SC_RUN,rt:5})})});
// ---------- Robo presenciado ----------
setEv('robo_presenciado',c=>{const vic0=npcNear(c,x=>x.job!=='ladron'&&x.job!=='guardia');const th0=Object.values(G.npcs).find(n=>n.job==='ladron'&&n.zone===c.z&&n.alive&&!n.hidden&&!n.busy&&n!==vic0);if(!vic0||!th0)return null;
 return scene('robo',function*(S){const vic=S.adopt(vic0),th=S.adopt(th0);if(!vic||!th)return;
  const z=getZone(G.zone);const p=S.point(10,14,{noPath:1});th.x=p[0];th.y=p[1];S.still(vic);vic.moving=false;vic.path=null;
  yield S.walk(th,()=>({x:vic.x,y:vic.y}),0,{stop:.9,spd:SC_WALK,timeout:20});
  S.face(th,vic.x,vic.y);S.face(vic,th.x,th.y);vic.moving=false;th.ring=2;log('Ves a '+th.name+' acercarse a '+vic.name+' y rebuscar en su bolsa con dedos ágiles.','warn');yield S.emote(th,'🗝',1.2);
  const ch=yield S.ask('Ves a '+th.name+' acercarse a '+vic.name+' y rebuscar en su bolsa con dedos ágiles.',[
   {l:'Gritar «¡Al ladrón!»',v:'shout'},{l:'Avisar a '+vic.name+' discretamente',v:'warn'},
   {l:'Pedirle su parte al ladrón [Intimidación CD 13]',cls:'dark',chk:1,run:()=>check('intim',13).ok?'cut':'nocut'},{l:'Mirar a otro lado',v:'look'}],'Un robo','🗝');
  th.ring=false;
  if(ch==='shout'){npcAdj(vic,15,true);npcAdj(th,-30);facGain('concejo',3);if(G.fac.sombra.rank>=1)facGain('sombra',-5);repGain(G.zone,2);yield S.emote(vic,'!',.8);yield S.say(th,'¡Maldito entrometido!',1.6);
   yield S.walk(th,()=>({x:G.px,y:G.py}),0,{stop:1.6,spd:SC_RUN,timeout:10});const res=yield S.fight([],[npcCombatant(th)],{npc:th,murder:false});return}
  if(ch==='warn'){npcAdj(vic,8);npcAdj(th,-8);yield S.emote(vic,'?',1);S.face(vic,th.x,th.y);yield S.say(vic,'¡Eh! ¿Qué hacéis?',1.8);yield S.leave(th,{spd:SC_RUN,rt:5});return}
  if(ch==='cut'){const g=Math.min(th.gold,20);th.gold-=g;addGold(g);infamyGain(2);if(G.fac.sombra.rank>=1)facGain('sombra',3);log('El ladrón te entrega '+fmtGold(g)+'.','');yield S.leave(th,{rt:4});return}
  if(ch==='nocut'){npcAdj(th,-10);yield S.say(th,'Lárgate.',1.6);yield S.leave(th,{rt:4});return}
  yield S.emote(vic,'?',1.2);yield S.leave(th,{rt:4})})});
// ---------- Pelea de taberna ----------
setEv('taberna_pelea',c=>scene('pelea',function*(S){
 const bs=S.group('p',4,i=>({name:pick(['Borracho','Pendenciero','Parroquiano','Camorrista']),look:humanLook('aldeano',i%3===0?'f':'m')}),9,12);
 bs.forEach(b=>b.ring=2);S.brawl(bs);log('En una taberna cercana estalla una pelea. Se rompen jarras.','warn');
 yield S.shout(bs,['¡Cerdo!','¡Toma!','¡Mi jarra!','¡Te mato!','¡Dámelo!'],3.5);
 yield S.until(()=>Math.hypot(bs[0].x-G.px,bs[0].y-G.py)<7,6);
 const ch=yield S.ask('En una taberna cercana estalla una pelea de borrachos. Se rompen jarras y alguien grita tu nombre.',[
  {l:'Intervenir a puñetazos',chk:1,run:()=>check('athl',12,{adv:hasFeat('tavern')?1:0}).ok?'fist':'hurt'},
  {l:'Calmar los ánimos con palabras [Persuasión CD 13]',chk:1,run:()=>check('persu',13).ok?'talk':'ignored'},
  {l:'Intimidar [Intimidación CD 12]',chk:1,run:()=>check('intim',12).ok?'scare':'laugh'},{l:'Irte discretamente',v:'go'}],'Pelea de taberna','🍺');
 S.calm(bs);bs.forEach(b=>b.ring=false);
 if(ch==='fist'||ch==='talk'||ch==='scare'){if(ch==='scare')infamyGain(.5);else{gainXp(15);repGain(G.zone,ch==='talk'?2:1)}
  yield S.walk(bs,()=>({x:G.px,y:G.py}),0,{stop:2.4,spd:SC_WALK,timeout:6});
  yield S.say(bs[0],ch==='talk'?'Tienes razón… hemos bebido demasiado.':ch==='scare'?'¡Vale, vale! Nos vamos…':'¡Ay! ¡Basta, basta!',2.4);if(ch!=='scare')log('Acabas con la pelea. El tabernero te invita a una ronda.','good');yield S.leave(bs,{spd:SC_WALK});return}
 if(ch==='hurt'){G.pc.hp=Math.max(1,G.pc.hp-ri(2,6));log('Recibes un buen golpe.','bad');yield S.say(bs[1],'¡Toma esa!',1.4)}
 else if(ch==='laugh'||ch==='ignored'){yield S.say(bs[2],ch==='laugh'?'¡Ja, ja! ¡Mira cómo tiembla!':'Cállate y bebe.',2)}
 S.brawl(bs);yield S.wait(2);S.calm(bs);yield S.leave(bs)}));
// ---------- Niño perdido ----------
setEv('nino_perdido',c=>scene('nino',function*(S){
 const kid=S.at('k',{name:'Niño',look:humanLook('aldeano','m'),scale:.62},8,11);kid.scale=.62;S.roamBg(kid,3);sceneBubble(kid,'¡Mamá!');log('Un niño llora en la calle.','');
 yield S.until(()=>S.dist(kid)<4.5,14);sceneBubble(kid,null);S.still(kid);S.face(kid,G.px,G.py);yield S.say(kid,'¡No encuentro a mi madre!',2.4);
 const ch=yield S.ask('Un niño llora en la calle: «¡No encuentro a mi madre!»',[{l:'Acompañarlo [Perspicacia CD 10]',chk:1,run:()=>check('insight',10).ok?'ok':'bad'},{l:'Entregarlo a la Guardia',v:'guard'},{l:'Ignorarlo',v:'ign'}],'Niño perdido','👶');
 if(ch==='ign'){S.roamBg(kid,3);yield S.wait(1);S.remove(kid);return}
 if(ch==='guard'){repGain(G.zone,.5);const g=S.at('g',{name:'Guardia',look:humanLook('guardia','m')},12,15);yield S.walk(g,()=>({x:kid.x,y:kid.y}),0,{stop:1.2,spd:SC_RUN,timeout:14});yield S.say(g,'Ven conmigo, pequeño.',2);yield S.leave([g,kid],{spd:SC_WALK});return}
 if(ch==='ok'){S.follow(kid,1.5);kid.keep=true;const mo=S.at('m',{name:'Madre',look:humanLook('aldeano','f')},12,15);S.roamBg(mo,3);sceneBubble(mo,'¡Pablo!');
  yield S.walk(kid,()=>({x:mo.x,y:mo.y}),0,{stop:1.6,spd:SC_WALK,timeout:20});kid.keep=false;sceneBubble(mo,null);S.still(mo);S.face(mo,kid.x,kid.y);yield S.emote(mo,'♥',1.4);
  addGold(5);repGain(G.zone,2.5);facGain('concejo',2);gainXp(15);yield S.say(mo,'¡Gracias, gracias! Dios te bendiga.',2.6);log('La madre, agradecida hasta las lágrimas, te da unas monedas.','good');yield S.leave([mo,kid],{spd:SC_WALK});return}
 log('Lo buscas durante una hora sin éxito; al final lo entregas a la Guardia.','');advance(60);const g=S.at('g',{name:'Guardia',look:humanLook('guardia','m')},12,15);yield S.walk(g,()=>({x:kid.x,y:kid.y}),0,{stop:1.2,spd:SC_RUN,timeout:14});yield S.leave([g,kid],{spd:SC_WALK})}));
// ---------- Discusión vecinal ----------
setEv('discusion_npc',c=>{let a0=null,b0=null;for(const n of c.near){for(const id in n.rel){const o=G.npcs[id];if(o&&c.near.includes(o)&&n.rel[id].v<=-15){a0=n;b0=o;break}}if(a0)break}if(!a0)return null;
 return scene('discusion',function*(S){const a=S.adopt(a0),b=S.adopt(b0);if(!a||!b)return;
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;yield S.walk([a,b],(()=>{let i=0;return()=>({x:mx,y:my})})(),0,{stop:1.2,spd:SC_WALK,timeout:12});
  S.face(a,b.x,b.y);S.face(b,a.x,a.y);a.ring=b.ring=2;log(a.name+' y '+b.name+' discuten a gritos. Es sabido que no se soportan.','warn');
  yield S.shout([a,b],['¡Mentiroso!','¡Ladrón!','¡Te lo advertí!','¡Cállate!','¡Nunca más!'],3.4);
  const ch=yield S.ask(a.name+' ('+JOB[a.job].n.toLowerCase()+') y '+b.name+' ('+JOB[b.job].n.toLowerCase()+') discuten a gritos.',[
   {l:'Mediar [Persuasión CD 13]',chk:1,run:()=>check('persu',13).ok?'med':'fail'},{l:'Apoyar a '+a.name,v:'a'},{l:'Apoyar a '+b.name,v:'b'},
   {l:'Escuchar con atención [Perspicacia CD 12]',chk:1,run:()=>check('insight',12).ok?'hear':'noise'},{l:'Alejarte',v:'go'}],'Discusión vecinal','💢');
  a.ring=b.ring=false;
  if(ch==='med'){npcAdj(a,6,true);npcAdj(b,6,true);repGain(G.zone,1);gainXp(12);yield S.say(a,'Tienes razón… perdona.',2);yield S.say(b,'Hmpf. Está bien.',1.8)}
  else if(ch==='fail'){npcAdj(a,-2);npcAdj(b,-2);yield S.say(b,'¡Tú no te metas!',1.8)}
  else if(ch==='a'){npcAdj(a,10,true);npcAdj(b,-12,true);yield S.say(a,'¡Eso, ya lo oíste!',1.8);S.face(b,G.px,G.py);yield S.emote(b,'💢',1)}
  else if(ch==='b'){npcAdj(b,10,true);npcAdj(a,-12,true);yield S.say(b,'¡Eso, ya lo oíste!',1.8);S.face(a,G.px,G.py);yield S.emote(a,'💢',1)}
  else if(ch==='hear'){const r2=(a.sec?a.secT:b.secT);log(r2?'Entre insultos descubres un detalle revelador: sospechas que "'+r2+'".':'Sólo oyes gritos.','')}
  else if(ch==='noise')log('Sólo oyes gritos.','');
  yield S.leave([a,b],{spd:SC_WALK,rt:4})})});
// ---------- Duelo de honor ----------
setEv('duelo_honor',c=>{const a0=npcNear(c,x=>x.job==='noble'||x.job==='guardia')||c.near[0];const b0=c.near.find(x=>x!==a0);if(!a0||!b0)return null;
 return scene('duelo',function*(S){const a=S.adopt(a0),b=S.adopt(b0);if(!a||!b)return;
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;a.stop=b.stop=2.2;yield S.walk([a,b],()=>({x:mx,y:my}),0,{stop:2.2,spd:SC_WALK,timeout:14});
  S.face(a,b.x,b.y);S.face(b,a.x,a.y);a.ring=b.ring=2;
  const crowd=c.near.filter(x=>x!==a0&&x!==b0&&!x.busy).slice(0,3).map(n=>S.adopt(n)).filter(Boolean);
  yield S.walk(crowd,()=>({x:mx+(Math.random()-.5)*4,y:my+3.2}),0,{stop:1.5,spd:SC_WALK,timeout:8});
  yield S.say(a,'¡Esto se resuelve a la manera antigua!',2.6);if(crowd[0])sceneBubble(crowd[0],'¡Apuestas!');
  const ch=yield S.ask(a.name+' y '+b.name+' discuten a voz en cuello. Se llevan la mano al arma. La gente apuesta.',[
   {l:'Apostar 20 fl por '+a.name,v:'bet'},{l:'Mediar [Persuasión CD 14]',chk:1,run:()=>check('persu',14).ok?'med':'fail'},{l:'Mirar desde lejos',v:'look'}],'Duelo de honor','⚔');
  crowd.forEach(k=>sceneBubble(k,null));
  if(ch==='med'){npcAdj(a,6);npcAdj(b,6);repGain(G.zone,2);gainXp(25);a.ring=b.ring=false;yield S.say(a,'Está bien. Envainemos.',2);yield S.emote(crowd[0]||a,'👏',1.2)}
  else if(ch==='fail'){log('Te mandan callar.','');S.brawl([a,b]);yield S.shout([a,b],['¡Toma!','¡Ja!'],2.5);S.calm([a,b])}
  else{let win=null;if(ch==='bet'&&G.pc.gold>=20){addGold(-20);win=Math.random()<.5}
   S.brawl([a,b]);yield S.shout([a,b],['¡Ja!','¡Toma!','¡Rinde la espada!','¡Hmpf!'],4);S.calm([a,b]);
   const loser=(win===false)?a:(win?b:pick([a,b]));const winner=loser===a?b:a;loser.ring=false;winner.ring=false;
   yield S.say(winner,'¡Satisfecho!',1.6);if(win===true){addGold(45);log(a.name+' vence. Cobras '+fmtGold(45)+'.','good')}else if(win===false)log(b.name+' gana el duelo. Pierdes tu apuesta.','bad')}
  a.ring=b.ring=false;crowd.forEach(k=>S.remove(k));yield S.leave([a,b],{spd:SC_WALK,rt:3})})});
// ---------- Juglar en la plaza ----------
setEv('bardo',c=>{const n0=npcNear(c,x=>x.job==='juglar');if(!n0)return null;const l=LORE.filter(x=>!G.lore[x.id]&&x.z.includes(c.z));
 return scene('bardo',function*(S){const n=S.adopt(n0);if(!n)return;
  yield S.walk(n,()=>({x:G.px+3.2,y:G.py+1.2}),0,{stop:1.3,spd:SC_WALK,timeout:18});S.face(n,G.px,G.py);sceneBubble(n,'♪ ♫ ♪');
  const crowd=c.near.filter(x=>x!==n0&&!x.busy).sort((p,q)=>(ensurePrefs(q).likes.includes('musica')?1:0)-(ensurePrefs(p).likes.includes('musica')?1:0)).slice(0,3).map(k=>S.adopt(k)).filter(Boolean);
  yield S.walk(crowd,()=>({x:n.x+(Math.random()-.5)*4,y:n.y+2.4}),0,{stop:1.5,spd:SC_WALK,timeout:8});crowd.forEach(k=>S.face(k,n.x,n.y));
  log(n.name+' toca el laúd en la plaza y canta una vieja balada.','');yield S.wait(1.5);sceneBubble(n,null);
  const ch=yield S.ask(n.name+' toca el laúd en la plaza y canta una vieja balada.',[{l:'Escuchar con atención',v:'ear'},{l:'Dejar una moneda (2 fl)',v:'coin'},{l:'Seguir',v:'go'}],'Juglar en la plaza','🎵');
  if(ch==='ear'){sceneBubble(n,'♪ ♫ ♪');yield S.wait(3);sceneBubble(n,null);crowd.forEach(k=>{ensurePrefs(k);if(k.likes.includes('musica')||k.likes.includes('fiestas')){npcAdj(k,2);discover(k,'likes',k.likes.includes('musica')?'musica':'fiestas')}else if(k.dislikes.includes('musica')){npcAdj(k,-2);discover(k,'dislikes','musica');sceneBubble(k,'¡Menudo ruido!')}});yield S.wait(1.2);crowd.forEach(k=>sceneBubble(k,null));if(l.length&&Math.random()<.55){learnLore(l[0],true);log('La canción relata: '+l[0].t,'good')}else{G.pc.needs.fatigue=Math.max(0,G.pc.needs.fatigue-5);log('Una melodía deliciosa. Te sientes descansado.','good')}yield S.emote(crowd[0]||n,'👏',1.2)}
  else if(ch==='coin'){if(G.pc.gold>=2){addGold(-2);npcAdj(n,6)}yield S.say(n,'¡Que el cielo te lo pague!',1.8)}
  crowd.forEach(k=>S.remove(k));S.remove(n)})});
// ---------- Carro averiado ----------
setEv('carro_roto',c=>scene('carro',function*(S){
 const p=S.point(8,11);const cart=S.prop('cart','cart',p[0],p[1]);const m=S.spawn('m',{name:'Mercader',look:humanLook('mercader','m'),x:p[0]+1.6,y:p[1]+.4});S.roamBg(m,2);
 log('Un mercader con un carro cargado ha roto una rueda en medio del camino.','');sceneBubble(m,'¡Maldita rueda!');
 yield S.until(()=>S.dist(m)<5,14);sceneBubble(m,null);S.still(m);S.face(m,G.px,G.py);yield S.say(m,'¡Eh, tú! ¿Me echas una mano?',2.2);
 const ch=yield S.ask('Un mercader con un carro cargado ha roto una rueda en medio del camino y maldice entre dientes.',[
  {l:'Ayudar a levantar el carro [Atletismo CD 12]',chk:1,run:()=>check('athl',12).ok?'lift':'back'},
  {l:'Arreglar la rueda [Herramientas de carpintero]',chk:1,run:()=>check('invest',11,{bonus:G.pc.tools.includes('carp')?pbOf(G.pc.level):0}).ok?'fix':'nofix'},
  {l:'Aprovechar para robarle algo',cls:'dark',chk:1,run:()=>check('sleight',13).ok?'steal':'caught'},{l:'Pasar de largo',v:'go'}],'Carro averiado','🛒');
 if(ch==='lift'){const g=ri(8,25);addGold(g);repGain(G.zone,1);gainXp(10);yield S.say(m,'¡Gracias! Toma, por las molestias.',2.4);log('El mercader te paga '+fmtGold(g)+'.','good');S.roamBg(m,2);yield S.wait(1.5);yield S.leave(m);cart.gone=true;S.remove(cart);return}
 if(ch==='fix'){addGold(20);gainXp(12);giveItem('cuerda',1,1);yield S.say(m,'¡Eres un artista!',2);yield S.leave(m);S.remove(cart);return}
 if(ch==='nofix'){log('No logras arreglarla.','');return}
 if(ch==='back'){log('Te tuerces la espalda y el carro sigue en el suelo.','bad');return}
 if(ch==='steal'){const id=pick(['vino','tela','aceite','queso_cabra','sal']);giveItem(id,2,1);G.stats.steal++;log('Te llevas '+ITEMS[id].n+' ×2 sin que se entere.','');return}
 if(ch==='caught'){infamyGain(3);crime('robo',10,null,{noStealth:true,radius:6});sceneBubble(m,'¡LADRÓN!');yield S.wait(1.6);S.remove(cart);yield S.leave(m,{spd:SC_RUN})}}));
// ===================== LOTE 3: encuentros del camino, el culto y el clima =====================
function hooded(S,k,name){return S.at(k,{name:name||'Figura encapuchada',look:humanLook('ladron'),tint:[.55,.55,.7]},10,13)}
// ---------- Oferta de la Sombra ----------
setEv('oferta_sombra',c=>scene('sombra',function*(S){
 const f=hooded(S,'f');log('Un paso furtivo detrás de ti. Alguien te sigue desde un portal.','warn');yield S.emote(f,'…',1);
 yield S.walk(f,()=>({x:G.px,y:G.py}),0,{stop:2,spd:SC_WALK,timeout:20});if(S.timedOut){S.remove(f);return}S.face(f,G.px,G.py);yield S.say(f,'Tu fama te precede…',2);
 const ch=yield S.ask('Una figura encapuchada te intercepta en un callejón: «Tu fama te precede. La Sombra del Raval necesita gente con tu… falta de escrúpulos.»',[{l:'Aceptar unirte a La Sombra',v:'yes',cls:'dark'},{l:'Rechazar',v:'no'},{l:'Delatarlo a la Guardia',v:'rat'}],'Oferta turbia','🌑');
 if(ch==='yes'){facGain('sombra',16);yield S.say(f,'Bienvenido. Pregunta por Griselda en la Taberna del Raval.',3.2);yield S.leave(f,{spd:SC_WALK});return}
 if(ch==='rat'){facGain('concejo',4);facGain('sombra',-10);yield S.say(f,'¡Maldito seas!',1.4);yield S.leave(f,{spd:SC_RUN});return}
 yield S.say(f,'Como quieras. Nos veremos.',1.8);yield S.leave(f,{spd:SC_WALK})}));
// ---------- Mercado negro ----------
setEv('mercado_negro',c=>{const loot=pick(['cristal','escama','pocion_gran','amuleto','veneno']);const it=ITEMS[loot];const price=Math.round((it.v||40)*1.7+20);
 return scene('negro',function*(S){const f=hooded(S,'f','Encapuchado');log('Un encapuchado te hace una seña desde un callejón.','warn');S.face(f,G.px,G.py);
  yield S.until(()=>S.dist(f)<5,16);S.face(f,G.px,G.py);yield S.say(f,'Género sin preguntas, forastero…',2.2);
  const ch=yield S.ask('Abre su capa: «Género sin preguntas». Te enseña '+it.n+' por '+fmtGold(price)+'.',[{l:'Comprar ('+fmtGold(price)+')',v:'buy',cls:'dark'},{l:'Denunciarlo a la Guardia',v:'rat'},{l:'Negar con la cabeza',v:'no'}],'Mercado negro','🕶');
  if(ch==='buy'){if(G.pc.gold<price){log('No te llega el dinero.','');yield S.leave(f);return}addGold(-price);giveItem(loot,1,2);infamyGain(1);log('Cierras el trato rápido y en silencio.','');yield S.leave(f,{spd:SC_WALK});return}
  if(ch==='rat'){facGain('concejo',2);repGain(G.zone,1.5);infamyGain(-.5);yield S.emote(f,'!',.7);yield S.leave(f,{spd:SC_RUN});log('Cuando llega la patrulla, el vendedor ya se ha esfumado, pero te agradecen el aviso.','');return}
  yield S.leave(f)})});
// ---------- Peregrina perdida ----------
setEv('peregrino_perdido',c=>scene('peregrina',function*(S){
 const pg=S.at('p',{name:'Peregrina',look:humanLook('viajero','f')},9,12);S.roamBg(pg,4);sceneBubble(pg,'¿Dónde está el monasterio?');log('Una peregrina polvorienta vaga por el sendero.','');
 yield S.until(()=>S.dist(pg)<4.5,16);sceneBubble(pg,null);S.still(pg);S.face(pg,G.px,G.py);yield S.say(pg,'Busco el monasterio y me temo que me he desviado del camino.',3.2);
 const ch=yield S.ask('La peregrina te detiene: «Busco el monasterio y me temo que me he desviado del camino.»',[{l:'Guiarla personalmente [Supervivencia CD 11]',chk:1,run:()=>check('survival',11).ok?'ok':'lost'},{l:'Indicarle el camino',v:'show'},{l:'Encogerte de hombros',v:'no'}],'Peregrina perdida','🧳');
 if(ch==='no'){S.roamBg(pg,4);yield S.wait(1.5);S.remove(pg);return}
 if(ch==='show'){repGain(G.zone,.5);S.face(pg,G.px+2,G.py);yield S.say(pg,'Gracias, que Dios te guarde.',2);yield S.leave(pg,{spd:SC_WALK});return}
 S.follow(pg,2);pg.keep=true;log('Echas a andar y la peregrina te sigue.','');yield S.wait(9);pg.keep=false;
 if(ch==='ok'){gainXp(20);repGain(G.zone,2);giveItem('pan',1,1);yield S.say(pg,'¡Ya veo la puerta! Toma un pan de mi zurrón y mi bendición.',3.4)}
 else{advance(60);log('Os perdéis una hora, pero al final dais con el camino.','')}
 S.still(pg);yield S.leave(pg,{spd:SC_WALK})}));
// ---------- Procesión ----------
setEv('procesion',c=>scene('procesion',function*(S){
 const a=S.point(11,13,{noPath:1});const bx=G.px*2-a[0],by=G.py*2-a[1];const dir=Math.atan2(by-a[1],bx-a[0]);const n=6;const z=getZone(G.zone);
 const mk=i=>({name:i===0?'Sacerdote':i===1?'Monaguillo':'Fiel',look:humanLook(i<2?'sacerdote':(i%2?'monje':'aldeano'),i%3===2?'f':'m')});
 const ps=[];for(let i=0;i<n;i++){const q=nearestFree(z,a[0]-Math.cos(dir)*i*1.3,a[1]-Math.sin(dir)*i*1.3);ps.push(S.spawn('r'+i,Object.assign({x:q[0],y:q[1]},mk(i))))}
 const end=nearestFree(z,bx,by);ps.forEach((p,i)=>{p.keep=false});log('Se oyen cánticos: una procesión recorre la calle.','');sceneBubble(ps[0],'♪ Kyrie… ♪');
 S.walk(ps,end[0],end[1],{stop:1,spd:SC_WALK*.7,timeout:60});
 yield S.until(()=>S.dist(ps[0])<5,18);
 const ch=yield S.ask('Una procesión recorre la calle: cirios, cánticos y una imagen en andas. La gente se hace a un lado.',[{l:'Unirte con respeto',v:'join'},{l:'Dejar un donativo (5 fl)',v:'give'},{l:'Esperar a que pase',v:'wait'}],'Procesión','⛪');
 if(ch==='join'){repGain(G.zone,1);facGain('orden',1);gainXp(5);c.near.forEach(k=>{ensurePrefs(k);if(k.likes.includes('religion')){npcAdj(k,2);discover(k,'likes','religion')}else if(k.dislikes.includes('religion')){npcAdj(k,-1);discover(k,'dislikes','religion')}});log('Caminas un trecho entre rezos. Te sientes parte de algo antiguo.','good');
  ps.forEach(p=>{p.tgt=null});S.follow(ps[0],0);ps.forEach(p=>{p.arrived=false});yield S.walk(ps,end[0],end[1],{stop:1,spd:SC_WALK*.7,timeout:12})}
 else if(ch==='give'&&G.pc.gold>=5){addGold(-5);repGain(G.zone,1.5);facGain('orden',2);yield S.emote(ps[1],'🔔',1.4);log('Un monaguillo te sonríe y toca la campanilla en tu honor.','good')}
 sceneBubble(ps[0],null);yield S.walk(ps,end[0],end[1],{stop:1,spd:SC_WALK*.7,timeout:30});ps.forEach(p=>S.remove(p))}));
// ---------- Plaga de ratas ----------
setEv('ratas',c=>scene('ratas',function*(S){
 const rs=S.group('r',7,i=>({name:'Rata',cr:'rata',coat:.5,scale:.9}),8,11);S.roamBg(rs,3.2);rs.forEach(r=>r.fast=true);
 const vs=S.group('v',2,i=>({name:'Vecino',look:humanLook('granjero',i?'f':'m')}),11,14);S.roamBg(vs,1.5);
 log('Unos vecinos gritan: una plaga de ratas ha invadido un granero.','warn');yield S.shout(vs,['¡Ratas!','¡Se comen el grano!','¡Ayuda!'],3);
 yield S.until(()=>S.dist(rs[0])<8,8);
 const ch=yield S.ask('Una plaga de ratas ha invadido un granero y se comen el grano.',[{l:'Ayudar a espantarlas [Naturaleza CD 11]',chk:1,run:()=>check('nature',11).ok?'ok':'bad'},{l:'Ignorar',v:'ign'}],'Plaga de ratas','🐀');
 if(ch==='ok'){addGold(ri(10,25));repGain(G.zone,2);gainXp(12);G.econ[G.zone].s.grano+=3;S.still(rs);yield S.leave(rs,{spd:SC_RUN});yield S.say(vs[0],'¡Gracias! Toma por las molestias.',2.4);yield S.leave(vs);return}
 if(ch==='bad'){log('Las ratas te ganan la partida.','bad');S.still(rs);yield S.toPlayer(rs.slice(0,3),{timeout:6,rad:1});yield S.wait(1);yield S.leave(rs,{spd:SC_RUN})}
 else{yield S.leave(vs)}}));
// ---------- Vendimia ----------
setEv('cosecha_ayuda',c=>scene('vendimia',function*(S){
 const bs=S.group('c',3,i=>({name:'Vendimiador',look:humanLook('granjero',i===1?'f':'m')}),9,12);S.roamBg(bs,2);const w=bs[1];w.name='Vendimiadora';
 log('En unas parcelas a las afueras andan con la vendimia.','');S.face(w,G.px,G.py);yield S.until(()=>S.dist(w)<7,10);S.still(w);S.face(w,G.px,G.py);yield S.say(w,'¡Si tienes brazos, ven! Se paga en especie.',2.8);
 const ch=yield S.ask('En unas parcelas andan con la vendimia. Una mujer te grita: «¡Si tienes brazos, ven! Se paga en especie.»',[{l:'Cortar racimos [Atletismo CD 10]',chk:1,run:()=>check('athl',10).ok?'ok':'bad'},{l:'Declinar',v:'no'}],'Vendimia','🍇');
 if(ch==='no'){yield S.leave(bs.filter(x=>x!==w),{spd:SC_WALK});S.roamBg(w,2);return}
 S.roamBg(bs,3);S.walk(w,G.px+1.4,G.py,{stop:.4,timeout:6});yield S.wait(2.5);advance(120,{step:30});
 if(ch==='ok'){giveItem('uvas',3,1);gainXp(12);log('Acabas con las manos moradas y una cesta de uvas.','good')}else{giveItem('uvas',1,1);log('Te llevas más pinchazos que racimos, pero algo cae.','')}
 yield S.say(w,'¡Buen trabajo!',1.8);S.roamBg(bs,3);yield S.wait(1)}));
// ---------- Red al sol ----------
setEv('red_pescador',c=>scene('red',function*(S){
 const f0=npcNear(c,x=>x.job==='pescador'||x.job==='marinero');const f=(f0&&S.adopt(f0))||S.at('f',{name:'Pescador',look:humanLook('pescador','m')},8,11);
 const gs=S.group('g',3,i=>({name:'Gaviota',cr:'gaviota',coat:.5,fly:true,alt:1.4+i*.5}),6,9);S.roamBg(gs,6);gs.forEach(g=>g.fast=true);
 log('En el Port Vell, un pescador vacía su red sobre el muelle. Las sardinas saltan sobre las tablas.','');sceneBubble(f,'¡Plata pura!');
 yield S.until(()=>S.dist(f)<5,14);sceneBubble(f,null);S.face(f,G.px,G.py);
 const ch=yield S.ask('Un pescador vacía su red sobre el muelle. Plateadas y coleando, un puñado de sardinas salta sobre las tablas.',[{l:'Ayudarle a clasificar el pescado',v:'help'},{l:'Preguntarle por el mar [Historia CD 9]',chk:1,run:()=>check('hist',9).ok?'lore':'grunt'},{l:'Seguir',v:'go'}],'Red al sol','🐟');
 if(ch==='help'){advance(60,{step:20});giveItem('sardina',2,1);gainXp(8);yield S.say(f,'Toma un par, te las has ganado.',2.2)}
 else if(ch==='lore'){learnLore(LORE.find(l=>l.id==='pescadors'));yield S.say(f,'Las gaviotas cuentan lo que el mar calla…',2.6)}
 else if(ch==='grunt')yield S.say(f,'Pregunta menos, pesca más.',2);
 gs.forEach(g=>S.remove(g))}));
// ---------- Frío mortal ----------
setEv('cena_nieve',c=>scene('nieve',function*(S){
 const v=S.at('v',{name:'Anciano',look:humanLook('pastor','m'),tint:[.8,.85,1],ring:1},9,12);S.walk(v,()=>({x:G.px,y:G.py}),0,{stop:3,spd:SC_WALK*.35,timeout:40});
 log('La nevada es espesa. Distingues una figura encorvada que se arrastra por la nieve.','warn');yield S.until(()=>S.dist(v)<4.2,30);S.still(v);v.tgt=null;
 const ch=yield S.ask('Una figura encorvada se arrastra por la nieve, a punto de caer.',[{l:'Darle tu capa o calor',v:'give'},{l:'Pasar de largo',v:'no',cls:'dark'}],'Frío mortal','❄');
 if(ch==='give'){if(G.pc.eq.cloak){const id=G.pc.eq.cloak.id;unequip('cloak');takeItem(id,1)}facGain('circulo',2);G.fame=clamp(G.fame+1,0,100);repGain(G.zone,3);gainXp(25);giveItem('salvia_h',2,2);v.tint=null;v.ring=false;yield S.say(v,'Dios te lo pague… Toma estas hierbas. Hablaré bien de ti.',3.4);yield S.leave(v,{spd:SC_WALK})}
 else{infamyGain(.5);v.tint=[.6,.6,.7];yield S.wait(1.5);S.remove(v)}}));
// ---------- Comte Arnau ----------
setEv('niebla_arnau',c=>{const rem=check('hist',13,{silent:true,label:'Recordar'});
 return scene('arnau',function*(S){
  const p=S.point(13,15,{noPath:1});const h=S.spawn('h',{name:'Caballo',cr:'ciervo',coat:.1,scale:1.5,tint:[1.7,.8,.5],x:p[0],y:p[1]});const r=S.spawn('r',{name:'Jinete sin rostro',look:humanLook('noble','m'),tint:[.25,.25,.35],x:p[0],y:p[1],lift:.9});
  log('Una niebla blanquecina te envuelve. A lo lejos oyes cascos y un relincho.','warn');
  const move=(tx,ty)=>{[h,r].forEach(a=>{a.fly=true;a.alt=a===r?1.4:.5;a.spd=5})};move();h.tgt=()=>({x:G.px,y:G.py});h.stop=5;r.tgt=()=>({x:h.x,y:h.y});r.stop=.1;r.spd=5.2;h.arrived=r.arrived=false;
  yield S.until(()=>S.dist(h)<6,18);h.tgt=null;h.path=null;r.tgt=null;
  let txt='Ves un caballo que echa llamas por las ventanas de la nariz, y sobre él un jinete sin rostro.';let opts;
  if(rem.ok){learnLore(LORE.find(l=>l.id==='arnau'),true);txt+='\n\nRecuerdas la leyenda del Comte Arnau.';opts=[{l:'Quedarte inmóvil y no mirarlo [Sabiduría CD 14]',chk:1,run:()=>saveCheck('wis',14).ok?'still':'terror'},{l:'Huir',v:'run'}]}
  else opts=[{l:'Quedarte quieto',v:'terror'},{l:'Huir',v:'run'}];
  const ch=yield S.ask(txt,opts,'El Comte Arnau','👻');
  const gone=()=>{const q=S.point(24,28,{noPath:1,ang:Math.atan2(G.py-h.y,G.px-h.x)+3.14});h.tgt=()=>({x:q[0],y:q[1]});r.tgt=()=>({x:h.x,y:h.y});h.stop=1;h.arrived=false;h.spd=r.spd=6};
  if(ch==='still'){gainXp(40);gone();yield S.wait(5);log('El jinete pasa de largo en el rumor de mil lamentos. Has sobrevivido al Comte Arnau.','good')}
  else if(ch==='run'){gone();yield S.wait(3)}
  else{G.pc.hp=Math.max(1,G.pc.hp-ri(3,8));G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+25);gone();yield S.wait(4);log('El pavor te paraliza. Despiertas horas después, helado y exhausto.','bad')}
  S.remove(h);S.remove(r)})});
// ---------- Tormenta eléctrica ----------
setEv('rayo',c=>scene('rayo',function*(S){
 const p=S.point(4,6,{noPath:1});if(G.wx[G.zone])G.wx[G.zone].flash=1;log('Un trueno ensordecedor. Un rayo cae sobre un árbol cercano.','warn');
 const fs=[0,1,2,3].map(i=>S.prop('f'+i,'campfire',p[0]+Math.cos(i*1.6)*1.4,p[1]+Math.sin(i*1.6)*1.4));
 yield S.wait(1.2);
 const ch=yield S.ask('El árbol se parte en dos. Una lluvia de astillas arde a tu alrededor.',[{l:'Tirarte al suelo [salvación DES CD 13]',chk:1,run:()=>saveCheck('dex',13).ok?'dodge':'hit'},{l:'Buscar refugio bajo unas rocas [Supervivencia CD 12]',chk:1,run:()=>check('survival',12).ok?'cave':'lost'}],'Tormenta eléctrica','⚡');
 if(ch==='dodge')log('Las astillas pasan sobre ti. Sales indemne.','good');
 else if(ch==='hit'){const dm=roll('2d6').total;G.pc.hp=Math.max(1,G.pc.hp-dm);log('Una astilla ardiente te alcanza: '+dm+' de daño.','bad')}
 else if(ch==='cave')log('Encuentras una cueva seca. Esperas a que pase.','good');
 else{advance(60);log('Pierdes una hora vagando empapado.','bad')}
 yield S.wait(2);fs.forEach(f=>S.remove(f))}));
// ---------- La Víbria ----------
setEv('vibria_vision',c=>scene('vibria',function*(S){
 const v=S.spawn('v',{name:'Víbria',cr:'vibria',coat:.5,scale:1.8,fly:true,alt:6,x:G.px-18,y:G.py-12});v.spd=3.2;
 if(G.wx[G.zone])G.wx[G.zone].flash=1;log('Entre los relámpagos distingues una silueta alada sobre las agujas de roca.','warn');
 v.tgt=()=>({x:G.px+9,y:G.py-4});v.stop=.5;yield S.wait(4);
 const ch=yield S.ask('Una silueta alada, la cola serpenteando en el cielo. La Víbria.',[{l:'Recordar la leyenda [Naturaleza/Historia CD 13]',chk:1,run:()=>check(skillMod('nature')>=skillMod('hist')?'nature':'hist',13).ok?'lore':'blank'},{l:'Esconderte [Sigilo CD 14]',chk:1,run:()=>check('stealth',14).ok?'hide':'seen'},{l:'Huir',v:'run'}],'La Víbria','🐉');
 if(ch==='lore'){learnLore(LORE.find(l=>l.id==='vibria'),true);log('Recuerdas: no mires sus ojos y escóndete hasta que pase.','good')}
 else if(ch==='hide'){gainXp(40);log('La Víbria sobrevuela sin verte. Un escalofrío.','good')}
 else if(ch==='seen')log('Te mira un instante y se aleja. Te quedas helado.','warn');
 v.tgt=()=>({x:G.px+30,y:G.py-22});v.stop=1;v.arrived=false;v.spd=5;yield S.wait(4);S.remove(v)}));
// ---------- Hallazgos (algo brilla, orquídea, hipérico) ----------
function findSpot(S,t,o){const p=S.point(6,9,{noPath:1});const a=S.prop('h',t,p[0],p[1],o);sceneBubble(a,'✦',null,true);return a}
setEv('moneda_antigua',c=>scene('moneda',function*(S){
 const m=findSpot(S,'flowers',{pv:2});log('Entre las piedras de un talud brilla algo redondo.','');
 const ok=yield S.near(m,2.5);if(!ok){S.remove(m);log('Cuando vuelves a mirar, el destello ya no está.','');return}
 const ch=yield S.ask('Entre las piedras brilla una moneda de plata con un perfil que no reconoces.',[{l:'Examinarla [Investigación CD 12]',chk:1,run:()=>check('invest',12).ok?'ok':'bad'},{l:'Dejarla',v:'no'}],'Algo brilla','🪙');
 if(ch==='ok'){addGold(30);gainXp(20);log('Es romana, de las más antiguas. La vendes al instante por '+fmtGold(30)+'.','good')}else if(ch==='bad'){addGold(3);log('Una chapa vieja. Algo vale.','')}
 if(ch!=='no')S.remove(m)}));
setEv('orquidea',c=>scene('orquidea',function*(S){
 const m=findSpot(S,'flowers',{pv:1});log('Entre las grietas de una roca húmeda asoma una flor de pétalos color miel.','');
 const ok=yield S.near(m,2.5);if(!ok){S.remove(m);return}
 const ch=yield S.ask('Una orquídea de pétalos color miel: la rarísima flor de la Moreneta.',[{l:'Recolectarla con cuidado [Naturaleza CD 15]',chk:1,run:()=>{const r=check('nature',15,{adv:G.pc.cls==='druid'?1:0});return r.ok?(r.margin>=8?'ok3':'ok'):'bad'}},{l:'Dejarla crecer',v:'no'}],'Hallazgo raro','🌸');
 if(ch==='ok'||ch==='ok3'){giveItem('orquidea',1,ch==='ok3'?3:2);gainXp(40);facGain('circulo',3);log('La cortas sin dañar la raíz. Vale una fortuna.','good');S.remove(m)}
 else if(ch==='bad'){log('Se te rompe entre los dedos.','bad');S.remove(m)}else{facGain('circulo',2);facGain('orden',1)}}));
setEv('hierba_tormenta',c=>scene('hiperico',function*(S){
 const m=findSpot(S,'flowers',{pv:0});log('Es la Revetlla de Sant Joan. Ves flores de hipérico entre la espesura.','');
 const ok=yield S.near(m,2.5);if(!ok){S.remove(m);return}
 const ch=yield S.ask('En la espesura crecen flores de hipérico que sólo se cogen antes del alba.',[{l:'Buscarlas [Naturaleza CD 11]',chk:1,run:()=>check('nature',11).ok?'ok':'bad'},{l:'Dejarlo',v:'no'}],'Sant Joan','🔥');
 if(ch==='ok'){giveItem('hiperico',3,3);gainXp(25);log('Recoges tres flores de Sant Joan. Protegen del mal de ojo.','good')}else if(ch==='bad')log('Sólo encuentras zarzas.','');S.remove(m)}));
// ===================== LOTE 4: soplos, confidencias, fiestas, perro y costa =====================
setEv('tip_mercader',c=>{const e=EVENTS.find(x=>x.id==='tip_mercader');const node=e._orig(c);if(!node)return null;
 return scene('soplo',function*(S){const m=S.at('m',{name:'Mercader',look:humanLook('mercader')},9,12);S.walk(m,()=>({x:G.px,y:G.py}),0,{stop:1.6,spd:SC_WALK});yield S.until(()=>S.dist(m)<2.2,16);S.face(m,G.px,G.py);sceneBubble(m,'Psst… ¡forastero!');yield S.wait(1.6);sceneBubble(m,null);yield S.node(node);yield S.leave(m,{spd:SC_WALK})})});
setEv('carta_secreto',c=>{const node=EVENTS.find(x=>x.id==='carta_secreto')._orig(c);if(!node)return null;const n0=c.near.find(x=>node.text.startsWith(x.name));
 return scene('confidencia',function*(S){const n=n0&&S.adopt(n0);if(n){yield S.walk(n,()=>({x:G.px,y:G.py}),0,{stop:1.3,spd:SC_RUN*.7,timeout:16});S.face(n,G.px,G.py);n.ring=1;yield S.emote(n,'🤫',1.2)}yield S.node(node);if(n)n.ring=false;if(n)S.remove(n)})});
setEv('festival_plaza',c=>{const node=EVENTS.find(x=>x.id==='festival_plaza')._orig(c);if(!node)return null;
 return scene('fiesta',function*(S){const ds=S.group('d',6,i=>({name:'Vecino',look:humanLook(i%2?'aldeano':'tejedor',i%2?'f':'m')}),6,9);S.roamBg(ds,3.2);ds.forEach(d=>d.fast=true);
  const j=S.spawn('j',{name:'Juglar',look:humanLook('juglar','m'),x:ds[0].x+1.6,y:ds[0].y});sceneBubble(j,'♪ ♫ ♪');log('La plaza está de fiesta: música, baile y risas.','');
  yield S.until(()=>S.dist(ds[0])<6.5,10);yield S.node(node);sceneBubble(j,null);S.roamBg(ds,3);yield S.wait(1);yield S.leave([...ds,j],{spd:SC_WALK})})});
// ---------- Perro hambriento (y compañero) ----------
setEv('perro_hambriento',c=>scene('perro',function*(S){
 const d=S.at('d',{name:'Perro flaco',cr:'perro',coat:.5,ring:1,scale:.85},9,12);S.follow(d,3.5);d.keep=true;log('Un perro flaco te sigue desde hace un rato.','');
 yield S.until(()=>S.dist(d)<4.2,14);sceneBubble(d,'…');yield S.wait(1.8);sceneBubble(d,null);
 const ch=yield S.ask('Un perro flaco te sigue, olisqueando tu bolsa.',[{l:'Darle comida [Trato con animales CD 10]',chk:1,run:()=>{if(!have('pan')&&!have('carne'))return 'nofood';const r=check('animal',10);if(have('carne'))takeItem('carne',1);else takeItem('pan',1);return r.ok?'ok':'bad'}},{l:'Espantarlo',v:'no'}],'Un perro','🐕');
 d.keep=false;S.still(d);
 if(ch==='ok'){G.pc.flags.dog=1;gainXp(10);R.pet={zone:G.zone,x:d.x,y:d.y,dx:d.dx,dy:d.dy,moving:false,path:null,rp:0};d.gone=true;S.remove(d);log('Mueve la cola y se queda a tu lado: ahora tienes un perro compañero. (+1 al guardia de propiedades)','good');return}
 if(ch==='bad'){log('Se come el pan y huye.','');yield S.leave(d,{spd:SC_RUN});return}
 if(ch==='nofood')log('No tienes comida que darle.','');
 d.ring=false;yield S.leave(d,{spd:SC_RUN})}));
// ---------- Naufragio (Garraf) ----------
setEv('naufragio',c=>scene('naufragio',function*(S){
 const p=S.point(8,11,{noPath:1});const pr=['crate','barrel','crate','boat'].map((t,i)=>S.prop('o'+i,t,p[0]+(i-1.5)*1.6,p[1]+(i%2)*1.2));
 const m=S.spawn('m',{name:'Marinero',look:humanLook('marinero','m'),tint:[.7,.8,.9],ring:1,x:p[0]+.2,y:p[1]+2.2});
 const gs=S.group('g',3,i=>({name:'Gaviota',cr:'gaviota',coat:.5,fly:true,alt:1.5+i*.4}),6,9);
 log('Tras el temporal, el mar ha dejado maderos, cajas y un cuerpo en la arena.','warn');S.roamBg(gs,5);
 yield S.until(()=>S.dist(m)<4,20);yield S.emote(m,'…',1);
 const ch=yield S.ask('Un marinero, aún vivo, aferrado a un barril.',[{l:'Socorrerlo [Medicina CD 11]',chk:1,run:()=>check('medic',11).ok?'ok':'bad'},{l:'Rebuscar entre los restos de la carga',cls:'dark',v:'loot'},{l:'Avisar a la Guardia',v:'go'}],'Naufragio','⚓');
 if(ch==='ok'){gainXp(40);repGain('garraf',3);addGold(25);m.tint=null;m.ring=false;yield S.say(m,'Gracias… toma… esto es tuyo.',2.6);log('Te pone en la mano una bolsa salada: '+fmtGold(25)+'.','good')}
 else if(ch==='bad')log('Tose agua, pero no llega a hablar. Los vecinos lo llevan a la fonda.','');
 else if(ch==='loot'){const l=pick(['vino','tela','aceite','sal','cuerda','cristal']);giveItem(l,2,1);infamyGain(.5);log('Te llevas '+ITEMS[l].n+' ×2 de la carga abandonada.','')}
 gs.forEach(g=>S.remove(g));m.ring=false;yield S.wait(.5)}));
// ---------- Luces en el mar (Garraf) ----------
setEv('luces_cala',c=>scene('luces',function*(S){
 const p=S.point(12,14,{noPath:1});const boat=S.prop('b','boat',p[0],p[1]);const lamp=S.prop('l','campfire',p[0]+1.2,p[1]-.8);
 const ss=[0,1,2].map(i=>S.spawn('s'+i,{name:'Contrabandista',look:humanLook('ladron',i===1?'f':'m'),tint:[.7,.7,.85],x:p[0]+2+i*.9,y:p[1]+1.2+(i%2)*.7}));S.roamBg(ss,1.6);
 log('Desde el acantilado ves luces apagándose y encendiéndose en el mar: una señal.','warn');
 yield S.until(()=>S.dist(boat)<10,10);
 const ch=yield S.ask('Algo se acerca a la cala: figuras furtivas descargan cajas sin sello.',[{l:'Acercarte a espiar [Sigilo CD 13]',chk:1,run:()=>check('stealth',13).ok?'spy':'seen'},{l:'Avisar al cuartelillo',v:'warn'},{l:'No ver nada',v:'no'}],'Luces en el mar','🕯');
 if(ch==='spy'){S.roamBg(ss,2);yield S.wait(4);gainXp(40);giveItem('cristal',1,2);log('Presencias un trasbordo de cajas sin sello. Entre las rocas queda un cristal caído.','good');yield S.leave(ss,{spd:SC_WALK})}
 else if(ch==='seen'){ss.forEach(x=>{x.tint=null;x.ring=2});yield S.emote(ss[0],'!',.8);S.still(ss);const en=[banditCombatant(1),banditCombatant(1)];const two=[ss[0],ss[1]];yield S.toPlayer(two,{timeout:14,rad:1.4});const res=yield S.fight(two,en,{ambush:true});yield S.leave(ss.filter(x=>!x.gone),{spd:SC_RUN})}
 else if(ch==='warn'){facGain('concejo',2);facGain('sombra',-5);log('El sargento asiente sin entusiasmo: «Lo miraremos… mañana».','');yield S.leave(ss,{spd:SC_WALK})}
 else yield S.leave(ss,{spd:SC_WALK});S.remove(boat);S.remove(lamp)}));
// ---------- Banco de sardinas (Garraf) ----------
setEv('pesca_abundante',c=>scene('sardinas',function*(S){
 const fs=S.group('f',4,i=>({name:'Pescador',look:humanLook('pescador',i===2?'f':'m')}),8,11);S.roamBg(fs,2.4);fs.forEach(f=>f.fast=true);
 const gs=S.group('g',5,i=>({name:'Gaviota',cr:'gaviota',coat:.5,fly:true,alt:1.4+i*.3}),7,10);S.roamBg(gs,7);gs.forEach(g=>g.fast=true);
 log('Un banco de sardinas ha entrado en la bahía: el agua hierve de plata.','');yield S.shout(fs,['¡Sardinas!','¡A las redes!','¡Todos los brazos!'],3);
 const ch=yield S.ask('Los pescadores gritan llamando a todos los brazos.',[{l:'Echar una mano con las redes [Atletismo CD 11]',chk:1,run:()=>check('athl',11).ok?'ok':'bad'},{l:'Mirar el espectáculo',v:'no'}],'Banco de sardinas','🐟');
 if(ch!=='no'){S.walk(fs[0],G.px+1.5,G.py,{stop:.5,timeout:6});yield S.wait(2.5);advance(120,{step:30});giveItem('sardina',ch==='ok'?5:2,1);gainXp(15);repGain('garraf',1.5);log(ch==='ok'?'Acabas agotado pero con una buena parte del botín.':'Te llevas más agua que peces, pero algo cae.','good')}
 else yield S.wait(3);gs.forEach(g=>S.remove(g));yield S.leave(fs,{spd:SC_WALK})}));
// ---------- Calor sofocante ----------
setEv('calor',c=>scene('calor',function*(S){
 const p=S.point(7,10,{noPath:1});const rock=S.prop('r','boulder',p[0],p[1]);const ts=[0,1].map(i=>S.spawn('t'+i,{name:'Viajero',look:humanLook('viajero',i?'f':'m'),x:p[0]+(i?1.1:-1.1),y:p[1]+.9,tint:[.95,.9,.8]}));
 log('El calor es sofocante. Unos viajeros se han refugiado a la sombra de una roca.','warn');sceneBubble(ts[0],'¡Qué calor!');
 const ch=yield S.ask('El calor es sofocante. Sientes la cabeza pesada y la garganta seca.',[{l:'Buscar sombra y descansar',v:'rest'},{l:'Seguir adelante [Constitución CD 12]',chk:1,run:()=>saveCheck('con',12).ok?'ok':'bad'}],'Calor sofocante','☀');
 sceneBubble(ts[0],null);
 if(ch==='rest'){S.walk(ts[1],G.px,G.py,{stop:1.5,timeout:5});advance(60);yield S.say(ts[1],'Toma un trago, forastero.',2.2)}
 else if(ch==='bad'){G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+25);log('Te fatigas gravemente por el calor.','bad')}
 ts.forEach(t=>S.remove(t));S.remove(rock)}));
// ---------- Tormenta: refugio ----------
setEv('tormenta_refugio',c=>scene('refugio',function*(S){
 const p=S.point(6,9,{noPath:1});const a=S.prop('a','boulder',p[0],p[1],{pv:1}),b=S.prop('b','stalag',p[0]+1.5,p[1]+.3);if(G.wx[G.zone])G.wx[G.zone].flash=1;
 log('El cielo se desploma. Entre la cortina de agua adviertes la boca de una cueva poco profunda.','warn');
 const ch=yield S.ask('Entre la cortina de agua adviertes la boca de una cueva poco profunda.',[{l:'Refugiarte hasta que pase',v:'shelter'},{l:'Seguir bajo la lluvia [Constitución CD 12]',chk:1,run:()=>saveCheck('con',12).ok?'ok':'bad'}],'Tormenta','⛈');
 if(ch==='shelter'){advance(120,{step:30,sleep:false});G.pc.hp=Math.min(G.pc.maxHp,G.pc.hp+2);log('Esperas con la espalda contra la roca, viendo caer rayos a lo lejos.','')}
 else if(ch==='bad'){G.pc.hp=Math.max(1,G.pc.hp-ri(2,5));log('Llegas empapado y tiritando.','bad')}else{gainXp(8);log('Aprietas los dientes y aguantas el temporal.','good')}
 S.remove(a);S.remove(b)}));
