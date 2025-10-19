import { tool } from 'ai'
import { z } from 'zod'
import { getFavorites } from '../../favorites/core'

// MARK: Get All Favorites
export const get_all_favorites = (userId: string) =>
  tool({
    description: 'Get all favorite recipes saved by the user.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const response = await getFavorites(userId)
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_GET_FAVORITES',
          error: error.message || 'Failed to get favorites',
        }
      }
    },
  })
