# language: pt
@products
@funcionalidade
Funcionalidade: Produtos
  Como usuário do sistema
  Quero visualizar e interagir com a lista de produtos
  Para validar o comportamento da página de produtos

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Produtos
  @allure.label.feature:Catalogo
  Cenário: Listar todos os produtos
    Dado que eu estou na página de produtos
    Quando eu visualizo a lista de produtos
    Então eu devo ver o catálogo de produtos disponíveis

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Produtos
  @allure.label.feature:Catalogo
  Cenário: Filtrar produtos por categoria
    Dado que eu estou na página de produtos
    Quando eu filtro por uma categoria
    Então eu devo ver apenas produtos dessa categoria

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Produtos
  @allure.label.feature:Catalogo
  Cenário: Adicionar produto ao carrinho
    Dado que eu estou na página de produtos
    Quando eu seleciono um produto e adiciono ao carrinho
    Então o produto deve ser adicionado com sucesso
