/* LA CACCIA AI BUG (v161): quello che si e' trovato, provato uno per uno (e fotogramma per fotogramma dove si muove qualcosa)
   · le caselle dove si scrive hanno il testo almeno a 16 punti (sotto, iPhone ingrandisce la pagina e la lascia ingrandita)
   · la striscia «giorni di fila»: il giorno dopo il cambio dell'ora non torna a 1; conta anche l'app ripresa dal sottofondo
     il giorno dopo; con due dispositivi (iPhone un giorno, iPad il giorno dopo) i giorni si sommano passando dal cloud;
     la prima volta i giorni vengono dalla striscia di prima
   · la Home ripresa la mattina dopo: «Buongiorno», il coach e il riquadro del ripasso di oggi (prima restavano quelli di ieri)
   · la data dell'esame a parole: oggi («È oggi: in bocca al lupo!»), domani, fra 10 giorni, 3 giorni fa (Home e Profilo)
   · i singolari: «1 domanda», «1 percorso», «1 marker rimosso», «C’è 1 via»… negli avvisi, nelle finestre e nelle pagine;
     le caselle e quello che hai detto all'orale non si toccano
   · «Percorsi gemelli» uguali a prima (sui 212 percorsi), ma una volta sola finche' i percorsi non cambiano; la scheda del
     coach vecchia (nascosta) non si calcola piu'; tornare alla Home costa poco
   · la versione nuova: la prima apertura non si ricarica; a meta' di un quiz aspetta e si mette tornando alla Home
   · i fogli dal basso col testo lungo: sul telefono piccolo si vede l'inizio e il tasto resta in fondo; dentro un elenco che
     scorre, tornare su col dito scorre e non chiude il foglio; trascinato da in cima si chiude come prima
   · col telefono girato, sulla mappa i tasti ◀ 👁️ ▶ stanno sopra la barra in basso e la via in cui sei si vede sopra di loro
   · la settimana delle Statistiche la sera del cambio dell'ora: sette giorni diversi
   · sul telefono piccolo (320): il tasto «↕ Nome» dei percorsi resta nello schermo; nei fogli con le caselle
     (Proteggi i dati, il nome) i tasti non coprono la casella; un foglio lungo senza caselle tiene i tasti in fondo
   · «Salva copia» porta anche il nome, l'obiettivo del giorno e la striscia; ripristinare una copia vecchia non
     toglie i giorni di studio (e la striscia resta)
   · sulla mappa l'avviso «📍 Nessun marker» compare sotto Studio · Cieco · Quiz vie, che restano da toccare
   · «Domande nuove» (e il quiz di «Oggi») ha 30 domande anche quando fra quelle pescate ce ne sono due uguali (prima 29)
   uso: node test/giro-caccia.js */
const {chromium}=(()=>{try{return require('playwright');}catch(e){return require('/home/claude/.npm-global/lib/node_modules/playwright');}})();
const fs=require('fs'),path=require('path');
const {seed,BASE}=require('./lib');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
const G=86400000;
let B;
async function apri(o){
  o=o||{};
  const ctx=await B.newContext({viewport:o.vp||{width:390,height:844},serviceWorkers:o.sw?'allow':'block',timezoneId:'Europe/Rome',
    hasTouch:true,isMobile:o.mobile!==false,deviceScaleFactor:1});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();const ora=o.ora||Date.now();
  const dati=Object.assign({routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(ora),
    azzerato2026:String(ora)},o.dati||{});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__c'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__c','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon|ERR_INTERNET/.test(t))errs.push('console: '+t);}});
  if(o.ora)await p.clock.install({time:o.ora});
  let carichi=0;p.on('load',()=>carichi++);
  await p.goto(BASE+'index.html',{waitUntil:'load'});
  if(o.ora)await p.clock.runFor(7000);else await p.waitForTimeout(o.attesa||6500);
  return {ctx,p,errs,carichi:()=>carichi};
}
const AIUTI=`(function(){
window.__vedo=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),e=document.elementFromPoint(X,Y),c=e;
  var q=document.getElementById('quizApp');if(q&&q.classList.contains('open')&&c&&q.contains(c))return 'quiz';
  while(c&&c!==document.body&&c!==document.documentElement){var cs=getComputedStyle(c);
    if(c.id==='popOv')return 'popup';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='homeScreen')return 'home';
    if(c.id&&(cs.position==='fixed'||cs.position==='absolute'&&c.parentElement===document.body))return c.id;c=c.parentElement;}
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};
window.__film=[];window.__filmOn=false;
var s=document.createElement('div');s.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px;pointer-events:none;';
document.documentElement.appendChild(s);var g=0;
new ResizeObserver(function(){try{if(window.__filmOn){var v=__vedo(),L=window.__film;if(!L.length||L[L.length-1]!==v)L.push(v);}}catch(e){}}).observe(s);
(function giro(){g=1-g;s.style.width=(1+g)+'px';requestAnimationFrame(giro);})();
})();`;

(async()=>{
  B=await chromium.launch({headless:true,args:['--no-sandbox']});

  /* ── 1 · le caselle a 16 punti ── */
  {const {ctx,p,errs}=await apri();
  await p.evaluate(()=>{goTopografia();openMgr();});await p.waitForTimeout(700);
  let fs1=await p.evaluate(()=>parseFloat(getComputedStyle(document.getElementById('mgrF')).fontSize));
  await p.evaluate(()=>{try{closeMgr();}catch(e){}goHome();openQuiz();setTimeout(()=>{buildQuiz();startQuiz([QUIZ_ALL[0]],{mode:'study',title:'x'});
    setTimeout(()=>{const it=Q.items[0];qPick((it.correct+1)%it.choices.length);},500);},300);});
  await p.waitForTimeout(2600);
  await p.evaluate(()=>{const b=document.getElementById('spBtn');if(b)b.click();});await p.waitForTimeout(900);
  await p.evaluate(()=>{const b=document.querySelector('#popOv .sp-segb');if(b)b.click();});await p.waitForTimeout(500);
  let fs2=await p.evaluate(()=>{const t=document.getElementById('spSegN');return t?parseFloat(getComputedStyle(t).fontSize):null;});
  console.log(' caselle: Percorsi salvati',fs1,'· Non mi convince',fs2);
  ok(fs1>=16&&fs2>=16,'caselle sotto i 16 punti: '+J([fs1,fs2]));
  ok(!errs.length,'errori (caselle): '+errs.join(' | '));await ctx.close();}
  /* ...e col testo piu' grande, sul telefono piccolo il tasto «↕ Nome» resta dentro lo schermo */
  {const {ctx,p,errs}=await apri({vp:{width:320,height:568}});
  await p.evaluate(()=>{goTopografia();openMgr();});await p.waitForTimeout(700);
  const m=await p.evaluate(()=>{const b=document.getElementById('srtBtn').getBoundingClientRect(),f=document.getElementById('mgrF').getBoundingClientRect();
    return {tasto:[Math.round(b.left),Math.round(b.right)],casella:[Math.round(f.left),Math.round(f.right)],W:innerWidth};});
  console.log(' «Cerca» e «↕ Nome», 320    ',J(m));
  ok(m.tasto[1]<=m.W&&m.casella[1]<=m.tasto[0],'il tasto «↕ Nome» esce dallo schermo: '+J(m));
  ok(!errs.length,'errori (casella stretta): '+errs.join(' | '));await ctx.close();}

  /* ── 2 · la striscia: cambio dell'ora e app ripresa ── */
  {const {ctx,p,errs}=await apri({ora:new Date('2026-10-24T10:00:00+02:00').getTime()});
  const giro=async(quando,ricarica)=>{await p.clock.setSystemTime(new Date(quando));
    if(ricarica){await p.reload();await p.clock.runFor(7000);}
    else{await p.evaluate(()=>{document.dispatchEvent(new Event('visibilitychange'));});await p.clock.runFor(1500);}
    return p.evaluate(()=>({n:(JSON.parse(localStorage.getItem('streak')||'{}')||{}).n,badge:(document.getElementById('streakBadge')||{}).textContent||''}));};
  const v=[];
  v.push(await p.evaluate(()=>JSON.parse(localStorage.getItem('streak')||'{}').n));
  v.push((await giro('2026-10-25T10:00:00+02:00',true)).n);
  v.push((await giro('2026-10-26T10:00:00+01:00',true)).n);     /* il giorno dopo il cambio dell'ora */
  const r=await giro('2026-10-27T09:00:00+01:00',false);v.push(r.n);   /* ripresa, non ricaricata */
  v.push((await giro('2026-10-29T09:00:00+01:00',true)).n);     /* saltato un giorno: si riparte */
  console.log(' striscia 24→29 ottobre      ',J(v),'·',r.badge);
  ok(J(v)===J([1,2,3,4,1])&&/4 giorni di fila/.test(r.badge),'la striscia col cambio dell’ora e la ripresa: '+J(v)+' '+r.badge);
  ok(!errs.length,'errori (striscia): '+errs.join(' | '));await ctx.close();}

  /* ── 3 · la striscia con due dispositivi, e la prima volta dalla striscia di prima ── */
  {const t0=new Date('2026-11-02T09:00:00+01:00').getTime();
  const A=await apri({ora:t0}),Bd=await apri({ora:t0});
  const cloud={};
  const passa=async(x,quando)=>{await x.p.clock.setSystemTime(new Date(quando));await x.p.reload();await x.p.clock.runFor(7000);
    await x.p.evaluate(c=>{try{nccSyncUnisci(c);}catch(e){}},cloud);await x.p.clock.runFor(500);
    Object.assign(cloud,await x.p.evaluate(()=>nccSyncRaccogli()));
    return x.p.evaluate(()=>JSON.parse(localStorage.getItem('streak')||'{}').n);};
  const v=[];
  v.push(await passa(A,'2026-11-02T09:00:00+01:00'));
  v.push(await passa(Bd,'2026-11-03T09:00:00+01:00'));
  v.push(await passa(A,'2026-11-04T09:00:00+01:00'));
  v.push(await passa(Bd,'2026-11-05T09:00:00+01:00'));
  console.log(' due dispositivi lun→gio     ',J(v));
  ok(J(v)===J([1,2,3,4]),'la striscia con due dispositivi: '+J(v));
  ok(!A.errs.length&&!Bd.errs.length,'errori (due dispositivi): '+A.errs.concat(Bd.errs).join(' | '));
  await A.ctx.close();await Bd.ctx.close();
  /* la prima volta: dalla striscia di prima (7 giorni fino a ieri) */
  const t1=new Date('2026-11-10T09:00:00+01:00').getTime();
  const C=await apri({ora:t1,dati:{streak:JSON.stringify({n:7,last:new Date('2026-11-09T00:00:00+01:00').getTime()})}});
  const pr=await C.p.evaluate(()=>({n:JSON.parse(localStorage.getItem('streak')||'{}').n,g:JSON.parse(localStorage.getItem('nccGiorni')||'[]')}));
  console.log(' dalla striscia di prima     ',J({n:pr.n,giorni:pr.g.length,primo:pr.g[0],ultimo:pr.g[pr.g.length-1]}));
  ok(pr.n===8&&pr.g.length===8&&pr.g[0]==='2026-11-03'&&pr.g[7]==='2026-11-10','la prima volta: '+J(pr));
  await C.ctx.close();}

  /* ── 4 · la Home ripresa la mattina dopo ── */
  {const t0=new Date('2026-11-10T22:00:00+01:00').getTime();
  const {ctx,p,errs}=await apri({ora:t0,dati:{qtStats:JSON.stringify({cat:{},err:{'5':{box:1,due:t0+10*3600000},'6':{box:1,due:t0+10*3600000},'7':{box:2,due:t0+5*G}}})}});
  const home=()=>p.evaluate(()=>{const t=s=>{const e=document.querySelector(s);return e?e.textContent.replace(/\s+/g,' ').trim():'';};
    const r=document.querySelector('#hmNew .hm-rq[onclick^="nccRipasso("]');
    return {saluto:t('#hmNew .hm-ciao'),coach:t('#hmNew .co-t'),rip:r?((r.querySelector('.hm-rq-b')||{}).textContent||'')+' · '+t('#hmNew .hm-rq[onclick^="nccRipasso("] .hm-rq-s'):''};});
  const sera=await home();
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await p.clock.setSystemTime(t0+11*3600000);
  await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await p.clock.runFor(1500);
  const mattina=await home();
  console.log(' Home sera / mattina dopo    ',J(sera),'→',J(mattina));
  ok(sera.saluto==='Buonasera'&&mattina.saluto==='Buongiorno'&&mattina.coach==='2 cose da ripassare oggi'&&/^2 · 2\sdomande/.test(mattina.rip),'la Home ripresa: '+J(mattina));
  ok(!errs.length,'errori (Home ripresa): '+errs.join(' | '));await ctx.close();}

  /* ── 5 · la data dell'esame ── */
  for(const [g,casa,prof] of [[0,'Oggi·È oggi: in bocca al lupo!','· oggi'],[1,'1 giorno·domani','· domani'],[10,'10 giorni·fra 10 giorni','· fra 10 giorni'],[-3,'·data passata','· 3 giorni fa']]){
    const d=new Date();d.setDate(d.getDate()+g);
    const iso=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    const {ctx,p,errs}=await apri({dati:{examDate:JSON.stringify(iso)}});
    const t=await p.evaluate(()=>{const x=document.querySelector('#hmNew .hm-rq[onclick^="nccHmEsame"]');
      const b=x&&x.querySelector('.hm-rq-b'),w=x&&x.querySelector('.hm-rq-w'),s=x&&x.querySelector('.hm-rq-s');
      return ((b?b.textContent.trim():'')+(w&&w.textContent.trim()?' '+w.textContent.trim():''))+'·'+(s?s.textContent.trim():'');});
    await p.evaluate(()=>nccProfilo());await p.waitForTimeout(800);
    const pf=await p.evaluate(()=>{const r=[...document.querySelectorAll('#pfOv .pf-r')].find(e=>/Data dell/.test(e.textContent));return r?r.querySelector('.pf-d').textContent.trim():'';});
    console.log((' esame fra '+g+' giorni').padEnd(30),J(t),'|',J(pf));
    ok(t===casa&&pf.endsWith(prof),'la data dell’esame fra '+g+': '+J([t,pf]));
    ok(!errs.length,'errori (esame): '+errs.join(' | '));await ctx.close();}

  /* ── 6 · i singolari ── */
  {const {ctx,p,errs}=await apri();
  const prove=await p.evaluate(()=>['Hai 1 domande senza risposta. Terminare comunque?','fra 1 giorni','1 percorsi · 1 con i marker','⚠️ 1 marker rimossi (via mancanti)',
    '⚠️ Ci sono 1 vie duplicate','1 piazze ancora mai viste','Giusta 1 volta su 3','21 domande','Prova 1 di 4','1,5 giorni','Sono passati 1 giorni','1 minuti e 1 secondi']
    .map(t=>nccSingolare(t)));
  console.log(' singolari                   ',J(prove));
  ok(J(prove)===J(['Hai 1 domanda senza risposta. Terminare comunque?','fra 1 giorno','1 percorso · 1 con i marker','⚠️ 1 marker rimosso (via mancanti)',
    '⚠️ C’è 1 via duplicata','1 piazza ancora mai vista','Giusta 1 volta su 3','21 domande','Prova 1 di 4','1,5 giorni','È passato 1 giorno','1 minuto e 1 secondo']),'i singolari: '+J(prove));
  /* nelle pagine: un avviso, una finestra, una riga; non nelle caselle */
  await p.evaluate(()=>{toast2('⚠️ 1 marker rimossi (via mancanti)');nccPopup({titolo:'Prova',testo:'Hai 1 domande senza risposta',
    html:'<div id="cc1"><b>1</b> errori da rivedere</div><input id="cc2" value="1 domande">',azioni:[{t:'OK',stile:'pieno'}]});});
  await p.waitForTimeout(400);
  const dom=await p.evaluate(()=>({t:[...document.querySelectorAll('#toastStack .toastN')].map(x=>x.textContent).pop(),
    pop:document.querySelector('#popOv .pop-x').textContent,b:document.getElementById('cc1').textContent,inp:document.getElementById('cc2').value}));
  console.log(' nelle pagine                ',J(dom));
  ok(dom.t==='⚠️ 1 marker rimosso (via mancanti)'&&dom.pop==='Hai 1 domanda senza risposta'&&dom.b==='1 errore da rivedere'&&dom.inp==='1 domande','i singolari nelle pagine: '+J(dom));
  ok(!errs.length,'errori (singolari): '+errs.join(' | '));await ctx.close();}

  /* ── 7 · percorsi gemelli: gli stessi di prima, calcolati una volta; la Home veloce ── */
  {const lib=(()=>{global.window=global.window||{};eval(fs.readFileSync(path.join(__dirname,'..','percorsi-data.js'),'utf8'));return global.window.__PERCORSI_PDF__;})();
  const R=seed().routes.concat(lib.map(x=>({id:'lib_'+x.id,title:x.t,steps:x.s.slice(),pdf:x.id})));
  const {ctx,p,errs}=await apri({dati:{routes:JSON.stringify(R)}});
  const r=await p.evaluate(()=>{
    const vecchio=function(){var out=[];for(var i=0;i<routes.length;i++)for(var j=i+1;j<routes.length;j++){var a=routes[i],b=routes[j];
      var setB={};b.steps.forEach(function(s){setB[s]=1;});var common=a.steps.filter(function(s){return setB[s];});
      if(common.length>=5)out.push({a:a,b:b,n:common.length,vie:common});}return out.sort(function(x,y){return y.n-x.n;}).slice(0,6);};
    const firma=l=>JSON.stringify(l.map(x=>[x.a.id,x.b.id,x.n,x.vie]));
    let t=performance.now();const v=firma(vecchio());const tv=performance.now()-t;
    t=performance.now();const n1=firma(twinRoutes());const t1=performance.now()-t;
    t=performance.now();twinRoutes();const t2=performance.now()-t;
    routes.push({id:'zz',title:'NUOVO',steps:routes[5].steps.slice()});const n3=firma(twinRoutes());routes.pop();
    const n4=firma(twinRoutes());
    let c=0;const o=coachTasks;coachTasks=function(){c++;return o.apply(this,arguments);};
    t=performance.now();goHome();const th=performance.now()-t;coachTasks=o;
    return {uguali:v===n1,ms:[Math.round(tv),Math.round(t1),Math.round(t2),Math.round(th)],nuovo:n3!==n1&&/zz/.test(n3),dinuovo:n4===n1,coach:c,n:routes.length};});
  console.log(' gemelli                     ',J(r));
  ok(r.uguali&&r.nuovo&&r.dinuovo&&r.ms[2]<=5,'percorsi gemelli: '+J(r));
  ok(r.coach<=1,'tornando alla Home il coach si calcola '+r.coach+' volte (al più una per la Home; la scheda vecchia nascosta no)');
  ok(!errs.length,'errori (gemelli): '+errs.join(' | '));await ctx.close();}

  /* ── 8 · la versione nuova ── */
  {const {ctx,p,errs,carichi}=await apri({sw:true,attesa:9000});
  const c1=carichi();
  await p.evaluate(()=>{openQuiz();setTimeout(()=>{buildQuiz();startQuiz(QUIZ_ALL.slice(0,5),{mode:'study',title:'x'});},300);});
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{window.__avv=[];const t=toast2;toast2=function(m){__avv.push(m);return t.apply(this,arguments);};
    navigator.serviceWorker.dispatchEvent(new Event('controllerchange'));});
  await p.waitForTimeout(2500);
  const meta=await p.evaluate(()=>({quiz:typeof Q!=='undefined'&&!!Q,avv:window.__avv.slice()}));const c2=carichi();
  await p.evaluate(()=>{try{closeQuiz();}catch(e){}goHome();});await p.waitForTimeout(3500);
  const c3=carichi();
  console.log(' versione nuova              ',J({primaApertura:c1,ametaQuiz:c2-c1,quiz:meta.quiz,avviso:meta.avv[0],allaHome:c3-c2}));
  ok(c1===1,'la prima apertura si ricarica da sola: '+c1+' caricamenti');
  ok(c2===c1&&meta.quiz&&/quando torni alla Home/.test(meta.avv[0]||''),'a metà del quiz: '+J(meta));
  ok(c3===c2+1,'tornando alla Home non si aggiorna');
  await ctx.close();}

  /* ── 9 · i fogli dal basso ── */
  {const {ctx,p,errs}=await apri({vp:{width:320,height:568}});
  await p.evaluate(()=>nccInfo('simorale'));await p.waitForTimeout(700);
  const f=await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-box'),t=b.querySelector('.pop-t'),h=b.querySelector('.pop-b');
    const rt=t.getBoundingClientRect(),rh=h.getBoundingClientRect();return {titolo:Math.round(rt.top),tasto:Math.round(rh.bottom),H:innerHeight,scorre:b.scrollHeight>b.clientHeight};});
  console.log(' la (i) dell’orale, 320×568  ',J(f));
  ok(f.titolo>=0&&f.tasto<=f.H&&f.scorre,'il foglio lungo: '+J(f));
  await p.screenshot({path:path.join(require('os').tmpdir(),'caccia-foglio-se.png')});
  await p.evaluate(()=>nccChiudiPopup());await p.waitForTimeout(400);
  /* dentro un elenco che scorre */
  await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);
  const trascina=async(su)=>{const r0=await p.evaluate(su=>{const l=document.querySelector('#popOv .sg-l');l.scrollTop=su?0:400;const r=l.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+40};},su);
    const cdp=await ctx.newCDPSession(p);const tocco=(type,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:r0.x,y}]});
    await tocco('touchStart',r0.y);for(let k=1;k<=12;k++){await tocco('touchMove',r0.y+k*15);await p.waitForTimeout(16);}await tocco('touchEnd');await p.waitForTimeout(600);
    return p.evaluate(()=>!!document.getElementById('popOv'));};
  const lista=()=>p.evaluate(()=>nccPopup({titolo:'Prova',html:'<div class="sg-l">'+Array.from({length:40},(x,i)=>'<div style="padding:10px 0">Riga '+(i+1)+'</div>').join('')+'</div>',azioni:[{t:'Chiudi',stile:'pieno'}]}));
  await lista();await p.waitForTimeout(600);const aperto=await trascina(false);
  await p.evaluate(()=>nccChiudiPopup());await p.waitForTimeout(300);
  await lista();await p.waitForTimeout(600);const chiuso=!(await trascina(true));
  console.log(' trascinare dentro l’elenco  ',J({scorsoGiu_restaAperto:aperto,inCima_siChiude:chiuso}));
  ok(aperto&&chiuso,'trascinare nei fogli: '+J({aperto,chiuso}));
  ok(!errs.length,'errori (fogli): '+errs.join(' | '));await ctx.close();}
  /* i fogli con le caselle (Proteggi i dati, il nome): sul telefono piccolo i tasti non coprono la casella */
  {const {ctx,p,errs}=await apri({vp:{width:320,height:568}});
  for(const [fn,id] of [['nccProteggi','auEm'],['nccPfNome','nmIn']]){
    await p.evaluate(f=>window[f](),fn);await p.waitForTimeout(900);
    const r=await p.evaluate(id=>{const i=document.getElementById(id),box=document.querySelector('#popOv .pop-box'),ri=i.getBoundingClientRect();
      const libera=[[ri.left+4,ri.top+4],[ri.right-4,ri.top+4],[ri.left+4,ri.bottom-4],[ri.right-4,ri.bottom-4]].every(q=>document.elementFromPoint(q[0],q[1])===i);
      box.scrollTop=box.scrollHeight;
      const tasti=[...box.querySelectorAll('.pop-b')].every(b=>{const q=b.getBoundingClientRect(),e=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);return e===b||b.contains(e);});
      return {attiva:document.activeElement===i,libera,tasti};},id);
    console.log((' foglio con casella '+fn).padEnd(30),J(r));
    ok(r.attiva&&r.libera&&r.tasti,'foglio con casella '+fn+': '+J(r));
    await p.evaluate(()=>nccChiudiPopup());await p.waitForTimeout(400);
  }
  /* un foglio lungo senza caselle tiene i tasti fermi in fondo */
  await p.evaluate(()=>nccPopup({titolo:'Prova',testo:'riga lunga '.repeat(400),azioni:[{t:'Va bene',stile:'pieno'}]}));await p.waitForTimeout(700);
  const fermo=await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b').getBoundingClientRect();return b.bottom<=innerHeight&&b.top>0;});
  ok(fermo,'il foglio lungo senza caselle: il tasto non resta in vista');
  await p.evaluate(()=>nccChiudiPopup());await p.waitForTimeout(400);
  ok(!errs.length,'errori (fogli con caselle): '+errs.join(' | '));await ctx.close();}

  /* ── 10 · la mappa col telefono girato ── */
  for(const vp of [{width:844,height:390},{width:568,height:320}]){
    const {ctx,p,errs}=await apri({vp});await p.addScriptTag({content:AIUTI});
    for(const modo of ['s','c','q']){
      await p.evaluate(m=>{goTopografia();setTimeout(()=>{selectRoute(routes[0]);setMode(m);},300);},modo);await p.waitForTimeout(1300);
      const r=await p.evaluate(m=>{const tab=document.getElementById('tabbar').getBoundingClientRect().top;
        const ids=m==='q'?['#qf .brow .btn']:['#bPrev','#bNext'];
        return ids.map(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {s,b:Math.round(r.bottom),vis:r.bottom<=tab+1&&r.height>0,tab:Math.round(tab)};});},modo);
      console.log((' mappa girata '+vp.width+'×'+vp.height+' '+modo).padEnd(30),J(r));
      ok(r.every(x=>x&&x.vis),'mappa girata '+vp.width+' modo '+modo+': i tasti sotto la barra '+J(r));
      /* la riga della via in cui sei si vede, sopra i tasti, andando avanti (sul 568×320 nel Quiz vie i tasti
         e la casella prendono tutto il pannello: li' non c'e' posto) */
      if(vp.width===568&&modo==='q')continue;
      const righe=[];
      for(let i=0;i<4;i++){
        righe.push(await p.evaluate(()=>{const row=listRows[step],pf=document.querySelector('#panel .pfoot'),pn=document.getElementById('panel'),sl=document.getElementById('sList');
          const a=row.getBoundingClientRect(),alto=Math.max(pn.getBoundingClientRect().top,sl.getBoundingClientRect().top);
          const bt=[...pf.querySelectorAll('button,input')].filter(x=>x.offsetParent&&x.getBoundingClientRect().height>0);
          const fT=Math.min(...bt.map(x=>x.getBoundingClientRect().top));return a.top>=alto-1&&a.bottom<=fT+1;}));
        await p.evaluate(m=>{try{if(m==='q')skipQ();else nextS();}catch(e){}},modo);await p.waitForTimeout(modo==='q'?900:500);
      }
      ok(righe.every(Boolean),'mappa girata '+vp.width+' modo '+modo+': la via in cui sei dietro i tasti '+J(righe));
    }
    ok(!errs.length,'errori (mappa girata): '+errs.join(' | '));await ctx.close();}

  /* ── 11 · la settimana delle Statistiche la sera del cambio dell'ora ── */
  {const {ctx,p,errs}=await apri({ora:new Date('2026-10-25T23:30:00+01:00').getTime()});
  await p.evaluate(()=>nccStat());await p.clock.runFor(1200);
  const g=await p.evaluate(()=>[...document.querySelectorAll('#scnBody .sx-col span')].map(x=>x.textContent));
  console.log(' settimana 25/10 23:30       ',J(g));
  ok(J(g)===J(['L','M','M','G','V','S','D']),'la settimana col cambio dell’ora: '+J(g));
  ok(!errs.length,'errori (settimana): '+errs.join(' | '));await ctx.close();}

  /* ── 12 · «Salva copia»: il nome, l'obiettivo, la striscia ci sono; una copia vecchia non toglie giorni di studio ── */
  {const oggi=new Date('2026-10-13T10:00:00+02:00').getTime();
  const {ctx,p,errs}=await apri({ora:oggi,dati:{nomeUtente:'Haseeb',nomeTs:String(oggi),dailyGoal:'45',
    nccGiorni:J(['2026-10-10','2026-10-11','2026-10-12'])}});
  const n0=await p.evaluate(()=>JSON.parse(localStorage.getItem('streak')||'{}').n);
  await p.evaluate(()=>{window.__blob=null;const o=URL.createObjectURL;URL.createObjectURL=function(b){window.__blob=b;return o.call(URL,b);};nccEsporta();});
  await p.clock.runFor(800);
  const k=await p.evaluate(async()=>{const t=window.__blob?await window.__blob.text():'{}';const d=(JSON.parse(t).dati)||{};
    return ['nomeUtente','dailyGoal','streak','nccGiorni','routes'].filter(x=>!(x in d));});
  console.log(' la copia: mancano           ',J(k),'· striscia',n0);
  ok(!k.length,'nella copia mancano: '+J(k));
  /* ripristino di una copia di settembre: i giorni di ottobre restano, la striscia pure */
  await p.evaluate(o=>{localStorage.setItem('nccGiorni',JSON.stringify(['2026-09-01','2026-09-02']));
    localStorage.setItem('streak',JSON.stringify({n:2,last:new Date('2026-09-02T00:00:00+02:00').getTime()}));},oggi);
  await p.clock.runFor(300);
  const dopo=await p.evaluate(()=>({g:JSON.parse(localStorage.getItem('nccGiorni')),n:JSON.parse(localStorage.getItem('streak')).n}));
  await p.reload();await p.clock.runFor(7000);
  const ric=await p.evaluate(()=>JSON.parse(localStorage.getItem('streak')).n);
  console.log(' copia vecchia ripristinata  ',J({giorni:dopo.g.length,striscia:dopo.n,dopoRicarica:ric}));
  ok(n0===4&&dopo.g.length===6&&dopo.n===4&&ric===4,'copia vecchia: '+J({n0,dopo,ric}));
  ok(!errs.length,'errori (copia): '+errs.join(' | '));await ctx.close();}

  /* ── 13 · «📍 Nessun marker» sotto Studio · Cieco · Quiz vie, che restano da toccare ── */
  for(const vp of [{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
    const {ctx,p,errs}=await apri({vp});
    await p.evaluate(()=>{goTopografia();setTimeout(()=>{selectRoute(routes.filter(r=>r.id==='r3')[0]);setMode('s');},300);});await p.waitForTimeout(900);
    const r=await p.evaluate(()=>{const h=document.getElementById('nmHint'),hb=h.getBoundingClientRect(),sb=document.getElementById('segCtrl').getBoundingClientRect();
      const tasti=['cSt','cCi','cQu'].map(id=>{const b=document.getElementById(id).getBoundingClientRect(),e=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);return !!e&&(e.id===id||document.getElementById(id).contains(e));});
      return {visto:getComputedStyle(h).display!=='none',sotto:hb.top>=sb.bottom,tasti,dentro:hb.left>=0&&hb.right<=innerWidth};});
    console.log((' «Nessun marker» '+vp.width+'×'+vp.height).padEnd(30),J(r));
    ok(r.visto&&r.sotto&&r.tasti.every(Boolean)&&r.dentro,'«Nessun marker» sopra i tasti '+vp.width+': '+J(r));
    ok(!errs.length,'errori (Nessun marker): '+errs.join(' | '));await ctx.close();}

  /* ── 14 · «Domande nuove» (il quiz di «Oggi»): 30 anche quando fra le pescate ci sono due domande uguali ── */
  {const {ctx,p,errs}=await apri();
  const r=await p.evaluate(()=>{buildQuiz();const m={};let cp=null;
    for(const it of QUIZ_ALL){if(!it)continue;const k=nccChiaveDomanda(it);if(m[k]&&!cp){cp=[m[k],it];break;}m[k]=it;}
    if(!cp)return {coppia:false};
    /* (buildQuiz rifà gli oggetti: si confrontano gli id) */
    const id0=cp[0].id,id1=cp[1].id;let messe=false;
    const _s=qShuffle;qShuffle=function(a){a=_s(a);const x0=a.find(x=>x&&x.id===id0),x1=a.find(x=>x&&x.id===id1);
      if(x0&&x1){a=a.filter(x=>x!==x0&&x!==x1);a.unshift(x0,x1);messe=true;}return a;};
    try{qStartNew();}finally{qShuffle=_s;}
    const ks=Q.items.map(nccChiaveDomanda);
    return {coppia:true,messe,n:Q.items.length,uniche:new Set(ks).size,unaSola:Q.items.filter(x=>x.id===id0||x.id===id1).length};});
  console.log(' «Domande nuove» con una doppia',J(r));
  ok(r.coppia&&r.messe&&r.n===30&&r.uniche===30&&r.unaSola===1,'«Domande nuove» con due domande uguali: '+J(r));
  await p.evaluate(()=>{try{qClose&&qClose();}catch(e){}});
  ok(!errs.length,'errori (domande nuove): '+errs.join(' | '));await ctx.close();}

  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await B.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
