#!/usr/bin/env node

/**
 * Assessment Flow Test Runner
 * 
 * This script runs comprehensive tests on the HelloSleep assessment flow
 * to validate issue calculation and booklet matching.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 HelloSleep Assessment Flow Test Runner');
console.log('=========================================\n');

try {
  // Check if we're in the right directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const fs = require('fs');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Error: package.json not found. Please run this script from the project root.');
    process.exit(1);
  }

  // Run the tests using Node.js
  console.log('🚀 Executing assessment flow tests...\n');
  
  // Create a simple test execution
  const testCode = `
    const { StaticAssessmentEngine } = require('./web/src/lib/static-assessment-engine.ts');
    
    // Simple test scenarios
    const testScenarios = [
      {
        name: 'Sleep Inefficiency Test',
        answers: {
          status: 'work',
          sleepregular: 'no',
          hourstofallinsleep: '2',
          sport: 'no',
          sunshine: 'no',
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
      {
        name: 'Irregular Schedule Test',
        answers: {
          status: 'work',
          sleepregular: 'no',
          sport: 'yes',
          sunshine: 'yes',
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
      {
        name: 'Prenatal Test',
        answers: {
          status: 'prenatal',
          sleepregular: 'no',
          sport: 'no',
          sunshine: 'yes',
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
      }
    ];

    const engine = new StaticAssessmentEngine();
    let passedTests = 0;
    let totalTests = testScenarios.length;

    console.log('Running basic assessment flow tests...\\n');

    testScenarios.forEach((scenario, index) => {
      try {
        const result = engine.processAssessment(scenario.answers);
        const calculatedIssues = result.calculatedIssues;
        const matchedBooklets = result.matchedBooklets.map(b => b.id);
        
        console.log(\`Test \${index + 1}: \${scenario.name}\`);
        console.log(\`  Expected Issues: \${scenario.expectedIssues.join(', ')}\`);
        console.log(\`  Calculated Issues: \${calculatedIssues.join(', ')}\`);
        console.log(\`  Matched Booklets: \${matchedBooklets.join(', ')}\`);
        
        // Check if expected issues were found
        const missingIssues = scenario.expectedIssues.filter(issue => !calculatedIssues.includes(issue));
        const extraIssues = calculatedIssues.filter(issue => !scenario.expectedIssues.includes(issue));
        
        if (missingIssues.length === 0 && extraIssues.length === 0) {
          console.log(\`  ✅ PASS - All expected issues found\`);
          passedTests++;
        } else {
          console.log(\`  ❌ FAIL - Issue mismatch\`);
          if (missingIssues.length > 0) {
            console.log(\`     Missing: \${missingIssues.join(', ')}\`);
          }
          if (extraIssues.length > 0) {
            console.log(\`     Extra: \${extraIssues.join(', ')}\`);
          }
        }
        
        // Check if all calculated issues have booklets
        const issuesWithoutBooklets = calculatedIssues.filter(issue => {
          const booklets = engine.getBookletsByIssue(issue);
          return booklets.length === 0;
        });
        
        if (issuesWithoutBooklets.length > 0) {
          console.log(\`  ⚠️  WARNING - Issues without booklets: \${issuesWithoutBooklets.join(', ')}\`);
        }
        
        console.log('');
        
      } catch (error) {
        console.log(\`  ❌ ERROR - \${error.message}\`);
        console.log('');
      }
    });

    console.log(\`\\n📊 Test Summary\`);
    console.log(\`===============\`);
    console.log(\`Total Tests: \${totalTests}\`);
    console.log(\`Passed: \${passedTests} ✅\`);
    console.log(\`Failed: \${totalTests - passedTests} ❌\`);
    console.log(\`Pass Rate: \${((passedTests / totalTests) * 100).toFixed(1)}%\`);

    // Overall system validation
    const allIssues = engine.getAllIssues();
    const allBooklets = engine.getAllBooklets();
    
    console.log(\`\\n🏷️  System Validation\`);
    console.log(\`===================\`);
    console.log(\`Total Issues: \${allIssues.length}\`);
    console.log(\`Total Booklets: \${allBooklets.length}\`);
    
    // Check issue-booklet mapping
    const issuesWithBooklets = allIssues.filter(issue => {
      const booklets = engine.getBookletsByIssue(issue.name);
      return booklets.length > 0;
    });
    
    console.log(\`Issues with Booklets: \${issuesWithBooklets.length}\`);
    console.log(\`Issues without Booklets: \${allIssues.length - issuesWithBooklets.length}\`);
    
    if (issuesWithBooklets.length === allIssues.length) {
      console.log(\`✅ All issues have associated booklets\`);
    } else {
      console.log(\`❌ Some issues are missing booklets\`);
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
  `;

  // Write test file
  const testFilePath = path.join(process.cwd(), 'temp-assessment-test.js');
  fs.writeFileSync(testFilePath, testCode);

  // Execute the test
  try {
    execSync(`node ${testFilePath}`, { stdio: 'inherit' });
  } finally {
    // Clean up
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }

  console.log('\n🎉 Assessment flow testing completed!');
  console.log('Review the results above to validate the system.');

} catch (error) {
  console.error('❌ Error running assessment tests:', error.message);
  process.exit(1);
}
