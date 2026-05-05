# language: en
@api
@swapi
@smoke
Feature: Test Star Wars API (SWAPI)
  As a test developer
  I want to validate the SWAPI API response
  So that I can ensure film data is accessible

  @allure.label.severity:normal
  @allure.label.suite:API
  @allure.label.feature:SWAPI
  Scenario: Get Star Wars films list successfully
    Given I access the SWAPI films API
    When I make a GET request to "/api/films"
    Then the response should have status 200
    And the response should contain an array of films
    And the array should have more than 0 films
    And each film should have required properties

  @allure.label.severity:normal
  @allure.label.suite:API
  @allure.label.feature:SWAPI
  Scenario Outline: Validate film data structure - <property>
    Given I access the SWAPI films API
    When I make a GET request to "/api/films"
    Then the response should contain an array of films
    And the first film should have property "<property>"

    Examples:
      | property     |
      | title        |
      | episode_id   |
      | director     |
      | producer     |
      | release_date |

  @allure.label.severity:critical
  @allure.label.suite:API
  @allure.label.feature:SWAPI
  Scenario: Validate films response matches JSON Schema
    Given I access the SWAPI films API
    When I make a GET request to "/api/films"
    Then the response should contain an array of films
    And the response should match the SWAPI films JSON Schema
