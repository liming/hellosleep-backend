'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssessmentRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the localized assessment page
    router.push('/zh/assessment');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">正在跳转到睡眠评估...</p>
      </div>
    </div>
  );
} 