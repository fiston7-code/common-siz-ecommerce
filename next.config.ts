import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',  // ✅ Ajoutez le slash avant **
      },
      // Si vous stockez aussi des images sur Supabase :
      {
        protocol: 'https',
        hostname: '*.supabase.co',  // ✅ Utilisez wildcard pour tous les projets
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;