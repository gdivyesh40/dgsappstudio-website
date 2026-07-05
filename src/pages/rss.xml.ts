import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getApps, primaryCategory } from '../lib/apps';
import { SITE } from '../consts';

/**
 * RSS 2.0 feed of the studio's apps, generated automatically from the content
 * collection. New Markdown file → new feed item, no extra work.
 */
export async function GET(context: APIContext) {
  const apps = await getApps();

  return rss({
    title: `${SITE.name} — Apps`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: false,
    items: apps.map((app) => ({
      title: app.data.title,
      description: app.data.description,
      link: `/apps/${app.slug}`,
      pubDate: app.data.releaseDate,
      categories: app.data.categories.length ? app.data.categories : [primaryCategory(app)],
    })),
    customData: `<language>en-us</language>`,
  });
}
