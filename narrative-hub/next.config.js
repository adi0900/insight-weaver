/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_TABLEAU_HOST: process.env.NEXT_PUBLIC_TABLEAU_HOST,
  },

  // Image optimization configuration
  images: {
    domains: ['your-site.online.tableau.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.online.tableau.com',
      },
      {
        protocol: 'https',
        hostname: '*.salesforce.com',
      },
    ],
  },

  // Webpack configuration for Tableau Embedding API
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
