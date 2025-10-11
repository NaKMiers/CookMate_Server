import { generateToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import UserModel from '@/models/User'
import { NextRequest } from 'next/server'

// MARK: [POST]: /api/auth/otp/verify
export async function POST(req: NextRequest) {
  console.log('- Verify OTP Login -')

  try {
    const { email, otp } = await req.json()

    // Validation
    if (!email || !otp) {
      return jsonError('Email and OTP are required', 400)
    }

    // check if user exists
    const user: any = await UserModel.findOne({ email })
    if (!user) return jsonError('User not found', 404)

    // check if otp expired
    if (user.otpExpiresAt && user.otpExpiresAt < new Date())
      return jsonError('OTP expired', 400)

    // check if otp is valid
    if (user.otp !== otp) return jsonError('Invalid OTP', 400)

    // update user
    await UserModel.updateOne(
      { email },
      { otp: null, otpExpiresAt: null, isDeleted: false }
    )

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return jsonSuccess({
      user,
      token,
      message: 'Email authentication successful',
    })
  } catch (error) {
    console.log('Verify OTP Login error:', error)
    return jsonError('Verify OTP Login error')
  }
}
