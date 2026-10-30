# CLAUDE.md

Pack Hydrogen theme blueprint: a Shopify Hydrogen storefront (React Router 7, React 19) with sections and site settings managed in Pack's CMS.

## Commands

- `npm run dev` — local dev server on port 8080
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` / `npm run format:check`
- `npm run codegen` — regenerate Storefront API types after changing GraphQL

## Repository invariants

These hold across the codebase; a change that breaks one is a bug even when it builds.

### Hydrogen and React Router

- Loaders and actions return plain objects. Use `data()` from `react-router` only when a response needs a status or headers. `json()` and `defer()` are removed in React Router 7.
- Storefront and Pack queries pass a cache strategy (`CacheShort()`, `CacheLong()`, or `CacheNone()` for personalized data). A query without one is uncached on every SSR request.
- Routes live under the `($locale)` prefix so they resolve in every market.
- SEO metadata is built with `seoPayload` in `app/lib/server-utils/seo.server.ts` and rendered through `getSeoMeta`.
- Images render through `~/components/Image`, which wraps Hydrogen's `Image` for Shopify CDN sizing. Don't use raw `<img>` for Shopify-hosted media.
- Cart reads and mutations go through `useCart()` from `~/hooks`, not direct fetches to the Storefront API.

### Pack CMS sections

- Every section is registered in `app/sections/index.tsx`.
- Section content comes from the `cms` prop; site-wide settings come from `useSettings()`. Don't mix the two.
- A schema field with `component: 'group'` needs a group-level `defaultValue`. Without one, the Customizer crashes when the group has no saved data.
- Date fields in schemas default to a valid ISO date string, never `''` or `null`, or the Customizer's date picker throws.
- Page queries fetch sections with cursor pagination (`sections(first: 25, after: $cursor)`). Keep new page queries on the same pattern so long pages aren't truncated.

### Public repository

This repo is public. Code, comments, commit messages, and PR text must not name client brands, domains, or internal tools, and must never contain secrets.
