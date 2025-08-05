'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('aboutTitle')}
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            {t('aboutSubtitle')}
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('ourMission')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('missionDesc')}
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('whatWeOffer')}
            </h2>
            <ul className="text-gray-600 mb-6 space-y-2">
              <li>• {t('scienceBasedArticles')}</li>
              <li>• {t('comprehensiveAssessment')}</li>
              <li>• {t('personalizedRecommendations')}</li>
              <li>• {t('expertInsights')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('ourApproach')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('approachDesc')}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t('getStarted')}
              </h3>
              <p className="text-blue-800">
                {t('getStartedDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 