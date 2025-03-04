/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "splajompy-bucket.nyc3.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "splajompy-bucket.nyc3.digitaloceanspaces.com",
      },
    ],
  },
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
