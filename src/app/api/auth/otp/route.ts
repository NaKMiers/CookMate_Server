import { OTP_EXPIRES_AT } from '@/constants/common'
import {
  extractNameFromEmail,
  generateOTP,
  jsonError,
  jsonSuccess,
} from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import { sendEmailOTPLogin } from '@/lib/sendMail'
import UserModel from '@/models/User'
import { NextRequest } from 'next/server'

// Models: User
import '@/models/User'

// MARK: [POST]: /api/auth/otp
export async function POST(req: NextRequest) {
  console.log('- OTP Auth -')

  try {
    await connectDatabase()

    const { email } = await req.json()

    // Validation
    if (!email) return jsonError('Email is required', 400)

    // Check if user already exists
    let user: any = await UserModel.findOne({ email }).lean()

    if (user) {
      if (user.isDeleted) return jsonError('User is deleted', 400)

      const otp = generateOTP()
      await sendEmailOTPLogin(email, otp)

      // Update user
      await UserModel.updateOne(
        { email },
        { otp, otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_AT) }
      ).lean()
    } else {
      const otp = generateOTP()
      await sendEmailOTPLogin(email, otp)

      // Create new user
      user = await UserModel.create({
        email,
        name: extractNameFromEmail(email),
        authType: 'email',
        otp,
        otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_AT),
      })
    }

    return jsonSuccess({ message: 'OTP sent to email' })
  } catch (error) {
    console.error('OTP auth error:', error)
    return jsonError('OTP auth error')
  }
}
