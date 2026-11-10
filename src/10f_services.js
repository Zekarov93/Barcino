// ===================== SERVICIOS DE OFICIO (nuevos oficios) =====================
const _serviceOpts=serviceOpts;
function sv(n,txt,opts){return D(n,txt,(opts||[]).concat([O('Volver',()=>mainMenu(n))]))}
function pay(n,c,no){if(G.pc.gold<c){return sv(n,no||'«Sin monedas no hay trato.»')}addGold(-c);return null}
serviceOpts=function(n,opts){_serviceOpts(n,opts);const j=n.job;const z=n.zone;const a=attitude(n);
 if(a<-25)return;
 if(j==='barbero')opts.push(O('Afeitado y corte (15 fl): cambia tu aspecto',()=>{const p=pay(n,15);if(p)return p;G.pc.groom=G.t+1440*2;const d=Math.min(G.infamy,4);G.infamy-=d;G.pc.needs.fatigue=Math.max(0,G.pc.needs.fatigue-4);return sv(n,'«Listo. Ni tu madre te reconocería.»'+(d?'\n(Tu infamia baja un poco: nadie te asocia ya con aquella cara.)':'')+'\n(Pasas por más cuidado durante dos días.)')}));
 if(j==='comadrona'||j==='curandero')opts.push(O('Pedir un remedio casero (10 fl)',()=>{const p=pay(n,10);if(p)return p;const g=Math.ceil(G.pc.maxHp*(j==='comadrona'?.4:.3));G.pc.hp=Math.min(G.pc.maxHp,G.pc.hp+g);let t='Te aplica un ungüento y una infusión amarga. Recuperas '+g+' PG.';if(G.pc.poison&&Math.random()<(j==='curandero'?.5:.3)){G.pc.poison=0;t+=' El veneno cede.'}return sv(n,'«Cuesta de beber, pero funciona.»\n'+t)}));
 if(j==='cocinero'||j==='camarero')opts.push(O('Pedir de comer (5 fl)',()=>{const p=pay(n,5,'«Primero el pago, amigo.»');if(p)return p;drinkSome(1);G.pc.needs.hunger=Math.max(0,G.pc.needs.hunger-45);return sv(n,'Te sirven un plato humeante.')}));
 if(j==='maestro')opts.push(O('Recibir una lección (20 fl)',()=>{const p=pay(n,20);if(p)return p;gainXp(15);npcAdj(n,1);return sv(n,'«Presta atención, que esto no se repite.» Aprendes algo útil. (+15 PX)')}));
 if(j==='escribano')opts.push(O('Carta de recomendación (30 fl)',()=>{const p=pay(n,30);if(p)return p;repGain(z,4);return sv(n,'Redacta con letra impecable y sella la carta. (Tu reputación en '+ZINFO[z].n+' sube.)')}));
 if(j==='escribano'&&G.bounty[z]>0)opts.push(O('Pedir un «papel» que suavice tu expediente ('+fmtGold(Math.ceil(G.bounty[z]*.5))+')',()=>{const c=Math.ceil(G.bounty[z]*.5);const p=pay(n,c);if(p)return p;G.bounty[z]=Math.floor(G.bounty[z]*.5);infamyGain(1);return sv(n,'«Estos papeles nunca han existido, ¿entendido?» Tu recompensa se reduce a la mitad.')},{cls:'dark'}));
 if(j==='pregonero'){opts.push(O('¿Qué dice el pregón de hoy?',()=>{G.gossip=G.gossip||[];const r=G.gossip.filter(g=>g.z===z).slice(-3).map(g=>'• '+g.m);return sv(n,'«¡Oíd, oíd! '+zoneSummary(z)+'.»'+(r.length?'\n'+r.join('\n'):'\n«Sin novedades dignas de voz.»'))}));
  opts.push(O('Encargar un pregón a tu favor (25 fl)',()=>{const p=pay(n,25);if(p)return p;repGain(z,3);return sv(n,'«¡Oíd, oíd! ¡Un forastero de honradez probada…!» (+reputación local)')}))}
 if(j==='anciano')opts.push(O('Pedirle que te hable de la gente del barrio',()=>{const v=Object.values(G.npcs).filter(x=>x.alive&&x.zone===z&&!x.traveler&&x.id!==n.id&&!knows(x,'fn'));if(!v.length)return sv(n,'«Ya sabes tanto del barrio como yo.»');const o=pick(v);learn(o,'job',true);learn(o,'fn',true);learn(o,'home',true);npcAdj(n,1);return sv(n,'«¿'+o.name+'? '+cap(npcTitle(o).toLowerCase())+'. '+(JOB[o.job]&&JOB[o.job].fn||'')+'»\n(Anotas su oficio, su función y dónde vive.)')}));
 if(j==='guia')opts.push(O('Consejo del camino (5 fl)',()=>{const p=pay(n,5);if(p)return p;const ad=[...new Set(getZone(z).exits.map(e=>e.to))].filter(x=>ZINFO[x]);return sv(n,'«Conozco cada sendero.»'+(ad.length?'\n'+ad.map(x=>'• '+ZINFO[x].n+': '+(G.zs&&G.zs[x]?zoneSummary(x):'sin noticias')).join('\n'):''))}));
 if(j==='usurero'){const L=G.loan;
  if(!L)opts.push(O('Pedir un préstamo (100 fl, devolver 125 en 7 días)',()=>{addGold(100);G.loan={amt:125,due:G.t+1440*7,z,by:n.id};learn(n,'job',true);return sv(n,'«Firma aquí. Y no tardes: mis chicos son impacientes.»')},{cls:'dark'}));
  else opts.push(O('Pagar la deuda ('+L.amt+' fl)',()=>{const p=pay(n,L.amt,'«No te alcanza. Los intereses no esperan.»');if(p)return p;G.loan=null;npcAdj(n,3);return sv(n,'«Un placer hacer negocios.»')}))}
 if(j==='maton'&&a>=0)opts.push(O('Contratar protección unos días (40 fl)',()=>{const p=pay(n,40);if(p)return p;G.pc.protect=G.t+1440*3;infamyGain(1);return sv(n,'«Tres días. Nadie te tocará… en esta zona.»')},{cls:'dark'}));
 if(j==='contrabandista'&&a>=10)opts.push(O('Preguntar por «mercancías especiales»',()=>{const x=Object.values(G.npcs).find(m=>m.alive&&m.zone===z&&m.job==='guardia');return sv(n,'«Aquí no. Ven de noche y habla bajo.»'+(x?'\n«Y ojo con '+x.name+': tiene buen olfato.»':''))},{cls:'dark'}));
 if(j==='farolero'||j==='sereno')opts.push(O('¿Qué se ve por las calles de noche?',()=>{const s=zsGet(z);return sv(n,s.c>=40?'«Mal asunto: cada noche hay más sombras que no me gustan.»':'«Tranquilo, por ahora. Procuro que siga así.»')}));
 if(j==='enterrador')opts.push(O('¿Ha habido muertes últimamente?',()=>{G.gossip=G.gossip||[];const d=G.gossip.filter(g=>/muert|enterrad|llora/.test(g.m)).slice(-3);return sv(n,d.length?'«Sí…» '+d.map(x=>x.m).join(' '):'«Gracias a Dios, nada que contar.»')}));
};
// deuda con el usurero: los matones vienen a cobrar
bus.on('day',()=>{const L=G.loan;if(!L||G.t<L.due)return;const late=Math.floor((G.t-L.due)/1440);L.amt=Math.round(125*(1+.1*late));
 if(late===1)bus.emit('news','El plazo de tu préstamo ha vencido. El usurero lo recordará.');
 if(late>=4&&!L.hit){L.hit=1;const u=G.npcs[L.by];const g=Math.min(G.pc.gold,Math.ceil(G.pc.gold*.4));addGold(-g);bus.emit('news','Unos matones del usurero te han abordado y se llevan '+fmtGold(g)+'. La deuda sigue en pie ('+L.amt+' fl).');if(u)npcAdj(u,-5);G.pc.hp=Math.max(1,G.pc.hp-Math.ceil(G.pc.maxHp*.25))}});
// protección contratada: ni carteristas ni bandidos de peaje, y los matones del usurero se lo piensan
// ----- encargos acordes al oficio y a su gente -----
const JOB_NEEDS={herrero:['mineral','carbon'],albanil:['piedra','caliza'],carpintero:['madera'],tonelero:['madera'],zapatero:['piel','cuero'],sastre:['lana','tela'],tejedor:['lana'],curtidor:['piel'],cocinero:['carne','verdura','hierbas'],camarero:['carne','pescado'],posadero:['carne','verdura','pan'],panadero:['harina','grano'],carnicero:['carne'],pescador:['cuerda','sal'],marinero:['cuerda','sal'],cordelero:['lana','cuerda'],boticario:['hierbas','setas'],curandero:['hierbas','setas'],comadrona:['hierbas'],druida:['hierbas','setas'],erudito:['tinta','libro'],escribano:['tinta'],copista:['tinta'],sacerdote:['vino','cera'],monje:['hierbas','vino'],farolero:['aceite'],florista:['rosas'],mercader:['lana','sal'],cervecero:['grano'],alfarero:['caliza'],granjero:['semilla_verdura'],cabrero:['sal'],minero:['carbon','pan'],cantero:['pan'],estibador:['pan','vino'],carbonero:['pan'],lenador:['pan'],cazador:['cuerda','sal']};
const _gq2=genQuest2;
genQuest2=function(n,k){const R=Math.random;
 if(k==='deliver'){const rel=Object.keys(n.rel||{}).map(i=>G.npcs[i]).filter(m=>m&&m.alive&&m.zone!==n.zone&&!m.traveler);
  if(rel.length){const t=pick(rel);const r=n.rel[t.id];const w=relWordOf(n,t);const nt={amigo:'una carta para su amistad',conyuge:'noticias para su pareja',hermano:'una carta familiar',padre:'una carta para su padre/madre',hijo:'una carta para su hijo/hija',maestro:'una carta para su maestro/a',aprendiz:'una carta para su aprendiz',enemigo:'una carta… de las que no se agradecen',deudor:'un recordatorio de deuda',acreedor:'un pago atrasado',amante:'una nota que nadie debe leer',enamorado:'una nota sin firmar',colega:'un pedido para su colega'}[r.k]||'un mensaje';
   return{id:'q'+(G.eid++),type:'deliver',giver:n.id,target:t.id,title:'Mensaje para '+t.name,text:n.name+' te pide llevar '+nt+' a '+t.name+' ('+w+') en '+ZINFO[t.zone].n+'.',reward:{gold:ri(15,40),xp:30,aff:r.v<0?3:8},rk:r.k,state:'open'}}}
 if(k==='fetch'){const want=JOB_NEEDS[n.job];if(want){const id=famPick(pick(want),G.zone);if(ITEMS[id]){const n_=ri(3,6);return{id:'q'+(G.eid++),type:'fetch',giver:n.id,item:id,need:n_,title:'Reunir '+ITEMS[id].n.toLowerCase(),text:n.name+' ('+npcTitle(n).toLowerCase()+') necesita '+n_+' × '+ITEMS[id].n+' para su trabajo.',reward:{gold:Math.round(ITEMS[id].v*n_*1.6+8),xp:25,aff:6},state:'open'}}}}
 return _gq2(n,k)};

// entregar un mensaje mueve la relación entre los dos
function deliverEffect(q,t){const g=G.npcs[q.giver];if(!g)return '«Gracias por traerlo. Dile que lo he recibido.»';const rk=q.rk;const rv=(a,b,d)=>{if(a.rel[b.id])a.rel[b.id].v=clamp(a.rel[b.id].v+d,-100,100);if(b.rel[a.id])b.rel[a.id].v=clamp(b.rel[a.id].v+d,-100,100)};
 learn(t,'r:'+g.id,true);learn(g,'r:'+t.id,true);let tx;
 if(rk==='enemigo'||rk==='rival'){rv(g,t,-8);npcAdj(t,-2);t.mood=Math.max(0,t.mood-10);tx='Lee la carta y su gesto se endurece. «Dile que no he olvidado nada.» (La enemistad entre '+g.name+' y él/ella crece.)'}
 else if(rk==='acreedor'||rk==='deudor'){const c=Math.min(t.gold,20);t.gold-=c;g.gold+=c;rv(g,t,-3);tx='Suspira y cuenta unas monedas. «Dile que esta vez cumplo.»'}
 else if(rk==='amante'||rk==='enamorado'){rv(g,t,10);t.mood=Math.min(100,t.mood+15);if(Math.random()<.35)addGossip(t.zone,'Alguien ha visto a un forastero llevar notas entre '+g.name+' y '+t.name+'.',t);tx='Se sonroja, guarda la nota en el pecho. «Gracias… no se lo cuentes a nadie.»'}
 else{rv(g,t,5);t.mood=Math.min(100,t.mood+10);tx='Sonríe al leerla. «Siempre se acuerda de mí. Dile que sí.»'}
 npcAdj(t,1);return tx}
