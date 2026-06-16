// Build branded cover pages for each guide PDF.
//
//   sources/<slug>.pdf  →  drop page 1, prepend new branded cover  →  public/guides/<slug>.pdf
//   placeholder entries → cover-only PDF (no source content)
//
// Re-run after editing config.mjs:  npm run build:pdfs

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { guides, tones, colors } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCES = path.join(__dirname, "sources");
const FONTS = path.join(__dirname, "fonts");
const OUTPUT = path.resolve(__dirname, "..", "..", "public", "guides");

const A4 = { width: 595.28, height: 841.89 };

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return rgb(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255
  );
}

// Word-wrap a single paragraph to a max pixel width.
function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    const w = font.widthOfTextAtSize(trial, size);
    if (w > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = trial;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCenteredText(page, text, { y, font, size, color, tracking = 0 }) {
  const width = font.widthOfTextAtSize(text, size) + tracking * (text.length - 1);
  page.drawText(text, {
    x: (page.getWidth() - width) / 2,
    y,
    font,
    size,
    color,
    characterSpacing: tracking,
  });
}

// "BETTER OUT CO." with a sage period. Drawn char-by-char with
// explicit positions so the sage period sits flush against "CO".
function drawWordmark(page, { y, font, size, color, sage, tracking }) {
  const chars = [..."BETTER OUT CO."];
  const widths = chars.map((c) => font.widthOfTextAtSize(c, size));
  const totalWidth =
    widths.reduce((a, b) => a + b, 0) + (chars.length - 1) * tracking;
  let x = (page.getWidth() - totalWidth) / 2;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    page.drawText(c, {
      x,
      y,
      font,
      size,
      color: c === "." ? sage : color,
    });
    x += widths[i] + tracking;
  }
}

async function loadFonts(doc) {
  const [fraunces, frauncesItalic, inter] = await Promise.all([
    fs.readFile(path.join(FONTS, "Fraunces.ttf")),
    fs.readFile(path.join(FONTS, "Fraunces-Italic.ttf")),
    fs.readFile(path.join(FONTS, "Inter.ttf")),
  ]);
  return {
    display: await doc.embedFont(fraunces, { subset: true }),
    italic: await doc.embedFont(frauncesItalic, { subset: true }),
    label: await doc.embedFont(inter, { subset: true }),
  };
}

function buildCoverOn(page, { title, subtitle, eyebrow, tone, fonts }) {
  const t = tones[tone];
  const bg = hexToRgb(t.bg);
  const isDark = t.text === "light";
  const fg = hexToRgb(isDark ? colors.cream : colors.cocoa);
  const sage = hexToRgb(colors.sage);
  // Muted foreground: same hue as fg but visually lighter via alpha.
  // pdf-lib doesn't do alpha on text, so use a softened palette instead.
  const muted = isDark
    ? hexToRgb(colors.cream) // keep cream readable on dark bgs
    : hexToRgb(colors.cocoa);

  const W = page.getWidth();
  const H = page.getHeight();

  // 1. solid tile background
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: bg });

  // 2. eyebrow — Inter caps, very wide tracking, near top
  const eyebrowSize = 9;
  drawCenteredText(page, eyebrow, {
    y: H - 110,
    font: fonts.label,
    size: eyebrowSize,
    color: muted,
    tracking: 3.6, // ~0.4em
  });

  // 3. title — Fraunces, multi-line, centered, vertically centered-ish
  const titleLines = title.split("\n");
  // Auto-shrink if single longest line exceeds safe width.
  const maxTitleWidth = W - 120;
  let titleSize = titleLines.length > 1 ? 64 : 88;
  while (
    Math.max(...titleLines.map((l) => fonts.display.widthOfTextAtSize(l, titleSize))) >
      maxTitleWidth &&
    titleSize > 28
  ) {
    titleSize -= 2;
  }
  const titleLineHeight = titleSize * 1.05;
  const titleBlockHeight = titleLineHeight * titleLines.length;
  // Place title slightly above vertical centre, leave room for subtitle below.
  const titleTopY = H / 2 + titleBlockHeight / 2 + 20;
  titleLines.forEach((line, i) => {
    drawCenteredText(page, line, {
      y: titleTopY - (i + 1) * titleLineHeight + titleSize * 0.25,
      font: fonts.display,
      size: titleSize,
      color: fg,
    });
  });

  // 4. subtitle — Fraunces italic, wrapped (no ornament between; the type holds)
  const subtitleSize = 16;
  const subtitleLines = wrapText(subtitle, fonts.italic, subtitleSize, W - 160);
  const subtitleLineHeight = subtitleSize * 1.45;
  const subtitleTopY = titleTopY - titleBlockHeight - 44;
  subtitleLines.forEach((line, i) => {
    drawCenteredText(page, line, {
      y: subtitleTopY - i * subtitleLineHeight,
      font: fonts.italic,
      size: subtitleSize,
      color: fg,
    });
  });

  // 6. bottom wordmark + a hairline rule above it
  const wordmarkY = 70;
  const ruleY = wordmarkY + 30;
  const ruleWidth = 36;
  page.drawRectangle({
    x: (W - ruleWidth) / 2,
    y: ruleY,
    width: ruleWidth,
    height: 0.6,
    color: muted,
    opacity: 0.55,
  });
  drawWordmark(page, {
    y: wordmarkY,
    font: fonts.label,
    size: 9,
    color: muted,
    sage: isDark ? hexToRgb(colors.cream) : sage,
    tracking: 2.6, // ~0.3em
  });
}

async function buildGuide(guide) {
  const outPath = path.join(OUTPUT, `${guide.slug}.pdf`);
  const out = await PDFDocument.create();
  out.registerFontkit(fontkit);
  const fonts = await loadFonts(out);

  if (guide.placeholder) {
    // Cover-only PDF (no source content yet).
    const page = out.addPage([A4.width, A4.height]);
    buildCoverOn(page, { ...guide, fonts });
    const bytes = await out.save();
    await fs.writeFile(outPath, bytes);
    return { slug: guide.slug, pages: 1, kind: "placeholder" };
  }

  const sourceBytes = await fs.readFile(
    path.join(SOURCES, `${guide.slug}.pdf`)
  );
  const source = await PDFDocument.load(sourceBytes);
  const sourceIndices = source.getPageIndices();

  // Use the source's page-1 size for the cover so it matches the doc.
  const firstSourcePage = source.getPage(0);
  const { width: srcW, height: srcH } = firstSourcePage.getSize();
  const coverPage = out.addPage([srcW, srcH]);
  buildCoverOn(coverPage, { ...guide, fonts });

  // Copy source pages 2..end (drop the existing cover).
  const tailIndices = sourceIndices.slice(1);
  if (tailIndices.length > 0) {
    const copied = await out.copyPages(source, tailIndices);
    copied.forEach((p) => out.addPage(p));
  }

  const bytes = await out.save();
  await fs.writeFile(outPath, bytes);
  return {
    slug: guide.slug,
    pages: 1 + tailIndices.length,
    kind: "rebuilt",
  };
}

async function main() {
  await fs.mkdir(OUTPUT, { recursive: true });
  const results = [];
  for (const guide of guides) {
    try {
      const r = await buildGuide(guide);
      results.push(r);
      console.log(`  ✓ ${r.slug}  (${r.kind}, ${r.pages} pp)`);
    } catch (err) {
      console.error(`  ✗ ${guide.slug}:`, err.message);
      throw err;
    }
  }
  console.log(`\nBuilt ${results.length} PDFs → ${path.relative(process.cwd(), OUTPUT)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
