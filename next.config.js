/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React's strict mode to surface potential problems in development.
  reactStrictMode: true,
  // The app directory is enabled by default as we are using Next.js 14+.
  experimental: {
    // This flag enables experimental features in the app router.
    serverActions: true
  }
};

module.exports = nextConfig;