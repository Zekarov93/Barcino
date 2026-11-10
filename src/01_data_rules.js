// ===================== DATOS DE REGLAS (D&D 2024 / SRD 5.2, adaptado) =====================
const SKIN_H=['#f6d7bd','#efc29b','#d9a273','#b97a4b','#8a5532','#5e3920','#3d2414'];
const EYE_C=['#3b2a1a','#5a3d22','#2f6b3a','#2d5f9a','#7a8a99','#8a6d1e','#a02020','#6b3fa0','#101010','#d8b83a'];
const HAIR_C=['#1a1410','#3b2616','#6b4423','#a2682a','#d3a64a','#e8d28a','#b83a1c','#8a8a8a','#e8e8e8','#2c3e6b','#5b2d7a','#2e7a4f'];
const HAIR_S=[['short','Corto'],['long','Melena larga'],['pony','Coleta'],['braids','Trenzas'],['bald','Rapado'],['bun','Moño'],['curly','Rizado'],['mohawk','Cresta'],['bob','Media melena']];
const FACIAL=[['none','Sin vello'],['stubble','Barba de días'],['short','Barba corta'],['long','Barba larga'],['moustache','Bigote'],['goatee','Perilla']];
const SCARS=[['none','Ninguna'],['eye','Cicatriz en el ojo'],['cheek','Cicatriz en la mejilla'],['brow','Ceja partida']];
const MARKS=[['none','Ninguna'],['tribal','Tatuaje tribal'],['runes','Runas en el rostro'],['freckles','Pecas'],['paint','Pintura de guerra']];
const EAR_S=[['normal','Normales'],['long','Largas'],['pointed','Puntiagudas']];
const HORN_S=[['none','Sin cuernos'],['curved','Curvados'],['ram','De carnero'],['straight','Rectos']];
const BUILDS=[['Esbelta',0],['Media',1],['Robusta',2]];
const DYES=['#7a2e2e','#a8542a','#c79a2e','#4f7a3a','#2f6b6b','#2e4f8a','#5b3a8a','#8a3a6b','#5a4a3a','#2b2b33','#d8d0c0','#8a8a96'];

const SPECIES={
human:{n:'Humano',size:'M',scale:1,spd:3.0,dark:0,skin:SKIN_H,pros:['Ingenioso: Inspiración heroica (una vez al día repites una tirada fallida)','Habilidoso: competencia en una habilidad adicional','Versátil: una dote de origen adicional'],cons:['Sin visión en la oscuridad','Sin resistencias innatas'],fac:{},bon:{},hpl:0,flags:{insp:1,skill:1,feat:1},d:'Los más numerosos y adaptables; presentes en cada rincón de Barcino.'},
elf:{n:'Elfo',size:'M',scale:.98,spd:3.0,dark:18,skin:['#f6e0cc','#efd0a8','#d9b88a','#c9a47a','#8a7aa0','#5f5878'],pros:['Sentidos agudos: competencia en Percepción, Perspicacia o Supervivencia','Linaje feérico: ventaja contra encantamientos','Trance: solo necesitas 4 horas de sueño','Visión en la oscuridad (18 m)'],cons:['Constitución frágil (−1 PG por nivel)','Enanos y artesanos desconfían de ellos'],fac:{artesanos:-5,circulo:5},bon:{},hpl:-1,flags:{sleep4:1,pick:['percep','insight','survival']},
 lin:[['alto','Alto elfo','Conoces un truco de mago (Rayo de fuego) y tienes +1 Arcanos.'],['silvano','Elfo silvano','Pasos más rápidos y +1 Sigilo.'],['drow','Drow','Visión en la oscuridad ampliada (36 m), pero −2 Percepción a pleno sol.']],d:'Longevos y elegantes; muchos viven en los bosques de Collserola.'},
dwarf:{n:'Enano',size:'M',scale:.86,spd:2.6,dark:36,skin:SKIN_H,pros:['Visión en la oscuridad (36 m)','Resistencia enana: ventaja y resistencia contra veneno','Dureza: +1 PG por nivel','Cantería: +2 en comprobaciones de minería y piedra'],cons:['Paso corto (más lento)','Desconfían de la magia (−2 Arcanos)','Incómodos en el bosque (−1 Supervivencia)'],fac:{artesanos:10,circulo:-5},bon:{arcana:-2,survival:-1},hpl:1,flags:{stone:1,poison:1},d:'Mineros y herreros tenaces de las canteras de Collbató.'},
halfling:{n:'Mediano',size:'S',scale:.7,spd:2.5,dark:0,skin:SKIN_H,pros:['Suerte: repites los 1 naturales','Valiente: ventaja contra el miedo','Sigilo natural (+2 Sigilo)','Agilidad: pasas entre criaturas mayores'],cons:['Pequeño: carga solo el 75%','Más lento que los demás','Poco intimidante (−2 Intimidación)'],fac:{mercaderes:5},bon:{stealth:2,intim:-2},hpl:0,carry:.75,flags:{brave:1},d:'Cocineros, comerciantes y granjeros de buen humor.'},
gnome:{n:'Gnomo',size:'S',scale:.72,spd:2.5,dark:18,skin:['#f1c9a5','#e0ac82','#d9a273','#c68a5e','#e6b8a0','#b88a68'],pros:['Visión en la oscuridad (18 m)','Astucia gnómica: ventaja en salvaciones de INT, SAB y CAR','Linaje con ventajas propias'],cons:['Pequeño y lento','Poco imponente (−2 Intimidación)','Curiosidad indomable (−1 Engaño)'],fac:{circulo:5,artesanos:5},bon:{intim:-2,decep:-1},hpl:0,carry:.75,
 lin:[['bosque','Gnomo del bosque','Hablas con bestias pequeñas: +2 Trato con animales.'],['roca','Gnomo de roca','Artífice nato: +2 Historia (artefactos) y +1 a todo lo que fabricas.']],d:'Inventores y alquimistas que adoran los artilugios.'},
dragonborn:{n:'Dracónido',size:'M',scale:1.1,spd:3.0,dark:18,skin:['#b83a2a','#d8a62a','#3a62b8','#3f8a4a','#dfe8ee','#a8642c'],pros:['Ascendencia dracónica: resistencia a un elemento','Aliento dracónico: ataque de aliento en combate','Visión en la oscuridad (18 m)'],cons:['Aspecto atemorizante: −2 Persuasión con desconocidos','Escamas ruidosas (−1 Sigilo)'],fac:{concejo:-5,castellers:5},bon:{persu:-2,stealth:-1},hpl:0,flags:{breath:1},
 lin:[['rojo','Rojo (fuego)','Aliento de fuego y resistencia al fuego.'],['oro','Oro (fuego)','Aliento de fuego y resistencia al fuego.'],['azul','Azul (rayo)','Aliento eléctrico y resistencia al rayo.'],['verde','Verde (veneno)','Aliento venenoso y resistencia al veneno.'],['blanco','Blanco (frío)','Aliento helado y resistencia al frío.'],['bronce','Bronce (rayo)','Aliento eléctrico y resistencia al rayo.']],d:'Orgullosos descendientes de dragones; algunos dicen que del mismo Drac de Sant Jordi.'},
goliath:{n:'Goliat',size:'M',scale:1.2,spd:3.2,dark:0,skin:['#a8a8b0','#9aa0a8','#b8a898','#8a8a94','#c0b8b0','#7a7a84'],pros:['Ascendencia gigante: poder de gigante a elegir','Constitución de piedra: reduces 1d12+CON el daño recibido (1/día)','Complexión poderosa: carga ×2','Forma grande (nivel 5)'],cons:['Alto y llamativo (−2 Sigilo)','Torpe con objetos pequeños (−1 Juego de manos)','Necesita comer más (hambre ×1.3)'],fac:{orden:5,castellers:10},bon:{stealth:-2,sleight:-1},hpl:0,carry:2,hunger:1.3,flags:{stonehard:1},
 lin:[['colinas','Gigante de las colinas','Derribar a un enemigo con un golpe.'],['piedra','Gigante de piedra','Reducir daño con tu constitución de roca.'],['hielo','Gigante de escarcha','Golpe helado que ralentiza.'],['fuego','Gigante de fuego','Golpe ardiente.']],d:'Atletas de las cumbres de Montserrat; imbatibles en los castells.'},
orc:{n:'Orco',size:'M',scale:1.1,spd:3.1,dark:36,skin:['#7a9a5a','#6a8a4a','#8a9a6a','#7a8a7a','#5a7a4a','#9a7a5a'],pros:['Visión en la oscuridad (36 m)','Descarga de adrenalina: bonificación al huir o atacar','Resistencia incansable: sobrevives una vez al día con 1 PG','Mirada feroz: +2 Intimidación'],cons:['Prejuicios: Concejo −10, Mercaderes −5','Trato áspero (−1 Persuasión)','Cuesta ocultarse (−1 Sigilo)'],fac:{concejo:-10,mercaderes:-5,sombra:5},bon:{intim:2,persu:-1,stealth:-1},hpl:0,flags:{relentless:1},d:'Fieros y leales, mal vistos por las élites de la ciudad.'},
tiefling:{n:'Tiefling',size:'M',scale:1,spd:3.0,dark:18,skin:['#b84a4a','#9b3c6b','#6a4a9a','#4a5ea0','#d07a5a','#7a3a3a'],pros:['Visión en la oscuridad (18 m)','Resistencia al fuego','Legado: truco y conjuros innatos','Presencia sobrenatural: +1 Engaño'],cons:['Desconfianza supersticiosa: Orden de Montserrat −15, Concejo −5','Animales y niños lo evitan (−2 Trato con animales)'],fac:{orden:-15,concejo:-5,sombra:5},bon:{animal:-2,decep:1},hpl:0,flags:{fireres:1},
 lin:[['abisal','Abisal','Truco: Rociada venenosa. Resistencia al veneno.'],['ctonico','Ctónico','Truco: Toque helado. Resistencia necrótica.'],['infernal','Infernal','Truco: Rayo de fuego. Resistencia al fuego extra.']],d:'Marcados por un pasado infernal; muchos encuentran hogar en el Raval.'}
};

const CLASSES={
barbarian:{n:'Bárbaro',hd:12,sv:['str','con'],skN:2,sk:['animal','athl','intim','nature','percep','survival'],arm:'Ligeras, medias y escudos',caster:null,spAb:null,pros:['Furia: más daño y resistencia','Defensa sin armadura (10+DES+CON)','Dado de golpe d12'],cons:['No lanza conjuros','Pocas habilidades sociales'],eq:['hacha_grande','hacha_mano','pieles','botas','pantalon'],gold:15,sig:['rage'],d:'Guerrero primigenio que canaliza su furia.'},
bard:{n:'Bardo',hd:8,sv:['dex','cha'],skN:3,sk:SKILLS.map(s=>s.id),arm:'Ligeras',caster:'full',spAb:'cha',pros:['Inspiración de bardo','Conjuros de Carisma','Experto en dos habilidades','Polifacético'],cons:['Solo armadura ligera','PG moderados'],eq:['estoque','daga','armadura_cuero','laud','sombrero_pluma','botas'],gold:20,sig:['inspire'],spells:['burla','curewounds','sleep'],d:'Cantor, cuentacuentos y diplomático con magia.'},
cleric:{n:'Clérigo',hd:8,sv:['wis','cha'],skN:2,sk:['hist','insight','medic','persu','relig'],arm:'Ligeras, medias y escudos',caster:'full',spAb:'wis',pros:['Conjuros divinos (Sabiduría)','Canalizar divinidad','Armadura media y escudo'],cons:['Atado a su fe: el Concejo y la Orden esperan comportamiento ejemplar','Ataque físico modesto'],eq:['maza','escudo','camisote_malla','amuleto','botas'],gold:15,sig:['turn'],spells:['sacredflame','curewounds','bless'],d:'Sacerdote armado que sana y castiga con poder divino.'},
druid:{n:'Druida',hd:8,sv:['int','wis'],skN:2,sk:['arcana','animal','insight','medic','nature','percep','relig','survival'],arm:'Ligeras y escudos (sin metal)',caster:'full',spAb:'wis',pros:['Conjuros de la naturaleza','Forma salvaje','Trato con bestias'],cons:['No usa armadura metálica','Mal visto en las ciudades amuralladas (−5 Concejo)'],eq:['baston','armadura_cuero','gorro','botas'],gold:10,sig:['wild'],spells:['zarzas','curewounds','thunderwave'],d:'Guardián de bosques y bestias.'},
fighter:{n:'Guerrero',hd:10,sv:['str','con'],skN:2,sk:['acro','animal','athl','hist','insight','intim','percep','survival'],arm:'Todas las armaduras y escudos',caster:null,spAb:null,pros:['Tomar aliento (curación en combate)','Oleada de acción (nivel 2)','Todas las armaduras'],cons:['Sin magia','Pocas herramientas fuera del combate'],eq:['espada_larga','escudo','cota_malla','ballesta','botas'],gold:15,sig:['secondwind'],d:'Maestro de armas y tácticas.'},
monk:{n:'Monje',hd:8,sv:['str','dex'],skN:2,sk:['acro','athl','hist','insight','relig','stealth'],arm:'Ninguna',caster:null,spAb:null,pros:['Artes marciales (d6 desarmado)','Defensa sin armadura (10+DES+SAB)','Ráfaga de golpes'],cons:['Sin armadura ni escudo','Pierde beneficios si se equipa pesado'],eq:['baston','tunica','sandalias'],gold:5,sig:['flurry'],d:'Disciplina del cuerpo y de la mente.'},
paladin:{n:'Paladín',hd:10,sv:['wis','cha'],skN:2,sk:['athl','insight','intim','medic','persu','relig'],arm:'Todas las armaduras y escudos',caster:'half',spAb:'cha',pros:['Imposición de manos','Castigo divino','Todas las armaduras'],cons:['Un juramento: las acciones deshonrosas le pesan','Conjuros desde nivel 2'],eq:['espada_larga','escudo','cota_malla','amuleto','botas'],gold:15,sig:['layhands','smite'],spells:['bless','curewounds'],d:'Caballero sagrado con juramento.'},
ranger:{n:'Explorador',hd:10,sv:['str','dex'],skN:3,sk:['animal','athl','insight','invest','nature','percep','stealth','survival'],arm:'Ligeras, medias y escudos',caster:'half',spAb:'wis',pros:['Marca del cazador','Experto en rastreo y supervivencia','Arco y espada'],cons:['Conjuros desde nivel 2','Incómodo entre multitudes'],eq:['arco_largo','espada_corta','cuero_tachonado','capa_viaje','botas_altas'],gold:12,sig:['huntersmark'],spells:['curewounds'],d:'Cazador y guía de la espesura.'},
rogue:{n:'Pícaro',hd:8,sv:['dex','int'],skN:4,sk:['acro','athl','decep','insight','intim','invest','percep','perf','persu','sleight','stealth'],arm:'Ligeras',caster:null,spAb:null,pros:['Ataque furtivo','Pericia en dos habilidades','Acción astuta'],cons:['Pocos PG','Mala fama: la Guardia lo vigila'],eq:['estoque','daga','armadura_cuero','capucha','botas'],gold:15,sig:['sneak','cunning'],d:'Sigilo, astucia y golpes certeros.'},
sorcerer:{n:'Hechicero',hd:6,sv:['con','cha'],skN:2,sk:['arcana','decep','insight','intim','persu','relig'],arm:'Ninguna',caster:'full',spAb:'cha',pros:['Magia innata (Carisma)','Rayo de fuego y dardo mágico','Más conjuros por descanso'],cons:['Dado de golpe d6','Sin armadura'],eq:['daga','tunica_ropaje','sandalias'],gold:15,sig:[],spells:['firebolt','magicmissile','shield'],d:'Magia que corre por su sangre.'},
warlock:{n:'Brujo',hd:8,sv:['wis','cha'],skN:2,sk:['arcana','decep','hist','intim','invest','nature','relig'],arm:'Ligeras',caster:'pact',spAb:'cha',pros:['Explosión sobrenatural','Maleficio','Espacios que se recuperan al descansar'],cons:['Pocos espacios de conjuro','Su patrón exige favores'],eq:['daga','armadura_cuero','capucha','botas','amuleto'],gold:12,sig:[],spells:['eldritch','hex','burla'],d:'Poder obtenido de un pacto.'},
wizard:{n:'Mago',hd:6,sv:['int','wis'],skN:2,sk:['arcana','hist','insight','invest','medic','nature','relig'],arm:'Ninguna',caster:'full',spAb:'int',pros:['Libro de conjuros','Recuperación arcana','Mejor lista de conjuros'],cons:['Dado de golpe d6','Sin armadura','Frágil en combate'],eq:['baston','tunica_ropaje','libro','sombrero','sandalias'],gold:20,sig:[],spells:['firebolt','magicmissile','shield','sleep'],d:'Estudioso de las artes arcanas.'}
};
function slotsFor(cls,lvl){const c=CLASSES[cls].caster;if(!c)return 0;if(c==='full')return[2,3,4,5,6,7,8,9,10,11][lvl-1];if(c==='half')return lvl<2?0:[2,2,3,3,4,4,5,5,6][lvl-2];if(c==='pact')return[1,2,2,2,2,3,3,3,3,4][lvl-1];return 0}

const BACKGROUNDS={
acolyte:{n:'Acólito',ab:['int','wis','cha'],feat:'magicinit_c',sk:['insight','relig'],tool:null,eq:['tunica','sandalias'],gold:15,fac:{orden:12,concejo:2},d:'Serviste en una capilla de Barcino o en el monasterio.'},
artisan:{n:'Artesano',ab:['str','dex','int'],feat:'crafter',sk:['invest','persu'],tool:'smith',eq:['tunica','botas'],gold:25,fac:{artesanos:12},d:'Aprendiste un oficio en los talleres del Raval.'},
charlatan:{n:'Charlatán',ab:['dex','con','cha'],feat:'skilled',sk:['decep','sleight'],tool:'thief',eq:['tunica_fina','zapatos'],gold:15,fac:{sombra:6,mercaderes:3},d:'Vivías de tu labia y de cuentos bien contados.'},
criminal:{n:'Criminal',ab:['dex','con','int'],feat:'alert',sk:['sleight','stealth'],tool:'thief',eq:['tunica','capucha','botas'],gold:15,fac:{sombra:12,concejo:-8},d:'Los callejones del Raval te conocen por otro nombre.'},
entertainer:{n:'Artista',ab:['str','dex','cha'],feat:'musician',sk:['acro','perf'],tool:null,eq:['tunica_fina','laud','zapatos'],gold:15,fac:{castellers:8},d:'Actuaste en tabernas, plazas y fiestas mayores.'},
farmer:{n:'Granjero',ab:['str','con','wis'],feat:'tough',sk:['animal','nature'],tool:'carp',eq:['tunica','sombrero_ala','botas'],gold:12,fac:{circulo:4},d:'Naciste entre bancales de vid y olivos.'},
guard:{n:'Guardia',ab:['str','int','wis'],feat:'alert',sk:['athl','percep'],tool:null,eq:['tunica','botas','lanza'],gold:12,fac:{concejo:12},d:'Patrullaste las murallas de Barcino.'},
guide:{n:'Guía',ab:['dex','con','wis'],feat:'magicinit_d',sk:['stealth','survival'],tool:null,eq:['capa_viaje','botas_altas'],gold:10,fac:{circulo:10},d:'Conoces los senderos de Collserola como tu mano.'},
hermit:{n:'Ermitaño',ab:['con','wis','cha'],feat:'healer',sk:['medic','relig'],tool:'herb',eq:['tunica','sandalias'],gold:8,fac:{orden:6,circulo:6},d:'Pasaste años solo en una cueva de la montaña.'},
merchant:{n:'Mercader',ab:['con','int','cha'],feat:'lucky',sk:['animal','persu'],tool:null,eq:['tunica_fina','zapatos','sombrero_ala'],gold:30,fac:{mercaderes:12},d:'Recorriste ferias llevando mercancías.'},
noble:{n:'Noble',ab:['str','int','cha'],feat:'skilled',sk:['hist','persu'],tool:null,eq:['tunica_noble','zapatos','anillo'],gold:60,fac:{concejo:10,mercaderes:4},d:'Tu familia tiene casa en el Barri Gòtic.'},
sailor:{n:'Marinero',ab:['str','dex','wis'],feat:'tavern',sk:['acro','percep'],tool:null,eq:['tunica','botas','daga'],gold:15,fac:{mercaderes:3,sombra:3},d:'Faenaste en el Port Vell entre redes y borrascas.'},
scribe:{n:'Escriba',ab:['dex','int','wis'],feat:'skilled',sk:['invest','percep'],tool:null,eq:['tunica','libro','zapatos'],gold:20,fac:{orden:4,concejo:4},d:'Copiaste manuscritos en el Scriptorium.'},
sage:{n:'Sabio',ab:['con','int','wis'],feat:'magicinit_w',sk:['arcana','hist'],tool:null,eq:['tunica_ropaje','libro','zapatos'],gold:15,fac:{orden:5,concejo:3},d:'Estudiaste en el Colegio de Arcanos.'},
soldier:{n:'Soldado',ab:['str','dex','con'],feat:'savage',sk:['athl','intim'],tool:null,eq:['tunica','botas','espada_corta'],gold:15,fac:{concejo:6},d:'Luchaste en las compañías del vizcondado.'},
wayfarer:{n:'Viajero',ab:['dex','wis','cha'],feat:'lucky',sk:['insight','stealth'],tool:'thief',eq:['capa_viaje','botas_altas'],gold:12,fac:{},d:'Creciste en caminos, sin raíces ni hogar.'},
casteller:{n:'Casteller',ab:['str','con','cha'],feat:'tough',sk:['athl','persu'],tool:null,eq:['tunica','botas'],gold:12,fac:{castellers:14,concejo:4},d:'Subiste a lo alto de las torres humanas de la Mercè.'}
};

const FEATS={
alert:{n:'Alerta',o:1,d:'Sumas tu bonificador de competencia a la iniciativa y no te sorprenden fácilmente.'},
crafter:{n:'Artesano (dote)',o:1,d:'Tus creaciones salen un poco mejor (+1 a la tirada de fabricación) y trabajas un 20% más rápido.'},
healer:{n:'Sanador',o:1,d:'Las pociones y vendajes que usas curan más (+1d4+competencia) y tu Medicina es más fiable.'},
lucky:{n:'Afortunado',o:1,d:'Tienes 3 puntos de suerte al día: puedes repetir una tirada fallida.'},
magicinit_c:{n:'Iniciado en la magia (clérigo)',o:1,d:'Aprendes Llama sagrada y Curar heridas (1 vez al día).',sp:['sacredflame','curewounds']},
magicinit_d:{n:'Iniciado en la magia (druida)',o:1,d:'Aprendes Zarzas y Curar heridas (1 vez al día).',sp:['zarzas','curewounds']},
magicinit_w:{n:'Iniciado en la magia (mago)',o:1,d:'Aprendes Rayo de fuego y Dardo mágico (1 vez al día).',sp:['firebolt','magicmissile']},
musician:{n:'Músico',o:1,d:'Actuar en tabernas rinde más y puede darte Inspiración heroica.'},
savage:{n:'Atacante salvaje',o:1,d:'Una vez por combate repites los dados de daño de tu arma.'},
skilled:{n:'Habilidoso',o:1,d:'Ganas competencia en tres habilidades a tu elección.'},
tavern:{n:'Pendenciero',o:1,d:'Tus puños hacen 1d4+FUE y ganas ventaja en peleas de taberna.'},
tough:{n:'Duro de pelar',o:1,d:'Ganas 2 puntos de golpe extra por nivel.'},
actor:{n:'Actor',o:0,d:'+1 CAR. Ventaja en Engaño e Interpretación al hacerte pasar por otro.',ab:['cha']},
athlete:{n:'Atleta',o:0,d:'+1 FUE o DES. Ventaja en Atletismo para trepar y saltar.',ab:['str','dex']},
observant:{n:'Observador',o:0,d:'+1 INT o SAB. +5 a Percepción e Investigación pasivas.',ab:['int','wis']},
skillexpert:{n:'Experto en habilidades',o:0,d:'+1 a una característica y pericia (doble competencia) en una habilidad.',ab:AB},
resilient:{n:'Resistente',o:0,d:'+1 a una característica y competencia en su salvación.',ab:AB},
inspiring:{n:'Líder inspirador',o:0,d:'+1 SAB o CAR. Ventaja en Persuasión ante grupos.',ab:['wis','cha']},
sharpshooter:{n:'Tirador certero',o:0,d:'+1 DES. +2 al daño con armas a distancia.',ab:['dex']},
gwm:{n:'Maestro de armas',o:0,d:'+1 FUE. +2 al daño con armas de dos manos.',ab:['str']}
};

const SPELLS={
firebolt:{n:'Rayo de fuego',lvl:0,t:'atk',dmg:'1d10',dt:'fuego',d:'Proyectil ígneo (ataque de conjuro).'},
eldritch:{n:'Explosión sobrenatural',lvl:0,t:'atk',dmg:'1d10',dt:'fuerza',d:'Rayo de energía arcana.'},
sacredflame:{n:'Llama sagrada',lvl:0,t:'save',sv:'dex',dmg:'1d8',dt:'radiante',d:'Luz divina que cae sobre el objetivo (salv. DES).'},
burla:{n:'Burla cruel',lvl:0,t:'save',sv:'wis',dmg:'1d6',dt:'psíquico',d:'Insultos mágicos; el objetivo tendrá desventaja en su próximo ataque.',fx:'dis'},
zarzas:{n:'Látigo de zarzas',lvl:0,t:'atk',dmg:'1d6',dt:'perforante',d:'Una liana espinosa golpea al objetivo.'},
magicmissile:{n:'Dardo mágico',lvl:1,t:'auto',dmg:'3d4+3',dt:'fuerza',d:'Tres dardos que nunca fallan.'},
curewounds:{n:'Curar heridas',lvl:1,t:'heal',dmg:'2d8',d:'Restauras puntos de golpe al tocar.'},
sleep:{n:'Sueño',lvl:1,t:'sleep',d:'Hace dormir a criaturas con pocos puntos de golpe.'},
thunderwave:{n:'Ola atronadora',lvl:1,t:'save',sv:'con',dmg:'2d8',dt:'trueno',half:1,d:'Estruendo que golpea a los enemigos (salv. CON).'},
shield:{n:'Escudo',lvl:1,t:'buff',fx:'shield',d:'+5 CA hasta tu siguiente turno.'},
bless:{n:'Bendición',lvl:1,t:'buff',fx:'bless',d:'+1d4 a tus ataques durante 3 turnos.'},
hex:{n:'Maleficio',lvl:1,t:'buff',fx:'hex',d:'+1d6 de daño necrótico a cada golpe sobre un objetivo marcado.'}
};
function spellDC(){return 8+pbOf(G.pc.level)+abMod(CLASSES[G.pc.cls].spAb||'int')}
function spellAtk(){return pbOf(G.pc.level)+abMod(CLASSES[G.pc.cls].spAb||'int')}
