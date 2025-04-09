/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-image-host.com', // Replace with your actual image host
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; 