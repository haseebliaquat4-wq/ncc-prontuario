/* (v150) il motore dei marker automatici, provato in Node senza browser e senza rete:
   la lettura delle tappe del libro, la somiglianza dei nomi, le espressioni per cercare,
   la catena sulla Milano finta (ogni marker sulla via giusta, il punto di domanda dove la via
   non c'e'), e lo stesso giro passando dall'Overpass finto (le domande vere dell'app).
   Il motore e' quello dentro addon.js.   node test/motore-prove.js */
var M=require('./motore-da-addon.js')(),G=require('./citta-finta.js')(M),OP=require('./overpass-finto.js');
var ko=0,ok=0;
function eq(a,b,msg){var A=JSON.stringify(a),B=JSON.stringify(b);if(A===B){ok++;}else{ko++;console.log('✗',msg,'\n   atteso',B,'\n   avuto ',A);}}
function vero(x,msg){if(x){ok++;}else{ko++;console.log('✗',msg);}}
function tutti(senza){return Object.keys(G).filter(function(k){return (senza||[]).indexOf(k)<0;}).map(function(k){return G[k];});}
var F={G:G,dove:function(k){var e=G[k];return e.geometry?e.geometry.map(function(g){return M.xy([g.lat,g.lon]);}):[M.xy([e.lat,e.lon])];}};


/* ── 1 · lettura delle tappe ── */
function A(t){var a=M.analizza(t);return [a.k,a.tipo||a.poi||'',a.req||[]];}
eq(A('P.ZA DUOMO'),['via','PIAZZA',['DUOMO']],'piazza duomo');
eq(A('C.SO DI P.TA ROMANA'),['via','CORSO',['PORTA','ROMANA']],'P.TA = PORTA');
eq(A('V.LE DI P.TA VERCELLINA'),['via','VIALE',['PORTA','VERCELLINA']],'P.TA viale');
eq(A('P.LE 24 MAGGIO'),['via','PIAZZALE',['24','MAGGIO']],'24 maggio');
eq(A('VIA FRIULI 30'),['via','VIA',['FRIULI']],'civico in fondo via');
eq(A('IEO - VIA RIPAMONTI 435'),['poi','ospedale',['ONCOLOGIA']],'ieo');
eq(A('VIA RIPAMONTI 435'),['via','VIA',['RIPAMONTI']],'civico 435');
eq(A('FORO BONAPARTE PARI'),['via','FORO',['BONAPARTE']],'foro pari');
eq(A('P.LEGA LOMBARDA'),['via','PIAZZA',['LEGA','LOMBARDA']],'P.LEGA');
eq(A('P.VIRGILIO'),['via','PIAZZA',['VIRGILIO']],'P.VIRGILIO');
eq(A("P.ZA MARIA ADELAIDE DI SAV."),['via','PIAZZA',['MARIA','ADELAIDE','SAVOIA']],'SAV.');
eq(A('GARBAGNATE M.SE'),['nome','',['GARBAGNATE','MILANESE']],'M.SE');
eq(A("A BENEFATTORI DELL'OSPEDA"),['via','VIA',['BENEFATTORI','OSPEDA']],'A = VIA spezzata');
eq(A('VIA CASSINIS (STAZ.ROGOREDO)'),['via','VIA',['CASSINIS']],'parentesi');
eq(A('STAZ. ROGOREDO'),['poi','stazione',['ROGOREDO']],'stazione');
eq(A('STAZ. PORTA GARIBALDI'),['poi','stazione',['PORTA','GARIBALDI']],'stazione garibaldi');
eq(A('LINATE'),['poi','aeroporto',['LINATE']],'linate');
eq(M.analizza('MALPENSA TERMINAL 2 (EASYJET)').term,'2','terminal 2');
eq(A('S.PAOLO'),['poi','ospedale',['PAOLO']],'s.paolo');
eq(A('BARANZATE'),['nome','',['BARANZATE']],'paese');
eq(A('BIGNAMI'),['nome','',['BIGNAMI']],'via senza tipo');
eq(A('USCITA PERO'),['salta','',[]],'uscita');
eq(A('A8 AI LAGHI'),['salta','',[]],'autostrada');
eq(A('SVINC. AUTOSTRADALE V.LE CERTOSA'),['via','VIALE',['CERTOSA']],'svincolo con via');
eq(A('OPPURE'),['salta','',[]],'oppure');
eq(M.analizza('P.ZA AMENDOLA - V.LE EZIO').k,'incrocio','incrocio');
eq(M.analizza('LARGO CAIROLI CON L.GO MARIA CALLAS').k,'incrocio','con');
eq(A('VIA G.B. PIRELLI'),['via','VIA',['PIRELLI']],'G.B.');
eq(A('VIA S.PROTASO'),['via','VIA',['PROTASO']],'S.');
eq(A('VIA 20 SETTEMBRE'),['via','VIA',['20','SETTEMBRE']],'20 settembre');
eq(A('CAV.SORGENTE'),['via','CAVALCAVIA',['SORGENTE']],'cav.');
eq(A('POLICLINICO OSP.MAGGIORE'),['poi','ospedale',['POLICLINICO']],'policlinico');
eq(M.analizza('IST.ONCOLOGICO').alt,['TUMORI','ONCOLOGIA'],'ist oncologico: tumori o ieo');
eq(A('SOTTOPASS. NORDEST'),['via','SOTTOPASSO',['NORDEST']],'sottopasso');
eq(A('VIA ETTORE MAJORANA P.S.'),['via','VIA',['ETTORE','MAJORANA']],'p.s.');
eq(M.analizza('C.SO DI P.TA ROMANA').chiavi,['ROMANA'],'chiave sola rara');
eq(M.analizza('P.ZA SAN NAZARO IN BROLO').chiavi,['NAZARO','BROLO'],'due chiavi');

/* ── 2 · somiglianza dei nomi ── */
function P(t,n,r){return Math.round(M.punteggio(M.analizza(t),n,r)*100)/100;}
eq(P('P.ZA BUOZZI','Piazza Bruno Buozzi'),1.26,'buozzi');
eq(P('P.ZA 24 MAGGIO','Piazza XXIV Maggio'),1.3,'XXIV');
eq(P('P.LE 24 MAGGIO','Piazza XXIV Maggio'),1.1,'piazzale/piazza stessa famiglia');
vero(P('P.ZA SAN NAZZARRO IN BROLO','Piazza San Nazaro in Brolo')>1.2,'doppie');
eq(P('C.SO DI P.TA ROMANA','Corso di Porta Romana'),1.3,'porta romana');
vero(P('V.LE MOLIERE','Viale Molière')===1.3,'accento');
eq(P('VIA FRIULI 30','Via Friuli'),1.3,'friuli');
vero(P('FORO BONAPARTE PARI','Foro Buonaparte')>1,'buonaparte');
vero(P('P.LEGA LOMBARDA','Piazzale Lega Lombarda')>1,'lega lombarda');
eq(P('VIA ROMA','Via Romagna'),0,'roma non e romagna');
eq(P('V.LE ROMAGNA','Viale Romagna'),1.3,'romagna');
eq(P('VIA MARGHERIT','Via Santa Margherita'),1.15,'tagliata');
vero(P('STAZ. ROGOREDO','Milano Rogoredo')>0.9,'stazione rogoredo');
vero(P('STAZ. CENTRALE','Milano Centrale')>0.9,'stazione centrale');
vero(P('OSP. SAN CARLO','Ospedale San Carlo Borromeo')>0.9,'san carlo');
eq(P('VIA BENEFATTORI DELL\'OSPEDALE MAGGIO','Via Benefattori dell\'Ospedale'),0,'manca una parola: no');
vero(P('VIA BENEFATTORI DELL\'OSPEDALE MAGGIO','Via Benefattori dell\'Ospedale',true)>0.5,'manca una parola: si se rilassato');
eq(P('VIA CASSINI','Via Cassinis')>0,true,'cassini ~ cassinis');
vero(P('V.LE BELLISARIO','Viale Belisario')>1.2,'bellisario');
vero(P('L.GO CORCETTA','Largo Crocetta')>0.9,'corcetta');
eq(P('VIA PO','Via Pola'),0,'parole corte: niente prefisso');
vero(P('VIA CURIE','Via Curie')>P('VIA CURIE','Via Curiel'),'esatta meglio della simile');

/* ── 3 · le espressioni per cercare ── */
function R(ch,nome){return new RegExp(M.reChiavi(ch),'i').test(nome);}
vero(R(['NAZARO'],'Piazza San Nazaro in Brolo'),'re nazaro');
vero(R(['NAZZARRO'],'Piazza San Nazaro in Brolo'),'re nazzarro → nazaro');
vero(R(['MOLIERE'],'Viale Molière'),'re molière');
vero(R(['CITTA'],'Viale Città di Fiume'),'re città');
vero(R(['ANNUNZIO'],"Viale Gabriele D'Annunzio"),"re d'annunzio");
vero(R(['ANNUNZIO'],"Viale Gabriele D’Annunzio"),"re d’annunzio");
vero(!R(['LODI'],'Via Melodia'),'re: inizio parola');
vero(R(['BELLISARIO'],'Viale Belisario'),'re belisario');
vero(R(['ROMANA'],'Corso di Porta Romana'),'re romana');
vero(M.reChiavi(['A','B']).indexOf('"')<0,'niente virgolette');


eq(M.analizza('VIA DE AMICIS').chiavi,['AMICIS'],'DE non e una chiave');
eq(M.analizza("P.LE MEDAGLIE D'ORO").chiavi,['MEDAGLIE'],'seconda chiave corta no');
eq(M.analizza('V.LE DI .PTA VERCELLINA').req,['PORTA','VERCELLINA'],'.PTA');
vero(R(['OHM'],'Piazza Ohm'),'re ohm intera');
vero(!R(['OHM'],'Via Ohmann'),'re ohm non dentro altre');
vero(P('VIA DE AMICIS','Via Edmondo De Amicis')>1.2,'de amicis');

vero(P('P.LE STAZ. PORTA GENOVA','Piazzale Stazione Porta Genova')>1.2,'STAZ. dentro il nome');
eq(A('STAZ. ROGOREDO'),['poi','stazione',['ROGOREDO']],'stazione dopo STAZ->STAZIONE');
/* ── 3b · guardare vicino: inizio o fine della parola ── */
function B(ch,nome){return new RegExp(M.reBordi(ch),'i').test(nome);}
vero(B(['GIRADINO'],'Via Giardino'),'bordi giradino');
vero(B(['CORCETTA'],'Largo Crocetta'),'bordi corcetta');
vero(B(['GARIBLADI'],'Corso Garibaldi'),'bordi garibladi');
vero(B(['CITTA'],'Viale Città di Fiume'),'bordi città');
vero(!B(['CORCETTA'],'Via Dante'),'bordi: non tutto');
vero(B(['PO'],'Via Po'),'bordi corta');

/* ── 4 · elementi OSM → cose ── */
function linea(pts){return pts.map(function(p){return {lat:p[0],lon:p[1]};});}
var LL=function(x,y){return M.ll([x,y]);};
var els=[
{type:'way',id:1,tags:{highway:'primary',name:'Corso Lodi'},geometry:linea([LL(0,0),LL(500,0)])},
{type:'way',id:2,tags:{highway:'primary',name:'Corso Lodi'},geometry:linea([LL(500,0),LL(1000,0)])},
{type:'way',id:3,tags:{highway:'residential',name:'Corso Lodi'},geometry:linea([LL(9000,9000),LL(9300,9000)])},   /* omonima lontana */
{type:'node',id:4,lat:LL(1200,50)[0],lon:LL(1200,50)[1],tags:{railway:'station',name:'Milano Rogoredo'}}
];
var cose=M.elementiInCose(els);
eq(cose.filter(function(c){return c.via;}).length,2,'due Corso Lodi: uno intero e uno lontano');
eq(cose.filter(function(c){return !c.via;}).length,1,'una stazione');


var TAPPE=['P.ZA DUOMO','VIA MENGONI','LARGO SANTA MARGHERITA','VIA S.PROTASO','VIA PORRONE','VIA SAN PROSPERO','VIA DANTE',
'P.ZA CORDUSIO','VIA OREFICI','VIA MAZZINI','L.GO BORGES','VIA MAZZINI','P.ZA MISSORI','C.SO DI PORTA ROMANA',
'P.ZA SAN NAZZARRO IN BROLO','C.SO DI PORTA ROMANA','LARGO CROCETTA','C.SO DI PORTA ROMANA',"P.LE MEDAGLIE D'ORO",
'C.SO LODI','P.ZA BUOZZI','C.SO LODI','P.LE LODI','CAVALCAVIA SAN LUIGI','C.SO LODI','P.LE CORVETTO','VIA MARTINENGO',
'VIA BONCOMPAGNI','VIA TOFFETTI','P.ZA MISTRAL','VIA CASSINIS (STAZ.ROGOREDO)'];
var GIUSTE=['duomo','mengoni','margherita','protaso','porrone','prospero','dante','cordusio','orefici','mazzini','borges','mazzini',
'missori','romana','nazaro','romana','crocetta','romana','medaglie','lodi1','buozzi','lodi1','plodi','luigi','lodi2','corvetto',
'martinengo','boncompagni','toffetti','mistral','cassinis'];
function dSeg(p,a,b){var dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy,t=l?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));
var x=a[0]+t*dx-p[0],y=a[1]+t*dy-p[1];return Math.sqrt(x*x+y*y);}
function daVia(p,k){var L=F.dove(k);if(L.length===1)return M.dist(p,L[0]);var d=Infinity;for(var i=1;i<L.length;i++)d=Math.min(d,dSeg(p,L[i-1],L[i]));return d;}
function centro(k){var L=F.dove(k),x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;L.forEach(function(q){x0=Math.min(x0,q[0]);y0=Math.min(y0,q[1]);x1=Math.max(x1,q[0]);y1=Math.max(y1,q[1]);});return [(x0+x1)/2,(y0+y1)/2];}
function corri(tappe,senza,fissi){
var cose=M.elementiInCose(tutti(senza));
var passi=tappe.map(M.analizza);
var t0=Date.now();
var r=M.risolvi(passi,cose,fissi||null);
r.ms=Date.now()-t0;r.passi=passi;return r;
}
/* 1 · tutto c'e' */
var r=corri(TAPPE);
r.pos.forEach(function(p,i){
vero(p&&!p.q,'tappa '+i+' '+TAPPE[i]+' trovata'+(p?(p.q?' (?)':''):' (niente)'));
if(p){var g=F.G[GIUSTE[i]],tondo=g.tags&&g.tags.highway==='pedestrian';
var d=tondo?M.dist(M.xy(p.ll),centro(GIUSTE[i])):daVia(M.xy(p.ll),GIUSTE[i]);
vero(d<25,'tappa '+i+' '+TAPPE[i]+(tondo?' nel mezzo della piazza: ':' sulla via giusta: ')+Math.round(d)+' m');}
});
console.log('1 · tempo',r.ms,'ms');
/* le tre volte di Corso di Porta Romana: tre punti diversi, nell'ordine */
var pr=[13,15,17].map(function(i){return M.xy(r.pos[i].ll);});
vero(M.dist(pr[0],pr[1])>80&&M.dist(pr[1],pr[2])>80,'porta romana: tre marker distinti');
/* le piazze piccole: il marker al centro */
['duomo','missori','corvetto'].forEach(function(k){var i=GIUSTE.indexOf(k);var cc=centro(k),cx=cc[0],cy=cc[1];
vero(M.dist(M.xy(r.pos[i].ll),[cx,cy])<30,'piazza '+k+' al centro: '+Math.round(M.dist(M.xy(r.pos[i].ll),[cx,cy]))+' m');});
/* 2 · Via Porrone non c'e' sulla mappa: punto di domanda fra San Protaso e San Prospero */
var r2=corri(TAPPE,['porrone']);
vero(r2.pos[4]&&r2.pos[4].q===1,'porrone col punto di domanda');
if(r2.pos[4]){var a=M.xy(r2.pos[3].ll),b=M.xy(r2.pos[5].ll),c=M.xy(r2.pos[4].ll);
vero(M.dist(a,c)+M.dist(c,b)<M.dist(a,b)+5,'porrone fra le due vicine');}
r2.pos.forEach(function(p,i){if(i!==4)vero(p&&!p.q,'2 · tappa '+i+' trovata');});
/* 3 · una via che esiste solo lontano: punto di domanda, non la via lontana */
var T3=TAPPE.slice(0,13).concat(['VIA ZURIGO']).concat(TAPPE.slice(13));
var r3=corri(T3);
vero(r3.pos[13]&&r3.pos[13].q===1,'zurigo lontana: punto di domanda');
if(r3.pos[13])vero(daVia(M.xy(r3.pos[13].ll),'zurigo')>2000,'zurigo: non sulla via lontana');
/* 4 · un marker messo a mano resta dov'e' e aiuta le vicine */
var fisso=M.ll([400,-830]);
var fissi=[];fissi[13]=fisso;
var r4=corri(TAPPE,null,fissi);
vero(r4.scelta[13]===0&&r4.cand[13][0].fisso,'il marker a mano e la scelta');
vero(r4.pos[14]&&!r4.pos[14].q,'san nazaro dopo il marker a mano');
/* 5 · la stazione: quella dei treni, non la metropolitana */
var r5=corri(['VIA TOFFETTI','P.ZA MISTRAL','VIA CASSINIS','STAZ. ROGOREDO']);
vero(r5.pos[3]&&!r5.pos[3].q&&M.dist(M.xy(r5.pos[3].ll),F.dove('rogoredo')[0])<5,'stazione dei treni');
/* 6 · un errore nel libro (VIA OREFICE vicina, VIA OREFICI giusta): vince la giusta */
vero(daVia(M.xy(r.pos[8].ll),'orefici')<25,'orefici, non orefice');
/* 7 · tutte le tappe mancanti: niente marker (non si inventa nulla) */
var r7=corri(['VIA INESISTENTE','VIA ALTRA INESISTENTE']);
vero(!r7.pos[0]&&!r7.pos[1],'niente di trovato: niente marker');
/* 8 · la prima tappa manca: punto di domanda vicino alla seconda (al massimo 70 m per tappa) */
var r8=corri(['VIA INESISTENTE','VIA TOFFETTI','P.ZA MISTRAL','VIA CASSINIS']);
vero(r8.pos[0]&&r8.pos[0].q===1&&M.dist(M.xy(r8.pos[0].ll),M.xy(r8.pos[1].ll))<=75,'prima tappa: vicino alla seconda');

/* ── 9 · lo stesso giro passando dall'Overpass finto: le domande che fa l'app trovano quello che serve ── */
var BOX='45.36,9.02,45.58,9.32',LARGO='45.30,8.60,45.75,9.80';
var passi=TAPPE.map(M.analizza),chiavi={};
passi.forEach(function(p){(p.chiavi||[]).forEach(function(c){chiavi[c]=1;});});
var rv=M.reChiavi(Object.keys(chiavi));
var q='[out:json][timeout:120];(way["highway"]["name"~"'+rv+'",i]('+BOX+');way["place"="square"]["name"~"'+rv+'",i]('+BOX+');relation["place"="square"]["name"~"'+rv+'",i]('+BOX+'););out tags geom;';
var j=OP.rispondi(q,tutti());
vero(j.elements.length>=28&&j.elements.length<=40,'overpass finto: '+j.elements.length+' elementi');
vero(!j.elements.some(function(e){return e.tags.name==='Via Zurigo'||e.tags.name==='Ospedale San Fantasio';}),'overpass finto: solo i nomi chiesti');
var r9=M.risolvi(passi,M.elementiInCose(j.elements),null);
vero(r9.pos.every(function(p){return p&&!p.q;}),'dal finto: tutte trovate');
vero(r9.pos.every(function(p,i){return M.dist(M.xy(p.ll),M.xy(r.pos[i].ll))<1;}),'dal finto: stessi punti');
/* i punti d'interesse: ospedale, aeroporto (il terminal vicino, non quello lontano), un paese */
var qp='[out:json][timeout:120];(nwr["amenity"="hospital"]["name"~"'+M.reChiavi(['FANTASIO'])+'",i]('+LARGO+');nwr["aeroway"="aerodrome"]["name"~"'+M.reChiavi(['LINATE'])+'",i]('+LARGO+');nwr["aeroway"="terminal"]('+LARGO+');node["place"~"^(city|town|village|suburb|quarter|neighbourhood|hamlet)$"]["name"~"'+M.reChiavi(['BARANZATE'])+'",i]('+LARGO+'););out tags center;';
var jp=OP.rispondi(qp,tutti());
var q2='[out:json][timeout:120];(way["highway"]["name"~"'+M.reChiavi(['FANTASIA','FORLANINI'])+'",i]('+BOX+'););out tags geom;';
var jv=OP.rispondi(q2,tutti());
var tutte=M.elementiInCose(jv.elements.concat(jp.elements.map(function(e){if(!e.tags.name&&e.tags.aeroway==='terminal')e.tags.name='Terminal';return e;})));
var r10=M.risolvi(['VIA FANTASIA','OSP. SAN FANTASIO','VIA FANTASIA','V.LE FORLANINI','AEROPORTO DI LINATE'].map(M.analizza),tutte,null);
vero(r10.pos[1]&&!r10.pos[1].q&&M.dist(M.xy(r10.pos[1].ll),[3200,2060])<40,'ospedale');
vero(r10.pos[4]&&!r10.pos[4].q&&M.dist(M.xy(r10.pos[4].ll),[6100,1150])<40,'aeroporto: il suo terminal');
var r11=M.risolvi(['BARANZATE'].map(M.analizza),tutte.concat(M.elementiInCose(jp.elements)),null);
vero(r11.pos[0]&&r11.pos[0].q===1,'un paese da solo: col punto di domanda (la piazza del paese non e\' la strada)');
/* una piazza che sulla mappa e' solo un punto: il marker e' quel punto */
var qs='[out:json][timeout:120];(way["highway"]["name"~"'+M.reChiavi(['LEVANTE','PONENTE','TRAMONTANA'])+'",i]('+BOX+');node["place"="square"]["name"~"'+M.reChiavi(['LEVANTE','PONENTE','TRAMONTANA'])+'",i]('+BOX+'););out tags geom;';
var js=OP.rispondi(qs,tutti());
vero(js.elements.length===3,'piazza punto: '+js.elements.length+' elementi');
var r12=M.risolvi(['VIA LEVANTE','P.ZA PONENTE','VIA TRAMONTANA'].map(M.analizza),M.elementiInCose(js.elements),null);
vero(r12.pos[1]&&!r12.pos[1].q&&M.dist(M.xy(r12.pos[1].ll),[1200,1000])<3,'piazza punto: il marker sul punto');
/* ── 10 · le tappe vere del libro: la lettura non si perde nulla per strada ── */
global.window=global.window||{};require('../percorsi-data.js');
var D=global.window.__PERCORSI_PDF__,conta={},vuote=0;
D.forEach(function(p){p.s.forEach(function(s){var a=M.analizza(s);conta[a.k]=(conta[a.k]||0)+1;if(a.k!=='salta'&&!(a.chiavi||a.a.chiavi||[]).length)vuote++;});});
console.log('le tappe del libro:',JSON.stringify(conta));
vero(conta.via>5000&&(conta.salta||0)<150,'quasi tutte le tappe sono vie da cercare');
eq(vuote,0,'ogni tappa da cercare ha una chiave');

console.log('\nprove: '+ok+' ok, '+ko+' sbagliate');
if(ko)process.exit(1);
