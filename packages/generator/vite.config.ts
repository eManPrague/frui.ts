import path from "path";
import { defineConfig } from "vite";
import packageFile from "./package.json";

export default defineConfig({
  build: {
    lib: {
      formats: ["umd"],
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fruits-generator",
    },
    rollupOptions: {
      external: ["path", "fs", ...Object.keys(packageFile.dependencies)],
      output: {
        sourcemap: true,
        inlineDynamicImports: true,
      },
    },
  },
});
