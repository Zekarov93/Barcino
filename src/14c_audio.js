// ===================== AUDIO AMBIENTAL Y MÚSICA GENERATIVA (WebAudio, sin ficheros) =====================
const AUD={ctx:null,master:null,mus:null,layers:{},beat:0,lastHour:-1,nextBird:0,mode:'',timer:null};
try{UI.mute=localStorage.getItem('rpg_mute')==='1'}catch(e){}
const mtof=m=>440*Math.pow(2,(m-69)/12);
const SCALES={dorian:[0,2,3,5,7,9,10],aeolian:[0,2,3,5,7,8,10],penta:[0,2,4,7,9],mixo:[0,2,4,5,7,9,10],phryg:[0,1,3,5,7,8,10],major:[0,2,4,5,7,9,11]};
const ZMUS={garraf:{root:60,sc:'mixo',bpm:76,prog:[0,3,4,0]},barcino:{root:62,sc:'dorian',bpm:84,prog:[0,5,3,4]},collserola:{root:57,sc:'penta',bpm:70,prog:[0,3,0,4]},martorell:{root:64,sc:'mixo',bpm:88,prog:[0,4,5,3]},collbato:{root:59,sc:'phryg',bpm:72,prog:[0,1,0,6]},montserrat:{root:50,sc:'aeolian',bpm:60,prog:[0,5,2,6]}};
function audInit(){if(AUD.ctx){if(AUD.ctx.state==='suspended')AUD.ctx.resume();return}
 try{const C=new(window.AudioContext||window.webkitAudioContext)();AUD.ctx=C;const comp=C.createDynamicsCompressor();comp.connect(C.destination);AUD.master=C.createGain();AUD.master.gain.value=UI.mute?0:.8;AUD.master.connect(comp);
  AUD.mus=C.createGain();AUD.mus.gain.value=.22;AUD.mus.connect(AUD.master);AUD.amb=C.createGain();AUD.amb.gain.value=.5;AUD.amb.connect(AUD.master);
  // ruido marrón en bucle
  const n=C.sampleRate*3,buf=C.createBuffer(1,n,C.sampleRate),d=buf.getChannelData(0);let last=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5}AUD.noise=buf;
  const mk=(type,f,q)=>{const s=C.createBufferSource();s.buffer=buf;s.loop=true;const fl=C.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||.7;const g=C.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(AUD.amb);s.start();return{s,fl,g}};
  AUD.layers.rain=mk('highpass',1400);AUD.layers.wind=mk('bandpass',420,.5);AUD.layers.sea=mk('lowpass',380);
  // grillos: oscilador AM
  const o=C.createOscillator();o.frequency.value=4300;const am=C.createGain();am.gain.value=0;const lfo=C.createOscillator();lfo.type='square';lfo.frequency.value=17;const lg=C.createGain();lg.gain.value=.5;lfo.connect(lg);lg.connect(am.gain);const cg=C.createGain();cg.gain.value=0;o.connect(am);am.connect(cg);cg.connect(AUD.amb);o.start();lfo.start();AUD.layers.cric={g:cg};
  // lfo del viento y del mar
  const wl=C.createOscillator();wl.frequency.value=.13;const wg=C.createGain();wg.gain.value=220;wl.connect(wg);wg.connect(AUD.layers.wind.fl.frequency);wl.start();
  const sl=C.createOscillator();sl.frequency.value=.11;const sg=C.createGain();sg.gain.value=.05;sl.connect(sg);sg.connect(AUD.layers.sea.g.gain);sl.start();
  AUD.timer=setInterval(musicBeat,100);
 }catch(e){AUD.ctx=null}}
function audMute(m){UI.mute=m;try{localStorage.setItem('rpg_mute',m?'1':'0')}catch(e){}if(AUD.master)AUD.master.gain.setTargetAtTime(m?0:.8,AUD.ctx.currentTime,.1);const b=document.getElementById('sndbtn');if(b)b.textContent=m?'🔇':'🔊'}
function setL(l,v){if(AUD.layers[l]&&AUD.ctx)AUD.layers[l].g.gain.setTargetAtTime(v,AUD.ctx.currentTime,1.2)}
// ---- sintes ----
function pluck(f,dur,vol,type,cut){const C=AUD.ctx,t=C.currentTime;const o=C.createOscillator(),g=C.createGain(),fl=C.createBiquadFilter();o.type=type||'triangle';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=cut||1800;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(fl);fl.connect(g);g.connect(AUD.mus);o.start(t);o.stop(t+dur+.05)}
function pad(f,dur,vol){const C=AUD.ctx,t=C.currentTime;[-6,6].forEach(dt=>{const o=C.createOscillator(),g=C.createGain(),fl=C.createBiquadFilter();o.type='sawtooth';o.frequency.value=f;o.detune.value=dt;fl.type='lowpass';fl.frequency.value=700;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(fl);fl.connect(g);g.connect(AUD.mus);o.start(t);o.stop(t+dur+.1)})}
function drum(kind){const C=AUD.ctx,t=C.currentTime;if(kind==='kick'){const o=C.createOscillator(),g=C.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(40,t+.18);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(g);g.connect(AUD.mus);o.start(t);o.stop(t+.25)}
 else{const s=C.createBufferSource();s.buffer=AUD.noise;const fl=C.createBiquadFilter();fl.type='highpass';fl.frequency.value=5000;const g=C.createGain();g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.06);s.connect(fl);fl.connect(g);g.connect(AUD.mus);s.start(t,Math.random()*1.5,.08)}}
function bell(f0,n){const C=AUD.ctx;for(let k=0;k<n;k++)setTimeout(()=>{if(!AUD.ctx||UI.mute)return;const t=C.currentTime;[1,2.4,3.0,4.1].forEach((m,i)=>{const o=C.createOscillator(),g=C.createGain();o.frequency.value=f0*m;g.gain.setValueAtTime(.12/(i+1),t);g.gain.exponentialRampToValueAtTime(.0005,t+3.2);o.connect(g);g.connect(AUD.amb);o.start(t);o.stop(t+3.4)})},k*1800)}
function chirp(){const C=AUD.ctx,t=C.currentTime;const o=C.createOscillator(),g=C.createGain();const f=2200+Math.random()*1800;o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*(1.2+Math.random()*.5),t+.08);o.frequency.exponentialRampToValueAtTime(f*.9,t+.16);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(AUD.amb);o.start(t);o.stop(t+.25)}
function thunder(){if(!AUD.ctx||UI.mute)return;const C=AUD.ctx,t=C.currentTime+.25+Math.random()*1.2;const s=C.createBufferSource();s.buffer=AUD.noise;const fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.value=260;const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.9,t+.1);g.gain.exponentialRampToValueAtTime(.001,t+2.8);s.connect(fl);fl.connect(g);g.connect(AUD.amb);s.start(t,Math.random()*.5,3)}
bus.on('lightning',thunder);
// ---- música generativa ----
ZMUS.vega=ZMUS.martorell;ZMUS.pas_molins=ZMUS.collserola;ZMUS.cam_collbato=ZMUS.collbato;ZMUS.ascenso=ZMUS.montserrat;ZMUS.marjal=ZMUS.garraf;ZMUS.cornisa=ZMUS.garraf;
function musicBeat(){if(!AUD.ctx||UI.mute||typeof G==='undefined'||!G||!G.pc||!R.running)return;const now=AUD.ctx.currentTime;const fight=G.combat&&!G.combat.over;const zid=G.zone.startsWith('int:')?(G.outPos?G.outPos.zone:'barcino'):G.zone;const Z=ZMUS[zid]||ZMUS.barcino;const ph=phaseOf(G.t);const night=ph.night;
 const bpm=fight?118:Z.bpm*(night?.8:1);const step=60/bpm/2;// corcheas
 if(now<(AUD.next||0))return;AUD.next=now+step;
 const sc=SCALES[fight?'aeolian':Z.sc],root=(fight?Z.root-7:Z.root)+(night&&!fight?-5:0);const b=AUD.beat++;const bar=Math.floor(b/8),deg=Z.prog[bar%Z.prog.length];
 const note=(d,oct)=>root+sc[((d%sc.length)+sc.length)%sc.length]+12*(Math.floor(d/sc.length)+(oct||0));
 if(fight){if(b%4===0)drum('kick');if(b%4===2)drum('hat');if(b%2===1&&Math.random()<.5)drum('hat');if(b%2===0)pluck(mtof(note(deg,-1)),.35,.22,'sawtooth',500);
  if(Math.random()<.55)pluck(mtof(note(deg+[0,2,4,6,7][Math.floor(Math.random()*5)],1)),.3,.14,'square',1400);if(b%8===0)pad(mtof(note(deg,0)),step*8,.07)}
 else{if(b%8===0){[0,2,4].forEach(k=>pad(mtof(note(deg+k,-1)),step*8.5,night?.045:.06))}
  const rest=night?.6:.4;if(b%2===0&&Math.random()>rest){const d=deg+[0,1,2,3,4,5][Math.floor(Math.random()*6)];pluck(mtof(note(d,1)),step*(2+Math.random()*3),night?.1:.13,'triangle',2200)}
  if(b%8===0&&Math.random()<.5)pluck(mtof(note(deg,-1)),step*5,.16,'sine',600)}}
// ---- ambiente según estado del mundo ----
function audTick(){if(!AUD.ctx||typeof G==='undefined'||!G||!G.pc||!R.running)return;const indoor=G.zone.startsWith('int:');const zid=indoor?(G.outPos?G.outPos.zone:'barcino'):G.zone;const w=G.wx[zid]||{type:'clear',int:0,wind:.2};const ph=phaseOf(G.t);const m=indoor?.3:1;const D=dateOf(G.t);
 const rain=(w.type==='rain'||w.type==='storm'||w.type==='hail')?.12+w.int*.42:0;setL('rain',rain*m);
 setL('wind',((w.wind||0)*.28+(w.type==='storm'?.22:0)+(w.type==='snow'?.1:0)+(zid==='montserrat'?.06:0))*m);
 setL('sea',(zid==='barcino'?.2:zid==='garraf'?.32:zid==='marjal'?.3:zid==='cornisa'?.22:zid==='martorell'?.07:0)*(indoor?.3:1));
 const winter=seasonOf(D.doy)===3;setL('cric',(ph.night&&!rain&&!winter&&!indoor&&zid!=='barcino')?.035:0);
 if(!ph.night&&!indoor&&rain===0&&['collserola','martorell','collbato','vega','pas_molins','cam_collbato','marjal'].includes(zid)&&AUD.ctx.currentTime>AUD.nextBird&&!UI.mute){chirp();if(Math.random()<.5)setTimeout(()=>{try{chirp()}catch(e){}},180);AUD.nextBird=AUD.ctx.currentTime+2+Math.random()*7}
 if(D.h!==AUD.lastHour){AUD.lastHour=D.h;if(!UI.mute&&!indoor&&(zid==='barcino'||zid==='montserrat')&&[8,13,20].includes(D.h)&&D.m<3)bell(zid==='montserrat'?330:262,D.h===13?4:3)}}
function addSndBtn(){const bar=document.querySelector('#hud .hud-br');if(!bar||document.getElementById('sndbtn'))return;bar.append(h('button',{id:'sndbtn',class:'hb',title:'Sonido y música',onclick:()=>{audInit();audMute(!UI.mute)}},UI.mute?'🔇':'🔊'))}
['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev,()=>{audInit()},{passive:true}));
setInterval(()=>{try{addSndBtn();audTick()}catch(e){}},500);
