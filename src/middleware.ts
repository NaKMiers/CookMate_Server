import { JWT } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import {
  EXCLUDE_ROUTES,
  REQUIRE_ADMIN_ROUTES,
  REQUIRE_AUTH_ROUTES,
  REQUIRE_UNAUTH_ROUTES,
} from './constants/routes'
import { extractToken, JWTPayload } from './lib/auth'

// Require UnAuth
const requireUnAuth = async (
  req: NextRequest,
  token: JWT | JWTPayload | null,
  isApi: boolean
) => {
  console.log('- Require UnAuth -')
  return token
    ? isApi
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/', req.url))
    : NextResponse.next()
}

// Require Auth
const requireAuth = async (
  req: NextRequest,
  token: JWT | JWTPayload | null,
  isApi: boolean
) => {
  console.log('- Require Auth -')
  return !token
    ? isApi
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/', req.url))
    : NextResponse.next()
}

// Require Admin
const requireAdmin = async (
  req: NextRequest,
  token: JWT | JWTPayload | null,
  isApi: boolean
) => {
  console.log('- Require Admin -')
  const role = token?.role
  if (role === 'admin') return NextResponse.next()

  return isApi
    ? NextResponse.json({ error: 'Unauthorized for admin' }, { status: 401 })
    : NextResponse.redirect(new URL('/', req.url))
}

async function middleware(req: NextRequest) {
  const token = await extractToken(req)
  const pathname = req.nextUrl.pathname
  const isApi = req.nextUrl.pathname.startsWith('/api')

  // exclude routes
  if (EXCLUDE_ROUTES.some(path => pathname.startsWith(path)))
    return NextResponse.next()
  // require unauth
  if (REQUIRE_UNAUTH_ROUTES.some(path => pathname.startsWith(path)))
    return requireUnAuth(req, token, isApi)
  // require admin
  else if (REQUIRE_ADMIN_ROUTES.some(path => pathname.startsWith(path)))
    return requireAdmin(req, token, isApi)
  // require auth
  else if (REQUIRE_AUTH_ROUTES.some(path => pathname.startsWith(path)))
    return requireAuth(req, token, isApi)
}

// match all routes except static files
export const config = {
  matcher: ['/admin/:path*', '/api'],
}

export default middleware
