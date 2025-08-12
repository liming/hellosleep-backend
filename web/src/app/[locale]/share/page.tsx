'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchSharedArticles, type Article } from '@/lib/api';

export default function SharePage() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchSharedArticles();
        setArticles(response.data);
      } catch (err) {
        console.error('Failed to load shared articles:', err);
        setError('Failed to load shared articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shared articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-brand-text-dark mb-2">Error Loading Articles</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-text-dark sm:text-5xl">
            {t('experienceSharingTitle')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('experienceSharingDesc')}
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <a 
                    href={`/article/${article.documentId}`}
                    className="block hover:no-underline"
                  >
                    <h3 className="text-lg font-semibold text-brand-text-dark mb-2 hover:text-brand-primary transition-colors">
                      {article.title}
                    </h3>
                  </a>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    {article.sharing?.contributor && (
                      <>
                        <span>{t('byAuthor')} </span>
                        {article.sharing.userLink ? (
                          <a
                            href={article.sharing.userLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary hover:text-primary-600 font-medium"
                          >
                            {article.sharing.contributor}
                          </a>
                        ) : (
                          <span className="font-medium">{article.sharing.contributor}</span>
                        )}
                      </>
                    )}
                    {article.originUrl && article.sharing?.contributor && (
                      <>
                        <span className="mx-2">•</span>
                        <a
                          href={article.originUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-primary hover:text-primary-600"
                        >
                          Original Source
                        </a>
                      </>
                    )}
                    {article.originUrl && !article.sharing?.contributor && (
                      <a
                        href={article.originUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:text-primary-600"
                      >
                        Original Source
                      </a>
                    )}
                  </div>
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No shared articles available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 