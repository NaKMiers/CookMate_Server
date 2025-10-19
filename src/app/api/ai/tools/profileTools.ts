import { tool } from 'ai'
import { z } from 'zod'
import { getProfile } from '../../profile/core'

// MARK: Get Profile
export const get_profile = (userId: string) =>
  tool({
    description:
      "Get user's profile information including name, email, avatar, dietary preferences.",
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const response = await getProfile(userId)
        return response
      } catch (error: any) {
        return {
          errorCode: 'FAILED_TO_GET_PROFILE',
          error: error.message || 'Failed to get profile',
        }
      }
    },
  })
