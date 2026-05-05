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
