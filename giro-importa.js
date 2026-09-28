/* IMPORTA DAL PDF, a tempo reale.
   · tutti i percorsi del documento (208), con tutte le vie: pag. 17 prima la colonna di
     sinistra (P.ZA DUOMO … VIALE MONTELLO) e poi quella di destra (P.LE BAIAMONTI … VIA MAJORANA)
   · quello che hai gia' uguale non si vede; quello con lo stesso nome dice quante tappe ha il tuo
   · toccare una riga in fondo non riporta l'elenco in cima; la ricerca tiene la tastiera
   · Aggiungi: il nuovo si chiama «… (pag. 17)», il vecchio e i suoi marker restano com'erano,
     il nuovo non ha marker; dopo un ricarico restano fra quelli che hai
   · Correggi le tappe: in cima quelli con ancora OPPURE / ECC.
   · dalla pagina Topografia e ritorno: mai la Home o schermi vuoti di passaggio */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const VEDO=`window.__vedo=function(x,y){var e=document.elementFromPoint(x,y),c=e;
  while(c&&c!==document.body){if(c.id==='popOv')return 'popup';if(c.id==='ipOv')return 'importa';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');
    if(c.id==='homeScreen')return 'home';c=c.parentElement;}
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};`;
async function film(p,dur,x,y){const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(([x,y])=>__vedo(x,y),[x,y]);if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;}
const pulito=f=>!f.some(x=>/^vuoto|^home$/.test(x));
(async()=>{
  const b=await launch();
  /* nell'app: la meta' sinistra di DUOMO - OSP. NIGUARDA coi suoi marker, e la Cerchia dei Bastioni uguale ma col nome mio */
  const D0=await (async()=>{const t=await b.newPage();await t.goto('http://localhost:8765/percorsi-data.js');
    const s=await t.evaluate(()=>document.body.innerText);await t.close();const w={};new Function('window',s)(w);return w.__PERCORSI_PDF__;})();
  const p17=D0.find(x=>x.id==='p17a'),p2=D0.find(x=>x.id==='p2a');
  const meta=p17.s.slice(0,17),mc={};meta.forEach((_,i)=>{mc['vec_'+i]={lat:45.46+i/1000,lon:9.19+i/1000};});
  const seed=require('./lib').seed();
  const routes=seed.routes.concat([{id:'vec',title:'DUOMO - OSP. NIGUARDA',steps:meta},{id:'mia',title:'LA MIA CERCHIA',steps:p2.s.slice()}]);
  const coords=Object.assign({},seed.coords,mc);
  let {page:p,ctx,errors}=await boot(b,{clock:false,touch:true,mobile:true,extra:{routes,coords}});
  await p.addScriptTag({content:VEDO});
  /* ════ 1 · dalla pagina Topografia ════ */
  await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(900);
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>/Importa dal PDF/.test(r.textContent)).click());
  let f=await film(p,1200,195,500);console.log('Topografia → Importa',f.join(' → '));
  ok(f[f.length-1]==='importa'&&pulito(f),'apertura: schermo sbagliato di passaggio ('+f.join(' → ')+')');
  let st=await p.evaluate(()=>{const o=document.getElementById('ipOv');
    return {su:o.querySelector('.ip-su').textContent,sez:[...o.querySelectorAll('.ip-sez')].map(x=>x.textContent),righe:o.querySelectorAll('.ip-r').length,
      omo:[...o.querySelectorAll('.ip-sez+.ip-r,.ip-r')].slice(0,3).map(r=>r.querySelector('b').textContent+' | '+r.querySelector('i').textContent+' | '+((r.querySelector('.ip-nota')||{}).textContent||'')),
      mia:[...o.querySelectorAll('.ip-r b')].some(x=>x.textContent==='CERCHIA DEI BASTIONI')};});
  console.log(st.su,'|',st.sez.join(' | '),'| righe',st.righe);st.omo.forEach(x=>console.log('  ',x));
  ok(/^208 percorsi · 1 lo hai già$/.test(st.su),'testata: '+st.su);
  ok(st.righe===207,'righe: '+st.righe+' invece di 207');
  ok(!st.mia,'la Cerchia dei Bastioni che hai uguale (col tuo nome) si vede ancora');
  ok(/stesso nome · 3$/i.test(st.sez[0])&&/^Nuovi · 204$/i.test(st.sez[1]),'sezioni: '+st.sez.join(' | '));
  ok(st.omo.every(x=>/^DUOMO - OSP\. NIGUARDA \|.*\| Il tuo: 17 tappe$/.test(x)),'i tre DUOMO - OSP. NIGUARDA non dicono «Il tuo: 17 tappe»');
  /* le vie di pagina 17, nell'ordine della pagina */
  await p.evaluate(()=>document.querySelector('#ipr_p17a .ip-tx').click());await p.waitForTimeout(150);
  const vie=await p.evaluate(()=>[...document.querySelectorAll('#ipd_p17a .ip-det>div')].map(d=>d.childNodes[1].textContent));
  console.log('pag. 17:',vie.length,'vie ·',vie[0],'…',vie[16],'|',vie[17],'…',vie[29]);
  ok(vie.length===30&&vie[0]==='P.ZA DUOMO'&&vie[16]==='VIALE MONTELLO'&&vie[17]==='P.LE BAIAMONTI'&&vie[29]==='VIA MAJORANA (PRONTO SOCCORSO)','pag. 17: vie mancanti o in ordine sbagliato');
  await p.evaluate(()=>document.querySelector('#ipr_p17a .ip-tx').click());await p.waitForTimeout(100);
  ok(await p.evaluate(()=>!document.getElementById('ipd_p17a')),'pag. 17: le vie non si richiudono');
  /* ════ 2 · una riga in fondo: l'elenco resta dov'e' ════ */
  const sc=await p.evaluate(()=>{const b=document.getElementById('ipBody'),r=document.querySelectorAll('#ipBody .ip-r')[150];
    b.scrollTop=r.offsetTop-300;return {top:b.scrollTop,id:r.id};});
  await p.evaluate(id=>document.querySelector('#'+id+' .ip-chk').click(),sc.id);await p.waitForTimeout(250);
  let st2=await p.evaluate(id=>({top:document.getElementById('ipBody').scrollTop,sel:document.getElementById(id).classList.contains('sel'),
    piede:document.querySelector('#ipFoot .ip-go').textContent}),sc.id);
  console.log('riga 150: scroll',sc.top,'→',st2.top,'| scelta',st2.sel,'|',st2.piede);
  ok(Math.abs(st2.top-sc.top)<=2&&st2.sel&&/Aggiungi 1 percorso$/.test(st2.piede),'riga in fondo: l’elenco si sposta o la scelta non si vede '+JSON.stringify(st2));
  /* apro e chiudo le vie in fondo: l'elenco non salta in cima */
  await p.evaluate(id=>document.querySelector('#'+id+' .ip-tx').click(),sc.id);await p.waitForTimeout(150);
  st2=await p.evaluate(()=>document.getElementById('ipBody').scrollTop);ok(Math.abs(st2-sc.top)<=2,'aprire le vie in fondo riporta l’elenco in cima');
  await p.evaluate(id=>document.querySelector('#'+id+' .ip-tx').click(),sc.id);
  /* ════ 3 · la ricerca ════ */
  await p.tap('#ipCerca');await p.keyboard.type('niguarda',{delay:40});await p.waitForTimeout(450);
  let cr=await p.evaluate(()=>({righe:[...document.querySelectorAll('#ipBody .ip-r')].map(r=>r.id.slice(4)),foc:document.activeElement&&document.activeElement.id,top:document.getElementById('ipBody').scrollTop}));
  console.log('cerca «niguarda»:',cr.righe.join(' '),'| tastiera su',cr.foc);
  ok(cr.righe.length===11&&cr.righe.slice(0,3).join()==='p17a,p18a,p39b'&&cr.foc==='ipCerca'&&cr.top===0,'ricerca «niguarda» '+JSON.stringify(cr));
  await p.fill('#ipCerca','pag 96');await p.waitForTimeout(450);
  cr=await p.evaluate(()=>[...document.querySelectorAll('#ipBody .ip-r')].map(r=>r.id.slice(4)+' '+r.querySelector('i').textContent));
  console.log('cerca «pag 96»:',cr.join(' | '));ok(cr.length===1&&/^p96a .*da controllare/.test(cr[0]),'ricerca per pagina: '+cr.join(' | '));
  await p.evaluate(()=>document.querySelector('#ipr_p96a .ip-chk').click());
  await p.fill('#ipCerca','xyzxyz');await p.waitForTimeout(450);
  cr=await p.evaluate(()=>(document.querySelector('#ipBody .ip-vuoto')||{}).textContent);ok(/Nessun percorso con «xyzxyz»/.test(cr||''),'ricerca vuota: '+cr);
  await p.fill('#ipCerca','');await p.waitForTimeout(450);
  /* i tre tasti valgono per quelli che vedi */
  await p.evaluate(()=>[...document.querySelectorAll('#ipOv .ip-bt button')].find(x=>/puliti/.test(x.textContent)).click());await p.waitForTimeout(100);
  let pie=await p.evaluate(()=>document.querySelector('#ipFoot .ip-go').textContent);console.log('Solo i puliti:',pie);
  ok(/Aggiungi 165 percorsi$/.test(pie),'Solo i puliti: '+pie);
  await p.evaluate(()=>[...document.querySelectorAll('#ipOv .ip-bt button')].find(x=>/Nessuno/.test(x.textContent)).click());await p.waitForTimeout(100);
  pie=await p.evaluate(()=>({t:document.querySelector('#ipFoot .ip-go').textContent,off:document.querySelector('#ipFoot .ip-go').classList.contains('off'),sel:document.querySelectorAll('#ipBody .ip-r.sel').length}));
  ok(pie.off&&pie.sel===0,'Nessuno: '+JSON.stringify(pie));
  for(const id of ['p17a','p96a','p18a'])await p.evaluate(id=>document.querySelector('#ipr_'+id+' .ip-chk').click(),id);
  /* ════ 4 · Aggiungi ════ */
  const prima=await p.evaluate(()=>({n:routes.length,vec:JSON.stringify(routes.find(r=>r.id==='vec')),mk:JSON.stringify(Object.keys(coords).filter(k=>k.startsWith('vec_')).sort().map(k=>[k,coords[k]]))}));
  await p.evaluate(()=>document.querySelector('#ipFoot .ip-go').click());f=await film(p,600,195,700);
  const conf=await p.evaluate(()=>(document.querySelector('#popOv .pop-x')||{}).textContent||'');
  console.log('Aggiungi →',f.join(' → '),'|',conf.replace(/\s+/g,' '));
  ok(f[f.length-1]==='popup'&&/Aggiungo 3 percorsi/.test(conf)&&/DUOMO - OSP\. NIGUARDA \(pag\. 17\)/.test(conf)&&/marker restano vuoti/.test(conf),'conferma: '+conf);
  await p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click());f=await film(p,1300,195,300);
  console.log('Conferma →',f.join(' → '));ok(pulito(f)&&f[f.length-1]==='popup','dopo la conferma: '+f.join(' → '));
  const dopo=await p.evaluate(()=>{const n=routes.filter(r=>r.pdf);
    return {n:routes.length,nuovi:n.map(r=>({t:r.title,s:r.steps.length,pdf:r.pdf,mk:Object.keys(coords).filter(k=>k.startsWith(r.id+'_')).length})),
      vec:JSON.stringify(routes.find(r=>r.id==='vec')),mk:JSON.stringify(Object.keys(coords).filter(k=>k.startsWith('vec_')).sort().map(k=>[k,coords[k]])),
      avviso:(document.querySelector('#popOv .pop-x')||{}).textContent||'',su:document.querySelector('#ipOv .ip-su').textContent,
      righe:document.querySelectorAll('#ipOv .ip-r').length,ls:JSON.parse(localStorage.getItem('routes')).filter(r=>r.pdf).length};});
  console.log('aggiunti:',JSON.stringify(dopo.nuovi),'| elenco',dopo.su,dopo.righe,'righe');
  ok(dopo.n===prima.n+3&&dopo.ls===3,'non sono stati aggiunti 3 percorsi (salvati '+dopo.ls+')');
  ok(JSON.stringify(dopo.nuovi)===JSON.stringify([{t:'DUOMO - OSP. NIGUARDA (pag. 17)',s:30,pdf:'p17a',mk:0},{t:'DUOMO - OSP. NIGUARDA (pag. 18)',s:31,pdf:'p18a',mk:0},{t:'P.LE MACIACHINI - L.GO AUGUSTO',s:38,pdf:'p96a',mk:0}]),'nomi, tappe o marker dei nuovi sbagliati');
  ok(dopo.vec===prima.vec&&dopo.mk===prima.mk&&JSON.parse(dopo.mk).length===17,'il percorso vecchio o i suoi marker sono cambiati');
  ok(/Aggiunti 3 percorsi/.test(dopo.avviso),'avviso finale: '+dopo.avviso);
  ok(dopo.su==='208 percorsi · 4 li hai già'&&dopo.righe===204,'l’elenco dopo l’aggiunta: '+dopo.su+' / '+dopo.righe);
  await p.evaluate(()=>document.querySelector('#popOv .pop-b').click());await p.waitForTimeout(400);
  /* ════ 5 · ‹ torna alla pagina Topografia ════ */
  await p.evaluate(()=>document.querySelector('#ipOv .ip-x').click());f=await film(p,1200,195,500);
  console.log('‹ →',f.join(' → '));ok(f[f.length-1]==='pagina:topo'&&pulito(f),'‹ non torna alla pagina Topografia ('+f.join(' → ')+')');
  /* ════ 6 · Correggi le tappe: in cima quello con OPPURE ════ */
  await p.evaluate(()=>nccCorreggiElenco());await p.waitForTimeout(700);
  const cor=await p.evaluate(()=>({nota:document.querySelector('#scnOv .sc-nota').textContent,primo:document.querySelector('#scnOv .sc-r .pf-n').textContent,
    s:document.querySelector('#scnOv .sc-r .sc-s').textContent}));
  console.log('Correggi:',cor.nota,'| primo',cor.primo,'·',cor.s);
  ok(/^1 percorso ha ancora le alternative del PDF/.test(cor.nota)&&cor.primo==='P.LE MACIACHINI - L.GO AUGUSTO'&&/da controllare/.test(cor.s),'Correggi le tappe: '+JSON.stringify(cor));
  errors.forEach(e=>fails.push('JS '+e));
  /* ════ 7 · dopo un ricarico: restano, anche se li correggi ════ */
  await p.evaluate(()=>{const r=routes.find(x=>x.pdf==='p96a');r.steps=r.steps.filter(s=>!/OPPURE|ECC/.test(s));save();});
  await p.reload({waitUntil:'load'});await p.waitForTimeout(6500);
  await p.evaluate(()=>nccImportaPercorsi());await p.waitForTimeout(500);
  const ric=await p.evaluate(()=>({su:document.querySelector('#ipOv .ip-su').textContent,c:!!document.getElementById('ipr_p96a'),n:routes.filter(r=>r.pdf).length}));
  console.log('dopo il ricarico:',JSON.stringify(ric));ok(ric.su==='208 percorsi · 4 li hai già'&&!ric.c&&ric.n===3,'dopo il ricarico: '+JSON.stringify(ric));
  await p.screenshot({path:__dirname+'/importa-telefono.png'});
  errors.forEach(e=>fails.push('JS '+e));await ctx.close();
  /* ════ 8 · iPad in orizzontale e tema scuro: tutto in colonna, niente scorre di lato ════ */
  ({page:p,ctx,errors}=await boot(b,{clock:false,viewport:{width:1180,height:820},touch:true,mobile:true,dark:true,extra:{routes,coords}}));
  await p.evaluate(()=>nccImportaPercorsi());await p.waitForTimeout(500);
  await p.evaluate(()=>{document.querySelector('#ipr_p17a .ip-tx').click();document.querySelector('#ipr_p17a .ip-chk').click();});await p.waitForTimeout(200);
  const ip=await p.evaluate(()=>{const c=document.getElementById('ipCerca').getBoundingClientRect(),r=document.querySelector('#ipBody .ip-r').getBoundingClientRect(),o=document.getElementById('ipOv');
    const d=document.querySelector('#ipd_p17a .ip-det').getBoundingClientRect(),t=document.querySelector('#ipr_p17a .ip-tx').getBoundingClientRect();
    return {cL:Math.round(c.left),cW:Math.round(c.width),rL:Math.round(r.left),rW:Math.round(r.width),largo:o.scrollWidth<=o.clientWidth+1&&document.getElementById('ipBody').scrollWidth<=document.getElementById('ipBody').clientWidth+1,
      vie:[Math.round(d.left-t.left),Math.round(d.right-t.right)],fondo:getComputedStyle(o).backgroundColor,riga:getComputedStyle(document.querySelector('#ipr_p17a .ip-tx')).backgroundColor,
      testo:getComputedStyle(document.querySelector('#ipr_p17a .ip-tx b')).color};});
  console.log('iPad:',JSON.stringify(ip));ok(ip.cW<=560&&Math.abs(ip.cL-ip.rL)<=2&&ip.largo,'iPad: ricerca e righe non allineate o scorre di lato '+JSON.stringify(ip));
  ok(Math.abs(ip.vie[0])<=2&&Math.abs(ip.vie[1])<=2,'iPad: le vie aperte non stanno sotto la riga '+ip.vie);
  const luce=c=>{const m=c.match(/\d+/g).map(Number);return (m[0]*299+m[1]*587+m[2]*114)/1000;};
  ok(luce(ip.fondo)<60&&luce(ip.riga)<70&&luce(ip.testo)>180,'tema scuro: la finestra resta chiara '+ip.fondo+' '+ip.riga+' '+ip.testo);
  await p.screenshot({path:__dirname+'/importa-ipad.png'});
  errors.forEach(e=>fails.push('JS iPad '+e));await ctx.close();
  await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
