// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  // Correct placement of base
  base: "/",
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // These aliases ensure that Node.js modules are properly polyfilled
      buffer: "buffer",
      util: "util",
    },
  },
  define: {
    "process.env": {},
  },
});
