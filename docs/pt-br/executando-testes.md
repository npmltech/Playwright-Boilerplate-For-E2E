# Executando Testes

## Testes Playwright (sem Cucumber, com vídeo)

**Modo headed:**

```bash
yarn test:pw:headed:video
```

**Modo headless:**

```bash
yarn test:pw:headless:video
```

## Executar todos os testes (Playwright + Cucumber, com vídeo e saída detalhada)

**Modo headed (recomendado para validação local):**

```bash
yarn test:all:video:prompt
```

**Modo headless (ideal para CI):**

```bash
yarn test:all:headless:video:prompt
```

**Alias:**

```bash
yarn test:all:video
```

Se o zsh pedir autocorreção de test -> tests, execute com:

```bash
unsetopt correct correctall && yarn test:all:video:prompt
```

## Testes Cucumber (com vídeo, output sempre impresso)

### Sem workers (execução serial)

- Modo headed:

  ```bash
  yarn test:cucumber:no-workers:headed:video
  ```

- Modo headless:

  ```bash
  yarn test:cucumber:no-workers:headless:video
  ```

### Com workers (execução paralela de cenários)

- Modo headed (padrão 4 workers):

  ```bash
  yarn test:cucumber:workers:headed:video
  ```

- Modo headless (padrão 4 workers):

  ```bash
  yarn test:cucumber:workers:headless:video
  ```

- Número de workers customizado:

  ```bash
  CUCUMBER_PARALLEL=6 yarn test:cucumber:workers:headed:video
  CUCUMBER_PARALLEL=6 yarn test:cucumber:workers:headless:video
  ```

## Apenas testes de API

```bash
# Locale padrão (pt-br)
yarn test:api

# Português
yarn test:api:pt-br

# Inglês
yarn test:api:eng
```

## Debug & inspeção

**Modo debug do Playwright:**

```bash
yarn test:debug
```

**Relatório HTML do Playwright:**

```bash
yarn test:report
```

## Variáveis de ambiente

| Variável            | Padrão  | Descrição                                                   |
| ------------------- | ------- | ----------------------------------------------------------- |
| `FEATURE_LOCALE`    | `pt-br` | Seleciona locale de features e steps (`pt-br` ou `eng`)     |
| `CUCUMBER_VIDEO`    | `1`     | Habilitar (`1`) ou desabilitar (`0`) gravação de vídeo      |
| `CUCUMBER_HEADLESS` | `1`     | Executar headless (`1`) ou headed (`0`)                     |
| `CUCUMBER_PARALLEL` | `4`     | Número de workers paralelos                                 |
| `PW_VIDEO_MODE`     | —       | Modo de vídeo Playwright (`on`, `off`, `retain-on-failure`) |
