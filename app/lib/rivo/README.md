# Rivo loyalty integration

> Build status, what is unverified, and what is still missing:
> [`STATUS.md`](./STATUS.md).

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

## Which API this uses

Rivo has two HTTP surfaces. This integration targets the **Merchant API**:

| | Merchant API (used here) | Storefront API |
| --- | --- | --- |
| Base URL | `https://developer-api.rivo.io/merchant_api/v1` | `https://loyalty-api.rivo.io/api` |
| Auth header | `Authorization: <key>` — **raw, no `Bearer`** | `Authorization: Bearer <key>` |
| Shop param | not needed | `?shop=<shop>.myshopify.com` required |
| Envelope | JSON:API — `data[].attributes` | flat JSON |
| Documented | yes, versioned `/v1` | no — RivoJS internal |
| Scope | admin | read + spend points |

A `Bearer` prefix on the Merchant API returns `401`. Sending a Merchant key to
the Storefront API returns `403`. Both are easy to mistake for a bad key.

> The Merchant API key is **admin-scoped** — it can adjust any customer's points,
> and create or delete rewards. It must never reach the browser, and the customer
> id must never be accepted from the request.
> `getRivoCustomerIdFromSession` derives it from the authenticated Customer
> Account session instead.

## Configuration

| Env var                | Required | Notes                                                    |
| ---------------------- | -------- | -------------------------------------------------------- |
| `PRIVATE_RIVO_API_KEY` | yes      | Rivo admin → Developer Toolkit. **Server-side only.**     |
| `RIVO_API_BASE_URL`    | no       | Defaults to the Merchant API base above.                 |

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

## Endpoints

| Endpoint | Wrapper | Notes |
| --- | --- | --- |
| `POST /points_redemptions` | `redeemReward` | Returns the discount code |
| `GET /customers/:id` | `getCustomer` | Points, credits, tier, referral link |
| `GET /rewards` | `getRewards` | Shop-scoped catalog |
| `GET /vip_tiers` | `getVipTiers` | Note the **underscore** |
| `GET /points_events` | `getPointsLogs` | Filter by customer |
| `GET /referrals` | `getReferrals` | Filter by customer |
| — | `getReferralStats` | Derived; see below |
| — | `getLoyaltySummary` | Aggregate for the sections |

Customer-scoped collections filter with `?filters[customer_identifier]=<id>`;
pagination is `?pagination[per_page]=25&pagination[page]=1`.

`POST /points_redemptions` takes `application/x-www-form-urlencoded`:

| Param | Required | Value |
| --- | --- | --- |
| `customer_identifier` | yes | Shopify customer ID or email |
| `reward_id` | yes | The reward being redeemed |
| `points_amount` | no | Incremental points rewards |
| `credits_amount` | no | Incremental credits rewards |

### Gaps in this API surface

Verified by probing the live store — worth knowing before promising features:

- **Points and credits share one ledger.** There is no `/credits_events` or
  `/credits_logs` (both 404) — instead a store-credit grant is a `points_event`
  with `points_amount: 0` and a non-zero `credits_amount` (a *string*). The
  history section renders whichever side of an event actually moved.
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

The four sections register under the **Loyalty** category in the Pack
customizer:

- **Rivo Loyalty Status** — points, store credit, VIP tier ladder + progress
- **Rivo Rewards** — reward grid with redeem → cart
- **Rivo Points History** — points ledger
- **Rivo Referral** — referral link, copy button, referral stats

Every section handles the signed-out case with a sign-in CTA, so they can sit on
a public `/pages/rewards` page.
