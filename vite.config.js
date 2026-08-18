import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" — сборка работает и на GitHub Pages (подпапка), и на Vercel/Netlify
export default defineConfig({
  plugins: [react()],
  base: "./",
});
