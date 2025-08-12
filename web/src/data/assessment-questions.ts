export interface QuestionOption {
  id: string;
  text: string;
  value: string | number;
  score?: number;
}

export interface AssessmentQuestion {
  id: string;
  order: number;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'scale' | 'text' | 'number' | 'email' | 'date';
  options?: QuestionOption[];
  category: string;
  required: boolean;
  weight?: number;
  depends?: {
    questionId: string;
    value: string;
  };
  hint?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  unitDescription?: string;
}

export interface AssessmentSection {
  id: string;
  name: string;
  description: string;
  order: number;
  questions: string[]; // Question IDs in this section
}

// Updated questions based on Strapi 3 structure
export const assessmentQuestions: AssessmentQuestion[] = [
  // Section 1: Basic Information (基本信息)
  {
    id: 'name',
    order: 1,
    text: '昵称',
    type: 'text',
    category: 'basicinfo',
    required: true,
    placeholder: '输入你的昵称'
  },
  {
    id: 'email',
    order: 2,
    text: '邮箱',
    type: 'email',
    category: 'basicinfo',
    required: true,
    placeholder: '输入你的邮箱'
  },
  {
    id: 'birthday',
    order: 3,
    text: '生日',
    type: 'date',
    category: 'basicinfo',
    required: true,
    min: 1940,
    max: 2019
  },
  {
    id: 'gender',
    order: 4,
    text: '性别',
    type: 'single_choice',
    category: 'basicinfo',
    required: true,
    options: [
      { id: 'male', text: '男', value: 'male' },
      { id: 'female', text: '女', value: 'female' }
    ]
  },
  {
    id: 'status',
    order: 5,
    text: '生活状态',
    type: 'single_choice',
    category: 'basicinfo',
    required: true,
    options: [
      { id: 'work', text: '工作', value: 'work' },
      { id: 'study', text: '上学', value: 'study' },
      { id: 'unemployed', text: '待业', value: 'unemployed' },
      { id: 'prenatal', text: '孕期', value: 'prenatal' },
      { id: 'postnatal', text: '产后', value: 'postnatal' },
      { id: 'retire', text: '退休', value: 'retire' }
    ]
  },
  {
    id: 'studydetails',
    order: 6,
    text: '学生生涯',
    type: 'single_choice',
    category: 'basicinfo',
    required: false,
    depends: {
      questionId: 'status',
      value: 'study'
    },
    options: [
      { id: 'highschool', text: '高中', value: 'highschool' },
      { id: 'univercity', text: '大学', value: 'univercity' }
    ]
  },
  {
    id: 'howlong',
    order: 7,
    text: '失眠持续了多久？',
    type: 'single_choice',
    category: 'basicinfo',
    required: true,
    options: [
      { id: 'shortterm', text: '少于一个月', value: 'shortterm' },
      { id: 'midterm', text: '少于一年', value: 'midterm' },
      { id: 'longterm', text: '多于一年', value: 'longterm' },
      { id: 'verylongterm', text: '多于五年', value: 'verylongterm' }
    ]
  },

  // Section 2: Sleep Habits (睡眠习惯)
  {
    id: 'getupregular',
    order: 8,
    text: '你的早起时间有规律吗?',
    type: 'single_choice',
    category: 'sleephabit',
    required: true,
    options: [
      { id: 'yes', text: '规律', value: 'yes' },
      { id: 'no', text: '不规律', value: 'no' }
    ]
  },
  {
    id: 'hourstosleep',
    order: 9,
    text: '晚上试图睡觉时间有多少？',
    type: 'scale',
    category: 'sleephabit',
    required: true,
    min: 0,
    max: 15,
    step: 0.5,
    unit: 'hour',
    unitDescription: '小时'
  },
  {
    id: 'hourstofallinsleep',
    order: 10,
    text: '晚上的实际睡眠时间有多少？',
    type: 'scale',
    category: 'sleephabit',
    required: true,
    min: 0,
    max: 10,
    step: 0.5,
    unit: 'hour',
    unitDescription: '小时'
  },
  {
    id: 'hourstonoonnap',
    order: 11,
    text: '中午的睡眠时间有多少？',
    type: 'scale',
    category: 'sleephabit',
    required: true,
    min: 0,
    max: 3,
    step: 0.5,
    unit: 'hour',
    unitDescription: '小时',
    hint: '这里指的是试图午睡的时间'
  },
  {
    id: 'noise',
    order: 12,
    text: '你的睡眠环境安静吗？',
    type: 'single_choice',
    category: 'sleephabit',
    required: true,
    options: [
      { id: 'yes', text: '安静', value: 'yes' },
      { id: 'no', text: '不安静', value: 'no' }
    ]
  },
  {
    id: 'noisereason',
    order: 13,
    text: '影响睡眠环境的因素是什么？',
    type: 'single_choice',
    category: 'sleephabit',
    required: false,
    depends: {
      questionId: 'noise',
      value: 'no'
    },
    options: [
      { id: 'snore', text: '呼噜声', value: 'snore' },
      { id: 'neighbour', text: '邻居吵闹', value: 'neighbour' },
      { id: 'roommate', text: '室友吵闹', value: 'roommate' },
      { id: 'others', text: '其他', value: 'others' }
    ]
  },

  // Section 3: Lifestyle (生活状态)
  {
    id: 'sport',
    order: 14,
    text: '你会有规律的运动吗?',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'best', text: '很有规律', value: 'best' },
      { id: 'normal', text: '正常', value: 'normal' },
      { id: 'little', text: '不多', value: 'little' },
      { id: 'none', text: '几乎没有', value: 'none' }
    ]
  },
  {
    id: 'sunshine',
    order: 15,
    text: '你是不是很少接触阳光?',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'best', text: '很多', value: 'best' },
      { id: 'normal', text: '正常', value: 'normal' },
      { id: 'little', text: '不多', value: 'little' },
      { id: 'none', text: '几乎没有', value: 'none' }
    ]
  },
  {
    id: 'pressure',
    order: 16,
    text: '你的生活非常忙碌吗？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    hint: '来自于实际生活和工作繁忙事务的压力，而不是睡眠或心理的压力',
    options: [
      { id: 'best', text: '非常忙碌', value: 'best' },
      { id: 'normal', text: '正常', value: 'normal' },
      { id: 'little', text: '比较清闲', value: 'little' },
      { id: 'none', text: '非常清闲', value: 'none' }
    ]
  },
  {
    id: 'lively',
    order: 17,
    text: '生活很丰富活跃吗',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'best', text: '非常活跃', value: 'best' },
      { id: 'normal', text: '正常', value: 'normal' },
      { id: 'little', text: '不活跃', value: 'little' },
      { id: 'none', text: '一点都不', value: 'none' }
    ]
  },
  {
    id: 'bedroom',
    order: 18,
    text: '你总是长时间呆在卧室吗？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'bed',
    order: 19,
    text: '你总是长时间呆在床上吗？（比如玩手机）',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },

  // Section 4: Work and Study (工作和学习)
  {
    id: 'distraction',
    order: 20,
    text: '你是不是很难专心工作（或学习）？',
    type: 'single_choice',
    category: 'working_study',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'effeciency',
    order: 21,
    text: '你的工作（或学习）效率是不是很低？',
    type: 'single_choice',
    category: 'working_study',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'unsociable',
    order: 22,
    text: '你是不是很少和同事（或同学）交流？',
    type: 'single_choice',
    category: 'working_study',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'shiftwork',
    order: 23,
    text: '你的工作需要倒班吗？',
    type: 'single_choice',
    category: 'working_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'work'
    },
    options: [
      { id: 'yes', text: '需要', value: 'yes' },
      { id: 'no', text: '不需要', value: 'no' }
    ]
  },
  {
    id: 'holiday',
    order: 24,
    text: '你的失眠发生在寒暑假吗？',
    type: 'single_choice',
    category: 'working_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'study'
    },
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'bedtimeearly',
    order: 25,
    text: '你总是比室友睡得早吗？',
    type: 'single_choice',
    category: 'working_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'study'
    },
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },

  // Section 5: Attitude towards Insomnia (对待失眠的方式)
  {
    id: 'irresponsible',
    order: 26,
    text: '失眠后你是不是刻意减少或者放弃工作/学习？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'inactive',
    order: 27,
    text: '失眠后你是不是减少或放弃很多社交活动或者运动？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'excessive_rest',
    order: 28,
    text: '失眠后你是不是总是在找机会休息？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'complain',
    order: 29,
    text: '你会不会总是抱怨或者哭诉失眠？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'ignore',
    order: 30,
    text: '失眠后你是不是很少关心亲人和朋友？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  },
  {
    id: 'medicine',
    order: 31,
    text: '你是不是去看病或者服用了安眠的药物？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', text: '是', value: 'yes' },
      { id: 'no', text: '不是', value: 'no' }
    ]
  }
];

export const assessmentSections: AssessmentSection[] = [
  {
    id: 'basicinfo',
    name: 'basicinfo',
    description: '基本信息',
    order: 0,
    questions: ['name', 'email', 'birthday', 'gender', 'status', 'studydetails', 'howlong']
  },
  {
    id: 'sleephabit',
    name: 'sleephabit',
    description: '睡眠习惯',
    order: 1,
    questions: ['getupregular', 'hourstosleep', 'hourstofallinsleep', 'hourstonoonnap', 'noise', 'noisereason']
  },
  {
    id: 'lifestyle',
    name: 'lifestyle',
    description: '生活状态',
    order: 2,
    questions: ['sport', 'sunshine', 'pressure', 'lively', 'bedroom', 'bed']
  },
  {
    id: 'working_study',
    name: 'working_study',
    description: '工作和学习',
    order: 3,
    questions: ['distraction', 'effeciency', 'unsociable', 'shiftwork', 'holiday', 'bedtimeearly']
  },
  {
    id: 'attitude',
    name: 'attitude',
    description: '对待失眠的方式',
    order: 4,
    questions: ['irresponsible', 'inactive', 'excessive_rest', 'complain', 'ignore', 'medicine']
  }
];

// Helper function to get questions by section
export function getQuestionsBySection(sectionId: string): AssessmentQuestion[] {
  return assessmentQuestions.filter(q => q.category === sectionId);
}

// Helper function to get all questions ordered by sequence
export function getAllQuestionsOrdered(): AssessmentQuestion[] {
  return [...assessmentQuestions].sort((a, b) => a.order - b.order);
}

// Helper function to get sections ordered by sequence
export function getAllSectionsOrdered(): AssessmentSection[] {
  return [...assessmentSections].sort((a, b) => a.order - b.order);
}

// Helper function to check if a question should be shown based on dependencies
export function shouldShowQuestion(
  question: AssessmentQuestion,
  answers: Record<string, string>
): boolean {
  if (!question.depends) {
    return true;
  }

  const dependentAnswer = answers[question.depends.questionId];
  return dependentAnswer === question.depends.value;
}

// Helper function to get visible questions based on current answers
export function getVisibleQuestions(
  questions: AssessmentQuestion[],
  answers: Record<string, string>
): AssessmentQuestion[] {
  return questions.filter(question => shouldShowQuestion(question, answers));
} 