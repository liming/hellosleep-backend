'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchArticle, type Article } from '@/lib/api';

export default function ArticlePage() {
  const { t } = useTranslation();
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      if (!articleId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchArticle(articleId);
        setArticle(response.data);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-brand-text-dark mb-2">Article Not Found</h2>
            <p className="text-gray-600">{error || 'The requested article could not be found.'}</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-primary-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-brand-text-dark mb-4">
              {article.title}
            </h1>
            
            {/* Article Metadata */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
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
              {article.category && (
                <>
                  {article.sharing?.contributor && <span className="mx-2">•</span>}
                  <span className="text-gray-600">{article.category.name}</span>
                </>
              )}
              {article.originUrl && (
                <>
                  {(article.sharing?.contributor || article.category) && <span className="mx-2">•</span>}
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
            </div>

            {/* Article Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            {/* Rich text content will be rendered here */}
            <div className="text-gray-800 leading-relaxed">
              {/* For now, we'll display a placeholder since rich text rendering needs to be implemented */}
              <p className="text-gray-600 italic">
                Article content will be displayed here. Rich text rendering for Lexical JSON format needs to be implemented.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Article ID: {article.id} | Type: {article.type}
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-brand-primary text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            ← Back to Articles
          </button>
        </div>
      </div>
    </div>
  );
} 