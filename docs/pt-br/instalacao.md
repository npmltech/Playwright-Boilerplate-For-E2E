# Instalação

## 1) Clonar repositório

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
```

## 2) Instalar o Yarn corretamente para seu sistema operacional

Use o Corepack para garantir que o projeto rode com a versão esperada do Yarn.

**Windows (PowerShell):**

```powershell
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

**Linux:**

```bash
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

**macOS:**

```bash
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

Se preferir acompanhar o release estável mais recente em vez de fixar `4.14.0`:

```bash
yarn set version stable
```

Verificar a versão ativa:

```bash
yarn --version
```

## 3) Instalar dependências

```bash
yarn install
```

## 4) Instalar browsers do Playwright

```bash
yarn playwright install
```

## 5) Configurar variáveis de ambiente

Crie ou atualize o arquivo `.env` na raiz do projeto:

```properties
BASE_URL=https://automationteststore.com/
USERNAME=tester_champion
PASSWORD=123123
```
