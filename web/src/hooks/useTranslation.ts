'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getTranslation, formatTranslation, type Locale, type TranslationKey } from '@/lib/translations';
import { getLocaleFromPathname, createLocalizedPathname } from '@/lib/i18n';

export function useTranslation() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = getLocaleFromPathname(pathname);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    if (params) {
      return formatTranslation(locale, key, params);
    }
    return getTranslation(locale, key);
  };

  const changeLanguage = (newLocale: Locale) => {
    const newPathname = createLocalizedPathname(newLocale, pathname);
    router.push(newPathname);
  };

  return {
    t,
    locale,
    changeLanguage,
  };
} 