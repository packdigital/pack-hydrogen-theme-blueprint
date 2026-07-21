---
description: Wire up a new third-party integration (API route, lib module, env vars)
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

Add a new third-party integration for $ARGUMENTS to this storefront.

## Steps

1. **Research the integration**: Determine what the integration needs:
   - Client-side script (tracking pixel, widget)?
   - Server-side API calls (subscriptions, webhooks)?
   - Both?

2. **Check for existing work**: Search `app/lib/`, `app/components/Analytics/`, and `app/routes/` for any existing implementation of this integration.

3. **Create the lib module** (if server-side API calls needed):
   - Create `app/lib/{integration-name}/` directory
   - Add types, API client functions, and utilities
   - Follow patterns from existing integrations (e.g., check `app/lib/klaviyo/` for reference)

4. **Create the API route** (if server-side):
   - Create `app/routes/($locale).api.{integration-name}.tsx`
   - Export `loader` and/or `action` functions
   - Follow the pattern of existing API routes

5. **Add client-side scripts** (if needed):
   - Add to `app/components/Analytics/` for analytics/tracking scripts
   - Or create a dedicated component in `app/components/`
   - Use `useLoadScript()` hook for dynamic script loading

6. **Document environment variables**:
   - List any new env vars needed (with `PUBLIC_` or `PRIVATE_` prefix as appropriate)
   - Update the integrations rule in `.claude/rules/integrations.md`
   - Note: Oxygen secrets must be configured separately via Shopify Admin

7. **Verify**:
   - Run `npm run typecheck`
   - Run `npm run lint`

Report the created/modified files and any environment variables that need to be configured.
