import { connectDatabase } from '@/lib/database'
import MealPlanModel, { IMealPlan } from '@/models/MealPlan'

// Models: Meal Plan
import '@/models/MealPlan'
import moment from 'moment'
import { FilterQuery } from 'mongoose'

// MARK: Get Meal Plans
export const getMealPlans = async (userId: string, query?: { date: Date }) => {
  await connectDatabase()

  const filter: FilterQuery<IMealPlan> = { userId }
  if (query?.date)
    filter.date = {
      $gte: moment(query.date).startOf('day').utc().toDate(),
      $lt: moment(query.date).endOf('day').utc().toDate(),
    }

  const mealPlans = await MealPlanModel.find(filter).sort({ date: -1 }).lean()

  return { mealPlans: JSON.parse(JSON.stringify(mealPlans)) }
}

// MARK: Create Meal Plan
export const createMealPlan = async (
  userId: string,
  data: { name: string; recipeIds: string[]; notes: string; date: Date }
) => {
  await connectDatabase()

  const { name, recipeIds, notes, date } = data
  if (![name, recipeIds, date].every(Boolean))
    throw new Error('Missing required fields')

  const mealPlan = await MealPlanModel.create({
    userId,
    name,
    recipeIds,
    notes,
    date,
  })

  return {
    mealPlan: JSON.parse(JSON.stringify(mealPlan)),
    message: 'Meal plan created successfully',
  }
}

// MARK: [PUT]: /api/meal-plans
export const updateMealPlan = async (
  userId: string,
  data: {
    mealPlanId: string
    name: string
    recipeIds: string[]
    notes: string
    date: Date
  }
) => {
  await connectDatabase()

  const { mealPlanId, name, recipeIds, notes, date } = data
  if (![mealPlanId, name, date].every(Boolean))
    throw new Error('Missing required fields')

  const mealPlan = await MealPlanModel.findByIdAndUpdate(
    mealPlanId,
    { name, recipeIds, notes, date },
    { new: true }
  )
  if (!mealPlan) throw new Error('Meal plan not found')

  return {
    mealPlan: JSON.parse(JSON.stringify(mealPlan)),
    message: 'Meal plan updated successfully',
  }
}

// MARK: [DELETE]: /api/meal-plans
export const deleteMealPlan = async (
  userId: string,
  data: { mealPlanId: string }
) => {
  await connectDatabase()

  const { mealPlanId } = data
  if (!mealPlanId) throw new Error('Missing required fields')

  const mealPlan = await MealPlanModel.findByIdAndDelete(mealPlanId)
  if (!mealPlan) throw new Error('Meal plan not found')

  return {
    mealPlan: JSON.parse(JSON.stringify(mealPlan)),
    message: 'Meal plan deleted successfully',
  }
}
