import { ReactNode } from 'react'

function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <main className="flex min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100">
      {children}
    </main>
  )
}

export default AdminLayout
