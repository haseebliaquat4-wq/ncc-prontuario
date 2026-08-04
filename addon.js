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

/* ═══════════════════════════════════════════════════
   ADDON HOME — suggerimenti vivi + countdown esame grande
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── SUGGERIMENTI: pool triplo + personali, uno DIVERSO a ogni apertura ── */
var TIPS2=[
/* metro */
'Centrale FS: interscambio M2 Verde ↔ M3 Gialla',
'Loreto: interscambio M1 Rossa ↔ M2 Verde',
'Porta Garibaldi: M2 ↔ M5 Lilla, più i treni regionali',
'Lotto: interscambio M1 Rossa ↔ M5 Lilla',
'Sant\u2019Ambrogio: interscambio M2 Verde ↔ M4 Blu',
'Zara: interscambio M3 Gialla ↔ M5 Lilla',
/* strade */
'A4 Torino\u2013Venezia: l\u2019asse nord di Milano',
'L\u2019A1 del Sole parte verso Bologna dall\u2019uscita di Melegnano',
'A7 per Genova: esce da Milano a sud-ovest',
'Tangenziale Est A51: collega Melegnano alla Brianza',
'Tangenziale Nord A52: cerniera tra Rho e Monza',
'SS35 dei Giovi: la direttrice della Comasina verso Meda',
'A8 dei Laghi: parte dalla barriera di Milano Nord verso Varese',
'A50, A51, A52: Ovest, Est, Nord — le tre tangenziali in ordine',
/* regole d\u2019esame */
'16 domande in 30 minuti: 1 minuto e 52 secondi l\u2019una',
'Rileggi sempre le domande con NON, MAI e SOLO: è lì che si cade',
'Max 2 errori per argomento: un argomento debole boccia da solo',
/* metodo */
'Gli errori di ieri ripassati oggi si fissano il doppio',
'Il Cieco è il vero test: lo Studio serve solo a costruire la mappa',
'Sbagliare qui è gratis. Sbagliare all\u2019esame no: sbaglia adesso',
'Meglio chiudere una scheda errori che aprire dieci argomenti',
'Ripetere ad alta voce le vie in ordine: all\u2019orale conta la sequenza',
/* app */
'Long-press su una via: vedi in quanti percorsi compare',
'\u26a1 Riscaldamento prima della simulazione: 5 errori in 2 minuti',
'Tocca il punto debole nel Quiz per lanciare una missione',
'Il bottone \u25b6 5 minuti pesca sempre le domande a più alto rischio',
'Completa un percorso in Cieco: la scia dorata è il tuo momento'
];
function personalTips(){
var out=[];
try{
var due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=Date.now();}).length;
if(due>0)out.push('Hai '+due+' error'+(due===1?'e':'i')+' in scadenza: la memoria li perde OGGI');
var worst=null,wr=1.01;
QARG.forEach(function(c){var s=qtStats.cat[c.id];if(s&&(s.seen||0)>=6){var r=(s.ok||0)/s.seen;if(r<wr){wr=r;worst=c;}}});
if(worst&&wr<.7)out.push('Il tuo punto debole è '+worst.label+' ('+Math.round(wr*100)+'%): max 2 errori per argomento all\u2019esame');
var st=lg('streak',null);
if(st&&st.n>=5)out.push('\ud83d\udd25 '+st.n+' giorni di fila: la costanza sta battendo il talento');
var r2=lg('retScore',null);
if(r2&&r2.tot&&Date.now()-r2.ts<14*86400000){var p=Math.round(r2.ok/r2.tot*100);if(p>=80)out.push('Ritenzione al '+p+'%: la tua memoria sta tenendo, avanti così');}
}catch(e){}
return out;
}
try{
window.renderTip=function(){
try{
var hd=document.querySelector('#homeScreen .home-hd');if(!hd)return;
var el=document.getElementById('tipLine');
if(!el){el=document.createElement('div');el.id='tipLine';hd.appendChild(el);}
var pool=TIPS.concat(TIPS2).concat(personalTips());
var hist=lg('tipHist',[]);
var cand=pool.filter(function(t){return hist.indexOf(t)<0;});
if(!cand.length)cand=pool;
var pick=cand[Math.floor(Math.random()*cand.length)];
hist.push(pick);while(hist.length>6)hist.shift();
ls('tipHist',hist);
el.textContent='\ud83d\udca1 '+pick;
}catch(e){}
};
}catch(e){}

/* ── COUNTDOWN ESAME grande e animato, gemello del traguardo ── */
try{
var _rpE=renderPlan;
renderPlan=function(){
_rpE();
try{
var btn=document.querySelector('.plan-exam');if(!btn)return;
var ed=lg('examDate',null);if(!ed)return;
var d=Math.max(0,Math.ceil((new Date(ed).getTime()-Date.now())/86400000));
if(!isFinite(d))return;
btn.classList.add('plan-exam-big');
btn.innerHTML='<b class="ex-n">0</b><div class="ex-tx"><strong>giorn'+(d===1?'o':'i')+' all\u2019esame</strong><small>\ud83c\udfaf tocca per cambiare la data</small></div>';
var b=btn.querySelector('.ex-n');
var last=window._exLast;window._exLast=d;
if(last===undefined){b.textContent='0';try{countUp(b,d,700);}catch(e){b.textContent=d;}}
else if(last!==d){b.textContent=String(last);try{countUp(b,d,500);}catch(e){b.textContent=d;}}
else b.textContent=d;
}catch(e){}
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   ADDON HOME — suggerimenti a rotazione + card esame grande
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── suggerimenti: pool triplicato, uno DIVERSO a ogni apertura ── */
var TIPS2=[
/* metro — nodi di interscambio */
'Loreto è interscambio M1 Rossa ↔ M2 Verde',
'Centrale FS: M2 Verde ↔ M3 Gialla sotto la stazione',
'Garibaldi FS è interscambio M2 ↔ M5 Lilla',
'Zara è interscambio M3 Gialla ↔ M5 Lilla',
'Lotto è interscambio M1 Rossa ↔ M5 Lilla',
'Sant\u2019Ambrogio è interscambio M2 Verde ↔ M4 Blu',
'M5 Lilla: da Bignami a San Siro Stadio',
'M4 Blu: da Linate a San Cristoforo, passa per San Babila',
'M3 Gialla: da Comasina a San Donato',
/* strade e autostrade */
'Tangenziali: Est = A51, Ovest = A50, Nord = A52, Est Esterna = A58',
'A50 Tangenziale Ovest: da Assago (A7) fino alla A8 verso Rho',
'A50 Ovest: incrocia la SS494 Vigevanese e la A1 a sud',
'A51 Tangenziale Est: da San Donato (A1) verso Usmate e la SS36',
'A51 Est: l\u2019uscita Forlanini serve l\u2019aeroporto di Linate',
'A52 Tangenziale Nord: collega Sesto S.G. (A51) con Rho (A8)',
'A52 Nord: aggancia la Milano\u2013Meda (SS35) a Paderno Dugnano',
'A58 TEEM: da Melegnano (A1) ad Agrate (A4), fuori dalle tangenziali storiche',
'A4 Torino\u2013Venezia: corre a nord della città',
'A1 del Sole parte da Milano Sud (Melegnano)',
'A8/A9 dei Laghi partono dalla barriera di Milano Nord',
'SS35 dei Giovi: la Milano\u2013Meda verso Como',
'Naviglio Grande e Naviglio Pavese partono dalla Darsena',
/* trappole d'esame */
'Occhio a NON, SOLO e SEMPRE: metà degli errori nasce lì',
'Leggi TUTTE le risposte: la prima "quasi giusta" è una trappola',
'Se due risposte sembrano uguali, la differenza è in UNA parola',
'16 domande, 4 argomenti: un argomento debole boccia da solo',
/* metodo */
'Gli errori di ieri ripassati oggi si fissano il doppio',
'Il Cieco vale il doppio dello Studio: prima copri, poi ricorda',
'Tieni premuto su una via: scopri in quanti percorsi compare',
'⚡ Riscaldamento prima della simulazione: 5 errori in 2 minuti',
'Prima la scheda errori, poi le nuove: si costruisce sul solido',
'In Cieco ripeti ad alta voce: "la settima via è\u2026"',
'Sbagliare in allenamento è il modo più veloce di imparare',
'Tocca il punto debole nel Quiz: parte una missione 🎯'
];
/* suggerimenti dai TUOI errori: la domanda che sbagli spesso diventa ripasso-lampo */
function personalTips(){
try{
buildQuiz();
var wn=qtStats.wrongN||{};
var ids=Object.keys(wn).filter(function(id){return wn[id]>=2;})
.sort(function(a,b){return wn[b]-wn[a];}).slice(0,20);
return ids.map(function(id){
var it=QUIZ_ALL[id|0];if(!it||!it.choices)return null;
var q=it.q.length>72?it.q.slice(0,70)+'…':it.q;
var a=it.choices[it.correct]||'';if(a.length>60)a=a.slice(0,58)+'…';
return '📌 '+q+' → '+a;
}).filter(Boolean);
}catch(e){return [];}
}
var _tipTxt=null;
try{
window.renderTip=function(){
try{
var hd=document.querySelector('#homeScreen .home-hd');if(!hd)return;
var el=document.getElementById('tipLine');
if(!el){el=document.createElement('div');el.id='tipLine';hd.appendChild(el);}
if(_tipTxt===null){
var pers=personalTips();
if(pers.length&&Math.random()<0.5){
_tipTxt=pers[Math.floor(Math.random()*pers.length)];
}else{
var pool=(typeof TIPS!=='undefined'&&TIPS.length?TIPS:[]).concat(TIPS2);
_tipTxt='💡 '+pool[Math.floor(Math.random()*pool.length)];
}
el.classList.add('tip-in');
}
el.textContent=_tipTxt;
}catch(e){}
};
}catch(e){}

/* ── card ESAME: gemella del traguardo — numero grande, contachilometri, respiro ── */
function bigExam(){
try{
var btn=document.querySelector('.plan-exam');if(!btn)return;
var d=lg('examDate',null);if(!d)return;
var days=Math.max(0,Math.ceil((new Date(d).getTime()-Date.now())/86400000));
btn.classList.add('ex-big');
btn.innerHTML='<b>0</b><div class="ex-tx"><strong>giorn'+(days===1?'o':'i')+' all\u2019esame</strong><small>Tocca per cambiare la data</small></div><span class="ex-ic">🎯</span>';
var b=btn.querySelector('b');
var last=window._exLast;window._exLast=days;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){b.textContent=days;return;}
if(last!==undefined&&last!==days){b.textContent=String(last);try{countUp(b,days,500);}catch(e){b.textContent=days;}}
else{try{countUp(b,days,700);}catch(e){b.textContent=days;}}
}catch(e){}
}
try{
var _rpX=renderPlan;
renderPlan=function(){_rpX();bigExam();};
}catch(e){}
setTimeout(bigExam,900);

})();

/* ═══════════════════════════════════════════════════
   ADDON "IL COACH TI HA VISTO" — ricalibrato sul tuo ritmo reale
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── 1 · PRONTEZZA ONESTA: solo Quiz + Mappa (Luoghi escluso, come da tua regola) ── */
try{
window.readinessScore=function(){
var qok=0,qseen=0;try{var c=qtStats.cat||{};Object.keys(c).forEach(function(k){qok+=c[k].ok||0;qseen+=c[k].seen||0;});}catch(e){}
var quiz=qseen?Math.round(qok/qseen*100):0;
var rdone=0,rtot=0;try{rtot=routes.length;rdone=routes.filter(function(r){return done[r.id];}).length;}catch(e){}
var topo=rtot?Math.round(rdone/rtot*100):0;
return {score:Math.round(quiz*0.6+topo*0.4),quiz:quiz,flash:0,topo:topo};
};
}catch(e){}
/* la riga sotto l'anello non nomina più Luoghi */
try{
var _rrH=renderReadiness;
renderReadiness=function(){
_rrH();
try{
var sm=document.querySelector('#readyCard .ready-tx small');
var r=readinessScore();
if(sm)sm.textContent='Quiz '+r.quiz+'% · Mappa '+r.topo+'%';
}catch(e){}
};
}catch(e){}

/* ── 2 · GIRO COMPLETO + 9 · MODALITÀ DIFESA ── */
window.showLapDone=function(){
try{
if(document.getElementById('lapDone'))return;
var o=document.createElement('div');o.id='lapDone';
o.innerHTML='<div class="gm-card lap"><div class="gm-e">🏁</div><h2>GIRO COMPLETO</h2>'
+'<p>Tutte le domande viste, tutti i percorsi completati.<br>Da oggi si cambia pelle: <b>ritenzione, simulazioni, recidive</b>.<br>Non si impara più — si difende.</p>'
+'<button onclick="document.getElementById(\'lapDone\').remove()">Modalità difesa 🛡️</button></div>';
o.addEventListener('click',function(e){if(e.target===o)o.remove();});
document.body.appendChild(o);
try{confetti();setTimeout(confetti,600);}catch(e){}
}catch(e){}
};
try{
var _rpV=renderPlan;
renderPlan=function(){
_rpV();
try{
var ti=targetInfo();
if(!ti||!ti.doneAll)return;
if(!lg('lapDone',false)){ls('lapDone',true);setTimeout(window.showLapDone,800);}
var w=document.getElementById('planCard');if(!w)return;
var d=lg('examDate',null);
var days=d?Math.max(0,Math.ceil((new Date(d).getTime()-Date.now())/86400000)):null;
w.innerHTML='<div class="tg-card defense" onclick="setExamDate()">'
+'<div class="tg-hd"><b>'+(days!==null?days:'—')+'</b>'
+'<div><strong>giorni all\u2019esame · 🛡️ modalità difesa</strong>'
+'<small>Copertura completa ✓ — ora: ritenzione, simulazioni, recidive</small></div></div></div>';
/* contachilometri anche qui: il numero verde rolla come gli altri */
try{
if(days!==null&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
var db=w.querySelector('.tg-hd b');
var lastD=window._dfLast;window._dfLast=days;
if(db){if(lastD!==undefined&&lastD!==days){db.textContent=String(lastD);countUp(db,days,500);}else{db.textContent='0';countUp(db,days,700);}}
}
}catch(e){}
}catch(e){}
};
}catch(e){}

/* ── 3+7+8 · COACH RICALIBRATO ── */
try{
var _ctR=coachTasks;
coachTasks=function(){
var t=_ctR();
try{
var ti=targetInfo();
var now=Date.now();
/* 7 · task da 1-2 errori = rumore: li copre la sessione 5 minuti */
var due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=now;}).length;
if(due>0&&due<3){
t=t.filter(function(x){return x.ic!=='🔁';});
}
/* 3 · copertura alta ma poche simulazioni: la vera incognita ora è quella */
var cov=ti?ti.pctQ:Math.round(Object.keys(qtStats.seenIds||{}).length/(QUIZ_ALL.length||919)*100);
var simsW=(qExamHist||[]).filter(function(x){return x.d&&(now-x.d)<7*86400000;}).length;
if(cov>=80&&simsW<2){
var ex=t.find(function(x){return x.ic==='🎓';});
if(ex){ex.p=0.8;ex.sub='Copertura al '+cov+'%: ora contano le simulazioni ('+simsW+' questa settimana, servono 2-3)';}
else t.push({ic:'🎓',tx:'Simulazione d\u2019esame',sub:'Copertura al '+cov+'%: ora contano le simulazioni ('+simsW+' su 2-3 settimanali)',fn:function(){openQuiz();setTimeout(qStartExam,250);},p:0.8});
}
/* 8 · sei più veloce del piano: il coach propone di accorciare il traguardo */
if(ti&&!ti.doneAll&&ti.days>21&&lg('tgFastDay','')!==new Date().toDateString()){
var dd=qtStats.daily||{},sum=0;
for(var i=1;i<=7;i++){var dt=new Date();dt.setDate(dt.getDate()-i);sum+=dd[_dayKey(dt)]||0;}
var avg=sum/7;
if(avg>=40){
var remaining=Math.max(0,ti.qT-ti.seen);
var est=Math.ceil(remaining/Math.max(10,avg*0.25));
if(ti.days>est*2+10){
t.push({ic:'⏩',tx:'Sei più veloce del piano',sub:'A questo ritmo copri tutto in ~'+est+' giorni (traguardo: '+ti.days+'). Tocca per accorciarlo',fn:function(){
ls('tgFastDay',new Date().toDateString());
toast2('💡 Suggerimento: prova '+(est+7)+' giorni');
setTimeout(setTargetDate,600);
},p:2.4});
}
}
}
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   ADDON SPIRALE VISIBILE — i percorsi tornano nei giorni giusti, e si vede
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── registro completamenti (per il "percorso di ieri") ── */
try{
var _rcS=routeCelebrate;
routeCelebrate=function(){
var firstTime=false;
try{firstTime=!!(cur&&!(rSR[cur.id]&&rSR[cur.id].box));}catch(e){}
_rcS();
try{
if(!cur)return;
var log=lg('rDoneLog',{});log[cur.id]=Date.now();
var ks=Object.keys(log);if(ks.length>150){ks.sort(function(a,b){return log[a]-log[b];});delete log[ks[0]];}
ls('rDoneLog',log);
/* PRIMO completamento → primo ripasso DOMANI (24h), poi la spirale normale */
if(firstTime&&rSR[cur.id]){
rSR[cur.id].due=Date.now()+86400000;
ls('rSR',rSR);markDirty('prefs');
}
/* catena: se ci sono ALTRI percorsi in scadenza, il debrief propone il prossimo */
setTimeout(function(){
try{
var now=Date.now();
var nx=routes.find(function(r){return r.id!==cur.id&&rSR[r.id]&&rSR[r.id].due<=now;});
if(!nx)return;
var card=document.querySelector('#routeDebrief .rdb');if(!card)return;
if(card.querySelector('.rdb-next'))return;
var b=document.createElement('button');
b.className='rdb-next';
b.textContent='▶ Prossimo in scadenza: '+(nx.title.length>26?nx.title.slice(0,24)+'…':nx.title);
b.onclick=function(){
var ov=document.getElementById('routeDebrief');if(ov)ov.remove();
try{clearDbMarks();}catch(e){}
selectRoute(nx);setTimeout(function(){setMode('c');},250);
};
card.appendChild(b);
}catch(e){}
},600);
}catch(e){}
};
}catch(e){}

/* ── coach: "il percorso di ieri" + scadenze in blocco ── */
try{
var _ctS=coachTasks;
coachTasks=function(){
var t=_ctS();
try{
var now=Date.now(),today=new Date().toDateString();
/* percorso completato IERI → ripasso a 24h (come gli errori di ieri) */
if(lg('rY1day','')!==today){
var log=lg('rDoneLog',{});
var yid=Object.keys(log).find(function(id){
var age=now-log[id];
return age>16*3600000&&age<40*3600000&&routes.find(function(r){return r.id===id;})&&rSR[id]&&(rSR[id].box||0)<=1;
});
if(yid){
var yr=routes.find(function(r){return r.id===yid;});
t.unshift({ic:'🌄',tx:'Il percorso di ieri, in Cieco',sub:yr.title+' — rivederlo a 24 ore lo fissa il doppio',fn:function(){
ls('rY1day',today);
goTopografia();
setTimeout(function(){selectRoute(yr);setTimeout(function(){setMode('c');},250);},300);
},p:0.5});
}
}
/* 2+ percorsi in scadenza → un task unico "in blocco" */
var dueR=routes.filter(function(r){return rSR[r.id]&&rSR[r.id].due<=now;});
if(dueR.length>=2){
t=t.filter(function(x){return x.ic!=='🗺️';});
var names=dueR.slice(0,3).map(function(r){return r.title.length>18?r.title.slice(0,16)+'…':r.title;}).join(' · ');
t.push({ic:'🗺️',tx:dueR.length+' percorsi in scadenza',sub:names+(dueR.length>3?' e altri':'')+' — in catena, uno dopo l\u2019altro',fn:function(){
goTopografia();
setTimeout(function(){selectRoute(dueR[0]);setTimeout(function(){setMode('c');},250);},300);
},p:1.4});
}
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}

/* ── LA CODA VISIBILE: card "Prossimi ripassi percorsi" in home ── */
function renderSpiral(){
try{
var w=document.getElementById('planCard');if(!w)return;
var old=document.getElementById('spiralCard');if(old)old.remove();
var withSR=routes.filter(function(r){return rSR[r.id]&&rSR[r.id].due;});
if(!withSR.length)return;
var now=Date.now();
withSR.sort(function(a,b){return rSR[a.id].due-rSR[b.id].due;});
var rows=withSR.slice(0,5).map(function(r){
var d=Math.ceil((rSR[r.id].due-now)/86400000);
var when=d<=0?'<b class="sp-now">oggi</b>':(d===1?'<b>domani</b>':'<b>tra '+d+' g</b>');
var tt=r.title.length>26?r.title.slice(0,24)+'…':r.title;
return '<div class="sp-row" data-id="'+r.id+'"><span>'+esc(tt)+'</span>'+when+'</div>';
}).join('');
var el=document.createElement('div');el.id='spiralCard';
el.innerHTML='<div class="sp-hd">🌀 Prossimi ripassi percorsi</div>'+rows;
el.addEventListener('click',function(e){
var row=e.target.closest('.sp-row');if(!row)return;
var r=routes.find(function(x){return x.id===row.dataset.id;});if(!r)return;
goTopografia();
setTimeout(function(){selectRoute(r);setTimeout(function(){setMode('c');},250);},300);
});
w.after(el);
}catch(e){}
}
try{
var _rpS=renderPlan;
renderPlan=function(){_rpS();renderSpiral();};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   ADDON RECUPERO — numeri onesti + il coach capisce il debito
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── 1 · FIX 107%: si contano solo le domande che esistono davvero ──
seenIds accumula anche id di vecchie versioni del set: la copertura sballava sopra il 100. */
try{
var _tiF=targetInfo;
targetInfo=function(){
var ti=_tiF();
try{
if(!ti)return ti;
var valid=0;
Object.keys(qtStats.seenIds||{}).forEach(function(id){if(QUIZ_ALL[id|0])valid++;});
ti.seen=Math.min(valid,ti.qT);
ti.pctQ=Math.min(100,Math.round(ti.seen/ti.qT*100));
ti.pctR=Math.min(100,ti.pctR);
ti.doneAll=(ti.seen>=ti.qT*0.98&&ti.pctR>=98);/* 98% = copertura di fatto completa */
}catch(e){}
return ti;
};
}catch(e){}

/* ── 2 · IL DEBITO: quanto lavoro arretrato hai davvero ── */
window.debtInfo=function(){
try{
buildQuiz();
var now=Date.now(),ids=Object.keys(qtStats.err||{});
var due=ids.filter(function(id){return srDue(id)<=now;});
var old3=due.filter(function(id){return now-srDue(id)>3*86400000;}).length;
var dueR=routes.filter(function(r){return rSR[r.id]&&rSR[r.id].due<=Date.now();}).length;
var byCat={};
due.forEach(function(id){var it=QUIZ_ALL[id|0];if(it)byCat[it.cat]=(byCat[it.cat]||0)+1;});
var topId=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];})[0];
return {open:ids.length,due:due.length,old3:old3,dueR:dueR,topId:topId,topN:byCat[topId]||0,
heavy:(due.length>=100||old3>=60)};
}catch(e){return {open:0,due:0,old3:0,dueR:0,heavy:false};}
};

/* ── 3 · PILLOLA ONESTA: "In anticipo" non vale se hai 193 errori arretrati ── */
try{
var _rpD=renderPlan;
renderPlan=function(){
_rpD();
try{
var d=debtInfo();
var pill=document.querySelector('.tg-pill');
if(pill&&d.due>=50){
pill.className='tg-pill late';
pill.textContent='Indietro sugli errori · '+d.due;
}
/* barra del debito sotto le due copertura */
var card=document.querySelector('.tg-card');
if(card&&!card.querySelector('.tg-debt')&&d.due>0){
var pct=Math.min(100,Math.round(d.due/Math.max(1,d.open)*100));
var rows=card.querySelectorAll('.tg-row');
var el=document.createElement('div');el.className='tg-row tg-debt';
el.innerHTML='<span>🔁 Errori</span><div class="tg-bar debt"><i style="width:'+pct+'%"></i></div><b>'+d.due+'</b>';
if(rows.length)rows[rows.length-1].after(el);
}
}catch(e){}
};
}catch(e){}

/* ── 4 · MODALITÀ RECUPERO: copertura fatta + debito pesante = si cambia strategia ── */
try{
var _rcW=renderCoach;
renderCoach=function(){
_rcW();
try{
var d=debtInfo();
var why=document.querySelector('.coach-why');
if(!why)return;
if(d.heavy){
var giorni=Math.ceil(d.due/40);
why.textContent='🚑 Modalità recupero: '+d.due+' errori scaduti'+(d.old3?(' ('+d.old3+' da 3+ giorni)'):'')+'. Stop alle nuove: '+giorni+' giorni a 40 al giorno e sei in pari.';
why.classList.add('why-alert');
}else why.classList.remove('why-alert');
}catch(e){}
};
}catch(e){}

/* ── 5 · COACH: priorità ribaltate quando il debito è pesante ── */
try{
var _ctD=coachTasks;
coachTasks=function(){
var t=_ctD();
try{
var d=debtInfo();
if(!d.heavy)return t;
/* le nuove domande NON servono: la copertura è fatta, il problema è tenerla */
t=t.filter(function(x){return x.ic!=='🆕'&&x.ic!=='⏩';});
/* la scheda errori diventa la prima cosa, con il conto delle schede */
var sc=t.find(function(x){return x.ic==='🔁';});
if(sc){sc.p=0.2;}
else t.unshift({ic:'🔁',tx:'Scheda errori 1 di '+Math.ceil(d.due/40)+' (40 alla volta)',sub:d.old3+' arretrati da 3+ giorni',fn:function(){openQuiz();setTimeout(function(){qStartCat('errata');},250);},p:0.2});
/* missione automatica sull'argomento che genera il debito */
if(d.topId&&d.topN>=40&&!lg('mission',null)){
var arg=QARG.find(function(c){return c.id===d.topId;});
if(arg){
t.push({ic:'🎯',tx:'Il buco è '+arg.label,sub:d.topN+' dei tuoi errori scaduti sono lì — tocca per una sessione mirata',fn:function(){openQuiz();setTimeout(function(){qStartCat(d.topId);},250);},p:1.1});
}
}
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}

/* ── 6 · CODA PERCORSI: dire quanti e da quanto, non cinque volte "oggi" ── */
try{
var _rpQ=renderPlan;
renderPlan=function(){
_rpQ();
try{
var card=document.getElementById('spiralCard');if(!card)return;
var hd=card.querySelector('.sp-hd');if(!hd)return;
var now=Date.now();
var due=routes.filter(function(r){return rSR[r.id]&&rSR[r.id].due<=now;});
var late=due.filter(function(r){return now-rSR[r.id].due>3*86400000;}).length;
if(due.length)hd.innerHTML='🌀 Ripassi percorsi — <b class="sp-cnt">'+due.length+' in scadenza</b>'+(late?(' · '+late+' da 3+ giorni'):'');
}catch(e){}
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   ADDON IMPARARE — gemelle, risposte mescolate, quasi-promossi
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── 2 · RISPOSTE MESCOLATE: niente più "è la terza" ──
Se l'ordine è fisso, dopo 3 ripassi memorizzi la posizione invece della regola.
Ogni domanda riceve una permutazione diversa a ogni sessione. */
try{
var _sqM=startQuiz;
startQuiz=function(items,opts){
try{
if(!opts||opts.mode!=='exam'){/* in esame si resta fedeli al set originale */
items=items.map(function(it){
if(!it||!it.choices)return it;
var idx=it.choices.map(function(_,i){return i;});
for(var i=idx.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=idx[i];idx[i]=idx[j];idx[j]=tmp;}
var cp=Object.create(Object.getPrototypeOf(it));
Object.keys(it).forEach(function(k){cp[k]=it[k];});
cp.choices=idx.map(function(k){return it.choices[k];});
cp.correct=idx.indexOf(it.correct);
return cp;
});
}
}catch(e){}
_sqM(items,opts);
};
}catch(e){}

/* ── 1 · DOMANDE GEMELLE: la regola, non la risposta ──
Sbagli una domanda → ti mostro subito le altre che testano lo STESSO sotto-argomento.
Se le sbagli tutte, il buco è la regola: quella impari, e ne copri quindici. */
window.qStartTwins=function(it){
try{
buildQuiz();
var pool=QUIZ_ALL.filter(function(x){return x.sub===it.sub&&x.id!==it.id;});
if(pool.length<2){toast2('Nessuna domanda gemella su questo tema');return;}
var twins=qShuffle(pool).slice(0,4);
startQuiz([it].concat(twins),{mode:'study',title:'La stessa regola, 5 modi'});
}catch(e){}
};
/* il bottone appare nel riquadro "perché l'hai sbagliata" */
document.addEventListener('click',function(ev){
try{
var chip=ev.target.closest('.why-chips button');
if(!chip)return;
var it=(typeof Q!=='undefined'&&Q&&Q.items)?Q.items[Q.idx]:null;
if(!it||!it.sub)return;
setTimeout(function(){
try{
var box=document.querySelector('.why-chips');if(!box||document.getElementById('twinBtn'))return;
var n=QUIZ_ALL.filter(function(x){return x.sub===it.sub&&x.id!==it.id;}).length;
if(n<2)return;
var b=document.createElement('button');
b.id='twinBtn';b.className='twin-btn';
b.textContent='🧬 Altre '+Math.min(n,4)+' sulla stessa regola';
b.onclick=function(){qStartTwins(it);};
box.after(b);
}catch(e){}
},120);
}catch(e){}
},true);

/* ── 3 · PRIORITÀ AI QUASI-PROMOSSI ──
Box 2 = una sola risposta giusta e l'errore è archiviato. Box 0 = ne servono tre.
Mettendo davanti i quasi-promossi, la pila si svuota 2-3 volte più in fretta. */
try{
var _qscP=qStartCat;
qStartCat=function(cid){
if(cid!=='errata'){_qscP(cid);return;}
buildQuiz();
var now=Date.now();
var all=QUIZ_ALL.filter(function(it){return qtStats.err[it.id]&&srDue(it.id)<=now;});
if(all.length<5){_qscP(cid);return;}
all.sort(function(a,b){
var ea=qtStats.err[a.id],eb=qtStats.err[b.id];
var ba=(typeof ea==='object'&&ea.box)?ea.box:0;
var bb=(typeof eb==='object'&&eb.box)?eb.box:0;
if(ba!==bb)return bb-ba;                    /* prima i quasi-promossi (box alto) */
return srDue(a.id)-srDue(b.id);             /* poi i più vecchi */
});
var tot=all.length,deck=all.slice(0,40);
var quasi=deck.filter(function(it){var e=qtStats.err[it.id];return e&&e.box>=2;}).length;
var title=tot>40?('Scheda errori · 40 di '+tot):'Ripasso errori';
showErrCover(deck,title+(quasi?(' · '+quasi+' a un passo dall\u2019uscita'):''),function(){
startQuiz(deck,{mode:'study',title:title,scheda:true});
});
};
}catch(e){}

/* ── bilancio del giorno: entrati vs usciti ── */
try{
var _smL=srMark;
srMark=function(id,correct){
var before=qtStats.err[id]!==undefined;
_smL(id,correct);
try{
var after=qtStats.err[id]!==undefined;
var k=_dayKey(),bal=lg('errBal',{});
bal[k]=bal[k]||{in:0,out:0};
if(!before&&after)bal[k].in++;
if(before&&!after)bal[k].out++;
ls('errBal',bal);
}catch(e){}
};
}catch(e){}
try{
var _rcB=renderCoach;
renderCoach=function(){
_rcB();
try{
var b=(lg('errBal',{}))[_dayKey()];if(!b||(!b.in&&!b.out))return;
var why=document.querySelector('.coach-why');if(!why||why.querySelector('.bal'))return;
var net=b.out-b.in;
var s=document.createElement('span');s.className='bal '+(net>=0?'good':'bad');
s.textContent=' · Oggi: +'+b.in+' nuovi, −'+b.out+' smaltiti = '+(net>=0?'−':'+')+Math.abs(net)+(net>=0?' ✅':' ⚠️');
why.appendChild(s);
}catch(e){}
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   ADDON MODELLO STUDENTE — voto atteso, rischio reale, padronanza per tema
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

var SUBLAB={geo_terr:'Geografia · territorio',geo_vie:'Geografia · vie e strade',
norm_legge:'Normativa · legge',norm_aero:'Normativa · aeroporti',
reg_com:'Regolamento · comunale',reg_dov:'Regolamento · doveri',lingua:'Inglese'};

/* probabilità stimata di rispondere GIUSTO a una domanda, oggi */
function pOk(it){
try{
var id=it.id,now=Date.now();
var e=(qtStats.err||{})[id];
if(e&&typeof e==='object'){var b=e.box||0;return 0.34+0.15*b;}     /* in pila: 34/49/64% */
if(!(qtStats.seenIds||{})[id])return 0.55;                          /* mai vista */
var p=((qtStats.wrongN||{})[id]||0)>0?0.84:0.94;                    /* già sbagliata in passato? */
var lo=(qtStats.lastOk||{})[id];
if(lo){var d=(now-lo)/86400000;p-=Math.min(0.16,d*0.004);}          /* decadimento nel tempo */
return Math.max(0.4,p);
}catch(e2){return 0.7;}
}
function binom(n,k,p){
var c=1;for(var i=0;i<k;i++)c=c*(n-i)/(i+1);
return c*Math.pow(p,k)*Math.pow(1-p,n-k);
}
var _mCache=null,_mTs=0;
window.studentModel=function(){
try{
if(_mCache&&Date.now()-_mTs<4000)return _mCache;/*[FIX] niente doppio calcolo per render (scatti)*/
buildQuiz();
var cats=QARG.map(function(c){
var qs=QUIZ_ALL.filter(function(x){return x.cat===c.id;});
if(!qs.length)return null;
var s=0;qs.forEach(function(x){s+=pOk(x);});
var pe=1-(s/qs.length);
var dist=[];for(var k=0;k<=4;k++)dist.push(binom(4,k,pe));
var over=dist[3]+dist[4];                                   /* 3+ errori in questo argomento = bocciato */
return {id:c.id,label:c.label,emoji:c.emoji,pErr:pe,dist:dist,over:over,expErr:4*pe};
}).filter(Boolean);
if(!cats.length)return null;
/* probabilità di passare: nessun argomento oltre 2 errori E totale entro 4 */
var pass=0;
(function walk(i,sum,prob){
if(prob<1e-9)return;
if(i===cats.length){if(sum<=4)pass+=prob;return;}
for(var k=0;k<=2;k++)walk(i+1,sum+k,prob*cats[i].dist[k]);
})(0,0,1);
var expErr=cats.reduce(function(a,c){return a+c.expErr;},0);
var worst=cats.slice().sort(function(a,b){return b.over-a.over;})[0];
/* padronanza per sotto-argomento */
var subs={};
QUIZ_ALL.forEach(function(x){
if(!x.sub)return;
subs[x.sub]=subs[x.sub]||{n:0,s:0};
subs[x.sub].n++;subs[x.sub].s+=pOk(x);
});
var subList=Object.keys(subs).map(function(k){
return {sub:k,label:SUBLAB[k]||k,n:subs[k].n,m:Math.round(subs[k].s/subs[k].n*100)};
}).sort(function(a,b){return a.m-b.m;});
_mCache={expScore:Math.max(0,16-expErr),fail:Math.round((1-pass)*100),cats:cats,worst:worst,subs:subList};
_mTs=Date.now();
return _mCache;
}catch(e){return null;}
};

/* ── card in home: voto atteso + rischio + il colpevole ── */
function renderModel(){
try{
var anchor=document.getElementById('examLight');if(!anchor)return;
var m=studentModel();
var old=document.getElementById('modelCard');if(old)old.remove();
if(!m)return;
if(Object.keys(qtStats.seenIds||{}).length<40)return;/*[FIX] pochi dati = stima inaffidabile: meglio tacere*/
var cls=m.fail<=15?'ok':(m.fail<=40?'mid':'no');
var bars=m.cats.map(function(c){
var risk=Math.round(c.over*100);
var rc=risk<=10?'ok':(risk<=30?'mid':'no');
return '<div class="mc-row"><span>'+c.emoji+' '+c.label+'</span><div class="mc-bar '+rc+'"><i style="width:'+Math.min(100,risk*2)+'%"></i></div><b>'+risk+'%</b></div>';
}).join('');
var el=document.createElement('div');el.id='modelCard';el.className='mc '+cls;
el.innerHTML='<div class="mc-hd"><div><small>VOTO ATTESO OGGI</small><b>'+m.expScore.toFixed(1)+'<span>/16</span></b></div>'
+'<div class="mc-risk"><small>RISCHIO BOCCIATURA</small><b>'+m.fail+'%</b></div></div>'
+'<div class="mc-sub">Rischio di 3+ errori per argomento (all\u2019esame ne bastano 3 per essere respinti)</div>'
+bars
+(m.worst&&m.worst.over>0.12?('<div class="mc-tip">⚠️ Il pericolo è <b>'+m.worst.label+'</b> — tocca per una sessione mirata</div>'):'');
var tip=el.querySelector('.mc-tip');
if(tip)tip.addEventListener('click',function(){openQuiz();setTimeout(function(){qStartCat(m.worst.id);},250);});/*[FIX] solo il consiglio avvia, non tutta la card*/
anchor.after(el);
}catch(e){}
}
try{
var _relM2=renderExamLight;
renderExamLight=function(){_relM2();renderModel();};
}catch(e){}

/* ── coach: il tema più debole, non l'argomento generico ── */
try{
var _ctS2=coachTasks;
coachTasks=function(){
var t=_ctS2();
try{
var m=studentModel();if(!m||!m.subs.length)return t;
var w=m.subs[0];
if(w.m>=70||w.n<8)return t;
t.push({ic:'🔬',tx:'Il tuo tema più debole: '+w.label,sub:'Padronanza '+w.m+'% su '+w.n+' domande — 12 domande solo su questo',fn:function(){
buildQuiz();
var pool=QUIZ_ALL.filter(function(x){return x.sub===w.sub;});
pool.sort(function(a,b){return pOk(a)-pOk(b);});
openQuiz();
setTimeout(function(){startQuiz(qShuffle(pool.slice(0,12)),{mode:'study',title:w.label});},250);
},p:1.3});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}

})();
