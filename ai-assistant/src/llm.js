import fs from 'fs';
import { SYSTEM_POLICY } from './policy.js';

const PROMPT_RULES_PATH = process.env.PROMPT_RULES_PATH || new URL('../prompt-rules.md', import.meta.url).pathname;

function loadPromptRules() {
  try {
    if (!fs.existsSync(PROMPT_RULES_PATH)) return '';
    const raw = fs.readFileSync(PROMPT_RULES_PATH, 'utf-8');
    const lines = raw.split('\n').filter(l => !l.startsWith('#') && l.trim());
    return lines.join('\n').trim();
  } catch (_e) {
    return '';
  }
}

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai_compatible';
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '';
const LLM_BASE_URL = process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const LLM_MODEL = process.env.LLM_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const LLM_TEMPERATURE = Number(process.env.LLM_TEMPERATURE || 0.4);

export function llmAvailable() {
  return Boolean(LLM_API_KEY && LLM_BASE_URL && LLM_MODEL);
}

function formatRefs(refs = []) {
  return refs.map((r, i) => {
    const head = [
      `#${i + 1}`,
      `source_type=${r.source_type}`,
      r.admin ? `admin=${r.admin}` : null,
      r.title ? `title=${r.title}` : null,
      r.url ? `url=${r.url}` : null,
    ].filter(Boolean).join(' | ');
    return `${head}\n${String(r.content || '').slice(0, 1200)}`;
  }).join('\n\n');
}

function formatLinks(links = []) {
  return links.map((x, i) => `${i + 1}. ${x.title}: ${x.url}`).join('\n');
}

export function buildLlmMessages({ question, refs = [], links = [], riskLevel = 'normal', scenario = {} }) {
  const rules = loadPromptRules();

  const system = [
    SYSTEM_POLICY,
    '',
    '你现在处于睡吧助手 v2 模式。',
    '请优先依据管理员建议库，其次参考站内文章，再其次参考相似案例。',
    '相似案例只能辅助理解，不能当成确定结论。',
    '如果 risk_level=high，不要做普通失眠辅导，要优先保护用户安全。',
    '输出要求：',
    '- 语言自然，不要机械模板化',
    '- 回答要贴合当前场景',
    '- 先回应用户最核心的困扰',
    '- 给出 1-3 个可执行下一步',
    '- 如果合适，再给推荐阅读/评估入口',
    ...(rules ? ['', '以下是额外的回答优化规则，必须遵守：', rules] : []),
  ].join('\n');

  const user = [
    `用户问题：${question}`,
    `risk_level=${riskLevel}`,
    `scenario_signals=${JSON.stringify(scenario)}`,
    '',
    '管理员/知识库检索结果：',
    formatRefs(refs) || '（无）',
    '',
    '推荐阅读：',
    formatLinks(links) || '（无）',
    '',
    '请基于以上信息，直接写给用户的最终回复。不要输出分析过程。',
  ].join('\n');

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

async function chatCompletionsCompatible({ messages }) {
  const res = await fetch(`${LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      temperature: LLM_TEMPERATURE,
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `${LLM_PROVIDER} chat completion failed`);
  }

  const answer = data?.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error('empty LLM answer');
  return answer;
}

export async function generateAnswerWithLLM({ question, refs = [], links = [], riskLevel = 'normal', scenario = {} }) {
  if (!llmAvailable()) {
    throw new Error('LLM provider not configured');
  }

  const messages = buildLlmMessages({ question, refs, links, riskLevel, scenario });

  switch (LLM_PROVIDER) {
    case 'openai_compatible':
    case 'openai':
    case 'deepseek':
    case 'qwen':
    case 'moonshot':
    case 'minimax':
    case 'glm':
    case 'doubao':
      return {
        answer: await chatCompletionsCompatible({ messages }),
        model: LLM_MODEL,
        provider: LLM_PROVIDER,
        baseUrl: LLM_BASE_URL,
        messages,
      };
    default:
      throw new Error(`Unsupported LLM_PROVIDER: ${LLM_PROVIDER}`);
  }
}

export function getLlmConfig() {
  return {
    provider: LLM_PROVIDER,
    model: LLM_MODEL,
    base_url: LLM_BASE_URL,
    configured: llmAvailable(),
  };
}
