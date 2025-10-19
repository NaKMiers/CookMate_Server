import { connectDatabase } from '@/lib/database'
import { getRecipesByIds } from '@/lib/spoonacular'
import FavoriteItemModel from '@/models/FavoriteItem'

// Models: FavoriteItem
import '@/models/FavoriteItem'

// MARK: View Favorites
export async function getFavorites(userId: string) {
  await connectDatabase()

  const favoriteItems = await FavoriteItemModel.find({ userId }).sort({
    createdAt: -1,
  })

  if (favoriteItems.length === 0)
    return {
      recipes: [],
      totalResults: 0,
      message: 'No favorites found',
    }

  const { recipes, totalResults } = await getRecipesByIds(
    favoriteItems.map(item => item.recipe)
  )

  return {
    recipes: JSON.parse(JSON.stringify(recipes)),
    totalResults,
    message: 'Favorites retrieved successfully',
  }
}

// MARK: Add Favorite
export async function addFavorite(userId: string, data: { recipeId: string }) {
  await connectDatabase()

  const { recipeId } = data
  if (![recipeId].every(Boolean)) throw new Error('Missing required fields')

  await FavoriteItemModel.create({
    userId,
    recipe: recipeId,
  })

  return {
    message: 'Favorite added successfully',
  }
}

// MARK: Delete Favorite
export async function deleteFavorite(
  userId: string,
  data: { recipeId: string }
) {
  await connectDatabase()

  const { recipeId } = data
  if (![recipeId].every(Boolean)) throw new Error('Missing required fields')

  const deletedFavorite = await FavoriteItemModel.findOneAndDelete({
    userId,
    recipe: recipeId,
  })

  if (!deletedFavorite) throw new Error('Favorite not found')

  return {
    favorite: JSON.parse(JSON.stringify(deletedFavorite)),
    message: 'Favorite deleted successfully',
  }
}
