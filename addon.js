/* ═══════════════════════════════════════════════════
   STILE INCORPORATO — addon.css non esiste più sul sito:
   tutto lo stile vive qui e viene applicato al caricamento.
   ═══════════════════════════════════════════════════ */
(function(){
try{
var s=document.getElementById('addonInline');
if(!s){s=document.createElement('style');s.id='addonInline';document.head.appendChild(s);}
s.textContent=`/* ═══════════════════════════════════════════════════
   ADDON DESIGN v1 — sopra il core congelato
   Rollback: commenta le 2 righe nell'index
   ═══════════════════════════════════════════════════ */

/* ── 1+2+3 · TIPOGRAFIA: scala a 6 livelli + numeri display + gerarchia ── */
.rd{--t1:12px;--t2:14px;--t3:17px;--t4:21px;--t5:26px;--t6:34px;}
.rd .home-title{font-size:var(--t6);}
.rd .qcard-hero h2,.rd .sd-hero h2{font-size:var(--t5);}
.rd .ptrow h2,.rd .qana-title{font-size:var(--t4);}
.rd .qtile-tx strong,.rd .home-card .hc-tx strong{font-size:var(--t3);}
.rd .coach-tx b,.rd .plan-tx strong,.rd .ready-tx strong{font-size:var(--t2);font-weight:750;color:var(--tx);}
.rd .coach-tx small,.rd .plan-tx small,.rd .qtile-tx small,.rd .home-card .hc-tx small{font-size:var(--t1);color:var(--lbl2);}
/* numeri protagonisti: peso display, tracking stretto */
.rd .tg-hd>b,.rd .qres-stat b,.rd .qerr-num,.rd .ready-ring span,.rd .plan-card b{
font-weight:850;letter-spacing:-.04em;font-variant-numeric:tabular-nums;
}

/* ── 4 · COLORE SEMANTICO DEGLI ARGOMENTI ── */
.rd{--cat0:#2447D6;--cat1:#6D5AE0;--cat2:#D97706;--cat3:#0E9F6E;}
.catc0 .qtile-ic{background:rgba(36,71,214,.13)!important;}
.catc1 .qtile-ic{background:rgba(109,90,224,.13)!important;}
.catc2 .qtile-ic{background:rgba(217,119,6,.13)!important;}
.catc3 .qtile-ic{background:rgba(14,159,110,.13)!important;}
.qarg-box.catc0{border-left:4px solid var(--cat0);}
.qarg-box.catc1{border-left:4px solid var(--cat1);}
.qarg-box.catc2{border-left:4px solid var(--cat2);}
.qarg-box.catc3{border-left:4px solid var(--cat3);}
.qtop-group.catc0{color:var(--cat0);}.qtop-group.catc1{color:var(--cat1);}
.qtop-group.catc2{color:var(--cat2);}.qtop-group.catc3{color:var(--cat3);}

/* ── 5 · DARK: terzo livello di superficie ── */
.rd.dark{--card2:#1B2130;}
.rd.dark .coach-ic,.rd.dark .qerr-box,.rd.dark .qrun-meta,.rd.dark .ord-slot,.rd.dark .qtop-emoji{background:var(--card2);}
.rd.dark .coach-row:active{background:var(--card2);}

/* ── 6+12 · DIETA DEL ROSSO + pesi giusti nel quiz run ── */
.rd .qrun-x{border-color:var(--bd);color:var(--mu);} /* la ✕ è solo "indietro": non deve urlare */
.rd .qrun-end{box-shadow:0 6px 18px rgba(36,71,214,.38);font-weight:750;}
/* "le più sbagliate": ambra, non rosso (il rosso resta a errori veri e semaforo) */
#qDash [onclick="qStartHard()"] .qtile-ic{background:rgba(217,119,6,.13)!important;color:var(--warn)!important;}

/* ── 7 · micro-lucido sulle pastiglie icona ── */
.qtile-ic,.coach-ic,.sd-tile-ic,.home-card .hc-ic{position:relative;overflow:hidden;}
.qtile-ic::after,.coach-ic::after,.sd-tile-ic::after,.home-card .hc-ic::after{
content:'';position:absolute;inset:0;pointer-events:none;
background:linear-gradient(160deg,rgba(255,255,255,.22),transparent 55%);
}
.rd.dark .qtile-ic::after,.rd.dark .coach-ic::after,.rd.dark .sd-tile-ic::after,.rd.dark .home-card .hc-ic::after{
background:linear-gradient(160deg,rgba(255,255,255,.08),transparent 55%);
}

/* ── 8 · griglia 4px sui contenitori chiave ── */
.rd .coach{padding:8px;}
.rd .coach-row{padding:12px;gap:12px;}
.rd .qtile,.rd .sd-tile{padding:16px;gap:16px;}
.rd .tg-card{padding:16px;}
.rd .plan-card,.rd .ready-card{padding:16px;}
.rd .brow{gap:8px;}

/* ── 9 · ritmo della home: stato compatto, azioni staccate ── */
#examLight{margin-top:8px;}
#coachCard{margin-top:20px;}
.smart-btn{margin-top:20px;}
#weekChart{margin-top:12px;}
#planCard{margin-top:8px;}

/* ── 10 · allineamento ottico icone ── */
.coach-ic svg,.qtile-ic svg{transform:translateY(.5px);}

/* ── 11 · pillole quiz → barra segmentata ── */
.qrun-pills{padding:7px 8px;gap:3px;align-items:center;border-radius:16px;}
.qpill{flex:1;min-width:8px;height:10px;border-radius:5px;font-size:0;padding:0;background:var(--fill2);transition:height .2s,background .2s,flex .2s;}
.qpill.ans{background:var(--a);}
.qpill.good{background:var(--ok);}
.qpill.bad{background:var(--err);}
.qpill.cur{flex:1.6;height:22px;min-width:26px;font-size:12px;font-weight:750;background:var(--card);border:2px solid var(--a);color:var(--a);border-radius:8px;}
.qpill.ans.cur{background:var(--card);color:var(--a);}

/* ── 13 · ricerca e chip alla stessa altezza esatta ── */
#sb{height:46px;padding-top:0;padding-bottom:0;}

/* ── 14 · ingresso morbido dei blocchi di stato ── */
#readyCard,#examLight,#planCard{animation:fadeUp .4s ease both;}

/* ── 15 · Ordina le vie: allineato al design attuale ── */
.ord-slot{background:var(--fill3);border:1.5px dashed var(--bd);border-radius:14px;min-height:44px;font-size:14px;display:flex;align-items:center;}
.ord-slot.done{background:rgba(14,159,110,.09);border:1.5px solid rgba(14,159,110,.45);color:var(--tx);font-weight:600;}
.ord-btn{border-radius:16px;padding:13px 15px;font-size:14px;box-shadow:var(--sh-sm);}
.ord-btn.ok{opacity:.3;}

/* ── 16 · texture firma: la curva del logo, quasi invisibile ── */
.rd .qcard-hero::before,.rd .sd-hero::before{
content:'';position:absolute;inset:-10%;pointer-events:none;opacity:.06;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M17 50C17 38 27 41 32 32c3.5-6.3.5-11-4-11' stroke='%23fff' stroke-width='5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E");
background-size:120px 120px;background-repeat:repeat;transform:rotate(-8deg);
}

/* ── 17 · scia dorata (classe usata dall'addon.js) ── */
.gold-run{filter:drop-shadow(0 0 8px rgba(255,214,10,.85));}

/* ── 18 · momento "verde per la prima volta" ── */
#greenMoment{position:fixed;inset:0;z-index:8500;background:rgba(7,10,20,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:24px;}
.gm-card{background:var(--card);border:1.5px solid rgba(14,159,110,.5);border-radius:28px;padding:30px 24px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(14,159,110,.25);animation:popIn .4s cubic-bezier(.34,1.3,.5,1);}
.gm-card .gm-e{font-size:40px;}
.gm-card h2{font-size:26px;font-weight:850;color:var(--ok);margin:10px 0 8px;letter-spacing:-.02em;}
.gm-card p{font-size:14px;color:var(--mu);line-height:1.5;font-weight:600;}
.gm-card button{width:100%;margin-top:18px;padding:15px;border:none;border-radius:16px;background:var(--ok);color:#fff;font-size:17px;font-weight:750;cursor:pointer;}

@media (prefers-reduced-motion:reduce){
#readyCard,#examLight,#planCard{animation:none;}
.gm-card{animation:none;}
}

/* [FIX 500] le pillole-segmento sono alte 10px: l'area di TOCCO si espande
in verticale (invisibile) così saltare a una domanda resta facile col dito */
.qpill{position:relative;}
.qpill::before{content:'';position:absolute;left:0;right:0;top:-10px;bottom:-10px;}

/* ══════ Coach 2.0 ══════ */
.srmul-line{margin-top:6px;text-align:center;font-size:10px;font-weight:750;color:var(--mu);}
#bailSheet{position:fixed;inset:0;z-index:8600;background:rgba(7,10,20,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;}
.bail-card{background:var(--card);border:1.5px solid var(--bd);border-radius:26px;padding:26px 22px;max-width:360px;width:100%;text-align:center;box-shadow:var(--sh-xl);animation:popIn .35s cubic-bezier(.34,1.2,.5,1);}
.bail-card .bail-e{font-size:40px;}
.bail-card b{display:block;font-size:17px;font-weight:850;color:var(--tx);margin:10px 0 8px;letter-spacing:-.02em;}
.bail-card p{font-size:14px;color:var(--mu);line-height:1.5;font-weight:600;}
.bail-row{display:flex;gap:10px;margin-top:18px;}
.bail-row button{flex:1;padding:14px 10px;border:none;border-radius:16px;font-size:14px;font-weight:750;cursor:pointer;}
.bail-stop{background:var(--fill2);color:var(--tx);}
.bail-go{background:var(--a);color:#fff;box-shadow:0 4px 14px rgba(36,71,214,.3);}
@media (prefers-reduced-motion:reduce){.bail-card{animation:none;}}

/* ══════ Final polish ══════ */

/* 1 · anello risultato */
#resRing{position:relative;width:150px;height:150px;margin:4px auto 10px;}
.rr-txt{position:absolute;inset:0;display:flex;align-items:baseline;justify-content:center;flex-direction:row;align-content:center;flex-wrap:wrap;}
.rr-txt b{font-size:40px;font-weight:850;letter-spacing:-.04em;color:var(--tx);font-variant-numeric:tabular-nums;line-height:150px;}
.rr-txt span{font-size:17px;font-weight:750;color:var(--mu);line-height:150px;margin-left:2px;}
.qres-emoji{display:none;} /* il verdetto ora lo dà l'anello */
.qres-title{margin-top:0;font-size:26px;}
/* statistiche compatte sotto l'anello */
.qres-stats{display:flex;gap:8px;max-width:420px;margin:14px auto 22px;}
.qres-stat{flex:1;padding:10px 6px;border-radius:16px;}
.qres-stat b{font-size:21px;}
.qres-stat span{font-size:10px;margin-top:3px;}

/* 2 · pillola scorrevole nel dock */
#tabPill{
position:absolute;z-index:0;opacity:0;
background:var(--sab);border-radius:17px;
transition:left .32s cubic-bezier(.3,1.1,.4,1),width .32s cubic-bezier(.3,1.1,.4,1),top .2s,height .2s,opacity .3s;
pointer-events:none;
}
#tabbar .tab{position:relative;z-index:1;}
/* [FIX 1000] finché la pillola non è pronta (~700ms), evidenziazione di riserva:
la tab attiva non resta mai "spenta" all'avvio */
body:not(.pill-on) #tabbar .tab.on{background:var(--sab);}
body.pill-on #tabbar .tab.on{background:transparent;} /* poi lo sfondo lo fa la pillola */
.rd.berlina #tabPill{background:rgba(139,107,33,.12);}
.rd.berlina.dark #tabPill{background:rgba(214,180,94,.14);}

/* 3 · stati vuoti: illustrazione firma al posto dell'emoji gigante */
.emp .e,.sd-empty .e{
font-size:0;line-height:0;
width:76px;height:76px;margin:0 auto;display:block;
background:center/contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' fill='none' stroke='%232447D6' stroke-width='4' stroke-linecap='round'%3E%3Cpath d='M26 74C26 56 42 60 50 46c5.5-9.6 1-17-6-17' opacity='.9'/%3E%3Ccircle cx='26' cy='74' r='7' fill='%23FFD60A' stroke='none'/%3E%3Ccircle cx='26' cy='74' r='3' fill='%23111A4E' stroke='none'/%3E%3Cpath d='M66 18a14 14 0 0 1 14 14c0 10-14 24-14 24S52 42 52 32a14 14 0 0 1 14-14z' fill='%23FFD60A' stroke='none' opacity='.95'/%3E%3Ccircle cx='66' cy='32' r='5' fill='%23111A4E' stroke='none'/%3E%3C/svg%3E");
opacity:.9;
}
.rd.dark .emp .e,.rd.dark .sd-empty .e{filter:brightness(1.35);}

@media (prefers-reduced-motion:reduce){#tabPill{transition:none;}}

/* [FIX mappa-sotto] quirk WebKit: i layer 3D di Leaflet possono restare
compositati anche con visibility:hidden sull'antenato. Spegnendo i PANNELLI
interni (display:none) la GPU li scarica davvero; il contenitore #map resta
misurabile, quindi al ritorno niente tile grigi. */
body:not(.on-topo) #map .leaflet-pane,
body:not(.on-topo) #map .leaflet-control-container,
body:not(.on-topo) #recenterBtn,
body:not(.on-topo) #satBtn{display:none !important;}
body:not(.on-topo) .main{opacity:0;}

/* ══════ Coach Interattivo ══════ */

/* (6) parole-trappola: la causa n.1 degli errori "letta male" */
.trap{color:var(--err);font-weight:850;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px;}

/* (11) la domanda si legge: più grande, più aria */
#qRunQ{font-size:21px;line-height:1.5;}

/* (8) puntino colore-argomento */
.qdot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-left:8px;vertical-align:middle;}
.qdot.catd0{background:var(--cat0);}.qdot.catd1{background:var(--cat1);}
.qdot.catd2{background:var(--cat2);}.qdot.catd3{background:var(--cat3);}

/* (7) dopo l'errore: la risposta giusta DOMINA, le altre si spengono
[FIX] la transition UNISCE quella del core (molla di pressione, sfondo, bordo)
invece di sostituirla: i bottoni restano scattanti al tocco */
.qans{transition:transform .14s cubic-bezier(.34,1.3,.64,1),border-color .2s,background .15s,opacity .3s,box-shadow .3s;}
#qRunAns:has(.qans.good) .qans:not(.good):not(.bad){opacity:.4;}
.qans.good{transform:scale(1.02);box-shadow:0 0 0 2.5px var(--ok),0 8px 22px rgba(14,159,110,.25);}

/* (2) overlay rileggi */
#rereadOv{position:fixed;inset:0;z-index:8700;background:rgba(7,10,20,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:26px;}
#rereadOv .rr-card{background:var(--card);border-radius:24px;padding:24px 22px;max-width:420px;box-shadow:var(--sh-xl);animation:popIn .3s cubic-bezier(.34,1.2,.5,1);}
#rereadOv small{display:block;font-size:12px;font-weight:750;color:var(--mu);margin-bottom:10px;}
#rereadOv p{font-size:21px;line-height:1.55;font-weight:600;color:var(--tx);}

/* (1) copertina pre-scheda */
#errCover{position:fixed;inset:0;z-index:8650;background:rgba(7,10,20,.7);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;}
.ec-card{background:var(--card);border-radius:26px;padding:24px;max-width:380px;width:100%;box-shadow:var(--sh-xl);animation:popIn .32s cubic-bezier(.34,1.2,.5,1);}
.ec-card small{font-size:12px;font-weight:750;color:var(--a);text-transform:uppercase;letter-spacing:.04em;}
.ec-card h3{font-size:17px;font-weight:850;color:var(--tx);margin:6px 0 14px;letter-spacing:-.01em;}
.ec-row{padding:10px 12px;background:var(--fill3);border-radius:14px;margin-bottom:8px;font-size:14px;font-weight:600;color:var(--tx);}
.ec-row b{font-weight:850;color:var(--a);margin-right:4px;}
.ec-go{width:100%;margin-top:10px;padding:15px;border:none;border-radius:16px;background:var(--a);color:#fff;font-size:17px;font-weight:750;cursor:pointer;}

/* (4) riscaldamento sotto il bottone simulazione */
.warm-btn{display:block;width:100%;margin-top:9px;padding:12px;border:1.5px dashed rgba(255,255,255,.5);border-radius:15px;background:rgba(255,255,255,.12);color:#fff;font-size:14px;font-weight:750;cursor:pointer;}

/* (C) diagnosi post-simulazione */
#simDiag{margin:4px 16px 14px;padding:14px 16px;background:var(--sab);border:1.5px solid rgba(36,71,214,.3);border-radius:18px;}
#simDiag p{font-size:14px;line-height:1.5;color:var(--tx);font-weight:600;}
#simDiag b{font-weight:850;}
#simDiag button{width:100%;margin-top:10px;}

/* (A)(10) debrief percorso */
#routeDebrief{position:fixed;left:12px;right:12px;bottom:calc(var(--tabh,64px) + 26px + env(safe-area-inset-bottom));z-index:3400;display:flex;justify-content:center;pointer-events:none;}
#routeDebrief .rdb{pointer-events:auto;position:relative;max-width:460px;width:100%;background:var(--card);border-radius:20px;padding:14px 40px 12px 16px;box-shadow:var(--sh-xl);animation:popIn .35s cubic-bezier(.34,1.2,.5,1);}
.rdb.ok{border:1.5px solid rgba(14,159,110,.5);}
.rdb.warn{border:1.5px solid rgba(229,72,77,.45);}
.rdb b{display:block;font-size:14px;font-weight:850;color:var(--tx);}
.rdb.ok b{color:var(--ok);}
.rdb small{display:block;font-size:12px;color:var(--mu);font-weight:600;margin-top:6px;}
.rdb-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.rdb-via{padding:6px 10px;background:rgba(229,72,77,.1);border:1px solid rgba(229,72,77,.35);border-radius:10px;font-size:12px;font-weight:750;color:var(--err);cursor:pointer;}
.rdb-x{position:absolute;top:8px;right:8px;width:28px;height:28px;border:none;border-radius:50%;background:var(--fill2);color:var(--mu);font-size:12px;cursor:pointer;}

/* (9) Cieco: numeri delle vie GRANDI — sono l'aggancio della memoria */
body.mode-c .row .sn{font-size:17px;font-weight:850;min-width:30px;}

/* (3) analisi errori: tua risposta e giusta AFFIANCATE */
@media (min-width:380px){
.qac{display:flex;flex-wrap:wrap;gap:8px;}
.qac .qac-q{width:100%;}
.qac .qac-row{flex:1;min-width:calc(50% - 8px);align-items:flex-start;}
}

@media (prefers-reduced-motion:reduce){
#rereadOv .rr-card,.ec-card,#routeDebrief .rdb{animation:none;}
}

/* ══════ Home: countdown esame grande ══════ */
.plan-exam-big{display:flex !important;align-items:center;gap:16px;text-align:left;
background:var(--card) !important;border:1.5px solid rgba(217,119,6,.4) !important;border-style:solid !important;
border-radius:22px !important;padding:14px 18px !important;box-shadow:var(--sh-sm);}
.plan-exam-big .ex-n{font-size:40px;font-weight:850;letter-spacing:-.04em;color:var(--warn);font-variant-numeric:tabular-nums;line-height:1;min-width:64px;}
.plan-exam-big .ex-tx strong{display:block;font-size:14px;font-weight:750;color:var(--tx);letter-spacing:-.01em;}
.plan-exam-big .ex-tx small{display:block;font-size:12px;color:var(--mu);font-weight:600;margin-top:3px;}
.rd.berlina .plan-exam-big{border-color:rgba(139,107,33,.45) !important;}
.rd.berlina .plan-exam-big .ex-n{color:#B8860B;}
.rd.berlina.dark .plan-exam-big .ex-n{color:#D6B45E;}

/* ══════ Home: suggerimenti animati + card esame grande ══════ */
#tipLine.tip-in{animation:tipIn .5s cubic-bezier(.3,1.1,.4,1) both;}
@keyframes tipIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}

.plan-exam.ex-big{
display:flex;align-items:center;gap:14px;text-align:left;
border:1.5px solid rgba(217,119,6,.4)!important;border-style:solid!important;
background:linear-gradient(135deg,rgba(217,119,6,.07),rgba(255,214,10,.05))!important;
border-radius:22px!important;padding:16px!important;
animation:exBreathe 4s ease-in-out infinite;
}
.plan-exam.ex-big b{
font-size:40px;font-weight:850;letter-spacing:-.04em;color:var(--warn);
font-variant-numeric:tabular-nums;line-height:1;min-width:64px;text-align:center;
}
.plan-exam.ex-big .ex-tx{flex:1;}
.plan-exam.ex-big .ex-tx strong{display:block;font-size:14px;font-weight:750;color:var(--tx);letter-spacing:-.01em;}
.plan-exam.ex-big .ex-tx small{display:block;font-size:12px;color:var(--mu);font-weight:600;margin-top:3px;}
.plan-exam.ex-big .ex-ic{font-size:26px;}
@keyframes exBreathe{0%,100%{box-shadow:0 4px 16px rgba(217,119,6,.12)}50%{box-shadow:0 8px 28px rgba(217,119,6,.28)}}
.rd.dark .plan-exam.ex-big{background:linear-gradient(135deg,rgba(217,119,6,.12),rgba(255,214,10,.06))!important;}
@media (prefers-reduced-motion:reduce){
.plan-exam.ex-big{animation:none;}
#tipLine.tip-in{animation:none;}
}

/* i suggerimenti personali (dai tuoi errori) sono più lunghi: a capo con grazia */
#tipLine{white-space:normal;line-height:1.45;text-align:center;}

/* ══════ "il coach ti ha visto" ══════ */
.gm-card.lap{border-color:rgba(217,119,6,.55);box-shadow:0 20px 60px rgba(217,119,6,.25);}
.gm-card.lap h2{color:var(--warn);}
.tg-card.defense{border-color:rgba(14,159,110,.45);background:linear-gradient(135deg,rgba(14,159,110,.06),rgba(255,214,10,.04));}
.tg-card.defense .tg-hd b{color:var(--ok);}

/* ══════ Spirale visibile ══════ */
#spiralCard{width:100%;max-width:460px;margin:10px auto 0;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:12px 16px;box-shadow:var(--sh-sm);}
@media (min-width:1100px){#spiralCard{max-width:520px;}}
.sp-hd{font-size:12px;font-weight:750;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px;}
.sp-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 2px;border-bottom:1px solid var(--sep2);cursor:pointer;font-size:14px;font-weight:600;color:var(--tx);}
.sp-row:last-child{border-bottom:none;}
.sp-row b{font-weight:750;color:var(--mu);font-size:12px;white-space:nowrap;}
.sp-row .sp-now{color:var(--warn);}
.sp-row:active{opacity:.6;}
.rdb-next{display:block;width:100%;margin-top:10px;padding:12px;border:none;border-radius:14px;background:var(--a);color:#fff;font-size:14px;font-weight:750;cursor:pointer;}

/* ══════ Modalità recupero ══════ */
.tg-bar.debt i{background:linear-gradient(90deg,var(--warn),var(--err));}
.tg-debt b{color:var(--err);}
.coach-why.why-alert{color:var(--err);font-weight:750;background:rgba(229,72,77,.06);border-radius:12px;padding:8px 10px;margin:0 8px 8px;border-bottom:none;}
.sp-hd .sp-cnt{color:var(--warn);font-weight:850;}

/* ══════ Imparare ══════ */
.twin-btn{display:block;width:100%;margin:10px 0 2px;padding:13px;border:1.5px solid var(--a);border-radius:15px;background:var(--sab);color:var(--a);font-size:14px;font-weight:750;cursor:pointer;}
.twin-btn:active{transform:scale(.97);}
.coach-why .bal{font-weight:750;}
.coach-why .bal.good{color:var(--ok);}
.coach-why .bal.bad{color:var(--err);}

/* ══════ Modello studente ══════ */
#modelCard{width:100%;max-width:460px;margin:10px auto 0;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:14px 16px;box-shadow:var(--sh-sm);}
@media (min-width:1100px){#modelCard{max-width:520px;}}
#modelCard.ok{border-color:rgba(14,159,110,.4);}
#modelCard.mid{border-color:rgba(217,119,6,.4);}
#modelCard.no{border-color:rgba(229,72,77,.4);}
.mc-hd{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:10px;border-bottom:1px solid var(--sep2);}
.mc-hd small{display:block;font-size:10px;font-weight:750;color:var(--mu);letter-spacing:.06em;}
.mc-hd b{font-size:34px;font-weight:850;letter-spacing:-.04em;color:var(--tx);font-variant-numeric:tabular-nums;line-height:1.05;}
.mc-hd b span{font-size:14px;font-weight:750;color:var(--mu);}
.mc-risk{text-align:right;}
#modelCard.ok .mc-risk b{color:var(--ok);}
#modelCard.mid .mc-risk b{color:var(--warn);}
#modelCard.no .mc-risk b{color:var(--err);}
.mc-sub{font-size:10px;color:var(--mu);font-weight:600;line-height:1.35;margin:8px 0 6px;}
.mc-row{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px;font-weight:600;color:var(--tx);}
.mc-row span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mc-row b{min-width:34px;text-align:right;font-weight:750;font-size:12px;font-variant-numeric:tabular-nums;}
.mc-bar{width:74px;height:7px;border-radius:4px;background:var(--fill2);overflow:hidden;flex-shrink:0;}
.mc-bar i{display:block;height:100%;border-radius:4px;transition:width .6s cubic-bezier(.4,0,.2,1);}
.mc-bar.ok i{background:var(--ok);}
.mc-bar.mid i{background:var(--warn);}
.mc-bar.no i{background:var(--err);}
.mc-tip{margin-top:10px;padding:10px 12px;background:var(--sab);border-radius:14px;font-size:12px;font-weight:750;color:var(--tx);line-height:1.4;cursor:pointer;}
.mc-tip:active{opacity:.6;}

/* ══════ Proiezione ══════ */
#projCard{width:100%;max-width:460px;margin:10px auto 0;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:13px 16px;box-shadow:var(--sh-sm);}
@media (min-width:1100px){#projCard{max-width:520px;}}
.pj-hd{font-size:10px;font-weight:750;color:var(--mu);letter-spacing:.06em;}
.pj-main{font-size:14px;font-weight:600;color:var(--tx);margin-top:5px;line-height:1.35;}
.pj-main b{font-weight:850;color:var(--a);}
.pj-sub{font-size:12px;color:var(--mu);font-weight:600;line-height:1.4;margin-top:5px;}

/* ══════ Ottimizzatore ══════ */
#optDelta{margin:4px 16px 12px;padding:12px 14px;background:var(--sab);border-radius:16px;font-size:12px;font-weight:600;color:var(--tx);text-align:center;}
#optDelta b{font-weight:850;color:var(--ok);}

/* ══════ Home 2.0: stato a schede ══════ */
#stateCard{width:100%;max-width:460px;margin:14px auto 0;}
@media (min-width:1100px){#stateCard{max-width:520px;}}
.st-seg{display:flex;gap:4px;padding:4px;background:var(--fill3);border-radius:16px;margin-bottom:8px;}
.st-tab{flex:1;padding:9px 6px;border:none;border-radius:12px;background:transparent;color:var(--mu);font-size:12px;font-weight:750;cursor:pointer;transition:background .22s,color .22s;}
.st-tab.on{background:var(--card);color:var(--tx);font-weight:850;box-shadow:var(--sh-sm);}
.st-tab.off{opacity:.35;pointer-events:none;}
.st-pane{display:none;animation:fadeUp .28s ease both;}
.st-pane.on{display:block;}
/* le card dentro le schede: stesso ritmo, niente margini doppi */
.st-pane>div{margin-top:0!important;margin-bottom:8px;}
.st-pane>div:last-child{margin-bottom:0;}
/* intestazioni armonizzate tra modello, proiezione e spirale */
.mc-hd small,.pj-hd,.sp-hd{font-size:10px!important;font-weight:750!important;letter-spacing:.06em!important;color:var(--mu)!important;text-transform:uppercase;}
#modelCard,#projCard,#spiralCard,#examLight .xl{border-radius:22px;}
/* l'azione sale: più aria sopra il bottone, meno sotto */
.smart-btn{margin-top:16px!important;}
@media (prefers-reduced-motion:reduce){.st-pane{animation:none;}}

/* ══════ Modello topografia ══════ */
#topoCard{width:100%;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:14px 16px;box-shadow:var(--sh-sm);margin-top:8px;}
.tp-row{cursor:pointer;}
.tp-row:active{opacity:.6;}
.tp-nere{margin-top:9px;padding-top:9px;border-top:1px solid var(--sep2);font-size:12px;color:var(--mu);font-weight:600;line-height:1.45;}
.tp-nere b{color:var(--tx);font-weight:750;}

/* ═══════════════════════════════════════════════════
   REDESIGN v3 — sistema di movimento unico per tutta l'app
   ═══════════════════════════════════════════════════ */

/* ── grammatica del movimento: 3 curve, 3 durate, usate ovunque ── */
.rd{
--e-soft:cubic-bezier(.22,1,.36,1);      /* uscite morbide */
--e-spring:cubic-bezier(.34,1.5,.64,1);  /* tocchi elastici */
--e-smooth:cubic-bezier(.4,0,.2,1);      /* transizioni neutre */
--d1:140ms;--d2:240ms;--d3:380ms;
}

/* ── 1 · TOCCO UNIFICATO: tutto risponde con la stessa molla ── */
.rd :where(button,.sr,.coach-row,.qtile,.sd-tile,.home-card,.tg-card,.qans,.st-tab,.sp-row,.tp-row,.mc-tip,.rdb-via,.qpill){
transition:transform var(--d1) var(--e-spring),opacity var(--d2) var(--e-smooth),
background var(--d2) var(--e-smooth),border-color var(--d2) var(--e-smooth),
box-shadow var(--d3) var(--e-soft),filter var(--d2) var(--e-smooth);
}
.rd :where(button,.sr,.coach-row,.qtile,.sd-tile,.home-card,.tg-card,.qans):active{transform:scale(.975);}
.rd :where(.st-tab,.sp-row,.tp-row,.mc-tip,.rdb-via):active{transform:scale(.985);}
/* le card grandi si sollevano appena, invece di schiacciarsi */
.rd :where(.home-card,.qtile,.sd-tile):active{transform:scale(.985) translateY(1px);}

/* ── 2 · INGRESSO CORALE: i blocchi entrano a cascata, non tutti insieme ── */
@keyframes rvIn{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}
.rv{opacity:0;animation:rvFail 0s linear 2.5s forwards;}/*[FIX 1000] rete di sicurezza: mai contenuto invisibile*/
@keyframes rvFail{to{opacity:1;}}
.rv.rv-in{animation:rvIn var(--d3) var(--e-soft) both;animation-delay:calc(var(--i,0) * 45ms);}

/* ── 3 · SUPERFICI: ombre a due livelli, più morbide e più vere ── */
.rd{
--sh-sm:0 1px 2px rgba(16,20,35,.04),0 2px 6px rgba(16,20,35,.05);
--sh-md:0 2px 6px rgba(16,20,35,.05),0 8px 20px rgba(16,20,35,.06);
--sh-xl:0 6px 18px rgba(16,20,35,.08),0 24px 56px rgba(16,20,35,.12);
}
.rd.dark{
--sh-sm:0 1px 2px rgba(0,0,0,.3),0 2px 8px rgba(0,0,0,.25);
--sh-md:0 3px 10px rgba(0,0,0,.35),0 10px 28px rgba(0,0,0,.3);
--sh-xl:0 8px 24px rgba(0,0,0,.45),0 28px 64px rgba(0,0,0,.5);
}
@media (hover:hover){
.rd :where(.home-card,.qtile,.sd-tile,#modelCard,#projCard,#topoCard,#spiralCard):hover{
transform:translateY(-2px);box-shadow:var(--sh-md);
}
}

/* ── 4 · BARRE E ANELLI: crescono, non appaiono ── */
.tg-bar i,.mc-bar i,.qarg-box::after,.prog-bar i,.ready-fill{
transition:width var(--d3) var(--e-soft),background var(--d2) var(--e-smooth) !important;
}

/* ── 5 · SEGMENTI E PILLOLE: scorrono ── */
.st-tab.on{transition:background var(--d2) var(--e-soft),color var(--d1) linear;}
.seg-btn{transition:color var(--d2) var(--e-smooth),background var(--d2) var(--e-soft);}
#tabPill{transition:left var(--d3) var(--e-spring),width var(--d3) var(--e-spring),top var(--d2) var(--e-soft),height var(--d2) var(--e-soft),opacity var(--d2);}

/* ── 6 · QUIZ: le risposte entrano sfalsate, la domanda respira ── */
@keyframes ansIn{from{opacity:0;transform:translate3d(0,10px,0)}to{opacity:1;transform:none}}
#qRunAns .qans{animation:ansIn var(--d2) var(--e-soft) both;}
#qRunAns .qans:nth-child(2){animation-delay:40ms}
#qRunAns .qans:nth-child(3){animation-delay:80ms}
#qRunAns .qans:nth-child(4){animation-delay:120ms}
@keyframes qIn{from{opacity:0;transform:translate3d(0,-6px,0)}to{opacity:1;transform:none}}
#qRunQ{animation:qIn var(--d2) var(--e-soft) both;}

/* ── 7 · MODALI E FOGLI: salgono invece di apparire ── */
@keyframes sheetUp{from{opacity:0;transform:translate3d(0,26px,0) scale(.98)}to{opacity:1;transform:none}}
.mbox,.gm-card,.ec-card,.bail-card,.rr-card,#routeDebrief .rdb{animation:sheetUp var(--d3) var(--e-soft) both !important;}
.modal,#greenMoment,#errCover,#bailSheet,#rereadOv{animation:fadeIn var(--d2) var(--e-smooth) both;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

/* ── 8 · SCHELETRI: niente più salti di numeri al caricamento ── */
@keyframes shimmer{0%{background-position:-380px 0}100%{background-position:380px 0}}
.skl{background:linear-gradient(90deg,var(--fill3) 25%,var(--fill2) 50%,var(--fill3) 75%);
background-size:760px 100%;animation:shimmer 1.3s linear infinite;border-radius:14px;color:transparent!important;}

/* ── 9 · RITMO: spaziature su una scala unica ── */
.rd #homeScreen>*+*{margin-top:14px;}
.rd #homeScreen>.home-card{margin-top:10px;}
.rd #coachCard{margin-top:18px;}

/* ── 10 · la mappa non partecipa mai alle animazioni (resta fluida) ── */
body:not(.on-topo) .leaflet-container *{animation:none!important;}/*[FIX 1000] in mappa il pin deve pulsare: si spegne solo fuori scena*/

@media (prefers-reduced-motion:reduce){
.rv,.rv.rv-in,#qRunAns .qans,#qRunQ,.mbox,.gm-card,.ec-card,.bail-card,.rr-card,#routeDebrief .rdb,.modal,.skl{animation:none!important;opacity:1!important;}
}
.coach-why .cons{color:var(--a);font-weight:750;}


/* ═══════════════════════════════════════════════════
   TOPOGRAFIA FLUIDA — solo movimento, il posizionamento resta manuale
   ═══════════════════════════════════════════════════ */

/* 1 · le vie entrano a cascata quando apri un percorso */
@keyframes srIn{from{opacity:0;transform:translate3d(-10px,0,0)}to{opacity:1;transform:none}}
#sList.rows-in .sr{animation:srIn .3s var(--e-soft) both;}
#sList.rows-in .sr:nth-child(1){animation-delay:0ms}
#sList.rows-in .sr:nth-child(2){animation-delay:25ms}
#sList.rows-in .sr:nth-child(3){animation-delay:50ms}
#sList.rows-in .sr:nth-child(4){animation-delay:75ms}
#sList.rows-in .sr:nth-child(5){animation-delay:100ms}
#sList.rows-in .sr:nth-child(6){animation-delay:125ms}
#sList.rows-in .sr:nth-child(7){animation-delay:150ms}
#sList.rows-in .sr:nth-child(n+8){animation-delay:170ms}

/* 2 · la via attiva si accende con una barra laterale che cresce */
.sr{position:relative;transition:background .22s var(--e-smooth),padding-left .25s var(--e-soft);}
.sr::after{content:'';position:absolute;left:0;top:8px;bottom:8px;width:3px;border-radius:2px;
background:var(--a);transform:scaleY(0);transform-origin:center;transition:transform .3s var(--e-spring);}
.sr.act::after{transform:scaleY(1);}
.sr.act{padding-left:11px;}

/* 3 · il numero della via pulsa quando diventa attivo */
@keyframes snPop{0%{transform:scale(1)}45%{transform:scale(1.22)}100%{transform:scale(1.08)}}
.sr.act .sn{animation:snPop .34s var(--e-spring);}

/* 4 · "Rivela" in Cieco: il nome appare in dissolvenza dal basso */
@keyframes revealName{from{opacity:0;transform:translate3d(0,7px,0);filter:blur(3px)}to{opacity:1;transform:none;filter:none}}
.sr.act .sname:not(.hid){animation:revealName .34s var(--e-soft) both;}

/* 5 · pin: l'animazione vive SOLO sull'icona interna.
[FIX] Mai animare transform sull'elemento marker: Leaflet lo usa per
posizionarlo sulla mappa, e un'animazione con fill-mode lo cancellava
(pin nell'angolo o invisibile). Il core ha già la sua pinDrop: non la tocco. */
.pin-wrap .pin-emoji{will-change:transform;}

/* 6 · il tracciato si disegna quando cambi percorso */
.route-line{transition:stroke-width .25s var(--e-soft),opacity .25s;}
.route-flow{stroke-dasharray:8 14;animation:flowRun 1.6s linear infinite;}
@keyframes flowRun{to{stroke-dashoffset:-44}}

/* 7 · pannello: intestazione che si stacca allo scorrimento */
.phead{transition:box-shadow .28s var(--e-soft),background .22s;}
.panel.scrolled .phead{box-shadow:0 6px 18px rgba(16,20,35,.10);}
.rd.dark .panel.scrolled .phead{box-shadow:0 6px 18px rgba(0,0,0,.4);}

/* 8 · segmenti Studio/Cieco/Quiz: pillola scorrevole */
.seg-wrap{position:relative;}
#segPill{position:absolute;z-index:0;border-radius:12px;background:var(--card);
box-shadow:var(--sh-sm);opacity:0;pointer-events:none;
transition:left .3s var(--e-spring),width .3s var(--e-spring),top .2s,height .2s,opacity .25s;}
.seg-btn{position:relative;z-index:1;}
body.seg-on .seg-btn.on{background:transparent!important;}

/* 9 · bottoni avanti/indietro con molla piena */
#bNext,#bPrev,#bRev{transition:transform .16s var(--e-spring),background .2s,opacity .2s;}
#bNext:active,#bPrev:active,#bRev:active{transform:scale(.9);}

/* 10 · barra di avanzamento del percorso, fluida */
.pbf,.prog-bar i{transition:width .45s var(--e-soft);}

/* 11 · lo stato "completato" della via scivola dentro */
@keyframes okIn{from{opacity:0;transform:scale(.5) rotate(-25deg)}to{opacity:1;transform:none}}
.sr .cb.s{animation:okIn .3s var(--e-spring) both;}

/* 12 · mappa: transizione morbida dei tile al cambio zoom */
.leaflet-fade-anim .leaflet-tile{transition:opacity .3s var(--e-smooth);}
.leaflet-zoom-anim .leaflet-zoom-animated{transition:transform .28s var(--e-soft);}

@media (prefers-reduced-motion:reduce){
#sList.rows-in .sr,.sr.act .sn,.sr.act .sname:not(.hid),.sr .cb.s{animation:none!important;}
.route-flow{animation:none;}
#segPill{transition:none;}
}


/* ══════ Richiamo a memoria · zone · gemelli ══════ */
#recallOv{position:fixed;inset:0;z-index:8800;background:rgba(7,10,20,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:22px;}
.rc-card{background:var(--card);border-radius:26px;padding:24px 22px;max-width:420px;width:100%;box-shadow:var(--sh-xl);animation:sheetUp .34s var(--e-soft) both;}
.rc-hd small{display:block;font-size:10px;font-weight:750;color:var(--a);letter-spacing:.06em;}
.rc-hd b{display:block;font-size:17px;font-weight:850;color:var(--tx);margin:4px 0 2px;line-height:1.25;}
.rc-cnt{font-size:12px;font-weight:750;color:var(--mu);font-variant-numeric:tabular-nums;}
.rc-prev{margin:12px 0 4px;padding:9px 12px;background:var(--fill3);border-radius:12px;font-size:12px;color:var(--mu);font-weight:600;}
.rc-prev b{color:var(--tx);font-weight:750;}
.rc-q{font-size:17px;font-weight:750;color:var(--tx);margin:14px 0 10px;line-height:1.35;}
.rc-q b{font-weight:850;color:var(--a);}
.rc-ans{min-height:56px;display:flex;align-items:center;justify-content:center;}
.rc-name{font-size:21px;font-weight:850;color:var(--tx);text-align:center;line-height:1.3;animation:revealName .34s var(--e-soft) both;}
.rc-row{display:flex;gap:10px;margin-top:14px;}
.rc-row button{flex:1;padding:15px 10px;border:none;border-radius:16px;font-size:14px;font-weight:750;cursor:pointer;transition:transform .15s var(--e-spring);}
.rc-row button:active{transform:scale(.95);}
.rc-show{background:var(--a);color:#fff;}
.rc-yes{background:rgba(14,159,110,.14);color:var(--ok);}
.rc-no{background:rgba(229,72,77,.12);color:var(--err);}
.rc-close{background:var(--fill2);color:var(--tx);}
.rc-again{background:var(--a);color:#fff;}
.rc-fw{background:var(--a);color:#fff;}
.rc-bw{background:var(--fill2);color:var(--tx);}
.rc-end{text-align:center;}
.rc-pick b{display:block;font-size:17px;font-weight:850;color:var(--tx);}
.rc-pick small{display:block;font-size:12px;color:var(--mu);margin-top:6px;font-weight:600;}
.rc-score{font-size:40px;font-weight:850;letter-spacing:-.04em;line-height:1.1;font-variant-numeric:tabular-nums;}
.rc-score span{font-size:21px;font-weight:750;color:var(--mu);}
.rc-score.ok{color:var(--ok);}.rc-score.mid{color:var(--warn);}.rc-score.no{color:var(--err);}
.rc-end b{display:block;font-size:14px;font-weight:750;color:var(--tx);margin-top:4px;}
.rc-end small{display:block;font-size:12px;color:var(--mu);margin-top:8px;font-weight:600;}
.rc-list{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:12px;}
.rc-miss{padding:6px 10px;background:rgba(229,72,77,.1);border:1px solid rgba(229,72,77,.32);border-radius:10px;font-size:12px;font-weight:750;color:var(--err);}
#zoneBar{display:flex;gap:6px;flex-wrap:wrap;padding:8px 0 2px;}
.zn{padding:7px 12px;border:1.5px solid var(--bd);border-radius:14px;background:var(--card);color:var(--mu);font-size:12px;font-weight:750;cursor:pointer;transition:all .2s var(--e-smooth);}
.zn b{font-weight:850;color:var(--tx);}
.zn.on{border-color:var(--a);background:var(--sab);color:var(--a);}
.zn.on b{color:var(--a);}
.rcb2{background:var(--sab);color:var(--a);}
@media (prefers-reduced-motion:reduce){.rc-card,.rc-name{animation:none;}}


/* salto dell'icona quando il pin arriva alla via successiva
   (agisce SOLO sull'emoji interna: il marker non va mai animato) */
@keyframes pinHop{0%{transform:translateY(0) scale(1)}35%{transform:translateY(-7px) scale(1.14)}100%{transform:translateY(0) scale(1)}}
.route-trail{animation:trailFade .7s ease forwards;}
@keyframes trailFade{0%{opacity:.8;stroke-width:8}100%{opacity:0;stroke-width:2}}


/* ══════ Salvagente dati ══════ */
#saveInfo{width:100%;max-width:460px;margin:10px auto 0;padding:11px 14px;background:var(--fill3);border-radius:16px;font-size:12px;font-weight:600;color:var(--mu);text-align:center;cursor:pointer;line-height:1.45;transition:background var(--d2) var(--e-smooth);}
@media (min-width:1100px){#saveInfo{max-width:520px;}}
#saveInfo b{color:var(--tx);font-weight:750;}
#saveInfo:active{background:var(--fill2);}
#bkOv{position:fixed;inset:0;z-index:8900;background:rgba(7,10,20,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
.bk-card{background:var(--card);border-radius:26px;padding:22px 20px;max-width:430px;width:100%;max-height:82vh;display:flex;flex-direction:column;box-shadow:var(--sh-xl);animation:sheetUp .34s var(--e-soft) both;}
.bk-hd b{display:block;font-size:17px;font-weight:850;color:var(--tx);}
.bk-hd small{display:block;font-size:12px;color:var(--mu);margin-top:5px;font-weight:600;line-height:1.4;}
.bk-list{margin:14px 0;overflow-y:auto;-webkit-overflow-scrolling:touch;font-size:12px;color:var(--mu);}
.bk-row{display:block;width:100%;text-align:left;padding:12px 14px;margin-bottom:8px;border:1.5px solid var(--bd);border-radius:16px;background:var(--card);cursor:pointer;transition:border-color .2s,transform .15s var(--e-spring);}
.bk-row:active{transform:scale(.98);border-color:var(--a);}
.bk-when{font-size:14px;font-weight:750;color:var(--tx);}
.bk-when em{font-style:normal;font-size:10px;font-weight:750;color:var(--ok);background:rgba(14,159,110,.12);padding:2px 7px;border-radius:8px;margin-left:6px;}
.bk-meta{font-size:12px;color:var(--mu);font-weight:600;margin-top:3px;}
.bk-close{padding:14px;border:none;border-radius:16px;background:var(--fill2);color:var(--tx);font-size:14px;font-weight:750;cursor:pointer;}
@media (prefers-reduced-motion:reduce){.bk-card{animation:none;}}


/* ══════ Richiamo a memoria sui quiz ══════ */
#rqOv{position:fixed;inset:0;z-index:8800;background:rgba(7,10,20,.74);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
.rq-card{background:var(--card);border-radius:26px;padding:24px 22px;max-width:440px;width:100%;box-shadow:var(--sh-xl);animation:sheetUp .34s var(--e-soft) both;}
.rq-hd{display:flex;justify-content:space-between;align-items:center;}
.rq-hd small{font-size:10px;font-weight:750;color:#8B5CF6;letter-spacing:.06em;}
.rq-cnt{font-size:12px;font-weight:750;color:var(--mu);font-variant-numeric:tabular-nums;}
.rq-q{font-size:17px;font-weight:750;color:var(--tx);margin:14px 0 8px;line-height:1.4;}
.rq-hint{font-size:12px;color:var(--mu);font-weight:600;}
.rq-ans{min-height:60px;display:flex;align-items:center;justify-content:center;margin-top:8px;}
.rq-name{font-size:17px;font-weight:850;color:var(--ok);text-align:center;line-height:1.35;animation:revealName .34s var(--e-soft) both;}
.rq-row{display:flex;gap:10px;margin-top:14px;}
.rq-row button{flex:1;padding:15px 10px;border:none;border-radius:16px;font-size:14px;font-weight:750;cursor:pointer;transition:transform .15s var(--e-spring);}
.rq-row button:active{transform:scale(.95);}
.rq-show{background:#8B5CF6;color:#fff;}
.rq-yes{background:rgba(14,159,110,.14);color:var(--ok);}
.rq-no{background:rgba(229,72,77,.12);color:var(--err);}
.rq-close{background:var(--fill2);color:var(--tx);}
.rq-again{background:var(--a);color:#fff;}
.rq-end{text-align:center;}
.rq-score{font-size:40px;font-weight:850;letter-spacing:-.04em;line-height:1.1;font-variant-numeric:tabular-nums;}
.rq-score span{font-size:21px;font-weight:750;color:var(--mu);}
.rq-score.ok{color:var(--ok);}.rq-score.mid{color:var(--warn);}.rq-score.no{color:var(--err);}
.rq-end b{display:block;font-size:14px;font-weight:750;color:var(--tx);margin-top:4px;}
.rq-end small{display:block;font-size:12px;color:var(--mu);margin-top:8px;font-weight:600;}
/* ══════ La regola con parole tue ══════ */
.qnote{margin:10px 16px 0;}
.qnote.shown{display:flex;gap:8px;align-items:flex-start;padding:11px 13px;background:rgba(139,92,246,.09);border:1px solid rgba(139,92,246,.28);border-radius:14px;font-size:12px;font-weight:600;color:var(--tx);line-height:1.4;}
.qn-ic{color:#8B5CF6;font-weight:750;}
.qn-add{width:100%;padding:11px 13px;border:1px dashed var(--bd);border-radius:14px;background:transparent;color:var(--mu);font-size:12px;font-weight:750;cursor:pointer;text-align:left;line-height:1.4;}
.qn-add:active{background:var(--fill3);}
@media (prefers-reduced-motion:reduce){.rq-card,.rq-name{animation:none;}}

.rq-x{border:none;background:var(--fill3);color:var(--mu);width:30px;height:30px;border-radius:10px;font-size:14px;font-weight:750;cursor:pointer;margin-left:8px;}
.rq-x:active{transform:scale(.9);}
.rq-hd{gap:6px;}



/* ══════ Verdetti dei test di verifica ══════ */
#coldVerdict,#chkVerdict{margin:4px 16px 12px;padding:13px 15px;background:var(--sab);border-radius:16px;text-align:center;}
#coldVerdict b,#chkVerdict b{display:block;font-size:17px;font-weight:850;color:var(--tx);}
#coldVerdict span,#chkVerdict span{display:block;font-size:12px;color:var(--mu);font-weight:600;margin-top:5px;line-height:1.4;}


/* ══════ Sotto-argomenti ══════ */
#subCard{width:100%;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:14px 16px;box-shadow:var(--sh-sm);margin-top:8px;}
.sub-row{cursor:pointer;}
.sub-row:active{opacity:.6;}
/* ══════ Vista linea metro ══════ */
#lineaOv{position:fixed;inset:0;z-index:8850;background:rgba(7,10,20,.75);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:18px;}
.ln-card{background:var(--card);border-radius:24px;max-width:420px;width:100%;max-height:84vh;display:flex;flex-direction:column;box-shadow:var(--sh-xl);animation:sheetUp .32s var(--e-soft) both;}
.ln-hd{padding:18px 20px 12px;border-bottom:1px solid var(--sep2);position:relative;}
.ln-hd b{display:block;font-size:17px;font-weight:850;color:var(--tx);padding-right:34px;line-height:1.25;}
.ln-hd small{display:block;font-size:12px;color:var(--mu);font-weight:600;margin-top:3px;}
.ln-x{position:absolute;right:16px;top:16px;width:28px;height:28px;border:none;border-radius:50%;background:var(--fill2);color:var(--tx);font-size:14px;cursor:pointer;}
.ln-body{position:relative;padding:16px 20px 20px 20px;overflow-y:auto;-webkit-overflow-scrolling:touch;}
.ln-line{position:absolute;left:33px;top:22px;bottom:22px;width:3px;background:var(--a);border-radius:2px;opacity:.28;}
.ln-stop{display:flex;align-items:center;gap:12px;padding:7px 0;position:relative;}
.ln-dot{width:27px;height:27px;border-radius:50%;background:var(--card);border:3px solid var(--a);color:var(--tx);font-size:10px;font-weight:850;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;}
.ln-stop.mid .ln-dot{border-color:var(--warn);}
.ln-stop.no .ln-dot{border-color:var(--err);}
.ln-name{font-size:14px;font-weight:750;color:var(--tx);line-height:1.3;}
.ln-name em{font-style:normal;font-size:10px;font-weight:750;color:var(--err);margin-left:7px;}
.ln-btn{margin-left:auto;padding:7px 12px;border:1.5px solid var(--bd);border-radius:12px;background:var(--card);color:var(--tx);font-size:12px;font-weight:750;cursor:pointer;}
.ln-btn:active{transform:scale(.95);}
/* ══════ Quale viene prima ══════ */
#ordOv{position:fixed;inset:0;z-index:8860;background:rgba(7,10,20,.75);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
.or-card{background:var(--card);border-radius:26px;padding:22px 20px;max-width:420px;width:100%;box-shadow:var(--sh-xl);animation:sheetUp .32s var(--e-soft) both;text-align:center;}
.or-hd small{display:block;font-size:10px;font-weight:750;color:var(--a);letter-spacing:.06em;}
.or-hd b{display:block;font-size:17px;font-weight:850;color:var(--tx);margin:5px 0 2px;}
.or-cnt{font-size:12px;font-weight:750;color:var(--mu);}
.or-row{display:flex;flex-direction:column;gap:10px;margin:18px 0 14px;}
.or-opt{padding:17px 14px;border:1.5px solid var(--bd);border-radius:18px;background:var(--card);color:var(--tx);font-size:14px;font-weight:750;cursor:pointer;transition:all .2s var(--e-smooth);}
.or-opt:active{transform:scale(.97);}
.or-opt.good{border-color:var(--ok);background:rgba(14,159,110,.12);color:var(--ok);}
.or-opt.bad{border-color:var(--err);background:rgba(229,72,77,.1);color:var(--err);}
.or-x{width:100%;padding:13px;border:none;border-radius:15px;background:var(--fill2);color:var(--tx);font-size:14px;font-weight:750;cursor:pointer;}
.or-end b{display:block;font-size:14px;font-weight:750;color:var(--tx);margin:4px 0 14px;}
#topoEx{display:flex;gap:8px;padding:8px 0 2px;}
.tx-b{padding:8px 13px;border:1.5px solid var(--bd);border-radius:14px;background:var(--card);color:var(--tx);font-size:12px;font-weight:750;cursor:pointer;}
.tx-b:active{transform:scale(.96);}
/* ══════ Punti di riferimento ══════ */
.rif{margin-top:8px;padding:9px 12px;border-radius:12px;font-size:12px;font-weight:600;cursor:pointer;background:var(--fill3);color:var(--mu);border:1px dashed var(--bd);}
.rif.has{background:rgba(14,159,110,.10);border:none;border-left:3px solid var(--ok);border-radius:0 12px 12px 0;color:var(--tx);font-weight:750;}
.rif:active{opacity:.6;}
@media (prefers-reduced-motion:reduce){.ln-card,.or-card{animation:none;}}


/* ══════ Schermo intero della mappa ══════ */
#fullBtn{margin-left:8px;width:38px;height:38px;flex:0 0 38px;border:1.5px solid var(--bd);border-radius:12px;background:var(--card);color:var(--tx);font-size:14px;font-weight:750;cursor:pointer;transition:transform .15s var(--e-spring),background .2s;}
#fullBtn:active{transform:scale(.92);}
.seg-wrap{display:flex;align-items:center;}
.seg-wrap .seg{flex:1;}

/* [FIX] la barra inferiore è #tabbar (identificativo, non classe) e il
   contenitore della mappa è .main senza involucro: i selettori
   sbagliati lasciavano la barra visibile e la mappa non a pieno schermo */
/* [FIX] restava una riga .hrow da 46px dentro l'intestazione: la pillola
   era alta 90px e il pannello ci finiva sotto */
body.topo-full #tabbar,
body.topo-full #homeBtn,
body.topo-full .srow,
body.topo-full header .hrow{display:none!important;}
body.topo-full .main{position:fixed;inset:0;z-index:6000;display:block;height:100%;max-height:none;padding:0;margin:0;}
body.topo-full #map{position:absolute;inset:0;width:100%;height:100%;border-radius:0;}
/* l'intestazione diventa una pillola che galleggia sulla mappa,
   non una barra piena che ruba spazio */
body.topo-full header{position:fixed;top:10px;left:50%;transform:translateX(-50%);
right:auto;width:auto;z-index:6200;padding:0;background:transparent;border:none;box-shadow:none;}
body.topo-full .seg-wrap{margin:0;padding:5px;border-radius:var(--r-row);
background:color-mix(in srgb,var(--card) 90%,transparent);
backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);
box-shadow:var(--sh-md);}
body.topo-full .seg{background:transparent;}
body.topo-full #fullBtn{margin-left:5px;width:34px;height:34px;flex:0 0 34px;font-size:14px;}
/* su schermi bassi la pillola si stringe */
@media (max-height:520px){
body.topo-full header{top:6px;}
body.topo-full .seg-btn{padding-top:7px;padding-bottom:7px;font-size:12px;}
}
/* [FIX] la pillola era alta 102px e il pannello ci finiva sotto:
   si compattano i segmenti e il pannello parte sotto davvero */
body.topo-full .seg{padding:0;margin:0;border:none;box-shadow:none;height:auto;}
body.topo-full .seg-btn{padding:8px 15px;font-size:12px;line-height:1.15;min-height:0;height:auto;}
body.topo-full .seg-thumb{top:0;bottom:0;height:auto;}
body.topo-full header .seg-wrap{align-items:center;}
/* [FIX] il pannello partiva sotto il bordo della pillola: su iPad
   verticale le due si sovrapponevano */
body.topo-full #panel{top:76px;}
@media (max-height:520px){body.topo-full #panel{top:64px;}}
@media (max-width:760px){body.topo-full #panel{top:auto;}}

/* elenco vie: colonna laterale a destra */
body.topo-full #panel{position:absolute;top:66px;right:12px;bottom:12px;left:auto;width:340px;max-width:42vw;
border-radius:22px;z-index:6100;box-shadow:var(--sh-xl);max-height:none;display:flex;flex-direction:column;
background:color-mix(in srgb,var(--card) 94%,transparent);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
body.topo-full #panel .pdrag{display:none;}
body.topo-full #sList{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;}
body.topo-full .pfoot{padding-bottom:12px;}

/* su schermi stretti la colonna diventa una fascia in basso */
@media (max-width:760px){
body.topo-full #panel{left:8px;right:8px;width:auto;max-width:none;top:auto;bottom:8px;height:52vh;}
body.topo-full #sList{max-height:none;}
}
/* [FIX] su telefoni piccoli si vedevano solo 2 vie: intestazione e piede
   più compatti, e la lista può davvero restringersi (min-height:0) */
body.topo-full #sList{min-height:0;}
@media (max-width:430px){
body.topo-full #panel{height:56vh;}
body.topo-full #panel .phead{padding-top:10px;padding-bottom:6px;}
body.topo-full #panel .phead h2{font-size:14px;}
body.topo-full #panel .pfoot{padding-top:8px;padding-bottom:10px;}
body.topo-full #panel .sr{padding-top:9px;padding-bottom:9px;}
}
/* su schermi molto bassi in orizzontale si stringe ancora */
@media (max-height:460px) and (orientation:landscape){
body.topo-full #panel{width:290px;max-width:38vw;top:60px;bottom:8px;left:auto;right:8px;height:auto;}
}
body.topo-full #plBanner{z-index:6300;}
body.topo-full .leaflet-control-container{z-index:6050;}
body.topo-full #satBtn{z-index:6150;}


/* ═══════════════════════════════════════════════════
   SISTEMA UNICO DI MOVIMENTO — una mano sola per tutta l'app
   Tre curve, tre durate, applicate a ogni elemento interattivo.
   Non cambia posizione né dimensione di nulla: solo il modo in cui
   le cose passano da uno stato all'altro.
   ═══════════════════════════════════════════════════ */
:root{
--e-soft:cubic-bezier(.22,1,.36,1);
--e-spring:cubic-bezier(.34,1.5,.64,1);
--e-smooth:cubic-bezier(.4,0,.2,1);
--d1:140ms;--d2:240ms;--d3:380ms;
}
/* tocco: stessa molla ovunque */
:where(button,.sr,.coach-row,.qtile,.sd-tile,.home-card,.tg-card,.qans,.st-tab,
.sp-row,.tp-row,.sub-row,.mc-tip,.bk-row,.or-opt,.zn,.tx-b,.rif,.qn-add,.mt-row,
.rcb2,.rab,.pib,.seg-btn,.tab,.btn){
transition:transform var(--d1) var(--e-spring),
opacity var(--d2) var(--e-smooth),
background var(--d2) var(--e-smooth),
border-color var(--d2) var(--e-smooth),
color var(--d2) var(--e-smooth),
box-shadow var(--d3) var(--e-soft);
}
/* le superfici grandi si sollevano appena invece di schiacciarsi */
:where(.home-card,.qtile,.sd-tile,.bk-row,#modelCard,#projCard,#topoCard,
#spiralCard,#subCard,#saveInfo):active{transform:scale(.985) translateY(1px);}
/* barre e indicatori: crescono, non appaiono */
:where(.tg-bar i,.mc-bar i,.pbf,.prog-bar i,.ready-fill,.qarg-box::after,.sp-row b){
transition:width var(--d3) var(--e-soft),
background var(--d2) var(--e-smooth),
transform var(--d3) var(--e-soft)!important;}
/* pannelli e schede: comparse morbide */
:where(.st-pane,.panel,.mbox,.qcard-hero){transition:opacity var(--d2) var(--e-smooth);}
/* i colori del tema cambiano insieme, non a scatti */
body,#homeScreen,.card,.home-card,.qtile,.sd-tile,.panel{
transition:background-color var(--d3) var(--e-smooth),
color var(--d2) var(--e-smooth),
border-color var(--d3) var(--e-smooth);}
@media (prefers-reduced-motion:reduce){
*,*::before,*::after{transition-duration:1ms!important;animation-duration:1ms!important;}
}


/* i riquadri della mappa si dissolvono invece di scattare */
.leaflet-layer{transition:opacity .3s var(--e-smooth);}
.leaflet-tile{transition:opacity .22s var(--e-smooth);}
@media (prefers-reduced-motion:reduce){.leaflet-layer,.leaflet-tile{transition:none;}}


/* ═══════════════════════════════════════════════════
   MODELLO UNICO DI CARD — fase 2 del redesign
   Prima: 3 raggi diversi, 7 padding, larghezze incoerenti, perché
   ogni card è nata in un momento diverso. Qui si allineano tutte a
   una sola forma. Solo aspetto: nessuna struttura viene toccata.
   ═══════════════════════════════════════════════════ */
:root{
--card-r:22px;          /* raggio unico */
--card-pad:14px 16px;   /* respiro unico */
--card-w:460px;         /* larghezza unica */
}
@media (min-width:1100px){:root{--card-w:520px;}}

/* la forma */
#readyCard>*, #examLight>*, #modelCard, #topoCard, #projCard, #subCard,
#spiralCard, #saveInfo, #coachCard>*, .home-card, .tg-card, #qDash .qtile,
#sdDash .sd-tile{
border-radius:var(--card-r);
box-shadow:var(--sh-sm);
}
#modelCard, #topoCard, #projCard, #subCard, #spiralCard, #readyCard>*,
#examLight>*, #coachCard>*{padding:var(--card-pad);}

/* la larghezza: tutte allineate sulla stessa colonna */
#readyCard, #examLight, #modelCard, #topoCard, #projCard, #subCard,
#spiralCard, #saveInfo, #planCard, #coachCard, #weekChart, .home-card{
width:100%;max-width:var(--card-w);margin-left:auto;margin-right:auto;}
/* dentro le schede di stato la colonna è già data dal contenitore */
.st-pane #modelCard, .st-pane #topoCard, .st-pane #projCard,
.st-pane #subCard{max-width:none;}

/* il ritmo verticale fra le card */
#homeScreen>*+*{margin-top:12px;}
#coachCard{margin-top:16px;}

/* l'intestazione: etichetta piccola in alto, numero grande sotto */
.mc-hd small, .pj-hd, .sp-hd, .mt-hd{
font-size:10px;font-weight:750;letter-spacing:.06em;
text-transform:uppercase;color:var(--mu);line-height:1.2;}
.mc-hd b{font-size:34px;font-weight:850;letter-spacing:-.035em;line-height:1.06;
font-variant-numeric:tabular-nums;}
.mc-sub, .pj-sub{font-size:10px;color:var(--mu);font-weight:600;line-height:1.4;}

/* le righe con barra: stessa altezza e stesso passo ovunque */
.mc-row{padding:5px 0;font-size:12px;font-weight:600;gap:9px;}
.mc-bar{width:74px;height:7px;border-radius:4px;flex-shrink:0;}
.mc-row b{min-width:36px;text-align:right;font-size:12px;font-weight:750;
font-variant-numeric:tabular-nums;}

/* i separatori: uno stile solo */
.mc-hd, .tp-nere, .mc-tip{border-color:var(--sep2);}

/* la riga del salvataggio si allinea alle card */
#saveInfo{padding:11px 16px;border:1.5px solid var(--bd);background:var(--card);}


/* ── la scala dei raggi: tre livelli, non cinque valori a caso ──
   card esterna 22 · riga interna 14 · pillola 10 · azione 18 */
:root{--r-card:22px;--r-row:14px;--r-pill:10px;--r-act:18px;}

/* livello 1 · card */
.home-card, .coach, .ready-card, .xl, #spiralCard, #saveInfo,
#modelCard, #topoCard, #projCard, #subCard, .tg-card, .qcard-hero,
#qDash .qtile, #sdDash .sd-tile, .bk-card, .rc-card, .or-card, .ln-card{
border-radius:var(--r-card);}

/* livello 2 · righe dentro le card */
.coach-row, .plan-set, .sp-row, .mc-tip, .bk-row, .qans, .or-opt,
.sr, .rif, .qn-add, .mt-row, .st-tab{border-radius:var(--r-row);}

/* livello 3 · pillole e etichette */
#tipLine, .zn, .tx-b, .rc-miss, .bk-when em, .mc-bar, .qdot{
border-radius:var(--r-pill);}
.mc-bar{border-radius:4px;}

/* azione principale */
.smart-btn, .btn.bp, .rc-row button, .bk-close{border-radius:var(--r-act);}

/* [FIX] il core usa selettori più forti (.rd .home-card, .rd .smart-btn,
   .coach-row+.coach-row): senza pari specificità le regole non passavano */
.rd .home-card{border-radius:var(--r-card);padding:16px;}
.rd .smart-btn{border-radius:var(--r-act);}
.rd .coach-row, .rd .coach-row+.coach-row{border-radius:var(--r-row);}
.rd .plan-set{border-radius:var(--r-row);}
.rd #tipLine{border-radius:var(--r-pill);}
.rd #streakBadge{border-radius:var(--r-pill);}


/* ── bersagli di tocco comodi: i segmenti erano alti 28px ── */
body:not(.topo-full) .seg-btn{min-height:36px;}
body:not(.topo-full) .ln-btn{min-height:34px;}

/* ── UN SOLO ritmo verticale in home ──
   [FIX] i margini delle singole card vincevano sulla regola generale:
   gli spazi andavano da 2px a 41px. #homeScreen è un contenitore
   flessibile, quindi la spaziatura la dà lui: uguale per tutti,
   qualunque card sia presente. */
.rd #homeScreen{gap:12px;}
.rd #homeScreen>*{margin-top:0;margin-bottom:0;}
.rd #homeScreen>.home-hd{margin-bottom:6px;}
.rd #homeScreen>.smart-btn{margin-top:2px;margin-bottom:2px;}
/* [FIX] i contenitori portavano margini INTERNI che si sommavano al passo
   del contenitore: gli spazi visibili restavano disuguali */
.rd #homeScreen>*>:first-child{margin-top:0;}
.rd #homeScreen>*>:last-child{margin-bottom:0;}
.rd .st-pane>:first-child{margin-top:0;}
/* stesso passo anche fra le card dentro le schede e fra le sezioni */
.rd .st-pane>div{margin-bottom:12px;}
.rd .st-pane>div:last-child{margin-bottom:0;}
.rd .home-cards{gap:12px;}
.rd #homeScreen>.home-card+.home-card{margin-top:12px;}


/* ═══════════════════════════════════════════════════
   GERARCHIA — fase 4
   [1] il titolo dell'app occupava la misura eroe (34px) senza portare
       informazione: chi apre l'app sa già come si chiama.
   [2] le frecce › erano grandi quanto i numeri veri: rumore.
   [3] l'azione principale ora sta sopra il piano.
   ═══════════════════════════════════════════════════ */
/* [FIX] il core definisce il titolo SEI volte, una con identificativo
   (#homeScreen .home-title): serve pari specificità per allinearlo */
.rd #homeScreen .home-title{font-size:21px;letter-spacing:-.02em;margin-top:10px;}
.rd #homeScreen .home-sub{font-size:12px;}
.rd #homeScreen .home-card .hc-ar,
.rd #qDash .qtile-ar,
.rd #sdDash .sd-tile .sd-ar,
.rd #homeScreen .coach-row .cr-ar{font-size:17px;opacity:.35;font-weight:600;}
/* i numeri veri restano protagonisti */
.rd .tg-hd>b, .rd .mc-hd b, .rd .rc-score, .rd .ready-num{font-weight:850;}
/* respiro sopra l'azione, così stacca dal titolo */
.rd #homeScreen>.smart-btn{margin-top:4px;}


/* ═══════════════════════════════════════════════════
   SCALA ESTESA A TUTTE LE SEZIONI
   [BUG 5000] la fase 2 aveva allineato solo le card della home:
   Quiz, Mappa e Studio restavano con 8 raggi diversi (13, 15, 16,
   17, 23, 26, 30px). Ora seguono la stessa scala.
   ═══════════════════════════════════════════════════ */
/* livello card */
.rd .mbox, .rd #panel, .rd #sLogo, .rd .qc-card,
.rd .sd-hero, .rd .qres-card{border-radius:var(--r-card);}
/* livello riga */
.rd .qac, .rd .sr, .rd .qres-stat, .rd .toastN, .rd #sb,
.rd #sInd, .rd #mRT, .rd #mRS, .rd #mtBtn, .rd #stBtn,
.rd .mgr-row, .rd .sd-row{border-radius:var(--r-row);}
/* livello pillola */
.rd #segThumb, .rd #bNext, .rd #bPrev, .rd #bRev,
.rd .seg-thumb{border-radius:var(--r-pill);}

/* [BUG 5000] i <b> ereditavano il grassetto predefinito del browser
   (700) e uno arrivava a 900: fuori dalla scala a quattro livelli */
.rd b, .rd strong{font-weight:750;}
.rd .mc-hd b, .rd .tg-hd>b, .rd .rc-score,
.rd .qres-stat b, .rd .ready-num{font-weight:850;}


/* ═══════════════════════════════════════════════════
   [BUG 5000] il core ridefinisce le variabili dei raggi più volte con
   valori diversi (--r-xl vale 24, 28, 29 E 30; --r-lg vale 18, 22 e 23).
   Si fissano una volta sola sulla scala: tutto ciò che le usa si allinea
   da solo. Poi i pochi valori scritti a mano.
   ═══════════════════════════════════════════════════ */
.rd{--r-sm:10px;--r-md:14px;--r-lg:18px;--r-xl:22px;--r-2xl:22px;}

/* i valori scritti a mano, uno per uno */
.rd .qans{border-radius:var(--r-row);}
.rd .qerr-card, .rd .ob-card, .rd .qcard-hero,
.rd .logo-mark, .rd #nmHint{border-radius:var(--r-card);}
.rd .mbox{border-radius:var(--r-card) var(--r-card) 0 0;}
.rd .modal.center .mbox{border-radius:var(--r-card);}
.rd .toastN, .rd .qc-play, .rd .qrun-meta, .rd .bsv,
.rd #mgrF, .rd .qres-stat{border-radius:var(--r-row);}
.rd #tabbar{border-radius:var(--r-card);}
.rd #lineaBtn, .rd #segPill, .rd .btn, .rd .seg-wrap{border-radius:var(--r-row);}
.rd #qa{border-radius:var(--r-pill);}
.rd #mtMap, .rd #stMap{border-radius:var(--r-card);}
.rd .mt-train, .rd button.btn, .rd .qv-btn,
.rd .btn.br, .rd .btn.bp, .rd .btn.bs,
.rd #nf .btn, .rd #qf .btn{border-radius:var(--r-row);}


/* ══════ Suggerimento mirato (riquadro grande) ══════ */
.rd #tipLine.tip-card{display:flex;align-items:center;gap:12px;width:100%;max-width:var(--card-w);
margin:12px auto 0;padding:14px 16px;background:var(--card);border:1.5px solid var(--bd);
border-radius:var(--r-card);box-shadow:var(--sh-sm);cursor:pointer;text-align:left;
font-size:14px;font-weight:600;color:var(--tx);line-height:1.4;}
.rd #tipLine.tip-card b{font-weight:850;}
.tip-ic{font-size:21px;flex-shrink:0;}
.tip-tx{flex:1;}
.tip-n{font-size:10px;font-weight:750;color:var(--mu);flex-shrink:0;
background:var(--fill3);padding:3px 7px;border-radius:var(--r-pill);}
.rd #tipLine.tip-card:active{transform:scale(.985);}

/* ══════ Piano di oggi: verde fatto, rosso da fare ══════ */
.rd .coach-row.fatto{background:rgba(14,159,110,.07);}
.rd .coach-row.fatto .coach-ar{color:var(--ok);font-weight:850;}
.rd .coach-row.damorire{border-left:3px solid var(--err);}
.rd .coach-row.fatto{border-left:3px solid var(--ok);}
.stato-oggi{display:inline-block;margin-top:5px;font-size:10px;font-weight:850;
letter-spacing:.04em;text-transform:uppercase;padding:3px 8px;border-radius:var(--r-pill);}
.stato-oggi.si{background:rgba(14,159,110,.14);color:var(--ok);}
.stato-oggi.no{background:rgba(229,72,77,.12);color:var(--err);}
.rd .coach-hd strong{font-size:17px;font-weight:850;}
.giorno-bar{height:6px;margin:10px 14px 12px;border-radius:3px;background:var(--fill2);overflow:hidden;}
.giorno-bar i{display:block;height:100%;border-radius:3px;background:var(--ok);
transition:width var(--d3) var(--e-soft);}
`;
}catch(e){}
})();

(function(){
'use strict';
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
var _guard=selectRoute;
selectRoute=function(r){try{if(poly&&map)map.removeLayer(poly);}catch(e){}selectRoute=_guard;_guard(r);};
}catch(e){}
};
}catch(e){}
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
(function(){
'use strict';
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
try{
startMicro=function(){
openQuiz();
qStartRisk(8,{mode:'study',title:'Sessione 5 minuti',micro:true});
};
}catch(e){}
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
var _wrongRun=0;
try{
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
(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
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
(function(){
'use strict';
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
if(Q.mode==='study'&&qCurView==='run'){
if(ok)_wrongRunL=0;
else{_wrongRunL++;if(_wrongRunL===4&&!Q._bail){Q._bail=true;showBail();}}
}
}catch(e){}
};
}catch(e){}
try{
var _qfL=qFinish;
qFinish=function(t){
try{if(typeof Q!=='undefined'&&Q&&Q._finished)return;if(Q)Q._finished=true;}catch(e){}
_qfL(t);
if(qCurView==='result'){_ledDone=true;_led=[];}
};
}catch(e){}
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
(function(){
'use strict';
var TRAP=/\b(NON|MAI|SEMPRE|SOLO|SOLTANTO|ESCLUSIVAMENTE|VIETATO|OBBLIGATORIO|TUTTI|NESSUN[OA]?)\b/gi;
function trapify(txt){
return esc(txt).replace(TRAP,function(m){return '<b class="trap">'+m+'</b>';});
}
try{
var _qrr=qRenderRun;
qRenderRun=function(){
_qrr();
try{
var it=Q&&Q.items[Q.idx];if(!it)return;
var q=document.getElementById('qRunQ');
if(q)q.innerHTML=trapify(it.q);
var n=document.getElementById('qRunNum');
if(n&&!n.querySelector('.qdot')){
var i=QARG.findIndex(function(c){return c.id===it.cat;});
if(i>=0){var d=document.createElement('span');d.className='qdot catd'+(i%4);n.appendChild(d);}
}else if(n){
var dd=n.querySelector('.qdot'),ii=QARG.findIndex(function(c){return c.id===it.cat;});
if(dd&&ii>=0)dd.className='qdot catd'+(ii%4);
}
var clk=document.getElementById('qClock');
if(clk){var cell=clk.closest('.cell');if(cell)cell.style.display=(Q.limit?'':'none');}
}catch(e){}
};
}catch(e){}
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
if(wrongs.length>=3){try{rSR[cur.id]={box:1,due:Date.now()+2*86400000};ls('rSR',rSR);markDirty('prefs');nx=2;}catch(e){}}
var names=wrongs.slice(0,6).map(function(i){return '<span class="rdb-via" data-i="'+i+'">'+(i+1)+'. '+esc(cur.steps[i])+'</span>';}).join('');
o.innerHTML='<div class="rdb warn"><b>'+wrongs.length+' vie mancate</b><div class="rdb-list">'+names+'</div><small>Te le rimetto tra '+(nx||2)+' giorni · tocca una via per vederla</small></div>';
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
(function(){
'use strict';
var TIPS2=[
'Centrale FS: interscambio M2 Verde ↔ M3 Gialla',
'Loreto: interscambio M1 Rossa ↔ M2 Verde',
'Porta Garibaldi: M2 ↔ M5 Lilla, più i treni regionali',
'Lotto: interscambio M1 Rossa ↔ M5 Lilla',
'Sant\u2019Ambrogio: interscambio M2 Verde ↔ M4 Blu',
'Zara: interscambio M3 Gialla ↔ M5 Lilla',
'A4 Torino\u2013Venezia: l\u2019asse nord di Milano',
'L\u2019A1 del Sole parte verso Bologna dall\u2019uscita di Melegnano',
'A7 per Genova: esce da Milano a sud-ovest',
'Tangenziale Est A51: collega Melegnano alla Brianza',
'Tangenziale Nord A52: cerniera tra Rho e Monza',
'SS35 dei Giovi: la direttrice della Comasina verso Meda',
'A8 dei Laghi: parte dalla barriera di Milano Nord verso Varese',
'A50, A51, A52: Ovest, Est, Nord — le tre tangenziali in ordine',
'16 domande in 30 minuti: 1 minuto e 52 secondi l\u2019una',
'Rileggi sempre le domande con NON, MAI e SOLO: è lì che si cade',
'Max 2 errori per argomento: un argomento debole boccia da solo',
'Gli errori di ieri ripassati oggi si fissano il doppio',
'Il Cieco è il vero test: lo Studio serve solo a costruire la mappa',
'Sbagliare qui è gratis. Sbagliare all\u2019esame no: sbaglia adesso',
'Meglio chiudere una scheda errori che aprire dieci argomenti',
'Ripetere ad alta voce le vie in ordine: all\u2019orale conta la sequenza',
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
(function(){
'use strict';
var TIPS2=[
'Loreto è interscambio M1 Rossa ↔ M2 Verde',
'Centrale FS: M2 Verde ↔ M3 Gialla sotto la stazione',
'Garibaldi FS è interscambio M2 ↔ M5 Lilla',
'Zara è interscambio M3 Gialla ↔ M5 Lilla',
'Lotto è interscambio M1 Rossa ↔ M5 Lilla',
'Sant\u2019Ambrogio è interscambio M2 Verde ↔ M4 Blu',
'M5 Lilla: da Bignami a San Siro Stadio',
'M4 Blu: da Linate a San Cristoforo, passa per San Babila',
'M3 Gialla: da Comasina a San Donato',
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
'Occhio a NON, SOLO e SEMPRE: metà degli errori nasce lì',
'Leggi TUTTE le risposte: la prima "quasi giusta" è una trappola',
'Se due risposte sembrano uguali, la differenza è in UNA parola',
'16 domande, 4 argomenti: un argomento debole boccia da solo',
'Gli errori di ieri ripassati oggi si fissano il doppio',
'Il Cieco vale il doppio dello Studio: prima copri, poi ricorda',
'Tieni premuto su una via: scopri in quanti percorsi compare',
'⚡ Riscaldamento prima della simulazione: 5 errori in 2 minuti',
'Prima la scheda errori, poi le nuove: si costruisce sul solido',
'In Cieco ripeti ad alta voce: "la settima via è\u2026"',
'Sbagliare in allenamento è il modo più veloce di imparare',
'Tocca il punto debole nel Quiz: parte una missione 🎯'
];
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
(function(){
'use strict';
try{
window.readinessScore=function(){
var qok=0,qseen=0;try{var c=qtStats.cat||{};Object.keys(c).forEach(function(k){qok+=c[k].ok||0;qseen+=c[k].seen||0;});}catch(e){}
var quiz=qseen?Math.round(qok/qseen*100):0;
var rdone=0,rtot=0;try{rtot=routes.length;rdone=routes.filter(function(r){return done[r.id];}).length;}catch(e){}
var topo=rtot?Math.round(rdone/rtot*100):0;
return {score:Math.round(quiz*0.6+topo*0.4),quiz:quiz,flash:0,topo:topo};
};
}catch(e){}
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
try{
var _ctR=coachTasks;
coachTasks=function(){
var t=_ctR();
try{
var ti=targetInfo();
var now=Date.now();
var due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=now;}).length;
if(due>0&&due<3){
t=t.filter(function(x){return x.ic!=='🔁';});
}
var cov=ti?ti.pctQ:Math.round(Object.keys(qtStats.seenIds||{}).length/(QUIZ_ALL.length||919)*100);
var simsW=(qExamHist||[]).filter(function(x){return x.d&&(now-x.d)<7*86400000;}).length;
if(cov>=80&&simsW<2){
var ex=t.find(function(x){return x.ic==='🎓';});
if(ex){ex.p=0.8;ex.sub='Copertura al '+cov+'%: ora contano le simulazioni ('+simsW+' questa settimana, servono 2-3)';}
else t.push({ic:'🎓',tx:'Simulazione d\u2019esame',sub:'Copertura al '+cov+'%: ora contano le simulazioni ('+simsW+' su 2-3 settimanali)',fn:function(){openQuiz();setTimeout(qStartExam,250);},p:0.8});
}
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
(function(){
'use strict';
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
if(firstTime&&rSR[cur.id]){
rSR[cur.id].due=Date.now()+86400000;
ls('rSR',rSR);markDirty('prefs');
}
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
try{
var _ctS=coachTasks;
coachTasks=function(){
var t=_ctS();
try{
var now=Date.now(),today=new Date().toDateString();
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
(function(){
'use strict';
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
why.textContent='🚑 Modalità recupero: '+d.due+' scaduti su '+d.open+' totali'+(d.old3?(' · '+d.old3+' da 3+ giorni'):'')+'. Stop alle nuove: '+giorni+' giorni a 40 al giorno e sei in pari.';
why.classList.add('why-alert');
}else why.classList.remove('why-alert');
}catch(e){}
};
}catch(e){}
try{
var _ctD=coachTasks;
coachTasks=function(){
var t=_ctD();
try{
var d=debtInfo();
if(!d.heavy)return t;
t=t.filter(function(x){return x.ic!=='🆕'&&x.ic!=='⏩';});
var sc=t.find(function(x){return x.ic==='🔁';});
if(sc){sc.p=0.2;}
else t.unshift({ic:'🔁',tx:'Scheda errori 1 di '+Math.ceil(d.due/40)+' (40 alla volta)',sub:d.old3+' arretrati da 3+ giorni',fn:function(){openQuiz();setTimeout(function(){qStartCat('errata');},250);},p:0.2});
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
(function(){
'use strict';
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
window.qStartTwins=function(it){
try{
buildQuiz();
var pool=QUIZ_ALL.filter(function(x){return x.sub===it.sub&&x.id!==it.id;});
if(pool.length<2){toast2('Nessuna domanda gemella su questo tema');return;}
var twins=qShuffle(pool).slice(0,4);
startQuiz([it].concat(twins),{mode:'study',title:'La stessa regola, 5 modi'});
}catch(e){}
};
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
try{
var _smL=srMark;
srMark=function(id,correct){
var before=qtStats.err[id]!==undefined;
_smL(id,correct);
try{
var after=qtStats.err[id]!==undefined;
var k=_dayKey(),bal=lg('errBal',{});
/* [IGIENE] tiene solo gli ultimi 40 giorni: cresceva all'infinito */
try{
var kk=Object.keys(bal);
if(kk.length>40){kk.sort();kk.slice(0,kk.length-40).forEach(function(x){delete bal[x];});}
}catch(e){}
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
(function(){
'use strict';
var SUBLAB={geo_terr:'Geografia · territorio',geo_vie:'Geografia · vie e strade',
norm_legge:'Normativa · legge',norm_aero:'Normativa · aeroporti',
reg_com:'Regolamento · comunale',reg_dov:'Regolamento · doveri',lingua:'Inglese'};
var _susp={};
function pOk(it){
try{
var id=it.id,now=Date.now();
var e=(qtStats.err||{})[id];
if(e&&typeof e==='object'){var b=e.box||0;return 0.34+0.15*b;}     /* in pila: 34/49/64% */
if(_susp[id])return 0.3;                                            /* cronica sospesa: non è sana */
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
try{_susp=lg('chronSusp',{})||{};}catch(e0){_susp={};}/*[FIX 2000] letto UNA volta, non 919*/
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
var pass=0;
(function walk(i,sum,prob){
if(prob<1e-9)return;
if(i===cats.length){if(sum<=4)pass+=prob;return;}
for(var k=0;k<=2;k++)walk(i+1,sum+k,prob*cats[i].dist[k]);
})(0,0,1);
var expErr=cats.reduce(function(a,c){return a+c.expErr;},0);
var worst=cats.slice().sort(function(a,b){return b.over-a.over;})[0];
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
(function(){
'use strict';
var DAY=86400000;
function dayIdx(ts){return Math.floor(ts/DAY);}
function loadMap(){
try{
var m={};
Object.keys(qtStats.err||{}).forEach(function(id){
var d=srDue(id);if(!d)return;
var k=dayIdx(d);m[k]=(m[k]||0)+1;
});
return m;
}catch(e){return {};}
}
function smooth(due){return due;}
try{
var _sm2=srMark;
srMark=function(id,correct){
var pre=qtStats.err[id];
var preBox=(pre&&typeof pre==='object')?(pre.box||0):0;
_sm2(id,correct);
try{
var e=qtStats.err[id];
if(correct&&e&&typeof e==='object'){
var w=(qtStats.why||{})[id]||{};
var distratto=(w.l||0)>(w.k||0);
if(distratto&&(e.box||0)>=2){delete qtStats.err[id];return;}/* archiviata prima */
e.due=smooth(e.due);
}else if(!correct&&e&&typeof e==='object'){
e.due=smooth(e.due+(preBox>=2?DAY:0));
}
}catch(e2){}
};
}catch(e){}
window.chronicList=function(){
try{
buildQuiz();
var wn=qtStats.wrongN||{},out=[];
Object.keys(wn).forEach(function(id){
if(wn[id]>=5&&QUIZ_ALL[id|0])out.push(QUIZ_ALL[id|0]);
});
return out.sort(function(a,b){return wn[b.id]-wn[a.id];});
}catch(e){return [];}
};
try{
var _smC=srMark;
srMark=function(id,correct){
_smC(id,correct);
try{
var wn=(qtStats.wrongN||{})[id]||0;
var susp=lg('chronSusp',{});
if(!correct&&wn>=5&&!susp[id]){
susp[id]=Date.now();delete susp[id+'_ok'];/*[FIX 10k] niente residui dai tentativi precedenti*/
ls('chronSusp',susp);
delete qtStats.err[id];
try{qtSave();updateTabBadge();}catch(e){}
}else if(correct&&susp[id]){
susp[id+'_ok']=(susp[id+'_ok']||0)+1;
if(susp[id+'_ok']>=2){delete susp[id];delete susp[id+'_ok'];qtStats.wrongN[id]=2;toast2('🩹 Cronica riabilitata');}
ls('chronSusp',susp);
}
}catch(e){}
};
}catch(e){}
try{
var _ct7=coachTasks;
coachTasks=function(){
var t=_ct7();
try{
var ch=chronicList();
if(ch.length<3)return t;
t.push({ic:'🩹',tx:ch.length+' domande croniche',sub:'Sbagliate 5+ volte: i ripassi non bastano, serve capire la regola',fn:function(){
buildQuiz();
var it=ch[0];
var mine=ch.filter(function(x){return x.sub===it.sub;}).slice(0,5);
var ids={};mine.forEach(function(x){ids[x.id]=1;});
var twins=qShuffle(QUIZ_ALL.filter(function(x){return x.sub===it.sub&&!ids[x.id];})).slice(0,6);
openQuiz();
setTimeout(function(){
startQuiz(qShuffle(mine.concat(twins)),{mode:'study',title:'Croniche · la regola'});
},250);
},p:1.6});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}
var _tShow=0;
try{
var _qrr2=qRenderRun;
qRenderRun=function(){_qrr2();_tShow=Date.now();};
document.addEventListener('visibilitychange',function(){
if(document.visibilityState==='visible')_tShow=Date.now();
});
}catch(e){}
try{
var _qp2=qPick;
qPick=function(i){
var it=null,prev=-1;
try{if(typeof Q!=='undefined'&&Q){it=Q.items[Q.idx];prev=Q.ans[Q.idx];}}catch(e){}
_qp2(i);
try{
if(!it||prev!==-1||!_tShow)return;
if(Q&&Q.mode==='exam')return;                       /* in esame il tempo è già la prova */
var sec=(Date.now()-_tShow)/1000;
var _sps={};try{_sps=lg('chronSusp',{})||{};}catch(e9){}
if(i===it.correct&&sec>40&&!qtStats.err[it.id]&&!_sps[it.id]){/*[FIX 10k] le sospese non rientrano di nascosto*/
qtStats.err[it.id]={box:2,due:smooth(Date.now()+3*DAY)};
try{qtSave();}catch(e){}
toast2('⏳ Giusta ma lenta: la rivedi tra 3 giorni');
}
}catch(e){}
};
}catch(e){}
try{
var _rc9=renderCoach;
renderCoach=function(){
_rc9();
try{
var m=loadMap(),k=dayIdx(Date.now()),oggi=0;
Object.keys(m).forEach(function(x){if(+x<=k)oggi+=m[x];});
var why=document.querySelector('.coach-why');
if(!why||why.querySelector('.lvl'))return;
var dom=(m[k+1]||0),dopo=(m[k+2]||0);
if(oggi>0&&(dom||dopo)){
var s=document.createElement('span');s.className='lvl';
s.textContent=' · In arrivo dalla coda: '+dom+' domani, '+dopo+' dopodomani';
why.appendChild(s);
}
}catch(e){}
};
}catch(e){}
})();
(function(){
'use strict';
try{
var _qr=qRisk;
qRisk=function(it){
try{
if(!qtStats.seenIds[it.id]&&Object.keys(qtStats.err||{}).length>150)return -1;
}catch(e){}
return _qr(it);
};
}catch(e){}
try{
var _qsr=qStartRisk;
qStartRisk=function(n,opts){
try{
if(Object.keys(qtStats.err||{}).length>150){
buildQuiz();
var items=QUIZ_ALL.filter(function(it){return qtStats.seenIds[it.id];})
.map(function(it){return [qRisk(it)+Math.random()*0.6,it];})
.sort(function(a,b){return b[0]-a[0];}).slice(0,n||12).map(function(x){return x[1];});
if(items.length){startQuiz(qShuffle(items),opts||{mode:'study',title:'Sessione intelligente'});
toast2('🚦 Freno sulle nuove: prima svuotiamo la pila');return;}
}
}catch(e){}
_qsr(n,opts);
};
}catch(e){}
})();
(function(){
'use strict';
var DAY=86400000;
function myPace(){
try{
var dd=qtStats.daily||{},v=[];
for(var i=1;i<=7;i++){var d=new Date();d.setDate(d.getDate()-i);v.push(dd[_dayKey(d)]||0);}
v.sort(function(a,b){return a-b;});
return Math.max(10,v[3]||0);            /* mediana: robusta ai giorni di pausa */
}catch(e){return 30;}
}
function myAcc(){
try{
var ok=0,seen=0,c=qtStats.cat||{};
Object.keys(c).forEach(function(k){ok+=c[k].ok||0;seen+=c[k].seen||0;});
return seen>50?Math.max(0.5,Math.min(0.95,ok/seen)):0.75;
}catch(e){return 0.75;}
}
function runSim(pace,acc,horizon){
try{
var err={},now=Date.now();
Object.keys(qtStats.err||{}).forEach(function(id){
var e=qtStats.err[id];
err[id]={box:(e&&e.box)||0,due:Math.max(0,Math.round(((e&&e.due||now)-now)/DAY))};
});
var newLeft=QUIZ_ALL.filter(function(x){return !qtStats.seenIds[x.id];}).length;
var emptyDay=null;
for(var day=0;day<horizon;day++){
var due=Object.keys(err).filter(function(k){return err[k].due<=day;});
if(!due.length&&emptyDay===null)emptyDay=day;
due.sort(function(a,b){return err[b].box-err[a].box;});
var done=0;
due.slice(0,pace).forEach(function(k){
done++;
if(Math.random()<acc){
err[k].box++;
if(err[k].box>=(Math.random()<0.35?2:3))delete err[k];   /* 35% distrazione → esce a 2 */
else err[k].due=day+[1,3,7][err[k].box];
}else{err[k].box=0;err[k].due=day+1;}
});
var rest=pace-done;
for(var j=0;j<rest&&newLeft>0;j++){
newLeft--;
if(Math.random()>acc)err['n'+day+'_'+j]={box:0,due:day+1};
}
}
return {empty:emptyDay,left:Object.keys(err).length};
}catch(e){return null;}
}
var _pCache=null,_pTs=0;
window.projectPile=function(){
try{
if(_pCache&&Date.now()-_pTs<600000)return _pCache;
var pace=myPace(),acc=myAcc(),N=25,H=45;
function batch(p,a){
var days=[],hit=0,left=0;
for(var i=0;i<N;i++){var r=runSim(p,a,H);if(!r)continue;left+=r.left;if(r.empty!==null){hit++;days.push(r.empty);}}
days.sort(function(x,y){return x-y;});
return {p:Math.round(hit/N*100),d:days.length?days[Math.floor(days.length/2)]:null,left:Math.round(left/N)};
}
var base=batch(pace,acc);
var better=batch(pace,Math.min(0.95,acc+0.1));
var faster=batch(Math.round(pace*1.5),acc);
_pCache={pace:pace,acc:Math.round(acc*100),base:base,better:better,faster:faster};
_pTs=Date.now();
return _pCache;
}catch(e){return null;}
};
function renderProj(){
try{
var anchor=document.getElementById('modelCard')||document.getElementById('examLight');
if(!anchor)return;
var old=document.getElementById('projCard');if(old)old.remove();
var open=Object.keys(qtStats.err||{}).length;
if(open<20)return;
var pr=projectPile();if(!pr)return;
function when(d){
if(d===null)return null;
var dt=new Date(Date.now()+d*DAY);
return dt.toLocaleDateString('it-IT',{day:'numeric',month:'long'});
}
var main,sub;
if(pr.base.d!==null&&pr.base.p>=40){
main='Pila vuota intorno al <b>'+when(pr.base.d)+'</b>';
sub='Al tuo ritmo ('+pr.pace+'/giorno, '+pr.acc+'% di precisione). Con il '+(pr.acc+10)+'% arriveresti al '+(when(pr.better.d)||'—')+'.';
}else{
main='Al ritmo attuale <b>la pila non si svuota</b>';
sub='Restano ~'+pr.base.left+' errori dopo 45 giorni. A '+Math.round(pr.pace*1.5)+'/giorno: '+(pr.faster.d!==null?('vuota il '+when(pr.faster.d)):('restano ~'+pr.faster.left))+'.';
}
var el=document.createElement('div');el.id='projCard';
el.innerHTML='<div class="pj-hd">🔮 PROIEZIONE 45 GIORNI</div><div class="pj-main">'+main+'</div><div class="pj-sub">'+sub+'</div>';
anchor.after(el);
}catch(e){}
}
try{
var _relP=renderExamLight;
renderExamLight=function(){_relP();setTimeout(renderProj,60);};
}catch(e){}
})();
(function(){
'use strict';
try{
var _qfC=qFinish;
qFinish=function(t){
var pred=null;
try{if(typeof Q!=='undefined'&&Q&&Q.mode==='exam'){var m=studentModel();if(m)pred=(m.expRaw!==undefined?m.expRaw:m.expScore);}}catch(e){}/*[FIX] si tara sul valore GREZZO, altrimenti la correzione si auto-annulla*/
_qfC(t);
try{
if(pred===null||!lastQuiz||!lastQuiz.opts||lastQuiz.opts.mode!=='exam')return;
var h=(qExamHist||[]);var last=h[h.length-1];if(!last)return;
var err=(last.ok||0)-pred;                       /* >0 = il modello ti sottovaluta */
var bias=lg('modelBias',0);
bias=Math.max(-2.5,Math.min(2.5,bias*0.7+err*0.3));
ls('modelBias',bias);
var n=lg('modelN',0)+1;ls('modelN',n);
if(n>=2&&Math.abs(bias)>0.6){
setTimeout(function(){toast2('🎛 Modello tarato sui tuoi esami: '+(bias>0?'+':'')+bias.toFixed(1)+' punti',3200);},1400);
}
}catch(e){}
};
}catch(e){}
try{
var _smB2=studentModel;
studentModel=function(){
var m=_smB2();
try{
if(!m)return m;
var b=lg('modelBias',0);
if(m._raw===undefined)m._raw=m.expScore;/*[FIX 2000] baseline fissa: la cache veniva ri-tarata a ogni lettura*/
m.expRaw=m._raw;
if(Math.abs(b)>0.2&&lg('modelN',0)>=2){
m.expScore=Math.max(0,Math.min(16,m._raw+b));
m.tuned=b;
}else m.expScore=m._raw;
}catch(e){}
return m;
};
}catch(e){}
function sensitivity(m){
try{
function failWith(cats){
var pass=0;
(function walk(i,sum,prob){
if(prob<1e-9)return;
if(i===cats.length){if(sum<=4)pass+=prob;return;}
for(var k=0;k<=2;k++)walk(i+1,sum+k,prob*cats[i][k]);
})(0,0,1);
return 1-pass;
}
function distOf(pe){var d=[];for(var k=0;k<=4;k++){var c=1;for(var i=0;i<k;i++)c=c*(4-i)/(i+1);d.push(c*Math.pow(pe,k)*Math.pow(1-pe,4-k));}return d;}
var base=m.cats.map(function(c){return c.dist;});
var f0=failWith(base);
var out={};
m.cats.forEach(function(c,idx){
var mod=base.slice();
mod[idx]=distOf(Math.max(0,c.pErr-0.05));
out[c.id]=Math.max(0,(f0-failWith(mod))/0.05);   /* sensibilità dell'argomento */
});
return out;
}catch(e){return {};}
}
window.qStartOptimal=function(n){
try{
buildQuiz();
var m=studentModel();if(!m){qStartRisk(n||12);return;}
var sens=sensitivity(m);
var _sp={};try{_sp=lg('chronSusp',{})||{};}catch(e0){}/*[FIX 2000] una lettura sola*/
var nPerCat={};m.cats.forEach(function(c){nPerCat[c.id]=QUIZ_ALL.filter(function(x){return x.cat===c.id;}).length||1;});
var scored=QUIZ_ALL.map(function(it){
var p=(function(){try{var e=qtStats.err[it.id];if(e&&typeof e==='object')return 0.34+0.15*(e.box||0);
if(_sp[it.id])return 0.3;
if(!qtStats.seenIds[it.id])return 0.55;
return ((qtStats.wrongN||{})[it.id]||0)>0?0.84:0.94;}catch(e2){return 0.8;}})();
var gain=Math.max(0,0.92-p);                       /* quanto puoi guadagnare su questa */
var v=gain*(sens[it.cat]||0)/nPerCat[it.cat];
return [v+Math.random()*1e-6,it,gain];
}).filter(function(x){return x[2]>0.02;});
if(scored.length<5){qStartRisk(n||12);return;}
scored.sort(function(a,b){return b[0]-a[0];});
var deck=scored.slice(0,n||12).map(function(x){return x[1];});
var before=m.fail;
ls('optBefore',before);
startQuiz(qShuffle(deck),{mode:'study',title:'Sessione ottimale',optimal:true});
toast2('🎯 Le '+deck.length+' domande che valgono più punti d\u2019esame');
}catch(e){qStartRisk(n||12);}
};
try{
var _qfO=qFinish;
qFinish=function(t){
_qfO(t);
try{
if(qCurView!=='result'||!lastQuiz||!lastQuiz.opts||!lastQuiz.opts.optimal)return;
var before=lg('optBefore',null);if(before===null)return;
var m=studentModel();if(!m)return;
var d=before-m.fail;
var box=document.querySelector('#qResult .qres-actions');if(!box)return;
var old=document.getElementById('optDelta');if(old)old.remove();
var el=document.createElement('div');el.id='optDelta';
el.innerHTML=d>0?('📉 Rischio bocciatura: <b>'+before+'% → '+m.fail+'%</b> (−'+d+' punti)')
:(d<0?('📈 Rischio salito a <b>'+m.fail+'%</b>: queste domande vanno riviste')
:('Rischio invariato: <b>'+m.fail+'%</b>'));
box.parentNode.insertBefore(el,box);
ls('optBefore',null);
}catch(e){}
};
}catch(e){}
try{
var _rdO=renderDash;
renderDash=function(){
_rdO();
try{
if(document.getElementById('optTile'))return;
var anchor=document.getElementById('smartTile')||document.querySelector('#qDash [onclick="qStartNew()"]');
if(!anchor)return;
if(Object.keys(qtStats.seenIds||{}).length<40)return;
var b=document.createElement('button');
b.id='optTile';b.className='qtile';
b.onclick=function(){qStartOptimal(12);};
b.innerHTML='<div class="qtile-ic" style="background:rgba(14,159,110,.12)">🎯</div>'
+'<div class="qtile-tx"><strong>Sessione ottimale</strong><small>Le 12 domande che abbassano di più il rischio bocciatura</small></div>'
+'<div class="qtile-ar">›</div>';
anchor.parentNode.insertBefore(b,anchor);
}catch(e){}
};
}catch(e){}
})();
(function(){
'use strict';
var TABS=[{k:'p',lab:'Prontezza',ids:['readyCard','examLight']},
{k:'r',lab:'Rischio',ids:['modelCard']},
{k:'f',lab:'Proiezione',ids:['projCard']}];/*[FIX 300] spiralCard resta fuori: è azione, non statistica*/
var active=0,busy=false;
function build(){
try{
var home=document.getElementById('homeScreen');if(!home)return null;
var sc=document.getElementById('stateCard');
if(sc)return sc;
sc=document.createElement('div');sc.id='stateCard';
var seg='<div class="st-seg">'+TABS.map(function(t,i){
return '<button data-i="'+i+'" class="st-tab'+(i===0?' on':'')+'">'+t.lab+'</button>';
}).join('')+'</div>';
sc.innerHTML=seg+TABS.map(function(t,i){return '<div class="st-pane'+(i===0?' on':'')+'" data-p="'+i+'"></div>';}).join('');
sc.querySelector('.st-seg').addEventListener('click',function(e){
var b=e.target.closest('.st-tab');if(!b)return;
active=+b.dataset.i;
sc.querySelectorAll('.st-tab').forEach(function(x,i){x.classList.toggle('on',i===active);});
sc.querySelectorAll('.st-pane').forEach(function(x,i){x.classList.toggle('on',i===active);});
try{hap();}catch(err){}
});
return sc;
}catch(e){return null;}
}
window.layoutHome=function(){
if(busy)return;busy=true;
try{
var home=document.getElementById('homeScreen');
if(!home||home.style.display==='none'){busy=false;return;}
var sc=build();if(!sc){busy=false;return;}
var coach=document.getElementById('coachCard');
var btn=home.querySelector('.smart-btn');
var week=document.getElementById('weekChart');
var plan=document.getElementById('planCard');
/* [GERARCHIA] l'azione viene PRIMA del piano: aprendo l'app la prima
   cosa che vedi è cosa fare, non l'elenco di cosa c'è da fare */
if(btn&&coach&&btn.nextElementSibling!==coach)coach.before(btn);
if(coach&&coach.nextElementSibling!==sc)coach.after(sc);
else if(!coach&&btn&&btn.nextElementSibling!==sc)btn.after(sc);
else if(!btn&&!coach&&!sc.parentNode)home.appendChild(sc);
if(plan&&sc.nextElementSibling!==plan&&plan.parentNode===home)sc.after(plan);
var sp=document.getElementById('spiralCard');
if(sp&&plan&&plan.nextElementSibling!==sp&&sp.parentNode!==plan)plan.after(sp);
TABS.forEach(function(t,i){
var pane=sc.querySelector('.st-pane[data-p="'+i+'"]');if(!pane)return;
t.ids.forEach(function(id){
var el=document.getElementById(id);
if(el&&el.parentNode!==pane)pane.appendChild(el);
});
});
sc.querySelectorAll('.st-tab').forEach(function(b,i){
var pane=sc.querySelector('.st-pane[data-p="'+i+'"]');
var empty=!pane||!pane.children.length;
b.classList.toggle('off',empty);
if(empty&&i===active){active=0;
sc.querySelectorAll('.st-tab').forEach(function(x,j){x.classList.toggle('on',j===0);});
sc.querySelectorAll('.st-pane').forEach(function(x,j){x.classList.toggle('on',j===0);});}
});
var firstSec=home.querySelector('.home-card');
if(week&&firstSec&&week.nextElementSibling!==firstSec)firstSec.before(week);
}catch(e){}
busy=false;
};
var _lt=null;
function relayout(){clearTimeout(_lt);_lt=setTimeout(function(){try{layoutHome();}catch(e){}},80);}
['renderReadiness','renderExamLight','renderPlan','renderCoach','renderWeekly'].forEach(function(fn){
try{
if(typeof window[fn]!=='function')return;
var _o=window[fn];
window[fn]=function(){var r=_o.apply(this,arguments);relayout();return r;};
}catch(e){}
});
try{var _gh9=goHome;goHome=function(){_gh9();relayout();};}catch(e){}
setTimeout(relayout,1200);
})();
(function(){
'use strict';
var DAY=86400000;
function pVia(r,i){
try{
var w=((qStats[r.id]||{}).wrong||{})[i]||0;
var p=0.94-Math.min(0.5,w*0.13);                 /* ogni errore su quella via pesa */
var sr=rSR[r.id];
if(!done[r.id])p-=0.25;                          /* mai completato */
else if(sr&&sr.due){
var over=(Date.now()-sr.due)/DAY;
if(over>0)p-=Math.min(0.22,over*0.02);         /* scaduto da giorni = sbiadito */
p+=Math.min(0.06,(sr.box||0)*0.03);            /* più volte ripassato = più solido */
}
return Math.max(0.35,Math.min(0.98,p));
}catch(e){return 0.8;}
}
var _tCache=null,_tTs=0;
window.topoModel=function(){
try{
if(_tCache&&Date.now()-_tTs<4000)return _tCache;/*[FIX 2000] cache come gli altri modelli*/
if(!routes.length)return null;
var rows=routes.map(function(r){
if(!r.steps||!r.steps.length)return null;
/* [FIX] il prodotto di tutte le vie collassa a zero sui percorsi lunghi:
misurava la lunghezza, non la preparazione. Ora: media delle vie che sai +
probabilità di completare con AL MASSIMO 1 errore. */
var ps=[],worst=null,wp=1;
r.steps.forEach(function(_,i){var q=pVia(r,i);ps.push(q);if(q<wp){wp=q;worst=i;}});
var p0=1;ps.forEach(function(q){p0*=q;});
var p1=0;ps.forEach(function(q){if(q>0.0001)p1+=p0/q*(1-q);});
var media=ps.reduce(function(a,b){return a+b;},0)/ps.length;
return {r:r,clean:Math.min(1,p0+p1),media:media,worst:worst,wp:wp,n:r.steps.length};
}).filter(Boolean);
if(!rows.length)return null;
rows.sort(function(a,b){return a.clean-b.clean;});
var avg=rows.reduce(function(s,x){return s+x.media;},0)/rows.length;
var byName={};
routes.forEach(function(r){
var wm=(qStats[r.id]||{}).wrong||{};
Object.keys(wm).forEach(function(k){
var nm=r.steps[+k];if(!nm||!wm[k])return;
byName[nm]=byName[nm]||{n:0,rt:0};
byName[nm].n+=wm[k];byName[nm].rt++;
});
});
var nere=Object.keys(byName).sort(function(a,b){
return (byName[b].rt*10+byName[b].n)-(byName[a].rt*10+byName[a].n);
}).slice(0,5).map(function(nm){return {nome:nm,err:byName[nm].n,perc:byName[nm].rt};});
_tCache={avg:avg,rows:rows,nere:nere,rischio:rows.filter(function(x){return x.clean<0.5;}).length};
_tTs=Date.now();return _tCache;
}catch(e){return null;}
};
function renderTopo(){
try{
var pane=document.querySelector('#stateCard .st-pane[data-p="1"]');
var anchor=pane||document.getElementById('modelCard');
if(!anchor)return;
var old=document.getElementById('topoCard');if(old)old.remove();
var m=topoModel();if(!m||m.rows.length<3)return;
var top=m.rows.slice(0,3).map(function(x){
var pc=Math.round(x.clean*100),pm=Math.round((x.media||x.clean)*100);
var cls=pc>=60?'ok':(pc>=35?'mid':'no');
var t=x.r.title.length>24?x.r.title.slice(0,22)+'…':x.r.title;
return '<div class="mc-row tp-row" data-id="'+x.r.id+'"><span>'+esc(t)+'</span><div class="mc-bar '+cls+'"><i style="width:'+pm+'%"></i></div><b>'+pc+'%</b></div>';
}).join('');
var nere=m.nere.length?('<div class="tp-nere">🖤 Vie che ti bocciano: '+m.nere.slice(0,3).map(function(v){
return '<b>'+esc(v.nome.length>20?v.nome.slice(0,18)+'…':v.nome)+'</b>'+(v.perc>1?(' ('+v.perc+' percorsi)'):'');
}).join(' · ')+'</div>'):'';
var el=document.createElement('div');el.id='topoCard';
el.innerHTML='<div class="mc-hd"><div><small>TOPOGRAFIA · VIE CHE SAI</small><b>'+Math.round(m.avg*100)+'<span>%</span></b></div>'
+'<div class="mc-risk"><small>A RISCHIO</small><b>'+m.rischio+'</b></div></div>'
+'<div class="mc-sub">Vie che ricordi · accanto, probabilità di completare il percorso con max 1 errore:</div>'
+top+nere;
el.addEventListener('click',function(e){
var row=e.target.closest('.tp-row');if(!row)return;
var r=routes.find(function(x){return x.id===row.dataset.id;});if(!r)return;
goTopografia();
setTimeout(function(){selectRoute(r);setTimeout(function(){setMode('c');},250);},300);
});
if(pane)pane.appendChild(el);else anchor.after(el);
}catch(e){}
}
try{
var _relT=renderExamLight;
renderExamLight=function(){_relT();setTimeout(renderTopo,90);};
}catch(e){}
try{
var _ctT=coachTasks;
coachTasks=function(){
var t=_ctT();
try{
var m=topoModel();if(!m||!m.rows.length)return t;
var w=m.rows[0];
if(w.clean>0.45)return t;
if(t.some(function(x){return x.ic==='🗺️';}))return t;   /* già c'è un task percorsi */
t.push({ic:'🧭',tx:'Il percorso più a rischio',sub:w.r.title+' — '+Math.round(w.clean*100)+'% di farlo pulito'+(w.worst!==null?(' · la via critica è la '+(w.worst+1)):''),fn:function(){
goTopografia();
setTimeout(function(){selectRoute(w.r);setTimeout(function(){setMode('c');},250);},300);
},p:1.35});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}
})();
(function(){
'use strict';
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var io=null;
function observer(){
if(io)return io;
try{
io=new IntersectionObserver(function(entries){
entries.forEach(function(en){
if(!en.isIntersecting)return;
en.target.classList.add('rv-in');
io.unobserve(en.target);
});
},{rootMargin:'0px 0px -8% 0px',threshold:0.06});
}catch(e){io=null;}
return io;
}
function choreograph(root,sel){
try{
var o=observer();if(!o)return;
var els=(root||document).querySelectorAll(sel);
var i=0;
els.forEach(function(el){
if(el.classList.contains('rv'))return;
el.classList.add('rv');
el.style.setProperty('--i',(i++)%6);
var r=el.getBoundingClientRect();
if(r.top<window.innerHeight&&r.bottom>0)el.classList.add('rv-in');
else o.observe(el);
});
}catch(e){}
}
function revealAll(){try{document.querySelectorAll('.rv:not(.rv-in)').forEach(function(el){
var r=el.getBoundingClientRect();if(r.width||r.height)el.classList.add('rv-in');});}catch(e){}}
var _rvN=0,_rvT=setInterval(function(){revealAll();
if(++_rvN>20)clearInterval(_rvT);},3000);/*[FIX 2000] rete di sicurezza per 1 minuto, poi si spegne: non serve a vita*/
function homeIn(){choreograph(document.getElementById('homeScreen'),'#coachCard,.smart-btn,#stateCard,#planCard,#spiralCard,#weekChart,.home-card');setTimeout(revealAll,1500);}
function quizIn(){choreograph(document.getElementById('qDash'),'.qtile,.qcard-hero,.qerr-box');}
try{
var _gh10=goHome;goHome=function(){_gh10();setTimeout(homeIn,60);};
var _oq3=openQuiz;openQuiz=function(){_oq3();setTimeout(quizIn,60);};
var _rd10=renderDash;renderDash=function(){_rd10();setTimeout(quizIn,40);};
}catch(e){}
setTimeout(homeIn,1400);
try{
var first=!lg('seenOnce',false);
if(first){
ls('seenOnce',true);
['readyCard','planCard'].forEach(function(id){
var el=document.getElementById(id);
if(el&&!el.children.length){el.classList.add('skl');el.style.minHeight='84px';
setTimeout(function(){el.classList.remove('skl');el.style.minHeight='';},900);}
});
}
}catch(e){}
try{
setTimeout(function(){
var sc=document.getElementById('stateCard');if(!sc)return;
var last=0;
sc.addEventListener('click',function(e){
var b=e.target.closest('.st-tab');if(!b)return;
var i=+b.dataset.i;
var pane=sc.querySelector('.st-pane[data-p="'+i+'"]');
if(pane){
pane.style.animation='none';void pane.offsetWidth;
pane.style.animation='rvIn var(--d2) var(--e-soft) both';
}
last=i;
});
},1600);
}catch(e){}
})();
(function(){
'use strict';
function dueCount(){try{var n=0,now=Date.now();Object.keys(qtStats.err||{}).forEach(function(id){if(srDue(id)<=now)n++;});return n;}catch(e){return 99;}}
/* [FIX] il consolidamento vale solo quando la copertura è quasi finita:
   senza questo controllo compariva anche su un'installazione nuova,
   contraddicendo il messaggio "si comincia". */
function consolidabile(){
try{
buildQuiz();
var viste=Object.keys(qtStats.seenIds||{}).length;
var tot=(QUIZ_ALL&&QUIZ_ALL.length)||919;
return viste>=40&&viste>=tot*0.8&&dueCount()<20;
}catch(e){return false;}
}
try{
var _smC2=startMicro;
startMicro=function(){
try{
if(consolidabile()){
openQuiz();
setTimeout(function(){qStartOptimal(8);},250);
return;
}
}catch(e){}
_smC2();
};
}catch(e){}
try{
var _ctK=coachTasks;
coachTasks=function(){
var t=_ctK();
try{
if(!consolidabile())return t;
var m=(typeof studentModel==='function')?studentModel():null;
if(!m)return t;
t.unshift({ic:'💎',tx:'Consolidamento — 12 domande mirate',sub:'Pila sotto controllo: ora si abbassa il rischio ('+m.fail+'%) dove pesa di più'+(m.worst?(' · '+m.worst.label):''),fn:function(){openQuiz();setTimeout(function(){qStartOptimal(12);},250);},p:0.3});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}
try{
var _rcK=renderCoach;
renderCoach=function(){
_rcK();
try{
if(!consolidabile())return;
var why=document.querySelector('.coach-why');if(!why||why.querySelector('.cons'))return;
var s=document.createElement('span');s.className='cons';
s.textContent=' · 💎 Fase consolidamento: gli errori non bastano più, ora contano le domande deboli.';
why.appendChild(s);
}catch(e){}
};
}catch(e){}
})();
(function(){
'use strict';
var SIZE=30;
function seenRound(){try{return lg('mixRound',{})||{};}catch(e){return {};}}
function saveRound(r){try{ls('mixRound',r);}catch(e){}}
window.qStartMix=function(){
try{
buildQuiz();
var round=seenRound();
var pool=QUIZ_ALL.filter(function(it){return !round[it.id];});
var reset=false;
if(pool.length<SIZE){round={};pool=QUIZ_ALL.slice();reset=true;saveRound(round);}
var perCat=Math.floor(SIZE/QARG.length),deck=[];
QARG.forEach(function(c){
var sub=qShuffle(pool.filter(function(it){return it.cat===c.id;}));
deck=deck.concat(sub.slice(0,perCat));
});
if(deck.length<SIZE){
var ids={};deck.forEach(function(it){ids[it.id]=1;});
deck=deck.concat(qShuffle(pool.filter(function(it){return !ids[it.id];})).slice(0,SIZE-deck.length));
}
deck.forEach(function(it){round[it.id]=1;});
saveRound(round);
var fatte=Object.keys(round).length,tot=QUIZ_ALL.length;
var n=Math.ceil(fatte/SIZE),tn=Math.ceil(tot/SIZE);
startQuiz(qShuffle(deck),{mode:'study',title:'Scheda mista · '+n+' di '+tn,mix:true});
if(reset)toast2('🔄 Giro completato: si riparte da capo');
}catch(e){}
};
try{
var _rdM=renderDash;
renderDash=function(){
_rdM();
try{
var anchor=document.getElementById('optTile')||document.getElementById('smartTile')
||document.querySelector('#qDash [onclick="qStartNew()"]');
if(!anchor)return;
if(!document.getElementById('mixTile')){
var round=seenRound(),fatte=Object.keys(round).length,tot=QUIZ_ALL.length;
var rest=Math.max(0,tot-fatte);
var b=document.createElement('button');
b.id='mixTile';b.className='qtile';
b.onclick=function(){qStartMix();};
var _now=Date.now(),_due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=_now;}).length;
var _sub=_due>100?('⚠️ Hai '+_due+' errori in scadenza: ogni scheda ne aggiunge')
:('A caso da tutti gli argomenti'+(fatte?(' · '+rest+' non ancora uscite nel giro'):''));
b.innerHTML='<div class="qtile-ic" style="background:rgba(36,71,214,.12)">🎲</div>'
+'<div class="qtile-tx"><strong>Scheda mista · 30 domande</strong><small>'+_sub+'</small></div>'
+'<div class="qtile-ar">›</div>';
anchor.parentNode.insertBefore(b,anchor);
}
var eb=document.querySelector('#qDash [onclick="qStartCat(\'errata\')"] .qtile-tx small');
if(eb){
var now=Date.now(),due=Object.keys(qtStats.err||{}).filter(function(id){return srDue(id)<=now;}).length;
if(due>0)eb.textContent=due+' in scadenza · schede da 30, in catena';
}
}catch(e){}
};
}catch(e){}
try{
var _qfM=qFinish;
qFinish=function(t){
_qfM(t);
try{
if(qCurView!=='result')return;
var old=document.getElementById('nextMix');if(old)old.remove();
if(!(lastQuiz&&lastQuiz.opts&&lastQuiz.opts.mix))return;
var round=seenRound(),rest=Math.max(0,QUIZ_ALL.length-Object.keys(round).length);
var box=document.querySelector('#qResult .qres-actions');if(!box)return;
var b=document.createElement('button');
b.id='nextMix';b.className='btn bp';
b.textContent=rest>0?('🎲 Prossima scheda ('+rest+' rimaste)'):'🔄 Nuovo giro da capo';
b.onclick=function(){qStartMix();};
box.insertBefore(b,box.firstChild);
}catch(e){}
};
}catch(e){}
try{
var _qscM=qStartCat;
qStartCat=function(cid){
if(cid!=='errata'){_qscM(cid);return;}
buildQuiz();
var now=Date.now();
var all=QUIZ_ALL.filter(function(it){return qtStats.err[it.id]&&srDue(it.id)<=now;});
if(all.length<5){_qscM(cid);return;}
all.sort(function(a,b){
var ea=qtStats.err[a.id],eb2=qtStats.err[b.id];
var ba=(ea&&ea.box)||0,bb=(eb2&&eb2.box)||0;
if(ba!==bb)return bb-ba;
return srDue(a.id)-srDue(b.id);
});
var tot=all.length,deck=all.slice(0,SIZE);
var quasi=deck.filter(function(it){var e=qtStats.err[it.id];return e&&e.box>=2;}).length;
var title=tot>SIZE?('Scheda errori · '+SIZE+' di '+tot):'Ripasso errori';
showErrCover(deck,title+(quasi?(' · '+quasi+' a un passo dall\u2019uscita'):''),function(){
startQuiz(deck,{mode:'study',title:title,scheda:true});
});
};
}catch(e){}
})();
(function(){
'use strict';
try{
if(!('serviceWorker' in navigator))return;
var reloading=false;
function reloadOnce(tag){
if(reloading)return;reloading=true;
try{toast2('⬆️ Nuova versione: aggiorno…');}catch(e){}
setTimeout(function(){try{location.reload();}catch(e){}},700);
}
navigator.serviceWorker.addEventListener('controllerchange',function(){reloadOnce('ctrl');});
navigator.serviceWorker.addEventListener('message',function(ev){
try{if(ev.data&&ev.data.t==='sw-updated'&&sessionStorage.getItem('swv')!==ev.data.v){
sessionStorage.setItem('swv',ev.data.v);reloadOnce('msg');}}catch(e){}
});
function checkUpdate(){try{navigator.serviceWorker.getRegistration().then(function(r){if(r)r.update();});}catch(e){}}
setTimeout(checkUpdate,2500);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')checkUpdate();});
try{var _sc=document.querySelector('script[src*="addon.js"]');
window.NCC_VER='addon '+((_sc&&_sc.src.match(/v=(\d+)/))?('v'+_sc.src.match(/v=(\d+)/)[1]):'?');}catch(e){window.NCC_VER='addon ?';}
try{console.log('%c'+window.NCC_VER,'background:#2447D6;color:#fff;padding:2px 8px;border-radius:4px');}catch(e){}
}catch(e){}
})();
(function(){
'use strict';
setTimeout(function(){
try{
var t=document.createElement('div');t.className='st-seg';t.style.position='absolute';t.style.visibility='hidden';
document.body.appendChild(t);
var ok=getComputedStyle(t).display==='flex';
t.remove();
if(ok)return;                       /* addon.css aggiornato: niente da fare */
var css=document.createElement('style');css.id='addonFallback';
css.textContent=
'#stateCard{max-width:460px;margin:14px auto 0}'
+'.st-seg{display:flex;gap:4px;padding:4px;background:rgba(127,127,127,.12);border-radius:16px;margin-bottom:8px}'
+'.st-tab{flex:1;padding:9px 6px;border:none;border-radius:12px;background:transparent;font-size:12.5px;font-weight:750;cursor:pointer;color:inherit;opacity:.6}'
+'.st-tab.on{background:#fff;opacity:1;box-shadow:0 1px 3px rgba(0,0,0,.12)}'
+'.st-pane{display:none}.st-pane.on{display:block}'
+'#modelCard,#projCard,#topoCard,#spiralCard{max-width:460px;margin:8px auto 0;padding:14px 16px;border:1.5px solid rgba(127,127,127,.25);border-radius:22px;background:rgba(127,127,127,.05)}'
+'.mc-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;padding-bottom:8px;border-bottom:1px solid rgba(127,127,127,.2)}'
+'.mc-hd small,.pj-hd,.sp-hd{display:block;font-size:9.5px;font-weight:750;letter-spacing:.06em;opacity:.6}'
+'.mc-hd b{font-size:30px;font-weight:850;line-height:1.1}.mc-hd b span{font-size:14px;opacity:.6}'
+'.mc-risk{text-align:right}'
+'.mc-sub{font-size:10.5px;opacity:.6;margin:8px 0 6px;line-height:1.35}'
+'.mc-row{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12.5px;font-weight:650}'
+'.mc-row span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
+'.mc-row b{min-width:34px;text-align:right;font-size:12px}'
+'.mc-bar{width:74px;height:7px;border-radius:4px;background:rgba(127,127,127,.2);overflow:hidden;flex-shrink:0}'
+'.mc-bar i{display:block;height:100%;border-radius:4px;background:#2447D6}'
+'.mc-bar.ok i{background:#0E9F6E}.mc-bar.mid i{background:#D97706}.mc-bar.no i{background:#E5484D}'
+'.mc-tip,.tp-nere{margin-top:9px;padding-top:9px;border-top:1px solid rgba(127,127,127,.2);font-size:11.5px;line-height:1.4}'
+'.pj-main{font-size:15px;font-weight:650;margin-top:5px;line-height:1.35}.pj-sub{font-size:11.5px;opacity:.6;margin-top:5px;line-height:1.4}'
+'.sp-row{display:flex;justify-content:space-between;gap:10px;padding:9px 2px;border-bottom:1px solid rgba(127,127,127,.15);font-size:14px;font-weight:600;cursor:pointer}'
+'.rv{opacity:1!important}';
document.head.appendChild(css);
try{console.warn('addon.css non aggiornato: stili di riserva attivi');}catch(e){}
/* avviso rimosso: il controllo ora riprova prima di concludere */
}catch(e){}
},2000);
})();

/* ═══════════════════════════════════════════════════
   ICONE UNIFORMI — tutte le voci del coach a tratto, nessuna emoji mista
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
try{
if(typeof ICO==='undefined')return;
var A={
'🎯':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
'🩹':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><circle cx="9.4" cy="14.6" r="1.1" fill="currentColor"/><circle cx="14.6" cy="9.4" r="1.1" fill="currentColor"/></svg>',
'💎':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3 6 9l6 12M15 3l3 6-6 12"/></svg>',
'🌅':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 4v3M4.6 10.6l2 2M19.4 10.6l-2 2M2 18h20M5 22h14"/></svg>',
'🌄':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19l6-8 4 5 3-3.5L21 19z"/><circle cx="8" cy="6.5" r="2.5"/><path d="M2 19h20"/></svg>',
'🧭':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13.7 13.7 8.5 15.5l1.8-5.2z"/></svg>',
'🖤':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.6-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.4 12 20 12 20z"/></svg>',
'🔬':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h4v7H9zM8 10h6"/><path d="M11 10v4M6 21h13"/><path d="M7 21a6 6 0 0 1 5-9"/></svg>',
'⏩':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5l8 7-8 7zM13 5l8 7-8 7z"/></svg>'
};
Object.keys(A).forEach(function(k){ICO[k]=A[k];});
if(typeof ICOC!=='undefined'){
ICOC['🎯']='var(--err)';ICOC['🩹']='var(--warn)';ICOC['💎']='var(--a)';
ICOC['🌅']='var(--warn)';ICOC['🌄']='var(--warn)';ICOC['🧭']='var(--a)';
ICOC['🖤']='var(--tx)';ICOC['🔬']='var(--pu)';ICOC['⏩']='var(--ok)';
}
/* ridisegna subito ciò che è già a schermo */
setTimeout(function(){try{swapIco('#coachCard .coach-ic');swapIco('#qDash .qtile-ic');}catch(e){}},300);
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   CONTROLLO CSS meno impaziente: il file può arrivare tardi su rete lenta
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
try{
var tries=0;
function cssOk(){
try{
var t=document.createElement('div');t.className='st-seg';
t.style.cssText='position:absolute;visibility:hidden';
document.body.appendChild(t);
var ok=getComputedStyle(t).display==='flex';
t.remove();return ok;
}catch(e){return true;}
}
function check(){
if(cssOk()){var f=document.getElementById('addonFallback');if(f)f.remove();return;}
if(++tries<4){setTimeout(check,2200);return;}   /* riprova fino a ~9 secondi */
/* solo ora si conclude che manca davvero: stili di riserva, in silenzio */
try{console.warn('addon.css non disponibile: stili di riserva attivi');}catch(e){}
}
setTimeout(check,2600);
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   TOPOGRAFIA FLUIDA — regia (nessuna modifica al posizionamento pin)
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* cascata delle vie all'apertura di un percorso */
try{
var _srF=selectRoute;
selectRoute=function(r){
_srF(r);
if(RM)return;
try{
var sl=document.getElementById('sList');if(!sl)return;
sl.classList.remove('rows-in');void sl.offsetWidth;
sl.classList.add('rows-in');
setTimeout(function(){try{sl.classList.remove('rows-in');}catch(e){}},900);
}catch(e){}
};
}catch(e){}

/* pillola scorrevole sui segmenti Studio · Cieco · Quiz vie */
setTimeout(function(){
try{
var wrap=document.querySelector('.seg-wrap');if(!wrap||document.getElementById('segPill'))return;
var pill=document.createElement('div');pill.id='segPill';
wrap.insertBefore(pill,wrap.firstChild);
document.body.classList.add('seg-on');
function move(){
try{
var on=wrap.querySelector('.seg-btn.on');if(!on)return;
pill.style.left=on.offsetLeft+'px';pill.style.top=on.offsetTop+'px';
pill.style.width=on.offsetWidth+'px';pill.style.height=on.offsetHeight+'px';
pill.style.opacity='1';
}catch(e){}
}
move();setTimeout(move,500);setTimeout(move,1600);
var mo=new MutationObserver(move);
wrap.querySelectorAll('.seg-btn').forEach(function(b){mo.observe(b,{attributes:true,attributeFilter:['class']});});
window.addEventListener('resize',function(){setTimeout(move,120);});
window.addEventListener('orientationchange',function(){setTimeout(move,400);});
}catch(e){}
},900);

/* intestazione del pannello che si stacca allo scorrimento della lista */
setTimeout(function(){
try{
var sl=document.getElementById('sList'),pn=document.getElementById('panel');
if(!sl||!pn)return;
var on=false;
sl.addEventListener('scroll',function(){
var s=sl.scrollTop>6;
if(s!==on){on=s;pn.classList.toggle('scrolled',s);}
},{passive:true});
}catch(e){}
},1000);

/* la via attiva si porta al centro della lista, con scorrimento morbido */
try{
var _gs=goStep;
goStep=function(){
_gs();
try{
if(RM)return;
var sl=document.getElementById('sList');if(!sl)return;
var act=sl.querySelector('.sr.act');if(!act)return;
var top=act.offsetTop-sl.clientHeight/2+act.offsetHeight/2;
sl.scrollTo({top:Math.max(0,top),behavior:'smooth'});
}catch(e){}
};
}catch(e){}

/* passaggio di modalità: la lista fa un micro-fade invece di cambiare di scatto */
try{
var _sm3=setMode;
setMode=function(m){
try{
var sl=document.getElementById('sList');
if(sl&&!RM){sl.style.transition='opacity .16s';sl.style.opacity='0.35';
setTimeout(function(){sl.style.opacity='1';setTimeout(function(){sl.style.transition='';},200);},130);}
}catch(e){}
_sm3(m);
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   TOPOGRAFIA INTELLIGENTE — richiamo a memoria, zone, percorsi gemelli
   (il posizionamento dei pin resta manuale e intatto)
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var DUOMO={lat:45.4642,lon:9.1900};

/* ── A · RICHIAMO A MEMORIA (avanti e al contrario) ──
Riconoscere è facile, ricordare è difficile: qui la via non si vede finché
non l'hai pensata. E ogni "non la sapevo" finisce nelle statistiche vere del
percorso, quindi alimenta il modello e la spirale. */
var RC=null;
window.startRecall=function(rid,rev){
try{
var r=routes.find(function(x){return x.id===rid;});if(!r||!r.steps.length)return;
RC={r:r,rev:!!rev,i:0,ok:0,miss:[],start:Date.now()};
drawRecall();
}catch(e){}
};
function rcIdx(){return RC.rev?(RC.r.steps.length-1-RC.i):RC.i;}
function drawRecall(){
try{
var old=document.getElementById('recallOv');if(old)old.remove();
if(!RC)return;
var tot=RC.r.steps.length,i=rcIdx();
var prev=RC.i>0?RC.r.steps[RC.rev?(tot-RC.i):(RC.i-1)]:null;
var o=document.createElement('div');o.id='recallOv';
o.innerHTML='<div class="rc-card">'
+'<div class="rc-hd"><small>'+(RC.rev?'AL CONTRARIO · da arrivo a partenza':'RICHIAMO A MEMORIA')+'</small>'
+'<b>'+esc(RC.r.title)+'</b><span class="rc-cnt">'+(RC.i+1)+' / '+tot+'</span></div>'
+'<div class="rc-prev">'+(prev?('precedente: <b>'+esc(prev)+'</b>'):'<i>prima via del percorso</i>')+'</div>'
+'<div class="rc-q">Qual è la <b>'+(i+1)+'ª</b> via?</div>'
+'<div class="rc-ans" id="rcAns"></div>'
+'<div class="rc-row"><button class="rc-show" id="rcShow">👁 Mostra</button></div>'
+'</div>';
document.body.appendChild(o);
document.getElementById('rcShow').onclick=function(){
try{
var a=document.getElementById('rcAns');
a.innerHTML='<div class="rc-name">'+esc(RC.r.steps[i])+'</div>';
var row=o.querySelector('.rc-row');
row.innerHTML='<button class="rc-no">✗ Non la sapevo</button><button class="rc-yes">✓ La sapevo</button>';
row.querySelector('.rc-yes').onclick=function(){rcMark(true);};
row.querySelector('.rc-no').onclick=function(){rcMark(false);};
try{hap();}catch(e){}
}catch(e){}
};
}catch(e){}
}
function rcMark(ok){
try{
var i=rcIdx();
/* [FIX] l'archivio va creato SEMPRE: stava solo nel ramo "sbagliato",
   quindi su un percorso senza statistiche il tasto "La sapevo" andava
   in eccezione e l'esercizio si bloccava al primo tocco. */
var id=RC.r.id;
if(!qStats[id])qStats[id]={correct:0,total:0,wrong:{}};
if(!qStats[id].wrong)qStats[id].wrong={};
/* [FIX] nella riprova gli indici sono quelli del percorso ridotto:
   senza traduzione venivano penalizzate le vie sbagliate. */
var reale=RC.map?RC.map[i]:i;
if(ok)RC.ok++;
else{
RC.miss.push(reale);
qStats[id].wrong[reale]=(qStats[id].wrong[reale]||0)+1;
}
qStats[id].total=(qStats[id].total||0)+1;
if(ok)qStats[id].correct=(qStats[id].correct||0)+1;
RC.i++;
if(RC.i>=RC.r.steps.length){rcFinish();return;}
drawRecall();
}catch(e){}
}
function rcFinish(){
try{
var tot=RC.r.steps.length,ok=RC.ok,miss=RC.miss.slice();
try{save();autoSave();}catch(e){}
/* la spirale reagisce solo al giro completo: una riprova parziale
   non deve né promuovere né retrocedere l'intero percorso */
try{
if(!RC.retry){
if(miss.length===0){if(typeof rsrMark==='function')rsrMark(RC.r.id);}
else if(miss.length>=3){rSR[RC.r.id]={box:1,due:Date.now()+2*86400000};ls('rSR',rSR);markDirty('prefs');}
}
}catch(e){}
var pct=Math.round(ok/tot*100);
var names=miss.slice(0,8).map(function(i){return '<span class="rc-miss">'+(i+1)+'. '+esc(RC.r.steps[i])+'</span>';}).join('');
var o=document.getElementById('recallOv');if(o)o.remove();
var d=document.createElement('div');d.id='recallOv';
d.innerHTML='<div class="rc-card rc-end">'
+'<div class="rc-score '+(pct>=80?'ok':(pct>=50?'mid':'no'))+'">'+pct+'<span>%</span></div>'
+'<b>'+ok+' su '+tot+' a memoria</b>'
+(miss.length?('<div class="rc-list">'+names+'</div><small>Le mancate tornano nel ripasso'+(miss.length>=3?' tra 2 giorni':'')+'</small>'):'<small>Percorso solido: prossimo ripasso più lontano ✨</small>')
+'<div class="rc-row"><button class="rc-close">Chiudi</button>'+(miss.length?'<button class="rc-again">Riprova le mancate</button>':'')+'</div></div>';
document.body.appendChild(d);
d.querySelector('.rc-close').onclick=function(){d.remove();RC=null;try{renderMgr();}catch(e){}};
var ag=d.querySelector('.rc-again');
if(ag)ag.onclick=function(){
var r=RC.r;d.remove();
RC={r:{id:r.id,title:r.title+' \u00b7 le mancate',steps:miss.map(function(i){return r.steps[i];})},
rev:false,i:0,ok:0,miss:[],start:Date.now(),map:miss.slice(),retry:true};
drawRecall();
};
}catch(e){}
}

/* ── B · ZONE: i percorsi si raggruppano da soli ── */
window.routeZone=function(r){
try{
var la=0,lo=0,n=0;
r.steps.forEach(function(_,i){var c=coords[r.id+'_'+i];if(c){la+=c.lat;lo+=c.lon;n++;}});
if(!n)return null;
la/=n;lo/=n;
var dLa=la-DUOMO.lat,dLo=lo-DUOMO.lon;
if(Math.abs(dLa)<0.012&&Math.abs(dLo)<0.016)return 'Centro';
if(Math.abs(dLa)*1.4>=Math.abs(dLo))return dLa>0?'Nord':'Sud';
return dLo>0?'Est':'Ovest';
}catch(e){return null;}
};
var zoneSel=null;
try{
var _rm2=renderMgr;
renderMgr=function(){
_rm2();
try{
var cnt=document.getElementById('mgrCnt');if(!cnt)return;
var box=document.getElementById('zoneBar');
if(!box){
box=document.createElement('div');box.id='zoneBar';
cnt.after(box);
box.addEventListener('click',function(e){
var b=e.target.closest('.zn');if(!b)return;
zoneSel=(zoneSel===b.dataset.z)?null:b.dataset.z;
renderMgr();
});
}
var counts={};
routes.forEach(function(r){var z=routeZone(r);if(z)counts[z]=(counts[z]||0)+1;});
var order=['Centro','Nord','Sud','Est','Ovest'];
box.innerHTML=order.filter(function(z){return counts[z];}).map(function(z){
return '<button class="zn'+(zoneSel===z?' on':'')+'" data-z="'+z+'">'+z+' <b>'+counts[z]+'</b></button>';
}).join('');
/* applica il filtro alle righe già disegnate */
if(zoneSel){
var shown=0;
document.querySelectorAll('#mgrList .ri').forEach(function(row){
var id=(row.getAttribute('data-id'))||'';
var r=routes.find(function(x){return row.textContent.indexOf(x.title)===0||x.id===id;});
var keep=r?routeZone(r)===zoneSel:true;
row.style.display=keep?'':'none';
if(keep)shown++;
});
cnt.textContent=shown+' in zona '+zoneSel;
}
}catch(e){}
};
}catch(e){}

/* ── C · PERCORSI GEMELLI: il tratto in comune si impara una volta sola ── */
window.twinRoutes=function(){
try{
var out=[];
for(var i=0;i<routes.length;i++)for(var j=i+1;j<routes.length;j++){
var a=routes[i],b=routes[j];
var setB={};b.steps.forEach(function(s){setB[s]=1;});
var common=a.steps.filter(function(s){return setB[s];});
if(common.length>=5)out.push({a:a,b:b,n:common.length,vie:common});
}
return out.sort(function(x,y){return y.n-x.n;}).slice(0,6);
}catch(e){return [];}
};
try{
var _ctG=coachTasks;
coachTasks=function(){
var t=_ctG();
try{
var tw=twinRoutes();
if(!tw.length)return t;
var top=tw[0];
t.push({ic:'🧬',tx:'Percorsi gemelli: '+top.n+' vie in comune',sub:top.a.title+' e '+top.b.title+' — impara il tratto comune una volta sola',fn:function(){
alert('🧬 PERCORSI GEMELLI\n\n'+top.a.title+'\n'+top.b.title+'\n\nVie in comune ('+top.n+'):\n'+top.vie.slice(0,12).map(function(v,i){return (i+1)+'. '+v;}).join('\n')+(top.vie.length>12?'\n…':'')+'\n\nImpararle vale per entrambi i percorsi.');
},p:2.6});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}

/* ── i due esercizi entrano nel menu lungo del percorso e nel manager ── */
try{
var _rm3=renderMgr;
renderMgr=function(){
_rm3();
try{
document.querySelectorAll('#mgrList .rab.reb').forEach(function(btn){
var row=btn.closest('.ri');if(!row||row.querySelector('.rcb2'))return;
var m=(btn.getAttribute('onclick')||'').match(/'([^']+)'/);
if(!m)return;
var id=m[1];
var b=document.createElement('button');
b.className='rab rcb2';b.textContent='🧠';b.title='Richiamo a memoria';
b.onclick=function(ev){
ev.stopPropagation();
var d=document.createElement('div');d.id='recallOv';
d.innerHTML='<div class="rc-card rc-pick"><b>Richiamo a memoria</b>'
+'<small>La via non si vede finché non l\u2019hai pensata</small>'
+'<div class="rc-row"><button class="rc-fw">▶ Avanti</button><button class="rc-bw">◀ Al contrario</button></div></div>';
document.body.appendChild(d);
d.querySelector('.rc-fw').onclick=function(){d.remove();startRecall(id,false);};
d.querySelector('.rc-bw').onclick=function(){d.remove();startRecall(id,true);};
d.addEventListener('click',function(e){if(e.target===d)d.remove();});
};
btn.parentNode.insertBefore(b,btn);
});
}catch(e){}
};
}catch(e){}

})();

/* ═══════════════════════════════════════════════════
   PIN CHE SCORRE ALLA VIA SUCCESSIVA
   Solo setLatLng animato (mai transform CSS: quello lo usa Leaflet
   per posizionare il marker, ed è ciò che lo faceva sparire).
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var tok=0;
try{
if(typeof slideMarker!=='function')return;
slideMarker=function(m,to){
try{
if(!m)return;
if(typeof map==='undefined'||!map){m.setLatLng(to);return;}
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){m.setLatLng(to);return;}
var from=m.getLatLng();
var dist=0;
try{
var p1=map.latLngToContainerPoint(from),p2=map.latLngToContainerPoint(L.latLng(to[0],to[1]));
dist=Math.hypot(p2.x-p1.x,p2.y-p1.y);
}catch(e){m.setLatLng(to);return;}
if(dist<2){m.setLatLng(to);return;}
/* scia luminosa tra la via lasciata e quella nuova */
try{if(typeof trailFx==='function')trailFx([from.lat,from.lng],to);}catch(e){}
/* piccolo salto dell'icona: si anima l'elemento INTERNO, mai il marker */
try{
var el=m.getElement&&m.getElement();
var pe=el&&el.querySelector('.pin-emoji');
if(pe){pe.style.animation='none';void pe.offsetWidth;pe.style.animation='pinHop .5s cubic-bezier(.34,1.4,.5,1)';}
}catch(e){}
/* durata proporzionale alla distanza: vicino = svelto, lontano = si segue con l'occhio */
var dur=Math.max(340,Math.min(900,260+dist*1.1));
var t0=performance.now(),k0=++tok;
var a=from.lat,b=from.lng,c=to[0],d=to[1];
function ease(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}   /* parte piano, arriva piano */
function step(now){
if(k0!==tok)return;
var k=Math.min(1,(now-t0)/dur),e=ease(k);
try{m.setLatLng([a+(c-a)*e,b+(d-b)*e]);}catch(err){return;}
if(k<1)requestAnimationFrame(step);
}
requestAnimationFrame(step);
}catch(e){try{m.setLatLng(to);}catch(e2){}}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   SINCRONIZZAZIONE PROTETTA
   [BUG 1 - PERDITA DATI] Una scheda rimasta aperta con dati vecchi
   spingeva comunque al cloud e SOVRASCRIVEVA il lavoro fatto altrove:
   gli errori "tornavano su" da soli. Ora prima di scrivere si controlla
   il timestamp del cloud: se un altro dispositivo ha scritto dopo la
   nostra ultima sincronizzazione, si scarica invece di sovrascrivere.
   [BUG 2] Niente sincronizzazione durante una sessione in corso:
   sostituiva le statistiche mentre stavi rispondendo.
   [BUG 3] Si scarica solo se il cloud è davvero più recente: niente
   avviso "dati locali più recenti" a ogni ritorno sull'app.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
try{
function cloudTs(cb){
try{
if(typeof fbOk==='undefined'||!fbOk||!fbRef){cb(null);return;}
fbRef.child('ts').once('value',function(s){cb(s.val()||0);},function(){cb(null);});
}catch(e){cb(null);}
}
function inSessione(){
try{return typeof qCurView!=='undefined'&&qCurView==='run'&&typeof Q!=='undefined'&&Q&&Q.items&&Q.items.length;}catch(e){return false;}
}

/* quante risposte ha dato questo archivio: numero che può solo crescere */
function risposte(qt){
try{
var n=0,c=(qt||{}).cat||{};
Object.keys(c).forEach(function(k){n+=c[k].seen||0;});
return n;
}catch(e){return 0;}
}
function scrivi(){
try{
var ts=Date.now();
var dev=(typeof nccDev==='function')?nccDev():'Dispositivo';
var ans=risposte(qtStats);
/* [BUG CRITICO] mancava "prefs" e set() sostituisce l'intero nodo:
   ogni salvataggio CANCELLAVA dal cloud striscia, data esame, traguardo,
   spirale dei percorsi, percorsi cancellati, note e riferimenti.
   flushNow le riscriveva con update(), il set successivo le ricancellava:
   una corsa infinita. Ecco perché i dispositivi divergevano. */
var pr={};try{pr=getPrefs()||{};}catch(e){}
fbRef.set({routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,
studyProg:studyProg,qExamHist:qExamHist,prefs:pr,ts:ts,dev:dev,ans:ans})
.then(function(){
ls('syncTs',ts);ls('lastDev',dev);ls('lastAns',ans);
try{showInd();}catch(e){}
try{if(typeof nccSnapshot==='function')nccSnapshot();}catch(e){}
})
.catch(function(){});
}catch(e){}
}
/* ── scrittura protetta: mai sovrascrivere il lavoro di chi è più avanti ── */
function push(){
try{
if(typeof fbOk==='undefined'||!fbOk||!fbRef)return;
cloudTs(function(ct){
try{
if(ct===null)return;
var visto=lg('syncTs',0);
if(visto&&ct>visto+1500){
/* un altro dispositivo ha scritto dopo di noi. Chi è davvero avanti?
   Le risposte date possono solo aumentare: chi ne ha di più ha lavorato di più. */
fbRef.once('value',function(sn){
try{
var d=sn.val()||{};
if(risposte(d.qtStats)>risposte(qtStats)){
try{toast2('\u2601\ufe0f Un altro dispositivo \u00e8 pi\u00f9 avanti: aggiorno');}catch(e){}
ls('localTs',0);
try{syncFromCloud();}catch(e){}
ls('syncTs',ct);
}else{
scrivi();   /* siamo noi i più avanti: la nostra copia vince */
}
}catch(e){}
},function(){});
return;
}
scrivi();
}catch(e){}
});
}catch(e){}
}
var asT=null;
window.autoSave=function(){try{clearTimeout(asT);asT=setTimeout(push,4000);}catch(e){}};

/* ── registra il punto di sincronizzazione a ogni scarico ── */
try{
var _sfc=window.syncFromCloud;
window.syncFromCloud=function(){
try{_sfc.apply(this,arguments);}catch(e){}
cloudTs(function(ct){if(ct!==null)ls('syncTs',ct);});
try{
fbRef&&fbRef.once('value',function(sn){
try{
var d=sn.val()||{};
if(d.dev)ls('lastDev',d.dev);
if(d.ans!==undefined)ls('lastAns',d.ans);
}catch(e){}
},function(){});
}catch(e){}
};
}catch(e){}
setTimeout(function(){cloudTs(function(ct){if(ct!==null&&!lg('syncTs',0))ls('syncTs',ct);});},2600);

/* ── al ritorno sull'app: scarica solo se serve davvero ── */
var last=Date.now();
function pull(){
try{
if(Date.now()-last<20000)return;
if(inSessione())return;
last=Date.now();
cloudTs(function(ct){
try{
if(ct===null)return;
var visto=lg('syncTs',0);
if(!visto||ct<=visto+1500)return;   /* niente di nuovo: non disturbare */
syncFromCloud();
setTimeout(function(){
try{
var h=document.getElementById('homeScreen');
if(h&&h.style.display!=='none'){
renderPlan();renderCoach();renderReadiness();renderExamLight();
}
updateTabBadge();
}catch(e){}
},1500);
}catch(e){}
});
}catch(e){}
}
document.addEventListener('visibilitychange',function(){
if(document.visibilityState==='visible')pull();
});
window.addEventListener('focus',pull);
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   2 · VIBRAZIONE SU iPHONE
   navigator.vibrate NON esiste su Safari iOS: la vibrazione non ha
   mai funzionato sul telefono. Su iOS 17.4+ si ottiene il feedback
   aptico di sistema attivando un interruttore nascosto.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
try{
var iOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||
 (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if(!iOS)return;
if(navigator.vibrate)return;              /* se il browser vibra già, non serve */

var sw=document.createElement('input');
sw.type='checkbox';sw.id='hapSwitch';
sw.setAttribute('switch','');
var lb=document.createElement('label');
lb.setAttribute('for','hapSwitch');lb.id='hapLabel';
var box=document.createElement('div');
/* [BUG 4] dentro il viewport ma invisibile: fuori schermo iOS non produce
   il feedback aptico. [BUG 5] il click sintetico non deve raggiungere
   i listener della pagina. */
box.style.cssText='position:fixed;right:0;bottom:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;z-index:-1;';
box.addEventListener('click',function(e){e.stopPropagation();},true);
box.appendChild(sw);box.appendChild(lb);
document.body.appendChild(box);

function buzz(n){
try{
if(typeof vibOn!=='undefined'&&!vibOn)return;
lb.click();
if(n>1)setTimeout(function(){lb.click();},70);
if(n>2)setTimeout(function(){lb.click();},140);
}catch(e){}
}
/* si aggancia a hap() del core senza toccarne il resto (suoni compresi) */
var _hap=window.hap;
window.hap=function(t){
try{if(typeof _hap==='function')_hap(t);}catch(e){}
buzz(t==='e'?3:(t==='m'?2:1));
};
window.NCC_HAPTIC='switch-ios';
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   SALVAGENTE DATI — storico copie + chi ha salvato per ultimo
   Il core tiene UNA sola copia settimanale: se i dati si rovinano
   e il backup parte dopo, non c'è più nulla da recuperare.
   Qui: 6 copie a rotazione (una al giorno) e un pannello per sceglierle.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var SLOTS=6;

function devName(){
try{
var n=lg('devName','');
if(n)return n;
var u=navigator.userAgent||'';
n=/iPhone/.test(u)?'iPhone':/iPad/.test(u)?'iPad':/Android/.test(u)?'Android':
  /Macintosh/.test(u)?'Mac':/Windows/.test(u)?'PC':'Dispositivo';
ls('devName',n);
return n;
}catch(e){return 'Dispositivo';}
}
window.nccDev=devName;

function risposte(qt){
try{var n=0,c=(qt||{}).cat||{};Object.keys(c).forEach(function(k){n+=c[k].seen||0;});return n;}catch(e){return 0;}
}
function nErr(qt){try{return Object.keys((qt||{}).err||{}).length;}catch(e){return 0;}}

/* ── una copia al giorno, a rotazione su 6 posti ── */
window.nccSnapshot=function(force){
try{
if(typeof fbOk==='undefined'||!fbOk||typeof firebase==='undefined')return;
var oggi=new Date().toDateString();
if(!force&&lg('snapDay','')===oggi)return;
ls('snapDay',oggi);
var slot=(lg('snapSlot',0)+1)%SLOTS;
ls('snapSlot',slot);
firebase.database().ref('prontuario_snaps/s'+slot).set({
routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,
studyProg:studyProg,qExamHist:qExamHist,
ts:Date.now(),dev:devName(),ans:risposte(qtStats),errs:nErr(qtStats)
}).then(function(){}).catch(function(){});
}catch(e){}
};

/* ── pannello: scegli quale copia ripristinare ── */
window.openRestore=function(){
try{
if(document.getElementById('bkOv'))return;
if(typeof fbOk==='undefined'||!fbOk||typeof firebase==='undefined'){toast2('\u26a0\ufe0f Cloud non disponibile');return;}
var o=document.createElement('div');o.id='bkOv';
o.innerHTML='<div class="bk-card"><div class="bk-hd"><b>\ud83d\udee0 Copie di sicurezza</b>'
+'<small>Scegli da quale giorno ripartire. I dati attuali verranno sostituiti.</small></div>'
+'<div class="bk-list" id="bkList">Cerco le copie\u2026</div>'
+'<button class="bk-close">Chiudi</button></div>';
o.addEventListener('click',function(e){if(e.target===o)o.remove();});
document.body.appendChild(o);
o.querySelector('.bk-close').onclick=function(){o.remove();};

firebase.database().ref('prontuario_snaps').once('value',function(sn){
try{
var d=sn.val()||{},list=[];
Object.keys(d).forEach(function(k){if(d[k]&&d[k].ts)list.push({k:k,v:d[k]});});
/* aggiunge anche la copia settimanale del core, se c'è */
firebase.database().ref('prontuario_backup').once('value',function(sb){
try{
var b=sb.val();
if(b&&b.ts)list.push({k:'weekly',v:b});
list.sort(function(a,b2){return b2.v.ts-a.v.ts;});
var el=document.getElementById('bkList');if(!el)return;
if(!list.length){el.textContent='Nessuna copia disponibile. La prima verr\u00e0 creata al prossimo salvataggio.';return;}
el.innerHTML=list.map(function(x,i){
var dt=new Date(x.v.ts);
var quando=dt.toLocaleDateString('it-IT',{day:'numeric',month:'short'})+' \u00b7 '+
 dt.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
var ans=x.v.ans!==undefined?x.v.ans:risposte(x.v.qtStats);
var er=x.v.errs!==undefined?x.v.errs:nErr(x.v.qtStats);
return '<button class="bk-row" data-k="'+x.k+'">'
+'<div class="bk-when">'+quando+(i===0?' <em>pi\u00f9 recente</em>':'')+'</div>'
+'<div class="bk-meta">'+ans+' risposte \u00b7 '+er+' errori'+(x.v.dev?(' \u00b7 '+esc(x.v.dev)):'')+'</div></button>';
}).join('');
el.addEventListener('click',function(ev){
var b2=ev.target.closest('.bk-row');if(!b2)return;
var item=list.find(function(z){return z.k===b2.dataset.k;});if(!item)return;
var dt=new Date(item.v.ts).toLocaleString('it-IT');
if(!confirm('Ripristinare la copia del '+dt+'?\n\n'+
 (item.v.ans||0)+' risposte \u00b7 '+(item.v.errs||0)+' errori\n\n'+
 'I dati attuali di questo dispositivo verranno sostituiti.'))return;
applicaCopia(item.v);
});
}catch(e){}
},function(){});
}catch(e){}
},function(){var el=document.getElementById('bkList');if(el)el.textContent='Impossibile leggere le copie.';});
}catch(e){}
};

function applicaCopia(d){
try{
if(d.routes)routes=vR(d.routes);
if(d.coords)coords=vC(d.coords);
if(d.qStats&&typeof d.qStats==='object')qStats=d.qStats;
if(d.done&&typeof d.done==='object')done=d.done;
if(d.qtStats&&typeof d.qtStats==='object'){qtStats=d.qtStats;
if(!qtStats.cat)qtStats.cat={};if(!qtStats.err)qtStats.err={};if(!qtStats.seenIds)qtStats.seenIds={};
ls('qtStats',qtStats);}
if(d.studyProg&&typeof d.studyProg==='object'){studyProg=d.studyProg;ls('studyProg',studyProg);}
if(d.qExamHist&&Array.isArray(d.qExamHist)){qExamHist=d.qExamHist;ls('qExamHist',qExamHist);}
save();
ls('localTs',Date.now());
ls('syncTs',0);              /* la copia ripristinata è la nuova verità: potrà essere scritta */
try{qtSave();}catch(e){}
toast2('\ud83d\udee0 Copia ripristinata');
setTimeout(function(){location.reload();},900);
}catch(e){toast2('\u26a0\ufe0f Ripristino non riuscito');}
}

/* ── riga in home: chi ha salvato per ultimo ── */
function renderSaveInfo(){
try{
var home=document.getElementById('homeScreen');if(!home)return;
var old=document.getElementById('saveInfo');
if(old&&old.parentNode!==home)old.remove();
var el=document.getElementById('saveInfo');
if(!el){
el=document.createElement('div');el.id='saveInfo';
el.onclick=function(){openRestore();};
var wk=document.getElementById('weekChart');
if(wk&&wk.parentNode)wk.after(el);else home.appendChild(el);
}
/* [FIX] layoutHome sposta il grafico DOPO la prima creazione e lasciava
   la riga orfana a metà pagina: la si riaggancia a ogni disegno */
try{
var wk2=document.getElementById('weekChart');
if(wk2&&wk2.parentNode&&wk2.nextElementSibling!==el)wk2.after(el);
}catch(e){}
var ts=lg('syncTs',0),dev=lg('lastDev',devName()),ans=lg('lastAns',0);
if(!ts){el.innerHTML='\u2601\ufe0f Nessun salvataggio ancora \u00b7 <b>copie di sicurezza</b>';return;}
var d=new Date(ts),oggi=new Date().toDateString()===d.toDateString();
var q=(oggi?'oggi ':d.toLocaleDateString('it-IT',{day:'numeric',month:'short'})+' ')
 +d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
el.innerHTML='\u2601\ufe0f Ultimo salvataggio: <b>'+esc(dev)+'</b> \u00b7 '+q
 +(ans?(' \u00b7 '+ans+' risposte'):'')+' \u00b7 <b>copie</b>';
}catch(e){}
}
try{
var _rw=renderWeekly;
renderWeekly=function(){_rw.apply(this,arguments);setTimeout(renderSaveInfo,40);};
}catch(e){}
/* [FIX] corsa: renderSaveInfo posizionava la riga a 40ms, ma layoutHome
   riordina la home a 80ms e spostava il grafico lasciandola indietro.
   Si riaggancia come ultimo passo del riordino. */
try{
var _lh=window.layoutHome;
if(typeof _lh==='function'){
window.layoutHome=function(){
var r=_lh.apply(this,arguments);
try{renderSaveInfo();}catch(e){}
return r;
};
}
}catch(e){}
setTimeout(renderSaveInfo,2000);

/* la copia giornaliera parte dopo il primo salvataggio riuscito */
setTimeout(function(){try{nccSnapshot();}catch(e){}},9000);

})();

/* ═══════════════════════════════════════════════════
   FASE CORRETTA SENZA TRAGUARDO
   Se non è impostata la data-traguardo, targetInfo() torna nullo e il
   coach ripiegava su "Fase mantenimento" — proprio all'inizio, quando
   non hai ancora studiato nulla. Ora la fase si legge dalla copertura.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
try{
var _rcF=renderCoach;
renderCoach=function(){
_rcF.apply(this,arguments);
try{
var why=document.querySelector('.coach-why');if(!why)return;
var t=why.firstChild;
if(!t||t.nodeType!==3)return;                       /* solo il testo iniziale */
if(t.nodeValue.indexOf('Fase mantenimento')!==0)return;
var ti=targetInfo();
if(ti)return;                                        /* con traguardo il core decide bene */
buildQuiz();
var viste=Object.keys(qtStats.seenIds||{}).length;
var tot=(QUIZ_ALL&&QUIZ_ALL.length)||919;
if(viste>=tot*0.98)return;                           /* copertura completa: mantenimento è giusto */
t.nodeValue=viste<20
? 'Si comincia: rispondi senza fretta, gli errori diventano ripassi programmati.'
: ('Fase copertura: '+Math.round(viste/tot*100)+'% delle domande viste. Prima gli errori in scadenza, poi le nuove.');
}catch(e){}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   1 · CONTATORE ONESTO — il 108% contava id di vecchie versioni del set
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
try{
var _rsc=renderSeenCount;
renderSeenCount=function(){
try{
var el=document.getElementById('qSeen');if(!el){_rsc();return;}
buildQuiz();
var valide=0;
Object.keys(qtStats.seenIds||{}).forEach(function(id){if(QUIZ_ALL[id|0])valide++;});
var tot=QUIZ_ALL.length||919;
valide=Math.min(valide,tot);
var pct=tot?Math.round(valide/tot*100):0;
el.innerHTML='\ud83d\udcd6 <b>'+valide+'</b> / '+tot+' domande viste \u00b7 '+pct+'%';
}catch(e){_rsc();}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   2 · RICHIAMO A MEMORIA SUI QUIZ
   La domanda senza risposte: devi PRODURLA, non riconoscerla.
   Sulla topografia questo metodo ha battuto il Cieco 2 a 1.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var RQ=null;

window.qStartRecall=function(n){
try{
buildQuiz();
var now=Date.now();
var pool=QUIZ_ALL.filter(function(it){return qtStats.err[it.id]&&srDue(it.id)<=now;});
if(pool.length<5)pool=QUIZ_ALL.filter(function(it){return qtStats.seenIds[it.id];});
if(pool.length<5){toast2('Servono pi\u00f9 domande viste');return;}
RQ={items:qShuffle(pool).slice(0,n||10),i:0,ok:0,miss:[]};
openQuiz();
setTimeout(drawRQ,150);
}catch(e){}
};
function drawRQ(){
try{
var old=document.getElementById('rqOv');if(old)old.remove();
if(!RQ)return;
var it=RQ.items[RQ.i];
var o=document.createElement('div');o.id='rqOv';
o.innerHTML='<div class="rq-card">'
+'<div class="rq-hd"><small>RICHIAMO A MEMORIA</small><span class="rq-cnt">'+(RQ.i+1)+' / '+RQ.items.length+'</span>'
+'<button class="rq-x" title="Chiudi">\u2715</button></div>'
+'<div class="rq-q">'+esc(it.q)+'</div>'
+'<div class="rq-hint">Pensa la risposta, poi verifica</div>'
+'<div class="rq-ans" id="rqAns"></div>'
+'<div class="rq-row"><button class="rq-show" id="rqShow">\ud83d\udc41 Mostra la risposta</button></div></div>';
document.body.appendChild(o);
/* [BUG B] mancava l'uscita: si restava bloccati per tutte le domande */
o.querySelector('.rq-x').onclick=function(){o.remove();RQ=null;try{renderDash();updateTabBadge();}catch(e){}};
document.getElementById('rqShow').onclick=function(){
try{
var a=document.getElementById('rqAns');
a.innerHTML='<div class="rq-name">'+esc(it.choices[it.correct])+'</div>';
var row=o.querySelector('.rq-row');
row.innerHTML='<button class="rq-no">\u2717 Non la sapevo</button><button class="rq-yes">\u2713 La sapevo</button>';
row.querySelector('.rq-yes').onclick=function(){rqMark(true);};
row.querySelector('.rq-no').onclick=function(){rqMark(false);};
try{hap();}catch(e){}
}catch(e){}
};
}catch(e){}
}
function rqMark(ok){
try{
var it=RQ.items[RQ.i];
/* stesso peso di una risposta vera: alimenta pila, statistiche e curva */
if(!qtStats.cat[it.cat])qtStats.cat[it.cat]={seen:0,ok:0};
qtStats.seenIds[it.id]=1;
qtStats.cat[it.cat].seen=(qtStats.cat[it.cat].seen||0)+1;
if(ok){qtStats.cat[it.cat].ok=(qtStats.cat[it.cat].ok||0)+1;RQ.ok++;srMark(it.id,true);}
else{RQ.miss.push(it);srMark(it.id,false);}
try{qtSave();bumpDaily&&bumpDaily(1);}catch(e){}
RQ.i++;
if(RQ.i>=RQ.items.length){rqFinish();return;}
drawRQ();
}catch(e){}
}
function rqFinish(){
try{
var tot=RQ.items.length,ok=RQ.ok,miss=RQ.miss.slice();
var pct=Math.round(ok/tot*100);
var o=document.getElementById('rqOv');if(o)o.remove();
var d=document.createElement('div');d.id='rqOv';
d.innerHTML='<div class="rq-card rq-end">'
+'<div class="rq-score '+(pct>=80?'ok':(pct>=50?'mid':'no'))+'">'+pct+'<span>%</span></div>'
+'<b>'+ok+' su '+tot+' a memoria</b>'
+(miss.length?'<small>Le mancate sono tornate nella pila degli errori</small>':'<small>Ottimo: queste le sai davvero \u2728</small>')
+'<div class="rq-row"><button class="rq-close">Chiudi</button>'
+(miss.length?'<button class="rq-again">Rivedi le mancate</button>':'')+'</div></div>';
document.body.appendChild(d);
d.querySelector('.rq-close').onclick=function(){d.remove();RQ=null;try{renderDash();}catch(e){}};
var ag=d.querySelector('.rq-again');
if(ag)ag.onclick=function(){d.remove();startQuiz(miss,{mode:'study',title:'Le mancate'});RQ=null;};
try{updateTabBadge();}catch(e){}
}catch(e){}
}
/* riquadro nel quiz */
try{
var _rdR=renderDash;
renderDash=function(){
_rdR.apply(this,arguments);
try{
if(document.getElementById('rqTile'))return;
var anchor=document.getElementById('mixTile')||document.getElementById('optTile');
if(!anchor)return;
if(Object.keys(qtStats.seenIds||{}).length<20)return;
var b=document.createElement('button');
b.id='rqTile';b.className='qtile';
b.onclick=function(){qStartRecall(10);};
b.innerHTML='<div class="qtile-ic" style="background:rgba(139,92,246,.14)">\ud83e\udde0</div>'
+'<div class="qtile-tx"><strong>Richiamo a memoria \u00b7 10</strong><small>Senza risposte: le pensi tu. Fissa il doppio del riconoscere</small></div>'
+'<div class="qtile-ar">\u203a</div>';
anchor.parentNode.insertBefore(b,anchor);
}catch(e){}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   3 · FRENO ANTI-FRETTA
   Sotto i 3 secondi non stai leggendo, stai riconoscendo la forma
   della domanda: all'esame, con le parole cambiate, crolli.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var t0=0,avvisi=0;
try{
/* [BUG C] gli avvisi non si azzeravano mai: in una app che resta aperta
   per giorni il freno funzionava solo le prime tre volte in assoluto. */
var _sqF=startQuiz;
startQuiz=function(){avvisi=0;return _sqF.apply(this,arguments);};
var _qrrF=qRenderRun;
qRenderRun=function(){_qrrF.apply(this,arguments);t0=Date.now();};
document.addEventListener('visibilitychange',function(){
if(document.visibilityState==='visible')t0=Date.now();
});
}catch(e){}
try{
var _qpF=qPick;
qPick=function(i){
try{
var gia=(typeof Q!=='undefined'&&Q)?Q.ans[Q.idx]:-1;
var esame=(typeof Q!=='undefined'&&Q&&Q.mode==='exam');
if(!esame&&gia===-1&&t0&&(Date.now()-t0)<3000&&lg('antiFretta',true)!==false){
if(avvisi<3){
avvisi++;
toast2('\ud83d\udc0c Rallenta: rileggi la domanda prima di rispondere',2600);
try{hap('m');}catch(e){}
t0=Date.now();
return;                       /* il primo tocco non conta: rileggi */
}
}
}catch(e){}
_qpF(i);
};
}catch(e){}
/* interruttore nelle impostazioni */
window.togAntiFretta=function(){
var v=lg('antiFretta',true)!==false;
ls('antiFretta',!v);
toast2(!v?'\ud83d\udc0c Freno anti-fretta attivo':'Freno anti-fretta disattivato');
};
})();

/* ═══════════════════════════════════════════════════
   4 · LA REGOLA CON PAROLE TUE
   Scriverla è studiare, rileggerla è ripassare. È la cura per le
   domande croniche: quelle non si risolvono con altri ripassi.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
/* [BUG A] getPrefs() non includeva le note: restavano solo su questo
   dispositivo e sparivano da backup e sincronizzazione. */
try{
var _gp=getPrefs;
getPrefs=function(){
var p=_gp.apply(this,arguments)||{};
try{p.qNotes=lg('qNotes',{});}catch(e){}
return p;
};
}catch(e){}
/* e all'arrivo dal cloud le note si fondono, senza perdere le locali */
try{
var _sfN=window.syncFromCloud;
window.syncFromCloud=function(){
var r=_sfN.apply(this,arguments);
try{
if(typeof fbRef!=='undefined'&&fbRef)fbRef.once('value',function(sn){
try{
var d=(sn.val()||{}).prefs;
if(!d||!d.qNotes)return;
var loc=lg('qNotes',{})||{},cam=false;
Object.keys(d.qNotes).forEach(function(k){if(!loc[k]){loc[k]=d.qNotes[k];cam=true;}});
if(cam)ls('qNotes',loc);
}catch(e){}
},function(){});
}catch(e){}
return r;
};
}catch(e){}
function note(){try{return lg('qNotes',{})||{};}catch(e){return {};}}
function setNote(id,v){
try{
var n=note();
if(v)n[id]=v.slice(0,240);else delete n[id];
ls('qNotes',n);markDirty&&markDirty('prefs');
}catch(e){}
}
window.qNoteFor=function(id){return note()[id]||'';};

function inject(){
try{
if(typeof Q==='undefined'||!Q||!Q.items)return;
var it=Q.items[Q.idx];if(!it)return;
var host=document.getElementById('qRunAns');if(!host)return;
var old=document.getElementById('qNoteBox');if(old)old.remove();
var risposto=Q.ans[Q.idx]!==-1;
var testo=qNoteFor(it.id);
/* la nota si vede PRIMA della domanda se esiste, altrimenti si scrive dopo */
if(!risposto&&!testo)return;
var box=document.createElement('div');box.id='qNoteBox';
if(!risposto&&testo){
box.className='qnote shown';
box.innerHTML='<span class="qn-ic">\u270e</span><span>'+esc(testo)+'</span>';
host.parentNode.insertBefore(box,host);
return;
}
box.className='qnote edit';
box.innerHTML='<button class="qn-add">'+(testo?'\u270e '+esc(testo):'\u270e Scrivi la regola con parole tue')+'</button>';
box.querySelector('.qn-add').onclick=function(){
var v=prompt('La regola, con parole tue:\n(riapparir\u00e0 ogni volta che incontri questa domanda)',testo||'');
if(v===null)return;
setNote(it.id,v.trim());
toast2(v.trim()?'\u270e Regola salvata':'Nota rimossa');
inject();
};
host.parentNode.appendChild(box);
}catch(e){}
}
try{
var _qrrN=qRenderRun;
qRenderRun=function(){_qrrN.apply(this,arguments);setTimeout(inject,30);};
var _qpN=qPick;
qPick=function(i){_qpN.apply(this,arguments);setTimeout(inject,60);};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   1 · TEST A FREDDO SETTIMANALE
   Tutte le altre misure sono "calde": rispondi a domande appena
   ripassate. Qui 20 domande a caso da TUTTO il set, senza selezione
   intelligente e senza preavviso. È l'unico numero che non mente.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var N=20;

window.qStartCold=function(){
try{
buildQuiz();
var viste=QUIZ_ALL.filter(function(it){return qtStats.seenIds[it.id];});
if(viste.length<40){toast2('Servono almeno 40 domande viste');return;}
var deck=qShuffle(viste).slice(0,N);
ls('coldRun',Date.now());
openQuiz();
setTimeout(function(){
startQuiz(deck,{mode:'study',title:'Test a freddo \u00b7 '+N+' domande',cold:true});
},200);
}catch(e){}
};

/* registra l'esito: è la misura onesta del livello */
try{
var _qfC2=qFinish;
qFinish=function(t){
var era=null;
try{if(lastQuiz&&lastQuiz.opts&&lastQuiz.opts.cold)era=true;
else if(typeof Q!=='undefined'&&Q&&Q.items)era=null;}catch(e){}
_qfC2(t);
try{
if(!lastQuiz||!lastQuiz.opts||!lastQuiz.opts.cold)return;
var ok=0,tot=0;
lastQuiz.items.forEach(function(it,i){
var a=(Q&&Q.ans)?Q.ans[i]:-1;
if(a<0)return;tot++;if(a===it.correct)ok++;
});
if(!tot)return;
var pct=Math.round(ok/tot*100);
var st=lg('coldHist',[]);
if(!Array.isArray(st))st=[];
st.push({d:Date.now(),pct:pct,ok:ok,tot:tot});
if(st.length>26)st=st.slice(-26);
ls('coldHist',st);ls('coldDone',Date.now());markDirty('prefs');
/* confronto con la stima del modello: chi dei due dice la verità? */
setTimeout(function(){
try{
var m=studentModel();
var atteso=m?Math.round((m.expScore/16)*100):null;
var box=document.querySelector('#qResult .qres-actions');if(!box)return;
pulisciVerdetti();
var el=document.createElement('div');el.id='coldVerdict';
var diff=(atteso!==null)?(pct-atteso):null;
el.innerHTML='<b>\u2744\ufe0f Livello a freddo: '+pct+'%</b>'
+(atteso!==null?('<span>Il modello stimava '+atteso+'%'
+(Math.abs(diff)<=5?' \u2014 stima affidabile \u2713'
:(diff>0?' \u2014 sai pi\u00f9 di quanto il modello creda (+'+diff+')'
:' \u2014 il modello \u00e8 ottimista di '+(-diff)+' punti'))+'</span>'):'');
box.parentNode.insertBefore(el,box);
}catch(e){}
},420);
}catch(e){}
};
}catch(e){}

/* il coach lo propone una volta a settimana */
try{
var _ctC=coachTasks;
coachTasks=function(){
var t=_ctC();
try{
buildQuiz();
if(Object.keys(qtStats.seenIds||{}).length<40)return t;
var last=lg('coldDone',0);
if(last&&Date.now()-last<6.5*86400000)return t;
t.push({ic:'🔬',tx:'Test a freddo ('+N+' domande)',
sub:'A caso da tutto il set, senza aiuti: il tuo livello vero',
fn:function(){qStartCold();},p:1.45});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   2 · CHECK-UP POST-PROMOZIONE
   Una domanda che esce dalla pila non viene più testata: le promozioni
   sono vere o stai perdendo pezzi dietro le spalle? Un campione
   mensile lo dice — e taratura sui risultati veri.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var N=10;

/* si annota quando una domanda esce davvero dalla pila */
try{
var _smP=srMark;
srMark=function(id,correct){
var prima=qtStats.err[id]!==undefined;
_smP(id,correct);
try{
if(!prima||qtStats.err[id]!==undefined)return;
var pr=lg('promosse',{});
pr[id]=Date.now();
var k=Object.keys(pr);
if(k.length>600){k.sort(function(a,b){return pr[a]-pr[b];});
k.slice(0,k.length-600).forEach(function(x){delete pr[x];});}
ls('promosse',pr);
}catch(e){}
};
}catch(e){}

window.qStartCheckup=function(){
try{
buildQuiz();
var pr=lg('promosse',{}),now=Date.now();
var pool=Object.keys(pr).filter(function(id){
return QUIZ_ALL[id|0]&&(now-pr[id])>20*86400000&&!qtStats.err[id];
}).map(function(id){return QUIZ_ALL[id|0];});
if(pool.length<5){toast2('Poche domande promosse da abbastanza tempo');return;}
var deck=qShuffle(pool).slice(0,N);
openQuiz();
setTimeout(function(){
startQuiz(deck,{mode:'study',title:'Check-up promozioni',checkup:true});
},200);
}catch(e){}
};

try{
var _qfP=qFinish;
qFinish=function(t){
_qfP(t);
try{
if(!lastQuiz||!lastQuiz.opts||!lastQuiz.opts.checkup)return;
var ok=0,tot=0;
lastQuiz.items.forEach(function(it,i){
var a=(Q&&Q.ans)?Q.ans[i]:-1;
if(a<0)return;tot++;if(a===it.correct)ok++;
});
if(!tot)return;
var pct=Math.round(ok/tot*100);
ls('checkupDone',Date.now());
var h=lg('checkupHist',[]);if(!Array.isArray(h))h=[];
h.push({d:Date.now(),pct:pct,ok:ok,tot:tot});
if(h.length>12)h=h.slice(-12);
ls('checkupHist',h);markDirty('prefs');
setTimeout(function(){
try{
var box=document.querySelector('#qResult .qres-actions');if(!box)return;
pulisciVerdetti();
var el=document.createElement('div');el.id='chkVerdict';
el.innerHTML='<b>\ud83e\ude7a Tenuta delle promozioni: '+pct+'%</b><span>'
+(pct>=85?'Le promozioni reggono: la spirale funziona.'
:(pct>=65?'Qualche pezzo si perde: i ripassi lunghi vanno accorciati.'
:'Le promozioni non tengono: stai archiviando troppo presto.'))+'</span>';
box.parentNode.insertBefore(el,box);
}catch(e){}
},420);
}catch(e){}
};
}catch(e){}

try{
var _ctP=coachTasks;
coachTasks=function(){
var t=_ctP();
try{
var pr=lg('promosse',{}),now=Date.now();
var pronti=Object.keys(pr).filter(function(id){return (now-pr[id])>20*86400000;}).length;
if(pronti<10)return t;
var last=lg('checkupDone',0);
if(last&&now-last<28*86400000)return t;
t.push({ic:'🩺',tx:'Check-up promozioni ('+N+' domande)',
sub:pronti+' domande uscite dalla pila da oltre 20 giorni: reggono ancora?',
fn:function(){qStartCheckup();},p:1.9});
t.sort(function(a,b){return a.p-b.p;});
return t.slice(0,4);
}catch(e){}
return t;
};
}catch(e){}
})();


/* ═══════════════════════════════════════════════════
   [BUG] i verdetti restavano appesi: chiudendo un test a freddo e
   aprendo un check-up si vedevano entrambi, con numeri di sessioni
   diverse. Ora si azzerano a ogni fine sessione.
   ═══════════════════════════════════════════════════ */
window.pulisciVerdetti=function(){
try{['coldVerdict','chkVerdict'].forEach(function(id){
var e=document.getElementById(id);if(e)e.remove();});}catch(e){}
};
(function(){
'use strict';
try{
var _qfV=qFinish;
qFinish=function(t){
try{pulisciVerdetti();}catch(e){}
return _qfV.apply(this,arguments);
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   3 · SOTTO-ARGOMENTI VISIBILI
   Il modello li calcola già, ma vedevi solo "Geografia 75%".
   Sapere QUALE pezzo ti affonda cambia cosa studi domani.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
window.qStartSub=function(sub,label){
try{
buildQuiz();
var pool=QUIZ_ALL.filter(function(x){return x.sub===sub;});
if(pool.length<5){toast2('Poche domande su questo tema');return;}
pool.sort(function(a,b){
var ea=qtStats.err[a.id],eb=qtStats.err[b.id];
var pa=ea?(0.34+0.15*(ea.box||0)):(qtStats.seenIds[a.id]?0.9:0.55);
var pb=eb?(0.34+0.15*(eb.box||0)):(qtStats.seenIds[b.id]?0.9:0.55);
return pa-pb;
});
openQuiz();
setTimeout(function(){
startQuiz(qShuffle(pool.slice(0,14)),{mode:'study',title:label||'Tema mirato'});
},220);
}catch(e){}
};
function renderSubs(){
try{
var pane=document.querySelector('#stateCard .st-pane[data-p="1"]');
var anchor=pane||document.getElementById('modelCard');
if(!anchor)return;
var old=document.getElementById('subCard');if(old)old.remove();
var m=studentModel();if(!m||!m.subs||m.subs.length<2)return;
if(Object.keys(qtStats.seenIds||{}).length<40)return;
var righe=m.subs.slice(0,7).map(function(s){
var cls=s.m>=80?'ok':(s.m>=60?'mid':'no');
return '<div class="mc-row sub-row" data-s="'+s.sub+'" data-l="'+esc(s.label)+'">'
+'<span>'+esc(s.label)+'</span>'
+'<div class="mc-bar '+cls+'"><i style="width:'+s.m+'%"></i></div><b>'+s.m+'%</b></div>';
}).join('');
var el=document.createElement('div');el.id='subCard';
el.innerHTML='<div class="mc-hd"><div><small>PADRONANZA PER TEMA</small>'
+'<b>'+m.subs[0].m+'<span>% il pi\u00f9 debole</span></b></div></div>'
+'<div class="mc-sub">Dal pi\u00f9 debole al pi\u00f9 solido \u00b7 tocca una riga per 14 domande mirate</div>'+righe;
el.addEventListener('click',function(e){
var r=e.target.closest('.sub-row');if(!r)return;
qStartSub(r.dataset.s,r.dataset.l);
});
if(pane)pane.appendChild(el);else anchor.after(el);
}catch(e){}
}
try{
var _relS=renderExamLight;
renderExamLight=function(){_relS.apply(this,arguments);setTimeout(renderSubs,120);};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   4 · VISTA "FERMATE METRO"
   Il percorso come linea verticale con le vie come tappe: si memorizza
   la sequenza senza la distrazione della mappa.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
window.openLinea=function(rid){
try{
var r=routes.find(function(x){return x.id===(rid||(cur&&cur.id));});
if(!r||!r.steps.length){toast2('Apri prima un percorso');return;}
var old=document.getElementById('lineaOv');if(old)old.remove();
var wm=((qStats[r.id]||{}).wrong)||{};
var tappe=r.steps.map(function(s,i){
var err=wm[i]||0;
var cls=err>=3?'no':(err>0?'mid':'ok');
return '<div class="ln-stop '+cls+'"><div class="ln-dot">'+(i+1)+'</div>'
+'<div class="ln-name">'+esc(s)+(err?('<em>'+err+' err</em>'):'')+'</div></div>';
}).join('');
var o=document.createElement('div');o.id='lineaOv';
o.innerHTML='<div class="ln-card"><div class="ln-hd"><b>'+esc(r.title)+'</b>'
+'<small>'+r.steps.length+' vie \u00b7 come le fermate di una linea</small>'
+'<button class="ln-x">\u2715</button></div>'
+'<div class="ln-body"><div class="ln-line"></div>'+tappe+'</div></div>';
o.addEventListener('click',function(e){if(e.target===o)o.remove();});
document.body.appendChild(o);
o.querySelector('.ln-x').onclick=function(){o.remove();};
}catch(e){}
};
/* bottone nella barra del percorso */
try{
var _srL=selectRoute;
selectRoute=function(r){
_srL.apply(this,arguments);
try{
setTimeout(function(){
var head=document.querySelector('.phead');if(!head||document.getElementById('lineaBtn'))return;
var b=document.createElement('button');
b.id='lineaBtn';b.className='ln-btn';b.textContent='\ud83d\ude87 Linea';
b.title='Vedi il percorso come una linea di metro';
b.onclick=function(){openLinea();};
head.appendChild(b);
},120);
}catch(e){}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   5 · QUIZ "QUALE VIENE PRIMA?"
   Due vie dello stesso percorso: quale si incontra per prima.
   Allena l'ordine, che è ciò che conta all'esame.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var OP=null;
window.qStartOrdine=function(rid){
try{
var pool=routes.filter(function(r){return r.steps&&r.steps.length>=6&&(!rid||r.id===rid);});
if(!pool.length){toast2('Servono percorsi con almeno 6 vie');return;}
var dom=[];
for(var k=0;k<10;k++){
var r=pool[Math.floor(Math.random()*pool.length)];
var a=Math.floor(Math.random()*r.steps.length),bIdx;
do{bIdx=Math.floor(Math.random()*r.steps.length);}while(bIdx===a);
dom.push({r:r,a:Math.min(a,bIdx),b:Math.max(a,bIdx)});
}
OP={items:dom,i:0,ok:0};
drawOrd();
}catch(e){}
};
function drawOrd(){
try{
var old=document.getElementById('ordOv');if(old)old.remove();
if(!OP)return;
if(OP.i>=OP.items.length){finOrd();return;}
var it=OP.items[OP.i];
var primo=it.r.steps[it.a],secondo=it.r.steps[it.b];
var inverti=Math.random()<0.5;
var s1=inverti?secondo:primo,s2=inverti?primo:secondo;
var o=document.createElement('div');o.id='ordOv';
o.innerHTML='<div class="or-card"><div class="or-hd"><small>QUALE VIENE PRIMA?</small>'
+'<b>'+esc(it.r.title)+'</b><span class="or-cnt">'+(OP.i+1)+' / '+OP.items.length+'</span></div>'
+'<div class="or-row"><button class="or-opt" data-v="'+(inverti?'b':'a')+'">'+esc(s1)+'</button>'
+'<button class="or-opt" data-v="'+(inverti?'a':'b')+'">'+esc(s2)+'</button></div>'
+'<button class="or-x">Chiudi</button></div>';
document.body.appendChild(o);
o.querySelector('.or-x').onclick=function(){o.remove();OP=null;};
o.querySelectorAll('.or-opt').forEach(function(btn){
btn.onclick=function(){
var giusto=btn.dataset.v==='a';
if(giusto)OP.ok++;
btn.classList.add(giusto?'good':'bad');
if(!giusto)o.querySelector('.or-opt[data-v="a"]').classList.add('good');
try{hap(giusto?'':'m');}catch(e){}
/* un errore d'ordine è un errore sulla via successiva */
if(!giusto){try{
if(!qStats[it.r.id])qStats[it.r.id]={correct:0,total:0,wrong:{}};
if(!qStats[it.r.id].wrong)qStats[it.r.id].wrong={};
qStats[it.r.id].wrong[it.b]=(qStats[it.r.id].wrong[it.b]||0)+1;
save();
}catch(e){}}
setTimeout(function(){OP.i++;drawOrd();},750);
};
});
}catch(e){}
}
function finOrd(){
try{
var pct=Math.round(OP.ok/OP.items.length*100);
var o=document.createElement('div');o.id='ordOv';
o.innerHTML='<div class="or-card or-end"><div class="rc-score '+(pct>=80?'ok':(pct>=50?'mid':'no'))+'">'
+pct+'<span>%</span></div><b>'+OP.ok+' su '+OP.items.length+' nell\u2019ordine giusto</b>'
+'<button class="or-x">Chiudi</button></div>';
document.body.appendChild(o);
o.querySelector('.or-x').onclick=function(){o.remove();OP=null;try{renderMgr();}catch(e){}};
OP=null;
}catch(e){}
}
})();

/* ═══════════════════════════════════════════════════
   6 · PUNTI DI RIFERIMENTO SULLA VIA
   "Qui c'è l'Esselunga" — la memoria spaziale si aggancia alle cose,
   non ai nomi. Riappare ogni volta che incontri quella via.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
function rif(){try{return lg('rifVie',{});}catch(e){return {};}}
window.rifPer=function(nome){return rif()[nome]||'';};
window.setRif=function(nome,v){
try{
var r=rif();
if(v)r[nome]=v.slice(0,90);else delete r[nome];
var k=Object.keys(r);
if(k.length>500)delete r[k[0]];
ls('rifVie',r);markDirty('prefs');
}catch(e){}
};
/* le note dei riferimenti viaggiano con le preferenze */
try{
var _gpR=getPrefs;
getPrefs=function(){
var p=_gpR.apply(this,arguments)||{};
try{p.rifVie=lg('rifVie',{});}catch(e){}
return p;
};
}catch(e){}
/* riga toccabile sotto il nome della via attiva */
function inject(){
try{
if(typeof cur==='undefined'||!cur)return;
var host=document.querySelector('.phead');if(!host)return;
var nome=cur.steps[step];if(!nome)return;
var old=document.getElementById('rifBox');if(old)old.remove();
var t=rifPer(nome);
var d=document.createElement('div');d.id='rifBox';
d.className=t?'rif has':'rif';
d.innerHTML=t?('\ud83d\udccd '+esc(t)):'\ud83d\udccd Aggiungi un punto di riferimento';
d.onclick=function(){
var v=prompt('Cosa c\u2019\u00e8 su '+nome+'?\n(un negozio, una piazza, un incrocio\u2026)',t||'');
if(v===null)return;
setRif(nome,v.trim());
toast2(v.trim()?'\ud83d\udccd Riferimento salvato':'Riferimento rimosso');
inject();
};
host.appendChild(d);
}catch(e){}
}
try{
var _gsR=goStep;goStep=function(){_gsR.apply(this,arguments);setTimeout(inject,60);};
var _smR=setMode;setMode=function(m){_smR.apply(this,arguments);setTimeout(inject,60);};
var _srR=selectRoute;selectRoute=function(r){_srR.apply(this,arguments);setTimeout(inject,140);};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   AVVII per i nuovi esercizi di topografia
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
try{
var _rmO=renderMgr;
renderMgr=function(){
_rmO.apply(this,arguments);
try{
var cnt=document.getElementById('mgrCnt');if(!cnt)return;
if(document.getElementById('topoEx'))return;
var d=document.createElement('div');d.id='topoEx';
d.innerHTML='<button class="tx-b" data-a="ord">\u2b06\ufe0f Quale viene prima?</button>';
d.addEventListener('click',function(e){
var b=e.target.closest('.tx-b');if(!b)return;
if(b.dataset.a==='ord')qStartOrdine();
});
cnt.after(d);
}catch(e){}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   MAPPA — fornitori senza chiave API
   [BUG 1] CARTO ora richiede una chiave: stampava "API KEY REQUIRED".
   [BUG 2] tiles.wmflabs.org (mappa senza nomi) non esiste più da anni:
           in Cieco la mappa restava vuota.
   [BUG 3] Esri copre fino allo zoom 16: oltre mostrava "Map data not
           yet available". Ora i riquadri vengono ingranditi invece
           di essere richiesti al server.
   Studio → OpenStreetMap (con i nomi delle vie)
   Cieco  → Esri Light Gray (senza nomi, è il suo scopo)
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var CON='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var SENZA='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var SAT='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

function applica(senzaNomi){
try{
var L2=window._tileLayer;
if(!L2||typeof L2.setUrl!=='function')return false;
/* [FIX] il satellite si gestisce qui: delegarlo al core lo legava alla
   variabile "map", e bastava un momento in cui non era pronta perché
   la vista satellite non partisse. */
var sat=false;try{sat=!!lg('mapSat',false);}catch(e){}
/* lo zoom nativo massimo evita di chiedere riquadri che non esistono */
L2.options.maxNativeZoom=(sat||!senzaNomi)?19:16;
L2.options.attribution=(sat||senzaNomi)?'&copy; Esri':'&copy; OpenStreetMap';
L2.setUrl(sat?SAT:(senzaNomi?SENZA:CON));
try{L2.redraw&&L2.redraw();}catch(e){}
return true;
}catch(e){return false;}
}
window.nccMappa=applica;

/* [BUG 4] il core chiama setTileMode da CINQUE punti (cambio modalità,
   tema scuro, avvio, satellite, ridisegni) e ognuno rimetteva CARTO.
   Agganciarsi al solo setMode ne copriva uno: si sostituisce la
   funzione stessa, così tutti i punti passano di qui.
   [BUG 5] anche "Quiz vie" vuole la mappa senza nomi: il core lo sa
   già e passa il valore giusto — prima lo perdevo. */
try{
var _stmPrev=setTileMode;
setTileMode=function(noLabels){applica(!!noLabels);};
}catch(e){}

/* il primo livello lo crea initMap con l'indirizzo CARTO scritto dentro:
   va sostituito appena esiste */
function modoCorrente(){
try{return (typeof mode!=='undefined')&&(mode==='c'||mode==='q');}catch(e){return false;}
}
var n=0,t=setInterval(function(){
if(applica(modoCorrente())||++n>40)clearInterval(t);
},600);
try{
var _gt=goTopografia;
goTopografia=function(){_gt.apply(this,arguments);
setTimeout(function(){try{setTileMode(modoCorrente());}catch(e){applica(modoCorrente());}},400);};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   MODALITÀ SCHERMO INTERO
   La mappa occupa tutto lo schermo, l'elenco delle vie resta di lato
   e si scorre avanti/indietro. Non tocca nulla del posizionamento
   dei marker: cambia solo la disposizione.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var ATTIVO=false;

function ridisegna(){
try{
if(typeof map!=='undefined'&&map&&map.invalidateSize){
map.invalidateSize();
setTimeout(function(){try{map.invalidateSize();}catch(e){}},260);
}
}catch(e){}
}

/* schermo intero VERO del browser: fa sparire anche barra indirizzi e schede */
function chiediPieno(){
try{
var el=document.documentElement;
var f=el.requestFullscreen||el.webkitRequestFullscreen||el.msRequestFullscreen;
if(!f)return false;
var p=f.call(el,{navigationUI:'hide'});
if(p&&p.catch)p.catch(function(){});
return true;
}catch(e){return false;}
}
function lasciaPieno(){
try{
if(!document.fullscreenElement&&!document.webkitFullscreenElement)return;
var x=document.exitFullscreen||document.webkitExitFullscreen||document.msExitFullscreen;
if(x){var p=x.call(document);if(p&&p.catch)p.catch(function(){});}
}catch(e){}
}
function inPieno(){
try{return !!(document.fullscreenElement||document.webkitFullscreenElement);}catch(e){return false;}
}

window.topoFull=function(on){
try{
ATTIVO=(on===undefined)?!ATTIVO:!!on;
document.body.classList.toggle('topo-full',ATTIVO);
var b=document.getElementById('fullBtn');
if(b){b.textContent=ATTIVO?'\u2715':'\u26f6';b.title=ATTIVO?'Esci da schermo intero':'Schermo intero';}
if(ATTIVO){
var ok=chiediPieno();
/* iPhone non lo permette dal browser: l'app installata sulla schermata
   home non ha barre, quindi il suggerimento è quello */
if(!ok&&!window.matchMedia('(display-mode: standalone)').matches){
toast2('\u26f6 Per togliere anche le barre: installa l\u2019app sulla schermata Home',3200);
}else if(ok){
toast2('\u26f6 Modalit\u00e0 mappa \u00b7 tocca \u2715 per uscire',2000);
}
}else lasciaPieno();
ridisegna();
try{hap();}catch(e){}
}catch(e){}
};

/* se esci con Esc o con il gesto del browser, l'app si allinea */
['fullscreenchange','webkitfullscreenchange'].forEach(function(ev){
document.addEventListener(ev,function(){
try{
if(!inPieno()&&ATTIVO){
ATTIVO=false;
document.body.classList.remove('topo-full');
var b=document.getElementById('fullBtn');
if(b){b.textContent='\u26f6';b.title='Schermo intero';}
ridisegna();
}else if(inPieno()&&ATTIVO)setTimeout(ridisegna,320);
}catch(e){}
});
});

/* bottone nella barra dei segmenti */
function innesta(){
try{
if(document.getElementById('fullBtn'))return;
var host=document.querySelector('.seg-wrap');if(!host)return;
var b=document.createElement('button');
b.id='fullBtn';b.type='button';b.textContent='\u26f6';
b.title='Schermo intero';
b.onclick=function(ev){try{ev.stopPropagation();}catch(e){}topoFull();};
host.appendChild(b);
}catch(e){}
}
setTimeout(innesta,1200);
try{
var _gtF=goTopografia;
goTopografia=function(){_gtF.apply(this,arguments);setTimeout(innesta,200);};
}catch(e){}

/* uscendo dalla topografia lo schermo intero si spegne da solo */
try{
var _ghF=goHome;
goHome=function(){if(ATTIVO)topoFull(false);_ghF.apply(this,arguments);};
}catch(e){}
try{
var _oqF=openQuiz;openQuiz=function(){if(ATTIVO)topoFull(false);_oqF.apply(this,arguments);};
var _osF=openStudy;openStudy=function(){if(ATTIVO)topoFull(false);_osF.apply(this,arguments);};
}catch(e){}

/* il tasto Esc esce (utile da PC) */
document.addEventListener('keydown',function(e){
if(e.key==='Escape'&&ATTIVO)topoFull(false);
});

/* cambiando via la mappa si ridisegna correttamente */
try{
var _gsF=goStep;
goStep=function(){_gsF.apply(this,arguments);if(ATTIVO)ridisegna();};
}catch(e){}
/* rotazione dello schermo */
window.addEventListener('orientationchange',function(){if(ATTIVO)setTimeout(ridisegna,420);});
window.addEventListener('resize',function(){if(ATTIVO)ridisegna();});
})();

/* ═══════════════════════════════════════════════════
   TUTTE LE MAPPE, NON SOLO LA PRINCIPALE
   [BUG] l'app crea 5 mappe (principale, editor PC, editor telefono,
   metro, strade): la correzione precedente copriva solo la prima, le
   altre restavano con la filigrana "API KEY REQUIRED".
   Si intercetta la creazione di QUALSIASI livello mappa.

   [BUG] cambiando modalità la mappa "scattava": sostituire l'indirizzo
   svuota e ricarica tutti i riquadri. Ora i due stili convivono e si
   passa dall'uno all'altro in dissolvenza, senza ricaricare nulla.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var CON='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var SENZA='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var SAT='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

/* 1 · ogni livello creato con CARTO nasce già col fornitore giusto */
try{
if(typeof L!=='undefined'&&L.tileLayer){
var _tl=L.tileLayer;
L.tileLayer=function(url,opt){
try{
if(typeof url==='string'&&url.indexOf('cartocdn')>=0){
url=CON;
opt=opt||{};
opt.attribution='&copy; OpenStreetMap';
if(opt.maxNativeZoom===undefined)opt.maxNativeZoom=19;
if(opt.keepBuffer===undefined)opt.keepBuffer=4;
}
}catch(e){}
return _tl.call(this,url,opt);
};
for(var k in _tl)if(Object.prototype.hasOwnProperty.call(_tl,k))L.tileLayer[k]=_tl[k];
}
}catch(e){}

/* 2 · sulla mappa principale i due stili convivono: si dissolve, non si ricarica */
var LIV={con:null,senza:null,sat:null},pronto=false;
function creaLivelli(){
try{
if(pronto)return true;
if(typeof map==='undefined'||!map||typeof L==='undefined')return false;
function mk(u,mz){
var l=L.tileLayer(u,{maxNativeZoom:mz,maxZoom:20,keepBuffer:4,
attribution:(u===CON?'&copy; OpenStreetMap':'&copy; Esri'),opacity:0});
l.addTo(map);return l;
}
LIV.con=mk(CON,19);LIV.senza=mk(SENZA,16);
/* il vecchio livello del core viene rimosso: lo sostituiscono i due nuovi */
try{if(window._tileLayer&&map.hasLayer(window._tileLayer))map.removeLayer(window._tileLayer);}catch(e){}
pronto=true;return true;
}catch(e){return false;}
}
function mostra(quale){
try{
if(!creaLivelli())return false;
var sat=false;try{sat=!!lg('mapSat',false);}catch(e){}
if(sat&&!LIV.sat){
LIV.sat=L.tileLayer(SAT,{maxNativeZoom:19,maxZoom:20,keepBuffer:4,attribution:'&copy; Esri',opacity:0});
LIV.sat.addTo(map);
}
var attivo=sat?LIV.sat:(quale==='senza'?LIV.senza:LIV.con);
[LIV.con,LIV.senza,LIV.sat].forEach(function(l){
if(!l)return;
try{l.setOpacity(l===attivo?1:0);}catch(e){}
});
try{attivo.bringToFront();}catch(e){}
window._tileLayer=attivo;      /* il core continua a trovare il livello attivo */
return true;
}catch(e){return false;}
}
window.nccMappaFade=mostra;

/* si aggancia al punto unico da cui il core cambia stile */
try{
var _stm2=setTileMode;
setTileMode=function(noLabels){
if(!mostra(noLabels?'senza':'con'))
{try{_stm2(noLabels);}catch(e){}}
};
}catch(e){}
/* primo scambio appena la mappa esiste */
var n=0,t=setInterval(function(){
var m=false;
try{m=(typeof mode!=='undefined')&&(mode==='c'||mode==='q');}catch(e){}
if(mostra(m?'senza':'con')||++n>40)clearInterval(t);
},600);
})();

/* ═══════════════════════════════════════════════════
   SINCRONIZZAZIONE COMPLETA
   [BUG GRAVE 1] ogni salvataggio usa set(), che SOSTITUISCE l'intero
   nodo, ma non includeva le preferenze: ogni salvataggio CANCELLAVA
   dal cloud striscia, data esame e obiettivi. Ecco perché su un
   dispositivo la striscia era 11 e sull'altro 1.
   [BUG GRAVE 2] 41 chiavi non venivano MAI sincronizzate: la spirale
   dei percorsi, le note personali, le croniche, le promozioni, i
   riferimenti, lo storico dei test. Cambiando dispositivo si perdevano.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

/* tutto ciò che deve viaggiare fra i dispositivi */
var EXTRA=['rSR','qNotes','rifVie','chronSusp','promosse','errBal','rDoneLog',
'coldHist','coldDone','checkupHist','checkupDone','modelBias','modelN','mission',
'retScore','srMul','mixRound','tipHist','wkSnap','goalHit','lapDone','qRecall',
'antiFretta','sndOn','vibOn','dark','mapSat','lMode','berlina','tgFastDay','lastRet','wkRepTs'];

/* ── 1 · le preferenze includono TUTTO ── */
try{
var _gpX=getPrefs;
getPrefs=function(){
var p={};
try{p=_gpX.apply(this,arguments)||{};}catch(e){}
EXTRA.forEach(function(k){
try{var v=lg(k,undefined);if(v!==undefined&&v!==null)p[k]=v;}catch(e){}
});
return p;
};
}catch(e){}

/* ── 2 · applicare quello che arriva dal cloud ── */
window.nccApplicaPrefs=function(prefs,cloudPiuRecente){
try{
if(!prefs||typeof prefs!=='object')return 0;
var n=0;
EXTRA.forEach(function(k){
try{
var v=prefs[k];
if(v===undefined||v===null)return;
/* i dati di studio arrivano sempre; le impostazioni solo se il cloud è più recente */
var impostazione=(k==='dark'||k==='sndOn'||k==='vibOn'||k==='antiFretta'||k==='mapSat'||k==='lMode'||k==='berlina'||k==='qRecall');
if(impostazione&&!cloudPiuRecente)return;
ls(k,v);n++;
}catch(e){}
});
/* la spirale dei percorsi vive anche in memoria: va aggiornata lì */
try{if(prefs.rSR&&typeof prefs.rSR==='object'&&typeof rSR!=='undefined')rSR=prefs.rSR;}catch(e){}
return n;
}catch(e){return 0;}
};

/* ── 3 · la scrittura include le preferenze (era il buco principale) ── */
try{
var _cs=cloudSave;
cloudSave=function(){
try{
if(typeof fbOk==='undefined'||!fbOk||!fbRef){_cs();return;}
toast2('\ud83d\udcbe Salvataggio\u2026');
fbRef.set({routes:routes,coords:coords,qStats:qStats,done:done,qtStats:qtStats,
studyProg:studyProg,qExamHist:qExamHist,prefs:getPrefs(),ts:Date.now(),
dev:(typeof nccDev==='function'?nccDev():'')})
.then(function(){toast2('\u2705 Salvato su cloud');})
.catch(function(){toast2('\u26a0\ufe0f Errore cloud');});
}catch(e){_cs();}
};
}catch(e){}

/* ── 4 · al ritorno dal cloud si applicano anche le chiavi nuove ── */
try{
var _sfcX=window.syncFromCloud;
window.syncFromCloud=function(){
try{_sfcX.apply(this,arguments);}catch(e){}
try{
if(typeof fbOk==='undefined'||!fbOk||!fbRef)return;
fbRef.once('value',function(sn){
try{
var d=sn.val();if(!d)return;
var cloudPiuRecente=(d.ts||0)>(lg('localTs',0)||0);
var n=nccApplicaPrefs(d.prefs,cloudPiuRecente);
if(n){
try{renderPlan&&renderPlan();renderCoach&&renderCoach();
updateTabBadge&&updateTabBadge();renderList&&renderList();}catch(e){}
}
}catch(e){}
},function(){});
}catch(e){}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   SINCRONIZZAZIONE COMPLETA
   [BUG] gran parte dello stato dell'addon non viaggiava affatto fra
   dispositivi: note, riferimenti, promozioni, croniche sospese, storico
   dei test a freddo e dei check-up, taratura del modello, giro delle
   schede miste, bilancio degli errori, registro dei percorsi completati.
   Ora entra nelle preferenze e viene fuso senza perdere nulla.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
/* insiemi: si uniscono, non si sovrascrivono */
var OGGETTI=['qNotes','rifVie','promosse','chronSusp','rDoneLog','mixRound','errBal'];
/* elenchi cronologici: si fondono per data */
var STORICI=['coldHist','checkupHist'];
/* valori singoli: vince il più informato */
var NUMERI=['modelBias','modelN','coldDone','checkupDone','lapDone'];

try{
var _gpS=getPrefs;
getPrefs=function(){
var p={};
try{p=_gpS.apply(this,arguments)||{};}catch(e){}
try{
OGGETTI.concat(STORICI).forEach(function(k){
var v=lg(k,null);
if(v!==null&&v!==undefined&&(typeof v!=='object'||Object.keys(v).length))p[k]=v;
});
NUMERI.forEach(function(k){var v=lg(k,null);if(v!==null&&v!==undefined&&v!==0)p[k]=v;});
}catch(e){}
return p;
};
}catch(e){}

/* fusione dal cloud: mai perdere dati, né locali né remoti */
window.nccFondiPrefs=function(pr){
try{
if(!pr||typeof pr!=='object')return 0;
var n=0;
OGGETTI.forEach(function(k){
try{
var remoto=pr[k];if(!remoto||typeof remoto!=='object')return;
var locale=lg(k,{})||{};
Object.keys(remoto).forEach(function(id){
if(locale[id]===undefined){locale[id]=remoto[id];n++;}
else if(typeof locale[id]==='number'&&typeof remoto[id]==='number'&&remoto[id]>locale[id]){
locale[id]=remoto[id];n++;}
else if(k==='errBal'&&remoto[id]&&locale[id]){
var a=locale[id],b=remoto[id];
if(((b.in||0)+(b.out||0))>((a.in||0)+(a.out||0))){locale[id]=b;n++;}
}
});
ls(k,locale);
}catch(e){}
});
STORICI.forEach(function(k){
try{
var remoto=pr[k];if(!Array.isArray(remoto))return;
var locale=lg(k,[]);if(!Array.isArray(locale))locale=[];
var viste={};locale.forEach(function(x){if(x&&x.d)viste[x.d]=1;});
remoto.forEach(function(x){if(x&&x.d&&!viste[x.d]){locale.push(x);n++;}});
locale.sort(function(a,b){return (a.d||0)-(b.d||0);});
if(locale.length>26)locale=locale.slice(-26);
ls(k,locale);
}catch(e){}
});
NUMERI.forEach(function(k){
try{
if(pr[k]===undefined)return;
var l=lg(k,0);
if(!l||(typeof pr[k]==='number'&&pr[k]>l)){ls(k,pr[k]);n++;}
}catch(e){}
});
return n;
}catch(e){return 0;}
};

/* si aggancia allo scarico dal cloud */
try{
var _sfcP=window.syncFromCloud;
window.syncFromCloud=function(){
try{_sfcP.apply(this,arguments);}catch(e){}
try{
if(typeof fbRef==='undefined'||!fbRef)return;
fbRef.once('value',function(sn){
try{
var d=sn.val()||{};
var n=nccFondiPrefs(d.prefs);
if(n>0){
try{markDirty('prefs');}catch(e){}
setTimeout(function(){
try{
var h=document.getElementById('homeScreen');
if(h&&h.style.display!=='none'){renderCoach();renderPlan();renderReadiness();renderExamLight();}
updateTabBadge();
}catch(e){}
},600);
}
}catch(e){}
},function(){});
}catch(e){}
};
}catch(e){}
})();

/* ═══════════════════════════════════════════════════
   GLI ERRORI SMALTITI NON DEVONO RINASCERE
   [BUG CRITICO] la fusione dal cloud UNISCE gli errori: aggiunge quelli
   remoti ma non toglie mai quelli promossi altrove. Risultato: smalti
   30 errori sul telefono, il PC li rimanda su, e "tornano come prima".
   Il registro delle promozioni (id → quando è uscito) fa da lapide:
   un errore promosso non rientra, a meno che tu non lo sbagli di nuovo
   DOPO la promozione (in quel caso la sua scadenza è più recente).
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
window.nccPulisciPromossi=function(){
try{
var pr=lg('promosse',{});
if(!pr||!qtStats||!qtStats.err)return 0;
var n=0;
Object.keys(pr).forEach(function(id){
var e=qtStats.err[id];
if(!e||typeof e!=='object')return;
var quando=pr[id]||0;
var scadenza=e.due||0;
/* scadenza più vecchia della promozione = è la vecchia voce risorta */
if(quando&&scadenza<=quando){delete qtStats.err[id];n++;}
});
if(n){
try{qtSave();updateTabBadge();}catch(e){}
}
return n;
}catch(e){return 0;}
};

/* si applica dopo ogni scarico dal cloud, prima di risalvare */
try{
var _sfcT=window.syncFromCloud;
window.syncFromCloud=function(){
try{_sfcT.apply(this,arguments);}catch(e){}
setTimeout(function(){
try{
var n=nccPulisciPromossi();
if(n>0){
try{markDirty('prefs');autoSave();}catch(e){}
setTimeout(function(){
try{
var h=document.getElementById('homeScreen');
if(h&&h.style.display!=='none'){renderCoach();renderPlan();renderExamLight();}
}catch(e){}
},500);
}
}catch(e){}
},900);
};
}catch(e){}

/* pulizia anche all'avvio: se un dispositivo aveva già ricaricato i vecchi */
setTimeout(function(){try{nccPulisciPromossi();}catch(e){}},6000);
})();

/* ═══════════════════════════════════════════════════
   1 · AZZERAMENTO DEGLI ERRORI — si riparte puliti
   I percorsi, le vie posizionate, la spirale e la copertura restano.
   Ogni errore azzerato lascia la sua lapide, così non può tornare
   dall'altro dispositivo.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
window.nccAzzeraErrori=function(silenzioso){
try{
buildQuiz();
var ids=Object.keys(qtStats.err||{});
var pr=lg('promosse',{});var ora=Date.now();
ids.forEach(function(id){pr[id]=ora;});
/* tetto al registro */
var k=Object.keys(pr);
if(k.length>1200){k.sort(function(a,b){return pr[a]-pr[b];});
k.slice(0,k.length-1200).forEach(function(x){delete pr[x];});}
ls('promosse',pr);
qtStats.err={};
qtStats.wrongN={};
ls('chronSusp',{});
ls('mixRound',{});
ls('errBal',{});
try{qtSave();updateTabBadge();}catch(e){}
try{markDirty('prefs');autoSave();}catch(e){}
try{
var h=document.getElementById('homeScreen');
if(h)setTimeout(function(){try{renderCoach();renderPlan();renderExamLight();renderReadiness();}catch(e){}},300);
}catch(e){}
if(!silenzioso)toast2('\u2728 Ripartiamo puliti: '+ids.length+' errori azzerati \u00b7 percorsi e vie intatti',3400);
return ids.length;
}catch(e){return 0;}
};
/* voce nel menu, per rifarlo quando vuoi */
setTimeout(function(){
try{
var menu=document.querySelector('#menuSheet .msheet')||document.querySelector('#menuSheet');
if(!menu||document.getElementById('azzeraBtn'))return;
var b=document.createElement('button');
b.id='azzeraBtn';
b.innerHTML='<span class="mi">\u2728</span>Azzera errori e schede';
b.onclick=function(){
if(!confirm('Azzerare tutti gli errori e le schede?\n\nPercorsi, vie posizionate e copertura restano intatti.\nRiparti con la pila pulita.'))return;
nccAzzeraErrori();try{cm();}catch(e){}
};
var reset=menu.querySelector('[onclick*="doReset"]');
if(reset)reset.parentNode.insertBefore(b,reset);else menu.appendChild(b);
}catch(e){}
},2000);
/* azzeramento richiesto: una volta sola, poi mai più */
setTimeout(function(){
try{
if(lg('azzerato2026',false))return;
ls('azzerato2026',true);
var n=nccAzzeraErrori(true);
if(n>0)toast2('\u2728 Pila azzerata: '+n+' errori \u00b7 percorsi e vie intatti',3600);
}catch(e){}
},4000);
})();

/* ═══════════════════════════════════════════════════
   2 · SUGGERIMENTI MIRATI — su quello che sbagli davvero
   Prima mostravano curiosità a caso. Ora pescano dai tuoi punti deboli
   e cambiano a ogni apertura (e a ogni tocco).
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
var SUBLAB2={geo_terr:'Geografia · territorio',geo_vie:'Geografia · vie e strade',
norm_legge:'Normativa · legge',norm_aero:'Normativa · aeroporti',
reg_com:'Regolamento · comunale',reg_dov:'Regolamento · doveri',lingua:'Inglese'};

function raccogli(){
var out=[];
try{
buildQuiz();
/* tema più debole */
var m=(typeof studentModel==='function')?studentModel():null;
if(m&&m.subs&&m.subs.length){
var w=m.subs[0];
if(w.m<75)out.push({ic:'\ud83d\udd2c',t:'Il tuo tema più debole è <b>'+esc(w.label)+'</b> — lo sai al '+w.m+'%',
az:function(){if(typeof qStartSub==='function')qStartSub(w.sub,w.label);}});
if(m.worst&&m.worst.over>0.10)out.push({ic:'\u26a0\ufe0f',t:'All\u2019esame <b>'+esc(m.worst.label)+'</b> ti boccia nel '+Math.round(m.worst.over*100)+'% dei casi',
az:function(){openQuiz();setTimeout(function(){qStartCat(m.worst.id);},250);}});
}
/* domande croniche */
var ch=(typeof chronicList==='function')?chronicList():[];
if(ch.length>=3){
var c=ch[Math.floor(Math.random()*Math.min(5,ch.length))];
out.push({ic:'\ud83e\ude79',t:'<b>'+ch.length+' domande</b> le sbagli da sempre: non serve ripassarle, serve capire la regola',
az:function(){if(typeof qStartTwins==='function')qStartTwins(c);}});
}
/* vie nere */
var tm=(typeof topoModel==='function')?topoModel():null;
if(tm&&tm.nere&&tm.nere.length){
var v=tm.nere[0];
out.push({ic:'\ud83d\uddfa',t:'<b>'+esc(v.nome)+'</b> \u00e8 la via che sbagli di pi\u00f9'+(v.perc>1?(' \u00b7 compare in '+v.perc+' percorsi'):''),
az:function(){goTopografia();}});
if(tm.rows&&tm.rows.length&&tm.rows[0].clean<0.5){
var r=tm.rows[0];
out.push({ic:'\ud83e\udded',t:'Il percorso pi\u00f9 fragile: <b>'+esc(r.r.title)+'</b> \u00b7 '+Math.round(r.clean*100)+'% di farlo pulito',
az:function(){goTopografia();setTimeout(function(){selectRoute(r.r);setTimeout(function(){setMode('c');},250);},300);}});
}
}
/* errori in scadenza */
var d=(typeof debtInfo==='function')?debtInfo():null;
if(d&&d.due>0){
out.push({ic:'\ud83d\udd01',t:'<b>'+d.due+' errori</b> ti aspettano oggi'+(d.topId&&d.topN>=10?(' \u00b7 '+d.topN+' sono di '+((QARG.find(function(x){return x.id===d.topId;})||{}).label||'')):''),
az:function(){openQuiz();setTimeout(function(){qStartCat('errata');},250);}});
}
/* proiezione */
var pj=(typeof projectPile==='function')?projectPile():null;
if(pj&&pj.acc)out.push({ic:'\ud83c\udfaf',t:'Rispondi giusto al <b>'+pj.acc+'%</b> \u00b7 sopra il 68% la pila scende, sotto sale',az:null});
}catch(e){}
return out;
}

var LISTA=[],idx=0;
function disegna(){
try{
var hd=document.querySelector('#homeScreen .home-hd');if(!hd)return;
var el=document.getElementById('tipLine');
if(!el){el=document.createElement('div');el.id='tipLine';hd.appendChild(el);}
if(!LISTA.length)LISTA=raccogli();
if(!LISTA.length){
el.className='tip-card';
el.innerHTML='<span class="tip-ic">\u2728</span><span class="tip-tx">Tutto sotto controllo: nessun punto debole da segnalare</span>';
return;
}
if(idx>=LISTA.length)idx=0;
var t=LISTA[idx];
el.className='tip-card';
el.innerHTML='<span class="tip-ic">'+t.ic+'</span><span class="tip-tx">'+t.t+'</span>'
+(LISTA.length>1?('<span class="tip-n">'+(idx+1)+'/'+LISTA.length+'</span>'):'');
el.onclick=function(){
if(t.az){try{t.az();return;}catch(e){}}
idx++;LISTA=raccogli();disegna();
};
/* rotazione automatica: il tocco serve per AGIRE, non per cambiare */
try{
clearInterval(window.__tipT);
window.__tipT=setInterval(function(){
try{
var h=document.getElementById('homeScreen');
if(!h||h.style.display==='none')return;
if(document.hidden)return;
idx++;if(idx>=LISTA.length){idx=0;LISTA=raccogli();}
var e2=document.getElementById('tipLine');
if(e2){e2.style.transition='opacity .25s';e2.style.opacity='0';
setTimeout(function(){disegna();var e3=document.getElementById('tipLine');
if(e3){e3.style.opacity='0';requestAnimationFrame(function(){e3.style.transition='opacity .3s';e3.style.opacity='1';});}},260);}
}catch(e){}
},9000);
}catch(e){}
}catch(e){}
}
try{
var _rt=renderTip;
renderTip=function(){LISTA=[];idx=Math.floor(Math.random()*4);disegna();};
}catch(e){}
setTimeout(function(){try{renderTip();}catch(e){}},2600);
})();

/* ═══════════════════════════════════════════════════
   3 · IL PIANO DI OGGI, DETTO SEMPLICE
   Prima: un elenco di cose con sottotitoli tecnici.
   Ora: "Oggi devi fare questo", una riga per cosa, verde se fatta,
   rosso se manca. Si capisce in un colpo d'occhio cosa resta.
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';
function oggi(){try{return _dayKey();}catch(e){return new Date().toDateString();}}

/* cosa risulta fatto oggi */
function fatto(ic){
try{
var k=oggi();
var risposteOggi=((qtStats.daily||{})[k])||0;
var bal=(lg('errBal',{})||{})[k]||{in:0,out:0};
switch(ic){
case '\ud83d\udd01': return bal.out>=20||risposteOggi>=40;      /* scheda errori */
case '\ud83c\udfaf': return risposteOggi>=25;                    /* sessione mirata */
case '\ud83d\udd2c': return (lg('coldDone',0)&&new Date(lg('coldDone',0)).toDateString()===new Date().toDateString());
case '\ud83e\ude7a': return (lg('checkupDone',0)&&new Date(lg('checkupDone',0)).toDateString()===new Date().toDateString());
case '\ud83d\uddfa': case '\ud83e\udded': {
var log=lg('rDoneLog',{}),n=0,ora=Date.now();
Object.keys(log).forEach(function(id){if(ora-log[id]<20*3600000)n++;});
return n>0;
}
case '\ud83c\udf05': case '\ud83c\udf04': return risposteOggi>=15;   /* errori di ieri (alba) */
case '\ud83c\udf93': return (qExamHist||[]).some(function(x){return x.d&&new Date(x.d).toDateString()===new Date().toDateString();});
case '\ud83d\udc8e': return risposteOggi>=20;
default: return risposteOggi>=30;
}
}catch(e){return false;}
}

/* testo diretto: cosa devi fare, non come si chiama la funzione */
function semplifica(x){
try{
var t=x.tx||'';
var m;
if(x.ic==='\ud83d\udd01'){m=t.match(/(\d+)/);return 'Ripassa '+(m?'40':'')+' errori in scadenza';}
if(x.ic==='\ud83c\udfaf')return 'Allena il tuo punto debole';
if(x.ic==='\ud83d\uddfa'){m=t.match(/(\d+)/);return 'Ripassa '+(m?m[1]:'i')+' percorsi in scadenza';}
if(x.ic==='\ud83e\udded')return 'Ripassa il percorso più fragile';
if(x.ic==='\ud83d\udd2c'&&/freddo/i.test(t))return 'Fai il test a freddo (20 domande)';
if(x.ic==='\ud83d\udd2c')return 'Allena il tema più debole';
if(x.ic==='\ud83e\ude7a')return 'Controlla se le promozioni reggono';
if(x.ic==='\ud83e\ude79')return 'Affronta le domande croniche';
if(x.ic==='\ud83c\udf93')return 'Fai una simulazione d\u2019esame';
if(x.ic==='\ud83d\udc8e')return 'Sessione mirata: 12 domande';
if(x.ic==='\ud83c\udf05'||x.ic==='\ud83c\udf04')return 'Ripassa gli errori di ieri';
if(x.ic==='\ud83e\uddec')return 'Impara il tratto in comune fra due percorsi';
if(x.ic==='\ud83d\udda4')return 'Studia le vie che sbagli di più';
return t;
}catch(e){return x.tx;}
}

try{
var _rcS2=renderCoach;
renderCoach=function(){
_rcS2.apply(this,arguments);
try{
var w=document.getElementById('coachCard');if(!w)return;
var righe=w.querySelectorAll('.coach-row');
if(!righe.length)return;
var lista=(typeof COACH!=='undefined'&&COACH)?COACH:[];
var nFatti=0;
righe.forEach(function(r,i){
var x=lista[i];if(!x)return;
var ok=x.done||fatto(x.ic);
if(ok)nFatti++;
r.classList.toggle('fatto',!!ok);
r.classList.toggle('damorire',!ok);
var b=r.querySelector('.coach-tx b');
if(b)b.textContent=semplifica(x);
var ar=r.querySelector('.coach-ar');
if(ar)ar.innerHTML=ok?'\u2713':'\u203a';
var st=r.querySelector('.stato-oggi');
if(!st){st=document.createElement('span');st.className='stato-oggi';
var tx=r.querySelector('.coach-tx');if(tx)tx.appendChild(st);}
st.textContent=ok?'fatto oggi':'da fare';
st.className='stato-oggi '+(ok?'si':'no');
});
/* intestazione parlante */
var hd=w.querySelector('.coach-hd strong');
if(hd){
var tot=righe.length;
hd.textContent=(nFatti>=tot)?'\ud83c\udfc1 Fatto tutto per oggi'
:(nFatti>0?('Oggi ti manca ancora: '+(tot-nFatti)+' su '+tot)
:'Oggi devi fare questo');
}
/* barra di avanzamento della giornata */
var old=w.querySelector('.giorno-bar');if(old)old.remove();
var bar=document.createElement('div');bar.className='giorno-bar';
bar.innerHTML='<i style="width:'+Math.round(nFatti/righe.length*100)+'%"></i>';
var coach=w.querySelector('.coach');if(coach)coach.appendChild(bar);
}catch(e){}
};
}catch(e){}
})();
