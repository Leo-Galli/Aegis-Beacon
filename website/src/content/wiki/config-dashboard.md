---
title: Config Dashboard
description: "The website page that renders the firmware's own configuration dashboard: how the extraction works and how to keep it fresh."
---

# Config Dashboard

The website has a page that shows the beacon's configuration dashboard, and it is not a reimplementation: it is the firmware's own dashboard, extracted at build time. This page explains the mechanism.

## How it works

The firmware contains its configuration dashboard as a raw HTML document inside the source (see the wiki page on the [dashboard rendering](dashboard-rendering)). At website build time a small script:

1. Reads the firmware source file
2. Extracts the dashboard HTML document
3. Writes it as a static payload into the website
4. The page renders it in a framed viewport

## Why this design

The user-facing rule of the project: the website's dashboard can never drift from the firmware. When the firmware's dashboard changes, the next website build picks up the change automatically. There is no second copy to maintain, and no "the site says X but the firmware does Y" failure mode.

## Keeping it fresh

The extraction runs during the website build (see [Deployment](deployment)), so a firmware change propagates on the next build. The CI checks the extraction produced a non-empty payload, so a broken extraction fails the build instead of shipping an empty page.

## The framing

The dashboard payload is rendered inside a styled frame that matches the site's design (see the [dashboard rendering](dashboard-rendering) page for the details). The controls shown are the firmware's own controls, with the same behavior and labels the device shows.

## Related pages

- [Dashboard Rendering](dashboard-rendering) for the rendering details
- [Dashboard HTTP API](dashboard-http-api) for the API variant
- [Deployment](deployment) for the build pipeline