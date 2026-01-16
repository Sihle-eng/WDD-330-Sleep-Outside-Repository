import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: "index.html",
        cart: "cart/index.html",
        checkout: "checkout/index.html",
      },
    },
  },
});
