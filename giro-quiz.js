/* GIRO DEL QUIZ, fotogramma per fotogramma, a tempo reale (niente orologio finto).
   Tocca ogni tasto della schermata del quiz come un utente e, durante ogni passaggio,
   guarda cosa c'e' a schermo ogni ~30 ms: mai schermi vuoti o vecchi, mai domande tagliate. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
(async()=>{
  const b=await launch();const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true,isMobile:true});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();await ctx.addInitScript(s=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(s.routes));localStorage.setItem('coords',JSON.stringify(s.coords));localStorage.setItem('ob1','true');localStorage.setItem('antiFretta','false');}},s);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(6000);
  await p.addScriptTag({content:`window.__f=function(){var v=document.getElementById('qRun'),q=document.getElementById('qRunQ'),t=document.querySelector('#qRun .qrun-top');
    var e=document.elementFromPoint(195,500),c=e,dove='?';while(c&&c!==document.body){if(c.id==='scnOv'){dove='pagina';break;}if(c.id==='popOv'){dove='popup';break;}
      if(c.id==='quizApp'){dove='quiz:'+qCurView;break;}if(c.id==='homeScreen'){dove='home';break;}c=c.parentElement;}
    var r={dove:dove,pos:(document.getElementById('qPos')||{}).textContent,testo:q?q.textContent.length:0,scroll:v?v.scrollTop:-1};
    if(q&&t&&v&&v.style.display!=='none'){var qr=q.getBoundingClientRect(),tr=t.getBoundingClientRect();r.tagliata=v.scrollTop===0&&qr.top<tr.bottom-2;}
    return r;};`});
  const film=async(nome,dur,controllo)=>{const t0=Date.now(),seq=[];let ult='';while(Date.now()-t0<dur){const f=await p.evaluate(()=>__f());
      const k=f.dove+(f.pos?' '+f.pos:'');if(k!==ult){seq.push(k);ult=k;}if(controllo)controllo(f,nome);await new Promise(r=>setTimeout(r,30));}
    console.log(nome.padEnd(20),seq.join(' → '));return seq;};
  const vuoto=(f,n)=>{if(f.dove.startsWith('quiz:run')&&!f.testo)fails.push(n+': domanda vuota in un fotogramma');if(f.tagliata)fails.push(n+': domanda tagliata sotto la barra');};
  const clic=async sel=>{const r=await p.evaluate(sel=>{const e=typeof sel==='string'?document.querySelector(sel):null;if(!e)return false;e.click();return true;},sel);if(!r)fails.push('tasto non trovato: '+sel);};
  // 1 entro in Domande nuove dalla pagina Quiz
  await p.evaluate(()=>nccSez('quiz'));await p.waitForTimeout(800);
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>/Domande nuove/.test(x.textContent)).click());
  let q=await film('entro',1300,vuoto);ok(q[q.length-1]==='quiz:run 1 di 30','non parte da 1 di 30: '+q.join(','));
  await p.screenshot({path:__dirname+'/giro-1-domanda.png'});
  // 2 rispondo: feedback e poi avanti da solo, dall'alto
  const i0=await p.evaluate(()=>Q.idx);
  const giusta=await p.evaluate(()=>{const it=Q.items[Q.idx];const b=document.querySelectorAll('#qRunAns .qans')[(it.correct+1)%3];b.click();return it.correct;});
  q=await film('rispondo sbagliato',1500,vuoto);
  ok(await p.evaluate(()=>document.querySelectorAll('#qRunAns .qans.good').length===1&&document.querySelectorAll('#qRunAns .qans.bad').length===1),'sbagliando non mostra giusta e sbagliata');
  ok(await p.evaluate(i0=>Q.idx===i0,i0),'sbagliando non deve andare avanti da solo');
  await p.evaluate(()=>{document.getElementById('qRun').scrollTop=300;});await clic('#qNext');q=await film('› dopo errore',700,vuoto);
  ok(await p.evaluate(i0=>Q.idx===i0+1,i0),'› non avanza dopo l\u2019errore');ok((await p.evaluate(()=>__f())).scroll===0,'la domanda nuova non parte dall\u2019alto');
  const i1=await p.evaluate(()=>Q.idx);
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});q=await film('rispondo giusto',2200,vuoto);
  ok(await p.evaluate(i1=>Q.idx===i1+1,i1),'rispondendo giusto non avanza da solo');
  await clic('#qPrev');q=await film('‹ indietro',600,vuoto);ok(await p.evaluate(i1=>Q.idx===i1,i1),'‹ non torna alla domanda di prima');
  ok(await p.evaluate(()=>document.querySelectorAll('#qRunAns .qans.good').length===1),'tornando indietro la risposta data non si vede');
  await clic('#qNext');q=await film('› avanti',600,vuoto);ok(await p.evaluate(i1=>Q.idx===i1+1,i1),'› non torna avanti');
  // 4 pallino 6: salto diretto
  await p.evaluate(()=>{const d=document.querySelectorAll('#qPills > *');d[5]&&d[5].click();});q=await film('pallino 6',600,vuoto);ok(q[q.length-1]==='quiz:run 6 di 30','il pallino non salta alla 6: '+q[q.length-1]);
  // 5 Ascolta, ☆, ⚐
  await clic('#qListen');await p.waitForTimeout(400);
  const bm0=await p.evaluate(()=>document.getElementById('qBm').textContent);await clic('#qBm');await p.waitForTimeout(300);
  const bm1=await p.evaluate(()=>document.getElementById('qBm').textContent);ok(bm0!==bm1,'☆ non cambia');await clic('#qBm');
  await clic('#qReport');await p.waitForTimeout(400);const rep=await p.evaluate(()=>!!(qtStats.report&&qtStats.report[Q.items[Q.idx].id]));ok(rep,'⚐ non segnala');
  await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});await p.waitForTimeout(400);
  // 6 40 domande a caso: nessuna tagliata, Ascolta sempre raggiungibile
  const lunghe=await p.evaluate(async()=>{buildQuiz();const L=QUIZ_ALL.slice().sort((a,b)=>b.q.length-a.q.length).slice(0,40);startQuiz(L,{mode:'study',title:'Lunghe'});
    const out=[];for(let i=0;i<L.length;i++){Q.idx=i;qRenderRun();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const v=document.getElementById('qRun'),qe=document.getElementById('qRunQ'),t=document.querySelector('#qRun .qrun-top'),a=document.getElementById('qRunAns');
      const qr=qe.getBoundingClientRect(),tr=t.getBoundingClientRect(),ar=a.getBoundingClientRect();
      if(v.scrollTop!==0||qr.top<tr.bottom-2||qr.bottom>ar.top+2)out.push(i+':'+qe.textContent.slice(0,40));}return out;});
  ok(!lunghe.length,'domande lunghe tagliate o sovrapposte: '+lunghe.join(' | '));console.log('40 domande piu\u2019 lunghe controllate, problemi:',lunghe.length);
  await p.screenshot({path:__dirname+'/giro-2-lunga.png'});
  // 7 Termina → conferma → risultato → ‹ → pagina Quiz
  await clic('.qrun-end');await p.waitForTimeout(500);await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');b&&b.click();});
  q=await film('termina',1200);ok(q.some(x=>x.startsWith('quiz:result')),'Termina non mostra il risultato: '+q.join(','));
  await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}qNavBack();});q=await film('‹ dal risultato',800);ok(q[q.length-1].startsWith('pagina'),'dal risultato non torna alla pagina: '+q.join(','));
  // 8 simulazione: cronometro e tre caselle, poi ✕
  await p.waitForTimeout(400);await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>/Simulazione/.test(x.textContent)).click());
  q=await film('simulazione',1300,vuoto);ok(/quiz:run 1 di 16/.test(q[q.length-1]),'la simulazione non parte: '+q.join(','));
  const c1=await p.evaluate(()=>document.getElementById('qClock').textContent);await p.waitForTimeout(2200);const c2=await p.evaluate(()=>document.getElementById('qClock').textContent);
  const celle=await p.evaluate(()=>[...document.querySelectorAll('.qrun-meta > *')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.className).join(','));
  ok(c1!==c2,'il cronometro non scorre '+c1+' '+c2);ok(celle==='cell,sep,cell,sep,cell','caselle simulazione: '+celle);
  await p.screenshot({path:__dirname+'/giro-3-simulazione.png'});
  await clic('.qrun-x');await p.waitForTimeout(500);await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');b&&b.click();});
  q=await film('✕ esci',900);ok(q[q.length-1].startsWith('pagina'),'✕ non torna alla pagina: '+q.join(','));
  errs.forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(f=>console.log(' - '+f));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
