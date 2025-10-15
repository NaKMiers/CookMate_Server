import { NextResponse } from 'next/server'

export const jsonSuccess = (data: any, status: number = 200) =>
  NextResponse.json(data, { status })

export const jsonError = (
  error: string = 'Something went wrong',
  status: number = 500
) => NextResponse.json({ error }, { status })

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const extractNameFromEmail = (email: string) => {
  return email.split('@')[0]
}

export const handleQuery = (
  searchParams: { [key: string]: string[] | string } | undefined,
  prefix: string = ''
): string => {
  let query = prefix + '?'

  // remove empty value
  for (const key in searchParams) {
    if (!searchParams[key]) delete searchParams[key]
  }

  // validate search params
  for (const key in searchParams) {
    // the params that allow only 1 value
    if (
      [
        'search',
        'sort',
        'userId',
        'from',
        'to',
        'role',
        'limit',
        'page',
      ].includes(key)
    ) {
      if (Array.isArray(searchParams[key]) && searchParams[key].length > 1) {
        searchParams[key] = searchParams[key].slice(-1)
      }
    }
  }

  // build query
  for (const key in searchParams) {
    // check if key is an array
    if (Array.isArray(searchParams[key])) {
      for (const value of searchParams[key]) {
        query += `${key}=${value}&`
      }
    } else {
      query += `${key}=${searchParams[key]}&`
    }
  }

  // remove all spaces
  query = query.replace(/ /g, '')

  // remove final '&'
  query = query.slice(0, -1)

  return query
}

export const searchParamsToObject = (
  searchParams: URLSearchParams
): { [key: string]: string[] } => {
  const params: { [key: string]: string[] } = {}
  for (const key of Array.from(searchParams.keys())) {
    params[key] = searchParams.getAll(key)
  }

  return params
}
