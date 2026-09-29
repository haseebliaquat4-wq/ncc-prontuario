/* COMANDI DA TASTIERA E PICCOLE COSE (v146), a tempo reale.
   · Home: Q T P N / aprono la loro pagina, Esc torna in Home; ? apre i comandi, Invio li chiude
   · mentre scrivi (Cerca) le lettere restano lettere; Esc chiude
   · mappa: C Cieco, spazio scopre, → tappa dopo, V Quiz vie, Tab suggerimento, S Studio, L linea, R a caso, Esc esce
   · quiz: Invio passa alla domanda dopo solo se non la sta gia' passando l'app (mai due passi); Esc esce
   · piazze: → e spazio avanti, ← indietro; Mi verifico: spazio mostra, 2 «la sapevo»
   · Percorsi salvati: «pag. N» e il tasto Doppi; Correggi le tappe: Dividi in due (l'originale resta, niente marker)
   · domande: niente refusi a video, gli id restano le posizioni; la stessa domanda non esce due volte
   · Home: i numeri con la parola, il saluto sempre intero (anche 320 px e nome lungo)
   · tema scuro: Cerca e la mappa grande scure, la (i) di Cerca non copre il campo */
const {launch,boot,seed}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const VEDO=`window.__vedo=function(){var e=document.elementFromPoint(innerWidth/2,innerHeight/2),c=e;
  while(c&&c!==document.body){if(c.id==='popOv')return 'popup';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='cxOv')return 'cerca';
    if(c.id==='quizApp')return 'quiz:'+qCurView;if(c.id==='pzOv')return 'piazza';if(c.id==='homeScreen')return 'home';if(c.id==='map'||c.id==='panel')return 'mappa';c=c.parentElement;}
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};`;
(async()=>{
  const b=await launch();
  /* percorsi: il vecchio a meta', il completo dal PDF col suo nome, uno con OPPURE */
  const D0=await (async()=>{const t=await b.newPage();await t.goto('http://localhost:8765/percorsi-data.js');const s=await t.evaluate(()=>document.body.innerText);await t.close();const w={};new Function('window',s)(w);return w.__PERCORSI_PDF__;})();
  const p17=D0.find(x=>x.id==='p17a'),p96=D0.find(x=>x.id==='p96a');
  const s=seed();
  const routes=s.routes.concat([{id:'vec',title:'DUOMO - OSP. NIGUARDA',steps:p17.s.slice(0,17)},{id:'nuo',title:'DUOMO - OSP. NIGUARDA (pag. 17)',steps:p17.s.slice(),pdf:'p17a'},
    {id:'opp',title:p96.t,steps:p96.s.slice(),pdf:'p96a'}]);
  const coords=Object.assign({},s.coords);for(let i=0;i<17;i++)coords['vec_'+i]={lat:45.46+i/1000,lon:9.19};
  const err={};[3,4,5,6,7,8].forEach(i=>err[i]={box:1,due:Date.now()-3600000});
  let {page:p,ctx,errors}=await boot(b,{clock:false,viewport:{width:1280,height:800},extra:{routes,coords,antiFretta:'false',wkRepTs:String(Date.now()),
    azzerato2026:String(Date.now()),qtStats:{cat:{},err,seenIds:{},idV:2}}});
  await p.addScriptTag({content:VEDO});
  const film=async dur=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;};
  const pulito=(f,n)=>{if(f.some(x=>/^vuoto/.test(x)))fails.push(n+': schermo vuoto di passaggio '+f.join(' → '));};
  /* ════ 1 · Home ════ */
  for(const [tasto,dove] of [['q','pagina:quiz'],['t','pagina:topo'],['p','pagina:pz'],['n','pagina:norme']]){
    await p.keyboard.press(tasto);let f=await film(1100);pulito(f,'tasto '+tasto);
    ok(f[f.length-1]===dove,'tasto '+tasto.toUpperCase()+': arriva a '+f[f.length-1]+' invece di '+dove+' ('+f.join(' → ')+')');
    await p.keyboard.press('Escape');const g=await film(1100);pulito(g,'Esc da '+dove);
    ok(g[g.length-1]==='home','Esc da '+dove+': arriva a '+g[g.length-1]+' ('+g.join(' → ')+')');
    console.log(('tasto '+tasto.toUpperCase()).padEnd(9),f.join(' → '),'| Esc',g.join(' → '));
  }
  await p.keyboard.press('/');let f=await film(900);
  const foc=await p.evaluate(()=>document.activeElement&&document.activeElement.id);
  await p.keyboard.type('qtpn');await p.waitForTimeout(400);
  const cer=await p.evaluate(()=>({v:document.getElementById('cxIn').value,dove:__vedo()}));
  console.log('tasto /',f.join(' → '),'| scrivo «qtpn»:',JSON.stringify(cer));
  ok(f[f.length-1]==='cerca'&&cer.v==='qtpn'&&cer.dove==='cerca','Cerca: le lettere fanno comandi mentre scrivi '+JSON.stringify(cer));
  await p.keyboard.press('Escape');f=await film(900);ok(f[f.length-1]==='home','Esc da Cerca: '+f.join(' → '));
  await p.keyboard.press('?');await p.waitForTimeout(500);
  const aiuto=await p.evaluate(()=>{const o=document.getElementById('popOv');return o?{t:(o.querySelector('.pop-t')||{}).textContent,righe:o.querySelectorAll('.kb-r').length}:null;});
  await p.keyboard.press('Enter');await p.waitForTimeout(500);const chiuso=await p.evaluate(()=>!document.getElementById('popOv'));
  console.log('tasto ?',JSON.stringify(aiuto),'| Invio chiude:',chiuso);ok(aiuto&&aiuto.t==='Comandi da tastiera'&&aiuto.righe>=20&&chiuso,'la finestra dei comandi '+JSON.stringify(aiuto)+' chiusa '+chiuso);
  /* ════ 2 · mappa ════ */
  await p.evaluate(()=>{goTopografia();setTimeout(()=>selectRoute(routes.find(r=>r.id==='r1')),300);});await p.waitForTimeout(1200);
  await p.keyboard.press('c');await p.waitForTimeout(300);
  const m1=await p.evaluate(()=>({mode,step,sc:!!listRows[step]&&listRows[step]._nm.classList.contains('hid')}));
  await p.keyboard.press(' ');await p.waitForTimeout(400);
  const m2=await p.evaluate(()=>({rev:_revealed,sc:!!listRows[step]&&listRows[step]._nm.classList.contains('hid')}));
  await p.keyboard.press('ArrowRight');await p.waitForTimeout(300);const m3=await p.evaluate(()=>step);
  console.log('mappa: C',JSON.stringify(m1),'| spazio',JSON.stringify(m2),'| → tappa',m3);
  ok(m1.mode==='c'&&m1.sc&&m2.rev&&!m2.sc&&m3===m1.step+1,'mappa: C, spazio o → non vanno '+JSON.stringify({m1,m2,m3}));
  await p.keyboard.press('v');await p.waitForTimeout(400);
  await p.click('#qa');await p.keyboard.type('sl');const m4=await p.evaluate(()=>({mode,v:document.getElementById('qa').value}));
  await p.keyboard.press('Tab');await p.waitForTimeout(300);const aiu=await p.evaluate(()=>({fb:document.getElementById('qfb').textContent,foc:document.activeElement.id}));
  console.log('mappa: V',JSON.stringify(m4),'| Tab',JSON.stringify(aiu));
  ok(m4.mode==='q'&&m4.v.toUpperCase()==='SL'&&/inizia per/.test(aiu.fb)&&aiu.foc==='qa','Quiz vie: V, lettere o Tab non vanno '+JSON.stringify({m4,aiu}));
  await p.evaluate(()=>{document.getElementById('qa').value='';document.getElementById('qa').blur();});
  await p.keyboard.press('s');await p.waitForTimeout(300);const m5=await p.evaluate(()=>mode);
  await p.keyboard.press('l');await p.waitForTimeout(600);
  const l0=await p.evaluate(()=>!!document.getElementById('lineaOv'));
  await p.keyboard.press('l');await p.waitForTimeout(600);
  const l1=await p.evaluate(()=>!!document.getElementById('lineaOv'));
  const c0=await p.evaluate(()=>cur.id);let cambi=0;for(let i=0;i<4;i++){await p.keyboard.press('r');await p.waitForTimeout(500);if(await p.evaluate(c=>cur&&cur.id!==c,c0))cambi++;}
  console.log('mappa: S',m5,'| L apre la linea',l0,'| L la richiude',!l1,'| R: percorso cambiato',cambi,'volte su 4');
  ok(m5==='s'&&l0&&!l1&&cambi>0,'mappa: S, L o R non vanno '+JSON.stringify({m5,l0,l1,cambi}));
  await p.keyboard.press('Escape');f=await film(1300);console.log('mappa: Esc',f.join(' → '));pulito(f,'Esc dalla mappa');
  ok(f[f.length-1]==='home','Esc dalla mappa: '+f.join(' → '));
  /* ════ 3 · quiz ════ */
  await p.evaluate(()=>{window.__nccQuizOrigine='home';nccAvvio(function(){buildQuiz();qStartNew();});});await p.waitForTimeout(1800);
  const giusta=async()=>{const c=await p.evaluate(()=>Q.items[Q.idx].correct);await p.keyboard.press(String(c+1));};
  await giusta();await p.waitForTimeout(1600);let q1=await p.evaluate(()=>Q.idx);
  await p.keyboard.press('ArrowLeft');await p.waitForTimeout(300);const q2=await p.evaluate(()=>Q.idx);
  await p.keyboard.press('Enter');await p.waitForTimeout(400);const q3=await p.evaluate(()=>Q.idx);
  await giusta();await p.waitForTimeout(200);await p.keyboard.press('Enter');await p.waitForTimeout(1600);const q4=await p.evaluate(()=>Q.idx);
  console.log('quiz: dopo la risposta',q1,'| ←',q2,'| Invio',q3,'| risposta e subito Invio →',q4);
  ok(q1===1&&q2===0&&q3===1&&q4===2,'quiz: Invio fa un passo in piu’ o nessuno '+JSON.stringify({q1,q2,q3,q4}));
  await p.keyboard.press('Escape');f=await film(1400);console.log('quiz: Esc',f.join(' → '));
  ok(f[f.length-1]==='home'&&!f.includes('popup'),'quiz: Esc non esce in Home senza domande '+f.join(' → '));
  /* ════ 4 · piazze ════ */
  const pzid=await p.evaluate(()=>{const P=pzTutte().filter(x=>x.v&&x.v.length>=4);pzApri(P[0].id,'c');return P[0].id;});await p.waitForTimeout(600);
  const passo=()=>p.evaluate(()=>[...document.querySelectorAll('#pzMetro .mx-st')].filter(x=>!x.classList.contains('nas')).length);
  const z0=await passo();await p.keyboard.press('ArrowRight');await p.waitForTimeout(250);const z1=await passo();
  await p.keyboard.press(' ');await p.waitForTimeout(250);const z2=await passo();await p.keyboard.press('ArrowLeft');await p.waitForTimeout(250);const z3=await passo();
  console.log('piazza',pzid,'Cieco: vie scoperte',z0,'→',z1,'(→)',z2,'(spazio)',z3,'(←)');
  ok(z1===z0+1&&z2===z1+1&&z3===z2-1,'piazze: frecce o spazio non vanno '+[z0,z1,z2,z3].join(','));
  await p.evaluate(()=>pzVerifica());await p.waitForTimeout(400);
  await p.keyboard.press(' ');await p.waitForTimeout(300);const v1=await p.evaluate(()=>!!document.querySelector('#verR b'));
  await p.keyboard.press('2');await p.waitForTimeout(300);const v2=await p.evaluate(()=>document.querySelector('#pzOv .ver-n')&&document.querySelector('#pzOv .ver-n').textContent);
  console.log('Mi verifico: spazio mostra',v1,'| 2 → via',v2);ok(v1&&v2==='2','Mi verifico: spazio o 2 non vanno '+v1+' '+v2);
  await p.evaluate(()=>{try{openPiazze();}catch(e){}});await p.waitForTimeout(400);await p.keyboard.press('Escape');await p.waitForTimeout(900);
  /* ════ 5 · Percorsi salvati: pag. N e Doppi ════ */
  await p.evaluate(()=>{try{goHome();}catch(e){}openMgr();});await p.waitForTimeout(700);
  const mg=await p.evaluate(()=>{const r=[...document.querySelectorAll('#mgrList .ri')];const t=x=>x.querySelector('.rit').textContent;
    return {n:r.length,pag:(r.find(x=>/MACIACHINI/.test(t(x)))||{querySelector:()=>null}).querySelector('.mg-pag'),pagT:((r.find(x=>/MACIACHINI/.test(t(x)))||document).querySelector('.mg-pag')||{}).textContent,
      dp:(document.getElementById('mgDoppi')||{}).textContent};});
  await p.evaluate(()=>document.getElementById('mgDoppi').click());await p.waitForTimeout(400);
  const mg2=await p.evaluate(()=>({vis:[...document.querySelectorAll('#mgrList .ri')].filter(x=>x.style.display!=='none').map(x=>x.querySelector('.rit').textContent),cnt:document.getElementById('mgrCnt').textContent,
    on:document.getElementById('mgDoppi').classList.contains('on')}));
  await p.evaluate(()=>document.getElementById('mgDoppi').click());await p.waitForTimeout(400);
  const mg3=await p.evaluate(()=>[...document.querySelectorAll('#mgrList .ri')].filter(x=>x.style.display!=='none').length);
  console.log('Percorsi salvati:',mg.n,'righe | MACIACHINI',mg.pagT,'|',mg.dp,'→',JSON.stringify(mg2),'| di nuovo tutti',mg3);
  ok(mg.pagT===' · pag. 96','pag. N accanto al percorso preso dal PDF: '+mg.pagT);
  ok(/Doppi 2/.test(mg.dp||'')&&mg2.on&&mg2.vis.length===2&&mg2.vis.every(x=>/NIGUARDA/.test(x))&&/2 percorsi con lo stesso nome/.test(mg2.cnt)&&mg3===mg.n,'Doppi: '+JSON.stringify({dp:mg.dp,mg2,mg3}));
  await p.evaluate(()=>closeMgr());await p.waitForTimeout(400);
  /* ════ 6 · Dividi in due ════ */
  await p.evaluate(()=>nccCorreggiElenco());await p.waitForTimeout(800);
  const primo=await p.evaluate(()=>document.querySelector('#scnOv .sc-r .pf-n').textContent);
  await p.evaluate(()=>document.querySelector('#scnOv .sc-r').click());await p.waitForTimeout(500);
  const dom=await p.evaluate(()=>({t:(document.querySelector('#popOv .pop-t')||{}).textContent,x:(document.querySelector('#popOv .pop-x')||{}).textContent,b:[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent)}));
  console.log('Correggi: in cima',primo,'| tocco →',JSON.stringify(dom));
  const prima=await p.evaluate(()=>({n:routes.length,opp:JSON.stringify(routes.find(r=>r.id==='opp')),ck:Object.keys(coords).length}));
  await p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click());await p.waitForTimeout(900);
  const dopo=await p.evaluate(()=>({n:routes.length,opp:JSON.stringify(routes.find(r=>r.id==='opp')),ck:Object.keys(coords).length,
    nuovi:routes.filter(r=>/\(strada \d\)$/.test(r.title)).map(r=>({t:r.title,n:r.steps.length,primo:r.steps[0],ultimo:r.steps[r.steps.length-1],alt:r.steps.some(s=>/OPPURE|ECC/.test(s))})),
    avviso:(document.querySelector('#popOv .pop-x')||{}).textContent||''}));
  console.log('Dividi:',JSON.stringify(dopo.nuovi),'|',dopo.avviso.replace(/\s+/g,' ').slice(0,120));
  ok(primo===p96.t&&/OPPURE/.test(dom.t||'')&&dom.b.length===3,'Correggi: il percorso con OPPURE non chiede cosa fare '+JSON.stringify(dom));
  ok(dopo.n===prima.n+2&&dopo.opp===prima.opp&&dopo.ck===prima.ck&&dopo.nuovi.length===2&&dopo.nuovi[0].n===21&&dopo.nuovi[1].n===15&&dopo.nuovi.every(x=>!x.alt)
    &&dopo.nuovi[0].primo==='P.LE MACIACHINI'&&dopo.nuovi[0].ultimo==='L.GO AUGUSTO'&&dopo.nuovi[1].ultimo==='P.ZA CAVOUR','Dividi in due: '+JSON.stringify(dopo));
  await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b');if(b)b.click();});await p.waitForTimeout(400);
  /* e «Correggi le tappe» apre l'editor di sempre */
  await p.evaluate(()=>{const r=[...document.querySelectorAll('#scnOv .sc-r')].find(x=>x.querySelector('.pf-n').textContent===document.querySelector('#scnOv .sc-r .pf-n').textContent);r.click();});await p.waitForTimeout(500);
  await p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="1"]').click());await p.waitForTimeout(900);
  const ed=await p.evaluate(()=>{const e=document.getElementById('addModal');return !!(e&&e.classList.contains('open'));});console.log('Correggi le tappe → editor di sempre:',ed);ok(ed,'«Correggi le tappe» non apre l’editor di sempre');
  await p.evaluate(()=>{try{closeAdd();}catch(e){}});await p.waitForTimeout(600);
  await p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');if(b)b.click();});await p.waitForTimeout(500);
  await p.evaluate(()=>{try{nccSezChiudi(true);}catch(e){}try{goHome();}catch(e){}});await p.waitForTimeout(500);
  /* ════ 7 · le domande ════ */
  const dq=await p.evaluate(()=>{buildQuiz();const A=QUIZ_ALL;
    const brutti=A.filter(it=>/ {2}|tassamentro|Ppavia| [?:;,.!](\s|$)/.test(it.q+' '+it.choices.join(' ')));
    const ids=A.every((it,i)=>it.id===i);const tas=A.filter(it=>it.choices.some(c=>/azzerare il tassametro$/.test(c))).length;
    const g={};A.forEach(it=>{const k=nccChiaveDomanda(it);(g[k]=g[k]||[]).push(it.id);});const cp=Object.values(g).filter(x=>x.length>1);
    const tw=cp[0].map(i=>A[i]);const altra=A.find(it=>it.cat===tw[0].cat&&!cp[0].includes(it.id));
    startQuiz([tw[0],tw[1],altra],{mode:'study',title:'prova'});const nStudio=Q.items.length;
    startQuiz([tw[0],tw[1],altra],{mode:'exam',title:'prova',limit:3});const ex=Q.items.map(x=>x.id);const nEx=ex.length,unici=new Set(Q.items.map(nccChiaveDomanda)).size;
    Q=null;try{closeQuiz();}catch(e){}
    return {tot:A.length,brutti:brutti.length,ids,tas,coppie:cp.length,nStudio,nEx,unici,catOk:Q===null};});
  console.log('domande:',JSON.stringify(dq));
  ok(dq.tot===1136&&dq.ids&&dq.brutti===0&&dq.tas>=2,'domande: refusi a video o id spostati '+JSON.stringify(dq));
  ok(dq.coppie>=15&&dq.nStudio===2&&dq.nEx===3&&dq.unici===3,'domande doppie nella stessa sessione '+JSON.stringify(dq));
  await p.evaluate(()=>{try{goHome();}catch(e){}});await p.waitForTimeout(600);
  /* ════ 8 · Home: i numeri con la parola ════ */
  const bd=await p.evaluate(()=>[...document.querySelectorAll('#hmNew .hm-rq-bx')].map(x=>{const n=x.querySelector('.hm-rq-b'),w=x.querySelector('.hm-rq-w'),
    rn=n.getBoundingClientRect(),rw=w?w.getBoundingClientRect():null;return {n:n.textContent,w:w?w.textContent:'',sotto:rw?rw.top>=rn.bottom-1:false};}));
  console.log('riquadri:',bd.map(x=>x.n+' «'+x.w+'»').join(' | '));
  ok(bd.length>=7&&bd.every(x=>x.w&&x.sotto)&&bd.some(x=>/^\d+\/\d+$/.test(x.n)&&x.w==='sicuri'),'riquadri senza la parola sotto il numero: '+JSON.stringify(bd));
  errors.forEach(e=>fails.push('JS '+e));await ctx.close();
  /* ════ 9 · il saluto sempre intero, telefono piccolo e nome lungo ════ */
  for(const w of [320,390]){
    ({page:p,ctx,errors}=await boot(b,{clock:false,viewport:{width:w,height:760},touch:true,mobile:true,extra:{nomeUtente:'Massimiliano Alessandro'}}));
    const sa=await p.evaluate(()=>{const e=document.querySelector('#hmNew .hm-ciao'),r=e.getBoundingClientRect(),l=document.querySelector('#hmNew .hm-lente').getBoundingClientRect();
      return {t:e.textContent,fs:getComputedStyle(e).fontSize,taglio:e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+2,righe:Math.round(r.height/parseFloat(getComputedStyle(e).lineHeight)),sopra:r.right>l.left+1};});
    const bdg=await p.evaluate(()=>[...document.querySelectorAll('#hmNew .hm-rq-b')].map(x=>({t:x.textContent,cut:x.scrollWidth>x.clientWidth+1})));
    console.log('saluto a',w,JSON.stringify(sa),'| riquadri tagliati:',bdg.filter(x=>x.cut).map(x=>x.t).join(',')||'nessuno');
    ok(!sa.taglio&&!sa.sopra&&sa.righe<=3,'saluto tagliato a '+w+' '+JSON.stringify(sa));
    ok(!bdg.some(x=>x.cut),'a '+w+' un numero dei riquadri si taglia: '+bdg.filter(x=>x.cut).map(x=>x.t).join(','));
    await p.screenshot({path:__dirname+'/comandi-home-'+w+'.png'});
    errors.forEach(e=>fails.push('JS '+w+' '+e));await ctx.close();
  }
  /* ════ 10 · tema scuro: Cerca e la mappa grande ════ */
  ({page:p,ctx,errors}=await boot(b,{clock:false,dark:true,touch:true,mobile:true}));
  await p.evaluate(()=>nccApriCerca());await p.waitForTimeout(700);
  const cx=await p.evaluate(()=>{const o=document.getElementById('cxOv'),i=document.getElementById('cxIn').getBoundingClientRect(),t=o.querySelector('.t-info-in');
    return {bg:getComputedStyle(o).backgroundColor,in:getComputedStyle(document.getElementById('cxIn')).backgroundColor,sovra:t?(t.getBoundingClientRect().left<i.right-1):false};});
  await p.screenshot({path:__dirname+'/comandi-cerca-scuro.png'});
  await p.evaluate(()=>history.back());await p.waitForTimeout(700);
  await p.evaluate(()=>nccMappaGrande());await p.waitForTimeout(900);
  const mgv=await p.evaluate(()=>{const b=document.querySelector('#mgOv .mg-barra');return {barra:b?getComputedStyle(b).backgroundColor:null,bt:getComputedStyle(document.querySelector('#mgOv .mg-b:not([title="Esci"])')).backgroundColor};});
  const luce=c=>{const m=(c||'').match(/\d+/g)||[255,255,255];return (m[0]*299+m[1]*587+m[2]*114)/1000;};
  console.log('scuro: Cerca',JSON.stringify(cx),'| mappa grande',JSON.stringify(mgv));
  ok(luce(cx.bg)<60&&luce(cx.in)<60&&!cx.sovra,'Cerca col tema scuro: '+JSON.stringify(cx));
  ok(luce(mgv.barra)<60&&luce(mgv.bt)<60,'mappa grande col tema scuro: '+JSON.stringify(mgv));
  errors.forEach(e=>fails.push('JS scuro '+e));await ctx.close();
  await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
