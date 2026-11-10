// ===================== VITALES: sed, hambre, salud y marcadores de jugador y compañeros =====================
GD('cantimplora','Cantimplora de cuero','tool',6,.4,{tool:'canteen'});SHOPS.general.push('cantimplora');SHOPS.fish.push('cantimplora');
const THIRST_DR={cerveza:22,vino:10,leche_cabra:25,leche_oveja:25,estofado:12,escudella:15,manzana:10,pera:10,granada:12,higo:6,mora:6,sopa:14};
function thirstOf(){const n=G.pc.needs;if(n.thirst==null)n.thirst=12;return n.thirst}
function drinkSome(k){const n=G.pc.needs;n.thirst=Math.max(0,thirstOf()-18*(k||1))}
function petWat(p){if(p.wat==null)p.wat=80;return p.wat}
function waterNear(x,y,r){const z=getZone(G.zone);if(!z||!z.solid)return null;let best=null,bd=1e9;const x0=Math.floor(x-r),x1=Math.floor(x+r),y0=Math.floor(y-r),y1=Math.floor(y+r);
 for(let j=y0;j<=y1;j++)for(let i=x0;i<=x1;i++){if(!inZ(z,i,j))continue;if(z.solid[ZI(z,i,j)]===2){const d=Math.hypot(i+.5-x,j+.5-y);if(d<=r&&d<bd){bd=d;best={x:i+.5,y:j+.5,kind:'water'}}}}
 for(const p of (z.props||[])){if(p.t!=='well'&&p.t!=='fountain')continue;const d=Math.hypot(p.x-x,p.y-y);if(d<=r+.6&&d<bd){bd=d;best={x:p.x,y:p.y,kind:p.t}}}return best}
const freshHere=()=>{const zi=ZINFO[G.zone.startsWith('int:')?(G.outPos&&G.outPos.zone)||'barcino':G.zone];return!zi||zi.biome!=='coast'};
function srcFresh(s){return s&&(s.kind!=='water'||freshHere())}
// acumulación continua
const _needsTickV=needsTick;needsTick=function(m,opt){_needsTickV(m,opt);try{vitTick(m,opt)}catch(e){if(!R._ve){R._ve=1;console.error('vitTick',e)}}};
let _wxw=0;
function vitTick(m,opt){const p=G.pc;if(!p||!p.needs)return;const h=m/60;const sl=opt&&opt.sleep;const w=wxOf(G.zone);const tmp=w?w.temp:15;
 const heat=tmp>24?(tmp-24)*.18:0;p.needs.thirst=clamp(thirstOf()+h*((sl?2.2:5.6)+(sl?0:heat))*(SPECIES[p.species].hunger||1),0,100);
 if(p.needs.thirst>=100&&!sl){p.hp=Math.max(0,p.hp-h*1.8);p.needs.fatigue=clamp(p.needs.fatigue+h*2,0,100)}
 if(p.needs.thirst>=75&&!p._tw){p._tw=1;log('Tienes la boca seca. Necesitas beber pronto.','warn')}if(p.needs.thirst<60)p._tw=0;
 if(p.needs.thirst>=95&&!p._tw2){p._tw2=1;log('La sed te nubla la vista: bebe ya o te desplomarás.','bad')}if(p.needs.thirst<80)p._tw2=0;
 // compañeros
 const near=waterNear(G.px,G.py,7);const fresh=near&&srcFresh(near);
 for(const q of petsOf()){if(q.stance==='carta')continue;const home=q.stance==='descansar';
  q.sat=Math.max(0,(q.sat==null?70:q.sat)-m/1440*(home?4:12));
  if(home){q.wat=Math.max(petWat(q),hasHomeFeed()?60:25);continue}
  q.wat=clamp(petWat(q)-h*(4.5+heat*.6),0,100);if(fresh&&!(q.ko&&q.ko>G.t))q.wat=Math.min(100,q.wat+h*90+20*(m>=1?1:0)*0);
  if(q.wat<=0){q.hp=Math.max(1,q.hp-h*q.maxHp*.04);q.loy=Math.max(0,(q.loy==null?60:q.loy)-h*.5);if(!q._ww){q._ww=1;log(q.name+' se muere de sed.','bad')}}else if(q.wat>35)q._ww=0;
  if(q.wat<25&&!q._wl){q._wl=1;log(q.name+' tiene sed. Busca agua o dale de beber.','warn')}if(q.wat>50)q._wl=0;
  if((q.sat||0)<=0&&!q._hl){q._hl=1;log(q.name+' pasa hambre.','warn')}if((q.sat||0)>30)q._hl=0}}
// beber en fuentes, pozos y ríos
const _nearInt=nearestInteract;nearestInteract=function(){const best=_nearInt();if(best&&best.type!=='flora')return best;const w=waterNear(G.px,G.py,1.9);if(!w)return best;const fr=srcFresh(w);return{type:'drink',w,target:{x:w.x,y:w.y},fresh:fr,label:fr?(w.kind==='water'?'Beber del agua':'Beber '+(w.kind==='well'?'del pozo':'de la fuente'))+(thirstOf()>25?'':' (no tienes sed)'):'Agua salada (no se puede beber)'}};
const _doInt=doInteract;doInteract=function(it){if(it&&it.type==='drink'){if(R.modal)return;return drinkAt(it)}return _doInt(it)};
function drinkAt(it){const p=G.pc;if(!it.fresh){log('Pruebas el agua: es salada. Escupes. No sirve para beber.','warn');return}
 advance(6,{step:3});const turb=it.w.kind==='water'&&(G.carc&&G.carc[G.zone]>6);
 if(turb&&Math.random()<.35){const r=check('survival',12,{ab:'con',label:'Agua turbia'});if(!r.ok){p.poison=3;log('El agua sabía mal: te revuelve las tripas. Estás envenenado.','bad')}}
 const before=thirstOf();p.needs.thirst=Math.max(0,before-60);let m='Bebes con ganas.';
 if(invCount(p.inv,'cantimplora')){p.canteen=4;m+=' Rellenas la cantimplora.'}
 let pets=0;for(const q of petsOf()){if(q.stance==='carta'||q.stance==='descansar')continue;q.wat=Math.min(100,petWat(q)+70);pets++}if(pets)m+=' Tus compañeros beben a tu lado.';log(m,'good');bus.emit('inv')}
// cantimplora y bebidas
const _useItemV=useItem;useItem=function(i){const s=G.pc.inv[i];if(s&&s.id==='cantimplora'){const p=G.pc;if(!p.canteen){return log('La cantimplora está vacía. Rellénala en una fuente, pozo o río.','warn')}p.canteen--;p.needs.thirst=Math.max(0,thirstOf()-35);log('Bebes un trago de la cantimplora ('+p.canteen+'/4).','good');bus.emit('inv');return}
 const id=s&&s.id;const n0=id?invCount(G.pc.inv,id):0;const r=_useItemV(i);if(id&&THIRST_DR[id]&&invCount(G.pc.inv,id)<n0)G.pc.needs.thirst=Math.max(0,thirstOf()-THIRST_DR[id]);return r};
bus.on('sleep',e=>{try{if(e&&e.where==='inn')G.pc.needs.thirst=Math.min(thirstOf(),25)}catch(er){}});
// acciones en el panel de compañeros
function wetActs(p,act,draw){if(p.stance==='carta')return;const w=waterNear(G.px,G.py,2.2);
 if(G.pc.canteen>0&&invCount(G.pc.inv,'cantimplora'))act.append(h('button',{class:'btn',onclick:()=>{if(!G.pc.canteen)return;G.pc.canteen--;p.wat=Math.min(100,petWat(p)+55);p.loy=Math.min(100,(p.loy||50)+.5);log('Le das de beber a '+p.name+' ('+G.pc.canteen+'/4).','good');draw()}},'Dar de beber 💧 ('+G.pc.canteen+'/4)'));
 if(w&&srcFresh(w))act.append(h('button',{class:'btn',onclick:()=>{p.wat=100;log(p.name+' bebe hasta saciarse.','good');draw()}},'Llevar a beber'))}
// ---------- marcadores en pantalla ----------
const VCOL=v=>v>60?'#7cc860':v>35?'#d8b040':v>18?'#e8873a':'#e04a4a';
function vitRow(ico,id,tip){return h('div',{class:'vrow',id:id+'R',title:tip},h('span',{class:'vi'},ico),h('div',{class:'vb'},h('i',{id:id})),h('b',{id:id+'T'}))}
const _buildHUD=buildHUD;buildHUD=function(){_buildHUD();try{const panel=document.querySelector('.hud-tl');if(!panel)return;const nd=panel.querySelector('.needs');
 if(nd){['nHunger','nFat'].forEach(i=>{const e=document.getElementById(i);if(e)e.style.display='none'})}
 const vit=h('div',{class:'vit'},vitRow('🍞','vHun','Saciedad: baja con el tiempo. Come para recuperarla.'),vitRow('💧','vThi','Hidratación: bebe en fuentes, pozos y ríos, o usa la cantimplora.'),vitRow('⚡','vEne','Energía: descansa o duerme.'),h('div',{id:'vSt',class:'vst'}));
 const xp=panel.querySelector('.bar.xp');if(xp)xp.after(vit);else panel.append(vit);
 panel.append(h('div',{id:'petHud',class:'phud'}))}catch(e){console.error('vit HUD',e)}};
let _phKey='';
function vitUpdate(){if(!G||!G.pc)return;const p=G.pc,n=p.needs;const set=(id,v)=>{const el=document.getElementById(id);if(!el)return;const f=Math.max(0,Math.min(100,v));el.style.width=f+'%';el.style.background=VCOL(f);const t=document.getElementById(id+'T');if(t)t.textContent=Math.round(f);const r=document.getElementById(id+'R');if(r)r.classList.toggle('low',f<18)};
 set('vHun',100-n.hunger);set('vThi',100-thirstOf());set('vEne',100-n.fatigue);
 const st=document.getElementById('vSt');if(st){const c=[];if(p.poison)c.push('☠ veneno');if(p.inf)for(const k in p.inf)c.push('🦠 '+(DIS&&DIS[k]?DIS[k].n.toLowerCase():k)+(p.inf[k].st?' (síntomas)':''));if(n.hunger>=100)c.push('😵 inanición');if(thirstOf()>=100)c.push('😵 deshidratación');if(p.canteen!=null&&invCount(p.inv,'cantimplora'))c.push('🫗 '+p.canteen+'/4');st.textContent=c.join(' · ')}
 // compañeros
 const ph=document.getElementById('petHud');if(!ph)return;const act=activePets(),all=petsOf();const key=act.map(a=>a.id).join(',')+'|'+all.filter(a=>a.stance==='carta').length;
 if(key!==_phKey){_phKey=key;ph.innerHTML='';for(const a of act){let cv;try{cv=petCanvas(a,1.1)}catch(e){cv=h('span',{},'🐾')}
   ph.append(h('div',{class:'phr',id:'ph_'+a.id},h('div',{class:'phc'},cv),h('div',{class:'phi'},h('div',{class:'phn'},a.name,h('small',{},' Nv'+(a.lvl||1)),h('em',{id:'phs_'+a.id})),
    h('div',{class:'vb sm'},h('i',{id:'phh_'+a.id})),h('div',{class:'vb sm'},h('i',{id:'phf_'+a.id})),h('div',{class:'vb sm'},h('i',{id:'phw_'+a.id})))))}
  const sc=all.filter(a=>a.stance==='carta').length;if(sc)ph.append(h('div',{class:'phx'},'🃏 '+sc+' contenid'+(sc>1?'as':'a')+' ('+all.filter(a=>a.stance==='carta').map(a=>a.name).join(', ')+')'))}
 for(const a of act){const g=(id,v,col)=>{const e=document.getElementById(id+a.id);if(!e)return;const f=Math.max(0,Math.min(100,v));e.style.width=f+'%';e.style.background=col||VCOL(f)};
  g('phh_',a.hp/a.maxHp*100,a.hp/a.maxHp>.5?'#d85a5a':a.hp/a.maxHp>.25?'#e8873a':'#e04a4a');g('phf_',a.sat==null?70:a.sat,(a.sat==null?70:a.sat)>35?'#c8a84a':'#e8873a');g('phw_',petWat(a),petWat(a)>35?'#4aa0e0':'#e8873a');
  const s=document.getElementById('phs_'+a.id);if(s){const t=[];if(a.dz)t.push('🦠');if((a.sat||70)<20)t.push('🍖');if(petWat(a)<20)t.push('💧');if(a.hp<a.maxHp*.3)t.push('❤');s.textContent=t.length?' '+t.join(''):''}}}
const _updHUDV=updateHUD;updateHUD=function(){_updHUDV();try{vitUpdate()}catch(e){if(!R._vu){R._vu=1;console.error('vitUpdate',e)}}};
