import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import obsidianCallouts from './src/lib/obsidian-callouts.mjs';

export default defineConfig({
  site: 'https://aegis-beacon.vercel.app',
  output: 'static',
  outDir: 'dist',
  publicDir: 'public',
  srcDir: 'src',
  build: {
    format: 'directory'
  },
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [obsidianCallouts]
  }
});
