require('dotenv').config();
const fs=require('fs');
const ds=require('./src/services/dataService.js');
const stats=require('./src/services/stats.js');
const D=process.argv[2];
class MA{constructor(b,o){this.buffer=b;this.name=o.name}}
const saved={};
const ctx={discord:{AttachmentBuilder:MA},config:require('./src/data/config.json'),services:{
  dataService:ds,perks:require('./src/services/perks.js'),characters:require('./src/services/characters.js'),
  database:{getDataSnapshot:async n=>saved[n]||null,saveDataSnapshot:async(n,p)=>{saved[n]={payload:JSON.stringify(p)}},getOrCreateServer:async()=>({language:0})}}};
const mk=out=>({guildId:'g',editReply:async p=>{if(typeof p==='string')return console.log(' ',p);
  console.log(p.content.replace(/^/gm,'  '));if(p.files?.[0])fs.writeFileSync(D+'/'+out,p.files[0].buffer)}});
(async()=>{
  await stats.init(); await ds.init(ctx);
  // Forzar a Rick (superviviente nuevo) para ver el retrato normalizado
  const survs=ds.getSurvivors();
  const rickIdx=Object.keys(survs).find(k=>survs[k].name==='Rick Grimes');
  const orig=Math.random; Math.random=()=>Number(rickIdx)/Object.keys(survs).length;
  await stats.generateRandomBuild(ctx,mk('new-char.png'),true);
  Math.random=orig;
  await new Promise(r=>setTimeout(r,2500));
})();
