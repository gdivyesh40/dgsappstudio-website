import { defineCollection, z } from 'astro:content';

/**
 * The `apps` content collection is the CMS for the whole site. Every app is a
 * single Markdown file in `src/content/apps/<slug>.md`. The filename becomes the
 * slug and therefore the URL (`/apps/<slug>`). App cards, detail pages, the
 * sitemap, the RSS feed and all JSON-LD are generated from this data — no
 * database, no backend, fully static.
 *
 * To add an app: create one Markdown file matching this schema. That's it.
 */
const apps = defineCollection({
  type: 'content', // Markdown body holds the long-form "About this app" copy.
  schema: z.object({
    // Identity
    title: z.string(),
    tagline: z.string(),
    description: z.string(),

    // Media / branding
    /** SVG path data on a 24×24 viewBox used as the app icon. */
    icon: z.string(),
    accent: z
      .object({ from: z.string(), to: z.string() })
      .default({ from: '#F59E0B', to: '#D97706' }),
    screenshots: z
      .array(z.object({ label: z.string(), src: z.string().optional() }))
      .default([]),

    // Store & links
    playStoreUrl: z.string().url().optional(),
    appStoreUrl: z.string().url().optional(),
    privacyUrl: z.string().optional(),
    supportUrl: z.string().default('/support'),

    // Release metadata
    status: z.enum(['live', 'beta', 'coming-soon']).default('coming-soon'),
    releaseDate: z.coerce.date().optional(),
    version: z.string().optional(),
    platforms: z.array(z.enum(['android', 'ios'])).default(['android']),

    // Taxonomy
    categories: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
    offline: z.boolean().default(false),

    // Rich, structured content
    highlights: z.array(z.string()).default([]),
    features: z
      .array(z.object({ title: z.string(), description: z.string(), icon: z.string() }))
      .default([]),
    roadmap: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          status: z.enum(['planned', 'in-progress', 'shipped']),
        }),
      )
      .default([]),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    changelog: z
      .array(
        z.object({
          version: z.string(),
          date: z.coerce.date(),
          notes: z.array(z.string()),
        }),
      )
      .default([]),

    // Listing controls
    featured: z.boolean().default(false),
    /** Lower numbers sort first in listings. */
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { apps };
