import { extractToken } from '@/lib/auth'
import { deleteImage, uploadIngredientImage } from '@/lib/cloudinary'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import IngredientModel, { IIngredient } from '@/models/Ingredient'
import { NextRequest } from 'next/server'

// Models: Ingredient
import '@/models/Ingredient'

// MARK: [GET]: /api/ingredients
export async function GET(req: NextRequest) {
  console.log('- View Ingredients -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const ingredients = await IngredientModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    return jsonSuccess({ ingredients })
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

    await connectDatabase()

    const formData = await req.formData()
    const data = formData.entries()

    const { name, categoryId, quantity, unit, expiryDate, notes }: any =
      Object.fromEntries(data)
    const image = formData.get('image') as File
    if (![name, categoryId, quantity, unit].some(Boolean))
      return jsonError('Missing required fields', 400)

    // upload image
    let imageUrl = null

    if (image) {
      const imageResult = await uploadIngredientImage(image, userId)
      if (!imageResult) return jsonError('Image upload failed', 400)
      imageUrl = imageResult.secure_url
    }

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

    return jsonSuccess({ ingredient })
  } catch (error) {
    console.error('Pantry error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [PUT]: /api/ingredients
export async function PUT(req: NextRequest) {
  console.log('- Update Ingredient -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId as string
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const formData = await req.formData()
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
    if (![ingredientId, name, categoryId, quantity, unit].some(Boolean))
      return jsonError('Missing required fields', 400)

    const ingredient: IIngredient | null = await IngredientModel.findOne({
      _id: ingredientId,
      userId,
    })
    if (!ingredient) return jsonError('Ingredient not found', 404)

    let imageUrl = ingredient.image
    if (image) {
      // upload new image
      const imageResult = await uploadIngredientImage(image, userId)
      if (!imageResult) return jsonError('Image upload failed', 400)
      // delete old image
      if (imageUrl) await deleteImage(imageUrl)
      imageUrl = imageResult.secure_url
    }

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

    return jsonSuccess({ ingredient: updatedIngredient })
  } catch (error) {
    console.error('Pantry error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [DELETE]: /api/ingredients
export async function DELETE(req: NextRequest) {
  console.log('- Delete Ingredient -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { ingredientId } = await req.json()
    if (!ingredientId) return jsonError('Missing required fields', 400)

    const ingredient = await IngredientModel.findOneAndDelete({
      _id: ingredientId,
      userId,
    })
    if (!ingredient) return jsonError('Ingredient not found', 404)

    if (ingredient.image) await deleteImage(ingredient.image)

    return jsonSuccess({ ingredient })
  } catch (error) {
    console.error('Pantry error:', error)
    return jsonError('Something went wrong')
  }
}
