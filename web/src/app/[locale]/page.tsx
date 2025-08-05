'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">{t('heroTitle')}</span>
                  <span className="block text-blue-600 xl:inline"></span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {t('heroSubtitle')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/help"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      {t('helpGuide')}
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/assessment"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      {t('startAssessment')}
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Ferry Image */}
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
            <div className="text-center ferry-animation">
              <div className="relative w-64 h-64 mb-4">
                <Image
                  src="/images/ferry.png"
                  alt={t('ferryMetaphor')}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-gray-600 text-lg">{t('ferryMetaphor')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('philosophyTitle')}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              {t('philosophySubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('knowledgeBaseTitle')}</h3>
              <p className="text-gray-600">
                {t('knowledgeBaseDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('experienceSharingTitle')}</h3>
              <p className="text-gray-600">
                {t('experienceSharingDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('communitySupportTitle')}</h3>
              <p className="text-gray-600">
                {t('communitySupportDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Articles Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('latestArticlesTitle')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('latestArticlesSubtitle')}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  我已经好了，好的很彻底
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  现在的我对于偶尔一次的失眠可以坦然到"啊😄失眠了哈哈😄"一点焦虑感也没有了
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>忘记漂泊的云</span>
                  <span className="mx-2">•</span>
                  <span>2022-10-03</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  用积极的生活方式对待失眠
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  不断失眠不断执行睡吧理念，相信以后面对失眠的时候我照样可以做到
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>枯</span>
                  <span className="mx-2">•</span>
                  <span>2022-10-01</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  失眠，黑夜里的极光
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  你要去战胜它，不要被黑夜所左右，而要做黑夜里的极光
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>不晓今生梦一场</span>
                  <span className="mx-2">•</span>
                  <span>2022-10-01</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/articles"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              {t('viewMoreArticles')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 