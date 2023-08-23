import { ManifestV3Export, crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import zipPack from "vite-plugin-zip-pack";

import manifest from "./src/manifest.json";
import { pages } from "./src/pages";

export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        input: pages,
        output: {
          chunkFileNames: "assets/chunk-[hash].js",
        },
      },
    },

    plugins: [
      crx({ manifest: manifest as ManifestV3Export }),
      react(),
      zipPack({
        outDir: `package`,
        inDir: "build",
        outFileName: `${manifest.name.replaceAll(" ", "-")}-extension-v${
          manifest.version
        }.zip`,
      }),
    ],

    server: {
      strictPort: true,
      port: 5173,
      hmr: {
        clientPort: 5173,
      },
    },
  };
});
