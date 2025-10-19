import { TShoppingItemStatus } from '@/models/ShoppingItem'
import { tool } from 'ai'
import { z } from 'zod'
import { addShoppingItem, getShoppingList } from '../../shopping/core'

// MARK: Get Shopping List
export const get_shopping_list = (userId: string) =>
  tool({
    description: 'Get all shopping list items. Can filter by status.',
    inputSchema: z.object({
      status: z
        .enum(['draft', 'active', 'completed', 'cancelled'])
        .optional()
        .describe('Filter by status (optional)'),
    }),
    execute: async ({ status }: { status?: string }) => {
      try {
        const response = await getShoppingList(
          userId,
          status as TShoppingItemStatus
        )
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_GET_SHOPPING_LIST',
          error: error.message || 'Failed to get shopping list',
        }
      }
    },
  })

// MARK: Add Shopping Item
export const add_shopping_item = (userId: string) =>
  tool({
    description: 'Add a new item to the shopping list.',
    inputSchema: z.object({
      name: z.string().describe('Name of the item to buy'),
      status: z
        .enum(['draft', 'active', 'completed', 'cancelled'])
        .default('draft')
        .describe('Status of the item'),
      notes: z.string().default('').describe('Additional notes'),
    }),
    execute: async ({
      name,
      status,
      notes,
    }: {
      name: string
      status: string
      notes: string
    }) => {
      try {
        const response = await addShoppingItem(userId, {
          name,
          status: (status || 'draft') as TShoppingItemStatus,
          notes,
        })
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_ADD_SHOPPING_ITEM',
          error: error.message || 'Failed to add shopping item',
        }
      }
    },
  })
