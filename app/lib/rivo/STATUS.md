# Rivo integration — status

Working notes for the `feat/rivo-loyalty-integration` branch: what is built and
verified, what is built but untested, and what is still missing. Architecture and
API details live in [`README.md`](./README.md) — this file tracks progress.

Last updated: 2026-08-17. Verified against `pack-hydrogen-essentials`.

---

## Done and verified against the live store

| Area | Notes |
| --- | --- |
| **Merchant API client** | `developer-api.rivo.io/merchant_api/v1`, raw `Authorization` header, JSON:API unwrapping, nested query params, form-encoded POSTs, 10s timeout, key-redacting errors |
| **Server-only boundary** | Key, base URL and `session.server` all verified absent from the client bundle on every build |
| **Auth split** | Program config (`rewards`, `vip_tiers`, `earning_rules`) public + 60s cache; everything customer-scoped 401s |
| **Customer / points / credits / tier** | `GET /customers/:id`, normalized to camelCase |
| **Rewards catalog** | `GET /rewards`, filtered to enabled + `source: points` |
| **VIP tiers** | `GET /vip_tiers`, sorted, progress suppressed when tiers aren't points-driven |
| **Points ledger** | `GET /points_events`, signed via `points_diff`, revoked/hidden filtered, credits shown as currency |
| **Redemption → cart** | `POST /points_redemptions` → discount code → `cartDiscountCodesUpdate`. **End-to-end proven:** code `BAL-ef95d3d74ae7`, tally 500→400, cart `$35 → −$5 → $30` |
| **Unused reward codes** | `GET /points_redemptions` filtered on `used_at`/`refunded_at`/`revoked_at`/expiry, with re-apply. Recovered two orphaned codes |
| **Earning rules** | `GET /earning_rules`, null rows filtered, multipliers rendered as "1 point per $1" |
| **Loyalty page** | `/pages/loyalty` created via Pack Content Management API with 8 sections, published, 0 console errors |
| **8 sections** | Hero (+background image), Ways to Earn, Rewards, Tier Benefits, Points History, Referral, plus IconRow + Accordions |

## Done, not yet verified end-to-end

| Item | What's unverified | How to verify |
| --- | --- | --- |
| **Claiming an earning rule** | Whether Rivo derives the award amount when `points_amount` is omitted. Allowlist and guest-401 are verified | Sign in, click **Follow on TikTok** on `/pages/loyalty`. Expect +20 and balance 300→320. If it moves by 0, pass the amount explicitly |
| **Inbound referral capture** | The `POST /referrals` call itself. Guards verified (guest 401, missing code rejected) | Open `/?referral_code=<code>` in a fresh browser profile, then sign in as a *different* customer. Check `GET /referrals` |
| **Unused rewards UI** | Endpoint returns correct data; the rendered list wasn't seen signed-in (dev worker crashed mid-check) | Sign in, open `/pages/loyalty` |
| **Free-product rewards** | `cartLinesAdd` + discount, the riskiest path — two cart mutations | Configure a `free_product` reward in Rivo |
| **`free_shipping`, `gift_card`, `points_to_credit`** | Written; store only has `fixed_amount` | Configure one of each in Rivo |
| **Incremental rewards** | Points-input UI never run against a real rule | Configure an incremental reward in Rivo |

## Not built

**Customer-facing**

- **Birthday capture** — `customer_birthday` is worth 250 points but there's no UI to set `dob`. Needs `PUT /customers/:id`.
- **Points expiry messaging** — `pointsExpireAt` and per-entry `expiresAt` are mapped but never shown.
- **Nav link** — `/pages/loyalty` isn't linked from header or footer.

**Operational**

- **No 429 / `Retry-After` handling.** Rivo rate-limits at 15 req/s per store; Rivo timeouts were observed under light load during development.
- **No caching on customer-scoped calls.** An authenticated loyalty page view costs roughly 8 Rivo calls (summary 3, earning rules 2, ledger 1, referral stats 2). Fine for one visitor, not for traffic.
- **Redemption isn't idempotent.** If the connection drops between Rivo spending the points and the response arriving, the code is only recoverable via the unused-rewards list — which is the mitigation, not a fix.
- **Admin-scoped key.** It can delete rewards and adjust anyone's points. Worth asking Rivo for a scoped storefront key, or proxying through a backend.
- **No webhooks.** Tier changes, expiry warnings and program edits produce no reaction and no cache invalidation.
- **No analytics.** Redemptions and claims emit no dataLayer events, so the program can't be measured.
- **No tests.** The normalizers are pure functions and are exactly where the bugs were — see below.

**Lower priority**

- Multi-locale (`translations` on rewards and rules is ignored; sections render Rivo's default language).
- Favorites, saved cart, memberships/paid tiers, customer preferences.

## Before this can ship

1. `PRIVATE_RIVO_API_KEY` is only in local `.env`. **Set it as a secret in Oxygen** or the loyalty sections 500 in production.
2. **The published Pack page references section types that aren't deployed.** `/pages/loyalty` is live on `pack-hydrogen-essentials` but only renders locally. Deploy this branch or unpublish the page.
3. Delete `app/routes/($locale).rivo-preview.tsx` — a scratch harness that would ship as a public route.
4. Remove the screenshot PNGs and `.playwright-mcp/` from the repo root.

## Bugs found by testing against real data

Recorded because they show where the risk is — every one came from a live payload
disagreeing with the docs, and all of them were in pure normalizer functions that
unit tests would have covered.

| Bug | Cause |
| --- | --- |
| Every points *spend* rendered as a gain | `points_amount` is a magnitude; `points_diff` is the signed delta |
| A real $1,000 credit rendered as "0" | Credits share the points ledger via `credits_amount` |
| Revoked events shown to customers | Rivo reverses events with `revoked_at` rather than deleting them |
| React keys were arrays | `points_event.id` is a composite `[shop_id, event_id]` in `attributes`; the resource-level `id` is the scalar |
| "500 points to Silver" above "Silver — your current tier" | Tier assignment isn't points-driven; a Silver customer can sit at 0 points |
| Unused-code filter matched nothing meaningful | The API returns `used_at`; the boolean `used` in the docs doesn't exist |
| `session.server` pulled into the client bundle | A client hook imported a runtime value from the `~/lib/rivo` barrel |

## API surprises worth remembering

- Two different APIs: `loyalty-api.rivo.io` (Bearer, undocumented, RivoJS internal) vs
  `developer-api.rivo.io/merchant_api/v1` (raw header, documented). A `Bearer`
  prefix 401s on the Merchant API; the raw header 403s on the storefront one.
  Both read as "bad key".
- Paths use underscores. `/vip_tiers` works, `/vip-tiers` 404s — the docs index lists the hyphenated forms.
- `/rewards` is shop-scoped; `/customers/:id/rewards` 404s.
- `/customers/:id/advocate_stats` returns the plain customer object, not stats.
- `credits_tally` is the string `"0.0"`.
- Tier `perks` is empty unless the merchant fills it in, so tier copy is CMS-authored.
- `internal_note` leaks operator identity (observed: `"someone@x.com: extra"`) — never expose it.
- `earning_rules` returns partially-null rows for unconfigured rules.
- Published Pack changes can take one request to appear locally, because `getPage` uses `CacheLong` with stale-while-revalidate.
