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
  // Packages that use Node.js-only APIs — excluded from server webpack bundling.
  serverExternalPackages: ['razorpay', 'pg', '@pg-native'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    const builtinExternals = [
      'crypto', 'stream', 'fs', 'net', 'tls', 'dns',
      'http', 'https', 'zlib', 'util', 'path', 'os', 'child_process',
    ];
    if (isServer) {
      const existingExternals = config.externals || [];
      config.externals = [
        ...(Array.isArray(existingExternals) ? existingExternals : [existingExternals]),
        function ({ request }, callback) {
          if (request && builtinExternals.includes(request)) {
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
      ];
    } else {
      const fallback = {};
      builtinExternals.forEach((m) => { fallback[m] = false; });
      config.resolve.fallback = { ...config.resolve.fallback, ...fallback };
    }
    return config;
  },
};

export default nextConfig;
