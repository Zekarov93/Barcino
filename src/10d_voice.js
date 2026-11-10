// ===================== VOCES: cada uno habla a su manera =====================
const V_CLERO=['sacerdote','monje','sacristan','campanero','hospitalero','copista','enterrador','druida'];
const V_RURAL=['granjero','pastor','cabrero','carbonero','lenador','cazador','minero','pescador','molinero','guia','aguador'];
const V_CULTO=['erudito','escribano','maestro','boticario','concejal','noble','recaudador'];
const V_CALLE=['ladron','mendigo','estibador','marinero','contrabandista','maton','estafador','juglar','lavandera','camarero'];
function voiceOf(n){if(n._vs)return n._vs;const t=n.tr||{},s=n.social==null?5:n.social;let v='normal';
 if(n.job==='noble')v='altivo';else if(V_CLERO.includes(n.job)||t.pious>=9&&s<=6)v='solemne';
 else if(s<=4&&t.warm<=6)v='hosco';else if(t.temper>=7&&t.brave>=6&&t.warm<=5)v='bravucon';
 else if(s>=8&&t.warm>=6)v='efusivo';else if(t.greed>=7&&t.honest<=5&&s>=5)v='zalamero';
 else if(V_CULTO.includes(n.job)&&t.curious>=6)v='culto';else if(V_RURAL.includes(n.job))v='rustico';
 else if(V_CALLE.includes(n.job)&&s>=5)v='callejero';else if(s<=5)v='seco';
 return n._vs=v}
const V_GREET={
 hosco:{f:['Hola.','Ya.','…Sí.'],r:['Hola.','Buenas.','Ah.'],am:['Buenos días.','Hola.'],pm:['Buenas tardes.','Hola.'],ni:['Buenas noches.','Tarde es.']},
 seco:{f:['Buenas. ¿Qué quiere?','Hola. Diga.'],r:['Buenas.','Diga.','Hola.'],am:['Buenos días.'],pm:['Buenas tardes.'],ni:['Buenas noches.']},
 efusivo:{f:['¡HOLA, FORASTERO, BIENVENIDO!','¡Anda, una cara nueva! ¡Pasa, pasa, cuéntame todo!'],r:['¡Hola, {t}! ¡Qué ALEGRÍA verte!','¡{t}! ¡Mira quién ha venido!','¡Hola, hola, hola!'],am:['¡Hola, BUENOS DÍAS!','¡Buenos días, {t}, qué mañana tan preciosa!'],pm:['¡Buenas TARDES, {t}!','¡Hola! ¡Menuda tarde!'],ni:['¡Buenas noches! ¡No es hora de andar solo, pasa!','¡{t}! ¿A estas horas? ¡Me encanta!']},
 zalamero:{f:['Ah, un viajero de buen porte… ¡bienvenido, bienvenido!','Honrado por su visita, amigo.'],r:['Mi buen {t}, qué gusto verle.','¡Mi cliente favorito!','Siempre es un placer, {t}.'],am:['Muy buenos días, mi buen {t}.'],pm:['Buenas tardes, {t}. Tan elegante como siempre.'],ni:['A estas horas… ¿negocios, {t}? Mejor aún.']},
 bravucon:{f:['¿Y tú quién eres? Habla.','Ah, otro forastero. Más te vale portarte bien.'],r:['¡Eh, {t}! ¿Vienes a molestar?','Hombre, {t}. ¿Qué pasa?'],am:['¡Madrugas! Bien.'],pm:['¡Buenas! ¿Qué se cuenta?'],ni:['De noche y solo… valiente o necio.']},
 solemne:{f:['La paz sea contigo, forastero.','Que el Altísimo te guarde, viajero.'],r:['La paz contigo, {t}.','Que Dios te guarde, {t}.'],am:['Que la mañana te sea propicia, {t}.'],pm:['Buenas tardes, hijo mío.'],ni:['Que la noche te sea leve, {t}.']},
 culto:{f:['Salve, viajero. Permíteme presentarme.','Un rostro nuevo: siempre es un libro por abrir.'],r:['Salve, {t}. ¿Qué te trae hoy?','Ah, {t}. Justo pensaba en lo que comentamos.'],am:['Buenos días, {t}. Hora excelente para pensar.'],pm:['Buenas tardes, {t}.'],ni:['La noche es buena para estudiar. ¿Y para ti?']},
 rustico:{f:['Buenas, forastero. Pase, pase.','¡Ave María! Una cara nueva.'],r:['Buenas, {t}. ¿Cómo va la cosa?','Hombre, {t}. ¿Qué se cuenta?'],am:['Buenos días nos dé Dios.'],pm:['Buenas tardes, {t}.'],ni:['Buenas noches. Ya es hora de recogerse.']},
 callejero:{f:['Eh, forastero. Ven, ven.','¿Nuevo por aquí? Sé de todo, ya me conocerás.'],r:['¡Ey, {t}! ¿Qué hay?','Anda, {t}. ¿Qué se cuece?'],am:['¡Madrugador! Ya era hora.'],pm:['Ey, buenas. ¿Qué se cuenta?'],ni:['De noche, eh… me gusta tu estilo.']},
 altivo:{f:['Mm. ¿Quién sois?','Os dirigís a alguien de alcurnia. Sed breve.'],r:['Ah. Vos otra vez.','Os concedo un momento, {t}.'],am:['Buen día. Procurad ser breve.'],pm:['Buenas tardes. ¿Qué deseáis?'],ni:['A estas horas… ¿qué asunto os trae?']}};
const V_BYE={hosco:['Adiós.','…Hasta otra.','Ya.'],seco:['Hasta luego.','Adiós.'],efusivo:['¡ADIÓS! ¡Vuelve pronto, {t}, te espero!','¡Hasta luego, hasta luego! ¡No te pierdas!'],zalamero:['Vuelva cuando guste, mi buen {t}.','Siempre a su servicio.'],bravucon:['Y no te metas en líos.','Largo, y cuidado por ahí.'],solemne:['Ve en paz.','Que Dios te acompañe.'],culto:['Hasta pronto, {t}. Piensa en lo dicho.','Que el camino te sea instructivo.'],rustico:['Anda con Dios.','Hasta otra, {t}.'],callejero:['Ciao, {t}. Ya sabes dónde encontrarme.','Nos vemos, {t}.'],altivo:['Podéis retiraros.','Basta por hoy.'],normal:['Hasta luego, {t}.','Cuídate, {t}.']};
const V_TIC={hosco:[],seco:[],efusivo:['¡Ja, ja! ','¡Oye! ','¡Verás! '],zalamero:['Mi buen amigo, ','Entre nosotros, ','Si me permite, '],bravucon:['Mira, ','Escucha, ','Te lo digo claro: '],solemne:['Hijo mío, ','En verdad, ','Con la venia del cielo, '],culto:['Curiosamente, ','Como dice el adagio, ','Veamos… '],rustico:['Pues mira, ','Ay, madre, ','Vaya por Dios, '],callejero:['Oye, ','Mira, tío, ','Psst… '],altivo:['En fin, ','Como es sabido, ']};
function vhash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
function vpick(a,seed){return a[seed%a.length]}
function voiceGreet(n,first){const st=voiceOf(n);const T=V_GREET[st];if(!T)return null;const ph=phaseOf(G.t).id;const slot=ph<=1||ph===6||ph===0?(ph===6||ph===0?'ni':'am'):ph<=3?'am':ph===4?'pm':'ni';
 const seed=vhash(n.id+Math.floor(G.t/60));const pool=first?T.f:(Math.random()<.5?T[slot]:T.r);return vpick(pool,seed+(Math.random()*7|0))}
function voiceBye(n){const st=voiceOf(n);const a=V_BYE[st]||V_BYE.normal;return pick(a).replace('{t}',G.pc.name)}
// transforma el primer fragmento «…» del texto según la voz
function voice(n,text){if(!n||!text||n._noV)return text;const st=voiceOf(n);const seed=vhash(n.id+text);const cold=attitude(n)<=-12;
 return text.replace(/«([^»]+)»/,(m,q)=>{let x=q;
  if(st==='hosco'||st==='seco'){x=x.replace(/[¡!]/g,'').replace(/\.\.\.|…/g,'.').replace(/ Qué alegría[^.]*\./i,'')}
  if(cold){x=x.replace(/[¡!]/g,'')}else if(st==='efusivo'&&seed%3===0&&!/^¡/.test(x))x=V_TIC.efusivo[seed%3]+x;
  else if(!cold&&V_TIC[st]&&V_TIC[st].length&&seed%4===0&&!/^(¡|¿|Salve|Hola|Buen|La paz|Que |Ya\.|Ah|Eh|Oye|Honrado|Mi |Siempre|A estas|Un rostro|Os |¿)/.test(x)&&x.length>45)x=V_TIC[st][seed%V_TIC[st].length]+x.charAt(0).toLowerCase()+x.slice(1);
  if(st==='efusivo'&&x.length<50&&/\.$/.test(x))x=x.replace(/\.$/,'!').replace(/^(?!¡)/,'¡');
  if(st==='bravucon')x=x.replace(/Por favor,? /i,'');
  if(st==='altivo')x=x.replace(/\bte\b/g,'os').replace(/\btú\b/g,'vos');
  return '«'+x+'»'})}
