import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ShoppingItemSchema = new Schema(
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
    notes: String,
  },
  {
    timestamps: true,
  }
)

const ShoppingItemModel =
  mongoose.models.shoppingItems ||
  mongoose.model('shoppingItems', ShoppingItemSchema)
export default ShoppingItemModel

export interface IShoppingItem {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  name: string
  status: TShoppingItemStatus
  notes?: string
}

export type TShoppingItemStatus = 'draft' | 'active' | 'completed' | 'cancelled'
