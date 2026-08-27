/**
 * Aegis-Beacon Wiki -- Overview page.
 * Loads content from website/wiki/project-overview.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderOverviewPage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('project-overview.md');
  return renderWikiPageLayout({
    pageId: 'overview',
    title: 'Project Overview',
    file: 'website/wiki/project-overview.md',
    content,
    lang,
    dict,
    currentPath
  });
}
