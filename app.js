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
try{
const cfg={apiKey:"AIzaSyBtVu_bZruWdB3nQz0MhrNmCE7lMonoGd4",authDomain:"ncc-milano-2dbd0.firebaseapp.com",databaseURL:"https://ncc-milano-2dbd0-default-rtdb.europe-west1.firebasedatabase.app",projectId:"ncc-milano-2dbd0",storageBucket:"ncc-milano-2dbd0.firebasestorage.app",messagingSenderId:"511775426532",appId:"1:511775426532:web:785259ec4e187e42aba9f1"};
firebase.initializeApp(cfg);fbRef=firebase.database().ref('prontuario');fbOk=true;
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
function applyDark(){document.body.classList.toggle('dark',dark);document.getElementById('dkIcon').textContent=dark?'☀️':'🌙';}
function togDark(){dark=!dark;ls('dark',dark);applyDark();if(typeof renderDash==='function'&&document.getElementById('quizApp').classList.contains('open'))renderDash();}
applyDark();

/* ── HAPTIC ── */
function hap(t){try{if(!navigator.vibrate)return;navigator.vibrate(t==='m'?20:t==='e'?[10,10,10]:10);}catch(e){}}

/* ── MAPPA ── */
let map,mkr=null,dL=null,dDec=null,nL=null,dFlow=null;
let drawTok=0,plIdx=null,cur=null,step=0,mode='s';
let tx0=0,ty0=0,lastRnd=-1,nmTimer=null;

function initMap(){
map=L.map('map',{zoomControl:false}).setView([45.4642,9.1900],13);
const TILE_LABELS='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
window._tileLayer=L.tileLayer(TILE_LABELS,{attribution:'© OpenStreetMap © CARTO'}).addTo(map);
L.control.zoom({position:'topright'}).addTo(map);
map.on('click',e=>{
if(plIdx===null||!cur)return;
const k=`${cur.id}_${plIdx}`;coords[k]={lat:e.latlng.lat,lon:e.latlng.lng};
save();autoSave();putMkr(e.latlng.lat,e.latlng.lng,cur.steps[plIdx],k);
rebuildLines();stopPl();renderList();toast2('📍 Salvato');hap('m');
});
document.getElementById('map').addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;},{passive:true});
document.getElementById('map').addEventListener('touchend',e=>{
if(plIdx!==null)return;
const dx=e.changedTouches[0].clientX-tx0,dy=Math.abs(e.changedTouches[0].clientY-ty0);
if(Math.abs(dx)>55&&dy<40){dx<0?nextS():prevS();}
},{passive:true});
initDrag();
}
function initDrag(){
const panel=document.getElementById('panel'),h=document.getElementById('pdrag');
if(!h||window.innerWidth>=768)return;
let sy=0,sh=0,dr=false;
h.addEventListener('touchstart',e=>{dr=true;sy=e.touches[0].clientY;sh=panel.getBoundingClientRect().height;panel.style.transition='none';},{passive:true});
document.addEventListener('touchmove',e=>{if(!dr)return;const dy=sy-e.touches[0].clientY;panel.style.maxHeight=Math.min(window.innerHeight*.78,Math.max(130,sh+dy))+'px';},{passive:true});
document.addEventListener('touchend',()=>{if(!dr)return;dr=false;panel.style.transition='';},{passive:true});
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
slideMarker(mkr,[lat,lon]);mkr.getPopup().setContent('<b>'+esc(name)+'</b>');
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
cur=r;step=0;if(typeof stopAutoplay==='function')stopAutoplay();
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
if(pts.length>1)map.flyToBounds(pts.map(p=>[p.lat,p.lon]),{padding:[40,40],maxZoom:15,duration:.8});
else if(pts.length===1)map.flyTo([pts[0].lat,pts[0].lon],15,{duration:.8});
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
if(d._nm)d._nm.classList.toggle('hid',mode!=='s'&&!isA);
if(d._wb)d._wb.style.display=(isW&&!isA)?'':'none';
}
const ae=listRows[step];if(ae)ae.scrollIntoView({block:'nearest'});
}
function nextS(){if(!cur||step>=cur.steps.length-1)return;step++;syncListActive();updateUI();goStep();hap();ls('lStep',step);if(mode!=='q'&&step===cur.steps.length-1)routeFinishCheck();const b=document.getElementById('bNext');if(b){b.style.transform='scale(.88)';setTimeout(()=>b.style.transform='',150);}}
function prevS(){if(!cur||step<=0)return;if(typeof stopAutoplay==='function')stopAutoplay();step--;syncListActive();updateUI();goStep();hap();ls('lStep',step);const b=document.getElementById('bPrev');if(b){b.style.transform='scale(.88)';setTimeout(()=>b.style.transform='',150);}}
function revealS(){if(!cur)return;const el=listRows[step]?listRows[step]._nm:null;if(el)typewrite(el,cur.steps[step]);if(mode==='q'){document.getElementById('qfb').textContent=cur.steps[step]||'';document.getElementById('qfb').style.color='var(--mu)';}hap();}
function showNM(){const e=document.getElementById('nmHint');e.style.display='block';clearTimeout(nmTimer);nmTimer=setTimeout(()=>hideNM(),2500);}
function hideNM(){document.getElementById('nmHint').style.display='none';clearTimeout(nmTimer);}
function updateUI(){
if(!cur)return;
const tot=cur.steps.length,pct=tot>1?(step/(tot-1))*100:(tot===1?100:0);
document.getElementById('pProg').textContent=`Via ${step+1} di ${tot}`;
document.getElementById('pBar').style.width=pct+'%';
const pl=cur.steps.filter((_,i)=>!!coords[cur.id+'_'+i]).length;
document.getElementById('pStat').textContent=pl+'/'+tot+' 📍'+(done[cur.id]?' ✓':'');
document.getElementById('bPrev').disabled=step===0;
document.getElementById('bNext').disabled=step===tot-1;
document.getElementById('bSV').disabled=!mkr;
document.getElementById('bRev').style.display=mode==='c'?'block':'none';
document.getElementById('nf').style.display=mode==='q'?'none':'block';
document.getElementById('qf').style.display=mode==='q'?'block':'none';
if(mode==='q'){document.getElementById('qa').value='';document.getElementById('qfb').textContent='';}
}
function goStep(){
if(!cur||!map)return;
const k=cur.id+'_'+step;
if(coords[k]){
const lat=coords[k].lat,lon=coords[k].lon;
putMkr(lat,lon,cur.steps[step],k);
try{
const ll=L.latLng(lat,lon);
if(map.getZoom()<15)map.setView(ll,15,{animate:true,duration:.3});
else if(!map.getBounds().pad(-0.22).contains(ll))map.panTo(ll,{animate:true,duration:.3});
}catch(e){}
hideNM();
}
else{if(mkr){try{map.removeLayer(mkr);}catch(e){}mkr=null;}updateUI();showNM();}
rebuildLines();
}

/* ── LINES (ottimizzata: riusa i layer con setLatLngs invece di ricrearli/rianimarli) ── */
function cancelDraw(){drawTok++;}
function clearLines(){if(dFlow){try{map.removeLayer(dFlow);}catch(e){}dFlow=null;}if(dDec){try{map.removeLayer(dDec);}catch(e){}dDec=null;}if(dL){try{map.removeLayer(dL);}catch(e){}dL=null;}if(nL){try{map.removeLayer(nL);}catch(e){}nL=null;}}
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
if(dL)dL.setLatLngs(dn);
else dL=L.polyline(dn,{color:getAccent(),weight:5.5,opacity:.95,lineCap:'round',lineJoin:'round',className:'route-line'}).addTo(map);
if(dFlow)dFlow.setLatLngs(dn);
else dFlow=L.polyline(dn,{color:'#fff',weight:2.5,opacity:.85,lineCap:'round',className:'route-flow'}).addTo(map);
try{
if(dDec)dDec.setPaths(dL);
else dDec=L.polylineDecorator(dL,{patterns:[{offset:'6%',repeat:'120px',symbol:L.Symbol.arrowHead({pixelSize:12,pathOptions:{color:getAccent(),weight:2}})}]}).addTo(map);
}catch(e){}
}else{
if(dL){try{map.removeLayer(dL);}catch(e){}dL=null;}
if(dFlow){try{map.removeLayer(dFlow);}catch(e){}dFlow=null;}
if(dDec){try{map.removeLayer(dDec);}catch(e){}dDec=null;}
}
}
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
hap('m');
}

/* ── MODE (route study) ── */
function setMode(m){
mode=m;
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
const raw=document.getElementById('qa').value;if(!raw.trim())return;
const ans=norm(raw),cor=norm(cur.steps[step]);const fb=document.getElementById('qfb');
if(!qStats[cur.id])qStats[cur.id]={correct:0,total:0,wrong:{}};
if(!qStats[cur.id].wrong)qStats[cur.id].wrong={};
qStats[cur.id].total++;
if(ans===cor){
fb.textContent='✅ Corretto!';fb.style.color='var(--ok)';
fb.style.animation='none';void fb.offsetWidth;fb.style.animation='fu .25s cubic-bezier(.34,1.3,.64,1)';
qStats[cur.id].correct++;save();autoSave();hap('m');
if(step===cur.steps.length-1){routeCelebrate();}
else setTimeout(nextS,600);
}else{
fb.textContent='❌ '+cur.steps[step];fb.style.color='var(--err)';
fb.style.animation='none';void fb.offsetWidth;fb.style.animation='fu .2s ease';
qStats[cur.id].wrong[step]=(qStats[cur.id].wrong[step]||0)+1;save();autoSave();hap('e');
}
}
function skipQ(){
if(!cur)return;
const fb=document.getElementById('qfb');fb.textContent='→ '+cur.steps[step];fb.style.color='var(--warn)';
if(!qStats[cur.id])qStats[cur.id]={correct:0,total:0,wrong:{}};
qStats[cur.id].total++;save();autoSave();
if(step===cur.steps.length-1){routeCelebrate();}
else setTimeout(nextS,600);
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
[...routes].sort((a,b)=>a.title.localeCompare(b.title)).forEach(r=>{
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
if(idx===-1){rid='r_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,5);routes.push({id:rid,title,steps});}
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
d.innerHTML=`<div class="rii"><div class="rit">${esc(r.title)}</div><div class="rim">${pl}/${r.steps.length} 📍${pct!==null?' · Quiz '+pct+'%':''}</div></div><div class="ria" onclick="event.stopPropagation()"><button class="rab reb" onclick="openAdd('${r.id}');closeMgr()">✏️</button><button class="rab rdb" onclick="delRoute('${r.id}')">🗑️</button></div>`;
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
delete qStats[id];delete done[id];save();autoSave();
undoToast('Percorso eliminato',function(){if(_bk.route){routes.push(_bk.route);Object.assign(coords,_bk.coords);if(_bk.qStats)qStats[id]=_bk.qStats;if(_bk.done)done[id]=_bk.done;save();autoSave();renderMgr();toast2('↩️ Ripristinato');}});
if(cur&&cur.id===id){cur=null;document.getElementById('pTitle').textContent='NCC Milano';document.getElementById('sList').innerHTML='';listRows=[];document.getElementById('pProg').textContent='Seleziona un percorso';document.getElementById('pBar').style.width='0%';document.getElementById('rstBtn').style.display='none';var _pb2=document.getElementById('playBtn');if(_pb2)_pb2.style.display='none';if(typeof stopAutoplay==='function')stopAutoplay();document.getElementById('pStat').textContent='';if(mkr){try{if(map)map.removeLayer(mkr);}catch(e){}mkr=null;}cancelDraw();clearLines();}
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
function goTopografia(){setAccent('topo');const h=document.getElementById('homeScreen');if(h)h.style.display='none';const hb=document.getElementById('homeBtn');if(hb)hb.style.display='flex';try{if(map)map.invalidateSize();}catch(e){}setMode('s');try{pushTrap();}catch(e){}}
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
items=qShuffle(items.slice()).slice(0,40);
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
function qStartCat(cid){
if(cid==='bm'){let items=QUIZ_ALL.filter(function(it){return qtStats.bm&&qtStats.bm[it.id];});if(!items.length){toast2('Nessun segnalibro');return;}startQuiz(qShuffle(items.slice()),{mode:'study',title:'Segnalibri'});return;}
if(cid==='errata'){
let items=QUIZ_ALL.filter(it=>qtStats.err[it.id]);items.sort(function(a,b){return srDue(a.id)-srDue(b.id);});
if(!items.length){toast2('🎉 Nessun errore da ripassare');return;}
startQuiz(qShuffle(items.slice()),{mode:'study',title:'Ripasso errori'});return;
}
const arg=QARG.find(c=>c.id===cid);
const items=qShuffle(QUIZ_ALL.filter(it=>it.cat===cid).slice()).slice(0,30);
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
Q.items.forEach((it,i)=>{
const ans=Q.ans[i]>=0,cur=i===Q.idx;
h+=`<button class="qpill${cur?' cur':''}${ans?' ans':''}" onclick="qJump(${i})">${i+1}</button>`;
});
const p=document.getElementById('qPills');p.innerHTML=h;
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
if(i!==it.correct)hap('e');
qRenderPills();qUpdatePct();
setTimeout(function(){if(!Q)return;Q._locked=false;if(Q.idx<Q.items.length-1)qGo(1);else qRenderRun();},900);
}else{
qRenderRun();
if(Q.idx<Q.items.length-1)setTimeout(function(){qGo(1);},220);
}
}
function qJump(i){Q.idx=i;qRenderRun();}
function qGo(d){const n=Q.idx+d;if(n<0||n>=Q.items.length)return;Q.idx=n;qRenderRun();hap();}
function qUpdatePct(){
const ans=Q.ans.filter(a=>a>=0).length;
document.getElementById('qPct').textContent=Math.round(ans/Q.items.length*100)+'%';
}
function qTick(){
if(!Q)return;
const clk=document.getElementById('qClock');
if(Q.mode==='exam'){
const rem=Q.limit-Q.elapsed;
if(rem===300)toast2('⏳ 5 minuti alla fine');
if(rem===60)toast2('⏳ 1 minuto alla fine');
if(rem<=0){clk.textContent='00:00';qFinish(true);return;}
clk.textContent=fmtT(rem);clk.classList.toggle('warn',rem<=60);var _tb=document.getElementById('qTimeBar');if(_tb){_tb.classList.add('on');_tb.classList.toggle('warn',rem<=60);var _i=_tb.firstElementChild;if(_i)_i.style.transform='scaleX('+Math.max(0,rem/Q.limit)+')';}
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
const btn=document.getElementById('qListen');
if(speechSynthesis.speaking){qStopSpeak();return;}
const it=Q.items[Q.idx];const LET=Array.from({length:Math.max(4,(Q&&Q.items[Q.idx]?Q.items[Q.idx].choices.length:4))},(_,i)=>String.fromCharCode(65+i));
let txt=it.q+'. ';it.choices.forEach((c,i)=>txt+=LET[i]+'. '+c+'. ');
qUtter=new SpeechSynthesisUtterance(txt);qUtter.lang=it.cat==='lingua'?'en-GB':'it-IT';qUtter.rate=.96;
qUtter.onend=()=>btn.classList.remove('playing');
qUtter.onerror=()=>btn.classList.remove('playing');
btn.classList.add('playing');speechSynthesis.speak(qUtter);
}
function qStopSpeak(){try{if('speechSynthesis'in window)speechSynthesis.cancel();}catch(e){}const b=document.getElementById('qListen');if(b)b.classList.remove('playing');}

/* ── USCITA / FINE ── */
function qConfirmExit(){
if(confirm('Vuoi uscire dal quiz? I progressi di questa sessione andranno persi.')){
if(Q&&Q.timer)clearInterval(Q.timer);qStopSpeak();renderDash();showQView('dash');
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
let bh=QARG.map(c=>{const e=argErr[c.id]||0,t=argTot[c.id]||0;const bad=e>Q.maxPerCat;return `<div class="qarg-box${bad?' bad':''}"><span class="qarg-lbl">${c.emoji} ${c.label}</span><span class="qarg-val">${e}<small>/${t}</small></span></div>`;}).join('');
argBox.innerHTML='<div class="qarg-title">Errori per argomento <span>(max 2 per argomento)</span></div><div class="qarg-grid">'+bh+'</div>';
argBox.style.display='block';
}else{argBox.style.display='none';}
const LET=Array.from({length:Math.max(4,(Q&&Q.items[Q.idx]?Q.items[Q.idx].choices.length:4))},(_,i)=>String.fromCharCode(65+i));
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
setTimeout(()=>{const s=document.getElementById('splash');if(s)s.classList.add('hide');},900);
setTimeout(()=>{try{checkPwa();}catch(e){}},100);
setTimeout(()=>{
try{initFB();if(fbOk){syncFromCloud();fbRef.on('value',()=>{});}}catch(e){console.warn('fb',e);}
},1500);
/* tastiera */
document.getElementById('qa').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();checkQ();}});
document.addEventListener('keydown',e=>{
if(e.key==='Escape'){closeAllM();const qa=document.getElementById('quizApp');if(qCurOpen()&&qCurView==='run'){/*stay*/}cm();document.getElementById('sugg').style.display='none';}
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
document.getElementById('sdRunBar').style.width=Math.round(SS.idx/tot*100)+'%';
document.getElementById('sdRunCount').textContent=(SS.idx+1)+'/'+tot;
SS.flipped=false;
var _cc=document.getElementById('sdCard');if(_cc)_cc.classList.remove('flip');
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
const c=sdCur(),cur=studyProg[c.key]||0;
studyProg[c.key]=known?Math.min(5,cur+1):0;
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
try{hap('e');}catch(e){}
}

/* ===== v2b: ricerca-Invio, ripetizione spaziata, storico esami ===== */
function sbKey(e){if(e.key!=='Enter')return;e.preventDefault();var q=(document.getElementById('sb').value||'').toUpperCase().trim();var res=q?routes.filter(function(r){return r.title.includes(q)||r.steps.some(function(s){return s.includes(q);});}):routes;if(res&&res.length)selectRoute(res[0]);}

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
var tok=++_slideTok,t0=performance.now(),dur=380,a=from.lat,b=from.lng,c=to[0],d=to[1];
function step(now){if(tok!==_slideTok)return;var k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3);try{m.setLatLng([a+(c-a)*e,b+(d-b)*e]);}catch(err){return;}if(k<1)requestAnimationFrame(step);}
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
function qReportQ(){if(typeof Q==='undefined'||!Q)return;qtStats.report=qtStats.report||{};var id=Q.items[Q.idx].id;qtStats.report[id]=1;try{qtSave();}catch(e){}hap('e');toast2('⚐ Domanda segnalata, grazie');}
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
