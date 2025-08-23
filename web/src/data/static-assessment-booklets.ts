// HelloSleep Methodology Booklets
// Based on life quality improvement principles
// 
// Follows HelloSleep methodology:
// 1. Non-medical approach - no association with medicine or doctors
// 2. Life quality driven - focus on improving overall quality of life 
// 3. Daily life focus - emphasize daily activities rather than sleep attributes
//
// See HELLOSLEEP_METHODOLOGY.md for detailed principles

export interface StaticBooklet {
  id: string;
  tag: string;
  title: string;
  description: string;
  category: 'sleep' | 'lifestyle' | 'work' | 'student' | 'special' | 'behavior' | 'environment';
  priority: 'high' | 'medium' | 'low';
  severity: 'mild' | 'moderate' | 'severe';
  content: {
    summary: string;
    problem: string;
    solution: string;
    steps: string[];
    tips: string[];
    warnings?: string[];
    resources?: {
      title: string;
      description: string;
      url?: string;
    }[];
  };
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedOutcome: string;
}

export const staticBooklets: StaticBooklet[] = [
  // Sleep-related booklets
  {
    id: 'rest_quality_guide',
    tag: 'sleep_inefficiency',
    title: '优化休息时间管理',
    description: '改善日常休息习惯，提升生活质量',
    category: 'lifestyle',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '高质量的休息来自于充实而有规律的日常生活。当我们的日间活动丰富而有意义时，夜间自然会获得更好的休息。',
      problem: '您可能在休息时间花费过多精力思考或担心，而日间活动可能缺乏足够的充实感和规律性。',
      solution: '通过改善日间生活质量和建立有意义的日常活动来提升整体生活节奏。',
      steps: [
        '制定充实的日间活动计划',
        '建立固定的起床时间和晨间例行程序',
        '增加有意义的日间活动，如工作、社交、兴趣爱好'
      ],
      tips: [
        '专注于白天的生活质量而非夜间的休息状况',
        '培养能让您感到充实和满足的日间活动',
        '建立规律的生活节奏，让身体自然适应'
      ],
      resources: [
        {
          title: '日间活动规划指南',
          description: '如何安排充实有意义的日间活动',
          url: '/resources/daily-activities'
        },
        {
          title: '晨间例行程序建议',
          description: '开启美好一天的晨间习惯',
          url: '/resources/morning-routine'
        }
      ]
    },
    estimatedTime: '2-3周',
    difficulty: 'easy',
    expectedOutcome: '日间精力更充沛，生活更有规律，夜间自然获得更好休息'
  },
  {
    id: 'life_rhythm_guide',
    tag: 'irregular_schedule',
    title: '建立健康生活节奏',
    description: '通过规律的日常活动提升生活质量',
    category: 'lifestyle',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '健康的生活节奏能够自然地调节身心状态，让您在每一天都充满活力和满足感。',
      problem: '不规律的生活节奏可能让您感到疲惫、缺乏方向感，影响日间的精力和心情。',
      solution: '建立规律且充实的日常生活模式，让身心自然地找到最佳状态。',
      steps: [
        '设定固定的起床时间，开启每一天的美好',
        '制定晨间仪式：拉开窗帘，感受自然光线',
        '安排有意义的日间活动和工作'
      ],
      tips: [
        '重视早晨时光，这是一天中最宝贵的时间',
        '让日常活动变得丰富多彩，增加生活的乐趣',
        '保持生活的一致性，让身体建立自然的节奏'
      ],
      resources: [
        {
          title: '生活节奏规划',
          description: '如何建立适合自己的生活节奏',
          url: '/resources/life-rhythm'
        },
        {
          title: '早晨仪式指南',
          description: '开启美好一天的晨间习惯',
          url: '/resources/morning-rituals'
        }
      ]
    },
    estimatedTime: '2-3周',
    difficulty: 'easy',
    expectedOutcome: '建立规律的生活节奏，提升日间精力和整体幸福感'
  },

  // Lifestyle booklets
  {
    id: 'vitality_enhancement_guide',
    tag: 'unhealthy_lifestyle',
    title: '提升生活活力计划',
    description: '通过运动和自然接触增加生活的活力和快乐',
    category: 'lifestyle',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '充满活力的生活来自于与自然的接触、身体的活动和内心的愉悦。当我们的生活充满活力时，身心自然会找到最佳的平衡状态。',
      problem: '您的日常生活可能缺乏足够的身体活动和与自然的接触，这可能让您感到缺乏活力和热情。',
      solution: '增加日常生活中的身体活动和户外时间，让生活变得更加充满活力和乐趣。',
      steps: [
        '寻找您真正喜欢的身体活动',
        '每天安排户外时间，享受自然光线和新鲜空气',
        '将运动融入日常生活，让它成为快乐的一部分'
      ],
      tips: [
        '选择让您感到快乐的运动方式，而不是痛苦的锻炼',
        '重视与自然的接触，户外时光是最好的生活调节剂',
        '与朋友或家人一起运动，增加社交乐趣'
      ],
      resources: [
        {
          title: '快乐运动指南',
          description: '如何让运动成为生活的乐趣',
          url: '/resources/joyful-exercise'
        },
        {
          title: '自然生活方式',
          description: '如何增加与自然的接触',
          url: '/resources/nature-lifestyle'
        }
      ]
    },
    estimatedTime: '3-4周',
    difficulty: 'easy',
    expectedOutcome: '生活更有活力，心情更愉悦，身心自然达到更好的平衡状态'
  },
  {
    id: 'living_space_guide',
    tag: 'bedroom_overuse',
    title: '优化生活空间布局',
    description: '创造更有活力的生活空间，提升日常体验',
    category: 'lifestyle',
    priority: 'medium',
    severity: 'moderate',
    content: {
      summary: '不同的生活空间应该承载不同的生活功能，这样能让我们的日常生活更加丰富多彩，每个空间都有其独特的能量。',
      problem: '如果我们在同一个空间做太多事情，可能会让这个空间失去其特定的功能性，影响我们在该空间的体验和感受。',
      solution: '为不同的活动安排合适的空间，让每个生活区域都能发挥其最佳功能。',
      steps: [
        '规划不同空间的主要功能',
        '为工作、娱乐、休息安排不同的区域',
        '让休息空间保持宁静和舒适的氛围'
      ],
      tips: [
        '让每个空间都有其独特的功能和氛围',
        '在休息空间营造宁静、温馨的环境',
        '为工作和娱乐活动创造专门的舒适空间'
      ],
      resources: [
        {
          title: '生活空间规划',
          description: '如何合理规划不同功能的生活空间',
          url: '/resources/living-space-design'
        },
        {
          title: '舒适环境营造',
          description: '创造温馨舒适的生活环境',
          url: '/resources/comfortable-environment'
        }
      ]
    },
    estimatedTime: '1-2周',
    difficulty: 'easy',
    expectedOutcome: '生活空间更有序，每个区域都能提供更好的生活体验'
  },

  // Special population booklets
  {
    id: 'prenatal_wellness_guide',
    tag: 'prenatal',
    title: '孕期生活质量提升指南',
    description: '帮助孕期女性提升整体生活质量和幸福感',
    category: 'special',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '孕期是生命中特殊而美好的时光。通过提升整体生活质量，您可以更好地享受这个珍贵的阶段，让身心都处于最佳状态。',
      problem: '孕期的身体变化和情绪波动可能让您感到不适，影响日常生活的舒适度和幸福感。',
      solution: '通过调整生活方式和提升日常舒适度，让孕期生活更加愉快和充实。',
      steps: [
        '为自己创造更舒适的日常环境',
        '调整日常活动，让身体感到更舒适',
        '培养适合孕期的放松和愉悦活动'
      ],
      tips: [
        '重视身体的舒适感，选择最舒服的姿势',
        '多与亲友分享孕期的喜悦和感受',
        '为自己安排轻松愉快的日常活动'
      ],
      resources: [
        {
          title: '孕期舒适生活指南',
          description: '如何让孕期生活更舒适愉快',
          url: '/resources/prenatal-comfort'
        },
        {
          title: '孕期放松活动',
          description: '适合孕期的放松和愉悦活动',
          url: '/resources/prenatal-activities'
        }
      ]
    },
    estimatedTime: '持续整个孕期',
    difficulty: 'easy',
    expectedOutcome: '孕期生活更舒适愉快，身心更加平和安宁，享受这个特殊的美好时光'
  },

  // Behavioral booklets
  {
    id: 'life_balance_guide',
    tag: 'maladaptive_behaviors',
    title: '重建生活平衡指南',
    description: '帮助您恢复充实有意义的日常生活',
    category: 'lifestyle',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '充实而平衡的生活是身心健康的基础。当我们的日常生活充满意义和乐趣时，身心自然会找到最佳的状态。',
      problem: '您可能因为担心休息问题而减少了日常活动，这反而可能让生活失去活力和意义，影响整体的生活质量。',
      solution: '重新投入到有意义的日常活动中，让生活变得充实而平衡。',
      steps: [
        '重新评估对您重要的生活活动',
        '逐步恢复有意义的日常活动',
        '培养新的兴趣爱好和社交活动'
      ],
      tips: [
        '专注于让您感到满足和快乐的活动',
        '保持与朋友和家人的联系',
        '不要让担心影响您享受生活的能力'
      ],
      resources: [
        {
          title: '生活意义探索',
          description: '如何找到对自己有意义的活动',
          url: '/resources/meaningful-activities'
        },
        {
          title: '社交连接指南',
          description: '如何建立和维护良好的人际关系',
          url: '/resources/social-connection'
        }
      ]
    },
    estimatedTime: '4-6周',
    difficulty: 'medium',
    expectedOutcome: '恢复充实有意义的生活，提升整体幸福感和生活满意度'
  },

  // Environmental booklets
  {
    id: 'peaceful_environment_guide',
    tag: 'noise_problem',
    title: '创造宁静生活环境',
    description: '营造更舒适宁静的生活空间，提升日常体验',
    category: 'environment',
    priority: 'medium',
    severity: 'moderate',
    content: {
      summary: '宁静舒适的生活环境能够让我们感到更加放松和平静，这对整体的生活质量和身心健康都非常重要。',
      problem: '环境中的噪音可能让您感到烦躁和不安，影响日常生活的舒适度和心情。',
      solution: '通过改善环境和有效沟通，创造更加宁静舒适的生活空间。',
      steps: [
        '识别影响生活舒适度的环境因素',
        '采取适当措施改善环境质量',
        '与邻居友好沟通，共同维护良好的居住环境'
      ],
      tips: [
        '使用自然的方法创造宁静环境，如植物、软装等',
        '与邻居建立良好的关系，相互理解和尊重',
        '专注于创造让自己感到舒适和平静的空间'
      ],
      resources: [
        {
          title: '宁静环境营造',
          description: '如何创造舒适宁静的生活环境',
          url: '/resources/peaceful-environment'
        },
        {
          title: '邻里和谐相处',
          description: '与邻居建立良好关系的方法',
          url: '/resources/neighbor-harmony'
        }
      ]
    },
    estimatedTime: '1-2周',
    difficulty: 'easy',
    expectedOutcome: '生活环境更宁静舒适，日常生活体验更愉悦'
  },

  // Additional booklets for missing tags
  {
    id: 'life_satisfaction_guide',
    tag: 'poor_sleep_quality',
    title: '提升生活满意度指南',
    description: '通过改善日常生活体验提升整体生活质量',
    category: 'lifestyle',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '生活满意度是身心健康的重要指标。当我们的日常生活充满满足感和成就感时，身心自然会达到更好的状态。',
      problem: '您可能对当前的生活状态感到不够满意，这会影响整体的生活质量和身心状态。',
      solution: '通过识别和改善生活中的重要方面，提升整体生活满意度和幸福感。',
      steps: [
        '识别生活中让您感到满足和快乐的活动',
        '增加这些有意义活动的频率和时间',
        '培养新的兴趣爱好和社交连接'
      ],
      tips: [
        '专注于能带来真正满足感的活动，而非短暂的快乐',
        '与朋友和家人建立更深层的连接',
        '为自己设定有意义的小目标并庆祝达成'
      ],
      resources: [
        {
          title: '生活满意度提升',
          description: '如何识别和增加生活中的满足感',
          url: '/resources/life-satisfaction'
        },
        {
          title: '兴趣爱好培养',
          description: '发现和培养个人兴趣爱好的方法',
          url: '/resources/hobbies-development'
        }
      ]
    },
    estimatedTime: '3-4周',
    difficulty: 'easy',
    expectedOutcome: '生活满意度显著提升，整体幸福感增强，身心状态改善'
  },
  {
    id: 'meaningful_activities_guide',
    tag: 'idle_lifestyle',
    title: '充实生活活动指南',
    description: '通过增加有意义的活动让生活更加充实',
    category: 'lifestyle',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '充实的生活来自于有意义的活动和社交连接。当我们的生活充满目的和意义时，每一天都会变得更有价值。',
      problem: '您的生活可能缺乏足够的活动和目标，这会让生活变得单调和缺乏动力。',
      solution: '通过增加有意义的活动和社交参与，让生活变得更加充实和有趣。',
      steps: [
        '探索您真正感兴趣的活动和领域',
        '制定每日和每周的活动计划',
        '积极参与社交活动和社区活动'
      ],
      tips: [
        '从小的改变开始，逐步增加活动量',
        '寻找志同道合的朋友一起参与活动',
        '尝试新的体验，扩展生活视野'
      ],
      resources: [
        {
          title: '活动规划指南',
          description: '如何制定充实的生活活动计划',
          url: '/resources/activity-planning'
        },
        {
          title: '社交活动建议',
          description: '适合不同兴趣的社交活动推荐',
          url: '/resources/social-activities'
        }
      ]
    },
    estimatedTime: '2-3周',
    difficulty: 'easy',
    expectedOutcome: '生活更加充实有趣，社交连接增强，整体生活质量提升'
  },
  {
    id: 'postnatal_life_guide',
    tag: 'postnatal',
    title: '产后生活调整指南',
    description: '帮助产后女性适应新生活，提升生活质量',
    category: 'special',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '产后是一个特殊的生命阶段，需要适应新的生活节奏和角色。通过合理的调整和支持，这个阶段可以成为人生中美好的回忆。',
      problem: '产后生活节奏的巨大变化可能让您感到不适应，影响日常生活的质量和心情。',
      solution: '通过建立新的生活节奏和寻求支持，让产后生活更加舒适和愉快。',
      steps: [
        '建立适合产后状态的生活节奏',
        '寻求家人和朋友的支持和帮助',
        '为自己安排适当的休息和放松时间'
      ],
      tips: [
        '不要对自己要求过高，给自己适应的时间',
        '与有经验的妈妈交流，获得实用的建议',
        '保持与伴侣的沟通，共同面对新的挑战'
      ],
      resources: [
        {
          title: '产后生活适应',
          description: '如何适应产后生活的新节奏',
          url: '/resources/postnatal-adaptation'
        },
        {
          title: '产后支持网络',
          description: '建立产后支持网络的方法',
          url: '/resources/postnatal-support'
        }
      ]
    },
    estimatedTime: '持续整个产后期',
    difficulty: 'medium',
    expectedOutcome: '更好地适应产后生活，建立健康的生活节奏，享受这个特殊阶段'
  },
  {
    id: 'student_life_guide',
    tag: 'student_issues',
    title: '学生生活平衡指南',
    description: '帮助学生在学习和生活中找到平衡，提升生活质量',
    category: 'special',
    priority: 'medium',
    severity: 'mild',
    content: {
      summary: '学生时代是人生中重要的成长阶段。通过平衡学习和生活，可以让学生时代更加充实和有意义。',
      problem: '学生可能面临学习压力、社交需求和自我发展的多重挑战，需要找到合适的平衡点。',
      solution: '通过合理的时间管理和生活规划，在学习、社交和个人发展之间找到平衡。',
      steps: [
        '制定合理的学习和生活计划',
        '积极参与校园活动和社交活动',
        '培养个人兴趣爱好和技能'
      ],
      tips: [
        '不要把所有时间都花在学习上，也要关注个人发展',
        '与同学建立良好的关系，互相支持和鼓励',
        '利用学校资源，参与各种活动和项目'
      ],
      resources: [
        {
          title: '学生时间管理',
          description: '如何平衡学习和生活的时间安排',
          url: '/resources/student-time-management'
        },
        {
          title: '校园生活指南',
          description: '如何充分利用学生时代的各种机会',
          url: '/resources/campus-life'
        }
      ]
    },
    estimatedTime: '整个学期',
    difficulty: 'medium',
    expectedOutcome: '学习生活更加平衡，社交关系改善，个人发展更加全面'
  },
  {
    id: 'shift_work_life_guide',
    tag: 'shift_work',
    title: '倒班工作生活指南',
    description: '帮助倒班工作者建立健康的生活节奏',
    category: 'work',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '倒班工作虽然具有挑战性，但通过合理的生活安排，仍然可以拥有高质量的生活。关键在于如何充分利用每个清醒的时间段。',
      problem: '倒班工作可能打乱正常的生活节奏，影响社交活动和家庭生活。',
      solution: '通过适应性的生活安排和有效的时间管理，让倒班工作与高质量生活并存。',
      steps: [
        '根据工作时间调整个人生活节奏',
        '在清醒时间安排有意义的活动',
        '与家人朋友协调时间，保持社交连接'
      ],
      tips: [
        '把每个清醒的时间段都当作宝贵的机会',
        '与家人朋友提前沟通，协调时间安排',
        '利用休息时间进行个人发展和兴趣爱好'
      ],
      resources: [
        {
          title: '倒班生活适应',
          description: '如何适应倒班工作的生活节奏',
          url: '/resources/shift-work-adaptation'
        },
        {
          title: '时间协调技巧',
          description: '如何与家人朋友协调时间安排',
          url: '/resources/time-coordination'
        }
      ]
    },
    estimatedTime: '4-6周',
    difficulty: 'hard',
    expectedOutcome: '更好地适应倒班工作，保持高质量的生活和社交关系'
  },
  {
    id: 'positive_focus_guide',
    tag: 'excessive_complaining',
    title: '积极生活焦点指南',
    description: '帮助您将注意力从问题转向积极的生活改变',
    category: 'behavior',
    priority: 'medium',
    severity: 'mild',
    content: {
      summary: '当我们专注于积极的生活改变时，问题往往会自然得到改善。积极的心态和行动是提升生活质量的关键。',
      problem: '过度关注和抱怨问题可能会让问题显得更大，影响心情和生活质量。',
      solution: '通过将注意力转向积极的生活改变，让生活变得更加美好和充实。',
      steps: [
        '识别生活中可以改善的积极方面',
        '制定具体的积极改变计划',
        '庆祝每一个小的进步和成就'
      ],
      tips: [
        '每天记录三件让自己感到感激的事情',
        '与积极乐观的朋友多交流',
        '专注于自己能控制的事情'
      ],
      resources: [
        {
          title: '积极心态培养',
          description: '如何培养积极的生活态度',
          url: '/resources/positive-mindset'
        },
        {
          title: '感恩练习指南',
          description: '通过感恩练习提升生活满意度',
          url: '/resources/gratitude-practice'
        }
      ]
    },
    estimatedTime: '2-3周',
    difficulty: 'easy',
    expectedOutcome: '心态更加积极，生活质量提升，问题困扰减少'
  },
  {
    id: 'natural_lifestyle_guide',
    tag: 'medication_use',
    title: '自然生活方式指南',
    description: '通过自然方法改善生活质量，减少对药物的依赖',
    category: 'lifestyle',
    priority: 'high',
    severity: 'moderate',
    content: {
      summary: '自然的生活方式是身心健康的基础。通过改善日常习惯和环境，我们可以自然地达到更好的生活状态。',
      problem: '依赖药物可能掩盖了根本问题，而且可能带来副作用和依赖性。',
      solution: '通过建立健康的生活习惯和改善生活环境，自然地提升生活质量。',
      steps: [
        '建立规律的生活作息和健康习惯',
        '改善生活环境和日常活动',
        '寻求自然的身心放松方法'
      ],
      tips: [
        '重视日常生活中的小改变，它们往往最有效',
        '与医生讨论逐步减少药物的可能性',
        '培养健康的生活习惯，让它们成为自然的一部分'
      ],
      resources: [
        {
          title: '自然放松方法',
          description: '各种自然的身心放松技巧',
          url: '/resources/natural-relaxation'
        },
        {
          title: '健康生活习惯',
          description: '建立健康生活习惯的实用指南',
          url: '/resources/healthy-habits'
        }
      ]
    },
    estimatedTime: '4-6周',
    difficulty: 'medium',
    expectedOutcome: '减少对药物的依赖，建立健康的生活习惯，生活质量自然提升'
  },
  {
    id: 'relationship_harmony_guide',
    tag: 'partner_snoring',
    title: '关系和谐指南',
    description: '通过改善关系质量来提升整体生活体验',
    category: 'lifestyle',
    priority: 'medium',
    severity: 'moderate',
    content: {
      summary: '良好的关系是生活质量的重要组成部分。通过改善沟通和理解，我们可以创造更和谐的生活环境。',
      problem: '关系中的小问题可能会影响整体的生活质量和心情。',
      solution: '通过改善沟通、增加理解和相互支持，让关系变得更加和谐。',
      steps: [
        '与伴侣进行开放和诚实的沟通',
        '寻找双方都能接受的解决方案',
        '共同创造更舒适的生活环境'
      ],
      tips: [
        '以理解和包容的态度面对关系中的挑战',
        '寻找专业建议来改善关系质量',
        '共同参与活动，增进感情和默契'
      ],
      resources: [
        {
          title: '关系沟通技巧',
          description: '改善关系沟通的实用方法',
          url: '/resources/relationship-communication'
        },
        {
          title: '共同生活指南',
          description: '如何创造和谐的共同生活环境',
          url: '/resources/shared-living'
        }
      ]
    },
    estimatedTime: '3-4周',
    difficulty: 'medium',
    expectedOutcome: '关系更加和谐，生活环境改善，整体生活质量提升'
  }
];

// Helper functions
export function getBookletsByTag(tag: string): StaticBooklet[] {
  return staticBooklets.filter(b => b.tag === tag);
}

export function getBookletsByCategory(category: string): StaticBooklet[] {
  return staticBooklets.filter(b => b.category === category);
}

export function getBookletsByPriority(priority: string): StaticBooklet[] {
  return staticBooklets.filter(b => b.priority === priority);
}

export function getBookletById(id: string): StaticBooklet | undefined {
  return staticBooklets.find(b => b.id === id);
}

export function getBookletsBySeverity(severity: string): StaticBooklet[] {
  return staticBooklets.filter(b => b.severity === severity);
}
