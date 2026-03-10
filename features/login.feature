# language: pt

Funcionalidade: Login

Cenário: Login bem-sucedido
Dado que eu estou na página de login
Quando eu insiro credenciais válidas
Então eu devo ser logado com sucesso

Cenário: Falha no login
Dado que eu estou na página de login
Quando eu insiro credenciais inválidas
Então eu devo ver uma mensagem de erro