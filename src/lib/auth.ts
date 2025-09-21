import { jwtVerify } from 'jose'
import jwt from 'jsonwebtoken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const isValidJWTFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part.length > 0)
}

export const extractToken = async (req: NextRequest) => {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]
  if (token && isValidJWTFormat(token)) {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(NEXTAUTH_SECRET)
    )
    if (payload) return payload
  }
  return getToken({ req })
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, NEXTAUTH_SECRET, { expiresIn: '30d' })
}
