import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { NextRequest } from 'next/server'
import {
  addIngredientCategory,
  deleteIngredientCategory,
  getIngredientCategories,
  updateIngredientCategory,
} from './core'

// MARK: [GET]: /api/ingredients-categories
export async function GET(req: NextRequest) {
  console.log('- Get Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await getIngredientCategories(userId as string)
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Ingredients Category error:', error)
    return jsonError(error.message)
  }
}

// MARK: [POST]: /api/ingredients-category
export async function POST(req: NextRequest) {
  console.log('- Add Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await addIngredientCategory(
      userId as string,
      await req.json()
    )
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Ingredients Category error:', error)
    return jsonError(error.message)
  }
}

// MARK: [PUT]: /api/ingredients-category
export async function PUT(req: NextRequest) {
  console.log('- Update Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await updateIngredientCategory(
      userId as string,
      await req.json()
    )
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Ingredients Category error:', error)
    return jsonError(error.message)
  }
}

// MARK: [DELETE]: /api/ingredients-categories
export async function DELETE(req: NextRequest) {
  console.log('- Delete Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await deleteIngredientCategory(
      userId as string,
      await req.json()
    )
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Ingredients Category error:', error)
    return jsonError(error.message)
  }
}
