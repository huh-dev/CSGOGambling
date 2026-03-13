/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "steamcommunity-a.akamaihd.net",
        pathname: "/economy/image/**",
      },
    ],
  },
}

export default nextConfig
