import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        useDefineForClassFields: false,
      },
    },
  },
});
