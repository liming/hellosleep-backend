// Enhanced static assessment questions and tags
// Based on sleep science and improved assessment logic

export interface StaticQuestion {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'scale' | 'text' | 'number' | 'email' | 'date' | 'time';
  category: 'basic_info' | 'sleep_habits' | 'lifestyle' | 'work_study' | 'attitude' | 'environment';
  required: boolean;
  options?: Array<{
    id?: string; // Legacy compatibility
    value: string;
    text: string;
    score?: number;
  }>;
  depends?: {
    questionId: string;
    value: string;
  };
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  weight?: number; // Legacy compatibility
  hint?: string; // Legacy compatibility
}

export interface StaticTag {
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
  severity: 'mild' | 'moderate' | 'severe';
  recommendation: {
    title: string;
    content: string;
    tutorialLink?: string;
  };
}

export const staticQuestions: StaticQuestion[] = [
  // Basic Information
  {
    id: 'status',
    text: '您当前的生活状态是？',
    type: 'single_choice',
    category: 'basic_info',
    required: true,
    options: [
      { id: 'work', value: 'work', text: '工作', score: 3 },
      { id: 'study', value: 'study', text: '上学', score: 2 },
      { id: 'unemployed', value: 'unemployed', text: '待业', score: 1 },
      { id: 'prenatal', value: 'prenatal', text: '孕期', score: 4 },
      { id: 'postnatal', value: 'postnatal', text: '产后', score: 4 },
      { id: 'retire', value: 'retire', text: '退休', score: 3 }
    ]
  },
  {
    id: 'age_group',
    text: '您的年龄段是？',
    type: 'single_choice',
    category: 'basic_info',
    required: true,
    options: [
      { id: '18-25', value: '18-25', text: '18-25岁', score: 2 },
      { id: '26-35', value: '26-35', text: '26-35岁', score: 3 },
      { id: '36-45', value: '36-45', text: '36-45岁', score: 4 },
      { id: '46-55', value: '46-55', text: '46-55岁', score: 3 },
      { id: '55+', value: '55+', text: '55岁以上', score: 2 }
    ]
  },

  // Sleep Habits
  {
    id: 'sleepregular',
    text: '您的作息时间规律吗？',
    type: 'single_choice',
    category: 'sleep_habits',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '规律', score: 3 },
      { id: 'no', value: 'no', text: '不规律', score: 1 }
    ]
  },
  {
    id: 'sleeptime',
    text: '通常几点睡觉？',
    type: 'time',
    category: 'sleep_habits',
    required: false,
    depends: {
      questionId: 'sleepregular',
      value: 'yes'
    }
  },
  {
    id: 'getuptime',
    text: '通常几点起床？',
    type: 'time',
    category: 'sleep_habits',
    required: false,
    depends: {
      questionId: 'sleepregular',
      value: 'yes'
    }
  },
  {
    id: 'hourstosleep',
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
    unit: '小时'
  },
  {
    id: 'hourstofallinsleep',
    text: '晚上的实际睡眠时间有多少？',
    type: 'number',
    category: 'sleep_habits',
    required: true,
    min: 0,
    max: 12,
    step: 0.5,
    unit: '小时'
  },
  {
    id: 'sleep_quality',
    text: '您觉得自己的睡眠质量如何？',
    type: 'single_choice',
    category: 'sleep_habits',
    required: true,
    options: [
      { id: 'excellent', value: 'excellent', text: '很好', score: 5 },
      { id: 'good', value: 'good', text: '良好', score: 4 },
      { id: 'fair', value: 'fair', text: '一般', score: 3 },
      { id: 'poor', value: 'poor', text: '较差', score: 2 },
      { id: 'very_poor', value: 'very_poor', text: '很差', score: 1 }
    ]
  },

  // Lifestyle
  {
    id: 'sport',
    text: '您会有规律的运动吗？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'best', value: 'best', text: '有规律且强度适中', score: 5 },
      { id: 'good', value: 'good', text: '有规律但强度较低', score: 4 },
      { id: 'normal', value: 'normal', text: '偶尔运动', score: 3 },
      { id: 'little', value: 'little', text: '很少运动', score: 2 },
      { id: 'none', value: 'none', text: '不运动', score: 1 }
    ]
  },
  {
    id: 'sunshine',
    text: '您每天接触阳光的时间是？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'best', value: 'best', text: '2小时以上', score: 5 },
      { id: 'good', value: 'good', text: '1-2小时', score: 4 },
      { id: 'normal', value: 'normal', text: '30分钟-1小时', score: 3 },
      { id: 'little', value: 'little', text: '15-30分钟', score: 2 },
      { id: 'none', value: 'none', text: '很少接触', score: 1 }
    ]
  },
  {
    id: 'pressure',
    text: '您当前的生活压力水平是？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'very_high', value: 'very_high', text: '压力很大', score: 1 },
      { id: 'high', value: 'high', text: '压力较大', score: 2 },
      { id: 'normal', value: 'normal', text: '压力适中', score: 3 },
      { id: 'low', value: 'low', text: '压力较小', score: 4 },
      { id: 'very_low', value: 'very_low', text: '压力很小', score: 5 }
    ]
  },
  {
    id: 'lively',
    text: '您的生活丰富度和活跃度如何？',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'very_active', value: 'very_active', text: '非常丰富活跃', score: 5 },
      { id: 'active', value: 'active', text: '比较丰富活跃', score: 4 },
      { id: 'normal', value: 'normal', text: '一般', score: 3 },
      { id: 'inactive', value: 'inactive', text: '不太活跃', score: 2 },
      { id: 'very_inactive', value: 'very_inactive', text: '很单调', score: 1 }
    ]
  },

  // Environment
  {
    id: 'bedroom',
    text: '您总是长时间呆在卧室吗？',
    type: 'single_choice',
    category: 'environment',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'bed',
    text: '您总是长时间呆在床上吗？（比如玩手机）',
    type: 'single_choice',
    category: 'environment',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'noise',
    text: '您的睡眠环境安静吗？',
    type: 'single_choice',
    category: 'environment',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '安静', score: 3 },
      { id: 'no', value: 'no', text: '不安静', score: 1 }
    ]
  },
  {
    id: 'noisereason',
    text: '影响睡眠环境的因素是什么？',
    type: 'single_choice',
    category: 'environment',
    required: false,
    depends: {
      questionId: 'noise',
      value: 'no'
    },
    options: [
      { id: 'snore', value: 'snore', text: '伴侣打呼噜', score: 1 },
      { id: 'neighbour', value: 'neighbour', text: '邻居吵闹', score: 1 },
      { id: 'roommate', value: 'roommate', text: '室友吵闹', score: 1 },
      { id: 'traffic', value: 'traffic', text: '交通噪音', score: 1 },
      { id: 'others', value: 'others', text: '其他', score: 1 }
    ]
  },

  // Work/Study Specific
  {
    id: 'shiftwork',
    text: '您的工作需要倒班吗？',
    type: 'single_choice',
    category: 'work_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'work'
    },
    options: [
      { id: 'yes', value: 'yes', text: '需要', score: 1 },
      { id: 'no', value: 'no', text: '不需要', score: 3 }
    ]
  },
  {
    id: 'holiday',
    text: '您的失眠发生在寒暑假吗？',
    type: 'single_choice',
    category: 'work_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'study'
    },
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'bedtimeearly',
    text: '您总是比室友睡得早吗？',
    type: 'single_choice',
    category: 'work_study',
    required: false,
    depends: {
      questionId: 'status',
      value: 'study'
    },
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 2 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },

  // Attitude and Behavior
  {
    id: 'irresponsible',
    text: '失眠后您是不是刻意减少或者放弃工作/学习？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'inactive',
    text: '失眠后您是不是减少或放弃很多社交活动或者运动？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'excessive_rest',
    text: '失眠后您是不是总是在找机会休息？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'complain',
    text: '您会不会总是抱怨或者哭诉失眠？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'ignore',
    text: '失眠后您是不是很少关心亲人和朋友？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  },
  {
    id: 'medicine',
    text: '您是不是去看病或者服用了安眠的药物？',
    type: 'single_choice',
    category: 'attitude',
    required: true,
    options: [
      { id: 'yes', value: 'yes', text: '是', score: 1 },
      { id: 'no', value: 'no', text: '不是', score: 3 }
    ]
  }
];

export const staticTags: StaticTag[] = [
  // Sleep-related tags
  {
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
    severity: 'moderate',
    recommendation: {
      title: '合理提高睡眠效率',
      content: '对失眠的人最重要的是提高自己的睡眠效率，而不是花很长时间努力睡觉却翻来覆去无法入睡。请阅读并实践『如何提高睡眠效率』，让自己避免躺在床上却无法入睡的时间。',
      tutorialLink: '/article/g5cdnwrbtd8y9lr84vnt1693'
    }
  },
  {
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
    severity: 'moderate',
    recommendation: {
      title: '按时早起',
      content: '常常因为睡得不好而补觉，这是很糟糕的做法。在早晨补觉会有两种后果：1. 推迟一天的生活，从而推迟晚上入睡的时间。会发现自己很晚也没有充足的困意。2. 打乱生活节奏，打乱自己的计划。按时早起是一天的节拍器，它定义了我们一天的生活和作息时间。所以，不论晚上睡得如何，按时早起是必须的。',
      tutorialLink: '/article/u0wryasakus7fooak57kx1zl'
    }
  },
  {
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
    severity: 'moderate',
    recommendation: {
      title: '改善睡眠环境',
      content: '睡眠质量差往往与睡眠环境、生活习惯和心理状态有关。建议保持卧室安静、黑暗、凉爽，避免在床上进行非睡眠活动，建立规律的睡前仪式，放松心情。',
      tutorialLink: '/article/c11i32ibrcteqrb0ce228zkx'
    }
  },

  // Lifestyle tags
  {
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
    severity: 'moderate',
    recommendation: {
      title: '健康的生活方式',
      content: '许多人认为失眠只是心理问题，实际上我们的身心紧密相联，任何身体上的不适都会产生心理变化，任何心理问题也都对身体有间接影响。失眠终归是我们身心不健康的产物，想要走出失眠，就要改善自己的身心状态。通常，缺乏运动、缺少阳光、不自制的生活会侵蚀自己的身体，我们需要长期规律的锻炼和健康的生活方式让自己的身体保持良好状态。',
      tutorialLink: '/article/e9rwh72tv2duvzuj0v5p3zpw'
    }
  },
  {
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
    severity: 'mild',
    recommendation: {
      title: '充实生活',
      content: '睡眠最根本的目的，是为了消除一天劳作带来的疲劳，恢复我们身体和精神的能量。理解睡眠是一种需求，我们就应该明白为什么清闲的生活反而更容易失眠。因为无所事事的状态中大脑和身体的活跃度非常低，一直处于休息的状态，所以到了入睡的时间难以产生困意。',
      tutorialLink: '/article/v56rvd5dunn3ksi8jekukvyr'
    }
  },
  {
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
    severity: 'moderate',
    recommendation: {
      title: '合理利用卧室',
      content: '几乎每个失眠患者无一例外都会采取错误的手段对待失眠，其一是在床上呆更长的时间，以便延长自己的睡眠时间；其二是不停得翻来覆去寻找合适的姿势入睡。这样做的是不正确的，后果很严重。因为我们在床上花了许多"无法入睡"的时间，渐渐的床铺会成为一个"睡不着觉"的存在。',
      tutorialLink: '/article/c11i32ibrcteqrb0ce228zkx'
    }
  },

  // Special population tags
  {
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
    severity: 'moderate',
    recommendation: {
      title: '孕期',
      content: '几乎每个准妈妈都会失眠。怀孕的中后期因为生理上的种种变化，以及生活和工作的种种变化，失眠会成为家常便饭。虽然每个准吗啊都希望消除孕期失眠，但是这并不现实，而且没有必要，你需要做的只是承受暂时的失眠，健康和规律的度过每一天的生活。',
      tutorialLink: '/article/u7c9ql8s5v6k6wpqg7in9x85'
    }
  },
  {
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
    severity: 'moderate',
    recommendation: {
      title: '产后',
      content: '产后妈妈是最常见的失眠人群。在睡吧进行咨询的10个人中大概4个会是产后妈妈。所以，妈妈们，你们并不孤单，也不必惊慌失措。',
      tutorialLink: '/article/eejvu3vc2iu7fce35x3eo869'
    }
  },
  {
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
    severity: 'mild',
    recommendation: {
      title: '改善大学生活',
      content: '失眠是身心状态不佳的表现，是不均衡生活的产物。大学生活中，许多学生缺乏目标，生活非常散漫，很难让自己保持健康、均衡、活跃的生活状态，失眠就不足为奇了。',
      tutorialLink: '/article/sa9yqxtu6s64e95b5ev2udgv'
    }
  },
  {
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
    severity: 'moderate',
    recommendation: {
      title: '适应作息',
      content: '「并不是工作和生活的形式让一个人失眠，而是错误的对待自己的工作和生活让一个人失眠」。一定要弄明白这两点的区别。同样的工作，有些人积极和主动，有些人懒散和被动，就会有很大区别。事实上，因为倒班失眠求助的人非常少，并不是今天上白班明天上夜班的人就容易失眠。',
      tutorialLink: '/article/lclrz6kaneqk59scj95dz4vc'
    }
  },

  // Behavioral tags
  {
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
    severity: 'severe',
    recommendation: {
      title: '放弃为失眠努力',
      content: '可以想象，失眠就像是一根柱子，而失眠所带来的焦虑和担忧就像是一根绳子，这根绳子一端绑在柱子上，一端套在脖子上，我们就这样被栓住，每天都在围绕失眠转圈。一方面为失眠做各种各样的努力，另一方面也为失眠放弃了许多自己的责任。当我们的生活被失眠所左右，就会逐渐陷入慢性失眠。',
      tutorialLink: '/article/kqlrwhal1t4x650mmgjajiwk'
    }
  },
  {
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
    severity: 'mild',
    recommendation: {
      title: '终止抱怨',
      content: '许多人失眠之后，都会先给自己最亲近的人抱怨或者哭诉。而试想当自己的家人、朋友或者同事日复一日听到无精打采的你说自己睡不着，他们会有怎样的反应呢？事实上，当我们说出来：失眠很痛苦，我很绝望。失眠的痛苦不仅在我们心中扎根，而且在听到或者看到这句话的人心中扎根。',
      tutorialLink: '/article/ianc38uy3d2tyiz3dpsqbvoo'
    }
  },
  {
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
    severity: 'moderate',
    recommendation: {
      title: '药物',
      content: '药物对治失眠非常流行，却并不能带来明显的效果。通常安眠药在开始的几天是好用的，但是效果会越来越不明显，而当我们停止服用安眠药，失眠会更加严重。主要原因是因为药物只是针对失眠的现象，并不对治造成失眠的根本原因。',
      tutorialLink: '/article/i865rmsgjmelf8evdf8ucqzb'
    }
  },

  // Environmental tags
  {
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
    severity: 'moderate',
    recommendation: {
      title: '尝试合理沟通',
      content: '远亲不如近邻，每一个邻居都是自己的至亲。当我们的睡眠被自己的邻里所打扰，最不应该做的事情是去指责和对峙。在我们抱怨邻居不顾及他人感受的时候，也应该考虑自己是不是很好的维持邻里之间的关系。',
      tutorialLink: '/article/5d8821b0ae87d938157bb233'
    }
  },
  {
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
    severity: 'moderate',
    recommendation: {
      title: '合理对待噪音',
      content: '这世界上有20%的成年人打鼾，成年男子打鼾的几率是25%，随着年龄的增长打呼噜的比例也会不断增加。所以我们每个人都有很大几率遇到打呼噜的室友或者伴侣。有些人因为呼噜声睡不着，却并不是每个人都被困扰。我们完全可以通过自身的调整走出对呼噜声的执着。',
      tutorialLink: '/article/5d8821b0ae87d938157bb233'
    }
  }
];

// Helper functions
export function getQuestionsByCategory(category: string): StaticQuestion[] {
  return staticQuestions.filter(q => q.category === category);
}

export function getTagsByCategory(category: string): StaticTag[] {
  return staticTags.filter(t => t.category === category);
}

export function getTagsByPriority(priority: string): StaticTag[] {
  return staticTags.filter(t => t.priority === priority);
}

export function getQuestionById(id: string): StaticQuestion | undefined {
  return staticQuestions.find(q => q.id === id);
}

export function getTagByName(name: string): StaticTag | undefined {
  return staticTags.find(t => t.name === name);
}

// Legacy compatibility functions for assessment-questions.ts
export interface AssessmentSection {
  id: string;
  name: string;
  description: string;
  order: number;
  questions: string[]; // Question IDs in this section
}

// Create sections based on categories
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
    description: '工作和学习',
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

// Legacy compatibility functions
export function getAllQuestionsOrdered(): StaticQuestion[] {
  // Sort questions by category order, then by their position in the array
  const categoryOrder = ['basic_info', 'sleep_habits', 'lifestyle', 'environment', 'work_study', 'attitude'];
  return [...staticQuestions].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    // If same category, maintain original order
    return staticQuestions.indexOf(a) - staticQuestions.indexOf(b);
  });
}

export function getAllSectionsOrdered(): AssessmentSection[] {
  return [...assessmentSections].sort((a, b) => a.order - b.order);
}

export function getQuestionsBySection(sectionId: string): StaticQuestion[] {
  return staticQuestions.filter(q => q.category === sectionId);
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

// Legacy type aliases for compatibility
export type AssessmentQuestion = StaticQuestion;
export const assessmentQuestions = staticQuestions;
