---
description: Run lint, typecheck, and build to verify changes before pushing
allowed-tools: Bash
---

Run all quality checks to verify the codebase is clean before pushing.

## Steps

Run these checks sequentially, stopping on the first failure:

1. **Lint**: `npm run lint`
   - If violations found, report them with file paths and line numbers
   - Suggest fixes but do not auto-fix

2. **TypeScript**: `npm run typecheck`
   - If type errors found, report them with file paths and line numbers

3. **Build**: `npm run build`
   - If build fails, report the error

## Output

Report results as:

```
Preflight Results
-----------------
Lint:      PASS | FAIL (N issues)
Typecheck: PASS | FAIL (N errors)
Build:     PASS | FAIL

{Details of any failures}
```

If all pass, confirm the codebase is ready to push.
