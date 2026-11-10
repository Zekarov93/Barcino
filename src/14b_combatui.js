// ===================== COMBATE v2: escena visual con sprites, animaciones y menú táctico =====================
let CV=null;
const CW=384,CH=200,CGY=152;
const DUR={log:150,atk:780,hp:130,num:300,die:560,fled:520,aura:380,cast:480,intent:40,status:30,round:40,over:200};
function mulb(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const ease=u=>u<0?0:u>1?1:u*u*(3-2*u);
// ---- sonido sintetizado (opcional) ----
let _ac=null;
function sfx(k){if(UI.mute)return;try{_ac=_ac||new(window.AudioContext||window.webkitAudioContext)();if(_ac.state==='suspended')_ac.resume();const t=_ac.currentTime;
 const tone=(f0,f1,d,type,v)=>{const o=_ac.createOscillator(),g=_ac.createGain();o.type=type||'square';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+d);g.gain.setValueAtTime(v||.06,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(_ac.destination);o.start(t);o.stop(t+d)};
 const noise=(d,v,f)=>{const n=_ac.sampleRate*d,b=_ac.createBuffer(1,n,_ac.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=_ac.createBufferSource(),fl=_ac.createBiquadFilter(),g=_ac.createGain();s.buffer=b;fl.type='lowpass';fl.frequency.value=f||2400;g.gain.value=v||.15;s.connect(fl);fl.connect(g);g.connect(_ac.destination);s.start(t)};
 if(k==='hit'){noise(.12,.2,1800);tone(160,60,.12,'triangle',.12)}else if(k==='crit'){noise(.2,.28,3200);tone(260,50,.22,'sawtooth',.1);tone(520,200,.12,'square',.05)}
 else if(k==='miss'){noise(.18,.07,900)}else if(k==='heal'){tone(520,780,.18,'sine',.07);setTimeout(()=>{try{tone(780,1040,.2,'sine',.06)}catch(e){}},110)}
 else if(k==='magic'){tone(300,900,.3,'sawtooth',.045)}else if(k==='die'){tone(220,40,.5,'triangle',.1)}else if(k==='win'){[440,554,660,880].forEach((f,i)=>setTimeout(()=>{try{tone(f,f,.18,'square',.05)}catch(e){}},i*110))}
 else if(k==='lose'){tone(300,70,.7,'sawtooth',.07)}else if(k==='shot'){tone(900,300,.1,'square',.04);noise(.08,.06,3000)}}catch(e){}}
// ---- fondo procedural ----
function drawBackdrop(zid,t,wxType){const c=document.createElement('canvas');c.width=CW;c.height=CH;const g=c.getContext('2d');g.imageSmoothingEnabled=false;const rnd=mulb(Math.floor(t/1440)*31+zid.length*7);
 const ph=phaseOf(t).id,night=ph===0||ph===6;const indoor=zid.startsWith('int:');
 const R_=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h)};
 const SK={0:['#080c20','#1a2244'],1:['#2c2850','#e89870'],2:['#4a88cc','#bfe2f2'],3:['#4486d0','#cfe8f6'],4:['#5690cc','#ecdcb4'],5:['#382858','#f07a46'],6:['#080c20','#1a2244']};
 let [a,b]=SK[ph];const gray=wxType==='rain'||wxType==='storm'||wxType==='snow'||wxType==='hail'?.65:wxType==='cloudy'||wxType==='fog'?.4:0;if(gray){const gc=night?'#20242c':'#8a9098';a=mixc(a,gc,gray);b=mixc(b,gc,gray)}
 const tint=night?-.5:ph===1||ph===5?-.12:0;
 if(indoor){R_(0,0,CW,CGY,'#2a1e18');for(let y=0;y<CGY;y+=10)for(let x=((y/10)%2)*12;x<CW;x+=24){R_(x,y,23,9,rnd()<.5?'#3a2a20':'#33261c')}
  for(const tx of[60,190,320]){R_(tx-2,50,4,10,'#5a3a1a');R_(tx-3,44,6,6,'#ff9a3a');R_(tx-2,42,4,4,'#ffe08a');const gl=g.createRadialGradient(tx,48,2,tx,48,60);gl.addColorStop(0,'rgba(255,170,70,.35)');gl.addColorStop(1,'rgba(255,170,70,0)');g.fillStyle=gl;g.fillRect(tx-60,0,120,130)}
  R_(0,CGY-4,CW,4,'#1a120e');for(let y=CGY;y<CH;y+=8){R_(0,y,CW,8,(y/8)%2?'#4a3220':'#523824');for(let x=((y/8)%2)*20;x<CW;x+=40)R_(x,y,1,8,'#2e1e12')}return c}
 const sg=g.createLinearGradient(0,0,0,CGY);sg.addColorStop(0,a);sg.addColorStop(1,b);g.fillStyle=sg;g.fillRect(0,0,CW,CGY);
 if(night){for(let i=0;i<60;i++){R_(rnd()*CW,rnd()*90,1,1,rnd()<.2?'#fff':'#9ab0e0')}}
 const sx=ph<=1?330:ph>=5?60:ph===2?250:ph===3?190:140;const sy=ph===0||ph===6?26:ph===1||ph===5?100:ph===2?44:26;
 if(!gray||gray<.5){if(night){R_(sx-9,sy-9,18,18,'#e8eaf6');R_(sx-3,sy-9,12,18,'#cdd2ea');R_(sx-5,sy-5,3,3,'#b0b6d8')}else{const gl=g.createRadialGradient(sx,sy,2,sx,sy,40);gl.addColorStop(0,'rgba(255,240,180,.8)');gl.addColorStop(1,'rgba(255,240,180,0)');g.fillStyle=gl;g.fillRect(sx-40,sy-40,80,80);R_(sx-7,sy-7,14,14,'#fff3b0')}}
 if(gray||rnd()<.6){for(let i=0;i<5;i++){const cx=rnd()*CW,cy=14+rnd()*50,w=40+rnd()*60;const cc=mixc(night?'#2a3050':'#ffffff',b,.25+gray*.3);for(let k=0;k<4;k++)R_(cx+k*4,cy+(k%2)*3,w-k*12,5,cc)}}
 const far=mixc(a,'#4a5a78',.5+tint*.3),near=mixc(b,'#3a4a58',.55+tint*.2);
 const ridge=(col,base,amp,step,jag)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,CGY);let h=base;for(let x=0;x<=CW;x+=step){h=base+Math.sin(x*.021+base)*amp+(jag?(rnd()-.5)*jag:0);g.lineTo(x,h)}g.lineTo(CW,CGY);g.closePath();g.fill()};
 const mont=zid==='montserrat';
 if(mont){ridge(far,70,14,5,0);// agujas de Montserrat
  g.fillStyle=mixc('#7a6a60',a,.35+(night?.4:0));for(let i=0;i<14;i++){const x=10+i*28+rnd()*10,w=14+rnd()*12,h=50+rnd()*60;g.fillRect(x,CGY-h,w,h);g.beginPath();g.arc(x+w/2,CGY-h,w/2,Math.PI,0);g.fill();for(let k=0;k<4;k++){g.fillStyle=mixc('#5a4a44',a,.4);g.fillRect(x+3+k*3,CGY-h+8,1,h-10);g.fillStyle=mixc('#7a6a60',a,.35+(night?.4:0))}}}
 else ridge(far,zid==='collbato'?96:82,10,6,6);
 ridge(near,zid==='collbato'?116:108,7,5,4);
 // capa media por lugar
 if(zid==='barcino'||zid==='martorell'){const cols=night?['#1a1c2c','#222638','#2c2a3a']:['#9a8c78','#b0a088','#8c7e6c','#a8947a'];let x=-6;while(x<CW){const w=22+rnd()*26,h=30+rnd()*40;const bc=cols[Math.floor(rnd()*cols.length)];R_(x,CGY-h,w,h,mixc(bc,a,.15));const rc=night?'#14161f':'#7a4a3a';g.fillStyle=rc;g.beginPath();g.moveTo(x-2,CGY-h);g.lineTo(x+w/2,CGY-h-10-rnd()*8);g.lineTo(x+w+2,CGY-h);g.fill();
   for(let wy=CGY-h+6;wy<CGY-6;wy+=10)for(let wx=x+4;wx<x+w-4;wx+=8){R_(wx,wy,3,4,night&&rnd()<.55?'#ffd070':night?'#0c0e16':'#4a5a6a')}x+=w+rnd()*4}
  if(zid==='martorell'){R_(0,CGY-26,CW,6,mixc('#8a8070',a,.1));for(let ax=10;ax<CW;ax+=64){g.fillStyle=mixc('#1a2a3a',a,.3);g.beginPath();g.arc(ax+22,CGY-20,18,Math.PI,0);g.fill()}R_(CW-70,CGY-60,14,36,mixc('#7a7060',a,.1));R_(CW-72,CGY-66,18,8,mixc('#5a4a40',a,.1))}
  else{const sea=night?'#101a34':'#3a78b0';R_(0,CGY-30,CW,6,sea);for(let i=0;i<30;i++)R_(rnd()*CW,CGY-30+rnd()*5,6,1,night?'#3a4a7a':'#9ad0f0')}}
 else if(zid==='collbato'){g.fillStyle=mixc('#b08a5a',a,.3+(night?.4:0));for(let i=0;i<6;i++){const x=i*70+rnd()*30,w=40+rnd()*30,h=26+rnd()*30;g.fillRect(x,CGY-h,w,h);R_(x+w*.3,CGY-h-5,w*.4,5,g.fillStyle)}R_(CW*.55,CGY-24,36,24,'#120c08');g.fillStyle='#120c08';g.beginPath();g.arc(CW*.55+18,CGY-24,18,Math.PI,0);g.fill()}
 else if(!mont||true){const n=zid==='collserola'?26:12;const tc=mixc('#2a4a2a',a,.3+(night?.3:0)),tc2=mixc('#3a5e34',a,.25+(night?.3:0));for(let i=0;i<n;i++){const x=i*(CW/n)+rnd()*8,h=28+rnd()*30,pine=rnd()<.6;R_(x+2,CGY-8-(pine?0:4),3,10,mixc('#4a3220',a,.2));if(pine){for(let k=0;k<4;k++)R_(x-k*2+1,CGY-10-k*h/5-6,6+k*4,h/5+2,k%2?tc:tc2)}else{g.fillStyle=tc2;g.beginPath();g.arc(x+3,CGY-h*.55,10+rnd()*4,0,6.3);g.fill()}}}
 // niebla lejana
 if(wxType==='fog'||gray>.3){g.fillStyle='rgba(200,205,210,.25)';g.fillRect(0,60,CW,CGY-60)}
 // suelo
 const gb=zid==='barcino'?['#6a6660','#5a5650']:zid==='collbato'?['#a08258','#8a6c46']:zid==='montserrat'?['#6a6258','#585048']:zid==='martorell'?['#5a7040','#486030']:['#4a6a30','#3a5a26'];
 const dim=night?-.55:ph===1||ph===5?-.2:0;const gc0=shade(gb[0],dim),gc1=shade(gb[1],dim);
 const gg=g.createLinearGradient(0,CGY,0,CH);gg.addColorStop(0,gc1);gg.addColorStop(1,gc0);g.fillStyle=gg;g.fillRect(0,CGY,CW,CH-CGY);
 R_(0,CGY,CW,2,shade(gb[1],dim-.15));
 if(zid==='barcino'){for(let y=CGY+4;y<CH;y+=9)for(let x=((y-CGY)/9%2)*10;x<CW;x+=20){R_(x,y,19,8,rnd()<.5?shade(gb[0],dim+.04):shade(gb[1],dim));R_(x+19,y,1,8,shade(gb[1],dim-.2))}}
 else{for(let i=0;i<260;i++){const y=CGY+3+rnd()*(CH-CGY-3);R_(rnd()*CW,y,1+rnd()*3,1,shade(rnd()<.5?gb[0]:gb[1],dim+(rnd()-.5)*.25))}
  if(zid==='collserola'||zid==='martorell'){for(let i=0;i<36;i++){const x=rnd()*CW,y=CGY+6+rnd()*(CH-CGY-8);R_(x,y,1,3,shade('#5a8a3a',dim));R_(x+2,y+1,1,2,shade('#6a9a44',dim))}}
  if(zid==='montserrat'||zid==='collbato'){for(let i=0;i<14;i++){const x=rnd()*CW,y=CGY+8+rnd()*(CH-CGY-12);R_(x,y,4+rnd()*6,3,shade('#8a8278',dim));R_(x,y,4,1,shade('#a8a096',dim))}}}
 if(night){g.fillStyle='rgba(10,14,40,.35)';g.fillRect(0,0,CW,CH)}else if(ph===1||ph===5){g.fillStyle='rgba(240,120,60,.12)';g.fillRect(0,0,CW,CH)}
 return c}
// ---- entidades ----
function mkHumanFrames(look){const arr=[];for(let f=0;f<4;f++){const c=document.createElement('canvas');c.width=FW;c.height=FH;const x=c.getContext('2d');drawChar(x,0,0,look,2,f);arr.push(c)}return arr}
function mkEnt(who,x,y,pc){const E={who,x,y,ox:0,oy:0,rot:0,alpha:1,flash:0,fcol:'#fff',shake:0,aura:null,dying:false,fleeing:false,bob:Math.random()*6,pc:!!pc,sc:3/HR,flip:!pc,moving:0,air:0};
 if(pc){E.frames=mkHumanFrames(pcSprite());E.w=FW;E.h=FH;E.kind='hu';E.name=G.pc.name}
 else{const s=who.spr;E.name=who.name;if(s&&s.t==='hu'){E.frames=mkHumanFrames(s.look);E.w=FW;E.h=FH;E.kind='hu'}else{const sh=creatureSheet(s.sp,s.gn);E.img=sh.canvas;E.fw=sh.fw;E.w=sh.fw;E.h=sh.fh;E.kind='cr';E.fly=!!CREAT[s.sp].fly;E.sc=(s.sp==='vibria'?2.3:s.sp==='ogro'?2.6:3)/HR}}
 if(!pc&&E.kind==='hu')E.sc=3/HR;
 E.dw=E.w*E.sc;E.dh=E.h*E.sc;return E}
function frameImg(E,f){return E.kind==='hu'?{img:E.frames[f],sx:0,sy:0,sw:FW,sh:FH}:{img:E.img,sx:f*E.fw,sy:0,sw:E.fw,sh:E.h}}
function layoutEnts(){const n=CV.ents.length;const xs={1:[290],2:[252,328],3:[206,268,336],4:[196,244,296,346],5:[190,230,272,314,354]}[Math.min(5,n)]||[290];const k=n>=4?.7:n===3?.8:1;CV.ents.forEach((E,i)=>{E.sc*=k;E.dw=E.w*E.sc;E.dh=E.h*E.sc;E.x=xs[i];E.y=CGY+12+(i%2?10:0)})}
function entOf(w){return w==='pc'?CV.pc:w._ent}
// ---- apertura ----
function openCombatView(cb){DLGclose();R.modal=true;
 const bg=h('div',{class:'mbg cbg'});const box=h('div',{class:'cbox'});bg.append(box);$('#modals').append(bg);
 CV={busy:()=>busyFn(),bg,box,cb,q:[],cur:null,time:0,last:0,ents:[],sel:null,menu:'main',fast:false,shownRes:false,parts:[],floats:[],proj:null,cast:null,shake:0,vig:0,zone:G.zone};
 CV.bgc=drawBackdrop(G.zone,G.t,wxOf(G.zone).type);
 CV.pc=mkEnt('pc',76,CGY+14,true);CV.ents=cb.enemies.map(e=>{const E=mkEnt(e,0,0,false);e._ent=E;return E});layoutEnts();CV.sel=cb.enemies[0];
 const stage=h('div',{class:'cstage'});const cv=h('canvas',{class:'cvs',width:CW,height:CH});CV.cv=cv;CV.ctx=cv.getContext('2d');CV.ctx.imageSmoothingEnabled=false;
 CV.floatEl=h('div',{class:'cfloat'});CV.labEl=h('div',{class:'clabs'});CV.banner=h('div',{class:'cround'},'Ronda 1');
 CV.resEl=h('div',{class:'cres'});CV.resEl.style.display='none';
 const tools=h('div',{class:'ctools'},h('button',{class:'mini',title:'Acelerar animaciones',onclick:e=>{CV.fast=!CV.fast;e.target.classList.toggle('on',CV.fast)}},'⏩'),h('button',{class:'mini'+(UI.mute?' dim':''),title:'Sonido',onclick:e=>{audInit();audMute(!UI.mute);e.target.classList.toggle('dim',UI.mute);e.target.textContent=UI.mute?'🔇':'🔊'}},UI.mute?'🔇':'🔊'));
 stage.append(cv,CV.labEl,CV.floatEl,CV.banner,tools,CV.resEl);
 CV.logEl=h('div',{class:'clog'});CV.pcEl=h('div',{class:'cpc'});CV.menuEl=h('div',{class:'cmenu'});CV.noteEl=h('div',{class:'cnote'});
 const left=h('div',{class:'cleft'},CV.pcEl,CV.logEl);const right=h('div',{class:'cright'},CV.noteEl,CV.menuEl);
 box.append(stage,h('div',{class:'cbot'},left,right));
 // etiquetas
 const mkLab=(E,pc)=>{const el=h('div',{class:'elab'+(pc?' pc':'')},h('div',{class:'eint'}),h('div',{class:'enm'},E.name),h('div',{class:'ehp'},h('i')),h('div',{class:'est'}));E.lab=el;CV.labEl.append(el);if(!pc)el.addEventListener('click',()=>{if(E.who.hp>0&&!E.who.fled){CV.sel=E.who;sfx('miss');refreshAll()}});return el};
 mkLab(CV.pc,true);CV.ents.forEach(E=>mkLab(E,false));
 cv.addEventListener('click',ev=>{const r=cv.getBoundingClientRect();const x=(ev.clientX-r.left)/r.width*CW,y=(ev.clientY-r.top)/r.height*CH;for(const E of CV.ents){if(E.who.hp<=0||E.who.fled)continue;if(Math.abs(x-E.x)<E.dw/2+4&&y>E.y-E.dh-4&&y<E.y+6){CV.sel=E.who;refreshAll();return}}});
 refreshAll();CV.raf=requestAnimationFrame(cvFrame)}
function closeCombatView(){if(!CV)return;const _res=CB&&CB.result;cancelAnimationFrame(CV.raf);CV.bg.remove();CV=null;G.combat=null;CB=null;R.modal=UI.stack.length>0;R.grace=Math.max(R.grace||0,10);R.keys={};updateHUD();bus.emit('endcombat',_res)}
bus.on('combat',cb=>{if(!CV)openCombatView(cb)});
// ---- etiquetas / paneles ----
function statIcons(E){const ic=[];if(E.pc){const P=CB.pst,p=G.pc;if(P.prone)ic.push('🦵 Derribado');if(P.bleed>0)ic.push('🩸 Sangrando '+P.bleed);if(p.poison>0)ic.push('☠ Veneno '+p.poison);if(P.dazed>0)ic.push('😵 Cegado');if(P.aim)ic.push('🎯 Apuntando');if(CB.defend)ic.push('🛡 Guardia');if(CB.rage)ic.push('🔥 Furia');if(CB.shield>0)ic.push('✦ Escudo');if(CB.bless>0)ic.push('✚ Bendición');if(CB.mark>0)ic.push('◎ Presa marcada');if(CB.tempHp>0)ic.push('♥ +'+CB.tempHp+' temp.')}
 else{const e=E.who;if(e.st.prone)ic.push('🦵');if(e.sleep>0)ic.push('💤');if(e.dis>0)ic.push('😨');if(e.bleed>0)ic.push('🩸');if(e.fled)ic.push('🏃')}return ic}
function updLab(E){if(!E.lab)return;const e=E.pc?null:E.who;const hp=E.pc?CB.pdhp:e.dhp,mx=E.pc?G.pc.maxHp:e.maxHp;const lab=E.lab;
 lab.querySelector('.ehp i').style.width=clamp(hp/mx*100,0,100)+'%';lab.querySelector('.ehp').dataset.t=Math.max(0,Math.ceil(hp))+'/'+mx;
 const st=lab.querySelector('.est');st.textContent=E.pc?'':statIcons(E).join(' ');
 const it=lab.querySelector('.eint');if(!E.pc&&e.dint&&e.hp>0&&!e.fled){const S=SPECIALS[e.dint];it.textContent='⚠ '+S.n;it.style.display='block'}else it.style.display='none';
 lab.classList.toggle('sel',!E.pc&&CV.sel===e);lab.classList.toggle('dead',!E.pc&&(e.hp<=0||e.fled)&&!E.dying);
 const px=(E.x+E.ox)/CW*100,py=(E.y+E.oy-E.dh-(E.fly?8:0)-4)/CH*100;lab.style.left=px+'%';lab.style.top=py+'%'}
function updPcPanel(){const p=G.pc,P=CV.pcEl;const hp=CB.pdhp;P.innerHTML='';const sl=p.slots&&p.slots.max?' · Conjuros '+p.slots.cur+'/'+p.slots.max:'';
 P.append(h('div',{class:'cpn'},h('b',{},p.name),h('small',{},' Nv '+p.level+' · CA '+p.ac+sl+' · Ronda '+CB.round)),h('div',{class:'bar hp big'},h('i',{style:'width:'+clamp(hp/p.maxHp*100,0,100)+'%'}),h('b',{},Math.ceil(hp)+'/'+p.maxHp)),h('div',{class:'cst'},statIcons(CV.pc).join('  ')||'Sin estados'))}
function refreshAll(){if(!CV)return;const alv=alive();if(!alv.includes(CV.sel))CV.sel=alv[0]||CV.sel;CV.ents.forEach(updLab);updLab(CV.pc);updPcPanel();buildMenu()}
// ---- menú ----
function hitPct(t){const w=weaponOf(G.pc);const b=atkBonusPC(w).tot;const adv=pcAdvVs(t);let p=clamp((21-(t.ac-b))/20,.05,.95);if(adv>0)p=1-(1-p)*(1-p);if(adv<0)p=p*p;return Math.round(p*100)}
function perform(kind,a2,a3){if(!CV||CV.busy()||CB.over)return;const alv=alive();const i=Math.max(0,alv.indexOf(CV.sel));CV.menu='main';CV.noteEl.textContent='';CB.manual=true;const g=combatActG(kind,i,a3!==undefined?a3:a2);CV.rolling=true;
 const step=v=>{let s;try{s=g.next(v)}catch(e){CB.manual=false;CV.rolling=false;throw e}
  if(!s.done){rollModal(s.value,vals=>step(vals));return}
  CB.manual=false;CV.rolling=false;if(s.value===false){CV.noteEl.textContent='Esa acción no se puede usar ahora.'}refreshAllSoft()};
 step()}
function refreshAllSoft(){if(!CV)return;buildMenu();updPcPanel()}
function buildMenu(){const m=CV.menuEl;m.innerHTML='';const busy=CV.busy(),p=G.pc;const over=CB.over;if(over){m.append(h('div',{class:'dim'},'El combate ha terminado.'));return}
 const dis=busy;const t=CV.sel;const w=weaponOf(p);
 const B=(ico,label,sub,fn,cls,tip)=>h('button',{class:'cact'+(cls?' '+cls:''),disabled:dis?'':null,title:tip||'',onclick:fn},h('span',{class:'ci'},ico),h('span',{class:'cl'},label,h('small',{},sub||'')));
 if(busy){m.append(h('div',{class:'cwait'},'…'));}
 if(CV.menu==='main'){const en=alive();
  m.append(h('div',{class:'cgrid'},
   B('⚔','Atacar',(t?hitPct(t)+'% · ':'')+(w?w.dmg:'1d4'),()=>perform('attack'),'pri','Ataque con tu arma'),
   B('🎯','Apuntar','Ventaja al próximo ataque',()=>perform('aim')),
   B('🦵','Derribar','Atletismo · cae y pierde turno',()=>perform('trip'),'','Si lo derribas, tu siguiente ataque tiene ventaja'),
   B('🛡','Defender','+2 CA · medio daño a especiales',()=>perform('defend')),
   B('✨','Habilidades',(p.spells.length+Object.keys(p.sig).filter(k=>p.sig[k]>0&&COMBAT_SIGS.includes(k)).length)+' disponibles',()=>{CV.menu='skills';buildMenu()},'',''),
   B('🧪','Objetos',(p.inv.filter(s=>ITEMS[s.id].heal).length)+' útiles',()=>{CV.menu='items';buildMenu()}),
   B('🗣','Social','Parlamentar · Intimidar'+(en.some(e=>e.kind==='animal'&&!e.monster)?' · Calmar':''),()=>{CV.menu='social';buildMenu()}),
   B('🏃','Huir','Acrobacias CD '+Math.round(10+en.length*1.5),()=>perform('flee'),'dim')))}
 else{m.append(h('button',{class:'mini cback',onclick:()=>{CV.menu='main';buildMenu()}},'← Volver'));const g=h('div',{class:'cgrid'});
  if(CV.menu==='skills'){let any=0;p.spells.forEach(sid=>{const S=SPELLS[sid];if(S.lvl>0&&p.slots.cur<=0)return;any=1;g.append(B('✨',S.n,(S.lvl>0?'Nv'+S.lvl+' · ':'Truco · ')+(S.dmg||''),()=>perform('spell',0,sid),'',S.d))});
   Object.keys(p.sig).forEach(k=>{if(p.sig[k]>0&&COMBAT_SIGS.includes(k)){any=1;g.append(B('★',SIGN[k],'Habilidad de clase',()=>perform('sig',0,k)))}});if(!any)g.append(h('div',{class:'dim'},'Sin habilidades disponibles.'))}
  else if(CV.menu==='items'){let any=0;p.inv.forEach((s,i)=>{if(ITEMS[s.id].heal){any=1;g.append(B('🧪',itemName(s),'×'+s.n+' · cura y cierra heridas',()=>perform('potion',0,i)))}});if(typeof capButtons==='function'&&capButtons(g,B))any=1;if(!any)g.append(h('div',{class:'dim'},'No llevas pociones.'))}
  else if(CV.menu==='social'){const en=alive();g.append(B('🗣','Parlamentar','Persuasión',()=>perform('talk')),B('😠','Intimidar','Intimidación · desventaja o huida',()=>perform('intimidate')));if(en.some(e=>e.kind==='animal'&&!e.monster))g.append(B('🐾','Calmar bestia','Trato con animales',()=>perform('calm')))}
  m.append(g)}}
const COMBAT_SIGS=['rage','secondwind','layhands','smite','huntersmark','flurry','wild','inspire','turn'];
// ---- reproducción de eventos ----
function ctxFloat(E,txt,cls){const f=h('div',{class:'flt '+(cls||'')},txt);const px=(E.x+E.ox)/CW*100,py=(E.y-E.dh*.8)/CH*100;f.style.left=(px+(Math.random()-.5)*4)+'%';f.style.top=py+'%';CV.floatEl.append(f);setTimeout(()=>f.remove(),1100)}
function burst(x,y,col,n,spd,g){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=(.4+Math.random())*spd;CV.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-spd*.4,life:0,max:.35+Math.random()*.35,col,size:1+Math.floor(Math.random()*3),g:g==null?120:g})}}
function startEv(c){const E=c.who!==undefined?(c.who==='pc'?CV.pc:c.who._ent):null;
 switch(c.k){
  case'log':{const d=h('div',{class:c.c},c.m);CV.logEl.append(d);while(CV.logEl.children.length>40)CV.logEl.firstChild.remove();CV.logEl.scrollTop=CV.logEl.scrollHeight;c.dur=(c.c==='warn'||c.c==='sys')?260:150;break}
  case'atk':{c.s=entOf(c.src);c.d=entOf(c.dst);c.imp=false;c.dur=c.kind==='melee'?760:820;if(c.kind==='magic'&&c.nomove)c.dur=420;if(c.kind==='shot')sfx('shot');else if(c.kind==='magic')sfx('magic');else sfx('miss');
   c.sx=c.s.x;c.dx=c.d.x-c.s.x;c.col=c.col||'#ffe6b0';break}
  case'hp':{if(c.who==='pc')CB.pdhp=c.v;else c.who.dhp=c.v;updLab(entOf(c.who));if(c.who==='pc')updPcPanel();break}
  case'num':{ctxFloat(entOf(c.who),c.txt,c.c);if(c.c==='heal')sfx('heal');break}
  case'die':{E.dying=true;c.E=E;sfx('die');break}
  case'fled':{E.fleeing=true;c.E=E;break}
  case'aura':{E.aura={col:c.col,t:0};sfx('heal');break}
  case'cast':{CV.cast={col:c.col,t:0,all:c.all};sfx('magic');break}
  case'intent':{CB.enemies.forEach((e,i)=>{e.dint=c.v[i]});CV.ents.forEach(updLab);break}
  case'status':{if(c.who)updLab(entOf(c.who));updPcPanel();break}
  case'round':{CV.banner.textContent='Ronda '+c.n;CV.banner.classList.remove('go');void CV.banner.offsetWidth;CV.banner.classList.add('go');updPcPanel();break}
  case'over':{break}}
 CV.cur=c}
function impact(c){c.imp=true;const D=c.d,S=c.s;const px=D.x+D.ox,py=D.y-D.dh*.55;
 if(c.res==='miss'){ctxFloat(D,'Falla','miss');D.dodge=1;return}
 const crit=c.res==='crit';D.flash=1;D.fcol=c.col&&c.kind==='magic'?c.col:'#ffffff';D.shake=crit?.45:.28;
 ctxFloat(D,(crit?'¡':'')+'-'+c.dmg+(crit?'!':''),(D.pc?'pcdmg ':'dmg ')+(crit?'crit':''));
 burst(px,py,c.kind==='magic'?c.col:(D.pc?'#d04a3a':D.kind==='hu'?'#c83a30':'#b8362c'),crit?18:10,crit?110:80);if(c.kind==='magic')burst(px,py,'#ffffff',6,90,0);
 D.stag=1;CV.shake=crit?.4:.2;if(D.pc)CV.vig=.6;sfx(crit?'crit':'hit')}
function tickEv(c){const u=clamp(c.t/c.dur,0,1);
 if(c.k==='atk'){const S=c.s,D=c.d;const dirx=Math.sign(c.dx)||1;
  if(c.kind==='melee'){const reach=Math.sign(c.dx)*Math.max(0,Math.abs(c.dx)-(S.dw+D.dw)*.3);const a=u<.34?ease(u/.34):u<.5?1:1-ease((u-.5)/.5);S.ox=reach*a;S.moving=u<.34||u>.5?1:0;S.rot=dirx*(u<.34?-.22*ease(u/.34):u<.5?.3-.1*((u-.34)/.16):.2*(1-ease((u-.5)/.5)));S.lunge=u;S.oy=-Math.sin(clamp(u/.34,0,1)*Math.PI)*5;if(u>=.34&&!c.imp)impact(c)}
  else if(c.kind==='shot'){S.ox=-dirx*Math.sin(clamp(u/.25,0,1)*Math.PI)*4;const pu=clamp((u-.15)/.28,0,1);if(u>.15&&u<.43)CV.proj={x0:S.x+dirx*10,y0:S.y-S.dh*.55,x1:D.x,y1:D.y-D.dh*.5,u:pu,k:'arrow'};else CV.proj=null;if(u>=.43&&!c.imp){CV.proj=null;impact(c)}}
  else{S.oy=-Math.sin(clamp(u/.3,0,1)*Math.PI)*3;S.aura={col:c.col,t:u*.4};if(!c.nomove){const pu=clamp((u-.2)/.28,0,1);if(u>.2&&u<.48)CV.proj={x0:S.x+dirx*10,y0:S.y-S.dh*.6,x1:D.x,y1:D.y-D.dh*.5,u:pu,k:'orb',col:c.col};else CV.proj=null;if(u>=.48&&!c.imp){CV.proj=null;impact(c)}}else if(u>=.15&&!c.imp)impact(c)}
  if(D.dodge){D.ox=Math.sin(clamp(u,0,1)*Math.PI)*-dirx*10*(D.dodge?1:0)}
 }
 else if(c.k==='die'){const E=c.E;E.alpha=u<.6?1:1-ease((u-.6)/.4);const fd=E.pc?-1:(E.x>200?-1:1);E.rot=Math.min(1,u/.55)**.8*fd*(E.kind==='hu'?1.5:1.25);E.oy=ease(u)*(E.kind==='hu'?9:6);E.ox=ease(u)*fd*-6}
 else if(c.k==='fled'){const E=c.E;E.ox=ease(u)*60;E.alpha=1-ease(u)}
 else if(c.k==='aura'){const E=c.who==='pc'?CV.pc:c.who._ent;if(E.aura)E.aura.t=u}
 else if(c.k==='cast'&&CV.cast)CV.cast.t=u}
function endEv(c){if(c.k==='atk'){c.s.rot=0;c.s.ox=0;c.s.oy=0;c.s.moving=0;c.d.dodge=0;c.d.ox=0;CV.proj=null;if(c.s.aura)c.s.aura=null;if(!c.imp)impact(c);if(c.dst==='pc'||c.d.pc)updPcPanel()}
 else if(c.k==='die'){c.E.dead=true;c.E.alpha=0;if(c.E.lab)c.E.lab.style.display='none';refreshAllSoft()}
 else if(c.k==='fled'){c.E.gone=true;c.E.alpha=0;if(c.E.lab)c.E.lab.style.display='none';refreshAllSoft()}
 else if(c.k==='aura'){const E=c.who==='pc'?CV.pc:c.who._ent;E.aura=null}
 else if(c.k==='cast')CV.cast=null;
 if(c.k==='atk'){const D=c.d;if(D&&!D.pc)updLab(D)}}
// ---- bucle ----
function cvFrame(ts){if(!CV)return;const dt=Math.min(50,(ts-CV.last)||16);CV.last=ts;CV.time+=dt/1000;
 const cb=CV.cb;while(cb.fx.length)CV.q.push(cb.fx.shift());
 const sp=CV.fast?2.2:1;
 if(!CV.cur&&CV.q.length){const c=CV.q.shift();c.t=0;c.dur=DUR[c.k]||100;startEv(c)}
 if(CV.cur){const c=CV.cur;c.t+=dt*sp;tickEv(c);if(c.t>=c.dur){endEv(c);CV.cur=null}}
 else if(!CV.q.length&&cb.over&&!CV.shownRes)showResult();
 const nb=CV.busy();if(nb!==CV._wasBusy){CV._wasBusy=nb;buildMenu()}
 render(dt/1000);CV.raf=requestAnimationFrame(cvFrame)}
function busyFn(){return !!(CV.rolling||CV.cur||CV.q.length||CV.cb.fx.length)}
function showResult(){CV.shownRes=true;const r=CB.result;const T={won:['¡Victoria!','win'],lost:['Derrotado','lose'],fled:['Has escapado','fled'],talked:['El combate se evita','fled']}[r]||['Fin del combate','fled'];sfx(r==='won'?'win':r==='lost'?'lose':'miss');
 CV.resEl.innerHTML='';CV.resEl.className='cres '+T[1];const S=CB.summary;
 CV.resEl.append(h('div',{class:'rt'},T[0]),r==='won'&&S?h('div',{class:'rs'},(S.xp?'+'+S.xp+' PX':'')+(S.gold?' · +'+fmtGold(S.gold):''),S.loot?h('div',{class:'rl'},'Botín: '+S.loot):''):r==='lost'?h('div',{class:'rs'},'Despiertas a salvo, pero maltrecho.'):'',h('button',{class:'btn pri big',onclick:closeCombatView},'Continuar'));
 CV.resEl.style.display='flex';buildMenu()}
// ---- render del escenario ----
function render(dt){const g=CV.ctx;g.imageSmoothingEnabled=false;
 let sx=0,sy=0;if(CV.shake>0){CV.shake=Math.max(0,CV.shake-dt);const m=CV.shake*14;sx=(Math.random()-.5)*m;sy=(Math.random()-.5)*m}
 g.save();g.translate(Math.round(sx),Math.round(sy));g.drawImage(CV.bgc,0,0);
 // clima
 const wt=(G.wx[CV.zone]||{}).type;if(wt==='rain'||wt==='storm'){g.strokeStyle='rgba(190,210,235,.55)';g.lineWidth=1;g.beginPath();for(let i=0;i<46;i++){const x=(i*53+CV.time*180)%CW,y=(i*37+CV.time*320)%CH;g.moveTo(x,y);g.lineTo(x-3,y+8)}g.stroke()}
 else if(wt==='snow'){g.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<50;i++){const x=(i*47+Math.sin(CV.time+i)*10+CV.time*10)%CW,y=(i*31+CV.time*40)%CH;g.fillRect(x,y,2,2)}}
 // orden por y
 const all=[CV.pc,...CV.ents].filter(E=>!E.gone&&!E.dead);all.sort((a,b)=>a.y-b.y);
 for(const E of all){if(E.alpha<=0)continue;
  // sombra
  g.globalAlpha=.35*E.alpha;g.fillStyle='#000';g.beginPath();g.ellipse(E.x+E.ox*0.6,E.y+2,E.dw*.36,5,0,0,6.3);g.fill();g.globalAlpha=1;
  if(!E.pc&&E.who===CV.sel&&E.who.hp>0&&!E.who.fled&&!CV.cb.over){g.strokeStyle='#f3d58a';g.lineWidth=1.5;g.setLineDash([4,3]);g.lineDashOffset=-CV.time*12;g.beginPath();g.ellipse(E.x,E.y+2,E.dw*.45,7,0,0,6.3);g.stroke();g.setLineDash([])}
  const bob=E.dying?0:Math.sin(CV.time*3+E.bob)*(E.fly?3:1.2);const fr=E.moving?(Math.floor(CV.time*14)%2?1:3):0;
  const F=frameImg(E,fr);const x=E.x+E.ox,y=E.y+E.oy+bob-(E.fly?14:0);
  const shk=E.shake>0?(E.shake=Math.max(0,E.shake-dt),Math.sin(CV.time*90)*E.shake*16):0;
  g.save();g.globalAlpha=E.alpha;g.translate(Math.round(x+shk),Math.round(y));{let st=0;if(E.stag>0){E.stag=Math.max(0,E.stag-dt*3.2);st=Math.sin(E.stag*Math.PI)*.2*(E.pc?-1:1)}const rr=(E.rot||0)+st;if(rr)g.rotate(rr)}if(E.flip)g.scale(-1,1);
  if(E.flash>0){E.flash=Math.max(0,E.flash-dt*4);const t=CV.tmp||(CV.tmp=document.createElement('canvas'));t.width=E.dw;t.height=E.dh;const tg=t.getContext('2d');tg.imageSmoothingEnabled=false;tg.clearRect(0,0,t.width,t.height);tg.drawImage(F.img,F.sx,F.sy,F.sw,F.sh,0,0,E.dw,E.dh);tg.globalCompositeOperation='source-atop';tg.globalAlpha=Math.min(1,E.flash*1.4);tg.fillStyle=E.fcol;tg.fillRect(0,0,t.width,t.height);tg.globalAlpha=1;tg.globalCompositeOperation='source-over';g.drawImage(t,-E.dw/2,-E.dh)}
  else g.drawImage(F.img,F.sx,F.sy,F.sw,F.sh,-E.dw/2,-E.dh,E.dw,E.dh);
  g.restore();
  if(E.aura){const a=E.aura;g.globalAlpha=(1-Math.abs(a.t-.5)*2)*.6;g.strokeStyle=a.col;g.lineWidth=2;g.beginPath();g.ellipse(E.x,E.y-E.dh/2,E.dw*.5+a.t*10,E.dh*.55+a.t*8,0,0,6.3);g.stroke();g.globalAlpha=1}
  if(!E.pc&&E.who.hp>0&&E.who.sleep>0){g.fillStyle='#cfe';g.font='10px monospace';g.fillText('z',E.x+10,E.y-E.dh+6+Math.sin(CV.time*3)*2)}
  updLabPos(E,x,y)}
 // proyectil
 const P=CV.proj;if(P){const x=P.x0+(P.x1-P.x0)*P.u,y=P.y0+(P.y1-P.y0)*P.u-Math.sin(P.u*Math.PI)*(P.k==='arrow'?10:4);if(P.k==='arrow'){g.strokeStyle='#e8dcc0';g.lineWidth=2;g.beginPath();const dx=Math.sign(P.x1-P.x0);g.moveTo(x-dx*9,y);g.lineTo(x,y);g.stroke();g.fillStyle='#ccc';g.fillRect(x,y-1,2,2)}
  else{g.fillStyle=P.col;g.globalAlpha=.4;g.beginPath();g.arc(x,y,9,0,6.3);g.fill();g.globalAlpha=1;g.beginPath();g.arc(x,y,5,0,6.3);g.fill();g.fillStyle='#fff';g.fillRect(x-1,y-1,3,3);if(Math.random()<.8)CV.parts.push({x,y,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,life:0,max:.3,col:P.col,size:2,g:0})}}
 if(CV.cast){const c=CV.cast;g.globalAlpha=(1-c.t)*.4;g.fillStyle=c.col;g.fillRect(0,0,CW,CH);g.globalAlpha=1}
 // partículas
 for(let i=CV.parts.length-1;i>=0;i--){const p=CV.parts[i];p.life+=dt;if(p.life>p.max){CV.parts.splice(i,1);continue}p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;g.globalAlpha=1-p.life/p.max;g.fillStyle=p.col;g.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size)}g.globalAlpha=1;
 g.restore();
 if(CV.vig>0){CV.vig=Math.max(0,CV.vig-dt*1.6);CV.cv.style.boxShadow='inset 0 0 70px rgba(220,40,30,'+CV.vig+')'}else if(CV.cv.style.boxShadow)CV.cv.style.boxShadow=''}
function updLabPos(E,x,y){if(!E.lab||E.lab.style.display==='none')return;const px=x/CW*100,py=(y-E.dh-(E.fly?4:0)-2)/CH*100;E.lab.style.left=px+'%';E.lab.style.top=py+'%'}
