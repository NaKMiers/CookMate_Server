'use client'

import { signOut, useSession } from 'next-auth/react'

function HomePage() {
  const { data: session } = useSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-white to-green-100">
      <div className="rounded-xl bg-white/80 px-6 py-12 text-center shadow-lg backdrop-blur-md">
        <h1 className="mb-4 text-5xl font-extrabold text-green-700 drop-shadow">
          🍳 CookMate
        </h1>
        <p className="mb-8 text-lg text-gray-700">
          Your Personal Chef - Discover, manage, and cook your favorite recipes
          with ease.
        </p>
        <a
          href="/api-docs"
          className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-green-700"
        >
          Explore the API
        </a>
      </div>
      <footer className="mt-12 flex flex-wrap justify-center gap-2 text-sm text-gray-400">
        <span>&copy; 2025 CookMate - Made with </span>
        <span className="text-red-400">♥</span>
        {session && (
          <button className="hover:underline" onClick={() => signOut()}>
            Sign Out
          </button>
        )}
      </footer>
    </main>
  )
}

export default HomePage
