/* GIRO FASE 2 IPAD, a tempo reale: DISEGNA A MEMORIA e MAPPA MUTA.
   Entrata dalle pagine (niente Home di passaggio, la pagina resta sotto), disegno con la Pencil
   lungo il percorso giusto (tutte le tappe, nell'ordine), meta' percorso, un altro, col dito sul telefono;
   mappa muta: dieci tocchi (giusto e lontano), risultato, rigioca, uscita col ‹ e col tasto del telefono. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15';
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
async function apri(b,vp){
  const ctx=await b.newContext({viewport:vp,serviceWorkers:'block',hasTouch:true,userAgent:vp.width>=700?UA:undefined});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();
  await ctx.addInitScript(s=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(s.routes));localStorage.setItem('coords',JSON.stringify(s.coords));
    localStorage.setItem('ob1','true');localStorage.setItem('antiFretta','false');localStorage.setItem('wkRepTs',String(Date.now()));localStorage.setItem('azzerato2026',String(Date.now()));}},s);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(5500);
  await p.addScriptTag({content:`window.__vedo=function(){var e=document.elementFromPoint(innerWidth/2,innerHeight/2),c=e;
    while(c&&c!==document.body){if(c.id==='dmOv')return 'disegna';if(c.id==='mmOv')return 'muta';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');
      if(c.id==='popOv')return 'popup';if(c.id==='homeScreen')return 'home';c=c.parentElement;}return 'altro';};
    /* un tratto con la Pencil (o col dito) che passa per i punti dati, in coordinate dello schermo */
    window.__tratto=async function(punti,tipo){var a=document.getElementById('dmArea'),r=a.getBoundingClientRect();
      function ev(n,x,y){a.dispatchEvent(new PointerEvent(n,{pointerId:tipo==='pen'?2:1,pointerType:tipo,clientX:r.left+x,clientY:r.top+y,bubbles:true,cancelable:true,isPrimary:true,pressure:.5}));}
      ev('pointerdown',punti[0].x,punti[0].y);
      for(var i=1;i<punti.length;i++){var A=punti[i-1],B=punti[i];for(var k=1;k<=6;k++){ev('pointermove',A.x+(B.x-A.x)*k/6,A.y+(B.y-A.y)*k/6);await new Promise(function(q){requestAnimationFrame(q);});}}
      ev('pointerup',punti[punti.length-1].x,punti[punti.length-1].y);};`});
  return {ctx,p,errs};
}
const film=async(p,dur)=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;};
/* i punti del percorso aperto, sullo schermo della mappa (li calcola la mappa stessa) */
const puntiPercorso=p=>p.evaluate(()=>{const tt=document.querySelector('#dmOv .dm-tt b').textContent;
  const r=routes.find(x=>{const t=x.title.toLowerCase();return tt.toLowerCase().replace(/\s+/g,' ')===t.replace(/\s+/g,' ')||t.indexOf(tt.toLowerCase().split(' ')[0])===0;});
  const m=document.getElementById('dmMap'),mr=m.getBoundingClientRect(),ar=document.getElementById('dmArea').getBoundingClientRect();
  const icone=[...document.querySelectorAll('#dmMap .dmk')].map(e=>{const b=e.getBoundingClientRect();return {t:e.textContent,x:b.left+b.width/2-ar.left,y:b.top+b.height/2-ar.top};});
  return {id:r&&r.id,n:r&&r.steps.length,icone};});
(async()=>{
  const b=await launch();
  /* ════ iPad in orizzontale ════ */
  let {ctx,p,errs}=await apri(b,{width:1180,height:820});
  await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(800);
  const riga=await p.evaluate(()=>{const r=[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>/Disegna a memoria/.test(x.textContent));if(r)r.click();return !!r;});
  ok(riga,'Topografia: manca la riga Disegna a memoria');
  let f=await film(p,1000);console.log('disegna entra'.padEnd(20),f.join(' → '));
  ok(f[f.length-1]==='disegna'&&!f.includes('home')&&!f.includes('altro'),'Disegna: entrando si vede altro '+f.join(','));
  await p.waitForTimeout(400);
  await p.evaluate(()=>nccDisegnaPercorso('r2'));await p.waitForTimeout(700);   /* sempre lo stesso percorso di 5 tappe */
  let P=await puntiPercorso(p);console.log('   percorso',P.id,'tappe',P.n,'segni sulla mappa',P.icone.map(x=>x.t).join(''));
  ok(P.icone.map(x=>x.t).join('')==='AB','Disegna: prima di controllare si vedono piu’ di A e B: '+P.icone.map(x=>x.t).join(''));
  /* la Pencil lungo il percorso giusto: le tappe le prendo dalla mappa dopo averle mostrate per un attimo (le coordinate vere) */
  const tappe=await p.evaluate(id=>{const r=routes.find(x=>String(x.id)===String(id));return r.steps.map((s,i)=>coords[r.id+'_'+i]);},P.id);
  const pts=await p.evaluate(ts=>{const el=document.getElementById('dmMap');const map=el.__mappa;return map?ts.map(t=>{const q=map.latLngToContainerPoint({lat:t.lat,lng:t.lon});return {x:q.x,y:q.y};}):null;},tappe);
  let percorsoScr=pts;
  if(!percorsoScr){ /* la mappa non e' esposta: ricavo la scala dai segni A e B */
    const A=P.icone.find(x=>x.t==='A'),B=P.icone.find(x=>x.t==='B'),a=tappe[0],bb=tappe[tappe.length-1];
    const sx=(B.x-A.x)/((bb.lon-a.lon)||1e-9),sy=(B.y-A.y)/((bb.lat-a.lat)||1e-9);
    percorsoScr=tappe.map(t=>({x:A.x+(t.lon-a.lon)*sx,y:A.y+(t.lat-a.lat)*sy}));
  }
  await p.evaluate(pp=>__tratto(pp,'pen'),percorsoScr);await p.waitForTimeout(200);
  const dito=await p.evaluate(()=>document.getElementById('dmDito').textContent);
  ok(/sposta/.test(dito),'Pencil: dopo il primo tratto il dito non passa a spostare la mappa ('+dito+')');
  await p.evaluate(()=>document.getElementById('dmGo').click());await p.waitForTimeout(400);
  let es=await p.evaluate(()=>window.__nccDmEsito);console.log('   tutto il percorso:',JSON.stringify(es));
  ok(es&&es.prese===es.tot&&es.pct>=80,'Disegna: tracciando il percorso giusto non prende tutte le tappe '+JSON.stringify(es));
  const vis=await p.evaluate(()=>({res:!document.getElementById('dmRes').hidden,segni:[...document.querySelectorAll('#dmMap .dmk')].map(e=>e.className.indexOf('dmk-ok')>=0?'v':(e.className.indexOf('dmk-ko')>=0?'r':e.textContent)).join('')}));
  console.log('   dopo Controlla',JSON.stringify(vis));ok(vis.res&&/v/.test(vis.segni)&&!/r/.test(vis.segni),'Disegna: il risultato non mostra le tappe in verde');
  await p.screenshot({path:__dirname+'/pencil-disegna.png'});
  /* riprovo con meta' percorso */
  await p.evaluate(()=>{const b=[...document.querySelectorAll('#dmRes button')].find(x=>/Riprova/.test(x.textContent));b.click();});await p.waitForTimeout(300);
  const meta=percorsoScr.slice(0,Math.ceil(percorsoScr.length/2));
  await p.evaluate(pp=>__tratto(pp,'pen'),meta);await p.evaluate(()=>document.getElementById('dmGo').click());await p.waitForTimeout(300);
  es=await p.evaluate(()=>window.__nccDmEsito);console.log('   meta’ percorso:',JSON.stringify(es));
  ok(es&&es.prese<es.tot&&es.prese>=meta.length-1,'Disegna: con meta’ percorso il conto non torna '+JSON.stringify(es));
  /* un altro percorso */
  const primo=P.id;await p.evaluate(()=>{const b=[...document.querySelectorAll('#dmRes button')].find(x=>/altro/.test(x.textContent));b.click();});await p.waitForTimeout(700);
  P=await puntiPercorso(p);console.log('   un altro:',P.id);ok(P.id&&P.id!==primo,'Disegna: «Un altro» non cambia percorso');
  /* esco col ‹: sotto c'e' ancora la pagina Topografia */
  await p.evaluate(()=>document.querySelector('#dmOv .t-back').click());f=await film(p,900);
  console.log('disegna esci'.padEnd(20),f.join(' → '));ok(f[f.length-1]==='pagina:topo'&&!f.includes('home'),'Disegna: uscendo non torni alla pagina Topografia '+f.join(','));
  /* ════ Mappa muta ════ */
  const PZ=await p.evaluate(()=>{const T=pzTutte(),co={},out=[];
    T.slice(0,4).forEach((q,k)=>{co[q.id]={lat:45.46+k*0.006,lon:9.18+k*0.008};q.v.forEach((v,i)=>co[q.id+'_'+i]={lat:45.46+k*0.006+i/3000,lon:9.18+k*0.008});out.push({id:q.id,n:q.n,c:co[q.id]});});
    const x=T[4];co[x.id]={lat:45.5,lon:9.3};localStorage.setItem('pzCoords',JSON.stringify(co));return out;});
  await p.evaluate(()=>{nccSezChiudi(true);nccSez('pz');});await p.waitForTimeout(800);
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(x=>/Mappa muta/.test(x.textContent)).click());
  f=await film(p,1000);console.log('muta entra'.padEnd(20),f.join(' → '));ok(f[f.length-1]==='muta'&&!f.includes('home'),'Mappa muta: entrando si vede altro '+f.join(','));
  await p.waitForTimeout(300);
  const giro=[];
  for(let k=0;k<10;k++){
    const q=await p.evaluate(()=>({nome:document.getElementById('mmNome').textContent,n:document.getElementById('mmN').textContent,go:!document.getElementById('mmGo').hidden}));
    if(!q.nome)break;
    const giusta=PZ.find(x=>q.nome.toLowerCase().replace('?','').trim()===x.n.toLowerCase());
    if(k===1){ /* un tocco vero sulla mappa, lontano dal centro */
      await p.evaluate(()=>{const m=document.getElementById('mmMap'),r=m.getBoundingClientRect();m.dispatchEvent(new MouseEvent('click',{clientX:r.left+20,clientY:r.top+20,bubbles:true}));});
    }else await p.evaluate(c=>nccMappaMutaTocca(c.lat,c.lon),giusta.c);
    await p.waitForTimeout(150);
    const e=await p.evaluate(()=>document.getElementById('mmEsito').textContent);giro.push(q.n+' '+q.nome+' → '+e);
    const fine=await p.evaluate(()=>{const g=document.getElementById('mmGo');const t=g.textContent;g.click();return /Risultato/.test(t);});
    await p.waitForTimeout(200);if(fine)break;
  }
  console.log('   '+giro.join('\n   '));
  ok(giro.length===4,'Mappa muta: le domande non sono le 4 piazze completate ('+giro.length+')');
  ok(/Preciso/.test(giro[0])&&/(Lontano|Quasi|Vicino)/.test(giro[1]),'Mappa muta: i giudizi non tornano');
  const mm=await p.evaluate(()=>({res:!document.getElementById('mmRes').hidden,esito:window.__nccMmEsito}));
  console.log('   risultato',JSON.stringify(mm));ok(mm.res&&mm.esito&&mm.esito.n===4&&mm.esito.precise===3,'Mappa muta: il riepilogo non torna '+JSON.stringify(mm));
  await p.screenshot({path:__dirname+'/pencil-muta.png'});
  /* rigioca e poi esco col tasto del telefono */
  await p.evaluate(()=>{const b=[...document.querySelectorAll('#mmRes button')].find(x=>/Rigioca/.test(x.textContent));b.click();});await p.waitForTimeout(500);
  const rigioca=await p.evaluate(()=>({n:document.getElementById('mmN').textContent,res:document.getElementById('mmRes').hidden}));ok(rigioca.n==='1/4'&&rigioca.res,'Rigioca non riparte');
  await p.evaluate(()=>history.back());f=await film(p,900);
  console.log('muta, tasto telefono'.padEnd(20),f.join(' → '));ok(f[f.length-1]==='pagina:pz'&&!f.includes('home'),'Mappa muta: il tasto del telefono non torna alla pagina Piazze '+f.join(','));
  errs.forEach(e=>fails.push('JS iPad '+e));await ctx.close();
  /* ════ telefono: si disegna col dito ════ */
  ({ctx,p,errs}=await apri(b,{width:390,height:844}));
  await p.evaluate(()=>nccDisegnaPercorso('r2'));await p.waitForTimeout(900);
  P=await puntiPercorso(p);
  const A=P.icone.find(x=>x.t==='A'),B=P.icone.find(x=>x.t==='B');
  await p.evaluate(pp=>__tratto(pp,'touch'),[A,B]);await p.evaluate(()=>document.getElementById('dmGo').click());await p.waitForTimeout(300);
  es=await p.evaluate(()=>window.__nccDmEsito);const dt=await p.evaluate(()=>document.getElementById('dmDito').textContent);
  console.log('telefono, col dito da A a B:',JSON.stringify(es),'|',dt);ok(es&&es.prese>=2&&/dito/.test(dt),'telefono: col dito non si disegna '+JSON.stringify(es));
  await p.evaluate(()=>history.back());await p.waitForTimeout(700);ok(!(await p.evaluate(()=>!!document.getElementById('dmOv'))),'telefono: il tasto indietro non chiude Disegna');
  errs.forEach(e=>fails.push('JS telefono '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
