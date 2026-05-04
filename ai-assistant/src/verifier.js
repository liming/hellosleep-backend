const FORBIDDEN_PATTERNS = [
  /别去想/i,
  /不要想/i,
  /把注意力从.*(失眠|睡眠)/i,
  /(去看医生|看医生|睡眠科|心理科|精神科)/i
];

export function verifyAnswer({ answer = '', risk_level = 'normal' }) {
  const text = String(answer || '');
  const hits = [];
  for (const p of FORBIDDEN_PATTERNS) {
    if (p.test(text)) hits.push(String(p));
  }
  // In crisis mode we tolerate medical escalation language; but the crisis path is template-based anyway.
  if (risk_level === 'high') return { ok: true, hits: [] };
  return { ok: hits.length === 0, hits };
}

