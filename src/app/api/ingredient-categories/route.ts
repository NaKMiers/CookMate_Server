import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import IngredientModel from '@/models/Ingredient'
import IngredientCategoryModel from '@/models/IngredientCategory'
import { NextRequest } from 'next/server'

// Models: IngredientCategory, Ingredient
import '@/models/Ingredient'
import '@/models/IngredientCategory'

// MARK: [GET]: /api/ingredients-categories
export async function GET(req: NextRequest) {
  console.log('- Get Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const ingredientCategory = await IngredientCategoryModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .lean()

    return jsonSuccess({ ingredientCategory })
  } catch (error) {
    console.error('Ingredients Category error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [POST]: /api/ingredients-category
export async function POST(req: NextRequest) {
  console.log('- Add Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { name, icon } = await req.json()
    if (!name) return jsonError('Missing required fields', 400)

    const ingredientCategory = await IngredientCategoryModel.create({
      userId,
      name: name.trim(),
      icon,
    })

    return jsonSuccess({ ingredientCategory })
  } catch (error) {
    console.error('Ingredients Category error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [PUT]: /api/ingredients-category
export async function PUT(req: NextRequest) {
  console.log('- Update Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { ingredientCategoryId, name, icon } = await req.json()
    if (![ingredientCategoryId, name].every(Boolean))
      return jsonError('Missing required fields', 400)

    const ingredientCategory = await IngredientCategoryModel.findOneAndUpdate(
      { _id: ingredientCategoryId, userId },
      { name: name.trim(), icon },
      { new: true }
    )

    if (!ingredientCategory)
      return jsonError('Ingredients category not found', 404)

    return jsonSuccess({ ingredientCategory })
  } catch (error) {
    console.error('Ingredients Category error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [DELETE]: /api/ingredients-categories
export async function DELETE(req: NextRequest) {
  console.log('- Delete Ingredients Category -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { ingredientCategoryId } = await req.json()
    if (!ingredientCategoryId) return jsonError('Missing required fields', 400)

    const [_, ingredientCategory] = await Promise.all([
      // delete all ingredients in the category
      IngredientModel.deleteMany({ userId, categoryId: ingredientCategoryId }),
      // delete ingredient category
      IngredientCategoryModel.findOneAndDelete({
        _id: ingredientCategoryId,
        userId,
      }),
    ])

    if (!ingredientCategory)
      return jsonError('Ingredients categories not found', 404)

    return jsonSuccess({ ingredientCategory })
  } catch (error) {
    console.error('Ingredients Category error:', error)
    return jsonError('Something went wrong')
  }
}
