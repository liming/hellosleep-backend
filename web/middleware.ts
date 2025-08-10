import { NextRequest, NextResponse } from 'next/server';

const locales = ['en'];
const defaultLocale = 'zh';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If the pathname doesn't have a locale prefix, redirect to the default locale
  if (!pathnameHasLocale && pathname !== '/') {
    const newPathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // Remove /zh prefix for Chinese pages (default locale)
  if (pathname.startsWith('/zh/') || pathname === '/zh') {
    const newPathname = pathname.replace(/^\/zh/, '') || '/';
    return NextResponse.redirect(new URL(newPathname, request.url));
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}; 