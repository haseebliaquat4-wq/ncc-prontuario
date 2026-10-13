/* IL QUIZ COME UN'APP DI QUIZ (v162): la scheda, provata come la fa una persona (e fotogramma per fotogramma dove si muove)
   · «🔁 Rifai le sbagliate»: a fine scheda il tasto c'e' (popup e Risultato) solo se hai sbagliato; la ripetizione ha solo
     le sbagliate, dice «Ripetizione», si rifà finché sono tutte giuste («Ne resta 1» → «Tutte giuste!») e non cambia
     niente: statistiche, ripasso, «perché l'hai sbagliata», «Oggi», le chiavi del ripasso; uscita a metà: niente in
     sospeso. Dal popup alla ripetizione mai la Home né uno schermo vuoto. Dopo, una scheda normale conta come sempre
   · «🎲 Non ero sicuro»: dopo una giusta il tasto c'e' (non nella simulazione, nello Sprint, nella ripetizione); toccato
     mentre arriva la domanda dopo, la domanda dopo aspetta; a fine scheda la domanda va nel ripasso per domani (gia' nel
     ripasso: resta al suo livello, non esce); uscita a metà: vale lo stesso; nel Risultato si mette e si toglie
     (anche dopo una simulazione) e togliendolo torna com'era
   · le parole trabocchetto: «non di linea» no, «non», «entro», «consentito» sì; nella simulazione no; spente no
     (l'interruttore sta in Profilo › Testo delle domande, con l'anteprima)
   · il testo delle domande: Piccolo, Normale, Grande, Molto grande (A– A+ in Profilo, resta riaprendo l'app); sul
     telefono piccolo col testo più grande niente esce di lato
   · Safari che mette la pagina da parte a metà scheda e poi la riprende: le risposte non contano due volte
   uso: node test/giro-scheda.js */
const {chromium}=(()=>{try{return require('playwright');}catch(e){return require('/home/claude/.npm-global/lib/node_modules/playwright');}})();
const fs=require('fs');
const {seed,BASE}=require('./lib');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
const pausa=ms=>new Promise(r=>setTimeout(r,ms));
let B;
async function apri(o){
  o=o||{};
  const ctx=await B.newContext({viewport:o.vp||{width:390,height:844},serviceWorkers:'block',timezoneId:'Europe/Rome',hasTouch:true,isMobile:true,deviceScaleFactor:1});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed(),ora=Date.now();
  const dati=Object.assign({routes:J(s.routes),coords:J(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(ora),azzerato2026:String(ora)},o.dati||{});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__s'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__s','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon/.test(t))errs.push('console: '+t);}});
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
/* la scheda: rispondi giusto o sbagliato, «Avanti» dopo l'errore */
window.__risp=function(giusta,perche){var it=Q.items[Q.idx];var b=document.querySelectorAll('#qRunAns .qans')[giusta?it.correct:(it.correct+1)%it.choices.length];b.click();
  if(!giusta)setTimeout(function(){var w=[...document.querySelectorAll('.why-bar button')];var x=perche?w.find(function(k){return k.getAttribute('data-w')===perche;}):w.pop();if(x)x.click();},350);};
window.__stato=function(){return JSON.stringify({cat:qtStats.cat,seen:qtStats.seenIds,err:qtStats.err,wrongN:qtStats.wrongN||{},daily:qtStats.daily||{},why:qtStats.why||{},
  lastOk:qtStats.lastOk||{},oggi:localStorage.getItem('oggiNcc'),chron:localStorage.getItem('chronSusp'),prom:localStorage.getItem('promosse'),bal:localStorage.getItem('errBal'),led:localStorage.getItem('qLedPend')});};
window.__pop=function(){var p=document.getElementById('popOv');return p?{t:(p.querySelector('.pop-t')||{}).textContent,b:[...p.querySelectorAll('.pop-b')].map(function(x){return x.textContent;})}:null;};
window.__tocca=function(re){var b=[...document.querySelectorAll('#popOv .pop-b')].find(function(x){return new RegExp(re).test(x.textContent);});if(b){b.click();return true;}return false;};
})();`;
async function scheda(p,ids,opz){
  await p.evaluate(a=>{openQuiz();setTimeout(()=>{buildQuiz();startQuiz(a.ids.map(i=>QUIZ_ALL.find(x=>x&&x.id===i)),Object.assign({mode:'study',title:'Prova'},a.opz||{}));},300);},{ids,opz});
  await pausa(1300);
}
async function rispondi(p,giusta,perche){await p.evaluate(a=>__risp(a.g,a.w),{g:giusta,w:perche||null});await pausa(giusta?1250:1100);}

(async()=>{
  B=await chromium.launch({headless:true,args:['--no-sandbox']});

  /* ── 1 · Rifai le sbagliate ── */
  {const {ctx,p,errs}=await apri();
  const ids=await p.evaluate(()=>{buildQuiz();return QUIZ_ALL.filter(x=>x).slice(400,404).map(x=>x.id);});
  await scheda(p,ids);
  await rispondi(p,true);await rispondi(p,false,'l');await rispondi(p,false);await rispondi(p,true);
  await p.evaluate(()=>qFinish());await pausa(1400);
  const pop1=await p.evaluate(()=>__pop());
  const dopoScheda=await p.evaluate(()=>__stato());
  console.log(' fine scheda                 ',J(pop1));
  ok(pop1&&/Rifai le 2 sbagliate/.test(pop1.b[0])&&!pop1.b.some(x=>/Rivedi gli errori/.test(x)),'popup di fine scheda: '+J(pop1));
  /* dal popup alla ripetizione, fotogramma per fotogramma */
  await p.evaluate(()=>{__film=[];__filmOn=true;__tocca('Rifai');});await pausa(1400);
  const film1=await p.evaluate(()=>{__filmOn=false;return __film.slice();});
  const rip=await p.evaluate(()=>({n:Q.items.length,prova:!!Q.prova,ids:Q.items.map(x=>x.id),badge:(document.querySelector('#qRunNum .qrip')||{}).textContent||''}));
  console.log(' la ripetizione              ',J(rip),'· film',film1.join(' → '));
  ok(rip.n===2&&rip.prova&&rip.ids.every(i=>ids.slice(1,3).includes(i))&&rip.badge==='Ripetizione','la ripetizione: '+J(rip));
  ok(film1.length&&film1[film1.length-1]==='quiz'&&!film1.some(x=>x==='home'||/^vuoto/.test(x)),'dal popup alla ripetizione: '+film1.join(' → '));
  const dado1=await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();return !!document.getElementById('dadoBtn');});
  await pausa(1300);
  await rispondi(p,false,'k');
  await p.evaluate(()=>qFinish());await pausa(1400);
  const pop2=await p.evaluate(()=>__pop());
  console.log(' ripetizione con un errore   ',J(pop2),'· 🎲 nella ripetizione:',dado1);
  ok(pop2&&pop2.t==='Ne resta 1'&&/Rifai la sbagliata/.test(pop2.b[0]),'«Ne resta 1»: '+J(pop2));
  ok(!dado1,'nella ripetizione c’è «Non ero sicuro»');
  const rb=await p.evaluate(()=>(document.querySelector('#rifaiBox button')||{}).textContent||'');
  ok(/Rifai la sbagliata/.test(rb),'nel Risultato della ripetizione manca il tasto: '+rb);
  await p.evaluate(()=>__tocca('Rifai'));await pausa(1300);
  await rispondi(p,true);await p.evaluate(()=>qFinish());await pausa(1400);
  const pop3=await p.evaluate(()=>__pop());
  const dopoRip=await p.evaluate(()=>__stato());
  console.log(' ripetizione tutta giusta    ',J(pop3));
  ok(pop3&&pop3.t==='Tutte giuste!','«Tutte giuste!»: '+J(pop3));
  ok(dopoRip===dopoScheda,'la ripetizione ha cambiato statistiche o ripasso');
  if(dopoRip!==dopoScheda){const a=JSON.parse(dopoScheda),b=JSON.parse(dopoRip);Object.keys(a).forEach(k=>{if(J(a[k])!==J(b[k]))console.log('     diversa:',k,J(a[k]).slice(0,160),'→',J(b[k]).slice(0,160));});}
  /* uscita a metà di una ripetizione: niente in sospeso, niente registrato */
  await p.evaluate(()=>__tocca('Fatto'));await pausa(500);
  await p.evaluate(()=>{const ids=Q.items.map(x=>x.id);startQuiz(ids.map(i=>QUIZ_ALL.find(x=>x&&x.id===i)),{mode:'study',title:'Rifai le sbagliate',prova:true});});await pausa(900);
  await rispondi(p,false,'c');
  const led=await p.evaluate(()=>localStorage.getItem('qLedPend'));
  await p.evaluate(()=>history.back());await pausa(1200);   /* il tasto indietro del telefono */
  const dopoUscita=await p.evaluate(()=>__stato());
  ok(led===null&&dopoUscita===dopoScheda,'uscita a metà della ripetizione: '+J({led:!!led,uguale:dopoUscita===dopoScheda}));
  /* dopo, una scheda normale conta come sempre */
  const prima=await p.evaluate(()=>Object.values(qtStats.cat).reduce((a,c)=>a+(c.seen||0),0));
  await scheda(p,await p.evaluate(()=>QUIZ_ALL.filter(x=>x).slice(500,502).map(x=>x.id)));
  await rispondi(p,true);await rispondi(p,false);
  await p.evaluate(()=>{goHome();});await pausa(900);   /* uscita a metà: le due risposte si registrano */
  const dopo=await p.evaluate(()=>Object.values(qtStats.cat).reduce((a,c)=>a+(c.seen||0),0));
  console.log(' poi una scheda normale      ',J({prima,dopo}));
  ok(dopo===prima+2,'la scheda normale dopo la ripetizione non conta: '+J({prima,dopo}));
  ok(!errs.length,'errori (rifai): '+errs.join(' | '));await ctx.close();}

  /* ── 1b · dalla Home (Oggi › quiz): sbagliate, Rifai, Fatto, indietro → la Home, senza niente in mezzo ── */
  {const {ctx,p,errs}=await apri();
  await p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'q\'"]').click());await pausa(1800);
  await p.evaluate(()=>{Q.items.forEach((it,i)=>{if(i<Q.items.length-1)Q.ans[i]=i<2?(it.correct+1)%it.choices.length:it.correct;});Q.idx=Q.items.length-1;qRenderRun();});await pausa(400);
  await rispondi(p,true);await p.evaluate(()=>qFinish());await pausa(1400);
  await p.evaluate(()=>__tocca('Rifai'));await pausa(1300);
  await rispondi(p,true);await rispondi(p,true);
  await p.evaluate(()=>qFinish());await pausa(1400);
  const fine=await p.evaluate(()=>__pop());
  await p.evaluate(()=>__tocca('Fatto'));await pausa(600);
  await p.evaluate(()=>{__film=[];__filmOn=true;history.back();});await pausa(1500);
  const film=await p.evaluate(()=>{__filmOn=false;return __film.slice();});
  console.log(' dalla Home, indietro        ',J(fine&&fine.t),'·',film.join(' → '));
  ok(fine&&fine.t==='Tutte giuste!'&&film[film.length-1]==='home'&&!film.some(x=>/^pagina|^vuoto/.test(x)),'dalla Home con la ripetizione: '+J({fine,film}));
  ok(!errs.length,'errori (dalla Home): '+errs.join(' | '));await ctx.close();}

  /* ── 2 · 🎲 Non ero sicuro ── */
  {const ora=Date.now();
  const {ctx,p,errs}=await apri({dati:{}});
  const ids=await p.evaluate(()=>{buildQuiz();return QUIZ_ALL.filter(x=>x).slice(600,604).map(x=>x.id);});
  /* la terza e' gia' nel ripasso al livello 2: giusta la promuoverebbe (esce); con «non ero sicuro» resta */
  await p.evaluate(id=>{qtStats.err[id]={box:2,due:Date.now()-1000};qtSave();},ids[2]);
  await scheda(p,ids);
  /* 1: giusta + dado toccato a metà dell'attesa: la domanda dopo aspetta */
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});
  await pausa(450);
  const d=await p.evaluate(()=>{const b=document.getElementById('dadoBtn');if(!b)return null;const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,t:b.textContent};});
  let tenuta=null;
  if(d){await p.touchscreen.tap(d.x,d.y);await pausa(80);tenuta=await p.evaluate(()=>Q.idx);}
  await pausa(1100);
  const poi=await p.evaluate(()=>({idx:Q.idx,m:Q.__marche}));
  console.log(' 🎲 dopo la giusta           ',J({tasto:d&&d.t,durante:tenuta,poi}));
  ok(d&&/Non ero sicuro/.test(d.t)&&tenuta===0&&poi.idx===1&&poi.m[String(ids[0])],'il tasto 🎲: '+J({d,tenuta,poi}));
  /* 2: giusta senza dado; 3: giusta con dado (era nel ripasso); 4: sbagliata */
  await rispondi(p,true);
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await pausa(150);
  await p.evaluate(()=>document.getElementById('dadoBtn').click());await pausa(1500);
  await rispondi(p,false);
  await p.evaluate(()=>qFinish());await pausa(1400);
  const e=await p.evaluate(ids=>ids.map(i=>qtStats.err[i]===undefined?null:qtStats.err[i]),ids);
  const domani=x=>x&&x.due>Date.now()+20*3600e3&&x.due<Date.now()+28*3600e3;
  console.log(' a fine scheda               ',J(e.map(x=>x&&{box:x.box,ore:Math.round((x.due-Date.now())/3600e3)})));
  ok(e[0]&&e[0].box===1&&domani(e[0]),'«non ero sicuro» (nuova): '+J(e[0]));
  ok(e[1]===null,'giusta senza 🎲 finita nel ripasso: '+J(e[1]));
  ok(e[2]&&e[2].box===2&&domani(e[2]),'«non ero sicuro» (gia’ nel ripasso): '+J(e[2]));
  ok(e[3]&&e[3].box===0,'la sbagliata: '+J(e[3]));
  /* nel Risultato: la prima e' segnata, la seconda si segna e si toglie */
  await p.evaluate(()=>__tocca('dettaglio'));await pausa(600);
  const r0=await p.evaluate(()=>[...document.querySelectorAll('#qAnalysis .qac')].map(c=>{const b=c.querySelector('.dado-qac');return b?(b.classList.contains('on')?'on':'off'):'-';}));
  await p.evaluate(()=>document.querySelectorAll('#qAnalysis .qac')[1].querySelector('.dado-qac').click());await pausa(200);
  const e1=await p.evaluate(id=>qtStats.err[id]||null,ids[1]);
  await p.evaluate(()=>document.querySelectorAll('#qAnalysis .qac')[1].querySelector('.dado-qac').click());await pausa(200);
  const e1b=await p.evaluate(id=>qtStats.err[id]===undefined?null:qtStats.err[id],ids[1]);
  await p.evaluate(()=>document.querySelectorAll('#qAnalysis .qac')[0].querySelector('.dado-qac').click());await pausa(200);
  const e0b=await p.evaluate(id=>qtStats.err[id]===undefined?null:qtStats.err[id],ids[0]);
  console.log(' nel Risultato               ',J({tasti:r0,segna:e1&&e1.box,togli:e1b,tolta1:e0b}));
  ok(J(r0)===J(['on','off','on','-']),'i 🎲 nel Risultato: '+J(r0));
  ok(e1&&e1.box===1&&domani(e1)&&e1b===null&&e0b===null,'segna e togli dal Risultato: '+J({e1,e1b,e0b}));
  /* uscita a metà: la «non ero sicuro» vale lo stesso */
  await p.evaluate(()=>{qToDash();});await pausa(500);
  const id5=await p.evaluate(()=>QUIZ_ALL.filter(x=>x)[650].id);
  await scheda(p,[id5,await p.evaluate(()=>QUIZ_ALL.filter(x=>x)[651].id)]);
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await pausa(150);
  await p.evaluate(()=>document.getElementById('dadoBtn').click());await pausa(1500);
  const via=await p.evaluate(()=>{history.back();return true;});await pausa(1200);   /* il tasto indietro del telefono: Q diventa null prima della registrazione */
  const e5=await p.evaluate(id=>qtStats.err[id]||null,id5);
  const fuori=await p.evaluate(()=>typeof Q==='undefined'||!Q||!document.getElementById('quizApp').classList.contains('open')||qCurView!=='run');
  ok(fuori,'il tasto indietro a metà scheda non esce dal quiz');
  ok(e5&&e5.box===1&&domani(e5),'uscita a metà con 🎲: '+J(e5));
  /* niente 🎲 nella simulazione e nello Sprint */
  await p.evaluate(()=>{openQuiz();setTimeout(()=>{buildQuiz();qStartExam();},300);});await pausa(1300);
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await pausa(400);
  const esame=await p.evaluate(()=>({dado:!!document.getElementById('dadoBtn'),trap:document.querySelectorAll('#qRunQ .trap').length}));
  await p.evaluate(()=>{Q._finished=true;goHome();});await pausa(800);
  await scheda(p,[id5],{limit:180,title:'Sprint 3 minuti'});
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await pausa(300);
  const sprint=await p.evaluate(()=>!!document.getElementById('dadoBtn'));
  ok(!esame.dado&&!sprint,'🎲 nella simulazione o nello Sprint: '+J({esame:esame.dado,sprint}));
  await p.evaluate(()=>{goHome();});await pausa(800);
  /* nel Risultato della simulazione il 🎲 c'e' */
  await p.evaluate(()=>{openQuiz();setTimeout(()=>{buildQuiz();qStartExam();},300);});await pausa(1300);
  await p.evaluate(()=>{Q.items.forEach((it,i)=>{Q.ans[i]=i<12?it.correct:(it.correct+1)%it.choices.length;});qFinish(true);});await pausa(1600);
  const sim=await p.evaluate(()=>({pop:__pop(),dadi:document.querySelectorAll('#qAnalysis .dado-qac').length}));
  console.log(' simulazione                 ',J(sim));
  ok(sim.dadi===12&&sim.pop&&/Rifai le 4 sbagliate/.test(sim.pop.b[0]),'il Risultato della simulazione: '+J(sim));
  ok(!errs.length,'errori (non ero sicuro): '+errs.join(' | '));await ctx.close();}

  /* ── 3 · le parole trabocchetto ── */
  {const {ctx,p,errs}=await apri();
  const q=await p.evaluate(()=>{buildQuiz();const t=QUIZ_ALL.filter(x=>x);
    const re=(s)=>new RegExp(s,'i');
    return {linea:t.find(x=>/non di linea/i.test(x.q)&&!/(^|[^a-z])(non(?! di linea)|n[éè]|mai|sempre|solo|entro|vietat|consentit|obbligator|ammess|massim|minim|fino|almeno)([^a-z]|$)/i.test(x.q)).id,
      non:t.find(x=>/ non è /i.test(x.q)).id,entro:t.find(x=>/^entro /i.test(x.q)).id,cons:t.find(x=>/ consentito/i.test(x.q)).id};});
  const vedi=async()=>p.evaluate(()=>[...document.querySelectorAll('#qRunQ .trap')].map(b=>b.textContent.toLowerCase()));
  const r={};
  for(const k of ['linea','non','entro','cons']){await scheda(p,[q[k]]);r[k]=await vedi();await p.evaluate(()=>goHome());await pausa(600);}
  console.log(' trabocchetti                ',J(r));
  ok(r.linea.length===0&&r.non.includes('non')&&r.entro.includes('entro')&&r.cons.includes('consentito'),'le parole trabocchetto: '+J(r));
  await p.evaluate(()=>{nccTogTrappole();});
  await scheda(p,[q.non]);const spente=await vedi();await p.evaluate(()=>goHome());await pausa(600);
  await p.evaluate(()=>{nccTogTrappole();});
  await scheda(p,[q.non]);const riaccese=await vedi();await p.evaluate(()=>goHome());await pausa(600);
  ok(spente.length===0&&riaccese.includes('non'),'interruttore: '+J({spente,riaccese}));
  ok(!errs.length,'errori (trabocchetti): '+errs.join(' | '));await ctx.close();}

  /* ── 4 · il testo delle domande ── */
  for(const vp of [{width:390,height:844},{width:320,height:568}]){
    const {ctx,p,errs}=await apri({vp});
    const lungo=await p.evaluate(()=>{buildQuiz();return QUIZ_ALL.filter(x=>x&&x.q.length>160&&x.choices.some(c=>c.length>60))[0].id;});
    const misure=[];
    for(const lv of [-1,0,1,2]){
      await p.evaluate(l=>{localStorage.setItem('nccTesto',String(l));},lv);
      await p.reload();await pausa(6000);await p.addScriptTag({content:AIUTI});
      await scheda(p,[lungo]);
      misure.push(await p.evaluate(()=>{const q=document.getElementById('qRunQ'),a=document.querySelector('#qRunAns .qans');const r=document.getElementById('qRun');
        r.scrollTop=r.scrollHeight;const ul=[...document.querySelectorAll('#qRunAns .qans')].pop().getBoundingClientRect();
        return {q:parseFloat(getComputedStyle(q).fontSize),a:parseFloat(getComputedStyle(a).fontSize),largo:document.documentElement.scrollWidth<=innerWidth&&r.scrollWidth<=r.clientWidth+1,ultima:ul.bottom<=innerHeight+1};}));
      await p.evaluate(()=>goHome());await pausa(500);
    }
    console.log((' testo '+vp.width+'                  ').slice(0,30),J(misure));
    ok(J(misure.map(m=>[m.q,m.a]))===J([[19,15.5],[21,17],[24,19],[27,21]]),'le misure del testo '+vp.width+': '+J(misure));
    ok(misure.every(m=>m.largo&&m.ultima),'testo grande '+vp.width+': qualcosa esce o l’ultima risposta non si raggiunge '+J(misure));
    /* Profilo › Testo delle domande */
    await p.evaluate(()=>nccProfilo());await pausa(800);
    const riga0=await p.evaluate(()=>([...document.querySelectorAll('.pf-r')].find(x=>/Testo delle domande/.test(x.textContent))||{}).textContent);
    await p.evaluate(()=>[...document.querySelectorAll('.pf-r')].find(x=>/Testo delle domande/.test(x.textContent)).click());await pausa(700);
    const pz=await p.evaluate(()=>({n:document.getElementById('tzN').textContent,piu:document.getElementById('tzPiu').disabled,meno:document.getElementById('tzMeno').disabled}));
    await p.evaluate(()=>{document.getElementById('tzMeno').click();document.getElementById('tzMeno').click();document.getElementById('tzMeno').click();document.getElementById('tzMeno').click();});await pausa(300);
    const pz2=await p.evaluate(()=>({n:document.getElementById('tzN').textContent,meno:document.getElementById('tzMeno').disabled,l:localStorage.getItem('nccTesto'),cls:document.documentElement.className}));
    /* nello stesso foglio l'interruttore delle parole trabocchetto, con l'anteprima */
    const tr0=await p.evaluate(()=>({on:document.getElementById('tzTrap').getAttribute('aria-checked'),rosse:document.querySelectorAll('#tzQ .trap').length}));
    await p.evaluate(()=>document.getElementById('tzTrap').click());await pausa(300);
    const tr1=await p.evaluate(()=>({on:document.getElementById('tzTrap').getAttribute('aria-checked'),rosse:document.querySelectorAll('#tzQ .trap').length,v:localStorage.getItem('nccTrappole')}));
    await p.evaluate(()=>__tocca('Fatto'));await pausa(500);
    const riga1=await p.evaluate(()=>([...document.querySelectorAll('.pf-r')].find(x=>/Testo delle domande/.test(x.textContent))||{}).textContent);
    await p.evaluate(()=>nccTogTrappole());await pausa(200);
    console.log(' Profilo '+vp.width+'                ',J({riga0,pz,pz2,tr0,tr1,riga1}));
    ok(/Molto grande/.test(riga0)&&pz.piu&&!pz.meno&&pz2.n==='Piccolo'&&pz2.meno&&pz2.l==='-1'&&/qz-p/.test(pz2.cls)&&/Piccolo/.test(riga1),'Profilo › Testo delle domande '+vp.width+': '+J({riga0,pz,pz2,riga1}));
    ok(tr0.on==='true'&&tr0.rosse>0&&tr1.on==='false'&&tr1.rosse===0&&tr1.v==='0'&&/trabocchetti spenti/.test(riga1),'l’interruttore delle parole trabocchetto '+vp.width+': '+J({tr0,tr1,riga1}));
    ok(!errs.length,'errori (testo '+vp.width+'): '+errs.join(' | '));await ctx.close();}

  /* ── 5 · Safari mette la pagina da parte a metà scheda: le risposte contano una volta ── */
  {const {ctx,p,errs}=await apri();
  const r=await p.evaluate(async()=>{
    const P=ms=>new Promise(r=>setTimeout(r,ms));
    openQuiz();await P(300);buildQuiz();
    const items=QUIZ_ALL.filter(x=>x).slice(700,704);
    const s0=Object.values(qtStats.cat).reduce((a,c)=>a+(c.seen||0),0);
    startQuiz(items,{mode:'study',title:'Da parte'});await P(600);
    for(let k=0;k<3;k++){const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();await P(1300);}
    window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));await P(200);
    const daParte=Object.values(qtStats.cat).reduce((a,c)=>a+(c.seen||0),0);
    const pend=!!localStorage.getItem('qLedPend');
    window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));
    const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();await P(1300);
    qFinish(true);await P(800);
    const fine=Object.values(qtStats.cat).reduce((a,c)=>a+(c.seen||0),0);
    /* chiusa davvero (non da parte): si registrano subito, come prima */
    startQuiz(QUIZ_ALL.filter(x=>x).slice(710,712),{mode:'study',title:'Chiusa'});await P(600);
    {const it2=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it2.correct].click();await P(1300);}
    window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false}));await P(200);
    const chiusa=Object.values(qtStats.cat).reduce((a,c)=>a+(c.seen||0),0);
    return {s0,daParte,pend,fine,chiusa};});
  console.log(' pagina messa da parte       ',J(r));
  ok(r.daParte===r.s0&&r.pend&&r.fine===r.s0+4&&r.chiusa===r.fine+1,'pagina messa da parte: '+J(r));
  ok(!errs.length,'errori (da parte): '+errs.join(' | '));await ctx.close();}

  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await B.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
