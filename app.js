/* app.js — script inline estratti da index.html (ordine preservato) */

function sceneAnim(el){if(!el)return;try{el.classList.remove('scene-in');void el.offsetWidth;el.classList.add('scene-in');}catch(e){}}
function setAccent(s){try{var b=document.body;b.classList.remove('acc-topo','acc-quiz','acc-study');if(s)b.classList.add('acc-'+s);}catch(e){}}
function bumpStreak(){try{var t=new Date();t.setHours(0,0,0,0);var today=t.getTime();var s=lg('streak',{n:0,last:0});var oneDay=86400000;if(s.last===today){}else if(s.last===today-oneDay){s.n=(s.n||0)+1;s.last=today;}else{s.n=1;s.last=today;}ls('streak',s);return s.n;}catch(e){return 0;}}
function showStreak(){try{var s=lg('streak',{n:0});var el=document.getElementById('streakBadge');if(el){if(s.n>0){el.textContent='\ud83d\udd25 '+s.n+(s.n===1?' giorno di studio':' giorni di fila');el.classList.add('show');}else{el.classList.remove('show');}}}catch(e){}}
function undoToast(msg,fn){try{var old=document.getElementById('_undoBar');if(old)old.remove();var bar=document.createElement('div');bar.id='_undoBar';bar.style.cssText='position:fixed;left:16px;right:16px;bottom:calc(20px + env(safe-area-inset-bottom));z-index:4500;background:rgba(30,30,34,.95);color:#fff;border-radius:18px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,.3);font-weight:600;font-size:14px;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);animation:sceneIn .25s ease;';var sp=document.createElement('span');sp.style.flex='1';sp.textContent=msg;var btn=document.createElement('button');btn.textContent='Annulla';btn.style.cssText='border:none;background:rgba(255,255,255,.18);color:#0a84ff;font-weight:700;font-size:14px;padding:8px 14px;border-radius:12px;cursor:pointer;';var done=false;btn.onclick=function(){if(done)return;done=true;bar.remove();try{fn();}catch(e){}};bar.appendChild(sp);bar.appendChild(btn);document.body.appendChild(bar);setTimeout(function(){if(!done&&bar.parentNode)bar.remove();},5000);}catch(e){}}

(function(){
function hide(){var s=document.getElementById('splash');if(s)s.classList.add('hide');}
setTimeout(hide,3500); /* scudo: lo splash sparisce comunque */
document.addEventListener('DOMContentLoaded',function(){setTimeout(hide,1500);});
try{
if(location.search.indexOf('reset')>=0){
var done=function(){location.replace(location.pathname);};
var p=[];
if('serviceWorker' in navigator){p.push(navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister();}));}));}
if(window.caches&&caches.keys){p.push(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k);}));}));}
Promise.all(p).then(done,done);
setTimeout(done,2000);
}
}catch(e){}
})();

/* ── STORAGE ── */
function lg(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function ls(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){if(e.name==='QuotaExceededError')toast2('⚠️ Memoria piena — salva su cloud');return false;}}

/* ── DATI PERCORSI ── */
const DEF=[{id:'d0',title:'CERCHIA DEI BASTIONI',steps:["P.ZA 24 MAGGIO","V.LE GIAN GALEAZZO","P.LE DI PORTA LODOVICA","V.LE BEATRICE D'ESTE","L.GO ISABELLA D'ARAGONA","V.LE BEATRICE D'ESTE","V.LE FILIPPETTI","P.LE MEDAGLIE D'ORO","P.ZA 25 APRILE","VIALE CRISPI","BASTIONI DI PORTA VOLTA","P.LE BIANCAMANO","P.LE LEGA LOMBARDA","V.LE ELVEZIA","VIA MELZI D'ERIL","VIA CANOVA","VIALE CALDARA","VIALE REGINA MARGHERITA","V.LE MILTON","V.LE MOLIERE","P.ZA 5 GIORNATE","V.LE BIANCA MARIA","P.ZA DEL TRICOLORE","V.LE MAJNO","VIA CURIE","VIA 20 SETTEMBRE","P.ZA CONCILIAZIONE","VIA ENRICO TOTI","P.ZA OBERDAN","P.LE BARACCA","BASTIONI DI PORTA VENEZIA","VIALE CITTA' DI FIUME","P.ZA DELLA REPUBBLICA","VIALE MONTESANTO","P.LE PRINCIPESSA CLOTILDE","V.LE DI PORTA VERCELLINA","P.LE AQUILEIA","V.LE PAPINIANO","P.ZA SANT'AGOSTINO","V.LE PAPINIANO","BASTIONI DI PORTA NUOVA","P.LE GENERAL CANTORE","V.LE GABRIELE D'ANNUNZIO","P.ZA 24 MAGGIO"]}];

function vR(r){if(!Array.isArray(r))return DEF;const out=r.filter(x=>x&&x.id&&Array.isArray(x.steps));return out.length?out:DEF;}
function vC(c){if(!c||typeof c!=='object'||Array.isArray(c))return {};return c;}

let routes=vR(lg('routes',DEF));
let coords=vC(lg('coords',{}));
let qStats=lg('qStats',{});
let done=lg('done',{});
let dark=(function(){var d=lg('dark',null);if(d===null){try{return !!(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches);}catch(e){return false;}}return d;})();

function save(){ls('routes',routes);ls('coords',coords);ls('qStats',qStats);ls('done',done);ls('localTs',Date.now());}

/* ── FIREBASE ── */
let fbOk=false, fbRef=null;
function initFB(){
if(fbOk)return;/*[FIX] niente doppia init*/
if(typeof firebase==='undefined'||!firebase.initializeApp){console.warn('Firebase non caricato');return;}/*[FIX] CDN giù -> esci pulito*/
try{
const cfg={apiKey:"AIzaSyBtVu_bZruWdB3nQz0MhrNmCE7lMonoGd4",authDomain:"ncc-milano-2dbd0.firebaseapp.com",databaseURL:"https://ncc-milano-2dbd0-default-rtdb.europe-west1.firebasedatabase.app",projectId:"ncc-milano-2dbd0",storageBucket:"ncc-milano-2dbd0.firebasestorage.app",messagingSenderId:"511775426532",appId:"1:511775426532:web:785259ec4e187e42aba9f1"};
if(!firebase.apps||!firebase.apps.length)firebase.initializeApp(cfg);/*[FIX] non re-inizializzare se già fatto*/
fbRef=firebase.database().ref('prontuario');fbOk=true;
}catch(e){console.warn('FB init fail',e);}
}
let asTimer=null;
function autoSave(){
if(!fbOk||!fbRef)return;clearTimeout(asTimer);
asTimer=setTimeout(()=>{fbRef.set({routes,coords,qStats,done,qtStats,studyProg,qExamHist,ts:Date.now()}).then(()=>showInd()).catch(()=>{});},4000);
}
function cloudSave(){
if(!fbOk||!fbRef){toast2('⚠️ Firebase non disponibile');return;}
toast2('💾 Salvataggio…');
fbRef.set({routes,coords,qStats,done,qtStats,studyProg,qExamHist,ts:Date.now()}).then(()=>toast2('✅ Salvato su cloud')).catch(()=>toast2('⚠️ Errore cloud'));
}
function syncFromCloud(){
if(!fbOk||!fbRef)return;
const imp=lg('imp',0),localTs=lg('localTs',0);
fbRef.once('value',snap=>{
try{
const d=snap.val();if(!d||!d.ts)return;
if(imp&&imp>d.ts)return;
if(localTs&&localTs>d.ts){toast2('📱 Dati locali più recenti');return;}
if(d.routes){routes=vR(d.routes);}
if(d.coords){coords=vC(d.coords);}
if(d.qStats&&typeof d.qStats==='object'){qStats=d.qStats;}
if(d.done&&typeof d.done==='object'){done=d.done;}
if(d.qtStats&&typeof d.qtStats==='object'){qtStats=d.qtStats;if(!qtStats.cat)qtStats.cat={};if(!qtStats.err)qtStats.err={};if(!qtStats.seenIds)qtStats.seenIds={};ls('qtStats',qtStats);}
if(d.studyProg&&typeof d.studyProg==='object'){studyProg=d.studyProg;ls('studyProg',studyProg);}if(d.qExamHist&&Array.isArray(d.qExamHist)){qExamHist=d.qExamHist;ls('qExamHist',qExamHist);}
save();
if(cur){renderList();rebuildLines();}
if(cur&&map){const k=cur.id+'_'+step;if(coords[k])putMkr(coords[k].lat,coords[k].lon,cur.steps[step],k);}
toast2('☁️ Dati aggiornati dal cloud');
}catch(e){console.warn('sync err',e);}
},()=>{});
}

/* ── DARK ── */
function applyDark(){document.body.classList.toggle('dark',dark);var _di=$id('dkIcon');if(_di)_di.textContent=dark?'☀️':'🌙';/*[FIX] guardia su dkIcon*/}
function togDark(){dark=!dark;ls('dark',dark);applyDark();if(typeof renderDash==='function'&&document.getElementById('quizApp').classList.contains('open'))renderDash();}
applyDark();

/* ── SUONI + VIBRAZIONE ──
   Preferenze salvate: sndOn (suoni), vibOn (vibrazione). Default: entrambi attivi.
   I suoni usano la Web Audio API: nessun file esterno, funzionano offline nella PWA. */
let sndOn=lg('sndOn',true);
let vibOn=lg('vibOn',true);
let _ac=null;
function _audioCtx(){
try{if(!_ac){var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;_ac=new AC();}
if(_ac.state==='suspended')_ac.resume();/* iOS: sblocca l'audio dopo il primo tocco */
return _ac;}catch(e){return null;}
}
/* riproduce una breve nota (o sequenza) senza scatti, con dissolvenza */
function _tone(freq,dur,type,vol,when){
var ac=_audioCtx();if(!ac)return;
try{
var t=when||ac.currentTime;
var o=ac.createOscillator(),g=ac.createGain();
o.type=type||'sine';o.frequency.setValueAtTime(freq,t);
var v=vol==null?.09:vol;
g.gain.setValueAtTime(0.0001,t);
g.gain.exponentialRampToValueAtTime(v,t+0.012); /* attacco morbido */
g.gain.exponentialRampToValueAtTime(0.0001,t+dur); /* rilascio: niente click */
o.connect(g);g.connect(ac.destination);
o.start(t);o.stop(t+dur+0.02);
}catch(e){}
}
/* mappa i tipi ai suoni: 'm'=successo, 'e'=errore, 'win'=celebrazione, default=tap */
function snd(t){
if(!sndOn)return;
var ac=_audioCtx();if(!ac)return;var n=ac.currentTime;
if(t==='m'){ /* successo: due note ascendenti */
_tone(660,.12,'sine',.08,n);_tone(990,.16,'sine',.08,n+.10);
}else if(t==='e'){ /* errore: nota bassa, breve */
_tone(180,.18,'square',.06,n);
}else if(t==='win'){ /* celebrazione: arpeggio allegro */
[523,659,784,1047].forEach(function(f,i){_tone(f,.18,'triangle',.09,n+i*.09);});
}else{ /* tap: click discreto e cortissimo */
_tone(420,.05,'sine',.05,n);
}
}
/* hap = feedback unico (vibrazione + suono) — così tutti i punti esistenti suonano già */
function hap(t){
try{if(vibOn&&navigator.vibrate)navigator.vibrate(t==='m'?20:t==='e'?[10,10,10]:10);}catch(e){}
try{snd(t);}catch(e){}
}
/* toggle da menu impostazioni */
function togSnd(){sndOn=!sndOn;ls('sndOn',sndOn);if(sndOn)snd('m');updateAvToggles();toast2(sndOn?'🔊 Suoni attivati':'🔇 Suoni disattivati');}
function togVib(){vibOn=!vibOn;ls('vibOn',vibOn);if(vibOn&&navigator.vibrate)try{navigator.vibrate(20);}catch(e){}updateAvToggles();toast2(vibOn?'📳 Vibrazione attivata':'📴 Vibrazione disattivata');}
function updateAvToggles(){
var s=document.getElementById('sndIcon');if(s)s.textContent=sndOn?'🔊':'🔇';
var v=document.getElementById('vibIcon');if(v)v.textContent=vibOn?'📳':'📴';
var sb=document.getElementById('sndBtn');if(sb)sb.classList.toggle('on',sndOn);
var vb=document.getElementById('vibBtn');if(vb)vb.classList.toggle('on',vibOn);
}

/* ── MAPPA ── */
let map,mkr=null,dL=null,dDec=null,nL=null,dFlow=null;
let drawTok=0,plIdx=null,cur=null,step=0,mode='s',_firstDraw=false;
let _trail=null,_trailTok=0; /* [FIX] dichiarati qui: clearLines li usa prima del punto originale (TDZ) */
let _prevActive=-1; /* [FIX] dichiarato in cima: selectRoute lo resetta prima del punto originale */
let _revealed=false; /* [PUNTO 3] modalità Cieco: via attiva scoperta solo dopo "Rivela" */
let tx0=0,ty0=0,lastRnd=-1,nmTimer=null;
let userMovedMap=false,_progMove=false; /* [PUNTO 2] rispetto del movimento manuale della mappa */
let _multiTouch=false; /* [FIX pinch] true durante gesti a due dita (zoom) */
let _zooming=false,_lastZoomT=0,_touchN=0; /* [FIX zoom v2] stato zoom mappa */

function initMap(){
map=L.map('map',{zoomControl:false}).setView([45.4642,9.1900],13);
const TILE_LABELS='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
window._tileLayer=L.tileLayer(TILE_LABELS,{attribution:'© OpenStreetMap © CARTO'}).addTo(map);
L.control.zoom({position:'topright'}).addTo(map);
/* [PUNTO 2] rileva quando l'utente muove/zooma la mappa di sua mano: da quel momento non forziamo il ricentraggio */
map.on('dragstart',()=>{userMovedMap=true;});
map.on('zoomstart',(e)=>{_zooming=true;if(!_progMove)userMovedMap=true;});/*[FIX zoom v2] in zoom*/
map.on('zoomend',(e)=>{_zooming=false;_lastZoomT=Date.now();});/*[FIX zoom v2] timestamp fine zoom*/
map.on('movestart',(e)=>{if(!_progMove)userMovedMap=true;});
map.on('click',e=>{
if(plIdx===null||!cur)return;
const k=`${cur.id}_${plIdx}`;coords[k]={lat:e.latlng.lat,lon:e.latlng.lng};
save();autoSave();putMkr(e.latlng.lat,e.latlng.lng,cur.steps[plIdx],k);
rebuildLines();stopPl();renderList();toast2('📍 Salvato');hap('m');
});
var _mapEl=document.getElementById('map');
_mapEl.addEventListener('touchstart',e=>{if(e.touches.length===1){tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;}_touchN=e.touches.length;_multiTouch=e.touches.length>1;},{passive:true});
_mapEl.addEventListener('touchmove',e=>{if(e.touches.length>1){_multiTouch=true;_touchN=e.touches.length;}},{passive:true});
_mapEl.addEventListener('touchend',e=>{
var wasMulti=_multiTouch,started=_touchN;_touchN=e.touches.length;
if(e.touches.length>0){return;} /* dita ancora sullo schermo: non è la fine del gesto */
_multiTouch=false;
if(plIdx!==null)return;
/* [FIX zoom v2] blocca lo swipe se: posizionamento, gesto multi-dito, in zoom, o appena finito uno zoom (<450ms) */
if(wasMulti||started>1||_zooming||(Date.now()-_lastZoomT)<450)return;
const dx=e.changedTouches[0].clientX-tx0,dy=Math.abs(e.changedTouches[0].clientY-ty0);
if(Math.abs(dx)>60&&dy<35){dx<0?nextS():prevS();}/*[FIX zoom v2] soglia un po' più severa*/
},{passive:true});
initDrag();
injectRecenterBtn();/*[PUNTO 2]*/
}
/* [PUNTO 2] crea il pulsante "ricentra" se non esiste già nell'HTML */
function injectRecenterBtn(){
try{
if(document.getElementById('recenterBtn'))return;
const mapEl=document.getElementById('map');if(!mapEl||!mapEl.parentNode)return;
const b=document.createElement('button');
b.id='recenterBtn';b.className='hidden';b.type='button';
b.setAttribute('aria-label','Ricentra sul punto attuale');
b.textContent='◎';
b.onclick=function(ev){try{ev.stopPropagation();}catch(e){}recenterMap();};/*[FIX] il tap non deve arrivare alla mappa (in posizionamento piazzava un marker)*/
mapEl.appendChild(b);/*[FIX] dentro la mappa: resta sempre sopra il pannello, a qualsiasi altezza*/
/* mostra il pulsante quando l'utente muove la mappa, nascondilo dopo il ricentraggio */
map.on('dragstart zoomstart',()=>{if(!_progMove)showRecenter(true);});
map.on('moveend',()=>{if(!userMovedMap)showRecenter(false);});
}catch(e){}
}
function showRecenter(on){var b=document.getElementById('recenterBtn');if(b)b.classList.toggle('hidden',!on);}
/* [FIX grigio] ridisegna la mappa Leaflet quando lo spazio cambia (throttle con rAF) */
let _resizePending=false;
function mapResizeSoon(){
if(_resizePending||!map)return;
_resizePending=true;
requestAnimationFrame(()=>{_resizePending=false;try{map.invalidateSize({pan:false});}catch(e){}});
}
function initDrag(){
const panel=document.getElementById('panel'),h=document.getElementById('pdrag');
const head=document.querySelector('#panel .phead');
if(!panel||window.innerWidth>=768)return;
if(!panel.querySelector('.snap-ticks')){var _t=document.createElement('div');_t.className='snap-ticks';_t.innerHTML='<i></i><i></i><i></i>';panel.appendChild(_t);}/*(6) tacche snap*/
let sy=0,sh=0,dr=false,moved=false,lv=0,lt=0,ly=0;/*[v22] velocità per il momentum*/
function snapVals(){
/* [FIX v7] limite = bordo SUPERIORE reale del dock (robusto anche se flottante),
meno header e 150px di mappa minima. */
var tb=document.getElementById('tabbar');
var top=tb?tb.getBoundingClientRect().top:window.innerHeight;
var hd=document.querySelector('header');var hh=hd?hd.getBoundingClientRect().height:0;
var avail=top-hh-150;
if(avail<220)avail=220;
return[140,Math.round(avail*.58),avail];
}
function applyClosest(curH){const opts=snapVals();let best=opts[0],bd=1e9;opts.forEach(v=>{const d=Math.abs(v-curH);if(d<bd){bd=d;best=v;}});panel.style.maxHeight=best+'px';}
function onStart(e){dr=true;moved=false;sy=e.touches[0].clientY;sh=panel.getBoundingClientRect().height;panel.style.transition='none';panel.classList.add('dragging');}
function onMove(e){
if(!dr)return;
const cy=e.touches[0].clientY,now=performance.now();
if(lt){var dt=now-lt;if(dt>0)lv=(ly-cy)/dt;} /* px/ms, positivo = verso l'alto */
ly=cy;lt=now;
const dy=sy-cy;
const _sv=snapVals();panel.style.maxHeight=Math.min(_sv[_sv.length-1],Math.max(120,sh+dy))+'px';/*[FIX v6] tetto = spazio reale disponibile*/
if(Math.abs(dy)>4)moved=true;
if(moved&&e.cancelable)e.preventDefault(); /* blocca lo scroll pagina solo durante il drag della maniglia */
mapResizeSoon();/*[FIX grigio] aggiorna la mappa mentre il pannello cambia altezza*/
}
function onEnd(){
if(!dr)return;dr=false;panel.style.transition='';panel.classList.remove('dragging');
if(moved){
var hgt=panel.getBoundingClientRect().height,opts=snapVals();
if(Math.abs(lv)>0.45){
/* [v22] MOMENTUM: rilascio veloce → si aggancia allo scatto successivo nella direzione del gesto */
var target=lv>0?opts.find(function(v){return v>hgt+10;}):opts.slice().reverse().find(function(v){return v<hgt-10;});
if(target===undefined)target=lv>0?opts[opts.length-1]:opts[0];
panel.style.maxHeight=target+'px';
}else applyClosest(hgt);
}
lv=0;lt=0;ly=0;
mapResizeSoon();setTimeout(mapResizeSoon,350);/*[FIX grigio] dopo lo snap*/}
/* IMPORTANTE: il drag parte SOLO da maniglia e header, MAI dalla lista (così i tap sulle vie e lo scroll restano liberi) */
[h,head].forEach(el=>{
if(!el)return;
el.addEventListener('touchstart',onStart,{passive:true});
el.addEventListener('touchmove',onMove,{passive:false}); /* non-passive solo sugli elementi-maniglia, non su tutto il documento */
el.addEventListener('touchend',onEnd,{passive:true});
el.addEventListener('touchcancel',onEnd,{passive:true});
});
window.addEventListener('resize',()=>{if(window.innerWidth>=768)panel.style.maxHeight='';});
}
function setTileMode(noLabels){
if(!map||!window._tileLayer)return;
const url=noLabels?'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png':'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
window._tileLayer.setUrl(url);
}
function startPl(i){plIdx=i;document.getElementById('map').classList.add('pl');document.getElementById('plBanner').style.display='block';}
function stopPl(){plIdx=null;document.getElementById('map').classList.remove('pl');document.getElementById('plBanner').style.display='none';}
function putMkr(lat,lon,name,k){
if(mkr){
slideMarker(mkr,[lat,lon]);var _pp=mkr.getPopup();if(_pp)_pp.setContent('<b>'+esc(name)+'</b>');else mkr.bindPopup('<b>'+esc(name)+'</b>');/*[FIX] getPopup() può essere null*/
const pe=mkr.getElement()&&mkr.getElement().querySelector('.pin-emoji');if(pe){pe.style.animation='none';void pe.offsetWidth;pe.style.animation='pinDrop .5s cubic-bezier(.34,1.56,.64,1)';}
}else{
if(!map)return;
try{mkr=L.marker([lat,lon],{draggable:true,icon:pinIcon()}).addTo(map).bindPopup('<b>'+esc(name)+'</b>');
setTimeout(()=>{const pe=mkr&&mkr.getElement()&&mkr.getElement().querySelector('.pin-emoji');if(pe){pe.style.animation='none';void pe.offsetWidth;pe.style.animation='pinDrop .5s cubic-bezier(.34,1.56,.64,1)';}},10);
}catch(e){console.warn('putMkr error:',e);return;}
}
mkr.off('dragend');
mkr.on('dragend',()=>{const p=mkr.getLatLng();coords[k]={lat:p.lat,lon:p.lng};save();autoSave();rebuildLines();renderList();hap();});
mkr.openPopup();
}

/* ── ROUTE ── */
function selectRoute(r){
if(!r||!Array.isArray(r.steps))return;
cur=r;step=0;_prevActive=-1;_revealed=false;userMovedMap=false;if(typeof stopAutoplay==='function')stopAutoplay();/*[FIX] reset _prevActive + [PUNTO 2] tracking pulito + [PUNTO 3] via coperta*/
_firstDraw=true; /* la prossima rebuildLines disegna la linea progressivamente */
if(mkr){try{if(map)map.removeLayer(mkr);}catch(e){}mkr=null;}
cancelDraw();clearLines();stopPl();hideNM();
document.getElementById('pTitle').textContent=r.title;
document.getElementById('sb').value=r.title;
document.getElementById('qfb').textContent='';
document.getElementById('rstBtn').style.display='block';var _pb=document.getElementById('playBtn');if(_pb)_pb.style.display='block';
renderList();updateUI();goStep();closeSugg();
ls('lRId',r.id);ls('lStep',0);
const pts=r.steps.map((_,i)=>coords[r.id+'_'+i]).filter(Boolean);
if(map){
_progMove=true;/*[PUNTO 2] il flyTo iniziale non è "movimento manuale"*/
if(pts.length>1)map.flyToBounds(pts.map(p=>[p.lat,p.lon]),{padding:[40,40],maxZoom:15,duration:.8});
else if(pts.length===1)map.flyTo([pts[0].lat,pts[0].lon],15,{duration:.8});
map.once('moveend',()=>{_progMove=false;});
}
}
function rstRoute(){if(!cur)return;if(typeof stopAutoplay==='function')stopAutoplay();step=0;document.getElementById('qfb').textContent='';renderList();updateUI();goStep();hap();}

/* ── TYPEWRITER ── */
let twInt=null;
function typewrite(el,txt){
if(twInt)clearInterval(twInt);
el.textContent='';el.classList.remove('hid');
let i=0;const sp=Math.max(18,160/txt.length);
twInt=setInterval(()=>{el.textContent+=txt[i++];if(i>=txt.length){clearInterval(twInt);twInt=null;}},sp);
}

/* ── RENDER LIST (ottimizzata: costruisce il DOM una sola volta) ── */
let listRows=[];
function renderList(){
if(!cur)return;
const wm=(qStats[cur.id]||{}).wrong||{};
const c=document.getElementById('sList');const f=document.createDocumentFragment();
listRows=[];
cur.steps.forEach((s,i)=>{
const k=cur.id+'_'+i,hc=!!coords[k];
const d=document.createElement('div');
d.className='sr';
d.onclick=()=>{step=i;syncListActive();updateUI();goStep();hap();};
const n=document.createElement('div');n.className='sn';n.textContent=i+1;
const nm=document.createElement('div');nm.className='sname';nm.textContent=s;
const cb=document.createElement('span');cb.className='cb '+(hc?'s':'u');cb.textContent=hc?'📍':'+';
cb.title=hc?'Rimuovi e riposiziona':'Posiziona';
cb.onclick=ev=>{ev.stopPropagation();step=i;syncListActive();updateUI();goStep();if(hc){delete coords[k];save();autoSave();if(mkr){try{if(map)map.removeLayer(mkr);}catch(e){}mkr=null;}cancelDraw();rebuildLines();renderList();}startPl(i);hap();};
d.appendChild(n);d.appendChild(nm);
let wb=null;
if(wm[i]>0){wb=document.createElement('span');wb.className='wb';wb.textContent=wm[i]+'✗';d.appendChild(wb);}
d.appendChild(cb);
d._nm=nm;d._wb=wb;
if(i<12&&!prefersReducedMotion()){d.classList.add('casc');d.style.animationDelay=(i*0.028)+'s';}/*(18) cascata leggera solo sulle prime righe*/
f.appendChild(d);listRows.push(d);
});
c.innerHTML='';c.appendChild(f);
syncListActive();
}
/* aggiorna SOLO le classi delle righe — non ricostruisce il DOM (rende fluido l'avanti/indietro) */
function syncListActive(){
if(!cur||!listRows.length)return;
const wm=(qStats[cur.id]||{}).wrong||{};
for(let i=0;i<listRows.length;i++){
const d=listRows[i],isA=i===step,isD=i<step,isW=wm[i]>0;
d.classList.toggle('act',isA);
d.classList.toggle('done',isD);
d.classList.toggle('wrg',isW&&!isA);
/* [PUNTO 3] gestione visibilità nome via:
- modalità studio 's': tutto visibile
- modalità cieco 'c': TUTTE coperte; la via attiva si scopre solo dopo "Rivela" (_revealed)
- modalità quiz 'q': come prima (solo l'attiva eventualmente, gestita altrove) */
if(d._nm){
let hide;
if(mode==='s')hide=false;
else if(mode==='c')hide=!(isA&&_revealed); /* attiva visibile solo se rivelata */
else hide=!isA; /* q: nascondi tutte tranne l'attiva */
d._nm.classList.toggle('hid',hide);
}
if(d._wb)d._wb.style.display=(isW&&!isA)?'':'none';
}
/* effetto "evidenziazione che scorre" sulla nuova riga attiva */
if(step!==_prevActive){
const ae=listRows[step];
if(ae&&!prefersReducedMotion()){ae.classList.remove('sweep');void ae.offsetWidth;ae.classList.add('sweep');}
_prevActive=step;
}
const ae=listRows[step];if(ae)ae.scrollIntoView({block:'nearest'});
}
function nextS(){if(!cur||step>=cur.steps.length-1)return;step++;_revealed=false;syncListActive();updateUI();goStep();hap();ls('lStep',step);if(mode!=='q'&&step===cur.steps.length-1)routeFinishCheck();const b=document.getElementById('bNext');if(b){b.style.transform='scale(.88)';setTimeout(()=>b.style.transform='',150);}}/*[PUNTO 3] _revealed=false: la nuova via riparte coperta*/
function prevS(){if(!cur||step<=0)return;if(typeof stopAutoplay==='function')stopAutoplay();step--;_revealed=false;syncListActive();updateUI();goStep();hap();ls('lStep',step);const b=document.getElementById('bPrev');if(b){b.style.transform='scale(.88)';setTimeout(()=>b.style.transform='',150);}}
function revealS(){if(!cur)return;_revealed=true;/*[PUNTO 3] scopre la via attiva*/var _r=listRows[step];if(mode==='c'&&_r&&_r._nm){_r._nm.classList.remove('hid');typewrite(_r._nm,cur.steps[step]);}else{const el=listRows[step]?listRows[step]._nm:null;if(el)typewrite(el,cur.steps[step]);}if(mode==='q'){var _fb=$id('qfb');if(_fb){_fb.textContent=cur.steps[step]||'';_fb.style.color='var(--mu)';}}hap();}
function showNM(){const e=document.getElementById('nmHint');e.style.display='block';clearTimeout(nmTimer);nmTimer=setTimeout(()=>hideNM(),2500);}
function hideNM(){document.getElementById('nmHint').style.display='none';clearTimeout(nmTimer);}
function updateUI(){
if(!cur)return;
const tot=cur.steps.length,pct=tot>1?(step/(tot-1))*100:(tot===1?100:0);
setTxt('pProg',`Via ${step+1} di ${tot}`);
var _pb=$id('pBar');if(_pb)_pb.style.width=pct+'%';
const pl=cur.steps.filter((_,i)=>!!coords[cur.id+'_'+i]).length;
setTxt('pStat',pl+'/'+tot+' 📍'+(done[cur.id]?' ✓':''));
var _bp=$id('bPrev');if(_bp)_bp.disabled=step===0;
var _bn=$id('bNext');if(_bn)_bn.disabled=step===tot-1;
var _bsv=$id('bSV');if(_bsv)_bsv.disabled=!mkr;
var _brv=$id('bRev');if(_brv)_brv.style.display=mode==='c'?'block':'none';
var _nf=$id('nf');if(_nf)_nf.style.display=mode==='q'?'none':'block';
var _qf=$id('qf');if(_qf)_qf.style.display=mode==='q'?'block':'none';
if(mode==='q'){var _qa=$id('qa');if(_qa)_qa.value='';setTxt('qfb','');}
}
let _followTimer=null;
function goStep(){
if(!cur||!map)return;
const k=cur.id+'_'+step;
if(coords[k]){
const lat=coords[k].lat,lon=coords[k].lon;
putMkr(lat,lon,cur.steps[step],k);
followMap(lat,lon); /* [ANTI-LAG] il ricentraggio è deferito e debounced (vedi followMap) */
hideNM();
}
else{if(mkr){try{map.removeLayer(mkr);}catch(e){}mkr=null;}updateUI();showNM();}
rebuildLines();
}
/* [FOLLOW v6 + ANTI-LAG] la mappa segue il percorso mostrando la ZONA:
finestra di 5 tappe (2 precedenti + attuale + 2 successive), zoom clampato
tra 12 e 15 — una via di mezzo: si vede il quartiere, non solo l'incrocio.
Il movimento è debounced: scorrendo veloce si anima solo all'ultima tappa. */
function followMap(lat,lon){
if(!map)return;
clearTimeout(_followTimer);
_followTimer=setTimeout(()=>{
if(!cur||!map)return;
try{
const ll=L.latLng(lat,lon);
const win=[];
for(let di=-2;di<=2;di++){const kk=cur.id+'_'+(step+di);if(coords[kk])win.push([coords[kk].lat,coords[kk].lon]);}
_progMove=true;
if(win.length>1){
const bb=L.latLngBounds(win);
let tz=map.getBoundsZoom(bb,false,L.point(90,90));
if(tz>15)tz=15; /* mai troppo vicino: si vede sempre la zona */
if(tz<12)map.setView(ll,12,{animate:true,duration:.4}); /* tappe lontanissime: resta sul punto, zoom minimo 12 */
else map.setView(bb.getCenter(),tz,{animate:true,duration:.4});
}else{
let z=map.getZoom();if(z<13||z>15)z=14;
map.setView(ll,z,{animate:true,duration:.35});
}
map.once('moveend',()=>{_progMove=false;userMovedMap=false;});
}catch(e){_progMove=false;}
},90);
}
/* [PUNTO 2] pulsante "ricentra": riporta il punto al centro e riattiva il tracking automatico */
function recenterMap(){
if(!cur||!map)return;
const k=cur.id+'_'+step;if(!coords[k])return;
userMovedMap=false;_progMove=true;
try{var _rz=map.getZoom();if(_rz<12)_rz=13;if(_rz>15)_rz=15;map.setView([coords[k].lat,coords[k].lon],_rz,{animate:true,duration:.35});}catch(e){}/*[FIX] zoom coerente col follow (12–15): niente scatto dentro improvviso*/
map.once('moveend',()=>{_progMove=false;});
hap();
}

/* ── LINES (ottimizzata: riusa i layer con setLatLngs invece di ricrearli/rianimarli) ── */
function cancelDraw(){drawTok++;}
function clearLines(){try{clearTimeout(_followTimer);}catch(e){}/*[FIX] annulla il follow in sospeso al cambio percorso*/if(dFlow){try{map.removeLayer(dFlow);}catch(e){}dFlow=null;}if(dDec){try{map.removeLayer(dDec);}catch(e){}dDec=null;}if(dL){try{map.removeLayer(dL);}catch(e){}dL=null;}if(nL){try{map.removeLayer(nL);}catch(e){}nL=null;}if(typeof _trail!=='undefined'&&_trail){try{map.removeLayer(_trail);}catch(e){}_trail=null;_trailTok++;}/*[FIX] pulisce la scia*/}
/* [ANTI-LAG] ricalcola le frecce del percorso al massimo una volta ogni ~140ms:
scorrendo veloce le tappe, il decorator (operazione pesante) non viene rifatto a ogni passo */
let _decorTimer=null;
function decorSoon(line){
clearTimeout(_decorTimer);
_decorTimer=setTimeout(()=>{
try{
if(!map||!line||line!==dL)return;/*[FIX] layer obsoleto (percorso cambiato/eliminato): niente frecce fantasma*/
if(dDec)dDec.setPaths(line);
else dDec=L.polylineDecorator(line,{patterns:[{offset:'6%',repeat:'120px',symbol:L.Symbol.arrowHead({pixelSize:12,pathOptions:{color:getAccent(),weight:2}})}]}).addTo(map);
}catch(e){}
},140);
}
function rebuildLines(){
cancelDraw();
if(!cur||!map){clearLines();return;}
const dn=[],rm=[];
for(let i=0;i<=step;i++){const k=cur.id+'_'+i;if(coords[k])dn.push([coords[k].lat,coords[k].lon]);}
for(let i=step;i<cur.steps.length;i++){const k=cur.id+'_'+i;if(coords[k])rm.push([coords[k].lat,coords[k].lon]);}
/* linea tratteggiata "rimanente" */
if(rm.length>1){
if(nL)nL.setLatLngs(rm);
else nL=L.polyline(rm,{color:'#9aa6b8',weight:3,opacity:.5,dashArray:'1 9',lineCap:'round'}).addTo(map);
}else if(nL){try{map.removeLayer(nL);}catch(e){}nL=null;}
/* linea "fatta" */
if(dn.length>1){
/* riusa il layer se esiste, altrimenti crealo (eventualmente vuoto per l'animazione) */
const wantDraw=_firstDraw&&dn.length>2&&!prefersReducedMotion();
if(!dL)dL=L.polyline(wantDraw?[]:dn,{color:getAccent(),weight:5.5,opacity:.95,lineCap:'round',lineJoin:'round',className:'route-line'}).addTo(map);
else dL.setLatLngs(wantDraw?[]:dn);
if(dFlow)dFlow.setLatLngs(dn);
else dFlow=L.polyline(dn,{color:'#fff',weight:2.5,opacity:.85,lineCap:'round',className:'route-flow'}).addTo(map);
if(!wantDraw)decorSoon(dL); /* [ANTI-LAG] le frecce (decorator) sono costose: aggiornale in modo debounced */
if(wantDraw){
/* disegno progressivo: aggiunge i punti uno alla volta, poi aggiorna le frecce */
const tok=drawTok,ref=dL,snap=dn.slice();let i=0;
if(dFlow)dFlow.setLatLngs([]); /* il flusso bianco compare a disegno finito */
const draw=()=>{
if(drawTok!==tok||!cur){try{if(dFlow&&dFlow.getLatLngs().length===0)dFlow.setLatLngs(snap);}catch(e){}return;}/*[FIX] se interrotto, non lasciare il flusso vuoto*/
if(i<snap.length){try{ref.addLatLng(snap[i++]);}catch(e){return;}setTimeout(draw,34);}
else{try{if(dFlow)dFlow.setLatLngs(snap);}catch(e){}try{if(dDec)dDec.setPaths(ref);}catch(e){}}
};
draw();
}
}else{
if(dL){try{map.removeLayer(dL);}catch(e){}dL=null;}
if(dFlow){try{map.removeLayer(dFlow);}catch(e){}dFlow=null;}
if(dDec){try{map.removeLayer(dDec);}catch(e){}dDec=null;}
}
_firstDraw=false; /* il disegno progressivo vale solo per la prima volta */
}
function prefersReducedMotion(){try{return window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){return false;}}
function openSV(){if(mkr){const p=mkr.getLatLng();window.open(`https://www.google.com/maps?layer=c&cbll=${p.lat},${p.lng}`,'_blank');}}

/* ── CONFETTI ── */
function confetti(){
const c=['#007AFF','#5856D6','#AF52DE','#34C759','#FF9500','#5AC8FA','#FF3B30'];
for(let i=0;i<28;i++){
const e=document.createElement('div');e.className='cp';
const sz=5+Math.random()*8;const isCircle=Math.random()>.5;
e.style.cssText=`left:${10+Math.random()*80}%;top:${20+Math.random()*15}%;width:${sz}px;height:${sz}px;background:${c[i%c.length]};border-radius:${isCircle?'50%':'3px'};animation-delay:${Math.random()*.5}s;animation-duration:${.7+Math.random()*.7}s;transform:rotate(${Math.random()*360}deg)`;
document.body.appendChild(e);setTimeout(()=>e.remove(),1500);
}
try{if(vibOn&&navigator.vibrate)navigator.vibrate(20);}catch(e){}
snd('win'); /* suono festoso di celebrazione */
}

/* ── MODE (route study) ── */
function setMode(m){
mode=m;_revealed=false;/*[PUNTO 3] cambiando modalità la via riparte coperta in cieco*/
const btns={s:'cSt',c:'cCi',q:'cQu'};const seg=document.getElementById('segCtrl');const thumb=document.getElementById('segThumb');
Object.keys(btns).forEach(k=>{document.getElementById(btns[k]).classList.toggle('on',k===m);});
if(seg&&thumb){const idx={s:0,c:1,q:2}[m]||0;const btnsEl=seg.querySelectorAll('.seg-btn');if(btnsEl[idx]){const btn=btnsEl[idx];thumb.style.left=btn.offsetLeft+'px';thumb.style.width=btn.offsetWidth+'px';}}
if(cur)renderList();updateUI();
setTileMode(m==='c'||m==='q');
if(m==='q')setTimeout(()=>document.getElementById('qa').focus(),100);ls('lMode',m);
hap();
}
function initSegThumb(){const seg=document.getElementById('segCtrl');const thumb=document.getElementById('segThumb');if(!seg||!thumb)return;const active=seg.querySelector('.seg-btn.on')||seg.querySelector('.seg-btn');if(active){thumb.style.left=active.offsetLeft+'px';thumb.style.width=active.offsetWidth+'px';}}
window.addEventListener('resize',()=>{clearTimeout(window._segResizeT);window._segResizeT=setTimeout(initSegThumb,80);},{passive:true});

/* ── QUIZ VIE (route study, text input) ── */
function norm(s){
s=String(s||'').toUpperCase();
s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,''); /* accenti -> base: CITTA'/città -> CITTA */
s=s.replace(/['’‘`´]/g,''); /* apostrofi via: D'ESTE -> DESTE */
s=s.replace(/\./g,''); /* punti via: V.LE->VLE, P.ZA->PZA, P.LE->PLE */
s=s.replace(/[,\/_–—-]/g,' ').replace(/\s+/g,' ').trim();
var MAP={VIALE:'VLE',VLE:'VLE',PIAZZA:'PZA',PZA:'PZA',PIAZZALE:'PLE',PLE:'PLE',
LARGO:'LGO',LGO:'LGO',CORSO:'CSO',CSO:'CSO',VICOLO:'VLO',VLO:'VLO',
STRADA:'STR',STR:'STR',GALLERIA:'GALL',GALL:'GALL',
SAN:'S',SANT:'S',SANTO:'S',SANTA:'S',SS:'S'};
return s.split(' ').map(function(w){return MAP[w]||w;}).join(' ');
}
function checkQ(){
if(!cur)return;
var _qael=document.getElementById('qa');const raw=_qael?_qael.value:'';if(!raw.trim())return;
const ans=norm(raw),cor=norm(cur.steps[step]);const fb=document.getElementById('qfb');if(!fb)return;/*[FIX] guardia su fb*/
if(!qStats[cur.id])qStats[cur.id]={correct:0,total:0,wrong:{}};
if(!qStats[cur.id].wrong)qStats[cur.id].wrong={};
qStats[cur.id].total++;
if(ans===cor){
fb.textContent='✅ Corretto!';fb.style.color='var(--ok)';
fb.style.animation='none';void fb.offsetWidth;fb.style.animation='fu .25s cubic-bezier(.34,1.3,.64,1)';
qStats[cur.id].correct++;save();autoSave();hap('m');
if(step===cur.steps.length-1){routeCelebrate();}
else{var _rid=cur.id,_st=step;setTimeout(function(){if(cur&&cur.id===_rid&&mode==='q'&&step===_st)nextS();},600);}/*[FIX] evita avanzamento se cambia percorso/modalità*/
}else{
fb.textContent='❌ '+cur.steps[step];fb.style.color='var(--err)';
fb.style.animation='none';void fb.offsetWidth;fb.style.animation='fu .2s ease';
qStats[cur.id].wrong[step]=(qStats[cur.id].wrong[step]||0)+1;save();autoSave();hap('e');
}
}
function skipQ(){
if(!cur)return;
const fb=document.getElementById('qfb');if(fb){fb.textContent='→ '+cur.steps[step];fb.style.color='var(--warn)';}
if(!qStats[cur.id])qStats[cur.id]={correct:0,total:0,wrong:{}};
qStats[cur.id].total++;save();autoSave();
if(step===cur.steps.length-1){routeCelebrate();}
else{var _rid=cur.id,_st=step;setTimeout(function(){if(cur&&cur.id===_rid&&mode==='q'&&step===_st)nextS();},600);}/*[FIX]*/
}

/* ── SEARCH (con focus = mostra tutti i percorsi) ── */
let srchT=null;
function onSrch(){clearTimeout(srchT);srchT=setTimeout(doSrch,150);}
function onSrchFocus(){const v=document.getElementById('sb').value.trim();if(!v)showAllRoutes();else doSrch();sbArrowSet(true);}
function sbArrowSet(open){var ar=document.getElementById('sbArrow');if(ar)ar.classList.toggle('open',!!open);}
function toggleRouteList(e){
if(e){e.preventDefault();e.stopPropagation();}
const ul=document.getElementById('sugg');
if(ul.style.display==='block'){ul.style.display='none';sbArrowSet(false);}
else{showAllRoutes();sbArrowSet(true);}
}
function showAllRoutes(){
const ul=document.getElementById('sugg');ul.innerHTML='';
const f=document.createDocumentFragment();
const hd=document.createElement('li');hd.className='sg-hd';hd.textContent=routes.length+' percorsi salvati';f.appendChild(hd);
[...routes].sort((a,b)=>((b.fav?1:0)-(a.fav?1:0))||a.title.localeCompare(b.title)).forEach(r=>{
const li=document.createElement('li');
const pl=r.steps.filter((_,i)=>!!coords[r.id+'_'+i]).length;
const t=document.createElement('span');t.textContent=r.title;
const m=document.createElement('span');m.className='si-meta';m.textContent=r.steps.length+' vie'+(done[r.id]?' · ✓':'');
li.appendChild(t);li.appendChild(m);
li.onmousedown=e=>e.preventDefault();
li.onclick=()=>selectRoute(r);f.appendChild(li);
});
ul.appendChild(f);ul.style.display='block';
}
function doSrch(){
const q=document.getElementById('sb').value.toUpperCase().trim();
const ul=document.getElementById('sugg');ul.innerHTML='';
if(!q){showAllRoutes();return;}
const res=routes.filter(r=>r.title.includes(q)||r.steps.some(s=>s.includes(q))).slice(0,12);
const f=document.createDocumentFragment();
if(res.length){res.forEach(r=>{const li=document.createElement('li');const t=document.createElement('span');t.textContent=r.title;const m=document.createElement('span');m.className='si-meta';m.textContent=r.steps.length+' vie';li.appendChild(t);li.appendChild(m);li.onmousedown=e=>e.preventDefault();li.onclick=()=>selectRoute(r);f.appendChild(li);});}
else{const li=document.createElement('li');li.textContent='Nessun risultato';li.style.cssText='color:var(--mu);cursor:default';f.appendChild(li);}
ul.appendChild(f);ul.style.display='block';
}
function closeSugg(){document.getElementById('sb').value=cur?cur.title:'';document.getElementById('sugg').style.display='none';sbArrowSet(false);}
function rndRoute(){if(!routes.length)return;let i;if(routes.length===1)i=0;else do{i=Math.floor(Math.random()*routes.length);}while(i===lastRnd);lastRnd=i;selectRoute(routes[i]);hap();}

/* ── MENU ── */
let _menuLock=false;
function togMenu(){if(_menuLock)return;_menuLock=true;setTimeout(()=>_menuLock=false,300);document.getElementById('omenu').classList.toggle('open');}
function cm(){document.getElementById('omenu').classList.remove('open');}
document.addEventListener('click',e=>{const mw=document.querySelector('.mwrap');if(mw&&!mw.contains(e.target))cm();const sw=document.querySelector('.sw');if(sw&&!sw.contains(e.target)){document.getElementById('sugg').style.display='none';sbArrowSet(false);}});
function closeAllM(){['addModal','mgrModal','stModal','wrModal'].forEach(id=>document.getElementById(id).classList.remove('open'));}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
/* [FIX] helper per accessi DOM sicuri (evita crash se l'elemento manca) */
function $id(id){return document.getElementById(id);}
function setTxt(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
function setHTML(id,v){var e=document.getElementById(id);if(e)e.innerHTML=v;}

/* ── ADD MODAL ── */
let mMap=null,mobMap=null,mTC={},mPrev=[],mSel=null,mEId=null,mMkrs=[];
function isDesk(){return window.innerWidth>=768;}
function openAdd(eid=null){
stopPl();mEId=eid;mTC={};mSel=null;mPrev=[];
document.getElementById('addModal').classList.add('open');
document.getElementById('mSList').innerHTML='';
document.getElementById('mma').classList.remove('open');
document.getElementById('mtBtn').textContent='🗺️ Mostra mappa per posizionare';
document.getElementById('mmH').classList.remove('show');document.getElementById('mmobH').classList.remove('show');
if(eid){
const r=routes.find(r=>r.id===eid);
if(r){
document.getElementById('mRT').value=r.title;
document.getElementById('mRS').value=r.steps.join('\n');
document.getElementById('mTitle').textContent='✏️ Modifica Percorso';
r.steps.forEach((_,i)=>{const k=eid+'_'+i;if(coords[k])mTC[i]={...coords[k]};});
mPrev=[...r.steps];
}
}else{
document.getElementById('mRT').value='';document.getElementById('mRS').value='';
document.getElementById('mTitle').textContent='➕ Nuovo Percorso';
}
parseMSteps();setTimeout(()=>{if(isDesk())initMMap();},150);
}
function initMMap(){try{if(!mMap){mMap=L.map('mm',{zoomControl:true}).setView([45.4642,9.1900],13);L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CARTO'}).addTo(mMap);mMap.on('click',onMClick);}else mMap.invalidateSize();refMkrs(mMap);zoomMMap(mMap);}catch(e){console.warn('initMMap error:',e);}}
function initMobMap(){try{if(!mobMap){mobMap=L.map('mmob',{zoomControl:true}).setView([45.4642,9.1900],13);L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CARTO'}).addTo(mobMap);mobMap.on('click',onMClick);}else mobMap.invalidateSize();refMkrs(mobMap);zoomMMap(mobMap);}catch(e){console.warn('initMobMap error:',e);}}
function zoomMMap(tm){const pts=Object.values(mTC).filter(Boolean);if(pts.length>1)tm.fitBounds(pts.map(p=>[p.lat,p.lon]),{padding:[30,30],maxZoom:15});else if(pts.length===1)tm.setView([pts[0].lat,pts[0].lon],15);}
function refMkrs(tm){mMkrs.forEach(m=>{try{tm.removeLayer(m);}catch(e){}});mMkrs=[];getMSteps().forEach((s,i)=>{if(!mTC[i])return;const m=L.marker([mTC[i].lat,mTC[i].lon],{draggable:true}).bindPopup('<b>'+esc(s)+'</b>').addTo(tm);m.on('dragend',()=>{const p=m.getLatLng();mTC[i]={lat:p.lat,lon:p.lng};renderMList();});mMkrs.push(m);});}
function onMClick(e){if(mSel===null)return;const steps=getMSteps();if(mSel>=steps.length)return;mTC[mSel]={lat:e.latlng.lat,lon:e.latlng.lng};const am=isDesk()?mMap:mobMap;if(am)refMkrs(am);renderMList();document.getElementById('mmH').classList.remove('show');document.getElementById('mmobH').classList.remove('show');const nx=steps.findIndex((_,i)=>i>mSel&&!mTC[i]);if(nx!==-1)selMStep(nx);else mSel=null;hap();}
function getMSteps(){return document.getElementById('mRS').value.split('\n').map(l=>l.trim().toUpperCase()).filter(l=>l);}
function onMSChange(){
const ns=getMSteps();
if(mPrev.length>0&&Object.keys(mTC).length>0){
const nc={};
ns.forEach((s,i)=>{if(mTC[i]!==undefined){if(mPrev[i]===s){nc[i]=mTC[i];}}});
const nameCount={};mPrev.forEach(s=>{nameCount[s]=(nameCount[s]||0)+1;});
ns.forEach((s,i)=>{if(nc[i]===undefined){if(nameCount[s]===1){const pi=mPrev.indexOf(s);if(pi!==-1&&mTC[pi]!==undefined)nc[i]=mTC[pi];}}});
const lost=Object.keys(mTC).length-Object.keys(nc).length;if(lost>0)toast2('⚠️ '+lost+' marker rimossi (via modificata)');
mTC=nc;
}
mPrev=[...ns];renderMList();const am=isDesk()?mMap:mobMap;if(am)refMkrs(am);
}
function parseMSteps(){mPrev=getMSteps();renderMList();}
function renderMList(){
const steps=getMSteps(),c=document.getElementById('mSList');const lbl=document.getElementById('mSLbl');
if(lbl)lbl.textContent=`Passi (${steps.length}) — clicca per posizionare`;
if(!steps.length){c.innerHTML='<div style="color:var(--mu);font-size:13px;padding:8px 0">Inserisci le vie sopra…</div>';return;}
const f=document.createDocumentFragment();
steps.forEach((s,i)=>{
const pl=!!mTC[i],isSel=mSel===i;
const d=document.createElement('div');d.className='msi'+(isSel?' sel':'')+(pl?' plc':'');
d.onclick=()=>{pl?remMCoord(i):selMStep(i);};
const n=document.createElement('div');n.className='msn';n.textContent=i+1;
const nm=document.createElement('div');nm.className='msname';nm.textContent=s;
const b=document.createElement('span');b.className='msbadge '+(pl?'ok':'pin');
b.textContent=pl?'📍 ✕':(isSel?'⬅️ clicca mappa':'Non posizionato');
d.appendChild(n);d.appendChild(nm);d.appendChild(b);f.appendChild(d);
});
c.innerHTML='';c.appendChild(f);
}
function remMCoord(i){delete mTC[i];const am=isDesk()?mMap:mobMap;if(am)refMkrs(am);selMStep(i);}
function selMStep(i){mSel=i;renderMList();const steps=getMSteps();const name=steps[i]||'(via '+(i+1)+')';const hint='Clicca sulla mappa: '+name;document.getElementById('mmH').textContent=hint;document.getElementById('mmH').classList.add('show');document.getElementById('mmobH').textContent=hint;document.getElementById('mmobH').classList.add('show');}
function togMMap(){const a=document.getElementById('mma'),b=document.getElementById('mtBtn');const o=a.classList.toggle('open');b.textContent=o?'🗺️ Nascondi mappa':'🗺️ Mostra mappa per posizionare';if(o)setTimeout(()=>initMobMap(),100);}
function closeAdd(){document.getElementById('addModal').classList.remove('open');mSel=null;document.getElementById('mmH').classList.remove('show');document.getElementById('mmobH').classList.remove('show');}
function savRoute(){
const title=document.getElementById('mRT').value.trim().toUpperCase();const steps=getMSteps();
if(!title){toast2('⚠️ Inserisci un titolo');return;}
if(!steps.length){toast2('⚠️ Inserisci almeno una via');return;}
const uniq=new Set(steps);if(uniq.size<steps.length)toast2('⚠️ Ci sono '+(steps.length-uniq.size)+' vie duplicate');
const btn=document.querySelector('#addModal .bsv');if(btn){btn.disabled=true;setTimeout(()=>{if(btn)btn.disabled=false;},1500);}
let rid;
if(mEId){
rid=mEId;const idx=routes.findIndex(r=>r.id===mEId);
if(idx===-1){routes.push({id:rid,title,steps});/*[FIX dup] stesso id: ricrearlo con id nuovo generava un duplicato coi pin orfani*/}
else{routes[idx].title=title;routes[idx].steps=steps;Object.keys(coords).forEach(k=>{if(k.startsWith(rid+'_')){const si=parseInt(k.split('_').pop(),10);if(si>=steps.length)delete coords[k];}});}
}else{rid='r_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,5);routes.push({id:rid,title,steps});}
steps.forEach((_,i)=>{if(mTC[i])coords[rid+'_'+i]=mTC[i];});
try{save();autoSave();}catch(e){console.warn('save error:',e);}
closeAdd();
try{const sv=routes.find(r=>r.id===rid);if(sv)selectRoute(sv);}catch(e){console.warn('selectRoute error:',e);}
toast2('✅ Percorso salvato');hap('m');
}

/* ── MANAGER ── */
let srtMode='name';const srtM=['name','pct','studied'];const srtL=['↕ Nome','↕ Completamento','↕ Studiati'];
function cycSort(){srtMode=srtM[(srtM.indexOf(srtMode)+1)%srtM.length];document.getElementById('srtBtn').textContent=srtL[srtM.indexOf(srtMode)];renderMgr();}
function openMgr(){const m=document.getElementById('mgrModal');const box=m.querySelector('.mbox');if(box){box.style.animation='none';void box.offsetWidth;box.style.animation='bsShow .35s cubic-bezier(.4,0,.2,1)';}m.classList.add('open');document.getElementById('mgrF').value='';renderMgr();}
function renderMgr(){
const q=(document.getElementById('mgrF').value||'').toUpperCase();
let list=q?routes.filter(r=>r.title.includes(q)||r.steps.some(s=>s.includes(q))):[...routes];
if(srtMode==='name')list.sort((a,b)=>a.title.localeCompare(b.title));
else if(srtMode==='pct')list.sort((a,b)=>{const pa=a.steps.length?a.steps.filter((_,i)=>!!coords[a.id+'_'+i]).length/a.steps.length:0;const pb=b.steps.length?b.steps.filter((_,i)=>!!coords[b.id+'_'+i]).length/b.steps.length:0;return pb-pa;});
else list.sort((a,b)=>((qStats[b.id]||{}).total||0)-((qStats[a.id]||{}).total||0));
document.getElementById('mgrCnt').textContent=list.length+' di '+routes.length+' percors'+(routes.length===1?'o':'i');
const c=document.getElementById('mgrList');
if(!list.length){c.innerHTML='<div class="emp"><div class="e">🔍</div><p>Nessun percorso trovato</p></div>';return;}
const f=document.createDocumentFragment();
list.forEach(r=>{
const pl=r.steps.filter((_,i)=>!!coords[r.id+'_'+i]).length;
const qs=qStats[r.id],pct=qs&&qs.total?Math.round(qs.correct/qs.total*100):null;
const d=document.createElement('div');d.className='ri'+(done[r.id]?' dn':'');
d.onclick=()=>{selectRoute(r);closeMgr();hap();};
d.innerHTML=`<div class="rii"><div class="rit">${esc(r.title)}</div><div class="rim">${pl}/${r.steps.length} 📍${pct!==null?' · Quiz '+pct+'%':''}</div></div><div class="ria" onclick="event.stopPropagation()"><button class="rab rfb" onclick="togFav('${r.id}')">${r.fav?'★':'☆'}</button><button class="rab rcb" onclick="dupRoute('${r.id}')" title="Duplica">📄</button><button class="rab reb" onclick="openAdd('${r.id}');closeMgr()">✏️</button><button class="rab rdb" onclick="delRoute('${r.id}')">🗑️</button></div>`;
f.appendChild(d);
});
c.innerHTML='';c.appendChild(f);
}
function closeMgr(){document.getElementById('mgrModal').classList.remove('open');}
function delRoute(id){
if(!confirm('Eliminare?'))return;
var _bk={route:routes.find(r=>r.id===id),coords:{},qStats:qStats[id],done:done[id]};
Object.keys(coords).forEach(k=>{if(k.startsWith(id+'_'))_bk.coords[k]=coords[k];});
routes=routes.filter(r=>r.id!==id);
Object.keys(coords).forEach(k=>{if(k.startsWith(id+'_'))delete coords[k];});
delete qStats[id];delete done[id];
try{rDelMark(id);}catch(e){}/*[FIX dup] lapide: la cancellazione vince su ogni dispositivo*/
save();autoSave();
undoToast('Percorso eliminato',function(){if(_bk.route){routes.push(_bk.route);Object.assign(coords,_bk.coords);if(_bk.qStats)qStats[id]=_bk.qStats;if(_bk.done)done[id]=_bk.done;try{rDelUnmark(id);}catch(e){}save();autoSave();renderMgr();toast2('↩️ Ripristinato');}});
if(cur&&cur.id===id){cur=null;step=0;_prevActive=-1;setTxt('pTitle','NCC Milano');setHTML('sList','');listRows=[];setTxt('pProg','Seleziona un percorso');var _pbar=$id('pBar');if(_pbar)_pbar.style.width='0%';var _rb=$id('rstBtn');if(_rb)_rb.style.display='none';var _pb2=$id('playBtn');if(_pb2)_pb2.style.display='none';if(typeof stopAutoplay==='function')stopAutoplay();setTxt('pStat','');if(mkr){try{if(map)map.removeLayer(mkr);}catch(e){}mkr=null;}cancelDraw();clearLines();}/*[FIX] reset step/_prevActive + DOM sicuro*/
renderMgr();
}

/* ── STATS VIE ── */
function openStats(){
document.getElementById('stModal').classList.add('open');
const b=document.getElementById('stBody');b.innerHTML='';
const items=routes.map(r=>({r,qs:qStats[r.id]})).filter(x=>x.qs&&x.qs.total>0).sort((a,b)=>b.qs.correct/b.qs.total-a.qs.correct/a.qs.total);
if(!items.length){b.innerHTML='<div class="emp"><div class="e">📊</div><p>Nessuna sessione quiz vie.</p></div>';return;}
let tc=0,tt=0;const f=document.createDocumentFragment();
items.forEach(({r,qs})=>{tc+=qs.correct;tt+=qs.total;const pct=Math.round(qs.correct/qs.total*100);const col=pct>=80?'var(--ok)':pct>=50?'var(--warn)':'var(--err)';const row=document.createElement('div');row.className='strow';row.innerHTML=`<span class="stlbl">${esc(r.title)}</span><span class="stval" style="color:${col}">${pct}% <small style="font-size:12px;color:var(--mu)">(${qs.correct}/${qs.total})</small></span>`;f.appendChild(row);});
if(tt>0){const pct=Math.round(tc/tt*100);const tot=document.createElement('div');tot.className='strow';tot.style.cssText='border-bottom:2px solid var(--bd);margin-bottom:4px';tot.innerHTML=`<span class="stlbl" style="font-weight:800;color:var(--tx)">📊 Totale</span><span class="stval">${pct}% (${tc}/${tt})</span>`;b.appendChild(tot);}
b.appendChild(f);
}
function closeSt(){document.getElementById('stModal').classList.remove('open');}

/* ── WRONG VIE ── */
let wrList=[];
function openWrong(){
document.getElementById('wrModal').classList.add('open');
const b=document.getElementById('wrBody');b.innerHTML='';wrList=[];
routes.forEach(r=>{const qs=qStats[r.id];if(!qs||!qs.wrong)return;Object.entries(qs.wrong).forEach(([si,cnt])=>{const i=parseInt(si,10);if(cnt>0&&i<r.steps.length)wrList.push({r,i,cnt});});});
wrList.sort((a,b)=>b.cnt-a.cnt);
if(!wrList.length){b.innerHTML='<div class="emp"><div class="e">🎉</div><p>Nessun errore registrato!</p></div>';document.getElementById('wrBtn').style.display='none';return;}
const f=document.createDocumentFragment();
wrList.forEach(({r,i,cnt})=>{const row=document.createElement('div');row.className='strow';row.innerHTML=`<span class="stlbl">${esc(r.title)} → ${esc(r.steps[i])}</span><span class="wb">${cnt}✗</span>`;f.appendChild(row);});
b.appendChild(f);document.getElementById('wrBtn').style.display='block';
}
function closeWr(){document.getElementById('wrModal').classList.remove('open');}
function startWr(){if(!wrList.length)return;closeWr();selectRoute(wrList[0].r);step=wrList[0].i;setMode('q');renderList();updateUI();goStep();toast2('🔁 Ripasso avviato');}

/* ── EXPORT / IMPORT / RESET ── */
function doReset(){
if(!confirm('Cancellare tutti i dati locali E su cloud?\n\nVerrà prima scaricato un backup di sicurezza.'))return;
try{doExport();}catch(e){}
setTimeout(function(){
try{localStorage.clear();}catch(e){}
if(fbOk&&fbRef)fbRef.remove().finally(()=>location.reload());else location.reload();
},600);
}
function doExport(){
const j=JSON.stringify({routes,coords,qStats,done,qtStats,studyProg,qExamHist},null,2);const b=new Blob([j],{type:'application/json'});
try{const file=new File([b],'ncc_backup.json',{type:'application/json'});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:'Backup NCC'}).catch(()=>{});return;}}catch(e){}
const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ncc_backup.json';document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function doImport(){
const inp=document.createElement('input');inp.type='file';inp.accept='.json';inp.style.cssText='position:fixed;top:-100px;left:-100px;opacity:0';document.body.appendChild(inp);
inp.onchange=e=>{const file=e.target.files[0];if(!file){document.body.removeChild(inp);return;}const r=new FileReader();
r.onload=()=>{try{const d=JSON.parse(r.result);if(d.routes)routes=vR(d.routes);if(d.coords)coords=vC(d.coords);if(d.qStats&&typeof d.qStats==='object')qStats=d.qStats;if(d.done&&typeof d.done==='object')done=d.done;if(d.qtStats&&typeof d.qtStats==='object'){qtStats=d.qtStats;ls('qtStats',qtStats);}if(d.studyProg&&typeof d.studyProg==='object'){studyProg=d.studyProg;ls('studyProg',studyProg);}if(d.qExamHist&&Array.isArray(d.qExamHist)){qExamHist=d.qExamHist;ls('qExamHist',qExamHist);}ls('imp',Date.now());save();if(fbOk&&fbRef)fbRef.set({routes,coords,qStats,done,qtStats,studyProg,qExamHist,ts:Date.now()}).then(()=>{toast2('✅ Importato e salvato su cloud');setTimeout(()=>location.reload(),1000);}).catch(()=>{toast2('✅ Importato (solo locale)');setTimeout(()=>location.reload(),1000);});else{toast2('✅ Importato');setTimeout(()=>location.reload(),1000);}}catch{toast2('⚠️ File non valido');}document.body.removeChild(inp);};
r.readAsText(file);};
inp.click();
}
let tTimer=null;
function toast2(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove('show'),2400);}
function showInd(){const e=document.getElementById('sInd');e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1500);}
function checkPwa(){try{const isIos=/iphone|ipad|ipod/i.test(navigator.userAgent);const isStandalone=window.navigator.standalone===true;if(isIos&&!isStandalone&&!lg('pwaDismissed',false)){setTimeout(()=>{const b=document.getElementById('pwaBanner');b.style.display='block';void b.offsetWidth;b.classList.add('visible');},3000);}}catch(e){}}
function closePwa(){document.getElementById('pwaBanner').style.display='none';ls('pwaDismissed',true);}

/* ── HOME NAV ── */
function goTopografia(){setAccent('topo');const h=document.getElementById('homeScreen');if(h)h.style.display='none';const hb=document.getElementById('homeBtn');if(hb)hb.style.display='flex';try{if(map)map.invalidateSize();}catch(e){}var _lm=lg('lMode','s');setMode(_lm==='q'?'s':_lm);/*[FIX v5] ripristina l'ultima modalità (mai 'q' all'avvio)*/[60,250,500].forEach(t=>setTimeout(mapResizeSoon,t));/*[FIX grigio] la mappa misura bene solo a layout stabilizzato*/try{pushTrap();}catch(e){}}
function goHome(){closeQuiz();setAccent('');if(typeof stopAutoplay==='function')stopAutoplay();const hb=document.getElementById('homeBtn');if(hb)hb.style.display='none';const h=document.getElementById('homeScreen');if(h)h.style.display='flex';try{showStreak();renderReadiness();}catch(e){}}
function goQuiz(){openQuiz();}

/* ════════════ QUIZ TEORICO — app d'esame ════════════ */
let QUIZ_ALL=[], qBuilt=false, qCurView='dash', qSel={}, Q=null, lastQuiz=null;
let qtStats=lg('qtStats',{cat:{},err:{}});
let qExamHist=lg('qExamHist',[]);if(!Array.isArray(qExamHist))qExamHist=[];
if(!qtStats.cat)qtStats.cat={}; if(!qtStats.err)qtStats.err={}; if(!qtStats.seenIds)qtStats.seenIds={}; if(!qtStats.bm)qtStats.bm={}; if(!qtStats.report)qtStats.report={};
function qtSave(){ls('qtStats',qtStats);ls('localTs',Date.now());try{autoSave();}catch(e){}}

/* 4 argomenti ufficiali — per gli errori d'esame (max 2 per argomento) */
const QARG=[
{id:'geo', label:'Geografia', emoji:'🗺️',bg:'rgba(43,89,195,.12)'},
{id:'norm', label:'Normativa', emoji:'⚖️',bg:'rgba(88,86,214,.12)'},
{id:'reg', label:'Regolamento', emoji:'📋',bg:'rgba(175,82,222,.12)'},
{id:'lingua',label:'Lingua Straniera', emoji:'🌍',bg:'rgba(52,199,89,.14)'}
];
/* sotto-argomenti raggruppati (schermata "Scegli gli argomenti") */
const QGROUPS=[
{arg:'geo',title:'Geografia',emoji:'🗺️',subs:[
{id:'geo_terr',label:'Laghi, Fiumi, Località, Monumenti e Abitanti'},
{id:'geo_vie', label:'Strade Statali, Autostrade, Stazioni FS e Metro'}
]},
{arg:'norm',title:'Normativa Statale e Regionale',emoji:'⚖️',subs:[
{id:'norm_legge',label:'Legge n. 21 del 1992 e Leggi Regionali'},
{id:'norm_aero', label:'Servizio Taxi nel Bacino Aeroportuale e Tariffe'}
]},
{arg:'reg',title:'Regolamento Comunale e Norme di Comportamento',emoji:'📋',subs:[
{id:'reg_com',label:'Regolamento TAXI e NCC Comune di Milano'},
{id:'reg_dov',label:'Obblighi e Doveri del Conducente'}
]},
{arg:'lingua',title:'Lingua Straniera',emoji:'🌍',subs:[
{id:'lingua',label:'Inglese'}
]}
];
const SUB2ARG={geo_terr:'geo',geo_vie:'geo',norm_legge:'norm',norm_aero:'norm',reg_com:'reg',reg_dov:'reg',lingua:'lingua'};

function qShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ── classificazione argomenti ── */
const RX_ITAL=/[àèéìòù]|\b(che|della|dello|degli|delle|conducente|vettura|servizio|licenza|tassametro|deve|essere|quale|nel|con|per|tra|gli|una|come|del|non|sono|più|può|cosa|dove|si|il|la|le|di|da|in|un|è)\b/i;
const RX_ENG=/\b(the|what|where|when|which|who|whose|is|are|am|was|were|you|your|my|his|her|their|its|please|how|good|morning|evening|night|o.clock|quarter|past|half|thank|thanks|hello|airport|station|street|road|turn|left|right|straight|much|many|there|here|near|far|did|do|does|would|could|should|will|shall|they|we|some|any|this|that|these|those|have|has|had|going|want|need|take|took|give|gave|tell|told|say|said|excuse|sorry|welcome|ticket|luggage|change|wait|stop|go|come|see|look|find|cost|fare|name|from|to|at|on|of|with|for|and|or|but|an|one|two|three|four|five|six|seven|eight|nine|ten|men|women|man|woman|child|son|room|book|car|house|english|coffee|cinema|gym|sister|brother)\b/gi;
function isEng(t){return !RX_ITAL.test(t) && (t.toLowerCase().match(RX_ENG)||[]).length>=2;}
const RX_GEO=/(dove si trova|dove sono|in quale provincia|capoluogo|\blago\b|laghi|\bfiume\b|fiumi|\bmonte\b|\bmonti\b|\bvalle\b|\bvalli\b|\bpasso\b|valico|ghiacciaio|abitant|popolazione|strada statale|\bs\.?s\.?\s*n|statale n|autostrad|\ba\.?\d|tangenzial|raccordo|stazione f|stazione di|stazione centrale|metropolitan|\blinea m\d|basilica|\bduomo\b|santuario|monumento|castello|abbazia|chiesa di|attravers|sfocia|affluent|sorge|brianza|valtellina|appennino|\balpi\b|prealpi|sempione|adda|ticino|lambro|olona|\bpo\b)/i;
const RX_GEOVIE=/strada statale|\bs\.?s\.?\s*n|statale n|\bss\b|autostrad|\ba\.?\d|tangenzial|raccordo|stazione f|stazione di|stazione centrale|metropolitan|\blinea m\d|\bmetro\b/i;
const RX_TAXI=/conducente|vettura|tassametro|\bcorsa\b|posteggio|stazionament|licenz|autorizzazione|noleggio|cliente|utente|titolare/i;
const RX_GEOSTRONG=/lago|fiume|monte|valle|dove si trova|autostrad|statale|stazione|metropolitan|abitant|basilica|duomo|provincia|\bpo\b|adda|ticino/i;
function isGeo(t){if(!RX_GEO.test(t))return false;if(RX_TAXI.test(t)&&!RX_GEOSTRONG.test(t))return false;return true;}
const RX_NORM=/\blegge\b|\bleggi\b|legge n|n\.?\s*21|1992|decreto|regional|sanzion|amministrat|autorizzazione|licenz|\bruolo\b|commission|requisit|revoca|sospension|\bart\.|\bcomma\b|regione lombardia/i;
const RX_AERO=/aeroport|bacino|malpensa|linate|\borio\b|tariff|supplement/i;
const RX_DOV=/dover|obblig|vietato|\bdeve\b|comportament|conteg|fumare|animal|bagagli|cortesia|disabil|portiera|pulizia|divisa|targhett/i;
function classifySub(t){
if(isEng(t))return 'lingua';
if(isGeo(t))return RX_GEOVIE.test(t)?'geo_vie':'geo_terr';
if(RX_AERO.test(t)&&!RX_DOV.test(t))return 'norm_aero';
if(RX_NORM.test(t)&&!RX_DOV.test(t))return 'norm_legge';
if(RX_DOV.test(t))return 'reg_dov';
return 'reg_com';
}

function buildQuiz(){
if(qBuilt)return;
const DATA=window.__QUIZDATA__||{domande:[],cosadove:[]};
const D=DATA.domande||[], C=DATA.cosadove||[];
QUIZ_ALL=[];
const seenQ={};
D.forEach(row=>{
if(!row||!Array.isArray(row[1])||!row[1].length)return;
const q=row[0],ch=row[1];let cor=row[2]|0;
if(!q||seenQ[q])return; /* #33 niente domande duplicate */
if(cor<0||cor>=ch.length)cor=0; /* #30 indice corretto fuori range -> 0 */
seenQ[q]=1;
const sub=classifySub(q);
QUIZ_ALL.push({q:q,choices:ch.slice(),correct:cor,sub:sub,cat:SUB2ARG[sub]});
});
const addrs=C.map(x=>x[1]).filter(Boolean);
const seenP={};
C.forEach(row=>{
const place=row[0],addr=row[1];if(!place||!addr||seenP[place])return;
seenP[place]=1;
const used={},wrong=[];used[addr]=1;let g=0;
while(wrong.length<2&&g<80){g++;const a=addrs[Math.floor(Math.random()*addrs.length)];if(a&&!used[a]){used[a]=1;wrong.push(a);}}
const opts=qShuffle([addr,...wrong]);
QUIZ_ALL.push({q:'Dove si trova: '+place+'?',choices:opts,correct:opts.indexOf(addr),sub:'geo_terr',cat:'geo'});
});
QUIZ_ALL.forEach((it,i)=>it.id=i);
/* #34 rimuove gli id di errori che non esistono più (domande cancellate) */
try{if(qtStats&&qtStats.err){var maxId=QUIZ_ALL.length;Object.keys(qtStats.err).forEach(function(id){if((id|0)>=maxId)delete qtStats.err[id];});}}catch(e){}
qBuilt=true;
}

/* ── apri/chiudi ── */
function openQuiz(){
setAccent('quiz');buildQuiz();
document.getElementById('homeScreen').style.display='none';
document.getElementById('homeBtn').style.display='flex';
document.getElementById('quizApp').classList.add('open');
renderDash();showQView('dash');
try{pushTrap();}catch(e){}
}
function closeQuiz(){
if(Q&&Q.timer){clearInterval(Q.timer);Q.timer=null;}
qStopSpeak();
document.getElementById('quizApp').classList.remove('open');
}
function showQView(v){
qCurView=v;
document.getElementById('qDash').style.display=v==='dash'?'block':'none';
document.getElementById('qTopics').style.display=v==='topics'?'block':'none';
document.getElementById('qRun').style.display=v==='run'?'flex':'none';
document.getElementById('qResult').style.display=v==='result'?'block':'none';
document.querySelector('#quizApp .qhead').style.display=v==='run'?'none':'flex';
const t=document.getElementById('qTitle');
if(v==='dash')t.textContent="Quiz d'esame";
else if(v==='topics')t.textContent='Seleziona argomento';
else if(v==='result')t.textContent='Risultato';
var _qv={dash:'qDash',topics:'qTopics',run:'qRun',result:'qResult'}[v];if(_qv)sceneAnim(document.getElementById(_qv));
}
function qNavBack(){
if(qCurView==='topics'||qCurView==='result'){renderDash();showQView('dash');}
else goHome();
}
function qInfo(){
if(qCurView==='run')toast2('ℹ️ Rispondi e usa le frecce o i numeri per spostarti');
else toast2('ℹ️ 16 domande · 4 per argomento · 30 min · max 4 errori (max 2 per argomento)');
}

/* ── DASHBOARD ── */
function catProgress(cid){
const s=qtStats.cat[cid]||{seen:0,ok:0};
const tot=QUIZ_ALL.filter(it=>it.cat===cid).length||1;
return {ok:s.ok||0,seen:s.seen||0,tot:tot,pct:Math.min(100,Math.round(((s.ok||0)/tot)*100))};
}
function renderDash(){
const wrap=document.getElementById('qTilesArg');let h='';
h+=`<button class="qtile" onclick="showTopics()">
<div class="qtile-ic" style="background:rgba(52,199,89,.14)">🧭</div>
<div class="qtile-tx"><strong>Scegli gli argomenti</strong><small>Esercitati su argomenti specifici</small></div>
<div class="qtile-ar">›</div></button>`;
/* [v8] riquadro "Domande mai viste": fai proprio quelle che non ti sono mai uscite */
var _nv=QUIZ_ALL.filter(function(it){return !qtStats.seenIds[it.id];}).length;
h+=`<button class="qtile" onclick="qStartNew()">
<div class="qtile-ic" style="background:rgba(255,149,0,.14)">🆕</div>
<div class="qtile-tx"><strong>Domande mai viste</strong><small>${_nv?_nv+' ancora da scoprire':'Le hai viste tutte 🎉'}</small></div>
<div class="qtile-ar">›</div></button>`;
/* [v10] classifica delle più sbagliate */
var _hd=Object.keys(qtStats.wrongN||{}).length;
h+=`<button class="qtile" onclick="qStartHard()">
<div class="qtile-ic" style="background:rgba(229,72,77,.12)">💀</div>
<div class="qtile-tx"><strong>Le più sbagliate</strong><small>${_hd?'Le 20 domande che sbagli di più':'Ancora nessun dato'}</small></div>
<div class="qtile-ar">›</div></button>`;
/* [v12] sprint contro il tempo */
h+=`<button class="qtile" onclick="qStartSprint()">
<div class="qtile-ic" style="background:rgba(217,119,6,.12)">⚡</div>
<div class="qtile-tx"><strong>Sprint 3 minuti</strong><small>10 domande contro il tempo</small></div>
<div class="qtile-ar">›</div></button>`;
/* [v23] esame completo */
h+=`<button class="qtile" onclick="qStartFull()">
<div class="qtile-ic" style="background:rgba(110,90,224,.12)">🎓</div>
<div class="qtile-tx"><strong>Esame completo</strong><small>Simulazione + percorso in Cieco a sorpresa</small></div>
<div class="qtile-ar">›</div></button>`;
/* [v23] confusioni, se ce ne sono */
try{qtStats.why=qtStats.why||{};var _cf=Object.keys(qtStats.why).filter(function(k){return (qtStats.why[k].c||0)>=1;}).length;
if(_cf>=3)h+=`<button class="qtile" onclick="qStartConf()">
<div class="qtile-ic" style="background:rgba(36,71,214,.10)">🔀</div>
<div class="qtile-tx"><strong>Le confusioni</strong><small>${_cf} domande che scambi con altre</small></div>
<div class="qtile-ar">›</div></button>`;}catch(e){}
QARG.forEach(c=>{
const p=catProgress(c.id);
h+=`<button class="qtile" onclick="qStartCat('${c.id}')">
<div class="qtile-ic" style="background:${c.bg}">${c.emoji}</div>
<div class="qtile-tx"><strong>${c.label}</strong>
<div class="qtile-bar"><i style="width:${p.pct}%"></i></div>
</div>
<div class="qtile-ar">›</div></button>`;
});
wrap.innerHTML=h;qDashExtra();
const errIds=Object.keys(qtStats.err);
const totalSeen=Object.values(qtStats.cat).reduce((s,x)=>s+(x.seen||0),0);
const numEl=document.getElementById('qErrNum');
numEl.textContent=errIds.length;
numEl.classList.toggle('has',errIds.length>0);
const pct=totalSeen?Math.round(errIds.length/totalSeen*100):0;
setRing(Math.min(100,pct));
document.getElementById('qErrBtn').disabled=errIds.length===0;
try{renderExamHist();}catch(e){}
}
function setRing(pct){
const r=42,c=2*Math.PI*r,off=c*(1-pct/100);
const col=pct>0?'var(--err)':'var(--ok)';
document.getElementById('qRing').innerHTML=
`<svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="${r}" fill="none" stroke="var(--fill2)" stroke-width="9"/><circle cx="48" cy="48" r="${r}" fill="none" class="fillring" style="--circ:${c.toFixed(1)}" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg><div class="qr-txt">${pct}%</div>`;
}

/* ── SELEZIONE ARGOMENTI (raggruppata) ── */
function showTopics(){qSel={};document.getElementById('qTopSearch').value='';renderTopics();showQView('topics');updateTopGo();}
function renderTopics(){
const q=(document.getElementById('qTopSearch').value||'').toLowerCase();
let h='';
QGROUPS.forEach(g=>{
const rows=g.subs.filter(s=>!q||s.label.toLowerCase().includes(q)||g.title.toLowerCase().includes(q)).map(s=>{
const sel=!!qSel[s.id];
const ids=QUIZ_ALL.filter(it=>it.sub===s.id);
const seen=ids.reduce((a,it)=>a+(qtStats.seenIds[it.id]?1:0),0);
const pct=ids.length?Math.round(seen/ids.length*100):0;
return `<div class="qtop-row${sel?' sel':''}" onclick="toggleTop('${s.id}')">
<div class="qtop-check">${sel?'✓':''}</div>
<div class="qtop-info"><strong>${esc(s.label)}</strong>
<div class="qtop-prog"><div class="bar"><i style="width:${pct}%"></i></div><span class="frac">${seen}/${ids.length}</span></div>
</div></div>`;
}).join('');
if(rows)h+=`<div class="qtop-group"><span>${g.emoji}</span>${esc(g.title)}</div>`+rows;
});
document.getElementById('qTopList').innerHTML=h||'<div class="emp"><div class="e">🔍</div><p>Nessun argomento trovato</p></div>';
}
function toggleTop(id){qSel[id]=!qSel[id];if(!qSel[id])delete qSel[id];renderTopics();updateTopGo();hap();}
function updateTopGo(){const n=Object.keys(qSel).length;const b=document.getElementById('qTopGo');b.disabled=n===0;b.textContent=n?('Avvia ('+n+')'):'Avvia';}
function qStartSelectedTopics(){
const subs=Object.keys(qSel);
if(!subs.length){toast2('Seleziona almeno un argomento');return;}
let items=QUIZ_ALL.filter(it=>subs.indexOf(it.sub)>=0);
/* [v8] prima le mai viste, poi le già viste */
items=qShuffle(items.filter(it=>!qtStats.seenIds[it.id])).concat(qShuffle(items.filter(it=>qtStats.seenIds[it.id]))).slice(0,40);
startQuiz(items,{mode:'study',title:'Ripasso argomenti'});
}

/* ── AVVIO QUIZ ── */
function qStartExam(){
const TARGET=16;
let items=[];
QARG.forEach(c=>{
const pool=qShuffle(QUIZ_ALL.filter(it=>it.cat===c.id).slice());
items=items.concat(pool.slice(0,4));
});
if(items.length<TARGET){ /* #29 riempi se un argomento aveva <4 domande */
const have={};items.forEach(it=>have[it.id]=1);
const extra=qShuffle(QUIZ_ALL.filter(it=>!have[it.id]));
items=items.concat(extra.slice(0,TARGET-items.length));
}
items=qShuffle(items);
if(!items.length){toast2('Nessuna domanda disponibile');return;}
startQuiz(items,{mode:'exam',title:'Simulazione',limit:1800,maxErr:4,maxPerCat:2});
}
/* [v8] quiz solo con domande MAI viste */
function qStartNew(){
buildQuiz();
let items=QUIZ_ALL.filter(function(it){return !qtStats.seenIds[it.id];});
if(!items.length){toast2('🎉 Le hai viste tutte! Ripassa gli errori');return;}
startQuiz(qShuffle(items.slice()).slice(0,30),{mode:'study',title:'Domande nuove'});
}
function qStartCat(cid){
if(cid==='bm'){let items=QUIZ_ALL.filter(function(it){return qtStats.bm&&qtStats.bm[it.id];});if(!items.length){toast2('Nessun segnalibro');return;}startQuiz(qShuffle(items.slice()),{mode:'study',title:'Segnalibri'});return;}
if(cid==='errata'){
let items=QUIZ_ALL.filter(it=>qtStats.err[it.id]);items.sort(function(a,b){return srDue(a.id)-srDue(b.id);});
if(!items.length){toast2('🎉 Nessun errore da ripassare');return;}
startQuiz(items.slice(),{mode:'study',title:'Ripasso errori'});return;/*[FIX v5] niente shuffle: rispetta l'ordine della ripetizione spaziata (prima i più scaduti)*/
}
const arg=QARG.find(c=>c.id===cid);
/* [v8] priorità alle domande mai viste: prima le nuove (mescolate), poi le già viste */
const pool=QUIZ_ALL.filter(it=>it.cat===cid);
const nuove=qShuffle(pool.filter(it=>!qtStats.seenIds[it.id]));
const viste=qShuffle(pool.filter(it=>qtStats.seenIds[it.id]));
const items=nuove.concat(viste).slice(0,30);
if(!items.length){toast2('Nessuna domanda');return;}
startQuiz(items,{mode:'study',title:arg?arg.label:'Ripasso'});
}
function startQuiz(items,opts){
if(Q&&Q.timer){clearInterval(Q.timer);Q.timer=null;}
lastQuiz={items:items,opts:opts};
Q={items:items,ans:new Array(items.length).fill(-1),idx:0,mode:opts.mode,limit:opts.limit||0,maxErr:opts.maxErr||0,maxPerCat:opts.maxPerCat||0,elapsed:0,title:opts.title};
showQView('run');
Q.timer=setInterval(qTick,1000);
qRenderRun();qTick();hap();
}

/* ── RUN ── */
function qRenderRun(){
const it=Q.items[Q.idx];
document.getElementById('qRunNum').textContent='Domanda '+(Q.idx+1);
document.getElementById('qRunQ').textContent=it.q;
document.getElementById('qPos').textContent=(Q.idx+1)+' di '+Q.items.length;
document.getElementById('qPrev').disabled=Q.idx===0;
document.getElementById('qNext').disabled=Q.idx===Q.items.length-1;
qStopSpeak();
const LET=Array.from({length:Math.max(4,(Q&&Q.items[Q.idx]?Q.items[Q.idx].choices.length:4))},(_,i)=>String.fromCharCode(65+i));
let ah='';
it.choices.forEach((c,i)=>{
const sel=Q.ans[Q.idx]===i;
ah+=`<button class="qans${sel?' sel':''}" onclick="qPick(${i})"><span class="qa-let">${LET[i]}</span><span>${esc(c)}</span></button>`;
});
document.getElementById('qRunAns').innerHTML=ah;
qRenderPills();qUpdatePct();
qBmRender();
}
function qRenderPills(){
let h='';
const showRes=Q.mode==='study';/*(26) colori esito solo in studio*/
Q.items.forEach((it,i)=>{
const ans=Q.ans[i]>=0,cur=i===Q.idx;
let extra='';
if(showRes&&ans){extra=Q.ans[i]===it.correct?' good':' bad';}
else if(ans){extra=' ans';}
h+=`<button class="qpill${cur?' cur':''}${extra}" onclick="qJump(${i})">${i+1}</button>`;
});
const p=document.getElementById('qPills');if(!p)return;p.innerHTML=h;
const cu=p.querySelector('.qpill.cur');if(cu)cu.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
}
function qPick(i){
if(Q._locked)return;
Q.ans[Q.idx]=i;hap();
if(Q.mode==='study'){
Q._locked=true;
var it=Q.items[Q.idx];
var btns=document.querySelectorAll('#qRunAns .qans');
btns.forEach(function(b,bi){b.style.pointerEvents='none';if(bi===it.correct)b.classList.add('good');if(bi===i&&i!==it.correct)b.classList.add('bad');});
qRenderPills();qUpdatePct();
if(i!==it.correct){
/* [v19] errore: PAUSA di riflessione — un tocco su "perché" e si va avanti.
Fermarsi sull'errore (invece di scorrere via) è ciò che lo fissa in memoria. */
hap('e');
var wrap=document.getElementById('qRunAns');
if(wrap&&!wrap.querySelector('.why-bar')){
var bar=document.createElement('div');bar.className='why-bar';
bar.innerHTML='<small>Perché l\'hai sbagliata?</small><div class="why-chips">'
+'<button data-w="k">🤷 Non la sapevo</button>'
+'<button data-w="c">🔀 Confusa con un\'altra</button>'
+'<button data-w="l">👀 Letta male</button>'
+'<button data-w="x" class="why-skip">Avanti ›</button></div>';
bar.querySelectorAll('button').forEach(function(b){
b.onclick=function(){
var wv=b.getAttribute('data-w');
if(wv!=='x'){try{qtStats.why=qtStats.why||{};var W=qtStats.why[it.id]=qtStats.why[it.id]||{};W[wv]=(W[wv]||0)+1;qtSave();}catch(e){}}
if(!Q)return;Q._locked=false;
if(Q.idx<Q.items.length-1)qGo(1);else qRenderRun();
hap();
};
});
wrap.appendChild(bar);
}
}else{
setTimeout(function(){if(!Q)return;Q._locked=false;if(Q.idx<Q.items.length-1)qGo(1);else qRenderRun();},900);
}
}else{
qRenderRun();
if(Q.idx<Q.items.length-1)setTimeout(function(){qGo(1);},220);
}
}
function qJump(i){if(Q)Q._locked=false;Q.idx=i;qRenderRun();}
function qGo(d){if(Q)Q._locked=false;/*[FIX] navigando via si sblocca sempre*/const n=Q.idx+d;if(n<0||n>=Q.items.length)return;Q.idx=n;qRenderRun();hap();}
function qUpdatePct(){
const ans=Q.ans.filter(a=>a>=0).length;
document.getElementById('qPct').textContent=Math.round(ans/Q.items.length*100)+'%';
}
function qTick(){
if(!Q)return;
const clk=document.getElementById('qClock');
if(!clk){if(Q.limit>0){const rem=Q.limit-Q.elapsed;if(rem<=0){qFinish(true);return;}}Q.elapsed++;return;}/*[FIX] se il clock non è nel DOM, gestisci comunque il tempo senza crashare*/
if(Q.limit>0){/*[v12] countdown per ogni quiz a tempo (Sprint incluso)*/
const rem=Q.limit-Q.elapsed;
if(rem===300)toast2('⏳ 5 minuti alla fine');
if(rem===60)toast2('⏳ 1 minuto alla fine');
if(rem<=0){clk.textContent='00:00';qFinish(true);return;}
clk.textContent=fmtT(rem);clk.classList.toggle('warn',rem<=60);var _tb=document.getElementById('qTimeBar');if(_tb){_tb.classList.add('on');var _frac=rem/Q.limit;_tb.classList.toggle('warn',rem<=60);_tb.classList.toggle('mid',rem>60&&_frac<=.5);/*(27) fascia intermedia*/var _i=_tb.firstElementChild;if(_i)_i.style.transform='scaleX('+Math.max(0,_frac)+')';}
}else{
clk.textContent=fmtT(Q.elapsed);clk.classList.remove('warn');var _tb=document.getElementById('qTimeBar');if(_tb)_tb.classList.remove('on');
}
Q.elapsed++;
}
function fmtT(s){s=Math.max(0,s|0);const m=Math.floor(s/60),x=s%60;return (m<10?'0':'')+m+':'+(x<10?'0':'')+x;}

/* ── ASCOLTA (Web Speech) ── */
let qUtter=null;
function qSpeak(){
if(!('speechSynthesis'in window)){toast2('🔇 Sintesi vocale non disponibile');return;}
if(!Q||!Q.items[Q.idx])return;/*[FIX] niente Q -> esci*/
const btn=document.getElementById('qListen');
if(speechSynthesis.speaking){qStopSpeak();return;}
const it=Q.items[Q.idx];const LET=Array.from({length:Math.max(4,(Q&&Q.items[Q.idx]?Q.items[Q.idx].choices.length:4))},(_,i)=>String.fromCharCode(65+i));
let txt=it.q+'. ';it.choices.forEach((c,i)=>txt+=LET[i]+'. '+c+'. ');
qUtter=new SpeechSynthesisUtterance(txt);qUtter.lang=it.cat==='lingua'?'en-GB':'it-IT';qUtter.rate=.96;
qUtter.onend=()=>{if(btn)btn.classList.remove('playing');};/*[FIX] guardia btn*/
qUtter.onerror=()=>{if(btn)btn.classList.remove('playing');};
if(btn)btn.classList.add('playing');speechSynthesis.speak(qUtter);
}
function qStopSpeak(){try{if('speechSynthesis'in window)speechSynthesis.cancel();}catch(e){}const b=document.getElementById('qListen');if(b)b.classList.remove('playing');}

/* ── USCITA / FINE ── */
function qConfirmExit(){
if(confirm('Vuoi uscire dal quiz? I progressi di questa sessione andranno persi.')){
if(Q&&Q.timer){clearInterval(Q.timer);Q.timer=null;}Q=null;qStopSpeak();renderDash();showQView('dash');/*[FIX] azzera Q e timer, graffe esplicite*/
}
}
function qFinish(timeout){
if(!Q)return;
if(!timeout){var _un=Q.ans.filter(a=>a<0).length;if(_un>0&&!confirm('Hai '+_un+' domande senza risposta. Terminare comunque?'))return;}
if(Q.timer){clearInterval(Q.timer);Q.timer=null;}
qStopSpeak();
let ok=0,err=0,skip=0;
if(!qtStats.seenIds)qtStats.seenIds={};
Q.items.forEach((it,i)=>{
const a=Q.ans[i];
if(!qtStats.cat[it.cat])qtStats.cat[it.cat]={seen:0,ok:0};
if(a<0){skip++;}
else{
qtStats.seenIds[it.id]=1;
qtStats.cat[it.cat].seen=(qtStats.cat[it.cat].seen||0)+1;
if(a===it.correct){ok++;qtStats.cat[it.cat].ok=(qtStats.cat[it.cat].ok||0)+1;srMark(it.id,true);}
else{err++;srMark(it.id,false);}
}
});
qtSave();
renderResult(ok,err,skip,timeout);
showQView('result');
}
function renderResult(ok,err,skip,timeout){
const total=Q.items.length;
const usedT=Q.mode==='exam'?Math.min(Q.limit,Q.elapsed):Q.elapsed;
const argErr={},argTot={};
Q.items.forEach((it,i)=>{argTot[it.cat]=(argTot[it.cat]||0)+1;const a=Q.ans[i];if(a<0||a!==it.correct)argErr[it.cat]=(argErr[it.cat]||0)+1;});
let pass,title,emoji;
if(Q.mode==='exam'){
const overCat=QARG.some(c=>(argErr[c.id]||0)>Q.maxPerCat);
pass=((err+skip)<=Q.maxErr)&&!overCat;
title=pass?'Promosso':'Bocciato';
emoji=pass?'🎉':'❌';
}else{
const pct=total?Math.round(ok/total*100):0;
pass=pct>=60;
title=pct>=85?'Ottimo lavoro!':pct>=60?'Bene!':'Da ripassare';
emoji=pct>=85?'🏆':pct>=60?'👍':'📚';
}
const ve=document.getElementById('qResVerdict');
ve.textContent=title;ve.className='qres-title '+(pass?'pass':'fail');
document.getElementById('qResEmoji').textContent=emoji;
document.getElementById('qResTime').textContent=(timeout?'⏱ Tempo scaduto · ':'')+'Tempo impiegato: '+fmtT(usedT);
countUp(document.getElementById('qResOk'),ok);
countUp(document.getElementById('qResSkip'),skip);
countUp(document.getElementById('qResErr'),err);
const argBox=document.getElementById('qResArgs');
if(Q.mode==='exam'){
let bh=QARG.map(c=>{const e=argErr[c.id]||0,t=argTot[c.id]||0;const bad=e>Q.maxPerCat;const _p=t?Math.round(e/t*100):0;return `<div class="qarg-box${bad?' bad':''}" style="--argpct:${_p}%"><span class="qarg-lbl">${c.emoji} ${c.label}</span><span class="qarg-val">${e}<small>/${t}</small></span></div>`;}).join('');/*(29) mini-barra errori*/
argBox.innerHTML='<div class="qarg-title">Errori per argomento <span>(max 2 per argomento)</span></div><div class="qarg-grid">'+bh+'</div>';
argBox.style.display='block';
}else{argBox.style.display='none';}
let ah='';
Q.items.forEach((it,i)=>{
const a=Q.ans[i];
const state=a<0?'skip':(a===it.correct?'':'wrong');
let rows='';
const yourBadge=a<0?'n':(a===it.correct?'g':'r');
const yourTxt=a<0?'Nessuna risposta':esc(it.choices[a]);
const yourCls=a<0?'':(a===it.correct?'g':'r');
rows+=`<div class="qac-row"><div class="qac-badge ${yourBadge}">${a<0?'—':(a===it.correct?'✓':'✕')}</div><div class="qac-txt"><small>Hai risposto</small><b class="${yourCls}">${a<0?'<span style="color:var(--mu)">'+yourTxt+'</span>':yourTxt}</b></div></div>`;
if(a!==it.correct){
rows+=`<div class="qac-row"><div class="qac-badge g">✓</div><div class="qac-txt"><small>Risposta corretta</small><b class="g">${esc(it.choices[it.correct])}</b></div></div>`;
}
ah+=`<div class="qac ${state}"><div class="qac-q"><div class="qac-ic">${i+1}</div><div>${esc(it.q)}</div></div>${rows}</div>`;
});
document.getElementById('qAnalysis').innerHTML=ah;
if(Q.mode==='exam'){try{qExamHist.push({d:Date.now(),ok:ok,err:err,skip:skip,pass:pass,t:usedT});if(qExamHist.length>50)qExamHist=qExamHist.slice(-50);ls('qExamHist',qExamHist);autoSave();}catch(e){}}
if(pass&&Q.mode==='exam')confetti();
try{document.getElementById('qResult').scrollTo(0,0);}catch(e){}
}
function qRetry(){if(lastQuiz)startQuiz(qShuffle(lastQuiz.items.slice()),lastQuiz.opts);}
function qToDash(){renderDash();showQView('dash');}

/* ════════════ AVVIO ════════════ */
function restoreLast(){
try{var _lm=lg('lMode',null);if(_lm&&_lm!=='q')setMode(_lm);}catch(e){}
try{
const id=lg('lRId',null);
if(id){const r=routes.find(x=>x.id===id);if(r){selectRoute(r);const st=lg('lStep',0);if(st>0&&st<r.steps.length){step=st;syncListActive();updateUI();goStep();}return;}}
}catch(e){}
if(routes[0])selectRoute(routes[0]);
}
window.addEventListener('load',()=>{
try{if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').then(function(reg){if(!reg)return;reg.addEventListener('updatefound',function(){var nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',function(){if(nw.state==='installed'&&navigator.serviceWorker.controller)toast2('🔄 Nuova versione disponibile, riapri l’app');});});}).catch(()=>{});}catch(e){}
try{bumpStreak();showStreak();renderReadiness();}catch(e){}
try{initMap();}catch(e){console.warn('map',e);}
try{buildQuiz();}catch(e){console.warn('quiz build',e);}
try{buildLuoghi();}catch(e){console.warn('luoghi build',e);}
try{restoreLast();}catch(e){console.warn('restore',e);}
try{initSegThumb();}catch(e){}
try{updateAvToggles();}catch(e){}
/* iOS/Safari: l'audio parte solo dopo un gesto dell'utente → sblocca al primo tocco */
try{var _unlock=function(){_audioCtx();document.removeEventListener('touchend',_unlock);document.removeEventListener('click',_unlock);};document.addEventListener('touchend',_unlock,{once:true,passive:true});document.addEventListener('click',_unlock,{once:true});}catch(e){}
[120,400,800,1300].forEach(t=>setTimeout(()=>{try{mapResizeSoon();}catch(e){}},t));/*[FIX grigio] cattura il layout quando si stabilizza dopo il load*/
setTimeout(()=>{const s=document.getElementById('splash');if(s)s.classList.add('hide');},900);
setTimeout(()=>{try{checkPwa();}catch(e){}},100);
setTimeout(()=>{
try{initFB();if(fbOk)syncFromCloud();}catch(e){console.warn('fb',e);}/*[FIX v5] rimosso listener realtime vuoto fbRef.on('value'): teneva la connessione aperta senza fare nulla*/
},1500);
/* tastiera */
var _qaEl=document.getElementById('qa');if(_qaEl)_qaEl.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();checkQ();}});/*[FIX v5] guardia: se #qa manca non blocca i listener successivi*/
document.addEventListener('keydown',e=>{
if(e.key==='Escape'){closeAllM();cm();document.getElementById('sugg').style.display='none';}
if(document.activeElement&&['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;
if(qCurOpen()){
if(qCurView==='run'){
if(e.key==='ArrowLeft')qGo(-1);
if(e.key==='ArrowRight')qGo(1);
var _k=e.key.toLowerCase();var _m={'1':0,'2':1,'3':2,'4':3,'a':0,'b':1,'c':2,'d':3};
if(_m[_k]!==undefined&&Q&&Q.items[Q.idx]&&_m[_k]<Q.items[Q.idx].choices.length)qPick(_m[_k]);
}
return;
}
if(document.getElementById('homeScreen').style.display!=='none')return;
if(e.key==='ArrowLeft')prevS();if(e.key==='ArrowRight')nextS();
});
window.addEventListener('online',()=>toast2('🌐 Di nuovo online'));
window.addEventListener('offline',()=>toast2('📴 Modalità offline'));
window.addEventListener('orientationchange',function(){setTimeout(function(){
try{if(map&&map.invalidateSize)map.invalidateSize();}catch(e){}
try{if(mMap&&mMap.invalidateSize)mMap.invalidateSize();}catch(e){}
try{if(mobMap&&mobMap.invalidateSize)mobMap.invalidateSize();}catch(e){}
try{if(mtMap&&mtMap.invalidateSize)mtMap.invalidateSize();}catch(e){}
try{if(stMap&&stMap.invalidateSize)stMap.invalidateSize();}catch(e){}
},350);});
});
function qCurOpen(){return document.getElementById('quizApp').classList.contains('open');}

/* ════════════ STUDIO (Luoghi · Metro · Strade) ════════════ */
let LUOGHI=[], sdBuilt=false, sdCurView='dash', SS=null, mtSel='all', stSel='Tutte';
let studyProg=lg('studyProg',{});
function sdSave(){ls('studyProg',studyProg);ls('localTs',Date.now());try{autoSave();}catch(e){}}
function sdShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const SD_MASTER=4;
const SD_CATS=[
{key:'Monumenti & Musei',emoji:'🏛️',bg:'rgba(43,89,195,.12)'},
{key:'Ospedali & Stazioni',emoji:'🏥',bg:'rgba(88,86,214,.12)'},
{key:'Altro',emoji:'🏢',bg:'rgba(175,82,222,.12)'}
];

/* ---- dati METRO (5 linee, ordine reale, interscambi) ---- */
const METRO=[
{id:'M1',nome:'M1 Rossa',col:'#D52B1E',capi:'Sesto 1° Maggio FS ↔ Rho Fieramilano / Bisceglie',tratte:[
{t:'Tronco comune',s:[['Sesto 1° Maggio FS',['FS']],['Sesto Rondò',[]],['Sesto Marelli',[]],['Villa San Giovanni',[]],['Precotto',[]],['Gorla',[]],['Turro',[]],['Rovereto',[]],['Pasteur',[]],['Loreto',['M2']],['Lima',[]],['Porta Venezia',[]],['Palestro',[]],['San Babila',['M4']],['Duomo',['M3']],['Cordusio',[]],['Cairoli',[]],['Cadorna FN',['M2','FN']],['Conciliazione',[]],['Pagano',[]]]},
{t:'Ramo Rho Fieramilano',s:[['Buonarroti',[]],['Amendola',[]],['Lotto',['M5']],['QT8',[]],['Lampugnano',[]],['Uruguay',[]],['Bonola',[]],['San Leonardo',[]],['Molino Dorino',[]],['Pero',[]],['Rho Fieramilano',['FS']]]},
{t:'Ramo Bisceglie',s:[['Wagner',[]],['De Angeli',[]],['Gambara',[]],['Bande Nere',[]],['Inganni',[]],['Primaticcio',[]],['Bisceglie',[]]]}]},
{id:'M2',nome:'M2 Verde',col:'#00873C',capi:'Gessate / Cologno Nord ↔ Abbiategrasso / Assago Forum',tratte:[
{t:'Ramo Gessate',s:[['Gessate',[]],['Villa Pompea',[]],['Bussero',[]],["Cassina de' Pecchi",[]],['Villa Fiorita',[]],['Cernusco sul Naviglio',[]],['Cascina Burrona',[]],['Vimodrone',[]]]},
{t:'Ramo Cologno',s:[['Cologno Nord',[]],['Cologno Centro',[]],['Cologno Sud',[]]]},
{t:'Tronco comune',s:[['Cascina Gobba',[]],['Crescenzago',[]],['Cimiano',[]],['Udine',[]],['Lambrate FS',['FS']],['Piola',[]],['Loreto',['M1']],['Caiazzo',[]],['Centrale FS',['M3','FS']],['Gioia',[]],['Garibaldi FS',['M5','FS']],['Moscova',[]],['Lanza',[]],['Cadorna FN',['M1','FN']],["Sant'Ambrogio",['M4']],['Porta Genova FS',['FS']],['Romolo',[]],['Famagosta',[]]]},
{t:'Ramo Abbiategrasso',s:[['Abbiategrasso',[]]]},
{t:'Ramo Assago',s:[['Assago Milanofiori Nord',[]],['Assago Milanofiori Forum',[]]]}]},
{id:'M3',nome:'M3 Gialla',col:'#E8A200',capi:'Comasina ↔ San Donato',tratte:[
{t:'',s:[['Comasina',[]],['Affori Centro',[]],['Affori FN',['FN']],['Dergano',[]],['Maciachini',[]],['Zara',['M5']],['Sondrio',[]],['Centrale FS',['M2','FS']],['Repubblica',[]],['Turati',[]],['Montenapoleone',[]],['Duomo',['M1']],['Missori',['M4']],['Crocetta',[]],['Porta Romana',[]],['Lodi TIBB',[]],['Brenta',[]],['Corvetto',[]],['Porto di Mare',[]],['Rogoredo FS',['FS']],['San Donato',[]]]}]},
{id:'M4',nome:'M4 Blu',col:'#1F4FA3',capi:'San Cristoforo FS ↔ Linate Aeroporto',tratte:[
{t:'',s:[['San Cristoforo FS',['FS']],['Segneri',[]],['Gelsomini',[]],['Frattini',[]],['Tolstoj',[]],['Bolivar',[]],['California',[]],['Coni Zugna',[]],["Sant'Ambrogio",['M2']],['De Amicis',[]],['Vetra',[]],['Santa Sofia',[]],['Sforza Policlinico',['M3']],['San Babila',['M1']],['Tricolore',[]],['Dateo',['FS']],['Susa',[]],['Argonne',[]],['Stazione Forlanini FS',['FS']],['Repetti',[]],['Linate Aeroporto',['AIR']]]}]},
{id:'M5',nome:'M5 Lilla',col:'#A05EB5',capi:'Bignami ↔ San Siro Stadio',tratte:[
{t:'',s:[['Bignami',[]],['Ponale',[]],['Bicocca',[]],["Ca' Granda",[]],['Istria',[]],['Marche',[]],['Zara',['M3']],['Isola',[]],['Garibaldi FS',['M2','FS']],['Monumentale',[]],['Cenisio',[]],['Gerusalemme',[]],['Domodossola FN',['FN']],['Tre Torri',[]],['Portello',[]],['Lotto',['M1']],['San Siro Ippodromo',[]],['San Siro Stadio',[]]]}]}
];
const MCOL={M1:'#D52B1E',M2:'#00873C',M3:'#E8A200',M4:'#1F4FA3',M5:'#A05EB5'};

/* ===== coordinate fermate (approssimate, per posizionarle sulla mappa) ===== */
const COORDS={
/* M1 tronco */
'Sesto 1° Maggio FS':[45.5375,9.2395],'Sesto Rondò':[45.5340,9.2360],'Sesto Marelli':[45.5300,9.2330],'Villa San Giovanni':[45.5250,9.2280],'Precotto':[45.5180,9.2240],'Gorla':[45.5120,9.2200],'Turro':[45.5060,9.2185],'Rovereto':[45.4985,9.2200],'Pasteur':[45.4920,9.2200],'Loreto':[45.4848,9.2160],'Lima':[45.4790,9.2090],'Porta Venezia':[45.4755,9.2055],'Palestro':[45.4720,9.1990],'San Babila':[45.4680,9.1975],'Duomo':[45.4641,9.1895],'Cordusio':[45.4655,9.1855],'Cairoli':[45.4670,9.1815],'Cadorna FN':[45.4665,9.1760],'Conciliazione':[45.4680,9.1665],'Pagano':[45.4690,9.1610],
/* M1 ramo Rho */
'Buonarroti':[45.4725,9.1555],'Amendola':[45.4760,9.1490],'Lotto':[45.4783,9.1370],'QT8':[45.4835,9.1330],'Lampugnano':[45.4885,9.1260],'Uruguay':[45.4935,9.1175],'Bonola':[45.4975,9.1130],'San Leonardo':[45.5015,9.1080],'Molino Dorino':[45.5060,9.1015],'Pero':[45.5135,9.0930],'Rho Fieramilano':[45.5210,9.0840],
/* M1 ramo Bisceglie */
'Wagner':[45.4665,9.1545],'De Angeli':[45.4655,9.1485],'Gambara':[45.4648,9.1410],'Bande Nere':[45.4628,9.1350],'Inganni':[45.4580,9.1305],'Primaticcio':[45.4538,9.1270],'Bisceglie':[45.4490,9.1230],
/* M2 ramo Gessate */
'Gessate':[45.5760,9.4350],'Villa Pompea':[45.5710,9.4220],'Bussero':[45.5640,9.4080],"Cassina de' Pecchi":[45.5570,9.3860],'Villa Fiorita':[45.5500,9.3650],'Cernusco sul Naviglio':[45.5240,9.3320],'Cascina Burrona':[45.5200,9.3110],'Vimodrone':[45.5180,9.2880],
/* M2 ramo Cologno */
'Cologno Nord':[45.5345,9.2785],'Cologno Centro':[45.5290,9.2760],'Cologno Sud':[45.5235,9.2720],
/* M2 tronco */
'Cascina Gobba':[45.5160,9.2640],'Crescenzago':[45.5110,9.2520],'Cimiano':[45.5050,9.2440],'Udine':[45.4990,9.2400],'Lambrate FS':[45.4850,9.2360],'Piola':[45.4790,9.2255],'Caiazzo':[45.4835,9.2090],'Centrale FS':[45.4856,9.2040],'Gioia':[45.4870,9.1960],'Garibaldi FS':[45.4840,9.1880],'Moscova':[45.4790,9.1850],'Lanza':[45.4730,9.1840],"Sant'Ambrogio":[45.4620,9.1745],'Porta Genova FS':[45.4540,9.1720],'Romolo':[45.4475,9.1660],'Famagosta':[45.4355,9.1600],
/* M2 sud */
'Abbiategrasso':[45.4305,9.1780],'Assago Milanofiori Nord':[45.4155,9.1530],'Assago Milanofiori Forum':[45.4035,9.1490],
/* M3 */
'Comasina':[45.5235,9.1700],'Affori Centro':[45.5180,9.1720],'Affori FN':[45.5130,9.1740],'Dergano':[45.5060,9.1790],'Maciachini':[45.4960,9.1840],'Zara':[45.4920,9.1900],'Sondrio':[45.4885,9.1975],'Repubblica':[45.4800,9.1975],'Turati':[45.4750,9.1950],'Montenapoleone':[45.4700,9.1930],'Missori':[45.4600,9.1900],'Crocetta':[45.4560,9.1975],'Porta Romana':[45.4520,9.2040],'Lodi TIBB':[45.4480,9.2110],'Brenta':[45.4420,9.2180],'Corvetto':[45.4370,9.2255],'Porto di Mare':[45.4295,9.2360],'Rogoredo FS':[45.4330,9.2440],'San Donato':[45.4170,9.2680],
/* M4 */
'San Cristoforo FS':[45.4470,9.1430],'Segneri':[45.4490,9.1480],'Gelsomini':[45.4505,9.1525],'Frattini':[45.4515,9.1565],'Tolstoj':[45.4535,9.1625],'Bolivar':[45.4555,9.1680],'California':[45.4575,9.1705],'Coni Zugna':[45.4600,9.1725],'De Amicis':[45.4600,9.1815],'Vetra':[45.4595,9.1855],'Santa Sofia':[45.4595,9.1905],'Sforza Policlinico':[45.4605,9.1935],'Tricolore':[45.4690,9.2055],'Dateo':[45.4660,9.2150],'Susa':[45.4640,9.2250],'Argonne':[45.4630,9.2335],'Stazione Forlanini FS':[45.4575,9.2475],'Repetti':[45.4520,9.2625],'Linate Aeroporto':[45.4450,9.2780],
/* M5 */
'Bignami':[45.5235,9.2085],'Ponale':[45.5170,9.2055],'Bicocca':[45.5165,9.2125],"Ca' Granda":[45.5095,9.2030],'Istria':[45.5045,9.1990],'Marche':[45.4985,9.1955],'Isola':[45.4880,9.1880],'Monumentale':[45.4830,9.1790],'Cenisio':[45.4830,9.1700],'Gerusalemme':[45.4820,9.1640],'Domodossola FN':[45.4810,9.1560],'Tre Torri':[45.4790,9.1530],'Portello':[45.4810,9.1500],'San Siro Ippodromo':[45.4790,9.1280],'San Siro Stadio':[45.4780,9.1230]
};
const JUNCTION={M1:{'Ramo Rho Fieramilano':'Pagano','Ramo Bisceglie':'Pagano'},M2:{'Ramo Gessate':'Cascina Gobba','Ramo Cologno':'Cascina Gobba','Ramo Abbiategrasso':'Famagosta','Ramo Assago':'Famagosta'}};
let mtMap=null, mtLayers={}, mtMrk={};

function mtLineSegs(L){
const segs=[];
L.tratte.forEach(tr=>{
let pts=tr.s.map(st=>COORDS[st[0]]).filter(Boolean);
if(/^Ramo/.test(tr.t||'')){const j=JUNCTION[L.id]&&JUNCTION[L.id][tr.t];if(j&&COORDS[j])pts=[COORDS[j]].concat(pts);}
if(pts.length>1)segs.push(pts);
});
return segs;
}
function initMetroMap(){
try{
if(!mtMap){
mtMap=L.map('mtMap',{zoomControl:true,attributionControl:false}).setView([45.4720,9.1900],12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CARTO'}).addTo(mtMap);
drawMetroMap();
} else mtMap.invalidateSize();
setTimeout(()=>{try{mtMap.invalidateSize();}catch(e){}},250);
}catch(e){console.warn('metro map',e);}
}
function drawMetroMap(){
const idx=metroIndex();
// build per-line layer groups
METRO.forEach(L=>{
const grp=window.L.layerGroup();
mtLineSegs(L).forEach(pts=>{
window.L.polyline(pts.map(p=>[p[0],p[1]]),{color:L.col,weight:5,opacity:.85,lineJoin:'round'}).addTo(grp);
});
grp.addTo(mtMap); mtLayers[L.id]=grp;
});
// markers (uno per fermata unica)
Object.keys(idx).forEach(nm=>{
const c=COORDS[nm]; if(!c)return;
const info=idx[nm]; const lines=[...info.lines]; const inter=lines.length>1;
const col=MCOL[lines[0]]||'#555';
const mk=window.L.circleMarker([c[0],c[1]],{radius:inter?6:4.5,color:inter?'#222':'#fff',weight:inter?2:1.5,fillColor:inter?'#fff':col,fillOpacity:1});
const lnames=lines.map(l=>{const m=METRO.find(x=>x.id===l);return m?m.nome:l;}).join(' · ');
const extra=[...info.extra].map(e=>e==='FS'?'FS':e==='FN'?'FNM':'✈ Linate').join(', ');
mk.bindPopup('<div class="mt-pop">'+esc(nm)+'<small>'+esc(lnames)+(extra?' — '+esc(extra):'')+'</small></div>');
mk.addTo(mtMap); mtMrk[nm]=mk;
});
}
function mtFocusMap(){
if(!mtMap)return;
METRO.forEach(L=>{
const sel=(mtSel==='all'||mtSel===L.id);
if(mtLayers[L.id])mtLayers[L.id].eachLayer(ly=>{if(ly.setStyle)ly.setStyle({opacity:sel?.9:.18,weight:mtSel===L.id?6:5});});
});
if(mtSel!=='all'){
const pts=[];METRO.find(l=>l.id===mtSel).tratte.forEach(tr=>tr.s.forEach(st=>{if(COORDS[st[0]])pts.push(COORDS[st[0]]);}));
if(pts.length)try{mtMap.fitBounds(pts,{padding:[30,30]});}catch(e){}
} else { try{mtMap.setView([45.4720,9.1900],12);}catch(e){} }
}


/* ---- dati STRADE (statali, autostrade, tangenziali Lombardia) ---- */
const STRADE={
Statali:[
{c:'SS9',n:'Via Emilia',i:'Milano–Bologna; in Lombardia attraversa Lodi'},
{c:'SS10',n:'Padana Inferiore',i:'Collega Cremona a Mantova'},
{c:'SS11',n:'Padana Superiore',i:'Da Milano (Via Novara) verso Treviglio e Brescia'},
{c:'SS33',n:'del Sempione',i:"Da Milano (Arco della Pace) → Rho-Legnano → Sesto Calende → passo del Sempione"},
{c:'SS35',n:'dei Giovi',i:'Collega Milano a Como; passa per Binasco'},
{c:'SS36',n:'del Lago di Como e dello Spluga',i:'Milano-Lecco-Colico-Valtellina; passo dello Spluga'},
{c:'SS38',n:'dello Stelvio',i:'Attraversa Sondrio; passo dello Stelvio'},
{c:'SS39',n:"dell'Aprica",i:'Collega Sondrio e Bergamo; passo dell\u2019Aprica'},
{c:'SS42',n:'del Tonale e della Mendola',i:'Comprende il passo del Tonale'},
{c:'SS45bis',n:'Gardesana Occidentale',i:'Costeggia il lago di Garda (sponda bresciana)'},
{c:'SS233',n:'Varesina',i:'Collega Milano a Varese; vicino all\u2019aeroporto di Malpensa'},
{c:'SS234',n:'Codognese',i:'Attraversa Pavia, Lodi e Cremona'},
{c:'SS235',n:'di Orzinuovi',i:'Collega Pavia a Lodi'},
{c:'SS236',n:'Goitese',i:"Attraversa l'abitato di Montichiari"},
{c:'SS237',n:'del Caffaro',i:'Provincia di Brescia (Val Sabbia)'},
{c:'SS340',n:'Regina',i:'Como–Menaggio–Porlezza (lago di Como)'},
{c:'SS342',n:'Briantea',i:'Collega Varese a Bergamo; passa per Pontida'},
{c:'SS345',n:'delle Tre Valli',i:'Provincia di Brescia'},
{c:'SS402',n:'Valeriana',i:'Provincia di Sondrio; passa per Morbegno'},
{c:'SS412',n:'della Val Tidone',i:'Provincia di Pavia; esce da Milano verso Opera'},
{c:'SS415',n:'Paullese',i:'Collega Milano a Crema'},
{c:'SS470',n:'della Val Brembana',i:'Passa per San Pellegrino Terme (Bergamo)'},
{c:'SS494',n:'Vigevanese',i:'Collega Milano a Vigevano; passa per Gaggiano'},
{c:'SS496',n:'Virgiliana',i:'Provincia di Mantova (San Benedetto Po)'},
{c:'SS525',n:'del Brembo',i:"Passa per Vaprio d'Adda"},
{c:'SS526',n:"dell'Est Ticino",i:'Collega Magenta ad Abbiategrasso'},
{c:'SS527',n:'Bustese',i:'Collega Monza a Busto Arsizio'},
{c:'SS583',n:'Lariana',i:'Costeggia il lago di Como; Como–Bellagio'},
{c:'SS591',n:'Cremasca',i:'Zona di Crema e Codogno'},
{c:'SS596',n:'dei Cairoli',i:'Provincia di Pavia'}
],
Autostrade:[
{c:'A1',n:'Autostrada del Sole',i:'Milano–Bologna–Roma; in Lombardia provincia di Lodi'},
{c:'A4',n:'Torino–Trieste · "Serenissima"',i:'Attraversa Milano, Bergamo e Brescia'},
{c:'A7',n:'Milano–Genova',i:'Incrocia la Tang. Ovest al km 20; casello Casei Gerola'},
{c:'A8',n:'Autostrada dei Laghi',i:'Milano–Varese (Sesto Calende); transita da Legnano e Cerro Maggiore'},
{c:'A9',n:'Lainate–Como–Chiasso',i:'Dei Laghi; casello di Fino Mornasco'},
{c:'A21',n:'Torino–Piacenza–Brescia',i:'Da Cremona raggiunge Brescia; non tocca Lodi'},
{c:'A22',n:'del Brennero',i:'In Lombardia solo la provincia di Mantova'},
{c:'A26',n:'dei Trafori',i:'Genova–Gravellona; tocca Sesto Calende'},
{c:'A35',n:'BreBeMi',i:'Brescia–Bergamo–Milano'},
{c:'A36',n:'Pedemontana Lombarda',i:'Collega Varese, Como, Monza e Bergamo'}
],
Tangenziali:[
{c:'A50',n:'Tangenziale Ovest di Milano',i:'Lunga 30–40 km; incrocia la A7 al km 20; raccordo A1 e Tang. Est al km 31,5'},
{c:'A51',n:'Tangenziale Est di Milano',i:'Collega la A4 (nord) alla A1 / Paullese (sud)'},
{c:'A52',n:'Tangenziale Nord di Milano',i:'Da Rho/Pero verso la A4 e Monza'}
]
};


/* ===== città/punti della Lombardia (coordinate) ===== */
const CITY={
'Milano':[45.464,9.190],'Monza':[45.584,9.274],'Como':[45.808,9.085],'Lecco':[45.856,9.394],'Bergamo':[45.695,9.670],'Brescia':[45.539,10.220],'Sondrio':[46.170,9.870],'Varese':[45.821,8.825],'Pavia':[45.185,9.156],'Cremona':[45.133,10.022],'Mantova':[45.157,10.792],'Lodi':[45.314,9.503],'Treviglio':[45.521,9.591],'Legnano':[45.593,8.918],'Gallarate':[45.660,8.791],'Busto Arsizio':[45.611,8.849],'Saronno':[45.625,9.034],'Sesto Calende':[45.726,8.636],'Vigevano':[45.317,8.857],'Crema':[45.366,9.685],'Codogno':[45.161,9.703],'Casalpusterlengo':[45.178,9.643],'Abbiategrasso':[45.398,8.919],'Magenta':[45.466,8.879],'Morbegno':[46.137,9.572],'Tirano':[46.215,10.169],'Bormio':[46.467,10.369],'Aprica':[46.155,10.150],'Edolo':[46.178,10.333],'Chiavenna':[46.319,9.398],'Colico':[46.137,9.371],'Menaggio':[46.022,9.238],'Bellagio':[45.985,9.261],'Porlezza':[46.040,9.131],'San Pellegrino Terme':[45.836,9.668],'Pontida':[45.733,9.508],"Vaprio d'Adda":[45.577,9.532],'San Benedetto Po':[45.043,10.929],'Montichiari':[45.413,10.391],'Goito':[45.252,10.668],'Orzinuovi':[45.401,9.926],'Voghera':[44.992,9.009],'Rho':[45.531,9.041],'Opera':[45.376,9.205],'Binasco':[45.330,9.108],'Paullo':[45.418,9.401],'Gaggiano':[45.404,9.034],'Mortara':[45.252,8.738],'Salò':[45.606,10.521],'Gardone Riviera':[45.624,10.572],'Vestone':[45.708,10.394],'Bagolino':[45.821,10.466],'Gardone Val Trompia':[45.685,10.185],'Lovere':[45.811,10.075],'Lainate':[45.575,9.027],'Casei Gerola':[44.992,8.918],'Romano di Lombardia':[45.519,9.752],'Lentate sul Seveso':[45.674,9.123],'Vergiate':[45.722,8.693],'Pegognaga':[44.992,10.852],'Piacenza (confine)':[45.052,9.693],'Chiasso (confine)':[45.833,9.030],'Passo dello Spluga':[46.508,9.341],'Passo dello Stelvio':[46.529,10.453],'Passo del Tonale':[46.258,10.586]
};
/* ===== percorsi: partenza → … città attraversate … → arrivo ===== */
const ROUTES={
SS9:['Milano','Lodi','Casalpusterlengo','Piacenza (confine)'],
SS10:['Voghera','Pavia','Cremona','Mantova'],
SS11:['Milano','Treviglio','Brescia'],
SS33:['Milano','Rho','Legnano','Gallarate','Sesto Calende'],
SS35:['Como','Milano','Binasco','Pavia'],
SS36:['Milano','Monza','Lecco','Colico','Chiavenna','Passo dello Spluga'],
SS38:['Sondrio','Tirano','Bormio','Passo dello Stelvio'],
SS39:['Sondrio','Aprica','Edolo'],
SS42:['Bergamo','Lovere','Edolo','Passo del Tonale'],
SS45bis:['Brescia','Salò','Gardone Riviera'],
SS233:['Milano','Saronno','Varese'],
SS234:['Pavia','Codogno','Cremona'],
SS235:['Pavia','Lodi','Crema','Orzinuovi'],
SS236:['Montichiari','Goito','Mantova'],
SS237:['Brescia','Vestone','Bagolino'],
SS340:['Como','Menaggio','Porlezza'],
SS342:['Varese','Como','Pontida','Bergamo'],
SS345:['Brescia','Gardone Val Trompia','Lovere'],
SS402:['Colico','Morbegno','Sondrio'],
SS412:['Milano','Opera','Pavia'],
SS415:['Milano','Paullo','Crema'],
SS470:['Bergamo','San Pellegrino Terme'],
SS494:['Milano','Gaggiano','Abbiategrasso','Vigevano'],
SS496:['Mantova','San Benedetto Po'],
SS525:["Vaprio d'Adda",'Bergamo'],
SS526:['Magenta','Abbiategrasso','Pavia'],
SS527:['Monza','Saronno','Busto Arsizio'],
SS583:['Como','Bellagio'],
SS591:['Crema','Codogno'],
SS596:['Pavia','Mortara'],
A1:['Milano','Lodi','Piacenza (confine)'],
A4:['Milano','Bergamo','Brescia'],
A7:['Milano','Binasco','Pavia','Casei Gerola'],
A8:['Milano','Legnano','Gallarate','Varese'],
A9:['Lainate','Como','Chiasso (confine)'],
A21:['Brescia','Cremona','Piacenza (confine)'],
A22:['Mantova','Pegognaga'],
A26:['Sesto Calende','Vergiate'],
A35:['Treviglio','Romano di Lombardia','Brescia'],
A36:['Varese','Lentate sul Seveso','Monza'],
A50:[[45.515,9.085],[45.46,9.06],[45.40,9.07],[45.36,9.13]],
A51:[[45.555,9.33],[45.50,9.31],[45.45,9.30],[45.40,9.31]],
A52:[[45.555,9.10],[45.555,9.16],[45.55,9.22],[45.545,9.27]]
};
const COLcat={Statali:'#E8860A',Autostrade:'#1f9d55',Tangenziali:'#0a84ff'};
const ST_CLASS={Autostrade:'aut',Tangenziali:'tan',Statali:''};
let stMap=null, stLayers={}, stFocusG=null, stRoadMeta={}, stFocusedCode=null;

function routePts(code){const r=ROUTES[code];if(!r)return [];return r.map(w=>Array.isArray(w)?w:CITY[w]).filter(Boolean);}
function routeNames(code){return (ROUTES[code]||[]).filter(w=>!Array.isArray(w));}
function midPt(pts){return pts[Math.floor(pts.length/2)];}

function initStradeMap(){
try{
if(!stMap){
stMap=L.map('stMap',{zoomControl:true,attributionControl:false}).setView([45.65,9.75],8);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CARTO'}).addTo(stMap);
drawStradeMap();
} else stMap.invalidateSize();
setTimeout(()=>{try{stMap.invalidateSize();}catch(e){}},250);
}catch(e){console.warn('strade map',e);}
}
function drawStradeMap(){
Object.keys(STRADE).forEach(cat=>{
const grp=window.L.layerGroup();
const col=COLcat[cat]||'#888';
STRADE[cat].forEach(r=>{
const pts=routePts(r.c); if(pts.length<2)return;
stRoadMeta[r.c]={cat:cat,name:r.n,info:r.i};
const pl=window.L.polyline(pts,{color:col,weight:3.5,opacity:.55,lineJoin:'round'});
pl.on('click',()=>stFocusRoad(r.c));
pl.addTo(grp);
const mid=midPt(pts);
const ic=window.L.divIcon({className:'',html:'<span class="st-label '+(ST_CLASS[cat]||'')+'">'+r.c+'</span>'});
const mk=window.L.marker(mid,{icon:ic});
mk.on('click',()=>stFocusRoad(r.c));
mk.addTo(grp);
});
grp.addTo(stMap); stLayers[cat]=grp;
});
}
function stFocusRoad(code){
if(!stMap)return;
const pts=routePts(code); if(pts.length<1)return;
/* mostra SOLO questa strada: nascondi tutti i livelli di base */
Object.keys(stLayers).forEach(cat=>{if(stMap.hasLayer(stLayers[cat]))stMap.removeLayer(stLayers[cat]);});
stFocusedCode=code;
const meta=stRoadMeta[code]||{}; const col=COLcat[meta.cat]||'#E8860A';
const names=routeNames(code);
if(stFocusG){stMap.removeLayer(stFocusG);stFocusG=null;}
stFocusG=window.L.layerGroup().addTo(stMap);
window.L.polyline(pts,{color:col,weight:7,opacity:1,lineJoin:'round'}).addTo(stFocusG);
// città intermedie
for(let i=1;i<names.length-1;i++){
const c=CITY[names[i]]; if(!c)continue;
window.L.circleMarker(c,{radius:5,color:'#fff',weight:2,fillColor:col,fillOpacity:1}).addTo(stFocusG);
window.L.marker(c,{icon:window.L.divIcon({className:'',html:'<span class="ct-label">'+esc(names[i])+'</span>'})}).addTo(stFocusG);
}
// partenza / arrivo
function endMk(pt,label,bg){
window.L.marker(pt,{icon:window.L.divIcon({className:'',html:'<span class="end-dot" style="background:'+bg+'"></span><span class="end-label" style="background:'+bg+'">'+label+'</span>'})}).addTo(stFocusG);
}
const a=pts[0], b=pts[pts.length-1];
const startName=Array.isArray(ROUTES[code][0])?'':names[0];
const endName=Array.isArray(ROUTES[code][ROUTES[code].length-1])?'':names[names.length-1];
endMk(a,'▶ '+(startName||'Partenza'),'#1f9d55');
endMk(b,'■ '+(endName||'Arrivo'),'#D52B1E');
const mids=names.slice(1,-1);
const pop='<div class="mt-pop">'+esc(code)+' '+esc(meta.name||'')+'<small>Da <b>'+esc(startName||'?')+'</b> a <b>'+esc(endName||'?')+'</b>'+(mids.length?'<br>Passa per: '+esc(mids.join(', ')):'')+'<br>'+esc(meta.info||'')+'</small></div>';
window.L.popup({maxWidth:260}).setLatLng(midPt(pts)).setContent(pop).openOn(stMap);
try{stMap.fitBounds(pts,{padding:[50,50]});}catch(e){}
/* mostra il pulsante per tornare a tutte e l'hint dedicato */
try{var rb=document.getElementById('stReset');if(rb)rb.style.display='block';}catch(e){}
try{var hn=document.getElementById('stHint');if(hn)hn.textContent='Stai vedendo solo '+code+(meta.name?' · '+meta.name:'')+'. Tocca «Tutte le strade» per tornare.';}catch(e){}
/* porta la mappa in vista (utile quando arrivi dalla lista in basso) */
try{document.getElementById('stMap').scrollIntoView({block:'start',behavior:'smooth'});}catch(e){}
stHighlightRow(code);
hap();
}
function stHighlightRow(code){try{document.querySelectorAll('#stRoadsBody .st-row').forEach(function(el){el.classList.toggle('on',el.getAttribute('data-code')===code);});}catch(e){}}
function stResetFocus(){
stFocusedCode=null;
try{var rb=document.getElementById('stReset');if(rb)rb.style.display='none';}catch(e){}
try{var hn=document.getElementById('stHint');if(hn)hn.textContent='Tocca una strada (linea o etichetta) per vederne il percorso: partenza, arrivo e città attraversate';}catch(e){}
stFocusMap();
hap();
}
function stFocusMap(){
if(!stMap)return;
stFocusedCode=null;
try{var rb=document.getElementById('stReset');if(rb)rb.style.display='none';}catch(e){}
try{stHighlightRow(null);}catch(e){}
if(stFocusG){stMap.removeLayer(stFocusG);stFocusG=null;}
Object.keys(stLayers).forEach(cat=>{
const show=(stSel==='Tutte'||stSel===cat);
if(show){if(!stMap.hasLayer(stLayers[cat]))stLayers[cat].addTo(stMap);}
else if(stMap.hasLayer(stLayers[cat]))stMap.removeLayer(stLayers[cat]);
});
if(stSel!=='Tutte'){
const all=[];STRADE[stSel].forEach(r=>routePts(r.c).forEach(p=>all.push(p)));
if(all.length)try{stMap.fitBounds(all,{padding:[40,40]});}catch(e){}
} else try{stMap.setView([45.65,9.75],8);}catch(e){}
}

/* ---- build luoghi ---- */
function buildLuoghi(){
if(sdBuilt)return;
const D=window.__LUOGHI__||{};
LUOGHI=[];
Object.keys(D).forEach(cat=>{(D[cat]||[]).forEach(p=>LUOGHI.push({cosa:p[0],dove:p[1],cat:cat}));});
LUOGHI.forEach((x,i)=>x.id='L'+i);
try{var _sc=document.getElementById('studyCardSub');if(_sc)_sc.textContent='Cosa & Dove: '+LUOGHI.length+' luoghi con flashcard e ripasso';}catch(e){}
sdBuilt=true;
}

/* ---- apri/chiudi/nav ---- */
function openStudy(){
setAccent('study');buildLuoghi();
document.getElementById('homeScreen').style.display='none';
document.getElementById('homeBtn').style.display='flex';
document.getElementById('studyApp').classList.add('open');
renderStudyDash();sdShow('dash');
try{pushTrap();}catch(e){}
}
function closeStudy(){SS=null;document.getElementById('studyApp').classList.remove('open');}
function sdShow(v){
sdCurView=v;
['sdDash','sdZones','sdMetro','sdStrade'].forEach(id=>document.getElementById(id).style.display=(id==='sd'+v.charAt(0).toUpperCase()+v.slice(1))?'block':'none');
document.getElementById('sdRun').style.display=v==='run'?'flex':'none';
document.querySelector('#studyApp .qhead').style.display=v==='run'?'none':'flex';
const titles={dash:'Studio',zones:'Ripassa per zona',metro:'Metro di Milano',strade:'Strade & Autostrade'};
document.getElementById('sdTitle').textContent=titles[v]||'Studio';
var _sv=(v==='run')?'sdRun':('sd'+v.charAt(0).toUpperCase()+v.slice(1));sceneAnim(document.getElementById(_sv));
}
function sdBack(){
if(sdCurView==='dash')goHome();
else {renderStudyDash();sdShow('dash');}
}
function sdInfo(){
if(sdCurView==='run')toast2('ℹ️ Gira la carta, poi segna se la sapevi');
else if(sdCurView==='metro')toast2('ℹ️ Tocca una linea per vedere le fermate');
else if(sdCurView==='strade')toast2('ℹ️ Statali, autostrade e tangenziali');
else toast2('ℹ️ Studio: luoghi, metro e strade');
}

/* ---- dashboard ---- */
function sdMasteredIn(list){return list.filter(x=>(studyProg[x.id]||0)>=SD_MASTER).length;}
function renderStudyDash(){
const tot=LUOGHI.length, mast=sdMasteredIn(LUOGHI);
const pct=tot?Math.round(mast/tot*100):0;
document.getElementById('sdHeroBar').style.width=pct+'%';
document.getElementById('sdHeroL').textContent='Imparati '+mast+'/'+tot;
var _hs=document.getElementById('sdHeroSub');if(_hs)_hs.textContent=tot+' luoghi di Milano da sapere a memoria per il colloquio.';
document.getElementById('sdHeroR').textContent=pct+'%';
let h='';
SD_CATS.forEach(c=>{
const list=LUOGHI.filter(x=>x.cat===c.key);
const m=sdMasteredIn(list);
const p=list.length?Math.round(m/list.length*100):0;
h+=`<button class="sd-tile" onclick="sdStart('${c.key.replace(/'/g,"\\'")}')">
<div class="sd-tile-ic" style="background:${c.bg}">${c.emoji}</div>
<div class="sd-tile-tx"><strong>${esc(c.key)}</strong><small>${m}/${list.length} imparati</small>
<div class="sd-tile-bar"><i style="width:${p}%"></i></div></div>
<div class="sd-tile-ar">›</div></button>`;
});
document.getElementById('sdTiles').innerHTML=h;
const errN=LUOGHI.filter(x=>studyProg[x.id]!==undefined&&studyProg[x.id]<SD_MASTER).length;
document.getElementById('sdErrSub').textContent=errN?(errN+' schede ancora da fissare'):'Nessun errore da ripassare';
}

/* ════ METRO explorer ════ */
function openMetro(){sdShow('metro');initMetroMap();renderMetro();mtFocusMap();}
function badgeHtml(arr){
return arr.map(b=>{
if(b==='FS')return '<span class="mt-b fs">FS</span>';
if(b==='FN')return '<span class="mt-b fn">FNM</span>';
if(b==='AIR')return '<span class="mt-b air">✈ Linate</span>';
return '<span class="mt-b" style="background:'+(MCOL[b]||'#888')+'">'+b+'</span>';
}).join('');
}
function renderMetro(){
let pills='<button class="mt-pill mt-cat '+(mtSel==='all'?'on':'')+'" onclick="mtPick(\'all\')">Tutte</button>'+
METRO.map(l=>`<button class="mt-pill ${l.id===mtSel?'on':''}" style="background:${l.col}" onclick="mtPick('${l.id}')">${l.id}</button>`).join('');
document.getElementById('mtLines').innerHTML=pills;
let h='';
if(mtSel==='all'){
var _nf=Object.keys(metroIndex()).length;h='<div class="mt-capi">🚇 5 linee · '+_nf+' fermate. Tocca una linea per evidenziarla ed elencarne le fermate.</div>';
METRO.forEach(L=>{h+=`<div class="mt-st"><span class="mt-dot" style="background:${L.col}"></span><span class="mt-nm">${esc(L.nome)}</span><span class="mt-badges" style="color:var(--mu);font-size:12px;font-weight:600">${esc(L.capi)}</span></div>`;});
} else {
const L=METRO.find(l=>l.id===mtSel);
h='<div class="mt-capi">🚇 '+esc(L.nome)+' · '+esc(L.capi)+'</div>';
L.tratte.forEach(tr=>{
if(tr.t)h+='<div class="mt-tratta">'+esc(tr.t)+'</div>';
tr.s.forEach(st=>{
h+=`<div class="mt-st"><span class="mt-dot" style="background:${L.col}"></span><span class="mt-nm">${esc(st[0])}</span><span class="mt-badges">${badgeHtml(st[1])}</span></div>`;
});
});
}
document.getElementById('mtBody').innerHTML=h;
}
function mtPick(id){mtSel=id;hap();renderMetro();mtFocusMap();}

/* indice fermata -> linee (per le flashcard) */
function metroIndex(){
const idx={};
METRO.forEach(L=>L.tratte.forEach(tr=>tr.s.forEach(st=>{
const nm=st[0];(idx[nm]=idx[nm]||{lines:new Set(),extra:new Set()});
idx[nm].lines.add(L.id);
st[1].forEach(b=>{if(b==='FS'||b==='FN'||b==='AIR')idx[nm].extra.add(b);else idx[nm].lines.add(b);});
})));
return idx;
}

/* ════ STRADE explorer ════ */
function openStrade(){sdShow('strade');initStradeMap();renderStrade();stFocusMap();}
function renderStrade(){
const cats=['Tutte'].concat(Object.keys(STRADE));
document.getElementById('stCats').innerHTML=cats.map(c=>`<button class="mt-pill mt-cat ${c===stSel?'on':''}" onclick="stPick('${c}')">${c}</button>`).join('');
const groups=(stSel==='Tutte')?Object.keys(STRADE):[stSel];
let h='';
groups.forEach(g=>{
if(stSel==='Tutte')h+='<div class="mt-tratta">'+esc(g)+'</div>';
STRADE[g].forEach(r=>{
h+=`<div class="st-row" data-code="${esc(r.c)}" onclick="stFocusRoad('${r.c}')"><span class="st-code">${esc(r.c)}</span><div class="st-tx"><strong>${esc(r.n)}</strong><small>${esc(r.i)}</small></div></div>`;
});
});
document.getElementById('stRoadsBody').innerHTML=h;
}
function stPick(c){stSel=c;hap();renderStrade();stFocusMap();}

/* ════ FLASHCARD ENGINE (generico) ════ */
function sdById(id){return LUOGHI.find(x=>x.id===id);}
function sdStart(catKey){ /* luoghi */
let pool;
if(catKey==='mix')pool=LUOGHI.slice();
else if(catKey==='errori'){pool=LUOGHI.filter(x=>studyProg[x.id]!==undefined&&studyProg[x.id]<SD_MASTER);if(!pool.length){toast2('🎉 Niente da ripassare!');return;}}
else pool=LUOGHI.filter(x=>x.cat===catKey);
if(!pool.length){toast2('Nessuna scheda');return;}
pool=sdShuffle(pool.slice());
pool.sort((a,b)=>(studyProg[a.id]||0)-(studyProg[b.id]||0));
const ids=pool.slice(0,15).map(x=>x.id);
SS={mode:'luoghi',deck:ids,idx:0,dir:'cd',flipped:false,home:'dash',
again:()=>sdStart(catKey)};
document.querySelector('.sd-dir').style.display='flex';
sdShow('run');sdRenderCard();hap();
}
function sdStartMetro(){
const idx=metroIndex();
let cards=Object.keys(idx).map(nm=>{
const lines=[...idx[nm].lines], extra=[...idx[nm].extra];
const back=lines.map(l=>METRO.find(m=>m.id===l)?METRO.find(m=>m.id===l).nome:l).join(' · ')
+(extra.length?'\n('+extra.map(e=>e==='FS'?'FS':e==='FN'?'FNM':'Aeroporto Linate').join(', ')+')':'');
return {key:'MET_'+nm,front:nm,back:back,tag:'Su quale linea si trova?',pill:lines.join('/')};
});
cards=sdShuffle(cards).sort((a,b)=>(studyProg[a.key]||0)-(studyProg[b.key]||0)).slice(0,20);
sdStartDeck(cards,'metro',()=>sdStartMetro());
}
function sdStartStrade(){
const groups=(stSel==='Tutte')?Object.keys(STRADE):[stSel];
let cards=[];
groups.forEach(g=>STRADE[g].forEach(r=>cards.push({key:'STR_'+r.c,front:r.c,back:r.n+'\n'+r.i,tag:'Che strada è? Cosa collega?',pill:g})));
cards=sdShuffle(cards).sort((a,b)=>(studyProg[a.key]||0)-(studyProg[b.key]||0));
sdStartDeck(cards,'strade',()=>sdStartStrade());
}
function sdStartDeck(cards,home,again){
if(!cards.length){toast2('Nessuna scheda');return;}
SS={mode:'deck',cards:cards,idx:0,flipped:false,home:home,again:again};
document.querySelector('.sd-dir').style.display='none';
sdShow('run');sdRenderCard();hap();
}
function sdCur(){
if(SS.mode==='luoghi'){const it=sdById(SS.deck[SS.idx]);const f=SS.dir==='cd';
return {key:it.id,tag:f?'Dove si trova?':'Quale luogo è?',front:f?it.cosa:it.dove,back:f?it.dove:it.cosa,pill:it.cat};}
return SS.cards[SS.idx];
}
function sdLen(){return SS.mode==='luoghi'?SS.deck.length:SS.cards.length;}
function sdRenderCard(){
if(!SS)return;
const tot=sdLen(),c=sdCur();
document.getElementById('sdRunBar').style.width=Math.round((SS.idx+1)/tot*100)+'%';/*[FIX] barra piena sull'ultima carta*/
document.getElementById('sdRunCount').textContent=(SS.idx+1)+'/'+tot;
SS.flipped=false;
var _cc=document.getElementById('sdCard');if(_cc){_cc.classList.remove('flip','card-in');if(SS.idx>0){void _cc.offsetWidth;_cc.classList.add('card-in');}}/*[ANIM] la carta successiva entra da destra*/
document.getElementById('sdCardCat').textContent=c.pill||'';
document.getElementById('sdCardTag').textContent=c.tag;
document.getElementById('sdCardQ').textContent=c.front;
document.getElementById('sdCardA').textContent=c.back;
document.getElementById('sdCardBack').style.display='none';
document.getElementById('sdCardHint').style.display='block';
document.getElementById('sdActions').innerHTML='<button class="sd-show" id="sdShowBtn" onclick="sdFlip()">Mostra risposta</button>';
}
function sdFlip(){
if(!SS||SS.flipped)return;
SS.flipped=true;
var _c=document.getElementById('sdCard');if(_c){_c.classList.remove('flip');void _c.offsetWidth;_c.classList.add('flip');}
document.getElementById('sdCardBack').style.display='block';
document.getElementById('sdCardHint').style.display='none';
document.getElementById('sdActions').innerHTML=
'<button class="sd-no" onclick="sdAnswer(false)">✕ Non la sapevo</button>'+
'<button class="sd-yes" onclick="sdAnswer(true)">✓ La sapevo</button>';
hap();
}
function sdAnswer(known){
if(!SS)return;
if(SS._lock)return;SS._lock=true;setTimeout(function(){if(SS)SS._lock=false;},380);/*[FIX] doppio tap veloce non risponde alla carta successiva*/
const c=sdCur(),lvl=studyProg[c.key]||0;/*[FIX] niente shadowing di cur*/
studyProg[c.key]=known?Math.min(5,lvl+1):0;
sdSave();hap(known?'m':'e');
SS.idx++;
if(SS.idx>=sdLen())sdFinish();else sdRenderCard();
}
function sdToggleDir(){
if(!SS||SS.mode!=='luoghi')return;
SS.dir=SS.dir==='cd'?'dc':'cd';
document.getElementById('sdDirBtn').textContent=SS.dir==='cd'?'Nome → Indirizzo':'Indirizzo → Nome';
sdRenderCard();
}
function sdExit(){
if(SS&&SS.idx>0&&SS.idx<sdLen()){if(!confirm('Uscire dal ripasso?'))return;}
sdLeaveRun();
}
function sdLeaveRun(){
const home=SS?SS.home:'dash';SS=null;sdRestoreCardWrap();
if(home==='metro'){renderMetro();sdShow('metro');}
else if(home==='strade'){renderStrade();sdShow('strade');}
else {renderStudyDash();sdShow('dash');}
}
function sdFinish(){
if(SS)SS._done=true;/*[FIX] sulla schermata Finito la tab bar non chiede piu conferma di uscita*/
const n=sdLen();
document.querySelector('.sd-cardwrap').innerHTML=
'<div class="sd-done"><div class="e">🎉</div><h2>Finito!</h2><p>Hai ripassato '+n+' schede.</p></div>';
document.getElementById('sdActions').innerHTML=
'<button class="sd-no" onclick="sdLeaveRun()">Torna indietro</button>'+
'<button class="sd-yes" onclick="sdAgain()">Continua</button>';
confetti();
}
function sdAgain(){const fn=SS&&SS.again?SS.again:null;sdRestoreCardWrap();if(fn)fn();else sdLeaveRun();}
function sdRestoreCardWrap(){
document.querySelector('.sd-cardwrap').innerHTML=
'<div class="sd-card" id="sdCard" onclick="sdFlip()"><div class="sd-cat-pill" id="sdCardCat"></div>'+
'<div class="sd-card-tag" id="sdCardTag">Dove si trova?</div><div class="sd-card-q" id="sdCardQ"></div>'+
'<div id="sdCardBack" style="display:none"><div class="sd-card-sep"></div><div class="sd-card-a" id="sdCardA"></div></div>'+
'<div class="sd-card-hint" id="sdCardHint">Tocca per vedere la risposta</div></div>';
}

/* ════ zone ════ */
function sdZona(dove){let z=dove.split(/\d|\(/)[0].trim().replace(/[ ,\-]+$/,'');return z||dove;}
function sdShowZones(){
buildLuoghi();
const groups={};
LUOGHI.forEach(x=>{const z=sdZona(x.dove);(groups[z]=groups[z]||[]).push(x);});
const arr=Object.keys(groups).map(z=>({z:z,items:groups[z]})).filter(g=>g.items.length>=2);
arr.sort((a,b)=>b.items.length-a.items.length);
let h='<div class="qsec-title">'+arr.length+' zone con più luoghi</div>';
arr.forEach((g,i)=>{
let rows=g.items.map(it=>`<div class="sd-zone-row"><span class="zr-cosa">${esc(it.cosa)}</span><span class="zr-dove">${esc(it.dove)}</span></div>`).join('');
h+=`<div class="sd-zone" id="sdz${i}"><div class="sd-zone-h" onclick="sdToggleZone(${i})"><div class="z-pin">📍</div><strong>${esc(g.z)}</strong><span class="z-cnt">${g.items.length}</span><span class="z-ar">›</span></div><div class="sd-zone-body">${rows}</div></div>`;
});
document.getElementById('sdZoneList').innerHTML=h;
sdShow('zones');
}
function sdToggleZone(i){const el=document.getElementById('sdz'+i);if(el)el.classList.toggle('open');}

/* nav */
function goStudy(){openStudy();}
const _oldGoHome=goHome;
goHome=function(){closeStudy();_oldGoHome();};

/* ── TASTO INDIETRO DEL BROWSER: resta dentro l'app invece di uscire ── */
function pushTrap(){try{history.pushState({app:1},'');}catch(e){}}
function studyIsOpen(){var e=document.getElementById('studyApp');return !!(e&&e.classList.contains('open'));}
function quizIsOpen(){try{return qCurOpen();}catch(e){return false;}}
function topoIsOpen(){var h=document.getElementById('homeScreen');return !!(h&&h.style.display==='none'&&!quizIsOpen()&&!studyIsOpen());}
function appBack(){
/* 1) se c'è una modale aperta, chiudila prima */
try{if(document.querySelector('.modal.open')){closeAllM();return true;}}catch(e){}
/* 2) Quiz */
if(quizIsOpen()){
if(qCurView==='run'){qConfirmExit();return true;}
if(qCurView==='topics'||qCurView==='result'){renderDash();showQView('dash');return true;}
goHome();return true;
}
/* 3) Studio */
if(studyIsOpen()){
if(sdCurView==='run'){sdExit();return true;}
if(sdCurView!=='dash'){renderStudyDash();sdShow('dash');return true;}
goHome();return true;
}
/* 4) Topografia */
if(topoIsOpen()){goHome();return true;}
/* 5) già in home → consenti l'uscita normale */
return false;
}
window.addEventListener('popstate',function(){
var handled=false;try{handled=appBack();}catch(e){}
if(handled)pushTrap();
});

/* helper marker + linea (definiti dopo Leaflet) */
function getAccent(){try{var v=getComputedStyle(document.body).getPropertyValue('--a').trim();return v||'#2B59C3';}catch(e){return '#2B59C3';}}
function pinIcon(){return L.divIcon({className:'pin-wrap',html:'<div class="pin-pulse"></div><div class="pin-emoji">\uD83D\uDCCD</div>',iconSize:[34,34],iconAnchor:[17,32],popupAnchor:[0,-30]});}

/* ===== Celebrazione fine percorso ===== */
let _lastCeleb={id:null,t:0};
function routeFinishCheck(){
if(!cur)return;
var now=Date.now();
if(_lastCeleb.id===cur.id && now-_lastCeleb.t<6000)return; /* niente doppioni */
_lastCeleb={id:cur.id,t:now};
routeCelebrate();
}
function routeCelebrate(){
try{if(cur){done[cur.id]=true;save();autoSave();updateUI();syncListActive();}}catch(e){}
try{confetti();}catch(e){}
var EM=['\uD83C\uDF89','\uD83E\uDD73','\uD83D\uDE04','\u2B50','\u2728','\uD83D\uDC4F','\uD83D\uDE96'];
for(var i=0;i<14;i++){(function(i){
var e=document.createElement('div');e.className='joy';e.textContent=EM[i%EM.length];
e.style.left=(14+Math.random()*72)+'%';
e.style.top=(55+Math.random()*12)+'%';
e.style.fontSize=(24+Math.random()*18)+'px';
e.style.setProperty('--rot',(Math.random()*120-60)+'deg');
e.style.animationDelay=(Math.random()*.35)+'s';
document.body.appendChild(e);
setTimeout(function(){if(e.parentNode)e.remove();},2200);
})(i);}
var b=document.createElement('div');b.className='joy-badge';
b.textContent='\uD83C\uDF89 Percorso completato!';
document.body.appendChild(b);
setTimeout(function(){if(b.parentNode)b.remove();},2000);
try{if(vibOn&&navigator.vibrate)navigator.vibrate([10,10,10]);}catch(e){}/*[FIX] niente suono errore sulla celebrazione: solo vibrazione festosa*/
}

/* ===== v2b: ricerca-Invio, ripetizione spaziata, storico esami ===== */
function sbKey(e){if(e.key!=='Enter')return;e.preventDefault();var q=(document.getElementById('sb').value||'').toUpperCase().trim();if(!q)return;/*[FIX] Invio a vuoto: nessuna selezione casuale*/var res=q?routes.filter(function(r){return r.title.includes(q)||r.steps.some(function(s){return s.includes(q);});}):routes;if(res&&res.length)selectRoute(res[0]);}

function srDue(id){var e=qtStats.err[id];return (e&&typeof e==='object')?(e.due||0):0;}
function srMark(id,correct){
var e=qtStats.err[id];
if(correct){
if(e===undefined)return;
var box=((typeof e==='object'&&e.box)?e.box:0)+1;
if(box>=3){delete qtStats.err[id];return;}
var days=[0,1,3,7][box]||7;
qtStats.err[id]={box:box,due:Date.now()+days*86400000};
}else{
qtStats.err[id]={box:0,due:Date.now()};
qtStats.wrongN=qtStats.wrongN||{};qtStats.wrongN[id]=(qtStats.wrongN[id]||0)+1;/*[v10] per la classifica delle piu sbagliate*/
}
}

function renderExamHist(){
var w=document.getElementById('qHistWrap');if(!w)return;
if(!Array.isArray(qExamHist))qExamHist=[];
if(!qExamHist.length){w.innerHTML='<div class="qerr-card" style="text-align:center;color:var(--mu);font-size:14px;font-weight:600">Nessuna simulazione ancora. Avvia il tuo primo esame! 🚀</div>';return;}
var n=qExamHist.length,pass=qExamHist.filter(function(x){return x&&x.pass;}).length;
var rate=Math.round(pass/n*100);
var last=qExamHist.slice(-8);
var chips=last.map(function(x){var d=new Date(x.d);var lbl=d.getDate()+'/'+(d.getMonth()+1);return '<div style="flex:1;min-width:0;text-align:center"><div style="height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;background:'+(x.pass?'var(--ok)':'var(--err)')+'">'+(x.pass?'✓':'✕')+'</div><small style="font-size:10px;color:var(--mu);display:block;margin-top:3px">'+lbl+'</small></div>';}).join('');
w.innerHTML='<div class="qerr-card"><div class="qerr-head" style="margin-bottom:12px"><h3>Promosso '+pass+' su '+n+'</h3><span style="font-weight:800;font-size:20px;color:'+(rate>=60?'var(--ok)':'var(--err)')+'">'+rate+'%</span></div><div style="display:flex;gap:6px">'+chips+'</div></div>';
}

/* ===== v3: marker che cammina + count-up ===== */
let _slideTok=0;
function slideMarker(m,to){
if(!m)return;
if(typeof map==='undefined'||!map){m.setLatLng(to);return;}
var from=m.getLatLng();
try{var p1=map.latLngToContainerPoint(from),p2=map.latLngToContainerPoint(L.latLng(to[0],to[1]));var dist=Math.hypot(p2.x-p1.x,p2.y-p1.y);if(dist<2||dist>520){m.setLatLng(to);return;}}catch(e){m.setLatLng(to);return;}
try{trailFx([from.lat,from.lng],to);}catch(e){}
var tok=++_slideTok,t0=performance.now(),dur=380,a=from.lat,b=from.lng,c=to[0],d=to[1];
function step(now){if(tok!==_slideTok)return;var k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3);try{m.setLatLng([a+(c-a)*e,b+(d-b)*e]);}catch(err){return;}if(k<1)requestAnimationFrame(step);}
requestAnimationFrame(step);
}
/* scia luminosa: una polilinea che appare e svanisce tra la via precedente e quella nuova */
function trailFx(from,to){
if(!map||prefersReducedMotion())return;
try{if(_trail){map.removeLayer(_trail);_trail=null;}}catch(e){}
try{_trail=L.polyline([from,to],{color:'#fff',weight:8,opacity:.85,lineCap:'round',className:'route-trail'}).addTo(map);}catch(e){return;}
var tok=++_trailTok,t0=performance.now(),dur=620;
function step(now){
if(tok!==_trailTok)return;
var k=Math.min(1,(now-t0)/dur);
try{if(_trail)_trail.setStyle({opacity:.85*(1-k),weight:8-5*k});}catch(e){}
if(k<1)requestAnimationFrame(step);
else{try{if(_trail){map.removeLayer(_trail);_trail=null;}}catch(e){}}
}
requestAnimationFrame(step);
}
function countUp(el,to,ms){
if(!el)return;to=to|0;ms=ms||650;var t0=performance.now();
function step(now){var k=Math.min(1,(now-t0)/ms),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e);if(k<1)requestAnimationFrame(step);}
requestAnimationFrame(step);
}

/* ===== v4: readiness, segnalibri/segnala, autoplay ===== */
function _pct(a,b){return b>0?Math.max(0,Math.min(100,Math.round(a/b*100))):0;}
function readinessScore(){
var qok=0,qseen=0;try{var c=qtStats.cat||{};Object.keys(c).forEach(function(k){qok+=c[k].ok||0;qseen+=c[k].seen||0;});}catch(e){}
var quiz=_pct(qok,qseen);
var fmast=0,ftot=0;try{ftot=(typeof LUOGHI!=='undefined')?LUOGHI.length:0;if(ftot)fmast=LUOGHI.filter(function(x){return (studyProg[x.id]||0)>=SD_MASTER;}).length;}catch(e){}
var flash=_pct(fmast,ftot);
var rdone=0,rtot=0;try{rtot=routes.length;rdone=routes.filter(function(r){return done[r.id];}).length;}catch(e){}
var topo=_pct(rdone,rtot);
return {score:Math.round(quiz*0.5+flash*0.3+topo*0.2),quiz:quiz,flash:flash,topo:topo};
}
function renderReadiness(){
var w=document.getElementById('readyCard');if(!w)return;
var r=readinessScore();
var col=r.score>=80?'var(--ok)':r.score>=50?'var(--warn)':'var(--err)';
var msg=r.score>=80?'Sei pronto! 🎯':r.score>=50?'Ci sei quasi 💪':'Continua così 📚';
var R=34,C=2*Math.PI*R,off=C*(1-r.score/100);
w.innerHTML='<div class="ready-card"><div class="ready-ring"><svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="'+R+'" fill="none" stroke="var(--fill2)" stroke-width="8"/><circle cx="42" cy="42" r="'+R+'" fill="none" stroke="'+col+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 42 42)"/></svg><span>'+r.score+'%</span></div><div class="ready-tx"><strong>'+msg+'</strong><small>Quiz '+r.quiz+'% · Luoghi '+r.flash+'% · Mappa '+r.topo+'%</small></div></div>';
}

function qBmRender(){if(typeof Q==='undefined'||!Q)return;qtStats.bm=qtStats.bm||{};var it=Q.items[Q.idx];var bm=document.getElementById('qBm');if(bm){var on=!!qtStats.bm[it.id];bm.textContent=on?'★':'☆';bm.classList.toggle('on',on);}}
function qToggleBm(){if(typeof Q==='undefined'||!Q)return;qtStats.bm=qtStats.bm||{};var id=Q.items[Q.idx].id;if(qtStats.bm[id])delete qtStats.bm[id];else qtStats.bm[id]=1;try{qtSave();}catch(e){}qBmRender();hap();toast2(qtStats.bm[id]?'★ Aggiunta ai segnalibri':'Rimossa dai segnalibri');}
function qReportQ(){if(typeof Q==='undefined'||!Q)return;qtStats.report=qtStats.report||{};var id=Q.items[Q.idx].id;qtStats.report[id]=1;try{qtSave();}catch(e){}hap();toast2('⚐ Domanda segnalata, grazie');}
function qDashExtra(){try{qtStats.bm=qtStats.bm||{};var n=Object.keys(qtStats.bm).length;var wrap=document.getElementById('qTilesArg');if(!wrap||!n)return;var b=document.createElement('button');b.className='qtile';b.onclick=function(){qStartCat('bm');};b.innerHTML='<div class="qtile-ic" style="background:rgba(255,149,0,.14)">★</div><div class="qtile-tx"><strong>Segnalibri</strong><small>'+n+' domande salvate</small></div><div class="qtile-ar">›</div>';wrap.appendChild(b);}catch(e){}}

let _autoTimer=null;
function toggleAutoplay(){
if(_autoTimer){stopAutoplay();return;}
if(typeof cur==='undefined'||!cur)return;
var btn=document.getElementById('playBtn');if(btn)btn.textContent='⏸';
if(step>=cur.steps.length-1){step=0;try{syncListActive();updateUI();goStep();}catch(e){}}
_autoTimer=setInterval(function(){if(typeof cur==='undefined'||!cur||step>=cur.steps.length-1){stopAutoplay();return;}try{nextS();}catch(e){stopAutoplay();}},1500);
hap();
}
function stopAutoplay(){if(_autoTimer){clearInterval(_autoTimer);_autoTimer=null;}var btn=document.getElementById('playBtn');if(btn)btn.textContent='▶';}

/* ═══════ PACCHETTO v6: ripasso rapido, badge, contatore, swipe, settimana ═══════ */

/* ── RIPASSA 10 MINUTI: mix intelligente scelto dall'app ──
   priorità: 1) errori quiz scaduti (ripetizione spaziata) 2) domande mai viste 3) resto */
function smartReview(){
try{buildQuiz();}catch(e){}
let items=QUIZ_ALL.filter(function(it){return qtStats.err[it.id]&&srDue(it.id)<=Date.now();});
items.sort(function(a,b){return srDue(a.id)-srDue(b.id);});
if(items.length<12){
var have={};items.forEach(function(it){have[it.id]=1;});
var unseen=qShuffle(QUIZ_ALL.filter(function(it){return !have[it.id]&&!qtStats.seenIds[it.id];}));
items=items.concat(unseen.slice(0,12-items.length));
}
if(items.length<12){
var have2={};items.forEach(function(it){have2[it.id]=1;});
items=items.concat(qShuffle(QUIZ_ALL.filter(function(it){return !have2[it.id];})).slice(0,12-items.length));
}
items=items.slice(0,12);
if(!items.length){toast2('Nessuna domanda disponibile');return;}
openQuiz();
startQuiz(items,{mode:'study',title:'Ripasso rapido'});
}

/* ── BADGE sulla tab Quiz: quanti errori sono da ripassare OGGI ── */
function updateTabBadge(){
try{
var n=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=Date.now();}).length;
var tab=document.querySelector('#tabbar .tab[data-t="quiz"]');if(!tab)return;
var b=tab.querySelector('.tb-badge');
if(n>0){
if(!b){b=document.createElement('span');b.className='tb-badge';tab.appendChild(b);}
b.textContent=n>99?'99+':n;
}else if(b)b.remove();
}catch(e){}
}

/* ── CONTATORE domande viste (nel dashboard quiz) ── */
function renderSeenCount(){
try{
var el=document.getElementById('qSeen');if(!el)return;
var seen=Object.keys(qtStats.seenIds||{}).length,tot=QUIZ_ALL.length||919;
var pct=tot?Math.round(seen/tot*100):0;
el.innerHTML='📖 <b>'+seen+'</b> / '+tot+' domande viste · '+pct+'%';
}catch(e){}
}

/* ── CONTEGGIO GIORNALIERO + grafico settimanale in home ── */
function _dayKey(d){d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function bumpDaily(n){try{qtStats.daily=qtStats.daily||{};var k=_dayKey();qtStats.daily[k]=(qtStats.daily[k]||0)+(n||1);
/* tieni solo gli ultimi 30 giorni */
var keys=Object.keys(qtStats.daily);if(keys.length>35){var cutoff=Date.now()-30*86400000;keys.forEach(function(kk){var p=kk.split('-');var t=new Date(+p[0],p[1]-1,+p[2]).getTime();if(t<cutoff)delete qtStats.daily[kk];});}
}catch(e){}}
function renderWeekly(){
try{
var w=document.getElementById('weekChart');if(!w)return;
qtStats.daily=qtStats.daily||{};
var days=[],max=1,tot7=0;
var LBL=['D','L','M','M','G','V','S'];
for(var i=6;i>=0;i--){
var d=new Date();d.setDate(d.getDate()-i);
var v=qtStats.daily[_dayKey(d)]||0;
days.push({v:v,l:LBL[d.getDay()],today:i===0});
if(v>max)max=v;tot7+=v;
}
if(tot7===0){w.innerHTML='';w.style.display='none';return;}
w.style.display='';
var bars=days.map(function(d){
var h=Math.max(6,Math.round(d.v/max*40));
return '<div class="wk-col"><div class="wk-bar'+(d.today?' today':'')+(d.v?'':' zero')+'" style="height:'+h+'px"></div><small>'+d.l+'</small></div>';
}).join('');
w.innerHTML='<div class="wk-card"><div class="wk-head"><strong>Ultimi 7 giorni</strong><span>'+tot7+' risposte</span></div><div class="wk-bars">'+bars+'</div></div>';
}catch(e){}
}

/* aggancio conteggi: quiz teorico (qFinish), flashcard (sdAnswer), quiz vie (checkQ) */
(function(){
try{
var _qf=qFinish;qFinish=function(t){var before=Q?Q.ans.filter(function(a){return a>=0;}).length:0;_qf(t);
if(qCurView==='result'){/*[FIX] conta SOLO se il quiz è davvero finito (non se l'utente annulla il confirm)*/
if(before)bumpDaily(before);try{qtSave();}catch(e){}updateTabBadge();renderSeenCount();
}};
var _sa=sdAnswer;sdAnswer=function(k){var _b=SS?SS.idx:-1;_sa(k);if(SS===null||_b!==(SS?SS.idx:-1)){bumpDaily(1);try{qtSave();}catch(e){}}};/*[FIX] conta solo se la risposta è passata (lock) e SALVA: prima il grafico perdeva le flashcard al riavvio*/
var _cq=checkQ;checkQ=function(){var _t=cur?(qStats[cur.id]||{}).total||0:0;_cq();var _t2=cur?(qStats[cur.id]||{}).total||0:0;if(_t2>_t){bumpDaily(1);try{qtSave();}catch(e){}}};/*[FIX] salva anche dal quiz vie*/
var _rd=renderDash;renderDash=function(){_rd();renderSeenCount();};
var _gh2=goHome;goHome=function(){_gh2();try{renderWeekly();updateTabBadge();}catch(e){}};
}catch(e){}
})();

/* ── SWIPE sulle flashcard: destra = la sapevo, sinistra = no ── */
let _swEl=null,_swX=0,_swY=0;
document.addEventListener('touchstart',function(e){
var c=e.target.closest?e.target.closest('#sdCard'):null;
if(!c||!SS||!SS.flipped)return; /* solo a risposta scoperta */
_swEl=c;_swX=e.touches[0].clientX;_swY=e.touches[0].clientY;
},{passive:true});
document.addEventListener('touchmove',function(e){
if(!_swEl)return;
var dx=e.touches[0].clientX-_swX,dy=e.touches[0].clientY-_swY;
if(Math.abs(dy)>80){_swEl.style.transform='';_swEl.style.transition='';_swEl=null;return;} /* stava scrollando */
_swEl.style.transition='none';
_swEl.style.transform='translateX('+dx+'px) rotate('+(dx/22)+'deg)';
_swEl.classList.toggle('sw-yes',dx>50);
_swEl.classList.toggle('sw-no',dx<-50);
},{passive:true});
document.addEventListener('touchend',function(e){
if(!_swEl)return;
var el=_swEl;_swEl=null;
var dx=e.changedTouches[0].clientX-_swX;
el.style.transition='transform .22s ease';
el.classList.remove('sw-yes','sw-no');
if(dx>85){el.style.transform='translateX(120vw) rotate(16deg)';setTimeout(function(){if(el.isConnected){el.style.transform='';el.style.transition='';}sdAnswer(true);},200);}
else if(dx<-85){el.style.transform='translateX(-120vw) rotate(-16deg)';setTimeout(function(){if(el.isConnected){el.style.transform='';el.style.transition='';}sdAnswer(false);},200);}
else{el.style.transform='';setTimeout(function(){el.style.transition='';},240);}
},{passive:true});

/* hint di swipe quando la risposta è scoperta */
(function(){
try{
var _sf=sdFlip;
sdFlip=function(){
_sf();
try{if(SS&&SS.flipped){var h=document.getElementById('sdCardHint');if(h){h.style.display='block';h.textContent='← Non la sapevo · scorri · La sapevo →';}}}catch(e){}
};
}catch(e){}
})();

/* avvio: badge e grafico appena l'app è pronta */
setTimeout(function(){try{updateTabBadge();renderWeekly();}catch(e){}},1200);

/* ═══════ PACCHETTO v9: fix finali + animazioni ═══════ */

/* [FIX 4] dopo la rotazione, azzera il max-height inline del pannello (altrimenti resta "corto") */
window.addEventListener('orientationchange',function(){
setTimeout(function(){try{var p=document.getElementById('panel');if(p)p.style.maxHeight='';mapResizeSoon();}catch(e){}},420);
});

/* [ANIM 9] transizione di scena anche su Home e Topografia (le altre viste la hanno già) */
/* [FIX scatti] la vecchia animazione di scena su Home/Topografia è stata rimossa:
si sommava alla slide direzionale (due animazioni insieme = scatti) */

/* [ANIM 13] check animato sul numero della via quando rispondi giusto nel quiz vie */
(function(){try{
var _ck=checkQ;
checkQ=function(){
var _st=step;_ck();
try{
var fb=document.getElementById('qfb');
if(fb&&fb.textContent.indexOf('Corretto')>=0){
var r=listRows[_st];
if(r){r.classList.remove('okpop');void r.offsetWidth;r.classList.add('okpop');setTimeout(function(){r.classList.remove('okpop');},600);}
}
}catch(e){}
};
}catch(e){}})();

/* ═══ TEMA BERLINA (antracite + oro) ═══ */
function togBerlina(){
var on=document.body.classList.toggle('berlina');
ls('berlina',on);
var ic=document.getElementById('berlIcon');if(ic)ic.textContent=on?'✨':'🚘';
toast2(on?'🚘 Tema Berlina attivo':'Tema Milano Notte attivo');hap('m');
}
try{if(lg('berlina',false)){document.body.classList.add('berlina');var _bi=document.getElementById('berlIcon');if(_bi)_bi.textContent='✨';}}catch(e){}

/* ═══════ PACCHETTO v10: strumenti per l'esame ═══════ */

/* ── LE PIÙ SBAGLIATE: le 20 domande con più errori storici ── */
function qStartHard(){
buildQuiz();
qtStats.wrongN=qtStats.wrongN||{};
var ids=Object.keys(qtStats.wrongN).sort(function(a,b){return qtStats.wrongN[b]-qtStats.wrongN[a];}).slice(0,20);
var items=ids.map(function(id){return QUIZ_ALL[id|0];}).filter(Boolean);
if(!items.length){toast2('Nessun errore storico — bravo!');return;}
startQuiz(items,{mode:'study',title:'Le più sbagliate'});
}

/* ── PIANO DI STUDIO: data esame → quante domande nuove al giorno ── */
function setExamDate(){
var cur=lg('examDate',0);
var v=prompt('Data del tuo esame (GG/MM/AAAA):',cur?new Date(cur).toLocaleDateString('it-IT'):'');
if(v===null)return;v=v.trim();
if(!v){ls('examDate',0);renderPlan();return;}
var m=v.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
if(!m){toast2('⚠️ Formato: GG/MM/AAAA');return;}
var y=+m[3];if(y<100)y+=2000;
var d=new Date(y,(+m[2])-1,+m[1],23,59);
if(isNaN(d.getTime())){toast2('⚠️ Data non valida');return;}
ls('examDate',d.getTime());renderPlan();toast2('🎯 Data esame impostata');hap('m');
}
function renderPlan(){
var w=document.getElementById('planCard');if(!w)return;
try{buildQuiz();}catch(e){}
var t=lg('examDate',0);
var unseen=QUIZ_ALL.filter(function(it){return !qtStats.seenIds[it.id];}).length;
if(!t){w.innerHTML='<button class="plan-set" onclick="setExamDate()">🎯 Imposta la data dell\'esame</button>';return;}
var days=Math.ceil((t-Date.now())/86400000);
if(days<0){w.innerHTML='<button class="plan-set" onclick="setExamDate()">🎯 Data esame passata — toccami per aggiornarla</button>';return;}
var perDay=days>0?Math.ceil(unseen/days):unseen;
w.innerHTML='<div class="plan-card" onclick="setExamDate()"><b>'+days+'</b><div class="plan-tx"><strong>giorn'+(days===1?'o':'i')+' all\'esame</strong><small>'+(unseen?('Fai '+perDay+' domande nuove al giorno per vederle tutte'):'Domande completate: concentrati sugli errori 💪')+'</small></div></div>';
}

/* ── OBIETTIVO GIORNALIERO nel grafico settimanale ── */
function setDailyGoal(){
var g=prompt('Obiettivo di risposte al giorno:',lg('dailyGoal',30));
if(g===null)return;g=parseInt(g,10);
if(!g||g<1){toast2('⚠️ Inserisci un numero');return;}
ls('dailyGoal',g);renderWeekly();toast2('🎯 Obiettivo: '+g+' al giorno');
}
(function(){try{
var _rw=renderWeekly;
renderWeekly=function(){
_rw();
try{
var w=document.getElementById('weekChart');if(!w||!w.firstChild)return;
var today=(qtStats.daily||{})[_dayKey()]||0,goal=lg('dailyGoal',30);
var sp=w.querySelector('.wk-head span');
if(sp){sp.textContent='Oggi '+today+'/'+goal+(today>=goal?' ✓':'');sp.style.color=today>=goal?'var(--ok)':'';}
var hd=w.querySelector('.wk-head');if(hd){hd.style.cursor='pointer';hd.onclick=setDailyGoal;}
}catch(e){}
};
}catch(e){}})();

/* ── TRAGUARDI: celebrazioni una-tantum ── */
function checkAch(){
try{
qtStats.ach=qtStats.ach||{};
var seen=Object.keys(qtStats.seenIds||{}).length;
var A=[
['s100',seen>=100,'💯 Traguardo: 100 domande viste!'],
['s500',seen>=500,'🚀 Traguardo: 500 domande viste!'],
['sAll',QUIZ_ALL.length>0&&seen>=QUIZ_ALL.length,'🏆 INCREDIBILE: le hai viste TUTTE!'],
['st7',(lg('streak',{n:0}).n||0)>=7,'🔥 Traguardo: 7 giorni di fila!'],
['pass1',(qExamHist||[]).some(function(x){return x&&x.pass;}),'🎓 Prima simulazione superata!']
];
A.forEach(function(a){if(a[1]&&!qtStats.ach[a[0]]){qtStats.ach[a[0]]=1;try{qtSave();}catch(e){}setTimeout(function(){toast2(a[2]);try{confetti();}catch(e){}},700);}});
}catch(e){}
}
(function(){try{var _qf2=qFinish;qFinish=function(t){_qf2(t);if(qCurView==='result')checkAch();};}catch(e){}})();

/* ── WAKE LOCK: schermo acceso durante l'autoplay del percorso ── */
let _wl=null;
function _wlOn(){try{if('wakeLock'in navigator)navigator.wakeLock.request('screen').then(function(l){_wl=l;}).catch(function(){});}catch(e){}}
function _wlOff(){try{if(_wl){_wl.release();_wl=null;}}catch(e){}}
(function(){try{
var _ta=toggleAutoplay;toggleAutoplay=function(){_ta();if(_autoTimer)_wlOn();else _wlOff();};
var _sa2=stopAutoplay;stopAutoplay=function(){_sa2();_wlOff();};
}catch(e){}})();

/* ── MAPPA SCURA in tema notte ── */
setTileMode=function(noLabels){
if(!map||!window._tileLayer)return;
var dk=document.body.classList.contains('dark');
var url=dk
?('https://{s}.basemaps.cartocdn.com/dark_'+(noLabels?'nolabels':'all')+'/{z}/{x}/{y}{r}.png')
:('https://{s}.basemaps.cartocdn.com/rastertiles/voyager'+(noLabels?'_nolabels':'')+'/{z}/{x}/{y}{r}.png');
window._tileLayer.setUrl(url);
};
(function(){try{var _td=togDark;togDark=function(){_td();try{setTileMode(mode==='c'||mode==='q');}catch(e){}};}catch(e){}})();
setTimeout(function(){try{setTileMode(mode==='c'||mode==='q');}catch(e){}},900);

/* ── LUNGHEZZA PERCORSO in km nel pannello ── */
(function(){try{
var _uu=updateUI;
updateUI=function(){
_uu();
try{
if(!cur||!map)return;
var pts=[];for(var i=0;i<cur.steps.length;i++){var c=coords[cur.id+'_'+i];if(c)pts.push(c);}
if(pts.length>1){
var d=0;for(var j=1;j<pts.length;j++)d+=map.distance([pts[j-1].lat,pts[j-1].lon],[pts[j].lat,pts[j].lon]);
if(d>200){var el=$id('pStat');if(el)el.textContent=el.textContent+' · '+(d/1000).toFixed(1)+' km';}
}
}catch(e){}
};
}catch(e){}})();

/* ── contatore "viste" animato ── */
renderSeenCount=function(){
try{
var el=document.getElementById('qSeen');if(!el)return;
var seen=Object.keys(qtStats.seenIds||{}).length,tot=QUIZ_ALL.length||919,pct=tot?Math.round(seen/tot*100):0;
el.innerHTML='📖 <b>0</b> / '+tot+' domande viste · '+pct+'%'+_weakTxt();
var b=el.querySelector('b');if(b)countUp(b,seen,500);
}catch(e){}
};
/* punto debole: l'argomento dove vai peggio (min 6 domande fatte) */
function _weakTxt(){
try{
var worst=null,wr=1.01;
QARG.forEach(function(c){var s=qtStats.cat[c.id];if(s&&(s.seen||0)>=6){var r=(s.ok||0)/s.seen;if(r<wr){wr=r;worst=c;}}});
return (worst&&wr<.75)?'<br>⚠️ Punto debole: <b>'+worst.label+'</b> ('+Math.round(wr*100)+'% corrette)':'';
}catch(e){return'';}
}

/* ── COLLOQUIO VOCALE: l'app chiede a voce, tu rispondi come all'esame ── */
function sdStartColloquio(){
if(!('speechSynthesis'in window)){toast2('🔇 Sintesi vocale non disponibile');return;}
buildLuoghi();
var pool=sdShuffle(LUOGHI.slice()).sort(function(a,b){return (studyProg[a.id]||0)-(studyProg[b.id]||0);}).slice(0,15);
var cards=pool.map(function(x){return {key:x.id,front:x.cosa,back:x.dove,tag:'🎙 Ascolta e rispondi a voce',pill:x.cat};});
sdStartDeck(cards,'dash',function(){sdStartColloquio();});
if(SS)SS.speak=true;
setTimeout(sdSpeakFront,320);/*[FIX 200-scenari] la prima carta era muta: il flag arrivava dopo il render*/
}
function sdSpeakFront(){
try{
if(!SS||!SS.speak||!('speechSynthesis'in window))return;
speechSynthesis.cancel();
var c=sdCur();var u=new SpeechSynthesisUtterance('Dove si trova: '+c.front+'?');
u.lang='it-IT';u.rate=.95;speechSynthesis.speak(u);
}catch(e){}
}
(function(){try{
var _rc2=sdRenderCard;sdRenderCard=function(){_rc2();if(SS&&SS.speak)setTimeout(sdSpeakFront,180);};
var _fl2=sdFlip;sdFlip=function(){var was=SS&&SS.flipped;_fl2();
try{if(!was&&SS&&SS.speak&&SS.flipped){speechSynthesis.cancel();var c=sdCur();var u=new SpeechSynthesisUtterance(c.back);u.lang='it-IT';u.rate=.95;speechSynthesis.speak(u);}}catch(e){}
};
var _lr2=sdLeaveRun;sdLeaveRun=function(){try{if('speechSynthesis'in window)speechSynthesis.cancel();}catch(e){}_lr2();};
}catch(e){}})();

/* piano + traguardi anche all'avvio e al ritorno in home */
(function(){try{var _gh3=goHome;goHome=function(){_gh3();try{renderPlan();}catch(e){}};}catch(e){}})();
setTimeout(function(){try{renderPlan();checkAch();}catch(e){}},1400);


/* ═══════ PACCHETTO v11: offline garantito, backup, ricerca globale, satellite, tip ═══════ */

/* ── PRECARICO TILE del percorso selezionato: quella zona funziona offline ── */
function _tileXY(lat,lon,z){
var n=Math.pow(2,z);
var x=Math.floor((lon+180)/360*n);
var la=lat*Math.PI/180;
var y=Math.floor((1-Math.log(Math.tan(la)+1/Math.cos(la))/Math.PI)/2*n);
return [x,y];
}
function preloadRouteTiles(){
try{
if(!navigator.onLine||!cur||!window._tileLayer)return;
var tpl=window._tileLayer._url;if(!tpl||tpl.indexOf('cartocdn')<0)return;
var r=(window.devicePixelRatio>1)?'@2x':'';
var urls={},list=[];
cur.steps.forEach(function(_,i){
var c=coords[cur.id+'_'+i];if(!c)return;
[13,14,15].forEach(function(z){
var t=_tileXY(c.lat,c.lon,z);
var s='abc'[(t[0]+t[1])%3]; /* stesso sottodominio che sceglierà Leaflet */
var u=tpl.replace('{s}',s).replace('{z}',z).replace('{x}',t[0]).replace('{y}',t[1]).replace('{r}',r);
if(!urls[u]){urls[u]=1;list.push(u);}
});
});
list=list.slice(0,140); /* tetto di sicurezza */
var i=0;
(function next(){
if(i>=list.length)return;
try{fetch(list[i++],{mode:'no-cors'}).catch(function(){});}catch(e){}
setTimeout(next,55); /* diluito: non intasa la rete */
})();
}catch(e){}
}
(function(){try{var _sr=selectRoute;selectRoute=function(r){_sr(r);setTimeout(preloadRouteTiles,900);};}catch(e){}})();

/* ── BACKUP AUTOMATICO settimanale su cloud (silenzioso, ramo separato) ── */
function weeklyBackup(){
try{
if(!fbOk||!fbRef||typeof firebase==='undefined')return;
var last=lg('lastBk',0);
if(Date.now()-last<6.5*86400000)return;
firebase.database().ref('prontuario_backup').set({routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,studyProg:studyProg,qExamHist:qExamHist,ts:Date.now()})
.then(function(){ls('lastBk',Date.now());console.log('backup settimanale ok');}).catch(function(){});
}catch(e){}
}
setTimeout(weeklyBackup,6000);

/* ── RICERCA GLOBALE: la barra trova anche luoghi, fermate metro e strade ── */
(function(){try{
var _ds=doSrch;
doSrch=function(){
_ds();
try{
var q=document.getElementById('sb').value.toUpperCase().trim();
if(q.length<3)return;
var ul=document.getElementById('sugg');if(!ul||ul.style.display!=='block')return;
buildLuoghi();
function hd(t){var li=document.createElement('li');li.className='sg-hd';li.textContent=t;return li;}
function row(main,meta,fn){
var li=document.createElement('li');
var a=document.createElement('span');a.textContent=main;
var b=document.createElement('span');b.className='si-meta';b.textContent=meta;
li.appendChild(a);li.appendChild(b);
li.onmousedown=function(e){e.preventDefault();};
li.onclick=function(){document.getElementById('sugg').style.display='none';sbArrowSet(false);if(fn)fn();};
return li;
}
/* luoghi: mostra subito l'indirizzo (risposta immediata) */
var lu=LUOGHI.filter(function(x){return x.cosa.toUpperCase().indexOf(q)>=0||x.dove.toUpperCase().indexOf(q)>=0;}).slice(0,4);
if(lu.length){ul.appendChild(hd('📚 Luoghi'));lu.forEach(function(x){ul.appendChild(row(x.cosa,x.dove,null));});}
/* fermate metro: tap → apre la metro */
var mi=metroIndex(),mk=Object.keys(mi).filter(function(n){return n.toUpperCase().indexOf(q)>=0;}).slice(0,4);
if(mk.length){ul.appendChild(hd('🚇 Metro'));mk.forEach(function(n){
var lines=[].slice.call(mi[n].lines).join(' · ');
ul.appendChild(row(n,lines,function(){openStudy();openMetro();}));
});}
/* strade: tap → apre la strada evidenziata sulla mappa */
var sr=[];Object.keys(STRADE).forEach(function(g){STRADE[g].forEach(function(x){if(x.c.toUpperCase().indexOf(q)>=0||x.n.toUpperCase().indexOf(q)>=0)sr.push(x);});});
sr=sr.slice(0,4);
if(sr.length){ul.appendChild(hd('🛣️ Strade'));sr.forEach(function(x){
ul.appendChild(row(x.c+' '+x.n,'',function(){openStudy();openStrade();setTimeout(function(){try{stFocusRoad(x.c);}catch(e){}},350);}));
});}
}catch(e){}
};
}catch(e){}})();

/* ── VISTA SATELLITE: pulsante 🛰 sulla mappa ── */
let _mapSat=lg('mapSat',false);
(function(){try{
var _stm=setTileMode;
setTileMode=function(noLabels){
if(_mapSat&&map&&window._tileLayer){
window._tileLayer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
}else _stm(noLabels);
};
}catch(e){}})();
function togSat(){
_mapSat=!_mapSat;ls('mapSat',_mapSat);
try{setTileMode(mode==='c'||mode==='q');}catch(e){}
var b=document.getElementById('satBtn');if(b)b.textContent=_mapSat?'🗺':'🛰';
toast2(_mapSat?'🛰 Vista satellite':'🗺 Vista mappa');hap();
}
function injectSatBtn(){
try{
if(document.getElementById('satBtn'))return;
var mapEl=document.getElementById('map');if(!mapEl)return;
var b=document.createElement('button');
b.id='satBtn';b.type='button';b.textContent=_mapSat?'🗺':'🛰';
b.setAttribute('aria-label','Cambia vista mappa');
b.onclick=function(ev){try{ev.stopPropagation();}catch(e){}togSat();};
mapEl.appendChild(b);
}catch(e){}
}
setTimeout(function(){injectSatBtn();try{if(_mapSat)setTileMode(mode==='c'||mode==='q');}catch(e){}},1100);

/* ── SUGGERIMENTO DEL GIORNO in home ── */
var TIPS=[
'La Tangenziale Ovest (A50) incrocia la A7 al km 20',
'La SS33 del Sempione parte dall\u2019Arco della Pace',
'Linate si raggiunge con la M4 Blu, capolinea est',
'Max 4 errori all\u2019esame, e mai più di 2 per argomento',
'La M2 Verde ha 4 rami: Gessate, Cologno, Abbiategrasso, Assago',
'La SS36 porta a Lecco, Colico e al passo dello Spluga',
'Ripassare 10 minuti ogni giorno vale più di 2 ore la domenica',
'Duomo è interscambio M1 Rossa ↔ M3 Gialla',
'La SS9 è la Via Emilia: Milano → Lodi → Piacenza',
'Cadorna: M1, M2 e Ferrovie Nord nello stesso nodo',
'La A35 BreBeMi collega Brescia, Bergamo e Milano',
'Rispondere a voce alta fissa la memoria: prova il Colloquio vocale',
'La SS494 Vigevanese passa per Gaggiano e Abbiategrasso',
'San Babila è interscambio M1 ↔ M4',
'Il tuo punto debole è mostrato nel Quiz: parti da lì'
];
function renderTip(){
try{
var hd=document.querySelector('#homeScreen .home-hd');if(!hd)return;
var el=document.getElementById('tipLine');
if(!el){el=document.createElement('div');el.id='tipLine';hd.appendChild(el);}
var day=Math.floor(Date.now()/86400000);
el.textContent='💡 '+TIPS[day%TIPS.length];
}catch(e){}
}
(function(){try{var _gh4=goHome;goHome=function(){_gh4();try{renderTip();}catch(e){}};}catch(e){}})();
setTimeout(renderTip,600);

/* ═══════ PACCHETTO v12: sprint, ordina le vie, long-press, statistiche pro, onboarding ═══════ */

/* ── SPRINT 3 MINUTI ── */
function qStartSprint(){
buildQuiz();
var items=qShuffle(QUIZ_ALL.slice()).slice(0,10);
if(!items.length){toast2('Nessuna domanda');return;}
startQuiz(items,{mode:'study',title:'Sprint 3 minuti',limit:180});
toast2('⚡ 10 domande, 3 minuti. Via!');
}

/* ── PREFERITI ── */
function togFav(id){
var r=routes.find(function(x){return x.id===id;});if(!r)return;
r.fav=!r.fav;save();autoSave();
try{renderMgr();}catch(e){}
toast2(r.fav?'★ Aggiunto ai preferiti':'☆ Rimosso dai preferiti');hap();
}

/* ── MEDIA nello storico simulazioni ── */
(function(){try{
var _reh=renderExamHist;
renderExamHist=function(){
_reh();
try{
if(!qExamHist.length)return;
var w=document.getElementById('qHistWrap');if(!w||!w.firstChild)return;
var okAvg=(qExamHist.reduce(function(s,x){return s+(x.ok||0);},0)/qExamHist.length).toFixed(1);
var tAvg=Math.round(qExamHist.reduce(function(s,x){return s+(x.t||0);},0)/qExamHist.length);
var line=document.createElement('div');
line.style.cssText='margin-top:10px;font-size:12.5px;font-weight:650;color:var(--mu);text-align:center;font-variant-numeric:tabular-nums';
line.textContent='Media: '+okAvg+'/16 corrette · '+fmtT(tAvg)+' a simulazione';
w.firstChild.appendChild(line);
}catch(e){}
};
}catch(e){}})();

/* ── TEMPO MEDIO per domanda + "sbagliata N volte" nell'analisi ── */
(function(){try{
var _rr=renderResult;
renderResult=function(ok,err,skip,timeout){
_rr(ok,err,skip,timeout);
try{
var answered=ok+err;
if(answered>0){
var usedT=Q.mode==='exam'?Math.min(Q.limit,Q.elapsed):Q.elapsed;
var el=document.getElementById('qResTime');
if(el)el.textContent=el.textContent+' · '+Math.round(usedT/answered)+'s a domanda';
}
/* etichetta storica sulle domande recidive */
qtStats.wrongN=qtStats.wrongN||{};
var cards=document.querySelectorAll('#qAnalysis .qac');
Q.items.forEach(function(it,i){
var n=qtStats.wrongN[it.id]||0;
if(n>=2&&cards[i]){
var tag=document.createElement('div');
tag.style.cssText='margin:0 16px 12px;font-size:11.5px;font-weight:750;color:var(--err)';
tag.textContent='⚠ Sbagliata '+n+' volte in totale — dedicale attenzione';
cards[i].appendChild(tag);
}
});
}catch(e){}
};
}catch(e){}})();

/* ── previsione nel piano quando manca la data ── */
(function(){try{
var _rp=renderPlan;
renderPlan=function(){
_rp();
try{
var w=document.getElementById('planCard');if(!w)return;
var btn=w.querySelector('.plan-set');
if(btn&&btn.textContent.indexOf('Imposta la data')>=0){
var unseen=QUIZ_ALL.filter(function(it){return !qtStats.seenIds[it.id];}).length;
var goal=lg('dailyGoal',30);
if(unseen>0&&goal>0)btn.textContent='🎯 Imposta la data dell\'esame — al ritmo di '+goal+'/giorno finisci le nuove in '+Math.ceil(unseen/goal)+' giorni';
}
}catch(e){}
};
}catch(e){}})();

/* ── ORDINA LE VIE: mini-gioco sul percorso attivo ── */
let ORD=null;
function ordinaVie(){
if(!cur){toast2('Seleziona prima un percorso');return;}
if(cur.steps.length<6){toast2('Servono almeno 6 vie');return;}
var start=Math.floor(Math.random()*(cur.steps.length-6+1));
var target=cur.steps.slice(start,start+6);
ORD={target:target,idx:0,err:0,start:start};
var pool=qShuffle(target.slice());
var old=document.getElementById('ordModal');if(old)old.remove();
var m=document.createElement('div');m.id='ordModal';m.className='modal open';
m.innerHTML='<div class="mbox" style="max-width:520px">'
+'<div class="mhandle"></div>'
+'<div class="mhdr"><div class="mhdr-left"><h3>🧩 Ordina le vie</h3><p>'+esc(cur.title)+' · dalla via '+(start+1)+'</p></div>'
+'<button class="mhdr-close" onclick="ordClose()">✕</button></div>'
+'<div style="padding:16px 18px;overflow-y:auto">'
+'<div class="ord-slots" id="ordSlots">'+target.map(function(_,i){return '<div class="ord-slot" id="ordS'+i+'">'+(start+i+1)+'.</div>';}).join('')+'</div>'
+'<div class="mslabel" style="margin:14px 0 8px">Tocca le vie nell\'ordine giusto</div>'
+'<div class="ord-pool" id="ordPool">'+pool.map(function(s){return '<button class="ord-btn" onclick="ordPick(this)">'+esc(s)+'</button>';}).join('')+'</div>'
+'</div></div>';
document.body.appendChild(m);
hap();
}
function ordPick(btn){
if(!ORD)return;
var v=btn.textContent;
if(v===ORD.target[ORD.idx]){
btn.classList.add('ok');btn.disabled=true;
var sl=document.getElementById('ordS'+ORD.idx);
if(sl){sl.textContent=(ORD.start+ORD.idx+1)+'. '+v;sl.classList.add('done');}
ORD.idx++;hap('m');
if(ORD.idx>=ORD.target.length){
var perfetto=ORD.err===0;
setTimeout(function(){
toast2(perfetto?'🏆 Perfetto, ordine esatto!':'✅ Completato con '+ORD.err+' error'+(ORD.err===1?'e':'i'));
if(perfetto)try{confetti();}catch(e){}
ordClose();
},450);
}
}else{
ORD.err++;hap('e');
btn.classList.remove('shk');void btn.offsetWidth;btn.classList.add('shk');
}
}
function ordClose(){ORD=null;var m=document.getElementById('ordModal');if(m)m.remove();}

/* ── LONG-PRESS su una via: azioni rapide ── */
let _lpT=null,_lpRow=null,_lpDone=false,_lpX=0,_lpY=0;
document.addEventListener('touchstart',function(e){
var r=e.target.closest?e.target.closest('#sList .sr'):null;
if(!r)return;
_lpRow=r;_lpDone=false;_lpX=e.touches[0].clientX;_lpY=e.touches[0].clientY;
clearTimeout(_lpT);
_lpT=setTimeout(function(){_lpDone=true;showViaSheet(listRows.indexOf(_lpRow));hap('m');},550);
},{passive:true});
document.addEventListener('touchmove',function(e){
if(!_lpT)return;
if(Math.abs(e.touches[0].clientX-_lpX)>10||Math.abs(e.touches[0].clientY-_lpY)>10){clearTimeout(_lpT);_lpT=null;}
},{passive:true});
document.addEventListener('touchend',function(){clearTimeout(_lpT);_lpT=null;},{passive:true});
/* dopo un long-press, sopprimi il click "fantasma" sulla riga */
document.addEventListener('click',function(e){
if(_lpDone){_lpDone=false;e.stopPropagation();e.preventDefault();}
},true);
function showViaSheet(i){
if(!cur||i<0)return;
var old=document.getElementById('viaSheet');if(old)old.remove();
var k=cur.id+'_'+i,has=!!coords[k];
/* [FIX scenario] in Cieco/Quiz la via è coperta: il menu non deve svelarla (né mostrare Copia) */
var hidden=(mode!=='s')&&!(i===step&&_revealed);
var name=hidden?('Via n. '+(i+1)+' (nascosta)'):((i+1)+'. '+cur.steps[i]);
var s=document.createElement('div');s.id='viaSheet';
s.innerHTML='<div class="vs-name">'+esc(name)+'</div>'
+'<button onclick="vsAct(\'pin\','+i+')">📍 '+(has?'Riposiziona':'Posiziona')+' sulla mappa</button>'
+(has?'<button onclick="vsAct(\'sv\','+i+')">👁 Street View</button>':'')
+(hidden?'':'<button onclick="vsAct(\'copy\','+i+')">📋 Copia nome</button>')
+'<button class="vs-close" onclick="vsClose()">Chiudi</button>';
document.body.appendChild(s);
}
function vsAct(a,i){
var k=cur.id+'_'+i;
if(a==='pin'){step=i;syncListActive();updateUI();goStep();if(coords[k]){delete coords[k];save();autoSave();if(mkr){try{map.removeLayer(mkr);}catch(e){}mkr=null;}rebuildLines();renderList();}startPl(i);}
else if(a==='sv'&&coords[k]){window.open('https://www.google.com/maps?layer=c&cbll='+coords[k].lat+','+coords[k].lon,'_blank');}
else if(a==='copy'){try{navigator.clipboard.writeText(cur.steps[i]);toast2('📋 Copiato');}catch(e){}}
vsClose();hap();
}
function vsClose(){var s=document.getElementById('viaSheet');if(s)s.remove();}

/* ── RISPARMIO BATTERIA: sotto il 20% spegne le animazioni pesanti ── */
try{
if(navigator.getBattery)navigator.getBattery().then(function(b){
function ck(){document.body.classList.toggle('lowbat',b.level<=.2&&!b.charging);}
ck();b.addEventListener('levelchange',ck);b.addEventListener('chargingchange',ck);
});
}catch(e){}

/* ── ONBOARDING primo avvio ── */
setTimeout(function(){
try{
if(lg('ob1',false))return;
var o=document.createElement('div');o.id='obWrap';
o.innerHTML='<div class="ob-card">'
+'<div class="ob-emoji">🚖</div><h2>Benvenuto!</h2>'
+'<div class="ob-row"><span>🗺️</span><div><b>Mappa</b> — studia i percorsi via per via, in 3 modalità</div></div>'
+'<div class="ob-row"><span>📝</span><div><b>Quiz</b> — 919 domande, simulazioni d\'esame e ripasso errori</div></div>'
+'<div class="ob-row"><span>📚</span><div><b>Studio</b> — luoghi, metro e strade con flashcard</div></div>'
+'<div class="ob-row"><span>⚡</span><div><b>Ripassa 10 minuti</b> — l\'app sceglie cosa studiare oggi</div></div>'
+'<button onclick="obClose()">Inizia</button></div>';
document.body.appendChild(o);
}catch(e){}
},1600);
function obClose(){ls('ob1',true);var o=document.getElementById('obWrap');if(o)o.remove();hap('m');}

/* ═══════ PACCHETTO v13: sync differenziale + rifiniture da scenario-test ═══════ */

/* ── SYNC DIFFERENZIALE: al cloud va solo ciò che è cambiato (da ~400KB a pochi KB) ── */
let _dirty={};
function markDirty(){for(var i=0;i<arguments.length;i++)_dirty[arguments[i]]=1;}
(function(){try{
var _sv=save;save=function(){_sv();markDirty('routes','coords','qStats','done');};
var _qs=qtSave;qtSave=function(){_qs();markDirty('qtStats');};
var _ss3=sdSave;sdSave=function(){_ss3();markDirty('studyProg');};
var _qf5=qFinish;qFinish=function(t){var wasExam=Q&&Q.mode==='exam';_qf5(t);if(wasExam&&qCurView==='result')markDirty('qExamHist');};
}catch(e){}})();
autoSave=function(){
if(!fbOk||!fbRef)return;clearTimeout(asTimer);
asTimer=setTimeout(function(){
try{
var all={routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,studyProg:studyProg,qExamHist:qExamHist};
var p={ts:Date.now()},any=false;
Object.keys(_dirty).forEach(function(k){if(all[k]!==undefined){p[k]=all[k];any=true;}});
if(!any)Object.assign(p,all); /* nulla di tracciato: invio completo di sicurezza */
fbRef.update(p).then(function(){_dirty={};showInd();}).catch(function(){});
}catch(e){}
},4000);
};

/* ── Escape / tasto indietro chiudono anche gioco e action sheet ── */
(function(){try{
var _cam=closeAllM;
closeAllM=function(){_cam();try{ordClose();}catch(e){}try{vsClose();}catch(e){}};
}catch(e){}})();
/* tap fuori dall'action sheet = chiudi */
document.addEventListener('click',function(e){
var s=document.getElementById('viaSheet');
if(s&&!s.contains(e.target))vsClose();
});

/* ═══════ PACCHETTO v14: SYNC COMPLETO tra dispositivi ═══════ */

/* ── le preferenze viaggiano col cloud: data esame, obiettivo, striscia ── */
function getPrefs(){return {examDate:lg('examDate',0),dailyGoal:lg('dailyGoal',30),streak:lg('streak',{n:0,last:0})};}
(function(){try{
var _se=setExamDate;setExamDate=function(){_se();markDirty('prefs');autoSave();};
var _sg=setDailyGoal;setDailyGoal=function(){_sg();markDirty('prefs');autoSave();};
var _bs=bumpStreak;bumpStreak=function(){var r=_bs();markDirty('prefs');try{autoSave();}catch(e){}return r;};
}catch(e){}})();

/* ── indicatore di stato sync nell'angolo ── */
function syncInd(t,stay){
try{
var e=document.getElementById('sInd');if(!e)return;
e.textContent=t;e.classList.add('show');
clearTimeout(e._t);if(!stay)e._t=setTimeout(function(){e.classList.remove('show');},1600);
}catch(e2){}
}

/* ── autoSave definitivo: differenziale + prefs + indicatore ── */
autoSave=function(){
if(!fbOk||!fbRef)return;clearTimeout(asTimer);
asTimer=setTimeout(function(){
try{
syncInd('⏳ Sync…',true);
var all={routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,studyProg:studyProg,qExamHist:qExamHist,prefs:getPrefs()};
var p={ts:Date.now()},any=false;
Object.keys(_dirty).forEach(function(k){if(all[k]!==undefined){p[k]=all[k];any=true;}});
if(!any)Object.assign(p,all);
fbRef.update(p).then(function(){_dirty={};syncInd('☁️ ✓');}).catch(function(){syncInd('⚠️ Sync non riuscito');});
}catch(e){syncInd('⚠️ Sync non riuscito');}
},4000);
};
/* il salvataggio manuale include anche le preferenze */
cloudSave=function(){
if(!fbOk||!fbRef){toast2('⚠️ Firebase non disponibile');return;}
toast2('💾 Salvataggio…');
fbRef.set({routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,studyProg:studyProg,qExamHist:qExamHist,prefs:getPrefs(),ts:Date.now()})
.then(function(){toast2('✅ Salvato su cloud');}).catch(function(){toast2('⚠️ Errore cloud');});
};

/* ── MERGE INTELLIGENTE: unisce i progressi invece di "vince il più recente".
Le statistiche additive (domande viste, flashcard, errori...) si fondono SEMPRE:
studiare su due dispositivi non fa più perdere nulla. ── */
syncFromCloud=function(){
if(!fbOk||!fbRef)return;
var imp=lg('imp',0),localTs=lg('localTs',0);
fbRef.once('value',function(snap){
try{
var d=snap.val();if(!d||!d.ts)return;
if(imp&&imp>d.ts)return;
var cloudNewer=!(localTs&&localTs>d.ts);
/* [FIX 200-scenari] mut conta le modifiche REALI: niente più toast+upload a ogni apertura */
var mut=0;
function keepU(dst,src){dst=dst||{};if(src)Object.keys(src).forEach(function(k){if(dst[k]===undefined){dst[k]=src[k];mut++;}});return dst;}
function maxU(dst,src){dst=dst||{};if(src)Object.keys(src).forEach(function(k){var v=Math.max(dst[k]||0,src[k]||0);if(v!==(dst[k]||0)){dst[k]=v;mut++;}else if(dst[k]===undefined){dst[k]=v;}});return dst;}
var statMut=false,m0=mut;
if(d.qtStats&&typeof d.qtStats==='object'){
qtStats.seenIds=keepU(qtStats.seenIds,d.qtStats.seenIds);
qtStats.bm=keepU(qtStats.bm,d.qtStats.bm);
qtStats.ach=keepU(qtStats.ach,d.qtStats.ach);
qtStats.report=keepU(qtStats.report,d.qtStats.report);
qtStats.wrongN=maxU(qtStats.wrongN,d.qtStats.wrongN);
qtStats.daily=maxU(qtStats.daily,d.qtStats.daily);
if(d.qtStats.err){qtStats.err=qtStats.err||{};Object.keys(d.qtStats.err).forEach(function(k){var a=qtStats.err[k],b=d.qtStats.err[k];if(a===undefined){qtStats.err[k]=b;mut++;}else if(b&&typeof b==='object'&&typeof a==='object'&&(b.box||0)>(a.box||0)){qtStats.err[k]=b;mut++;}});}
if(d.qtStats.cat){qtStats.cat=qtStats.cat||{};Object.keys(d.qtStats.cat).forEach(function(k){var a=qtStats.cat[k]||{seen:0,ok:0},b=d.qtStats.cat[k]||{};var ns=Math.max(a.seen||0,b.seen||0),no=Math.max(a.ok||0,b.ok||0);if(ns!==(a.seen||0)||no!==(a.ok||0))mut++;qtStats.cat[k]={seen:ns,ok:no};});}
if(mut>m0){ls('qtStats',qtStats);statMut=true;}
}
if(d.studyProg&&typeof d.studyProg==='object'){var m1=mut;studyProg=maxU(studyProg,d.studyProg);if(mut>m1){ls('studyProg',studyProg);statMut=true;}}
if(d.done&&typeof d.done==='object'){Object.keys(d.done).forEach(function(k){if(!done[k]&&d.done[k]){done[k]=d.done[k];mut++;statMut=true;}});}
if(d.qExamHist&&Array.isArray(d.qExamHist)){
var seenD={};qExamHist.forEach(function(x){if(x)seenD[x.d]=1;});
var added=0;d.qExamHist.forEach(function(x){if(x&&!seenD[x.d]){qExamHist.push(x);added++;}});
if(added){qExamHist.sort(function(a,b){return (a.d||0)-(b.d||0);});if(qExamHist.length>50)qExamHist=qExamHist.slice(-50);ls('qExamHist',qExamHist);mut+=added;statMut=true;}
}
if(d.prefs&&typeof d.prefs==='object'){
try{
if(d.prefs.examDate&&(cloudNewer||!lg('examDate',0))&&lg('examDate',0)!==d.prefs.examDate){ls('examDate',d.prefs.examDate);mut++;}
if(d.prefs.dailyGoal&&cloudNewer&&lg('dailyGoal',30)!==d.prefs.dailyGoal){ls('dailyGoal',d.prefs.dailyGoal);mut++;}
if(d.prefs.targetDate&&(cloudNewer||!lg('targetDate',0))&&lg('targetDate',0)!==d.prefs.targetDate){ls('targetDate',d.prefs.targetDate);mut++;}
if(d.prefs.targetMeta&&(cloudNewer||!lg('targetMeta',null))){ls('targetMeta',d.prefs.targetMeta);}
if(d.prefs.rDel){try{var td=lg('rDel',{});Object.keys(d.prefs.rDel).forEach(function(k){if(!td[k]){td[k]=d.prefs.rDel[k];mut++;}});ls('rDel',td);
/* applica subito: se una lapide arriva dal cloud, il percorso locale sparisce */
var n0=routes.length;routes=routes.filter(function(r){return !td[r.id];});
if(routes.length<n0){Object.keys(coords).forEach(function(k){var rid=k.slice(0,k.lastIndexOf('_'));if(td[rid])delete coords[k];});}
}catch(e){}}
if(d.prefs.rSR){try{rSR=rSR||{};Object.keys(d.prefs.rSR).forEach(function(k){var a=rSR[k],b=d.prefs.rSR[k];if(!a||((b&&b.last)||0)>((a&&a.last)||0)){rSR[k]=b;mut++;}});ls('rSR',rSR);}catch(e){}}
if(d.prefs.streak){var st=lg('streak',{n:0,last:0});var cs=d.prefs.streak;
if((cs.last||0)>(st.last||0)){ls('streak',cs);mut++;}
else if((cs.last||0)===(st.last||0)&&(cs.n||0)>(st.n||0)){ls('streak',{n:cs.n,last:st.last});mut++;}/*stesso giorno: vince la striscia più lunga*/
}
}catch(e){}
}
/* percorsi e mappa: se il cloud è più recente prendi i suoi, ma TIENI i percorsi/pin solo-locali */
if(cloudNewer){
if(d.routes){var cr=vR(d.routes);
var tomb=lg('rDel',{});cr=cr.filter(function(r){return !tomb[r.id];});/*[FIX dup] i cancellati non risorgono*/
var have={};cr.forEach(function(r){have[r.id]=1;});routes.forEach(function(r){if(!have[r.id]&&!tomb[r.id])cr.push(r);});routes=cr;}
if(d.coords){var cc=vC(d.coords);Object.keys(coords).forEach(function(k){if(cc[k]===undefined)cc[k]=coords[k];});coords=cc;}
if(d.qStats&&typeof d.qStats==='object'){Object.keys(d.qStats).forEach(function(k){var a=qStats[k],b=d.qStats[k];if(!a||(((b&&b.total)||0)>=((a&&a.total)||0)))qStats[k]=b;});}
save();
}else if(statMut){save();}
if(mut>0||cloudNewer){
if(statMut)markDirty('qtStats','studyProg','done','qExamHist','prefs');
if(cloudNewer)markDirty('routes','coords','qStats','done');
autoSave();
toast2(cloudNewer?'☁️ Dati aggiornati dal cloud':'☁️ Progressi uniti dai tuoi dispositivi');
}
if(cur){renderList();rebuildLines();}
if(cur&&map){var k2=cur.id+'_'+step;if(coords[k2])putMkr(coords[k2].lat,coords[k2].lon,cur.steps[step],k2);}
try{renderPlan();renderWeekly();updateTabBadge();showStreak();renderReadiness();renderTip();}catch(e){}
}catch(e){console.warn('sync err',e);}
},function(){});
};

/* ── RIPRISTINO dal backup settimanale ── */
function restoreBackup(){
if(!fbOk||!fbRef||typeof firebase==='undefined'){toast2('⚠️ Cloud non disponibile');return;}
toast2('🛟 Cerco il backup…');
firebase.database().ref('prontuario_backup').once('value',function(snap){
var d=snap.val();
if(!d||!d.ts){toast2('Nessun backup trovato');return;}
var when=new Date(d.ts).toLocaleDateString('it-IT');
if(!confirm('Trovato backup del '+when+'.\n\nRipristinarlo? I dati attuali verranno sostituiti.'))return;
try{
if(d.routes)routes=vR(d.routes);
if(d.coords)coords=vC(d.coords);
if(d.qStats)qStats=d.qStats;if(d.done)done=d.done;
if(d.qtStats){qtStats=d.qtStats;ls('qtStats',qtStats);}
if(d.studyProg){studyProg=d.studyProg;ls('studyProg',studyProg);}
if(d.qExamHist){qExamHist=d.qExamHist;ls('qExamHist',qExamHist);}
if(d.prefs){if(d.prefs.examDate)ls('examDate',d.prefs.examDate);if(d.prefs.dailyGoal)ls('dailyGoal',d.prefs.dailyGoal);if(d.prefs.streak)ls('streak',d.prefs.streak);}
try{var _t=lg('rDel',{});routes.forEach(function(r){delete _t[r.id];});ls('rDel',_t);}catch(e){}/*[FIX 1000] i percorsi ripristinati non devono avere lapidi attive*/
ls('imp',Date.now());save();
toast2('✅ Backup ripristinato — aggiorno il cloud…');
/* [FIX 200-scenari] spingi il ripristino anche sul ramo principale: senza questo,
gli altri dispositivi avrebbero risincronizzato i dati vecchi */
fbRef.set({routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,studyProg:studyProg,qExamHist:qExamHist,prefs:getPrefs(),ts:Date.now()})
.then(function(){setTimeout(function(){location.reload();},600);})
.catch(function(){setTimeout(function(){location.reload();},600);});
}catch(e){toast2('⚠️ Errore nel ripristino');}
},function(){toast2('⚠️ Errore di rete');});
}
/* il backup settimanale ora include anche le preferenze */
weeklyBackup=function(){
try{
if(!fbOk||!fbRef||typeof firebase==='undefined')return;
if(Date.now()-lg('lastBk',0)<6.5*86400000)return;
firebase.database().ref('prontuario_backup').set({routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,studyProg:studyProg,qExamHist:qExamHist,prefs:getPrefs(),ts:Date.now()})
.then(function(){ls('lastBk',Date.now());}).catch(function(){});
}catch(e){}
};

/* ═══════ PACCHETTO v15: design pro ═══════ */

/* ── theme-color dinamico: la barra di stato segue il tema ── */
function updateThemeColor(){
try{
var b=document.body,dark=b.classList.contains('dark'),ber=b.classList.contains('berlina');
var c=ber?(dark?'#0A0A0D':'#F5F4F0'):(dark?'#07080D':'#F4F5F8');
var m=document.querySelector('meta[name="theme-color"]');
if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);}
m.content=c;
}catch(e){}
}
(function(){try{
var _ad=applyDark;applyDark=function(){_ad();updateThemeColor();};
var _tb2=togBerlina;togBerlina=function(){_tb2();updateThemeColor();};
}catch(e){}})();
setTimeout(updateThemeColor,300);

/* ── flash di ricompensa quando raggiungi l'obiettivo del giorno ── */
(function(){try{
var _rw2=renderWeekly;
renderWeekly=function(){
_rw2();
try{
var today=(qtStats.daily||{})[_dayKey()]||0,goal=lg('dailyGoal',30);
if(today>=goal&&goal>0&&lg('goalHit','')!==_dayKey()){
ls('goalHit',_dayKey());
setTimeout(function(){toast2('🎯 Obiettivo di oggi raggiunto!');try{confetti();}catch(e){}},400);
}
}catch(e){}
};
}catch(e){}})();

/* [FIX 200-scenari] il timer a 6000ms aveva catturato la VECCHIA weeklyBackup (senza preferenze):
questo parte prima, esegue la versione nuova e imposta lastBk, così la vecchia si auto-salta */
setTimeout(function(){try{weeklyBackup();}catch(e){}},5200);

/* ═══════ PACCHETTO v16: COACH GIORNALIERO ═══════
Ogni giorno costruisce il tuo piano in ordine di priorità:
1) errori in scadenza (la memoria li sta perdendo ORA)
2) argomento più debole  3) obiettivo del giorno
4) flashcard se indietro  5) recidive  6) simulazione settimanale */

let COACH=[];
function _weakCat(){
try{
var worst=null,wr=1.01;
QARG.forEach(function(c){var s=qtStats.cat[c.id];if(s&&(s.seen||0)>=6){var r=(s.ok||0)/s.seen;if(r<wr){wr=r;worst=c;}}});
return (worst&&wr<.75)?{c:worst,r:wr}:null;
}catch(e){return null;}
}
function coachTasks(){
try{buildQuiz();buildLuoghi();}catch(e){}
var t=[];
/* 1 — errori scaduti: priorità assoluta */
var due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=Date.now();}).length;
if(due>0)t.push({ic:'🔁',tx:'Ripassa '+due+' error'+(due===1?'e':'i')+' in scadenza',sub:'La ripetizione spaziata li ha messi in agenda per OGGI',fn:function(){openQuiz();setTimeout(function(){qStartCat('errata');},250);},p:1});
/* 2 — argomento debole */
var wk=_weakCat();
if(wk)t.push({ic:wk.c.emoji,tx:'10 domande di '+wk.c.label,sub:'Il tuo argomento più debole: '+Math.round(wk.r*100)+'% di risposte corrette',fn:(function(id){return function(){openQuiz();setTimeout(function(){qStartCat(id);},250);};})(wk.c.id),p:2});
/* 3 — obiettivo del giorno */
var today=(qtStats.daily||{})[_dayKey()]||0,goal=lg('dailyGoal',30);
var unseen=QUIZ_ALL.filter(function(it){return !qtStats.seenIds[it.id];}).length;
if(today<goal)t.push({ic:'📝',tx:(goal-today)+' risposte per l\'obiettivo di oggi',sub:unseen?('Meglio se nuove: te ne restano '+unseen+' mai viste'):'Le hai viste tutte: ripasso libero',fn:unseen?function(){openQuiz();setTimeout(qStartNew,250);}:function(){smartReview();},p:3,prog:[today,goal]});
else t.push({ic:'✅',tx:'Obiettivo di oggi raggiunto — '+today+'/'+goal,sub:'Vuoi strafare? Sprint 3 minuti',fn:function(){openQuiz();setTimeout(qStartSprint,250);},p:8,done:true});
/* [rimosso su richiesta] niente flashcard nel coach */
/* 5 — recidive */
var wn=qtStats.wrongN||{},rec=Object.keys(wn).filter(function(k){return wn[k]>=3;}).length;
if(rec>=5)t.push({ic:'💀',tx:'Sfida le tue '+Math.min(rec,20)+' recidive',sub:'Domande sbagliate 3 o più volte: vanno smontate una a una',fn:function(){openQuiz();setTimeout(qStartHard,250);},p:5});
/* 6 — simulazione settimanale */
var lastEx=(qExamHist&&qExamHist.length)?(qExamHist[qExamHist.length-1].d||0):0;
if(Date.now()-lastEx>6*86400000)t.push({ic:'🎓',tx:'Simulazione della settimana',sub:lastEx?'L\'ultima risale a più di 6 giorni fa':'Non ne hai ancora fatta nessuna',fn:function(){openQuiz();setTimeout(qStartExam,250);},p:6});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}
function coachGo(i){try{if(COACH[i]&&COACH[i].fn){hap();COACH[i].fn();}}catch(e){}}
function renderCoach(){
try{
var w=document.getElementById('coachCard');if(!w)return;
COACH=coachTasks();
if(!COACH.length){w.innerHTML='';return;}
var doneAll=COACH.every(function(x){return x.done;});
var h='<div class="coach"><div class="coach-hd"><strong>'+(doneAll?'🏁 Piano di oggi completato':'🎯 Il tuo piano di oggi')+'</strong><span>'+new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})+'</span></div>';
COACH.forEach(function(x,i){
var pr='';
if(x.prog){var pc=Math.min(100,Math.round(x.prog[0]/x.prog[1]*100));pr='<div class="coach-bar"><i style="width:'+pc+'%"></i></div>';}
h+='<button class="coach-row'+(x.done?' done':'')+'" onclick="coachGo('+i+')">'
+'<span class="coach-ic">'+x.ic+'</span>'
+'<span class="coach-tx"><b>'+x.tx+'</b><small>'+x.sub+'</small>'+pr+'</span>'
+'<span class="coach-ar">'+(x.done?'✓':'›')+'</span></button>';
});
h+='</div>';
w.innerHTML=h;
}catch(e){}
}
/* si aggiorna a ogni ritorno in home e all'avvio */
(function(){try{var _gh5=goHome;goHome=function(){_gh5();try{renderCoach();}catch(e){}};}catch(e){}})();
setTimeout(function(){try{renderCoach();}catch(e){}},1500);
/* e dopo ogni sessione conclusa (i numeri cambiano) */
(function(){try{var _qf6=qFinish;qFinish=function(t){_qf6(t);if(qCurView==='result')setTimeout(function(){try{renderCoach();}catch(e){}},300);};}catch(e){}})();

/* [FIX 200-scenari] il Coach si aggiorna anche dopo il sync tra dispositivi:
agganciato a renderWeekly, che il sync già richiama (nessun loop: il coach non chiama renderWeekly) */
(function(){try{
var _rw3=renderWeekly;
renderWeekly=function(){_rw3();try{renderCoach();}catch(e){}};
}catch(e){}})();

/* ═══════ PACCHETTO v17: COORDINATE SUGGERITE (con piena libertà manuale) ═══════
Flusso: selezioni una via → l'app cerca il punto (Photon, vincolato a Milano)
→ appare un MARKER FANTASMA con barra "Conferma / Ignora".
Il tocco manuale sulla mappa resta SEMPRE attivo e ha SEMPRE la precedenza. */

let _geoTok=0,_geoGhost=null,_geoGhostMap=null;
let geoCache=lg('geoCache',{});

/* espande le abbreviazioni del prontuario in nomi che il geocoder capisce */
function expandVia(s){
s=String(s||'').trim();
s=s.replace(/\(.*?\)/g,' ').replace(/\s+/g,' ').trim(); /* via le note tra parentesi */
var corner=/\bANGOLO\b|\bANG\.?\b/i.test(s);
if(corner)s=s.split(/\bANGOLO\b|\bANG\.?\s/i)[0].trim(); /* incrocio: cerca la prima via */
var MAP=[[/^V\.?LE\b/i,'Viale'],[/^VIALE\b/i,'Viale'],[/^P\.?ZA\b/i,'Piazza'],[/^PIAZZA\b/i,'Piazza'],
[/^P\.?LE\b/i,'Piazzale'],[/^PIAZZALE\b/i,'Piazzale'],[/^C\.?SO\b/i,'Corso'],[/^CORSO\b/i,'Corso'],
[/^L\.?GO\b/i,'Largo'],[/^LARGO\b/i,'Largo'],[/^V\.?LO\b/i,'Vicolo'],[/^ALZ\.?\b/i,'Alzaia'],
[/^BAST\.?\b/i,'Bastioni'],[/^BASTIONI\b/i,'Bastioni'],[/^GALL\.?\b/i,'Galleria'],
[/^P\.?TA\b/i,'Porta'],[/^STAZ\.?\b/i,'Stazione'],[/^V\.?\s/i,'Via '],[/^VIA\b/i,'Via']];
for(var i=0;i<MAP.length;i++){if(MAP[i][0].test(s)){s=s.replace(MAP[i][0],MAP[i][1]);break;}}
s=s.replace(/\bF\.?LLI\b/gi,'Fratelli').replace(/\bS\.?\s/g,'San ').replace(/\bSS\.?\s/g,'Santi ');
/* Title Case sul resto */
s=s.toLowerCase().replace(/(^|[\s'’-])(\w)/g,function(m,a,b){return a+b.toUpperCase();});
return {q:s,corner:corner};
}

/* interroga Photon vincolato all'area di Milano; cache locale per le vie già cercate */
function geoLookup(name,cb){
var ex=expandVia(name);
var key=ex.q.toUpperCase();
if(geoCache[key]){cb(geoCache[key],ex.corner);return;}
if(!navigator.onLine){cb(null);return;}
var url='https://photon.komoot.io/api/?q='+encodeURIComponent(ex.q+' Milano')
+'&lat=45.4642&lon=9.19&limit=3&bbox=8.90,45.28,9.50,45.65';
fetch(url).then(function(r){return r.json();}).then(function(j){
try{
var f=(j.features||[]).filter(function(x){
var c=x.geometry&&x.geometry.coordinates;
return c&&c[0]>8.90&&c[0]<9.50&&c[1]>45.28&&c[1]<45.65; /* gabbia: solo Milano e hinterland */
})[0];
if(!f){cb(null);return;}
var c=f.geometry.coordinates,p=f.properties||{};
var label=(p.name||ex.q)+(p.city&&p.city!=='Milano'?' · '+p.city:'');
var res={lat:c[1],lon:c[0],label:label};
geoCache[key]=res;
try{var ks=Object.keys(geoCache);if(ks.length>800)delete geoCache[ks[0]];ls('geoCache',geoCache);}catch(e){}
cb(res,ex.corner);
}catch(e){cb(null);}
}).catch(function(){cb(null);});
}

function geoCleanup(){
_geoTok++;
try{if(_geoGhost&&_geoGhostMap)_geoGhostMap.removeLayer(_geoGhost);}catch(e){}
_geoGhost=null;_geoGhostMap=null;
var b=document.getElementById('geoBar');if(b)b.remove();
}
/* mostra fantasma + barra Conferma/Ignora; onOk(lat,lon) applica il punto */
function geoSuggest(name,tm,onOk){
/* [DISATTIVATO su richiesta] niente marker automatico: posizionamento manuale puro.
La funzione resta come stub per gli agganci esistenti. */
geoCleanup();return;
}

/* ── aggancio 1: mappa principale (posizionamento con +) ── */
(function(){try{
var _sp=startPl;
startPl=function(i){
_sp(i);
if(cur&&cur.steps[i])geoSuggest(cur.steps[i],map,function(lat,lon){
var k=cur.id+'_'+i;coords[k]={lat:lat,lon:lon};
save();autoSave();putMkr(lat,lon,cur.steps[i],k);
rebuildLines();stopPl();renderList();toast2('📍 Posizionato');
});
};
var _stp=stopPl;stopPl=function(){_stp();geoCleanup();};/* il tocco manuale (che chiama stopPl) pulisce il fantasma */
}catch(e){}})();

/* ── aggancio 2: modale Nuovo/Modifica percorso ── */
(function(){try{
var _sm=selMStep;
selMStep=function(i){
_sm(i);
var steps=getMSteps(),nm=steps[i];if(!nm)return;
var tm=isDesk()?mMap:mobMap;if(!tm)return;
geoSuggest(nm,tm,function(lat,lon){
mTC[i]={lat:lat,lon:lon};
var am=isDesk()?mMap:mobMap;if(am)refMkrs(am);
renderMList();
document.getElementById('mmH').classList.remove('show');document.getElementById('mmobH').classList.remove('show');
var nx=steps.findIndex(function(_,j){return j>i&&!mTC[j];});
if(nx!==-1)selMStep(nx);else mSel=null; /* avanza da solo alla prossima via, come il tocco manuale */
});
};
var _omc=onMClick;onMClick=function(e){geoCleanup();_omc(e);};/* il click manuale vince e pulisce */
var _ca2=closeAdd;closeAdd=function(){geoCleanup();_ca2();};
}catch(e){}})();

/* ═══════ PACCHETTO v18: TRAGUARDO + BOTTONE 5 MINUTI ═══════
Filosofia: "finisci tutto entro il traguardo, poi solo mantenimento leggero".
Il coach conosce due fasi e cambia comportamento da solo. */

/* le preferenze sincronizzate includono il traguardo */
getPrefs=function(){return {examDate:lg('examDate',0),dailyGoal:lg('dailyGoal',30),streak:lg('streak',{n:0,last:0}),targetDate:lg('targetDate',0),targetMeta:lg('targetMeta',null)};};

/* ── imposta il traguardo: una data GG/MM/AAAA oppure un numero di giorni (es. 90) ── */
function setTargetDate(){
var cur=lg('targetDate',0);
var v=prompt('Traguardo "tutto finito": scrivi i GIORNI (es. 90) o una data GG/MM/AAAA:',cur?new Date(cur).toLocaleDateString('it-IT'):'90');
if(v===null)return;v=v.trim();
if(!v){ls('targetDate',0);ls('targetMeta',null);renderPlan();renderCoach();return;}
var t=0;
if(/^\d{1,3}$/.test(v)){t=Date.now()+parseInt(v,10)*86400000;}
else{var m=v.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);if(!m){toast2('⚠️ Scrivi un numero di giorni o GG/MM/AAAA');return;}var y=+m[3];if(y<100)y+=2000;t=new Date(y,(+m[2])-1,+m[1],23,59).getTime();}
if(t<Date.now()+86400000){toast2('⚠️ Il traguardo deve essere nel futuro');return;}
ls('targetDate',t);
/* baseline: da dove parti oggi (serve per dire "sei in pari") */
try{buildQuiz();buildLuoghi();}catch(e){}
ls('targetMeta',{start:Date.now(),
q0:Object.keys(qtStats.seenIds||{}).length,qT:QUIZ_ALL.length||919,
l0:LUOGHI.filter(function(x){return (studyProg[x.id]||0)>=SD_MASTER;}).length,lT:LUOGHI.length||218,
r0:routes.filter(function(r){return done[r.id];}).length,rT:Math.max(routes.length,1)});
markDirty('prefs');autoSave();
renderPlan();renderCoach();toast2('🏁 Traguardo impostato');hap('m');
}

/* ── stato del traguardo: copertura, ritmi giornalieri, in pari/indietro ── */
function targetInfo(){
try{buildQuiz();buildLuoghi();}catch(e){}
var t=lg('targetDate',0);if(!t)return null;
var seen=Object.keys(qtStats.seenIds||{}).length,qT=QUIZ_ALL.length||919;
var rD=routes.filter(function(r){return done[r.id];}).length,rT=Math.max(routes.length,1);
var days=Math.max(0,Math.ceil((t-Date.now())/86400000));
var doneAll=(seen>=qT&&rD>=rT);/* solo quiz + topografia */
var perQ=days>0?Math.ceil(Math.max(0,qT-seen)/days):0;
var perL=0,lM=0,lT=0;/* luoghi esclusi dal piano su richiesta */
var perR=days>0?Math.ceil(Math.max(0,rT-rD)/days*10)/10:0; /* può essere 0.5 = uno ogni 2 giorni */
/* in pari? confronto col ritmo previsto dalla baseline */
var behind=0,meta=lg('targetMeta',null);
if(meta&&t>meta.start){
var exp=Math.min(1,(Date.now()-meta.start)/(t-meta.start));
function pr(a0,a,aT){var tot=Math.max(1,aT-a0);return Math.min(1,Math.max(0,(a-a0)/tot));}
var act=(pr(meta.q0,seen,meta.qT)+pr(meta.r0,rD,meta.rT))/2;/* media su quiz+percorsi */
behind=Math.round((exp-act)*((t-meta.start)/86400000));
}
return {t:t,days:days,doneAll:doneAll,seen:seen,qT:qT,rD:rD,rT:rT,perQ:perQ,perR:perR,behind:behind,
pctQ:Math.round(seen/qT*100),pctR:Math.round(rD/rT*100)};
}

/* ── piano in home: versione traguardo ── */
renderPlan=function(){
var w=document.getElementById('planCard');if(!w)return;
var ti=targetInfo();
var ex=lg('examDate',0);
var exLine=ex?('Esame tra '+Math.max(0,Math.ceil((ex-Date.now())/86400000))+' giorni'):'Data esame non impostata';
if(!ti){
w.innerHTML='<button class="plan-set" onclick="setTargetDate()">🏁 Imposta il TRAGUARDO: "tutto finito entro..."</button>'
+'<button class="plan-set plan-exam" onclick="setExamDate()">🎯 '+exLine+' — tocca per cambiare</button>';
return;
}
if(ti.doneAll){
w.innerHTML='<div class="plan-card" onclick="setTargetDate()"><b>🏆</b><div class="plan-tx"><strong>Copertura completata!</strong><small>Ora si mantiene: errori, ritenzione e simulazioni. '+exLine+'</small></div></div>';
return;
}
var st=ti.behind>1?('<span class="tg-pill late">Indietro di ~'+ti.behind+' g</span>'):(ti.behind<-1?'<span class="tg-pill ahead">In anticipo ✨</span>':'<span class="tg-pill ok">In pari ✅</span>');
function bar(lbl,pct){return '<div class="tg-row"><span>'+lbl+'</span><div class="tg-bar"><i style="width:'+pct+'%"></i></div><b>'+pct+'%</b></div>';}
var rTxt=ti.rD>=ti.rT?'percorsi ✓':(ti.perR<1?('1 percorso ogni '+Math.round(1/Math.max(.1,ti.perR))+' g'):ti.perR+' percorsi');/*[FIX] niente "ogni 10 g" a percorsi finiti*/
w.innerHTML='<div class="tg-card" onclick="setTargetDate()">'
+'<div class="tg-hd"><b>'+ti.days+'</b><div><strong>giorn'+(ti.days===1?'o':'i')+' al traguardo</strong><small>Tocca per cambiare il traguardo</small></div>'+st+'</div>'
+bar('📝 Domande',ti.pctQ)+bar('🗺️ Percorsi',ti.pctR)
+'<div class="tg-rhythm">Oggi: <b>'+ti.perQ+'</b> domande nuove · <b>'+rTxt+'</b></div>'
+'</div>'
+'<button class="plan-set plan-exam" onclick="setExamDate()">🎯 '+exLine+' — tocca per cambiare</button>';/*[FIX] la data esame resta modificabile anche col traguardo attivo*/
};

/* ── COACH a due fasi: copertura → mantenimento ── */
coachTasks=function(){
try{buildQuiz();buildLuoghi();}catch(e){}
var t=[];
var due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=Date.now();}).length;
var ti=targetInfo();
var copertura=ti&&!ti.doneAll;
/* errori scaduti: SEMPRE per primi (in copertura senza allarme) */
if(due>0)t.push({ic:'🔁',tx:'Ripassa '+due+' error'+(due===1?'e':'i')+' in scadenza',sub:copertura?'Normale accumularli ora: tienili in agenda':'La ripetizione spaziata li ha messi in agenda per OGGI',fn:function(){openQuiz();setTimeout(function(){qStartCat('errata');},250);},p:1});
if(copertura){
/* FASE COPERTURA: nuove + luoghi + percorso, ai ritmi del traguardo */
if(ti.seen<ti.qT)t.push({ic:'📝',tx:ti.perQ+' domande nuove',sub:'Ritmo del traguardo · te ne restano '+(ti.qT-ti.seen),fn:function(){openQuiz();setTimeout(qStartNew,250);},p:2,prog:[ti.seen,ti.qT]});
if(ti.rD<ti.rT&&routes.length)t.push({ic:'🗺️',tx:'Il percorso del giorno',sub:'Completati '+ti.rD+' su '+ti.rT+' — aprilo in Cieco',fn:function(){goTopografia();setTimeout(routeOfDay,300);},p:4,prog:[ti.rD,ti.rT]});
}else{
/* FASE MANTENIMENTO (o nessun traguardo): debolezze, ritenzione, simulazione */
var wk=_weakCat();
if(wk)t.push({ic:wk.c.emoji,tx:'10 domande di '+wk.c.label,sub:'Argomento più debole: '+Math.round(wk.r*100)+'% corrette',fn:(function(id){return function(){openQuiz();setTimeout(function(){qStartCat(id);},250);};})(wk.c.id),p:2});
var today=(qtStats.daily||{})[_dayKey()]||0,goal=lg('dailyGoal',30);
if(today<goal)t.push({ic:'📝',tx:(goal-today)+' risposte per l\'obiettivo',sub:'Mantenimento: mix scelto dal coach',fn:function(){smartReview();},p:3,prog:[today,goal]});
var wn=qtStats.wrongN||{},rec=Object.keys(wn).filter(function(k){return wn[k]>=3;}).length;
if(rec>=5)t.push({ic:'💀',tx:'Smonta '+Math.min(rec,20)+' recidive',sub:'Sbagliate 3+ volte',fn:function(){openQuiz();setTimeout(qStartHard,250);},p:4});
if(routes.length)t.push({ic:'🗺️',tx:'Ripasso percorso a rotazione',sub:'Un Cieco al giorno tiene la mappa fresca',fn:function(){goTopografia();setTimeout(routeOfDay,300);},p:5});
}
var lastEx=(qExamHist&&qExamHist.length)?(qExamHist[qExamHist.length-1].d||0):0;
if(Date.now()-lastEx>6*86400000)t.push({ic:'🎓',tx:'Simulazione della settimana',sub:lastEx?'L\'ultima è di oltre 6 giorni fa':'La prima misura da dove parti',fn:function(){openQuiz();setTimeout(qStartExam,250);},p:6});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
};

/* percorso del giorno: il primo non completato, o il completato più "vecchio" (rotazione per data) */
function routeOfDay(){
if(!routes.length){toast2('Nessun percorso salvato');return;}
var nd=routes.filter(function(r){return !done[r.id];});
var r;
if(nd.length)r=nd[Math.floor(Date.now()/86400000)%nd.length];
else r=routes[Math.floor(Date.now()/86400000)%routes.length];
selectRoute(r);setMode('c');toast2('🗺️ Percorso del giorno: '+r.title);
}

/* ── BOTTONE UNICO "5 MINUTI": micro-sessione mista scelta dal coach ── */
function startMicro(){
buildQuiz();
var items=QUIZ_ALL.filter(function(it){return qtStats.err[it.id]&&srDue(it.id)<=Date.now();});
items.sort(function(a,b){return srDue(a.id)-srDue(b.id);});
items=items.slice(0,4); /* max 4 errori: il difficile diluito, mai concentrato */
var have={};items.forEach(function(it){have[it.id]=1;});
items=items.concat(_newRR(8-items.length,have));/*[v24] nuove ad argomenti alternati anche qui*/
if(items.length<8){var h2={};items.forEach(function(it){h2[it.id]=1;});items=items.concat(qShuffle(QUIZ_ALL.filter(function(it){return !h2[it.id];})).slice(0,8-items.length));}
if(!items.length){toast2('Nessuna domanda disponibile');return;}
openQuiz();
startQuiz(qShuffle(items),{mode:'study',title:'Sessione 5 minuti',micro:true});
}
/* fine micro-quiz → aggancia le 5 flashcard (concatenazione senza pensare) */
(function(){try{
var _qf7=qFinish;
qFinish=function(t){
_qf7(t);
try{
if(qCurView==='result'){
var _old=document.getElementById('microNext');if(_old)_old.remove();/* [su richiesta] niente aggancio flashcard: il coach spinge solo quiz e topografia */
}
}catch(e){}
};
}catch(e){}})();
function sdStartMicro(){
buildLuoghi();
if(!LUOGHI.length){toast2('Luoghi non disponibili');return;}
var pool=sdShuffle(LUOGHI.slice()).sort(function(a,b){return (studyProg[a.id]||0)-(studyProg[b.id]||0);}).slice(0,5);
var cards=pool.map(function(x){return {key:x.id,front:x.cosa,back:x.dove,tag:'Dove si trova?',pill:x.cat};});
sdStartDeck(cards,'dash',function(){sdStartMicro();});
}

/* ═══════ PACCHETTO v19: SPIRALE PERCORSI + APPRENDIMENTO ATTIVO ═══════ */

/* ── SPIRALE DEI PERCORSI: come gli errori quiz, ma sulla topografia.
Completi un percorso → l'app te lo ripropone dopo 2, 4, 9, 21, 45 giorni. ── */
let rSR=lg('rSR',{});
function rsrMark(id){
try{
var e=rSR[id]||{box:0};
var box=Math.min(5,(e.box||0)+1);
var days=[2,4,9,21,45][box-1]||45;
rSR[id]={box:box,due:Date.now()+days*86400000,last:Date.now()};
ls('rSR',rSR);markDirty('prefs');
}catch(e2){}
}
(function(){try{
var _rc3=routeCelebrate;
routeCelebrate=function(){_rc3();try{if(cur)rsrMark(cur.id);}catch(e){}};
}catch(e){}})();
/* le prefs sincronizzate includono la spirale */
(function(){try{
var _gp=getPrefs;
getPrefs=function(){var p=_gp();p.rSR=rSR;return p;};
}catch(e){}})();

/* percorso del giorno v2: prima quelli IN SCADENZA nella spirale, poi i mai fatti, poi rotazione */
routeOfDay=function(){
if(!routes.length){toast2('Nessun percorso salvato');return;}
var now=Date.now();
var due=routes.filter(function(r){return rSR[r.id]&&rSR[r.id].due<=now;});
var r;
if(due.length){
due.sort(function(a,b){return rSR[a.id].due-rSR[b.id].due;});
r=due[0];
selectRoute(r);setMode('c');
toast2('🔁 Ripasso in scadenza: '+r.title);return;
}
var nd=routes.filter(function(x){return !done[x.id];});
if(nd.length)r=nd[Math.floor(now/86400000)%nd.length];
else{var srt=routes.slice().sort(function(a,b){return ((rSR[a.id]||{}).last||0)-((rSR[b.id]||{}).last||0);});r=srt[0];}
selectRoute(r);setMode('c');
toast2('🗺️ Percorso del giorno: '+r.title);
};
/* il coach mostra i percorsi in scadenza col loro nome */
(function(){try{
var _ct2=coachTasks;
coachTasks=function(){
var t=_ct2();
try{
var now=Date.now();
var due=routes.filter(function(r){return rSR[r.id]&&rSR[r.id].due<=now;});
if(due.length){
due.sort(function(a,b){return rSR[a.id].due-rSR[b.id].due;});
var name=due[0].title;if(name.length>26)name=name.slice(0,25)+'…';
/* sostituisce l'eventuale task percorso generico con quello in scadenza */
t=t.filter(function(x){return x.ic!=='🗺️';});
t.unshift({ic:'🗺️',tx:'Ripassa: '+name,sub:due.length>1?('E altri '+(due.length-1)+' percorsi in scadenza'):'La spirale dice che stai per dimenticarlo',fn:function(){goTopografia();setTimeout(routeOfDay,300);},p:1.5});
t.sort(function(a,b){return a.p-b.p;});
t=t.slice(0,4);
}
}catch(e){}
return t;
};
}catch(e){}})();

/* ── INTERLEAVING: le "nuove" alternano gli argomenti (A,B,C,D,A,B...) ──
La scienza della memoria: mescolare gli argomenti fissa il 30-40% in più del blocco singolo. */
qStartNew=function(){
buildQuiz();
var pools={};
QARG.forEach(function(c){pools[c.id]=qShuffle(QUIZ_ALL.filter(function(it){return it.cat===c.id&&!qtStats.seenIds[it.id];}));});
var items=[],more=true;
while(items.length<30&&more){
more=false;
QARG.forEach(function(c){var p=pools[c.id];if(p.length&&items.length<30){items.push(p.pop());more=true;}});
}
if(!items.length){toast2('🎉 Le hai viste tutte! Ripassa gli errori');return;}
startQuiz(items,{mode:'study',title:'Domande nuove · argomenti misti'});
};

/* ── TEST DI RITENZIONE: misura cosa stai DIMENTICANDO ──
Domande che sapevi 14+ giorni fa: se le sbagli ora, rientrano nella ripetizione spaziata. */
(function(){try{
var _qf8=qFinish;
qFinish=function(t){
_qf8(t);
try{
if(qCurView==='result'&&Q&&Q.items){
qtStats.lastOk=qtStats.lastOk||{};
Q.items.forEach(function(it,i){if(Q.ans[i]===it.correct)qtStats.lastOk[it.id]=Date.now();});
qtSave();
}
}catch(e){}
};
}catch(e){}})();
function qStartRet(){
buildQuiz();
qtStats.lastOk=qtStats.lastOk||{};
var cut=Date.now()-14*86400000;
var pool=QUIZ_ALL.filter(function(it){return qtStats.lastOk[it.id]&&qtStats.lastOk[it.id]<cut&&!qtStats.err[it.id];});
if(pool.length<5){toast2('Ancora poche domande "vecchie": riprova tra qualche giorno');return;}
ls('lastRet',Date.now());
startQuiz(qShuffle(pool).slice(0,10),{mode:'study',title:'Test di ritenzione'});
}
/* il coach lo propone una volta a settimana, quando c'è abbastanza materiale */
(function(){try{
var _ct3=coachTasks;
coachTasks=function(){
var t=_ct3();
try{
qtStats.lastOk=qtStats.lastOk||{};
var cut=Date.now()-14*86400000;
var pool=QUIZ_ALL.filter(function(it){return qtStats.lastOk[it.id]&&qtStats.lastOk[it.id]<cut&&!qtStats.err[it.id];}).length;
if(pool>=10&&Date.now()-lg('lastRet',0)>6.5*86400000){
t.push({ic:'🧪',tx:'Test di ritenzione (10 domande)',sub:'Cose che sapevi 2+ settimane fa: vediamo se resistono',fn:function(){openQuiz();setTimeout(qStartRet,250);},p:2.7});
t.sort(function(a,b){return a.p-b.p;});t=t.slice(0,4);
}
}catch(e){}
return t;
};
}catch(e){}})();

/* ═══════ PACCHETTO v20: INSERIMENTO SENZA FATICA ═══════ */

/* ── PULIZIA TESTO INCOLLATO: dal foglio del prontuario a una via per riga ──
Gestisce: numerazioni (1. 2) 3-), frecce →, punti e virgola, virgole, trattini,
numeri civici finali, doppioni consecutivi. */
function cleanSteps(){
var ta=document.getElementById('mRS');if(!ta)return;
var raw=ta.value;if(!raw.trim()){toast2('Incolla prima il testo');return;}
var parts=raw.replace(/\r/g,'\n')
.replace(/\s\d{1,3}[\.\)]\s+/g,'\n')  /* [FIX] numerazione inline: "... 13) P.le ..." spezza */
.split(/\n|→|➔|=>|->|;|·|\||,|\s[-–—]\s/); /* [FIX] "A - B - C": trattino con spazi = separatore */
var out=[],prev='';
parts.forEach(function(p){
p=p.replace(/^\s*\d+\s*[\.\)\-–—:]+\s*/,'');      /* 1.  12)  3 -  */
p=p.replace(/^[\-•*›>»\s]+/,'');                    /* bullet e frecce residue */
p=p.replace(/\s+n\.?\s*\d{1,4}\s*$/i,'');          /* "n. 12" finale */
p=p.replace(/\s+\d{1,4}\s*$/,'');                   /* civico finale */
p=p.replace(/\s+/g,' ').trim().toUpperCase();
if(p&&p.length>2&&p!==prev){out.push(p);prev=p;}
});
if(!out.length){toast2('Nessuna via riconosciuta');return;}
ta.value=out.join('\n');
onMSChange();
toast2('🧹 Sistemato: '+out.length+' vie');hap('m');
}
/* auto-pulizia quando incolli un blocco "sporco" */
(function(){
try{
var ta=document.getElementById('mRS');if(!ta)return;
ta.addEventListener('paste',function(){
setTimeout(function(){
var v=ta.value;
var oneBlob=(v.match(/\n/g)||[]).length<2&&v.length>40&&/,|→|;/.test(v);
var numbered=/^\s*\d+[\.\)]/m.test(v);
if(oneBlob||numbered)cleanSteps();
},80);
});
}catch(e){}
})();

/* ── POSIZIONA IN SEQUENZA: apre la mappa e parte dalla prima via senza punto ──
(con le coordinate suggerite v17 diventa: conferma → conferma → conferma) */
function quickPlace(){
var steps=getMSteps();
if(!steps.length){toast2('Inserisci prima le vie');return;}
var i=steps.findIndex(function(_,j){return !mTC[j];});
if(i<0){toast2('✓ Tutte le vie sono posizionate');return;}
if(!isDesk()){
var a=document.getElementById('mma');
if(a&&!a.classList.contains('open'))togMMap();
}
setTimeout(function(){
selMStep(i);
/* [FIX 100-scenari] se la mappa mobile non era ancora pronta, il suggerimento
coordinate veniva saltato in silenzio: secondo tentativo a mappa creata */
var tm=isDesk()?mMap:mobMap;
if(!tm)setTimeout(function(){selMStep(i);},400);
},300);
hap();
}

/* ── DUPLICA PERCORSO: parti da uno esistente (stessi pin) e modifichi ── */
function dupRoute(id){
var r=routes.find(function(x){return x.id===id;});if(!r)return;
var nid='r_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,5);
routes.push({id:nid,title:r.title+' (COPIA)',steps:r.steps.slice()});
r.steps.forEach(function(_,i){var k=id+'_'+i;if(coords[k])coords[nid+'_'+i]={lat:coords[k].lat,lon:coords[k].lon};});
save();autoSave();
toast2('📄 Copia creata: modificala e salvala');hap('m');
closeMgr();openAdd(nid);
}

/* ── STORIA DELLA VIA nel long-press: "compare in N percorsi" ──
Le vie ricorrenti si imparano prima se le riconosci. */
(function(){try{
var _svs=showViaSheet;
showViaSheet=function(i){
_svs(i);
try{
if(!cur||i<0)return;
var hidden=(mode!=='s')&&!(i===step&&_revealed);
if(hidden)return; /* in Cieco niente indizi */
var nm=cur.steps[i];
var n=routes.filter(function(r){return r.steps.indexOf(nm)>=0;}).length;
if(n>1){
var s=document.getElementById('viaSheet');if(!s)return;
var info=document.createElement('div');info.className='vs-info';
info.textContent='🔗 Questa via compare in '+n+' percorsi';
var nameEl=s.querySelector('.vs-name');
if(nameEl)nameEl.after(info);
}
}catch(e){}
};
}catch(e){}})();

/* ═══════ PACCHETTO v22: ANIMAZIONI & FLUIDITÀ ═══════ */

/* ── slide direzionale tra le tab: vai a destra → entra da destra ── */
setTimeout(function(){
try{
if(typeof window.tabGo!=='function')return;
var ORDER=['home','topo','quiz','studio'];
var _tg=window.tabGo,_cur='home';
window.tabGo=function(t){
var from=_cur;
_tg(t);
try{
if(document.querySelector('#tabbar .tab.on')&&document.querySelector('#tabbar .tab.on').dataset.t!==t)return;/* uscita annullata dal confirm */
_cur=t;
if(t===from)return;
document.body.classList.add('switching');/*[FIX scatti] pausa i gradienti animati durante il cambio*/
setTimeout(function(){document.body.classList.remove('switching');},420);
if(t==='topo')return;/*[FIX scatti] la mappa NON si anima mai: transform su Leaflet = scatti garantiti*/
var el=t==='home'?document.getElementById('homeScreen'):t==='quiz'?document.getElementById('quizApp'):document.getElementById('studyApp');
if(!el)return;
var d=ORDER.indexOf(t)-ORDER.indexOf(from);
el.classList.remove('slide-l','slide-r');void el.offsetWidth;
el.classList.add(d>0?'slide-l':'slide-r');
setTimeout(function(){el.classList.remove('slide-l','slide-r');},340);
}catch(e){}
};
}catch(e){}
},900);

/* ── contachilometri sui giorni al traguardo ── */
(function(){try{
var _rp3=renderPlan;
renderPlan=function(){
_rp3();
try{
var b=document.querySelector('.tg-hd>b');if(!b)return;
var v=parseInt(b.textContent,10);if(isNaN(v))return;
var last=window._tgLast;window._tgLast=v;
if(last===undefined){b.textContent='0';countUp(b,v,700);}
else if(last!==v){b.textContent=String(last);countUp(b,v,500);}
}catch(e){}
};
}catch(e){}})();

/* ── anello di prontezza che si DISEGNA all'arrivo in home ── */
(function(){try{
var _rr4=renderReadiness;
renderReadiness=function(){
_rr4();
try{
var cs=document.querySelectorAll('#readyCard .ready-ring circle');
var c=null;
cs.forEach(function(x){if(x.getAttribute('stroke-dashoffset')||x.style.strokeDashoffset)c=x;});
if(!c&&cs.length)c=cs[cs.length-1];
if(!c)return;
var full=c.getAttribute('stroke-dasharray');if(!full)return;
c.style.setProperty('--circ',full);
c.classList.remove('draw');void c.getBoundingClientRect();c.classList.add('draw');
}catch(e){}
};
}catch(e){}})();

/* ── toast impilati: i messaggi non si cancellano più a vicenda ── */
toast2=function(msg,ms){
try{
var st=document.getElementById('toastStack');
if(!st){st=document.createElement('div');st.id='toastStack';document.body.appendChild(st);}
var t=document.createElement('div');t.className='toastN';t.textContent=msg;
st.appendChild(t);
while(st.children.length>3)st.firstChild.remove();
requestAnimationFrame(function(){t.classList.add('show');});
setTimeout(function(){t.classList.add('hide');setTimeout(function(){try{t.remove();}catch(e){}},300);},ms||2300);
}catch(e){}
};

/* ── header che si compatta scorrendo la lista delle vie (più mappa visibile) ── */
(function(){try{
var sl=document.getElementById('sList');if(!sl)return;
var on=false;
sl.addEventListener('scroll',function(){
var c=sl.scrollTop>36;
if(c!==on){on=c;document.body.classList.toggle('hdr-mini',c);}
},{passive:true});
}catch(e){}})();

/* ── coriandoli con fisica: deriva laterale e rotazione casuali ── */
(function(){try{
var _cf2=confetti;
confetti=function(){
_cf2();
try{
document.querySelectorAll('.cp').forEach(function(p){
p.style.setProperty('--dx',(Math.random()*180-90).toFixed(0)+'px');
p.style.setProperty('--rot',(Math.random()*840-420).toFixed(0)+'deg');
});
}catch(e){}
};
}catch(e){}})();

/* ═══════ PACCHETTO v23: VERSO L'ESAME ═══════ */

/* ── SEMAFORO: "se l'esame fosse domani?" — verde/giallo/rosso con motivo ── */
function renderExamLight(){
try{
var rc=document.getElementById('readyCard');if(!rc)return;
try{buildQuiz();}catch(e){}
var el=document.getElementById('examLight');
if(!el){el=document.createElement('div');el.id='examLight';rc.after(el);}
var hist=(qExamHist||[]).slice(-5);
var avg=hist.length?hist.reduce(function(s,x){return s+(x.ok||0);},0)/hist.length:0;
var ti=targetInfo();
var cov=ti?Math.round((ti.pctQ+ti.pctR)/2):Math.round(Object.keys(qtStats.seenIds||{}).length/(QUIZ_ALL.length||919)*100);
var open=Object.keys(qtStats.err||{}).length;
/* [v24] ritenzione: se l'ultimo test dice che dimentichi, niente verde */
var ret=lg('retScore',null);
var retPct=ret&&ret.tot?Math.round(ret.ok/ret.tot*100):null;
var retOld=ret?(Date.now()-ret.ts>21*86400000):true;
var cls,dot,ttl,why;
if(hist.length>=3&&avg>=14&&cov>=95&&open<15&&(retPct===null||retPct>=75)){cls='ok';dot='🟢';ttl='PRONTO';why='Media '+avg.toFixed(1)+'/16, copertura '+cov+'%'+(retPct!==null?(', ritenzione '+retPct+'%'):'')+', errori sotto controllo';}
else if(hist.length>=3&&avg>=14&&cov>=95&&open<15&&retPct!==null&&retPct<75){cls='mid';dot='🟡';ttl='QUASI';why='Tutto bene TRANNE la ritenzione: '+retPct+'% — la memoria sta perdendo pezzi, ripassa il vecchio';}
else if((hist.length>=2&&avg>=12)||cov>=70){cls='mid';dot='🟡';ttl='QUASI';
why=cov<95?('Copertura al '+cov+'%: continua con nuove e percorsi'):(hist.length<3?'Servono più simulazioni per giudicare':(avg<14?('Media '+avg.toFixed(1)+'/16: puntiamo a 14+'):('Ancora '+open+' errori aperti')));}
else{cls='no';dot='🔴';ttl='NON ANCORA';
why=hist.length===0?'Fai la prima simulazione per avere una misura':('Copertura '+cov+'%'+(hist.length?(' · media '+avg.toFixed(1)+'/16'):''));}
el.innerHTML='<div class="xl '+cls+'"><span class="xl-dot">'+dot+'</span><div class="xl-tx"><b>Se l\'esame fosse domani: '+ttl+'</b><small>'+why+'</small></div></div>';
}catch(e){}
}
(function(){try{
var _rr5=renderReadiness;
renderReadiness=function(){_rr5();try{renderExamLight();}catch(e){}};
}catch(e){}})();

/* ── REPORT DELLA DOMENICA: la settimana in 6 righe ── */
function weeklyReport(force){
try{
var now=Date.now();
if(!force){
if(now-lg('wkRepTs',0)<6*86400000)return;
var isSun=new Date().getDay()===0;
if(!isSun&&now-lg('wkRepTs',0)<7.5*86400000)return; /* di norma esce la domenica */
}
try{buildQuiz();}catch(e){}
var dd=qtStats.daily||{},d7=0;
for(var i=0;i<7;i++){var dt=new Date();dt.setDate(dt.getDate()-i);d7+=dd[_dayKey(dt)]||0;}
if(!force&&d7===0)return; /* settimana vuota: meglio il silenzio del rimprovero */
var snap=lg('wkSnap',null);
var seen=Object.keys(qtStats.seenIds||{}).length;
var rD=routes.filter(function(r){return done[r.id];}).length;
var open=Object.keys(qtStats.err||{}).length;
var lines=[];
lines.push('📝 <b>'+d7+'</b> risposte negli ultimi 7 giorni'+(snap?(' <span class="'+(d7>=snap.d7?'up':'dn')+'">'+(d7>=snap.d7?'+':'')+(d7-snap.d7)+'</span>'):''));
lines.push('🆕 <b>'+(snap?Math.max(0,seen-snap.seen):seen)+'</b> domande nuove'+(snap?' questa settimana':' viste finora'));
lines.push('🗺️ <b>'+(snap?Math.max(0,rD-snap.rD):rD)+'</b> percorsi completati'+(snap?' questa settimana':' finora'));
lines.push('🔁 <b>'+open+'</b> errori in lavorazione');
if(snap&&snap.cat){
var best=null,bd=-1,worst=null,wd=1;
QARG.forEach(function(c){
var a=qtStats.cat[c.id],b=snap.cat[c.id];
if(a&&b&&a.seen>b.seen){
var r1=a.ok/a.seen,r0=b.seen?b.ok/b.seen:0,df=r1-r0;
if(df>bd){bd=df;best=c;}
if(df<wd){wd=df;worst=c;}
}
});
if(best&&bd>0.02)lines.push('📈 In crescita: <b>'+best.label+'</b> (+'+Math.round(bd*100)+'%)');
if(worst&&wd<-0.02)lines.push('📉 Da tenere d\'occhio: <b>'+worst.label+'</b> ('+Math.round(wd*100)+'%)');
}
if(!force){/*[FIX 300] solo il report automatico aggiorna la baseline: quello dal menu è in sola lettura*/
var cat={};QARG.forEach(function(c){var s2=qtStats.cat[c.id];if(s2)cat[c.id]={seen:s2.seen,ok:s2.ok};});
ls('wkSnap',{ts:now,d7:d7,seen:seen,rD:rD,cat:cat});
ls('wkRepTs',now);
}
var old=document.getElementById('wkModal');if(old)old.remove();
var m=document.createElement('div');m.id='wkModal';m.className='modal center open';
m.innerHTML='<div class="mbox" style="max-width:440px">'
+'<div class="mhdr"><div class="mhdr-left"><h3>📅 La tua settimana</h3><p>'+new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})+'</p></div>'
+'<button class="mhdr-close" onclick="document.getElementById(\'wkModal\').remove()">✕</button></div>'
+'<div style="padding:16px 20px 20px">'+lines.map(function(l){return '<div class="wk-line">'+l+'</div>';}).join('')
+'<button class="bsv" style="width:100%;margin-top:14px" onclick="document.getElementById(\'wkModal\').remove()">Si continua 💪</button></div></div>';
document.body.appendChild(m);
hap('m');
}catch(e){}
}
(function(){try{
var _gh6=goHome;goHome=function(){_gh6();setTimeout(function(){try{weeklyReport();}catch(e){}},700);};
var _cam2=closeAllM;closeAllM=function(){_cam2();try{var w=document.getElementById('wkModal');if(w)w.remove();}catch(e){}};
}catch(e){}})();
setTimeout(function(){try{weeklyReport();}catch(e){}},2200);

/* ── LE CONFUSIONI: le domande che TU hai marcato "confusa con un'altra" ── */
function qStartConf(){
buildQuiz();
qtStats.why=qtStats.why||{};
var ids=Object.keys(qtStats.why).filter(function(k){return (qtStats.why[k].c||0)>=1;});
var items=ids.map(function(id){return QUIZ_ALL[id|0];}).filter(Boolean);
if(items.length<3){toast2('Poche domande marcate 🔀 finora');return;}
startQuiz(qShuffle(items).slice(0,15),{mode:'study',title:'Le confusioni'});
}
/* il coach le propone in mantenimento quando ce ne sono abbastanza */
(function(){try{
var _ct4=coachTasks;
coachTasks=function(){
var t=_ct4();
try{
var ti=targetInfo();
var mantenimento=!ti||ti.doneAll;
qtStats.why=qtStats.why||{};
var n=Object.keys(qtStats.why).filter(function(k){return (qtStats.why[k].c||0)>=1;}).length;
if(mantenimento&&n>=6){
t.push({ic:'🔀',tx:'Sciogli '+Math.min(n,15)+' confusioni',sub:'Le domande che scambi con altre: guardarle in fila le separa',fn:function(){openQuiz();setTimeout(qStartConf,250);},p:4.2});
t.sort(function(a,b){return a.p-b.p;});t=t.slice(0,4);
}
}catch(e){}
return t;
};
}catch(e){}})();

/* ── ESAME COMPLETO: simulazione + percorso in Cieco a sorpresa ── */
let _fullExam=false,_fullRoute=null;
(function(){try{
var _rd2=renderDash;
renderDash=function(){_rd2();_fullExam=false;/*[FIX 300] tornare alla dashboard annulla l'esame completo in sospeso*/};
}catch(e){}})();
function qStartFull(){
if(!routes.length){toast2('Serve almeno un percorso salvato');qStartExam();return;}
_fullExam=true;
qStartExam();
toast2('🎓 Esame completo: dopo il quiz, un percorso a sorpresa');
}
(function(){try{
var _qf9=qFinish;
qFinish=function(t){
_qf9(t);
try{
if(qCurView==='result'&&_fullExam&&lastQuiz&&lastQuiz.opts&&lastQuiz.opts.mode==='exam'){
_fullExam=false;
var box=document.querySelector('#qResult .qres-actions');
if(box&&!document.getElementById('fullNext')){
var b=document.createElement('button');
b.id='fullNext';b.className='btn bp';b.textContent='🗺️ Ora il percorso a sorpresa';
b.onclick=function(){
var withPins=routes.filter(function(r){return r.steps.some(function(_,i){return coords[r.id+'_'+i];});});
var pool=withPins.length?withPins:routes;
var r=pool[Math.floor(Math.random()*pool.length)];
_fullRoute=r.id;
closeQuiz();/*[FIX 100-anim] il quiz è uno strato fisso SOPRA la mappa: senza chiuderlo copriva tutto*/
goTopografia();
setTimeout(function(){selectRoute(r);setMode('c');toast2('🎲 A sorpresa: '+r.title+' — completalo in Cieco!');},300);
};
box.insertBefore(b,box.firstChild);
}
}else if(qCurView==='result'){
var oldB=document.getElementById('fullNext');if(oldB)oldB.remove();
}
}catch(e){}
};
var _sr2=selectRoute;
selectRoute=function(r){if(_fullRoute&&r&&r.id!==_fullRoute)_fullRoute=null;/*[FIX 300] cambi percorso = sfida annullata*/_sr2(r);};
var _rc4=routeCelebrate;
routeCelebrate=function(){
_rc4();
try{
if(_fullRoute&&cur&&cur.id===_fullRoute){
_fullRoute=null;
setTimeout(function(){toast2('🏁 ESAME COMPLETO terminato — quiz + topografia!');try{confetti();}catch(e){}},900);
}
}catch(e){}
};
}catch(e){}})();

/* ═══════ PACCHETTO v24: ICONE SVG + COACH PIÙ INTELLIGENTE ═══════ */

/* ── libreria icone a tratto (sostituiscono le emoji nei punti chiave) ── */
var ICO={
'🔁':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></svg>',
'📝':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
'🗺️':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6.2V20l6-2.2 6 2.2 6-2.2V4l-6 2.2L9 4z"/><path d="M9 4v13.8M15 6.2V20"/></svg>',
'🎓':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9.5V15"/></svg>',
'🧪':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7 15h10"/></svg>',
'🔀':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>',
'💀':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a8 8 0 0 0-8 8c0 2.5 1.2 4.6 3 6v3h10v-3c1.8-1.4 3-3.5 3-6a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="1.4"/><circle cx="15" cy="11" r="1.4"/></svg>',
'⚡':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
'🆕':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
'✅':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.6L16 9.5"/></svg>',
'🌤':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/></svg>'
};
function swapIco(sel){
try{
document.querySelectorAll(sel).forEach(function(el){
var t=el.textContent.trim();
if(ICO[t])el.innerHTML=ICO[t];
});
}catch(e){}
}
(function(){try{
var _rc5=renderCoach;renderCoach=function(){_rc5();swapIco('#coachCard .coach-ic');};
var _rd3=renderDash;renderDash=function(){_rd3();swapIco('#qDash .qtile-ic');};
}catch(e){}})();

/* ── riempimento "nuove" INTERLEAVED anche nelle micro-sessioni ── */
function _newRR(n,exclude){
var pools={};
QARG.forEach(function(c){pools[c.id]=qShuffle(QUIZ_ALL.filter(function(it){return it.cat===c.id&&!qtStats.seenIds[it.id]&&!(exclude&&exclude[it.id]);}));});
var out=[],more=true;
while(out.length<n&&more){
more=false;
QARG.forEach(function(c){if(out.length<n&&pools[c.id].length){out.push(pools[c.id].pop());more=true;}});
}
return out;
}

/* ── RIENTRO MORBIDO: dopo 3+ giorni di pausa il coach riparte piano, senza colpe ── */
function startSoft(){
buildQuiz();
qtStats.lastOk=qtStats.lastOk||{};
/* 4 domande che già sapevi (vittorie facili per riprendere il ritmo) + 2 nuove */
var known=qShuffle(QUIZ_ALL.filter(function(it){return qtStats.lastOk[it.id]&&!qtStats.err[it.id];})).slice(0,4);
var ex={};known.forEach(function(it){ex[it.id]=1;});
var items=known.concat(_newRR(6-known.length,ex));
if(items.length<3)items=qShuffle(QUIZ_ALL.slice()).slice(0,6);
startQuiz(qShuffle(items),{mode:'study',title:'Rientro morbido'});
toast2('🌤 Si riparte piano: 6 domande e sei di nuovo in pista');
}
(function(){try{
var _ct5=coachTasks;
coachTasks=function(){
var t=_ct5();
try{
var dd=qtStats.daily||{},last=0;
Object.keys(dd).forEach(function(k){
var p=k.split('-');var ts=new Date(+p[0],p[1]-1,+p[2]).getTime();
if(dd[k]>0&&ts>last)last=ts;
});
var gap=last?Math.floor((Date.now()-last)/86400000):0;
if(gap>=3){
t.unshift({ic:'🌤',tx:'Rientro morbido — 6 domande',sub:'Sono passati '+gap+' giorni: tutto ok, si riparte leggeri',fn:function(){openQuiz();setTimeout(startSoft,250);},p:0.4});
t=t.slice(0,4);
}
}catch(e){}
return t;
};
}catch(e){}})();

/* ── RITENZIONE nel semaforo: il verde richiede anche che la memoria TENGA ── */
(function(){try{
var _qf10=qFinish;
qFinish=function(t){
_qf10(t);
try{
if(qCurView==='result'&&lastQuiz&&lastQuiz.opts&&lastQuiz.opts.title==='Test di ritenzione'&&Q&&Q.items){
var ok=0;Q.items.forEach(function(it,i){if(Q.ans[i]===it.correct)ok++;});
ls('retScore',{ok:ok,tot:Q.items.length,ts:Date.now()});
}
}catch(e){}
};
}catch(e){}})();

/* ── il coach SPIEGA la sua strategia del giorno ── */
(function(){try{
var _rc6=renderCoach;
renderCoach=function(){
_rc6();
try{
var w=document.getElementById('coachCard');if(!w||!w.firstChild)return;
var hd=w.querySelector('.coach-hd');if(!hd||hd.parentNode.querySelector('.coach-why'))return;
var ti=targetInfo();
var msg=(ti&&!ti.doneAll)
?'Fase copertura: prima gli errori in scadenza, poi il nuovo al ritmo del traguardo.'
:'Fase mantenimento: si difende ciò che sai — scadenze, punti deboli, simulazioni.';
var d=document.createElement('div');d.className='coach-why';d.textContent=msg;
hd.after(d);
}catch(e){}
};
}catch(e){}})();

/* ── OBIETTIVO ADATTIVO: se lo superi sempre, il coach propone di alzarlo ── */
(function(){try{
var _rw4=renderWeekly;
renderWeekly=function(){
_rw4();
try{
if(Date.now()-lg('goalSuggTs',0)<6.5*86400000)return;
var goal=lg('dailyGoal',30),dd=qtStats.daily||{},hit=0,sum=0;
for(var i=1;i<=7;i++){var dt=new Date();dt.setDate(dt.getDate()-i);var v=dd[_dayKey(dt)]||0;if(v>=goal)hit++;sum+=v;}
if(hit>=6&&sum/7>=goal*1.4){
ls('goalSuggTs',Date.now());
var sug=Math.round(sum/7/5)*5;
setTimeout(function(){toast2('📈 Superi sempre l\'obiettivo: prova ad alzarlo a '+sug+' (tocca il grafico)',3500);},1200);
}
}catch(e){}
};
}catch(e){}})();

/* ═══════ PACCHETTO v25: FIX SCATTI DEFINITIVO + coerenza icone + morbidezza ═══════ */

/* ── la mappa smette di dipingere quando non è in scena ──
visibility:hidden conserva le dimensioni: Leaflet non perde i tile e non serve reinizializzare */
function _sceneFlag(t){
try{document.body.classList.toggle('on-topo',t==='topo');}catch(e){}
}
(function(){try{
var _gt2=goTopografia;goTopografia=function(){_gt2();_sceneFlag('topo');setTimeout(mapResizeSoon,80);};
var _gh7=goHome;goHome=function(){_gh7();_sceneFlag('home');};
var _oq2=openQuiz;openQuiz=function(){_oq2();_sceneFlag('quiz');};
var _os2=openStudy;openStudy=function(){_os2();_sceneFlag('studio');};
}catch(e){}})();
/* stato iniziale: si parte dalla home */
_sceneFlag('home');

/* ── icone: colore semantico per pastiglia (niente più blu su fondo rosso) ── */
var ICOC={'🆕':'var(--warn)','⚡':'var(--warn)','💀':'var(--err)','🎓':'var(--pu)','🔀':'var(--a)','📝':'var(--a)','🗺️':'var(--a)','🔁':'var(--a)','🧪':'var(--pu)','🌤':'var(--warn)','✅':'var(--ok)'};
/* consolidamento: ⚡ resta solo su "Inizia 5 minuti"; lo Sprint ha il cronometro,
le più sbagliate il bersaglio (via il teschio: stesso concetto, segno più pulito) */
ICO['⚡']='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9M9 2.5h6M12 2.5v3.5"/></svg>';
ICO['💀']='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>';
swapIco=function(sel){
try{
document.querySelectorAll(sel).forEach(function(el){
var t=el.textContent.trim();
if(ICO[t]){el.innerHTML=ICO[t];if(ICOC[t])el.style.color=ICOC[t];}
});
}catch(e){}
};

/* ═══════ FIX PERCORSI DUPLICATI / SALVATAGGI PERSI ═══════ */

/* ── lapidi delle cancellazioni ── */
function rDelMark(id){var t=lg('rDel',{});t[id]=Date.now();
var ks=Object.keys(t);if(ks.length>300){ks.sort(function(a,b){return t[a]-t[b];});delete t[ks[0]];}
ls('rDel',t);markDirty('prefs');}
function rDelUnmark(id){var t=lg('rDel',{});delete t[id];ls('rDel',t);markDirty('prefs');}
(function(){try{
var _gp2=getPrefs;
getPrefs=function(){var p=_gp2();p.rDel=lg('rDel',{});return p;};
}catch(e){}})();

/* ── FLUSH IMMEDIATO all'uscita: niente più salvataggi persi chiudendo l'app ──
Il salvataggio cloud aspetta 4s (per non spammare): se chiudi prima, ora parte SUBITO. */
function flushNow(){
try{
if(!fbOk||!fbRef)return;
if(!navigator.onLine)return;/*[FIX 1000] offline: NON svuotare _dirty, l'invio ripartirà alla prossima occasione*/
if(!Object.keys(_dirty).length)return;
clearTimeout(asTimer);
var all={routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,studyProg:studyProg,qExamHist:qExamHist,prefs:getPrefs()};
var p={ts:Date.now()};
Object.keys(_dirty).forEach(function(k){if(all[k]!==undefined)p[k]=all[k];});
fbRef.update(p);/* fire-and-forget: il browser completa la richiesta anche uscendo */
_dirty={};
}catch(e){}
}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')flushNow();});
window.addEventListener('pagehide',flushNow);

/* ── AUTO-PULIZIA duplicati: guarisce i dati già danneggiati ──
1) stesso id due volte → tiene il primo
2) stesso contenuto (titolo+vie) con id diversi → tiene quello con più pin, lapide sull'altro */
function dedupRoutes(){
try{
var seen={},bySig={},removed=0;
var keep=[];
routes.forEach(function(r){
if(!r||!r.id)return;
if(seen[r.id]){removed++;return;}
seen[r.id]=1;keep.push(r);
});
routes=keep;
routes.forEach(function(r){
var sig=(r.title||'').trim().toUpperCase()+'§'+r.steps.join('|');
(bySig[sig]=bySig[sig]||[]).push(r);
});
Object.keys(bySig).forEach(function(sig){
var g=bySig[sig];if(g.length<2)return;
/* tieni quello con più coordinate posizionate */
g.sort(function(a,b){
var pa=a.steps.filter(function(_,i){return coords[a.id+'_'+i];}).length;
var pb=b.steps.filter(function(_,i){return coords[b.id+'_'+i];}).length;
return pb-pa;
});
g.slice(1).forEach(function(r){
routes=routes.filter(function(x){return x.id!==r.id;});
Object.keys(coords).forEach(function(k){if(k.indexOf(r.id+'_')===0)delete coords[k];});
delete qStats[r.id];delete done[r.id];
try{rDelMark(r.id);}catch(e){}
removed++;
});
});
if(removed>0){
save();autoSave();
toast2('🧹 Rimossi '+removed+' percorsi duplicati');
try{renderMgr();}catch(e){}
if(cur&&!routes.find(function(r){return r.id===cur.id;})){cur=null;}
}
return removed;
}catch(e){return 0;}
}
/* all'avvio e dopo ogni merge dal cloud */
setTimeout(function(){try{dedupRoutes();}catch(e){}},2600);
(function(){try{
var _sfc=syncFromCloud;
syncFromCloud=function(){_sfc();setTimeout(function(){try{dedupRoutes();}catch(e){}},1500);};
}catch(e){}})();
