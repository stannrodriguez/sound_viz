import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/sound_viz/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(""), "./src"),
    },
  },
});
