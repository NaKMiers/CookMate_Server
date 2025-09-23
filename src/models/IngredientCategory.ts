import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IngredientCategorySchema = new Schema(
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
    icon: { type: String },
  },
  { timestamps: true }
)

IngredientCategorySchema.index({ userId: 1, name: 1 }, { unique: true })

const IngredientCategoryModel =
  mongoose.models.ingredientCategory ||
  mongoose.model('ingredientCategory', IngredientCategorySchema)
export default IngredientCategoryModel

export interface IIngredientCategory {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  name: string
  icon?: string
}
