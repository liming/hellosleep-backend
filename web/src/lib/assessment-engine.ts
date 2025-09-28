import { 
  assessmentQuestions, 
  assessmentSections, 
  type AssessmentQuestion,
  type AssessmentSection,
  getAllQuestionsOrdered,
  getAllSectionsOrdered,
  getQuestionsBySection,
  shouldShowQuestion,
  getVisibleQuestions
} from '@/data/static-assessment-questions';
import { 
  getRecommendationsForAnswers, 
  calculateTotalScore,
  type Recommendation 
} from '@/data/assessment-recommendations';

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
}

export interface SectionScore {
  sectionId: string;
  sectionName: string;
  score: number;
  maxScore: number;
  percentage: number;
  label: string;
  answeredQuestions: number;
  totalQuestions: number;
}

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  sectionScores: SectionScore[];
  recommendations: Recommendation[];
  completedAt: Date;
  answers: AssessmentAnswer[];
  sections: AssessmentSection[];
}

export class AssessmentEngine {
  private questions: AssessmentQuestion[];
  private sections: AssessmentSection[];

  constructor() {
    this.questions = getAllQuestionsOrdered();
    this.sections = getAllSectionsOrdered();
  }

  /**
   * Calculate scores for each section based on answers
   */
  calculateSectionScores(answers: Record<string, string>): SectionScore[] {
    const sectionScores: SectionScore[] = [];

    for (const section of this.sections) {
      const sectionQuestions = getQuestionsBySection(section.id);
      const visibleQuestions = getVisibleQuestions(sectionQuestions, answers);
      
      let totalScore = 0;
      let maxScore = 0;
      let answeredQuestions = 0;

      for (const question of visibleQuestions) {
        const answer = answers[question.id];
        if (!answer) continue;

        // For now, we'll use a simple scoring system
        // In a real implementation, you'd have more sophisticated scoring logic
        let questionScore = 0;
        let questionMaxScore = 4; // Default max score per question

        if (question.type === 'single_choice' && question.options) {
          // Simple scoring: first option = 1, last option = 4
          const optionIndex = question.options.findIndex(opt => opt.value === answer);
          if (optionIndex !== -1) {
            questionScore = optionIndex + 1;
          }
        } else if (question.type === 'scale') {
          // For scale questions, normalize the value
          const numValue = parseFloat(answer);
          if (!isNaN(numValue) && question.max && question.min) {
            questionScore = ((numValue - question.min) / (question.max - question.min)) * 4;
          }
        } else {
          // For other types, give a default score
          questionScore = 2; // Neutral score
        }

        const weight = question.weight || 1;
        totalScore += questionScore * weight;
        maxScore += questionMaxScore * weight;
        answeredQuestions++;
      }

      // Only include sections with answered questions
      if (answeredQuestions > 0) {
        const percentage = (totalScore / maxScore) * 100;
        sectionScores.push({
          sectionId: section.id,
          sectionName: section.description,
          score: totalScore,
          maxScore,
          percentage: Math.round(percentage * 10) / 10,
          label: this.getScoreLabel(percentage),
          answeredQuestions,
          totalQuestions: visibleQuestions.length
        });
      }
    }

    return sectionScores;
  }

  /**
   * Calculate overall score
   */
  calculateTotalScore(answers: Record<string, string>): { score: number; maxScore: number; percentage: number } {
    const visibleQuestions = getVisibleQuestions(this.questions, answers);
    let totalScore = 0;
    let maxScore = 0;

    for (const question of visibleQuestions) {
      const answer = answers[question.id];
      if (!answer) continue;

      let questionScore = 0;
      let questionMaxScore = 4;

      if (question.type === 'single_choice' && question.options) {
        const optionIndex = question.options.findIndex(opt => opt.value === answer);
        if (optionIndex !== -1) {
          questionScore = optionIndex + 1;
        }
      } else if (question.type === 'scale') {
        const numValue = parseFloat(answer);
        if (!isNaN(numValue) && question.max && question.min) {
          questionScore = ((numValue - question.min) / (question.max - question.min)) * 4;
        }
      } else {
        questionScore = 2; // Neutral score for other types
      }

      const weight = question.weight || 1;
      totalScore += questionScore * weight;
      maxScore += questionMaxScore * weight;
    }

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      score: totalScore,
      maxScore,
      percentage: Math.round(percentage * 10) / 10
    };
  }

  /**
   * Get score label based on percentage
   */
  private getScoreLabel(percentage: number): string {
    if (percentage >= 90) return '优秀';
    if (percentage >= 80) return '良好';
    if (percentage >= 70) return '一般';
    if (percentage >= 60) return '需要改善';
    return '需要专业帮助';
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(answers: Record<string, string>): Recommendation[] {
    const sectionScores = this.calculateSectionScores(answers);
    const sectionScoreMap: Record<string, number> = {};
    
    sectionScores.forEach(section => {
      sectionScoreMap[section.sectionId] = section.percentage;
    });

    return getRecommendationsForAnswers(answers, sectionScoreMap);
  }

  /**
   * Process complete assessment
   */
  processAssessment(answers: Record<string, string>): AssessmentResult {
    const sectionScores = this.calculateSectionScores(answers);
    const totalScoreData = this.calculateTotalScore(answers);
    const recommendations = this.generateRecommendations(answers);

    // Convert answers to AssessmentAnswer format
    const assessmentAnswers: AssessmentAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
      timestamp: new Date()
    }));

    return {
      totalScore: totalScoreData.score,
      maxScore: totalScoreData.maxScore,
      percentage: totalScoreData.percentage,
      sectionScores,
      recommendations,
      completedAt: new Date(),
      answers: assessmentAnswers,
      sections: this.sections
    };
  }

  /**
   * Get question by ID
   */
  getQuestion(questionId: string): AssessmentQuestion | undefined {
    return this.questions.find(q => q.id === questionId);
  }

  /**
   * Get all questions ordered by sequence
   */
  getAllQuestions(): AssessmentQuestion[] {
    return this.questions;
  }

  /**
   * Get questions for a specific section
   */
  getQuestionsBySection(sectionId: string): AssessmentQuestion[] {
    return getQuestionsBySection(sectionId);
  }

  /**
   * Get all sections ordered by sequence
   */
  getAllSections(): AssessmentSection[] {
    return this.sections;
  }

  /**
   * Get visible questions based on current answers
   */
  getVisibleQuestions(answers: Record<string, string>): AssessmentQuestion[] {
    return getVisibleQuestions(this.questions, answers);
  }

  /**
   * Check if a question should be shown based on dependencies
   */
  shouldShowQuestion(question: AssessmentQuestion, answers: Record<string, string>): boolean {
    return shouldShowQuestion(question, answers);
  }

  /**
   * Validate answers completeness
   */
  validateAnswers(answers: Record<string, string>): { isValid: boolean; missingQuestions: string[] } {
    const visibleQuestions = this.getVisibleQuestions(answers);
    const requiredQuestions = visibleQuestions.filter(q => q.required);
    const missingQuestions: string[] = [];

    for (const question of requiredQuestions) {
      if (!answers[question.id]) {
        missingQuestions.push(question.id);
      }
    }

    return {
      isValid: missingQuestions.length === 0,
      missingQuestions
    };
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(answers: Record<string, string>): number {
    const visibleQuestions = this.getVisibleQuestions(answers);
    const answeredQuestions = visibleQuestions.filter(q => answers[q.id]).length;
    return Math.round((answeredQuestions / visibleQuestions.length) * 100);
  }

  /**
   * Get current section based on answers
   */
  getCurrentSection(answers: Record<string, string>): AssessmentSection | null {
    const visibleQuestions = this.getVisibleQuestions(answers);
    if (visibleQuestions.length === 0) return null;

    const currentQuestion = visibleQuestions.find(q => !answers[q.id]) || visibleQuestions[visibleQuestions.length - 1];
    return this.sections.find(s => s.id === currentQuestion.category) || null;
  }

  /**
   * Get next question to answer
   */
  getNextQuestion(answers: Record<string, string>): AssessmentQuestion | null {
    const visibleQuestions = this.getVisibleQuestions(answers);
    return visibleQuestions.find(q => !answers[q.id]) || null;
  }

  /**
   * Get previous question
   */
  getPreviousQuestion(currentQuestionId: string, answers: Record<string, string>): AssessmentQuestion | null {
    const visibleQuestions = this.getVisibleQuestions(answers);
    const currentIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex <= 0) return null;
    return visibleQuestions[currentIndex - 1];
  }

  /**
   * Save assessment result to localStorage (for demo purposes)
   * In production, this would save to your backend
   */
  saveResult(result: AssessmentResult): void {
    try {
      const existingResults = this.getSavedResults();
      existingResults.push(result);
      
      // Keep only last 10 results
      if (existingResults.length > 10) {
        existingResults.splice(0, existingResults.length - 10);
      }
      
      localStorage.setItem('sleep_assessment_results', JSON.stringify(existingResults));
    } catch (error) {
      console.error('Failed to save assessment result:', error);
    }
  }

  /**
   * Get saved assessment results
   */
  getSavedResults(): AssessmentResult[] {
    try {
      const saved = localStorage.getItem('sleep_assessment_results');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load saved results:', error);
      return [];
    }
  }

  /**
   * Get latest assessment result
   */
  getLatestResult(): AssessmentResult | null {
    const results = this.getSavedResults();
    return results.length > 0 ? results[results.length - 1] : null;
  }
}

// Export singleton instance
export const assessmentEngine = new AssessmentEngine(); 