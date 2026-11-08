import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/persian-ai-portfolio" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
