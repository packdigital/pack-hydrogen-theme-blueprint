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
| Program config                     | Not on the API — only a shop metafield       | Reading it via the Admin API; see [Program config](#program-config-the-shop-metafield)                                                 |
| Membership management              | No headless API at all                       | Nothing — not reachable. See [Membership](#membership-paid-membership-program)                                                         |
| Post-login return                  | Hydrogen reads `?return_to=` natively        | Nothing — **deliberately not built**. See [Post-login return](#post-login-return-not-built)                                            |
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

## Program config: the shop metafield

The Merchant API returns the **catalog** — rewards, tiers, earning rules — but
none of the **program config**. Whether points expire, whether order earnings are
held before release, the VIP comparison table, potential-points earning rates,
referral share channels and membership tiers are all absent from it.

All of that lives in a shop metafield, which is what Rivo's own Liquid blocks
read. `config.ts` reads it through the Shopify Admin API:

| Namespace / key     | Notes                                                 |
| ------------------- | ----------------------------------------------------- |
| `rivo_settings.loy` | Newer stores. Preferred when present                  |
| `ba_loy.config`     | Legacy. The fallback, and what most stores still have |

`rivo-init.liquid` resolves them in exactly that order, and so does this.

**Everything here degrades.** A store with no Admin API token, no Rivo config, or
a malformed metafield yields `null`, and every consumer has a default. Nothing in
the UI may be load-bearing on it — an unconfigured store must render a sensible
page, not an error and not a zero.

It is served from `/api/rivo?action=getProgramConfig`, which is shop-scoped,
guest-safe and edge-cached. It contains no customer data.

> The metafield is a **superset** of the Merchant API for display purposes: its
> `rewards`, `ways_to_earn` and `vip_tiers` arrays carry fields REST omits
> (`terms_of_service` text, `card_click_method`, `hidden_from_ui`, tier `desc`
> and `icon_url`). Only the config is read today. If Rivo's rate limit ever
> becomes a problem, moving the shop-scoped catalog reads here too would remove
> two of the three calls `getLoyaltySummary` makes.

## Where things get edited

Rivo's own widgets do not render on a headless storefront, so copy authored in
Rivo admin is **invisible here**. That splits the merchant's workflow, and the
split is worth being explicit about:

| What                                                                                                   | Edited in           | Why                                                                                   |
| ------------------------------------------------------------------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------- |
| Points per action, reward costs, tier names and thresholds                                             | **Rivo admin**      | Rivo is the system of record; the API returns these                                   |
| Reward icons, tier icons                                                                               | **Rivo admin**      | Already returned by the API and rendered — don't re-upload them in Pack               |
| Points expiry, order earnings delay, potential-points rates, referral share channels, membership tiers | **Rivo admin**      | Behavioral config, read from the metafield above                                      |
| Every heading, subtext, button label, empty and error message                                          | **Pack customizer** | Rivo's 421 translation strings only drive Rivo's own widgets, which don't render here |
| Tier taglines, perks, comparison-matrix rows                                                           | **Pack customizer** | Rivo's `perks` is empty by default and it has no comparison model the API exposes     |
| Hero imagery, earning-rule icons, membership tier images                                               | **Pack customizer** | Rivo has no field for these                                                           |

One genuine ambiguity: Rivo's `loyalty_landing_page_settings.vip_tiers_table_data`
_is_ a real merchant-authored comparison matrix. **Rivo Tier Benefits** takes its
matrix from the Pack customizer instead, because it is display copy the merchant
is already editing alongside the rest of the section. `getRivoProgramConfig`
normalizes `tiersTable` from the metafield too, so if a client already maintains
it in Rivo, switching that section to read it is a small change. Decide this per
client at onboarding rather than leaving both half-filled.

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
  config.ts                      program config from the Shopify shop metafield
  rivo-config.query.ts           the Admin GraphQL query behind it
  potentialPoints.ts             PDP earn-preview math, ported from Liquid
  redeemReward.ts                POST /points_redemptions → RivoRedemption
  session.server.ts              customer id from the authenticated session
  rivo.types.ts                  RivoRaw* (wire) + normalized shapes

app/routes/($locale).api.rivo.tsx  server proxy — the only path to Rivo

app/hooks/rivo/                  client data hooks
  useRivoLoyalty.ts              customer + rewards + tiers in one request
  useRivoRewards.ts              guest-safe rewards catalog
  useRivoProgramConfig.ts        program config (shop metafield)
  useRivoRedeem.ts               redeem → apply code / add line to cart
  useRivoLedger.ts               points history, with paging
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

130 tests colocated as `app/lib/rivo/*.test.ts`, covering the server layer — the
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
- **`potentialPoints.test.ts`** pins the order of operations ported from
  `potential-points.liquid`: the price is rounded to whole units _before_ the
  division, and the division truncates. Getting either backwards prints a points
  number on every product page that Rivo will not actually award.

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

## Post-login return (not built)

Rivo's Liquid blocks put `?checkout_url=` on their login and register links so a
customer returns to the loyalty page after authenticating. Headless, a customer
who signs in from a Rivo section lands on `/account` instead.

This was built and then **deliberately reverted**. Two findings, in order of
importance:

### It silently breaks `dl_login` / `dl_sign_up`

The login and signup analytics events depend on the customer passing through
`/account`:

```
/account + FROM_ACCOUNT_AUTHORIZATION_KEY=1   (account_.authorize.tsx)
  -> sets LOGGED_IN_COOKIE / REGISTERED_COOKIE  (account.tsx)
  -> fires dl_login / dl_sign_up                (FueledEvents, ElevarEvents)
```

Any post-login redirect that skips `/account` skips that whole chain. The events
never fire, nothing errors, and login attribution quietly degrades. Fueled
tracking is a core deliverable, so this is not an acceptable trade for landing
the customer one page closer to where they started.

**Anyone implementing this must carry the authorization flag through to the
final destination, or fire the events another way.** That is the actual work
here — the redirect itself is trivial.

### Hydrogen already does the redirect

Do not build a session key for this. `customerAccount.login()` already reads
`?return_to=` (or `?redirect=`) off the login URL, validates it same-origin,
falls back to the `Referer` header, and stores it as `redirectPath` in the
session. `customerAccount.authorize()` then returns a redirect to it.

The only reason it does not work today is that `account_.authorize.tsx`
discards the Response `authorize()` returns and issues its own hardcoded
`/account` redirect:

```ts
await context.customerAccount.authorize(); // return value dropped
return redirect(`/account?${FROM_ACCOUNT_AUTHORIZATION_KEY}=1`);
```

Honouring that Response is a one-line change that looks obviously correct — and
is exactly the change that springs the analytics trap above. Both halves have to
land together, in their own PR, with the events verified.

## Membership (paid membership program)

Rivo's Liquid extension ships a paid-membership program alongside loyalty.
Headless, it splits in two:

**Display works.** `membership_tiers` and `paid_membership_settings` are on the
shop metafield, so **Rivo Membership Benefits** renders tiers and their benefits.

**Management does not.** Cancel, rejoin and update-payment have no reachable API.
Probed against a live store, every plausible endpoint 404s:

```
GET /memberships         404
GET /membership_tiers    404
GET /subscriptions       404
GET /membership_benefits 404
```

Rivo's Liquid blocks drive those actions through their hosted JS
(`window.rivoOpenCancelMembershipModal()` and friends), which calls the Shopify
app proxy at `/apps/ba-loy`. That proxy authenticates with an **online-store
customer session cookie on the myshopify domain** — something a headless
storefront does not have and cannot mint.

So a member on a headless storefront cannot cancel or change payment from the
storefront. The workable options, in order of preference:

1. Ask Rivo for a Merchant API surface for subscription management.
2. Link members to Shopify's customer account portal for payment changes, and
   handle cancellation as a support request.
3. Keep membership management on the Liquid online store if one is still live.

Do not build a client-side call to `/apps/ba-loy` — without the online-store
session it will not authenticate, and it would put a Rivo-internal path in the
browser bundle.

## Building the page

> Published Pack changes can take one request to appear locally: `getPage` uses
> `CacheLong`, so the first request after publishing serves stale content and
> revalidates behind it. Reload once before concluding an edit didn't save.

These register under the **Loyalty** category in the Pack customizer:

| Section                      | What it shows                                               |
| ---------------------------- | ----------------------------------------------------------- |
| **Rivo Loyalty Hero**        | Program pitch for guests; live balance and tier for members |
| **Rivo Loyalty Status**      | Points, store credit, reward progress, VIP tier ladder      |
| **Rivo Ways To Earn**        | Earning rules, with claim buttons for the awardable ones    |
| **Rivo Tier Benefits**       | Tier cards and the CMS-authored comparison matrix           |
| **Rivo Rewards**             | Reward grid with redeem → cart, plus unused reward recovery |
| **Rivo Points History**      | Points and credit ledger, with paging                       |
| **Rivo Referral**            | Referral link, copy button, share buttons, referral stats   |
| **Rivo Membership Benefits** | Paid-membership tiers — display only, see below             |

Plus one product-template section:

| Section                   | What it shows                                          |
| ------------------------- | ------------------------------------------------------ |
| **Rivo Potential Points** | "Order and get N points" panel, priced off the product |

Every section handles the signed-out case with a sign-in CTA, so they can sit on
a public `/pages/rewards` page. Guests also see the reward catalog and the ways
to earn, because a landing page has to sell the program before someone joins.

Signing in from any of them lands the customer on `/account`, not back on the
loyalty page — see [Post-login return](#post-login-return-not-built) for why
that is deliberate and what it would take to change.
