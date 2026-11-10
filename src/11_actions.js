// ===================== ACCIONES: combate, oficios, recolección, descanso, viaje, propiedades, comercio, guardado =====================
// ---------- combate por turnos ----------
function teleportSafe(){const z=getZone(G.zone);const inn=z.buildings.find(b=>b.kind==='inn');let t=inn&&inn.entry?[inn.entry.x+.5,inn.entry.y+1.5]:[z.spawn.x,z.spawn.y];t=safeSpot(z,t[0],t[1]);G.px=t[0];G.py=t[1];R.path=null;R.dest=null;R.pending=null;R.keys={};R.joy=[0,0];bus.emit('teleport')}
function npcMurder(n){n.killedBy='pc';const ws=witnesses(11);G.stats.kills++;infamyGain(25);let seen=ws.length>0;npcAdj(n,-100);
 for(const id in n.rel){const o=G.npcs[id];if(!o||!o.alive)continue;if(n.rel[id].v>=15){o.aff=clamp(o.aff-(seen?60:30),-100,100);o.flags.grudge=n.name}}
 if(seen){G.bounty[G.zone]=(G.bounty[G.zone]||0)+250;repGain(G.zone,-30);facGain('concejo',-15);log('Tu crimen no ha pasado inadvertido. Recompensa: '+fmtGold(G.bounty[G.zone])+'.','bad')}else{log('Nadie parece haber visto nada... por ahora.','bad')}
 if(n.fac&&FACTIONS[n.fac])facGain(n.fac,-12);if(n.job==='guardia')facGain('concejo',-20);
 const ev={t:G.t,k:'murder',m:n.name+' fue hallado muerto en '+ZINFO[n.zone].n+'.'};G.journal.push(ev);bus.emit('news',ev.m)}
// encuentros aleatorios en caminos
function rollEncounter(zone,night){const b=ZINFO[zone].biome;const R=Math.random;const cc=animalCounts(zone);
 const pools={forest:['lobo','jabali','trasgo','bandido'],hills:['jabali','ogro','trasgo','bandido','lobo'],mountain:['lobo','vibora','bandido','cabra'],river:['bandido','jabali','rata'],coast:['bandido','rata']}[b]||['bandido'];
 const sp=pick(pools);if(sp==='bandido')return{kind:'bandit',list:[banditCombatant(1+Math.floor(G.pc.level/3)),R()<.5?banditCombatant(1):null].filter(Boolean)};
 const cand=G.fauna[zone].filter(a=>a.sp===sp&&!a.e&&a.alive);if(!cand.length)return null;const a=pick(cand);const group=[a];const C=CREAT[sp];if(sp==='lobo'||sp==='trasgo'){cand.filter(x=>x!==a).slice(0,2).forEach(x=>group.push(x))}return{kind:'fauna',list:group.map(animalCombatant)}}
// ---------- recolección ----------
function hasTool(t){return G.pc.inv.some(s=>ITEMS[s.id]&&ITEMS[s.id].tool===t)||G.pc.eq.main&&ITEMS[G.pc.eq.main.id].tool===t}
function qualityFrom(margin,nat){let q=1+(margin>=5?1:0)+(margin>=10?1:0)+(margin>=15?1:0);if(nat===20)q++;return clamp(q,0,4)}
function gatherFlora(p){const F=FLORA[p.sp];const z=G.zone;const out={ok:false,msg:''};const mon=dateOf(G.t).m;
 if(F.k==='tree'){if(p.age<F.mat*.4){out.msg='Es un árbol demasiado joven para talar o recolectar.';return out}
  if(F.harv&&F.harv.months.includes(mon)&&p.hv<=0){const r=check('nature',9,{label:'Recolectar '+F.harv.name});if(r.ok){const n=ri(F.harv.n[0],F.harv.n[1])+(r.margin>=6?1:0);giveItem(F.harv.item,n,qualityFrom(r.margin,r.nat));p.hv=18;advance(20);out.ok=true;out.msg='Recoges '+ITEMS[F.harv.item].n+' ×'+n+'.';return out}out.msg='No consigues recoger nada útil.';return out}
  out.msg='Puedes talarlo con un hacha, o plantar más árboles con semillas.';out.chop=true;return out}
 if(F.harv){if(F.harv.months&&!F.harv.months.includes(mon)){out.msg='No es temporada de '+F.n.toLowerCase()+'.';return out}if(p.age<F.mat){out.msg='Todavía no está madura.';return out}if(p.hv>0){out.msg='Ya la has recolectado hace poco.';return out}
  const dc=ITEMS[F.harv.item].rare?17:F.k==='fungus'?10:9;const r=check('nature',dc,{label:'Recolectar '+F.n,adv:(G.pc.species==='elf'||G.pc.cls==='druid'||G.pc.cls==='ranger')?1:0});
  if(r.ok){const n=ri(F.harv.n[0],F.harv.n[1])+(r.margin>=8?1:0);giveItem(F.harv.item,n,qualityFrom(r.margin,r.nat));p.hv=F.k==='fungus'?6:14;advance(15);out.ok=true;out.msg='Recoges '+ITEMS[F.harv.item].n+' ×'+n+'.';gainXp(3);if(ITEMS[F.harv.item].rare){gainXp(25);log('¡Una pieza rara!','lvl')}
   if(F.k!=='tree'&&r.nat===1)out.msg+=' (La arrancas con las raíces; no volverá a crecer.)';return out}
  if(r.fumble){p.dead=1;out.msg='La destrozas sin querer.';return out}out.msg='No consigues recolectarla bien.';return out}
 out.msg=F.n;return out}
function chopTree(p){const F=FLORA[p.sp];if(!hasTool('axe')){return{ok:false,msg:'Necesitas un hacha de leñador.'}}const r=check('athl',8+(p.age>F.mat*1.8?3:0),{label:'Talar'});advance(40);
 if(r.ok){const n=ri(F.chop.n[0],F.chop.n[1])+(r.margin>=6?1:0);giveItem(F.chop.item,n,qualityFrom(r.margin,r.nat));p.dead=1;G.flora[G.zone]=G.flora[G.zone].filter(x=>!x.dead);rebuildOcc(getZone(G.zone));if(p.age>F.mat*1.8){facGain('circulo',-3);log('Has talado un árbol venerable. El Círculo lo sabrá.','bad')}G.pc.needs.fatigue+=3;return{ok:true,msg:'El árbol cae. Obtienes '+ITEMS[F.chop.item].n+' ×'+n+'.'}}
 return{ok:false,msg:'El hacha rebota. Fallas.'}}
function plantWild(seedStack,i,x,y){const I=ITEMS[seedStack.id];const F=FLORA[I.sp];if(!F)return false;const z=getZone(G.zone);const tx=Math.floor(x),ty=Math.floor(y);if(!tileFree(z,tx,ty)||z.flat[ZI(z,tx,ty)]>.3){toast('Aquí no se puede plantar.','bad');return false}
 if(F.bi&&F.bi.indexOf(z.biome)<0){toast('Aquí no crecerá bien ('+z.biome+').','bad');return false}const r=check('nature',11,{label:'Plantar'});if(!r.ok){toast('La semilla no prende.','bad');consume(i);return false}consume(i);G.flora[G.zone].push({id:'f'+(G.eid++),sp:I.sp,x:tx+.5,y:ty+.5,age:0,hv:0,ap:0,v:0});gainXp(2);facGain('circulo',1);rebuildOcc(z);bus.emit('flora');bus.emit('inv');return true}
function fishHere(){if(!hasTool('rod'))return{ok:false,msg:'Necesitas una caña de pescar.'};const z=getZone(G.zone);const x=Math.floor(G.px),y=Math.floor(G.py);let near=false;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(inZ(z,xx,yy)&&z.solid[ZI(z,xx,yy)]===2)near=true}if(!near)return{ok:false,msg:'No hay agua cerca.'};
 const r=check('survival',11,{label:'Pescar',ab:'dex'});advance(60);if(r.ok){const n=1+(r.margin>=8?1:0);const sea=ZINFO[G.zone].biome==='coast';const fid=sea?pick(['sardina','sardina','anchoa','anchoa','merluza','dorada','pulpo']):'trucha';giveItem(fid,n,qualityFrom(r.margin,r.nat));gainXp(3);return{ok:true,msg:'Pescas '+ITEMS[fid].n+' ×'+n+'.'}}return{ok:false,msg:'Los peces no pican.'}}
function mineHere(b){if(!hasTool('pick'))return{ok:false,msg:'Necesitas un pico.'};const r=check('athl',b.kind==='mine'?11:9,{label:'Picar'});advance(60);G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+6);
 if(r.ok){const id=b.kind==='mine'?(Math.random()<.7?'mineral':(Math.random()<.5?'carbon':'cristal')):(G.zone==='collbato'||G.zone==='montserrat'?'conglomerado':'caliza');const n=ri(1,3)+(SPECIES[G.pc.species].flags&&SPECIES[G.pc.species].flags.stone?2:0);giveItem(id==='cristal'&&Math.random()<.85?'mineral':id,n,qualityFrom(r.margin,r.nat));gainXp(3);return{ok:true,msg:'Extraes '+ITEMS[id].n+' ×'+n+'.'}}return{ok:false,msg:'No logras avanzar.'}}
// ---------- oficios ----------
const TOOL_AB={smith:'str',carp:'dex',alch:'int',cook:'wis',leath:'dex',weav:'dex',herb:'wis',thief:'dex',brew:'int',mason:'str'};
function stationsHere(){const set={};const z=getZone(G.zone);if(z.pub&&INT.b&&INT.b.st)INT.b.st.forEach(s=>set[s]='pública');const bl=G.built[G.zone]||[];
 for(const b of bl){const P=PLACE[b.t];if(P&&P.station&&Math.hypot(b.x-G.px,b.y-G.py)<=5)set[P.station]='propia'}
 for(const b of z.buildings){if(b.st&&b.entry&&Math.hypot(b.entry.x-G.px,b.entry.y-G.py)<=7){for(const s of b.st)if(!set[s])set[s]='pública'}}
 return set}
function craftBonus(tool){const p=G.pc;const known=p.tools.includes(tool)||p.crafts[tool]>0;const lvl=Math.floor((p.crafts[tool]||0)/80);let b=abMod(TOOL_AB[tool]||'int')+(known?pbOf(p.level):-3)+lvl+(hasFeat('crafter')?1:0);const r=G.fac.artesanos.rank;b+=r>=3?2:r>=2?1:0;return b}
function canCraft(r){const st=stationsHere();const miss=[];if(r.st&&!st[r.st])miss.push('Falta: '+STATION_N[r.st]);for(const k in r.in)if(!have(k,r.in[k]))miss.push(iname(k)+' ×'+r.in[k]);return{ok:!miss.length,miss}}
function doCraft(r){const c=canCraft(r);if(!c.ok){toast(c.miss.join(' · '),'bad');return null}
 const st=stationsHere();const fee=(r.st&&st[r.st]==='pública'&&G.fac.artesanos.rank<1);if(fee&&G.pc.gold<5){toast('El taller público cobra 5 fl.','bad');return null}
 const bonus=craftBonus(r.tool);const nat=d20(0,{t:'craft',label:'Fabricar '+r.n,bonus,dc:r.dc}).r;if(fee)addGold(-5);const tot=nat+bonus;const ok=nat===20||(nat!==1&&tot>=r.dc);const margin=tot-r.dc;
 log('Fabricar '+r.n+': d20('+nat+')'+fmt(bonus)+' = '+tot+' vs CD '+r.dc+' → '+(ok?'ÉXITO':'FALLO'),ok?'ok':'bad');advance(r.min,{step:30});
 const p=G.pc;if(ok){for(const k in r.in)takeItem(k,r.in[k]);const q=qualityFrom(margin,nat);const outId=r.out[0],nOut=r.out[1];const I=ITEMS[outId];const qq=(I.slot||I.cat==='potion'||I.cat==='tool')?q:Math.min(q,3);giveItem(outId,nOut,qq);p.crafts[r.tool]=(p.crafts[r.tool]||0)+r.xp;G.stats.crafts++;gainXp(Math.round(r.xp/2));toast(I.n+' ×'+nOut+' ('+QNAMES[qq]+')','ok');return{ok:true,q:qq}}
 for(const k in r.in){takeItem(k,Math.floor(r.in[k]/2))}p.crafts[r.tool]=(p.crafts[r.tool]||0)+Math.ceil(r.xp/4);toast('Se pierden parte de los materiales.','bad');return{ok:false}}
// ---------- descanso y viaje ----------
function rest(kind,b){const p=G.pc;const h=8;const phase=phaseOf(G.t);let enc=null;
 if(kind==='camp'){const w=wxOf(G.zone);const ok=check('survival',10+(w.type==='rain'||w.type==='snow'?3:0),{label:'Acampar'});if(!ok.ok&&Math.random()<.5){enc=rollEncounter(G.zone,true)}if(w.temp<0&&!p.eq.cloak){p.hp=Math.max(1,p.hp-3);log('El frío te castiga durante la noche.','bad')}}
 const start=G.t;advance(h*60,{sleep:true,step:60,indoor:kind!=='camp'});
 const full=kind!=='camp';p.hp=full?p.maxHp:Math.min(p.maxHp,p.hp+Math.ceil(p.maxHp*.5));p.slots.cur=p.slots.max;p.needs.fatigue=0;if(p.species==='human'&&Math.random()<.5)p.inspiration=true;if(hasFeat('lucky'))p.luck=pbOf(p.level);
 for(const k in p.sig)if(SIGUSES[k])p.sig[k]=SIGUSES[k](p.level);p.poison=0;log('Descansas '+h+' horas'+(kind==='home'?' en tu hogar':kind==='inn'?' en la posada':' al raso')+'.','ok');
 if(enc){log('¡Algo te despierta en plena noche!','bad');startCombat(enc.list,{ambush:true})}bus.emit('inv');refreshPC()}
function travelTo(to,arriveFrom){const from=G.zone;if(!TRAVEL[from]||!TRAVEL[from][to])return false;
 G.zone=to;const z=getZone(to);const ar0=(z.arrive&&z.arrive[from])||z.spawn;const ar=safeSpot(z,ar0.x,ar0.y);G.px=ar[0];G.py=ar[1];R.keys={};R.path=null;R.dest=null;R.grace=Math.max(R.grace||0,6);passiveLore(to);bus.emit('zone',to);
 log('Cruzas hacia '+ZINFO[to].n+'.','sys');return true}
// ---------- propiedades ----------
function plotOwned(zid,pid){return G.deeds[zid]&&G.deeds[zid][pid]}
function canBuyReq(b){if(b.zone==='barcino'&&G.fac.concejo.rank<2)return'Necesitas ser Ciudadano de Barcino (Concejo, rango 2).';if(b.zone==='martorell'&&G.fac.concejo.rank<1&&G.zrep.martorell<5)return'Necesitas buena reputación en Martorell.';return null}
function buyBuilding(b){const why=canBuyReq(b);if(why){toast(why,'bad');return false}if(G.pc.gold<b.forSale){toast('No tienes suficiente oro.','bad');return false}addGold(-b.forSale);delete ZCACHE['int:'+b.id];G.owned[b.id]={zone:b.zone,since:G.t,name:b.name};G.built['int:'+b.id]=G.built['int:'+b.id]||[];G.pc.home=G.pc.home||b.id;log('Compras '+b.name+' por '+fmtGold(b.forSale)+'.','lvl');facGain('concejo',2);G.fame=clamp(G.fame+2,0,100);bus.emit('props');return true}
function buyPlot(p){if(p.zone==='barcino'&&G.fac.concejo.rank<2){toast('Necesitas ser Ciudadano de Barcino.','bad');return false}if(plotOwned(p.zone,p.id)){return false}if(G.pc.gold<p.price){toast('No tienes suficiente oro.','bad');return false}addGold(-p.price);G.deeds[p.zone]=G.deeds[p.zone]||{};G.deeds[p.zone][p.id]={x:p.x,y:p.y,w:p.w,h:p.h,name:p.name||'Terreno'};G.built[p.zone]=G.built[p.zone]||[];log('Compras un terreno en '+ZINFO[p.zone].n+' ('+fmtGold(p.price)+').','lvl');bus.emit('props');return true}
function claimWild(){const z=getZone(G.zone);if(z.indoor||G.zone==='barcino'){toast('Aquí no hay tierras sin dueño.','bad');return false}const n=Object.keys(G.deeds[G.zone]||{}).filter(k=>k.startsWith('wild')).length;if(n>=2){toast('Ya reclamas demasiadas tierras aquí.','bad');return false}
 const x0=Math.floor(G.px)-3,y0=Math.floor(G.py)-3;for(let j=0;j<6;j++)for(let i=0;i<6;i++){if(!inZ(z,x0+i,y0+j)||z.solid[ZI(z,x0+i,y0+j)]||z.flat[ZI(z,x0+i,y0+j)]>.5){toast('El terreno no es apto (hay obstáculos o edificios).','bad');return false}}
 const id='wild_'+G.eid++;G.deeds[G.zone]=G.deeds[G.zone]||{};G.deeds[G.zone][id]={x:x0,y:y0,w:6,h:6,name:'Tierra reclamada'};G.built[G.zone]=G.built[G.zone]||[];facGain('circulo',-1);log('Reclamas un terreno abandonado. Tendrás que defenderlo.','lvl');bus.emit('props');return true}
function inOwnedArea(zid,x,y){if(zid.startsWith('int:'))return G.owned[zid.slice(4)]&&x>=1&&y>=1&&x<13&&y<11;const dd=G.deeds[zid];if(!dd)return false;for(const k in dd){const p=dd[k];if(x>=p.x&&y>=p.y&&x<p.x+p.w&&y<p.y+p.h)return true}return false}
function placeItem(t,x,y){const P=PLACE[t];const zid=G.zone;const tx=Math.floor(x),ty=Math.floor(y);const z=getZone(zid);if(!inOwnedArea(zid,tx,ty)){toast('Sólo puedes construir en tu propiedad.','bad');return false}
 if(!inZ(z,tx,ty)||(P.solid!==false&&(z.solid[ZI(z,tx,ty)]||z.occ[ZI(z,tx,ty)]))){toast('Ese sitio está ocupado.','bad');return false}
 const bl=G.built[zid]=G.built[zid]||[];if(bl.some(b=>Math.floor(b.x)===tx&&Math.floor(b.y)===ty&&(PLACE[b.t].flat?false:true)===(P.flat?false:true))){toast('Ya hay algo ahí.','bad');return false}
 let paid=true;for(const k in P.mats){if(!have(k,P.mats[k]))paid=false}
 if(paid){for(const k in P.mats)takeItem(k,P.mats[k])}else{const c=Math.ceil(P.cost*1.4);if(G.pc.gold<c){toast('Te faltan materiales o '+fmtGold(c)+'.','bad');return false}addGold(-c)}
 bl.push({id:'b'+(G.eid++),t,x:tx+.5,y:ty+.5});rebuildOcc(z);bus.emit('built');return true}
function removeItem(x,y){const zid=G.zone;const bl=G.built[zid]||[];const i=bl.findIndex(b=>Math.hypot(b.x-x,b.y-y)<.7);if(i<0)return false;const b=bl[i];const P=PLACE[b.t];addGold(Math.floor(P.cost*.5));bl.splice(i,1);rebuildOcc(getZone(zid));bus.emit('built');return true}
function plantCrop(b,seedIdx){const s=G.pc.inv[seedIdx];if(!s||ITEMS[s.id].cat!=='seed')return false;const I=ITEMS[s.id];const F=FLORA[I.sp];if(!F||F.k!=='crop'){toast('Eso no es un cultivo; plántalo en el suelo libre.','bad');return false}if(b.crop){toast('Ya hay un cultivo.','bad');return false}
 if(F.months&&!F.months.includes(dateOf(G.t).m)){toast('No es temporada de siembra de '+F.n.toLowerCase()+'.','bad');return false}const r=check('nature',9,{label:'Sembrar'});consume(seedIdx);if(!r.ok){toast('La semilla no prende.','bad');return true}b.crop={sp:I.sp,d:0,hp:3,water:false,q:qualityFrom(r.margin,r.nat)};bus.emit('built');bus.emit('inv');return true}
function harvestCrop(b){if(!b.crop)return false;const F=FLORA[b.crop.sp];if(b.crop.d<F.days){toast('Aún no está madura ('+b.crop.d+'/'+F.days+' días).','bad');return false}const r=check('nature',10,{label:'Cosechar'});const n=ri(F.harv.n[0],F.harv.n[1])+(r.margin>=6?2:0);giveItem(F.harv.item,n,clamp(b.crop.q+(r.ok?1:0),0,4));b.crop=null;gainXp(6);advance(20);bus.emit('built');return true}
function waterCrop(b){if(b.crop)b.crop.water=true;advance(5);return true}
function addAnimalPen(b,sp){const C=CREAT[sp];const cost={gallina:15,oveja:35,cabra_d:40}[sp]||20;if(G.pc.gold<cost){toast('Cuesta '+fmtGold(cost)+'.','bad');return false}b.an=b.an||[];if(b.an.length>=4){toast('El corral está lleno.','bad');return false}addGold(-cost);b.an.push({sp,age:C.mat,sex:'f'});bus.emit('built');return true}
function collectPen(b){if(!b.prod){return 0}const sp=b.an&&b.an[0]?CREAT[b.an[0].sp]:null;const id=sp&&sp.prod||'huevos';const n=Math.min(b.prod,8);giveItem(id,n,2);b.prod=0;gainXp(2);return n}
// ---------- comercio ----------
function npcStock(n,b){const list=[];if(b){const s=shopStock(b);s.forEach(l=>list.push(Object.assign({src:'shop'},l)))}
 for(const s of n.inv){const idx=list.findIndex(l=>l.id===s.id&&l.q===(s.q||1));if(idx>=0&&list[idx].src==='npc'){list[idx].n+=s.n}else list.push({id:s.id,q:s.q||1,n:s.n,src:'npc'})}return list}
function tradeBuy(n,b,line,qty){const fac=b&&b.fac||n.fac;let price=buyPrice(n.zone,line.id,line.q,fac)*qty;const disc=n.flags.disc>G.t?.9:1;price=Math.round(price*disc*(attitude(n)<-30?1.2:1));
 if(G.pc.gold<price){toast('No tienes suficiente oro.','bad');return false}addGold(-price);giveItem(line.id,qty,line.q);if(line.src==='shop'&&b)shopSold(b,line.id,qty);else invTake(n.inv,line.id,qty);n.gold+=price;G.stats.trades++;npcAdj(n,.3);return true}
function tradeSell(n,b,idx,qty){const s=G.pc.inv[idx];if(!s)return false;const I=ITEMS[s.id];if(I.cat==='tool'&&false)return false;const fac=b&&b.fac||n.fac;let price=sellPrice(n.zone,s.id,s.q,fac)*qty;price=Math.round(price*(n.flags.disc>G.t?1.1:1));
 if(G.pc.stolenFlag&&false){}if(n.gold<price){if(n.gold<=0){toast(n.name+' no tiene dinero.','bad');return false}price=n.gold}
 if(isStolen(s)&&G.fac.sombra.rank<2&&n.job!=='ladron'){toast('Reconoce el objeto como robado. No lo comprará.','bad');return false}
 n.gold-=price;addGold(price);s.n-=qty;if(s.n<=0)G.pc.inv.splice(idx,1);if(b)shopBought(b,s.id,qty);else invAdd(n.inv,s.id,qty,s.q||0);G.stats.trades++;bus.emit('inv');return true}
function isStolen(s){return false}
// ---------- puesto de mercado y subastas ----------
function stallKey(z,id){return z+':'+id}
function rentStall(z,sid){const k=stallKey(z,sid);const f=G.zone==='barcino'&&G.fac.mercaderes.rank<1;if(f){toast('Necesitas ser miembro del Gremio de Mercaderes para tener puesto en la Rambla.','bad');return false}if(G.stalls[k])return true;G.stalls[k]={items:[],open:false,gold:0,sales:0,z,id:sid};return true}
function stallTick(){const R=Math.random;const h=dateOf(G.t).hf;if(h<8||h>20)return;for(const k in G.stalls){const S=G.stalls[k];if(!S.open||!S.items.length)continue;const w=G.wx[S.z];const f=festAt(G.t)?1.6:1;let cust=Math.round((S.z==='barcino'?5:S.z==='martorell'?3:2)*f*(w.type==='rain'?.5:w.type==='storm'?.2:1)*(1+(G.fame/100)+abMod('cha')*.05));
  for(let i=0;i<cust;i++){const it=pick(S.items,R);if(!it||it.n<=0)continue;const ref=sellPrice(S.z,it.id,it.q,'mercaderes')/.55*1.1;const ratio=it.price/Math.max(1,ref);const pbuy=clamp(1.15-ratio*.7+abMod('cha')*.03,0,.9);if(R()<pbuy){it.n--;S.gold+=it.price;S.sales++;G.stats.trades++;if(ECO_ITEMS.includes(it.id))G.econ[S.z].s[it.id]++;gainXp(1)}}
  S.items=S.items.filter(x=>x.n>0)}}
function stallAdd(k,idx,qty,price){const S=G.stalls[k];const s=G.pc.inv[idx];if(!S||!s)return false;qty=Math.min(qty,s.n);const ex=S.items.find(x=>x.id===s.id&&x.q===(s.q||0)&&x.price===price);if(ex)ex.n+=qty;else S.items.push({id:s.id,q:s.q||0,n:qty,price});s.n-=qty;if(s.n<=0)G.pc.inv.splice(idx,1);bus.emit('inv');return true}
function stallTakeGold(k){const S=G.stalls[k];const g=S.gold;S.gold=0;addGold(g);return g}
function stallReturn(k){const S=G.stalls[k];S.items.forEach(it=>giveItem(it.id,it.n,it.q));S.items=[];bus.emit('inv')}
function auctionItem(idx){const s=G.pc.inv[idx];if(!s)return null;const base=sellValue(s)*1.1;let price=base*.9;const bidders=2+Math.floor(G.fame/25)+(G.fac.mercaderes.rank>=3?2:0);const rounds=[];
 for(let i=0;i<3;i++){const r=check('persu',12+i,{label:'Subasta (ronda '+(i+1)+')',silent:false,adv:G.fame>40?1:0});if(r.ok){price*=1+.12+r.margin*.01+(bidders>3?.03:0);rounds.push('ronda '+(i+1)+': sube a '+Math.round(price))}else{price*=.98;break}}
 const total=Math.round(price);s.n--;if(s.n<=0)G.pc.inv.splice(idx,1);addGold(total);G.stats.trades++;bus.emit('inv');return{total,rounds}}
// ---------- encargos ----------
function questKill(sp,zone){for(const q of G.quests){if(q.state==='open'&&q.type==='hunt'&&q.sp===sp&&(!q.zone||q.zone===zone)){q.have=(q.have||0)+1;if(q.have>=q.need){q.state='done';toast('Encargo cumplido: vuelve con '+(G.npcs[q.giver]?G.npcs[q.giver].name:'el cliente'),'lvl')}}}}
function genQuest(n){const J=JOB[n.job];const R=Math.random;const kinds=[];if(['granjero','cazador','pastor','aldeano'].includes(n.job)||n.job==='guardia')kinds.push('hunt');kinds.push('fetch');if(n.job!=='mendigo')kinds.push('deliver');const k=pick(kinds);
 if(k==='hunt'){const sps=['lobo','jabali','conejo','rata','vibora','zorro','trasgo'].filter(s=>CREAT[s]&&CREAT[s].cap&&CREAT[s].cap[n.zone]&&G.fauna[n.zone].some(a=>a.sp===s));if(!sps.length)return genQuest2(n,'fetch');const sp=pick(sps);const need=ri(2,4);return{id:'q'+(G.eid++),type:'hunt',giver:n.id,sp,zone:n.zone,need,have:0,title:'Cazar '+CREAT[sp].n.toLowerCase()+'s',text:n.name+' te pide que acabes con '+need+' '+CREAT[sp].n.toLowerCase()+' en '+ZINFO[n.zone].n+'.',reward:{gold:need*(CREAT[sp].xp>50?30:12),xp:need*CREAT[sp].xp,aff:8},state:'open'}}
 return genQuest2(n,k)}
function genQuest2(n,k){const R=Math.random;if(k==='deliver'){const o=Object.values(G.npcs).filter(m=>m.alive&&m.zone!==n.zone&&!m.traveler&&m.id!==n.id);if(!o.length)k='fetch';else{const t=pick(o);return{id:'q'+(G.eid++),type:'deliver',giver:n.id,target:t.id,title:'Mensaje para '+t.name,text:n.name+' te pide entregar un mensaje a '+t.name+' en '+ZINFO[t.zone].n+'.',reward:{gold:ri(15,40),xp:30,aff:6},state:'open'}}}
 const opts=['pan','hierbas','madera','piel','carne','pescado','lana','setas','mineral','piedra'];const id=famPick(pick(opts),G.zone);const n_=ri(3,6);return{id:'q'+(G.eid++),type:'fetch',giver:n.id,item:id,need:n_,title:'Reunir '+ITEMS[id].n.toLowerCase(),text:n.name+' necesita '+n_+' × '+ITEMS[id].n+'.',reward:{gold:Math.round(ITEMS[id].v*n_*1.6+8),xp:25,aff:6},state:'open'}}
questOffer=function(n){if(n.job==='mendigo'||n.traveler)return null;const open=G.quests.find(q=>q.giver===n.id&&q.state==='open');if(open)return null;if(G.t<(n.nextQuest||0))return null;
 return{l:'Preguntar si necesita ayuda (encargos)',f:()=>{const q=genQuest(n);n.nextQuest=G.t+1440*3;return D(n,'«'+q.text+' Te pagaré '+fmtGold(q.reward.gold)+'.»',[O('Aceptar el encargo',()=>{G.quests.push(q);log('Encargo aceptado: '+q.title,'sys');return D(n,'«Gracias. Cuento contigo.»',[O('Volver',()=>mainMenu(n))])}),O('Rechazar',()=>mainMenu(n))])}}};
questTurnins=function(n,opts){for(const q of G.quests){if(q.state==='done'&&q.giver===n.id){opts.push(O('Entregar encargo: '+q.title,()=>completeQuest(q,n),{cls:'svc'}))}
  if(q.state==='open'&&q.giver===n.id&&q.type==='fetch'&&have(q.item,q.need))opts.push(O('Entregar '+q.need+' × '+ITEMS[q.item].n,()=>{takeItem(q.item,q.need);return completeQuest(q,n)},{cls:'svc'}));
  if(q.state==='open'&&q.type==='deliver'&&q.target===n.id)opts.push(O('Entregar el mensaje de '+(G.npcs[q.giver]?G.npcs[q.giver].name:'alguien'),()=>{q.state='done';q.delivered=1;const dtx=deliverEffect(q,n);return D(n,dtx,[O('Volver',()=>mainMenu(n))])},{cls:'svc'}));
  if(q.state==='done'&&q.type==='deliver'&&q.giver===n.id&&q.delivered)opts.push(O('Informar: mensaje entregado',()=>completeQuest(q,n),{cls:'svc'}));
  if(q.type==='secret'&&q.giver===n.id&&q.state==='open'&&n.flags.secretResolved)opts.push(O('Informar de la solución',()=>completeQuest(q,n),{cls:'svc'}))}};
function completeQuest(q,n){q.state='closed';const R=q.reward;if(R.gold)addGold(R.gold);if(R.xp)gainXp(R.xp);npcAdj(n,R.aff||5,true);repGain(n.zone,3);if(n.fac)facGain(n.fac,3);log('Encargo completado: '+q.title+'.','lvl');return D(n,'«¡Excelente trabajo! Aquí tienes: '+fmtGold(R.gold||0)+'.»',[O('Volver',()=>mainMenu(n))])}
// ---------- guardado ----------
function snapshot(){return JSON.stringify(G,(k,v)=>k==='combat'?undefined:v)}
function saveGame(slot){try{const s=snapshot();localStorage.setItem('rpg_barcino_'+slot,s);localStorage.setItem('rpg_barcino_meta_'+slot,JSON.stringify({name:G.pc.name,lvl:G.pc.level,t:G.t,cls:G.pc.cls,sp:G.pc.species,zone:G.zone}));return true}catch(e){return false}}
function loadGame(slot){try{const s=localStorage.getItem('rpg_barcino_'+slot);if(!s)return false;G=JSON.parse(migrateItems(s));legacyFix();for(const k in ZCACHE)delete ZCACHE[k];G.combat=null;CB=null;ZIDS.forEach(z=>rebuildOcc(getZone(z)));refreshPC();return true}catch(e){return false}}
const ITEM_MIG={verdura:'col',fruta:'manzana',carne:'carne_cerdo',pescado:'sardina',hierbas:'romero_h',setas:'niscalo',madera:'madera_pino',piedra:'caliza',piel:'piel_oveja',pluma:'pluma_cuervo',colmillo:'colmillo_jabali',cuerno:'cuerno_cabra',dulces:'turron',queso:'queso_cabra',leche:'leche_cabra',semilla_verdura:'semilla_col'};
function migrateItems(s){for(const k in ITEM_MIG)s=s.split('"id":"'+k+'"').join('"id":"'+ITEM_MIG[k]+'"');return s.split('"sp":"hortaliza"').join('"sp":"col"')}
function loadFromString(s){try{s=migrateItems(s);const o=JSON.parse(s);if(!o||!o.pc||!o.npcs)return false;G=o;legacyFix();for(const k in ZCACHE)delete ZCACHE[k];G.combat=null;CB=null;ZIDS.forEach(z=>rebuildOcc(getZone(z)));return true}catch(e){return false}}
function saveMeta(slot){try{const m=localStorage.getItem('rpg_barcino_meta_'+slot);return m?JSON.parse(m):null}catch(e){return null}}
