import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout.trim() ||
  randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [
    { url: "/~offline", revision },
    { url: "/icons/icon-192.png", revision },
    { url: "/icons/icon-512.png", revision },
    { url: "/icons/apple-touch-icon.png", revision },
    { url: "/icons/icon.svg", revision },
  ],
});

const nextConfig: NextConfig = {};

export default withSerwist(nextConfig);
