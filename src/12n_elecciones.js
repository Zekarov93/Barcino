// ===================== ELECCIONES DEL CONSELL DE BARCINO =====================
// Cada año, a mediados de mayo, el Consell elige gobierno. Tres candidatos con programa propio;
// el jugador puede hacer campaña, sobornar, desvelar secretos o abstenerse. El programa ganador
// cambia precios, impuestos, orden y moral de Barcino durante el año siguiente.
const PLAT={continuidad:{n:'Continuidad',d:'Licencias con «gestión» y poco cambio. Los favores se pagan.',ic:'🏛'},
 orden:{n:'Mano firme',d:'Más guardias, más orden, tributos más altos.',ic:'🛡'},
 comercio:{n:'Libre mercado',d:'Aranceles bajos: se compra más barato y se vende mejor.',ic:'⚖'},
 pueblo:{n:'Bienestar',d:'Hospital, pan y fiestas: menos tributos, más moral y salud.',ic:'🕊'}};
const EL_M=4,EL_START=3,EL_VOTE=24; // 3 de mayo: arranca campaña; 24: votación
function elGet(){G.elec=G.elec||{pol:'continuidad',term:0,active:false,year:0,cands:[],pts:{},scand:{},bribes:0,endorsed:null,hist:[]};return G.elec}
function polTax(){const E=elGet();return E.pol==='orden'?1.3:E.pol==='pueblo'?.7:E.pol==='comercio'?.9:1.05}
function elPick(){const A=Object.values(G.npcs).filter(n=>n.alive&&!n.traveler&&n.zone==='barcino');const C=[];
 const inc=A.find(n=>n.job==='concejal'&&n.id==='bernat')||A.find(n=>n.job==='concejal');if(inc)C.push({id:inc.id,plat:'continuidad'});
 const g=A.filter(n=>n.job==='guardia'&&!C.some(c=>c.id===n.id)).sort((a,b)=>(b.lvl||0)-(a.lvl||0))[0];if(g)C.push({id:g.id,plat:'orden'});
 const m=A.filter(n=>['tendero','mercader','prohombre','usurero','curtidor'].includes(n.job)&&!C.some(c=>c.id===n.id)).sort((a,b)=>(b.gold||0)-(a.gold||0))[0];if(m)C.push({id:m.id,plat:'comercio'});
 const p=A.filter(n=>['boticario','sacerdote','panadero','posadero'].includes(n.job)&&!C.some(c=>c.id===n.id)).sort((a,b)=>b.tr.warm-a.tr.warm)[0];if(p)C.push({id:p.id,plat:'pueblo'});
 return C.slice(0,3).length>=2?C.slice(0,Math.min(3,C.length)):C}
function elStart(){const E=elGet();const D=dateOf(G.t);E.cands=elPick();if(E.cands.length<2){E.active=false;return}E.active=true;E.year=D.y;E.pts={};E.scand={};E.bribes=0;E.endorsed=null;E.cands.forEach(c=>{E.pts[c.id]=0;E.scand[c.id]=0});
 const q=G.quests.find(x=>x.id==='q_elec');if(q)q.state='done';
 log('Arranca la campaña electoral del Consell de Barcino. Candidatos: '+E.cands.map(c=>G.npcs[c.id].name+' ('+PLAT[c.plat].n+')').join(', ')+'.','sys');
 G.journal.push({t:G.t,k:'story',m:'Campaña electoral en Barcino: '+E.cands.map(c=>G.npcs[c.id].name+' — '+PLAT[c.plat].n).join('; ')+'. Votación el '+EL_VOTE+' de mayo.'});
 addGossip('barcino','Se abre la campaña para elegir al nuevo Consell. Los candidatos recorren las plazas.',null);
 G.quests.push({id:'q_elec',type:'story',giver:null,title:'Elecciones del Consell',text:elText(),state:'open',reward:{xp:0,gold:0}})}
function elText(){const E=elGet();const names=E.cands.map(c=>{const n=G.npcs[c.id];return (E.endorsed===c.id?'★ ':'· ')+(n?n.name:'?')+' — '+PLAT[c.plat].n}).join('\n');return 'Barcino vota el '+EL_VOTE+' de mayo. Puedes hacer campaña hablando con vecinos, apoyar a un candidato, sobornar votos o desvelar secretos.\n'+names}
function elSync(){const q=G.quests.find(x=>x.id==='q_elec');if(q&&q.state==='open')q.text=elText()}
function elScore(v,c,E){const cn=G.npcs[c.id];if(!cn||!cn.alive)return -999;let s=0;
 const r=v.rel&&v.rel[c.id];if(r)s+=r.v*.12+(REL[r.k]&&REL[r.k].g==='fam'?6:0);
 // el programa seduce según carácter y oficio
 if(c.plat==='orden')s+=(v.tr.temper>=6?2:0)+(v.job==='guardia'?6:0)+(v.tr.brave>=6?1:0)+(zsGet('barcino').o<45?3:0);
 if(c.plat==='comercio')s+=(v.tr.greed>=6?3:0)+(['tendero','mercader','curtidor','herrero','panadero'].includes(v.job)?4:0);
 if(c.plat==='pueblo')s+=(v.tr.warm>=6?3:0)+(zsGet('barcino').h<45?3:0)+(zsGet('barcino').m<45?2:0);
 if(c.plat==='continuidad')s+=(v.tr.honest<=4?2:0)+(v.job==='concejal'?5:0)+(zsGet('barcino').o>60?2:0);
 s+=(E.pts[c.id]||0)*.9-(E.scand[c.id]||0)*1.3+(Math.random()-.5)*3;return s}
function elTally(){const E=elGet();const V=Object.values(G.npcs).filter(n=>n.alive&&!n.traveler&&n.zone==='barcino'&&n.age>=16);const T={};E.cands.forEach(c=>T[c.id]=0);
 for(const v of V){let best=null,bs=-1e9;for(const c of E.cands){const s=elScore(v,c,E);if(s>bs){bs=s;best=c}}if(best)T[best.id]++}
 E.cands.sort((a,b)=>T[b.id]-T[a.id]);const w=E.cands[0];const wn=G.npcs[w.id];const prev=E.pol;E.pol=w.plat;E.term=E.year;E.active=false;
 const lines=E.cands.map(c=>G.npcs[c.id].name+': '+T[c.id]+' votos').join(' · ');
 E.hist.push({y:E.year,w:w.id,plat:w.plat,T});if(E.hist.length>8)E.hist.shift();
 log('Resultados electorales — '+lines+'. Gana '+wn.name+' ('+PLAT[w.plat].n+').','warn');
 G.journal.push({t:G.t,k:'story',m:'Elecciones del Consell: gana '+wn.name+' ('+PLAT[w.plat].n+'). '+lines+'.'});
 addGossip('barcino','El Consell tiene nuevo gobierno: '+wn.name+', con el programa «'+PLAT[w.plat].n+'».',wn);
 wn.mood=Math.min(100,(wn.mood||50)+20);wn.gold=(wn.gold||0)+30;
 for(const c of E.cands.slice(1)){const n=G.npcs[c.id];if(n&&n.alive)n.mood=Math.max(0,(n.mood||50)-12)}
 // consecuencias para el jugador
 if(E.endorsed){const en=G.npcs[E.endorsed];if(E.endorsed===w.id){npcAdj(wn,22,true);facGain('concejo',4);repGain('barcino',3);gainXp(200);const g=40+Math.floor(Math.random()*40);addGold(g);log(wn.name+' recuerda tu apoyo: «Una deuda se paga.» Recibes '+g+' fl y favor del Concejo.','good')}
  else if(en&&en.alive){npcAdj(en,6);npcAdj(wn,-8,true);gainXp(80);log('Tu candidato perdió. '+wn.name+' no olvida a quien apoyó al rival.','warn')}}
 else gainXp(60);
 if(E.bribes>0&&Math.random()<.25+E.bribes*.1){infamyGain(4+E.bribes);facGain('concejo',-3);log('Se rumorea que hubo votos comprados… y señalan en tu dirección.','bad');addGossip('barcino','Se habla de votos comprados en la campaña. El nombre de un forastero corre de boca en boca.',null)}
 // política efectiva inmediata
 const s=zsGet('barcino');if(w.plat==='orden'){s.o=Math.min(100,s.o+6)}if(w.plat==='pueblo'){s.m=Math.min(100,s.m+6);s.h=Math.min(100,s.h+4)}if(w.plat==='comercio'){s.m=Math.min(100,s.m+3)}
 const q=G.quests.find(x=>x.id==='q_elec');if(q){q.state='done';q.text='Ganó '+wn.name+' ('+PLAT[w.plat].n+'). '+lines+'.'}
 if(prev!==w.plat)log('Cambia la política de Barcino: '+PLAT[w.plat].d,'sys')}
bus.on('day',()=>{const E=elGet();const D=dateOf(G.t);try{if(D.m===EL_M&&D.d===EL_START&&!E.active&&E.year!==D.y)elStart();
 else if(E.active&&D.m===EL_M&&D.d>=EL_VOTE)elTally();
 else if(E.active&&(D.m!==EL_M||D.d>EL_VOTE+3))elTally();
 // efectos diarios de la política vigente
 const s=zsGet('barcino');if(E.pol==='orden'){s.o=Math.min(100,s.o+.25);s.m=Math.max(0,s.m-.08)}else if(E.pol==='pueblo'){s.m=Math.min(100,s.m+.25);s.h=Math.min(100,s.h+.2)}else if(E.pol==='comercio'){s.o=Math.max(0,s.o-.06)}else{s.c=Math.min(100,s.c+.05)}
 // el gobierno premia a sus partidarios con jornales: pequeño flujo económico a la ciudad
 if(E.pol==='comercio'&&G.econ&&G.econ.barcino){}
 }catch(e){console.error(e)}});
// ---- precios por política (sólo en Barcino) ----
const _buyP=buyPrice,_sellP=sellPrice;
buyPrice=function(z,id,q,f){let p=_buyP(z,id,q,f);if(z==='barcino'){const k=elGet().pol;if(k==='comercio')p=Math.max(1,Math.round(p*.94));else if(k==='continuidad')p=Math.round(p*1.03)}return p};
sellPrice=function(z,id,q,f){let p=_sellP(z,id,q,f);if(z==='barcino'&&elGet().pol==='comercio')p=Math.round(p*1.06);return p};
// ---- diálogo: campaña ----
function elVoteTalk(n){const E=elGet();const opts=[];
 for(const c of E.cands){const cn=G.npcs[c.id];if(!cn||!cn.alive||cn===n)continue;
  opts.push(O('Hablarle bien de '+cn.name+' ('+PLAT[c.plat].n+') [Persuasión CD '+(11+(n.tr.honest>=6?1:0))+']',()=>{const r=check('persu',11+(n.tr.honest>=6?1:0));if(r.ok){E.pts[c.id]+=1.5;npcAdj(n,2);gainXp(12);elSync();return D(n,'Asiente despacio. «Quizá no esté tan mal. Lo pensaré.»',[O('Volver',()=>elVoteTalk(n))])}E.pts[c.id]-=.3;npcAdj(n,-3);return D(n,'«No me convences. Y no me gusta que me digan a quién votar.»',[O('Volver',()=>elVoteTalk(n))])},{cls:'soc',chk:1}));
  opts.push(O('Comprar su voto para '+cn.name+' (15 fl)',()=>{if(G.pc.gold<15)return D(n,'«Hmm, sin dinero no hay trato.»',[O('Volver',()=>elVoteTalk(n))]);
   const honest=n.tr.honest>=7;addGold(-15);if(honest||n.job==='guardia'){npcAdj(n,-18);infamyGain(3);E.scand[c.id]+=1;E.bribes++;addGossip('barcino',n.name+' denuncia que han intentado comprarle el voto.',n);elSync();return D(n,'«¿Cómo te atreves?» Se pone rojo. «Esto se sabrá.»',[O('Volver',()=>elVoteTalk(n))])}
   E.pts[c.id]+=2.5;E.bribes++;infamyGain(1);elSync();return D(n,'Guarda las monedas sin mirar. «Si alguien pregunta, nunca nos vimos.»',[O('Volver',()=>elVoteTalk(n))])},{cls:'dark'}));
  const K=n.kn||{};const cnk=cn.kn||{};if(cn.sec&&(cn.flags.secretKnown||cnk.sec)){opts.push(O('Desvelar el secreto de '+cn.name+' para hundirlo',()=>{E.scand[c.id]+=6;E.pts[c.id]-=2;infamyGain(2);npcAdj(cn,-30,true);cn.flags.exposedElec=1;addGossip('barcino','Corre el rumor de que '+cn.name+' esconde algo: «'+(cn.secT||'un secreto')+'».',cn);elSync();return D(n,'Abre mucho los ojos. «¿Eso es cierto…? Entonces no pienso votarle.»',[O('Volver',()=>elVoteTalk(n))])},{cls:'dark'}))}}
 opts.push(O('Volver',()=>mainMenu(n)));return D(n,'Barcino vota el '+EL_VOTE+' de mayo. «¿Y tú, a quién apoyarías?»',opts)}
const _svcEl=serviceOpts;
serviceOpts=function(n,opts){_svcEl(n,opts);const E=elGet();if(n.zone!=='barcino')return;
 if(E.active&&!n.traveler&&n.age>=16)opts.push(O('Hablar de las elecciones del Consell',()=>elVoteTalk(n),{cls:'soc'}));
 const c=E.active&&E.cands.find(x=>x.id===n.id);
 if(c){opts.push(O('Preguntarle por su programa «'+PLAT[c.plat].n+'»',()=>D(n,'«'+PLAT[c.plat].d+'» '+(c.plat==='continuidad'?'Sonríe con pocas ganas.':'Te mira directo.'),[O('Volver',()=>mainMenu(n))])));
  if(E.endorsed!==c.id)opts.push(O('Ofrecerle tu apoyo público',()=>{if(attitude(n)<0)return D(n,'«No quiero tu apoyo; ensucia mi campaña.»',[O('Volver',()=>mainMenu(n))]);
   if(E.endorsed){const o=G.npcs[E.endorsed];if(o)npcAdj(o,-10,true)}E.endorsed=c.id;E.pts[c.id]+=4;npcAdj(n,12,true);gainXp(30);repGain('barcino',E.pol===c.plat?0:1);elSync();return D(n,'«Tu apoyo vale mucho. No lo olvidaré.»',[O('Volver',()=>mainMenu(n))])},{cls:'soc'}))}
 if(n.job==='concejal'&&!E.active&&E.cands.length)opts.push(O('Preguntar por el rumbo del Consell',()=>D(n,'«Gobierna el programa «'+PLAT[E.pol].n+'»: '+PLAT[E.pol].d+'»',[O('Volver',()=>mainMenu(n))])))};
// ---- evento: debate en la plaza durante la campaña ----
EVENTS.push({id:'debate_plaza',w:10,ok:c=>{const E=elGet();return E.active&&c.city&&!c.night&&E.cands.length>=2},run:c=>{const E=elGet();const [a,b]=E.cands.map(x=>G.npcs[x.id]);const pa=PLAT[E.cands[0].plat],pb=PLAT[E.cands[1].plat];
 return EVN('Debate en la plaza: '+a.name+' ('+pa.n+') y '+b.name+' ('+pb.n+') se acusan mutuamente. El público espera a ver quién gana la discusión.',[
  O('Dar la razón a '+a.name,()=>{E.pts[a.id]+=1.2;npcAdj(a,6);npcAdj(b,-4);gainXp(15);elSync();return EVN('Un par de vecinos asiente. '+a.name+' sonríe agradecido.',[evEnd()],'Debate','🗣')}),
  O('Dar la razón a '+b.name,()=>{E.pts[b.id]+=1.2;npcAdj(b,6);npcAdj(a,-4);gainXp(15);elSync();return EVN('Se oye un murmullo de aprobación hacia '+b.name+'.',[evEnd()],'Debate','🗣')}),
  O('Pedir un debate limpio [Persuasión CD 13]',()=>{const r=check('persu',13);if(r.ok){const s=zsGet('barcino');s.o=Math.min(100,s.o+3);s.m=Math.min(100,s.m+3);repGain('barcino',3);gainXp(40);return EVN('Consigues que los candidatos se escuchen. Se habla de ideas, no de insultos.',[evEnd()],'Debate limpio','🕊')}return EVN('Te abuchean los dos bandos.',[evEnd()],'Abucheo','🍅')}),
  evEnd('Marcharte')],'Campaña','🗳')}});
