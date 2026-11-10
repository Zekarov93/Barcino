// ===================== MOTOR DE EVENTOS: aleatoriedad sin repetición y encadenado por consecuencias =====================
// 1) Memoria: cada evento recupera su peso poco a poco; las familias temáticas se enfrían juntas; si no hay nada fresco, no ocurre nada.
const EV_FAM={robo:['carterista','robo_presenciado','fest_carterista','mercado_negro','contrabandistas','carterista_regresa','carterista_banda'],
 pelea:['taberna_pelea','rina_taberna','duelo_honor','discusion_npc','debate_plaza','rencor_pelea'],
 clima:['rayo','tormenta_refugio','calor','cena_nieve','hierba_tormenta','torrente_crecida','tormenta_barcas','estrella_fugaz'],
 bestia:['perro_rabioso','perro_hambriento','aullidos_manada','lenador_lobos','cazadores_oso','jabali_cria','zorro_gallinas','trampa_trasgo','buitres_circulan','carronya_acumulada','quemar_carronya','cria_huerfana','animal_herido','ganado_enfermo','enjambre_suelto','foca_red'],
 mercader:['tip_mercader','mercader_camino','carro_roto','mercado_negro','oferta_sombra'],
 mistico:['niebla_arnau','follet_travesura','dona_peinando','sirena_acantilado','buho_presagio','goges_gorg','fada_matagalls','vibria_vision','luces_cala','telar_susurrante','cripta_egara','vell_mari','orquidea'],
 social:['boda_plaza','funeral','procesion','festival_plaza','bardo','carta_secreto'],
 menores:['nino_perdido','nino_escapado','mendigo_pan','cena_nieve'],
 trabajo:['huelga_sal','pelaires_huelga','cosecha_ayuda','red_pescador','lavandera_chisme','vendimia','plaga_vinya','xarxes_remend','almadraba_cabo','carbonero_oficio','pou_gel_ev','vidriero_pedido'],
 mascotas:['cartomante','piedra_eco','inquisidor_cartas','exhibicion_ani','concurso_animales','olfato_secreto','mascota_trucos','guardia_bestia','trufas_perro']};
const evFam=id=>{for(const f in EV_FAM)if(EV_FAM[f].includes(id))return f;return null};
const EV_D=26;
function evEff(e){const L=G.evLast||{};let m=1;if(e.w<40){const ds=L[e.id]===undefined?1e9:(G.t-L[e.id])/1440;m=ds>=1e8?1.5:Math.min(1,.04+.96*Math.pow(ds/EV_D,1.5))}
 const f=evFam(e.id);if(f&&G.evFam&&G.evFam[f]!==undefined){const df=(G.t-G.evFam[f])/1440;if(df<4)m*=.3+.7*(df/4)}return e.w*m}
tryEvent=function(force){if(!G||!G.pc||G.combat&&!G.combat.over||SCN.cur)return null;G.evLast=G.evLast||{};G.evFam=G.evFam||{};if(!force&&G.evNext&&G.t<G.evNext)return null;
 const c=evCtx();const ch=chainPick(c);if(ch)return ch;
 const cand=EVENTS.filter(e=>e.w>0&&!e.chain&&(!G.cd[e.id]||G.t>G.cd[e.id])&&e.ok(c));if(!cand.length)return null;
 let base=0,eff=0;const ws=cand.map(e=>{const w=evEff(e);base+=e.w;eff+=w;return w});
 if(!force){const pace=clamp(eff/(base*.55),0,1);if(Math.random()>pace)return null}
 let q=Math.random()*eff;let ev=cand[0];for(let i=0;i<cand.length;i++){if((q-=ws[i])<=0){ev=cand[i];break}}
 G.curEv=ev.id;G.curEvT=G.t;const node=ev.run(c);if(!node)return null;
 G.cd[ev.id]=G.t+1440*(ev.id==='festival_plaza'?.5:Math.max(5,Math.round(EV_D*.25)));G.events[ev.id]=(G.events[ev.id]||0)+1;G.evLast[ev.id]=G.t;const f=evFam(ev.id);if(f)G.evFam[f]=G.t;G.evNext=G.t+ri(90,200);return node};
// 2) Encadenado: se registra qué eligió el jugador y cómo terminó; las reglas programan continuaciones.
function follow(to,o){o=o||{};G.chain=G.chain||[];if(G.chain.some(x=>x.to===to))return;const d=o.days||[3,8];G.chain.push({to,due:G.t+1440*ri(d[0],d[1]),exp:G.t+1440*(o.ttl||45),z:o.z==='same'?G.zone:(o.z||null),data:o.data||{},src:G.curEv||null});if(G.chain.length>30)G.chain.shift()}
const EV_CH=[
 {e:['taberna_pelea','rina_taberna'],l:/apost/i,to:'apuesta_cobrador',days:[2,5],z:'same'},
 {e:['rina_taberna'],l:/fuerza/i,to:'rencor_pelea',days:[3,9],z:'same'},
 {e:['incendio'],o:/Héroe/,to:'incendio_gratitud',days:[2,5],z:'same'},{e:['incendio'],l:/robar/i,to:'incendio_acusacion',days:[1,4],z:'same'},
 {e:['mendigo_pan'],l:/Darle pan/i,to:'mendigo_agradecido',days:[4,12],z:'same'},{e:['mendigo_pan'],l:/Echarlo/i,to:'mendigo_venganza',days:[2,6],z:'same'},
 {e:['carterista'],l:/Denunciarlo/i,to:'carterista_juicio',days:[1,3],z:'same'},{e:['carterista'],l:/Soltarlo/i,to:'carterista_regresa',days:[4,12],z:'same',p:.8},{e:['carterista'],l:/paliza/i,to:'carterista_banda',days:[2,6],z:'same'},
 {e:['goges_gorg'],o:/Peine robado|Maldición/,to:'goges_venganza',days:[3,6],z:'same'},{e:['goges_gorg'],o:/Ofrenda aceptada|Dueto/,to:'goges_favor',days:[5,15],z:'same'},
 {e:['vell_mari'],o:/Mal agüero/,to:'mal_aguero',days:[3,7],z:'maresme'},{e:['vell_mari'],o:/Ofrenda|Observación/,to:'vell_mari_don',days:[4,10],z:'maresme'},{e:['foca_red'],o:/Salvada/,to:'vell_mari_don',days:[5,12],z:'maresme'},
 {e:['contrabandistas'],o:/Aviso/,to:'contrabandistas_venganza',days:[3,8],z:'same'},{e:['contrabandistas'],o:/Trato/,to:'contrabandistas_oferta',days:[4,10],z:'same'},
 {e:['huelga_sal','pelaires_huelga'],o:/^Huelga$/,to:'huelga_solidaridad',days:[3,7],z:'same'},{e:['huelga_sal','pelaires_huelga'],o:/Mediación|Acuerdo/,to:'huelga_acuerdo',days:[3,8],z:'same'},{e:['huelga_sal','pelaires_huelga'],o:/Esquirol/,to:'huelga_sabotaje',days:[2,6],z:'same'},
 {e:['plaga_vinya'],o:/Plaga contenida/,to:'cosecha_buena',days:[8,15],z:'penedes'},{e:['plaga_vinya'],o:/^Plaga$/,to:'plaga_extendida',days:[4,9],z:'penedes'},
 {e:['cripta_egara'],o:/Reliquia/,to:'reliquia_buscada',days:[3,8],z:null},
 {e:['inquisidor_cartas'],o:/Sospechas|Descubierto/,to:'inquisidor_juicio',days:[2,6],z:null},{e:['inquisidor_cartas'],l:/limosna/i,to:'inquisidor_chantaje',days:[6,14],z:null},
 {e:['perro_rabioso'],o:/Alerta/,to:'perro_caceria',days:[1,3],z:'same'},
 {e:['animal_herido','cria_huerfana'],o:/Cura|Reunida/,to:'animal_agradecido',days:[6,16],z:'same'},
 {e:['nino_escapado','nino_perdido'],o:/Reencuentro|Reunid|Encontrado/,to:'madre_agradecida',days:[2,6],z:'same'},
 {e:['cazadores_oso'],o:/Cacería/,to:'oso_trofeo',days:[3,8],z:'same'},
 {e:['huellas_extranas'],o:/Rastro/,to:'guarida_hallada',days:[1,4],z:'same'},{e:['eremita'],o:/Ayudó|Remedio|Compartes/,to:'eremita_enfermo',days:[8,20],z:'same'},{e:['cazador_furtivo'],o:/Denuncia/,to:'guarda_agradecido',days:[3,8],z:null},{e:['cazador_furtivo'],o:/Socio/,to:'guarda_persigue',days:[3,8],z:'same'},{e:['pastor_perdido'],o:/Rebaño/,to:'pastor_regalo',days:[3,8],z:'same'},
 {e:['ganado_enfermo'],o:/Brote contenido/,to:'pastor_regalo',days:[4,10],z:'same'},{e:['ganado_enfermo'],o:/Sin diagnóstico/,to:'ganado_muerto',days:[3,8],z:'same'}];
function trailNote(e,l,o){G.trail=G.trail||[];const en={e,l:l||'',o:o||'',t:G.t,z:G.zone};G.trail.push(en);if(G.trail.length>80)G.trail.shift();
 for(const r of EV_CH){if(!r.e.includes(e))continue;if(r.l&&!r.l.test(en.l))continue;if(r.o&&!r.o.test(en.o))continue;if(r.p&&Math.random()>r.p)continue;follow(r.to,{days:r.days,z:r.z});break}}
const _OEv=O;O=function(l,f,o){if(!f)return _OEv(l,f,o);const g=function(){const id=(G.curEv&&G.curEvT!==undefined&&G.t-G.curEvT<300)?G.curEv:(SCN.cur&&SCN.cur.id)||null;const r=f.apply(this,arguments);if(id){try{trailNote(id,l,r&&r.title)}catch(e){}}return r};return _OEv(l,g,o)};
const CHAIN_MISS={cautivo_carta:()=>{let c=0;for(const id in G.npcs){const n=G.npcs[id];if(n.captive){delete n.captive;n.alive=false;n.hidden=true;G.dead[n.id]=G.t;c++}}if(c)addGossip('maresme','Dicen que los cautivos de Iluro fueron vendidos como esclavos en Dénia. Nadie volverá a verlos.',null)}};
function chainPick(c){const L=G.chain;if(!L||!L.length)return null;for(let i=L.length-1;i>=0;i--){if(L[i].exp<G.t){const m=CHAIN_MISS[L[i].to];L.splice(i,1)[0];if(m)try{m()}catch(e){}}}
 const due=L.filter(x=>x.due<=G.t&&(!x.z||x.z===G.zone));for(const x of due.sort((a,b)=>a.due-b.due)){const ev=EVENTS.find(e=>e.id===x.to);if(!ev){L.splice(L.indexOf(x),1);continue}let ok=false;try{ok=ev.ok(c)}catch(e){}if(!ok)continue;if(Math.random()>.6)return null;
  L.splice(L.indexOf(x),1);G.chainCur=x;G.curEv=x.to;G.curEvT=G.t;const node=ev.run(c,x.data);if(!node)return null;G.events[x.to]=(G.events[x.to]||0)+1;G.evLast[x.to]=G.t;G.evNext=G.t+ri(90,200);return node}return null}
// 3) Eventos de continuación (w:0: sólo ocurren como consecuencia)
const FE=(id,o)=>EVENTS.push(Object.assign({id,w:0,chain:1,ok:c=>true},o));
const lvE=()=>clamp(Math.round(G.pc.level/2)+1,1,3);
const thugs=(n,name)=>Array.from({length:n},()=>{const b=banditCombatant(lvE());b.name=name||'Matón';return b});
const NOCT=c=>!c.night, NIGHT=c=>c.night;
FE('apuesta_cobrador',{ok:NOCT,run:c=>{const won=Math.random()<.5;if(won)return EVN('Un hombre de cara colorada te para en la plaza: «Tú apostaste por el bueno en la pelea del otro día. Aquí tienes lo tuyo, y que no se diga que el vino no paga.»',[O('Cobrar (+'+(26)+' fl)',()=>{addGold(26);gainXp(10);return EVN('Cuentas las monedas. En la taberna hay quien te mira con otros ojos.',[evEnd()],'Ganas la apuesta','🎲')}),O('Rechazar el dinero',()=>{repGain(G.zone,2);return evEnd()})],'La apuesta','🎲');
 return EVN('Un hombre con una cicatriz en la ceja te corta el paso: «La apuesta de la pelea. Perdiste. Son 20 florines, amigo.»',[O('Pagar 20 fl',()=>{if(G.pc.gold<20)return EVN('No los tienes. «Pues los tendrás la semana que viene, con intereses».',[evEnd()],'Deuda','💸');addGold(-20);return evEnd()}),O('Negarte [Intimidación CD 13]',()=>{const r=check('intim',13);if(r.ok){gainXp(15);return EVN('Se lo piensa, murmura algo y se va.',[evEnd()],'Se retira','😠')}startCombat(thugs(2),{});return null}),O('Regatear [Persuasión CD 12]',()=>{const r=check('persu',12);if(r.ok){addGold(-10);return EVN('Lo dejáis en 10 florines y un trago.',[evEnd()],'Trato','🤝')}addGold(-25);return EVN('Se ofende y te cobra 25 por la molestia.',[evEnd()],'Peor','💸')})],'La apuesta','🎲')}});
FE('rencor_pelea',{ok:NIGHT,run:c=>EVN('Dos hombres salen de un callejón al verte pasar. Reconoces a uno: estaba en la pelea de la taberna. «Nos dejaste mal delante de todos», gruñe.',[
 O('Pelear',()=>{startCombat(thugs(2,'Pendenciero'),{});return null},{cls:'dark'}),
 O('Disculparte [Persuasión CD 13]',()=>{const r=check('persu',13);if(r.ok){repGain(G.zone,2);gainXp(25);return EVN('Les invitas a una ronda de vino. Acabáis cantando.',[evEnd()],'Paz','🍷')}startCombat(thugs(2,'Pendenciero'),{});return null}),
 O('Huir [Acrobacias CD 12]',()=>{const r=check('acro',12);if(r.ok)return EVN('Saltas un muro y te pierden entre las calles.',[evEnd()],'Escapas','🏃');G.pc.hp=Math.max(1,G.pc.hp-3);return EVN('Te alcanzan con un par de golpes. −3 PG.',[evEnd()],'Golpes','🥊')})],'Rencor','🥊')});
FE('incendio_gratitud',{ok:NOCT,run:c=>EVN('Una familia te espera a la puerta de su casa reconstruida. «Tú nos sacaste del fuego. No tenemos mucho, pero queremos darte esto.»',[
 O('Aceptar el regalo (30 fl)',()=>{addGold(30);repGain(G.zone,4);gainXp(25);return EVN('La madre llora al abrazarte. El niño te regala una piedrecita.',[evEnd()],'Gratitud','🏠')}),
 O('Rechazar y pedir que lo guarden',()=>{repGain(G.zone,8);G.fame=clamp(G.fame+2,0,100);gainXp(35);return EVN('La noticia corre por el barrio: «el que no quiso cobrar». Te saludan por la calle.',[evEnd()],'Humildad','🙏')})],'Gratitud','🏠')});
FE('incendio_acusacion',{ok:NOCT,run:c=>EVN('Un guardia y un vecino te abordan. «Alguien vio a un forastero rebuscando entre los escombros durante el incendio. Con tu descripción.»',[
 O('Negarlo [Engaño CD 14]',()=>{const r=check('decep',14);if(r.ok)return EVN('Tu aplomo convence. El vecino duda y se retira.',[evEnd()],'Convences','😶');repGain(G.zone,-6);addGold(-Math.min(G.pc.gold,40));return EVN('Mienten peor que tú. Pagas una multa de 40 florines.',[evEnd()],'Multa','⚖')}),
 O('Confesar y devolver lo tomado',()=>{repGain(G.zone,-2);return EVN('El guardia anota algo y te deja ir con una advertencia.',[evEnd()],'Advertencia','📝')}),
 O('Sobornar al guardia (30 fl)',()=>{if(G.pc.gold<30)return EVN('No tienes tanto.',[evEnd()]);addGold(-30);return EVN('El guardia guarda las monedas sin mirarte.',[evEnd()],'Soborno','💰')},{cls:'dark'})],'Sospechoso','🔥')});
FE('mendigo_agradecido',{ok:NOCT,run:c=>EVN('Un hombre menos andrajoso que la última vez te alcanza: «Tú me diste pan. Yo no olvido. Escucha: lo que sé vale más que mi hambre».',[
 O('Escucharlo',()=>{gainXp(20);const pool=Object.keys(ZINFO).filter(z=>z!==G.zone);const z=pick(pool);addGossip(G.zone,'Un mendigo asegura haber visto algo raro en '+ZINFO[z].n+'.',null);giveItem('moneda_antigua',1,2);return EVN('Te habla en susurros de un sitio en '+ZINFO[z].n+' y te regala una moneda vieja: «Para que lo recuerdes».',[evEnd()],'Un secreto','🪙')}),
 O('Darle una moneda',()=>{addGold(-1);repGain(G.zone,2);return EVN('Te sonríe sin dientes. «Dios te lo pague».',[evEnd()])})],'El mendigo','🙏')});
FE('mendigo_venganza',{ok:NOCT,run:c=>EVN('Dos mendigos de mirada dura te siguen por la calle. Uno silba: los chiquillos de alrededor se te acercan, demasiado cerca.',[
 O('Vigilar tu bolsa [Percepción CD 12]',()=>{const r=check('percep',12);if(r.ok)return EVN('Atrapas una manita que ya tocaba tu bolsa. Los niños huyen entre risas.',[evEnd()],'Atento','👀');const l=Math.min(G.pc.gold,15);addGold(-l);repGain(G.zone,-3);return EVN('Pierdes '+l+' florines y dos mendigos te escupen al pasar.',[evEnd()],'Robado','💸')}),
 O('Dejar una limosna para calmarlos',()=>{addGold(-3);return EVN('Se miran, asienten y se desvanecen.',[evEnd()],'Paz','🤝')})],'Mendigos','🙏')});
FE('carterista_juicio',{ok:NOCT,run:c=>EVN('La Guardia te llama a declarar contra el carterista que denunciaste. El alcalde escucha con mala cara.',[
 O('Testificar con claridad [Persuasión CD 11]',()=>{const r=check('persu',11);if(r.ok){addGold(10);repGain(G.zone,5);facGain('concejo',2);gainXp(30);return EVN('El carterista es condenado a trabajos en el puerto. El alcalde te da 10 florines por las molestias.',[evEnd()],'Justicia','⚖')}return EVN('Te enredas con las fechas y el caso se archiva.',[evEnd()],'Archivado','📂')}),
 O('Pedir clemencia para él',()=>{repGain(G.zone,1);return EVN('Le dan un escarmiento menor y vuelve a la calle con la cabeza gacha.',[evEnd()],'Clemencia','🙏')})],'Juicio','⚖')});
FE('carterista_regresa',{ok:NOCT,run:c=>{if(Math.random()<.5)return EVN('El carterista al que soltaste te espera junto a un puesto. «Fui un idiota. Me diste otra oportunidad: ahora trabajo para el panadero. Toma, para ti.»',[O('Aceptar sus monedas (12 fl)',()=>{addGold(12);repGain(G.zone,3);gainXp(20);return EVN('Se va silbando, con un cesto de pan al hombro.',[evEnd()],'Redención','🍞')})],'Redención','🍞');
 return EVN('El carterista al que soltaste vuelve… con dos compinches. «Ese es el tonto que nos deja trabajar», ríe.',[O('Plantarles cara',()=>{startCombat(thugs(3,'Ladronzuelo'),{});return null},{cls:'dark'}),O('Intimidarlos [Intimidación CD 13]',()=>{const r=check('intim',13);if(r.ok){gainXp(25);return EVN('Se lo piensan mejor y se dispersan.',[evEnd()],'Respeto','😠')}const l=Math.min(G.pc.gold,25);addGold(-l);return EVN('Te rodean y te vacían la bolsa: −'+l+' fl.',[evEnd()],'Robado','💸')})],'Mal pagado','🖐')}});
FE('carterista_banda',{ok:NIGHT,run:c=>EVN('Cuatro sombras te cortan el paso en un callejón. «Pegaste a uno de los nuestros», dice la más alta. «Ahora pagas, o lo pagas con huesos.»',[
 O('Pagar 25 fl',()=>{if(G.pc.gold<25)return EVN('No tienes tanto. Se llevan lo que hay.',[evEnd()]);addGold(-25);return evEnd()}),
 O('Pelear',()=>{startCombat(thugs(3,'Ladronzuelo'),{});return null},{cls:'dark'}),
 O('Negociar con el jefe [Persuasión CD 14]',()=>{const r=check('persu',14);if(r.ok){gainXp(40);return EVN('El jefe resopla: «Eres duro de roer. Nos veremos». Te deja en paz.',[evEnd()],'Pacto','🤝')}startCombat(thugs(3,'Ladronzuelo'),{});return null})],'La banda','🔪')});
FE('goges_venganza',{ok:NIGHT,run:c=>EVN('Una niebla fría sube desde el agua y oyes un peine arañar la roca. Una voz sin edad susurra: «Devuélvelo».',[
 O('Devolver el peine',()=>{if(!invCount(G.pc.inv,'peine_goges'))return EVN('No lo tienes. La niebla se espesa y te toca la frente: fiebre.',[evEnd()],'Fiebre','🥶');takeItem('peine_goges',1);G.pc.inspiration=1;gainXp(50);return EVN('La niebla se disuelve y, en la roca, brilla una gota de plata. (inspiración)',[evEnd()],'Perdón','🧚')}),
 O('Conjurar un círculo protector [Arcanos CD 14]',()=>{const r=check('arcana',14);if(r.ok){gainXp(60);return EVN('La niebla se rompe contra tu círculo con un lamento. Conservas el peine… esta vez.',[evEnd()],'Defendido','✨')}G.pc.poison=3;G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+25);return EVN('El círculo se quiebra. La fiebre te muerde.',[evEnd()],'Maldición','🥶')}),
 O('Huir',()=>{G.pc.poison=3;return EVN('Corres entre los árboles; la fiebre te alcanza antes que el amanecer.',[evEnd()],'Fiebre','🥶')})],'Las Goges','🧚')});
FE('goges_favor',{ok:NIGHT,run:c=>EVN('Cerca del agua, una de las Goges deja caer algo sin mirarte: una concha con tres gotas de agua clara. Su voz es un hilo: «Para quien no robó».',[
 O('Beber las gotas',()=>{G.pc.inspiration=1;G.pc.hp=G.pc.maxHp;gainXp(45);return EVN('Una frescura inexplicable recorre tu cuerpo: PG completos e inspiración.',[evEnd()],'Don de las Goges','✨')}),
 O('Guardar la concha',()=>{giveItem('agua_mineral',3,3);gainXp(25);return EVN('Tres frascos de agua que nunca saben igual dos veces.',[evEnd()],'Agua viva','🐚')})],'Las Goges','🧚')});
FE('mal_aguero',{ok:NOCT,run:c=>EVN('Un grupo de pescadores se reúne en el muelle: una barca no ha vuelto. Alguien te señala: «Ese miró al Vell Marí y lo señaló.»',[
 O('Defender tu inocencia [Persuasión CD 12]',()=>{const r=check('persu',12);if(r.ok){repGain('maresme',2);return EVN('«El mar es el mar», concluye un viejo. La barca aparece al caer la tarde, con todos a bordo.',[evEnd()],'Aparece la barca','⛵')}repGain('maresme',-5);return EVN('Nadie te cree. Te evitan en el muelle durante días.',[evEnd()],'Rechazo','😶')}),
 O('Ayudar a buscar la barca [Supervivencia CD 12]',()=>{const r=check('survival',12);advance(120,{step:30});if(r.ok){repGain('maresme',8);gainXp(50);return EVN('Encuentras la barca a la deriva con los tripulantes exhaustos. Dejan de culparte.',[evEnd()],'Rescate','🛟')}return EVN('Buscas hasta anochecer sin éxito. Al menos lo has intentado.',[evEnd()],'Sin rastro','🌊')}),
 O('Pagar 30 fl a la viuda',()=>{if(G.pc.gold<30)return EVN('No tienes tanto.',[evEnd()]);addGold(-30);repGain('maresme',3);return evEnd()})],'Mal agüero','🌊')});
FE('vell_mari_don',{ok:c=>!c.night&&dateOf(G.t).h<10,run:c=>EVN('Al alba, en la orilla donde dejaste tu ofrenda, hay algo brillante entre las algas: dos trozos de ámbar y una concha con forma de oreja. A lo lejos, una cabeza gris asoma del agua y vuelve a hundirse.',[
 O('Recoger el regalo',()=>{giveItem('ambar',2,3);giveItem('coral_rojo',1,3);repGain('maresme',3);gainXp(40);LL('foca',true);return EVN('Los pescadores te miran con respeto: «El Vell Marí te ha elegido».',[evEnd()],'Don del Vell Marí','🦭')})],'Don de la mar','🦭')});
FE('contrabandistas_venganza',{ok:NIGHT,run:c=>EVN('Tres hombres con capuchas te esperan en tu camino. «La guardia encontró la cala vacía… gracias a ti. Hoy lo pagas.»',[
 O('Pelear',()=>{startCombat(thugs(3,'Contrabandista'),{});return null},{cls:'dark'}),
 O('Pagar 40 fl por la paz',()=>{if(G.pc.gold<40)return EVN('No tienes tanto: se llevan lo que llevas encima.',[evEnd()]);addGold(-40);return EVN('Cuentan las monedas y se funden en la noche.',[evEnd()],'Pagas','💰')}),
 O('Intimidarlos [Intimidación CD 14]',()=>{const r=check('intim',14);if(r.ok){gainXp(40);return EVN('«No merece la pena», murmura uno. Se retiran.',[evEnd()],'Respeto','😠')}startCombat(thugs(3,'Contrabandista'),{});return null})],'Venganza','🌙')});
FE('contrabandistas_oferta',{ok:NIGHT,run:c=>EVN('El contrabandista de la cala te reconoce. «Eres de confianza. Hay una caja que debe llegar a un hostal de Barcino. Cuarenta florines por llevarla… y no mirar dentro.»',[
 O('Aceptar y pasar por la puerta [Engaño CD 12]',()=>{const r=check('decep',12);advance(60,{step:30});if(r.ok){addGold(40);gainXp(45);return EVN('Los guardias ni te miran. El hostalero se lleva la caja y te paga.',[evEnd()],'Entregado','📦')}addGold(-Math.min(G.pc.gold,35));repGain(G.zone,-5);return EVN('Un guardia examina la caja. Pagas 35 florines para que olvide el asunto.',[evEnd()],'Descubierto','🚔')}),
 O('Mirar dentro antes',()=>{giveItem('tinte_purpura',1,2);return EVN('Telas teñidas de púrpura y una nota con un nombre. Cierras la caja y aceptas un frasco de tinte como «mordida».',[evEnd()],'Curioso','🟣')}),
 O('Rechazar',()=>evEnd())],'Encargo','📦')});
FE('huelga_solidaridad',{ok:NOCT,run:c=>EVN('Los trabajadores que apoyaste te buscan: la huelga continúa, pero te traen pan y algo de vino. «No olvidamos a quien dio la cara.»',[
 O('Aceptar y quedarte a escucharlos',()=>{giveItem('pan',2,2);giveItem('vino',1,2);repGain(G.zone,5);facGain('artesanos',2);gainXp(30);return EVN('Entre canciones y pan duro, te cuentan cómo el gremio les roba el jornal. Cuentas con ellos.',[evEnd()],'Solidaridad','✊')}),
 O('Pedirles que cedan [Persuasión CD 13]',()=>{const r=check('persu',13);if(r.ok){repGain(G.zone,4);gainXp(40);return EVN('Les convences de aceptar una oferta moderada. El gremio también cede.',[evEnd()],'Pacto','🤝')}return EVN('Te miran con frialdad: «Pensábamos que estabas con nosotros».',[evEnd()],'Decepción','😕')})],'Solidaridad','✊')});
FE('huelga_acuerdo',{ok:NOCT,run:c=>EVN('Tras tu mediación, las dos partes han firmado un acuerdo. Para celebrarlo han abierto un barril en la plaza y alguien tira de un acordeón.',[
 O('Brindar con ellos',()=>{drinkSome(1);repGain(G.zone,5);facGain('concejo',1);gainXp(30);return EVN('Los dos bandos te abrazan, ligeramente borrachos. Se te acerca el capataz con una botella de vino: «De la reserva».',[evEnd()],'Brindis','🍷')}),
 O('Pedir una comisión por tu mediación (20 fl)',()=>{addGold(20);repGain(G.zone,-1);return EVN('Te pagan, algo molestos.',[evEnd()],'Cobro','💰')})],'El acuerdo','🤝')});
FE('huelga_sabotaje',{ok:NIGHT,run:c=>EVN('Oyes ruido en tu alojamiento. Alguien ha rajado tus alforjas y escrito «esquirol» en la puerta con carbón.',[
 O('Seguir a los autores [Sigilo CD 13]',()=>{const r=check('stealth',13);if(r.ok){repGain(G.zone,2);gainXp(30);return EVN('Les sigues hasta un almacén. Son tres jóvenes asustados; les haces prometer que no volverá a pasar.',[evEnd()],'Descubiertos','🕵')}return EVN('Pierdes el rastro en las callejas.',[evEnd()])}),
 O('Limpiar y callar',()=>{G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+8);repGain(G.zone,-2);return evEnd()})],'Sabotaje','🔥')});
FE('cosecha_buena',{ok:c=>!c.night,run:c=>EVN('La viña que ayudaste a salvar da racimos hermosos. El viñador te hace señas: «¡Mira esto! Esta cepa estaba condenada, y ahora…»',[
 O('Vendimiar con él',()=>{giveItem('uva',6,3);addGold(15);repGain(G.zone,5);gainXp(40);return EVN('Una mañana de tijeras y cestos. Te llevas uvas y 15 florines.',[evEnd()],'Cosecha','🍇')})],'Cosecha buena','🍇')});
FE('plaga_extendida',{ok:c=>!c.night,run:c=>{const E=G.econ.penedes;if(E)E.s.vino=Math.floor((E.s.vino||0)*.6);return EVN('El mildiu se ha extendido a media comarca. Los viñadores lloran ante cepas negras. «Si alguien no la frena, no habrá vino este año.»',[
 O('Ayudar a quemar sarmientos [Naturaleza CD 12]',()=>{const r=check('nature',12);advance(120,{step:30});G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+20);if(r.ok){repGain('penedes',8);gainXp(55);return EVN('Con azufre y fuego, frenáis el avance en dos viñas. La comarca te lo agradece.',[evEnd()],'Frenada','🔥')}return EVN('Llegas tarde: el fuego no basta.',[evEnd()],'Tarde','🥀')}),
 O('Comprar vino antes de que suba (40 fl)',()=>{if(G.pc.gold<40)return EVN('No tienes tanto.',[evEnd()]);addGold(-40);giveItem('vino',4,3);return EVN('Cuatro botellas que valdrán el doble en otoño.',[evEnd()],'Acopio','🍷')}),
 O('Seguir camino',()=>evEnd())],'Plaga','🥀')}});
FE('reliquia_buscada',{ok:c=>c.city||c.town,run:c=>EVN('Un hombre de ropa fina y anillos pesados te aborda: «Dicen que has bajado a la cripta de Egara. Pago cien florines por una reliquia visigoda. Sin preguntas.»',[
 O('Vender la reliquia (100 fl)',()=>{if(!invCount(G.pc.inv,'reliquia_egara'))return EVN('No llevas ninguna encima. «Cuando la tengas».',[evEnd()]);takeItem('reliquia_egara',1);addGold(100);return EVN('Se la lleva envuelta en un paño. No le volverás a ver.',[evEnd()],'Vendida','💰')}),
 O('Advertirle de la maldición [Arcanos CD 12]',()=>{const r=check('arcana',12);if(r.ok){LL('cripta',true);gainXp(35);return EVN('Su cara se ensombrece. «No sabía. Gracias.» Te deja una bolsa con 20 florines.',[evEnd()],'Aviso','⚠')}return EVN('Se ríe. «Supersticiones».',[evEnd()])}),
 O('Rechazar',()=>evEnd())],'El coleccionista','🏺')});
FE('inquisidor_juicio',{ok:c=>c.city||c.town,run:c=>EVN('Te han citado ante un tribunal eclesiástico. Un clérigo de voz fina repasa las acusaciones: «Prácticas de adiestramiento heterodoxas».',[
 O('Defenderte [Persuasión CD 14]',()=>{const r=check('persu',14);if(r.ok){gainXp(60);repGain(G.zone,3);return EVN('Tu elocuencia convence al tribunal. Absuelto, con una amonestación.',[evEnd()],'Absuelto','⚖')}addGold(-Math.min(G.pc.gold,60));return EVN('Te imponen una multa de 60 florines y penitencia.',[evEnd()],'Multa','⚖')}),
 O('Pagar la multa (60 fl)',()=>{addGold(-Math.min(G.pc.gold,60));return evEnd()}),
 O('Huir de la ciudad',()=>{repGain(G.zone,-8);return EVN('Sales por una puerta trasera. El clérigo ordena que te busquen, aunque sin mucho entusiasmo.',[evEnd()],'Huida','🏃')},{cls:'dark'})],'Tribunal','⚖')});
FE('inquisidor_chantaje',{ok:c=>c.city||c.town,run:c=>EVN('El inquisidor al que diste una «limosna» te vuelve a buscar con una sonrisa cansada: «Ha habido… gastos. Veinte florines más. Por la Iglesia».',[
 O('Pagar otra vez (20 fl)',()=>{addGold(-Math.min(G.pc.gold,20));return EVN('Te da las gracias con un gesto de bendición. Sabes que volverá.',[evEnd()],'Pagas','💰')}),
 O('Negarte y amenazar con denunciarlo [Intimidación CD 13]',()=>{const r=check('intim',13);if(r.ok){repGain(G.zone,2);gainXp(40);return EVN('Palidece. «Olvidemos esto». Se marcha deprisa.',[evEnd()],'Chantaje frenado','😠')}repGain(G.zone,-4);return EVN('Se pone serio: «Entonces hablaremos con el obispo».',[evEnd()],'Peor','😬')})],'Limosna','⛪')});
FE('perro_caceria',{ok:NOCT,run:c=>EVN('La guardia organiza una batida contra el perro rabioso. Un sargento reparte horquillas y antorchas: «¡Quien quiera, a la plaza!»',[
 O('Unirte a la batida [Atletismo CD 11]',()=>{const r=check('athl',11);advance(90,{step:30});if(r.ok){repGain(G.zone,6);facGain('concejo',2);gainXp(50);return EVN('Entre todos acorraláis al animal en un callejón y acabáis con él. La ciudad respira.',[evEnd()],'Batida','🔦')}G.pc.hp=Math.max(1,G.pc.hp-3);return EVN('El perro te muerde antes de caer. −3 PG. Cuidado con la fiebre.',[evEnd()],'Mordisco','🐕')}),
 O('Quedarte al margen',()=>evEnd())],'Batida','🔦')});
FE('animal_agradecido',{ok:NOCT,run:c=>EVN('Una criatura te observa desde unos arbustos. La reconoces: es aquella a la que ayudaste. Se acerca, deja algo a tus pies y retrocede, sin quitarte ojo.',[
 O('Aceptar el regalo',()=>{const g=pick(['piel_conejo','huevos','carne_conejo','miel']);giveItem(g,2,2);hndGain(10);gainXp(25);return EVN('Te lo ha traído como quien paga una deuda. Hay quien dice que los animales no olvidan.',[evEnd()],'Gratitud','🐾')}),
 O('Dejarle comida',()=>{takeItem('pan',1);hndGain(18);return EVN('Lo toma con cuidado y se queda un rato cerca de ti, como si te acompañase.',[evEnd()],'Vínculo','🐾')})],'Agradecido','🐾')});
FE('madre_agradecida',{ok:NOCT,run:c=>EVN('La madre del niño que ayudaste a encontrar te invita a su casa: sopa caliente, pan y una silla junto al fuego. «Aquí siempre tendrás un plato».',[
 O('Aceptar la invitación',()=>{advance(90,{step:30});G.pc.needs.hunger=0;G.pc.needs.fatigue=Math.max(0,G.pc.needs.fatigue-20);G.pc.hp=G.pc.maxHp;drinkSome(1);repGain(G.zone,5);gainXp(30);return EVN('Comes, ríes con los críos y te quedas dormido junto al fuego un rato. Te sientes en casa.',[evEnd()],'Hospitalidad','🍲')}),
 O('Excusarte con cariño',()=>{repGain(G.zone,2);return evEnd()})],'Gratitud','🍲')});
FE('oso_trofeo',{ok:NOCT,run:c=>EVN('Los cazadores que ayudaste a rastrear han clavado la piel del oso en el muro del mesón y asan carne en la plaza. Te llaman a gritos: «¡El rastreador!»',[
 O('Brindar con los cazadores',()=>{drinkSome(1);addGold(20);repGain(G.zone,4);G.fame=clamp(G.fame+2,0,100);gainXp(40);return EVN('Te dan una porción del botín: 20 florines y muchas palmadas.',[evEnd()],'Trofeo','🐻')}),
 O('Rechazar el botín y pedir la garra',()=>{giveItem('garra_oso',1,3);gainXp(30);return EVN('Te entregan la mejor garra con ceremonia.',[evEnd()],'La garra','🐾')})],'Trofeo','🐻')});
FE('pastor_regalo',{ok:NOCT,run:c=>EVN('El pastor del rebaño que ayudaste a curar te alcanza con un queso envuelto en un paño. «Pocos preguntan. Tú preguntaste.»',[
 O('Aceptar el queso',()=>{giveItem('queso_cabra',2,3);repGain(G.zone,3);gainXp(20);return EVN('Dos quesos de cabra curados al humo. Uno para ti, otro para el camino.',[evEnd()],'Gratitud','🧀')})],'Gratitud','🧀')});
FE('ganado_muerto',{ok:NOCT,run:c=>{const E=G.econ[G.zone];if(E){E.s.carne_cordero=Math.floor((E.s.carne_cordero||0)*.5);E.s.lana=Math.floor((E.s.lana||0)*.6)}return EVN('Una fosa humeante junto al camino: el rebaño murió casi entero. El pastor, sentado en una piedra, mira la nada.',[
 O('Consolarlo y ofrecer 20 fl',()=>{if(G.pc.gold<20)return EVN('No tienes tanto, pero le das lo que puedes.',[evEnd()]);addGold(-20);repGain(G.zone,5);gainXp(30);return EVN('Te estrecha la mano sin hablar.',[evEnd()],'Ayuda','🤝')}),
 O('Aprovechar para comprar pieles baratas (10 fl)',()=>{if(G.pc.gold<10)return EVN('No tienes tanto.',[evEnd()]);addGold(-10);giveItem('cuero',2,1);repGain(G.zone,-3);return EVN('Compras cuero de reses muertas. Algunos te miran mal.',[evEnd()],'Oportunista','🪙')},{cls:'dark'}),
 O('Seguir camino',()=>evEnd())],'El rebaño muerto','🐑')}});

// 4) Eventos de naturaleza para zonas salvajes (más variedad fuera de los pueblos)
const WILD=c=>c.wild||c.biome==='forest'||c.biome==='hills'||c.biome==='mountain';
EVENTS.push(
{id:'huellas_extranas',w:6,ok:c=>WILD(c)&&!c.night,run:c=>EVN('En el barro del sendero hay huellas que no reconoces: anchas, con garras, demasiado profundas para un lobo. Se internan en la maleza.',[
 O('Seguir el rastro [Supervivencia CD 12]',()=>{const r=check('survival',12);advance(60,{step:20});if(r.ok){gainXp(30);return EVN('El rastro termina en una hondonada con huesos roídos. Una guarida, vacía por ahora.',[evEnd()],'Rastro','🐾')}return EVN('Pierdes el rastro entre zarzas.',[evEnd()],'Sin rastro','🌿')}),
 O('Estudiarlas sin seguirlas [Naturaleza CD 10]',()=>{const r=check('nature',10);if(r.ok){gainXp(15);return EVN('Una hembra con crías, a juzgar por el tamaño. Mejor no acercarse.',[evEnd()],'Lectura','📖')}return evEnd()}),
 O('Alejarte',()=>evEnd())],'Huellas extrañas','🐾')},
{id:'fuente_oculta',w:5,ok:c=>WILD(c),run:c=>EVN('Un hilo de agua clara baja entre musgos hasta una poza de piedra casi oculta. Alguien ha dejado, hace tiempo, una taza de barro junto al borde.',[
 O('Beber y descansar',()=>{drinkSome(2);G.pc.needs.fatigue=Math.max(0,G.pc.needs.fatigue-12);advance(20,{step:10});gainXp(8);return EVN('Agua fría, con sabor a piedra. Te sientes renovado.',[evEnd()],'Descanso','💧')}),
 O('Llenar un frasco',()=>{if(invCount(G.pc.inv,'frasco_vidrio')){takeItem('frasco_vidrio',1);giveItem('agua_mineral',1,2);return EVN('Un frasco de agua pura para el camino.',[evEnd()])}return EVN('No llevas frasco, sólo tus manos.',[evEnd()])}),
 O('Marcar el lugar [Supervivencia CD 9]',()=>{const r=check('survival',9);if(r.ok){gainXp(15);return EVN('Dejas una piedra sobre otra. Sabrás volver.',[evEnd()])}return evEnd()})],'Fuente oculta','💧')},
{id:'pastor_perdido',w:5,ok:c=>WILD(c)&&!c.night,run:c=>EVN('Un pastor, ronco de gritar, busca ovejas por la ladera. «Se me han dispersado con la tormenta de ayer. ¿Me ayudas a reunirlas?»',[
 O('Ayudar a reunir el rebaño [Trato con animales CD 11]',()=>{const r=check('animal',11);advance(90,{step:30});if(r.ok){repGain(G.zone,3);gainXp(35);hndGain(5);return EVN('Entre silbidos y piedras lanzadas con tino, recoges al rebaño. Estás agotado, pero él sonríe.',[evEnd()],'Rebaño','🐑')}return EVN('Se te escapan las dos más tercas. El pastor te agradece el intento.',[evEnd()],'Intento','🐑')}),
 O('Indicarle la dirección en que viste balidos',()=>{gainXp(8);return evEnd()}),
 O('Seguir tu camino',()=>evEnd())],'Pastor perdido','🐑')},
{id:'ruinas_romanas',w:5,ok:c=>WILD(c)&&!c.night,run:c=>EVN('Entre la maleza asoma una pared de sillares romanos, mitad enterrada. Hay baldosas de mosaico rotas y fragmentos de ánfora.',[
 O('Excavar con cuidado [Investigación CD 12]',()=>{const r=check('invest',12);advance(60,{step:20});if(r.ok){giveItem('ceramica_antigua',1,2);if(Math.random()<.4)giveItem('moneda_antigua',1,2);gainXp(40);LL('iluro',true);return EVN('Entre tierra y raíces, encuentras fragmentos útiles y quizá una moneda.',[evEnd()],'Hallazgo','🏺')}G.pc.hp=Math.max(1,G.pc.hp-2);return EVN('Un sillar suelto se desliza. −2 PG.',[evEnd()],'Derrumbe','🪨')}),
 O('Explorar sin excavar [Historia CD 10]',()=>{const r=check('hist',10);if(r.ok){gainXp(20);return EVN('Reconoces el trazado de una villa agrícola. Por aquí pasó una calzada.',[evEnd()],'Reconocimiento','📜')}return evEnd()}),
 O('Dejarlo',()=>evEnd())],'Ruinas romanas','🏛')},
{id:'eremita',w:4,ok:c=>WILD(c)&&!c.night,run:c=>EVN('Una cabaña de piedra seca y humo fino. Un anciano barbudo remueve un puchero junto a la puerta. «No tengo mucho, pero sobra caldo.»',[
 O('Compartir caldo y charla',()=>{advance(45,{step:15});G.pc.needs.hunger=Math.max(0,G.pc.needs.hunger-25);gainXp(30);LL('matagalls',true);return EVN('Te habla de montañas, de lobos amigos y de lo que se pierde en las ciudades. «Compartes» bien. Vuelve, si pasas.',[evEnd()],'Compartes','🍲')}),
 O('Ofrecerle un remedio',()=>{if(!invCount(G.pc.inv,'pocion'))return EVN('No tienes nada que ofrecerle.',[evEnd()]);takeItem('pocion',1);gainXp(45);return EVN('Lo toma con una sonrisa: «Remedio de amigo». Te regala unas hierbas.',[evEnd()],'Remedio','🌿')}),
 O('Seguir camino',()=>evEnd())],'El ermitaño','🛖')},
{id:'cazador_furtivo',w:5,ok:c=>WILD(c)&&!c.night,run:c=>EVN('Un hombre agazapado coloca lazos entre los árboles del bosque del señor. Te ve, no huye. «Si hablas, me cuelgan. Si callas, hay carne para los dos.»',[
 O('Denunciarlo a la Guardia',()=>{repGain(G.zone,3);facGain('concejo',2);gainXp(25);return EVN('Denuncia presentada. El furtivo huye pero el guarda del bosque te apunta como testigo.',[evEnd()],'Denuncia','⚖')}),
 O('Aceptar la carne como socio',()=>{giveItem('carne_conejo',3,2);gainXp(10);return EVN('Reparten la caza. Es dudosa ética pero buena cena. Socio de furtivos.',[evEnd()],'Socio','🥩')},{cls:'dark'}),
 O('Dejarlo ir sin hablar',()=>evEnd())],'Furtivo','🥩')},
{id:'camino_niebla',w:4,ok:c=>WILD(c)&&(c.wx.type==='fog'||dateOf(G.t).h<8),run:c=>EVN('La niebla se cierra tan espesa que pierdes la vista de tus propias botas. Oyes un goteo, un cencerro lejano, algo que respira.',[
 O('Avanzar por el sonido del cencerro [Supervivencia CD 12]',()=>{const r=check('survival',12);advance(60,{step:20});if(r.ok){gainXp(25);return EVN('Llegas a un establo de pastores y te dan un trago de leche tibia.',[evEnd()],'Orientado','🔔')}G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+15);return EVN('Das vueltas durante una hora. Acabas donde empezaste.',[evEnd()],'Perdido','🌫')}),
 O('Esperar a que levante',()=>{advance(60,{step:30});return evEnd()})],'Niebla','🌫')},
{id:'peregrinos_camino',w:5,ok:c=>WILD(c)&&!c.night,run:c=>EVN('Una fila de peregrinos con bordones y conchas cantan un salmo bajo. Uno cojea. Te ofrecen sitio en su fuego.',[
 O('Compartir fuego y pan',()=>{takeItem('pan',1);advance(40,{step:20});G.pc.inspiration=1;gainXp(20);return EVN('Te cuentan de santuarios lejanos. El que cojeaba te regala una concha. (inspiración)',[evEnd()],'Peregrinos','🕯')}),
 O('Curar al cojo [Medicina CD 11]',()=>{const r=check('medic',11);if(r.ok){repGain(G.zone,2);gainXp(40);return EVN('Vendas un esguince con paciencia. El grupo reza por ti.',[evEnd()],'Cura','🩹')}return evEnd()}),
 O('Seguir camino',()=>evEnd())],'Peregrinos','🕯')});
FE('guarida_hallada',{ok:c=>WILD(c)&&!c.night,run:c=>EVN('Vuelves a ver las huellas extrañas: llevan a una cueva baja. Dentro, algo se mueve… cachorros de lobo, durmiendo contra el flanco de su madre.',[
 O('Observar sin molestar [Sigilo CD 12]',()=>{const r=check('stealth',12);if(r.ok){gainXp(45);hndGain(10);LL('lobos',true);return EVN('Te quedas largo rato. La loba te mira un instante y vuelve a dormir. Algo se entiende.',[evEnd()],'Respeto','🐺')}const w=(G.fauna[G.zone]||[]).find(a=>a.alive&&!a.e&&a.sp==='lobo');if(w){startCombat([animalCombatant(w)],{});return null}G.pc.hp=Math.max(1,G.pc.hp-3);return EVN('Un gruñido y una sombra: te arañan antes de que huyas. −3 PG.',[evEnd()],'Zarpazo','🐺')}),
 O('Dejarles carne',()=>{if(!invCount(G.pc.inv,'carne')&&!invCount(G.pc.inv,'carne_conejo'))return EVN('No llevas carne.',[evEnd()]);if(!takeItem('carne_conejo',1))takeItem('carne',1);hndGain(15);gainXp(30);return EVN('La loba se acerca cuando te alejas. Al volver la vista, ya no hay nadie.',[evEnd()],'Ofrenda','🥩')}),
 O('Marcharte en silencio',()=>evEnd())],'La guarida','🐺')});
FE('eremita_enfermo',{ok:c=>WILD(c)&&!c.night,run:c=>EVN('La cabaña del ermitaño está en silencio. Dentro, el anciano yace entre mantas, con fiebre. «Sabía que vendrías», susurra.',[
 O('Cuidarlo [Medicina CD 12]',()=>{const r=check('medic',12);advance(120,{step:30});if(r.ok){gainXp(70);giveItem('salvia_h',3,3);repGain(G.zone,2);return EVN('Te quedas dos horas hasta que la fiebre cede. Antes de que partas te da una bolsa de hierbas raras y un secreto.',[evEnd()],'Salvado','🌿')}return EVN('Haces lo que puedes. Mejora poco, pero te agradece la compañía.',[evEnd()],'Compañía','🕯')}),
 O('Dejarle comida y avisar al pueblo',()=>{takeItem('pan',1);repGain(G.zone,1);return evEnd()})],'El ermitaño enfermo','🛖')});
FE('guarda_agradecido',{ok:c=>true,run:c=>EVN('El guarda del bosque te reconoce en el camino y te saluda con la mano. «Detuvimos al furtivo gracias a ti. El señor quiere agradecértelo.»',[
 O('Recibir la recompensa (30 fl)',()=>{addGold(30);repGain(G.zone,4);facGain('concejo',2);gainXp(35);return EVN('Una bolsa con el sello del señor.',[evEnd()],'Recompensa','💰')})],'Agradecimiento','🌲')});
FE('guarda_persigue',{ok:c=>WILD(c)&&!c.night,run:c=>EVN('Un guarda del bosque te cierra el paso: «Alguien me ha dicho que cazas en tierras del señor. Y que lo hiciste con un furtivo.»',[
 O('Negarlo [Engaño CD 13]',()=>{const r=check('decep',13);if(r.ok){gainXp(30);return EVN('Dudas bien fingidas. Te deja pasar con un gruñido.',[evEnd()],'Convences','😶')}addGold(-Math.min(G.pc.gold,30));repGain(G.zone,-4);return EVN('No te cree. Pagas 30 florines de multa.',[evEnd()],'Multa','⚖')}),
 O('Pagar 25 fl',()=>{addGold(-Math.min(G.pc.gold,25));return evEnd()}),
 O('Plantarle cara',()=>{startCombat(thugs(1,'Guarda del bosque'),{});return null},{cls:'dark'})],'El guarda','🌲')});
// continuaciones del asedio pirata
FE('barcino_refuerzos',{ok:NOCT,run:c=>EVN('La Guardia de Barcino refuerza las puertas: han llegado noticias del saqueo de Iluro. Un capitán busca voluntarios para patrullar la costa.',[
 O('Alistarte una semana [Atletismo CD 11]',()=>{const r=check('athl',11);advance(240,{step:60});G.pc.needs.fatigue=Math.min(100,G.pc.needs.fatigue+20);if(r.ok){addGold(40);facGain('concejo',3);repGain('barcino',5);gainXp(60);return EVN('Una semana de guardias y rondas. Cobras 40 florines y ganas el respeto del capitán.',[evEnd()],'Servicio','🛡')}return EVN('Te cansas pronto y te licencian con medio sueldo.',[evEnd()],'Baja','😮‍💨')}),
 O('Donar 30 fl para armas',()=>{if(G.pc.gold<30)return EVN('No tienes tanto.',[evEnd()]);addGold(-30);facGain('concejo',2);repGain('barcino',3);return evEnd()}),
 O('Ignorar',()=>evEnd())],'Refuerzos','🛡')});
FE('cautivo_carta',{ok:c=>c.city||c.town,run:c=>EVN('Un fraile mercedario te entrega una carta sellada con cera negra. Viene de Dénia: «Los cautivos de Iluro viven. Piden 150 florines por su libertad, antes de que acabe el mes».',[
 O('Pagar el rescate (150 fl)',()=>{if(G.pc.gold<150)return EVN('No tienes tanto. Quizá consigas el dinero antes de que acabe el mes.',[evEnd()],'Faltan fondos','💸');addGold(-150);const n=freeCaptives();repGain('maresme',20);gainXp(120);return EVN('Semanas después llegan '+n+' vecinos magullados a Iluro. Te nombran en las oraciones.',[evEnd()],'Liberados','🙏')}),
 O('Pedir ayuda a los mercedarios',()=>{follow('cautivo_carta',{days:[3,5],z:null,ttl:12});return EVN('El fraile suspira: «Haremos lo que podamos. Vuelve cuando tengas el dinero».',[evEnd()],'Pendiente','⛪')}),
 O('No puedes ayudar',()=>evEnd())],'Carta de Dénia','✉')});
FE('maresme_homenaje',{ok:c=>c.z==='maresme'&&!c.night,run:c=>EVN('Iluro te rinde homenaje: los pescadores forman una fila en la playa y el alcalde sostiene una cimitarra capturada. «Por haber parado a los moros, esta villa es tuya».',[
 O('Aceptar la cimitarra',()=>{giveItem('espada',1,3);repGain('maresme',10);G.fame=clamp(G.fame+4,0,100);gainXp(80);return EVN('Una hoja curva de acero oscuro. Los niños la miran con asombro.',[evEnd()],'Homenaje','🏆')}),
 O('Pedir que el dinero se destine a la viuda del pescador',()=>{repGain('maresme',16);facGain('concejo',2);G.fame=clamp(G.fame+3,0,100);gainXp(100);return EVN('La viuda llora al recibirlo. En la villa, hay quien te llamará «el justo».',[evEnd()],'Generosidad','🙏')})],'Homenaje','🏆')});
// el asedio programa sus consecuencias
const _sackM=sackMaresme;sackMaresme=function(){_sackM();follow('barcino_refuerzos',{days:[3,7],z:'barcino'});follow('cautivo_carta',{days:[8,14],z:null,ttl:30})};
const _raidR=raidResult;raidResult=function(prep,res,w){const r=_raidR(prep,res,w);if(res==='won'&&w===2)follow('maresme_homenaje',{days:[6,12],z:'maresme'});return r};
