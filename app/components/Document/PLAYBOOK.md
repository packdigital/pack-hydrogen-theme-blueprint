# Playbook Integration Guide for Hydrogen Storefronts

[Playbook](https://www.heyplaybook.com) turns your ad creative into personalized, on-brand landing page experiences — live in minutes, with built-in A/B testing to measure conversion lift. This guide covers how to integrate Playbook into a Hydrogen storefront.

> This blueprint already includes all Playbook integration code. Use this guide as a reference for how it works, or follow the steps to add Playbook to an existing Hydrogen store.

---

## Files Overview

| File | Purpose |
|------|---------|
| `app/components/Document/PlaybookSDK.tsx` | SDK loader + anti-flicker script |
| `app/routes/apps.playbook.$.tsx` | Reverse proxy route (first-party API calls) |
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

  // Proxy enabled by default — routes API calls through the store's own domain,
  // making requests first-party and invisible to ad blockers.
  // Set PUBLIC_PLAYBOOK_PROXY_ENABLED=false to send API calls direct to heyplaybook.com.
  const useProxy = ENV.PUBLIC_PLAYBOOK_PROXY_ENABLED !== 'false';
  const sdkUrl = ENV.PUBLIC_PLAYBOOK_SDK_URL || 'https://cdn.heyplaybook.com/playbook.js';
  const apiEndpoint = useProxy
    ? '/apps/playbook'
    : 'https://www.heyplaybook.com';

  // Set PUBLIC_PLAYBOOK_CONSENT_REQUIRED=true only if this store runs a consent
  // manager (see "Cookie consent" below). Leave unset on stores with no CMP.
  const consentRequired = ENV.PUBLIC_PLAYBOOK_CONSENT_REQUIRED === 'true';

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
      <script
        src={sdkUrl}
        data-pb-config={JSON.stringify({
          shopId: ENV.PUBLIC_PLAYBOOK_SHOP_ID,
          apiEndpoint,
        })}
        // Present only when a consent manager runs on this store (see "Cookie
        // consent" below). Omitted entirely otherwise.
        data-pb-consent={consentRequired ? 'required' : undefined}
        async
      />
    </>
  );
}
```

**How it works:**
- The SDK JS bundle loads from `cdn.heyplaybook.com` (Cloudflare R2 CDN)
- The `data-pb-config` attribute tells the SDK where to send API calls — either through the proxy (first-party, default) or direct to `heyplaybook.com`
- The `data-pb-consent` attribute (present only when `PUBLIC_PLAYBOOK_CONSENT_REQUIRED=true`) gates tracking on the shopper's cookie-consent choice — see [Cookie consent](#cookie-consent-cmp) below
- Anti-flicker: When Playbook URL params are present (`_pv=`, `_ptid=`, etc.), the page is hidden until the SDK reveals it. The 3-second timeout is a safety fallback.

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

The proxy route makes Playbook API calls first-party — they go through the store's own domain instead of `heyplaybook.com`. This avoids ad blockers that block cross-origin tracking scripts (est. 20-40% data loss without it).

Copy `app/routes/apps.playbook.$.tsx` into your project. This catch-all route handles:

```
yourdomain.com/apps/playbook/api/hero     → heyplaybook.com/api/hero
yourdomain.com/apps/playbook/api/track/*  → heyplaybook.com/api/track/*
```

The SDK reads `apiEndpoint` from the `data-pb-config` attribute and routes all API calls through the proxy automatically.

**Note:** The SDK JS bundle loads directly from the CDN (`cdn.heyplaybook.com`) — only API calls go through the proxy.

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
| `PUBLIC_PLAYBOOK_PROXY_ENABLED` | Public | Proxy is on by default. Set to `'false'` to disable (API calls go direct to heyplaybook.com). |
| `PUBLIC_PLAYBOOK_SDK_URL` | Public | Override the SDK JS bundle URL. Defaults to `https://cdn.heyplaybook.com/playbook.js`. Useful for pinning to a specific version. |
| `PUBLIC_PLAYBOOK_CONSENT_REQUIRED` | Public | Set to `'true'` **only if this store runs a cookie-consent manager** (Transcend Airgap, OneTrust, Shopify's own banner, …). Gates tracking on the shopper's choice. Leave unset on stores with no CMP. See [Cookie consent](#cookie-consent-cmp). |
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
script-src:   https://cdn.heyplaybook.com
connect-src:  https://www.heyplaybook.com  https://*.myshopify.com
img-src:      https://cdn.shopify.com  https://placehold.co
frame-src:    https://www.heyplaybook.com
```

> With the proxy enabled (default), `connect-src` for `heyplaybook.com` is only needed as a fallback. The proxy makes API requests same-origin. The SDK JS bundle always loads from `cdn.heyplaybook.com`.

---

## Cookie consent (CMP)

**Only relevant if this store runs a consent manager.** Skip this section entirely if it doesn't — the SDK works unchanged and this is a no-op.

Playbook gates all tracking on **Shopify's Customer Privacy API**. Any CMP that writes to that API — Transcend Airgap, OneTrust, Shopify's own cookie banner — works with no extra integration; we read Shopify's API and never talk to the CMP directly.

**What's gated, and what isn't:**
- **Rendering the experience is never gated.** A shopper who declines still sees the experience — they clicked an ad for it.
- **Tracking is gated.** When a shopper declines analytics consent, no impression is recorded, no attribution cookies are set, and no cart attributes are written.

**Turn it on:**

```bash
PUBLIC_PLAYBOOK_CONSENT_REQUIRED=true
```

That adds `data-pb-consent="required"` to the SDK script tag, which tells the SDK to **wait** for Shopify's Customer Privacy API before making any tracking decision.

**Why the flag is needed on headless stores.** The SDK can auto-detect a consent system (via `window.Shopify` or the `_tracking_consent` cookie) — but on Hydrogen the CMP often initializes `Shopify.customerPrivacy` *after* the SDK boots, and a first-time visitor has no `_tracking_consent` cookie yet. Without the flag, that first ad-click pageview could be recorded before the banner is answered (the SDK fails open when it sees no consent system, per [Shopify's guidance](https://shopify.dev/docs/api/customer-privacy)). The flag removes that race by making the SDK wait for the API.

Leave the flag **unset** on stores with no CMP — there's nothing to wait for, and fail-open is correct there.

---

## Step 7: Cart Attribution for Direct Checkout Routes

The Playbook SDK automatically injects cart attributes on standard add-to-cart flows. However, **server-side routes that create a cart and redirect straight to checkout bypass the SDK entirely** — the page never renders client-side, so the SDK's attribution never runs.

Playbook sets two attribution cookie shapes, depending on what the visitor landed on:

| Visit type | Cookies set |
|------------|-------------|
| Test (legacy) | `_pb_impression_id`, `_pb_variant`, `_pb_test_id` |
| Experiment (A/B experiences) | `_pb_impression_id`, `_pb_variant`, `_pb_experiment_id`, `_pb_arm_id` |

An experiment visit deliberately clears `_pb_test_id`, so direct-checkout attribution must handle both shapes — a `_pb_test_id`-only implementation writes nothing for experiment visitors.

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
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    // Malformed encoding — treat as absent rather than 500 the checkout link
    return null;
  }
}

function getPlaybookCartAttributes(
  request: Request,
): Array<{key: string; value: string}> {
  const impressionId = getCookie(request, '_pb_impression_id');
  const variant = getCookie(request, '_pb_variant');
  if (!impressionId || !variant) return [];

  const attributes = [
    {key: 'pb_impression_id__', value: impressionId},
    {key: 'pb_variant__', value: variant},
  ];

  const testId = getCookie(request, '_pb_test_id');
  if (testId) attributes.push({key: 'pb_test_id__', value: testId});

  const experimentId = getCookie(request, '_pb_experiment_id');
  const armId = getCookie(request, '_pb_arm_id');
  if (experimentId && armId) {
    attributes.push(
      {key: 'pb_experiment_id__', value: experimentId},
      {key: 'pb_arm_id__', value: armId},
    );
  }

  return attributes;
}
```

Then pass the attributes into `cart.create()` — creating the cart with the
attributes already on it is atomic and saves a round-trip before the checkout
redirect:

```tsx
// Read Playbook attribution cookies and inject as private cart attributes
// (double-underscore suffix hides them from customers but persists to the
// order's note_attributes)
const playbookAttributes = getPlaybookCartAttributes(request);

const result = await cart.create({
  lines: linesMap,
  discountCodes: discountArray,
  ...(playbookAttributes.length ? {attributes: playbookAttributes} : {}),
});
```

**When this is NOT needed:** If a checkout route is client-side (uses `useCart().cartCreate()` and navigates to `/cart` instead of redirecting to checkout), the SDK has time to inject attributes before the user reaches checkout.

---

## Verification

After setup, verify:

- [ ] SDK loads from `cdn.heyplaybook.com/playbook.js` in Network tab (200)
- [ ] API calls go through `/apps/playbook/api/*` (not direct to heyplaybook.com)
- [ ] Visit a test link — page hides briefly then reveals with the experience
- [ ] No CSP errors in console
- [ ] Cart attribution: after adding to cart via a test link, cart attributes include `pb_impression_id__`, `pb_variant__`, and `pb_test_id__` (or `pb_experiment_id__` + `pb_arm_id__` for an experiment link)
- [ ] Direct checkout attribution: use a `/cart/variant:qty` link after visiting a Playbook test link — order should have Playbook attributes
- [ ] Consent (only if a CMP runs): with `PUBLIC_PLAYBOOK_CONSENT_REQUIRED=true`, decline analytics in the banner then load a test link — the experience renders but no `_pb_impression_id` cookie is set and no impression is recorded; accept, and both appear

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| SDK doesn't load | Missing shop ID | Set `PUBLIC_PLAYBOOK_SHOP_ID` env var |
| API calls go to `cdn.heyplaybook.com` (CORS error) | Missing `data-pb-config` | Ensure the script tag uses `data-pb-config` with `apiEndpoint` (not `data-shop-id`) |
| 502 on `/apps/playbook/api/*` | Backend unreachable | Check `PLAYBOOK_PLATFORM_URL` or that `heyplaybook.com` is up |
| Hero doesn't render | Test not on this environment | Verify `PLAYBOOK_PLATFORM_URL` points to the correct Playbook deployment |
| Page flashes before experience | Anti-flicker not working | Ensure `PlaybookSDK` is in `<head>` and `hasPlaybookParams` is from root loader (not `useLocation`) |
| Cart attribution missing | Env vars not exposed | Verify `PUBLIC_STOREFRONT_API_TOKEN` and `PUBLIC_STORE_DOMAIN` are in `window.ENV` |
| Direct checkout attribution missing | Server-side route not reading cookies | Add Playbook cookie reading to `cart.$lines.tsx` (see Step 7) |
| CSP errors in console | Missing directives | Add `cdn.heyplaybook.com` to `script-src` and `heyplaybook.com` to `connect-src` |
| Tracking still fires after a shopper declines | `PUBLIC_PLAYBOOK_CONSENT_REQUIRED` not set, or the CMP isn't writing to Shopify's Customer Privacy API | Set `PUBLIC_PLAYBOOK_CONSENT_REQUIRED=true`; confirm the CMP calls `Shopify.customerPrivacy.setTrackingConsent(...)`. See [Cookie consent](#cookie-consent-cmp) |
| Nothing is ever tracked, even after accepting | Consent flag set but `Shopify.customerPrivacy` never loads on the page | Ensure Shopify's Customer Privacy API is initialized (Hydrogen customer-privacy setup / the store's CMP); the SDK fails closed while it waits |
