---
paths:
  - "app/lib/klaviyo/**"
  - "app/lib/admin-api/**"
  - "app/lib/customer/**"
  - "app/components/Analytics/**"
  - "app/routes/($locale).api.klaviyo.tsx"
---

# Third-Party Integration Conventions

## Active Integrations

| Integration | Directory | API Route | Key Env Vars |
|---|---|---|---|
| Klaviyo | `app/lib/klaviyo/` | `($locale).api.klaviyo.tsx` | `PUBLIC_KLAVIYO_API_KEY`, `PRIVATE_KLAVIYO_API_KEY`, `PUBLIC_KLAIVYO_REVISION` |
| Admin API | `app/lib/admin-api/` | None (used in loaders) | `PRIVATE_ADMIN_API_TOKEN` |
| Customer | `app/lib/customer/` | None (used in account routes) | `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` |

> **Known typo:** `PUBLIC_KLAIVYO_REVISION` — the env var is misspelled ("KLAIVYO" instead of "KLAVIYO"). Defaults to `2024-05-15`.

## Analytics (app/components/Analytics/)

Analytics integrations are conditionally loaded based on env vars:

| Platform | Env Var | Status |
|---|---|---|
| Blotout | `PUBLIC_BLOTOUT_EDGE_URL` | Conditional |
| Elevar | `PUBLIC_ELEVAR_SIGNING_KEY` | Conditional |
| GA4 | `PUBLIC_GA4_TAG_ID` | Conditional |
| Klaviyo | `PUBLIC_KLAVIYO_API_KEY` | Conditional |
| Meta Pixel | `PUBLIC_META_PIXEL_ID` | Conditional |
| TikTok Pixel | `PUBLIC_TIKTOK_PIXEL_ID` | Conditional |
| Fueled | Hardcoded | Disabled by default |

Fueled events (`app/components/Analytics/FueledEvents/`) are disabled by default (`enabledFueled = false` in Analytics.tsx). Enable when wiring up client-specific tracking.

## Conventions

- Each integration lives in its own `app/lib/{name}/` directory
- Server-side API calls go through a corresponding `api.{name}.tsx` route
- Client-side scripts load through `app/components/Analytics/` or via `useLoadScript()` hook
- Environment variables follow the pattern: `PRIVATE_` prefix for server-only, `PUBLIC_` for client-exposed
- Never expose private API keys to the client bundle — keep them in loaders/actions only
