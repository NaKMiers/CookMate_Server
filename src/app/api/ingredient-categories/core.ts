import { connectDatabase } from '@/lib/database'
import IngredientModel from '@/models/Ingredient'
import IngredientCategoryModel from '@/models/IngredientCategory'

// Models: IngredientCategory, Ingredient
import '@/models/Ingredient'
import '@/models/IngredientCategory'

// MARK: Get Ingredient Categories
export const getIngredientCategories = async (userId: string) => {
  await connectDatabase()

  const ingredientCategories = await IngredientCategoryModel.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean()

  return {
    ingredientCategories: JSON.parse(JSON.stringify(ingredientCategories)),
    message: 'Ingredient categories retrieved successfully',
  }
}

// MARK: Add Ingredient Category
export const addIngredientCategory = async (
  userId: string,
  data: { name: string; icon?: string }
) => {
  const { name, icon } = data
  if (!name) throw new Error('Missing required fields')

  await connectDatabase()

  const ingredientCategory = await IngredientCategoryModel.create({
    userId,
    name: name.trim(),
    icon,
  })

  return {
    ingredientCategory: JSON.parse(JSON.stringify(ingredientCategory)),
    message: 'Ingredient category added successfully',
  }
}

// MARK: Update Ingredient Category
export const updateIngredientCategory = async (
  userId: string,
  data: { ingredientCategoryId: string; name: string; icon?: string }
) => {
  const { ingredientCategoryId, name, icon } = data
  if (![ingredientCategoryId, name].every(Boolean))
    throw new Error('Missing required fields')

  await connectDatabase()
  const ingredientCategory = await IngredientCategoryModel.findOneAndUpdate(
    { _id: ingredientCategoryId, userId },
    { name: name.trim(), icon },
    { new: true }
  )

  if (!ingredientCategory) throw new Error('Ingredients category not found')

  return {
    ingredientCategory: JSON.parse(JSON.stringify(ingredientCategory)),
    message: 'Ingredient category updated successfully',
  }
}

// MARK: Delete Ingredient Category
export const deleteIngredientCategory = async (
  userId: string,
  data: { ingredientCategoryId: string }
) => {
  const { ingredientCategoryId } = data
  if (!ingredientCategoryId) throw new Error('Missing required fields')

  await connectDatabase()
  const [_, ingredientCategory] = await Promise.all([
    // delete all ingredients in the category
    IngredientModel.deleteMany({ userId, categoryId: ingredientCategoryId }),
    // delete ingredient category
    IngredientCategoryModel.findOneAndDelete(
      {
        _id: ingredientCategoryId,
        userId,
      },
      { new: true }
    ),
  ])

  if (!ingredientCategory) throw new Error('Ingredients categories not found')

  return {
    ingredientCategory: JSON.parse(JSON.stringify(ingredientCategory)),
    message: 'Ingredient category deleted successfully',
  }
}
