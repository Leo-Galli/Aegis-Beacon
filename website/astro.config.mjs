import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aegis-beacon.vercel.app',
  output: 'static',
  outDir: 'dist',
  publicDir: 'public',
  srcDir: 'src',
  build: {
    format: 'directory'
  }
});
