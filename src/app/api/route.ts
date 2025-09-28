import { jsonSuccess } from '@/lib/common'

// [GET]: /api
export async function GET() {
  return jsonSuccess({
    message: 'Hello, Welcome to CookMate API!',
  })
}
