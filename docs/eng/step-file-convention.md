# Step File Convention

Use the steps directory only for business test logic.

- Keep only logical Cucumber step definitions in `steps/<type>/<locale>/*.step.ts`
- Avoid debug, spike, temporary, or page-mapping code inside step files
- Use `scripts/debug-*.cjs` only for short-lived investigation
- It is safe to delete debug scripts after selectors/flows are stabilized in pages and steps

Parallel execution currently loads only `.step.ts` files from the selected type and locale folders and skips debug-named step entries.
