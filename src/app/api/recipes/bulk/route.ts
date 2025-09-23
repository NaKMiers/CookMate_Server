import { NextRequest } from 'next/server'
import { jsonError, jsonSuccess } from '@/lib/common'
import { getRecipesByIds } from '@/lib/spoonacular'

// MARK: [GET]: /api/recipes/bulk
export async function GET(req: NextRequest) {
  console.log('- Get Recipes by IDs -')

  try {
    const body = await req.json()
    const { recipeIds } = body

    // Validate input
    if (!recipeIds || !Array.isArray(recipeIds)) {
      return jsonError('Recipe IDs array is required', 400)
    }

    if (recipeIds.length === 0) {
      return jsonError('At least one recipe ID is required', 400)
    }

    // Convert to numbers and validate
    const numericIds = recipeIds.map(id => {
      const numId = parseInt(id.toString())
      if (isNaN(numId)) {
        throw new Error(`Invalid recipe ID: ${id}`)
      }
      return numId
    })

    const result = await getRecipesByIds(numericIds)

    return jsonSuccess({
      message: 'Recipes retrieved successfully',
      ...result,
    })
  } catch (error: any) {
    console.error('Bulk recipes error:', error)
    return jsonError(error.message || 'Failed to get recipes', 400)
  }
}
