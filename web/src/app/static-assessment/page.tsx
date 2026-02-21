'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaticAssessmentPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/zh/assessment');
  }, [router]);
  return null;
}
