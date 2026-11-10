// parches que dependen de módulos posteriores
for(const e of EVENTS){if(e.id==='carterista'||e.id==='peaje_bandido'){const ok=e.ok;e.ok=c=>!(G.pc.protect>G.t)&&ok(c)}}

ZMUS.sant_cugat=ZMUS.montserrat;ZMUS.salinas=ZMUS.collbato;
function legacyFix(){if(!G||!G.zrep||G.zrep.sant_cugat!==undefined)return;G.legacy=1;for(const z of ['sant_cugat','salinas']){G.zrep[z]=0;G.bounty[z]=0;G.flora[z]=[];G.built[z]=[];G.fauna[z]=[];G.wx[z]={type:'clear',int:0,temp:15,next:0,snow:0,wet:0,wind:.2,flash:0};const E={s:{},t:{},mult:{},pop:0};ECO_ITEMS.forEach(i=>{E.s[i]=0;E.t[i]=6;E.mult[i]=1});G.econ[z]=E}}
const _econInit=econInit;econInit=function(){_econInit();const T={sant_cugat:{pan:8,vino:8,harina:6,grano:10,lana:10,cebolla:6,col:6,carne_cordero:5,carne_cerdo:4,queso_cabra:5,miel:4,pocion:3,tela:6},salinas:{sal:30,mineral:8,carbon:6,pan:6,vino:5,cerveza:6,carne_cabra:4,queso_cabra:5,cuerda:4}};
 for(const z in T){for(const i in T[z]){G.econ[z].t[i]=T[z][i];G.econ[z].s[i]=Math.round(T[z][i]*(.7+Math.random()*.7))}}for(const z of ZIDS)G.econ[z].pop=Object.values(G.npcs).filter(n=>n.zone===z&&!n.traveler).length};

for(const z in NEWCAPS)for(const sp in NEWCAPS[z])if(CREAT[sp])CREAT[sp].cap[z]=NEWCAPS[z][sp];

// el bestiario por especies sustituye al panel antiguo
bestiaryPanel=bestiaryPanel2;
