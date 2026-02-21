'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const { t } = useTranslation();

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
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(`assessmentStep${step}Title`)}
                </h3>
                <p className="text-gray-600 text-sm">{t(`assessmentStep${step}Desc`)}</p>
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
        </div>
      </div>
    </div>
  );
}
