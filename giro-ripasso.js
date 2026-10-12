/* IL RIPASSO UNICO (v157), fotogramma per fotogramma (mai schermo vuoto, mai Home di passaggio, si torna dove si era):
   · il riquadro «Ripasso errori» della Home: quante cose oggi e quali (domande, percorsi, vie, piazze, orale); la E da tastiera
   · la pagina: la coda in ordine (prima quello che aspetta da piu' tempo), «Ripassa adesso» parte dalla prima
   · ogni riga parte e si torna qui con la coda aggiornata: il quiz degli errori (una giusta esce), il percorso in scadenza
     in Cieco sulla mappa (‹ e telefono), le vie del Quiz vie (riscritta giusta esce, anche nella riga «Vie da ripassare» e
     nell'elenco di Topografia), la piazza in Verifica (fatta, esce), le prove dell'orale (giusta esce, sbagliata resta)
   · il refuso perdonato nel Quiz vie non resta contato come errore; le vie rifatte giuste passano dal cloud
   · niente da ripassare: la pagina lo dice e il riquadro pure
   uso: node test/giro-ripasso.js [iphone|se|ipado] [chiaro|scuro] */
const {launch,seed,BASE}=require('./lib');const fs=require('fs'),path=require('path'),os=require('os');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const SCH=process.argv[2]||'iphone',TEMA=process.argv[3]||'chiaro';
const VP={se:{width:320,height:568,touch:true,mobile:true},iphone:{width:390,height:844,touch:true,mobile:true},
  ipado:{width:1180,height:820,touch:true,mobile:false}}[SCH];
const OUT=path.join(process.env.OR_OUT||os.tmpdir(),'ripasso-'+SCH+'-'+TEMA);fs.mkdirSync(OUT,{recursive:true});
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
const G=86400000;
(async()=>{
  const b=await launch();
  const ctx=await b.newContext({viewport:{width:VP.width,height:VP.height},serviceWorkers:'block',hasTouch:VP.touch,isMobile:VP.mobile,
    deviceScaleFactor:1,colorScheme:TEMA==='scuro'?'dark':'light'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();const ora=Date.now();
  /* la coda: 3 domande in scadenza (da 3 giorni, da ieri, da oggi) + 2 non ancora; DUOMO - CENTRALE in scadenza da 2 giorni;
     LORETO - LAMBRATE con due vie sbagliate (e DUOMO - CENTRALE con una gia' rifatta giusta); una piazza in scadenza da ieri;
     due prove dell'orale andate male (la piu' vecchia da 4 giorni) e una gia' giusta */
  const dati={routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(ora),
    azzerato2026:String(ora),dark:TEMA==='scuro'?'true':'false',
    qtStats:JSON.stringify({cat:{},err:{'0':{box:0,due:ora-3*G},'1':{box:0,due:ora-G-3600000},'2':{box:0,due:ora-60000},'3':{box:1,due:ora+G},'4':{box:2,due:ora+5*G}}}),
    rSR:JSON.stringify({r1:{box:1,due:ora-2*G,last:ora-4*G},r2:{box:2,due:ora+3*G,last:ora-G}}),
    qStats:JSON.stringify({r2:{correct:3,total:6,wrong:{'1':2,'3':1}},r1:{correct:5,total:6,wrong:{'0':1}}}),
    nccVieOk:JSON.stringify({r1_0:{n:1,t:ora-G}}),
    nccOraleRip:JSON.stringify({pz:{LORETO:{t:ora-4*G,v:'no',n:1}},reg:{obblighi:{t:ora-3600000,v:'quasi',n:1}},perc:{'CENTRALE>MALPENSA':{t:ora-G,v:'si',n:1}}})};
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('dialog',d=>{errs.push('dialog nativo: '+d.message().slice(0,60));d.dismiss().catch(()=>{});});
  await p.goto(BASE+'index.html',{waitUntil:'load'});await p.waitForTimeout(6000);await p.addScriptTag({content:AIUTI});
  /* la piazza in scadenza: la prima delle 91 (l'id lo so solo adesso) */
  const PZ=await p.evaluate(g=>{const l=window.pzTutte?pzTutte():window.__PIAZZE__;const z=l[0];
    const sr={};sr[z.id]={box:1,due:Date.now()-g,last:Date.now()-3*g};localStorage.setItem('pzSR',JSON.stringify(sr));
    try{nccHomeRiquadri();}catch(e){}return {id:z.id,n:z.n,v:z.v.length};},G);
  await p.waitForTimeout(400);
  const film=async(fn,ms)=>{await p.evaluate(()=>{__film=[];__filmOn=true;});await fn();await p.waitForTimeout(ms||1300);return p.evaluate(()=>{__filmOn=false;return __film.slice();});};
  const pulito=(nome,f,arrivo,da)=>{const s=f.join(' → ');
    ok(!f.some(x=>/^vuoto/.test(x)),nome+': schermo vuoto '+s);
    ok(!(da&&da!=='home'?f.slice(0,-1):f.slice(1,-1)).includes('home')||arrivo==='home'||da==='home',nome+': Home di passaggio '+s);
    for(let i=2;i<f.length;i++)if(f[i]===f[i-2]&&f[i]!==f[i-1]){ok(false,nome+': sfarfallio '+s);break;}
    ok(f[f.length-1]===arrivo,nome+': arriva su «'+f[f.length-1]+'» invece di «'+arrivo+'» ('+s+')');
    console.log(' '+(nome+'                              ').slice(0,34)+s);};
  const foto=async n=>{try{await p.screenshot({path:path.join(OUT,n+'.png')});}catch(e){}};
  const tocca=sel=>p.click(sel,{timeout:4000}).catch(e=>ok(false,'tocco '+sel+': '+e.message.split('\n')[0]));
  const coda=()=>p.evaluate(()=>nccRipassoStato());
  const righe=()=>p.evaluate(()=>[...document.querySelectorAll('#scnBody .rip-r')].map(r=>({t:r.querySelector('.qc-lt b').firstChild.textContent,
    n:+(r.querySelector('.qc-n')||{}).textContent,s:r.querySelector('.qc-lt>span').textContent})));
  const tile=()=>p.evaluate(()=>{const r=document.querySelector('#hmNew .hm-rq[onclick^="nccRipasso("]');
    return r?{b:(r.querySelector('.hm-rq-b')||{}).textContent||'',w:(r.querySelector('.hm-rq-w')||{}).textContent||'',s:r.querySelector('.hm-rq-s').textContent}:null;});
  const conta=c=>c.reduce((a,x)=>a+x.n,0);

  /* ── 1 · la Home e la pagina ── */
  let c=await coda();
  console.log(' la coda                          ',J(c.map(x=>x.k+':'+x.n)));
  ok(J(c.map(x=>x.k))===J(['orale','quiz','perc','pz','vie']),'la coda non è in ordine di scadenza: '+J(c.map(x=>x.k)));
  ok(J(c.map(x=>x.n))===J([2,3,1,1,2]),'i conti della coda: '+J(c.map(x=>x.n)));
  let t=await tile();console.log(' il riquadro                      ',J(t));
  ok(t&&t.b==='9'&&t.w==='oggi'&&/2\sprove dell.orale · 3\sdomande · 1\spercorso/.test(t.s),'il riquadro della Home: '+J(t));
  await foto('1-home');
  let f=await film(()=>tocca('#hmNew .hm-rq[onclick^="nccRipasso("]'),1100);pulito('Home → ripasso',f,'pagina:ripasso','home');
  await foto('2-pagina');
  let r=await righe();
  ok(r.length===5&&r[0].t==='Prove dell’orale'&&r[1].t==='Domande del quiz'&&/Da 3 giorni · 5 errori in tutto/.test(r[1].s)
    &&/Da 2 giorni · Duomo\s→ Centrale/.test(r[2].s)&&/Da ieri/.test(r[3].s)&&/Loreto\s→ Lambrate \(2\)/.test(r[4].s),'le righe: '+J(r));
  const cima=await p.evaluate(()=>({n:document.querySelector('#scnBody .rip-n').textContent,go:document.querySelector('#scnBody .rip-go').textContent,
    dopo:(document.querySelector('#scnBody .rip-dopo')||{}).textContent||''}));
  console.log(' in cima                          ',J(cima));
  ok(cima.n==='9'&&/Ripassa adesso · Prove dell.orale/.test(cima.go)&&/1\sdomanda/.test(cima.dopo),'la cima della pagina: '+J(cima));
  f=await film(()=>tocca('#scnOv .t-back'),1000);pulito('‹ → Home',f,'home','pagina:ripasso');
  /* la E da tastiera sulla Home */
  f=await film(()=>p.keyboard.press('e'),1000);pulito('E → ripasso',f,'pagina:ripasso','home');
  f=await film(()=>p.evaluate(()=>history.back()),1000);pulito('telefono → Home',f,'home','pagina:ripasso');
  await tocca('#hmNew .hm-rq[onclick^="nccRipasso("]');await p.waitForTimeout(900);

  /* ── 2 · le prove dell'orale (la prima della coda: «Ripassa adesso») ── */
  f=await film(()=>tocca('#scnBody .rip-go'),1000);pulito('Ripassa adesso → orale',f,'pagina:simorale','pagina:ripasso');
  let o=await p.evaluate(()=>({st:nccOraleStato(),tit:document.querySelector('#scnOv .t-tit').textContent}));
  ok(o.st&&o.st.prove.length===2&&o.st.prove[0].k==='LORETO'&&o.st.prove[1].k==='obblighi'&&/Ripasso dell.orale/.test(o.tit),'il ripasso dell’orale: '+J(o));
  await tocca('#scnBody .ora-go');await p.waitForTimeout(600);await tocca('#scnBody .ora-v.si');await p.waitForTimeout(500);
  /* a meta': il telefono torna al ripasso (la giusta e' gia' uscita) */
  f=await film(()=>p.evaluate(()=>history.back()),1100);pulito('orale a metà telefono → ripasso',f,'pagina:ripasso','pagina:simorale');
  /* la prova rimasta e' di un'ora fa: ora in cima c'e' il quiz (da 3 giorni) */
  r=await righe();const oi=r.findIndex(x=>x.t==='Prove dell’orale');
  ok(oi>0&&r[oi].n===1&&r[0].t==='Domande del quiz','dopo il ✓ la coda: '+J(r.map(x=>x.t+':'+x.n)));
  ok(await p.evaluate(()=>nccOraleStato()===null),'il ripasso lasciato a metà resta aperto');
  await tocca('#scnBody .rip-r >> nth='+oi);await p.waitForTimeout(700);
  await tocca('#scnBody .ora-go');await p.waitForTimeout(600);await tocca('#scnBody .ora-v.no');await p.waitForTimeout(600);
  const fin=await p.evaluate(()=>({tt:document.querySelector('#scnBody .ora-esito .ora-tt').textContent,sub:document.querySelector('#scnBody .ora-sub').textContent,
    go:document.querySelector('#scnBody .ora-go').textContent,st:JSON.parse(localStorage.getItem('nccOrale')||'[]').length}));
  console.log(' fine del ripasso orale           ',J(fin));
  ok(fin.tt==='Ancora da ripassare'&&/Nessuna esce dalla coda, una resta/.test(fin.sub)&&/Torna al ripasso/.test(fin.go)&&fin.st===0,'la fine del ripasso orale: '+J(fin));
  await foto('3-fine-orale');
  f=await film(()=>tocca('#scnBody .ora-go'),1000);pulito('Torna al ripasso',f,'pagina:ripasso','pagina:simorale');

  /* ── 3 · il quiz degli errori: una giusta esce dalla coda ── */
  c=await coda();const qi=c.findIndex(x=>x.k==='quiz');
  /* prima il riquadro «Da dove vengono questi errori» (Inizia / Non ora): Non ora resta qui */
  f=await film(()=>tocca('#scnBody .rip-r >> nth='+qi),1000);pulito('ripasso → riquadro errori',f,'popup','pagina:ripasso');
  f=await film(()=>tocca('#popOv .pop-b.vuoto'),1200);pulito('Non ora → ripasso',f,'pagina:ripasso','popup');
  await tocca('#scnBody .rip-r >> nth='+qi);await p.waitForTimeout(800);
  f=await film(()=>tocca('#popOv .pop-b.pieno'),1800);pulito('Inizia → quiz',f,'quiz','popup');
  const qz=await p.evaluate(()=>({n:Q&&Q.items.length,ids:Q?Q.items.slice(0,3).map(x=>x.id):[],v:qCurView}));
  ok(qz.v==='run'&&qz.n>=3&&J(qz.ids.slice().sort())===J([0,1,2]),'il quiz degli errori: '+J(qz));
  await p.evaluate(()=>{const it=Q.items[Q.idx];qPick(it.correct);});await p.waitForTimeout(900);
  f=await film(()=>p.evaluate(()=>history.back()),1500);pulito('quiz telefono → ripasso',f,'pagina:ripasso','quiz');
  c=await coda();ok((c.find(x=>x.k==='quiz')||{}).n===2,'la domanda giusta non è uscita dalla coda: '+J(c));

  /* ── 4 · il percorso in scadenza: in Cieco sulla mappa; ‹ e telefono tornano qui ── */
  c=await coda();let pi=c.findIndex(x=>x.k==='perc');
  f=await film(()=>tocca('#scnBody .rip-r >> nth='+pi),1600);pulito('ripasso → percorso',f,'mappa','pagina:ripasso');
  const pm=await p.evaluate(()=>({id:cur&&cur.id,m:mode}));ok(pm.id==='r1'&&pm.m==='c','il percorso in scadenza non è in Cieco: '+J(pm));
  f=await film(()=>tocca('#tpBack'),1300);pulito('mappa ‹ → ripasso',f,'pagina:ripasso','mappa');
  await tocca('#scnBody .rip-r >> nth='+pi);await p.waitForTimeout(1600);
  f=await film(()=>p.evaluate(()=>history.back()),1300);pulito('mappa telefono → ripasso',f,'pagina:ripasso','mappa');

  /* ── 5 · le vie: il Quiz vie dal percorso con piu' vie da rifare; riscritta giusta esce ── */
  c=await coda();let vi=c.findIndex(x=>x.k==='vie');
  f=await film(()=>tocca('#scnBody .rip-r >> nth='+vi),1600);pulito('ripasso → vie',f,'mappa','pagina:ripasso');
  const vq=await p.evaluate(()=>({id:cur&&cur.id,m:mode,st:step,via:cur&&cur.steps[step]}));
  ok(vq.id==='r2'&&vq.m==='q'&&vq.st===1,'il Quiz vie non parte dalla prima via da rifare: '+J(vq));
  await p.waitForTimeout(4500);   /* l'aggancio al Quiz vie arriva dopo l'avvio */
  await p.evaluate(v=>{const q=document.getElementById('qa');q.value=v;checkQ();},vq.via);await p.waitForTimeout(400);
  const dopoV=await p.evaluate(()=>({ok:JSON.parse(localStorage.getItem('nccVieOk')||'{}'),n:nccVieConta()}));
  ok(dopoV.ok.r2_1&&dopoV.ok.r2_1.n===2&&dopoV.n===1,'la via rifatta giusta non esce: '+J(dopoV));
  /* il refuso perdonato: non resta contato come errore */
  await p.waitForTimeout(900);
  const ref=await p.evaluate(()=>{const st=step,w0=+((qStats[cur.id].wrong||{})[st])||0,v=cur.steps[st];
    const q=document.getElementById('qa');q.value=v.slice(0,-1)+(v.slice(-1)==='A'?'E':'A');checkQ();
    return {st,w0,w1:+((qStats[cur.id].wrong||{})[st])||0,v,fb:document.getElementById('qfb').textContent};});
  console.log(' refuso                           ',J(ref));
  ok(ref.w1===ref.w0&&/si scrive così/.test(ref.fb),'il refuso perdonato resta contato come errore: '+J(ref));
  f=await film(()=>tocca('#tpBack'),1300);pulito('vie ‹ → ripasso',f,'pagina:ripasso','mappa');
  r=await righe();const rv=r.find(x=>x.t==='Vie sbagliate');ok(rv&&rv.n===1,'la riga delle vie: '+J(rv));
  /* le stesse vie in Topografia: la riga e l'elenco */
  await tocca('#scnOv .t-back');await p.waitForTimeout(800);
  await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(800);
  const t8=await p.evaluate(()=>{const x=[...document.querySelectorAll('#scnOv .qc-riga')].find(y=>/Vie da ripassare/.test(y.textContent));
    return x?(x.querySelector('.qc-n')||{}).textContent||'':'?';});
  ok(t8==='1','la riga «Vie da ripassare» di Topografia: '+t8);
  await p.evaluate(()=>openWrong());await p.waitForTimeout(500);
  const wr=await p.evaluate(()=>({righe:document.querySelectorAll('#wrBody .strow').length,lista:wrList.length,bt:getComputedStyle(document.getElementById('wrBtn')).display}));
  ok(wr.righe===1&&wr.lista===1&&wr.bt!=='none','l’elenco «Vie da ripassare»: '+J(wr));
  await p.evaluate(()=>closeWr());await p.waitForTimeout(500);
  await p.evaluate(()=>nccSezChiudi(true));await p.waitForTimeout(300);
  await tocca('#hmNew .hm-rq[onclick^="nccRipasso("]');await p.waitForTimeout(900);

  /* ── 6 · la piazza: Verifica sopra la pagina; fatta, esce dalla coda ── */
  c=await coda();let zi=c.findIndex(x=>x.k==='pz');
  f=await film(()=>tocca('#scnBody .rip-r >> nth='+zi),1200);pulito('ripasso → piazza',f,'pzOv','pagina:ripasso');
  ok(await p.evaluate(()=>!!document.querySelector('#pzOv .pz-ver')),'la piazza non è in Verifica');
  await foto('4-verifica');
  for(let i=0;i<PZ.v;i++){await p.evaluate(()=>pzVerShow());await p.waitForTimeout(120);await p.evaluate(()=>pzVerSeg(true));await p.waitForTimeout(160);}
  await p.waitForTimeout(500);
  f=await film(()=>p.evaluate(()=>history.back()),1100);pulito('piazza telefono → ripasso',f,'pagina:ripasso','pzOv');
  await p.waitForTimeout(300);
  c=await coda();ok(!c.some(x=>x.k==='pz'),'la piazza fatta resta in coda: '+J(c));
  r=await righe();ok(!r.some(x=>x.t==='Piazze'),'la riga della piazza non è sparita: '+J(r));
  await foto('5-dopo');

  /* ── 7 · le vie rifatte giuste passano dal cloud: vince l'ultima ── */
  const sy=await p.evaluate(()=>{const k=Object.keys(nccSyncRaccogli());const prima=localStorage.getItem('nccVieOk');
    const n=nccSyncUnisci({nccVieOk:JSON.stringify({r2_3:{n:1,t:Date.now()+1000},r2_1:{n:1,t:1}})});
    const o=JSON.parse(localStorage.getItem('nccVieOk'));const conto=nccVieConta();localStorage.setItem('nccVieOk',prima);
    return {k:k.indexOf('nccVieOk')>=0,n,r23:!!o.r2_3,r21:o.r2_1&&o.r2_1.n,conto};});
  ok(sy.k&&sy.n===1&&sy.r23&&sy.r21===2&&sy.conto===0,'le vie rifatte giuste col cloud: '+J(sy));

  /* ── 8 · la (i), e niente da ripassare ── */
  await tocca('#scnOv .t-info');await p.waitForTimeout(500);
  const inf=await p.evaluate(()=>document.getElementById('popOv')?document.getElementById('popOv').textContent:'');
  ok(/Ripasso errori/.test(inf)&&/coda/.test(inf),'la (i) non spiega il ripasso: '+inf.slice(0,60));
  await p.evaluate(()=>nccChiudiPopup());await p.waitForTimeout(300);
  await p.evaluate(()=>{qtStats.err={};try{ls('qtStats',qtStats);}catch(e){}rSR={};localStorage.setItem('rSR','{}');
    localStorage.setItem('nccVieOk',JSON.stringify({r2_1:{n:9,t:Date.now()},r2_3:{n:9,t:Date.now()},r1_0:{n:9,t:Date.now()}}));
    localStorage.setItem('nccOraleRip','{}');localStorage.setItem('pzSR','{}');nccRipassoTorna();});
  await p.waitForTimeout(500);
  const vuota=await p.evaluate(()=>({tt:(document.querySelector('#scnBody .rip-tt')||{}).textContent,righe:document.querySelectorAll('#scnBody .rip-r').length}));
  ok(vuota.tt==='Niente da ripassare oggi'&&vuota.righe===0,'niente da ripassare: '+J(vuota));
  await foto('6-vuota');
  await tocca('#scnOv .t-back');await p.waitForTimeout(900);
  t=await tile();ok(t&&t.b===''&&/Niente da ripassare/.test(t.s),'il riquadro senza niente: '+J(t));
  ok(!errs.length,'errori: '+errs.join(' | '));
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
