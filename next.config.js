/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    // Content Security Policy
    // Permite apenas origens explicitamente listadas.
    // 'unsafe-inline' em style-src é necessário para Tailwind/CSS-in-JS.
    // 'unsafe-eval' em script-src é necessário para Next.js em dev — removido em prod.
    const isDev = process.env.NODE_ENV === 'development';

    const csp = [
      // Padrão: bloqueia tudo que não for listado
      `default-src 'self'`,

      // Scripts: Next.js chunks + Google Fonts (preconnect) + Phantom (injeta script)
      // 'unsafe-inline' necessário para Next.js inline scripts no _document
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://apis.google.com`,

      // Estilos: inline (Tailwind/CSS-in-JS) + Google Fonts
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,

      // Fontes: Google Fonts
      `font-src 'self' https://fonts.gstatic.com`,

      // Imagens: self + Firebase Storage + Google (avatars) + data URIs
      `img-src 'self' data: blob: https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://explorer.solana.com`,

      // Conexões de rede: Firebase, API própria, bridge, Solana
      `connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://api.bigfootconnect.tech https://bigfoot-server.vercel.app https://explorer.solana.com wss://*.firebaseio.com`,

      // Frames: Firebase Auth usa iframe para login federado
      `frame-src 'self' https://bigfoot-connect.firebaseapp.com`,

      // Objetos: bloqueia Flash e similares
      `object-src 'none'`,

      // Base URI: evita ataques de injeção de base tag
      `base-uri 'self'`,

      // Form action: só permite envio para o próprio site
      `form-action 'self'`,

      // Upgrade insecure requests em produção
      ...(isDev ? [] : [`upgrade-insecure-requests`]),
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          // ── CSP ──────────────────────────────────────────────────────────
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          // ── Headers existentes (mantidos) ─────────────────────────────────
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
          },
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
    NEXT_PUBLIC_FIREBASE_API_KEY:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_API_BASE_URL:                process.env.NEXT_PUBLIC_API_BASE_URL,
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

  // Output standalone para Docker
  output: 'standalone',
};

module.exports = nextConfig;
