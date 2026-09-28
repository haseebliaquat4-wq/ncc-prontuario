/* GIRO DI STATISTICHE E PROFILO, fotogramma per fotogramma, a tempo reale.
   Statistiche: ogni tasto delle due schede (Panoramica, Argomenti): tocco, filmo cosa c'e' al centro
   ogni ~30 ms, poi indietro del telefono (o chiudo il popup) e guardo dove torno, con la scheda di prima.
   Profilo: ogni riga, e le righe che cancellano solo fino alla conferma. Poi il pannello della voce
   che non si riapre da solo e il report della domenica che esce solo sulla Home. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];
(async()=>{
  const b=await launch();const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true,isMobile:true});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();await ctx.addInitScript(s=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(s.routes));localStorage.setItem('coords',JSON.stringify(s.coords));localStorage.setItem('ob1','true');localStorage.setItem('wkRepTs',String(Date.now()));}},s);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(6000);
  /* cosa c'e' davvero al centro: il primo antenato fisso con un id, oppure la home o la mappa */
  await p.addScriptTag({content:`window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
    while(c&&c!==document.body){var cs=getComputedStyle(c);if(c.id&&(cs.position==='fixed'||c.id==='homeScreen'||c.id==='map'||c.id==='panel')){
      if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='addModal')return 'editor';return c.id;}c=c.parentElement;}
    return document.body.classList.contains('on-topo')?'topografia':'vuoto('+(e?(e.id||e.tagName):'-')+')';};`});
  const film=async dur=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>{const x=__vedo();
      return x==='homeScreen'?(document.getElementById('homeScreen').classList.contains('hm-stat')?'statistiche':'home'):x;});if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;};
  const errA=()=>{const e=errs.splice(0);e.forEach(x=>fails.push('JS '+x));};
  /* ── STATISTICHE: la pagina e ogni suo tasto ── */
  await p.evaluate(()=>{goHome();});await p.waitForTimeout(600);
  await p.evaluate(()=>[...document.querySelectorAll('#hmNew *')].find(x=>x.onclick&&/Statistiche/.test(x.textContent)&&x.textContent.length<80).click());
  let f=await film(1200);console.log('» Statistiche'.padEnd(26),f.join(' → '));if(f[f.length-1]!=='pagina:stat')fails.push('la tessera Statistiche non apre la pagina: '+f.join(' → '));
  const segna=()=>p.evaluate(()=>[...document.querySelectorAll('#scnOv [onclick]')].filter(e=>!e.closest('.t-hd')).map((e,i)=>{e.setAttribute('data-giro',i);
    return ((e.querySelector('b')||e).textContent||'').trim().replace(/\s+/g,' ').slice(0,26);}));
  const scheda=()=>p.evaluate(()=>{const t=document.querySelector('#scnOv .sx-tab.on');return t?t.textContent.trim():'';});
  /* le due schede: ogni tasto (in Argomenti bastano i primi due Allenati), la pagina riaperta sulla stessa scheda */
  for(const tab of ['pan','arg']){
    await p.evaluate(t=>{try{goHome();}catch(e){}nccStat();nccStatTab(t);},tab);await p.waitForTimeout(900);
    const tutti=await segna();const tasti=tab==='arg'?tutti.slice(0,4):tutti;const nomeTab=await scheda();
    console.log('tasti nella scheda '+nomeTab+':',tutti.length,tab==='arg'?'(provo i primi 4)':'');
    for(let k=0;k<tasti.length;k++){
      await p.evaluate(t=>{const s=document.getElementById('scnOv');if(!s||s.getAttribute('data-p')!=='stat'){try{goHome();}catch(e){}nccStat();}nccStatTab(t);},tab);await p.waitForTimeout(900);
      const lab=await segna();const nome=lab[k]||tasti[k];
      const ok=await p.evaluate(k=>{const e=document.querySelector('#scnOv [data-giro="'+k+'"]');if(!e)return false;e.click();return true;},k);if(!ok)continue;
      const g=await film(1300);const fine=g[g.length-1];let come='',t=[];
      if(fine!=='pagina:stat'){if(/popOv|popup/.test(fine)){await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});come='chiudo il popup';}
        else{await p.evaluate(()=>history.back());come='indietro del telefono';}
        await new Promise(r=>setTimeout(r,150));t=await film(1100);}
      console.log(('   · '+nome).padEnd(34),g.join(' → '),come?'| '+come+' → '+t.join(' → '):'');
      if(g.some(x=>/^vuoto|^home$/.test(x)))fails.push('Statistiche, '+nome+': schermo sbagliato '+g.join(' → '));
      if(g.includes('popOv')&&/quizApp/.test(fine))fails.push('Statistiche, '+nome+': il popup compare e sparisce');
      if(come&&t[t.length-1]!=='pagina:stat')fails.push('Statistiche, '+nome+': non si torna alla pagina ma a '+t[t.length-1]);
      if(come&&t[t.length-1]==='pagina:stat'){const sc=await scheda();if(sc!==nomeTab&&!/^(Panoramica|Argomenti)$/.test(nome))fails.push('Statistiche, '+nome+': si torna sulla scheda '+sc+' invece di '+nomeTab);}
      if(/quizApp/.test(t.join(' '))||/popOv/.test(t.join(' ')))fails.push('Statistiche, '+nome+': indietro dal quiz passa per il quiz o il popup ('+t.join(' → ')+')');
    }
  }
  errA();
  await p.evaluate(()=>{try{goHome();}catch(e){}nccStat();});await p.waitForTimeout(700);await p.evaluate(()=>history.back());await new Promise(r=>setTimeout(r,100));f=await film(800);
  console.log('» telefono dalle statistiche'.padEnd(26),f.join(' → '));if(f[f.length-1]!=='home')fails.push('il tasto del telefono dalle statistiche non torna alla Home: '+f.join(' → '));
  /* ── PROFILO ── */
  const apriProfilo=async()=>{await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}goHome();});await p.waitForTimeout(500);
    await p.evaluate(()=>{const b=[...document.querySelectorAll('#tabbar button,#tabbar a,#tabbar [onclick]')].find(x=>/Profilo/.test(x.textContent));b.click();});};
  await apriProfilo();f=await film(1000);console.log('» Profilo'.padEnd(26),f.join(' → '));if(f[f.length-1]!=='pfOv')fails.push('Profilo non si apre: '+f.join(' → '));
  const righe=await p.evaluate(()=>[...document.querySelectorAll('#pfOv .pf-r')].map(r=>(r.querySelector('.pf-n')||r).textContent.trim().slice(0,30)));
  console.log('righe del Profilo:',righe.join(' | '));
  const PERICOLO=/azzera|elimina|cancella|reset|reimposta|ripristin|esci|disconnett|svuota|dimentica/i;
  for(const nome of righe){
    await apriProfilo();await p.waitForTimeout(600);
    await p.evaluate(n=>{const r=[...document.querySelectorAll('#pfOv .pf-r')].find(x=>(x.querySelector('.pf-n')||x).textContent.trim().slice(0,30)===n);r&&r.click();},nome);
    const g=await film(1100);const fine=g[g.length-1];
    if(PERICOLO.test(nome)){
      const conf=await p.evaluate(()=>!!document.getElementById('popOv'));
      console.log(('   · '+nome).padEnd(36),g.join(' → '),conf?'| conferma chiesta → annullo':'| NESSUNA CONFERMA');
      if(!conf&&fine!=='pfOv')fails.push('Profilo, '+nome+': azione pericolosa senza conferma');
      await p.evaluate(()=>{const bs=[...document.querySelectorAll('#popOv .pop-b')];const a=bs.find(b=>/annulla|no/i.test(b.textContent))||bs[bs.length-1];a&&a.click();});await p.waitForTimeout(500);continue;}
    let come='';
    if(fine==='popOv'||fine==='popup'){await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});come='chiudo il popup';}
    else if(fine!=='pfOv'){await p.evaluate(()=>history.back());come='indietro del telefono';}
    await new Promise(r=>setTimeout(r,120));const t=await film(900);
    console.log(('   · '+nome).padEnd(36),g.join(' → '),come?'| '+come+' → '+t.join(' → '):'');
    if(g.some(x=>/^vuoto|^home$/.test(x)))fails.push('Profilo, '+nome+': schermo sbagliato entrando '+g.join(' → '));
    if(t[t.length-1]!=='pfOv')fails.push('Profilo, '+nome+': non si torna al Profilo ma a '+t[t.length-1]);
  }
  await apriProfilo();await p.waitForTimeout(600);await p.evaluate(()=>history.back());await new Promise(r=>setTimeout(r,120));f=await film(800);
  console.log('» telefono dal Profilo'.padEnd(26),f.join(' → '));if(f[f.length-1]!=='home')fails.push('dal Profilo il tasto del telefono non torna alla Home');
  /* la voce: chiusa subito col tasto indietro (prima che arrivino le voci) non deve riaprirsi da sola */
  await apriProfilo();await p.waitForTimeout(600);
  await p.evaluate(()=>{const r=[...document.querySelectorAll('#pfOv .pf-r')].find(x=>/Voce del quiz/.test(x.textContent));r&&r.click();});await p.waitForTimeout(150);
  await p.evaluate(()=>history.back());await p.waitForTimeout(3200);f=await film(500);
  console.log('» voce chiusa subito'.padEnd(26),f.join(' → '));if(f[f.length-1]!=='pfOv')fails.push('il pannello della voce si riapre da solo ('+f.join(' → ')+')');
  /* il report della domenica: sopra il profilo no, appena torni sulla Home si */
  await p.evaluate(()=>{const k=_dayKey(new Date());qtStats.daily=qtStats.daily||{};qtStats.daily[k]=(qtStats.daily[k]||0)+5;qtSave();
    localStorage.setItem('wkRepTs',String(Date.now()-8*86400000));try{weeklyReport();}catch(e){}});
  await p.waitForTimeout(6000);const sopra=await p.evaluate(()=>!!document.querySelector('#wkModal.open'));
  await p.evaluate(()=>history.back());await p.waitForTimeout(6000);const inHome=await p.evaluate(()=>!!document.querySelector('#wkModal.open'));
  console.log('» report della domenica'.padEnd(26),'sopra il profilo:',sopra,'· sulla Home:',inHome);
  if(sopra)fails.push('il report della domenica esce sopra il Profilo');if(!inHome)fails.push('il report della domenica non esce tornando sulla Home');
  errs.forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(f=>console.log(' - '+f));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
