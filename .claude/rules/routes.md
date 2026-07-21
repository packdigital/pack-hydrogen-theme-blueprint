---
paths:
  - "app/routes/**"
---

# Route Conventions

- File-based routing via React Router 7 (`@react-router/fs-routes`)
- All customer-facing routes use `($locale)` optional prefix for i18n
- Route modules can export: `loader`, `action`, `meta`, `links`, `headers`, `shouldRevalidate`
- The `react-refresh/only-export-components` ESLint rule is active — route files are exempt for the exports listed above, but other non-component exports will error

## Data Fetching

Three data sources available in loaders via `context`:

| Source | Client | Usage |
|---|---|---|
| `context.storefront` | Shopify Storefront API | Products, collections, cart, search |
| `context.pack` | Pack CMS | Page content, site settings |
| `context.admin` | Shopify Admin API | Draft/preview products, metafields (optional — only available if `PRIVATE_ADMIN_API_TOKEN` is set) |

Additional context: `session`, `env`, `oxygen`, `cache`, `waitUntil`, `cart`

## Caching

- `CacheShort()` — dynamic content (products, search results)
- `CacheLong()` — stable content (pages, collection metadata)
- Cache is backed by Oxygen worker cache (`caches.open('hydrogen')`)

## API Routes

API routes (`api.*.tsx`) are server-only JSON endpoints — no React component export. Return `Response` or `json()`.

Current API routes: articles, cart, collection, countries, klaviyo, predictive-search, product-by-id, product, products, recommendations, redirect, reviews, search

## Common Pitfalls

- Missing `($locale)` prefix breaks locale routing
- `shouldRevalidate` in root.tsx prevents unnecessary refetches — root data may be stale during SPA navigations
- `context.admin` is conditionally available — always check before using. It requires `PRIVATE_ADMIN_API_TOKEN` env var to be set.
