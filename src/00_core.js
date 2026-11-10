// ===================== CORE: azar, dados, calendario, comprobaciones =====================
const GAME_VERSION = 1;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
let RNG=Math.random;
const rnd=()=>RNG();
const ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const pick=(arr,r)=>arr[Math.floor((r||rnd)()*arr.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const dist=(ax,ay,bx,by)=>Math.hypot(ax-bx,ay-by);
function wpick(items,wf,r){let t=0;const ws=items.map(i=>{const w=Math.max(0,wf(i));t+=w;return w});if(t<=0)return null;let x=(r||rnd)()*t;for(let i=0;i<items.length;i++){x-=ws[i];if(x<=0)return items[i]}return items[items.length-1]}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor((r||rnd)()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
let G=null; // estado de partida

// ---------- dados ----------
function d(n){return ri(1,n)}
function roll(expr){const m=/^(\d+)d(\d+)([+-]\d+)?$/.exec(String(expr).replace(/\s/g,''));if(!m)return{total:+expr||0,rolls:[],bonus:0};const n=+m[1],s=+m[2],b=m[3]?+m[3]:0;const rolls=[];let t=b;for(let i=0;i<n;i++){const r=d(s);rolls.push(r);t+=r}return{total:t,rolls,bonus:b}}
function rollCrit(expr){const m=/^(\d+)d(\d+)([+-]\d+)?$/.exec(expr);if(!m)return roll(expr);return roll((+m[1]*2)+'d'+m[2]+(m[3]||''))}
const DICE={manual:true,gate:0,queue:[]};try{DICE.manual=localStorage.getItem('rpg_dice')!=='auto'}catch(e){}
class NeedRoll extends Error{constructor(w){super('NeedRoll');this.w=w}}
function d20(mode,why){
 if(why&&DICE.manual){const need=mode?2:1;
  if(DICE.queue.length>=need){const a=DICE.queue.shift(),b=need>1?DICE.queue.shift():null;
   if(mode>0)return{r:Math.max(a,b),a,b,mode:1};if(mode<0)return{r:Math.min(a,b),a,b,mode:-1};return{r:a,a,b:null,mode:0}}
  if(DICE.gate>0)throw new NeedRoll(Object.assign({},why,{mode}))}
 const a=d(20),b=d(20);if(mode>0)return{r:Math.max(a,b),a,b,mode:1};if(mode<0)return{r:Math.min(a,b),a,b,mode:-1};return{r:a,a,b:null,mode:0}}

// ---------- atributos ----------
const AB=['str','dex','con','int','wis','cha'];
const ABN={str:'Fuerza',dex:'Destreza',con:'Constitución',int:'Inteligencia',wis:'Sabiduría',cha:'Carisma'};
const ABS={str:'FUE',dex:'DES',con:'CON',int:'INT',wis:'SAB',cha:'CAR'};
const mod=s=>Math.floor((s-10)/2);
const fmt=n=>(n>=0?'+':'')+n;
const pbOf=l=>2+Math.floor((l-1)/4);
const XPT=[0,300,900,2700,6500,14000,23000,34000,48000,64000,85000];
const MAXLEVEL=10;
const SKILLS=[
{id:'acro',n:'Acrobacias',ab:'dex'},{id:'animal',n:'Trato con animales',ab:'wis'},{id:'arcana',n:'Arcanos',ab:'int'},{id:'athl',n:'Atletismo',ab:'str'},
{id:'decep',n:'Engaño',ab:'cha'},{id:'hist',n:'Historia',ab:'int'},{id:'insight',n:'Perspicacia',ab:'wis'},{id:'intim',n:'Intimidación',ab:'cha'},
{id:'invest',n:'Investigación',ab:'int'},{id:'medic',n:'Medicina',ab:'wis'},{id:'nature',n:'Naturaleza',ab:'int'},{id:'percep',n:'Percepción',ab:'wis'},
{id:'perf',n:'Interpretación',ab:'cha'},{id:'persu',n:'Persuasión',ab:'cha'},{id:'relig',n:'Religión',ab:'int'},{id:'sleight',n:'Juego de manos',ab:'dex'},
{id:'stealth',n:'Sigilo',ab:'dex'},{id:'survival',n:'Supervivencia',ab:'wis'}];
const SK=Object.fromEntries(SKILLS.map(s=>[s.id,s]));
const TOOLS={smith:'Herramientas de herrero',carp:'Herramientas de carpintero',alch:'Suministros de alquimista',cook:'Utensilios de cocinero',leath:'Herramientas de peletero',weav:'Herramientas de tejedor',herb:'Kit de herboristería',thief:'Herramientas de ladrón',brew:'Suministros de vinatero',mason:'Herramientas de albañil'};

// ---------- calendario ----------
const MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const MCUM=[0,31,59,90,120,151,181,212,243,273,304,334,365];
const DOW=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
const SEASONS=['Primavera','Verano','Otoño','Invierno'];
const START_YEAR=1042;
function mkT(y,m,dd,h,mi){return(((y-START_YEAR)*365)+MCUM[m]+(dd-1))*1440+h*60+(mi||0)}
function dateOf(t){const days=Math.floor(t/1440),mins=t-days*1440;const y=START_YEAR+Math.floor(days/365);const doy=days%365;let m=0;while(m<11&&doy>=MCUM[m+1])m++;return{days,y,doy,m,d:doy-MCUM[m]+1,h:Math.floor(mins/60),mi:Math.floor(mins%60),dow:days%7,hf:mins/60}}
function seasonOf(doy){if(doy>=354||doy<79)return 3;if(doy<171)return 0;if(doy<264)return 1;return 2}
function sunTimes(doy){const s=Math.cos(2*Math.PI*(doy-172)/365);return{rise:7.2-1.0*s,set:19.2+1.9*s,s}}
const PHASES=['Noche profunda','Amanecer','Mañana','Día','Tarde','Crepúsculo','Noche'];
function phaseOf(t){const D=dateOf(t);const{rise,set}=sunTimes(D.doy);const h=D.hf;let id;
 if(h<rise-1)id=0;else if(h<rise+0.5)id=1;else if(h<11.5)id=2;else if(h<15.5)id=3;else if(h<set-1)id=4;else if(h<set+1)id=5;else id=6;
 return{id,name:PHASES[id],night:id===0||id===6,dark:id===0||id===6||(id===5&&h>set+0.3)||(id===1&&h<rise-0.3)}}
function sunLevel(t){const D=dateOf(t);const{rise,set}=sunTimes(D.doy);const h=D.hf;const el=Math.sin(Math.PI*(h-rise)/(set-rise));return el} // <0 noche
function fmtTime(t){const D=dateOf(t);return String(D.h).padStart(2,'0')+':'+String(D.mi).padStart(2,'0')}
function fmtDate(t){const D=dateOf(t);return D.d+' de '+MONTHS[D.m]+' de '+D.y}
const FESTS=[
{id:'anyo',n:'Cap d\'Any',m:11,d:31,len:2,desc:'Las doce uvas al compás de las campanas.',goods:['vino','uvas'],bonus:'Plazas llenas de gente brindando.'},
{id:'reyes',n:'Cabalgata de Reyes',m:0,d:5,len:2,desc:'Desfile de carrozas por la Rambla y caramelos para los niños.',goods:['turron','panellets']},
{id:'eulalia',n:'Santa Eulàlia',m:1,d:12,len:2,desc:'Fiesta de la patrona de Barcino: gigantes y cabezudos recorren las calles.',goods:['turron','panellets']},
{id:'carnaval',n:'Carnestoltes',m:1,d:25,len:2,desc:'Máscaras, disfraces y el entierro de la sardina.',goods:['sardina']},
{id:'jordi',n:'Sant Jordi',m:3,d:23,len:1,desc:'Se regalan rosas y libros. Dicen que la sangre del dragón floreció en rosas.',goods:['rosas','libro_g']},
{id:'moreneta',n:'Fiesta de la Moreneta',m:3,d:27,len:1,desc:'Peregrinos suben a Montserrat a ver a la Virgen Morena.',goods:['miel','mato']},
{id:'joan',n:'Revetlla de Sant Joan',m:5,d:23,len:2,desc:'Hogueras, cohetes y la flama del Canigó cruzan la noche más corta del año.',goods:['cocas','vino']},
{id:'gracia',n:'Fiesta Mayor de Gràcia',m:7,d:15,len:7,desc:'Las calles compiten por la decoración más fantástica.',goods:['cerveza']},
{id:'diada',n:'Diada',m:8,d:11,len:1,desc:'Día de memoria y banderas en las plazas.',goods:[]},
{id:'merce',n:'La Mercè',m:8,d:24,len:3,desc:'Castellers, correfocs y bestias de fuego: la gran fiesta de Barcino.',goods:['vino','cocas']},
{id:'castanyada',n:'La Castanyada',m:9,d:31,len:2,desc:'Castañas asadas, panellets y boniatos para los difuntos.',goods:['castanas','panellets']},
{id:'nadal',n:'Nadal',m:11,d:24,len:3,desc:'El Tió de Nadal «caga» regalos y se come escudella.',goods:['turron','carne_cerdo']}
];
function festAt(t){const D=dateOf(t);for(const f of FESTS){const s=MCUM[f.m]+f.d-1;for(let k=0;k<f.len;k++){if((s+k)%365===D.doy)return f}}return null}
function nextFest(t){const D=dateOf(t);let best=null,bd=999;for(const f of FESTS){let s=MCUM[f.m]+f.d-1;let dd=s-D.doy;if(dd<0)dd+=365;if(dd<bd){bd=dd;best=f}}return{f:best,days:bd}}

// ---------- bus / log ----------
const bus={h:{},on(e,f){(this.h[e]=this.h[e]||[]).push(f)},off(e,f){const l=this.h[e];if(l){const i=l.indexOf(f);if(i>=0)l.splice(i,1)}},emit(e,a,b){(this.h[e]||[]).slice().forEach(f=>f(a,b))}};
function log(msg,cls){if(!G)return;G.logs.push({t:G.t,m:msg,c:cls||''});if(G.logs.length>200)G.logs.shift();bus.emit('log',msg,cls||'')}
function toast(msg,cls){bus.emit('toast',msg,cls||'')}

// ---------- estado derivado del PJ ----------
function eqItems(){return Object.values(G.pc.eq).filter(Boolean)}
function hasFeat(id,who){return(who||G.pc).feats.indexOf(id)>=0}
function skillMod(sk,who){const p=who||G.pc;const s=SK[sk];let m=mod(p.abil[s.ab]);const pr=p.skills[sk]||0;m+=pr*pbOf(p.level);
 if(p.bon&&p.bon[sk])m+=p.bon[sk];
 if(p===G.pc){for(const it of eqItems()){const I=ITEMS[it.id];if(I&&I.bon&&I.bon[sk])m+=I.bon[sk]}
  if(G.pc.needs&&G.pc.needs.hunger>85)m-=2;if(G.pc.needs&&G.pc.needs.fatigue>85)m-=2}
 return m}
function passive(sk,who){let v=10+skillMod(sk,who);const p=who||G.pc;if(p.feats&&p.feats.indexOf('observant')>=0&&(sk==='percep'||sk==='invest'))v+=5;return v}
function abMod(a,who){return mod((who||G.pc).abil[a])}
function levelFromXp(xp){let l=1;while(l<MAXLEVEL&&xp>=XPT[l])l++;return l}
function dcLabel(dc){return dc<=8?'Trivial':dc<=11?'Fácil':dc<=14?'Media':dc<=17?'Difícil':dc<=20?'Muy difícil':'Casi imposible'}
// Comprobación de habilidad del jugador. o:{adv,bonus,ab (usar otra característica),label,silent,noInsp}
function checkWhy(sk,dc,o){o=o||{};const p=G.pc;let bonus=skillMod(sk);if(o.ab){bonus=bonus-abMod(SK[sk].ab)+abMod(o.ab)}bonus+=(o.bonus||0);let adv=o.adv||0;if(p.needs&&p.needs.hunger>95)adv-=1;
 return{why:{t:'check',label:o.label||SK[sk].n,bonus,dc},mode:clamp(adv,-1,1)}}
function check(sk,dc,o){o=o||{};const p=G.pc;let bonus=skillMod(sk);if(o.ab){bonus=bonus-abMod(SK[sk].ab)+abMod(o.ab)}bonus+=(o.bonus||0);
 let adv=o.adv||0;if(p.needs&&p.needs.hunger>95)adv-=1;
 const why=(o.auto||(o.silent&&!o.roll))?null:{t:'check',label:o.label||SK[sk].n,bonus,dc};
 let r=d20(clamp(adv,-1,1),why);let nat=r.r;let total=nat+bonus;let ok=(nat===20)||(nat!==1&&total>=dc);let note='';
 if(!ok&&!o.noInsp){if(p.inspiration){p.inspiration=false;const r2=d20(0);note='Inspiración heroica: repites la tirada (d20='+r2.r+').';nat=r2.r;total=nat+bonus;ok=nat===20||(nat!==1&&total>=dc)}
  else if(hasFeat('lucky')&&p.luck>0){p.luck--;const r2=d20(0);note='Punto de suerte: repites la tirada (d20='+r2.r+').';nat=r2.r;total=nat+bonus;ok=nat===20||(nat!==1&&total>=dc)}
  else if(p.species==='halfling'&&nat===1){const r2=d20(0);note='Suerte de mediano: repites el 1 (d20='+r2.r+').';nat=r2.r;total=nat+bonus;ok=nat===20||(nat!==1&&total>=dc)}}
 const res={ok,nat,total,dc,bonus,adv,sk,note,margin:total-dc,crit:nat===20,fumble:nat===1,txt:''};
 res.txt=(o.label||SK[sk].n)+': d20('+nat+')'+fmt(bonus)+' = '+total+' vs CD '+dc+' → '+(ok?'ÉXITO':'FALLO')+(nat===20?' (¡crítico!)':nat===1?' (pifia)':'');
 if(!o.silent){log(res.txt,ok?'ok':'bad');bus.emit('roll',res)}
 return res}
function saveWhy(ab,dc,o){o=o||{};const p=G.pc;let b=abMod(ab);if(p.saves.indexOf(ab)>=0)b+=pbOf(p.level);if(o.bonus)b+=o.bonus;let adv=o.adv||0;if(p.species==='gnome'&&(ab==='int'||ab==='wis'||ab==='cha'))adv=1;if(p.species==='dwarf'&&o.poison)adv=1;return{why:{t:'save',label:'Salvación de '+ABN[ab],bonus:b,dc},mode:adv}}
function saveCheck(ab,dc,o){o=o||{};const p=G.pc;let b=abMod(ab);if(p.saves.indexOf(ab)>=0)b+=pbOf(p.level);if(o.bonus)b+=o.bonus;
 let adv=o.adv||0;if(p.species==='gnome'&&(ab==='int'||ab==='wis'||ab==='cha'))adv=1;if(p.species==='dwarf'&&o.poison)adv=1;
 const r=d20(adv,o.auto?null:{t:'save',label:'Salvación de '+ABN[ab],bonus:b,dc});const total=r.r+b;const ok=r.r===20||(r.r!==1&&total>=dc);return{ok,nat:r.r,total,dc,txt:'Salvación de '+ABN[ab]+': d20('+r.r+')'+fmt(b)+' = '+total+' vs CD '+dc+' → '+(ok?'ÉXITO':'FALLO')}}

// ---------- utilidades varias ----------
function copyJSON(o){return JSON.parse(JSON.stringify(o))}
function fmtGold(n){return Math.round(n).toLocaleString('es-ES')+' fl'}
function relWord(a){return a<=-70?'Enemigo jurado':a<=-40?'Hostil':a<=-15?'Desconfiado':a<15?'Neutral':a<40?'Amistoso':a<70?'Aliado':'Íntimo'}
function dirName(dx,dy){const a=Math.atan2(dy,dx);const n=['este','sureste','sur','suroeste','oeste','noroeste','norte','noreste'];return n[(Math.round(a/(Math.PI/4))+8)%8]}
