'use client'

import { signIn } from 'next-auth/react'

function AdminSignInPage() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white px-8 py-12 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <span className="text-5xl">🍳</span>
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-extrabold text-gray-900">
          CookMate Admin
        </h1>
        <p className="mb-8 text-gray-600">
          Sign in to access the admin dashboard
        </p>

        <div className="mb-6">
          <button
            onClick={() =>
              signIn('google', { callbackUrl: '/admin/dashboard' })
            }
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-gray-200 bg-white px-6 py-4 text-gray-700 shadow-md transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
          >
            <span className="text-base font-semibold">Sign in with Google</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <span className="cursor-pointer text-blue-600 hover:underline">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="cursor-pointer text-blue-600 hover:underline">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>

      <footer className="mt-8 text-sm text-gray-400">
        🔒 Secure and safe authentication
      </footer>
    </div>
  )
}

export default AdminSignInPage
