# Better Out Co. — Handoff Document

**Last updated:** 2026-06-08
**Author of this doc:** Claude Code (the CLI version)
**Hand-off recipient:** Future Claude (likely Claude Code in the desktop app) + Laura Weyel

This document is the single source of truth for where this work is right now. If you're a Claude session that just opened this project — **read this first**, then read `CLAUDE.md`, then verify against the actual current code before acting.

---

## ⭐ Session update — 2026-06-16 (desktop app, with Laura)

A large visual + content overhaul of the **home page and guides** happened this session. Everything is **saved on disk but UNCOMMITTED** — Laura wants to commit + push (go live) herself from the terminal. `npm run build` is clean (11 pages).

### What changed (uncommitted in working tree)
- **`src/styles/global.css`** — locked palette: bright near-white base `#FBFAF6`, chocolate `#3C2B1D`, sage `#84956F`. Font is now **Fraunces** (display) + **Inter** (body) — replaced the rejected Cormorant. Pinterest "earthy" guide-card tones: `sagelight / sage / moss / sand / nude / brown` with hover shade-shift. Email-capture modal styles.
- **`src/pages/index.astro`** — product/ritual lead, **Free Guides moved to the bottom**; product is **"Available now"** with Order buttons (→ Instagram); biohack-voice ritual copy; new founder quote; value-driven guides intro ("12+ years as a nutritionist…"); section colour rhythm (soft-sage hero, sand ritual, sage quote band, chocolate product, white guides).
- **`src/components/GuideCard.astro`** + **`src/pages/guides/index.astro`** — masonry layout, earthy tones, `comingSoon` support.
- **New placeholder guide** `src/content/guides/the-method.md` — "The Coffee Enema Method", `comingSoon: true`, order 0. Schema (`src/content.config.ts`) extended with `comingSoon` + `"the method"` level. **Content + PDF still to be written by Laura.**
- **`src/components/Header.astro`** — wordmark "BETTER OUT CO." (matches packaging), nav renamed **"Free Guides"**, persistent **Order** button.
- **Email capture** — modal in `src/layouts/Base.astro` gates every guide PDF download (asks email + consent, then downloads). Starter privacy page `src/pages/privacy.astro`.

### Brand truth (confirmed this session)
Palette = **chocolate brown · sand · sage** (NOT neon/black). Site/IG must be **BRIGHT, not beige**. Bold colour belongs in **small** moments (cards, accents, the sage quote band) — a full dark-moss section was tried and **rejected as "lost its classiness."** Packaging = "High Potency **GREEN (raw, low-roast)** Coffee — not for drinking, high-performance inner flow." Product sells **now** (coffee + kit + bag) in Cape Town shops.

### ⚠️ Go-live checklist — REVIEW WITH LAURA BEFORE PUSHING
1. **Email capture is NOT wired** — `FORM_ENDPOINT` in `src/layouts/Base.astro` is empty, so signups are **not saved**. Laura is choosing a provider (Kit / Mailchimp / Formspree). Either wire it first, or launch knowing emails aren't captured yet.
2. **Privacy page has `[placeholders]`** (`src/pages/privacy.astro`) — contact email + provider. POPIA: get wording reviewed.
3. **CIPC reg number** still `[pending]`/TODO in `src/components/Footer.astro` — needed before commercial trading.
4. **Custom domain** `betterout.co` still pending DNS (see Porkbun section below). Pushing deploys to the github.io URL; the custom domain needs the DNS records + `gh api pages cname`.
5. **Compliance voice** — wellness language only, no medical/cancer claims. Keep it that way.

### To go live (static site → GitHub Pages, from `main`)
```bash
cd ~/Projects/betterout.co
git status                  # review the change set above
npm run build               # confirm clean (currently passes)
git add -A
git commit -m "design: earthy redesign, product live, free guides + email capture"
git push                    # GitHub Actions deploys
gh run list --repo laurabuilds7/betterout.co --limit 3
```

---

## Three repos to keep straight

| Path | GitHub | Public? | What it is |
|---|---|---|---|
| `~/Projects/betterout.co` | `laurabuilds7/betterout.co` | **Public** | The marketing site you're looking at. Astro 5 + Tailwind 4 → GitHub Pages. |
| `~/Projects/better-out-co` | `laurabuilds7/better-out-co` | Private | Brand source assets: logos, flyer source, Porkbun `.env`. **Never commit anything from here into the public repo.** |
| `~/Projects/calmlybloom-site` | `laurabuilds7/calmlybloom-site` | Public | Laura's other site — currently OFFLINE pending SA compliance review. Don't touch unless Laura asks. |

---

## What's in the working tree right now

The `main` branch on GitHub has the **initial scaffold** (Astro site, 5 guides, deploy workflow). It was pushed earlier in this session and is live at https://laurabuilds7.github.io/betterout.co/.

Sitting **uncommitted** in the working tree is a substantial redesign:

- **Aesthetic pivot** from kraft/coffee/cream + Alfa Slab One slab serifs to **bone/linen/sand/clay/sage/espresso** + **Cormorant Garamond 300 + Inter**. Quiet-luxury wellness atelier — think Aman resort, Susanne Kaufmann, Tata Harper. Centred editorial spine, Roman numeral chapter markers, hairline rules, diamond ornaments, generous whitespace.
- **Sage accent** (`#6E8278`, eucalyptus) used as a single tasteful cool pop: numeral chapter markers (I, II, III), the dot in the `better·out` wordmark, the diamond at the centre of every ornament divider, the small bullet diamonds in feature lists. Clay (`#A87A55`) stays as the warm italic emphasis ("*than in.*", "*the kit*").
- Files touched: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/{Header,Footer,GuideCard}.astro`, all of `src/pages/`.

**Laura wants to preview locally and approve before this gets pushed live.**

To preview: `cd ~/Projects/betterout.co && npm run dev` → http://localhost:4321/.

---

## Why the github.io URL looks unstyled (it's not actually broken)

`https://laurabuilds7.github.io/betterout.co/` serves the site at the sub-path `/betterout.co/`. The site is configured with `site: "https://betterout.co"` (root path), so CSS link tags resolve to `/_astro/...` — which on the sub-path becomes `laurabuilds7.github.io/_astro/...` → 404.

This is **expected**. It will resolve itself the moment the custom domain `betterout.co` is wired up (because at root, the asset paths work). Do not "fix" it by adding `base:` to `astro.config.mjs` — that would break the custom domain.

To preview the styled version: use `npm run dev` (local).

---

## Punch list — what's left

In rough priority order:

### 1. Approve the redesign and push it live
- Open http://localhost:4321/ locally and review.
- If Laura approves, commit and push. Conventional Commit prefix: `design:` for the visual pivot.
- The GH Actions workflow runs automatically — check with `gh run list --repo laurabuilds7/betterout.co --limit 3`.

### 2. Get the custom domain live
This is currently **blocked on Laura toggling Porkbun API access for betterout.co**. Two paths:

**Path A — Laura toggles API access**, then Claude does it via API:
1. Laura: porkbun.com → log in → Domain Management → click **Details** on the `betterout.co` row → flip **API Access** to ON.
2. Claude: source the Porkbun creds from `~/Projects/better-out-co/.env` and create the DNS records.
   ```bash
   cd ~/Projects/better-out-co && source .env
   for ip in 185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153; do
     curl -s -X POST https://api.porkbun.com/api/json/v3/dns/create/betterout.co \
       -H "Content-Type: application/json" \
       -d "{\"apikey\":\"$PORKBUN_API_KEY\",\"secretapikey\":\"$PORKBUN_SECRET_KEY\",\"name\":\"\",\"type\":\"A\",\"content\":\"$ip\",\"ttl\":\"600\"}"
   done
   curl -s -X POST https://api.porkbun.com/api/json/v3/dns/create/betterout.co \
     -H "Content-Type: application/json" \
     -d "{\"apikey\":\"$PORKBUN_API_KEY\",\"secretapikey\":\"$PORKBUN_SECRET_KEY\",\"name\":\"www\",\"type\":\"CNAME\",\"content\":\"laurabuilds7.github.io\",\"ttl\":\"600\"}"
   ```
3. Then attach the custom domain to Pages: `gh api -X PUT /repos/laurabuilds7/betterout.co/pages -f cname=betterout.co`.
4. Wait ~10 min for DNS + cert provisioning, then check: `curl -sI https://betterout.co | head -3`.

**Path B — Laura adds DNS records manually** in the Porkbun web UI (faster if API toggle is hard):
- Same records: apex A → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`; `www` CNAME → `laurabuilds7.github.io`. TTL 600.
- Then run the `gh api` Pages command above.

### 3. Fill in the CIPC reg number
`src/components/Footer.astro` has `Reg. no. [pending]`. When Laura gives the CIPC registration number + registered address, search the footer for `TODO` and replace.

### 4. Future commerce / forms (Phase 2)
Anything that collects personal data (email signup, contact form, checkout) triggers POPIA in South Africa — needs a privacy policy first. Anything commercial (Stripe/Yoco/Shopify) is Phase 2 and needs a separate plan. The current site is intentionally form-free.

---

## Stack rules — don't break these

- **Tailwind 4 CSS-first config.** Theme tokens live in `@theme { ... }` inside `src/styles/global.css`. **Never add a `tailwind.config.{js,mjs,ts}` file** — v4 doesn't need one and mixing the two configs causes silent breakage.
- **Content lives in `src/content/guides/*.md`**, schema in `src/content.config.ts`. Each guide has a frontmatter `slug`, `pages`, `pdf`, `order`, `level`, `excerpt`. The home, library index, and individual guide pages all read from this single collection — don't duplicate guide metadata in components.
- **PDFs go in `public/guides/<slug>.pdf`** and are referenced as `/guides/<slug>.pdf` in frontmatter.
- **Voice / compliance**: "supports, eases, calms, nourishes" — never "cures, treats, heals (clinically), eliminates, detoxes you, removes toxins." Footer disclaimer must not be removed or softened. CIPC reg number must be in place before any commercial activity.
- **Don't switch hosting** (Vercel/Netlify/Cloudflare Pages), don't move DNS off Porkbun, don't delete `public/CNAME`, don't make the repo private (Pages-with-custom-domain on free plan requires a public repo), don't add analytics/forms/third-party scripts without explicit approval.

---

## Design system reference

Palette in `src/styles/global.css` under `@theme`:

| Token | Hex | Used for |
|---|---|---|
| `--color-bone` | `#F4EFE4` | Body background |
| `--color-bone-soft` | `#EDE7D7` | Section backgrounds, cards |
| `--color-linen` | `#E5DDC9` | Card hover |
| `--color-sand` | `#D4C8AE` | (Held in reserve) |
| `--color-clay` | `#A87A55` | Warm italic emphasis words |
| `--color-clay-deep` | `#7E5536` | Prose links on hover |
| `--color-sage` | `#6E8278` | **The pop.** Numerals, wordmark dot, ornament centres, list bullets |
| `--color-sage-deep` | `#4D5D55` | Reserved |
| `--color-sage-soft` | `#94A398` | Sage on dark backgrounds (footer wordmark dot) |
| `--color-espresso` | `#221A12` | Body text + dark sections |

Legacy `coffee/kraft/cream` tokens are aliased to the new palette — older class names like `text-coffee` still work but resolve to the new dark espresso. New code should prefer the new tokens.

Fonts loaded in `src/layouts/Base.astro`:
- **Cormorant Garamond** 300/400/500 + italic — `font-display` and `font-serif`. Use weight 300 for everything except prose links.
- **Inter** 300/400/500 — `font-sans`. Use for `.label` and `.label-wide` (uppercase wide-tracked small caps).

Custom utility classes in `src/styles/global.css`:
- `.display`, `.display-italic`, `.numeral` — Cormorant variants
- `.label`, `.label-wide` — Inter small caps (different letter-spacing)
- `.lede`, `.prose-body`, `.pull-quote` — body type scales
- `.btn-espresso`, `.btn-bone`, `.btn-outline`, `.btn-outline-cream`, `.link-quiet` — buttons
- `.card-quiet` — hairline-bordered card
- `.diamond`, `.rule-fine`, `.rule-centre`, `.hairline` — ornaments and dividers
- `.fade-up`, `.fade-up-{2,3,4}` — gentle hero entrance animation

---

## Common commands

```bash
# Daily dev
cd ~/Projects/betterout.co
npm run dev                                                  # http://localhost:4321
npm run build                                                # confirm clean build

# Commit + deploy
git status
git add <files>
git commit -m "design: shift to bone/sage/espresso palette + Cormorant"
git push                                                     # CI deploys to GH Pages

# Check the deploy
/opt/homebrew/bin/gh run list --repo laurabuilds7/betterout.co --limit 5
curl -sI https://laurabuilds7.github.io/betterout.co/        # always works (naked HTML)
curl -sI https://betterout.co                                # works once DNS is wired

# Check Porkbun API access status (will fail until Laura toggles)
cd ~/Projects/better-out-co && source .env
curl -s -X POST https://api.porkbun.com/api/json/v3/dns/retrieve/betterout.co \
  -H "Content-Type: application/json" \
  -d "{\"apikey\":\"$PORKBUN_API_KEY\",\"secretapikey\":\"$PORKBUN_SECRET_KEY\"}"
```

---

## How to brief future-you (or another Claude)

Paste this into a fresh Claude session that's working on this project:

> I'm Laura Weyel. I'm continuing work on Better Out Co. — a mould-free, lab-tested coffee enema brand I'm launching in Cape Town. The public marketing site lives at `~/Projects/betterout.co` (Astro 5 + Tailwind 4, deployed to GitHub Pages, custom domain `betterout.co` pending DNS).
>
> Before doing anything, please:
> 1. Read `~/Projects/betterout.co/HANDOFF.md` — full project state and punch list
> 2. Read `~/Projects/betterout.co/CLAUDE.md` — agent rules for this repo
> 3. Read the memory at `~/.claude/projects/-Users-lauraweyel/memory/MEMORY.md` and the files it points at
> 4. Run `git status` to see what's committed vs uncommitted
>
> Then tell me where things stand and what you'd suggest as the next step.
