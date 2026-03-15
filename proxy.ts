import { NextRequest, NextResponse } from 'next/server';

const LOCALES = new Set(['th', 'en']);

function withLeadingSlash(pathname: string): string {
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];

  if (maybeLocale && LOCALES.has(maybeLocale)) {
    const rest = segments.slice(1).join('/');
    const targetPath = withLeadingSlash(rest);
    const targetUrl = new URL(targetPath, request.url);

    targetUrl.search = request.nextUrl.search;

    const response = NextResponse.redirect(targetUrl);
    response.cookies.set('NEXT_LOCALE', maybeLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
