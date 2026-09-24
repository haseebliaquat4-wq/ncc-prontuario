/* Leaflet finta per i test offline: stessa API usata dall'app,
   marker e linee disegnati davvero (proiezione Mercatore) cosi' gli screenshot dicono qualcosa. */
(function(){
var L={version:'1.9.4-mock'};
window.__leafletMissing=window.__leafletMissing||{};
function ext(d){for(var i=1;i<arguments.length;i++){var s=arguments[i];if(s)for(var k in s)d[k]=s[k];}return d;}
var lastId=0;function stamp(o){return o._leaflet_id||(o._leaflet_id=++lastId);}
function guard(o,nome){
  return new Proxy(o,{get:function(t,p,r){
    if(p in t)return t[p];
    if(typeof p!=='string'||p.charAt(0)==='_'||p==='then'||p==='toJSON'||p==='nodeType')return undefined;
    window.__leafletMissing[nome+'.'+p]=(window.__leafletMissing[nome+'.'+p]||0)+1;
    return function(){return r;};
  }});
}
var Ev={
  on:function(t,fn,ctx){if(!t)return this;if(typeof t==='object'){for(var k in t)this.on(k,t[k],fn);return this;}
    var s=this;String(t).split(/\s+/).forEach(function(tt){if(!tt)return;s._ev=s._ev||{};(s._ev[tt]=s._ev[tt]||[]).push({fn:fn,ctx:ctx});});return this;},
  off:function(t,fn){if(!t){this._ev={};return this;}if(typeof t==='object'){for(var k in t)this.off(k,t[k]);return this;}
    var s=this;String(t).split(/\s+/).forEach(function(tt){if(!s._ev||!s._ev[tt])return;s._ev[tt]=fn?s._ev[tt].filter(function(h){return h.fn!==fn;}):[];});return this;},
  once:function(t,fn,ctx){var s=this;function w(e){s.off(t,w);fn.call(ctx||s,e);}return this.on(t,w);},
  fire:function(t,d){var hs=(this._ev&&this._ev[t])?this._ev[t].slice():[];var e=ext({type:t,target:this,sourceTarget:this},d||{});
    for(var i=0;i<hs.length;i++)hs[i].fn.call(hs[i].ctx||this,e);return this;},
  listens:function(t){return !!(this._ev&&this._ev[t]&&this._ev[t].length);}
};
function LatLng(a,b){this.lat=+a;this.lng=+b;}
LatLng.prototype.equals=function(o){o=L.latLng(o);return !!o&&Math.abs(o.lat-this.lat)<1e-9&&Math.abs(o.lng-this.lng)<1e-9;};
LatLng.prototype.distanceTo=function(o){o=L.latLng(o);var R=6371000,r=Math.PI/180,dl=(o.lat-this.lat)*r,dg=(o.lng-this.lng)*r;
  var a=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(this.lat*r)*Math.cos(o.lat*r)*Math.sin(dg/2)*Math.sin(dg/2);return 2*R*Math.asin(Math.sqrt(a));};
LatLng.prototype.toString=function(){return 'LatLng('+this.lat+', '+this.lng+')';};
L.latLng=function(a,b){if(a==null)return null;if(a instanceof LatLng)return a;
  if(Array.isArray(a))return new LatLng(a[0],a[1]);if(typeof a==='object')return new LatLng(a.lat,('lng' in a)?a.lng:a.lon);
  return new LatLng(a,b);};
L.LatLng=LatLng;
function Pt(x,y){this.x=x;this.y=y;}
Pt.prototype.add=function(p){return new Pt(this.x+p.x,this.y+p.y);};
Pt.prototype.subtract=function(p){return new Pt(this.x-p.x,this.y-p.y);};
Pt.prototype.divideBy=function(n){return new Pt(this.x/n,this.y/n);};
Pt.prototype.multiplyBy=function(n){return new Pt(this.x*n,this.y*n);};
Pt.prototype.distanceTo=function(p){return Math.sqrt(Math.pow(p.x-this.x,2)+Math.pow(p.y-this.y,2));};
L.point=function(x,y){if(x instanceof Pt)return x;if(Array.isArray(x))return new Pt(x[0],x[1]);if(x&&typeof x==='object')return new Pt(x.x,x.y);return new Pt(x,y);};
L.Point=Pt;
function LLB(a,b){this._sw=null;this._ne=null;if(!a)return;var pts=b?[a,b]:a;
  if(a instanceof LLB){this.extend(a);return;}
  if(Array.isArray(pts)&&pts.length&&typeof pts[0]==='number')pts=[pts];
  for(var i=0;i<pts.length;i++)this.extend(pts[i]);}
LLB.prototype.extend=function(o){if(!o)return this;var sw,ne;
  if(o instanceof LLB){sw=o._sw;ne=o._ne;if(!sw)return this;}else{var ll=L.latLng(o);if(!ll||isNaN(ll.lat))return this;sw=ne=ll;}
  if(!this._sw){this._sw=new LatLng(sw.lat,sw.lng);this._ne=new LatLng(ne.lat,ne.lng);}
  else{this._sw.lat=Math.min(sw.lat,this._sw.lat);this._sw.lng=Math.min(sw.lng,this._sw.lng);
    this._ne.lat=Math.max(ne.lat,this._ne.lat);this._ne.lng=Math.max(ne.lng,this._ne.lng);}
  return this;};
LLB.prototype.isValid=function(){return !!(this._sw&&this._ne);};
LLB.prototype.getCenter=function(){return new LatLng((this._sw.lat+this._ne.lat)/2,(this._sw.lng+this._ne.lng)/2);};
LLB.prototype.getSouthWest=function(){return this._sw;};LLB.prototype.getNorthEast=function(){return this._ne;};
LLB.prototype.getNorth=function(){return this._ne.lat;};LLB.prototype.getSouth=function(){return this._sw.lat;};
LLB.prototype.getEast=function(){return this._ne.lng;};LLB.prototype.getWest=function(){return this._sw.lng;};
LLB.prototype.pad=function(r){var h=Math.abs(this._sw.lat-this._ne.lat)*r,w=Math.abs(this._sw.lng-this._ne.lng)*r;
  return new LLB([this._sw.lat-h,this._sw.lng-w],[this._ne.lat+h,this._ne.lng+w]);};
LLB.prototype.contains=function(o){if(!this.isValid())return false;if(o instanceof LLB)return this.contains(o._sw)&&this.contains(o._ne);
  var p=L.latLng(o);return p.lat>=this._sw.lat&&p.lat<=this._ne.lat&&p.lng>=this._sw.lng&&p.lng<=this._ne.lng;};
LLB.prototype.intersects=function(o){o=(o instanceof LLB)?o:new LLB(o);return !(o._sw.lat>this._ne.lat||o._ne.lat<this._sw.lat||o._sw.lng>this._ne.lng||o._ne.lng<this._sw.lng);};
L.latLngBounds=function(a,b){return (a instanceof LLB)?a:new LLB(a,b);};L.LatLngBounds=LLB;
L.bounds=function(a,b){return {min:L.point(a),max:L.point(b||a)};};

function proj(ll,z){var s=256*Math.pow(2,z),sin=Math.sin(ll.lat*Math.PI/180);sin=Math.max(Math.min(sin,0.9999),-0.9999);
  return new Pt(s*(ll.lng+180)/360,s*(0.5-Math.log((1+sin)/(1-sin))/(4*Math.PI)));}
function unproj(p,z){var s=256*Math.pow(2,z),lng=p.x/s*360-180,n=Math.PI-2*Math.PI*p.y/s;
  return new LatLng(180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))),lng);}

/* ── MAPPA ── */
function Map(el,o){
  if(typeof el==='string')el=document.getElementById(el);
  if(!el)throw new Error('Map container not found.');
  if(el._leaflet_id)throw new Error('Map container is already initialized.');
  stamp(el);this._container=el;this.options=ext({minZoom:0,maxZoom:19},o||{});
  this._layers={};this._zoom=(o&&o.zoom)||13;this._center=new LatLng(45.4642,9.19);
  el.classList.add('leaflet-container');
  var mp=document.createElement('div');mp.className='leaflet-pane leaflet-map-pane';el.appendChild(mp);
  this._panes={mapPane:mp};
  var self=this;['tilePane','overlayPane','markerPane','tooltipPane','popupPane'].forEach(function(n,i){
    var d=document.createElement('div');d.className='leaflet-pane leaflet-'+n.replace('Pane','')+'-pane';d.style.zIndex=200+i*100;mp.appendChild(d);self._panes[n]=d;});
  var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','mock-svg');
  svg.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none';
  this._panes.overlayPane.appendChild(svg);this._svg=svg;
  this._ctl=document.createElement('div');this._ctl.className='leaflet-control-container';el.appendChild(this._ctl);
  var dis={enable:function(){this._on=true;},disable:function(){this._on=false;},enabled:function(){return this._on!==false;}};
  ['dragging','touchZoom','doubleClickZoom','scrollWheelZoom','boxZoom','keyboard'].forEach(function(h){self[h]=ext({},dis);});
  this.zoomControl=L.control.zoom();this.attributionControl={addAttribution:function(){return this;},setPrefix:function(){return this;},remove:function(){return this;},removeAttribution:function(){return this;}};
  if(this.options.zoomControl!==false)this.zoomControl.addTo(this);
  this._onClick=function(ev){
    if(self._removed)return;
    var t=ev.target;
    if(t&&t.closest&&(t.closest('.leaflet-marker-icon')||t.closest('.leaflet-control')))return;
    var r=el.getBoundingClientRect(),cp=new Pt(ev.clientX-r.left,ev.clientY-r.top);
    self.fire('click',{latlng:self.containerPointToLatLng(cp),containerPoint:cp,originalEvent:ev});
  };
  el.addEventListener('click',this._onClick);
  this._loaded=true;
  return guard(this,'map');
}
ext(Map.prototype,Ev,{
  _redraw:function(){for(var k in this._layers){var l=this._layers[k];if(l&&l._update)l._update();}},
  getSize:function(){return new Pt(this._container.clientWidth||0,this._container.clientHeight||0);},
  setView:function(c,z){var ll=L.latLng(c);if(ll&&!isNaN(ll.lat))this._center=ll;if(z!=null&&!isNaN(z))this._zoom=Math.max(this.options.minZoom||0,Math.min(this.options.maxZoom||19,z));
    this._redraw();this.fire('move');this.fire('moveend');this.fire('zoomend');return this;},
  getCenter:function(){return this._center;},getZoom:function(){return this._zoom;},
  setZoom:function(z){return this.setView(this._center,z);},zoomIn:function(d){return this.setZoom(this._zoom+(d||1));},zoomOut:function(d){return this.setZoom(this._zoom-(d||1));},
  getMaxZoom:function(){return this.options.maxZoom;},getMinZoom:function(){return this.options.minZoom||0;},
  panTo:function(c){return this.setView(c,this._zoom);},panBy:function(){return this;},
  flyTo:function(c,z){return this.setView(c,z==null?this._zoom:z);},
  getBoundsZoom:function(b,inside,pad){b=L.latLngBounds(b);if(!b.isValid())return this._zoom;var sz=this.getSize(),p=pad?L.point(pad):new Pt(0,0);
    var w=Math.max(10,sz.x-p.x),h=Math.max(10,sz.y-p.y),z=this.options.maxZoom||19;
    while(z>0){var a=proj(b._sw,z),c=proj(b._ne,z);if(Math.abs(c.x-a.x)<=w&&Math.abs(a.y-c.y)<=h)break;z--;}return z;},
  fitBounds:function(b,o){b=L.latLngBounds(b);if(!b.isValid())return this;o=o||{};var pd=o.padding?L.point(o.padding):new Pt(0,0);
    var z=this.getBoundsZoom(b,false,pd.multiplyBy(2));if(o.maxZoom!=null)z=Math.min(z,o.maxZoom);return this.setView(b.getCenter(),z);},
  flyToBounds:function(b,o){return this.fitBounds(b,o);},
  getBounds:function(){var s=this.getSize();return new LLB(this.containerPointToLatLng(new Pt(0,s.y)),this.containerPointToLatLng(new Pt(s.x,0)));},
  project:function(ll,z){return proj(L.latLng(ll),z==null?this._zoom:z);},unproject:function(p,z){return unproj(L.point(p),z==null?this._zoom:z);},
  latLngToContainerPoint:function(ll){var s=this.getSize();return proj(L.latLng(ll),this._zoom).subtract(proj(this._center,this._zoom)).add(new Pt(s.x/2,s.y/2));},
  containerPointToLatLng:function(p){var s=this.getSize();p=L.point(p);return unproj(p.subtract(new Pt(s.x/2,s.y/2)).add(proj(this._center,this._zoom)),this._zoom);},
  latLngToLayerPoint:function(ll){return this.latLngToContainerPoint(ll);},layerPointToLatLng:function(p){return this.containerPointToLatLng(p);},
  mouseEventToLatLng:function(e){var r=this._container.getBoundingClientRect();return this.containerPointToLatLng(new Pt(e.clientX-r.left,e.clientY-r.top));},
  invalidateSize:function(){this._redraw();this.fire('resize');return this;},
  addLayer:function(l){if(!l)return this;var id=stamp(l);if(this._layers[id])return this;this._layers[id]=l;l._map=this;if(l.onAdd)l.onAdd(this);this.fire('layeradd',{layer:l});return this;},
  removeLayer:function(l){if(!l)return this;var id=stamp(l);if(!this._layers[id])return this;if(l.onRemove)l.onRemove(this);delete this._layers[id];l._map=null;this.fire('layerremove',{layer:l});return this;},
  hasLayer:function(l){return !!(l&&this._layers[stamp(l)]);},
  eachLayer:function(fn,ctx){for(var k in this._layers)fn.call(ctx,this._layers[k]);return this;},
  remove:function(){if(this._removed)return this;for(var k in this._layers)this.removeLayer(this._layers[k]);
    this._container.removeEventListener('click',this._onClick);this._container.innerHTML='';this._container.classList.remove('leaflet-container');
    delete this._container._leaflet_id;this._removed=true;this.fire('unload');this._ev={};return this;},
  distance:function(a,b){return L.latLng(a).distanceTo(L.latLng(b));},
  getContainer:function(){return this._container;},getPane:function(n){return (typeof n==='string')?this._panes[n]:n;},getPanes:function(){return this._panes;},
  createPane:function(n,c){var d=document.createElement('div');d.className='leaflet-pane leaflet-'+n;(c||this._panes.mapPane).appendChild(d);this._panes[n]=d;return d;},
  whenReady:function(fn,ctx){fn.call(ctx||this,{target:this});return this;},stop:function(){return this;},
  openPopup:function(p){return this;},closePopup:function(){return this;},setMaxBounds:function(){return this;},locate:function(){return this;},
  addControl:function(c){c.addTo(this);return this;},removeControl:function(c){c.remove();return this;}
});
L.map=function(el,o){return new Map(el,o);};L.Map=Map;

/* ── ICONE ── */
L.divIcon=function(o){return {options:ext({iconSize:[12,12],className:'leaflet-div-icon'},o||{}),_div:true};};
L.icon=function(o){return {options:ext({},o||{})};};
L.Icon={Default:function(){}};L.Icon.Default.imagePath='';

/* ── MARKER ── */
function Marker(ll,o){this._latlng=L.latLng(ll);this.options=ext({},o||{});var s=this;
  this.dragging={enable:function(){s.options.draggable=true;},disable:function(){s.options.draggable=false;},enabled:function(){return !!s.options.draggable;}};
  return guard(this,'marker');}
ext(Marker.prototype,Ev,{
  addTo:function(m){m.addLayer(this);return this;},remove:function(){if(this._map)this._map.removeLayer(this);return this;},
  _build:function(){var ic=this.options.icon||L.divIcon({className:'mock-default-pin',html:''});var el=document.createElement('div');
    el.className='leaflet-marker-icon leaflet-interactive '+(ic.options.className||'');
    if(ic._div){el.innerHTML=(ic.options.html==null?'':ic.options.html);}else{el.innerHTML='<div class="mock-img-pin"></div>';}
    var sz=ic.options.iconSize?L.point(ic.options.iconSize):null;if(sz){el.style.width=sz.x+'px';el.style.height=sz.y+'px';}
    el.style.position='absolute';el.style.left='0';el.style.top='0';
    if(this.options.opacity!=null)el.style.opacity=this.options.opacity;
    var s=this;el.addEventListener('click',function(ev){ev.stopPropagation();s.fire('click',{originalEvent:ev,latlng:s._latlng});});
    this._icon=el;this._ic=ic;return el;},
  onAdd:function(m){var el=this._build();m._panes.markerPane.appendChild(el);this._update();},
  onRemove:function(){if(this._icon&&this._icon.parentNode)this._icon.parentNode.removeChild(this._icon);this._icon=null;},
  _update:function(){if(!this._map||!this._icon)return;var p=this._map.latLngToContainerPoint(this._latlng),ic=this._ic;
    var sz=ic.options.iconSize?L.point(ic.options.iconSize):new Pt(0,0),an=ic.options.iconAnchor?L.point(ic.options.iconAnchor):sz.divideBy(2);
    this._icon.style.transform='translate3d('+Math.round(p.x-an.x)+'px,'+Math.round(p.y-an.y)+'px,0)';
    this._icon.style.zIndex=Math.round(p.y)+(this.options.zIndexOffset||0);},
  setLatLng:function(ll){this._latlng=L.latLng(ll);this._update();this.fire('move',{latlng:this._latlng});return this;},
  getLatLng:function(){return this._latlng;},
  setIcon:function(ic){this.options.icon=ic;if(this._map){var par=this._icon&&this._icon.parentNode;this.onRemove();var el=this._build();(par||this._map._panes.markerPane).appendChild(el);this._update();}return this;},
  getIcon:function(){return this.options.icon;},getElement:function(){return this._icon;},
  setOpacity:function(o){this.options.opacity=o;if(this._icon)this._icon.style.opacity=o;return this;},
  setZIndexOffset:function(z){this.options.zIndexOffset=z;this._update();return this;},
  bindPopup:function(c){var s=this;this._popup={_c:c,setContent:function(x){this._c=x;return this;},getContent:function(){return this._c;},isOpen:function(){return false;},update:function(){return this;}};return this;},
  unbindPopup:function(){this._popup=null;return this;},getPopup:function(){return this._popup||null;},
  openPopup:function(){return this;},closePopup:function(){return this;},togglePopup:function(){return this;},isPopupOpen:function(){return false;},
  setPopupContent:function(c){if(this._popup)this._popup.setContent(c);return this;},
  bindTooltip:function(c,o){this._tooltip={_c:c,options:o||{},setContent:function(x){this._c=x;return this;},getContent:function(){return this._c;}};return this;},
  unbindTooltip:function(){this._tooltip=null;return this;},getTooltip:function(){return this._tooltip||null;},
  openTooltip:function(){return this;},closeTooltip:function(){return this;},setTooltipContent:function(c){if(this._tooltip)this._tooltip.setContent(c);return this;}
});
L.marker=function(ll,o){return new Marker(ll,o);};L.Marker=Marker;

/* ── LINEE E CERCHI (SVG) ── */
function Path(kind,d,o){this._kind=kind;this.options=ext({color:'#3388ff',weight:3,opacity:1},o||{});
  if(kind==='line'||kind==='polygon'){this._lls=(d||[]).map(function(x){return L.latLng(x);});}else{this._latlng=L.latLng(d);}
  return guard(this,kind);}
ext(Path.prototype,Ev,{
  addTo:function(m){m.addLayer(this);return this;},remove:function(){if(this._map)this._map.removeLayer(this);return this;},
  onAdd:function(m){var el=document.createElementNS('http://www.w3.org/2000/svg','path');m._svg.appendChild(el);this._path=el;this._style();this._update();},
  onRemove:function(){if(this._path&&this._path.parentNode)this._path.parentNode.removeChild(this._path);this._path=null;},
  _style:function(){if(!this._path)return;var o=this.options,p=this._path;p.setAttribute('stroke',o.stroke===false?'none':(o.color||'#3388ff'));
    p.setAttribute('stroke-width',o.weight||3);p.setAttribute('stroke-opacity',o.opacity==null?1:o.opacity);
    p.setAttribute('fill',(o.fill||this._kind==='circle'||this._kind==='polygon')&&o.fill!==false?(o.fillColor||o.color||'#3388ff'):'none');
    p.setAttribute('fill-opacity',o.fillOpacity==null?0.2:o.fillOpacity);p.setAttribute('stroke-linecap',o.lineCap||'round');
    if(o.dashArray)p.setAttribute('stroke-dasharray',o.dashArray);else p.removeAttribute('stroke-dasharray');
    if(o.className)p.setAttribute('class',o.className);},
  _update:function(){if(!this._map||!this._path)return;var m=this._map,d='';
    if(this._lls){this._lls.forEach(function(ll,i){var p=m.latLngToContainerPoint(ll);d+=(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1);});if(this._kind==='polygon'&&d)d+='Z';}
    else{var c=m.latLngToContainerPoint(this._latlng),r=this.options.radius||10;d='M'+(c.x-r)+' '+c.y+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0';}
    this._path.setAttribute('d',d||'M0 0');},
  setLatLngs:function(a){this._lls=(a||[]).map(function(x){return L.latLng(x);});this._update();return this;},
  getLatLngs:function(){return this._lls||[];},addLatLng:function(x){(this._lls=this._lls||[]).push(L.latLng(x));this._update();return this;},
  setLatLng:function(x){this._latlng=L.latLng(x);this._update();return this;},getLatLng:function(){return this._latlng;},
  setRadius:function(r){this.options.radius=r;this._update();return this;},getRadius:function(){return this.options.radius;},
  setStyle:function(o){ext(this.options,o||{});this._style();return this;},
  getBounds:function(){return new LLB(this._lls||[this._latlng]);},isEmpty:function(){return !(this._lls&&this._lls.length);},
  bringToFront:function(){if(this._path&&this._path.parentNode)this._path.parentNode.appendChild(this._path);return this;},bringToBack:function(){return this;},
  redraw:function(){this._update();return this;},getElement:function(){return this._path;},
  bindPopup:function(){return this;},bindTooltip:function(){return this;},openPopup:function(){return this;},openTooltip:function(){return this;},closeTooltip:function(){return this;},unbindTooltip:function(){return this;}
});
L.polyline=function(a,o){return new Path('line',a,o);};L.polygon=function(a,o){return new Path('polygon',a,o);};
L.circleMarker=function(c,o){return new Path('circle',c,o);};L.circle=function(c,o){return new Path('circle',c,ext({radius:10},o));};
L.Polyline=Path;L.Path=Path;

/* ── GRUPPI ── */
function Group(ls){this._ls={};var s=this;(ls||[]).forEach(function(l){s.addLayer(l);});return guard(this,'group');}
ext(Group.prototype,Ev,{
  addTo:function(m){m.addLayer(this);return this;},remove:function(){if(this._map)this._map.removeLayer(this);return this;},
  onAdd:function(m){for(var k in this._ls)m.addLayer(this._ls[k]);},onRemove:function(m){for(var k in this._ls)m.removeLayer(this._ls[k]);},
  addLayer:function(l){this._ls[stamp(l)]=l;if(this._map)this._map.addLayer(l);return this;},
  removeLayer:function(l){var id=(typeof l==='number')?l:stamp(l);var x=this._ls[id];if(x&&this._map)this._map.removeLayer(x);delete this._ls[id];return this;},
  hasLayer:function(l){return !!(l&&this._ls[stamp(l)]);},clearLayers:function(){for(var k in this._ls)this.removeLayer(this._ls[k]);return this;},
  eachLayer:function(fn,ctx){for(var k in this._ls)fn.call(ctx,this._ls[k]);return this;},getLayers:function(){var a=[];for(var k in this._ls)a.push(this._ls[k]);return a;},
  getBounds:function(){var b=new LLB();this.eachLayer(function(l){if(l.getBounds)b.extend(l.getBounds());else if(l.getLatLng)b.extend(l.getLatLng());});return b;},
  setStyle:function(o){this.eachLayer(function(l){if(l.setStyle)l.setStyle(o);});return this;},bringToFront:function(){return this;},
  invoke:function(n){var a=[].slice.call(arguments,1);this.eachLayer(function(l){if(l[n])l[n].apply(l,a);});return this;},
  _update:function(){}
});
L.layerGroup=function(a){return new Group(a);};L.featureGroup=function(a){return new Group(a);};L.LayerGroup=Group;L.FeatureGroup=Group;

/* ── TILE ── */
function Tile(u,o){this._url=u;this.options=ext({opacity:1},o||{});return guard(this,'tile');}
ext(Tile.prototype,Ev,{
  addTo:function(m){m.addLayer(this);return this;},remove:function(){if(this._map)this._map.removeLayer(this);return this;},
  onAdd:function(m){var d=document.createElement('div');d.className='leaflet-layer mock-tiles';d.setAttribute('data-url',this._url);d.style.opacity=this.options.opacity;m._panes.tilePane.appendChild(d);this._el=d;},
  onRemove:function(){if(this._el&&this._el.parentNode)this._el.parentNode.removeChild(this._el);this._el=null;},
  setOpacity:function(o){this.options.opacity=o;if(this._el)this._el.style.opacity=o;return this;},bringToFront:function(){return this;},bringToBack:function(){return this;},
  setUrl:function(u){this._url=u;return this;},redraw:function(){return this;},setZIndex:function(){return this;},getContainer:function(){return this._el;},isLoading:function(){return false;},_update:function(){}
});
L.tileLayer=function(u,o){return new Tile(u,o);};L.TileLayer=Tile;L.gridLayer=function(o){return new Tile('',o);};

/* ── CONTROLLI, POPUP, DECORATOR, UTIL ── */
function Ctl(o){this.options=ext({position:'topright'},o||{});}
ext(Ctl.prototype,{addTo:function(m){this._map=m;var d=document.createElement('div');d.className='leaflet-control mock-ctl';
  if(this.onAdd){var x=this.onAdd(m);if(x)d.appendChild(x);}if(m._ctl)m._ctl.appendChild(d);this._c=d;return this;},
  remove:function(){if(this._c&&this._c.parentNode)this._c.parentNode.removeChild(this._c);return this;},
  setPosition:function(p){this.options.position=p;return this;},getContainer:function(){return this._c;}});
L.control=function(o){return new Ctl(o);};L.control.zoom=function(o){return new Ctl(o);};L.control.scale=function(o){return new Ctl(o);};
L.control.layers=function(){return new Ctl({});};L.control.attribution=function(o){return new Ctl(o);};
L.Control=function(o){return new Ctl(o);};L.Control.extend=function(p){return function(o){var c=new Ctl(o);ext(c,p);return c;};};
L.popup=function(o){var p={options:o||{},setLatLng:function(x){this._ll=x;return this;},setContent:function(c){this._c=c;return this;},
  openOn:function(m){this._m=m;return this;},remove:function(){return this;},isOpen:function(){return false;},close:function(){return this;},getContent:function(){return this._c;}};return p;};
L.tooltip=function(o){return L.popup(o);};
L.polylineDecorator=function(p,o){var d={options:o||{},_p:p,setPaths:function(x){this._p=x;return this;},setPatterns:function(){return this;},
  addTo:function(m){m.addLayer(this);return this;},remove:function(){if(this._map)this._map.removeLayer(this);return this;},onAdd:function(){},onRemove:function(){},_update:function(){},on:function(){return this;},off:function(){return this;}};return d;};
L.Symbol={arrowHead:function(o){return {o:o};},dash:function(o){return {o:o};},marker:function(o){return {o:o};}};
L.DomEvent={on:function(el,t,fn){if(el&&el.addEventListener)String(t).split(/\s+/).forEach(function(x){if(x)el.addEventListener(x,fn);});return this;},
  off:function(el,t,fn){if(el&&el.removeEventListener)String(t).split(/\s+/).forEach(function(x){if(x)el.removeEventListener(x,fn);});return this;},
  stopPropagation:function(e){if(e&&e.stopPropagation)e.stopPropagation();return this;},preventDefault:function(e){if(e&&e.preventDefault)e.preventDefault();return this;},
  stop:function(e){this.stopPropagation(e);this.preventDefault(e);return this;},
  disableClickPropagation:function(el){if(el)el.addEventListener('click',function(e){e.stopPropagation();});return this;},disableScrollPropagation:function(){return this;}};
L.DomUtil={create:function(t,c,p){var e=document.createElement(t);if(c)e.className=c;if(p)p.appendChild(e);return e;},
  addClass:function(e,c){e.classList.add.apply(e.classList,String(c).split(/\s+/).filter(Boolean));},removeClass:function(e,c){e.classList.remove.apply(e.classList,String(c).split(/\s+/).filter(Boolean));},
  hasClass:function(e,c){return e.classList.contains(c);},setPosition:function(){},remove:function(e){if(e&&e.parentNode)e.parentNode.removeChild(e);},
  empty:function(e){e.innerHTML='';},get:function(id){return typeof id==='string'?document.getElementById(id):id;},toFront:function(){},toBack:function(){}};
L.Util={extend:ext,stamp:stamp,bind:function(f,o){return f.bind(o);},throttle:function(f){return f;},setOptions:function(o,x){o.options=ext({},o.options,x);return o.options;}};
L.stamp=stamp;L.extend=ext;L.bind=L.Util.bind;L.setOptions=L.Util.setOptions;
L.Browser={mobile:false,touch:false,retina:false,android:false,ios:false,safari:false,chrome:true,webkit:true,pointer:true};
L.Class={extend:function(p){var C=function(){if(this.initialize)this.initialize.apply(this,arguments);};ext(C.prototype,p||{});C.extend=L.Class.extend;return C;}};
L.Evented=L.Class.extend(Ev);L.Layer=L.Class.extend(Ev);L.Mixin={Events:Ev};
window.L=L;
})();
