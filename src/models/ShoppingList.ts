import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ShoppingListItemSchema = new Schema(
  {
    name: {
      type: String,
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
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'draft',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
)

const ShoppingListItemModel =
  mongoose.models.shoppingItems || mongoose.model('shoppingItems', ShoppingListItemSchema)
export default ShoppingListItemModel

export interface IShoppingItem {
  _id: string
  createdAt: string
  updatedAt: string

  name: string
  quantity: number
  unit: TMeasurementUnit
  status: TShoppingItemStatus
  notes?: string
}

export type TMeasurementUnit = 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'cup' | 'tbsp' | 'tsp'
export type TShoppingItemStatus = 'draft' | 'active' | 'completed' | 'cancelled'
