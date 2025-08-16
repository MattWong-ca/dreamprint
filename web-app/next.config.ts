import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for @react-native-async-storage/async-storage and pino-pretty
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
        'fs': false,
        'net': false,
        'tls': false,
        'crypto': require.resolve('crypto-browserify'),
      };
    }
    return config;
  },
  // Ignore build errors from these modules
  transpilePackages: ['@metamask/sdk'],
};

export default nextConfig;
