import { type AIRecommendationResponse, type AIRecommendationRequest } from './ai-assessment-engine';
import { fetchArticles, makeApiRequest } from '@/lib/api';

export interface TrainingDataPattern {
  id: string;
  patternHash: string; // Hash of assessment answers for pattern matching
  assessmentAnswers: Record<string, string>;
  userProfile: {
    age?: number;
    gender?: string;
    lifeStatus?: string;
    insomniaDuration?: string;
  };
  aiRecommendations: AIRecommendationResponse;
  confidence: number; // How confident we are in this pattern match
  usageCount: number; // How many times this pattern has been used
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatternMatchResult {
  isMatch: boolean;
  confidence: number;
  trainingData?: TrainingDataPattern;
  similarity: number; // 0-1 similarity score
}

export class AITrainingDataSystem {
  private cache: Map<string, TrainingDataPattern> = new Map();
  private patternCache: Map<string, TrainingDataPattern[]> = new Map();

  constructor() {
    this.loadCacheFromStorage();
  }

  /**
   * Generate hash for assessment answers to identify patterns
   */
  generatePatternHash(answers: Record<string, string>): string {
    // Create a normalized string of answers for consistent hashing
    const normalizedAnswers = Object.keys(answers)
      .sort() // Sort keys for consistent ordering
      .map(key => `${key}:${answers[key]}`)
      .join('|');
    
    // Simple hash function (in production, use a proper hash library)
    let hash = 0;
    for (let i = 0; i < normalizedAnswers.length; i++) {
      const char = normalizedAnswers.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Calculate similarity between two assessment answer sets
   */
  calculateSimilarity(answers1: Record<string, string>, answers2: Record<string, string>): number {
    const allKeys = new Set([...Object.keys(answers1), ...Object.keys(answers2)]);
    let matchingAnswers = 0;
    let totalAnswers = 0;

    for (const key of allKeys) {
      if (answers1[key] && answers2[key]) {
        totalAnswers++;
        if (answers1[key] === answers2[key]) {
          matchingAnswers++;
        }
      }
    }

    return totalAnswers > 0 ? matchingAnswers / totalAnswers : 0;
  }

  /**
   * Find similar patterns in training data
   */
  async findSimilarPatterns(
    answers: Record<string, string>,
    userProfile: any,
    similarityThreshold: number = 0.8
  ): Promise<PatternMatchResult[]> {
    const patternHash = this.generatePatternHash(answers);
    
    // First check exact match
    const exactMatch = this.cache.get(patternHash);
    if (exactMatch) {
      return [{
        isMatch: true,
        confidence: 1.0,
        trainingData: exactMatch,
        similarity: 1.0
      }];
    }

    // Check for similar patterns
    const similarPatterns: PatternMatchResult[] = [];
    
    for (const [hash, trainingData] of this.cache) {
      const similarity = this.calculateSimilarity(answers, trainingData.assessmentAnswers);
      
      if (similarity >= similarityThreshold) {
        similarPatterns.push({
          isMatch: true,
          confidence: similarity,
          trainingData,
          similarity
        });
      }
    }

    // Sort by similarity (highest first)
    return similarPatterns.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Get recommendations from training data or generate new ones
   */
  async getRecommendations(
    answers: Record<string, string>,
    userProfile: any,
    forceAI: boolean = false
  ): Promise<{
    recommendations: AIRecommendationResponse;
    source: 'cache' | 'ai' | 'fallback';
    confidence: number;
  }> {
    try {
      if (!forceAI) {
        // Try to find similar patterns in training data
        const similarPatterns = await this.findSimilarPatterns(answers, userProfile);
        
        if (similarPatterns.length > 0) {
          const bestMatch = similarPatterns[0];
          
          // Use cached result if confidence is high enough
          if (bestMatch.confidence >= 0.9) {
            console.log('Using cached training data with confidence:', bestMatch.confidence);
            return {
              recommendations: bestMatch.trainingData!.aiRecommendations,
              source: 'cache',
              confidence: bestMatch.confidence
            };
          }
        }
      }

      // Generate new AI recommendations
      console.log('Generating new AI recommendations');
      const aiResponse = await this.generateNewAIRecommendations(answers, userProfile);
      
      // Save to training data
      await this.saveToTrainingData(answers, userProfile, aiResponse);
      
      return {
        recommendations: aiResponse,
        source: 'ai',
        confidence: 1.0
      };
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      
      // Return fallback recommendations
      return {
        recommendations: this.generateFallbackRecommendations(answers),
        source: 'fallback',
        confidence: 0.5
      };
    }
  }

  /**
   * Generate new AI recommendations (calls external AI service)
   */
  private async generateNewAIRecommendations(
    answers: Record<string, string>,
    userProfile: any
  ): Promise<AIRecommendationResponse> {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers,
        userProfile,
        context: {
          totalQuestions: Object.keys(answers).length,
          answeredQuestions: Object.keys(answers).length,
          sectionBreakdown: this.calculateSectionBreakdown(answers)
        }
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Save AI recommendations to training data (Strapi booklets)
   */
  async saveToTrainingData(
    answers: Record<string, string>,
    userProfile: any,
    aiRecommendations: AIRecommendationResponse
  ): Promise<void> {
    try {
      const patternHash = this.generatePatternHash(answers);
      const now = new Date();

      const trainingData: TrainingDataPattern = {
        id: patternHash,
        patternHash,
        assessmentAnswers: answers,
        userProfile,
        aiRecommendations,
        confidence: 1.0,
        usageCount: 1,
        lastUsed: now,
        createdAt: now,
        updatedAt: now
      };

      // Save to local cache
      this.cache.set(patternHash, trainingData);
      this.saveCacheToStorage();

      // Save to Strapi as booklet
      await this.saveToStrapiBooklet(trainingData);

      console.log('Training data saved successfully');
    } catch (error) {
      console.error('Failed to save training data:', error);
    }
  }

  /**
   * Save training data to Strapi as booklet
   */
  private async saveToStrapiBooklet(trainingData: TrainingDataPattern): Promise<void> {
    try {
      // Convert AI recommendations to booklet format
      const bookletData = {
        title: `AI Recommendations - Pattern ${trainingData.patternHash}`,
        description: `AI-generated recommendations for sleep assessment pattern`,
        patternHash: trainingData.patternHash,
        assessmentAnswers: JSON.stringify(trainingData.assessmentAnswers),
        userProfile: JSON.stringify(trainingData.userProfile),
        recommendations: JSON.stringify(trainingData.aiRecommendations),
        confidence: trainingData.confidence,
        usageCount: trainingData.usageCount,
        lastUsed: trainingData.lastUsed.toISOString(),
        category: 'ai-recommendations',
        type: 'ai-booklet'
      };

      // Save to Strapi (assuming you have a 'booklets' content type)
      await makeApiRequest('/booklets', 'POST', bookletData);
      
      console.log('Training data saved to Strapi booklet');
    } catch (error) {
      console.error('Failed to save to Strapi booklet:', error);
    }
  }

  /**
   * Load training data from Strapi booklets
   */
  async loadTrainingDataFromStrapi(): Promise<void> {
    try {
      // Fetch AI booklets from Strapi
      const response = await makeApiRequest('/booklets', 'GET', null, {
        params: {
          filters: {
            type: {
              $eq: 'ai-booklet'
            }
          },
          populate: '*'
        }
      });

      if (response.data) {
        for (const booklet of response.data) {
          const trainingData: TrainingDataPattern = {
            id: booklet.patternHash,
            patternHash: booklet.patternHash,
            assessmentAnswers: JSON.parse(booklet.assessmentAnswers),
            userProfile: JSON.parse(booklet.userProfile),
            aiRecommendations: JSON.parse(booklet.recommendations),
            confidence: booklet.confidence,
            usageCount: booklet.usageCount,
            lastUsed: new Date(booklet.lastUsed),
            createdAt: new Date(booklet.createdAt),
            updatedAt: new Date(booklet.updatedAt)
          };

          this.cache.set(booklet.patternHash, trainingData);
        }

        console.log(`Loaded ${response.data.length} training data patterns from Strapi`);
      }
    } catch (error) {
      console.error('Failed to load training data from Strapi:', error);
    }
  }

  /**
   * Update usage count for a pattern
   */
  async updateUsageCount(patternHash: string): Promise<void> {
    const trainingData = this.cache.get(patternHash);
    if (trainingData) {
      trainingData.usageCount++;
      trainingData.lastUsed = new Date();
      trainingData.updatedAt = new Date();

      // Update in Strapi
      try {
        await makeApiRequest(`/booklets/${patternHash}`, 'PUT', {
          usageCount: trainingData.usageCount,
          lastUsed: trainingData.lastUsed.toISOString(),
          updatedAt: trainingData.updatedAt.toISOString()
        });
      } catch (error) {
        console.error('Failed to update usage count in Strapi:', error);
      }
    }
  }

  /**
   * Calculate section breakdown for context
   */
  private calculateSectionBreakdown(answers: Record<string, string>): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    for (const [questionId, answer] of Object.entries(answers)) {
      const section = this.getQuestionSection(questionId);
      if (section) {
        breakdown[section] = (breakdown[section] || 0) + 1;
      }
    }
    
    return breakdown;
  }

  /**
   * Get section for a question ID
   */
  private getQuestionSection(questionId: string): string | null {
    const sectionMapping: Record<string, string> = {
      // Basic info questions
      'name': 'basicinfo',
      'email': 'basicinfo',
      'birthday': 'basicinfo',
      'gender': 'basicinfo',
      'status': 'basicinfo',
      'studydetails': 'basicinfo',
      'howlong': 'basicinfo',
      
      // Sleep habit questions
      'getupregular': 'sleephabit',
      'hourstosleep': 'sleephabit',
      'hourstofallinsleep': 'sleephabit',
      'hourstonoonnap': 'sleephabit',
      'noise': 'sleephabit',
      'noisereason': 'sleephabit',
      
      // Lifestyle questions
      'sport': 'lifestyle',
      'sunshine': 'lifestyle',
      'pressure': 'lifestyle',
      'lively': 'lifestyle',
      'bedroom': 'lifestyle',
      'bed': 'lifestyle',
      
      // Work and study questions
      'distraction': 'working_study',
      'effeciency': 'working_study',
      'unsociable': 'working_study',
      'shiftwork': 'working_study',
      'holiday': 'working_study',
      'bedtimeearly': 'working_study',
      
      // Attitude questions
      'irresponsible': 'attitude',
      'inactive': 'attitude',
      'excessive_rest': 'attitude',
      'complain': 'attitude',
      'ignore': 'attitude',
      'medicine': 'attitude'
    };
    
    return sectionMapping[questionId] || null;
  }

  /**
   * Generate fallback recommendations
   */
  private generateFallbackRecommendations(answers: Record<string, string>): AIRecommendationResponse {
    // Simple rule-based fallback system
    const recommendations = [];
    
    if (answers.getupregular === 'no') {
      recommendations.push({
        id: 'fallback_schedule',
        title: '建立规律的睡眠时间',
        description: '每天在同一时间上床睡觉和起床，即使在周末也要保持这个习惯。',
        category: 'sleephabit',
        priority: 'high' as const,
        confidence: 0.8,
        reasoning: '您表示早起时间不规律，这是改善睡眠质量的重要第一步。',
        actions: [
          {
            title: '设定固定睡眠时间',
            description: '选择适合您的睡眠时间，并坚持执行',
            difficulty: 'medium' as const,
            timeRequired: '5分钟',
            frequency: 'daily',
            expectedImpact: '2-3周内改善睡眠质量'
          }
        ]
      });
    }
    
    return {
      recommendations,
      summary: {
        overallScore: 5,
        primaryIssues: ['睡眠时间不规律'],
        suggestedFocus: ['sleep_schedule'],
        urgency: 'medium'
      },
      insights: {
        patterns: ['基本睡眠习惯需要改善'],
        correlations: ['规律作息与睡眠质量正相关'],
        riskFactors: ['长期失眠可能影响生活质量']
      }
    };
  }

  /**
   * Load cache from localStorage
   */
  private loadCacheFromStorage(): void {
    try {
      const saved = localStorage.getItem('ai_training_data_cache');
      if (saved) {
        const data = JSON.parse(saved);
        for (const [key, value] of Object.entries(data)) {
          this.cache.set(key, value as TrainingDataPattern);
        }
        console.log(`Loaded ${this.cache.size} training data patterns from cache`);
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveCacheToStorage(): void {
    try {
      const data: Record<string, TrainingDataPattern> = {};
      for (const [key, value] of this.cache) {
        data[key] = value;
      }
      localStorage.setItem('ai_training_data_cache', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  /**
   * Get training data statistics
   */
  getTrainingDataStats(): {
    totalPatterns: number;
    totalUsage: number;
    averageConfidence: number;
    mostUsedPatterns: Array<{ patternHash: string; usageCount: number }>;
  } {
    const patterns = Array.from(this.cache.values());
    const totalUsage = patterns.reduce((sum, p) => sum + p.usageCount, 0);
    const averageConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    
    const mostUsedPatterns = patterns
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5)
      .map(p => ({ patternHash: p.patternHash, usageCount: p.usageCount }));

    return {
      totalPatterns: patterns.length,
      totalUsage,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      mostUsedPatterns
    };
  }

  /**
   * Clear old training data (cleanup)
   */
  async cleanupOldTrainingData(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const patternsToRemove: string[] = [];
    
    for (const [hash, trainingData] of this.cache) {
      if (trainingData.lastUsed < cutoffDate && trainingData.usageCount < 5) {
        patternsToRemove.push(hash);
      }
    }
    
    for (const hash of patternsToRemove) {
      this.cache.delete(hash);
    }
    
    this.saveCacheToStorage();
    console.log(`Cleaned up ${patternsToRemove.length} old training data patterns`);
  }
}

// Export singleton instance
export const aiTrainingDataSystem = new AITrainingDataSystem();
