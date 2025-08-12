'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { assessmentEngine } from '@/lib/assessment-engine';
import { getAllSectionsOrdered } from '@/data/assessment-questions';
import type { AssessmentQuestion } from '@/data/assessment-questions';

export default function AssessmentPage() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'questions' | 'results'>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState<AssessmentQuestion[]>([]);
  const [sections] = useState(getAllSectionsOrdered());

  // Initialize visible questions when component mounts
  useEffect(() => {
    const questions = assessmentEngine.getVisibleQuestions(answers);
    setVisibleQuestions(questions);
  }, [answers]);

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const progressPercentage = assessmentEngine.getProgressPercentage(answers);
  const currentSection = assessmentEngine.getCurrentSection(answers);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Assessment complete
      const result = assessmentEngine.processAssessment(answers);
      assessmentEngine.saveResult(result);
      setCurrentScreen('results');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canProceed = currentQuestion && answers[currentQuestion.id];

  const renderLandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            睡眠评估
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过专业的睡眠评估，了解你的失眠状况并获得个性化建议
          </p>
        </div>

        {/* Assessment Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">回答问题</h3>
              <p className="text-gray-600 text-sm">完成一系列关于睡眠模式和生活方式的问答</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">获得分析</h3>
              <p className="text-gray-600 text-sm">获得睡眠质量和潜在问题的详细分析</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">获得建议</h3>
              <p className="text-gray-600 text-sm">获得改善睡眠的个性化建议和策略</p>
            </div>
          </div>
        </div>

        {/* Assessment Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">评估类别</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">🌙</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">睡眠质量</h3>
                <p className="text-sm text-gray-600">评估您的睡眠时长、质量和模式</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl">😴</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">睡眠问题</h3>
                <p className="text-sm text-gray-600">识别具体的睡眠问题及其频率</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 text-xl">💤</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">生活方式因素</h3>
                <p className="text-sm text-gray-600">评估影响睡眠的日常习惯</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 text-xl">🏥</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">健康与压力</h3>
                <p className="text-sm text-gray-600">评估压力水平和健康状况</p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={() => setCurrentScreen('questions')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
          >
            开始评估
          </button>
          <p className="text-sm text-gray-500 mt-4">大约需要5-10分钟</p>
        </div>
      </div>
    </div>
  );

  const renderQuestionsScreen = () => {
    if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">加载中...</h2>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>问题 {currentQuestionIndex + 1} / {visibleQuestions.length}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Category Badge */}
            {currentSection && (
              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                  {currentSection.description}
                </span>
              </div>
            )}

            {/* Question Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {currentQuestion.text}
            </h2>

            {/* Question Hint */}
            {currentQuestion.hint && (
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
              </div>
            )}

            {/* Question Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.value.toString())}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === option.value.toString()
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.text}
                  </button>
                ))
              )}

              {currentQuestion.type === 'scale' && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{currentQuestion.min} {currentQuestion.unit}</span>
                    <span>{currentQuestion.max} {currentQuestion.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    step={currentQuestion.step || 0.5}
                    value={answers[currentQuestion.id] || currentQuestion.min}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {answers[currentQuestion.id] || currentQuestion.min} {currentQuestion.unit}
                    </span>
                  </div>
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              )}

              {currentQuestion.type === 'email' && (
                <input
                  type="email"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              )}

              {currentQuestion.type === 'date' && (
                <input
                  type="date"
                  min={currentQuestion.min ? `${currentQuestion.min}-01-01` : undefined}
                  max={currentQuestion.max ? `${currentQuestion.max}-12-31` : undefined}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-lg transition-all ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                上一题
              </button>
              <button 
                onClick={handleNextQuestion}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-lg transition-all ${
                  !canProceed
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentQuestionIndex === visibleQuestions.length - 1 ? '查看结果' : '下一题'}
              </button>
            </div>
          </div>

          {/* Save Progress Note */}
          <div className="mt-6 text-center text-sm text-gray-500">
            您的进度会自动保存，您可以稍后返回继续
          </div>
        </div>
      </div>
    );
  };

  const renderResultsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            您的睡眠评估结果
          </h1>
          <p className="text-xl text-gray-600">
            基于您的回答，我们为您生成了个性化的睡眠分析
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-blue-600">6.5</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">睡眠质量评分</h2>
            <p className="text-gray-600 mb-4">中等水平 - 有改善空间</p>
            <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Sleep Quality */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600">🌙</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">睡眠质量</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">睡眠时长</span>
                <span className="font-medium">6.5小时</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">入睡时间</span>
                <span className="font-medium">30分钟</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">睡眠效率</span>
                <span className="font-medium">75%</span>
              </div>
            </div>
          </div>

          {/* Sleep Problems */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600">😴</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">睡眠问题</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">入睡困难</span>
                <span className="font-medium text-orange-600">经常</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">夜间醒来</span>
                <span className="font-medium text-green-600">偶尔</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">早醒</span>
                <span className="font-medium text-green-600">很少</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">个性化建议</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">建立规律的睡眠时间</h3>
                <p className="text-gray-600">每天在同一时间上床睡觉和起床，即使在周末也要保持这个习惯。</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">改善睡眠环境</h3>
                <p className="text-gray-600">保持卧室安静、黑暗和凉爽，温度控制在18-22°C之间。</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">减少睡前使用电子设备</h3>
                <p className="text-gray-600">睡前1小时避免使用手机、电脑等电子设备，蓝光会影响褪黑激素分泌。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg">
            保存结果
          </button>
          <div className="space-x-4">
            <button
              onClick={() => {
                setCurrentScreen('landing');
                setAnswers({});
                setCurrentQuestionIndex(0);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              重新评估
            </button>
            <button className="text-blue-600 hover:text-blue-700">
              查看详细报告
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentScreen('landing')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentScreen === 'landing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              首页
            </button>
            <button
              onClick={() => setCurrentScreen('questions')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentScreen === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              问题页面
            </button>
            <button
              onClick={() => setCurrentScreen('results')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentScreen === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              结果页面
            </button>
          </div>
        </div>
      </div>

      {/* Screen Content */}
      {currentScreen === 'landing' && renderLandingScreen()}
      {currentScreen === 'questions' && renderQuestionsScreen()}
      {currentScreen === 'results' && renderResultsScreen()}
    </div>
  );
} 