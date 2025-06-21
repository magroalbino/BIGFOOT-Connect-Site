/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // útil se for usar ações no server futuramente
  },
  images: {
    domains: ['localhost', 'your-cdn.com'], // adicione aqui domínios de imagens se necessário
  },
  output: 'standalone', // importante para deploy em Railway ou Docker
};

module.exports = nextConfig;
