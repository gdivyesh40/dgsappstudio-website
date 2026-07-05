// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

// The site is served from a custom domain (dgsappstudio.com), so the base
// path is the root. If you ever deploy to `user.github.io/repo` without a
// custom domain, set `base: '/repo-name'` and keep `site` in sync.
export default defineConfig({
  site: 'https://dgsappstudio.com',
  base: '/',
  trailingSlash: 'ignore',
  output: 'static',
  // Prefetch internal links on hover for instant navigation. The prefetch
  // script is tiny and only fetches on intent, so it does not bloat the bundle.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.7,
      lastmod: new Date(),
      // Give the homepage top priority; legal pages change rarely.
      serialize(item) {
        if (item.url === 'https://dgsappstudio.com/') {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          item.priority = 0.4;
          item.changefreq = ChangeFreqEnum.YEARLY;
        } else if (item.url.includes('/apps/')) {
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
