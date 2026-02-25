# Playbook Reverse Proxy for Hydrogen Storefronts

## Why

Hydrogen stores load the Playbook SDK cross-origin from `heyplaybook.com`. Ad blockers and privacy tools can intercept these requests, causing 20-40% data loss for impression tracking and A/B testing.

The fix: route Playbook requests through the store's own domain (`yourdomain.com/apps/playbook/*` → `heyplaybook.com/api/*`), making them first-party and invisible to ad blockers.

## How It Works

1. The proxy route (`app/routes/apps.playbook.$.tsx`) catches all requests to `/apps/playbook/*`
2. `PlaybookSDK.tsx` loads the SDK from `/apps/playbook/sdk` instead of `heyplaybook.com`
3. The SDK auto-detects it was loaded from `/apps/playbook/` and routes all subsequent API calls through the same proxy path
4. SDK requests get cached (1 hour); API requests (tracking, hero data) pass through uncached

```
Browser → yourdomain.com/apps/playbook/sdk → heyplaybook.com/api/sdk
Browser → yourdomain.com/apps/playbook/api/hero → heyplaybook.com/api/hero
Browser → yourdomain.com/apps/playbook/api/track/impression → heyplaybook.com/api/track/impression
```

## Setup

### 1. Add the proxy route

Copy `app/routes/apps.playbook.$.tsx` into your project (already included in this blueprint).

### 2. Add environment variable types

In `env.d.ts`, add to the `Env` interface:

```typescript
PLAYBOOK_PLATFORM_URL?: string;
```

### 3. (Optional) Override backend URL

The proxy is enabled by default. To disable it, set `PUBLIC_PLAYBOOK_PROXY_ENABLED=false`.

By default the proxy forwards to `https://www.heyplaybook.com`. To override (e.g., for staging):

```
PLAYBOOK_PLATFORM_URL=https://staging.heyplaybook.com
```

### 5. Deploy and verify

1. Deploy to Oxygen
2. Open DevTools → Network tab
3. The SDK should load from `/apps/playbook/sdk` (same-origin)
4. Subsequent API calls should go through `/apps/playbook/api/*`
5. No cross-origin requests to `heyplaybook.com`

## Caching

| Path | Cache | Reason |
|------|-------|--------|
| `/apps/playbook/sdk` | `public, max-age=3600, s-maxage=3600` | SDK JS changes infrequently |
| `/apps/playbook/api/*` | `no-store` | Tracking and hero data must be fresh |

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| SDK still loads from `heyplaybook.com` | Proxy disabled | Remove `PUBLIC_PLAYBOOK_PROXY_ENABLED=false` or don't set it |
| 502 on `/apps/playbook/sdk` | Backend unreachable | Check `PLAYBOOK_PLATFORM_URL` or that `heyplaybook.com` is up |
| Hero not loading | Path mapping mismatch | Check that the route file is named `apps.playbook.$.tsx` exactly |
| TypeScript error on `context.env` | Missing type | Add `PLAYBOOK_PLATFORM_URL?: string` to `Env` in `env.d.ts` |
