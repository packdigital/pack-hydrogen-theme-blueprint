---
description: Re-discover the codebase and regenerate .claude/rules/ files
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

Re-scan the codebase and update all `.claude/rules/` files to reflect current state.

## Steps

Run all discovery in parallel:

1. **Sections**: Read `app/sections/index.tsx` for all `registerSection()` calls. Update the "Registered Sections" list in `.claude/rules/sections.md`.

2. **Integrations**: Scan `app/lib/` directories, `app/components/Analytics/`, and `app/routes/` for API routes. Update the integrations and analytics tables in `.claude/rules/integrations.md`.

3. **Settings**: Read `app/settings/index.ts` for registered settings. Update the "Active Settings Files" table in `.claude/rules/schemas.md`.

4. **Styling**: Read `app/styles/app.css`, `app/styles/fonts.css`, and `tailwind.config.js`. Update colors, fonts, breakpoints, layout constants, and component classes in `.claude/rules/styling.md`.

5. **Routes**: Check `app/routes/` for new API routes. Grep for `context.admin` to confirm availability. Update `.claude/rules/routes.md`.

## Output

Report what changed:
- Sections added/removed
- New integrations or env vars detected
- Settings files added/removed
- Styling token changes
- Route changes

Only overwrite rules that actually changed. Leave unchanged rules alone.
