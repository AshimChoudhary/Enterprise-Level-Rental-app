import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Ignore mapbox-gl warnings
    config.ignoreWarnings = [{ module: /node_modules\/mapbox-gl/ }];

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Transpile mapbox-gl for better compatibility
  transpilePackages: ["mapbox-gl"],
};

export default nextConfig;
