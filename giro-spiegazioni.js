/* LA SPIEGAZIONE DOPO L'ERRORE (v155), a tempo reale:
   · tutte le domande del quiz hanno la loro spiegazione (anche con le risposte mescolate, e se cambia una sbagliata)
   · allenamento: risposta giusta → nessun tasto; sbagliata → «📖 Spiegazione» sotto le risposte, prima del perché
     dell'errore, con la lettera della giusta; la pagina scorre quel tanto che serve, senza nascondere la giusta
   · il foglio: giusta, la tua, il perché (lo stesso testo dei dati), la fonte; «Ho capito» lo chiude e il perché
     dell'errore è ancora lì; tornando alla domanda il tasto c'è ancora
   · tastiera: S apre, Invio chiude, poi 1 sceglie ancora «Non la sapevo» (il tasto nuovo non ruba i numeri)
   · simulazione d'esame: niente tasto durante la prova; nel Risultato un tasto per ogni sbagliata e saltata
     («Non hai risposto»)
   · senza rete la prima volta: lo dice, e appena torna la rete la spiegazione arriva
   uso: node test/giro-spiegazioni.js */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
(async()=>{
  const b=await launch();
  /* ════ 1 · tutte le domande hanno la spiegazione ════ */
  let {page:p,errors,ctx}=await boot(b,{clock:false,bootMs:4000,extra:{antiFretta:'false'}});
  const cop=await p.evaluate(()=>new Promise(res=>{
    buildQuiz();
    const s=document.createElement('script');s.src='spiegazioni-data.js?v=1';
    s.onload=()=>{
      const man=QUIZ_ALL.filter(it=>{const e=nccSpiegazione(it);return !(e&&e.t&&e.t.length>20);}).map(it=>it.id);
      const it=QUIZ_ALL[10],c=it.choices.slice(),w=(it.correct+1)%c.length;c[w]+=' (cambiata)';
      const riserva=!!nccSpiegazione({q:it.q,choices:c,correct:it.correct});
      const it2=QUIZ_ALL[20],o=it2.choices.map((_,i)=>i).reverse();
      const mesc=nccSpiegazione({q:it2.q,choices:o.map(i=>it2.choices[i]),correct:o.indexOf(it2.correct)});
      res({n:QUIZ_ALL.length,man,riserva,mesc:!!mesc&&mesc.t===nccSpiegazione(it2).t});
    };
    s.onerror=()=>res({n:0,man:['file non caricato']});
    document.head.appendChild(s);
  }));
  console.log(' spiegazioni          ',cop.n,'domande · senza spiegazione:',cop.man.length,'· riserva',cop.riserva,'· risposte mescolate',cop.mesc);
  ok(cop.n>1100&&!cop.man.length,'domande senza spiegazione: '+J(cop.man.slice(0,10)));
  ok(cop.riserva,'cambiando una risposta sbagliata la spiegazione si perde');
  ok(cop.mesc,'mescolando le risposte la spiegazione cambia');
  ok(!errors.length,'errori (1): '+errors.join(' | '));
  await ctx.close();

  /* ════ 2 · allenamento: dopo l'errore ════ */
  ({page:p,errors,ctx}=await boot(b,{clock:false,bootMs:4000,extra:{antiFretta:'false'}}));
  const ID=[4,86,0,21,510];
  await p.evaluate(ID=>{openQuiz();setTimeout(()=>{buildQuiz();startQuiz(ID.map(i=>QUIZ_ALL.find(x=>x.id===i)),{mode:'study',title:'Prova'});},300);},ID);
  await p.waitForTimeout(1500);
  ok(!(await p.evaluate(()=>!!document.getElementById('spBtn'))),'il tasto c’è prima di rispondere');
  /* giusta: niente tasto */
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});
  await p.waitForTimeout(300);
  ok(!(await p.evaluate(()=>!!document.getElementById('spBtn'))),'rispondendo giusto compare il tasto');
  await p.waitForTimeout(1200);
  /* sbagliata */
  const i0=await p.evaluate(()=>Q.idx);
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[(it.correct+1)%it.choices.length].click();});
  await p.waitForTimeout(900);
  const dopo=await p.evaluate(()=>{const h=document.getElementById('qRunAns'),b=document.getElementById('spBtn'),it=Q.items[Q.idx];
    const sc=document.getElementById('qRun'),g=h.querySelector('.qans.good'),t=document.querySelector('#qRun .qrun-top');
    const R=sc.getBoundingClientRect(),rb=b&&b.getBoundingClientRect(),rg=g.getBoundingClientRect(),rt=t.getBoundingClientRect();
    return {c:[...h.children].map(x=>x.id||x.className.split(' ')[0]),tx:b?b.textContent:'',let:String.fromCharCode(65+it.correct),
      vede:!!rb&&rb.bottom<=R.bottom+1,giusta:rg.top>=rt.bottom-1,scroll:sc.scrollTop};});
  console.log(' dopo l\'errore        ',J(dopo.c),'·',J(dopo.tx),'· scorre',dopo.scroll);
  ok(J(dopo.c.slice(-2))===J(['spBtn','why-bar']),'il tasto non è fra le risposte e il perché: '+J(dopo.c));
  ok(dopo.tx.indexOf('la '+dopo.let)>0,'il tasto non dice la lettera giusta ('+dopo.let+'): '+dopo.tx);
  ok(dopo.vede,'dopo l’errore il tasto resta sotto lo schermo');
  ok(dopo.giusta,'scorrendo la risposta giusta finisce sotto la barra');
  /* il foglio */
  await p.click('#spBtn');await p.waitForTimeout(800);
  const f=await p.evaluate(()=>{const v=document.getElementById('popOv'),it=Q.items[Q.idx],e=nccSpiegazione(it);
    const t=v&&v.querySelector('.sp-t');
    return {ov:!!v&&v.classList.contains('sp-ov'),ok:v?v.querySelector('.sp-r.ok span').textContent:'',ko:v?v.querySelector('.sp-r.ko span').textContent:'',
      giusta:it.choices[it.correct],tua:it.choices[Q.ans[Q.idx]],testo:t?t.textContent:'',dati:e?e.t.replace(/[*]/g,''):'',
      fonte:(v&&v.querySelector('.sp-f'))?v.querySelector('.sp-f').textContent:'',scheda:!!(v&&v.querySelector('.sp-sch'))};});
  console.log(' il foglio            ',J({giusta:f.ok.slice(0,30),tua:f.ko.slice(0,30),fonte:f.fonte,scheda:f.scheda}));
  ok(f.ov,'il foglio della spiegazione non si apre');
  ok(f.ok.indexOf(f.giusta)>=0&&f.ko.indexOf(f.tua)>=0,'giusta o tua sbagliate nel foglio: '+J(f));
  ok(f.testo&&f.testo===f.dati,'il testo del foglio non è quello dei dati');
  ok(/art/.test(f.fonte)&&f.scheda,'manca la fonte o la scheda delle Norme (domanda 4)');
  /* la scheda si apre lì dentro */
  await p.evaluate(()=>{document.querySelector('#popOv .sp-sch summary').click();});await p.waitForTimeout(300);
  ok(await p.evaluate(()=>document.querySelector('#popOv .sp-sch').open&&document.querySelectorAll('#popOv .sp-sch li').length>=3),'la scheda delle Norme non si apre');
  await p.evaluate(()=>document.querySelector('#popOv .pop-b.pieno').click());await p.waitForTimeout(500);
  ok(await p.evaluate(i0=>!document.getElementById('popOv')&&Q.idx===i0&&!!document.querySelector('#qRunAns .why-bar'),i0),'chiuso il foglio, il perché dell’errore non c’è più o la domanda è cambiata');
  /* tastiera: S apre, Invio chiude, 1 sceglie ancora il perché */
  await p.keyboard.press('s');await p.waitForTimeout(600);
  ok(await p.evaluate(()=>!!document.querySelector('#popOv.sp-ov')),'S non apre la spiegazione');
  await p.keyboard.press('Enter');await p.waitForTimeout(500);
  ok(await p.evaluate(()=>!document.getElementById('popOv')),'Invio non chiude la spiegazione');
  const pe0=await p.evaluate(()=>JSON.stringify((qtStats.why||{})[Q.items[Q.idx].id]||{}));
  await p.keyboard.press('1');await p.waitForTimeout(700);
  const pe1=await p.evaluate(id=>JSON.stringify((qtStats.why||{})[id]||{}),await p.evaluate(i0=>Q.items[i0].id,i0));
  ok(pe0!==pe1&&/"k":/.test(pe1),'dopo la spiegazione 1 non sceglie «Non la sapevo»: '+pe0+' → '+pe1);
  ok(await p.evaluate(i0=>Q.idx===i0+1&&!document.getElementById('spBtn'),i0),'scelto il perché non si va avanti, o il tasto resta');
  /* tornando alla domanda sbagliata il tasto c'è ancora (senza il perché) */
  await p.evaluate(()=>qGo(-1));await p.waitForTimeout(400);
  const torna=await p.evaluate(()=>[...document.getElementById('qRunAns').children].map(x=>x.id||x.className.split(' ')[0]));
  ok(torna.indexOf('spBtn')>=0&&torna.indexOf('why-bar')<0,'tornando alla sbagliata il tasto non c’è: '+J(torna));
  await p.evaluate(()=>qGo(-1));await p.waitForTimeout(400);
  ok(!(await p.evaluate(()=>!!document.getElementById('spBtn'))),'sulla domanda giusta c’è il tasto');
  ok(!errors.length,'errori (2): '+errors.join(' | '));
  await ctx.close();

  /* ════ 3 · simulazione d'esame: niente tasto durante la prova, i tasti nel Risultato ════ */
  ({page:p,errors,ctx}=await boot(b,{clock:false,bootMs:4000,extra:{antiFretta:'false'}}));
  await p.evaluate(ID=>{openQuiz();setTimeout(()=>{buildQuiz();startQuiz(ID.map(i=>QUIZ_ALL.find(x=>x.id===i)),{mode:'exam',title:'Esame',limit:600,maxErr:4,maxPerCat:2});},300);},ID);
  await p.waitForTimeout(1500);
  for(let k=0;k<4;k++){   /* sbaglio la 1 e la 3, giuste la 2 e la 4, la 5 la salto */
    await p.evaluate(k=>{const it=Q.items[Q.idx];const b=document.querySelectorAll('#qRunAns .qans');b[(k===0||k===2)?(it.correct+1)%b.length:it.correct].click();},k);
    await p.waitForTimeout(500);
    ok(!(await p.evaluate(()=>!!document.getElementById('spBtn'))),'in esame compare il tasto della spiegazione');
  }
  await p.evaluate(()=>{qFinish();});await p.waitForTimeout(700);
  await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b.pieno');if(b)b.click();});await p.waitForTimeout(1500);
  await p.evaluate(()=>{const b=[...document.querySelectorAll('#popOv .pop-b')].find(x=>/dettaglio/i.test(x.textContent));if(b)b.click();});await p.waitForTimeout(600);
  const ris=await p.evaluate(()=>[...document.querySelectorAll('#qAnalysis .qac')].map(c=>(c.classList.contains('wrong')?'S':c.classList.contains('skip')?'-':'G')+(c.querySelector('.sp-qac')?'📖':'')));
  console.log(' risultato            ',J(ris));
  ok(J(ris)===J(['S📖','G','S📖','G','-📖']),'tasti nel Risultato sbagliati: '+J(ris));
  await p.evaluate(()=>{const c=document.querySelectorAll('#qAnalysis .sp-qac');c[c.length-1].click();});await p.waitForTimeout(800);
  const sk=await p.evaluate(()=>{const v=document.getElementById('popOv');return v?{no:!!v.querySelector('.sp-r.no'),t:(v.querySelector('.sp-t')||{}).textContent||''}:null;});
  ok(sk&&sk.no&&sk.t.length>20,'la saltata: il foglio non dice «Non hai risposto» o manca il perché: '+J(sk));
  await p.evaluate(()=>document.querySelector('#popOv .pop-b.pieno').click());await p.waitForTimeout(400);
  ok(!errors.length,'errori (3): '+errors.join(' | '));
  await ctx.close();

  /* ════ 4 · senza rete la prima volta ════ */
  ({page:p,errors,ctx}=await boot(b,{clock:false,bootMs:4000,extra:{antiFretta:'false'}}));
  const blocca=r=>r.abort();
  await ctx.route('**/spiegazioni-data.js*',blocca);
  await p.evaluate(ID=>{openQuiz();setTimeout(()=>{buildQuiz();startQuiz(ID.map(i=>QUIZ_ALL.find(x=>x.id===i)),{mode:'study',title:'Prova'});},300);},ID);
  await p.waitForTimeout(2500);
  await p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[(it.correct+1)%it.choices.length].click();});
  await p.waitForTimeout(700);await p.click('#spBtn');await p.waitForTimeout(1200);
  const off=await p.evaluate(()=>{const v=document.getElementById('popOv');return v?v.querySelector('.sp-corpo').textContent:'';});
  console.log(' senza rete           ',J(off.slice(0,60)));
  ok(/rete/.test(off),'senza rete il foglio non lo dice: '+off);
  await p.evaluate(()=>document.querySelector('#popOv .pop-b.pieno').click());await p.waitForTimeout(500);
  await ctx.unroute('**/spiegazioni-data.js*',blocca);
  await p.click('#spBtn');await p.waitForTimeout(1500);
  const on=await p.evaluate(()=>{const v=document.getElementById('popOv');return v?((v.querySelector('.sp-t')||{}).textContent||''):'';});
  ok(on.length>20&&!/rete/.test(on),'tornata la rete la spiegazione non arriva: '+on);
  ok(!errors.length,'errori (4): '+errors.join(' | '));
  await ctx.close();

  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
