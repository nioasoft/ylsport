/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // Add allowed image domains as needed
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Performance optimizations
  swcMinify: true,
  // RTL support
  i18n: {
    locales: ['he'],
    defaultLocale: 'he',
  },
}

module.exports = nextConfig
