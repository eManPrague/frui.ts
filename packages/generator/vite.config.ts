import path from "path";
import { defineConfig } from "vite";
import packageFile from "./package.json";
import banner from "vite-plugin-banner";
export default defineConfig({
  plugins: [
    banner(
      `#!/usr/bin/env node\n/* Frui.ts generator */`
    ),
  ],
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
