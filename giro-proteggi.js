/* 🔒 PROTEGGI I DATI (v147), con un cloud finto che ha le regole di Firebase e un accesso finto
   (stesse chiamate di Firebase: createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut).
   · Profilo › «Proteggi i dati»: dice «non attiva»; i tre passi, email e password
   · errori nel riquadro, senza riscrivere niente: email non valida, password corta,
     Email/password non attivata nella console, email gia' usata, password sbagliata
   · «Crea l'accesso» sull'iPhone, «Entra» sull'iPad: la riga dice «attiva»
   · le regole pronte col codice (UID) per i tre rami, «Copia le regole» le copia davvero
   · regole pubblicate: iPhone e iPad (entrati) si passano i dati; il PC (non entrato) lo dice
     una volta sola, «Entra adesso» apre il riquadro, e non scrive niente nel cloud
   · riaprendo l'app l'accesso resta; «Esci dall'accesso» (con la conferma) lo toglie */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
/* ── il cloud: un albero in memoria, con le regole ── */
const DB={};let REGOLE=null;         /* null = aperto a tutti (come oggi); altrimenti l'UID che puo' */
const parti=p=>String(p||'').split('/').filter(Boolean);
function leggi(p){let o=DB;for(const k of parti(p)){if(o==null||typeof o!=='object')return null;o=o[k];}return o===undefined?null:JSON.parse(JSON.stringify(o));}
function pulisci(v){if(v===null||v===undefined)return null;if(Array.isArray(v)){const a=v.map(pulisci);return a.length?a:null;}
  if(typeof v==='object'){const o={};Object.keys(v).forEach(k=>{const x=pulisci(v[k]);if(x!==null)o[k]=x;});return Object.keys(o).length?o:null;}return v;}
function scrivi(p,v){const ks=parti(p);v=pulisci(v);if(!ks.length){Object.keys(DB).forEach(k=>delete DB[k]);if(v)Object.assign(DB,v);return;}
  let o=DB;for(let i=0;i<ks.length-1;i++){if(!o[ks[i]]||typeof o[ks[i]]!=='object')o[ks[i]]={};o=o[ks[i]];}
  if(v===null)delete o[ks[ks.length-1]];else o[ks[ks.length-1]]=v;}
const nega={};                       /* scritture e letture rifiutate, per dispositivo */
function puo(uid){return REGOLE===null||(!!uid&&uid===REGOLE);}
const FB=`(function(){
function uid(){try{return window.__authUid?window.__authUid():null;}catch(e){return null;}}
function no(e){var x=new Error(String(e&&e.message||e));x.code=/PERMISSION_DENIED/.test(x.message)?'PERMISSION_DENIED':'';return x;}
function Ref(p){this.path=p||'';}
Ref.prototype.child=function(c){return new Ref(this.path+'/'+c);};
Ref.prototype.once=function(ev,cb,err){return window.__fbGet(this.path,uid()).then(function(v){var s={val:function(){return v;},exportVal:function(){return v;},exists:function(){return v!=null;}};
  if(typeof cb==='function')cb(s);return s;},function(e){if(typeof err==='function')err(no(e));});};
Ref.prototype.set=function(v){return window.__fbSet(this.path,v===undefined?null:JSON.parse(JSON.stringify(v)),uid()).catch(function(e){throw no(e);});};
Ref.prototype.update=function(o){return window.__fbUpdate(this.path,JSON.parse(JSON.stringify(o)),uid()).catch(function(e){throw no(e);});};
Ref.prototype.remove=function(){return this.set(null);};
Ref.prototype.on=function(){};Ref.prototype.off=function(){};
var db=function(){return {ref:function(p){return new Ref(p);}};};db.Reference=Ref;db.Query=Ref;
window.firebase={apps:[],initializeApp:function(){this.apps.push({});return {};},database:db};})();`;
/* ── l'accesso finto: resta salvato sul dispositivo come quello vero ── */
const AUTH=`(function(){
if(!window.firebase)return;
var cur=null,subs=[];try{cur=JSON.parse(localStorage.getItem('__mockAuth')||'null');}catch(e){}
window.__authUid=function(){return cur&&cur.uid;};
function avvisa(){subs.forEach(function(f){try{f(cur);}catch(e){}});}
function entra(r,email){if(r&&r.err){var e=new Error('Firebase: Error ('+r.err+').');e.code=r.err;throw e;}
  cur={uid:r.uid,email:email};localStorage.setItem('__mockAuth',JSON.stringify(cur));avvisa();return {user:cur};}
var A={onAuthStateChanged:function(f){subs.push(f);setTimeout(function(){f(cur);},40);return function(){};},
  createUserWithEmailAndPassword:function(e,p){return window.__authCrea(e,p).then(function(r){return entra(r,e);});},
  signInWithEmailAndPassword:function(e,p){return window.__authEntra(e,p).then(function(r){return entra(r,e);});},
  signOut:function(){cur=null;localStorage.removeItem('__mockAuth');avvisa();return Promise.resolve();}};
Object.defineProperty(A,'currentUser',{get:function(){return cur;}});
window.firebase.auth=function(){return A;};})();`;
let EMAIL_ATTIVA=false,nUid=0;const UTENTI={};let authCaricato=0,authLento=0;
async function dispositivo(b,nome,vp,dati){
  const ctx=await b.newContext({viewport:vp,serviceWorkers:'block',hasTouch:true,isMobile:vp.width<700,timezoneId:'Europe/Rome'});
  nega[nome]=0;
  await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:BASE.replace(/\/$/,'')});
  await ctx.exposeFunction('__fbGet',(p,uid)=>{if(!puo(uid)){nega[nome]++;throw new Error('PERMISSION_DENIED: Permission denied');}return leggi(p);});
  await ctx.exposeFunction('__fbSet',(p,v,uid)=>{if(!puo(uid)){nega[nome]++;throw new Error('PERMISSION_DENIED: Permission denied');}scrivi(p,v);return true;});
  await ctx.exposeFunction('__fbUpdate',(p,o,uid)=>{if(!puo(uid)){nega[nome]++;throw new Error('PERMISSION_DENIED: Permission denied');}Object.keys(o||{}).forEach(k=>scrivi(p+'/'+k,o[k]));return true;});
  const rete=()=>new Promise(r=>setTimeout(r,700));   /* Firebase risponde dopo un attimo */
  await ctx.exposeFunction('__authCrea',async(e,p)=>{await rete();if(!EMAIL_ATTIVA)return {err:'auth/operation-not-allowed'};if(UTENTI[e])return {err:'auth/email-already-in-use'};
    if(String(p).length<6)return {err:'auth/weak-password'};UTENTI[e]={p,uid:'Uk'+(++nUid)+'q7ZtR2xW'};return {uid:UTENTI[e].uid};});
  await ctx.exposeFunction('__authEntra',async(e,p)=>{await rete();if(!EMAIL_ATTIVA)return {err:'auth/operation-not-allowed'};const u=UTENTI[e];if(!u||u.p!==p)return {err:'auth/invalid-credential'};return {uid:u.uid};});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase-auth/.test(u)){authCaricato++;const d=authLento;return new Promise(ok=>setTimeout(ok,d)).then(()=>r.fulfill({status:200,contentType:'application/javascript',body:AUTH}));}
    if(/firebase-app/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:FB});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>{const m=e.message||'';if(!/PERMISSION_DENIED/.test(m))errs.push(nome+': '+m);});
  await p.goto(BASE+'index.html');await p.waitForTimeout(6500);
  return {nome,ctx,p,errs};
}
const popup=D=>D.p.evaluate(()=>{const v=document.getElementById('popOv');if(!v)return null;
  return {t:(v.querySelector('.pop-t')||{}).textContent||'',x:(v.querySelector('.pop-x')||{}).textContent||'',
    err:(v.querySelector('#auErr')||{}).textContent||'',ko:[...v.querySelectorAll('.es-in.ko')].map(i=>i.id),
    b:[...v.querySelectorAll('.pop-b')].map(b=>b.textContent),reg:(v.querySelector('.au-reg')||{}).value||'',
    em:(v.querySelector('#auEm')||{}).value,pw:(v.querySelector('#auPw')||{}).value};});
const tocca=(D,testo)=>D.p.evaluate(t=>{const b=[...document.querySelectorAll('#popOv .pop-b')].find(x=>x.textContent===t);if(!b)return false;b.click();return true;},testo);
const riga=D=>D.p.evaluate(()=>{const r=document.querySelector('#pfOv .pf-r[onclick*="nccProteggi"]');return r?(r.querySelector('.pf-d')||{}).textContent:null;});
async function profilo(D){await D.p.evaluate(()=>{try{nccProfiloChiudi(true);}catch(e){}nccProfilo();});await D.p.waitForTimeout(700);}
async function scrivoEProvo(D,em,pw,tasto,aspetta){
  await D.p.fill('#auEm',em);await D.p.fill('#auPw',pw);await tocca(D,tasto);await D.p.waitForTimeout(aspetta||900);return popup(D);}
(async()=>{
  const b=await launch();const s=seed();const oggi=Date.now();
  const base={ob1:'true',antiFretta:'false',wkRepTs:String(oggi),azzerato2026:String(oggi),qtStats:JSON.stringify({cat:{},err:{},seenIds:{},idV:2})};
  const A=await dispositivo(b,'iPhone',{width:390,height:844},Object.assign({routes:JSON.stringify(s.routes),coords:JSON.stringify(s.coords)},base));
  await A.p.evaluate(()=>{save();autoSave();});await A.p.waitForTimeout(6000);
  ok(authCaricato===0,'il pezzo di Firebase per l’accesso si carica anche se non lo usi');
  /* ── 1 · Profilo: la riga e il riquadro ── */
  await profilo(A);const r0=await riga(A);
  await A.p.evaluate(()=>document.querySelector('#pfOv .pf-r[onclick*="nccProteggi"]').click());await A.p.waitForTimeout(700);
  let pp=await popup(A);
  console.log('Profilo: «Proteggi i dati»',r0,'| riquadro',JSON.stringify({t:pp&&pp.t,b:pp&&pp.b}));
  ok(r0==='non attiva'&&pp&&pp.t==='Proteggi i dati'&&/1 · In Firebase attiva «Email\/password»/.test(pp.x)&&pp.b.join('|')==='Entra|Crea l’accesso|Annulla','il riquadro «Proteggi i dati» non e’ come deve '+JSON.stringify(pp));
  ok(authCaricato===0,'aprire il riquadro carica gia’ l’accesso');
  /* ── 2 · gli errori restano nel riquadro, email e password non si riscrivono ── */
  pp=await scrivoEProvo(A,'thomas.gmail.com','segreta1','Entra',500);
  console.log('email non valida:',JSON.stringify({err:pp&&pp.err,ko:pp&&pp.ko,em:pp&&pp.em}));
  ok(pp&&pp.t==='Proteggi i dati'&&pp.err==='Scrivi un’email valida.'&&pp.ko.join()==='auEm'&&pp.em==='thomas.gmail.com'&&pp.pw==='segreta1','email non valida: '+JSON.stringify(pp));
  pp=await scrivoEProvo(A,'thomas@gmail.com','abc','Crea l’accesso',500);
  console.log('password corta:',pp&&pp.err,pp&&pp.ko);
  ok(pp&&pp.err==='La password deve avere almeno 6 caratteri.'&&pp.ko.join()==='auPw'&&pp.em==='thomas@gmail.com','password corta: '+JSON.stringify(pp));
  pp=await scrivoEProvo(A,'thomas@gmail.com','segreta1','Crea l’accesso',1200);
  console.log('Email/password non attivata in Firebase:',pp&&pp.err);
  ok(pp&&/Prima attiva «Email\/password» nella console di Firebase/.test(pp.err)&&pp.b[1]==='Crea l’accesso'&&pp.em==='thomas@gmail.com','Email/password spenta nella console: '+JSON.stringify(pp));
  ok(authCaricato===1,'il pezzo per l’accesso non si carica quando serve ('+authCaricato+')');
  /* ── 3 · attivata: «Crea l'accesso» ── */
  EMAIL_ATTIVA=true;
  await tocca(A,'Crea l’accesso');
  await A.p.waitForTimeout(250);
  const durante=await A.p.evaluate(()=>[...document.querySelectorAll('#popOv .pop-b')].map(b=>b.textContent+(b.disabled?' (fermo)':'')));
  await A.p.waitForTimeout(1500);pp=await popup(A);
  const au=await A.p.evaluate(()=>({flag:localStorage.getItem('nccAuth'),uid:window.__authUid&&__authUid()}));
  console.log('Crea l’accesso: durante',JSON.stringify(durante),'| poi «'+(pp&&pp.x.slice(0,60))+'…» |',JSON.stringify(au));
  ok(durante.join('|')==='Entra (fermo)|Creo l’accesso… (fermo)|Annulla (fermo)','mentre aspetta Firebase i tasti non sono fermi: '+JSON.stringify(durante));
  ok(pp&&/Accesso creato: questo dispositivo è pronto/.test(pp.x)&&au.flag==='1'&&/^Uk1/.test(au.uid||''),'Crea l’accesso non va: '+JSON.stringify({pp,au}));
  await tocca(A,'OK');await A.p.waitForTimeout(500);
  await profilo(A);const r1=await riga(A);console.log('la riga ora dice:',r1);ok(r1==='attiva','la riga non dice «attiva»: '+r1);
  /* ── 4 · le regole: col codice, per i tre rami, e si copiano ── */
  await A.p.evaluate(()=>document.querySelector('#pfOv .pf-r[onclick*="nccProteggi"]').click());await A.p.waitForTimeout(700);
  pp=await popup(A);let reg=null;try{reg=JSON.parse(pp.reg);}catch(e){}
  const uid=au.uid,cond="auth != null && auth.uid === '"+uid+"'";
  console.log('Dati protetti:',JSON.stringify({t:pp&&pp.t,b:pp&&pp.b}),'| rami',reg&&Object.keys(reg.rules).join(','));
  ok(pp&&pp.t==='Dati protetti'&&pp.x.indexOf(uid)>=0&&pp.x.indexOf('thomas@gmail.com')>=0,'il riquadro non dice email e codice '+JSON.stringify(pp&&pp.x));
  ok(reg&&['prontuario','prontuario_backup','prontuario_snaps'].every(k=>reg.rules[k]&&reg.rules[k]['.read']===cond&&reg.rules[k]['.write']===cond),'le regole non sono giuste: '+(pp&&pp.reg));
  await tocca(A,'📋 Copia le regole');await A.p.waitForTimeout(700);
  const copiato=await A.p.evaluate(()=>navigator.clipboard.readText().catch(()=>''));
  ok(copiato===pp.reg,'«Copia le regole» non copia le regole');
  /* ── 5 · l'iPad: la stessa email gia' usata, password sbagliata, poi «Entra» ── */
  const B=await dispositivo(b,'iPad',{width:1180,height:820},base);
  await B.p.evaluate(()=>nccProteggi());await B.p.waitForTimeout(700);
  pp=await scrivoEProvo(B,'thomas@gmail.com','segreta1','Crea l’accesso',1500);
  console.log('iPad, Crea l’accesso con la stessa email:',pp&&pp.err);
  ok(pp&&pp.err==='Questa email ha già un accesso: usa «Entra».'&&pp.ko.join()==='auEm','email gia’ usata: '+JSON.stringify(pp));
  pp=await scrivoEProvo(B,'thomas@gmail.com','sbagliata','Entra',1200);
  console.log('iPad, password sbagliata:',pp&&pp.err,'| la password resta',JSON.stringify(pp&&pp.pw));
  ok(pp&&pp.err==='Email o password sbagliate.'&&pp.ko.join()==='auPw'&&pp.pw==='sbagliata','password sbagliata: '+JSON.stringify(pp));
  pp=await scrivoEProvo(B,'thomas@gmail.com','segreta1','Entra',1500);
  const auB=await B.p.evaluate(()=>window.__authUid&&__authUid());
  console.log('iPad, Entra:',(pp&&pp.x.slice(0,40))+'…','| codice',auB);
  ok(pp&&/Sei entrato: questo dispositivo è pronto/.test(pp.x)&&auB===uid,'l’iPad non entra con lo stesso accesso');
  await tocca(B,'OK');
  /* ── 6 · regole pubblicate: chi e' entrato sincronizza, il PC no (e lo dice, una volta) ── */
  REGOLE=uid;
  const C=await dispositivo(b,'PC',{width:1280,height:800},Object.assign({nomeUtente:'Estraneo'},base));
  await C.p.waitForTimeout(2000);
  pp=await popup(C);
  console.log('PC non entrato, cloud protetto:',JSON.stringify({t:pp&&pp.t,b:pp&&pp.b}),'| letture/scritture rifiutate',nega.PC);
  ok(pp&&pp.t==='Il cloud è protetto'&&pp.b.join('|')==='Entra adesso|Dopo','il PC non dice che il cloud e’ protetto '+JSON.stringify(pp));
  await tocca(C,'Dopo');await C.p.waitForTimeout(500);
  await C.p.evaluate(()=>{document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('focus'));});await C.p.waitForTimeout(3500);
  const ancora=await popup(C);ok(!ancora,'l’avviso del cloud protetto torna ogni volta');
  await C.p.evaluate(()=>{localStorage.setItem('nomeUtente','Estraneo2');localStorage.setItem('nomeTs',String(Date.now()));save();autoSave();});await C.p.waitForTimeout(7000);
  ok(leggi('prontuario/prefs/ncc/nomeUtente')!=='Estraneo2'&&nega.PC>0,'il PC non entrato scrive nel cloud');
  /* l'iPhone entrato: risponde e salva, l'iPad lo vede */
  await A.p.evaluate(()=>{localStorage.setItem('nomeTs',String(Date.now()));localStorage.setItem('nomeUtente','Thomas');markDirty('prefs');autoSave();});await A.p.waitForTimeout(7000);
  await B.p.evaluate(()=>nccSyncRiprendi());await B.p.waitForTimeout(3500);
  const nomeB=await B.p.evaluate(()=>localStorage.getItem('nomeUtente'));
  console.log('iPhone entrato → cloud',JSON.stringify(leggi('prontuario/prefs/ncc/nomeUtente')),'→ iPad',nomeB,'| rifiutate: iPhone',nega.iPhone,'iPad',nega.iPad);
  ok(leggi('prontuario/prefs/ncc/nomeUtente')==='Thomas'&&nomeB==='Thomas'&&nega.iPhone===0,'con le regole attive i dispositivi entrati non si passano i dati');
  /* «Entra adesso» sul PC apre il riquadro */
  await C.p.evaluate(()=>{const b=document.getElementById('popOv');if(b)b.remove();});
  await C.p.reload();await C.p.waitForTimeout(8500);
  await tocca(C,'Entra adesso');await C.p.waitForTimeout(800);pp=await popup(C);
  ok(pp&&pp.t==='Proteggi i dati'&&!!(await C.p.$('#auEm')),'«Entra adesso» non apre il riquadro per entrare');
  /* ── 7 · riaprendo l'app l'accesso resta; con la rete lenta (l'accesso arriva dopo 8 s) nessun avviso sbagliato ── */
  authLento=8000;await A.p.reload();await A.p.waitForTimeout(7500);
  const avvisoSbagliato=await popup(A);
  await A.p.waitForTimeout(4500);authLento=0;
  console.log('iPhone entrato, riaperto con la rete lenta: a 7,5 s',avvisoSbagliato?'«'+avvisoSbagliato.t+'»':'nessun avviso');
  ok(!avvisoSbagliato,'sull’iPhone entrato compare «'+(avvisoSbagliato&&avvisoSbagliato.t)+'» mentre l’accesso si carica');
  await profilo(A);const r2=await riga(A);const au2=await A.p.evaluate(()=>window.__authUid&&__authUid());
  console.log('iPhone riaperto: riga',r2,'| codice',au2);
  ok(r2==='attiva'&&au2===uid,'riaprendo l’app l’accesso non resta');
  /* ── 8 · «Esci dall'accesso», con la conferma ── */
  await A.p.evaluate(()=>document.querySelector('#pfOv .pf-r[onclick*="nccProteggi"]').click());await A.p.waitForTimeout(700);
  await tocca(A,'Esci dall’accesso');await A.p.waitForTimeout(700);pp=await popup(A);
  const confermo=pp&&/Esco dall’accesso su questo dispositivo/.test(pp.x);
  await tocca(A,'Conferma');await A.p.waitForTimeout(1200);
  await profilo(A);const r3=await riga(A);const au3=await A.p.evaluate(()=>({flag:localStorage.getItem('nccAuth'),uid:window.__authUid&&__authUid()}));
  console.log('Esci dall’accesso: conferma',confermo,'| riga',r3,'|',JSON.stringify(au3));
  ok(confermo&&r3==='non attiva'&&!au3.flag&&!au3.uid,'«Esci dall’accesso» non va '+JSON.stringify({confermo,r3,au3}));
  await A.p.screenshot({path:__dirname+'/proteggi.png'});
  A.errs.concat(B.errs,C.errs).forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
