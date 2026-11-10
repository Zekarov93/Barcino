// ===================== MISIONES PERSONALES: cada secreto tiene su propia escena sobre el mapa =====================
function pqWild(n){const adj=Object.keys(TRAVEL[n.zone]||{}).find(z=>!ZINFO[z].settle);return adj||'collserola'}
function pqActor(S,n,d0,d1){const a=S.at('n',{name:n.name,look:npcSprite(n),scale:(SPECIES[n.sp]||{}).scale||1},d0||7,d1||10);return a}
function pqEnd(n,q,ok,msg,xp){if(q.type==='goal'){if(msg)log(msg,ok?'good':'bad');if(ok){q.pqDone=true;toast('Casi está: habla con '+n.name,'lvl')}else pgRetry(q);return}if(msg)log(msg,ok?'good':'bad');if(ok){n.flags.secretResolved=true;if(xp)gainXp(xp);q.pqDone=true;toast('Asunto resuelto: vuelve con '+n.name,'lvl')}else{q.state='closed';npcAdj(n,-15,true);log('El asunto de '+n.name+' ha salido mal. Ya no cuenta contigo.','bad')}}
const PQ={
 deuda_sombra:{zone:n=>n.zone,hint:'Los cobradores de La Sombra rondan. Búscalos de día en su barrio.',gen:function*(S,n,q){
  const a=pqActor(S,n);const th=S.group('t',2,i=>({name:'Cobrador',look:humanLook('ladron',i?'f':'m'),tint:[.8,.8,.9]}),11,14);th.forEach(t=>t.ring=2);
  yield S.walk(th,()=>({x:a.x,y:a.y}),0,{stop:1.5,spd:SC_WALK,timeout:20});S.face(a,th[0].x,th[0].y);yield S.say(th[0],'Se acabó el plazo, '+n.name.split(' ')[0]+'.',2.4);yield S.say(a,'¡Dadme un día más, os lo ruego!',2.2);
  const ch=yield S.ask('Dos cobradores acorralan a '+n.name+'. «La Sombra no perdona deudas.»',[{l:'Pagar parte de la deuda (60 fl)',v:'pay'},{l:'Negociar [Persuasión CD 14]',chk:1,run:()=>check('persu',14).ok?'ok':'bad'},{l:'Intimidarlos [Intimidación CD 15]',chk:1,run:()=>check('intim',15,{ab:'str'}).ok?'ok':'bad'},{l:'Luchar',v:'fight',cls:'dark'}],'La deuda','🌑');
  if(ch==='pay'&&G.pc.gold>=60){addGold(-60);yield S.say(th[0],'Con esto sobra… por ahora.',2);yield S.leave(th);pqEnd(n,q,true,'Pagas la deuda de '+n.name+'.',60);yield S.leave(a);return}
  if(ch==='ok'){yield S.say(th[0],'…Tienes diez días. Ni uno más.',2.2);yield S.leave(th);pqEnd(n,q,true,'Los cobradores se marchan.',60);yield S.leave(a);return}
  if(ch==='fight'||ch==='bad'){const en=[banditCombatant(1),banditCombatant(1)];yield S.toPlayer(th,{timeout:10,rad:1.4});const r=yield S.fight(th,en,{});pqEnd(n,q,r==='won',r==='won'?'Los cobradores yacen en el suelo. La Sombra no lo olvidará.':'',80);if(r==='won')infamyGain(2);yield S.leave(a);return}
  pqEnd(n,q,false);yield S.leave([a,...th])}},
 noble_exiliado:{zone:n=>n.zone,hint:'Un emisario podría llegar preguntando por su verdadera identidad.',gen:function*(S,n,q){
  const a=pqActor(S,n);const em=S.at('e',{name:'Emisario',look:humanLook('noble','m')},11,14);yield S.walk(em,()=>({x:a.x,y:a.y}),0,{stop:1.6,spd:SC_WALK,timeout:20});S.face(a,em.x,em.y);
  yield S.say(em,'Busco a un caballero huido de Girona. ¿Lo conoce?',2.8);
  const ch=yield S.ask('El emisario del vizcondado interroga a '+n.name+'. Palidece.',[{l:'Mentir: «No lo he visto» [Engaño CD 14]',chk:1,run:()=>check('decep',14).ok?'ok':'bad'},{l:'Sobornar al emisario (40 fl)',v:'bribe'},{l:'Delatar a '+n.name,v:'rat',cls:'dark'}],'El emisario','👑');
  if(ch==='bribe'&&G.pc.gold>=40){addGold(-40);yield S.say(em,'No he visto nada. Buen día.',2);yield S.leave(em);pqEnd(n,q,true,'El emisario se marcha con tu bolsa.',60);yield S.leave(a);return}
  if(ch==='ok'){yield S.say(em,'Qué lástima. Seguiré buscando.',2);yield S.leave(em);pqEnd(n,q,true,'El emisario se traga tu mentira.',60);yield S.leave(a);return}
  if(ch==='rat'){facGain('concejo',6);yield S.say(a,'¡Traidor!',1.6)}pqEnd(n,q,false);yield S.leave([em,a])}},
 cadaver:{zone:n=>n.zone,night:1,hint:'Por la noche, un perro husmea cerca del huerto…',gen:function*(S,n,q){
  const a=pqActor(S,n,8,10);const d=S.at('d',{name:'Perro',cr:'perro',coat:.6,x:a.x+3,y:a.y},8,10);d.x=a.x+2.5;d.y=a.y+.5;S.roamBg(d,1.5);d.fast=true;sceneBubble(d,'…guau');
  yield S.until(()=>S.dist(a)<6,15);S.face(a,d.x,d.y);yield S.say(a,'¡Fuera de ahí, chucho!… ¡Fuera!',2.2);
  const ch=yield S.ask('Un perro escarba junto al huerto de '+n.name+'. Asoma algo pálido bajo la tierra.',[{l:'Ahuyentar al perro [Trato con animales CD 12]',chk:1,run:()=>check('animal',12).ok?'ok':'bad'},{l:'Ayudarle a enterrar mejor… lo que sea',v:'bury',cls:'dark'},{l:'Avisar a la Guardia',v:'rat',cls:'dark'}],'Bajo el huerto','🪦');
  if(ch==='ok'||ch==='bury'){if(ch==='bury')infamyGain(2);yield S.leave(d,{spd:SC_RUN});pqEnd(n,q,true,'Tierra removida, perro ahuyentado. Nadie sabrá nada… por ahora.',50);yield S.leave(a);return}
  if(ch==='rat'){facGain('concejo',8);repGain(G.zone,3)}pqEnd(n,q,false);yield S.leave([a,d])}},
 culto:{zone:n=>'montserrat',night:1,hint:'Por la noche, en la montaña, se reúnen a escondidas.',gen:function*(S,n,q){
  const cs=S.group('c',4,i=>({name:'Encapuchado',look:humanLook('monje',i%2?'f':'m'),tint:[.6,.5,.7]}),9,12);const fire=S.prop('f','campfire',cs[0].x-1,cs[0].y-1.5);const a=pqActor(S,n,9,12);a.x=cs[0].x+1.2;a.y=cs[0].y+.2;S.roamBg(cs,1.2);sceneBubble(cs[1],'♪ …Ave Naturae… ♪');
  log('Cánticos entre los pinos. Alguien oficia a la luz de una hoguera.','warn');yield S.until(()=>S.dist(a)<6,20);
  const ch=yield S.ask('Un círculo de encapuchados canta alrededor del fuego. '+n.name+' está entre ellos.',[{l:'Convencer a '+n.name+' de que lo deje [Persuasión CD 14]',chk:1,run:()=>check('persu',14).ok?'ok':'bad'},{l:'Hacerte pasar por uno de ellos [Religión CD 13]',chk:1,run:()=>check('relig',13).ok?'ok':'bad'},{l:'Irrumpir con la espada',v:'fight',cls:'dark'}],'El culto de la montaña','🔥');
  sceneBubble(cs[1],null);
  if(ch==='ok'){yield S.say(a,'Tienes razón… esto no nos lleva a nada bueno.',2.4);yield S.leave(cs);pqEnd(n,q,true,'Disuades a '+n.name+' del culto.',70);S.remove(fire);yield S.leave(a);return}
  if(ch==='fight'){const en=[banditCombatant(1),banditCombatant(2)];yield S.toPlayer(cs.slice(0,2),{timeout:10,rad:1.4});const r=yield S.fight(cs.slice(0,2),en,{});pqEnd(n,q,r==='won',r==='won'?'Dispersas el culto, pero '+n.name+' no te lo perdonará del todo.':'',60);S.remove(fire);yield S.leave([a,...cs.filter(x=>!x.gone)]);return}
  pqEnd(n,q,false);S.remove(fire);yield S.leave([a,...cs])}},
 informante:{zone:n=>n.zone,hint:'Los vecinos sospechan de él. La tensión puede estallar en la plaza.',gen:function*(S,n,q){
  const a=pqActor(S,n);const vs=S.group('v',3,i=>({name:'Vecino',look:humanLook(i===1?'granjero':'aldeano',i%2?'f':'m')}),10,13);vs.forEach(v=>v.ring=2);
  yield S.walk(vs,()=>({x:a.x,y:a.y}),0,{stop:2.2,spd:SC_WALK,timeout:20});yield S.shout(vs,['¡Chivato!','¡Todos lo sabíamos!','¡Fuera de aquí!'],3);
  const ch=yield S.ask('Los vecinos acusan a '+n.name+' de informar a la Guardia.',[{l:'Calmar a la multitud [Persuasión CD 14]',chk:1,run:()=>check('persu',14).ok?'ok':'bad'},{l:'Desviar las sospechas hacia otro [Engaño CD 13]',chk:1,run:()=>check('decep',13).ok?'ok':'bad'},{l:'Dejarlo a su suerte',v:'no'}],'La plaza se revuelve','💢');
  vs.forEach(v=>v.ring=false);if(ch==='ok'){yield S.say(vs[0],'…Quizá nos hemos precipitado.',2.2);yield S.leave(vs);pqEnd(n,q,true,'La multitud se disuelve.',60);yield S.leave(a);return}
  pqEnd(n,q,false);yield S.leave([a,...vs])}},
 roba_gremio:{zone:n=>n.zone,hint:'El gremio enviará un auditor. Hay que estar presente.',gen:function*(S,n,q){
  const a=pqActor(S,n);const au=S.at('u',{name:'Auditor',look:humanLook('mercader','m')},11,14);yield S.walk(au,()=>({x:a.x,y:a.y}),0,{stop:1.6,spd:SC_WALK,timeout:20});yield S.say(au,'Vengo a revisar los libros del gremio.',2.4);
  const ch=yield S.ask('El auditor exige ver las cuentas de '+n.name+'.',[{l:'Distraer al auditor [Engaño CD 13]',chk:1,run:()=>check('decep',13).ok?'ok':'bad'},{l:'Alterar el libro mientras habla [Juego de manos CD 14]',chk:1,run:()=>check('sleight',14).ok?'ok':'bad',cls:'dark'},{l:'Dejar que descubra la verdad',v:'no'}],'Auditoría','📒');
  if(ch==='ok'){yield S.say(au,'Todo en orden, al parecer…',2);yield S.leave(au);pqEnd(n,q,true,'El auditor se va satisfecho.',60);yield S.leave(a);return}
  pqEnd(n,q,false);yield S.leave([a,au])}},
 amor:{zone:n=>n.zone,day:1,hint:'Hay que juntar a los dos enamorados en un lugar tranquilo.',gen:function*(S,n,q){
  const a=pqActor(S,n,7,9);const o=G.npcs[n.secName];const b=S.at('b',{name:o?o.name:'Amado',look:o?npcSprite(o):humanLook('aldeano')},10,13);
  yield S.walk(b,()=>({x:a.x+2.2,y:a.y}),0,{stop:.6,spd:SC_WALK,timeout:20});S.face(a,b.x,b.y);S.face(b,a.x,a.y);sceneBubble(a,'♥');
  const ch=yield S.ask(n.name+' mira de lejos a '+(o?o.name:'su amor')+', sin atreverse.',[{l:'Dar un empujoncito con palabras [Persuasión CD 12]',chk:1,run:()=>check('persu',12).ok?'ok':'bad'},{l:'Regalar unas rosas en su nombre',run:()=>have('rosas')?(takeItem('rosas',1),'ok'):'norose'},{l:'No meterte',v:'no'}],'Dos corazones','♥');
  sceneBubble(a,null);if(ch==='ok'){S.walk(a,b.x-1,b.y,{stop:.5,timeout:5});yield S.wait(2.5);yield S.emote(b,'♥',1.6);yield S.say(a,'…Gracias. No habría tenido valor.',2.4);yield S.leave([a,b],{spd:SC_WALK*.6});pqEnd(n,q,true,'Dos corazones, por fin, se encuentran.',70);return}
  if(ch==='norose')log('No tienes rosas.','');pqEnd(n,q,false);yield S.leave([a,b])}},
 arnau:{zone:n=>'collserola',night:1,hint:'Quiere volver a ver al jinete. Acompáñalo de noche al bosque.',gen:function*(S,n,q){
  const a=pqActor(S,n,3,4);const p=S.point(14,16,{noPath:1});const h=S.spawn('h',{name:'Caballo',cr:'ciervo',coat:.1,scale:1.5,tint:[1.7,.8,.5],x:p[0],y:p[1],fly:true,alt:.5,spd:4});const r=S.spawn('r',{name:'Jinete',look:humanLook('noble','m'),tint:[.25,.25,.35],x:p[0],y:p[1],fly:true,alt:1.4,spd:4.2});
  h.tgt=()=>({x:a.x,y:a.y});h.stop=4;r.tgt=()=>({x:h.x,y:h.y});r.stop=.1;yield S.until(()=>S.dist(h)<7,18);h.tgt=null;r.tgt=null;yield S.say(a,'¡Es él! ¡Es él!',1.8);
  const ch=yield S.ask('El jinete sin rostro se detiene ante vosotros. '+n.name+' tiembla.',[{l:'Mantener la calma [Sabiduría CD 12]',chk:1,run:()=>saveCheck('wis',12).ok?'ok':'bad'},{l:'Sacar a '+n.name+' de allí a rastras',v:'drag'}],'El Comte Arnau','👻');
  const go=()=>{const q2=S.point(24,28,{noPath:1,ang:Math.atan2(G.py-h.y,G.px-h.x)+3.14});h.tgt=()=>({x:q2[0],y:q2[1]});r.tgt=()=>({x:h.x,y:h.y});h.stop=1;h.arrived=false;h.spd=r.spd=6};
  go();yield S.wait(4);S.remove(h);S.remove(r);if(ch==='ok'||ch==='drag'){if(ch==='bad')G.pc.hp=Math.max(1,G.pc.hp-3);yield S.say(a,'Gracias… ya sé que no lo imaginé.',2.4);pqEnd(n,q,true,'Habéis visto juntos al Comte Arnau.',60);yield S.leave(a);return}
  G.pc.hp=Math.max(1,G.pc.hp-ri(3,6));pqEnd(n,q,false);yield S.leave(a)}},
 tesoro:{zone:n=>'collserola',hint:'El botín está en el campamento de trasgos de Collserola.',gen:function*(S,n,q){
  const gs=S.group('g',3,i=>({name:'Trasgo',cr:'trasgo',coat:.4+i*.1}),11,14);const ch0=S.prop('c','crate',gs[0].x+1.5,gs[0].y+1.5);S.roamBg(gs,2);log('Entre las tiendas del campamento ves un cofre custodiado por trasgos.','warn');
  yield S.until(()=>S.dist(gs[0])<9,20);
  const ch=yield S.ask('Tres trasgos custodian el botín que '+n.name+' describió.',[{l:'Colarte sigilosamente [Sigilo CD 14]',chk:1,run:()=>check('stealth',14).ok?'sneak':'seen'},{l:'Atacar de frente',v:'fight',cls:'dark'},{l:'Retirarte',v:'no'}],'El botín de los trasgos','💰');
  if(ch==='sneak'){S.still(gs);yield S.wait(3);const g=ri(60,120);addGold(g);giveItem('cristal',1,2);S.remove(ch0);yield S.leave(gs);pqEnd(n,q,true,'Te llevas el botín: '+fmtGold(g)+' y un cristal. (Reserva una parte para '+n.name+'.)',80);return}
  if(ch==='fight'||ch==='seen'){S.still(gs);gs.forEach(g=>g.ring=2);const en=gs.map(()=>S.fauna('trasgo'));yield S.toPlayer(gs,{timeout:10,rad:1.3});const r=yield S.fight(gs,en,{ambush:ch==='seen'});if(r==='won'){const g=ri(60,120);addGold(g);giveItem('cristal',1,2);S.remove(ch0);pqEnd(n,q,true,'Los trasgos caen. Hallas el botín: '+fmtGold(g)+' y un cristal.',100)}return}
  S.remove(ch0);yield S.leave(gs)}},
 espia:{zone:n=>pqWild(n),hint:'Se verá con su contacto en el camino, fuera de la población.',gen:function*(S,n,q){
  const a=pqActor(S,n,9,11);const c=S.at('c',{name:'Correo del vizcondado',look:humanLook('noble','m'),tint:[.8,.8,1]},11,13);yield S.walk(c,()=>({x:a.x+1.5,y:a.y}),0,{stop:.5,spd:SC_WALK,timeout:20});sceneBubble(a,'…');sceneBubble(c,'…');yield S.wait(2.5);sceneBubble(a,null);sceneBubble(c,null);
  const ch=yield S.ask(n.name+' entrega un pliego sellado a un desconocido.',[{l:'Interceptar al correo',v:'fight',cls:'dark'},{l:'Dejarlos y callar',v:'no'},{l:'Denunciarlo al Concejo',v:'rat'}],'Un pliego en el camino','✉');
  if(ch==='fight'){const en=banditCombatant(2);en.name='Correo';en.spr={t:'hu',look:c.look};yield S.toPlayer([c],{timeout:10,rad:1.4});const r=yield S.fight([c],[en],{});if(r==='won'){giveItem('pocion',1,1);pqEnd(n,q,true,'Destruyes el pliego: nadie sabrá lo que '+n.name+' contaba.',60);}else pqEnd(n,q,false);yield S.leave(a);return}
  if(ch==='no'){yield S.leave(c);pqEnd(n,q,true,'Callas. '+n.name+' te debe el silencio.',40);yield S.leave(a);return}
  facGain('concejo',8);pqEnd(n,q,false);yield S.leave([a,c])}},
 hijo_bandido:{zone:n=>pqWild(n),hint:'El hijo acampa en los caminos. Búscalo en el monte.',gen:function*(S,n,q){
  const son=S.at('s',{name:'Hijo de '+n.name.split(' ')[0],look:humanLook('ladron','m'),ring:1},10,13);const fire=S.prop('f','campfire',son.x+1.2,son.y+.8);const bs=[banditCombatant(1)];S.roamBg(son,1.2);
  log('Entre los matorrales, un joven con cara conocida remueve las brasas.','warn');yield S.until(()=>S.dist(son)<5,20);S.still(son);S.face(son,G.px,G.py);yield S.say(son,'¿Quién te envía? ¿Mi padre?',2.4);
  const ch=yield S.ask('El joven desenvaina a medias. Se parece demasiado a '+n.name+'.',[{l:'Razonar con él [Persuasión CD 15]',chk:1,run:()=>check('persu',15).ok?'ok':'bad'},{l:'Ofrecerle 50 fl para empezar de nuevo',v:'pay'},{l:'Luchar',v:'fight',cls:'dark'}],'El hijo bandido','🗡');
  if(ch==='pay'&&G.pc.gold>=50)addGold(-50);
  if(ch==='ok'||ch==='pay'){son.ring=false;yield S.say(son,'…Dile que volveré. Cuando pueda.',2.6);yield S.leave(son);S.remove(fire);pqEnd(n,q,true,'El joven abandona los caminos.',70);return}
  son.ring=2;const en=banditCombatant(2);en.spr={t:'hu',look:son.look};yield S.toPlayer([son],{timeout:8,rad:1.3});const r=yield S.fight([son],[en],{});pqEnd(n,q,false,r==='won'?'Has matado al hijo de '+n.name+'. No te lo perdonará jamás.':'');S.remove(fire)}},
 veneno:{zone:n=>n.zone,day:1,hint:'Alguien podría caer envenenado en la calle.',gen:function*(S,n,q){
  const a=pqActor(S,n,9,11);const v=S.at('v',{name:'Vecino envenenado',look:humanLook('aldeano','m'),tint:[.7,.9,.7],ring:2},7,9);S.roamBg(v,1);sceneBubble(v,'…¿qué me pasa?');
  yield S.until(()=>S.dist(v)<5,15);S.still(v);v.tint=[.6,.8,.6];yield S.emote(v,'💀',1.4);S.face(a,v.x,v.y);yield S.say(a,'No… ¡era para otro!',2);
  const ch=yield S.ask('Un vecino se desploma con espuma en los labios. '+n.name+' se lleva las manos a la cabeza.',[{l:'Atenderlo [Medicina CD 13]',chk:1,run:()=>check('medic',13).ok?'ok':'bad'},{l:'Darle un antídoto (poción)',run:()=>have('pocion')?(takeItem('pocion',1),'ok'):'none'},{l:'Alejarte',v:'no'}],'Veneno en la calle','☠');
  if(ch==='ok'){v.tint=null;v.ring=false;yield S.say(v,'Gracias… creí que moría.',2.2);yield S.leave(v);pqEnd(n,q,true,'El vecino se salva. '+n.name+' llora de alivio.',60);yield S.leave(a);return}
  if(ch==='none')log('No tienes ninguna poción.','');pqEnd(n,q,false);yield S.leave([a,v])}},
 huevo:{zone:n=>n.zone,night:1,hint:'El huevo late más fuerte cada noche. Ve a verlo.',gen:function*(S,n,q){
  const a=pqActor(S,n,6,8);const e=S.prop('e','egg',a.x+1.2,a.y);sceneBubble(e,'✦');yield S.until(()=>S.dist(e)<3,20);sceneBubble(e,null);yield S.say(a,'¡Se ha movido! ¡Ha crujido!',2);
  const l=S.spawn('l',{name:'Cría',cr:'vibora',coat:.3,scale:1.2,x:e.x,y:e.y});S.remove(e);yield S.emote(l,'!',1);
  const ch=yield S.ask('Del huevo asoma una criatura escamosa. '+n.name+' retrocede.',[{l:'Amansarla [Trato con animales CD 13]',chk:1,run:()=>check('animal',13).ok?'ok':'bad'},{l:'Destruirla',v:'kill',cls:'dark'},{l:'Dejarla marchar',v:'go'}],'El huevo de piedra','🥚');
  if(ch==='ok'||ch==='go'){yield S.leave(l,{spd:SC_WALK});pqEnd(n,q,true,ch==='ok'?'La criatura se calma y se marcha al monte.':'La criatura se pierde en la noche.',60);yield S.leave(a);return}
  const en=S.fauna('vibora');yield S.toPlayer([l],{timeout:6,rad:1});const r=yield S.fight([l],[en],{});pqEnd(n,q,r==='won',r==='won'?'La criatura yace muerta. '+n.name+' no sabe si llorar.':'',40);yield S.leave(a)}},
 hermano_muerto:{zone:n=>n.zone,hint:'Acude al amanecer: suele visitar la tumba.',gen:function*(S,n,q){
  const a=pqActor(S,n,7,9);const g=S.prop('g','grave',a.x+1,a.y+.8);yield S.walk(a,g.x,g.y-.8,{stop:.6,spd:SC_WALK*.7,timeout:14});yield S.until(()=>S.dist(a)<4,15);sceneBubble(a,'…perdóname…');yield S.wait(2.4);sceneBubble(a,null);
  const ch=yield S.ask(n.name+' llora ante una tumba sencilla.',[{l:'Consolarlo [Persuasión CD 12]',chk:1,run:()=>check('persu',12).ok?'ok':'bad'},{l:'Aconsejarle confesarse al sacerdote',v:'conf'},{l:'Dejarlo a solas',v:'no'}],'Ante la tumba','🪦');
  if(ch==='ok'||ch==='conf'){yield S.say(a,'Quizá ha llegado la hora de hablar…',2.6);pqEnd(n,q,true,'Ayudas a '+n.name+' a cargar con su culpa.',60);S.remove(g);yield S.leave(a);return}
  pqEnd(n,q,false);S.remove(g);yield S.leave(a)}},
 reliquia:{zone:n=>'montserrat',day:1,hint:'La reliquia debe volver al monasterio de Montserrat.',gen:function*(S,n,q){
  const m=S.at('m',{name:'Fray',look:humanLook('monje','m')},8,11);S.roamBg(m,2);yield S.until(()=>S.dist(m)<4,20);S.still(m);S.face(m,G.px,G.py);yield S.say(m,'¿Buscáis algo, hijo mío?',2);
  const ch=yield S.ask('Un fraile os mira. La reliquia que '+n.name+' esconde pesa en tu bolsa.',[{l:'Devolverla en secreto (dejarla en el altar)',v:'ret'},{l:'Confesar el robo al fraile',v:'conf'},{l:'Quedártela',v:'keep',cls:'dark'}],'La reliquia','✝');
  if(ch==='keep'){infamyGain(2);pqEnd(n,q,false);yield S.leave(m);return}
  facGain('orden',ch==='conf'?6:3);gainXp(25);yield S.say(m,'Que Dios os bendiga a vos y a quien la tomó.',3);yield S.leave(m);pqEnd(n,q,true,'La reliquia vuelve al monasterio.',50)}}
};
function pqStart(n){const P=PQ[n.sec];if(!P)return null;const z=P.zone(n);return{pq:n.sec,zone:z,hint:P.hint}}
function pqRun(q,n){const P=PQ[q.pq];q.pqBusy=1;const here=n.zone===G.zone,ph0=n.hidden;
 const sc=scene('pq_'+q.pq,function*(S){if(here){n.busy=true;n.hidden=true}try{yield* P.gen(S,n,q)}finally{q.pqBusy=0;if(here){n.busy=false;n.hidden=ph0;n.think=0;n.tgtKey=null}}});if(!sc)q.pqBusy=0;return sc}
function pqTick(){if(!G||!G.pc||SCN.cur||G.combat||R.modal)return;
 for(const q of G.quests){if((q.type!=='secret'&&q.type!=='goal')||q.state!=='open'||!q.pq||q.pqDone||q.pqBusy)continue;const n=G.npcs[q.giver];if(!n||!n.alive)continue;const P=PQ[q.pq];if(!P||G.zone!==q.zone)continue;
  const ph=phaseOf(G.t);if(P.night&&!ph.night)continue;if(P.day&&ph.night)continue;if(Math.random()>.5)continue;if(pqRun(q,n))return}}
