import Providers from '@/components/providers/Providers'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactNode } from 'react'
import authOptions from './api/auth/[...nextauth]/authOptions'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CookMate',
  description: 'CookMate - Your Personal Chef',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}
