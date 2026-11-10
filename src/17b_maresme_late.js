// ===== Maresme: música, economía y partidas antiguas =====
ZMUS.maresme=ZMUS.marjal||ZMUS.garraf||ZMUS.martorell;
const _legacyFix3=legacyFix;legacyFix=function(){_legacyFix3();if(!G||!G.zrep||G.zrep.maresme!==undefined)return;G.legacy3=1;const z='maresme';G.zrep[z]=0;G.bounty[z]=0;G.flora[z]=[];G.built[z]=[];G.fauna[z]=[];G.wx[z]={type:'clear',int:0,temp:15,next:0,snow:0,wet:0,wind:.2,flash:0};const E={s:{},t:{},mult:{},pop:0};ECO_ITEMS.forEach(i=>{E.s[i]=0;E.t[i]=6;E.mult[i]=1});G.econ[z]=E};
const _econInit3=econInit;econInit=function(){_econInit3();const T={maresme:{sardina:26,anchoa:22,merluza:12,pulpo:10,dorada:10,sal:20,pan:8,harina:5,vino:8,cuerda:8,tela:6,aceite:6}};
 for(const z in T){if(!G.econ[z])continue;for(const i in T[z]){if(!ECO_ITEMS.includes(i))continue;G.econ[z].t[i]=T[z][i];G.econ[z].s[i]=Math.round(T[z][i]*(.7+Math.random()*.7))}}G.econ.maresme.pop=Object.values(G.npcs).filter(n=>n.zone==='maresme'&&!n.traveler).length};
