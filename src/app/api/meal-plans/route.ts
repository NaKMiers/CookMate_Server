import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import MealPlanModel from '@/models/MealPlan'
import { NextRequest } from 'next/server'

// MARK: [GET]: /api/meal-plans
export async function GET(req: NextRequest) {
  console.log('- Get Meal Plans -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const mealPlans = await MealPlanModel.find({ userId })
      .sort({
        createdAt: -1,
      })
      .lean()

    return jsonSuccess({ mealPlans })
  } catch (error) {
    console.error('Get meal plans error:', error)
    return jsonError('Get meal plans error')
  }
}

// MARK: [POST]: /api/meal-plans
export async function POST(req: NextRequest) {
  console.log('- Create Meal Plan -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { name, recipeIds, notes, date } = await req.json()
    const mealPlan = await MealPlanModel.create({
      userId,
      name,
      recipeIds,
      notes,
      date,
    })

    return jsonSuccess({ mealPlan, message: 'Meal plan created successfully' })
  } catch (error) {
    console.error('Create meal plan error:', error)
    return jsonError('Create meal plan error')
  }
}

// MARK: [PUT]: /api/meal-plans
export async function PUT(req: NextRequest) {
  console.log('- Update Meal Plan -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const { mealPlanId, name, recipeIds, notes, date } = await req.json()
    console.log(mealPlanId, name, recipeIds, notes, date)
    if (![mealPlanId, name, date].every(Boolean)) {
      return jsonError('Missing required fields', 400)
    }

    await connectDatabase()

    const mealPlan = await MealPlanModel.findByIdAndUpdate(
      mealPlanId,
      { name, recipeIds, notes, date },
      { new: true }
    )
    if (!mealPlan) return jsonError('Meal plan not found', 404)

    return jsonSuccess({ mealPlan, message: 'Meal plan updated successfully' })
  } catch (error) {
    console.error('Update meal plan error:', error)
    return jsonError('Update meal plan error')
  }
}

// MARK: [DELETE]: /api/meal-plans
export async function DELETE(req: NextRequest) {
  console.log('- Delete Meal Plan -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const { mealPlanId } = await req.json()
    if (!mealPlanId) return jsonError('Missing required fields', 400)

    await connectDatabase()

    const mealPlan = await MealPlanModel.findByIdAndDelete(mealPlanId)
    if (!mealPlan) return jsonError('Meal plan not found', 404)

    return jsonSuccess({ message: 'Meal plan deleted successfully' })
  } catch (error) {
    console.error('Delete meal plan error:', error)
    return jsonError('Delete meal plan error')
  }
}
