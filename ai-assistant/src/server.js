import 'dotenv/config';
import express from 'express';
import { retrieveTopChunks, pool, findRelatedArticles, detectRiskLevel } from './retrieve.js';
import { SYSTEM_POLICY } from './policy.js';
import { llmAvailable, generateAnswerWithLLM, buildLlmMessages, getLlmConfig } from './llm.js';
import { logAskEvent } from './log.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(new URL('../public', import.meta.url).pathname));

function pickLine(content = '') {
  const lines = String(content).split(/[\n。！？]/).map(s => s.trim()).filter(s => s.length >= 12);
  return lines[0] || String(content).slice(0, 60);
}

function extractSignals(text = '') {
  return {
    student: /上学|学校|宿舍|室友|学生/.test(text),
    holidayBetter: /放假.*睡眠.*不错|在家.*睡.*不错|回到学校.*入睡困难/.test(text),
    stressNotHigh: /压力.*不大|压力适中/.test(text),
    postpartum: /产后|带孩子|哄睡|宝宝/.test(text),
    medication: /安眠药|停药|减药|药物|褪黑素/.test(text),
    earlyWaking: /早醒|凌晨.*醒|半夜.*醒/.test(text),
    noise: /噪音|呼噜|声音|吵/.test(text),
  };
}

function isLowInfoComplaint(text = '') {
  const q = String(text || '').trim();
  if (!q) return false;
  // Short, emotional complaint with no concrete context.
  const genericComplaint = /(失眠|睡不着|崩溃|好痛苦|太难受|怎么办|绝望|熬不住)/.test(q);
  const hasConcreteContext = /(评估|白天|工作|学习|生活|学生|宿舍|产后|孕期|倒班|噪音|药|安眠药|褪黑素|\d{1,2}[:：点]\d{0,2}|\d+小时)/.test(q);
  return q.length <= 36 && genericComplaint && !hasConcreteContext;
}

function buildCrisisAnswer(question) {
  return [
    '你现在提到“有时候甚至会冒出不想活的念头”，这已经不是普通的失眠困扰了，而是需要马上重视的高风险信号。',
    '',
    '请先不要一个人扛着，优先做这几件事：',
    '1) 立刻联系你身边一个可信任的人，直接告诉对方你现在状态很危险，需要陪伴。',
    '2) 如果你此刻觉得自己可能伤害自己，请立即联系当地急救电话，或者直接去最近的急诊。',
    '3) 把手边可能用于伤害自己的东西移开，不要独处。',
    '',
    '睡眠问题当然重要，但你现在最优先的是安全，不是先把失眠讲明白。',
    '',
    '如果你愿意，也可以先只做一件事：现在就联系一个真人，告诉他“我现在状态不对，需要你陪我”。'
  ].join('\n');
}

function buildAnswer(question, refs, links) {
  const s = extractSignals(question);
  const adminRefs = refs.filter(r => r.source_type === 'admin_guidance');
  const helpRefs = refs.filter(r => r.source_type === 'help_case');
  const articleRefs = refs.filter(r => r.source_type === 'canonical_article' || r.source_type === 'assessment_knowledge');

  const empathy = '你这段描述很真实，也很像很多失眠反复者会经历的状态。先说结论：这通常不等于“你不会睡了”，更像是警觉系统被重新点亮后，对睡眠越用力越卡住。';

  const why = ['先讲机制：'];
  if (s.student) {
    why.push('1) 宿舍/学校这类场景很容易把“上床=必须快点睡着”的压力重新绑定起来。');
    why.push('2) 环境切换、作息变化、对第二天状态的担心，会让入睡门槛暂时升高。');
  } else if (s.postpartum) {
    why.push('1) 产后带孩子时，夜晚往往会和责任、警觉、担心绑定在一起。');
    why.push('2) 一到哄睡或夜里照护的时间点，身体会提前进入紧张和监控状态。');
  } else if (s.medication) {
    why.push('1) 药物本身之外，对“停药后会不会更糟”的恐惧，也很容易维持失眠。');
    why.push('2) 现在更重要的是稳定地看待问题，而不是不停预测最坏结果。');
  } else {
    why.push('1) 当大脑把床和“必须睡着”绑得太紧，困意就容易被监控和焦虑打断。');
    why.push('2) 失眠反复时，问题往往不只是睡眠本身，而是白天状态、情绪和注意力都在一起维持清醒。');
  }
  why.push(s.stressNotHigh ? '3) 不是只有“大压力”才会失眠，轻度担心和持续关注睡眠本身就足以维持问题。' : '3) 越盯着“今晚一定要睡好”，越容易进入监控状态。');

  const actions = ['接下来先做 3 件最有用的事：'];
  if (s.student) {
    actions.push('1) 先做评估，看看自己当前的问题结构，而不是只凭感觉判断。');
    actions.push('2) 优先稳起床时间和白天节律，不先逼自己“必须早点睡着”。');
    actions.push('3) 宿舍里如果长时间清醒，就先离床，等困意回来再躺下。');
  } else if (s.postpartum) {
    actions.push('1) 先把任务拆分，不要把“带孩子 + 必须睡好”绑成一件事。');
    actions.push('2) 如果家里有人能搭手，允许自己阶段性降低夜间任务压力。');
    actions.push('3) 白天尽量承担清晰、可完成的责任，让注意力重新回到生活本身。');
  } else if (s.medication) {
    actions.push('1) 先不要自己做药物剂量判断，也不要反复在网上搜索最坏情况。');
    actions.push('2) 把重点放回白天节律、活动和注意力，而不是整晚盯着“停药后怎么办”。');
    actions.push('3) 如果你正在用药或准备调整药物，最好和线下医生沟通，不要单独凭恐惧做决定。');
  } else {
    actions.push('1) 先稳起床时间，不先逼入睡时间。');
    actions.push('2) 白天继续生活、活动、投入，不把自己放进“病人模式”。');
    actions.push('3) 床上如果长时间清醒，就先离床，等困意回来再睡。');
  }

  const grounding = ['这次回答参考了睡吧知识库：'];
  for (const ref of adminRefs.slice(0, 3)) {
    grounding.push(`- [管理员建议] 《${ref.title || ref.source_id}》：${pickLine(ref.content)}`);
  }
  if (!adminRefs.length) {
    for (const ref of articleRefs.slice(0, 2)) {
      grounding.push(`- [站内知识] 《${ref.title || ref.source_id}》：${pickLine(ref.content)}`);
    }
  }
  for (const ref of helpRefs.slice(0, Math.max(0, 2 - Math.min(2, adminRefs.length)))) {
    grounding.push(`- [相似案例] 《${ref.title || ref.source_id}》：${pickLine(ref.content)}`);
  }

  const reads = [
    '如果你想继续看更系统的内容：',
    ...(links.length
      ? links.map((x, i) => `${i + 1}. ${x.title}：${x.url}`)
      : ['1. 暂未命中特别贴切的站内文章，但知识库已经命中相似内容。'])
  ];

  const boundary = '我不是医生，不做诊断，也不提供药物剂量建议；如果你已经出现明显痛苦升级、自伤想法，或者连续数周严重影响生活，请尽快联系线下专业支持。';

  return [empathy, '', ...why, '', ...actions, '', ...grounding, '', ...reads, '', boundary].join('\n');
}

function mapDisplayReferences(refs = []) {
  return refs.map(r => ({
    source_name: r.source_name,
    source_type: r.source_type,
    source_id: r.source_id,
    title: r.title,
    chunk_index: r.chunk_index,
    hit_score: r.hit_score,
    admin: r.admin || null,
    url: r.url || null,
    preview: String(r.content || '').slice(0, 220)
  }));
}

app.get('/health', async (_req, res) => {
  try {
    if (pool) {
      await pool.query('select 1');
      return res.json({ ok: true, mode: llmAvailable() ? 'llm+postgres+unified-memory' : 'postgres+unified-memory' });
    }
    return res.json({ ok: true, mode: llmAvailable() ? 'llm+unified-memory' : 'unified-memory' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/policy', (_req, res) => {
  res.json({ system_policy: SYSTEM_POLICY, llm_available: llmAvailable(), llm: getLlmConfig() });
});

app.post('/ask', async (req, res) => {
  const startedAt = Date.now();
  try {
    const question = (req.body?.question || '').trim();
    const useLlm = req.body?.use_llm !== false;
    const debug = req.body?.debug === true;
    if (!question) return res.status(400).json({ error: 'question is required' });

    if (isLowInfoComplaint(question)) {
      const answer = '看到了你的留言。仅凭这一句抱怨还无法判断造成失眠的根本原因，也没法给出针对性意见。\n\n睡吧有完整的自助指南，可以仔细阅读失眠者指南，通过睡吧推荐的方式求助：http://hellosleep.net/help';
      const response = {
        question,
        answer,
        related_articles: [
          { title: '睡吧失眠者指南（先看这里）', url: 'https://www.hellosleep.net/help', score: 100 },
        ],
        policy: SYSTEM_POLICY,
        risk_level: detectRiskLevel(question),
        mode: 'intake-guide',
        llm_available: llmAvailable(),
      };
      logAskEvent({
        event: 'ask',
        risk_level: response.risk_level,
        mode: response.mode,
        use_llm: useLlm,
        debug,
        question,
        response_preview: String(answer).slice(0, 400),
        duration_ms: Date.now() - startedAt,
      });
      return res.json(response);
    }

    const riskLevel = detectRiskLevel(question);
    if (riskLevel === 'high') {
      const response = {
        question,
        answer: buildCrisisAnswer(question),
        references: debug ? [] : undefined,
        related_articles: [],
        policy: SYSTEM_POLICY,
        risk_level: riskLevel,
        mode: 'crisis-fallback',
      };

      logAskEvent({
        event: 'ask',
        risk_level: riskLevel,
        mode: response.mode,
        use_llm: useLlm,
        debug,
        question,
        response_preview: String(response.answer || '').slice(0, 400),
        duration_ms: Date.now() - startedAt,
      });

      return res.json(response);
    }

    const refs = await retrieveTopChunks(question, 8);
    const top = refs.slice(0, 6);
    const links = findRelatedArticles(top, question, 2);
    const scenario = extractSignals(question);

    let answer;
    let mode = 'rule-based';
    let llmMeta = null;

    if (useLlm && llmAvailable()) {
      try {
        const llm = await generateAnswerWithLLM({ question, refs: top, links, riskLevel, scenario });
        answer = llm.answer;
        mode = 'llm';
        llmMeta = { provider: llm.provider, model: llm.model };
      } catch (e) {
        answer = buildAnswer(question, top, links);
        mode = 'rule-based-fallback';
        llmMeta = { error: e.message };
      }
    } else {
      answer = buildAnswer(question, top, links);
    }

    const response = {
      question,
      answer,
      related_articles: links,
      policy: SYSTEM_POLICY,
      risk_level: riskLevel,
      mode,
      llm_available: llmAvailable(),
    };

    if (llmMeta) response.llm = llmMeta;
    if (debug) {
      response.references = mapDisplayReferences(top);
      response.prompt_preview = buildLlmMessages({ question, refs: top, links, riskLevel, scenario });
    }

    logAskEvent({
      event: 'ask',
      risk_level: riskLevel,
      mode,
      use_llm: useLlm,
      llm_available: llmAvailable(),
      llm: llmMeta || null,
      debug,
      question,
      scenario,
      references: (top || []).map(r => ({
        source_type: r.source_type,
        source_id: r.source_id,
        title: r.title,
        hit_score: r.hit_score,
        url: r.url || null,
      })),
      related_articles: links,
      response_preview: String(answer || '').slice(0, 400),
      duration_ms: Date.now() - startedAt,
    });

    res.json(response);
  } catch (e) {
    try {
      logAskEvent({
        event: 'ask_error',
        question: (req.body?.question || '').trim(),
        error: e.message,
        duration_ms: Date.now() - startedAt,
      });
    } catch (_ignored) {}
    res.status(500).json({ error: e.message });
  }
});

app.post('/feedback', (req, res) => {
  try {
    const { question, answer, rating, reason, notes } = req.body || {};
    if (!question) return res.status(400).json({ error: 'question is required' });
    logAskEvent({
      event: 'feedback',
      question,
      answer: String(answer || '').slice(0, 600),
      rating: rating || null,
      reason: reason || null,
      notes: notes || '',
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`shuiba-ai-assist listening on :${port}`));
