import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import { getRecipesByIds } from '@/lib/spoonacular'
import FavoriteItemModel from '@/models/FavoriteItem'
import { NextRequest } from 'next/server'

// Models: FavoriteItem
import '@/models/FavoriteItem'

// MARK: [GET]: /api/favorites
export async function GET(req: NextRequest) {
  console.log('- View Favorites -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const favoriteItems = await FavoriteItemModel.find({ userId }).sort({
      createdAt: -1,
    })

    if (favoriteItems.length === 0)
      return jsonSuccess({ recipes: [], totalResults: 0 })

    const { recipes, totalResults } = await getRecipesByIds(
      favoriteItems.map(item => item.recipe)
    )

    return jsonSuccess({ recipes, totalResults })
  } catch (error) {
    console.error('Favorites error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [POST]: /api/favorites
export async function POST(req: NextRequest) {
  console.log('- Add Favorite -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { recipeId } = await req.json()
    if (!recipeId) return jsonError('Recipe ID is required', 400)

    await FavoriteItemModel.create({
      userId,
      recipe: recipeId,
    })

    return jsonSuccess({ message: 'Favorite added successfully' })
  } catch (error) {
    console.error('Favorites error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [DELETE]: /api/favorites
export async function DELETE(req: NextRequest) {
  console.log('- Delete Favorite -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { recipeId } = await req.json()
    await FavoriteItemModel.deleteOne({
      userId,
      recipe: recipeId,
    })

    return jsonSuccess({ message: 'Favorite deleted successfully' })
  } catch (error) {
    console.error('Favorites error:', error)
    return jsonError('Something went wrong')
  }
}
