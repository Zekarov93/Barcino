// ===================== GENTE: población con oficio, familias, hogares y relaciones =====================
const REL={
 conyuge:{l:['esposo','esposa'],inv:'conyuge',g:'fam'},padre:{l:['padre','madre'],inv:'hijo',g:'fam'},hijo:{l:['hijo','hija'],inv:'padre',g:'fam'},hermano:{l:['hermano','hermana'],inv:'hermano',g:'fam'},primo:{l:['primo','prima'],inv:'primo',g:'fam'},
 maestro:{l:['maestro','maestra'],inv:'aprendiz',g:'work'},aprendiz:{l:['aprendiz','aprendiza'],inv:'maestro',g:'work'},jefe:{l:['jefe','jefa'],inv:'empleado',g:'work'},empleado:{l:['empleado','empleada'],inv:'jefe',g:'work'},colega:{l:['compañero','compañera'],inv:'colega',g:'work'},socio:{l:['socio','socia'],inv:'socio',g:'work'},
 vecino:{l:['vecino','vecina'],inv:'vecino',g:'soc'},amigo:{l:['amigo','amiga'],inv:'amigo',g:'soc'},conocido:{l:['conocido','conocida'],inv:'conocido',g:'soc'},
 amante:{l:['amante','amante'],inv:'amante',g:'love'},enamorado:{l:['enamorado de él/ella','enamorada de él/ella'],inv:'pretendido',g:'love'},pretendido:{l:['pretendido','pretendida'],inv:'enamorado',g:'love'},
 rival:{l:['rival','rival'],inv:'rival',g:'foe'},enemigo:{l:['enemigo','enemiga'],inv:'enemigo',g:'foe'},acreedor:{l:['prestamista','prestamista'],inv:'deudor',g:'foe'},deudor:{l:['deudor','deudora'],inv:'acreedor',g:'foe'},busca:{l:['lo busca','la busca'],inv:'buscado',g:'foe'},buscado:{l:['buscado por','buscada por'],inv:'busca',g:'foe'}};
const REL_FIX={socio:'socio',hija_oculta:'hijo',amor:'amante',enemigo:'enemigo',alumno:'aprendiz',maestra:'maestro',maestro:'maestro',conocida:'conocido',amigo:'amigo',hermana:'hermano',primo:'primo',colega:'colega',conocido:'conocido',rival:'rival',familia:'primo'};
function relWordOf(n,o){const r=n.rel[o.id];if(!r)return'';const d=REL[r.k];if(!d)return r.k;const fem=(o.sex||(o.look&&o.look.sex))==='f';return d.l[fem?1:0]}
function addRel(a,b,k,v,o){o=o||{};k=REL[k]?k:(REL_FIX[k]||'conocido');if(a.id===b.id)return;const inv=REL[k].inv;
 if(!a.rel[b.id]||o.force)a.rel[b.id]={k,v,pub:o.pub?1:0};if(!b.rel[a.id]||o.force)b.rel[a.id]={k:inv,v:clamp(v+Math.round((Math.random()-.5)*8),-100,100),pub:o.pub?1:0}}
function relG(n,id){const r=n.rel[id];return r&&REL[r.k]?REL[r.k].g:null}

// apellido (última palabra) y reemplazo
function surnameOf(n){const t=n.name.replace(/«.*»/,'').trim().split(/\s+/);return t.length>1?t.slice(1).join(' '):null}
function setSurname(n,sn){if(!sn)return;const f=n.name.split(/\s+/)[0];n.name=f+' '+sn}

// ----- alojamiento por oficio -----
const LODGE={guardia:['barracks'],sereno:['barracks'],campanero:['temple','chapel'],sacristan:['temple','chapel'],enterrador:['temple','chapel'],criado:['ayuntamiento','llotja'],marinero:['port','inn'],estibador:['port','inn'],cocinero:['inn'],camarero:['inn'],cervecero:['inn'],hospitalero:['inn'],copista:['monasterio'],monje:['monasterio','chapel'],farero:['lighthouse'],ladron:['inn'],maton:['inn'],contrabandista:['inn'],mendigo:['port'],juglar:['inn'],estafador:['inn'],guia:['inn']};
const RESIDENTIAL=['house','farm','inn','smith','bakery','apothecary','shop','mill','fisher','lumber','hunter','tannery','temple','chapel','lighthouse','monasterio','barracks','ayuntamiento','llotja','library','tower','port'];
function zoneBuildings(zid){return getZone(zid).buildings}
function bldsOfKind(zid,kinds){return zoneBuildings(zid).filter(b=>kinds.includes(b.kind)&&!b.forSale)}
function occCount(all,id){return all.filter(n=>n.home===id).length}

function assignWork(n,all,zid){const J=JOB[n.job],F=JOBFN[n.job]||{wp:['home']};const kinds=F.wp||[];const load=id=>all.filter(m=>m.work===id&&m!==n).length;
 for(const w of kinds){
  if(w==='home'){n.work=n.home||null;n.workHome=1;return}
  if(w.startsWith('street:')){n.work=null;n.spotKind=w.slice(7);return}
  if(w==='market'){n.work=null;n.spotKind='market';return}
  const bs=bldsOfKind(zid,[w]);const v=zoneBuildings(zid).filter(b=>b.kind===w&&b.virtual);const cand=bs.length?bs:v;
  if(cand.length){const cap=(['inn','temple','monasterio'].includes(w)?3:w==='barracks'?5:2);const free=cand.filter(b=>load(b.id)<cap);const b=(free.length?free:cand).sort((a,c)=>load(a.id)-load(c.id))[0];n.work=b.id;return}}
 // sin edificio adecuado
 n.work=n.home||null;n.workHome=1;if(!n.home)n.spotKind='plaza'}

function chooseHome(n,all,zid){const lodge=LODGE[n.job];const houses=bldsOfKind(zid,['house']);
 const pick1=(arr)=>{arr=arr.slice().sort((a,b)=>occCount(all,a.id)-occCount(all,b.id));return arr[0]};
 // propietarios de comercios viven sobre el comercio
 const wb=n.work?zoneBuildings(zid).find(b=>b.id===n.work):null;
 if(wb&&!n.rank&&RESIDENTIAL.includes(wb.kind)&&['posadero','herrero','panadero','boticario','tendero','molinero','granjero','pescador','lenador','cazador','curtidor','farero','sacerdote','erudito','concejal','mercader','escribano','recaudador','maestro','comadrona','barbero','sastre','zapatero','carpintero','alfarero','tonelero','cordelero','usurero','tejedor'].includes(n.job)&&occCount(all,wb.id)<5)return wb.id;
 if(lodge){const c=bldsOfKind(zid,lodge);if(c.length)return pick1(c).id}
 if(houses.length){const ok=houses.filter(h=>occCount(all,h.id)<4);if(ok.length)return pick1(ok).id;return pick1(houses).id}
 const any=bldsOfKind(zid,RESIDENTIAL);return any.length?pick1(any).id:null}

// ----- población -----
function buildPopulation(seed){const r=mulberry32(seed^0x9e3779b9);const all=[];const byZ={};
 // normaliza trabajos de los personajes escritos a mano
 const fixSpec=s=>{if(s.id==='nuria')s.job='florista';if(s.id==='xavi')s.job='peajero';return s};
 for(const s0 of NPC_SPECS){const s=fixSpec(Object.assign({},s0));const n=buildNPC(s,r);n.handmade=1;all.push(n)}
 // generados por zona
 for(const zone of ZIDS){const plan=GEN_PLAN2[zone]||[];let idx=0;const z=getZone(zone);
  for(const[job,cnt]of plan){for(let i=0;i<cnt;i++){const spec=genNPCSpec(zone,job,idx++,r);
    spec.age=job==='anciano'?64+Math.floor(r()*24):job==='aprendiz'?16+Math.floor(r()*7):20+Math.floor(r()*42);
    if(job==='comadrona'||job==='lavandera'||job==='florista'||job==='costurera'){spec.sex='f';spec.nm=genName(spec.sp,'f',r)}
    if(job==='sereno'||job==='estibador'||job==='enterrador'||job==='maton'){spec.sex=r()<.85?'m':'f';spec.nm=genName(spec.sp,spec.sex,r)}
    const n=buildNPC(spec,r);all.push(n)}}}
 // aprendices: adoptan el oficio de un maestro
 const APPR_OK=['herrero','carpintero','zapatero','sastre','panadero','boticario','alfarero','tonelero','barbero','pescador','tejedor','curtidor','cordelero','escribano','cocinero','mercader','minero','cantero','albanil','cazador','granjero','carretero','posadero'];
 for(const n of all){if(n.job!=='aprendiz')continue;const ms=all.filter(m=>m.zone===n.zone&&m!==n&&APPR_OK.includes(m.job)&&m.rank!=='aprendiz'&&!all.some(x=>x.master===m.id));const m=ms.length?pick(ms,r):null;
  if(m){n.job=m.job;n.rank='aprendiz';n.master=m.id;n.age=Math.min(n.age,m.age-12);n.items=null;
   const Jn=JOB[n.job];n.eq=outfitFor(n.look,n.job,r,n.sex==='f');n.gold=Math.floor(r()*10);n.inv=[];Jn.items.forEach(id=>{if(FAMILY[id])id=famPick(id,n.zone);if(ITEMS[id]&&r()<.4)invAdd(n.inv,id,1,1)});makePrefs(n,mulberry32(hashStr(n.id)+7))}
  else{n.job='carpintero';n.rank='aprendiz'}}
 all.forEach(n=>{(byZ[n.zone]=byZ[n.zone]||[]).push(n)});
 // trabajo, familia, hogar
 for(const zid of ZIDS){const arr=byZ[zid]||[];if(!arr.length)continue;
  // trabajo de los generados (aprendices después, siguen a su maestro)
  for(const n of arr){if(n.handmade||n.rank==='aprendiz')continue;assignWork(n,all,zid)}
  for(const n of arr){if(n.rank==='aprendiz'){const m=all.find(x=>x.id===n.master);n.work=m?m.work:null;n.spotKind=m?m.spotKind:null;if(m&&m.workHome)n.workHome=1}}
  // familias entre los generados sin casa
  const pool=arr.filter(n=>!n.handmade&&n.rank!=='aprendiz'&&!['mendigo','viajero'].includes(n.job)).slice().sort(()=>r()-.5);const fam=new Map();
  const grp=n=>fam.get(n.id);const join=(a,b)=>{let g=grp(a)||grp(b);if(!g){g=[]}if(!g.includes(a)){g.push(a);}if(!g.includes(b)){g.push(b)}fam.set(a.id,g);fam.set(b.id,g);return g};
  for(const a of pool){if(grp(a)||r()>.5)continue;const c=pool.find(b=>b!==a&&!grp(b)&&b.sp===a.sp&&Math.abs(b.age-a.age)<=12&&(b.sex!==a.sex||r()<.12)&&b.job!==a.job);
   if(c){join(a,c);addRel(a,c,'conyuge',55+Math.floor(r()*35),{pub:1});setSurname(c,surnameOf(a)||surnameOf(c))}}
  for(const a of pool){if(a.age<40||r()>.32)continue;const c=pool.find(b=>b!==a&&!grp(b)&&b.sp===a.sp&&b.age<=a.age-17&&b.age>=18);
   if(c){const g=join(a,c);addRel(a,c,'padre',45+Math.floor(r()*40),{pub:1});setSurname(c,surnameOf(a)||surnameOf(c));c.age=Math.max(18,Math.min(c.age,a.age-18))}}
  for(const a of pool){if(grp(a)||r()>.28)continue;const c=pool.find(b=>b!==a&&!grp(b)&&b.sp===a.sp&&Math.abs(b.age-a.age)<=9);if(c){join(a,c);addRel(a,c,'hermano',30+Math.floor(r()*45),{pub:1});setSurname(c,surnameOf(a)||surnameOf(c))}}
  // hogares
  const done=new Set();
  for(const n of arr){if(n.handmade){continue}if(done.has(n.id)||n.rank==='aprendiz')continue;
   const g=grp(n)||[n];const lead=g.find(x=>x.work&&RESIDENTIAL.includes((zoneBuildings(zid).find(b=>b.id===x.work)||{}).kind))||g[0];
   const h=chooseHome(lead,all,zid);g.forEach(x=>{x.home=h;done.add(x.id);if(x.workHome)x.work=h})}
  for(const n of arr){if(n.rank==='aprendiz'){const m=all.find(x=>x.id===n.master);n.home=m&&m.home?m.home:chooseHome(n,all,zid);if(n.workHome&&m)n.work=m.work}}
  for(const n of arr){if(n.handmade&&!n.home){n.home=chooseHome(n,all,zid)}}
 }
 // viajeros: sin hogar, con historia
 makeTravelers(all,r);
 all.forEach(n=>{n.sched=n.traveler?[]:genSchedule(n,r);n.bio=n.bio||makeBackstory(n,r)});
 // relaciones
 buildRelations(all,r);
 all.forEach(n=>assignSecret(n,r,all));
 all.forEach(n=>{n.fav=null});assignInns(all,r);
 const o={};all.forEach(n=>o[n.id]=n);return o}

// ----- relaciones: trabajo, vecindad, amistad, rivalidad, amor, deudas, lazos entre zonas -----
function buildRelations(all,r){const byZ={};all.forEach(n=>{if(!n.traveler)(byZ[n.zone]=byZ[n.zone]||[]).push(n)});const A=(a,b,k,v,o)=>addRel(a,b,k,v,o);const rs=(a,b)=>a.rel[b.id];
 // normaliza relaciones escritas a mano (y las hace recíprocas)
 for(const n of all){for(const id in n.rel){const o=all.find(m=>m.id===id);const x=n.rel[id];const k=REL[x.k]?x.k:(REL_FIX[x.k]||'conocido');n.rel[id]={k,v:x.v,pub:0};if(o&&!o.rel[n.id])o.rel[n.id]={k:REL[k].inv,v:x.v,pub:0}}}
 for(const z in byZ){const arr=byZ[z];
  // oficio: maestro/aprendiz, jefe/empleado, compañeros, rivales
  for(const n of arr){if(n.rank==='aprendiz'){const m=all.find(x=>x.id===n.master);if(m)A(m,n,'aprendiz',40+Math.floor(r()*35),{pub:1})}}
  for(const a of arr)for(const b of arr){if(a.id>=b.id||rs(a,b))continue;
   if(a.work&&a.work===b.work&&!a.workHome){A(a,b,'colega',10+Math.floor(r()*35),{pub:1})}
   else if(a.job===b.job&&!a.rank&&!b.rank&&!['guardia','mendigo','sereno','estibador','marinero','monje','minero','cantero','granjero','pastor'].includes(a.job)&&r()<.7){A(a,b,'rival',-(12+Math.floor(r()*30)))}
   else if(a.home&&a.home===b.home){A(a,b,'vecino',r()*28-6,{pub:1})}}
  // jefes de posada/tienda y su personal
  for(const j of ['posadero','tendero','boticario','herrero','panadero']){for(const boss of arr.filter(x=>x.job===j&&x.work)){for(const e of arr.filter(x=>x.work===boss.work&&x!==boss&&['cocinero','camarero','cervecero','criado','aprendiz'].includes(x.job)||x.work===boss.work&&x!==boss&&x.rank==='aprendiz')){if(!rs(boss,e))A(boss,e,'empleado',15+Math.floor(r()*40),{pub:1})}}}
  // amistades por afinidad de gustos
  for(const a of arr){if(a.job==='mendigo'&&r()<.5)continue;let tries=0;const want=1+(r()<.5?1:0);let got=Object.values(a.rel).filter(x=>REL[x.k]&&REL[x.k].g==='soc'&&x.k==='amigo').length;
   while(got<want&&tries++<14){const b=pick(arr,r);if(b===a||rs(a,b))continue;const common=(a.likes||[]).filter(k=>(b.likes||[]).includes(k)).length;const clash=(a.likes||[]).some(k=>(b.dislikes||[]).includes(k));if(common>=1&&!clash&&Math.abs(a.tr.warm-b.tr.warm)<=6){A(a,b,'amigo',22+Math.floor(r()*45));got++}}}
  // enemistades con causa
  const ths=arr.filter(x=>['ladron','maton','estafador','contrabandista'].includes(x.job)),vic=arr.filter(x=>['mercader','tendero','noble','posadero','boticario','herrero','sastre'].includes(x.job));
  for(const t of ths){if(r()<.8&&vic.length){const v=pick(vic,r);if(!rs(t,v))A(t,v,'enemigo',-(25+Math.floor(r()*30)));}}
  for(const g of arr.filter(x=>x.job==='guardia'||x.job==='sereno')){const t=ths.length?pick(ths,r):null;if(t&&!rs(g,t))A(g,t,'enemigo',-(20+Math.floor(r()*35)))}
  // prestamista y deudores (la deuda de La Sombra no es sólo un secreto)
  for(const u of arr.filter(x=>x.job==='usurero')){const ds=arr.filter(x=>x!==u&&(x.sec==='deuda_sombra'||(x.tr.greed>=7&&x.gold<60)||r()<.12));ds.slice(0,3).forEach(d=>{if(!rs(u,d))A(u,d,'acreedor',-(10+Math.floor(r()*30)))})}
  // parejas
  const singles=arr.filter(x=>!Object.values(x.rel).some(y=>y.k==='conyuge')&&x.age<70&&!['mendigo'].includes(x.job));
  for(let i=0;i<Math.min(2,Math.floor(singles.length/10)+1);i++){const a=pick(singles,r),b=pick(singles,r);if(a&&b&&a!==b&&!rs(a,b)&&Math.abs(a.age-b.age)<=14&&(a.orient==='any'||a.orient===b.sex)&&(b.orient==='any'||b.orient===a.sex)){A(a,b,r()<.5?'amante':'enamorado',45+Math.floor(r()*40));}}
  // todos conocen a alguien: conocidos
  for(const a of arr){if(Object.keys(a.rel).length>=2)continue;for(let k=0;k<2;k++){const b=pick(arr,r);if(b!==a&&!rs(a,b))A(a,b,'conocido',2+Math.floor(r()*22))}}
 }
 // lazos entre zonas: hermanos, amigos y socios lejanos
 const zs=Object.keys(byZ);for(let i=0;i<9;i++){const za=pick(zs,r),zb=pick(zs,r);if(za===zb)continue;const a=pick(byZ[za],r),b=pick(byZ[zb],r);if(!a||!b||rs(a,b))continue;const k=r()<.35?'hermano':r()<.5?'amigo':r()<.5?'primo':'socio';A(a,b,k,25+Math.floor(r()*45));if(k==='hermano'||k==='primo'){setSurname(b,surnameOf(a)||surnameOf(b));b.age=Math.min(b.age,a.age+8)}}
 // los lazos de familia son públicos
 for(const n of all)for(const id in n.rel){const x=n.rel[id];if(REL[x.k]&&(REL[x.k].g==='fam'))x.pub=1}}

// ----- tabernas favoritas -----
function assignInns(all,r){for(const n of all){if(n.traveler)continue;const z=getZone(n.zone);const inns=z.buildings.filter(b=>b.kind==='inn');if(!inns.length)continue;
  // sigue a su familia/amistades si ya tienen
  let f=null;for(const id in n.rel){const o=all.find(m=>m.id===id);const x=n.rel[id];if(o&&o.fav&&x.v>=30&&r()<.75){f=o.fav;break}}
  if(!f){const wb=n.work&&inns.find(b=>b.id===n.work);f=wb?wb.id:inns[Math.floor(r()*inns.length)].id}
  if(f){const foes=Object.keys(n.rel).filter(i=>n.rel[i].v<=-40).map(i=>all.find(m=>m.id===i)).filter(o=>o&&o.fav===f);if(foes.length&&inns.length>1){const alt=inns.filter(b=>b.id!==f);f=alt[Math.floor(r()*alt.length)].id}}
  n.fav=f}}

// ----- viajeros: sin hogar fijo, con su porqué -----
const ORIGINS_FAR=['Tarraco','Girona','Lleida','Tortosa','Perpinyà','las tierras del Ebre','Tolosa','Zaragoza','Valencia','las montañas de Andorra'];
function makeTravelers(all,r){const defs=[['viajero'],['viajero'],['viajero'],['viajero'],['mercader'],['juglar'],['viajero'],['mercader']];
 const world=all.filter(n=>!n.traveler);const nob=world.find(n=>n.job==='concejal')||world[0];
 const WHY=[
  {k:'peregrino',t:'va camino de la Santa Cova de Montserrat para cumplir una promesa hecha a su esposa difunta.',route:['montserrat']},
  {k:'cobrador',t:'persigue a un deudor que huyó hacia esta comarca con el dinero de un gremio.',route:['barcino','martorell']},
  {k:'fugitivo',t:'huye de la justicia de otro vizcondado y busca un lugar donde nadie lo conozca.',route:['collserola','pas_molins','cornisa']},
  {k:'mensajero',t:'lleva una carta sellada para un alto cargo de la comarca y no debe abrirla.',route:['barcino'],target:nob},
  {k:'hermano',t:'busca a un pariente desaparecido hace años que, según rumores, vive en la comarca.',route:['martorell','collbato','barcino'],target:'rnd'},
  {k:'tesoro',t:'sigue un mapa de tesoro comprado a un tal «embaucador» y no quiere admitir que seguramente es falso.',route:['collbato','cam_collbato','garraf']},
  {k:'cronista',t:'recopila leyendas de la comarca para un libro que quizá nunca termine.',route:['barcino','collserola','montserrat']},
  {k:'herbolario',t:'busca una orquídea que solo crece en las laderas de Montserrat para curar a alguien.',route:['collbato','montserrat','ascenso']},
  {k:'feria',t:'sigue la ruta de las fiestas mayores de pueblo en pueblo.',route:['martorell','barcino','garraf']},
  {k:'desertor',t:'desertó de una compañía de mercenarios y evita los caminos principales.',route:['pas_molins','marjal','vega']}];
 defs.forEach((d,i)=>{const sp=pickSpecies('barcino',r);const sex=r()<.5?'m':'f';const spec={id:'t_'+i,nm:genName(sp,sex,r),sp,sex,job:d[0],zone:ZIDS[i%ZIDS.length]};const n=buildNPC(spec,r);n.traveler=1;n.home=null;n.work=null;n.stay=1+Math.floor(r()*4);
  const w=WHY[i%WHY.length];n.why={k:w.k,t:w.t};n.route=w.route.slice();n.origin=pick(ORIGINS_FAR,r);
  if(w.target==='rnd'){const t=pick(world.filter(x=>x.zone===w.route[0]||true),r);n.why.target=t.id;n.why.t='busca a '+t.name+', '+(t.sex==='f'?'su hermana':'su hermano')+', a quien no ve desde hace años.';n.rel[t.id]={k:'busca',v:30,pub:0}}
  else if(w.target){n.why.target=w.target.id;n.why.t=w.t.replace('un alto cargo de la comarca',w.target.name)}
  n.gold+=60;invAdd(n.inv,pick(['cristal','orquidea','escama','amuleto_tacto','anillo_sombra','manto_fino','orbe','pocion_gran'],r),1,3);invAdd(n.inv,pick(['espada_larga','arco_largo','diadema','escudo','laud'],r),1,2);all.push(n)})}

// historia más ligada al oficio
const HOWJOB=['aprendió el oficio de su padre','llegó al oficio por pura necesidad','lo eligió por vocación','heredó el taller de un tío','pasó siete años de aprendiz antes de tener oficio propio','cambió de vida tras una mala racha','lo aprendió de una abuela que no soltaba prenda','empezó ayudando a un vecino y ya no lo dejó'];
