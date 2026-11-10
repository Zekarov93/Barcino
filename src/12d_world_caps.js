// ===================== FAUNA POR MAPA: asentamientos solo con fauna doméstica/urbana inofensiva =====================
const CAPS={
 barcino:{cuervo:10,gaviota:16,rata:20,gato:10},
 martorell:{cuervo:8,rata:9,gato:5,conejo:5},collbato:{cuervo:6,rata:6,gato:4},montserrat:{cuervo:8,gato:3},garraf:{gaviota:16,cuervo:4,rata:6,gato:5,conejo:4},
 collserola:{conejo:26,ciervo:12,jabali:11,lobo:7,zorro:8,cuervo:12,vibora:5,trasgo:6},
 vega:{conejo:16,zorro:6,rata:8,cuervo:10,vibora:3},
 pas_molins:{conejo:12,ciervo:6,jabali:8,lobo:4,zorro:6,cuervo:8,vibora:4,cabra:3},
 cam_collbato:{conejo:10,cabra:10,lobo:4,murcielago:12,vibora:5,trasgo:8,ogro:2,rata:5,cuervo:6},
 ascenso:{cabra:18,lobo:4,murcielago:9,vibora:6,cuervo:10,conejo:6,vibria:2},
 marjal:{gaviota:16,rata:8,cuervo:6,conejo:8,gato:2},
 cornisa:{conejo:12,jabali:5,vibora:4,zorro:5,cabra:5,lobo:2,cuervo:6}
};
for(const sp in CREAT)CREAT[sp].cap={};
for(const z in CAPS)for(const sp in CAPS[z])if(CREAT[sp])CREAT[sp].cap[z]=CAPS[z][sp];
const SETTLE_FAUNA=['gato','rata','cuervo','gaviota','conejo'];
// leyendas y eventos: se extienden a los mapas intermedios
LORE.forEach(l=>{const add=(a,b)=>{if(l.z.includes(a))b.forEach(x=>{if(!l.z.includes(x))l.z.push(x)})};add('montserrat',['ascenso']);add('collbato',['cam_collbato']);add('martorell',['vega','pas_molins']);add('barcino',['vega','marjal']);add('collserola',['pas_molins']);add('garraf',['cornisa','marjal'])});
EVENTS.forEach(e=>{const ok=e.ok;const map={orquidea:['ascenso'],vibria_vision:['ascenso'],peregrino_perdido:['ascenso','cam_collbato'],naufragio:['marjal'],luces_cala:['cornisa'],pesca_abundante:['marjal']}[e.id];if(map)e.ok=c=>ok(c)||(map.includes(c.z)&&ok(Object.assign({},c,{z:{ascenso:'montserrat',cam_collbato:'collbato',marjal:'garraf',cornisa:'garraf'}[c.z]})))});
