import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { NextRequest } from 'next/server'
import {
  addIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient,
} from './core'

// MARK: [GET]: /api/ingredients
export async function GET(req: NextRequest) {
  console.log('- View Ingredients -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await getIngredients(userId as string)
    return jsonSuccess(response)
  } catch (error) {
    console.error('Ingredients error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [POST]: /api/ingredients
export async function POST(req: NextRequest) {
  console.log('- Add Ingredient -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId as string
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await addIngredient(userId, await req.formData())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Ingredients error:', error)
    return jsonError(error.message)
  }
}

// MARK: [PUT]: /api/ingredients
export async function PUT(req: NextRequest) {
  console.log('- Update Ingredient -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId as string
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await updateIngredient(userId, await req.formData())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Ingredients error:', error)
    return jsonError(error.message)
  }
}

// MARK: [DELETE]: /api/ingredients
export async function DELETE(req: NextRequest) {
  console.log('- Delete Ingredient -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await deleteIngredient(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Ingredients error:', error)
    return jsonError(error.message)
  }
}
