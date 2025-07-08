import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/users",
        destination: "http://localhost:3001/users",
      },
    ];
  },
};

export default nextConfig;
