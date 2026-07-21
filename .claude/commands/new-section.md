---
description: Scaffold a new Pack CMS section with component, schema, and registration
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

Create a new Pack CMS section named $ARGUMENTS in this repo.

## Steps

1. **Check for conflicts**: Search `app/sections/` for an existing section with this name. If found, report it and stop.

2. **Find a reference section**: Read 2-3 existing sections in `app/sections/` to match the project's patterns (imports, typing, component structure). Prefer simpler sections like `TextBlock` or `Banner` as templates.

3. **Create the section directory and component**:
   - Create `app/sections/{SectionName}/{SectionName}.tsx`
   - Export a default functional component accepting `{cms}` prop
   - Use the `<Section>` wrapper component
   - Include proper TypeScript types for the CMS data shape
   - Follow the import ordering enforced by ESLint (builtin > external > internal > parent > sibling)

4. **Create the section schema** (co-located with the component):
   - Create `app/sections/{SectionName}/{SectionName}.schema.ts`
   - Export a `Schema` function returning `{ category, label, key, previewSrc, fields }`
   - In the component file, attach it: `{SectionName}.Schema = Schema`
   - Match field types to Pack's supported schema types (check existing `.schema.ts` files for examples)

5. **Register the section**:
   - Edit `app/sections/index.tsx` to import and call `registerSection()`
   - Follow alphabetical ordering of existing registrations

6. **Verify**:
   - Run `npm run typecheck` to confirm no type errors
   - Run `npm run lint` to confirm no lint violations

Report the created files and their locations when done.
