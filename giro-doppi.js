/* I DOPPI DEI PERCORSI DEL LIBRO (v151), con un cloud finto condiviso fra piu' dispositivi, a tempo reale.
   Lo stato di partenza e' quello che la v150 ha lasciato: accanto ai tuoi percorsi del libro con dei marker su vie
   «fuori dal libro» (l'alternativa dopo OPPURE, un refuso del documento vecchio, due caselle in una) c'e' la copia
   «lib_»; un dispositivo coi dati vecchi ha aggiunto le copie di percorsi che avevi gia'; lo stesso percorso
   stampato su due pagine (80 e 108) c'e' due volte.
   · il PC: per ogni percorso del libro ne resta uno, il tuo; prende tutte le vie (i marker seguono la loro via,
     anche col refuso; quelli sull'alternativa se ne vanno); dalle copie passano statistiche, ripasso, ultimo
     percorso, i percorsi di oggi; le copie prendono la lapide; tutto arriva nel cloud; riaperto non rifa' niente
   · l'iPhone coi dati vecchi (e una copia sua): arriva allo stesso elenco, la sua copia passa il marker e se ne va
   · un dispositivo nuovo: niente doppi, niente aggiunte
   · scarico dal cloud fallito: niente aggiunte; riuscito dopo: si aggiunge solo quello che manca davvero */
const {launch,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m);};
const D=JSON.parse(fs.readFileSync(__dirname+'/../percorsi-data.js','utf8').replace(/^[\s\S]*?window\.__PERCORSI_PDF__=/,'').replace(/;\s*$/,''));
const lib=id=>D.find(p=>p.id===id);
/* ── il cloud: un albero in memoria, come il Realtime Database ── */
const DB={};
const parti=p=>String(p||'').split('/').filter(Boolean);
function leggi(p){let o=DB;for(const k of parti(p)){if(o==null||typeof o!=='object')return null;o=o[k];}return o===undefined?null:JSON.parse(JSON.stringify(o));}
function pulisci(v){if(v===null||v===undefined)return null;if(Array.isArray(v)){const a=v.map(pulisci);return a.length?a:null;}
  if(typeof v==='object'){const o={};Object.keys(v).forEach(k=>{const x=pulisci(v[k]);if(x!==null)o[k]=x;});return Object.keys(o).length?o:null;}return v;}
function scrivi(p,v){const ks=parti(p);v=pulisci(v);if(!ks.length){Object.keys(DB).forEach(k=>delete DB[k]);if(v)Object.assign(DB,v);return;}
  let o=DB;for(let i=0;i<ks.length-1;i++){if(!o[ks[i]]||typeof o[ks[i]]!=='object')o[ks[i]]={};o=o[ks[i]];}
  if(v===null)delete o[ks[ks.length-1]];else o[ks[ks.length-1]]=v;}
const FB=`(function(){
function Ref(p){this.path=p||'';}
Ref.prototype.child=function(c){return new Ref(this.path+'/'+c);};
Ref.prototype.once=function(ev,cb,err){return window.__fbGet(this.path).then(function(v){if(v&&v.__rotto)throw new Error('rete');var s={val:function(){return v;},exportVal:function(){return v;},exists:function(){return v!=null;}};
  if(typeof cb==='function')cb(s);return s;}).catch(function(e){if(typeof err==='function')err(e);});};
Ref.prototype.set=function(v){return window.__fbSet(this.path,v===undefined?null:JSON.parse(JSON.stringify(v)));};
Ref.prototype.update=function(o){return window.__fbUpdate(this.path,JSON.parse(JSON.stringify(o)));};
Ref.prototype.remove=function(){return window.__fbSet(this.path,null);};
Ref.prototype.on=function(){};Ref.prototype.off=function(){};
var db=function(){return {ref:function(p){return new Ref(p);}};};db.Reference=Ref;db.Query=Ref;
window.firebase={apps:[],initializeApp:function(){this.apps.push({});return {};},database:db};})();`;
const ROTTO={};
async function dispositivo(b,nome,vp,dati){
  const ctx=await b.newContext({viewport:vp,serviceWorkers:'block',hasTouch:true,isMobile:vp.width<700,timezoneId:'Europe/Rome'});
  await ctx.exposeFunction('__fbGet',p=>(ROTTO[nome]&&parti(p).length<=1)?{__rotto:1}:leggi(p));
  await ctx.exposeFunction('__fbSet',(p,v)=>{scrivi(p,v);return true;});
  await ctx.exposeFunction('__fbUpdate',(p,o)=>{Object.keys(o||{}).forEach(k=>scrivi(p+'/'+k,o[k]));return true;});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase-app/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:FB});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  await ctx.addInitScript(()=>{window.__nccSiLibro=true;});
  await ctx.addInitScript(d=>{if(sessionStorage.getItem('__r'))return;localStorage.clear();Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));sessionStorage.setItem('__r','1');},dati);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(nome+': '+e.message));
  await p.addInitScript(()=>{window.__toast=[];document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{try{const _t=toast2;toast2=function(m){window.__toast.push(String(m));return _t.apply(this,arguments);};}catch(e){}},0);});});
  await p.goto(BASE+'index.html');
  return {nome,ctx,p,errs};
}
const J=x=>JSON.stringify(x);
const stato=D0=>D0.p.evaluate(()=>({ids:routes.map(r=>String(r.id)).sort(),R:JSON.parse(JSON.stringify(routes)),C:JSON.parse(JSON.stringify(coords)),q:JSON.parse(JSON.stringify(qStats)),
  rSR:JSON.parse(localStorage.getItem('rSR')||'{}'),lRId:JSON.parse(localStorage.getItem('lRId')||'null'),og:JSON.parse(localStorage.getItem('oggiNcc')||'null'),
  rDel:JSON.parse(localStorage.getItem('rDel')||'{}'),toast:window.__toast.slice(),fatto:!!window.__nccLibroFatto}));
async function aspetta(D0,ms){const t0=Date.now();while(Date.now()-t0<ms){await D0.p.waitForTimeout(500);if(await D0.p.evaluate(()=>!!window.__nccLibroFatto))break;}await D0.p.waitForTimeout(3500);}

(async()=>{
const b=await launch();
const ora=Date.now(),oggi=(()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
/* ── lo stato lasciato dalla v150 ── */
const p92=lib('p92a'),p6=lib('p6a'),p1=lib('p1a'),p5=lib('p5a'),p80=lib('p80b'),p108=lib('p108b');
const vecchio92=p92.s.concat(['OPPURE']).concat(p92.a[0].s);                                   /* l'alternativa dentro */
const vecchio6=p6.s.map(t=>t==='VIA VITRUVIO'?'VIA VISTRUVIO':t);                               /* il refuso del documento vecchio */
const vecchio5=p5.s.slice(0,-2).concat(['V.LE FORLANINI AEROPORTO LINATE']);                     /* due caselle in una */
const tit=(p,pag)=>p.t+(pag?' (pag. '+p.p+')':'');
const R0=[
  {id:'u1',title:p92.t,steps:vecchio92},
  {id:'lib_p92a',title:tit(p92,1),steps:p92.s.slice(),pdf:'p92a',libV:4,alt:p92.a},
  {id:'u2',title:p6.t,steps:vecchio6},
  {id:'lib_p6a',title:tit(p6,1),steps:p6.s.slice(),pdf:'p6a',libV:4},
  {id:'u3',title:p1.t,steps:p1.s.slice(),pdf:'p1a',libV:4},
  {id:'lib_p1a',title:p1.t,steps:p1.s.slice(),pdf:'p1a',libV:4},
  {id:'u5',title:p5.t,steps:vecchio5},
  {id:'lib_p80b',title:tit(p80,1),steps:p80.s.slice(),pdf:'p80b',libV:4,alt:p80.a},
  {id:'lib_p108b',title:tit(p108,1),steps:p108.s.slice(),pdf:'p108b',libV:4},
  {id:'u4',title:'MIO GIRO',steps:['VIA UNO','VIA DUE','VIA TRE']}
];
/* i marker: quelli miei hanno la latitudine 45.40 + via/1000 (la via di prima), quelli dell'app 46 */
const C0={};const mio=(id,i)=>({lat:+(45.40+i/1000).toFixed(6),lon:9.1,t:1000+i});
vecchio92.forEach((t,i)=>{if(t!=='OPPURE')C0['u1_'+i]=mio('u1',i);});
p92.s.forEach((t,i)=>{C0['lib_p92a_'+i]={lat:46,lon:9.3,t:2000,auto:1};});
C0.lib_p92a_3={lat:45.99,lon:9.3,t:3000};                                                         /* uno spostato da me sulla copia */
vecchio6.forEach((t,i)=>{if(i<6)C0['u2_'+i]=mio('u2',i);});                                        /* i miei sulle prime sei (col refuso) */
p6.s.forEach((t,i)=>{C0['lib_p6a_'+i]={lat:46,lon:9.3,t:2000,auto:1};});
p1.s.forEach((t,i)=>{C0['u3_'+i]=mio('u3',i);});
vecchio5.forEach((t,i)=>{C0['u5_'+i]=mio('u5',i);});
const Q0={u1:{correct:2,total:4,wrong:{'1':1}},u3:{correct:1,total:2,wrong:{'4':1}},lib_p1a:{correct:3,total:3,wrong:{'7':2}}};
const SR0={lib_p1a:{box:2,due:ora+864e5,last:ora-3600e3}};
/* tutti gli altri percorsi del libro: cancellati (cosi' il giro guarda solo questi) */
const DEL0={};D.forEach(p=>{if(!['p92a','p6a','p1a','p5a','p80b','p108b'].includes(p.id))DEL0['lib_'+p.id]=ora-864e5;});
const T0=ora-600e3;
scrivi('prontuario',{routes:R0,coords:C0,qStats:Q0,done:{},prefs:{rDel:DEL0,rSR:SR0},ts:T0,dev:'PC',ans:0});
const comuni={ob1:'true',antiFretta:'false',wkRepTs:String(ora),azzerato2026:String(ora),qtStats:J({cat:{},err:{},seenIds:{},idV:2})};
const datiA=Object.assign({routes:J(R0),coords:J(C0),qStats:J(Q0),rSR:J(SR0),rDel:J(DEL0),localTs:String(T0),syncTs:String(T0),lRId:J('lib_p1a'),
  oggiNcc:J({d:oggi,t:ora,q:{},e:{},e0:0,pz:[],pr:['lib_p1a','u1'],ieri:{pz:[],pr:['lib_p92a']}})},comuni);

/* ════ 1 · il PC ════ */
const A=await dispositivo(b,'PC',{width:1280,height:800},datiA);
await aspetta(A,26000);
let S=await stato(A);
console.log('PC:',S.ids.join(' '),'·',J(S.toast.filter(x=>/libro/.test(x))));
const K=S.ids.filter(x=>/^lib_p(80|108)b$/.test(x));
ok(J(S.ids)===J(['lib_p108b','u1','u2','u3','u4','u5'])||J(S.ids)===J(['lib_p80b','u1','u2','u3','u4','u5']),'PC: percorsi '+J(S.ids));
ok(K.length===1,'pag. 80 e 108: '+J(K));
const r=id=>S.R.find(x=>String(x.id)===id);
ok(J(r('u1').steps)===J(p92.s)&&r('u1').pdf==='p92a'&&r('u1').alt&&r('u1').alt.length===1,'u1 non completato: '+J(r('u1')).slice(0,160));
ok(J(r('u2').steps)===J(p6.s)&&r('u2').pdf==='p6a','u2 non completato: '+J(r('u2')).slice(0,160));
ok(J(r('u5').steps)===J(p5.s)&&r('u5').pdf==='p5a','u5 non completato: '+J(r('u5')).slice(0,160));
ok(J(r('u4').steps)==='["VIA UNO","VIA DUE","VIA TRE"]'&&!r('u4').pdf,'il mio percorso toccato');
ok(r(K[0])&&r(K[0]).title===p80.t,'il nome resta col (pag. N): '+(r(K[0])&&r(K[0]).title));
ok(r(K[0])&&r(K[0]).alt&&r(K[0]).alt.length===1,'l\'alternativa di pag. 80 persa');
/* i marker: ognuno sulla sua via */
const vi=k=>S.C[k]?Math.round((S.C[k].lat-45.40)*1000):null;
const m1=p92.s.map((t,i)=>vi('u1_'+i));
ok(J(m1)===J(p92.s.map((t,i)=>i)),'u1: marker '+J(m1));
ok(!Object.keys(S.C).some(k=>/^u1_(19|[2-9]\d)$/.test(k)),'u1: i marker dell\'alternativa restano: '+Object.keys(S.C).filter(k=>/^u1_/.test(k)).length);
const m2=p6.s.map((t,i)=>S.C['u2_'+i]?(S.C['u2_'+i].auto?'a':vi('u2_'+i)):null);
console.log('u2 marker',J(m2));
ok(J(m2.slice(0,6))===J([0,1,2,3,4,5])&&m2.slice(6).every(x=>x==='a'),'u2: marker '+J(m2));
const m5=p5.s.map((t,i)=>vi('u5_'+i));
ok(J(m5)===J(p5.s.map((t,i)=>i<=36?i:null)),'u5: marker '+J(m5.slice(30)));   /* V.LE FORLANINI AEROPORTO LINATE (una casella) va su V.LE FORLANINI */
ok(!Object.keys(S.C).some(k=>/^lib_p(92|6|1)a_/.test(k)),'marker dei doppi rimasti');
/* statistiche, ripasso, ultimo percorso, percorsi di oggi */
ok(S.q.u3&&S.q.u3.correct===4&&S.q.u3.total===5&&S.q.u3.wrong['4']===1&&S.q.u3.wrong['7']===2&&!S.q.lib_p1a,'statistiche: '+J(S.q.u3));
ok(S.q.u1&&S.q.u1.wrong['1']===1,'errori di u1: '+J(S.q.u1));
ok(S.rSR.u3&&S.rSR.u3.box===2&&!S.rSR.lib_p1a,'ripasso: '+J(S.rSR));
ok(S.lRId==='u3','ultimo percorso: '+S.lRId);
ok(S.og&&S.og.pr.every(id=>S.ids.includes(id))&&J(S.og.ieri.pr)==='["u1"]','percorsi di oggi: '+J(S.og&&{pr:S.og.pr,ieri:S.og.ieri}));
ok(['lib_p92a','lib_p6a','lib_p1a'].every(k=>S.rDel[k])&&(S.rDel.lib_p80b||S.rDel.lib_p108b)&&!S.rDel.u1&&!S.rDel.u3,'lapidi: '+J(Object.keys(S.rDel).filter(k=>!DEL0[k])));
ok(S.toast.some(x=>/Percorsi del libro: tolti 4 doppi, ne resta uno per percorso · 3 completati con tutte le vie/.test(x)),'avviso: '+J(S.toast));
/* nel cloud */
await A.p.waitForTimeout(6000);
let cl=leggi('prontuario');
const cIds=(cl.routes||[]).map(x=>String(x.id)).sort();
ok(J(cIds)===J(S.ids),'cloud: percorsi '+J(cIds));
ok(['lib_p92a','lib_p6a','lib_p1a'].every(k=>cl.prefs&&cl.prefs.rDel&&cl.prefs.rDel[k]),'cloud: lapidi');
ok(!Object.keys(cl.coords||{}).some(k=>/^lib_p(92|6|1)a_|^u1_(19|[2-9]\d)$/.test(k)),'cloud: marker dei doppi o dell\'alternativa rimasti '+Object.keys(cl.coords||{}).filter(k=>/^lib_p(92|6|1)a_|^u1_(19|[2-9]\d)$/.test(k)).slice(0,5));
ok(cl.coords&&cl.coords.u2_6&&cl.coords.u2_6.auto,'cloud: il marker passato dalla copia (u2_6) non c\'e\'');
/* riaperto: non rifa' niente */
await A.p.reload();await aspetta(A,26000);
const S2=await stato(A);
ok(J(S2.ids)===J(S.ids)&&!S2.toast.some(x=>/Percorsi del libro/.test(x)),'PC riaperto: '+J(S2.ids)+' '+J(S2.toast));
ok(!A.errs.length,'PC errori: '+A.errs.join(' | '));

/* ════ 2 · l'iPhone coi dati vecchi: senza u5, con la sua copia lib_p5a ════ */
const R0b=R0.filter(x=>x.id!=='u5').concat([{id:'lib_p5a',title:p5.t,steps:p5.s.slice(),pdf:'p5a',libV:4}]);
const C0b=Object.assign({},C0);Object.keys(C0b).forEach(k=>{if(/^u5_/.test(k))delete C0b[k];});p5.s.forEach((t,i)=>{C0b['lib_p5a_'+i]={lat:46.5,lon:9.3,t:2500,auto:1};});
const datiB=Object.assign({},datiA,{routes:J(R0b),coords:J(C0b),localTs:String(T0-60e3),syncTs:String(T0-60e3),lRId:J('u2')});
const B=await dispositivo(b,'iPhone',{width:390,height:844},datiB);
await aspetta(B,26000);
const SB=await stato(B);
console.log('iPhone:',SB.ids.join(' '),'·',J(SB.toast.filter(x=>/libro|cloud/.test(x))));
ok(J(SB.ids)===J(S.ids),'iPhone: percorsi '+J(SB.ids));
const u5b=SB.R.find(x=>x.id==='u5');
ok(u5b&&SB.C['u5_37']&&SB.C['u5_37'].auto&&SB.C['u5_37'].lat===46.5,'iPhone: il marker della sua copia (AEROPORTO LINATE) non passa a u5: '+J(SB.C['u5_37']));
ok(SB.rDel.lib_p5a,'iPhone: lapide della sua copia');
ok(!SB.toast.some(x=>/aggiunt/.test(x)),'iPhone: ha aggiunto dei percorsi '+J(SB.toast));
ok(!B.errs.length,'iPhone errori: '+B.errs.join(' | '));
await B.p.waitForTimeout(5000);
cl=leggi('prontuario');
ok(cl.prefs.rDel.lib_p5a&&!(cl.routes||[]).some(x=>x.id==='lib_p5a')&&cl.coords.u5_37,'cloud dopo l\'iPhone: '+J((cl.routes||[]).map(x=>x.id)));

/* ════ 3 · un dispositivo nuovo ════ */
const Cn=await dispositivo(b,'iPad',{width:1024,height:768},comuni);
await aspetta(Cn,26000);
const SC=await stato(Cn);
console.log('iPad nuovo:',SC.ids.join(' '),'·',J(SC.toast.filter(x=>/libro/.test(x))));
ok(J(SC.ids.filter(x=>x!=='d0'))===J(S.ids),'iPad nuovo: '+J(SC.ids));
ok(!SC.toast.some(x=>/aggiunt|doppi/.test(x)),'iPad nuovo: '+J(SC.toast));
ok(!Cn.errs.length,'iPad errori: '+Cn.errs.join(' | '));

/* ════ 4 · scarico fallito: niente aggiunte; riuscito dopo: solo quello che manca ════ */
const delD=Object.assign({},DEL0);delete delD.lib_p3a;
scrivi('prontuario/prefs/rDel/lib_p3a',null);
const datiD=Object.assign({},comuni,{routes:J(cl.routes),coords:J(cl.coords),rDel:J(delD),localTs:String(cl.ts),syncTs:String(cl.ts)});
ROTTO.PC2=true;
const E2=await dispositivo(b,'PC2',{width:1280,height:800},datiD);
await aspetta(E2,30000);
let SD=await stato(E2);
console.log('scarico fallito:',SD.ids.length,'percorsi ·',J(SD.toast.filter(x=>/libro/.test(x))));
ok(SD.fatto&&!SD.ids.includes('lib_p3a')&&!SD.toast.some(x=>/aggiunt/.test(x)),'scarico fallito: aggiunto lo stesso '+J(SD.toast));
ROTTO.PC2=false;
await E2.p.evaluate(()=>syncFromCloud());await E2.p.waitForTimeout(6000);
SD=await stato(E2);
console.log('scarico riuscito:',SD.ids.length,'percorsi ·',J(SD.toast.filter(x=>/libro/.test(x))));
ok(SD.ids.includes('lib_p3a')&&SD.toast.some(x=>/Percorsi del libro: 1 aggiunto$/.test(x)),'scarico riuscito: '+J(SD.ids)+' '+J(SD.toast));
ok(!E2.errs.length,'PC2 errori: '+E2.errs.join(' | '));

console.log('FALLITI',fails.length);fails.forEach(x=>console.log(' - '+x));
await b.close();process.exit(fails.length?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});
