import fs from 'fs';

const RULES_PATH = process.env.POLICY_RULES_PATH || new URL('../policy/rules.json', import.meta.url).pathname;

function loadRules() {
  const raw = fs.readFileSync(RULES_PATH, 'utf-8');
  return JSON.parse(raw);
}

function scopeMatches(scope, ctx) {
  if (!scope) return false;
  if (scope === 'intent:*') return true;
  if (scope.startsWith('intent:')) return scope.slice('intent:'.length) === ctx.intent;
  return false;
}

export function decidePolicy(ctx) {
  const ruleset = loadRules();
  const rules = (ruleset.rules || []).filter(r => r.enabled !== false);
  rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  for (const rule of rules) {
    if (!scopeMatches(rule.scope, ctx)) continue;

    if (rule.action === 'template') {
      const t = ruleset.templates?.[rule.template_id];
      if (!t) continue;
      return { decision: 'template', rule_id: rule.id, template: t };
    }
    if (rule.action === 'crisis') {
      return { decision: 'crisis', rule_id: rule.id };
    }
    if (rule.action === 'allow_rag') {
      return { decision: 'allow_rag', rule_id: rule.id };
    }
  }

  return { decision: 'allow_rag', rule_id: 'implicit' };
}

