import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { NextRequest } from 'next/server'
import { getProfile, updateProfile } from './core'

// MARK: [GET]: /api/profile
export async function GET(req: NextRequest) {
  console.log('- View Profile -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await getProfile(userId as string)
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Profile error:', error)
    return jsonError(error.message)
  }
}

// MARK: [PUT]: /api/profile
export async function PUT(req: NextRequest) {
  console.log('- Update Profile -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await updateProfile(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Update profile error:', error)
    return jsonError(error.message)
  }
}
