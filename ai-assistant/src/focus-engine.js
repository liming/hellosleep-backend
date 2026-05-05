import fs from 'fs';

const TOPICS_PATH = process.env.FOCUS_TOPICS_PATH || new URL('../policy/focus-topics.json', import.meta.url).pathname;

let cache = null;

function loadTopics() {
  if (cache) return cache;
  try {
    const raw = JSON.parse(fs.readFileSync(TOPICS_PATH, 'utf-8'));
    cache = raw;
    return cache;
  } catch (_e) {
    cache = { version: 1, default_assessment_url: 'https://www.hellosleep.net/zh/assessment', topics: [] };
    return cache;
  }
}

function scoreTopic(text, topic) {
  const patterns = Array.isArray(topic.patterns) ? topic.patterns : [];
  let hits = 0;
  for (const p of patterns) {
    try {
      const re = new RegExp(p, 'i');
      if (re.test(text)) hits += 1;
    } catch (_e) {
      // ignore bad regex in config
    }
  }
  const base = Number(topic.priority || 0);
  return { score: base + hits * 10, hits };
}

export function detectPrimaryFocus({ question = '', assessment_facts = '' } = {}) {
  const cfg = loadTopics();
  const text = [String(question || ''), String(assessment_facts || '')].filter(Boolean).join('\n');
  if (!text.trim()) return null;

  const ranked = [];
  for (const topic of cfg.topics || []) {
    const { score, hits } = scoreTopic(text, topic);
    const minHits = Number(topic.min_score || 1);
    if (hits < minHits) continue;
    ranked.push({
      id: topic.id,
      score,
      hits,
      core_message: topic.core_message || '',
      reframe_message: topic.reframe_message || '',
      action_message: topic.action_message || '',
      article: topic.article || null,
    });
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked[0] || null;
}

export function buildFocusResponse(focus) {
  const cfg = loadTopics();
  if (!focus) return '';
  const lines = [
    focus.core_message,
    '',
    focus.reframe_message,
    '',
    focus.action_message,
  ];
  if (focus.article?.url) {
    lines.push('', `推荐阅读：${focus.article.title}${focus.article.url ? ` ${focus.article.url}` : ''}`);
  }
  if (cfg.default_assessment_url) {
    lines.push('', `如果你想进一步定位自己的问题结构，可以做评估：${cfg.default_assessment_url}`);
  }
  return lines.filter(Boolean).join('\n');
}

export function mergeFocusArticle(links = [], focus = null, topN = 2) {
  const out = [];
  const seen = new Set();
  if (focus?.article?.url) {
    out.push(focus.article);
    seen.add(focus.article.url);
  }
  for (const link of links || []) {
    if (!link?.url || seen.has(link.url)) continue;
    seen.add(link.url);
    out.push(link);
    if (out.length >= topN) break;
  }
  return out.slice(0, topN);
}

