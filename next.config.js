/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
  },
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.optimization.minimize = true; // Ensure minification
    return config;
  },
  optimizeFonts: true,
  poweredByHeader: false,
}

module.exports = nextConfig 