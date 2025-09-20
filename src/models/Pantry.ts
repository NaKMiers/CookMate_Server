import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PantrySchema = new Schema(
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'pantryCategory',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      enum: ['g', 'kg', 'ml', 'l', 'piece', 'cup', 'tbsp', 'tsp'],
      required: true,
    },
    expiryDate: Date,
    image: String,
    notes: String,
  },
  {
    timestamps: true,
  }
)

const PantryModel = mongoose.models.pantry || mongoose.model('pantry', PantrySchema)
export default PantryModel

export interface IPantry {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  name: string
  category: string
  quantity: number
  unit: TMeasurementUnit
  expiryDate?: Date
  image?: string
  notes?: string
}

export type TPantryCategory = 'vegetables' | 'fruits' | 'meat' | 'dairy' | 'grains' | 'spices' | 'other'
export type TMeasurementUnit = 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'cup' | 'tbsp' | 'tsp'
