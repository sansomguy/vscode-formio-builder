import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/extension.ts",
      formats: ["cjs"],
    },
    outDir: "out",
    rollupOptions: {
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
        sourcemap: true,
      },

      external: ["vscode"],
    },
  },
});
