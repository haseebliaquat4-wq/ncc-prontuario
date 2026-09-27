/* GIRO IPAD, a tempo reale.
   A · pagine Quiz, Topografia, Piazze, Norme, Profilo, Statistiche: colonna al centro allineata alla testata,
       in orizzontale i gruppi in colonne e tutto in uno schermo; ruotando si ridistribuiscono.
   B · la piazza in orizzontale: vie a sinistra, mappa a destra (Cieco, ▶, Mi verifico, indietro).
   C · Scrivi le vie con la Pencil: un riquadro per via, giusta = verde e si passa alla dopo.
   D · telefono: niente di tutto questo, resta com'era. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15';
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
async function apri(b,vp){
  const ctx=await b.newContext({viewport:vp,serviceWorkers:'block',hasTouch:true,userAgent:vp.width>=700?UA:undefined});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();
  await ctx.addInitScript(s=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(s.routes));localStorage.setItem('coords',JSON.stringify(s.coords));
    localStorage.setItem('ob1','true');localStorage.setItem('antiFretta','false');localStorage.setItem('wkRepTs',String(Date.now()));localStorage.setItem('azzerato2026',String(Date.now()));}},s);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(5500);
  await p.addScriptTag({content:`window.__vedo=function(){var e=document.elementFromPoint(innerWidth/2,innerHeight/2),c=e;
    while(c&&c!==document.body){if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='pfOv')return 'profilo';if(c.id==='pzOv')return 'piazze';
      if(c.id==='scOv')return 'scrivi';if(c.id==='popOv')return 'popup';if(c.id==='homeScreen')return 'home';c=c.parentElement;}return 'altro';};`});
  return {ctx,p,errs};
}
const film=async(p,dur)=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;};
const pagina=p=>p.evaluate(()=>{const o=document.getElementById('pfOv')||document.getElementById('scnOv');const body=o.querySelector('.pf-body');
  const r=[...o.querySelectorAll('.qc-riga,.pf-r,.sx-arg')].map(e=>e.getBoundingClientRect()).filter(x=>x.width>0);
  const back=o.querySelector('.t-back').getBoundingClientRect(),inf=o.querySelector('.t-hd .t-info');
  return {col:[...new Set(r.map(x=>Math.round(x.left)))].length,sx:Math.min(...r.map(x=>Math.round(x.left))),dx:Math.max(...r.map(x=>Math.round(x.right))),
    back:Math.round(back.left),info:inf?Math.round(inf.getBoundingClientRect().right):null,scorre:body.scrollHeight>body.clientHeight+2};});
(async()=>{
  const b=await launch();
  /* ════ A · pagine su iPad in orizzontale, aperte dai riquadri della Home ════ */
  let {ctx,p,errs}=await apri(b,{width:1180,height:820});
  const TILE={quiz:'Quiz',topo:'Topografia',pz:'Piazze',norme:'Norme'};
  const attese={quiz:3,topo:3,pz:3,norme:2};
  for(const k of Object.keys(TILE)){
    await p.evaluate(t=>{const r=[...document.querySelectorAll('.hm-griglia .hm-rq, .hm-griglia button, .hm-griglia [onclick]')].find(x=>x.textContent.indexOf(t)>=0);r.click();},TILE[k]);
    const f=await film(p,900);const m=await pagina(p);
    console.log(('pagina '+k).padEnd(16),f.join(' → ').padEnd(26),JSON.stringify(m));
    ok(f[f.length-1]==='pagina:'+k,k+': non si apre ('+f.join(',')+')');ok(!f.some(x=>x==='altro'),k+': schermo vuoto di passaggio');
    ok(m.col===attese[k],k+': colonne '+m.col+' invece di '+attese[k]);ok(!m.scorre,k+': in orizzontale va ancora scorsa');
    ok(Math.abs(m.back-m.sx)<=2&&Math.abs(m.info-m.dx)<=2,k+': testata non allineata alle colonne '+JSON.stringify(m));
    await p.evaluate(()=>nccSezChiudi());await p.waitForTimeout(600);
  }
  await p.evaluate(()=>document.querySelector('#tabbar .tab[data-t="profilo"]').click());let f=await film(p,900);let m=await pagina(p);
  console.log('profilo'.padEnd(16),f.join(' → ').padEnd(26),JSON.stringify(m));ok(m.col===2&&!m.scorre,'profilo: '+JSON.stringify(m));
  await p.evaluate(()=>nccProfiloChiudi());await p.waitForTimeout(600);
  /* ruoto con la pagina Topografia aperta: i gruppi si rimettono in colonna senza ridisegnare la pagina */
  await p.evaluate(()=>{nccSez('topo');});await p.waitForTimeout(700);await p.evaluate(()=>{window.__corpo=document.getElementById('scnBody');});
  await p.setViewportSize({width:820,height:1180});await p.waitForTimeout(400);m=await pagina(p);
  const stesso=await p.evaluate(()=>document.getElementById('scnBody')===window.__corpo);
  console.log('ruotato verticale',JSON.stringify(m),'stessa pagina:',stesso);
  ok(m.col===1&&m.sx===86&&m.back===86&&m.info===734&&stesso,'rotazione: colonna non centrata o pagina ridisegnata '+JSON.stringify(m));
  await p.setViewportSize({width:1180,height:820});await p.waitForTimeout(400);m=await pagina(p);ok(m.col===3,'rotazione: tornando in orizzontale non ci sono 3 colonne');
  await p.evaluate(()=>nccSezChiudi(true));await p.waitForTimeout(300);
  /* ════ B · la piazza con la mappa accanto ════ */
  const P=await p.evaluate(()=>{const T=pzTutte();const a=T[0],co={};co[a.id]={lat:45.464,lon:9.19};
    a.v.forEach((v,i)=>co[a.id+'_'+i]={lat:45.464+Math.cos(i)*0.002,lon:9.19+Math.sin(i)*0.002});localStorage.setItem('pzCoords',JSON.stringify(co));return {id:a.id,n:a.v.length,nome:a.n};});
  await p.evaluate(()=>nccSez('pz'));await p.waitForTimeout(700);
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>/Tutte le piazze/.test(x.textContent)).click());await p.waitForTimeout(900);
  await p.evaluate(id=>{const r=[...document.querySelectorAll('#pzOv .pz-row')].find(x=>(x.getAttribute('onclick')||'').indexOf("'"+id+"'")>=0);r.click();},P.id);
  f=await film(p,700);
  const lato=()=>p.evaluate(()=>{const l=document.getElementById('pzLato'),o=document.getElementById('pzOv');
    return {lato:!!l,sx:o&&o.querySelector('.pz-body')?Math.round(o.querySelector('.pz-body').getBoundingClientRect().width):0,
      segni:l?[...l.querySelectorAll('.pzl-ic')].map(e=>(e.classList.contains('att')?'*':'')+e.textContent).join(' '):''};});
  let L1=await lato();console.log('piazza '+P.nome,'|',f.join(' → '),'|',JSON.stringify(L1));
  ok(L1.lato&&L1.sx===590&&L1.segni.split(' ').length===P.n+1,'piazza: mappa accanto mancante o marker sbagliati '+JSON.stringify(L1));
  await p.evaluate(()=>{pzModo(true);pzVai(1);pzVai(1);pzVai(1);});await p.waitForTimeout(300);L1=await lato();
  console.log('   Cieco, 3 avanti:',L1.segni);ok(/^1 2 \*3 (\? )+◉$/.test(L1.segni),'Cieco: la mappa non segue le vie scoperte ('+L1.segni+')');
  await p.screenshot({path:__dirname+'/ipad-piazza.png'});
  await p.evaluate(()=>pzVerifica());await p.waitForTimeout(400);L1=await lato();ok(!L1.lato,'Mi verifico: la mappa resta e mostra le risposte');
  await p.evaluate(()=>{const x=document.querySelector('#pzOv .pz-x');x&&x.click();});await p.waitForTimeout(500);
  L1=await lato();console.log('   dopo Mi verifico → ‹:',JSON.stringify(L1));ok(L1.lato,'tornando alla piazza la mappa accanto non torna');
  await p.evaluate(()=>{try{pzChiudi();}catch(e){}});await p.waitForTimeout(500);
  errs.forEach(e=>fails.push('JS orizzontale '+e));await ctx.close();
  /* ════ C · Scrivi le vie con la Pencil (iPad in verticale) ════ */
  ({ctx,p,errs}=await apri(b,{width:820,height:1180}));
  await p.evaluate(()=>{const T=pzTutte();const a=T[0],co={};co[a.id]={lat:45.464,lon:9.19};localStorage.setItem('pzCoords',JSON.stringify(co));});
  await p.evaluate(()=>nccSez('pz'));await p.waitForTimeout(700);
  const V=await p.evaluate(()=>{const T=pzTutte();return T[0].v;});const idP=await p.evaluate(()=>pzTutte()[0].id);
  await p.evaluate(id=>pzScrivi(id),idP);f=await film(p,900);
  const box=()=>p.evaluate(()=>{const b=document.getElementById('scPenna');const ci=document.getElementById('scIn');
    return {c:!!b,righe:b?b.querySelectorAll('.scp-r').length:0,ok:b?[...b.querySelectorAll('.scp-r.ok')].map(r=>r.textContent).join(' | '):'',
      att:b?[...b.querySelectorAll('.scp-r')].findIndex(r=>r.classList.contains('att')):-1,campo:ci?getComputedStyle(ci).display:'-',alto:b?Math.round(b.querySelector('.scp-r').getBoundingClientRect().height):0,
      esito:(document.getElementById('scEsito')||{}).textContent||''};});
  let B=await box();console.log('scrivi, apertura',f.join(' → '),JSON.stringify(B));
  ok(B.c&&B.righe===V.length&&B.att===0&&B.campo==='none'&&B.alto>=60,'Pencil: riquadri mancanti o piccoli '+JSON.stringify(B));
  /* scrivo a pezzi, come fa Scribble: prima parola sola, poi la via intera (la terza della piazza) nel primo riquadro */
  const scrivi=async(k,testo)=>{for(const pezzo of testo){await p.evaluate(([k,t])=>{const i=document.querySelectorAll('#scPenna .scp-r:not(.ok) .scp-in')[k];i.value=t;i.dispatchEvent(new Event('input',{bubbles:true}));},[k,pezzo]);await p.waitForTimeout(250);}};
  const parole=V[2].split(' ');await scrivi(0,[parole[0]]);await p.waitForTimeout(900);B=await box();
  ok(!B.ok&&!/non/.test(B.esito),'Pencil: a meta’ parola giudica gia’ ('+B.esito+')');
  await scrivi(0,[V[2]]);await p.waitForTimeout(900);B=await box();console.log('   giusta:',JSON.stringify(B));
  ok(B.ok.indexOf('3'+V[2])===0&&B.att===1,'Pencil: la via giusta non si accende di verde o non passa alla dopo '+JSON.stringify(B));
  /* sbagliata: da sola non dice niente, con ✓ si' */
  await scrivi(0,['Via Inesistente Rossi']);await p.waitForTimeout(900);B=await box();ok(!/non/.test(B.esito),'Pencil: l’errore arriva senza toccare ✓');
  await p.evaluate(()=>document.querySelector('#scPenna .scp-r:not(.ok) .scp-ok').click());await p.waitForTimeout(300);B=await box();
  console.log('   sbagliata + ✓:',B.esito);ok(/non/.test(B.esito),'Pencil: ✓ non segnala la via sbagliata');
  /* con la tastiera: Invio */
  await p.evaluate(t=>{const i=document.querySelectorAll('#scPenna .scp-r:not(.ok) .scp-in')[0];i.value=t;i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));},V[0]);
  await p.waitForTimeout(300);B=await box();console.log('   Invio:',B.ok);ok(B.ok.split(' | ').length===2,'Pencil: Invio non accetta la via');
  /* le altre, fino alla fine */
  for(let j=0;j<V.length;j++){if(j===0||j===2)continue;await scrivi(0,[V[j]]);await p.waitForTimeout(800);}
  await p.waitForTimeout(900);
  const fine=await p.evaluate(()=>({penna:document.getElementById('scOv').classList.contains('sc-penna'),box:!!document.getElementById('scPenna'),su:(document.querySelector('#scOv .sc-su')||{}).textContent}));
  console.log('   fine esercizio:',JSON.stringify(fine));ok(fine.su==='finita'&&!fine.penna&&!fine.box,'Pencil: la schermata finale resta in modalita’ Pencil '+JSON.stringify(fine));
  await p.screenshot({path:__dirname+'/ipad-scrivi-fine.png'});
  await p.evaluate(()=>{try{pzScriviChiudi();}catch(e){};try{pzChiudi();}catch(e){}});await p.waitForTimeout(500);
  errs.forEach(e=>fails.push('JS verticale '+e));await ctx.close();
  /* ════ D · telefono: tutto come prima ════ */
  ({ctx,p,errs}=await apri(b,{width:390,height:844}));
  await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(700);m=await pagina(p);ok(m.col===1&&m.sx===16&&m.back===16,'telefono: pagina cambiata '+JSON.stringify(m));
  await p.evaluate(()=>{nccSezChiudi(true);pzApri(pzTutte()[0].id);});await p.waitForTimeout(600);
  const tel=await p.evaluate(()=>({lato:!!document.getElementById('pzLato')}));
  await p.evaluate(()=>{pzChiudi();pzScrivi(pzTutte()[0].id);});await p.waitForTimeout(700);
  tel.penna=await p.evaluate(()=>!!document.getElementById('scPenna'));tel.campo=await p.evaluate(()=>getComputedStyle(document.getElementById('scIn')).display);
  console.log('telefono:',JSON.stringify(m),JSON.stringify(tel));ok(!tel.lato&&!tel.penna&&tel.campo!=='none','telefono: compaiono cose da iPad '+JSON.stringify(tel));
  errs.forEach(e=>fails.push('JS telefono '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
