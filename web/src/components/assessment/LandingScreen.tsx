'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('sleepAssessmentTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('sleepAssessmentDesc')}
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {t('assessmentSystemTitle', { defaultValue: 'Rule-Based Assessment System' })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            {(
              [
                ['assessmentStep1Title', 'assessmentStep1Desc'],
                ['assessmentStep2Title', 'assessmentStep2Desc'],
                ['assessmentStep3Title', 'assessmentStep3Desc'],
              ] as const
            ).map(([titleKey, descKey], i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(titleKey)}
                </h3>
                <p className="text-gray-600 text-sm">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
          >
            {t('startAssessment')}
          </button>
          <p className="text-sm text-gray-500 mt-4">{t('assessmentTimeEstimate')}</p>
          {!isLoading && !user && (
            <p className="text-sm text-blue-600 mt-2">
              需要登录后才能开始评估，点击上方按钮将弹出登录界面
            </p>
          )}
          {!isLoading && user && (
            <p className="text-sm text-green-600 mt-2">
              已登录为 <strong>{user.username}</strong>，评估结果将自动保存
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
