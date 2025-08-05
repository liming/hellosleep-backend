'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { createLocalizedPathname } from '@/lib/i18n';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, locale, changeLanguage } = useTranslation();

  const createLocalizedLink = (path: string) => {
    return createLocalizedPathname(locale, path);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">{t('brand')}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href={createLocalizedLink('/tutorial')}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('knowledgeBase')}
            </Link>
            <Link 
              href={createLocalizedLink('/share')}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('experienceSharing')}
            </Link>
            <Link 
              href={createLocalizedLink('/blog')}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('blog')}
            </Link>
            <Link 
              href={createLocalizedLink('/assessment')}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('sleepAssessment')}
            </Link>
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeLanguage('zh')}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  locale === 'zh' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  locale === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                EN
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href={createLocalizedLink('/tutorial')}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('knowledgeBase')}
              </Link>
              <Link 
                href={createLocalizedLink('/share')}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('experienceSharing')}
              </Link>
              <Link 
                href={createLocalizedLink('/blog')}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('blog')}
              </Link>
              <Link 
                href={createLocalizedLink('/assessment')}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('sleepAssessment')}
              </Link>
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      changeLanguage('zh');
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      locale === 'zh' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      locale === 'en' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 