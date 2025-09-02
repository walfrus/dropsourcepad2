/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  compiler: {
    reactRemoveProperties: false,
  },
  experimental: {
    reactCompiler: false, // avoid stripping error details
  },
};
module.exports = nextConfig;
