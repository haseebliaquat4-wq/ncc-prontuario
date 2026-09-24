/* passaggi del quiz a tempo reale: cosa c'e' davvero al centro dello schermo, fotogramma per fotogramma */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];
(async()=>{
  const b=await launch();const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();await ctx.addInitScript(s=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(s.routes));localStorage.setItem('coords',JSON.stringify(s.coords));localStorage.setItem('ob1','true');localStorage.setItem('antiFretta','false');}},s);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(6000);
  await p.addScriptTag({content:`window.__vedo=function(){var e=document.elementFromPoint(195,420);var c=e;
    while(c&&c!==document.body){if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='popOv')return 'popup';
      if(c.id==='quizApp'){return 'quiz:'+qCurView;}if(c.id==='homeScreen')return 'home';c=c.parentElement;}
    var t=document.getElementById('topoScreen')||document.getElementById('map');return 'altro('+(e?(e.id||e.className||e.tagName):'-')+')';};`});
  const film=async(nome,dur,atteso)=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,25));}
    console.log(nome.padEnd(22),seq.join(' → '));const ok=atteso(seq);if(!ok)fails.push(nome+': '+seq.join(' → '));};
  const riga=t=>p.evaluate(t=>{const r=[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>x.textContent.indexOf(t)>=0);r.click();},t);
  const soloBuoni=(seq,fine)=>seq.every(x=>/^pagina:quiz$|^quiz:(run|topics|result)$|^popup$/.test(x))&&fine.test(seq[seq.length-1]);
  // 1 simulazione dalla pagina
  await p.evaluate(()=>nccSez('quiz'));await p.waitForTimeout(800);
  await riga('Simulazione');await film('simulazione',1400,q=>soloBuoni(q,/quiz:run/));
  // 2 esco con conferma: torna la pagina
  await p.evaluate(()=>qConfirmExit());await p.waitForTimeout(400);await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');if(b)b.click();});
  await film('esci',900,q=>soloBuoni(q.filter(x=>x!=='popup'),/pagina:quiz/));
  // 3 allenati per argomento: si scelgono i temi
  await p.waitForTimeout(500);await riga('Allenati per argomento');await film('argomenti',1200,q=>soloBuoni(q,/quiz:topics/));
  const top=await p.evaluate(()=>{const c=document.querySelectorAll('#qTopics .qtop-row');if(c[0])c[0].click();if(c[2])c[2].click();
    return {n:c.length,sel:Object.keys(qSel||{}).filter(k=>qSel[k]).length,acceso:document.querySelectorAll('#qTopics .qtop-row.sel').length};});
  await p.evaluate(()=>{const g=document.getElementById('qTopGo');if(g&&!g.disabled)g.click();});await film('argomenti scelti',1000,q=>q[q.length-1]==='quiz:run');
  await p.evaluate(()=>{qConfirmExit();});await p.waitForTimeout(400);await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');if(b)b.click();});await p.waitForTimeout(800);
  await riga('Allenati per argomento');await p.waitForTimeout(1200);
  console.log('argomenti cliccabili',JSON.stringify(top));if(!top.n||top.sel<2||top.acceso<2)fails.push('argomenti non selezionabili '+JSON.stringify(top));
  await p.evaluate(()=>qNavBack());await film('indietro argomenti',900,q=>soloBuoni(q,/pagina:quiz/));
  // 4 ripasso errori senza errori: si resta sulla pagina
  await p.evaluate(()=>{qtStats.err={};});await p.waitForTimeout(300);await riga('Ripasso errori');await film('niente da ripassare',2600,q=>q.every(x=>x==='pagina:quiz'));
  // 5 ripasso con popup: Non ora → pagina
  await p.evaluate(()=>{buildQuiz();QUIZ_ALL.slice(0,12).forEach(it=>{qtStats.err[it.id]={box:1,due:Date.now()-5000};});});await p.waitForTimeout(200);
  await riga('Ripasso errori');await p.waitForTimeout(1600);await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="1"]');if(b)b.click();});
  await film('popup non ora',2400,q=>q.every(x=>/pagina:quiz|popup/.test(x))&&/pagina:quiz/.test(q[q.length-1]));
  // 6 coach dalla home: openQuiz + partenza ritardata
  await p.evaluate(()=>{nccSezChiudi(true);goHome();});await p.waitForTimeout(500);
  await p.evaluate(()=>{openQuiz();setTimeout(function(){qStartCat('geo');},250);});await film('coach dalla home',1200,q=>q.every(x=>/^home$|^quiz:run$/.test(x))&&q[q.length-1]==='quiz:run');
  const stato=await p.evaluate(()=>({home:getComputedStyle(document.getElementById('homeScreen')).display}));
  await p.evaluate(()=>{qConfirmExit();});await p.waitForTimeout(400);await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');if(b)b.click();});await p.waitForTimeout(800);
  await p.evaluate(()=>nccSezChiudi());await p.waitForTimeout(600);
  const fine=await p.evaluate(()=>__vedo());console.log('dopo ‹ dalla pagina:',fine);if(fine!=='home')fails.push('‹ dalla pagina non mostra la home: '+fine);
  errs.forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(f=>console.log(' - '+f));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
