# language: en
@login
@autenticacao
Feature: Login
  As a system user
  I want to access my account with valid or invalid credentials
  To validate the authentication flow behavior

  Background:
    Given that I am on the login page

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Login
  @allure.label.feature:Authentication
  Scenario: Successful login
    When I enter valid credentials
    Then I should be logged in successfully

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Login
  @allure.label.feature:Authentication
  Scenario: Login failure
    When I enter invalid credentials
    Then I should see an error message

  @regression
  @allure.label.severity:minor
  @allure.label.suite:Login
  @allure.label.feature:Authentication
  Scenario: Navigate to password recovery
    When I click on forgot my password
    Then I should be redirected to the password recovery page

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Login
  @allure.label.feature:Authentication
  Scenario: Login failure with empty credentials
    When I try to log in without filling credentials
    Then I should see an error message
