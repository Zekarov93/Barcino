// ===================== FAMA: los actos se saben, o no, según quién los viera =====================
// Lo que haces con un ser fantástico sólo trasciende si alguien lo presencia. La noticia viaja despacio,
// y cada oyente la recibe según lo que sienta por la víctima: lo malo para unos es bueno para otros.
const FREL={dona_aigua:{dona_aigua:1,sirena:.8,follet:.2,trasgo:-.2,ogro:0},sirena:{sirena:1,dona_aigua:.8,follet:.1,trasgo:-.1,ogro:0},
 follet:{follet:1,trasgo:.5,dona_aigua:.2,sirena:.1,ogro:-.1},trasgo:{trasgo:1,follet:.4,ogro:-.6,dona_aigua:-.2,sirena:-.1},ogro:{ogro:1,trasgo:-.3,follet:0,dona_aigua:0,sirena:0}};
const FAMA_SIGN={mata:-1,ofende:-1,ayuda:1,regala:1,libera:1};
const FAMA_MAG={mata:30,ofende:12,ayuda:14,regala:8,libera:25};
const FAMA_TX={
 mata:{p:'Dicen que acabaste con uno de los que no me caen bien. No lo lloraré.',n:'Me han dicho lo que hiciste. Con uno de los nuestros. No lo olvido.'},
 ofende:{p:'Alguien me ha contado que humillaste a uno de esos. Bien.',n:'He oído que trataste mal a uno de los míos.'},
 ayuda:{p:'Corre la voz de que ayudaste a uno de los nuestros. Algo es algo.',n:'Dicen que ayudaste a uno de esos. Hmm.'},
 regala:{p:'He oído que fuiste generoso con una de las nuestras.',n:'Me han contado que obsequias a ésos. Raro.'},
 libera:{p:'¡Libraste a uno de la casa! La noticia llegó hasta aquí.',n:'Dicen que liberaste a uno de ésos. Mala cosa.'}};
function famaWitnesses(a){const out=[];const night=dateOf(G.t).hf<6||dateOf(G.t).hf>21;const p=Math.max(.1,(night?.25:.55)-.04*skillMod('stealth'));
 for(const o of (G.fauna[G.zone]||[]))if(o!==a&&o.alive&&!o.e&&(FOLK[o.sp]||(WISE&&WISE[o.sp]&&['cuervo','garsa','gaviota','buho','halcon'].includes(o.sp)))&&Math.random()<p*(FOLK[o.sp]?1:.8))out.push({k:FOLK[o.sp]?'folk':'bird',a:o});
 try{for(const n of witnesses(12))if(Math.random()<p)out.push({k:'npc',n})}catch(e){}return out}
function actoFolk(kind,a,opts){opts=opts||{};if(!a||!FOLK[a.sp])return;G.fama=G.fama||[];const ws=famaWitnesses(a);const sign=FAMA_SIGN[kind];if(!ws.length)return;
 const sp=a.sp,mag=FAMA_MAG[kind];const done=[];let bird=false;
 for(const w of ws){
  if(w.k==='folk'){const R_=FREL[sp][w.a.sp]||0;if(R_&&!done.includes(w.a.id)){done.push(w.a.id);aplicaFama(w.a,sign*R_*mag*(sp===w.a.sp?1:.7),kind,sign*R_>0)}}
  else if(w.k==='npc'){const mon=CREAT[sp].monster;if(kind==='mata'&&mon){repGain(G.zone,2);addGossip(G.zone,'Alguien vio al forastero acabar con una criatura del monte. Se comenta.',w.n)}else if(kind==='libera'||kind==='ayuda'||kind==='regala'){repGain(G.zone,-1);addGossip(G.zone,'Alguien vio al forastero tratando con ese tipo de seres. Hay quien murmura.',w.n)}else if(kind==='mata'){repGain(G.zone,-1);addGossip(G.zone,'Se dice que el forastero mata a seres que no atacaban.',w.n)}}
  else if(w.k==='bird'&&!bird){bird=true;G.fama.push({due:G.t+1440*ri(1,3),sp,kind,z:G.zone,hops:0,all:1,done})}}
 // la noticia viaja: la especie de la víctima y sus parientes la oirán más tarde
 G.fama.push({due:G.t+1440*ri(2,6),sp,kind,z:G.zone,hops:1,done})}
function aplicaFama(o,d,kind,pos){const F=folkSt(o);F.fav=clamp(F.fav+Math.round(d),-100,100);F.heard=F.heard||[];if(F.heard.length<3)F.heard.push(FAMA_TX[kind][pos?'p':'n'])}
bus.on('day',()=>{try{if(!G.fama||!G.fama.length)return;const rest=[];for(const f of G.fama){if(f.due>G.t){rest.push(f);continue}
 for(const z in G.fauna)for(const o of G.fauna[z]){if(!o.alive||o.e||!FOLK[o.sp]||(f.done&&f.done.includes(o.id)))continue;f.done=f.done||[];const R_=FREL[f.sp][o.sp]||0;if(!R_)continue;const near=z===f.z;if(!near&&Math.random()>(f.all?.15:.45))continue;if(near&&f.all&&Math.random()>.6)continue;f.done.push(o.id);aplicaFama(o,FAMA_SIGN[f.kind]*R_*FAMA_MAG[f.kind]*(near?.8:.5),f.kind,FAMA_SIGN[f.kind]*R_>0)}}G.fama=rest}catch(e){}});
// al hablar, la noticia sale en su voz
const _fsay=folkSay;folkSay=function(a,F){if(F&&F.heard&&F.heard.length)return '«'+F.heard.shift()+'»';return _fsay(a,F)};
// ganchos en los actos
const _ecFama=endCombat;endCombat=function(res){const fs=[];try{if(CB&&CB.enemies)for(const e of CB.enemies)if(e.kind==='animal'&&e.ref&&FOLK[e.ref.sp])fs.push(e.ref)}catch(e){}_ecFama(res);for(const a of fs)if(!a.alive)try{actoFolk('mata',a)}catch(e){}};
