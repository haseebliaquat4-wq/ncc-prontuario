/* IL CLOUD (v146), con un cloud finto condiviso (stesse chiamate di Firebase), a tempo reale.
   · il PC resta sulla Home senza essere toccato: quello che fai sull'iPhone arriva da solo
     entro un minuto (prima restava fermo finche' non toccavi la finestra)
   · il nome: sul PC «Thomas» (scelto prima che viaggiasse), l'iPhone non ne ha: lo prende;
     poi lo cambio sull'iPhone e sul PC arriva il nuovo (vale l'ultimo scelto)
   · Profilo › «Aggiorna dal cloud»: c'e', dice l'ora, aggiorna e lo dice */
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

const saluto=D=>D.p.evaluate(()=>(document.querySelector('#hmNew .hm-ciao')||{}).textContent||'');
(async()=>{
  const b=await launch();const s=seed();
  const oggi=Date.now();
  const base={ob1:'true',antiFretta:'false',wkRepTs:String(oggi),azzerato2026:String(oggi),qtStats:JSON.stringify({cat:{},err:{},seenIds:{},idV:2})};
  /* ── il PC: ha i percorsi e il nome «Thomas» di prima (senza ora) ── */
  const A=await dispositivo(b,'PC',{width:1280,height:800},Object.assign({routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords),nomeUtente:'Thomas'},base));
  await A.p.evaluate(()=>{save();autoSave();});await A.p.waitForTimeout(9000);
  console.log('PC: saluto «'+await saluto(A)+'» | nel cloud il nome:',JSON.stringify(leggi('prontuario/prefs/ncc/nomeUtente')));
  ok(leggi('prontuario/prefs/ncc/nomeUtente')==='Thomas','il nome del PC non arriva nel cloud');
  /* ── l'iPhone, nuovo: prende il nome ── */
  const B=await dispositivo(b,'iPhone',{width:390,height:844},base);await B.p.waitForTimeout(3000);
  const sB=await saluto(B);console.log('iPhone: saluto «'+sB+'»');ok(/Thomas$/.test(sB),'l’iPhone non prende il nome dal cloud: «'+sB+'»');
  /* ── 1 · il PC fermo sulla Home: il quiz fatto sull'iPhone arriva da solo ── */
  const t0=Date.now();
  await B.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'q\'"]').click());await B.p.waitForTimeout(1500);
  for(let k=0;k<5;k++){await B.p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await B.p.waitForTimeout(1300);}
  await B.p.evaluate(()=>document.querySelector('.qrun-x').click());await B.p.waitForTimeout(400);
  await B.p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');b&&b.click();});await B.p.waitForTimeout(1200);
  const rB=await riga(B,'q');console.log('iPhone: quiz',rB.s);
  let rA=null,quando=0;
  for(let k=0;k<45;k++){await A.p.waitForTimeout(2000);rA=await riga(A,'q');if(rA&&rA.s===rB.s){quando=Math.round((Date.now()-t0)/1000);break;}}
  console.log('PC senza tocchi: quiz «'+(rA&&rA.s)+'»',quando?('arrivato dopo '+quando+' s'):'NON arrivato');
  ok(rB.s==='Primo quiz: 5 di 30'&&rA&&rA.s===rB.s,'il PC fermo sulla Home non si aggiorna da solo ('+(rA&&rA.s)+' invece di '+rB.s+')');
  /* ── 2 · il nome cambiato sull'iPhone arriva sul PC ── */
  await B.p.evaluate(()=>nccPfNome());await B.p.waitForTimeout(600);
  await B.p.fill('#nmIn','Haseeb');await B.p.evaluate(()=>document.querySelector('#popOv .pop-b[data-i="0"]').click());await B.p.waitForTimeout(800);
  const sB2=await saluto(B);const t1=Date.now();let sA='';
  for(let k=0;k<45;k++){await A.p.waitForTimeout(2000);sA=await saluto(A);if(/Haseeb$/.test(sA))break;}
  console.log('nome cambiato sull’iPhone: «'+sB2+'» | sul PC «'+sA+'» dopo',Math.round((Date.now()-t1)/1000),'s');
  ok(/Haseeb$/.test(sB2)&&/Haseeb$/.test(sA),'il nome nuovo non arriva sul PC: «'+sA+'»');
  /* ── 3 · Profilo › Aggiorna dal cloud ── */
  await A.p.evaluate(()=>nccProfilo());await A.p.waitForTimeout(900);
  const riga0=await A.p.evaluate(()=>{const r=[...document.querySelectorAll('#pfOv .pf-r')].find(x=>/Aggiorna dal cloud/.test(x.textContent));return r?{t:r.textContent.replace(/\s+/g,' ').trim(),d:(r.querySelector('.pf-d')||{}).textContent||''}:null;});
  await A.p.evaluate(()=>[...document.querySelectorAll('#pfOv .pf-r')].find(x=>/Aggiorna dal cloud/.test(x.textContent)).click());
  const toast=[];for(let k=0;k<20;k++){await A.p.waitForTimeout(200);const ts=await A.p.evaluate(()=>[...document.querySelectorAll('#toastStack .toastN')].map(e=>e.textContent));ts.forEach(x=>{if(!toast.includes(x))toast.push(x);});}
  const tk=await A.p.evaluate(()=>[...document.querySelectorAll('#pfOv .pf-r')].filter(x=>/Comandi da tastiera/.test(x.textContent)).length);
  console.log('Profilo: riga «'+(riga0&&riga0.t)+'» | avvisi',toast.join(' → '),'| riga dei comandi',tk);
  ok(riga0&&/^oggi \d\d:\d\d$/.test(riga0.d),'Profilo: la riga «Aggiorna dal cloud» non dice l’ora '+JSON.stringify(riga0));
  ok(toast.some(t=>/Aggiornato dal cloud/.test(t)),'Aggiorna dal cloud: nessun avviso '+toast.join(' → '));
  ok(tk===1,'Profilo: manca la riga «Comandi da tastiera»');
  A.errs.concat(B.errs).forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
