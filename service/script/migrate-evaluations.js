/**
 * Migrate evaluations from old Strapi 3 GraphQL API to new Strapi 5 REST API.
 *
 * Old system: http://hellosleep.net:1337/graphql (Strapi 3)
 *   - Collection: evaluations { id, email, answers, tags, createdAt }
 *
 * New system: Strapi 5 REST API
 *   - Collection: assessment-results { answers, tags, completedAt, user (relation) }
 *
 * Usage:
 *   node script/migrate-evaluations.js
 *
 * Environment variables (override via shell or .env):
 *   OLD_GRAPHQL_URL   - old Strapi GraphQL endpoint (default: http://hellosleep.net:1337/graphql)
 *   NEW_STRAPI_URL    - new Strapi base URL (default: http://localhost:1337)
 *   NEW_STRAPI_TOKEN  - new Strapi API token (falls back to LOCAL_API_TOKEN in .env)
 *   BATCH_SIZE        - records per GraphQL page (default: 100)
 *   DRY_RUN           - set to "true" to fetch & map without writing to new Strapi
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const OLD_GRAPHQL_URL = process.env.OLD_GRAPHQL_URL || 'http://hellosleep.net:1337/graphql';

const NEW_STRAPI_URL = process.env.NEW_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337';
const NEW_STRAPI_TOKEN =
  process.env.NEW_STRAPI_TOKEN ||
  process.env.STRAPI_API_TOKEN ||
  process.env.STRAPI_TOKEN ||
  process.env.LOCAL_API_TOKEN;

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100', 10);
const DRY_RUN = process.env.DRY_RUN === 'true';

// Delay between write requests to avoid overwhelming new Strapi (ms)
const WRITE_DELAY_MS = 100;
// Delay between GraphQL fetch pages (ms)
const FETCH_DELAY_MS = 300;

// Progress / results files
const PROGRESS_FILE = path.join(__dirname, 'migrate-evaluations-progress.json');
const RESULTS_FILE = path.join(__dirname, 'migrate-evaluations-results.json');

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ---------------------------------------------------------------------------
// Old Strapi 3 GraphQL helpers
// ---------------------------------------------------------------------------

/**
 * Fetch a single page of evaluations via GraphQL.
 * Strapi 3 uses `limit` / `start` pagination.
 */
async function fetchEvaluationsPage(limit, start) {
  const query = `
    query FetchEvaluations($limit: Int, $start: Int) {
      evaluations(limit: $limit, start: $start, sort: "createdAt:asc") {
        id
        email
        answers
        tags
        createdAt
      }
    }
  `;

  const response = await fetch(OLD_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { limit, start } }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText} - ${text}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data?.evaluations || [];
}

/** Fetch the total evaluation count via GraphQL. */
async function fetchEvaluationCount() {
  const query = `{ evaluationsConnection { aggregate { count } } }`;

  const response = await fetch(OLD_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GraphQL count request failed: ${response.status} - ${text}`);
  }

  const json = await response.json();

  if (json.errors) {
    // Fallback: try evaluationsCount scalar (older Strapi 3 versions)
    console.warn('Warning: evaluationsConnection not available, trying evaluationsCount...');
    return fetchEvaluationCountFallback();
  }

  return json.data?.evaluationsConnection?.aggregate?.count ?? null;
}

async function fetchEvaluationCountFallback() {
  const query = `{ evaluationsCount }`;
  const response = await fetch(OLD_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) return null;
  const json = await response.json();
  return json.data?.evaluationsCount ?? null;
}

/** Fetch ALL evaluations using paginated requests. */
async function fetchAllEvaluations() {
  console.log(`\nFetching evaluations from old GraphQL API: ${OLD_GRAPHQL_URL}`);

  let total = null;
  try {
    total = await fetchEvaluationCount();
    console.log(`Total evaluations reported: ${total ?? 'unknown'}`);
  } catch (err) {
    console.warn(`Could not fetch count: ${err.message}`);
  }

  const all = [];
  let start = 0;
  let page = 1;

  while (true) {
    console.log(`  Fetching page ${page} (start=${start}, limit=${BATCH_SIZE})...`);

    let records;
    try {
      records = await fetchEvaluationsPage(BATCH_SIZE, start);
    } catch (err) {
      console.error(`  Failed to fetch page ${page}: ${err.message}`);
      console.log('  Retrying after 2s...');
      await sleep(2000);
      try {
        records = await fetchEvaluationsPage(BATCH_SIZE, start);
      } catch (retryErr) {
        throw new Error(`Fatal: could not fetch page ${page} after retry: ${retryErr.message}`);
      }
    }

    if (!records || records.length === 0) {
      console.log(`  No more records at start=${start}. Done.`);
      break;
    }

    all.push(...records);
    console.log(`  Got ${records.length} records (total so far: ${all.length})`);

    if (records.length < BATCH_SIZE) {
      // Last page
      break;
    }

    start += BATCH_SIZE;
    page++;
    await sleep(FETCH_DELAY_MS);
  }

  console.log(`Fetched ${all.length} evaluations in total.`);
  return all;
}

// ---------------------------------------------------------------------------
// New Strapi 5 REST helpers
// ---------------------------------------------------------------------------

async function newStrapiRequest(endpoint, method = 'GET', data = null) {
  const url = `${NEW_STRAPI_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NEW_STRAPI_TOKEN}`,
    },
  };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`New Strapi ${method} ${endpoint}: ${response.status} ${response.statusText} - ${text}`);
  }

  return response.json();
}

/**
 * Find a user in the new Strapi by email.
 * Returns the user's documentId (Strapi 5) or null if not found.
 */
async function findUserByEmail(email) {
  if (!email) return null;
  const encoded = encodeURIComponent(email);
  try {
    const result = await newStrapiRequest(
      `/users?filters[email][$eq]=${encoded}&fields[0]=documentId&fields[1]=email&pagination[pageSize]=1`
    );
    const users = Array.isArray(result) ? result : result?.data || [];
    if (users.length > 0) {
      // Users endpoint in Strapi 5 returns flat array
      return users[0]?.documentId || users[0]?.id || null;
    }
    return null;
  } catch (err) {
    console.warn(`    Could not look up user for email "${email}": ${err.message}`);
    return null;
  }
}

/**
 * Check whether an assessment-result with the given sourceId already exists
 * (uses the `altId` field if available, otherwise skips dedup check).
 * We store the old evaluation id in a metadata field to detect duplicates.
 *
 * NOTE: The current schema does not have a sourceId field; we use in-memory
 * tracking via the progress file instead.
 */

/** Create an assessment-result in the new Strapi. */
async function createAssessmentResult(payload) {
  return newStrapiRequest('/assessment-results', 'POST', { data: payload });
}

// ---------------------------------------------------------------------------
// Field mapping
// ---------------------------------------------------------------------------

/**
 * Map one old evaluation record to the new assessment-result payload.
 *
 * Old shape:
 *   { id, email, answers (JSON string or object), tags (JSON string or array), createdAt }
 *
 * New shape:
 *   { answers (json), tags (json), completedAt (datetime), user (documentId relation) }
 */
function mapEvaluation(evaluation, userDocumentId) {
  // answers / tags may be stored as JSON strings in Strapi 3
  let answers = evaluation.answers;
  if (typeof answers === 'string') {
    try { answers = JSON.parse(answers); } catch { answers = {}; }
  }
  if (!answers || typeof answers !== 'object') answers = {};

  let tags = evaluation.tags;
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch { tags = []; }
  }
  if (!Array.isArray(tags)) tags = tags ? [tags] : [];

  const completedAt = evaluation.createdAt || new Date().toISOString();

  const payload = {
    answers,
    tags,
    completedAt,
  };

  if (userDocumentId) {
    payload.user = userDocumentId;
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Main migration
// ---------------------------------------------------------------------------

async function migrate() {
  console.log('='.repeat(60));
  console.log('Evaluation Migration Script');
  console.log('='.repeat(60));
  console.log(`Old GraphQL: ${OLD_GRAPHQL_URL}`);
  console.log(`New Strapi:  ${NEW_STRAPI_URL}`);
  console.log(`Token set:   ${NEW_STRAPI_TOKEN ? 'yes' : 'NO - REQUIRED'}`);
  console.log(`Batch size:  ${BATCH_SIZE}`);
  console.log(`Dry run:     ${DRY_RUN}`);
  console.log('');

  if (!NEW_STRAPI_TOKEN) {
    console.error(
      'ERROR: NEW_STRAPI_TOKEN (or LOCAL_API_TOKEN) is required.\n' +
      'Set it in service/.env or pass it as an environment variable:\n' +
      '  NEW_STRAPI_TOKEN=xxx node script/migrate-evaluations.js'
    );
    process.exit(1);
  }

  // Test new Strapi connection
  console.log('Testing new Strapi connection...');
  try {
    await newStrapiRequest('/assessment-results?pagination[pageSize]=1');
    console.log('New Strapi connection OK.\n');
  } catch (err) {
    console.error(`Cannot connect to new Strapi: ${err.message}`);
    process.exit(1);
  }

  // Load existing progress (to resume interrupted runs)
  const progress = loadProgress();
  const migratedIds = new Set(progress.migratedIds || []);
  console.log(`Resuming: ${migratedIds.size} evaluations already migrated.\n`);

  // Step 1: Fetch all evaluations from old API
  let evaluations;
  if (progress.cachedEvaluations && progress.cachedEvaluations.length > 0) {
    console.log(`Using cached ${progress.cachedEvaluations.length} evaluations from previous run.`);
    console.log('(Delete migrate-evaluations-progress.json to re-fetch from old API)');
    evaluations = progress.cachedEvaluations;
  } else {
    evaluations = await fetchAllEvaluations();
    // Cache fetched data so we can resume without re-fetching
    progress.cachedEvaluations = evaluations;
    saveProgress({ ...progress, migratedIds: [...migratedIds] });
  }

  console.log(`\nStarting import of ${evaluations.length} evaluations...`);

  // Step 2: Process each evaluation
  const results = {
    total: evaluations.length,
    migrated: 0,
    skipped: 0,
    noUser: 0,
    failed: 0,
    errors: [],
    startedAt: new Date().toISOString(),
    finishedAt: null,
  };

  // User email → documentId cache to minimise lookup requests
  const userCache = new Map();

  for (let i = 0; i < evaluations.length; i++) {
    const ev = evaluations[i];
    const evId = String(ev.id);
    const logPrefix = `[${i + 1}/${evaluations.length}]`;

    if (migratedIds.has(evId)) {
      console.log(`${logPrefix} Skip (already migrated): id=${evId}`);
      results.skipped++;
      continue;
    }

    // Resolve user
    let userDocumentId = null;
    if (ev.email) {
      const cacheKey = ev.email.toLowerCase().trim();
      if (userCache.has(cacheKey)) {
        userDocumentId = userCache.get(cacheKey);
      } else {
        userDocumentId = await findUserByEmail(ev.email);
        userCache.set(cacheKey, userDocumentId);
      }
    }

    if (!userDocumentId) {
      results.noUser++;
    }

    // Map to new schema
    const payload = mapEvaluation(ev, userDocumentId);

    if (DRY_RUN) {
      console.log(
        `${logPrefix} [DRY RUN] id=${evId} email=${ev.email || 'none'} user=${userDocumentId || 'not found'}`
      );
      results.migrated++;
      migratedIds.add(evId);
      continue;
    }

    try {
      await createAssessmentResult(payload);
      console.log(
        `${logPrefix} OK id=${evId} email=${ev.email || 'none'} user=${userDocumentId || 'not found'}`
      );
      results.migrated++;
      migratedIds.add(evId);

      // Persist progress every 50 records
      if (results.migrated % 50 === 0) {
        saveProgress({ ...progress, migratedIds: [...migratedIds] });
      }

      await sleep(WRITE_DELAY_MS);
    } catch (err) {
      console.error(`${logPrefix} FAILED id=${evId}: ${err.message}`);
      results.failed++;
      results.errors.push({ id: evId, email: ev.email, error: err.message });

      // Continue with the next record
    }
  }

  results.finishedAt = new Date().toISOString();

  // Final progress save
  saveProgress({ ...progress, migratedIds: [...migratedIds] });

  // Save results report
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Migration Complete');
  console.log('='.repeat(60));
  console.log(`Total evaluations : ${results.total}`);
  console.log(`Migrated          : ${results.migrated}`);
  console.log(`Skipped (dup)     : ${results.skipped}`);
  console.log(`No user match     : ${results.noUser}`);
  console.log(`Failed            : ${results.failed}`);
  console.log(`Results saved to  : ${RESULTS_FILE}`);

  if (results.errors.length > 0) {
    console.log('\nFailed records:');
    results.errors.forEach((e) => console.log(`  id=${e.id} email=${e.email}: ${e.error}`));
  }

  if (results.failed > 0) process.exit(1);
}

migrate().catch((err) => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
