const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  skipTrailingSlashRedirect: false,
  skipMiddlewareUrlNormalize: false,
};

export default nextConfig;