/* I MARKER SPOSTATI (v147): vince l'ultimo spostamento, con un cloud finto condiviso, a tempo reale.
   · l'iPad sposta un marker di un percorso e la piazza, e mette a mano un marker nuovo: nel cloud arrivano con l'ora
   · l'iPhone, rimasto indietro, fa il salvataggio veloce (fine quiz, app chiusa): non rimette nel cloud
     la sua copia vecchia (marker, percorsi, preferenze), manda solo quello che ha cambiato lui
   · l'iPhone, con piu' risposte (la sua copia "vince"), salva tutto: i marker spostati o messi sull'iPad
     NON tornano indietro e non spariscono, anzi arrivano anche sull'iPhone
   · lo stesso marker spostato su tutti e due, prima sull'iPad e poi sull'iPhone: vince l'iPhone, ovunque
   · spostato e app chiusa subito (prima del salvataggio): il marker arriva lo stesso, da solo
   · una piazza messa sulla sua mappa (viaggia a parte): il salvataggio completo dell'altro non la cancella
   · una copia vecchia rimette la piazza di prima nel cloud: tornando sull'iPad il cloud si rimette a posto
   · l'iPhone rimasto indietro si chiude (pagehide) e si riapre: niente copia vecchia nel cloud, il marker giusto arriva
   · nessun marker nuovo messo da solo */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
/* ── il cloud: un albero in memoria, come il Realtime Database (i nodi vuoti spariscono) ── */
const DB={};
const parti=p=>String(p||'').split('/').filter(Boolean);
function leggi(p){let o=DB;for(const k of parti(p)){if(o==null||typeof o!=='object')return null;o=o[k];}return o===undefined?null:JSON.parse(JSON.stringify(o));}
function pulisci(v){if(v===null||v===undefined)return null;if(Array.isArray(v)){const a=v.map(pulisci);return a.length?a:null;}
  if(typeof v==='object'){const o={};Object.keys(v).forEach(k=>{const x=pulisci(v[k]);if(x!==null)o[k]=x;});return Object.keys(o).length?o:null;}return v;}
function scrivi(p,v){const ks=parti(p);v=pulisci(v);if(!ks.length){Object.keys(DB).forEach(k=>delete DB[k]);if(v)Object.assign(DB,v);return;}
  let o=DB;for(let i=0;i<ks.length-1;i++){if(!o[ks[i]]||typeof o[ks[i]]!=='object')o[ks[i]]={};o=o[ks[i]];}
  if(v===null)delete o[ks[ks.length-1]];else o[ks[ks.length-1]]=v;}
let scritture=0;
const FB=`(function(){
function Ref(p){this.path=p||'';}
Ref.prototype.child=function(c){return new Ref(this.path+'/'+c);};
Ref.prototype.once=function(ev,cb,err){return window.__fbGet(this.path).then(function(v){var s={val:function(){return v;},exportVal:function(){return v;},exists:function(){return v!=null;}};
  if(typeof cb==='function')cb(s);return s;},function(e){if(typeof err==='function')err(e);});};
Ref.prototype.set=function(v){return window.__fbSet(this.path,v===undefined?null:JSON.parse(JSON.stringify(v)));};
Ref.prototype.update=function(o){return window.__fbUpdate(this.path,JSON.parse(JSON.stringify(o)));};
Ref.prototype.remove=function(){return window.__fbSet(this.path,null);};
Ref.prototype.on=function(){};Ref.prototype.off=function(){};
var db=function(){return {ref:function(p){return new Ref(p);}};};db.Reference=Ref;db.Query=Ref;
window.firebase={apps:[],initializeApp:function(){this.apps.push({});return {};},database:db};})();`;
async function dispositivo(b,nome,vp,dati){
  const ctx=await b.newContext({viewport:vp,serviceWorkers:'block',hasTouch:true,isMobile:vp.width<700,timezoneId:'Europe/Rome'});
  await ctx.exposeFunction('__fbGet',p=>leggi(p));
  await ctx.exposeFunction('__fbSet',(p,v)=>{scritture++;scrivi(p,v);return true;});
  await ctx.exposeFunction('__fbUpdate',(p,o)=>{scritture++;Object.keys(o||{}).forEach(k=>scrivi(p+'/'+k,o[k]));return true;});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase-app/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:FB});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(nome+': '+e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(6500);
  return {nome,ctx,p,errs,aperto:Date.now(),fuoco:0};
}
/* torno sull'app: l'evento vero (focus); il controllo del cloud intero parte al massimo ogni 20 s */
async function torna(D){const att=Math.max(0,21000-(Date.now()-D.aperto),21000-(Date.now()-D.fuoco));if(att)await D.p.waitForTimeout(att);
  await D.p.evaluate(()=>window.dispatchEvent(new Event('focus')));D.fuoco=Date.now();await D.p.waitForTimeout(3500);}
const riga=(D,k)=>D.p.evaluate(k=>{const e=document.querySelector('#hmOggi .og-r[onclick*="\''+k+'\'"]');
  return e?{n:(e.querySelector('.og-n')||{}).textContent||'',s:(e.querySelector('.og-t span')||{}).textContent||'',ok:e.classList.contains('ok')}:null;},k);

const pz=(D,id)=>D.p.evaluate(id=>{const c=JSON.parse(localStorage.getItem('pzCoords')||'{}');return c[id]||null;},id);
const mk=(D,k)=>D.p.evaluate(k=>coords[k]||null,k);
async function rispondi(D,n){
  await D.p.evaluate(()=>{window.__nccQuizOrigine='home';nccAvvio(function(){buildQuiz();qStartNew();});});await D.p.waitForTimeout(1600);
  for(let k=0;k<n;k++){await D.p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await D.p.waitForTimeout(1300);}
  await D.p.evaluate(()=>document.querySelector('.qrun-x').click());await D.p.waitForTimeout(400);
  await D.p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');b&&b.click();});await D.p.waitForTimeout(1000);
}
(async()=>{
  const b=await launch();const s=seed();
  const oggi=Date.now();
  const base={ob1:'true',antiFretta:'false',wkRepTs:String(oggi),azzerato2026:String(oggi),qtStats:JSON.stringify({cat:{},err:{},seenIds:{},idV:2})};
  /* ── l'iPad: percorsi con i marker e due piazze complete; le manda al cloud ── */
  const A=await dispositivo(b,'iPad',{width:1180,height:820},Object.assign({routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords)},base));
  const PZ=await A.p.evaluate(()=>{const T=pzTutte().filter(q=>q.v&&q.v.length).slice(0,2),co={};T.forEach((q,k)=>{co[q.id]={lat:45.46+k/200,lon:9.19};q.v.forEach((v,i)=>co[q.id+'_'+i]={lat:45.46+k/200+i/2000,lon:9.19+i/2000});});
    localStorage.setItem('pzCoords',JSON.stringify(co));save();autoSave();return T.map(q=>q.id);});
  await A.p.waitForTimeout(9000);
  const B=await dispositivo(b,'iPhone',{width:390,height:844},base);await B.p.waitForTimeout(3000);
  const nB0=await B.p.evaluate(()=>Object.keys(coords).length),nA0=await A.p.evaluate(()=>Object.keys(coords).length);
  console.log('all’inizio: marker iPad',nA0,'iPhone',nB0,'| piazza',PZ[0],JSON.stringify(await pz(B,PZ[0])));
  ok(nA0===nB0&&nA0>0,'all’inizio i marker non sono gli stessi');
  /* ── 1 · l'iPad sposta un marker del percorso e la piazza, e mette a mano un marker nuovo ── */
  const titoloB=await B.p.evaluate(()=>routes.find(r=>r.id==='r4').title);
  await A.p.evaluate(id=>{coords['r1_2']={lat:45.5,lon:9.2};coords['r1_3']={lat:45.4655,lon:9.1781};
    routes.find(r=>r.id==='r4').title='DUE TAPPE CORRETTO';save();autoSave();
    const c=JSON.parse(localStorage.getItem('pzCoords'));c[id]={lat:45.51,lon:9.21};localStorage.setItem('pzCoords',JSON.stringify(c));},PZ[0]);
  await A.p.waitForTimeout(9000);
  const cr=leggi('prontuario/coords/r1_2'),cn=leggi('prontuario/coords/r1_3'),cz=JSON.parse(leggi('prontuario/prefs/ncc/pzCoords')||'{}')[PZ[0]];
  console.log('iPad sposta: nel cloud r1_2',JSON.stringify(cr),'| nuovo r1_3',JSON.stringify(cn),'| piazza',JSON.stringify(cz));
  ok(cr&&cr.lat===45.5&&cr.t>0&&cz&&cz.lat===45.51&&cz.t>0,'lo spostamento dell’iPad non arriva nel cloud con l’ora');
  ok(cn&&cn.t>0,'il marker messo a mano sull’iPad non arriva nel cloud con l’ora');
  /* ── 2 · l'iPhone, rimasto indietro, fa il salvataggio veloce con tutto "da mandare" ── */
  const ts2=leggi('prontuario/ts');
  await B.p.evaluate(()=>{markDirty('routes','coords','qStats','done','prefs');flushNow();});
  await B.p.waitForTimeout(1500);
  const f2={r12:(leggi('prontuario/coords/r1_2')||{}).lat,r13:!!leggi('prontuario/coords/r1_3'),
    tit:(leggi('prontuario/routes')||[]).map(r=>r&&r.id==='r4'?r.title:null).filter(Boolean)[0],
    pz:(JSON.parse(leggi('prontuario/prefs/ncc/pzCoords')||'{}')[PZ[0]]||{}).lat,ts:leggi('prontuario/ts')===ts2?'uguale':'cambiata'};
  console.log('salvataggio veloce dell’iPhone indietro:',JSON.stringify(f2),'(titolo sull’iPhone:',titoloB+')');
  ok(f2.r12===45.5&&f2.r13&&f2.tit==='DUE TAPPE CORRETTO'&&f2.pz===45.51,'il salvataggio veloce dell’iPhone rimette la sua copia vecchia '+JSON.stringify(f2));
  /* ── 3 · l'iPhone, indietro e con piu' risposte, salva tutto: i marker spostati non tornano ── */
  await rispondi(B,3);await B.p.waitForTimeout(10000);
  const cr2=leggi('prontuario/coords/r1_2'),cn2=leggi('prontuario/coords/r1_3'),cz2=JSON.parse(leggi('prontuario/prefs/ncc/pzCoords')||'{}')[PZ[0]];
  const bR=await mk(B,'r1_2'),bN=await mk(B,'r1_3'),bP=await pz(B,PZ[0]);
  console.log('iPhone salva: cloud r1_2',cr2&&cr2.lat,'r1_3',cn2&&cn2.lat,'piazza',cz2&&cz2.lat,'| sull’iPhone r1_2',bR&&bR.lat,'r1_3',bN&&bN.lat,'piazza',bP&&bP.lat);
  ok(cr2&&cr2.lat===45.5&&cz2&&cz2.lat===45.51,'l’iPhone ha rimesso i marker vecchi nel cloud');
  ok(cn2&&cn2.lat===45.4655,'il marker messo a mano sull’iPad e’ sparito dal cloud');
  ok(bR&&bR.lat===45.5&&bP&&bP.lat===45.51&&bN&&bN.lat===45.4655,'i marker dell’iPad non sono arrivati sull’iPhone');
  /* ── 4 · lo stesso marker spostato su tutti e due: vince l'ultimo (l'iPhone) ── */
  await A.p.evaluate(()=>{coords['r2_1']={lat:45.601,lon:9.301};save();autoSave();});
  await A.p.waitForTimeout(2500);
  await B.p.evaluate(()=>{coords['r2_1']={lat:45.602,lon:9.302};save();autoSave();});
  await A.p.waitForTimeout(9000);
  await torna(A);await torna(B);
  const a3=await mk(A,'r2_1'),b3=await mk(B,'r2_1'),c3=leggi('prontuario/coords/r2_1');
  console.log('spostato su tutti e due: iPad',a3&&a3.lat,'| iPhone',b3&&b3.lat,'| cloud',c3&&c3.lat);
  ok(a3&&b3&&c3&&a3.lat===45.602&&b3.lat===45.602&&c3.lat===45.602,'lo spostamento piu’ recente non vince ovunque');
  /* ── 5 · spostato e app chiusa subito, prima del salvataggio (4 s): parte da solo ── */
  await A.p.evaluate(()=>{coords['r2_2']={lat:45.4911,lon:9.2311};save();autoSave();
    Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>'hidden'});
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    document.dispatchEvent(new Event('visibilitychange'));});
  await A.p.waitForTimeout(1200);
  const c5=leggi('prontuario/coords/r2_2');
  console.log('spostato e app chiusa subito: nel cloud dopo 1,2 s',JSON.stringify(c5));
  ok(c5&&c5.lat===45.4911&&c5.t>0,'spostato e chiuso subito: il marker non arriva nel cloud');
  await A.p.evaluate(()=>{delete document.visibilityState;delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await A.p.waitForTimeout(8000);
  /* ── 6 · una piazza messa sulla sua mappa (viaggia a parte, l'ora del cloud non cambia):
         il salvataggio completo dell'iPhone, per cui il cloud "non e' cambiato", non la cancella ── */
  await torna(B);
  await A.p.evaluate(id=>{const c=JSON.parse(localStorage.getItem('pzCoords'));c[id]={lat:45.52,lon:9.22};localStorage.setItem('pzCoords',JSON.stringify(c));},PZ[1]);
  await A.p.waitForTimeout(6000);
  const cz6a=(JSON.parse(leggi('prontuario/prefs/ncc/pzCoords')||'{}')[PZ[1]]||{}).lat;
  await B.p.evaluate(()=>{coords['r2_3']={lat:45.4871,lon:9.2391};save();autoSave();});
  await B.p.waitForTimeout(9000);
  const cz6=(JSON.parse(leggi('prontuario/prefs/ncc/pzCoords')||'{}')[PZ[1]]||{}).lat,b6=await pz(B,PZ[1]);
  console.log('piazza messa sulla sua mappa: nel cloud',cz6a,'→ dopo il salvataggio dell’iPhone',cz6,'| sull’iPhone',b6&&b6.lat);
  ok(cz6a===45.52&&cz6===45.52&&b6&&b6.lat===45.52,'la piazza messa sull’iPad sparisce col salvataggio dell’iPhone');
  /* ── 7 · una copia vecchia (per esempio l'app non aggiornata) rimette nel cloud la piazza di prima,
         senza cambiare l'ora del cloud: rientrando sull'iPad il cloud si rimette a posto da solo,
         con la sola piazza (niente salvataggio completo) ── */
  await torna(A);await A.p.waitForTimeout(6000);            /* l'iPad in pari col cloud */
  const vecchia=JSON.parse(leggi('prontuario/prefs/ncc/pzCoords'));vecchia[PZ[1]]={lat:45.46,lon:9.19};
  const ts7=leggi('prontuario/ts');scrivi('prontuario/prefs/ncc/pzCoords',JSON.stringify(vecchia));
  await torna(A);await A.p.waitForTimeout(5000);
  const cz7=(JSON.parse(leggi('prontuario/prefs/ncc/pzCoords')||'{}')[PZ[1]]||{}).lat,a7=await pz(A,PZ[1]);
  console.log('copia vecchia nel cloud: rientrando sull’iPad il cloud torna a',cz7,'| sull’iPad',a7&&a7.lat,'| ora del cloud',leggi('prontuario/ts')===ts7?'uguale (solo la piazza)':'cambiata');
  ok(cz7===45.52&&a7&&a7.lat===45.52,'il cloud non si rimette a posto: '+cz7);
  /* ── 7b · l'iPhone rimasto indietro si chiude (pagehide: il salvataggio veloce con tutto "da mandare") e si
          riapre: nel cloud non torna la sua copia vecchia e, riaperto, ha il marker spostato sull'iPad ── */
  await A.p.evaluate(()=>{coords['r2_4']={lat:45.4801,lon:9.2271};save();autoSave();});
  await A.p.waitForTimeout(9000);
  await B.p.evaluate(()=>{markDirty('routes','coords','qStats','done','prefs');window.dispatchEvent(new Event('pagehide'));});
  await B.p.waitForTimeout(1500);
  const c7b=leggi('prontuario/coords/r2_4');
  console.log('iPhone indietro chiuso: nel cloud r2_4',JSON.stringify(c7b));
  ok(c7b&&c7b.lat===45.4801,'chiudendo l’iPhone rimasto indietro il marker spostato sull’iPad torna com’era: '+JSON.stringify(c7b));
  await B.p.reload();await B.p.waitForTimeout(9000);
  const b7b=await mk(B,'r2_4');
  console.log('iPhone riaperto: r2_4',JSON.stringify(b7b));
  ok(b7b&&b7b.lat===45.4801,'riaperto, l’iPhone non ha il marker spostato sull’iPad: '+JSON.stringify(b7b));
  /* ── 8 · nessun marker nuovo messo da solo: solo quello messo a mano ── */
  const nA=await A.p.evaluate(()=>Object.keys(coords).length),nB=await B.p.evaluate(()=>Object.keys(coords).length);
  console.log('marker alla fine: iPad',nA,'| iPhone',nB,'(all’inizio',nA0,'+ 1 messo a mano)');
  ok(nA===nA0+1&&nB===nA0+1,'i marker sono cambiati di numero');
  A.errs.concat(B.errs).forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
