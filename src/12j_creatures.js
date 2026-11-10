// ===================== NUEVAS CRIATURAS: tejón, lince, águila, cangrejo, oso =====================
GD('carne_tejon','Carne de tejón','food',3,1,{nut:26});GD('piel_tejon','Piel de tejón','raw',3,.8);GD('piel_lince','Piel de lince','raw',9,1);GD('pluma_aguila','Pluma de águila','raw',5,.1);
GD('carne_cangrejo','Carne de cangrejo','food',4,.4,{nut:20});GD('carne_oso','Carne de oso','food',6,1.5,{nut:36});GD('piel_oso','Piel de oso','raw',12,2.5);GD('garra_oso','Garra de oso','raw',10,.4);
Object.assign(CREAT,{
 tejon:{n:'Tejón',diet:'omni',hp:9,ac:12,atk:3,dmg:'1d6',xp:35,spd:1.6,sz:.6,bi:['forest','hills'],mat:25,gest:6,litter:[1,3],breed:[2,3,4],life:600,loot:{carne_tejon:[1,2],piel_tejon:[1,1]},flee:.3,aggro:.1,cap:{}},
 lince:{n:'Lince',diet:'carn',hp:18,ac:14,atk:5,dmg:'1d8+2',xp:130,spd:3.1,sz:.8,bi:['forest','hills','mountain'],mat:35,gest:9,litter:[1,3],breed:[2,3],life:900,loot:{piel_lince:[1,1]},flee:.15,aggro:.55,prey:['conejo','ciervo','gallina','rata'],cap:{}},
 aguila:{n:'Águila real',diet:'carn',hp:6,ac:14,atk:4,dmg:'1d6+1',xp:70,spd:3.4,sz:.6,bi:['mountain','hills'],mat:30,gest:5,litter:[1,2],breed:[3,4,5],life:900,eggs:1,loot:{pluma_aguila:[1,3]},flee:.5,aggro:.3,fly:1,prey:['conejo','rata','vibora'],cap:{}},
 cangrejo:{n:'Cangrejo',diet:'omni',hp:5,ac:13,atk:3,dmg:'1d4+1',xp:15,spd:1.1,sz:.35,bi:['coast'],mat:10,gest:3,litter:[2,5],breed:[4,5,6,7],life:300,loot:{carne_cangrejo:[1,2]},flee:.4,aggro:.2,cap:{}},
 oso:{n:'Oso pardo',diet:'omni',hp:42,ac:12,atk:6,dmg:'2d6+3',xp:220,spd:2.4,sz:1.3,bi:['forest','mountain'],mat:50,gest:12,litter:[1,2],breed:[3,4],life:1200,loot:{carne_oso:[5,8],piel_oso:[2,3],garra_oso:[0,2]},flee:.05,aggro:.35,cap:{}}});
Object.assign(SPEC_BY,{tejon:'rend',lince:'rend',aguila:'tackle',cangrejo:'rend',oso:'smash'});
Object.assign(CR_DEF,{tejon:{cw:24,ch:14,coat:['#7a7a80','#5a5a62'],bel:'#c8c8d0'},lince:{cw:28,ch:20,coat:['#c8a060','#a8803e'],bel:'#e8dcc0'},aguila:{cw:32,ch:26,coat:['#7a5a34','#5a4024'],bel:'#a88a5a'},cangrejo:{cw:16,ch:10,coat:['#d05a3a','#a8402a'],bel:'#e8a080'},oso:{cw:38,ch:30,coat:['#7a5a3a','#4a3626'],bel:'#a8845a'}});
Object.assign(CR_FB,{tejon:{k:'quad',ears:'round',tail:'tiny',hs:.28,bw:.5,lg:.18,snout:1},lince:{k:'quad',ears:'point',tail:'tiny',hs:.24,bw:.34,lg:.34,snout:1},oso:{k:'quad',ears:'round',tail:'tiny',hs:.22,bw:.5,lg:.3,snout:1},aguila:{k:'bird',beak:'#e8c030'}});
const NEWDRAW={
 tejon(R,ell,o){const{body,dk,lt,bel,step}=o;ell(10,9,7,4,body);R(5,8,10,1,lt);ell(18,8,4,3,'#f0f0f0');R(14,6,8,1,'#1a1a1e');R(15,10,7,1,'#1a1a1e');R(17,5,1,2,'#1a1a1e');R(20,5,1,2,'#1a1a1e');R(22,8,2,1,'#14100c');R(23,8,1,1,'#14100c');R(20,7,1,1,'#14100c');
  [[6,12],[9,12],[14,12],[17,12]].forEach((p,i)=>R(p[0],p[1]-(step&&i%2?1:0),2,2,dk));R(2,8,3,2,dk)},
 lince(R,ell,o){const{body,dk,lt,bel,step}=o;ell(11,11,8,4,body);R(5,13,12,2,bel);[[6,6],[10,5],[14,7],[8,9]].forEach(p=>R(p[0],p[1]+5,1,1,dk));ell(21,8,4,3,body);R(23,5,1,3,dk);R(20,5,1,3,dk);R(22,7,1,1,'#e8d84a');R(25,9,2,1,'#14100c');R(20,11,5,1,bel);R(18,9,3,1,dk);
  [[6,15],[9,15],[15,15],[18,15]].forEach((p,i)=>R(p[0],p[1]-(step&&i%2?1:0),2,5,i<2?dk:body));R(2,10,5,2,body);R(1,10,2,2,'#1a1410')},
 aguila(R,ell,o){const{body,dk,lt,bel,step}=o;const up=step?-3:2;ell(16,14,5,4,body);R(13,16,6,3,bel);ell(23,9,3,3,lt);R(26,9,3,2,'#e8c030');R(27,11,1,1,'#e8c030');R(24,8,1,1,'#14100c');
  for(let i=0;i<12;i++){R(15-i,12+Math.round(up*(i/12))-(i>6?1:0),1,4-Math.floor(i/5),i%3?dk:body);R(12+i%3,13,1,1,dk)}R(9,13+up,4,2,dk);R(8,16,3,2,dk);R(13,19,2,3,'#d8b040');R(17,19,2,3,'#d8b040')},
 cangrejo(R,ell,o){const{body,dk,lt,bel,step}=o;ell(8,6,5,3,body);R(4,4,2,2,dk);R(11,4,2,2,dk);R(3,2,2,2,body);R(12,2,2,2,body);R(2,1,1,1,dk);R(13,1,1,1,dk);R(6,3,1,1,'#14100c');R(10,3,1,1,'#14100c');
  for(let i=0;i<3;i++){R(2+i*2,8+(step&&i%2?0:1),1,2,dk);R(11+i*1,8+(step&&i%2?1:0),1,2,dk)}},
 oso(R,ell,o){const{body,dk,lt,bel,step}=o;ell(17,16,12,8,body);ell(10,10,6,5,body);ell(30,14,5,4,body);ell(34,16,2,2,bel);R(35,15,2,1,'#14100c');R(29,12,1,1,'#14100c');R(28,9,3,3,dk);R(26,9,2,2,dk);
  const l=(step?1:0);[[7,22],[13,24],[22,24],[28,22]].forEach((p,i)=>{R(p[0],p[1]-(i%2&&step?1:0),5,7-l*(i%2),i<2?dk:body);R(p[0],p[1]+6,5,1,'#1a1410')});R(4,16,4,4,dk);R(12,12,6,2,lt)}
};
const _drawCreature=drawCreature;
drawCreature=function(ctx,ox,oy,sp,gn,fr){const f=NEWDRAW[sp];if(!f)return _drawCreature(ctx,ox,oy,sp,gn,fr);
 const df=CR_DEF[sp];const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(ox+Math.round(x),oy+Math.round(y),w,h)};const t=gn?gn.coat:.5;const body=mixc(df.coat[0],df.coat[1],t);
 const ell=(cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){if((x*x)/(rx*rx+.3)+(y*y)/(ry*ry+.3)<=1.05)R(cx+x,cy+y,1,1,c)}};
 f(R,ell,{body,dk:shade(body,-.25),lt:shade(body,.18),bel:df.bel,step:fr&1})};
// poblaciones
const NEWCAPS={collserola:{tejon:6,lince:3,oso:2},pas_molins:{tejon:4,lince:1},ascenso:{lince:3,aguila:4,oso:2},cam_collbato:{aguila:3},collbato:{aguila:2},montserrat:{aguila:3},marjal:{cangrejo:12},cornisa:{cangrejo:6},garraf:{cangrejo:10},
 sant_cugat:{conejo:10,zorro:4,cuervo:8,gato:3,tejon:2,jabali:2},salinas:{cabra:10,murcielago:8,aguila:4,lobo:2,vibora:4,rata:6,lince:2,oso:1}};
