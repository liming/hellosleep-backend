import calculationFunctions from '@/data/static-assessment-calculations';
import { staticQuestions, staticIssues, type StaticQuestion, type StaticIssue } from '@/data/static-assessment-questions';
import { mapAnswersToBookletFacts, prioritizeBookletFacts, type BookletFact } from '@/data/assessment-booklets-mapping';

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
}

export interface Issue {
  id: string;
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
  interventions: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

export interface AssessmentResult {
  answers: Record<string, string>;
  calculatedIssues: string[];
  bookletFacts: BookletFact[];
  completedAt: Date;
}

export class StaticAssessmentEngine {
  private questionsIssues: StaticIssue[];

  constructor() {
    this.questionsIssues = staticIssues;
  }

  /**
   * Process assessment answers and return results with issues and booklets
   */
  processAssessment(answers: Record<string, string>): AssessmentResult {
    const calculatedIssues = this.calculateIssues(answers);
    const mappedFacts = mapAnswersToBookletFacts(answers);
    const prioritizedFacts = prioritizeBookletFacts(mappedFacts, answers);

    return {
      answers,
      calculatedIssues,
      bookletFacts: prioritizedFacts,
      completedAt: new Date()
    };
  }

  /**
   * Calculate issues based on assessment answers using the calculation functions
   */
  private calculateIssues(answers: Record<string, string>): string[] {
    const activeIssues: string[] = [];

    for (const issue of this.questionsIssues) {
      if (this.evaluateIssue(issue, answers)) {
        activeIssues.push(issue.name);
      }
    }

    return activeIssues;
  }

  /**
   * Evaluate if an issue should be activated based on its calculation rules
   */
  private evaluateIssue(issue: Issue, answers: Record<string, string>): boolean {
    const { calc } = issue;

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
   * Find booklets that match the calculated issues
   */
  // Booklet matching removed in favor of mapping-based booklet facts

  /**
   * Get all available issues
   */
  getAllIssues(): StaticIssue[] {
    return this.questionsIssues;
  }

  /**
   * Get issue information by name
   */
  getIssueByName(issueName: string): StaticIssue | undefined {
    return this.questionsIssues.find(issue => issue.name === issueName);
  }

  /**
   * Validate that all required answers are present
   */
  validateAnswers(answers: Record<string, string>): { isValid: boolean; missingQuestions: string[] } {
    // Get all question names from the questions_tags.json data
    const allQuestions = new Set<string>();
    
    // Extract question names from issues
    this.questionsIssues.forEach(issue => {
      if (issue.calc.question) {
        allQuestions.add(issue.calc.question);
      }
      if (issue.calc.input) {
        issue.calc.input.forEach(question => allQuestions.add(question));
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
    
    this.questionsIssues.forEach(issue => {
      if (issue.calc.question) {
        allQuestions.add(issue.calc.question);
      }
      if (issue.calc.input) {
        issue.calc.input.forEach(question => allQuestions.add(question));
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
      issues: this.questionsIssues,
      calculationFunctions: Object.keys(calculationFunctions)
    };
  }
}

// Export singleton instance
export const staticAssessmentEngine = new StaticAssessmentEngine();
