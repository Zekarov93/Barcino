// ===================== COMBATE v2: motor por turnos con eventos (fx) que reproduce la interfaz visual =====================
let CB=null;
const CSTAT={prone:['Derribado','🦵'],bleed:['Sangrando','🩸'],stun:['Aturdido','💫'],dazed:['Cegado','😵'],poison:['Envenenado','☠'],fear:['Asustado','😨'],aim:['Apuntando','🎯'],guard:['En guardia','🛡']};
const SPECIALS={
 tackle:{n:'Derribo',tell:'se agazapa para abalanzarse',mul:1,eff:'prone'},
 charge:{n:'Embestida',tell:'agacha la cabeza para embestir',mul:1.5,eff:'prone'},
 venom:{n:'Mordisco venenoso',tell:'enseña los colmillos',mul:1,eff:'poison'},
 drain:{n:'Chupasangre',tell:'se lanza a tu cuello',mul:1,eff:'drain'},
 dirty:{n:'Golpe sucio',tell:'busca tus ojos',mul:.8,eff:'dazed'},
 smash:{n:'Golpe aplastante',tell:'alza los puños sobre su cabeza',mul:2,eff:'stun'},
 rend:{n:'Desgarro',tell:'afila dientes y garras',mul:1,eff:'bleed'},
 breath:{n:'Aliento venenoso',tell:'hincha el pecho con un siseo grave',mul:1.3,eff:'poison'},
 power:{n:'Ataque a fondo',tell:'se prepara para un golpe a fondo',mul:1.5,hitpen:-2}};
const SPEC_BY={lobo:'tackle',jabali:'charge',rata:'rend',vibora:'venom',murcielago:'drain',trasgo:'dirty',ogro:'smash',vibria:'breath',zorro:'rend',bandit:'dirty',npc:'power'};
function fx(o){if(CB)CB.fx.push(o)}
function cl(m,c){if(CB){CB.log.push({m,c:c||''});if(CB.log.length>80)CB.log.shift();fx({k:'log',m,c:c||''})}log(m,c)}
function alive(){return CB?CB.enemies.filter(e=>e.hp>0&&!e.fled):[]}
function animalCombatant(a){const C=CREAT[a.sp];return{kind:'animal',ref:a,name:(a.name||C.n)+(a.sex==='f'?' (hembra)':''),hp:a.hp,maxHp:a.maxHp,ac:C.ac+(a.gn.hard>1.15?1:0),atk:C.atk,dmg:C.dmg,xp:Math.round(C.xp*a.gn.size),sp:a.sp,zone:a.zone,flee:C.flee,monster:C.monster,gold:C.gold,loot:C.loot,dis:0,sleep:0,gn:a.gn,sz:C.sz,spr:{t:'cr',sp:a.sp,gn:a.gn}}}
function npcCombatant(n){const w=n.eq.main?ITEMS[n.eq.main.id]:null;const ac=11+mod(n.abil.dex)+(n.eq.body?Math.max(0,ITEMS[n.eq.body.id].ac-10):0)+(n.eq.off?2:0);return{kind:'npc',ref:n,name:n.name,hp:n.hp,maxHp:n.maxHp,ac,atk:pbOf(n.lvl)+mod(n.abil.str>n.abil.dex?n.abil.str:n.abil.dex),dmg:(w?w.dmg:'1d4')+(mod(n.abil.str)>=0?'+'+Math.max(0,mod(n.abil.str)):''),xp:Math.round(20*n.lvl*1.5),flee:n.tr&&n.tr.brave>=6?.1:.5,gold:[n.gold,n.gold],dis:0,sleep:0,hum:1,spr:{t:'hu',look:npcSprite(n)}}}
function banditCombatant(lv){lv=lv||1;const sex=Math.random()<.4?'f':'m';const L=randLook('human',sex,Math.random);L.sex=sex;try{L.eq=eqVis(outfitFor(L,'ladron',Math.random,sex==='f'))}catch(e){L.eq={}}
 return{kind:'bandit',name:pick(['Bandido','Salteador','Ladrón de caminos']),hp:9+lv*5,maxHp:9+lv*5,ac:12,atk:3+lv-1,dmg:'1d6+'+(1+Math.floor(lv/2)),xp:40*lv,flee:.4,gold:[4*lv,18*lv],dis:0,sleep:0,hum:1,spr:{t:'hu',look:L}}}
function startCombat(enemies,opts){opts=opts||{};if(G.combat&&!G.combat.over)return G.combat;const p=G.pc;
 enemies.forEach((e,i)=>{e.id=i;e.st={};e.dhp=e.hp;e.spec=e.spec||SPEC_BY[e.sp||e.kind]||'power';e.intent=null;e.cd=1});
 CB=G.combat={enemies,opts,round:1,log:[],fx:[],tempHp:0,over:false,result:null,rage:0,mark:0,sneakUsed:false,defend:false,bless:0,hex:0,shield:0,pst:{},pdhp:p.hp,zone:G.zone,t0:G.t};
 bus.emit('combat',CB);
 cl('¡Combate! '+enemies.map(e=>e.name).join(', ')+'.','sys');
 const init=d20(hasFeat('alert')?1:0).r+mod(p.abil.dex);const ei=Math.max(...enemies.map(e=>d(20)+2));
 if(opts.ambush||ei>init+4){cl('Te sorprenden: actúan primero.','bad');planIntents(true);runSync(enemyPhase());if(p.hp<=0){endCombat('lost');return CB}}
 planIntents();return CB}
function planIntents(skip){for(const e of alive()){e.cd--;const sp=SPECIALS[e.spec];e.intent=(!skip&&sp&&e.cd<=0&&Math.random()<(e.monster?.5:.35))?e.spec:null;
  if(e.intent){e.cd=2;cl(e.name+' '+sp.tell+'… ('+sp.n+')','warn')}}
 fx({k:'intent',v:CB.enemies.map(e=>e.intent)})}
function atkBonusPC(w){const p=G.pc;let ab=(w&&(w.fin||w.rng||/arco|ballesta/.test(w.id||'')))?Math.max(mod(p.abil.str),mod(p.abil.dex)):mod(p.abil.str);if(w&&/^(arco|ballesta)/.test(w.id))ab=mod(p.abil.dex);if(p.cls==='monk'&&!w)ab=Math.max(ab,mod(p.abil.dex));return{ab,tot:ab+pbOf(p.level)}}
function pcWeaponDmg(w){const p=G.pc;if(!w){let ab=p.cls==='monk'?Math.max(mod(p.abil.str),mod(p.abil.dex)):mod(p.abil.str);return{expr:p.cls==='monk'?'1d6':'1d4',ab:hasFeat('savage')?Math.max(ab,0):ab}}return{expr:w.dmg,ab:atkBonusPC(w).ab}}
function isRanged(w){return !!(w&&(w.rng||/arco|ballesta/.test(w.id||'')))}
function hurtEnemy(t,dmg){t.hp-=dmg;t.sleep=0;fx({k:'hp',who:t,v:Math.max(0,t.hp)});if(t.hp<=0){cl(t.name+' cae.','ok');fx({k:'die',who:t})}}
function pcAdvVs(e){let adv=0;if(e.sleep>0)adv++;if(e.dis>0)adv--;if(e.st&&e.st.prone)adv++;if(CB.pst.aim)adv++;if(CB.pst.prone)adv--;if(G.pc.needs&&G.pc.needs.fatigue>90)adv--;return clamp(adv,-1,1)}
function* doAttack(t,o){o=o||{};const p=G.pc;const w=weaponOf(p);const ab=atkBonusPC(w);let adv=pcAdvVs(t)+(o.adv||0);const r=yield* pcd20(clamp(adv,-1,1),{t:'atk',label:'Ataque a '+t.name,bonus:ab.tot+(CB.pst.dazed>0?-2:0)+(o.bonus||0),dc:t.ac});let bless=CB.bless>0?d(4):0;const dz=CB.pst.dazed>0?-2:0;const tot=r.r+ab.tot+bless+dz+(o.bonus||0);const hit=r.r===20||(r.r!==1&&tot>=t.ac);const kind=isRanged(w)?'shot':'melee';
 CB.pst.aim=0;CB.pst.prone=0;
 cl('Atacas a '+t.name+': d20('+r.r+')'+fmt(ab.tot)+(bless?'+'+bless:'')+(dz?dz:'')+' = '+tot+' vs CA '+t.ac+' → '+(hit?(r.r===20?'¡CRÍTICO!':'IMPACTO'):'FALLO'),hit?'ok':'bad');
 if(!hit){fx({k:'atk',src:'pc',dst:t,res:'miss',kind});return}
 const dm=pcWeaponDmg(w);let rr=r.r===20?rollCrit(dm.expr):roll(dm.expr);let dmg=rr.total+dm.ab;if(CB.rage)dmg+=2;if(CB.mark>0)dmg+=d(6);if(CB.hex>0)dmg+=d(6);
 if(p.sig.sneak&&!CB.sneakUsed&&((w&&(w.fin||/arco|ballesta/.test(w.id)))||!w)&&(adv>0||alive().length>1)){const sn=roll(Math.ceil(p.level/2)+'d6');dmg+=sn.total;CB.sneakUsed=true;cl('Ataque furtivo: +'+sn.total,'ok')}
 if(o.smite&&p.slots.cur>0){p.slots.cur--;const sm=roll('2d8');dmg+=sm.total;cl('Castigo divino: +'+sm.total,'ok')}
 dmg=Math.max(1,dmg);cl('  Daño: '+dmg+' ('+t.name+': '+Math.max(0,t.hp-dmg)+'/'+t.maxHp+')','');
 fx({k:'atk',src:'pc',dst:t,res:r.r===20?'crit':'hit',dmg,kind,col:o.smite?'#ffe58a':null});hurtEnemy(t,dmg)}
function spellCol(dt){return /fuego|ígne/.test(dt)?'#ff8a3a':/fr[ií]o|hielo/.test(dt)?'#8ae0ff':/trueno|rayo|eléc/.test(dt)?'#ffe85a':/radiante|sagrad/.test(dt)?'#fff0a0':/necr|ácido/.test(dt)?'#b070e0':/psíq/.test(dt)?'#e07ad0':/perfor/.test(dt)?'#8ad060':'#9ab8ff'}
function* doSpell(id,t){const p=G.pc;const S=SPELLS[id];if(!S)return false;if(S.lvl>0){if(p.slots.cur<=0){cl('No te quedan espacios de conjuro.','bad');return false}p.slots.cur--}
 const dc=spellDC(),atk=spellAtk();const cant=S.lvl===0?(p.level>=5?2:1):1;const col=spellCol(S.dt||'');
 const dmgExpr=S.dmg?(S.lvl===0&&cant>1?S.dmg.replace(/^1d/,cant+'d'):S.dmg):null;
 if(S.t==='atk'){const r=yield* pcd20(pcAdvVs(t),{t:'atk',label:S.n+' → '+t.name,bonus:atk,dc:t.ac});const tot=r.r+atk;const hit=r.r===20||(r.r!==1&&tot>=t.ac);CB.pst.aim=0;cl(S.n+' → '+t.name+': d20('+r.r+')'+fmt(atk)+' = '+tot+' vs CA '+t.ac+' → '+(hit?'IMPACTO':'FALLO'),hit?'ok':'bad');
  if(hit){const dm=(r.r===20?rollCrit(dmgExpr):roll(dmgExpr)).total+(CB.hex>0?d(6):0);cl('  Daño '+S.dt+': '+dm,'');fx({k:'atk',src:'pc',dst:t,res:r.r===20?'crit':'hit',dmg:dm,kind:'magic',col});hurtEnemy(t,dm)}else fx({k:'atk',src:'pc',dst:t,res:'miss',kind:'magic',col})}
 else if(S.t==='auto'){const dm=roll(dmgExpr).total;cl(S.n+' impacta a '+t.name+': '+dm+' de daño.','ok');fx({k:'atk',src:'pc',dst:t,res:'hit',dmg:dm,kind:'magic',col});hurtEnemy(t,dm)}
 else if(S.t==='save'){const targets=S.half?alive():[t];fx({k:'cast',col,all:S.half?1:0});targets.forEach(e=>{const sv=d20(0).r+(e.kind==='animal'?0:2);const ok=sv>=dc;let dm=roll(dmgExpr).total;if(ok){dm=S.half?Math.floor(dm/2):0}cl(S.n+' sobre '+e.name+': salvación '+sv+' vs CD '+dc+' → '+(ok?'resiste':'falla')+(dm?', '+dm+' de daño':''),ok?'bad':'ok');if(!ok&&S.fx==='dis')e.dis=2;
   if(dm>0){fx({k:'atk',src:'pc',dst:e,res:'hit',dmg:dm,kind:'magic',col,nomove:1});hurtEnemy(e,dm)}else fx({k:'num',who:e,txt:'Resiste',c:'dim'})})}
 else if(S.t==='heal'){const h=roll(S.dmg).total+abMod(CLASSES[p.cls].spAb||'wis');p.hp=Math.min(p.maxHp,p.hp+h);cl('Te curas '+h+' PG.','ok');fx({k:'aura',who:'pc',col:'#7cdc7c'});fx({k:'num',who:'pc',txt:'+'+h,c:'heal'});fx({k:'hp',who:'pc',v:p.hp})}
 else if(S.t==='sleep'){let pool=roll('5d8').total;const sorted=alive().sort((a,b)=>a.hp-b.hp);let n=0;fx({k:'cast',col:'#a0a8ff',all:1});for(const e of sorted){if(pool>=e.hp){pool-=e.hp;e.sleep=3;n++;fx({k:'num',who:e,txt:'💤',c:'dim'})}}cl('Sueño: '+n+' criatura(s) caen dormidas.','ok')}
 else if(S.t==='buff'){fx({k:'aura',who:'pc',col:'#8ab8ff'});if(S.fx==='shield'){CB.shield=2;cl('Un escudo mágico te protege (+5 CA).','ok')}else if(S.fx==='bless'){CB.bless=3;cl('Te sientes bendecido (+1d4).','ok')}else if(S.fx==='hex'){CB.hex=99;cl('Marcas a tu objetivo con un maleficio.','ok')}}
 return true}
function* doSig(k,t){const p=G.pc;if(!p.sig[k]||p.sig[k]<=0){cl('Ya no te quedan usos.','bad');return false}
 if(k==='rage'){if(CB.rage){cl('Ya estás furioso.','');return false}p.sig.rage--;CB.rage=1;cl('¡Entras en furia! (+2 daño, resistencia al daño)','ok');fx({k:'aura',who:'pc',col:'#ff5a3a'});return true}
 if(k==='secondwind'){p.sig.secondwind--;const h=roll('1d10').total+p.level;p.hp=Math.min(p.maxHp,p.hp+h);cl('Tomas aliento: +'+h+' PG.','ok');fx({k:'aura',who:'pc',col:'#7cdc7c'});fx({k:'num',who:'pc',txt:'+'+h,c:'heal'});fx({k:'hp',who:'pc',v:p.hp});return true}
 if(k==='layhands'){const need=p.maxHp-p.hp;const h=Math.min(p.sig.layhands,need);if(h<=0){cl('No necesitas curación.','');return false}p.sig.layhands-=h;p.hp+=h;cl('Imposición de manos: +'+h+' PG.','ok');fx({k:'aura',who:'pc',col:'#fff0a0'});fx({k:'num',who:'pc',txt:'+'+h,c:'heal'});fx({k:'hp',who:'pc',v:p.hp});return true}
 if(k==='smite'){yield* doAttack(t,{smite:true});return true}
 if(k==='huntersmark'){if(CB.mark>0)return false;p.sig.huntersmark--;CB.mark=99;cl('Marcas a tu presa (+1d6).','ok');fx({k:'aura',who:'pc',col:'#8ad060'});return true}
 if(k==='flurry'){p.sig.flurry--;const sv=p.eq.main;p.eq.main=null;yield* doAttack(t);if(t.hp>0)yield* doAttack(t);p.eq.main=sv;return true}
 if(k==='wild'){p.sig.wild--;CB.tempHp=5*p.level;cl('Adoptas forma salvaje: +'+CB.tempHp+' PG temporales.','ok');fx({k:'aura',who:'pc',col:'#8ad060'});return true}
 if(k==='inspire'){p.sig.inspire=0;CB.bless=3;cl('Tu música inspira: +1d4 a tus ataques.','ok');fx({k:'aura',who:'pc',col:'#f0a0ff'});return true}
 if(k==='turn'){p.sig.turn--;cl('Tu voz resuena: los enemigos vacilan.','ok');fx({k:'cast',col:'#fff0a0',all:1});alive().forEach(e=>{if(e.hum||e.kind==='animal')e.dis=2});return true}
 if(k==='sneak'||k==='cunning'){cl('Habilidad pasiva: se aplica automáticamente.','');return false}
 return false}
// ---- acciones del jugador ----
function* combatActG(kind,arg,arg2){if(!CB||CB.over)return false;const p=G.pc;if(p.hp<=0)return false;const en=alive();const tgt=(typeof arg==='number'&&en[arg])||en[0];if(!tgt){settle();return false}let used=true;const P=CB.pst;
 if(kind==='attack'){yield* doAttack(tgt)}
 else if(kind==='aim'){P.aim=1;cl('Apuntas con calma: ventaja en tu próximo ataque.','');fx({k:'aura',who:'pc',col:'#ffd070'})}
 else if(kind==='trip'){const dc=10+Math.round((tgt.sz||.8)*3);const r=yield* pcCheck('athl',dc,{label:'Derribar',silent:true});cl(r.txt,r.ok?'ok':'bad');if(r.ok){tgt.st.prone=1;tgt.intent=null;fx({k:'num',who:tgt,txt:'Derribado',c:'warn'});fx({k:'status',who:tgt})}else fx({k:'num',who:'pc',txt:'Fallas',c:'dim'})}
 else if(kind==='intimidate'){const dc=10+Math.round((tgt.maxHp||10)/12);const r=yield* pcCheck('intim',dc,{label:'Intimidar',silent:true});cl(r.txt,r.ok?'ok':'bad');if(r.ok){tgt.dis=2;if(!tgt.monster&&Math.random()<(tgt.flee||0)+.25){tgt.fled=true;cl(tgt.name+' huye aterrado.','ok');fx({k:'fled',who:tgt})}else{cl(tgt.name+' vacila (desventaja).','ok');fx({k:'num',who:tgt,txt:'😨',c:'warn'})}}}
 else if(kind==='calm'){const an=en.filter(e=>e.kind==='animal'&&!e.monster);if(!an.length){cl('Nada que calmar aquí.','');return false}const r=yield* pcCheck('animal',12+en.length*2,{label:'Calmar a la bestia',silent:true});cl(r.txt,r.ok?'ok':'bad');if(r.ok&&an.length===en.length){cl('Las bestias se serenan y se alejan.','ok');endCombat('talked');return true}if(r.ok){an.forEach(e=>{e.fled=true;fx({k:'fled',who:e})})}}
 else if(kind==='spell'){used=yield* doSpell(arg2,tgt)}
 else if(kind==='sig'){used=yield* doSig(arg2,tgt)}
 else if(kind==='potion'){const s=p.inv[arg2];if(!s){return false}useItem(arg2);P.bleed=0;cl('Bebes una poción en pleno combate.','ok');fx({k:'aura',who:'pc',col:'#7cdc7c'});fx({k:'hp',who:'pc',v:p.hp});fx({k:'status',who:'pc'})}
 else if(kind==='defend'){CB.defend=true;cl('Te pones en guardia (+2 CA, y reduces a la mitad los golpes especiales).','');fx({k:'aura',who:'pc',col:'#9ab8ff'})}
 else if(kind==='flee'){const dc=10+en.length*1.5;const r=yield* pcCheck('acro',Math.round(dc),{label:'Huir',silent:true,adv:G.pc.sig.cunning?1:0});cl(r.txt,r.ok?'ok':'bad');if(r.ok){endCombat('fled');return true}}
 else if(kind==='capture'){const r=yield* capCombat(tgt,arg2);if(r==='no')used=false;else if(r==='end')return true}
 else if(kind==='talk'){const en0=en[0];const r=yield* pcCheck('persu',12+en.length*2,{label:'Parlamentar',silent:true});cl(r.txt,r.ok?'ok':'bad');if(r.ok&&!en0.monster&&(en0.kind==='bandit'||en0.kind==='npc'||(en0.flee||0)<.3)){cl('Logras calmarlos. El combate termina.','ok');endCombat('talked');return true}}
 if(!used)return false;
 if(alive().length===0){endCombat('won');return true}
 let guard=0;do{yield* enemyPhase();if(G.pc.hp<=0){endCombat('lost');return true}if(settle())return true;roundEnd();if(G.pc.hp<=0){endCombat('lost');return true}if(settle())return true;
  if(P.stun>0){P.stun--;cl('Estás aturdido: pierdes tu turno.','bad');fx({k:'num',who:'pc',txt:'💫',c:'warn'});continue}break}while(++guard<3);
 return true}
function settle(){if(CB.over)return true;if(alive().length>0)return false;endCombat(CB.enemies.some(e=>e.hp<=0)?'won':'fled');return true}
function roundEnd(){const p=G.pc,P=CB.pst;if(alive().length===0)return;
 if(P.bleed>0){P.bleed--;const b=d(4);p.hp=Math.max(0,p.hp-b);cl('Sangras: −'+b+' PG.','bad');fx({k:'num',who:'pc',txt:'-'+b,c:'bleed'});fx({k:'hp',who:'pc',v:p.hp})}
 if(p.poison>0){p.poison--;p.hp=Math.max(0,p.hp-1);cl('El veneno te quema: −1 PG.','bad');fx({k:'num',who:'pc',txt:'-1',c:'bleed'});fx({k:'hp',who:'pc',v:p.hp})}
 if(P.dazed>0)P.dazed--;CB.round++;CB.defend=false;CB.sneakUsed=false;if(CB.bless>0)CB.bless--;if(CB.shield>0)CB.shield--;
 for(const e of alive()){if(e.bleed>0){e.bleed--;hurtEnemy(e,d(4))}}
 planIntents();fx({k:'status',who:'pc'});fx({k:'round',n:CB.round})}
// ---- fase enemiga ----
function* enemyPhase(){const p=G.pc,P=CB.pst;for(const e of alive()){
  if(e._skip){e._skip=0;continue}
  if(e.sleep>0){e.sleep--;fx({k:'num',who:e,txt:'💤',c:'dim'});continue}
  if(e.st.prone){e.st.prone=0;cl(e.name+' se levanta del suelo.','');fx({k:'status',who:e});e.intent=null;continue}
  if(e.hp<e.maxHp*.3&&e.kind==='animal'&&Math.random()<(e.flee||0)){e.fled=true;e.intent=null;cl(e.name+' huye herido.','');fx({k:'fled',who:e});continue}
  if(e.kind==='bandit'&&e.hp<e.maxHp*.3&&Math.random()<.4){e.fled=true;e.intent=null;cl(e.name+' huye.','');fx({k:'fled',who:e});continue}
  const sp=e.intent?SPECIALS[e.intent]:null;e.intent=null;fx({k:'intent',v:CB.enemies.map(x=>x.intent)});
  let ac=p.ac+(CB.defend?2:0)+(CB.shield>0?5:0);let adv=e.dis>0?-1:0;if(e.dis>0)e.dis--;if(P.prone)adv=clamp(adv+1,-1,1);
  const r=d20(adv);const tot=r.r+e.atk+(sp&&sp.hitpen||0);const hit=r.r===20||(r.r!==1&&tot>=ac);const melee=!(e.fly&&false);
  if(!hit){cl(e.name+(sp?' ('+sp.n+')':'')+' falla su ataque ('+tot+' vs CA '+ac+').','');fx({k:'atk',src:e,dst:'pc',res:'miss',kind:'melee'});continue}
  let dm=(r.r===20?rollCrit(e.dmg):roll(e.dmg)).total;if(sp&&sp.mul)dm=Math.round(dm*sp.mul);if(sp&&CB.defend)dm=Math.ceil(dm/2);if(CB.rage)dm=Math.floor(dm/2);dm=Math.max(1,dm);
  if(CB.tempHp>0){const ab=Math.min(CB.tempHp,dm);CB.tempHp-=ab;dm-=ab}
  p.hp=Math.max(0,p.hp-dm);cl(e.name+(sp?' usa '+sp.n:'')+' te golpea: '+tot+' vs CA '+ac+' → '+dm+' de daño. ('+p.hp+'/'+p.maxHp+')','bad');
  fx({k:'atk',src:e,dst:'pc',res:r.r===20?'crit':'hit',dmg:dm,kind:'melee',sp:sp?e.spec:null});fx({k:'hp',who:'pc',v:p.hp});
  if(p.hp<=0)return;
  if(e.kind==='animal'&&e.ref&&e.ref.dz&&dm>0&&typeof bitInfect==='function')yield* bitInfect(e.ref);
  const eff=sp&&sp.eff;const save=function*(ab,dc){const s=yield* pcSave(ab,dc,{});cl(s.txt,s.ok?'ok':'bad');return s.ok};
  if(eff==='prone'&&!CB.defend){P.prone=1;cl('¡Caes al suelo!','bad')}
  else if(eff==='poison'||(e.sp==='vibora'&&dm>0)){if(!(yield* save('con',11))){p.poison=3;cl('Estás envenenado.','bad')}}
  else if(eff==='drain'){const h=Math.min(e.maxHp-e.hp,Math.ceil(dm/2));if(h>0){e.hp+=h;fx({k:'num',who:e,txt:'+'+h,c:'heal'});fx({k:'hp',who:e,v:e.hp})}}
  else if(eff==='dazed'){if(!(yield* save('dex',12))){P.dazed=2;cl('Te ciega: −2 a tus ataques.','bad')}}
  else if(eff==='stun'){if(r.r===20||!(yield* save('con',13))){P.stun=1;cl('¡Quedas aturdido!','bad')}}
  else if(eff==='bleed'||(r.r===20&&e.kind==='animal')){if(!(yield* save('con',10))){P.bleed=3;cl('Una herida profunda empieza a sangrar.','bad')}}
  fx({k:'status',who:'pc'})}}
// ---- fin ----
function endCombat(res){if(!CB||CB.over)return;CB.over=true;CB.result=res;const p=G.pc;const opts=CB.opts;let xp=0,gold=0,loot=[];
 if(res==='won'){for(const e of CB.enemies){if(e.hp>0)continue;xp+=e.xp;const g=e.gold?ri(e.gold[0],e.gold[1]):0;gold+=g;
   if(e.loot){for(const id in e.loot){const q=ri(e.loot[id][0],e.loot[id][1]);if(q>0)loot.push([id,q])}}
   if(e.kind==='animal'&&e.ref){e.ref.alive=false;G.stats.kills++;const k=e.zone+e.sp;G.killed[k]=(G.killed[k]||0)+1;if(e.sp==='vibria'){log('¡Has abatido a La Víbria! Su leyenda es tuya.','lvl');G.fame=Math.min(100,G.fame+30);G.flags.vibria=1}questKill(e.sp,e.zone)}
   if(e.kind==='npc'){const n=e.ref;n.alive=false;n.hp=0;n.hidden=true;gold=n.gold;n.inv.forEach(s=>loot.push([s.id,s.n]));n.inv=[];n.gold=0;G.dead[n.id]=G.t;npcMurder(n)}
   if(e.kind==='bandit')questKill('bandido',G.zone)}
  const ag=(G.fauna[G.zone]||[]);G.fauna[G.zone]=ag.filter(a=>a.alive);
  addGold(gold);loot.forEach(l=>giveItem(l[0],l[1],clamp(Math.round(1+(skillMod('survival')-2)/4+Math.random()),0,3)));
  const lootTxt=loot.map(l=>ITEMS[l[0]].n+' ×'+l[1]).join(', ');CB.summary={xp,gold,loot:lootTxt};cl('Victoria. '+(xp?'+'+xp+' PX. ':'')+(gold?'+'+fmtGold(gold)+'. ':'')+(lootTxt?'Botín: '+lootTxt+'.':''),'ok');if(xp)gainXp(xp)}
 else if(res==='lost'){const g=Math.floor(p.gold*.3);addGold(-g);const hum=CB.enemies.some(e=>e.hum||e.kind!=='animal');cl('Caes inconsciente. '+(hum?'Te despojan de '+fmtGold(g)+'.':'Una pastora te encuentra y te lleva a un refugio.'),'bad');advance(360,{sleep:true,step:60});p.hp=Math.max(1,Math.floor(p.maxHp*.3));p.needs.hunger=Math.min(100,p.needs.hunger+10);
  if(opts.murder&&opts.npc){npcAdj(opts.npc,-20)}teleportSafe()}
 else if(res==='fled'){cl('Escapas.','')}
 for(const e of CB.enemies){if(e.kind==='animal'&&e.ref&&e.hp>0){e.ref.lull=G.t+360;e.ref.hp=Math.max(1,e.hp)}if(e.kind==='npc'&&e.ref&&e.hp>0)e.ref.hp=Math.max(1,e.hp)}
 if(typeof R!=='undefined')R.grace=14;
 p.rage=0;fx({k:'over',res});bus.emit('combat',CB);bus.emit('inv');refreshPC()}

// ---- tiradas manuales del jugador dentro del combate (generadores) ----
function runSync(g){let s=g.next();while(!s.done)s=g.next([ri(1,20),ri(1,20)]);return s.value}
function combatAct(kind,a,b){if(CB)CB.manual=false;return runSync(combatActG(kind,a,b))}
function* pcd20(mode,why){if(CB&&CB.manual&&DICE.manual){const v=yield Object.assign({},why,{mode});DICE.queue=v.slice();const r=d20(mode,why);DICE.queue.length=0;return r}return d20(mode)}
function* pcCheck(sk,dc,o){o=Object.assign({roll:1},o||{});if(CB&&CB.manual&&DICE.manual){const P=checkWhy(sk,dc,o);const v=yield Object.assign({},P.why,{mode:P.mode});DICE.queue=v.slice();const r=check(sk,dc,o);DICE.queue.length=0;return r}return check(sk,dc,o)}
function* pcSave(ab,dc,o){if(CB&&CB.manual&&DICE.manual){const P=saveWhy(ab,dc,o);const v=yield Object.assign({},P.why,{mode:P.mode});DICE.queue=v.slice();const r=saveCheck(ab,dc,o);DICE.queue.length=0;return r}return saveCheck(ab,dc,o)}
