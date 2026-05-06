# Languages and Libraries

This document describes the languages, frameworks, and libraries used in this project, and the role each one plays.

---

## Languages

### TypeScript

The primary language of the project. TypeScript is a typed superset of JavaScript that compiles to plain JS. It provides static type checking, better IDE support, and helps catch bugs at development time rather than at runtime. All test files, page objects, step definitions, and configuration files are written in TypeScript.

### Gherkin

A plain-text language used to write feature files (`.feature`). It describes test scenarios in a human-readable format using the `Given / When / Then` syntax. It acts as a bridge between business requirements and automated tests.

---

## Core Testing Frameworks

### @playwright/test

The main end-to-end testing framework. Playwright drives real browsers (Chromium, Firefox, WebKit) with a powerful API for interactions, assertions, network interception, and more. It handles test lifecycle, parallelism, retries, and built-in reporters.

### @cucumber/cucumber

A BDD (Behavior-Driven Development) framework that parses Gherkin `.feature` files and maps each step to TypeScript step definitions. Enables test scenarios written in natural language to be executed as automated tests.

---

## Reporting

### allure-cucumberjs

Integration layer between Cucumber and the Allure report engine. It collects test results from Cucumber runs and outputs them in the Allure format.

### allure-js-commons

Shared utilities and types used internally by Allure integrations. Provides the base API for attaching metadata, labels, steps, and attachments to test results.

### allure-commandline

CLI tool used to generate (`allure generate`) and serve (`allure serve`) the HTML Allure report from the collected result files.

---

## Formatters and Output

### @cucumber/pretty-formatter

A Cucumber formatter that prints scenario names, step statuses, and test output to the terminal in a readable, colorized format during test execution.

### @cucumber/messages

TypeScript types and utilities for working with Cucumber's internal message protocol. Used internally by other Cucumber packages and Allure integration.

---

## Validation

### ajv

A JSON Schema validator. Used in this project to validate the shape of API responses against defined schemas, ensuring the API returns the expected data structure.

---

## Code Quality

### eslint

A static analysis tool that identifies and reports patterns in JavaScript/TypeScript code. Configured with TypeScript-aware rules to enforce consistent code style and catch common errors.

### typescript-eslint

ESLint plugin and parser that enables ESLint to understand TypeScript syntax and apply TypeScript-specific lint rules.

### @eslint/js

ESLint's official set of built-in recommended JavaScript rules.

### globals

Provides lists of known global variables (browser globals, Node.js globals, etc.) used to configure ESLint environments without false positives.

### prettier

An opinionated code formatter. Automatically formats TypeScript, JavaScript, and feature files to a consistent style. Integrated with ESLint via `eslint-config-prettier`.

### eslint-config-prettier

Disables ESLint formatting rules that would conflict with Prettier, so both tools can work together without producing contradictory output.

### prettier-plugin-gherkin

A Prettier plugin that extends auto-formatting support to `.feature` files written in Gherkin syntax.

---

## Environment and Configuration

### dotenv

Loads environment variables from a `.env` file into `process.env`. Used to manage environment-specific settings such as base URLs and credentials without hardcoding them in source files.

---

## Runtime and Tooling

### tsx

A TypeScript executor for Node.js. Allows running `.ts` files directly without a separate compilation step, used in configuration scripts and utilities.

### jiti

A runtime TypeScript/ESM loader for Node.js. Enables importing TypeScript modules dynamically at runtime, which is useful for loading configuration files (e.g., Cucumber config) as native TypeScript.

### typescript

The TypeScript compiler itself (`tsc`). Provides type checking, language server support, and compiles TypeScript to JavaScript when needed.

### @types/node

TypeScript type definitions for Node.js built-in modules (e.g., `fs`, `path`, `process`). Enables type-safe usage of Node.js APIs in TypeScript code.

---

## Package Manager

### Yarn (v4 — Berry)

The package manager used to install and manage all project dependencies. Yarn v4 uses the Plug'n'Play (PnP) or node_modules linker and is configured via `.yarnrc.yml`.
