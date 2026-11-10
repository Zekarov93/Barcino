// ===================== EL OFICIO IMPORTA: estadísticas de zona, enfermedad, duelo y relaciones vivas =====================
function zsGet(z){G.zs=G.zs||{};return G.zs[z]||(G.zs[z]={o:50,h:50,m:50,c:20})}
function zonePop(z){return Object.values(G.npcs).filter(n=>n.alive&&n.zone===z&&!n.traveler&&n.job)}
function zoneScore(z){const ns=zonePop(z);const S={o:0,h:0,m:0,c:0};for(const n of ns){if(n.ill>0)continue;const e=(JOBFN[n.job]||{}).eff;if(!e)continue;const k=n.rank==='aprendiz'?.4:1;for(const x in e)S[x]+=e[x]*k}
 const d=Math.max(3,ns.length/7);for(const x in S)S[x]/=d;return S}
function zoneWord(v,inv){const w=v>=70?'excelente':v>=50?'buena':v>=30?'floja':'mala';return inv?(v>=70?'muy alta':v>=50?'alta':v>=30?'moderada':'baja'):w}
function zoneSummary(z){const s=zsGet(z);return 'Orden '+zoneWord(s.o)+' · salud '+zoneWord(s.h)+' · ánimo '+zoneWord(s.m)+' · delincuencia '+(s.c>=60?'galopante':s.c>=40?'preocupante':s.c>=20?'normal':'baja')}
function jobDay(){const R=Math.random;
 for(const z of ZIDS){const s=zsGet(z);const sc=zoneScore(z);const w=wxOf(z);
  const tgt={o:30+sc.o*10,h:35+sc.h*9-(w&&(w.type==='rain'||w.temp<2)?4:0),m:35+sc.m*8+(s.o-50)*.15-(s.c-20)*.2,c:0};
  tgt.c=clamp(50-sc.o*5-sc.m*2+(s.m<35?15:0)+sc.c*1,0,100);
  for(const k of ['o','h','m','c'])s[k]=clamp(s[k]+(tgt[k]-s[k])*.2,0,100);
  const pop=zonePop(z);
  // enfermedad
  for(const n of pop){if(n.ill>0){n.ill--;if(n.ill<=0){n.ill=0;n.mood=Math.min(100,n.mood+5)}else if(n.age>60&&s.h<25&&R()<.05){n.alive=false;n.hp=0;n.hidden=true;G.dead[n.id]=G.t;n.killedBy='enfermedad';deathNews(n,'ha muerto de unas fiebres')}}}
  if(s.h<45&&R()<(45-s.h)/160&&pop.length>2){const n=pick(pop.filter(x=>!x.ill));if(n){n.ill=2+Math.floor(R()*4);addGossip(z,n.name+' ('+npcTitle(n).toLowerCase()+') guarda cama con fiebres.',n)}}
  // ánimo vecinal
  for(const n of pop)n.mood=clamp(n.mood+(s.m-50)*.04,0,100);
  // sin guardia, el crimen sube; sin sacerdote ni maestro, cae el ánimo
  if(s.c>55&&R()<.15)addGossip(z,'La delincuencia está desbocada en '+ZINFO[z].n+'; nadie se atreve a salir de noche.');
  if(s.o<25&&R()<.15)addGossip(z,'En '+ZINFO[z].n+' falta una mano firme: las riñas son cosa de cada día.');
  if(s.h<30&&R()<.2)addGossip(z,'Las fiebres se extienden por '+ZINFO[z].n+'. Escasean los remedios.');
 }
 processDeaths();vacancies();gossipRelations()}
// ----- chismes de la comarca -----
function addGossip(z,m,n){G.gossip=G.gossip||[];G.gossip.push({t:G.t,z,m,n:n?n.id:null});if(G.gossip.length>40)G.gossip.shift()}
const _rumorFor=rumorFor;
rumorFor=function(n){G.gossip=G.gossip||[];const rec=G.gossip.filter(g=>G.t-g.t<1440*12&&(g.z===n.zone||Math.random()<.25)&&g.n!==n.id);
 if(rec.length&&Math.random()<.5){const g=pick(rec);if(g.n&&G.npcs[g.n])learn(G.npcs[g.n],'job',true);return g.m}return _rumorFor(n)};
function deathNews(n,how){const m=n.name+', '+npcTitle(n).toLowerCase()+', '+how+' en '+ZINFO[n.zone].n+'.';addGossip(n.zone,m,n);if(n.met||G.zone===n.zone)bus.emit('news',m);G.journal.push({t:G.t,k:'death',m})}
// ----- duelo, venganza y sucesión -----
function processDeaths(){for(const id in G.npcs){const n=G.npcs[id];if(n.alive||n._mourned)continue;n._mourned=1;n.hidden=true;const pc=n.killedBy==='pc';
  for(const oid in n.rel){const o=G.npcs[oid];if(!o||!o.alive)continue;const r=n.rel[oid];const g=REL[r.k]&&REL[r.k].g;const ir=o.rel[id]||{k:'conocido',v:0};
   if(ir.v>=40||(g==='fam'&&ir.v>=15)||g==='love'){o.mood=Math.max(0,o.mood-40);o.grief=G.t+1440*8;o.flags.grief=n.name;
     if(o.met&&Math.random()<.6)addGossip(o.zone,o.name+' llora la muerte de '+n.name+'.',o);
     if(pc&&ir.v>=45&&o.tr.brave+o.tr.temper>=11){o.flags.avenger=1;o.aff=clamp(o.aff-90,-100,100);addGossip(o.zone,o.name+' ha jurado venganza contra quien mató a '+n.name+'.',o)}
     else if(pc)o.aff=clamp(o.aff-25,-100,100)}
   else if(ir.v<=-40){o.mood=Math.min(100,o.mood+15);if(pc)o.aff=clamp(o.aff+8,-100,100)}
   if(r.k==='aprendiz'&&REL[ir.k]&&ir.k==='maestro'){} }
  if(pc&&n.zone!==G.zone&&Math.random()<.5)addGossip(n.zone,'Se dice que un forastero ha matado a '+n.name+'.',n);
  // negocios que se quedan huérfanos
  if(n.work)G.vacant=G.vacant||{};if(n.work)G.vacant[n.work]=(G.vacant[n.work]||0)+1;
  // entierro
  const ent=Object.values(G.npcs).find(x=>x.alive&&x.zone===n.zone&&x.job==='enterrador');if(ent&&!pc)addGossip(n.zone,ent.name+' ha enterrado a '+n.name+'.',ent);}}
function vacancies(){ // un aprendiz hereda el taller; si no, llega otro vecino
 for(const id in G.npcs){const a=G.npcs[id];if(!a.alive||a.rank!=='aprendiz'||!a.master)continue;const m=G.npcs[a.master];if(m&&!m.alive){a.job=m.job;a.rank=0;a.work=m.work||a.work;a.master=null;a.sched=genSchedule(a);addGossip(a.zone,a.name+' se queda con el taller de '+m.name+'.',a);delete a.rel[m.id]}}}
// ----- relaciones que se ven: amigos se saludan, rivales se miran mal -----
function gossipRelations(){const R=Math.random;for(const id in G.npcs){const n=G.npcs[id];if(!n.alive||n.traveler||R()>.04)continue;
  const ks=Object.keys(n.rel).filter(i=>G.npcs[i]&&G.npcs[i].alive&&G.npcs[i].zone===n.zone);if(!ks.length)continue;const o=G.npcs[pick(ks)];const r=n.rel[o.id];
  if(r.k==='enemigo'&&r.v<=-40&&R()<.3)addGossip(n.zone,n.name+' y '+o.name+' se han insultado en plena calle.',n);
  else if(r.k==='amante'&&R()<.2)addGossip(n.zone,'Dicen que '+n.name+' y '+o.name+' se ven a escondidas.',n);
  else if(r.k==='deudor'&&R()<.3)addGossip(n.zone,o.name+' reclama a '+n.name+' el dinero que le debe.',n);
  else if(r.k==='rival'&&R()<.3)addGossip(n.zone,n.name+' y '+o.name+' compiten por la clientela del barrio.',n)}}
bus.on('day',jobDay);
// los enfermos se quedan en casa
const _npcWhere=npcWhere;npcWhere=function(n,t){if(n.ill>0&&n.home&&n.alive)return{act:'sleep',loc:'home'};return _npcWhere(n,t)};
// los ladrones actúan más donde el orden es bajo (se aplica a ánimo vecinal en el tick horario)
const AMB={amigo:['¿Qué tal, {o}?','¡{o}! ¿Cenamos luego?','Ayer me acordé de ti, {o}.'],conyuge:['{o}, no tardes.','Cuídate, {o}.'],hermano:['{o}, no empieces.','Hermano, ven a casa.'],padre:['{o}, abrígate.','Hijo, ¿has comido?'],hijo:['Ya voy, ya voy…','Sí, padre.'],maestro:['Más rápido, {o}.','Mira cómo se hace.'],aprendiz:['Sí, maestro.','Ahora mismo, maestro.'],vecino:['Buenas, {o}.','{o}, vecino.'],colega:['Menudo día, {o}.','{o}, ¿otro café?'],enemigo:['Hmph. {o}.','…','Aparta, {o}.'],rival:['{o}… qué casualidad.','Se te acabará la suerte, {o}.'],amante:['Shh, {o}…','{o}… esta noche.'],enamorado:['… {o}.','(suspira al ver a {o})'],deudor:['{o}, no me mires así.','Te lo pagaré, {o}.'],acreedor:['{o}, el dinero.','Un día de estos, {o}…']};
let _amb={t:8,el:null,a:null,life:0};
function ambTick(dt){if(!G||G.zone.startsWith('int:')||R.modal||(typeof SCN!=='undefined'&&SCN.cur)||G.combat){if(_amb.el){_amb.el.remove();_amb.el=null}return}
 if(_amb.el){_amb.life-=dt;const a=_amb.a;const z=getZone(G.zone);if(_amb.life<=0||a.hidden||a.zone!==G.zone){_amb.el.remove();_amb.el=null;return}const gy=groundY(z,a.x,a.y)+FH*CSC*(a.scale||1)+.35;const q=GL.project(a.x,gy,a.y);if(!q){_amb.el.style.display='none'}else{_amb.el.style.display='';_amb.el.style.left=q.x+'px';_amb.el.style.top=q.y+'px'}return}
 _amb.t-=dt;if(_amb.t>0)return;_amb.t=10+Math.random()*14;
 const vis=Object.values(G.npcs).filter(n=>n.alive&&n.zone===G.zone&&!n.hidden&&Math.hypot(n.x-G.px,n.y-G.py)<12);
 for(const n of vis.sort(()=>Math.random()-.5)){for(const o of vis){if(o===n||!n.rel[o.id])continue;if(Math.hypot(n.x-o.x,n.y-o.y)>3.2)continue;const k=n.rel[o.id].k;const L=AMB[k];if(!L)continue;
   const el=document.createElement('div');el.className='sbub';const ts=voiceOf(n)==='hosco'?'…':pick(L).replace('{o}',o.name.split(' ')[0]);el.textContent=ts;$('#hud').append(el);_amb={t:_amb.t,el,a:n,life:3.2};return}}}
const _npcTick=npcTick;npcTick=function(dt){_npcTick(dt);try{ambTick(dt)}catch(e){}};
let _zl=null;bus.on('zone',()=>{if(!G||G.zone.startsWith('int:')||_zl===G.zone)return;_zl=G.zone;try{if(G.zs&&G.zs[G.zone])log(ZINFO[G.zone].n+' — '+zoneSummary(G.zone)+'.','sys')}catch(e){}});
// ----- los oficios alimentan la economía: producen, y los transportistas reparten -----
const ECO_PROD={granjero:{grano:2,cebolla:1,carne_cerdo:.5},panadero:{_pan:3},pescador:{_pesca:2},marinero:{_pesca:1},pastor:{carne_cordero:1,lana:1,queso_cabra:.5},cabrero:{queso_cabra:1,carne_cabra:.5},cazador:{carne_conejo:1,piel_conejo:.5},carnicero:{carne_cerdo:1},
 tonelero:{vino:1.5},cervecero:{cerveza:2},minero:{mineral:2,carbon:1},lenador:{madera_pino:2},tejedor:{lana:.5,tela:1},curtidor:{cuero:1},carbonero:{carbon:2},cantero:{caliza:2},monje:{vino:.5,miel:.3},molinero:{_harina:5}};
bus.on('day',()=>{if(!G.econ)return;const R=Math.random;
 for(const id in G.npcs){const n=G.npcs[id];if(!n.alive||n.traveler||n.ill>0||n.rank==='aprendiz')continue;const P=ECO_PROD[n.job];if(!P)continue;const E=G.econ[n.zone];if(!E)continue;if(n.zone==='salinas'&&n.job==='minero')E.s.sal=(E.s.sal||0)+3;
  for(const k in P){let q=P[k];q=Math.floor(q)+(R()<q%1?1:0);if(!q)continue;
   if(k==='_pan'){const use=Math.min(E.s.harina||0,q*2);E.s.harina-=use;E.s.pan=(E.s.pan||0)+Math.floor(use*2.2)+(use<q*2?Math.min(q,Math.floor((E.s.grano||0)/2)):0);if(use<q*2){E.s.grano=Math.max(0,(E.s.grano||0)-q)}}
   else if(k==='_harina'){const use=Math.min(E.s.grano||0,q);E.s.grano-=use;E.s.harina=(E.s.harina||0)+use}
   else if(k==='_pesca'){const c=ZINFO[n.zone].biome==='coast';const it=c?pick(['sardina','sardina','anchoa','merluza','dorada']):'trucha';E.s[it]=(E.s[it]||0)+q}
   else E.s[k]=(E.s[k]||0)+q}}
 // transportistas: llevan de donde sobra a donde falta (cualquier distancia por la red de caminos)
 const STAP=['pan','harina','grano','vino','cerveza','sardina','carne_cerdo','carne_cordero','queso_cabra','aceite','sal','cebolla','col','zanahoria','huevos'];
 for(const z of ZIDS){const E=G.econ[z];const hauls=Object.values(G.npcs).filter(n=>n.alive&&n.zone===z&&!n.traveler&&!(n.ill>0)&&(n.job==='carretero'||n.job==='mercader')).length;const cap=1+hauls*3;let left=cap;
  for(const i of STAP){if(left<=0)break;const t=E.t[i]||0;if(!t)continue;const need=Math.ceil(t*.7-(E.s[i]||0));if(need<=0)continue;
   let best=null;for(const o of ZIDS){if(o===z)continue;const F=G.econ[o];const sur=(F.s[i]||0)-Math.ceil((F.t[i]||4)*1.2);if(sur>0&&(!best||sur>best.sur))best={o,sur}}
   if(!best)continue;const n=Math.min(need,best.sur,left*2);G.econ[best.o].s[i]-=n;E.s[i]=(E.s[i]||0)+n;left-=Math.ceil(n/2)}}
 for(const z of ZIDS)ECO_ITEMS.forEach(i=>{const E=G.econ[z];E.s[i]=Math.min(E.s[i]||0,(E.t[i]||4)*5)})});
