/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
    // This allows localhost in development
    loaderFile: undefined,
    unoptimized: false,
  },
  // Allow private IPs in development
  skipTrailingSlashRedirect: false,
  skipMiddlewareUrlNormalize: false,
};

// For development, you can use unoptimized images
if (process.env.NODE_ENV === 'development') {
  nextConfig.images.unoptimized = true;
}

module.exports = nextConfig;