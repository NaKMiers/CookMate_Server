import { JWT } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import {
  REQUIRE_ADMIN_ROUTES,
  REQUIRE_AUTH_ROUTES,
  REQUIRE_UNAUTH_ROUTES,
} from './constants/routes'
import { extractToken, JWTPayload } from './lib/auth'

export default async function middleware(req: NextRequest) {
  const token = await extractToken(req)
  const pathname = req.nextUrl.pathname
  const isApi = req.nextUrl.pathname.startsWith('/api')

  // require admin
  if (REQUIRE_ADMIN_ROUTES.some(path => pathname.startsWith(path)))
    return requireAdmin(req, token, isApi)
  // require unauth
  else if (REQUIRE_UNAUTH_ROUTES.some(path => pathname.startsWith(path)))
    return requireUnAuth(req, token, isApi)
  // require auth
  else if (REQUIRE_AUTH_ROUTES.some(path => pathname.startsWith(path)))
    return requireAuth(req, token, isApi)
  // default
  else return NextResponse.next()
}

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
  console.log('- Require Auth -', token)
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

// match all routes except static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
