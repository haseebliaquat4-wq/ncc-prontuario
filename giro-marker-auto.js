/* I MARKER LI METTE L'APP (v150), con un OpenStreetMap finto (la citta' finta di citta-finta.js), a tempo reale.
   · il giro parte da solo: i percorsi senza marker li prendono tutti, ognuno sulla via giusta (uguale al motore in Node)
   · una via che non c'e' sulla mappa: punto di domanda fra le vicine, e prima la seconda occhiata li' vicino
   · i marker messi a mano non si toccano; «OPPURE» non prende marker
   · sulla mappa: il marker col punto di domanda (❓, bordo tratteggiato), «È giusto qui» lo conferma, trascinarlo lo fa tuo
   · nell'elenco: ❓ sulla tappa da controllare; in fondo, in Studio, l'alternativa del libro
   · Topografia: «Marker da controllare» col numero, la sua pagina, il percorso si apre sulla tappa giusta, indietro torna alla pagina
   · la sincronizzazione tiene il segno (auto) e il punto di domanda; togliere il punto di domanda e' una modifica da mandare
   · i percorsi del libro (una volta sola): i tuoi a meta' prendono tutte le vie, quelli coi marker si allungano solo se
     i marker trovano posto, quelli fatti da te restano, i mancanti si aggiungono, i cancellati non tornano
   · (v151) quello col tuo marker su una via fuori dal libro resta tuo ed e' lui il percorso del libro: niente «lib_»
     accanto; lo stesso percorso stampato su due pagine (pag. 80 e 108) si aggiunge una volta sola */
const {launch,boot}=require('./lib');const fs=require('fs');
const M=require('./motore-da-addon.js')(),G=require('./citta-finta.js')(M),OP=require('./overpass-finto.js');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const ELS=Object.keys(G).map(k=>G[k]);
const TAPPE=['P.ZA DUOMO','VIA MENGONI','LARGO SANTA MARGHERITA','VIA S.PROTASO','VIA PORRONE','VIA SAN PROSPERO','VIA DANTE',
'P.ZA CORDUSIO','VIA OREFICI','VIA MAZZINI','L.GO BORGES','VIA MAZZINI','P.ZA MISSORI','C.SO DI PORTA ROMANA',
'P.ZA SAN NAZZARRO IN BROLO','C.SO DI PORTA ROMANA','LARGO CROCETTA','C.SO DI PORTA ROMANA',"P.LE MEDAGLIE D'ORO",
'C.SO LODI','P.ZA BUOZZI','C.SO LODI','P.LE LODI','CAVALCAVIA SAN LUIGI','C.SO LODI','P.LE CORVETTO','VIA MARTINENGO',
'VIA BONCOMPAGNI','VIA TOFFETTI','P.ZA MISTRAL','VIA CASSINIS (STAZ.ROGOREDO)'];
function film(p,ms,step){return p.evaluate(([ms,step])=>new Promise(res=>{const o=[],t0=performance.now();
  (function f(){o.push(document.getElementById('scnOv')?(document.getElementById('scnOv').getAttribute('data-p')||'?'):(document.body.classList.contains('on-topo')?'mappa':'home'));
  if(performance.now()-t0<ms)requestAnimationFrame(f);else res(o);})();}),[ms,step]);}
function compatta(f){const o=[];f.forEach(x=>{if(!o.length||o[o.length-1]!==x)o.push(x);});return o;}
(async()=>{
const b=await launch();
/* ════ 1 · il giro dei marker ════ */
const dom=[];let rotti=1;   /* la prima domanda va male (server giu'): deve riprovare da solo */
const routes=[
  {id:'a1',title:'DUOMO - STAZ.ROGOREDO',steps:TAPPE},
  {id:'a2',title:'CON UNA VIA CHE NON C\'E\'',steps:['VIA S.PROTASO','VIA INVENTATA','VIA SAN PROSPERO','VIA DANTE']},
  {id:'a3',title:'COI MIEI MARKER',steps:['VIA TOFFETTI','P.ZA MISTRAL','VIA CASSINIS','STAZ. ROGOREDO']},
  {id:'a4',title:'CON OPPURE',steps:['VIA MARTINENGO','VIA BONCOMPAGNI','OPPURE','VIA TOFFETTI'],alt:[{s:['VIA ALTRA','VIA ANCORA'],e:1}]}
];
const mio0=M.ll([2300,-2700]),mio1=M.ll([2545,-2760]);
const coords={a3_0:{lat:+mio0[0].toFixed(6),lon:+mio0[1].toFixed(6)},a3_1:{lat:+mio1[0].toFixed(6),lon:+mio1[1].toFixed(6)}};
let {page:p,errors}=await boot(b,{clock:false,auto:true,pausaOverpass:0,bootMs:1500,extra:{routes,coords},
  overpass:route=>{const q=decodeURIComponent((route.request().postData()||'').replace(/^data=/,'').replace(/\+/g,'%20'));dom.push(q);
    if(rotti>0){rotti--;return route.fulfill({status:504,contentType:'text/plain',body:'Gateway Timeout'});}
    let j;try{j=OP.rispondi(q,ELS);}catch(e){fails.push('overpass finto: '+e.message+' · '+q.slice(0,200));j={osm3s:{},elements:[]};}
    route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(j)});}});
await p.evaluate(()=>{window.__toast=[];const _t=toast2;toast2=function(m){window.__toast.push(String(m));return _t.apply(this,arguments);};});
let st=null;const t0=Date.now();
for(let i=0;i<120;i++){await p.waitForTimeout(250);st=await p.evaluate(()=>window.nccMarkerAuto&&nccMarkerAuto.stato());if(st&&!st.inizio&&!st.da&&dom.length)break;}
console.log('giro finito in',Date.now()-t0,'ms · domande',dom.length,JSON.stringify(st));
ok(st&&!st.inizio&&st.da===0,'il giro non finisce: '+JSON.stringify(st));
ok(dom.length>=3&&dom.length<=7,'domande a OpenStreetMap: '+dom.length);
ok(dom[0]===dom[1],'dopo l\'errore non ha riprovato la stessa domanda');
ok(dom.some(q=>/around:/.test(q)),'la seconda occhiata (vicino) non c\'e\'');
const C=await p.evaluate(()=>JSON.parse(JSON.stringify(coords)));
/* a1: tutte le tappe, uguali al motore in Node, col segno auto */
const atteso=M.risolvi(TAPPE.map(M.analizza),M.elementiInCose(ELS),null).pos;
let diversi=[];
TAPPE.forEach((t,i)=>{const c=C['a1_'+i];if(!c||c.q||!c.auto){diversi.push(i+' '+t+' '+JSON.stringify(c));return;}
  const d=M.dist(M.xy([c.lat,c.lon]),M.xy(atteso[i].ll));if(d>1.5)diversi.push(i+' '+t+' '+Math.round(d)+' m');});
ok(!diversi.length,'a1 diverse dal motore: '+diversi.join(' | '));
/* a2: la via inventata col punto di domanda, fra le vicine */
const q2=C.a2_1;
ok(q2&&q2.q===1&&q2.auto===1,'a2: punto di domanda '+JSON.stringify(q2));
if(q2&&C.a2_0&&C.a2_2){const a=M.xy([C.a2_0.lat,C.a2_0.lon]),bb=M.xy([C.a2_2.lat,C.a2_2.lon]),c=M.xy([q2.lat,q2.lon]);
  ok(M.dist(a,c)+M.dist(c,bb)<M.dist(a,bb)+3,'a2: il punto di domanda non sta fra le vicine');}
ok(C.a2_0&&!C.a2_0.q&&C.a2_2&&!C.a2_2.q&&C.a2_3&&!C.a2_3.q,'a2: le altre trovate');
/* a3: i miei marker restano com'erano, le altre si attaccano */
ok(JSON.stringify({lat:C.a3_0.lat,lon:C.a3_0.lon})===JSON.stringify(coords.a3_0)&&!C.a3_0.auto&&!C.a3_0.q,'a3: il mio marker 0 e\' cambiato '+JSON.stringify(C.a3_0));
ok(JSON.stringify({lat:C.a3_1.lat,lon:C.a3_1.lon})===JSON.stringify(coords.a3_1)&&!C.a3_1.auto,'a3: il mio marker 1 e\' cambiato');
ok(C.a3_2&&C.a3_2.auto&&!C.a3_2.q&&C.a3_3&&C.a3_3.auto&&!C.a3_3.q,'a3: le altre due '+JSON.stringify([C.a3_2,C.a3_3]));
if(C.a3_3)ok(M.dist(M.xy([C.a3_3.lat,C.a3_3.lon]),M.xy([G.rogoredo.lat,G.rogoredo.lon]))<5,'a3: la stazione dei treni');
/* a4: OPPURE senza marker */
ok(!C.a4_2&&C.a4_0&&C.a4_1&&C.a4_3,'a4: OPPURE '+JSON.stringify([C.a4_0,C.a4_1,C.a4_2,C.a4_3].map(x=>!!x)));
const T=await p.evaluate(()=>window.__toast);console.log('avvisi',JSON.stringify(T));
ok(T.some(x=>/Metto i marker a 4 percorsi/.test(x))&&T.some(x=>/Marker messi: \d+ · ❓ 1 da controllare/.test(x)),'avvisi: '+JSON.stringify(T));
/* rifare il giro non rifa' niente (nessuna domanda nuova) */
const n0=dom.length;await p.evaluate(()=>nccMarkerAuto.avvia());await p.waitForTimeout(1500);
ok(dom.length===n0,'il giro ripartito ha richiesto di nuovo: '+(dom.length-n0));

/* senza rete non chiede niente; tornata la rete, i marker del percorso nuovo arrivano da soli */
await p.context().setOffline(true);await p.waitForTimeout(200);
const n1=dom.length;
await p.evaluate(()=>{routes.push({id:'a5',title:'NUOVO SENZA RETE',steps:['VIA TOFFETTI','P.ZA MISTRAL','VIA CASSINIS']});save();nccMarkerAuto.avvia();});
await p.waitForTimeout(1500);
ok(dom.length===n1&&!(await p.evaluate(()=>!!coords.a5_0)),'senza rete ha chiesto o messo qualcosa');
await p.context().setOffline(false);
for(let i=0;i<40;i++){await p.waitForTimeout(250);if(await p.evaluate(()=>!!(coords.a5_0&&coords.a5_1&&coords.a5_2)))break;}
ok(await p.evaluate(()=>!!(coords.a5_0&&coords.a5_1&&coords.a5_2&&!coords.a5_1.q)),'tornata la rete: i marker del percorso nuovo non arrivano');

/* ════ 2 · sulla mappa e nell'elenco ════ */
await p.evaluate(()=>{goTopografia();selectRoute(routes.filter(r=>r.id==='a2')[0]);setMode('s');});await p.waitForTimeout(700);
let L=await p.evaluate(()=>[...document.querySelectorAll('#sList .sr .cb')].map(c=>c.textContent+(c.classList.contains('q')?'q':'')));
console.log('elenco a2',L.join(' '));
ok(L[1]==='❓q'&&L[0]==='📍'&&L[2]==='📍','elenco: '+L.join(' '));
await p.evaluate(()=>{step=1;syncListActive();updateUI();goStep();});await p.waitForTimeout(500);
let mk=await p.evaluate(()=>({cl:mkr&&mkr.getElement().className,em:mkr&&mkr.getElement().querySelector('.pin-emoji').textContent,pop:mkr&&mkr.getPopup().getContent()}));
ok(/mk-q/.test(mk.cl)&&mk.em==='❓'&&/È giusto qui/.test(mk.pop)&&/VIA INVENTATA/.test(mk.pop),'marker col punto di domanda: '+JSON.stringify(mk));
/* passando alla tappa dopo il punto di domanda se ne va */
await p.evaluate(()=>{step=2;syncListActive();updateUI();goStep();});await p.waitForTimeout(500);
mk=await p.evaluate(()=>({cl:mkr.getElement().className,em:mkr.getElement().querySelector('.pin-emoji').textContent,pop:mkr.getPopup().getContent()}));
ok(!/mk-q/.test(mk.cl)&&mk.em==='📍'&&!/giusto qui/.test(mk.pop),'tappa normale: '+JSON.stringify(mk));
/* «È giusto qui» */
await p.evaluate(()=>{step=1;syncListActive();updateUI();goStep();});await p.waitForTimeout(400);
await p.evaluate(()=>nccMarkerOk('a2_1'));await p.waitForTimeout(300);
let r2=await p.evaluate(()=>({c:coords.a2_1,em:mkr.getElement().querySelector('.pin-emoji').textContent,cl:mkr.getElement().className,
  cb:document.querySelectorAll('#sList .sr .cb')[1].textContent,sosp:nccMarkerInSospeso()}));
ok(!r2.c.q&&r2.c.auto===1&&r2.em==='📍'&&!/mk-q/.test(r2.cl)&&r2.cb==='📍','È giusto qui: '+JSON.stringify(r2));
ok(r2.sosp.indexOf('a2_1')>=0,'togliere il punto di domanda non va mandato al cloud: '+JSON.stringify(r2.sosp));
/* trascinato: diventa mio */
await p.evaluate(()=>{coords.a2_1.q=1;save();renderList();goStep();});await p.waitForTimeout(300);
await p.evaluate(()=>{const ll=mkr.getLatLng();mkr.setLatLng([ll.lat+0.0003,ll.lng]);mkr.fire('dragend');});await p.waitForTimeout(300);
r2=await p.evaluate(()=>({c:coords.a2_1,em:mkr.getElement().querySelector('.pin-emoji').textContent,cb:document.querySelectorAll('#sList .sr .cb')[1].textContent}));
ok(!r2.c.q&&!r2.c.auto&&r2.em==='📍'&&r2.cb==='📍','trascinato: '+JSON.stringify(r2));
/* l'alternativa del libro: in Studio si', in Cieco no */
await p.evaluate(()=>{selectRoute(routes.filter(r=>r.id==='a4')[0]);setMode('s');});await p.waitForTimeout(500);
let alt=await p.evaluate(()=>{const a=document.getElementById('slAlt');return a?a.textContent:null;});
ok(alt&&/Oppure, nel libro/.test(alt)&&/VIA ALTRA → VIA ANCORA/.test(alt)&&/poi come sopra/.test(alt),'alternativa: '+alt);
await p.evaluate(()=>setMode('c'));await p.waitForTimeout(300);
ok(!(await p.evaluate(()=>!!document.getElementById('slAlt'))),'alternativa visibile in Cieco');
await p.evaluate(()=>setMode('s'));
/* la sincronizzazione tiene auto e punto di domanda */
const sy=await p.evaluate(()=>{const k='a1_0',c=coords[k];const n=nccUnisciMarker({coords:{[k]:{lat:c.lat+0.0001,lon:c.lon,t:Date.now()+1e7,auto:1,q:1}}});return {n,c:coords[k]};});
ok(sy.n===1&&sy.c.auto===1&&sy.c.q===1,'sincronizzazione: '+JSON.stringify(sy));

/* ════ 3 · Topografia: Marker da controllare ════ */
await p.evaluate(()=>{nccMarkerOk('a1_0');coords.a1_5.q=1;coords.a2_1.q=1;save();goHome();});await p.waitForTimeout(500);
await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(600);
let riga=await p.evaluate(()=>{const r=document.querySelector('#scnOv .qc-riga[onclick*="\'t16\'"]');return r?r.textContent:null;});
console.log('riga',riga);
ok(riga&&/Marker da controllare2/.test(riga.replace(/\s+/g,''))||/Marker da controllare\s*2/.test(riga||''),'riga Topografia: '+riga);
let f=await film(p,900,0);
await p.evaluate(()=>document.querySelector('#scnOv .qc-riga[onclick*="\'t16\'"]').click());
f=compatta(await film(p,900,0));
let pg=await p.evaluate(()=>({p:document.getElementById('scnOv').getAttribute('data-p'),t:document.getElementById('scnBody').textContent}));
console.log('pagina',pg.p,'·',pg.t.slice(0,160));
ok(pg.p==='dubbi'&&/DUOMO - STAZ.ROGOREDO1 su 31 tappe da controllare/.test(pg.t)&&/CON UNA VIA CHE NON C'E'1 su 4 tappe da controllare/.test(pg.t),'pagina dubbi: '+pg.t.slice(0,300));
ok(f.every(x=>x==='dubbi'||x==='topo'),'film entrata pagina: '+f.join(' → '));
/* un tocco: il percorso si apre sulla tappa da controllare */
await p.evaluate(()=>[...document.querySelectorAll('#scnBody .sc-r')].find(b=>/DUOMO - STAZ/.test(b.textContent)).click());
f=compatta(await film(p,1400,0));
const ap=await p.evaluate(()=>({id:cur&&cur.id,step,topo:document.body.classList.contains('on-topo'),pag:!!document.getElementById('scnOv')}));
console.log('aperto',JSON.stringify(ap),'film',f.join(' → '));
ok(ap.id==='a1'&&ap.step===5&&ap.topo&&!ap.pag,'apri dalla pagina: '+JSON.stringify(ap));
ok(!f.includes('home'),'la Home di passaggio: '+f.join(' → '));
/* ‹ dalla mappa: si torna alla pagina da cui sei entrato, senza la Home di passaggio */
await p.evaluate(()=>{const b=document.getElementById('tpBack');if(b)b.click();else goHome();});
f=compatta(await film(p,900,0));
let dopo=await p.evaluate(()=>{const s=document.getElementById('scnOv');return s?s.getAttribute('data-p'):null;});
console.log('‹ dalla mappa',dopo,'film',f.join(' → '));
ok(dopo==='dubbi','‹ dalla mappa aperta da Marker da controllare: '+dopo);
ok(!f.includes('home'),'‹ dalla mappa: la Home di passaggio: '+f.join(' → '));
/* indietro dalla sotto-pagina: si torna a Topografia */
await p.goBack().catch(()=>{});await p.waitForTimeout(900);
dopo=await p.evaluate(()=>{const s=document.getElementById('scnOv');return s?s.getAttribute('data-p'):null;});
ok(dopo==='topo','indietro da Marker da controllare: '+dopo);
/* lo stesso da Senza marker */
await p.evaluate(()=>{routes.push({id:'z9',title:'ZETA SENZA',steps:['VIA ZETA UNO','VIA ZETA DUE']});save();nccSenzaMarker();});await p.waitForTimeout(600);
await p.evaluate(()=>[...document.querySelectorAll('#scnBody .sc-r')].find(b=>/ZETA SENZA/.test(b.textContent)).click());
f=compatta(await film(p,1400,0));
const ap2=await p.evaluate(()=>({id:cur&&cur.id,topo:document.body.classList.contains('on-topo'),pag:!!document.getElementById('scnOv')}));
ok(ap2.id==='z9'&&ap2.topo&&!ap2.pag&&!f.includes('home'),'Senza marker → mappa: '+JSON.stringify(ap2)+' '+f.join(' → '));
await p.evaluate(()=>{const b=document.getElementById('tpBack');if(b)b.click();else goHome();});await p.waitForTimeout(900);
dopo=await p.evaluate(()=>{const s=document.getElementById('scnOv');return s?s.getAttribute('data-p'):null;});
ok(dopo==='senza','‹ dalla mappa aperta da Senza marker: '+dopo);
ok(!errors.length,'errori: '+errors.join(' | '));
await p.close();

/* ════ 4 · i percorsi del libro ════ */
const vecchi=JSON.parse(fs.readFileSync(__dirname+'/../percorsi-data.js','utf8').replace(/^[\s\S]*?window\.__PERCORSI_PDF__=/,'').replace(/;\s*$/,''));
const lib=id=>vecchi.filter(x=>x.id===id)[0];
const p90=lib('p90a'),p95=lib('p95a'),p92=lib('p92a'),p91=lib('p91a');
const R2=[
  {id:'u1',title:'DUOMO - STAZ. SAN CRISTOFORO',steps:p90.s.slice(0,21)},                         /* la meta' sinistra */
  {id:'u2',title:'P.LE LOTTO - P.ZA ABBIATEGRASSO',steps:p95.s.slice(0,12)},                       /* coi marker sulle prime tre */
  {id:'u3',title:'P.ZA TIRANA P.LE LOTTO',steps:p92.s.concat(['OPPURE']).concat(p92.a[0].s)},   /* col suo OPPURE dentro */
  {id:'u4',title:'VIA PAOLO SARPI - POLICLINICO',steps:['VIA X','VIA Y','VIA Z']},                 /* stesso nome, strada mia */
  {id:'u5',title:'P.ZA FONTANA - OSP. BUZZI (strada 1)',steps:p91.s.slice(0,10)},                   /* divisa a mano */
  {id:'u6',title:'STAZ. SAN CRISTOFORO - DUOMO',steps:['VIA TUTTA MIA'].concat(lib('p90b').s.slice(0,5))},   /* un mio marker su una via che nel libro non c'e' */
  {id:'u7',title:'P.LE MACIACHINI - L.GO AGOSTO',steps:lib('p96a').s.concat(['OPPURE']).concat(lib('p96a').a[0].s).concat(['ECC.'])}   /* il nome col refuso, l'OPPURE dentro */
];
const C2={u2_0:{lat:45.47,lon:9.15},u2_1:{lat:45.471,lon:9.151},u2_2:{lat:45.472,lon:9.152},u6_0:{lat:45.45,lon:9.17}};
const qS={u1:{correct:1,total:3,wrong:{'5':2,'20':1}}};
({page:p,errors}=await boot(b,{clock:false,libro:true,bootMs:1500,extra:{routes:R2,coords:C2,qStats:qS,rDel:{lib_p1a:Date.now()}}}));
await p.evaluate(()=>{window.__toast=[];const _t=toast2;toast2=function(m){window.__toast.push(String(m));return _t.apply(this,arguments);};});
await p.waitForTimeout(7000);
const S=await p.evaluate(()=>({n:routes.length,R:routes.filter(r=>/^u/.test(r.id)).map(r=>({id:r.id,t:r.title,n:r.steps.length,pdf:r.pdf||null,alt:r.alt?r.alt.length:0,s:r.steps})),
  lib:routes.filter(r=>/^lib_/.test(r.id)).map(r=>({id:r.id,t:r.title})),C:JSON.parse(JSON.stringify(coords)),q:qStats.u1,toast:window.__toast,ver:localStorage.getItem('nccLibroVer')}));
const U=id=>S.R.filter(r=>r.id===id)[0];
console.log('libro:',S.n,'percorsi ·',S.lib.length,'aggiunti ·',JSON.stringify(S.toast));
ok(U('u1').n===p90.s.length&&U('u1').pdf==='p90a'&&JSON.stringify(U('u1').s)===JSON.stringify(p90.s),'u1 non completato: '+JSON.stringify(U('u1')).slice(0,200));
ok(U('u2').n===p95.s.length&&U('u2').pdf==='p95a'&&S.C.u2_0&&S.C.u2_1&&S.C.u2_2&&S.C.u2_0.lat===45.47,'u2 non allungato coi suoi marker: '+JSON.stringify([U('u2').n,S.C.u2_0]));
ok(U('u3').n===p92.s.length&&U('u3').alt===1&&!U('u3').s.some(x=>/OPPURE/.test(x)),'u3: '+JSON.stringify(U('u3')).slice(0,200));
ok(JSON.stringify(U('u4').s)==='["VIA X","VIA Y","VIA Z"]'&&!U('u4').pdf,'u4 toccato');
ok(U('u5').n===10&&!U('u5').pdf,'u5 (strada 1) toccato');
ok(U('u6').n===6&&S.C.u6_0&&S.C.u6_0.lat===45.45&&U('u6').pdf==='p90b','u6 (marker mio su una via fuori dal libro) toccato: '+JSON.stringify(U('u6')).slice(0,120));
ok(S.lib.some(r=>r.id==='lib_p93a'&&r.t==='VIA PAOLO SARPI - POLICLINICO (pag. 93)'),'p93a accanto al mio, con la pagina');
ok(!S.lib.some(r=>r.id==='lib_p90b'),'p90b: u6 resta mio ed e\' lui quello del libro, niente doppio accanto');
ok(S.lib.some(r=>r.id==='lib_p80b')&&!S.lib.some(r=>r.id==='lib_p108b'),'pag. 80 e 108 (lo stesso percorso): uno solo');
ok(!S.lib.some(r=>r.id==='lib_p1a'),'p1a cancellato e tornato');
ok(!S.lib.some(r=>r.id==='lib_p90a'||r.id==='lib_p95a'||r.id==='lib_p92a'),'doppioni dei miei');
ok(S.lib.length===208-5-1-1,'aggiunti: '+S.lib.length);
ok(U('u7').n===lib('p96a').s.length&&U('u7').pdf==='p96a'&&U('u7').alt===1&&U('u7').t==='P.LE MACIACHINI - L.GO AGOSTO','u7 (nome col refuso): '+JSON.stringify(U('u7')).slice(0,160));
ok(!S.lib.some(r=>r.id==='lib_p96a'),'p96a aggiunto accanto a quello col refuso');
/* gli errori del Quiz vie seguono la loro via */
ok(S.q&&S.q.wrong&&S.q.wrong['5']===2&&S.q.wrong['20']===1,'errori del quiz spostati: '+JSON.stringify(S.q));
ok(S.toast.some(x=>/Percorsi del libro: 201 aggiunti · 4 completati con tutte le vie/.test(x)),'avviso: '+JSON.stringify(S.toast));
ok(S.ver==='4','versione del libro: '+S.ver);
ok(S.R.filter(r=>/^u[1237]$/.test(r.id)).length===4&&(await p.evaluate(()=>routes.filter(r=>/^u[1237]$/.test(r.id)||/^lib_/.test(r.id)).every(r=>r.libV===4))),'il segno libV manca');
/* riaperta: non rifa' niente (nessun avviso) */
await p.evaluate(()=>{const r=routes.find(x=>x.id==='lib_p92b');r.steps=r.steps.slice(0,-1);r.title='P.ZA SICILIA - S.CRISTOFORO CORRETTO DA ME';save();});   /* corretto da me */
await p.reload({waitUntil:'load'});
await p.evaluate(()=>{window.__toast=[];const _t=toast2;toast2=function(m){window.__toast.push(String(m));return _t.apply(this,arguments);};});
await p.waitForTimeout(7500);
let R3=await p.evaluate(()=>({n:routes.length,t:window.__toast,cor:routes.find(x=>x.id==='lib_p92b')}));
ok(R3.n===S.n&&!R3.t.some(x=>/Percorsi del libro/.test(x)),'riaperta: '+S.n+' → '+R3.n+' '+JSON.stringify(R3.t));
ok(R3.cor&&R3.cor.title==='P.ZA SICILIA - S.CRISTOFORO CORRETTO DA ME'&&R3.cor.steps.length===lib('p92b').s.length-1,'il percorso corretto da me e\' tornato come nel libro');
/* un dispositivo rimasto alla versione vecchia riscrive i percorsi di prima: all'avvio dopo si rimette a posto */
await p.evaluate(R=>{routes=R;save();},R2);
await p.reload({waitUntil:'load'});
await p.evaluate(()=>{window.__toast=[];const _t=toast2;toast2=function(m){window.__toast.push(String(m));return _t.apply(this,arguments);};});
await p.waitForTimeout(7500);
R3=await p.evaluate(()=>({n:routes.length,t:window.__toast,u1:routes.find(x=>x.id==='u1').steps.length,lib:routes.filter(r=>/^lib_/.test(r.id)).length}));
console.log('dopo la copia vecchia:',JSON.stringify(R3));
ok(R3.n===S.n&&R3.u1===p90.s.length&&R3.lib===201&&R3.t.some(x=>/201 aggiunti · 4 completati/.test(x)),'copia vecchia: non rimesso a posto '+JSON.stringify(R3));
/* cancellato un percorso preso dal libro (il mio, completato): non torna come «lib_» */
await p.evaluate(()=>delRoute('u1'));await p.waitForTimeout(500);
await p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click());await p.waitForTimeout(500);
const tomb=await p.evaluate(()=>JSON.parse(localStorage.getItem('rDel')||'{}'));
ok(tomb.u1&&tomb.lib_p90a,'lapidi: '+JSON.stringify(Object.keys(tomb)));
await p.reload({waitUntil:'load'});await p.waitForTimeout(7500);
R3=await p.evaluate(()=>({n:routes.length,u1:!!routes.find(x=>x.id==='u1'),lib:!!routes.find(x=>x.id==='lib_p90a'||x.pdf==='p90a')}));
ok(R3.n===S.n-1&&!R3.u1&&!R3.lib,'cancellato e tornato: '+JSON.stringify(R3));
ok(!errors.length,'errori libro: '+errors.join(' | '));
console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
