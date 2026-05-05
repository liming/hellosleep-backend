function pickBool(v) {
  if (v === true) return true;
  if (v === false) return false;
  const s = String(v || '').trim();
  if (!s) return null;
  if (/(是|有|经常|总是|规律|非常|很少|少)/.test(s)) return s;
  return s;
}

function pickNum(v) {
  const n = Number(String(v || '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function normKey(k = '') {
  return String(k || '').trim();
}

function get(a, key) {
  if (!a || typeof a !== 'object') return undefined;
  if (Object.prototype.hasOwnProperty.call(a, key)) return a[key];
  // tolerate English-ish keys in future
  return undefined;
}

export function normalizeAssessment(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (_e) {
      return null;
    }
  }
  if (typeof raw !== 'object') return null;
  return raw;
}

export function assessmentToFacts(assessment) {
  const a = normalizeAssessment(assessment);
  if (!a) return { facts_text: '', facts: {}, flags: {} };

  // Support both {answers:{...}} and flat objects.
  const answers = (a.answers && typeof a.answers === 'object') ? a.answers : a;

  const facts = {
    life_status: get(answers, '生活状态') ?? get(answers, 'life_status') ?? '',
    busy_level: get(answers, '你的生活非常忙碌吗？') ?? get(answers, '生活非常忙碌吗？') ?? get(answers, 'busy_level') ?? '',
    active: get(answers, '生活很丰富活跃吗') ?? get(answers, '生活很丰富活跃吗？') ?? get(answers, 'active') ?? '',
    long_in_bedroom: get(answers, '你总是长时间呆在卧室吗？') ?? get(answers, 'long_in_bedroom') ?? '',
    long_in_bed: get(answers, '你总是长时间呆在床上吗？（比如玩手机）') ?? get(answers, '你总是长时间呆在床上吗？（比如玩手机）：') ?? get(answers, 'long_in_bed') ?? '',
    hard_focus: get(answers, '你是不是很难专心工作（或学习）？') ?? get(answers, 'hard_focus') ?? '',
    low_efficiency: get(answers, '你的工作（或学习）效率是不是很低？') ?? get(answers, 'low_efficiency') ?? '',
    social_low: get(answers, '你是不是很少和同事（或同学）交流？') ?? get(answers, 'social_low') ?? '',
    tried_sleep_hours: pickNum(get(answers, '晚上试图睡觉时间有多少？') ?? get(answers, 'tried_sleep_hours')),
    actual_sleep_hours: pickNum(get(answers, '晚上的实际睡眠时间有多少？') ?? get(answers, 'actual_sleep_hours')),
    noon_sleep_hours: pickNum(get(answers, '中午的睡眠时间有多少？') ?? get(answers, 'noon_sleep_hours')),
    exercise_regular: pickBool(get(answers, '你会有规律的运动吗?') ?? get(answers, 'exercise_regular')),
    wake_regular: pickBool(get(answers, '你的早起时间有规律吗?') ?? get(answers, 'wake_regular')),
  };

  const flags = {
    retired_and_idle: /退休/.test(String(facts.life_status || '')) && /清闲|不忙|非常清闲/.test(String(facts.busy_level || '')),
    long_bedroom_or_bed: /是/.test(String(facts.long_in_bedroom || '')) || /是/.test(String(facts.long_in_bed || '')),
    low_activity: /不活跃|不丰富/.test(String(facts.active || '')),
    sleep_mismatch: (facts.tried_sleep_hours != null && facts.actual_sleep_hours != null)
      ? (facts.tried_sleep_hours - facts.actual_sleep_hours >= 2)
      : false,
  };

  const lines = [];
  const push = (k, v) => {
    if (v === null || v === undefined || v === '') return;
    lines.push(`${k}：${v}`);
  };

  push('生活状态', facts.life_status);
  push('忙碌程度', facts.busy_level);
  push('活跃程度', facts.active);
  push('长时间在卧室', facts.long_in_bedroom);
  push('长时间在床上', facts.long_in_bed);
  if (facts.tried_sleep_hours != null) push('试图睡觉', `${facts.tried_sleep_hours}小时`);
  if (facts.actual_sleep_hours != null) push('实际睡眠', `${facts.actual_sleep_hours}小时`);
  if (facts.noon_sleep_hours != null) push('午睡', `${facts.noon_sleep_hours}小时`);
  push('早起规律', facts.wake_regular);
  push('运动规律', facts.exercise_regular);

  const facts_text = lines.join('\n');
  return { facts_text, facts, flags };
}

