/* PERCORSI (v147), a tempo reale, fotogramma per fotogramma:
   · Percorsi salvati › Doppi › «Tieni»: tiene quel percorso, cancella gli altri con lo stesso nome
     (con i loro marker e le statistiche), il nome perde «(pag. N)», i Doppi spariscono;
     «Annulla» rimette tutto com'era; rifatto, dopo un ricarico resta
   · Senza marker › «▶ Il prossimo»: apre l'editor di sempre sul primo percorso senza marker;
     chiuso l'editor, se ha avuto i suoi marker il tasto passa al prossimo
   · 🔊 Ascolta sulla mappa: la voce legge le vie dalla tappa dove sei (sigle per intero) e la mappa segue,
     alla fine «Arrivato»; in Cieco «Tappa N», tre secondi, poi scopre e legge; ritocco o tasto A: si ferma;
     uscendo dalla mappa si ferma. Mai schermi vuoti di passaggio */
const {launch,boot,seed}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
/* partendo, la voce zittisce quella di prima: quel primo «stop» non conta */
const senzaPrimo=a=>a[0]==='·stop·'?a.slice(1):a;
(async()=>{
  const b=await launch();
  const s=seed();
  s.routes.push({id:'n1',title:'NIGUARDA - CADORNA',steps:['P.ZA DERGANO','VIA FARINI','P.LE CIMITERO MONUMENTALE','C.SO COMO','V.LE PASUBIO','L.GO CAIROLI']});
  s.routes.push({id:'n2',title:'NIGUARDA - CADORNA (pag. 17)',steps:['P.LE MACIACHINI','VIA CARISSIMI','VIA FARINI','VIA CERESIO','P.LE CIMITERO MONUMENTALE','C.SO COMO','V.LE PASUBIO','VIA SOLFERINO','L.GO CAIROLI','P.LE CADORNA']});
  s.routes.push({id:'n3',title:'CADORNA - CENTRALE',steps:['P.LE CADORNA','VIA CARDUCCI','C.SO MAGENTA','VIA DANTE']});   /* un altro senza marker */
  const coords=Object.assign({},s.coords,{n1_0:{lat:45.50,lon:9.18},n1_1:{lat:45.49,lon:9.18},n1_2:{lat:45.485,lon:9.18}});
  const qStats={n1:{total:4,ok:3,wrong:{1:1}}};
  const {page:p,ctx,errors}=await boot(b,{clock:false,touch:true,mobile:true,
    extra:{routes:s.routes,coords,qStats,antiFretta:'false',wkRepTs:String(Date.now()),azzerato2026:String(Date.now())}});
  /* la voce finta: segna quello che dice e finisce dopo 300 ms (come una frase corta) */
  await p.addScriptTag({content:`window.__detti=[];
    window.SpeechSynthesisUtterance=function(t){this.text=t;};
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speak:function(u){if(String(u.text).trim())__detti.push(u.text);
      setTimeout(function(){u.onend&&u.onend();},300);},cancel:function(){__detti.push('·stop·');},getVoices:function(){return [];},addEventListener:function(){},speaking:false,pending:false}});
    window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
      while(c&&c!==document.body){if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='popOv')return 'popup';if(c.id==='addModal')return 'editor';
        if(c.id==='mgrModal'||c.id==='mgr')return 'percorsi';if(c.id==='homeScreen')return 'home';if(c.id==='map'||c.id==='panel')return 'mappa';c=c.parentElement;}
      return document.body.classList.contains('on-topo')?'mappa':'vuoto('+(e?(e.id||e.className||e.tagName):'-')+')';};`});
  const film=async(dur,fn)=>{const seq=[];let fine=false;const giro=(async()=>{const t0=Date.now();while(!fine&&Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}})();
    if(fn)await fn();await new Promise(r=>setTimeout(r,dur));fine=true;await giro;return seq;};
  /* ════ 1 · Doppi › Tieni ════ */
  await p.evaluate(()=>{try{goHome();}catch(e){}openMgr();});await p.waitForTimeout(700);
  await p.evaluate(()=>document.getElementById('mgDoppi').click());await p.waitForTimeout(500);
  const righe=await p.evaluate(()=>[...document.querySelectorAll('#mgrList .ri')].filter(x=>x.style.display!=='none')
    .map(x=>({t:x.querySelector('.rit').textContent,tieni:!!x.querySelector('.mg-tieni')})));
  console.log('Doppi:',JSON.stringify(righe));
  ok(righe.length===2&&righe.every(r=>r.tieni),'nei Doppi manca «Tieni» su ogni riga '+JSON.stringify(righe));
  let f=await film(900,()=>p.evaluate(()=>[...document.querySelectorAll('#mgrList .ri')].find(x=>/pag\. 17/.test(x.querySelector('.rit').textContent)).querySelector('.mg-tieni').click()));
  const pop=await p.evaluate(()=>({t:(document.querySelector('#popOv .pop-t')||{}).textContent,x:(document.querySelector('#popOv .pop-x')||{}).textContent,
    b:[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent+'/'+b.className.replace('pop-b ',''))}));
  console.log('Tieni →',f.join(' → '),'|',JSON.stringify(pop));
  ok(pop.t==='Tieni questo'&&/Tengo «NIGUARDA - CADORNA \(pag\. 17\)» \(10 tappe\)/.test(pop.x)&&/NIGUARDA - CADORNA \(6 tappe\)/.test(pop.x)
    &&/Il nome diventa «NIGUARDA - CADORNA»/.test(pop.x)&&pop.b.join('|')==='Tieni questo/rosso|Annulla/vuoto','il riquadro di «Tieni» non dice cosa fa '+JSON.stringify(pop));
  ok(!f.some(x=>/^vuoto/.test(x)),'Tieni: schermo vuoto di passaggio '+f.join(' → '));
  f=await film(900,()=>p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click()));
  const dopo=await p.evaluate(()=>({ids:routes.map(r=>r.id).sort().join(','),tit:(routes.find(r=>r.id==='n2')||{}).title,mk:Object.keys(coords).filter(k=>/^n1_/.test(k)).length,
    qs:!!qStats.n1,rDel:!!(JSON.parse(localStorage.getItem('rDel')||'{}').n1),doppi:!!document.getElementById('mgDoppi'),
    vis:[...document.querySelectorAll('#mgrList .ri')].filter(x=>x.style.display!=='none').length,undo:(document.querySelector('#_undoBar span')||{}).textContent}));
  console.log('tenuto:',JSON.stringify(dopo),'|',f.join(' → '));
  ok(dopo.ids==='n2,n3,r1,r2,r3,r4'&&dopo.tit==='NIGUARDA - CADORNA'&&dopo.mk===0&&!dopo.qs&&dopo.rDel&&!dopo.doppi&&dopo.vis===6
    &&/Tenuto «NIGUARDA - CADORNA», cancellato l’altro/.test(dopo.undo||''),'Tieni questo: '+JSON.stringify(dopo));
  ok(!f.some(x=>/^vuoto/.test(x)),'dopo Tieni: schermo vuoto di passaggio '+f.join(' → '));
  /* Annulla: tutto com'era */
  await p.evaluate(()=>document.querySelector('#_undoBar button').click());await p.waitForTimeout(600);
  const annullato=await p.evaluate(()=>({ids:routes.map(r=>r.id).sort().join(','),tit:(routes.find(r=>r.id==='n2')||{}).title,mk:Object.keys(coords).filter(k=>/^n1_/.test(k)).length,
    qs:!!qStats.n1,rDel:!!(JSON.parse(localStorage.getItem('rDel')||'{}').n1),doppi:(document.getElementById('mgDoppi')||{}).textContent}));
  console.log('Annulla:',JSON.stringify(annullato));
  ok(annullato.ids==='n1,n2,n3,r1,r2,r3,r4'&&annullato.tit==='NIGUARDA - CADORNA (pag. 17)'&&annullato.mk===3&&annullato.qs&&!annullato.rDel&&/Doppi 2/.test(annullato.doppi||''),'Annulla non rimette tutto: '+JSON.stringify(annullato));
  /* rifatto (tenendo il vecchio questa volta), resta anche dopo un ricarico */
  await p.evaluate(()=>{const b=document.getElementById('mgDoppi');if(!b.classList.contains('on'))b.click();});await p.waitForTimeout(400);
  await p.evaluate(()=>[...document.querySelectorAll('#mgrList .ri')].find(x=>x.querySelector('.rit').textContent==='NIGUARDA - CADORNA').querySelector('.mg-tieni').click());await p.waitForTimeout(500);
  await p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click());await p.waitForTimeout(900);
  await p.reload({waitUntil:'load'});await p.waitForTimeout(6500);
  const ric=await p.evaluate(()=>({ids:routes.map(r=>r.id).sort().join(','),tit:(routes.find(r=>r.id==='n1')||{}).title,mk:Object.keys(coords).filter(k=>/^n1_/.test(k)).length}));
  console.log('tenuto il vecchio, dopo il ricarico:',JSON.stringify(ric));
  ok(ric.ids==='n1,n3,r1,r2,r3,r4'&&ric.tit==='NIGUARDA - CADORNA'&&ric.mk===3,'dopo il ricarico «Tieni» non resta: '+JSON.stringify(ric));
  await p.addScriptTag({content:`window.__detti=[];window.SpeechSynthesisUtterance=function(t){this.text=t;};
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speak:function(u){if(String(u.text).trim())__detti.push(u.text);setTimeout(function(){u.onend&&u.onend();},300);},
      cancel:function(){__detti.push('·stop·');},getVoices:function(){return [];},addEventListener:function(){},speaking:false,pending:false}});
    window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
      while(c&&c!==document.body){if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='popOv')return 'popup';if(c.id==='addModal')return 'editor';
        if(c.id==='homeScreen')return 'home';if(c.id==='map'||c.id==='panel')return 'mappa';c=c.parentElement;}
      return document.body.classList.contains('on-topo')?'mappa':'vuoto('+(e?(e.id||e.className||e.tagName):'-')+')';};`});
  /* ════ 2 · Senza marker › Il prossimo ════ */
  await p.evaluate(()=>{try{closeMgr();}catch(e){}try{goHome();}catch(e){}nccSenzaMarker();});await p.waitForTimeout(800);
  const sm=await p.evaluate(()=>{const b=document.querySelector('#scnOv .sm-prossimo');const r=[...document.querySelectorAll('#scnOv .sc-r')].map(x=>x.querySelector('.pf-n').textContent);
    return {b:b?b.textContent:null,dopoNota:!!(b&&b.previousElementSibling&&b.previousElementSibling.classList.contains('sc-nota')),righe:r};});
  console.log('Senza marker:',JSON.stringify(sm));
  ok(sm.b&&/▶ Il prossimo/.test(sm.b)&&sm.b.indexOf(sm.righe[0]+' · ')>=0&&sm.dopoNota,'«Il prossimo» manca o non e’ il primo dell’elenco '+JSON.stringify(sm));
  f=await film(1100,()=>p.evaluate(()=>document.querySelector('#scnOv .sm-prossimo').click()));
  const ed=await p.evaluate(()=>{const m=document.getElementById('addModal');return {open:!!(m&&m.classList.contains('open')),id:window.__nccEdId||null,
    tit:((m&&m.querySelector('input'))||{}).value||''};});
  console.log('▶ Il prossimo →',f.join(' → '),'| editor',JSON.stringify(ed));
  ok(ed.open&&ed.tit===sm.righe[0],'«Il prossimo» non apre l’editor di sempre sul primo: '+JSON.stringify(ed));
  ok(!f.some(x=>/^vuoto/.test(x)),'Il prossimo: schermo vuoto di passaggio '+f.join(' → '));
  /* mentre e' aperto il percorso prende i suoi marker (li mette la persona); chiuso l'editor, il tasto passa al prossimo */
  const primoId=await p.evaluate(t=>{const r=routes.find(x=>x.title===t);coords[r.id+'_0']={lat:45.47,lon:9.19};save();return r.id;},sm.righe[0]);
  f=await film(1200,()=>p.evaluate(()=>closeAdd()));
  const sm2=await p.evaluate(()=>{const b=document.querySelector('#scnOv .sm-prossimo');return {b:b?b.textContent:null,righe:[...document.querySelectorAll('#scnOv .sc-r')].map(x=>x.querySelector('.pf-n').textContent),
    tit:(document.querySelector('#scnOv .sc-titolo, #scnOv h1, #scnOv .sc-t')||{}).textContent||''};});
  console.log('chiuso l’editor →',f.join(' → '),'|',JSON.stringify(sm2));
  ok(sm.righe.length===2&&sm2.righe.indexOf(sm.righe[0])<0&&sm2.righe.length===1&&sm2.b&&sm2.b.indexOf(sm2.righe[0]+' · ')>=0,'chiuso l’editor il tasto non passa al prossimo '+JSON.stringify(sm2));
  ok(f[f.length-1]==='pagina:senza'&&!f.some(x=>/^vuoto/.test(x)),'chiudendo l’editor: '+f.join(' → '));
  await p.evaluate(t=>{const r=routes.find(x=>x.id===t);delete coords[r.id+'_0'];save();},primoId);
  await p.evaluate(()=>{try{nccSezChiudi(true);}catch(e){}try{goHome();}catch(e){}});await p.waitForTimeout(500);
  /* ════ 3 · 🔊 Ascolta ════ */
  const leggibili=await p.evaluate(()=>['P.ZA DUOMO','V.LE GIAN GALEAZZO','P.LE LORETO','C.SO MAGENTA','L.GO CAIROLI','VIA S. VITTORE'].map(nccLeggibile));
  console.log('sigle:',leggibili.join(' | '));
  ok(leggibili.join('|')==='Piazza Duomo|Viale Gian Galeazzo|Piazzale Loreto|Corso Magenta|Largo Cairoli|Via San Vittore','le sigle non si leggono per intero: '+leggibili.join('|'));
  await p.evaluate(()=>{goTopografia();setTimeout(()=>{selectRoute(routes.find(r=>r.id==='r2'));setMode('s');},350);});await p.waitForTimeout(1500);
  /* sull'iPhone col pannello ridotto il tasto sta con Linea e Correggi (nascosti): i tasti ◀ 👁 ▶ restano dentro */
  const mini=await p.evaluate(()=>{const P=document.getElementById('panel'),r=P.getBoundingClientRect(),n=document.getElementById('bNext').getBoundingClientRect(),a=document.getElementById('ascBtn').getBoundingClientRect();
    return {mini:P.classList.contains('pnl-mini'),asc:Math.round(a.width),dentro:n.bottom<=r.bottom+1};});
  await p.evaluate(()=>{document.getElementById('panel').style.maxHeight='620px';});await p.waitForTimeout(500);
  const bt=await p.evaluate(()=>{const b=document.getElementById('ascBtn');const r=b&&b.getBoundingClientRect();return b?{t:b.textContent,w:Math.round(r.width),h:Math.round(r.height),vicino:(b.previousElementSibling||{}).id}:null;});
  console.log('pannello ridotto:',JSON.stringify(mini),'| tirato su, il tasto:',JSON.stringify(bt));
  ok(mini.mini&&mini.asc===0&&mini.dentro,'pannello ridotto dell’iPhone: il tasto spinge fuori ◀ 👁 ▶ '+JSON.stringify(mini));
  ok(bt&&bt.t==='🔊 Ascolta'&&bt.w>0&&bt.h>=30&&bt.vicino==='edBtn','sulla mappa manca «🔊 Ascolta» accanto a Correggi '+JSON.stringify(bt));
  const t0=Date.now();
  f=await film(9000,()=>p.evaluate(()=>{__detti=[];document.getElementById('ascBtn').click();}));
  const st=await p.evaluate(()=>({detti:__detti.slice(),step,b:document.getElementById('ascBtn').textContent,on:document.getElementById('ascBtn').classList.contains('on')}));
  st.detti=senzaPrimo(st.detti);
  console.log('Ascolta (Studio, LORETO - LAMBRATE):',st.detti.join(' → '),'| tappa',st.step,'| tasto',st.b,'|',((Date.now()-t0)/1000).toFixed(1),'s');
  ok(st.detti.join('|')==='Piazzale Loreto|Via Padova|Via Conte Rosso|Via Rubattino|Piazza Leonardo|Arrivato|·stop·'&&st.step===4&&st.b==='🔊 Ascolta'&&!st.on,'Ascolta in Studio: '+JSON.stringify(st));
  ok(f.every(x=>x==='mappa'),'Ascolta: la mappa non resta ferma a schermo '+f.join(' → '));
  /* in Cieco dalla prima tappa: «Tappa 1», tre secondi, poi scopre e legge; col tasto A si ferma */
  await p.evaluate(()=>{selectRoute(routes.find(r=>r.id==='r2'));setMode('c');});await p.waitForTimeout(800);
  await p.evaluate(()=>{__detti=[];document.getElementById('ascBtn').click();});
  await p.waitForTimeout(1500);const c1=await p.evaluate(()=>({detti:__detti.slice()}));c1.detti=senzaPrimo(c1.detti);
  await p.waitForTimeout(2600);const c2=senzaPrimo(await p.evaluate(()=>__detti.slice()));
  await p.waitForTimeout(2200);
  await p.mouse.move(195,430);await p.keyboard.press('a');await p.waitForTimeout(700);
  const c3=await p.evaluate(()=>({detti:__detti.slice(),b:document.getElementById('ascBtn').textContent,step}));
  await p.waitForTimeout(2500);const c4=await p.evaluate(()=>__detti.slice());
  console.log('Ascolta in Cieco: dopo 1,5 s',c1.detti.join(' → '),'| dopo 4 s',c2.join(' → '),'| tasto A',c3.detti.join(' → '),'| poi',c4.length===c3.detti.length?'silenzio':c4.join(' → '));
  ok(c1.detti.join('|')==='Tappa 1'&&c2.join('|')==='Tappa 1|Piazzale Loreto','in Cieco non aspetta tre secondi prima di dire la via: '+JSON.stringify({c1,c2}));
  ok(c3.detti[c3.detti.length-1]==='·stop·'&&c3.b==='🔊 Ascolta'&&c4.length===c3.detti.length,'il tasto A non ferma la voce '+JSON.stringify({c3,c4}));
  /* uscendo dalla mappa si ferma */
  await p.evaluate(()=>{setMode('s');__detti=[];document.getElementById('ascBtn').click();});await p.waitForTimeout(500);
  f=await film(1300,()=>p.evaluate(()=>document.getElementById('tpBack').click()));
  await p.waitForTimeout(2000);const c5=senzaPrimo(await p.evaluate(()=>__detti.slice()));
  console.log('uscendo dalla mappa:',f.join(' → '),'| voce',c5.join(' → '));
  ok(c5[c5.length-1]==='·stop·'&&c5.filter(x=>x!=='·stop·').length===1,'uscendo dalla mappa la voce continua '+c5.join(' → '));
  ok(!f.some(x=>/^vuoto/.test(x)),'uscendo dalla mappa: schermo vuoto '+f.join(' → '));
  await p.screenshot({path:__dirname+'/percorsi.png'});
  errors.forEach(e=>fails.push('JS '+e));await ctx.close();await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
