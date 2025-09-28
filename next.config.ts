import type { NextConfig } from "next";

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
        ],
      },
    ]
  },
};

export default nextConfig;
