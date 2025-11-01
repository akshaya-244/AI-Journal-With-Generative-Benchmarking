/** @type {import('next').NextConfig} */

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ...other config
    experimental:{
        serverComponentsExternalPackages: ['@lancedb/lancedb'],

    },
    webpack(config) {
      config.externals.push({
        vectordb: 'vectordb'
      });
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
      ],
    },
  };
  
  export default nextConfig;