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
.rd .coach-tx b,.rd .plan-tx strong,.rd .ready-tx strong{font-size:var(--t2);font-weight:800;color:var(--tx);}
.rd .coach-tx small,.rd .plan-tx small,.rd .qtile-tx small,.rd .home-card .hc-tx small{font-size:var(--t1);color:var(--lbl2);}
/* numeri protagonisti: peso display, tracking stretto */
.rd .tg-hd>b,.rd .qres-stat b,.rd .qerr-num,.rd .ready-ring span,.rd .plan-card b{
font-weight:860;letter-spacing:-.04em;font-variant-numeric:tabular-nums;
}

/* ── 4 · COLORE SEMANTICO DEGLI ARGOMENTI ── */
.rd{--cat0:#0D9488;--cat1:#4F46E5;--cat2:#D97706;--cat3:#DB2777;}
.catc0 .qtile-ic{background:rgba(13,148,136,.13)!important;}
.catc1 .qtile-ic{background:rgba(79,70,229,.13)!important;}
.catc2 .qtile-ic{background:rgba(217,119,6,.13)!important;}
.catc3 .qtile-ic{background:rgba(219,39,119,.13)!important;}
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
.rd .qrun-end{box-shadow:0 6px 18px rgba(36,71,214,.38);font-weight:800;}
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
.qpill.cur{flex:1.6;height:22px;min-width:26px;font-size:12px;font-weight:800;background:var(--card);border:2px solid var(--a);color:var(--a);border-radius:8px;}
.qpill.ans.cur{background:var(--card);color:var(--a);}

/* ── 13 · ricerca e chip alla stessa altezza esatta ── */
#sb{height:46px;padding-top:0;padding-bottom:0;}

/* ── 14 · ingresso morbido dei blocchi di stato ── */
#readyCard,#examLight,#planCard{animation:fadeUp .4s ease both;}

/* ── 15 · Ordina le vie: allineato al design attuale ── */
.ord-slot{background:var(--fill3);border:1.5px dashed var(--bd);border-radius:14px;min-height:44px;font-size:13.5px;display:flex;align-items:center;}
.ord-slot.done{background:rgba(14,159,110,.09);border:1.5px solid rgba(14,159,110,.45);color:var(--tx);font-weight:650;}
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
.gm-card .gm-e{font-size:56px;}
.gm-card h2{font-size:26px;font-weight:850;color:var(--ok);margin:10px 0 8px;letter-spacing:-.02em;}
.gm-card p{font-size:14px;color:var(--mu);line-height:1.5;font-weight:550;}
.gm-card button{width:100%;margin-top:18px;padding:15px;border:none;border-radius:16px;background:var(--ok);color:#fff;font-size:16px;font-weight:800;cursor:pointer;}

@media (prefers-reduced-motion:reduce){
#readyCard,#examLight,#planCard{animation:none;}
.gm-card{animation:none;}
}

/* [FIX 500] le pillole-segmento sono alte 10px: l'area di TOCCO si espande
in verticale (invisibile) così saltare a una domanda resta facile col dito */
.qpill{position:relative;}
.qpill::before{content:'';position:absolute;left:0;right:0;top:-10px;bottom:-10px;}

/* ══════ Coach 2.0 ══════ */
.srmul-line{margin-top:6px;text-align:center;font-size:11px;font-weight:700;color:var(--mu);}
#bailSheet{position:fixed;inset:0;z-index:8600;background:rgba(7,10,20,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;}
.bail-card{background:var(--card);border:1.5px solid var(--bd);border-radius:26px;padding:26px 22px;max-width:360px;width:100%;text-align:center;box-shadow:var(--sh-xl);animation:popIn .35s cubic-bezier(.34,1.2,.5,1);}
.bail-card .bail-e{font-size:44px;}
.bail-card b{display:block;font-size:19px;font-weight:820;color:var(--tx);margin:10px 0 8px;letter-spacing:-.02em;}
.bail-card p{font-size:13.5px;color:var(--mu);line-height:1.5;font-weight:550;}
.bail-row{display:flex;gap:10px;margin-top:18px;}
.bail-row button{flex:1;padding:14px 10px;border:none;border-radius:16px;font-size:14.5px;font-weight:800;cursor:pointer;}
.bail-stop{background:var(--fill2);color:var(--tx);}
.bail-go{background:var(--a);color:#fff;box-shadow:0 4px 14px rgba(36,71,214,.3);}
@media (prefers-reduced-motion:reduce){.bail-card{animation:none;}}

/* ══════ Final polish ══════ */

/* 1 · anello risultato */
#resRing{position:relative;width:150px;height:150px;margin:4px auto 10px;}
.rr-txt{position:absolute;inset:0;display:flex;align-items:baseline;justify-content:center;flex-direction:row;align-content:center;flex-wrap:wrap;}
.rr-txt b{font-size:44px;font-weight:860;letter-spacing:-.04em;color:var(--tx);font-variant-numeric:tabular-nums;line-height:150px;}
.rr-txt span{font-size:18px;font-weight:750;color:var(--mu);line-height:150px;margin-left:2px;}
.qres-emoji{display:none;} /* il verdetto ora lo dà l'anello */
.qres-title{margin-top:0;font-size:28px;}
/* statistiche compatte sotto l'anello */
.qres-stats{display:flex;gap:8px;max-width:420px;margin:14px auto 22px;}
.qres-stat{flex:1;padding:10px 6px;border-radius:16px;}
.qres-stat b{font-size:22px;}
.qres-stat span{font-size:11px;margin-top:3px;}

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
#qRunQ{font-size:23px;line-height:1.5;}

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
#rereadOv p{font-size:21px;line-height:1.55;font-weight:650;color:var(--tx);}

/* (1) copertina pre-scheda */
#errCover{position:fixed;inset:0;z-index:8650;background:rgba(7,10,20,.7);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;}
.ec-card{background:var(--card);border-radius:26px;padding:24px;max-width:380px;width:100%;box-shadow:var(--sh-xl);animation:popIn .32s cubic-bezier(.34,1.2,.5,1);}
.ec-card small{font-size:11.5px;font-weight:800;color:var(--a);text-transform:uppercase;letter-spacing:.04em;}
.ec-card h3{font-size:19px;font-weight:820;color:var(--tx);margin:6px 0 14px;letter-spacing:-.01em;}
.ec-row{padding:10px 12px;background:var(--fill3);border-radius:14px;margin-bottom:8px;font-size:14.5px;font-weight:650;color:var(--tx);}
.ec-row b{font-weight:850;color:var(--a);margin-right:4px;}
.ec-go{width:100%;margin-top:10px;padding:15px;border:none;border-radius:16px;background:var(--a);color:#fff;font-size:16px;font-weight:800;cursor:pointer;}

/* (4) riscaldamento sotto il bottone simulazione */
.warm-btn{display:block;width:100%;margin-top:9px;padding:12px;border:1.5px dashed rgba(255,255,255,.5);border-radius:15px;background:rgba(255,255,255,.12);color:#fff;font-size:13.5px;font-weight:750;cursor:pointer;}

/* (C) diagnosi post-simulazione */
#simDiag{margin:4px 16px 14px;padding:14px 16px;background:var(--sab);border:1.5px solid rgba(36,71,214,.3);border-radius:18px;}
#simDiag p{font-size:13.5px;line-height:1.5;color:var(--tx);font-weight:600;}
#simDiag b{font-weight:820;}
#simDiag button{width:100%;margin-top:10px;}

/* (A)(10) debrief percorso */
#routeDebrief{position:fixed;left:12px;right:12px;bottom:calc(var(--tabh,64px) + 26px + env(safe-area-inset-bottom));z-index:3400;display:flex;justify-content:center;pointer-events:none;}
#routeDebrief .rdb{pointer-events:auto;position:relative;max-width:460px;width:100%;background:var(--card);border-radius:20px;padding:14px 40px 12px 16px;box-shadow:var(--sh-xl);animation:popIn .35s cubic-bezier(.34,1.2,.5,1);}
.rdb.ok{border:1.5px solid rgba(14,159,110,.5);}
.rdb.warn{border:1.5px solid rgba(229,72,77,.45);}
.rdb b{display:block;font-size:15px;font-weight:820;color:var(--tx);}
.rdb.ok b{color:var(--ok);}
.rdb small{display:block;font-size:11.5px;color:var(--mu);font-weight:650;margin-top:6px;}
.rdb-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.rdb-via{padding:6px 10px;background:rgba(229,72,77,.1);border:1px solid rgba(229,72,77,.35);border-radius:10px;font-size:12px;font-weight:700;color:var(--err);cursor:pointer;}
.rdb-x{position:absolute;top:8px;right:8px;width:28px;height:28px;border:none;border-radius:50%;background:var(--fill2);color:var(--mu);font-size:13px;cursor:pointer;}

/* (9) Cieco: numeri delle vie GRANDI — sono l'aggancio della memoria */
body.mode-c .row .sn{font-size:19px;font-weight:850;min-width:30px;}

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
.plan-exam-big .ex-n{font-size:38px;font-weight:860;letter-spacing:-.04em;color:var(--warn);font-variant-numeric:tabular-nums;line-height:1;min-width:64px;}
.plan-exam-big .ex-tx strong{display:block;font-size:15px;font-weight:800;color:var(--tx);letter-spacing:-.01em;}
.plan-exam-big .ex-tx small{display:block;font-size:11.5px;color:var(--mu);font-weight:650;margin-top:3px;}
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
font-size:40px;font-weight:860;letter-spacing:-.04em;color:var(--warn);
font-variant-numeric:tabular-nums;line-height:1;min-width:64px;text-align:center;
}
.plan-exam.ex-big .ex-tx{flex:1;}
.plan-exam.ex-big .ex-tx strong{display:block;font-size:15px;font-weight:800;color:var(--tx);letter-spacing:-.01em;}
.plan-exam.ex-big .ex-tx small{display:block;font-size:11.5px;color:var(--mu);font-weight:600;margin-top:3px;}
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
.sp-hd{font-size:12px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px;}
.sp-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 2px;border-bottom:1px solid var(--sep2);cursor:pointer;font-size:14px;font-weight:600;color:var(--tx);}
.sp-row:last-child{border-bottom:none;}
.sp-row b{font-weight:800;color:var(--mu);font-size:12.5px;white-space:nowrap;}
.sp-row .sp-now{color:var(--warn);}
.sp-row:active{opacity:.6;}
.rdb-next{display:block;width:100%;margin-top:10px;padding:12px;border:none;border-radius:14px;background:var(--a);color:#fff;font-size:13.5px;font-weight:800;cursor:pointer;}

/* ══════ Modalità recupero ══════ */
.tg-bar.debt i{background:linear-gradient(90deg,var(--warn),var(--err));}
.tg-debt b{color:var(--err);}
.coach-why.why-alert{color:var(--err);font-weight:750;background:rgba(229,72,77,.06);border-radius:12px;padding:8px 10px;margin:0 8px 8px;border-bottom:none;}
.sp-hd .sp-cnt{color:var(--warn);font-weight:850;}

/* ══════ Imparare ══════ */
.twin-btn{display:block;width:100%;margin:10px 0 2px;padding:13px;border:1.5px solid var(--a);border-radius:15px;background:var(--sab);color:var(--a);font-size:14px;font-weight:800;cursor:pointer;}
.twin-btn:active{transform:scale(.97);}
.coach-why .bal{font-weight:800;}
.coach-why .bal.good{color:var(--ok);}
.coach-why .bal.bad{color:var(--err);}

/* ══════ Modello studente ══════ */
#modelCard{width:100%;max-width:460px;margin:10px auto 0;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:14px 16px;box-shadow:var(--sh-sm);}
@media (min-width:1100px){#modelCard{max-width:520px;}}
#modelCard.ok{border-color:rgba(14,159,110,.4);}
#modelCard.mid{border-color:rgba(217,119,6,.4);}
#modelCard.no{border-color:rgba(229,72,77,.4);}
.mc-hd{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:10px;border-bottom:1px solid var(--sep2);}
.mc-hd small{display:block;font-size:9.5px;font-weight:800;color:var(--mu);letter-spacing:.06em;}
.mc-hd b{font-size:34px;font-weight:860;letter-spacing:-.04em;color:var(--tx);font-variant-numeric:tabular-nums;line-height:1.05;}
.mc-hd b span{font-size:15px;font-weight:750;color:var(--mu);}
.mc-risk{text-align:right;}
#modelCard.ok .mc-risk b{color:var(--ok);}
#modelCard.mid .mc-risk b{color:var(--warn);}
#modelCard.no .mc-risk b{color:var(--err);}
.mc-sub{font-size:10.5px;color:var(--mu);font-weight:600;line-height:1.35;margin:8px 0 6px;}
.mc-row{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12.5px;font-weight:650;color:var(--tx);}
.mc-row span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mc-row b{min-width:34px;text-align:right;font-weight:800;font-size:12px;font-variant-numeric:tabular-nums;}
.mc-bar{width:74px;height:7px;border-radius:4px;background:var(--fill2);overflow:hidden;flex-shrink:0;}
.mc-bar i{display:block;height:100%;border-radius:4px;transition:width .6s cubic-bezier(.4,0,.2,1);}
.mc-bar.ok i{background:var(--ok);}
.mc-bar.mid i{background:var(--warn);}
.mc-bar.no i{background:var(--err);}
.mc-tip{margin-top:10px;padding:10px 12px;background:var(--sab);border-radius:14px;font-size:12px;font-weight:700;color:var(--tx);line-height:1.4;cursor:pointer;}
.mc-tip:active{opacity:.6;}

/* ══════ Proiezione ══════ */
#projCard{width:100%;max-width:460px;margin:10px auto 0;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:13px 16px;box-shadow:var(--sh-sm);}
@media (min-width:1100px){#projCard{max-width:520px;}}
.pj-hd{font-size:9.5px;font-weight:800;color:var(--mu);letter-spacing:.06em;}
.pj-main{font-size:15px;font-weight:650;color:var(--tx);margin-top:5px;line-height:1.35;}
.pj-main b{font-weight:850;color:var(--a);}
.pj-sub{font-size:11.5px;color:var(--mu);font-weight:600;line-height:1.4;margin-top:5px;}

/* ══════ Ottimizzatore ══════ */
#optDelta{margin:4px 16px 12px;padding:12px 14px;background:var(--sab);border-radius:16px;font-size:13px;font-weight:650;color:var(--tx);text-align:center;}
#optDelta b{font-weight:850;color:var(--ok);}

/* ══════ Home 2.0: stato a schede ══════ */
#stateCard{width:100%;max-width:460px;margin:14px auto 0;}
@media (min-width:1100px){#stateCard{max-width:520px;}}
.st-seg{display:flex;gap:4px;padding:4px;background:var(--fill3);border-radius:16px;margin-bottom:8px;}
.st-tab{flex:1;padding:9px 6px;border:none;border-radius:12px;background:transparent;color:var(--mu);font-size:12.5px;font-weight:750;cursor:pointer;transition:background .22s,color .22s;}
.st-tab.on{background:var(--card);color:var(--tx);font-weight:820;box-shadow:var(--sh-sm);}
.st-tab.off{opacity:.35;pointer-events:none;}
.st-pane{display:none;animation:fadeUp .28s ease both;}
.st-pane.on{display:block;}
/* le card dentro le schede: stesso ritmo, niente margini doppi */
.st-pane>div{margin-top:0!important;margin-bottom:8px;}
.st-pane>div:last-child{margin-bottom:0;}
/* intestazioni armonizzate tra modello, proiezione e spirale */
.mc-hd small,.pj-hd,.sp-hd{font-size:9.5px!important;font-weight:800!important;letter-spacing:.06em!important;color:var(--mu)!important;text-transform:uppercase;}
#modelCard,#projCard,#spiralCard,#examLight .xl{border-radius:22px;}
/* l'azione sale: più aria sopra il bottone, meno sotto */
.smart-btn{margin-top:16px!important;}
@media (prefers-reduced-motion:reduce){.st-pane{animation:none;}}

/* ══════ Modello topografia ══════ */
#topoCard{width:100%;background:var(--card);border:1.5px solid var(--bd);border-radius:22px;padding:14px 16px;box-shadow:var(--sh-sm);margin-top:8px;}
.tp-row{cursor:pointer;}
.tp-row:active{opacity:.6;}
.tp-nere{margin-top:9px;padding-top:9px;border-top:1px solid var(--sep2);font-size:11.5px;color:var(--mu);font-weight:600;line-height:1.45;}
.tp-nere b{color:var(--tx);font-weight:800;}

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
why.textContent='🚑 Modalità recupero: '+d.due+' errori scaduti'+(d.old3?(' ('+d.old3+' da 3+ giorni)'):'')+'. Stop alle nuove: '+giorni+' giorni a 40 al giorno e sei in pari.';
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
s.textContent=' · In arrivo: '+dom+' domani, '+dopo+' dopodomani (carico livellato)';
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
if(coach&&btn&&coach.nextElementSibling!==btn)coach.after(btn);
if(btn&&btn.nextElementSibling!==sc)btn.after(sc);
else if(!btn&&!sc.parentNode)home.appendChild(sc);/*[FIX 300] senza il bottone restava orfano e se ne creava uno per render*/
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
var p=1,worst=null,wp=1;
r.steps.forEach(function(_,i){
var q=pVia(r,i);p*=q;
if(q<wp){wp=q;worst=i;}
});
return {r:r,clean:p,worst:worst,wp:wp,n:r.steps.length};
}).filter(Boolean);
if(!rows.length)return null;
rows.sort(function(a,b){return a.clean-b.clean;});
var avg=rows.reduce(function(s,x){return s+x.clean;},0)/rows.length;
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
var pc=Math.round(x.clean*100);
var cls=pc>=60?'ok':(pc>=35?'mid':'no');
var t=x.r.title.length>24?x.r.title.slice(0,22)+'…':x.r.title;
return '<div class="mc-row tp-row" data-id="'+x.r.id+'"><span>'+esc(t)+'</span><div class="mc-bar '+cls+'"><i style="width:'+pc+'%"></i></div><b>'+pc+'%</b></div>';
}).join('');
var nere=m.nere.length?('<div class="tp-nere">🖤 Vie che ti bocciano: '+m.nere.slice(0,3).map(function(v){
return '<b>'+esc(v.nome.length>20?v.nome.slice(0,18)+'…':v.nome)+'</b>'+(v.perc>1?(' ('+v.perc+' percorsi)'):'');
}).join(' · ')+'</div>'):'';
var el=document.createElement('div');el.id='topoCard';
el.innerHTML='<div class="mc-hd"><div><small>TOPOGRAFIA · PERCORSO PULITO</small><b>'+Math.round(m.avg*100)+'<span>%</span></b></div>'
+'<div class="mc-risk"><small>A RISCHIO</small><b>'+m.rischio+'</b></div></div>'
+'<div class="mc-sub">Probabilità di completare un percorso in Cieco senza errori · i tre più deboli:</div>'
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
try{
var _smC2=startMicro;
startMicro=function(){
try{
if(dueCount()<20&&Object.keys(qtStats.seenIds||{}).length>=40){
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
var due=dueCount();
if(due>=20||Object.keys(qtStats.seenIds||{}).length<40)return t;
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
if(dueCount()>=20)return;
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
+'.mc-hd small,.pj-hd,.sp-hd{display:block;font-size:9.5px;font-weight:800;letter-spacing:.06em;opacity:.6}'
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
