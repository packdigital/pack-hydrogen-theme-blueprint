import {getSeoMeta} from '@shopify/hydrogen';

/**
 * Build a route's SEO meta tags, or a single `noindex` robots tag when the
 * route is rendering an error boundary.
 *
 * React Router passes `error` to a route's `meta` export whenever that route
 * (or a descendant without its own boundary) threw. Because `meta` is the one
 * place robots tags are produced — and a leaf route's `meta` replaces its
 * ancestors' — emitting `noindex` here keeps a transient error page out of the
 * search index without hardcoding a competing robots tag elsewhere in the
 * document head. The optional chaining on `loaderData` guards against the
 * errored match, whose `loaderData` is `undefined`.
 */
export function getRouteSeoMeta({
  matches,
  error,
}: {
  matches: readonly unknown[];
  error?: unknown;
}) {
  if (error) return [{name: 'robots', content: 'noindex'}];
  return (
    getSeoMeta(...matches.map((match) => (match as any)?.loaderData?.seo)) || []
  );
}
