import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import UserModel from '@/models/User'
import { NextRequest } from 'next/server'

// Models: User
import '@/models/User'

// MARK: [DELETE]: /api/profile/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Account -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    await UserModel.findByIdAndUpdate(userId, { isDeleted: true })

    return jsonSuccess({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Delete account error:', error)
    return jsonError('Something went wrong')
  }
}
