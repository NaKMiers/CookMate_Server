import { extractToken } from '@/lib/auth'
import { jsonError, jsonSuccess } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import NotificationModel from '@/models/Notification'
import { NextRequest } from 'next/server'

// Models: Notification
import '@/models/Notification'

// MARK: [GET]: /api/notifications
export async function GET(req: NextRequest) {
  console.log('- View Notifications -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const notifications = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    return jsonSuccess({ notifications })
  } catch (error) {
    console.error('Notifications error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [PATCH]: /api/notifications/:id
export async function PATCH(req: NextRequest) {
  console.log('- Update Notification -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { id: notificationId, value } = await req.json()
    if (!notificationId || value === undefined)
      return jsonError('Notification ID and value are required', 400)

    if (notificationId === 'all') {
      await NotificationModel.updateMany({ userId }, { isRead: value })
      return jsonSuccess({ message: 'All notifications updated successfully' })
    }

    await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: value },
      { new: true }
    )

    return jsonSuccess({ message: 'Notification updated successfully' })
  } catch (error) {
    console.error('Update notification error:', error)
    return jsonError('Something went wrong')
  }
}

// MARK: [DELETE]: /api/notifications/:id
export async function DELETE(req: NextRequest) {
  console.log('- Delete Notification -')

  try {
    const token = await extractToken(req)
    const userId = token?.userId
    if (!userId) return jsonError('Unauthorized', 401)

    await connectDatabase()

    const { id: notificationId } = await req.json()
    if (!notificationId) return jsonError('Notification ID is required', 400)

    if (notificationId === 'all') {
      await NotificationModel.deleteMany({ userId })
      return jsonSuccess({ message: 'All notifications deleted successfully' })
    }

    await NotificationModel.findOneAndDelete({ _id: notificationId, userId })

    return jsonSuccess({ message: 'Notification deleted successfully' })
  } catch (error) {
    console.error('Delete notification error:', error)
    return jsonError('Something went wrong')
  }
}
