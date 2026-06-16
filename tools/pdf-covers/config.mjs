// Per-guide cover config. Edit titles/subtitles/eyebrows/tones here, then
// run `npm run build:pdfs` to regenerate everything in public/guides/.
//
// Tones (matching site card palette):
//   sagelight #D8DEC9   sage #BAC4A4   moss #7C8A5C (cream text)
//   sand      #E6DAC1   nude #D2B79C   brown #8C6A4D (cream text)

export const guides = [
  {
    slug: "the-method",
    title: "The Coffee\nEnema Method",
    subtitle:
      "Your exact step-by-step ritual — from first setup to finishing calm.",
    eyebrow: "THE METHOD",
    tone: "brown",
    placeholder: true, // no source PDF yet — cover-only output
  },
  {
    slug: "kitchen-apothecary",
    title: "The Kitchen\nApothecary",
    subtitle:
      "The quiet medicine already growing on your windowsill & resting in your spice drawer.",
    eyebrow: "A CORE GUIDE",
    tone: "moss",
  },
  {
    slug: "nourished-littles",
    title: "Nourished\nLittles",
    subtitle:
      "Steady energy & real nourishment for your children — from first foods to the lunchbox.",
    eyebrow: "A CORE GUIDE",
    tone: "sagelight",
  },
  {
    slug: "steady",
    title: "Steady",
    subtitle:
      "Eating for calm, all-day energy — without crashes, cravings, or counting.",
    eyebrow: "START HERE",
    tone: "sand",
  },
  {
    slug: "low-tox-living",
    title: "Low-Tox\nLiving",
    subtitle:
      "Small, calm swaps to lighten your body’s daily load — without fear, without overwhelm.",
    eyebrow: "A CORE GUIDE",
    tone: "sage",
  },
  {
    slug: "roots",
    title: "Roots",
    subtitle:
      "Healing from the ground up — a deeper journey for the body ready to truly reset.",
    eyebrow: "AN ADVANCED GUIDE",
    tone: "nude",
  },
];

export const tones = {
  sagelight: { bg: "#D8DEC9", text: "dark" },
  sage:      { bg: "#BAC4A4", text: "dark" },
  moss:      { bg: "#7C8A5C", text: "light" },
  sand:      { bg: "#E6DAC1", text: "dark" },
  nude:      { bg: "#D2B79C", text: "dark" },
  brown:     { bg: "#8C6A4D", text: "light" },
};

export const colors = {
  cocoa: "#3C2B1D",
  cream: "#F4EEE1",
  sage:  "#84956F",
};
