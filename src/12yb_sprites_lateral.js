// ===== vistas laterales de criaturas nuevas (garduña, tortuga, foca monje, urraca) =====
Object.assign(NEWDRAW,{
 garduna(R,ell,o){const{body,dk,lt,bel,step}=o;R(1,7,7,4,dk);R(0,8,3,2,dk);ell(13,8,8,3,body);R(18,9,5,3,'#f0e0c0');ell(22,6,3,2,body);R(24,7,3,2,lt);R(26,7,1,1,'#14100c');R(23,5,1,1,'#14100c');R(21,3,1,2,dk);R(23,3,1,2,dk);
  [[7,10],[10,10],[16,10],[19,10]].forEach((p,i)=>R(p[0],p[1]+(step&&i%2?-1:0),2,3,i%2?dk:body))},
 tortuga(R,ell,o){const{body,dk,lt,bel,step}=o;ell(9,6,7,4,body);for(let i=0;i<4;i++)R(4+i*3,3+(i%2)*2,2,2,dk);R(3,8,13,1,bel);ell(17,8,2,2,lt);R(18,7,1,1,'#14100c');R(18,9,2,1,dk);
  [[5,9],[12,9]].forEach((p,i)=>R(p[0],p[1]+(step&&i?-1:0),2,3,dk));R(1,9,2,1,dk)},
 foca(R,ell,o){const{body,dk,lt,bel,step}=o;ell(15,8,12,4,body);R(5,10,19,2,bel);ell(27,6,4,3,body);R(29,7,4,2,lt);R(32,7,1,1,'#14100c');R(28,5,1,1,'#14100c');R(31,9,3,1,'#e8e8e0');R(0,9,5,2,dk);R(1,11,3,1,dk);R(21,11+(step?1:0),4,2,dk);R(11,5,10,1,lt)},
 garsa(R,ell,o){const{step}=o;const K='#1a1a22',Wh='#f4f4f4',Bl='#2a5a8a';R(0,8,5,1,K);R(0,9,6,1,Bl);ell(8,8,5,3,K);R(5,9,6,2,Wh);R(4,6,6,2,Bl);R(5,7,4,1,'#4a8ab8');ell(13,5,2,2,K);R(15,5,3,1,'#222');R(13,4,1,1,'#fff');
  R(7,11,1,3+(step?0:0),'#3a3a44');R(9,11+(step?1:0),1,3-(step?1:0),'#3a3a44')}});
