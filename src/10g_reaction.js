// ===================== REACCIÓN AL HABLAR: cómo te ve y cómo está =====================
function reactionOf(n){const a=attitude(n),f=n.flags||{},R=[];const st=voiceOf(n);
 const body=a<=-40?['aprieta la mandíbula','te evita la mirada','se pone en guardia']:a<=-12?['cruza los brazos','te mira de reojo','responde con sequedad']:a<25?['te atiende con normalidad','te observa con calma','espera a oír qué quieres']:a<60?['sonríe al verte','se relaja','te hace sitio']:['se le ilumina la cara','te recibe como a un viejo amigo','te toma del brazo'];
 R.push({t:cap(n.name.split(' ')[0])+' '+body[vhash(n.id+Math.floor(G.t/1440))%body.length]+'.',c:a<=-12?'bad':a>=25?'ok':''});
 if(n.ill>0)R.push({t:'Está enfermo: tose y tiene mala cara.',c:'bad'});
 if(n.grief>G.t&&f.grief)R.push({t:'Está de luto por '+f.grief+'.',c:'bad'});
 if(f.avenger)R.push({t:'Ha jurado venganza: sospecha de ti.',c:'bad'});
 else if(f.grudge)R.push({t:'Guarda rencor: era amigo de '+f.grudge+'.',c:'bad'});
 if(f.fear>G.t)R.push({t:'Te teme.',c:'bad'});
 if(f.blackmailed)R.push({t:'Aún recuerda el chantaje.',c:'bad'});
 if(f.betrayed)R.push({t:'No olvida que lo delataste.',c:'bad'});
 if(f.kept)R.push({t:'Confía en ti: guardaste su secreto.',c:'ok'});
 if(f.goalDone)R.push({t:'Le ayudaste a cumplir su sueño: te lo agradece.',c:'ok'});
 if(n.mood<25)R.push({t:'Hoy está de muy mal humor.',c:'bad'});else if(n.mood>80)R.push({t:'Hoy está de excelente humor.',c:'ok'});
 if(G.infamy>=30&&n.tr.honest>=6)R.push({t:'Te conoce por tu mala fama.',c:'bad'});else if(G.fame>=30&&n.tr.curious>=5)R.push({t:'Sabe quién eres y te admira.',c:'ok'});
 if(G.bounty[n.zone]>0&&(n.job==='guardia'))R.push({t:'Sabe que hay recompensa por ti.',c:'bad'});
 if(G.story&&G.story.end){const k=stRole&&stRole('keeper');if(k===n)R.push(G.story.end==='paz'?{t:'Te agradece haber devuelto el huevo a la Víbria.',c:'ok'}:G.story.end==='codicia'?{t:'No te perdonará haberle robado el huevo.',c:'bad'}:{t:'Lamenta que el huevo haya dejado de latir.',c:'bad'})}
 const z=n.zone;const near=Object.values(G.npcs).filter(o=>o.alive&&!o.hidden&&o.zone===G.zone&&o!==n&&n.rel[o.id]&&Math.hypot(o.x-n.x,o.y-n.y)<7&&(Math.abs(n.rel[o.id].v)>=40||['conyuge','amante','enemigo','hijo','padre'].includes(n.rel[o.id].k))).slice(0,2);
 for(const o of near){const k=n.rel[o.id];R.push({t:(knows(n,'r:'+o.id)||o.met?'Cerca está '+o.name:'Cerca hay alguien')+' ('+relWordOf(n,o)+(knows(n,'r:'+o.id)?'':'?')+').',c:k.v<=-40?'bad':'ok'})}
 return R}
function reactionEl(n){const d=h('div',{class:'react'});reactionOf(n).forEach(r=>d.append(h('div',{class:'rl '+(r.c||'')},r.t)));return d}
