import fs from 'fs';
import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
export const pool = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

const ARTICLES_JSON = '/Users/ming/.openclaw/workspace/shuiba-workspace/site-content/migrated-remote-articles-improved.json';
const UNIFIED_CHUNKS = '/Users/ming/.openclaw/workspace/shuiba-workspace/data/memory-v2/chunks.jsonl';

let articleIndex = null;
let unifiedMemoryCache = null;

const SOURCE_PRIORITY = {
  admin_guidance: 8,
  canonical_article: 7,
  assessment_knowledge: 6,
  help_case: 4,
  recovery_story: 3,
  book_excerpt: 2,
};

function tokenize(text = '') {
  const raw = text
    .replace(/[\n\r\t]/g, ' ')
    .replace(/[：:，,。.!！？?（）()【】\[\]"'“”‘’、；;]/g, ' ')
    .split(/\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const keep = [];
  for (const t of raw) {
    if (t.length >= 2) keep.push(t);
  }

  const boosts = [];
  if (/上学|学校|宿舍|室友|学生/.test(text)) boosts.push('学生', '上学', '宿舍', '室友');
  if (/入睡|睡不着|清醒|夜醒|浅睡|早醒/.test(text)) boosts.push('入睡', '清醒', '夜醒', '早醒');
  if (/假期|放假|回家/.test(text)) boosts.push('假期', '回家');
  if (/压力|焦虑|担心|害怕|恐惧/.test(text)) boosts.push('压力', '焦虑', '担心', '害怕');
  if (/复发|反复|又失眠/.test(text)) boosts.push('复发', '反复');
  if (/药|停药|减药|安眠药/.test(text)) boosts.push('药物', '停药', '减药', '安眠药');
  if (/产后|带孩子|哄睡|宝宝/.test(text)) boosts.push('产后', '带孩子', '哄睡', '宝宝');
  if (/评估/.test(text)) boosts.push('评估');
  return Array.from(new Set([...keep, ...boosts])).slice(0, 18);
}

function detectScenarioTags(text = '') {
  const tags = [];
  const rules = {
    student: /学生|学校|上学|校园|中学生|大学生/,
    dorm: /宿舍|室友/,
    noise: /噪音|呼噜|吵|声音/,
    postpartum: /产后|带孩子|哄睡|宝宝|宝妈/,
    pregnancy: /孕期|怀孕/,
    early_waking: /早醒|凌晨.*醒|半夜.*醒/,
    sleep_onset: /入睡困难|睡不着|躺.*清醒|难入睡/,
    recurrence: /复发|反复|又失眠|再次失眠/,
    medication: /安眠药|停药|减药|药物|褪黑素/,
    anxiety: /焦虑|担心|害怕|恐惧/,
    depression: /抑郁|情绪低落/,
    daytime_function: /白天|工作|学习|生活|责任|行动/,
    assessment: /评估/,
    crisis: /不想活|活不下去|轻生|自杀|结束生命|想死/,
  };
  for (const [tag, pattern] of Object.entries(rules)) {
    if (pattern.test(text)) tags.push(tag);
  }
  return tags;
}

export function detectRiskLevel(text = '') {
  if (/不想活|活不下去|轻生|自杀|结束生命|想死/.test(text)) return 'high';
  if (/绝望|崩溃|撑不下去|生不如死/.test(text)) return 'elevated';
  return 'normal';
}

function scoreTextMatch(text = '', tokens = []) {
  let score = 0;
  for (const token of tokens) {
    if (!token) continue;
    if (text.includes(token)) score += token.length >= 4 ? 2 : 1;
  }
  return score;
}

function loadJsonl(file) {
  if (!fs.existsSync(file)) return [];
  const rows = [];
  const lines = fs.readFileSync(file, 'utf-8').split(/\n+/);
  for (const line of lines) {
    if (!line.trim()) continue;
    rows.push(JSON.parse(line));
  }
  return rows;
}

function loadUnifiedMemory() {
  if (unifiedMemoryCache) return unifiedMemoryCache;
  unifiedMemoryCache = loadJsonl(UNIFIED_CHUNKS);
  return unifiedMemoryCache;
}

function scenarioBonus(queryTags = [], rowTags = [], sourceType = '') {
  let score = 0;
  for (const tag of queryTags) {
    if (rowTags.includes(tag)) score += 3;
  }

  if (queryTags.includes('student') || queryTags.includes('dorm')) {
    if (rowTags.includes('student') || rowTags.includes('dorm')) score += 6;
    if (rowTags.includes('postpartum')) score -= 8;
  }
  if (queryTags.includes('postpartum')) {
    if (rowTags.includes('postpartum')) score += 7;
    if (rowTags.includes('student')) score -= 5;
  }
  if (queryTags.includes('medication') && rowTags.includes('medication')) score += 5;
  if (queryTags.includes('assessment') && sourceType === 'assessment_knowledge') score += 7;
  return score;
}

function sourcePriorityBonus(sourceType = '') {
  return SOURCE_PRIORITY[sourceType] || 0;
}

function qualityBonus(level = 'C') {
  if (level === 'A') return 3;
  if (level === 'B') return 2;
  if (level === 'C') return 0;
  return -5;
}

function penaltyForRow(row, queryTags = []) {
  const text = `${row.title || ''}\n${row.text || ''}`;
  let penalty = 0;

  if (row.source_type === 'help_case' && /评估意见|第三部分：你是如何看待失眠|晚上试图睡觉时间有多少/.test(text)) {
    penalty -= 8;
  }
  if (row.source_type === 'help_case' && queryTags.includes('student') && !((row.scenario_tags || []).includes('student') || (row.scenario_tags || []).includes('dorm'))) {
    penalty -= 4;
  }
  if (row.source_type === 'recovery_story' && (queryTags.includes('student') || queryTags.includes('postpartum') || queryTags.includes('medication'))) {
    penalty -= 3;
  }
  return penalty;
}

function retrieveFromUnified(query, limit = 8) {
  const tokens = tokenize(query);
  const queryTags = detectScenarioTags(query);
  const riskLevel = detectRiskLevel(query);
  if (!tokens.length) return [];

  const rows = loadUnifiedMemory();
  const ranked = [];

  for (const row of rows) {
    if (row.quality_level === 'D') continue;
    if ((row.risk_flags || []).includes('self_harm') && riskLevel !== 'high') continue;

    const hay = `${row.title || ''}\n${row.text || ''}`;
    const textScore = scoreTextMatch(hay, tokens);
    if (textScore <= 0) continue;

    const sBonus = scenarioBonus(queryTags, row.scenario_tags || [], row.source_type || '');
    const pBonus = sourcePriorityBonus(row.source_type || '');
    const qBonus = qualityBonus(row.quality_level || 'C');
    const penalty = penaltyForRow(row, queryTags);
    const score = textScore + sBonus + pBonus + qBonus + penalty;

    ranked.push({
      source_name: row.source_name,
      source_type: row.source_type,
      source_id: row.doc_id,
      title: row.title,
      chunk_index: row.chunk_index,
      content: row.text,
      hit_score: score,
      quality_level: row.quality_level,
      risk_flags: row.risk_flags || [],
      scenario_tags: row.scenario_tags || [],
      admin: row.metadata?.admin || row.author || null,
      url: row.url || null,
      topic_id: row.metadata?.topic_id || null,
    });
  }

  ranked.sort((a, b) => {
    if (b.hit_score !== a.hit_score) return b.hit_score - a.hit_score;
    return (SOURCE_PRIORITY[b.source_type] || 0) - (SOURCE_PRIORITY[a.source_type] || 0);
  });

  const dedup = [];
  const seen = new Set();
  for (const row of ranked) {
    const key = `${row.source_id}::${row.chunk_index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(row);
    if (dedup.length >= limit) break;
  }
  return dedup;
}

async function retrieveFromPostgres(query, limit = 8) {
  if (!pool) return [];
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  const clauses = tokens.map((_, i) => `c.content ilike $${i + 1}`).join(' OR ');
  const params = tokens.map(t => `%${t}%`);
  params.push(limit);

  const sql = `
    select d.source_type, d.source_id, d.title, c.chunk_index, c.content,
      (${tokens.map((_, i) => `case when c.content ilike $${i + 1} then 1 else 0 end`).join(' + ')}) as hit_score,
      d.url, d.metadata
    from kb_chunks c
    join kb_documents d on d.id = c.document_id
    where (${clauses})
    order by hit_score desc, c.chunk_index asc
    limit $${tokens.length + 1}
  `;

  const { rows } = await pool.query(sql, params);
  return rows.map(r => ({ ...r, source_name: 'legacy_pg_kb' }));
}

export async function retrieveTopChunks(query, limit = 8) {
  const unified = retrieveFromUnified(query, limit);
  if (unified.length) return unified;
  const pgRows = await retrieveFromPostgres(query, limit);
  return pgRows.slice(0, limit);
}

function buildArticleIndex() {
  if (!fs.existsSync(ARTICLES_JSON)) return [];
  const arr = JSON.parse(fs.readFileSync(ARTICLES_JSON, 'utf-8'));
  return arr
    .map(x => x?.data)
    .filter(Boolean)
    .map(a => ({
      title: a.title,
      altId: a.altId,
      type: a.type,
      url: a.altId ? `https://www.hellosleep.net/tutorial/${a.altId}` : null
    }))
    .filter(x => x.title && x.url);
}

export function findRelatedArticles(refs = [], question = '', topN = 4) {
  if (!articleIndex) articleIndex = buildArticleIndex();
  const q = `${question}\n${refs.map(r => r.title || '').join('\n')}`;

  if (/学生|学校|宿舍|室友/.test(q)) {
    return [
      { title: '先做评估', url: 'https://www.hellosleep.net/zh/assessment', score: 100 },
      { title: '写给失眠的学生 - 珍惜自己的每一天', url: 'https://www.hellosleep.net/article/lloh7g9kg9ef4ds6axzyj5tb', score: 99 },
    ].slice(0, topN);
  }

  if (/产后|带孩子|哄睡|宝宝/.test(q)) {
    return [
      { title: '正确对待产后失眠', url: 'https://www.hellosleep.net/tutorial/5c5c3f03e2e01d103e0f9b1f', score: 100 },
      { title: '产后妈妈失眠不要恐慌，可以恢复好', url: 'https://www.hellosleep.net/tutorial/5b1f2399f4612c136e02a07b', score: 99 },
    ].slice(0, topN);
  }

  const scored = articleIndex
    .map(a => {
      let s = 0;
      if (q.includes(a.title)) s += 4;
      const key = a.title.replace(/[《》\-：:（）()]/g, '').slice(0, 6);
      if (key && q.includes(key)) s += 2;
      if (/躺在床上|入睡|清醒/.test(q) && /躺在床上便困意全无|快要入睡的时候会突然惊醒/.test(a.title)) s += 3;
      if (/上学|宿舍|学生/.test(q) && /写给失眠的学生|你的无所事事/.test(a.title)) s += 3;
      if (/失眠|焦虑|压力/.test(q) && /失眠是个平常事|慢性失眠|无为而治/.test(a.title)) s += 3;
      if (/评估/.test(q) && /评估/.test(a.title)) s += 4;
      return { ...a, score: s };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  if (scored.length) return scored;

  const fallbackTitles = ['失眠是个平常事', '为什么躺在床上便困意全无', '写给失眠的学生-学会换气-才能游向更广阔的世界', '不为失眠做功'];
  return articleIndex.filter(a => fallbackTitles.some(t => a.title.includes(t))).slice(0, topN);
}
