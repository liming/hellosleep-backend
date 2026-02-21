/**
 * Seed assessment data (sections, questions, tags) from web static data into Strapi.
 * Prerequisites: Strapi running (npm run develop), Web running (npm run dev) to fetch seed data.
 * Optionally set WEB_URL if Next.js is not on localhost:3000.
 *
 * Usage: node script/seed-assessment.js
 * Or: WEB_URL=http://localhost:3000 node script/seed-assessment.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.LOCAL_API_TOKEN || process.env.STRAPI_API_TOKEN || process.env.STRAPI_TOKEN;
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

async function fetchSeedData() {
  const res = await fetch(`${WEB_URL}/api/assessment-seed-data`);
  if (!res.ok) throw new Error(`Failed to fetch seed data: ${res.status}`);
  return res.json();
}

async function strapiRequest(endpoint, method = 'GET', data = null) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi ${method} ${endpoint}: ${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  if (!API_TOKEN) {
    console.error('Set LOCAL_API_TOKEN or STRAPI_API_TOKEN in service/.env');
    process.exit(1);
  }
  console.log('Fetching seed data from', WEB_URL);
  const { sections: sectionsData, questions: questionsData, tags: tagsData } = await fetchSeedData();
  console.log('Sections:', sectionsData.length, 'Questions:', questionsData.length, 'Tags:', tagsData.length);

  const sectionKeyToDocumentId = new Map();

  // 1) Create sections (by key)
  for (const sec of sectionsData) {
    const key = sec.id || sec.key;
    try {
      const created = await strapiRequest('/sections', 'POST', {
        data: {
          key,
          name: sec.name || key,
          description: sec.description,
          order: sec.order,
        },
      });
      const docId = created.data?.documentId;
      if (docId) sectionKeyToDocumentId.set(key, docId);
      console.log('Section created:', key, docId);
    } catch (e) {
      console.error('Section failed', key, e.message);
    }
  }

  // If sections already existed, fetch their documentIds by key
  const existingSections = await strapiRequest('/sections?pagination[pageSize]=100');
  (existingSections.data || []).forEach((s) => {
    if (s.key) sectionKeyToDocumentId.set(s.key, s.documentId);
  });

  const categoryOrder = ['basic_info', 'sleep_habits', 'lifestyle', 'environment', 'work_study', 'attitude'];
  let orderInCategory = {};
  categoryOrder.forEach((k) => { orderInCategory[k] = 0; });

  // 2) Create questions (link category by section documentId)
  for (const q of questionsData) {
    const categoryKey = q.category;
    const sectionDocId = sectionKeyToDocumentId.get(categoryKey);
    if (!sectionDocId) {
      console.error('Skip question (no section):', q.id, categoryKey);
      continue;
    }
    orderInCategory[categoryKey] = (orderInCategory[categoryKey] || 0) + 1;
    const payload = {
      data: {
        questionId: q.id,
        text: q.text,
        type: q.type,
        category: sectionDocId,
        required: q.required !== false,
        options: q.options || null,
        depends: q.depends || null,
        order: orderInCategory[categoryKey],
        placeholder: q.placeholder || null,
        hint: q.hint || null,
        min: q.min ?? null,
        max: q.max ?? null,
        step: q.step ?? null,
        unit: q.unit || null,
      },
    };
    try {
      const created = await strapiRequest('/questions', 'POST', payload);
      console.log('Question created:', q.id, created.data?.documentId);
    } catch (e) {
      console.error('Question failed', q.id, e.message);
    }
  }

  // 3) Create assessment tags
  for (const tag of tagsData) {
    try {
      const created = await strapiRequest('/assessment-tags', 'POST', {
        data: {
          name: tag.name,
          text: tag.text,
          description: tag.description,
          category: tag.category,
          priority: tag.priority,
          severity: tag.severity,
          calc: tag.calc,
          recommendation: tag.recommendation,
        },
      });
      console.log('Tag created:', tag.name, created.data?.documentId);
    } catch (e) {
      console.error('Tag failed', tag.name, e.message);
    }
  }

  console.log('Seed done. Sections:', sectionKeyToDocumentId.size, 'Questions:', questionsData.length, 'Tags:', tagsData.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
