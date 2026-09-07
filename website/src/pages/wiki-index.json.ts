/**
 * wiki-index.json
 *
 * Prerendered static index of every wiki page, generated at build time so the
 * in-browser chat widget can search the documentation without any backend.
 * The client fetches this file once, runs a lightweight keyword retrieval
 * against the visitor's question, and feeds the best-matching excerpts to the
 * local LLM as reference notes.
 *
 * Each wiki page is split into sections by its markdown headings, and each
 * section becomes its own entry: id, title, group, description, the section
 * heading and the section body as plain text. Splitting at section level
 * matters: a question like "how much does it cost" matches the FAQ section
 * that actually carries the price, instead of only the page's opening lines.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { WIKI_NAV } from '../lib/wiki-nav';

export const prerender = true;

const SECTION_LEN = 800;
const PAGE_LEN = 500;

/** Convert markdown to readable plain text (links, images, code and markup removed). */
function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s*!?\[[^\]]*\]\s*/gim, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*\|?[\s\-|+]+\|?\s*$/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Cut a string at a word boundary, never mid-word. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).trim() + ' ...';
}

/** Split a page body into { heading, text } sections on markdown headings. */
function splitSections(body: string): { heading: string; text: string }[] {
  const lines = body.split(/\r?\n/);
  const sections: { heading: string; text: string[] }[] = [];
  let current: { heading: string; text: string[] } | null = null;

  for (const line of lines) {
    const m = /^#{2,3}\s+(.+)$/.exec(line.trim());
    if (m) {
      if (current && current.text.length) sections.push(current);
      current = { heading: m[1].trim(), text: [] };
    } else if (current) {
      current.text.push(line);
    }
  }
  if (current && current.text.length) sections.push(current);

  return sections.map((s) => ({ heading: s.heading, text: toPlainText(s.text.join('\n')) })).filter((s) => s.text.length > 40);
}

export const GET: APIRoute = async () => {
  const entries = await getCollection('wiki');

  const groupOf = new Map<string, string>();
  for (const group of WIKI_NAV) {
    for (const page of group.pages) {
      if (!groupOf.has(page.id)) groupOf.set(page.id, group.label);
    }
  }

  const items: {
    id: string;
    title: string;
    group: string;
    description: string;
    section: string;
    snippet: string;
  }[] = [];

  for (const entry of entries) {
    const data = entry.data as { title: string; description?: string };
    const id = entry.id;
    const title = (data.title || id).trim();
    const description = (data.description || '').trim();
    const group = groupOf.get(id) ?? '';
    const body = entry.body ?? '';

    // Page-level entry: description plus the opening lines, so title matches
    // still work even for pages with no meaningful sections.
    items.push({
      id,
      title,
      group,
      description,
      section: '',
      snippet: truncate(toPlainText(body), PAGE_LEN),
    });

    // One entry per markdown section, so retrieval can target the passage
    // that actually contains the answer.
    for (const sec of splitSections(body)) {
      items.push({
        id,
        title,
        group,
        description,
        section: sec.heading,
        snippet: truncate(sec.text, SECTION_LEN),
      });
    }
  }

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};