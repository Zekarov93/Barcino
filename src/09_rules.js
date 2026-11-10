// ===================== REGLAS DE JUEGO: personaje, inventario, facciones, crimen, diálogo =====================
const PB_COST={8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};
function pointsSpent(b){let s=0;for(const a of AB)s+=PB_COST[b[a]]||0;return s}
function hasFeat(id){return !!(G&&G.pc&&G.pc.feats&&G.pc.feats.indexOf(id)>=0)}
function eqItems(){if(!G||!G.pc||!G.pc.eq)return[];const o=[];for(const k in G.pc.eq){const s=G.pc.eq[k];if(s)o.push(s)}return o}
function hpMaxOf(p){const C=CLASSES[p.cls];let h=C.hd+mod(p.abil.con);for(let l=2;l<=p.level;l++)h+=Math.floor(C.hd/2)+1+mod(p.abil.con);h+=(SPECIES[p.species].hpl||0)*p.level;if(p.feats&&p.feats.indexOf('tough')>=0)h+=2*p.level;return Math.max(1,h)}
function calcAC(p){p=p||G.pc;const body=p.eq.body&&ITEMS[p.eq.body.id];const dx=mod(p.abil.dex);let ac;
 if(body&&body.ac>10){ac=body.ac+(body.dexcap===0?0:body.dexcap==null?dx:Math.min(dx,body.dexcap))}
 else if(p.cls==='barbarian'&&!body)ac=10+dx+mod(p.abil.con);else if(p.cls==='monk'&&!p.eq.off&&(!body||body.ac<=10))ac=10+dx+mod(p.abil.wis);else ac=10+dx+((body&&body.ac)?body.ac-10:0);
 if(p.eq.off&&ITEMS[p.eq.off.id].id==='escudo')ac+=2;for(const s of eqItems()){const I=ITEMS[s.id];if(I&&I.acb)ac+=I.acb}return ac}
function carryCap(p){return 15*p.abil.str*(SPECIES[p.species].carry||1)}
function carryW(p){let w=0;for(const s of p.inv)w+=(ITEMS[s.id]?ITEMS[s.id].w:.5)*s.n;for(const s of eqItems())w+=(ITEMS[s.id]?ITEMS[s.id].w:.5);return w}
function refreshPC(){const p=G.pc;p.maxHp=hpMaxOf(p);p.hp=Math.min(p.hp,p.maxHp);p.ac=calcAC(p);const mx=slotsFor(p.cls,p.level);p.slots.max=mx;p.slots.cur=Math.min(p.slots.cur,mx)}
function makePC(cfg){const S=SPECIES[cfg.species],C=CLASSES[cfg.cls],B=BACKGROUNDS[cfg.bg];const abil=Object.assign({},cfg.base);
 if(cfg.bgPlus){abil[cfg.bgPlus[0]]=Math.min(20,abil[cfg.bgPlus[0]]+2);abil[cfg.bgPlus[1]]=Math.min(20,abil[cfg.bgPlus[1]]+1)}
 const skills={};(cfg.skills||[]).forEach(s=>skills[s]=1);(B.sk||[]).forEach(s=>skills[s]=1);
 const p={name:cfg.name||'Aventurero',sex:cfg.sex,species:cfg.species,lin:cfg.lin||null,cls:cfg.cls,bg:cfg.bg,level:1,xp:0,abil,skills,bon:Object.assign({},S.bon||{}),saves:C.sv.slice(),feats:[B.feat],tools:[],inv:[],eq:{},gold:C.gold+B.gold,look:cfg.look,
  needs:{hunger:10,fatigue:5},inspiration:species_insp(cfg.species),luck:0,spells:(C.spells||[]).slice(),slots:{max:0,cur:0},sig:{},crafts:{},recipes:['r_pan','r_estofado'],hp:1,maxHp:1,ac:10,wanted:0,spouse:null,sex2:cfg.attr||'any',flags:{},mount:null,home:null};
 if(B.tool)p.tools.push(B.tool);p.look=Object.assign({},cfg.look);
 const give=(id)=>{const I=ITEMS[id];if(!I)return;if(I.slot&&!p.eq[I.slot]&&I.slot!=='ring'){p.eq[I.slot]=mkStack(id,1,1,I.dy?pick(DYES):null)}else invAdd(p.inv,id,1,1)};
 (C.eq||[]).forEach(give);(B.eq||[]).forEach(give);
 if(!p.eq.body)give('tunica');if(!p.eq.feet)give('zapatos');
 invAdd(p.inv,'pan',2,1);invAdd(p.inv,'pocion',1,1);if(cfg.cls==='ranger'||cfg.cls==='druid')invAdd(p.inv,'romero_h',2,1);
 if(!p.eq.main&&!p.inv.some(s=>ITEMS[s.id].slot==='main'))give('daga');
 if(cfg.lin==='alto'){p.spells.push('firebolt');p.bon.arcana=(p.bon.arcana||0)+1}if(cfg.lin==='silvano')p.bon.stealth=(p.bon.stealth||0)+1;if(cfg.lin==='infernal')p.spells.push('firebolt');if(cfg.lin==='abisal'||cfg.lin==='ctonico')p.spells.push('burla');
 if(hasFeat0(p,'skilled')){const pool=SKILLS.map(x=>x.id).filter(x=>!p.skills[x]);for(let i=0;i<3&&pool.length;i++){const k=pool.splice(Math.floor(Math.random()*pool.length),1)[0];p.skills[k]=1}}
 if(hasFeat0(p,'lucky'))p.luck=pbOf(1);p.sigmax={};(C.sig||[]).forEach(k=>p.sig[k]=SIGUSES[k]?SIGUSES[k](1):1);
 p.maxHp=hpMaxOf(p);p.hp=p.maxHp;p.slots.max=slotsFor(p.cls,1);p.slots.cur=p.slots.max;
 if(B.fac)for(const f in B.fac)p.facStart=Object.assign(p.facStart||{},{[f]:B.fac[f]});
 if(S.fac)for(const f in S.fac)p.facStart=Object.assign(p.facStart||{},{[f]:(p.facStart&&p.facStart[f]||0)+S.fac[f]});
 return p}
function hasFeat0(p,f){return p.feats.indexOf(f)>=0}
function species_insp(sp){return sp==='human'}
const SIGUSES={rage:l=>2+(l>=3)+(l>=6)+(l>=9),inspire:l=>Math.max(1,0),secondwind:l=>1+(l>=4),layhands:l=>5*l,smite:l=>1,huntersmark:l=>2,sneak:l=>99,cunning:l=>99,flurry:l=>2+(l>=5),turn:l=>2,wild:l=>2};
function startWorld(pc,seed){G=newWorld(seed);G.pc=pc;G.npcs=createWorldNPCs(seed);npcSpots();econInit();ecoInit();for(const f in (pc.facStart||{})){G.fac[f].st=pc.facStart[f];facUpdate(f,true)}
 G.zone='barcino';G.px=23.5;G.py=30;G.lastDay=dateOf(G.t).days;G.lastHour=dateOf(G.t).h;for(const z of ZIDS)wxStep(z,true);for(const z of ZIDS){const w=G.wx[z];w.temp=wxTemp(z)}
 refreshPC();log('Llegas a Barcino una mañana de otoño del año '+START_YEAR+'. Tu historia comienza.','sys');return G}

// ---------- inventario ----------
function giveItem(id,n,q,c,who){const p=who||G.pc;n=n||1;if(!ITEMS[id]&&FAMILY[id])id=famPick(id,G.zone);const I=ITEMS[id];if(!I)return;invAdd(p.inv,id,n,q==null?1:q,c);if(p===G.pc)bus.emit('inv')}
function takeItem(id,n){const k=invTake(G.pc.inv,id,n||1);bus.emit('inv');return k}
function have(id,n){return invCount(G.pc.inv,id)>=(n||1)}
function addGold(n){G.pc.gold=Math.max(0,G.pc.gold+n);bus.emit('inv')}
function equipStack(i){const p=G.pc;const s=p.inv[i];if(!s)return false;const I=ITEMS[s.id];if(!I||!I.slot)return false;let slot=I.slot;
 if(slot==='ring'){slot='ring'}if(I.two&&p.eq.off){invAdd(p.inv,p.eq.off.id,1,p.eq.off.q,p.eq.off.c);p.eq.off=null}
 if(slot==='off'&&p.eq.main&&ITEMS[p.eq.main.id].two){toast('Tu arma de dos manos ocupa ambas manos.','bad');return false}
 const one=Object.assign({},s,{n:1});s.n--;if(s.n<=0)p.inv.splice(i,1);
 const old=p.eq[slot];p.eq[slot]=one;if(old)invAdd(p.inv,old.id,1,old.q,old.c);refreshPC();bus.emit('inv');bus.emit('look');return true}
function unequip(slot){const p=G.pc;const s=p.eq[slot];if(!s)return;p.eq[slot]=null;invAdd(p.inv,s.id,1,s.q,s.c);refreshPC();bus.emit('inv');bus.emit('look')}
function pcSprite(){const L=Object.assign({},G.pc.look);L.sex=G.pc.sex;L.sp=G.pc.species;L.eq=eqVis(G.pc.eq);return L}
function useItem(i){const p=G.pc;const s=p.inv[i];if(!s)return;const I=ITEMS[s.id];if(!I)return;
 if(I.heal){const r=roll(I.heal);p.hp=Math.min(p.maxHp,p.hp+r.total);log('Usas '+I.n+': recuperas '+r.total+' PG.','ok');consume(i)}
 else if(I.cure){log('Usas '+I.n+': te sientes libre de venenos.','ok');p.poison=0;consume(i)}
 else if(I.nut){p.needs.hunger=Math.max(0,p.needs.hunger-I.nut*(1+(s.q||1)*.05));log('Comes '+I.n+'.','');if(I.drink&&s.id==='vino')p.needs.fatigue=Math.max(0,p.needs.fatigue-3);consume(i)}
 else if(I.cat==='seed'){toast('Las semillas se plantan en un bancal de tu propiedad.')}
 else if(I.slot){equipStack(i)}else toast(I.n+': sin uso directo.');refreshPC();bus.emit('inv')}
function consume(i){const s=G.pc.inv[i];s.n--;if(s.n<=0)G.pc.inv.splice(i,1)}
function itemName(s){const I=ITEMS[s.id]||{n:s.id};let nme=I.n;if(s.q!=null&&s.q!==1&&(I.slot||I.cat==='potion'||I.cat==='tool'))nme+=' ('+QNAMES[clamp(s.q,0,4)]+')';return nme}
function sellValue(s){return Math.round((ITEMS[s.id]?ITEMS[s.id].v:1)*qMult(s.q))}
function weaponOf(p){p=p||G.pc;const s=p.eq.main;return s?ITEMS[s.id]:null}

// ---------- XP y niveles ----------
function gainXp(n,why){const p=G.pc;if(p.level>=MAXLEVEL)return;p.xp+=n;toast('+'+n+' PX','xp');const nl=levelFromXp(p.xp);while(p.level<nl){p.level++;levelUp()}}
function levelUp(){const p=G.pc;const old=p.maxHp;refreshPC();p.hp=Math.min(p.maxHp,p.hp+(p.maxHp-old));p.slots.cur=p.slots.max;log('¡Subes al nivel '+p.level+'! (+'+(p.maxHp-old)+' PG)','lvl');toast('¡Nivel '+p.level+'!','lvl');
 if(p.level===2){const C=CLASSES[p.cls];if(C.sig&&C.sig.length)log('Nueva capacidad de clase a tu alcance.','sys')}
 for(const k in p.sig)if(SIGUSES[k])p.sig[k]=Math.max(p.sig[k],SIGUSES[k](p.level));
 if(p.level===4||p.level===8){p.pending=(p.pending||0)+1;bus.emit('asi')}bus.emit('levelup')}
function applyASI(a,b){const p=G.pc;if(!p.pending)return false;if(a===b){p.abil[a]=Math.min(20,p.abil[a]+2)}else{p.abil[a]=Math.min(20,p.abil[a]+1);p.abil[b]=Math.min(20,p.abil[b]+1)}p.pending--;refreshPC();return true}
function takeFeat(id){const p=G.pc;if(!p.pending||p.feats.includes(id))return false;p.feats.push(id);p.pending--;if(id==='lucky')p.luck=pbOf(p.level);if(id==='tough')refreshPC();return true}

// ---------- facciones y reputación ----------
function facRank(f){return G.fac[f].rank}
function facUpdate(f,silent){const F=FACTIONS[f],S=G.fac[f];S.st=clamp(S.st,-100,100);let r=0;for(let i=0;i<F.req.length;i++)if(S.st>=F.req[i])r=i;if(r!==S.rank){const up=r>S.rank;S.rank=r;if(!silent){log((up?'Ascenso en ':'Descenso en ')+F.n+': ahora eres '+F.ranks[r]+'.',up?'lvl':'bad');toast((up?'▲ ':'▼ ')+F.ranks[r]+' · '+F.n,up?'lvl':'bad')}bus.emit('fac')}}
function facGain(f,n){if(!G.fac[f])return;G.fac[f].st+=n;facUpdate(f)}
function repGain(z,n){G.zrep[z]=clamp((G.zrep[z]||0)+n,-100,100);if(n>0)G.fame=clamp(G.fame+n*.15,0,100);bus.emit('rep')}
function infamyGain(n){G.infamy=clamp(G.infamy+n,0,100)}
function repTitle(z){const r=G.zrep[z]||0;return r<=-60?'Odiado':r<=-25?'Mal visto':r<25?'Desconocido':r<55?'Respetado':r<80?'Admirado':'Leyenda local'}
function fameTitle(){const f=G.fame;return f<10?'Anónimo':f<30?'Conocido':f<55?'Famoso':f<80?'Celebridad':'Legendario'}
function infamyTitle(){const f=G.infamy;return f<10?'Limpio':f<30?'Sospechoso':f<55?'Malhechor':f<80?'Criminal buscado':'Azote de la comarca'}
function npcAdj(n,d,rel){n.aff=clamp(n.aff+d,-100,100);if(rel&&d!==0){// ondas sociales: quienes los quieren/odian
  for(const id in n.rel){const o=G.npcs[id];if(!o||!o.alive)continue;const r=n.rel[id];if(r.v>=20&&Math.abs(d)>=5)o.aff=clamp(o.aff+Math.round(d*.25),-100,100);else if(r.v<=-20&&Math.abs(d)>=5)o.aff=clamp(o.aff-Math.round(d*.1),-100,100)}}}

// ---------- crimen ----------
function witnesses(radius){const z=getZone(G.zone);const out=[];for(const id in G.npcs){const n=G.npcs[id];if(!n.alive||n.zone!==G.zone||n.hidden||n.act==='sleep')continue;if(Math.hypot(n.x-G.px,n.y-G.py)<=(radius||9))out.push(n)}return out}
function crime(kind,sev,victim,opts){opts=opts||{};const z=G.zone;const ws=witnesses(opts.radius).filter(w=>!victim||w.id!==victim.id||opts.victimSees);let seen=[];const stealth=G.pc.skills.stealth?skillMod('stealth'):skillMod('stealth');
 for(const w of ws){if(opts.loud){seen.push(w);continue}const r=d20(0).r+Math.floor((passive('percep',w)-10)/2)*0;const myRoll=d20(0).r+stealth;if(passiveOf(w)>myRoll||opts.noStealth)seen.push(w)}
 if(victim&&opts.victimSees&&!seen.includes(victim))seen.push(victim);
 if(!seen.length){log('Nadie parece haberlo visto...','');return{seen:false}}
 const guards=seen.some(w=>w.job==='guardia');const fine=Math.round(sev*(guards?1.6:1));G.bounty[z]=(G.bounty[z]||0)+fine;infamyGain(sev*.15);repGain(z,-sev*.25);
 if(G.fac.concejo)facGain('concejo',-Math.round(sev*.2));seen.forEach(w=>{npcAdj(w,-Math.round(sev*.6),true);w.mood=Math.max(0,w.mood-20)});
 log('¡Te han visto! ('+seen.length+' testigo'+(seen.length>1?'s':'')+') Recompensa: '+fmtGold(G.bounty[z])+' en '+ZINFO[z].n+'.','bad');bus.emit('crime',kind);return{seen:true,by:seen,guards}}
function passiveOf(n){return 10+mod(n.abil.wis)+(n.skills.percep?pbOf(n.lvl):0)+(n.job==='guardia'?3:0)}
function sombraFence(){return G.fac.sombra.rank>=2}

// ---------- actitudes / apuntes ----------
function npcTitle(n){const J=JOB[n.job];const rel=n.fac&&FACTIONS[n.fac]?'':'';let t=J.n;if(n.fac==='castellers'&&n.id==='nuria')t='Cap de colla';if(n.id==='bernat')t='Consejero Mayor';if(n.id==='oriol')t='Capitán de la Guardia';if(n.id==='guifre')t='Abad de Montserrat';if(n.id==='aelwen')t='Hierofante del Círculo';if(n.id==='dagna')t='Maestra herrera';if(n.id==='narcis')t='Párroco';if(n.id==='anselm')t='Bibliotecario Mayor';if(n.id==='griselda')t='Posadera';const fem=(n.sex||(n.look&&n.look.sex))==='f';if(fem)t=(J.nf&&t===J.n)?J.nf:femTitle(t);if(n.rank==='aprendiz')t=(fem?'Aprendiza':'Aprendiz')+' de '+(fem&&J.nf?J.nf:J.n).toLowerCase();return t}
function femTitle(t){const M={'Consejero':'Consejera','Sacerdote':'Sacerdotisa','Monje':'Monja','Abad de Montserrat':'Abadesa de Montserrat','Noble':'Noble','Guardia':'Guardia','Druida':'Druida','Mercader':'Mercader','Juglar':'Juglaresa','Ladrón':'Ladrona','Capitán de la Guardia':'Capitana de la Guardia','Consejero Mayor':'Consejera Mayor','Párroco':'Párroca','Bibliotecario Mayor':'Bibliotecaria Mayor','Viajero':'Viajera','Erudito':'Erudita'};if(M[t])return M[t];return t.replace(/(\w+)o\b/,'$1a').replace(/(\w+)or\b/,'$1ora')}
function toneWords(n){const w=[];TRAITS.forEach(t=>{if(n.tr[t]>=8)w.push(TRAIT_N[t]);else if(n.tr[t]<=2)w.push(TRAIT_NEG[t])});return w.slice(0,3)}
function npcInfoLevel(n){return n.known||0}
