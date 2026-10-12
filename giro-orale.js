/* LA SIMULAZIONE DELL'ORALE (v156), fotogramma per fotogramma (ogni passaggio registrato a ogni fotogramma,
   subito prima che venga dipinto: mai schermo vuoto, mai Home di passaggio, mai sfarfallio, si torna dove si era):
   · Quiz › Esame › «Simulazione dell'orale»: la pagina con le sessioni e «Inizia»; ‹ e il tasto del telefono tornano
     alla pagina Quiz
   · quattro prove come all'orale: due percorsi diversi, una piazza, una regola (con la domanda come l'hanno fatta),
     prese da Chiesto all'esame; scelto un mese, solo quello che hanno chiesto quel mese; mai le stesse della volta prima
   · ogni prova: la domanda, «Controlla», la risposta (il percorso con le vie, le vie della piazza, i punti della
     regola), poi ✓ ≈ ✗; l'orologio corre
   · lasciato a metà si riprende dalla stessa prova; finito: Superato o Da ripassare, le prove andate male coi tasti
     per studiarle (il percorso del libro si aggiunge, sulla mappa e ritorno; la piazza si apre sopra e si chiude;
     la regola in un foglio con l'articolo, ‹ dall'articolo torna qui); lo storico e quello da ripassare restano
   uso: node test/giro-orale.js [iphone|se|ipado] [chiaro|scuro] */
const {launch,seed,BASE}=require('./lib');const fs=require('fs'),path=require('path'),os=require('os');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const SCH=process.argv[2]||'iphone',TEMA=process.argv[3]||'chiaro';
const VP={se:{width:320,height:568,touch:true,mobile:true},iphone:{width:390,height:844,touch:true,mobile:true},
  ipado:{width:1180,height:820,touch:true,mobile:false}}[SCH];
const OUT=path.join(process.env.OR_OUT||os.tmpdir(),'orale-'+SCH+'-'+TEMA);fs.mkdirSync(OUT,{recursive:true});
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
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
  const dati={routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(oggi),
    azzerato2026:String(oggi),dark:TEMA==='scuro'?'true':'false'};
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('dialog',d=>{errs.push('dialog nativo: '+d.message().slice(0,60));d.dismiss().catch(()=>{});});
  await p.goto(BASE+'index.html',{waitUntil:'load'});await p.waitForTimeout(6000);await p.addScriptTag({content:AIUTI});
  const film=async(fn,ms)=>{await p.evaluate(()=>{__film=[];__filmOn=true;});await fn();await p.waitForTimeout(ms||1300);return p.evaluate(()=>{__filmOn=false;return __film.slice();});};
  const pulito=(nome,f,arrivo,da)=>{const s=f.join(' → ');
    ok(!f.some(x=>/^vuoto/.test(x)),nome+': schermo vuoto '+s);
    ok(!(da&&da!=='home'?f.slice(0,-1):f.slice(1,-1)).includes('home')||arrivo==='home'||da==='home',nome+': Home di passaggio '+s);
    for(let i=2;i<f.length;i++)if(f[i]===f[i-2]&&f[i]!==f[i-1]){ok(false,nome+': sfarfallio '+s);break;}
    ok(f[f.length-1]===arrivo,nome+': arriva su «'+f[f.length-1]+'» invece di «'+arrivo+'» ('+s+')');
    console.log(' '+(nome+'                              ').slice(0,34)+s);};
  const foto=async n=>{try{await p.screenshot({path:path.join(OUT,n+'.png')});}catch(e){}};
  const tocca=sel=>p.click(sel,{timeout:4000}).catch(e=>ok(false,'tocco '+sel+': '+e.message.split('\n')[0]));
  const st=()=>p.evaluate(()=>nccOraleStato());
  const vista=()=>p.evaluate(()=>{const b=document.getElementById('scnBody');return {p:(document.getElementById('scnOv')||{}).getAttribute?document.getElementById('scnOv').getAttribute('data-p'):null,
    inizio:!!(b&&b.querySelector('.ora-intro')),prova:!!(b&&b.querySelector('.ora-card')),fine:!!(b&&b.querySelector('.ora-esito')),
    risp:!!(b&&b.querySelector('.ora-risp')),t:b?b.textContent.slice(0,80):''};});

  /* ── 1 · la riga nella pagina Quiz, la pagina, ‹ e il tasto del telefono ── */
  await p.evaluate(()=>nccSez('quiz'));await p.waitForTimeout(800);
  const riga=await p.evaluate(()=>{const r=[...document.querySelectorAll('#scnOv .qc-riga')];const i=r.findIndex(x=>/Simulazione dell.orale/.test(x.textContent));
    const e=r.findIndex(x=>/Simulazione d.esame/.test(x.textContent));return {i,e,t:i>=0?r[i].textContent:''};});
  ok(riga.i===riga.e+1,'la riga dell’orale non è sotto quella dell’esame: '+J(riga));
  let f=await film(()=>tocca('#scnOv .qc-riga >> nth='+riga.i),1200);pulito('Quiz → orale',f,'pagina:simorale','pagina:quiz');
  await foto('1-inizio');
  let v=await vista();ok(v.inizio&&!v.prova,'la pagina dell’orale non mostra l’inizio: '+J(v));
  const chips=await p.evaluate(()=>[...document.querySelectorAll('#scnBody .ch-chip')].map(c=>c.textContent));
  ok(chips.length===6&&chips[0]==='Tutte','le sessioni: '+J(chips));
  f=await film(()=>tocca('#scnOv .t-back'),1100);pulito('‹ → Quiz',f,'pagina:quiz','pagina:simorale');
  await tocca('#scnOv .qc-riga >> nth='+riga.i);await p.waitForTimeout(900);
  f=await film(()=>p.evaluate(()=>history.back()),1100);pulito('telefono → Quiz',f,'pagina:quiz','pagina:simorale');

  /* ── 2 · l'orale: quattro prove ── */
  await tocca('#scnOv .qc-riga >> nth='+riga.i);await p.waitForTimeout(900);
  await tocca('#scnBody .ora-go');await p.waitForTimeout(600);
  let o=await st();
  console.log(' prove                            ',J(o.prove.map(x=>x.x+':'+x.k+(x.d?' «'+x.d.slice(0,30)+'»':''))));
  ok(J(o.prove.map(x=>x.x))===J(['perc','perc','pz','reg'])&&o.prove[0].k!==o.prove[1].k&&o.prove[3].d,'le prove non sono due percorsi, una piazza, una regola: '+J(o.prove));
  await foto('2-prova1');
  const t0=await p.evaluate(()=>document.getElementById('oraT').textContent);await p.waitForTimeout(2200);
  const t1=await p.evaluate(()=>document.getElementById('oraT').textContent);
  ok(t0!==t1,'l’orologio è fermo: '+t0+' '+t1);
  const voti=['si','quasi','no','quasi'];
  for(let i=0;i<4;i++){
    v=await vista();ok(v.prova&&!v.risp,'prova '+(i+1)+': prima di Controlla la risposta non deve vedersi '+J(v));
    await tocca('#scnBody .ora-go');await p.waitForTimeout(500);
    const r=await p.evaluate(()=>{const x=document.querySelector('#scnBody .ora-risp');return x?{li:x.querySelectorAll('li').length,t:x.textContent.slice(0,90)}:null;});
    console.log(' prova '+(i+1)+' · risposta                ',J(r));
    ok(r&&(r.li>0||/non è fra|prepari tu|aggiungi tu/i.test(r.t)),'prova '+(i+1)+': la risposta è vuota '+J(r));
    if(i===0)await foto('3-risposta');
    if(i===3)await foto('4-regola');
    f=await film(()=>tocca('#scnBody .ora-v.'+voti[i]),900);pulito('voto '+(i+1),f,'pagina:simorale','pagina:simorale');
    if(i===1){
      /* lasciato a meta': ‹ e poi si riprende dalla terza; l'orologio si ferma mentre sei fuori */
      const sec0=(await st()).sec;
      f=await film(()=>tocca('#scnOv .t-back'),1000);pulito('‹ a metà → Quiz',f,'pagina:quiz','pagina:simorale');
      await p.waitForTimeout(3500);
      ok((await st()).pausa,'uscito a metà l’orale non è in pausa');
      f=await film(()=>tocca('#scnOv .qc-riga >> nth='+riga.i),1100);pulito('Quiz → orale a metà',f,'pagina:simorale','pagina:quiz');
      const rip=await p.evaluate(()=>({go:document.querySelector('#scnBody .ora-go').textContent,nuovo:!!document.querySelector('#scnBody .ora-nuovo'),
        chips:document.querySelectorAll('#scnBody .ch-chip').length,card:!!document.querySelector('#scnBody .ora-card')}));
      ok(/Riprendi.*prova 3 di 4/.test(rip.go)&&rip.nuovo&&rip.chips===6&&!rip.card,'l’orale a metà non si riprende: '+J(rip));
      await foto('2b-riprendi');
      f=await film(()=>tocca('#scnBody .ora-go'),700);pulito('Riprendi',f,'pagina:simorale','pagina:simorale');
      o=await st();ok(o.i===2&&!o.pausa&&o.prove[0].v==='si'&&o.prove[1].v==='quasi','ripreso dalla prova sbagliata: '+J(o));
      ok(o.sec<=sec0+2,'l’orologio è andato avanti mentre eri fuori: '+sec0+' → '+o.sec);
      /* il tasto del telefono a metà: anche lui mette in pausa */
      f=await film(()=>p.evaluate(()=>history.back()),1100);pulito('telefono a metà → Quiz',f,'pagina:quiz','pagina:simorale');
      ok((await st()).pausa,'col tasto del telefono l’orale non è in pausa');
      await tocca('#scnOv .qc-riga >> nth='+riga.i);await p.waitForTimeout(900);
      await tocca('#scnBody .ora-go');await p.waitForTimeout(500);
      o=await st();ok(o.i===2&&!o.pausa,'dopo il telefono non riprende dalla terza: '+J(o));
    }
  }
  /* ── 3 · il risultato ── */
  v=await vista();await foto('5-risultato');
  const ris=await p.evaluate(()=>({tt:document.querySelector('#scnBody .ora-esito .ora-tt').textContent,
    r:[...document.querySelectorAll('#scnBody .ora-r')].map(x=>x.className.replace('ora-r ','')+(x.querySelector('.ora-a')?':'+x.querySelector('.ora-a').textContent:'')),
    st:JSON.parse(localStorage.getItem('nccOrale')||'[]'),rip:JSON.parse(localStorage.getItem('nccOraleRip')||'{}')}));
  console.log(' risultato                        ',ris.tt,J(ris.r));
  ok(v.fine&&ris.tt==='Da ripassare','con un ✗ doveva essere «Da ripassare»: '+ris.tt);
  ok(ris.r[0]==='si'&&/^quasi:/.test(ris.r[1])&&/^no:/.test(ris.r[2])&&/^quasi:.*Rileggi/.test(ris.r[3]),'le prove nel risultato: '+J(ris.r));
  ok(ris.st.length===1&&ris.st[0].s===0&&ris.st[0].p.length===4,'lo storico non è salvato: '+J(ris.st));
  ok(ris.rip.pz&&ris.rip.reg&&ris.rip.perc&&Object.keys(ris.rip.perc).length===1,'quello da ripassare non è segnato: '+J(ris.rip));
  ok(await p.evaluate(()=>nccOraleDaRipassare().length)===3,'da ripassare non sono 3: '+J(await p.evaluate(()=>nccOraleDaRipassare())));
  /* il cloud: gli orali fatti si sommano, quello da ripassare vince l'ultimo voto (anche il ✓ dato sull'altro dispositivo) */
  const sync=await p.evaluate(()=>{
    const k=Object.keys(nccSyncRaccogli());
    const loc0=localStorage.getItem('nccOrale'),rip0=localStorage.getItem('nccOraleRip');
    const st=JSON.parse(loc0),t=st[0].t;
    const altro=[{t:t-86400000,s:1,d:300,ses:'',p:[]},st[0],{t:t+1000,s:0,d:200,ses:'',p:[]}];
    const rip=JSON.parse(rip0),pk=Object.keys(rip.pz)[0];
    const rb={pz:{},perc:{'X>Y':{t:Date.now()+5000,v:'no',n:2}}};rb.pz[pk]={t:Date.now()+5000,v:'si',n:1};
    const n=nccSyncUnisci({nccOrale:JSON.stringify(altro),nccOraleRip:JSON.stringify(rb)});
    const st2=JSON.parse(localStorage.getItem('nccOrale')),rip2=JSON.parse(localStorage.getItem('nccOraleRip'));
    const da=nccOraleDaRipassare().map(x=>x.k);
    localStorage.setItem('nccOrale',loc0);localStorage.setItem('nccOraleRip',rip0);   /* rimetto com'era */
    return {k:k.filter(x=>/^nccOrale/.test(x)),n,len:st2.length,ord:st2.map(x=>x.t).every((x,i,a)=>!i||a[i-1]<x),
      pz:rip2.pz[pk].v,xy:!!rip2.perc['X>Y'],da,pk};});
  console.log(' cloud                            ',J(sync));
  ok(sync.k.length===2&&sync.len===3&&sync.ord&&sync.pz==='si'&&sync.xy&&sync.da.indexOf(sync.pk)<0&&sync.da.indexOf('X>Y')>=0,
    'l’orale col cloud non si unisce bene: '+J(sync));
  /* la piazza: si apre sopra e si chiude (‹ e telefono) */
  const azPz=await p.evaluate(()=>document.querySelectorAll('#scnBody .ora-r')[2].querySelector('.ora-a').textContent);
  if(/Studia la piazza/.test(azPz)){
    f=await film(()=>tocca('#scnBody .ora-r >> nth=2 >> .ora-a'),1000);pulito('piazza → sopra',f,'pzOv','pagina:simorale');
    f=await film(()=>tocca('#pzOv .pz-hd2 .pz-x'),900);pulito('piazza ‹ → orale',f,'pagina:simorale','pzOv');
    await tocca('#scnBody .ora-r >> nth=2 >> .ora-a');await p.waitForTimeout(900);
    f=await film(()=>p.evaluate(()=>history.back()),900);pulito('piazza telefono → orale',f,'pagina:simorale','pzOv');
  }else{
    await tocca('#scnBody .ora-r >> nth=2 >> .ora-a');await p.waitForTimeout(600);
    ok(await p.evaluate(()=>!!document.getElementById('oraPzN')),'la piazza da aggiungere non apre il riquadro');
    await p.evaluate(()=>nccChiudiPopup());await p.waitForTimeout(400);
  }
  /* la regola: il foglio, l'articolo e ritorno */
  f=await film(()=>tocca('#scnBody .ora-r >> nth=3 >> .ora-a'),900);pulito('regola → foglio',f,'popup','pagina:simorale');
  const fr=await p.evaluate(()=>({li:document.querySelectorAll('#popOv .ora-punti li').length,art:[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent)}));
  ok(fr.li>=2,'il foglio della regola non ha i punti: '+J(fr));
  if(fr.art.some(t=>/articolo/.test(t))){
    f=await film(()=>p.evaluate(()=>[...document.querySelectorAll('#popOv .pop-b')].find(b=>/articolo/.test(b.textContent)).click()),1100);
    pulito('foglio → articolo',f,'nmOv','popup');
    f=await film(()=>tocca('#nmOv .nm-x'),900);pulito('articolo ‹ → orale',f,'pagina:simorale','nmOv');
  }else{await p.evaluate(()=>document.querySelector('#popOv .pop-b').click());await p.waitForTimeout(500);}
  /* il percorso: dal libro si aggiunge e poi si studia sulla mappa; dalla mappa si torna qui */
  const azP=await p.evaluate(()=>document.querySelectorAll('#scnBody .ora-r')[1].querySelector('.ora-a').textContent);
  console.log(' percorso da ripassare            ',azP);
  if(/Aggiungilo/.test(azP)){
    const n0=await p.evaluate(()=>routes.length);
    await tocca('#scnBody .ora-r >> nth=1 >> .ora-a');await p.waitForTimeout(700);
    const ag=await p.evaluate(()=>({n:routes.length,t:document.querySelectorAll('#scnBody .ora-r')[1].querySelector('.ora-a').textContent}));
    ok(ag.n===n0+1&&/Studialo sulla mappa/.test(ag.t),'il percorso del libro non si aggiunge: '+J(ag));
  }
  if(/Studialo|Studialo sulla mappa/.test(await p.evaluate(()=>document.querySelectorAll('#scnBody .ora-r')[1].querySelector('.ora-a').textContent))){
    f=await film(()=>tocca('#scnBody .ora-r >> nth=1 >> .ora-a'),1500);pulito('percorso → mappa',f,'mappa','pagina:simorale');
    f=await film(()=>tocca('#tpBack'),1200);pulito('mappa ‹ → orale',f,'pagina:simorale','mappa');
    v=await vista();ok(v.fine,'tornando dalla mappa non c’è il risultato: '+J(v));
    await tocca('#scnBody .ora-r >> nth=1 >> .ora-a');await p.waitForTimeout(1500);
    f=await film(()=>p.evaluate(()=>history.back()),1200);pulito('mappa telefono → orale',f,'pagina:simorale','mappa');
  }
  /* ── 3b · un orale scelto apposta, per provare ogni tasto del risultato:
     un percorso del libro (si aggiunge, poi si studia sulla mappa), uno che non c'e' (nuovo percorso col titolo gia' scritto),
     una piazza che non c'e' (si aggiunge con le sue vie, poi si studia) ── */
  const K=await p.evaluate(()=>{const m=nccChiestoMotore,C=m.conti();
    const lib=C.perc.find(o=>m.stato(o).tipo==='lib'),no=C.perc.find(o=>m.stato(o).tipo==='no'),pz=C.pz.find(o=>!m.piazzaDi(o.k));
    return {lib:lib&&lib.k,no:no&&no.k,pz:pz&&pz.k,nomePz:pz&&m.nome(pz.k),tit:no&&(m.nome(no.a)+' - '+m.nome(no.b)).toUpperCase()};});
  console.log(' orale scelto                     ',J(K));
  ok(K.lib&&K.no&&K.pz,'non trovo un percorso del libro, uno da preparare e una piazza che manca: '+J(K));
  ok(await p.evaluate(k=>nccOraleProva([k.lib,k.no,k.pz,'obblighi']),K),'nccOraleProva non parte');
  await p.waitForTimeout(500);
  for(const v of ['no','quasi','no','si']){await tocca('#scnBody .ora-go');await p.waitForTimeout(600);await tocca('#scnBody .ora-v.'+v);await p.waitForTimeout(550);}
  let az=await p.evaluate(()=>[...document.querySelectorAll('#scnBody .ora-r')].map(x=>{const a=x.querySelector('.ora-a');return a?a.textContent:'';}));
  console.log(' tasti del risultato              ',J(az));
  ok(/Aggiungilo/.test(az[0])&&/Preparalo/.test(az[1])&&/Aggiungi la piazza/.test(az[2])&&az[3]==='','i tasti del risultato: '+J(az));
  await foto('6-risultato-scelto');
  /* il percorso del libro: si aggiunge e poi si studia sulla mappa; ‹ e il telefono tornano qui */
  const n0=await p.evaluate(()=>routes.length);
  await tocca('#scnBody .ora-r >> nth=0 >> .ora-a');await p.waitForTimeout(700);
  az=await p.evaluate(()=>({n:routes.length,t:document.querySelectorAll('#scnBody .ora-r')[0].querySelector('.ora-a').textContent,
    pdf:(routes[routes.length-1]||{}).pdf||''}));
  ok(az.n===n0+1&&/Studialo sulla mappa/.test(az.t)&&az.pdf,'il percorso del libro non si aggiunge: '+J(az));
  f=await film(()=>tocca('#scnBody .ora-r >> nth=0 >> .ora-a'),1600);pulito('percorso → mappa',f,'mappa','pagina:simorale');
  const sel=await p.evaluate(()=>({t:(typeof cur!=='undefined'&&cur)?cur.title:'',m:typeof mode!=='undefined'?mode:''}));
  ok(sel.m==='s'&&sel.t,'sulla mappa non c’è il percorso in Studio: '+J(sel));
  f=await film(()=>tocca('#tpBack'),1300);pulito('mappa ‹ → orale',f,'pagina:simorale','mappa');
  v=await vista();ok(v.fine,'tornando dalla mappa non c’è il risultato: '+J(v));
  await tocca('#scnBody .ora-r >> nth=0 >> .ora-a');await p.waitForTimeout(1600);
  f=await film(()=>p.evaluate(()=>history.back()),1300);pulito('mappa telefono → orale',f,'pagina:simorale','mappa');
  /* il percorso che non c'e': la finestra del nuovo percorso col titolo gia' scritto; Annulla torna qui */
  f=await film(()=>tocca('#scnBody .ora-r >> nth=1 >> .ora-a'),1600);
  const nuovo=await p.evaluate(()=>({open:document.getElementById('addModal').classList.contains('open'),t:document.getElementById('mRT').value}));
  console.log(' nuovo percorso                   ',f.join(' → '),J(nuovo));
  ok(nuovo.open&&nuovo.t===K.tit,'il nuovo percorso non ha il titolo: '+J(nuovo)+' invece di '+K.tit);
  ok(!f.some(x=>/^vuoto/.test(x))&&!f.includes('home'),'verso il nuovo percorso: '+f.join(' → '));
  await foto('7-nuovo-percorso');
  f=await film(()=>tocca('#addModal .bcn'),1500);
  console.log(' annulla il nuovo                 ',f.join(' → '));
  ok(f[f.length-1]==='pagina:simorale','Annulla del nuovo percorso non torna all’orale: '+f.join(' → '));
  for(let k=0;k<2&&await p.evaluate(()=>{const s=document.getElementById('scnOv');return !(s&&s.getAttribute('data-p')==='simorale');});k++){
    const g=await film(()=>p.evaluate(()=>history.back()),1300);console.log(' indietro                         ',g.join(' → '));f=f.concat(g);}
  ok(!f.some(x=>/^vuoto/.test(x))&&!f.includes('home'),'tornando dal nuovo percorso: '+f.join(' → '));
  v=await vista();ok(v.fine,'dal nuovo percorso non si torna al risultato: '+J(v));
  /* la piazza che non c'e': il riquadro col nome, le vie, e poi si studia */
  f=await film(()=>tocca('#scnBody .ora-r >> nth=2 >> .ora-a'),900);pulito('aggiungi piazza',f,'popup','pagina:simorale');
  const nomeIn=await p.evaluate(()=>document.getElementById('oraPzN').value);
  ok(nomeIn&&nomeIn===nomeIn.toUpperCase(),'il nome della piazza non è scritto: '+nomeIn);
  await p.evaluate(()=>{document.getElementById('oraPzV').value='VIA PRIMA\nVIA SECONDA\nVIA TERZA';});
  await p.evaluate(()=>[...document.querySelectorAll('#popOv .pop-b')].find(b=>/Aggiungi la piazza/.test(b.textContent)).click());
  await p.waitForTimeout(900);
  const pzU=await p.evaluate(()=>({u:JSON.parse(localStorage.getItem('pzUser')||'[]'),t:document.querySelectorAll('#scnBody .ora-r')[2].querySelector('.ora-a').textContent,pop:!!document.getElementById('popOv')}));
  ok(pzU.u.length===1&&pzU.u[0].v.length===3&&/Studia la piazza/.test(pzU.t)&&!pzU.pop,'la piazza non si aggiunge: '+J(pzU));
  f=await film(()=>tocca('#scnBody .ora-r >> nth=2 >> .ora-a'),1000);pulito('piazza nuova → sopra',f,'pzOv','pagina:simorale');
  f=await film(()=>p.evaluate(()=>history.back()),900);pulito('piazza nuova telefono → orale',f,'pagina:simorale','pzOv');
  /* la (i) in alto spiega questa pagina */
  await tocca('#scnOv .t-info');await p.waitForTimeout(500);
  const inf=await p.evaluate(()=>document.getElementById('popOv')?document.getElementById('popOv').textContent:'');
  ok(/Simulazione dell.orale/.test(inf)&&/Superato/.test(inf),'la (i) non spiega l’orale: '+inf.slice(0,80));
  await p.evaluate(()=>nccChiudiPopup());await p.waitForTimeout(300);

  /* ── 4 · un altro orale: niente prove uguali alla volta prima; un mese solo ── */
  const prima=(await st()).prove.map(x=>x.k);
  await tocca('#scnBody .ora-go');await p.waitForTimeout(600);
  o=await st();ok(!o.fine&&o.i===0,'«Un altro orale» non riparte: '+J(o));
  const uguali=o.prove.filter(x=>prima.indexOf(x.k)>=0).map(x=>x.k);
  ok(!uguali.length,'prove uguali alla volta prima: '+J(uguali));
  /* con la tastiera: Invio controlla, 3 = non lo sapevo; i tasti non fanno niente prima di Controlla */
  await p.keyboard.press('2');await p.waitForTimeout(200);
  ok((await st()).prove[0].v==='','un voto dato prima di Controlla');
  await p.keyboard.press('Enter');await p.waitForTimeout(400);
  ok((await st()).mostra,'Invio non controlla');
  await p.keyboard.press('3');await p.waitForTimeout(400);
  o=await st();ok(o.i===1&&o.prove[0].v==='no'&&!o.mostra,'il tasto 3 non vota: '+J(o));
  const kb=await p.evaluate(()=>{nccTastiera();const t=document.getElementById('popOv').textContent;nccChiudiPopup();return t;});
  ok(/Simulazione dell.orale/.test(kb)&&/la spiegazione, dopo un errore/.test(kb),'i comandi da tastiera non hanno l’orale e la S');
  await p.waitForTimeout(400);
  await tocca('#scnOv .t-back');await p.waitForTimeout(800);
  await tocca('#scnOv .qc-riga >> nth='+riga.i);await p.waitForTimeout(800);
  await p.evaluate(()=>nccOraleSes('2026-01'));await p.waitForTimeout(300);
  await p.evaluate(()=>nccOraleInizia());await p.waitForTimeout(400);
  const gen=await p.evaluate(()=>{const C=nccChiestoMotore.conti(),o=nccOraleStato();
    return o.prove.map(x=>{const m=x.x==='perc'?C.P:(x.x==='pz'?C.K:C.R);return !!(m[x.k]&&m[x.k].ses['2026-01']);});});
  ok(gen.every(Boolean),'gennaio 2026: prove di un altro mese '+J(gen));
  ok(!errs.length,'errori: '+errs.join(' | '));
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
