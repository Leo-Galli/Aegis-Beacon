---
title: Using the BOM Builder
description: How the interactive bill-of-materials builder works, how the budget fitter behaves, and how to use the store comparison links.
---

# Using the BOM Builder

The builder at `/builder` takes the shopping list and turns it into an interactive calculator with live totals and price-comparison links.

## How it works

- Every part in the build is listed with a quantity stepper, a unit price, and a source.
- The **Target Budget** slider sets what you want to spend.
- The totals update live as you change quantities.
- Parts are flagged as essential or optional (buzzer and 3D-printed case are optional).

## The budget fitter

When your total exceeds the budget, click **Drop optional extras to fit**. The builder removes the largest optional saving first (the case at $2.00, then the buzzer at $0.40) until the total fits, or reports that even the essentials cannot fit.

This models the real advice: start with the 11 essential parts, add extras only when the budget allows.

## Compare prices

Each part row has **Compare** links that open pre-filled searches on Trovaprezzi, Google Shopping, eBay.it, AliExpress, and Amazon. Prices vary by region and by week, so the builder uses representative prices and the links let you find today's real numbers.

## Typical results

- Essentials only: about $25.80.
- With case and buzzer: about $28.20.
- With GPS: about $33.

## When the builder disagrees with the wiki

The wiki's shopping list and cost pages give ballpark ranges; the builder gives a configurable, live total. If they differ by a dollar or two, trust the builder's per-part prices and update them from the compare links before making a final budget.