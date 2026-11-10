// ===================== SIMULACIÓN: tiempo, clima, economía, ecosistema =====================
const ECO_ITEMS=['grano','harina','pan','cebolla','col','zanahoria','ajo','habas','manzana','higo','pera','carne_cerdo','carne_cordero','carne_conejo','carne_corzo','carne_jabali','pollo','sardina','anchoa','merluza','dorada','pulpo','trucha','huevos','leche_cabra','leche_oveja','queso_cabra','mato','miel','vino','aceite','sal','madera_pino','madera_encina','madera_castano','caliza','conglomerado','mineral','carbon','lingote','piel_oveja','piel_conejo','piel_corzo','cuero','lana','tela','cuerda','romero_h','tomillo_h','niscalo','rovellon','pocion','turron','cerveza','estofado'];
const WX_N={clear:'Despejado',cloudy:'Nublado',rain:'Lluvia',storm:'Tormenta',snow:'Nieve',hail:'Granizo',wind:'Vendaval',heat:'Calor sofocante',fog:'Niebla'};
// probabilidades por bioma y estación (0 primavera,1 verano,2 otoño,3 invierno)
const WX_P={
 coast:[{clear:40,cloudy:25,rain:20,wind:8,fog:5,storm:2},{clear:55,cloudy:12,heat:18,storm:8,wind:5,rain:2},{clear:25,cloudy:25,rain:30,storm:10,wind:8,fog:2},{clear:25,cloudy:30,rain:25,wind:15,fog:5}],
 forest:[{clear:30,cloudy:25,rain:25,fog:15,storm:5},{clear:45,cloudy:15,heat:12,storm:15,rain:8,hail:5},{clear:20,cloudy:25,rain:30,fog:20,storm:5},{clear:15,cloudy:25,snow:25,fog:15,rain:10,wind:10}],
 river:[{clear:35,cloudy:25,rain:20,fog:18,storm:2},{clear:50,cloudy:10,heat:20,storm:12,fog:3,hail:5},{clear:20,cloudy:25,rain:28,fog:22,storm:5},{clear:20,cloudy:25,rain:15,snow:10,fog:25,wind:5}],
 hills:[{clear:40,cloudy:20,rain:18,wind:12,storm:5,hail:5},{clear:50,cloudy:8,heat:22,storm:12,hail:8},{clear:25,cloudy:20,rain:25,wind:15,storm:10,hail:5},{clear:25,cloudy:25,snow:20,wind:20,rain:10}],
 mountain:[{clear:25,cloudy:25,rain:15,fog:15,snow:8,wind:10,storm:2},{clear:40,cloudy:15,storm:18,hail:12,fog:8,wind:7},{clear:15,cloudy:25,rain:20,fog:15,snow:12,wind:10,storm:3},{clear:10,cloudy:20,snow:45,wind:15,fog:10}]
};
const BASE_T={coast:[14,25,17,9],forest:[11,22,13,4],river:[13,25,15,6],hills:[12,26,15,5],mountain:[7,19,9,-2]};

function newWorld(seed){const W={t:mkT(START_YEAR,9,17,8,0),seed,zone:'barcino',px:23.5,py:30,wx:{},econ:{},fauna:{},flora:{},built:{},owned:{},fac:{},zrep:{},bounty:{},fame:0,infamy:0,logs:[],flags:{},journal:[],quests:[],npcs:null,eid:1,weeks:0,extinct:{},killed:{},lastDay:-1,lastHour:-1,stats:{kills:0,steal:0,trades:0,crafts:0,days:0},stalls:{},market:{},deeds:{},dead:{},arrests:0,lore:{},events:{},cd:{}};
 FAC_IDS.forEach(f=>W.fac[f]={st:0,rank:0});ZIDS.forEach(z=>{W.zrep[z]=0;W.bounty[z]=0;W.flora[z]=[];W.built[z]=[];W.fauna[z]=[];W.wx[z]={type:'clear',int:0,temp:15,next:0,snow:0,wet:0,wind:.2,flash:0}});return W}

// ---------- clima ----------
function wxOf(zid){return G.wx[zid]||G.wx[(G.outPos&&G.outPos.zone)||'barcino']||{type:'clear',int:0,temp:15,snow:0,wet:0,wind:.1,flash:0}}
function wxStep(z,force){const Z=ZINFO[z];const w=G.wx[z];const D=dateOf(G.t);const s=seasonOf(D.doy);const r=mulberry32(hashStr(z)+G.t*7+G.seed);
 if(!force&&G.t<w.next)return;const tbl=WX_P[Z.biome][s];const keys=Object.keys(tbl);let tot=0;keys.forEach(k=>{let p=tbl[k];if(k===w.type)p*=2.2;tot+=p});let q=r()*tot,pick_=keys[0];for(const k of keys){let p=tbl[k];if(k===w.type)p*=2.2;if((q-=p)<=0){pick_=k;break}}
 w.type=pick_;w.int=clamp(.2+r()*.8,0,1);if(['clear','fog','cloudy'].includes(w.type))w.int=clamp(w.int,.15,.9);w.next=G.t+120+Math.floor(r()*300);
 if(z==='barcino'&&w.type==='snow'&&s!==3)w.type='rain'}
function wxTemp(z){const D=dateOf(G.t);const s=seasonOf(D.doy);const b=BASE_T[ZINFO[z].biome][s];const day=Math.sin(Math.PI*((D.hf-5)/24*2-.5))*4;const w=G.wx[z];let t=b+day;
 if(w.type==='heat')t+=7;if(w.type==='snow')t-=4;if(w.type==='rain')t-=2;if(w.type==='storm')t-=3;if(w.type==='hail')t-=5;return t}
function wxTick(mins){for(const z of ZIDS){const w=G.wx[z];wxStep(z);const tt=wxTemp(z);w.temp+=(tt-w.temp)*Math.min(1,mins/90);
  if(w.type==='snow'||(w.type==='hail'&&w.temp<3))w.snow=Math.min(1,w.snow+mins/600*w.int);else w.snow=Math.max(0,w.snow-mins/(w.temp>8?240:900)*(w.temp>0?1:.1));
  if(w.type==='rain'||w.type==='storm')w.wet=Math.min(1,w.wet+mins/300*w.int);else w.wet=Math.max(0,w.wet-mins/900);
  w.wind=w.type==='wind'?.6+.4*w.int:w.type==='storm'?.4+.3*w.int:clamp(w.wind+(Math.random()-.5)*.02,.05,.35);
  if(w.type==='storm'&&Math.random()<mins/60*w.int*3){w.flash=1;if(G.zone===z)bus.emit('lightning',z)}}}
function wxName(z){const w=G.wx[z];const i=w.type==='clear'||w.type==='cloudy'||w.type==='fog'?'':w.int<.35?' leve':w.int<.7?'':' intenso';return WX_N[w.type]+i}

// ---------- economía ----------
function econInit(){for(const z of ZIDS){const E={s:{},t:{},mult:{},pop:0};ECO_ITEMS.forEach(i=>{E.s[i]=0;E.t[i]=6;E.mult[i]=1});G.econ[z]=E}
 const T0={barcino:{pan:14,sardina:10,merluza:6,pulpo:3,vino:12,tela:10,lingote:6,pocion:6,cebolla:6,col:6,carne_cerdo:6,carne_cordero:4,cuerda:8,cerveza:10,turron:8,aceite:8,sal:8,queso_cabra:8,manzana:6,higo:4},
  collserola:{madera_pino:12,madera_encina:8,carne_conejo:5,carne_corzo:3,carne_jabali:3,niscalo:5,rovellon:3,romero_h:5,tomillo_h:4,piel_conejo:4,piel_corzo:2,miel:3},
  martorell:{grano:25,harina:12,pan:10,cebolla:7,col:7,zanahoria:6,trucha:10,cuero:8,lana:8,leche_cabra:5,leche_oveja:4,huevos:8,carne_cordero:5,carne_cerdo:4,vino:8,pera:5,manzana:5},
  collbato:{mineral:14,conglomerado:12,caliza:10,carbon:10,lingote:8,queso_cabra:8,pan:8,carne_cabra:4,carne_cordero:3,lana:6,vino:6,piel_oveja:4},
  montserrat:{miel:10,mato:10,queso_cabra:6,vino:8,pan:8,romero_h:5,tomillo_h:5,turron:6},
  vega:{grano:14,cebolla:8,col:8,zanahoria:6,habas:5,huevos:8,leche_cabra:5,leche_oveja:4,pan:6,vino:6,carne_cordero:3,trucha:5},pas_molins:{pan:6,vino:8,cerveza:6,carne_cordero:4,queso_cabra:5,carne_conejo:3,lana:3},cam_collbato:{mineral:6,conglomerado:8,carbon:4,pan:4,cerveza:5,carne_cabra:3},ascenso:{pan:5,vino:5,mato:6,queso_cabra:4,cerveza:3,romero_h:4},marjal:{sardina:6,anchoa:4,sal:6,pan:4,vino:4,cerveza:4},cornisa:{pan:3,vino:4,carne_conejo:2,queso_cabra:3},
  garraf:{sardina:16,anchoa:12,merluza:6,dorada:5,pulpo:4,sal:14,vino:16,aceite:8,cuerda:8,pan:8,cebolla:5,col:4,carne_cerdo:4,cerveza:8,higo:5}};
 for(const z in T0){for(const i in T0[z]){G.econ[z].t[i]=T0[z][i];G.econ[z].s[i]=Math.round(T0[z][i]*(.7+Math.random()*.7))}}
 for(const z of ZIDS)G.econ[z].pop=Object.values(G.npcs).filter(n=>n.zone===z&&!n.traveler).length}
function stockOf(z,i){return G.econ[z]?G.econ[z].s[i]||0:0}
function scarcity(z,i){const E=G.econ[z];if(!E)return 1;const t=Math.max(2,E.t[i]||4),s=(E.s[i]||0);return clamp(Math.sqrt(t/(s+1)),.45,3.2)}
function qMult(q){return QMULT[clamp(q||0,0,4)]}
function festMult(z,i){const f=festAt(G.t);return f&&f.goods&&f.goods.includes(i)?1.35:1}
function priceBase(z,id,q){const I=ITEMS[id];if(!I)return 1;let v=I.v*qMult(q);if(ECO_ITEMS.includes(id)&&z)v*=scarcity(z,id)*festMult(z,id);return v}
// el jugador compra (mult de margen) o vende
function buyPrice(z,id,q,shopFac){let p=priceBase(z,id,q)*1.18;p*=1-chaDiscount()-facDisc(shopFac,true);return Math.max(1,Math.round(p))}
function sellPrice(z,id,q,shopFac){let p=priceBase(z,id,q)*.55;p*=1+chaDiscount()*.8+facDisc(shopFac,false);return Math.max(1,Math.round(p))}
function chaDiscount(){return clamp(abMod('cha')*.02+(G.pc.skills.persu?pbOf(G.pc.level)*.01:0),-.12,.15)}
function facDisc(f,buy){if(!f||!G.fac[f])return 0;const r=G.fac[f].rank;if(f==='mercaderes')return buy?[0,0,.05,.1,.15][r]:[0,0,0,.1,.12][r]*1;return 0}
function econDay(){const R=Math.random;
 for(const z of ZIDS){const E=G.econ[z];const zn=getZone(z);const pop=E.pop||6;
  for(const b of zn.buildings){const k=b.kind;const add=(i,n)=>{E.s[i]=(E.s[i]||0)+n};const mv=(a,b2,n,ratio)=>{const c=Math.min(E.s[a]||0,n);E.s[a]-=c;add(b2,Math.floor(c*(ratio||1)))};
   if(k==='farm'){add('grano',5+Math.floor(R()*4));add('cebolla',2+Math.floor(R()*2));add('col',2+Math.floor(R()*2));add('zanahoria',1+Math.floor(R()*2));add('huevos',2);add('leche_cabra',1);add('leche_oveja',1);if(G.wx[z].type==='hail')E.s.grano=Math.max(0,E.s.grano-6);if(G.wx[z].temp>34)E.s.cebolla=Math.max(0,(E.s.cebolla||0)-3)}
   else if(k==='mill')mv('grano','harina',8);else if(k==='bakery')mv('harina','pan',4,2.2);
   else if(k==='mine'){add('mineral',5);add('carbon',3)}else if(k==='quarry')add(z==='collbato'||z==='montserrat'?'conglomerado':'caliza',6);else if(k==='lumber'){add('madera_pino',4);add(z==='collserola'?'madera_encina':'madera_castano',2)}
   else if(k==='port'||k==='fisher'){if(ZINFO[z].biome==='coast'){add('sardina',3+Math.floor(R()*2));add(['anchoa','merluza','dorada','pulpo'][Math.floor(R()*4)],2)}else add('trucha',4+Math.floor(R()*2))}
   else if(k==='tannery')mv('piel_oveja','cuero',3);else if(k==='smith')mv('mineral','lingote',3,.7);
   else if(k==='apothecary')mv('romero_h','pocion',2,.5);else if(k==='hunter'){add('carne_conejo',2);add('piel_conejo',1)}
   else if(k==='monasterio'){add('miel',2);add('mato',2);add('vino',2)}}
  if(z==='collserola'){const fa=G.fauna[z].filter(a=>!a.e&&a.age>8).length;E.s.carne+=Math.min(4,Math.floor(fa/6));E.s.setas+=2;E.s.hierbas+=2}
  if(z==='montserrat'){E.s.miel+=1;E.s.hierbas+=2}
  if(z==='martorell'){E.s.lana+=2;E.s.cuerda+=1}if(z==='barcino'){E.s.tela+=2;E.s.cuerda+=1;E.s.vino+=1;E.s.aceite+=1;E.s.sal+=2}if(z==='collbato'){E.s.lana+=1;E.s.queso+=2}
  // consumo
  const eat=Math.max(1,Math.round(pop/3));['pan','cebolla','col','carne_cerdo','carne_cordero','sardina','merluza','trucha','queso_cabra','vino','cerveza'].forEach(i=>{const c=Math.min(E.s[i]||0,Math.round(eat*(E.t[i]?.5:.1)*(R()+.3)));E.s[i]-=c});
  ECO_ITEMS.forEach(i=>{if(E.s[i]<0)E.s[i]=0;E.s[i]=Math.min(E.s[i],(E.t[i]||4)*5)})}
 // caravanas cada 2 días
 if(G.stats.days%2===0)for(const a of ZIDS)for(const b in TRAVEL[a]){if(a>b)continue;const A=G.econ[a],B=G.econ[b];let moved=0;
  ECO_ITEMS.forEach(i=>{const ta=A.t[i]||4,tb=B.t[i]||4;const sa=A.s[i]/ta,sb=B.s[i]/tb;if(sa>1.3&&sb<.9){const n=Math.min(Math.floor((A.s[i]-ta)*.5),Math.ceil(tb*.6));if(n>0){A.s[i]-=n;B.s[i]+=n;moved+=n}}else if(sb>1.3&&sa<.9){const n=Math.min(Math.floor((B.s[i]-tb)*.5),Math.ceil(ta*.6));if(n>0){B.s[i]-=n;A.s[i]+=n;moved+=n}}});
  if(moved>14&&Math.random()<.06)bus.emit('news','Una caravana ha unido '+ZINFO[a].n+' y '+ZINFO[b].n+'.')}
 // mercaderes restock/oro
 for(const id in G.npcs){const n=G.npcs[id];if(!n.alive)continue;const J=JOB[n.job];n.gold=Math.min(n.gold+Math.floor(R()*4),(J.gold[1]||50)*1.5);if(n.traveler&&R()<.08)n.gold+=20}}
// tienda de un edificio: lista de artículos (determinista por día/zona)
const SHOPS={
 general:['pan','vino','queso_cabra','sal','cuerda','tela','aceite','antorcha','ropa','capa','capa_viaje','botas','mochila','pocion','tinta','libro_g','hacha_tala','pico','cana','trampa','semilla_trigo','semilla_col','semilla_cebolla','cerveza','turron'],
 inn:['pan','vino','cerveza','estofado','escudella','queso_cabra','cocas','carne_cordero','pollo'],
 smith:['daga','espada_corta','espada_larga','hacha_mano','maza','lanza','escudo','armadura_cuero','cuero_tachonado','camisote_malla','casco_hierro','lingote','pico','hacha_tala','carbon'],
 apo:['pocion','antidoto','pocion_gran','romero_h','tomillo_h','salvia_h','niscalo','veneno','cristal','tinta'],
 bread:['pan','turron','panellets','cocas','harina'],
 farm:['grano','cebolla','col','zanahoria','habas','huevos','leche_cabra','leche_oveja','semilla_trigo','semilla_col','semilla_cebolla','semilla_zanahoria','lana'],
 fish:['sardina','anchoa','merluza','dorada','pulpo','cuerda','cana','sal']
};
function shopStock(b){const key=b.shop||'general';const base=SHOPS[key]||SHOPS.general;const rr=mulberry32(hashStr(b.id)+dateOf(G.t).days);const list=[];
 for(const id of base){if(!ITEMS[id])continue;if(rr()<.18)continue;const eco=ECO_ITEMS.includes(id);const s=eco?stockOf(b.zone,id):3+Math.floor(rr()*5);if(eco&&s<=0&&rr()<.8)continue;
  const q=eco||ITEMS[id].cat==='tool'?1:(rr()<.1?2:1);list.push({id,q,n:eco?Math.min(s,12):2+Math.floor(rr()*4)})}
 if(key==='general'&&G.fac.sombra.rank>=1&&b.zone==='barcino'){}return list}
function shopSold(b,id,n){if(ECO_ITEMS.includes(id)){const E=G.econ[b.zone];E.s[id]=Math.max(0,E.s[id]-n)}}
function shopBought(b,id,n){if(ECO_ITEMS.includes(id)){const E=G.econ[b.zone];E.s[id]+=n}}

// ---------- ecosistema ----------
function randFreeTile(z,r){for(let i=0;i<60;i++){const x=Math.floor(r()*z.cols),y=Math.floor(r()*z.rows);if(tileFree(z,x,y)&&z.flat[ZI(z,x,y)]<.3)return{x:x+.5,y:y+.5}}return{x:z.spawn.x,y:z.spawn.y}}
function newAnimal(sp,zone,r,age,sex,parent){const C=CREAT[sp];const z=getZone(zone);const p=randFreeTile(z,r);const gn={size:clamp((parent?(parent.gn.size+.0):1)+(r()-.5)*.14,.75,1.3),spd:clamp((parent?parent.gn.spd:1)+(r()-.5)*.14,.7,1.35),coat:clamp((parent?parent.gn.coat:r())+(r()-.5)*.2,0,1),hard:clamp((parent?parent.gn.hard:1)+(r()-.5)*.16,.6,1.4),bold:clamp((parent?parent.gn.bold:r())+(r()-.5)*.2,0,1)};
 const a={id:'a'+(G.eid++),sp,zone,sex:sex||(r()<.5?'m':'f'),age:age,gn,x:p.x,y:p.y,hp:Math.round(C.hp*gn.size*gn.hard),maxHp:Math.round(C.hp*gn.size*gn.hard),preg:0,hunger:0,sick:0,tx:p.x,ty:p.y,wait:0,alive:true};if(parent){a.x=parent.x+(r()-.5);a.y=parent.y+(r()-.5)}
 a.name=C.unique?'La Víbria':null;return a}
function ecoInit(){const r=mulberry32(G.seed^0xabc);
 for(const z of ZIDS){const zi=ZINFO[z];for(const sp in CREAT){const C=CREAT[sp];const cap=C.cap&&C.cap[z];if(!cap||C.dom)continue;const n=C.unique?1:Math.max(1,Math.round(cap*(.55+r()*.3)));
   for(let i=0;i<n;i++){const age=C.mat*(.3+r()*2.5);G.fauna[z].push(newAnimal(sp,z,r,Math.min(age,C.life*.6),i===0?'m':i===1?'f':null))}}}
 // flora inicial
 for(const z of ZIDS){const zone=getZone(z);const bi=zone.biome;const dens=({forest:140,hills:70,mountain:60,coast:36,river:60}[bi]||40)*(ZINFO[z].settle?(ZINFO[z].fd||.35):1);
  for(const sp in FLORA){const F=FLORA[sp];if(F.k==='crop'||!F.bi||(F.z?F.z.indexOf(z)<0:F.bi.indexOf(bi)<0))continue;const n=Math.round(dens*(F.k==='tree'?.55:F.k==='herb'?.25:.18)*(F.w||1)*(.6+r()*.7));
   for(let i=0;i<n;i++){const p=randFreeTile(zone,r);const age=F.mat*(.2+r()*2.2);G.flora[z].push({id:'f'+(G.eid++),sp,x:p.x,y:p.y,age,hv:0,ap:0,v:Math.floor(r()*3)})}}}}
function animalCounts(z){const o={};for(const a of G.fauna[z]){if(!a.alive)continue;const k=a.e?'_egg_'+a.sp:a.sp;o[k]=(o[k]||0)+1}return o}
function ecoDay(){const R=Math.random;const m=dateOf(G.t).m;
 for(const z of ZIDS){const arr=G.fauna[z];const counts={};arr.forEach(a=>{if(a.alive&&!a.e)counts[a.sp]=(counts[a.sp]||0)+1});const born=[];
  // enfermedad
  for(const sp in counts){const C=CREAT[sp];const cap=C.cap&&C.cap[z]||0;if(cap>3&&counts[sp]>cap*.85&&R()<.012){let n=0;for(const a of arr)if(a.sp===sp&&a.alive&&!a.e&&R()<.3){a.alive=false;n++}if(n>2&&z===G.zone)bus.emit('news','Una epidemia diezma a los '+C.n.toLowerCase()+' de la zona.')}}
  for(const a of arr){if(!a.alive)continue;const C=CREAT[a.sp];if(!C)continue;
   if(a.e){a.age-=1;if(a.age<=0){a.e=0;a.age=0;a.hp=a.maxHp;}continue}
   a.age++;if(a.age>C.life*(.8+a.gn.hard*.2)){a.alive=false;continue}
   // hambre / sobrepoblación
   const cap=C.cap&&C.cap[z]||99;const over=(counts[a.sp]||0)/cap;if(over>1.15&&R()<(over-1.1)*.12){a.alive=false;continue}
   if(C.diet==='herb'||C.diet==='omni'){const fl=G.flora[z].length;if(fl<20&&R()<.02){a.alive=false;continue}}
   // depredación
   if(C.prey&&(C.diet==='carn'||C.diet==='omni')){a.hunger++;if(a.hunger>3||R()<.08){const cands=arr.filter(b=>b.alive&&!b.e&&C.prey.includes(b.sp)&&b.age>b.sp.length*0);if(cands.length>=3&&R()<.13*(a.gn.bold+.4)*Math.min(1,(cands.length-2)/9)){const v=pick(cands,R);const vc=CREAT[v.sp];if((counts[v.sp]||0)>Math.max(2,((vc.cap&&vc.cap[z])||6)*.3)&&v.gn.spd*R()<a.gn.spd*.8+.1){v.alive=false;a.hunger=-Math.round(4+(CREAT[v.sp].sz||.5)*6);counts[v.sp]--}}}
    if(a.hunger>34&&R()<.07&&!C.unique)a.alive=false}
   // reproducción
   if(a.sex==='f'&&a.age>=C.mat&&!a.preg&&C.breed&&C.breed.includes(m)&&!C.dom){const males=arr.some(b=>b.alive&&!b.e&&b.sp===a.sp&&b.sex==='m'&&b.age>=C.mat);const crowd=(counts[a.sp]||0)<cap*1.1;if(males&&crowd&&R()<.22)a.preg=C.gest+1}
   else if(a.preg){a.preg--;if(a.preg===0){const n=ri(C.litter[0],C.litter[1]);const par=a;for(let i=0;i<n;i++){const k=newAnimal(a.sp,z,mulberry32(G.eid*31+i),0,null,par);if(C.eggs){k.e=1;k.age=C.gest<5?3:6;k.maxHp=k.hp}born.push(k)}}}}
  // inmigración rara
  for(const sp in CREAT){const C=CREAT[sp];if(!C.cap||!C.cap[z]||C.unique||C.dom||(counts[sp]||0)>0)continue;if((!G.extinct[z+sp]||G.t-G.extinct[z+sp]>1440*30)&&R()<.04){const nb=Object.keys(TRAVEL[z]).find(o=>G.fauna[o].filter(a=>a.sp===sp&&a.alive&&!a.e).length>=3);if(nb||(!G.killed[z+sp]&&R()<.35)){born.push(newAnimal(sp,z,Math.random,C.mat,'m'));born.push(newAnimal(sp,z,Math.random,C.mat,'f'));delete G.extinct[z+sp]}}}
  for(const b of born)arr.push(b);
  // limpieza y extinciones
  G.fauna[z]=arr.filter(a=>a.alive);const left={};G.fauna[z].forEach(a=>{if(!a.e)left[a.sp]=1});for(const sp in counts)if(!left[sp]&&!G.extinct[z+sp]){G.extinct[z+sp]=G.t;const C=CREAT[sp];if(z===G.zone&&!C.unique&&G.killed[z+sp])bus.emit('news','Los '+C.n.toLowerCase()+' se han extinguido en '+ZINFO[z].n+'.')}}
 // flora diaria
 const mm=dateOf(G.t).m;const s=seasonOf(dateOf(G.t).doy);
 for(const z of ZIDS){const zone=getZone(z);const arr=G.flora[z];const w=G.wx[z];const add=[];const rr=mulberry32(G.t+hashStr(z));
  for(const p of arr){const F=FLORA[p.sp];if(!F)continue;if(F.k==='crop'){p.age+=1;if(F.kill&&w.snow>.5||w.temp<-2&&F.kill){p.dead=1}continue}
   p.age+=(w.wet>.2?1.15:1)*(s===3?.4:1);if(p.hv>0)p.hv=Math.max(0,p.hv-1);
   if(F.life&&p.age>F.life)p.dead=1;if(F.wet&&w.wet<.1&&rr()<.04)p.dead=1;
   if(p.age>=F.mat&&F.seedR&&arr.length<(zone.biome==='forest'?240:140)&&rr()<(F.k==='tree'?.0035:.012)*(s===0||s===2?1.5:1)){const a=rr()*6.28,d=1+rr()*F.seedR;const x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;if(tileFree(zone,Math.floor(x),Math.floor(y))&&zone.flat[ZI(zone,Math.floor(x),Math.floor(y))]<.3)add.push({id:'f'+(G.eid++),sp:p.sp,x,y,age:0,hv:0,ap:0,v:Math.floor(rr()*3)})}}
  G.flora[z]=arr.filter(p=>!p.dead).concat(add);rebuildOcc(zone)}}
// ---------- tick de tiempo ----------
let _lastWxZone='';
function advance(mins,opt){opt=opt||{};let left=mins;const step=opt.step||10;
 while(left>0){const m=Math.min(step,left);G.t+=m;left-=m;wxTick(m);needsTick(m,opt);
  const D=dateOf(G.t);if(D.h!==G.lastHour){G.lastHour=D.h;hourTick()}if(D.days!==G.lastDay){G.lastDay=D.days;G.stats.days++;dayTick()}}
 bus.emit('time')}
function hourTick(){const R=Math.random;
 // heridas, bounty decay, sombra mercados, eventos
 stallTick();
 // ladrones actúan
 for(const id in G.npcs){const n=G.npcs[id];if(!n.alive||n.job!=='ladron')continue;if(npcWhere(n,G.t).act==='work'&&R()<.02+zsGet(n.zone).c/1500){const v=Object.values(G.npcs).filter(x=>x.alive&&x.zone===n.zone&&x.id!==n.id&&x.gold>40&&x.job!=='guardia'&&!x.traveler);if(v.length){const t=pick(v,R);const g=Math.min(t.gold,Math.floor(10+R()*30));t.gold-=g;n.gold+=g;t.mood=Math.max(0,t.mood-15)}}}}
function dayTick(){const R=Math.random;G.fac.concejo&&0;econDay();ecoDay();
 for(const id in G.npcs){const n=G.npcs[id];if(!n.alive)continue;n.mood=clamp(n.mood+(50-n.mood)*.2+(R()-.5)*10,0,100);if(n.aff>0&&G.t-n.lastTalk>1440*20)n.aff-=1;
  if(n.traveler){n.stay--;if(n.stay<=0){const zs=ZIDS.filter(z=>z!==n.zone);n.zone=pick(zs,R);n.stay=2+Math.floor(R()*5);n.hidden=true;n.loc=null;n.path=null}}}
 for(const z of ZIDS){if(G.bounty[z]>0&&R()<.1)G.bounty[z]=Math.max(0,G.bounty[z]-ri(5,20))}
 // rentas y raids
 rentDay();plotDay();bus.emit('day');
 if(G.stats.days%7===0){G.weeks++;bus.emit('week')}}
function rentDay(){}
function plotDay(){const R=Math.random;for(const z of ZIDS){const bl=G.built[z];if(!bl.length)continue;
  // cultivos
  for(const b of bl){const P=PLACE[b.t];if(!P)continue;if(P.cat==='cultivo'&&b.crop){b.crop.d++;const F=FLORA[b.crop.sp];const w=G.wx[z];if(w.type==='hail'&&R()<.5*w.int)b.crop.hp=(b.crop.hp||3)-1;if(w.temp<-2&&F.kill)b.crop.hp=0;if(b.crop.hp<=0){b.crop=null;continue}
    if(!b.crop.water&&w.wet<.2&&R()<.25)b.crop.hp=(b.crop.hp||3)-1;b.crop.water=false;if(w.wet>.3)b.crop.water=true}
   if(b.t==='corral'&&b.an){for(const an of b.an){an.age++;if(CREAT[an.sp]&&CREAT[an.sp].prod&&an.age>CREAT[an.sp].mat){b.prod=(b.prod||0)+1}}}}
  // amenazas: ladrones, depredadores, plagas
  const fences=bl.filter(b=>PLACE[b.t]&&PLACE[b.t].cat==='valla');const prot=fences.length?fences.reduce((s,f)=>s+PLACE[f.t].hp,0)/fences.length:0;const hasG=bl.some(b=>b.guard);
  const owned=G.owned[z]&&G.owned[z].length||G.deeds[z]&&Object.keys(G.deeds[z]).length;
  if(owned&&R()<.07&&bl.some(b=>b.crop||b.an)){const kind=R()<.4?'thief':R()<.7?'predator':'plague';const power=10+R()*60;if(power>prot+(hasG?30:0)){const tgt=bl.find(b=>b.crop||(b.an&&b.an.length));if(tgt){if(kind==='thief'){tgt.crop=null;tgt.an=[];bus.emit('news','¡Ladrones han saqueado tu propiedad en '+ZINFO[z].n+'!')}else if(kind==='predator'){if(tgt.an&&tgt.an.length){tgt.an.pop();bus.emit('news','Un depredador ha matado a uno de tus animales en '+ZINFO[z].n+'.')}else if(tgt.crop){tgt.crop.hp-=2}}else{if(tgt.crop){tgt.crop.hp-=2;bus.emit('news','Una plaga ataca tus cultivos en '+ZINFO[z].n+'.')}}}}
   else if(prot>0)bus.emit('news','Tus vallas han repelido un ataque en '+ZINFO[z].n+'.')}}}
// ---------- necesidades ----------
function needsTick(m,opt){const p=G.pc;if(!p||!p.needs)return;const h=m/60;const sleeping=opt.sleep;
 p.needs.hunger=clamp(p.needs.hunger+h*(sleeping?2.6:4.2)*(SPECIES[p.species].hunger||1),0,100);
 p.needs.fatigue=clamp(p.needs.fatigue+(sleeping?-h*12:h*3.4),0,100);
 const w=wxOf(G.zone);const tmp=w?w.temp:15;if(!G.zone.startsWith('int:')&&!opt.indoor&&G.zone!==undefined){const ex=tmp<0?(0-tmp)*.3:tmp>32?(tmp-32)*.25:0;if(ex>0&&!sleeping)p.needs.fatigue=clamp(p.needs.fatigue+h*ex,0,100)}
 if(p.needs.hunger>=100&&!sleeping){p.hp=Math.max(0,p.hp-h*1.2)}}
function coldPenalty(){const w=wxOf(G.zone);if(!w)return 0;let t=w.temp;const c=G.pc.eq.cloak?1:0;const b=G.pc.eq.body?1:0;return(t<2&&!c?1:0)+(t<-3&&!b?1:0)}
