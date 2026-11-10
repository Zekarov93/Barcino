// ===================== DADOS MANUALES: el jugador tira el d20 =====================
function gated(fn){return function(...a){const self=this;let r;let done=false;
 gatedThen(()=>fn.apply(self,a),v=>{r=v;done=true});return r}}
// ejecuta fn con tiradas manuales; acumula las tiradas de cada intento y llama k(resultado) al terminar
function gatedThen(fn,k){const acc=[];
 const attempt=()=>{let need=null,res;DICE.queue=acc.slice();DICE.gate++;
  try{res=fn()}catch(e){if(e instanceof NeedRoll){need=e.w}else{DICE.gate--;DICE.queue.length=0;throw e}}
  DICE.gate--;
  if(need){const used=acc.length;rollModal(need,vals=>{acc.push(...vals);attempt()});return}
  DICE.queue.length=0;k(res)};
 attempt()}
function rollModal(w,cb){
 const n=w.mode?2:1;let rolled=false;const old=document.getElementById('dicebox');if(old)old.remove();
 const bg=h('div',{id:'dicebox',class:'dicebg'});
 const dies=[...Array(n)].map(()=>h('button',{class:'d20',type:'button'},h('span',{class:'dn'},'20')));
 const mod=(w.bonus>=0?'+':'')+w.bonus;const vs=(w.t==='atk'?'CA ':'CD ')+w.dc;
 const kind=w.t==='atk'?'Tirada de ataque':w.t==='save'?'Tirada de salvación':w.t==='craft'?'Tirada de oficio':'Prueba de habilidad';
 const info=h('div',{class:'dinfo'},'Modificador ',h('b',{},mod),' · contra ',h('b',{},vs),w.mode>0?' · ':'',w.mode>0?h('b',{class:'adv'},'ventaja (se queda el mayor)'):'',w.mode<0?' · ':'',w.mode<0?h('b',{class:'dis'},'desventaja (se queda el menor)'):'');
 const res=h('div',{class:'dres'},'');const go=h('button',{class:'btn pri dgo',type:'button',style:'display:none'},'Continuar');
 const hint=h('div',{class:'dhint'},n>1?'Pulsa los dados (o Espacio) para tirar':'Pulsa el dado (o Espacio) para tirar');
 const card=h('div',{class:'dicecard'},h('div',{class:'dk'},kind),h('h3',{},w.label||'Tirada'),info,h('div',{class:'dwrap'},dies),hint,res,go);bg.append(card);document.body.append(bg);
 let vals=[];
 const finish=()=>{document.removeEventListener('keydown',key,true);bg.remove();cb(vals)};
 const doRoll=()=>{if(rolled)return;rolled=true;hint.style.display='none';vals=[...Array(n)].map(()=>ri(1,20));
  dies.forEach(x=>x.classList.add('rolling'));let t=0;const iv=setInterval(()=>{dies.forEach(x=>x.firstChild.textContent=ri(1,20));if(++t>=14){clearInterval(iv);dies.forEach((x,i)=>{x.classList.remove('rolling');x.firstChild.textContent=vals[i]});
    const pick=n>1?(w.mode>0?Math.max(...vals):Math.min(...vals)):vals[0];if(n>1)dies.forEach((x,i)=>{if(vals[i]!==pick||(i===1&&vals[0]===vals[1]))x.classList.add('drop')});
    const tot=pick+w.bonus;const ok=pick===20||(pick!==1&&tot>=w.dc);
    res.className='dres '+(ok?'ok':'bad');res.textContent='['+pick+'] '+mod+' = '+tot+' vs '+vs+' → '+(ok?'ÉXITO':'FALLO')+(pick===20?' (¡crítico!)':pick===1?' (pifia)':'');go.style.display='';go.focus();
    sfxDice&&sfxDice(pick)}},55)};
 const key=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();e.stopPropagation();if(!rolled)doRoll();else if(go.style.display!=='none')finish()}};
 document.addEventListener('keydown',key,true);dies.forEach(x=>x.addEventListener('click',doRoll));go.addEventListener('click',finish);
 setTimeout(()=>dies[0].focus(),30)}
function sfxDice(v){try{if(UI.mute||!AUD.ctx)return;const c=AUD.ctx,t=c.currentTime;for(let i=0;i<3;i++){const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=300+Math.random()*300;g.gain.setValueAtTime(.05,t+i*.07);g.gain.exponentialRampToValueAtTime(.001,t+i*.07+.06);o.connect(g);g.connect(c.destination);o.start(t+i*.07);o.stop(t+i*.07+.07)}}catch(e){}}
