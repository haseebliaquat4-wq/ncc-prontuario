/* (v150) un Overpass finto: legge le domande che fa l'app (union di statement con filtri sui tag, riquadro o "around")
   e risponde con gli elementi della citta' finta, come il server vero (out tags geom / out tags center) */
function distSeg(p,a,b){
  var kx=111320*Math.cos(p[0]*Math.PI/180),ky=110540;
  var P=[p[1]*kx,p[0]*ky],A=[a[1]*kx,a[0]*ky],B=[b[1]*kx,b[0]*ky];
  var dx=B[0]-A[0],dy=B[1]-A[1],l=dx*dx+dy*dy,t=l?((P[0]-A[0])*dx+(P[1]-A[1])*dy)/l:0;t=Math.max(0,Math.min(1,t));
  var x=A[0]+t*dx-P[0],y=A[1]+t*dy-P[1];return Math.sqrt(x*x+y*y);
}
function linee(e){
  if(e.type==='node')return [[[e.lat,e.lon]]];
  var o=[];if(e.geometry)o.push(e.geometry.map(function(g){return [g.lat,g.lon];}));
  (e.members||[]).forEach(function(m){if(m.geometry)o.push(m.geometry.map(function(g){return [g.lat,g.lon];}));});
  return o;
}
function punti(e){var o=[];linee(e).forEach(function(l){o=o.concat(l);});return o;}
function dentro(e,sp){
  if(sp.box){var b=sp.box;return punti(e).some(function(p){return p[0]>=b[0]&&p[0]<=b[2]&&p[1]>=b[1]&&p[1]<=b[3];});}
  var c=[sp.lat,sp.lon],best=Infinity;
  linee(e).forEach(function(l){if(l.length===1)best=Math.min(best,distSeg(c,l[0],l[0]));for(var i=1;i<l.length;i++)best=Math.min(best,distSeg(c,l[i-1],l[i]));});
  return best<=sp.r;
}
/* un pezzo fra parentesi (quadre o tonde), saltando quello che sta fra virgolette */
function chiusa(s,i,apre,chiude){
  var d=0;
  for(var k=i;k<s.length;k++){var ch=s[k];
    if(ch==='"'){k++;while(k<s.length&&s[k]!=='"'){if(s[k]==='\\')k++;k++;}continue;}
    if(ch===apre)d++;else if(ch===chiude){d--;if(!d)return k;}}
  throw new Error('parentesi non chiusa: '+s.slice(i,i+80));
}
function statement(st){
  st=st.trim();
  var m=st.match(/^(way|node|relation|nwr)/);if(!m)throw new Error('statement non capito: '+st);
  var i=m[1].length,filtri=[];
  while(st[i]==='['){
    var j=chiusa(st,i,'[',']'),f=st.slice(i+1,j);i=j+1;
    var x=f.match(/^(!?)"?([a-z_:]+)"?(?:(=|~)"((?:[^"\\]|\\.)*)"(,i)?)?$/);
    if(!x)throw new Error('filtro non capito: '+f);
    filtri.push({no:!!x[1],k:x[2],op:x[3]||'',v:x[4],i:!!x[5]});
  }
  if(st[i]!=='(')throw new Error('manca lo spazio: '+st);
  var sp=st.slice(i+1,chiusa(st,i,'(',')')).trim(),spazio;
  if(/^around:/.test(sp)){var a=sp.slice(7).split(',').map(Number);spazio={r:a[0],lat:a[1],lon:a[2]};}
  else spazio={box:sp.split(',').map(Number)};
  return {tipo:m[1],filtri:filtri,spazio:spazio};
}
function passa(e,s){
  if(s.tipo!=='nwr'&&s.tipo!==e.type)return false;
  var t=e.tags||{};
  for(var i=0;i<s.filtri.length;i++){var f=s.filtri[i],v=t[f.k];
    if(f.no){if(v!=null)return false;continue;}
    if(v==null)return false;
    if(f.op==='='&&v!==f.v)return false;
    if(f.op==='~'&&!new RegExp(f.v,f.i?'i':'').test(v))return false;}
  return dentro(e,s.spazio);
}
function centro(e){var p=punti(e),a=[Infinity,Infinity,-Infinity,-Infinity];
  p.forEach(function(q){a[0]=Math.min(a[0],q[0]);a[1]=Math.min(a[1],q[1]);a[2]=Math.max(a[2],q[0]);a[3]=Math.max(a[3],q[1]);});
  return {lat:(a[0]+a[2])/2,lon:(a[1]+a[3])/2};}
function uscita(e,modo){
  var o={type:e.type,id:e.id,tags:Object.assign({},e.tags||{})};
  if(e.type==='node'){o.lat=e.lat;o.lon=e.lon;return o;}
  if(modo==='center'){o.center=centro(e);return o;}
  if(e.geometry)o.geometry=e.geometry.map(function(g){return {lat:g.lat,lon:g.lon};});
  if(e.members)o.members=e.members.map(function(m){return {type:'way',geometry:(m.geometry||[]).map(function(g){return {lat:g.lat,lon:g.lon};})};});
  return o;
}
/* le union della domanda: [{statements, modo}] */
function leggi(q){
  q=String(q||'');var i=0,blocchi=[];
  var h=q.match(/^\s*\[out:json\][^;]*;/);if(h)i=h[0].length;
  while(i<q.length){
    while(i<q.length&&/\s/.test(q[i]))i++;
    if(i>=q.length)break;
    if(q[i]!=='(')throw new Error('mi aspettavo una union: '+q.slice(i,i+60));
    var j=chiusa(q,i,'(',')'),dentroU=q.slice(i+1,j),sts=[],k=0,a=0;
    /* i ; fuori da virgolette e parentesi separano gli statement */
    for(var d=0;k<dentroU.length;k++){var ch=dentroU[k];
      if(ch==='"'){k++;while(k<dentroU.length&&dentroU[k]!=='"'){if(dentroU[k]==='\\')k++;k++;}continue;}
      if(ch==='('||ch==='[')d++;else if(ch===')'||ch===']')d--;
      else if(ch===';'&&!d){if(dentroU.slice(a,k).trim())sts.push(statement(dentroU.slice(a,k)));a=k+1;}}
    if(dentroU.slice(a).trim())sts.push(statement(dentroU.slice(a)));
    var r=q.slice(j+1).match(/^\s*;\s*out tags (geom|center)\s*;/);
    if(!r)throw new Error('manca out: '+q.slice(j,j+40));
    blocchi.push({sts:sts,modo:r[1]});i=j+1+r[0].length;
  }
  return blocchi;
}
/* la risposta a una domanda: {osm3s, elements} */
function rispondi(q,elementi){
  var out=[];
  leggi(q).forEach(function(b){
    var qui={};
    elementi.forEach(function(e){if(qui[e.type+e.id])return;
      if(b.sts.some(function(s){return passa(e,s);})){qui[e.type+e.id]=1;out.push(uscita(e,b.modo));}});
  });
  return {version:0.6,generator:'Overpass finto',osm3s:{timestamp_osm_base:'2026-10-05T00:00:00Z'},elements:out};
}
module.exports={rispondi:rispondi,leggi:leggi};
