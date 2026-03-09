'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchArticle, fetchArticleByAltId, looksLikeLegacyAltId } from '@/lib/api';

export default function LegacyShareRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!rawId) return;
      try {
        const result = looksLikeLegacyAltId(rawId)
          ? await fetchArticleByAltId(rawId)
          : await fetchArticle(rawId);

        const docId = result?.data?.documentId;
        if (!docId) throw new Error('Article not found');

        router.replace(`/article/${docId}`);
      } catch (e) {
        console.error('Legacy share redirect failed:', e);
        setError('分享链接可能已失效或内容已下线。');
      }
    };

    run();
  }, [rawId, router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl text-center bg-white rounded-lg shadow p-8 border">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">正在打开分享内容...</h1>
        {!error ? (
          <p className="text-gray-600">请稍候，正在为你跳转到最新页面。</p>
        ) : (
          <>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/share')}
              className="inline-flex items-center rounded-md bg-brand-primary px-4 py-2 text-white hover:opacity-90"
            >
              返回分享列表
            </button>
          </>
        )}
      </div>
    </main>
  );
}
