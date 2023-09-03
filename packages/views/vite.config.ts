import path from "path";
import { defineConfig } from "vite";
import packageFile from "./package.json";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
  build: {
    lib: {
      formats: ["es"],
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fruits-views",
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageFile.dependencies), ...Object.keys(packageFile.peerDependencies)],
      plugins: [preserveDirectives()],
      output: {
        sourcemap: true,
        preserveModules: true,
      },
    },
  },
});
