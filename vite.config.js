import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: "src/index.html",
        cart: "src/cart/index.html",
        checkout: "src/checkout/index.html",
      },
    },
  },
});
