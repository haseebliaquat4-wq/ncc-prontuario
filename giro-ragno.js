/* IL RAGNO: tutte le schermate, dal loro punto d'ingresso vero, fotogramma per fotogramma.
   Per ogni ingresso (riquadri della Home, righe di «Oggi», ogni riga delle pagine Quiz, Topografia,
   Piazze, Norme, ogni riga del Profilo, la (i) di ogni riga): tocco, registro cosa c'e' al centro a OGNI
   fotogramma (requestAnimationFrame, non ogni 30 ms), controllo la schermata ferma, la fotografo,
   torno indietro come farebbe una persona e registro anche il ritorno.
   Sulla schermata ferma controllo:
   · niente che esce dallo schermo di lato (la pagina e ogni elemento)
   · niente testo tagliato senza puntini (in larghezza o in altezza)
   · niente contenuto nascosto sotto la barra in basso, anche scorrendo fino in fondo
   · niente scritte che si sovrappongono
   · contrasto del testo (soprattutto nel tema scuro)
   · nessun errore JS
   Nei fotogrammi: mai schermo vuoto, mai Home di passaggio, mai sfarfallio (A → B → A),
   il ritorno arriva dove eri.
   uso: node test/giro-ragno.js <parte> <schermo> <tema>
     parte:   home | pagine | profilo | tutto
     schermo: se (320×568) | iphone (390×844) | ipadv (820×1180) | ipado (1180×820) | pc (1440×900, mouse)
     tema:    chiaro | scuro
   Le foto e il resoconto (JSON) vanno in RAGNO_OUT (di serie la cartella temporanea). */
const {launch,seed,BASE}=require('./lib');const fs=require('fs'),path=require('path'),os=require('os');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const PARTE=process.argv[2]||'tutto',SCH=process.argv[3]||'iphone',TEMA=process.argv[4]||'chiaro';
const SCHERMI={se:{width:320,height:568,touch:true,mobile:true},iphone:{width:390,height:844,touch:true,mobile:true},
  ipadv:{width:820,height:1180,touch:true,mobile:false},ipado:{width:1180,height:820,touch:true,mobile:false},pc:{width:1440,height:900,touch:false,mobile:false}};
const VP=SCHERMI[SCH];if(!VP){console.error('schermo?',SCH);process.exit(2);}
const OUT=path.join(process.env.RAGNO_OUT||path.join(os.tmpdir(),'ragno'),SCH+'-'+TEMA);fs.mkdirSync(OUT,{recursive:true});
const trovati=[];const nota=(dove,cosa,det)=>{trovati.push({dove,cosa,det});};

/* ── nella pagina: chi c'e' al centro, i fotogrammi, i controlli ── */
const AIUTI=`(function(){
window.__vedo=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),e=document.elementFromPoint(X,Y),c=e;
  var q=document.getElementById('quizApp');if(q&&q.classList.contains('open')&&c&&q.contains(c))return 'quiz';
  while(c&&c!==document.body&&c!==document.documentElement){
    var cs=getComputedStyle(c);
    if(c.id==='popOv')return 'popup';
    if(c.id==='scnOv')return 'pagina:'+c.getAttribute('data-p');
    if(c.id==='homeScreen')return c.classList.contains('hm-stat')?'statistiche':'home';
    if(c.id==='map'||c.id==='panel')return 'mappa';
    if(c.classList&&c.classList.contains('modal')&&c.id)return 'modale:'+c.id;
    if(c.id&&(cs.position==='fixed'||cs.position==='absolute'&&c.parentElement===document.body))return c.id;
    c=c.parentElement;}
  if(document.body.classList.contains('on-topo'))return 'mappa';
  return 'vuoto('+(e?(e.id||e.tagName):'-')+')';
};
/* un fotogramma alla volta, guardato subito prima che venga dipinto: dopo tutti i requestAnimationFrame
   dell'app (una sonda di un punto cambia misura a ogni fotogramma e il ResizeObserver scatta dopo il layout).
   Guardando dentro un requestAnimationFrame si vedevano stati mai dipinti (la Home un attimo prima che
   l'app rimettesse la pagina nello stesso fotogramma) */
window.__film=[];window.__filmOn=false;
var sonda=document.createElement('div');sonda.style.cssText='position:fixed;left:-9px;top:0;width:1px;height:1px;pointer-events:none;';
document.documentElement.appendChild(sonda);var giri=0;
new ResizeObserver(function(){try{if(window.__filmOn){var v=__vedo(),L=window.__film;if(!L.length||L[L.length-1].v!==v)L.push({v:v,t:Math.round(performance.now())});}}catch(e){}}).observe(sonda);
(function giro(){giri=1-giri;sonda.style.width=(1+giri)+'px';requestAnimationFrame(giro);})();
/* l'ultimo avviso comparso (i toast impilati) */
window.__avviso=function(){var t=[].slice.call(document.querySelectorAll('#toastStack .toastN')).pop();return t?t.textContent.trim():'';};
window.__radice=function(){
  var X=Math.round(innerWidth/2),Y=Math.round(innerHeight*0.45),c=document.elementFromPoint(X,Y),ult=null;
  while(c&&c!==document.body){var cs=getComputedStyle(c);if(cs.position==='fixed'||c.id==='homeScreen')ult=c;c=c.parentElement;}
  return ult||document.body;
};
function vis(el){
  var r=el.getBoundingClientRect();if(r.width<1||r.height<1)return null;
  for(var c=el;c&&c!==document.documentElement;c=c.parentElement){var cs=getComputedStyle(c);
    if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity<0.05)return null;}
  return r;
}
function visibile(el,r){var a={left:r.left,top:r.top,right:r.right,bottom:r.bottom};
  for(var c=el.parentElement;c&&c!==document.documentElement;c=c.parentElement){var cs=getComputedStyle(c);
    if(cs.overflowX!=='visible'||cs.overflowY!=='visible'){var q=c.getBoundingClientRect();
      if(cs.overflowX!=='visible'){a.left=Math.max(a.left,q.left);a.right=Math.min(a.right,q.right);}
      if(cs.overflowY!=='visible'){a.top=Math.max(a.top,q.top);a.bottom=Math.min(a.bottom,q.bottom);}}
    if(cs.position==='fixed')break;}
  a.width=Math.max(0,a.right-a.left);a.height=Math.max(0,a.bottom-a.top);return a;}
function testoProprio(el){for(var n=el.firstChild;n;n=n.nextSibling){if(n.nodeType===3&&n.nodeValue.trim())return n.nodeValue.trim();}return '';}
function nome(el){var s=el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\\s+/).slice(0,2).join('.'):'');
  var t=(testoProprio(el)||el.getAttribute('aria-label')||'').slice(0,40);return s+(t?' «'+t+'»':'');}
function scorreX(el,rad){for(var c=el.parentElement;c&&c!==rad.parentElement;c=c.parentElement){var cs=getComputedStyle(c);
  if((cs.overflowX==='auto'||cs.overflowX==='scroll')&&c.scrollWidth>c.clientWidth+1)return true;}return false;}
function rgb(s){var m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;var p=m[1].split(/[ ,\\/]+/).filter(Boolean).map(parseFloat);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};}
function lum(c){function f(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b);}
function sfondo(el){var fondo=[];for(var c=el;c;c=c.parentElement){var cs=getComputedStyle(c);if(cs.backgroundImage&&cs.backgroundImage!=='none')return null;
  var b=rgb(cs.backgroundColor);if(b&&b.a>0){fondo.push(b);if(b.a>=0.99)break;}}
  var ris={r:255,g:255,b:255};var bd=getComputedStyle(document.body).backgroundColor,bb=rgb(bd);if(bb&&bb.a>0.99)ris=bb;
  for(var i=fondo.length-1;i>=0;i--){var f=fondo[i];ris={r:f.r*f.a+ris.r*(1-f.a),g:f.g*f.a+ris.g*(1-f.a),b:f.b*f.a+ris.b*(1-f.a)};}return ris;}
window.__controlla=function(){
  var out=[],W=innerWidth,H=innerHeight,rad=__radice();
  if(document.documentElement.scrollWidth>W+1)out.push({k:'pagina-larga',d:document.documentElement.scrollWidth+' su '+W});
  var els=[].slice.call(rad.querySelectorAll('*'));if(rad!==document.body)els.unshift(rad);
  var testi=[];
  els.forEach(function(el){
    if(el.closest('svg')&&el.tagName.toLowerCase()!=='svg')return;
    var r=vis(el);if(!r)return;
    var cs=getComputedStyle(el),t=testoProprio(el),tag=el.tagName;
    var conta=t||tag==='BUTTON'||tag==='INPUT'||tag==='IMG'||tag==='CANVAS'||tag==='TEXTAREA'||tag==='SELECT';
    if(conta&&(r.right>W+1.5||r.left<-1.5)&&!scorreX(el,rad)&&cs.position!=='fixed')out.push({k:'fuori-di-lato',d:nome(el)+' ['+Math.round(r.left)+','+Math.round(r.right)+']'});
    if(t){
      if(el.scrollWidth>el.clientWidth+1&&(cs.overflowX==='hidden'||cs.overflowX==='clip')&&el.clientWidth>0){
        out.push({k:cs.textOverflow==='ellipsis'?'puntini':'testo-tagliato',d:nome(el)+' '+el.scrollWidth+'>'+el.clientWidth});}
      var clamp=cs.webkitLineClamp&&cs.webkitLineClamp!=='none';
      if(el.scrollHeight>el.clientHeight+2&&(cs.overflowY==='hidden'||cs.overflowY==='clip')&&el.clientHeight>0)
        out.push({k:clamp?'puntini':'testo-tagliato-v',d:nome(el)+' '+el.scrollHeight+'>'+el.clientHeight+(clamp?' (righe '+cs.webkitLineClamp+')':'')});
      /* gli avvisi passano sopra per un attimo: non contano come scritte sovrapposte */
      var rv=visibile(el,r);if(rv.width>1&&rv.height>1&&rv.top<H&&rv.bottom>0&&rv.left<W&&rv.right>0&&!el.closest('#toastStack,#toast'))testi.push({el:el,r:rv});
      var col=rgb(cs.color),bg=sfondo(el);
      /* solo emoji: il colore del testo non conta, l'emoji ha i suoi */
      if(col&&bg&&col.a>0.5&&/[A-Za-z0-9\u00c0-\u024f\u20ac%]/.test(t)){var a=lum(col),b=lum(bg),cr=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
        var grande=parseFloat(cs.fontSize)>=18.5||(parseFloat(cs.fontSize)>=14&&(+cs.fontWeight>=700));
        if(cr<(grande?2.6:3.2))out.push({k:'contrasto',d:nome(el)+' '+cr.toFixed(2)+' ('+cs.color+' su rgb('+Math.round(bg.r)+','+Math.round(bg.g)+','+Math.round(bg.b)+'))'});}
    }
  });
  /* scritte una sopra l'altra */
  for(var i=0;i<testi.length;i++)for(var j=i+1;j<testi.length;j++){
    var A=testi[i],B=testi[j];if(A.el.contains(B.el)||B.el.contains(A.el))continue;
    var x=Math.max(0,Math.min(A.r.right,B.r.right)-Math.max(A.r.left,B.r.left)),y=Math.max(0,Math.min(A.r.bottom,B.r.bottom)-Math.max(A.r.top,B.r.top));
    var ar=Math.min(A.r.width*A.r.height,B.r.width*B.r.height);
    if(ar>0&&x*y>ar*0.35){var z1=getComputedStyle(A.el).position,z2=getComputedStyle(B.el).position;
      out.push({k:'sovrapposti',d:nome(A.el)+' ⟷ '+nome(B.el)});}
  }
  /* la barra in basso copre qualcosa? (scorro fino in fondo il contenitore che scorre) */
  var tb=document.getElementById('tabbar'),tr=tb&&vis(tb);
  if(tr){var cx=tr.left+tr.width/2,cy=tr.top+tr.height/2,sopra=document.elementFromPoint(cx,cy);
    if(sopra&&tb.contains(sopra)){
      var sc=[rad].concat([].slice.call(rad.querySelectorAll('*'))).filter(function(e){var s=getComputedStyle(e);return (s.overflowY==='auto'||s.overflowY==='scroll')&&e.scrollHeight>e.clientHeight+2;});
      var vecchi=sc.map(function(e){return e.scrollTop;});sc.forEach(function(e){e.scrollTop=e.scrollHeight;});
      var sotto=[];[].slice.call(rad.querySelectorAll('button,a,input,[onclick],.qc-riga,.pf-r,.og-r,.hm-rq')).forEach(function(el){
        if(tb.contains(el))return;var r=vis(el);if(!r)return;
        if(r.bottom>tr.top+3&&r.top<tr.bottom&&r.right>tr.left&&r.left<tr.right){
          var q=document.elementFromPoint(Math.max(1,Math.min(W-1,r.left+r.width/2)),Math.max(1,Math.min(H-1,Math.max(r.top+2,Math.min(r.bottom-2,tr.top+4)))));
          if(q&&tb.contains(q))sotto.push(nome(el));}});
      if(sotto.length)out.push({k:'sotto-la-barra',d:sotto.slice(0,4).join(' | ')});
      sc.forEach(function(e,i){e.scrollTop=vecchi[i];});
    }}
  return out;
};
})();`;

(async()=>{
  const b=await launch();
  const ctx=await b.newContext({viewport:{width:VP.width,height:VP.height},serviceWorkers:'block',hasTouch:VP.touch,isMobile:VP.mobile,
    deviceScaleFactor:1,colorScheme:TEMA==='scuro'?'dark':'light',timezoneId:'Europe/Rome'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  /* dati realistici: percorsi con marker, uno senza, piazze fatte, errori da ripassare, il nome, la data d'esame */
  const s=seed();const oggi=Date.now();
  const err={};for(let i=0;i<40;i++)err[i*7+3]={due:oggi-86400000*(i%5),box:i%3,n:1+(i%4)};
  const dati={routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),ob1:'true',antiFretta:'false',wkRepTs:String(oggi),azzerato2026:String(oggi),
    nomeUtente:'Haseeb',nomeTs:String(oggi),dark:TEMA==='scuro'?'true':'false',examDate:JSON.stringify(oggi+40*86400000),
    qtStats:JSON.stringify({cat:{reg_com:{seen:120,ok:90},geo_vie:{seen:80,ok:50},norm_legge:{seen:60,ok:41}},err,seenIds:{},idV:2})};
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push(String(e&&e.message)));
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon/.test(t))errs.push('console: '+t);}});
  p.on('dialog',d=>{nota('dialog nativo',d.type()+': '+d.message().slice(0,80));d.dismiss().catch(()=>{});});
  const avvia=async()=>{await p.goto(BASE+'index.html',{waitUntil:'load'});await p.waitForTimeout(6000);await p.addScriptTag({content:AIUTI});
    await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});await p.waitForTimeout(300);};
  await avvia();
  const vedo=()=>p.evaluate(()=>__vedo());
  const film=async(fn,ms)=>{await p.evaluate(()=>{__film=[];__filmOn=true;});if(fn)await fn();await p.waitForTimeout(ms||1300);
    return p.evaluate(()=>{__filmOn=false;return __film.map(x=>x.v);});};
  const sfarfalla=f=>{for(let i=2;i<f.length;i++)if(f[i]===f[i-2]&&f[i]!==f[i-1])return true;return false;};
  const foto=async nome=>{try{await p.screenshot({path:path.join(OUT,nome.replace(/[^a-z0-9àèéìòù_-]+/gi,'_').slice(0,60)+'.png')});}catch(e){}};
  let nFoto=0;
  /* indietro come una persona: il ‹ in alto se c'e', la ✕ di una scheda, altrimenti il tasto del telefono */
  const indietro=async()=>p.evaluate(()=>{
    var q=document.getElementById('quizApp');if(q&&q.classList.contains('open')&&!document.getElementById('popOv')){history.back();return 'indietro del telefono (quiz)';}
    var po=document.getElementById('popOv');if(po){var bs=[].slice.call(po.querySelectorAll('.pop-b'));var b=bs.filter(function(x){return /Annulla|Chiudi|Ho capito|Dopo|OK/.test(x.textContent);}).pop()||bs[bs.length-1];if(b){b.click();return 'popup: '+b.textContent;}}
    var m=[].slice.call(document.querySelectorAll('.modal.open')).pop();if(m){var x=m.querySelector('.mhdr-close,.mclose,[onclick*="close"]');if(x){x.click();return 'scheda: chiudi';}}
    var cands=[].slice.call(document.querySelectorAll('.t-back,#tpBack,.qrun-x,.pz-x,.nm-x,.rg-x,.cx-x,.ip-x,.qback,#mgOv .mg-b[title="Esci"]')).filter(function(e){var r=e.getBoundingClientRect();return r.width>0&&r.top<120&&r.left<innerWidth/2&&document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)===e;});
    if(cands.length){cands[0].click();return 'tasto ‹ '+(cands[0].id||cands[0].className);}
    history.back();return 'indietro del telefono';});
  const pulisci=async()=>{await p.evaluate(()=>{try{nccChiudiPopup();}catch(e){}});};
  /* un ingresso: tocco, film, controlli, foto, indietro, film del ritorno */
  async function prova(dove,origine,clic,opz){
    opz=opz||{};
    const da=await vedo();
    if(da!==origine&&!opz.qualsiasi){nota(dove,'partenza sbagliata','sono su «'+da+'» invece di «'+origine+'»');return null;}
    const nErr=errs.length;
    const av0=await p.evaluate(()=>__avviso());
    const f=await film(clic,opz.attesa||1300);
    const arrivo=f[f.length-1];
    if(f.some(x=>/^vuoto/.test(x)))nota(dove,'schermo vuoto entrando',f.join(' → '));
    if(origine!=='home'&&arrivo!=='home'&&f.slice(1,-1).includes('home'))nota(dove,'Home di passaggio entrando',f.join(' → '));
    if(sfarfalla(f))nota(dove,'sfarfallio entrando',f.join(' → '));
    /* non si e' aperto niente: se e' comparso un avviso e' la risposta (niente da ripassare...), non un tasto morto.
       In tutti e due i casi non c'e' niente da chiudere: niente indietro */
    if(arrivo===origine&&!opz.restaQui){
      const av=await p.evaluate(()=>__avviso());
      if(av&&av!==av0)nota(dove,'solo un avviso',av);else nota(dove,'non apre niente',f.join(' → '));
      errs.slice(nErr).forEach(e=>nota(dove,'errore JS',e));
      await foto((++nFoto<10?'0':'')+nFoto+'-'+dove);
      return {f,g:[],arrivo,fine:arrivo,ok:true};
    }
    let ctrl=[];try{ctrl=await p.evaluate(()=>__controlla());}catch(e){ctrl=[{k:'controllo fallito',d:String(e.message).slice(0,80)}];}
    ctrl.forEach(c=>nota(dove+' › '+arrivo,c.k,c.d));
    await foto((++nFoto<10?'0':'')+nFoto+'-'+dove);
    if(opz.chiudi)await opz.chiudi();
    const come=opz.chiudi?'chiusura propria':await indietro();
    const g=await film(null,opz.attesaRitorno||1200);
    const fine=g[g.length-1];
    if(g.some(x=>/^vuoto/.test(x)))nota(dove,'schermo vuoto tornando',come+': '+g.join(' → '));
    if(origine!=='home'&&g.slice(0,-1).includes('home')&&fine!=='home')nota(dove,'Home di passaggio tornando',come+': '+g.join(' → '));
    if(sfarfalla(g))nota(dove,'sfarfallio tornando',come+': '+g.join(' → '));
    let ok=fine===origine;
    if(!ok&&!opz.ritornoLibero){
      /* forse c'era un riquadro in piu' (es. «Vuoi uscire?»): riprovo una volta */
      const come2=await indietro();await p.waitForTimeout(900);const f2=await vedo();ok=f2===origine;
      nota(dove,'indietro non torna dove eri',come+': '+g.join(' → ')+(ok?' | al secondo indietro ('+come2+') si':' | anche dopo '+come2+': '+f2));
    }
    errs.slice(nErr).forEach(e=>nota(dove,'errore JS',e));
    return {f,g,arrivo,fine,ok};
  }
  async function aHome(){await pulisci();await p.evaluate(()=>{try{['scnOv','pfOv','ctOv','mgOv','dmOv','mmOv'].forEach(function(i){var x=document.getElementById(i);if(x)x.remove();});}catch(e){}try{goHome();}catch(e){}});await p.waitForTimeout(700);
    if(await vedo()!=='home'){await avvia();}}
  /* ════ HOME: riquadri, righe di Oggi ════ */
  if(PARTE==='home'||PARTE==='tutto'){
    await aHome();
    let ctrl=await p.evaluate(()=>__controlla());ctrl.forEach(c=>nota('Home','[ferma] '+c.k,c.d));await foto('00-home');
    const rq=await p.evaluate(()=>[...document.querySelectorAll('#hmNew .hm-rq')].map(x=>(x.getAttribute('onclick')||'')+'|'+(x.querySelector('.hm-rq-t')||{}).textContent));
    for(const r of rq){const [fn,t]=r.split('|');await aHome();
      await prova('Home › riquadro «'+t+'»','home',()=>p.evaluate(fn=>document.querySelector('#hmNew .hm-rq[onclick="'+fn.replace(/"/g,'\\"')+'"]').click(),fn));}
    const og=await p.evaluate(()=>[...document.querySelectorAll('#hmOggi .og-r')].map((x,i)=>i+'|'+((x.querySelector('.og-t b')||x).textContent||'').trim().slice(0,30)));
    for(const r of og){const [i,t]=r.split('|');await aHome();
      await prova('Home › Oggi «'+t+'»','home',()=>p.evaluate(i=>document.querySelectorAll('#hmOggi .og-r')[+i].click(),i),{attesa:1800,ritornoLibero:false});}
    await aHome();await prova('Home › Cerca','home',()=>p.evaluate(()=>{var l=document.querySelector('#hmNew .hm-lente');if(l)l.click();}));
  }
  /* ════ LE PAGINE: ogni riga e ogni (i) ════ */
  if(PARTE==='pagine'||PARTE==='tutto'){
    for(const k of ['quiz','topo','pz','norme']){
      await aHome();await p.evaluate(k=>nccSez(k),k);await p.waitForTimeout(900);
      const orig='pagina:'+k;
      let ctrl=await p.evaluate(()=>__controlla());ctrl.forEach(c=>nota('pagina '+k,'[ferma] '+c.k,c.d));await foto('p-'+k);
      const righe=await p.evaluate(()=>[...document.querySelectorAll('#scnOv .qc-riga')].map(r=>r.querySelector('.qc-lt b').textContent.trim()));
      for(const n of righe){
        if(await vedo()!==orig){await aHome();await p.evaluate(k=>nccSez(k),k);await p.waitForTimeout(900);}
        await prova(k+' › «'+n+'»',orig,()=>p.evaluate(n=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()===n).click(),n),{attesa:1600});
        if(await vedo()!==orig){await aHome();await p.evaluate(k=>nccSez(k),k);await p.waitForTimeout(900);}
        const ci=await p.evaluate(n=>{const r=[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()===n);return !!(r&&r.querySelector('.qc-i'));},n);
        if(ci)await prova(k+' › (i) «'+n+'»',orig,()=>p.evaluate(n=>[...document.querySelectorAll('#scnOv .qc-riga')].find(r=>r.querySelector('.qc-lt b').textContent.trim()===n).querySelector('.qc-i').click(),n),{attesa:700,attesaRitorno:700});
      }
      /* la (i) della testata */
      if(await vedo()!==orig){await aHome();await p.evaluate(k=>nccSez(k),k);await p.waitForTimeout(900);}
      await prova(k+' › (i) della pagina',orig,()=>p.evaluate(()=>document.querySelector('#scnOv .t-info').click()),{attesa:700,attesaRitorno:700});
    }
  }
  /* ════ PROFILO: ogni riga (quelle che cancellano: fino alla conferma, poi Annulla) ════ */
  if(PARTE==='profilo'||PARTE==='tutto'){
    await aHome();await p.evaluate(()=>nccProfilo());await p.waitForTimeout(900);
    let orig=await vedo();
    let ctrl=await p.evaluate(()=>__controlla());ctrl.forEach(c=>nota('Profilo','[ferma] '+c.k,c.d));await foto('profilo');
    const righe=await p.evaluate(()=>[...document.querySelectorAll('#pfOv .pf-r')].map(r=>(r.querySelector('.pf-n')||r).textContent.trim()));
    for(const n of righe){
      if(/Suoni|Vibrazione|Tema Berlina|Vista satellite/.test(n))continue;   /* interruttori: niente schermata */
      if(await vedo()!==orig){await aHome();await p.evaluate(()=>nccProfilo());await p.waitForTimeout(900);orig=await vedo();}
      await prova('Profilo › «'+n+'»',orig,()=>p.evaluate(n=>[...document.querySelectorAll('#pfOv .pf-r')].find(r=>(r.querySelector('.pf-n')||r).textContent.trim()===n).click(),n),{attesa:1300});
    }
  }
  const res={parte:PARTE,schermo:SCH,tema:TEMA,foto:nFoto,trovati};
  fs.writeFileSync(path.join(OUT,'resoconto-'+PARTE+'.json'),JSON.stringify(res,null,1));
  const perTipo={};trovati.forEach(t=>{perTipo[t.cosa]=(perTipo[t.cosa]||0)+1;});
  console.log(SCH,TEMA,PARTE,'| foto',nFoto,'| trovati',trovati.length,JSON.stringify(perTipo));
  await ctx.close();await b.close();
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
