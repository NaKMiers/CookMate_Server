import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IngredientSchema = new Schema(
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
      ref: 'ingredientCategory',
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

const IngredientModel =
  mongoose.models.ingredient || mongoose.model('ingredient', IngredientSchema)
export default IngredientModel

export interface IIngredient {
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

export type TIngredientCategory =
  | 'vegetables'
  | 'fruits'
  | 'meat'
  | 'dairy'
  | 'grains'
  | 'spices'
  | 'other'
export type TMeasurementUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'piece'
  | 'cup'
  | 'tbsp'
  | 'tsp'
