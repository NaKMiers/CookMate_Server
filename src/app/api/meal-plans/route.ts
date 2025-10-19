import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { NextRequest } from 'next/server'
import {
  createMealPlan,
  deleteMealPlan,
  getMealPlans,
  updateMealPlan,
} from './core'

// MARK: [GET]: /api/meal-plans
export async function GET(req: NextRequest) {
  console.log('- Get Meal Plans -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await getMealPlans(userId as string)
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Get meal plans error:', error)
    return jsonError(error.message)
  }
}

// MARK: [POST]: /api/meal-plans
export async function POST(req: NextRequest) {
  console.log('- Create Meal Plan -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await createMealPlan(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Create meal plan error:', error)
    return jsonError(error.message)
  }
}

// MARK: [PUT]: /api/meal-plans
export async function PUT(req: NextRequest) {
  console.log('- Update Meal Plan -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await updateMealPlan(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Update meal plan error:', error)
    return jsonError(error.message)
  }
}

// MARK: [DELETE]: /api/meal-plans
export async function DELETE(req: NextRequest) {
  console.log('- Delete Meal Plan -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    const response = await deleteMealPlan(userId as string, await req.json())
    return jsonSuccess(response)
  } catch (error: any) {
    console.error('Delete meal plan error:', error)
    return jsonError(error.message)
  }
}
