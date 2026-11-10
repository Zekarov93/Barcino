// ===================== LOS COMPAÑEROS EN EL MUNDO: reacciones, concursos, olfato y normas de la ciudad =====================
const BIG_PRED=['lobo','lince','oso','cuca_fera'];
function bigPets(){return activePets().filter(p=>CREAT[p.sp].sz>=.8&&CREAT[p.sp].aggro>.3&&CREAT[p.sp].diet!=='herb')}
function petLikes(n){ensurePrefs(n);const L=n.likes||[];return L.includes('animales')||L.includes('naturaleza')||n.tr.warm>=8}
const _reactPets=reactionOf;
reactionOf=function(n){const R=_reactPets(n);const pets=activePets();if(!pets.length)return R;const st=n.flags=n.flags||{};const day=Math.floor(G.t/1440);let adj=0;
 const p=pets[Math.floor(vhash(n.id+day)%pets.length)];const big=bigPets().length>0;
 if(petLikes(n)){R.push({t:cap(n.name.split(' ')[0])+' se agacha a saludar a '+p.name+' y le rasca tras la oreja.',c:'ok'});adj=1.5}
 else if(n.tr.brave<=3&&big){R.push({t:'Se aparta, nervioso, de '+bigPets()[0].name+'.',c:'bad'});adj=-1.5}
 else if(['tendero','panadero','carnicero','boticario','sastre','escribano'].includes(n.job)&&big){R.push({t:'Mira con recelo a '+bigPets()[0].name+': «Ahí fuera, mejor».',c:'bad'});adj=-1}
 else if(n.job==='guardia'&&big&&!hasTool('lead')){R.push({t:'Te advierte que lleves atado a '+bigPets()[0].name+' en la ciudad.',c:'bad'})}
 else if(['concejal','erudito','noble'].includes(n.job)&&pets.some(q=>q.sp==='halcon')&&hasTool('glove')){R.push({t:'Admira a tu halcón: «Cetrería de verdad, hace años que no la veo».',c:'ok'});adj=1.5}
 else if(pets.some(q=>(q.tag||'').toLowerCase().startsWith('manso')||(q.tag||'').toLowerCase().startsWith('sociable'))&&n.tr.warm>=5){R.push({t:'Sonríe al ver lo manso que es '+p.name+'.',c:'ok'});adj=.8}
 if(adj&&st.petDay!==day){st.petDay=day;npcAdj(n,adj)}return R};
// guardias y animales grandes en la ciudad
EVENTS.push(
{id:'guardia_bestia',w:9,ok:c=>c.city&&!c.night&&bigPets().length>0&&!hasTool('lead')&&!G.pc.flags.petPermit,run:c=>{const g=npcNear(c,x=>x.job==='guardia')||Object.values(G.npcs).find(x=>x.alive&&x.zone===c.z&&x.job==='guardia');if(!g)return null;const p=bigPets()[0];
  return EVN(g.name+' te corta el paso: «Las bestias sueltas no entran en Barcino. Átala, o ven con una multa de diez florines.» Señala a '+p.name+'.',[
   O('Pagar la multa (10 fl)',()=>{if(G.pc.gold<10)return EVN('No tienes tanto. Tendrás que alejarte.',[evEnd()]);addGold(-10);G.pc.flags.petPermit=G.t;return EVN('Paga y guarda el recibo. «Para la próxima, una correa.»',[evEnd()],'Multa','🛡')}),
   O('Argumentar que está bien educado [Persuasión/Trato con animales CD 13]',()=>{const r1=check('persu',13),r2=check('animal',13);if(r1.ok||r2.ok){G.pc.flags.petPermit=G.t;npcAdj(g,4);gainXp(30);return EVN(g.name+' observa a '+p.name+', que se sienta sin que se lo pidas. «De acuerdo. Pero a la primera queja, fuera.»',[evEnd()],'Bien educado','🐾')}npcAdj(g,-3);return EVN('No le convences. Tienes que apartar a '+p.name+' o pagar.',[evEnd()],'Rechazo','🛡')}),
   O('Dejar a '+p.name+' esperando en las afueras',()=>{p.stance='descansar';return EVN(p.name+' se queda en casa. Gruñe una vez y se tumba.',[evEnd()])})],'Bestias en la ciudad','🐺')}},
{id:'concurso_animales',w:8,ok:c=>(c.city||c.town)&&!c.night&&activePets().length>0&&(!!c.fest||dateOf(G.t).dow===6),run:c=>{const p=pick(activePets());ensureCr(p);const C=CREAT[p.sp];
  const score=(cat)=>{let s=0;if(cat==='belleza')s=(p.hp/p.maxHp)*30+p.gn.coat*10+(p.gn.size>1.05?8:0)+(p.sat||50)*.2+(p.gen||0)*4;else if(cat==='obediencia')s=(p.loy||50)*.5+(p.lvl||1)*5+(p.gn.doc*20)+(p.tag.toLowerCase().startsWith('manso')?8:0);else s=p.maxHp*1.2+(p.lvl||1)*4+(p.sp==='asno'?20:0)+(C.sz*10);return s+skillMod('animal')*2};
  const run=(cat,l,t)=>O(l,()=>{const mine=score(cat),rivals=[score(cat)*0+25+Math.random()*30,25+Math.random()*30,20+Math.random()*30];const best=Math.max(...rivals);const win=mine>best;const pos=1+rivals.filter(r=>r>mine).length;
    if(win){const g=20+Math.round(mine/2);addGold(g);repGain(c.z,3);hndGain(6);petLvlXp(p,25);p.loy=Math.min(100,(p.loy||50)+4);return EVN(p.name+' gana el concurso de '+t+'. Premio: '+g+' florines y una cinta azul. El público aplaude.',[evEnd()],'¡Ganador!','🏆')}
    hndGain(2);petLvlXp(p,8);return EVN(p.name+' queda en el puesto '+pos+'º del concurso de '+t+'. «Para la próxima», dice el juez.',[evEnd()],'Concurso','🎗')});
  return EVN('Han montado un concurso de animales en la plaza. Los dueños se alinean con sus bestias; el juez mira con aire solemne a '+p.name+'.',[run('belleza','Inscribir a '+p.name+' en «Mejor porte»','porte'),run('obediencia','Inscribir a '+p.name+' en «Obediencia»','obediencia'),run('fuerza','Inscribir a '+p.name+' en «Fuerza y resistencia»','fuerza'),evEnd('Mirar desde la grada')],'Concurso de animales','🏆')}},
{id:'olfato_secreto',w:6,ok:c=>(c.city||c.town)&&!c.night&&activePets().some(p=>['perro','lobo','gineta','zorro'].includes(p.sp)&&(p.lvl||1)>=2),run:c=>{const p=activePets().find(q=>['perro','lobo','gineta','zorro'].includes(q.sp)&&(q.lvl||1)>=2);const n=Object.values(G.npcs).find(x=>x.alive&&x.zone===c.z&&x.sec&&!x.flags.secretKnown&&['cadaver','veneno','hermano_muerto','tesoro','reliquia','hijo_bandido','deuda_sombra'].includes(x.sec));if(!n)return null;
  return EVN(p.name+' se detiene, olfatea el suelo ante la casa de '+n.name+' y empieza a ladrar con insistencia, rascando el umbral.',[
   O('Investigar discretamente [Investigación CD 13]',()=>{const r=check('invest',13);if(r.ok){n.flags.secretKnown=true;learn(n,'sec',true);petLvlXp(p,15);gainXp(40);npcAdj(n,-4);return EVN('Entre las lascas de la puerta ves algo que no debería estar ahí. Ahora sabes que '+n.secT+'.',[evEnd()],'Un rastro','🐾')}petLvlXp(p,4);return EVN('No encuentras nada concluyente, y '+n.name+' te mira de reojo desde la ventana.',[evEnd()],'Un rastro','🐾')}),
   O('Calmar a '+p.name+' y marcharte',()=>{p.loy=Math.min(100,(p.loy||50)+1);return null})],'El olfato de '+p.name,'🐾')}},
{id:'mascota_trucos',w:5,ok:c=>(c.city||c.town)&&!c.night&&activePets().some(p=>(p.tag||'').toLowerCase().match(/curios|sociab|mans/)),run:c=>{const p=activePets().find(q=>(q.tag||'').toLowerCase().match(/curios|sociab|mans/));
  return EVN('En la plaza un juglar hace malabares con bolas de colores. '+p.name+' lo observa con la cabeza ladeada, claramente tentad'+(p.sex==='f'?'a':'o')+' de imitarlo.',[
   O('Hacer un número juntos [Interpretación/Trato CD 12]',()=>{const r=check('perf',12),r2=check('animal',12);if(r.ok||r2.ok){const g=4+Math.floor(Math.random()*10);addGold(g);petLvlXp(p,10);repGain(c.z,1);return EVN('El público se junta alrededor de vosotros. Caen '+g+' florines en tu sombrero.',[evEnd()],'¡Bravo!','🎪')}return EVN(p.name+' se escapa tras una paloma con las bolas. Risas, pero ni una moneda.',[evEnd()],'Fracaso','🎪')}),
   evEnd('Dejarlo pasar')],'Truco en la plaza','🎪')}}
);
// con guardia al lado nadie te roba
const _carterista=EVENTS.find(e=>e.id==='fest_carterista');if(_carterista){const _run=_carterista.run;_carterista.run=function(c){const g=activePets().find(p=>p.stance==='guardar'&&['perro','lobo','gineta','cuervo'].includes(p.sp));if(g){petLvlXp(g,6);return EVN('Entre la multitud, '+g.name+' gruñe a un muchacho que se acercaba a tu bolsillo. Sale corriendo sin mirar atrás.',[evEnd()],'Guardián','🐕')}return _run(c)}}
// el permiso de bestia caduca
bus.on('day',()=>{const f=G.pc&&G.pc.flags;if(f&&f.petPermit&&G.t-f.petPermit>1440*30)f.petPermit=0});
