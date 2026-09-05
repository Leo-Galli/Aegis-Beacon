---
title: Git Basics
description: "The git workflow for the Aegis-Beacon project: cloning, branching, committing, and the contribution flow."
---

# Git Basics

The project lives in git. This page is the working knowledge you need to build from the repo, track your own changes, and contribute back.

## The essential commands

| Command | Purpose |
| --- | --- |
| `git clone <url>` | Get the repository |
| `git status` | What changed |
| `git log --oneline` | History |
| `git checkout -b <branch>` | New branch |
| `git add <files>` | Stage changes |
| `git commit -m "message"` | Commit |
| `git push -u origin <branch>` | Publish |

## The contribution flow

1. Fork or branch from `main`.
2. Make the change; keep it small and focused.
3. Run the checks (see [Contributing](contributing) for the list).
4. Commit with a clear message; the project's commit style is documented in the repository's COMMIT.md.
5. Open a pull request describing what and why.

## Branching style

The project keeps `main` always green: CI runs on every push (see [CI/CD](ci-cd)). Work in branches, run the checks locally, then merge. A branch that breaks the build on its own is fine; a branch that breaks `main` is not.

## The two golden rules

1. Commit often, commit small: a commit that does one thing is reviewable; a commit that does ten is not.
2. Never rewrite pushed history on a shared branch: force-pushing over other people's work is how repositories get damaged.

## Related pages

- [Contributing](contributing) for the project rules
- [Software Build Process](software-build-process) for the build
- [CI/CD](ci-cd) for the checks