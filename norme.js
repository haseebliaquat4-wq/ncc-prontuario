/* ═══════════════════════════════════════════════════
   NORME — Regolamento del servizio, artt. 38-61
   Schede di studio, i numeri da ricordare, le 4 classi,
   e un quiz con ripetizione a spirale sugli articoli deboli.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
function L(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function S(k,v){try{localStorage.setItem(k,JSON.stringify(v));
try{if(typeof markDirty==='function')markDirty('prefs');if(typeof autoSave==='function')autoSave();}catch(e){}}catch(e){}}
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){
return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function vibra(){try{if(typeof hap==='function')hap();}catch(e){}}
function avviso(t,ms){try{if(typeof toast2==='function')toast2(t,ms||2200);}catch(e){}}
function D(){try{return window.__NORME__||null;}catch(e){return null;}}
function mescola(a){a=a.slice();for(var i=a.length-1;i>0;i--){
var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

var OV=null,VISTA='menu',QZ=null;
var PASSI=[1,2,4,9,21,45];

function ogg(v){return (v&&typeof v==='object'&&!Array.isArray(v))?v:{};}
function stats(){return ogg(L('nmStats',{}));}
function spirale(){return ogg(L('nmSR',{}));}
window.nmScadute=function(){
try{var sr=spirale(),ora=Date.now(),n=0,d=D();if(!d)return 0;
d.sez.forEach(function(s){var c=sr[s.id];if(c&&c.due&&c.due<=ora)n++;});return n;}catch(e){return 0;}};
window.nmMaiViste=function(){
try{var st=stats(),d=D();if(!d)return 0;
return d.sez.filter(function(s){return !st[s.id];}).length;}catch(e){return 0;}};
function segna(art,giusto){
try{
var d=D();if(!d)return;
var sez=d.sez.filter(function(s){return s.art.indexOf(art)>=0||art.indexOf(s.art.split('-')[0])===0;})[0];
var id=sez?sez.id:('art'+art);
var st=stats();var x=st[id]||{ok:0,ko:0};
if(giusto)x.ok++;else x.ko++;st[id]=x;S('nmStats',st);
var sr=spirale();var c=sr[id]||{box:0};
c.box=giusto?Math.min(PASSI.length-1,(c.box||0)+1):0;
c.due=Date.now()+PASSI[c.box]*86400000;c.last=Date.now();
sr[id]=c;S('nmSR',sr);
}catch(e){}
}

function guscio(){
if(OV&&OV.parentNode&&document.body.contains(OV))return OV;
if(OV){try{OV.remove();}catch(e){}OV=null;}
var v=document.getElementById('nmOv');if(v){try{v.remove();}catch(e){}}
OV=document.createElement('div');OV.id='nmOv';
document.body.appendChild(OV);
return OV;
}
function chiudi(){try{if(OV){OV.remove();OV=null;}QZ=null;VISTA='menu';}catch(e){}}
window.nmChiudi=chiudi;

window.openNorme=function(){
try{
var d=D();
if(!d){avviso('\u26a0\ufe0f Dati delle norme non caricati',2600);return;}
VISTA='menu';disegna();vibra();
}catch(e){}
};

function testa(tit,sub,indietro){
return '<div class="nm-hd">'
+'<button class="nm-x" onclick="'+(indietro||'nmChiudi()')+'">'+(indietro?'\u2039':'\u2715')+'</button>'
+'<div class="nm-ti">'+E(tit)+'</div>'
+'<div class="nm-su">'+E(sub)+'</div></div>';
}

function menu(){
var d=D(),st=stats(),sr=spirale(),ora=Date.now();
var h=testa('\ud83d\udcdc Norme e regolamento','Articoli 38-61 \u00b7 '+d.quiz.length+' domande');
h+='<div class="nm-body">';
h+='<div class="nm-tiles">'
+'<div class="nm-tile"><b>'+nmScadute()+'</b><small>DA RIPASSARE</small></div>'
+'<div class="nm-tile"><b>'+nmMaiViste()+'</b><small>MAI VISTI</small></div>'
+'<div class="nm-tile"><b>'+d.num.length+'</b><small>NUMERI</small></div>'
+'</div>';
h+='<button class="nm-go" onclick="nmQuiz()">\u25b6 Quiz sulle norme</button>';
h+='<button class="nm-go2" onclick="nmNumeri()">\ud83d\udd22 I numeri da ricordare</button>';
h+='<button class="nm-go2" onclick="nmClassi()">\u2696\ufe0f Le 4 classi di sospensione</button>';
h+='<div class="nm-lab">GLI ARTICOLI</div><div class="nm-list">';
d.sez.forEach(function(s){
var x=st[s.id],c=sr[s.id];
var scad=c&&c.due&&c.due<=ora;
var tot=x?((x.ok||0)+(x.ko||0)):0;
var perc=tot?Math.round(x.ok/tot*100):null;
var cls=scad?'scad':(perc===null?'mai':(perc>=80?'ok':(perc>=55?'mid':'ko')));
h+='<button class="nm-row '+cls+'" onclick="nmArt(\''+s.id+'\')">'
+'<span class="nm-art">'+E(s.art)+'</span>'
+'<span class="nm-t">'+E(s.t)+'</span>'
+'<span class="nm-m">'+(perc===null?'mai visto':(perc+'%'))+(scad?' \u00b7 <b>ripassa</b>':'')+'</span>'
+'<span class="nm-ar">\u203a</span></button>';
});
h+='</div></div>';
return h;
}

window.nmArt=function(id){
try{
var d=D(),s=d.sez.filter(function(x){return x.id===id;})[0];if(!s)return;
var h=testa('Art. '+s.art,s.t,'openNorme()');
h+='<div class="nm-body"><div class="nm-punti">';
s.p.forEach(function(t,i){
h+='<div class="nm-p"><span class="nm-n">'+(i+1)+'</span><span>'+E(t)+'</span></div>';});
h+='</div>';
h+='<button class="nm-go" onclick="nmQuiz(\''+s.art+'\')">\u25b6 Provami su questo articolo</button>';
h+='</div>';
guscio().innerHTML=h;vibra();
}catch(e){}
};

window.nmNumeri=function(){
try{
var d=D();
var h=testa('\ud83d\udd22 I numeri','Quelli che l\u2019esame chiede a memoria','openNorme()');
h+='<div class="nm-body"><div class="nm-nums">';
d.num.forEach(function(x){
h+='<div class="nm-num"><b>'+E(x.v)+'</b><span>'+E(x.d)+'</span></div>';});
h+='</div></div>';
guscio().innerHTML=h;vibra();
}catch(e){}
};

window.nmClassi=function(){
try{
var d=D();
var h=testa('\u2696\ufe0f Le 4 classi','Sospensione, gravit\u00e0 crescente','openNorme()');
h+='<div class="nm-body">';
d.cls.forEach(function(c){
h+='<div class="nm-cls c'+c.n+'"><div class="nm-ch"><b>Classe '+c.n+'</b><span>'+E(c.g)+'</span></div><ul>';
c.ex.forEach(function(e){h+='<li>'+E(e)+'</li>';});
h+='</ul></div>';});
h+='</div>';
guscio().innerHTML=h;vibra();
}catch(e){}
};

/* ── quiz ── */
window.nmQuiz=function(soloArt){
try{
var d=D();
var pool=d.quiz.filter(function(q){return !soloArt||q[3]===soloArt||soloArt.indexOf(q[3])>=0;});
if(pool.length<3)pool=d.quiz;
var items=mescola(pool).slice(0,Math.min(10,pool.length)).map(function(q){
var opz=mescola(q[1].map(function(t,i){return {t:t,g:(i===q[2])};}));
return {d:q[0],o:opz,art:q[3]};});
QZ={items:items,i:0,ok:0,sbagliate:[]};
quizPasso();
}catch(e){}
};
function quizPasso(){
try{
if(!QZ)return;
if(QZ.i>=QZ.items.length){quizFine();return;}
var it=QZ.items[QZ.i];
var h=testa('Quiz norme','Domanda '+(QZ.i+1)+' di '+QZ.items.length,'openNorme()');
h+='<div class="nm-body"><div class="nm-bar"><i style="width:'+Math.round(QZ.i/QZ.items.length*100)+'%"></i></div>'
+'<div class="nm-q">'+E(it.d)+'</div><div class="nm-opz">';
it.o.forEach(function(o,i){
h+='<button class="nm-o" data-i="'+i+'">'+E(o.t)+'</button>';});
h+='</div><div class="nm-art2">Art. '+E(it.art)+'</div></div>';
var g=guscio();g.innerHTML=h;
g.querySelectorAll('.nm-o').forEach(function(b){
b.onclick=function(){
if(b.disabled)return;
var i=parseInt(b.dataset.i,10);
var giusto=!!it.o[i].g;
g.querySelectorAll('.nm-o').forEach(function(x,j){
x.disabled=true;
if(it.o[j].g)x.classList.add('good');
else if(j===i)x.classList.add('bad');});
if(giusto)QZ.ok++;else QZ.sbagliate.push(it);
segna(it.art,giusto);
vibra();
setTimeout(function(){
/* se intanto hai chiuso il quiz non scrivo su quello che non c'è più */
if(!QZ)return;
QZ.i++;quizPasso();},giusto?650:1500);
};});
}catch(e){}
}
function quizFine(){
try{
var n=QZ.items.length,perc=Math.round(QZ.ok/n*100);
var h=testa('Quiz norme','Risultato','openNorme()');
h+='<div class="nm-body"><div class="nm-fin">'
+'<div class="nm-perc '+(perc>=80?'ok':(perc>=55?'mid':'ko'))+'">'+perc+'%</div>'
+'<div class="nm-sub">'+QZ.ok+' su '+n+'</div>';
if(QZ.sbagliate.length){
h+='<div class="nm-rev"><b>Da rivedere</b>';
QZ.sbagliate.forEach(function(it){
var giusta='';it.o.forEach(function(o){if(o.g)giusta=o.t;});
h+='<div class="nm-rv"><span class="nm-ra">Art. '+E(it.art)+'</span>'
+'<i>'+E(it.d)+'</i><em>'+E(giusta)+'</em></div>';});
h+='</div>';}
h+='<button class="nm-go" onclick="nmQuiz()">Un altro giro</button>'
+'<button class="nm-go2" onclick="openNorme()">Torna alle norme</button>'
+'</div></div>';
guscio().innerHTML=h;
QZ=null;vibra();
}catch(e){}
}

function disegna(){try{guscio().innerHTML=menu();}catch(e){}}
})();

/* ── le norme entrano nel piano di oggi e nella sincronizzazione ── */
(function(){
'use strict';
function L(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function S(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
/* i progressi viaggiano con le preferenze, come tutto il resto */
try{
var _gp=getPrefs;
getPrefs=function(){
var p={};try{p=_gp.apply(this,arguments)||{};}catch(e){}
try{['nmStats','nmSR'].forEach(function(k){
var v=L(k,null);
if(v&&typeof v==='object'&&Object.keys(v).length)p[k]=v;});}catch(e){}
return p;};
}catch(e){}
try{
var _f=window.nccFondiPrefs;
window.nccFondiPrefs=function(pr){
var n=0;try{n=_f?_f(pr):0;}catch(e){}
try{
if(!pr)return n;
['nmStats','nmSR'].forEach(function(k){
if(!pr[k]||typeof pr[k]!=='object')return;
var l=L(k,{})||{};
Object.keys(pr[k]).forEach(function(id){
var a=l[id],b=pr[k][id];
if(!a){l[id]=b;n++;return;}
if(k==='nmSR'){if((b&&b.last||0)>(a&&a.last||0)){l[id]=b;n++;}}
else{l[id]={ok:Math.max(a.ok||0,b.ok||0),ko:Math.max(a.ko||0,b.ko||0)};n++;}
});
S(k,l);});
}catch(e){}
return n;};
}catch(e){}
/* compito nel piano di oggi */
try{
var _ct=coachTasks;
coachTasks=function(){
var t=_ct.apply(this,arguments)||[];
try{
if(typeof nmScadute!=='function')return t;
var scad=nmScadute(),mai=nmMaiViste();
if(scad>0){
t.push({ic:'\ud83d\udcdc',tx:scad+(scad===1?' articolo da ripassare':' articoli da ripassare'),
sub:'Regolamento del servizio \u2014 quiz sugli articoli deboli',p:1.5,
fn:function(){try{openNorme();setTimeout(function(){nmQuiz();},260);}catch(e){}}});
}else if(mai>0){
t.push({ic:'\ud83d\udcdc',tx:'Norme: '+mai+(mai===1?' articolo mai visto':' articoli mai visti'),
sub:'Contrassegni, sospensioni, decadenza \u2014 roba da esame',p:2.4,
fn:function(){try{openNorme();}catch(e){}}});
}
}catch(e){}
return t;};
}catch(e){}
})();
