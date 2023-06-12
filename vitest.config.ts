import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["packages/**/*.test.{js,tsx,ts}"],
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        useDefineForClassFields: true,
      },
    },
  },
});
