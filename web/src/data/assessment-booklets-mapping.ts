// Mapping between assessment answers and booklet facts from prompts/booklets.json
// This connects user answers to specific evidence-based recommendations

export interface BookletFact {
  tag: string;
  factName: string;
  description: string;
  content: string;
  tutorialLink?: string;
}

// Extract all booklet facts from the original data
export const bookletFacts: BookletFact[] = [
  {
    tag: 'sleep_non_efficiency',
    factName: 'sleep_non_efficiency',
    description: '合理提高睡眠效率',
    content: '对失眠的人最重要的是提高自己的睡眠效率，而不是花很长时间努力睡觉却翻来覆去无法入睡。请阅读并实践『如何提高睡眠效率』，让自己避免躺在床上却无法入睡的时间。',
    tutorialLink: '/tutorial/5b35bd8fd49e3a40708f7f66'
  },
  {
    tag: 'getup_irregularly',
    factName: 'getup_irregularly', 
    description: '按时早起',
    content: '常常因为睡得不好而补觉，这是很糟糕的做法。在早晨补觉会有两种后果：1. 推迟一天的生活，从而推迟晚上入睡的时间。会发现自己很晚也没有充足的困意。2. 打乱生活节奏，打乱自己的计划。按时早起是一天的节拍器，它定义了我们一天的生活和作息时间。所以，不论晚上睡得如何，按时早起是必须的。',
    tutorialLink: '/tutorial/5b35dfcbd49e3a40708f7f78'
  },
  {
    tag: 'neighbour_noise',
    factName: 'neighbour_noise',
    description: '尝试合理沟通',
    content: '远亲不如近邻，每一个邻居都是自己的至亲。当我们的睡眠被自己的邻里所打扰，最不应该做的事情是去指责和对峙。在我们抱怨邻居不顾及他人感受的时候，也应该考虑自己是不是很好的维持邻里之间的关系。',
    tutorialLink: '/tutorial/5d8821b0ae87d938157bb233'
  },
  {
    tag: 'roommate_noise',
    factName: 'roommate_noise',
    description: '尝试合理沟通',
    content: '集体生活中休息的环境比较吵杂，许多学生抱怨室友睡的太晚，自己已经躺下了室友还没开始洗漱，太吵很难入睡。这时候首先要做的不是埋冤他人，而是从自己身上找问题。集体生活就要跟随集体生活的节奏，大家晚上娱乐夜聊再正常不过了。',
    tutorialLink: '/tutorial/5b39987cbd3e203cbff9a4f6'
  },
  {
    tag: 'bedmate_snore',
    factName: 'bedmate_snore',
    description: '合理对待噪音',
    content: '这世界上有20%的成年人打鼾，成年男子打鼾的几率是25%，随着年龄的增长打呼噜的比例也会不断增加。所以我们每个人都有很大几率遇到打呼噜的室友或者伴侣。有些人因为呼噜声睡不着，却并不是每个人都被困扰。我们完全可以通过自身的调整走出对呼噜声的执着。',
    tutorialLink: '/tutorial/5d8821b0ae87d938157bb233'
  },
  {
    tag: 'unhealthy',
    factName: 'unhealthy',
    description: '健康的生活方式',
    content: '许多人认为失眠只是心理问题，实际上我们的身心紧密相联，任何身体上的不适都会产生心理变化，任何心理问题也都对身体有间接影响。失眠终归是我们身心不健康的产物，想要走出失眠，就要改善自己的身心状态。通常，缺乏运动、缺少阳光、不自制的生活会侵蚀自己的身体，我们需要长期规律的锻炼和健康的生活方式让自己的身体保持良好状态。',
    tutorialLink: '/tutorial/5ba0e09ec0322b7710b10709'
  },
  {
    tag: 'idle',
    factName: 'idle',
    description: '充实生活',
    content: '睡眠最根本的目的，是为了消除一天劳作带来的疲劳，恢复我们身体和精神的能量。理解睡眠是一种需求，我们就应该明白为什么清闲的生活反而更容易失眠。因为无所事事的状态中大脑和身体的活跃度非常低，一直处于休息的状态，所以到了入睡的时间难以产生困意。',
    tutorialLink: '/tutorial/5b39aed3bd3e203cbff9a500'
  },
  {
    tag: 'stress',
    factName: 'stress',
    description: '合理对待压力',
    content: '在大多数时候，工作和生活中的巨大压力会带来短期的失眠，却很少导致慢性失眠。我们经常会因为一些重要的事情失眠，比如重要的考试、会议、新的动作、生活的重大变化等等，这些事情会在我们的一生中不可避免的重复发生，它们会给我们带来巨大压力以及随之而来的失眠。',
    tutorialLink: '/tutorial/5b39bb19bd3e203cbff9a503'
  },
  {
    tag: 'boring',
    factName: 'boring',
    description: '尝试有趣生活',
    content: '长期处于单调呆板的生活中，一个人会感觉空虚和无聊，这种状态会让人在清醒的时间里缺乏成就感，久而久之生活会变得浑浑噩噩。而睡眠的好坏取决于清醒时间的生活状态，如果一个人长期处在浑浑噩噩的状态中，睡眠很可能会出问题。',
    tutorialLink: '/tutorial/5b39b41cbd3e203cbff9a501'
  },
  {
    tag: 'stimulation',
    factName: 'stimulation',
    description: '合理利用卧室',
    content: '几乎每个失眠患者无一例外都会采取错误的手段对待失眠，其一是在床上呆更长的时间，以便延长自己的睡眠时间；其二是不停得翻来覆去寻找合适的姿势入睡。这样做的是不正确的，后果很严重。因为我们在床上花了许多"无法入睡"的时间，渐渐的床铺会成为一个"睡不着觉"的存在。',
    tutorialLink: '/tutorial/5b39c2a5bd3e203cbff9a506'
  },
  {
    tag: 'distraction',
    factName: 'distraction',
    description: '有效集中精力',
    content: '失眠的状态下很难集中注意力，身体和大脑疲惫，做事的时候内心像是跑火车，总是在想如何睡得更好，完全无法有效的学习和工作。这种情况是失眠者的普遍问题。我们会认为只有睡好觉才能很好的工作和学习，这是本末倒置的认识。睡眠只是一个结果，我们只有让自己很好的工作工作和学习，才能进入良性循环，最终获得好的睡眠。',
    tutorialLink: '/tutorial/5b39cbdcbd3e203cbff9a509'
  },
  {
    tag: 'unsociable',
    factName: 'unsociable',
    description: '打开心扉',
    content: '如果你在工作、生活中和同事、朋友以及亲人很少有沟通和交流，这是个比较危险的信号。不论是在失眠之前已有的，还是失眠之后逐渐形成的，都不是好的现象。闲聊、倾听、讨论、对峙、问候……任何形式的交流都有助于让自己和外界产生更加紧密的，都能让自己处于更加平和和健康的内心状态中。从自我封闭中走出来，对自己的睡眠有正面影响。'
  },
  {
    tag: 'shiftwork',
    factName: 'shiftwork',
    description: '适应作息',
    content: '「并不是工作和生活的形式让一个人失眠，而是错误的对待自己的工作和生活让一个人失眠」。一定要弄明白这两点的区别。同样的工作，有些人积极和主动，有些人懒散和被动，就会有很大区别。事实上，因为倒班失眠求助的人非常少，并不是今天上白班明天上夜班的人就容易失眠。',
    tutorialLink: '/tutorial/5b39b41cbd3e203cbff9a501'
  },
  {
    tag: 'holiday',
    factName: 'holiday',
    description: '假期综合症',
    content: '悠长的假期很美好，然而许多人都会在长假期间失眠，尤其是学生或者老师放暑假的时候很容易陷入失眠。这是因为生活和睡眠出现了两点变化：从繁忙的学习或者工作突然到了闲散在家中，睡眠的需求骤减。虽然睡眠的需求减少了，睡眠却依然是和之前保持一样甚至更长的时间。',
    tutorialLink: '/tutorial/5b39de65efdf9e2998457ce2'
  },
  {
    tag: 'conflict_routine',
    factName: 'conflict_routine',
    description: '合理规划作息',
    content: '集体生活中休息的环境比较吵杂，许多学生抱怨室友睡的太晚，自己已经躺下了室友还没开始洗漱，太吵很难入睡。这时候首先要做的不是埋冤他人，而是从自己身上找问题。集体生活就要跟随集体生活的节奏，大家晚上娱乐夜聊再正常不过了。',
    tutorialLink: '/tutorial/5b39987cbd3e203cbff9a4f6'
  },
  {
    tag: 'prenatal',
    factName: 'prenatal',
    description: '孕期',
    content: '几乎每个准妈妈都会失眠。怀孕的中后期因为生理上的种种变化，以及生活和工作的种种变化，失眠会成为家常便饭。虽然每个准吗啊都希望消除孕期失眠，但是这并不现实，而且没有必要，你需要做的只是承受暂时的失眠，健康和规律的度过每一天的生活。',
    tutorialLink: '/tutorial/5b46db09bf28873e046e1af4'
  },
  {
    tag: 'postnatal',
    factName: 'postnatal',
    description: '产后',
    content: '产后妈妈是最常见的失眠人群。在睡吧进行咨询的10个人中大概4个会是产后妈妈。所以，妈妈们，你们并不孤单，也不必惊慌失措。',
    tutorialLink: '/tutorial/5b46e556bf28873e046e1af6'
  },
  {
    tag: 'complain',
    factName: 'complain',
    description: '终止抱怨',
    content: '许多人失眠之后，都会先给自己最亲近的人抱怨或者哭诉。而试想当自己的家人、朋友或者同事日复一日听到无精打采的你说自己睡不着，他们会有怎样的反应呢？事实上，当我们说出来：失眠很痛苦，我很绝望。失眠的痛苦不仅在我们心中扎根，而且在听到或者看到这句话的人心中扎根。',
    tutorialLink: '/tutorial/5b46e497bf28873e046e1af5'
  },
  {
    tag: 'susceptible',
    factName: 'susceptible',
    description: '放弃为失眠努力',
    content: '可以想象，失眠就像是一根柱子，而失眠所带来的焦虑和担忧就像是一根绳子，这根绳子一端绑在柱子上，一端套在脖子上，我们就这样被栓住，每天都在围绕失眠转圈。一方面为失眠做各种各样的努力，另一方面也为失眠放弃了许多自己的责任。当我们的生活被失眠所左右，就会逐渐陷入慢性失眠。',
    tutorialLink: '/tutorial/5b1f2114f4612c136e02a079'
  },
  {
    tag: 'medicine',
    factName: 'medicine',
    description: '药物',
    content: '药物对治失眠非常流行，却并不能带来明显的效果。通常安眠药在开始的几天是好用的，但是效果会越来越不明显，而当我们停止服用安眠药，失眠会更加严重。主要原因是因为药物只是针对失眠的现象，并不对治造成失眠的根本原因。',
    tutorialLink: '/tutorial/5b46f292bf28873e046e1b00'
  },
  {
    tag: 'selfish',
    factName: 'selfish',
    description: '自我',
    content: '『一个非常明显的事实是，当你只是想着自己的时候，你的整个心智会变得狭窄，这种狭隘的心灵会放大那些看似糟糕的事情，并且带给你恐惧、不安和无法抑制的痛苦。然而，当你开始同情和关爱其他人的时候， 你的心灵会变得宽广并开放，自己的问题会显得微不足道，你的感受会变得大不相同。』失眠只是一个普通的烦恼，而走出这个烦恼最好的方式就是关爱和帮助其他的人。'
  },
  {
    tag: 'study_highschool',
    factName: 'study_highschool',
    description: '改善中学生活',
    content: '失眠是身心状态不佳的表现，是不均衡生活的产物。承受巨大课业压力的高中生，很难让自己保持健康、均衡、活跃的生活状态，因此失眠就不足为奇了。',
    tutorialLink: '/tutorial/5b39a1fcbd3e203cbff9a4fe'
  },
  {
    tag: 'study_uni',
    factName: 'study_uni',
    description: '改善大学生活',
    content: '失眠是身心状态不佳的表现，是不均衡生活的产物。大学生活中，许多学生缺乏目标，生活非常散漫，很难让自己保持健康、均衡、活跃的生活状态，失眠就不足为奇了。',
    tutorialLink: '/tutorial/5b39987cbd3e203cbff9a4f6'
  }
];

// Mapping function: connects assessment answers to relevant booklet facts
export function mapAnswersToBookletFacts(answers: Record<string, string>): BookletFact[] {
  const relevantFacts: BookletFact[] = [];

  // Map based on specific answer patterns
  
  // Sleep efficiency issues
  if (answers.hourstosleep && parseInt(answers.hourstosleep) > 8) {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'sleep_non_efficiency')!);
  }

  // Irregular wake up time
  if (answers.getupregular === 'no') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'getup_irregularly')!);
  }

  // Noise issues
  if (answers.noise === 'no' && answers.noisereason) {
    if (answers.noisereason === 'neighbour') {
      relevantFacts.push(bookletFacts.find(f => f.tag === 'neighbour_noise')!);
    } else if (answers.noisereason === 'roommate') {
      relevantFacts.push(bookletFacts.find(f => f.tag === 'roommate_noise')!);
    } else if (answers.noisereason === 'snore') {
      relevantFacts.push(bookletFacts.find(f => f.tag === 'bedmate_snore')!);
    }
  }

  // Lifestyle issues
  if (answers.sport === 'none' || answers.sport === 'little' || 
      answers.sunshine === 'none' || answers.sunshine === 'little') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'unhealthy')!);
  }

  // Life status and activity level
  if (answers.lively === 'little' || answers.status === 'unemployed') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'idle')!);
  }

  // Stress handling
  if (answers.pressure === 'best' || answers.pressure === 'normal') {
    // Good stress handling, but if they still have sleep issues, might need stress guidance
    if (answers.hourstofallinsleep && parseInt(answers.hourstofallinsleep) < 6) {
      relevantFacts.push(bookletFacts.find(f => f.tag === 'stress')!);
    }
  }

  // Boring life
  if (answers.lively === 'little' && answers.sport === 'little') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'boring')!);
  }

  // Bedroom usage issues
  if (answers.bedroom === 'yes') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'stimulation')!);
  }

  // Work/study concentration issues
  if (answers.distraction === 'yes') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'distraction')!);
  }

  // Social isolation
  if (answers.unsociable === 'yes') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'unsociable')!);
  }

  // Student life
  if (answers.status === 'study') {
    // Assume university level unless specified
    relevantFacts.push(bookletFacts.find(f => f.tag === 'study_uni')!);
  }

  // Negative attitudes toward insomnia
  if (answers.complain === 'yes') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'complain')!);
  }

  if (answers.irresponsible === 'yes' || answers.inactive === 'yes' || 
      answers.excessive_rest === 'yes' || answers.ignore === 'yes') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'susceptible')!);
  }

  if (answers.medicine === 'yes') {
    relevantFacts.push(bookletFacts.find(f => f.tag === 'medicine')!);
  }

  // Remove duplicates
  const uniqueFacts = relevantFacts.filter((fact, index, self) => 
    index === self.findIndex(f => f.tag === fact.tag)
  );

  return uniqueFacts;
}

// Priority mapping: determines which facts are most important based on answers
export function prioritizeBookletFacts(facts: BookletFact[], answers: Record<string, string>): BookletFact[] {
  const prioritized = [...facts];

  // Sort by priority based on severity and impact
  prioritized.sort((a, b) => {
    const priorityMap: Record<string, number> = {
      'medicine': 10,           // Highest priority - medication dependency
      'susceptible': 9,         // High priority - counterproductive behaviors
      'sleep_non_efficiency': 8, // Core sleep issue
      'getup_irregularly': 7,   // Fundamental rhythm issue
      'unhealthy': 6,           // Lifestyle foundation
      'distraction': 5,         // Work/study impact
      'stress': 4,              // Stress management
      'idle': 4,                // Activity level
      'stimulation': 3,         // Sleep environment
      'complain': 3,            // Attitude
      'unsociable': 2,          // Social aspects
      'boring': 2,              // Life satisfaction
      'noise': 1                // External factors
    };

    const aPriority = priorityMap[a.tag] || 0;
    const bPriority = priorityMap[b.tag] || 0;

    return bPriority - aPriority;
  });

  return prioritized;
}
