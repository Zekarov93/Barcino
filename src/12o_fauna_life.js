// ===================== VIDA DE LAS CRIATURAS: individuos, manadas, territorios y ecología =====================
// Cada animal tiene sexo, genes, temperamento, etapa de vida, manada y rol social. Todo es coherente con su especie.
const SOCIAL={
 lobo:{k:'pack',min:3,max:7,terr:13,alpha:'m',noun:'Manada'},trasgo:{k:'pack',min:3,max:6,terr:9,alpha:'m',noun:'Banda'},
 jabali:{k:'herd',min:3,max:6,terr:10,alpha:'f',noun:'Piara'},cabra:{k:'herd',min:4,max:10,terr:12,alpha:'f',noun:'Rebaño'},ciervo:{k:'herd',min:3,max:6,terr:12,alpha:'f',noun:'Rebaño'},
 conejo:{k:'colony',min:5,max:14,terr:6,noun:'Colonia'},rata:{k:'colony',min:5,max:12,terr:7,noun:'Colonia'},murcielago:{k:'colony',min:4,max:10,terr:6,noun:'Colonia'},cangrejo:{k:'colony',min:4,max:9,terr:5,noun:'Colonia'},
 cuervo:{k:'flock',min:4,max:9,terr:14,noun:'Bandada'},gaviota:{k:'flock',min:5,max:10,terr:14,noun:'Bandada'},
 tejon:{k:'clan',min:2,max:5,terr:7,alpha:'f',noun:'Clan'},zorro:{k:'pair',terr:10,noun:'Pareja'},aguila:{k:'pair',terr:16,noun:'Pareja'},
 lince:{k:'solo',terr:14},oso:{k:'solo',terr:12,hib:1},vibora:{k:'solo',terr:5,hib:1},ogro:{k:'solo',terr:10},vibria:{k:'solo',terr:30},gato:{k:'solo',terr:8}};
SOCIAL.tejon.hib=1;
const DIMORPH={lobo:1.12,jabali:1.15,ciervo:1.1,cabra:1.15,oso:1.12,ogro:1.1,trasgo:1.05,lince:1.08,aguila:.9,vibria:1};
const ST_N=['Cría','Joven','Adulto','Veterano','Anciano'];
const PK_PLACE=['del Torrent','de la Penya','de l\'Aliga','de les Roques','del Pi Gros','de la Font','del Collet','de la Serra','del Barranc','de la Rovira','del Bosc Fosc','de les Cingles'];
const INDIV_NAMES={lobo:['Ombra','Garra','Llamp','Cendra','Roc','Fang','Boira','Tramuntana','Vent','Fosc','Nit','Argent'],jabali:['Sanglar','Bufa','Rovell','Terrós','Gruny','Fanga'],ciervo:['Banyut','Fulla','Cérvola','Rama','Esquerp'],oso:['Brau','Pesat','Rebombori','Ós Vell','Mel'],
 trasgo:['Grinyol','Pelut','Xerric','Cruix','Nyic','Mussol','Tort'],lince:['Taca','Orelles','Silenci','Ull-Groc'],cabra:['Banyes','Cingle','Esquerra','Salta'],ogro:['Trencarrocs','Gran Panxa','Cavernós'],vibria:['La Víbria']};
const DEF_NAMES=['Xic','Bru','Roig','Tros','Cua-curta','Orella','Cicatriu','Moreno','Esquerp','Llarg','Pelat','Moix'];
const SCAV=['buitre','cuervo','zorro','rata','lobo','oso','tejon','gineta'];
const SEEDERS=['ciervo','jabali','zorro','cuervo','tejon','oso','gineta'];
function socOf(sp){return SOCIAL[sp]||{k:'solo',terr:8}}
function fem(w,sex){return sex==='f'?w.replace(/o$/,'a').replace(/or$/,'ora'):w}
function stageOf(a){const C=CREAT[a.sp];if(!C)return 2;const m=C.mat,l=C.life;if(a.age<m*.35)return 0;if(a.age<m)return 1;if(a.age<l*.55)return 2;if(a.age<l*.8)return 3;return 4}
function stageName(a){const s=a.stg!=null?a.stg:stageOf(a);return fem(ST_N[s],a.sex)}
function temperTag(a){const g=a.gn,C=CREAT[a.sp];let t='Sereno';
 if(g.agr>.72&&C.diet!=='herb')t=C.monster?'Feroz':'Pendenciero';else if(g.bold<.22)t='Tímido';else if(g.bold>.78)t='Audaz';else if(g.cur>.72)t='Curioso';else if(g.doc>.7)t='Manso';else if(g.soc>.82)t='Sociable';else if(g.cur>.55&&g.bold<.5&&C.diet==='carn')t='Astuto';else if(g.agr>.6&&socOf(a.sp).k==='solo')t='Territorial';
 return fem(t,a.sex)}
function ensureCr(a){if(a.pv===1)return a;const C=CREAT[a.sp];if(!C){a.pv=1;return a}const g=a.gn,r=Math.random,S=socOf(a.sp);
 const base=clamp(C.aggro*(C.monster?1.05:1),0,1);
 if(g.agr==null)g.agr=clamp(base+(r()-.5)*.35,0,1);
 if(g.cur==null)g.cur=clamp((C.diet==='herb'?.35:.55)+(r()-.5)*.5,0,1);
 if(g.soc==null)g.soc=clamp(S.k!=='solo'?.65+(r()-.5)*.4:.25+(r()-.5)*.3,0,1);
 if(g.doc==null)g.doc=clamp((1-base)*.6+(C.dom?.35:0)+(r()-.5)*.35-(C.monster?.3:0),0,1);
 g.bold=clamp(g.bold*.6+g.agr*.4,0,1);
 a.pv=1;a.stg=stageOf(a);a.tag=temperTag(a);a.ob=a.ob||0;refreshCr(a,true);return a}
function refreshCr(a,first){const C=CREAT[a.sp];if(!C)return;const s=stageOf(a);const prev=a.stg;a.stg=s;
 if(prev!==s||first){a.tag=temperTag(a)}
 const vsF=[.55,.8,1,1.04,.96][s]*(a.sex==='m'?(DIMORPH[a.sp]||1):1);a.vs=vsF*(1+(a.gn.size-1)*.0);
 const hpF=[.35,.7,1,1.05,.8][s]*(a.sex==='m'?(DIMORPH[a.sp]||1):1);const nmax=Math.max(1,Math.round(C.hp*a.gn.size*a.gn.hard*hpF));const ratio=a.maxHp>0?a.hp/a.maxHp:1;a.maxHp=nmax;a.hp=Math.max(1,Math.min(nmax,Math.round(nmax*ratio)));
 if(s===0)a.lull=Math.max(a.lull||0,G.t+1440*2);
 // veteranos y jefes reciben nombre
 if(!a.name&&!C.unique&&(s>=3||a.role==='alfa')&&socOf(a.sp).k!=='colony'&&C.sz>=.5){const pool=INDIV_NAMES[a.sp]||DEF_NAMES;a.name=pick(pool)}}
// ---------- nacimientos: genes de ambos progenitores ----------
const _newAnimal=newAnimal;
newAnimal=function(sp,zone,r,age,sex,parent){const k=_newAnimal(sp,zone,r,age,sex,parent);const C=CREAT[sp];if(!C)return k;
 if(parent){const dad=fatherOf(parent);k.mom=parent.id;if(dad)k.dad=dad.id;k.pack=parent.pack||null;k.role='cria';k.home=parent.home;
  const mix=(key,def)=>{const m=parent.gn[key]!=null?parent.gn[key]:def,d=dad&&dad.gn[key]!=null?dad.gn[key]:m;return clamp((m+d)/2+(Math.random()-.5)*.18,0,1)};
  k.gn.agr=mix('agr',C.aggro);k.gn.cur=mix('cur',.5);k.gn.soc=mix('soc',.5);k.gn.doc=mix('doc',.4);if(dad){k.gn.size=clamp((k.gn.size+dad.gn.size)/2,.75,1.3);k.gn.coat=clamp((k.gn.coat+dad.gn.coat)/2,0,1)}
  // domesticación por cría selectiva: los hijos de animales adiestrados nacen más dóciles
  if(parent.tamed||(dad&&dad.tamed))k.gn.doc=clamp(k.gn.doc+.12,0,1);
  k.pv=1;k.stg=0;k.tag=temperTag(k);k.ob=0;refreshCr(k,true)}
 return k};
function fatherOf(m){const arr=G.fauna[m.zone]||[];if(m.mate){const f=arr.find(x=>x.id===m.mate&&x.alive);if(f)return f}
 const pk=m.pack&&G.packs&&G.packs[m.pack];if(pk&&pk.leader){const f=arr.find(x=>x.id===pk.leader&&x.alive&&x.sex==='m');if(f)return f}
 const c=arr.filter(x=>x.alive&&!x.e&&x.sp===m.sp&&x.sex==='m'&&x.age>=CREAT[m.sp].mat);return c.length?pick(c):null}
// ---------- manadas ----------
function packsOf(){G.packs=G.packs||{};return G.packs}
function newPack(sp,z,home){const S=socOf(sp);const id='pk'+(G.eid++);const pk={id,sp,zone:z,name:(S.noun||'Grupo')+' '+pick(PK_PLACE),home:{x:home.x,y:home.y},r:S.terr||8,leader:null,matron:null,formed:G.t,k:S.k};packsOf()[id]=pk;return pk}
function homeTile(z){const r=Math.random;const zn=getZone(z);return randFreeTile(zn,r)}
function powerOf(a){const s=a.stg!=null?a.stg:2;return a.gn.size*a.gn.hard*([.3,.6,1,1.05,.7][s])+a.gn.bold*.3+a.hp/Math.max(1,a.maxHp)*.2+Math.random()*.12}
function electLeaders(pk,mem,z){const S=socOf(pk.sp);const live=mem.filter(m=>m.alive&&!m.e);if(!live.length)return;
 const ad=live.filter(m=>m.stg>=2);const pool=ad.length?ad:live;const old={l:pk.leader,m:pk.matron};
 const best=(arr)=>arr.sort((a,b)=>powerOf(b)-powerOf(a))[0];
 const cur=id=>live.find(m=>m.id===id&&m.stg>=2);
 let ldr=pk.leader?cur(pk.leader):null,mat=pk.matron?cur(pk.matron):null;
 if(S.k==='pack'||S.k==='pair'){
  if(!ldr){const males=pool.filter(m=>m.sex==='m');ldr=males.length?best(males):null;
   if(ldr&&old.l&&males.length>1){const sorted=males.slice().sort((a,b)=>powerOf(b)-powerOf(a));if(sorted[1]&&powerOf(sorted[0])-powerOf(sorted[1])<.2&&S.k==='pack'){const loser=sorted[1];loser.hp=Math.max(1,Math.round(loser.hp*.5));if(Math.random()<.18){loser.alive=false;}else if(Math.random()<.5){loser.pack=null;loser.disp=1;loser.role='solitario'}
     if(z===G.zone||Math.random()<.3)addGossip(z,'Los cazadores hablan de una pelea a muerte por el liderazgo de una '+(S.noun||'manada').toLowerCase()+' de '+CREAT[pk.sp].n.toLowerCase()+'s '+pk.name.split(' ').slice(1).join(' ')+'.',null)}}}
  if(!mat){const fem_=pool.filter(m=>m.sex==='f');mat=fem_.length?best(fem_):null}
 }else if(S.k==='herd'||S.k==='clan'){if(!ldr||ldr.sex!=='f'){const f=pool.filter(m=>m.sex==='f');ldr=f.length?best(f.sort((a,b)=>b.age-a.age).slice(0,3)):best(pool)}mat=ldr}
 else{ldr=ldr||best(pool);mat=null}
 pk.leader=ldr?ldr.id:null;pk.matron=mat?mat.id:null;
 for(const m of live){m.role=(m===ldr||m===mat)?'alfa':m.stg===0?'cria':m.stg===1?'joven':'subordinado';if(m===ldr||m===mat)refreshCr(m)}
 if(ldr&&ldr.id!==old.l&&old.l&&(z===G.zone||Math.random()<.25)&&ldr.name)addGossip(z,ldr.name+' lidera ahora una '+(S.noun||'manada').toLowerCase()+' de '+CREAT[pk.sp].n.toLowerCase()+'s '+pk.name.split(' ').slice(1).join(' ')+'.',null)}
function formPacks(z){const arr=G.fauna[z];const PK=packsOf();
 for(const sp of new Set(arr.map(a=>a.sp))){const S=socOf(sp);const C=CREAT[sp];if(!C||C.dom)continue;const all=arr.filter(a=>a.sp===sp&&a.alive&&!a.e);
  for(const a of all)ensureCr(a);
  if(S.k==='solo'){for(const a of all){if(!a.home){a.home=homeTile(z)}a.pack=null}continue}
  // limpiar packs muertos
  for(const a of all){if(a.pack&&(!PK[a.pack]||PK[a.pack].zone!==z))a.pack=null}
  let free=all.filter(a=>!a.pack&&!a.disp&&(a.stg>=1||!a.mom));
  // crías huérfanas sin madre viva: se unen a la manada de los hermanos
  while(free.length){const seed=free.sort((x,y)=>y.age-x.age)[0];const max=S.k==='pair'?2:(S.max||6);const pk=newPack(sp,z,{x:seed.x,y:seed.y});
   const grp=[seed];free=free.filter(x=>x!==seed);free.sort((p,q)=>Math.hypot(p.x-seed.x,p.y-seed.y)-Math.hypot(q.x-seed.x,q.y-seed.y));
   const want=S.k==='pair'?2:Math.min(max,(S.min||2)+Math.floor(Math.random()*((max-(S.min||2))+1)));
   while(free.length&&grp.length<want){const c=free[0];if(Math.hypot(c.x-seed.x,c.y-seed.y)>(S.terr||8)*2.5&&grp.length>=(S.min||2))break;grp.push(free.shift())}
   if(grp.length<2&&S.k!=='pair'){const tgt=Object.values(PK).find(p=>p.zone===z&&p.sp===sp&&p!==pk&&all.filter(x=>x.pack===p.id).length<(S.max||6));delete PK[pk.id];if(tgt){grp[0].pack=tgt.id;grp[0].home=tgt.home;grp[0].role='subordinado'}else{grp[0].pack=null;grp[0].disp=1}continue}
   grp.forEach(m=>{m.pack=pk.id});electLeaders(pk,grp,z)}}
 for(const a of arr){if(a.pack&&a.alive&&!a.e&&!a.home){const pk=PK[a.pack];if(pk)a.home=pk.home}}}
function packMaint(z){const arr=G.fauna[z];const PK=packsOf();const by={};for(const a of arr){if(a.alive&&!a.e&&a.pack){(by[a.pack]=by[a.pack]||[]).push(a)}}
 for(const id in PK){const pk=PK[id];if(pk.zone!==z)continue;const mem=by[id]||[];
  if(!mem.length){delete PK[id];continue}
  const S=socOf(pk.sp);
  if(mem.length<=1&&S.k!=='solo'){mem.forEach(m=>{m.pack=null;m.disp=1;m.role='solitario'});delete PK[id];continue}
  const lAlive=mem.some(m=>m.id===pk.leader),mAlive=!pk.matron||mem.some(m=>m.id===pk.matron);
  if(!lAlive||!mAlive||Math.random()<.01)electLeaders(pk,mem,z);
  // dispersión: jóvenes machos (y algunas hembras) se marchan al madurar
  const crowded=mem.length>(S.max||6);
  for(const m of mem){if(m.role==='alfa')continue;if(m.stg>=1&&m.age>=CREAT[pk.sp].mat*.9&&m.age<CREAT[pk.sp].mat*1.8){const p=(m.sex==='m'?.06:.025)+(crowded?.12:0);
    if(Math.random()<p){m.pack=null;m.disp=1;m.role='solitario';m.home=null;m.dispAt=G.t}}}}
 // los dispersos buscan pareja y fundan manada nueva
 for(const sp of new Set(arr.map(a=>a.sp))){const S=socOf(sp);if(S.k==='solo'||CREAT[sp].dom)continue;const ds=arr.filter(a=>a.sp===sp&&a.disp&&a.alive&&!a.e&&a.stg>=1&&!a.pack);
  const ms=ds.filter(a=>a.sex==='m'),fs=ds.filter(a=>a.sex==='f');
  if(ms.length&&fs.length&&Math.random()<.3){const m=ms[0],f=fs[0];const pk=newPack(sp,z,{x:(m.x+f.x)/2,y:(m.y+f.y)/2});[m,f].forEach(x=>{x.pack=pk.id;x.disp=0;x.home=pk.home});pk.leader=m.id;pk.matron=f.id;m.role=f.role='alfa';
   if(z===G.zone||Math.random()<.3)addGossip(z,'Una nueva '+(S.noun||'manada').toLowerCase()+' de '+CREAT[sp].n.toLowerCase()+'s se ha asentado '+pk.name.split(' ').slice(1).join(' ')+'.',null)}
  else if(ds.length&&S.k!=='pair'){ // un disperso se une a una manada pequeña
   const small=Object.values(PK).filter(p=>p.zone===z&&p.sp===sp&&(by[p.id]||[]).length<(S.max||6)-1);
   if(small.length&&Math.random()<.15){const pk=pick(small);const d=pick(ds);d.pack=pk.id;d.disp=0;d.role='subordinado';d.home=pk.home}}}
 // los solitarios de especies solitarias tienen su territorio
 for(const a of arr){if(a.alive&&!a.e&&!a.pack&&!a.home)a.home={x:a.x,y:a.y}}}
// pareja (águila, zorro): se emparejan los adultos libres
function pairUp(z){const arr=G.fauna[z];for(const sp of ['aguila','zorro']){const adults=arr.filter(a=>a.sp===sp&&a.alive&&!a.e&&a.stg>=2);for(const a of adults){if(a.mate&&!adults.some(x=>x.id===a.mate))a.mate=null}
  const sm=adults.filter(a=>a.sex==='m'&&!a.mate),sf=adults.filter(a=>a.sex==='f'&&!a.mate);const n=Math.min(sm.length,sf.length);for(let i=0;i<n;i++){sm[i].mate=sf[i].id;sf[i].mate=sm[i].id}}}
// ---------- migración entre zonas ----------
function emigrate(z){const arr=G.fauna[z];const T=TRAVEL[z]||{};const counts={};arr.forEach(a=>{if(a.alive&&!a.e)counts[a.sp]=(counts[a.sp]||0)+1});
 for(const sp in counts){const C=CREAT[sp];const cap=C.cap&&C.cap[z];if(!cap||C.dom||C.unique)continue;const over=counts[sp]/cap;
  if(over>1.05||(C.diet==='carn'&&C.prey&&arr.filter(a=>a.alive&&!a.e&&C.prey.includes(a.sp)).length<3&&counts[sp]>1)){
   const dis=arr.filter(a=>a.sp===sp&&a.alive&&!a.e&&a.disp&&a.stg>=1);if(!dis.length||Math.random()>.35)continue;
   const dests=Object.keys(T).filter(o=>G.fauna[o]&&CREAT[sp].cap&&CREAT[sp].cap[o]&&G.fauna[o].filter(a=>a.sp===sp&&a.alive&&!a.e).length<CREAT[sp].cap[o]*.8);
   if(!dests.length)continue;const dest=pick(dests);const a=pick(dis);const zn=getZone(dest);const p=randFreeTile(zn,Math.random);
   G.fauna[dest].push(a);a.zone=dest;a.x=p.x;a.y=p.y;a.tx=p.x;a.ty=p.y;a.home=null;a.pack=null;a.disp=1;a.mom=null;a.hunger=0;a.alive=true;arr.splice(arr.indexOf(a),1);
   if(dest===G.zone)log('Un '+CREAT[sp].n.toLowerCase()+' forastero ha llegado a la zona.','dim')}}}
// ---------- ecología: carroña, pastoreo, semillas, redes tróficas ----------
function ecoLinks(z,died){G.carc=G.carc||{};const arr=G.fauna[z];const zi=ZINFO[z];
 let c=G.carc[z]||0;for(const d of died){const C=CREAT[d.sp];if(C&&!C.dom&&!d.e)c+=Math.min(3,C.sz*d.gn.size*1.5)}
 const scav=arr.filter(a=>a.alive&&!a.e&&SCAV.includes(a.sp));
 if(c>0&&scav.length){const eat=Math.min(c,scav.length*.9);c-=eat;let k=eat;for(const s of scav){if(k<=0)break;if(s.hunger>0){s.hunger=Math.max(0,s.hunger-3)}k-=.9}}
 c*=.82;G.carc[z]=c<.2?0:c;
 // carroña sin carroñeros: ratas y enfermedad
 if(c>6&&!scav.some(s=>s.sp==='buitre'||s.sp==='cuervo'||s.sp==='lobo')){const s=zsGet(z);s.h=Math.max(0,s.h-.5);if(!G._carcWarn||G.t-G._carcWarn>1440*20){G._carcWarn=G.t;addGossip(z,'Hay carroña sin recoger en '+zi.n+'. Se teme una peste de ratas.',null)}
  for(const a of arr){if(a.sp==='rata'&&a.alive&&a.sex==='f'&&!a.preg&&Math.random()<.04)a.preg=3}}
 // pastoreo excesivo: los herbívoros arrasan la flora
 const herb=arr.filter(a=>a.alive&&!a.e&&CREAT[a.sp].diet==='herb'&&!CREAT[a.sp].dom);let pressure=0;for(const sp of new Set(herb.map(a=>a.sp))){const cap=(CREAT[sp].cap||{})[z]||0;const n=herb.filter(a=>a.sp===sp).length;if(cap&&n>cap*.9)pressure+=(n/cap-.9)*4}
 const fl=G.flora[z]||[];if(pressure>0&&fl.length>25){let n=Math.min(6,Math.ceil(pressure));for(let i=0;i<n;i++){const j=Math.floor(Math.random()*fl.length);const F=FLORA[fl[j].sp];if(F&&(F.k==='herb'||F.k==='fungus')){fl.splice(j,1)}}
  if(pressure>3&&(!G._grazeWarn||G.t-G._grazeWarn>1440*25)){G._grazeWarn=G.t;addGossip(z,'Los rebaños salvajes han dejado pelado el monte de '+zi.n+'. Escasea la hierba.',null)}}
 // dispersión de semillas
 if(fl.length<420){const bi=getZone(z).biome;const cand=Object.keys(FLORA).filter(k=>FLORA[k].bi&&FLORA[k].bi.indexOf(bi)>=0&&(FLORA[k].k==='tree'||FLORA[k].k==='herb'||FLORA[k].k==='fungus'));
  for(const a of arr){if(a.alive&&!a.e&&SEEDERS.includes(a.sp)&&cand.length&&Math.random()<.05){const sp=pick(cand);fl.push({id:'f'+(G.eid++),sp,x:a.x,y:a.y,age:0,hv:0,ap:0,v:Math.floor(Math.random()*3)})}}}
 // incursiones de lobos al redil
 const hungry=arr.filter(a=>a.alive&&!a.e&&(a.sp==='lobo'||a.sp==='zorro')&&a.hunger>10&&a.stg>=2);
 if(hungry.length&&Math.random()<.35&&G.built&&G.built[z]){const pens=G.built[z].filter(b=>b.t==='corral'&&b.an&&b.an.length);
  if(pens.length){const b=pick(pens);const lost=b.an.pop();hungry[0].hunger=0;G.stats.raids=(G.stats.raids||0)+1;
   log('¡Un '+CREAT[hungry[0].sp].n.toLowerCase()+' ha entrado en tu corral! Pierdes '+(CREAT[lost.sp]?CREAT[lost.sp].n.toLowerCase():'un animal')+'.','bad');if(typeof toast==='function')toast('Ataque al corral','bad')}
  else if(Math.random()<.4){const n=Object.values(G.npcs).find(x=>x.alive&&x.zone===z&&x.job==='granjero');if(n&&Math.random()<.5){addGossip(z,'Han atacado el redil de '+n.name+': '+(hungry[0].sp==='lobo'?'lobos':'un zorro')+' otra vez.',n);n.mood=Math.max(0,(n.mood||50)-6)}}}
 // hibernación
 const mon=dateOf(G.t).m;const winter=mon===11||mon===0||mon===1;for(const a of arr){const S=socOf(a.sp);a.hib=!!(S.hib&&winter&&a.alive&&!a.e&&a.stg>=1);if(a.hib)a.lull=Math.max(a.lull||0,G.t+1440)}}
// ---------- tick diario ----------
const _ecoDay=ecoDay;
ecoDay=function(){const snap={};for(const z of ZIDS)snap[z]=(G.fauna[z]||[]).filter(a=>a.alive&&!a.e);
 // antes: poner al día a los individuos antiguos
 for(const z of ZIDS)for(const a of G.fauna[z])if(a.pv!==1)ensureCr(a);
 _ecoDay();
 for(const z of ZIDS){try{
  const arr=G.fauna[z];const died=snap[z].filter(a=>!a.alive||!arr.includes(a));
  // muertes notables
  for(const d of died){if(d.alive===false&&d.name&&d.role==='alfa'&&!CREAT[d.sp].unique&&(z===G.zone||Math.random()<.4)){addGossip(z,d.name+', '+(d.sex==='f'?'la ':'el ')+CREAT[d.sp].n.toLowerCase()+' '+(d.sex==='f'?'veterana':'veterano')+' que lideraba su grupo, ha muerto.',null)}
   if(!d.alive&&d.pack&&packsOf()[d.pack]){/* sucesión en packMaint */}}
  for(const a of arr){if(a.alive&&!a.e){ensureCr(a);if(a.age%5===0||a.stg===undefined)refreshCr(a)}}
  // reglas de cría: sólo se reproducen quienes les toca por su especie
  const S_=new Set();for(const a of arr){if(!a.alive||a.e||a.sex!=='f'||!a.preg||a.preg!==CREAT[a.sp].gest+1||CREAT[a.sp].dom)continue;const S=socOf(a.sp);let ok=true;
   if(S.k==='pack'){const pk=a.pack&&packsOf()[a.pack];ok=!pk||pk.matron===a.id||!pk.matron||a.role==='alfa'}
   else if(S.k==='pair'){ok=!!a.mate}
   if(!ok)a.preg=0}
  formPacks(z);packMaint(z);pairUp(z);emigrate(z);ecoLinks(z,died);
 }catch(e){console.error('ecoFauna',z,e)}}};
// ---------- movimiento social: cohesión, territorio, hibernación ----------
const _faunaTick=faunaTick;let _ftAcc=0;
faunaTick=function(dt){_faunaTick(dt);_ftAcc+=dt;if(_ftAcc<.45)return;_ftAcc=0;
 const arr=G.fauna[G.zone]||[];if(!arr.length)return;const z=getZone(G.zone);const map=new Map();arr.forEach(a=>map.set(a.id,a));const PK=G.packs||{};
 for(const a of arr){if(!a.alive||a.e)continue;if(a.pv!==1)ensureCr(a);
  if(a.hib){if(a.run===1||!a.stalk){a.tx=a.x;a.ty=a.y;a.wait=3}continue}
  if(a.run!==1||a.stalk>0||a.tame)continue;
  let ax=null,ay=null,lim=0;const S=socOf(a.sp);
  if(a.stg===0&&a.mom){const m=map.get(a.mom);if(m&&m.alive){ax=m.x;ay=m.y;lim=2.2}}
  if(ax==null&&a.mate&&a.stg>=2){const m=map.get(a.mate);if(m&&m.alive&&a.sex==='f'){ax=m.x;ay=m.y;lim=4}}
  if(ax==null&&a.pack){const pk=PK[a.pack];if(pk){const L=pk.leader&&pk.leader!==a.id?map.get(pk.leader):null;if(L&&L.alive){ax=L.x;ay=L.y;lim=S.k==='flock'?9:S.k==='colony'?4:5}else if(pk.home){ax=pk.home.x;ay=pk.home.y;lim=pk.r||8}}}
  if(ax==null&&a.home){ax=a.home.x;ay=a.home.y;lim=(S.terr||8)*(a.disp?3:1)}
  if(ax==null)continue;
  if(Math.hypot(a.x-ax,a.y-ay)>lim){a.tx=clamp(ax+(Math.random()-.5)*lim*.7,1,z.cols-1);a.ty=clamp(ay+(Math.random()-.5)*lim*.7,1,z.rows-1);a.wait=1+Math.random()*2}}};
// ---------- combate: etapa, rol y temperamento ----------
const _animalCombatant=animalCombatant;
animalCombatant=function(a){ensureCr(a);const e=_animalCombatant(a);const C=CREAT[a.sp];const s=a.stg;
 e.atk=Math.max(0,e.atk+[-3,-1,0,0,-1][s]+(a.role==='alfa'?1:0));e.ac=e.ac+(s===0?-2:0);e.xp=Math.round(e.xp*[.35,.7,1,1.15,.8][s]*(a.role==='alfa'?1.25:1));
 if(s===0)e.flee=Math.max(e.flee||0,.8);if(a.gn.bold<.25)e.flee=Math.max(e.flee||0,.5);if(a.gn.bold>.8)e.flee=Math.min(e.flee||0,.1);
 const nm=a.name?a.name+', ':'';e.name=nm+(s===0?(a.sex==='f'?'cría de ':'cría de ')+C.n.toLowerCase():(C.n+(a.sex==='f'?' (hembra)':' (macho)')))+(s>=3?' '+stageName(a).toLowerCase():'');e.tag=a.tag;return e};
// ---------- ficha de criatura: observar, conocer y (más adelante) tratar ----------
function crKn(sp){G.bst=G.bst||{};return G.bst[sp]=G.bst[sp]||{seen:0,obs:0,k:0}}
function crStatus(a){const C=CREAT[a.sp];const m=[];if(a.hib)m.push('hibernando');else if(a.hunger>12)m.push('hambrienta'.replace('a',a.sex==='f'?'a':'o').replace(/hambrient[ao]/,a.sex==='f'?'hambrienta':'hambriento'));if(a.preg)m.push(a.sex==='f'?'gestante':'');if(a.sick)m.push('enferma'.replace('a',a.sex==='f'?'a':'o'));if(a.hp<a.maxHp*.5)m.push('herid'+(a.sex==='f'?'a':'o'));return m.filter(Boolean)}
function creatureCard(a){ensureCr(a);const C=CREAT[a.sp];const K=crKn(a.sp);const hasSk=skillMod('animal')+skillMod('nature');
 return modal((a.name?a.name+' · ':'')+C.n,(b,bg)=>{
  const lvl=a.ob||0;const pk=a.pack&&G.packs&&G.packs[a.pack];
  b.append(h('div',{class:'ccard'},
   h('div',{},h('b',{},'Sexo: '),a.sex==='f'?'hembra':'macho',' · ',h('b',{},'Edad: '),stageName(a)),
   h('div',{},h('b',{},'Estado: '),crStatus(a).join(', ')||'tranquil'+(a.sex==='f'?'a':'o')),
   lvl>=1?h('div',{},h('b',{},'Carácter: '),a.tag+(a.role==='alfa'?' · jefe del grupo'.replace('jefe',a.sex==='f'?'jefa':'jefe'):'')):h('div',{class:'dim'},'Carácter: «sin averiguar» (obsérvala con atención)'),
   lvl>=1&&pk?h('div',{},h('b',{},'Grupo: '),pk.name+' ('+(G.fauna[a.zone].filter(x=>x.pack===pk.id&&x.alive&&!x.e).length)+' individuos)'):(lvl>=1&&socOf(a.sp).k!=='solo'?h('div',{},h('b',{},'Grupo: '),a.disp?'solitari'+(a.sex==='f'?'a':'o')+' en dispersión':'sin grupo'):null),
   lvl>=2?h('div',{},h('b',{},'Complexión: '),(a.gn.size>1.1?'grande':a.gn.size<.9?'pequeña':'media')+' · '+(a.gn.hard>1.15?'robusta':a.gn.hard<.85?'frágil':'normal')+' · '+(a.gn.spd>1.1?'veloz':a.gn.spd<.9?'lenta':'ágil')):null,
   lvl>=2?h('div',{},h('b',{},'Hábitos: '),(C.diet==='carn'?'carnívoro':C.diet==='herb'?'herbívoro':'omnívoro')+(socOf(a.sp).hib?' · hiberna en invierno':'')+(C.fly?' · vuela':'')+(C.prey?' · caza '+C.prey.slice(0,3).map(s=>CREAT[s]?CREAT[s].n.toLowerCase():s).join(', '):'')):null,
   lvl>=3?h('div',{},h('b',{},'Dócil: '),Math.round(a.gn.doc*100)+'% · ',h('b',{},'Audaz: '),Math.round(a.gn.bold*100)+'% · ',h('b',{},'Curios'+(a.sex==='f'?'a':'o')+': '),Math.round(a.gn.cur*100)+'%'):null));
  const btns=h('div',{class:'btns'});
  btns.append(h('button',{class:'btn',onclick:()=>{const dc=10+(lvl>=1?3:0)+(lvl>=2?3:0);const r=check('animal',dc,{label:'Observar a '+C.n});closeModal(bg);advance(10);
    if(r.ok){a.ob=Math.min(3,lvl+1);K.obs++;K.k=Math.max(K.k,Math.min(3,1+Math.floor(K.obs/3)));gainXp(5+lvl*5);log('Observas con paciencia a '+(a.name||'la criatura')+' ('+C.n.toLowerCase()+'): '+(a.ob===1?'su carácter es '+a.tag.toLowerCase()+'.':a.ob===2?'conoces su complexión y hábitos.':'la entiendes por completo.'),'lore')}else log('Se da cuenta de que la miras y se aparta: no averiguas nada nuevo.','dim');
    setTimeout(()=>creatureCard(a),50)}},'Observar con atención'+(lvl<3?' [Trato con animales CD '+(10+(lvl>=1?3:0)+(lvl>=2?3:0))+']':' (ya la conoces)')));
  if(typeof crExtraOpts==='function')crExtraOpts(a,btns,bg);
  btns.append(h('button',{class:'btn warn',onclick:()=>{closeModal(bg);startCombat([animalCombatant(a)],{})}},'Atacar'),h('button',{class:'btn',onclick:()=>closeModal(bg)},'Dejarla en paz'));b.append(btns)})}
const _doInteract=doInteract;
doInteract=function(it){if(it&&it.type==='animal'&&it.a&&it.a.alive&&!R.modal){if(Math.hypot(it.a.x-G.px,it.a.y-G.py)>1.7){setTargetPath(it.a.x,it.a.y,it);return}const K=crKn(it.a.sp);K.seen++;creatureCard(it.a);return}_doInteract(it)};
// al crear el mundo se forman ya las manadas iniciales
const _ecoInit=ecoInit;
ecoInit=function(){_ecoInit();G.packs=G.packs||{};for(const z of ZIDS){try{for(const a of G.fauna[z])ensureCr(a);formPacks(z);pairUp(z)}catch(e){console.error('ecoInit fauna',z,e)}}};
