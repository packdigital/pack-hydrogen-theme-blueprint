# Consent

How this blueprint handles shopper consent, and the mistakes to avoid when
wiring a new analytics integration.

## Triage

| Symptom                                                                  | Likely cause                                                                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Banner doesn't show** for a first-time visitor in a banner region      | Something saved consent before it loaded — [never write consent on load](#never-write-consent-on-load) |
| Banner shows on some fresh loads but not others                          | A second `useCustomerPrivacy()` mount — [one API instance](#one-api-instance)                          |
| **No analytics at all** — every vendor silent, including Shopify's own   | Hydrogen's queue is held: an unready register — [the queue](#hydrogens-analytics-queue)                |
| A vendor treats a banner-region visitor as consenting before they answer | It read the API's placeholder — [read via `readConsent()`](#read-consent-via-readconsent)              |
| One vendor loads but sends nothing                                       | Its `ready()` is gated on a third-party script that's blocked — [further rules](#three-further-rules)  |
| Console spams `Visitor consent collected` ~1x/sec                        | `undefined` vs `false` flapping across the round-trip — [further rules](#three-further-rules)          |

Test every consent change from a **clean browser, first visit, in a banner
region** (e.g. a California or EU IP). A build passing says nothing about it.

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

The helpers live in `app/lib/consent.ts`.

## Never write consent on load

**This is the most expensive mistake, because it is silent and looks like a
fix.**

On a first visit the Customer Privacy API answers with a **placeholder** until
it has loaded the visitor's consent: no region, `shouldShowBanner()` false,
and every `*Allowed()` getter true. `consentStatus` is not `'loaded'` yet.

Calling `setTrackingConsent` with those values — for example "commit the
resolved consent when no banner is shown" — saves "everything allowed" as the
visitor's answer. In a region that requires a banner, the visitor is recorded
as consenting without clicking anything, and the banner never shows.

The only write this blueprint makes is `useSaleOfDataOptOut()`: it waits for
`consentStatus === 'loaded'`, and writes `sale_of_data: false` alone.

## Hydrogen's analytics queue

Hydrogen's `<ShopifyAnalytics>` registers a consumer you don't control,
`Internal_Shopify_Analytics`, and only reports it ready once its internal
`privacyReady` flips. With `withPrivacyBanner: true` that happens only on
`visitorConsentCollected`. Until then `areRegistersReady()` is false and
Hydrogen parks **every** event in `waitForReadyQueue` — Shopify's own analytics
included.

Shopify's banner script dispatches `visitorConsentCollected` once the consent
loads, **in every region**, banner or not. So the queue releases on its own and
nothing needs to save consent to unstick it. If every vendor _and_ Shopify's own
analytics are silent, check that the banner script loads (blocked domain, CSP)
and that every `register()` call reaches `ready()` — not consent writes.

## One API instance

Hydrogen's `Analytics.Provider` already mounts `useCustomerPrivacy()`. Don't
mount a second one. Each instance installs `Object.defineProperty` watchers on
`window.Shopify` and `window.privacyBanner`; the second overwrites the first,
and the instance that loses never calls `loadBanner()` — so the banner fails to
render on some fresh loads, with no retry.

`useAnalytics().customerPrivacy` doesn't help either: it stays null until
`privacyReady` flips. Read `window.Shopify.customerPrivacy` and listen for
`CONSENT_EVENTS`, as `app/lib/consent.ts` does.

## Read consent via `readConsent()`

An integration needs two things: a value it can trust, and to hear about
changes.

```ts
// WRONG — reads the placeholder: "everything allowed" in a banner region
const {customerPrivacy} = useCustomerPrivacy({...props});
useEffect(() => {
  if (!customerPrivacy) return;
  setConsent({
    marketing: Boolean(customerPrivacy.marketingAllowed?.()) /* ... */,
  });
}, [customerPrivacy]);
```

```ts
// RIGHT — null until Shopify has the visitor's consent, then re-read on change
useEffect(() => {
  const sync = () => {
    const next = readConsent();
    if (next) setConsent(next);
  };
  sync();
  return subscribeToConsentEvents(sync);
}, []);
```

`readConsent()` denies every purpose while a banner is due and unanswered, and
otherwise allows a purpose when the visitor didn't say `'no'` and the API
allows it. Decide what your integration does while it returns null; for
anything that sets marketing cookies, wait.

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
vendor. Note that poll-until-loaded helpers typically give up after a fixed
number of attempts, so the stall is permanent rather than slow.

**Normalize to booleans on both sides of the round-trip.** `ConsentStatus` is
`boolean | undefined`. Shopify omits categories a banner never set, while a push
back through `setTrackingConsent` sends them as booleans. Comparing raw values
across that boundary flaps `undefined` <-> `false` forever, which re-renders the
integration on a loop (~1x/sec in the wild).

## Global Privacy Control and Decline

Hydrogen has **no** GPC handling — no references to `globalPrivacyControl` or
`Sec-GPC` anywhere in `@shopify/hydrogen` or `@shopify/hydrogen-react` — and
Shopify's API applies GPC only from the second full page load.

`useSaleOfDataOptOut()` (called from `Analytics.tsx`) saves
`sale_of_data: false` once per page, after the consent has loaded, when:

- the browser sends GPC in a sale-of-data region and the visitor hasn't opted
  out yet, or
- a banner is required and the visitor declined: Shopify's Decline answers
  marketing, analytics and preferences but leaves sale_of_data blank, which
  reads as allowed. **This is a policy choice** — Shopify's banner doesn't do
  it by default. Confirm it per store.

**GPC is an opt-out of sale/sharing only.** The write carries `sale_of_data`
and nothing else, so the visitor's other answers are untouched.

Known side effect: after a Decline, "Accept all" in Shopify's preference dialog
can't turn sale of data back on (the dialog has no toggle for it).

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
