import { NextResponse } from 'next/server'

export const jsonSuccess = (data: any, status: number = 200) =>
  NextResponse.json(data, { status })

export const jsonError = (
  error: string = 'Something went wrong',
  status: number = 500
) => NextResponse.json({ error }, { status })
