# PROJECT_RULES.md — Regras do Projeto MokBeats

Este documento concentra as regras técnicas, funcionais e de produto do projeto **MokBeats**.

Ele deve ser lido antes de qualquer implementação, revisão, auditoria, refatoração ou documentação operacional no repositório.

---

## 1. Visão geral

O **MokBeats** é uma plataforma web para venda, licenciamento, descoberta e gerenciamento de músicas, beats, loops, stems e efeitos sonoros.

O sistema possui dois públicos principais:

### Compradores

- exploram músicas e efeitos sonoros;
- usam filtros;
- ouvem previews;
- visualizam waveform;
- escolhem licenças;
- adicionam itens ao carrinho;
- finalizam pedido/compra.

### Produtores

- cadastram perfil;
- enviam músicas;
- enviam loops;
- enviam stems;
- enviam efeitos FX;
- acompanham vendas;
- acompanham receita;
- acompanham curtidas/desempenho;
- acessam dashboard.

A prioridade do projeto é evoluir a base existente com segurança, sem quebrar fluxos já funcionais.

---

## 2. Fonte de verdade e escopo

Este arquivo é a fonte central de regras técnicas, funcionais e de produto do MokBeats.

Toda tarefa deve respeitar o escopo solicitado.

> Protocolo de leitura antes de alterar qualquer coisa e formalização pré-edição:
> [`docs/areas/protocolo-planejamento.md`](docs/areas/protocolo-planejamento.md) — load on demand.

É proibido:

- alterar arquivos fora do escopo sem necessidade técnica clara;
- misturar feature pequena com refatoração ampla;
- modificar arquitetura global sem justificativa e validação humana;
- instalar dependências sem aprovação;
- remover código sem entender impacto;
- ampliar escopo sem informar justificativa, risco e alternativa de menor impacto;
- alterar contrato da API sem validar backend;
- alterar autenticação/autorização sem análise específica;
- executar deploy sem autorização explícita;
- declarar sucesso sem evidência de validação.

---

## 3. Stack do projeto

> Moved to [`docs/resources/stack-tecnica.md`](docs/resources/stack-tecnica.md) — load on demand.
## 4. Git, branch e segurança operacional

### Branch de implementação

```txt
dev
```

A branch `dev` é a base principal para implementação.

Nunca fazer merge direto da branch de referência visual do dashboard na `dev`, nem executar ações
destrutivas de Git sem pedido explícito.

> Regras da branch de referência visual do dashboard, checklist pré-tarefa e convenção de commits:
> [`docs/areas/git-e-branches.md`](docs/areas/git-e-branches.md) — load on demand.

---

## 5. Padrão de implementação incremental

Toda implementação deve ser incremental, localizada, simples, testável e reversível — pequena o
suficiente para revisão humana. Evite overengineering, abstrações prematuras e mocks permanentes.

> Listas completas de práticas a preferir e evitar:
> [`docs/areas/padrao-implementacao.md`](docs/areas/padrao-implementacao.md) — load on demand.

---

## 6. Regras gerais de arquitetura

> Moved to [`docs/areas/arquitetura-angular.md`](docs/areas/arquitetura-angular.md) — load on demand.
## 7. Autenticação e perfis

> Moved to [`docs/areas/auth-and-guards.md`](docs/areas/auth-and-guards.md) — load on demand.
## 8. Identidade visual e UX

> Moved to [`docs/areas/identidade-visual-ux.md`](docs/areas/identidade-visual-ux.md) — load on demand.
## 9. Regras por módulo

### 9.1 Header/Menu

> Moved to [`docs/areas/modulos/header-menu.md`](docs/areas/modulos/header-menu.md) — load on demand.
### 9.2 Home

> Moved to [`docs/areas/modulos/home.md`](docs/areas/modulos/home.md) — load on demand.
### 9.3 Login e Cadastro

> Moved to [`docs/areas/modulos/login-cadastro.md`](docs/areas/modulos/login-cadastro.md) — load on demand.
### 9.4 Página de Músicas

> Moved to [`docs/areas/modulos/pagina-musicas.md`](docs/areas/modulos/pagina-musicas.md) — load on demand.
### 9.5 Player

> Moved to [`docs/areas/player-and-waveform.md`](docs/areas/player-and-waveform.md) — load on demand.
### 9.6 Efeitos Sonoros

> Moved to [`docs/areas/modulos/efeitos-sonoros.md`](docs/areas/modulos/efeitos-sonoros.md) — load on demand.
### 9.7 Licenças e Preços

> Moved to [`docs/areas/license-cart-checkout.md`](docs/areas/license-cart-checkout.md) — load on demand.
### 9.8 Carrinho e Checkout

> Moved to [`docs/areas/license-cart-checkout.md`](docs/areas/license-cart-checkout.md) — load on demand.
### 9.9 Upload do Produtor

> Moved to [`docs/areas/producer-upload.md`](docs/areas/producer-upload.md) — load on demand.
### 9.10 Página do Artista

> Moved to [`docs/areas/modulos/pagina-artista.md`](docs/areas/modulos/pagina-artista.md) — load on demand.
### 9.11 Área do Produtor

> Moved to [`docs/areas/producer-dashboard.md`](docs/areas/producer-dashboard.md) — load on demand.
### 9.12 Dashboard do Produtor

> Moved to [`docs/areas/producer-dashboard.md`](docs/areas/producer-dashboard.md) — load on demand.
### 9.13 Footer

> Moved to [`docs/areas/modulos/footer.md`](docs/areas/modulos/footer.md) — load on demand.
### 9.14 FAQ

> Moved to [`docs/areas/modulos/faq.md`](docs/areas/modulos/faq.md) — load on demand.
## 10. Qualidade de código

> Moved to [`docs/areas/qualidade-de-codigo.md`](docs/areas/qualidade-de-codigo.md) — load on demand.
## 11. Secrets, variáveis e deploy

Nunca versionar arquivos de ambiente, nunca expor secret/token/senha em log, resposta ou client, e
nunca executar deploy sem autorização explícita.

> Detalhe completo (variáveis, segurança da aplicação, banco/migrations, deploy/VPS):
> [`docs/areas/variaveis-seguranca-deploy.md`](docs/areas/variaveis-seguranca-deploy.md) — load on demand.

---

## 12. Validação, QA e critérios de aceite

Antes de concluir, rodar os scripts reais disponíveis em `package.json` (`npm run build`, `npm test`,
`npm run lint`, `npm run typecheck`); nunca inventar comando nem declarar validação sem executá-la.
É proibido remover, desativar ou silenciar teste/validação existente sem justificativa e autorização.

> Fluxos a validar, checklist manual completo e critérios de aceite por tipo de tarefa:
> [`docs/areas/validacao-qa.md`](docs/areas/validacao-qa.md) — load on demand.

---

## 13. Decisões pendentes que exigem validação humana

Pedir validação antes de decidir definitivamente:

- valores reais de licenças;
- regras comerciais de licença;
- gateway de pagamento;
- endpoint final de checkout;
- endpoint final de efeitos sonoros;
- persistência da página pública do artista;
- layout final do dashboard se houver divergência com cliente;
- integração com MokBeats Hub;
- regras fiscais/faturamento;
- exportação de relatórios do dashboard;
- dependências novas;
- mudança em payload do backend;
- mudança em autenticação/autorização;
- alteração de deploy.

---

## 14. Convenção de commits recomendada

Usar commits pequenos e objetivos:

```txt
fix: corrige links quebrados na home
fix: ajusta seleção de perfil no login
feat: adiciona modal de seleção de licença
fix: corrige layout do upload do produtor
feat: aprimora dashboard do produtor
refactor: remove manipulação direta do DOM no carrinho
style: ajusta responsividade da página de músicas
```

Evitar commits genéricos:

```txt
ajustes
correções
update
mudanças
```

---

## 15. Relatório obrigatório

Toda entrega deve conter:

```md
## Relatório final

### Resumo
...

### Arquivos lidos
...

### Arquivos alterados
...

### O que foi implementado ou revisado
...

### Decisões técnicas
...

### Validações executadas
...

### Resultado das validações
...

### Riscos
...

### Pendências
...

### Recomendações
...

### Status final
Aprovado | Aprovado com observações | Requer ajustes | Bloqueado
```

Status final permitido:

- `Aprovado`;
- `Aprovado com observações`;
- `Requer ajustes`;
- `Bloqueado`.

Quando for necessário registrar relatório em arquivo para continuidade entre agentes, use o padrão em:

```txt
docs/ia-auditorias/TEMPLATE-agent-report.md
```

Não crie pasta paralela de relatórios sem justificativa.

---

## 16. Objetivo final do projeto

O MokBeats deve evoluir para uma plataforma musical estável, profissional e pronta para uso comercial, com:

- navegação confiável;
- player funcional;
- fluxo de licenças claro;
- carrinho consistente;
- upload de produtor bem estruturado;
- dashboard útil;
- layout responsivo;
- identidade visual consistente;
- código sustentável para futuras evoluções.

A prioridade é entregar valor real ao usuário e ao cliente sem comprometer a estabilidade da base existente.

<!-- drydocs:index:start -->
## Documentation index

### Areas
- [6. Regras gerais de arquitetura](docs/areas/arquitetura-angular.md)
- [7. Autenticação e perfis](docs/areas/auth-and-guards.md)
- [4. Git, branch e segurança operacional — branch de referência e checklist](docs/areas/git-e-branches.md)
- [8. Identidade visual e UX](docs/areas/identidade-visual-ux.md)
- [9.7 Licenças e Preços](docs/areas/license-cart-checkout.md)
- [9.6 Efeitos Sonoros](docs/areas/modulos/efeitos-sonoros.md)
- [9.14 FAQ](docs/areas/modulos/faq.md)
- [9.13 Footer](docs/areas/modulos/footer.md)
- [9.1 Header/Menu](docs/areas/modulos/header-menu.md)
- [9.2 Home](docs/areas/modulos/home.md)
- [9.3 Login e Cadastro](docs/areas/modulos/login-cadastro.md)
- [9.10 Página do Artista](docs/areas/modulos/pagina-artista.md)
- [9.4 Página de Músicas](docs/areas/modulos/pagina-musicas.md)
- [5. Padrão de implementação incremental](docs/areas/padrao-implementacao.md)
- [9.5 Player](docs/areas/player-and-waveform.md)
- [9.12 Dashboard do Produtor](docs/areas/producer-dashboard.md)
- [9.9 Upload do Produtor](docs/areas/producer-upload.md)
- [2. Fonte de verdade e escopo — protocolo de leitura e planejamento](docs/areas/protocolo-planejamento.md)
- [10. Qualidade de código](docs/areas/qualidade-de-codigo.md)
- [12. Validação, QA e critérios de aceite](docs/areas/validacao-qa.md)
- [11. Secrets, variáveis e deploy](docs/areas/variaveis-seguranca-deploy.md)

### Resources
- [3. Stack do projeto](docs/resources/stack-tecnica.md)

<!-- drydocs:index:end -->
