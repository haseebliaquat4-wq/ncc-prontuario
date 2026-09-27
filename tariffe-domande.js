/* LE DOMANDE SULLE TARIFFE: quelle senza anno hanno gli importi della scheda Tariffe (luglio 2024),
   quelle che citano la delibera con l'anno restano com'erano. Poi le faccio davvero nel quiz. */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const ATTESE=[['quota fissa di partenza per i soggetti legittimati a svolgere il servizio taxi negli aeroporti:','Euro 4,10'],
  ['importo minimo per la partenza degli aeroporti','Euro 16,00'],['cifra cauzionale per una sosta eventuale','Euro 34,48'],
  ['tratta MI-Malpensa','114 euro'],['tratta Linate-Malpensa','128 euro'],['fiera di Rho/Pero-Linate','68 euro'],['fiera di Rho/Pero-Malpensa','94 euro'],
  ['progressioni della tariffa del tassametro','A euro 17,35'],['servizio taxi agli aereoporti','Euro 4,10 feriale, euro 6,60 festivo, euro 7,90 notturno'],
  ['supplemento notturno per le corse in partenza da Milano','Euro 7,90']];
const CON_ANNO=[['D.g.r. 17 dicembre 2015, n. X/4591','95'],['DGR n. 2030 del 01/07/14, qual è la tariffa predeterminata per il percorso Milano-Malpensa','Euro 90,00'],
  ['DGR n. 2030 del 01/07/14, qual è per uso convenzionale la tariffa minima','Euro 13,10']];
(async()=>{
  const b=await launch();
  const {page:p,errors}=await boot(b,{clock:false,touch:true,mobile:true,extra:{antiFretta:'false',wkRepTs:String(Date.now()),azzerato2026:String(Date.now())}});
  const r=await p.evaluate(([A,C])=>{buildQuiz();const giusta=t=>{const it=QUIZ_ALL.find(x=>x.q.indexOf(t)>=0);return it?{id:it.id,g:it.choices[it.correct],tutte:it.choices}:null;};
    return {tot:QUIZ_ALL.length,a:A.map(x=>[x[1],giusta(x[0])]),c:C.map(x=>[x[1],giusta(x[0])])};},[ATTESE,CON_ANNO]);
  console.log('domande in tutto',r.tot);ok(r.tot===1110,'le domande non sono piu’ 1110 ma '+r.tot);
  r.a.forEach(([att,it])=>{console.log('  aggiornata  '+(it?it.g:'NON TROVATA'));ok(it&&it.g.indexOf(att)===0,'tariffa non aggiornata: attesa '+att+' trovata '+(it&&it.g));
    ok(it&&new Set(it.tutte).size===it.tutte.length,'risposte doppie: '+(it&&it.tutte.join(' | ')));});
  r.c.forEach(([att,it])=>{console.log('  con l’anno  '+(it?it.g:'NON TROVATA'));ok(it&&it.g===att,'domanda con l’anno cambiata: '+(it&&it.g));});
  /* le faccio nel quiz vero: tocco la risposta giusta e deve diventare verde */
  const ids=r.a.map(x=>x[1]&&x[1].id);
  await p.evaluate(ids=>{buildQuiz();startQuiz(ids.map(id=>QUIZ_ALL.find(x=>x.id===id)),{mode:'study',title:'Tariffe'});},ids);await p.waitForTimeout(900);
  for(let k=0;k<ids.length;k++){
    const v=await p.evaluate(()=>{const it=Q.items[Q.idx];const bt=document.querySelectorAll('#qRunAns .qans');const b=bt[it.correct];b.click();
      return {testo:b.textContent.replace(/\s+/g,' ').trim(),verde:b.classList.contains('good')};});
    ok(v.verde,'nel quiz la risposta giusta non diventa verde: '+v.testo);
    await p.waitForTimeout(250);await p.evaluate(()=>{if(Q.idx<Q.items.length-1)qGo(1);});await p.waitForTimeout(150);
  }
  console.log('fatte nel quiz:',ids.length);
  /* Cerca: scrivendo Malpensa esce il nuovo importo */
  await p.evaluate(()=>goHome());await p.waitForTimeout(700);
  const cerca=await p.evaluate(async()=>{nccApriCerca();await new Promise(q=>setTimeout(q,500));const i=document.querySelector('#cxOv input');i.value='MI-Malpensa';i.dispatchEvent(new Event('input',{bubbles:true}));
    await new Promise(q=>setTimeout(q,700));return (document.getElementById('cxOv')||{}).innerText||'';});
  const trovato=/114 euro/.test(cerca);console.log('Cerca «MI-Malpensa» mostra 114 euro:',trovato);ok(trovato,'Cerca non mostra il nuovo importo');
  errors.forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
