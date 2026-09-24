/* Harness comune: apre l'app offline con Leaflet finta, orologio finto e raccolta errori */
const fs=require('fs');
const {chromium}=(()=>{try{return require('playwright');}catch(e){return require('/home/claude/.npm-global/lib/node_modules/playwright');}})();
const MOCK_JS=fs.readFileSync(__dirname+'/leaflet-mock.js','utf8');
const MOCK_CSS=fs.readFileSync(__dirname+'/leaflet-mock.css','utf8');
const BASE=process.env.NCC_BASE||'http://localhost:8765/';

/* dati di prova: tre percorsi con marker veri (Milano) + il percorso di default */
function seed(){
  const routes=[
    {id:'r1',title:'DUOMO - CENTRALE',steps:['P.ZA DUOMO','VIA MAZZINI','VIA TORINO','CORSO MAGENTA','VIA CARDUCCI','VIALE DI PORTA VERCELLINA','PIAZZALE BARACCA','VIA BOCCACCIO']},
    {id:'r2',title:'LORETO - LAMBRATE',steps:['P.LE LORETO','VIA PADOVA','VIA CONTE ROSSO','VIA RUBATTINO','PIAZZA LEONARDO']},
    {id:'r3',title:'SENZA MARKER',steps:['VIA A','VIA B','VIA C']},
    {id:'r4',title:'DUE TAPPE',steps:['VIA UNO','VIA DUE']}
  ];
  const coords={};
  const base=[[45.4642,9.1900],[45.4610,9.1860],[45.4600,9.1830],[45.4655,9.1780],[45.4668,9.1745],[45.4690,9.1700],[45.4702,9.1665],[45.4720,9.1640]];
  base.forEach((p,i)=>{if(i!==3)coords['r1_'+i]={lat:p[0],lon:p[1]};}); /* la tappa 4 senza marker */
  [[45.4856,9.2160],[45.4890,9.2230],[45.4900,9.2300],[45.4870,9.2390],[45.4800,9.2270]].forEach((p,i)=>{coords['r2_'+i]={lat:p[0],lon:p[1]};});
  coords['r4_0']={lat:45.47,lon:9.20};coords['r4_1']={lat:45.471,lon:9.202};
  return {routes,coords};
}

async function launch(){
  return chromium.launch({headless:true,args:['--no-sandbox']});
}

async function boot(browser,opt){
  opt=opt||{};
  const ctx=await browser.newContext({viewport:opt.viewport||{width:390,height:844},serviceWorkers:'block',
    deviceScaleFactor:1,hasTouch:!!opt.touch,isMobile:!!opt.mobile,colorScheme:opt.dark?'dark':'light'});
  const errors=[];
  await ctx.route('**/*',route=>{
    const u=route.request().url();
    if(u.startsWith(BASE))return route.continue();
    if(/leaflet(\.min)?\.js/.test(u)&&!/decorator/.test(u))return route.fulfill({status:200,contentType:'application/javascript',body:MOCK_JS});
    if(/leaflet\.css/.test(u))return route.fulfill({status:200,contentType:'text/css',body:MOCK_CSS});
    if(/polylinedecorator/.test(u))return route.fulfill({status:200,contentType:'application/javascript',body:'/* mock */'});
    if(/firebase/.test(u))return route.fulfill({status:200,contentType:'application/javascript',body:'/* niente firebase nei test */'});
    return route.abort();
  });
  const s=opt.seed===false?null:seed();
  await ctx.addInitScript(s=>{
    try{
      if(s&&!sessionStorage.getItem('__seeded')){
        localStorage.clear();
        localStorage.setItem('routes',JSON.stringify(s.routes));
        localStorage.setItem('coords',JSON.stringify(s.coords));
        localStorage.setItem('ob1','true');
        sessionStorage.setItem('__seeded','1');
      }
    }catch(e){}
  },s);
  const page=await ctx.newPage();
  page.on('pageerror',e=>errors.push('pageerror: '+(e&&e.message)+' @ '+String(e&&e.stack||'').split('\n').slice(0,3).join(' | ')));
  page.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|net::ERR|favicon/.test(t))errors.push('console: '+t);}});
  if(opt.clock!==false)await page.clock.install();
  await page.goto(BASE+'index.html',{waitUntil:'load'});
  if(opt.clock!==false)await page.clock.runFor(opt.bootMs||7000);
  else await page.waitForTimeout(opt.bootMs||6500);
  return {ctx,page,errors,tick:ms=>opt.clock!==false?page.clock.runFor(ms):page.waitForTimeout(ms)};
}
module.exports={launch,boot,seed,BASE};
