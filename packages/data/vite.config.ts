import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fruits-data",
      fileName: format => `fruits-data.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        sourcemap: true,
      },
    },
  },
});
