import { defineConfig } from "vite"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  base: "/index/",
  build: {
    sourcemap: "inline",
    outDir: "../content/index/",
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: "src/demo.ts",
      output: { entryFileNames: `[name].js`, assetFileNames: `[name].[ext]` },
    },
  },
})
