import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/swagger.yaml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/x-yaml',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
