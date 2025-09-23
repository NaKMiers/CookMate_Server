import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FavoriteItemSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    recipe: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

FavoriteItemSchema.index({ userId: 1, recipe: 1 }, { unique: true })

const FavoriteItemModel =
  mongoose.models.favoriteItem ||
  mongoose.model('favoriteItem', FavoriteItemSchema)
export default FavoriteItemModel

export interface IFavoriteItem {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  recipe: string
}
