import { tool } from 'ai'
import { z } from 'zod'
import {
  createMealPlan,
  deleteMealPlan,
  getMealPlans,
  updateMealPlan,
} from '../../meal-plans/core'
import moment from 'moment'

// MARK: Get All Meal Plans
export const get_all_meal_plans = (userId: string) =>
  tool({
    description: 'Get all meal plans for the user.',
    inputSchema: z.object({
      date: z.string().optional().describe('Date for the meal plan'),
    }),
    execute: async ({ date }: { date?: string }) => {
      try {
        const query: any = {}
        if (date) query.date = moment(date).utc().toDate()
        const response = await getMealPlans(userId, query)
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_GET_MEAL_PLANS',
          error: error.message || 'Failed to get meal plans',
        }
      }
    },
  })

// MARK: Create Meal Plan
export const create_meal_plan = (userId: string) =>
  tool({
    description:
      'Create a new meal plan with recipe IDs, name, date, and optional notes.',
    inputSchema: z.object({
      name: z
        .string()
        .describe(
          'Name of the meal plan (e.g., "Monday Lunch", "Weekend Dinner")'
        ),
      recipeIds: z.array(z.string()).describe('Array of recipe IDs to include'),
      date: z.string().describe('Date for the meal plan (YYYY-MM-DD format)'),
      notes: z
        .string()
        .default('')
        .describe('Optional notes for the meal plan'),
    }),
    execute: async ({
      name,
      recipeIds,
      date,
      notes,
    }: {
      name: string
      recipeIds: string[]
      date: string
      notes: string
    }) => {
      try {
        const response = await createMealPlan(userId, {
          name,
          recipeIds,
          notes,
          date: new Date(date),
        })
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_CREATE_MEAL_PLAN',
          error: error.message || 'Failed to create meal plan',
        }
      }
    },
  })

// MARK: Update Meal Plan
export const update_meal_plan = (userId: string) =>
  tool({
    description: 'Update an existing meal plan.',
    inputSchema: z.object({
      mealPlanId: z.string().describe('The meal plan ID to update'),
      name: z.string().describe('New name for the meal plan'),
      recipeIds: z.array(z.string()).describe('New array of recipe IDs'),
      date: z.string().describe('New date (YYYY-MM-DD)'),
      notes: z.string().default('').describe('New notes'),
    }),
    execute: async ({
      mealPlanId,
      name,
      recipeIds,
      date,
      notes,
    }: {
      mealPlanId: string
      name: string
      recipeIds: string[]
      date: string
      notes: string
    }) => {
      try {
        const response = await updateMealPlan(userId, {
          mealPlanId,
          name,
          recipeIds,
          notes,
          date: new Date(date),
        })
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_UPDATE_MEAL_PLAN',
          error: error.message || 'Failed to update meal plan',
        }
      }
    },
  })

// MARK: Delete Meal Plan
export const delete_meal_plan = (userId: string) =>
  tool({
    description: 'Delete a meal plan by ID.',
    inputSchema: z.object({
      mealPlanId: z.string().describe('The meal plan ID to delete'),
    }),
    execute: async ({ mealPlanId }: { mealPlanId: string }) => {
      try {
        const response = await deleteMealPlan(userId, { mealPlanId })
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_DELETE_MEAL_PLAN',
          error: error.message || 'Failed to delete meal plan',
        }
      }
    },
  })
