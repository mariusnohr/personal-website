import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  root: 'client',
  // Everything inside `static/` (icons, manifest, sketches, posts) is copied
  // verbatim to the root of the build output, exactly as it used to be with
  // parcel-plugin-static-files-copy. Vite also serves it during development.
  publicDir: resolve(import.meta.dirname, 'static'),
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
  },
  plugins: [glsl()],
});
