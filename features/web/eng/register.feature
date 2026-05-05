# language: en
@register
@autenticacao
Feature: Registration
  As an application visitor
  I want to create an account and recover access when needed
  To validate registration and password recovery flows

  @regression
  @allure.label.severity:normal
  @allure.label.suite:RecuperacaoSenha
  @allure.label.feature:Autenticacao
  Scenario: Request password recovery with unregistered email
    Given that I am on the password recovery page
    When I request password recovery with an unregistered email
    Then I should see a message saying the email was not found

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Cadastro
  @allure.label.feature:Autenticacao
  Scenario: Create account with valid data
    Given that I am on the registration page
    When I fill in valid required data
    And I submit the registration form
    Then I should see a successful account creation message

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Cadastro
  @allure.label.feature:Autenticacao
  Scenario: Fail to create account without accepting terms
    Given that I am on the registration page
    When I fill in valid required data without accepting terms
    And I submit the registration form
    Then I should see an error message about accepting terms
