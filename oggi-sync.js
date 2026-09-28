/* «OGGI» SU DUE DISPOSITIVI, CON UN CLOUD FINTO CONDIVISO (stesse chiamate di Firebase).
   iPad (A) e iPhone (B) partono insieme; ogni cosa si fa davvero dall'app (quiz, piazza,
   percorso fino all'ultima tappa) e l'altro dispositivo la deve vedere tornando sull'app:
   · le scelte del giorno sono le stesse sui due dispositivi
   · domande del quiz, piazze, percorsi e Disegna a memoria passano da uno all'altro
   · due percorsi fatti "insieme" su due dispositivi senza sincronizzarsi: nessuno si perde
   · riaprendo l'app (stesso dispositivo) tutto resta salvato */
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
const stato=D=>D.p.evaluate(()=>nccOggiStato());
async function quiz(D,n){
  await D.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'q\'"]').click());await D.p.waitForTimeout(1500);
  for(let k=0;k<n;k++){await D.p.evaluate(()=>{const it=Q.items[Q.idx];document.querySelectorAll('#qRunAns .qans')[it.correct].click();});await D.p.waitForTimeout(1300);}
  await D.p.evaluate(()=>document.querySelector('.qrun-x').click());await D.p.waitForTimeout(400);
  await D.p.evaluate(()=>{const b=document.querySelector('#popOv .pop-b[data-i="0"]');b&&b.click();});await D.p.waitForTimeout(1200);
}
async function piazza(D){
  await D.p.evaluate(()=>document.querySelector('#hmOggi .og-r[onclick*="\'pz\'"]').click());await D.p.waitForTimeout(1000);
  await D.p.evaluate(()=>[...document.querySelectorAll('#pzOv .pz-azioni button')].find(x=>/verific/i.test(x.textContent)).click());await D.p.waitForTimeout(300);
  for(let k=0;k<60;k++){const fatto=await D.p.evaluate(()=>{const s=document.getElementById('verShow');if(s){s.click();return false;}const y=document.querySelector('.pz-si');if(y){y.click();return false;}return true;});
    if(fatto)break;await D.p.waitForTimeout(60);}
  await D.p.waitForTimeout(300);await D.p.evaluate(()=>document.querySelector('#pzOv .pz-hd2 .pz-x').click());await D.p.waitForTimeout(1100);
}
async function percorso(D,id){
  await D.p.evaluate(id=>{goTopografia();setTimeout(()=>selectRoute(routes.find(r=>String(r.id)===id)),300);},id);await D.p.waitForTimeout(1300);
  for(let k=0;k<14;k++){const fine=await D.p.evaluate(()=>{const b=document.getElementById('bNext');if(!b||b.disabled)return true;b.click();return false;});if(fine)break;await D.p.waitForTimeout(250);}
  await D.p.waitForTimeout(800);await D.p.evaluate(()=>{const o=document.getElementById('routeDebrief');if(o)o.remove();try{goHome();}catch(e){}});await D.p.waitForTimeout(900);
}
const fatti=(D,ids)=>D.p.evaluate(ids=>{const l=JSON.parse(localStorage.getItem('rDoneLog')||'{}');return ids.filter(id=>l[id]);},ids);
(async()=>{
  const b=await launch();const s=seed();
  const routes=s.routes.slice(),coords=Object.assign({},s.coords);
  for(let k=1;k<=8;k++){const n=3+(k%2);routes.push({id:'c'+k,title:'VIA INIZIO '+k+' - VIA FINE '+k,steps:Array.from({length:n},(_,i)=>'TAPPA '+k+'.'+i)});
    for(let i=0;i<n;i++)coords['c'+k+'_'+i]={lat:45.44+k/300+i/1500,lon:9.15+k/250+i/1500};}
  const oggi=Date.now();
  const base={ob1:'true',antiFretta:'false',wkRepTs:String(oggi),azzerato2026:String(oggi),qtStats:JSON.stringify({cat:{},err:{},seenIds:{},idV:2})};
  /* ── A · iPad: ha percorsi, marker e 12 piazze complete; le manda al cloud ── */
  const A=await dispositivo(b,'iPad',{width:1180,height:820},Object.assign({routes:JSON.stringify(routes),coords:JSON.stringify(coords)},base));
  await A.p.evaluate(()=>{const T=pzTutte(),co={};T.slice(0,12).forEach((q,k)=>{co[q.id]={lat:45.46+k/200,lon:9.19};q.v.forEach((v,i)=>co[q.id+'_'+i]={lat:45.46+k/200+i/2000,lon:9.19+i/2000});});
    localStorage.setItem('pzCoords',JSON.stringify(co));localStorage.removeItem('oggiNcc');nccOggiStato();save();autoSave();});
  await A.p.waitForTimeout(9000);
  const sA=await stato(A);console.log('iPad, scelte di oggi: piazze',sA.pz.join(','),'| percorsi',sA.pr.join(','),'| cloud:',leggi('prontuario/ts')?'pieno':'vuoto');
  ok(!!leggi('prontuario/ts')&&!!leggi('prontuario/prefs/ncc/oggiNcc'),'l’iPad non ha mandato niente al cloud');
  /* ── B · iPhone nuovo: prende tutto dal cloud, stesse scelte ── */
  const B=await dispositivo(b,'iPhone',{width:390,height:844},base);
  await B.p.waitForTimeout(2500);const sB=await stato(B);
  console.log('iPhone, scelte di oggi: piazze',sB.pz.join(','),'| percorsi',sB.pr.join(','));
  ok(sB.pz.join()===sA.pz.join()&&sB.pr.join()===sA.pr.join(),'i due dispositivi hanno scelte diverse ('+sB.pz.join()+' | '+sB.pr.join()+')');
  /* ── 1 · quiz sull'iPad → iPhone ── */
  await quiz(A,5);await A.p.waitForTimeout(8000);
  let rA=await riga(A,'q');await torna(B);let rB=await riga(B,'q');
  console.log('quiz: iPad',rA.n,'·',rA.s,'| iPhone',rB.n,'·',rB.s);
  ok(rA.s==='Primo quiz: 5 di 30','quiz: l’iPad non conta 5 domande ('+rA.s+')');ok(rB.s===rA.s,'quiz: l’iPhone non vede le domande fatte sull’iPad ('+rB.s+')');
  /* ── 2 · piazza sull'iPad → iPhone ── */
  await piazza(A);await A.p.waitForTimeout(8000);
  rA=await riga(A,'pz');await torna(B);rB=await riga(B,'pz');
  console.log('piazze: iPad',rA.n,'| iPhone',rB.n);
  ok(rA.n==='1/6','piazze: l’iPad non spunta la piazza ('+rA.n+')');ok(rB.n===rA.n,'piazze: l’iPhone non vede la piazza fatta sull’iPad ('+rB.n+')');
  /* ── 3 · Disegna a memoria sull'iPad (solo il ramo delle preferenze cambia) → iPhone ── */
  await A.p.evaluate(id=>{const d=JSON.parse(localStorage.getItem('dmStats')||'{}'),t=Date.now();d[id]={n:1,ult:80,best:80,last:t,ok:t};localStorage.setItem('dmStats',JSON.stringify(d));},sA.pr[0]);
  await A.p.waitForTimeout(6000);
  rA=await riga(A,'pr');await torna(B);rB=await riga(B,'pr');
  console.log('Disegna a memoria: iPad',rA.n,'| iPhone',rB.n);
  ok(rA.n==='1/5','Disegna a memoria: l’iPad non conta il percorso ('+rA.n+')');ok(rB.n===rA.n,'Disegna a memoria: l’iPhone non lo vede ('+rB.n+')');
  /* ── 4 · percorso fino all'ultima tappa sull'iPhone → iPad ── */
  await percorso(B,sA.pr[1]);await B.p.waitForTimeout(8000);
  rB=await riga(B,'pr');await torna(A);rA=await riga(A,'pr');
  console.log('percorso: iPhone',rB.n,'| iPad',rA.n);
  ok(rB.n==='2/5','percorso: l’iPhone non lo spunta ('+rB.n+')');ok(rA.n===rB.n,'percorso: l’iPad non vede il percorso fatto sull’iPhone ('+rA.n+')');
  /* ── 5 · due percorsi insieme, senza sincronizzarsi: l'iPad (piu' risposte) salva per primo ── */
  await quiz(A,3);await percorso(A,sA.pr[2]);await A.p.waitForTimeout(8000);
  await percorso(B,sA.pr[3]);await B.p.waitForTimeout(12000);   /* l'iPhone trova il cloud piu' avanti: scarica e unisce */
  const fB=await fatti(B,[sA.pr[2],sA.pr[3]]);console.log('insieme: sull’iPhone risultano fatti',fB.join(','));
  ok(fB.includes(sA.pr[3]),'insieme: l’iPhone ha perso il percorso fatto su se stesso ('+fB.join(',')+')');
  ok(fB.includes(sA.pr[2]),'insieme: l’iPhone non ha preso il percorso fatto sull’iPad');
  await torna(A);await torna(B);
  rA=await riga(A,'pr');rB=await riga(B,'pr');const qA=await riga(A,'q'),qB=await riga(B,'q');
  const fA=await fatti(A,[sA.pr[2],sA.pr[3]]);
  console.log('alla fine: percorsi iPad',rA.n,'iPhone',rB.n,'| quiz iPad',qA.s,'iPhone',qB.s,'| sull’iPad fatti',fA.join(','));
  ok(rA.n==='4/5'&&rB.n==='4/5','alla fine: percorsi diversi o persi (iPad '+rA.n+', iPhone '+rB.n+')');
  ok(qA.s==='Primo quiz: 8 di 30'&&qB.s===qA.s,'alla fine: quiz diversi (iPad '+qA.s+', iPhone '+qB.s+')');
  /* ── 6 · riaprendo l'app sull'iPhone resta tutto ── */
  const mem=await B.p.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k);}return o;});
  B.errs.forEach(e=>fails.push('JS '+e));await B.ctx.close();
  const B2=await dispositivo(b,'iPhone riaperto',{width:390,height:844},mem);await B2.p.waitForTimeout(2500);
  const r2={q:await riga(B2,'q'),pz:await riga(B2,'pz'),pr:await riga(B2,'pr')};
  console.log('iPhone riaperto: quiz',r2.q.s,'| piazze',r2.pz.n,'| percorsi',r2.pr.n);
  ok(r2.q.s==='Primo quiz: 8 di 30'&&r2.pz.n==='1/6'&&r2.pr.n==='4/5','riaprendo l’app i compiti di oggi non sono tutti salvati '+JSON.stringify(r2));
  console.log('scritture sul cloud:',scritture);
  A.errs.concat(B2.errs).forEach(e=>fails.push('JS '+e));await b.close();
  console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
