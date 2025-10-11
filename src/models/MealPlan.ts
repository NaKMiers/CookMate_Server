import mongoose from 'mongoose'

const Schema = mongoose.Schema

const MealPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    recipeIds: [String],
    notes: String,
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

const MealPlanModel =
  mongoose.models.mealPlan || mongoose.model('mealPlan', MealPlanSchema)
export default MealPlanModel

export interface IMealPlan {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  name: string
  recipeIds: string[]
  notes?: string
  date: Date
}
