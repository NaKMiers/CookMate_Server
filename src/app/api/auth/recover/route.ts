import { generateOTP, jsonError, jsonSuccess } from '@/lib/common'
import { sendRecoverAccountEmail } from '@/lib/sendMail'
import UserModel from '@/models/User'
import { NextRequest } from 'next/server'

// Models: User
import '@/models/User'

const OTP_EXPIRES_AT = 10 * 60 * 1000 // 10 minutes

// MARK: [POST]: /api/auth/recover
export async function POST(req: NextRequest) {
  console.log('- Recover Account -')

  try {
    const { email } = await req.json()

    // check if user exists
    const user: any = await UserModel.findOne({ email }).lean()
    if (!user) return jsonError('User not found', 404)

    // check if user is not deleted
    if (!user.isDeleted) return jsonError('User is not deleted', 400)

    // create otp (6 digits)
    const otp = generateOTP()

    // send email
    await sendRecoverAccountEmail(email, user.name || 'User', otp)

    await UserModel.updateOne(
      { email },
      { otp, otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_AT) }
    ).lean()

    return jsonSuccess({ message: 'OTP sent to email' })
  } catch (error) {
    console.error('Recover account error:', error)
    return jsonError('Something went wrong')
  }
}
