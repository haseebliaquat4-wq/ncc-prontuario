/* L'ELENCO D'ESAME (v165), provato come lo usa una persona: tocchi veri e, dove qualcosa si muove, fotogramma per fotogramma
   · «Chiesto all'esame»: «Elenco esame» accanto alle sessioni; i 147 percorsi nell'ordine del foglio, le 18 confluenze,
     le domande dell'orale (22 temi); non conta come una volta in piu' (Centrale → San Siro resta «Chiesto 8 volte»);
     i 3 percorsi e il tema che ci sono solo li' hanno 📋; il riquadro della Home dice x/151
   · cambiando scheda la sessione scelta resta in vista nella fila (prima tornava a «Tutte» e «Elenco esame» spariva a destra)
   · un tema: «👀 La risposta da dare», chiusa; aprendola il riquadro cresce piano (mai a scatti) e la risposta scorre in vista;
     richiudendola torna piano com'era
   · la simulazione dell'orale: «Elenco esame» fra le sessioni (le prove vengono tutte dall'elenco); la domanda senza le
     note dei resoconti (vista e letta ad alta voce); i punti che rispondono a quella domanda evidenziati
   · Cosa & Dove: la Prefettura e' Palazzo Diotti, corso Monforte 31
   · telefono piccolo e tema scuro: niente esce di lato
   uso: node test/giro-elenco.js */
const {chromium}=(()=>{try{return require('playwright');}catch(e){return require('/home/claude/.npm-global/lib/node_modules/playwright');}})();
const fs=require('fs');
const {seed,BASE}=require('./lib');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
const pausa=ms=>new Promise(r=>setTimeout(r,ms));
const AIUTI=`(function(){
window.__vedo=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),e=document.elementFromPoint(X,Y),c=e;
  while(c&&c!==document.body&&c!==document.documentElement){var cs=getComputedStyle(c);
    if(c.id==='popOv')return 'popup';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='homeScreen')return 'home';
    if(c.id==='map'||c.id==='panel')return 'mappa';
    if(c.id&&(cs.position==='fixed'||cs.position==='absolute'&&c.parentElement===document.body))return c.id;c=c.parentElement;}
  if(document.body.classList.contains('on-topo'))return 'mappa';
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};
window.__film=[];window.__filmOn=false;
var s=document.createElement('div');s.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px;pointer-events:none;';
document.documentElement.appendChild(s);var g=0;
new ResizeObserver(function(){try{if(window.__filmOn){var v=__vedo(),L=window.__film;if(!L.length||L[L.length-1]!==v)L.push(v);}}catch(e){}}).observe(s);
(function giro(){g=1-g;s.style.width=(1+g)+'px';requestAnimationFrame(giro);})();
window.__campiona=function(fn,ms){return new Promise(function(ok){var t0=performance.now(),v=[];
  (function f(){try{v.push(fn());}catch(e){v.push('err:'+e.message);}if(performance.now()-t0<ms)requestAnimationFrame(f);else ok(v);})();});};
window.__largo=function(){var W=document.documentElement.clientWidth,l=[];document.querySelectorAll('#scnOv *,#popOv *').forEach(function(x){
  var r=x.getBoundingClientRect();if(r.width&&(r.right>W+1||r.left<-1)&&!x.closest('.ch-ses')&&!x.closest('.sx-tabs')&&getComputedStyle(x).position!=='fixed')l.push((x.className||x.tagName)+':'+Math.round(r.left)+'..'+Math.round(r.right));});
  return {W:W,sc:document.documentElement.scrollWidth,l:l.slice(0,5)};};
})();`;
let B;
async function apri(o){
  o=o||{};
  const ctx=await B.newContext({viewport:o.vp||{width:390,height:844},serviceWorkers:'block',timezoneId:'Europe/Rome',hasTouch:true,isMobile:true,deviceScaleFactor:1,colorScheme:o.scuro?'dark':'light'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed(),ora=Date.now();
  const dati={routes:J(s.routes),coords:J(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(ora),azzerato2026:String(ora),nccOraleVoce:'0'};
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__s'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__s','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon|navigator\.vibrate/.test(t))errs.push('console: '+t);}});
  await p.goto(BASE+'index.html',{waitUntil:'load'});await pausa(6500);
  await p.addScriptTag({content:AIUTI});
  return {ctx,p,errs};
}
/* un tocco vero, al centro di quello che trova fn: portato in vista (le righe in mezzo allo schermo, non sotto la barra in
   basso), fermo per tre fotogrammi, e il dito arriva proprio li' (non su qualcosa sopra) */
async function tap(p,fn,arg){
  const r=await p.evaluate(async([f,a])=>{const el=(new Function('a','return ('+f+')(a)'))(a);if(!el)return null;
    el.scrollIntoView({block:el.closest('.ch-r,.qc-riga')?'center':'nearest',inline:'nearest'});
    let last=null,stab=0;
    for(let i=0;i<90&&stab<3;i++){await new Promise(r=>requestAnimationFrame(r));const q=el.getBoundingClientRect(),k=Math.round(q.left)+','+Math.round(q.top);
      if(k===last)stab++;else{stab=0;last=k;}}
    const q=el.getBoundingClientRect(),x=q.left+q.width/2,y=q.top+Math.min(q.height/2,22),e=document.elementFromPoint(x,y);
    return {x,y,dentro:!!(e&&(e===el||el.contains(e))),su:e?(e.className||e.tagName):''};},[fn.toString(),arg]);
  if(!r){ok(false,'non trovo da toccare: '+fn.toString().slice(0,90)+' '+J(arg));return false;}
  if(!r.dentro)ok(false,'il dito non arriva su '+J(arg)+' ('+fn.toString().slice(0,60)+'): sopra c’è '+r.su);
  await p.touchscreen.tap(r.x,r.y);return true;
}
const riga=t=>[...document.querySelectorAll('#scnOv .ch-r')].find(r=>r.querySelector('b').textContent.indexOf(t)===0);
const chip=t=>[...document.querySelectorAll('#scnOv .ch-chip')].find(c=>c.textContent===t);
const scheda=t=>[...document.querySelectorAll('#scnOv .ch-tabs .sx-tab')].find(x=>x.textContent.indexOf(t)===0);
async function film(p,fn,ms){await p.evaluate(()=>{window.__film=[];window.__filmOn=true;});await fn();await pausa(ms||900);
  return p.evaluate(()=>{window.__filmOn=false;return window.__film.slice();});}
function pulito(nome,f,arrivo){const s=f.join(' → ');
  ok(!f.some(x=>/^vuoto/.test(x)),nome+': schermo vuoto '+s);
  ok(f[0]==='home'||arrivo==='home'||!f.slice(1).includes('home'),nome+': Home di passaggio '+s);
  for(let i=2;i<f.length;i++)if(f[i]===f[i-2]&&f[i]!==f[i-1]){ok(false,nome+': sfarfallio '+s);break;}
  ok(f[f.length-1]===arrivo,nome+': arriva su «'+f[f.length-1]+'» invece di «'+arrivo+'» ('+s+')');
  console.log(' '+(nome+'                                  ').slice(0,36)+s);}

(async()=>{
  B=await chromium.launch({headless:true,args:['--no-sandbox']});
  let {ctx,p,errs}=await apri();

  /* ── 1 · i conti: l'elenco c'e', non conta come una volta in piu' ── */
  const c=await p.evaluate(()=>{const m=nccChiestoMotore,C=m.conti(),u=m.SES[m.SES.length-1];
    return {u:u.id+'|'+u.c,perc:C.perc.length,pz:C.pz.length,reg:C.reg.length,solo:C.perc.filter(o=>o.solo).map(o=>o.k).sort(),
      soloR:C.reg.filter(o=>o.solo).map(o=>o.k),el:[C.perc.filter(o=>o.ses.elenco).length,C.pz.filter(o=>o.ses.elenco).length,C.reg.filter(o=>o.ses.elenco).length],
      css:C.P['CENTRALE>SANSIRO'].n,obb:C.R.obblighi.n,cad:C.K.CADORNA.n,perr:m.luogo('Piazzale Perrucchetti'),
      risp:Object.keys(nccChiestoMotore.TEMI).filter(k=>!(window.nccRisp||{})[k])};});
  console.log(' conti                               ',J(c));
  ok(c.u==='elenco|Elenco esame'&&c.perc===151&&c.pz===18&&c.reg===24,'i conti: '+J(c));
  ok(J(c.solo)===J(['DUOMO>FIRENZE','DUOMO>LINATE','SANCARLO>CORDUSIO'])&&J(c.soloR)===J(['sedi']),'quello che c’è solo nell’elenco: '+J(c));
  ok(J(c.el)===J([147,18,22]),'nell’elenco: '+J(c.el));
  ok(c.css===8&&c.obb===10&&c.cad===4,'l’elenco ha contato come una volta in più: '+J(c));
  ok(c.perr==='PERUCCHETTI'&&!c.risp.length,'Perrucchetti / temi senza risposta: '+J(c));
  const rq=await p.evaluate(()=>{const r=document.querySelector('#hmNew .hm-rq-largo');return r?(r.querySelector('.hm-rq-b')||{}).textContent:null;});
  ok(rq==='0/151','il riquadro della Home: '+rq);

  /* ── 2 · Chiesto › Percorsi › «Elenco esame», con tocchi veri ── */
  await p.evaluate(()=>{document.querySelector('#hmNew .hm-rq-largo').scrollIntoView({block:'center'});});await pausa(300);
  let f=await film(p,()=>tap(p,()=>document.querySelector('#hmNew .hm-rq-largo')),1000);pulito('Home → Chiesto all’esame',f,'pagina:chiesto');
  f=await film(p,()=>tap(p,chip,'Elenco esame'),700);pulito('chip «Elenco esame»',f,'pagina:chiesto');
  let v=await p.evaluate(()=>{const r=[...document.querySelectorAll('#scnOv .ch-r')];return {ses:nccChiestoStato().ses,n:r.length,
    prima:r[0].querySelector('b').textContent,ultima:r[r.length-1].querySelector('b').textContent,nota:document.querySelector('#scnOv .ch-nota').textContent,
    soli:r.filter(x=>x.querySelector('.qc-li').textContent==='📋').map(x=>x.querySelector('b').textContent)};});
  console.log(' elenco › percorsi                   ',J(v));
  ok(v.ses==='elenco'&&v.n===147&&v.prima==='Bande Nere → Cimitero Monumentale'&&v.ultima==='Piazza del Rosario → Linate','l’elenco dei percorsi: '+J(v));
  ok(/nell’ordine del foglio/.test(v.nota)&&J(v.soli)===J(['Duomo → Linate','Duomo → Piazza Firenze','Ospedale San Carlo → Cordusio']),'nota e 📋: '+J(v));
  /* un percorso che c'e' solo nell'elenco, e uno chiesto e anche nell'elenco */
  f=await film(p,()=>tap(p,riga,'Duomo → Linate'),800);pulito('Duomo → Linate',f,'popup');
  v=await p.evaluate(()=>document.querySelector('#popOv .ch-dove').textContent);
  ok(/Non è nei resoconti degli orali: è nell’elenco d’esame/.test(v),'il popup del percorso solo nell’elenco: '+v);
  await p.evaluate(()=>nccChiudiPopup());await pausa(350);
  await tap(p,riga,'Centrale → San Siro');await pausa(700);
  v=await p.evaluate(()=>document.querySelector('#popOv .ch-dove').textContent);
  ok(/^Chiesto 8 volte/.test(v)&&/📋 Anche nell’elenco d’esame$/.test(v),'il popup del percorso chiesto: '+v);
  await p.evaluate(()=>nccChiudiPopup());await pausa(350);
  /* dal libro ai tuoi, poi sulla mappa e ritorno: si torna sull'elenco, con «Elenco esame» in vista, senza vedere la Home */
  await tap(p,riga,'Duomo → Linate');await pausa(700);
  await tap(p,()=>[...document.querySelectorAll('#popOv .pop-b')].find(b=>/Aggiungi ai miei percorsi/.test(b.textContent)));await pausa(900);
  v=await p.evaluate(()=>{const r=[...document.querySelectorAll('#scnOv .ch-r')].find(r=>r.querySelector('b').textContent.indexOf('Duomo → Linate')===0);
    return {st:r&&r.querySelector('.ch-st').textContent,ses:nccChiestoStato().ses,on:(document.querySelector('#scnOv .ch-chip.on')||{}).textContent};});
  ok(/Fra i tuoi percorsi/.test(v.st)&&v.ses==='elenco'&&v.on==='Elenco esame','aggiunto dal libro: '+J(v));
  await tap(p,riga,'Duomo → Linate');await pausa(700);
  f=await film(p,()=>tap(p,()=>[...document.querySelectorAll('#popOv .pop-b')].find(b=>/Apri sulla mappa/.test(b.textContent))),1600);pulito('Apri sulla mappa',f,'mappa');
  f=await film(p,()=>tap(p,()=>document.getElementById('tpBack')),1300);pulito('mappa ‹ → elenco',f,'pagina:chiesto');
  v=await p.evaluate(()=>{const r=document.querySelector('#scnOv .ch-ses'),c=r&&r.querySelector('.ch-chip.on');if(!c)return null;const a=r.getBoundingClientRect(),b=c.getBoundingClientRect();
    return {on:c.textContent,dentro:b.left>=a.left-1&&b.right<=a.right+1,ses:nccChiestoStato().ses,n:document.querySelectorAll('#scnOv .ch-r').length};});
  ok(v&&v.on==='Elenco esame'&&v.dentro&&v.ses==='elenco'&&v.n===147,'tornando dalla mappa: '+J(v));

  /* ── 3 · cambiando scheda «Elenco esame» resta scelto e in vista ── */
  for(const [t,n] of [['Piazze',18],['Regole',22]]){
    f=await film(p,()=>tap(p,scheda,t),600);pulito('scheda '+t,f,'pagina:chiesto');
    v=await p.evaluate(()=>{const r=document.querySelector('#scnOv .ch-ses'),c=r.querySelector('.ch-chip.on'),a=r.getBoundingClientRect(),b=c.getBoundingClientRect();
      return {on:c.textContent,dentro:b.left>=a.left-1&&b.right<=a.right+1,n:document.querySelectorAll('#scnOv .ch-r').length};});
    ok(v.on==='Elenco esame'&&v.dentro&&v.n===n,'scheda '+t+': '+J(v));
  }
  v=await p.evaluate(()=>[...document.querySelectorAll('#scnOv .ch-r b')].slice(0,2).map(x=>x.textContent));
  ok(v[0]==='Le sedi istituzionali di Milano'&&/^Obblighi a inizio/.test(v[1]),'le regole dell’elenco, nell’ordine del foglio: '+J(v));

  /* ── 4 · un tema: la risposta da dare, chiusa; aprendola il riquadro cresce piano ── */
  f=await film(p,()=>tap(p,riga,'Le sedi istituzionali di Milano'),800);pulito('le sedi',f,'popup');
  v=await p.evaluate(()=>{const d=document.querySelector('#popOv .ch-risp');return {dove:document.querySelector('#popOv .ch-dove').textContent,
    c:!!d,open:d&&d.open,sum:d&&d.querySelector('summary').textContent,az:[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent)};});
  ok(/elenco d’esame/.test(v.dove)&&v.c&&!v.open&&v.sum==='👀 La risposta da dare'&&J(v.az)===J(['Chiudi']),'il tema delle sedi: '+J(v));
  await pausa(300);
  const h0=await p.evaluate(()=>document.querySelector('#popOv .pop-box').getBoundingClientRect().height);
  const camp=p.evaluate(()=>__campiona(()=>{const b=document.querySelector('#popOv .pop-box');return b?Math.round(b.getBoundingClientRect().height):-1;},620));
  await tap(p,()=>document.querySelector('#popOv .ch-risp summary'));
  let hh=await camp;
  const sale=hh.filter((x,i)=>i&&x!==hh[i-1]);
  console.log(' risposta, altezza a ogni fotogramma ',J(hh.filter((x,i)=>!i||x!==hh[i-1])));
  ok(sale.length>=5&&hh.every((x,i)=>!i||x>=hh[i-1]-1)&&hh[hh.length-1]>h0+60,'il riquadro non cresce piano: '+J(hh));
  await pausa(450);
  v=await p.evaluate(()=>{const d=document.querySelector('#popOv .ch-risp'),c=document.querySelector('#popOv .ch-pop'),b=document.querySelector('#popOv .pop-box');
    return {open:d.open,li:d.querySelectorAll('li').length,t:d.textContent,top:Math.round(d.getBoundingClientRect().top-c.getBoundingClientRect().top),
      st:b.style.height+'|'+b.style.transition,dentro:b.getBoundingClientRect().top>=0};});
  ok(v.open&&v.li===11&&/Palazzo Diotti \(Palazzo del Governo\): la Prefettura · Corso Monforte 31/.test(v.t)&&/Palazzo Isimbardi: la Città metropolitana/.test(v.t),'la risposta delle sedi: '+J(v).slice(0,300));
  ok(v.top>=0&&v.top<=24,'la risposta aperta non è in vista: '+v.top);
  ok(v.st==='|'&&v.dentro,'il riquadro resta con l’altezza fissa: '+J(v));
  /* richiusa: torna piano */
  const camp2=p.evaluate(()=>__campiona(()=>Math.round(document.querySelector('#popOv .pop-box').getBoundingClientRect().height),620));
  await tap(p,()=>document.querySelector('#popOv .ch-risp summary'));
  hh=await camp2;
  ok(hh.filter((x,i)=>i&&x!==hh[i-1]).length>=5&&hh.every((x,i)=>!i||x<=hh[i-1]+1)&&Math.abs(hh[hh.length-1]-h0)<3,'richiusa non torna piano com’era: '+J(hh));
  ok(await p.evaluate(()=>!document.querySelector('#popOv .ch-risp').open),'la risposta non si è richiusa');
  f=await film(p,()=>tap(p,()=>[...document.querySelectorAll('#popOv .pop-b')].find(b=>b.textContent==='Chiudi')),700);pulito('Chiudi',f,'pagina:chiesto');
  /* un tema col quiz e le tariffe: la risposta c'e', i tasti restano */
  await tap(p,riga,'Le tariffe predeterminate');await pausa(700);
  v=await p.evaluate(()=>({li:document.querySelectorAll('#popOv .ch-risp li').length,f:(document.querySelector('#popOv .ch-fonte')||{}).textContent,
    az:[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent)}));
  ok(v.li===7&&/Tariffe taxi Comune di Milano/.test(v.f)&&v.az.length===3&&/^Fai \d+ domande sul tema$/.test(v.az[1]),'le tariffe predeterminate: '+J(v));
  await p.evaluate(()=>nccChiudiPopup());await pausa(350);
  /* Tutte: le sedi in fondo, senza numero */
  await tap(p,chip,'Tutte');await pausa(500);
  v=await p.evaluate(()=>{const r=[...document.querySelectorAll('#scnOv .ch-r')],u=r[r.length-1];return {n:r.length,t:u.querySelector('b').textContent,num:!!u.querySelector('.qc-n'),
    s:u.querySelector('.ch-st').textContent,nota:document.querySelector('#scnOv .ch-nota').textContent};});
  ok(v.n===24&&v.t==='Le sedi istituzionali di Milano'&&!v.num&&v.s==='Elenco'&&/la risposta da dare/.test(v.nota),'Regole › Tutte: '+J(v));
  await p.evaluate(()=>{try{nccInfo('chiesto');}catch(e){}});await pausa(500);
  v=await p.evaluate(()=>{const x=document.getElementById('popOv');return x?x.textContent:'';});
  ok(/«Elenco esame» è l’elenco d’esame/.test(v)&&/la risposta da dare/.test(v),'la (i) non parla dell’elenco: '+v.slice(0,120));
  await p.evaluate(()=>nccChiudiPopup());await pausa(300);

  /* ── 5 · la simulazione dell'orale con l'elenco ── */
  await p.evaluate(()=>{try{nccSezChiudi(true);}catch(e){}goHome();nccSez('quiz');});await pausa(800);
  await tap(p,()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>/Simulazione dell.orale/.test(x.textContent)));await pausa(900);
  v=await p.evaluate(()=>[...document.querySelectorAll('#scnBody .ch-chip')].map(c=>c.textContent));
  ok(v.length===7&&v[6]==='Elenco esame','le sessioni dell’orale: '+J(v));
  await tap(p,chip=>[...document.querySelectorAll('#scnBody .ch-chip')].find(c=>c.textContent===chip),'Elenco esame');await pausa(400);
  await tap(p,()=>document.querySelector('#scnBody .ora-go'));await pausa(700);
  v=await p.evaluate(()=>{const C=nccChiestoMotore.conti(),o=nccOraleStato();
    return {ses:o.ses,el:o.prove.map(x=>{const m=x.x==='perc'?C.P:(x.x==='pz'?C.K:C.R);return !!(m[x.k]&&m[x.k].ses.elenco);}),
      d:o.prove[3].d,dd:C.R[o.prove[3].k].dom.find(z=>z.d===o.prove[3].d).ses};});
  console.log(' orale con l’elenco                  ',J(v));
  ok(v.ses==='elenco'&&v.el.every(Boolean)&&v.dd.indexOf('elenco')>=0,'orale «Elenco esame»: prove fuori dall’elenco '+J(v));
  /* la domanda senza la nota del resoconto, vista e letta */
  await p.evaluate(()=>{try{nccSezChiudi(true);}catch(e){}goHome();nccSez('quiz');});await pausa(600);
  ok(await p.evaluate(()=>nccOraleProva(['CENTRALE>SANSIRO','LINATE>CENTRALE','LORETO','aeroporti'])),'nccOraleProva non parte');await pausa(500);
  for(let t=0;t<3;t++){await tap(p,()=>document.querySelector('#scnBody .ora-go'));await pausa(450);await tap(p,()=>document.querySelector('#scnBody .ora-v.si'));await pausa(550);}
  v=await p.evaluate(()=>({vista:document.querySelector('#scnBody .ora-dom').textContent,letta:nccOraleTesto(3),d:nccOraleStato().prove[3].d}));
  console.log(' la domanda                          ',J(v));
  ok(/\(domanda unica\)/.test(v.d)&&v.vista==='«Obblighi di prestazione dagli aeroporti e dalle stazioni»'&&v.letta==='Obblighi di prestazione dagli aeroporti e dalle stazioni','la domanda con la nota: '+J(v));
  /* i punti di questa domanda: una domanda su Verona evidenzia la regola e Verona, non Vicenza */
  await p.evaluate(()=>{try{nccSezChiudi(true);}catch(e){}goHome();nccSez('quiz');});await pausa(600);
  await p.evaluate(()=>nccOraleProva(['CENTRALE>SANSIRO','LINATE>CENTRALE','LORETO','fuori']));await pausa(500);
  for(let t=0;t<3;t++){await tap(p,()=>document.querySelector('#scnBody .ora-go'));await pausa(450);await tap(p,()=>document.querySelector('#scnBody .ora-v.si'));await pausa(550);}
  await tap(p,()=>document.querySelector('#scnBody .ora-go'));await pausa(600);
  v=await p.evaluate(()=>({d:nccOraleStato().prove[3].d,q:[...document.querySelectorAll('#scnBody .ora-punti li')].map(l=>l.classList.contains('qui')?1:0)}));
  ok(/Verona/.test(v.d)&&J(v.q)===J([1,1,0]),'i punti evidenziati: '+J(v));
  v=await p.evaluate(()=>{const l=[...document.querySelectorAll('#scnBody .ora-punti li')].map(x=>Math.round(x.getBoundingClientRect().left));return l;});
  ok(v.every(x=>x===v[0]),'i punti evidenziati non sono allineati agli altri: '+J(v));
  await pausa(300);await p.screenshot({path:'/tmp/elenco-orale.png'}).catch(()=>{});

  /* ── 6 · Cosa & Dove: la Prefettura ── */
  v=await p.evaluate(()=>{const D=window.__LUOGHI__,t=[];Object.keys(D).forEach(k=>D[k].forEach(x=>{if(/Prefettura|Isimbardi/.test(x[0]))t.push(x.join(' | '));}));
    try{buildLuoghi();}catch(e){}return {t,L:(typeof LUOGHI!=='undefined'&&LUOGHI[194])?LUOGHI[194].cosa+' | '+LUOGHI[194].dove:null};});
  ok(J(v.t)===J(['Prefettura (Palazzo Diotti) | Corso Monforte 31'])&&v.L==='Prefettura (Palazzo Diotti) | Corso Monforte 31','la Prefettura in Cosa & Dove: '+J(v));
  ok(!errs.length,'errori: '+errs.join(' | '));
  await ctx.close();

  /* ── 7 · telefono piccolo, tema scuro: niente esce di lato ── */
  for(const o of [{vp:{width:320,height:568}},{vp:{width:390,height:844},scuro:true}]){
    ({ctx,p,errs}=await apri(o));
    await p.evaluate(()=>{nccChiesto({tab:'reg'});});await pausa(700);
    await tap(p,chip,'Elenco esame');await pausa(500);
    let l=await p.evaluate(()=>__largo());ok(l.sc<=l.W&&!l.l.length,(o.scuro?'scuro':'320')+': esce di lato (regole) '+J(l));
    await tap(p,riga,'Le tariffe predeterminate');await pausa(700);
    await tap(p,()=>document.querySelector('#popOv .ch-risp summary'));await pausa(800);
    l=await p.evaluate(()=>__largo());ok(l.sc<=l.W&&!l.l.length,(o.scuro?'scuro':'320')+': esce di lato (risposta) '+J(l));
    const g=await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-box').getBoundingClientRect(),z=[...document.querySelectorAll('#popOv .pop-b')].map(x=>x.getBoundingClientRect());
      return {top:Math.round(b.top),bott:Math.round(b.bottom),H:innerHeight,tasti:z.every(r=>r.bottom<=innerHeight+1&&r.top>=0)};});
    ok(g.top>=0&&g.tasti,(o.scuro?'scuro':'320')+': il riquadro esce dallo schermo '+J(g));
    await p.screenshot({path:'/tmp/elenco-'+(o.scuro?'scuro':'320')+'.png'}).catch(()=>{});
    ok(!errs.length,'errori: '+errs.join(' | '));
    await ctx.close();
  }
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await B.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
