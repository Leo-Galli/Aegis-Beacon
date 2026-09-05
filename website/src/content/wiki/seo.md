---
title: SEO
description: "How the site's search visibility works: meta tags, structured data, sitemap, and the rules every new page must follow."
---

# SEO

Search engines, social platforms and chat apps all read the same metadata. This page documents how the site's SEO layer works and what every new page must include.

## The metadata stack

| Piece | Where | Purpose |
| --- | --- | --- |
| Title | `<title>` per page | The search result headline |
| Description | `<meta name="description">` | The search result summary |
| Open Graph | `og:*` tags | The card on Facebook, Discord, WhatsApp |
| Twitter card | `twitter:*` tags | The card on X |
| Structured data | JSON-LD | Rich results and entity understanding |
| Canonical | `<link rel="canonical">` | The page's identity |
| robots.txt | `/robots.txt` | Crawl permissions |
| Sitemap | `/sitemap-index.xml` | The crawl map |

## The rules for new pages

1. Title: under 60 characters, unique, with the site's name.
2. Description: 120 - 160 characters, honestly describing the page.
3. A canonical URL and Open Graph tags inherited from the layout automatically.
4. Wiki pages emit Article structured data plus BreadcrumbList automatically.

## Structured data on this site

- **WebSite** with SearchAction on every page
- **Article** on every wiki page (headline, description, image, author, publisher)
- **BreadcrumbList** on wiki articles
- **FAQPage** on the landing page, matching the visible questions

## Sharing previews

Discord, WhatsApp, Telegram and iMessage all read the Open Graph tags. The shared card uses the banner image (see [Branding](branding)). After adding a page, verify the card with a sharing preview tool or by pasting the URL into a chat app.

## Related pages

- [Branding](branding) for the visual identity
- [Deployment](deployment) for the pipeline
- [Robots and Sitemap](robots-and-sitemap) for the crawl side