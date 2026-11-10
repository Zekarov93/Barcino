// ===================== ENFERMEDADES: fauna salvaje, compañeros y jugador =====================
GD('unguento_azufre','Ungüento de azufre','potion',9,.2);GD('elixir_ruda','Elixir de ruda y ajo','potion',70,.3);
SHOPS.apo.push('unguento_azufre','elixir_ruda');SHOPS.farm.push('unguento_azufre');
RECIPES.push({id:'r_unguento',n:'Preparar ungüento de azufre',tool:'herb',st:'alchemy',in:{hierbas:2,sal:1},out:['unguento_azufre',2],dc:9,min:45,xp:10},{id:'r_elixir',n:'Destilar elixir de ruda y ajo',tool:'herb',st:'alchemy',in:{ajo:2,salvia_h:1,vino:1},out:['elixir_ruda',1],dc:13,min:120,xp:30});
const DIS={
 rabia:{n:'Rabia',hosts:['zorro','lobo','perro','gato','tejon','gineta','nutria','lince','jabali'],dur:8,mort:.96,spread:.12,furD:2,hum:1,sym:'espuma en la boca y mirada vidriosa'},
 sarna:{n:'Sarna',hosts:['lobo','zorro','perro','lince','jabali','tejon','gineta','ciervo','cabra'],dur:14,mort:.1,spread:.1,hum:1,sym:'pelaje a mechones y rascado constante'},
 mixo:{n:'Mixomatosis',hosts:['conejo'],dur:7,mort:.78,spread:.45,sym:'ojos hinchados y cegados'},
 moquillo:{n:'Moquillo',hosts:['perro','lobo','zorro','gineta','nutria','tejon','gato'],dur:9,mort:.3,spread:.25,sym:'tos, legañas y apatía'},
 carbunco:{n:'Carbunco',hosts:['cabra','oveja','ciervo','asno','cabra_d','jabali'],dur:4,mort:.75,spread:.07,sym:'fiebre alta y tambaleo'},
 aviar:{n:'Peste aviar',hosts:['gallina','cuervo','gaviota','buho'],dur:6,mort:.45,spread:.4,sym:'plumas erizadas y letargo'}};
Object.values(DIS).forEach(D=>D.hosts=D.hosts.filter(s=>CREAT[s]));
LORE.push({id:'rabia',z:['barcino','collserola','martorell','sant_cugat'],sk:'medic',dc:12,t:'Quien es mordido por un animal que babea y rechaza el agua debe acudir a un boticario antes de tres días: lavar con vino, cauterizar y beber elixir de ruda y ajo. Después de la fiebre ya es tarde. Los viejos dicen que el perro rabioso huye de la luz y corre en línea recta.'},
 {id:'santroc',z:['barcino','martorell','montserrat'],sk:'relig',dc:10,t:'Sant Roc, patrón de los apestados y de los perros, se celebra el 16 de agosto. Ese día los animales se bendicen ante la iglesia: dicen que ningún mal de pelo o pluma les roza durante dos meses.'},
 {id:'carbuncoL',z:['montserrat','collbato','vega','marjal'],sk:'nature',dc:11,t:'Cuando el ganado cae muerto sin herida y la sangre sale negra, es el carbunco: la carroña infecta el pasto durante años. Hay que quemarla, no enterrarla. Los buitres, que limpian sin enfermar, son los mejores aliados del pastor.'});
const dz=a=>a.dz?DIS[a.dz.k]:null;
function dsusc(a,k){const C=CREAT[a.sp];const D=DIS[k];return !!C&&!C.unique&&!C.monster&&a.alive&&!a.e&&!a.dz&&a.stance!=='carta'&&D.hosts.includes(a.sp)&&!(a.imm&&a.imm[k]>G.t)&&!(k==='carbunco'&&a.sp==='buitre')}
function dinfect(a,k){a.dz={k,d:0,s:0};a.sick=1}
function dfree(a,k){a.dz=null;a.sick=0;a.imm=a.imm||{};a.imm[k]=G.t+1440*120}
function disDay(){G.epi=G.epi||{};const R=Math.random;G.carc=G.carc||{};
 for(const z of ZIDS){const arr=G.fauna[z]||[];const live=arr.filter(a=>a.alive&&!a.e);const cnt={};live.forEach(a=>cnt[a.sp]=(cnt[a.sp]||0)+1);
  for(const k in DIS){const D=DIS[k];const n=D.hosts.reduce((s,sp)=>s+(cnt[sp]||0),0);if(n<4)continue;
   let base=k==='rabia'?.0012:k==='carbunco'?((G.carc[z]||0)>4?.02:.0015):.0022;if(D.hosts.some(sp=>{const c=CREAT[sp].cap&&CREAT[sp].cap[z]||0;return c>3&&(cnt[sp]||0)>c*.75}))base*=3;
   if(R()<base&&!live.some(a=>a.dz&&a.dz.k===k)){const c=live.filter(a=>dsusc(a,k));if(c.length){const v=pick(c);dinfect(v,k);G.epi[z]={k,t:G.t,sp:v.sp};if(z===G.zone)bus.emit('news',D.n+' entre '+CREAT[v.sp].n.toLowerCase()+' de la zona.');addGossip(z,'Se habla de '+D.n.toLowerCase()+' entre '+CREAT[v.sp].n.toLowerCase()+'.')}}}
  let newInf=0;
  for(const a of live){if(!a.dz)continue;const D=DIS[a.dz.k];if(!D){a.dz=null;continue}const k=a.dz.k;a.dz.d++;if(k==='rabia'&&a.dz.d>=D.furD)a.dz.s=1;
   for(let i=0;i<2&&newInf<3;i++){const c=live.filter(b=>b!==a&&dsusc(b,k));if(!c.length)break;const b=pick(c);const kin=a.pack&&a.pack===b.pack;if(R()<D.spread*(kin?2.2:1)*(k==='carbunco'?(.5+Math.min(2,(G.carc[z]||0)/4)):1)){dinfect(b,k);newInf++}}
   if(a.dz.d>=D.dur){let p=D.mort*(a.gn.hard>1.1?.85:1)*(a.stg<=1?1.15:a.stg===4?1.2:1);{const c0=cnt[a.sp]||0;if(c0<=3)p*=.15;else if(c0<8)p*=.45}
    if(R()<Math.min(.98,p)){a.alive=false;a.cause='enfermedad';cnt[a.sp]--;const C=CREAT[a.sp];G.carc[z]=(G.carc[z]||0)+Math.min(3,C.sz*a.gn.size*1.5)}else dfree(a,k)}}
  if(G.epi[z]&&!live.some(a=>a.dz&&a.alive))delete G.epi[z]}
 petDz();pcDz()}
bus.on('day',()=>{try{disDay()}catch(e){if(!R._de){R._de=1;console.error('disDay',e)}}});
// comportamiento
const _ac_dz=animalCombatant;animalCombatant=function(a){const e=_ac_dz(a);if(a.dz){const k=a.dz.k;if(k==='rabia'&&a.dz.s){e.atk+=1;e.flee=0;e.name+=' (rabios'+(a.sex==='f'?'a':'o')+')'}else{e.atk=Math.max(0,e.atk-1);e.name+=' (enferm'+(a.sex==='f'?'a':'o')+')'}}return e};
const _crStatus=crStatus;crStatus=function(a){const m=_crStatus(a).filter(x=>!/^enferm/.test(x));if(a.dz){const D=dz(a);const ob=a.ob||0;m.push(ob>=2||a.tame?D.n.toLowerCase():ob>=1?D.sym:'enferm'+(a.sex==='f'?'a':'o'))}return m};
// ---- el jugador ----
function infectPc(k){const p=G.pc;p.inf=p.inf||{};if(p.inf[k])return;p.inf[k]={t:G.t,inc:ri(2,5)*1440,st:0};log(k==='rabia'?'La mordedura sangra con un hilo oscuro y la saliva del animal te quema. Más vale que la vea un boticario cuanto antes.':'Notas un picor persistente en la piel. Puede ser sarna.','warn')}
function* bitInfect(a){const k=a.dz.k;const D=DIS[k];if(!D.hum||G.pc.inf&&G.pc.inf[k])return;if(k==='sarna'&&Math.random()>.25)return;if(k==='rabia'&&!a.dz.s&&Math.random()>.5)return;
 const s=yield* pcSave('con',k==='rabia'?11:10,{});cl(s.txt,s.ok?'ok':'bad');if(!s.ok)infectPc(k)}
function pcDz(){const p=G.pc;if(!p||!p.inf)return;for(const k of Object.keys(p.inf)){const I=p.inf[k];
  if(k==='rabia'){if(I.st===0&&G.t>=I.t+I.inc){I.st=1;I.t1=G.t;log('Tienes fiebre, sed que no puedes saciar y el agua te da horror. Es la rabia. Necesitas elixir de ruda o un boticario, y rápido.','bad');toast('¡Rabia!','bad')}
   else if(I.st===1){p.hp=Math.max(1,p.hp-Math.ceil(p.maxHp*.1));log('La fiebre te consume: pierdes fuerzas.','bad');if(G.t-I.t1>=4*1440){delete p.inf[k];const g=Math.floor(p.gold*.4);addGold(-g);p.maxHp=Math.max(6,p.maxHp-4);p.hp=Math.max(1,Math.round(p.maxHp*.3));log('Caes en coma. Unos monjes te velan cinco días y te sacan adelante a costa de '+fmtGold(g)+' y de tu vigor (−4 PG máximos).','bad');G.journal.push({t:G.t,k:'dis',m:'Sobreviviste a la rabia por los pelos.'})}}}
  else if(k==='sarna'){if(I.st===0&&G.t>=I.t+I.inc){I.st=1;I.t1=G.t;log('Tienes sarna: la piel te arde. Un ungüento de azufre te curará.','warn')}else if(I.st===1){p.hp=Math.max(1,p.hp-1);if(G.t-I.t1>=10*1440){delete p.inf[k];log('La sarna remite por sí sola.','good')}}}}}
function curePc(k){if(G.pc.inf&&G.pc.inf[k]){delete G.pc.inf[k];return true}return false}
// ---- compañeros ----
function psusc(p,k){const D=DIS[k];return p.stance!=='carta'&&!p.dz&&D.hosts.includes(p.sp)&&!(p.imm&&p.imm[k]>G.t)}
function petInfect(p,k){if(!psusc(p,k))return;p.dz={k,d:0,s:0};p.sick=1;log(p.name+' empieza a encontrarse mal. Obsérvalo con atención.','warn')}
function petDz(){for(const p of petsOf().slice()){if(p.stance==='carta'||!p.dz)continue;const D=DIS[p.dz.k];if(!D){p.dz=null;continue}const k=p.dz.k;p.dz.d++;
  if(k==='rabia'){if(p.dz.d===1)log(p.name+' tiene fiebre y babea. ¡Trátalo con elixir de ruda hoy!','bad');if(p.dz.d>=3){const i=petsOf().indexOf(p);if(i>=0)petsOf().splice(i,1);p.tame=0;p.stance=null;p.bond=0;p.lull=0;p.zone=G.zone;p.dz.s=1;(G.fauna[G.zone]=G.fauna[G.zone]||[]).push(p);log(p.name+' enloquece y huye al monte con la mirada vidriosa. Ya no es tu compañero.','bad');continue}}
  else if(k==='sarna'){p.loy=Math.max(0,(p.loy||50)-1);if(p.dz.d>=D.dur){dfreeP(p,k);log(p.name+' se ha recuperado de la sarna.','good')}}
  else if(k==='moquillo'){p.hp=Math.max(1,p.hp-Math.ceil(p.maxHp*.08));if(p.dz.d>=D.dur){const cure=(p.dz.care||0)>=3;if(!cure&&Math.random()<D.mort*.8){killPet(p,'moquillo');continue}dfreeP(p,k);log(p.name+' supera el moquillo.','good')}}
  else{p.hp=Math.max(1,p.hp-Math.ceil(p.maxHp*.06));if(p.dz.d>=D.dur){if(Math.random()<D.mort*.5){killPet(p,D.n.toLowerCase());continue}dfreeP(p,k)}}}}
function dfreeP(p,k){p.dz=null;p.sick=0;p.imm=p.imm||{};p.imm[k]=G.t+1440*120}
const _petHurtDz=petHurt;petHurt=function(p,e){_petHurtDz(p,e);try{if(e.ref&&e.ref.dz&&Math.random()<.3)petInfect(p,e.ref.dz.k)}catch(er){}};
const _petAtkDz=petAtk;petAtk=function(p,e){_petAtkDz(p,e);try{if(e.ref&&e.ref.dz&&Math.random()<.12)petInfect(p,e.ref.dz.k)}catch(er){}};
function disActs(p,act,draw){if(p.dz){const D=DIS[p.dz.k];act.append(h('div',{class:'bad'},'Enferm'+(p.sex==='f'?'a':'o')+': '+D.n+' (día '+p.dz.d+') — '+D.sym+'.'));
  if(p.dz.k==='rabia'&&invCount(G.pc.inv,'elixir_ruda'))act.append(h('button',{class:'btn pri',onclick:()=>{takeItem('elixir_ruda',1);dfreeP(p,'rabia');p.imm.rabia=G.t+1440*60;log('Le das el elixir a '+p.name+': la fiebre cede.','good');draw()}},'Elixir de ruda'));
  if(p.dz.k==='sarna'&&invCount(G.pc.inv,'unguento_azufre'))act.append(h('button',{class:'btn pri',onclick:()=>{takeItem('unguento_azufre',1);dfreeP(p,'sarna');log('Untas a '+p.name+' con azufre. El picor desaparece.','good');draw()}},'Ungüento de azufre'));
  if(p.dz.k==='moquillo'||p.dz.k==='aviar'||p.dz.k==='carbunco')act.append(h('button',{class:'btn',onclick:()=>{const r=check('medic',13,{label:'Cuidar a '+p.name});advance(60,{step:30});if(r.ok){p.dz.care=(p.dz.care||0)+1;p.hp=Math.min(p.maxHp,p.hp+Math.ceil(p.maxHp*.15));log('Lo mantienes caliente y limpio. Parece mejorar ('+p.dz.care+'/3).','good');if(p.dz.care>=3&&p.dz.k!=='moquillo'){dfreeP(p,p.dz.k);log(p.name+' se ha curado.','good')}}else log('Tus cuidados no bastan hoy.','warn');draw()}},'Cuidar (Medicina CD 13)'))}
 else if(p.imm&&Object.values(p.imm).some(t=>t>G.t))act.append(h('div',{class:'dim'},'Vacunad'+(p.sex==='f'?'a':'o')+' o inmune a algunos males.'))}
// consumibles
const _useItemDz=useItem;useItem=function(i){const s=G.pc.inv[i];if(s&&(s.id==='elixir_ruda'||s.id==='unguento_azufre')){const rb=s.id==='elixir_ruda',k=rb?'rabia':'sarna';const I=G.pc.inv.splice?G.pc.inf&&G.pc.inf[k]:null;
  if(I&&(!rb||I.st<=1)){takeItem(s.id,1);curePc(k);log(rb?'El elixir sabe a ajo y fuego. La fiebre cede: estás a salvo.':'El ungüento huele a huevo podrido, pero el picor se va.','good');return}
  return log(rb?'No tienes síntomas de rabia. Guarda el elixir para quien lo necesite (puedes dárselo a un compañero desde el panel 🐾).':'No tienes sarna.','warn')}return _useItemDz(i)};
// boticarios y curanderos
const _svcDz=serviceOpts;serviceOpts=function(n,opts){_svcDz(n,opts);if(!['boticario','druida','monje'].includes(n.job))return;if(attitude(n)<-10)return;
 const price=n.job==='boticario'?30:20;
 if(G.pc.inf&&G.pc.inf.rabia)opts.push(O('Tratar la mordedura ('+price+' fl)',()=>{if(G.pc.gold<price)return D(n,'«Sin '+price+' florines, no hay remedio.»',[O('Volver',()=>mainMenu(n))]);addGold(-price);curePc('rabia');return D(n,'Lava la herida con vino, la cauteriza y te da a beber un caldo amargo. «Has llegado a tiempo. Descansa.»',[O('Gracias',()=>mainMenu(n))])}));
 if(G.pc.inf&&G.pc.inf.sarna)opts.push(O('Pedir un remedio para la sarna (8 fl)',()=>{addGold(-8);curePc('sarna');return D(n,'«Azufre y manteca. A las tres noches, sin picor.»',[O('Gracias',()=>mainMenu(n))])}));
 for(const p of petsOf().filter(q=>q.stance!=='carta').slice(0,4)){if(p.dz){const pr=n.job==='boticario'?35:25;opts.push(O('Tratar a '+p.name+' ('+DIS[p.dz.k].n.toLowerCase()+') ('+pr+' fl)',()=>{if(G.pc.gold<pr)return D(n,'«Sin '+pr+' florines no puedo hacer nada.»',[O('Volver',()=>mainMenu(n))]);const k=p.dz.k;const ok=k==='rabia'?p.dz.d<=2:true;addGold(-pr);if(ok){dfreeP(p,k);return D(n,'Examina a '+p.name+', le da una infusión y lo vigila un rato. «Ya está fuera de peligro.»',[O('Gracias',()=>mainMenu(n))])}return D(n,'«Llegas tarde. La rabia ya está demasiado avanzada.»',[O('Volver',()=>mainMenu(n))])}))}
  else if(!(p.imm&&Object.values(p.imm).some(t=>t>G.t+1440*30))){opts.push(O('Vacunar a '+p.name+' (25 fl)',()=>{if(G.pc.gold<25)return D(n,'«Son 25 florines.»',[O('Volver',()=>mainMenu(n))]);addGold(-25);p.imm=p.imm||{};['rabia','moquillo'].forEach(k=>{if(DIS[k].hosts.includes(p.sp))p.imm[k]=G.t+1440*120});hndGain(1);return D(n,'Le aplica una incisión con una mezcla de saliva y hierbas. «Con esto, el mal de la rabia y el moquillo le rondarán sin entrar durante cuatro meses.»',[O('Gracias',()=>mainMenu(n))])}))}}
 opts.push(O('Preguntar por epidemias en la zona',()=>{const e=G.epi&&G.epi[G.zone];const all=Object.keys(G.epi||{}).filter(z=>z!==G.zone).slice(0,2).map(z=>ZINFO[z].n+' ('+DIS[G.epi[z].k].n.toLowerCase()+')');
  return D(n,e?'«Aquí se anda '+DIS[e.k].n.toLowerCase()+' entre '+CREAT[e.sp].n.toLowerCase()+'. Con '+DIS[e.k].sym+'. Evita a los enfermos.»':'«De momento, ningún mal grave entre los animales de la zona.»'+(all.length?' «Aunque se habla de brotes en '+all.join(' y ')+'.»':''),[O('Volver',()=>mainMenu(n))])}))};
// eventos
EVENTS.push(
{id:'perro_rabioso',w:5,ok:c=>!c.night&&!c.inside&&['barcino','martorell','sant_cugat','collserola','vega'].includes(G.zone),run:c=>{const a=newAnimal('perro',G.zone,Math.random,300,Math.random()<.5?'m':'f');dinfect(a,'rabia');a.dz.d=3;a.dz.s=1;a.ob=1;a.x=G.px+3;a.y=G.py;
  const chase=()=>{(G.fauna[G.zone]=G.fauna[G.zone]||[]).push(a);startCombat([animalCombatant(a)],{});return null};
  return EVN('Un perro flaco avanza hacia ti con la cabeza gacha, babeando espuma y gruñendo sin motivo. No parece verte; sólo avanza.',[
   O('Retroceder despacio y dar un rodeo [Sigilo CD 12]',()=>{const r=check('stealth',12);if(r.ok){return EVN('Esperas a que pase. El perro tropieza con una pared y sigue por la calle. Avisas a un guardia.',[evEnd()],'Esquivado','🐕')}(G.fauna[G.zone]=G.fauna[G.zone]||[]).push(a);return EVN('El perro gira la cabeza hacia ti y se lanza.',[O('Defenderte',()=>{startCombat([animalCombatant(a)],{});return evEnd()})],'¡Te ha visto!','⚠')}),
   O('Atacarlo antes de que muerda',()=>{chase();return evEnd()}),
   O('Gritar para alertar a la guardia',()=>{const z=G.zone;addGossip(z,'Un perro rabioso ha asustado a media plaza.');repGain(z,1);return EVN('Los guardias acuden y lo abaten. Te lo agradecen.',[evEnd()],'Alerta','📣')})],'Perro rabioso','🐕')}},
{id:'quemar_carronya',w:6,ok:c=>!c.city&&!c.night&&((G.carc&&G.carc[G.zone]>3)||(G.epi&&G.epi[G.zone])),run:c=>{const e=G.epi&&G.epi[G.zone];return EVN('Encuentras restos de animales muertos'+(e?' con signos de '+DIS[e.k].n.toLowerCase():'')+' tirados bajo un pino. Las moscas lo cubren todo.',[
  O('Examinarlos [Medicina o Naturaleza CD 12]',()=>{const r1=check('medic',12),r2=check('nature',12);const l=LORE.find(x=>x.id==='carbuncoL');if(r1.ok||r2.ok){learnLore(l,true);gainXp(20);return EVN(e?'Reconoces los signos: es '+DIS[e.k].n.toLowerCase()+' ('+DIS[e.k].sym+'). Mejor no tocarlos con las manos desnudas.':'No es nada contagioso, sólo carroña vieja.',[evEnd()],'Diagnóstico','🔍')}return EVN('No sabes decir de qué murieron.',[evEnd()])}),
  O('Quemar los restos (1 h)',()=>{advance(60,{step:30});G.carc[G.zone]=0;if(G.epi)delete G.epi[G.zone];(G.fauna[G.zone]||[]).forEach(a=>{if(a.dz&&a.alive&&Math.random()<.5)dfree(a,a.dz.k)});gainXp(15);repGain(G.zone,1);return EVN('Haces una pira. El humo sube negro. Al amanecer la zona parece menos pesada.',[evEnd()],'Pira','🔥')}),O('Alejarte',()=>evEnd())],'Carroña sospechosa','🪰')}},
{id:'sant_roc',w:50,ok:c=>(c.city||c.town)&&!c.night&&dateOf(G.t).m===7&&dateOf(G.t).d===16&&!G.cd.sant_roc_y&&petsOf().length>0,run:c=>{G.cd.sant_roc_y=G.t+1440*300;return EVN('Es el día de Sant Roc. Frente a la iglesia, una larga fila de perros, asnos y gallinas aguardan la bendición del sacerdote con un cirio.',[
  O('Bendecir a tus compañeros (donativo 5 fl)',()=>{if(G.pc.gold<5)return EVN('«Un donativo, aunque sea humilde.»',[evEnd()]);addGold(-5);petsOf().forEach(p=>{p.imm=p.imm||{};Object.keys(DIS).forEach(k=>{p.imm[k]=Math.max(p.imm[k]||0,G.t+1440*60)});p.loy=Math.min(100,(p.loy||50)+3)});learnLore(LORE.find(x=>x.id==='santroc'),true);repGain(G.zone,1);return EVN('El sacerdote moja el hisopo y bendice a los tuyos. Dicen que durante dos meses ningún mal de pelo o pluma les rozará.',[evEnd()],'Bendición','⛪')},{chk:G.pc.gold>=5}),O('Mirar y marcharte',()=>evEnd())],'Sant Roc','⛪')}},
{id:'ganado_enfermo',w:6,ok:c=>(c.town||c.city)&&!c.night&&['martorell','vega','sant_cugat','collbato','marjal'].includes(G.zone),run:c=>{const n=Object.values(G.npcs).find(x=>x.alive&&x.zone===G.zone&&['pastor','granjero','aldeano','cabrero'].includes(x.job))||Object.values(G.npcs).find(x=>x.alive&&x.zone===G.zone);if(!n)return null;return EVN(n.name+' te para angustiad'+(n.sex==='f'?'a':'o')+': varias de sus cabras tienen fiebre, tropiezan y han muerto dos esta mañana.',[
  O('Examinar el rebaño [Medicina CD 13]',()=>{const r=check('medic',13);if(r.ok){npcAdj(n,6);gainXp(30);const g=ri(10,25);addGold(g);return EVN('Reconoces el carbunco. Ordenas quemar los cadáveres y apartar a las sanas. El brote se detiene. '+n.name+' te paga '+g+' florines.',[evEnd()],'Brote contenido','🐐')}npcAdj(n,-1);return EVN('No consigues identificar el mal. El rebaño sigue enfermando.',[evEnd()],'Sin diagnóstico','🐐')}),
  O('Recomendar un boticario',()=>{npcAdj(n,1);return EVN('«Iré hoy mismo.»',[evEnd()])}),O('Lamentarlo y seguir',()=>evEnd())],'Ganado enfermo','🐐')}});
