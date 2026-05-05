# language: pt
@register
@autenticacao
Funcionalidade: Cadastro
  Como visitante da aplicação
  Quero criar uma conta e recuperar meu acesso quando necessário
  Para validar os fluxos de cadastro e recuperação de senha

  @regression
  @allure.label.severity:normal
  @allure.label.suite:RecuperacaoSenha
  @allure.label.feature:Autenticacao
  Cenário: Solicitar recuperação de senha com e-mail não cadastrado
    Dado que eu estou na página de recuperação de senha
    Quando eu solicito recuperação com e-mail não cadastrado
    Então eu devo ver uma mensagem informando que o e-mail não foi encontrado

  @smoke
  @regression
  @allure.label.severity:critical
  @allure.label.suite:Cadastro
  @allure.label.feature:Autenticacao
  Cenário: Criar conta com dados válidos
    Dado que eu estou na página de cadastro
    Quando eu preencho os dados obrigatórios válidos
    E eu envio o formulário de cadastro
    Então eu devo ver uma mensagem de conta criada com sucesso

  @regression
  @allure.label.severity:normal
  @allure.label.suite:Cadastro
  @allure.label.feature:Autenticacao
  Cenário: Falha ao criar conta sem aceitar termos
    Dado que eu estou na página de cadastro
    Quando eu preencho os dados obrigatórios válidos sem aceitar os termos
    E eu envio o formulário de cadastro
    Então eu devo ver uma mensagem de erro sobre aceite dos termos
