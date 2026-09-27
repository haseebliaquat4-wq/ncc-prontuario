/* GIRO DELLA SEZIONE «OGGI», a tempo reale, fotogramma per fotogramma.
   Avvio (la sezione c'e' dal primo istante, niente salti), poi ogni riga: tocco, faccio
   davvero l'esercizio, torno e guardo che si spunti. Poi cambio giorno e sincronizzazione. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
(async()=>{
  const b=await launch();const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true,isMobile:true});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  /* 6 errori in scadenza, per avere una riga Errori da fare */
  const now=Date.now(),err={};[3,4,5,6,7,8].forEach(i=>err[i]={box:1,due:now-3600000});
  const s=seed();
  await ctx.addInitScript(a=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(a.s.routes));localStorage.setItem('coords',JSON.stringify(a.s.coords));
    localStorage.setItem('ob1','true');localStorage.setItem('antiFretta','false');localStorage.setItem('wkRepTs',String(Date.now()));localStorage.setItem('azzerato2026',String(Date.now()));localStorage.setItem('qtStats',JSON.stringify({cat:{},err:a.err,seenIds:{},idV:2}));}},{s,err});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  /* ── A · avvio: fotogrammi dall'inizio ── */
  const t0=Date.now();p.goto(BASE+'index.html',{waitUntil:'commit'});
  const fotog=[];
  while(Date.now()-t0<4200){
    try{fotog.push(await p.evaluate(()=>{const h=document.documentElement,o=document.getElementById('hmOggi');
      const sp=document.getElementById('splash');
      return {t:0,visibile:!!document.getElementById('homeScreen')&&!h.classList.contains('avvio')&&(!sp||sp.classList.contains('hide')),oggi:!!o,top:o?Math.round(o.getBoundingClientRect().top):null,righe:o?o.querySelectorAll('.og-r').length:0};}));
      fotog[fotog.length-1].t=Date.now()-t0;}catch(e){}
    await new Promise(r=>setTimeout(r,30));
  }
  const primo=fotog.find(f=>f.visibile);const tops=[...new Set(fotog.filter(f=>f.visibile&&f.oggi&&f.t>900).map(f=>f.top))];
  console.log('avvio: primo fotogramma visibile a',primo&&primo.t,'ms, sezione',primo&&primo.oggi,'righe',primo&&primo.righe,'| posizioni della sezione dopo 0,9 s:',tops.join(','));
  ok(primo&&primo.oggi&&primo.righe===4,'avvio: la sezione non c’e’ al primo fotogramma visibile');
  ok(tops.length===1,'avvio: la sezione si sposta dopo la comparsa ('+tops.join(',')+')');
  await p.waitForTimeout(2500);
  await p.addScriptTag({content:`window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
    while(c&&c!==document.body){var cs=getComputedStyle(c);if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='popOv')return 'popup';
      if(c.id==='quizApp')return 'quiz:'+qCurView;if(c.id==='pzOv')return 'piazza';if(c.id==='homeScreen')return 'home';if(c.id==='map'||c.id==='panel')return 'mappa';c=c.parentElement;}
    return document.body.classList.contains('on-topo')?'mappa':'vuoto('+(e?(e.id||e.tagName):'-')+')';};
    window.__riga=function(k){var r=document.querySelector('#hmOggi .og-r[onclick*="'+k+'"]');return r?{ok:r.classList.contains('ok'),n:(r.querySelector('.og-n')||{}).textContent||'',t:r.innerText.replace(/\\s+/g,' ')}:null;};`});
  const film=async dur=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;};
  const riga=k=>p.evaluate(k=>__riga(k),k);
  const tocca=k=>p.evaluate(k=>document.querySelector('#hmOggi .og-r[onclick*="'+k+'"]').click(),k);
  const pulito=(seq,nome)=>{if(seq.some(x=>/^vuoto|^quiz:dash|^pagina/.test(x)))fails.push(nome+': schermo sbagliato di passaggio '+seq.join(' → '));};
  const conferma=async()=>{await p.waitForTimeout(350);await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');b&&b.click();});};
  /* ── B · 30 domande nuove ── */
  let f;
  await tocca("'q'");f=await film(1500);console.log('quiz entra'.padEnd(18),f.join(' → '));pulito(f,'quiz entra');ok(f[f.length-1]==='quiz:run','quiz: non parte');
  for(let k=0;k<3;k++){await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await p.waitForTimeout(1900);}
  await p.evaluate(()=>document.querySelector('.qrun-x').click());await conferma();f=await film(1300);
  console.log('quiz esci'.padEnd(18),f.join(' → '));pulito(f.filter(x=>x!=='popup'),'quiz esci');ok(f[f.length-1]==='home','quiz: uscendo non torna in home ma a '+f[f.length-1]);
  await p.waitForTimeout(400);let r=await riga("'q'");console.log('   riga quiz:',r.n);ok(r.n==='3/30','quiz: il conteggio non e’ 3/30 ma '+r.n);
  /* ── C · errori in scadenza ── */
  r=await riga("'e'");ok(r.n==='0/6','errori: all’inizio non e’ 0/6 ma '+r.n);
  await tocca("'e'");f=await film(1800);console.log('errori entra'.padEnd(18),f.join(' → '));
  if(f[f.length-1]==='popup'){await p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click());f=f.concat(await film(1200));}
  pulito(f.filter(x=>x!=='popup'),'errori entra');ok(f[f.length-1]==='quiz:run','errori: il ripasso non parte');
  for(let k=0;k<2;k++){await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await p.waitForTimeout(1900);}
  await p.evaluate(()=>document.querySelector('.qrun-x').click());await conferma();f=await film(1300);ok(f[f.length-1]==='home','errori: uscendo non torna in home');
  await p.waitForTimeout(400);r=await riga("'e'");console.log('   riga errori:',r.n);ok(r.n==='2/6','errori: il conteggio non e’ 2/6 ma '+r.n);
  /* ── D · piazze: la prima di oggi, verificata fino in fondo ── */
  const st0=await p.evaluate(()=>nccOggiStato());
  await tocca("'pz'");f=await film(1000);console.log('piazza entra'.padEnd(18),f.join(' → '));pulito(f,'piazza entra');ok(f[f.length-1]==='piazza','piazze: non si apre la piazza');
  const tit=await p.evaluate(()=>(document.querySelector('#pzOv .pz-ti')||{}).textContent);
  const nome1=await p.evaluate(id=>pzTutte().find(x=>x.id===id).n,st0.pz[0]);ok(tit===nome1,'piazze: si apre '+tit+' invece di '+nome1);
  await p.evaluate(()=>[...document.querySelectorAll('#pzOv .pz-azioni button')].find(x=>/verific/i.test(x.textContent)).click());await p.waitForTimeout(300);
  for(let k=0;k<60;k++){const fatto=await p.evaluate(()=>{const s=document.getElementById('verShow');if(s){s.click();return false;}const y=document.querySelector('.pz-si');if(y){y.click();return false;}return true;});
    if(fatto)break;await p.waitForTimeout(60);}
  await p.waitForTimeout(300);await p.evaluate(()=>document.querySelector('#pzOv .pz-hd2 .pz-x').click());f=await film(1100);
  console.log('piazza esci'.padEnd(18),f.join(' → '));ok(f[f.length-1]==='home','piazze: finita la verifica, ‹ non torna in home ma a '+f[f.length-1]);
  await p.waitForTimeout(400);r=await riga("'pz'");console.log('   riga piazze:',r.n,'|',r.t.slice(0,80));ok(r.n==='1/3'&&/✓/.test(r.t),'piazze: non si spunta la piazza fatta ('+r.n+')');
  /* ── E · percorsi: il primo di oggi, fino all'ultima tappa ── */
  await tocca("'pr'");f=await film(1300);console.log('percorso entra'.padEnd(18),f.join(' → '));pulito(f,'percorso entra');
  const cid=await p.evaluate(()=>cur&&String(cur.id));ok(cid===st0.pr[0],'percorsi: si apre '+cid+' invece di '+st0.pr[0]);
  for(let k=0;k<12;k++){const fine=await p.evaluate(()=>{const b=document.getElementById('bNext');if(!b||b.disabled)return true;b.click();return false;});if(fine)break;await p.waitForTimeout(250);}
  await p.waitForTimeout(700);await p.evaluate(()=>document.getElementById('tpBack').click());f=await film(1100);
  console.log('percorso esci'.padEnd(18),f.join(' → '));ok(f[f.length-1]==='home','percorsi: ‹ non torna in home ma a '+f[f.length-1]);
  await p.waitForTimeout(400);r=await riga("'pr'");console.log('   riga percorsi:',r.n,'|',r.t.slice(0,70));ok(r.n==='1/2','percorsi: il conteggio non e’ 1/2 ma '+r.n);
  await p.screenshot({path:__dirname+'/oggi-dopo.png'});
  /* ── F · tutto fatto ── */
  const tutto=await p.evaluate(()=>{const st=nccOggiStato();buildQuiz();
    QUIZ_ALL.slice(300,330).forEach(it=>st.q[it.id]=1);Object.keys(qtStats.err).slice(0,st.e0).forEach(id=>st.e[id]=1);
    const sr=JSON.parse(localStorage.getItem('pzSR')||'{}');st.pz.forEach(id=>{sr[id]=Object.assign(sr[id]||{box:1,due:Date.now()+86400000},{last:Date.now()});});
    const lg=JSON.parse(localStorage.getItem('rDoneLog')||'{}');st.pr.forEach(id=>lg[id]=Date.now());
    localStorage.setItem('pzSR',JSON.stringify(sr));localStorage.setItem('rDoneLog',JSON.stringify(lg));localStorage.setItem('oggiNcc',JSON.stringify(st));return true;});
  await p.waitForTimeout(700);
  const hd=await p.evaluate(()=>({t:document.querySelector('#hmOggi .og-tot').textContent,ok:document.querySelectorAll('#hmOggi .og-r.ok').length}));
  console.log('tutto fatto:',JSON.stringify(hd));ok(hd.ok===4&&/Tutto fatto/.test(hd.t),'tutto fatto non segnalato');
  await p.screenshot({path:__dirname+'/oggi-tutto.png'});
  /* ── G · il giorno dopo: nuove piazze e percorsi, conteggi a zero ── */
  const g=await p.evaluate(()=>{const st=nccOggiStato();const ieri={pz:st.pz.slice(),pr:st.pr.slice()};st.d='2026-01-01';localStorage.setItem('oggiNcc',JSON.stringify(st));
    const n=nccOggiStato();return {ieri,n};});
  await p.waitForTimeout(500);
  console.log('giorno dopo: piazze',g.ieri.pz.join(','),'→',g.n.pz.join(','),'| percorsi',g.ieri.pr.join(','),'→',g.n.pr.join(','));
  ok(g.n.pz.length===3&&!g.n.pz.some(x=>g.ieri.pz.includes(x)),'giorno dopo: le piazze si ripetono');
  ok(!Object.keys(g.n.q).length&&!Object.keys(g.n.e).length,'giorno dopo: i conteggi non ripartono da zero');
  const hd2=await p.evaluate(()=>document.querySelector('#hmOggi .og-tot').textContent);ok(!/Tutto fatto/.test(hd2),'giorno dopo: la sezione resta «tutto fatto»');
  /* ── H · sincronizzazione: stesso giorno si sommano, giorno vecchio ignorato ── */
  const sy=await p.evaluate(()=>{const st=nccOggiStato();
    const stesso=JSON.stringify({d:st.d,t:st.t-5000,q:{'700':1,'701':1},e:{},e0:9,pz:['pzA','pzB','pzC'],pr:['r1']});
    nccSyncUnisci({oggiNcc:stesso});const a=nccOggiStato();
    nccSyncUnisci({oggiNcc:JSON.stringify({d:'2020-01-01',t:1,q:{'900':1},e:{},e0:1,pz:[],pr:[]})});const b2=nccOggiStato();
    return {q:Object.keys(a.q).length,pz:a.pz.join(','),e0:a.e0,vecchio:Object.keys(b2.q).includes('900')};});
  console.log('sincronizzazione',JSON.stringify(sy));
  ok(sy.q===2&&sy.pz==='pzA,pzB,pzC'&&sy.e0===9,'sync stesso giorno non unisce');ok(!sy.vecchio,'sync: un giorno vecchio sovrascrive');
  errs.forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
