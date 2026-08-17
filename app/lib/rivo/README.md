# Rivo loyalty integration

Headless Rivo loyalty for Hydrogen: read the customer's loyalty state, redeem
points, and apply the resulting reward to the Shopify cart.

## Model

Rivo redemptions produce **standard Shopify discount codes**. The flow is:

1. The storefront calls Rivo's REST API server-side to redeem.
2. Rivo returns a Shopify discount code at `points_purchase.code`.
3. The storefront applies it to the cart with `cartDiscountCodesUpdate`.

Free-product rewards additionally add a cart line (`cartLinesAdd`). Gift-card and
store-credit rewards are settled natively by Shopify and never touch the cart.

This headless flow requires no `/cart.js`, cart attributes, or `localStorage` —
those belong to Rivo's legacy Liquid widgets, which are not used here.

## Configuration

| Env var                            | Required | Notes                                                            |
| ---------------------------------- | -------- | ---------------------------------------------------------------- |
| `PRIVATE_RIVO_STOREFRONT_API_KEY`  | yes      | Rivo storefront API key. **Server-side only.**                   |
| `PRIVATE_RIVO_SHOP_DOMAIN`         | no       | `<shop>.myshopify.com`. Falls back to `PUBLIC_STORE_DOMAIN`.      |
| `RIVO_API_BASE_URL`                | no       | Defaults to `https://loyalty-api.rivo.io`.                       |

Set these locally in `.env` **and** in the Hydrogen app's environment variables
for each deployed environment.

> The Rivo storefront API key is **shop-scoped**: it can read and spend points
> for any customer in the shop. It must never reach the browser, and the customer
> id must never be accepted from the request. `getRivoCustomerIdFromSession`
> derives it from the authenticated Customer Account session instead.

## Architecture

```
app/lib/rivo/                    server-only Rivo client
  rivo-client.ts                 fetch core, auth, reward-type → cart strategy
  display.ts                     GET endpoints (status, properties, tiers, logs, referrals)
  spendPoints.ts                 POST /spend_points → normalized RivoRedemption
  session.server.ts              customer id from the authenticated session
  rivo.types.ts

app/routes/($locale).api.rivo.tsx  server proxy — the only path to Rivo

app/hooks/rivo/                  client data hooks
  useRivoLoyalty.ts              status + properties + tiers + rewards
  useRivoRedeem.ts               redeem → apply code / add line to cart
  useRivoLedger.ts               points / credits history
  useRivoReferrals.ts            referral link + stats

app/components/Rivo/             shared UI
app/sections/Rivo*/              Pack customizer sections
```

## Endpoints

All customer-scoped endpoints take `Authorization: Bearer <key>`, a
`?shop=<shop>.myshopify.com` param, and the numeric Shopify customer id as a
path segment.

| Endpoint                                | Wrapper                 |
| --------------------------------------- | ----------------------- |
| `POST /api/customers/:id/spend_points`  | `spendPoints`           |
| `GET /api/customers/:id/status`         | `getCustomerStatus`     |
| `GET /api/customers/:id/properties`     | `getCustomerProperties` |
| `GET /api/customers/:id/vip_tiers`      | `getVipTiers`           |
| `GET /api/customers/:id/points_logs`    | `getPointsLogs`         |
| `GET /api/customers/:id/credits_logs`   | `getCreditsLogs`        |
| `GET /api/customers/:id/referrals`      | `getReferrals`          |
| `GET /api/customers/:id/referral_stats` | `getReferralStats`      |
| `GET /api/rewards`                      | `getRewards`            |

The rewards catalog is the one **shop-scoped** endpoint — `GET /api/rewards`,
not `/api/customers/:id/rewards`, which 404s. Affordability is computed
client-side against the customer's points tally.

`spend_points` params:

| Case                  | Param                  | Value                                                      |
| --------------------- | ---------------------- | ---------------------------------------------------------- |
| Fixed reward          | `reward_name`          | The reward's **id** (the param name is misleading but real) |
| Incremental / custom  | `points` and/or `credits` | Amount to redeem                                        |

## Reward-type handling

| `reward_type`               | Artifact                    | Cart action                                        |
| --------------------------- | --------------------------- | -------------------------------------------------- |
| `fixed_amount`/`percentage` | Shopify discount code       | `cartDiscountCodesUpdate`                          |
| `free_shipping`             | Shopify discount code       | `cartDiscountCodesUpdate`                          |
| `free_product` / GWP        | Discount code + free variant | `cartDiscountCodesUpdate` **and** `cartLinesAdd`   |
| `gift_card`                 | Shopify gift card           | none — applied as a payment method at checkout     |
| `points_to_credit`          | Shopify store credit        | none — response carries the credited amount        |

## Discount-code behavior

- Default `usage_limit = 1` and `appliesOncePerCustomer` → single-use,
  customer-specific.
- Standard Shopify limits apply: max 5 discount codes per order, plus Shopify's
  combination rules. `useRivoRedeem` refuses to redeem past that ceiling and
  surfaces the code so the customer can apply it manually.
- Codes are **applied**, not auto-applied.

## Checkout

Hydrogen uses Shopify's hosted checkout. Rivo's checkout UI extensions (redeem
points, auto-apply gifts) run there via Shopify Checkout Extensibility (Shopify
Plus / Rivo Plus) — no headless work required.

## Verifying against a store

```bash
# reads PRIVATE_RIVO_STOREFRONT_API_KEY + PRIVATE_RIVO_SHOP_DOMAIN from .env
npm run rivo:probe -- --customer <shopify_customer_id>
```

The probe hits every read endpoint and prints status codes plus the response
shape, so drift in Rivo's payloads shows up before it reaches the UI. It never
calls `spend_points` unless `--spend <reward_id>` is passed explicitly, since
redemptions consume real points.

Reading the output: `403` means the endpoint exists but the key or shop was
rejected; `404` means the path itself is wrong. That distinction is how the
rewards endpoint above was pinned down.

## Building the page

The four sections register under the **Loyalty** category in the Pack
customizer:

- **Rivo Loyalty Status** — points, store credit, VIP tier ladder + progress
- **Rivo Rewards** — reward grid with redeem → cart
- **Rivo Points History** — points or store-credit ledger
- **Rivo Referral** — referral link, copy button, referral stats

Every section handles the signed-out case with a sign-in CTA, so they can sit on
a public `/pages/rewards` page.
