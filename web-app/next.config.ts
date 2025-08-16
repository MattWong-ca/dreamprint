import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Tell webpack these modules don't exist in browser - use empty objects instead
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };
    return config;
  },
};

export default nextConfig;
