import { connectDatabase } from '@/lib/database'
import UserModel from '@/models/User'

// Models: User
import '@/models/User'

// MARK: [GET]: /api/profile
export const getProfile = async (userId: string) => {
  await connectDatabase()

  const user = await UserModel.findById(userId)
  if (!user) throw new Error('User not foudn')

  return {
    user: JSON.parse(JSON.stringify(user)),
    message: 'Profile retrieved successfully',
  }
}

// MARK: [PUT]: /api/profile
export const updateProfile = async (
  userId: string,
  data: { name: string; avatar: string; dietaryPreferences: string[] }
) => {
  await connectDatabase()

  const { name, avatar, dietaryPreferences } = data
  if (![name].every(Boolean)) throw new Error('Missing required fields')

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { name: name.trim(), avatar: avatar || null, dietaryPreferences },
    { new: true }
  )
  if (!user) throw new Error('User not found')

  return {
    user: JSON.parse(JSON.stringify(user)),
    message: 'Profile updated successfully',
  }
}

// MARK: Delete Account
export const deleteAccount = async (userId: string) => {
  await connectDatabase()

  const user = await UserModel.findByIdAndUpdate(userId, { isDeleted: true })
  if (!user) throw new Error('User not found')

  return {
    user: JSON.parse(JSON.stringify(user)),
    message: 'Account deleted successfully',
  }
}
