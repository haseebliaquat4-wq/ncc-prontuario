/* LA MAPPA PIU' VELOCE (v154), con la Leaflet finta dei giri:
   · tutte le mappe chiedono i riquadri di OpenStreetMap allo stesso indirizzo (tile.openstreetmap.org, non piu'
     a., b., c.tile...): la mappa grande con la Pencil, la mappa a ragno, la principale; cosi' una mappa ritrova i
     riquadri gia' scaricati dalle altre. E zoomando nessuna chiede quelli dei livelli di passaggio
   · Disegna a memoria (e Mappa muta) sulla mappa grigia SENZA i nomi delle vie: prima diventava quella coi nomi
   · la mappa grande: i tratti salvati si vedono, la Pencil disegna e il tratto resta (chiusa e riaperta), Annulla
     lo toglie; niente errori
   · i marker messi dall'app aspettano mentre la mappa grande e' aperta, e ripartono quando la chiudi
   · una volta sola, dalla memoria dei riquadri se ne vanno quelli con gli indirizzi vecchi (a., b., c.), gli altri restano
   uso: node test/giro-mappa-veloce.js */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c){fails.push(m);console.log('   ✗ '+m);}};
const J=x=>JSON.stringify(x);
(async()=>{
  const b=await launch();
  /* ════ 1 · i riquadri: un indirizzo solo, niente livelli di passaggio ════ */
  const tratti=[{c:'#E5484D',w:5,p:[{lat:45.4642,lng:9.1880},{lat:45.4642,lng:9.1900},{lat:45.4645,lng:9.1920}]}];
  let {page:p,errors,ctx}=await boot(b,{clock:false,bootMs:5000,extra:{pencilGeo:tratti}});
  await p.evaluate(()=>{window.__livelli=[];const _t=L.tileLayer;L.tileLayer=function(u,o){const l=_t.apply(this,arguments);
    window.__livelli.push({u:String(l._url||u),z:l.options?l.options.updateWhenZooming:undefined,dove:(new Error().stack||'').split('\n').slice(2,3).join('')});return l;};});
  const apri=async(nome,fn,ms)=>{const n0=await p.evaluate(()=>__livelli.length);await p.evaluate(fn);await p.waitForTimeout(ms||1200);
    const l=await p.evaluate(n=>__livelli.slice(n),n0);console.log(' '+(nome+'                     ').slice(0,22),J(l.map(x=>x.u.replace(/[{]z[}].*$/,'…')+(x.z===false?' · zoom: niente passaggi':' · zoom: '+x.z))));return l;};
  let L1=await apri('mappa grande',()=>nccMappaGrande(),1500);
  ok(L1.length===1&&L1[0].u==='https://tile.openstreetmap.org/{z}/{x}/{y}.png'&&L1[0].z===false,'mappa grande: '+J(L1));
  /* i tratti salvati si vedono */
  const visto=await p.evaluate(()=>{const c=document.getElementById('mgCanvas');if(!c)return -1;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=16)if(d[i]>0)n++;return n;});
  ok(visto>20,'mappa grande: il tratto salvato non si vede ('+visto+')');
  /* la Pencil disegna */
  const disegna=()=>p.evaluate(()=>{const a=document.getElementById('mgArea'),r=a.getBoundingClientRect();
    const ev=(t,x,y)=>a.dispatchEvent(new PointerEvent(t,{pointerId:7,pointerType:'pen',clientX:r.left+x,clientY:r.top+y,pressure:.5,bubbles:true,cancelable:true}));
    ev('pointerdown',300,300);for(let i=1;i<=20;i++)ev('pointermove',300+i*8,300+i*3);ev('pointerup',460,360);
    return JSON.parse(localStorage.getItem('pencilGeo')||'[]').length;});
  ok(await disegna()===2,'la Pencil non ha disegnato il tratto');
  await p.evaluate(()=>nccMappaGrandeChiudi());await p.waitForTimeout(500);
  await p.evaluate(()=>nccMappaGrande());await p.waitForTimeout(1500);
  ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('pencilGeo')||'[]').length)===2,'riaperta, il tratto nuovo non c’è più');
  await p.evaluate(()=>nccPencilAnnulla());await p.waitForTimeout(300);
  ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('pencilGeo')||'[]').length)===1,'Annulla non toglie il tratto');
  await p.evaluate(()=>nccMappaGrandeChiudi());await p.waitForTimeout(500);
  /* la mappa a ragno, Disegna a memoria (senza nomi) */
  L1=await apri('mappa a ragno',()=>{const P=window.__PIAZZE__||[];pzMappa(P[0].id);},1500);
  ok(L1.length>=1&&L1.every(x=>/^https:[/][/]tile[.]openstreetmap[.]org[/]/.test(x.u)&&x.z===false),'mappa a ragno: '+J(L1));
  await p.evaluate(()=>{try{pzMapChiudi();}catch(e){}});await p.waitForTimeout(800);
  L1=await apri('Disegna a memoria',()=>nccDisegnaPercorso('r2'),1500);
  /* (v154) senza i nomi delle vie: prima diventava la mappa di OpenStreetMap coi nomi */
  ok(L1.length>=1&&L1.every(x=>/World_Light_Gray_Base/.test(x.u)&&x.z===false),'Disegna a memoria non e’ la mappa senza nomi: '+J(L1));
  await p.evaluate(()=>{try{nccDisegnaChiudi();}catch(e){}});await p.waitForTimeout(800);
  /* la mappa principale */
  const princ=await p.evaluate(()=>{try{goTopografia();}catch(e){}return new Promise(r=>setTimeout(()=>r(window._tileLayer?{u:window._tileLayer._url,z:window._tileLayer.options.updateWhenZooming}:null),900));});
  console.log(' mappa principale      ',J(princ));
  ok(princ&&princ.u==='https://tile.openstreetmap.org/{z}/{x}/{y}.png'&&princ.z===false,'mappa principale: '+J(princ));
  await p.evaluate(()=>{try{goHome();}catch(e){}});await p.waitForTimeout(500);
  const tutti=await p.evaluate(()=>__livelli.map(x=>x.u));
  ok(!tutti.some(u=>/[/][/]([{]s[}]|[abc])[.]tile[.]openstreetmap/.test(u)),'qualche mappa usa ancora a., b., c.: '+J(tutti));
  ok(!errors.length,'errori: '+errors.join(' | '));
  await ctx.close();

  /* ════ 2 · i marker messi dall'app aspettano la mappa grande ════ */
  const dom=[];
  ({page:p,errors,ctx}=await boot(b,{clock:false,auto:true,pausaOverpass:0,bootMs:1500,
    overpass:r=>{dom.push(Date.now());r.fulfill({status:200,contentType:'application/json',body:J({osm3s:{},elements:[]})});}}));
  await p.evaluate(()=>nccMappaGrande());
  await p.waitForTimeout(22000);   /* il giro parte dopo 15 secondi: con la mappa grande aperta aspetta */
  const durante=dom.length;
  await p.evaluate(()=>nccMappaGrandeChiudi());
  await p.waitForTimeout(12000);
  console.log(' marker dell\'app       domande con la mappa grande aperta',durante,'· dopo averla chiusa',dom.length-durante);
  ok(durante===0,'i marker dell’app non aspettano la mappa grande: '+durante+' domande');
  ok(dom.length>durante,'chiusa la mappa grande i marker dell’app non ripartono');
  ok(!errors.length,'errori (2): '+errors.join(' | '));
  await ctx.close();

  /* ════ 3 · la memoria dei riquadri: via quelli con gli indirizzi vecchi, una volta sola ════ */
  ({page:p,errors,ctx}=await boot(b,{bootMs:7000}));   /* orologio finto: i 25 secondi passano subito */
  await p.evaluate(async()=>{const c=await caches.open('ncc-tiles-v3');
    for(const u of ['https://a.tile.openstreetmap.org/15/1/1.png','https://b.tile.openstreetmap.org/15/1/2.png','https://c.tile.openstreetmap.org/15/1/3.png',
      'https://tile.openstreetmap.org/15/1/1.png','https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/1/1'])await c.put(u,new Response('x'));});
  await p.clock.runFor(30000);await p.waitForTimeout(1500);
  const resto=await p.evaluate(async()=>{const c=await caches.open('ncc-tiles-v3');return {u:(await c.keys()).map(r=>r.url),f:localStorage.getItem('nccTileAbc')};});
  console.log(' memoria dei riquadri  ',J(resto));
  ok(J(resto.u.sort())===J(['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/1/1','https://tile.openstreetmap.org/15/1/1.png'])&&resto.f==='1',
    'memoria dei riquadri: '+J(resto));
  /* una volta sola: rimessi, restano */
  await p.evaluate(async()=>{const c=await caches.open('ncc-tiles-v3');await c.put('https://a.tile.openstreetmap.org/15/9/9.png',new Response('x'));});
  await p.reload();await p.clock.runFor(40000);await p.waitForTimeout(1500);
  const resto2=await p.evaluate(async()=>{const c=await caches.open('ncc-tiles-v3');return (await c.keys()).map(r=>r.url);});
  ok(resto2.includes('https://a.tile.openstreetmap.org/15/9/9.png'),'la pulizia della memoria si ripete: '+J(resto2));
  ok(!errors.length,'errori (3): '+errors.join(' | '));
  await ctx.close();

  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
  await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
