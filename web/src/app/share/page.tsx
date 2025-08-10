'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShareRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Chinese version (default locale)
    router.replace('/zh/share');
  }, [router]);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to share...</p>
        </div>
      </div>
    </div>
  );
} 