import { jsonError, jsonSuccess, searchParamsToObject } from '@/lib/common'
import { connectDatabase } from '@/lib/database'
import UserModel from '@/models/User'
import { NextRequest } from 'next/server'

// Models: User
import '@/models/User'

// MARK: [GET]: /api/admin/users
export async function GET(req: NextRequest) {
  console.log('- Get Users -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(
      req.nextUrl.searchParams
    )

    // options
    let skip = 0
    const itemPerPage = 9
    const filter: Record<string, any> = {}
    let sort: Record<string, any> = { updatedAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['email', 'authType', 'role', 'name']

          filter.$or = searchFields.map(field => ({
            [field]: { $regex: params[key][0], $options: 'i' },
          }))
          continue
        }

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        filter[key] =
          params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of account
    const amount = await UserModel.countDocuments(filter)

    // get all users from database
    const users = await UserModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    return jsonSuccess({ users, amount })
  } catch (err: any) {
    return jsonError(err.message)
  }
}

// MARK: [DELETE]: /api/admin/users
export async function DELETE(req: NextRequest) {
  console.log('- Delete User -')

  try {
    const { userIds, emails, value } = await req.json()
    if (!userIds && !emails) return jsonError('Missing required fields', 400)

    await connectDatabase()

    await UserModel.updateMany(
      { $or: [{ _id: { $in: userIds } }, { email: { $in: emails } }] },
      { isDeleted: value === undefined || value === null ? true : value }
    )

    return jsonSuccess({ message: 'Users deleted successfully' })
  } catch (err: any) {
    return jsonError(err.message)
  }
}
