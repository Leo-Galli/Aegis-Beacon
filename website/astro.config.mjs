import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import obsidianCallouts from './src/lib/obsidian-callouts.mjs';
import externalLinks from './src/lib/external-links.mjs';

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
    rehypePlugins: [obsidianCallouts, externalLinks]
  }
});
