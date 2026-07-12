/* ═══════════════════════════════════════════════════
   ADDON DESIGN v1 — solo agganci esterni, core intatto
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── 4 · colori semantici degli argomenti (dash + analisi risultato) ── */
function paintCats(){
try{
if(typeof QARG==='undefined')return;
var map={};QARG.forEach(function(c,i){map[c.id]='catc'+(i%4);});
document.querySelectorAll('#qDash [onclick^="qStartCat("]').forEach(function(el){
var m=(el.getAttribute('onclick')||'').match(/qStartCat\('([^']+)'\)/);
if(m&&map[m[1]])el.classList.add(map[m[1]]);
});
document.querySelectorAll('#qResult .qarg-box').forEach(function(el,i){
if(QARG[i]&&map[QARG[i].id])el.classList.add(map[QARG[i].id]);
});
}catch(e){}
}
try{var _rd=renderDash;renderDash=function(){_rd();paintCats();};}catch(e){}
try{var _rr=renderResult;renderResult=function(a,b,c,d){_rr(a,b,c,d);paintCats();};}catch(e){}
try{var _rt=renderTopics;renderTopics=function(){_rt();paintCats();};}catch(e){}

/* ── 17 · SCIA DORATA: al completamento, il percorso si ridisegna in oro ── */
try{
var _rc=routeCelebrate;
routeCelebrate=function(){
_rc();
try{
if(!map||!cur)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(document.body.classList.contains('lowbat'))return;
var pts=[];
for(var i=0;i<cur.steps.length;i++){var c=coords[cur.id+'_'+i];if(c)pts.push([c.lat,c.lon]);}
if(pts.length<2)return;
var poly=L.polyline(pts,{color:'#FFD60A',weight:6,opacity:.95,className:'gold-run',interactive:false}).addTo(map);
requestAnimationFrame(function(){
try{
var p=poly._path;if(!p){map.removeLayer(poly);return;}
var len=p.getTotalLength();
p.style.strokeDasharray=len;
p.style.strokeDashoffset=len;
p.getBoundingClientRect();
p.style.transition='stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)';
p.style.strokeDashoffset='0';
setTimeout(function(){
try{p.style.transition='opacity .6s';p.style.opacity='0';}catch(e){}
setTimeout(function(){try{map.removeLayer(poly);}catch(e){}},650);
},2100);
}catch(e){try{map.removeLayer(poly);}catch(e2){}}
});
/* se cambi percorso durante lo spettacolo, si pulisce subito */
var _guard=selectRoute;
selectRoute=function(r){try{if(poly&&map)map.removeLayer(poly);}catch(e){}selectRoute=_guard;_guard(r);};
}catch(e){}
};
}catch(e){}

/* ── 18 · momento "PRONTO" — una sola volta, quando il semaforo diventa verde ── */
window.showGreenMoment=function(){
try{
if(document.getElementById('greenMoment'))return;
var o=document.createElement('div');o.id='greenMoment';
o.innerHTML='<div class="gm-card"><div class="gm-e">🟢</div><h2>SEI PRONTO</h2>'
+'<p>Media simulazioni sopra 14, copertura completa, errori sotto controllo, memoria che tiene.<br>Da oggi si difende il risultato: ripassi leggeri e una simulazione a settimana.</p>'
+'<button onclick="document.getElementById(\'greenMoment\').remove()">Andiamo 🚖</button></div>';
o.addEventListener('click',function(e){if(e.target===o)o.remove();});
document.body.appendChild(o);
try{confetti();setTimeout(confetti,500);}catch(e){}
try{hap('win');}catch(e){}
}catch(e){}
};
try{
var _rel=renderExamLight;
renderExamLight=function(){
_rel();
try{
if(document.querySelector('#examLight .xl.ok')&&!lg('greenSeen',false)){
ls('greenSeen',true);
setTimeout(window.showGreenMoment,600);
}
}catch(e){}
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   ADDON COACH 2.0 — curva personale, coda a rischio, saper mollare
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── 1 · CURVA DELL'OBLIO PERSONALE ──
Gli intervalli di ripasso (1/3/7 giorni per gli errori, 2/4/9/21/45 per i percorsi)
si TARANO su di te: ritenzione alta → intervalli più lunghi (meno ripassi inutili);
ritenzione bassa → più corti (ripassi prima di dimenticare). */
function _mul(){return lg('srMul',1);}
try{
var _qfM=qFinish;
qFinish=function(t){
_qfM(t);
try{
if(qCurView==='result'&&lastQuiz&&lastQuiz.opts&&lastQuiz.opts.title==='Test di ritenzione'){
var r=lg('retScore',null);
if(r&&r.tot){
var pct=r.ok/r.tot*100;
var m=_mul();
m=m*(pct>=90?1.15:pct>=80?1.06:pct>=70?1:pct>=60?0.9:0.8);
m=Math.max(0.6,Math.min(1.6,Math.round(m*100)/100));
ls('srMul',m);
if(Math.abs(m-1)>0.08)setTimeout(function(){toast2('🧠 Intervalli di ripasso tarati su di te: ×'+m);},1200);
}
}
}catch(e){}
};
}catch(e){}
/* applica il moltiplicatore agli intervalli di errori e percorsi */
try{
var _sm=srMark;
srMark=function(id,correct){
_sm(id,correct);
try{
var e=qtStats.err[id],m=_mul();
if(correct&&e&&e.due>Date.now()&&m!==1)e.due=Date.now()+Math.round((e.due-Date.now())*m);
}catch(e2){}
};
}catch(e){}
try{
var _rm=rsrMark;
rsrMark=function(id){
_rm(id);
try{
var e=rSR[id],m=_mul();
if(e&&e.due>Date.now()&&m!==1){e.due=Date.now()+Math.round((e.due-Date.now())*m);ls('rSR',rSR);}
}catch(e2){}
};
}catch(e){}
/* riga informativa sotto il semaforo quando la taratura è attiva */
try{
var _relM=renderExamLight;
renderExamLight=function(){
_relM();
try{
var m=_mul();
var el=document.getElementById('examLight');
if(!el||Math.abs(m-1)<=0.08)return;
if(el.querySelector('.srmul-line'))return;
var d=document.createElement('div');d.className='srmul-line';
d.textContent='🧠 Ripassi tarati sulla tua memoria: intervalli ×'+m;
el.appendChild(d);
}catch(e){}
};
}catch(e){}

/* ── 3 · CODA UNICA A RISCHIO ──
Ogni domanda ha un punteggio: errori storici, scadenze superate, età dell'ultima
risposta giusta, argomento debole, mai vista, confusioni. La sessione pesca
le più a rischio — una coda sola, sempre quella giusta. */
window.qRisk=function(it){
try{
var id=it.id,now=Date.now(),r=0;
r+=Math.min((qtStats.wrongN||{})[id]||0,5)*1.2;
var e=(qtStats.err||{})[id];
if(e&&typeof e==='object'){var od=(now-(e.due||0))/86400000;r+=od>0?(3+Math.min(od,14)*0.4):1.5;}
var lo=(qtStats.lastOk||{})[id];
if(lo)r+=Math.min((now-lo)/86400000,60)*0.06;
if(!qtStats.seenIds[id])r+=2.2;
var c=qtStats.cat[it.cat];
if(c&&(c.seen||0)>=6)r+=(1-(c.ok||0)/c.seen)*2;
var w=(qtStats.why||{})[id];
if(w&&w.c)r+=0.8;
return r;
}catch(e2){return 1;}
};
window.qStartRisk=function(n,opts){
buildQuiz();
var items=QUIZ_ALL.map(function(it){return [qRisk(it)+Math.random()*0.6,it];})
.sort(function(a,b){return b[0]-a[0];}).slice(0,n||12).map(function(x){return x[1];});
if(!items.length){toast2('Nessuna domanda');return;}
startQuiz(qShuffle(items),opts||{mode:'study',title:'Sessione intelligente'});
};
/* il bottone "5 minuti" ora usa la coda a rischio (stessa durata, scelta migliore) */
try{
startMicro=function(){
openQuiz();
qStartRisk(8,{mode:'study',title:'Sessione 5 minuti',micro:true});
};
}catch(e){}
/* riquadro "Sessione intelligente" in cima alle modalità del quiz */
function injectSmartTile(){
try{
if(document.getElementById('smartTile'))return;
var anchor=document.querySelector('#qDash [onclick="qStartNew()"]');
if(!anchor)return;
var b=document.createElement('button');
b.id='smartTile';b.className='qtile';
b.onclick=function(){qStartRisk(12);};
b.innerHTML='<div class="qtile-ic" style="background:rgba(36,71,214,.12)">🧠</div>'
+'<div class="qtile-tx"><strong>Sessione intelligente</strong><small>12 domande scelte dal rischio: errori, scadenze, lacune</small></div>'
+'<div class="qtile-ar">›</div>';
anchor.parentNode.insertBefore(b,anchor);
}catch(e){}
}
try{
var _rdS=renderDash;renderDash=function(){_rdS();injectSmartTile();};
}catch(e){}

/* ── 9 · SAPER MOLLARE ──
4 errori di fila in una sessione di studio: il coach propone di fermarsi,
senza drammi. Insistere nei giorni storti brucia motivazione, non fissa nulla. */
var _wrongRun=0;
try{
var _smB=srMark;
srMark=function(id,correct){
_smB(id,correct);
try{
if(typeof Q==='undefined'||!Q||Q.mode!=='study')return;
if(correct){_wrongRun=0;return;}
_wrongRun++;
if(_wrongRun===4&&!Q._bail){
Q._bail=true;
showBail();
}
}catch(e2){}
};
}catch(e){}
try{
var _sq=startQuiz;
startQuiz=function(items,opts){_wrongRun=0;_sq(items,opts);};
}catch(e){}
function showBail(){
try{
if(document.getElementById('bailSheet'))return;
var s=document.createElement('div');s.id='bailSheet';
s.innerHTML='<div class="bail-card"><div class="bail-e">🌧</div>'
+'<b>4 di fila... giornata storta?</b>'
+'<p>Capita a tutti. Insistere adesso non fissa nulla: meglio chiudere e riprendere domani — la striscia è salva comunque.</p>'
+'<div class="bail-row"><button class="bail-stop">💤 Basta per oggi</button><button class="bail-go">💪 Continuo</button></div></div>';
s.querySelector('.bail-stop').onclick=function(){
s.remove();
try{qFinish(true);}catch(e){}
setTimeout(function(){toast2('Domani il coach riparte leggero. Riposa 🌙');},800);
};
s.querySelector('.bail-go').onclick=function(){_wrongRun=0;s.remove();hap('m');};
s.addEventListener('click',function(e){if(e.target===s){_wrongRun=0;s.remove();}});
document.body.appendChild(s);
hap('e');
}catch(e){}
}

})();

/* ═══════════════════════════════════════════════════
   ADDON FINAL POLISH — anello risultato, pillola dock, stati vuoti
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1 · RISULTATO: grande anello centrale che si disegna ── */
function ringify(ok,err,skip){
try{
var v=document.querySelector('#qResult .qres-verdict');if(!v)return;
var old=document.getElementById('resRing');if(old)old.remove();
var tot=(typeof Q!=='undefined'&&Q&&Q.items)?Q.items.length:(ok+err+skip);
if(!tot)return;
var pass=!!document.querySelector('#qResult .qres-title.pass');
var fail=!!document.querySelector('#qResult .qres-title.fail');
var col=pass?'var(--ok)':(fail?'var(--err)':'var(--a)');
var R=62,C=2*Math.PI*R,pct=ok/tot;
var wrap=document.createElement('div');wrap.id='resRing';
wrap.innerHTML='<svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">'
+'<circle cx="75" cy="75" r="'+R+'" stroke="var(--fill2)" stroke-width="11" fill="none"/>'
+'<circle class="rr-f" cx="75" cy="75" r="'+R+'" stroke="'+col+'" stroke-width="11" fill="none" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" transform="rotate(-90 75 75)"/></svg>'
+'<div class="rr-txt"><b>0</b><span>/'+tot+'</span></div>';
v.insertBefore(wrap,v.firstChild);
var f=wrap.querySelector('.rr-f'),b=wrap.querySelector('.rr-txt b');
if(RM){f.style.strokeDashoffset=String(C*(1-pct));b.textContent=ok;}
else{
requestAnimationFrame(function(){
f.getBoundingClientRect();
f.style.transition='stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)';
f.style.strokeDashoffset=String(C*(1-pct));
});
try{countUp(b,ok,900);}catch(e){b.textContent=ok;}
}
}catch(e){}
}
try{
var _rrP=renderResult;
renderResult=function(ok,err,skip,timeout){_rrP(ok,err,skip,timeout);ringify(ok,err,skip);};
}catch(e){}

/* ── 2 · PILLOLA SCORREVOLE nel dock ── */
function initPill(){
try{
var bar=document.getElementById('tabbar');if(!bar||document.getElementById('tabPill'))return;
var pill=document.createElement('div');pill.id='tabPill';
bar.insertBefore(pill,bar.firstChild);
document.body.classList.add('pill-on');/*[FIX 1000] da ora l'evidenziazione la fa la pillola*/
function move(){
try{
var on=bar.querySelector('.tab.on');if(!on)return;
pill.style.left=on.offsetLeft+'px';
pill.style.top=on.offsetTop+'px';
pill.style.width=on.offsetWidth+'px';
pill.style.height=on.offsetHeight+'px';
pill.style.opacity='1';
}catch(e){}
}
move();setTimeout(move,600);setTimeout(move,1800); /* dopo font e layout */
var mo=new MutationObserver(move);
bar.querySelectorAll('.tab').forEach(function(t){mo.observe(t,{attributes:true,attributeFilter:['class']});});
window.addEventListener('resize',function(){setTimeout(move,120);});
window.addEventListener('orientationchange',function(){setTimeout(move,450);});
}catch(e){}
}
setTimeout(initPill,700);

})();


/* [FIX 500-scene] il cambio tab passa da goHome per un istante: il report
settimanale programmato lì poteva spuntare SOPRA la schermata Quiz.
Ora esce solo se la home è davvero visibile. */
(function(){
'use strict';
try{
var _wr=weeklyReport;
weeklyReport=function(force){
if(!force){
var hs=document.getElementById('homeScreen');
if(hs&&hs.style.display==='none')return;
}
_wr(force);
};
}catch(e){}
})();
