import path from "path";
import { defineConfig } from "vite";
import packageFile from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fruits-apiclient",
      fileName: format => `fruits-apiclient.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageFile.dependencies)],
      output: {
        sourcemap: true,
      },
    },
  },
});
