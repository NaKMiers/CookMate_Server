import { tool } from 'ai'
import { z } from 'zod'
import {
  addIngredientCategory,
  getIngredientCategories,
} from '../../ingredient-categories/core'

// MARK: Get All Ingredient Categories
export const get_all_ingredient_categories = (userId: string) =>
  tool({
    description: 'Get all ingredient categories.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const response = await getIngredientCategories(userId)
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_GET_INGREDIENT_CATEGORIES',
          error: error.message || 'Failed to get ingredient categories',
        }
      }
    },
  })

// MARK: Add Ingredient Category
export const add_ingredient_category = (userId: string) =>
  tool({
    description:
      'Create a new ingredient category with name and optional icon emoji.',
    inputSchema: z.object({
      name: z.string().describe('Category name (e.g., "Vegetables", "Dairy")'),
      icon: z.string().default('📦').describe('Emoji icon for the category'),
    }),
    execute: async ({ name, icon }: { name: string; icon: string }) => {
      try {
        const response = await addIngredientCategory(userId, { name, icon })
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_ADD_INGREDIENT_CATEGORY',
          error: error.message || 'Failed to add ingredient category',
        }
      }
    },
  })
