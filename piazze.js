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
+'</div>';

h+='<div class="pz-body">';
h+='<div class="pz-tiles">'
+'<button class="pz-tile" onclick="pzRipasso()"><b>'+scadute+'</b><span>da ripassare</span></button>'
+'<button class="pz-tile" onclick="pzNuove()"><b>'+mai+'</b><span>mai viste</span></button>'
+'<button class="pz-tile" onclick="pzCondiviseVista()"><b>'+condivise().length+'</b><span>vie doppie</span></button>'
+'</div>';

h+='<div class="pz-cerca"><input id="pzQ" type="search" placeholder="Cerca piazza o via\u2026" '
+'oninput="pzFiltra(this.value)" value="'+E(FILTRO)+'"></div>';
h+='<button class="pz-add" onclick="pzNuovaPiazza()">\uff0b Aggiungi una piazza</button>';
h+='<div id="pzList" class="pz-list"></div>';
h+='</div>';
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
+'<div class="pz-modi">'
+'<button id="pzMs" class="pz-m'+(CIECO?'':' on')+'" onclick="pzModo(false)">Studio</button>'
+'<button id="pzMc" class="pz-m'+(CIECO?' on':'')+'" onclick="pzModo(true)">Cieco</button>'
+'</div></div>'
+'<div class="pz-body pz-linea"><div id="pzMetro"></div></div>'
+'<div class="pz-foot">'
+'<button class="pz-nav" onclick="pzVai(-1)">\u25c0</button>'
+'<button class="pz-tutte" onclick="pzTutteVie()">Mostra tutte</button>'
+'<button class="pz-nav pz-next" onclick="pzVai(1)">\u25b6</button>'
+'</div>'
+'<div class="pz-azioni">'
+'<button onclick="pzMappa()">\ud83d\udccd Mappa</button>'
+'<button onclick="pzModifica()">\u270e Modifica</button>'
+'<button onclick="pzVerifica()">\u2713 Mi verifico</button>'
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

window.pzMappa=function(){
try{
if(!CUR)return;
var p=CUR;
chiudi();
if(typeof goTopografia==='function')goTopografia();
setTimeout(function(){mostraPannello(p);},450);
}catch(e){}
};

function mostraPannello(p){
try{
var vecchio=document.getElementById('pzPan');if(vecchio)vecchio.remove();
var co=L('pzCoords',{});
var d=document.createElement('div');
d.id='pzPan';
var h='<div class="pzp-hd"><b>'+E(p.n)+'</b>'
+'<button onclick="pzPanChiudi()">\u2715</button></div>'
+'<div class="pzp-nav">'
+'<button onclick="pzMapPrev()">\u25c0</button>'
+'<span id="pzMapN">'+(FINO===null?p.v.length:FINO)+' di '+p.v.length+'</span>'
+'<button onclick="pzMapNext()">\u25b6</button>'
+'<button class="pzp-t" onclick="pzMapTutte()">Tutte</button>'
+'<button class="pzp-g" onclick="pzTrovaMarker(\''+p.id+'\')" title="Trova i marker su OpenStreetMap">\ud83d\udef0</button>'
+'</div>'
+'<div class="pzp-hint">Tocca una riga, poi tocca il punto sulla mappa \u00b7 trascina un marker per correggerlo</div>'
+'<div class="pzp-list">';
h+='<button class="pzp-row pzp-cap" onclick="pzPos(\''+p.id+'\',-1)">'
+'<span class="pzp-d"></span><b>'+E(p.n)+'</b>'
+'<i>'+(co[p.id]?'\ud83d\udccd':'\uff0b')+'</i></button>';
p.v.forEach(function(v,i){
h+='<button class="pzp-row" onclick="pzPos(\''+p.id+'\','+i+')">'
+'<span class="pzp-n">'+(i+1)+'</span><b>'+E(v)+'</b>'
+'<i>'+(co[p.id+'_'+i]?'\ud83d\udccd':'\uff0b')+'</i></button>';
});
h+='</div>';
d.innerHTML=h;
document.body.appendChild(d);
PANP=p;
disegnaSuMappa(p);
}catch(e){}
}
window.pzPanChiudi=function(){var d=document.getElementById('pzPan');if(d)d.remove();pulisciMappa();};

window.pzPos=function(id,idx){
try{
PL={id:id,idx:idx};
var p=trova(id);
avviso('\ud83d\udccd Tocca sulla mappa dove si trova '+(idx<0?p.n:p.v[idx]),3000);
document.querySelectorAll('#pzPan .pzp-row').forEach(function(r,i){
r.classList.toggle('att',i===(idx+1));});
if(typeof map!=='undefined'&&map&&!map.__pzOn){
map.on('click',function(ev){
try{
if(!PL||!ev||!ev.latlng)return;
var co=L('pzCoords',{});
var k=(PL.idx<0)?PL.id:(PL.id+'_'+PL.idx);
co[k]={lat:ev.latlng.lat,lon:ev.latlng.lng};
S('pzCoords',co);
var pp=trova(PL.id);
avviso('\u2713 '+((PL.idx<0)?pp.n:pp.v[PL.idx])+' posizionata',1600);
PL=null;
mostraPannello(pp);
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}
}catch(e){}
});
map.__pzOn=true;
}
}catch(e){}
};

var MK=[],LN=null;
var FINO=null;   /* quante vie sono comparse sulla mappa */
var PANP=null;   /* la piazza aperta sulla mappa */
function pulisciMappa(){
try{
MK.forEach(function(m){try{m.remove();}catch(e){}});MK=[];
if(LN){try{LN.remove();}catch(e){}LN=null;}
}catch(e){}
}
function disegnaSuMappa(p){
try{
pulisciMappa();
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
raggi.push(LF.polyline([centro,[c.lat,c.lon]],
{color:att?'#2447D6':'#8892a4',weight:att?4:2.5,opacity:att?.9:.45,
dashArray:att?null:'6 5',interactive:false}).addTo(map));
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
if(!document.getElementById('pzCard')){
var home=document.getElementById('homeScreen');
var cards=home&&home.querySelector('.home-cards');
if(cards){
var c=document.createElement('button');
c.id='pzCard';c.className='home-card';
var n=pzScadute();
c.innerHTML='<span class="hc-ic">\ud83d\udd37</span>'
+'<span class="hc-tx"><b>Piazze</b><i>'+tutte().length+' piazze di Milano'
+(n?(' \u00b7 '+n+' da ripassare'):'')+'</i></span><span class="hc-ar">\u203a</span>';
c.onclick=function(){openPiazze();};
cards.appendChild(c);
}
}
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
var e=document.getElementById('pzMapN');
if(e)e.textContent=(FINO===null?PANP.v.length:FINO)+' di '+PANP.v.length;
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

window.pzTrovaMarker=function(soloQuesta){
try{
if(GEO){avviso('\u23f3 Sto gi\u00e0 cercando\u2026',2000);return;}
var tutte=window.pzTutte?window.pzTutte():[];
if(!tutte.length){avviso('\u26a0\ufe0f Nessuna piazza',2200);return;}
var scelte=soloQuesta?tutte.filter(function(x){return x.id===soloQuesta;}):tutte;
var c=coda(scelte);
if(!c.length){avviso('\u2705 I marker ci sono gi\u00e0 tutti',2600);return;}
var sec=Math.ceil(c.length*PAUSA/1000);
var mi=Math.floor(sec/60),se=sec%60;
var tempo=mi?(mi+' minuti'+(se?' e '+se+' secondi':'')):(se+' secondi');
if(!confirm('Cerco '+c.length+' punti su OpenStreetMap.\n\n'
+'Ci vogliono circa '+tempo+': faccio una richiesta al secondo, '
+'come chiedono loro.\n\n'
+'Puoi fermarti quando vuoi, quello trovato resta salvato.\n'
+'Serve la connessione a internet.\n\nProcedo?'))return;
GEO={c:c,i:0,ok:0,ko:0,stop:false,rete:false};
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
