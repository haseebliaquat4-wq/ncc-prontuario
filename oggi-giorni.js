/* LE DOMANDE DI «OGGI» SI SALVANO E IL GIORNO DOPO SONO NUOVE.
   Giorno 1: 12 risposte, poi il telefono chiude Safari di colpo (nessun evento di uscita).
   Riapro: le 12 devono essere salvate e non tornare. Finisco le 30 ed esco.
   Giorno 2: 0/30 e 30 domande tutte diverse da quelle fatte ieri. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const G1=new Date('2026-09-28T09:00:00+02:00').getTime(),G2=new Date('2026-09-29T09:10:00+02:00').getTime();
async function apri(b,dati,quando){
  const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true,isMobile:true,timezoneId:'Europe/Rome'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.clock.install({time:quando});await p.clock.resume();
  await p.goto(BASE+'index.html');await p.waitForTimeout(5200);
  return {ctx,p,errs};
}
const foto=p=>p.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k);}return o;});
const riga=p=>p.evaluate(()=>{const r=document.querySelector('#hmOggi .og-r[onclick*="\'q\'"]');return r?{n:(r.querySelector('.og-n')||{}).textContent,ok:r.classList.contains('ok')}:null;});
const sessione=p=>p.evaluate(()=>Q&&Q.items?Q.items.map(i=>i.id):[]);
async function rispondi(p,n){const fatte=[];
  for(let k=0;k<n;k++){
    const id=await p.evaluate(()=>{const it=Q.items[Q.idx];const b=document.querySelectorAll('#qRunAns .qans')[it.correct];b.click();return it.id;});
    fatte.push(id);await p.waitForTimeout(260);
    await p.evaluate(()=>{if(Q&&Q.idx<Q.items.length-1&&Q.ans[Q.idx]>=0)qGo(1);});await p.waitForTimeout(120);
  }return fatte;}
async function esci(p){await p.evaluate(()=>document.querySelector('.qrun-x').click());await p.waitForTimeout(400);
  await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');b&&b.click();});await p.waitForTimeout(900);}
(async()=>{
  const b=await launch();const s=seed();
  const base={routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(G1),azzerato2026:String(G1),
    qtStats:JSON.stringify({cat:{},err:{},seenIds:{},idV:2})};
  /* ── giorno 1, mattina: 12 risposte e poi Safari chiuso di colpo ── */
  let A=await apri(b,base,G1);
  await A.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'q\'"]').click());await A.p.waitForTimeout(1200);
  const s1=await sessione(A.p);ok(s1.length===30,'giorno 1: la sessione non ha 30 domande ma '+s1.length);
  const prime=await rispondi(A.p,12);
  const dopoKill=await foto(A.p);   /* nessuna uscita, nessun pagehide: e' come se iOS avesse chiuso la scheda */
  A.errs.forEach(e=>fails.push('JS giorno1 '+e));await A.ctx.close();
  /* ── riapro lo stesso giorno ── */
  let B=await apri(b,dopoKill,G1+20*60000);
  const salv=await B.p.evaluate(ids=>{const s=qtStats.seenIds||{};return ids.filter(id=>s[id]).length;},prime);
  let r=await riga(B.p);console.log('dopo la chiusura di colpo: salvate',salv,'di 12 | riga quiz',r&&r.n);
  ok(salv===12,'chiusura di colpo: salvate solo '+salv+' risposte su 12');ok(r&&r.n==='12/30','riga quiz dopo la chiusura: '+(r&&r.n));
  await B.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'q\'"]').click());await B.p.waitForTimeout(1200);
  const s2=await sessione(B.p);const rip=s2.filter(id=>prime.includes(id)).length;
  console.log('nuova sessione: '+s2.length+' domande, gia’ fatte che ritornano: '+rip);ok(rip===0,'le domande gia’ risposte tornano come nuove: '+rip);
  const altre=await rispondi(B.p,18);await esci(B.p);
  r=await riga(B.p);const tutte=prime.concat(altre);
  const salv2=await B.p.evaluate(ids=>{const s=qtStats.seenIds||{};const m=JSON.parse(localStorage.getItem('qtStats')).seenIds||{};return {mem:ids.filter(id=>s[id]).length,disco:ids.filter(id=>m[id]).length};},tutte);
  console.log('fine giorno 1: riga quiz',r&&r.n,r&&r.ok?'✓':'','| salvate',JSON.stringify(salv2),'di 30');
  ok(r&&r.n==='30/30'&&r.ok,'giorno 1: la riga non arriva a 30/30 ✓ ('+(r&&r.n)+')');ok(salv2.disco===30,'giorno 1: salvate su disco solo '+salv2.disco+' di 30');
  const conti=await B.p.evaluate(()=>{const c=JSON.parse(localStorage.getItem('qtStats')).cat||{};let s=0;Object.keys(c).forEach(k=>s+=c[k].seen||0);return {viste:s,sospese:localStorage.getItem('qLedPend')};});
  console.log('statistiche: risposte contate',conti.viste,'| in sospeso',conti.sospese);
  ok(conti.viste===30,'statistiche: le risposte contate sono '+conti.viste+' invece di 30 (doppioni?)');ok(conti.sospese===null,'resta qualcosa in sospeso dopo l’uscita');
  const fine1=await foto(B.p);B.errs.forEach(e=>fails.push('JS giorno1b '+e));await B.ctx.close();
  /* ── giorno 2 ── */
  let C=await apri(b,fine1,G2);
  r=await riga(C.p);console.log('giorno 2: riga quiz',r&&r.n);ok(r&&r.n==='0/30'&&!r.ok,'giorno 2: la riga non riparte da 0/30 ('+(r&&r.n)+')');
  await C.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'q\'"]').click());await C.p.waitForTimeout(1200);
  const s3=await sessione(C.p);const rip2=s3.filter(id=>tutte.includes(id)).length;
  console.log('giorno 2: '+s3.length+' domande, di ieri che ritornano: '+rip2);ok(s3.length===30&&rip2===0,'giorno 2: tornano '+rip2+' domande di ieri');
  const g2=await rispondi(C.p,5);await esci(C.p);r=await riga(C.p);console.log('giorno 2 dopo 5 risposte:',r&&r.n);ok(r&&r.n==='5/30','giorno 2: conteggio '+(r&&r.n));
  C.errs.forEach(e=>fails.push('JS giorno2 '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
