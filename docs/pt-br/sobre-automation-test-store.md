# Sobre a Automation Test Store

## O que e

Automation Test Store e um site publico de e-commerce projetado para pratica de QA e automacao.

URL principal usada neste projeto:

- https://automationteststore.com/

## Por que este alvo combina com o projeto

- Publico e estavel o suficiente para execucoes repetidas de login
- Fluxo realista de conta/login
- Util para validar padroes de page object e cenarios BDD

## Area de login mapeada neste projeto

Formulario de cliente recorrente:

- Id do formulario: loginFrm
- Campo de usuario: #loginFrm_loginname
- Campo de senha: #loginFrm_password
- Botao de envio: #loginFrm button[title="Login"]

Indicadores de sucesso apos login:

- URL contem: index.php?rt=account/account
- Link de logout visivel: a[href*="rt=account/logout"]:visible

Indicadores de falha no login:

- Banner de erro: .alert.alert-error ou .alert.alert-danger
- Texto de erro contem termos como incorrect / no match / error

## Credenciais usadas no setup atual

Configuradas no .env:

- USERNAME=tester_champion
- PASSWORD=123123

## Dicas praticas

- Aguarde os controles de login ficarem visiveis antes de preencher os campos
- Mantenha locators presos a ids estaveis ou fragmentos de href explicitos
- Valide sucesso usando URL e um elemento autenticado visivel
