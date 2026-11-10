// ===================== INTERIORES: todos los edificios son visitables =====================
// Cada tipo de edificio tiene un plano ASCII. Leyenda:
// # muro · . suelo · @ puerta · 1 2 3 puestos de trabajo · S c asientos · , lugar de rezo
// T mesa · LL mesa larga · CC mostrador · B cama · b catre · H hogar · F forja · A yunque · R armero · O horno
// K caldero · Q cacharros · X caja · N barril · Z sacos · E estantería · D escritorio · W rueda · M redes · Y heno
// U tina · V alquimia · J telar · G curtido · a altar · PP bancos · f farol · h trono · s estatua · k cofre
const LEG={T:['furn_table',1],L:['furn_tablel',1],C:['furn_counter',1],B:['furn_bed',1],b:['furn_cot',1],H:['furn_hearth',1],F:['furn_forge',1],A:['furn_anvil',1],R:['furn_rack',1],O:['furn_oven',1],
 K:['furn_cauldron',1],Q:['furn_pots',1],X:['furn_crate',1],N:['furn_barrel',1],Z:['furn_sacks',1],E:['furn_shelf',1],D:['furn_desk',1],W:['furn_wheel',1],M:['furn_nets',1],Y:['furn_hay',1],U:['furn_tub',1],
 V:['furn_alch',1],J:['furn_loom',1],G:['furn_tan',1],a:['furn_altar',1],P:['furn_pew',1],f:['furn_lamp',0],h:['furn_throne',1],s:['furn_statue',1],k:['furn_chest',1],S:['furn_stool',0],c:['furn_chair',0]};
const IL_PLAN={
inn:{floor:'WOODF',rows:[
"##################",
"#N.E.E.H...#B.B.B#",
"#...1......#.....#",
"#..CCCC....#.....#",
"#..........#.....#",
"#.S.S.S.S.S......#",
"#..T.T.T.T.#.....#",
"#.S.S.S.S.S#B.B.B#",
"#..........#.....#",
"#.N.k..2...#.....#",
"#..........#.....#",
"########@@########"]},
smith:{floor:'FLAG',rows:[
"##############",
"#E.R.R.E..X.N#",
"#.....F.F....#",
"#..1.A..A.2..#",
"#............#",
"#.CCCC....X..#",
"#............#",
"#.N..Z....f..#",
"######@@######"]},
bakery:{floor:'WOODF',rows:[
"############",
"#Z.Z.O.O.NN#",
"#..1....2..#",
"#.E.E..E.E.#",
"#..........#",
"#.CCCC..T..#",
"#..........#",
"#.f......X.#",
"#####@@#####"]},
apothecary:{floor:'WOODF',rows:[
"############",
"#E.E.E.E.E.#",
"#..........#",
"#.V...K.Q..#",
"#...1......#",
"#.CCCC.....#",
"#..........#",
"#.Q.f....Z.#",
"#####@@#####"]},
shop:{floor:'WOODF',rows:[
"############",
"#E.E.E.E.NN#",
"#..........#",
"#..1.......#",
"#.CCCC..X..#",
"#..........#",
"#.Z.X..Z.f.#",
"#####@@#####"]},
temple:{floor:'FLAG',rows:[
"##################",
"#.f....sa.s....f.#",
"#......1.2.......#",
"#.......,,,......#",
"#..PP......PP....#",
"#..PP......PP....#",
"#........,.......#",
"#..PP......PP....#",
"#..PP......PP....#",
"#................#",
"#.f.....,,.....f.#",
"#................#",
"########@@########"]},
chapel:{floor:'FLAG',rows:[
"##########",
"#.f.a..f.#",
"#...1....#",
"#...,,...#",
"#.PP..PP.#",
"#........#",
"#.PP..PP.#",
"####@@####"]},
house:{floor:'WOODF',rows:[
"##########",
"#B.B.H.E.#",
"#........#",
"#.k....T.#",
"#..S..S.S#",
"#..1.....#",
"#.N...Q..#",
"####@@####"]},
farm:{floor:'WOODF',rows:[
"##############",
"#Y.Y.H.T.S.S.#",
"#............#",
"#.N.Z.Z...B..#",
"#........1.B.#",
"#.X..N...k...#",
"#............#",
"######@@######"]},
ayuntamiento:{floor:'FLAG',rows:[
"####################",
"#E.E.f..h.D..f.E.E.#",
"#.......1..2.......#",
"#..................#",
"#.LL..LL.....LL..LL#",
"#..S..S......S..S..#",
"#..................#",
"#.D...........D....#",
"#..3...........3...#",
"#..................#",
"#.f..............f.#",
"#########@@#########"]},
llotja:{floor:'FLAG',rows:[
"##################",
"#E.E.f..N.X.Z.Z..#",
"#................#",
"#.D.1..D..2..D...#",
"#................#",
"#.CC..CC..LL.....#",
"#.......S..S.....#",
"#.X.Z......N..f..#",
"########@@########"]},
library:{floor:'WOODF',rows:[
"##############",
"#E.E.E.E.E.E.#",
"#............#",
"#E.E.E.E.E.E.#",
"#............#",
"#.D..1..D.2..#",
"#.S.....S....#",
"#.f.......f..#",
"######@@######"]},
barracks:{floor:'FLAG',rows:[
"################",
"#b.b.b.b.R.R.R.#",
"#..............#",
"#b.b.b.b.......#",
"#.......H......#",
"#..1.2.LL...N..#",
"#..S.S.........#",
"#.X.N.....f....#",
"#######@@#######"]},
port:{floor:'WOODF',rows:[
"############",
"#M.M.M.NNX.#",
"#..........#",
"#.....1....#",
"#.CCCC..Z..#",
"#..........#",
"#.X.N...f..#",
"#####@@#####"]},
tannery:{floor:'DIRT',rows:[
"############",
"#G.G.G.U.U.#",
"#..........#",
"#..1....2..#",
"#.X...N....#",
"#..........#",
"#.Z.X..f...#",
"#####@@#####"]},
lumber:{floor:'DIRT',rows:[
"############",
"#X.X.R.R.NN#",
"#..........#",
"#..1....2..#",
"#.Z..X.....#",
"#..........#",
"#.N.f....X.#",
"#####@@#####"]},
hunter:{floor:'WOODF',rows:[
"##########",
"#R.R.H.B.#",
"#........#",
"#.k..T.S.#",
"#...1....#",
"#.Z.N....#",
"####@@####"]},
mill:{floor:'WOODF',rows:[
"############",
"#W.W.Z.Z.NN#",
"#..........#",
"#..1....2..#",
"#.X.Z......#",
"#..........#",
"#.T.S..f...#",
"#####@@#####"]},
monasterio:{floor:'FLAG',rows:[
"######################",
"#.f..s.a.s..f..E.E.E.#",
"#.......1.2..........#",
"#.....,,,,,..........#",
"#.PP..PP..PP..LL.LL..#",
"#.PP..PP..PP..S..S...#",
"#.....,,,,,..........#",
"#.PP..PP..PP.O.O.NN..#",
"#.PP..PP..PP.....3...#",
"#....................#",
"#.f..............f...#",
"##########@@##########"]},
tower:{floor:'FLAG',rows:[
"##########",
"#E.E.V.K.#",
"#........#",
"#.D.1..D.#",
"#........#",
"#.S.f..k.#",
"####@@####"]},
default:{floor:'WOODF',rows:[
"##########",
"#B.k.H.E.#",
"#........#",
"#..T..S..#",
"#..1.....#",
"#.N...Q..#",
"####@@####"]}};
const IL_KIND={inn:'inn',smith:'smith',bakery:'bakery',apothecary:'apothecary',shop:'shop',temple:'temple',chapel:'chapel',house:'house',farm:'farm',ayuntamiento:'ayuntamiento',llotja:'llotja',library:'library',barracks:'barracks',port:'port',fisher:'port',tannery:'tannery',lumber:'lumber',hunter:'hunter',mill:'mill',monasterio:'monasterio',tower:'tower'};
const IL_ACT={smith:{F:'craft',A:'craft'},bakery:{O:'craft'},apothecary:{V:'craft'},tannery:{G:'craft'},tower:{V:'craft'},lumber:{},monasterio:{O:'craft',a:'pray'},temple:{a:'pray'},chapel:{a:'pray'},library:{E:'read',D:'read'},ayuntamiento:{D:'read'},llotja:{D:'read'}};
const IL_KEEP={port:'port'};
const T_BY={WOODF:T.WOODF,FLAG:T.FLAG,DIRT:T.DIRT};

function bldAny(bid){const key=bid;INT_IDX[key]=INT_IDX[key]||(()=>{for(const zid of ZIDS){const z=getZone(zid);const b=z.buildings.find(x=>x.id===bid);if(b)return b}return null})();return INT_IDX[key]}
const INT_IDX={};
function hasInterior(b){return !!b&&!b.virtual&&!!b.entry&&!!IL_KIND[b.kind]}
// plano interpretado
function parsePlan(b){const plan=IL_PLAN[IL_KIND[b.kind]]||IL_PLAN.default;const rows=plan.rows.slice();const W=Math.max(...rows.map(r=>r.length)),H=rows.length;
 const L={cols:W,rows:H,floor:plan.floor,walls:[],furn:[],spots:{keep:[],seats:[],beds:[],pray:[],idle:[],door:null,work:[]},kind:IL_KIND[b.kind]};
 const act=IL_ACT[L.kind]||{};
 for(let y=0;y<H;y++){let r=rows[y].padEnd(W,'#');for(let x=0;x<W;x++){const ch=r[x];const cx=x+.5,cy=y+.5;
  if(ch==='#'){L.walls.push([x,y]);continue}
  if(ch==='.'){if(y>0&&y<H-1&&x>0&&x<W-1)L.spots.idle.push([cx,cy]);continue}
  if(ch==='@'){if(!L.spots.door)L.spots.door=[x+1,y];continue}
  if(ch==='1'||ch==='2'||ch==='3'){L.spots.keep.push([cx,cy]);continue}
  if(ch===','){L.spots.pray.push([cx,cy]);continue}
  if((ch==='C'||ch==='P'||ch==='L')&&r[x+1]===ch){const d=LEG[ch];L.furn.push({t:d[0],x:x+1,y:cy,solid:1,cells:[[x,y],[x+1,y]],act:ch==='C'?'trade':null});r=r.slice(0,x+1)+'.'+r.slice(x+2);x++;continue}
  const d=LEG[ch];if(!d)continue;
  const f={t:d[0],x:cx,y:cy,solid:d[1],cells:d[1]?[[x,y]]:[],act:act[ch]||null};
  if(ch==='B'){if(L.kind==='inn')f.act='rent';L.spots.beds.push([cx,cy+.2])}
  if(ch==='b')L.spots.beds.push([cx,cy+.2]);
  if(ch==='T'&&L.kind==='inn')f.act='eat';
  if(ch==='k')f.act='loot';
  if(ch==='S'||ch==='c')L.spots.seats.push([cx,cy]);
  if(ch==='F'||ch==='A'||ch==='O'||ch==='V'||ch==='G')L.spots.work.push([cx,cy+1]);
  L.furn.push(f)}}
 // el mostrador cuenta como estación de comercio también si no hay ninguno: se añade en tiendas
 // despeja la entrada
 const dd=L.spots.door;if(dd){L.furn=L.furn.filter(f=>!f.cells.some(c=>c[1]>=H-3&&Math.abs(c[0]+.5-dd[0])<=1.6))}
 return L}
function buildPublicInterior(b){const L=parsePlan(b);const W=L.cols,H=L.rows;const z={id:'int:'+b.id,name:b.name,biome:'indoor',cols:W,rows:H,amp:0,tiles:new Uint8Array(W*H).fill(T_BY[L.floor]||T.WOODF),solid:new Uint8Array(W*H),occ:new Uint8Array(W*H),flat:new Float32Array(W*H).fill(1),
  buildings:[],props:[],exits:[],plots:[],bridges:[],stalls:[],scen:[],pillars:[],nodes:[],spots:{},seed:5+hashStr(b.id)%90,indoor:1,parent:b.id,pub:1,wallH:1.9,L,fix:[]};
 for(const w of L.walls)z.solid[w[1]*W+w[0]]=1;
 for(const f of L.furn){z.props.push({t:f.t,x:f.x,y:f.y,v:0,act:f.act,ip:1});for(const c of f.cells)z.fix.push(c[1]*W+c[0])}
 const dr=L.spots.door||[W/2,H-1];z.exits.push({x:dr[0]-1,y:H-1.1,w:2,h:1.1,to:'__out',ax:0,ay:0});z.spawn={x:dr[0],y:H-2.1};z.arrive={__out:{x:dr[0],y:H-2.1}};
 return z}
function makeInterior(bid){const b=bldAny(bid);if(b&&hasInterior(b)&&!G.owned[bid])return buildPublicInterior(b);return buildInterior(bid)}

// ----- acceso -----
function openHours(b){const h=dateOf(G.t).hf;if(['inn','temple','chapel','monasterio'].includes(b.kind))return true;return h>=7&&h<21}
function residentsHome(b){return Object.values(G.npcs).filter(n=>n.alive&&n.zone===b.zone&&n.hidden&&n.loc===b.id&&n.home===b.id)}
function buildingAccess(b){
 if(G.owned[b.id])return{ok:true,own:1};
 if(b.forSale)return{ok:true,vacant:1};
 if(['inn','temple','chapel','monasterio'].includes(b.kind))return{ok:true};
 if(b.kind==='house'){const res=residentsHome(b);if(!res.length)return{ok:false,why:'La puerta está cerrada con llave. No parece haber nadie en casa.',force:1};
  const ok=res.some(n=>attitude(n)>=-8&&n.tr.warm+((n.soc!=null?n.soc:5))>=5);return{ok:false,knock:1,res,why:ok?'Hay alguien dentro. Podrías llamar a la puerta.':'Se oye movimiento dentro. Podrías llamar, aunque quizá no te abran.',force:1}}
 if(b.kind==='barracks'){const h=dateOf(G.t).hf;if(h<8||h>=20)return{ok:false,why:'El cuartel está cerrado a las visitas. Un guardia te corta el paso.'}}
 if(!openHours(b))return{ok:false,why:'Está cerrado a estas horas. Vuelve entre las 7 y las 21.'}
 return{ok:true}}
function enterBuilding(b,how){
 const ac=buildingAccess(b);
 if(!ac.ok&&!how){return doorPanel(b,ac)}
 G.outPos={zone:G.zone,x:b.entry.x+.5,y:b.entry.y+1.2,bid:b.id};G.zone='int:'+b.id;const z=getZone(G.zone);G.built[G.zone]=G.built[G.zone]||[];G.px=z.spawn.x;G.py=z.spawn.y;R.zid=null;R.path=null;R.dest=null;R.pending=null;INT.b=b;INT.how=how||null;INT.occ=[];INT.last=-1;
 bus.emit('zone',G.zone);bus.emit('built');intSync(true);
 if(ac.own)toast('Entras en tu casa: puedes decorarla (B)','ok');else if(how==='force')toast('Has entrado sin que te vean… por ahora.','bad')}
function doorPanel(b,ac){modal(b.name,(body,bg)=>{body.append(h('p',{class:'big'},KIND_D[b.kind]||''),h('p',{},ac.why||''));const btns=h('div',{class:'bopts'});
  if(ac.knock)btns.append(h('button',{class:'dopt svc',onclick:gated(()=>{closeModal(bg);const res=ac.res;const n=res.find(x=>attitude(x)>=-8)||res[0];const r=check('persu',10+Math.max(0,Math.round(-attitude(n)/10)),{label:'Convencer a quien abre'});
    if(r.ok||attitude(n)>=20){log(n.name+' te deja pasar.');n.met=true;enterBuilding(b,'invited')}else{log(n.name+' te cierra la puerta con desconfianza.');npcAdj(n,-1)}})},'🚪 Llamar a la puerta'));
  if(ac.force)btns.append(h('button',{class:'dopt svc',onclick:gated(()=>{closeModal(bg);const dc=13+(residentsHome(b).length?3:0);const r=check('sleight',dc,{label:'Forzar la cerradura'});if(r.ok){infamyGain(1);enterBuilding(b,'force')}else{infamyGain(2);log('La ganzúa chirría. Alguien podría haberte visto.','bad');if(Math.random()<.5){const g=Object.values(G.npcs).find(n=>n.alive&&n.zone===b.zone&&n.job==='guardia');if(g)log('Un vecino llama a la Guardia.','bad')}}})},'🗝 Forzar la cerradura [Juego de manos]'));
  body.append(btns,h('div',{class:'btns'},h('button',{class:'btn',onclick:()=>closeModal(bg)},'Marcharse')))})}

// ----- habitantes -----
const INT={b:null,occ:[],last:-1,how:null};
function inInterior(){return G.zone.startsWith('int:')&&INT.b&&G.zone==='int:'+INT.b.id}
function npcVisible(n){return n.alive&&!n.hidden&&(n.vz||n.zone)===G.zone}
function intSpotFor(n,act,L,used){const pick=(arr)=>{for(const p of arr){const k=p[0]+','+p[1];if(!used[k]){used[k]=1;return p}}return null};
 const J=JOB[n.job]||{};const keeper=n.work===INT.b.id;
 if(act==='sleep'){return pick(L.spots.beds)||pick(L.spots.idle)}
 if(act==='temple'&&L.spots.pray.length)return pick(L.spots.pray);
 if(act==='eat'||act==='tavern'||act==='shelter'||act==='plaza'||act==='wander'){return pick(L.spots.seats)||pick(L.spots.idle)}
 if(act==='work'){if(keeper||J.sched==='shop'||J.sched==='monk')return pick(L.spots.keep)||pick(L.spots.work)||pick(L.spots.idle);return pick(L.spots.work)||pick(L.spots.idle)}
 return pick(L.spots.idle)}
function intDesired(b){const out=[];for(const id in G.npcs){const n=G.npcs[id];if(!n.alive||n.zone!==b.zone||n.traveler)continue;if(n.busy&&n.vz!==G.zone)continue;const r=npcTarget(n,G.t);if(r.tg&&r.tg.b===b.id)out.push({n,act:r.act})}return out}
function intSync(initial){const b=INT.b;if(!b||!inInterior())return;const z=getZone(G.zone);const L=z.L;if(!L)return;const want=intDesired(b);const used={};INT.occ.forEach(o=>{if(o.spot)used[o.spot[0]+','+o.spot[1]]=1});
 const door=L.spots.door||[z.cols/2,z.rows-1];
 for(const w of want){let o=INT.occ.find(x=>x.n===w.n);if(o){o.act=w.act;o.leave=false;continue}
  const sp=intSpotFor(w.n,w.act,L,used);if(!sp)continue;o={n:w.n,act:w.act,spot:sp,leave:false,wait:Math.random()*3};INT.occ.push(o);const n=w.n;n.vz=G.zone;n.hidden=false;n.loc=b.id;n.path=null;n.moving=false;
  if(initial||w.act==='sleep'){n.x=sp[0];n.y=sp[1];n.dx=0;n.dy=1}else{n.x=door[0]+(Math.random()-.5);n.y=door[1]-.6;const p=findPath(z,n.x,n.y,sp[0],sp[1],900);n.path=p||[{x:sp[0],y:sp[1]}]}}
 for(const o of INT.occ){if(!want.some(w=>w.n===o.n)&&!o.leave){o.leave=true;const p=findPath(z,o.n.x,o.n.y,door[0],door[1]-.7,900);o.n.path=p||[{x:door[0],y:door[1]-.7}];delete o.spot}}}
function intClear(){for(const o of INT.occ){const n=o.n;if(n.vz){n.vz=null;n.hidden=true;n.loc=INT.b?INT.b.id:n.loc;n.path=null;n.moving=false}}INT.occ=[]}
function intTick(dt){if(!inInterior())return;const z=getZone(G.zone);const L=z.L;if(!L)return;const door=L.spots.door||[z.cols/2,z.rows-1];
 const hr=Math.floor(G.t/20);if(hr!==INT.last){INT.last=hr;intSync(false)}
 for(let i=INT.occ.length-1;i>=0;i--){const o=INT.occ[i],n=o.n;if(n.busy){n.moving=false;continue}
  if(n.path&&n.path.length){npcStep(n,z,dt);if(!n.path.length&&o.leave){n.vz=null;n.hidden=true;n.loc=INT.b.id;INT.occ.splice(i,1)}continue}
  if(o.leave){n.vz=null;n.hidden=true;INT.occ.splice(i,1);continue}
  n.moving=false;o.wait-=dt;
  // mira hacia el jugador si está cerca
  const dx=G.px-n.x,dy=G.py-n.y,d=Math.hypot(dx,dy);if(d<3.2&&o.act!=='sleep'){n.dx=dx/d;n.dy=dy/d}
  if(o.wait<=0){o.wait=3+Math.random()*5;if(['work','wander','plaza'].includes(o.act)&&o.spot&&Math.random()<.5){const r=1.1;const tx=o.spot[0]+(Math.random()-.5)*r*2,ty=o.spot[1]+(Math.random()-.5)*r;if(fitsAt(z,tx,ty,.2)){const p=findPath(z,n.x,n.y,tx,ty,300);if(p&&p.length<7)n.path=p}}}}}
bus.on('leaveHome',()=>{intClear();INT.how=null});

// ----- interacción con muebles -----
function nearestIprop(){const z=getZone(G.zone);if(!z.pub)return null;let best=null,bd=2.2;for(const p of z.props){if(!p.act)continue;const d=Math.hypot(p.x-G.px,p.y+.4-G.py);if(d<bd){bd=d;best={type:'iprop',p,target:{x:p.x,y:p.y+1},label:IACT_L[p.act]||'Usar'}}}return best}
const IACT_L={trade:'Comerciar en el mostrador',rent:'Alquilar una cama',eat:'Pedir de comer',craft:'Usar el taller',pray:'Rezar ante el altar',read:'Hojear libros y papeles',loot:'Registrar el cofre'};
function useIprop(p){const b=INT.b;if(!b)return;
 const keeperOf=()=>{const o=INT.occ.find(o=>o.n.work===b.id&&!o.leave);return o?o.n:null};
 switch(p.act){
  case'trade':{const keeper=keeperOf();const gen={name:keeper?keeper.name:'Dependiente',zone:b.zone,inv:[],gold:400,flags:{},tr:{},fac:b.fac,aff:0,id:'shop_'+b.id,known:1};if(!b.shop&&!keeper){toast('Aquí no se comercia.','bad');return}tradePanel(keeper||gen,b);break}
  case'rent':{if(G.pc.gold<8){toast('No tienes 8 fl','bad');return}addGold(-8);bus.emit('sleep',{where:'inn',b});break}
  case'eat':{if(G.pc.gold<4){toast('No tienes 4 fl','bad');return}addGold(-4);drinkSome(1);G.pc.needs.hunger=Math.max(0,G.pc.needs.hunger-45);advance(20);toast('Comes un plato caliente','ok');updateHUD();break}
  case'craft':craftPanel();break;
  case'pray':prayPanel(b);break;
  case'read':{advance(45);gainXp(3);log('Pasas un rato hojeando libros y papeles. Aprendes algo de la comarca.');toast('+3 PX','xp');break}
  case'loot':lootChest(p,b);break}}
const prayPanel=b=>modal('Rezar',(body,bg)=>{body.append(h('p',{class:'big'},'El silencio huele a cera y piedra fría.'));const bt=h('div',{class:'bopts'});
 bt.append(h('button',{class:'dopt svc',onclick:()=>{closeModal(bg);advance(15);const p=G.pc;if(p.hp<p.maxHp)p.hp=Math.min(p.maxHp,p.hp+1);log('Rezas un rato en silencio. Algo se serena dentro de ti.');updateHUD()}},'🙏 Rezar en silencio (15 min)'),
  h('button',{class:'dopt svc',onclick:()=>{if(G.pc.gold<5){toast('No tienes 5 fl','bad');return}addGold(-5);closeModal(bg);if(G.fac&&G.fac.orden)G.fac.orden.st=Math.min(100,(G.fac.orden.st||0)+1);log('Dejas 5 fl en el cepillo y enciendes una vela.');updateHUD()}},'🕯 Dejar una ofrenda (5 fl)'));
 body.append(bt,h('div',{class:'btns'},h('button',{class:'btn',onclick:()=>closeModal(bg)},'Cerrar')))});
const lootChest=gated(function(p,b){const day=Math.floor(G.t/1440);const key=b.id+':'+day;G.pc.flags.looted=G.pc.flags.looted||{};if(G.pc.flags.looted[key]){toast('Ya has registrado este cofre hoy.','bad');return}
 const legal=INT.how==='invited'||G.owned[b.id];if(legal){toast('No es de buena educación rebuscar en casa ajena.','bad');return}
 const res=INT.occ.filter(o=>o.n.home===b.id&&!o.leave);const r=check('sleight',12+res.length*2,{label:'Registrar el cofre sin ruido'});G.pc.flags.looted[key]=1;
 if(r.ok){const g=5+Math.floor(Math.random()*35);addGold(g);log('Encuentras '+g+' fl entre ropa doblada.','ok');if(Math.random()<.4){const it=pick(['anillo','pan','vino','daga','hierbas','cuerda'],Math.random);if(ITEMS[it]){giveItem(it,1,1);log('Y algo más: '+ITEMS[it].n+'.','ok')}}infamyGain(.5)}
 else{infamyGain(2);log('Un ruido te delata.','bad');res.forEach(o=>{npcAdj(o.n,-25);o.n.flags.thief=G.t;log(o.n.name+' te grita: «¡Ladrón!»','bad')});}
 updateHUD()});

bus.on('sleep',()=>{setTimeout(()=>{if(inInterior()){intClear();intSync(true)}},0)});
function intRestore(){for(const id in G.npcs){const n=G.npcs[id];if(n.vz){n.vz=null;n.hidden=true}}INT.occ=[];INT.b=null;if(G.zone.startsWith('int:')){const b=bldAny(G.zone.slice(4));INT.b=b;INT.last=-1;if(b)intSync(true)}}
