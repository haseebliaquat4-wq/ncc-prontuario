/* ═══════════════════════════════════════════════════════════════
   piazze.js — Le piazze di Milano
   Vista a linea metropolitana generata dai dati, freccia avanti/indietro,
   modalità Cieco, marker sulla mappa posizionati A MANO, aggiunta e
   modifica delle piazze.
   File separato: non appesantisce addon.js né il core.
   ═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ───────── utilità locali (indipendenti dal core) ───────── */
function L(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function S(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){
return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function vibra(){try{if(typeof hap==='function')hap();}catch(e){}}
function avviso(t,ms){try{if(typeof toast2==='function'){toast2(t,ms||2200);return;}}catch(e){}}

/* ───────── i dati: base + tue aggiunte e modifiche ───────── */
function base(){try{return (window.__PIAZZE__||[]).slice();}catch(e){return [];}}
function tue(){return L('pzUser',[]);}            /* piazze aggiunte da te */
function modifiche(){return L('pzEdit',{});}      /* vie cambiate sulle piazze di base */

function tutte(){
var out=[];
var mod=modifiche();
base().forEach(function(p){
var c={id:p.id,n:p.n,t:p.t,v:p.v.slice(),base:true};
if(mod[p.id]){
if(mod[p.id].n)c.n=mod[p.id].n;
if(mod[p.id].v)c.v=mod[p.id].v.slice();
if(mod[p.id].del)c=null;
}
if(c)out.push(c);
});
tue().forEach(function(p){out.push({id:p.id,n:p.n,t:p.t||'piazza',v:(p.v||[]).slice(),base:false});});
out.sort(function(a,b){return a.n.localeCompare(b.n);});
return out;
}
function trova(id){var a=tutte();for(var i=0;i<a.length;i++)if(a[i].id===id)return a[i];return null;}
window.pzTutte=tutte;

/* ───────── statistiche e spirale ───────── */
function stats(){return L('pzStats',{});}
function spirale(){return L('pzSR',{});}
var PASSI=[1,2,4,9,21,45];
function segna(id,giusto){
try{
var sr=spirale();var s=sr[id]||{box:0,due:0,last:0};
s.box=giusto?Math.min(PASSI.length-1,(s.box||0)+1):0;
s.due=Date.now()+PASSI[s.box]*86400000;
s.last=Date.now();
sr[id]=s;S('pzSR',sr);
var st=stats();var x=st[id]||{ok:0,ko:0};
if(giusto)x.ok++;else x.ko++;
st[id]=x;S('pzStats',st);
var log=L('pzDoneLog',{});log[id]=Date.now();S('pzDoneLog',log);
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}
}catch(e){}
}
window.pzScadute=function(){
var sr=spirale(),ora=Date.now(),n=0;
tutte().forEach(function(p){var s=sr[p.id];if(s&&s.due&&s.due<=ora)n++;});
return n;
};

/* ───────── vie che compaiono in più piazze ───────── */
function condivise(){
var c={};
tutte().forEach(function(p){p.v.forEach(function(v){
var k=v.trim().toLowerCase();(c[k]=c[k]||{n:v,p:[]}).p.push(p.n);});});
var out=[];
Object.keys(c).forEach(function(k){if(c[k].p.length>1)out.push(c[k]);});
out.sort(function(a,b){return b.p.length-a.p.length;});
return out;
}
window.pzCondivise=condivise;

/* ═══════════════════════════════════════════════════
   SCHERMATA · elenco delle piazze
   ═══════════════════════════════════════════════════ */
var OV=null, CUR=null, PASSO=0, CIECO=false, FILTRO='';

function chiudi(){
try{
if(OV){OV.remove();OV=null;}
CUR=null;
document.body.classList.remove('pz-aperto');
}catch(e){}
}
window.pzChiudi=chiudi;

function guscio(){
/* se il riquadro è stato staccato dalla pagina lo rimetto:
   altrimenti resta in memoria e la sezione non si riapre più */
if(OV&&OV.parentNode&&document.body.contains(OV)){
document.body.classList.add('pz-aperto');
return OV;
}
if(OV){try{OV.remove();}catch(e){}OV=null;}
var vecchio=document.getElementById('pzOv');
if(vecchio){try{vecchio.remove();}catch(e){}}
OV=document.createElement('div');
OV.id='pzOv';
document.body.appendChild(OV);
document.body.classList.add('pz-aperto');
return OV;
}

window.openPiazze=function(){
try{
var ov=guscio();
CUR=null;
var lista=tutte();
var sr=spirale(),ora=Date.now();
var scadute=lista.filter(function(p){var s=sr[p.id];return s&&s.due&&s.due<=ora;}).length;
var mai=lista.filter(function(p){return !sr[p.id];}).length;

var h='<div class="pz-hd">'
+'<button class="pz-x" onclick="pzChiudi()">\u2715</button>'
+'<div class="pz-ti">Piazze di Milano</div>'
+'<div class="pz-su">'+lista.length+' piazze \u00b7 '+lista.reduce(function(a,p){return a+p.v.length;},0)+' vie</div>'
+'<button class="pz-rnd" onclick="pzRandom()" title="Una piazza a caso">\ud83c\udfb2</button>'
+'</div>';

h+='<div class="pz-body"><div class="pz-in">';
h+='<button class="pz-primario" onclick="pzRandom(1)">\ud83d\uddfa\ufe0f Apri la mappa delle piazze</button>';
h+='<button class="pz-primario pz-sec" onclick="pzScriviCaso()">\u270d\ufe0f Scrivi le vie a memoria</button>';
h+='<div class="pz-tiles">'
+'<button class="pz-tile" onclick="pzRipasso()"><b>'+scadute+'</b><span>da ripassare</span></button>'
+'<button class="pz-tile" onclick="pzNuove()"><b>'+mai+'</b><span>mai viste</span></button>'
+'<button class="pz-tile" onclick="pzCondiviseVista()"><b>'+condivise().length+'</b><span>vie doppie</span></button>'
+'</div>';

h+='<div class="pz-cerca"><input id="pzQ" type="search" placeholder="Cerca piazza o via\u2026" '
+'oninput="pzFiltra(this.value)" value="'+E(FILTRO)+'"></div>';
h+='<div id="pzList" class="pz-list"></div>';
h+='<button class="pz-add" onclick="pzNuovaPiazza()">\uff0b Aggiungi una piazza</button>';
h+='</div></div>';
ov.innerHTML=h;
disegnaElenco();
vibra();
}catch(e){}
};

window.pzFiltra=function(q){FILTRO=q||'';disegnaElenco();};

function disegnaElenco(){
try{
var box=document.getElementById('pzList');if(!box)return;
var q=FILTRO.trim().toLowerCase();
var lista=tutte();
if(q)lista=lista.filter(function(p){
if(p.n.toLowerCase().indexOf(q)>=0)return true;
return p.v.some(function(v){return v.toLowerCase().indexOf(q)>=0;});
});
if(!lista.length){box.innerHTML='<div class="pz-vuoto">Nessuna piazza trovata</div>';return;}
var sr=spirale(),st=stats(),ora=Date.now();
var h='';
lista.forEach(function(p){
var s=sr[p.id],x=st[p.id]||{ok:0,ko:0};
var stato='mai',lab='mai vista';
if(s){
if(s.due&&s.due<=ora){stato='scaduta';lab='da ripassare';}
else{stato='ok';var gg=Math.max(1,Math.round((s.due-ora)/86400000));lab='fra '+gg+'g';}
}
h+='<button class="pz-row pz-'+stato+'" onclick="pzApri(\''+p.id+'\')">'
+'<span class="pz-dot"></span>'
+'<span class="pz-nm"><b>'+E(p.n)+'</b><i>'+p.v.length+' vie \u00b7 '+lab
+(x.ko?(' \u00b7 '+x.ko+' errori'):'')+'</i></span>'
+'<span class="pz-ar">\u203a</span></button>';
});
box.innerHTML=h;
}catch(e){}
}

/* ═══════════════════════════════════════════════════
   SCHERMATA · una piazza, a linea di metropolitana
   ═══════════════════════════════════════════════════ */
window.pzApri=function(id,modo){
try{
var p=trova(id);if(!p)return;
CUR=p;PASSO=0;CIECO=(modo==='c');
var ov=guscio();
ov.innerHTML=''
+'<div class="pz-hd pz-hd2">'
+'<button class="pz-x" onclick="openPiazze()">\u2039</button>'
+'<div class="pz-ti">'+E(p.n)+'</div>'
+'<div class="pz-su">'+p.v.length+' vie</div>'
+'<button class="pz-rnd" onclick="pzRandom()" title="Un\u2019altra a caso">\ud83c\udfb2</button>'
+'<div class="pz-modi">'
+'<button id="pzMs" class="pz-m'+(CIECO?'':' on')+'" onclick="pzModo(false)">Studio</button>'
+'<button id="pzMc" class="pz-m'+(CIECO?' on':'')+'" onclick="pzModo(true)">Cieco</button>'
+'</div></div>'
+'<div class="pz-body pz-linea"><div class="pz-in">'
+'<button class="pz-primario" onclick="pzMappa()">\ud83d\uddfa\ufe0f Vedi sulla mappa</button>'
+'<div id="pzMetro"></div>'
+'<div class="pz-azioni">'
+'<button onclick="pzScrivi(\''+p.id+'\')">\u270d\ufe0f Scrivi le vie</button>'
+'<button onclick="pzVerifica()">\u2713 Mi verifico</button>'
+'<button onclick="pzModifica()">\u270e Modifica</button>'
+'</div></div></div>'
+'<div class="pz-foot">'
+'<button class="pz-nav" onclick="pzVai(-1)">\u25c0</button>'
+'<button class="pz-tutte" onclick="pzTutteVie()">Mostra tutte</button>'
+'<button class="pz-nav pz-next" onclick="pzVai(1)">\u25b6</button>'
+'</div>';
disegnaMetro();
vibra();
}catch(e){}
};

window.pzModo=function(c){
CIECO=!!c;PASSO=0;
var a=document.getElementById('pzMs'),b=document.getElementById('pzMc');
if(a)a.classList.toggle('on',!CIECO);
if(b)b.classList.toggle('on',CIECO);
disegnaMetro();vibra();
};

window.pzVai=function(d){
if(!CUR)return;
PASSO=Math.max(0,Math.min(CUR.v.length,PASSO+d));
disegnaMetro();vibra();
if(PASSO>=CUR.v.length&&d>0)avviso('\u2713 '+CUR.n+' \u00b7 tutte le '+CUR.v.length+' vie',2000);
};
window.pzTutteVie=function(){if(!CUR)return;PASSO=CUR.v.length;disegnaMetro();vibra();};

function disegnaMetro(){
try{
if(!CUR)return;
var box=document.getElementById('pzMetro');if(!box)return;
var co=L('pzCoords',{});
var h='<div class="mx-wrap">';
/* la piazza: la stazione capolinea */
h+='<div class="mx-cap"><span class="mx-big"></span>'
+'<span class="mx-tx"><b>'+E(CUR.n)+'</b>'
+(co[CUR.id]?'<i>\ud83d\udccd posizionata</i>':'<i>nessun marker</i>')+'</span></div>';
/* le vie: le fermate */
CUR.v.forEach(function(v,i){
var visibile=(i<PASSO)||!CIECO&&false;
var mostra=CIECO?(i<PASSO):(i<PASSO||PASSO===0&&false);
if(!CIECO)mostra=(i<PASSO)||PASSO===0?true:(i<PASSO);
/* in Studio: se non hai ancora premuto avanti, si vedono tutte */
if(!CIECO&&PASSO===0)mostra=true;
var attiva=(i===PASSO-1);
var pin=co[CUR.id+'_'+i];
h+='<div class="mx-st'+(attiva?' att':'')+(mostra?'':' nas')+'" onclick="pzTocca('+i+')">'
+'<span class="mx-d"></span>'
+'<span class="mx-n">'+(i+1)+'</span>'
+'<span class="mx-tx">'+(mostra?('<b>'+E(v)+'</b>'):'<b class="mx-q">? ? ?</b>')
+(pin?'<i>\ud83d\udccd</i>':'')+'</span></div>';
});
h+='</div>';
box.innerHTML=h;
/* porta in vista la fermata attiva */
setTimeout(function(){
try{
var a=box.querySelector('.mx-st.att');
if(a&&a.scrollIntoView)a.scrollIntoView({block:'center',behavior:'smooth'});
}catch(e){}
},60);
var n=document.querySelector('.pz-next');
if(n)n.textContent=(PASSO>=CUR.v.length)?'\u2713':'\u25b6';
}catch(e){}
}

window.pzTocca=function(i){
try{
if(!CUR)return;
if(CIECO&&i>=PASSO){PASSO=i+1;disegnaMetro();vibra();return;}
avviso('\ud83d\udccd '+CUR.v[i],1800);
}catch(e){}
};

/* ═══════════════════════════════════════════════════
   VERIFICA · te la giochi a memoria
   ═══════════════════════════════════════════════════ */
window.pzVerifica=function(){
try{
if(!CUR)return;
var p=CUR,viste=[],idx=0;
var ov=guscio();
function passo(){
if(idx>=p.v.length){fine();return;}
ov.innerHTML='<div class="pz-hd pz-hd2"><button class="pz-x" onclick="pzApri(\''+p.id+'\')">\u2715</button>'
+'<div class="pz-ti">'+E(p.n)+'</div><div class="pz-su">Via '+(idx+1)+' di '+p.v.length+'</div></div>'
+'<div class="pz-body pz-ver">'
+'<div class="ver-q">Quale via sbocca qui?</div>'
+'<div class="ver-n">'+(idx+1)+'</div>'
+'<div id="verR" class="ver-r"></div>'
+'</div>'
+'<div class="pz-foot pz-foot2">'
+'<button class="pz-tutte" id="verShow" onclick="pzVerShow()">\ud83d\udc41 Mostra</button>'
+'</div>';
window.pzVerShow=function(){
var _vr=document.getElementById('verR');if(_vr)_vr.innerHTML='<b>'+E(p.v[idx])+'</b>';
var _pf=document.querySelector('.pz-foot2');if(_pf)_pf.innerHTML=
'<button class="pz-no" onclick="pzVerSeg(false)">\u2715 Non la sapevo</button>'
+'<button class="pz-si" onclick="pzVerSeg(true)">\u2713 La sapevo</button>';
vibra();
};
window.pzVerSeg=function(ok){viste.push(!!ok);idx++;vibra();passo();};
}
function fine(){
var giuste=viste.filter(Boolean).length;
var perc=Math.round(giuste/p.v.length*100);
segna(p.id,giuste===p.v.length);
var mancate=p.v.filter(function(v,i){return !viste[i];});
ov.innerHTML='<div class="pz-hd pz-hd2"><button class="pz-x" onclick="openPiazze()">\u2715</button>'
+'<div class="pz-ti">'+E(p.n)+'</div><div class="pz-su">Risultato</div></div>'
+'<div class="pz-body pz-fine">'
+'<div class="fin-n '+(perc>=80?'ok':(perc>=50?'mid':'ko'))+'">'+perc+'%</div>'
+'<div class="fin-s">'+giuste+' su '+p.v.length+' vie</div>'
+(mancate.length?('<div class="fin-t">Ti sono mancate:</div><div class="fin-l">'
+mancate.map(function(v){return '<span>'+E(v)+'</span>';}).join('')+'</div>'):
'<div class="fin-t">\ud83c\udfc6 Tutte giuste — questa piazza la sai</div>')
+'</div>'
+'<div class="pz-azioni"><button onclick="pzApri(\''+p.id+'\')">Rivedi la piazza</button>'
+'<button onclick="openPiazze()">Torna all\u2019elenco</button></div>';
vibra();
}
passo();
}catch(e){}
};

/* ═══════════════════════════════════════════════════
   MAPPA · i marker li posizioni TU, uno alla volta
   ═══════════════════════════════════════════════════ */
var PL=null;   /* {id, idx} in attesa di un click sulla mappa */

window.pzMappa=function(id){
try{
var p=id?trova(id):CUR;
if(!p)return;
apriMappaPiazze(p);
}catch(e){}
};

/* ── schermata mappa: stessa struttura dei percorsi ── */
var PZMAP=null,MAPOV=null;
function apriMappaPiazze(p){
try{
var LF=window.L;
if(!LF||!LF.map){avviso('\u26a0\ufe0f Mappa non disponibile',2400);return;}
if(PANP!==p){PANP=p;FINO=0;}
var o=document.getElementById('pzMapOv');
if(o)o.remove();
o=document.createElement('div');o.id='pzMapOv';o.className='rd';
o.innerHTML='<div class="pzm-top">'
+'<button class="pzm-home" onclick="pzMapChiudi()" title="Torna alle piazze">\u2039</button>'
+'<div class="pzm-selw"><span class="pzm-ic">\ud83d\udd37</span>'
+'<select class="pzm-sel" id="pzMapSel" onchange="pzMapVaiA(this.value)">'
+tutte().map(function(x){
return '<option value="'+x.id+'"'+(x.id===p.id?' selected':'')+'>'+E(x.n)+' \u00b7 '+x.v.length+' vie</option>';
}).join('')
+'</select><span class="pzm-fr">\u25be</span></div>'
+'<button class="pzm-dado" onclick="pzRandom(1)" title="Una piazza a caso">\ud83c\udfb2</button>'
+'</div>'
+'<div class="pzm-tasti">\u2190 \u2192 con le frecce \u00b7 T tutte \u00b7 R un\u2019altra piazza \u00b7 Esc esci</div>'
+'<div class="pzm-seg">'
+'<button id="pzSegS" class="on" onclick="pzMapModo(\'s\')">Studio</button>'
+'<button id="pzSegC" onclick="pzMapModo(\'c\')">Cieco</button>'
+'<button class="pzm-geo" onclick="pzTrovaMarker(\''+p.id+'\')" title="Cerca i marker">\ud83d\udef0</button>'
+'</div>'
+'<div class="pzm-wrap">'
+'<div class="pzm-map"><div id="pzMapEl"></div></div>'
+'<div class="panel pzm-panel">'
+'<div class="phead">'
+'<div class="ptrow"><h2 id="pzMapTit">'+E(p.n)+'</h2>'
+'<button class="pib" onclick="pzMapDaZero()" title="Ricomincia">\u21ba</button>'
+'<button class="pib" onclick="pzMapTutte()" title="Mostra tutte">\u25b6</button></div>'
+'<div class="psub"><span class="ppt" id="pzMapProg">Via 0 di '+p.v.length+'</span>'
+'<span class="pst" id="pzMapStat"></span></div>'
+'<div class="pbw"><div class="pbf" id="pzMapBar" style="width:0%"></div></div>'
+'</div>'
+'<div class="steps" id="pzMapLista"></div>'
+'<div class="pfoot"><div class="brow">'
+'<button class="btn bs" onclick="pzMapPrev()">\u25c0</button>'
+'<button class="btn bw" onclick="pzMapOcchio()" title="Mostra questa via">\ud83d\udc41\ufe0f</button>'
+'<button class="btn bp" onclick="pzMapNext()">\u25b6</button>'
+'</div></div>'
+'</div></div>';
document.body.appendChild(o);
document.body.classList.add('pz-aperto');
MAPOV=o;
PZMAP=LF.map('pzMapEl',{zoomControl:true,attributionControl:true}).setView([45.4642,9.19],14);
try{LF.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{maxZoom:19,maxNativeZoom:19,attribution:'\u00a9 OpenStreetMap'}).addTo(PZMAP);}catch(e){}
PZMAP.on('click',function(ev){
try{
if(!PL||!ev||!ev.latlng)return;
var co=L('pzCoords',{});
var k=(PL.idx<0)?PL.id:(PL.id+'_'+PL.idx);
co[k]={lat:ev.latlng.lat,lon:ev.latlng.lng};
S('pzCoords',co);
avviso('\u2713 '+(PL.idx<0?p.n:p.v[PL.idx])+' posizionata',1600);
PL=null;vibra();
disegnaSuMappa(p);
}catch(e){}
});
setTimeout(function(){try{PZMAP.invalidateSize();}catch(e){}
disegnaSuMappa(p);},220);
try{
var co2=L('pzCoords',{}),ne=0;
p.v.forEach(function(v,i){if(co2[p.id+'_'+i])ne++;});
if(!co2[p.id]&&ne===0&&window.pzTrovaMarker){
setTimeout(function(){try{pzTrovaMarker(p.id,true);}catch(e){}},600);}
}catch(e){}
vibra();
}catch(e){}
}
var MAPMODO='s';
window.pzMapModo=function(m){
try{
MAPMODO=m;
var a=document.getElementById('pzSegS'),b2=document.getElementById('pzSegC');
if(a)a.classList.toggle('on',m==='s');
if(b2)b2.classList.toggle('on',m==='c');
if(PANP)disegnaSuMappa(PANP);
vibra();
}catch(e){}
};
window.pzMapOcchio=function(){
try{
if(!PANP)return;
if(FINO===null)FINO=0;
var i=Math.max(0,FINO-1);
var co=L('pzCoords',{}),c=co[PANP.id+'_'+i];
avviso('\ud83d\udccd '+(i+1)+'. '+PANP.v[i]+(c?'':' \u2014 marker non ancora messo'),2600);
if(c&&PZMAP){try{PZMAP.setView([c.lat,c.lon],16);}catch(e){}}
vibra();
}catch(e){}
};
/* l'elenco a destra, con la stessa faccia dei percorsi */
function listaMappa(p){
try{
var d=document.getElementById('pzMapLista');if(!d)return;
var co=L('pzCoords',{});
var fino=(typeof FINO==='number')?FINO:p.v.length;
var cieco=(MAPMODO==='c');
var h='<button class="step cap'+(PL&&PL.idx<0?' att':'')+'" onclick="pzPos(\''+p.id+'\',-1)">'
+'<span class="sn cap">\u25c9</span><span class="sv">'+E(p.n)+'</span>'
+'<span class="sp">'+(co[p.id]?'\ud83d\udccd':'\ud83d\udccd\u00a0?')+'</span></button>';
p.v.forEach(function(v,i){
var c=co[p.id+'_'+i];
var visto=!cieco||i<fino;
h+='<button class="step'+(i===fino-1?' cur':'')+(PL&&PL.idx===i?' att':'')+(i<fino?' fatta':'')+'" '
+'onclick="pzPos(\''+p.id+'\','+i+')">'
+'<span class="sn">'+(i+1)+'</span>'
+'<span class="sv">'+(visto?E(v):'\u2022 \u2022 \u2022')+'</span>'
+'<span class="sp">'+(c?(c.auto?'\ud83d\udef0':'\ud83d\udccd'):'\ud83d\udccd\u00a0?')+'</span></button>';});
d.innerHTML=h;
var pr=document.getElementById('pzMapProg');
if(pr)pr.textContent='Via '+fino+' di '+p.v.length;
var st=document.getElementById('pzMapStat');
if(st){var messi=p.v.filter(function(v,i){return !!co[p.id+'_'+i];}).length;
st.textContent=messi+'/'+p.v.length+' \ud83d\udccd';}
var ba=document.getElementById('pzMapBar');
if(ba)ba.style.width=Math.round(fino/p.v.length*100)+'%';
var el=d.querySelectorAll('.step')[fino];
if(el&&el.scrollIntoView)try{el.scrollIntoView({block:'nearest',behavior:'smooth'});}catch(e){}
}catch(e){}
}
window.pzMapChiudi=function(){
try{
if(PZMAP){try{PZMAP.remove();}catch(e){}PZMAP=null;}
if(MAPOV){MAPOV.remove();MAPOV=null;}
var o=document.getElementById('pzMapOv');if(o)o.remove();
MK=[];PL=null;
openPiazze();
if(PANP)setTimeout(function(){try{pzApri(PANP.id);}catch(e){}},80);
}catch(e){}
};


window.pzPos=function(id,idx){
try{
PL={id:id,idx:idx};
var p=trova(id);
avviso('\ud83d\udccd Tocca sulla mappa dove si trova '+(idx<0?p.n:p.v[idx]),3000);
document.querySelectorAll('#pzMapLista .step').forEach(function(r,i){
r.classList.toggle('att',i===(idx+1));});
}catch(e){}
};

var MK=[],LN=null;
/* allunga la linea dal centro alla via in mezzo secondo */
function allunga(ln,da,a){
try{
var t0=Date.now(),durata=420;
(function passo(){
try{
var k=Math.min(1,(Date.now()-t0)/durata);
var e=1-Math.pow(1-k,3);   /* parte veloce e rallenta */
ln.setLatLngs([da,[da[0]+(a[0]-da[0])*e,da[1]+(a[1]-da[1])*e]]);
if(k<1)requestAnimationFrame(passo);
}catch(e2){}
})();
}catch(e){}
}
var FINO=null;   /* quante vie sono comparse sulla mappa */
var PANP=null;   /* la piazza aperta sulla mappa */
function pulisciMappa(){
try{
MK.forEach(function(m){try{m.remove();}catch(e){}});MK=[];
if(LN){try{LN.remove();}catch(e){}LN=null;}
}catch(e){}
}
/* disegna il ragno su una mappa qualsiasi */
function disegnaSu(mp,p){
try{
var LF=window.L;if(!LF||!mp)return;
var co=L('pzCoords',{});
var centro=co[p.id]?[co[p.id].lat,co[p.id].lon]:null;
var punti=[],fino=(typeof FINO==='number')?FINO:p.v.length;
if(centro){
var mc=LF.marker(centro,{draggable:true,icon:LF.divIcon({className:'pz-pin pz-pin-cap',
html:'<span>\u25cf</span>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(mp);
try{mc.bindPopup('<b>'+E(p.n)+'</b>');}catch(e){}
mc.on('dragend',function(){try{var q=mc.getLatLng(),cc=L('pzCoords',{});
cc[p.id]={lat:q.lat,lon:q.lng};S('pzCoords',cc);vibra();
avviso('\u2713 '+p.n+' spostata',1500);disegnaSuMappa(p);}catch(e){}});
MK.push(mc);punti.push(centro);
}
p.v.forEach(function(v,i){
var c=co[p.id+'_'+i];
if(!c||i>=fino)return;
var att=(i===fino-1);
if(centro){
var ln=LF.polyline(att?[centro,centro]:[centro,[c.lat,c.lon]],
{color:'#2447D6',weight:att?4.5:3,opacity:att?.95:.62,
dashArray:att?null:'7 6',lineCap:'round',interactive:false}).addTo(mp);
if(att)allunga(ln,centro,[c.lat,c.lon]);
MK.push(ln);
}
var m=LF.marker([c.lat,c.lon],{draggable:true,
icon:LF.divIcon({className:'pz-pin'+(att?' pz-pin-att':'')+(c.auto?' pz-pin-auto':''),
html:'<span>'+(i+1)+'</span>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(mp);
try{m.bindPopup((i+1)+'. '+(MAPMODO==='c'?('Via '+(i+1)):E(v))+(c.auto?'<br><small>posizione automatica: trascinala se \u00e8 fuori posto</small>':''));}catch(e){}
m.on('dragend',function(){try{var q=m.getLatLng(),cc=L('pzCoords',{});
cc[p.id+'_'+i]={lat:q.lat,lon:q.lng};S('pzCoords',cc);vibra();
avviso('\u2713 '+v+' spostata',1500);disegnaSuMappa(p);}catch(e){}});
MK.push(m);punti.push([c.lat,c.lon]);
});
if(punti.length===1){try{mp.setView(punti[0],15);}catch(e){}}
else if(punti.length>1){try{mp.fitBounds(punti,{padding:[50,50],maxZoom:16});}catch(e){}}
try{listaMappa(p);}catch(e){}
}catch(e){}
}

function disegnaSuMappa(p){
try{
pulisciMappa();
if(PZMAP){disegnaSu(PZMAP,p);try{listaMappa(p);}catch(e){}return;}
if(typeof map==='undefined'||!map||typeof L2==='undefined'&&typeof window.L==='undefined')return;
var LF=window.L;if(!LF)return;
var co=L('pzCoords',{});
var punti=[];
if(co[p.id]){
var c=co[p.id];
var m=LF.marker([c.lat,c.lon],{icon:LF.divIcon({className:'pz-pin pz-pin-cap',
html:'<span>\u25c9</span>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(map);
MK.push(m);punti.push([c.lat,c.lon]);
}
var fino=(typeof FINO==='number')?FINO:p.v.length;   /* quante ne mostro */
p.v.forEach(function(v,i){
var c=co[p.id+'_'+i];if(!c)return;
if(i>=fino)return;            /* le successive compaiono avanzando */
var att=(i===fino-1);
var m=LF.marker([c.lat,c.lon],{draggable:true,
icon:LF.divIcon({className:'pz-pin'+(att?' pz-pin-att':'')+(c.auto?' pz-pin-auto':''),
html:'<span>'+(i+1)+'</span>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(map);
try{m.bindPopup((i+1)+'. '+v+(c.auto?'<br><small>posizione automatica: trascinala se \u00e8 fuori posto</small>':''));}catch(e){}
m.on('dragend',function(){try{
var q=m.getLatLng(),cc=L('pzCoords',{});
cc[p.id+'_'+i]={lat:q.lat,lon:q.lng};   /* spostata a mano: non pi\u00f9 automatica */
S('pzCoords',cc);vibra();
avviso('\u2713 '+v+' spostata',1500);
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}
disegnaSuMappa(p);
}catch(e){}});
MK.push(m);punti.push([c.lat,c.lon]);
});
/* le linee: dalla piazza a ogni via, come i raggi di una stella */
if(co[p.id]&&punti.length>1){
var centro=[co[p.id].lat,co[p.id].lon];
var raggi=[];
var f2=(typeof FINO==='number')?FINO:p.v.length;
p.v.forEach(function(v,i){
var c=co[p.id+'_'+i];if(!c||i>=f2)return;
var att=(i===f2-1);
var ln=LF.polyline(att?[centro,centro]:[centro,[c.lat,c.lon]],
{color:att?'#2447D6':'#8892a4',weight:att?4:2.5,opacity:att?.9:.45,
dashArray:att?null:'6 5',interactive:false}).addTo(map);
if(att)allunga(ln,centro,[c.lat,c.lon]);
raggi.push(ln);
});
MK=MK.concat(raggi);
}
if(punti.length){
try{map.fitBounds(punti,{padding:[60,60],maxZoom:16});}catch(e){}
}
}catch(e){}
}

/* ═══════════════════════════════════════════════════
   AGGIUNGERE E MODIFICARE — libertà totale
   ═══════════════════════════════════════════════════ */
window.pzNuovaPiazza=function(){
try{
var n=prompt('Nome della piazza\n(es. PIAZZA NAPOLI)');
if(!n||!n.trim())return;
var vie=prompt('Le vie che vi sboccano, una per riga\noppure separate da virgola');
if(vie===null)return;
var v=vie.split(/[\n,]/).map(function(x){return x.trim();}).filter(Boolean);
var u=tue();
var nome=n.trim().toUpperCase();
var t=nome.indexOf('LARGO')===0?'largo':(nome.indexOf('PIAZZALE')===0?'piazzale':'piazza');
u.push({id:'pzU'+Date.now(),n:nome,t:t,v:v});
S('pzUser',u);
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}
avviso('\u2713 '+nome+' aggiunta con '+v.length+' vie',2400);
openPiazze();
}catch(e){}
};

window.pzModifica=function(){
try{
if(!CUR)return;
var p=CUR;
var vie=prompt('Le vie di '+p.n+'\nuna per riga (puoi aggiungere, togliere, riordinare)',p.v.join('\n'));
if(vie===null)return;
var v=vie.split(/[\n,]/).map(function(x){return x.trim();}).filter(Boolean);
if(p.base){
var m=modifiche();m[p.id]=m[p.id]||{};m[p.id].v=v;S('pzEdit',m);
}else{
var u=tue();u.forEach(function(x){if(x.id===p.id)x.v=v;});S('pzUser',u);
}
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}
avviso('\u2713 '+p.n+': '+v.length+' vie',2000);
pzApri(p.id);
}catch(e){}
};

window.pzElimina=function(id){
try{
var p=trova(id);if(!p)return;
if(!confirm('Eliminare '+p.n+'?'))return;
if(p.base){var m=modifiche();m[id]=m[id]||{};m[id].del=true;S('pzEdit',m);}
else{S('pzUser',tue().filter(function(x){return x.id!==id;}));}
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}
openPiazze();
}catch(e){}
};

/* ═══════════════════════════════════════════════════
   SESSIONI RAPIDE
   ═══════════════════════════════════════════════════ */
window.pzRipasso=function(){
var sr=spirale(),ora=Date.now();
var l=tutte().filter(function(p){var s=sr[p.id];return s&&s.due&&s.due<=ora;});
if(!l.length){avviso('\u2728 Nessuna piazza da ripassare oggi',2400);return;}
pzApri(l[0].id,'c');
};
window.pzNuove=function(){
var sr=spirale();
var l=tutte().filter(function(p){return !sr[p.id];});
if(!l.length){avviso('\ud83c\udfc6 Le hai viste tutte',2400);return;}
pzApri(l[0].id);
};
window.pzCondiviseVista=function(){
try{
var c=condivise();
var ov=guscio();
var h='<div class="pz-hd pz-hd2"><button class="pz-x" onclick="openPiazze()">\u2039</button>'
+'<div class="pz-ti">Vie doppie</div><div class="pz-su">'+c.length+' vie sboccano in pi\u00f9 piazze</div></div>'
+'<div class="pz-body"><div class="pz-nota">Queste valgono doppio: sapendole, copri pi\u00f9 piazze insieme.</div><div class="pz-list">';
c.forEach(function(x){
h+='<div class="pz-row pz-cond"><span class="pz-dot"></span>'
+'<span class="pz-nm"><b>'+E(x.n)+'</b><i>'+x.p.map(E).join(' \u00b7 ')+'</i></span>'
+'<span class="pz-ar">'+x.p.length+'</span></div>';
});
h+='</div></div>';
ov.innerHTML=h;
}catch(e){}
};

/* ═══════════════════════════════════════════════════
   AGGANCI: un pulsante in Topografia e uno in Home
   ═══════════════════════════════════════════════════ */
function innesta(){
try{
if(!document.getElementById('pzBtnTopo')){
var host=document.querySelector('.seg-wrap');
if(host&&host.parentNode){
var b=document.createElement('button');
b.id='pzBtnTopo';b.type='button';b.textContent='\ud83d\udd37 Piazze';
b.onclick=function(ev){try{ev.stopPropagation();}catch(e){}openPiazze();};
host.parentNode.insertBefore(b,host.nextSibling);
}
}
/* la card in home la mette addon.js: una sola, non due */
}catch(e){}
}
/* [FIX] la home si costruisce a tempi variabili: si riprova finché
   il contenitore non esiste, poi ci si ferma */
var tent=0;
var tInn=setInterval(function(){
try{
innesta();
if(document.getElementById('pzCard')||++tent>14)clearInterval(tInn);
}catch(e){}
},1100);
setTimeout(innesta,1600);
try{
var _gt=goTopografia;
goTopografia=function(){_gt.apply(this,arguments);setTimeout(innesta,220);};
}catch(e){}
try{
var _gh=goHome;
goHome=function(){_gh.apply(this,arguments);setTimeout(innesta,320);setTimeout(innesta,900);};
}catch(e){}
try{
var _lh=window.layoutHome;
if(typeof _lh==='function')window.layoutHome=function(){
_lh.apply(this,arguments);setTimeout(innesta,240);};
}catch(e){}

/* le chiavi delle piazze entrano nella sincronizzazione */
try{
var _gp=getPrefs;
getPrefs=function(){
var p={};
try{p=_gp.apply(this,arguments)||{};}catch(e){}
try{
['pzUser','pzEdit','pzCoords','pzSR','pzStats','pzDoneLog'].forEach(function(k){
var v=L(k,null);
if(v!==null&&v!==undefined&&(typeof v!=='object'||Object.keys(v).length))p[k]=v;
});
}catch(e){}
return p;
};
}catch(e){}
/* e vengono fuse al ritorno dal cloud */
try{
var _sfc=window.syncFromCloud;
window.syncFromCloud=function(){
try{_sfc.apply(this,arguments);}catch(e){}
setTimeout(function(){
try{
if(typeof fbRef==='undefined'||!fbRef)return;
fbRef.child('prefs').once('value',function(sn){
try{
var pr=sn.val()||{};
/* oggetti: unione, mai perdere nulla */
['pzEdit','pzCoords','pzSR','pzStats','pzDoneLog'].forEach(function(k){
var r=pr[k];if(!r||typeof r!=='object')return;
var l=L(k,{})||{};
Object.keys(r).forEach(function(id){
if(l[id]===undefined)l[id]=r[id];
else if(k==='pzSR'&&r[id]&&l[id]&&(r[id].last||0)>(l[id].last||0))l[id]=r[id];
});
S(k,l);
});
/* piazze aggiunte: unione per identificativo */
var ru=pr.pzUser;
if(Array.isArray(ru)){
var lu=tue(),visti={};
lu.forEach(function(x){visti[x.id]=1;});
ru.forEach(function(x){if(x&&x.id&&!visti[x.id])lu.push(x);});
S('pzUser',lu);
}
}catch(e){}
},function(){});
}catch(e){}
},1200);
};
}catch(e){}

/* ═══════════════════════════════════════════════════
   MAPPA: le vie compaiono una alla volta
   ═══════════════════════════════════════════════════ */
function agg(){
try{
if(!PANP)return;
disegnaSuMappa(PANP);
}catch(e){}
}
window.pzMapNext=function(){
try{
if(!PANP)return;
if(FINO===null)FINO=PANP.v.length;
FINO=Math.min(PANP.v.length,FINO+1);
agg();vibra();
}catch(e){}
};
window.pzMapPrev=function(){
try{
if(!PANP)return;
if(FINO===null)FINO=PANP.v.length;
FINO=Math.max(0,FINO-1);
agg();vibra();
}catch(e){}
};
window.pzMapTutte=function(){
try{if(!PANP)return;FINO=PANP.v.length;agg();vibra();}catch(e){}
};
window.pzMapDaZero=function(){
try{if(!PANP)return;FINO=0;agg();vibra();}catch(e){}
};

/* ═══════════════════════════════════════════════════
   TROVA I MARKER — posizioni reali da OpenStreetMap
   Non invento coordinate: ogni punto arriva dalla banca dati
   pubblica di OSM. Le vie le cerco NEI PRESSI della piazza,
   così prende il tratto che ci sbocca e non un omonimo lontano.
   Ogni punto messo dalla macchina resta segnato "auto": ha il
   bordo tratteggiato e lo puoi trascinare per correggerlo.
   ═══════════════════════════════════════════════════ */
var GEO=null;
var PAUSA=1150;   /* OpenStreetMap chiede una richiesta al secondo */

function indirizzo(q,box){
var u='https://nominatim.openstreetmap.org/search?format=json&limit=1'
+'&countrycodes=it&accept-language=it&q='+encodeURIComponent(q);
if(box)u+='&viewbox='+box+'&bounded=1';
return u;
}
function cerca(q,box){
return fetch(indirizzo(q,box))
.then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
.then(function(j){
if(!j||!j.length)return null;
return {lat:parseFloat(j[0].lat),lon:parseFloat(j[0].lon)};
});
}
function lontananza(a,b){
var dx=(a.lat-b.lat)*111,dy=(a.lon-b.lon)*78;
return Math.sqrt(dx*dx+dy*dy);
}
function coda(piazze){
var co=L('pzCoords',{}),c=[];
piazze.forEach(function(p){
if(!co[p.id])c.push({p:p,tipo:'c'});
p.v.forEach(function(v,i){
if(!co[p.id+'_'+i])c.push({p:p,tipo:'v',i:i,v:v});
});
});
return c;
}

window.pzTrovaMarker=function(soloQuesta,silenzioso){
try{
if(GEO){if(!silenzioso)avviso('\u23f3 Sto gi\u00e0 cercando\u2026',2000);return;}
var tutte=window.pzTutte?window.pzTutte():[];
if(!tutte.length){avviso('\u26a0\ufe0f Nessuna piazza',2200);return;}
var scelte=soloQuesta?tutte.filter(function(x){return x.id===soloQuesta;}):tutte;
var c=coda(scelte);
if(!c.length){avviso('\u2705 I marker ci sono gi\u00e0 tutti',2600);return;}
var sec=Math.ceil(c.length*PAUSA/1000);
var mi=Math.floor(sec/60),se=sec%60;
var tempo=mi?(mi+' minuti'+(se?' e '+se+' secondi':'')):(se+' secondi');
if(!silenzioso&&!confirm('Cerco '+c.length+' punti su OpenStreetMap.\n\n'
+'Ci vogliono circa '+tempo+': faccio una richiesta al secondo, '
+'come chiedono loro.\n\n'
+'Puoi fermarti quando vuoi, quello trovato resta salvato.\n'
+'Serve la connessione a internet.\n\nProcedo?'))return;
GEO={c:c,i:0,ok:0,ko:0,stop:false,rete:false,silenzioso:!!silenzioso};
pannello();passo();
}catch(e){}
};
window.pzFermaMarker=function(){if(GEO)GEO.stop=true;};

function pannello(){
try{
var d=document.getElementById('pzGeoP');
if(!d){d=document.createElement('div');d.id='pzGeoP';document.body.appendChild(d);}
var perc=GEO?Math.round(GEO.i/GEO.c.length*100):0;
var a=GEO&&GEO.c[GEO.i];
d.innerHTML='<div class="pzg-card">'
+'<div class="pzg-t">\ud83d\udef0 Cerco i marker su OpenStreetMap</div>'
+'<div class="pzg-bar"><i style="width:'+perc+'%"></i></div>'
+'<div class="pzg-n">'+(GEO?GEO.i:0)+' di '+(GEO?GEO.c.length:0)+' \u00b7 '+perc+'%</div>'
+'<div class="pzg-q">'+(a?E(a.tipo==='c'?a.p.n:a.v):'\u2014')+'</div>'
+'<div class="pzg-s"><b>'+(GEO?GEO.ok:0)+'</b> trovati \u00b7 <b>'+(GEO?GEO.ko:0)+'</b> non trovati</div>'
+'<button class="pzg-x" onclick="pzFermaMarker()">Ferma</button>'
+'</div>';
}catch(e){}
}

function passo(){
try{
if(!GEO)return;
if(GEO.stop||GEO.i>=GEO.c.length){fine();return;}
var a=GEO.c[GEO.i];
pannello();
var co=L('pzCoords',{}),pr;
if(a.tipo==='c'){
pr=cerca(a.p.n+', Milano, Italia',null).then(function(r){
if(r){var c2=L('pzCoords',{});c2[a.p.id]={lat:r.lat,lon:r.lon,auto:1};S('pzCoords',c2);GEO.ok++;}
else GEO.ko++;
});
}else{
var c=co[a.p.id];
if(!c){GEO.ko++;pr=Promise.resolve();}
else{
var dla=0.011,dlo=0.015;   /* riquadro di circa 1,2 km attorno alla piazza */
var box=(c.lon-dlo)+','+(c.lat+dla)+','+(c.lon+dlo)+','+(c.lat-dla);
pr=cerca(a.v+', Milano',box).then(function(r){
if(r){var c2=L('pzCoords',{});c2[a.p.id+'_'+a.i]={lat:r.lat,lon:r.lon,auto:1};S('pzCoords',c2);GEO.ok++;return;}
/* se lì non c'è, cerco in tutta Milano ma accetto solo se è vicina */
return cerca(a.v+', Milano, Italia',null).then(function(r2){
if(r2&&lontananza(r2,c)<=2.5){
var c3=L('pzCoords',{});c3[a.p.id+'_'+a.i]={lat:r2.lat,lon:r2.lon,auto:1};S('pzCoords',c3);GEO.ok++;
}else GEO.ko++;
});
});
}
}
pr.catch(function(){
GEO.ko++;
if(GEO.ok===0&&GEO.i>=2){GEO.stop=true;GEO.rete=true;}
}).then(function(){
GEO.i++;
if(GEO.i%10===0){try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}}
try{if(typeof PANP!=='undefined'&&PANP)disegnaSuMappa(PANP);}catch(e){}
setTimeout(passo,PAUSA);
});
}catch(e){fine();}
}

function fine(){
try{
var g=GEO;GEO=null;
var d=document.getElementById('pzGeoP');if(d)d.remove();
if(!g)return;
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}
try{if(typeof PANP!=='undefined'&&PANP)disegnaSuMappa(PANP);}catch(e){}
if(g.rete){alert('\u26a0\ufe0f Non riesco a raggiungere OpenStreetMap.\n\n'
+'Controlla la connessione e riprova: quello gi\u00e0 trovato resta salvato.');return;}
if(g.silenzioso){
avviso('\ud83d\udccd '+g.ok+' marker trovati \u00b7 premi \u25b6 per vederli uno a uno',3400);
return;}
var m='\u2705 Trovati '+g.ok+' marker su '+g.c.length+'.';
if(g.ko)m+='\n\u26a0\ufe0f '+g.ko+' non trovati: mettili a mano dalla mappa.';
m+='\n\nI marker automatici hanno il bordo tratteggiato.\n'
+'Controllali e trascinali se sono fuori posto.';
alert(m);
}catch(e){}
}

})();
/* ═══════════════════════════════════════════════════
   LA PIAZZA DEL GIORNO — entra nel piano di oggi
   Sceglie a caso fra quelle in scadenza, poi fra le mai viste.
   Non ripropone quella di ieri.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
function L(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function scadute(){
try{
var sr=L('pzSR',{}),ora=Date.now();
return (window.pzTutte?pzTutte():[]).filter(function(p){
var c=sr[p.id];return c&&c.due&&c.due<=ora;});
}catch(e){return [];}
}
function maiViste(){
try{
var st=L('pzStats',{});
return (window.pzTutte?pzTutte():[]).filter(function(p){return !st[p.id];});
}catch(e){return [];}
}
function pesca(lista){
try{
if(!lista.length)return null;
if(window.nccPesca){
var s=window.nccPesca(lista);
if(s)return s;
}
return lista[Math.floor(Math.random()*lista.length)];
}catch(e){return lista[0];}
}
window.pzDelGiorno=function(){
try{
var s=scadute();
if(s.length)return {p:pesca(s),tipo:'ripasso',n:s.length};
var m=maiViste();
if(m.length)return {p:pesca(m),tipo:'nuova',n:m.length};
return null;
}catch(e){return null;}
};
/* aggancio al piano di oggi */
try{
var _ctPZ=coachTasks;
coachTasks=function(){
var t=_ctPZ.apply(this,arguments)||[];
try{
var g=window.pzDelGiorno&&pzDelGiorno();
if(!g||!g.p)return t;
var p=g.p;
if(g.tipo==='ripasso'){
t.push({ic:'\ud83d\udccd',
tx:'Piazza da ripassare: '+(p.n.length>22?p.n.slice(0,20)+'\u2026':p.n),
sub:p.v.length+' vie'+(g.n>1?(' \u00b7 ne hai '+g.n+' in scadenza'):'')+' \u2014 in Cieco',
p:1.2,
fn:function(){try{openPiazze();setTimeout(function(){pzApri(p.id);
setTimeout(function(){try{pzModo('c');}catch(e){}},260);},240);}catch(e){}}});
}else{
t.push({ic:'\ud83d\udccd',
tx:'Piazza nuova: '+(p.n.length>22?p.n.slice(0,20)+'\u2026':p.n),
sub:p.v.length+' vie da imparare \u00b7 '+g.n+' piazze ancora mai viste',
p:2.6,
fn:function(){try{openPiazze();setTimeout(function(){pzApri(p.id);},240);}catch(e){}}});
}
}catch(e){}
return t;
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   🎲 UNA PIAZZA A CASO
   Pesca fra quelle in scadenza, poi fra le mai viste,
   poi fra tutte. Non ripesca le ultime uscite.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
function L(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function pesca(a){
try{
if(!a||!a.length)return null;
if(window.nccPesca){var s=window.nccPesca(a);if(s)return s;}
return a[Math.floor(Math.random()*a.length)];
}catch(e){return a[0];}
}
window.pzPescaPiazza=function(){
try{
var tutte=window.pzTutte?pzTutte():[];
if(!tutte.length)return null;
var sr=L('pzSR',{}),st=L('pzStats',{}),ora=Date.now();
var scad=tutte.filter(function(p){var c=sr[p.id];return c&&c.due&&c.due<=ora;});
if(scad.length)return pesca(scad);
var mai=tutte.filter(function(p){return !st[p.id];});
if(mai.length)return pesca(mai);
return pesca(tutte);
}catch(e){return null;}
};
/* sullaMappa: apre direttamente la schermata mappa */
window.pzRandom=function(sullaMappa){
try{
var p=pzPescaPiazza();
if(!p){if(typeof toast2==='function')toast2('\u26a0\ufe0f Nessuna piazza',2200);return;}
if(sullaMappa){
try{if(typeof pzMapChiudi==='function'&&document.getElementById('pzMapOv')){
var o=document.getElementById('pzMapOv');o.remove();}}catch(e){}
pzMappa(p.id);
}else{
openPiazze();
setTimeout(function(){try{pzApri(p.id);}catch(e){}},120);
}
try{if(typeof hap==='function')hap();}catch(e){}
}catch(e){}
};
})();

/* ═══════════════════════════════════════════════════
   TASTIERA E TENDINA sulla mappa delle piazze
   ← → avanti e indietro fra le vie
   ↑ ↓ mostra tutte / richiudi · Esc esce
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
window.pzMapVaiA=function(id){
try{
if(!id)return;
if(typeof pzMappa==='function')pzMappa(id);
}catch(e){}
};
function tasti(ev){
try{
if(!document.getElementById('pzMapOv'))return;
var t=ev.target;
if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'))return;
var k=ev.key;
if(k==='ArrowRight'||k==='ArrowDown'){ev.preventDefault();if(window.pzMapNext)pzMapNext();}
else if(k==='ArrowLeft'||k==='ArrowUp'){ev.preventDefault();if(window.pzMapPrev)pzMapPrev();}
else if(k===' '||k==='Enter'){ev.preventDefault();if(window.pzMapNext)pzMapNext();}
else if(k==='Escape'){ev.preventDefault();if(window.pzMapChiudi)pzMapChiudi();}
else if(k==='t'||k==='T'){ev.preventDefault();if(window.pzMapTutte)pzMapTutte();}
else if(k==='r'||k==='R'){ev.preventDefault();if(window.pzRandom)pzRandom(1);}
}catch(e){}
}
try{document.addEventListener('keydown',tasti,true);}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   ✍️ SCRIVI LE VIE
   Ti do la piazza e la mappa, tu scrivi le vie una a una.
   Gli errori di battitura non contano: conta che sia quella via.
   Finisci solo quando le hai scritte tutte.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
function L(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function S(k,v){try{localStorage.setItem(k,JSON.stringify(v));
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}}catch(e){}}
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){
return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function vibra(){try{if(typeof hap==='function')hap();}catch(e){}}

/* ── confronto tollerante agli errori di battitura ── */
function norm(s){
return String(s||'').toLowerCase()
.replace(/[\u00e0\u00e1\u00e2\u00e4]/g,'a').replace(/[\u00e8\u00e9\u00ea\u00eb]/g,'e')
.replace(/[\u00ec\u00ed\u00ee\u00ef]/g,'i').replace(/[\u00f2\u00f3\u00f4\u00f6]/g,'o')
.replace(/[\u00f9\u00fa\u00fb\u00fc]/g,'u').replace(/\u00e7/g,'c')
.replace(/[\u2018\u2019'`]/g,' ')
.replace(/\b(via|viale|v\.le|vle|corso|c\.so|cso|piazza|p\.za|pza|piazzale|p\.le|ple|largo|lgo|vicolo|bastioni|foro|ripa|alzaia|galleria|strada|passaggio|piazzetta)\b/g,' ')
.replace(/\b(san|santa|santo|s\.)\b/g,'s ')
.replace(/[^a-z0-9 ]/g,' ')
.replace(/\s+/g,' ').trim();
}
function dist(a,b){
if(a===b)return 0;
var m=a.length,n=b.length;
if(!m)return n; if(!n)return m;
if(Math.abs(m-n)>6)return 99;
var pre=new Array(n+1),cur=new Array(n+1),i,j;
for(j=0;j<=n;j++)pre[j]=j;
for(i=1;i<=m;i++){
cur[0]=i;var min=i;
for(j=1;j<=n;j++){
var c=(a.charCodeAt(i-1)===b.charCodeAt(j-1))?0:1;
cur[j]=Math.min(pre[j]+1,cur[j-1]+1,pre[j-1]+c);
if(i>1&&j>1&&a.charCodeAt(i-1)===b.charCodeAt(j-2)&&a.charCodeAt(i-2)===b.charCodeAt(j-1))
cur[j]=Math.min(cur[j],pre[j-1]);
if(cur[j]<min)min=cur[j];
}
if(min>6)return 99;
var t=pre;pre=cur;cur=t;
}
return pre[n];
}
function soglia(len){
if(len<=4)return 1;
if(len<=8)return 2;
if(len<=13)return 3;
return 4;
}
function confronta(scritto,via){
var a=norm(scritto),b=norm(via);
if(!a)return null;
if(a===b)return {d:0,modo:'esatto'};
var d=dist(a,b);
if(d<=soglia(b.length))return {d:d,modo:'quasi'};
var pb=b.split(' ').filter(Boolean),pa=a.split(' ').filter(Boolean);
if(pa.length&&pa.length<=pb.length){
var usate={},tutte=true,somma=0;
pa.forEach(function(w){
var best=99,k=-1;
pb.forEach(function(v,i){
if(usate[i])return;
var dd=dist(w,v);
if(dd<best){best=dd;k=i;}
});
if(k>=0&&best<=soglia(pb[k].length)){usate[k]=1;somma+=best;}
else tutte=false;
});
if(tutte&&pa.join('').length>=4)return {d:somma+1,modo:'parziale'};
}
return null;
}
window.pzConfronta=confronta;

var SC=null,SCMAP=null;

window.pzScrivi=function(id){
try{
var p=id?(window.pzTutte?pzTutte().filter(function(x){return x.id===id;})[0]:null):null;
if(!p&&window.pzCorrenteP)p=pzCorrenteP();
if(!p){var t=window.pzTutte?pzTutte():[];p=t[0];}
if(!p)return;
SC={p:p,trovate:{},errori:0,t0:Date.now(),aiuti:0};
disegna();
setTimeout(function(){var i=document.getElementById('scIn');if(i)i.focus();},350);
vibra();
}catch(e){}
};
window.pzScriviCaso=function(){
try{
var p=(window.pzPescaPiazza?pzPescaPiazza():null);
if(p)pzScrivi(p.id);
}catch(e){}
};
window.pzScriviChiudi=function(){
try{
if(SCMAP){try{SCMAP.remove();}catch(e){}SCMAP=null;}
var o=document.getElementById('scOv');if(o)o.remove();
SC=null;
if(window.openPiazze)openPiazze();
}catch(e){}
};

function disegna(){
try{
var p=SC.p,n=p.v.length,fatte=Object.keys(SC.trovate).length;
var o=document.getElementById('scOv');
if(!o){o=document.createElement('div');o.id='scOv';o.className='rd';document.body.appendChild(o);}
var h='<div class="sc-hd">'
+'<button class="sc-x" onclick="pzScriviChiudi()">\u2039</button>'
+'<div class="sc-ti">'+E(p.n)+'</div>'
+'<div class="sc-su">Scrivi le '+n+' vie che ci sboccano</div>'
+'<button class="sc-r" onclick="pzScriviCaso()" title="Un\u2019altra piazza">\ud83c\udfb2</button>'
+'</div>'
+'<div class="sc-bar"><i style="width:'+Math.round(fatte/n*100)+'%"></i></div>'
+'<div class="sc-wrap">'
+'<div class="sc-mappa"><div id="scMapEl"></div>'
+'<div class="sc-badge">'+fatte+' di '+n+'</div></div>'
+'<div class="sc-lato">'
+'<div class="sc-slots" id="scSlots"></div>'
+'</div></div>'
+'<div class="sc-foot">'
+'<input id="scIn" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" '
+'spellcheck="false" placeholder="Scrivi una via e premi Invio\u2026">'
+'<button class="sc-ok" onclick="pzScriviInvia()">\u2713</button>'
+'<button class="sc-aiuto" onclick="pzScriviAiuto()" title="Suggerimento">\ud83d\udca1</button>'
+'</div>';
o.innerHTML=h;
slots();
var i=document.getElementById('scIn');
if(i){
i.onkeydown=function(ev){
if(ev.key==='Enter'){ev.preventDefault();pzScriviInvia();}
ev.stopPropagation();
};
}
mappa();
}catch(e){}
}

function slots(){
try{
var d=document.getElementById('scSlots');if(!d)return;
var p=SC.p,h='';
p.v.forEach(function(v,i){
var t=SC.trovate[i];
h+='<div class="sc-slot'+(t?' ok':'')+'">'
+'<span class="sc-n">'+(i+1)+'</span>'
+'<span class="sc-v">'+(t?E(v):'\u2014')+'</span>'
+(t&&t.modo!=='esatto'?'<span class="sc-q" title="scritta con qualche errore">~</span>':'')
+(t&&t.aiuto?'<span class="sc-h">\ud83d\udca1</span>':'')
+'</div>';
});
d.innerHTML=h;
}catch(e){}
}

function mappa(){
try{
var LF=window.L;if(!LF||!LF.map)return;
var co=L('pzCoords',{}),p=SC.p;
var c=co[p.id];
var el=document.getElementById('scMapEl');if(!el)return;
if(SCMAP){try{SCMAP.remove();}catch(e){}SCMAP=null;}
SCMAP=LF.map('scMapEl',{zoomControl:false,attributionControl:true,
dragging:true,scrollWheelZoom:false});
try{LF.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{maxZoom:19,maxNativeZoom:19,attribution:'\u00a9 OpenStreetMap'}).addTo(SCMAP);}catch(e){}
if(c){
SCMAP.setView([c.lat,c.lon],15);
try{LF.marker([c.lat,c.lon],{icon:LF.divIcon({className:'pz-pin pz-pin-cap',
html:'<span>\u25cf</span>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(SCMAP);}catch(e){}
/* le vie già trovate compaiono sulla mappa */
var punti=[[c.lat,c.lon]];
p.v.forEach(function(v,i){
if(!SC.trovate[i])return;
var k=co[p.id+'_'+i];if(!k)return;
try{
LF.polyline([[c.lat,c.lon],[k.lat,k.lon]],{color:'#0E9F6E',weight:3,
opacity:.7,dashArray:'7 6',interactive:false}).addTo(SCMAP);
LF.marker([k.lat,k.lon],{icon:LF.divIcon({className:'pz-pin pz-pin-ok',
html:'<span>'+(i+1)+'</span>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(SCMAP);
punti.push([k.lat,k.lon]);
}catch(e){}
});
if(punti.length>1){try{SCMAP.fitBounds(punti,{padding:[40,40],maxZoom:16});}catch(e){}}
}else{
SCMAP.setView([45.4642,9.19],13);
}
setTimeout(function(){try{SCMAP.invalidateSize();}catch(e){}},200);
}catch(e){}
}

window.pzScriviInvia=function(){
try{
if(!SC)return;
var i=document.getElementById('scIn');if(!i)return;
var testo=i.value.trim();
if(!testo)return;
var p=SC.p,best=null,bi=-1;
p.v.forEach(function(v,k){
if(SC.trovate[k])return;
var r=confronta(testo,v);
if(r&&(!best||r.d<best.d)){best=r;bi=k;}
});
if(best){
SC.trovate[bi]={modo:best.modo};
i.value='';
esito(true,(best.modo==='esatto')?('\u2713 '+p.v[bi]):('\u2713 '+p.v[bi]+' \u2014 si scrive cos\u00ec'));
aggiorna();
if(Object.keys(SC.trovate).length>=p.v.length)setTimeout(fine,700);
}else{
/* l'ho già scritta? */
var gia=-1;
p.v.forEach(function(v,k){if(SC.trovate[k]&&confronta(testo,v))gia=k;});
if(gia>=0){esito(null,'gi\u00e0 scritta: '+p.v[gia]);i.value='';return;}
SC.errori++;
esito(false,'\u2715 non \u00e8 una via di questa piazza');
i.select();
}
vibra();
}catch(e){}
};

window.pzScriviAiuto=function(){
try{
if(!SC)return;
var p=SC.p,liberi=[];
p.v.forEach(function(v,i){if(!SC.trovate[i])liberi.push(i);});
if(!liberi.length)return;
var k=liberi[Math.floor(Math.random()*liberi.length)];
var v=p.v[k];
var pezzo=v.replace(/^(Via|Viale|Corso|Piazza|Piazzale|Largo|Galleria|Piazzetta)\s+/i,'');
var iniz=pezzo.slice(0,Math.max(2,Math.ceil(pezzo.length*0.35)));
SC.aiuti++;
esito(null,'\ud83d\udca1 una che manca inizia per \u00ab'+iniz+'\u2026\u00bb');
var i2=document.getElementById('scIn');if(i2)i2.focus();
vibra();
}catch(e){}
};

function esito(buono,testo){
try{
var d=document.getElementById('scEsito');
if(!d){d=document.createElement('div');d.id='scEsito';
var o=document.getElementById('scOv');if(o)o.appendChild(d);}
d.className='sc-esito '+(buono===true?'ok':(buono===false?'ko':'info'));
d.textContent=testo;
d.style.opacity='1';
clearTimeout(d.__t);
d.__t=setTimeout(function(){d.style.opacity='0';},2200);
}catch(e){}
}
function aggiorna(){
try{
slots();mappa();
var p=SC.p,fatte=Object.keys(SC.trovate).length;
var b=document.querySelector('#scOv .sc-bar i');
if(b)b.style.width=Math.round(fatte/p.v.length*100)+'%';
var g=document.querySelector('#scOv .sc-badge');
if(g)g.textContent=fatte+' di '+p.v.length;
}catch(e){}
}

function fine(){
try{
var p=SC.p,n=p.v.length;
var sec=Math.round((Date.now()-SC.t0)/1000);
var mm=Math.floor(sec/60),ss=sec%60;
var esatte=0,quasi=0;
Object.keys(SC.trovate).forEach(function(k){
if(SC.trovate[k].modo==='esatto')esatte++;else quasi++;});
/* entra nella spirale come le altre modalità */
try{
var sr=L('pzSR',{}),st=L('pzStats',{});
var buono=(SC.errori<=2&&SC.aiuti===0);
var c=sr[p.id]||{box:0};
c.box=buono?Math.min(5,(c.box||0)+1):Math.max(0,(c.box||0)-1);
c.due=Date.now()+[1,2,4,9,21,45][c.box]*86400000;c.last=Date.now();
sr[p.id]=c;S('pzSR',sr);
var x=st[p.id]||{ok:0,ko:0};
x.ok=(x.ok||0)+n;x.ko=(x.ko||0)+SC.errori;st[p.id]=x;S('pzStats',st);
}catch(e){}
var o=document.getElementById('scOv');if(!o)return;
o.innerHTML='<div class="sc-hd">'
+'<button class="sc-x" onclick="pzScriviChiudi()">\u2039</button>'
+'<div class="sc-ti">'+E(p.n)+'</div><div class="sc-su">finita</div></div>'
+'<div class="sc-fin">'
+'<div class="sc-tick">\u2713</div>'
+'<div class="sc-tit">Tutte e '+n+' le vie</div>'
+'<div class="sc-riga"><b>'+mm+'\u2032'+(ss<10?'0':'')+ss+'\u2033</b><span>tempo</span></div>'
+'<div class="sc-riga"><b>'+esatte+'</b><span>scritte giuste</span></div>'
+(quasi?'<div class="sc-riga"><b>'+quasi+'</b><span>con qualche refuso</span></div>':'')
+'<div class="sc-riga"><b>'+SC.errori+'</b><span>tentativi sbagliati</span></div>'
+(SC.aiuti?'<div class="sc-riga"><b>'+SC.aiuti+'</b><span>suggerimenti usati</span></div>':'')
+'<button class="sc-go" onclick="pzScriviCaso()">\u25b6 Un\u2019altra piazza</button>'
+'<button class="sc-go2" onclick="pzScrivi(\''+p.id+'\')">Rifai questa</button>'
+'<button class="sc-go2" onclick="pzScriviChiudi()">Torna alle piazze</button>'
+'</div>';
SC=null;
if(SCMAP){try{SCMAP.remove();}catch(e){}SCMAP=null;}
vibra();
}catch(e){}
}
})();
