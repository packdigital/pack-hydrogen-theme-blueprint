import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import type {Article} from '~/lib/types';
import {useLocale} from '~/hooks';

/**
 * Fetch articles by blog handle
 * @param handle - The handle of the blog
 * @param limit - The number of articles to fetch
 * @param fetchOnMount - Determines when to fetch
 * @returns articles
 * @example
 * ```js
 * const articles = useArticles('news', 6);
 * ```
 */

export function useArticles(
  handle: string | undefined | null = '',
  limit: number | undefined | null = 3,
  fetchOnMount = true,
) {
  const {pathPrefix} = useLocale();
  const fetcher = useFetcher<{articles: Article[]}>({
    key: `articles-by-blog-handle:${handle}:${pathPrefix}`,
  });

  useEffect(() => {
    if (!fetchOnMount || !handle || fetcher.data?.articles) return;
    const searchParams = new URLSearchParams({
      handle,
      limit: limit?.toString() || '3',
    });
    fetcher.load(`${pathPrefix}/api/articles?${searchParams}`);
  }, [fetchOnMount, handle, limit]);

  return fetcher.data?.articles || null;
}
