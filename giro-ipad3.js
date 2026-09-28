/* IPAD, FASE 3, a tempo reale.
   · Norme sull'iPad in orizzontale: elenco a sinistra, articolo a destra; ogni voce a sinistra
     cambia solo la destra (niente schermi vuoti o Home di passaggio); il quiz sulle norme con i
     tasti 1-4; un articolo toccato mentre il quiz aspetta resta li'; girando l'iPad una colonna
     sola e poi di nuovo due; ‹ torna da dove sei venuto (Home o pagina Norme). Telefono invariato.
   · Quiz in orizzontale: domanda a sinistra, risposte a destra; con la tastiera la risposta
     sbagliata mostra il perche' e il tasto dopo lo sceglie. In verticale le risposte subito sotto.
   · Home in verticale: riquadri grandi, tutto in uno schermo.
   · Split View: a ogni larghezza (320-1024) niente scorre di lato. */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const VEDO=`window.__vedo=function(x,y){var e=document.elementFromPoint(x,y),c=e;
  while(c&&c!==document.body){if(c.id==='nmOv')return c.classList.contains('nm-due')?'norme2':'norme';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');
    if(c.id==='popOv')return 'popup';if(c.id==='quizApp')return 'quiz';if(c.id==='homeScreen')return 'home';c=c.parentElement;}
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};`;
async function film(p,dur,x,y){const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(([x,y])=>__vedo(x,y),[x,y]);if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;}
(async()=>{
  const b=await launch();
  /* ════ 1 · Norme sull'iPad in orizzontale ════ */
  let {page:p,ctx,errors}=await boot(b,{clock:false,viewport:{width:1180,height:820},touch:true,extra:{antiFretta:'false',wkRepTs:String(Date.now())}});
  await p.addScriptTag({content:VEDO});
  await p.evaluate(()=>openNorme());let f=await film(p,900,900,400);
  const aperta=await p.evaluate(()=>{const o=document.getElementById('nmOv');const sx=o.querySelector('.nm-sx'),dx=o.querySelector('.nm-dx');
    return {due:o.classList.contains('nm-due'),sx:sx?Math.round(sx.getBoundingClientRect().width):0,dx:dx?(dx.querySelector('.nm-ti')||{}).textContent:null,
      on:[...o.querySelectorAll('.nm-sx .on')].length,indietroDx:dx?getComputedStyle(dx.querySelector('.nm-x')).display:null};});
  console.log('Norme aperte',f.join(' → '),JSON.stringify(aperta));
  ok(aperta.due&&aperta.sx>=300&&/^Art\./.test(aperta.dx||'')&&aperta.on===1,'Norme: all’apertura non ci sono elenco e articolo affiancati '+JSON.stringify(aperta));
  ok(aperta.indietroDx==='none','Norme: a destra resta il tasto ‹ che non serve');
  /* ogni voce a sinistra: cambia solo la destra */
  const voci=await p.evaluate(()=>[...document.querySelectorAll('#nmOv .nm-sx .nm-row,#nmOv .nm-sx .nm-go2')].map(x=>({t:x.textContent.trim().replace(/\s+/g,' ').slice(0,28),oc:x.getAttribute('onclick')})));
  for(const v of voci){
    await p.evaluate(oc=>[...document.querySelectorAll('#nmOv .nm-sx [onclick]')].find(x=>x.getAttribute('onclick')===oc).click(),v.oc);
    const g=await film(p,500,900,400),sx=await film(p,120,180,500);
    const st=await p.evaluate(oc=>{const o=document.getElementById('nmOv');const b=[...o.querySelectorAll('.nm-sx [onclick]')].find(x=>x.getAttribute('onclick')===oc);
      return {dx:(o.querySelector('.nm-dx .nm-ti')||{}).textContent,on:b?b.classList.contains('on'):null,tutte:[...o.querySelectorAll('.nm-sx .on')].length};},v.oc);
    if(g.some(x=>x!=='norme2')||sx.some(x=>x!=='norme2'))fails.push('Norme, '+v.t+': schermo di passaggio '+g.join(' → '));
    if(st.on!==true||st.tutte!==1)fails.push('Norme, '+v.t+': a sinistra non si accende la voce aperta '+JSON.stringify(st));
    console.log('  ·',v.t.padEnd(30),'→ a destra',st.dx);
  }
  /* il quiz sulle norme con la tastiera, e un articolo toccato mentre aspetta la domanda dopo */
  await p.evaluate(()=>document.querySelector('#nmOv .nm-sx .nm-go').click());await p.waitForTimeout(500);
  const q0=await p.evaluate(()=>(document.querySelector('#nmOv .nm-dx .nm-su')||{}).textContent);
  await p.keyboard.press('1');await p.waitForTimeout(150);
  const risp=await p.evaluate(()=>({dis:[...document.querySelectorAll('#nmOv .nm-o')].every(x=>x.disabled),good:document.querySelectorAll('#nmOv .nm-o.good').length}));
  ok(risp.dis&&risp.good===1,'quiz norme: il tasto 1 non risponde '+JSON.stringify(risp));
  await p.evaluate(()=>document.querySelectorAll('#nmOv .nm-sx .nm-row')[2].click());await p.waitForTimeout(1800);
  const dopo=await p.evaluate(()=>(document.querySelector('#nmOv .nm-dx .nm-ti')||{}).textContent);
  console.log('quiz norme:',q0,'| tasto 1 →',JSON.stringify(risp),'| articolo toccato a meta’: a destra',dopo);
  ok(/^Art\./.test(dopo||''),'quiz norme: la domanda dopo copre l’articolo toccato ('+dopo+')');
  /* girando l'iPad */
  await p.setViewportSize({width:820,height:1180});await p.waitForTimeout(700);
  const v1=await p.evaluate(()=>{const o=document.getElementById('nmOv');return {due:o.classList.contains('nm-due'),ti:(o.querySelector('.nm-ti')||{}).textContent,x:getComputedStyle(o.querySelector('.nm-x')).display};});
  ok(!v1.due&&/^Art\./.test(v1.ti)&&v1.x!=='none','Norme in verticale: non resta l’articolo da solo col suo ‹ '+JSON.stringify(v1));
  await p.evaluate(()=>document.querySelector('#nmOv .nm-x').click());await p.waitForTimeout(500);
  const v2=await p.evaluate(()=>!!document.querySelector('#nmOv .nm-list'));ok(v2,'Norme in verticale: ‹ dall’articolo non torna all’elenco');
  await p.setViewportSize({width:1180,height:820});await p.waitForTimeout(700);
  const v3=await p.evaluate(()=>{const o=document.getElementById('nmOv');return {due:o.classList.contains('nm-due'),dx:(o.querySelector('.nm-dx .nm-ti')||{}).textContent};});
  console.log('girando: verticale',JSON.stringify(v1),'| ‹ elenco',v2,'| di nuovo orizzontale',JSON.stringify(v3));
  ok(v3.due&&/^Art\./.test(v3.dx||''),'Norme di nuovo in orizzontale: non tornano le due colonne '+JSON.stringify(v3));
  /* ‹ a sinistra: dalla Home si torna in Home */
  await p.evaluate(()=>document.querySelector('#nmOv .nm-sx .nm-x').click());f=await film(p,900,900,400);
  console.log('‹ dalle Norme (aperte dalla Home)',f.join(' → '));ok(f[f.length-1]==='home'&&!f.some(x=>/^vuoto/.test(x)),'Norme: ‹ non torna in Home ('+f.join(' → ')+')');
  /* dalla pagina Norme: la riga «Gli articoli», poi ‹ torna alla pagina */
  await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(900);
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>/articoli/i.test(r.textContent)).click());f=await film(p,1100,900,400);
  console.log('pagina Norme → Gli articoli',f.join(' → '));ok(f[f.length-1]==='norme2'&&!f.some(x=>/^vuoto|^home$/.test(x)),'pagina Norme → articoli: schermo sbagliato ('+f.join(' → ')+')');
  await p.evaluate(()=>document.querySelectorAll('#nmOv .nm-sx .nm-row')[1].click());await p.waitForTimeout(400);
  await p.evaluate(()=>document.querySelector('#nmOv .nm-sx .nm-x').click());f=await film(p,1100,900,400);
  console.log('‹ torna alla pagina',f.join(' → '));ok(f[f.length-1]==='pagina:norme'&&!f.some(x=>/^vuoto|^home$/.test(x)),'Norme: ‹ non torna alla pagina Norme ('+f.join(' → ')+')');
  /* il tasto indietro del telefono chiude le norme */
  await p.evaluate(()=>{try{nccSezChiudi(true);}catch(e){}try{goHome();}catch(e){}openNorme();});await p.waitForTimeout(700);
  await p.evaluate(()=>history.back());f=await film(p,900,900,400);console.log('indietro del telefono',f.join(' → '));
  ok(f[f.length-1]==='home','Norme: il tasto indietro non chiude le norme ('+f.join(' → ')+')');
  /* ════ 2 · quiz in orizzontale, con la tastiera ════ */
  await p.evaluate(()=>{window.__nccQuizOrigine='home';nccAvvio(function(){buildQuiz();qStartNew();});});await p.waitForTimeout(2000);
  const lay=await p.evaluate(()=>{const q=document.querySelector('#qRun .qrun-q').getBoundingClientRect(),a=document.getElementById('qRunAns').getBoundingClientRect();
    return {qR:Math.round(q.right),aL:Math.round(a.left),qT:Math.round(q.top),aT:Math.round(a.top),largo:document.getElementById('qRun').scrollWidth<=document.getElementById('qRun').clientWidth+1};});
  console.log('quiz orizzontale',JSON.stringify(lay));ok(lay.qR<=lay.aL&&lay.largo,'quiz in orizzontale: domanda e risposte non stanno affiancate '+JSON.stringify(lay));
  await p.screenshot({path:__dirname+'/ipad3-quiz.png'});
  const giusta=await p.evaluate(()=>Q.items[Q.idx].correct);
  await p.waitForTimeout(600);await p.keyboard.press(String(giusta+1));await p.waitForTimeout(1300);
  let st=await p.evaluate(()=>({i:Q.idx,ris:Q.ans[0]}));ok(st.i===1&&st.ris===giusta,'tastiera: la risposta giusta col tasto non va avanti '+JSON.stringify(st));
  const g2=await p.evaluate(()=>Q.items[Q.idx].correct),sbagliata=(g2+1)%3;
  await p.waitForTimeout(600);await p.keyboard.press(String(sbagliata+1));await p.waitForTimeout(400);
  st=await p.evaluate(()=>({i:Q.idx,bar:!!document.querySelector('#qRunAns .why-bar'),perche:JSON.stringify(qtStats.why||{})}));
  console.log('tastiera: sbagliata col tasto',sbagliata+1,JSON.stringify(st));
  ok(st.i===1&&st.bar&&st.perche==='{}','tastiera: il tasto della risposta sbagliata sceglie anche il perche’ o salta la pausa '+JSON.stringify(st));
  await p.keyboard.press('1');await p.waitForTimeout(600);
  st=await p.evaluate(()=>({i:Q.idx,perche:Object.keys(qtStats.why||{}).length}));
  ok(st.i===2&&st.perche===1,'tastiera: il tasto 1 non sceglie «Non la sapevo» o non va avanti '+JSON.stringify(st));
  await p.keyboard.press('ArrowLeft');await p.waitForTimeout(300);st=await p.evaluate(()=>Q.idx);ok(st===1,'tastiera: la freccia a sinistra non torna indietro');
  /* in verticale: le risposte subito sotto la domanda */
  await p.setViewportSize({width:820,height:1180});await p.waitForTimeout(600);
  const lv=await p.evaluate(()=>{const q=document.querySelector('#qRun .qrun-listen').getBoundingClientRect(),a=document.getElementById('qRunAns').getBoundingClientRect();return {buco:Math.round(a.top-q.bottom)};});
  console.log('quiz verticale: spazio fra domanda e risposte',lv.buco);ok(lv.buco<120,'quiz in verticale: troppo spazio fra domanda e risposte ('+lv.buco+')');
  await p.screenshot({path:__dirname+'/ipad3-quiz-verticale.png'});
  await p.evaluate(()=>{try{Q=null;renderDash();closeQuiz();goHome();}catch(e){}});await p.waitForTimeout(900);
  /* ════ 3 · Home in verticale ════ */
  const hv=await p.evaluate(()=>{const r=[...document.querySelectorAll('.hm-rq')].map(x=>x.getBoundingClientRect());const tb=document.getElementById('tabbar');
    return {h:Math.round(r[0].height),fondo:Math.round(Math.max(...r.map(x=>x.bottom))),barra:tb?Math.round(tb.getBoundingClientRect().top):null};});
  console.log('Home verticale',JSON.stringify(hv));ok(hv.h>=200&&hv.fondo<=hv.barra,'Home in verticale: riquadri piccoli o tagliati dalla barra '+JSON.stringify(hv));
  await p.screenshot({path:__dirname+'/ipad3-home.png'});
  errors.forEach(e=>fails.push('JS '+e));await ctx.close();
  /* ════ 4 · telefono: le norme restano una schermata alla volta ════ */
  ({page:p,ctx,errors}=await boot(b,{clock:false,viewport:{width:390,height:844},touch:true,mobile:true}));
  await p.evaluate(()=>openNorme());await p.waitForTimeout(700);
  const tel=await p.evaluate(()=>{const o=document.getElementById('nmOv');return {due:o.classList.contains('nm-due'),elenco:!!o.querySelector('.nm-list')};});
  await p.evaluate(()=>document.querySelector('#nmOv .nm-row').click());await p.waitForTimeout(400);
  const tel2=await p.evaluate(()=>{const o=document.getElementById('nmOv');return {elenco:!!o.querySelector('.nm-list'),x:(o.querySelector('.nm-x')||{}).getAttribute?o.querySelector('.nm-x').getAttribute('onclick'):null};});
  console.log('telefono: norme',JSON.stringify(tel),'→ articolo',JSON.stringify(tel2));
  ok(!tel.due&&tel.elenco&&!tel2.elenco&&tel2.x==='openNorme()','telefono: le norme non sono piu’ una schermata alla volta');
  errors.forEach(e=>fails.push('JS telefono '+e));await ctx.close();
  /* ════ 5 · Split View: niente scorre di lato ════ */
  for(const w of [320,375,507,594,678,694,768,810,980,1024]){
    const h=w<700?900:1024;({page:p,ctx,errors}=await boot(b,{clock:false,viewport:{width:w,height:h},touch:true,bootMs:5000}));
    const giri=[['home',()=>{}],['pagina Quiz',()=>nccSez('quiz')],['Profilo',()=>nccProfilo()],['Norme',()=>openNorme()],['Piazze',()=>openPiazze()],['Tariffe',()=>openRegole()],
      ['quiz',()=>{nccAvvio(function(){buildQuiz();qStartNew();});}]];
    const male=[];
    for(const [nome,fn] of giri){
      await p.evaluate(`(${fn.toString()})()`);await p.waitForTimeout(nome==='quiz'?1600:800);
      const r=await p.evaluate(()=>{const W=window.innerWidth,out=[];const d=document.scrollingElement;if(d.scrollWidth>W+1)out.push('pagina '+d.scrollWidth);
        ['scnOv','pfOv','nmOv','pzOv','rgOv','qRun','hmNew'].forEach(id=>{const e=document.getElementById(id);if(!e||!e.getClientRects().length)return;
          if(e.scrollWidth>e.clientWidth+1)out.push(id+' '+e.scrollWidth+'>'+e.clientWidth);
          e.querySelectorAll('.nm-body,.pf-body,.rg-body,.nm-sx,.nm-dx').forEach(c=>{if(c.scrollWidth>c.clientWidth+1)out.push(id+' '+c.className.split(' ')[0]+' '+c.scrollWidth+'>'+c.clientWidth);});});
        return out;});
      if(r.length)male.push(nome+': '+r.join(', '));
      await p.evaluate(()=>{try{if(typeof Q!=='undefined'&&Q){Q=null;renderDash();closeQuiz();}}catch(e){}try{nmChiudi();}catch(e){}try{nccRegoleChiudi(true);}catch(e){}try{pzChiudi();}catch(e){}
        try{nccSezChiudi(true);}catch(e){}try{nccProfiloChiudi&&nccProfiloChiudi(true);}catch(e){}try{goHome();}catch(e){}});await p.waitForTimeout(500);
    }
    console.log(('larghezza '+w).padEnd(16),male.length?male.join(' | '):'ok');
    male.forEach(x=>fails.push('Split View '+w+': scorre di lato in '+x));
    errors.forEach(e=>fails.push('JS '+w+' '+e));await ctx.close();
  }
  await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
