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
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'draft',
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

const MealPlanModel = mongoose.models.mealPlan || mongoose.model('mealPlan', MealPlanSchema)
export default MealPlanModel

export interface IMealPlan {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  name: string
  status: TMealPlanStatus
  date: Date
}

export type TMealPlanStatus = 'draft' | 'active' | 'completed' | 'cancelled'
