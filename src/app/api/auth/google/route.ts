import { generateToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import { NextRequest } from 'next/server'
import UserModel from '@/models/User'

// Models: User
import '@/models/User'

// MARK: [POST]: /api/auth/google
export async function POST(req: NextRequest) {
  console.log('- Google Auth -')

  try {
    await connectDatabase()

    const { googleUserId, email, name, avatar } = await req.json()

    // Validation
    if (!googleUserId || !email) {
      return jsonError('Google user ID and email are required', 400)
    }

    // Check if user already exists
    let user = await UserModel.findOne({
      $or: [{ googleUserId }, { email }],
    })

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleUserId) {
        user.googleUserId = googleUserId
        user.authType = 'google'
        await user.save()
      }
    } else {
      // Create new user
      user = await UserModel.create({
        googleUserId,
        email,
        name,
        avatar,
        authType: 'google',
      })
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return jsonSuccess({
      message: 'Google authentication successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        dietaryPreferences: user.dietaryPreferences,
      },
      token,
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return jsonError('Google auth error')
  }
}
