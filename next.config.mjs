/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      { source: "/zh-hans", destination: "/zh-CN", permanent: true },
      { source: "/zh-hans/:path*", destination: "/zh-CN/:path*", permanent: true },
      { source: "/zh-hant", destination: "/zh-TW", permanent: true },
      { source: "/zh-hant/:path*", destination: "/zh-TW/:path*", permanent: true }
    ];
  }
};

export default nextConfig;
