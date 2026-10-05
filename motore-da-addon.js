/* (v150) il motore dei marker preso da addon.js, per provarlo anche fuori dal browser */
const fs=require('fs');
module.exports=function(){
  const s=fs.readFileSync(__dirname+'/../addon.js','utf8');
  const i=s.indexOf('var MOTORE=(function(){');
  const j=s.indexOf('\n})();\n',i);
  if(i<0||j<0)throw new Error('motore non trovato in addon.js');
  return new Function(s.slice(i,j+6)+'\nreturn MOTORE;')();
};
