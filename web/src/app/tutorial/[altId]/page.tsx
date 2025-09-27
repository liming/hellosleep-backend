'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';

interface TutorialRedirectPageProps {
  params: {
    altId: string;
  };
}

export default function TutorialRedirectPage({ params }: TutorialRedirectPageProps) {
  const router = useRouter();
  const { altId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleByAltId = async () => {
      try {
        // Query articles via our API proxy
        const response = await fetch(
          `/api/articles?filters%5BaltId%5D%5B%24eq%5D=${altId}`
        );

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const article = data.data[0];
          const documentId = article.documentId;
          
          if (documentId) {
            // Redirect to the new article URL
            const newUrl = `/article/${documentId}`;
            console.log(`Redirecting from /tutorial/${altId} to ${newUrl}`);
            router.replace(newUrl);
            return;
          }
        }
        
        // If no article found, show 404
        console.warn(`No article found for altId: ${altId}`);
        setError('Article not found');
        setIsLoading(false);
        
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
        setIsLoading(false);
      }
    };

    fetchArticleByAltId();
  }, [altId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">文章未找到</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while fetching
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在重定向到文章...</p>
      </div>
    </div>
  );
}
