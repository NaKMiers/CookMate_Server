'use client'

import { environments } from '@/constants/environments'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading API Documentation...</p>
      </div>
    </div>
  ),
})

// Import Swagger CSS
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const baseUrl = environments.NEXT_PUBLIC_APP_URL

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            CookMate API Documentation
          </h1>
          <p className="text-gray-600">
            Interactive API documentation for CookMate server. Test endpoints
            directly from this page.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <strong>Base URL:</strong>{' '}
            <code className="rounded bg-gray-100 px-1">{baseUrl}</code>
          </div>
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">
              🚀 Quick Start:
            </h3>
            <ol className="space-y-1 text-sm text-blue-800">
              <li>
                1. Use{' '}
                <code className="rounded bg-blue-100 px-1">
                  {baseUrl}/api/auth/google
                </code>{' '}
                to get JWT token
              </li>
              <li>
                2. Click &quot;Authorize&quot; button and enter:{' '}
                <code className="rounded bg-blue-100 px-1">
                  Bearer YOUR_TOKEN
                </code>
              </li>
              <li>3. Test any endpoint by clicking &quot;Try it out&quot;</li>
            </ol>
            <div className="mt-3 rounded bg-yellow-50 p-3">
              <h4 className="mb-1 font-semibold text-yellow-900">
                ⚠️ Important:
              </h4>
              <p className="text-xs text-yellow-800">
                Most endpoints require authentication. Only{' '}
                <code className="rounded bg-yellow-100 px-1">
                  {baseUrl}/api/auth/google
                </code>{' '}
                works without authentication.
              </p>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading Swagger UI...</p>
              </div>
            </div>
          }
        >
          <SwaggerUI
            url={`/swagger.yaml?t=${Date.now()}`}
            deepLinking={true}
            displayOperationId={false}
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
            docExpansion="list"
            supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
            tryItOutEnabled={true}
            requestInterceptor={request => {
              if (request.url.startsWith('/api/')) {
                request.url = `${baseUrl}${request.url}`
              }
              return request
            }}
            responseInterceptor={response => {
              // Handle responses
              return response
            }}
          />
        </Suspense>
      </div>
    </div>
  )
}
