'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LegacyEvaluateResultPage() {
  const router = useRouter();
  const params = useParams();
  const legacyId = (params?.id as string) || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = legacyId ? `?legacyResultId=${encodeURIComponent(legacyId)}` : '';
      router.replace(`/assessment${q}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [router, legacyId]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl text-center bg-white rounded-lg shadow p-8 border">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">评估结果链接已迁移</h1>
        <p className="text-gray-600 mb-4">
          我们正在为你跳转到新的评估页面。登录后可在评估页自动恢复你的历史结果。
        </p>
        <button
          onClick={() => {
            const q = legacyId ? `?legacyResultId=${encodeURIComponent(legacyId)}` : '';
            router.push(`/assessment${q}`);
          }}
          className="inline-flex items-center rounded-md bg-brand-primary px-4 py-2 text-white hover:opacity-90"
        >
          立即前往评估页
        </button>
      </div>
    </main>
  );
}
