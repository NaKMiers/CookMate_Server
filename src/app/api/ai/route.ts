import * as favoritesTools from '@/app/api/ai/tools/favoritesTools'
import * as ingredientCategoriesTools from '@/app/api/ai/tools/ingredientCategoriesTools'
import * as ingredientsTools from '@/app/api/ai/tools/ingredientsTools'
import * as mealPlansTools from '@/app/api/ai/tools/mealPlansTools'
import * as profileTools from '@/app/api/ai/tools/profileTools'
import * as shoppingTools from '@/app/api/ai/tools/shoppingTools'
import { extractToken } from '@/lib/auth'
import { jsonError } from '@/lib/common'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import moment from 'moment-timezone'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('- AI Chat - CookMate Assistant -')

  // timezone
  const timezone = req.headers.get('x-timezone') || 'UTC'
  moment.tz.setDefault(timezone)

  const systemPrompt = `\
You are CookMate AI Assistant - a friendly and helpful cooking companion that helps users with:
- Recipe discovery and recommendations
- Meal planning and organization
- Pantry/ingredient management
- Shopping list creation
- Cooking notifications

**PROFILE:**
- Get profile: \`get_profile\`. Ex: "show my profile", "what are my dietary preferences"

**FAVORITES:**
- Get all favorites: \`get_all_favorites\`. Ex: "show my favorite recipes", "what are my favorites"

**MEAL PLANS:**
- Get all: \`get_all_meal_plans\`. Ex: "show my meal plans", "what's planned for this week"

**INGREDIENTS (Pantry):**
- Get all: \`get_all_ingredients\`. Ex: "show my ingredients", "what's in my pantry"

**INGREDIENT CATEGORIES:**
- Get all: \`get_all_ingredient_categories\`. Ex: "show ingredient categories"

**SHOPPING LIST:**
- Get shopping list: \`get_shopping_list\`. Optional: status. Ex: "show my shopping list"
- Add item: \`add_shopping_item\`. Needs: name, optional: status, notes. Ex: "add milk to shopping list"

**RULES:**
- Be friendly, enthusiastic about cooking and helping with meal planning
- If user lacks info, ask for clarification
- If user request something that is not related to the cooking or something that you can't help with, list one by one available tools (list tool name and description).
- For meal planning, consider user's schedule and preferences
- Warn about ingredient expiry dates if checking pantry
- Keep responses concise (under 100 words unless listing items)
- After calling a tool, provide a natural, helpful text summary of the results
- Suggest recipe ideas based on available ingredients when appropriate

**Current time: ${moment().format('YYYY-MM-DD HH:mm:ss')} (${timezone})**
  `

  try {
    const token = await extractToken(req)
    const userId = token?.userId as string

    // check if user is logged in
    if (!userId) {
      return jsonError('Unauthorized', 401)
    }

    // get messages history from request
    const { messages } = await req.json()

    // get the last 10 messages for better context
    const historyCapacity = 10
    const recentMessages = messages.slice(-historyCapacity)

    const result: any = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: recentMessages,
      tools: {
        // Profile Tools
        get_profile: profileTools.get_profile(userId),

        // Favorites Tools
        get_all_favorites: favoritesTools.get_all_favorites(userId),

        // Meal Plans Tools
        get_all_meal_plans: mealPlansTools.get_all_meal_plans(userId),

        // Ingredients Tools
        get_all_ingredients: ingredientsTools.get_all_ingredients(userId),

        // Ingredient Categories Tools
        get_all_ingredient_categories:
          ingredientCategoriesTools.get_all_ingredient_categories(userId),

        // Shopping List Tools
        get_shopping_list: shoppingTools.get_shopping_list(userId),
        add_shopping_item: shoppingTools.add_shopping_item(userId),
      },
    })

    const message: any = {
      role: result.finishReason === 'tool-calls' ? 'tool' : 'assistant',
      content: result.text,
    }
    if (result.finishReason === 'tool-calls') {
      message.toolInvocations = {
        result: result.toolResults || [],
      }
    }

    return NextResponse.json({
      message,
      usage: result.usage,
      finishReason: result.finishReason,
    })
  } catch (err: any) {
    console.error('AI Chat error:', err)
    return NextResponse.json(
      { message: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
