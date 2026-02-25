# Playbook Integration Guide for Hydrogen Storefronts

[Playbook](https://www.heyplaybook.com) turns your ad creative into personalized, on-brand landing page experiences — live in minutes, with built-in A/B testing to measure conversion lift. This guide covers how to integrate Playbook into a Hydrogen storefront.

> This blueprint already includes all Playbook integration code. Use this guide as a reference for how it works, or follow the steps to add Playbook to an existing Hydrogen store.

---

## Files Overview

| File | Purpose |
|------|---------|
| `app/components/Document/PlaybookSDK.tsx` | SDK loader + anti-flicker script |
| `app/routes/apps.playbook.$.tsx` | Reverse proxy route (first-party SDK loading) |
| `app/routes/($locale).cart.$lines.tsx` | Direct checkout route with Playbook attribution |
| `app/root.tsx` | Root loader detects Playbook URL params |
| `app/components/Document/Document.tsx` | Renders `<PlaybookSDK>` in `<head>` |
| `env.d.ts` | TypeScript types for Playbook env vars |

---

## Step 1: PlaybookSDK Component

Create `app/components/Document/PlaybookSDK.tsx`:

```tsx
export function PlaybookSDK({
  ENV,
  hasPlaybookParams,
}: {
  ENV: Record<string, string>;
  hasPlaybookParams?: boolean;
}) {
  if (!ENV.PUBLIC_PLAYBOOK_SHOP_ID) return null;

  // Loads SDK through the store's own domain via the proxy route,
  // making requests first-party and invisible to ad blockers.
  // Set PUBLIC_PLAYBOOK_PROXY_ENABLED=false to load directly from heyplaybook.com.
  const useProxy = ENV.PUBLIC_PLAYBOOK_PROXY_ENABLED !== 'false';
  const sdkUrl = useProxy
    ? '/apps/playbook/sdk'
    : 'https://www.heyplaybook.com/sdk/playbook.js';

  const revealScript = `
    (function(){
      function reveal() {
        document.documentElement.classList.add('pb-ready');
        if (window.__pbFlickerTimeout) {
          clearTimeout(window.__pbFlickerTimeout);
          window.__pbFlickerTimeout = null;
        }
      }
      ${hasPlaybookParams ? 'window.__pbFlickerTimeout = setTimeout(reveal, 3000);' : ''}
      window.Playbook = window.Playbook || {};
      window.Playbook.pageReady = reveal;
    })();
  `;

  return (
    <>
      {hasPlaybookParams && (
        <style
          id="pb-anti-flicker"
          dangerouslySetInnerHTML={{
            __html:
              'html:not(.pb-ready){opacity:0!important}html.pb-ready{opacity:1!important;transition:opacity 0.3s ease-in!important}',
          }}
        />
      )}
      <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      <script src={sdkUrl} data-shop-id={ENV.PUBLIC_PLAYBOOK_SHOP_ID} async />
    </>
  );
}
```

**Anti-flicker:** When Playbook URL params are present (`_pv=`, `_ptid=`, etc.), the page is hidden until the SDK reveals it. This prevents a flash of the original page before the experience renders. The 3-second timeout is a safety fallback.

**Important:** This component must render inside `<head>`, not `<body>`.

---

## Step 2: Root Loader — Detect Playbook Params

In `app/root.tsx`, add to the loader function:

```tsx
const requestSearch = new URL(request.url).search;
const hasPlaybookParams =
  requestSearch.includes('_pv=') ||
  requestSearch.includes('pbk=') ||
  requestSearch.includes('pb_mode=brand_preview') ||
  requestSearch.includes('_preview=true');

return {
  // ... existing loader data
  hasPlaybookParams,
};
```

**Important:** `hasPlaybookParams` must be computed in the root loader, not via `useLocation()`. Using `useLocation()` in the Document component causes re-renders on every client-side navigation that break React Router.

---

## Step 3: Render in Document Head

In your Document component (e.g., `app/components/Document/Document.tsx`):

```tsx
import { PlaybookSDK } from './PlaybookSDK';

// Inside the component:
const { ENV, hasPlaybookParams } = useRootLoaderData();

<head>
  {/* ... other head elements ... */}
  <PlaybookSDK ENV={ENV} hasPlaybookParams={hasPlaybookParams} />
</head>
```

---

## Step 4: Proxy Route

The proxy route makes all Playbook requests first-party — they go through the store's own domain instead of `heyplaybook.com`. This avoids ad blockers that block cross-origin tracking scripts (est. 20-40% data loss without it).

Copy `app/routes/apps.playbook.$.tsx` into your project. This catch-all route handles:

```
yourdomain.com/apps/playbook/sdk          → heyplaybook.com/api/sdk
yourdomain.com/apps/playbook/api/hero     → heyplaybook.com/api/hero
yourdomain.com/apps/playbook/api/track/*  → heyplaybook.com/api/track/*
```

The SDK auto-detects that it was loaded from `/apps/playbook/` and routes all subsequent API calls through the same proxy — no additional configuration needed.

**Caching:** SDK responses are cached for 1 hour. API responses (tracking, hero data) are not cached.

---

## Step 5: Environment Variables

### Required

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| `PUBLIC_PLAYBOOK_SHOP_ID` | Identifies your store to Playbook | Playbook dashboard → Settings |

### Required for Cart Attribution

The SDK needs these to attach attribution data to Shopify carts. These are standard Hydrogen env vars — just make sure they're exposed via `window.ENV` in the root loader.

| Variable | Purpose |
|----------|---------|
| `PUBLIC_STOREFRONT_API_TOKEN` | Storefront API access token |
| `PUBLIC_STORE_DOMAIN` | The `.myshopify.com` domain |

### Optional

| Variable | Type | Purpose |
|----------|------|---------|
| `PUBLIC_PLAYBOOK_PROXY_ENABLED` | Public | Proxy is on by default. Set to `'false'` to disable. |
| `PLAYBOOK_PLATFORM_URL` | Private | Override the Playbook backend URL (used by the proxy route). Defaults to `https://www.heyplaybook.com`. |

### TypeScript Types

In `env.d.ts`, add to the `Env` interface:

```typescript
PLAYBOOK_PLATFORM_URL?: string;
```

---

## Step 6: Content Security Policy (CSP)

If your store enforces a CSP (in `entry.server.tsx`), add these directives:

```
script-src:   https://www.heyplaybook.com
connect-src:  https://www.heyplaybook.com  https://*.myshopify.com
img-src:      https://cdn.shopify.com  https://placehold.co
frame-src:    https://www.heyplaybook.com
```

> With the proxy enabled (default), `script-src` and `connect-src` for `heyplaybook.com` are only needed as a fallback. The proxy makes SDK and API requests same-origin.

---

## Step 7: Cart Attribution for Direct Checkout Routes

The Playbook SDK automatically injects cart attributes (`pb_variant__`, `pb_impression_id__`, `pb_test_id__`) on standard add-to-cart flows. However, **server-side routes that create a cart and redirect straight to checkout bypass the SDK entirely** — the page never renders client-side, so the SDK's attribution never runs.

This blueprint's `($locale).cart.$lines.tsx` already includes the fix. If your store has additional direct-checkout routes (e.g., "buy now" endpoints, quick checkout), apply the same pattern:

```tsx
/**
 * Playbook A/B testing attribution.
 * The SDK sets cookies when a visitor lands on a Playbook experience.
 * Server-side routes that create a cart and redirect to checkout bypass
 * the SDK's client-side injection. Read the cookies and inject manually.
 */
function getCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
```

Then in your loader, after `cart.create()`:

```tsx
// Read Playbook attribution cookies
const pbVariant = getCookie(request, '_pb_variant');
const pbImpressionId = getCookie(request, '_pb_impression_id');
const pbTestId = getCookie(request, '_pb_test_id');

// ... cart.create() ...

// Inject as private cart attributes (double-underscore suffix hides
// them from customers but persists to the order's note_attributes)
if (pbVariant && pbImpressionId && pbTestId) {
  await cart.updateAttributes([
    {key: 'pb_variant__', value: pbVariant},
    {key: 'pb_impression_id__', value: pbImpressionId},
    {key: 'pb_test_id__', value: pbTestId},
  ]);
}
```

**When this is NOT needed:** If a checkout route is client-side (uses `useCart().cartCreate()` and navigates to `/cart` instead of redirecting to checkout), the SDK has time to inject attributes before the user reaches checkout.

---

## Verification

After setup, verify:

- [ ] SDK loads in Network tab (`/apps/playbook/sdk` returns 200)
- [ ] No cross-origin requests to `heyplaybook.com` (proxy is working)
- [ ] Visit a test link — page hides briefly then reveals with the experience
- [ ] No CSP errors in console
- [ ] Cart attribution: after adding to cart via a test link, cart attributes include `pb_variant__`, `pb_impression_id__`, `pb_test_id__`
- [ ] Direct checkout attribution: use a `/cart/variant:qty` link after visiting a Playbook test link — order should have Playbook attributes

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| SDK doesn't load | Missing shop ID | Set `PUBLIC_PLAYBOOK_SHOP_ID` env var |
| SDK loads from `heyplaybook.com` instead of same-origin | Proxy disabled | Remove `PUBLIC_PLAYBOOK_PROXY_ENABLED=false` or don't set it |
| 502 on `/apps/playbook/sdk` | Backend unreachable | Check `PLAYBOOK_PLATFORM_URL` or that `heyplaybook.com` is up |
| Hero doesn't render | Test not on this environment | Verify `PLAYBOOK_PLATFORM_URL` points to the correct Playbook deployment |
| Page flashes before experience | Anti-flicker not working | Ensure `PlaybookSDK` is in `<head>` and `hasPlaybookParams` is from root loader (not `useLocation`) |
| Cart attribution missing | Env vars not exposed | Verify `PUBLIC_STOREFRONT_API_TOKEN` and `PUBLIC_STORE_DOMAIN` are in `window.ENV` |
| Direct checkout attribution missing | Server-side route not reading cookies | Add Playbook cookie reading to `cart.$lines.tsx` (see Step 7) |
| CSP errors in console | Missing directives | Add `heyplaybook.com` to `script-src` and `connect-src` |
