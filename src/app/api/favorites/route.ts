import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { NextRequest } from 'next/server'
import { addFavorite, deleteFavorite, getFavorites } from './core'

// MARK: [GET]: /api/favorites
export async function GET(req: NextRequest) {
  console.log('- View Favorites -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await getFavorites(userId as string)
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('View favorites error:', error)
    return jsonError(error.message)
  }
}

// MARK: [POST]: /api/favorites
export async function POST(req: NextRequest) {
  console.log('- Add Favorite -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await addFavorite(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Add favorite error:', error)
    return jsonError(error.message)
  }
}

// MARK: [DELETE]: /api/favorites
export async function DELETE(req: NextRequest) {
  console.log('- Delete Favorite -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await deleteFavorite(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Delete favorite error:', error)
    return jsonError(error.message)
  }
}
