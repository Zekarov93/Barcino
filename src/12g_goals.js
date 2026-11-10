// ===================== SUEÑOS PERSONALES: la meta de cada NPC se convierte en una misión =====================
function pgRetry(q,msg){q.pqBusy=0;if(msg)log(msg,'warn')}
const PG=[
 /*0 casa en Gràcia*/{kind:'give',gold:150,hint:'Le faltan unos 150 florines para la entrada de la casa.',epi:'Gracias a ti ha podido pagar la entrada de su casa en Gràcia.',item:null},
 /*1 torre de castells*/{kind:'scene',zone:n=>'barcino',day:1,hint:'La colla ensaya por la tarde en la plaza. Ve a ayudarle.',epi:'Coronó por fin una torre de castells ante toda la plaza.',gen:function*(S,n,q){
   const a=pqActor(S,n,6,7);const p=[a.x,a.y];const mk=(k,i,l,x)=>S.spawn(k+i,{name:'Casteller',look:humanLook(i%2?'tejedor':'granjero',i%3===1?'f':'m'),x:p[0]+x,y:p[1]+1.5,lift:l});
   const base=[-1,0,1].map((x,i)=>mk('b',i,0,x*.8));const mid=[-.4,.4].map((x,i)=>mk('m',i,0,x));S.face(a,p[0],p[1]+1.5);a.x=p[0]+4;a.y=p[1]+1.5;
   log('La colla ensaya en la plaza: falta quien sujete la base.','');yield S.until(()=>S.dist(base[1])<5,20);
   const ch=yield S.ask(n.name+' quiere trepar a lo más alto, pero la base tiembla.',[{l:'Sujetar la base [Atletismo CD 13]',chk:1,run:()=>check('athl',13).ok?'ok':'bad'},{l:'Animar desde abajo [Persuasión CD 11]',chk:1,run:()=>check('persu',11).ok?'ok':'bad'},{l:'Dejarlo para otro día',v:'no'}],'Castell','🏰');
   if(ch==='no'){S.remove(a);[...base,...mid].forEach(x=>S.remove(x));return pgRetry(q)}
   yield S.walk(a,p[0],p[1]+1.5,{stop:.3,timeout:5});mid.forEach(m=>{m.lift=.55;m.x=p[0]+(m===mid[0]?-.4:.4)});yield S.wait(1);a.lift=1.15;a.x=p[0];yield S.wait(.8);
   if(ch==='ok'){sceneBubble(a,'¡Enxaneta!');yield S.wait(2.2);sceneBubble(a,null);yield S.emote(a,'🎉',1.5);pqEnd(n,q,true,'¡Corona la torre! Aplausos en toda la plaza.',80);facGain('castellers',4);[a,...base,...mid].forEach(x=>{x.lift=0});yield S.wait(1);yield S.leave([a,...base,...mid],{spd:SC_WALK});return}
   [a,...mid].forEach(x=>{x.lift=0;x.tint=[.9,.8,.8]});yield S.shout([a],['¡Aaay!'],1.4);log('La torre se desmorona entre risas. Lo intentaréis otro día.','warn');[a,...base,...mid].forEach(x=>S.remove(x));pgRetry(q)}},
 /*2 hermano desaparecido*/{kind:'scene',zone:n=>pqWild(n),hint:'Un rastro lleva al monte: puede que haya encontrado a su hermano.',epi:'Volvió a abrazar a su hermano desaparecido.',gen:function*(S,n,q){
   const b=S.at('b',{name:'Hermano',look:Object.assign({},npcSprite(n),{sex:'m'}),tint:[.85,.85,.95],ring:1},10,13);const fire=S.prop('f','campfire',b.x+1,b.y+.7);S.roamBg(b,1);log('Un hombre con un aire familiar se calienta junto a una hoguera apagándose.','');
   yield S.until(()=>S.dist(b)<4.5,25);S.still(b);S.face(b,G.px,G.py);yield S.say(b,'¿Me buscas a mí?',2);
   const ch=yield S.ask('El hombre se parece mucho a '+n.name+'. Parece cansado, con la mirada esquiva.',[{l:'Decirle que '+n.name+' lo busca [Persuasión CD 12]',chk:1,run:()=>check('persu',12).ok?'ok':'bad'},{l:'Darle 20 fl para el camino',run:()=>G.pc.gold>=20?(addGold(-20),'ok'):'bad'},{l:'Dejarlo en paz',v:'no'}],'El hermano','🔎');
   b.ring=false;if(ch==='ok'){yield S.say(b,'…Si de verdad me busca, iré a verlo.',2.6);yield S.leave(b,{spd:SC_WALK});S.remove(fire);pqEnd(n,q,true,'El hermano de '+n.name+' volverá a casa.',90);return}
   S.remove(fire);yield S.leave(b);pgRetry(q,'No ha querido escucharte… quizá pueda lograrse de otro modo.')}},
 /*3 aprendiz arcano*/{kind:'item',item:'cristal',n:1,gold:40,hint:'Necesita un cristal arcano y 40 florines para pagar al maestro.',epi:'Su nuevo maestro arcano lo ha aceptado como aprendiz.'},
 /*4 hijos*/{kind:'item',item:'pan',n:4,gold:0,hint:'Sus hijos pasan hambre: necesita 4 panes.',epi:'Sus hijos no pasarán hambre este invierno.'},
 /*5 Drac*/{kind:'scene',zone:n=>'montserrat',night:1,hint:'Quiere ver al Drac: se dice que sobrevuela Montserrat en noches tormentosas.',epi:'Vio, por fin, la sombra alada del Drac.',gen:function*(S,n,q){
   const a=pqActor(S,n,3,4);const v=S.spawn('v',{name:'Sombra alada',cr:'vibria',coat:.5,scale:1.8,fly:true,alt:6,x:G.px-18,y:G.py-12,spd:3.4});v.tgt=()=>({x:G.px+8,y:G.py-4});v.stop=.5;S.face(a,v.x,v.y);yield S.wait(4);
   const ch=yield S.ask('Una silueta alada cruza la luna. '+n.name+' contiene la respiración.',[{l:'Señalársela a '+n.name+' [Percepción CD 12]',chk:1,run:()=>check('percep',12).ok?'ok':'bad'},{l:'Cubrirlo y esconderos',v:'hide'}],'El Drac','🐉');
   v.tgt=()=>({x:G.px+30,y:G.py-22});v.stop=1;v.arrived=false;v.spd=5;yield S.wait(3.5);S.remove(v);
   if(ch==='ok'||ch==='hide'){yield S.say(a,'…Es verdad. Existe.',2.4);pqEnd(n,q,true,'Habéis visto al Drac juntos.',80);yield S.leave(a);return}
   S.remove(a);pgRetry(q,'Se os ha escapado. Habrá que esperar otra noche.')}},
 /*6 Santa Cova*/{kind:'scene',zone:n=>'montserrat',day:1,hint:'Quiere llegar a Montserrat. Acompáñalo por los senderos.',epi:'Cumplió su peregrinaje a la Santa Cova.',gen:function*(S,n,q){
   const a=pqActor(S,n,3,4);S.follow(a,2);a.keep=true;log(n.name+' echa a andar a tu lado, rezando en voz baja.','');yield S.wait(8);
   const ws=S.group('w',2,i=>({name:'Lobo',cr:'lobo',coat:.4+i*.1}),11,13);ws.forEach(w=>w.ring=2);yield S.emote(a,'!',.8);yield S.toPlayer(ws,{timeout:10,rad:1.5});
   const r=yield S.fight(ws,[S.fauna('lobo'),S.fauna('lobo')],{});a.keep=false;
   if(r==='won'){yield S.say(a,'Gracias. Sin ti no habría llegado.',2.6);yield S.wait(1);pqEnd(n,q,true,'Escoltas a '+n.name+' hasta la Santa Cova.',90);yield S.leave(a);return}
   S.remove(a);pgRetry(q,'La escolta ha fracasado. Habrá que intentarlo otro día.')}},
 /*7 venganza*/{kind:'scene',zone:n=>n.zone,hint:'Se ha cruzado con quien lo arruinó. Puede acabar mal.',epi:'Se enfrentó a quien lo arruinó y pudo cerrar esa herida.',gen:function*(S,n,q){
   const a=pqActor(S,n,7,9);const s=S.at('s',{name:'Embaucador',look:humanLook('mercader','m'),tint:[.85,.8,.75]},10,12);yield S.walk(s,()=>({x:a.x+2.2,y:a.y}),0,{stop:.5,spd:SC_WALK,timeout:20});S.face(a,s.x,s.y);S.face(s,a.x,a.y);a.ring=2;yield S.say(a,'¡Tú! ¡Me lo quitaste todo!',2.4);yield S.say(s,'Fueron negocios, nada más.',2);
   const ch=yield S.ask(n.name+' aprieta los puños ante quien lo arruinó.',[{l:'Calmar a '+n.name+' [Persuasión CD 14]',chk:1,run:()=>check('persu',14).ok?'calm':'bad'},{l:'Amenazar al embaucador [Intimidación CD 13]',chk:1,run:()=>check('intim',13).ok?'scare':'bad'},{l:'Ayudar a '+n.name+' a darle su merecido',v:'fight',cls:'dark'}],'Cuentas pendientes','💢');
   a.ring=false;if(ch==='calm'){yield S.say(a,'…No merece que me juegue la vida.',2.4);yield S.leave(s);pqEnd(n,q,true,'Convences a '+n.name+' de soltar el rencor.',80);yield S.leave(a);return}
   if(ch==='scare'){yield S.say(s,'¡Está bien! ¡Os devolveré algo, lo juro!',2.4);yield S.leave(s,{spd:SC_RUN});pqEnd(n,q,true,'El embaucador huye de la ciudad con el rabo entre las piernas.',80);yield S.leave(a);return}
   if(ch==='fight'){const en=banditCombatant(1);en.name='Embaucador';en.spr={t:'hu',look:s.look};yield S.toPlayer([s],{timeout:8,rad:1.4});const r=yield S.fight([s],[en],{});infamyGain(1);pqEnd(n,q,r==='won',r==='won'?'El embaucador queda tendido. '+n.name+' respira por fin.':'',80);yield S.leave(a);return}
   S.remove(s);pgRetry(q)}},
 /*8 negocio propio*/{kind:'give',gold:120,hint:'Le faltan unos 120 florines para abrir su propio negocio.',epi:'Ha abierto su propio negocio con tu ayuda.'},
 /*9 que lo dejen en paz*/{kind:'scene',zone:n=>n.zone,hint:'Unos matones lo importunan a diario. Hay que plantarles cara.',epi:'Ya nadie lo molesta. Por fin, paz.',gen:function*(S,n,q){
   const a=pqActor(S,n,7,9);const ms=S.group('m',2,i=>({name:'Matón',look:humanLook('ladron',i?'f':'m')}),11,13);ms.forEach(m=>m.ring=2);yield S.walk(ms,()=>({x:a.x,y:a.y}),0,{stop:1.8,spd:SC_WALK,timeout:20});yield S.shout(ms,['¡Eh, tú!','¿Dónde está lo mío?','¡Eso no se hace!'],2.4);
   const ch=yield S.ask('Dos matones acosan a '+n.name+'.',[{l:'Intimidarlos [Intimidación CD 12]',chk:1,run:()=>check('intim',12).ok?'ok':'bad'},{l:'Razonar con ellos [Persuasión CD 13]',chk:1,run:()=>check('persu',13).ok?'ok':'bad'},{l:'Plantarles cara a puñetazos',v:'fight'}],'Acoso','🥊');
   ms.forEach(m=>m.ring=false);if(ch==='ok'){yield S.say(ms[0],'Vale, vale… ya nos vamos.',2);yield S.leave(ms);pqEnd(n,q,true,'Los matones se marchan.',60);yield S.leave(a);return}
   if(ch==='fight'||ch==='bad'){const en=[banditCombatant(1),banditCombatant(1)];ms.forEach(m=>m.ring=2);yield S.toPlayer(ms,{timeout:8,rad:1.4});const r=yield S.fight(ms,en,{});pqEnd(n,q,r==='won',r==='won'?'Los matones huyen cojeando.':'',60);yield S.leave(a);return}
   S.remove(a);yield S.leave(ms);pgRetry(q)}}
];
function pgK(n){if(n.goalK!=null&&n.goalK>=0)return n.goalK;return hashStr(n.id)%GOALS.length}
function canGoal(n){if(n.traveler||n.job==='mendigo')return false;if(attitude(n)<20)return false;if(G.quests.some(q=>q.type==='goal'&&q.giver===n.id))return false;return !!PG[pgK(n)]}
function goalTalk(n){const k=pgK(n);const P=PG[k];const goal=GOALS[k];
 const txt=cap(goal.replace(/^quiere/,'Quiere').replace(/^sueña/,'Sueña').replace(/^busca/,'Busca').replace(/^desea/,'Desea').replace(/^espera/,'Espera').replace(/^ahorra/,'Ahorra'))+'. «'+pick(['Nunca se lo he dicho a nadie…','Me da vergüenza contarlo, pero…','Si algún día me ayudaras…'])+'»';
 return D(n,txt+'\n\n'+P.hint,[O('Prometer ayudarle',()=>{const z=P.kind==='scene'?P.zone(n):null;G.quests.push({id:'q_goal_'+n.id,type:'goal',giver:n.id,title:'El sueño de '+n.name,text:cap(goal)+'. '+P.hint+(z&&z!==n.zone?' (Ve a '+ZINFO[z].n+'.)':''),state:'open',pg:k,pq:P.kind==='scene'?'g'+k:null,zone:z,reward:{xp:80,gold:0,aff:30}});ensurePrefs(n);n.bioKnown=Math.max(n.bioKnown||0,2);log('Nueva misión: El sueño de '+n.name+'.','sys');return D(n,'«¿De verdad? Nadie había hecho nunca algo así por mí.»',[O('Volver',()=>mainMenu(n))])}),O('Ahora no',()=>mainMenu(n))])}
// las escenas de sueño reutilizan el sistema de misiones personales
for(let k=0;k<PG.length;k++)if(PG[k].kind==='scene')PQ['g'+k]=PG[k];
// entrega de dinero / objetos y cierre
(function(){const _qt=questTurnins;questTurnins=function(n,opts){_qt(n,opts);for(const q of G.quests){if(q.type!=='goal'||q.giver!==n.id||q.state!=='open')continue;const P=PG[q.pg];if(!P)continue;
 if(P.kind==='give'){if(G.pc.gold>=P.gold)opts.push(O('Ayudarle con '+fmtGold(P.gold)+' para su sueño',()=>{addGold(-P.gold);return goalDone(q,n)},{cls:'svc'}));else opts.push(O('Ayudarle con '+fmtGold(P.gold)+' (no te llega)',()=>D(n,'«No quiero que te arruines por mí.»',[O('Volver',()=>mainMenu(n))]),{cls:'svc dis'}))}
 else if(P.kind==='item'){if(have(P.item,P.n)&&G.pc.gold>=(P.gold||0))opts.push(O('Entregar '+P.n+' × '+iname(P.item)+(P.gold?' y '+fmtGold(P.gold):''),()=>{takeItem(P.item,P.n);if(P.gold)addGold(-P.gold);return goalDone(q,n)},{cls:'svc'}))}
 else if(P.kind==='scene'&&q.pqDone)opts.push(O('Hablar de lo ocurrido',()=>goalDone(q,n),{cls:'svc'}))}}})();
function goalDone(q,n){const P=PG[q.pg];q.state='closed';gainXp(q.reward.xp||60);npcAdj(n,q.reward.aff||30,true);n.flags.goalDone=1;repGain(n.zone,2);if(n.bio&&P)n.bio.push(P.epi);n.bioKnown=(n.bio||[]).length;n.mood=Math.min(100,(n.mood||50)+25);
 const gift=pick(['pan','vino','miel','romero_h']);if(ITEMS[gift])giveItem(gift,2,1);log('Sueño cumplido: '+n.name+'. '+(P?P.epi:''),'lvl');
 return D(n,'«No sé cómo agradecértelo. Ahora todo es distinto.»\n\n'+(P?P.epi:''),[O('Volver',()=>mainMenu(n))])}
