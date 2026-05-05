# language: pt
@api
@swapi
@smoke
Funcionalidade: Testar API Star Wars (SWAPI)
  Como um desenvolvedor de testes
  Eu quero validar a resposta da API SWAPI
  Para garantir que os dados de filmes estão acessíveis

  @allure.label.severity:normal
  @allure.label.suite:API
  @allure.label.feature:SWAPI
  Cenário: Obter lista de filmes do SWAPI com sucesso
    Dado eu acesso a API SWAPI de filmes
    Quando faço uma requisição GET para "/api/films"
    Então a resposta deve ter status 200
    E a resposta deve conter um array de filmes
    E o array deve ter mais de 0 filmes
    E cada filme deve ter as propriedades obrigatórias

  @allure.label.severity:normal
  @allure.label.suite:API
  @allure.label.feature:SWAPI
  Esquema do Cenário: Validar estrutura de dados do filme - <propriedade>
    Dado eu acesso a API SWAPI de filmes
    Quando faço uma requisição GET para "/api/films"
    Então a resposta deve conter um array de filmes
    E o primeiro filme deve ter a propriedade "<propriedade>"

    Exemplos:
      | propriedade  |
      | title        |
      | episode_id   |
      | director     |
      | producer     |
      | release_date |

  @allure.label.severity:critical
  @allure.label.suite:API
  @allure.label.feature:SWAPI
  Cenário: Validar resposta de filmes contra JSON Schema
    Dado eu acesso a API SWAPI de filmes
    Quando faço uma requisição GET para "/api/films"
    Então a resposta deve conter um array de filmes
    E a resposta deve corresponder ao JSON Schema de filmes SWAPI
