/*
Import old evaluations JSONL into new Strapi assessment-results.

Usage:
  NEW_STRAPI_URL=https://hellosleep-production.up.railway.app \
  NEW_STRAPI_TOKEN=xxx \
  EVAL_FILE=~/hellosleep/app/evaluations-export.jsonl \
  USERS_FILE=~/hellosleep/app/users-export.jsonl \
  DRY_RUN=true \
  node script/import-evaluations-from-jsonl.js
*/

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const NEW_STRAPI_URL = (process.env.NEW_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const NEW_STRAPI_TOKEN = process.env.NEW_STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || process.env.LOCAL_API_TOKEN;
const EVAL_FILE = process.env.EVAL_FILE || path.resolve(process.env.HOME || '', 'hellosleep/app/evaluations-export.jsonl');
const USERS_FILE = process.env.USERS_FILE || path.resolve(process.env.HOME || '', 'hellosleep/app/users-export.jsonl');
const DRY_RUN = process.env.DRY_RUN === 'true';
const LIMIT = parseInt(process.env.LIMIT || '0', 10); // 0 = all
const WRITE_DELAY_MS = parseInt(process.env.WRITE_DELAY_MS || '80', 10);

const RESULT_FILE = path.join(__dirname, 'import-evaluations-results.json');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseJsonl(file) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
  const out = [];
  for (const line of lines) {
    try { out.push(JSON.parse(line)); } catch {}
  }
  return out;
}

async function strapiReq(endpoint, method = 'GET', body = null) {
  const res = await fetch(`${NEW_STRAPI_URL}/api${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NEW_STRAPI_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    const msg = json?.error?.message || text || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return json;
}

async function findUserByEmail(email) {
  if (!email) return null;
  // Users endpoint (plugin) normally returns flat array.
  const encoded = encodeURIComponent(email);
  try {
    const ret = await strapiReq(`/users?filters[email][$eq]=${encoded}&fields[0]=id&fields[1]=email&pagination[pageSize]=1`);
    const arr = Array.isArray(ret) ? ret : ret?.data || [];
    return arr[0]?.id || null;
  } catch {
    return null;
  }
}

function normalizeEvaluation(ev) {
  let answers = ev.answers;
  if (typeof answers === 'string') {
    try { answers = JSON.parse(answers); } catch { answers = {}; }
  }
  if (!answers || typeof answers !== 'object') answers = {};

  let tags = ev.tags;
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch { tags = []; }
  }
  if (!Array.isArray(tags)) tags = tags ? [tags] : [];

  return {
    oldId: ev.id,
    email: ev.email || null,
    answers,
    tags,
    completedAt: ev.createdAt || new Date().toISOString(),
  };
}

async function main() {
  if (!NEW_STRAPI_TOKEN) throw new Error('Missing NEW_STRAPI_TOKEN / STRAPI_API_TOKEN');

  const evaluations = parseJsonl(EVAL_FILE).map(normalizeEvaluation).filter(e => Object.keys(e.answers).length > 0);
  // Optional export file kept for audit/reference; do not trust old user IDs.
  // User relation must be resolved against NEW Strapi users by email.
  parseJsonl(USERS_FILE);

  const userCache = new Map();

  const run = {
    startedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    file: EVAL_FILE,
    usersFile: USERS_FILE,
    totalRead: evaluations.length,
    imported: 0,
    skippedNoAnswers: 0,
    userMatched: 0,
    userMissing: 0,
    failed: 0,
    errors: [],
  };

  console.log(`Read evaluations: ${evaluations.length}`);
  if (!evaluations.length) {
    console.log('No records found.');
    return;
  }

  const target = LIMIT > 0 ? evaluations.slice(0, LIMIT) : evaluations;
  console.log(`Processing: ${target.length}${DRY_RUN ? ' (DRY_RUN)' : ''}`);

  for (let i = 0; i < target.length; i++) {
    const ev = target[i];
    const emailKey = ev.email ? String(ev.email).toLowerCase() : null;

    let userId = null;
    if (emailKey && userCache.has(emailKey)) {
      userId = userCache.get(emailKey);
    } else if (ev.email) {
      userId = await findUserByEmail(ev.email);
      if (emailKey) userCache.set(emailKey, userId || null);
    }
    if (userId) run.userMatched++; else run.userMissing++;

    const payload = {
      answers: ev.answers,
      tags: ev.tags,
      completedAt: ev.completedAt,
      ...(userId ? { user: userId } : {}),
    };

    if (DRY_RUN) {
      if ((i + 1) % 25 === 0 || i === target.length - 1) {
        console.log(`[DRY] ${i + 1}/${target.length} oldId=${ev.oldId} user=${userId || 'none'}`);
      }
      continue;
    }

    try {
      await strapiReq('/assessment-results', 'POST', { data: payload });
      run.imported++;
      if ((i + 1) % 25 === 0 || i === target.length - 1) {
        console.log(`OK ${i + 1}/${target.length} oldId=${ev.oldId} user=${userId || 'none'}`);
      }
    } catch (err) {
      run.failed++;
      run.errors.push({ oldId: ev.oldId, email: ev.email, message: err.message });
      console.warn(`FAIL oldId=${ev.oldId}: ${err.message}`);
    }

    await sleep(WRITE_DELAY_MS);
  }

  run.finishedAt = new Date().toISOString();
  fs.writeFileSync(RESULT_FILE, JSON.stringify(run, null, 2));
  console.log(`\nDone. imported=${run.imported} failed=${run.failed} matched=${run.userMatched} missing=${run.userMissing}`);
  console.log(`Result file: ${RESULT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
