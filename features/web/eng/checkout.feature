# language: en
@checkout
@compras
Feature: Checkout
  As a logged-in user
  I want to complete my purchase and confirm the order
  To validate the complete checkout process

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Checkout
  @allure.label.feature:Compras
  Scenario: Proceed to checkout
    Given that I have products in the cart
    When I access the checkout page
    Then I should see the product summary

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Checkout
  @allure.label.feature:Compras
  Scenario: Fill delivery address
    Given that I am on the checkout page
    When I fill the delivery address
    Then the address should be validated successfully

  @regression
  @allure.label.severity:critical
  @allure.label.suite:Checkout
  @allure.label.feature:Compras
  Scenario: Confirm order
    Given that I am on the confirmation page
    When I confirm the order
    Then I should receive order confirmation
