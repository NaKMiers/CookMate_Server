import { NextRequest } from 'next/server'
import { jsonError, jsonSuccess } from '@/lib/common'
import { searchRecipes } from '@/lib/spoonacular'

// MARK: [GET]: /api/recipes/search
export async function GET(req: NextRequest) {
  console.log('- Search Recipes -')

  try {
    const { searchParams } = new URL(req.url)
    const params = Object.fromEntries(searchParams.entries())

    const result = await searchRecipes(params)

    return jsonSuccess({
      message: 'Recipes retrieved successfully',
      ...result,
    })
  } catch (error: any) {
    console.error('Search recipes error:', error)
    return jsonError(error.message || 'Failed to search recipes', 400)
  }
}
