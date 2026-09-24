/* avvio a tempo reale: cosa si vede nei primi 4 secondi */
const {launch,seed,BASE}=require('./lib');const fs=require('fs');
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8'),MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
(async()=>{
  const b=await launch();const ctx=await b.newContext({viewport:{width:1280,height:800},serviceWorkers:'block'});
  await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(BASE))return r.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return r.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/firebase|polylinedecorator/.test(u))return r.fulfill({status:200,contentType:'application/javascript',body:''});return r.abort();});
  const s=seed();await ctx.addInitScript(s=>{if(!localStorage.getItem('routes')){localStorage.setItem('routes',JSON.stringify(s.routes));localStorage.setItem('coords',JSON.stringify(s.coords));localStorage.setItem('ob1','true');}},s);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE+'index.html');await p.waitForTimeout(3500);   // prima visita: cache calda come sul telefono
  const t0=Date.now();p.goto(BASE+'index.html',{waitUntil:'commit'});
  for(const t of [120,300,600,900,1300,1800,2600,3400]){
    while(Date.now()-t0<t)await new Promise(r=>setTimeout(r,15));
    try{const st=await p.evaluate(()=>{const h=document.getElementById('homeScreen');const sp=document.getElementById('splash');
      return {avvio:document.documentElement.classList.contains('avvio'),hmNew:!!document.getElementById('hmNew'),nuova:!!(h&&h.classList.contains('hm-nuova')),
        splash:sp?getComputedStyle(sp).opacity+'/'+(sp.classList.contains('hide')?'hide':''):'-',ready:document.readyState};});
      console.log(t,JSON.stringify(st));await p.screenshot({path:`/home/claude/harness/avvio-${t}.png`});}catch(e){console.log(t,'...',e.message.slice(0,60));}
  }
  console.log('errori',errs);await b.close();
})();
