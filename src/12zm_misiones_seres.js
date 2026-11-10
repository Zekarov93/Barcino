// ===================== MISIONES PERSONALES CON SERES FANTÁSTICOS =====================
function folkKin(sp,z,d){try{for(const a of (G.fauna[z]||[]))if(a.alive&&!a.e&&a.sp===sp&&FOLK[sp]){const F=folkSt(a);F.fav=clamp(F.fav+d,-100,100)}}catch(e){}}
function mkFolkPQ(c){return{zone:n=>n.zone,night:c.night,hint:c.hint,gen:function*(S,n,q){
 const a=pqActor(S,n);const b=S.at('b',{name:c.name,cr:c.cr,coat:.5,ring:2,scale:c.scale||1},11,14);let ant=null;
 if(c.ant)ant=S.at('x',{name:c.ant.name,look:humanLook(c.ant.job,'m'),ring:2},12,14);
 yield S.walk(b,()=>({x:a.x,y:a.y}),0,{stop:1.8,spd:SC_WALK,timeout:20});S.face(a,b.x,b.y);
 yield S.say(b,c.line,2.8);if(ant){yield S.say(ant,c.antLine,2.6)}
 const opts=[];const has=c.item&&c.item.find(i=>invCount(G.pc.inv,i)>0);
 if(has)opts.push({l:c.itemL+' ('+(ITEMS[has]?ITEMS[has].n.toLowerCase():has)+')',v:'gift'});
 for(const o of c.opts)opts.push({l:o.l+' ['+o.skN+' CD '+o.dc+']',chk:1,run:()=>check(o.sk,o.dc).ok?'ok':'bad'});
 opts.push({l:c.fightL||'Enfrentarte',v:'fight',cls:'dark'});
 const ch=yield S.ask(c.ask(n),opts,c.title,c.icon);
 if(ch==='gift'){takeItem(has,1);folkKin(c.cr,n.zone,10);try{giveItem(c.reward,1,2)}catch(e){}yield S.say(b,c.okLine,2.4);if(ant)yield S.leave(ant);yield S.leave(b);pqEnd(n,q,true,c.okMsg,70);yield S.leave(a);return}
 if(ch==='ok'){folkKin(c.cr,n.zone,6);yield S.say(b,c.okLine,2.4);if(ant)yield S.leave(ant);yield S.leave(b);pqEnd(n,q,true,c.okMsg,70);yield S.leave(a);return}
 if(ch==='fight'||ch==='bad'){const fk={sp:c.cr,name:c.name,hp:CREAT[c.cr].hp,maxHp:CREAT[c.cr].hp,sex:'f',gn:{size:1,hard:1,spd:1,bold:.5,agr:.5,cur:.5,soc:.5,doc:.5,coat:.5},zone:n.zone,alive:true,id:'pq_'+n.id};
  const en=c.fightEnemies?c.fightEnemies():[animalCombatant(fk)];yield S.toPlayer([b],{timeout:10,rad:1.4});const r=yield S.fight([b],en,{});
  if(r==='won'){folkKin(c.cr,n.zone,-25);pqEnd(n,q,true,c.fightMsg,60)}else pqEnd(n,q,false,'');yield S.leave(a);return}
 pqEnd(n,q,false);yield S.leave([a,b])}}}
Object.assign(PQ,{
 deuda_dona:mkFolkPQ({cr:'dona_aigua',name:'Dona d\'aigua',night:1,hint:'La dona d\'aigua cobra sus deudas de noche, junto al agua.',item:['espejo','perla_sirena','lavanda'],itemL:'Ofrecerle un obsequio que la haga olvidar',reward:'cabello_agua',
  line:'Hace diez años me prometiste un hijo del río. Ha llegado el día.',ask:n=>'La dona d\'aigua exige a '+n.name+' lo que le debe. Ninguno de los dos se mueve.',title:'Una deuda de agua',icon:'💧',
  opts:[{l:'Rogar clemencia en su nombre',sk:'persu',skN:'Persuasión',dc:14},{l:'Ofrecerte como garante',sk:'relig',skN:'Religión',dc:13}],okLine:'Sea. El río es paciente. Pero recuerda quién ha hablado.',okMsg:'La dona d\'aigua perdona la deuda… esta vez.',fightMsg:'La dona d\'aigua se deshace en agua turbia. El río, durante días, huele a hierro.'}),
 amigo_follet:mkFolkPQ({cr:'follet',scale:1,name:'Follet',hint:'Un cazador de espíritus podría presentarse en su casa.',item:['leche_cabra','miel','pan'],itemL:'Dar al follet una ofrenda para que se esconda',reward:'polvo_follet',ant:{name:'Cazaespíritus',job:'sacerdote'},
  line:'¡Shhh! No dejes que me vea, amigo…',antLine:'Tengo noticia de un espíritu doméstico en esta casa. Debe ser expulsado.',ask:n=>'Un cazaespíritus quiere expulsar al follet de la casa de '+n.name+'.',title:'El huésped',icon:'🎩',
  opts:[{l:'Convencer al cazador de que se equivoca',sk:'persu',skN:'Persuasión',dc:13},{l:'Engañarlo con un falso exorcismo',sk:'decep',skN:'Engaño',dc:14}],okLine:'¡Gracias, gracias! Te debo un favor… ¡y una travesura!',okMsg:'El follet se queda, y '+'la casa nunca ha estado tan ordenada.',fightMsg:'El cazador huye. El follet no se atreve a salir en días.',fightEnemies:()=>[banditCombatant(1)],fightL:'Echar al cazador a golpes'}),
 canta_sirena:mkFolkPQ({cr:'sirena',name:'Sirena',night:1,hint:'Al novilunio, junto a la orilla, alguien más escucha.',item:['espejo','coral_rojo','ambar'],itemL:'Ofrecerle un regalo para que cante para ti',reward:'perla_sirena',ant:{name:'Pescador codicioso',job:'pescador'},
  line:'Hoy canto menos. Vienen con redes.',antLine:'Una sirena vale su peso en oro. La capturaremos al alba.',ask:n=>'Un pescador pretende capturar a la sirena que '+n.name+' escucha en secreto.',title:'La orilla',icon:'🧜',
  opts:[{l:'Disuadir al pescador con astucia',sk:'persu',skN:'Persuasión',dc:14},{l:'Intimidarlo',sk:'intim',skN:'Intimidación',dc:13}],okLine:'Eres amable, aunque sin canción. Toma esto.',okMsg:'La sirena se salva, y nadie vuelve a hablar de redes.',fightMsg:'Alejas al pescador a golpes. La sirena no vuelve a mostrarse en esa orilla.',fightEnemies:()=>[banditCombatant(1)],fightL:'Echar al pescador a golpes'}),
 ogro_amigo:mkFolkPQ({cr:'ogro',name:'Ogro',scale:1.3,hint:'Los vecinos podrían salir a cazar al ogro del monte.',item:['carne_jabali','carne_cordero','pan'],itemL:'Darle comida para que se aleje de la aldea',reward:'colmillo_ogro',ant:{name:'Cazador de monstruos',job:'cazador'},
  line:'Hombre pequeño… vienen con fuego. Yo no quiero hacer daño.',antLine:'Esa bestia merodea nuestros rebaños. Acabaremos con ella esta noche.',ask:n=>'Un grupo de cazadores va a por el ogro solitario que protege '+n.name+'.',title:'El gigante del monte',icon:'🪵',
  opts:[{l:'Convencer a los cazadores de que no es peligroso',sk:'persu',skN:'Persuasión',dc:15},{l:'Apelar a la fe de la gente',sk:'relig',skN:'Religión',dc:13}],okLine:'Gracias, hombre pequeño. Esta vez no olvidaré.',okMsg:'El ogro desaparece hacia lo alto del monte, sano y salvo.',fightMsg:'El gigante cae. El monte queda en silencio, y algo se rompe en tu pecho.',fightEnemies:()=>[animalCombatant({sp:'ogro',name:'Ogro',hp:CREAT.ogro.hp,maxHp:CREAT.ogro.hp,sex:'m',gn:{size:1,hard:1,spd:1,bold:.5,agr:.5,cur:.5,soc:.5,doc:.5,coat:.5},zone:G.zone,alive:true,id:'pq_o'})]}),
 pacto_trasgo:mkFolkPQ({cr:'trasgo',name:'Trasgo',hint:'La Guardia podría inspeccionar un almacén sospechoso.',item:['vino','cerveza','moneda_antigua'],itemL:'Distraer a la Guardia con un obsequio',reward:'polvo_follet',ant:{name:'Sargento de la Guardia',job:'guardia'},
  line:'Rápido, esconde el saco… ¡vienen los de las lanzas!',antLine:'Registro. Tenemos informes de un tráfico de botín de trasgos.',ask:n=>'La Guardia llega al almacén de '+n.name+'. El trasgo se ha escondido tras unos barriles.',title:'El registro',icon:'🕵',
  opts:[{l:'Convencer al sargento de que no hay nada',sk:'persu',skN:'Persuasión',dc:14},{l:'Distraerlo con una historia',sk:'decep',skN:'Engaño',dc:13}],okLine:'¡Chsss! Has salvado la banda. No lo olvidaré.',okMsg:'El registro termina en nada. El trasgo te regala un puñado de baratijas.',fightMsg:'La Guardia cae en la refriega. Habrá consecuencias.',fightEnemies:()=>[banditCombatant(2),banditCombatant(1)],fightL:'Atacar a la Guardia'})});
