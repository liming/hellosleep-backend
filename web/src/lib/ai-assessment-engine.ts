import { type AssessmentQuestion } from '@/data/assessment-questions';
import { type Recommendation } from '@/data/assessment-recommendations';
import { BookletFact, mapAnswersToBookletFacts, prioritizeBookletFacts } from '@/data/assessment-booklets-mapping';

export interface AIRecommendationRequest {
  answers: Record<string, string>;
  userProfile: {
    age?: number;
    gender?: string;
    lifeStatus?: string;
    insomniaDuration?: string;
  };
  context: {
    totalQuestions: number;
    answeredQuestions: number;
    sectionBreakdown: Record<string, number>;
  };
}

export interface AIRecommendationResponse {
  recommendations: AIRecommendation[];
  summary: {
    primaryIssues: string[];
    suggestedFocus: string[];
    urgency: 'low' | 'medium' | 'high';
  };
  insights: {
    patterns: string[];
    correlations: string[];
    riskFactors: string[];
  };
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-1
  reasoning: string;
  actions: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeRequired: string;
    frequency: string;
    expectedImpact: string;
  }[];
  relatedArticles?: {
    title: string;
    url: string;
    relevance: number; // 0-1
    summary: string;
  }[];
  alternatives?: {
    title: string;
    description: string;
    whenToUse: string;
  }[];
}

export class AIAssessmentEngine {
  private apiEndpoint: string;
  private apiKey: string;

  constructor() {
    this.apiEndpoint = process.env.NEXT_PUBLIC_AI_API_ENDPOINT || '/api/ai/recommendations';
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || '';
  }

  /**
   * Generate AI-powered recommendations based on assessment answers
   */
  async generateRecommendations(
    answers: Record<string, string>,
    questions: AssessmentQuestion[]
  ): Promise<AIRecommendationResponse> {
    try {
      // Prepare the request payload
      const request: AIRecommendationRequest = this.prepareRequest(answers, questions);
      
      // Call AI service
      const response = await this.callAIService(request);
      
      return response;
    } catch (error) {
      console.error('AI recommendation generation failed:', error);
      // Fallback to basic recommendations
      return this.generateFallbackRecommendations(answers, questions);
    }
  }

  /**
   * Prepare request payload for AI service
   */
  private prepareRequest(answers: Record<string, string>, questions: AssessmentQuestion[]): AIRecommendationRequest {
    // Extract user profile from basic info questions
    const userProfile = this.extractUserProfile(answers);
    
    // Calculate context information
    const context = this.calculateContext(answers, questions);
    
    return {
      answers,
      userProfile,
      context
    };
  }

  /**
   * Extract user profile information from answers
   */
  private extractUserProfile(answers: Record<string, string>) {
    const profile: any = {};
    
    // Calculate age from birthday
    if (answers.birthday) {
      const birthYear = new Date(answers.birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      profile.age = currentYear - birthYear;
    }
    
    profile.gender = answers.gender;
    profile.lifeStatus = answers.status;
    profile.insomniaDuration = answers.howlong;
    
    return profile;
  }

  /**
   * Calculate context information for AI analysis
   */
  private calculateContext(answers: Record<string, string>, questions: AssessmentQuestion[]) {
    const sectionBreakdown: Record<string, number> = {};
    let answeredQuestions = 0;
    
    // Group questions by category and count answers
    questions.forEach(question => {
      if (answers[question.id]) {
        answeredQuestions++;
        sectionBreakdown[question.category] = (sectionBreakdown[question.category] || 0) + 1;
      }
    });
    
    return {
      totalQuestions: questions.length,
      answeredQuestions,
      sectionBreakdown
    };
  }

  /**
   * Call AI service to generate recommendations
   */
  private async callAIService(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Generate fallback recommendations when AI service is unavailable
   */
  private generateFallbackRecommendations(
    answers: Record<string, string>, 
    questions: AssessmentQuestion[]
  ): AIRecommendationResponse {
    // Use booklet facts for evidence-based fallback recommendations
    const relevantFacts = mapAnswersToBookletFacts(answers);
    const prioritizedFacts = prioritizeBookletFacts(relevantFacts, answers);
    
    const recommendations: AIRecommendation[] = [];
    
    // Convert top booklet facts to recommendations
    prioritizedFacts.slice(0, 5).forEach((fact, index) => {
      recommendations.push(this.convertFactToRecommendation(fact, answers, index));
    });

    // If no facts match, add basic recommendations
    if (recommendations.length === 0) {
      recommendations.push(this.getBasicRecommendation(answers));
    }

    return {
      recommendations,
      summary: {
        primaryIssues: this.identifyPrimaryIssuesFromFacts(prioritizedFacts, answers),
        suggestedFocus: prioritizedFacts.slice(0, 3).map(f => f.description),
        urgency: this.calculateUrgencyFromFacts(prioritizedFacts, answers)
      },
      insights: {
        patterns: this.generateInsights(answers),
        correlations: this.identifyCorrelations(answers, prioritizedFacts),
        riskFactors: this.identifyRiskFactors(answers, prioritizedFacts)
      }
    };
  }

  /**
   * Convert a booklet fact to an AI recommendation
   */
  private convertFactToRecommendation(fact: BookletFact, answers: Record<string, string>, index: number): AIRecommendation {
    const priority = index === 0 ? 'high' : index < 3 ? 'medium' : 'low';
    const confidence = Math.max(0.7, 1.0 - (index * 0.1));

    return {
      id: `booklet_${fact.tag}`,
      title: fact.description,
      description: fact.content,
      category: this.mapFactToCategory(fact.tag),
      priority: priority as 'high' | 'medium' | 'low',
      confidence,
      reasoning: `基于您的回答模式，这是循证医学建议中的重要改善方向。`,
      actions: this.generateActionsFromFact(fact, answers),
      relatedArticles: fact.tutorialLink ? [{
        title: fact.description,
        url: fact.tutorialLink,
        relevance: 0.9,
        summary: fact.content.substring(0, 100) + '...'
      }] : undefined
    };
  }

  /**
   * Generate specific actions from a booklet fact
   */
  private generateActionsFromFact(fact: BookletFact, answers: Record<string, string>): AIRecommendation['actions'] {
    const actions: AIRecommendation['actions'] = [];

    // Generate actions based on fact type
    switch (fact.tag) {
      case 'getup_irregularly':
        actions.push({
          title: '设定固定起床时间',
          description: '无论前一晚睡得如何，都要在固定时间起床',
          difficulty: 'medium',
          timeRequired: '持续执行',
          frequency: '每天',
          expectedImpact: '2-3周内建立稳定的睡眠节律'
        });
        break;
      
      case 'unhealthy':
        actions.push({
          title: '建立运动习惯',
          description: '每天进行30分钟的有氧运动，增加阳光照射',
          difficulty: 'medium',
          timeRequired: '30-60分钟',
          frequency: '每天',
          expectedImpact: '1-2周内改善身体状态'
        });
        break;

      case 'sleep_non_efficiency':
        actions.push({
          title: '提高睡眠效率',
          description: '减少在床上的清醒时间，只在真正困倦时上床',
          difficulty: 'hard',
          timeRequired: '持续执行',
          frequency: '每天',
          expectedImpact: '3-4周内显著改善睡眠质量'
        });
        break;

      case 'distraction':
        actions.push({
          title: '专注当下任务',
          description: '工作学习时全身心投入，不要总是想着睡眠问题',
          difficulty: 'medium',
          timeRequired: '工作时间',
          frequency: '每天',
          expectedImpact: '1-2周内改善专注力和睡眠'
        });
        break;

      default:
        actions.push({
          title: '实践建议',
          description: fact.content.length > 100 ? fact.content.substring(0, 100) + '...' : fact.content,
          difficulty: 'medium',
          timeRequired: '根据具体情况',
          frequency: '持续实践',
          expectedImpact: '遵循建议后逐步改善'
        });
    }

    return actions;
  }

  /**
   * Get a basic recommendation when no facts match
   */
  private getBasicRecommendation(answers: Record<string, string>): AIRecommendation {
    return {
      id: 'basic_sleep_hygiene',
      title: '基础睡眠卫生',
      description: '建立良好的睡眠习惯是改善睡眠质量的基础。',
      category: 'sleephabit',
      priority: 'medium',
      confidence: 0.7,
      reasoning: '基于基本的睡眠卫生原则。',
      actions: [
        {
          title: '建立规律作息',
          description: '每天固定时间睡觉和起床',
          difficulty: 'medium',
          timeRequired: '持续执行',
          frequency: '每天',
          expectedImpact: '2-3周内改善睡眠质量'
        }
      ]
    };
  }

  /**
   * Map fact tag to category
   */
  private mapFactToCategory(tag: string): string {
    const categoryMap: Record<string, string> = {
      'getup_irregularly': 'sleephabit',
      'sleep_non_efficiency': 'sleephabit',
      'unhealthy': 'lifestyle',
      'idle': 'lifestyle',
      'boring': 'lifestyle',
      'distraction': 'workstudy',
      'unsociable': 'workstudy',
      'stress': 'attitude',
      'complain': 'attitude',
      'medicine': 'attitude',
      'susceptible': 'attitude',
      'stimulation': 'sleephabit',
      'neighbour_noise': 'sleephabit',
      'roommate_noise': 'sleephabit',
      'bedmate_snore': 'sleephabit'
    };
    
    return categoryMap[tag] || 'general';
  }

  /**
   * Identify primary issues from booklet facts
   */
  private identifyPrimaryIssuesFromFacts(facts: BookletFact[], answers: Record<string, string>): string[] {
    return facts.slice(0, 3).map(fact => fact.description);
  }

  /**
   * Identify correlations based on facts and answers
   */
  private identifyCorrelations(answers: Record<string, string>, facts: BookletFact[]): string[] {
    const correlations: string[] = [];
    
    if (facts.some(f => f.tag === 'getup_irregularly') && facts.some(f => f.tag === 'sleep_non_efficiency')) {
      correlations.push('不规律的起床时间与睡眠效率低下密切相关');
    }
    
    if (facts.some(f => f.tag === 'unhealthy') && facts.some(f => f.tag === 'idle')) {
      correlations.push('缺乏运动和无所事事的生活状态相互影响');
    }
    
    if (facts.some(f => f.tag === 'distraction') && facts.some(f => f.tag === 'unsociable')) {
      correlations.push('注意力不集中与社交隔离可能相互加重');
    }

    return correlations;
  }

  /**
   * Identify risk factors based on facts and answers
   */
  private identifyRiskFactors(answers: Record<string, string>, facts: BookletFact[]): string[] {
    const risks: string[] = [];
    
    if (facts.some(f => f.tag === 'medicine')) {
      risks.push('长期依赖药物可能导致耐受性和依赖性');
    }
    
    if (facts.some(f => f.tag === 'susceptible')) {
      risks.push('过度关注失眠可能加重症状');
    }
    
    if (answers.howlong === 'longterm' || answers.howlong === 'verylongterm') {
      risks.push('慢性失眠可能影响免疫系统和认知功能');
    }

    return risks;
  }

  /**
   * Calculate urgency based on booklet facts and answers
   */
  private calculateUrgencyFromFacts(facts: BookletFact[], answers: Record<string, string>): 'low' | 'medium' | 'high' {
    // High urgency indicators
    if (facts.some(f => f.tag === 'medicine') || 
        facts.some(f => f.tag === 'susceptible') ||
        answers.howlong === 'verylongterm') {
      return 'high';
    }
    
    // Medium urgency indicators
    if (facts.some(f => f.tag === 'sleep_non_efficiency') ||
        facts.some(f => f.tag === 'getup_irregularly') ||
        facts.some(f => f.tag === 'distraction') ||
        answers.howlong === 'longterm') {
      return 'medium';
    }
    
    // Low urgency (lifestyle improvements)
    return 'low';
  }

  /**
   * Identify primary issues from answers
   */
  private identifyPrimaryIssues(answers: Record<string, string>): string[] {
    const issues: string[] = [];
    
    if (answers.getupregular === 'no') issues.push('睡眠时间不规律');
    if (answers.sport === 'little' || answers.sport === 'none') issues.push('运动量不足');
    if (answers.noise === 'no') issues.push('睡眠环境不佳');
    if (answers.howlong === 'longterm' || answers.howlong === 'verylongterm') issues.push('长期失眠');
    
    return issues;
  }

  /**
   * Fetch related articles from Strapi based on recommendations
   */
  async fetchRelatedArticles(recommendations: AIRecommendation[]): Promise<void> {
    try {
      // This would integrate with your existing Strapi API
      // to fetch relevant articles based on recommendation categories
      const articlePromises = recommendations.map(async (rec) => {
        const articles = await this.searchArticles(rec.category, rec.title);
        rec.relatedArticles = articles.slice(0, 3); // Top 3 most relevant
      });
      
      await Promise.all(articlePromises);
    } catch (error) {
      console.error('Failed to fetch related articles:', error);
    }
  }

  /**
   * Search articles in Strapi based on category and keywords
   */
  private async searchArticles(category: string, keywords: string): Promise<any[]> {
    // This would use your existing API client to search articles
    // Implementation depends on your Strapi setup
    return [];
  }

  /**
   * Generate personalized insights based on answer patterns
   */
  generateInsights(answers: Record<string, string>): string[] {
    const insights: string[] = [];
    
    // Pattern analysis
    if (answers.bedroom === 'yes' && answers.bed === 'yes') {
      insights.push('您在卧室和床上花费大量时间，这可能会影响睡眠质量。');
    }
    
    if (answers.distraction === 'yes' && answers.effeciency === 'yes') {
      insights.push('专注力和效率问题可能与睡眠质量相互影响。');
    }
    
    if (answers.irresponsible === 'yes' && answers.inactive === 'yes') {
      insights.push('因失眠而减少活动可能会形成恶性循环。');
    }
    
    return insights;
  }
}

// Export singleton instance
export const aiAssessmentEngine = new AIAssessmentEngine();
