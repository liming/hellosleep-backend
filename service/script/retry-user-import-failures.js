const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const NEW_STRAPI_URL = (process.env.NEW_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const NEW_STRAPI_TOKEN = process.env.NEW_STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || process.env.LOCAL_API_TOKEN;
const USERS_FILE = process.env.USERS_FILE || path.resolve(process.env.HOME || '', 'hellosleep/app/users-export.jsonl');
const SOURCE_RESULT = path.join(__dirname, 'import-users-results.json');
const WRITE_DELAY_MS = parseInt(process.env.WRITE_DELAY_MS || '120', 10);
const DEFAULT_PASSWORD = process.env.IMPORT_DEFAULT_PASSWORD || 'Temp#2026ChangeMe!';
const OUT = path.join(__dirname, 'retry-users-results.json');

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function parseJsonl(file){
  if(!fs.existsSync(file)) return [];
  return fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);
}
async function req(endpoint, method='GET', body=null, withApi=true){
  const base = withApi ? `${NEW_STRAPI_URL}/api` : NEW_STRAPI_URL;
  const res = await fetch(`${base}${endpoint}`, {
    method,
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${NEW_STRAPI_TOKEN}`},
    body: body?JSON.stringify(body):undefined,
  });
  const text = await res.text();
  let json=null; try{json=text?JSON.parse(text):null}catch{}
  if(!res.ok) throw new Error(json?.error?.message || text || `${res.status}`);
  return json;
}
async function resolveRole(){
  const ret = await req('/users-permissions/roles','GET',null,true).catch(async()=>req('/users-permissions/roles','GET',null,false));
  const roles = Array.isArray(ret)?ret:(ret?.roles||ret?.data||[]);
  const auth = roles.find(r=>(r.type||r?.attributes?.type)==='authenticated');
  if(!auth?.id) throw new Error('auth role not found');
  return Number(auth.id);
}
async function findUserByEmail(email){
  const encoded = encodeURIComponent(email);
  const ret = await req(`/users?filters[email][$eq]=${encoded}&fields[0]=id&pagination[pageSize]=1`);
  const arr = Array.isArray(ret)?ret:(ret?.data||[]);
  return arr[0]?.id || null;
}
async function createUser(u, roleId){
  return req('/users','POST',{email:u.email,username:u.username,password:DEFAULT_PASSWORD,confirmed:!!u.confirmed,blocked:!!u.blocked,role:roleId});
}

(async()=>{
  const src = JSON.parse(fs.readFileSync(SOURCE_RESULT,'utf8'));
  const failedEmails = new Set((src.errors||[]).map(e=>String(e.email||'').toLowerCase()).filter(Boolean));
  const users = parseJsonl(USERS_FILE).filter(u=>u?.email).map((u,i)=>({
    email:String(u.email).trim().toLowerCase(),
    username:(u.username||u.email.split('@')[0]||`user${i+1}`).toString().trim().replace(/\s+/g,'_').slice(0,48),
    confirmed:!!u.confirmed,
    blocked:!!u.blocked,
  })).filter(u=>failedEmails.has(u.email));

  const roleId = await resolveRole();
  const run={startedAt:new Date().toISOString(),total:users.length,created:0,existed:0,failed:0,errors:[]};
  for(const [i,u] of users.entries()){
    try{
      const ex = await findUserByEmail(u.email);
      if(ex){run.existed++;}
      else {await createUser(u, roleId); run.created++;}
      if((i+1)%5===0||i===users.length-1) console.log(`${i+1}/${users.length} created=${run.created} existed=${run.existed} failed=${run.failed}`);
    }catch(err){run.failed++; run.errors.push({email:u.email,message:err.message});}
    await sleep(WRITE_DELAY_MS);
  }
  run.finishedAt=new Date().toISOString();
  fs.writeFileSync(OUT, JSON.stringify(run,null,2));
  console.log(run);
})();
