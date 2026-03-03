import actionSuggestions from '../../../shared/data/action-suggestions.json';

export type Answers = Record<string, string>;

export interface RecommendationItem {
  id: string;
  title: string;
  actions: string[];
}

function filterByContext(tagName: string, actions: string[], answers: Answers): string[] {
  if (tagName === 'unhealthy_lifestyle') {
    return actions.filter((item) => {
      if (item.includes('减少压力源')) {
        return !['low', 'very_low'].includes(answers.pressure || '');
      }
      if (item.includes('每天运动')) {
        return !['best', 'good'].includes(answers.sport || '');
      }
      if (item.includes('晒太阳')) {
        return !['best', 'good'].includes(answers.sunshine || '');
      }
      return true;
    });
  }

  if (tagName === 'idle_lifestyle') {
    return actions.filter((item) => {
      if (item.includes('增加社交活动') || item.includes('保持适度忙碌')) {
        return !['very_active', 'active'].includes(answers.lively || '');
      }
      return true;
    });
  }

  return actions;
}

export function getActionsForTag(tagName: string, answers: Answers): string[] {
  const base = actionSuggestions[tagName as keyof typeof actionSuggestions] || [];
  return filterByContext(tagName, base, answers);
}

export function buildTodayActions(tagNames: string[], answers: Answers, limit = 3): string[] {
  return tagNames
    .flatMap((name) => getActionsForTag(name, answers))
    .slice(0, limit);
}
