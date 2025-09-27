import calculationFunctions from '@/data/static-assessment-calculations';
import { staticQuestions, staticTags, type StaticQuestion, type StaticTag } from '@/data/static-assessment-questions';

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
}

export interface Tag {
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

export interface AssessmentResult {
  answers: Record<string, string>;
  calculatedTags: Tag[];
  completedAt: Date;
}

export class StaticAssessmentEngine {
  private questionsTags: StaticTag[];

  constructor() {
    this.questionsTags = staticTags;
  }

  /**
   * Process assessment answers and return results with tags and recommendations
   */
  processAssessment(answers: Record<string, string>): AssessmentResult {
    const calculatedTags = this.calculateTags(answers);

    return {
      answers,
      calculatedTags,
      completedAt: new Date()
    };
  }

  /**
   * Calculate tags based on assessment answers using the calculation functions
   */
  private calculateTags(answers: Record<string, string>): Tag[] {
    const activeTags: Tag[] = [];

    for (const tag of this.questionsTags) {
      if (this.evaluateTag(tag, answers)) {
        activeTags.push(tag);
      }
    }

    // Sort by priority (high to low)
    return activeTags.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Evaluate if a tag should be activated based on its calculation rules
   */
  private evaluateTag(tag: Tag, answers: Record<string, string>): boolean {
    const { calc } = tag;

    if (calc.question && calc.value) {
      // Simple question-value matching
      return answers[calc.question] === calc.value;
    }

    if (calc.func && calc.input) {
      // Function-based calculation
      return this.evaluateFunction(calc.func, calc.input, answers);
    }

    return false;
  }

  /**
   * Evaluate calculation functions from static-assessment-calculations.ts
   */
  private evaluateFunction(funcName: string, inputParams: string[], answers: Record<string, string>): boolean {
    const func = calculationFunctions[funcName as keyof typeof calculationFunctions];
    
    if (!func || typeof func !== 'function') {
      console.warn(`Function ${funcName} not found in calculation functions`);
      return false;
    }

    try {
      // Extract parameter values from answers
      const paramValues = inputParams.map(param => answers[param]);
      
      // Call the function with the parameter values
      const result = (func as any)(...paramValues);
      
      // Handle both boolean and CalculationResult types
      if (typeof result === 'boolean') {
        return result;
      } else if (result && typeof result === 'object' && 'value' in result) {
        return Boolean(result.value);
      }
      
      return false;
    } catch (error) {
      console.error(`Error evaluating function ${funcName}:`, error);
      return false;
    }
  }

  /**
   * Find booklets that match the calculated tags
   */
  // Booklet matching removed in favor of mapping-based booklet facts

  /**
   * Get all available tags
   */
  getAllTags(): StaticTag[] {
    return this.questionsTags;
  }

  /**
   * Get tag information by name
   */
  getTagByName(tagName: string): StaticTag | undefined {
    return this.questionsTags.find(tag => tag.name === tagName);
  }

  /**
   * Validate that all required answers are present
   */
  validateAnswers(answers: Record<string, string>): { isValid: boolean; missingQuestions: string[] } {
    // Get all question names from the questions_tags.json data
    const allQuestions = new Set<string>();
    
    // Extract question names from tags
    this.questionsTags.forEach(tag => {
      if (tag.calc.question) {
        allQuestions.add(tag.calc.question);
      }
      if (tag.calc.input) {
        tag.calc.input.forEach(question => allQuestions.add(question));
      }
    });

    const missingQuestions: string[] = [];
    
    for (const question of allQuestions) {
      if (!answers[question]) {
        missingQuestions.push(question);
      }
    }

    return {
      isValid: missingQuestions.length === 0,
      missingQuestions
    };
  }

  /**
   * Get assessment progress percentage
   */
  getProgressPercentage(answers: Record<string, string>): number {
    const allQuestions = new Set<string>();
    
    this.questionsTags.forEach(tag => {
      if (tag.calc.question) {
        allQuestions.add(tag.calc.question);
      }
      if (tag.calc.input) {
        tag.calc.input.forEach(question => allQuestions.add(question));
      }
    });

    const totalQuestions = allQuestions.size;
    const answeredQuestions = Array.from(allQuestions).filter(question => answers[question]).length;
    
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }

  /**
   * Save assessment result to localStorage (for demo purposes)
   */
  saveResult(result: AssessmentResult): void {
    try {
      const existingResults = this.getSavedResults();
      existingResults.push(result);
      
      // Keep only last 10 results
      if (existingResults.length > 10) {
        existingResults.splice(0, existingResults.length - 10);
      }
      
      localStorage.setItem('static_assessment_results', JSON.stringify(existingResults));
    } catch (error) {
      console.error('Failed to save assessment result:', error);
    }
  }

  /**
   * Get saved assessment results
   */
  getSavedResults(): AssessmentResult[] {
    try {
      const saved = localStorage.getItem('static_assessment_results');
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

  /**
   * Export assessment data for database migration
   */
  exportDataForDatabase() {
    return {
      tags: this.questionsTags,
      calculationFunctions: Object.keys(calculationFunctions)
    };
  }
}

// Export singleton instance
export const staticAssessmentEngine = new StaticAssessmentEngine();
