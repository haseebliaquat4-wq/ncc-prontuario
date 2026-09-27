/* «OGGI»: PIAZZE E PERCORSI A CASO, OGNI GIORNO DIVERSI, SOLO COMPLETATI.
   16 piazze e 16 percorsi completi (piu' qualcuno senza marker). Dieci giorni di fila con
   l'orologio: ogni mattina 6 piazze e 5 percorsi tutti completati, nessuno di quelli di ieri,
   in dieci giorni li vedi quasi tutti; li faccio davvero (registro, ripasso) e il giorno dopo
   si riparte. Poi due dispositivi lo stesso giorno: scelgono le stesse.
   E la riga in home: nomi corti, la prossima per prima, quelle fatte spariscono dalla lista. */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const G=86400000,D0=new Date('2026-10-05T08:30:00+02:00').getTime();
async function apri(b,dati,quando){
  const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true,isMobile:true,timezoneId:'Europe/Rome'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.clock.install({time:quando});await p.clock.resume();
  await p.goto(BASE+'index.html');await p.waitForTimeout(5200);
  return {ctx,p,errs};
}
const foto=p=>p.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k);}return o;});
(async()=>{
  const b=await launch();const s=seed();
  /* 14 percorsi completi in piu' (r2 e r4 lo sono gia': 16), r1 e r3 no */
  const routes=s.routes.slice(),coords=Object.assign({},s.coords);
  for(let k=1;k<=14;k++){const n=3+(k%3);routes.push({id:'c'+k,title:'VIA INIZIO '+k+' - VIA FINE '+k,steps:Array.from({length:n},(_,i)=>'TAPPA '+k+'.'+i)});
    for(let i=0;i<n;i++)coords['c'+k+'_'+i]={lat:45.44+k/300+i/1500,lon:9.15+k/250+i/1500};}
  const base={routes:JSON.stringify(routes),coords:JSON.stringify(coords),ob1:'true',antiFretta:'false',wkRepTs:String(D0),azzerato2026:String(D0),
    qtStats:JSON.stringify({cat:{},err:{},seenIds:{},idV:2})};
  let A=await apri(b,base,D0);const p=A.p;
  /* 16 piazze complete sparse nell'elenco, 2 no (una via senza marker, solo la piazza) */
  const pzInfo=await p.evaluate(()=>{const T=pzTutte(),co={},ok=[],no=[];
    T.filter((q,i)=>i%5===2).slice(0,16).forEach((q,k)=>{co[q.id]={lat:45.46+k/300,lon:9.19};q.v.forEach((v,i)=>co[q.id+'_'+i]={lat:45.46+k/300+i/3000,lon:9.19+i/3000});ok.push(q.id);});
    const a=T[1],c=T[3];co[a.id]={lat:45.5,lon:9.2};a.v.slice(1).forEach((v,i)=>co[a.id+'_'+(i+1)]={lat:45.5,lon:9.2+i/1000});co[c.id]={lat:45.51,lon:9.21};no.push(a.id,c.id);
    localStorage.setItem('pzCoords',JSON.stringify(co));localStorage.removeItem('oggiNcc');
    return {ok,no,alfa:T.filter(q=>ok.includes(q.id)).slice(0,6).map(q=>q.id)};});
  const prOk=['r2','r4'].concat(Array.from({length:14},(_,k)=>'c'+(k+1)));
  /* ── dieci giorni ── */
  const giorni=[];let ieri=null;const visteP=new Set(),visteR=new Set();
  for(let g=0;g<10;g++){
    const ora=D0+g*G;await p.clock.setSystemTime(ora);
    const st=await p.evaluate(()=>nccOggiStato());giorni.push(st);
    const nome='giorno '+(g+1);
    ok(st.pz.length===6,nome+': piazze scelte '+st.pz.length+' invece di 6');
    ok(st.pr.length===5,nome+': percorsi scelti '+st.pr.length+' invece di 5');
    ok(st.pz.every(id=>pzInfo.ok.includes(id)),nome+': una piazza non completata '+st.pz.join(','));
    ok(st.pr.every(id=>prOk.includes(id)),nome+': un percorso non completato '+st.pr.join(','));
    ok(new Set(st.pz).size===st.pz.length&&new Set(st.pr).size===st.pr.length,nome+': doppioni nella lista');
    if(ieri){const rp=st.pz.filter(x=>ieri.pz.includes(x)),rr=st.pr.filter(x=>ieri.pr.includes(x));
      ok(!rp.length,nome+': tornano le piazze di ieri '+rp.join(','));ok(!rr.length,nome+': tornano i percorsi di ieri '+rr.join(','));}
    st.pz.forEach(x=>visteP.add(x));st.pr.forEach(x=>visteR.add(x));
    console.log(nome.padEnd(10),'piazze',st.pz.join(',').padEnd(40),'| percorsi',st.pr.join(','));
    /* li faccio: la piazza col ripasso a spirale (una sbagliata ogni giorno), il percorso col suo registro */
    await p.evaluate(({st,ora,g})=>{
      const sr=JSON.parse(localStorage.getItem('pzSR')||'{}'),ps=JSON.parse(localStorage.getItem('pzStats')||'{}'),pl=JSON.parse(localStorage.getItem('pzDoneLog')||'{}');
      const PASSI=[1,2,4,9,21,45];
      st.pz.forEach((id,i)=>{const giusto=i!==g%6;const x=sr[id]||{box:0};x.box=giusto?Math.min(5,(x.box||0)+1):0;x.due=ora+PASSI[x.box]*86400000;x.last=ora;sr[id]=x;
        const y=ps[id]||{ok:0,ko:0};giusto?y.ok++:y.ko++;ps[id]=y;pl[id]=ora;});
      localStorage.setItem('pzSR',JSON.stringify(sr));localStorage.setItem('pzStats',JSON.stringify(ps));localStorage.setItem('pzDoneLog',JSON.stringify(pl));
      const rl=JSON.parse(localStorage.getItem('rDoneLog')||'{}');
      st.pr.forEach(id=>{rl[id]=ora;const e=rSR[id]||{box:0};const box=Math.min(5,(e.box||0)+1);rSR[id]={box,due:ora+[2,4,9,21,45][box-1]*86400000,last:ora};});
      localStorage.setItem('rDoneLog',JSON.stringify(rl));localStorage.setItem('rSR',JSON.stringify(rSR));
    },{st,ora,g});
    await p.waitForTimeout(350);
    const fine=await p.evaluate(()=>{const r=k=>{const e=document.querySelector('#hmOggi .og-r[onclick*="\''+k+'\'"]');
      return e?{ok:e.classList.contains('ok'),n:e.querySelector('.og-n').textContent}:null;};return {pz:r('pz'),pr:r('pr')};});
    if(g===0)ok(fine&&fine.pz&&fine.pz.ok&&fine.pz.n==='6/6'&&fine.pr&&fine.pr.ok&&fine.pr.n==='5/5','giorno 1: fatte tutte, le righe non si spuntano '+JSON.stringify(fine));
    ieri=st;
  }
  console.log('in dieci giorni: piazze diverse',visteP.size,'su 16 | percorsi diversi',visteR.size,'su 16');
  ok(visteP.size>=15,'in dieci giorni escono solo '+visteP.size+' piazze su 16');ok(visteR.size>=15,'in dieci giorni escono solo '+visteR.size+' percorsi su 16');
  ok(giorni[0].pz.join()!==pzInfo.alfa.join(),'giorno 1: le piazze sono le prime in ordine alfabetico, non a caso');
  const primo=giorni.map(x=>x.pz[0]);ok(new Set(primo).size>=5,'la prima piazza del giorno e’ quasi sempre la stessa: '+primo.join(','));
  /* ── due dispositivi, stesso giorno: stesse scelte ── */
  const snap=await foto(p);
  const T11=D0+10*G+3600000;await p.clock.setSystemTime(T11);
  const a11=await p.evaluate(()=>nccOggiStato());
  let B=await apri(b,snap,T11);const b11=await B.p.evaluate(()=>nccOggiStato());
  console.log('giorno 11, due dispositivi: A',a11.pz.join(','),'|',a11.pr.join(','),' B',b11.pz.join(','),'|',b11.pr.join(','));
  ok(a11.pz.join()===b11.pz.join()&&a11.pr.join()===b11.pr.join(),'due dispositivi lo stesso giorno scelgono cose diverse');
  /* ── la riga in home ── */
  const vista=async q=>q.evaluate(()=>{const r=k=>{const e=document.querySelector('#hmOggi .og-r[onclick*="\''+k+'\'"]');
    return e?{t:e.querySelector('.og-t b').textContent,s:(e.querySelector('.og-t span')||{}).textContent||'',n:e.querySelector('.og-n').textContent,ok:e.classList.contains('ok')}:null;};return {q:r('q'),pz:r('pz'),pr:r('pr')};});
  await B.p.waitForTimeout(400);let v=await vista(B.p);
  const nomi=await B.p.evaluate(ids=>ids.map(id=>pzTutte().find(x=>x.id===id).n),b11.pz);
  console.log('home: quiz «'+v.q.t+'» '+v.q.n+' · '+v.q.s);console.log('home: piazze «'+v.pz.t+'» '+v.pz.n+' · '+v.pz.s);console.log('home: percorsi «'+v.pr.t+'» '+v.pr.n+' · '+v.pr.s);
  ok(v.q.t==='2 quiz'&&v.q.n==='0/2','home: la riga quiz non e’ «2 quiz» 0/2 ('+v.q.t+' '+v.q.n+')');
  ok(v.pz.t==='6 piazze'&&v.pz.n==='0/6','home: la riga piazze non e’ 6 piazze 0/6 ('+v.pz.t+' '+v.pz.n+')');
  ok(v.pr.t==='5 percorsi'&&v.pr.n==='0/5','home: la riga percorsi non e’ 5 percorsi 0/5');
  ok(!/(^|· )Piazza /.test(v.pz.s),'home: i nomi delle piazze non sono accorciati ('+v.pz.s+')');
  const primaCorta=v.pz.s.split(' · ')[0];
  ok(nomi[0].toLowerCase().indexOf(primaCorta.toLowerCase())>=0,'home: la prima della lista non e’ la prossima ('+primaCorta+' / '+nomi[0]+')');
  /* ne faccio due: spariscono dalla lista, la prossima diventa la terza */
  await B.p.evaluate(ids=>{const pl=JSON.parse(localStorage.getItem('pzDoneLog')||'{}');ids.forEach(id=>pl[id]=Date.now());localStorage.setItem('pzDoneLog',JSON.stringify(pl));},b11.pz.slice(0,2));
  await B.p.waitForTimeout(500);v=await vista(B.p);
  const terza=await B.p.evaluate(id=>pzTutte().find(x=>x.id===id).n,b11.pz[2]);
  console.log('home dopo 2 piazze:',v.pz.n,'·',v.pz.s);
  ok(v.pz.n==='2/6'&&v.pz.s.split(' · ').length===4,'home: dopo due piazze la riga non dice 2/6 con quattro nomi ('+v.pz.n+' · '+v.pz.s+')');
  ok(terza.toLowerCase().indexOf(v.pz.s.split(' · ')[0].toLowerCase())>=0,'home: la prossima non e’ la terza della lista');
  /* il tocco apre proprio quella */
  await B.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'pz\'"]').click());await B.p.waitForTimeout(900);
  const aperta=await B.p.evaluate(()=>(document.querySelector('#pzOv .pz-ti')||{}).textContent);ok(aperta===terza,'home: il tocco apre '+aperta+' invece di '+terza);
  /* percorso disegnato a memoria (70%): conta come fatto; al 40% no */
  await B.p.evaluate(ids=>{const d=JSON.parse(localStorage.getItem('dmStats')||'{}');const t=Date.now();
    d[ids[0]]={n:1,ult:70,best:70,last:t,ok:t};d[ids[1]]={n:1,ult:40,best:40,last:t};localStorage.setItem('dmStats',JSON.stringify(d));},b11.pr);
  await B.p.waitForTimeout(500);v=await vista(B.p);console.log('home dopo Disegna a memoria (70% e 40%):',v.pr.n);
  ok(v.pr.n==='1/5','Disegna a memoria: la riga percorsi non dice 1/5 ma '+v.pr.n);
  /* la sincronizzazione porta il "preso" dell'altro dispositivo */
  const sy=await p.evaluate(ids=>{const t=Date.now();nccSyncUnisci({dmStats:JSON.stringify({[ids[2]]:{n:2,ult:80,best:80,last:t,ok:t}})});
    const d=JSON.parse(localStorage.getItem('dmStats')||'{}');return !!(d[ids[2]]&&d[ids[2]].ok);},b11.pr);
  ok(sy,'sincronizzazione: Disegna a memoria dell’altro dispositivo non arriva');
  /* fatte tutte: il tocco apre una in piu', sempre fra le completate e non fra quelle di oggi */
  await B.p.evaluate(()=>{const x=document.querySelector('#pzOv .pz-x');x&&x.click();});await B.p.waitForTimeout(900);
  const casa=await B.p.evaluate(()=>!document.getElementById('pzOv')&&!!document.getElementById('hmOggi'));ok(casa,'dalla piazza di Oggi ‹ non torna in home');
  await B.p.evaluate(({pz,pr})=>{const pl=JSON.parse(localStorage.getItem('pzDoneLog')||'{}'),rl=JSON.parse(localStorage.getItem('rDoneLog')||'{}');
    pz.forEach(id=>pl[id]=Date.now());pr.forEach(id=>rl[id]=Date.now());localStorage.setItem('pzDoneLog',JSON.stringify(pl));localStorage.setItem('rDoneLog',JSON.stringify(rl));},{pz:b11.pz,pr:b11.pr});
  await B.p.waitForTimeout(500);v=await vista(B.p);ok(v.pz.ok&&v.pr.ok,'fatte tutte: le righe non si spuntano');
  await B.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'pz\'"]').click());await B.p.waitForTimeout(900);
  const extra=await B.p.evaluate(()=>{const t=(document.querySelector('#pzOv .pz-ti')||{}).textContent;const p=pzTutte().find(x=>x.n===t);return p?p.id:t;});
  ok(pzInfo.ok.includes(extra)&&!b11.pz.includes(extra),'fatte tutte: il tocco apre '+extra+' (non completata o gia’ di oggi)');
  await B.p.evaluate(()=>{const x=document.querySelector('#pzOv .pz-x');x&&x.click();});await B.p.waitForTimeout(900);
  await B.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'pr\'"]').click());await B.p.waitForTimeout(1500);
  const rx=await B.p.evaluate(()=>typeof cur!=='undefined'&&cur?String(cur.id):null);console.log('fatte tutte, in piu’: piazza',extra,'| percorso',rx);
  ok(prOk.includes(rx)&&!b11.pr.includes(rx),'fatti tutti: il tocco apre il percorso '+rx+' (non completato o gia’ di oggi)');
  A.errs.concat(B.errs).forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
