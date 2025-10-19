import { tool } from 'ai'
import { z } from 'zod'
import { getIngredientCategories } from '../../ingredient-categories/core'
import { addIngredient, getIngredients } from '../../ingredients/core'

// MARK: Get All Ingredients
export const get_all_ingredients = (userId: string) =>
  tool({
    description: "Get all ingredients in user's pantry/inventory.",
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const response = await getIngredients(userId)
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_GET_INGREDIENTS',
          error: error.message || 'Failed to get ingredients',
        }
      }
    },
  })

// MARK: Add Ingredient
export const add_ingredient = (userId: string) =>
  tool({
    description:
      'Add a new ingredient to pantry. Requires name, category name, quantity, and unit.',
    inputSchema: z.object({
      name: z.string().describe('Name of the ingredient'),
      categoryName: z.string().describe('Category name'),
      quantity: z.string().describe('Quantity of the ingredient'),
      unit: z
        .enum(['g', 'kg', 'ml', 'l', 'piece', 'cup', 'tbsp', 'tsp'])
        .describe('Unit of measurement'),
      expiryDate: z
        .string()
        .default('')
        .describe('Expiry date (YYYY-MM-DD format)'),
      notes: z.string().default('').describe('Additional notes'),
    }),
    execute: async ({
      name,
      categoryName,
      quantity,
      unit,
      expiryDate,
      notes,
    }: {
      name: string
      categoryName: string
      quantity: string
      unit: string
      expiryDate: string
      notes: string
    }) => {
      try {
        const { ingredientCategories } = await getIngredientCategories(userId)

        const category = ingredientCategories.find((cat: any) => {
          const key = cat.name.toLowerCase() + cat.icon + cat._id
          return key === categoryName.toLowerCase()
        })

        if (!category) {
          return {
            errorCode: 'CATEGORY_NOT_FOUND',
            error: `Category "${categoryName}" not found. Please create it first or choose an existing category.`,
            availableCategories: ingredientCategories.map((c: any) => c.name),
          }
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('categoryId', category._id)
        formData.append('quantity', quantity)
        formData.append('unit', unit)
        if (expiryDate) formData.append('expiryDate', expiryDate)
        if (notes) formData.append('notes', notes)

        const response = await addIngredient(userId, formData)
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_ADD_INGREDIENT',
          error: error.message || 'Failed to add ingredient',
        }
      }
    },
  })
