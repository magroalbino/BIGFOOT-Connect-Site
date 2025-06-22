/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  images: {
    domains: ['localhost', 'your-cdn.com'], // adicione aqui domínios de imagens se necessário
  },
  output: 'standalone', // importante para deploy em Railway ou Docker
};

module.exports = nextConfig;
