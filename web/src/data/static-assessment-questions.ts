// Unified Assessment System - Questions and Issues
// Consolidated system combining UI flow, issue calculation, and recommendations
// Based on sleep science research and evidence-based interventions

export interface StaticQuestion {
  id: string;
  order: number; // Added for UI ordering
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'scale' | 'text' | 'number' | 'email' | 'date' | 'time';
  category: 'basic_info' | 'sleep_habits' | 'lifestyle' | 'work_study' | 'attitude' | 'environment';
  required: boolean;
  options?: Array<{
    id?: string; // Added for UI compatibility
    value: string;
    text: string;
    score?: number;
  }>;
  depends?: {
    questionId: string;
    value: string;
  };
  placeholder?: string;
  hint?: string; // Added for additional help text
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  unitDescription?: string; // Added for UI display
}

export interface StaticIssue {
  id: string;
  name: string;
  text: string;
  description: string;
  category: 'sleep' | 'lifestyle' | 'work' | 'student' | 'special' | 'behavior' | 'environment';
  priority: 'high' | 'medium' | 'low';
  calc: {
    type: 'simple' | 'function' | 'complex';
    question?: string;
    value?: string;
    func?: string;
    input?: string[];
    conditions?: Array<{
      question: string;
      value: string;
      operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
    }>;
  };
  interventions: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

// Assessment sections for UI organization
export interface AssessmentSection {
  id: string;
  name: string;
  description: string;
  order: number;
  questions: string[]; // Question IDs in this section
}

export const assessmentSections: AssessmentSection[] = [
  {
    id: 'basic_info',
    name: 'basic_info',
    description: '基本信息',
    order: 0,
    questions: ['status', 'age_group']
  },
  {
    id: 'sleep_habits',
    name: 'sleep_habits',
    description: '睡眠习惯',
    order: 1,
    questions: ['sleepregular', 'sleeptime', 'getuptime', 'hourstosleep', 'hourstofallinsleep', 'sleep_quality']
  },
  {
    id: 'lifestyle',
    name: 'lifestyle',
    description: '生活状态',
    order: 2,
    questions: ['sport', 'sunshine', 'pressure', 'lively']
  },
  {
    id: 'environment',
    name: 'environment',
    description: '睡眠环境',
    order: 3,
    questions: ['bedroom', 'bed', 'noise', 'noisereason']
  },
  {
    id: 'work_study',
    name: 'work_study',
    description: '工作学习',
    order: 4,
    questions: ['shiftwork', 'holiday', 'bedtimeearly']
  },
  {
    id: 'attitude',
    name: 'attitude',
    description: '对待失眠的方式',
    order: 5,
    questions: ['irresponsible', 'inactive', 'excessive_rest', 'complain', 'ignore', 'medicine']
  }
];

export const staticQuestions: StaticQuestion[] = [
  // Basic Information
  {
    id: 'status',
    order: 1,
    text: '您当前的生活状态是？',
    type: 'single_choice',
    category: 'basic_info',
    required: true,
    options: [
      { value: 'work', text: '工作', score: 3 },
      { value: 'study', text: '上学', score: 2 },
      { value: 'unemployed', text: '待业', score: 1 },
      { value: 'prenatal', text: '孕期', score: 4 },
      { value: 'postnatal', text: '产后', score: 4 },
      { value: 'retire', text: '退休', score: 3 }
    ]
  },
  {
    id: 'age_group',
    order: 2,
    text: '您的年龄段是？',
    type: 'single_choice',
    category: 'basic_info',
    required: true,
    options: [
      { value: '18-25', text: '18-25岁', score: 2 },
      { value: '26-35', text: '26-35岁', score: 3 },
      { value: '36-45', text: '36-45岁', score: 4 },
      { value: '46-55', text: '46-55岁', score: 3 },
      { value: '55+', text: '55岁以上', score: 2 }
    ]
  },

  // Sleep Habits
  {
    id: 'sleepregular',
    order: 3,
    text: '您的作息时间规律吗？',
    type: 'single_choice',
    category: 'sleep_habits',
    required: true,
    options: [
      { value: 'yes', text: '规律', score: 3 },
      { value: 'no', text: '不规律', score: 1 }
    ]
  },
  {
    id: 'sleeptime',
    order: 4,
    text: '通常几点睡觉？',
    type: 'time',
    category: 'sleep_habits',
    required: false,
    depends: {
      questionId: 'sleepregular',
      value: 'yes'
    },
    placeholder: '例如: 23:00'
  },
  {
    id: 'getuptime',
    order: 5,
    text: '通常几点起床？',
    type: 'time',
    category: 'sleep_habits',
    required: false,
    depends: {
      questionId: 'sleepregular',
      value: 'yes'
    },
    placeholder: '例如: 07:00'
  },
  {
    id: 'hourstosleep',
    order: 6,
    text: '晚上试图睡觉时间有多少？',
    type: 'number',
    category: 'sleep_habits',
    required: false,
    depends: {
      questionId: 'sleepregular',
      value: 'no'
    },
    min: 0,
    max: 15,
    step: 0.5,
    unit: '小时',
    unitDescription: '小时'
  },
  {
    id: 'hourstofallinsleep',
    order: 7,
    text: '晚上的实际睡眠时间有多少？',
    type: 'number',
    category: 'sleep_habits',
    required: true,
    min: 0,
    max: 12,
    step: 0.5,
    unit: '小时',
    unitDescription: '小时'
  },
  {
    id: 'sleep_quality',
    order: 8,
    text: '您觉得自己的睡眠质量如何？',
    type: 'single_choice',
    category: 'sleep_habits',
    required: true,
    options: [
      { value: 'excellent', text: '很好', score: 5 },
      { value: 'good', text: '良好', score: 4 },
      { value: 'fair', text: '一般', score: 3 },
      { value: 'poor', text: '较差', score: 2 },
      { value: 'very_poor', text: '很差', score: 1 }
    ]
  },

  // Lifestyle
  {
    id: 'sport',
    order: 9,
    text: '您会有规律的运动吗？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { value: 'best', text: '有规律且强度适中', score: 5 },
      { value: 'good', text: '有规律但强度较低', score: 4 },
      { value: 'normal', text: '偶尔运动', score: 3 },
      { value: 'little', text: '很少运动', score: 2 },
      { value: 'none', text: '不运动', score: 1 }
    ]
  },
  {
    id: 'sunshine',
    order: 10,
    text: '您每天接触阳光的时间是？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { value: 'best', text: '2小时以上', score: 5 },
      { value: 'good', text: '1-2小时', score: 4 },
      { value: 'normal', text: '30分钟-1小时', score: 3 },
      { value: 'little', text: '15-30分钟', score: 2 },
      { value: 'none', text: '很少接触', score: 1 }
    ]
  },
  {
    id: 'pressure',
    order: 11,
    text: '您当前的生活压力水平是？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    hint: '来自于实际生活和工作繁忙事务的压力，而不是睡眠或心理的压力',
    options: [
      { value: 'very_high', text: '压力很大', score: 1 },
      { value: 'high', text: '压力较大', score: 2 },
      { value: 'normal', text: '压力适中', score: 3 },
      { value: 'low', text: '压力较小', score: 4 },
      { value: 'very_low', text: '压力很小', score: 5 }
    ]
  },
  {
    id: 'lively',
    order: 12,
    text: '您的生活丰富度和活跃度如何？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { value: 'very_active', text: '非常丰富活跃', score: 5 },
      { value: 'active', text: '比较丰富活跃', score: 4 },
      { value: 'normal', text: '一般', score: 3 },
      { value: 'inactive', text: '不太活跃', score: 2 },
      { value: 'very_inactive', text: '很单调', score: 1 }
    ]
  },

  // Environment
  {
    id: 'bedroom',
    order: 13,
    text: '您总是长时间呆在卧室吗？',
    type: 'single_choice',
    category: 'environment',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'bed',
    order: 14,
    text: '您总是长时间呆在床上吗？（比如玩手机）',
    type: 'single_choice',
    category: 'environment',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'noise',
    order: 15,
    text: '您的睡眠环境安静吗？',
    type: 'single_choice',
    category: 'environment',
    required: true,
    options: [
      { value: 'yes', text: '安静', score: 3 },
      { value: 'no', text: '不安静', score: 1 }
    ]
  },
  {
    id: 'noisereason',
    order: 16,
    text: '影响睡眠环境的因素是什么？',
    type: 'single_choice',
    category: 'environment',
    required: false,
    depends: {
      questionId: 'noise',
      value: 'no'
    },
    options: [
      { value: 'snore', text: '伴侣打呼噜', score: 1 },
      { value: 'neighbour', text: '邻居吵闹', score: 1 },
      { value: 'roommate', text: '室友吵闹', score: 1 },
      { value: 'traffic', text: '交通噪音', score: 1 },
      { value: 'others', text: '其他', score: 1 }
    ]
  },

  // Work/Study Specific
  {
    id: 'shiftwork',
    order: 17,
    text: '您的工作需要倒班吗？',
    type: 'single_choice',
    category: 'work_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'work'
    },
    options: [
      { value: 'yes', text: '需要', score: 1 },
      { value: 'no', text: '不需要', score: 3 }
    ]
  },
  {
    id: 'holiday',
    order: 18,
    text: '您的失眠发生在寒暑假吗？',
    type: 'single_choice',
    category: 'work_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'study'
    },
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'bedtimeearly',
    order: 19,
    text: '您总是比室友睡得早吗？',
    type: 'single_choice',
    category: 'work_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'study'
    },
    options: [
      { value: 'yes', text: '是', score: 2 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },

  // Attitude and Behavior
  {
    id: 'irresponsible',
    order: 20,
    text: '失眠后您是不是刻意减少或者放弃工作/学习？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'inactive',
    order: 21,
    text: '失眠后您是不是减少或放弃很多社交活动或者运动？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'excessive_rest',
    order: 22,
    text: '失眠后您是不是总是在找机会休息？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'complain',
    order: 23,
    text: '您会不会总是抱怨或者哭诉失眠？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'ignore',
    order: 24,
    text: '失眠后您是不是很少关心亲人和朋友？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'medicine',
    order: 25,
    text: '您是不是去看病或者服用了安眠的药物？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { value: 'yes', text: '是', score: 1 },
      { value: 'no', text: '不是', score: 3 }
    ]
  }
];

export const staticIssues: StaticIssue[] = [
  // Sleep-related issues
  {
    id: 'sleep_inefficiency',
    name: 'sleep_inefficiency',
    text: '睡眠效率低',
    description: '实际睡眠时间与在床上时间比例过低',
    category: 'sleep',
    priority: 'high',
    calc: {
      type: 'function',
      func: 'calcSleepEfficiency',
      input: ['sleeptime', 'getuptime', 'hourstosleep', 'hourstofallinsleep']
    },
    interventions: ['sleep_restriction', 'stimulus_control', 'sleep_hygiene'],
    severity: 'moderate'
  },
  {
    id: 'irregular_schedule',
    name: 'irregular_schedule',
    text: '作息不规律',
    description: '睡眠时间不固定，影响生物钟',
    category: 'sleep',
    priority: 'high',
    calc: {
      type: 'simple',
      question: 'sleepregular',
      value: 'no'
    },
    interventions: ['sleep_schedule', 'morning_routine', 'light_exposure'],
    severity: 'moderate'
  },
  {
    id: 'poor_sleep_quality',
    name: 'poor_sleep_quality',
    text: '睡眠质量差',
    description: '主观睡眠质量评价较低',
    category: 'sleep',
    priority: 'medium',
    calc: {
      type: 'simple',
      question: 'sleep_quality',
      value: 'poor'
    },
    interventions: ['sleep_environment', 'relaxation_techniques', 'stress_management'],
    severity: 'moderate'
  },

  // Lifestyle issues
  {
    id: 'unhealthy_lifestyle',
    name: 'unhealthy_lifestyle',
    text: '生活方式不健康',
    description: '缺乏运动和阳光接触',
    category: 'lifestyle',
    priority: 'high',
    calc: {
      type: 'function',
      func: 'isHealthy',
      input: ['sport', 'sunshine']
    },
    interventions: ['exercise_program', 'outdoor_activities', 'vitamin_d'],
    severity: 'moderate'
  },
  {
    id: 'idle_lifestyle',
    name: 'idle_lifestyle',
    text: '生活单调',
    description: '生活缺乏压力和丰富度',
    category: 'lifestyle',
    priority: 'medium',
    calc: {
      type: 'function',
      func: 'isIdle',
      input: ['pressure', 'lively']
    },
    interventions: ['social_activities', 'hobbies', 'goal_setting'],
    severity: 'mild'
  },
  {
    id: 'bedroom_overuse',
    name: 'bedroom_overuse',
    text: '卧室过度使用',
    description: '在卧室和床上进行非睡眠活动',
    category: 'lifestyle',
    priority: 'medium',
    calc: {
      type: 'function',
      func: 'isStimuli',
      input: ['bedroom', 'bed']
    },
    interventions: ['stimulus_control', 'bedroom_restriction', 'activity_zones'],
    severity: 'moderate'
  },

  // Special population issues
  {
    id: 'prenatal',
    name: 'prenatal',
    text: '孕期特殊需求',
    description: '孕期睡眠问题需要特殊关注',
    category: 'special',
    priority: 'high',
    calc: {
      type: 'simple',
      question: 'status',
      value: 'prenatal'
    },
    interventions: ['prenatal_sleep_guidance', 'comfort_measures', 'medical_consultation'],
    severity: 'moderate'
  },
  {
    id: 'postnatal',
    name: 'postnatal',
    text: '产后特殊需求',
    description: '产后睡眠问题需要特殊关注',
    category: 'special',
    priority: 'high',
    calc: {
      type: 'simple',
      question: 'status',
      value: 'postnatal'
    },
    interventions: ['postnatal_sleep_guidance', 'support_network', 'medical_consultation'],
    severity: 'moderate'
  },
  {
    id: 'student_issues',
    name: 'student_issues',
    text: '学生特殊问题',
    description: '学生群体特有的睡眠问题',
    category: 'special',
    priority: 'medium',
    calc: {
      type: 'function',
      func: 'hasStudentIssues',
      input: ['status', 'holiday', 'bedtimeearly']
    },
    interventions: ['student_sleep_education', 'schedule_management', 'peer_support'],
    severity: 'mild'
  },
  {
    id: 'shift_work',
    name: 'shift_work',
    text: '倒班工作问题',
    description: '倒班工作导致的睡眠问题',
    category: 'work',
    priority: 'high',
    calc: {
      type: 'function',
      func: 'hasShiftWorkIssues',
      input: ['shiftwork', 'sleepregular']
    },
    interventions: ['shift_work_guidance', 'light_therapy', 'schedule_optimization'],
    severity: 'moderate'
  },

  // Behavioral issues
  {
    id: 'maladaptive_behaviors',
    name: 'maladaptive_behaviors',
    text: '适应不良行为',
    description: '对失眠的适应不良应对方式',
    category: 'behavior',
    priority: 'high',
    calc: {
      type: 'function',
      func: 'isAffected',
      input: ['irresponsible', 'inactive', 'excessive_rest', 'complain', 'ignore', 'medicine']
    },
    interventions: ['cognitive_behavioral_therapy', 'behavior_modification', 'coping_strategies'],
    severity: 'severe'
  },
  {
    id: 'excessive_complaining',
    name: 'excessive_complaining',
    text: '过度抱怨',
    description: '对失眠问题的过度关注和抱怨',
    category: 'behavior',
    priority: 'medium',
    calc: {
      type: 'simple',
      question: 'complain',
      value: 'yes'
    },
    interventions: ['cognitive_restructuring', 'acceptance_therapy', 'mindfulness'],
    severity: 'mild'
  },
  {
    id: 'medication_use',
    name: 'medication_use',
    text: '药物使用',
    description: '使用安眠药物',
    category: 'behavior',
    priority: 'high',
    calc: {
      type: 'simple',
      question: 'medicine',
      value: 'yes'
    },
    interventions: ['medical_consultation', 'medication_review', 'alternative_therapies'],
    severity: 'moderate'
  },

  // Environmental issues
  {
    id: 'noise_problem',
    name: 'noise_problem',
    text: '噪音问题',
    description: '睡眠环境噪音干扰',
    category: 'environment',
    priority: 'medium',
    calc: {
      type: 'simple',
      question: 'noise',
      value: 'no'
    },
    interventions: ['noise_reduction', 'white_noise', 'earplugs', 'communication'],
    severity: 'moderate'
  },
  {
    id: 'partner_snoring',
    name: 'partner_snoring',
    text: '伴侣打鼾',
    description: '伴侣打鼾影响睡眠',
    category: 'environment',
    priority: 'medium',
    calc: {
      type: 'simple',
      question: 'noisereason',
      value: 'snore'
    },
    interventions: ['partner_consultation', 'sleep_position', 'medical_evaluation'],
    severity: 'moderate'
  }
];

// Helper functions
export function getQuestionsByCategory(category: string): StaticQuestion[] {
  return staticQuestions.filter(q => q.category === category);
}

export function getIssuesByCategory(category: string): StaticIssue[] {
  return staticIssues.filter(t => t.category === category);
}

export function getIssuesByPriority(priority: string): StaticIssue[] {
  return staticIssues.filter(t => t.priority === priority);
}

export function getQuestionById(id: string): StaticQuestion | undefined {
  return staticQuestions.find(q => q.id === id);
}

export function getIssueByName(name: string): StaticIssue | undefined {
  return staticIssues.find(t => t.name === name);
}

// UI Helper functions (unified assessment system)
export function getAllQuestionsOrdered(): StaticQuestion[] {
  return [...staticQuestions].sort((a, b) => a.order - b.order);
}

export function getAllSectionsOrdered(): AssessmentSection[] {
  return [...assessmentSections].sort((a, b) => a.order - b.order);
}

export function getQuestionsBySection(sectionId: string): StaticQuestion[] {
  const section = assessmentSections.find(s => s.id === sectionId);
  if (!section) return [];
  
  return section.questions
    .map(questionId => staticQuestions.find(q => q.id === questionId))
    .filter((q): q is StaticQuestion => q !== undefined)
    .sort((a, b) => a.order - b.order);
}

export function shouldShowQuestion(
  question: StaticQuestion,
  answers: Record<string, string>
): boolean {
  if (!question.depends) {
    return true;
  }

  const dependentAnswer = answers[question.depends.questionId];
  return dependentAnswer === question.depends.value;
}

export function getVisibleQuestions(
  questions: StaticQuestion[],
  answers: Record<string, string>
): StaticQuestion[] {
  return questions.filter(question => shouldShowQuestion(question, answers));
}
