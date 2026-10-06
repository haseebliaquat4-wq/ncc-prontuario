/* LE VIE DI UNA PIAZZA IN UNA SCHEDA GRANDE (v151), a tempo reale.
   · «✎ Modifica» apre la scheda a tutta pagina (niente finestrella del browser): nome in alto, una via per riga
   · scrivere, spostare (↑ ↓), togliere (−), aggiungere, Invio alla via dopo, ⌫ su una via vuota, incollare un elenco
   · Salva: le vie nuove nella piazza; i marker seguono la via, quelli delle vie tolte se ne vanno (e non tornano dal cloud)
   · Annulla con modifiche chiede; senza modifiche chiude subito; il tasto indietro chiude senza salvare, resta la piazza
   · «＋ Aggiungi una piazza»: la stessa scheda vuota; senza nome o senza vie non salva
   · dal cloud: vince la modifica piu' recente; una piazza tua eliminata non torna; le lapidi dei marker viaggiano
   · fotogramma per fotogramma: la scheda sale e scende, sotto resta la piazza (mai la Home)
   · di fretta: doppio tocco su Modifica, indietro mentre sale (40, 140, 260 ms), riaperta mentre scende, Salva due
     volte, doppio indietro: mai due schede, mai una scheda ferma a meta' */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};const J=x=>JSON.stringify(x);
(async()=>{
const b=await launch();
/* i marker della piazza: ogni via ha la sua latitudine (45.40 + i/1000), la piazza la sua */
const pzc={pz11:{lat:45.4626,lon:9.2083,t:1000}};
for(let i=0;i<6;i++)pzc['pz11_'+i]={lat:+(45.40+i/1000).toFixed(6),lon:9.2,t:1000+i};
const {page:p,errors}=await boot(b,{clock:false,bootMs:5500,touch:true,mobile:true,extra:{pzCoords:pzc}});
await p.evaluate(()=>{window.__prompt=0;window.prompt=function(){window.__prompt++;return null;};});
const film=(ms)=>p.evaluate(ms=>new Promise(res=>{const o=[],t0=performance.now();
  (function f(){const e=document.getElementById('pzEdOv');const c=document.elementFromPoint(195,600);
    o.push({t:Math.round(performance.now()-t0),tr:e?getComputedStyle(e).transform:'-',sotto:c?(c.closest('#pzEdOv')?'scheda':(c.closest('#pzOv')?'piazza':(c.closest('#homeScreen')?'home':(c.id||c.tagName)))):'-'});
    if(performance.now()-t0<ms)requestAnimationFrame(f);else res(o);})();}),ms);
const ty=m=>{if(!m||m==='none')return 0;const x=m.match(/matrix\(([^)]+)\)/);return x?+x[1].split(',')[5]:NaN;};
/* ── la piazza e la scheda ── */
await p.evaluate(()=>openPiazze());await p.waitForTimeout(400);
await p.evaluate(()=>[...document.querySelectorAll('#pzList .pz-row')].find(x=>/5 GIORNATE/.test(x.textContent)).click());await p.waitForTimeout(500);
await p.evaluate(()=>[...document.querySelectorAll('#pzOv .pz-azioni button')].find(x=>/Modifica/.test(x.textContent)).click());
let f=await film(700);
const ys=f.map(x=>ty(x.tr)).filter(x=>!isNaN(x));
console.log('sale:',ys.slice(0,12).map(Math.round).join(' '),'… fine',Math.round(ys[ys.length-1]),'· sotto',[...new Set(f.map(x=>x.sotto))].join(' → '));
ok(ys.length>8&&ys[0]>300&&ys[ys.length-1]===0,'la scheda non sale: '+ys.slice(0,6).join(' '));
let scatti=0;for(let i=1;i<ys.length;i++)if(ys[i]>ys[i-1]+0.5)scatti++;
ok(!scatti,'la scheda torna indietro mentre sale: '+scatti);
ok(!f.some(x=>x.sotto==='home'),'la Home di passaggio aprendo la scheda');
let S=await p.evaluate(()=>({t:document.querySelector('#pzEdOv .ed-t').textContent,nome:document.getElementById('pzEdNome').value,
  vie:[...document.querySelectorAll('#pzEdVie .ed-in')].map(i=>i.value),pieni:[...document.querySelectorAll('#pzEdVie .ed-n')].map(n=>n.classList.contains('ok')),
  conta:document.getElementById('pzEdConta').textContent,h:document.querySelector('#pzEdVie .ed-r').getBoundingClientRect().height}));
console.log('scheda',JSON.stringify(S));
ok(S.t==='Modifica piazza'&&S.nome==='PIAZZA 5 GIORNATE'&&S.vie.length===6&&S.vie[0]==='Viale Monte Nero'&&S.vie[5]==='Corso XXII Marzo','scheda: '+JSON.stringify(S));
ok(S.pieni.every(Boolean)&&S.conta==='VIE (6)'&&S.h>=50,'numeri pieni / conto / righe alte: '+JSON.stringify([S.pieni,S.conta,S.h]));
/* senza modifiche: Annulla chiude subito */
await p.click('#pzEdOv .ed-a');await p.waitForTimeout(600);
ok(!(await p.evaluate(()=>!!document.getElementById('pzEdOv')||!!document.getElementById('popOv'))),'Annulla senza modifiche non chiude (o chiede)');
/* ── le modifiche, come una persona ── */
await p.evaluate(()=>pzModifica());await p.waitForTimeout(600);
const via=i=>'#pzEdVie .ed-in[data-i="'+i+'"]';
await p.click(via(1));await p.keyboard.press('End');await p.keyboard.type(' (lato pari)');
await p.click('#pzEdVie .ed-r[data-i="0"] .ed-b:nth-of-type(2)');await p.waitForTimeout(150);   /* ↓: Monte Nero scende */
S=await p.evaluate(()=>[...document.querySelectorAll('#pzEdVie .ed-in')].map(i=>i.value));
ok(S[0]==='Via Regina Margherita (lato pari)'&&S[1]==='Viale Monte Nero','sposta giu\': '+JSON.stringify(S));
ok(await p.evaluate(()=>document.querySelector('#pzEdVie .ed-r[data-i="1"]').classList.contains('mosso')),'la riga spostata non si accende');
await p.click('#pzEdVie .ed-r[data-i="3"] .ed-x');await p.waitForTimeout(150);                    /* via Bianca Maria */
await p.click('#pzEdOv .ed-add');await p.waitForTimeout(150);
ok(await p.evaluate(()=>document.activeElement&&document.activeElement.getAttribute('data-i')==='5'),'la via nuova non prende il cursore');
await p.keyboard.type('Via Nuova');await p.keyboard.press('Enter');await p.waitForTimeout(150);
ok(await p.evaluate(()=>document.querySelectorAll('#pzEdVie .ed-in').length===7&&document.activeElement.getAttribute('data-i')==='6'),'Invio dall\'ultima: niente via nuova');
await p.keyboard.press('Enter');await p.waitForTimeout(100);
ok(await p.evaluate(()=>document.querySelectorAll('#pzEdVie .ed-in').length===7),'Invio da una via vuota ne apre un\'altra');
/* incollare un elenco nella via vuota */
await p.evaluate(()=>{const i=document.activeElement;const dt=new DataTransfer();dt.setData('text/plain','Via Alfa\nVia Beta, Via Gamma\n');
  i.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));});await p.waitForTimeout(150);
S=await p.evaluate(()=>({v:[...document.querySelectorAll('#pzEdVie .ed-in')].map(i=>i.value),a:document.activeElement.getAttribute('data-i'),c:document.getElementById('pzEdConta').textContent}));
ok(JSON.stringify(S.v.slice(5))==='["Via Nuova","Via Alfa","Via Beta","Via Gamma"]'&&S.a==='8'&&S.c==='VIE (9)','incolla: '+JSON.stringify(S));
/* ⌫ su una via vuota: se ne va, il cursore torna su */
await p.click('#pzEdOv .ed-add');await p.waitForTimeout(120);await p.keyboard.press('Backspace');await p.waitForTimeout(120);
S=await p.evaluate(()=>({n:document.querySelectorAll('#pzEdVie .ed-in').length,a:document.activeElement.getAttribute('data-i')}));
ok(S.n===9&&S.a==='8','⌫ su una via vuota: '+JSON.stringify(S));
/* Annulla con modifiche: chiede; «Annulla» del popup lascia tutto com'e' */
await p.click('#pzEdOv .ed-a');await p.waitForTimeout(500);
S=await p.evaluate(()=>({pop:document.querySelector('#popOv')?document.querySelector('#popOv').textContent:null}));
ok(S.pop&&/Esci senza salvare/.test(S.pop),'Annulla con modifiche non chiede: '+JSON.stringify(S));
await p.evaluate(()=>[...document.querySelectorAll('#popOv .pop-b')].find(x=>/^Annulla$/.test(x.textContent.trim())).click());await p.waitForTimeout(500);
ok(await p.evaluate(()=>!!document.getElementById('pzEdOv')&&document.querySelectorAll('#pzEdVie .ed-in').length===9),'il popup ha chiuso la scheda');
/* ── Salva ── */
await p.click('#pzEdOv .ed-s');
f=await film(650);
const ys2=f.map(x=>ty(x.tr)).filter(x=>!isNaN(x));
console.log('scende:',ys2.slice(0,10).map(Math.round).join(' '),'· sotto',[...new Set(f.map(x=>x.sotto))].join(' → '));
ok(!f.some(x=>x.sotto==='home'),'la Home di passaggio salvando');
await p.waitForTimeout(300);
S=await p.evaluate(()=>({ed:JSON.parse(localStorage.getItem('pzEdit')||'{}').pz11,co:JSON.parse(localStorage.getItem('pzCoords')||'{}'),
  tolte:JSON.parse(localStorage.getItem('pzTolte')||'{}'),aperta:!!document.getElementById('pzEdOv'),
  metro:[...document.querySelectorAll('#pzMetro .mx-st b')].map(x=>x.textContent),sub:(document.querySelector('#pzOv .pz-su')||{}).textContent}));
const atteso=['Via Regina Margherita (lato pari)','Viale Monte Nero','Corso di Porta Vittoria','Viale Premuda','Corso XXII Marzo','Via Nuova','Via Alfa','Via Beta','Via Gamma'];
console.log('salvata',JSON.stringify(S.ed));
ok(S.ed&&JSON.stringify(S.ed.v)===JSON.stringify(atteso)&&S.ed.ts>0&&!S.ed.n,'pzEdit: '+JSON.stringify(S.ed));
ok(!S.aperta&&JSON.stringify(S.metro)===JSON.stringify(atteso)&&/9 vie/.test(S.sub||''),'la piazza dietro non mostra le vie nuove: '+JSON.stringify([S.metro,S.sub]));
/* i marker: Regina Margherita (era 1) ora e' 0, Monte Nero (era 0) e' 1, Porta Vittoria resta 2, Premuda (era 4) e' 3, XXII Marzo (era 5) e' 4 */
const lat=k=>S.co[k]?Math.round((S.co[k].lat-45.40)*1000):null;
const mk=[0,1,2,3,4,5,6,7,8].map(i=>lat('pz11_'+i));
console.log('marker (via di prima):',JSON.stringify(mk));
ok(JSON.stringify(mk)==='[1,0,2,4,5,null,null,null,null]','i marker non seguono la loro via: '+JSON.stringify(mk));
ok(S.co.pz11_2.t===1002&&S.co.pz11_0.t>1e12&&S.co.pz11&&S.co.pz11.lat===45.4626,'ora dei marker: '+JSON.stringify([S.co.pz11_2,S.co.pz11_0]));
ok(S.tolte['c:pz11_5']>0&&Object.keys(S.tolte).length===1,'lapidi: '+JSON.stringify(S.tolte));
/* un marker vecchio dal cloud sulla via tolta non torna; uno messo dopo (piu' recente) si' */
await p.evaluate(()=>{const c=JSON.parse(localStorage.getItem('pzCoords'));c.pz11_5={lat:45.405,lon:9.2,t:1005};localStorage.setItem('pzCoords',JSON.stringify(c));});
ok(!(await p.evaluate(()=>!!JSON.parse(localStorage.getItem('pzCoords')).pz11_5)),'il marker della via tolta e\' tornato dal cloud');
await p.evaluate(()=>{const c=JSON.parse(localStorage.getItem('pzCoords'));c.pz11_5={lat:45.499,lon:9.2,t:Date.now()+5000};localStorage.setItem('pzCoords',JSON.stringify(c));});
ok(await p.evaluate(()=>!!JSON.parse(localStorage.getItem('pzCoords')).pz11_5),'un marker piu\' recente della lapide non entra');
/* messo a mano dalla mappa delle piazze (scelgo la via, poi tocco la mappa): la lapide non lo ferma */
await p.evaluate(()=>{const c=JSON.parse(localStorage.getItem('pzCoords'));delete c.pz11_5;localStorage.setItem('pzCoords',JSON.stringify(c));
  const t=JSON.parse(localStorage.getItem('pzTolte'));t['c:pz11_5']=Date.now()+1e7;localStorage.setItem('pzTolte',JSON.stringify(t));});
await p.evaluate(()=>{try{pzPos('pz11',5);}catch(e){}const c=JSON.parse(localStorage.getItem('pzCoords'));c.pz11_5={lat:45.45,lon:9.21};localStorage.setItem('pzCoords',JSON.stringify(c));});
S=await p.evaluate(()=>({c:JSON.parse(localStorage.getItem('pzCoords')).pz11_5,t:JSON.parse(localStorage.getItem('pzTolte'))['c:pz11_5']}));
ok(S.c&&S.c.lat===45.45&&!S.t,'il marker messo a mano sulla via con la lapide: '+JSON.stringify(S));
/* ── il tasto indietro: chiude la scheda senza salvare, resta la piazza ── */
await p.evaluate(()=>pzModifica());await p.waitForTimeout(600);
await p.fill(via(0),'CAMBIATA E NON SALVATA');
await p.goBack().catch(()=>{});
f=await film(700);
S=await p.evaluate(()=>({sch:!!document.getElementById('pzEdOv'),det:!!document.querySelector('#pzOv #pzMetro'),v0:JSON.parse(localStorage.getItem('pzEdit')).pz11.v[0]}));
console.log('indietro:',JSON.stringify(S),[...new Set(f.map(x=>x.sotto))].join(' → '));
ok(!S.sch&&S.det&&S.v0==='Via Regina Margherita (lato pari)','indietro: '+JSON.stringify(S));
ok(!f.some(x=>x.sotto==='home'),'indietro: la Home di passaggio');
/* e il prossimo indietro torna all'elenco, come prima */
await p.goBack().catch(()=>{});await p.waitForTimeout(700);
ok(await p.evaluate(()=>!!document.querySelector('#pzOv #pzList')),'il secondo indietro non torna all\'elenco delle piazze');
/* ── una piazza nuova ── */
await p.evaluate(()=>document.querySelector('#pzOv .pz-add').click());await p.waitForTimeout(650);
S=await p.evaluate(()=>({t:document.querySelector('#pzEdOv .ed-t').textContent,n:document.getElementById('pzEdNome').value,a:document.activeElement&&document.activeElement.id,r:document.querySelectorAll('#pzEdVie .ed-in').length}));
ok(S.t==='Nuova piazza'&&S.n===''&&S.a==='pzEdNome'&&S.r===1,'piazza nuova: '+JSON.stringify(S));
await p.click('#pzEdOv .ed-s');await p.waitForTimeout(500);
ok(/Scrivi il nome della piazza/.test(await p.evaluate(()=>(document.getElementById('popOv')||{}).textContent||'')),'senza nome salva lo stesso');
await p.evaluate(()=>document.querySelector('#popOv .pop-b').click());await p.waitForTimeout(450);
ok(await p.evaluate(()=>document.activeElement&&document.activeElement.id==='pzEdNome'),'dopo l\'avviso il cursore non torna sul nome');
await p.keyboard.type('largo dei test');await p.keyboard.press('Enter');await p.waitForTimeout(100);
ok(await p.evaluate(()=>document.activeElement&&document.activeElement.getAttribute('data-i')==='0'),'Invio dal nome non passa alla prima via');
await p.click('#pzEdOv .ed-s');await p.waitForTimeout(500);
ok(/Scrivi almeno una via/.test(await p.evaluate(()=>(document.getElementById('popOv')||{}).textContent||'')),'senza vie salva lo stesso');
await p.evaluate(()=>document.querySelector('#popOv .pop-b').click());await p.waitForTimeout(450);
await p.evaluate(()=>{const i=document.querySelector('#pzEdVie .ed-in');i.focus();const dt=new DataTransfer();dt.setData('text/plain','Via Uno\r\nVia Due\r\nVia Tre');
  i.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));});await p.waitForTimeout(150);
await p.click('#pzEdOv .ed-s');await p.waitForTimeout(800);
S=await p.evaluate(()=>({u:JSON.parse(localStorage.getItem('pzUser')||'[]'),lista:!!document.querySelector('#pzOv #pzList'),riga:[...document.querySelectorAll('#pzList .pz-row')].some(r=>/LARGO DEI TEST/.test(r.textContent))}));
const nu=S.u.find(x=>x.n==='LARGO DEI TEST');
console.log('nuova',JSON.stringify(nu));
ok(nu&&nu.t==='largo'&&JSON.stringify(nu.v)==='["Via Uno","Via Due","Via Tre"]'&&nu.ts>0&&/^pzU\d+$/.test(nu.id),'piazza nuova salvata: '+JSON.stringify(S.u));
ok(S.lista&&S.riga,'la piazza nuova non e\' nell\'elenco');
/* modificata anche lei: resta nelle tue, con l'ora nuova */
await p.evaluate(id=>{pzApri(id);},nu.id);await p.waitForTimeout(400);
await p.evaluate(()=>pzModifica());await p.waitForTimeout(600);
await p.fill('#pzEdNome','PIAZZALE DEI TEST');await p.click('#pzEdVie .ed-r[data-i="2"] .ed-x');await p.waitForTimeout(100);
await p.click('#pzEdOv .ed-s');await p.waitForTimeout(700);
const nu2=(await p.evaluate(()=>JSON.parse(localStorage.getItem('pzUser'))) ).find(x=>x.id===nu.id);
ok(nu2&&nu2.n==='PIAZZALE DEI TEST'&&nu2.t==='piazzale'&&nu2.v.length===2&&nu2.ts>=nu.ts,'piazza tua modificata: '+JSON.stringify(nu2));
/* eliminata: non torna dal cloud */
await p.evaluate(id=>pzElimina(id),nu.id);await p.waitForTimeout(400);
await p.evaluate(()=>[...document.querySelectorAll('#popOv .pop-b')].find(x=>!/^Annulla$/.test(x.textContent.trim())).click());await p.waitForTimeout(500);
S=await p.evaluate(id=>({u:JSON.parse(localStorage.getItem('pzUser')||'[]').some(x=>x.id===id),t:JSON.parse(localStorage.getItem('pzTolte'))['u:'+id]}),nu.id);
ok(!S.u&&S.t>0,'eliminata: '+JSON.stringify(S));
await p.evaluate(x=>{const u=JSON.parse(localStorage.getItem('pzUser')||'[]');u.push(x);localStorage.setItem('pzUser',JSON.stringify(u));},nu2);
ok(!(await p.evaluate(id=>JSON.parse(localStorage.getItem('pzUser')||'[]').some(x=>x.id===id),nu.id)),'la piazza eliminata e\' tornata dal cloud');
/* ── dal cloud: vince la modifica piu' recente ── */
S=await p.evaluate(()=>{
  const l=JSON.parse(localStorage.getItem('pzEdit')).pz11;
  const n1=nccPzDalCloud({pzEdit:{pz11:{v:['VECCHIA'],ts:l.ts-1000}}});
  const dopo1=JSON.parse(localStorage.getItem('pzEdit')).pz11.v[0];
  const n2=nccPzDalCloud({pzEdit:{pz11:{v:['DAL TELEFONO','ALTRA'],ts:l.ts+1000},pz12:{v:['X'],ts:5}},pzTolte:{'c:pz11_1':Date.now()+1e8}});
  const e=JSON.parse(localStorage.getItem('pzEdit'));
  return {n1,dopo1,n2,v:e.pz11.v,pz12:e.pz12,co1:!!JSON.parse(localStorage.getItem('pzCoords')).pz11_1};});
ok(S.n1===0&&S.dopo1==='Via Regina Margherita (lato pari)'&&S.n2>=3&&JSON.stringify(S.v)==='["DAL TELEFONO","ALTRA"]'&&S.pz12&&!S.co1,'dal cloud: '+JSON.stringify(S));
/* ── di fretta: doppio tocco, indietro mentre sale, riaperta mentre scende, Salva due volte ── */
const det=async()=>{await p.evaluate(()=>{const x=document.getElementById('pzEdOv');if(x)x.remove();try{nccChiudiPopup();}catch(e){}openPiazze();});await p.waitForTimeout(300);
  await p.evaluate(()=>[...document.querySelectorAll('#pzList .pz-row')].find(x=>/5 GIORNATE/.test(x.textContent)).click());await p.waitForTimeout(450);};
const fermo=()=>p.evaluate(()=>{const o=document.querySelectorAll('#pzEdOv');const e=o[0];
  return {n:o.length,su:!!(e&&e.classList.contains('su')),tr:e?getComputedStyle(e).transform:'-',det:!!document.querySelector('#pzOv #pzMetro'),lista:!!document.querySelector('#pzOv #pzList'),pe:!!nccPzEdStato()};});
const btnMod='[...document.querySelectorAll("#pzOv .pz-azioni button")].find(x=>/Modifica/.test(x.textContent))';
await det();
await p.evaluate(b=>{const x=eval(b);x.click();setTimeout(()=>{const y=eval(b);if(y)y.click();},70);},btnMod);await p.waitForTimeout(900);
S=await fermo();ok(S.n===1&&S.su&&S.pe,'doppio tocco su Modifica: '+J(S));
await p.goBack().catch(()=>{});await p.waitForTimeout(700);S=await fermo();
ok(S.n===0&&S.det&&!S.pe,'doppio tocco, poi indietro: '+J(S));
for(const ms of [40,140,260]){
  await det();
  await p.evaluate(b=>eval(b).click(),btnMod);await p.waitForTimeout(ms);await p.goBack().catch(()=>{});await p.waitForTimeout(800);
  S=await fermo();ok(S.n===0&&S.det&&!S.pe,'indietro a '+ms+' ms mentre sale: '+J(S));
}
await det();
await p.evaluate(()=>pzModifica());await p.waitForTimeout(600);
await p.evaluate(()=>{nccPzEdAnnulla();setTimeout(()=>pzModifica(),120);});await p.waitForTimeout(900);
S=await fermo();ok(S.n===1&&S.su&&S.pe,'riaperta mentre scende: '+J(S));
await p.evaluate(()=>{nccPzEdSalva();nccPzEdSalva();});await p.waitForTimeout(800);
S=await fermo();ok(S.n===0&&S.det&&!S.pe,'Salva due volte: '+J(S));
await p.evaluate(()=>pzModifica());await p.waitForTimeout(600);
await p.goBack().catch(()=>{});await p.waitForTimeout(90);await p.goBack().catch(()=>{});await p.waitForTimeout(900);
S=await fermo();ok(S.n===0&&!S.pe&&(S.lista||S.det),'doppio indietro: '+J(S));
ok(!(await p.evaluate(()=>window.__prompt)),'la finestrella del browser e\' comparsa');
ok(!errors.length,'errori: '+errors.join(' | '));
await p.context().close();

/* ── iPad e PC scuro: la colonna al centro, la scheda intera ── */
for(const [nome,vp,o] of [['iPad',{width:1024,height:768},{touch:true}],['PC scuro',{width:1280,height:800},{dark:true}],['320',{width:320,height:640},{touch:true,mobile:true}]]){
  const r=await boot(b,Object.assign({clock:false,bootMs:5000,viewport:vp},o));
  await r.page.evaluate(()=>{openPiazze();});await r.page.waitForTimeout(300);
  await r.page.evaluate(()=>[...document.querySelectorAll('#pzList .pz-row')].find(x=>/5 GIORNATE/.test(x.textContent)).click());await r.page.waitForTimeout(300);
  await r.page.evaluate(()=>pzModifica());await r.page.waitForTimeout(700);
  const g=await r.page.evaluate(()=>{const o=document.getElementById('pzEdOv').getBoundingClientRect(),c=document.querySelector('#pzEdOv .pe-col').getBoundingClientRect(),
    i=document.querySelector('#pzEdVie .ed-in').getBoundingClientRect(),x=document.querySelector('#pzEdVie .ed-x').getBoundingClientRect();
    return {o:[o.width,o.height],sx:Math.round(c.left),dx:Math.round(innerWidth-c.right),in:Math.round(i.width),xr:Math.round(innerWidth-x.right),sc:document.documentElement.scrollWidth<=innerWidth};});
  console.log(nome,JSON.stringify(g));
  ok(g.o[0]===vp.width&&g.o[1]===vp.height&&Math.abs(g.sx-g.dx)<=1&&g.in>=110&&g.xr>=8&&g.sc,nome+': '+JSON.stringify(g));
  ok(!r.errors.length,nome+' errori: '+r.errors.join(' | '));
  await r.page.context().close();
}
console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
