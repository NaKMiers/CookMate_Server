import mongoose from 'mongoose'

const Schema = mongoose.Schema

const DayPlanSchema = new Schema(
  {
    mealPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'mealPlan',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
)

const DayPlanModel = mongoose.models.dayPlan || mongoose.model('dayPlan', DayPlanSchema)
export default DayPlanModel

export interface IDayPlan {
  _id: string
  createdAt: string
  updatedAt: string

  mealPlanId: string
  userId: string
  date: Date
  notes?: string
}
