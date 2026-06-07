# betterout.co — agent guide

Guidance for Claude Code (and other agents) working in this repo. Humans should read `README.md`.

## Repo shape

- Astro 5 + Tailwind 4 static site. Output is plain HTML/CSS/JS — no server, no runtime.
- Hosted on **GitHub Pages** from this public repo. Build + deploy via `.github/workflows/deploy.yml` on push to `main`.
- Custom domain `betterout.co` pinned by `public/CNAME`.
- Brand source assets (logos, flyer source, marketing scratch) live in a **separate private repo**: `laurabuilds7/better-out-co`. Do not move anything from there into this repo unless explicitly asked — this repo is intentionally site-only.

## Sibling repos and shared resources

- `~/Projects/better-out-co/` — private brand-assets repo (`laurabuilds7/better-out-co`). Logos, A4 shelf flyer + generator, internal brand notes.
- `~/Projects/calmlybloom-site/` — Laura's other public site (currently offline pending review). Unrelated brand; the `CLAUDE.md` there documents the same Porkbun API patterns.
- **Porkbun API creds** for DNS work live in `~/Projects/better-out-co/.env` (`PORKBUN_API_KEY`, `PORKBUN_SECRET_KEY`). Shared across Laura's projects. See the Porkbun section in `~/Projects/calmlybloom-site/CLAUDE.md` for the working call pattern, rate limits (1-per-10s on `checkDomain`), and per-domain API-access toggle requirement.

## DNS for this domain

`betterout.co` is registered on Porkbun and configured for GitHub Pages:

- Apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www` `CNAME`: `laurabuilds7.github.io`

The `public/CNAME` file pins the custom domain at the Pages side. Do not delete it unless intentionally taking the custom domain down.

## Content model

Five guides, one markdown file each in `src/content/guides/`, one PDF each in `public/guides/`. The schema is enforced in `src/content.config.ts`. The home, library index, and individual guide pages all read from this collection — there is **one source of truth per guide**.

Frontmatter:

```yaml
title: "..."          # display name
slug: "..."           # url segment, must match filename
subtitle: "..."       # one-line italic pitch under the title
pages: 22             # for "22 pp" display
pdf: "/guides/..."    # absolute path served from public/
order: 1              # sort order across the library
level: "start here" | "core" | "advanced"
excerpt: "..."        # 2-3 sentence pull, shown on the feature card and the guide landing page
```

The markdown body itself appears below the excerpt block on the individual guide page. Keep it short (1-2 paragraphs) — the real content is the downloadable PDF.

## Voice & compliance

The guides are extremely careful: *"educational, not a prescription," "not a substitute for medical care,"* no curative claims. Site copy must sit on the same side of that line.

- Use **"supports", "eases", "calms", "nourishes"** — never **"cures", "treats", "heals" (in a clinical sense), "eliminates"**.
- Coffee enema copy: "supports the liver and colon," "the body's own gentle clearing." Do **not** say "detoxes you," "removes toxins from your body," "cures disease."
- The footer carries the master disclaimer. Don't remove or weaken it.
- The brand is a registered SA company — the footer's reg-no placeholder (`[pending]`) needs the real CIPC number and registered address before any commercial activity. Flag this if the user is about to push commerce features.
- POPIA (SA privacy law) kicks in the moment any form collects personal data. There are **no forms** in Phase 1 by design. If adding one (email capture, contact form, etc.), add a privacy policy first.

## Stack rules

- Astro content collections + `astro:content` `getCollection` for guide data — do not duplicate guide metadata in components.
- Tailwind 4 CSS-first config: theme tokens live in `@theme { ... }` in `src/styles/global.css`. **Do not introduce a `tailwind.config.{js,mjs,ts}` file** — v4 doesn't need one and mixing the two configurations causes silent breakage.
- Fonts: Alfa Slab One (display wordmark), Lora (serif body), Poppins (sans labels). Loaded once in `src/layouts/Base.astro` via Google Fonts.
- Palette tokens (in `global.css`): `coffee` `#2E1A0D`, `kraft` `#7A4E2C`, `cream` `#F5E9D0`, `cream-soft` `#EADFBE`, `cream-deep` `#E2D3B0`, plus `coffee-soft`, `kraft-soft`, `ink`, `ink-soft`. Use these via Tailwind utilities (`bg-coffee`, `text-cream`, `border-coffee/10`). Don't hardcode hex.

## Deploy flow

1. Edit content/markdown/components.
2. `npm run build` locally to confirm a clean build (or just push — CI catches it).
3. Commit with a [Conventional Commits](https://www.conventionalcommits.org) prefix (`feat:`, `fix:`, `content:`, `infra:`, `docs:`, `chore:`).
4. Push to `main`. GitHub Actions runs `.github/workflows/deploy.yml` → live in ~60–90s.

To check deploy status:

```bash
/opt/homebrew/bin/gh run list --repo laurabuilds7/betterout.co --limit 5
```

## What NOT to do without owner confirmation

- Switch hosting providers (Vercel, Netlify, Cloudflare Pages, etc.).
- Move DNS away from Porkbun.
- Delete or change `public/CNAME`.
- Add forms, analytics, third-party scripts, or any data-collection of any kind.
- Add Shopify, Stripe, Yoco, or other commerce — that's Phase 2 and needs a separate plan.
- Make the repo private (Pages with a custom domain on a private repo requires GitHub Pro).
- Push commits that remove the footer disclaimer or weaken its medical/wellness language.
- Commit anything from the sibling `better-out-co` private repo (brand source assets, internal notes) into this public repo.
