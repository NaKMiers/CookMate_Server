import { jsonError, jsonSuccess } from '@/lib/common'
import UserModel from '@/models/User'
import { NextRequest } from 'next/server'

// MARK: [POST]: /api/auth/recover/verify
export async function POST(req: NextRequest) {
  console.log('- Verify Recover Account -')

  try {
    const { email, otp } = await req.json()

    // check if user exists
    const user: any = await UserModel.findOne({ email })
    if (!user) return jsonError('User not found', 404)

    // check if otp expired
    if (user.otpExpiresAt && user.otpExpiresAt < new Date())
      return jsonError('OTP expired', 400)

    console.log(user)

    // check if otp is valid
    if (user.otp !== otp) return jsonError('Invalid OTP', 400)

    // update user
    await UserModel.updateOne(
      { email },
      { otp: null, otpExpiresAt: null, isDeleted: false }
    )

    return jsonSuccess({ message: 'Account recovered successfully' })
  } catch (error) {
    console.error('Verify recover account error:', error)
    return jsonError('Verify recover account error')
  }
}
