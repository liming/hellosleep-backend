'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function ArticlesPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('articlesTitle')}
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            {t('articlesSubtitle')}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder for articles */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('comingSoon')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('articlesPlaceholder')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 