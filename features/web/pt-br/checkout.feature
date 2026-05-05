# language: pt
@checkout
@compras
Funcionalidade: Checkout
  Como usuário logado
  Quero finalizar minha compra e confirmar o pedido
  Para validar o processo completo de checkout

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Checkout
  @allure.label.feature:Compras
  Cenário: Prosseguir para checkout
    Dado que eu tenho produtos no carrinho
    Quando eu acesso a página de checkout
    Então eu devo ver o resumo dos produtos

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Checkout
  @allure.label.feature:Compras
  Cenário: Preencher endereço de entrega
    Dado que eu estou na página de checkout
    Quando eu preencho o endereço de entrega
    Então o endereço deve ser validado com sucesso

  @regression
  @allure.label.severity:critical
  @allure.label.suite:Checkout
  @allure.label.feature:Compras
  Cenário: Confirmar pedido
    Dado que eu estou na página de confirmação
    Quando eu confirmo o pedido
    Então eu devo receber a confirmação do pedido
