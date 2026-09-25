/* GIRO DI NORME E TARIFFE, fotogramma per fotogramma, a tempo reale.
   Per ogni riga della pagina Norme: tocco, filmo cosa c'e' al centro dello schermo ogni ~30 ms,
   poi premo il tasto indietro visibile (o quello del telefono) e guardo dove torno. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];
(async()=>{
  const b=await launch();const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true,isMobile:true});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();await ctx.addInitScript(s=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(s.routes));localStorage.setItem('coords',JSON.stringify(s.coords));localStorage.setItem('ob1','true');}},s);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(6000);
  /* cosa c'e' davvero al centro: il primo antenato fisso con un id, oppure la home o la mappa */
  await p.addScriptTag({content:`window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
    while(c&&c!==document.body){var cs=getComputedStyle(c);if(c.id&&(cs.position==='fixed'||c.id==='homeScreen'||c.id==='map'||c.id==='panel')){
      if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='addModal')return 'editor';return c.id;}c=c.parentElement;}
    return document.body.classList.contains('on-topo')?'topografia':'vuoto('+(e?(e.id||e.tagName):'-')+')';};`});
  const film=async dur=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;};
  const home=async()=>{await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}try{['scnOv','popOv','nmOv','rgOv'].forEach(i=>{const x=document.getElementById(i);if(x)x.remove();});}catch(e){}try{closeQuiz();}catch(e){}goHome();});await p.waitForTimeout(700);};
  await home();await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(800);
  const righe=await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].map(r=>r.querySelector('.qc-lt b').textContent.trim()));
  console.log('righe Norme:',righe.join(' | '));
  for(const nome of righe){
    await home();await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(800);
    await p.evaluate(n=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()===n).click(),nome);
    const va=await film(1600);
    await p.waitForTimeout(2600);
    /* indietro: il tasto ‹ visibile in alto a sinistra, se c'e'; altrimenti quello del telefono */
    const come=await p.evaluate(()=>{const e=document.elementFromPoint(34,52);const btn=e&&e.closest('button');
      if(btn&&!btn.closest('#scnOv')){btn.click();return 'tasto ‹ ('+(btn.id||btn.className||'').toString().slice(0,24)+')';}
      if(document.getElementById('addModal').classList.contains('open')){document.querySelector('#addModal .mhdr-close').click();return 'chiudi editor (×)';}history.back();return 'indietro del telefono';});
    await new Promise(r=>setTimeout(r,120));const torna=await film(1100);
    const fine=torna[torna.length-1];
    console.log(('» '+nome).padEnd(24),va.join(' → '),'|',come,'→',torna.join(' → '));
    if(va.some(x=>/^vuoto/.test(x)||x==='homeScreen'))fails.push(nome+': schermo vuoto o Home di passaggio entrando ('+va.join(' → ')+')');
    if(va[va.length-1]==='pagina:norme')fails.push(nome+': non apre niente');
    if(torna.some(x=>/^vuoto/.test(x)||x==='homeScreen'))fails.push(nome+': schermo vuoto o Home di passaggio tornando ('+torna.join(' → ')+')');
    if(fine!=='pagina:norme')fails.push(nome+': indietro non torna alla pagina Norme ma a '+fine);
  }
  await home();await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(800);
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>/articoli/i.test(r.textContent)).click());await p.waitForTimeout(1500);
  const art=await p.evaluate(()=>{const c=[...document.querySelectorAll('#nmOv [onclick]')].find(x=>!x.closest('.nm-hd'));if(c)c.click();return !!c;});await p.waitForTimeout(800);
  await p.evaluate(()=>document.querySelector('#nmOv .nm-x').click());const f1=await film(900);
  await p.evaluate(()=>{const x=document.querySelector('#nmOv .nm-x');if(x)x.click();});const f2=await film(900);
  console.log('articolo → ‹ → ‹',art,f1.join(' → '),'|',f2.join(' → '));
  if(f1[f1.length-1]!=='nmOv')fails.push('dall\u2019articolo ‹ non torna all\u2019indice');if(f2[f2.length-1]!=='pagina:norme')fails.push('dall\u2019indice ‹ non torna alla pagina');
  errs.forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(f=>console.log(' - '+f));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
