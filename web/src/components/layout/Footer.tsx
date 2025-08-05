'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
} 