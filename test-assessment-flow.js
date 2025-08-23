#!/usr/bin/env node

/**
 * Assessment Flow Test Runner
 * 
 * This script runs comprehensive tests on the HelloSleep assessment flow
 * to validate tag calculation and booklet matching.
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
        expectedTags: ['sleep_inefficiency', 'unhealthy_lifestyle', 'bedroom_overuse']
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
        expectedTags: ['irregular_schedule']
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
        expectedTags: ['prenatal']
      }
    ];

    const engine = new StaticAssessmentEngine();
    let passedTests = 0;
    let totalTests = testScenarios.length;

    console.log('Running basic assessment flow tests...\\n');

    testScenarios.forEach((scenario, index) => {
      try {
        const result = engine.processAssessment(scenario.answers);
        const calculatedTags = result.calculatedTags;
        const matchedBooklets = result.matchedBooklets.map(b => b.id);
        
        console.log(\`Test \${index + 1}: \${scenario.name}\`);
        console.log(\`  Expected Tags: \${scenario.expectedTags.join(', ')}\`);
        console.log(\`  Calculated Tags: \${calculatedTags.join(', ')}\`);
        console.log(\`  Matched Booklets: \${matchedBooklets.join(', ')}\`);
        
        // Check if expected tags were found
        const missingTags = scenario.expectedTags.filter(tag => !calculatedTags.includes(tag));
        const extraTags = calculatedTags.filter(tag => !scenario.expectedTags.includes(tag));
        
        if (missingTags.length === 0 && extraTags.length === 0) {
          console.log(\`  ✅ PASS - All expected tags found\`);
          passedTests++;
        } else {
          console.log(\`  ❌ FAIL - Tag mismatch\`);
          if (missingTags.length > 0) {
            console.log(\`     Missing: \${missingTags.join(', ')}\`);
          }
          if (extraTags.length > 0) {
            console.log(\`     Extra: \${extraTags.join(', ')}\`);
          }
        }
        
        // Check if all calculated tags have booklets
        const tagsWithoutBooklets = calculatedTags.filter(tag => {
          const booklets = engine.getBookletsByTag(tag);
          return booklets.length === 0;
        });
        
        if (tagsWithoutBooklets.length > 0) {
          console.log(\`  ⚠️  WARNING - Tags without booklets: \${tagsWithoutBooklets.join(', ')}\`);
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
    const allTags = engine.getAllTags();
    const allBooklets = engine.getAllBooklets();
    
    console.log(\`\\n🏷️  System Validation\`);
    console.log(\`===================\`);
    console.log(\`Total Tags: \${allTags.length}\`);
    console.log(\`Total Booklets: \${allBooklets.length}\`);
    
    // Check tag-booklet mapping
    const tagsWithBooklets = allTags.filter(tag => {
      const booklets = engine.getBookletsByTag(tag.name);
      return booklets.length > 0;
    });
    
    console.log(\`Tags with Booklets: \${tagsWithBooklets.length}\`);
    console.log(\`Tags without Booklets: \${allTags.length - tagsWithBooklets.length}\`);
    
    if (tagsWithBooklets.length === allTags.length) {
      console.log(\`✅ All tags have associated booklets\`);
    } else {
      console.log(\`❌ Some tags are missing booklets\`);
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
