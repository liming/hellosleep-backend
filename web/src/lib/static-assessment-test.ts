import { staticAssessmentEngine } from './static-assessment-engine';

// Test data scenarios
const testScenarios = [
  {
    name: '孕期用户 - 睡眠效率低',
    answers: {
      status: 'prenatal',
      sleepregular: 'no',
      hourstosleep: '8',
      hourstofallinsleep: '5',
      sport: 'little',
      sunshine: 'little',
      pressure: 'best',
      lively: 'normal',
      bedroom: 'yes',
      bed: 'yes'
    } as Record<string, string>
  },
  {
    name: '学生用户 - 假期综合症',
    answers: {
      status: 'study',
      sleepregular: 'no',
      hourstosleep: '9',
      hourstofallinsleep: '6',
      sport: 'none',
      sunshine: 'none',
      pressure: 'little',
      lively: 'none',
      bedroom: 'yes',
      bed: 'yes',
      holiday: 'yes',
      bedtimeearly: 'yes'
    } as Record<string, string>
  },
  {
    name: '工作用户 - 压力大且不健康',
    answers: {
      status: 'work',
      sleepregular: 'yes',
      sleeptime: '23:00',
      getuptime: '07:00',
      hourstofallinsleep: '6',
      sport: 'none',
      sunshine: 'none',
      pressure: 'best',
      lively: 'little',
      bedroom: 'no',
      bed: 'no',
      shiftwork: 'no'
    } as Record<string, string>
  },
  {
    name: '产后用户 - 放弃努力',
    answers: {
      status: 'postnatal',
      sleepregular: 'no',
      hourstosleep: '10',
      hourstofallinsleep: '4',
      sport: 'none',
      sunshine: 'none',
      pressure: 'best',
      lively: 'none',
      bedroom: 'yes',
      bed: 'yes',
      irresponsible: 'yes',
      inactive: 'yes',
      excessive_rest: 'yes',
      complain: 'yes',
      ignore: 'yes',
      medicine: 'yes'
    } as Record<string, string>
  },
  {
    name: '噪音问题用户',
    answers: {
      status: 'work',
      sleepregular: 'yes',
      sleeptime: '22:00',
      getuptime: '06:00',
      hourstofallinsleep: '7',
      sport: 'normal',
      sunshine: 'normal',
      pressure: 'normal',
      lively: 'normal',
      bedroom: 'no',
      bed: 'no',
      noise: 'no',
      noisereason: 'neighbour'
    } as Record<string, string>
  }
];

export function runStaticAssessmentTests() {
  console.log('🧪 开始静态评估引擎测试...\n');

  let totalTests = 0;
  let passedTests = 0;

  testScenarios.forEach((scenario, index) => {
    console.log(`📋 测试场景 ${index + 1}: ${scenario.name}`);
    console.log('📝 输入答案:', JSON.stringify(scenario.answers, null, 2));

    try {
      // Process assessment
      const result = staticAssessmentEngine.processAssessment(scenario.answers);
      
      console.log('🏷️  计算的问题:', result.calculatedIssues);
      console.log('🧾 建议数量:', result.bookletFacts.length);
      
      if (result.bookletFacts.length > 0) {
        console.log('📝 建议列表:');
        result.bookletFacts.forEach((fact, i) => {
          console.log(`  ${i + 1}. ${fact.description} (问题: ${fact.issue})`);
        });
      } else {
        console.log('⚠️  没有建议');
      }

      // Validate result
      const validation = staticAssessmentEngine.validateAnswers(scenario.answers);
      console.log('✅ 答案验证:', validation.isValid ? '通过' : '失败');
      
      if (!validation.isValid) {
        console.log('❌ 缺失的问题:', validation.missingQuestions);
      }

      const progress = staticAssessmentEngine.getProgressPercentage(scenario.answers);
      console.log('📊 完成进度:', `${progress}%`);

      totalTests++;
      if (result.calculatedIssues.length > 0 || result.bookletFacts.length > 0) {
        passedTests++;
        console.log('✅ 测试通过\n');
      } else {
        console.log('❌ 测试失败 - 没有生成标签或建议\n');
      }

    } catch (error) {
      console.error('❌ 测试错误:', error);
      console.log('');
    }
  });

  // Summary
  console.log('📊 测试总结:');
  console.log(`总测试数: ${totalTests}`);
  console.log(`通过测试: ${passedTests}`);
  console.log(`失败测试: ${totalTests - passedTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  // Test specific functions
  console.log('\n🔧 测试特定功能...');
  
  // Test issue retrieval
  const allIssues = staticAssessmentEngine.getAllIssues();
  console.log(`📋 总问题数: ${allIssues.length}`);
  
  return {
    totalTests,
    passedTests,
    successRate: (passedTests / totalTests) * 100,
    totalIssues: allIssues.length,
  };
}

// Export for use in browser console or other contexts
if (typeof window !== 'undefined') {
  (window as any).runStaticAssessmentTests = runStaticAssessmentTests;
}

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 开发环境自动运行测试...');
  runStaticAssessmentTests();
}
