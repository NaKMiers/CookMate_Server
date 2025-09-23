import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import UserModel from '@/models/User'
import { NextRequest } from 'next/server'

// Models: User
import '@/models/User'

// MARK: [GET]: /api/profile
export async function GET(req: NextRequest) {
  console.log('- View Profile -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const user = await UserModel.findById(userId)
    if (!user) return jsonError('User not found', 404)

    return jsonSuccess({ user })
  } catch (error) {
    console.error('Profile error:', error)
    return jsonError('Profile error')
  }
}

// MARK: [PUT]: /api/profile
export async function PUT(req: NextRequest) {
  console.log('- Update Profile -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { name, avatar, dietaryPreferences } = await req.json()
    if (![name, avatar, dietaryPreferences].some(Boolean))
      return jsonError('Invalid request', 400)

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { name: name.trim(), avatar, dietaryPreferences },
      { new: true }
    )
    if (!user) return jsonError('User not found', 404)

    return jsonSuccess({ user })
  } catch (error) {
    console.error('Update profile error:', error)
    return jsonError('Something went wrong')
  }
}
