/* INDIETRO SU IPHONE, fotogramma per fotogramma (ogni frame dello schermo).
   Safari: il gesto dal bordo e' di Safari -> la pagina non si sposta mai da sola a meta';
   quando Safari ha gia' fatto lo scorrimento la pagina sparisce al volo (niente seconda animazione);
   con la freccia ‹ di Safari invece scorre via normale.
   App sulla Home (standalone): il trascinamento nostro funziona e, se il telefono si prende
   il dito, la pagina torna al suo posto. Poi popup, carta di Cosa & Dove, testata Tariffe. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const UA='Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
async function apri(b,app){
  const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true,isMobile:true,userAgent:UA});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();
  await ctx.addInitScript(a=>{
    if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(a.s.routes));localStorage.setItem('coords',JSON.stringify(a.s.coords));
      localStorage.setItem('ob1','true');localStorage.setItem('antiFretta','false');localStorage.setItem('wkRepTs',String(Date.now()));localStorage.setItem('azzerato2026',String(Date.now()));}
    if(a.app)Object.defineProperty(navigator,'standalone',{get:()=>true});
    /* il gesto di Safari: l'evento vero viene sostituito da quello che manda Safari (con o senza hasUAVisualTransition) */
    window.addEventListener('popstate',function(e){if(!window.__finto||!e.isTrusted)return;e.stopImmediatePropagation();
      var f=window.__finto;window.__finto=null;window.dispatchEvent(f==='ua'?new PopStateEvent('popstate',{state:e.state,hasUAVisualTransition:true}):new Event('popstate'));},true);
  },{s,app});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(5500);
  await p.addScriptTag({content:`
    window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
      while(c&&c!==document.body){if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='pfOv')return 'profilo';if(c.id==='popOv')return 'popup';
        if(c.id==='homeScreen')return 'home';c=c.parentElement;}return 'altro';};
    window.__rec=function(sel,ms){return new Promise(function(res){var out=[],t0=performance.now();
      (function f(){var o=document.querySelector(sel);out.push({t:Math.round(performance.now()-t0),x:o?Math.round(o.getBoundingClientRect().left):null,v:__vedo()});
        if(performance.now()-t0<ms)requestAnimationFrame(f);else res(out);})();});};
    window.__dito=function(el,tipo,x,y){var t=new Touch({identifier:7,target:el,clientX:x,clientY:y,pageX:x,pageY:y,screenX:x,screenY:y});
      var fine=(tipo==='touchend'||tipo==='touchcancel');
      el.dispatchEvent(new TouchEvent(tipo,{touches:fine?[]:[t],targetTouches:fine?[]:[t],changedTouches:[t],bubbles:true,cancelable:true}));};
    window.__gesto=async function(sel,x0,x1,y,fine){var el=document.elementFromPoint(x0,y);__dito(el,'touchstart',x0,y);
      for(var i=1;i<=8;i++){await new Promise(function(r){requestAnimationFrame(r);});__dito(el,'touchmove',x0+(x1-x0)*i/8,y);}
      await new Promise(function(r){requestAnimationFrame(r);});var o=document.querySelector(sel);var dur=o?Math.round(o.getBoundingClientRect().left):null;
      __dito(el,fine,x1,y);return dur;};`});
  return {ctx,p,errs};
}
const inMezzo=(f,w)=>f.filter(x=>x.x!==null&&x.x>2&&x.x<w-2).length;
(async()=>{
  const b=await launch();
  /* ════ 1 · SAFARI SU IPHONE ════ */
  let {ctx,p,errs}=await apri(b,false);
  ok(await p.evaluate(()=>typeof nccSwipeNativo==='function'&&nccSwipeNativo()),'Safari: il gesto di Safari non viene riconosciuto');
  await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(700);
  /* a · il dito sul bordo, poi Safari se lo prende: la pagina non si muove e non resta a meta' */
  let rec=p.evaluate(()=>__rec('#scnOv',900));let durante=await p.evaluate(()=>__gesto('#scnOv',6,150,430,'touchcancel'));let f=await rec;
  console.log('Safari · dito sul bordo: pagina durante',durante,'px · dopo',f[f.length-1].x,'px ·',f[f.length-1].v);
  ok(durante===0&&inMezzo(f,390)===0&&f[f.length-1].v==='pagina:norme','Safari: la pagina si sposta col dito ('+durante+'px) o resta a meta’');
  /* b · Safari finisce il gesto (con hasUAVisualTransition): la pagina sparisce al volo */
  rec=p.evaluate(()=>__rec('#scnOv',900));await p.evaluate(()=>{window.__finto='ua';history.back();});f=await rec;
  console.log('Safari · gesto finito: fotogrammi a meta’',inMezzo(f,390),'· fine',f[f.length-1].v);
  ok(inMezzo(f,390)===0,'Safari: dopo il gesto la pagina rifa’ l’animazione ('+inMezzo(f,390)+' fotogrammi)');ok(f[f.length-1].v==='home','Safari gesto: finisce su '+f[f.length-1].v);
  const pulita=await p.evaluate(()=>{return new Promise(r=>setTimeout(()=>r(document.documentElement.classList.contains('ncc-subito')),1200));});
  ok(!pulita,'Safari: le animazioni restano spente dopo il gesto');
  /* c · iPhone piu' vecchio (niente hasUAVisualTransition): conta il dito sul bordo */
  await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(700);
  await p.evaluate(()=>__gesto('#scnOv',6,120,430,'touchcancel'));
  rec=p.evaluate(()=>__rec('#scnOv',900));await p.evaluate(()=>{window.__finto='vecchio';history.back();});f=await rec;
  console.log('iPhone vecchio · gesto: fotogrammi a meta’',inMezzo(f,390),'· fine',f[f.length-1].v);
  ok(inMezzo(f,390)===0&&f[f.length-1].v==='home','iPhone vecchio: la pagina non sparisce al volo ('+inMezzo(f,390)+')');
  await p.waitForTimeout(1300);
  /* d · freccia ‹ di Safari (niente gesto): la pagina scorre via normale */
  await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(700);
  rec=p.evaluate(()=>__rec('#scnOv',900));await p.evaluate(()=>history.back());f=await rec;
  console.log('freccia di Safari: fotogrammi in movimento',inMezzo(f,390),'· fine',f[f.length-1].v);
  ok(inMezzo(f,390)>=3&&f[f.length-1].v==='home','freccia di Safari: la pagina non scorre via ('+inMezzo(f,390)+')');
  /* e · profilo: stesso gesto */
  await p.evaluate(()=>nccProfilo());await p.waitForTimeout(700);
  durante=await p.evaluate(()=>__gesto('#pfOv',6,150,430,'touchcancel'));
  rec=p.evaluate(()=>__rec('#pfOv',900));await p.evaluate(()=>{window.__finto='ua';history.back();});f=await rec;
  console.log('Safari · profilo: durante',durante,'px · fotogrammi a meta’',inMezzo(f,390),'· fine',f[f.length-1].v);
  ok(durante===0&&inMezzo(f,390)===0&&f[f.length-1].v==='home','Safari profilo: '+durante+'px, '+inMezzo(f,390)+' a meta’, fine '+f[f.length-1].v);
  /* f · carta di Cosa & Dove girata: il telefono si prende il dito, poi un tocco altrove non conta come risposta */
  await p.evaluate(()=>{openStudy();sdStart('mix');});await p.waitForTimeout(600);await p.evaluate(()=>sdFlip());await p.waitForTimeout(500);
  const carta=await p.evaluate(async()=>{const c=document.getElementById('sdCard');const r=c.getBoundingClientRect();const y=Math.round(r.top+r.height/2),x=Math.round(r.left+8);
    const i0=SS.idx;__dito(c,'touchstart',x,y);for(let k=1;k<=6;k++){await new Promise(q=>requestAnimationFrame(q));__dito(c,'touchmove',x+k*20,y);}
    __dito(c,'touchcancel',x+120,y);await new Promise(q=>setTimeout(q,400));const tr=c.style.transform;
    const fuori=document.getElementById('sdRunCount')||document.body;__dito(fuori,'touchstart',330,120);__dito(fuori,'touchend',330,120);
    await new Promise(q=>setTimeout(q,600));return {tr,i0,i1:SS.idx};});
  console.log('carta Cosa & Dove:',JSON.stringify(carta));
  ok(!carta.tr&&carta.i1===carta.i0,'carta: resta storta o il tocco dopo conta come risposta '+JSON.stringify(carta));
  await p.evaluate(()=>{try{sdExit&&sdExit();}catch(e){}try{goHome();}catch(e){}});await p.waitForTimeout(600);
  /* g · testata Tariffe e le altre con la (i): niente tasti uno sopra l'altro */
  const testate=[['openRegole()','#rgOv .rg-x'],['openNorme()','#nmOv .nm-x'],['openPiazze()','#pzOv .pz-x'],['nccApriCerca()','#cxOv .cx-x']];
  for(const [apriF,sel] of testate){
    await p.evaluate(f=>{try{eval(f);}catch(e){}},apriF);await p.waitForTimeout(900);
    const g=await p.evaluate(sel=>{const x=document.querySelector(sel);if(!x)return null;const i=x.parentElement.querySelector('.t-info');
      const a=x.getBoundingClientRect(),c=i?i.getBoundingClientRect():null;
      const sopra=c?!(a.right<=c.left||c.right<=a.left||a.bottom<=c.top||c.bottom<=a.top):false;
      const t=x.parentElement.querySelector('b,h1,.t-tit,.pz-ti,.nm-ti');const tb=t?t.getBoundingClientRect():null;
      return {sopra,x:Math.round(a.left),i:c?Math.round(c.left):null,tit:tb?Math.round(tb.left):null,righe:tb?Math.round(tb.height):null};},sel);
    console.log('testata',sel.padEnd(14),JSON.stringify(g));
    ok(g&&!g.sopra,'testata '+sel+': la (i) copre il tasto ‹');
    if(sel==='#rgOv .rg-x'){ok(g&&g.x<g.tit&&g.i>g.tit,'Tariffe: ordine ‹ titolo (i) sbagliato '+JSON.stringify(g));await p.screenshot({path:__dirname+'/tariffe-testata.png',clip:{x:0,y:0,width:390,height:260}});}
    await p.evaluate(()=>{['#rgOv','#nmOv','#pzOv','#cxOv'].forEach(s=>{const o=document.querySelector(s);if(!o)return;const b=o.querySelector('.rg-x,.nm-x,.pz-x,.cx-x');if(b)b.click();});});await p.waitForTimeout(700);
  }
  errs.forEach(e=>fails.push('JS Safari '+e));await ctx.close();
  /* ════ 2 · APP SULLA HOME (standalone): il trascinamento nostro ════ */
  ({ctx,p,errs}=await apri(b,true));
  ok(!(await p.evaluate(()=>typeof nccSwipeNativo==='function'&&nccSwipeNativo())),'app: il gesto nostro risulta spento');
  await p.evaluate(()=>nccSez('norme'));await p.waitForTimeout(700);
  durante=await p.evaluate(()=>__gesto('#scnOv',6,140,430,'touchcancel'));await p.waitForTimeout(600);
  let fine=await p.evaluate(()=>{const o=document.getElementById('scnOv');return {x:Math.round(o.getBoundingClientRect().left),st:o.style.transform};});
  console.log('app · dito preso dal telefono: durante',durante,'px · dopo',JSON.stringify(fine));
  ok(durante>100&&fine.x===0&&!fine.st,'app: dopo touchcancel la pagina resta a '+fine.x+'px');
  rec=p.evaluate(()=>__rec('#scnOv',900));durante=await p.evaluate(()=>__gesto('#scnOv',6,250,430,'touchend'));f=await rec;
  const dopo=f.filter(x=>x.x!==null&&x.t>0);const salto=dopo.some((x,i)=>i>0&&x.x!==null&&dopo[i-1].x!==null&&x.x+30<dopo[i-1].x);
  console.log('app · trascino e lascio: da',durante,'px, fotogrammi',dopo.map(x=>x.x).filter((x,i,a)=>x!==a[i-1]).slice(0,14).join(','),'· fine',f[f.length-1].v);
  ok(!salto&&f[f.length-1].v==='home','app: chiudendo la pagina torna indietro prima di uscire');
  /* popup trascinato giu' e dito preso dal telefono: torna su */
  await p.evaluate(()=>nccPopup({icona:'i',titolo:'Prova',testo:'Riquadro di prova',azioni:[{t:'Ok',stile:'pieno'}]}));await p.waitForTimeout(700);
  const pop=await p.evaluate(async()=>{const bx=document.querySelector('#popOv .pop-box');const r=bx.getBoundingClientRect();const x=195,y=Math.round(r.top+30);
    __dito(bx,'touchstart',x,y);for(let k=1;k<=5;k++){await new Promise(q=>requestAnimationFrame(q));__dito(bx,'touchmove',x,y+k*12);}
    __dito(bx,'touchcancel',x,y+60);await new Promise(q=>setTimeout(q,500));return {tr:bx.style.transform,tz:bx.style.transition};});
  console.log('popup · dito preso dal telefono:',JSON.stringify(pop));ok(!pop.tr&&!pop.tz,'popup: resta spostato '+JSON.stringify(pop));
  errs.forEach(e=>fails.push('JS app '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
