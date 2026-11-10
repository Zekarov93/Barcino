// ===================== ASEDIO PIRATA DE ILURO (combate en oleadas con consecuencias) =====================
const _endCombatSg=endCombat;endCombat=function(res){const was=CB&&!CB.over;const o=was&&CB.opts;_endCombatSg(res);if(o&&o.after){try{const nd=o.after(res);if(nd&&nd.opts)R.pendEv=nd}catch(e){console.error('after',e)}}};
bus.on('endcombat',()=>{if(R.pendEv){const n=R.pendEv;R.pendEv=null;setTimeout(()=>{try{showEvent(n)}catch(e){console.error(e)}},300)}});
function corsair(lv,boss){const b=banditCombatant(lv);b.kind='bandit';b.name=boss?pick(['Capitán Rais Ben-Yusuf','Capitán Hamid el Tuerto','Capitán Jalid de Dénia']):pick(['Corsario moro','Pirata de Dénia','Marinero corsario','Remero cautivo armado']);
 if(boss){b.hp=b.maxHp=b.hp*2+8;b.ac+=2;b.atk+=2;b.dmg='1d8+'+(2+Math.floor(lv/2));b.xp*=3;b.gold=[30*lv,70*lv]}else{b.gold=[6*lv,20*lv]}return b}
function sackMaresme(){const E=G.econ.maresme;if(E)for(const i in E.s)E.s[i]=Math.floor(E.s[i]*.35);repGain('maresme',-10);G.flags.maresme_sack=G.t;addGossip('maresme','Los corsarios saquearon Iluro: se llevaron grano, redes y a tres vecinos. La villa llora.',null);
 const ns=Object.values(G.npcs).filter(n=>n.alive&&n.zone==='maresme'&&!n.traveler&&['pescador','marinero','tejedor'].includes(n.job));for(let i=0;i<Math.min(3,ns.length);i++){const n=ns.splice(ri(0,ns.length-1),1)[0];n.hidden=true;n.captive=G.t;n.hp=n.maxHp||n.hp}}
function freeCaptives(){let c=0;for(const id in G.npcs){const n=G.npcs[id];if(n.captive){delete n.captive;n.hidden=false;c++}}return c}
function raidWave(w,prep){const lv=clamp(Math.round(G.pc.level/2)+1,1,4);const n=w===1?(prep?2:3):1+(prep?0:1);const en=[];for(let i=0;i<n;i++)en.push(corsair(lv,false));if(w===2)en.push(corsair(lv,true));return en}
function raidResult(prep,res,w){
 if(res==='won'){if(w===1)return EVN('La primera línea de corsarios cae entre la arena y las barcas. Sobre la playa asoma un hombre de barba rizada que desenvaina una cimitarra: el capitán. «¡Ahora vais a conocer a Alá y a su espada!»',[
   O('Enfrentarte al capitán',()=>{startCombat(raidWave(2,prep),{after:r=>raidResult(prep,r,2)});return null},{cls:'dark'}),
   O('Retroceder a la plaza y reagrupar [Persuasión CD 11]',()=>{const r=check('persu',11);advance(30,{step:15});if(r.ok){G.pc.hp=Math.min(G.pc.maxHp,G.pc.hp+Math.ceil(G.pc.maxHp/3));startCombat(raidWave(2,true),{after:r2=>raidResult(true,r2,2)});return null}startCombat(raidWave(2,prep),{after:r2=>raidResult(prep,r2,2)});return null})],'El capitán','⚔');
  const c=freeCaptives();repGain('maresme',18);G.fame=clamp(G.fame+6,0,100);addGold(ri(40,90));giveItem('tinte_purpura',1,3);gainXp(150);LL('piratas',true);G.flags.maresme_heroe=G.t;G.cd.asedio=G.t+1440*60;
  addGossip('maresme','Un forastero rechazó el asalto de los corsarios. Los pescadores le llaman «el que paró a los moros».',null);
  return EVN('El capitán cae de rodillas y sus hombres huyen a las barcas. La villa se llena de gritos de alivio.'+(c?' Liberas a '+c+' vecinos.':''),[evEnd()],'¡Iluro se salva!','🏆')}
 if(res==='fled'||res==='lost'||res==='dead'){sackMaresme();G.cd.asedio=G.t+1440*45;return EVN('Pierdes terreno y los corsarios arrasan la playa. Cuando se marchan, Iluro es un revuelo de llanto, redes rotas y casas abiertas.',[evEnd()],'Saqueo','🔥')}
 return null}
EVENTS.push({id:'asedio_piratas',w:55,ok:c=>MTE(c)&&dateOf(G.t).h>=5&&dateOf(G.t).h<10&&[3,4,5,6,7,8].includes(dateOf(G.t).m)&&(!G.cd.asedio||G.t>G.cd.asedio)&&G.stats.days>12&&G.pc.level>=2,run:c=>{G.cd.asedio=G.t+1440*10;LL('piratas',true);const prep=!!G.flags.guaita_prep&&G.flags.guaita_prep>G.t-1440*20;
 return EVN('La campana de la ermita suena sin pausa. '+(prep?'Gracias a las guaitas, la villa ya estaba avisada: ':'')+'Cinco galeras negras varan en la playa y los corsarios saltan al agua con cimitarras. «¡Moros! ¡A las armas!»',[
  O('Defender la playa',()=>{startCombat(raidWave(1,prep),{after:r=>raidResult(prep,r,1)});return null},{cls:'dark'}),
  O('Organizar a los vecinos [Persuasión CD 12]',()=>{const r=check('persu',12);advance(20,{step:10});if(r.ok){repGain('maresme',4);startCombat(raidWave(1,true),{after:rr=>raidResult(true,rr,1)});return null}startCombat(raidWave(1,prep),{after:rr=>raidResult(prep,rr,1)});return null}),
  O('Tocar la campana y evacuar a los niños [Atletismo CD 11]',()=>{const r=check('athl',11);advance(40,{step:20});if(r.ok){repGain('maresme',8);gainXp(60);G.flags.guaita_prep=G.t;return EVN('Los niños y las madres llegan a la iglesia. Los guardias frenan lo peor, aunque Iluro pierde parte de sus redes.',[evEnd()],'Evacuación','🔔')}sackMaresme();return EVN('Llegas tarde: los corsarios ya están en las calles.',[evEnd()],'Saqueo','🔥')}),
  O('Esconderte',()=>{sackMaresme();return EVN('Desde tu escondite oyes lo que ocurre fuera. Cuando sales, Iluro es otra.',[evEnd()],'Cobardía','😶')},{cls:'dark'})],'¡Corsarios!','☠')}},
 {id:'rescate_cautivos',w:40,ok:c=>MTE(c)&&Object.values(G.npcs).some(n=>n.captive)&&!c.night,run:c=>{return EVN('En el muelle, un fraile y la viuda de un pescador reúnen monedas para el rescate de los cautivos: «Los moros los venderán en Dénia si no pagamos antes de la luna nueva.»',[
  O('Aportar 80 florines',()=>{if(G.pc.gold<80)return EVN('No tienes tanto.',[evEnd()]);addGold(-80);const n=freeCaptives();repGain('maresme',14);gainXp(60);return EVN('El fraile cuenta las monedas con lágrimas. '+n+' vecinos regresan a casa.',[evEnd()],'Rescate','🙏')}),
  O('Proponer asaltar el barco corsario [Intimidación CD 13]',()=>{const r=check('intim',13);if(r.ok){const n=freeCaptives();repGain('maresme',10);gainXp(80);return EVN('Con tres guardias y una barca, liberas a los cautivos sin sangre. «Los has asustado con la mirada».',[evEnd()],'Golpe de mano','⚔')}G.pc.hp=Math.max(1,G.pc.hp-6);return EVN('Os descubren al acercaros. Escapáis con la barca llena de agua. −6 PG.',[evEnd()],'Fracaso','🌊')}),
  O('No puedes ayudar',()=>evEnd())],'Rescate','🙏')}});
// guaita: preparar las torres antes del asedio
const _ev_piratas=EVENTS.find(e=>e.id==='piratas_alba');if(_ev_piratas){const _r=_ev_piratas.run;_ev_piratas.run=function(c){G.flags.guaita_prep=G.t;return _r(c)}}
// leña de tronco según zona
for(const k in RN)if(k==='tronco'){const a=RN.tronco.acts[0];a.out=[['madera_haya',[2,3]]];a.zoneOut={maresme:'madera_pino',penedes:'madera_encina',egara:'madera_chopo'};}
const _rnGive=rnGive;rnGive=function(out,margin,nat){const z=G.zone;const rep=out.map(o=>[ (o[0]==='madera_haya'&&RN.tronco.acts[0].zoneOut[z])||o[0],o[1]]);return _rnGive(rep,margin,nat)};
