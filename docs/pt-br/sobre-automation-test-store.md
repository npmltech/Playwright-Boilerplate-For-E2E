# Sobre a Automation Test Store

## O que é

Automation Test Store é um site público de e-commerce projetado para prática de QA e automação.

URL principal usada neste projeto:

- https://automationteststore.com/

## Por que este alvo combina com o projeto

- Público e estável o suficiente para execuções repetidas de login
- Fluxo realista de conta/login
- Útil para validar padrões de page object e cenários BDD

## Área de login mapeada neste projeto

Formulário de cliente recorrente:

- Id do formulário: loginFrm
- Campo de usuário: #loginFrm_loginname
- Campo de senha: #loginFrm_password
- Botão de envio: #loginFrm button[title="Login"]

Indicadores de sucesso após login:

- URL contém: index.php?rt=account/account
- Link de logout visível: a[href*="rt=account/logout"]:visible

Indicadores de falha no login:

- Banner de erro: .alert.alert-error ou .alert.alert-danger
- Texto de erro contém termos como incorrect / no match / error

## Credenciais usadas no setup atual

Configuradas no .env:

- TEST_USERNAME=tester_champion
- TEST_PASSWORD=123123

## Dicas práticas

- Aguarde os controles de login ficarem visíveis antes de preencher os campos
- Mantenha locators presos a ids estáveis ou fragmentos de href explícitos
- Valide sucesso usando URL e um elemento autenticado visível
