import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('auth-token');
    const { pathname } = req.nextUrl;

    if (!token && pathname !== '/login' && pathname !== '/register') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|favicon.ico).*)'],
};
