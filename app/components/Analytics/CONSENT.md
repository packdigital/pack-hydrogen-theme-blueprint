# Consent

How this blueprint handles shopper consent, and the one mistake to avoid when
wiring a new analytics integration.

## The model

All consent flows through **Shopify's Customer Privacy API**. Any CMP that
writes to that API — Shopify's own cookie banner, OneTrust, Transcend Airgap —
works with no extra integration. We read Shopify's API and never talk to the CMP
directly. See [PLAYBOOK.md](../Document/PLAYBOOK.md#cookie-consent-cmp) for how
the Playbook SDK participates in the same model.

`app/root.tsx` configures it:

```ts
const consent = {
  checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
  storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
  withPrivacyBanner: true,
  country: storefront.i18n.country,
  language: storefront.i18n.language,
};
```

## Fail open, not closed

**This is the part integrations get wrong.**

Shopify dispatches `visitorConsentCollected` **only when consent is actually
collected or changed** — a banner interaction, or a `setTrackingConsent` call.
On load, Hydrogen dispatches `shopifyCustomerPrivacyApiLoaded`, which is a
_different_ event.

In a region with no cookie banner — the US, in most Shopify configurations —
nothing ever collects consent, so `visitorConsentCollected` **never fires at
all**. Hydrogen additionally suppresses the callback pre-interaction when a
banner _is_ shown but hasn't been answered.

So an integration that derives its consent state solely from
`onVisitorConsentCollected` will sit at "no consent" forever for most traffic:

```ts
// WRONG — never resolves for a visitor who never sees or answers a banner
const [consent, setConsent] = useState(null);
useCustomerPrivacy({
  ...props,
  onVisitorConsentCollected: (collected) => setConsent(collected),
});
if (!consent) return null; // blocks the integration permanently
```

Read the **resolved** permission off the API instead. These getters account for
the region defaults that apply when no banner is shown:

```ts
// RIGHT — resolves on load, banner or not
const {customerPrivacy} = useCustomerPrivacy({...props});

useEffect(() => {
  if (!customerPrivacy) return;
  setConsent({
    marketing: Boolean(customerPrivacy.marketingAllowed?.()),
    analytics: Boolean(customerPrivacy.analyticsProcessingAllowed?.()),
    preferences: Boolean(customerPrivacy.preferencesProcessingAllowed?.()),
    sale_of_data: Boolean(customerPrivacy.saleOfDataAllowed?.()),
  });
}, [customerPrivacy]);
```

Keep the `onVisitorConsentCollected` handler as well — it's how you learn about
_changes_. It just can't be the only source.

### Three further rules

**Never gate `register()`/`ready()` on consent.** Hydrogen's
`Analytics.Provider` holds every event in `waitForReadyQueue` until all
registered consumers report ready. A `ready()` that only runs once consent is
truthy will dam the entire event stream, not just its own integration:

```ts
// WRONG — deadlocks all analytics if consent never resolves
useEffect(() => {
  if (consent) ready();
}, [consent]);
```

**Never gate `ready()` on a third-party script either.** Same deadlock, different
trigger, and this one is far easier to hit. `ready()` means "this consumer has
finished registering its subscriptions" — not "the third-party pixel is alive":

```ts
// WRONG — one ad-blocked pixel stalls ALL analytics, permanently
const ready = register('my-pixel').ready;
useEffect(() => {
  if (!scriptIsLoaded) return;
  window.addEventListener('dl_view_item', handler);
  ready();
}, [scriptIsLoaded]);
```

```ts
// RIGHT — ready on mount; wire listeners when the script actually arrives
useEffect(() => {
  ready();
}, []);

useEffect(() => {
  if (!scriptIsLoaded) return;
  window.addEventListener('dl_view_item', handler);
  return () => window.removeEventListener('dl_view_item', handler);
}, [scriptIsLoaded]);
```

Pixel domains like `sc-static.net` (Snapchat) are on essentially every tracking
blocklist, so this reproduces on any machine with an ad blocker, Brave Shields,
or Safari/Firefox tracking protection. The symptom is confusing: the analytics
library loads fine and makes **zero** network calls, because no subscriber ever
receives an event, so no `dl_*` event is ever dispatched and nothing reaches the
vendor. Note that `useWaitForLoadScript`-style helpers give up after a fixed
number of polls, so the stall is permanent rather than slow.

**Normalize to booleans on both sides of the round-trip.** `ConsentStatus` is
`boolean | undefined`. Shopify omits categories a banner never set, while a push
back through `setTrackingConsent` sends them as booleans. Comparing raw values
across that boundary flaps `undefined` <-> `false` forever, which re-renders the
integration on a loop (~1x/sec in the wild).

## Global Privacy Control

Hydrogen has **no** GPC handling — no references to `globalPrivacyControl` or
`Sec-GPC` anywhere in `@shopify/hydrogen` or `@shopify/hydrogen-react`.

`useGlobalPrivacyControl()` (called from `Analytics.tsx`) reads the signal and
pushes `sale_of_data: false` through `setTrackingConsent`, so the opt-out reaches
every downstream consumer rather than living in one hook.

**GPC is an opt-out of sale/sharing only.** The other three categories are
carried through at their resolved values. Seeding the push from
`currentVisitorConsent()` instead would be a bug: in a non-banner region those
fields are `undefined` while resolved permissions are `true`, so coercing them
would silently revoke analytics and first-party marketing the visitor never
objected to.

## The opt-out control

California is an **opt-out** regime. No consent banner is required, but these
are:

1. **Notice at Collection** — at or before the point of collection
2. **A persistent opt-out link** — "Do Not Sell or Share My Personal
   Information", or the CPRA-permitted combined "Your Privacy Choices" with the
   official icon, on the homepage and every page collecting personal information
3. **Honoring GPC** as a valid opt-out of sale/sharing

`PrivacyChoices` (in the footer legal row) covers #2 and #3. It surfaces
Shopify's **native** preference center via `privacyBanner.showPreferences()` —
Hydrogen already builds and maintains that UI, it just ships no entry point to
it. This is the trigger, not a second CMP.

### Per-store checklist

- [ ] Point `footer.legal.privacyChoicesFallbackUrl` at the store's Shopify
      data-sales opt-out page. The default is a placeholder.
- [ ] Confirm with the client's legal team whether the exact CPPA opt-out icon
      asset is required. The inline icon here is a faithful rendering, but the
      icon is legally specified.
- [ ] Confirm whether Notice at Collection is satisfied. This blueprint provides
      the opt-out link and GPC; it does **not** add a notice-at-collection
      surface.
- [ ] Verify `showPreferences()` opens in a non-banner region. It should —
      `withPrivacyBanner: true` loads the banner SDK regardless of region — but
      verify rather than assume.

## Timing

[AB 566, the California Opt Me Out Act](https://iapp.org/news/a/california-governor-signs-new-law-requiring-in-browser-opt-out-preference-signal)
— signed 2025-10-08, effective **2027-01-01** — requires browsers to ship a
built-in, user-configurable opt-out preference signal. Chrome, Safari, and Edge
all have to offer it, so GPC moves from a niche signal to default-available.
