import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: String,
    images: [String],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const PostModel = mongoose.models.posts || mongoose.model('posts', PostSchema)
export default PostModel

export interface ICommunity {
  _id: string
  createdAt: string
  updatedAt: string

  author: string
  title: string
  content?: string
  images: string[]
  likes: string[]
  isPublic: boolean
}
