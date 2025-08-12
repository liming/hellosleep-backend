export const translations = {
  en: {
    // Header
    brand: 'HelloSleep',
    knowledgeBase: 'Knowledge Base',
    experienceSharing: 'Experience Sharing',
    blog: 'Blog',
    sleepAssessment: 'Sleep Assessment',
    
    // Hero Section
    heroTitle: 'Help you overcome insomnia',
    heroSubtitle: 'Insomnia comes from our lives, we need to solve it by returning to life.',
    helpGuide: 'Help Guide',
    startAssessment: 'Start Assessment',
    
    // Philosophy Section
    philosophyTitle: 'Our Philosophy',
    philosophySubtitle: 'Insomnia is just a natural response to our current physical and mental state, it is a normal thing.',
    knowledgeBaseTitle: 'Knowledge Base',
    knowledgeBaseDesc: 'The essence, causes, solutions and special topics for different types of insomnia are all explained in the HelloSleep guide.',
    experienceSharingTitle: 'Experience Sharing',
    experienceSharingDesc: 'We collect insights from those who have overcome insomnia. We can see situations similar to our own from these articles.',
    communitySupportTitle: 'Community Support',
    communitySupportDesc: 'Every person with insomnia can post sleep assessments in the community to seek help, and those who have overcome insomnia can help others.',
    
    // Latest Articles
    latestArticlesTitle: 'Latest Articles',
    latestArticlesSubtitle: 'Real experiences from the community and professional guidance',
    viewMoreArticles: 'View More Articles',
    
    // Article metadata
    byAuthor: 'By:',
    
    // Sleep Assessment
    sleepAssessmentTitle: 'Sleep Assessment',
    sleepAssessmentDesc: 'Understand your sleep patterns and get personalized recommendations through our comprehensive assessment.',
    assessmentStep1Title: 'Answer Questions',
    assessmentStep1Desc: 'Complete a series of questions about your sleep patterns and lifestyle.',
    assessmentStep2Title: 'Get Analysis',
    assessmentStep2Desc: 'Receive detailed analysis of your sleep quality and potential issues.',
    assessmentStep3Title: 'Get Recommendations',
    assessmentStep3Desc: 'Get personalized advice and strategies to improve your sleep.',
    assessmentCategoriesTitle: 'Assessment Categories',
    assessmentCategory1: 'Sleep Quality',
    assessmentCategory1Desc: 'Evaluate your sleep duration, quality, and patterns.',
    assessmentCategory2: 'Sleep Problems',
    assessmentCategory2Desc: 'Identify specific sleep issues and their frequency.',
    assessmentCategory3: 'Lifestyle Factors',
    assessmentCategory3Desc: 'Assess daily habits that affect your sleep.',
    assessmentCategory4: 'Health & Stress',
    assessmentCategory4Desc: 'Evaluate stress levels and health conditions.',
    assessmentStarting: 'Starting...',
    assessmentTimeEstimate: 'Takes approximately 5-10 minutes',
    assessmentPrivacyNote: 'Your responses are confidential and will only be used to provide personalized recommendations.',
    assessmentHelpLink: 'Need help? Learn more about the assessment',
    
    // Footer
    copyright: '© 2024 HelloSleep. All rights reserved.',
    
    // Ferry metaphor
    ferryMetaphor: 'Crossing the river of insomnia',
  },
  zh: {
    // Header
    brand: '睡吧',
    knowledgeBase: '知识库',
    experienceSharing: '经验分享',
    blog: '博客',
    sleepAssessment: '睡眠评估',
    
    // Hero Section
    heroTitle: '帮助失眠的您走出失眠',
    heroSubtitle: '失眠源自我们的生活，我们要回到生活中解决它。',
    helpGuide: '求助指南',
    startAssessment: '开始评估',
    
    // Philosophy Section
    philosophyTitle: '我们的理念',
    philosophySubtitle: '失眠只是我们当前身体和精神状态的自然反应，它是一件平常事',
    knowledgeBaseTitle: '知识库',
    knowledgeBaseDesc: '失眠的本质、成因、解决方案以及针对不同类型失眠的专题都在睡吧指南中有所讲解。',
    experienceSharingTitle: '经验分享',
    experienceSharingDesc: '收集了走出失眠后的心得。我们可以从这些文章中看到和自己类似的情况。',
    communitySupportTitle: '社区支持',
    communitySupportDesc: '每个失眠的人都可以在社区发表睡眠评估来寻求帮助，走出失眠的朋友可以帮助其他失眠的朋友。',
    
    // Latest Articles
    latestArticlesTitle: '最新文章',
    latestArticlesSubtitle: '来自社区的真实经验和专业指导',
    viewMoreArticles: '查看更多文章',
    
    // Article metadata
    byAuthor: '作者：',
    
    // Sleep Assessment
    sleepAssessmentTitle: '睡眠评估',
    sleepAssessmentDesc: '通过全面的评估了解您的睡眠模式并获得个性化建议。',
    assessmentStep1Title: '回答问题',
    assessmentStep1Desc: '完成一系列关于睡眠模式和生活方式的问答。',
    assessmentStep2Title: '获得分析',
    assessmentStep2Desc: '获得睡眠质量和潜在问题的详细分析。',
    assessmentStep3Title: '获得建议',
    assessmentStep3Desc: '获得改善睡眠的个性化建议和策略。',
    assessmentCategoriesTitle: '评估类别',
    assessmentCategory1: '睡眠质量',
    assessmentCategory1Desc: '评估您的睡眠时长、质量和模式。',
    assessmentCategory2: '睡眠问题',
    assessmentCategory2Desc: '识别具体的睡眠问题及其频率。',
    assessmentCategory3: '生活方式因素',
    assessmentCategory3Desc: '评估影响睡眠的日常习惯。',
    assessmentCategory4: '健康与压力',
    assessmentCategory4Desc: '评估压力水平和健康状况。',
    assessmentStarting: '启动中...',
    assessmentTimeEstimate: '大约需要5-10分钟',
    assessmentPrivacyNote: '您的回答将被保密，仅用于提供个性化建议。',
    assessmentHelpLink: '需要帮助？了解更多关于评估的信息',
    
    // Footer
    copyright: '© 2024 睡吧. 版权所有.',
    
    // Ferry metaphor
    ferryMetaphor: '渡过失眠的河流',
  },
};

export type Locale = 'en' | 'zh';
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations.en[key] || key;
}

export function formatTranslation(locale: Locale, key: TranslationKey, params: Record<string, string | number> = {}): string {
  let translation = getTranslation(locale, key);
  Object.entries(params).forEach(([param, value]) => {
    translation = translation.replace(`{${param}}`, String(value));
  });
  return translation;
} 