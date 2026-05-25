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

const BUSY_MAP: Record<string, number> = {
  very_busy: 5, busy: 4, normal: 3, idle: 2, very_idle: 1,
};

const VALUE_ALIASES: Record<string, string> = {
  // common yes/no text values from legacy exports or copied QA text
  '是': 'yes',
  '不是': 'no',
  '规律': 'yes',
  '不规律': 'no',
  '需要': 'yes',
  '不需要': 'no',
  '安静': 'yes',
  '不安静': 'no',

  // busy level
  '非常忙碌': 'very_busy',
  '比较忙碌': 'busy',
  '比较清闲': 'idle',
  '非常清闲': 'very_idle',

  // pressure level
  '压力很大': 'very_high',
  '压力较大': 'high',
  '压力适中': 'normal',
  '压力较小': 'low',
  '压力很小': 'very_low',

  // lively level
  '非常丰富活跃': 'very_active',
  '比较丰富活跃': 'active',
  '不太活跃': 'inactive',
  '很单调': 'very_inactive',

  // sport level
  '有规律且强度适中': 'best',
  '有规律但强度较低': 'good',
  '偶尔运动': 'normal',
  '很少运动': 'little',
  '不运动': 'none',

  // sunshine level
  '2小时以上': 'best',
  '1-2小时': 'good',
  '30分钟-1小时': 'normal',
  '15-30分钟': 'little',
  '很少接触': 'none',
};

function normalizeValue(value: string | undefined): string {
  if (!value) return '';
  return VALUE_ALIASES[value] ?? value;
}

function getSleepHours(sleeptime: string, getuptime: string, hourstosleep: string): number {
  const hours = parseFloat(hourstosleep);
  if (hours > 0) return hours;
  if (sleeptime && getuptime) {
    const isValidTime = (value: string) => /^\d{2}:\d{2}$/.test(value);
    if (!isValidTime(sleeptime) || !isValidTime(getuptime)) return 0;

    try {
      const sleep = new Date(`2000-01-01T${sleeptime}`);
      const getup = new Date(`2000-01-01T${getuptime}`);
      if (getup <= sleep) getup.setDate(getup.getDate() + 1);
      const value = Math.round(Math.abs(getup.getTime() - sleep.getTime()) / 36000) / 100;
      return Number.isFinite(value) ? value : 0;
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
      match = (a) => normalizeValue(a.sleepregular) === 'no';
      break;

    case 'unhealthy_lifestyle':
      match = (a) => {
        const sport = POINT_MAP[normalizeValue(a.sport)] ?? 3;
        const sunshine = POINT_MAP[normalizeValue(a.sunshine)] ?? 3;
        return sport + sunshine < 4;
      };
      break;

    case 'idle_lifestyle':
      match = (a) => {
        const pressure = POINT_MAP[normalizeValue(a.pressure)] ?? 3;
        const lively = POINT_MAP[normalizeValue(a.lively)] ?? 3;
        const busy = BUSY_MAP[normalizeValue(a.busy)] ?? 3;
        return pressure + lively < 5 || busy <= 2;
      };
      break;

    case 'stress':
      match = (a) => {
        const pressure = normalizeValue(a.pressure);
        return pressure === 'very_high' || pressure === 'high';
      };
      break;

    case 'bedroom_overuse':
      match = (a) => normalizeValue(a.bedroom) === 'yes' || normalizeValue(a.bed) === 'yes';
      break;

    case 'prenatal':
      match = (a) => a.status === 'prenatal';
      break;

    case 'postnatal':
      match = (a) => a.status === 'postnatal';
      break;

    case 'student_issues':
      match = (a) =>
        a.status === 'study' &&
        (normalizeValue(a.holiday) === 'yes' || normalizeValue(a.bedtimeearly) === 'yes');
      break;

    case 'shift_work':
      match = (a) => normalizeValue(a.shiftwork) === 'yes' && normalizeValue(a.sleepregular) === 'no';
      break;

    case 'distraction':
      match = (a) => normalizeValue(a.distraction) === 'yes';
      break;

    case 'maladaptive_behaviors': {
      const behaviorKeys = ['irresponsible', 'inactive', 'excessive_rest', 'complain', 'ignore'];
      match = (a) => behaviorKeys.filter((k) => normalizeValue(a[k]) === 'yes').length >= 3;
      break;
    }

    case 'excessive_complaining':
      match = (a) => normalizeValue(a.complain) === 'yes';
      break;

    case 'noise_problem':
      match = (a) => normalizeValue(a.noise) === 'no';
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
