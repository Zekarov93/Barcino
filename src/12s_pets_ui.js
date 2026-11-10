// ===================== INTERFAZ DE ADIESTRAMIENTO Y COMPAÑEROS =====================
function petCanvas(a,sc){const s=creatureSheet(a.sp,a.gn);const cv=document.createElement('canvas');cv.width=s.fw;cv.height=s.fh;cv.getContext('2d').drawImage(s.canvas,0,0,s.fw,s.fh,0,0,s.fw,s.fh);cv.style.cssText='height:'+Math.round(s.fh*sc/(window.HR||2))+'px;image-rendering:pixelated';return cv}
function bar(v,max,col){return h('div',{class:'pbar'},h('i',{style:'width:'+Math.max(0,Math.min(100,v/max*100))+'%;background:'+col}))}
// ---- menú de adiestramiento de un animal salvaje ----
function tameMenu(a){ensureCr(a);const C=CREAT[a.sp];
 return modal('Adiestrar: '+(a.name?a.name+' · ':'')+C.n,(b,bg)=>{
  const H=hnd();const tier=TIER[a.sp];const ok=tier<=hndRank();a.bond=a.bond||0;
  b.append(h('div',{class:'ccard'},h('div',{},h('b',{},'Tu disciplina: '),HND_RANKS[hndRank()]+' ('+H.xp+' pts)'+' · plazas '+activePets().length+'/'+maxPets()),
   h('div',{},h('b',{},'Requiere: '),HND_RANKS[tier]+(ok?' ✔':' ✘')+' · '+tameInfo(a.sp)),
   h('div',{},h('b',{},'Vínculo: '),bondName(a.bond)+' ('+Math.round(a.bond)+'/100)'),bar(a.bond,100,'#7cc860'),
   h('div',{class:'dim'},'Dificultad actual: CD '+tameDC(a)+' (carácter '+(a.ob>=1?a.tag.toLowerCase():'desconocido')+', '+stageName(a).toLowerCase()+').'),
   a.lastTry&&G.t-a.lastTry<240?h('div',{class:'dim'},'Necesita unas horas de calma antes del siguiente intento.'):null));
  const reload=()=>{closeModal(bg);setTimeout(()=>tameMenu(a),30)};
  const res=r=>{log(r.msg,r.ok?'good':'warn');if(r.fight){closeModal(bg);startCombat([animalCombatant(a)],{});return}if(r.full){closeModal(bg);return bondCeremony(a)}reload()};
  const btns=h('div',{class:'btns'});
  const foods=foodsFor(a);
  foods.slice(0,4).forEach(f=>btns.append(h('button',{class:'btn',onclick:()=>{const r=tameAttempt(a,'food',f);if(r.ok||r.msg&&!/recelo|Necesitas ser|guante/.test(r.msg)){if(r.ok!==false||r.gain!=null)takeItem(f.id,1)}res(r)}},'Ofrecer '+ITEMS[f.id].n.toLowerCase()+' ('+f.n+')'+(f.fav?' ★':''))));
  if(!foods.length)btns.append(h('div',{class:'dim'},'No llevas comida que le guste ('+(C.diet==='carn'?'carne o cecina':C.diet==='herb'?'forraje, verdura o pan':'carne o verdura')+').'));
  btns.append(h('button',{class:'btn',onclick:()=>res(tameAttempt(a,'voice'))},'Calmarlo con voz y paciencia'));
  if(a.bond>=100)btns.append(h('button',{class:'btn pri',onclick:()=>{closeModal(bg);bondCeremony(a)}},'Sellar el vínculo'));
  btns.append(h('button',{class:'btn',onclick:()=>{closeModal(bg);creatureCard(a)}},'Volver'));b.append(btns)})}
function bondCeremony(a){const mom=(G.fauna[a.zone]||[]).find(x=>x.id===a.mom&&x.alive&&!x.e&&Math.hypot(x.x-a.x,x.y-a.y)<10);
 return modal('Un nuevo compañero',(b,bg)=>{b.append(h('p',{class:'big'},(a.name||CREAT[a.sp].n)+' se acerca y apoya la cabeza en tu mano. El vínculo está sellado.'),mom?h('p',{class:'dim'},'Su madre vigila entre los árboles; no le hará gracia que te lleves a su cría.'):null);
  const full=activePets().length>=maxPets();b.append(h('p',{class:'dim'},full?'No puedes llevar más compañeros contigo: descansará en casa hasta que lo llames.':'Se unirá a ti en tus viajes.'));
  b.append(h('div',{class:'btns'},h('button',{class:'btn pri',onclick:()=>{closeModal(bg);adoptCreature(a,{});if(mom&&mom.gn.agr>.35){setTimeout(()=>{log(mom.name?mom.name+' se lanza contra ti!':'¡La madre carga contra ti!','bad');startCombat([animalCombatant(mom)],{})},300)}}},'Aceptar'),h('button',{class:'btn',onclick:()=>closeModal(bg)},'Aún no')))},{sticky:1})}
CRX.push((a,btns,bg)=>{if(!tameable(a)){return}const need=TIER[a.sp];btns.append(h('button',{class:'btn'+(need<=hndRank()?' pri':''),onclick:()=>{closeModal(bg);tameMenu(a)}},'Adiestrar… ('+HND_RANKS[need]+(a.bond>0?', vínculo '+Math.round(a.bond):'')+')'))});
// ---- panel de compañeros ----
function compPanel(){return modal('Compañeros y adiestramiento',(b,bg)=>{const draw=()=>{b.innerHTML='';const H=hnd(),r=hndRank();const nxt=HND_XP[r+1];
  b.append(h('div',{class:'ccard'},h('div',{},h('b',{},'Disciplina de adiestramiento: '),HND_RANKS[r]),bar(H.xp-HND_XP[r],(nxt||HND_XP[r]+1)-HND_XP[r],'#c8a84a'),h('div',{class:'dim'},(nxt?'Próximo rango en '+(nxt-H.xp)+' puntos. ':'Rango máximo. ')+'Plazas con rango actual: '+maxPets()+' compañeros contigo; contenidas en cartas/piedras: '+storedPets().length+'/'+maxStored()+'. Se gana vínculo con animales salvajes, cuidándolos, criándolos y combatiendo juntos.')));
  const P=petsOf();if(!P.length){b.append(h('p',{},'No tienes compañeros todavía. Pulsa sobre un animal para observarlo y adiestrarlo, o busca a un cazador o granjero que venda crías. Empieza por criaturas pequeñas: los animales grandes exigen rango.'));return}
  for(const p of P){const C=CREAT[p.sp];ensureCr(p);const kept=p.stance==='descansar'||p.stance==='carta';
   const card=h('div',{class:'bsp'},h('div',{class:'bspH'},petCanvas(p,2.6),h('div',{},h('b',{},p.name+' · '+C.n),h('div',{class:'dim'},(p.sex==='f'?'hembra':'macho')+' · '+stageName(p)+' · '+p.tag+' · nivel '+(p.lvl||1)+(p.gen?' · generación '+(p.gen+1):'')+(p.preg?' · gestante':'')))));
   card.append(h('div',{class:'pstats'},h('span',{},'PG '+Math.ceil(p.hp)+'/'+p.maxHp),bar(p.hp,p.maxHp,'#d85a5a'),h('span',{},'Saciedad '+Math.round(p.sat==null?70:p.sat)),bar(p.sat==null?70:p.sat,100,'#c8a84a'),h('span',{},'Lealtad '+Math.round(p.loy==null?60:p.loy)),bar(p.loy==null?60:p.loy,100,'#7cc860'),h('span',{},'Hidratación '+Math.round(petWat(p))),bar(petWat(p),100,'#4aa0e0')));
   if(p.ko&&p.ko>G.t)card.append(h('div',{class:'bad'},'Herido: se recupera en '+Math.ceil((p.ko-G.t)/60)+' h.'));
   const st=h('div',{class:'btns'});Object.keys(STANCES).forEach(k=>{if(k==='explorar'&&!C.fly&&!(C.diet==='carn'&&p.lvl>=2))return;if(k==='cargar'&&!(p.sp==='asno'||p.sp==='perro'))return;if(k==='cazar'&&(C.diet==='herb'||!C.prey))return;st.append(h('button',{class:'btn'+((p.stance||'seguir')===k?' pri':''),onclick:()=>{const wasKept=p.stance==='descansar';if(k!=='descansar'&&wasKept&&activePets().length>=maxPets()){log('No puedes llevar más compañeros contigo con tu rango.','warn');return}p.stance=k;if(k!=='descansar')R.cp[p.id]=null;draw()}},STANCES[k]))});if(p.stance!=='carta')card.append(st);
   const act=h('div',{class:'btns'});const fo=foodsFor(p);
   if(fo.length&&p.stance!=='carta'){const f=fo[0];act.append(h('button',{class:'btn',onclick:()=>{takeItem(f.id,1);p.sat=Math.min(100,(p.sat==null?50:p.sat)+(f.fav?45:32));p.loy=Math.min(100,(p.loy||50)+(f.fav?3:1.5));p.hp=Math.min(p.maxHp,p.hp+3);petLvlXp(p,2);draw()}},'Dar de comer ('+ITEMS[f.id].n.toLowerCase()+')'))}
   if(C.fly&&!kept)act.append(h('button',{class:'btn',onclick:()=>{if(p.scout&&G.t-p.scout<360){log(p.name+' aún no ha vuelto de la última batida.','dim');return}p.scout=G.t;log(scoutZone(p,false),'lore');petLvlXp(p,5);hndGain(1);draw()}},'Enviar a explorar'));
   if((C.diet!=='herb'&&C.prey||p.sp==='perro')&&!kept&&(p.lvl||1)>=2)act.append(h('button',{class:'btn',onclick:()=>{if(p.scout&&G.t-p.scout<240){log(p.name+' necesita descansar el olfato.','dim');return}p.scout=G.t;log(scoutZone(p,true),'lore');petLvlXp(p,5);draw()}},'Rastrear presas'));
   if(typeof capActs==='function')capActs(p,act,draw);if(typeof disActs==='function')disActs(p,act,draw);if(typeof wetActs==='function')wetActs(p,act,draw);
   const rn=h('input',{type:'text',value:p.name,maxlength:16,class:'pname'});act.append(rn,h('button',{class:'btn',onclick:()=>{const v=(rn.value||'').trim().slice(0,16);if(v){p.name=v;draw()}}},'Renombrar'));
   const worth=Math.round(6+C.xp*.35*(p.stg>=2?1:.6)*(1+(p.gen||0)*.15)*((p.loy||50)<40?.6:1));
   if(p.stance!=='carta')act.append(h('button',{class:'btn',onclick:()=>{const z=ZINFO[G.zone];if(!z||!z.settle){log('Sólo puedes vender animales criados en un mercado.','warn');return}confirmBox('Vender a '+p.name,'Un criador de la zona ofrece '+worth+' fl por '+p.name+'. Se marchará con él y no volverás a verlo.','Vender','Cancelar',()=>{const i=P.indexOf(p);if(i>=0)P.splice(i,1);addGold(worth);repGain(G.zone,.5);hndGain(2);log('Vendes a '+p.name+' por '+worth+' fl. Se aleja sin mirar atrás.','warn');draw()})}},'Vender ('+worth+' fl)'),
    h('button',{class:'btn',onclick:()=>confirmBox('Liberar a '+p.name,'Soltarás a '+p.name+' en estas tierras. Volverá a ser salvaje.','Liberar','Cancelar',()=>{const i=P.indexOf(p);if(i>=0)P.splice(i,1);p.tame=0;p.stance=null;p.bond=60;p.lull=G.t+1440;p.zone=G.zone;p.pack=null;p.disp=1;G.fauna[G.zone].push(p);log(p.name+' se aleja, mirando atrás una vez.','');draw()})},'Liberar'));
   card.append(act);b.append(card)}};
  draw()},{wide:1})}
// ---- compra de crías y animales domésticos ----
const _svcPet=serviceOpts;
serviceOpts=function(n,opts){_svcPet(n,opts);const buy=({granjero:[['perro',25,0],['asno',55,1]],cabrero:[['perro',30,0]],pastor:[['perro',30,0]],cazador:[['lobo',90,2],['zorro',45,1],['lince',140,3]],guia:[['perro',28,0]],posadero:[['gato',8,0]],carretero:[['asno',58,1]],aldeano:[['gato',6,0]]})[n.job];if(!buy)return;const a=attitude(n);
 for(const [sp,price,tier] of buy){if(hndRank()<tier&&!(tier===1&&hndRank()>=0&&['asno'].includes(sp)))continue;if(a<-10)continue;
  opts.push(O('Comprar '+(sp==='perro'?'un cachorro de perro':sp==='asno'?'un asno joven':sp==='gato'?'un gatito':'una cría de '+CREAT[sp].n.toLowerCase())+' ('+price+' fl)',()=>{if(G.pc.gold<price)return D(n,'«Sin '+price+' florines no hay trato.»',[O('Volver',()=>mainMenu(n))]);if(petsOf().length>=8)return D(n,'«No tienes sitio para más animales.»',[O('Volver',()=>mainMenu(n))]);
   addGold(-price);const c=newAnimal(sp,G.zone,Math.random,CREAT[sp].mat*.3,null);c.zone=G.zone;adoptCreature(c,{xp:4,loy:75,kept:false});npcAdj(n,2);return D(n,'«Cuídalo bien. Tiene buen carácter.» '+(c.name||'')+' te mira con ojos enormes.',[O('Volver',()=>mainMenu(n))])},{cls:'soc'}))}};
// ---- encuentros de adiestramiento ----
const CUB_SP=['lobo','zorro','jabali','ciervo','lince','tejon','gineta','nutria','perro','oso','halcon'];
EVENTS.push(
{id:'cria_huerfana',w:7,ok:c=>c.wild&&!c.night&&CUB_SP.some(s=>CREAT[s].cap&&CREAT[s].cap[c.z]),run:c=>{const sp=pick(CUB_SP.filter(s=>CREAT[s].cap&&CREAT[s].cap[c.z]));const C=CREAT[sp];const cub=newAnimal(sp,c.z,Math.random,Math.max(1,C.mat*.15),null);cub.x=G.px+2;cub.y=G.py+1;cub.mom=null;cub.pack=null;cub.bond=15;cub.lull=G.t+1440*3;G.fauna[c.z].push(cub);
  return EVN('Entre unas matas oyes un lloriqueo. Una cría de '+C.n.toLowerCase()+' tiembla, sola, con aspecto de llevar días sin comer.',[
   O('Acercarte con calma para ayudarla',()=>{setTimeout(()=>tameMenu(cub),60);return null}),
   O('Buscar a su madre [Supervivencia CD 12]',()=>{const r=check('survival',12);if(r.ok){cub.alive=false;G.fauna[c.z]=G.fauna[c.z].filter(x=>x!==cub);gainXp(40);repGain(c.z,1);crLore('cries');return EVN('Sigues el rastro hasta una madriguera. La cría corre hacia el hueco y desaparece. Hoy tiene familia.',[evEnd()],'Reunida','🐾')}return EVN('Rastros confusos. La madre no aparece.',[evEnd()],'Sin rastro','🐾')}),
   O('Dejarla a su suerte',()=>{cub.alive=false;G.fauna[c.z]=G.fauna[c.z].filter(x=>x!==cub);return null})],'Cría huérfana','🐾')}},
{id:'animal_herido',w:6,ok:c=>c.wild&&!c.night&&(G.fauna[c.z]||[]).some(a=>a.alive&&!a.e&&tameable(a)&&CREAT[a.sp].aggro<.4),run:c=>{const cands=(G.fauna[c.z]||[]).filter(a=>a.alive&&!a.e&&tameable(a)&&CREAT[a.sp].aggro<.4);const a=pick(cands);a.x=G.px+2;a.y=G.py;a.hp=Math.max(1,Math.round(a.maxHp*.3));a.lull=G.t+1440*3;a.bond=Math.max(a.bond||0,10);a.wait=99;
  return EVN('Un '+CREAT[a.sp].n.toLowerCase()+(a.name?' (se le llama '+a.name+')':'')+' yace entre las raíces con una herida abierta. Te mira, jadeante, sin fuerzas para huir.',[
   O('Curarlo [Medicina CD 12]',()=>{const r=check('medic',12);if(r.ok){a.hp=a.maxHp;a.bond=Math.min(100,(a.bond||0)+(TIER[a.sp]<=hndRank()?40:25));hndGain(4);gainXp(40);setTimeout(()=>{if(TIER[a.sp]<=hndRank())tameMenu(a)},80);return EVN('Limpias y vendas la herida con cuidado. '+(a.name||'El animal')+' te deja hacer y, al terminar, se queda a tu lado.',[evEnd()],'Cura','🩹')}a.hp=Math.max(1,a.hp-2);return EVN('Tus manos tiemblan; la herida sigue abierta. Quizá lo logre solo.',[evEnd()],'Cura','🩹')}),
   O('Rematarlo (carne y piel)',()=>{setTimeout(()=>startCombat([animalCombatant(a)],{}),60);return null},{cls:'dark'}),
   O('Dejarlo en paz',()=>null)],'Animal herido','🩹')}}
);
