import AssessmentFlowTester from './assessment-flow-test';

/**
 * Run assessment flow tests and generate comprehensive results
 */
export async function runAssessmentTests(): Promise<void> {
  console.log('🚀 Starting HelloSleep Assessment Flow Validation');
  console.log('================================================\n');

  try {
    const tester = new AssessmentFlowTester();
    const results = tester.runTests();

    // Generate detailed results file
    await generateDetailedResults(results);

    console.log('\n🎉 Assessment Flow Testing Completed!');
    console.log('Check the generated test results for detailed analysis.');

  } catch (error) {
    console.error('❌ Error running assessment tests:', error);
    throw error;
  }
}

/**
 * Generate detailed test results file
 */
async function generateDetailedResults(results: any[]): Promise<void> {
  const fs = require('fs').promises;
  const path = require('path');

  const resultsData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
      failedTests: results.filter(r => !r.passed).length,
      passRate: ((results.filter(r => r.passed).length / results.length) * 100).toFixed(1) + '%'
    },
    testResults: results.map(result => ({
      scenario: result.scenario.name,
      description: result.scenario.description,
      passed: result.passed,
      issues: result.issues,
      calculatedTags: result.calculatedTags,
      matchedBooklets: result.matchedBooklets,
      expectedTags: result.scenario.expectedTags || [],
      expectedBooklets: result.scenario.expectedBooklets || []
    })),
    analysis: {
      tagCoverage: analyzeTagCoverage(results),
      bookletCoverage: analyzeBookletCoverage(results),
      recommendations: generateRecommendations(results)
    }
  };

  const outputPath = path.join(process.cwd(), 'ASSESSMENT_TEST_RESULTS.json');
  await fs.writeFile(outputPath, JSON.stringify(resultsData, null, 2));
  
  console.log(`\n📄 Detailed results saved to: ${outputPath}`);
}

/**
 * Analyze tag coverage from test results
 */
function analyzeTagCoverage(results: any[]): any {
  const allCalculatedTags = new Set<string>();
  const allExpectedTags = new Set<string>();
  const tagFrequency: Record<string, number> = {};

  results.forEach(result => {
    result.calculatedTags.forEach((tag: string) => {
      allCalculatedTags.add(tag);
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
    result.scenario.expectedTags?.forEach((tag: string) => {
      allExpectedTags.add(tag);
    });
  });

  return {
    totalUniqueTags: allCalculatedTags.size,
    calculatedTags: Array.from(allCalculatedTags).sort(),
    expectedTags: Array.from(allExpectedTags).sort(),
    tagFrequency,
    coverageGaps: Array.from(allExpectedTags).filter(tag => !allCalculatedTags.has(tag))
  };
}

/**
 * Analyze booklet coverage from test results
 */
function analyzeBookletCoverage(results: any[]): any {
  const allMatchedBooklets = new Set<string>();
  const allExpectedBooklets = new Set<string>();
  const bookletFrequency: Record<string, number> = {};

  results.forEach(result => {
    result.matchedBooklets.forEach((booklet: string) => {
      allMatchedBooklets.add(booklet);
      bookletFrequency[booklet] = (bookletFrequency[booklet] || 0) + 1;
    });
    result.scenario.expectedBooklets?.forEach((booklet: string) => {
      allExpectedBooklets.add(booklet);
    });
  });

  return {
    totalUniqueBooklets: allMatchedBooklets.size,
    matchedBooklets: Array.from(allMatchedBooklets).sort(),
    expectedBooklets: Array.from(allExpectedBooklets).sort(),
    bookletFrequency,
    coverageGaps: Array.from(allExpectedBooklets).filter(booklet => !allMatchedBooklets.has(booklet))
  };
}

/**
 * Generate recommendations based on test results
 */
function generateRecommendations(results: any[]): string[] {
  const recommendations: string[] = [];
  const failedTests = results.filter(r => !r.passed);

  if (failedTests.length > 0) {
    recommendations.push(`Address ${failedTests.length} failed test scenarios`);
    
    const missingTags = new Set<string>();
    const missingBooklets = new Set<string>();
    
    failedTests.forEach(test => {
      test.scenario.expectedTags?.forEach((tag: string) => {
        if (!test.calculatedTags.includes(tag)) {
          missingTags.add(tag);
        }
      });
      test.scenario.expectedBooklets?.forEach((booklet: string) => {
        if (!test.matchedBooklets.includes(booklet)) {
          missingBooklets.add(booklet);
        }
      });
    });

    if (missingTags.size > 0) {
      recommendations.push(`Review tag calculation logic for: ${Array.from(missingTags).join(', ')}`);
    }
    
    if (missingBooklets.size > 0) {
      recommendations.push(`Verify booklet mapping for: ${Array.from(missingBooklets).join(', ')}`);
    }
  }

  const passRate = (results.filter(r => r.passed).length / results.length) * 100;
  if (passRate >= 90) {
    recommendations.push('Excellent test coverage achieved - system is ready for production');
  } else if (passRate >= 80) {
    recommendations.push('Good test coverage - consider addressing remaining issues before production');
  } else {
    recommendations.push('Test coverage needs improvement - review and fix issues before production');
  }

  return recommendations;
}

// Export for use in other files
export default runAssessmentTests;
