import { defineConfig } from "vite";

export default defineConfig({
  base: "/nepotato-threejs-gpu/",
  build: {
    outDir: "site",
    emptyOutDir: true,
  },
});

