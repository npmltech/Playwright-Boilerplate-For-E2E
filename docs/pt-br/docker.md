# Guia de Docker

## O que é Docker?

Docker é uma plataforma de containerização que empacota sua aplicação inteira—incluindo dependências, runtime e configurações—em uma unidade portável e isolada chamada **container**. Um container é como uma máquina virtual leve que garante que seus testes rodarem consistentemente em diferentes máquinas: laptop, pipeline de CI/CD ou servidor em nuvem.

Pense assim:
- **Sem Docker**: "Funciona na minha máquina" — diferentes ambientes têm diferentes versões de Node, Playwright, bibliotecas do sistema, etc.
- **Com Docker**: "Funciona num container" — o container carrega tudo que precisa; funciona da mesma forma em qualquer lugar.

## Benefícios do Uso de Docker

### 1. **Consistência de Ambiente**
- Todos os membros da equipe e pipelines de CI rodam testes em ambientes idênticos
- Sem problemas de "mas funciona na minha máquina"
- Elimina conflitos de versão (Node, Yarn, Playwright, browsers)

### 2. **Execução Isolada**
- Testes rodam isolados; não interferem no seu sistema host
- Sem necessidade de instalar browsers e dependências localmente
- Mantém seu ambiente de desenvolvimento limpo

### 3. **Integração Fácil com CI/CD**
- Containers pré-construídos com todas as dependências prontas
- Execução de pipeline mais rápida (camadas em cache significam builds mais rápidos)
- Resultados de teste reproduzíveis em todos os ambientes

### 4. **Captura de Evidência**
- Vídeos, screenshots e relatórios são coletados automaticamente
- Volumes mapeiam outputs do container de volta para sua máquina host
- Perfeito para debugar testes flaky ou coletar evidência

### 5. **Escalabilidade**
- Execute múltiplas instâncias de teste em paralelo em containers
- Prepare-se para futuro de execução distribuída de testes
- Fundação para estratégias de teste cross-browser

## Arquivos de Docker na Pasta `container/`

### 1. **Dockerfile**

O Dockerfile é o blueprint para construir sua imagem de container de testes.

```dockerfile
FROM mcr.microsoft.com/playwright:v1.59.0-noble
```
- Começa com uma imagem pré-construída que inclui Playwright, Node e browsers
- Economiza tempo e garante compatibilidade de browsers

```dockerfile
ENV CI=true \
    CUCUMBER_HEADLESS=1 \
    CUCUMBER_VIDEO=0
```
- Define variáveis de ambiente para o container
- `CI=true` sinaliza que estamos em um ambiente de CI
- `CUCUMBER_VIDEO=0` desabilita vídeo por padrão (pode sobrescrever via CLI)

```dockerfile
RUN corepack enable
```
- Habilita Corepack para gerenciar Yarn (necessário para Yarn 4.x)

```dockerfile
COPY package.json .yarnrc.yml yarn.lock ./
RUN yarn install --immutable
```
- Copia arquivos de dependência e instala com lockfile congelado
- Garante installs reproduzíveis; sem atualizações inesperadas

```dockerfile
COPY . .
```
- Copia seu projeto inteiro para dentro do container
- Tudo que é necessário para os testes agora está dentro

```dockerfile
ENTRYPOINT ["container/docker-entrypoint.sh"]
CMD ["yarn", "test:pw:headless:video"]
```
- Define o script entrypoint (corrige permissões e descarta para usuário não-privilegiado)
- Comando padrão (pode ser sobrescrito por `docker compose run`)

### 2. **docker-compose.yml**

Compose orquestra múltiplos containers e define como eles interagem.

```yaml
services:
  playwright:
    build:
      context: ..
      dockerfile: container/Dockerfile
      network: host
```
- Serviço `playwright` constrói a partir do Dockerfile
- `context: ..` significa que o contexto de build é a raiz do repositório
- `dockerfile: container/Dockerfile` especifica o caminho para o Dockerfile
- `network: host` melhora confiabilidade de build em alguns ambientes

```yaml
    environment:
      - CI=true
      - CUCUMBER_HEADLESS=1
      - CUCUMBER_VIDEO=0
```
- Define variáveis de ambiente de runtime para este serviço

```yaml
    volumes:
      - ../reports:/app/reports
      - ../test-results:/app/test-results
      - ../allure-results:/app/allure-results
```
- Mapeia diretórios da sua máquina host para dentro do container
- Outputs de testes fluem de volta para seu host automaticamente
- Vídeos e relatórios terminam em `./reports/`, `./test-results/`, etc.

**Três serviços são definidos:**
- **playwright** — roda testes Playwright (puros)
- **cucumber** — roda testes Cucumber BDD
- **api** — roda testes de API

Cada um pode rodar independentemente ou juntos.

### 3. **docker-entrypoint.sh**

O script entrypoint roda antes de qualquer comando dentro do container.

```bash
#!/bin/sh
set -e

for dir in allure-results cucumber-reports reports reports/playwright test-results test-results/playwright; do
  mkdir -p "$dir"
done
```
- Cria diretórios de output se não existirem
- Garante que diretórios estejam prontos para mounts de volume

```bash
chown -R pwuser:pwuser allure-results cucumber-reports reports test-results
```
- Muda propriedade dos diretórios de output para o usuário não-root (`pwuser`)
- A imagem base de Docker roda testes como usuário não-privilegiado por segurança
- Sem isso, volumes seriam owned por `root` na sua máquina host

```bash
exec runuser -u pwuser -- "$@"
```
- Descarta de root para usuário não-privilegiado antes de rodar o comando de teste
- Garante que outputs sejam legíveis/escrevíveis na sua máquina host

## Comandos de Docker Básicos

### Construir Imagens de Container

```bash
yarn docker:build
```

Equivalente a:
```bash
docker compose -f container/docker-compose.yml build
```

Constrói (ou reconstrói) imagens para todos os serviços. Execute após atualizar `package.json` ou o Dockerfile.

### Rodar Testes com Evidência em Vídeo

**Testes Playwright:**
```bash
yarn docker:test:pw:video
```

Vídeos salvos em `./reports/playwright/`

**Testes Cucumber:**
```bash
yarn docker:test:cucumber:video
```

Vídeos e relatórios salvos em `./test-results/` e `./cucumber-reports/`

**Testes de API:**
```bash
yarn docker:test:api:video
```

Relatórios salvos em `./allure-results/`

### Execução Interativa de Container

Inicie containers em modo interativo (útil para debug):

```bash
yarn docker:up
```

Isso inicia todos os três serviços e os mantém rodando. Acesse shells de container com:
```bash
docker exec -it container-playwright-1 /bin/sh
```

Pare containers:
```bash
yarn docker:down
```

### Ver Logs ao Vivo

```bash
yarn docker:logs
```

Faz stream de logs de todos os containers rodando em tempo real. Pressione `Ctrl+C` para sair.

### Comandos Docker Compose Genéricos

Para qualquer coisa não coberta pelos atalhos, use:

```bash
yarn docker:compose <command>
```

Exemplos:
```bash
yarn docker:compose ps                 # Lista containers rodando
yarn docker:compose exec playwright sh # Shell em um container rodando
yarn docker:compose logs playwright    # Logs de um serviço
yarn docker:compose run api bash       # Execute um comando diferente no serviço api
```

## Workflow: Rodando Testes no Docker

### 1. Configuração Inicial

```bash
# Construir imagens (isso cacheia camadas, então é rápido próxima vez)
yarn docker:build

# Rodar testes Cucumber com vídeo
yarn docker:test:cucumber:video

# Vídeos aparecem em ./test-results/ e ./cucumber-reports/
```

### 2. Loop de Desenvolvimento

Modifique seus feature files ou definições de steps localmente, depois:

```bash
# Rodar testes novamente (usa imagem em cache, mais rápido)
yarn docker:test:cucumber:video

# Cheque vídeos para falhas
ls test-results/
```

### 3. Debugando um Teste com Falha

```bash
# Inicie containers interativamente
yarn docker:up

# Em outro terminal, abra shell no container
docker exec -it container-cucumber-1 /bin/sh

# Rode uma feature única manualmente
cd /app
yarn test:cucumber:headless:video --tags "@login"

# Visualize logs daquela execução específica
```

### 4. Execução Paralela (CI/CD)

```bash
yarn docker:test:cucumber:video --tags "@web" --parallel 4
```

Docker lida com paralelismo dentro do container.

## Troubleshooting de Docker

### "permission denied while trying to connect to the Docker daemon"

Certifique-se que Docker está rodando e seu usuário está no grupo `docker`:
```bash
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

### "image not found" ou erros de build

Reconstrua imagens:
```bash
yarn docker:build
```

### Vídeos ou relatórios não aparecem no host

Cheque os mapeamentos de volume em `container/docker-compose.yml`. Vídeos devem aparecer em:
- `./reports/` para Playwright
- `./test-results/` para Cucumber
- `./allure-results/` para relatórios Allure

Se desaparecerem, cheque logs do container:
```bash
yarn docker:logs
```

### Container sai imediatamente

Execute em modo interativo para ver o erro:
```bash
docker compose -f container/docker-compose.yml run playwright /bin/sh
```

Depois execute um comando manualmente para debug:
```bash
yarn test:pw:headless:video
```

## Próximos Passos

- Leia [Executando Testes](executando-testes.md) para opções detalhadas de execução de testes
- Veja [Relatórios](relatorios.md) para como visualizar resultados de testes
- Cheque [Solução de Problemas](solucao-de-problemas.md) para mais dicas relacionadas a Docker
