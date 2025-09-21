import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IngredientCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const IngredientCategoryModel =
  mongoose.models.ingredientCategory ||
  mongoose.model('ingredientCategory', IngredientCategorySchema)
export default IngredientCategoryModel

export interface IIngredientCategory {
  _id: string
  createdAt: string
  updatedAt: string

  name: string
}
