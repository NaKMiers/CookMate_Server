// MARK: [GET]: /api/admin/users
export const getAllUsersApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  const res = await fetch(`/api/admin/users${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// MARK: [DELETE]: /api/admin/users
export const deleteUsersApi = async (
  userIds: string[],
  value: boolean = true
) => {
  const res = await fetch('/api/admin/users', {
    method: 'DELETE',
    body: JSON.stringify({ userIds, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
