import { NextRequest, NextResponse } from 'next/server';

const locales = ['en'];
const defaultLocale = 'zh';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Only redirect to default locale if the path doesn't exist at root level
  // This allows /tutorial, /share, etc. to work directly
  if (!pathnameHasLocale && pathname !== '/') {
    // Check if this is a known route that should work without locale
    const knownRoutes = ['/tutorial', '/share', '/help', '/blog', '/assessment', '/about'];
    const knownRoutePrefixes = ['/tutorial/', '/article/', '/assessment/'];
    
    if (knownRoutes.includes(pathname) || knownRoutePrefixes.some(prefix => pathname.startsWith(prefix))) {
      // Let the route work as-is (it will use the default locale internally)
      return NextResponse.next();
    }
    
    // For other routes, redirect to default locale
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