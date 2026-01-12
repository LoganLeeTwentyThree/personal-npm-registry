import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/-/user/org.couchdb.user:name', // The incoming request path pattern
        destination: '/user/:name', // The path you want to route to
        permanent: true, // true for 308 (permanent) redirect, false for 307 (temporary)
      },
    ]
  }
};

export default nextConfig;
