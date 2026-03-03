import actionSuggestions from '../../../shared/data/action-suggestions.json';

export type Answers = Record<string, string>;

export interface RecommendationTag {
  name: string;
  text: string;
  priority: string;
  recommendation: {
    title: string;
    content: string;
    tutorialLink?: string;
  };
}

export interface RecommendationItem {
  id: string;
  text: string;
  priority: string;
  title: string;
  content: string;
  tutorialLink?: string;
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

export function buildRecommendations(tags: RecommendationTag[], answers: Answers): RecommendationItem[] {
  return tags.map((tag) => ({
    id: tag.name,
    text: tag.text,
    priority: tag.priority,
    title: tag.recommendation.title,
    content: tag.recommendation.content,
    tutorialLink: tag.recommendation.tutorialLink,
    actions: getActionsForTag(tag.name, answers),
  }));
}

export function buildTodayActions(tagNames: string[], answers: Answers, limit = 3): string[] {
  const deduped: string[] = [];
  for (const action of tagNames.flatMap((name) => getActionsForTag(name, answers))) {
    if (!deduped.includes(action)) deduped.push(action);
    if (deduped.length >= limit) break;
  }
  return deduped;
}
