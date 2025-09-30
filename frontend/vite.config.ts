import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 5173, // idea-discussion/backendのCORS設定に合わせたポート
    host: "0.0.0.0",
    allowedHosts: process.env.VITE_FRONTEND_ALLOWED_HOSTS?.split(",") || [],
  },
  esbuild: {
    keepNames: true,
    minifyIdentifiers: false,
  },
});
