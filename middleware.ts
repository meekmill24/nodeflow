import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Reversible payment hold: enable by setting PAYMENT_HOLD_ENABLED=true
  // in the deployment environment. API routes and non-page requests continue
  // to work, so existing messages and stored data are not modified.
  const paymentHoldEnabled = process.env.PAYMENT_HOLD_ENABLED === 'true'
  const pathname = request.nextUrl.pathname
  const isApiRequest = pathname === '/api' || pathname.startsWith('/api/')
  const isPageRequest = request.method === 'GET' || request.method === 'HEAD'
  const acceptsHtml = request.headers.get('accept')?.includes('text/html') ?? false

  if (paymentHoldEnabled && !isApiRequest && isPageRequest && acceptsHtml) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
