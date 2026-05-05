import assert from 'assert';
import { routeIntent } from '../src/router.js';
import { decidePolicy } from '../src/policy-engine.js';

function test(name, fn) {
  try {
    fn();
    process.stdout.write(`ok - ${name}\n`);
  } catch (e) {
    process.stderr.write(`not ok - ${name}\n${e.stack}\n`);
    process.exitCode = 1;
  }
}

test('low-info complaint -> template guide_help', () => {
  const r = routeIntent('我失眠了怎么办');
  assert.equal(r.intent, 'intake_low_info');
  const d = decidePolicy({ intent: r.intent, risk_level: r.risk_level });
  assert.equal(d.decision, 'template');
  assert.equal(d.template.mode, 'intake-guide');
});

test('shortcut request -> template guide_help_shortcuts', () => {
  const r = routeIntent('求可下载的白噪音音频');
  assert.equal(r.intent, 'shortcut_request');
  const d = decidePolicy({ intent: r.intent, risk_level: r.risk_level });
  assert.equal(d.decision, 'template');
  assert.ok(String(d.template.answer).includes('睡吧不推荐'));
});

test('normal question -> allow_rag', () => {
  const r = routeIntent('我最近总是早醒，醒了就担心，怎么办？');
  assert.equal(r.intent, 'allow_rag');
  const d = decidePolicy({ intent: r.intent, risk_level: r.risk_level });
  assert.equal(d.decision, 'allow_rag');
});

test('assessment boredom/idle -> template with forced article', () => {
  const text = [
    '这是评估结果：',
    '生活状态：退休',
    '忙碌程度：非常清闲',
    '活跃程度：不活跃',
    '长时间在卧室：是',
    '长时间在床上：是',
    '试图睡觉：6小时',
    '实际睡眠：3小时',
  ].join('\n');
  const r = routeIntent(text);
  assert.equal(r.intent, 'assessment_boredom_idle');
  const d = decidePolicy({ intent: r.intent, risk_level: r.risk_level });
  assert.equal(d.decision, 'template');
  assert.ok(d.template.related_articles?.[0]?.url?.includes('/article/xk9vpbyfd5xahyjujvyd2qr5'));
  assert.ok(String(d.template.answer).includes('缩短'));
  assert.ok(!/按时上床/.test(String(d.template.answer)));
});

