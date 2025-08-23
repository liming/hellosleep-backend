'use client';

import React, { useState, useEffect } from 'react';
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';
import { runStaticAssessmentTests } from '@/lib/static-assessment-test';
import StaticAssessmentResults from '@/components/StaticAssessmentResults';

export default function StaticAssessmentDemoPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [demoAnswers, setDemoAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'demo' | 'test' | 'api'>('demo');

  // Pre-defined demo scenarios
  const demoScenarios: Array<{
    name: string;
    description: string;
    answers: Record<string, string>;
  }> = [
    {
      name: '孕期用户',
      description: '睡眠效率低，需要特殊关注',
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
      }
    },
    {
      name: '学生用户',
      description: '假期综合症，作息不规律',
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
      }
    },
    {
      name: '工作用户',
      description: '压力大，生活方式不健康',
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
      }
    }
  ];

  const runTests = async () => {
    const results = runStaticAssessmentTests();
    setTestResults(results);
  };

  const loadDemoScenario = (scenario: { name: string; description: string; answers: Record<string, string> }) => {
    setDemoAnswers(scenario.answers);
  };

  const testAPI = async () => {
    try {
      const response = await fetch('/api/static-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: demoAnswers }),
      });
      
      const result = await response.json();
      console.log('API Response:', result);
      alert(`API测试成功！\n标签数: ${result.data.calculatedTags.length}\n手册数: ${result.data.matchedBooklets.length}`);
    } catch (error) {
      console.error('API Test Error:', error);
      alert('API测试失败，请查看控制台');
    }
  };

  const testStaticEngine = () => {
    // Test with a specific scenario that should trigger tags
    const testAnswers = {
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
    };
    
    const result = staticAssessmentEngine.processAssessment(testAnswers);
    console.log('Static Engine Test Result:', result);
    alert(`静态引擎测试结果:\n标签: ${result.calculatedTags.join(', ')}\n手册数: ${result.matchedBooklets.length}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">静态评估引擎演示</h1>
          <p className="text-gray-600">展示静态评估引擎的功能和集成方式</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('demo')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'demo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                演示场景
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'test'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                测试结果
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'api'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                API 测试
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'demo' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">演示场景</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {demoScenarios.map((scenario, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{scenario.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      <button
                        onClick={() => loadDemoScenario(scenario)}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        加载场景
                      </button>
                    </div>
                  ))}
                </div>

                {Object.keys(demoAnswers).length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">当前答案</h3>
                      <button
                        onClick={() => setShowResults(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        查看结果
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-800 overflow-auto">
                        {JSON.stringify(demoAnswers, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'test' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">测试结果</h2>
                <button
                  onClick={runTests}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-4"
                >
                  运行测试
                </button>

                {testResults && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">测试统计</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{testResults.totalTests}</div>
                        <div className="text-sm text-gray-600">总测试数</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{testResults.passedTests}</div>
                        <div className="text-sm text-gray-600">通过测试</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{testResults.successRate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">成功率</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{testResults.totalBooklets}</div>
                        <div className="text-sm text-gray-600">总手册数</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">引擎信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">标签统计</h4>
                      <div className="text-2xl font-bold text-blue-600">
                        {staticAssessmentEngine.getAllTags().length}
                      </div>
                      <div className="text-sm text-gray-600">可用标签</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">手册统计</h4>
                      <div className="text-2xl font-bold text-green-600">
                        {staticAssessmentEngine.getAllBooklets().length}
                      </div>
                      <div className="text-sm text-gray-600">可用手册</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">API 测试</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">API 端点</h3>
                    <code className="text-sm text-blue-800">POST /api/static-assessment</code>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">请求格式</h3>
                    <pre className="text-sm text-green-800">
{`{
  "answers": {
    "status": "work",
    "sleepregular": "no",
    // ... 更多答案
  }
}`}
                    </pre>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-medium text-purple-900 mb-2">响应格式</h3>
                    <pre className="text-sm text-purple-800">
{`{
  "success": true,
  "data": {
    "calculatedTags": ["tag1", "tag2"],
    "matchedBooklets": [...],
    "completedAt": "2024-01-01T00:00:00.000Z",
    "summary": {
      "totalAnswers": 10,
      "totalTags": 2,
      "totalBooklets": 3
    }
  }
}`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={testAPI}
                      disabled={Object.keys(demoAnswers).length === 0}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      测试 API
                    </button>
                    <button
                      onClick={testStaticEngine}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      测试静态引擎
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">评估结果</h2>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <StaticAssessmentResults 
              answers={demoAnswers} 
              onBack={() => setShowResults(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
