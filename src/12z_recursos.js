// ===================== PUNTOS DE RECURSO: se agotan, se regeneran y dependen de la estación =====================
const MON=()=>dateOf(G.t).m;
const RN={
 carbonera:{n:'Carbonera',ico:'🔥',w:30,h:24,max:4,rg:()=>3,d:'Un montón de leña cubierto de tierra que arde sin llama durante días. Los carboneros la vigilan noche y día. Cuando se enfría, queda carbón.',
  acts:[{l:'Sacar carbón de la pila',sk:'survival',dc:10,min:45,use:1,out:[['carbon',[2,4]],['ceniza',[0,1]]],fail:{hp:2,msg:'Una racha de brasa te quema la mano. −2 PG.'},xp:10},
   {l:'Alimentar la carbonera con leña (2 de madera)',sk:'survival',dc:9,min:60,cost:{madera:2},add:2,xp:8,note:'Repone 2 cargas'}]},
 hielo:{n:'Pozo de hielo',ico:'🧊',w:30,h:26,max:6,cap:m=>[6,6,5,4,2,1,0,0,0,0,2,5][m],rg:m=>[.5,.5,.8,1.5,3,6,9,9,9,6,2,.7][m],d:'Un pozo profundo y aislado con paja donde se apila la nieve prensada del invierno. En verano casi queda vacío.',
  acts:[{l:'Cortar bloques de hielo',sk:'athl',dc:11,min:60,use:1,out:[['hielo',[1,2]]],fail:{hp:2,msg:'Una placa se te resbala y te golpea. −2 PG.'},xp:10},
   {l:'Prensar nieve nueva',sk:'survival',dc:10,min:120,add:2,when:m=>[11,0,1,2,3].includes(m),xp:12,note:'Sólo de diciembre a abril'}]},
 cuarzo:{n:'Veta de cuarzo y arena',ico:'💎',w:28,h:22,max:3,rg:()=>8,d:'Una ladera de arena blanca y vetas de cuarzo traslúcido. Los vidrieros de Can Marc sacan de aquí la materia prima.',
  acts:[{l:'Extraer arena de sílice',sk:'survival',dc:9,min:45,use:1,out:[['arena_silice',[2,4]]],tool2:'shovel',xp:8},
   {l:'Picar la veta de cuarzo (requiere pico)',sk:'athl',dc:12,min:75,use:1,tool:'pick',out:[['cuarzo',[1,2]]],fail:{hp:3,msg:'Una esquirla te corta. −3 PG.'},xp:18}]},
 colmena:{n:'Colmena',ico:'🐝',w:22,h:24,max:3,cap:m=>(m>=3&&m<=9)?3:0,rg:()=>9,d:'Una colmena de paja y barro. Las abejas son más activas con calor; en invierno están agrupadas y no se debe molestarlas.',
  acts:[{l:'Cosechar con humo [Naturaleza]',sk:'nature',dc:12,min:40,use:1,out:[['miel',[1,3]],['cera',[1,2]]],fail:{hp:3,fat:5,msg:'Te pican en las manos y el cuello. −3 PG.'},xp:15,when:m=>m>=3&&m<=9},
   {l:'Robar miel sin humo [Sigilo]',sk:'stealth',dc:14,min:30,use:1,out:[['miel',[2,4]],['cera',[1,2]]],fail:{hp:5,fat:8,msg:'El enjambre sale en masa. −5 PG.'},xp:22,when:m=>m>=3&&m<=9}]},
 fuente:{n:'Font mineral',ico:'💧',w:26,h:22,max:5,rg:()=>.5,d:'Un caño de piedra por el que mana agua clara y fría, con un ligero sabor a hierro. Dicen que alivia el cansancio y las fiebres leves.',
  acts:[{l:'Beber hasta saciarte',free:1,min:5,xp:2,eff:'drink',note:'Sed a cero, −10 de cansancio, +2 PG'},
   {l:'Llenar la cantimplora',free:1,min:3,xp:0,eff:'fill'},
   {l:'Embotellar agua mineral (1 frasco de vidrio)',cost:{frasco_vidrio:1},min:10,use:1,out:[['agua_mineral',[1,1]]],xp:4}]},
 tronco:{n:'Tronco caído',ico:'🪵',w:34,h:18,max:2,rg:()=>5,d:'Un tronco derribado por una tormenta, cubierto de musgo. Fuente de leña seca y refugio de hongos y salamandras.',
  acts:[{l:'Aprovechar leña seca',sk:'athl',dc:8,min:40,use:1,out:[['madera_haya',[2,3]]],tool2:'axe',xp:6},
   {l:'Buscar setas bajo el tronco [Naturaleza]',sk:'nature',dc:11,min:25,use:1,out:[['niscalo',[1,2]],['rovellon',[0,1]]],when:m=>[8,9,10,11].includes(m),xp:8,note:'Sólo de septiembre a diciembre'}]},
 lagar:{n:'Lagar de piedra',ico:'🍇',w:34,h:24,max:99,rg:()=>0,d:'Un gran recipiente de piedra con una viga de prensa. En vendimia, media comarca pisa aquí la uva.',
  acts:[{l:'Pisar uvas para sacar mosto (4 de uvas)',sk:'acro',dc:9,min:60,free:1,cost:{uvas:4},out:[['mosto',[2,3]]],xp:10},
   {l:'Fermentar vino en el lagar (6 de uvas)',sk:'invest',dc:11,min:180,free:1,cost:{uvas:6},out:[['vino',[2,3]]],xp:25,note:'Un viñador vigila; si sale mal, pierdes la uva'}]},
 arcilla:{n:'Barrera de arcilla',ico:'🟫',w:30,h:20,max:4,rg:()=>6,d:'Un barranco de arcilla roja que los alfareros de la comarca explotan desde hace siglos.',
  acts:[{l:'Cavar arcilla',sk:'athl',dc:8,min:50,use:1,out:[['arcilla',[2,4]]],tool2:'shovel',fail:{fat:6,msg:'Terminas embarrado y agotado.'},xp:8}]},
 cantera:{n:'Cantera',ico:'⛏',w:34,h:28,max:4,rg:()=>7,d:'Un frente de roca escalonado. Se extrae piedra caliza a golpe de pico y cuña.',
  acts:[{l:'Picar piedra (requiere pico)',sk:'athl',dc:11,min:75,use:1,tool:'pick',out:[['caliza',[2,4]]],fail:{hp:3,msg:'Un fragmento te golpea. −3 PG.'},xp:14}]},
 lavadero:{n:'Lavadero del torrente',ico:'🧺',w:34,h:20,max:99,rg:()=>0,d:'Una pila de piedra en el torrente donde lavanderas y pelaires limpian la lana. Aquí se carda con cardencha.',
  acts:[{l:'Lavar y cardar lana (3 de lana y 1 cardencha)',sk:'athl',dc:9,min:90,free:1,cost:{lana:3,cardencha:1},out:[['lana_peinada',[2,3]]],xp:12},
   {l:'Lavarte en el torrente',free:1,min:20,eff:'wash',xp:1,note:'−8 de cansancio; cura sarna'}]},
 yacimiento:{n:'Yacimiento antiguo',ico:'🏺',w:30,h:22,max:2,rg:()=>20,d:'Estacas, cuerdas y un hoyo de excavación: alguien rascó aquí antes. Quedan fragmentos de ánforas y, quizá, algo más.',
  acts:[{l:'Excavar con cuidado [Investigación]',sk:'invest',dc:13,min:90,use:1,out:[['ceramica_antigua',[1,1]]],extra:[['moneda_antigua',.25],['reliquia_egara',.05]],tool2:'shovel',fail:{fat:8,msg:'No encuentras más que tierra y piedras.'},xp:30}]}};
const NODES={
 montseny:[['carbonera',4,10],['carbonera',6,38],['hielo',35,22.5],['cuarzo',3,15],['cuarzo',40,40],['colmena',5,24],['colmena',38,12],['fuente',31,18],['tronco',14,39],['tronco',26,4],['tronco',4,28]],
 penedes:[['lagar',22,37.5],['lagar',39.5,35],['arcilla',3,32],['arcilla',40,7],['cantera',3,13],['cantera',40,27],['colmena',3,20],['colmena',41,17],['yacimiento',24,41]],
 egara:[['lavadero',8,27],['lavadero',17,30.5],['arcilla',3,33],['cantera',40,20],['cantera',41,40],['yacimiento',31,15],['yacimiento',24,10]]};
for(const zid in NODES)NODES[zid]=NODES[zid].map((a,i)=>({id:zid+'_rn'+i,k:a[0],x:a[1],y:a[2]}));
for(const zid in NODES){const old=ZONE_BUILD[zid];ZONE_BUILD[zid]=function(z){old(z);for(const n of NODES[zid]){const xi=Math.floor(n.x),yi=Math.floor(n.y);if(inZ(z,xi,yi)&&z.solid[ZI(z,xi,yi)]===0)z.solid[ZI(z,xi,yi)]=1}}}
function rnState(zid){G.rn=G.rn||{};const S=G.rn[zid]||(G.rn[zid]={});if(!S._c){S._c=1;rnClear(zid)}for(const n of (NODES[zid]||[])){if(!S[n.id]){const T=RN[n.k];S[n.id]={s:T.max>=99?99:(T.cap?Math.min(T.max,T.cap(MON())):Math.max(1,T.max-1)),acc:0}}}return S}
function rnClear(zid){const f=G.flora&&G.flora[zid];if(!f)return;for(let i=f.length-1;i>=0;i--){for(const n of NODES[zid]){if(Math.hypot(f[i].x-n.x,f[i].y-n.y)<1.7){f.splice(i,1);break}}}}
function rnCap(n){const T=RN[n.k];return T.cap?Math.min(T.max,T.cap(MON())):T.max}
bus.on('day',()=>{try{const m=MON();for(const zid in NODES){const S=rnState(zid);rnClear(zid);for(const n of NODES[zid]){const T=RN[n.k];if(T.max>=99)continue;const st=S[n.id];const cap=rnCap(n);if(st.s>cap){st.s=cap;continue}if(st.s<cap){const rg=T.rg(m);st.acc+=rg>0?1/rg:0;while(st.acc>=1&&st.s<cap){st.s++;st.acc-=1}}else st.acc=0}}}catch(e){if(!R._rne){R._rne=1;console.error('rn day',e)}}});
// ---- dibujo ----
function rnCanvas(k){const T=RN[k];const c=mkc(T.w,T.h),x=c.getContext('2d');const Rr=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};const W=T.w,H=T.h;
 if(k==='carbonera'){blob(x,15,15,13,8,'#4a3426','#6a4a34','#2a1c14',false);for(let i=0;i<6;i++)Rr(5+i*4,12+(i%2)*3,2,1,'#2a1c14');Rr(14,6,2,3,'#d8602a');Rr(10,9,2,2,'#e88a3a');Rr(19,10,2,2,'#c8501e');Rr(3,19,7,3,'#8a6a40');Rr(20,19,7,3,'#8a6a40');Rr(15,2,1,3,'#9a9a9a');Rr(16,0,1,2,'#bababa')}
 else if(k==='hielo'){blob(x,15,17,12,6,'#8a8a92','#b0b0b8','#5a5a62',false);blob(x,15,13,9,5,'#bfe4f4','#e8f8ff','#7ab0d0',false);Rr(9,8,5,4,'#d8f0fa');Rr(16,6,6,5,'#e8f8ff');Rr(12,10,4,3,'#a8d4e8');Rr(4,3,22,2,'#a08040');Rr(6,1,18,2,'#c8a860')}
 else if(k==='cuarzo'){blob(x,14,14,12,8,'#9a9288','#bab2a6','#6a645c',false);[[8,6,3,8],[13,3,3,10],[18,5,3,8],[22,8,2,6]].forEach(q=>{Rr(q[0],q[1],q[2],q[3],'#f4f4f8');Rr(q[0]+1,q[1],1,q[3]-1,'#d0e4f4')});Rr(2,18,24,2,'#e8e0c8')}
 else if(k==='colmena'){x.fillStyle='#8a6a3a';x.fillRect(4,18,14,3);x.fillRect(5,21,2,3);x.fillRect(15,21,2,3);for(let i=0;i<5;i++){const w=14-i*2;Rr(11-Math.floor(w/2),16-i*3,w,3,i%2?'#e0b24a':'#c89a3a')}Rr(9,17,4,2,'#2a1c14');Rr(10,1,2,2,'#c89a3a');for(let i=0;i<4;i++)Rr(3+i*5,3+(i%2)*4,1,1,'#1a1a1a')}
 else if(k==='fuente'){blob(x,13,16,11,5,'#9a9aa2','#bcbcc4','#6a6a72',false);Rr(5,14,16,5,'#4a86c8');Rr(7,14,5,1,'#8ac0f0');Rr(11,3,4,9,'#8a8a92');Rr(10,3,6,2,'#b0b0b8');Rr(12,6,2,6,'#4a86c8');Rr(12,4,2,1,'#8ac0f0')}
 else if(k==='tronco'){Rr(3,8,28,8,'#6a4a30');Rr(3,8,28,2,'#8a6a40');Rr(2,9,3,6,'#d8b888');Rr(3,10,1,3,'#8a6a40');Rr(6,7,6,2,'#4a7a38');Rr(18,7,8,2,'#5a8a40');Rr(8,14,16,2,'#4a3220')}
 else if(k==='lagar'){blob(x,17,16,14,6,'#8a8a92','#b0b0b8','#55555e',false);Rr(6,13,22,5,'#6a2a6a');Rr(9,13,6,1,'#8a3a8a');Rr(4,3,26,3,'#6a4a30');Rr(5,3,2,12,'#6a4a30');Rr(27,3,2,12,'#6a4a30');Rr(14,5,6,5,'#8a6a40')}
 else if(k==='arcilla'){blob(x,15,13,13,8,'#b4623a','#d8845a','#7a3a22',false);Rr(5,10,20,2,'#d8845a');Rr(8,16,14,2,'#8a4a2a');Rr(20,4,3,2,'#6a4a30')}
 else if(k==='cantera'){[[2,16,30,10],[5,10,24,7],[9,4,16,7]].forEach((r,i)=>Rr(r[0],r[1],r[2],r[3],['#a8a49a','#b8b4a8','#c8c4b8'][i]));for(let i=0;i<5;i++)Rr(6+i*5,8+i%2*6,1,3,'#6a665c');Rr(24,22,6,3,'#7a766c')}
 else if(k==='lavadero'){Rr(3,10,28,8,'#9a9aa2');Rr(4,11,26,6,'#4a86c8');Rr(6,12,10,1,'#e8f4fa');Rr(16,14,8,1,'#8ac0f0');Rr(2,17,30,2,'#6a6a72');Rr(8,6,3,4,'#f0e8d8');Rr(20,5,5,5,'#c8d8f0')}
 else if(k==='yacimiento'){blob(x,15,15,13,5,'#7a5a3a','#9a7a50','#5a3e26',false);Rr(4,5,1,9,'#8a6a40');Rr(26,6,1,8,'#8a6a40');Rr(4,6,23,1,'#d8d0b8');Rr(10,12,5,3,'#c8844a');Rr(11,12,3,1,'#e0a868');Rr(18,14,4,2,'#d8c8a0')}
 outlineCell(x,0,0,W,H,[24,30,20]);return c}
const _propCanvasRN=propCanvas;propCanvas=function(k,v){if(k&&k.startsWith('rn_')&&RN[k.slice(3)])return rnCanvas(k.slice(3));return _propCanvasRN(k,v)};
const _petDrawRN=petDraw;petDraw=function(list,z,shadow){_petDrawRN(list,z,shadow);try{const L=NODES[G.zone];if(!L)return;const S=rnState(G.zone);for(const n of L){const o=propSpr('rn_'+n.k,0);const gy=groundY(z,n.x,n.y);list.push({x:n.x,y:gy,z:n.y,w:o.w,h:o.h,uv:o.uv,flip:false});if(shadow)shadow(n.x,n.y,gy,o.w*.7)}}catch(e){if(!R._rnd){R._rnd=1;console.error('rnDraw',e)}}};
// ---- interacción ----
function rnNear(){const L=NODES[G.zone];if(!L)return null;let best=null,bd=2.2;for(const n of L){const d=Math.hypot(n.x-G.px,n.y+.3-G.py);if(d<bd){bd=d;best=n}}return best}
const _nearRN=nearestInteract;nearestInteract=function(){const best=_nearRN();if(best&&best.type!=='flora'&&best.type!=='drink')return best;const n=rnNear();if(!n)return best;const T=RN[n.k];return{type:'rnode',n,target:{x:n.x,y:n.y+1},label:T.n+(T.max<99?' ('+rnState(G.zone)[n.id].s+'/'+rnCap(n)+')':'')}};
const _doRN=doInteract;doInteract=function(it){if(it&&it.type==='rnode'){if(R.modal)return;if(Math.hypot(it.n.x-G.px,it.n.y-G.py)>2.6){setTargetPath(it.n.x,it.n.y+1.2,it);return}return rnPanel(it.n)}return _doRN(it)};
function rnGive(out,margin,nat){const got=[];for(const [id,rg] of out){let q=ri(rg[0],rg[1]);if(margin>=8&&q>0)q++;if(q>0){giveItem(id,q,qualityFrom(margin,nat));got.push(ITEMS[id].n.toLowerCase()+' ×'+q)}}return got}
function rnRun(n,a){const T=RN[n.k],st=rnState(G.zone)[n.id],p=G.pc,m=MON();
 if(a.when&&!a.when(m))return{ok:false,msg:'No es la época adecuada.'};if(a.tool&&!hasTool(a.tool))return{ok:false,msg:'Necesitas '+({pick:'un pico',shovel:'una pala',axe:'un hacha'}[a.tool]||'una herramienta')+'.'};
 if(a.cost){for(const id in a.cost){if(invCount(p.inv,id)<a.cost[id])return{ok:false,msg:'Te falta: '+(ITEMS[id]?ITEMS[id].n.toLowerCase():id)+' ×'+a.cost[id]+'.'}}}
 if(a.use&&st.s<a.use)return{ok:false,msg:'Está agotad'+(T.n.match(/a$/)?'a':'o')+' por ahora. Vuelve en unos días.'};
 if(a.eff==='fill'){if(!invCount(p.inv,'cantimplora'))return{ok:false,msg:'No llevas cantimplora.'};p.canteen=4;advance(a.min||3);return{ok:true,msg:'Llenas la cantimplora hasta arriba.'}}
 if(a.eff==='drink'){advance(a.min||5);p.needs.thirst=0;p.needs.fatigue=Math.max(0,p.needs.fatigue-10);p.hp=Math.min(p.maxHp,p.hp+2);for(const q of petsOf()){if(q.stance!=='carta'&&q.stance!=='descansar')q.wat=100}return{ok:true,msg:'Bebes agua fría y mineral. Te sientes aliviado.'}}
 if(a.eff==='wash'){advance(a.min||20);p.needs.fatigue=Math.max(0,p.needs.fatigue-8);if(p.inf&&p.inf.sarna)delete p.inf.sarna;return{ok:true,msg:'Te lavas con agua fría. Recuperas el ánimo.'}}
 let r={ok:true,margin:4,nat:0};if(a.sk){let dc=a.dc;const bonus=(a.tool2&&hasTool(a.tool2))?-2:0;r=check(a.sk,dc+bonus,{label:a.l.replace(/ \(.*$/,'')})}
 advance(a.min||30,{step:15});p.needs.fatigue=Math.min(100,p.needs.fatigue+Math.round((a.min||30)/20));
 if(r.ok){if(a.cost)for(const id in a.cost)takeItem(id,a.cost[id]);if(a.use)st.s-=a.use;if(a.add){st.s=Math.min(rnCap(n),st.s+a.add)}
  let got=a.out?rnGive(a.out,r.margin||0,r.nat):[];if(a.extra)for(const [id,pr] of a.extra){if(Math.random()<pr){giveItem(id,1,qualityFrom(r.margin||0,r.nat));got.push(ITEMS[id].n.toLowerCase()+' ×1');if(id==='reliquia_egara')log('¡Una pieza extraordinaria!','lvl')}}
  gainXp(a.xp||0);return{ok:true,msg:(got.length?'Obtienes '+got.join(', ')+'.':(a.add?'Repones '+a.add+' cargas.':'Hecho.'))}}
 if(a.cost&&a.sk==='invest'){for(const id in a.cost)takeItem(id,Math.ceil(a.cost[id]/2))}
 const f=a.fail||{};if(f.hp)p.hp=Math.max(1,p.hp-f.hp);if(f.fat)p.needs.fatigue=Math.min(100,p.needs.fatigue+f.fat);return{ok:false,msg:f.msg||'No lo consigues esta vez.'}}
function rnPanel(n){const T=RN[n.k];return modal(T.n,(b,bg)=>{const draw=()=>{b.innerHTML='';const st=rnState(G.zone)[n.id];const cap=rnCap(n);const m=MON();
  b.append(h('div',{class:'ccard'},h('p',{class:'big'},T.d),T.max<99?h('div',{},h('b',{},'Reservas: '),st.s+' / '+cap+(cap<T.max?' (la estación limita el máximo a '+cap+')':'')):null,T.max<99?bar(st.s,Math.max(1,T.max),'#c8a84a'):null));
  const g=h('div',{class:'btns'});for(const a of T.acts){const ok=(!a.when||a.when(m));const need=a.tool&&!hasTool(a.tool);const sub=[a.sk?SK[a.sk].n+' CD '+a.dc:'',a.min?Math.round(a.min/60*10)/10+' h':'',a.cost?Object.keys(a.cost).map(i=>(ITEMS[i]?ITEMS[i].n:i)+' ×'+a.cost[i]).join(', '):'',a.note||''].filter(Boolean).join(' · ');
   g.append(h('button',{class:'btn'+(ok&&!need?' pri':''),title:sub,onclick:()=>{const r=rnRun(n,a);toast(r.msg,r.ok?'ok':'bad');log(r.msg,r.ok?'good':'warn');updateHUD();draw()}},a.l+(sub?' — '+sub:'')))}
  b.append(g,h('div',{class:'btns'},h('button',{class:'btn',onclick:()=>closeModal(bg)},'Cerrar')))};draw()})}
// ---- eventos ligados a la flora y a los recursos ----
EVENTS.push(
{id:'trufas_perro',w:7,ok:c=>(c.z==='montseny'||c.z==='penedes')&&!c.night&&[10,11,0,1].includes(MON()),run:c=>{const pet=activePets().find(q=>['perro','lobo','gineta','garduna','zorro'].includes(q.sp));
 const dig=(r,q)=>{const n=r.margin>=6?2:1;giveItem('trufa',n,qualityFrom(r.margin,r.nat));LL('trufa',true);gainXp(30);return EVN((q?q+' escarba al pie de una encina y desentierra':'Escarbas al pie de una encina y encuentras')+' '+n+' trufa'+(n>1?'s':'')+' negra'+(n>1?'s':'')+'. Huelen a tierra mojada y a promesa de cena de ricos.',[evEnd()],'Trufas','🍄')};
 if(pet)return EVN(pet.name+' se detiene, olfatea y empieza a escarbar con obstinación bajo una encina. Un olor intenso y oscuro sube del suelo.',[
  O('Dejarle escarbar y ayudar [Naturaleza CD 11]',()=>{const r=check('nature',11);advance(40,{step:20});if(r.ok)return dig(r,pet.name);return EVN(pet.name+' destroza la trufa a mordiscos antes de que llegues. Se relame, satisfecho.',[evEnd()],'Trufa perdida','🐕')}),
  O('Dejarla donde está y seguir',()=>evEnd())],'Olfato fino','🐕');
 return EVN('Entre las raíces de una encina notas un olor intenso, terroso, casi a ajo. La hojarasca está quemada en un círculo: «brûlé», lo llaman los trufeurs.',[
  O('Buscar a mano [Naturaleza CD 16]',()=>{const r=check('nature',16);advance(60,{step:20});if(r.ok)return dig(r,'');return EVN('Remueves la tierra una hora y sólo sacas lombrices y raíces.',[evEnd()],'Sin suerte','🪱')}),
  O('Dejarlo, sin perro es perder el tiempo',()=>evEnd())],'Olor a trufa','🍄')}},
{id:'carbonero_oficio',w:6,ok:c=>c.z==='montseny'&&!c.night,run:c=>EVN('Un carbonero con la cara tiznada vigila una pila humeante. «Hay que mantenerla parda, ni llama ni frío. Si me echas una mano con la leña, te doy parte del carbón.»',[
  O('Ayudar a cargar y sellar la pila [Atletismo CD 10]',()=>{const r=check('athl',10);advance(120,{step:30});G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+14);if(r.ok){giveItem('carbon',ri(3,5));addGold(5);gainXp(22);return EVN('Entre los dos selláis la pila con tierra y hojas. Te llevas carbón y 5 florines.',[evEnd()],'Carbón','🔥')}G.pc.hp=Math.max(1,G.pc.hp-2);return EVN('Una bocanada de brasa te quema los brazos. −2 PG.',[evEnd()],'Quemadura','🔥')}),
  O('Preguntarle por el bosque [Persuasión CD 10]',()=>{const r=check('persu',10);if(r.ok){LL('hayedo',true);gainXp(12);return EVN('Habla del hayedo con cariño: «Los hayucos alimentan a los jabalíes; las brujas dicen que dejar un hayuco en cada claro trae suerte».',[evEnd()],'Charla','🌲')}return EVN('Se encoge de hombros y vuelve a mirar la pila.',[evEnd()])}),
  O('Seguir camino',()=>evEnd())],'El carbonero','🔥')},
{id:'enjambre_suelto',w:5,ok:c=>(c.z==='montseny'||c.z==='penedes')&&!c.night&&MON()>=4&&MON()<=8,run:c=>EVN('Un zumbido grave llena el aire: un enjambre se ha desprendido de una colmena y cuelga de una rama baja, como una barba oscura y viva.',[
  O('Recoger el enjambre en una cesta [Naturaleza CD 13]',()=>{const r=check('nature',13);advance(45,{step:15});if(r.ok){giveItem('miel',ri(1,2));giveItem('cera',ri(1,2));gainXp(25);return EVN('Con gestos lentos lo sacudes dentro de la cesta. Un apicultor cercano te lo paga con miel y cera.',[evEnd()],'Enjambre','🐝')}G.pc.hp=Math.max(1,G.pc.hp-4);return EVN('Pierdes la calma y el enjambre se te echa encima. −4 PG.',[evEnd()],'Picaduras','🐝')}),
  O('Alejarte despacio',()=>evEnd())],'El enjambre','🐝')});
// ---- minimapa: puntos de recurso ----
const _mmRN=drawMinimap;drawMinimap=function(){_mmRN();try{const L=NODES[G.zone];if(!L)return;const c=$('#minimap');const z=getZone(G.zone);const x=c.getContext('2d');const sc=Math.min(128/z.cols,128/z.rows);const ox=(132-z.cols*sc)/2,oy=(132-z.rows*sc)/2;const S=rnState(G.zone);
 for(const n of L){const T=RN[n.k];const full=T.max>=99||S[n.id].s>0;x.fillStyle=full?'#ff9a2e':'#8a8a8a';x.strokeStyle='#1a1208';x.lineWidth=1;x.beginPath();x.arc(ox+n.x*sc,oy+n.y*sc,2.6,0,6.3);x.fill();x.stroke()}}catch(e){}};
// ---- economía: los productores locales explotan los puntos ----
const RN_ECO={carbonera:['carbonero','carbon'],cantera:['cantero','caliza'],colmena:['monje','miel'],lagar:['tonelero','vino']};
bus.on('day',()=>{try{if(!G.econ)return;for(const zid in NODES){const E=G.econ[zid];if(!E)continue;const S=rnState(zid);
 for(const n of NODES[zid]){const m=RN_ECO[n.k];if(!m)continue;const st=S[n.id];const jobs=Object.values(G.npcs).filter(q=>q.alive&&!q.traveler&&q.zone===zid&&q.job===m[0]&&!(q.ill>0)).length;
  if(!jobs)continue;if(RN[n.k].max>=99){E.s[m[1]]=(E.s[m[1]]||0)+jobs*.5;continue}
  const take=Math.min(st.s,Math.random()<.15?1:0);if(take>0){st.s-=take;E.s[m[1]]=(E.s[m[1]]||0)+take*2;st.npcUse=(st.npcUse||0)+take}}}}catch(e){if(!R._rne2){R._rne2=1;console.error('rn eco',e)}}});
