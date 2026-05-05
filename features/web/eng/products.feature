# language: en
@products
@funcionalidade
Feature: Products
  As a system user
  I want to view and interact with the product list
  To validate product page behavior

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Produtos
  @allure.label.feature:Catalogo
  Scenario: List all products
    Given that I am on the products page
    When I view the product list
    Then I should see the available product catalog

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Produtos
  @allure.label.feature:Catalogo
  Scenario: Filter products by category
    Given that I am on the products page
    When I filter by a category
    Then I should see only products from that category

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Produtos
  @allure.label.feature:Catalogo
  Scenario: Add product to cart
    Given that I am on the products page
    When I select a product and add it to the cart
    Then the product should be added successfully
