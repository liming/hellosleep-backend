import fs from 'fs';
import path from 'path';

const ASK_URL = process.env.EVAL_ASK_URL || 'http://127.0.0.1:8787/ask';
const INPUT = process.env.EVAL_INPUT || './eval/questions.jsonl';
const OUT_DIR = process.env.EVAL_OUT_DIR || './eval/runs';
const USE_LLM = process.env.EVAL_USE_LLM !== 'false';

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\n+/).filter(Boolean);
  return lines.map((line, idx) => {
    try {
      return JSON.parse(line);
    } catch (e) {
      throw new Error(`Invalid JSONL at line ${idx + 1}: ${e.message}`);
    }
  });
}

async function ask(question, debug = true) {
  const startedAt = Date.now();
  const res = await fetch(ASK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      question,
      use_llm: USE_LLM,
      debug,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return { data, duration_ms: Date.now() - startedAt };
}

async function main() {
  const items = readJsonl(INPUT);
  if (!items.length) {
    console.log(`No questions found in ${INPUT}`);
    process.exit(0);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${nowStamp()}.jsonl`);

  console.log(`Running eval: ${items.length} questions`);
  console.log(`ASK_URL=${ASK_URL}`);
  console.log(`USE_LLM=${USE_LLM}`);
  console.log(`OUT=${outPath}`);

  const out = fs.createWriteStream(outPath, { flags: 'a' });
  let ok = 0;
  let fail = 0;

  for (const item of items) {
    const id = item.id || '';
    const q = String(item.question || '').trim();
    if (!q) continue;

    try {
      const { data, duration_ms } = await ask(q, true);
      const row = {
        ts: new Date().toISOString(),
        id,
        source: item.source || null,
        notes: item.notes || null,
        question: q,
        duration_ms,
        mode: data.mode || null,
        risk_level: data.risk_level || null,
        llm: data.llm || null,
        related_articles: data.related_articles || [],
        references: data.references || [],
        answer: data.answer || '',
      };
      out.write(`${JSON.stringify(row)}\n`);
      ok += 1;
      process.stdout.write(`✔ ${id || '(no-id)'} ${data.mode || ''} ${duration_ms}ms\n`);
    } catch (e) {
      const row = {
        ts: new Date().toISOString(),
        id,
        source: item.source || null,
        notes: item.notes || null,
        question: q,
        error: e.message,
      };
      out.write(`${JSON.stringify(row)}\n`);
      fail += 1;
      process.stdout.write(`✖ ${id || '(no-id)'} ${e.message}\n`);
    }
  }

  out.end();
  console.log(`Done. ok=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

