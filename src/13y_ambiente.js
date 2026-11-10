// ===================== ATMÓSFERA POR COMARCA + PARTÍCULAS AMBIENTALES =====================
const ZGRADE={
 penedes:{amb:[1.05,1.0,.9],sun:[1.08,.98,.82],hor:[1.06,.98,.86],fog:[1.04,.98,.88]},
 montseny:{amb:[.92,.97,1.05],sun:[.94,.98,1.04],hor:[.9,.96,1.06],fog:[.92,.97,1.06],mist:1},
 egara:{amb:[.98,1.0,.98],sun:[1,.99,.95],hor:[.97,.99,.98],fog:[.97,.99,.98]},
 maresme:{amb:[1.02,1.04,1.08],sun:[1.04,1.03,1.0],hor:[.96,1.02,1.1],fog:[.97,1.03,1.1],sea:1},
 marjal:{amb:[.95,1.0,.98],sun:[.97,1,.96],hor:[.94,1.0,1.0],fog:[.94,1.0,1.0],mist:1}};
const _updEnvAt=updateEnv;updateEnv=function(dt){_updEnvAt(dt);try{const z=getZone(G.zone);if(z.indoor)return;const g=ZGRADE[G.zone];if(!g)return;const e=GL.env;const m=(a,k)=>a.map((v,i)=>clamp(v*k[i],0,1.4));
  e.amb=m(e.amb,g.amb);e.sun=m(e.sun,g.sun);e.hor=m(e.hor,g.hor);e.fog=m(e.fog,g.fog);
  const h=dateOf(G.t).hf;const w=wxOf(G.zone);if(g.mist&&h<9.5&&h>4.5&&(w.type==='clear'||w.type==='cloudy')){const k=1-clamp((h-6.5)/3,0,1)*.9;e.fogN=Math.min(e.fogN,10+25*(1-k));e.fogF=Math.min(e.fogF,40+45*(1-k))}
  if(g.sea&&(w.type==='clear'||w.type==='cloudy')){e.fogF=Math.max(e.fogF,100)}}catch(er){}};
function ambientDots(){try{const z=getZone(G.zone);if(z.indoor)return;const c=GL.cam;const t=R.anim;const D=dateOf(G.t);const m=D.m;const w=wxOf(G.zone);const wild=['forest','hills','mountain','river','coast'].includes(z.biome)||ZINFO[G.zone].settle===undefined;const gy=c.ty;
  // hojas de otoño
  if((m===9||m===10||m===11&&D.d<10)&&(z.biome==='forest'||z.biome==='hills'||z.biome==='mountain'||z.biome==='river')&&(w.type==='clear'||w.type==='cloudy'||w.type==='wind')){const N=70;const Q=new Float32Array(N*3);const wind=(w.wind||.2)*1.6+.4;for(let i=0;i<N;i++){const s=((i*7919)%1000)/1000,s2=((i*104729)%1000)/1000,s3=((i*1299709)%1000)/1000;const y=8-((t*(.55+s*.4)+s*8)%8);const x=((s2*34+t*wind*(.6+s))%34)-17+Math.sin(t*.9+s*20)*1.3;const zz=(s3*34+Math.cos(t*.6+s*9)*1.6)%34-17;Q[i*3]=c.tx+x;Q[i*3+1]=gy+y-1;Q[i*3+2]=c.tz+zz}GL.drawParticles(null,Q,[.82,.46,.14,.95],4.6*(GL.h/700+.6))}
  // luciérnagas en noches cálidas
  if(m>=4&&m<=8&&(D.hf>21.2||D.hf<5)&&(w.type==='clear'||w.type==='cloudy')&&(z.biome==='forest'||z.biome==='hills'||z.biome==='river'||z.biome==='mountain'||G.zone==='penedes'||G.zone==='egara')){const N=48;const arr=[];for(let i=0;i<N;i++){const s=((i*7919)%1000)/1000,s2=((i*104729)%1000)/1000,s3=((i*1299709)%1000)/1000;if(Math.sin(t*1.4+s*40)<-.15)continue;arr.push(c.tx+(s2*28-14)+Math.sin(t*.5+s*30)*1.4,gy-.4+.6+Math.abs(Math.sin(t*.7+s*11))*1.8,c.tz+(s3*28-14)+Math.cos(t*.45+s*17)*1.4)}if(arr.length)GL.drawParticles(null,new Float32Array(arr),[.78,1,.36,.95],4.8*(GL.h/700+.6))}
 }catch(e){if(!R._ambE){R._ambE=1;console.error('ambient',e)}}}
const _dwpAmb=drawWeatherParticles;drawWeatherParticles=function(){_dwpAmb();ambientDots()};
