# Convenção de Steps

Use o diretório `steps/` apenas para lógica de automação de negócio.

- Mantenha apenas step definitions Cucumber em `steps/<type>/<locale>/*.step.ts`
- Evite código de debug, exploração, temporário ou mapeamento de página dentro dos step files
- Use `scripts/debug-*.cjs` apenas para investigações pontuais descartáveis
- É seguro excluir scripts de debug após selectors/fluxos estabilizados em pages e steps

A execução paralela carrega apenas arquivos `.step.ts` das pastas de tipo e locale selecionados e ignora entradas com nome de debug.
