/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
  },
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure that any missing files result in index.html being served
        manualChunks() {
          return "index.html";
        },
      },
    },
  },
});
