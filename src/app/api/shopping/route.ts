import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import ShoppingItemModel from '@/models/ShoppingItem'
import { NextRequest } from 'next/server'

// Models: Shopping Item
import '@/models/ShoppingItem'

// MARK: [GET]: /api/shopping
export async function GET(req: NextRequest) {
  console.log('- Get Shopping List -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const shoppingList = await ShoppingItemModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    return jsonSuccess({ shoppingList })
  } catch (error) {
    console.error('Shopping error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [POST]: /api/shopping
export async function POST(req: NextRequest) {
  console.log('- Add Shopping Item -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { name, status, notes } = await req.json()
    if (!name) return jsonError('Missing required fields', 400)

    const shoppingItem = await ShoppingItemModel.create({
      userId,
      name,
      status,
      notes,
    })

    return jsonSuccess({ shoppingItem })
  } catch (error) {
    console.error('Shopping error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [PUT]: /api/shopping
export async function PUT(req: NextRequest) {
  console.log('- Update Shopping Item -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { shoppingItemId, name, status, notes } = await req.json()
    if (!shoppingItemId || !name)
      return jsonError('Missing required fields', 400)

    const shoppingItem = await ShoppingItemModel.findByIdAndUpdate(
      shoppingItemId,
      { name, status, notes },
      { new: true, runValidators: true }
    )
    if (!shoppingItem) return jsonError('Shopping item not found', 404)

    return jsonSuccess({ shoppingItem })
  } catch (error) {
    console.error('Shopping error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [DELETE]: /api/shopping
export async function DELETE(req: NextRequest) {
  console.log('- Delete Shopping Item -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { shoppingItemId } = await req.json()
    if (!shoppingItemId) return jsonError('Missing required fields', 400)

    const deletedShoppingItem = await ShoppingItemModel.findByIdAndDelete(
      shoppingItemId,
      { new: true }
    )
    if (!deletedShoppingItem) return jsonError('Shopping item not found', 404)

    return jsonSuccess({ message: 'Shopping item deleted successfully' })
  } catch (error) {
    console.error('Shopping error:', error)
    return jsonError('Something went wrong')
  }
}
