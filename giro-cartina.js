/* 🏙️ LA CARTINA DI MILANO (v148), a tempo reale, fotogramma per fotogramma.
   Una cartina finta (griglia con i nomi, 3000×2400) al posto della foto vera.
   · Topografia › «La cartina»: entra senza Home di passaggio, vuota chiede la foto, ‹ torna alla pagina
   · scelta la foto: si apre intera e al centro; il suggerimento compare e poi sparisce
   · due dita: ingrandisce restando sul punto fra le dita; un dito sposta (mai oltre i bordi) e con lo slancio;
     il pizzico oltre il limite torna indietro da solo; doppio tocco piu' vicino, di nuovo vicino al massimo: intera;
     + − e «Tutta»; la rotella del mouse; i tasti + − 0 le frecce
   · la Pencil scrive (anche col palmo appoggiato la cartina sta ferma), il segno resta sulla stessa via ingrandendo;
     evidenziatore; gomma che toglie il segno intero, ↶ lo rimette; col dito (☝️) scrive anche il dito,
     ma con due dita si ingrandisce e basta
   · chiusa e riaperta, e dopo un ricarico: stessa cartina, stessi segni, stesso punto
   · (i) › Cambia cartina: chiede prima di cancellare i segni
   · telefono 320 e 390, iPad dritto e girato, tema scuro: niente che esce dallo schermo, i tasti ◀ dentro */
const {launch,boot}=require('./lib');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const vicino=(a,b,t)=>Math.abs(a-b)<=(t||2);
(async()=>{
  const b=await launch();
  const {page:p,ctx,errors}=await boot(b,{clock:false,touch:true,mobile:true,viewport:{width:390,height:844},
    extra:{antiFretta:'false',wkRepTs:String(Date.now()),azzerato2026:String(Date.now())}});
  const aiuti=`window.__vedo=function(){var e=document.elementFromPoint(195,430),c=e;
      while(c&&c!==document.body){if(c.id==='ctOv')return 'cartina';if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');if(c.id==='popOv')return 'popup';
        if(c.id==='homeScreen')return 'home';c=c.parentElement;}
      return 'vuoto('+(e?(e.id||e.tagName):'-')+')';};
    window.__cartinaFinta=async function(nome,W,H,colore){var c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
      x.fillStyle=colore||'#F3EBC8';x.fillRect(0,0,W,H);x.strokeStyle='#C9B98A';x.lineWidth=6;
      for(var i=0;i<=W;i+=150){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke();}
      for(var j=0;j<=H;j+=150){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke();}
      x.fillStyle='#333';x.font='bold 22px sans-serif';for(var a=0;a<W;a+=300)for(var d=0;d<H;d+=300)x.fillText('VIA '+a+'-'+d,a+10,d+40);
      var blob=await new Promise(function(r){c.toBlob(r,'image/png');});var f=new File([blob],nome,{type:'image/png'});
      var dt=new DataTransfer();dt.items.add(f);var inp=document.getElementById('ctFile');inp.files=dt.files;inp.dispatchEvent(new Event('change'));};
    window.__area=function(){var r=document.getElementById('ctArea').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};};
    window.__pe=function(t,id,tipo,x,y,pr){var a=document.getElementById('ctArea');
      a.dispatchEvent(new PointerEvent(t,{pointerId:id,pointerType:tipo,clientX:x,clientY:y,pressure:pr==null?(t==='pointerup'?0:0.5):pr,
        bubbles:true,cancelable:true,isPrimary:true,button:0,buttons:t==='pointerup'?0:1}));};
    window.__st=function(){return nccCartinaStato();};`;
  await p.addScriptTag({content:aiuti});
  const film=async(dur,fn)=>{const seq=[];let fine=false;const giro=(async()=>{const t0=Date.now();while(!fine&&Date.now()-t0<dur+200){const v=await p.evaluate(()=>__vedo());if(seq[seq.length-1]!==v)seq.push(v);await new Promise(r=>setTimeout(r,30));}})();
    if(fn)await fn();await new Promise(r=>setTimeout(r,dur));fine=true;await giro;return seq;};
  const st=()=>p.evaluate(()=>__st());
  const A=()=>p.evaluate(()=>__area());
  /* ════ 1 · dalla pagina Topografia, vuota, e ‹ ════ */
  await p.evaluate(()=>nccSez('topo'));await p.waitForTimeout(900);
  let f=await film(1100,()=>p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()==='La cartina').click()));
  const vuota=await p.evaluate(()=>({v:!document.getElementById('ctVuota').hidden,t:(document.querySelector('#ctOv .t-tit')||{}).textContent,
    barra:getComputedStyle(document.getElementById('ctBarra')).visibility}));
  console.log('Topografia › La cartina:',f.join(' → '),'|',JSON.stringify(vuota));
  ok(f[f.length-1]==='cartina'&&!f.some(x=>/^vuoto|home/.test(x)),'entrando: '+f.join(' → '));
  ok(vuota.v&&vuota.t==='Cartina di Milano'&&vuota.barra==='hidden','vuota: non chiede la foto '+JSON.stringify(vuota));
  f=await film(1000,()=>p.evaluate(()=>document.querySelector('#ctOv .t-back').click()));
  console.log('‹ →',f.join(' → '));
  ok(f[f.length-1]==='pagina:topo'&&!f.some(x=>/^vuoto|home/.test(x)),'‹ non torna alla pagina Topografia: '+f.join(' → '));
  await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()==='La cartina').click());await p.waitForTimeout(800);
  f=await film(1000,()=>p.evaluate(()=>history.back()));
  console.log('indietro del telefono →',f.join(' → '));
  ok(f[f.length-1]==='pagina:topo'&&!f.some(x=>/^vuoto|home/.test(x)),'il tasto indietro del telefono non torna alla pagina Topografia: '+f.join(' → '));
  /* ════ 2 · scelta la foto: intera, al centro ════ */
  await p.evaluate(()=>nccCartina());await p.waitForTimeout(700);
  await p.evaluate(()=>__cartinaFinta('cartina.png',3000,2400));await p.waitForTimeout(1600);
  let s=await st();const a0=await A();
  const aiuto=await p.evaluate(()=>{const a=document.getElementById('ctAiuto');return {t:a.textContent,via:a.classList.contains('via')};});
  console.log('pronta:',JSON.stringify({W:s.W,H:s.H,s:+s.s.toFixed(4),x:s.x,y:s.y}),'| suggerimento',JSON.stringify(aiuto));
  ok(s.W===3000&&s.H===2400&&vicino(s.s,Math.min(s.aw/3000,s.ah/2400),1e-6)&&vicino(s.x,(s.aw-3000*s.s)/2,0.5)&&vicino(s.y,(s.ah-2400*s.s)/2,0.5),'non si apre intera e al centro '+JSON.stringify(s));
  ok(!aiuto.via&&aiuto.t==='Due dita per ingrandire','il suggerimento non compare: '+JSON.stringify(aiuto));
  await p.waitForTimeout(4200);ok(await p.evaluate(()=>document.getElementById('ctAiuto').classList.contains('via')),'il suggerimento non sparisce');
  /* ════ 3 · due dita: il punto fra le dita resta sotto le dita ════ */
  const cx=a0.x+a0.w/2,cy=a0.y+a0.h/2;
  const primaP=await st();const ix=(cx-a0.x-primaP.x)/primaP.s,iy=(cy-a0.y-primaP.y)/primaP.s;
  f=await film(700,async()=>{await p.evaluate(({cx,cy})=>{__pe('pointerdown',11,'touch',cx-40,cy);__pe('pointerdown',12,'touch',cx+40,cy);
    for(let k=1;k<=12;k++){__pe('pointermove',11,'touch',cx-40-k*5,cy);__pe('pointermove',12,'touch',cx+40+k*5,cy);}
    __pe('pointerup',11,'touch',cx-100,cy);__pe('pointerup',12,'touch',cx+100,cy);},{cx,cy});});
  s=await st();const ix2=(cx-a0.x-s.x)/s.s,iy2=(cy-a0.y-s.y)/s.s;
  console.log('pizzico ×2,5:',(s.s/primaP.s).toFixed(2),'| punto fra le dita prima',ix.toFixed(1),iy.toFixed(1),'dopo',ix2.toFixed(1),iy2.toFixed(1),'|',f.join(' → '));
  ok(vicino(s.s/primaP.s,2.5,0.02)&&vicino(ix,ix2,1.5),'il pizzico non ingrandisce sul punto fra le dita '+JSON.stringify({r:s.s/primaP.s,ix,ix2}));
  ok(f.every(x=>x==='cartina'),'pizzico: '+f.join(' → '));
  /* un dito sposta; mai oltre i bordi */
  const p1=await st();
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',13,'touch',cx,cy);for(let k=1;k<=10;k++)__pe('pointermove',13,'touch',cx-k*6,cy-k*4);},{cx,cy});
  await p.waitForTimeout(250);await p.evaluate(({cx,cy})=>__pe('pointerup',13,'touch',cx-60,cy-40),{cx,cy});await p.waitForTimeout(120);
  s=await st();
  const atteso=(v,d,lo)=>Math.min(0,Math.max(lo,v+d))-v;   /* fin dove arriva prima del bordo */
  const ex=atteso(p1.x,-60,p1.aw-3000*p1.s),ey=atteso(p1.y,-40,p1.ah-2400*p1.s);
  console.log('un dito: spostata di',(s.x-p1.x).toFixed(1),(s.y-p1.y).toFixed(1),'(fino al bordo:',ex.toFixed(1),ey.toFixed(1)+')');
  ok(vicino(s.x-p1.x,ex,1)&&vicino(s.y-p1.y,ey,1)&&Math.abs(ex)>50,'un dito non sposta la cartina '+JSON.stringify({dx:s.x-p1.x,dy:s.y-p1.y,ex,ey}));
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',14,'touch',cx,cy);for(let k=1;k<=10;k++)__pe('pointermove',14,'touch',cx+k*400,cy+k*400);},{cx,cy});
  await p.waitForTimeout(250);await p.evaluate(({cx,cy})=>__pe('pointerup',14,'touch',cx+4000,cy+4000),{cx,cy});await p.waitForTimeout(150);
  s=await st();console.log('trascinata lontano: x',s.x.toFixed(1),'y',s.y.toFixed(1),'(mai sopra 0)');
  ok(s.x<=0.01&&s.y<=0.01&&s.x>=s.aw-s.W*s.s-0.01,'si trascina oltre i bordi '+JSON.stringify({x:s.x,y:s.y}));
  /* lo slancio: un colpo veloce e poi continua da sola */
  const p2=await st();
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',15,'touch',cx,cy);},{cx,cy});
  for(let k=1;k<=5;k++){await p.evaluate(({cx,cy,k})=>__pe('pointermove',15,'touch',cx-k*24,cy-k*16),{cx,cy,k});await p.waitForTimeout(16);}
  await p.evaluate(({cx,cy})=>__pe('pointerup',15,'touch',cx-120,cy-80),{cx,cy});
  const subito=await st();await p.waitForTimeout(700);s=await st();
  console.log('slancio: al rilascio',(subito.x-p2.x).toFixed(0),'poi',(s.x-p2.x).toFixed(0));
  ok(s.x<subito.x-20,'niente slancio dopo un colpo veloce '+JSON.stringify({rilascio:subito.x-p2.x,dopo:s.x-p2.x}));
  /* il pizzico oltre il limite torna indietro */
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',16,'touch',cx-150,cy);__pe('pointerdown',17,'touch',cx+150,cy);
    for(let k=1;k<=10;k++){__pe('pointermove',16,'touch',cx-150+k*14,cy);__pe('pointermove',17,'touch',cx+150-k*14,cy);}},{cx,cy});
  const sotto=await st();await p.evaluate(({cx,cy})=>{__pe('pointerup',16,'touch',cx-10,cy);__pe('pointerup',17,'touch',cx+10,cy);},{cx,cy});
  await p.waitForTimeout(450);s=await st();
  console.log('pizzico troppo stretto: durante',(sotto.s/sotto.min).toFixed(2),'× intera, poi',(s.s/s.min).toFixed(2));
  ok(sotto.s<sotto.min&&vicino(s.s,s.min,1e-6),'il pizzico oltre il limite non torna '+JSON.stringify({durante:sotto.s,poi:s.s,min:s.min}));
  /* doppio tocco: piu' vicino; vicino al massimo: intera */
  const tocco=async(x,y)=>{await p.evaluate(({x,y})=>{__pe('pointerdown',21,'touch',x,y);__pe('pointerup',21,'touch',x,y);},{x,y});};
  await tocco(cx,cy);await p.waitForTimeout(90);await tocco(cx,cy);await p.waitForTimeout(450);
  const d1=await st();console.log('doppio tocco:',(d1.s/d1.min).toFixed(2),'× intera');
  ok(vicino(d1.s,d1.min*2.2,1e-3),'il doppio tocco non avvicina '+(d1.s/d1.min));
  for(let k=0;k<4;k++){await tocco(cx,cy);await p.waitForTimeout(90);await tocco(cx,cy);await p.waitForTimeout(420);}
  const d2=await st();console.log('doppio tocco vicino al massimo →',(d2.s/d2.min).toFixed(2),'× intera');
  ok(vicino(d2.s,d2.min,1e-6),'vicino al massimo il doppio tocco non torna all’intera '+JSON.stringify(d2));
  /* + − e Tutta */
  await p.evaluate(()=>document.querySelector('.ct-zb[aria-label="Più vicino"]').click());await p.waitForTimeout(400);const z1=await st();
  await p.evaluate(()=>document.querySelector('.ct-zb[aria-label="Più lontano"]').click());await p.waitForTimeout(400);const z2=await st();
  await p.evaluate(()=>document.querySelector('.ct-zb[aria-label="Più vicino"]').click());await p.waitForTimeout(400);
  await p.evaluate(()=>[...document.querySelectorAll('#ctBarra .dm-b')].find(x=>/⤢/.test(x.textContent)).click());await p.waitForTimeout(450);const z3=await st();
  console.log('+ →',(z1.s/z1.min).toFixed(2),'| − →',(z2.s/z2.min).toFixed(2),'| Tutta →',(z3.s/z3.min).toFixed(2));
  ok(vicino(z1.s/z1.min,1.8,0.01)&&vicino(z2.s,z2.min,1e-6)&&vicino(z3.s,z3.min,1e-6)&&vicino(z3.x,(z3.aw-3000*z3.s)/2,0.5),'+ − Tutta non vanno '+JSON.stringify({z1,z2,z3}));
  /* ════ 4 · la Pencil ════ */
  await p.evaluate(()=>nccCartinaZoom(1));await p.waitForTimeout(400);
  const v0=await st();
  f=await film(900,async()=>{await p.evaluate(({cx,cy})=>{__pe('pointerdown',31,'pen',cx-90,cy-30,0.2);
    __pe('pointerdown',32,'touch',cx+60,cy+120);                                   /* il palmo appoggiato */
    for(let k=1;k<=24;k++){__pe('pointermove',31,'pen',cx-90+k*7,cy-30+Math.sin(k/4)*20,0.8);__pe('pointermove',32,'touch',cx+60+k*3,cy+120+k*2);}
    __pe('pointerup',31,'pen',cx+78,cy-30,0);__pe('pointerup',32,'touch',cx+132,cy+168);},{cx,cy});});
  s=await st();
  const tr=await p.evaluate(()=>{const el=document.querySelector('#ctSvg path');return el?{d:el.getAttribute('d').length,w:+el.getAttribute('stroke-width'),c:el.getAttribute('stroke')}:null;});
  console.log('Pencil (col palmo appoggiato):',s.n,'segno',JSON.stringify(tr),'| cartina ferma:',vicino(s.x,v0.x,0.01)&&vicino(s.y,v0.y,0.01),'|',f.join(' → '));
  ok(s.n===1&&tr&&tr.c==='#2447D6'&&tr.w>0,'la Pencil non scrive '+JSON.stringify({n:s.n,tr}));
  ok(vicino(s.x,v0.x,0.01)&&vicino(s.y,v0.y,0.01),'col palmo appoggiato la cartina si sposta mentre scrivi');
  ok(s.penna&&!s.dito,'la prima Pencil non rimette il dito a spostare');
  /* il segno resta sulla stessa via ingrandendo */
  const sul=async()=>p.evaluate(()=>{const r=document.querySelector('#ctSvg path').getBoundingClientRect(),S=__st(),a=__area();
    return {ix:(r.left+r.width/2-a.x-S.x)/S.s,iy:(r.top+r.height/2-a.y-S.y)/S.s,w:r.width};});
  const sg1=await sul();await p.evaluate(()=>nccCartinaZoom(1));await p.waitForTimeout(450);const sg2=await sul();
  console.log('il segno, in coordinate della cartina: prima',sg1.ix.toFixed(1),sg1.iy.toFixed(1),'dopo lo zoom',sg2.ix.toFixed(1),sg2.iy.toFixed(1),'| largo',sg1.w.toFixed(0),'→',sg2.w.toFixed(0),'px');
  ok(vicino(sg1.ix,sg2.ix,4)&&vicino(sg1.iy,sg2.iy,4)&&vicino(sg2.w/sg1.w,1.8,0.05),'il segno non resta sulla sua via ingrandendo '+JSON.stringify({sg1,sg2}));
  /* evidenziatore */
  if(await p.evaluate(()=>getComputedStyle(document.getElementById('ctColB')).display!=='none')){await p.evaluate(()=>document.getElementById('ctColB').click());await p.waitForTimeout(300);}
  const pal=await p.evaluate(()=>{const e=document.getElementById('ctPal'),r=e.getBoundingClientRect();return {aperta:e.classList.contains('aperta'),op:getComputedStyle(e).opacity,dx:r.right<=innerWidth&&r.left>=0};});
  await p.evaluate(()=>document.querySelector('.ct-c[data-i="4"]').click());await p.waitForTimeout(300);
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',33,'pen',cx-80,cy+60,0.5);for(let k=1;k<=16;k++)__pe('pointermove',33,'pen',cx-80+k*10,cy+60,0.5);__pe('pointerup',33,'pen',cx+80,cy+60,0);},{cx,cy});
  const ev=await p.evaluate(()=>{const e=[...document.querySelectorAll('#ctSvg path')].pop();return {cl:e.getAttribute('class'),op:e.getAttribute('stroke-opacity'),c:e.getAttribute('stroke'),
    chiusa:!document.getElementById('ctPal').classList.contains('aperta'),colb:document.getElementById('ctColB').className};});
  console.log('tavolozza del telefono:',JSON.stringify(pal),'| evidenziatore:',JSON.stringify(ev));
  ok(pal.aperta&&pal.op==='1'&&pal.dx,'sul telefono la tavolozza non si apre dentro lo schermo '+JSON.stringify(pal));
  ok(ev.cl==='ct-ev'&&ev.op==='0.42'&&ev.c==='#FFD60A'&&ev.chiusa&&/evc/.test(ev.colb),'l’evidenziatore non va '+JSON.stringify(ev));
  /* gomma: toglie il segno intero; ↶ lo rimette; ↶ di nuovo toglie l'ultimo */
  await p.evaluate(()=>nccCartinaGomma());await p.waitForTimeout(150);
  const g0=await st();
  await p.evaluate(()=>{const r=document.querySelector('#ctSvg path[stroke="#2447D6"]').getBoundingClientRect(),x=r.left+r.width/2;
    __pe('pointerdown',34,'pen',x,r.top-6,0.5);for(let k=1;k<=12;k++)__pe('pointermove',34,'pen',x,r.top-6+k*(r.height+12)/12,0.5);__pe('pointerup',34,'pen',x,r.bottom+6,0);});
  const g1=await st();const colori1=await p.evaluate(()=>[...document.querySelectorAll('#ctSvg path')].map(e=>e.getAttribute('stroke')));
  await p.evaluate(()=>document.querySelector('#ctBarra .dm-b[aria-label^="Annulla"]').click());await p.waitForTimeout(150);
  const g2=await st();const colori2=await p.evaluate(()=>[...document.querySelectorAll('#ctSvg path')].map(e=>e.getAttribute('stroke')));
  await p.evaluate(()=>document.querySelector('#ctBarra .dm-b[aria-label^="Annulla"]').click());await p.waitForTimeout(150);
  const g3=await st();
  console.log('gomma:',g0.n,'→',g1.n,JSON.stringify(colori1),'| ↶',g2.n,JSON.stringify(colori2),'| ↶',g3.n);
  ok(g0.n===2&&g1.n===1&&colori1[0]==='#FFD60A'&&g2.n===2&&colori2.join()==='#2447D6,#FFD60A'&&g3.n===1,'gomma e ↶ non vanno '+JSON.stringify({g0:g0.n,g1:g1.n,colori1,g2:g2.n,colori2,g3:g3.n}));
  /* (v149) un gesto di gomma che toglie due segni (il primo e il terzo, non quello in mezzo): ↶ li rimette
     nello stesso ordine di prima (prima tornavano in un ordine diverso) */
  const ordine=()=>p.evaluate(()=>[...document.querySelectorAll('#ctSvg path')].map(e=>e.getAttribute('stroke')).join());
  await p.evaluate(()=>nccCartinaColore(1));
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',51,'pen',cx-120,cy+40,0.5);for(let k=1;k<=10;k++)__pe('pointermove',51,'pen',cx-120+k*10,cy+40,0.5);__pe('pointerup',51,'pen',cx-20,cy+40,0);},{cx,cy});
  await p.evaluate(()=>nccCartinaColore(2));
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',52,'pen',cx-120,cy+110,0.5);for(let k=1;k<=12;k++)__pe('pointermove',52,'pen',cx-120+k*20,cy+110,0.5);__pe('pointerup',52,'pen',cx+120,cy+110,0);},{cx,cy});
  const o0=await ordine();
  await p.evaluate(()=>nccCartinaGomma());await p.waitForTimeout(150);
  /* la gomma scende dritta a cx+50: parte sopra il segno blu (ingrandito, ora sta piu' in alto) e arriva sotto il verde; il rosso resta a sinistra */
  await p.evaluate(({cx,cy})=>{const r=document.querySelector('#ctSvg path[stroke="#2447D6"]').getBoundingClientRect(),y0=Math.min(cy-64,r.top-8),y1=cy+136,n=Math.ceil((y1-y0)/10);
    __pe('pointerdown',53,'pen',cx+50,y0,0.5);for(let k=1;k<=n;k++)__pe('pointermove',53,'pen',cx+50,y0+k*(y1-y0)/n,0.5);__pe('pointerup',53,'pen',cx+50,y1,0);},{cx,cy});
  const o1=await ordine();
  await p.evaluate(()=>document.querySelector('#ctBarra .dm-b[aria-label^="Annulla"]').click());await p.waitForTimeout(150);
  const o2=await ordine();
  console.log('gomma su due segni in un gesto:',o0,'→',o1,'| ↶',o2);
  ok(o0.split(',').length===3&&o1.split(',').length===1&&o2===o0,'↶ dopo la gomma su due segni non rimette l’ordine di prima '+JSON.stringify({o0,o1,o2}));
  await p.evaluate(()=>nccCartinaColore(1));
  /* col dito: ☝️ scrive; due dita insieme ingrandiscono e basta */
  await p.evaluate(()=>document.getElementById('ctDito').click());await p.waitForTimeout(150);
  const lab=await p.evaluate(()=>document.getElementById('ctDito').textContent);
  const d0=await st();
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',41,'touch',cx-60,cy+100);for(let k=1;k<=12;k++)__pe('pointermove',41,'touch',cx-60+k*8,cy+100);__pe('pointerup',41,'touch',cx+36,cy+100);},{cx,cy});
  const dd=await st();
  await p.evaluate(({cx,cy})=>{__pe('pointerdown',42,'touch',cx-50,cy);__pe('pointerdown',43,'touch',cx+50,cy);
    for(let k=1;k<=10;k++){__pe('pointermove',42,'touch',cx-50-k*5,cy);__pe('pointermove',43,'touch',cx+50+k*5,cy);}
    __pe('pointerup',42,'touch',cx-100,cy);__pe('pointerup',43,'touch',cx+100,cy);},{cx,cy});await p.waitForTimeout(350);
  const d3=await st();
  console.log('col dito «'+lab+'»: segni',d0.n,'→',dd.n,'(la cartina ferma:',vicino(dd.x,d0.x,0.01),') | due dita insieme: segni',d3.n,'zoom ×',(d3.s/dd.s).toFixed(2));
  ok(/Disegni col dito/.test(lab)&&dd.n===d0.n+1&&vicino(dd.x,d0.x,0.01)&&d3.n===dd.n&&d3.s>dd.s*1.5,'col dito: '+JSON.stringify({lab,d0:d0.n,dd:dd.n,d3:d3.n,z:d3.s/dd.s}));
  await p.evaluate(()=>document.getElementById('ctDito').click());
  /* ════ 5 · chiusa e riaperta, poi ricaricata: tutto come prima ════ */
  await p.waitForTimeout(900);const prima=await st();
  f=await film(900,()=>p.evaluate(()=>document.querySelector('#ctOv .t-back').click()));
  await p.evaluate(()=>{const o=document.getElementById('scnOv');if(o)o.remove();});
  await p.evaluate(()=>nccCartina());await p.waitForTimeout(1500);
  let dopo=await st();
  console.log('riaperta: segni',prima.n,'→',dopo.n,'| zoom',prima.s.toFixed(4),'→',dopo.s.toFixed(4),'| x',prima.x.toFixed(1),'→',dopo.x.toFixed(1));
  ok(dopo.n===prima.n&&vicino(dopo.s,prima.s,1e-4)&&vicino(dopo.x,prima.x,1)&&vicino(dopo.y,prima.y,1)&&dopo.id===prima.id,'riaperta non torna com’era '+JSON.stringify({prima,dopo}));
  await p.reload({waitUntil:'load'});await p.waitForTimeout(6500);await p.addScriptTag({content:aiuti});
  await p.evaluate(()=>nccCartina());await p.waitForTimeout(1600);
  dopo=await st();
  console.log('dopo il ricarico: cartina',dopo.W+'×'+dopo.H,'| segni',dopo.n,'| zoom',dopo.s.toFixed(4));
  ok(dopo.W===3000&&dopo.n===prima.n&&vicino(dopo.s,prima.s,1e-4),'dopo il ricarico non c’e’ piu’ '+JSON.stringify(dopo));
  /* ════ 6 · (i) › Cambia cartina: prima chiede ════ */
  await p.evaluate(()=>document.querySelector('#ctOv .t-info').click());await p.waitForTimeout(500);
  const info=await p.evaluate(()=>[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent));
  await p.evaluate(()=>{const b=[...document.querySelectorAll('#popOv .pop-b')].find(x=>/Cambia cartina/.test(x.textContent));b.click();});await p.waitForTimeout(500);
  await p.evaluate(()=>__cartinaFinta('altra.png',2000,1400,'#DCEBF5'));await p.waitForTimeout(900);
  const chiede=await p.evaluate(()=>({t:(document.querySelector('#popOv .pop-x')||{}).textContent||'',b:[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent)}));
  await p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click());await p.waitForTimeout(1600);
  const nuova=await st();
  console.log('(i):',info.join(' | '),'| chiede:',chiede.t.slice(0,60)+'…',JSON.stringify(chiede.b),'| nuova',nuova.W+'×'+nuova.H,'segni',nuova.n);
  ok(info.join('|')==='🖼️ Cambia cartina|🗑 Cancella i segni|Ho capito','la (i) non ha Cambia cartina e Cancella i segni: '+info.join('|'));
  ok(/Uso questa cartina\? I segni/.test(chiede.t)&&chiede.b[0]==='Usa questa'&&nuova.W===2000&&nuova.H===1400&&nuova.n===0,'cambiare cartina: '+JSON.stringify({chiede,nuova}));
  /* ════ 7 · la tastiera (iPad col tasto, PC) ════ */
  await p.keyboard.press('+');await p.waitForTimeout(400);const k1=await st();
  await p.keyboard.press('ArrowRight');await p.waitForTimeout(300);const k2=await st();
  await p.keyboard.press('0');await p.waitForTimeout(400);const k3=await st();
  console.log('tasti: + ×',(k1.s/k1.min).toFixed(2),'| → sposta di',(k2.x-k1.x).toFixed(0),'| 0 ×',(k3.s/k3.min).toFixed(2));
  ok(vicino(k1.s/k1.min,1.8,0.01)&&k2.x<k1.x-20&&vicino(k3.s,k3.min,1e-6),'la tastiera non va '+JSON.stringify({k1,k2,k3}));
  /* ════ 8 · schermi: telefono 320 e 390, iPad dritto e girato, tema scuro ════ */
  const misure=async nome=>{const m=await p.evaluate(()=>{const bar=document.getElementById('ctBarra').getBoundingClientRect(),o=document.getElementById('ctOv');
    const bs=[...document.querySelectorAll('#ctBarra > .dm-b')].filter(x=>getComputedStyle(x).display!=='none').map(x=>x.getBoundingClientRect());
    return {largo:document.documentElement.scrollWidth>innerWidth,fuori:bs.some(r=>r.right>innerWidth+0.5||r.left<-0.5),sotto:bar.bottom<=innerHeight+0.5,
      area:Math.round(document.getElementById('ctArea').getBoundingClientRect().height)};});
    console.log(nome.padEnd(16),JSON.stringify(m));ok(!m.largo&&!m.fuori&&m.sotto&&m.area>200,nome+': '+JSON.stringify(m));};
  await misure('telefono 390');
  await p.setViewportSize({width:320,height:568});await p.waitForTimeout(500);await misure('telefono 320');
  await p.screenshot({path:__dirname+'/cartina-320.png'});
  await p.setViewportSize({width:820,height:1180});await p.waitForTimeout(500);await misure('iPad dritto');
  const cen1=await st();const cc1={x:(cen1.aw/2-cen1.x)/cen1.s,y:(cen1.ah/2-cen1.y)/cen1.s};
  await p.evaluate(()=>nccCartinaZoom(1));await p.waitForTimeout(400);
  const z4=await st();const cz={x:(z4.aw/2-z4.x)/z4.s,y:(z4.ah/2-z4.y)/z4.s};
  await p.setViewportSize({width:1180,height:820});await p.waitForTimeout(500);await misure('iPad girato');
  const z5=await st();const cz5={x:(z5.aw/2-z5.x)/z5.s,y:(z5.ah/2-z5.y)/z5.s};
  console.log('girando l’iPad: al centro',cz.x.toFixed(0),cz.y.toFixed(0),'→',cz5.x.toFixed(0),cz5.y.toFixed(0),'| zoom',z4.s.toFixed(4),'→',z5.s.toFixed(4));
  ok(vicino(cz.x,cz5.x,4)&&vicino(cz.y,cz5.y,4)&&vicino(z4.s,z5.s,1e-4),'girando l’iPad cambia il punto al centro o lo zoom '+JSON.stringify({cz,cz5,s4:z4.s,s5:z5.s}));
  await p.evaluate(()=>{document.body.classList.add('dark');});await p.waitForTimeout(200);
  await p.screenshot({path:__dirname+'/cartina-ipad.png'});
  /* la rotella del mouse ingrandisce sul punto */
  const w0=await st();const a5=await A();
  await p.mouse.move(a5.x+a5.w*0.3,a5.y+a5.h*0.4);await p.mouse.wheel(0,-300);await p.waitForTimeout(300);
  const w1=await st();const px=a5.w*0.3,py=a5.h*0.4;
  console.log('rotella: ×',(w1.s/w0.s).toFixed(2),'| il punto sotto il mouse',((px-w0.x)/w0.s).toFixed(1),'→',((px-w1.x)/w1.s).toFixed(1));
  ok(w1.s>w0.s*1.5&&vicino((px-w0.x)/w0.s,(px-w1.x)/w1.s,1.5),'la rotella non ingrandisce sul punto '+JSON.stringify({w0,w1}));
  /* aperta dalla Home (dopo il ricarico): l'indietro del telefono torna alla Home */
  f=await film(900,()=>p.evaluate(()=>history.back()));
  console.log('aperta dalla Home, indietro del telefono →',f.join(' → '));
  ok(f[f.length-1]==='home'&&!f.some(x=>/^vuoto/.test(x)),'il tasto indietro del telefono non chiude la cartina '+f.join(' → '));
  errors.forEach(e=>fails.push('JS '+e));await ctx.close();await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
