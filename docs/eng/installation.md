# Installation

## 1) Clone repository

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
```

## 2) Install Yarn correctly for your OS

Use Corepack so the project runs with the expected Yarn version.

**Windows (PowerShell):**

```powershell
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

**Linux:**

```bash
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

**macOS:**

```bash
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

If you prefer following the latest stable release tracked by Yarn instead of pinning `4.14.0`, use:

```bash
yarn set version stable
```

Verify the active version:

```bash
yarn --version
```

## 3) Install dependencies

```bash
yarn install
```

## 4) Install Playwright browsers

```bash
yarn playwright install
```

## 5) Configure environment variables

Create or update `.env` in the project root:

```properties
BASE_URL=https://automationteststore.com/index.php?rt=account/login
USERNAME=tester_champion
PASSWORD=123123
```
