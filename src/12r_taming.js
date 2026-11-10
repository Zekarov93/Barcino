// ===================== ADIESTRAMIENTO: una disciplina propia, con vínculo, compañeros y crianza =====================
const HND_RANKS=['Aprendiz','Cuidador','Domador','Adiestrador','Maestro de bestias','Susurrador de bestias'];
const HND_XP=[0,40,120,300,650,1200];
const TIER={conejo:0,gallina:0,gato:0,cuervo:0,gaviota:0,cangrejo:0,rata:0,perro:0,oveja:0,cabra_d:0,asno:1,gineta:1,nutria:1,zorro:1,tejon:1,cabra:1,ciervo:1,halcon:2,buho:2,jabali:2,lobo:2,murcielago:2,vibora:2,aguila:3,lince:3,buitre:3,oso:4};
const STANCES={seguir:'Seguir',cazar:'Cazar',guardar:'Guardar',cargar:'Cargar',explorar:'Explorar',descansar:'Descansar en casa'};
const HND_FAV={herb:['forraje','zanahoria','col','habas'],carn:['cecina','carne_conejo','carne_corzo','pollo']};
function hnd(){const p=G.pc;p.hnd=p.hnd||{xp:0,rank:0,done:0,fail:0};return p.hnd}
function hndRank(){const H=hnd();let r=0;for(let i=0;i<HND_XP.length;i++)if(H.xp>=HND_XP[i])r=i;return r}
function hndGain(n){const H=hnd();const old=hndRank();H.xp+=n;const nr=hndRank();if(nr>old){H.rank=nr;log('Tu adiestramiento mejora: ahora eres '+HND_RANKS[nr]+'.','lvl');toast('Adiestramiento: '+HND_RANKS[nr],'lvl');gainXp(60*nr)}H.rank=nr}
function maxPets(){const r=hndRank();return r>=4?3:r>=2?2:1}
function tameable(a){const C=CREAT[a.sp];return!!C&&!C.unique&&!C.monster&&TIER[a.sp]!=null}
function petsOf(){G.pets=G.pets||[];return G.pets}
function activePets(){return petsOf().filter(p=>p.stance!=='descansar'&&p.stance!=='carta'&&!(p.ko&&p.ko>G.t))}
function tameDC(a){ensureCr(a);const g=a.gn;let dc=9+TIER[a.sp]*2;dc+=Math.round((g.agr-.4)*5)-Math.round((g.doc-.4)*5)+[-4,-2,0,0,1][a.stg||2];
 dc-=Math.min(3,a.ob||0);if((SP_LORE[a.sp]||[]).some(id=>G.lore[id]))dc-=2;dc-=hndRank();if(a.hunger>6)dc-=1;
 const kin=(G.fauna[a.zone]||[]).filter(x=>x!==a&&x.alive&&!x.e&&x.pack&&x.pack===a.pack&&x.stg>=2&&Math.hypot(x.x-a.x,x.y-a.y)<9).length;if(kin)dc+=2;
 if(hasTool('lead')&&!CREAT[a.sp].fly)dc-=1;if(hasTool('glove')&&CREAT[a.sp].fly)dc-=2;if(hasTool('whistle'))dc-=1;
 return Math.max(6,dc)}
function tameInfo(sp){const t=TIER[sp];if(t==null)return 'No puede adiestrarse.';return 'Rango '+HND_RANKS[t]+' · dificultad base CD '+(9+t*2)+(CREAT[sp].fly?' · requiere guante de cetrería':'')+(CREAT[sp].diet==='carn'?' · cebo de carne':CREAT[sp].diet==='herb'?' · forraje':' · cualquier comida')}
function foodsFor(a){const C=CREAT[a.sp];const out=[];for(const s of G.pc.inv){const I=ITEMS[s.id];if(!I)continue;const meat=/^carne_/.test(s.id)||['cecina','pollo','sardina','anchoa','merluza','dorada','pulpo','huevos'].includes(s.id);const veg=I.cat==='agri'||['pan','forraje','castanas','mora','bellota','aceituna'].includes(s.id);
  const ok=C.diet==='carn'?meat:C.diet==='herb'?veg:(meat||veg);if(ok&&!out.some(o=>o.id===s.id))out.push({id:s.id,n:invCount(G.pc.inv,s.id),fav:(HND_FAV[C.diet]||[]).includes(s.id)||(C.diet==='omni'&&(meat||veg)&&Math.random()<0)})}return out}
// ---------- vínculo con un animal salvaje ----------
function bondName(b){return b>=100?'Vinculado':b>=80?'Apegado':b>=60?'Confiado':b>=40?'Curioso':b>=20?'Tolerante':'Receloso'}
function tameAttempt(a,kind,food){ensureCr(a);const C=CREAT[a.sp];const H=hnd();a.bond=a.bond||0;
 if(TIER[a.sp]>hndRank()){return{ok:false,msg:'Aún no tienes la experiencia para tratar con '+(C.n.toLowerCase())+'. Necesitas ser '+HND_RANKS[TIER[a.sp]]+'.'}}
 if(a.lastTry&&G.t-a.lastTry<240){return{ok:false,msg:(a.name||'El animal')+' aún te mira con recelo. Dale tiempo (unas horas) antes de insistir.'}}
 if(C.fly&&!hasTool('glove')&&a.bond<30)return{ok:false,msg:'Un ave rapaz no se deja acercar sin guante de cetrería.'}
 const dc=tameDC(a);const r=check('animal',dc+(kind==='food'?-1:2),{label:(kind==='food'?'Ofrecer comida':'Calmar con voz')+' a '+(a.name||C.n)});advance(kind==='food'?30:50,{step:10});a.lastTry=G.t;a.lull=Math.max(a.lull||0,G.t+1440);
 let gain=0,msg='';
 if(r.ok){gain=(kind==='food'?9:5)+Math.floor(Math.max(0,r.margin)/3)+(a.stg===0?4:0)+(food&&food.fav?4:0);if(r.nat===20)gain=Math.round(gain*1.5);a.bond=Math.min(100,a.bond+gain);K_obs(a);hndGain(2+(a.stg===0?1:0));
  msg=kind==='food'?(a.name||'El animal')+' acepta el bocado con cautela. Vínculo +'+gain+' ('+bondName(a.bond)+').':'Hablas bajo y sin gestos bruscos. Vínculo +'+gain+' ('+bondName(a.bond)+').'}
 else{a.bond=Math.max(0,a.bond-3);H.fail++;
  if(r.margin<=-6&&C.aggro>.3){msg=(a.name||'El animal')+' se erizó y te ataca.';return{ok:false,msg,fight:true}}
  if(C.flee>.3||a.gn.bold<.4){a.tx=a.x+(a.x>G.px?8:-8);a.ty=a.y+(a.y>G.py?8:-8);a.wait=0;msg=(a.name||'El animal')+' retrocede asustad'+(a.sex==='f'?'a':'o')+'. Vínculo −3.'}else msg=(a.name||'El animal')+' te mira con desconfianza. Vínculo −3.'}
 return{ok:r.ok,gain,msg,full:a.bond>=100}}
function K_obs(a){const K=crKn(a.sp);K.obs+=.34}
// pierde confianza con el tiempo si no se le visita; los vinculados no atacan
bus.on('day',()=>{for(const z of ZIDS)for(const a of (G.fauna[z]||[])){if(a.bond>0&&a.alive&&!a.e){a.bond=Math.max(0,a.bond-1.5);if(a.bond>=30)a.lull=Math.max(a.lull||0,G.t+1440*2)}}});
// ---------- adoptar: la criatura se convierte en compañero ----------
function adoptCreature(a,opts){opts=opts||{};const arr=G.fauna[a.zone||G.zone];if(arr){const i=arr.indexOf(a);if(i>=0)arr.splice(i,1)}
 ensureCr(a);a.tame=1;a.bond=100;a.loy=opts.loy||65;a.sat=70;a.lvl=a.lvl||1;a.xp=a.xp||0;a.owner='pc';a.since=G.t;a.pack=null;a.disp=0;a.home=null;a.hib=0;a.hibN=0;a.lull=1e15;a.e=0;a.alive=true;a.ko=0;a.zone=G.zone;a.x=G.px+(Math.random()-.5);a.y=G.py+1;
 a.gen=a.gen||0;if(!a.name)a.name=pick(INDIV_NAMES[a.sp]||DEF_NAMES);const P=petsOf();a.stance=opts.kept||(activePets().length>=maxPets())?'descansar':'seguir';P.push(a);petRefresh(a);
 hndGain(opts.xp==null?10+TIER[a.sp]*6:opts.xp);H_done();log(a.name+' ('+CREAT[a.sp].n.toLowerCase()+') es ahora tu compañer'+(a.sex==='f'?'a':'o')+(opts.stored?': queda contenid'+(a.sex==='f'?'a':'o')+' en su '+CONT[opts.stored].n.toLowerCase()+'.':a.stance==='descansar'?': descansa en casa porque no puedes llevar más con tu rango.':'.'),'good');toast('Nuevo compañero: '+a.name,'lvl');return a}
function H_done(){hnd().done++}
function petRefresh(a){refreshCr(a);const f=1+.08*((a.lvl||1)-1);a.maxHp=Math.round(a.maxHp*f);a.hp=Math.min(a.maxHp,Math.max(1,a.hp))}
function petLvlXp(a,n){a.xp=(a.xp||0)+n;const need=40*(a.lvl||1);while(a.xp>=need&&(a.lvl||1)<8){a.xp-=need;a.lvl=(a.lvl||1)+1;petRefresh(a);log(a.name+' sube al nivel '+a.lvl+'.','lvl')}}
// ---------- seguimiento en pantalla ----------
function compTick(dt){if(!G||!G.pc||!G.pets||!G.pets.length){return}R.cp=R.cp||{};
 const z=getZone(G.zone);const act=activePets();let i=0;
 for(const a of act){a.zone=G.zone;const C=CREAT[a.sp];let p=R.cp[a.id];if(!p||p.zone!==G.zone){const q=nearestFree(z,G.px-1.2-i*.5,G.py+1+i*.4);p=R.cp[a.id]={zone:G.zone,x:q[0],y:q[1],dx:1,dy:0,moving:false,path:null,rp:0}}
  a.x=p.x;a.y=p.y;const d=Math.hypot(G.px-p.x,G.py-p.y);
  if(d>32){const q=nearestFree(z,G.px-1.2-i*.5,G.py+1);p.x=q[0];p.y=q[1];p.path=null;i++;continue}
  if(C.fly){const tx=G.px+Math.cos(R.anim*.6+i*2.1)*2.2,ty=G.py+Math.sin(R.anim*.6+i*2.1)*2.2;const dx=tx-p.x,dy=ty-p.y,l=Math.hypot(dx,dy);if(l>.3){const st=Math.min(l,(d>6?6:3.4)*dt);p.x+=dx/l*st;p.y+=dy/l*st;p.dx=dx/l;p.dy=dy/l}p.moving=true;i++;continue}
  const gap=2.2+i*.6;
  if(d>gap+.8){p.rp-=dt;if(p.rp<=0||!p.path||!p.path.length){p.rp=.6;const pt=findPath(z,p.x,p.y,G.px,G.py,900);p.path=pt||[]}}
  if(p.path&&p.path.length&&d>gap){const w=p.path[0];const dx=w.x-p.x,dy=w.y-p.y,l=Math.hypot(dx,dy),st=(d>7?4.8:3.2)*(C.spd/2.4)*dt;if(l<=st+.02){p.x=w.x;p.y=w.y;p.path.shift()}else{p.x+=dx/l*st;p.y+=dy/l*st;p.dx=dx/l;p.dy=dy/l}p.moving=true}else p.moving=false;i++}}
const _petTick=petTick;petTick=function(dt){_petTick(dt);try{compTick(dt)}catch(e){if(!R._ce){R._ce=1;console.error('compTick',e)}}};
function compDraw(list,z,shadow){if(!G||!G.pets||!G.pets.length)return;R.cp=R.cp||{};for(const a of activePets()){const p=R.cp[a.id];if(!p||p.zone!==G.zone)continue;const C=CREAT[a.sp];const sh2=creatureSheet(a.sp,a.gn);const gy=groundY(z,p.x,p.y)+(C.fly?1.4+Math.sin(R.anim*3+p.x)*.2:0);const sc=(.9+(a.gn.size-1)*.8)*(a.vs||1);const fd=faceDir(p.dx,p.dy);const fr=p.moving?Math.floor(R.anim*(C.fly?10:7))%4:0;const dxs=p.dx*GL.right[0]+p.dy*GL.right[2];
  list.push({x:p.x,y:gy,z:p.y,w:sh2.fw*CRS*sc,h:sh2.fh*CRS*sc,uv:sheetUV(sh2,fr,hasFB(a.sp)&&fd.row!==2?(fd.row===1?2:1):0),flip:(hasFB(a.sp)&&fd.row!==2)?false:dxs<0});shadow(p.x,p.y,groundY(z,p.x,p.y),sh2.fw*CRS*sc*.8)}}
const _petDraw=petDraw;petDraw=function(list,z,shadow){_petDraw(list,z,shadow);try{compDraw(list,z,shadow)}catch(e){}};
bus.on('zone',()=>{R.cp={}});
// el perro que ya tenías pasa a ser un compañero de verdad
function legacyDog(){if(G&&G.pc&&G.pc.flags&&G.pc.flags.dog&&!G.pc.flags.dogConv){G.pc.flags.dogConv=1;G.pc.flags.dog=0;R.pet=null;const a=newAnimal('perro',G.zone,Math.random,CREAT.perro.mat*1.5,'m');a.name='Moro';a.gn.doc=.9;a.gn.agr=.1;adoptCreature(a,{xp:0,loy:90})}}
// ---------- combate: el compañero actúa y recibe golpes ----------
const _startCombat=startCombat;
startCombat=function(enemies,opts){const cb=_startCombat(enemies,opts);try{if(cb&&!cb.pets){cb.pets=activePets().filter(p=>p.hp>0&&!(p.ko&&p.ko>G.t));cb.pets.forEach(p=>{p._cbHp0=p.hp});if(cb.pets.length)cl('Te acompañan: '+cb.pets.map(p=>p.name).join(', ')+'.','ok')}}catch(e){console.error(e)}return cb};
function petAtk(p,e){ensureCr(p);const C=CREAT[p.sp];const lv=p.lvl||1;const stgF=[.4,.7,1,1,.8][p.stg||2];const tag=(p.tag||'').toLowerCase();
 if(tag.startsWith('tímid')&&Math.random()<.4){cl(p.name+' se encoge y no se atreve a atacar.','dim');return}
 if(p.stance==='guardar'&&Math.random()<.5){cl(p.name+' se interpone, vigilante, sin atacar.','dim');return}
 const r=d20(0);const hit=r.r===20||(r.r!==1&&r.r+C.atk+Math.floor(lv/2)>=e.ac);
 if(!hit){cl(p.name+' ataca a '+e.name+' y falla.','');return}
 let dm=roll(C.dmg).total;if(r.r===20)dm+=roll(C.dmg).total;dm=Math.max(1,Math.round(dm*stgF*(1+.07*(lv-1))*(tag.startsWith('audaz')||tag.startsWith('pend')?1.15:1)));
 cl(p.name+' muerde a '+e.name+': '+dm+' de daño.','ok');fx({k:'num',who:e,txt:'-'+dm,c:'bleed'});hurtEnemy(e,dm);if(e.hp<=0)petLvlXp(p,Math.round((e.xp||10)/4))}
function petHurt(p,e){const C=CREAT[p.sp];const ac=C.ac+(p.stance==='guardar'?1:0);const r=d20(0);const hit=r.r===20||(r.r!==1&&r.r+e.atk>=ac);if(!hit){cl(e.name+' ataca a '+p.name+' y falla.','');return}
 const dm=Math.max(1,roll(e.dmg).total);p.hp-=dm;cl(e.name+' hiere a '+p.name+': −'+dm+'.','bad');
 if(p.hp<=0){p.hp=0;p.ko=G.t+1440;p.loy=Math.max(0,(p.loy||50)-4);cl(p.name+' cae herido. Se retirará a descansar.','bad');if(Math.random()<.06&&r.r===20){killPet(p,'una herida mortal')}}}
function killPet(p,why){const P=petsOf();const i=P.indexOf(p);if(i>=0)P.splice(i,1);p.alive=false;log(p.name+' ha muerto por '+why+'.','bad');G.journal.push({t:G.t,k:'pet',m:'Murió mi compañero '+p.name+' ('+CREAT[p.sp].n.toLowerCase()+').'});hndGain(0)}
const _enemyPhase=enemyPhase;
enemyPhase=function*(){const cb=CB;const pets=(cb&&cb.pets||[]).filter(p=>p.hp>0);
 if(pets.length){for(const e of alive()){if(e.sleep>0||e.st&&e.st.prone)continue;const guard=pets.some(p=>p.stance==='guardar');if(Math.random()<(guard?.4:.22)){e._skip=1;petHurt(pick(pets),e)}}}
 yield* _enemyPhase();
 if(G.pc.hp>0&&alive().length){for(const p of pets){if(p.hp<=0)continue;const t=pick(alive());if(t)petAtk(p,t);if(alive().length===0)break}}};
const _endCombat=endCombat;
endCombat=function(res){const cb=CB;const pets=cb&&cb.pets||[];_endCombat(res);if(res==='won'&&cb&&cb.pets){for(const p of pets){if(p.hp>0){petLvlXp(p,Math.round(((cb.enemies||[]).reduce((s,e)=>s+(e.xp||0),0))/3));p.loy=Math.min(100,(p.loy||50)+1)}}}};
// ---------- vida diaria de los compañeros ----------
function petDay(){const P=petsOf();for(const p of P.slice()){if(p.stance==='carta')continue;p.age=(p.age||0)+1;const C=CREAT[p.sp];if(p.age>C.life*(.8+p.gn.hard*.2)){killPet(p,'vejez');continue}
  p.sat=(p.sat==null?70:p.sat);
  if(p.stance==='descansar'){p.sat=Math.max(p.sat,hasHomeFeed()?50:25)}
  if(p.sat<=0){p.sat=0;p.loy=(p.loy==null?60:p.loy)-7;p.hp=Math.max(1,p.hp-Math.ceil(p.maxHp*.06));if(p.loy<=0||p.hp<=1&&Math.random()<.2){/*abandono*/}}
  else if(p.sat>50&&p.stance!=='descansar'){p.loy=Math.min(100,(p.loy||50)+1)}
  if(p.sat<25&&Math.random()<.5)log(p.name+' tiene hambre. '+(p.sat<=0?'Está famélic'+(p.sex==='f'?'a':'o')+'.':'Dale de comer.'),'warn');
  if(p.ko&&G.t>=p.ko){p.ko=0;p.hp=Math.max(1,Math.round(p.maxHp*.4))}else if(!p.ko){p.hp=Math.min(p.maxHp,p.hp+Math.ceil(p.maxHp*.25))}
  if((p.loy||0)<=5&&Math.random()<.35){const i=P.indexOf(p);if(i>=0){P.splice(i,1);p.tame=0;p.bond=20;p.stance=null;p.lull=0;p.zone=G.zone;G.fauna[G.zone]=G.fauna[G.zone]||[];G.fauna[G.zone].push(p);log(p.name+' se ha marchado: no se sentía cuidad'+(p.sex==='f'?'a':'o')+'.','bad');continue}}
  refreshCr(p);if((p.stg===0||p.stg===1)&&p.age%3===0)petRefresh(p);
  // cría en casa entre compañeros emparejados
  if(p.stance==='descansar'&&p.sex==='f'&&p.stg>=2&&CREAT[p.sp].breed&&CREAT[p.sp].breed.includes(dateOf(G.t).m)){if(p.preg){p.preg--;if(p.preg<=0){p.preg=0;litter(p)}}else if(P.length<8){const m=P.find(q=>q.sp===p.sp&&q.sex==='m'&&q.stance==='descansar'&&q.stg>=2);if(m&&Math.random()<.06){p.preg=CREAT[p.sp].gest+1;p.sire=m.id}}}}}
function hasHomeFeed(){return Object.values(G.owned||{}).length>0||(G.deeds&&Object.keys(G.deeds).length>0)}
function litter(m){const C=CREAT[m.sp];const n=Math.min(8-petsOf().length,ri(C.litter[0],C.litter[1]));const dad=petsOf().find(q=>q.id===m.sire)||null;for(let i=0;i<n;i++){const k=newAnimal(m.sp,G.zone,Math.random,0,null,m);if(dad){k.dad=dad.id}k.tame=1;k.bond=100;k.loy=80;k.sat=60;k.lvl=1;k.xp=0;k.owner='pc';k.gen=Math.max(m.gen||0,dad&&dad.gen||0)+1;k.stance='descansar';k.zone=G.zone;k.lull=1e15;k.name=pick(INDIV_NAMES[m.sp]||DEF_NAMES);k.gn.doc=Math.min(1,k.gn.doc+.1);G.fauna[G.zone]=(G.fauna[G.zone]||[]).filter(x=>x!==k);petsOf().push(k);petRefresh(k)}
 if(n>0){log(m.name+' ha tenido '+n+' cría'+(n>1?'s':'')+'. Una nueva generación de tu línea.','good');hndGain(6)}}
bus.on('day',()=>{try{petDay();legacyDog()}catch(e){console.error('petDay',e)}});
// ---------- aptitudes: carga, guardia, caza, exploración ----------
function carryBonus(){let b=0;for(const p of activePets()){if(p.stance!=='cargar')continue;const C=CREAT[p.sp];if(p.sp==='asno')b+=38*(p.vs||1)*(1+.05*((p.lvl||1)-1));else if(p.sp==='perro')b+=10*(p.vs||1)}return b}
const _carryCap=carryCap;carryCap=function(p){return _carryCap(p)+(p===G.pc?carryBonus():0)};
const _rollEnc=rollEncounter;rollEncounter=function(zone,night){const e=_rollEnc(zone,night);if(!e)return e;const g=activePets().find(p=>p.stance==='guardar'&&['perro','lobo','gineta','buho','cuervo','tejon','zorro'].includes(p.sp));
 if(g&&Math.random()<.45){log(g.name+' detecta el peligro y lo ahuyenta con ladridos y gruñidos antes de que llegue.','good');petLvlXp(g,6);return null}return e};
const _hourTickPet=hourTick;
hourTick=function(){_hourTickPet();try{petHour()}catch(e){console.error('petHour',e)}};
function petHour(){const z=G.zone;const zi=ZINFO[z];if(!zi||zi.settle)return;const ph=phaseOf(G.t);
 for(const p of activePets()){if(p.stance!=='cazar')continue;const C=CREAT[p.sp];if(C.diet==='herb'||!C.prey||!C.prey.length)continue;const noct=socOf(p.sp).noct;if(noct?!ph.night:ph.night&&!C.fly)continue;
  if(Math.random()<.09+(p.lvl||1)*.01+(((p.tag||'').toLowerCase().startsWith('curios'))?.02:0)){const cand=(G.fauna[z]||[]).filter(a=>a.alive&&!a.e&&C.prey.includes(a.sp));const sp0=new Set(cand.map(a=>a.sp));
   const sp=pick([...sp0]);if(!sp)continue;const n=cand.filter(a=>a.sp===sp).length;const cap=(CREAT[sp].cap&&CREAT[sp].cap[z])||6;if(n<=Math.max(2,cap*.3))continue;
   const v=pick(cand.filter(a=>a.sp===sp));v.alive=false;G.killed[z+sp]=(G.killed[z+sp]||0);const loot=Object.keys(CREAT[sp].loot||{})[0];if(loot)giveItem(loot,1);p.sat=Math.min(100,(p.sat||50)+14);petLvlXp(p,6);hndGain(1);log(p.name+' vuelve con un '+CREAT[sp].n.toLowerCase()+' cazado'+(loot?': '+ITEMS[loot].n.toLowerCase()+' para ti.':'.'),'good')}}}
function scoutZone(p,track){const z=G.zone;const arr=(G.fauna[z]||[]).filter(a=>a.alive&&!a.e);const cnt={};arr.forEach(a=>cnt[a.sp]=(cnt[a.sp]||0)+1);const mon=arr.filter(a=>CREAT[a.sp].monster&&!CREAT[a.sp].unique);const packs=Object.values(G.packs||{}).filter(k=>k.zone===z&&CREAT[k.sp].aggro>.3);
 if(track){const prey=arr.filter(a=>CREAT[p.sp].prey&&CREAT[p.sp].prey.includes(a.sp)).sort((a,b)=>Math.hypot(a.x-G.px,a.y-G.py)-Math.hypot(b.x-G.px,b.y-G.py))[0];
  if(!prey)return p.name+' husmea el aire largo rato y no encuentra rastros frescos.';const dx=prey.x-G.px,dy=prey.y-G.py;const dir=(Math.abs(dx)>Math.abs(dy)?(dx>0?'este':'oeste'):(dy>0?'sur':'norte'));prey.ob=Math.max(prey.ob||0,1);return p.name+' sigue un rastro fresco de '+CREAT[prey.sp].n.toLowerCase()+' hacia el '+dir+', a unos '+Math.round(Math.hypot(dx,dy))+' pasos.'}
 arr.forEach(a=>{if(Math.hypot(a.x-G.px,a.y-G.py)<40)a.ob=Math.max(a.ob||0,1)});
 return p.name+' sobrevuela la zona. Ve: '+Object.keys(cnt).map(s=>cnt[s]+' '+CREAT[s].n.toLowerCase()).slice(0,8).join(', ')+'.'+(packs.length?' Manadas peligrosas: '+packs.map(k=>k.name).join(', ')+'.':'')+(mon.length?' ¡Hay '+mon.length+' monstruo'+(mon.length>1?'s':'')+'!':'')}
