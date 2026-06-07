# betterout.co

Public marketing site for [Better Out Co.](https://betterout.co) — the first mould-free, lab-tested coffee enema in South Africa, and a free library of five wellness guides written by Laura, the founder.

Brand source assets (logos, flyer, internal notes) live in a separate private repo: `laurabuilds7/better-out-co`. This repo is intentionally site-only.

## Stack

- [Astro 5](https://astro.build) (static-site generation, content collections)
- [Tailwind CSS 4](https://tailwindcss.com) (CSS-first config in `src/styles/global.css`)
- Hosted on **GitHub Pages**, custom domain `betterout.co`
- Built and deployed by `.github/workflows/deploy.yml` on every push to `main`

## Local dev

Requires Node 22+ and npm.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs ./dist
npm run preview    # serves ./dist
```

## Editing content

### The five guides

Each guide is a markdown file in `src/content/guides/` plus a PDF in `public/guides/`. To add or update a guide:

1. Drop the PDF in `public/guides/<slug>.pdf`.
2. Create or edit `src/content/guides/<slug>.md` with frontmatter:
   ```yaml
   title: "..."
   slug: "..."
   subtitle: "..."
   pages: 22
   pdf: "/guides/<slug>.pdf"
   order: 1
   level: "start here" | "core" | "advanced"
   excerpt: "..."
   ```
3. Commit and push. The site rebuilds automatically.

The home, library index, and individual guide pages all read from this collection — there is no other place to update.

### Copy & components

- Homepage hero: `src/pages/index.astro`
- About / founder note: `src/pages/about.astro`
- Header / footer / guide card: `src/components/`
- Site shell, fonts, OG tags: `src/layouts/Base.astro`

### Brand tokens

Palette and fonts are defined as CSS variables in `src/styles/global.css` under `@theme { ... }`. Tailwind utilities automatically pick them up (`bg-coffee`, `text-cream`, `font-display`, etc.).

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages → live at https://betterout.co in about a minute.

## Pending

- CIPC company registration number + registered address for the footer (currently `[pending]`).
- Real product photography for the eventual `/shop` pages.
