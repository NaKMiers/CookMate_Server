import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RecipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    category: {
      type: String,
      enum: ['appetizer', 'main-course', 'dessert', 'beverage', 'snack'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    prepTime: {
      type: Number,
      required: true,
    },
    cookTime: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          enum: ['g', 'kg', 'ml', 'l', 'piece', 'cup', 'tbsp', 'tsp'],
          required: true,
        },
      },
    ],
    steps: [
      {
        stepNumber: {
          type: Number,
          required: true,
        },
        instruction: {
          type: String,
          required: true,
        },
      },
    ],
    images: [String],
    tags: [String],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const RecipeModel = mongoose.models.recipe || mongoose.model('recipe', RecipeSchema)
export default RecipeModel

export interface IRecipe {
  _id: string
  createdAt: string
  updatedAt: string

  title: string
  description?: string
  author: string
  category: TRecipeCategory
  difficulty: TDifficultyLevel
  prepTime: number
  cookTime: number
  servings: number
  ingredients: IIngredient[]
  steps: IStep[]
  images: string[]
  tags: string[]
  rating: {
    average: number
    count: number
  }
  isPublic: boolean
}

export interface IIngredient {
  name: string
  quantity: number
  unit: TMeasurementUnit
}

export interface IStep {
  stepNumber: number
  instruction: string
}

export type TRecipeCategory = 'appetizer' | 'main-course' | 'dessert' | 'beverage' | 'snack'
export type TDifficultyLevel = 'easy' | 'medium' | 'hard'
export type TMeasurementUnit = 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'cup' | 'tbsp' | 'tsp'
