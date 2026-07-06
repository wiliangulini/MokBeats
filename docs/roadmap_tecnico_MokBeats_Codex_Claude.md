# Roadmap Técnico Operacional — MokBeats

Arquivo reorganizado a partir de `prompts_implementacao_revisao_MokBeats.md`.
Objetivo: transformar o planejamento original em um roteiro prático, pequeno e sequencial para execução com **Codex** e revisão com **Claude Code**.

---

## Como usar este roadmap

Para cada etapa, execute nesta ordem:

1. **Codex — Execução/Auditoria:** copie o prompt da etapa e rode no Codex dentro do VS Code, na branch indicada.
2. **Claude Code — Revisão:** depois da execução do Codex, copie o prompt de revisão da mesma etapa e rode no Claude Code.
3. **Codex — Correção pós-revisão:** use somente se o Claude reprovar ou apontar correções objetivas.
4. **Commit pequeno:** faça commit apenas quando a etapa estiver aprovada ou aprovada com observações sem bloqueadores.
5. **Não avance com bloqueadores:** se o Claude marcar como `Reprovado — precisa correção`, corrija antes de iniciar a próxima etapa.

Regras fixas:

- A base de implementação é sempre a branch `dev`.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual/técnica para Dashboard.
- Não fazer merge direto da branch codex.
- Não trocar stack, não migrar Angular, não remover guards/interceptors/services/autenticação.
- Não afirmar que build/testes passaram sem executar os comandos.
- Usar mudanças pequenas, localizadas e reversíveis.

---

## Índice executivo das etapas

| Roadmap | Etapa original                                                                  | Tipo                              | Agente inicial | Risco       | Objetivo                                                                                                                 |
|---      |---                                                                              |---                                |---             |---          |---                                                                                                                       |
| R01     | 1 — Auditoria inicial da branch `dev`                                           | Auditoria / somente leitura       | Codex          | Baixo       | Mapear a estrutura real da branch `dev`, confirmar rotas, módulos, services, guards, dependências e áreas críticas an... |
| R02     | 2 — Auditoria da branch `codex/create-musical-producer-dashboard-design`        | Auditoria / referência visual     | Codex          | Médio       | Entender exatamente o que a branch de dashboard adiciona ou altera, separando o que é reaproveitável visualmente do q... |
| R03     | 3 — Comparação técnica `dev` x branch Dashboard                                 | Decisão técnica / somente leitura | Codex          | Médio       | Definir uma estratégia segura de reaproveitamento da Dashboard codex sem quebrar a arquitetura, rotas, guards e servi... |
| R04     | 4 — Header, Footer e links globais                                              | Implementação                     | Codex          | Baixo/Médio | Corrigir navegação global, link externo do Hub, links do footer, troca de “Testemunhos” por “Termos e Condições” e in... |
| R05     | 5 — Home e navegação institucional                                              | Implementação                     | Codex          | Médio       | Corrigir botões quebrados da Home, remover `href="#"`, direcionar “Saiba mais” relacionado a produtores para `/produt... |
| R06     | 6 — Login e correção de fonte/renderização do tipo de perfil                    | Implementação                     | Codex          | Médio       | Corrigir o bug visual dos “pontinhos”/fonte no seletor de tipo de perfil sem alterar os valores enviados ao backend n... |
| R07     | 7A — Página de Músicas — navegação, botões e layout                             | Implementação crítica             | Codex          | Alto        | Corrigir ações quebradas da listagem de músicas, remover links vazios, evitar navegação indevida para Home e ajustar...  |
| R08     | 7B — Página de Músicas — modal de seleção de licença                            | Implementação crítica             | Codex          | Alto        | Criar ou adaptar um modal de seleção de licença antes do carrinho, no estilo premium/musical, sem adicionar item dire... |
| R09     | 7C — Página de Músicas — integrar licença escolhida ao carrinho                 | Implementação crítica             | Codex          | Alto        | Conectar a licença selecionada no modal ao carrinho, preservando dados da música, licença, preço e fluxo escolher mús... |
| R10     | 8A — Player geral — índice, metadados e ações principais                        | Implementação crítica             | Codex          | Alto        | Estabilizar o player global para tocar a música correta, evitar índice baseado em `id - 1`, remover metadados hard-co... |
| R11     | 8B — Waveform por item — lazy loading, clique e sincronização básica            | Implementação crítica             | Codex          | Alto        | Revisar e estabilizar o componente de waveform por item, preservando lazy loading, cache/preload, seek e comunicação...  |
| R12     | 8C — Player e stems — carregamento, sincronização e modo de reprodução          | Implementação crítica             | Codex          | Alto        | Revisar suporte a stems para garantir carregamento pelo endpoint existente, sincronização com faixa principal, play/p... |
| R13     | 9 — Filtros, minimizar filtro e comportamento no scroll                         | Implementação                     | Codex          | Médio/Alto  | Corrigir filtros da página de músicas para abrir/fechar de forma previsível, não sumir indevidamente no scroll e mant... |
| R14     | 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend           | Auditoria técnica                 | Codex          | Médio       | Mapear a implementação atual de Efeitos Sonoros, identificar dados estáticos/mockados, paginação fixa, ausência de en... |
| R15     | 10B — Efeitos Sonoros — visual, botões e paginação padronizada                  | Implementação                     | Codex          | Alto        | Padronizar layout, botões e paginação de Efeitos Sonoros com a página de Músicas, sem criar mocks permanentes nem inv... |
| R16     | 10C — Efeitos Sonoros — player/waveform/licença quando houver dados suficientes | Implementação condicional         | Codex          | Alto        | Integrar Efeitos Sonoros ao fluxo de preview/player/licença/carrinho somente se houver dados de áudio suficientes e c... |
| R17     | 11A — Upload do Produtor — reorganização visual Single/Stems/FX                 | Implementação crítica             | Codex          | Alto        | Reorganizar a UI de upload para os modos Single Track, Single Track + Stems e Efeitos FX, com campos corretos por mod... |
| R18     | 11B — Upload do Produtor — validações, duração e FormData                       | Implementação crítica             | Codex          | Alto        | Validar que a reorganização visual preservou duração, obrigatoriedade por modo, montagem de `FormData` e payload espe... |
| R19     | 12A — Página do Artista — HTML válido e separação de responsabilidade           | Implementação                     | Codex          | Médio       | Corrigir HTML inválido da página do artista, reduzir navegação quebrada e evitar misturar perfil público com área pri... |
| R20     | 12B — Área do produtor — menu lateral, rotas e proteção por perfil              | Implementação                     | Codex          | Médio/Alto  | Garantir que a navegação da área do produtor tenha Dashboard primeiro e links para Assinatura, Pedidos, Dados Pessoai... |
| R21     | 13A — Dashboard Produtor — auditoria da base `dev` e contrato de dados          | Auditoria técnica                 | Codex          | Médio       | Mapear DashboardProdutorComponent da `dev`, DashboardService, models, endpoints, estados de loading/erro/vazio e lacu... |
| R22     | 13B — Dashboard Produtor — adaptar visual da branch codex sem merge direto      | Implementação crítica             | Codex          | Alto        | Melhorar visual da Dashboard existente em `src/app/dashboard-produtor` aproveitando ideias da branch codex, mantendo...  |
| R23     | 13C — Dashboard Produtor — gráficos, estados e responsividade                   | Implementação condicional         | Codex          | Alto        | Implementar gráficos/visualizações ou placeholders profissionais da Dashboard conforme dados disponíveis, sem dependê... |
| R24     | 14A — Pricing — toggle 6/12 meses e cards responsivos                           | Implementação                     | Codex          | Médio/Alto  | Transformar a alternância 6/12 meses em estado Angular real, remover `href=""` de tabs e corrigir responsividade dos...  |
| R25     | 14B — FAQ — navegação, padronização visual e responsividade                     | Implementação                     | Codex          | Médio       | Garantir que FAQ seja acessível a partir de Pricing e tenha layout padronizado/coerente com páginas institucionais co... |
| R26     | 15A — Carrinho — modelo de item, contador e revisão de dados de licença         | Implementação crítica             | Codex          | Alto        | Revisar carrinho para suportar item com licença escolhida, exibir dados corretos, evitar manipulação direta frágil do... |
| R27     | 15B — Checkout e fechamento do pedido                                           | Implementação crítica             | Codex          | Alto        | Estruturar fluxo de fechamento com revisão de carrinho, nome do projeto, comentários, aceite de termos e envio/simula... |
| R28     | 16 — QA final e regressão completa                                              | QA / revisão final                | Claude Code    | Médio/Alto  | Executar revisão final completa de build, testes, responsividade, fluxos de comprador/produtor e regressões nas áreas... |

---

## Roadmap detalhado com prompts separados

---

# R01 — Etapa 1 — Auditoria inicial da branch `dev`

**Referência original:** Etapa 1 — Auditoria inicial da branch `dev`
**Tipo:** Auditoria / somente leitura
**Agente inicial recomendado:** Codex
**Risco:** Baixo

## Objetivo da etapa

Mapear a estrutura real da branch `dev`, confirmar rotas, módulos, services, guards, dependências e áreas críticas antes de qualquer alteração.

## Escopo / arquivos prováveis

`PROJECT_RULES.md`, `AGENTS.md`, `package.json`, `angular.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu/*`, `src/app/home/*`, `src/app/login/*`, `src/app/musicas/*`, `src/app/player/*`, `src/app/wave-surfer-test/*`, `src/app/produtores/*`, `src/app/dashboard-produtor/*`, `src/app/service/*`, `src/app/guards/*`, `src/app/interceptors/*` ou equivalentes localizados no projeto.

## Critérios de aceite

- [ ] Nenhum arquivo de código foi alterado.
- [ ] Relatório lista arquivos reais encontrados.
- [ ] Rotas protegidas, guards e interceptors foram identificados.
- [ ] Dependências e scripts foram confirmados.
- [ ] Riscos por área foram registrados.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Etapa obrigatória antes de qualquer implementação. O relatório desta etapa deve ser usado como referência pelos prompts seguintes.

## Prompt Codex — Execução / Auditoria

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 1 — Auditoria inicial da branch `dev`

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Mapear a estrutura real da branch `dev`, confirmar rotas, módulos, services, guards, dependências e áreas críticas antes de qualquer alteração.

## Arquivos que devem ser lidos antes de alterar
`PROJECT_RULES.md`, `AGENTS.md`, `package.json`, `angular.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu/*`, `src/app/home/*`, `src/app/login/*`, `src/app/musicas/*`, `src/app/player/*`, `src/app/wave-surfer-test/*`, `src/app/produtores/*`, `src/app/dashboard-produtor/*`, `src/app/service/*`, `src/app/guards/*`, `src/app/interceptors/*` ou equivalentes localizados no projeto.

## Arquivos prováveis de alteração
`PROJECT_RULES.md`, `AGENTS.md`, `package.json`, `angular.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu/*`, `src/app/home/*`, `src/app/login/*`, `src/app/musicas/*`, `src/app/player/*`, `src/app/wave-surfer-test/*`, `src/app/produtores/*`, `src/app/dashboard-produtor/*`, `src/app/service/*`, `src/app/guards/*`, `src/app/interceptors/*` ou equivalentes localizados no projeto.

## Tarefas técnicas em ordem
1. Confirmar branch atual e estado do repositório com `git branch` e `git status`.
2. Ler os arquivos de regras do projeto e resumir restrições que impactam implementação.
3. Mapear scripts disponíveis em `package.json` e versão das dependências principais.
4. Mapear rotas públicas, privadas, guards aplicados e módulos carregados.
5. Listar services de autenticação, carrinho, músicas, upload, dashboard e player.
6. Identificar áreas críticas com alto risco de regressão: player/WaveSurfer, stems, filtros, carrinho, upload e dashboard.
7. Gerar relatório de auditoria sem editar arquivos.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Nenhum arquivo de código foi alterado.
- Relatório lista arquivos reais encontrados.
- Rotas protegidas, guards e interceptors foram identificados.
- Dependências e scripts foram confirmados.
- Riscos por área foram registrados.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 1.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 1 — Auditoria inicial da branch `dev`

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Mapear a estrutura real da branch `dev`, confirmar rotas, módulos, services, guards, dependências e áreas críticas antes de qualquer alteração.

## Arquivos que devem ser inspecionados
`PROJECT_RULES.md`, `AGENTS.md`, `package.json`, `angular.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu/*`, `src/app/home/*`, `src/app/login/*`, `src/app/musicas/*`, `src/app/player/*`, `src/app/wave-surfer-test/*`, `src/app/produtores/*`, `src/app/dashboard-produtor/*`, `src/app/service/*`, `src/app/guards/*`, `src/app/interceptors/*` ou equivalentes localizados no projeto.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Confirmar branch atual e estado do repositório com `git branch` e `git status`.
2. Ler os arquivos de regras do projeto e resumir restrições que impactam implementação.
3. Mapear scripts disponíveis em `package.json` e versão das dependências principais.
4. Mapear rotas públicas, privadas, guards aplicados e módulos carregados.
5. Listar services de autenticação, carrinho, músicas, upload, dashboard e player.
6. Identificar áreas críticas com alto risco de regressão: player/WaveSurfer, stems, filtros, carrinho, upload e dashboard.
7. Gerar relatório de auditoria sem editar arquivos.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Nenhum arquivo de código foi alterado.
- Relatório lista arquivos reais encontrados.
- Rotas protegidas, guards e interceptors foram identificados.
- Dependências e scripts foram confirmados.
- Riscos por área foram registrados.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 1 — Auditoria inicial da branch `dev`

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 1 — Auditoria inicial da branch `dev` e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`PROJECT_RULES.md`, `AGENTS.md`, `package.json`, `angular.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu/*`, `src/app/home/*`, `src/app/login/*`, `src/app/musicas/*`, `src/app/player/*`, `src/app/wave-surfer-test/*`, `src/app/produtores/*`, `src/app/dashboard-produtor/*`, `src/app/service/*`, `src/app/guards/*`, `src/app/interceptors/*` ou equivalentes localizados no projeto.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R02 — Etapa 2 — Auditoria da branch `codex/create-musical-producer-dashboard-design`

**Referência original:** Etapa 2 — Auditoria da branch `codex/create-musical-producer-dashboard-design`
**Tipo:** Auditoria / referência visual
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Entender exatamente o que a branch de dashboard adiciona ou altera, separando o que é reaproveitável visualmente do que deve ser descartado.

## Escopo / arquivos prováveis

Branch remota `origin/codex/create-musical-producer-dashboard-design`, especialmente `src/app/produtor-dashboard/*`, `src/assets/icons/*`, `package.json`, `package-lock.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu-produtor/menu-produtor.component.html`.

## Critérios de aceite

- [ ] Nenhum merge direto foi feito.
- [ ] Relatório identifica arquivos criados/alterados pela branch codex.
- [ ] Relatório separa reaproveitar, adaptar e descartar.
- [ ] Riscos de dependência como `apexcharts/ng-apexcharts` foram avaliados.
- [ ] A `dev` continua como base de trabalho.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Esta etapa é somente para aprendizado visual e técnico. Não substitui a implementação da Dashboard existente na `dev`.

## Prompt Codex — Execução / Auditoria

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 2 — Auditoria da branch `codex/create-musical-producer-dashboard-design`

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Entender exatamente o que a branch de dashboard adiciona ou altera, separando o que é reaproveitável visualmente do que deve ser descartado.

## Arquivos que devem ser lidos antes de alterar
Branch remota `origin/codex/create-musical-producer-dashboard-design`, especialmente `src/app/produtor-dashboard/*`, `src/assets/icons/*`, `package.json`, `package-lock.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu-produtor/menu-produtor.component.html`.

## Arquivos prováveis de alteração
Branch remota `origin/codex/create-musical-producer-dashboard-design`, especialmente `src/app/produtor-dashboard/*`, `src/assets/icons/*`, `package.json`, `package-lock.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu-produtor/menu-produtor.component.html`.

## Tarefas técnicas em ordem
1. Buscar branches remotas com `git fetch origin` e confirmar existência da branch de dashboard.
2. Usar `git show` e `git diff`, sem trocar a base de implementação da `dev` permanentemente.
3. Mapear arquivos novos, arquivos alterados e dependências adicionadas pela branch codex.
4. Identificar mocks, arrays estáticos, ausência de guards, mudanças em rotas e alterações em `app.module.ts`.
5. Separar itens reaproveitáveis: cards, ícones, layout, tabela, estrutura visual.
6. Separar itens descartáveis: mocks permanentes, remoção de guards, rota sem proteção, substituição de service real.
7. Gerar relatório comparativo sem aplicar merge direto.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Nenhum merge direto foi feito.
- Relatório identifica arquivos criados/alterados pela branch codex.
- Relatório separa reaproveitar, adaptar e descartar.
- Riscos de dependência como `apexcharts/ng-apexcharts` foram avaliados.
- A `dev` continua como base de trabalho.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 2.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 2 — Auditoria da branch `codex/create-musical-producer-dashboard-design`

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Entender exatamente o que a branch de dashboard adiciona ou altera, separando o que é reaproveitável visualmente do que deve ser descartado.

## Arquivos que devem ser inspecionados
Branch remota `origin/codex/create-musical-producer-dashboard-design`, especialmente `src/app/produtor-dashboard/*`, `src/assets/icons/*`, `package.json`, `package-lock.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu-produtor/menu-produtor.component.html`.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Buscar branches remotas com `git fetch origin` e confirmar existência da branch de dashboard.
2. Usar `git show` e `git diff`, sem trocar a base de implementação da `dev` permanentemente.
3. Mapear arquivos novos, arquivos alterados e dependências adicionadas pela branch codex.
4. Identificar mocks, arrays estáticos, ausência de guards, mudanças em rotas e alterações em `app.module.ts`.
5. Separar itens reaproveitáveis: cards, ícones, layout, tabela, estrutura visual.
6. Separar itens descartáveis: mocks permanentes, remoção de guards, rota sem proteção, substituição de service real.
7. Gerar relatório comparativo sem aplicar merge direto.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Nenhum merge direto foi feito.
- Relatório identifica arquivos criados/alterados pela branch codex.
- Relatório separa reaproveitar, adaptar e descartar.
- Riscos de dependência como `apexcharts/ng-apexcharts` foram avaliados.
- A `dev` continua como base de trabalho.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 2 — Auditoria da branch `codex/create-musical-producer-dashboard-design`

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 2 — Auditoria da branch `codex/create-musical-producer-dashboard-design` e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
Branch remota `origin/codex/create-musical-producer-dashboard-design`, especialmente `src/app/produtor-dashboard/*`, `src/assets/icons/*`, `package.json`, `package-lock.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/menu-produtor/menu-produtor.component.html`.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R03 — Etapa 3 — Comparação técnica `dev` x branch Dashboard

**Referência original:** Etapa 3 — Comparação técnica `dev` x branch Dashboard
**Tipo:** Decisão técnica / somente leitura
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Definir uma estratégia segura de reaproveitamento da Dashboard codex sem quebrar a arquitetura, rotas, guards e services da branch `dev`.

## Escopo / arquivos prováveis

`src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/dashboard-produtor/*`, `src/app/produtor-dashboard/*` na branch codex via `git show`, `src/app/sub-menu/*`, `src/app/menu-produtor/*`, `package.json` de ambas as branches.

## Critérios de aceite

- [ ] Existe decisão clara de não fazer merge direto.
- [ ] Dashboard final permanecerá em `src/app/dashboard-produtor`.
- [ ] Guards da rota protegida serão preservados.
- [ ] Dados reais via `DashboardService` terão prioridade.
- [ ] Dependências novas só serão sugeridas com justificativa.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Só avance para implementar Dashboard depois que esta comparação estiver aprovada.

## Prompt Codex — Execução / Auditoria

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 3 — Comparação técnica `dev` x branch Dashboard

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Definir uma estratégia segura de reaproveitamento da Dashboard codex sem quebrar a arquitetura, rotas, guards e services da branch `dev`.

## Arquivos que devem ser lidos antes de alterar
`src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/dashboard-produtor/*`, `src/app/produtor-dashboard/*` na branch codex via `git show`, `src/app/sub-menu/*`, `src/app/menu-produtor/*`, `package.json` de ambas as branches.

## Arquivos prováveis de alteração
`src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/dashboard-produtor/*`, `src/app/produtor-dashboard/*` na branch codex via `git show`, `src/app/sub-menu/*`, `src/app/menu-produtor/*`, `package.json` de ambas as branches.

## Tarefas técnicas em ordem
1. Comparar rota `/dashboard-produtor` nas duas branches.
2. Comparar módulos importados e componentes declarados em `app.module.ts`.
3. Comparar menu produtor/sub-menu e visibilidade por perfil.
4. Comparar `DashboardService` da `dev` com dados mockados da branch codex.
5. Gerar matriz: manter da `dev`, adaptar da codex, descartar da codex.
6. Definir se gráficos entram no MVP ou se devem ficar como placeholders controlados.
7. Gerar plano de implementação da Dashboard baseado em `src/app/dashboard-produtor`, não em `src/app/produtor-dashboard`.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Existe decisão clara de não fazer merge direto.
- Dashboard final permanecerá em `src/app/dashboard-produtor`.
- Guards da rota protegida serão preservados.
- Dados reais via `DashboardService` terão prioridade.
- Dependências novas só serão sugeridas com justificativa.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 3.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 3 — Comparação técnica `dev` x branch Dashboard

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Definir uma estratégia segura de reaproveitamento da Dashboard codex sem quebrar a arquitetura, rotas, guards e services da branch `dev`.

## Arquivos que devem ser inspecionados
`src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/dashboard-produtor/*`, `src/app/produtor-dashboard/*` na branch codex via `git show`, `src/app/sub-menu/*`, `src/app/menu-produtor/*`, `package.json` de ambas as branches.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Comparar rota `/dashboard-produtor` nas duas branches.
2. Comparar módulos importados e componentes declarados em `app.module.ts`.
3. Comparar menu produtor/sub-menu e visibilidade por perfil.
4. Comparar `DashboardService` da `dev` com dados mockados da branch codex.
5. Gerar matriz: manter da `dev`, adaptar da codex, descartar da codex.
6. Definir se gráficos entram no MVP ou se devem ficar como placeholders controlados.
7. Gerar plano de implementação da Dashboard baseado em `src/app/dashboard-produtor`, não em `src/app/produtor-dashboard`.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Existe decisão clara de não fazer merge direto.
- Dashboard final permanecerá em `src/app/dashboard-produtor`.
- Guards da rota protegida serão preservados.
- Dados reais via `DashboardService` terão prioridade.
- Dependências novas só serão sugeridas com justificativa.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 3 — Comparação técnica `dev` x branch Dashboard

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 3 — Comparação técnica `dev` x branch Dashboard e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/app-routing.module.ts`, `src/app/app.module.ts`, `src/app/dashboard-produtor/*`, `src/app/produtor-dashboard/*` na branch codex via `git show`, `src/app/sub-menu/*`, `src/app/menu-produtor/*`, `package.json` de ambas as branches.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R04 — Etapa 4 — Header, Footer e links globais

**Referência original:** Etapa 4 — Header, Footer e links globais
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Baixo/Médio

## Objetivo da etapa

Corrigir navegação global, link externo do Hub, links do footer, troca de “Testemunhos” por “Termos e Condições” e inclusão de LinkedIn sem afetar autenticação, carrinho ou menu mobile.

## Escopo / arquivos prováveis

`src/app/menu/menu.component.html`, `src/app/menu/menu.component.ts`, `src/app/menu/menu.component.scss`, `src/app/footer/footer.component.html`, `src/app/footer/footer.component.ts`, `src/app/footer/footer.component.scss`, arquivos de rotas institucionais existentes.

## Critérios de aceite

- [ ] HUB abre corretamente em nova aba.
- [ ] Footer não contém “Testemunhos”.
- [ ] Links internos não usam `href="#"` ou `href=""`.
- [ ] Links externos têm `target` e `rel` seguros.
- [ ] Menu mobile continua funcional.
- [ ] Nenhum guard/interceptor/service foi alterado.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Não reescrever o menu inteiro. A alteração deve ser localizada em navegação e links.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 4 — Header, Footer e links globais

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Corrigir navegação global, link externo do Hub, links do footer, troca de “Testemunhos” por “Termos e Condições” e inclusão de LinkedIn sem afetar autenticação, carrinho ou menu mobile.

## Arquivos que devem ser lidos antes de alterar
`src/app/menu/menu.component.html`, `src/app/menu/menu.component.ts`, `src/app/menu/menu.component.scss`, `src/app/footer/footer.component.html`, `src/app/footer/footer.component.ts`, `src/app/footer/footer.component.scss`, arquivos de rotas institucionais existentes.

## Arquivos prováveis de alteração
`src/app/menu/menu.component.html`, `src/app/menu/menu.component.ts`, `src/app/menu/menu.component.scss`, `src/app/footer/footer.component.html`, `src/app/footer/footer.component.ts`, `src/app/footer/footer.component.scss`, arquivos de rotas institucionais existentes.

## Tarefas técnicas em ordem
1. Ler implementação atual de Header/Menu e Footer antes de alterar.
2. Confirmar se a logo já existe e apenas ajustar destino/tamanho se necessário.
3. Corrigir item `HUB` para `https://www.mokbeats-hub.com/` com abertura segura em nova aba.
4. Trocar “Testemunhos” por “Termos e Condições” no footer e conectar à rota interna existente; se rota não existir, registrar pendência em vez de inventar rota sem validação.
5. Adicionar LinkedIn somente com URL real disponível; se não houver URL oficial no código/documentos, criar placeholder comentado ou pendência explícita, não link falso.
6. Revisar links sociais existentes para remover URLs de terceiros incorretas quando houver destino oficial conhecido.
7. Garantir que links internos usem `routerLink` e externos usem `target="_blank" rel="noopener noreferrer"`.
8. Testar menu desktop/mobile e contador de carrinho visualmente quando possível.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- HUB abre corretamente em nova aba.
- Footer não contém “Testemunhos”.
- Links internos não usam `href="#"` ou `href=""`.
- Links externos têm `target` e `rel` seguros.
- Menu mobile continua funcional.
- Nenhum guard/interceptor/service foi alterado.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 4.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 4 — Header, Footer e links globais

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Corrigir navegação global, link externo do Hub, links do footer, troca de “Testemunhos” por “Termos e Condições” e inclusão de LinkedIn sem afetar autenticação, carrinho ou menu mobile.

## Arquivos que devem ser inspecionados
`src/app/menu/menu.component.html`, `src/app/menu/menu.component.ts`, `src/app/menu/menu.component.scss`, `src/app/footer/footer.component.html`, `src/app/footer/footer.component.ts`, `src/app/footer/footer.component.scss`, arquivos de rotas institucionais existentes.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler implementação atual de Header/Menu e Footer antes de alterar.
2. Confirmar se a logo já existe e apenas ajustar destino/tamanho se necessário.
3. Corrigir item `HUB` para `https://www.mokbeats-hub.com/` com abertura segura em nova aba.
4. Trocar “Testemunhos” por “Termos e Condições” no footer e conectar à rota interna existente; se rota não existir, registrar pendência em vez de inventar rota sem validação.
5. Adicionar LinkedIn somente com URL real disponível; se não houver URL oficial no código/documentos, criar placeholder comentado ou pendência explícita, não link falso.
6. Revisar links sociais existentes para remover URLs de terceiros incorretas quando houver destino oficial conhecido.
7. Garantir que links internos usem `routerLink` e externos usem `target="_blank" rel="noopener noreferrer"`.
8. Testar menu desktop/mobile e contador de carrinho visualmente quando possível.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- HUB abre corretamente em nova aba.
- Footer não contém “Testemunhos”.
- Links internos não usam `href="#"` ou `href=""`.
- Links externos têm `target` e `rel` seguros.
- Menu mobile continua funcional.
- Nenhum guard/interceptor/service foi alterado.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 4 — Header, Footer e links globais

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 4 — Header, Footer e links globais e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/menu/menu.component.html`, `src/app/menu/menu.component.ts`, `src/app/menu/menu.component.scss`, `src/app/footer/footer.component.html`, `src/app/footer/footer.component.ts`, `src/app/footer/footer.component.scss`, arquivos de rotas institucionais existentes.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R05 — Etapa 5 — Home e navegação institucional

**Referência original:** Etapa 5 — Home e navegação institucional
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Corrigir botões quebrados da Home, remover `href="#"`, direcionar “Saiba mais” relacionado a produtores para `/produtores` e preservar o fluxo de download/músicas recentes.

## Escopo / arquivos prováveis

`src/app/home/home.component.html`, `src/app/home/home.component.ts`, `src/app/home/home.component.scss`, serviços usados para últimas músicas/download/player, rotas relacionadas a `/musicas`, `/precos`, `/produtores`.

## Critérios de aceite

- [ ] Nenhum botão principal da Home fica sem ação.
- [ ] Não há `href="#"` em botões principais.
- [ ] Rota de produtores funciona sem reload.
- [ ] Download/preview existente não foi quebrado.
- [ ] Build continua passando ou erro pré-existente foi documentado.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

A etapa é institucional; não alterar player/músicas além do necessário para preservar chamadas existentes.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 5 — Home e navegação institucional

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Corrigir botões quebrados da Home, remover `href="#"`, direcionar “Saiba mais” relacionado a produtores para `/produtores` e preservar o fluxo de download/músicas recentes.

## Arquivos que devem ser lidos antes de alterar
`src/app/home/home.component.html`, `src/app/home/home.component.ts`, `src/app/home/home.component.scss`, serviços usados para últimas músicas/download/player, rotas relacionadas a `/musicas`, `/precos`, `/produtores`.

## Arquivos prováveis de alteração
`src/app/home/home.component.html`, `src/app/home/home.component.ts`, `src/app/home/home.component.scss`, serviços usados para últimas músicas/download/player, rotas relacionadas a `/musicas`, `/precos`, `/produtores`.

## Tarefas técnicas em ordem
1. Mapear todos os botões e links da Home com seus destinos atuais.
2. Substituir `href="#"` por `routerLink`, `<button type="button">` com método Angular, ou remover ação se for decorativo.
3. Direcionar “Saiba mais”/seção de produtores para `/produtores` ou rota existente equivalente.
4. Preservar o botão que leva a músicas e o botão de licenças/preços.
5. Não alterar lógica de carregamento de últimas músicas, player ou download sem necessidade.
6. Garantir que os botões não causem reload da aplicação.
7. Validar responsividade básica da seção alterada.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Nenhum botão principal da Home fica sem ação.
- Não há `href="#"` em botões principais.
- Rota de produtores funciona sem reload.
- Download/preview existente não foi quebrado.
- Build continua passando ou erro pré-existente foi documentado.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 5.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 5 — Home e navegação institucional

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Corrigir botões quebrados da Home, remover `href="#"`, direcionar “Saiba mais” relacionado a produtores para `/produtores` e preservar o fluxo de download/músicas recentes.

## Arquivos que devem ser inspecionados
`src/app/home/home.component.html`, `src/app/home/home.component.ts`, `src/app/home/home.component.scss`, serviços usados para últimas músicas/download/player, rotas relacionadas a `/musicas`, `/precos`, `/produtores`.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Mapear todos os botões e links da Home com seus destinos atuais.
2. Substituir `href="#"` por `routerLink`, `<button type="button">` com método Angular, ou remover ação se for decorativo.
3. Direcionar “Saiba mais”/seção de produtores para `/produtores` ou rota existente equivalente.
4. Preservar o botão que leva a músicas e o botão de licenças/preços.
5. Não alterar lógica de carregamento de últimas músicas, player ou download sem necessidade.
6. Garantir que os botões não causem reload da aplicação.
7. Validar responsividade básica da seção alterada.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Nenhum botão principal da Home fica sem ação.
- Não há `href="#"` em botões principais.
- Rota de produtores funciona sem reload.
- Download/preview existente não foi quebrado.
- Build continua passando ou erro pré-existente foi documentado.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 5 — Home e navegação institucional

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 5 — Home e navegação institucional e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/home/home.component.html`, `src/app/home/home.component.ts`, `src/app/home/home.component.scss`, serviços usados para últimas músicas/download/player, rotas relacionadas a `/musicas`, `/precos`, `/produtores`.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R06 — Etapa 6 — Login e correção de fonte/renderização do tipo de perfil

**Referência original:** Etapa 6 — Login e correção de fonte/renderização do tipo de perfil
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Corrigir o bug visual dos “pontinhos”/fonte no seletor de tipo de perfil sem alterar os valores enviados ao backend nem quebrar login/cadastro.

## Escopo / arquivos prováveis

`src/app/login/login.component.html`, `src/app/login/login.component.ts`, `src/app/login/login.component.scss`, `src/app/login/auth.service.ts` ou `src/app/auth.service.ts` conforme estrutura real.

## Critérios de aceite

- [ ] Labels de perfil aparecem legíveis.
- [ ] `comprador` e `produtor` continuam sendo os valores funcionais.
- [ ] Login e cadastro não foram alterados indevidamente.
- [ ] Tooltip/ajuda visual continua utilizável.
- [ ] Correção está isolada no login.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Não reimplementar autenticação. Esta etapa é bugfix visual/UX.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 6 — Login e correção de fonte/renderização do tipo de perfil

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Corrigir o bug visual dos “pontinhos”/fonte no seletor de tipo de perfil sem alterar os valores enviados ao backend nem quebrar login/cadastro.

## Arquivos que devem ser lidos antes de alterar
`src/app/login/login.component.html`, `src/app/login/login.component.ts`, `src/app/login/login.component.scss`, `src/app/login/auth.service.ts` ou `src/app/auth.service.ts` conforme estrutura real.

## Arquivos prováveis de alteração
`src/app/login/login.component.html`, `src/app/login/login.component.ts`, `src/app/login/login.component.scss`, `src/app/login/auth.service.ts` ou `src/app/auth.service.ts` conforme estrutura real.

## Tarefas técnicas em ordem
1. Inspecionar HTML, CSS e TS do seletor/custom select de perfil.
2. Confirmar quais valores são enviados para backend: `comprador` e `produtor`.
3. Investigar se “pontinhos” vêm de `text-overflow`, fonte de ícone, pseudo-elemento, tooltip, Material Icons, overflow ou largura insuficiente.
4. Corrigir CSS de forma localizada no componente de login.
5. Preservar tooltip, acessibilidade e seleção visual quando possível.
6. Não alterar payload de login/cadastro, token, `localStorage` ou regra de perfil.
7. Validar visual em Chrome e Firefox quando possível.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Labels de perfil aparecem legíveis.
- `comprador` e `produtor` continuam sendo os valores funcionais.
- Login e cadastro não foram alterados indevidamente.
- Tooltip/ajuda visual continua utilizável.
- Correção está isolada no login.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 6.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 6 — Login e correção de fonte/renderização do tipo de perfil

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Corrigir o bug visual dos “pontinhos”/fonte no seletor de tipo de perfil sem alterar os valores enviados ao backend nem quebrar login/cadastro.

## Arquivos que devem ser inspecionados
`src/app/login/login.component.html`, `src/app/login/login.component.ts`, `src/app/login/login.component.scss`, `src/app/login/auth.service.ts` ou `src/app/auth.service.ts` conforme estrutura real.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Inspecionar HTML, CSS e TS do seletor/custom select de perfil.
2. Confirmar quais valores são enviados para backend: `comprador` e `produtor`.
3. Investigar se “pontinhos” vêm de `text-overflow`, fonte de ícone, pseudo-elemento, tooltip, Material Icons, overflow ou largura insuficiente.
4. Corrigir CSS de forma localizada no componente de login.
5. Preservar tooltip, acessibilidade e seleção visual quando possível.
6. Não alterar payload de login/cadastro, token, `localStorage` ou regra de perfil.
7. Validar visual em Chrome e Firefox quando possível.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Labels de perfil aparecem legíveis.
- `comprador` e `produtor` continuam sendo os valores funcionais.
- Login e cadastro não foram alterados indevidamente.
- Tooltip/ajuda visual continua utilizável.
- Correção está isolada no login.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 6 — Login e correção de fonte/renderização do tipo de perfil

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 6 — Login e correção de fonte/renderização do tipo de perfil e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/login/login.component.html`, `src/app/login/login.component.ts`, `src/app/login/login.component.scss`, `src/app/login/auth.service.ts` ou `src/app/auth.service.ts` conforme estrutura real.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R07 — Etapa 7A — Página de Músicas — navegação, botões e layout

**Referência original:** Etapa 7A — Página de Músicas — navegação, botões e layout
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Corrigir ações quebradas da listagem de músicas, remover links vazios, evitar navegação indevida para Home e ajustar alinhamento básico sem mexer ainda no fluxo de licença/carrinho.

## Escopo / arquivos prováveis

`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/musicas/musicas.service.ts`, `src/app/wave-surfer-test/*`, `src/app/player/*` apenas para leitura se necessário.

## Critérios de aceite

- [ ] Clique no nome da música não vai para Home.
- [ ] Links internos usam `routerLink` ou ação Angular.
- [ ] Não há links vazios nos botões principais da listagem.
- [ ] Layout da linha da música fica alinhado em desktop.
- [ ] Player e waveform continuam funcionando como antes.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Subdivisão necessária porque músicas é área P0. Primeiro estabilize navegação antes do fluxo de licença.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 7A — Página de Músicas — navegação, botões e layout

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Corrigir ações quebradas da listagem de músicas, remover links vazios, evitar navegação indevida para Home e ajustar alinhamento básico sem mexer ainda no fluxo de licença/carrinho.

## Arquivos que devem ser lidos antes de alterar
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/musicas/musicas.service.ts`, `src/app/wave-surfer-test/*`, `src/app/player/*` apenas para leitura se necessário.

## Arquivos prováveis de alteração
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/musicas/musicas.service.ts`, `src/app/wave-surfer-test/*`, `src/app/player/*` apenas para leitura se necessário.

## Tarefas técnicas em ordem
1. Mapear todos os `<a>`, botões e handlers da página de músicas.
2. Remover `href="#"` e `href=""` que causam navegação indevida; usar botão para ação e `routerLink` para navegação real.
3. Corrigir clique no nome da música para não redirecionar para Home; ele pode tocar a faixa ou ficar sem navegação, conforme lógica existente mais segura.
4. Revisar link do artista/produtor para evitar combinação de `(click)`, `href` vazio e `[routerLink]` duplicado.
5. Ajustar alinhamento Nome/Waveform/Duração/BPM/Instrumental/Loops com SCSS localizado.
6. Não alterar nesta etapa o modal de licença, carrinho, stems ou service de player, exceto se for necessário para remover navegação quebrada.
7. Registrar qualquer botão que ainda dependa de regra de produto futura.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Clique no nome da música não vai para Home.
- Links internos usam `routerLink` ou ação Angular.
- Não há links vazios nos botões principais da listagem.
- Layout da linha da música fica alinhado em desktop.
- Player e waveform continuam funcionando como antes.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 7A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 7A — Página de Músicas — navegação, botões e layout

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Corrigir ações quebradas da listagem de músicas, remover links vazios, evitar navegação indevida para Home e ajustar alinhamento básico sem mexer ainda no fluxo de licença/carrinho.

## Arquivos que devem ser inspecionados
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/musicas/musicas.service.ts`, `src/app/wave-surfer-test/*`, `src/app/player/*` apenas para leitura se necessário.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Mapear todos os `<a>`, botões e handlers da página de músicas.
2. Remover `href="#"` e `href=""` que causam navegação indevida; usar botão para ação e `routerLink` para navegação real.
3. Corrigir clique no nome da música para não redirecionar para Home; ele pode tocar a faixa ou ficar sem navegação, conforme lógica existente mais segura.
4. Revisar link do artista/produtor para evitar combinação de `(click)`, `href` vazio e `[routerLink]` duplicado.
5. Ajustar alinhamento Nome/Waveform/Duração/BPM/Instrumental/Loops com SCSS localizado.
6. Não alterar nesta etapa o modal de licença, carrinho, stems ou service de player, exceto se for necessário para remover navegação quebrada.
7. Registrar qualquer botão que ainda dependa de regra de produto futura.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Clique no nome da música não vai para Home.
- Links internos usam `routerLink` ou ação Angular.
- Não há links vazios nos botões principais da listagem.
- Layout da linha da música fica alinhado em desktop.
- Player e waveform continuam funcionando como antes.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 7A — Página de Músicas — navegação, botões e layout

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 7A — Página de Músicas — navegação, botões e layout e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/musicas/musicas.service.ts`, `src/app/wave-surfer-test/*`, `src/app/player/*` apenas para leitura se necessário.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R08 — Etapa 7B — Página de Músicas — modal de seleção de licença

**Referência original:** Etapa 7B — Página de Músicas — modal de seleção de licença
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Criar ou adaptar um modal de seleção de licença antes do carrinho, no estilo premium/musical, sem adicionar item diretamente ao carrinho ao clicar em “Licença”.

## Escopo / arquivos prováveis

`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/service/carrinho.service.ts`, `src/app/cart-modal/*` se existir, possível novo componente `license-modal` ou equivalente seguindo módulos Angular existentes.

## Critérios de aceite

- [ ] Clicar em “Licença” abre modal.
- [ ] Item não entra no carrinho antes da escolha da licença.
- [ ] Modal permite escolher uma licença de forma clara.
- [ ] Modal fecha/cancela sem efeitos colaterais.
- [ ] Nenhum mock permanente de backend foi introduzido como dado final.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

O visual pode ser inspirado em marketplaces premium, mas deve seguir identidade escura/musical do MokBeats.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 7B — Página de Músicas — modal de seleção de licença

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Criar ou adaptar um modal de seleção de licença antes do carrinho, no estilo premium/musical, sem adicionar item diretamente ao carrinho ao clicar em “Licença”.

## Arquivos que devem ser lidos antes de alterar
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/service/carrinho.service.ts`, `src/app/cart-modal/*` se existir, possível novo componente `license-modal` ou equivalente seguindo módulos Angular existentes.

## Arquivos prováveis de alteração
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/service/carrinho.service.ts`, `src/app/cart-modal/*` se existir, possível novo componente `license-modal` ou equivalente seguindo módulos Angular existentes.

## Tarefas técnicas em ordem
1. Ler fluxo atual de `comprarLicensa` ou método equivalente.
2. Identificar como o carrinho recebe itens atualmente e quais dados mínimos de música/licença são necessários.
3. Implementar modal de seleção de licença antes do carrinho usando padrão já existente no projeto, como ng-bootstrap/Angular Material se já instalado.
4. Exibir no modal nome da música, produtor/artista, opções de licença, preço/descrição quando existirem; se não houver dados reais de preço, usar estrutura tipada com valores temporários claramente marcados.
5. Botão “Licença” deve apenas abrir o modal, não adicionar item diretamente.
6. Botão de confirmação do modal deve emitir licença selecionada para a próxima etapa do fluxo.
7. Tratar usuário não autenticado conforme comportamento existente, sem remover guards ou AuthService.
8. Não alterar checkout nesta etapa além do necessário para receber os dados selecionados depois.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Clicar em “Licença” abre modal.
- Item não entra no carrinho antes da escolha da licença.
- Modal permite escolher uma licença de forma clara.
- Modal fecha/cancela sem efeitos colaterais.
- Nenhum mock permanente de backend foi introduzido como dado final.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 7B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 7B — Página de Músicas — modal de seleção de licença

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Criar ou adaptar um modal de seleção de licença antes do carrinho, no estilo premium/musical, sem adicionar item diretamente ao carrinho ao clicar em “Licença”.

## Arquivos que devem ser inspecionados
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/service/carrinho.service.ts`, `src/app/cart-modal/*` se existir, possível novo componente `license-modal` ou equivalente seguindo módulos Angular existentes.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler fluxo atual de `comprarLicensa` ou método equivalente.
2. Identificar como o carrinho recebe itens atualmente e quais dados mínimos de música/licença são necessários.
3. Implementar modal de seleção de licença antes do carrinho usando padrão já existente no projeto, como ng-bootstrap/Angular Material se já instalado.
4. Exibir no modal nome da música, produtor/artista, opções de licença, preço/descrição quando existirem; se não houver dados reais de preço, usar estrutura tipada com valores temporários claramente marcados.
5. Botão “Licença” deve apenas abrir o modal, não adicionar item diretamente.
6. Botão de confirmação do modal deve emitir licença selecionada para a próxima etapa do fluxo.
7. Tratar usuário não autenticado conforme comportamento existente, sem remover guards ou AuthService.
8. Não alterar checkout nesta etapa além do necessário para receber os dados selecionados depois.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Clicar em “Licença” abre modal.
- Item não entra no carrinho antes da escolha da licença.
- Modal permite escolher uma licença de forma clara.
- Modal fecha/cancela sem efeitos colaterais.
- Nenhum mock permanente de backend foi introduzido como dado final.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 7B — Página de Músicas — modal de seleção de licença

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 7B — Página de Músicas — modal de seleção de licença e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, `src/app/service/carrinho.service.ts`, `src/app/cart-modal/*` se existir, possível novo componente `license-modal` ou equivalente seguindo módulos Angular existentes.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R09 — Etapa 7C — Página de Músicas — integrar licença escolhida ao carrinho

**Referência original:** Etapa 7C — Página de Músicas — integrar licença escolhida ao carrinho
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Conectar a licença selecionada no modal ao carrinho, preservando dados da música, licença, preço e fluxo escolher música → escolher licença → adicionar ao carrinho.

## Escopo / arquivos prováveis

`src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.html`, `src/app/service/carrinho.service.ts`, `src/app/carrinho/*`, `src/app/cart-modal/*`, models de `Musica`/carrinho/licença existentes ou arquivos equivalentes.

## Critérios de aceite

- [ ] Fluxo completo de música até carrinho exige escolha de licença.
- [ ] Carrinho exibe ou preserva os dados da licença escolhida.
- [ ] Contador do carrinho atualiza de forma confiável.
- [ ] Não há adição direta sem modal.
- [ ] Build passa ou erro pré-existente é documentado.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Esta etapa prepara checkout, mas não deve reestruturar toda a compra.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 7C — Página de Músicas — integrar licença escolhida ao carrinho

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Conectar a licença selecionada no modal ao carrinho, preservando dados da música, licença, preço e fluxo escolher música → escolher licença → adicionar ao carrinho.

## Arquivos que devem ser lidos antes de alterar
`src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.html`, `src/app/service/carrinho.service.ts`, `src/app/carrinho/*`, `src/app/cart-modal/*`, models de `Musica`/carrinho/licença existentes ou arquivos equivalentes.

## Arquivos prováveis de alteração
`src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.html`, `src/app/service/carrinho.service.ts`, `src/app/carrinho/*`, `src/app/cart-modal/*`, models de `Musica`/carrinho/licença existentes ou arquivos equivalentes.

## Tarefas técnicas em ordem
1. Ler estrutura atual do carrinho e models usados pela página de carrinho.
2. Definir tipo/interface local para item com música + licença sem quebrar itens antigos, caso necessário.
3. Atualizar fluxo para adicionar ao carrinho apenas após confirmação do modal.
4. Preservar contador de carrinho e modal/feedback existente quando aplicável.
5. Evitar duplicação de itens idênticos ou documentar comportamento atual se já existir.
6. Garantir que o carrinho consiga renderizar nome da música, licença e preço sem erro.
7. Não implementar checkout completo nesta etapa.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Fluxo completo de música até carrinho exige escolha de licença.
- Carrinho exibe ou preserva os dados da licença escolhida.
- Contador do carrinho atualiza de forma confiável.
- Não há adição direta sem modal.
- Build passa ou erro pré-existente é documentado.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 7C.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 7C — Página de Músicas — integrar licença escolhida ao carrinho

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Conectar a licença selecionada no modal ao carrinho, preservando dados da música, licença, preço e fluxo escolher música → escolher licença → adicionar ao carrinho.

## Arquivos que devem ser inspecionados
`src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.html`, `src/app/service/carrinho.service.ts`, `src/app/carrinho/*`, `src/app/cart-modal/*`, models de `Musica`/carrinho/licença existentes ou arquivos equivalentes.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler estrutura atual do carrinho e models usados pela página de carrinho.
2. Definir tipo/interface local para item com música + licença sem quebrar itens antigos, caso necessário.
3. Atualizar fluxo para adicionar ao carrinho apenas após confirmação do modal.
4. Preservar contador de carrinho e modal/feedback existente quando aplicável.
5. Evitar duplicação de itens idênticos ou documentar comportamento atual se já existir.
6. Garantir que o carrinho consiga renderizar nome da música, licença e preço sem erro.
7. Não implementar checkout completo nesta etapa.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Fluxo completo de música até carrinho exige escolha de licença.
- Carrinho exibe ou preserva os dados da licença escolhida.
- Contador do carrinho atualiza de forma confiável.
- Não há adição direta sem modal.
- Build passa ou erro pré-existente é documentado.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 7C — Página de Músicas — integrar licença escolhida ao carrinho

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 7C — Página de Músicas — integrar licença escolhida ao carrinho e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.html`, `src/app/service/carrinho.service.ts`, `src/app/carrinho/*`, `src/app/cart-modal/*`, models de `Musica`/carrinho/licença existentes ou arquivos equivalentes.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R10 — Etapa 8A — Player geral — índice, metadados e ações principais

**Referência original:** Etapa 8A — Player geral — índice, metadados e ações principais
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Estabilizar o player global para tocar a música correta, evitar índice baseado em `id - 1`, remover metadados hard-coded e garantir ações principais de play/pause/seek.

## Escopo / arquivos prováveis

`src/app/player/player.component.html`, `src/app/player/player.component.ts`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.ts`, models de música existentes.

## Critérios de aceite

- [ ] Player toca a faixa selecionada após filtro/paginação.
- [ ] Metadados exibidos correspondem à música atual quando disponíveis.
- [ ] Não há dependência frágil em `id - 1`.
- [ ] Ações principais não quebram console.
- [ ] Nenhuma instância duplicada de áudio fica tocando indevidamente.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Não mexer nos stems nesta etapa além de preservar compatibilidade.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 8A — Player geral — índice, metadados e ações principais

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Estabilizar o player global para tocar a música correta, evitar índice baseado em `id - 1`, remover metadados hard-coded e garantir ações principais de play/pause/seek.

## Arquivos que devem ser lidos antes de alterar
`src/app/player/player.component.html`, `src/app/player/player.component.ts`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.ts`, models de música existentes.

## Arquivos prováveis de alteração
`src/app/player/player.component.html`, `src/app/player/player.component.ts`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.ts`, models de música existentes.

## Tarefas técnicas em ordem
1. Ler MusicPlayerService e o contrato usado pela página de músicas.
2. Localizar uso de índice `music.id - 1` ou lógica semelhante insegura com paginação/filtros.
3. Alterar seleção de música para usar objeto real, índice da lista atual ou identificador seguro, sem quebrar paginação.
4. Substituir metadados hard-coded do player por dados da música atual quando disponíveis.
5. Ações sem implementação real devem ser implementadas minimamente ou ocultadas/desabilitadas com estado claro.
6. Preservar integração com WaveSurfer e comportamento atual de play/pause.
7. Adicionar verificações de `null`/`undefined` para dados vindos da API.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Player toca a faixa selecionada após filtro/paginação.
- Metadados exibidos correspondem à música atual quando disponíveis.
- Não há dependência frágil em `id - 1`.
- Ações principais não quebram console.
- Nenhuma instância duplicada de áudio fica tocando indevidamente.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 8A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 8A — Player geral — índice, metadados e ações principais

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Estabilizar o player global para tocar a música correta, evitar índice baseado em `id - 1`, remover metadados hard-coded e garantir ações principais de play/pause/seek.

## Arquivos que devem ser inspecionados
`src/app/player/player.component.html`, `src/app/player/player.component.ts`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.ts`, models de música existentes.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler MusicPlayerService e o contrato usado pela página de músicas.
2. Localizar uso de índice `music.id - 1` ou lógica semelhante insegura com paginação/filtros.
3. Alterar seleção de música para usar objeto real, índice da lista atual ou identificador seguro, sem quebrar paginação.
4. Substituir metadados hard-coded do player por dados da música atual quando disponíveis.
5. Ações sem implementação real devem ser implementadas minimamente ou ocultadas/desabilitadas com estado claro.
6. Preservar integração com WaveSurfer e comportamento atual de play/pause.
7. Adicionar verificações de `null`/`undefined` para dados vindos da API.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Player toca a faixa selecionada após filtro/paginação.
- Metadados exibidos correspondem à música atual quando disponíveis.
- Não há dependência frágil em `id - 1`.
- Ações principais não quebram console.
- Nenhuma instância duplicada de áudio fica tocando indevidamente.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 8A — Player geral — índice, metadados e ações principais

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 8A — Player geral — índice, metadados e ações principais e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/player/player.component.html`, `src/app/player/player.component.ts`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.ts`, models de música existentes.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R11 — Etapa 8B — Waveform por item — lazy loading, clique e sincronização básica

**Referência original:** Etapa 8B — Waveform por item — lazy loading, clique e sincronização básica
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Revisar e estabilizar o componente de waveform por item, preservando lazy loading, cache/preload, seek e comunicação com o player global.

## Escopo / arquivos prováveis

`src/app/wave-surfer-test/wave-surfer-test.component.ts`, `.html`, `.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.*`, `src/app/services/audio-preloader.service.ts` se existir.

## Critérios de aceite

- [ ] Waveform aparece nos itens de música.
- [ ] Seek no waveform é refletido no player quando aplicável.
- [ ] Troca de música não deixa áudio duplicado.
- [ ] Componente destrói recursos ao sair.
- [ ] Não houve regressão de paginação/filtros.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

O objetivo é estabilização, não redesign do waveform.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 8B — Waveform por item — lazy loading, clique e sincronização básica

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Revisar e estabilizar o componente de waveform por item, preservando lazy loading, cache/preload, seek e comunicação com o player global.

## Arquivos que devem ser lidos antes de alterar
`src/app/wave-surfer-test/wave-surfer-test.component.ts`, `.html`, `.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.*`, `src/app/services/audio-preloader.service.ts` se existir.

## Arquivos prováveis de alteração
`src/app/wave-surfer-test/wave-surfer-test.component.ts`, `.html`, `.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.*`, `src/app/services/audio-preloader.service.ts` se existir.

## Tarefas técnicas em ordem
1. Ler implementação atual do WaveSurfer por item antes de alterar.
2. Confirmar criação/destruição de instâncias no ciclo de vida Angular.
3. Preservar `IntersectionObserver`, cache/preload e peaks pré-gerados quando existirem.
4. Garantir que clique/seek no waveform atualize o player global sem navegação indevida.
5. Evitar múltiplas instâncias tocando simultaneamente.
6. Tratar falhas de URL de áudio sem quebrar a tela inteira.
7. Não substituir WaveSurfer por outra lib.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Waveform aparece nos itens de música.
- Seek no waveform é refletido no player quando aplicável.
- Troca de música não deixa áudio duplicado.
- Componente destrói recursos ao sair.
- Não houve regressão de paginação/filtros.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 8B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 8B — Waveform por item — lazy loading, clique e sincronização básica

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Revisar e estabilizar o componente de waveform por item, preservando lazy loading, cache/preload, seek e comunicação com o player global.

## Arquivos que devem ser inspecionados
`src/app/wave-surfer-test/wave-surfer-test.component.ts`, `.html`, `.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.*`, `src/app/services/audio-preloader.service.ts` se existir.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler implementação atual do WaveSurfer por item antes de alterar.
2. Confirmar criação/destruição de instâncias no ciclo de vida Angular.
3. Preservar `IntersectionObserver`, cache/preload e peaks pré-gerados quando existirem.
4. Garantir que clique/seek no waveform atualize o player global sem navegação indevida.
5. Evitar múltiplas instâncias tocando simultaneamente.
6. Tratar falhas de URL de áudio sem quebrar a tela inteira.
7. Não substituir WaveSurfer por outra lib.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Waveform aparece nos itens de música.
- Seek no waveform é refletido no player quando aplicável.
- Troca de música não deixa áudio duplicado.
- Componente destrói recursos ao sair.
- Não houve regressão de paginação/filtros.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 8B — Waveform por item — lazy loading, clique e sincronização básica

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 8B — Waveform por item — lazy loading, clique e sincronização básica e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/wave-surfer-test/wave-surfer-test.component.ts`, `.html`, `.scss`, `src/app/service/music-player.service.ts`, `src/app/musicas/musicas.component.*`, `src/app/services/audio-preloader.service.ts` se existir.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R12 — Etapa 8C — Player e stems — carregamento, sincronização e modo de reprodução

**Referência original:** Etapa 8C — Player e stems — carregamento, sincronização e modo de reprodução
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Revisar suporte a stems para garantir carregamento pelo endpoint existente, sincronização com faixa principal, play/pause/seek e tratamento de erro/vazio.

## Escopo / arquivos prováveis

`src/app/player/player.component.ts`, `src/app/player/player.component.html`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, serviço/endpoint de stems em `musicas.service.ts` ou equivalente.

## Critérios de aceite

- [ ] Stems carregam quando existem.
- [ ] Sem stems disponíveis não quebra o player.
- [ ] Play/pause/seek ficam sincronizados.
- [ ] Troca de faixa limpa instâncias anteriores.
- [ ] Erros de API são tratados visualmente ou registrados sem quebrar fluxo.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Área de alto risco. Mudanças devem ser pequenas e acompanhadas de teste manual.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 8C — Player e stems — carregamento, sincronização e modo de reprodução

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Revisar suporte a stems para garantir carregamento pelo endpoint existente, sincronização com faixa principal, play/pause/seek e tratamento de erro/vazio.

## Arquivos que devem ser lidos antes de alterar
`src/app/player/player.component.ts`, `src/app/player/player.component.html`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, serviço/endpoint de stems em `musicas.service.ts` ou equivalente.

## Arquivos prováveis de alteração
`src/app/player/player.component.ts`, `src/app/player/player.component.html`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, serviço/endpoint de stems em `musicas.service.ts` ou equivalente.

## Tarefas técnicas em ordem
1. Localizar endpoint atual de stems, por exemplo `/tracks/:id/stems`, sem alterar URL sem validação do backend.
2. Verificar como o player alterna entre modo `full` e modo `stems`.
3. Garantir que as instâncias de WaveSurfer dos stems sejam criadas, sincronizadas e destruídas corretamente.
4. Implementar estados: stems carregando, sem stems disponíveis, erro ao carregar stems.
5. Garantir play/pause/seek sincronizados entre stems.
6. Evitar vazamento de memória quando troca de faixa ou saída do componente.
7. Não alterar upload/payload de stems nesta etapa.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Stems carregam quando existem.
- Sem stems disponíveis não quebra o player.
- Play/pause/seek ficam sincronizados.
- Troca de faixa limpa instâncias anteriores.
- Erros de API são tratados visualmente ou registrados sem quebrar fluxo.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 8C.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 8C — Player e stems — carregamento, sincronização e modo de reprodução

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Revisar suporte a stems para garantir carregamento pelo endpoint existente, sincronização com faixa principal, play/pause/seek e tratamento de erro/vazio.

## Arquivos que devem ser inspecionados
`src/app/player/player.component.ts`, `src/app/player/player.component.html`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, serviço/endpoint de stems em `musicas.service.ts` ou equivalente.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Localizar endpoint atual de stems, por exemplo `/tracks/:id/stems`, sem alterar URL sem validação do backend.
2. Verificar como o player alterna entre modo `full` e modo `stems`.
3. Garantir que as instâncias de WaveSurfer dos stems sejam criadas, sincronizadas e destruídas corretamente.
4. Implementar estados: stems carregando, sem stems disponíveis, erro ao carregar stems.
5. Garantir play/pause/seek sincronizados entre stems.
6. Evitar vazamento de memória quando troca de faixa ou saída do componente.
7. Não alterar upload/payload de stems nesta etapa.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Stems carregam quando existem.
- Sem stems disponíveis não quebra o player.
- Play/pause/seek ficam sincronizados.
- Troca de faixa limpa instâncias anteriores.
- Erros de API são tratados visualmente ou registrados sem quebrar fluxo.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 8C — Player e stems — carregamento, sincronização e modo de reprodução

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 8C — Player e stems — carregamento, sincronização e modo de reprodução e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/player/player.component.ts`, `src/app/player/player.component.html`, `src/app/player/player.component.scss`, `src/app/service/music-player.service.ts`, serviço/endpoint de stems em `musicas.service.ts` ou equivalente.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R13 — Etapa 9 — Filtros, minimizar filtro e comportamento no scroll

**Referência original:** Etapa 9 — Filtros, minimizar filtro e comportamento no scroll
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Médio/Alto

## Objetivo da etapa

Corrigir filtros da página de músicas para abrir/fechar de forma previsível, não sumir indevidamente no scroll e manter busca/paginação funcionando.

## Escopo / arquivos prováveis

`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, componentes de filtro/pagination se existirem.

## Critérios de aceite

- [ ] Filtro abre e fecha sem sumir indevidamente.
- [ ] Aplicar filtro continua funcionando.
- [ ] Limpar filtro funciona se já existir.
- [ ] Scroll não esconde controles principais.
- [ ] Mobile não quebra layout.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Só mexa na página de músicas. Efeitos Sonoros será tratado em etapa separada.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 9 — Filtros, minimizar filtro e comportamento no scroll

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Corrigir filtros da página de músicas para abrir/fechar de forma previsível, não sumir indevidamente no scroll e manter busca/paginação funcionando.

## Arquivos que devem ser lidos antes de alterar
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, componentes de filtro/pagination se existirem.

## Arquivos prováveis de alteração
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, componentes de filtro/pagination se existirem.

## Tarefas técnicas em ordem
1. Mapear estado atual do filtro lateral e botão minimizar/filtrar.
2. Substituir manipulação direta de `#navLeft` por estado Angular quando possível, sem refatoração ampla.
3. Separar claramente ações de abrir/fechar filtro, aplicar filtro e limpar filtro.
4. Garantir que o filtro continue acessível após scroll em desktop e mobile.
5. Preservar valores selecionados e paginação após aplicar filtros.
6. Ajustar SCSS responsivo de forma localizada.
7. Evitar alterar services de música sem necessidade.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Filtro abre e fecha sem sumir indevidamente.
- Aplicar filtro continua funcionando.
- Limpar filtro funciona se já existir.
- Scroll não esconde controles principais.
- Mobile não quebra layout.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 9.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 9 — Filtros, minimizar filtro e comportamento no scroll

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Corrigir filtros da página de músicas para abrir/fechar de forma previsível, não sumir indevidamente no scroll e manter busca/paginação funcionando.

## Arquivos que devem ser inspecionados
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, componentes de filtro/pagination se existirem.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Mapear estado atual do filtro lateral e botão minimizar/filtrar.
2. Substituir manipulação direta de `#navLeft` por estado Angular quando possível, sem refatoração ampla.
3. Separar claramente ações de abrir/fechar filtro, aplicar filtro e limpar filtro.
4. Garantir que o filtro continue acessível após scroll em desktop e mobile.
5. Preservar valores selecionados e paginação após aplicar filtros.
6. Ajustar SCSS responsivo de forma localizada.
7. Evitar alterar services de música sem necessidade.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Filtro abre e fecha sem sumir indevidamente.
- Aplicar filtro continua funcionando.
- Limpar filtro funciona se já existir.
- Scroll não esconde controles principais.
- Mobile não quebra layout.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 9 — Filtros, minimizar filtro e comportamento no scroll

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 9 — Filtros, minimizar filtro e comportamento no scroll e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/musicas/musicas.component.html`, `src/app/musicas/musicas.component.ts`, `src/app/musicas/musicas.component.scss`, componentes de filtro/pagination se existirem.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R14 — Etapa 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend

**Referência original:** Etapa 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend
**Tipo:** Auditoria técnica
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Mapear a implementação atual de Efeitos Sonoros, identificar dados estáticos/mockados, paginação fixa, ausência de endpoints e possibilidades reais de padronização com Músicas.

## Escopo / arquivos prováveis

`src/app/efeitos-sonoros/*`, `src/app/efeitosSonoros/*` se esse for o nome real, `src/app/pagination/*`, `src/app/musicas/*`, services de API relacionados.

## Critérios de aceite

- [ ] Relatório informa arquivo/caminho real da tela.
- [ ] Relatório separa o que pode ser implementado sem backend e o que depende de API.
- [ ] Mocks ou dados estáticos foram identificados.
- [ ] Plano de padronização está claro.
- [ ] Nenhum código funcional foi alterado.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Esta subetapa evita prometer integração inexistente.

## Prompt Codex — Execução / Auditoria

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Mapear a implementação atual de Efeitos Sonoros, identificar dados estáticos/mockados, paginação fixa, ausência de endpoints e possibilidades reais de padronização com Músicas.

## Arquivos que devem ser lidos antes de alterar
`src/app/efeitos-sonoros/*`, `src/app/efeitosSonoros/*` se esse for o nome real, `src/app/pagination/*`, `src/app/musicas/*`, services de API relacionados.

## Arquivos prováveis de alteração
`src/app/efeitos-sonoros/*`, `src/app/efeitosSonoros/*` se esse for o nome real, `src/app/pagination/*`, `src/app/musicas/*`, services de API relacionados.

## Tarefas técnicas em ordem
1. Localizar o caminho real do componente de Efeitos Sonoros no projeto.
2. Mapear se a tela usa dados estáticos ou API.
3. Mapear paginação atual e componentes reutilizáveis disponíveis.
4. Comparar botões/ações com a página de músicas.
5. Identificar se há endpoint real para efeitos; se não houver, registrar pendência e não inventar backend.
6. Gerar plano de implementação incremental para visual/paginação/player/licença.
7. Não alterar código nesta etapa, salvo ajustes de documentação se necessário.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Relatório informa arquivo/caminho real da tela.
- Relatório separa o que pode ser implementado sem backend e o que depende de API.
- Mocks ou dados estáticos foram identificados.
- Plano de padronização está claro.
- Nenhum código funcional foi alterado.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 10A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Mapear a implementação atual de Efeitos Sonoros, identificar dados estáticos/mockados, paginação fixa, ausência de endpoints e possibilidades reais de padronização com Músicas.

## Arquivos que devem ser inspecionados
`src/app/efeitos-sonoros/*`, `src/app/efeitosSonoros/*` se esse for o nome real, `src/app/pagination/*`, `src/app/musicas/*`, services de API relacionados.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Localizar o caminho real do componente de Efeitos Sonoros no projeto.
2. Mapear se a tela usa dados estáticos ou API.
3. Mapear paginação atual e componentes reutilizáveis disponíveis.
4. Comparar botões/ações com a página de músicas.
5. Identificar se há endpoint real para efeitos; se não houver, registrar pendência e não inventar backend.
6. Gerar plano de implementação incremental para visual/paginação/player/licença.
7. Não alterar código nesta etapa, salvo ajustes de documentação se necessário.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Relatório informa arquivo/caminho real da tela.
- Relatório separa o que pode ser implementado sem backend e o que depende de API.
- Mocks ou dados estáticos foram identificados.
- Plano de padronização está claro.
- Nenhum código funcional foi alterado.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/efeitos-sonoros/*`, `src/app/efeitosSonoros/*` se esse for o nome real, `src/app/pagination/*`, `src/app/musicas/*`, services de API relacionados.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R15 — Etapa 10B — Efeitos Sonoros — visual, botões e paginação padronizada

**Referência original:** Etapa 10B — Efeitos Sonoros — visual, botões e paginação padronizada
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Padronizar layout, botões e paginação de Efeitos Sonoros com a página de Músicas, sem criar mocks permanentes nem inventar endpoint.

## Escopo / arquivos prováveis

`src/app/efeitos-sonoros/*` ou caminho real confirmado, `src/app/pagination/*`, `src/app/musicas/musicas.component.*` como referência, SCSS do componente.

## Critérios de aceite

- [ ] Paginação não usa links vazios.
- [ ] Visual de SFX fica coerente com Músicas.
- [ ] Botões principais não quebram navegação.
- [ ] Não foi inventado endpoint inexistente.
- [ ] Dados temporários estão claramente isolados ou documentados.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Não integrar carrinho/licença de SFX antes de definir dados mínimos de item e licença.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 10B — Efeitos Sonoros — visual, botões e paginação padronizada

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Padronizar layout, botões e paginação de Efeitos Sonoros com a página de Músicas, sem criar mocks permanentes nem inventar endpoint.

## Arquivos que devem ser lidos antes de alterar
`src/app/efeitos-sonoros/*` ou caminho real confirmado, `src/app/pagination/*`, `src/app/musicas/musicas.component.*` como referência, SCSS do componente.

## Arquivos prováveis de alteração
`src/app/efeitos-sonoros/*` ou caminho real confirmado, `src/app/pagination/*`, `src/app/musicas/musicas.component.*` como referência, SCSS do componente.

## Tarefas técnicas em ordem
1. Usar a auditoria 10A como base.
2. Remover links vazios na paginação e botões principais.
3. Reutilizar componente de paginação existente quando compatível.
4. Ajustar layout para seguir padrão visual da listagem de músicas.
5. Padronizar labels, botões de preview/licença/favorito conforme dados disponíveis.
6. Se a origem ainda for mock/local, deixar explícito no código/relatório que é temporário por ausência de endpoint.
7. Garantir responsividade básica.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Paginação não usa links vazios.
- Visual de SFX fica coerente com Músicas.
- Botões principais não quebram navegação.
- Não foi inventado endpoint inexistente.
- Dados temporários estão claramente isolados ou documentados.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 10B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 10B — Efeitos Sonoros — visual, botões e paginação padronizada

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Padronizar layout, botões e paginação de Efeitos Sonoros com a página de Músicas, sem criar mocks permanentes nem inventar endpoint.

## Arquivos que devem ser inspecionados
`src/app/efeitos-sonoros/*` ou caminho real confirmado, `src/app/pagination/*`, `src/app/musicas/musicas.component.*` como referência, SCSS do componente.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Usar a auditoria 10A como base.
2. Remover links vazios na paginação e botões principais.
3. Reutilizar componente de paginação existente quando compatível.
4. Ajustar layout para seguir padrão visual da listagem de músicas.
5. Padronizar labels, botões de preview/licença/favorito conforme dados disponíveis.
6. Se a origem ainda for mock/local, deixar explícito no código/relatório que é temporário por ausência de endpoint.
7. Garantir responsividade básica.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Paginação não usa links vazios.
- Visual de SFX fica coerente com Músicas.
- Botões principais não quebram navegação.
- Não foi inventado endpoint inexistente.
- Dados temporários estão claramente isolados ou documentados.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 10B — Efeitos Sonoros — visual, botões e paginação padronizada

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 10B — Efeitos Sonoros — visual, botões e paginação padronizada e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/efeitos-sonoros/*` ou caminho real confirmado, `src/app/pagination/*`, `src/app/musicas/musicas.component.*` como referência, SCSS do componente.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R16 — Etapa 10C — Efeitos Sonoros — player/waveform/licença quando houver dados suficientes

**Referência original:** Etapa 10C — Efeitos Sonoros — player/waveform/licença quando houver dados suficientes
**Tipo:** Implementação condicional
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Integrar Efeitos Sonoros ao fluxo de preview/player/licença/carrinho somente se houver dados de áudio suficientes e contrato minimamente compatível.

## Escopo / arquivos prováveis

Tela/service de Efeitos Sonoros, `src/app/service/music-player.service.ts`, `src/app/wave-surfer-test/*`, `src/app/service/carrinho.service.ts`, modal de licença criado na etapa 7B/7C.

## Critérios de aceite

- [ ] Preview de SFX funciona quando há áudio.
- [ ] Ausência de áudio não quebra tela.
- [ ] Fluxo de licença/carrinho de SFX só existe se dados mínimos estiverem disponíveis.
- [ ] Músicas não regrediram.
- [ ] Limitações de backend foram documentadas.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Etapa condicional. Se backend/dados não existirem, gere relatório e não faça gambiarra permanente.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 10C — Efeitos Sonoros — player/waveform/licença quando houver dados suficientes

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Integrar Efeitos Sonoros ao fluxo de preview/player/licença/carrinho somente se houver dados de áudio suficientes e contrato minimamente compatível.

## Arquivos que devem ser lidos antes de alterar
Tela/service de Efeitos Sonoros, `src/app/service/music-player.service.ts`, `src/app/wave-surfer-test/*`, `src/app/service/carrinho.service.ts`, modal de licença criado na etapa 7B/7C.

## Arquivos prováveis de alteração
Tela/service de Efeitos Sonoros, `src/app/service/music-player.service.ts`, `src/app/wave-surfer-test/*`, `src/app/service/carrinho.service.ts`, modal de licença criado na etapa 7B/7C.

## Tarefas técnicas em ordem
1. Confirmar se cada efeito possui URL de áudio/preview e identificador confiável.
2. Adaptar player/waveform de forma compatível sem duplicar lógica desnecessária.
3. Reutilizar modal de licença quando o tipo de produto for efeito sonoro, se o carrinho suportar.
4. Tratar ausência de áudio com botão desabilitado ou mensagem clara.
5. Não forçar SFX no carrinho se o model atual não suporta tipo de item; registrar pendência objetiva.
6. Preservar fluxo de músicas existente.
7. Validar SFX separadamente de músicas.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Preview de SFX funciona quando há áudio.
- Ausência de áudio não quebra tela.
- Fluxo de licença/carrinho de SFX só existe se dados mínimos estiverem disponíveis.
- Músicas não regrediram.
- Limitações de backend foram documentadas.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 10C.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 10C — Efeitos Sonoros — player/waveform/licença quando houver dados suficientes

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Integrar Efeitos Sonoros ao fluxo de preview/player/licença/carrinho somente se houver dados de áudio suficientes e contrato minimamente compatível.

## Arquivos que devem ser inspecionados
Tela/service de Efeitos Sonoros, `src/app/service/music-player.service.ts`, `src/app/wave-surfer-test/*`, `src/app/service/carrinho.service.ts`, modal de licença criado na etapa 7B/7C.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Confirmar se cada efeito possui URL de áudio/preview e identificador confiável.
2. Adaptar player/waveform de forma compatível sem duplicar lógica desnecessária.
3. Reutilizar modal de licença quando o tipo de produto for efeito sonoro, se o carrinho suportar.
4. Tratar ausência de áudio com botão desabilitado ou mensagem clara.
5. Não forçar SFX no carrinho se o model atual não suporta tipo de item; registrar pendência objetiva.
6. Preservar fluxo de músicas existente.
7. Validar SFX separadamente de músicas.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Preview de SFX funciona quando há áudio.
- Ausência de áudio não quebra tela.
- Fluxo de licença/carrinho de SFX só existe se dados mínimos estiverem disponíveis.
- Músicas não regrediram.
- Limitações de backend foram documentadas.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 10C — Efeitos Sonoros — player/waveform/licença quando houver dados suficientes

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 10C — Efeitos Sonoros — player/waveform/licença quando houver dados suficientes e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
Tela/service de Efeitos Sonoros, `src/app/service/music-player.service.ts`, `src/app/wave-surfer-test/*`, `src/app/service/carrinho.service.ts`, modal de licença criado na etapa 7B/7C.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R17 — Etapa 11A — Upload do Produtor — reorganização visual Single/Stems/FX

**Referência original:** Etapa 11A — Upload do Produtor — reorganização visual Single/Stems/FX
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Reorganizar a UI de upload para os modos Single Track, Single Track + Stems e Efeitos FX, com campos corretos por modo, sem alterar ainda o payload final.

## Escopo / arquivos prováveis

`src/app/produtores/produtores.component.html`, `src/app/produtores/produtores.component.ts`, `src/app/produtores/produtores.component.scss`, `src/app/upload-file/upload-file.service.ts`, rotas de `/upload` e `/produtores` para leitura.

## Critérios de aceite

- [ ] Single Track não mostra “Stems” como obrigatório.
- [ ] Single Track aparece antes dos loops.
- [ ] Modo com stems mostra os quatro grupos corretos.
- [ ] Modo FX não mostra stems indevidos.
- [ ] Layout fica responsivo e organizado.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Não mexer ainda em FormData nesta subetapa, exceto se a UI estiver inseparável da lógica.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 11A — Upload do Produtor — reorganização visual Single/Stems/FX

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Reorganizar a UI de upload para os modos Single Track, Single Track + Stems e Efeitos FX, com campos corretos por modo, sem alterar ainda o payload final.

## Arquivos que devem ser lidos antes de alterar
`src/app/produtores/produtores.component.html`, `src/app/produtores/produtores.component.ts`, `src/app/produtores/produtores.component.scss`, `src/app/upload-file/upload-file.service.ts`, rotas de `/upload` e `/produtores` para leitura.

## Arquivos prováveis de alteração
`src/app/produtores/produtores.component.html`, `src/app/produtores/produtores.component.ts`, `src/app/produtores/produtores.component.scss`, `src/app/upload-file/upload-file.service.ts`, rotas de `/upload` e `/produtores` para leitura.

## Tarefas técnicas em ordem
1. Confirmar que `/upload` usa o componente correto de produtores/upload.
2. Mapear os modos existentes e os campos exibidos em cada um.
3. Single Track deve exibir arquivo principal + loops/metadados, sem exigir stems.
4. Single Track + Stems deve exibir arquivo principal + loops + Melodia + Harmonia + Ritmo + Efeitos FX.
5. Efeitos FX deve exibir apenas campos de efeito aplicáveis, sem stems de música obrigatórios.
6. Corrigir ordem visual: single primeiro, loops depois, stems apenas quando aplicável.
7. Ajustar largura do Single Track para destaque/100% conforme layout solicitado.
8. Preservar validators e nomes de campos por enquanto.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Single Track não mostra “Stems” como obrigatório.
- Single Track aparece antes dos loops.
- Modo com stems mostra os quatro grupos corretos.
- Modo FX não mostra stems indevidos.
- Layout fica responsivo e organizado.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 11A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 11A — Upload do Produtor — reorganização visual Single/Stems/FX

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Reorganizar a UI de upload para os modos Single Track, Single Track + Stems e Efeitos FX, com campos corretos por modo, sem alterar ainda o payload final.

## Arquivos que devem ser inspecionados
`src/app/produtores/produtores.component.html`, `src/app/produtores/produtores.component.ts`, `src/app/produtores/produtores.component.scss`, `src/app/upload-file/upload-file.service.ts`, rotas de `/upload` e `/produtores` para leitura.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Confirmar que `/upload` usa o componente correto de produtores/upload.
2. Mapear os modos existentes e os campos exibidos em cada um.
3. Single Track deve exibir arquivo principal + loops/metadados, sem exigir stems.
4. Single Track + Stems deve exibir arquivo principal + loops + Melodia + Harmonia + Ritmo + Efeitos FX.
5. Efeitos FX deve exibir apenas campos de efeito aplicáveis, sem stems de música obrigatórios.
6. Corrigir ordem visual: single primeiro, loops depois, stems apenas quando aplicável.
7. Ajustar largura do Single Track para destaque/100% conforme layout solicitado.
8. Preservar validators e nomes de campos por enquanto.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Single Track não mostra “Stems” como obrigatório.
- Single Track aparece antes dos loops.
- Modo com stems mostra os quatro grupos corretos.
- Modo FX não mostra stems indevidos.
- Layout fica responsivo e organizado.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 11A — Upload do Produtor — reorganização visual Single/Stems/FX

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 11A — Upload do Produtor — reorganização visual Single/Stems/FX e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/produtores/produtores.component.html`, `src/app/produtores/produtores.component.ts`, `src/app/produtores/produtores.component.scss`, `src/app/upload-file/upload-file.service.ts`, rotas de `/upload` e `/produtores` para leitura.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R18 — Etapa 11B — Upload do Produtor — validações, duração e FormData

**Referência original:** Etapa 11B — Upload do Produtor — validações, duração e FormData
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Validar que a reorganização visual preservou duração, obrigatoriedade por modo, montagem de `FormData` e payload esperado pela API `/producers/track`.

## Escopo / arquivos prováveis

`src/app/produtores/produtores.component.ts`, `.html`, `.scss`, `src/app/upload-file/upload-file.service.ts`, modelos/interfaces de upload se existirem.

## Critérios de aceite

- [ ] Validações por modo funcionam.
- [ ] `FormData` preserva contrato existente.
- [ ] Single Track envia sem stems.
- [ ] Single Track + Stems exige stems corretos.
- [ ] FX não envia campos de música indevidos.
- [ ] Erro de validação é visível para o usuário.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

O payload é área crítica. Qualquer alteração de contrato deve ser justificada no relatório.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 11B — Upload do Produtor — validações, duração e FormData

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Validar que a reorganização visual preservou duração, obrigatoriedade por modo, montagem de `FormData` e payload esperado pela API `/producers/track`.

## Arquivos que devem ser lidos antes de alterar
`src/app/produtores/produtores.component.ts`, `.html`, `.scss`, `src/app/upload-file/upload-file.service.ts`, modelos/interfaces de upload se existirem.

## Arquivos prováveis de alteração
`src/app/produtores/produtores.component.ts`, `.html`, `.scss`, `src/app/upload-file/upload-file.service.ts`, modelos/interfaces de upload se existirem.

## Tarefas técnicas em ordem
1. Ler lógica atual de validação de duração de single, loops e stems.
2. Garantir que loops 15/30/60 mantenham validação existente.
3. Garantir que stems tenham mesma duração do single no modo Single Track + Stems.
4. Garantir que modo Single Track não exige stems.
5. Garantir que modo FX envia apenas campos aplicáveis.
6. Preservar `FormData`, `schemaVersion`, `mode`, `track`, loops, stems/effects e `meta` se já existirem.
7. Não renomear campos enviados ao backend sem confirmação.
8. Adicionar mensagens de erro claras se necessário.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Validações por modo funcionam.
- `FormData` preserva contrato existente.
- Single Track envia sem stems.
- Single Track + Stems exige stems corretos.
- FX não envia campos de música indevidos.
- Erro de validação é visível para o usuário.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 11B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 11B — Upload do Produtor — validações, duração e FormData

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Validar que a reorganização visual preservou duração, obrigatoriedade por modo, montagem de `FormData` e payload esperado pela API `/producers/track`.

## Arquivos que devem ser inspecionados
`src/app/produtores/produtores.component.ts`, `.html`, `.scss`, `src/app/upload-file/upload-file.service.ts`, modelos/interfaces de upload se existirem.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler lógica atual de validação de duração de single, loops e stems.
2. Garantir que loops 15/30/60 mantenham validação existente.
3. Garantir que stems tenham mesma duração do single no modo Single Track + Stems.
4. Garantir que modo Single Track não exige stems.
5. Garantir que modo FX envia apenas campos aplicáveis.
6. Preservar `FormData`, `schemaVersion`, `mode`, `track`, loops, stems/effects e `meta` se já existirem.
7. Não renomear campos enviados ao backend sem confirmação.
8. Adicionar mensagens de erro claras se necessário.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Validações por modo funcionam.
- `FormData` preserva contrato existente.
- Single Track envia sem stems.
- Single Track + Stems exige stems corretos.
- FX não envia campos de música indevidos.
- Erro de validação é visível para o usuário.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 11B — Upload do Produtor — validações, duração e FormData

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 11B — Upload do Produtor — validações, duração e FormData e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/produtores/produtores.component.ts`, `.html`, `.scss`, `src/app/upload-file/upload-file.service.ts`, modelos/interfaces de upload se existirem.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R19 — Etapa 12A — Página do Artista — HTML válido e separação de responsabilidade

**Referência original:** Etapa 12A — Página do Artista — HTML válido e separação de responsabilidade
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Corrigir HTML inválido da página do artista, reduzir navegação quebrada e evitar misturar perfil público com área privada do produtor sem clareza.

## Escopo / arquivos prováveis

`src/app/artist/artist.component.html`, `src/app/artist/artist.component.ts`, `src/app/artist/artist.component.scss`, rotas de artista/pagina-artista, services de usuário/músicas se existentes.

## Critérios de aceite

- [ ] HTML da página fica válido.
- [ ] Página não contém tags quebradas visíveis.
- [ ] Links principais não usam `href="#"` indevido.
- [ ] Dados hard-coded remanescentes foram documentados.
- [ ] Área privada do produtor não foi exposta.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Se a regra de negócio de perfil público ainda não estiver definida, não invente backend.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 12A — Página do Artista — HTML válido e separação de responsabilidade

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Corrigir HTML inválido da página do artista, reduzir navegação quebrada e evitar misturar perfil público com área privada do produtor sem clareza.

## Arquivos que devem ser lidos antes de alterar
`src/app/artist/artist.component.html`, `src/app/artist/artist.component.ts`, `src/app/artist/artist.component.scss`, rotas de artista/pagina-artista, services de usuário/músicas se existentes.

## Arquivos prováveis de alteração
`src/app/artist/artist.component.html`, `src/app/artist/artist.component.ts`, `src/app/artist/artist.component.scss`, rotas de artista/pagina-artista, services de usuário/músicas se existentes.

## Tarefas técnicas em ordem
1. Localizar página real de artista e rota associada.
2. Corrigir tags inválidas como `<<ul` ou `</ul>>` se presentes.
3. Remover links vazios ou ações falsas.
4. Identificar dados hard-coded de artista e não substituí-los por mock novo; se não houver API, documentar pendência.
5. Garantir que a página pública não dependa de edição privada do produtor.
6. Não alterar dashboard nesta etapa.
7. Validar renderização básica.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- HTML da página fica válido.
- Página não contém tags quebradas visíveis.
- Links principais não usam `href="#"` indevido.
- Dados hard-coded remanescentes foram documentados.
- Área privada do produtor não foi exposta.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 12A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 12A — Página do Artista — HTML válido e separação de responsabilidade

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Corrigir HTML inválido da página do artista, reduzir navegação quebrada e evitar misturar perfil público com área privada do produtor sem clareza.

## Arquivos que devem ser inspecionados
`src/app/artist/artist.component.html`, `src/app/artist/artist.component.ts`, `src/app/artist/artist.component.scss`, rotas de artista/pagina-artista, services de usuário/músicas se existentes.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Localizar página real de artista e rota associada.
2. Corrigir tags inválidas como `<<ul` ou `</ul>>` se presentes.
3. Remover links vazios ou ações falsas.
4. Identificar dados hard-coded de artista e não substituí-los por mock novo; se não houver API, documentar pendência.
5. Garantir que a página pública não dependa de edição privada do produtor.
6. Não alterar dashboard nesta etapa.
7. Validar renderização básica.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- HTML da página fica válido.
- Página não contém tags quebradas visíveis.
- Links principais não usam `href="#"` indevido.
- Dados hard-coded remanescentes foram documentados.
- Área privada do produtor não foi exposta.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 12A — Página do Artista — HTML válido e separação de responsabilidade

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 12A — Página do Artista — HTML válido e separação de responsabilidade e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/artist/artist.component.html`, `src/app/artist/artist.component.ts`, `src/app/artist/artist.component.scss`, rotas de artista/pagina-artista, services de usuário/músicas se existentes.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R20 — Etapa 12B — Área do produtor — menu lateral, rotas e proteção por perfil

**Referência original:** Etapa 12B — Área do produtor — menu lateral, rotas e proteção por perfil
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Médio/Alto

## Objetivo da etapa

Garantir que a navegação da área do produtor tenha Dashboard primeiro e links para Assinatura, Pedidos, Dados Pessoais e Formas de Pagamento, respeitando autenticação e perfil produtor.

## Escopo / arquivos prováveis

`src/app/sub-menu/sub-menu.component.html`, `.ts`, `.scss`, `src/app/menu-produtor/menu-produtor.component.html`, `.ts`, rotas em `src/app/app-routing.module.ts`, guards `AuthGuard`, `ProdutorGuard`.

## Critérios de aceite

- [ ] Dashboard aparece primeiro para produtor.
- [ ] Comprador/não autenticado não vê ou não acessa área privada.
- [ ] Rotas privadas continuam com guards.
- [ ] Links navegam sem reload.
- [ ] Não houve alteração global indevida de `app-routing`.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Esta etapa prepara a Dashboard, mas ainda não altera seus cards/gráficos.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 12B — Área do produtor — menu lateral, rotas e proteção por perfil

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Garantir que a navegação da área do produtor tenha Dashboard primeiro e links para Assinatura, Pedidos, Dados Pessoais e Formas de Pagamento, respeitando autenticação e perfil produtor.

## Arquivos que devem ser lidos antes de alterar
`src/app/sub-menu/sub-menu.component.html`, `.ts`, `.scss`, `src/app/menu-produtor/menu-produtor.component.html`, `.ts`, rotas em `src/app/app-routing.module.ts`, guards `AuthGuard`, `ProdutorGuard`.

## Arquivos prováveis de alteração
`src/app/sub-menu/sub-menu.component.html`, `.ts`, `.scss`, `src/app/menu-produtor/menu-produtor.component.html`, `.ts`, rotas em `src/app/app-routing.module.ts`, guards `AuthGuard`, `ProdutorGuard`.

## Tarefas técnicas em ordem
1. Mapear menu/sub-menu atual da área do produtor.
2. Confirmar quais rotas já existem: `/dashboard-produtor`, `/assinatura`, `/pedidos`, `/dados-pessoais`, `/formas-de-pagamento`, `/artista` ou equivalentes.
3. Ordenar Dashboard como primeiro item para produtor.
4. Garantir que itens privados apareçam apenas para produtor autenticado, usando lógica existente.
5. Não remover guards de rotas privadas.
6. Não copiar menu da branch codex se ele expõe Dashboard para não produtores.
7. Corrigir `routerLink` e estado ativo quando possível.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Dashboard aparece primeiro para produtor.
- Comprador/não autenticado não vê ou não acessa área privada.
- Rotas privadas continuam com guards.
- Links navegam sem reload.
- Não houve alteração global indevida de `app-routing`.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 12B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 12B — Área do produtor — menu lateral, rotas e proteção por perfil

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Garantir que a navegação da área do produtor tenha Dashboard primeiro e links para Assinatura, Pedidos, Dados Pessoais e Formas de Pagamento, respeitando autenticação e perfil produtor.

## Arquivos que devem ser inspecionados
`src/app/sub-menu/sub-menu.component.html`, `.ts`, `.scss`, `src/app/menu-produtor/menu-produtor.component.html`, `.ts`, rotas em `src/app/app-routing.module.ts`, guards `AuthGuard`, `ProdutorGuard`.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Mapear menu/sub-menu atual da área do produtor.
2. Confirmar quais rotas já existem: `/dashboard-produtor`, `/assinatura`, `/pedidos`, `/dados-pessoais`, `/formas-de-pagamento`, `/artista` ou equivalentes.
3. Ordenar Dashboard como primeiro item para produtor.
4. Garantir que itens privados apareçam apenas para produtor autenticado, usando lógica existente.
5. Não remover guards de rotas privadas.
6. Não copiar menu da branch codex se ele expõe Dashboard para não produtores.
7. Corrigir `routerLink` e estado ativo quando possível.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Dashboard aparece primeiro para produtor.
- Comprador/não autenticado não vê ou não acessa área privada.
- Rotas privadas continuam com guards.
- Links navegam sem reload.
- Não houve alteração global indevida de `app-routing`.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 12B — Área do produtor — menu lateral, rotas e proteção por perfil

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 12B — Área do produtor — menu lateral, rotas e proteção por perfil e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/sub-menu/sub-menu.component.html`, `.ts`, `.scss`, `src/app/menu-produtor/menu-produtor.component.html`, `.ts`, rotas em `src/app/app-routing.module.ts`, guards `AuthGuard`, `ProdutorGuard`.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R21 — Etapa 13A — Dashboard Produtor — auditoria da base `dev` e contrato de dados

**Referência original:** Etapa 13A — Dashboard Produtor — auditoria da base `dev` e contrato de dados
**Tipo:** Auditoria técnica
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Mapear DashboardProdutorComponent da `dev`, DashboardService, models, endpoints, estados de loading/erro/vazio e lacunas antes de adaptar visual da branch codex.

## Escopo / arquivos prováveis

`src/app/dashboard-produtor/dashboard-produtor.component.ts`, `.html`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, `src/app/sub-menu/*`, `src/app/app-routing.module.ts`.

## Critérios de aceite

- [ ] Contrato da Dashboard `dev` está mapeado.
- [ ] Endpoints reais foram listados.
- [ ] Guards foram confirmados.
- [ ] Lacunas de backend estão documentadas.
- [ ] Plano de adaptação visual está pronto.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Subetapa necessária porque a branch codex tem visual, mas a `dev` tem a arquitetura correta.

## Prompt Codex — Execução / Auditoria

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 13A — Dashboard Produtor — auditoria da base `dev` e contrato de dados

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Mapear DashboardProdutorComponent da `dev`, DashboardService, models, endpoints, estados de loading/erro/vazio e lacunas antes de adaptar visual da branch codex.

## Arquivos que devem ser lidos antes de alterar
`src/app/dashboard-produtor/dashboard-produtor.component.ts`, `.html`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, `src/app/sub-menu/*`, `src/app/app-routing.module.ts`.

## Arquivos prováveis de alteração
`src/app/dashboard-produtor/dashboard-produtor.component.ts`, `.html`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, `src/app/sub-menu/*`, `src/app/app-routing.module.ts`.

## Tarefas técnicas em ordem
1. Ler DashboardProdutorComponent, service e models.
2. Mapear endpoints usados, como summary, sales-by-track, origin, revenue e likes-vs-sales se existirem.
3. Confirmar rota `/dashboard-produtor` e guards aplicados.
4. Identificar estados de loading, erro e vazio já existentes.
5. Listar dados reais disponíveis e lacunas de backend.
6. Definir o MVP visual possível sem mocks permanentes.
7. Não alterar código nesta subetapa, salvo documentação local se solicitado.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Contrato da Dashboard `dev` está mapeado.
- Endpoints reais foram listados.
- Guards foram confirmados.
- Lacunas de backend estão documentadas.
- Plano de adaptação visual está pronto.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 13A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 13A — Dashboard Produtor — auditoria da base `dev` e contrato de dados

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Mapear DashboardProdutorComponent da `dev`, DashboardService, models, endpoints, estados de loading/erro/vazio e lacunas antes de adaptar visual da branch codex.

## Arquivos que devem ser inspecionados
`src/app/dashboard-produtor/dashboard-produtor.component.ts`, `.html`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, `src/app/sub-menu/*`, `src/app/app-routing.module.ts`.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler DashboardProdutorComponent, service e models.
2. Mapear endpoints usados, como summary, sales-by-track, origin, revenue e likes-vs-sales se existirem.
3. Confirmar rota `/dashboard-produtor` e guards aplicados.
4. Identificar estados de loading, erro e vazio já existentes.
5. Listar dados reais disponíveis e lacunas de backend.
6. Definir o MVP visual possível sem mocks permanentes.
7. Não alterar código nesta subetapa, salvo documentação local se solicitado.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Contrato da Dashboard `dev` está mapeado.
- Endpoints reais foram listados.
- Guards foram confirmados.
- Lacunas de backend estão documentadas.
- Plano de adaptação visual está pronto.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 13A — Dashboard Produtor — auditoria da base `dev` e contrato de dados

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 13A — Dashboard Produtor — auditoria da base `dev` e contrato de dados e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/dashboard-produtor/dashboard-produtor.component.ts`, `.html`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, `src/app/sub-menu/*`, `src/app/app-routing.module.ts`.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R22 — Etapa 13B — Dashboard Produtor — adaptar visual da branch codex sem merge direto

**Referência original:** Etapa 13B — Dashboard Produtor — adaptar visual da branch codex sem merge direto
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Melhorar visual da Dashboard existente em `src/app/dashboard-produtor` aproveitando ideias da branch codex, mantendo guards, DashboardService, models e dados reais da `dev`.

## Escopo / arquivos prováveis

`src/app/dashboard-produtor/dashboard-produtor.component.html`, `.ts`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, branch codex via `git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/...`, `src/assets/icons/*` se for copiar ícones específicos.

## Critérios de aceite

- [ ] Dashboard final continua em `dashboard-produtor`.
- [ ] Rota continua protegida por AuthGuard/ProdutorGuard.
- [ ] KPIs usam dados reais ou estados controlados, não mocks permanentes.
- [ ] Visual fica mais profissional e coerente.
- [ ] Nenhum merge direto da branch codex foi feito.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

O objetivo é MVP seguro e polido, não recriar a Dashboard do zero.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 13B — Dashboard Produtor — adaptar visual da branch codex sem merge direto

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Melhorar visual da Dashboard existente em `src/app/dashboard-produtor` aproveitando ideias da branch codex, mantendo guards, DashboardService, models e dados reais da `dev`.

## Arquivos que devem ser lidos antes de alterar
`src/app/dashboard-produtor/dashboard-produtor.component.html`, `.ts`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, branch codex via `git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/...`, `src/assets/icons/*` se for copiar ícones específicos.

## Arquivos prováveis de alteração
`src/app/dashboard-produtor/dashboard-produtor.component.html`, `.ts`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, branch codex via `git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/...`, `src/assets/icons/*` se for copiar ícones específicos.

## Tarefas técnicas em ordem
1. Usar resultado da auditoria 13A e comparação 3.
2. Não criar `src/app/produtor-dashboard` como implementação final se `dashboard-produtor` já existe.
3. Adaptar cards de KPIs, tabela e blocos visuais para o componente existente.
4. Usar dados do DashboardService e models existentes, com fallbacks visuais para estados vazio/erro.
5. Copiar ícones SVG específicos somente se forem assets pontuais e não exigirem mudança global.
6. Não adicionar ApexCharts nesta etapa, a menos que a decisão já esteja justificada e aprovada.
7. Preservar sub-menu/área do produtor e responsividade.
8. Não remover rota protegida.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Dashboard final continua em `dashboard-produtor`.
- Rota continua protegida por AuthGuard/ProdutorGuard.
- KPIs usam dados reais ou estados controlados, não mocks permanentes.
- Visual fica mais profissional e coerente.
- Nenhum merge direto da branch codex foi feito.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 13B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 13B — Dashboard Produtor — adaptar visual da branch codex sem merge direto

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Melhorar visual da Dashboard existente em `src/app/dashboard-produtor` aproveitando ideias da branch codex, mantendo guards, DashboardService, models e dados reais da `dev`.

## Arquivos que devem ser inspecionados
`src/app/dashboard-produtor/dashboard-produtor.component.html`, `.ts`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, branch codex via `git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/...`, `src/assets/icons/*` se for copiar ícones específicos.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Usar resultado da auditoria 13A e comparação 3.
2. Não criar `src/app/produtor-dashboard` como implementação final se `dashboard-produtor` já existe.
3. Adaptar cards de KPIs, tabela e blocos visuais para o componente existente.
4. Usar dados do DashboardService e models existentes, com fallbacks visuais para estados vazio/erro.
5. Copiar ícones SVG específicos somente se forem assets pontuais e não exigirem mudança global.
6. Não adicionar ApexCharts nesta etapa, a menos que a decisão já esteja justificada e aprovada.
7. Preservar sub-menu/área do produtor e responsividade.
8. Não remover rota protegida.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Dashboard final continua em `dashboard-produtor`.
- Rota continua protegida por AuthGuard/ProdutorGuard.
- KPIs usam dados reais ou estados controlados, não mocks permanentes.
- Visual fica mais profissional e coerente.
- Nenhum merge direto da branch codex foi feito.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 13B — Dashboard Produtor — adaptar visual da branch codex sem merge direto

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 13B — Dashboard Produtor — adaptar visual da branch codex sem merge direto e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/dashboard-produtor/dashboard-produtor.component.html`, `.ts`, `.scss`, `src/app/dashboard-produtor/dashboard.service.ts`, `src/app/dashboard-produtor/dashboard.models.ts`, branch codex via `git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/...`, `src/assets/icons/*` se for copiar ícones específicos.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R23 — Etapa 13C — Dashboard Produtor — gráficos, estados e responsividade

**Referência original:** Etapa 13C — Dashboard Produtor — gráficos, estados e responsividade
**Tipo:** Implementação condicional
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Implementar gráficos/visualizações ou placeholders profissionais da Dashboard conforme dados disponíveis, sem dependência nova injustificada e com estados loading/erro/vazio robustos.

## Escopo / arquivos prováveis

`src/app/dashboard-produtor/*`, `package.json` somente se dependência for realmente necessária, assets de ícones/gráficos, service/models da Dashboard.

## Critérios de aceite

- [ ] Gráficos reais ou placeholders controlados são coerentes.
- [ ] Sem mocks permanentes.
- [ ] Loading/erro/vazio aparecem corretamente.
- [ ] Filtro de período continua funcionando.
- [ ] Dashboard responsiva em desktop/tablet/mobile.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Se dados/endpoint não permitirem gráficos reais, entregue placeholders explícitos e documente pendência.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 13C — Dashboard Produtor — gráficos, estados e responsividade

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Implementar gráficos/visualizações ou placeholders profissionais da Dashboard conforme dados disponíveis, sem dependência nova injustificada e com estados loading/erro/vazio robustos.

## Arquivos que devem ser lidos antes de alterar
`src/app/dashboard-produtor/*`, `package.json` somente se dependência for realmente necessária, assets de ícones/gráficos, service/models da Dashboard.

## Arquivos prováveis de alteração
`src/app/dashboard-produtor/*`, `package.json` somente se dependência for realmente necessária, assets de ícones/gráficos, service/models da Dashboard.

## Tarefas técnicas em ordem
1. Verificar se os dados retornados pelo DashboardService são suficientes para gráficos reais.
2. Priorizar gráficos simples com HTML/SCSS/Angular se a dependência nova não for indispensável.
3. Se considerar ApexCharts/ng-apexcharts, justificar compatibilidade com Angular 14, impacto e arquivos alterados antes de instalar.
4. Implementar estados loading/erro/vazio por card/gráfico.
5. Garantir que tabela de faixas tenha responsividade e tratamento de listas vazias.
6. Preservar filtros de período 7d/30d/12m ou equivalentes existentes.
7. Não usar arrays mockados como dado final.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Gráficos reais ou placeholders controlados são coerentes.
- Sem mocks permanentes.
- Loading/erro/vazio aparecem corretamente.
- Filtro de período continua funcionando.
- Dashboard responsiva em desktop/tablet/mobile.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 13C.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 13C — Dashboard Produtor — gráficos, estados e responsividade

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Implementar gráficos/visualizações ou placeholders profissionais da Dashboard conforme dados disponíveis, sem dependência nova injustificada e com estados loading/erro/vazio robustos.

## Arquivos que devem ser inspecionados
`src/app/dashboard-produtor/*`, `package.json` somente se dependência for realmente necessária, assets de ícones/gráficos, service/models da Dashboard.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Verificar se os dados retornados pelo DashboardService são suficientes para gráficos reais.
2. Priorizar gráficos simples com HTML/SCSS/Angular se a dependência nova não for indispensável.
3. Se considerar ApexCharts/ng-apexcharts, justificar compatibilidade com Angular 14, impacto e arquivos alterados antes de instalar.
4. Implementar estados loading/erro/vazio por card/gráfico.
5. Garantir que tabela de faixas tenha responsividade e tratamento de listas vazias.
6. Preservar filtros de período 7d/30d/12m ou equivalentes existentes.
7. Não usar arrays mockados como dado final.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Gráficos reais ou placeholders controlados são coerentes.
- Sem mocks permanentes.
- Loading/erro/vazio aparecem corretamente.
- Filtro de período continua funcionando.
- Dashboard responsiva em desktop/tablet/mobile.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 13C — Dashboard Produtor — gráficos, estados e responsividade

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 13C — Dashboard Produtor — gráficos, estados e responsividade e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/dashboard-produtor/*`, `package.json` somente se dependência for realmente necessária, assets de ícones/gráficos, service/models da Dashboard.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R24 — Etapa 14A — Pricing — toggle 6/12 meses e cards responsivos

**Referência original:** Etapa 14A — Pricing — toggle 6/12 meses e cards responsivos
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Médio/Alto

## Objetivo da etapa

Transformar a alternância 6/12 meses em estado Angular real, remover `href=""` de tabs e corrigir responsividade dos cards de licenças/preços.

## Escopo / arquivos prováveis

`src/app/licenca-valor/licenca-valor.component.html`, `.ts`, `.scss`, rotas de `/precos`, modelos/constantes de preço se existirem.

## Critérios de aceite

- [ ] Toggle 6/12 altera valores/conteúdo sem reload.
- [ ] Não há `href=""` nas tabs principais.
- [ ] Cards não quebram em larguras comuns.
- [ ] Preços temporários ficam isolados/configuráveis.
- [ ] Chrome e Firefox não apresentam quebra visual óbvia.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Não reescrever toda página de pricing; foco em funcionalidade e responsividade.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 14A — Pricing — toggle 6/12 meses e cards responsivos

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Transformar a alternância 6/12 meses em estado Angular real, remover `href=""` de tabs e corrigir responsividade dos cards de licenças/preços.

## Arquivos que devem ser lidos antes de alterar
`src/app/licenca-valor/licenca-valor.component.html`, `.ts`, `.scss`, rotas de `/precos`, modelos/constantes de preço se existirem.

## Arquivos prováveis de alteração
`src/app/licenca-valor/licenca-valor.component.html`, `.ts`, `.scss`, rotas de `/precos`, modelos/constantes de preço se existirem.

## Tarefas técnicas em ordem
1. Ler componente de preços/licenças e identificar uso de tabs Bootstrap com `href=""`.
2. Criar estado Angular para período selecionado: 6 meses e 12 meses.
3. Atualizar valores, período e textos dinamicamente a partir de array/objeto tipado.
4. Usar botões acessíveis em vez de links vazios.
5. Garantir layout responsivo para desktop, notebook, tablet e celular.
6. Não inventar preços finais se não existirem; marcar valores temporários como configuráveis.
7. Preservar identidade visual escura/premium.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Toggle 6/12 altera valores/conteúdo sem reload.
- Não há `href=""` nas tabs principais.
- Cards não quebram em larguras comuns.
- Preços temporários ficam isolados/configuráveis.
- Chrome e Firefox não apresentam quebra visual óbvia.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 14A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 14A — Pricing — toggle 6/12 meses e cards responsivos

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Transformar a alternância 6/12 meses em estado Angular real, remover `href=""` de tabs e corrigir responsividade dos cards de licenças/preços.

## Arquivos que devem ser inspecionados
`src/app/licenca-valor/licenca-valor.component.html`, `.ts`, `.scss`, rotas de `/precos`, modelos/constantes de preço se existirem.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler componente de preços/licenças e identificar uso de tabs Bootstrap com `href=""`.
2. Criar estado Angular para período selecionado: 6 meses e 12 meses.
3. Atualizar valores, período e textos dinamicamente a partir de array/objeto tipado.
4. Usar botões acessíveis em vez de links vazios.
5. Garantir layout responsivo para desktop, notebook, tablet e celular.
6. Não inventar preços finais se não existirem; marcar valores temporários como configuráveis.
7. Preservar identidade visual escura/premium.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Toggle 6/12 altera valores/conteúdo sem reload.
- Não há `href=""` nas tabs principais.
- Cards não quebram em larguras comuns.
- Preços temporários ficam isolados/configuráveis.
- Chrome e Firefox não apresentam quebra visual óbvia.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 14A — Pricing — toggle 6/12 meses e cards responsivos

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 14A — Pricing — toggle 6/12 meses e cards responsivos e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/licenca-valor/licenca-valor.component.html`, `.ts`, `.scss`, rotas de `/precos`, modelos/constantes de preço se existirem.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R25 — Etapa 14B — FAQ — navegação, padronização visual e responsividade

**Referência original:** Etapa 14B — FAQ — navegação, padronização visual e responsividade
**Tipo:** Implementação
**Agente inicial recomendado:** Codex
**Risco:** Médio

## Objetivo da etapa

Garantir que FAQ seja acessível a partir de Pricing e tenha layout padronizado/coerente com páginas institucionais como Política de Privacidade.

## Escopo / arquivos prováveis

`src/app/faq/faq.component.html`, `.ts`, `.scss`, `src/app/politica-privacidade/*` ou página institucional equivalente, `src/app/licenca-valor/*`, rotas de FAQ.

## Critérios de aceite

- [ ] FAQ abre por rota interna.
- [ ] Layout fica coerente com páginas institucionais.
- [ ] Não há links vazios principais.
- [ ] Responsividade básica validada.
- [ ] Conteúdo pendente está documentado.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Não transformar FAQ em página jurídica final sem conteúdo aprovado pelo cliente.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 14B — FAQ — navegação, padronização visual e responsividade

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Garantir que FAQ seja acessível a partir de Pricing e tenha layout padronizado/coerente com páginas institucionais como Política de Privacidade.

## Arquivos que devem ser lidos antes de alterar
`src/app/faq/faq.component.html`, `.ts`, `.scss`, `src/app/politica-privacidade/*` ou página institucional equivalente, `src/app/licenca-valor/*`, rotas de FAQ.

## Arquivos prováveis de alteração
`src/app/faq/faq.component.html`, `.ts`, `.scss`, `src/app/politica-privacidade/*` ou página institucional equivalente, `src/app/licenca-valor/*`, rotas de FAQ.

## Tarefas técnicas em ordem
1. Ler FAQ atual e página de Política de Privacidade como referência de estrutura visual.
2. Corrigir botão/link de FAQ em Pricing para navegar por Angular Router.
3. Remover conteúdo ou links claramente externos/indevidos de terceiros, se houver.
4. Padronizar layout, espaçamento, títulos e responsividade.
5. Não inventar texto jurídico definitivo; quando conteúdo estiver incompleto, documentar pendência.
6. Garantir tags HTML válidas.
7. Validar desktop/mobile.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- FAQ abre por rota interna.
- Layout fica coerente com páginas institucionais.
- Não há links vazios principais.
- Responsividade básica validada.
- Conteúdo pendente está documentado.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 14B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 14B — FAQ — navegação, padronização visual e responsividade

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Garantir que FAQ seja acessível a partir de Pricing e tenha layout padronizado/coerente com páginas institucionais como Política de Privacidade.

## Arquivos que devem ser inspecionados
`src/app/faq/faq.component.html`, `.ts`, `.scss`, `src/app/politica-privacidade/*` ou página institucional equivalente, `src/app/licenca-valor/*`, rotas de FAQ.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler FAQ atual e página de Política de Privacidade como referência de estrutura visual.
2. Corrigir botão/link de FAQ em Pricing para navegar por Angular Router.
3. Remover conteúdo ou links claramente externos/indevidos de terceiros, se houver.
4. Padronizar layout, espaçamento, títulos e responsividade.
5. Não inventar texto jurídico definitivo; quando conteúdo estiver incompleto, documentar pendência.
6. Garantir tags HTML válidas.
7. Validar desktop/mobile.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- FAQ abre por rota interna.
- Layout fica coerente com páginas institucionais.
- Não há links vazios principais.
- Responsividade básica validada.
- Conteúdo pendente está documentado.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 14B — FAQ — navegação, padronização visual e responsividade

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 14B — FAQ — navegação, padronização visual e responsividade e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/faq/faq.component.html`, `.ts`, `.scss`, `src/app/politica-privacidade/*` ou página institucional equivalente, `src/app/licenca-valor/*`, rotas de FAQ.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R26 — Etapa 15A — Carrinho — modelo de item, contador e revisão de dados de licença

**Referência original:** Etapa 15A — Carrinho — modelo de item, contador e revisão de dados de licença
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Revisar carrinho para suportar item com licença escolhida, exibir dados corretos, evitar manipulação direta frágil do contador e preparar checkout.

## Escopo / arquivos prováveis

`src/app/service/carrinho.service.ts`, `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss`, `src/app/cart-modal/*`, integração com músicas/licenças.

## Critérios de aceite

- [ ] Carrinho lista itens com licença escolhida.
- [ ] Preço/total não quebra quando licença existe.
- [ ] Contador atualiza sem reload.
- [ ] Remover item funciona se já existia.
- [ ] Limitações de persistência estão documentadas.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Carrinho deve refletir o fluxo de licença, mas checkout fica na próxima etapa.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 15A — Carrinho — modelo de item, contador e revisão de dados de licença

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Revisar carrinho para suportar item com licença escolhida, exibir dados corretos, evitar manipulação direta frágil do contador e preparar checkout.

## Arquivos que devem ser lidos antes de alterar
`src/app/service/carrinho.service.ts`, `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss`, `src/app/cart-modal/*`, integração com músicas/licenças.

## Arquivos prováveis de alteração
`src/app/service/carrinho.service.ts`, `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss`, `src/app/cart-modal/*`, integração com músicas/licenças.

## Tarefas técnicas em ordem
1. Ler CarrinhoService e CarrinhoComponent antes de alterar.
2. Confirmar se carrinho é em memória/localStorage e documentar limitação atual.
3. Garantir que item adicionado pela etapa 7C aparece com música, licença, preço e quantidade quando aplicável.
4. Corrigir contador para usar estado/observable existente quando possível, evitando DOM manual novo.
5. Validar remoção/alteração de quantidade se já existirem.
6. Não implementar endpoint de pedido nesta etapa.
7. Não quebrar cart-modal existente.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Carrinho lista itens com licença escolhida.
- Preço/total não quebra quando licença existe.
- Contador atualiza sem reload.
- Remover item funciona se já existia.
- Limitações de persistência estão documentadas.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 15A.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 15A — Carrinho — modelo de item, contador e revisão de dados de licença

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Revisar carrinho para suportar item com licença escolhida, exibir dados corretos, evitar manipulação direta frágil do contador e preparar checkout.

## Arquivos que devem ser inspecionados
`src/app/service/carrinho.service.ts`, `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss`, `src/app/cart-modal/*`, integração com músicas/licenças.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Ler CarrinhoService e CarrinhoComponent antes de alterar.
2. Confirmar se carrinho é em memória/localStorage e documentar limitação atual.
3. Garantir que item adicionado pela etapa 7C aparece com música, licença, preço e quantidade quando aplicável.
4. Corrigir contador para usar estado/observable existente quando possível, evitando DOM manual novo.
5. Validar remoção/alteração de quantidade se já existirem.
6. Não implementar endpoint de pedido nesta etapa.
7. Não quebrar cart-modal existente.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Carrinho lista itens com licença escolhida.
- Preço/total não quebra quando licença existe.
- Contador atualiza sem reload.
- Remover item funciona se já existia.
- Limitações de persistência estão documentadas.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 15A — Carrinho — modelo de item, contador e revisão de dados de licença

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 15A — Carrinho — modelo de item, contador e revisão de dados de licença e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/service/carrinho.service.ts`, `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss`, `src/app/cart-modal/*`, integração com músicas/licenças.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R27 — Etapa 15B — Checkout e fechamento do pedido

**Referência original:** Etapa 15B — Checkout e fechamento do pedido
**Tipo:** Implementação crítica
**Agente inicial recomendado:** Codex
**Risco:** Alto

## Objetivo da etapa

Estruturar fluxo de fechamento com revisão de carrinho, nome do projeto, comentários, aceite de termos e envio/simulação explícita conforme backend disponível.

## Escopo / arquivos prováveis

`src/app/carrinho/*`, `src/app/finalizar-compra/*`, `src/app/service/carrinho.service.ts`, services de pedidos/checkout se existirem, rotas relacionadas.

## Critérios de aceite

- [ ] Fluxo escolher licença → carrinho → checkout está navegável.
- [ ] Nome do projeto e comentários são validados.
- [ ] Aceite de termos é obrigatório se implementado.
- [ ] Total vem do carrinho, não de valor fixo incorreto.
- [ ] Pedido real ou simulado é explicitamente identificado.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Esta é uma etapa de alto risco comercial. Não prometa pagamento real sem gateway/backend.

## Prompt Codex — Execução / Implementação

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 15B — Checkout e fechamento do pedido

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Estruturar fluxo de fechamento com revisão de carrinho, nome do projeto, comentários, aceite de termos e envio/simulação explícita conforme backend disponível.

## Arquivos que devem ser lidos antes de alterar
`src/app/carrinho/*`, `src/app/finalizar-compra/*`, `src/app/service/carrinho.service.ts`, services de pedidos/checkout se existirem, rotas relacionadas.

## Arquivos prováveis de alteração
`src/app/carrinho/*`, `src/app/finalizar-compra/*`, `src/app/service/carrinho.service.ts`, services de pedidos/checkout se existirem, rotas relacionadas.

## Tarefas técnicas em ordem
1. Mapear duplicidade entre CarrinhoComponent e FinalizarCompraComponent.
2. Definir fluxo sem criar duas experiências conflitantes: carrinho revisa itens e checkout finaliza.
3. Validar campos nome do projeto, observações/comentários e aceite de termos.
4. Se existir endpoint de pedido, integrar usando service existente ou criar service mínimo tipado.
5. Se endpoint não existir, deixar o fechamento como simulação explícita/controlada e documentar pendência, sem fingir pedido real.
6. Remover total fixo hard-coded quando conflitar com total do carrinho.
7. Preservar autenticação e dados do usuário quando disponíveis.
8. Não implementar gateway de pagamento sem escopo/API.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Fluxo escolher licença → carrinho → checkout está navegável.
- Nome do projeto e comentários são validados.
- Aceite de termos é obrigatório se implementado.
- Total vem do carrinho, não de valor fixo incorreto.
- Pedido real ou simulado é explicitamente identificado.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 15B.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 15B — Checkout e fechamento do pedido

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Estruturar fluxo de fechamento com revisão de carrinho, nome do projeto, comentários, aceite de termos e envio/simulação explícita conforme backend disponível.

## Arquivos que devem ser inspecionados
`src/app/carrinho/*`, `src/app/finalizar-compra/*`, `src/app/service/carrinho.service.ts`, services de pedidos/checkout se existirem, rotas relacionadas.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Mapear duplicidade entre CarrinhoComponent e FinalizarCompraComponent.
2. Definir fluxo sem criar duas experiências conflitantes: carrinho revisa itens e checkout finaliza.
3. Validar campos nome do projeto, observações/comentários e aceite de termos.
4. Se existir endpoint de pedido, integrar usando service existente ou criar service mínimo tipado.
5. Se endpoint não existir, deixar o fechamento como simulação explícita/controlada e documentar pendência, sem fingir pedido real.
6. Remover total fixo hard-coded quando conflitar com total do carrinho.
7. Preservar autenticação e dados do usuário quando disponíveis.
8. Não implementar gateway de pagamento sem escopo/API.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Fluxo escolher licença → carrinho → checkout está navegável.
- Nome do projeto e comentários são validados.
- Aceite de termos é obrigatório se implementado.
- Total vem do carrinho, não de valor fixo incorreto.
- Pedido real ou simulado é explicitamente identificado.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 15B — Checkout e fechamento do pedido

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 15B — Checkout e fechamento do pedido e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
`src/app/carrinho/*`, `src/app/finalizar-compra/*`, `src/app/service/carrinho.service.ts`, services de pedidos/checkout se existirem, rotas relacionadas.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~

---

# R28 — Etapa 16 — QA final e regressão completa

**Referência original:** Etapa 16 — QA final e regressão completa
**Tipo:** QA / revisão final
**Agente inicial recomendado:** Claude Code
**Risco:** Médio/Alto

## Objetivo da etapa

Executar revisão final completa de build, testes, responsividade, fluxos de comprador/produtor e regressões nas áreas críticas.

## Escopo / arquivos prováveis

Todo o projeto, com foco nos arquivos alterados durante as etapas anteriores e áreas críticas: home, header, footer, login, músicas, player, WaveSurfer, stems, efeitos, upload, dashboard, pricing, FAQ, carrinho e checkout.

## Critérios de aceite

- [ ] Checklist final executado ou pendências documentadas.
- [ ] Build/testes executados ou falhas relatadas com clareza.
- [ ] Fluxos críticos revisados.
- [ ] Não há regressão bloqueadora conhecida.
- [ ] Relatório final está pronto para entrega/revisão do cliente.

## Comandos de validação sugeridos

```bash
git branch
git status
npm run build
npm test
```

## Observação operacional

Se houver reprovação, corrigir por prompts de correção pequenos, um problema por vez.

## Prompt Codex — Execução / QA

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior e agente de implementação do projeto MokBeats.

## Contexto da etapa
Etapa 16 — QA final e regressão completa

O MokBeats usa Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e API Node.js via `/api`.
A branch principal de implementação é `dev`.
A branch `codex/create-musical-producer-dashboard-design` só pode ser usada como referência visual para Dashboard, nunca como merge direto.

## Objetivo
Executar revisão final completa de build, testes, responsividade, fluxos de comprador/produtor e regressões nas áreas críticas.

## Arquivos que devem ser lidos antes de alterar
Todo o projeto, com foco nos arquivos alterados durante as etapas anteriores e áreas críticas: home, header, footer, login, músicas, player, WaveSurfer, stems, efeitos, upload, dashboard, pricing, FAQ, carrinho e checkout.

## Arquivos prováveis de alteração
Todo o projeto, com foco nos arquivos alterados durante as etapas anteriores e áreas críticas: home, header, footer, login, músicas, player, WaveSurfer, stems, efeitos, upload, dashboard, pricing, FAQ, carrinho e checkout.

## Tarefas técnicas em ordem
1. Esta etapa é preferencialmente revisão/QA. Codex pode corrigir somente bugs objetivos apontados pelo Claude.
2. Executar ou orientar execução de `git status`, `npm run build`, `npm test` e testes manuais.
3. Gerar lista de arquivos alterados desde o início da implementação.
4. Validar fluxos de comprador e produtor.
5. Validar responsividade e browsers principais.
6. Registrar bloqueadores, pendências e riscos remanescentes.
7. Não iniciar refatoração nova nesta etapa.

## Restrições obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Critérios de aceite
- Checklist final executado ou pendências documentadas.
- Build/testes executados ou falhas relatadas com clareza.
- Fluxos críticos revisados.
- Não há regressão bloqueadora conhecida.
- Relatório final está pronto para entrega/revisão do cliente.

## Comandos de validação
```bash
git branch
git status
npm run build
npm test
```

## Formato obrigatório da resposta final
Responda exatamente neste formato:

```md
## Resumo da etapa
...

## Arquivos lidos
- ...

## Arquivos alterados
- ...

## O que foi implementado ou auditado
- ...

## Comandos executados
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Como validar manualmente
1. ...
2. ...

## Riscos ou pendências
- ...

## Confirmação de escopo
Declare se alterou somente arquivos dentro do escopo. Se precisou sair do escopo, explique por quê.
```

Não altere áreas fora do escopo da Etapa 16.
~~~

## Prompt Claude Code — Revisão técnica

~~~text
Atue como revisor técnico sênior Angular 14/TypeScript, especialista em código legado, UX de plataforma musical e QA técnico do MokBeats.

## Contexto da etapa revisada
Etapa 16 — QA final e regressão completa

O Codex acabou de executar esta etapa na branch baseada em `dev`. Sua função é revisar o diff, procurar regressões e validar aderência a `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.

## O que deve ser revisado
Executar revisão final completa de build, testes, responsividade, fluxos de comprador/produtor e regressões nas áreas críticas.

## Arquivos que devem ser inspecionados
Todo o projeto, com foco nos arquivos alterados durante as etapas anteriores e áreas críticas: home, header, footer, login, músicas, player, WaveSurfer, stems, efeitos, upload, dashboard, pricing, FAQ, carrinho e checkout.

Além disso, inspecione `git diff`, `git status`, rotas, imports e qualquer arquivo alterado pelo Codex.

## Pontos críticos de validação
1. Esta etapa é preferencialmente revisão/QA. Codex pode corrigir somente bugs objetivos apontados pelo Claude.
2. Executar ou orientar execução de `git status`, `npm run build`, `npm test` e testes manuais.
3. Gerar lista de arquivos alterados desde o início da implementação.
4. Validar fluxos de comprador e produtor.
5. Validar responsividade e browsers principais.
6. Registrar bloqueadores, pendências e riscos remanescentes.
7. Não iniciar refatoração nova nesta etapa.

## Riscos específicos
- Mudanças fora do escopo da etapa.
- Remoção ou enfraquecimento de guards, interceptors, services ou autenticação.
- Uso indevido de `href="#"` ou `href=""`.
- Introdução de mocks permanentes no lugar de dados reais.
- Alteração de payload/API sem validação.
- Regressão visual ou funcional em player, WaveSurfer, carrinho, upload, dashboard ou rotas privadas quando aplicável.

## Checklist de aceite
- Checklist final executado ou pendências documentadas.
- Build/testes executados ou falhas relatadas com clareza.
- Fluxos críticos revisados.
- Não há regressão bloqueadora conhecida.
- Relatório final está pronto para entrega/revisão do cliente.

## Comandos sugeridos
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório do relatório
Responda exatamente neste formato:

```md
# Revisão Claude Code — Etapa 16 — QA final e regressão completa

## Classificação final
Escolha uma:
- Aprovado
- Aprovado com observações
- Reprovado — precisa correção

## Resumo da revisão
...

## Arquivos inspecionados
- ...

## Pontos aprovados
- ...

## Problemas encontrados
### Bloqueadores
- ...

### Importantes
- ...

### Menores
- ...

## Regressões potenciais
- ...

## Validação de comandos
- [ ] git status
- [ ] npm run build
- [ ] npm test

## Resultado dos comandos
...

## Correções exigidas para o Codex
Liste somente correções objetivas, pequenas e dentro do escopo.

## Observações finais
...
```

Se reprovar, seja específico: indique arquivo, trecho, impacto e correção esperada. Não solicite refatoração ampla fora do escopo.
~~~

## Prompt Codex — Correção pós-revisão

> Use este prompt somente se o Claude Code reprovar a etapa ou listar correções objetivas.

~~~text
Atue como desenvolvedor Angular 14/TypeScript sênior no projeto MokBeats.

## Contexto
Você implementou a Etapa 16 — QA final e regressão completa e o Claude Code revisou a alteração.

## Problemas encontrados pelo Claude Code
Cole aqui o relatório do Claude:

```md
[COLE AQUI O RELATÓRIO COMPLETO DO CLAUDE CODE]
```

## Tarefa
Corrija apenas os problemas apontados pelo Claude Code, sem refatorar áreas fora do escopo e sem iniciar melhorias novas.

## Arquivos prováveis
Todo o projeto, com foco nos arquivos alterados durante as etapas anteriores e áreas críticas: home, header, footer, login, músicas, player, WaveSurfer, stems, efeitos, upload, dashboard, pricing, FAQ, carrinho e checkout.

## Regras obrigatórias
- Trabalhe a partir da branch `dev`, salvo quando a etapa for explicitamente somente leitura da branch de referência.
- A branch `codex/create-musical-producer-dashboard-design` é apenas referência visual para Dashboard; não faça merge direto, cherry-pick amplo ou substituição cega.
- Leia `PROJECT_RULES.md`, `AGENTS.md` e, quando estiver usando Claude Code, `CLAUDE.md` antes de alterar ou revisar.
- Não migrar Angular, não converter para standalone components e não trocar a stack principal.
- Não remover guards, interceptors, services, autenticação, regras de perfil ou integração existente com API.
- Não remover WaveSurfer.js.
- Não substituir código real da `dev` por mocks permanentes.
- Não adicionar dependências sem justificativa técnica forte e validação de compatibilidade com Angular 14.
- Evitar `href="#"`, `href=""`, manipulação direta de DOM e jQuery novo.
- Usar `routerLink` ou navegação Angular para links internos.
- Links externos devem usar `target="_blank"` e `rel="noopener noreferrer"`.
- Fazer alterações pequenas, localizadas e reversíveis.
- Não alterar áreas fora do escopo da etapa.
- Não afirmar que `build` ou testes passaram sem executar os comandos.

## Procedimento
1. Leia o relatório do Claude.
2. Separe problemas bloqueadores, importantes e menores.
3. Corrija somente os itens objetivos.
4. Não altere arquivos não relacionados.
5. Rode validação possível.
6. Gere relatório final claro para nova revisão do Claude.

## Critérios de aceite da correção
- Todos os problemas objetivos do Claude foram corrigidos ou justificados.
- Nenhuma alteração fora do escopo foi introduzida.
- Build/testes foram executados quando possível ou falhas foram documentadas.
- O diff ficou menor e focado.

## Comandos de validação
```bash
git status
git diff --stat
git diff
npm run build
npm test
```

## Formato obrigatório da resposta final
```md
## Correções realizadas
- ...

## Arquivos alterados
- ...

## Itens do Claude resolvidos
- ...

## Itens não resolvidos e justificativa
- ...

## Comandos executados e resultado
- ...

## Como validar novamente
1. ...
```
~~~
