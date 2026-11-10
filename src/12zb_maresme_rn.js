// ===================== PUNTOS DE RECURSO DEL MARESME =====================
Object.assign(RN,{
 ostral:{n:'Ostral y mejillones',ico:'🦪',w:30,h:20,max:5,rg:()=>4,d:'Rocas cubiertas de mejillones y ostras junto al rompiente. Se pisa con cuidado: las conchas cortan y la marea sube sin avisar.',
  acts:[{l:'Recoger mejillones',sk:'survival',dc:9,min:40,use:1,out:[['mejillon',[3,5]]],xp:8,fail:{hp:1,msg:'Una concha te corta el dedo. −1 PG.'}},
   {l:'Abrir ostras [Supervivencia]',sk:'survival',dc:12,min:60,use:1,out:[['ostra',[2,3]],['concha',[0,2]]],extra:[['coral_rojo',.05]],xp:14,fail:{hp:2,msg:'El cuchillo resbala. −2 PG.'}}]},
 playa:{n:'Línea de marea',ico:'🐚',w:34,h:16,max:4,rg:()=>3,d:'La arena húmeda donde la marea deja algas, maderos y, a veces, un tesoro. Es el supermercado de los niños de Iluro.',
  acts:[{l:'Rastrear la playa [Percepción]',sk:'percep',dc:10,min:50,use:1,out:[['concha',[1,3]]],extra:[['ambar',.12],['coral_rojo',.04],['ceramica_antigua',.1]],xp:10},
   {l:'Cortar cañas y palmitos [Supervivencia]',sk:'survival',dc:9,min:40,use:1,out:[['palmito_c',[1,2]]],xp:6}]},
 redes:{n:'Secadero de redes',ico:'🕸',w:36,h:22,max:99,rg:()=>0,d:'Un bastidor de madera donde se cuelgan las redes al sol. Las mujeres de Iluro remiendan y salan aquí el pescado.',
  acts:[{l:'Salar anchoas (3 anchoas y 1 sal)',sk:'survival',dc:9,min:60,free:1,cost:{anchoa:3,sal:1},out:[['anchoa_salada',[3,3]]],xp:10},
   {l:'Secar pulpo (1 pulpo y 1 sal)',sk:'survival',dc:9,min:60,free:1,cost:{pulpo:1,sal:1},out:[['pulpo_seco',[2,2]]],xp:10},
   {l:'Remendar una red (2 de cuerda y 1 de tela)',sk:'sleight',dc:10,min:60,free:1,cost:{cuerda:2,tela:1},out:[['red_remendada',[1,1]]],xp:10}]},
 cova:{n:'Cueva marina',ico:'🕳',w:30,h:24,max:2,rg:()=>14,d:'Una gruta que se llena con la marea. Allí se refugian contrabandistas, focas y, dicen, el coral más rojo.',
  acts:[{l:'Bucear a pulmón por coral [Atletismo]',sk:'athl',dc:14,min:60,use:1,out:[['coral_rojo',[1,1]]],extra:[['ambar',.2],['reliquia_egara',.03]],xp:35,fail:{hp:4,fat:10,msg:'Te quedas sin aire y subes tosiendo. −4 PG.'}}]}});
Object.assign(NODES,{maresme:[['ostral',37.5,12],['ostral',37.5,30],['playa',37,24],['playa',37,5],['redes',32,20],['cova',35,42],['arcilla',3,28],['tronco',6,40],['colmena',12,12]].map((a,i)=>({id:'maresme_rn'+i,k:a[0],x:a[1],y:a[2]}))});
{const old=ZONE_BUILD.maresme;ZONE_BUILD.maresme=function(z){old(z);for(const n of NODES.maresme){const xi=Math.floor(n.x),yi=Math.floor(n.y);if(inZ(z,xi,yi)&&z.solid[ZI(z,xi,yi)]===0)z.solid[ZI(z,xi,yi)]=1}}}
const _rnC2=rnCanvas;rnCanvas=function(k){if(!['ostral','playa','redes','cova'].includes(k))return _rnC2(k);const T=RN[k];const c=mkc(T.w,T.h),x=c.getContext('2d');const Rr=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
 if(k==='ostral'){blob(x,15,13,13,6,'#4a4a52','#6a6a72','#2a2a32',false);for(let i=0;i<8;i++)Rr(5+i*3,8+(i%3)*3,3,2,i%2?'#2a3a5a':'#e8e0d0');Rr(10,4,2,2,'#f4ecd8')}
 else if(k==='playa'){Rr(1,6,32,9,'#e8d8a8');Rr(1,6,32,2,'#c8b888');Rr(4,3,6,2,'#2a6a3a');Rr(18,4,8,2,'#3a7a44');Rr(12,9,3,2,'#f8f0e0');Rr(22,10,3,2,'#e8a8b8');Rr(8,11,2,2,'#c88a3a')}
 else if(k==='redes'){Rr(4,2,2,19,'#6a4a30');Rr(30,2,2,19,'#6a4a30');Rr(4,2,28,2,'#8a6a40');for(let i=0;i<8;i++){Rr(7+i*3,4,1,14,'#c8b888');}for(let j=0;j<6;j++)Rr(6,6+j*2,24,1,'#a89868');Rr(14,18,3,2,'#6a8ac8')}
 else{blob(x,15,15,13,8,'#4a4a52','#6a6a72','#222228',false);blob(x,15,15,6,5,'#08080c','#10101a','#08080c',false);Rr(5,19,20,2,'#3a6aa8');Rr(8,19,6,1,'#8ac0f0')}
 outlineCell(x,0,0,T.w,T.h,[24,30,20]);return c};
const _pcRN2=propCanvas;propCanvas=function(k,v){if(k&&k.startsWith('rn_')&&['ostral','playa','redes','cova'].includes(k.slice(3)))return rnCanvas(k.slice(3));return _pcRN2(k,v)};
RN_ECO.redes=['pescador','sardina'];
