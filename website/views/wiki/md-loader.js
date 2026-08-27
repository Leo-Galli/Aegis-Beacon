/**
 * Aegis-Beacon Wiki -- Markdown Loader
 *
 * Loads .md files from website/wiki/ and renders them as HTML.
 * Supports: headings, bold, italic, code blocks, tables, alerts, lists, links.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// On Vercel, __dirname is inside .vercel/output/functions/...
// The wiki/ folder is bundled alongside api/index.js via includeFiles
// So it's at: <function_dir>/../wiki/ or <cwd>/website/wiki/
function findWikiDir() {
  const candidates = [
    // Vercel: wiki is bundled next to the function
    join(__dirname, '..', 'wiki'),               // api/../wiki = website/wiki/
    join(__dirname, '..', '..', 'wiki'),         // views/wiki/../../wiki = website/wiki/
    // Local dev paths
    resolve(process.cwd(), 'wiki'),              // from website/
    resolve(process.cwd(), 'website', 'wiki'),   // from project root
  ];
  return candidates;
}

const WIKI_CANDIDATES = findWikiDir();

/**
 * Markdown to HTML converter.
 * Processes blocks first (code, tables, alerts), then inline (bold, italic, links).
 */
function mdToHtml(md) {
  // Track code blocks to avoid processing inside them
  const codeBlocks = [];
  let html = md;

  // Step 1: Extract code blocks (``` ... ```) and replace with placeholders
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`);
    return `\x00CODEBLOCK_${idx}\x00`;
  });

  // Step 2: Extract inline code and replace with placeholders
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return `\x00INLINECODE_${idx}\x00`;
  });

  // Step 3: Process GitHub-style alerts BEFORE escaping
  // Handle multi-line alerts (> [!WARNING]\n text)
  html = html.replace(/^>\s*\[!WARNING\]\s*\n(.*(?:\n(?!>).*)*)/gm, (_, text) => {
    return `<div class="wiki-alert wiki-alert-warning"><strong>Warning:</strong> ${text.trim()}</div>`;
  });
  html = html.replace(/^>\s*\[!NOTE\]\s*\n(.*(?:\n(?!>).*)*)/gm, (_, text) => {
    return `<div class="wiki-alert wiki-alert-note"><strong>Note:</strong> ${text.trim()}</div>`;
  });
  html = html.replace(/^>\s*\[!TIP\]\s*\n(.*(?:\n(?!>).*)*)/gm, (_, text) => {
    return `<div class="wiki-alert wiki-alert-tip"><strong>Tip:</strong> ${text.trim()}</div>`;
  });
  html = html.replace(/^>\s*\[!IMPORTANT\]\s*\n(.*(?:\n(?!>).*)*)/gm, (_, text) => {
    return `<div class="wiki-alert wiki-alert-important"><strong>Important:</strong> ${text.trim()}</div>`;
  });
  html = html.replace(/^>\s*\[!INFO\]\s*\n(.*(?:\n(?!>).*)*)/gm, (_, text) => {
    return `<div class="wiki-alert wiki-alert-info"><strong>Info:</strong> ${text.trim()}</div>`;
  });

  // Step 4: Process blockquotes (single line > text)
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Step 5: Process tables
  html = processTables(html);

  // Step 6: Process headings (before paragraphs)
  html = html.replace(/^#### (.+)$/gm, '<h4 id="$1">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>');

  // Step 7: Process horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');

  // Step 8: Process unordered lists
  html = processLists(html);

  // Step 9: Process ordered lists
  html = processOrderedLists(html);

  // Step 10: Process inline formatting (bold, italic, links)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Step 11: Process paragraphs (wrap remaining text lines)
  html = processParagraphs(html);

  // Step 12: Restore code blocks and inline code
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`\x00CODEBLOCK_${idx}\x00`, block);
  });
  inlineCodes.forEach((code, idx) => {
    html = html.replace(`\x00INLINECODE_${idx}\x00`, code);
  });

  // Clean up
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/\n{3,}/g, '\n\n');

  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function processTables(html) {
  const lines = html.split('\n');
  const result = [];
  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      // Check if separator row (|---|---|)
      const cells = line.slice(1, -1).split('|').map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) {
        // Separator row - skip
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      const isHeader = !inTable || tableRows.length === 0;
      tableRows.push(cells);
    } else {
      if (inTable && tableRows.length > 0) {
        result.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }
      result.push(line);
    }
  }
  if (inTable && tableRows.length > 0) {
    result.push(renderTable(tableRows));
  }

  return result.join('\n');
}

function renderTable(rows) {
  if (rows.length === 0) return '';
  const header = rows[0];
  const body = rows.slice(1);
  
  let table = '<table><thead><tr>';
  header.forEach(cell => {
    table += `<th>${cell}</th>`;
  });
  table += '</tr></thead><tbody>';
  
  body.forEach(row => {
    table += '<tr>';
    row.forEach(cell => {
      table += `<td>${cell}</td>`;
    });
    table += '</tr>';
  });
  
  table += '</tbody></table>';
  return table;
}

function processLists(html) {
  const lines = html.split('\n');
  const result = [];
  let inList = false;

  for (const line of lines) {
    if (line.trim().startsWith('- ')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(`<li>${line.trim().slice(2)}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

function processOrderedLists(html) {
  const lines = html.split('\n');
  const result = [];
  let inList = false;

  for (const line of lines) {
    if (/^\d+\.\s/.test(line.trim())) {
      if (!inList) {
        result.push('<ol>');
        inList = true;
      }
      result.push(`<li>${line.trim().replace(/^\d+\.\s/, '')}</li>`);
    } else {
      if (inList) {
        result.push('</ol>');
        inList = false;
      }
      result.push(line);
    }
  }
  if (inList) result.push('</ol>');
  return result.join('\n');
}

function processParagraphs(html) {
  const lines = html.split('\n');
  const result = [];
  let paraBuffer = [];

  function flushPara() {
    if (paraBuffer.length > 0) {
      const text = paraBuffer.join(' ').trim();
      if (text && !text.startsWith('<')) {
        result.push(`<p>${text}</p>`);
      } else {
        result.push(text);
      }
      paraBuffer = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      flushPara();
      result.push('');
    } else if (trimmed.startsWith('<')) {
      flushPara();
      result.push(line);
    } else {
      paraBuffer.push(trimmed);
    }
  }
  flushPara();
  return result.join('\n');
}

/**
 * Load a wiki .md file and return rendered HTML.
 */
export async function loadWikiMarkdown(filename) {
  const searchPaths = WIKI_CANDIDATES.map(dir => join(dir, filename));

  for (const filePath of searchPaths) {
    try {
      const md = await readFile(filePath, 'utf-8');
      return mdToHtml(md);
    } catch (err) {
      // Try next path
    }
  }

  console.error(`[WIKI] Failed to load ${filename} from any path`);
  return `<p class="text-red-500">Error loading page: ${filename}</p>`;
}

/**
 * Get list of available wiki .md files.
 */
export async function getWikiPages() {
  const { readdir } = await import('node:fs/promises');
  try {
    const files = await readdir(WIKI_DIR);
    return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  } catch (err) {
    return [];
  }
}
