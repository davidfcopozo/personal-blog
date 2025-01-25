/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/personal-blog-e0f8c.appspot.com/**",
      },
    ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "personal-blog-zy4i.vercel.app",
          },
        ],
        destination: "https://personal-blog-zy4i.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
