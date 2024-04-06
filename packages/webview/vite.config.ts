import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../media",
    rollupOptions: {
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
      },
    },
  },
});
