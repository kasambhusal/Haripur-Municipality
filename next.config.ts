/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bhuvanpaudel.com.np',
        // pathname: '/**' // optional, you can uncomment this to be more specific
      },
    ],
  },
};

module.exports = nextConfig;
