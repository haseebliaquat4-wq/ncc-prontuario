/* «ASCOLTAMI E CORREGGIMI» (v160, in prova), con un riconoscimento della voce finto che il giro fa «parlare»:
   · il tasto c'e' sotto Controlla solo per i percorsi e le piazze (non per il regolamento, non senza riconoscimento)
   · toccato: il pannello «Ti ascolto», il microfono in italiano, continuo, con le parole provvisorie; il 🔊 sparisce
   · quello che sente compare mentre parli (le parole provvisorie in grigio); se si ferma da solo riparte e non perde niente;
     i pezzi che ripetono quello detto prima (certi iPhone) non lo raddoppiano
   · «Ho finito» (o Invio): la risposta con ogni via segnata ✓ ↕ ✗, il riassunto, «Ho sentito», il voto che consiglia
     (uguale al conto fatto a parte) e il tasto del voto evidenziato; il voto lo dai tu
   · «Annulla» torna alla domanda; il microfono negato: la finestra che spiega (dall'icona sulla schermata Home: «apri in Safari»)
     e di nuovo la domanda; niente sentito: l'avviso; se dopo una pausa non riesce a ripartire resta quello sentito fin li'
   · uscendo (‹) o con l'app in secondo piano mentre ascolta: il microfono si spegne e niente resta a meta'
   uso: node test/giro-orale-ascolto.js [iphone|se|ipado] [chiaro|scuro] */
const {launch,seed,BASE}=require('./lib');const fs=require('fs'),path=require('path'),os=require('os');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const SCH=process.argv[2]||'iphone',TEMA=process.argv[3]||'chiaro';
const VP={se:{width:320,height:568,touch:true,mobile:true},iphone:{width:390,height:844,touch:true,mobile:true},
  ipado:{width:1180,height:820,touch:true,mobile:false}}[SCH];
const OUT=path.join(process.env.OR_OUT||os.tmpdir(),'orale-ascolto-'+SCH+'-'+TEMA);fs.mkdirSync(OUT,{recursive:true});
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
/* il microfono finto: __dici(parti, finale) manda i risultati della sessione, __daSolo() la chiude come fa iPhone dopo una pausa,
   __errore(e) un errore e la fine */
const REC=`(function(){
var R=window.__rec={ultimo:null,avvii:0,fermati:0,abortiti:0,opz:null};
function F(){R.ultimo=this;this.attivo=false;}
F.prototype.start=function(){R.avvii++;R.opz={lang:this.lang,continuous:this.continuous,interim:this.interimResults};this.attivo=true;};
F.prototype.stop=function(){var me=this;R.fermati++;me.attivo=false;setTimeout(function(){me.onend&&me.onend({});},60);};
F.prototype.abort=function(){R.abortiti++;this.attivo=false;};
window.SpeechRecognition=F;window.webkitSpeechRecognition=F;
window.__dici=function(parti,finale){var r=R.ultimo;if(!r||!r.attivo)return false;
  var res=parti.map(function(t,i){var x=[{transcript:t,confidence:.9}];x.isFinal=i<parti.length-1||!!finale;return x;});
  r.onresult&&r.onresult({resultIndex:0,results:res});return true;};
window.__daSolo=function(){var r=R.ultimo;if(!r)return;r.attivo=false;r.onend&&r.onend({});};
window.__errore=function(e){var r=R.ultimo;if(!r)return;r.onerror&&r.onerror({error:e});r.attivo=false;r.onend&&r.onend({});};
})();`;
const AIUTI=`(function(){
window.__vedo=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),e=document.elementFromPoint(X,Y),c=e;
  while(c&&c!==document.body&&c!==document.documentElement){var cs=getComputedStyle(c);
    if(c.id==='popOv')return 'popup';
    if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');
    if(c.id==='homeScreen')return 'home';
    if(c.id&&(cs.position==='fixed'||cs.position==='absolute'&&c.parentElement===document.body))return c.id;
    c=c.parentElement;}
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
  const s=seed();const ora=Date.now();
  const dati={routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(ora),
    azzerato2026:String(ora),dark:TEMA==='scuro'?'true':'false',nccOraleVoce:'0'};
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon/.test(t))errs.push('console: '+t);}});
  p.on('dialog',d=>{errs.push('dialog nativo: '+d.message().slice(0,60));d.dismiss().catch(()=>{});});
  await p.goto(BASE+'index.html',{waitUntil:'load'});await p.waitForTimeout(6000);
  await p.addScriptTag({content:REC});await p.addScriptTag({content:AIUTI});
  const film=async(fn,ms)=>{await p.evaluate(()=>{__film=[];__filmOn=true;});await fn();await p.waitForTimeout(ms||1100);return p.evaluate(()=>{__filmOn=false;return __film.slice();});};
  const pulito=(nome,f,arrivo)=>{const s=f.join(' → ');
    ok(!f.some(x=>/^vuoto|^home$/.test(x)),nome+': schermo vuoto o Home di passaggio '+s);
    ok(f[f.length-1]===arrivo,nome+': arriva su «'+f[f.length-1]+'» invece di «'+arrivo+'» ('+s+')');
    console.log(' '+(nome+'                              ').slice(0,30)+s);};
  const foto=async n=>{try{await p.screenshot({path:path.join(OUT,n+'.png')});}catch(e){}};
  const tocca=sel=>p.click(sel,{timeout:4000}).catch(e=>ok(false,'tocco '+sel+': '+e.message.split('\n')[0]));
  const rec=()=>p.evaluate(()=>({avvii:__rec.avvii,fermati:__rec.fermati,abortiti:__rec.abortiti,opz:__rec.opz,attivo:!!(__rec.ultimo&&__rec.ultimo.attivo)}));
  const vista=()=>p.evaluate(()=>{const q=s=>document.querySelector('#scnBody '+s);const t=s=>{const e=q(s);return e?e.textContent.replace(/\s+/g,' ').trim():'';};
    return {asc:!!q('.ora-asc'),ascT:t('.ora-asc-t'),x:t('.ora-asc-x'),grigio:t('.ora-asc-x span'),mic:!!q('.ora-mic'),cont:!!q('.ora-go:not(.ora-fine)'),fine:!!q('.ora-fine'),
      cassa:!!document.getElementById('oraVoce'),risp:!!q('.ora-risp'),sum:t('.ora-vsum'),segni:[...document.querySelectorAll('#scnBody .ora-vie.voce li')].map(l=>l.className),
      sug:t('.ora-sug'),vsug:[...document.querySelectorAll('#scnBody .ora-v.sug')].map(b=>b.className.replace(/ora-v|sug/g,'').trim()),sentito:t('.ora-sentito p')};});
  await p.evaluate(()=>{window.__toast=[];const _t=toast2;toast2=function(m){window.__toast.push(String(m));return _t.apply(this,arguments);};});
  const toast=()=>p.evaluate(()=>window.__toast.splice(0).join(' | '));
  const st=()=>p.evaluate(()=>nccOraleStato());

  /* le prove: due percorsi con le vie (tuo o del libro), una piazza dell'app, una regola */
  const scelta=await p.evaluate(()=>{const m=nccChiestoMotore,C=m.conti();
    const conVie=C.perc.filter(o=>{const s=m.stato(o);return s.mio||s.lib;}).map(o=>o.k);
    const pz=C.pz.filter(o=>m.piazzaDi(o.k)).map(o=>o.k);
    return {perc:conVie.slice(0,2),pz:pz[0],reg:C.reg.filter(o=>o.dom&&o.dom.length)[0].k};});
  ok(scelta.perc.length===2&&scelta.pz,'mancano le prove adatte: '+J(scelta));
  await p.evaluate(sc=>{nccOrale();nccOraleProva([sc.perc[0],sc.perc[1],sc.pz,sc.reg]);},scelta);await p.waitForTimeout(900);
  /* ── 1 · il tasto e il pannello ── */
  let v=await vista();ok(v.mic&&v.cont&&!v.asc,'il tasto «Ascoltami e correggimi»: '+J(v));
  await foto('1-prova');
  const A1=await p.evaluate(()=>nccOraleAttese(0));
  ok(A1&&A1.ord&&A1.l.length>=3,'le vie attese del primo percorso: '+J(A1));
  let f=await film(()=>tocca('#scnBody .ora-mic'),400);pulito('🎙 → ti ascolto',f,'pagina:simorale');
  v=await vista();let r=await rec();
  ok(v.asc&&/Ti ascolto: dimmi il percorso/.test(v.ascT)&&v.fine&&!v.mic&&!v.cassa&&/Parla pure/.test(v.x),'il pannello dell’ascolto: '+J(v));
  ok(r.avvii===1&&r.opz&&r.opz.lang==='it-IT'&&r.opz.continuous===true&&r.opz.interim===true&&r.attivo,'il microfono: '+J(r));
  /* parla: prima le provvisorie, poi le definitive; poi si ferma da solo (pausa) e riparte */
  const L1=A1.l,meta=Math.ceil(L1.length/2);
  const detto1=L1.slice(0,meta).join(', '),detto2=L1.slice(meta).join(', ');
  await p.evaluate(t=>__dici([t],false),'da '+detto1);await p.waitForTimeout(200);
  v=await vista();ok(v.grigio&&v.x.indexOf(L1[0])>=0,'le parole provvisorie non si vedono: '+J(v.x));
  await p.evaluate(t=>__dici([t],true),'da '+detto1);await p.waitForTimeout(150);
  await foto('2-ascolto');
  await p.evaluate(()=>__daSolo());await p.waitForTimeout(250);
  r=await rec();v=await vista();
  ok(r.avvii===2&&r.attivo&&v.asc&&v.x.indexOf(L1[0])>=0,'fermato da solo non riparte o perde il testo: '+J(r)+' '+J(v.x));
  await p.evaluate(t=>__dici([t],true),'poi '+detto2);await p.waitForTimeout(150);
  v=await vista();ok(v.x.indexOf(L1[0])>=0&&v.x.indexOf(L1[L1.length-1])>=0,'il testo delle due parti: '+J(v.x));
  /* Ho finito: la risposta coi segni */
  f=await film(()=>tocca('#scnBody .ora-fine'),700);pulito('Ho finito → risposta',f,'pagina:simorale');
  v=await vista();r=await rec();
  ok(v.risp&&!v.asc&&r.fermati===1&&!r.attivo,'Ho finito: '+J({risp:v.risp,asc:v.asc,r}));
  ok(v.segni.length===L1.length&&v.segni.every(x=>x==='ok'),'tutte le vie dette in ordine: '+J(v.segni));
  ok(v.sum==='🎙 Hai detto tutte le '+L1.length+' vie, in ordine','il riassunto: '+J(v.sum));
  ok(v.sug==='Secondo me: ✓ Giusto'&&J(v.vsug)===J(['si']),'il voto consigliato: '+J([v.sug,v.vsug]));
  ok(v.sentito.indexOf(L1[0])>=0&&v.sentito.indexOf(L1[L1.length-1])>=0,'«Ho sentito»: '+J(v.sentito));
  let o=await st();ok(o&&o.mostra&&!o.fine&&o.i===0,'lo stato dopo Ho finito: '+J(o));
  await foto('3-tutte');
  await p.evaluate(()=>{const e=document.querySelector('#scnBody .ora-fondo');if(e)e.scrollIntoView({block:'end'});});await foto('3b-voti');
  await p.waitForTimeout(300);await tocca('#scnBody .ora-v.si');await p.waitForTimeout(800);

  /* ── 2 · il secondo percorso: due vie scambiate, una saltata; Invio finisce ── */
  const A2=await p.evaluate(()=>nccOraleAttese(1));const L2=A2.l.slice();
  const detto=L2.slice();if(detto.length>=4){const t=detto[1];detto[1]=detto[2];detto[2]=t;detto.splice(detto.length-2,1);}
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(400);
  await p.evaluate(t=>__dici([t],true),detto.join(' poi '));await p.waitForTimeout(150);
  await p.keyboard.press('Enter');await p.waitForTimeout(700);
  v=await vista();const atteso=await p.evaluate(([l,t])=>nccOraleConfronta(l,t),[L2,detto.join(' poi ')]);
  console.log(' secondo percorso         ',J(v.segni),'|',v.sum,'|',v.sug);
  ok(atteso&&J(v.segni)===J(atteso.m)&&v.vsug[0]===atteso.sug,'i segni non sono quelli del conto: '+J(v.segni)+' vs '+J(atteso&&atteso.m));
  ok(v.segni.includes('no')&&(v.segni.includes('fp')||L2.length<4),'la via saltata o quelle fuori posto non si vedono: '+J(v.segni));
  ok(/^🎙 Hai detto \d+ vie su \d+/.test(v.sum),'il riassunto: '+J(v.sum));
  await foto('4-sbagli');
  await p.waitForTimeout(300);await tocca('#scnBody .ora-v.quasi');await p.waitForTimeout(800);

  /* ── 3 · la piazza: Annulla, il microfono negato, niente sentito, poi le vie in disordine ── */
  const A3=await p.evaluate(()=>nccOraleAttese(2));
  ok(A3&&A3.ord===false&&A3.l.length>=2,'le vie della piazza: '+J(A3));
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(600);
  v=await vista();ok(/dimmi le vie/.test(v.ascT),'il pannello della piazza: '+J(v.ascT));
  let ab=(await rec()).abortiti;
  await tocca('#scnBody .ora-fasc .ora-go2');await p.waitForTimeout(500);
  v=await vista();r=await rec();o=await st();
  ok(!v.asc&&v.mic&&v.cont&&!o.mostra&&r.abortiti===ab+1,'Annulla: '+J({v,r,mostra:o.mostra}));
  await p.waitForTimeout(300);
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(300);
  await p.evaluate(()=>__errore('not-allowed'));await p.waitForTimeout(500);
  v=await vista();let pop=await p.evaluate(()=>{const o=document.getElementById('popOv');return o?o.textContent.replace(/\s+/g,' '):'';});o=await st();
  ok(!v.asc&&v.mic&&!o.mostra&&/La voce non parte/.test(pop)&&/microfono non è permesso/.test(pop)&&!/schermata Home/.test(pop),'il microfono negato: '+J({asc:v.asc,pop,mostra:o.mostra}));
  await foto('4b-negato');
  await p.evaluate(()=>document.querySelector('#popOv .pop-b.pieno').click());await p.waitForTimeout(500);
  /* dall'icona sulla schermata Home: lo dice */
  await p.evaluate(()=>{Object.defineProperty(navigator,'standalone',{configurable:true,get:function(){return true;}});});
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(300);
  await p.evaluate(()=>__errore('service-not-allowed'));await p.waitForTimeout(500);
  pop=await p.evaluate(()=>{const o=document.getElementById('popOv');return o?o.textContent.replace(/\s+/g,' '):'';});
  ok(/Dettatura/.test(pop)&&/schermata Home/.test(pop)&&/Safari/.test(pop),'dall’icona: '+J(pop));
  await p.evaluate(()=>document.querySelector('#popOv .pop-b.pieno').click());await p.waitForTimeout(500);
  await p.evaluate(()=>{delete navigator.standalone;});
  let t='';
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(600);
  await tocca('#scnBody .ora-fine');await p.waitForTimeout(700);
  v=await vista();t=await toast();o=await st();
  ok(!v.asc&&!o.mostra&&/Non ho sentito niente/.test(t),'niente sentito: '+J({asc:v.asc,t,mostra:o.mostra}));
  await p.waitForTimeout(500);
  const vieP=A3.l.slice().reverse();
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(450);
  /* come certi iPhone: ogni pezzo ripete anche quello detto prima (l'ultimo ancora provvisorio) */
  const pezzi=vieP.map((x,i)=>vieP.slice(0,i+1).join(', '));
  await p.evaluate(l=>__dici(l,false),pezzi);await p.waitForTimeout(150);
  await tocca('#scnBody .ora-fine');await p.waitForTimeout(700);
  v=await vista();
  const volte=v.sentito.split(vieP[0]).length-1;
  ok(volte===1,'i pezzi ripetuti si sommano: «'+vieP[0]+'» '+volte+' volte in '+J(v.sentito));
  ok(v.segni.length===A3.l.length&&v.segni.every(x=>x==='ok')&&v.sum==='🎙 Hai detto tutte le '+A3.l.length+' vie'&&v.vsug[0]==='si','la piazza in disordine (le provvisorie contano): '+J(v));
  await foto('5-piazza');
  await p.waitForTimeout(300);await tocca('#scnBody .ora-v.si');await p.waitForTimeout(800);
  /* ── 4 · la regola: niente microfono ── */
  v=await vista();ok(!v.mic&&v.cont,'il regolamento ha il microfono: '+J(v));

  /* ── 5 · uscire mentre ascolta ── */
  await p.evaluate(sc=>{nccOraleIndietro();nccOrale();nccOraleProva([sc.perc[0],sc.perc[1],sc.pz,sc.reg]);},scelta);await p.waitForTimeout(900);
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(600);
  ab=(await rec()).abortiti;
  f=await film(()=>tocca('#scnOv .t-back'),900);pulito('‹ mentre ascolta → Quiz',f,'pagina:quiz');
  r=await rec();ok(r.abortiti===ab+1&&!r.attivo,'‹ non spegne il microfono: '+J(r));
  await p.evaluate(()=>nccOrale());await p.waitForTimeout(700);
  await tocca('#scnBody .ora-rip');await p.waitForTimeout(600);
  v=await vista();ok(!v.asc&&v.mic&&v.cont,'ripresa: '+J(v));
  /* in secondo piano */
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(300);ab=(await rec()).abortiti;
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:function(){return true;}});document.dispatchEvent(new Event('visibilitychange'));});
  await p.waitForTimeout(300);
  r=await rec();v=await vista();ok(r.abortiti===ab+1&&!v.asc&&v.mic,'in secondo piano: '+J({r,asc:v.asc}));
  await p.evaluate(()=>{delete document.hidden;});
  /* ── 5b · si ferma dopo una pausa e non riesce a ripartire (iPhone puo' volere un tocco) ── */
  await p.waitForTimeout(500);
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(300);
  await p.evaluate(()=>__daSolo());await p.waitForTimeout(200);       /* niente detto: riparte */
  await p.evaluate(()=>__errore('not-allowed'));await p.waitForTimeout(500);   /* e la ripartenza non va */
  v=await vista();let t2=await toast();let pop2=await p.evaluate(()=>!!document.getElementById('popOv'));o=await st();
  ok(!v.asc&&v.mic&&!o.mostra&&!pop2&&/Non ho sentito niente/.test(t2),'ripartenza negata senza niente detto: '+J({asc:v.asc,t2,pop2,mostra:o.mostra}));
  const A5=await p.evaluate(()=>nccOraleAttese());
  await p.waitForTimeout(500);
  await tocca('#scnBody .ora-mic');await p.waitForTimeout(300);
  await p.evaluate(t=>__dici([t],true),A5.l.slice(0,2).join(' '));await p.waitForTimeout(150);
  await p.evaluate(()=>__daSolo());await p.waitForTimeout(200);
  await p.evaluate(()=>__errore('not-allowed'));await p.waitForTimeout(700);
  v=await vista();pop2=await p.evaluate(()=>!!document.getElementById('popOv'));
  ok(v.risp&&!pop2&&v.segni.length===A5.l.length&&v.segni[0]==='ok'&&v.segni[1]==='ok','ripartenza negata dopo aver parlato: resta quello sentito '+J({risp:v.risp,pop2,segni:v.segni}));
  /* ── 6 · senza riconoscimento della voce: niente tasto ── */
  await p.evaluate(()=>{delete window.SpeechRecognition;delete window.webkitSpeechRecognition;window.SpeechRecognition=undefined;window.webkitSpeechRecognition=undefined;});
  await p.waitForTimeout(500);await p.evaluate(()=>nccOraleVoto('si'));await p.waitForTimeout(700);
  v=await vista();ok(!v.mic&&v.cont,'senza riconoscimento il tasto resta: '+J(v));

  ok(!errs.length,'errori: '+errs.join(' | '));
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
