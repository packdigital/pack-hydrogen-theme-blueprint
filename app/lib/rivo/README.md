# Rivo loyalty integration

Headless Rivo loyalty for Hydrogen: read the customer's loyalty state, redeem
points, and apply the resulting reward to the Shopify cart.

## Model

Rivo redemptions produce **standard Shopify discount codes**. The flow is:

1. The storefront calls Rivo's REST API server-side to redeem.
2. Rivo deducts the points and returns a Shopify discount code.
3. The storefront applies it to the cart with `cartDiscountCodesUpdate`.

Free-product rewards additionally add a cart line (`cartLinesAdd`). Gift-card and
store-credit rewards are settled natively by Shopify and never touch the cart.

This headless flow requires no `/cart.js`, cart attributes, or `localStorage` —
those belong to Rivo's legacy Liquid widgets, which are not used here.

## What this integration owns

Rivo's Liquid widgets ship the whole customer journey. Headless, they ship none of
it — Rivo provides the data and the writes, and the storefront is responsible for
the journey between them. Worth knowing before scoping this for a client, because
none of it is called out as the integrator's job:

| Journey step                       | Rivo provides                                | This integration had to build                                                                                                          |
| ---------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Earning on orders                  | Automatic, server-side                       | nothing                                                                                                                                |
| Earning on social / custom actions | `POST /points_events`                        | The whole thing — which triggers are safe to award, the completion check, and an allowlist, since `manual` accepts an arbitrary amount |
| Redeeming                          | `POST /points_redemptions` → a discount code | Applying it to the cart, plus the free-product cart line                                                                               |
| A failed redemption                | Nothing — points are already gone            | Surfacing unused codes so a paid-for reward is recoverable                                                                             |
| Referrals                          | A link and a `POST /referrals`               | Capturing `?referral_code=`, persisting it through signup, attributing it, and rewriting the link to the Hydrogen origin               |
| Tier marketing                     | Names and thresholds only; `perks` is empty  | All tier copy, CMS-authored                                                                                                            |
| Birthday rule                      | Awards on the date                           | The UI to capture `dob` — **not built**                                                                                                |
| Rate limits                        | 15 req/s per store                           | Caching, backoff, and retry-safety per method                                                                                          |

Two consequences are structural rather than incidental:

**Redemption is not idempotent.** Points are deducted the moment
`/points_redemptions` succeeds, before the cart mutation runs. There is no
idempotency key, so a dropped connection can spend points with the code lost. The
unused-rewards list is the mitigation, not a fix.

**Nothing is verifiable.** Awarding a social follow is trust-based — Rivo's own
widgets work the same way. The protections here are the allowlist and the
completion check, not verification.

There is also no headless SDK, typed client, or reference implementation from
Rivo, which is why the client, the types and the normalizers in this directory are
all hand-written. Every bug listed under
[Gaps in this API surface](#gaps-in-this-api-surface) came from that hand-rolling
meeting a payload the docs described incorrectly.

## Credential scope

This uses Rivo's **Merchant API key**, which is admin-scoped. Rivo also documents
a Storefront API key against `loyalty-api.rivo.io`, but that surface rejected our
key with 403 and is absent from the developer docs, so it was not usable.

Neither key is browser-safe — Rivo describes both as shop-scoped and server-side
only. The difference is what an attacker gets if one leaks:

|                                                    | Storefront key | Merchant key (used here) |
| -------------------------------------------------- | -------------- | ------------------------ |
| Read a customer's points and tier                  | yes            | yes                      |
| Spend a customer's points                          | yes            | yes                      |
| Read every customer — email, points, referral code | no             | **yes**                  |
| Grant arbitrary points or credits to anyone        | no             | **yes**                  |
| Create, modify or delete the rewards catalog       | no             | **yes**                  |
| Update customer records and VIP tiers              | no             | **yes**                  |
| Manage webhooks                                    | no             | **yes**                  |

Both are shop-scoped in the same way: Rivo's customer endpoints take the customer
id as a **path segment with no per-customer token**, so either key can act as any
customer. That is why `getRivoCustomerIdFromSession` derives the id from the
session and the route never accepts it from a request — that requirement does not
change with a narrower key.

What does change is the worst case. A leaked storefront key lets someone read and
spend loyalty points. A leaked Merchant key lets someone mint unlimited discount
codes, zero every balance, delete the rewards program, and export the customer
list.

The current mitigations are real and tested — the key never reaches the client
(asserted against `dist/client` on every build), errors are redacted, and only
`/api/rivo` touches it. But this is a least-privilege problem, not a vulnerability:
we hold a key that can destroy the loyalty program in order to do something a
read-and-spend key would cover. **If Rivo can issue a scoped storefront key for a
headless storefront, switch to it** — only `getRivoConfig` and the base URL would
need to change.

## Which API this uses

Rivo has two HTTP surfaces. This integration targets the **Merchant API**:

|             | Merchant API (used here)                        | Storefront API                        |
| ----------- | ----------------------------------------------- | ------------------------------------- |
| Base URL    | `https://developer-api.rivo.io/merchant_api/v1` | `https://loyalty-api.rivo.io/api`     |
| Auth header | `Authorization: <key>` — **raw, no `Bearer`**   | `Authorization: Bearer <key>`         |
| Shop param  | not needed                                      | `?shop=<shop>.myshopify.com` required |
| Envelope    | JSON:API — `data[].attributes`                  | flat JSON                             |
| Documented  | yes, versioned `/v1`                            | no — RivoJS internal                  |
| Scope       | admin                                           | read + spend points                   |

A `Bearer` prefix on the Merchant API returns `401`. Sending a Merchant key to
the Storefront API returns `403`. Both are easy to mistake for a bad key.

> The Merchant API key is **admin-scoped** — it can adjust any customer's points,
> and create or delete rewards. It must never reach the browser, and the customer
> id must never be accepted from the request.
> `getRivoCustomerIdFromSession` derives it from the authenticated Customer
> Account session instead.

## Configuration

| Env var                | Required | Notes                                                 |
| ---------------------- | -------- | ----------------------------------------------------- |
| `PRIVATE_RIVO_API_KEY` | yes      | Rivo admin → Developer Toolkit. **Server-side only.** |
| `RIVO_API_BASE_URL`    | no       | Defaults to the Merchant API base above.              |

Set this locally in `.env` **and** as a secret variable in the Hydrogen app's
environment for each deployed environment. The legacy name
`PRIVATE_RIVO_STOREFRONT_API_KEY` is still read as a fallback.

## Architecture

```
app/lib/rivo/                    server-only Rivo client
  rivo-client.ts                 fetch core, raw auth header, JSON:API unwrap,
                                 reward-type → cart strategy
  display.ts                     read endpoints + normalization to camelCase
  redeemReward.ts                POST /points_redemptions → RivoRedemption
  session.server.ts              customer id from the authenticated session
  rivo.types.ts                  RivoRaw* (wire) + normalized shapes

app/routes/($locale).api.rivo.tsx  server proxy — the only path to Rivo

app/hooks/rivo/                  client data hooks
  useRivoLoyalty.ts              customer + rewards + tiers in one request
  useRivoRedeem.ts               redeem → apply code / add line to cart
  useRivoLedger.ts               points history
  useRivoReferrals.ts            referral link + stats

app/components/Rivo/             shared UI
app/sections/Rivo*/              Pack customizer sections
```

Rivo's payloads are normalized to camelCase at the server boundary, so the UI
never depends on Rivo's field names. `RivoRaw*` types mirror the wire format;
everything else is the normalized shape.

**Never import a runtime value from the `~/lib/rivo` barrel in client code.** It
re-exports `session.server`, so doing so pulls server-only modules into the
browser bundle and fails the build. Type-only imports are fine (they are erased);
anything both sides need at runtime goes in a leaf module with no imports of its
own, as `referral.constants.ts` does.

Shop-scoped reads (`rewards`, `vip_tiers`, `earning_rules`) run through
Hydrogen's subrequest cache via `context.withCache` — 60s with 600s
stale-while-revalidate. Customer-scoped reads are deliberately uncached: points
move the moment someone redeems, and a stale balance beside a Redeem button is
worse than the extra call. Errors are never cached.

Retries are asymmetric. A 429 is retried on any method, since the request was
rejected before any work happened; timeouts and 5xx are retried on `GET` only,
because a failed POST to `/points_redemptions` or `/points_events` may have
landed with only the response lost.

## Endpoints

| Endpoint                   | Wrapper             | Notes                                |
| -------------------------- | ------------------- | ------------------------------------ |
| `POST /points_redemptions` | `redeemReward`      | Returns the discount code            |
| `GET /customers/:id`       | `getCustomer`       | Points, credits, tier, referral link |
| `GET /rewards`             | `getRewards`        | Shop-scoped catalog                  |
| `GET /vip_tiers`           | `getVipTiers`       | Note the **underscore**              |
| `GET /points_events`       | `getPointsLogs`     | Filter by customer                   |
| `GET /referrals`           | `getReferrals`      | Filter by customer                   |
| —                          | `getReferralStats`  | Derived; see below                   |
| —                          | `getLoyaltySummary` | Aggregate for the sections           |

Customer-scoped collections filter with `?filters[customer_identifier]=<id>`;
pagination is `?pagination[per_page]=25&pagination[page]=1`.

`POST /points_redemptions` takes `application/x-www-form-urlencoded`:

| Param                 | Required | Value                        |
| --------------------- | -------- | ---------------------------- |
| `customer_identifier` | yes      | Shopify customer ID or email |
| `reward_id`           | yes      | The reward being redeemed    |
| `points_amount`       | no       | Incremental points rewards   |
| `credits_amount`      | no       | Incremental credits rewards  |

### Gaps in this API surface

Verified by probing the live store — worth knowing before promising features:

- **Points and credits share one ledger.** There is no `/credits_events` or
  `/credits_logs` (both 404) — instead a store-credit grant is a `points_event`
  with `points_amount: 0` and a non-zero `credits_amount` (a _string_). The
  history section renders whichever side of an event actually moved.
- **`points_amount` is a magnitude, `points_diff` is the signed delta.** A
  redemption reports `points_amount: 100, points_diff: -100`. Reading
  `points_amount` alone renders every spend as a gain.
- **A redemption's "used" flag is `used_at`, a timestamp.** The boolean `used`
  the docs list is not returned at all, so a check against it silently matches
  everything.
- **Ledger events can be revoked or hidden.** Rivo reverses an event by setting
  `revoked_at` rather than deleting it, and can set `hidden`. Both are filtered
  out of the customer-facing ledger.
- **`internal_note` leaks operator identity** (observed: `"someone@x.com: extra"`).
  Only `title` / `external_note` are ever sent to the browser.
- **`points_event.id` is a composite array** `[shop_id, event_id]` in
  `attributes`, while the resource-level `id` is the plain scalar.
  `unwrapCollection` prefers the resource id.
- **`vip_tier` is an object, `next_vip_tier` is null** even when higher tiers
  exist, and the tier is not necessarily points-driven — a customer can sit in
  Silver (threshold 500) with a 0 points tally. `RivoVipTiers` therefore trusts
  Rivo's tier name, derives the next tier from ladder position, and suppresses
  the progress bar when the balance is inconsistent with the ladder.
- **`/customers/:id/advocate_stats` returns the plain customer object**, not
  referral stats. `getReferralStats` therefore takes the link from the customer
  and derives counts from `/referrals`.
- **Paths use underscores.** `/vip-tiers`, `/membership-tiers` and
  `/earning-rules` all 404; `/vip_tiers` works. The docs index lists the
  hyphenated forms.
- **Rewards are shop-scoped, not per customer.** `/customers/:id/rewards` 404s,
  so affordability is computed client-side against the points tally.
- **`credits_tally` is a string** (`"0.0"`), not a number. `toNumber` handles it.
- **`source: 'referrer'` rewards are filtered out** of the catalog — Rivo grants
  those automatically, they are not customer-redeemable.

## Reward-type handling

| `reward_type`               | Artifact                     | Cart action                                      |
| --------------------------- | ---------------------------- | ------------------------------------------------ |
| `fixed_amount`/`percentage` | Shopify discount code        | `cartDiscountCodesUpdate`                        |
| `free_shipping`             | Shopify discount code        | `cartDiscountCodesUpdate`                        |
| `free_product` / GWP        | Discount code + free variant | `cartDiscountCodesUpdate` **and** `cartLinesAdd` |
| `gift_card`                 | Shopify gift card            | none — a payment method at checkout              |
| `points_to_credit`          | Shopify store credit         | none — response carries the credited amount      |

## Discount-code behavior

- Default `usage_limit = 1` and `appliesOncePerCustomer` → single-use,
  customer-specific.
- Standard Shopify limits apply: max 5 discount codes per order, plus Shopify's
  combination rules. `useRivoRedeem` refuses to redeem past that ceiling and
  surfaces the code so the customer can apply it manually.
- Codes are **applied**, not auto-applied.
- Rate limit: 15 requests/second per store. `getLoyaltySummary` issues 3
  parallel calls per page load.

Because points are spent server-side before the cart mutation runs, any cart
failure after a successful redemption reports the discount code in the error
message rather than swallowing it — the customer can always still apply it.

## Tests

```bash
npm test          # vitest run
npm run test:watch
```

98 tests colocated as `app/lib/rivo/*.test.ts`, covering the server layer — the
UI is not tested. They exist because every bug in this integration so far was in
a pure normalizer, caused by a live payload disagreeing with Rivo's docs, so the
fixtures are payloads captured verbatim from a real store and each regression is
commented with the bug it pins.

Two groups are load-bearing and should not be weakened:

- **`completeEarningRule.test.ts`** asserts the award allowlist — that `manual`
  and Rivo's own triggers are refused, that the trigger is resolved server-side
  rather than taken from the caller, and that `points_amount` is never sent. If
  these regress, a browser request could mint points.
- **`rivo-request.test.ts`** asserts the retry asymmetry — a 5xx or network
  failure on a `POST` must _not_ be retried, because the write may have landed
  with only the response lost. If that regresses, a redemption could double-spend.

## Verifying against a store

```bash
npm run rivo:probe                              # shop + catalog
npm run rivo:probe -- --customer <shopify_id>   # + customer-scoped reads
npm run rivo:probe -- --customer <id> --full    # full payloads
```

Reads only — the probe never creates points events or redemptions. Reading the
output: `403`/`401` means the endpoint exists but auth was rejected; `404` means
the path is wrong. That distinction is how the gaps above were found.

## Checkout

Hydrogen uses Shopify's hosted checkout. Rivo's checkout UI extensions (redeem
points, auto-apply gifts) run there via Shopify Checkout Extensibility (Shopify
Plus / Rivo Plus) — no headless work required.

## Building the page

> Published Pack changes can take one request to appear locally: `getPage` uses
> `CacheLong`, so the first request after publishing serves stale content and
> revalidates behind it. Reload once before concluding an edit didn't save.

The four sections register under the **Loyalty** category in the Pack
customizer:

- **Rivo Loyalty Status** — points, store credit, VIP tier ladder + progress
- **Rivo Rewards** — reward grid with redeem → cart
- **Rivo Points History** — points ledger
- **Rivo Referral** — referral link, copy button, referral stats

Every section handles the signed-out case with a sign-in CTA, so they can sit on
a public `/pages/rewards` page.
