const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.STRAPI_TOKEN || process.env.LOCAL_API_TOKEN;

function isValidUrlValue(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('/') ||
    value.startsWith('#')
  );
}

function normalizeUrlValue(url) {
  if (typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (trimmed.startsWith('t/category/')) return '/tutorial';
  if (trimmed.startsWith('tutorial/')) return `/${trimmed}`;
  return trimmed;
}

function sanitizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.map((block) => sanitizeNode(block));
}

function sanitizeNode(node) {
  if (!node || typeof node !== 'object') return node;
  const cloned = Array.isArray(node) ? [...node] : { ...node };

  if (typeof cloned.url === 'string') {
    const normalized = normalizeUrlValue(cloned.url);
    cloned.url = isValidUrlValue(normalized) ? normalized : '/tutorial';
  }

  if (Array.isArray(cloned.children)) {
    cloned.children = cloned.children.map((child) => sanitizeNode(child));
  }

  if (Array.isArray(cloned.body)) {
    cloned.body = cloned.body.map((child) => sanitizeNode(child));
  }

  return cloned;
}

async function makeApiRequest(endpoint, method = 'GET', data = null) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }
  return response.json();
}

async function run() {
  const targetAltId = process.argv[2];
  if (!targetAltId) {
    console.error('Usage: node script/import-one-article.js <altId>');
    process.exit(1);
  }

  if (!API_TOKEN) {
    console.error('Missing STRAPI_API_TOKEN / STRAPI_TOKEN / LOCAL_API_TOKEN');
    process.exit(1);
  }

  const sourcePath = path.join(__dirname, 'migrated-remote-articles-improved.json');
  const articles = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const sourceArticle = articles.find((a) => a?.data?.altId === targetAltId);

  if (!sourceArticle) {
    console.error(`Article not found in source file by altId: ${targetAltId}`);
    process.exit(1);
  }

  const existing = await makeApiRequest(
    `/articles?filters[altId][$eq]=${encodeURIComponent(targetAltId)}&fields[0]=documentId&fields[1]=title`
  );
  if (Array.isArray(existing?.data) && existing.data.length > 0) {
    console.log(
      JSON.stringify(
        {
          status: 'already_exists',
          altId: targetAltId,
          documentId: existing.data[0].documentId,
          title: existing.data[0].title,
        },
        null,
        2
      )
    );
    return;
  }

  const categoriesResp = await makeApiRequest('/categories?fields[0]=key&fields[1]=name');
  const keyToDocumentId = new Map();
  for (const c of categoriesResp?.data || []) {
    if (c?.key && c?.documentId) keyToDocumentId.set(c.key, c.documentId);
  }

  const articleData = { ...sourceArticle.data };
  if (articleData.category && keyToDocumentId.has(articleData.category)) {
    articleData.category = keyToDocumentId.get(articleData.category);
  } else {
    delete articleData.category;
  }
  articleData.body = sanitizeBlocks(articleData.body);
  delete articleData.publishedAt;
  delete articleData.createdAt;
  delete articleData.updatedAt;

  const created = await makeApiRequest('/articles', 'POST', { data: articleData });
  console.log(
    JSON.stringify(
      {
        status: 'imported',
        altId: targetAltId,
        title: created?.data?.title,
        documentId: created?.data?.documentId,
      },
      null,
      2
    )
  );
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
