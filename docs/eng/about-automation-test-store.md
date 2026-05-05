# About Automation Test Store

## What it is

Automation Test Store is a public e-commerce site designed for QA and automation practice.

Main URL used in this project:

- https://automationteststore.com/index.php\?rt\=account/login

## Why this target fits this project

- Public and stable enough for repetitive login tests
- Realistic account/login workflow
- Useful for validating page-object patterns and BDD scenarios

## Login area mapped in this project

Returning customer form:

- Form id: loginFrm
- Username input: #loginFrm_loginname
- Password input: #loginFrm_password
- Submit button: #loginFrm button[title="Login"]

Post-login success indicators:

- URL contains: index.php?rt=account/account
- Visible logout link: a[href*="rt=account/logout"]:visible

Negative login indicators:

- Error banner: .alert.alert-error or .alert.alert-danger
- Error text contains terms like incorrect / no match / error

## Credentials used in current setup

Configured in .env:

- USERNAME=tester_champion
- PASSWORD=123123

## Practical tips

- Wait for visible login controls before filling fields
- Keep locators tied to stable ids or explicit href fragments
- Validate both URL and a visible authenticated element for success
