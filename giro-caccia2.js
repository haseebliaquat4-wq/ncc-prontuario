/* LA CACCIA AI BUG (v164), provata come la fa una persona
   · all'avvio la Home dice quanto sai come il Quiz e Statistiche (prima «68%» contro «67%»: la Home lo calcolava
     senza le domande aggiunte in fondo)
   · Cosa & Dove: «x/218 visti» conta solo i luoghi (prima anche le carte della Metro e delle Strade)
   · Reimposta tutto: la copia di sicurezza è completa (piazze, nome, data dell'esame, simulazioni…) e si cancella solo
     dopo averla salvata; sull'iPhone (il foglio Condividi) si aspetta che sia salvata; annullata, chiede se cancellare
     lo stesso (Annulla non cancella niente)
   · Ripristina da file: il popup dell'app (non il riquadro grigio del browser); «Annulla ripristino» torna a com'era
     prima (non a una copia vecchia scritta nel file) e le copie non contengono la copia di prima del ripristino
   · dopo 50 simulazioni (lo storico tiene le ultime 50) Statistiche dice «50+» e «Le ultime 50 simulazioni»
   uso: node test/giro-caccia2.js */
const {chromium}=(()=>{try{return require('playwright');}catch(e){return require('/home/claude/.npm-global/lib/node_modules/playwright');}})();
const fs=require('fs'),path=require('path'),os=require('os');
const {seed,BASE}=require('./lib');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
const pausa=ms=>new Promise(r=>setTimeout(r,ms));
let B;
async function apri(o){
  o=o||{};
  const ctx=await B.newContext({viewport:o.vp||{width:390,height:844},serviceWorkers:'block',timezoneId:'Europe/Rome',hasTouch:true,isMobile:true,deviceScaleFactor:1,acceptDownloads:true});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed(),ora=Date.now();
  const dati=Object.assign({routes:J(s.routes),coords:J(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(ora),azzerato2026:String(ora)},o.dati||{});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__s'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__s','1');},dati);
  if(o.condividi)await ctx.addInitScript(m=>{try{window.__condivisi=[];
    navigator.canShare=function(x){return !!(x&&x.files&&x.files.length);};
    navigator.share=function(x){return new Promise(function(ok,ko){var f=x.files[0];f.text().then(function(t){window.__condivisi.push({nome:f.name,testo:t});setTimeout(function(){if(m==='salva')ok();else ko(new Error('AbortError'));},700);});});};}catch(e){}},o.condividi);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon|navigator\.vibrate/.test(t))errs.push('console: '+t);}});
  const dialoghi=[];p.on('dialog',d=>{dialoghi.push(d.type()+': '+d.message().slice(0,60));d.dismiss().catch(()=>{});});
  await p.goto(BASE+'index.html',{waitUntil:'load'});await pausa(o.subito?600:6500);
  return {ctx,p,errs,dialoghi};
}
const pop=p=>p.evaluate(()=>{const v=document.getElementById('popOv');return v?{t:(v.querySelector('.pop-t')||{}).textContent||'',testo:v.innerText.replace(/\s+/g,' '),b:[...v.querySelectorAll('.pop-b')].map(x=>x.textContent)}:null;});
const tocca=(p,re)=>p.evaluate(re=>{const b=[...document.querySelectorAll('#popOv .pop-b')].find(x=>new RegExp(re).test(x.textContent));if(b){b.click();return true;}return false;},re);

(async()=>{
  B=await chromium.launch({headless:true,args:['--no-sandbox']});

  /* ── 1 · quanto sai: Home, Quiz e Statistiche dicono lo stesso numero, dal primo istante ── */
  {const ora=Date.now(),seen={},err={},wrongN={};for(let i=0;i<400;i++)seen[i]=1;for(let i=0;i<30;i++){err[i*7+3]={due:ora-86400000,box:i%3};wrongN[i*7+3]=1+i%3;}
  const qt={seenIds:seen,err,wrongN,cat:{geo:{seen:200,ok:150},norm:{seen:100,ok:70},reg:{seen:80,ok:50},lingua:{seen:20,ok:18}},daily:{},bm:{},why:{}};
  const h3=[0,1,2].map(i=>({d:ora-(4-i)*86400000,ok:13,err:3,skip:0,pass:true,t:1200}));   /* tre simulazioni: Statistiche mostra «domande che sai» */
  const {ctx,p,errs}=await apri({dati:{qtStats:J(qt),qExamHist:J(h3)},subito:true});
  const home=await p.evaluate(()=>{const r=[...document.querySelectorAll('#hmNew .hm-rq')].find(x=>/Quiz/.test(x.textContent));return r?(r.querySelector('.hm-rq-b')||{}).textContent:null;});
  await pausa(6000);
  const home2=await p.evaluate(()=>{const r=[...document.querySelectorAll('#hmNew .hm-rq')].find(x=>/Quiz/.test(x.textContent));return r?(r.querySelector('.hm-rq-b')||{}).textContent:null;});
  await p.evaluate(()=>nccSez('quiz'));await pausa(900);
  const quiz=await p.evaluate(()=>{const r=[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>/Scheda di allenamento/.test(x.textContent));const m=r&&r.textContent.match(/(\d+)%/);return m?m[1]+'%':null;});
  await p.evaluate(()=>{nccSezChiudi(true);nccStat();});await pausa(900);
  const stat=await p.evaluate(()=>{const d=[...document.querySelectorAll('#scnOv .sx-tre div')].find(x=>/CHE SAI/.test(x.textContent));return d?d.querySelector('b').textContent:null;});
  console.log(' quanto sai                  ',J({home,home2,quiz,stat}));
  ok(home&&home===quiz&&home===stat&&home2===home,'«sai» diverso fra Home, Quiz e Statistiche: '+J({home,home2,quiz,stat}));
  ok(!errs.length,'errori (quanto sai): '+errs.join(' | '));await ctx.close();}

  /* ── 2 · Cosa & Dove: contano solo i luoghi ── */
  {const {ctx,p,errs}=await apri();
  const visti=()=>p.evaluate(()=>{const r=[...document.querySelectorAll('#hmNew .hm-rq')].find(x=>/Cosa/.test(x.textContent));return r?(r.querySelector('.hm-rq-b')||{}).textContent:null;});
  const a=await visti();
  await p.evaluate(()=>{openStudy();openMetro();});await pausa(700);await p.evaluate(()=>sdStartMetro());await pausa(500);
  for(let i=0;i<4;i++){await p.evaluate(()=>sdFlip());await pausa(150);await p.evaluate(()=>sdAnswer(true));await pausa(450);}
  await p.evaluate(()=>{SS=null;openStrade();});await pausa(600);await p.evaluate(()=>sdStartStrade());await pausa(500);
  for(let i=0;i<3;i++){await p.evaluate(()=>sdFlip());await pausa(150);await p.evaluate(()=>sdAnswer(false));await pausa(450);}
  await p.evaluate(()=>{SS=null;goHome();});await pausa(1400);
  const b=await visti();
  await p.evaluate(()=>{openStudy();sdStart('mix');});await pausa(600);
  for(let i=0;i<2;i++){await p.evaluate(()=>sdFlip());await pausa(150);await p.evaluate(()=>sdAnswer(true));await pausa(450);}
  await p.evaluate(()=>{SS=null;goHome();});await pausa(1400);
  const c=await visti();
  console.log(' Cosa & Dove                 ',J({prima:a,metroStrade:b,dueLuoghi:c}));
  ok(a==='0/218'&&b==='0/218'&&c==='2/218','Cosa & Dove conta le carte della metro o delle strade: '+J({a,b,c}));
  ok(!errs.length,'errori (Cosa & Dove): '+errs.join(' | '));await ctx.close();}

  /* ── 3 · Reimposta tutto ── */
  const tutto={nomeUtente:'Haseeb',nomeTs:String(Date.now()),pzCoords:J({P1:{lat:45.46,lon:9.19,t:Date.now()}}),nccSimDett:J({'123':{q:[[1,'x',1]]}}),examDate:J(Date.now()+30*86400000),nmStats:J({a:{ok:3,ko:1}})};
  const resta=p=>p.evaluate(()=>{let n=0;try{n=(JSON.parse(localStorage.getItem('routes')||'[]')||[]).length;}catch(e){}return {nome:localStorage.getItem('nomeUtente'),pz:localStorage.getItem('pzCoords'),routes:n>0};}).catch(()=>null);
  const reimposta=async p=>{await p.evaluate(()=>nccProfilo());await pausa(900);
    await p.evaluate(()=>{const r=[...document.querySelectorAll('.pf-r')].find(x=>/Reimposta tutto/.test(x.textContent));r.click();});await pausa(900);};
  /* 3a · senza «Condividi» (il PC): scarica la copia completa, poi cancella */
  {const {ctx,p,errs,dialoghi}=await apri({dati:tutto});
  let dl=null;p.on('download',d=>{dl=d;});
  await reimposta(p);
  const chiede=await pop(p);
  await tocca(p,'Conferma');await pausa(700);
  const durante=await resta(p);
  await pausa(5500);
  let copia=null;if(dl){try{copia=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));}catch(e){}}
  const dopo=await resta(p);
  console.log(' Reimposta tutto (PC)        ',J({chiede:chiede&&chiede.testo.slice(0,60),durante,file:dl&&dl.suggestedFilename(),voci:copia&&copia.chiavi,dopo}));
  ok(chiede&&/copia completa/.test(chiede.testo),'la domanda di Reimposta tutto: '+J(chiede));
  ok(copia&&copia.dati&&copia.dati.nomeUtente==='Haseeb'&&copia.dati.pzCoords&&copia.dati.nccSimDett&&copia.dati.examDate&&copia.dati.nmStats&&copia.dati.routes,'la copia di sicurezza non è completa: '+J(copia&&Object.keys(copia.dati||{})));
  ok(durante&&durante.nome==='Haseeb','cancellato prima di aver salvato la copia');
  ok(dopo&&dopo.nome===null&&dopo.pz===null&&!dopo.routes,'dopo Reimposta tutto i dati restano: '+J(dopo));
  ok(!dialoghi.length,'riquadri del browser: '+dialoghi.join(' | '));
  ok(!errs.length,'errori (Reimposta, PC): '+errs.join(' | '));await ctx.close();}
  /* 3b · iPhone: il foglio Condividi; si cancella solo dopo «Salva su File» */
  {const {ctx,p,errs}=await apri({dati:tutto,condividi:'salva'});
  await reimposta(p);await tocca(p,'Conferma');await pausa(400);
  const durante=await resta(p);
  await pausa(5500);
  const cond=await p.evaluate(()=>window.__condivisi||null).catch(()=>null);
  const dopo=await resta(p);
  console.log(' Reimposta tutto (iPhone)    ',J({durante,dopo}));
  ok(durante&&durante.nome==='Haseeb'&&dopo&&dopo.nome===null&&dopo.pz===null,'iPhone, copia salvata: '+J({durante,dopo}));
  ok(!errs.length,'errori (Reimposta, iPhone): '+errs.join(' | '));await ctx.close();}
  /* 3c · iPhone: il foglio Condividi chiuso senza salvare → chiede; Annulla non cancella */
  {const {ctx,p,errs}=await apri({dati:tutto,condividi:'annulla'});
  await reimposta(p);await tocca(p,'Conferma');await pausa(1600);
  const chiede=await pop(p);
  await tocca(p,'Annulla');await pausa(1500);
  const dopoA=await resta(p);
  await reimposta(p);await tocca(p,'Conferma');await pausa(1600);
  await tocca(p,'Cancella senza copia');await pausa(5500);
  const dopoC=await resta(p);
  console.log(' copia non salvata           ',J({chiede:chiede&&chiede.t+' · '+chiede.b.join(' / '),dopoA,dopoC}));
  ok(chiede&&/Cancella senza copia/.test(chiede.b.join(' '))&&dopoA&&dopoA.nome==='Haseeb'&&dopoA.routes,'copia non salvata, Annulla: '+J({chiede,dopoA}));
  ok(dopoC&&dopoC.nome===null&&dopoC.pz===null,'copia non salvata, Cancella senza copia: '+J(dopoC));
  ok(!errs.length,'errori (Reimposta, annullata): '+errs.join(' | '));await ctx.close();}

  /* ── 4 · Ripristina da file ── */
  {const ora=Date.now();
  const {ctx,p,errs,dialoghi}=await apri({dati:{nomeUtente:'Anna',nomeTs:String(ora)}});
  const F=path.join(os.tmpdir(),'ncc-copia-prova-'+process.pid+'.json');
  fs.writeFileSync(F,J({app:'Prontuario NCC Milano',versione:'addon v160',quando:new Date(ora-86400000).toISOString(),chiavi:3,
    dati:{nomeUtente:'Bruno',nomeTs:String(ora-86400000),nccPrimaDelRipristino:J({nomeUtente:'VECCHIO'})}}));
  const [fc]=await Promise.all([p.waitForEvent('filechooser'),p.evaluate(()=>nccRipristina())]);
  await fc.setFiles(F);await pausa(900);
  const chiede=await pop(p);
  await tocca(p,'^Ripristina$');await pausa(7500);
  const dopo=await p.evaluate(()=>({nome:localStorage.getItem('nomeUtente'),prima:JSON.parse(localStorage.getItem('nccPrimaDelRipristino')||'{}').nomeUtente}));
  let dl=null;p.on('download',d=>{dl=d;});
  await p.evaluate(()=>nccEsporta());await pausa(1500);
  let copia=null;if(dl){try{copia=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));}catch(e){}}
  console.log(' Ripristina da file          ',J({chiede:chiede&&chiede.testo.slice(0,50),dialoghi,dopo,dentro:copia&&('nccPrimaDelRipristino' in copia.dati)}));
  ok(chiede&&/SOSTITUISCE/.test(chiede.testo)&&!dialoghi.length,'la domanda del ripristino: '+J({chiede,dialoghi}));
  ok(dopo.nome==='Bruno'&&dopo.prima==='Anna','la copia di prima del ripristino: '+J(dopo));
  ok(copia&&!('nccPrimaDelRipristino' in copia.dati),'la copia contiene la copia di prima del ripristino');
  try{fs.unlinkSync(F);}catch(e){}
  ok(!errs.length,'errori (Ripristina): '+errs.join(' | '));await ctx.close();}

  /* ── 5 · dopo 50 simulazioni ── */
  {const ora=Date.now(),h=[];for(let i=0;i<50;i++)h.push({d:ora-(52-i)*3600000,ok:13,err:3,skip:0,pass:true,t:1200});
  const {ctx,p,errs}=await apri({dati:{qExamHist:J(h)}});
  await p.evaluate(()=>nccStat());await pausa(900);
  const box=await p.evaluate(()=>(document.querySelector('.sx-vai b')||{}).textContent);
  await p.evaluate(()=>nccStatTab('sim'));await pausa(600);
  const tit=await p.evaluate(()=>(document.querySelector('.sim-tit')||{}).textContent);
  console.log(' 50 simulazioni              ',J({box,tit}));
  ok(box==='50+'&&tit==='LE ULTIME 50 SIMULAZIONI','dopo 50 simulazioni: '+J({box,tit}));
  ok(!errs.length,'errori (50 simulazioni): '+errs.join(' | '));await ctx.close();}

  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await B.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
