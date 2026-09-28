/* «OGGI»: CONTANO ANCHE I PERCORSI E LE PIAZZE FUORI DALLA LISTA, a tempo reale.
   Il caso vero (28/9): quattro percorsi finiti, nessuno fra i cinque consigliati, e la riga
   restava a 0/5 come se non si fossero salvati. Ora:
   · un percorso finito davvero sulla mappa (Studio fino all'ultima tappa) fuori dalla lista: 1/5,
     sotto restano quattro consigli, toccando la riga si apre il primo consiglio
   · cinque fatti (dentro e fuori dalla lista): 5/5 spuntato, sotto i nomi di quelli fatti
   · le piazze uguale: 1/6 con cinque consigli, poi 6/6
   · riaprendo l'app i conti restano
   · uscendo dalla mappa: mai schermi vuoti di passaggio */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
(async()=>{
  const b=await launch();
  /* otto percorsi con tutti i marker */
  const routes=[],coords={};
  for(let i=1;i<=8;i++){routes.push({id:'a'+i,title:'PERCORSO '+i+' - ARRIVO '+i,steps:['VIA A'+i,'VIA B'+i,'VIA C'+i]});
    for(let k=0;k<3;k++)coords['a'+i+'_'+k]={lat:45.46+i/100+k/1000,lon:9.18+i/100+k/1000};}
  let {page:p,ctx,errors}=await boot(b,{clock:false,touch:true,mobile:true,extra:{routes,coords,antiFretta:'false',wkRepTs:String(Date.now()),azzerato2026:String(Date.now())}});
  await p.addScriptTag({content:`window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
    while(c&&c!==document.body){if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='popOv')return 'popup';
      if(c.id==='homeScreen')return 'home';if(c.id==='map'||c.id==='panel')return 'mappa';c=c.parentElement;}
    return document.body.classList.contains('on-topo')?'mappa':'vuoto('+(e?(e.id||e.tagName):'-')+')';};
    window.__riga=function(k){var r=document.querySelector('#hmOggi .og-r[onclick*="'+k+'"]');
      return r?{ok:r.classList.contains('ok'),n:(r.querySelector('.og-n')||{}).textContent||'',s:(r.querySelector('.og-t span')||{}).textContent||''}:null;};`});
  await p.touchscreen.tap(8,8);   /* un tocco vero, come la persona che apre l'app: la vibrazione e' permessa */
  const film=async dur=>{const t0=Date.now(),seq=[];while(Date.now()-t0<dur){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}return seq;};
  const riga=k=>p.evaluate(k=>__riga(k),k);
  /* otto piazze complete: la piazza e ogni sua via col marker */
  const pzIds=await p.evaluate(()=>{const P=(typeof pzTutte==='function'?pzTutte():window.__PIAZZE__).filter(x=>x.v&&x.v.length).slice(0,8),co={};
    P.forEach((x,i)=>{co[x.id]={lat:45.47+i/100,lon:9.19};x.v.forEach((_,k)=>co[x.id+'_'+k]={lat:45.47+i/100+k/1000,lon:9.19+k/1000});});
    localStorage.setItem('pzCoords',JSON.stringify(co));return P.map(x=>x.id);});
  await p.waitForTimeout(600);
  let st=await p.evaluate(()=>nccOggiStato());
  console.log('lista di oggi: percorsi',st.pr.join(','),'| piazze',st.pz.join(','));
  ok(st.pr.length===5&&st.pz.length===6,'lista di oggi incompleta '+JSON.stringify({pr:st.pr,pz:st.pz}));
  const fuori=routes.map(r=>r.id).filter(id=>st.pr.indexOf(id)<0);
  /* ════ 1 · un percorso fuori dalla lista, finito davvero sulla mappa ════ */
  await p.evaluate(id=>{goTopografia();setTimeout(()=>{selectRoute(routes.find(r=>r.id===id));setMode('s');},350);},fuori[0]);
  await p.waitForTimeout(1500);
  const aperto=await p.evaluate(()=>cur&&cur.id);ok(aperto===fuori[0],'mappa: aperto '+aperto+' invece di '+fuori[0]);
  for(let k=0;k<6;k++){const fine=await p.evaluate(()=>{const b=document.getElementById('bNext');if(!b||b.disabled||step>=cur.steps.length-1)return true;b.click();return false;});if(fine)break;await p.waitForTimeout(300);}
  await p.waitForTimeout(900);
  const log=await p.evaluate(id=>!!(JSON.parse(localStorage.getItem('rDoneLog')||'{}')[id]),fuori[0]);ok(log,'il percorso finito non entra nel registro');
  await p.evaluate(()=>{const o=document.getElementById('routeDebrief');if(o)o.remove();document.getElementById('tpBack').click();});
  let f=await film(1300);console.log('mappa → home',f.join(' → '));
  ok(f[f.length-1]==='home'&&!f.some(x=>/^vuoto/.test(x)),'uscendo dalla mappa: '+f.join(' → '));
  await p.waitForTimeout(400);
  let r=await riga("'pr'");console.log('dopo un percorso fuori lista:',r.n,'|',r.s);
  const nomi=r.s.split(' · ');
  ok(r.n==='1/5'&&!r.ok,'un percorso fuori dalla lista non conta: '+r.n);
  ok(nomi.length===4&&!new RegExp('Percorso '+fuori[0].slice(1)+' ','i').test(r.s),'sotto non restano quattro consigli: '+r.s);
  /* toccando la riga si apre il primo consiglio */
  await p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'pr\'"]').click());await p.waitForTimeout(1300);
  const primo=await p.evaluate(()=>cur&&cur.id);ok(primo===st.pr[0],'la riga apre '+primo+' invece del primo consiglio '+st.pr[0]);
  await p.evaluate(()=>document.getElementById('tpBack').click());await p.waitForTimeout(900);
  /* ════ 2 · cinque fatti fra dentro e fuori: 5/5 ════ */
  await p.evaluate(({fuori,dentro})=>{const l=JSON.parse(localStorage.getItem('rDoneLog')||'{}');
    fuori.slice(1).concat(dentro).forEach((id,i)=>l[id]=Date.now()+i);localStorage.setItem('rDoneLog',JSON.stringify(l));},{fuori,dentro:st.pr.slice(1,3)});
  await p.waitForTimeout(500);r=await riga("'pr'");console.log('cinque fatti:',r.n,r.ok?'✓':'','|',r.s);
  ok(r.n==='5/5'&&r.ok&&r.s.split(' · ').length===5,'cinque fatti (dentro e fuori): '+JSON.stringify(r));
  /* ════ 3 · le piazze ════ */
  const pzFuori=pzIds.filter(id=>st.pz.indexOf(id)<0);
  await p.evaluate(id=>{const l=JSON.parse(localStorage.getItem('pzDoneLog')||'{}');l[id]=Date.now();localStorage.setItem('pzDoneLog',JSON.stringify(l));},pzFuori[0]);
  await p.waitForTimeout(500);r=await riga("'pz'");console.log('una piazza fuori lista:',r.n,'|',r.s);
  ok(r.n==='1/6'&&!r.ok&&r.s.split(' · ').length===5,'una piazza fuori dalla lista: '+JSON.stringify(r));
  await p.evaluate(({a,b})=>{const l=JSON.parse(localStorage.getItem('pzDoneLog')||'{}');a.concat(b).forEach((id,i)=>l[id]=Date.now()+i);localStorage.setItem('pzDoneLog',JSON.stringify(l));},{a:pzFuori.slice(1),b:st.pz.slice(0,4)});
  await p.waitForTimeout(500);r=await riga("'pz'");console.log('sei piazze:',r.n,r.ok?'✓':'','|',r.s);
  ok(r.n==='6/6'&&r.ok,'sei piazze fatte: '+JSON.stringify(r));
  const tot=await p.evaluate(()=>document.querySelector('#hmOggi .og-tot').textContent);console.log('testata:',tot);
  ok(tot==='3 di 4','testata della sezione (errori: nessuno in scadenza, quindi fatto): '+tot);
  /* ════ 4 · riaprendo l'app i conti restano ════ */
  await p.reload({waitUntil:'load'});await p.waitForTimeout(5500);
  await p.addScriptTag({content:`window.__riga=function(k){var r=document.querySelector('#hmOggi .og-r[onclick*="'+k+'"]');
      return r?{ok:r.classList.contains('ok'),n:(r.querySelector('.og-n')||{}).textContent||''}:null;};`});
  const dopo={pr:await riga("'pr'"),pz:await riga("'pz'")};console.log('dopo il ricarico:',JSON.stringify(dopo));
  ok(dopo.pr.n==='5/5'&&dopo.pz.n==='6/6','riaprendo l’app i conti non restano '+JSON.stringify(dopo));
  await p.screenshot({path:__dirname+'/oggi-altri.png'});
  /* l'avviso di Chrome sulla vibrazione prima di un tocco (dopo il ricarico nessuno ha ancora toccato) non e' un errore dell'app */
  errors.filter(e=>!/Blocked call to navigator\.vibrate/.test(e)).forEach(e=>fails.push('JS '+e));await ctx.close();await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
