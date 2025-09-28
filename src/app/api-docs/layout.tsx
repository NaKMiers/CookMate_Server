import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'API Documentation - CookMate',
  description: 'Interactive API documentation for CookMate server',
}

export default function ApiDocsLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>
}
