'use client';

import React, { useState } from 'react';
import StaticAssessmentResults from '@/components/StaticAssessmentResults';
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';

// Sample assessment questions based on the questions_issues.json structure
const sampleQuestions = [
  { id: 'status', text: '生活状态', type: 'select', options: ['work', 'study', 'unemployed', 'prenatal', 'postnatal', 'retire'] },
  { id: 'sleepregular', text: '作息时间规律吗？', type: 'radio', options: ['yes', 'no'] },
  { id: 'sleeptime', text: '通常几点睡觉？', type: 'time' },
  { id: 'getuptime', text: '通常几点起床？', type: 'time' },
  { id: 'hourstosleep', text: '晚上试图睡觉时间有多少？', type: 'number' },
  { id: 'hourstofallinsleep', text: '晚上的实际睡眠时间有多少？', type: 'number' },
  { id: 'sport', text: '你会有规律的运动吗？', type: 'radio', options: ['best', 'normal', 'little', 'none'] },
  { id: 'sunshine', text: '你是不是很少接触阳光？', type: 'radio', options: ['best', 'normal', 'little', 'none'] },
  { id: 'pressure', text: '生活很有压力吗？', type: 'radio', options: ['best', 'normal', 'little', 'none'] },
  { id: 'lively', text: '生活很丰富活跃吗？', type: 'radio', options: ['best', 'normal', 'little', 'none'] },
  { id: 'bedroom', text: '你总是长时间呆在卧室吗？', type: 'radio', options: ['yes', 'no'] },
  { id: 'bed', text: '你总是长时间呆在床上吗？', type: 'radio', options: ['yes', 'no'] },
  { id: 'irresponsible', text: '失眠后你是不是刻意减少或者放弃工作/学习？', type: 'radio', options: ['yes', 'no'] },
  { id: 'inactive', text: '失眠后你是不是减少或放弃很多社交活动或者运动？', type: 'radio', options: ['yes', 'no'] },
  { id: 'excessive_rest', text: '失眠后你是不是总是在找机会休息？', type: 'radio', options: ['yes', 'no'] },
  { id: 'complain', text: '你会不会总是抱怨或者哭诉失眠', type: 'radio', options: ['yes', 'no'] },
  { id: 'ignore', text: '失眠后你是不是很少关心亲人和朋友？', type: 'radio', options: ['yes', 'no'] },
  { id: 'medicine', text: '你是不是去看病或者服用了安眠的药物？', type: 'radio', options: ['yes', 'no'] },
  { id: 'noise', text: '你的睡眠环境安静吗？', type: 'radio', options: ['yes', 'no'] },
  { id: 'noisereason', text: '影响睡眠环境的因素是什么？', type: 'radio', options: ['snore', 'neighbour', 'roommate', 'others'] },
];

export default function StaticAssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Auto-advance to last question if all previous questions are answered
  React.useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount > 0 && answeredCount < sampleQuestions.length) {
      // Find the first unanswered question
      const firstUnansweredIndex = sampleQuestions.findIndex(q => !answers[q.id]);
      if (firstUnansweredIndex === -1) {
        // All questions are answered, go to last question
        setCurrentQuestionIndex(sampleQuestions.length - 1);
      } else {
        // Go to the first unanswered question
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
    }
  }, [answers]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Add some debugging to see what's happening
    console.log('Submitting answers:', answers);
    const result = staticAssessmentEngine.processAssessment(answers);
    console.log('Static assessment result:', result);
    console.log('Calculated issues:', result.calculatedIssues);
    console.log('Mapped facts count:', result.bookletFacts.length);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;
  const allQuestionsAnswered = Object.keys(answers).length === sampleQuestions.length;

  if (showResults) {
    return <StaticAssessmentResults answers={answers} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">静态评估引擎测试</h1>
          <p className="text-gray-600">基于规则的非AI评估系统</p>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>进度</span>
              <span>{currentQuestionIndex + 1} / {sampleQuestions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.text}
          </h2>

          {currentQuestion.type === 'select' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'radio' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'time' && (
            <input
              type="time"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {currentQuestion.type === 'number' && (
            <input
              type="number"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入数字"
            />
          )}

          {/* Show completion message when all questions are answered */}
          {allQuestionsAnswered && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    所有问题已回答完成！点击下方"查看结果"按钮查看评估结果。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">调试信息</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>

        {/* Quick Test Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Test with answers that will definitely trigger static booklets
              const testAnswers = {
                status: 'prenatal',
                sleepregular: 'no',
                hourstosleep: '8',
                hourstofallinsleep: '5',
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
              };
              setAnswers(testAnswers);
              console.log('Quick test answers loaded:', testAnswers);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            快速测试 - 加载会触发建议的答案
          </button>
        </div>
      </div>

      {/* Fixed Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            上一题
          </button>

          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {sampleQuestions.length}
            {allQuestionsAnswered && (
              <span className="ml-2 text-green-600 font-medium">✓ 已完成</span>
            )}
          </span>

          {allQuestionsAnswered ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              查看结果
            </button>
          ) : currentQuestionIndex === sampleQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看结果
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              下一题
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
