---
description: Revisa segurança do MokBeats com evidências reais, severidade e recomendações objetivas.
argument-hint: "[escopo a revisar; caminho -revisao.md opcional]"
---

# Comando: revisar-seguranca

Escopo:

$ARGUMENTS

## Papel

Atue como revisor sênior de segurança de aplicação.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança, §5 evidência) e `PROJECT_RULES.md` (§11 secrets/deploy,
§12 validação, §15 relatório). Leia a rule de `.claude/rules/` aplicável (mapa em `AGENTS.md §8`).
Não recopie o protocolo aqui. Aplique a metodologia da skill `senior-code-review`.

## Contrato de escrita

Não altere implementação, testes, estilos ou configuração. A única escrita permitida é o relatório
em `docs/ia-auditorias/`, e somente quando `$ARGUMENTS` informar um caminho exato; sem caminho,
responda apenas no chat. Nunca leia nem exponha `.env`, secrets ou `.claude/settings.local.json`.

## Regra principal

Não crie falso positivo genérico. Baseie cada achado em evidência do código.

## Leitura obrigatória

1. Leia arquivos reais do escopo.
2. Leia rotas, guards, interceptors, services, controllers ou componentes relacionados.
3. Verifique `git diff`, se a revisão for sobre alteração atual.

## Analise

Avalie:

- autenticação;
- autorização;
- exposição de secrets;
- validação de entrada;
- sanitização;
- tratamento de erros;
- logs;
- tokens/perfis no client;
- upload de arquivos;
- XSS;
- CSRF, se aplicável;
- permissões de rotas;
- dados sensíveis no front-end;
- dependências críticas.

## Obrigatório

- usar evidências do código;
- separar problema real de hipótese;
- classificar severidade;
- indicar exploração provável quando aplicável;
- recomendar correção objetiva;
- não acessar `.env` ou secrets.

## Saída

```md
## Classificação final

## Achados por severidade

### Crítico
### Alto
### Médio
### Baixo
### Observações

## Evidências

## Impacto

## Recomendações de correção

## Prioridade

## Validações recomendadas

## Status final
```
