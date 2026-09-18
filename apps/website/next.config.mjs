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
  // Cloudflare Pages resolves these via the nodejs_compat compatibility flag at deploy time.
  serverExternalPackages: ['razorpay', 'pg', '@pg-native'],
  images: {
    unoptimized: true,
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
  webpack: (config, { isServer }) => {
    const builtinExternals = [
      'crypto', 'stream', 'fs', 'net', 'tls', 'dns',
      'http', 'https', 'zlib', 'util', 'path', 'os', 'child_process',
    ];
    if (isServer) {
      // Mark Node.js built-ins as externals so webpack doesn't try to bundle them.
      // On Cloudflare Pages these are provided by the nodejs_compat flag at runtime.
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
      // Browser bundle: stub out Node built-ins entirely
      const fallback = {};
      builtinExternals.forEach((m) => { fallback[m] = false; });
      config.resolve.fallback = { ...config.resolve.fallback, ...fallback };
    }
    return config;
  },
};

export default nextConfig;
