import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    subtitle: z.string(),
    pages: z.number(),
    pdf: z.string(),
    excerpt: z.string(),
    order: z.number(),
    level: z.enum(["start here", "core", "advanced"]),
  }),
});

export const collections = { guides };
