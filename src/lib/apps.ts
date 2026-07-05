import { getCollection, type CollectionEntry } from 'astro:content';

export type AppEntry = CollectionEntry<'apps'>;
export type AppStatus = AppEntry['data']['status'];

export const STATUS_LABEL: Record<AppStatus, string> = {
  live: 'Live',
  beta: 'Beta',
  'coming-soon': 'Coming Soon',
};

/** Hide drafts in production; show them while developing. */
const isVisible = (entry: AppEntry) =>
  import.meta.env.PROD ? !entry.data.draft : true;

/**
 * All published apps, sorted by `order`, then newest release, then title.
 * Single source of truth used by every listing, the sitemap and the RSS feed.
 */
export async function getApps(): Promise<AppEntry[]> {
  const apps = await getCollection('apps', isVisible);
  return apps.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    const ad = a.data.releaseDate?.getTime() ?? 0;
    const bd = b.data.releaseDate?.getTime() ?? 0;
    if (ad !== bd) return bd - ad;
    return a.data.title.localeCompare(b.data.title);
  });
}

/** The featured app (falls back to the first app) for the home page. */
export async function getFeaturedApp(): Promise<AppEntry | undefined> {
  const apps = await getApps();
  return apps.find((a) => a.data.featured) ?? apps[0];
}

/** Primary category label, used on cards. */
export const primaryCategory = (entry: AppEntry): string =>
  entry.data.categories[0] ?? 'App';

/** The canonical detail-page path for an app. */
export const appPath = (entry: AppEntry): string => `/apps/${entry.slug}`;
