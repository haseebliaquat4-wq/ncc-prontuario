/* LE SIMULAZIONI, RIVISTE (v163): provate come le usa una persona (e fotogramma per fotogramma dove si muove)
   · ogni simulazione finita si salva con le sue domande e le tue risposte (anche quella finita a tempo scaduto, e solo una
     volta anche quando l'app chiede «Terminare comunque?»); uscita a metà, scheda di studio, ripetizione: niente.
     Le ultime 50, nel cloud si sommano e restano le ultime 50
   · Statistiche › Simulazioni (anche toccando «Simulazioni fatte»): l'andamento (le barre, la riga dei 12, la legenda,
     un tocco su una barra apre la sua) e l'elenco, dalla più recente. Una simulazione si apre e si chiude (senza
     salti, anche dal «Chiudi» in fondo): perché è andata così, errori per argomento, «Tutte · Sbagliate», la
     spiegazione con la tua risposta, «🔁 Rifai le sbagliate» (una ripetizione: niente statistiche) e alla fine si torna
     lì, con la stessa simulazione aperta. Delle simulazioni vecchie restano i numeri
   · sopra la domanda «Nuova» o «Già sbagliata 2 volte», com'era prima della scheda; non nella simulazione né nella
     ripetizione; la riga non cambia altezza
   · nel Risultato «Tutte · Sbagliate» (solo se serve), ogni volta si riparte da Tutte
   · telefono piccolo, iPad, tema scuro: niente esce di lato
   uso: node test/giro-storico.js */
const {chromium}=(()=>{try{return require('playwright');}catch(e){return require('/home/claude/.npm-global/lib/node_modules/playwright');}})();
const fs=require('fs');
const {seed,BASE}=require('./lib');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
const pausa=ms=>new Promise(r=>setTimeout(r,ms));
let B;
/* tre simulazioni di prima (solo i numeri) */
function vecchie(n){const ora=Date.now(),h=[];for(let i=0;i<n;i++){const err=[2,6,1,3,5,0,2,4][i%8],sk=i%3===1?1:0;
  h.push({d:ora-(n+2-i)*86400000,ok:16-err-sk,err:err,skip:sk,pass:err+sk<=4,t:900+i*30});}return h;}
async function apri(o){
  o=o||{};
  const ctx=await B.newContext({viewport:o.vp||{width:390,height:844},serviceWorkers:'block',timezoneId:'Europe/Rome',hasTouch:true,isMobile:true,deviceScaleFactor:1,colorScheme:o.scuro?'dark':'light'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed(),ora=Date.now();
  const dati=Object.assign({routes:J(s.routes),coords:J(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(ora),azzerato2026:String(ora)},o.dati||{});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__s'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__s','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon|navigator\.vibrate/.test(t))errs.push('console: '+t);   /* i coriandoli della simulazione promossa vibrano: nel giro nessuno ha toccato lo schermo */}});
  await p.goto(BASE+'index.html',{waitUntil:'load'});await pausa(6500);
  await p.addScriptTag({content:AIUTI});
  return {ctx,p,errs};
}
const AIUTI=`(function(){
window.__vedo=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),e=document.elementFromPoint(X,Y),c=e;
  var q=document.getElementById('quizApp');if(q&&q.classList.contains('open')&&c&&q.contains(c)&&!document.getElementById('popOv'))return 'quiz';
  while(c&&c!==document.body&&c!==document.documentElement){var cs=getComputedStyle(c);
    if(c.id==='popOv')return 'popup';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='homeScreen')return 'home';
    if(c.id&&(cs.position==='fixed'||cs.position==='absolute'&&c.parentElement===document.body))return c.id;c=c.parentElement;}
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};
window.__film=[];window.__filmOn=false;
var s=document.createElement('div');s.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px;pointer-events:none;';
document.documentElement.appendChild(s);var g=0;
new ResizeObserver(function(){try{if(window.__filmOn){var v=__vedo(),L=window.__film;if(!L.length||L[L.length-1]!==v)L.push(v);}}catch(e){}}).observe(s);
(function giro(){g=1-g;s.style.width=(1+g)+'px';requestAnimationFrame(giro);})();
/* un valore a ogni fotogramma, per ms millisecondi */
window.__campiona=function(fn,ms){return new Promise(function(ok){var t0=performance.now(),v=[];
  (function f(){try{v.push(fn());}catch(e){v.push('err:'+e.message);}if(performance.now()-t0<ms)requestAnimationFrame(f);else ok(v);})();});};
window.__stato=function(){return JSON.stringify({cat:qtStats.cat,seen:qtStats.seenIds,err:qtStats.err,wrongN:qtStats.wrongN||{},daily:qtStats.daily||{},why:qtStats.why||{},
  lastOk:qtStats.lastOk||{},oggi:localStorage.getItem('oggiNcc'),led:localStorage.getItem('qLedPend'),hist:localStorage.getItem('qExamHist')});};
window.__pop=function(){var p=document.getElementById('popOv');return p?{t:(p.querySelector('.pop-t')||{}).textContent,b:[...p.querySelectorAll('.pop-b')].map(function(x){return x.textContent;})}:null;};
window.__tocca=function(re){var b=[...document.querySelectorAll('#popOv .pop-b')].find(function(x){return new RegExp(re).test(x.textContent);});if(b){b.click();return true;}return false;};
window.__dett=function(){try{return JSON.parse(localStorage.getItem('nccSimDett')||'{}');}catch(e){return 'rotto';}};
window.__visibili=function(sel){return [...document.querySelectorAll(sel)].filter(function(x){return x.offsetParent!==null&&x.getClientRects().length;}).length;};
})();`;
/* una simulazione vera: sb sbagliate, sk senza risposta, le altre giuste; poi «Termina» (con la conferma, se ne manca qualcuna) */
async function simulazione(p,sb,sk,scaduto){
  await p.evaluate(()=>{openQuiz();setTimeout(()=>{buildQuiz();qStartExam();},300);});
  await pausa(1500);
  const att=await p.evaluate(a=>{const out=[];
    for(let i=0;i<Q.items.length;i++){const it=Q.items[i];Q.idx=i;
      if(i<a.sk){out.push(0);continue;}
      if(i<a.sk+a.sb){const k=(it.correct+1)%it.choices.length;qPick(k);out.push(it.choices[k]);}
      else{qPick(it.correct);out.push(1);}}
    return {ids:Q.items.map(x=>x.id),r:out};},{sb,sk});
  await pausa(700);
  if(scaduto)await p.evaluate(()=>qFinish(true));
  else{await p.evaluate(()=>{const b=document.querySelector('#qFinish,.q-fin,[onclick*="qFinish"]');if(b)b.click();else qFinish();});await pausa(600);
    if(sk)await p.evaluate(()=>__tocca('Conferma'));}
  await pausa(1500);
  att.pop=await p.evaluate(()=>__pop());
  await p.evaluate(()=>{if(document.getElementById('popOv'))__tocca('dettaglio|Fatto');});await pausa(500);
  return att;
}
function ultimo(p){return p.evaluate(()=>{const h=qExamHist[qExamHist.length-1];return h?h.d:null;});}

(async()=>{
  B=await chromium.launch({headless:true,args:['--no-sandbox']});

  /* ── 1 · si salvano le simulazioni (e nient'altro) ── */
  {const {ctx,p,errs}=await apri({dati:{qExamHist:J(vecchie(3))}});
  const a1=await simulazione(p,2,1,false);
  const d1=await ultimo(p);
  let D=await p.evaluate(()=>__dett());
  const s1=D[String(d1)];
  const n1=Object.keys(D).length;
  console.log(' simulazione con la conferma ',J({chiavi:n1,domande:s1&&s1.q.length,giuste:s1&&s1.q.filter(v=>v[2]===1).length,senza:s1&&s1.q.filter(v=>v[2]===0).length}));
  ok(n1===1&&s1&&s1.q.length===16,'la simulazione non si è salvata (una volta sola): '+J({n1,len:s1&&s1.q.length}));
  ok(s1&&s1.q.every((v,i)=>v[0]===a1.ids[i]&&(a1.r[i]===1?v[2]===1:(a1.r[i]===0?v[2]===0:v[2]===a1.r[i]))),'le risposte salvate non sono quelle date: '+J(s1&&s1.q.slice(0,4))+' / '+J(a1.r.slice(0,4)));
  await simulazione(p,0,0,true);   /* tutta giusta, a tempo scaduto */
  const d2=await ultimo(p);
  D=await p.evaluate(()=>__dett());
  ok(Object.keys(D).length===2&&D[String(d2)]&&D[String(d2)].q.every(v=>v[2]===1),'la simulazione a tempo scaduto: '+J(Object.keys(D)));
  /* uscita a metà, scheda di studio, ripetizione: niente */
  await p.evaluate(()=>{qStartExam();});await pausa(500);
  await p.evaluate(()=>{Q.idx=0;qPick(Q.items[0].correct);});await pausa(300);
  await p.evaluate(()=>history.back());await pausa(1200);
  await p.evaluate(()=>{if(document.getElementById('popOv'))__tocca('Conferma|Esci');});await pausa(900);
  await p.evaluate(()=>{openQuiz();setTimeout(()=>{buildQuiz();startQuiz(QUIZ_ALL.slice(40,43),{mode:'study',title:'Studio'});},300);});await pausa(1300);
  await p.evaluate(()=>{for(let i=0;i<3;i++){Q.idx=i;Q._locked=false;qPick(Q.items[i].correct);}});await pausa(1100);
  await p.evaluate(()=>qFinish(true));await pausa(1300);
  await p.evaluate(()=>{if(document.getElementById('popOv'))__tocca('dettaglio|Fatto');});await pausa(400);
  D=await p.evaluate(()=>__dett());
  const nh=await p.evaluate(()=>qExamHist.length);
  console.log(' poi uscita, studio          ',J({chiavi:Object.keys(D).length,storia:nh}));
  ok(Object.keys(D).length===2&&nh===5,'uscita a metà o studio hanno salvato una simulazione: '+J({chiavi:Object.keys(D).length,nh}));
  /* il tetto: le ultime 50 */
  await p.evaluate(()=>{const o=__dett();for(let i=0;i<60;i++)o[String(1000000+i)]={q:[[1,'x',1]]};localStorage.setItem('nccSimDett',JSON.stringify(o));});
  await simulazione(p,1,0,true);
  D=await p.evaluate(()=>__dett());
  const ks=Object.keys(D).map(Number).sort((a,b)=>a-b);
  const d3=await ultimo(p);
  ok(ks.length===50&&ks[ks.length-1]===d3&&ks.includes(d1)&&ks.includes(d2)&&!ks.includes(1000000),'il tetto delle 50: '+J({n:ks.length,primo:ks[0]}));
  /* il cloud: si sommano, restano le ultime 50; i dati rotti non fanno danni */
  const nube=await p.evaluate(()=>{
    const loc=__dett(),altro={};altro[String(Date.now()+5000)]={q:[[3,'y',0]]};Object.keys(loc).slice(-3).forEach(k=>altro[k]={q:[[9,'z',1]]});
    const n=nccSyncUnisci({nccSimDett:JSON.stringify(altro)});
    const dopo=__dett();
    const n2=nccSyncUnisci({nccSimDett:'[1,2'});const n3=nccSyncUnisci({nccSimDett:'[]'});
    const r=nccSyncRaccogli();
    return {n,len:Object.keys(dopo).length,nuova:!!dopo[Object.keys(altro)[0]],tenute:Object.keys(loc).slice(-3).every(k=>J(dopo[k])===J(loc[k])),n2,n3,ancora:J(__dett())===J(dopo),manda:typeof r.nccSimDett==='string'};
    function J(x){return JSON.stringify(x);}});
  console.log(' cloud                       ',J(nube));
  ok(nube.n===1&&nube.len===50&&nube.nuova&&nube.tenute&&nube.ancora&&nube.manda,'il cloud delle simulazioni: '+J(nube));
  ok(!errs.length,'errori (salvataggio): '+errs.join(' | '));await ctx.close();}

  /* ── 2 · Statistiche › Simulazioni ── */
  {const {ctx,p,errs}=await apri({dati:{qExamHist:J(vecchie(3))}});
  const a=await simulazione(p,3,1,false);   /* bocciata? 4 errori: promossa se non piu' di 2 per argomento */
  const b=await simulazione(p,4,2,true);    /* bocciata: 6 errori */
  const db=await ultimo(p);
  /* il popup di fine simulazione dice com'è andata; si rifanno anche quelle senza risposta */
  console.log(' popup di fine simulazione   ',J(b.pop));
  ok(b.pop&&b.pop.t==='Bocciato'&&/Rifai le 6 sbagliate subito/.test(b.pop.b[0])&&b.pop.b.indexOf('Nuova simulazione')>0&&b.pop.b.indexOf('Vedi il dettaglio')>0,'il popup della bocciata: '+J(b.pop));
  ok(a.pop&&(a.pop.t==='Promosso!'||a.pop.t==='Bocciato')&&/Rifai le 4 sbagliate subito/.test(a.pop.b[0]),'il popup della simulazione con 4 errori: '+J(a.pop));
  const prima=await p.evaluate(()=>__stato());
  await p.evaluate(()=>{try{qToDash();}catch(e){}goHome();});await pausa(900);
  await p.evaluate(()=>nccStat());await pausa(900);
  /* il riquadro «Simulazioni fatte» porta alla scheda; la scheda entra con calma */
  await p.evaluate(()=>{document.getElementById('scnBody').scrollTop=200;});await pausa(200);
  const entra=await p.evaluate(()=>{document.querySelector('.sx-vai').click();return __campiona(()=>{const b=document.querySelector('#scnBody .sx-body');return b?+getComputedStyle(b).opacity:-1;},420);});
  const scheda=await p.evaluate(()=>({tab:(document.querySelector('.sx-tab.on')||{}).textContent,su:document.getElementById('scnBody').scrollTop,
    tabs:[...document.querySelectorAll('.sx-tab')].map(t=>t.textContent),taglio:[...document.querySelectorAll('.sx-tab')].some(t=>t.scrollWidth>t.clientWidth+1)}));
  console.log(' «Simulazioni fatte»         ',J(scheda),'· opacità',J(entra.filter((x,i)=>i%3===0).map(x=>+x.toFixed(2))));
  ok(scheda.tab==='Simulazioni'&&scheda.su===0&&scheda.tabs.length===3&&!scheda.taglio,'la scheda Simulazioni: '+J(scheda));
  ok(entra[0]<0.6&&entra[entra.length-1]===1&&entra.every((x,i)=>i===0||x>=entra[i-1]-0.001),'la scheda non entra con calma: '+J(entra.map(x=>+(+x).toFixed(2))));
  /* il grafico */
  const gr=await p.evaluate(()=>{const c=[...document.querySelectorAll('.sim-c')];const bx=document.querySelector('.sim-bx').getBoundingClientRect(),rl=document.querySelector('.sim-rl').getBoundingClientRect();
    const ult=c[c.length-1];
    return {n:c.length,ok:c.filter(x=>x.classList.contains('ok')).length,ic:c.map(x=>x.querySelector('.sim-i').textContent).join(''),
      riga:Math.round((rl.top-bx.top)/bx.height*100),etichetta:(ult.querySelector('em')||{}).textContent,altre:c.slice(0,-1).some(x=>x.querySelector('em')),
      alta:Math.round(ult.querySelector('.sim-b').getBoundingClientRect().height),leg:document.querySelector('.sim-leg').textContent,gp:document.querySelector('.sim-gp').textContent,
      larghe:c.map(x=>Math.round(x.querySelector('.sim-b').getBoundingClientRect().width)),colpi:c.map(x=>Math.round(x.getBoundingClientRect().width))};});
  console.log(' il grafico                  ',J(gr));
  const okB=await p.evaluate(()=>qExamHist[qExamHist.length-1].ok);
  ok(gr.n===5&&gr.ic.length===5&&gr.riga===25&&gr.etichetta===String(okB)&&!gr.altre&&gr.leg.indexOf('Promossa')>=0&&gr.leg.indexOf('Bocciata')>=0&&/12/.test(gr.leg),'il grafico: '+J(gr));
  ok(gr.alta===Math.round(120*okB/16)||Math.abs(gr.alta-120*okB/16)<=1.5,'la barra non è alta quanto le giuste: '+J({alta:gr.alta,okB}));
  ok(gr.larghe.every(w=>w<=24)&&gr.colpi.every(w=>w>=24),'barre o tocchi della misura sbagliata: '+J({larghe:gr.larghe,colpi:gr.colpi}));
  /* l'elenco: dalla piu' recente */
  const el=await p.evaluate(()=>[...document.querySelectorAll('.sim-r')].map(r=>({id:r.id,t:r.querySelector('.sim-rt').textContent.replace(/\s+/g,' ').trim()})));
  console.log(' l\'elenco                    ',J(el.map(x=>x.t)));
  ok(el.length===5&&el[0].id==='simR-'+db&&/^✗BocciataOggi, \d\d:\d\d · 1 min10\/166 errori›$/.test(el[0].t),'l\'elenco: '+J(el[0]));
  /* una vecchia: solo i numeri */
  await p.evaluate(()=>document.querySelectorAll('.sim-r')[4].querySelector('.sim-rt').click());await pausa(500);
  const vec=await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[4];return {aperta:r.classList.contains('aperta'),t:r.querySelector('.sim-dd').textContent,esp:r.querySelector('.sim-rt').getAttribute('aria-expanded')};});
  ok(vec.aperta&&/solo i numeri/.test(vec.t)&&vec.esp==='true','la simulazione vecchia: '+J(vec));
  await p.evaluate(()=>document.querySelectorAll('.sim-r')[4].querySelector('.sim-rt').click());await pausa(500);
  /* la bocciata si apre: senza salti */
  await p.evaluate(()=>{document.getElementById('scnBody').scrollTop=0;});await pausa(200);
  const apre=await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[0];r.querySelector('.sim-rt').click();
    return __campiona(()=>Math.round(r.querySelector('.sim-rd').getBoundingClientRect().height),520);});
  const det=await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[0];return {pc:r.querySelector('.sim-pc').textContent,arg:r.querySelectorAll('.qarg-box').length,
    rifai:(r.querySelector('.rifai-btn')||{}).textContent,seg:[...r.querySelectorAll('.sb-seg button')].map(b=>b.textContent+(b.classList.contains('on')?'*':'')),
    vis:[...r.querySelectorAll('.sim-dom .qac')].filter(x=>x.offsetParent!==null).length,tutte:r.querySelectorAll('.sim-dom .qac').length,
    tue:[...r.querySelectorAll('.sim-dom .qac.wrong b.r')].map(x=>x.textContent)};});
  console.log(' la bocciata aperta          ',J(det),'· altezza',J(apre.filter((x,i)=>i%4===0)));
  ok(/^✗Bocciata: 6 errori \(2 senza risposta\), al massimo se ne possono fare 4/.test(det.pc)&&det.arg===4&&det.rifai==='🔁 Rifai le 6 sbagliate'
    &&J(det.seg)===J(['Tutte 16','Sbagliate 6*'])&&det.vis===6&&det.tutte===16,'la bocciata aperta: '+J(det));
  ok(J(det.tue)===J(b.r.filter(x=>typeof x==='string')),'le risposte sbagliate mostrate: '+J({det:det.tue,date:b.r.filter(x=>typeof x==='string')}));
  ok(apre[0]<=2&&apre[apre.length-1]>600&&apre.every((x,i)=>i===0||x>=apre[i-1])&&apre.filter((x,i)=>i>0&&x>apre[i-1]).length>=6,'l\'apertura non è morbida: '+J(apre));
  /* Tutte · Sbagliate */
  const fl=await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[0],l=r.querySelector('.sim-dom');r.querySelector('.sb-seg button[data-f="tutte"]').click();
    return __campiona(()=>({o:+(+getComputedStyle(l).opacity).toFixed(2),v:[...l.querySelectorAll('.qac')].filter(x=>x.offsetParent!==null).length}),420);});
  const dopoT=fl[fl.length-1];
  ok(dopoT.v===16&&dopoT.o===1&&fl.some(x=>x.o<0.5)&&fl.findIndex(x=>x.v===16)>=fl.findIndex(x=>x.o<0.5),'«Tutte»: '+J(fl.filter((x,i)=>i%3===0)));
  /* la spiegazione con la tua risposta */
  const sp=await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[0];const c=r.querySelector('.sim-dom .qac.wrong');c.querySelector('.sp-qac').click();
    return {tua:c.querySelector('b.r').textContent};});
  await pausa(900);
  const spp=await p.evaluate(()=>{const p=document.getElementById('popOv');return p?{t:(p.querySelector('.pop-t')||{}).textContent,ko:(p.querySelector('.sp-r.ko')||{}).textContent||''}:null;});
  console.log(' la spiegazione              ',J({sp,spp}));
  ok(spp&&/spiegazione/i.test(spp.t)&&spp.ko.indexOf(sp.tua)>=0,'la spiegazione dalla simulazione: '+J({sp,spp}));
  await p.evaluate(()=>__tocca('Ho capito'));await pausa(600);
  /* «Chiudi» in fondo: si chiude e si torna alla sua riga */
  await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[0];const c=r.querySelector('.sim-chiudi');c.scrollIntoView({block:'end'});});await pausa(300);
  const vuoti=[];
  const chiude=await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[0];r.querySelector('.sim-chiudi').click();
    return __campiona(()=>{const q=r.querySelector('.sim-rd').getBoundingClientRect(),y=Math.max(q.top,80)+Math.min(q.height,200)/2;
      const e=q.height>20&&y<innerHeight-120?document.elementFromPoint(Math.round(innerWidth/2),Math.round(y)):null;   /* dentro la parte che si chiude c'e' sempre il suo contenuto */
      if(e&&e.classList.contains('sim-rd'))window.__vuoto=(window.__vuoto||0)+1;
      return Math.round(q.height);},600);});
  vuoti.push(await p.evaluate(()=>window.__vuoto||0));
  const vista=await p.evaluate(()=>{const sc=document.getElementById('scnBody').getBoundingClientRect(),t=document.querySelectorAll('.sim-r')[0].querySelector('.sim-rt').getBoundingClientRect();return {top:Math.round(t.top-sc.top),bot:Math.round(sc.bottom-t.bottom)};});
  console.log(' «Chiudi» in fondo           ',J({altezza:chiude.filter((x,i)=>i%5===0),riga:vista}));
  ok(chiude[chiude.length-1]===0&&chiude.every((x,i)=>i===0||x<=chiude[i-1])&&vista.top>=0&&vista.bot>0,'«Chiudi» in fondo: '+J({chiude,vista}));
  ok(vuoti[0]===0,'chiudendo si vede la parte vuota (senza contenuto): '+vuoti[0]+' fotogrammi');
  /* un tocco su una barra apre la sua simulazione */
  await p.evaluate(()=>{document.getElementById('scnBody').scrollTop=0;});await pausa(200);
  await p.evaluate(()=>{const c=document.querySelectorAll('.sim-c');c[c.length-2].click();});await pausa(900);
  const barra=await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[1],sc=document.getElementById('scnBody').getBoundingClientRect(),q=r.getBoundingClientRect();
    return {aperta:r.classList.contains('aperta'),top:Math.round(q.top-sc.top),pc:(r.querySelector('.sim-pc')||{}).textContent};});
  console.log(' tocco sulla barra           ',J(barra));
  ok(barra.aperta&&barra.top>=0&&barra.top<=40&&/^✓Promossa con 4 errori \(1 senza risposta\)|^✗Bocciata: 4 errori in|^✗Bocciata: \d errori in/.test(barra.pc),'il tocco sulla barra: '+J(barra));
  /* 🔁 Rifai le sbagliate di quella simulazione: una ripetizione, poi si torna qui */
  await p.evaluate(()=>{const r=document.querySelectorAll('.sim-r')[1];r.querySelector('.rifai-btn').scrollIntoView({block:'center'});});await pausa(300);
  const posto=await p.evaluate(()=>document.getElementById('scnBody').scrollTop);
  await p.evaluate(()=>{__film=[];__filmOn=true;document.querySelectorAll('.sim-r')[1].querySelector('.rifai-btn').click();});await pausa(1800);
  const filmR=await p.evaluate(()=>{__filmOn=false;return __film.slice();});
  const rip=await p.evaluate(()=>({prova:!!Q.prova,n:Q.items.length,ids:Q.items.map(x=>x.id).sort((x,y)=>x-y),rip:!!document.querySelector('#qRunNum .qrip'),sto:!!document.querySelector('#qRunNum .qsto')}));
  const attese=a.ids.filter((id,i)=>a.r[i]!==1).sort((x,y)=>x-y);
  console.log(' Rifai dalla simulazione     ',J(rip),'· film',filmR.join(' → '));
  ok(rip.prova&&J(rip.ids)===J(attese)&&rip.rip&&!rip.sto,'la ripetizione della simulazione: '+J({rip,attese}));
  ok(filmR[filmR.length-1]==='quiz'&&!filmR.some(x=>x==='home'||/^vuoto/.test(x)),'da Statistiche alla ripetizione: '+filmR.join(' → '));
  await p.evaluate(()=>{for(let i=0;i<Q.items.length;i++){Q.idx=i;Q._locked=false;qPick(Q.items[i].correct);}});await pausa(1200);
  await p.evaluate(()=>qFinish(true));await pausa(1400);
  const fin=await p.evaluate(()=>__pop());
  await p.evaluate(()=>__tocca('Fatto'));await pausa(500);
  await p.evaluate(()=>{__film=[];__filmOn=true;const b=[...document.querySelectorAll('#qResult .qres-actions .btn')].pop();b.click();});await pausa(1500);
  const filmT=await p.evaluate(()=>{__filmOn=false;return __film.slice();});
  const torna=await p.evaluate(()=>({pag:(document.getElementById('scnOv')||{getAttribute:()=>null}).getAttribute('data-p'),tab:(document.querySelector('.sx-tab.on')||{}).textContent,
    aperta:(document.querySelectorAll('.sim-r')[1]||{classList:{contains:()=>false}}).classList.contains('aperta'),sc:document.getElementById('scnBody').scrollTop}));
  const dopo=await p.evaluate(()=>__stato());
  console.log(' fine della ripetizione      ',J(fin&&fin.t),'· torna',J(torna),'· film',filmT.join(' → '));
  ok(fin&&fin.t==='Tutte giuste!','la ripetizione tutta giusta: '+J(fin));
  ok(torna.pag==='stat'&&torna.tab==='Simulazioni'&&torna.aperta&&Math.abs(torna.sc-posto)<=2,'il ritorno a Statistiche: '+J({torna,posto}));
  ok(filmT[filmT.length-1]==='pagina:stat'&&!filmT.some(x=>x==='home'||/^vuoto/.test(x)),'dalla ripetizione a Statistiche: '+filmT.join(' → '));
  ok(dopo===prima,'la ripetizione della simulazione ha cambiato le statistiche');
  /* «Nuova simulazione» dalla scheda: finita, si torna qui e la nuova si accende un attimo (solo lei) */
  await p.evaluate(()=>{__film=[];__filmOn=true;document.querySelector('.sim-nuova').click();});await pausa(1800);
  const filmN=await p.evaluate(()=>{__filmOn=false;return __film.slice();});
  await p.evaluate(()=>{for(let i=0;i<Q.items.length;i++){Q.idx=i;qPick(Q.items[i].correct);}});await pausa(800);
  await p.evaluate(()=>qFinish(true));await pausa(1500);
  await p.evaluate(()=>{if(document.getElementById('popOv'))__tocca('dettaglio|Fatto');});await pausa(500);
  await p.evaluate(()=>{const b=[...document.querySelectorAll('#qResult .qres-actions .btn')].pop();b.click();});await pausa(1500);
  const nuova=await p.evaluate(()=>{const r=[...document.querySelectorAll('.sim-r')];return {pag:document.getElementById('scnOv').getAttribute('data-p'),tab:(document.querySelector('.sx-tab.on')||{}).textContent,
    n:r.length,fresche:r.map((x,i)=>x.classList.contains('fresca')?i:-1).filter(i=>i>=0),prima:r[0]&&r[0].id,ultima:'simR-'+qExamHist[qExamHist.length-1].d};});
  console.log(' «Nuova simulazione»         ',J(nuova),'· film',filmN.join(' → '));
  ok(nuova.pag==='stat'&&nuova.tab==='Simulazioni'&&nuova.n===6&&J(nuova.fresche)===J([0])&&nuova.prima===nuova.ultima,'la simulazione nuova dalla scheda: '+J(nuova));
  ok(filmN[filmN.length-1]==='quiz'&&!filmN.some(x=>x==='home'||/^vuoto/.test(x)),'da Statistiche alla simulazione: '+filmN.join(' → '));
  /* Statistiche riaperta da capo: tutto chiuso, Panoramica */
  await p.evaluate(()=>{nccSezChiudi(true);goHome();});await pausa(600);
  await p.evaluate(()=>nccStat());await pausa(700);
  await p.evaluate(()=>nccStatTab('sim'));await pausa(500);
  const capo=await p.evaluate(()=>document.querySelectorAll('.sim-r.aperta').length);
  ok(capo===0,'riaprendo Statistiche le simulazioni restano aperte: '+capo);
  ok(!errs.length,'errori (Statistiche): '+errs.join(' | '));await ctx.close();}

  /* ── 3 · Nuova · Già sbagliata ── */
  {const {ctx,p,errs}=await apri();
  const ids=await p.evaluate(()=>{buildQuiz();const a=QUIZ_ALL[700],b=QUIZ_ALL[701],c=QUIZ_ALL[702];
    qtStats.wrongN=qtStats.wrongN||{};qtStats.wrongN[a.id]=2;qtStats.seenIds[a.id]=1;qtStats.seenIds[b.id]=1;delete qtStats.seenIds[c.id];delete qtStats.wrongN[b.id];delete qtStats.wrongN[c.id];qtSave();return [a.id,b.id,c.id];});
  await p.evaluate(ids=>{openQuiz();setTimeout(()=>{startQuiz(ids.map(i=>QUIZ_ALL[i]),{mode:'study',title:'Targhette'});},300);},ids);await pausa(1400);
  const leggi=()=>p.evaluate(()=>{const n=document.getElementById('qRunNum'),x=n.querySelector('.qsto');return {id:Q.items[Q.idx].id,t:x?x.textContent:'',h:Math.round(n.getBoundingClientRect().height)};});
  const tg={};for(let i=0;i<3;i++){await p.evaluate(i=>qJump(i),i);await pausa(150);const r=await leggi();tg[r.id]=r;}
  console.log(' le targhette                ',J(ids.map(i=>tg[i])));
  ok(tg[ids[0]].t==='Già sbagliata 2 volte'&&tg[ids[1]].t===''&&tg[ids[2]].t==='Nuova','le targhette: '+J(tg));
  ok(new Set(ids.map(i=>tg[i].h)).size===1,'con la targhetta la riga cambia altezza: '+J(ids.map(i=>tg[i].h)));
  /* sbagliata adesso: la targhetta resta com'era prima della scheda */
  await p.evaluate(id=>{const i=Q.items.findIndex(x=>x.id===id);qJump(i);const it=Q.items[i];document.querySelectorAll('#qRunAns .qans')[(it.correct+1)%it.choices.length].click();},ids[2]);
  await pausa(500);await p.evaluate(()=>{const b=document.querySelector('.why-bar button[data-w="x"]');if(b)b.click();});await pausa(300);
  await p.evaluate(id=>{qJump(Q.items.findIndex(x=>x.id===id));},ids[2]);await pausa(150);
  const dopo=await leggi();
  ok(dopo.t==='Nuova','la targhetta è cambiata durante la scheda: '+J(dopo));
  /* finita la scheda, la volta dopo: «Già sbagliata 1 volta» */
  await p.evaluate(()=>{for(let i=0;i<Q.items.length;i++){if(Q.ans[i]<0){Q.idx=i;Q._locked=false;qPick(Q.items[i].correct);}}});await pausa(1200);
  await p.evaluate(()=>qFinish(true));await pausa(1300);await p.evaluate(()=>__tocca('dettaglio|Fatto|Basta'));await pausa(400);
  await p.evaluate(()=>qRetry());await pausa(700);
  await p.evaluate(id=>{qJump(Q.items.findIndex(x=>x.id===id));},ids[2]);await pausa(150);
  const poi=await leggi();
  ok(poi.t==='Già sbagliata 1 volta','la volta dopo: '+J(poi));
  /* simulazione e ripetizione: niente */
  await p.evaluate(()=>qStartExam());await pausa(500);
  const es=await p.evaluate(()=>!!document.querySelector('#qRunNum .qsto'));
  await p.evaluate(ids=>{startQuiz(ids.map(i=>QUIZ_ALL[i]),{mode:'study',title:'Rifai le sbagliate',prova:true});},ids);await pausa(500);
  const pr=await p.evaluate(()=>({sto:!!document.querySelector('#qRunNum .qsto'),rip:!!document.querySelector('#qRunNum .qrip')}));
  ok(!es&&!pr.sto&&pr.rip,'targhette nella simulazione o nella ripetizione: '+J({es,pr}));
  ok(!errs.length,'errori (targhette): '+errs.join(' | '));await ctx.close();}

  /* ── 4 · il Risultato: Tutte · Sbagliate ── */
  {const {ctx,p,errs}=await apri();
  const fine=async(piano)=>{await p.evaluate(pi=>{openQuiz();setTimeout(()=>{buildQuiz();startQuiz(QUIZ_ALL.slice(800,800+pi.length),{mode:'study',title:'Risultato'});},300);},piano);await pausa(1300);
    await p.evaluate(pi=>{pi.forEach((x,i)=>{if(x==='-')return;Q.idx=i;Q._locked=false;const it=Q.items[i];qPick(x==='g'?it.correct:(it.correct+1)%it.choices.length);});},piano);await pausa(1300);
    await p.evaluate(()=>qFinish(true));await pausa(1300);await p.evaluate(()=>__tocca('dettaglio|Fatto|Basta'));await pausa(500);
    return p.evaluate(()=>{const f=document.getElementById('qFiltro');return f?{t:[...f.querySelectorAll('button')].map(b=>b.textContent+(b.classList.contains('on')?'*':'')),vis:__visibili('#qAnalysis .qac'),
      dopo:f.nextElementSibling&&f.nextElementSibling.id}:{t:null,vis:__visibili('#qAnalysis .qac')};});};
  const r1=await fine(['g','s','-','g']);
  console.log(' Risultato con 2 da rivedere ',J(r1));
  ok(J(r1.t)===J(['Tutte 4*','Sbagliate 2'])&&r1.vis===4&&r1.dopo==='qAnalysis','il filtro nel Risultato: '+J(r1));
  const fl=await p.evaluate(()=>{const b=document.querySelector('#qFiltro button[data-f="sb"]');b.click();const l=document.getElementById('qAnalysis');
    return __campiona(()=>({o:+(+getComputedStyle(l).opacity).toFixed(2),v:__visibili('#qAnalysis .qac'),dx:document.getElementById('qFiltro').classList.contains('dx')}),420);});
  const ult=fl[fl.length-1];
  const quali=await p.evaluate(()=>[...document.querySelectorAll('#qAnalysis .qac')].filter(x=>x.offsetParent!==null).map(x=>x.className));
  console.log(' «Sbagliate»                 ',J({ult,quali}));
  ok(ult.v===2&&ult.o===1&&ult.dx&&fl.some(x=>x.o<0.5)&&quali.every(c=>/wrong|skip/.test(c)),'«Sbagliate» nel Risultato: '+J({fl:fl.filter((x,i)=>i%3===0),quali}));
  const r2=await fine(['g','g','g']);
  const r3=await fine(['s','s']);
  const r4=await fine(['s','g','g']);
  console.log(' tutte giuste / tutte sbagliate / di nuovo ',J({r2,r3,r4}));
  ok(r2.t===null&&r3.t===null,'filtro inutile (tutte giuste o tutte sbagliate): '+J({r2,r3}));
  ok(J(r4.t)===J(['Tutte 3*','Sbagliate 1'])&&r4.vis===3,'il Risultato dopo non riparte da Tutte: '+J(r4));
  ok(!errs.length,'errori (Risultato): '+errs.join(' | '));await ctx.close();}

  /* ── 5 · telefono piccolo, iPad, tema scuro ── */
  for(const v of [{vp:{width:320,height:568},nome:'320'},{vp:{width:320,height:568},nome:'320 scuro',scuro:true},{vp:{width:1180,height:820},nome:'iPad orizzontale'},{vp:{width:820,height:1180},nome:'iPad verticale',scuro:true}]){
    const {ctx,p,errs}=await apri({vp:v.vp,scuro:v.scuro,dati:{qExamHist:J(vecchie(14))}});
    await simulazione(p,5,0,true);
    await p.evaluate(()=>{try{qToDash();}catch(e){}goHome();});await pausa(800);
    await p.evaluate(()=>nccStat());await pausa(800);
    await p.evaluate(()=>nccStatTab('sim'));await pausa(500);
    await p.evaluate(()=>document.querySelector('.sim-r .sim-rt').click());await pausa(700);
    const m=await p.evaluate(()=>{const sc=document.getElementById('scnBody');const fuori=[...sc.querySelectorAll('.sim-gr *,.sim-r *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.right>innerWidth+0.5||r.left<-0.5);}).map(e=>e.className||e.tagName).slice(0,5);
      const c=[...document.querySelectorAll('.sim-c')];
      return {largo:document.documentElement.scrollWidth<=innerWidth&&sc.scrollWidth<=sc.clientWidth,fuori,barre:c.length,colpo:Math.min(...c.map(x=>x.getBoundingClientRect().width)),
        taglio:[...document.querySelectorAll('.sx-tab,.sb-seg button,.sim-rm small,.sim-rv small')].filter(x=>x.scrollWidth>x.clientWidth+1).map(x=>x.textContent).slice(0,4),
        th:getComputedStyle(document.querySelector('.sim-r .sb-th')).backgroundColor,scuro:document.documentElement.classList.contains('dark')||document.body.classList.contains('dark')};});
    console.log(' '+v.nome.padEnd(28),J(m));
    ok(m.largo&&!m.fuori.length&&!m.taglio.length,v.nome+': qualcosa esce di lato o è tagliato: '+J(m));
    ok(m.barre===(v.vp.width>=370?12:8)&&m.colpo>=24,v.nome+': le barre del grafico: '+J(m));
    if(v.scuro)ok(m.th==='rgb(58, 58, 60)','tema scuro: il «Tutte · Sbagliate»: '+m.th);
    ok(!errs.length,'errori ('+v.nome+'): '+errs.join(' | '));await ctx.close();
  }

  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await B.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
