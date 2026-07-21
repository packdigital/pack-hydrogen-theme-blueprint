---
paths:
  - "app/settings/**"
---

# Pack Storefront Settings Conventions

This rule covers **global storefront settings** in `app/settings/`. Section-specific schemas (`.schema.ts` files co-located with section components in `app/sections/`) are covered by the sections rule.

## Structure

Each settings file exports a schema object with:
- `label` — display name in Pack editor
- `fields` — array of field definitions (text, image, color, select, etc.)
- `defaultValue` — initial values for new instances

## Settings Registry

All settings are registered in `app/settings/index.ts` via `registerStorefrontSettingsSchema()`.

## Active Settings Files

| File | Controls |
|---|---|
| `account/` | Account management (login, register, activate, forgot/reset password, orders, menu) |
| `analytics.ts` | Shopify analytics toggle |
| `cart.ts` | Cart configuration (discounts, free shipping, upsells) |
| `collection.ts` | Collection page settings (promo tiles, filters, sorting) |
| `footer.ts` | Footer styling (colors, marketing signup, legal links) |
| `header.ts` | Header configuration (promobar, navigation, search) |
| `localization.ts` | Shopify localization / country selector toggle |
| `not-found.ts` | 404 page customization (banner CMS type) |
| `product.ts` | Product page settings (add-to-cart, back-in-stock, reviews) |
| `search.ts` | Search configuration (autocomplete, suggestions) |

Shared utilities: `common.ts` (reusable field definitions), `container.ts` (container/layout schema)

## Conventions

- Schema field types must match Pack's supported types — check existing settings for examples
- Default values should reflect the current live site design
- Settings file names use kebab-case, matching the setting key in Pack
- Section settings (for individual sections) live alongside the section component, not in this directory
