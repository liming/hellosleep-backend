import questionsData from '../../../shared/data/assessment-questions.json';
import tagsData from '../../../shared/data/assessment-tags.json';

export interface Question {
  id: string;
  text: string;
  type: 'single_choice' | 'scale' | 'number' | 'time' | 'text' | 'email' | 'date';
  category: string;
  required: boolean;
  options?: Array<{ value: string; text: string }>;
  depends?: { questionId: string; value: string };
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
}

export interface Tag {
  name: string;
  text: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  recommendation: {
    title: string;
    content: string;
    tutorialLink?: string;
  };
  match: (answers: Record<string, string>) => boolean;
}

const PRIORITY_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 };

const POINT_MAP: Record<string, number> = {
  best: 5, good: 4, normal: 3, little: 2, none: 1,
  very_high: 1, high: 2, low: 4, very_low: 5,
  very_active: 5, active: 4, inactive: 2, very_inactive: 1,
};

function getSleepHours(sleeptime: string, getuptime: string, hourstosleep: string): number {
  const hours = parseFloat(hourstosleep);
  if (hours > 0) return hours;
  if (sleeptime && getuptime) {
    try {
      const sleep = new Date(`2000-01-01T${sleeptime}`);
      const getup = new Date(`2000-01-01T${getuptime}`);
      if (getup <= sleep) getup.setDate(getup.getDate() + 1);
      return Math.round(Math.abs(getup.getTime() - sleep.getTime()) / 36000) / 100;
    } catch {
      return 0;
    }
  }
  return 0;
}

export const questions: Question[] = questionsData as Question[];

export const tags: Tag[] = (tagsData as Omit<Tag, 'match'>[]).map((meta) => {
  let match: (answers: Record<string, string>) => boolean;

  switch (meta.name) {
    case 'sleep_inefficiency':
      match = (a) => {
        const timeInBed = getSleepHours(a.sleeptime, a.getuptime, a.hourstosleep);
        const actual = parseFloat(a.hourstofallinsleep) || 0;
        return timeInBed > 0 && actual / timeInBed < 0.85;
      };
      break;

    case 'irregular_schedule':
      match = (a) => a.sleepregular === 'no';
      break;

    case 'poor_sleep_quality':
      match = (a) => a.sleep_quality === 'poor' || a.sleep_quality === 'very_poor';
      break;

    case 'unhealthy_lifestyle':
      match = (a) => {
        const sport = POINT_MAP[a.sport] ?? 3;
        const sunshine = POINT_MAP[a.sunshine] ?? 3;
        return sport + sunshine < 4;
      };
      break;

    case 'idle_lifestyle':
      match = (a) => {
        const pressure = POINT_MAP[a.pressure] ?? 3;
        const lively = POINT_MAP[a.lively] ?? 3;
        return pressure + lively < 5;
      };
      break;

    case 'bedroom_overuse':
      match = (a) => a.bedroom === 'yes' || a.bed === 'yes';
      break;

    case 'prenatal':
      match = (a) => a.status === 'prenatal';
      break;

    case 'postnatal':
      match = (a) => a.status === 'postnatal';
      break;

    case 'student_issues':
      match = (a) => a.status === 'study' && (a.holiday === 'yes' || a.bedtimeearly === 'yes');
      break;

    case 'shift_work':
      match = (a) => a.shiftwork === 'yes' && a.sleepregular === 'no';
      break;

    case 'maladaptive_behaviors': {
      const behaviorKeys = ['irresponsible', 'inactive', 'excessive_rest', 'complain', 'ignore', 'medicine'];
      match = (a) => behaviorKeys.filter((k) => a[k] === 'yes').length >= 3;
      break;
    }

    case 'excessive_complaining':
      match = (a) => a.complain === 'yes';
      break;

    case 'medication_use':
      match = (a) => a.medicine === 'yes';
      break;

    case 'noise_problem':
      match = (a) => a.noise === 'no';
      break;

    case 'partner_snoring':
      match = (a) => a.noisereason === 'snore';
      break;

    default:
      match = () => false;
  }

  return { ...meta, match } as Tag;
});

export function getVisibleQuestions(
  qs: Question[],
  answers: Record<string, string>
): Question[] {
  return qs.filter((q) => !q.depends || answers[q.depends.questionId] === q.depends.value);
}

export function processAssessment(answers: Record<string, string>): Tag[] {
  const visibleIds = new Set(getVisibleQuestions(questions, answers).map((q) => q.id));
  const cleanAnswers = Object.fromEntries(
    Object.entries(answers).filter(([key]) => visibleIds.has(key))
  );
  return tags
    .filter((tag) => tag.match(cleanAnswers))
    .sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
}
