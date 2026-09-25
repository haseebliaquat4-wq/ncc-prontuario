/* GIRO DELLA TOPOGRAFIA, fotogramma per fotogramma, a tempo reale.
   Per ogni riga della pagina Topografia: tocco, filmo cosa c'e' al centro dello schermo ogni ~30 ms,
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
  const st=()=>p.evaluate(()=>({step:typeof step!=='undefined'?step:null,mode:typeof mode!=='undefined'?mode:null,id:cur?cur.id:null,
    play:(document.getElementById('playBtn')||{}).textContent,rev:getComputedStyle(document.getElementById('bRev')).display,
    linea:(document.getElementById('lineaBtn')||{}).className+'|'+(document.getElementById('lineaBtn')||{}).textContent,ed:document.getElementById('addModal').classList.contains('open')}));
  const clic=async(sel,ms)=>{const ok=await p.evaluate(sel=>{const e=document.querySelector(sel);if(!e||e.disabled)return false;e.click();return true;},sel);
    if(!ok)fails.push('tasto non premibile: '+sel);const f=await film(ms||500);if(f.some(x=>/^vuoto|homeScreen/.test(x)))fails.push(sel+': schermo sbagliato '+f.join(' → '));return f;};
  await p.evaluate(()=>{try{goHome();}catch(e){}nccSez('topo');});await p.waitForTimeout(800);
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>/^Studio/.test(r.querySelector('.qc-lt b').textContent)).click());await p.waitForTimeout(900);
  let a=await st();console.log('mappa aperta',JSON.stringify(a));
  await clic('#bNext');await clic('#bNext');let b1=await st();await clic('#bPrev');let b2=await st();
  console.log('◀ ▶ tappe',a.step,'→',b1.step,'→',b2.step);if(!(b1.step===a.step+2&&b2.step===b1.step-1))fails.push('◀ ▶ non spostano la tappa: '+[a.step,b1.step,b2.step]);
  await clic('#cCi');let c=await st();console.log('Cieco',c.mode,'Scopri',c.rev);if(c.rev==='none')fails.push('Cieco: il tasto Scopri non compare');
  await clic('#bRev');await clic('#cQu');let q=await st();console.log('Quiz vie',q.mode);await clic('#cSt');let s2=await st();console.log('Studio',s2.mode);
  if(c.mode===s2.mode)fails.push('i tasti Studio/Cieco non cambiano modalita\u2019');
  await clic('#playBtn',200);let p1=await st();await p.waitForTimeout(2500);let p2=await st();await clic('#playBtn',300);let p3=await st();
  console.log('▶ riproduci',p1.play,'tappa',p1.step,'→',p2.step,'| ferma',p3.play);if(!(p2.step>p1.step))fails.push('▶ riproduci non avanza');if(p3.play===p1.play)fails.push('▶ non si ferma');
  await p.evaluate(()=>document.getElementById('lineaBtn').click());const lf=await film(700);console.log('Linea',lf.join(' → '));
  if(lf[lf.length-1]!=='lineaOv')fails.push('Linea non apre la vista linea: '+lf.join(' → '));
  const chiusa=await p.evaluate(()=>{const o=document.getElementById('lineaOv');const b=[...o.querySelectorAll('button')].find(x=>/✕|‹|×/.test(x.textContent)||/x$|back|chiudi/i.test(x.className+' '+(x.getAttribute('aria-label')||'')));if(b){b.click();return b.textContent.trim()||b.className;}return null;});
  const lf2=await film(700);console.log('chiudo la linea con',chiusa,'→',lf2.join(' → '));if(!chiusa||lf2[lf2.length-1]==='lineaOv')fails.push('la vista linea non si chiude');
  const r0=await st();await clic('.ichip[onclick="rndRoute()"]',700);const r1=await st();console.log('🔀',r0.id,'→',r1.id);if(r0.id===r1.id)fails.push('🔀 non cambia percorso');
  await clic('#edBtn',700);const e1=await st();console.log('✏️ Correggi editor aperto:',e1.ed);if(!e1.ed)fails.push('✏️ Correggi non apre l\u2019editor');
  await p.evaluate(()=>document.querySelector('#addModal .mhdr-close').click());await p.waitForTimeout(500);
  await clic('#tpInfo',600);const pop=await p.evaluate(()=>!!document.getElementById('popOv'));if(!pop)fails.push('(i) non spiega niente');await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});await p.waitForTimeout(400);
  const t=await film(0);await p.evaluate(()=>document.getElementById('tpBack').click());const fine=await film(900);console.log('‹ dalla mappa',fine.join(' → '));
  if(fine[fine.length-1]!=='pagina:topo')fails.push('‹ dalla mappa non torna alla pagina Topografia');
  errs.forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(f=>console.log(' - '+f));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
