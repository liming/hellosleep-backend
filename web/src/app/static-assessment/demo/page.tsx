'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaticAssessmentDemoPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/zh/assessment');
  }, [router]);
  return null;
}
