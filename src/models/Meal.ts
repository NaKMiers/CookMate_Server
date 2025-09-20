import mongoose from 'mongoose'

const Schema = mongoose.Schema

const MealSchema = new Schema(
  {
    dayPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'dayPlan',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'recipe',
      required: true,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
)

const MealModel = mongoose.models.meal || mongoose.model('meal', MealSchema)
export default MealModel

export interface IMeal {
  _id: string
  createdAt: string
  updatedAt: string

  dayPlanId: string
  userId: string
  mealType: TMealType
  recipe: string
  servings: number
  notes?: string
}

export type TMealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
