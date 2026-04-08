# Pack Hydrogen Theme Blueprint

Starter template for Shopify Hydrogen storefronts built on Pack CMS. This is the base repo that all client storefronts are forked from.

## Tech Stack

- Hydrogen 2026.1.0 / React Router 7.12 / React 18.3
- Pack SDKs: @pack/hydrogen ^3.1.0, @pack/react ^4.0.0, @pack/client ^1.0.3
- Tailwind CSS 3.4 + PostCSS
- TypeScript 5.9 (strict mode)
- Vite 6.2 build tooling
- Deploys to Shopify Oxygen (edge runtime)

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/sections/` | 33 CMS sections registered via `registerSection()` |
| `app/settings/` | 10 global storefront settings schemas |
| `app/routes/` | File-based routing with `($locale)` prefix, 13 API routes |
| `app/lib/` | Server utilities (Klaviyo, admin-api, customer, session) |
| `app/hooks/` | 20+ React hooks |
| `app/components/` | UI components (Document, Layout, Cart, Analytics, etc.) |
| `app/styles/` | Global CSS, fonts, design tokens |
| `app/contexts/` | React context providers |

## Pack Documentation

- https://docs.packdigital.com
- https://docs.packdigital.com/llms-full.txt

## Claude Code

This repo ships with pre-configured Claude Code tooling:

| Path | Purpose |
|------|---------|
| `.claude/settings.json` | Permissions, auto-lint hook, typecheck on stop |
| `.claude/rules/` | Conditional rules for sections, routes, integrations, schemas, styling |
| `.claude/commands/` | `/new-section`, `/add-integration`, `/preflight`, `/refresh-rules` |
| `.claude/agents/` | `/requirements` planning subagent |

After customizing the storefront (adding sections, integrations, etc.), run `/refresh-rules` to update the rules files.

## Conventions

- All sections use `registerSection()` from `@pack/react`
- Section schemas co-located as `{SectionName}.schema.ts`
- Routes use `($locale)` prefix for i18n
- Data fetching via `context.storefront` (Shopify) and `context.pack` (CMS)
- `context.admin` conditionally available (requires `PRIVATE_ADMIN_API_TOKEN`)
- Tailwind utilities preferred; CSS custom properties for design tokens
- ESLint (`@shopify/hydrogen` plugin) + Prettier (`@shopify/prettier-config`) enforced
- `PRIVATE_` prefix for server-only env vars, `PUBLIC_` for client-exposed
