# Configuração operacional do Claude Code no MokBeats

> Última conferência com os arquivos versionados do repositório: **2026-08-14**.

Este documento explica como usar as camadas públicas de configuração do Claude Code neste projeto:
commands, skills, rules e `settings.json`. Ele é um guia de uso; as fontes de verdade continuam sendo
os próprios arquivos de configuração e as regras canônicas do projeto.

## Fontes de verdade

| Arquivo | Responsabilidade |
| --- | --- |
| [`PROJECT_RULES.md`](PROJECT_RULES.md) | Protocolo canônico, regras de domínio, validação e formato do relatório final. |
| [`AGENTS.md`](AGENTS.md) | Roteamento operacional, modos, segurança, Git, evidência e continuidade entre agentes. |
| [`CLAUDE.md`](CLAUDE.md) | Guia de operação específico do Claude Code. |
| [`.claude/commands/`](.claude/commands/) | Entrypoints explícitos invocados com `/nome` e argumentos. |
| [`.claude/skills/`](.claude/skills/) | Metodologias reutilizáveis; não concedem autorização de escrita. |
| [`.claude/rules/`](.claude/rules/) | Invariantes de domínio ativados pelos caminhos afetados. |
| [`.claude/settings.json`](.claude/settings.json) | Permissões e preferências públicas do projeto para o Claude Code. |

`PROJECT_RULES.md` prevalece em caso de divergência. O protocolo comum não deve ser duplicado nos
commands, skills ou rules.

## Como as camadas se relacionam

| Camada | Como é acionada | Recebe contexto? | Autoriza edição? |
| --- | --- | --- | --- |
| **Command** | Explicitamente, com `/nome argumentos` | Sim, por `$ARGUMENTS` | Depende do contrato do command. |
| **Skill** | Selecionada pelo Claude ou pedida em linguagem natural | A tarefa normal fornece o contexto | Não por si só; depende da tarefa e do modo. |
| **Rule** | Automaticamente quando um caminho casa com o `paths` do frontmatter | Usa o contexto da tarefa | Não; apenas impõe invariantes do domínio. |
| **Settings** | Carregada pelo Claude Code no projeto | Não se aplica | Limita ferramentas, mas não substitui as regras do repositório. |

Não combine manualmente um command com uma skill equivalente. Os commands já indicam internamente a
metodologia apropriada. Escolha o recurso mais específico para a tarefa.

### Inventário atual

- **12 commands** em `.claude/commands/`;
- **6 skills** em `.claude/skills/`;
- **8 rules** em `.claude/rules/`;
- **1 configuração pública** em `.claude/settings.json`.

## Commands — `/comandos`

Todos os commands atuais usam `$ARGUMENTS`, mas isso não significa que qualquer texto seja válido.
O `/verificar-scripts-shell`, em especial, aceita uma gramática fechada. Commands de revisão e
auditoria também têm contratos de escrita restritos.

### Resumo e contrato de escrita

| Command | Finalidade | Contrato de escrita |
| --- | --- | --- |
| `/create-code` | Implementação incremental e correção dentro de escopo claro. | Pode editar os arquivos necessários ao escopo. |
| `/review-code` | Revisão de diff ou implementação com severidade e evidências. | Não altera implementação; relatório opcional somente em caminho exato `docs/ia-auditorias/*-revisao.md`. |
| `/refactor-code` | Refatoração incremental com preservação de comportamento e contratos. | Pode editar o alvo autorizado da refatoração. |
| `/debug-app` | Investigação de causa raiz antes de propor correção. | Só implementa correção se o pedido incluir corrigir. |
| `/architecture-decision` | Análise arquitetural e trade-offs baseados no projeto real. | Não implementa automaticamente; ADR opcional somente em caminho exato sob `docs/adr/`. |
| `/checklist-merge` | Verificação objetiva antes de merge. | Não altera implementação; relatório opcional somente em caminho exato sob `docs/ia-auditorias/`. |
| `/final-audit` | Auditoria antes de commit, entrega ou handoff. | Não corrige implementação; relatório opcional somente em `docs/ia-auditorias/*-auditoria-final.md`. |
| `/continue-from-codex` | Continuidade baseada no relatório anterior e no estado real do Git. | Depende do próximo passo autorizado: implementar, revisar ou refatorar. |
| `/melhorar-ui-ux` | Melhoria incremental de UI/UX, responsividade e acessibilidade. | Pode editar a tela e os estilos no escopo autorizado. |
| `/revisar-performance` | Revisão de performance baseada em código real e medição. | Não altera implementação; relatório opcional somente em caminho exato sob `docs/ia-auditorias/`. |
| `/revisar-seguranca` | Revisão de segurança com evidências e severidade. | Não altera implementação; relatório opcional somente em caminho exato sob `docs/ia-auditorias/`. |
| `/verificar-scripts-shell` | Auditoria estática dos scripts Shell versionados. | Somente leitura e resposta no chat; nunca escreve relatório nem corrige scripts. |

### `/create-code` — implementação incremental

Use para implementar uma funcionalidade ou corrigir um problema específico. O command aplica a
metodologia `senior-code-agent`, verifica branch e Git, mapeia o fluxo, implementa apenas o escopo,
revê o diff e executa validações reais quando seguro.

```text
/create-code adicione filtro por BPM usando o serviço de músicas existente
```

### `/review-code` — revisão técnica

Use para revisar o diff atual, uma etapa concluída ou um escopo informado. O command aplica
`senior-code-review`, classifica achados como Crítico, Alto, Médio, Baixo ou Observação e não altera
a implementação.

```text
/review-code revise as alterações no upload do produtor
```

Para autorizar um relatório em arquivo, informe um caminho exato válido:

```text
/review-code revise o upload e registre em docs/ia-auditorias/upload-revisao.md
```

### `/refactor-code` — refatoração segura

Use para melhorar estrutura, legibilidade ou testabilidade sem mudar comportamento funcional. O
command aplica `safe-refactor` e deve parar se surgir mudança de contrato, dependência nova,
reescrita ampla ou risco de autenticação/autorização.

```text
/refactor-code extraia a formatação de duração do player para um helper reutilizável
```

### `/debug-app` — investigação de bugs

Use para separar fatos, hipóteses e causa raiz. Investigar não autoriza corrigir: inclua
explicitamente a correção no pedido quando quiser implementação.

```text
/debug-app investigue por que o contador do carrinho não atualiza ao remover um item
```

```text
/debug-app investigue e corrija o contador do carrinho que não atualiza ao remover um item
```

### `/architecture-decision` — decisão arquitetural

Use para analisar alternativas, trade-offs, impactos e riscos. O command aplica
`architecture-review`. Sem caminho exato, a resposta fica no chat; um ADR só pode ser gravado sob
`docs/adr/` quando o caminho for informado.

```text
/architecture-decision avalie como sincronizar o estado do player entre componentes
```

```text
/architecture-decision avalie a sincronização do player e registre em docs/adr/0003-estado-player.md
```

### `/checklist-merge` — checklist antes de merge

Use para verificar status, diff, escopo, segurança, contratos e validações antes de merge. O command
é de revisão e não executa merge nem altera arquivos de implementação.

```text
/checklist-merge verifique a branch feature/dashboard-produtor-mvp antes do merge na dev
```

### `/final-audit` — auditoria final

Use antes de commit, entrega ou handoff. O command procura alterações fora do escopo, código morto,
logs temporários, regressões, riscos e validações pendentes, sem corrigir a implementação auditada.

```text
/final-audit valide a etapa atual antes do commit
```

### `/continue-from-codex` — continuidade entre agentes

Use quando o Codex deixou um relatório ou contexto para continuação. O command confere branch,
status, diff e arquivos reais antes de aceitar as conclusões do relatório.

```text
/continue-from-codex continue a partir de docs/ia-auditorias/etapa-player.md
```

### `/melhorar-ui-ux` — melhoria visual

Use para ajustes incrementais de hierarquia visual, responsividade, contraste, acessibilidade e
estados de loading/erro/vazio. O command preserva comportamento e não instala biblioteca visual sem
aprovação.

```text
/melhorar-ui-ux melhore a hierarquia e a responsividade dos cards de música no mobile
```

### `/revisar-performance` — revisão de performance

Use para analisar gargalos com evidência de código real e indicação de como medir. O command aplica
`senior-code-review`, não altera implementação na revisão e evita recomendar troca de stack como
primeira solução.

```text
/revisar-performance analise subscriptions sem cleanup no player e no dashboard
```

### `/revisar-seguranca` — revisão de segurança

Use para revisar autenticação, autorização, upload, validação, exposição de dados, XSS e outros riscos
aplicáveis. O command não altera implementação e nunca autoriza ler `.env`, secrets ou
`.claude/settings.local.json`.

```text
/revisar-seguranca revise token, guards e perfis comprador/produtor
```

### `/verificar-scripts-shell` — auditoria somente leitura de Shell

Este command só pode ser chamado explicitamente (`disable-model-invocation: true`) e bloqueia as
ferramentas de edição, escrita e delegação durante a invocação. Ele nunca executa um script, nem com
`--help`, `--dry-run` ou opção semelhante.

Aceita exatamente uma destas formas:

```text
/verificar-scripts-shell todos
/verificar-scripts-shell start.sh
```

- `todos` usa o inventário real de arquivos `.sh` versionados pelo Git;
- o outro formato aceita exatamente um caminho relativo, regular, interno e versionado terminado em
  `.sh`;
- entrada vazia, múltiplos caminhos, caminho absoluto, glob, symlink, arquivo não versionado ou
  metacaractere são rejeitados;
- a resposta é sempre entregue no chat e cada script recebe um resultado explícito;
- validações bloqueadas por `.claude/settings.json` são registradas como não executadas, sem tentativa
  de contorno.

## Skills — metodologias reutilizáveis

Skills não são slash commands. Descreva a tarefa normalmente; o Claude pode selecionar a skill
adequada, ou você pode pedi-la pelo nome. A skill não amplia o escopo nem concede autorização para
editar arquivos.

| Skill | Quando usar | Limite principal |
| --- | --- | --- |
| `senior-code-agent` | Implementação incremental, correção localizada ou continuidade técnica. | Não usar para revisão somente leitura, refatoração ampla, decisão formal ou escopo arriscado e ambíguo. |
| `senior-code-review` | Revisão de código, diff, regressão, escopo ou etapa concluída. | Não altera código automaticamente. |
| `safe-refactor` | Refatoração incremental com comportamento e contratos preservados. | Para diante de mudança de contrato, dependência, ampliação de escopo, reescrita ou risco de auth. |
| `legacy-code-audit` | Entendimento de módulo legado antes de implementar ou refatorar. | Auditoria somente leitura; não altera arquivos. |
| `architecture-review` | Avaliação arquitetural, alternativas, trade-offs e impacto sistêmico. | Não substitui decisão humana nem autoriza mudança de contrato, stack, dependência ou auth. |
| `implementation-planning` | Planejamento multiarquivo, sensível ou de roadmap. | Não implementa durante a skill. |

Exemplos de pedido em linguagem natural:

```text
Use implementation-planning para criar um plano incremental do dashboard do produtor.
Use legacy-code-audit para mapear o módulo de upload antes de qualquer alteração.
Use architecture-review para avaliar a separação de responsabilidades do carrinho e checkout.
```

### Metodologia já associada a cada command

| Command | Skill/metodologia referenciada internamente |
| --- | --- |
| `/create-code` | `senior-code-agent` |
| `/review-code` | `senior-code-review` |
| `/refactor-code` | `safe-refactor` |
| `/debug-app` | `senior-code-agent` apenas ao implementar a correção mínima autorizada |
| `/architecture-decision` | `architecture-review` |
| `/checklist-merge` | `senior-code-review` |
| `/final-audit` | `senior-code-review` |
| `/continue-from-codex` | `senior-code-agent`, `senior-code-review` ou `safe-refactor`, conforme o próximo passo |
| `/melhorar-ui-ux` | `senior-code-agent` ao implementar |
| `/revisar-performance` | `senior-code-review` |
| `/revisar-seguranca` | `senior-code-review` |
| `/verificar-scripts-shell` | Metodologia de `senior-code-review`; nenhuma outra skill é permitida nessa invocação |

## Rules — invariantes automáticos por caminho

Rules não são workflows e não são chamadas com `/`. Elas entram em vigor quando os arquivos tocados
casam com os padrões `paths` do frontmatter. Mais de uma rule pode ser aplicável à mesma tarefa.

| Rule | Áreas cobertas |
| --- | --- |
| [`buyer-flow.md`](.claude/rules/buyer-flow.md) | Home, menu, filtros, paginação, FAQ e footer. |
| [`auth-and-guards.md`](.claude/rules/auth-and-guards.md) | Login, auth, guards, interceptors, token e perfis. |
| [`license-cart-checkout.md`](.claude/rules/license-cart-checkout.md) | Músicas, efeitos, licenças, carrinho e checkout. |
| [`angular.md`](.claude/rules/angular.md) | Módulos, routing, `app.module.ts`, `main.ts` e `angular.json`. |
| [`api-contracts.md`](.claude/rules/api-contracts.md) | Services HTTP, contratos e environments. |
| [`player-and-waveform.md`](.claude/rules/player-and-waveform.md) | Player, áudio, WaveSurfer e lifecycle. |
| [`producer-dashboard.md`](.claude/rules/producer-dashboard.md) | Dashboard, menus e páginas pública/privada do produtor. |
| [`producer-upload.md`](.claude/rules/producer-upload.md) | Upload do produtor e contrato `FormData`. |

O mapa operacional completo de área para rule está em `AGENTS.md §8.0`.

## Configuração pública — `.claude/settings.json`

A configuração versionada atual define:

- limpeza de dados temporários após **14 dias**;
- memória automática e compactação automática habilitadas;
- modo padrão `default`;
- `disableAutoMode` e `disableBypassPermissionsMode` definidos como `disable`;
- exclusão de `CLAUDE.md` sob `node_modules`, `dist` e `build`;
- plugin `drydocs@cardio` habilitado;
- nenhum hook de projeto configurado nesse arquivo;
- nenhum custom agent versionado em `.claude/agents/`.

### Política de ferramentas

**Permitido diretamente:** inspeção Git de leitura (`status`, `branch`, `diff`, `log`, `ls-files`),
busca/listagem (`find`, `ls`, `rg`), leitura de `package.json` e validações previstas como testes,
build, lint e typecheck.

Uma permissão em `settings.json` não prova que o script existe: antes de executar uma validação, é
obrigatório conferir os scripts reais de `package.json`.

**Exige confirmação:** `git add`, `git commit`, instalação de dependências, uso genérico de `npx`,
MySQL, Docker, migrations e `WebFetch`.

**Negado:** leitura/edição de `.env`, secrets, credentials e `.claude/settings.local.json`; comandos
destrutivos; `git push`; elevação de privilégio; download/rede por `curl` ou `wget`; deploy e SSH.

As permissões da ferramenta são defesa em profundidade, não autorização de escopo. Mesmo que um
comando não esteja negado em `settings.json`, continuam valendo `PROJECT_RULES.md`, `AGENTS.md`,
`CLAUDE.md` e o contrato do command ativo.

## Guia de escolha rápida

```text
Implementar ou corrigir algo            -> /create-code <tarefa>
Revisar diff ou etapa                   -> /review-code <escopo>
Refatorar preservando comportamento     -> /refactor-code <alvo>
Investigar bug                          -> /debug-app <sintoma>
Analisar decisão técnica                -> /architecture-decision <decisão>
Validar antes de merge                  -> /checklist-merge <contexto>
Auditar antes de commit/entrega         -> /final-audit <contexto>
Continuar trabalho do Codex             -> /continue-from-codex <relatório/contexto>
Melhorar tela ou responsividade         -> /melhorar-ui-ux <tela/problema>
Revisar gargalo                         -> /revisar-performance <área>
Revisar segurança                       -> /revisar-seguranca <área>
Auditar scripts Shell sem executá-los   -> /verificar-scripts-shell <todos|arquivo.sh>

Planejar antes de implementar           -> peça implementation-planning
Auditar módulo legado                   -> peça legacy-code-audit
Fazer revisão arquitetural ampla        -> peça architecture-review
```

## Manutenção deste documento

Ao adicionar, remover ou alterar um arquivo em `.claude/`, atualize este guia na mesma etapa. Antes
de declarar o mapeamento correto, compare o inventário real de commands, skills e rules e confira os
frontmatters, contratos de escrita e permissões vigentes.
