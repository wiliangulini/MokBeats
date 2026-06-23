# AGENTS.md — Instruções para Agentes de IA no Projeto MokBeats

Este arquivo define como agentes de IA devem atuar no repositório **MokBeats**.

Use estas regras para Codex, Claude Code, ChatGPT, extensões de IA no VS Code e qualquer outro agente que leia, edite, revise ou documente código neste projeto.

---

## 1. Identidade do projeto

**Projeto:** MokBeats
**Tipo:** Plataforma web musical / marketplace de beats, músicas, efeitos sonoros, licenças e área de produtores
**Stack principal:** Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API, WaveSurfer.js
**Branch principal de trabalho:** `dev`
**Branch de referência visual para dashboard:** `codex/create-musical-producer-dashboard-design`

O projeto possui uma base funcional na branch `dev` e uma branch separada com proposta visual de dashboard do produtor.

A branch de dashboard **não deve ser mesclada diretamente** na `dev`. Ela deve ser usada apenas como referência visual e conceitual.

---

## 2. Prioridade das instruções

Ao trabalhar neste repositório, siga a ordem:

1. Solicitação explícita do usuário/desenvolvedor.
2. `PROJECT_RULES.md`.
3. Este arquivo `AGENTS.md`.
4. `CLAUDE.md`, quando estiver usando Claude Code.
5. `CODEX.md`, quando estiver usando Codex ou houver continuidade entre Codex e Claude Code.
6. `.codex/instructions.md`, que deve ser lido explicitamente quando estiver usando Codex.
7. `.claude/instructions.md`, `.claude/commands/` e `.claude/skills/`, quando estiver usando Claude Code.
8. Código existente da branch atual.
9. Boas práticas de Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API, WaveSurfer.js e UX.

Quando houver conflito entre instruções, preserve a estabilidade da branch `dev` e comunique o conflito antes de aplicar alterações grandes.

---

## 3. Modos de atuação

### 3.1 Modo implementação

O agente pode editar arquivos quando solicitado.

Obrigatório:

- entender o código antes de editar;
- verificar branch e alterações pendentes;
- propor plano curto;
- implementar incrementalmente;
- preservar padrões existentes;
- validar com comandos disponíveis;
- gerar relatório final.

### 3.2 Modo revisão/auditoria

O agente não deve editar arquivos, salvo se o usuário pedir correção.

Obrigatório:

- ler diff;
- ler arquivos alterados;
- comparar com escopo;
- identificar regressões;
- classificar achados por severidade;
- recomendar status final.

### 3.3 Modo planejamento

O agente não deve editar arquivos.

Obrigatório:

- mapear arquitetura;
- identificar riscos;
- propor etapas;
- definir critérios de aceite;
- sugerir validações;
- registrar decisões pendentes.

Durante o Modo Planejamento, o agente deve apenas analisar e responder com um plano.
Não deve criar, alterar, mover, excluir ou sobrescrever arquivos, salvo se o usuário pedir explicitamente para criar ou salvar um arquivo de plano.
Se o usuário não pedir criação de arquivo, o plano deve ser entregue apenas como resposta no chat.

### 3.4 Modo documentação

O agente pode criar ou atualizar documentação quando solicitado.

Obrigatório:

- não inventar estrutura;
- não documentar recurso inexistente como implementado;
- separar regra atual, recomendação e pendência;
- manter documentação compatível com `PROJECT_RULES.md`.

---

## 4. Regra principal de segurança

Nunca faça refatorações amplas, migrações de framework, alteração de arquitetura global ou troca de bibliotecas sem solicitação explícita.

O MokBeats é um projeto legado/ativo. O objetivo é evoluir com segurança, corrigindo problemas e implementando feedbacks sem quebrar o fluxo existente.

O agente deve parar e pedir autorização quando a tarefa envolver:

- dados de produção;
- deploy;
- credenciais;
- alteração destrutiva;
- mudança ampla de arquitetura;
- alteração sensível em autenticação/autorização;
- alteração irreversível de banco;
- escopo ambíguo com alto risco;
- dependência nova;
- mudança de contrato com backend.

Se surgir necessidade de ampliar o escopo autorizado, o agente deve parar antes
de editar e informar:

- arquivo ou área adicional;
- justificativa técnica baseada em evidência;
- risco da ampliação;
- alternativa de menor impacto.

---

## 5. Evidência obrigatória

Toda conclusão técnica deve se apoiar em evidência:

- arquivo lido;
- trecho de código;
- script encontrado;
- erro reproduzido;
- teste executado;
- build executado;
- padrão já existente no projeto;
- documentação oficial quando necessário.

Quando não houver evidência suficiente, o agente deve declarar incerteza.

É proibido inventar:

- estrutura de projeto;
- APIs;
- rotas;
- tabelas;
- scripts;
- dependências;
- services;
- componentes;
- payloads;
- variáveis de ambiente.

---

## 6. Branches e estratégia de trabalho

### Branch base

Use sempre a branch `dev` como base de implementação, salvo instrução contrária.

Antes de alterar código, confirme branch e estado do Git.

Se for criar uma branch de feature, use nomes claros:

```txt
feature/frontend-client-feedback
feature/dashboard-produtor-mvp
fix/player-navigation-and-license-modal
fix/upload-producer-form-layout
```

### Branch de dashboard

A branch abaixo contém um design de dashboard do produtor:

```txt
codex/create-musical-producer-dashboard-design
```

Regras:

- Não fazer merge direto dessa branch na `dev`.
- Não copiar cegamente `app.module.ts`, `app-routing.module.ts`, guards, interceptors ou configurações globais dessa branch.
- Aproveitar apenas ideias visuais, componentes pontuais e padrões de layout.
- Manter a proteção de rota do dashboard existente na `dev`.
- Manter integração real com `DashboardService` existente na `dev`.
- Se for necessário instalar biblioteca de gráficos, justificar antes e verificar compatibilidade com Angular 14.

---

## 7. Critérios de decisão técnica

Priorizar:

1. correção funcional;
2. segurança;
3. preservação de comportamento existente;
4. compatibilidade com Angular 14 e arquitetura atual;
5. simplicidade;
6. manutenibilidade;
7. testabilidade;
8. baixo risco;
9. performance;
10. reversibilidade.

Não priorizar novidade técnica sem necessidade.

Toda decisão relevante deve registrar justificativa e risco residual.

### Preservação de comportamento e contratos

Em qualquer alteração:

- mapear consumidores e contratos públicos antes de alterar código compartilhado;
- preservar rotas, payloads, tipos exportados, assinaturas públicas e permissões;
- preservar seletores, classes, IDs e atributos usados por lógica, estilos ou testes;
- preservar loading, erro, vazio, acessibilidade básica e compatibilidade com dados legados;
- não remover silenciosamente testes, validações ou tratamento de erro.

---

## 8. Refatoração segura

Refatoração só deve ocorrer quando:

- fizer parte do escopo;
- reduzir risco;
- remover duplicação relevante;
- melhorar clareza sem alterar comportamento;
- for necessária para implementar a tarefa.

Toda refatoração deve:

- preservar comportamento existente;
- ser localizada;
- evitar reformatar arquivos inteiros;
- evitar misturar mudança visual, funcional e arquitetural sem necessidade;
- ser validada com build/teste ou validação manual objetiva.

---

## 9. Stack e restrições técnicas

### Angular

- O projeto usa Angular 14.
- Não migrar para Angular 15+ sem autorização.
- Não converter para standalone sem autorização.
- Não substituir estrutura de módulos existente.
- Evitar APIs modernas não suportadas pela versão atual.
- Manter compatibilidade com TypeScript usado pelo projeto.

### Estilização

O projeto usa SCSS, Bootstrap e Angular Material.

Regras:

- Preferir alterações localizadas no SCSS do componente.
- Evitar CSS global salvo para tokens, resets ou correções compartilhadas.
- Não quebrar responsividade existente.
- Validar desktop, tablet e mobile quando a tela for afetada.
- Preservar identidade visual escura/musical do MokBeats.

### TypeScript

- Usar tipagem explícita quando possível.
- Evitar `any`, exceto em integrações legadas onde a tipagem exata não esteja clara.
- Não adicionar lógica complexa diretamente no template.
- Evitar manipulação direta de DOM.
- Quando houver manipulação legada de DOM, reduzir gradualmente e substituir por estado Angular.

### Dependências

Não adicionar dependências sem necessidade real.

Antes de adicionar biblioteca:

1. verificar se já existe solução no projeto;
2. verificar compatibilidade com Angular 14;
3. justificar o motivo;
4. preferir implementação simples com Angular/SCSS nativo quando possível;
5. pedir aprovação quando houver impacto de manutenção.

---

## 10. Testes e validação

O agente deve procurar scripts reais no projeto antes de executar comandos.

Comandos possíveis, apenas se existirem:

```bash
npm run build
npm test
npm run lint
npm run typecheck
```

Quando o projeto tiver problemas prévios que impeçam algum comando, registrar:

- comando executado;
- erro encontrado;
- se o erro parece anterior à alteração;
- arquivos alterados relacionados;
- validação manual alternativa.

Não afirmar que validou build/testes se não executou.

---

## 11. Áreas principais do projeto

As regras completas por módulo estão em `PROJECT_RULES.md`. Este resumo ajuda agentes a localizar risco e escopo.

### 11.1 Header/Menu

Arquivos prováveis:

```txt
src/app/menu/menu.component.html
src/app/menu/menu.component.ts
src/app/menu/menu.component.scss
```

Prioridades:

- manter logo;
- corrigir link do MokBeats Hub;
- evitar links quebrados;
- preservar menu responsivo;
- revisar carrinho sem manipulação frágil do DOM.

### 11.2 Home

Arquivos prováveis:

```txt
src/app/home/home.component.html
src/app/home/home.component.ts
src/app/home/home.component.scss
```

Prioridades:

- corrigir botões “Saber mais”;
- direcionar seção de produtores para fluxo correto;
- evitar links vazios;
- manter últimas músicas carregadas dinamicamente.

### 11.3 Login/Cadastro

Arquivos prováveis:

```txt
src/app/login/login.component.html
src/app/login/login.component.ts
src/app/login/login.component.scss
```

Prioridades:

- corrigir bug visual dos “pontinhos”/fonte no campo “Tipo Perfil”;
- preservar perfis `comprador` e `produtor`;
- preservar integração com `AuthService`;
- não quebrar token e perfil.

### 11.4 Músicas

Arquivos prováveis:

```txt
src/app/musicas/musicas.component.html
src/app/musicas/musicas.component.ts
src/app/musicas/musicas.component.scss
src/app/musicas/musicas.service.ts
src/app/components/filter/*
src/app/components/pagination/*
src/app/components/wavesurfer-test/*
```

Prioridades:

- corrigir clique no nome da música;
- abrir modal de licença antes do carrinho quando aplicável;
- melhorar alinhamento;
- corrigir filtro lateral/minimizado;
- preservar player, waveform e paginação dinâmica.

### 11.5 Player

Arquivos prováveis:

```txt
src/app/player/player.component.html
src/app/player/player.component.ts
src/app/player/player.component.scss
src/app/services/music-player.service.ts
```

Prioridades:

- remover metadados hard-coded quando houver dados reais;
- preservar integração com WaveSurfer;
- preservar full track e stems;
- implementar ou ocultar botões sem ação real;
- evitar quebra ao trocar de música.

### 11.6 Efeitos Sonoros

Arquivos prováveis:

```txt
src/app/efeitosSonoros/efeitosSonoros.component.html
src/app/efeitosSonoros/efeitosSonoros.component.ts
src/app/efeitosSonoros/efeitosSonoros.component.scss
src/app/efeitosSonoros/efeitosSonoros.service.ts
```

Prioridades:

- padronizar visual e lógica com Músicas;
- usar paginação padronizada;
- remover dados estáticos quando houver endpoint real;
- aplicar player/waveform quando o fluxo exigir;
- corrigir botões, filtro e responsividade.

### 11.7 Upload do Produtor

Arquivos prováveis:

```txt
src/app/upload-file/produtores/produtores.component.html
src/app/upload-file/produtores/produtores.component.ts
src/app/upload-file/produtores/produtores.component.scss
src/app/upload-file/upload-file.service.ts
```

Prioridades:

- corrigir formulário do produtor;
- Single Track não deve exigir Stems;
- Single Track + Stems deve exibir Stems;
- FX deve mostrar apenas campos de efeitos;
- preservar validação de duração;
- preservar payload esperado pela API;
- não alterar nomes de campos sem verificar backend.

### 11.8 Página do Artista / Área do Produtor

Arquivos prováveis:

```txt
src/app/pages/artist/*
src/app/sub-menu/*
src/app/menu-produtor/*
```

Prioridades:

- corrigir HTML inválido;
- remover dados hard-coded quando houver dados reais;
- separar página pública do artista e área privada do produtor;
- priorizar Dashboard no menu de produtor;
- exibir dashboard apenas para produtor autenticado.

### 11.9 Dashboard do Produtor

Arquivos prováveis na branch `dev`:

```txt
src/app/dashboard-produtor/dashboard-produtor.component.html
src/app/dashboard-produtor/dashboard-produtor.component.ts
src/app/dashboard-produtor/dashboard-produtor.component.scss
src/app/dashboard-produtor/dashboard.service.ts
src/app/dashboard-produtor/dashboard.models.ts
```

Referência visual:

```txt
codex/create-musical-producer-dashboard-design
```

Prioridades:

- manter `DashboardService` existente na `dev`;
- manter `AuthGuard` e `ProdutorGuard`;
- não substituir dados reais por mocks permanentes;
- tratar loading e erro;
- mostrar KPIs, período, origem das vendas e tabela de desempenho;
- deixar exportação como fase futura se não houver backend.

### 11.10 Preços/Licenças

Arquivos prováveis:

```txt
src/app/licenca-valor/licenca-valor.component.html
src/app/licenca-valor/licenca-valor.component.ts
src/app/licenca-valor/licenca-valor.component.scss
```

Prioridades:

- corrigir toggle de 6 meses e 12 meses;
- evitar links vazios ou tab quebrado;
- usar estado Angular;
- aceitar preços fictícios apenas enquanto valores reais não forem definidos;
- validar regras comerciais com humano.

### 11.11 Carrinho/Checkout

Arquivos prováveis:

```txt
src/app/carrinho/*
src/app/finalizar-compra/*
src/app/services/carrinho.service.ts
src/app/cart-modal/*
```

Prioridades:

- escolher tipo de licença antes de adicionar ao carrinho;
- revisar fluxo até finalização;
- preservar nome do projeto, observações, dados de faturamento, pagamento e aceite;
- evitar duplicidade/confusão entre carrinho e finalizar compra.

### 11.12 Footer e FAQ

Arquivos prováveis:

```txt
src/app/footer/*
src/app/faq/*
```

Prioridades:

- corrigir links institucionais;
- substituir “Testemunhos” por “Termos e Condições”;
- adicionar LinkedIn;
- manter FAQ coerente com identidade visual.

---

## 12. Proibições

Não fazer sem autorização explícita:

- migrar Angular;
- trocar Bootstrap/Material por outra biblioteca;
- remover WaveSurfer.js;
- alterar endpoints da API sem verificar backend;
- remover guards de autenticação;
- expor dashboard para usuários não produtores;
- substituir dados reais por mocks permanentes;
- dar merge direto na branch de dashboard;
- reformatar o projeto inteiro;
- alterar `package.json` sem justificar;
- alterar configuração de build/deploy sem necessidade;
- quebrar rotas existentes;
- usar links vazios para ações internas;
- inserir código morto ou botões sem função real;
- alterar secrets ou credenciais;
- executar deploy;
- executar ações destrutivas de Git, arquivos ou banco.

---

## 13. Padrões de UX

A interface do MokBeats deve ser:

- escura;
- moderna;
- musical;
- responsiva;
- objetiva;
- compatível com marketplace de beats;
- clara para comprador e produtor;
- consistente entre páginas.

Prioridades de UX:

1. usuário deve conseguir ouvir músicas facilmente;
2. usuário deve entender tipo de licença antes de comprar;
3. produtor deve entender como enviar faixas, stems, loops e efeitos;
4. produtor deve acessar dashboard com clareza;
5. filtros não devem atrapalhar navegação;
6. player não deve quebrar fluxo de compra.

---

## 14. Padrão de resposta do agente

Ao finalizar qualquer tarefa, o agente deve responder com:

```md
## Relatório final

### Resumo
...

### Arquivos lidos
- ...

### Arquivos alterados
- ...

### O que foi implementado ou revisado
...

### Decisões técnicas
...

### Validação realizada
- [ ] npm run build
- [ ] npm test
- [ ] validação manual

### Resultado das validações
...

### Como testar manualmente
1. ...
2. ...

### Riscos
...

### Pendências
...

### Recomendações
...

### Status final
Aprovado | Aprovado com observações | Requer ajustes | Bloqueado
```

Nunca omitir falhas de validação.
Nunca declarar sucesso sem evidência.

---

## 15. Objetivo final

O objetivo dos agentes neste projeto é transformar o MokBeats em uma plataforma mais estável, profissional e coerente com feedbacks do cliente, sem comprometer a base funcional já existente.

A prioridade é corrigir:

1. navegação e links quebrados;
2. fluxo de músicas/player/licenças;
3. efeitos sonoros;
4. upload do produtor;
5. dashboard do produtor;
6. preços/licenças;
7. carrinho/checkout;
8. footer e páginas institucionais;
9. responsividade geral.

Sempre evoluir com segurança.

---

## 16. Continuidade entre agentes

Quando uma tarefa alternar entre Codex, Claude Code ou outro agente:

- leia `CODEX.md`, se existir;
- verifique relatórios relacionados em `docs/ia-auditorias/`;
- confirme o estado real do Git antes de assumir que uma etapa foi concluída;
- não desfaça alterações de outro agente sem evidência técnica;
- registre decisões, riscos e validações no relatório final.

Quando for necessário salvar relatório em arquivo, use:

```txt
docs/ia-auditorias/TEMPLATE-agent-report.md
```
