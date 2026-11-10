// ===================== MÁS ESPECIES: fauna menor, aves, domésticos y criaturas del folclore catalán =====================
GD('piel_asno','Piel de asno','raw',4,1.2);GD('pluma_halcon','Pluma de halcón','raw',6,.1);GD('pluma_buitre','Pluma de buitre','raw',5,.2);GD('pluma_buho','Pluma de búho','raw',5,.1);
GD('piel_gineta','Piel de gineta','raw',8,.5);GD('piel_nutria','Piel de nutria','raw',9,.6);GD('garra_cuca','Garra de la Cuca Fera','raw',22,.5);GD('piel_oscura','Piel oscura','raw',18,1.5);
GD('cabello_agua','Cabello de dona d\'aigua','raw',32,.1);GD('escama_basilisco','Escama de basilisco','raw',48,.4);GD('ferradura_fuego','Herradura de fuego','misc',85,1);GD('polvo_follet','Polvo de follet','misc',26,.1);
GD('perla_sirena','Perla de sirena','misc',70,.1);GD('carne_nutria','Carne de nutria','food',3,.6,{nut:22});
Object.assign(CREAT,{
 perro:{n:'Perro asilvestrado',diet:'omni',hp:7,ac:12,atk:3,dmg:'1d6+1',xp:20,spd:2.6,sz:.55,bi:['forest','hills','river','coast'],mat:8,gest:6,litter:[3,5],breed:[0,1,2,3,4,5,6,7,8,9,10,11],life:700,loot:{},flee:.3,aggro:.15,prey:['conejo','rata','gallina','gato'],cap:{barcino:5,martorell:4,collserola:3,vega:4,sant_cugat:4}},
 asno:{n:'Asno catalán',diet:'herb',hp:13,ac:10,atk:2,dmg:'1d4+1',xp:15,spd:1.9,sz:.9,bi:['hills','river','mountain'],mat:30,gest:10,litter:[1,1],breed:[3,4,5,6,7,8],life:1400,loot:{piel_asno:[1,1]},flee:.5,aggro:.02,cap:{vega:4,martorell:3,montserrat:3,collbato:2,sant_cugat:2}},
 halcon:{n:'Halcón peregrino',diet:'carn',hp:5,ac:15,atk:4,dmg:'1d4+2',xp:45,spd:3.7,sz:.4,bi:['mountain','hills','coast','forest'],mat:20,gest:5,litter:[1,3],breed:[3,4,5],life:900,eggs:1,loot:{pluma_halcon:[1,2]},flee:.6,aggro:.12,fly:1,prey:['conejo','cuervo','rata','gaviota'],cap:{ascenso:2,montserrat:2,garraf:3,cornisa:2,collbato:2,vega:2}},
 buitre:{n:'Buitre leonado',diet:'carn',hp:15,ac:12,atk:3,dmg:'1d6+1',xp:40,spd:2.8,sz:.8,bi:['mountain','hills'],mat:40,gest:8,litter:[1,1],breed:[1,2,3],life:1500,eggs:1,loot:{pluma_buitre:[1,3]},flee:.6,aggro:.08,fly:1,prey:[],cap:{montserrat:8,collbato:5,ascenso:5,salinas:3,cornisa:3,cam_collbato:2}},
 buho:{n:'Búho real',diet:'carn',hp:6,ac:13,atk:4,dmg:'1d6',xp:30,spd:2.6,sz:.5,bi:['forest','hills','mountain'],mat:25,gest:5,litter:[1,3],breed:[1,2,3,4],life:900,eggs:1,loot:{pluma_buho:[1,2]},flee:.5,aggro:.12,fly:1,prey:['rata','conejo','murcielago'],cap:{collserola:5,sant_cugat:3,collbato:3,martorell:3,montserrat:3,barcino:2}},
 gineta:{n:'Gineta',diet:'carn',hp:8,ac:14,atk:3,dmg:'1d4+1',xp:25,spd:2.7,sz:.5,bi:['forest','river','hills'],mat:20,gest:6,litter:[2,3],breed:[3,4,5,6],life:600,loot:{piel_gineta:[1,1]},flee:.6,aggro:.1,prey:['rata','conejo','cuervo','gallina'],cap:{collserola:5,martorell:3,sant_cugat:3,vega:2,pas_molins:2}},
 nutria:{n:'Nutria',diet:'carn',hp:7,ac:13,atk:2,dmg:'1d4',xp:20,spd:2.3,sz:.5,bi:['river','coast'],mat:18,gest:7,litter:[2,3],breed:[2,3,4,5],life:600,loot:{piel_nutria:[1,1],carne_nutria:[1,1]},flee:.6,aggro:.05,prey:['cangrejo','rata'],cap:{martorell:4,vega:3,marjal:6,pas_molins:3,garraf:2}},
 // — folclore —
 cuca_fera:{n:'Cuca Fera',diet:'carn',hp:52,ac:14,atk:6,dmg:'2d6+3',xp:380,spd:2.6,sz:1.35,bi:['forest'],mat:80,gest:20,litter:[1,1],breed:[3],life:6000,loot:{garra_cuca:[1,2],piel_oscura:[1,2]},gold:[10,50],flee:0,aggro:.85,monster:1,prey:['ciervo','jabali','lobo','perro'],cap:{collserola:1,sant_cugat:1}},
 dona_aigua:{n:'Dona d\'aigua',diet:'carn',hp:34,ac:13,atk:5,dmg:'2d6+2',xp:260,spd:2.2,sz:.8,bi:['river','coast'],mat:60,gest:30,litter:[1,1],breed:[5,6],life:4000,loot:{cabello_agua:[1,2]},gold:[5,40],flee:.1,aggro:.4,monster:1,hum:1,cap:{marjal:1,vega:1,martorell:1,pas_molins:1}},
 basilisco:{n:'Basilisco de la cueva',diet:'carn',hp:46,ac:15,atk:6,dmg:'2d6+4',xp:520,spd:1.8,sz:1,bi:['hills'],mat:120,gest:40,litter:[1,1],breed:[6],life:8000,loot:{escama_basilisco:[2,3],cristal:[0,1]},gold:[30,120],flee:0,aggro:.7,monster:1,unique:1,prey:['murcielago','rata'],cap:{collbato:1}},
 cavall_foc:{n:'Caballo de fuego',diet:'carn',hp:44,ac:14,atk:6,dmg:'2d8+3',xp:600,spd:3.2,sz:1.4,bi:['forest'],mat:200,gest:60,litter:[1,1],breed:[5],life:20000,loot:{ferradura_fuego:[1,1]},flee:0,aggro:.6,monster:1,unique:1,cap:{collserola:1}},
 sirena:{n:'Sirena',diet:'omni',hp:25,ac:14,atk:4,dmg:'1d6',xp:200,spd:2,sz:.8,bi:['coast'],mat:80,gest:40,litter:[1,1],breed:[4],life:10000,loot:{perla_sirena:[1,3]},flee:1,aggro:0,monster:1,unique:1,cap:{garraf:1}},
 follet:{n:'Follet',diet:'omni',hp:4,ac:16,atk:1,dmg:'1',xp:60,spd:2.8,sz:.3,bi:['forest','hills','mountain'],mat:50,gest:20,litter:[1,1],breed:[5,6],life:9000,loot:{polvo_follet:[1,1]},flee:.9,aggro:0,cap:{collserola:2,sant_cugat:2,montserrat:1,pas_molins:1}}
});
// el lobo y el lince ya compiten por nuevas presas; la red trófica se enreda
CREAT.lobo.prey=CREAT.lobo.prey.concat(['asno','perro']);CREAT.lince.prey=(CREAT.lince.prey||[]).concat(['gineta','halcon']);CREAT.zorro.prey=CREAT.zorro.prey.concat(['nutria']);
Object.assign(SPEC_BY,{perro:'tackle',asno:'smash',halcon:'tackle',buitre:'dirty',buho:'dirty',gineta:'rend',nutria:'rend',cuca_fera:'rend',dona_aigua:'drain',basilisco:'gaze',cavall_foc:'charge',sirena:'dirty',follet:'dirty'});
SPECIALS.gaze={n:'Mirada petrificante',tell:'clava en ti una mirada vidriosa y fría',mul:.8,eff:'stun'};
SPECIALS.terror={n:'Alarido espectral',tell:'abre la boca en un alarido que hiela la sangre',mul:1.2,eff:'dazed'};
SPEC_BY.cuca_fera='terror';
Object.assign(SOCIAL,{perro:{k:'pack',min:2,max:5,terr:10,alpha:'m',noun:'Jauría'},asno:{k:'herd',min:2,max:4,terr:10,alpha:'f',noun:'Rebaño'},halcon:{k:'pair',terr:14,noun:'Pareja'},buitre:{k:'flock',min:3,max:8,terr:16,noun:'Bandada'},
 buho:{k:'solo',terr:10,noct:1},gineta:{k:'solo',terr:7,noct:1},nutria:{k:'clan',min:2,max:4,terr:6,alpha:'f',noun:'Familia'},cuca_fera:{k:'solo',terr:14,noct:1},dona_aigua:{k:'solo',terr:8},basilisco:{k:'solo',terr:8},cavall_foc:{k:'solo',terr:20,noct:1},sirena:{k:'solo',terr:10},follet:{k:'solo',terr:6}});
SOCIAL.murcielago.noct=1;SOCIAL.murcielago.k='colony';
Object.assign(DIMORPH,{perro:1.08,asno:1.05,buitre:.95});
Object.assign(INDIV_NAMES,{perro:['Moro','Lladre','Pelut','Fosc','Cuc'],asno:['Ruc','Trot','Orelles','Pacient'],buho:['Mussol Vell','Ull-Rodó','Silent'],cuca_fera:['La Cuca Fera'],basilisco:['El Guardià'],cavall_foc:['El Cavall del Comte'],sirena:['La Sirena'],dona_aigua:['La Dona'],follet:['Follet','Trapella','Gat-Xic']});
SCAV.push('buitre');
// ---------- sprites ----------
Object.assign(CR_DEF,{asno:{cw:34,ch:26,coat:['#8a8680','#6a6660'],bel:'#d8d0c0'},halcon:{cw:26,ch:22,coat:['#7a8088','#5a6068'],bel:'#e8e0d0'},buitre:{cw:38,ch:30,coat:['#8a6e50','#6a5238'],bel:'#c8b898'},buho:{cw:22,ch:24,coat:['#a87848','#785030'],bel:'#e8d8b8'},
 gineta:{cw:30,ch:14,coat:['#c8b090','#a89070'],bel:'#f0e8d8'},nutria:{cw:28,ch:14,coat:['#6a4a30','#4a3220'],bel:'#d8c0a0'},cuca_fera:{cw:36,ch:30,coat:['#3a2f44','#262030'],bel:'#5a4a66'},dona_aigua:{cw:22,ch:30,coat:['#2f6a78','#1f4a5a'],bel:'#b8e0d8'},
 basilisco:{cw:38,ch:18,coat:['#4a7a3a','#2f5028'],bel:'#c8c070'},cavall_foc:{cw:36,ch:30,coat:['#2a2a34','#16161e'],bel:'#4a4a58'},sirena:{cw:24,ch:28,coat:['#2f8a8a','#1f6a74'],bel:'#e8c8b0'},follet:{cw:14,ch:18,coat:['#c85a3a','#a04028'],bel:'#f0d8b0'}});
Object.assign(CR_FB,{asno:{k:'quad',ears:'long',tail:'tiny',hs:.2,bw:.32,lg:.34,snout:1},gineta:{k:'quad',ears:'round',tail:'string',hs:.26,bw:.4,lg:.2,snout:1},nutria:{k:'quad',ears:'round',tail:'string',hs:.28,bw:.4,lg:.18,snout:1},
 cavall_foc:{k:'quad',ears:'point',tail:'bush',hs:.2,bw:.32,lg:.36,snout:1},halcon:{k:'bird',beak:'#e8c030'},buitre:{k:'bird',beak:'#c8a860'},buho:{k:'bird',beak:'#e8c030'},cuca_fera:{k:'biped',eye:'#e84a3a',big:1},dona_aigua:{k:'biped'},sirena:{k:'biped'},follet:{k:'biped',ears:'big',eye:'#f0e060'}});
Object.assign(NEWDRAW,{
 asno(R,ell,o){const{body,dk,lt,bel,step}=o;ell(17,13,10,5,body);R(9,15,16,3,bel);ell(29,8,4,3,body);R(32,9,4,3,bel);R(35,10,1,1,'#14100c');R(28,1,2,6,dk);R(31,1,2,6,dk);R(29,6,1,1,'#14100c');R(26,5,3,2,dk);
  [[8,17],[12,17],[21,17],[25,17]].forEach((p,i)=>R(p[0],p[1]-(step&&i%2?1:0),2,8,i<2?dk:body));R(3,10,2,7,dk);R(2,16,3,2,'#2a2018');R(9,8,16,1,dk)},
 halcon(R,ell,o){const{body,dk,lt,bel,step}=o;const up=step?-2:1;ell(12,11,4,3,body);R(10,13,5,2,bel);ell(17,7,2,2,lt);R(19,7,2,2,'#e8c030');R(18,6,1,1,'#14100c');R(16,9,3,1,'#14100c');
  for(let i=0;i<9;i++){R(11-i,9+Math.round(up*(i/9)),1,3-Math.floor(i/4),i%3?dk:body)}R(5,11+up,3,1,dk);R(6,14,3,2,dk);R(11,16,1,2,'#d8b040');R(14,16,1,2,'#d8b040')},
 buitre(R,ell,o){const{body,dk,lt,bel,step}=o;const up=step?-4:3;ell(18,16,6,5,body);R(14,19,8,3,dk);R(15,10,6,2,'#f0f0e8');ell(22,8,2,3,'#d8b8a8');R(24,8,3,2,'#c8a860');R(26,10,1,1,'#c8a860');R(23,7,1,1,'#14100c');
  for(let i=0;i<14;i++){R(17-i,13+Math.round(up*(i/14))-(i>7?1:0),1,5-Math.floor(i/5),i%3?dk:body);R(13+i%3,15,1,1,lt)}R(7,15+up,5,2,dk);R(6,19,4,2,dk);R(16,22,1,4,'#9a8a70');R(20,22,1,4,'#9a8a70')},
 buho(R,ell,o){const{body,dk,lt,bel,step}=o;ell(11,15,6,7,body);ell(11,15,3,5,bel);for(let y=0;y<5;y++)R(9+(y%2),12+y*2,1,1,dk);ell(11,7,5,4,body);R(6,2,2,3,dk);R(15,2,2,3,dk);R(7,6,3,3,'#f0e8c0');R(12,6,3,3,'#f0e8c0');R(8,7,1,1,'#14100c');R(13,7,1,1,'#14100c');R(10,9,2,2,'#e8c030');
  R(4,13,3,7,dk);R(16,13,3,7,dk);R(8,22,2,2,'#d8b040');R(12,22,2,2,'#d8b040')},
 gineta(R,ell,o){const{body,dk,lt,bel,step}=o;ell(12,8,9,3,body);[[6,6],[9,5],[12,6],[15,5],[8,9],[13,9]].forEach(p=>R(p[0],p[1],1,1,dk));R(5,10,13,1,bel);ell(23,7,3,2,body);R(25,7,3,2,lt);R(27,7,1,1,'#14100c');R(22,4,1,2,dk);R(24,4,1,2,dk);R(23,6,1,1,'#14100c');
  for(let i=0;i<6;i++)R(1+i*1,5+(i%2),2,2,i%2?dk:lt);[[6,11],[9,11],[15,11],[18,11]].forEach((p,i)=>R(p[0],p[1]-(step&&i%2?1:0),1,3,dk))},
 nutria(R,ell,o){const{body,dk,lt,bel,step}=o;ell(12,8,8,3,body);R(7,10,10,1,bel);ell(21,7,3,3,body);R(23,8,2,2,lt);R(24,8,1,1,'#14100c');R(20,5,1,1,'#14100c');R(22,4,1,1,dk);R(24,9,3,1,'#e8e0d0');
  for(let i=0;i<7;i++)R(1+i,8+(i>3?0:1),1,3-Math.floor(i/3),dk);[[8,11],[12,11],[16,11]].forEach((p,i)=>R(p[0],p[1]-(step&&i%2?1:0),2,2,dk))},
 cuca_fera(R,ell,o){const{body,dk,lt,bel,step}=o;ell(17,18,11,7,body);ell(11,12,6,5,dk);ell(30,13,5,5,body);R(28,6,2,4,dk);R(33,6,2,4,dk);R(28,12,2,2,'#e84a3a');R(32,12,2,2,'#e84a3a');R(29,16,6,2,'#f0f0e0');R(30,17,1,1,'#14100c');R(32,17,1,1,'#14100c');
  const l=step?1:0;[[7,24],[13,25],[22,25],[28,24]].forEach((p,i)=>{R(p[0],p[1]-(i%2&&step?1:0),3,5-l*(i%2),i<2?dk:body);R(p[0]-1,p[1]+4,5,1,'#d8d8d0')});R(2,17,6,3,dk);R(3,15,2,4,dk);R(12,10,10,2,bel);R(6,8,3,4,dk)},
 dona_aigua(R,ell,o){const{body,dk,lt,bel,step}=o;ell(11,5,3,3,bel);R(7,3,2,18,dk);R(14,3,2,18,dk);R(8,2,7,2,dk);R(9,5,1,1,'#14100c');R(12,5,1,1,'#14100c');R(10,7,2,1,'#c85a5a');
  R(8,9,7,10,body);R(7,10,1,6,dk);R(15,10,1,6,dk);R(6,11,2,3,bel);R(15,11,2,3,bel);for(let y=19;y<28;y++){R(6-(y>24?1:0),y,11+(y>24?2:0),1,(y+step)%2?body:dk)}R(9,27,5,1,lt)},
 basilisco(R,ell,o){const{body,dk,lt,bel,step}=o;ell(18,11,13,4,body);R(7,13,23,2,bel);for(let i=0;i<9;i++)R(10+i*2,6-(i%2),1,3,'#c83a2a');ell(32,9,4,3,body);R(35,10,3,2,dk);R(33,8,2,2,'#e8e040');R(34,8,1,1,'#14100c');R(30,5,1,3,'#c83a2a');R(32,5,1,2,'#c83a2a');
  [[8,14],[14,14],[22,14],[28,14]].forEach((p,i)=>R(p[0],p[1]-(step&&i%2?1:0),2,3,dk));R(1,11,8,2,body);R(0,12,3,1,dk)},
 cavall_foc(R,ell,o){const{body,dk,lt,bel,step}=o;ell(17,16,10,5,body);R(9,18,16,2,bel);R(24,6,6,10,body);ell(31,6,4,3,body);R(34,7,3,2,dk);R(32,5,1,1,'#ffb030');R(29,2,2,3,body);
  for(let i=0;i<9;i++){R(22-i%3,4+i,2,2,i%2?'#ff8a20':'#ffd040');R(23,3+i,1,1,'#ff5a1a')}const l=step?1:0;[[8,21],[12,21],[21,21],[25,21]].forEach((p,i)=>{R(p[0],p[1]-(i%2&&step?1:0),2,8-l*(i%2),i<2?dk:body);R(p[0],p[1]+7,2,2,'#ff7a20')});
  for(let i=0;i<8;i++)R(3+i,13+(i>3?2:0)-(i%2),1,4,i%2?'#ff8a20':'#ffd040')},
 sirena(R,ell,o){const{body,dk,lt,bel,step}=o;ell(12,5,3,3,bel);R(8,2,2,12,'#2a7a6a');R(15,2,2,12,'#2a7a6a');R(9,2,7,2,'#2a7a6a');R(10,5,1,1,'#14100c');R(13,5,1,1,'#14100c');R(11,7,2,1,'#c87a7a');
  R(9,9,6,6,bel);R(8,10,1,4,bel);R(16,10,1,4,bel);R(10,10,2,1,'#e8d8c8');ell(12,19,4,5,body);R(8,24,8,2,dk);R(5,25+(step?1:0),5,3,lt);R(14,25+(step?0:1),5,3,lt);for(let y=16;y<24;y+=2)R(10,y,4,1,dk)},
 follet(R,ell,o){const{body,dk,lt,bel,step}=o;R(5,0,5,2,body);R(6,2,3,3,body);R(3,5,9,1,dk);ell(7,8,3,3,bel);R(2,7,2,3,bel);R(10,7,2,3,bel);R(5,7,1,1,'#14100c');R(8,7,1,1,'#14100c');R(6,10,3,1,'#c85a5a');R(5,11,5,4,'#4a7a3a');R(3,11,2,1,bel);R(10,11,2,1,bel);R(5,15+(step?0:1),2,2,dk);R(8,15+(step?1:0),2,2,dk)}});
// ---------- vida nocturna ----------
const _ft_noct=faunaTick;
let _nAcc=0;faunaTick=function(dt){_nAcc+=dt;if(_nAcc>.5){_nAcc=0;const night=phaseOf(G.t).night;for(const a of (G.fauna[G.zone]||[])){if(!a.alive||a.e)continue;const S=socOf(a.sp);if(S.noct){const sleep=!night;if(sleep){a.hibN=1;a.lull=Math.max(a.lull||0,G.t+30);a.tx=a.x;a.ty=a.y;a.wait=3}else a.hibN=0}}}_ft_noct(dt)};
