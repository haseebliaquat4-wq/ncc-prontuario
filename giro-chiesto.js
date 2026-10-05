/* CHIESTO ALL'ESAME, fotogramma per fotogramma: si entra dal riquadro della Home e dalle righe delle pagine
   Topografia, Piazze, Norme e Quiz; ogni passaggio e' registrato a ogni fotogramma, subito prima che venga
   dipinto: mai schermo vuoto, mai Home di passaggio, mai sfarfallio, e si torna sempre dove si era.
   · percorsi: tuo (si apre sulla mappa, ‹ torna qui), nel libro (si aggiunge, resta dopo un ricarico),
     da preparare (Nuovo percorso col nome gia' scritto, Annulla torna qui)
   · piazze: c'e' (si apre sopra, ‹ e il tasto del telefono tornano qui), manca (si aggiunge, le vie le scrivi tu)
   · regole: l'articolo (‹ torna qui, non all'indice), il prontuario, le domande sul tema (finite si torna qui)
   · quiz: le 52 domande nuove, viste che si contano
   · le sessioni, aula per aula; 320 punti, iPad in orizzontale (due colonne), tema scuro
   uso: node test/giro-chiesto.js [iphone|se|ipado] [chiaro|scuro] */
const {launch,seed,BASE}=require('./lib');const fs=require('fs'),path=require('path'),os=require('os');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const SCH=process.argv[2]||'iphone',TEMA=process.argv[3]||'chiaro';
const VP={se:{width:320,height:568,touch:true,mobile:true},iphone:{width:390,height:844,touch:true,mobile:true},
  ipado:{width:1180,height:820,touch:true,mobile:false}}[SCH];
const OUT=path.join(process.env.CH_OUT||os.tmpdir(),'chiesto-'+SCH+'-'+TEMA);fs.mkdirSync(OUT,{recursive:true});
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const AIUTI=`(function(){
window.__vedo=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),e=document.elementFromPoint(X,Y),c=e;
  var q=document.getElementById('quizApp');if(q&&q.classList.contains('open')&&c&&q.contains(c))return 'quiz';
  while(c&&c!==document.body&&c!==document.documentElement){var cs=getComputedStyle(c);
    if(c.id==='popOv')return 'popup';
    if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');
    if(c.id==='homeScreen')return 'home';
    if(c.id==='map'||c.id==='panel')return 'mappa';
    if(c.classList&&c.classList.contains('modal')&&c.id)return 'modale:'+c.id;
    if(c.id&&(cs.position==='fixed'||cs.position==='absolute'&&c.parentElement===document.body))return c.id;
    c=c.parentElement;}
  if(document.body.classList.contains('on-topo'))return 'mappa';
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};
window.__film=[];window.__filmOn=false;
var s=document.createElement('div');s.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px;pointer-events:none;';
document.documentElement.appendChild(s);var g=0;
new ResizeObserver(function(){try{if(window.__filmOn){var v=__vedo(),L=window.__film;if(!L.length||L[L.length-1]!==v)L.push(v);}}catch(e){}}).observe(s);
(function giro(){g=1-g;s.style.width=(1+g)+'px';requestAnimationFrame(giro);})();
})();`;
(async()=>{
  const b=await launch();
  const ctx=await b.newContext({viewport:{width:VP.width,height:VP.height},serviceWorkers:'block',hasTouch:VP.touch,isMobile:VP.mobile,
    deviceScaleFactor:1,colorScheme:TEMA==='scuro'?'dark':'light'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();const oggi=Date.now();
  /* uno dei percorsi chiesti fra i tuoi: Centrale → San Siro, preso dal libro (pag. 45) */
  const dati={routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(oggi),
    azzerato2026:String(oggi),dark:TEMA==='scuro'?'true':'false'};
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('dialog',d=>{errs.push('dialog nativo: '+d.message().slice(0,60));d.dismiss().catch(()=>{});});
  const avvia=async()=>{await p.goto(BASE+'index.html',{waitUntil:'load'});await p.waitForTimeout(6000);await p.addScriptTag({content:AIUTI});};
  await avvia();
  await p.evaluate(()=>{const lib=__PERCORSI_PDF__.find(x=>x.id==='p45a');routes.push({id:'rSS',title:lib.t+' (pag. 45)',steps:lib.s.slice(),pdf:'p45a'});
    coords['rSS_0']={lat:45.486,lon:9.204};save();nccHomeRiquadri();});
  const vedo=()=>p.evaluate(()=>__vedo());
  const film=async(fn,ms)=>{await p.evaluate(()=>{__film=[];__filmOn=true;});await fn();await p.waitForTimeout(ms||1300);return p.evaluate(()=>{__filmOn=false;return __film.slice();});};
  const pulito=(nome,f,arrivo,da)=>{const s=f.join(' → ');
    ok(!f.some(x=>/^vuoto/.test(x)),nome+': schermo vuoto '+s);
    /* partendo da una schermata che non e' la Home, la Home non deve vedersi nemmeno nel primo fotogramma */
    ok(!(da&&da!=='home'?f.slice(0,-1):f.slice(1,-1)).includes('home')||arrivo==='home'||da==='home',nome+': Home di passaggio '+s);
    for(let i=2;i<f.length;i++)if(f[i]===f[i-2]&&f[i]!==f[i-1]){ok(false,nome+': sfarfallio '+s);break;}
    ok(f[f.length-1]===arrivo,nome+': arriva su «'+f[f.length-1]+'» invece di «'+arrivo+'» ('+s+')');
    console.log(' '+(nome+'                              ').slice(0,34)+s);};
  const foto=async n=>{try{await p.screenshot({path:path.join(OUT,n+'.png')});}catch(e){}};
  const stato=()=>p.evaluate(()=>nccChiestoStato());
  const riga=async t=>{const i=await p.evaluate(t=>[...document.querySelectorAll('#scnOv .ch-r')].findIndex(r=>r.querySelector('b').textContent.indexOf(t)===0),t);
    ok(i>=0,'riga «'+t+'» non trovata');return '#scnOv .ch-r >> nth='+i;};
  const tasto=async t=>{const i=await p.evaluate(t=>[...document.querySelectorAll('#popOv .pop-b')].findIndex(b=>b.textContent.indexOf(t)===0),t);
    ok(i>=0,'tasto «'+t+'» non trovato');return '#popOv .pop-b >> nth='+i;};
  const tocca=sel=>p.click(sel,{timeout:4000}).catch(e=>ok(false,'tocco '+sel+': '+e.message.split('\n')[0]));
  const sez=async k=>{await p.evaluate(k=>{try{nccChiudiPopup();}catch(e){}try{nccSezChiudi(true);}catch(e){}goHome();nccSez(k);},k);await p.waitForTimeout(700);};
  const home=async()=>{await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}try{nccSezChiudi(true);}catch(e){}goHome();});await p.waitForTimeout(600);};

  /* ── 1 · il riquadro largo in fondo alla Home ── */
  const rq=await p.evaluate(()=>{const g=document.querySelector('#hmNew .hm-griglia'),r=g.lastElementChild,a=g.getBoundingClientRect(),c=r.getBoundingClientRect();
    return {largo:r.classList.contains('hm-rq-largo'),t:r.querySelector('.hm-rq-t').textContent,b:(r.querySelector('.hm-rq-b')||{}).textContent,
      pieno:Math.abs(a.width-c.width)<2,s:r.querySelector('.hm-rq-s').scrollHeight<=r.querySelector('.hm-rq-s').clientHeight+1};});
  console.log('riquadro:',JSON.stringify(rq));
  ok(rq.largo&&rq.pieno&&/Chiesto all/.test(rq.t),'il riquadro largo in fondo alla Home non c’è '+JSON.stringify(rq));
  ok(rq.b==='1/148','il riquadro deve dire 1/148 (Centrale → San Siro fra i tuoi): '+rq.b);ok(rq.s,'il sottotitolo del riquadro è tagliato');
  await p.evaluate(()=>{document.querySelector('#hmNew .hm-rq-largo').scrollIntoView({block:'center'});});await p.waitForTimeout(300);
  let f=await film(()=>tocca('#hmNew .hm-rq-largo'));pulito('Home → pagina',f,'pagina:chiesto','home');
  await foto('1-percorsi');
  const conta=await p.evaluate(()=>({tab:[...document.querySelectorAll('#scnOv .ch-tabs .sx-tab')].map(t=>t.textContent),n:document.querySelectorAll('#scnOv .ch-r').length,
    si:document.querySelector('#scnOv .ch-somma').textContent}));
  console.log('schede:',conta.tab.join(' | '),'· righe',conta.n,'·',conta.si);
  ok(conta.n===148&&/1 fra i tuoi/.test(conta.si),'percorsi: '+JSON.stringify(conta));
  f=await film(()=>tocca('#scnOv .t-back'));pulito('‹ → Home',f,'home','pagina:chiesto');
  await p.evaluate(()=>nccChiesto());await p.waitForTimeout(700);
  f=await film(()=>p.evaluate(()=>history.back()));pulito('indietro del telefono → Home',f,'home');

  /* ── 2 · dalle righe delle pagine: ‹ e il tasto del telefono tornano alla pagina ── */
  for(const [k,nome,tab] of [['topo','Percorsi chiesti','perc'],['pz','Confluenze chieste','pz'],['norme','Regolamento chiesto','reg'],['quiz','Domande fuori dispensa','quiz']]){
    await sez(k);
    const i=await p.evaluate(n=>[...document.querySelectorAll('#scnOv .qc-riga')].findIndex(r=>r.textContent.indexOf(n)>=0),nome);
    ok(i>=0,'riga «'+nome+'» non trovata nella pagina '+k);if(i<0)continue;
    await p.evaluate(i=>document.querySelectorAll('#scnOv .qc-riga')[i].scrollIntoView({block:'center'}),i);await p.waitForTimeout(250);
    f=await film(()=>tocca('#scnOv .qc-riga >> nth='+i),900);pulito(k+' → pagina',f,'pagina:chiesto','pagina:'+k);
    const st=await stato();ok(st.tab===tab&&st.da===k,'da '+k+' la scheda doveva essere '+tab+': '+JSON.stringify(st));
    f=await film(()=>tocca('#scnOv .t-back'),900);pulito('‹ → '+k,f,'pagina:'+k,'pagina:chiesto');
    await p.waitForTimeout(300);await tocca('#scnOv .qc-riga >> nth='+i);await p.waitForTimeout(700);
    ok(await vedo()==='pagina:chiesto','da '+k+' la riga non riapre la pagina');
    f=await film(()=>p.evaluate(()=>history.back()),1000);pulito('telefono → '+k,f,'pagina:'+k,'pagina:chiesto');
  }

  /* ── 3 · un percorso tuo: sulla mappa e ritorno, stessa scheda e stesso punto ── */
  await home();await p.evaluate(()=>nccChiesto({tab:'perc'}));await p.waitForTimeout(700);
  await p.evaluate(()=>{const b=document.getElementById('scnBody');b.scrollTop=Math.max(0,b.querySelector('.ch-lista').offsetTop-40);});await p.waitForTimeout(200);
  await tocca(await riga('Centrale → San Siro'));await p.waitForTimeout(600);
  ok(await p.evaluate(()=>/fra i tuoi percorsi/i.test(document.querySelector('#popOv .ch-box.si')&&document.querySelector('#popOv .ch-box.si').textContent)),'il percorso tuo non dice «fra i tuoi»');
  await foto('2-popup-percorso');
  const y0=await p.evaluate(()=>{const b=document.getElementById('scnBody');b.scrollTop=300;return b.scrollTop;});   /* la pagina sotto il riquadro, scorsa un po' */
  f=await film(async()=>tocca(await tasto('Apri sulla mappa')),1500);pulito('Apri sulla mappa',f,'mappa','popup');
  ok(await p.evaluate(()=>cur&&cur.id==='rSS'),'sulla mappa non c’è il percorso giusto');
  f=await film(()=>tocca('#tpBack'),1200);pulito('mappa ‹ → pagina',f,'pagina:chiesto','mappa');
  let st=await stato();const y=await p.evaluate(()=>document.getElementById('scnBody').scrollTop);
  ok(st.tab==='perc'&&y0>0&&Math.abs(y-y0)<4,'tornando dalla mappa non sono dov’ero: '+JSON.stringify(st)+' scroll '+y+' invece di '+y0);
  /* anche col tasto del telefono */
  await tocca(await riga('Centrale → San Siro'));await p.waitForTimeout(600);await tocca(await tasto('Apri sulla mappa'));await p.waitForTimeout(1500);
  f=await film(()=>p.evaluate(()=>history.back()),1200);pulito('mappa telefono → pagina',f,'pagina:chiesto','mappa');

  /* ── 4 · un percorso del libro: si aggiunge, la riga diventa tua, resta dopo un ricarico ── */
  const n0=await p.evaluate(()=>routes.length);
  await tocca(await riga('Linate → Centrale'));await p.waitForTimeout(600);
  ok(await p.evaluate(()=>/pag\. 12/.test(document.querySelector('#popOv .ch-box.lib').textContent)&&document.querySelectorAll('#popOv .ch-vie li').length>5),'il percorso del libro non mostra pagina e vie');
  await tocca(await tasto('Aggiungi ai miei percorsi'));await p.waitForTimeout(700);
  const ag=await p.evaluate(()=>({n:routes.length,r:routes[routes.length-1],st:[...document.querySelectorAll('#scnOv .ch-r')].find(r=>r.querySelector('b').textContent.indexOf('Linate → Centrale')===0).querySelector('.ch-st').textContent}));
  ok(ag.n===n0+1&&ag.r.pdf==='p12a'&&ag.r.title==='LINATE - STAZ.CENTRALE'&&/Fra i tuoi/.test(ag.st),'aggiunta dal libro: '+JSON.stringify({n:ag.n,pdf:ag.r.pdf,t:ag.r.title,st:ag.st}));
  ok(await p.evaluate(()=>!Object.keys(coords).some(k=>k.indexOf(routes[routes.length-1].id+'_')===0)),'il percorso aggiunto non deve avere marker');

  /* ── 5 · un percorso da preparare: Nuovo percorso col nome scritto, Annulla torna qui ── */
  await tocca(await riga('Cadorna → IEO'));await p.waitForTimeout(600);
  f=await film(async()=>tocca(await tasto('Nuovo percorso')),1700);
  ok(f.indexOf('mappa')>=0||f.indexOf('modale:addModal')>=0,'Nuovo percorso non apre la mappa: '+f.join(' → '));
  const nomeNuovo=await p.evaluate(()=>{const m=document.getElementById('addModal');return m.classList.contains('open')?document.getElementById('mRT').value:null;});
  ok(nomeNuovo==='CADORNA - IEO','il nuovo percorso doveva chiamarsi «CADORNA - IEO»: '+nomeNuovo);
  f=await film(()=>p.evaluate(()=>{const x=document.querySelector('#addModal .mhdr-close');x.click();}),1500);pulito('Annulla → pagina',f,'pagina:chiesto','modale:addModal');

  /* ── 6 · le piazze: si aprono sopra la pagina; quella che manca la aggiungi tu ── */
  await p.evaluate(()=>nccChiestoTab('pz'));await p.waitForTimeout(400);await foto('3-piazze');
  f=await film(async()=>tocca(await riga('Cadorna')),1000);pulito('piazza → sopra',f,'pzOv','pagina:chiesto');
  f=await film(()=>tocca('#pzOv .pz-hd2 .pz-x'),900);pulito('piazza ‹ → pagina',f,'pagina:chiesto','pzOv');
  await tocca(await riga('Cadorna'));await p.waitForTimeout(800);
  f=await film(()=>p.evaluate(()=>history.back()),900);pulito('piazza telefono → pagina',f,'pagina:chiesto','pzOv');
  await tocca(await riga('Piazzale Medaglie'));await p.waitForTimeout(600);
  ok(await p.evaluate(()=>document.getElementById('chPzN').value==="PIAZZALE MEDAGLIE D'ORO"),'il nome della piazza da aggiungere non è scritto');
  await tocca(await tasto('Aggiungi la piazza'));await p.waitForTimeout(400);
  ok(await p.evaluate(()=>!!document.getElementById('popOv')&&/almeno una via/.test(document.getElementById('chPzE').textContent)),'senza vie la piazza non deve aggiungersi');
  /* scritte a mano, con Invio fra una via e l'altra: Invio va a capo, non aggiunge la piazza */
  await p.click('#chPzV');await p.keyboard.type('VIA PROVA UNO');await p.keyboard.press('Enter');await p.keyboard.type('VIA PROVA DUE');await p.waitForTimeout(300);
  const ta=await p.evaluate(()=>({pop:!!document.getElementById('popOv'),v:document.getElementById('chPzV').value}));
  ok(ta.pop&&ta.v==='VIA PROVA UNO\nVIA PROVA DUE','Invio nel campo delle vie deve andare a capo: '+JSON.stringify(ta));
  await tocca(await tasto('Aggiungi la piazza'));await p.waitForTimeout(700);
  const pu=await p.evaluate(()=>({u:JSON.parse(localStorage.getItem('pzUser')||'[]'),st:[...document.querySelectorAll('#scnOv .ch-r')].find(r=>r.querySelector('b').textContent.indexOf('Piazzale Medaglie')===0).querySelector('.ch-st').textContent}));
  ok(pu.u.length===1&&pu.u[0].v.length===2&&/2 vie/.test(pu.st),'piazza aggiunta: '+JSON.stringify(pu));
  f=await film(async()=>tocca(await riga('Piazzale Medaglie')),1000);pulito('piazza nuova → sopra',f,'pzOv','pagina:chiesto');
  ok(await p.evaluate(()=>/MEDAGLIE/.test(document.querySelector('#pzOv .pz-ti').textContent)),'non si apre la piazza aggiunta');
  await tocca('#pzOv .pz-hd2 .pz-x');await p.waitForTimeout(600);
  await p.evaluate(()=>nccChiestoSes('2025-11'));await p.waitForTimeout(300);
  const nov=await p.evaluate(()=>({sez:[...document.querySelectorAll('#scnOv .ch-sez')].map(x=>x.textContent),av:!!document.querySelector('#scnOv .ch-avviso'),n:document.querySelectorAll('#scnOv .ch-r').length}));
  ok(nov.av&&nov.n===6,'novembre, piazze: '+JSON.stringify(nov));
  await p.evaluate(()=>nccChiestoSes(''));

  /* ── 7 · le regole: l'articolo, il prontuario, le domande sul tema ── */
  await p.evaluate(()=>nccChiestoTab('reg'));await p.waitForTimeout(400);await foto('4-regole');
  await tocca(await riga('Obblighi a inizio'));await p.waitForTimeout(600);await foto('5-popup-tema');
  f=await film(async()=>tocca(await tasto('Leggi l’articolo')),1000);pulito('articolo → sopra',f,'nmOv','popup');
  ok(await p.evaluate(()=>/Art\. 40/.test(document.querySelector('#nmOv').textContent)),'non si apre l’articolo 40-44');
  f=await film(()=>p.evaluate(()=>{const h=document.querySelector('#nmOv .nm-dx .nm-hd')||document.querySelector('#nmOv .nm-hd');h.querySelector('.nm-x').click();}),900);
  pulito('articolo ‹ → pagina',f,'pagina:chiesto','nmOv');
  await tocca(await riga('Obblighi a inizio'));await p.waitForTimeout(600);await tocca(await tasto('Leggi l’articolo'));await p.waitForTimeout(800);
  f=await film(()=>p.evaluate(()=>history.back()),900);pulito('articolo telefono → pagina',f,'pagina:chiesto','nmOv');
  await tocca(await riga('Le tariffe predeterminate'));await p.waitForTimeout(600);
  f=await film(async()=>tocca(await tasto('Il prontuario')),1000);pulito('prontuario → sopra',f,'rgOv','popup');
  f=await film(()=>tocca('#rgOv .t-back'),1000);pulito('prontuario ‹ → pagina',f,'pagina:chiesto','rgOv');
  await tocca(await riga('Doveri del conducente'));await p.waitForTimeout(600);
  f=await film(async()=>tocca(await tasto('Fai ')),1800);pulito('domande sul tema',f,'quiz','popup');
  const qz=await p.evaluate(()=>({n:Q.items.length,t:Q.title}));ok(qz.n>=5&&/Doveri/.test(qz.t),'quiz sul tema: '+JSON.stringify(qz));
  f=await film(()=>p.evaluate(()=>history.back()),1300);pulito('quiz telefono → pagina',f,'pagina:chiesto','quiz');
  st=await stato();ok(st.tab==='reg','finito il quiz non sono sulla scheda Regole: '+JSON.stringify(st));

  /* ── 8 · i quiz: le 52 nuove ── */
  await p.evaluate(()=>nccChiestoTab('quiz'));await p.waitForTimeout(500);await foto('6-quiz');
  f=await film(async()=>tocca(await riga('Le domande nuove')),1800);pulito('le domande nuove',f,'quiz','pagina:chiesto');
  const nq=await p.evaluate(()=>({n:Q.items.length,tutte:Q.items.every(it=>it.extra!=null)}));ok(nq.n===52&&nq.tutte,'le domande nuove: '+JSON.stringify(nq));
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await p.waitForTimeout(500);
  f=await film(()=>p.evaluate(()=>history.back()),1300);pulito('quiz nuove → pagina',f,'pagina:chiesto','quiz');
  ok(await p.evaluate(()=>/Viste 1 su 52/.test(document.querySelector('#scnOv .ch-r').textContent)),'la domanda fatta non si conta fra le viste');

  /* ── 9 · dopo un ricarico tutto resta ── */
  await avvia();
  const dopo=await p.evaluate(()=>({r:routes.some(r=>r.pdf==='p12a'),u:JSON.parse(localStorage.getItem('pzUser')||'[]').length,b:document.querySelector('#hmNew .hm-rq-largo .hm-rq-b').textContent}));
  ok(dopo.r&&dopo.u===1&&dopo.b==='2/148','dopo un ricarico: '+JSON.stringify(dopo));

  /* ── 10 · la pagina ferma: niente di lato, le schede intere, due colonne sull'iPad ── */
  await p.evaluate(()=>nccChiesto({tab:'perc'}));await p.waitForTimeout(700);
  for(const t of ['perc','pz','reg','quiz']){
    await p.evaluate(t=>nccChiestoTab(t),t);await p.waitForTimeout(300);
    const m=await p.evaluate(()=>{const tabs=[...document.querySelectorAll('#scnOv .ch-tabs .sx-tab')];
      const lista=document.querySelector('#scnOv .ch-lista');
      return {largo:document.documentElement.scrollWidth,W:innerWidth,tabs:tabs.every(x=>x.scrollWidth<=x.clientWidth+1),
        col:lista?getComputedStyle(lista).gridTemplateColumns.split(' ').length:0,
        fuori:[...document.querySelectorAll('#scnOv .ch-r')].filter(r=>r.getBoundingClientRect().right>innerWidth+1).length};});
    ok(m.largo<=m.W&&m.tabs&&!m.fuori,t+': qualcosa esce di lato o è tagliato '+JSON.stringify(m));
    if(SCH==='ipado'&&t!=='quiz')ok(m.col===2,t+': sull’iPad in orizzontale le righe vanno in due colonne '+JSON.stringify(m));
    await foto('7-'+t);
  }
  /* il contrasto delle etichette e dei numeri, scheda per scheda (soprattutto nel tema scuro) */
  const cr=await p.evaluate(()=>{
    function rgb(s){s=String(s);var m=s.match(/color\(srgb ([^)]+)\)/);if(m){var c=m[1].split(/[ \/]+/).filter(Boolean).map(parseFloat);return {r:c[0]*255,g:c[1]*255,b:c[2]*255,a:c.length>3?c[3]:1};}
      m=s.match(/rgba?\(([^)]+)\)/);if(!m)return {r:0,g:0,b:0,a:0};var q=m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat);return {r:q[0],g:q[1],b:q[2],a:q.length>3?q[3]:1};}
    function lum(c){function f(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);}
    function fondo(el){var l=[];for(var c=el;c;c=c.parentElement){var b=rgb(getComputedStyle(c).backgroundColor);if(b.a>0){l.push(b);if(b.a>=0.99)break;}}
      var r={r:255,g:255,b:255};for(var i=l.length-1;i>=0;i--){var x=l[i];r={r:x.r*x.a+r.r*(1-x.a),g:x.g*x.a+r.g*(1-x.a),b:x.b*x.a+r.b*(1-x.a)};}return r;}
    var out=[];['perc','pz','reg','quiz'].forEach(t=>{nccChiestoTab(t);
      [...document.querySelectorAll('#scnOv .ch-st,#scnOv .ch-somma span,#scnOv .ch-chip,#scnOv .qc-li.ch-n,#scnOv .ch-r .qc-n')].slice(0,40).forEach(el=>{
        var a=lum(rgb(getComputedStyle(el).color)),b2=lum(fondo(el)),c=+((Math.max(a,b2)+0.05)/(Math.min(a,b2)+0.05)).toFixed(2);
        if(c<3.2)out.push({tab:t,t:el.textContent.slice(0,20),c});});});
    nccChiestoTab('perc');return out;});
  ok(!cr.length,'contrasto basso: '+JSON.stringify(cr.slice(0,5)));
  errs.forEach(e=>ok(false,'JS '+e));
  await b.close();
  console.log('foto in',OUT);console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
