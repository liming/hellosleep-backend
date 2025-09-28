import { StaticAssessmentEngine } from './static-assessment-engine';
import { staticQuestions, staticIssues } from '@/data/static-assessment-questions';

interface TestScenario {
  name: string;
  description: string;
  answers: Record<string, string>;
  expectedIssues?: string[];
}

interface TestResult {
  scenario: TestScenario;
  calculatedIssues: string[];
  passed: boolean;
  issues: string[];
}

export class AssessmentFlowTester {
  private engine: StaticAssessmentEngine;

  constructor() {
    this.engine = new StaticAssessmentEngine();
  }

  /**
   * Run comprehensive tests on the assessment flow
   */
  runTests(): TestResult[] {
    const testScenarios = this.generateTestScenarios();
    const results: TestResult[] = [];

    console.log('🧪 Starting Assessment Flow Tests...\n');

    for (const scenario of testScenarios) {
      const result = this.testScenario(scenario);
      results.push(result);
      
      // Log test result
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${scenario.name}`);
      if (!result.passed) {
        console.log(`   Issues: ${result.issues.join(', ')}`);
      }
    }

    this.generateTestReport(results);
    return results;
  }

  /**
   * Test a single scenario
   */
  private testScenario(scenario: TestScenario): TestResult {
    const result = this.engine.processAssessment(scenario.answers);
    const calculatedIssues = result.calculatedIssues;
    
    const issues: string[] = [];
    let passed = true;

    // Check if expected issues were calculated
    if (scenario.expectedIssues) {
      for (const expectedIssue of scenario.expectedIssues) {
        if (!calculatedIssues.includes(expectedIssue)) {
          issues.push(`Missing expected issue: ${expectedIssue}`);
          passed = false;
        }
      }
    }

    return {
      scenario,
      calculatedIssues,
      passed,
      issues
    };
  }

  /**
   * Generate comprehensive test scenarios
   */
  private generateTestScenarios(): TestScenario[] {
    return [
      // Basic scenarios
      {
        name: 'Regular Worker - Healthy Lifestyle',
        description: 'A regular worker with healthy lifestyle habits',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: []
      },

      // Sleep inefficiency scenario
      {
        name: 'Sleep Inefficiency - Long Time to Fall Asleep',
        description: 'User takes long time to fall asleep',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'no',
          sleeptime: '23:00',
          getuptime: '07:00',
          hourstosleep: '8',
          hourstofallinsleep: '2',
          sport: 'no',
          sunshine: 'no',
          pressure: 'high',
          lively: 'inactive',
          bedroom: 'yes',
          bed: 'yes',
          noise: 'no',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['sleep_inefficiency', 'unhealthy_lifestyle', 'bedroom_overuse']
      },

      // Irregular schedule scenario
      {
        name: 'Irregular Schedule',
        description: 'User has irregular sleep schedule',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'no',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['irregular_schedule']
      },

      // Poor sleep quality scenario
      {
        name: 'Poor Sleep Quality',
        description: 'User reports poor sleep quality',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sleep_quality: 'poor',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['poor_sleep_quality']
      },

      // Unhealthy lifestyle scenario
      {
        name: 'Unhealthy Lifestyle - No Exercise, No Sunshine',
        description: 'User lacks exercise and sunshine exposure',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sport: 'no',
          sunshine: 'no',
          pressure: 'normal',
          lively: 'inactive',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['unhealthy_lifestyle']
      },

      // Idle lifestyle scenario
      {
        name: 'Idle Lifestyle - Low Pressure, Inactive',
        description: 'User has low pressure and inactive lifestyle',
        answers: {
          status: 'unemployed',
          age_group: '26-35',
          sleepregular: 'no',
          sport: 'no',
          sunshine: 'no',
          pressure: 'low',
          lively: 'very_inactive',
          bedroom: 'yes',
          bed: 'yes',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['idle_lifestyle', 'bedroom_overuse']
      },

      // Bedroom overuse scenario
      {
        name: 'Bedroom Overuse',
        description: 'User spends too much time in bedroom and bed',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'yes',
          bed: 'yes',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['bedroom_overuse']
      },

      // Prenatal scenario
      {
        name: 'Prenatal - Pregnant Woman',
        description: 'Pregnant woman with special needs',
        answers: {
          status: 'prenatal',
          age_group: '26-35',
          sleepregular: 'no',
          sport: 'no',
          sunshine: 'yes',
          pressure: 'high',
          lively: 'normal',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['prenatal']
      },

      // Postnatal scenario
      {
        name: 'Postnatal - Postpartum Woman',
        description: 'Postpartum woman with special needs',
        answers: {
          status: 'postnatal',
          age_group: '26-35',
          sleepregular: 'no',
          sport: 'no',
          sunshine: 'no',
          pressure: 'high',
          lively: 'inactive',
          bedroom: 'yes',
          bed: 'yes',
          noise: 'no',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['postnatal']
      },

      // Student issues scenario
      {
        name: 'Student Issues - Holiday Insomnia',
        description: 'Student with holiday insomnia',
        answers: {
          status: 'study',
          age_group: '18-25',
          sleepregular: 'no',
          holiday: 'yes',
          bedtimeearly: 'yes',
          sport: 'no',
          sunshine: 'no',
          pressure: 'low',
          lively: 'inactive',
          bedroom: 'yes',
          bed: 'yes',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['student_issues']
      },

      // Shift work scenario
      {
        name: 'Shift Work - Irregular Schedule',
        description: 'Shift worker with irregular schedule',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'no',
          shiftwork: 'yes',
          sport: 'yes',
          sunshine: 'no',
          pressure: 'high',
          lively: 'normal',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedIssues: ['shift_work']
      },

      // Maladaptive behaviors scenario
      {
        name: 'Maladaptive Behaviors - Multiple Issues',
        description: 'User with multiple maladaptive behaviors',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'no',
          sport: 'no',
          sunshine: 'no',
          pressure: 'high',
          lively: 'inactive',
          bedroom: 'yes',
          bed: 'yes',
          noise: 'no',
          irresponsible: 'yes',
          inactive: 'yes',
          excessive_rest: 'yes',
          complain: 'yes',
          ignore: 'yes',
          medicine: 'yes'
        },
        expectedTags: ['maladaptive_behaviors', 'bedroom_overuse', 'excessive_complaining', 'medication_use']
      },

      // Excessive complaining scenario
      {
        name: 'Excessive Complaining',
        description: 'User complains excessively about sleep',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'yes',
          ignore: 'no',
          medicine: 'no'
        },
        expectedTags: ['excessive_complaining']
      },

      // Medication use scenario
      {
        name: 'Medication Use',
        description: 'User uses sleep medication',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'no',
          bed: 'no',
          noise: 'yes',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'yes'
        },
        expectedTags: ['medication_use']
      },

      // Noise problem scenario
      {
        name: 'Noise Problem',
        description: 'User has noise problems in sleep environment',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'no',
          bed: 'no',
          noise: 'no',
          noisereason: 'neighbour',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedTags: ['noise_problem']
      },

      // Partner snoring scenario
      {
        name: 'Partner Snoring',
        description: 'User affected by partner snoring',
        answers: {
          status: 'work',
          age_group: '26-35',
          sleepregular: 'yes',
          sport: 'yes',
          sunshine: 'yes',
          pressure: 'normal',
          lively: 'active',
          bedroom: 'no',
          bed: 'no',
          noise: 'no',
          noisereason: 'snore',
          irresponsible: 'no',
          inactive: 'no',
          excessive_rest: 'no',
          complain: 'no',
          ignore: 'no',
          medicine: 'no'
        },
        expectedTags: ['partner_snoring']
      },

      // Complex scenario - Multiple issues
      {
        name: 'Complex Scenario - Multiple Issues',
        description: 'User with multiple sleep and lifestyle issues',
        answers: {
          status: 'work',
          age_group: '36-45',
          sleepregular: 'no',
          sleep_quality: 'poor',
          sport: 'no',
          sunshine: 'no',
          pressure: 'high',
          lively: 'inactive',
          bedroom: 'yes',
          bed: 'yes',
          noise: 'no',
          noisereason: 'snore',
          irresponsible: 'yes',
          inactive: 'yes',
          excessive_rest: 'yes',
          complain: 'yes',
          ignore: 'yes',
          medicine: 'yes'
        },
        expectedIssues: ['irregular_schedule', 'poor_sleep_quality', 'unhealthy_lifestyle', 'bedroom_overuse', 'partner_snoring', 'maladaptive_behaviors', 'excessive_complaining', 'medication_use']
      }
    ];
  }

  /**
   * Generate comprehensive test report
   */
  private generateTestReport(results: TestResult[]): void {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log('\n📊 Test Report Summary');
    console.log('=====================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Pass Rate: ${passRate}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      results.filter(r => !r.passed).forEach(result => {
        console.log(`\n${result.scenario.name}:`);
        console.log(`  Expected Issues: ${result.scenario.expectedIssues?.join(', ') || 'None'}`);
        console.log(`  Calculated Issues: ${result.calculatedIssues.join(', ') || 'None'}`);
        console.log(`  Issues: ${result.issues.join(', ')}`);
      });
    }

    // Issue coverage analysis
    this.analyzeIssueCoverage(results);
  }

  /**
   * Analyze issue coverage across all tests
   */
  private analyzeIssueCoverage(results: TestResult[]): void {
    console.log('\n🏷️ Issue Coverage Analysis');
    console.log('======================');

    const allCalculatedIssues = new Set<string>();
    const allExpectedIssues = new Set<string>();

    results.forEach(result => {
      result.calculatedIssues.forEach(issue => allCalculatedIssues.add(issue));
      result.scenario.expectedIssues?.forEach(issue => allExpectedIssues.add(issue));
    });

    console.log(`Total Unique Issues Calculated: ${allCalculatedIssues.size}`);
    console.log(`Total Unique Issues Expected: ${allExpectedIssues.size}`);

    const calculatedIssuesList = Array.from(allCalculatedIssues).sort();
    const expectedIssuesList = Array.from(allExpectedIssues).sort();

    console.log('\nCalculated Issues:', calculatedIssuesList.join(', '));
    console.log('Expected Issues:', expectedIssuesList.join(', '));
  }
}

// Export for use in other files
export default AssessmentFlowTester;
