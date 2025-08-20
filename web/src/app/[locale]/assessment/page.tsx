'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { assessmentEngine } from '@/lib/assessment-engine';
import { enhancedAssessmentEngine } from '@/lib/enhanced-assessment-engine';
import { getAllSectionsOrdered } from '@/data/assessment-questions';
import type { AssessmentQuestion } from '@/data/assessment-questions';
import type { EnhancedAssessmentResult } from '@/lib/enhanced-assessment-engine';

export default function AssessmentPage() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'questions' | 'results'>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState<AssessmentQuestion[]>([]);
  const [sections] = useState(getAllSectionsOrdered());
  const [assessmentResult, setAssessmentResult] = useState<EnhancedAssessmentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  // Test data scenarios for quick assessment testing
  const testScenarios = {
    // Scenario 1: Moderate sleep issues (most common)
    moderate: {
      name: '测试用户A',
      email: 'test@example.com',
      birthday: '1990-01-01',
      gender: 'male',
      status: 'work',
      howlong: 'midterm',
      getupregular: 'no',
      hourstosleep: '8',
      hourstofallinsleep: '6',
      hourstonoonnap: '0.5',
      noise: 'no',
      noisereason: 'neighbour',
      sport: 'little',
      sunshine: 'little',
      pressure: 'best',
      lively: 'normal',
      bedroom: 'yes',
      bed: 'yes',
      distraction: 'yes',
      effeciency: 'yes',
      unsociable: 'no',
      irresponsible: 'no',
      inactive: 'no',
      excessive_rest: 'no',
      complain: 'no',
      ignore: 'no',
      medicine: 'no'
    },
    
    // Scenario 2: Severe sleep issues
    severe: {
      name: '测试用户B',
      email: 'test@example.com',
      birthday: '1985-06-15',
      gender: 'female',
      status: 'work',
      howlong: 'longterm',
      getupregular: 'no',
      hourstosleep: '10',
      hourstofallinsleep: '4',
      hourstonoonnap: '2',
      noise: 'no',
      noisereason: 'snore',
      sport: 'none',
      sunshine: 'none',
      pressure: 'best',
      lively: 'little',
      bedroom: 'yes',
      bed: 'yes',
      distraction: 'yes',
      effeciency: 'yes',
      unsociable: 'yes',
      irresponsible: 'yes',
      inactive: 'yes',
      excessive_rest: 'yes',
      complain: 'yes',
      ignore: 'yes',
      medicine: 'yes'
    },
    
    // Scenario 3: Good sleep habits
    good: {
      name: '测试用户C',
      email: 'test@example.com',
      birthday: '1995-12-20',
      gender: 'male',
      status: 'work',
      howlong: 'shortterm',
      getupregular: 'yes',
      hourstosleep: '7',
      hourstofallinsleep: '7',
      hourstonoonnap: '0',
      noise: 'yes',
      sport: 'best',
      sunshine: 'best',
      pressure: 'normal',
      lively: 'best',
      bedroom: 'no',
      bed: 'no',
      distraction: 'no',
      effeciency: 'no',
      unsociable: 'no',
      irresponsible: 'no',
      inactive: 'no',
      excessive_rest: 'no',
      complain: 'no',
      ignore: 'no',
      medicine: 'no'
    }
  };

  const testAnswers = testScenarios.moderate; // Default test scenario

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

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Assessment complete - use AI-powered assessment
      setIsProcessing(true);
      try {
        const result = await enhancedAssessmentEngine.processAssessmentWithAI(answers);
        enhancedAssessmentEngine.saveEnhancedResult(result);
        setAssessmentResult(result);
        setCurrentScreen('results');
      } catch (error) {
        console.error('Assessment processing failed:', error);
        // Fallback to basic assessment
        const basicResult = assessmentEngine.processAssessment(answers);
        assessmentEngine.saveResult(basicResult);
        setCurrentScreen('results');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canProceed = currentQuestion && answers[currentQuestion.id] && !isProcessing;

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
          
          {/* Test Mode Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">开发者测试模式</p>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setIsTestMode(true);
                  setAnswers(testScenarios.moderate);
                  setCurrentScreen('questions');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
              >
                🧪 测试场景1: 中度睡眠问题
              </button>
              <button 
                onClick={() => {
                  setIsTestMode(true);
                  setAnswers(testScenarios.severe);
                  setCurrentScreen('questions');
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
              >
                🧪 测试场景2: 严重睡眠问题
              </button>
              <button 
                onClick={() => {
                  setIsTestMode(true);
                  setAnswers(testScenarios.good);
                  setCurrentScreen('questions');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
              >
                🧪 测试场景3: 良好睡眠习惯
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              使用预设数据快速测试AI评估结果
            </p>
          </div>
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
          {isProcessing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">正在生成个性化评估结果...</p>
                <p className="text-sm text-gray-500 mt-2">这可能需要几秒钟时间</p>
              </div>
            </div>
          )}
          {/* Test Mode Indicator */}
          {isTestMode && (
            <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">🧪</span>
                <span className="text-sm font-medium text-green-800">测试模式已启用</span>
                <span className="text-xs text-green-600 ml-2">(使用预设数据)</span>
              </div>
            </div>
          )}
          
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
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    处理中...
                  </div>
                ) : (
                  currentQuestionIndex === visibleQuestions.length - 1 ? '查看结果' : '下一题'
                )}
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

  const renderResultsScreen = () => {
    if (!assessmentResult) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在生成个性化评估结果...</p>
          </div>
        </div>
      );
    }

    const { personalizedSummary, aiRecommendations, insights, recommendationSource, confidence } = assessmentResult;
    // Focus on root causes, not scores
    const urgencyLevel = personalizedSummary.urgency;

    return (
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
            {/* AI Source Indicator */}
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {recommendationSource === 'cache' && '🎯 智能缓存推荐'}
              {recommendationSource === 'ai' && '🤖 AI 生成推荐'}
              {recommendationSource === 'fallback' && '📋 基础推荐'}
              <span className="ml-2">({Math.round(confidence * 100)}% 置信度)</span>
            </div>
            
            {/* Test Mode Indicator */}
            {isTestMode && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🧪 测试模式 - 使用预设数据
              </div>
            )}
          </div>

          {/* Assessment Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">评估完成</h2>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium mb-6 ${
                urgencyLevel === 'high' ? 'bg-red-100 text-red-800' :
                urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {urgencyLevel === 'high' ? '🔴 需要重点关注' :
                 urgencyLevel === 'medium' ? '🟡 有改善空间' :
                 '🟢 状态良好'}
              </div>
              <p className="text-lg text-gray-600">
                我们已根据您的回答分析了根本原因，并提供针对性的改善建议
              </p>
            </div>
          </div>

        {/* Primary Issues */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">主要问题</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {personalizedSummary.primaryIssues.map((issue, index) => (
              <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 text-sm">⚠️</span>
                </div>
                <span className="text-gray-700">{issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI 洞察</h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-xs">💡</span>
                  </div>
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">个性化建议</h2>
          <div className="space-y-6">
            {aiRecommendations.recommendations.map((recommendation, index) => (
              <div key={recommendation.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      recommendation.priority === 'high' ? 'bg-red-100' :
                      recommendation.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <span className={`font-bold text-sm ${
                        recommendation.priority === 'high' ? 'text-red-600' :
                        recommendation.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                          recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {recommendation.priority === 'high' ? '高优先级' :
                           recommendation.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {Math.round(recommendation.confidence * 100)}% 置信度
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{recommendation.description}</p>
                
                {recommendation.reasoning && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>为什么推荐：</strong> {recommendation.reasoning}
                    </p>
                  </div>
                )}
                
                {recommendation.actions && recommendation.actions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">具体行动：</h4>
                    {recommendation.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{action.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            action.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            action.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {action.difficulty === 'easy' ? '简单' :
                             action.difficulty === 'medium' ? '中等' : '困难'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>⏱️ {action.timeRequired}</span>
                          <span>🔄 {action.frequency}</span>
                          <span>📈 {action.expectedImpact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
                setAssessmentResult(null);
                setIsTestMode(false);
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
  };

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