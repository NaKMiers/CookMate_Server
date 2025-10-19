import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { NextRequest } from 'next/server'
import {
  addShoppingItem,
  deleteShoppingItem,
  getShoppingList,
  updateShoppingItem,
} from './core'

// MARK: [GET]: /api/shopping
export async function GET(req: NextRequest) {
  console.log('- Get Shopping List -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await getShoppingList(userId as string)
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Shopping error:', error)
    return jsonError(error.message)
  }
}

// MARK: [POST]: /api/shopping
export async function POST(req: NextRequest) {
  console.log('- Add Shopping Item -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await addShoppingItem(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Shopping error:', error)
    return jsonError(error.message)
  }
}

// MARK: [PUT]: /api/shopping
export async function PUT(req: NextRequest) {
  console.log('- Update Shopping Item -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await updateShoppingItem(
      userId as string,
      await req.json()
    )
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Shopping error:', error)
    return jsonError(error.message)
  }
}

// MARK: [DELETE]: /api/shopping
export async function DELETE(req: NextRequest) {
  console.log('- Delete Shopping Item -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await deleteShoppingItem(
      userId as string,
      await req.json()
    )
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Shopping error:', error)
    return jsonError(error.message)
  }
}
