// ===================== CRISIS DE ABASTO: la economía pide ayuda =====================
const CR_JOBS=['concejal','mercader','posadero','panadero','tendero','sacerdote','cocinero'];
function crisisOf(z){G.crisis=G.crisis||{};return G.crisis[z]}
bus.on('day',()=>{if(!G.econ)return;G.crisis=G.crisis||{};
 for(const z of ZIDS){const E=G.econ[z];const c=G.crisis[z];const STAP=['pan','vino','grano','sardina','carne_cerdo','carne_cordero','harina','cebolla','sal','trucha'];
  if(c){if((E.s[c.item]||0)>=Math.ceil((E.t[c.item]||4)*.7)||G.t-c.t>1440*14){delete G.crisis[z];if(c.solved)continue;addGossip(z,'La carestía de '+ITEMS[c.item].n.toLowerCase()+' en '+ZINFO[z].n+' ha pasado.');}continue}
  const pop=Object.values(G.npcs).filter(n=>n.alive&&n.zone===z&&!n.traveler).length;if(pop<5)continue;
  const worst=STAP.filter(i=>(E.t[i]||0)>=5&&scarcity(z,i)>=2.6).sort((a,b)=>scarcity(z,b)-scarcity(z,a))[0];
  if(worst&&Math.random()<.35){const need=Math.max(6,Math.ceil((E.t[worst]||6)*.9));G.crisis[z]={item:worst,need,t:G.t};const m='Escasea '+ITEMS[worst].n.toLowerCase()+' en '+ZINFO[z].n+': piden ayuda a quien pueda traerlo.';addGossip(z,m);if(G.zone===z||Math.random()<.5)bus.emit('news',m)}}});
const _svc3=serviceOpts;
serviceOpts=function(n,opts){_svc3(n,opts);const c=crisisOf(n.zone);if(!c||!CR_JOBS.includes(n.job)||attitude(n)<-20)return;const I=ITEMS[c.item];if(!I)return;
 const have_=invCount(G.pc.inv,c.item);const pay=Math.round(priceBase(n.zone,c.item,1)*c.need*.9+25);
 opts.push(O('Hablar de la escasez de '+I.n.toLowerCase()+' ('+have_+'/'+c.need+')',()=>{
  if(have_<c.need)return D(n,'«Nos faltan '+c.need+' de '+I.n.toLowerCase()+'. Quien los traiga será recordado: pago '+fmtGold(pay)+' y la gratitud del pueblo.»'+(have_?'\n(Llevas '+have_+'.)':''),[O('Volver',()=>mainMenu(n))]);
  return D(n,'«¿Los traes? ¡Dios te bendiga!» Pago: '+fmtGold(pay)+'.',[O('Entregar '+c.need+' × '+I.n,()=>{takeItem(c.item,c.need);const E=G.econ[n.zone];E.s[c.item]=(E.s[c.item]||0)+c.need;addGold(pay);gainXp(35+c.need*2);repGain(n.zone,6);npcAdj(n,6,true);c.solved=1;const s=zsGet(n.zone);s.m=Math.min(100,s.m+6);const m=G.pc.name+' ha traído '+I.n.toLowerCase()+' a '+ZINFO[n.zone].n+' y aliviado la carestía.';addGossip(n.zone,m);bus.emit('news',m);delete G.crisis[n.zone];return D(n,'«Hoy habrá mesa en cada casa.»',[O('Volver',()=>mainMenu(n))])}),O('Volver',()=>mainMenu(n))])},{cls:'soc'}))};
