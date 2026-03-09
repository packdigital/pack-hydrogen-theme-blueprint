import type {Article} from '~/lib/types';
import {useLoadData, useLocale} from '~/hooks';

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

  const {data} = useLoadData<{articles: Article[]}>(
    fetchOnMount && handle
      ? `${pathPrefix}/api/articles?handle=${handle}&limit=${limit}`
      : null,
  );

  return data?.articles || null;
}
