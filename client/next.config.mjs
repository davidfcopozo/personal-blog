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
};

export default nextConfig;
