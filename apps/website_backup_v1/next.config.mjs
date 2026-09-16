/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@cinmax/ui',
    '@cinmax/theme',
    '@cinmax/api',
    '@cinmax/hooks',
    '@cinmax/utils',
    '@cinmax/constants',
    '@cinmax/types',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
