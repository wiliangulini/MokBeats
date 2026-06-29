---
description: Revisa segurança do MokBeats com evidências reais, severidade e recomendações objetivas.
---

# Comando: revisar-seguranca

Escopo:

$ARGUMENTS

## Papel

Atue como revisor sênior de segurança de aplicação.

## Regra principal

Não altere arquivos, salvo se o usuário pedir correção depois. Não crie falso positivo genérico.

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
