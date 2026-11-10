// ===================== RUTINAS PERSONALES Y SECRETOS VARIADOS =====================
SECRETS.push(
 {id:'amigo_follet',t:'alimenta en secreto a un follet que vive en su casa y jura que le trae suerte',lev:'folk'},
 {id:'deuda_dona',t:'prometió algo a una dona d\'aigua para salvar a su hijo del río y teme el día del cobro',lev:'folk'},
 {id:'canta_sirena',t:'cada novilunio baja a la orilla a escuchar cantar a una sirena, y no se lo cuenta a nadie',lev:'folk'},
 {id:'pacto_trasgo',t:'compra a escondidas el botín de una banda de trasgos y lo revende en la ciudad',lev:'tesoro'},
 {id:'ogro_amigo',t:'lleva comida a un ogro solitario del monte, que una vez le salvó la vida',lev:'folk'},
 {id:'carta_perdida',t:'guarda una carta sin abrir de un hijo que se marchó a Tierra Santa',lev:'amor'},
 {id:'bastardo',t:'tuvo un hijo con {rel} y jamás lo reconoció',lev:'amor'},
 {id:'falso_voto',t:'hizo un voto de peregrinar a Montserrat y nunca lo cumplió',lev:'orden'},
 {id:'diezmo',t:'quedó con parte del diezmo de la parroquia para pagar una deuda de juego',lev:'orden'},
 {id:'testigo_calla',t:'vio quién prendió el incendio de hace dos inviernos y calló por miedo',lev:'crimen'},
 {id:'moneda_falsa',t:'hace circular moneda recortada y la mezcla con la buena',lev:'mercaderes'},
 {id:'pesas_trucadas',t:'trucó sus pesas hace años y ya no sabe cómo dejar de hacerlo',lev:'mercaderes'},
 {id:'fuga_noche',t:'sale de noche del pueblo a una cita que nadie debe conocer',lev:'amor'},
 {id:'lee_prohibido',t:'sabe leer más de lo que aparenta y guarda libros que la Iglesia no aprobaría',lev:'orden'},
 {id:'sangre_vieja',t:'su familia fue enemiga a muerte de la de {rel}, y finge que lo ha olvidado',lev:'concejo'},
 {id:'mapa_cueva',t:'heredó el mapa de una cueva en Montserrat y no se atreve a ir',lev:'tesoro'},
 {id:'cura_milagro',t:'curó a alguien con hierbas y todos lo llaman milagro; él no los corrige',lev:'orden'},
 {id:'espanta_visita',t:'oye pasos en su casa cada noche y no sabe si es un fantasma o un ladrón',lev:'folk'},
 {id:'nombre_robado',t:'usa el nombre de un hombre muerto para cobrar su pensión',lev:'concejo'},
 {id:'mal_de_ojo',t:'cree haber echado el mal de ojo a {rel} y sufre por ello',lev:'folk'},
 {id:'ahorro_oculto',t:'guarda una fortuna bajo el suelo y finge pasar penurias',lev:'sombra'},
 {id:'escapo_prision',t:'escapó de una cárcel de otro condado hace años y teme ser reconocido',lev:'crimen'});
bus.on('day',()=>{try{if(G.flags.secFix)return;G.flags.secFix=1;const all=Object.values(G.npcs);const cnt={};all.forEach(n=>{if(n.sec)cnt[n.sec]=(cnt[n.sec]||0)+1});
 const pool=['amigo_follet','deuda_dona','canta_sirena','pacto_trasgo','ogro_amigo','carta_perdida','bastardo','falso_voto','diezmo','testigo_calla','moneda_falsa','pesas_trucadas','fuga_noche','lee_prohibido','sangre_vieja','mapa_cueva','cura_milagro','espanta_visita','nombre_robado','mal_de_ojo','ahorro_oculto','escapo_prision'];
 for(const n of all){if(!n.sec||cnt[n.sec]<=14)continue;const f=n.flags||{};if(f.help||f.betrayed||f.blackmailed)continue;if(G.quests.some(q=>q.id==='q_sec_'+n.id))continue;if(Math.random()>.55)continue;cnt[n.sec]--;n.sec=pickH(pool,n.id,'sx');n.secName=null;n.secT=null;assignSecret(n,Math.random,all)}}catch(e){}});
// ---- rutinas: cada uno vive el día a su manera ----
function personalSched(n,S){try{if(!S||!S.length||n.schedP||n.traveler)return S;const J=JOB[n.job];if(!J||['guard','beggar','night','trav','inn'].includes(J.sched))return S;n.schedP=1;const t=n.tr||{};const k=n.id+n.name;const strict=['shop','market','monk'].includes(J.sched);
 const CH=strict?[-.5,0,0,0,.5]:[-1,-.5,0,0,.5,1,1.5];const o=pickH(CH,k,'ch');
 if(o){const first=S[0],last=S[S.length-1];if(first.act==='sleep'&&S[1]&&S[1].b-S[1].a>1.5+Math.abs(o)){first.b=Math.max(4,Math.min(10,first.b+o));S[1].a=first.b}
  if(last.act==='sleep'&&S.length>2&&last.a+o>=19&&last.a+o<=23.5){const pv=S[S.length-2];if(pv.b-pv.a>1.2){last.a+=o;pv.b=last.a}}}
 const vice=(n.psy||npcPsy(n)).vice;const tv=S.findIndex(b=>b.act==='tavern');
 if(tv>=0){const B=S[tv],nx=S[tv+1];const social=n.social!=null?n.social:5;
  if(social<=3||(t.warm!=null&&t.warm<=3)){B.act='eat';B.loc='home'}
  else if((t.warm>=8||/vino|juego|chismorreo/.test(vice))&&nx&&nx.act==='sleep'&&nx.b-nx.a>1.5){B.b+=1;nx.a=B.b}}
 return S}catch(e){return S}}
(function(){const _gs=genSchedule;genSchedule=function(n,r){return personalSched(n,_gs(n,r))}})();
bus.on('day',()=>{try{if(G.flags.schedFix)return;G.flags.schedFix=1;for(const id in G.npcs){const n=G.npcs[id];if(n.alive&&n.sched&&!n.schedP)personalSched(n,n.sched)}}catch(e){}});
