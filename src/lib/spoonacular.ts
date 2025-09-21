// Spoonacular API helper functions

const BASE_URL = 'https://api.spoonacular.com'
const BASE_SEARCH_URL = `${BASE_URL}/recipes/complexSearch`
const BASE_BULK_URL = `${BASE_URL}/recipes/informationBulk`
const API_KEY = process.env.SPOONACULAR_API_KEY as string
const LIMIT = 10

// Build Spoonacular API URL
export const buildSpoonacularUrl = (
  params: Record<string, any>,
  baseUrl: string
) => {
  const searchParams = new URLSearchParams({
    apiKey: API_KEY as string,
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    includeNutrition: 'true',
    ...params,
  })

  return `${baseUrl}?${searchParams.toString()}`
}

// Fetch from Spoonacular API
export const fetchFromSpoonacular = async (params: Record<string, any>) => {
  if (!API_KEY) {
    throw new Error('Spoonacular API key not configured')
  }

  const url = buildSpoonacularUrl(params, BASE_SEARCH_URL)
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Spoonacular search error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

// MARK: Search recipes
export const searchRecipes = async (searchParams: Record<string, any>) => {
  try {
    // Pagination
    const page = parseInt(searchParams.page?.toString() || '1')
    const limit = parseInt(searchParams.limit?.toString() || LIMIT)
    const offset = (page - 1) * limit

    // Validate pagination
    if (page < 1) throw new Error('Page must be greater than 0')
    if (limit < 1 || limit > 100)
      throw new Error('Limit must be between 1 and 100')

    // Add pagination to search params
    const paramsWithPagination = {
      ...searchParams,
      offset: offset.toString(),
      number: limit.toString(),
    }

    const data = await fetchFromSpoonacular(paramsWithPagination)
    const totalResults = data.totalResults || 0
    const totalPages = Math.ceil(totalResults / limit)

    return {
      recipes: data.results || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        limit,
        offset,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    }
  } catch (error) {
    console.error('Search recipes error:', error)
    throw new Error('Failed to search recipes')
  }
}

// MARK: Get recipes by IDs
export const getRecipesByIds = async (recipeIds: number[]) => {
  if (!recipeIds || recipeIds.length === 0) {
    throw new Error('Recipe IDs are required')
  }

  if (recipeIds.length > 100) {
    throw new Error('Maximum 100 recipe IDs allowed')
  }

  // Convert array to comma-separated string
  const idsString = recipeIds.join(',')

  const bulkUrl = buildSpoonacularUrl({ ids: idsString }, BASE_BULK_URL)

  console.log(bulkUrl)

  const response = await fetch(bulkUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Spoonacular bulk recipes error: ${JSON.stringify(errorData)}`
    )
  }

  const data = await response.json()

  return {
    recipes: data || [],
    totalResults: data.length,
  }
}
