// ===================== CONOCIMIENTO GRADUAL DE PERSONAJES =====================
// n.kn = {clave:1}. Claves: job, fn, home, age, pers, social, quirk, sched, fav, why, bio0..2, sec, r:<id>
function bname(id){const b=id&&bldAny(id);return b?(b.n||b.name||id):''}
function ensureKn(n){if(n.kn)return n.kn;const k={};if(n.met){k.job=1;k.age=1}
 for(let i=0;i<(n.bioKnown||0);i++)k['bio'+i]=1;if(n.flags&&n.flags.secretKnown)k.sec=1;if((n.known||0)>=2){k.pers=1;k.home=1}n.kn=k;return k}
function knows(n,key){return !!ensureKn(n)[key]}
const KN_TXT={job:'su oficio',fn:'qué hace por la comarca',home:'dónde vive',age:'su edad',pers:'cómo es de carácter',social:'su trato con la gente',quirk:'sus manías',sched:'su rutina',fav:'dónde suele beber',why:'por qué viaja',sec:'su secreto'};
function learn(n,key,quiet){const k=ensureKn(n);if(k[key])return false;k[key]=1;n.known=Math.max(n.known||0,Math.min(3,Math.floor(knProgress(n)*4)));
 if(!quiet){const t=KN_TXT[key]||(key.startsWith('r:')&&G.npcs[key.slice(2)]?'su relación con '+G.npcs[key.slice(2)].name:key.startsWith('bio')?'parte de su pasado':'algo');log('Has averiguado '+t+' de '+n.name+'.','sys')}return true}
function knTotal(n){let t=9;if(n.traveler)t++;t+=(n.bio||[]).length;t+=Object.keys(n.rel||{}).filter(i=>(n.rel[i].v!==0||REL[n.rel[i].k].g==='fam')&&REL[n.rel[i].k].g!=='soc'||n.rel[i].k==='amigo').length;if(n.sec)t++;return t}
function knProgress(n){const k=ensureKn(n);return Math.min(1,Object.keys(k).length/Math.max(1,knTotal(n)))}
function learnSome(n,keys,count){const k=ensureKn(n);const c=keys.filter(x=>!k[x]);let got=0;while(c.length&&got<(count||1)){const i=Math.floor(Math.random()*c.length);if(learn(n,c.splice(i,1)[0]))got++}return got}
const KN_BASIC=['fn','home','social','quirk','sched','fav'];
function relKeys(n){return Object.keys(n.rel||{}).filter(i=>G.npcs[i]&&REL[n.rel[i].k]&&REL[n.rel[i].k].g!=='soc'||(G.npcs[i]&&n.rel[i]&&n.rel[i].k==='amigo')).map(i=>'r:'+i)}
// charlar: a veces se aprende algo cotidiano
function chatLearn(n){const a=attitude(n);if(Math.random()<.35+a/200){const pool=KN_BASIC.slice();if(a>=10)pool.push(...relKeys(n).filter(k=>n.rel[k.slice(2)].pub||a>=25));if(n.traveler)pool.push('why');return learnSome(n,pool,1)}return 0}
// rumor desde otro NPC sobre un tercero
function aboutMenu(n){const ids=Object.keys(n.rel).filter(i=>G.npcs[i]&&G.npcs[i].alive).sort((a,b)=>Math.abs(n.rel[b].v)-Math.abs(n.rel[a].v)).slice(0,6);
 const opts=ids.map(i=>{const o=G.npcs[i];const known=o.met||knows(o,'job');return O('Preguntar por '+(known?o.name:'su '+relWordOf(n,o)),()=>aboutNpc(n,o))});
 opts.push(O('Volver',()=>mainMenu(n)));return D(n,ids.length?'«¿De quién quieres saber?»':'«No trato con mucha gente.»',opts)}
function aboutNpc(n,o){const a=attitude(n);const r=n.rel[o.id];const w=relWordOf(n,o);const base=REL[r.k].g;let t;
 const warmth=r.v>=15?'bien':r.v<=-15?'mal':'regular';
 const opin=r.v>=40?'Lo aprecio muchísimo.':r.v>=15?'Es buena gente.':r.v<=-40?'No lo soporto y no pienso disimularlo.':r.v<=-15?'Prefiero no cruzármelo.':'Nos tratamos lo justo.';
 if(!o.met&&!knows(o,'job'))learn(o,'job',true);
 t='«Es mi '+w+': '+o.name+', '+npcTitle(o).toLowerCase()+'. '+opin+'»';
 const got=[];if(a>=-5)got.push(learn(o,'home',true)&&'dónde vive');
 if(a>=10&&learn(o,'fn',true))got.push('qué hace');if(a>=15&&learn(o,'pers',true))got.push('su carácter');
 if(learn(o,'r:'+n.id,true))got.push('su relación con '+n.name);if(!knows(n,'r:'+o.id)){learn(n,'r:'+o.id,true);got.push('lo que '+n.name+' piensa de '+o.name)}
 const g=got.filter(Boolean);if(g.length)t+='\n(Has averiguado: '+g.join(', ')+'.)';
 if(r.v<=-30&&a>=20&&Math.random()<.5){t+='\n«Entre tú y yo, ha hecho cosas que no se perdonan.»';learn(o,'quirk',true)}
 npcAdj(n,1);return D(n,t,[O('Preguntar por otra persona',()=>aboutMenu(n)),O('Volver',()=>mainMenu(n))])}
// ---- ficha ----
function npcSheet(n){ensurePrefs(n);ensureKn(n);return modal('Ficha de '+n.name,(b)=>{const a=attitude(n);const K=n.kn;const pr=knProgress(n);const Q0=()=>h('span',{class:'dim'},'«sin averiguar»');
 const row=(l,v)=>h('div',{class:'frow'},h('b',{},l+': '),v);
 b.append(h('div',{class:'contact'},npcPortrait(n,80),h('div',{},h('b',{},n.name),h('div',{class:'dim'},SPECIES[n.sp]?SPECIES[n.sp].n:n.sp,K.age?' · '+n.age+' años':' · edad desconocida'),h('div',{class:'dim'},K.job?npcTitle(n):'Oficio desconocido'),h('div',{},'Actitud: '+relWord(a)+' ('+a+')'+(n.romance>10?' · ♥'+Math.round(n.romance):'')),h('div',{class:'attbar'},h('i',{style:'left:'+(pr*100)+'%'})),h('div',{class:'dim'},'Lo conoces: '+Math.round(pr*100)+'%'))));
 b.append(h('h4',{},'Vida'));
 b.append(row('Función',K.fn?(JOB[n.job]&&JOB[n.job].fn||'Se gana la vida como puede.'):Q0()));
 b.append(row(n.traveler?'Procedencia':'Hogar',n.traveler?(K.home?'viene de '+(n.origin||'lejos')+', sin domicilio fijo':Q0()):K.home?(n.home?bname(n.home)||ZINFO[n.zone].n:ZINFO[n.zone].n)+' ('+ZINFO[n.zone].n+')':Q0()));
 if(!n.traveler&&n.work)b.append(row('Trabaja en',K.sched?bname(n.work)||'—':Q0()));else if(!n.traveler)b.append(row('Rutina',K.sched?'trabaja por la calle':Q0()));
 if(n.traveler)b.append(row('Su porqué',K.why&&n.why?n.why.t:Q0()));
 if(n.fav&&!n.traveler)b.append(row('Suele beber en',K.fav?bname(n.fav):Q0()));
 b.append(h('h4',{},'Personalidad'),row('Carácter',K.pers?(traitWords(n).join(', ')||'Equilibrado'):Q0()),row('Trato',K.social||n.disc.social?socialWord(n.social):Q0()),row('Manías',K.quirk&&n.quirk?n.quirk:Q0()));
 const li=(arr,map)=>arr.length?arr.map(map).join(', '):'—';
 b.append(h('h4',{},'Le gusta hablar de'),h('div',{class:'ok'},li(n.disc.likes,k=>TOPICS[k])+(n.disc.likes.length<n.likes.length?' · ('+(n.likes.length-n.disc.likes.length)+' por descubrir)':'')));
 b.append(h('h4',{},'Prefiere evitar'),h('div',{class:'bad'},li(n.disc.dislikes,k=>TOPICS[k])+(n.disc.dislikes.length<n.dislikes.length?' · ('+(n.dislikes.length-n.disc.dislikes.length)+' por descubrir)':'')));
 b.append(h('h4',{},'Lo que le atrae en los demás'),h('div',{},li(n.disc.attr,k=>ATTRACT[k].n)+(n.disc.attr.length<n.attr.length?' · ('+(n.attr.length-n.disc.attr.length)+' por descubrir)':'')));
 const rk=Object.keys(n.rel||{}).filter(i=>G.npcs[i]&&K['r:'+i]);const rt=relKeys(n).length;
 b.append(h('h4',{},'Relaciones'));if(rk.length){rk.forEach(i=>{const o=G.npcs[i],r=n.rel[i];b.append(h('div',{class:r.v<=-15?'bad':r.v>=15?'ok':''},cap(relWordOf(n,o))+': '+(o.met||K.job&&knows(o,'job')?o.name:'alguien de '+ZINFO[o.zone].n)+(r.v>=40?' (mucho cariño)':r.v<=-40?' (odio profundo)':'')))})}else b.append(h('div',{class:'dim'},'No sabes con quién trata.'));
 if(rt>rk.length)b.append(h('div',{class:'dim'},'… hay vínculos por averiguar. Pregunta a su gente.'));
 b.append(h('h4',{},'Trasfondo'));const nb=(n.bio||[]).length;let any=0;(n.bio||[]).forEach((t,i)=>{if(K['bio'+i]){any=1;b.append(h('p',{class:'dim'},t))}});if(!any)b.append(h('div',{class:'dim'},'Nada. Gánate su confianza y pregúntale por su vida.'));else if((n.bio||[]).some((t,i)=>!K['bio'+i]))b.append(h('p',{class:'dim'},'… hay más por saber.'));
 if(n.sec){b.append(h('h4',{},'Secreto'));b.append(K.sec||n.flags.secretKnown?h('div',{class:'bad'},cap(n.secT)+'.'):h('div',{class:'dim'},'Sospechas que oculta algo… o no.'))}
 b.append(h('div',{class:'btns'},h('button',{class:'btn',onclick:()=>closeModal()},'Cerrar')))},{wide:1})}
