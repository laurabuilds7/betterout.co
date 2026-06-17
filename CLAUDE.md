# betterout.co — agent guide

Guidance for Claude Code (and other agents) working in this repo. Humans should read `README.md`.

## Repo shape

- Astro 5 + Tailwind 4 static site. Output is plain HTML/CSS/JS — no server, no runtime.
- Hosted on **GitHub Pages** from this public repo. Build + deploy via `.github/workflows/deploy.yml` on push to `main`.
- **LIVE at https://betterout.co** since 2026-06-16 (apex + `www`, HTTPS via Let's Encrypt, auto-renewing). Pinned by `public/CNAME`.
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

Frontmatter (schema in `src/content.config.ts`):

```yaml
title: "..."          # display name
slug: "..."           # url segment, must match filename
subtitle: "..."       # one-line italic pitch under the title
pages: 22             # for "22 pp" display
pdf: "/guides/..."    # absolute path served from public/
order: 1              # sort order across the library
level: "start here" | "core" | "advanced" | "the method"
excerpt: "..."        # 2-3 sentence pull, shown on the feature card and the guide landing page
comingSoon: true      # OPTIONAL — render the card as "Coming soon" with no download button
```

The markdown body itself appears below the excerpt block on the individual guide page. Keep it short (1-2 paragraphs) — the real content is the downloadable PDF.

## PDF cover pipeline

Every guide's PDF cover is **generated**, not hand-designed. Source PDFs live untouched at `tools/pdf-covers/sources/<slug>.pdf`; the build script drops the original page 1 and prepends a branded cover in the guide's tile colour, writing the final file to `public/guides/<slug>.pdf`.

```
tools/pdf-covers/
  build.mjs    — pdf-lib + @pdf-lib/fontkit script
  config.mjs   — per-guide config: slug, title, subtitle, eyebrow, tone
  fonts/       — vendored static TTFs (Fraunces, Fraunces-Italic, Inter)
  sources/     — untouched source PDFs, the source of truth
```

To update a guide:
1. **Content/copy only?** Edit `src/content/guides/<slug>.md` (Markdown + frontmatter). No PDF rebuild needed.
2. **New or updated source PDF?** Drop it at `tools/pdf-covers/sources/<slug>.pdf`, then `npm run build:pdfs` to regenerate all covers. Commit + push.
3. **Cover styling (title/subtitle/eyebrow/tone)?** Edit `tools/pdf-covers/config.mjs`, then `npm run build:pdfs`.

Note: pdf-lib's output isn't deterministic — every `npm run build:pdfs` rewrites all 6 PDFs even when only one source changed. That's expected; the visual content is identical. Mention it in the commit so reviewers don't worry.

## Conversion model

**No email capture, no forms, no analytics — by design.**

- PDF download links are plain `<a href download data-guide-download>`. They download instantly, no modal, no gate.
- A small fixed-position **Instagram follow nudge** (`#ig-nudge` in `src/layouts/Base.astro`) slides in ~400ms after any download click. It invites a follow at `@better.out.co` and auto-dismisses after 14s.
- All orders + correspondence happen on Instagram DM.
- Styling for the nudge: `.ig-nudge` block in `src/styles/global.css`.

If asked to add an email gate, a contact form, analytics, or any other data-collection: **pause and confirm**. Adding any of these triggers POPIA paperwork and breaks Phase 1's compliance posture.

## Voice & compliance

The guides are extremely careful: *"educational, not a prescription," "not a substitute for medical care,"* no curative claims. Site copy must sit on the same side of that line.

- Use **"supports", "eases", "calms", "nourishes"** — never **"cures", "treats", "heals" (in a clinical sense), "eliminates"**.
- Coffee enema copy: "supports the liver and colon," "the body's own gentle clearing." Do **not** say "detoxes you," "removes toxins from your body," "cures disease."
- The footer carries the master disclaimer. Don't remove or weaken it — it is the legal seatbelt for the whole site.
- The brand is a registered SA company. The footer's `Reg. no.` line was removed for v1 (no on-page commerce). When commerce launches (Phase 2), add a `Reg. no. <CIPC number>` line + registered address back into the footer using the real CIPC number — don't ship a `[pending]` placeholder on a live commerce site.
- POPIA (SA privacy law) kicks in the moment any form collects personal data. There are **no forms** in Phase 1 by design. If adding one (email capture, contact form, etc.), add a privacy policy first.

## Stack rules

- Astro content collections + `astro:content` `getCollection` for guide data — do not duplicate guide metadata in components.
- Tailwind 4 CSS-first config: theme tokens live in `@theme { ... }` in `src/styles/global.css`. **Do not introduce a `tailwind.config.{js,mjs,ts}` file** — v4 doesn't need one and mixing the two configurations causes silent breakage.
- **Fonts: Fraunces (display + italic) and Inter (body + labels).** Loaded once in `src/layouts/Base.astro` via Google Fonts. Static TTFs of the same families are vendored at `tools/pdf-covers/fonts/` for PDF generation.
- **Palette tokens (the source of truth, in `global.css` `@theme`):**
  - Base: `cream` `#FBFAF6` (near-white background), `cream-soft` `#F3F2EC`
  - Text/dark: `cocoa` / `espresso` / `coffee` `#3C2B1D` (all aliases for the same chocolate brown), softer `cocoa-soft` `#57422F`
  - Accent: `sage` `#84956F`, `sage-deep` `#62734B`, `sage-soft` `#A3B189` (the brand's one cool note — use small)
  - Warm accent: `sand` `#D9C7A2` (use sparingly), `clay` `#A87A55`
  - Card tones for guide tiles: `sagelight` `#D8DEC9`, `sage` `#BAC4A4`, `moss` `#7C8A5C` (cream text), `sand` `#E6DAC1`, `nude` `#D2B79C`, `brown` `#8C6A4D` (cream text). Live in `src/components/GuideCard.astro` via the `tone` prop.
  - Use these via Tailwind utilities (`bg-cream`, `text-cocoa`, `text-sage`, `border-cocoa/10`). **Never hardcode hex in components.**

## Common edits (where things live)

- **Wording on the post-download Instagram nudge:** `src/layouts/Base.astro`, look for `<aside id="ig-nudge">`. Style: `.ig-nudge` in `src/styles/global.css`.
- **Guide title / subtitle / excerpt / page count:** `src/content/guides/<slug>.md` frontmatter.
- **Guide card colours (tile colour per guide):** `tone` prop in the relevant `GuideCard.astro` invocation (`src/pages/index.astro`, `src/pages/guides/index.astro`). Available tones listed under Palette tokens.
- **Cover PDF text (eyebrow / title / subtitle):** `tools/pdf-covers/config.mjs`, then `npm run build:pdfs`.
- **Footer copy / links / disclaimer:** `src/components/Footer.astro` (disclaimer is load-bearing — see Voice & compliance).
- **Header nav + wordmark:** `src/components/Header.astro`.
- **Homepage hero copy + section order:** `src/pages/index.astro`.
- **About / founder note:** `src/pages/about.astro`.

## Deploy flow

1. Edit content/markdown/components.
2. `npm run build` locally to confirm a clean build (or just push — CI catches it).
3. Commit with a [Conventional Commits](https://www.conventionalcommits.org) prefix (`feat:`, `fix:`, `content:`, `infra:`, `docs:`, `chore:`). Always pause for Laura's "ok" before pushing — the site is live.
4. Push to `main`. GitHub Actions runs `.github/workflows/deploy.yml` → live in ~60–90s.

To check deploy status:

```bash
/opt/homebrew/bin/gh run list --repo laurabuilds7/betterout.co --limit 5
/opt/homebrew/bin/gh run watch <run-id> --repo laurabuilds7/betterout.co --exit-status
```

After a deploy, remind Laura that her browser may show the old cached version — **hard refresh (Cmd+Shift+R) or open Incognito** the first time to see the change. This catches her by surprise every time otherwise.

## What NOT to do without owner confirmation

- Switch hosting providers (Vercel, Netlify, Cloudflare Pages, etc.).
- Move DNS away from Porkbun.
- Delete or change `public/CNAME`.
- Add forms, analytics, third-party scripts, or any data-collection of any kind.
- Add Shopify, Stripe, Yoco, or other commerce — that's Phase 2 and needs a separate plan.
- Make the repo private (Pages with a custom domain on a private repo requires GitHub Pro).
- Push commits that remove the footer disclaimer or weaken its medical/wellness language.
- Commit anything from the sibling `better-out-co` private repo (brand source assets, internal notes) into this public repo.
