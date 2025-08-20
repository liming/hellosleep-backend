import { assessmentEngine } from './assessment-engine';
import { aiAssessmentEngine, type AIRecommendationResponse } from './ai-assessment-engine';
import { aiTrainingDataSystem } from './ai-training-data-system';
import { getAllQuestionsOrdered, type AssessmentQuestion } from '@/data/assessment-questions';
import { fetchArticles } from '@/lib/api';

export interface EnhancedAssessmentResult {
  // Original assessment data
  sectionScores: any[];
  completedAt: Date;
  answers: any[];
  sections: any[];
  
  // AI-enhanced data
  aiRecommendations: AIRecommendationResponse;
  relatedArticles: any[];
  insights: string[];
  personalizedSummary: {
    primaryIssues: string[];
    suggestedFocus: string[];
    urgency: 'low' | 'medium' | 'high';
  };
  recommendationSource: 'cache' | 'ai' | 'fallback';
  confidence: number;
}

export class EnhancedAssessmentEngine {
  private questions: AssessmentQuestion[];

  constructor() {
    this.questions = getAllQuestionsOrdered();
  }

  /**
   * Process assessment with AI-powered recommendations (using training data cache)
   */
  async processAssessmentWithAI(answers: Record<string, string>): Promise<EnhancedAssessmentResult> {
    try {
      // Get original assessment results
      const originalResult = assessmentEngine.processAssessment(answers);
      
      // Extract user profile from answers
      const userProfile = this.extractUserProfile(answers);
      
      // Get recommendations from training data or generate new ones
      const recommendationResult = await aiTrainingDataSystem.getRecommendations(answers, userProfile);
      
      // Update usage count if using cached data
      if (recommendationResult.source === 'cache') {
        const patternHash = aiTrainingDataSystem.generatePatternHash(answers);
        await aiTrainingDataSystem.updateUsageCount(patternHash);
      }
      
      // Fetch related articles based on AI recommendations
      const relatedArticles = await this.fetchRelatedArticles(recommendationResult.recommendations);
      
      // Generate additional insights
      const insights = aiAssessmentEngine.generateInsights(answers);
      
      return {
        ...originalResult,
        aiRecommendations: recommendationResult.recommendations,
        relatedArticles,
        insights,
        personalizedSummary: recommendationResult.recommendations.summary,
        recommendationSource: recommendationResult.source,
        confidence: recommendationResult.confidence
      };
    } catch (error) {
      console.error('Enhanced assessment processing failed:', error);
      
      // Fallback to original assessment
      const originalResult = assessmentEngine.processAssessment(answers);
      return {
        ...originalResult,
        aiRecommendations: {
          recommendations: [],
          summary: {
            primaryIssues: ['Unable to generate AI recommendations'],
            suggestedFocus: ['basic_sleep_hygiene'],
            urgency: 'medium'
          },
          insights: {
            patterns: [],
            correlations: [],
            riskFactors: []
          }
        },
        relatedArticles: [],
        insights: [],
        personalizedSummary: {
          primaryIssues: ['Basic assessment completed'],
          suggestedFocus: ['general_improvements'],
          urgency: 'medium'
        },
        recommendationSource: 'fallback',
        confidence: 0.5
      };
    }
  }

  /**
   * Extract user profile from assessment answers
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
   * Fetch related articles from Strapi based on AI recommendations
   */
  private async fetchRelatedArticles(aiRecommendations: AIRecommendationResponse): Promise<any[]> {
    try {
      const allArticles: any[] = [];
      
      // Get articles for each recommendation category
      for (const recommendation of aiRecommendations.recommendations) {
        const articles = await this.searchArticlesByCategory(recommendation.category);
        allArticles.push(...articles);
      }
      
      // Remove duplicates and limit results
      const uniqueArticles = this.removeDuplicateArticles(allArticles);
      return uniqueArticles.slice(0, 6); // Return top 6 most relevant articles
    } catch (error) {
      console.error('Failed to fetch related articles:', error);
      return [];
    }
  }

  /**
   * Search articles by category
   */
  private async searchArticlesByCategory(category: string): Promise<any[]> {
    try {
      // Map AI categories to Strapi categories
      const categoryMapping: Record<string, string> = {
        'sleephabit': 'sleep-habits',
        'lifestyle': 'lifestyle',
        'working_study': 'work-study',
        'attitude': 'attitude',
        'general': 'general'
      };
      
      const strapiCategory = categoryMapping[category] || 'general';
      
      // Fetch articles from your Strapi API
      const response = await fetchArticles({
        filters: {
          category: {
            key: {
              $eq: strapiCategory
            }
          },
          type: {
            $eq: 'tutorial'
          }
        },
        pagination: {
          page: 1,
          pageSize: 3
        }
      });
      
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch articles for category ${category}:`, error);
      return [];
    }
  }

  /**
   * Remove duplicate articles based on documentId
   */
  private removeDuplicateArticles(articles: any[]): any[] {
    const seen = new Set();
    return articles.filter(article => {
      const duplicate = seen.has(article.documentId);
      seen.add(article.documentId);
      return !duplicate;
    });
  }

  /**
   * Get assessment progress with AI insights
   */
  getProgressWithInsights(answers: Record<string, string>): {
    percentage: number;
    insights: string[];
    nextSteps: string[];
  } {
    const percentage = assessmentEngine.getProgressPercentage(answers);
    const insights = aiAssessmentEngine.generateInsights(answers);
    
    // Generate next steps based on current progress
    const nextSteps: string[] = [];
    if (percentage < 30) {
      nextSteps.push('继续完成基本信息部分');
    } else if (percentage < 60) {
      nextSteps.push('完成睡眠习惯和生活状态评估');
    } else if (percentage < 90) {
      nextSteps.push('完成工作和学习相关问题的回答');
    } else {
      nextSteps.push('即将获得个性化建议');
    }
    
    return {
      percentage,
      insights,
      nextSteps
    };
  }

  /**
   * Get real-time recommendations as user progresses
   */
  async getProgressiveRecommendations(answers: Record<string, string>): Promise<{
    immediate: string[];
    upcoming: string[];
  }> {
    try {
      // Get recommendations based on current answers
      const aiResponse = await aiAssessmentEngine.generateRecommendations(answers, this.questions);
      
      // Separate immediate vs upcoming recommendations
      const immediate: string[] = [];
      const upcoming: string[] = [];
      
      aiResponse.recommendations.forEach(rec => {
        if (rec.priority === 'high') {
          immediate.push(rec.title);
        } else {
          upcoming.push(rec.title);
        }
      });
      
      return {
        immediate: immediate.slice(0, 2), // Show top 2 immediate actions
        upcoming: upcoming.slice(0, 3)    // Show top 3 upcoming actions
      };
    } catch (error) {
      console.error('Failed to get progressive recommendations:', error);
      return {
        immediate: ['继续完成评估以获得个性化建议'],
        upcoming: []
      };
    }
  }

  /**
   * Save enhanced assessment result
   */
  saveEnhancedResult(result: EnhancedAssessmentResult): void {
    try {
      const existingResults = this.getSavedEnhancedResults();
      existingResults.push(result);
      
      // Keep only last 5 enhanced results
      if (existingResults.length > 5) {
        existingResults.splice(0, existingResults.length - 5);
      }
      
      localStorage.setItem('enhanced_sleep_assessment_results', JSON.stringify(existingResults));
    } catch (error) {
      console.error('Failed to save enhanced assessment result:', error);
    }
  }

  /**
   * Get saved enhanced assessment results
   */
  getSavedEnhancedResults(): EnhancedAssessmentResult[] {
    try {
      const saved = localStorage.getItem('enhanced_sleep_assessment_results');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load saved enhanced results:', error);
      return [];
    }
  }

  /**
   * Get latest enhanced assessment result
   */
  getLatestEnhancedResult(): EnhancedAssessmentResult | null {
    const results = this.getSavedEnhancedResults();
    return results.length > 0 ? results[results.length - 1] : null;
  }

  /**
   * Compare current assessment with previous results
   */
  compareWithPrevious(currentResult: EnhancedAssessmentResult): {
    improvement: number;
    changes: string[];
    trends: string[];
  } {
    const previousResults = this.getSavedEnhancedResults();
    if (previousResults.length < 2) {
      return {
        improvement: 0,
        changes: ['这是您的第一次评估'],
        trends: ['建立基准数据']
      };
    }
    
    const previousResult = previousResults[previousResults.length - 2];
    // Compare urgency levels instead of scores
    const urgencyOrder = { 'low': 1, 'medium': 2, 'high': 3 };
    const urgencyImprovement = urgencyOrder[previousResult.personalizedSummary.urgency] - urgencyOrder[currentResult.personalizedSummary.urgency];
    
    const changes: string[] = [];
    const trends: string[] = [];
    
    if (urgencyImprovement > 0) {
      changes.push('睡眠问题严重程度有所缓解');
      trends.push('积极改善趋势');
    } else if (urgencyImprovement < 0) {
      changes.push('睡眠问题可能有所加重，需要关注');
      trends.push('需要关注的变化');
    } else {
      changes.push('睡眠问题严重程度保持稳定');
      trends.push('稳定状态');
    }
    
    return {
      improvement: urgencyImprovement,
      changes,
      trends
    };
  }
}

// Export singleton instance
export const enhancedAssessmentEngine = new EnhancedAssessmentEngine();
