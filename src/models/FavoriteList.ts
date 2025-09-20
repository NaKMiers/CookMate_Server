import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FavoriteListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    recipe: [
      {
        type: Schema.Types.ObjectId,
        ref: 'recipe',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const FavoriteListModel =
  mongoose.models.favoriteList || mongoose.model('favoriteList', FavoriteListSchema)
export default FavoriteListModel

export interface IFavoriteList {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  recipe: string[]
}
