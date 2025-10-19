import { deleteImage, uploadIngredientImage } from '@/lib/cloudinary'
import { connectDatabase } from '@/lib/database'
import IngredientModel, { IIngredient } from '@/models/Ingredient'

// Models: Ingredient
import '@/models/Ingredient'

// MARK: Get Ingredients
export const getIngredients = async (userId: string) => {
  await connectDatabase()

  const ingredients = await IngredientModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean()

  return {
    ingredients: JSON.parse(JSON.stringify(ingredients)),
    message: 'Ingredients retrieved successfully',
  }
}

// MARK: Add Ingredient
export const addIngredient = async (userId: string, formData: any) => {
  const data = formData.entries()

  const { name, categoryId, quantity, unit, expiryDate, notes }: any =
    Object.fromEntries(data)
  const image = formData.get('image') as File
  if (![name, categoryId, quantity, unit].every(Boolean))
    throw new Error('Missing required fields')

  // upload image
  let imageUrl = null

  if (image) {
    const imageResult = await uploadIngredientImage(image, userId)
    if (!imageResult) throw new Error('Image upload failed')
    imageUrl = imageResult.secure_url
  }

  await connectDatabase()

  // create ingredient
  const ingredient = await IngredientModel.create({
    userId,
    name: name.trim(),
    categoryId,
    quantity: quantity.trim(),
    unit: unit.trim(),
    expiryDate,
    image: imageUrl,
    notes,
  })

  return {
    ingredient: JSON.parse(JSON.stringify(ingredient)),
    message: 'Ingredient added successfully',
  }
}

// MARK: Update Ingredient
export const updateIngredient = async (userId: string, formData: any) => {
  const data = formData.entries()

  const {
    ingredientId,
    name,
    categoryId,
    quantity,
    unit,
    expiryDate,
    notes,
  }: any = Object.fromEntries(data)
  const image = formData.get('image') as File
  if (![ingredientId, name, categoryId, quantity, unit].every(Boolean))
    throw new Error('Missing required fields')

  const ingredient: IIngredient | null = await IngredientModel.findOne({
    _id: ingredientId,
    userId,
  })
  if (!ingredient) throw new Error('Ingredient not found')

  let imageUrl = ingredient.image
  if (image) {
    // upload new image
    const imageResult = await uploadIngredientImage(image, userId)
    if (!imageResult) throw new Error('Image upload failed')
    // delete old image
    if (imageUrl) await deleteImage(imageUrl)
    imageUrl = imageResult.secure_url
  }

  await connectDatabase()

  // create ingredient
  const updatedIngredient = await IngredientModel.findOneAndUpdate(
    { _id: ingredientId, userId },
    {
      name: name.trim(),
      categoryId,
      quantity: quantity.trim(),
      unit: unit.trim(),
      expiryDate,
      image: imageUrl,
      notes,
    },
    { new: true }
  )

  return {
    ingredient: JSON.parse(JSON.stringify(updatedIngredient)),
    message: 'Ingredient updated successfully',
  }
}

// MARK: Delete Ingredient
export const deleteIngredient = async (
  userId: string,
  data: { ingredientId: string }
) => {
  const { ingredientId } = data
  if (!ingredientId) throw new Error('Missing required fields')

  await connectDatabase()

  const ingredient = await IngredientModel.findOneAndDelete({
    _id: ingredientId,
    userId,
  })
  if (!ingredient) throw new Error('Ingredient not found')

  if (ingredient.image) await deleteImage(ingredient.image)

  return {
    ingredient: JSON.parse(JSON.stringify(ingredient)),
    message: 'Ingredient deleted successfully',
  }
}
