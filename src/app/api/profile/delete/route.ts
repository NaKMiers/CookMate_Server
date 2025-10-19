import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { NextRequest } from 'next/server'
import { deleteAccount } from '../core'

// MARK: [DELETE]: /api/profile/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Account -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await deleteAccount(userId as string)
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Delete account error:', error)
    return jsonError(error.message)
  }
}
