import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value
    const payload = session ? await decrypt(session) : null

    const isLoginPage = request.nextUrl.pathname.startsWith('/login')
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname === '/'

    if (isDashboard) {
        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // Redirect root to dashboard
        if (request.nextUrl.pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    if (isLoginPage) {
        if (payload) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
