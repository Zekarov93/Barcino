// ===================== CARTAS, PIEDRAS Y GEMAS DE ÁNIMA: llevar criaturas contenidas =====================
GD('carta_vinculo','Carta de vínculo','misc',18,.05);GD('piedra_anima','Piedra de ánima','misc',55,.4);GD('gema_anima','Gema de ánima','misc',170,.3);
const CONT={carta:{n:'Carta de vínculo',item:'carta_vinculo',max:1,bonus:0,brk:.35,sk:'animal',ico:'🃏'},piedra:{n:'Piedra de ánima',item:'piedra_anima',max:3,bonus:2,brk:.08,sk:'animal',ico:'🪨'},gema:{n:'Gema de ánima',item:'gema_anima',max:9,bonus:4,brk:0,sk:'arcana',ico:'💎'}};
const CONT_KEYS=Object.keys(CONT);
SHOPS.general.push('carta_vinculo');SHOPS.apo.push('piedra_anima');
RECIPES.push({id:'r_carta',n:'Grabar cartas de vínculo',tool:'alch',st:'alchemy',in:{tinta:1,tela:1},out:['carta_vinculo',2],dc:11,min:90,xp:12},{id:'r_piedra',n:'Tallar piedra de ánima',tool:'alch',st:'alchemy',in:{cristal:1,sal:1},out:['piedra_anima',1],dc:14,min:180,xp:25});
LORE.push({id:'anima',z:['montserrat','collbato','barcino','sant_cugat'],sk:'arcana',dc:12,t:'Los monjes de Montserrat cuentan que el ánima de una bestia puede dormir en un pergamino grabado con tinta de agalla, en una piedra de la montaña o en una gema de cristal. Pero la bestia debe consentir, aunque sea a medias: quien la fuerza, la pierde. Y lo que se guarda dentro, no envejece ni pasa hambre… ni olvida quién lo encerró.'});
function maxStored(){return 3+hndRank()}
function storedPets(){return petsOf().filter(p=>p.stance==='carta')}
function capTier(a){return TIER[a.sp]!=null?TIER[a.sp]:(CREAT[a.sp].monster?4:3)}
function capturable(a){const C=CREAT[a.sp];return!!C&&!C.unique&&a.alive&&!a.e&&!a.tame}
function contHave(k){return invCount(G.pc.inv,CONT[k].item)}
function contFits(k,a){return capTier(a)<=CONT[k].max}
function capNeedRank(a){return Math.max(0,capTier(a)-1)}
function capDC(a,k,hp){ensureCr(a);const f=Math.max(0,Math.min(1,(hp==null?a.hp:hp)/a.maxHp));let dc=(TIER[a.sp]!=null?tameDC(a):14+Math.round((a.gn.agr-.4)*5)-hndRank())+4;
 dc-=Math.round((1-f)*6);dc-=Math.floor((a.bond||0)/15);if(a.lull>G.t)dc-=1;dc-=CONT[k].bonus;if(a.stg===0)dc-=2;return Math.max(7,dc)}
function capWhy(a,k){const C=CREAT[a.sp];if(!capturable(a))return C&&C.unique?'Es una criatura única: ningún contenedor puede retener su ánima.':'No puedes contenerla.';
 if(!contHave(k))return 'No llevas '+CONT[k].n.toLowerCase()+'.';if(!contFits(k,a))return 'Una '+CONT[k].n.toLowerCase()+' es demasiado pequeña para el ánima de '+C.n.toLowerCase()+'.';
 if(hndRank()<capNeedRank(a))return 'Aún no tienes la disciplina: necesitas ser '+HND_RANKS[capNeedRank(a)]+'.';if(storedPets().length>=maxStored())return 'Ya llevas '+maxStored()+' criaturas contenidas; no puedes más con tu rango.';
 if(petsOf().length>=8)return 'Tienes demasiados animales a tu cargo.';return null}
function capSuccess(a,k,hp){const K=CONT[k];takeItem(K.item,1);if(hp!=null)a.hp=Math.max(1,hp);
 const t=capTier(a);adoptCreature(a,{xp:6+t*4,stored:k,loy:42});a.stance='carta';a.cont=k;a.bond=Math.max(45,a.bond||0);a.loy=Math.min(a.loy||42,55);a.capt=1;if(R.cp)R.cp[a.id]=null;
 const kn=crKn(a.sp);kn.obs=(kn.obs||0)+.5;G.journal.push({t:G.t,k:'pet',m:'Contienes a '+a.name+' ('+CREAT[a.sp].n.toLowerCase()+') en una '+K.n.toLowerCase()+'.'})}
// fuera de combate
function capAttempt(a,k){const why=capWhy(a,k);if(why)return{ok:false,msg:why,no:1};const K=CONT[k],C=CREAT[a.sp];
 if(a.lastCap&&G.t-a.lastCap<120)return{ok:false,msg:(a.name||'La criatura')+' desconfía del objeto brillante. Espera un par de horas.',no:1};
 const dc=capDC(a,k);const r=check(K.sk,dc,{label:'Contener con '+K.n.toLowerCase()});advance(20,{step:10});a.lastCap=G.t;
 if(r.ok){capSuccess(a,k);return{ok:true,msg:(a.name)+' se disuelve en luz y se recoge dentro de la '+K.n.toLowerCase()+'.'}}
 let msg=(a.name||C.n)+' se resiste a la '+K.n.toLowerCase()+'.';let fight=false;
 if(r.margin<=-6&&C.aggro>.25){msg=(a.name||C.n)+' rompe el hechizo y se lanza sobre ti.';fight=true}else if(C.flee>.3||a.gn.bold<.4){a.tx=a.x+(a.x>G.px?9:-9);a.ty=a.y+(a.y>G.py?9:-9);a.wait=0;msg+=' Huye asustad'+(a.sex==='f'?'a':'o')+'.'}
 if(Math.random()<K.brk){takeItem(K.item,1);msg+=' La '+K.n.toLowerCase()+' se quiebra.'}a.bond=Math.max(0,(a.bond||0)-2);return{ok:false,msg,fight}}
// en combate
function* capCombat(e,k){if(!e||e.kind!=='animal'||!e.ref){cl('Sólo puedes contener criaturas.','');return'no'}const a=e.ref;const why=capWhy(a,k);if(why){cl(why,'warn');return'no'}
 const K=CONT[k];const dc=capDC(a,k,e.hp);const r=yield* pcCheck(K.sk,dc,{label:'Contener con '+K.n.toLowerCase(),silent:true});cl(r.txt,r.ok?'ok':'bad');
 if(r.ok){capSuccess(a,k,e.hp);e.fled=true;e.captured=1;fx({k:'fled',who:e});cl(e.name+' queda contenid'+(a.sex==='f'?'a':'o')+' en la '+K.n.toLowerCase()+'.','ok');if(alive().length===0){endCombat('talked');return'end'}return'ok'}
 cl(e.name+' se resiste.','bad');if(Math.random()<K.brk){takeItem(K.item,1);cl('La '+K.n.toLowerCase()+' se quiebra.','warn')}if(r.margin<=-6)e.dis=0;return'ok'}
function capButtons(g,B){const t=CV&&CV.sel;let any=0;for(const k of CONT_KEYS){if(!contHave(k))continue;const K=CONT[k];any=1;
  const a=t&&t.kind==='animal'&&t.ref;const info=a?(capWhy(a,k)||'CD '+capDC(a,k,t.hp)+' · '+Math.round(100*t.hp/t.maxHp)+'% PG'):'Selecciona una criatura';
  g.append(B(K.ico,'Contener: '+K.n,info,()=>perform('capture',0,k),'',K.n+'. Cuanto más herida y calmada esté la criatura, más fácil.'))}return any}
// ---- sacar / guardar ----
function inFight(){return G.combat&&!G.combat.over}
function summonPet(p){if(inFight())return log('No puedes manipular los contenedores en pleno combate.','warn');if(activePets().length>=maxPets())return log('No puedes llevar más compañeros fuera con tu rango ('+maxPets()+').','warn');
 const K=CONT[p.cont]||CONT.carta;if((p.loy||50)<20){const r=check('animal',12+Math.round((20-p.loy)/3),{label:'Convencer a '+p.name+' de salir'});if(!r.ok){p.loy=Math.max(0,p.loy-2);return log(p.name+' se niega a salir de su '+K.n.toLowerCase()+'.','warn')}}
 giveItem(K.item,1);p.cont=null;p.stance='seguir';p.zone=G.zone;p.x=G.px+(Math.random()-.5)*1.5;p.y=G.py+1;if(R.cp)R.cp[p.id]=null;log(p.name+' sale de la '+K.n.toLowerCase()+' en un destello.','good');fx&&0}
function storePet(p,k){if(inFight())return log('No puedes manipular los contenedores en pleno combate.','warn');if(!contHave(k))return log('No llevas '+CONT[k].n.toLowerCase()+'.','warn');if(!contFits(k,p))return log(p.name+' es demasiado grande para una '+CONT[k].n.toLowerCase()+'.','warn');
 if(storedPets().length>=maxStored())return log('No puedes llevar más criaturas contenidas ('+maxStored()+').','warn');takeItem(CONT[k].item,1);p.stance='carta';p.cont=k;if(R.cp)R.cp[p.id]=null;log(p.name+' se recoge dentro de su '+CONT[k].n.toLowerCase()+'.','good')}
function capActs(p,act,draw){if(p.stance==='carta'){const K=CONT[p.cont]||CONT.carta;act.append(h('button',{class:'btn pri',onclick:()=>{summonPet(p);draw()}},K.ico+' Sacar de la '+K.n.toLowerCase()));return}
 if(p.ko&&p.ko>G.t)return;CONT_KEYS.forEach(k=>{if(contHave(k)&&contFits(k,p)&&p.stance!=='descansar'||contHave(k)&&contFits(k,p)&&p.stance==='descansar')act.append(h('button',{class:'btn',onclick:()=>{storePet(p,k);draw()}},CONT[k].ico+' Guardar en '+CONT[k].n.toLowerCase()+' ('+contHave(k)+')'))})}
// ---- eventos ----
const _cap_ev=[
{id:'cartomante',w:6,ok:c=>(c.city||c.town)&&!c.night&&!G.cd.cartomante_x,run:c=>{const buy=(k,price)=>O('Comprar '+CONT[k].n.toLowerCase()+' ('+price+' fl)',()=>{if(G.pc.gold<price)return EVN('«Sin '+price+' florines, no hay ánima que guardar.»',[evEnd()]);addGold(-price);giveItem(CONT[k].item,1);return EVN('Te entrega '+CONT[k].n.toLowerCase()+' envuelta en un paño. «Habla con ella antes de usarla. A las bestias les gusta que se las pida.»',[evEnd()],'Trato hecho',CONT[k].ico)},{chk:G.pc.gold>=price});
  const disc=()=>{const r=check('persu',13);if(r.ok){G.pc.flags.cartaDesc=G.t+1440*3;return EVN('Sonríe y te rebaja el precio durante unos días. «Los clientes que regatean saben lo que quieren.»',[evEnd()],'Regateo','🪙')}return EVN('«No es mercadillo.» Se cierra en banda.',[evEnd()],'Sin rebaja','🪙')};
  const hasD=(G.pc.flags.cartaDesc||0)>G.t;const m=hasD?.8:1;const opts=[buy('carta',Math.round(24*m)),buy('piedra',Math.round(68*m))];if(hndRank()>=3)opts.push(buy('gema',Math.round(190*m)));
  opts.push(O('Regatear [Persuasión CD 13]',disc),O('Preguntar por el arte de las cartas',()=>{const l=LORE.find(x=>x.id==='anima');const nw=learnLore(l);return EVN(nw?'La cartomante te explica cómo se graban las cartas y se tallan las piedras. Desde ahora sabes que puedes fabricarlas en un alambique.':'«Ya lo sabes todo lo que yo sé de eso.»',[evEnd()],'El arte del ánima','📜')}),O('Seguir tu camino',()=>evEnd()));
  return EVN('Una mujer con un mazo gigantesco de cartas sin dibujo ofrece contener el ánima de las bestias «para que viajes con ellas sin que te estorben». Mira tus manos y dice: «Todo oficio tiene su cacharro».',opts,'La cartomante','🃏')}},
{id:'piedra_eco',w:5,ok:c=>!c.city&&!c.night&&['montserrat','collbato','ascenso','garraf','collserola'].includes(G.zone),run:c=>EVN('Entre las rocas, una piedra lisa y tibia late débilmente, como si guardara un eco. Está grabada con una espiral.',[
  O('Examinarla [Arcanos CD 12]',()=>{const r=check('arcana',12);if(r.ok){giveItem('piedra_anima',1);const nw=learnLore(LORE.find(x=>x.id==='anima'),true);gainXp(25);return EVN('Reconoces una piedra de ánima vacía, olvidada por algún ermitaño. Está limpia y lista para contener a una criatura.',[evEnd()],'Piedra de ánima','🪨')}return EVN('Sólo ves una piedra bonita. La dejas donde estaba.',[evEnd()])}),
  O('Llevártela sin más',()=>{giveItem('piedra_anima',1);return EVN('Te la guardas. Suena un latido muy lejano, pero la piedra parece normal.',[evEnd()],'Una piedra','🪨')}),O('Dejarla',()=>evEnd())],'Piedra con eco','🪨')},
{id:'inquisidor_cartas',w:6,ok:c=>(c.city||c.town)&&!c.night&&storedPets().some(p=>CREAT[p.sp].monster),run:c=>{const p=pick(storedPets().filter(q=>CREAT[q.sp].monster));return EVN('Un clérigo se detiene ante ti. «Llevas algo que late dentro de ese objeto. Veo un fulgor impío. ¿Qué guardas?»',[
  O('Explicarle la disciplina del adiestramiento [Religión CD 14]',()=>{const r=check('relig',14);if(r.ok){gainXp(30);hndGain(2);return EVN('Citas los escritos de los monjes. El clérigo cede, intrigado: «Si no hay daño…», dice, y bendice tu '+(CONT[p.cont]?CONT[p.cont].n.toLowerCase():'carta')+'.',[evEnd()],'Convencido','⛪')}repGain(G.zone,-2);return EVN('Tus palabras suenan a herejía. Se aleja a buscar a la guardia.',[evEnd()],'Sospechas','⚠')}),
  O('Pagar una «limosna» (20 fl)',()=>{if(G.pc.gold<20)return EVN('«Sin limosna no hay absolución.»',[evEnd()]);addGold(-20);return EVN('El clérigo recoge la moneda con una sonrisa. «Que Dios te guarde… y a lo tuyo».',[evEnd()],'Limosna','🪙')},{chk:G.pc.gold>=20}),
  O('Negar que lleves nada [Engaño CD 13]',()=>{const r=check('decep',13);if(r.ok)return EVN('«No llevo nada.» Te cree… o fingió creerte.',[evEnd()]);infamyGain&&infamyGain(G.zone,2);return EVN('Te ha pillado en la mentira. «Brujería», murmura, y dejas atrás la plaza con prisas.',[evEnd()],'Descubierto','⚠')})],'Ojo del clérigo','⛪')}},
{id:'exhibicion_ani',w:6,ok:c=>(c.city||c.town)&&!c.night&&storedPets().length>0,run:c=>{const p=pick(storedPets());return EVN('Unos niños te ven con tu '+(CONT[p.cont]?CONT[p.cont].n.toLowerCase():'carta')+' y piden, emocionados, que muestres lo que hay dentro.',[
  O('Sacar a '+p.name+' un momento',()=>{const r=check('perf',11);const ok=r.ok&&(p.tag||'').toLowerCase()!=='feroz';p.loy=Math.min(100,(p.loy||40)+(ok?5:1));petLvlXp(p,4);if(ok){addGold(ri(2,8));repGain(G.zone,1.5);return EVN('Los niños aplauden, los vecinos echan monedas en tu gorra y '+p.name+' parece disfrutar el momento antes de volver a su refugio.',[evEnd()],'¡Qué bonito!','🎉')}repGain(G.zone,-1);return EVN(p.name+' se asusta del bullicio y sale escopetad'+(p.sex==='f'?'a':'o')+' hacia un puesto de pescado. Lo recoges entre risas y reprimendas.',[evEnd()],'Caos','🐟')}),
  O('Decir que es un secreto',()=>EVN('Los niños se quedan mirando. Uno susurra: «Es un dragón». No lo desmientes.',[evEnd()],'Misterio','🤫'))],'Exhibición','🃏')}}];
EVENTS.push(..._cap_ev);
// ---- parches de otros módulos que se aplican con sed en build; aquí lo dinámico ----
bus.on('day',()=>{for(const p of petsOf()){if(p.stance!=='carta')continue;p.hp=Math.min(p.maxHp,p.hp+Math.ceil(p.maxHp*.15));if(p.ko&&G.t>=p.ko)p.ko=0}});
CRX.push((a,btns,bg)=>{if(!capturable(a))return;for(const k of CONT_KEYS){if(!contHave(k)||!contFits(k,a))continue;const K=CONT[k];
 btns.append(h('button',{class:'btn',title:'CD '+capDC(a,k),onclick:()=>{closeModal(bg);const r=capAttempt(a,k);log(r.msg,r.ok?'good':'warn');if(r.fight){startCombat([animalCombatant(a)],{});return}if(r.ok){compPanel();return}setTimeout(()=>creatureCard(a),30)}},K.ico+' Contener en '+K.n.toLowerCase()+' (CD '+capDC(a,k)+')'))}});
