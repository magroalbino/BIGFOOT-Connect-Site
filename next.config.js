/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // se realmente estiver usando
  },
  images: {
    domains: ['bigfoot-connect-site.vercel.app'], // coloque o domínio real aqui
  },
  output: 'standalone', // necessário apenas se você usa Railway, Docker, etc.
};

module.exports = nextConfig;
