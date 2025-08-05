import { NextRequest, NextResponse } from 'next/server';

const locales = ['en'];
const defaultLocale = 'zh';

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Only redirect if there is a locale prefix and it's not English
  // Chinese (default) pages should be accessible without prefix
  if (pathname.startsWith('/zh/') || pathname === '/zh') {
    // Redirect /zh/* to /* (remove zh prefix for Chinese pages)
    const newPathname = pathname.replace(/^\/zh/, '') || '/';
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // For English pages, keep the /en prefix
  // No redirect needed for English pages
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}; 