// ===================== EFECTOS PERSISTENTES EN EL MUNDO (silenciosos: el jugador los descubre solo) =====================
function fx(k,z,days){G.fx=G.fx||[];const u=G.t+1440*(days||40);const f=G.fx.find(x=>x.k===k&&x.z===z);if(f)f.until=Math.max(f.until,u);else G.fx.push({k,z,until:u})}
function fxOn(k,z){return !!(G.fx&&G.fx.some(x=>x.k===k&&x.z===z&&x.until>G.t))}
const eAdd=(z,it,n)=>{const E=G.econ&&G.econ[z];if(E&&E.s&&E.s[it]!==undefined)E.s[it]=Math.max(0,E.s[it]+n)};
const FX_DAILY={
 molino_ok:f=>{eAdd(f.z,'harina',1.5);eAdd(f.z,'pan',.5)},
 vina_ok:f=>{eAdd(f.z,'vino',.7)},vina_mala:f=>{eAdd(f.z,'vino',-.6)},
 costa_vigilada:f=>{eAdd(f.z,'sardina',.8);eAdd(f.z,'anchoa',.6)},costa_saqueada:f=>{eAdd(f.z,'sardina',-.8);eAdd(f.z,'anchoa',-.6)},
 camino_seguro:f=>{eAdd(f.z,'sal',.8)},guardia_plus:f=>{},
 bosque_fertil:f=>{const a=G.flora&&G.flora[f.z];if(a)for(const p of a)if(p.hv&&Math.random()<.35)p.hv=0}};
bus.on('day',()=>{try{if(!G.fx)return;G.fx=G.fx.filter(f=>f.until>G.t);for(const f of G.fx){const h=FX_DAILY[f.k];if(h)h(f)}}catch(e){if(!R._fxe){R._fxe=1;console.error('fx',e)}}});
const FX_R=[
 {e:['molinero_deuda'],o:/Ayudado|Saldada/,k:'molino_ok',z:'egara',d:90},
 {e:['cosecha_buena'],o:/Cosecha/,k:'vina_ok',z:'penedes',d:60},{e:['plaga_vinya'],o:/Plaga contenida/,k:'vina_ok',z:'penedes',d:40},
 {e:['plaga_extendida'],o:/Frenada/,k:'vina_ok',z:'penedes',d:30},{e:['plaga_extendida'],o:/Tarde/,k:'vina_mala',z:'penedes',d:40},
 {e:['sequia_pozo'],o:/^Agua$/,flag:'pozo_penedes'},
 {e:['aludes_nieve'],o:/Rescatados/,k:'camino_seguro',z:'montseny',d:50},
 {e:['barcino_refuerzos'],l:/Alistarte|Donar/,k:'guardia_plus',z:'barcino',d:80},
 {e:['bruixa_aplec'],o:/^Pacto/,k:'bosque_fertil',z:'montseny',d:40},
 {e:['asedio_piratas'],o:/Evacuación/,k:'costa_vigilada',z:'maresme',d:30}];
const _trailFx=trailNote;trailNote=function(e,l,o){_trailFx(e,l,o);for(const r of FX_R){if(!r.e.includes(e))continue;if(r.l&&!r.l.test(l||''))continue;if(r.o&&!r.o.test(o||''))continue;if(r.flag){G.flags[r.flag]=1;if(r.flag==='pozo_penedes')addPozoPenedes()}else fx(r.k,r.z,r.d)}};
// el pozo nuevo de Penedès es permanente
function addPozoPenedes(){const z=ZCACHE.penedes;if(!z||z._pozo)return;const b=z.buildings.find(b=>b.id==='casa_pn6')||z.buildings.find(b=>b.id==='molino_pn');if(!b)return;z._pozo=1;prop(z,'well',b.x+b.w+1.5,b.y+1.5,{solid:1})}
{const old=ZONE_BUILD.penedes;ZONE_BUILD.penedes=function(z){old(z);if(G&&G.flags&&G.flags.pozo_penedes){const b=z.buildings.find(b=>b.id==='casa_pn6')||z.buildings.find(b=>b.id==='molino_pn');if(b&&!z._pozo){z._pozo=1;prop(z,'well',b.x+b.w+1.5,b.y+1.5,{solid:1})}}}}
// guardia reforzada: menos robos en Barcino
const _evEffFx=evEff;evEff=function(e){let w=_evEffFx(e);if(evFam(e.id)==='robo'&&G.zone==='barcino'&&fxOn('guardia_plus','barcino'))w*=.45;return w};
// costa vigilada: no hay asedio mientras dure
{const a=EVENTS.find(e=>e.id==='asedio_piratas');if(a){const ok0=a.ok;a.ok=c=>!fxOn('costa_vigilada','maresme')&&ok0(c)}}
const _raidFx=raidResult;raidResult=function(prep,res,w){const r=_raidFx(prep,res,w);if(res==='won'&&w===2)fx('costa_vigilada','maresme',120);return r};
const _sackFx=sackMaresme;sackMaresme=function(){_sackFx();fx('costa_saqueada','maresme',40)};
// ===== salidas a los efectos negativos (llegan por sorpresa, no se anuncian) =====
EV_CH.push({e:['asedio_piratas'],o:/Saqueo/,to:'reconstruir_iluro',days:[8,16],z:'maresme',ttl:50},{e:['plaga_extendida'],o:/Tarde/,to:'replantar_vina',days:[12,25],z:'penedes',ttl:60});
FE('reconstruir_iluro',{ok:c=>c.z==='maresme'&&!c.night,run:c=>EVN('En Iluro suenan martillos. Los vecinos reparan redes, resanan tejados y reponen las barcas varadas. Un viejo carpintero te llama: «Aún faltan manos y maderas. Cualquier ayuda cuenta.»',[
 O('Ayudar a reconstruir [Atletismo CD 11]',()=>{const r=check('athl',11);advance(180,{step:60});G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+25);if(r.ok){repGain('maresme',10);facGain('concejo',2);gainXp(70);fx('costa_saqueada','maresme',0);G.fx=(G.fx||[]).filter(f=>f.k!=='costa_saqueada');fx('costa_vigilada','maresme',25);return EVN('Entre vigas y cabos, la villa recupera su pulso. Cuando termina el día, los pescadores te invitan a un cuenco de caldo.',[evEnd()],'Reconstrucción','🔨')}return EVN('Haces lo que puedes. Los vecinos te lo agradecen con una sonrisa cansada.',[evEnd()],'Esfuerzo','🔨')}),
 O('Donar madera (2 de madera)',()=>{if(invCount(G.pc.inv,'madera')<2)return EVN('No tienes suficiente madera.',[evEnd()]);takeItem('madera',2);repGain('maresme',6);G.fx=(G.fx||[]).filter(f=>f.k!=='costa_saqueada');return EVN('El carpintero te estrecha la mano con las suyas, ásperas.',[evEnd()],'Donación','🪵')}),
 O('Pasar de largo',()=>evEnd())],'Reconstrucción','🔨')});
FE('replantar_vina',{ok:c=>c.z==='penedes'&&!c.night,run:c=>EVN('El viñador al que viste perder media viña está arrancando sarmientos negros. «Hay que plantar de nuevo. Tardará años… pero algo hay que hacer.»',[
 O('Ayudar a replantar [Naturaleza CD 11]',()=>{const r=check('nature',11);advance(150,{step:50});G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+20);if(r.ok){repGain('penedes',8);gainXp(60);G.fx=(G.fx||[]).filter(f=>f.k!=='vina_mala');fx('vina_ok','penedes',30);return EVN('Pasáis la tarde con las manos en la tierra. El viñador te da una botella de su vino viejo: «Para brindar cuando den fruto».',[evEnd()],'Replantada','🍇')}return EVN('Algunas cepas no arraigarán, pero el esfuerzo cuenta.',[evEnd()],'Intento','🌱')}),
 O('Comprarle sarmientos de reserva (30 fl)',()=>{if(G.pc.gold<30)return EVN('No tienes tanto.',[evEnd()]);addGold(-30);repGain('penedes',3);G.fx=(G.fx||[]).filter(f=>f.k!=='vina_mala');return evEnd()}),
 O('Seguir camino',()=>evEnd())],'Replantar','🍇')});
