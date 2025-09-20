import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PantryCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const PantryCategoryModel =
  mongoose.models.pantryCategory || mongoose.model('pantryCategory', PantryCategorySchema)
export default PantryCategoryModel

export interface IPantryCategory {
  _id: string
  createdAt: string
  updatedAt: string

  name: string
}
