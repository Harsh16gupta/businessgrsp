/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    qualities: [75, 90], // ✅ Add allowed image qualities
  },
  serverExternalPackages: [], // ✅ Safe placement for server external packages
};

module.exports = nextConfig;
