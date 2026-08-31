/**
 * Aegis-Beacon Wiki -- RF Design page.
 * Loads content from website/wiki/rf-design-link-budget.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('rf-design-link-budget.md');
  return renderWikiPageLayout({
    pageId: 'rf-design',
    title: 'RF Design & Link Budget',
    file: 'website/wiki/rf-design-link-budget.md',
    content,
  });
}
