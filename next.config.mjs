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
};

export default nextConfig;
