/* Guardia del sistema visivo — da lanciare prima di ogni consegna.
   Boccia il lavoro se ricompaiono valori fuori scala. */
const fs=require('fs');
const dir=process.argv[2]||'/home/claude/out2';
const addonCss=fs.readFileSync(dir+'/addon.js','utf8').match(/s\.textContent=`([\s\S]*?)`;/)[1];
const css=addonCss+'\n'+fs.readFileSync(dir+'/styles.css','utf8');
let colpe=[];
function regola(nome,valori,max,esempi){
  const ok=valori.length<=max;
  console.log('  '+(ok?'✓':'✗')+' '+nome.padEnd(34)+valori.length+'/'+max
    +(ok?'':'   → '+valori.slice(0,esempi||5).join(' | ')));
  if(!ok)colpe.push(nome+': '+valori.length+' (max '+max+')');
}
function unici(re,filtro){
  const m=(css.match(re)||[]).map(x=>x.trim());
  return [...new Set(filtro?m.filter(filtro):m)];
}
console.log('══ GUARDIA DEL SISTEMA VISIVO ══');
regola('raggi fuori token',
  unici(/border-radius:\s*[^;}]+/g,x=>!/var\(|50%|:\s*0(px)?$|inherit/.test(x)),1);
regola('transizioni fuori token',
  unici(/transition:[^;}]+/g,x=>!/var\(--d/.test(x)),0);
regola('ombre fuori token',
  unici(/box-shadow:[^;}]+/g,x=>!/var\(--sh|none|inset/.test(x)),0);
regola('colori a mano fuori dalle definizioni',
  [...new Set(css.split('\n').filter(L=>!/--[\w-]+\s*:/.test(L))
    .join('\n').match(/#[0-9a-fA-F]{6}\b/g)||[])],42,8);
/* variabili definite due volte con valori diversi */
const def={};
(css.match(/--[\w-]+:\s*[^;}]+/g)||[]).forEach(d=>{
  const [k,v]=d.split(/:(.+)/);(def[k.trim()]=def[k.trim()]||new Set()).add(v.trim());});
/* raggi e durate: un valore solo (il 1ms del movimento ridotto non conta) */
const scala=['--r-sm','--r-md','--r-lg','--r-xl','--r-2xl','--d1','--d2','--d3'];
const fuori=scala.filter(k=>def[k]&&[...def[k]].filter(v=>v!=='1ms').length>1)
  .map(k=>k+'('+[...def[k]].join(',')+')');
regola('raggi e durate con piu valori',fuori,0,6);
/* file coerenti */
const idx=fs.readFileSync(dir+'/index.html','utf8');
const sw=fs.readFileSync(dir+'/sw.js','utf8');
['addon.js','piazze.js','norme.js','styles.css'].forEach(f=>{
  const a=(idx.match(new RegExp(f.replace('.','\\.')+'\\?v=(\\d+)'))||[])[1];
  const b=(sw.match(new RegExp(f.replace('.','\\.')+'\\?v=(\\d+)'))||[])[1];
  if(a&&b&&a!==b)colpe.push('versione diversa di '+f+': index '+a+' vs sw '+b);
});
const disallineate=colpe.filter(c=>/versione diversa/.test(c));
console.log('  '+(disallineate.length?'✗':'✓')+' versioni allineate fra index e sw');
console.log();
if(colpe.length){console.log('❌ BOCCIATO');colpe.forEach(c=>console.log('   '+c));process.exit(1);}
console.log('✅ PASSATO');
