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
/* [FIX errori] il trigger vive ora nel registro per-risposta (vedi Addon Errori):
srMark scatta solo a fine sessione, quindi qui non deve fare nulla */
}catch(e){}
try{
var _sq=startQuiz;
startQuiz=function(items,opts){_wrongRun=0;_sq(items,opts);};
}catch(e){}
window.showBail=function(){
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

/* ═══════════════════════════════════════════════════
   ADDON ERRORI — registrazione live, schede da 40, coach mirato
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── REGISTRO PER-RISPOSTA: il lavoro non si perde MAI più ──
Ogni risposta finisce in un registro. Se termini normalmente, il conteggio
ufficiale lo fa il core (registro scartato). Se ESCI a metà, il registro
viene applicato: errori aggiornati, badge aggiornato, progresso salvato. */
var _led=[],_ledDone=false;
try{
var _sqL=startQuiz;
startQuiz=function(items,opts){_led=[];_ledDone=false;_wrongRunL=0;_sqL(items,opts);};
}catch(e){}
var _wrongRunL=0;
try{
var _qpL=qPick;
qPick=function(i){
var idx0,it,prev;
try{if(typeof Q!=='undefined'&&Q){idx0=Q.idx;it=Q.items[idx0];prev=Q.ans[idx0];}}catch(e){}
_qpL(i);
try{
if(!Q||it===undefined)return;
if(Q.ans[idx0]!==i)return; /* la risposta non è passata (lock) */
var ok=(i===it.correct);
if(prev!==-1){ /* esame: risposta CAMBIATA → aggiorna la voce esistente */
for(var li=_led.length-1;li>=0;li--){if(_led[li].id===it.id){_led[li].ok=ok;break;}}
return;
}
_led.push({id:it.id,cat:it.cat,ok:ok});
/* saper mollare — ora LIVE, solo durante la sessione */
if(Q.mode==='study'&&qCurView==='run'){
if(ok)_wrongRunL=0;
else{_wrongRunL++;if(_wrongRunL===4&&!Q._bail){Q._bail=true;showBail();}}
}
}catch(e){}
};
}catch(e){}
/* fine regolare: il core registra tutto, il registro si scarta.
   E guardia anti doppio-conteggio: qFinish non può girare due volte sulla stessa sessione */
try{
var _qfL=qFinish;
qFinish=function(t){
try{if(typeof Q!=='undefined'&&Q&&Q._finished)return;if(Q)Q._finished=true;}catch(e){}
_qfL(t);
if(qCurView==='result'){_ledDone=true;_led=[];}
};
}catch(e){}
/* uscita a metà: applica il registro (stesse operazioni del conteggio ufficiale) */
window.applyLedger=function(){
try{
if(_ledDone||!_led.length)return;
var n=_led.length;
_led.forEach(function(r){
try{
qtStats.seenIds[r.id]=1;
qtStats.cat[r.cat]=qtStats.cat[r.cat]||{seen:0,ok:0};
qtStats.cat[r.cat].seen++;
if(r.ok){qtStats.cat[r.cat].ok++;qtStats.lastOk=qtStats.lastOk||{};qtStats.lastOk[r.id]=Date.now();}
srMark(r.id,r.ok);
}catch(e){}
});
_led=[];
try{bumpDaily(n);}catch(e){}
try{qtSave();}catch(e){}
try{updateTabBadge();renderSeenCount();}catch(e){}
try{flushNow();}catch(e){}/*[FIX] su chiusura brusca il flush del core parte PRIMA del registro: rispediamo subito*/
setTimeout(function(){toast2('💾 Progresso salvato: '+n+' rispost'+(n===1?'a':'e'));},400);
}catch(e){}
};
try{
var _rdL=renderDash;renderDash=function(){applyLedger();_rdL();};/* la ✕ del quiz torna alla dash senza goHome */
var _ghL=goHome;goHome=function(){applyLedger();_ghL();};
var _gtL=goTopografia;goTopografia=function(){applyLedger();_gtL();};
var _osL=openStudy;openStudy=function(){applyLedger();_osL();};
window.addEventListener('pagehide',function(){try{applyLedger();}catch(e){}});
}catch(e){}

/* ── SCHEDA ERRORI DA 40: mai più valanghe da 65 domande ──
Ordine: prima gli scaduti (i più vecchi in cima), a parità le recidive. */
try{
var _qscE=qStartCat;
qStartCat=function(cid){
if(cid!=='errata'){_qscE(cid);return;}
buildQuiz();
var all=QUIZ_ALL.filter(function(it){return qtStats.err[it.id];});
if(!all.length){toast2('🎉 Nessun errore da ripassare');return;}
var now=Date.now();
all.sort(function(a,b){
var da=srDue(a.id),db=srDue(b.id);
var oa=da<=now?0:1,ob=db<=now?0:1;
if(oa!==ob)return oa-ob;                       /* scaduti prima */
if(da!==db)return da-db;                        /* poi i più vecchi */
return ((qtStats.wrongN||{})[b.id]||0)-((qtStats.wrongN||{})[a.id]||0); /* a parità, le recidive */
});
var tot=all.length,deck=all.slice(0,40);
var schede=Math.ceil(tot/40);
startQuiz(deck,{mode:'study',title:schede>1?('Scheda errori · '+deck.length+' di '+tot):'Ripasso errori',scheda:true});
};
}catch(e){}
/* a fine scheda: bottone "Prossima scheda" finché ci sono errori in scadenza */
try{
var _qfS=qFinish;
qFinish=function(t){
_qfS(t);
try{
if(qCurView!=='result')return;
var old=document.getElementById('nextDeck');if(old)old.remove();
if(!(lastQuiz&&lastQuiz.opts&&lastQuiz.opts.scheda))return;
var due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=Date.now();}).length;
if(due<1)return;
var box=document.querySelector('#qResult .qres-actions');
if(!box)return;
var b=document.createElement('button');
b.id='nextDeck';b.className='btn bp';
b.textContent='🔁 Prossima scheda ('+due+' in scadenza)';
b.onclick=function(){qStartCat('errata');};
box.insertBefore(b,box.firstChild);
}catch(e){}
};
}catch(e){}

/* ── COACH MIRATO SUGLI ERRORI ──
Non più "65 errori" e basta: quanti oggi, quanti arretrati,
quale argomento li genera, e il piano a schede. */
try{
var _ctE=coachTasks;
coachTasks=function(){
var t=_ctE();
try{
var task=t.find(function(x){return x.ic==='🔁';});
if(!task)return t;
var now=Date.now(),ids=Object.keys(qtStats.err||{});
var due=ids.filter(function(id){return srDue(id)<=now;});
if(!due.length)return t;
var old3=due.filter(function(id){return now-srDue(id)>3*86400000;}).length;
/* argomento che genera più errori in scadenza */
var byCat={};
due.forEach(function(id){var it=QUIZ_ALL[id|0];if(it)byCat[it.cat]=(byCat[it.cat]||0)+1;});
var topId=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];})[0];
var topArg=QARG.find(function(c){return c.id===topId;});
var schede=Math.ceil(due.length/40);
task.tx=due.length<=40?('Scheda errori — '+due.length+' in scadenza'):('Scheda errori 1 di '+schede+' (40 alla volta)');
var bits=[];
if(old3>0)bits.push(old3+' arretrat'+(old3===1?'o':'i')+' da 3+ giorni');
if(topArg&&byCat[topId]>=5)bits.push('soprattutto '+topArg.label+' ('+byCat[topId]+')');
task.sub=bits.length?bits.join(' · '):'La memoria li sta perdendo proprio oggi';
}catch(e){}
return t;
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   ADDON COACH INTERATTIVO — 16 interventi quiz+topografia
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── (6) evidenziatore parole-trappola ── */
var TRAP=/\b(NON|MAI|SEMPRE|SOLO|SOLTANTO|ESCLUSIVAMENTE|VIETATO|OBBLIGATORIO|TUTTI|NESSUN[OA]?)\b/gi;
function trapify(txt){
return esc(txt).replace(TRAP,function(m){return '<b class="trap">'+m+'</b>';});
}

/* ── (6)(8)(12) dentro il run: trappole evidenziate, puntino argomento, timer via in studio ── */
try{
var _qrr=qRenderRun;
qRenderRun=function(){
_qrr();
try{
var it=Q&&Q.items[Q.idx];if(!it)return;
var q=document.getElementById('qRunQ');
if(q)q.innerHTML=trapify(it.q);
/* puntino colore-argomento accanto a "Domanda N" */
var n=document.getElementById('qRunNum');
if(n&&!n.querySelector('.qdot')){
var i=QARG.findIndex(function(c){return c.id===it.cat;});
if(i>=0){var d=document.createElement('span');d.className='qdot catd'+(i%4);n.appendChild(d);}
}else if(n){
var dd=n.querySelector('.qdot'),ii=QARG.findIndex(function(c){return c.id===it.cat;});
if(dd&&ii>=0)dd.className='qdot catd'+(ii%4);
}
/* timer nascosto quando non c'è limite (studio): il tempo visibile mette fretta inutile */
var clk=document.getElementById('qClock');
if(clk){var cell=clk.closest('.cell');if(cell)cell.style.display=(Q.limit?'':'none');}
}catch(e){}
};
}catch(e){}

/* ── (2) "Rileggi": tocchi 👀 Letta male → la domanda si ri-mostra con le trappole accese ── */
document.addEventListener('click',function(ev){
try{
var b=ev.target.closest('.why-chips button[data-w="l"]');
if(!b)return;
var it=(typeof Q!=='undefined'&&Q&&Q.items)?Q.items[Q.idx]:null;
if(!it)return;
var o=document.createElement('div');o.id='rereadOv';
o.innerHTML='<div class="rr-card"><small>👀 Rileggila con calma — occhio alle parole evidenziate</small><p>'+trapify(it.q)+'</p></div>';
o.addEventListener('click',function(){o.remove();});
document.body.appendChild(o);
setTimeout(function(){try{o.remove();}catch(e){}},3400);
}catch(e){}
},true);

/* ── (5) LE 3 DI IERI: il ripasso a 24h, l'intervallo più potente ── */
try{
var _ctY=coachTasks;
coachTasks=function(){
var t=_ctY();
try{
var now=Date.now(),today=new Date().toDateString();
if(lg('y3day','')===today)return t; /* una volta al giorno */
var ids=Object.keys(qtStats.err||{}).filter(function(id){
var e=qtStats.err[id];
return e&&e.box===0&&(now-e.due)>16*3600000&&(now-e.due)<40*3600000;
});
if(ids.length<2)return t;
var pick=ids.slice(0,5);
t.unshift({ic:'🌅',tx:'Gli errori di ieri ('+pick.length+')',sub:'Rivederli a 24 ore li fissa il doppio',fn:function(){
ls('y3day',today);
openQuiz();
setTimeout(function(){
var items=pick.map(function(id){return QUIZ_ALL[id|0];}).filter(Boolean);
startQuiz(items,{mode:'study',title:'Gli errori di ieri'});
},250);
},p:0.45});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}

/* ── (1) COPERTINA PRE-SCHEDA: 5 secondi di contesto prima del test ── */
window.showErrCover=function(deck,title,launch){
try{
var byCat={};
deck.forEach(function(it){byCat[it.cat]=(byCat[it.cat]||0)+1;});
var top=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];}).slice(0,3)
.map(function(cid){var c=QARG.find(function(x){return x.id===cid;});return c?('<div class="ec-row"><b>'+byCat[cid]+'</b> '+c.emoji+' '+c.label+'</div>'):'';}).join('');
var o=document.createElement('div');o.id='errCover';
o.innerHTML='<div class="ec-card"><small>'+title+'</small><h3>Da dove vengono questi errori</h3>'+top
+'<button class="ec-go">▶ Inizia</button></div>';
o.querySelector('.ec-go').onclick=function(){o.remove();launch();};
o.addEventListener('click',function(e){if(e.target===o){o.remove();launch();}});
document.body.appendChild(o);
}catch(e){launch();}
};

/* ── (4) RISCALDAMENTO PRE-SIMULAZIONE ── */
function injectWarmup(){
try{
var due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=Date.now();});
var oldB=document.getElementById('warmBtn');
if(due.length<3){if(oldB)oldB.remove();return;}
if(oldB)return;
var play=document.querySelector('.qc-play');if(!play)return;
var b=document.createElement('button');
b.id='warmBtn';b.className='warm-btn';
b.textContent='⚡ Riscaldamento (5 errori · 2 min)';
b.onclick=function(){
var items=due.sort(function(a,b2){return srDue(a)-srDue(b2);}).slice(0,5)
.map(function(id){return QUIZ_ALL[id|0];}).filter(Boolean);
startQuiz(items,{mode:'study',title:'Riscaldamento'});
};
play.after(b);
}catch(e){}
}
try{var _rdW=renderDash;renderDash=function(){_rdW();injectWarmup();};}catch(e){}

/* ── (C) COACH POST-SIMULAZIONE: il perché del voto, con l'azione pronta ── */
try{
var _qfD=qFinish;
qFinish=function(t){
_qfD(t);
try{
var old=document.getElementById('simDiag');if(old)old.remove();
if(qCurView!=='result'||!lastQuiz||!lastQuiz.opts||lastQuiz.opts.mode!=='exam')return;
if(!Q||!Q.items)return;
var errs=[];
Q.items.forEach(function(it,i){if(Q.ans[i]!==it.correct)errs.push(it);});
if(!errs.length)return;
var known=errs.filter(function(it){return ((qtStats.wrongN||{})[it.id]||0)>=2;}).length;
var byCat={};errs.forEach(function(it){byCat[it.cat]=(byCat[it.cat]||0)+1;});
var topId=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];})[0];
var topArg=QARG.find(function(c){return c.id===topId;});
var msg,btnTx,btnFn;
if(known>=Math.ceil(errs.length/2)){
msg='💡 '+known+' su '+errs.length+' errori erano domande <b>già sbagliate prima</b>: la scheda errori PRIMA delle simulazioni li avrebbe evitati.';
btnTx='🔁 Fai la scheda errori';btnFn=function(){qStartCat('errata');};
}else if(topArg&&byCat[topId]>=Math.ceil(errs.length*0.6)&&errs.length>=2){
msg='💡 Gli errori si concentrano su <b>'+topArg.label+'</b> ('+byCat[topId]+' su '+errs.length+'). Ricorda: max 2 errori per argomento.';
btnTx='📝 10 domande di '+topArg.label;btnFn=function(){qStartCat(topId);};
}else{
msg='💡 Errori sparsi su più argomenti: nessun buco grave, continua col piano del coach.';
}
var box=document.querySelector('#qResult .qres-actions');if(!box)return;
var d=document.createElement('div');d.id='simDiag';
d.innerHTML='<p>'+msg+'</p>'+(btnTx?'<button class="btn bp"></button>':'');
if(btnTx){var bb=d.querySelector('button');bb.textContent=btnTx;bb.onclick=btnFn;}
box.parentNode.insertBefore(d,box);
}catch(e){}
};
}catch(e){}

/* ── (D) OBIETTIVO PER ARGOMENTO: tocca il punto debole → missione ── */
document.addEventListener('click',function(ev){
try{
var el=ev.target.closest('#qSeen b');
if(!el)return;
var worst=null,wr=1.01;
QARG.forEach(function(c){var s=qtStats.cat[c.id];if(s&&(s.seen||0)>=6){var r=(s.ok||0)/s.seen;if(r<wr){wr=r;worst=c;}}});
if(!worst||el.textContent.trim()!==worst.label)return;
var from=Math.round(wr*100),target=Math.min(95,Math.max(75,from+20));
if(lg('mission',null)){toast2('Hai già una missione attiva');return;}
if(confirm('🎯 Missione: portare '+worst.label+' dal '+from+'% al '+target+'%?\nAll\'esame: max 2 errori per argomento — un argomento debole boccia da solo.')){
ls('mission',{cat:worst.id,label:worst.label,from:from,target:target,ts:Date.now()});
toast2('🎯 Missione accettata: '+worst.label+' → '+target+'%');
try{renderCoach();}catch(e){}
}
}catch(e){}
});
try{
var _ctM=coachTasks;
coachTasks=function(){
var t=_ctM();
try{
var m=lg('mission',null);if(!m)return t;
var s=qtStats.cat[m.cat],cur=s&&s.seen?Math.round((s.ok||0)/s.seen*100):m.from;
if(cur>=m.target){
ls('mission',null);
setTimeout(function(){toast2('🏆 MISSIONE COMPIUTA: '+m.label+' al '+cur+'%!');try{confetti();}catch(e){}},600);
return t;
}
t.unshift({ic:'🎯',tx:'Missione '+m.label+': '+cur+'% → '+m.target+'%',sub:'Sessione mirata da 10 domande',fn:function(){openQuiz();setTimeout(function(){qStartCat(m.cat);},250);},p:1.15,prog:[Math.max(0,cur-m.from),Math.max(1,m.target-m.from)]});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}

/* ── (A)(10) DEBRIEF DEL PERCORSO + vie sbagliate ROSSE sulla mappa ── */
var _wm0=null,_dbMarks=[];
window.clearDbMarks=function(){try{_dbMarks.forEach(function(m){map.removeLayer(m);});}catch(e){}_dbMarks=[];};var clearDbMarks=window.clearDbMarks;
try{
var _smD=setMode;
setMode=function(m){
_smD(m);
try{document.body.classList.toggle('mode-c',m==='c');}catch(e){}
try{if(m==='c'&&cur)_wm0=JSON.parse(JSON.stringify((qStats[cur.id]||{}).wrong||{}));}catch(e){}
};
var _srD=selectRoute;
selectRoute=function(r){clearDbMarks();var ov=document.getElementById('routeDebrief');if(ov)ov.remove();_wm0=null;_srD(r);};
var _rcD=routeCelebrate;
routeCelebrate=function(){
_rcD();
try{
if(!cur)return;
if(_wm0===null)return; /*[FIX] niente Cieco in questa sessione = niente debrief (in Studio non si "sbaglia")*/
var wm=(qStats[cur.id]||{}).wrong||{};
var wrongs=[];
Object.keys(wm).forEach(function(k){
var prev=(_wm0&&_wm0[k])||0;
if(wm[k]>prev)wrongs.push(+k);
});
var nx=rSR[cur.id]&&rSR[cur.id].due?Math.max(1,Math.round((rSR[cur.id].due-Date.now())/86400000)):null;
var old=document.getElementById('routeDebrief');if(old)old.remove();
var o=document.createElement('div');o.id='routeDebrief';
if(!wrongs.length){
o.innerHTML='<div class="rdb ok"><b>✨ Perfetto, nessuna via mancata</b><small>'+(nx?('Prossimo ripasso tra '+nx+' giorni'):'')+'</small></div>';
}else{
/* spirale accorciata: 3+ errori = lo rivedi tra 2 giorni, non tra 9 */
if(wrongs.length>=3){try{rSR[cur.id]={box:1,due:Date.now()+2*86400000};ls('rSR',rSR);markDirty('prefs');nx=2;}catch(e){}}
var names=wrongs.slice(0,6).map(function(i){return '<span class="rdb-via" data-i="'+i+'">'+(i+1)+'. '+esc(cur.steps[i])+'</span>';}).join('');
o.innerHTML='<div class="rdb warn"><b>'+wrongs.length+' vie mancate</b><div class="rdb-list">'+names+'</div><small>Te le rimetto tra '+(nx||2)+' giorni · tocca una via per vederla</small></div>';
/* pin ROSSI dove hai sbagliato: l\'errore va visto nel posto dove vive */
clearDbMarks();
wrongs.forEach(function(i){
var c=coords[cur.id+'_'+i];
if(c&&map){_dbMarks.push(L.circleMarker([c.lat,c.lon],{radius:11,color:'#E5484D',weight:3,fillColor:'#E5484D',fillOpacity:.25}).addTo(map));}
});
o.addEventListener('click',function(e){
var v=e.target.closest('.rdb-via');
if(v){var i=+v.dataset.i,c=coords[cur.id+'_'+i];if(c&&map)map.setView([c.lat,c.lon],16);return;}
});
}
var x=document.createElement('button');x.className='rdb-x';x.textContent='✕';
x.onclick=function(){o.remove();clearDbMarks();};
o.firstChild.appendChild(x);
document.body.appendChild(o);
setTimeout(function(){try{o.remove();clearDbMarks();}catch(e){}},wrongs.length?14000:6000);
}catch(e){}
};
}catch(e){}

/* ── (B) VIE NERE TRASVERSALI: la via che sbagli in più percorsi ── */
try{
var _ctV=coachTasks;
coachTasks=function(){
var t=_ctV();
try{
var byName={};
routes.forEach(function(r){
var wm=(qStats[r.id]||{}).wrong||{};
Object.keys(wm).forEach(function(k){
if(wm[k]>0&&r.steps[+k]){
var nm=r.steps[+k];
byName[nm]=byName[nm]||{n:0,routes:[]};
byName[nm].n+=wm[k];
if(byName[nm].routes.indexOf(r.id)<0)byName[nm].routes.push(r.id);
}
});
});
var nere=Object.keys(byName).filter(function(nm){return byName[nm].routes.length>=2;})
.sort(function(a,b){return byName[b].n-byName[a].n;});
if(nere.length>=3){
t.push({ic:'🖤',tx:'Le tue '+Math.min(nere.length,5)+' vie nere',sub:nere.slice(0,3).join(' · ')+' — le sbagli in più percorsi',fn:function(){
var msg='🖤 VIE NERE (sbagliate in più percorsi):\n\n'+nere.slice(0,5).map(function(nm){return '• '+nm+' — '+byName[nm].n+' errori in '+byName[nm].routes.length+' percorsi';}).join('\n')+'\n\nImpara QUESTE: valgono per tutti i percorsi dove compaiono.';
alert(msg);
},p:2.2});
t.sort(function(a,b){return a.p-b.p;});t=t.slice(0,4);
}
}catch(e){}
return t;
};
}catch(e){}

/* ── (1) aggancio copertina alla scheda errori esistente ── */
try{
var _qscC=qStartCat;
qStartCat=function(cid){
if(cid!=='errata'){_qscC(cid);return;}
buildQuiz();
var all=QUIZ_ALL.filter(function(it){return qtStats.err[it.id];});
if(!all.length){_qscC(cid);return;}
var now=Date.now();
all.sort(function(a,b){
var da=srDue(a.id),db=srDue(b.id);
var oa=da<=now?0:1,ob=db<=now?0:1;
if(oa!==ob)return oa-ob;
if(da!==db)return da-db;
return ((qtStats.wrongN||{})[b.id]||0)-((qtStats.wrongN||{})[a.id]||0);
});
var tot=all.length,deck=all.slice(0,40);
var title=Math.ceil(tot/40)>1?('Scheda errori · '+deck.length+' di '+tot):'Ripasso errori';
showErrCover(deck,title,function(){startQuiz(deck,{mode:'study',title:title,scheda:true});});
};
}catch(e){}

})();

/* [FIX 2000] gli overlay contestuali muoiono col cambio scena:
il debrief appartiene alla mappa, la copertina al quiz — se navighi
altrove spariscono invece di galleggiare sulla scena sbagliata. */
(function(){
'use strict';
function _killTopoOv(){try{var d=document.getElementById('routeDebrief');if(d)d.remove();}catch(e){}try{if(typeof clearDbMarks==='function')clearDbMarks();}catch(e){}}
function _killQuizOv(){try{var c=document.getElementById('errCover');if(c)c.remove();}catch(e){}}
try{
var _ghO=goHome;goHome=function(){_killTopoOv();_killQuizOv();_ghO();};
var _oqO=openQuiz;openQuiz=function(){_killTopoOv();_oqO();};
var _osO=openStudy;openStudy=function(){_killTopoOv();_killQuizOv();_osO();};
var _gtO=goTopografia;goTopografia=function(){_killQuizOv();_gtO();};
}catch(e){}
})();


/* [FIX quiz] la ✕ del run diceva "i progressi andranno persi" — non è più vero:
il registro per-risposta li salva. Testo onesto, stesso comportamento. */
(function(){
'use strict';
try{
window.qConfirmExit=function(){
if(confirm('Vuoi uscire dal quiz? Le risposte già date sono salvate; le domande non ancora fatte restano in coda.')){
if(typeof Q!=='undefined'&&Q&&Q.timer){clearInterval(Q.timer);Q.timer=null;}
Q=null;
try{qStopSpeak();}catch(e){}
renderDash();showQView('dash');
}
};
}catch(e){}
})();
