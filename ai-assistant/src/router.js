import { detectRiskLevel } from './retrieve.js';

function isLowInfoComplaint(text = '') {
  const q = String(text || '').trim();
  if (!q) return false;
  const genericComplaint = /(失眠|睡不着|崩溃|好痛苦|太难受|怎么办|绝望|熬不住)/.test(q);
  const hasConcreteContext = /(评估|白天|工作|学习|生活|学生|宿舍|产后|孕期|倒班|噪音|药|安眠药|褪黑素|\d{1,2}[:：点]\d{0,2}|\d+小时)/.test(q);
  return q.length <= 36 && genericComplaint && !hasConcreteContext;
}

function isShortcutRequest(text = '') {
  const q = String(text || '');
  return /(白噪音|助眠音频|助眠歌|助眠app|助眠.*音乐|助眠工具|催眠音频|睡眠.*音频|褪黑素|眼罩|重力毯|助眠方法|快速入睡|能快入睡)/i.test(q);
}

export function routeIntent(question = '') {
  const q = String(question || '').trim();
  const risk = detectRiskLevel(q);
  if (risk === 'high') return { intent: 'crisis', confidence: 1, risk_level: risk };
  if (isLowInfoComplaint(q)) return { intent: 'intake_low_info', confidence: 0.9, risk_level: risk };
  if (isShortcutRequest(q)) return { intent: 'shortcut_request', confidence: 0.8, risk_level: risk };
  return { intent: 'allow_rag', confidence: 0.5, risk_level: risk };
}

