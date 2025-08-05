export const locales = ['en'] as const;
export const defaultLocale = 'zh' as const;

export type Locale = typeof locales[number] | typeof defaultLocale;

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;

  if (locale === 'en') {
    return 'en';
  }

  return defaultLocale;
}

export function createLocalizedPathname(locale: Locale, pathname: string): string {
  const segments = pathname.split('/');

  // Remove existing locale if present
  if (segments[1] === 'en') {
    segments.splice(1, 1);
  }

  // Add new locale only for English
  if (locale === 'en') {
    segments.splice(1, 0, locale);
  }

  return segments.join('/');
} 