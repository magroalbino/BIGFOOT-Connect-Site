/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configurações experimentais removidas para compatibilidade com Next.js 13.5.6
  experimental: {
    optimizeCss: true
  },

  // Configuração de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'explorer.solana.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Configuração de headers para segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },

  // Configuração de redirecionamentos
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/register.html',
        destination: '/register',
        permanent: true,
      },
      {
        source: '/login.html',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/dashboard.html',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/admin.html',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/pools.html',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Configuração de rewrites para API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.bigfootconnect.tech/api/:path*',
      },
    ];
  },

  // Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  // Configuração de compressão
  compress: true,

  // Configuração de páginas estáticas
  trailingSlash: false,

  // Configuração de i18n (internacionalização)
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
  },

  // Desabilitar powered-by header
  poweredByHeader: false,

  // Turbopack removido - usando configuração padrão do Next.js 13.5.6

  // Output standalone para Docker
  output: 'standalone',
};

module.exports = nextConfig;
