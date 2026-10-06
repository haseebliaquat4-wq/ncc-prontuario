/* GLI ELENCHI LUNGHI (v153), coi percorsi del libro (piu' di 200), fotogramma per fotogramma:
   · Correggi le tappe: la casella per cercare per nome o per via (anche due parole insieme), «nessun percorso» se non
     c'e'; aperto un percorso e chiuso l'editor si torna all'elenco filtrato; uscendo e rientrando si riparte da capo
   · Percorsi salvati: «Doppi» non conta le pagine del libro (sono percorsi diversi, li distingue la pagina); due
     percorsi tuoi con lo stesso nome invece si'
   · la mappa: il menu dei percorsi largo quanto lo schermo, i nomi lunghi e il numero delle vie interi
   · Cosa & Dove col suo nome in cima; «Seleziona argomento» con la testata di tutte le altre pagine
   · Tema: la scelta di adesso col segno ✓, piena; le altre leggere
   uso: node test/giro-elenchi.js [iphone|se|ipado] [chiaro|scuro] */
const {launch,boot}=require('./lib');const fs=require('fs'),path=require('path'),os=require('os');
const SCH=process.argv[2]||'iphone',TEMA=process.argv[3]||'chiaro';
const VP={se:{width:320,height:568,touch:true,mobile:true},iphone:{width:390,height:844,touch:true,mobile:true},
  ipado:{width:1180,height:820,touch:true,mobile:false}}[SCH];
const OUT=path.join(process.env.CH_OUT||os.tmpdir(),'elenchi-'+SCH+'-'+TEMA);fs.mkdirSync(OUT,{recursive:true});
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
  const {page:p,errors}=await boot(b,{viewport:{width:VP.width,height:VP.height},touch:VP.touch,mobile:VP.mobile,clock:false,libro:true,bootMs:1500,
    dark:TEMA==='scuro',extra:{antiFretta:'false',wkRepTs:String(Date.now()),azzerato2026:String(Date.now()),dark:TEMA==='scuro'?'true':'false'}});
  for(let i=0;i<40;i++){await p.waitForTimeout(500);if(await p.evaluate(()=>routes.length>150))break;}
  await p.waitForTimeout(1500);
  await p.addScriptTag({content:AIUTI});
  const N=await p.evaluate(()=>routes.length);console.log('percorsi:',N);ok(N>190,'i percorsi del libro non ci sono: '+N);
  const foto=async n=>{try{await p.screenshot({path:path.join(OUT,n+'.png')});}catch(e){}};
  const film=async(fn,ms)=>{await p.evaluate(()=>{__film=[];__filmOn=true;});await fn();await p.waitForTimeout(ms||1300);return p.evaluate(()=>{__filmOn=false;return __film.slice();});};
  const pulito=(nome,f,arrivo)=>{const s=f.join(' → ');
    ok(f.length>0,nome+': nessun fotogramma');
    ok(!f.some(x=>/^vuoto/.test(x)),nome+': schermo vuoto '+s);
    ok(!f.slice(0,-1).includes('home')||arrivo==='home',nome+': Home di passaggio '+s);
    for(let i=2;i<f.length;i++)if(f[i]===f[i-2]&&f[i]!==f[i-1]){ok(false,nome+': sfarfallio '+s);break;}
    ok(f[f.length-1]===arrivo,nome+': arriva su «'+f[f.length-1]+'» invece di «'+arrivo+'» ('+s+')');
    console.log(' '+(nome+'                                  ').slice(0,36)+s);};
  const riga=t=>p.evaluate(t=>{const i=[...document.querySelectorAll('#scnOv .qc-riga')].findIndex(r=>(r.querySelector('b')||r).textContent.trim().indexOf(t)===0);
    if(i<0)return false;const r=document.querySelectorAll('#scnOv .qc-riga')[i];r.scrollIntoView({block:'center'});return true;},t);
  const tocca=async t=>{ok(await riga(t),'riga «'+t+'» non trovata');await p.waitForTimeout(250);
    await p.evaluate(t=>{const r=[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>(r.querySelector('b')||r).textContent.trim().indexOf(t)===0);(r.querySelector('.qc-lt')||r).click();},t);};
  const home=async()=>{await p.evaluate(()=>{try{closeAllM();}catch(e){}try{nccChiudiPopup();}catch(e){}try{nccSezChiudi(true);}catch(e){}goHome();});await p.waitForTimeout(600);};
  const visibili=()=>p.evaluate(()=>[...document.querySelectorAll('#scnBody .pf-gr .sc-r')].filter(r=>r.style.display!=='none').map(r=>{
    const m=(r.getAttribute('onclick')||'').match(/nccEdDaElenco\('([^']*)'\)/),x=m&&routes.find(y=>String(y.id).replace(/'/g,'')===m[1]);
    return x?(x.title+' | '+x.steps.join(' | ')).toUpperCase():'?';}));
  const scrivi=async t=>{await p.click('#ccQ',{clickCount:3});await p.keyboard.press('Backspace');if(t)await p.keyboard.type(t,{delay:15});await p.waitForTimeout(350);};

  /* ── 1 · Correggi le tappe: la ricerca ── */
  await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(800);
  let f=await film(()=>tocca('Correggi le tappe'));pulito('Topografia → Correggi le tappe',f,'pagina:correggi');
  const tutte=(await visibili()).length;
  ok(await p.evaluate(()=>!!document.querySelector('#scnBody .sc-cerca input')),'la casella per cercare non c’è');
  ok(tutte===N,'all’inizio non ci sono tutti: '+tutte+' su '+N);
  await scrivi('linate');let v=await visibili();
  console.log('«linate»:',v.length,'righe');
  ok(v.length>=10&&v.every(x=>x.includes('LINATE')),'«linate»: '+v.length+' '+JSON.stringify(v.filter(x=>!x.includes('LINATE')).slice(0,2)));
  await foto('1-correggi-linate');
  await scrivi('eustachi vitruvio');v=await visibili();
  console.log('«eustachi vitruvio»:',v.length,'righe');
  ok(v.length>=1&&v.every(x=>x.includes('EUSTACHI')&&x.includes('VITRUVIO')),'due parole insieme: '+v.length);
  await scrivi('zzzz');v=await visibili();
  const vuoto=await p.evaluate(()=>(document.querySelector('#scnBody .sc-cerca-vuoto')||{}).textContent||'');
  ok(v.length===0&&/«zzzz»/.test(vuoto),'niente: '+v.length+' «'+vuoto+'»');
  await foto('2-correggi-niente');
  await scrivi('linate');const nL=(await visibili()).length;
  /* apro il primo e chiudo l'editor: torno all'elenco filtrato */
  f=await film(()=>p.evaluate(()=>{[...document.querySelectorAll('#scnBody .pf-gr .sc-r')].filter(r=>r.style.display!=='none')[0].click();}),1500);
  console.log(' apro il primo filtrato:              '+f.join(' → '));
  ok(!f.includes('home')&&!f.some(x=>/^vuoto/.test(x)),'aprendo il percorso: '+f.join(' → '));
  ok(await p.evaluate(()=>!!document.getElementById('edOv')||document.getElementById('addModal').classList.contains('open')),'l’editor non si apre');
  await foto('3-editor');
  f=await film(()=>p.evaluate(()=>{const b=[...document.querySelectorAll('#edOv button,#addModal button')].find(x=>/^Annulla$/.test(x.textContent.trim()));b.click();}),1500);
  pulito('editor › Annulla',f,'pagina:correggi');
  ok(await p.evaluate(()=>(document.getElementById('ccQ')||{}).value)==='linate'&&(await visibili()).length===nL,'tornando dall’editor la ricerca non c’è più');
  /* ‹ e rientro: si riparte da capo */
  f=await film(()=>p.click('#scnOv .t-back'));pulito('‹ → Topografia',f,'pagina:topo');
  f=await film(()=>tocca('Correggi le tappe'));pulito('di nuovo Correggi le tappe',f,'pagina:correggi');
  ok(await p.evaluate(()=>(document.getElementById('ccQ')||{}).value)===''&&(await visibili()).length===N,'rientrando la ricerca vecchia è rimasta');

  /* ── 2 · Percorsi salvati: «Doppi» ── */
  await p.click('#scnOv .t-back');await p.waitForTimeout(700);
  await tocca('Percorsi salvati');await p.waitForTimeout(900);
  const dp=await p.evaluate(()=>({dp:!!document.getElementById('mgDoppi'),n:document.querySelectorAll('#mgrList .ri').length}));
  console.log('Percorsi salvati:',JSON.stringify(dp));
  ok(!dp.dp,'«Doppi» conta le pagine del libro (sono percorsi diversi)');
  await foto('4-salvati');
  await p.evaluate(()=>closeMgr());await p.waitForTimeout(500);
  await p.evaluate(()=>{routes.push({id:'d1',title:'GIRO DOPPIO',steps:['VIA UNO','VIA DUE']},{id:'d2',title:'GIRO DOPPIO',steps:['VIA TRE','VIA QUATTRO']});save();openMgr();});
  await p.waitForTimeout(800);
  const dp2=await p.evaluate(()=>(document.getElementById('mgDoppi')||{}).textContent||'');
  ok(/Doppi 2/.test(dp2),'due tuoi con lo stesso nome: '+dp2);
  await p.evaluate(()=>{closeMgr();routes=routes.filter(r=>!/^d[12]$/.test(r.id));save();});await p.waitForTimeout(400);

  /* ── 3 · la mappa: il menu dei percorsi ── */
  await home();await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(700);
  f=await film(()=>tocca('Studio'),1600);pulito('Topografia → Studio',f,'mappa');
  await p.click('#sbArrow');await p.waitForTimeout(600);
  const mn=await p.evaluate(()=>{const u=document.getElementById('sugg'),r=u.getBoundingClientRect(),W=innerWidth;
    const li=[...u.querySelectorAll('li')].filter(x=>x.querySelector('.si-meta'));
    const fuori=li.filter(x=>{const m=x.querySelector('.si-meta').getBoundingClientRect();return m.right>r.right+.5||m.width<18;}).length;
    const nomi=li.filter(x=>{const t=x.querySelector('span');return t.scrollWidth>t.clientWidth+1;}).length;
    return {vis:u.style.display,l:Math.round(r.left),r:Math.round(r.right),w:Math.round(r.width),W,n:li.length,fuori,nomi};});
  console.log('menu dei percorsi:',JSON.stringify(mn));
  ok(mn.vis==='block'&&mn.n>=N&&mn.l>=11&&mn.r<=mn.W-11,'il menu esce dallo schermo: '+JSON.stringify(mn));
  ok(mn.w>=Math.min(mn.W-24,520)-2,'il menu è stretto: '+mn.w+' su '+mn.W);
  ok(mn.fuori===0&&mn.nomi===0,'nel menu nomi o numeri tagliati: '+JSON.stringify(mn));
  await foto('5-menu');
  await p.click('#sbArrow');await p.waitForTimeout(300);

  /* ── 4 · Cosa & Dove e «Seleziona argomento»: la testata di tutte le pagine ── */
  await home();
  await p.evaluate(()=>{try{openStudy();}catch(e){}});await p.waitForTimeout(900);
  const cd=await p.evaluate(()=>{const h=document.getElementById('sdTitle'),i=document.querySelector('#studyApp .qhi');
    return {t:h.textContent,fs:parseFloat(getComputedStyle(h).fontSize),iw:Math.round(i.getBoundingClientRect().width),ir:getComputedStyle(i).borderRadius};});
  console.log('Cosa & Dove:',JSON.stringify(cd));
  ok(cd.t==='Cosa & Dove'&&cd.fs>=21&&cd.iw===38,'Cosa & Dove in cima: '+JSON.stringify(cd));
  await foto('6-cosa-dove');
  await home();
  await p.evaluate(()=>nccSez('quiz'));await p.waitForTimeout(700);
  f=await film(()=>tocca('Allenati per argomento'),1400);
  console.log(' Quiz → Allenati per argomento:       '+f.join(' → '));
  ok(f[f.length-1]==='quiz'&&!f.slice(0,-1).includes('home'),'Allenati per argomento: '+f.join(' → '));
  const ar=await p.evaluate(()=>{const h=document.getElementById('qTitle'),i=document.querySelector('#quizApp .qhi');
    return {t:h.textContent,fs:parseFloat(getComputedStyle(h).fontSize),intero:h.scrollHeight<=h.clientHeight+1&&h.scrollWidth<=h.clientWidth+1,iw:Math.round(i.getBoundingClientRect().width),
      temi:document.querySelectorAll('#qTopics .tp-card,#qTopics .tpc,#qTopics [onclick]').length};});
  console.log('Seleziona argomento:',JSON.stringify(ar));
  ok(ar.t==='Seleziona argomento'&&ar.fs>=21&&ar.intero&&ar.iw===38,'Seleziona argomento in cima: '+JSON.stringify(ar));
  await foto('7-argomenti');
  await home();

  /* ── 5 · Tema: la scelta di adesso ── */
  const tema=async()=>{await p.evaluate(()=>nccPfTema());await p.waitForTimeout(600);
    return p.evaluate(()=>[...document.querySelectorAll('#popOv .pop-b')].map(b=>({t:b.textContent.trim(),c:b.className})));};
  let T=await tema();
  const ora=TEMA==='scuro'?'Scuro':'Chiaro',altro=TEMA==='scuro'?'Chiaro':'Scuro';
  console.log('Tema:',T.map(x=>x.t+' ['+x.c.replace('pop-b','').trim()+']').join(' | '));
  ok(T.filter(x=>/^✓/.test(x.t)).length===1&&T.some(x=>/^✓/.test(x.t)&&x.t.includes(ora)&&/pieno/.test(x.c)),'Tema: la scelta di adesso ('+ora+') non ha il segno '+JSON.stringify(T));
  ok(T.filter(x=>/tenue/.test(x.c)).length===2,'Tema: le altre due non sono leggere '+JSON.stringify(T));
  await foto('8-tema');
  await p.evaluate(a=>{[...document.querySelectorAll('#popOv .pop-b')].find(b=>b.textContent.includes(a)).click();},altro);await p.waitForTimeout(800);
  T=await tema();
  ok(T.some(x=>/^✓/.test(x.t)&&x.t.includes(altro)),'Tema: dopo la scelta il segno non si sposta '+JSON.stringify(T));
  ok(await p.evaluate(a=>document.body.classList.contains('dark')===(a==='Scuro'),altro),'Tema: '+altro+' non applicato');
  await p.evaluate(a=>{[...document.querySelectorAll('#popOv .pop-b')].find(b=>b.textContent.includes(a)).click();},ora);await p.waitForTimeout(800);

  ok(!errors.length,'errori: '+errors.join(' | '));
  console.log('foto in',OUT);
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
