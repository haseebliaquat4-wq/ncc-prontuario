/* (v150) una Milano finta per i marker automatici, in metri attorno al Duomo: le vie e le piazze del percorso
   DUOMO - STAZ.ROGOREDO (pag. 1), con le trappole: omonime lontane, una via simile vicina, la via spezzata in due
   pezzi, una stazione della metropolitana accanto a quella dei treni; poi un ospedale, un aeroporto coi terminal
   e un paese. Elementi come li manda OpenStreetMap (Overpass). */
module.exports=function(M){
var id=1;
function LL(p){return M.ll(p);}
function g(pts){return pts.map(function(p){var q=LL(p);return {lat:+q[0].toFixed(7),lon:+q[1].toFixed(7)};});}
function via(nome,pts,tags){return {type:'way',id:id++,tags:Object.assign({highway:'residential',name:nome},tags||{}),geometry:g(pts)};}
function anello(nome,c,r,tags){var pts=[];for(var k=0;k<=8;k++){var a=k/8*2*Math.PI;pts.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}
return via(nome,pts,Object.assign({highway:'pedestrian'},tags||{}));}
function punto(nome,p,tags){var q=LL(p);return {type:'node',id:id++,lat:+q[0].toFixed(7),lon:+q[1].toFixed(7),tags:Object.assign({name:nome},tags||{})};}
function area(nome,c,r,tags){var pts=[];for(var k=0;k<=4;k++){var a=k/4*2*Math.PI+0.3;pts.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}
return {type:'way',id:id++,tags:Object.assign({name:nome},tags||{}),geometry:g(pts)};}
function lungo(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
var CR0=[-20,-480],CR1=[900,-1300],CL0=[900,-1300],CL1=[1800,-2400];
var G={
duomo:anello('Piazza del Duomo',[0,0],70),
mengoni:via('Via Giuseppe Mengoni',[[80,40],[80,160]]),
margherita:anello('Largo Santa Margherita',[80,190],25),
protaso:via('Via San Protaso',[[60,190],[-60,190]]),
porrone:via('Via Bassano Porrone',[[-60,190],[-60,290]]),
prospero:via('Via San Prospero',[[-60,290],[-160,290]]),
cordusio:anello('Piazza Cordusio',[-185,285],30),
dante:via('Via Dante',[[-200,305],[-350,450],[-500,600]]),
orefici:via('Via Orefici',[[-170,255],[-110,150],[-60,60]]),
mazzini:via('Via Giuseppe Mazzini',[[-60,-60],[-60,-200],[-60,-400]]),
borges:anello('Largo Jorge Luis Borges',[-95,-220],30),
missori:anello('Piazza Missori',[-40,-450],45),
romana:via('Corso di Porta Romana',[CR0,lungo(CR0,CR1,0.5),CR1],{highway:'primary'}),
nazaro:anello('Piazza San Nazaro in Brolo',lungo(CR0,CR1,0.25),35),
crocetta:anello('Largo Crocetta',lungo(CR0,CR1,0.55),35),
medaglie:anello("Piazzale Medaglie d'Oro",CR1,80),
lodi1:via('Corso Lodi',[CL0,lungo(CL0,CL1,0.65)],{highway:'primary'}),
luigi:via('Cavalcavia San Luigi',[lungo(CL0,CL1,0.65),lungo(CL0,CL1,0.75)],{highway:'primary',bridge:'yes'}),
lodi2:via('Corso Lodi',[lungo(CL0,CL1,0.75),CL1],{highway:'primary'}),
buozzi:anello('Piazza Bruno Buozzi',lungo(CL0,CL1,0.3),40),
plodi:anello('Piazzale Lodi',lungo(CL0,CL1,0.6),55),
corvetto:anello('Piazzale Corvetto',CL1,70),
martinengo:via('Via Martinengo',[[1800,-2400],[2100,-2500]]),
boncompagni:via('Via Boncompagni',[[2100,-2500],[2300,-2700]]),
toffetti:via('Via Toffetti',[[2300,-2700],[2500,-2750]]),
mistral:anello('Piazza Frédéric Mistral',[2545,-2760],40),
cassinis:via('Via Cassinis',[[2585,-2760],[2700,-3000]]),
rogoredo:punto('Milano Rogoredo',[2750,-3050],{railway:'station',train:'yes'}),
/* le trappole */
dante2:via('Via Dante',[[8000,8000],[8200,8100]]),
lodi3:via('Corso Lodi',[[-9000,-9000],[-9300,-9100]]),
mazzini2:via('Via Mazzini',[[5000,-3000],[5200,-3000]]),
mengoni2:via('Via Mengoni',[[2000,1500],[2100,1600]]),
orefice:via('Via Orefice',[[400,600],[500,700]]),
zurigo:via('Via Zurigo',[[-4000,-2500],[-4300,-2500]]),
rogo2:punto('Rogoredo',[2700,-3100],{railway:'station',station:'subway'}),
/* un ospedale, un aeroporto coi suoi terminal, un paese */
viaosp:via('Via Fantasia',[[3000,2000],[3400,2000]]),
osp:area('Ospedale San Fantasio',[3200,2060],50,{amenity:'hospital'}),
forlanini:via('Viale Enrico Forlanini',[[3400,2000],[6000,1200]],{highway:'primary'}),
aero:area('Aeroporto di Milano Linate',[6800,0],900,{aeroway:'aerodrome'}),
term:area(null,[6100,1150],60,{aeroway:'terminal'}),
term2:area('Terminal 1',[-30000,30000],80,{aeroway:'terminal'}),
paese:punto('Baranzate',[-6000,6000],{place:'town'}),
/* una piazza che sulla mappa e' solo un punto, fra due vie */
viaest:via('Via Levante',[[1000,1000],[1200,1000]]),
piazzapunto:punto('Piazza Ponente',[1200,1000],{place:'square'}),
viaovest:via('Via Tramontana',[[1200,1000],[1200,1300]])
};
if(!G.term.tags.name)delete G.term.tags.name;
return G;
};
