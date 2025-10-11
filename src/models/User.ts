import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleUserId: {
      type: String,
      required: function (this: { authType: string }) {
        return this.authType === 'google'
      },
      unique: true,
      sparse: true,
    },
    authType: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    avatar: String,
    name: String,
    dietaryPreferences: [String],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiresAt: Date,
  },
  {
    timestamps: true,
  }
)

const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)
export default UserModel

export interface IUser {
  _id: string
  createdAt: string
  updatedAt: string

  email: string
  googleUserId?: string
  authType: TAuthType
  role: TUserRole
  avatar?: string
  name?: string
  dietaryPreferences: string[]
  isDeleted: boolean
  otp?: string
  otpExpiresAt?: Date
}

export type TAuthType = 'email' | 'google'
export type TUserRole = 'admin' | 'user'
