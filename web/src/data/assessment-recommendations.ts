export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'basicinfo' | 'sleephabit' | 'lifestyle' | 'working_study' | 'attitude' | 'general';
  priority: 'high' | 'medium' | 'low';
  triggers: {
    scoreRange?: [number, number]; // [min, max] score range
    specificAnswers?: {
      questionId: string;
      values: string[];
    }[];
    sectionScores?: {
      sectionId: string;
      minScore: number;
    }[];
  };
  actions: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeRequired: string; // e.g., "5 minutes", "30 minutes"
    frequency: string; // e.g., "daily", "weekly", "once"
  }[];
  resources?: {
    type: 'article' | 'video' | 'app' | 'tool';
    title: string;
    url?: string;
    description: string;
  }[];
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  description: string;
  color: string;
  recommendations: string[]; // Recommendation IDs
}

export const scoreRanges: ScoreRange[] = [
  {
    min: 0,
    max: 3,
    label: '睡眠质量差',
    description: '您的睡眠质量需要显著改善。建议咨询专业医生。',
    color: 'red',
    recommendations: ['consult_doctor', 'sleep_hygiene_basics', 'stress_management']
  },
  {
    min: 4,
    max: 6,
    label: '睡眠质量一般',
    description: '您的睡眠质量有改善空间。以下建议可以帮助您。',
    color: 'orange',
    recommendations: ['sleep_schedule', 'bedroom_environment', 'lifestyle_changes']
  },
  {
    min: 7,
    max: 8,
    label: '睡眠质量良好',
    description: '您的睡眠质量不错，但仍有优化空间。',
    color: 'yellow',
    recommendations: ['sleep_optimization', 'maintenance_tips']
  },
  {
    min: 9,
    max: 10,
    label: '睡眠质量优秀',
    description: '恭喜！您的睡眠质量很好。继续保持良好的习惯。',
    color: 'green',
    recommendations: ['maintenance_tips', 'advanced_optimization']
  }
];

export const recommendations: Recommendation[] = [
  // High Priority - Sleep Habits
  {
    id: 'sleep_schedule',
    title: '建立规律的睡眠时间',
    description: '每天在同一时间上床睡觉和起床，即使在周末也要保持这个习惯。',
    category: 'sleephabit',
    priority: 'high',
    triggers: {
      specificAnswers: [
        {
          questionId: 'getupregular',
          values: ['no']
        }
      ]
    },
    actions: [
      {
        title: '设定固定的睡眠时间',
        description: '选择适合您的睡眠时间，并坚持执行',
        difficulty: 'medium',
        timeRequired: '5分钟',
        frequency: 'daily'
      },
      {
        title: '使用睡眠追踪应用',
        description: '记录您的睡眠模式，了解最佳睡眠时间',
        difficulty: 'easy',
        timeRequired: '2分钟',
        frequency: 'daily'
      }
    ],
    resources: [
      {
        type: 'app',
        title: 'Sleep Cycle',
        description: '智能闹钟应用，帮助您找到最佳起床时间'
      }
    ]
  },

  // High Priority - Sleep Environment
  {
    id: 'sleep_environment',
    title: '改善睡眠环境',
    description: '创建一个有利于睡眠的环境，包括温度、光线和噪音控制。',
    category: 'sleephabit',
    priority: 'high',
    triggers: {
      specificAnswers: [
        {
          questionId: 'noise',
          values: ['no']
        }
      ]
    },
    actions: [
      {
        title: '调整卧室温度',
        description: '保持卧室温度在18-22°C之间',
        difficulty: 'easy',
        timeRequired: '5分钟',
        frequency: 'once'
      },
      {
        title: '减少光线干扰',
        description: '使用遮光窗帘或眼罩',
        difficulty: 'easy',
        timeRequired: '10分钟',
        frequency: 'once'
      },
      {
        title: '控制噪音',
        description: '使用白噪音机或耳塞',
        difficulty: 'easy',
        timeRequired: '5分钟',
        frequency: 'once'
      }
    ]
  },

  // Medium Priority - Lifestyle
  {
    id: 'exercise_improvement',
    title: '增加运动量',
    description: '规律运动有助于改善睡眠质量。',
    category: 'lifestyle',
    priority: 'medium',
    triggers: {
      specificAnswers: [
        {
          questionId: 'sport',
          values: ['little', 'none']
        }
      ]
    },
    actions: [
      {
        title: '开始轻度运动',
        description: '每天进行30分钟的散步或轻度运动',
        difficulty: 'easy',
        timeRequired: '30分钟',
        frequency: 'daily'
      },
      {
        title: '加入运动小组',
        description: '寻找运动伙伴，增加坚持的动力',
        difficulty: 'medium',
        timeRequired: '1小时',
        frequency: 'weekly'
      }
    ]
  },

  {
    id: 'sunlight_exposure',
    title: '增加阳光接触',
    description: '适当的阳光接触有助于调节生物钟。',
    category: 'lifestyle',
    priority: 'medium',
    triggers: {
      specificAnswers: [
        {
          questionId: 'sunshine',
          values: ['little', 'none']
        }
      ]
    },
    actions: [
      {
        title: '户外活动',
        description: '每天在户外活动15-30分钟',
        difficulty: 'easy',
        timeRequired: '15分钟',
        frequency: 'daily'
      },
      {
        title: '调整工作环境',
        description: '将工作台移到靠近窗户的位置',
        difficulty: 'easy',
        timeRequired: '10分钟',
        frequency: 'once'
      }
    ]
  },

  {
    id: 'bedroom_usage',
    title: '改善卧室使用习惯',
    description: '避免在床上进行非睡眠活动。',
    category: 'lifestyle',
    priority: 'medium',
    triggers: {
      specificAnswers: [
        {
          questionId: 'bedroom',
          values: ['yes']
        },
        {
          questionId: 'bed',
          values: ['yes']
        }
      ]
    },
    actions: [
      {
        title: '重新布置卧室',
        description: '将工作区域移出卧室',
        difficulty: 'medium',
        timeRequired: '1小时',
        frequency: 'once'
      },
      {
        title: '限制床上活动',
        description: '只在床上进行睡眠和亲密活动',
        difficulty: 'medium',
        timeRequired: '5分钟',
        frequency: 'daily'
      }
    ]
  },

  // Medium Priority - Work and Study
  {
    id: 'work_efficiency',
    title: '提高工作和学习效率',
    description: '改善专注力和工作效率。',
    category: 'working_study',
    priority: 'medium',
    triggers: {
      specificAnswers: [
        {
          questionId: 'distraction',
          values: ['yes']
        },
        {
          questionId: 'effeciency',
          values: ['yes']
        }
      ]
    },
    actions: [
      {
        title: '番茄工作法',
        description: '使用25分钟专注工作，5分钟休息的方法',
        difficulty: 'medium',
        timeRequired: '25分钟',
        frequency: 'daily'
      },
      {
        title: '减少干扰源',
        description: '关闭手机通知，使用专注模式',
        difficulty: 'easy',
        timeRequired: '2分钟',
        frequency: 'daily'
      }
    ]
  },

  {
    id: 'social_interaction',
    title: '增加社交互动',
    description: '改善与同事和同学的交流。',
    category: 'working_study',
    priority: 'medium',
    triggers: {
      specificAnswers: [
        {
          questionId: 'unsociable',
          values: ['yes']
        }
      ]
    },
    actions: [
      {
        title: '主动交流',
        description: '每天与至少一个同事或同学进行交流',
        difficulty: 'medium',
        timeRequired: '10分钟',
        frequency: 'daily'
      },
      {
        title: '参加团队活动',
        description: '积极参与工作或学习中的团队活动',
        difficulty: 'medium',
        timeRequired: '1小时',
        frequency: 'weekly'
      }
    ]
  },

  // High Priority - Attitude
  {
    id: 'positive_attitude',
    title: '改善对待失眠的态度',
    description: '避免因失眠而过度焦虑或改变正常生活。',
    category: 'attitude',
    priority: 'high',
    triggers: {
      specificAnswers: [
        {
          questionId: 'irresponsible',
          values: ['yes']
        },
        {
          questionId: 'inactive',
          values: ['yes']
        },
        {
          questionId: 'excessive_rest',
          values: ['yes']
        }
      ]
    },
    actions: [
      {
        title: '保持正常作息',
        description: '即使失眠也要保持正常的工作和学习时间',
        difficulty: 'hard',
        timeRequired: '全天',
        frequency: 'daily'
      },
      {
        title: '渐进式恢复',
        description: '逐步恢复社交活动和运动',
        difficulty: 'medium',
        timeRequired: '30分钟',
        frequency: 'daily'
      }
    ]
  },

  {
    id: 'emotional_support',
    title: '寻求情感支持',
    description: '与家人朋友分享感受，寻求理解和支持。',
    category: 'attitude',
    priority: 'medium',
    triggers: {
      specificAnswers: [
        {
          questionId: 'complain',
          values: ['yes']
        },
        {
          questionId: 'ignore',
          values: ['yes']
        }
      ]
    },
    actions: [
      {
        title: '与家人沟通',
        description: '与家人分享失眠的困扰，寻求理解',
        difficulty: 'medium',
        timeRequired: '30分钟',
        frequency: 'weekly'
      },
      {
        title: '寻求专业帮助',
        description: '考虑咨询心理医生或睡眠专家',
        difficulty: 'medium',
        timeRequired: '1小时',
        frequency: 'monthly'
      }
    ]
  },

  // High Priority - Medical
  {
    id: 'consult_doctor',
    title: '咨询专业医生',
    description: '如果睡眠问题持续存在，建议咨询睡眠专家。',
    category: 'attitude',
    priority: 'high',
    triggers: {
      specificAnswers: [
        {
          questionId: 'medicine',
          values: ['yes']
        },
        {
          questionId: 'howlong',
          values: ['longterm', 'verylongterm']
        }
      ]
    },
    actions: [
      {
        title: '预约睡眠专家',
        description: '寻找并预约专业的睡眠医生',
        difficulty: 'medium',
        timeRequired: '30分钟',
        frequency: 'once'
      },
      {
        title: '准备咨询问题',
        description: '列出您想咨询的具体问题',
        difficulty: 'easy',
        timeRequired: '15分钟',
        frequency: 'once'
      }
    ]
  },

  // Low Priority - General
  {
    id: 'sleep_tracking',
    title: '睡眠追踪',
    description: '使用睡眠追踪工具来监控您的睡眠质量。',
    category: 'general',
    priority: 'low',
    triggers: {
      scoreRange: [4, 8]
    },
    actions: [
      {
        title: '选择睡眠追踪工具',
        description: '选择适合您的睡眠追踪应用或设备',
        difficulty: 'easy',
        timeRequired: '15分钟',
        frequency: 'once'
      },
      {
        title: '记录睡眠日志',
        description: '每天记录睡眠时间和质量',
        difficulty: 'easy',
        timeRequired: '2分钟',
        frequency: 'daily'
      }
    ]
  }
];

// Helper function to get recommendations based on answers
export function getRecommendationsForAnswers(
  answers: Record<string, string>,
  sectionScores: Record<string, number>
): Recommendation[] {
  const totalScore = calculateTotalScore(answers);
  const applicableRecommendations: Recommendation[] = [];

  for (const recommendation of recommendations) {
    let shouldInclude = false;

    // Check score range
    if (recommendation.triggers.scoreRange) {
      const [min, max] = recommendation.triggers.scoreRange;
      if (totalScore >= min && totalScore <= max) {
        shouldInclude = true;
      }
    }

    // Check specific answers
    if (recommendation.triggers.specificAnswers) {
      for (const trigger of recommendation.triggers.specificAnswers) {
        const userAnswer = answers[trigger.questionId];
        if (userAnswer && trigger.values.includes(userAnswer)) {
          shouldInclude = true;
          break;
        }
      }
    }

    // Check section scores
    if (recommendation.triggers.sectionScores) {
      for (const trigger of recommendation.triggers.sectionScores) {
        const sectionScore = sectionScores[trigger.sectionId];
        if (sectionScore && sectionScore <= trigger.minScore) {
          shouldInclude = true;
          break;
        }
      }
    }

    if (shouldInclude) {
      applicableRecommendations.push(recommendation);
    }
  }

  // Sort by priority (high -> medium -> low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return applicableRecommendations.sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

// Helper function to calculate total score
export function calculateTotalScore(answers: Record<string, string>): number {
  // This would be implemented based on your scoring logic
  // For now, returning a placeholder
  return 6.5;
} 