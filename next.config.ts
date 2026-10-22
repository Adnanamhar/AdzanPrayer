import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/profil',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
