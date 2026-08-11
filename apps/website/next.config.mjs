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
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
