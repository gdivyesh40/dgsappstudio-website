/**
 * Global, framework-agnostic site configuration.
 * This is the single source of truth for brand metadata, contact addresses,
 * and social links. Import from here instead of hard-coding strings in pages.
 */

export const SITE = {
  name: 'DGS App Studio',
  shortName: 'DGS Studio',
  domain: 'dgsappstudio.com',
  url: 'https://dgsappstudio.com',
  tagline: 'Building Beautiful Mobile Experiences',
  description:
    'DGS App Studio is a mobile app development studio building modern Android applications focused on religion, utilities, productivity and festivals.',
  locale: 'en',
  themeColor: '#D97706',
  // TODO(launch): confirm the studio's founding year for the copyright/JSON-LD.
  founded: 2024,
  // TODO(launch): replace with a real 1200×630 PNG at /og-image.png — social
  // platforms (Facebook/LinkedIn/X) do NOT render SVG share images. See LAUNCH_CHECKLIST.md.
  ogImage: '/og-image.svg',
} as const;

// TODO(launch): these mailboxes must exist and be monitored before launch.
// They are published on the site and submitted to Google Play. See GOOGLE_PLAY_SETUP.md.
export const CONTACT = {
  support: 'gdivyesh40@gmail.com',
  privacy: 'gdivyesh40@gmail.com',
  general: 'gdivyesh40@gmail.com',
} as const;

// TODO(launch): create these accounts (or remove the links) before launch — the
// footer renders each one. Update the Twitter handle in BaseHead.astro to match `x`.
export const SOCIAL = {
  github: 'https://github.com/dgsappstudio',
  x: 'https://x.com/dgsappstudio',
  linkedin: 'https://www.linkedin.com/company/dgsappstudio',
  email: `mailto:${CONTACT.general}`,
} as const;
