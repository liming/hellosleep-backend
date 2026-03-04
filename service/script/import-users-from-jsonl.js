/*
Import legacy users JSONL into Strapi v5 users-permissions users.

Usage:
  NEW_STRAPI_URL=https://hellosleep-production.up.railway.app \
  NEW_STRAPI_TOKEN=xxx \
  USERS_FILE=~/hellosleep/app/users-export.jsonl \
  DRY_RUN=true \
  node script/import-users-from-jsonl.js
*/

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const NEW_STRAPI_URL = (process.env.NEW_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const NEW_STRAPI_TOKEN = process.env.NEW_STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || process.env.LOCAL_API_TOKEN;
const USERS_FILE = process.env.USERS_FILE || path.resolve(process.env.HOME || '', 'hellosleep/app/users-export.jsonl');
const DRY_RUN = process.env.DRY_RUN === 'true';
const LIMIT = parseInt(process.env.LIMIT || '0', 10); // 0 = all
const WRITE_DELAY_MS = parseInt(process.env.WRITE_DELAY_MS || '50', 10);
const DEFAULT_PASSWORD = process.env.IMPORT_DEFAULT_PASSWORD || 'Temp#2026ChangeMe!';

const RESULT_FILE = path.join(__dirname, 'import-users-results.json');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
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
  const encoded = encodeURIComponent(email);
  const ret = await strapiReq(`/users?filters[email][$eq]=${encoded}&fields[0]=id&fields[1]=email&pagination[pageSize]=1`);
  const arr = Array.isArray(ret) ? ret : ret?.data || [];
  return arr[0]?.id || null;
}

function normalizeUsername(raw, email, index) {
  const base = (raw || email?.split('@')[0] || `user${index}`)
    .toString()
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 48);
  return base || `user${index}`;
}

async function createUser({ email, username, confirmed, blocked }) {
  // users-permissions REST endpoint
  return strapiReq('/users', 'POST', {
    email,
    username,
    password: DEFAULT_PASSWORD,
    confirmed: !!confirmed,
    blocked: !!blocked,
  });
}

async function main() {
  if (!NEW_STRAPI_TOKEN) throw new Error('Missing NEW_STRAPI_TOKEN / STRAPI_API_TOKEN');

  const users = parseJsonl(USERS_FILE)
    .filter((u) => u?.email)
    .map((u, i) => ({
      email: String(u.email).trim().toLowerCase(),
      username: normalizeUsername(u.username, u.email, i + 1),
      confirmed: !!u.confirmed,
      blocked: !!u.blocked,
    }));

  const unique = [];
  const seen = new Set();
  for (const u of users) {
    if (seen.has(u.email)) continue;
    seen.add(u.email);
    unique.push(u);
  }

  const target = LIMIT > 0 ? unique.slice(0, LIMIT) : unique;

  const run = {
    startedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    totalRead: users.length,
    uniqueEmails: unique.length,
    toProcess: target.length,
    created: 0,
    existed: 0,
    failed: 0,
    errors: [],
  };

  console.log(`Users read=${users.length}, unique=${unique.length}, process=${target.length}${DRY_RUN ? ' (DRY_RUN)' : ''}`);

  for (let i = 0; i < target.length; i++) {
    const u = target[i];

    try {
      const existing = await findUserByEmail(u.email);
      if (existing) {
        run.existed++;
        if ((i + 1) % 100 === 0 || i === target.length - 1) {
          console.log(`EXISTS ${i + 1}/${target.length} ${u.email}`);
        }
        continue;
      }

      if (DRY_RUN) {
        if ((i + 1) % 100 === 0 || i === target.length - 1) {
          console.log(`[DRY] CREATE ${i + 1}/${target.length} ${u.email}`);
        }
      } else {
        await createUser(u);
        run.created++;
        if ((i + 1) % 100 === 0 || i === target.length - 1) {
          console.log(`CREATED ${i + 1}/${target.length} ${u.email}`);
        }
      }
    } catch (err) {
      run.failed++;
      run.errors.push({ email: u.email, message: err.message });
      console.warn(`FAIL ${u.email}: ${err.message}`);
    }

    await sleep(WRITE_DELAY_MS);
  }

  run.finishedAt = new Date().toISOString();
  fs.writeFileSync(RESULT_FILE, JSON.stringify(run, null, 2));
  console.log(`\nDone. created=${run.created} existed=${run.existed} failed=${run.failed}`);
  console.log(`Result file: ${RESULT_FILE}`);
  if (!DRY_RUN) {
    console.log(`\nNote: imported users use temporary password (${DEFAULT_PASSWORD}). Consider forcing reset flows.`);
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
