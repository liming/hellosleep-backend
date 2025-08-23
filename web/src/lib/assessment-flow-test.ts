import { StaticAssessmentEngine } from './static-assessment-engine';
import { staticQuestions, staticTags } from '@/data/static-assessment-questions';
import { staticBooklets } from '@/data/static-assessment-booklets';

interface TestScenario {
  name: string;
  description: string;
  answers: Record<string, string>;
  expectedTags?: string[];
  expectedBooklets?: string[];
}

interface TestResult {
  scenario: TestScenario;
  calculatedTags: string[];
  matchedBooklets: string[];
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
    const calculatedTags = result.calculatedTags;
    const matchedBooklets = result.matchedBooklets.map(b => b.id);
    
    const issues: string[] = [];
    let passed = true;

    // Check if expected tags were calculated
    if (scenario.expectedTags) {
      for (const expectedTag of scenario.expectedTags) {
        if (!calculatedTags.includes(expectedTag)) {
          issues.push(`Missing expected tag: ${expectedTag}`);
          passed = false;
        }
      }
    }

    // Check if expected booklets were matched
    if (scenario.expectedBooklets) {
      for (const expectedBooklet of scenario.expectedBooklets) {
        if (!matchedBooklets.includes(expectedBooklet)) {
          issues.push(`Missing expected booklet: ${expectedBooklet}`);
          passed = false;
        }
      }
    }

    // Check if all calculated tags have associated booklets
    for (const tag of calculatedTags) {
      const bookletsForTag = this.engine.getBookletsByTag(tag);
      if (bookletsForTag.length === 0) {
        issues.push(`Tag ${tag} has no associated booklets`);
        passed = false;
      }
    }

    return {
      scenario,
      calculatedTags,
      matchedBooklets,
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
        expectedTags: [],
        expectedBooklets: []
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
        expectedTags: ['sleep_inefficiency', 'unhealthy_lifestyle', 'bedroom_overuse'],
        expectedBooklets: ['rest_quality_guide', 'vitality_enhancement_guide', 'living_space_guide']
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
        expectedTags: ['irregular_schedule'],
        expectedBooklets: ['life_rhythm_guide']
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
        expectedTags: ['poor_sleep_quality'],
        expectedBooklets: ['life_satisfaction_guide']
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
        expectedTags: ['unhealthy_lifestyle'],
        expectedBooklets: ['vitality_enhancement_guide']
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
        expectedTags: ['idle_lifestyle', 'bedroom_overuse'],
        expectedBooklets: ['meaningful_activities_guide', 'living_space_guide']
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
        expectedTags: ['bedroom_overuse'],
        expectedBooklets: ['living_space_guide']
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
        expectedTags: ['prenatal'],
        expectedBooklets: ['prenatal_wellness_guide']
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
        expectedTags: ['postnatal'],
        expectedBooklets: ['postnatal_life_guide']
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
        expectedTags: ['student_issues'],
        expectedBooklets: ['student_life_guide']
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
        expectedTags: ['shift_work'],
        expectedBooklets: ['shift_work_life_guide']
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
        expectedTags: ['maladaptive_behaviors', 'bedroom_overuse', 'excessive_complaining', 'medication_use'],
        expectedBooklets: ['life_balance_guide', 'living_space_guide', 'positive_focus_guide', 'natural_lifestyle_guide']
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
        expectedTags: ['excessive_complaining'],
        expectedBooklets: ['positive_focus_guide']
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
        expectedTags: ['medication_use'],
        expectedBooklets: ['natural_lifestyle_guide']
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
        expectedTags: ['noise_problem'],
        expectedBooklets: ['peaceful_environment_guide']
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
        expectedTags: ['partner_snoring'],
        expectedBooklets: ['relationship_harmony_guide']
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
        expectedTags: ['irregular_schedule', 'poor_sleep_quality', 'unhealthy_lifestyle', 'bedroom_overuse', 'partner_snoring', 'maladaptive_behaviors', 'excessive_complaining', 'medication_use'],
        expectedBooklets: ['life_rhythm_guide', 'life_satisfaction_guide', 'vitality_enhancement_guide', 'living_space_guide', 'relationship_harmony_guide', 'life_balance_guide', 'positive_focus_guide', 'natural_lifestyle_guide']
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
        console.log(`  Expected Tags: ${result.scenario.expectedTags?.join(', ') || 'None'}`);
        console.log(`  Calculated Tags: ${result.calculatedTags.join(', ') || 'None'}`);
        console.log(`  Expected Booklets: ${result.scenario.expectedBooklets?.join(', ') || 'None'}`);
        console.log(`  Matched Booklets: ${result.matchedBooklets.join(', ') || 'None'}`);
        console.log(`  Issues: ${result.issues.join(', ')}`);
      });
    }

    // Tag coverage analysis
    this.analyzeTagCoverage(results);

    // Booklet coverage analysis
    this.analyzeBookletCoverage(results);
  }

  /**
   * Analyze tag coverage across all tests
   */
  private analyzeTagCoverage(results: TestResult[]): void {
    console.log('\n🏷️ Tag Coverage Analysis');
    console.log('======================');

    const allCalculatedTags = new Set<string>();
    const allExpectedTags = new Set<string>();

    results.forEach(result => {
      result.calculatedTags.forEach(tag => allCalculatedTags.add(tag));
      result.scenario.expectedTags?.forEach(tag => allExpectedTags.add(tag));
    });

    console.log(`Total Unique Tags Calculated: ${allCalculatedTags.size}`);
    console.log(`Total Unique Tags Expected: ${allExpectedTags.size}`);

    const calculatedTagsList = Array.from(allCalculatedTags).sort();
    const expectedTagsList = Array.from(allExpectedTags).sort();

    console.log('\nCalculated Tags:', calculatedTagsList.join(', '));
    console.log('Expected Tags:', expectedTagsList.join(', '));

    // Check for tags without booklets
    const tagsWithoutBooklets: string[] = [];
    calculatedTagsList.forEach(tag => {
      const booklets = this.engine.getBookletsByTag(tag);
      if (booklets.length === 0) {
        tagsWithoutBooklets.push(tag);
      }
    });

    if (tagsWithoutBooklets.length > 0) {
      console.log('\n⚠️ Tags without booklets:', tagsWithoutBooklets.join(', '));
    } else {
      console.log('\n✅ All calculated tags have associated booklets');
    }
  }

  /**
   * Analyze booklet coverage across all tests
   */
  private analyzeBookletCoverage(results: TestResult[]): void {
    console.log('\n📚 Booklet Coverage Analysis');
    console.log('==========================');

    const allMatchedBooklets = new Set<string>();
    const allExpectedBooklets = new Set<string>();

    results.forEach(result => {
      result.matchedBooklets.forEach(booklet => allMatchedBooklets.add(booklet));
      result.scenario.expectedBooklets?.forEach(booklet => allExpectedBooklets.add(booklet));
    });

    console.log(`Total Unique Booklets Matched: ${allMatchedBooklets.size}`);
    console.log(`Total Unique Booklets Expected: ${allExpectedBooklets.size}`);

    const matchedBookletsList = Array.from(allMatchedBooklets).sort();
    const expectedBookletsList = Array.from(allExpectedBooklets).sort();

    console.log('\nMatched Booklets:', matchedBookletsList.join(', '));
    console.log('Expected Booklets:', expectedBookletsList.join(', '));

    // Check for unused booklets
    const allBooklets = this.engine.getAllBooklets().map(b => b.id);
    const unusedBooklets = allBooklets.filter(booklet => !allMatchedBooklets.has(booklet));

    if (unusedBooklets.length > 0) {
      console.log('\n⚠️ Unused booklets:', unusedBooklets.join(', '));
    } else {
      console.log('\n✅ All booklets were matched in tests');
    }
  }
}

// Export for use in other files
export default AssessmentFlowTester;
