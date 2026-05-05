# MCP Workflow Notes

This repository was developed using an agentic workflow with MCP-like tool orchestration:

## Context discovery

- File search and targeted reads for config, pages, steps, and docs

## Safe change cycle

- Small patch edits with diagnostics after each update

## Runtime verification

- Focused test execution for impacted scenarios/specs

## Selector remapping

- Target-page inspection to map stable locators for the new site

## Stability hardening

- Added explicit waits and page-ready checks before screenshots/assertions

This process is reflected in the final code and in troubleshooting guidance in [troubleshooting.md](./troubleshooting.md).

## How to use this workflow

Use this sequence whenever you need to implement or stabilize a change:

1. Discover context first:
	- Identify impacted files (config, scripts, pages, steps, docs)
	- Read only the sections needed for the current task
2. Apply focused edits:
	- Prefer small, low-risk changes
	- Keep selectors and assertions explicit and stable
3. Validate quickly:
	- Run only impacted tests first
	- Expand to broader suites after local validation passes
4. Document and commit:
	- Update docs/changelog for behavior changes
	- Use semantic commits grouped by concern

## Practical commands

### Context and diagnostics

```bash
git status --short
rg "pattern_to_find" .
yarn lint
```

### Runtime validation

```bash
yarn test:pw:headed:video
yarn test:cucumber:no-workers:headless:video
yarn test:api
```

### Reporting

```bash
yarn allure:generate
yarn allure:open
yarn allure:server:report
```

### Commit flow

```bash
git add -A
git commit -m "type(scope): concise semantic message"
```

## Benefits and applicability

- Faster debugging cycles by validating only impacted behavior first
- Lower regression risk due to small, isolated changes
- Better traceability with semantic commits and synchronized docs
- Easier onboarding because workflow decisions are explicit and repeatable
- Works well for UI + API mixed suites where selectors, hooks, and reports are interconnected
