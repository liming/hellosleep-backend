'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { createLocalizedPathname } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t, locale, changeLanguage } = useTranslation();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createLocalizedLink = (path: string) => {
    return createLocalizedPathname(locale, path);
  };

  return (
    <>
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={80}
                height={80}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href={createLocalizedLink('/tutorial')}
              className="text-gray-700 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('knowledgeBase')}
            </Link>
            <Link
              href={createLocalizedLink('/share')}
              className="text-gray-700 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('experienceSharing')}
            </Link>
            <Link
              href={createLocalizedLink('/blog')}
              className="text-gray-700 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('blog')}
            </Link>
            <Link
              href={createLocalizedLink('/assessment')}
              className="text-gray-700 hover:text-brand-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('sleepAssessment')}
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeLanguage('zh')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  locale === 'zh'
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:text-brand-primary'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  locale === 'en'
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-600 hover:text-brand-primary'
                }`}
              >
                EN
              </button>
            </div>

            {/* User Menu */}
            {!isLoading && (
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setShowUserMenu((v) => !v)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[80px] truncate">{user.username}</span>
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          退出登录
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    登录
                  </button>
                )}
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-brand-primary focus:outline-none focus:text-brand-primary"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile: User row */}
        {!isLoading && (
          <div className="md:hidden flex justify-end pb-1">
            {user ? (
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="text-sm text-red-600 px-3 py-1"
              >
                {user.username} · 退出登录
              </button>
            ) : (
              <button
                onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }}
                className="text-sm text-blue-600 font-medium px-3 py-1"
              >
                登录 / 注册
              </button>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href={createLocalizedLink('/tutorial')}
                className="text-gray-700 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('knowledgeBase')}
              </Link>
              <Link
                href={createLocalizedLink('/share')}
                className="text-gray-700 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('experienceSharing')}
              </Link>
              <Link
                href={createLocalizedLink('/blog')}
                className="text-gray-700 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('blog')}
              </Link>
              <Link
                href={createLocalizedLink('/assessment')}
                className="text-gray-700 hover:text-brand-primary block px-3 py-2 rounded-md text-base font-medium"
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
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      locale === 'zh'
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-600 hover:text-brand-primary'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      locale === 'en'
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-600 hover:text-brand-primary'
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

    {showAuthModal && (
      <AuthModal onClose={() => setShowAuthModal(false)} />
    )}
    </>
  );
} 