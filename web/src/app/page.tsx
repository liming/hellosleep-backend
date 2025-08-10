'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-hero">
        <div className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl tracking-tight font-extrabold text-brand-text-dark sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="block text-brand-primary xl:inline">帮助</span>
                  <span className="block xl:inline">失眠的您走出失眠</span>
                </h1>
                <p className="mt-4 text-base text-gray-600 sm:mt-6 sm:text-lg lg:text-xl">
                  {t('heroSubtitle')}
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/help"
                    className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white hover:bg-primary-700 transition-colors"
                    style={{ backgroundColor: '#d35400' }}
                  >
                    {t('helpGuide')}
                  </Link>
                  <Link
                    href="/assessment"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-brand-text-dark hover:bg-gray-50 transition-colors"
                  >
                    {t('startAssessment')}
                  </Link>
                </div>
              </div>

              {/* Right Column - Ferry Image and Text */}
              <div className="flex flex-col items-center lg:items-end">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56">
                  <Image
                    src="/images/ferry.png"
                    alt={t('ferryMetaphor')}
                    fill
                    className="object-contain ferry-animation"
                    priority
                  />
                </div>
                <p className="mt-4 text-center lg:text-right text-lg text-gray-600 italic">
                  {t('ferryMetaphor')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-16 bg-gradient-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-brand-text-dark sm:text-4xl">
              {t('philosophyTitle')}
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {t('philosophySubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Knowledge Base */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-200 mb-4">
                <svg className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-text-dark mb-2">
                {t('knowledgeBaseTitle')}
              </h3>
              <p className="text-gray-600">
                {t('knowledgeBaseDesc')}
              </p>
            </div>

            {/* Experience Sharing */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-200 mb-4">
                <svg className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-text-dark mb-2">
                {t('experienceSharingTitle')}
              </h3>
              <p className="text-gray-600">
                {t('experienceSharingDesc')}
              </p>
            </div>

            {/* Community Support */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-200 mb-4">
                <svg className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-text-dark mb-2">
                {t('communitySupportTitle')}
              </h3>
              <p className="text-gray-600">
                {t('communitySupportDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Articles Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-brand-text-dark sm:text-4xl">
              {t('latestArticlesTitle')}
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {t('latestArticlesSubtitle')}
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/tutorial"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-brand-text-dark bg-brand-background hover:bg-primary-200 transition-colors"
            >
              {t('viewMoreArticles')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 