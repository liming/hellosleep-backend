'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';
import { getAllSectionsOrdered, getAllQuestionsOrdered, getVisibleQuestions } from '@/data/static-assessment-questions';
import type { AssessmentQuestion } from '@/data/static-assessment-questions';
import type { AssessmentResult } from '@/lib/static-assessment-engine';
import StaticAssessmentResults from '@/components/StaticAssessmentResults';

export default function AssessmentPage() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'questions' | 'results'>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState<AssessmentQuestion[]>([]);
  const [sections] = useState(getAllSectionsOrdered());
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
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

  // Load questions on component mount and update based on answers
  useEffect(() => {
    const allQuestions = getAllQuestionsOrdered();
    const visible = getVisibleQuestions(allQuestions, answers);
    setVisibleQuestions(visible);
  }, [answers]);

  // Function to handle answer selection
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Function to handle next question or submit assessment
  const handleNextQuestion = async () => {
    if (currentQuestionIndex === visibleQuestions.length - 1) {
      // This is the last question, process the assessment
      await processAssessment();
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Function to handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Function to process static assessment
  const processAssessment = async () => {
    setIsProcessing(true);
    try {
      console.log('Processing static assessment with answers:', answers);
      const result = staticAssessmentEngine.processAssessment(answers);
      console.log('Static assessment result:', result);
      setAssessmentResult(result);
      setCurrentScreen('results');
    } catch (error) {
      console.error('Error processing static assessment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const currentSection = sections.find(section => 
    section.questions.includes(currentQuestion?.id)
  );
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / visibleQuestions.length) * 100);
  const canProceed = currentQuestion && answers[currentQuestion.id] && !isProcessing;

  const renderLandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('sleepAssessmentTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('sleepAssessmentDesc')}
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            🧠 {t('assessmentSystemTitle', { defaultValue: 'Rule-Based Assessment System' })}
          </div>
        </div>

        {/* Assessment Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('assessmentStep1Title')}</h3>
              <p className="text-gray-600 text-sm">{t('assessmentStep1Desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('assessmentStep2Title')}</h3>
              <p className="text-gray-600 text-sm">{t('assessmentStep2Desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('assessmentStep3Title')}</h3>
              <p className="text-gray-600 text-sm">{t('assessmentStep3Desc')}</p>
            </div>
          </div>
        </div>



        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={() => setCurrentScreen('questions')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
          >
            {t('startAssessment')}
          </button>
          <p className="text-sm text-gray-500 mt-4">{t('assessmentTimeEstimate')}</p>
          
          {/* Test Mode Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">{t('testModeTitle')}</p>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setIsTestMode(true);
                  setAnswers(testScenarios.moderate);
                  setCurrentScreen('questions');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
              >
                🧪 {t('testScenario1')}
              </button>
              <button 
                onClick={() => {
                  setIsTestMode(true);
                  setAnswers(testScenarios.severe);
                  setCurrentScreen('questions');
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
              >
                🧪 {t('testScenario2')}
              </button>
              <button 
                onClick={() => {
                  setIsTestMode(true);
                  setAnswers(testScenarios.good);
                  setCurrentScreen('questions');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-sm"
              >
                🧪 {t('testScenario3')}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {t('testModeDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionsScreen = () => {
    if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">{t('loadingQuestions')}</p>
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
              <span>{t('questionProgress', { current: currentQuestionIndex + 1, total: visibleQuestions.length })}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Category Badge */}
            {currentSection && (
              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
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
                        ? 'border-green-500 bg-green-50 text-green-700'
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
                    <span className="text-lg font-semibold text-green-600">
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
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              )}

              {currentQuestion.type === 'email' && (
                <input
                  type="email"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
              )}

              {currentQuestion.type === 'date' && (
                <input
                  type="date"
                  min={currentQuestion.min ? `${currentQuestion.min}-01-01` : undefined}
                  max={currentQuestion.max ? `${currentQuestion.max}-12-31` : undefined}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
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
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('processingAssessment')}
                  </div>
                ) : (
                  currentQuestionIndex === visibleQuestions.length - 1 ? t('viewResults') : t('nextQuestion')
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('processingAssessment')}</p>
          </div>
        </div>
      );
    }

    return <StaticAssessmentResults answers={answers} onBack={() => setCurrentScreen('landing')} />;
  };

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentScreen('landing')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentScreen === 'landing'
                    ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              首页
            </button>
            <button
              onClick={() => setCurrentScreen('questions')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentScreen === 'questions'
                    ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              问题页面
            </button>
            <button
              onClick={() => setCurrentScreen('results')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentScreen === 'results'
                    ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              结果页面
            </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">规则评估</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  基于科学规则
                </span>
              </div>
              {isTestMode && (
                <div className="text-sm text-gray-500">
                  测试模式 - 使用预设数据
                </div>
              )}
            </div>
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