# language: pt
@login
@autenticacao
Funcionalidade: Login
  Como usuário do sistema
  Quero acessar minha conta com credenciais válidas ou inválidas
  Para validar o comportamento do fluxo de autenticação

  Contexto:
    Dado que eu estou na página de login

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Login
  @allure.label.feature:Autenticacao
  Cenário: Login bem-sucedido
    Quando eu insiro credenciais válidas
    Então eu devo ser logado com sucesso

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Login
  @allure.label.feature:Autenticacao
  Cenário: Falha no login
    Quando eu insiro credenciais inválidas
    Então eu devo ver uma mensagem de erro

  @regression
  @allure.label.severity:minor
  @allure.label.suite:Login
  @allure.label.feature:Autenticacao
  Cenário: Navegar para recuperação de senha
    Quando eu clico em esqueci minha senha
    Então eu devo ser redirecionado para a página de recuperação de senha

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Login
  @allure.label.feature:Autenticacao
  Cenário: Falha no login com credenciais vazias
    Quando eu tento logar sem preencher credenciais
    Então eu devo ver uma mensagem de erro
