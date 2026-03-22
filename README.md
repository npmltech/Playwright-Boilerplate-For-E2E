# Playwright BDD Boilerplate for E2E Testing

A complete boilerplate project for End-to-End (E2E) testing using Playwright with Cucumber BDD, TypeScript, and best practices.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [About TesterBud](#-about-testerbud)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Code Quality](#code-quality)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#-best-practices)
- [Useful Links](#-useful-links)

## 📦 Prerequisites

Before you start, make sure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Yarn** (v1.22 or higher) - Install with: `npm install -g yarn`
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
```

### 2. Install dependencies

```bash
yarn install
```

This will install all required packages listed in `package.json`.

### 3. Install Playwright browsers

```bash
yarn playwright install
```

### 4. Setup environment variables

Create a `.env` file in the root directory:

```properties
BASE_URL=https://testerbud.com/practice-login-form
USERNAME=user@premiumbank.com
PASSWORD=Bank@123
```

## 📁 Project Structure

```
Playwright-Boilerplate-For-E2E/
├── config/
│   ├── playwright.config.ts      # Playwright configuration
│   ├── cucumber.config.cjs       # Cucumber BDD configuration
│   └── start-server-if-free.js   # Server startup script
├── features/
│   └── login.feature             # BDD feature files
├── pages/
│   ├── base.page.ts              # Base page object
│   └── login.page.ts             # Login page object
├── steps/
│   └── login.step.ts             # Step definitions
├── support/
│   ├── hooks.ts                  # Before/After hooks
│   └── world.ts                  # Cucumber world context
├── tests/
│   └── e2e/
│       └── login.spec.ts         # Playwright tests
├── data/
│   └── users.ts                  # Test data
├── scripts/
│   └── cucumber-runner.sh        # Cucumber runner script
├── reports/                      # Test reports (generated)
├── allure-results/               # Allure results (generated)
├── cucumber-reports/             # Cucumber reports (generated)
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── eslint.config.ts              # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## ⚙️ Configuration

### Environment Variables (.env)

```properties
# Base URL for your application
BASE_URL=https://testerbud.com/practice-login-form

# Test credentials
USERNAME=user@premiumbank.com
PASSWORD=Bank@123

# Optional: Port for local server
PORT=3000
```

### Playwright Config

Edit `config/playwright.config.ts` to customize:

- **Browsers**: Chrome, Firefox, Safari
- **Timeouts**: Test timeout, navigation timeout
- **Screenshots**: On failure, on success, never
- **Videos**: Recording options
- **Trace**: For debugging

### Cucumber Config

Edit `config/cucumber.config.cjs` to customize:

- **Feature paths**: Where to find `.feature` files
- **Step definitions**: Where to find step files
- **Reporters**: Output formats (HTML, JSON, Allure)

## 🌐 About TesterBud

For detailed information about TesterBud, including setup, features, and best practices, see the separate documentation:

📖 **[Read About TesterBud](./about_testerbud.md)**

This guide covers:

- What is TesterBud and why use it
- Key features and practice applications
- Getting started with the Practice Login Form
- Tips for testing and learning resources

## 🧪 Running Tests

### Run all tests

```bash
yarn test:go
```

### Run tests in headed mode (see browser)

```bash
yarn test:headed
```

### Run tests in debug mode (step-by-step)

```bash
yarn test:debug
```

### Run BDD tests with Cucumber

```bash
yarn cucumber
```

### View test report

```bash
yarn test:report
```

This opens the HTML report in your browser at `http://localhost:9324`.

### Generate Allure report

```bash
yarn allure:report
```

This generates and opens an interactive Allure report.

## 📝 Writing Tests

### BDD Feature Files

Create feature files in `features/` directory:

```gherkin
# language: pt

Funcionalidade: Login

  Cenário: Login bem-sucedido
    Dado que eu estou na página de login
    Quando eu insiro credenciais válidas
    Então eu devo ser logado com sucesso

  Cenário: Falha no login
    Dado que eu estou na página de login
    Quando eu insiro credenciais inválidas
    Então eu devo ver uma mensagem de erro
```

### Page Objects

Create page objects in `pages/` directory:

```typescript
// filepath: pages/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
```

### Step Definitions

Create step definitions in `steps/` directory:

```typescript
// filepath: steps/login.step.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/login.page';

Given('que eu estou na página de login', async function () {
  await this.page.goto(process.env.BASE_URL);
});

When('eu insiro credenciais válidas', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(process.env.USERNAME, process.env.PASSWORD);
});

Then('eu devo ser logado com sucesso', async function () {
  await this.page.waitForURL('**/dashboard');
});
```

## ✅ Code Quality

### ESLint (Code linting)

Check code for issues:

```bash
yarn lint
```

Automatically fix issues:

```bash
yarn lint:fix
```

### Prettier (Code formatting)

Format all code:

```bash
yarn format
```

Check if code is formatted:

```bash
yarn format:check
```

### Combined command

Run linting and formatting:

```bash
yarn format:lint
```

## 📊 Reporting

### HTML Report

Generated automatically after test run in `reports/` folder.

View with:

```bash
yarn test:report
```

### Cucumber Report

Generated in `cucumber-reports/` folder after BDD tests.

Open `cucumber-report.html` in your browser.

### Allure Report

Generate and view with:

```bash
yarn allure:report
```

Or open existing report:

```bash
yarn allure:open
```

### View Allure results

```bash
yarn allure:serve
```

## 🐛 Troubleshooting

### Issue: "require is not defined in ES module scope"

**Solution**: Ensure `package.json` has `"type": "module"`

### Issue: ESLint error about missing rules

**Solution**: Run `yarn add --dev jiti`

### Issue: Playwright browsers not found

**Solution**: Install browsers with `yarn playwright install`

### Issue: Tests timeout

**Solution**: Increase timeout in `playwright.config.ts`:

```typescript
timeout: 60_000, // 60 seconds
```

### Issue: Can't connect to base URL

**Solution**:

1. Check `.env` file has correct `BASE_URL`
2. Verify the application is running
3. Check network connectivity

### Issue: Steps not found

**Solution**:

1. Ensure step files are imported in `cucumber.config.cjs`
2. Check step definitions match feature file text exactly
3. Run `yarn cucumber` to see detailed error messages

## 📚 Best Practices

### Page Objects

- Keep selectors in page objects
- Use descriptive method names
- Don't use test logic in page objects

### Step Definitions

- Use Given/When/Then properly
- Keep steps simple and reusable
- Avoid hardcoded values

### Features

- Write features in business language
- Use scenarios as documentation
- Keep scenarios independent

### Tests

- One assertion per test (when possible)
- Use descriptive test names
- Clean up after tests (screenshots, videos)

## 🔗 Useful Links

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TesterBud Practice Website](https://testerbud.com/)
- [About TesterBud Guide](./about_testerbud.md)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 💬 Support

For issues or questions, please open an issue in the repository.

---

**Happy Testing! 🚀**
