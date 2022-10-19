import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          ["@babel/plugin-proposal-class-properties", { loose: false }],
        ],
      },
    }),
  ],
  optimizeDeps: {
    // include: ["@frui.ts/views"],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
