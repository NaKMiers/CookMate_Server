import mongoose from 'mongoose'

const Schema = mongoose.Schema

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const NotificationModel =
  mongoose.models.notification ||
  mongoose.model('notification', NotificationSchema)
export default NotificationModel

export interface INotification {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  content: string
}
