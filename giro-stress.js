/* LO STRESS: quello che fa una persona di fretta, fotogramma per fotogramma.
   Per ogni entrata (riquadri della Home, righe di «Oggi», Cerca, ogni riga delle pagine Quiz, Topografia,
   Piazze, Norme):
   · doppio tocco      due tocchi a 70 ms nello stesso punto
   · indietro subito   indietro del telefono a 40, 140 e 260 ms dal tocco, mentre la schermata entra
   · rientro           indietro e, mentre la pagina torna, di nuovo la stessa riga
   · doppio indietro   due indietro a 90 ms
   · iPad girato       (ipad) si gira a meta' entrata, poi si torna
   · tastiera          (pc) tasti a raffica sulla Home e nelle pagine
   Dopo ogni prova, a schermo fermo: una schermata sola per tipo (niente id doppi), nessuno strato
   invisibile che copre il centro, nessuna schermata ferma a meta' uscita, il quiz mai aperto di nascosto,
   niente che esce di lato; poi indietro fino alla Home: la pila si svuota senza passi strani.
   Nei fotogrammi (guardati subito prima di essere dipinti): mai schermo vuoto.
   uso: node test/giro-stress.js [telefono|ipad|pc] [prove: doppio,subito,rientro,doppioind,gira,tasti] */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const DISP=process.argv[2]||'telefono';
const VP={telefono:{width:390,height:844,touch:true,mobile:true},ipad:{width:820,height:1180,touch:true,mobile:false},pc:{width:1440,height:900,touch:false,mobile:false}}[DISP];
const PROVE=(process.argv[3]||({telefono:'doppio,subito,rientro,doppioind',ipad:'doppio,gira',pc:'doppio,tasti'}[DISP])).split(',');
const fails=[];let prove=0;
const AIUTI=`(function(){
window.__vedo=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),e=document.elementFromPoint(X,Y),c=e;
  var q=document.getElementById('quizApp');if(q&&q.classList.contains('open')&&c&&q.contains(c))return 'quiz';
  while(c&&c!==document.body&&c!==document.documentElement){
    var cs=getComputedStyle(c);
    if(c.id==='popOv')return 'popup';
    if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');
    if(c.id==='homeScreen')return c.classList.contains('hm-stat')?'statistiche':'home';
    if(c.id==='map'||c.id==='panel')return 'mappa';
    if(c.classList&&c.classList.contains('modal')&&c.id)return 'modale:'+c.id;
    if(c.id&&(cs.position==='fixed'||cs.position==='absolute'&&c.parentElement===document.body))return c.id;
    c=c.parentElement;}
  if(document.body.classList.contains('on-topo'))return 'mappa';
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';
};
window.__film=[];window.__filmOn=false;
var sonda=document.createElement('div');sonda.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px;pointer-events:none;';
document.documentElement.appendChild(sonda);var giri=0;
new ResizeObserver(function(){try{if(window.__filmOn){var v=__vedo(),L=window.__film;if(!L.length||L[L.length-1]!==v)L.push(v);}}catch(e){}}).observe(sonda);
(function giro(){giri=1-giri;sonda.style.width=(1+giri)+'px';requestAnimationFrame(giro);})();
/* lo stato a schermo fermo */
window.__stato=function(){
  var W=innerWidth,H=innerHeight,out=[];
  var ids={};[].forEach.call(document.querySelectorAll('[id]'),function(e){ids[e.id]=(ids[e.id]||0)+1;});
  Object.keys(ids).forEach(function(k){if(ids[k]>1&&!/^(leaflet|lf)/.test(k))out.push('id doppio: #'+k+' x'+ids[k]);});
  /* chi sta al centro deve vedersi: niente strati trasparenti che si prendono i tocchi */
  var c=document.elementFromPoint(W/2,H*0.45);
  for(var e=c;e&&e!==document.documentElement;e=e.parentElement){var s=getComputedStyle(e);
    if(+s.opacity<0.05&&s.pointerEvents!=='none'){out.push('strato invisibile al centro: '+(e.id||e.className||e.tagName));break;}}
  /* nessuna schermata ferma a meta' uscita */
  [].forEach.call(document.querySelectorAll('body > [id].fuori'),function(e){out.push('rimasta a meta\\' uscita: #'+e.id);});
  var b=document.body;
  /* con un riquadro che chiede (Ripasso errori: «Inizia» o «Non ora») il quiz aspetta nascosto la risposta: e' giusto cosi'.
     Chiuso il riquadro (indietro), lo svuotamento controlla che non resti niente */
  var chiede=!!document.getElementById('popOv');
  if(b.classList.contains('qz-avvio')&&!chiede)out.push('quiz nascosto rimasto (qz-avvio)');
  var q=document.getElementById('quizApp');
  if(q&&q.classList.contains('open')&&+getComputedStyle(q).opacity<0.05&&!chiede)out.push('quiz aperto ma invisibile');
  if(document.documentElement.scrollWidth>W+1)out.push('pagina larga '+document.documentElement.scrollWidth+' su '+W);
  return {vedo:__vedo(),guai:out};
};
})();`;

(async()=>{
  const b=await launch();
  const ctx=await b.newContext({viewport:{width:VP.width,height:VP.height},serviceWorkers:'block',hasTouch:VP.touch,isMobile:VP.mobile,deviceScaleFactor:1,timezoneId:'Europe/Rome'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();const oggi=Date.now();
  const err={};for(let i=0;i<40;i++)err[i*7+3]={due:oggi-86400000*(i%5),box:i%3,n:1+(i%4)};
  const dati={routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(oggi),azzerato2026:String(oggi),
    nomeUtente:'Haseeb',nomeTs:String(oggi),examDate:JSON.stringify(oggi+40*86400000),
    qtStats:JSON.stringify({cat:{reg_com:{seen:120,ok:90}},err,seenIds:{},idV:2})};
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon/.test(t))errs.push('console: '+t);}});
  p.on('dialog',d=>{d.dismiss().catch(()=>{});});
  const avvia=async()=>{await p.goto(BASE+'index.html',{waitUntil:'load'});await p.waitForTimeout(6000);await p.addScriptTag({content:AIUTI});
    await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});await p.waitForTimeout(300);};
  await avvia();
  const vedo=()=>p.evaluate(()=>__vedo());
  const nota=(dove,cosa)=>{fails.push(dove+': '+cosa);console.log('  ✗ '+dove+': '+cosa);};
  /* il tocco vero, nel punto dove si vede la riga */
  const punto=async sel=>p.evaluate(sel=>{const e=typeof sel==='string'?document.querySelector(sel):null;if(!e)return null;
    e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:Math.round(r.left+Math.min(r.width/2,60)),y:Math.round(r.top+r.height/2)};},sel);
  const tocca=async pt=>{if(VP.touch)await p.touchscreen.tap(pt.x,pt.y);else await p.mouse.click(pt.x,pt.y);};
  const indietro=()=>p.evaluate(()=>history.back());
  /* torno alla Home solo con indietro: e' anche la prova che la pila si svuota */
  async function svuota(dove){
    for(let i=0;i<6;i++){
      const st=await p.evaluate(()=>__stato());
      if(st.vedo==='home'&&!st.guai.length)return true;
      if(st.vedo==='popup'){await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});await p.waitForTimeout(500);continue;}
      await indietro();await p.waitForTimeout(900);
    }
    const st=await p.evaluate(()=>__stato());
    nota(dove,'dopo sei indietro non sono in Home ma su «'+st.vedo+'» '+st.guai.join(', '));
    await avvia();return false;
  }
  async function controlla(dove,attese){
    const st=await p.evaluate(()=>__stato());
    st.guai.forEach(g=>nota(dove,g));
    if(attese&&!attese.includes(st.vedo))nota(dove,'finisco su «'+st.vedo+'» invece di '+attese.map(x=>'«'+x+'»').join(' o '));
    return st;
  }
  const film=async(fn,ms)=>{await p.evaluate(()=>{__film=[];__filmOn=true;});await fn();await p.waitForTimeout(ms);
    return p.evaluate(()=>{__filmOn=false;return __film.slice();});};
  function vuoti(dove,f){if(f.some(x=>/^vuoto/.test(x)))nota(dove,'schermo vuoto: '+f.join(' → '));}

  /* le entrate */
  const entrate=[];
  await p.evaluate(()=>goHome());await p.waitForTimeout(600);
  (await p.evaluate(()=>[...document.querySelectorAll('#hmNew .hm-rq')].map((x,i)=>i+'|'+((x.querySelector('.hm-rq-t')||x).textContent.trim()))))
    .forEach(r=>{const [i,t]=r.split('|');entrate.push({dove:'Home › riquadro «'+t+'»',orig:'home',pag:null,sel:'#hmNew .hm-rq:nth-of-type('+(+i+1)+')',idx:+i,tipo:'rq'});});
  (await p.evaluate(()=>[...document.querySelectorAll('#hmOggi .og-r')].map((x,i)=>i+'|'+((x.querySelector('.og-t b')||x).textContent.trim()))))
    .forEach(r=>{const [i,t]=r.split('|');entrate.push({dove:'Home › Oggi «'+t+'»',orig:'home',pag:null,idx:+i,tipo:'og'});});
  entrate.push({dove:'Home › Cerca',orig:'home',pag:null,tipo:'cerca'});
  for(const k of ['quiz','topo','pz','norme']){
    await p.evaluate(k=>nccSez(k),k);await p.waitForTimeout(800);
    (await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].map(r=>r.querySelector('.qc-lt b').textContent.trim())))
      .forEach(n=>entrate.push({dove:k+' › «'+n+'»',orig:'pagina:'+k,pag:k,nome:n,tipo:'riga'}));
    await p.evaluate(()=>goHome());await p.waitForTimeout(700);
  }
  if(process.env.SOLO)entrate.splice(0,entrate.length,...entrate.filter(e=>new RegExp(process.env.SOLO).test(e.dove)));
  console.log(DISP,'·',entrate.length,'entrate ·',PROVE.join(' '));
  /* porta all'origine e trova il punto da toccare */
  async function prepara(e){
    await p.evaluate(()=>{try{nccChiudiPopup();}catch(x){}});
    if(await vedo()!=='home'){await svuota(e.dove+' (prima)');}
    if(e.pag){await p.evaluate(k=>nccSez(k),e.pag);await p.waitForTimeout(800);}
    return p.evaluate(e=>{let el=null;
      if(e.tipo==='rq')el=document.querySelectorAll('#hmNew .hm-rq')[e.idx];
      else if(e.tipo==='og')el=document.querySelectorAll('#hmOggi .og-r')[e.idx];
      else if(e.tipo==='cerca')el=document.querySelector('#hmNew .hm-lente');
      else el=[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()===e.nome);
      if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();
      /* il tocco a sinistra del testo: mai sulla (i) della riga */
      return {x:Math.round(r.left+Math.min(r.width*0.3,90)),y:Math.round(r.top+r.height/2)};},e);
  }
  const errPrima=()=>errs.length;
  function erroriJS(dove,n){errs.slice(n).forEach(x=>nota(dove,'errore JS: '+x));}

  for(const e of entrate){
    /* ── doppio tocco ── */
    if(PROVE.includes('doppio')){
      const pt=await prepara(e);if(!pt){nota(e.dove,'riga non trovata');continue;}
      const n=errPrima();prove++;
      const f=await film(async()=>{await tocca(pt);await p.waitForTimeout(70);await tocca(pt);},1800);
      vuoti(e.dove+' · doppio tocco',f);
      const st=await controlla(e.dove+' · doppio tocco');
      if(st.vedo!==e.orig){
        /* un indietro deve bastare per tornare: il doppio tocco non apre due volte */
        await indietro();await p.waitForTimeout(1100);
        const v=await vedo();
        if(v!==e.orig&&!(v==='popup'))nota(e.dove+' · doppio tocco','un indietro porta su «'+v+'» invece di «'+e.orig+'» (aperta due volte?)');
      }
      erroriJS(e.dove+' · doppio tocco',n);await svuota(e.dove+' · doppio tocco');
    }
    /* ── indietro mentre entra ── */
    if(PROVE.includes('subito'))for(const ms of [40,140,260]){
      const pt=await prepara(e);if(!pt)break;
      const n=errPrima();prove++;
      const f=await film(async()=>{await tocca(pt);await p.waitForTimeout(ms);await indietro();},2400);
      vuoti(e.dove+' · indietro a '+ms+' ms',f);
      /* dopo un indietro: o l'origine (la schermata ha fatto in tempo ad aprirsi e si e' chiusa) o la Home
         (l'indietro ha chiuso la pagina prima); mai una schermata aperta dopo l'indietro */
      await controlla(e.dove+' · indietro a '+ms+' ms',[e.orig,'home','popup']);
      erroriJS(e.dove+' · indietro a '+ms+' ms',n);await svuota(e.dove+' · indietro a '+ms+' ms');
    }
    /* ── rientro: indietro e subito di nuovo la stessa riga ── */
    if(PROVE.includes('rientro')&&e.pag){
      const pt=await prepara(e);if(!pt)continue;
      const n=errPrima();prove++;
      await tocca(pt);await p.waitForTimeout(1600);
      const dentro=await vedo();
      if(dentro!==e.orig&&dentro!=='popup'){
        await indietro();await p.waitForTimeout(120);
        const pt2=await p.evaluate(nome=>{const el=[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()===nome);
          if(!el)return null;const r=el.getBoundingClientRect();return {x:Math.round(r.left+Math.min(r.width*0.3,90)),y:Math.round(r.top+r.height/2)};},e.nome);
        if(pt2){
          await tocca(pt2);await p.waitForTimeout(1600);
          const di=await vedo();
          if(di!==dentro)nota(e.dove+' · rientro','ritoccando la riga mentre la pagina torna: «'+di+'» invece di «'+dentro+'»');
          await controlla(e.dove+' · rientro');
          await indietro();await p.waitForTimeout(1200);
          const fine=await vedo();
          if(fine!==e.orig&&fine!=='popup')nota(e.dove+' · rientro','indietro porta su «'+fine+'» invece di «'+e.orig+'»');
        }
      }
      erroriJS(e.dove+' · rientro',n);await svuota(e.dove+' · rientro');
    }
    /* ── due indietro di fila ── */
    if(PROVE.includes('doppioind')){
      const pt=await prepara(e);if(!pt)continue;
      const n=errPrima();prove++;
      await tocca(pt);await p.waitForTimeout(1600);
      if(await vedo()!==e.orig){
        const f=await film(async()=>{await indietro();await p.waitForTimeout(90);await indietro();},2000);
        vuoti(e.dove+' · due indietro',f);
        await controlla(e.dove+' · due indietro',e.orig==='home'?['home']:['home',e.orig]);
      }
      erroriJS(e.dove+' · due indietro',n);await svuota(e.dove+' · due indietro');
    }
    /* ── iPad girato mentre entra ── */
    if(PROVE.includes('gira')){
      const pt=await prepara(e);if(!pt)continue;
      const n=errPrima();prove++;
      await tocca(pt);await p.waitForTimeout(150);
      await p.setViewportSize({width:VP.height,height:VP.width});await p.waitForTimeout(1500);
      await controlla(e.dove+' · girato in orizzontale');
      await p.setViewportSize({width:VP.width,height:VP.height});await p.waitForTimeout(900);
      const st=await controlla(e.dove+' · rigirato in verticale');
      if(st.vedo!==e.orig){await indietro();await p.waitForTimeout(1100);const v=await vedo();
        if(v!==e.orig&&v!=='popup')nota(e.dove+' · girato','indietro porta su «'+v+'» invece di «'+e.orig+'»');}
      erroriJS(e.dove+' · girato',n);await svuota(e.dove+' · girato');
    }
  }
  /* ── tastiera a raffica (computer) ── */
  if(PROVE.includes('tasti')){
    const seq=['q','Escape','t','Escape','p','n','Escape','Escape','/','Escape','q','q','Escape','t','t','Escape','Escape','n','Escape','p','Escape'];
    for(let giro=0;giro<3;giro++){
      await svuota('tasti (prima)');
      const n=errPrima();prove++;
      const f=await film(async()=>{for(const k of seq){await p.keyboard.press(k);await p.waitForTimeout(giro===0?40:(giro===1?120:260));}},2200);
      vuoti('tastiera a raffica (giro '+(giro+1)+')',f);
      await controlla('tastiera a raffica (giro '+(giro+1)+')');
      erroriJS('tastiera a raffica',n);
      await svuota('tastiera a raffica');
    }
  }
  await b.close();
  console.log(DISP,'· prove',prove,'· FALLITI',fails.length);
  process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
