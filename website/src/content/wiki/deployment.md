---
title: Deployment
description: "How the website is built and deployed: the build pipeline, the hosting platform, and what happens on every push to main."
---

# Deployment

The website deploys automatically from the repository. This page explains the pipeline, so contributors know what happens to their merged work.

## The pipeline

| Step | What happens |
| --- | --- |
| Push to `main` | CI runs the full check suite (see [CI/CD](ci-cd)) |
| Build | Astro builds the static site, including all wiki pages |
| Deploy | The hosting platform publishes the built site |
| Verify | The deployment health check confirms the site responds |

## What gets deployed

The build output includes:

- The landing page, demo, builder and repeaters pages
- The wiki (every page in the navigation)
- The robots.txt and sitemap (see [SEO](seo))
- Static assets: fonts, images, the config dashboard payload

## The environment

The site runs as a static deployment on the platform configured in the repository (Vercel for this project). The production URL is the one used across the site's metadata and sitemap. Local development uses `npm run dev` (see the run documentation in the repository).

## Deploy previews

Pull requests get a preview deployment automatically, so a wiki page or a design change can be reviewed at its real URL before merging. The CI checks run on the same preview.

## The dashboard connection

The config dashboard page is generated from the firmware at build time (see [Config Dashboard](config-dashboard)). A firmware update changes the dashboard on the next website build: that is the pipeline working as designed.

## Related pages

- [CI/CD](ci-cd) for the checks
- [Software Build Process](software-build-process) for the firmware build
- [SEO](seo) for the deployed metadata