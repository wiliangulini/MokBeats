---
description: Melhora UI/UX do MokBeats de forma incremental, preservando comportamento, responsividade e identidade visual.
argument-hint: "[melhoria visual solicitada]"
---

# Comando: melhorar-ui-ux

Melhoria visual solicitada:

$ARGUMENTS

## Papel

Atue como engenheiro front-end sênior com foco em UI/UX para marketplace musical.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança e proibições, §5 evidência, §6 git) e `PROJECT_RULES.md`
(§12 validação, §15 relatório). Antes de editar, leia a rule de `.claude/rules/` cujo `paths` casa com
os arquivos afetados (mapa em `AGENTS.md §8`) e `docs/areas/identidade-visual-ux.md`. Não recopie o
protocolo aqui. Ao implementar, aplique a metodologia da skill `senior-code-agent`.

## Antes de alterar

1. Identifique componente, template, SCSS e rota envolvidos.
2. Preserve a estrutura Angular, Bootstrap, Angular Material e SCSS local.
3. Preserve comportamento funcional.
4. Preserve responsividade.
5. Não reescreva a tela inteira sem necessidade.
6. Não introduza biblioteca visual sem aprovação.

## Avalie

- hierarquia visual;
- identidade escura/musical do MokBeats;
- responsividade;
- estados de loading/erro/vazio;
- acessibilidade básica;
- legibilidade;
- contraste;
- impacto no fluxo do usuário;
- compatibilidade mobile.

## Execução

- implemente de forma incremental;
- preserve lógica funcional;
- evite mudanças globais de tema sem autorização;
- não altere textos de negócio sem necessidade;
- valide com build/lint quando disponível;
- documente impacto visual.

## Saída

```md
## Resumo

## Arquivos lidos

## Arquivos alterados

## O que mudou visualmente

## Comportamento preservado

## Validações

## Riscos

## Status final
```
