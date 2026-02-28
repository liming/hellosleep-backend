'use client';

import { useTranslation } from '@/hooks/useTranslation';
import type { Question } from '@/lib/assessment';

interface QuestionScreenProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isProcessing?: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  basic_info: '基本信息',
  sleep_habits: '睡眠习惯',
  lifestyle: '生活状态',
  environment: '睡眠环境',
  work_study: '工作和学习',
  attitude: '对待失眠的方式',
};

function buildHalfHourOptions() {
  const options: Array<{ value: string; label: string }> = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 30]) {
      const hh = String(hour).padStart(2, '0');
      const mm = String(minute).padStart(2, '0');
      options.push({ value: `${hh}:${mm}`, label: `${hh}:${mm}` });
    }
  }

  return options;
}

const HALF_HOUR_OPTIONS = buildHalfHourOptions();

export default function QuestionScreen({
  questions,
  currentIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
  isProcessing,
}: QuestionScreenProps) {
  const { t } = useTranslation();
  const question = questions[currentIndex];
  const progress = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;
  const canProceed = question && answers[question.id] !== undefined && answers[question.id] !== '' && !isProcessing;
  const isLast = currentIndex === questions.length - 1;

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">{t('loadingQuestions')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('questionProgress', { current: currentIndex + 1, total: questions.length })}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {SECTION_LABELS[question.category] && (
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                {SECTION_LABELS[question.category]}
              </span>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-8">{question.text}</h2>

          {question.hint && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{question.hint}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {question.type === 'single_choice' && question.options && (
              question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onAnswer(question.id, option.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[question.id] === option.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-900'
                  }`}
                >
                  {option.text}
                </button>
              ))
            )}

            {(question.type === 'scale' || question.type === 'number') &&
              question.min !== undefined &&
              question.max !== undefined && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{question.min} {question.unit}</span>
                    <span>{question.max} {question.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    step={question.step ?? 0.5}
                    value={answers[question.id] ?? question.min}
                    onChange={(e) => onAnswer(question.id, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-3 justify-center">
                    <span className="text-lg font-semibold text-green-600">
                      {answers[question.id] ?? question.min} {question.unit}
                    </span>
                    <input
                      type="number"
                      min={question.min}
                      max={question.max}
                      step={question.step ?? 0.5}
                      value={answers[question.id] ?? question.min}
                      onChange={(e) => onAnswer(question.id, e.target.value)}
                      className="w-24 p-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

            {question.type === 'time' && (
              <div className="space-y-2">
                <select
                  value={answers[question.id] ?? ''}
                  onChange={(e) => onAnswer(question.id, e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-900"
                >
                  <option value="" disabled>
                    请选择时间（每 30 分钟一档）
                  </option>
                  {HALF_HOUR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  为了更便于选择，时间已简化为每 30 分钟一档。
                </p>
              </div>
            )}

            {question.type === 'text' && (
              <input
                type="text"
                value={answers[question.id] ?? ''}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            )}

            {question.type === 'email' && (
              <input
                type="email"
                value={answers[question.id] ?? ''}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            )}

            {question.type === 'date' && (
              <input
                type="date"
                value={answers[question.id] ?? ''}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-lg transition-all ${
                currentIndex === 0
                  ? 'text-gray-400 border border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              上一题
            </button>
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`px-6 py-3 rounded-lg transition-all ${
                !canProceed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('processingAssessment')}
                </span>
              ) : isLast ? t('viewResults') : t('nextQuestion')}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          您的进度会自动保存，您可以稍后返回继续
        </div>
      </div>
    </div>
  );
}
