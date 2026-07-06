# AGENTS.md — Instruções para Agentes de IA no Projeto MokBeats

Use este arquivo para Codex, Claude Code e qualquer outro agente que atue neste repositório.

---

## 1. Identidade do projeto

**Projeto:** MokBeats — marketplace de beats, músicas, efeitos sonoros, licenças e área de produtores
**Stack:** Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API, WaveSurfer.js
**Branch de implementação:** `dev`
**Branch de referência visual (dashboard):** `codex/create-musical-producer-dashboard-design` — somente referência visual, nunca merge direto.

---

## 2. Prioridade das instruções

1. Solicitação explícita do usuário/desenvolvedor.
2. `PROJECT_RULES.md` — fonte de verdade.
3. Este arquivo `AGENTS.md`.
4. `CLAUDE.md` + `.claude/commands/` + `.claude/skills/` — quando estiver usando Claude Code.
5. `CODEX.md` + `.codex/instructions.md` — quando estiver usando Codex ou houver continuidade.
6. Código existente da branch atual.
7. Boas práticas de Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, WaveSurfer.js e UX.

Conflito entre instruções: preserve a estabilidade da `dev` e comunique antes de aplicar alterações grandes.

### 2.1 Mapa de responsabilidades (quem responde pelo quê)

Cada assunto tem um dono. Não duplique conteúdo entre arquivos; referencie o dono.

| Arquivo | Responsabilidade | Não deve |
| --- | --- | --- |
| `PROJECT_RULES.md` | Fonte de verdade única: escopo, stack, domínio, segurança, **bloco de validação (§12)** e **formato de relatório (§15)** canônicos. | — |
| `AGENTS.md` | Roteador operacional comum: prioridade, modos, segurança, evidência, git, continuidade e roteamento por domínio. | Recopiar seções inteiras de `PROJECT_RULES.md`. |
| `CLAUDE.md` | Comportamento do Claude Code (carrega `@PROJECT_RULES.md`). | Duplicar regras de domínio. |
| `CODEX.md` + `.codex/instructions.md` | Comportamento e matriz de impacto do Codex. | Criar formato de relatório concorrente. |
| `.claude/commands/*` | Entrypoints de tarefa (`/nome` + `$ARGUMENTS`): papel + regra principal + checklist + saída + contrato de escrita. | Recopiar o protocolo comum. |
| `.claude/skills/**` | Metodologias reutilizáveis. Não concedem autorização de escrita. | Virar workflow duplicado de um command. |
| `.claude/rules/*` | Invariantes de domínio, acionados por `paths`. | Repetir procedimento/validação/bloqueio genéricos. |
| `docs/areas/**`, `docs/ia-*/**` | Documentação de domínio e relatórios. | Ser fonte de regra concorrente. |

O protocolo comum (validação, formato de relatório, proibições) vive em `PROJECT_RULES.md` e neste
`AGENTS.md`; commands e rules **referenciam**, não recopiam.

---

## 3. Modos de atuação

**Implementação:** pode editar arquivos. Confirme branch, proponha plano, implemente incrementalmente, valide, gere relatório.

**Revisão/auditoria:** não edite arquivos salvo pedido explícito. Leia diff, compare com escopo, classifique achados por severidade, recomende status final.

**Planejamento:** não edite, crie, mova ou exclua arquivos. Analise, mapeie riscos e entregue plano como resposta no chat. Exceção: arquivo de plano pedido explicitamente pelo usuário.

**Documentação:** pode criar/atualizar documentação. Não invente estrutura nem documente recurso inexistente como implementado.

---

## 4. Segurança

Pare e peça autorização quando a tarefa envolver: dados de produção, deploy, credenciais, alteração destrutiva, mudança ampla de arquitetura, autenticação/autorização, banco irreversível, escopo ambíguo com alto risco, dependência nova, mudança de contrato com backend.

Se precisar ampliar o escopo: informe arquivo adicional, justificativa técnica, risco e alternativa de menor impacto antes de editar.

Ver `PROJECT_RULES.md §8` para lista completa de operações proibidas.

---

## 5. Evidência obrigatória

Toda conclusão técnica deve se apoiar em: arquivo lido, trecho de código, erro reproduzido, build executado ou padrão existente no projeto.

Quando não houver evidência suficiente, declare incerteza.

É proibido inventar: estrutura de projeto, APIs, rotas, scripts, dependências, services, componentes, payloads ou variáveis de ambiente.

---

## 6. Branch e Git

Use `dev` como base. Confirme branch e estado do Git antes de editar.

Para feature branches, use nomes claros: `feature/nome-descritivo`, `fix/nome-do-bug`.

Branch `codex/create-musical-producer-dashboard-design`: não fazer merge direto. Não copiar `app.module.ts`, routing global, guards ou interceptors dessa branch. Aproveitar apenas ideias visuais e componentes pontuais.

Não executar `git add`, commit, push, merge ou ações destrutivas sem pedido explícito.

---

## 7. Validação

Procure scripts reais no `package.json` antes de executar. Comandos possíveis se existirem:

```bash
npm run build
npm test
npm run lint
npm run typecheck
```

Se um comando falhar: registre o comando, o erro e se parece anterior à alteração. Não afirme que validou se não executou.

Ver `PROJECT_RULES.md §12` para checklist manual completo.

---

## 8. Áreas principais do projeto — arquivos prováveis

As regras comportamentais por módulo estão em `PROJECT_RULES.md §9`. Esta seção fornece os caminhos de arquivo para localização rápida.

### 8.0 Roteamento por domínio (área → rule → seção-fonte)

Antes de editar um arquivo, leia a rule de `.claude/rules/` cujo frontmatter `paths` casa com o
caminho. Ela referencia a nota completa em `docs/areas/` e a seção-fonte em `PROJECT_RULES.md`.

| Área/caminho | Rule acionável | Seção-fonte |
| --- | --- | --- |
| Login, guards, interceptors, token/perfil | `.claude/rules/auth-and-guards.md` | §7 |
| Estrutura Angular 14, módulos, rotas globais, DI | `.claude/rules/angular-14.md` | §6 |
| Services HTTP, payloads, endpoints, environments | `.claude/rules/api-contracts.md` | §13 |
| Home, menu, filtros, paginação, FAQ, footer (descoberta) | `.claude/rules/buyer-flow.md` | §9.1, §9.2, §9.13, §9.14 |
| Músicas, efeitos, licença, carrinho, checkout | `.claude/rules/license-cart-checkout.md` | §9.4, §9.7, §9.8 |
| Player, WaveSurfer, stems | `.claude/rules/player-and-waveform.md` | §9.5 |
| Upload do produtor, `FormData` | `.claude/rules/producer-upload.md` | §9.9 |
| Página do artista, área e dashboard do produtor | `.claude/rules/producer-dashboard.md` | §9.11, §9.12 |

### 8.1 Header/Menu

```txt
src/app/menu/menu.component.html
src/app/menu/menu.component.ts
src/app/menu/menu.component.scss
```

Atenção: logo, link do MokBeats Hub, menu responsivo, contador do carrinho.

### 8.2 Home

```txt
src/app/home/home.component.html
src/app/home/home.component.ts
src/app/home/home.component.scss
```

Atenção: botões "Saber mais", links internos com `routerLink`, músicas carregadas dinamicamente.

### 8.3 Login/Cadastro

```txt
src/app/login/login.component.html
src/app/login/login.component.ts
src/app/login/login.component.scss
```

Atenção: perfis `comprador` e `produtor`, integração com `AuthService`, token e perfil.

### 8.4 Músicas

```txt
src/app/musicas/musicas.component.html
src/app/musicas/musicas.component.ts
src/app/musicas/musicas.component.scss
src/app/musicas/musicas.service.ts
src/app/components/filter/*
src/app/components/pagination/*
src/app/wave-surfer-test/*
```

Atenção: modal de licença antes do carrinho, player, waveform, paginação dinâmica.

### 8.5 Player

```txt
src/app/player/player.component.html
src/app/player/player.component.ts
src/app/player/player.component.scss
src/app/services/music-player.service.ts
```

Atenção: destruir instâncias WaveSurfer, evitar múltiplos áudios, metadados reais, troca de faixa.

### 8.6 Efeitos Sonoros

```txt
src/app/efeitosSonoros/efeitosSonoros.component.html
src/app/efeitosSonoros/efeitosSonoros.component.ts
src/app/efeitosSonoros/efeitosSonoros.component.scss
src/app/efeitosSonoros/efeitosSonoros.service.ts
```

Atenção: padronizar com Músicas, remover dados estáticos quando houver endpoint real.

### 8.7 Upload do Produtor

```txt
src/app/upload-file/produtores/produtores.component.html
src/app/upload-file/produtores/produtores.component.ts
src/app/upload-file/produtores/produtores.component.scss
src/app/upload-file/upload-file.service.ts
```

Atenção: Single Track (sem Stems obrigatórios), Single Track + Stems, FX. Preservar FormData e nomes de campos.

### 8.8 Página do Artista / Área do Produtor

```txt
src/app/pages/artist/*
src/app/sub-menu/*
src/app/menu-produtor/*
```

Atenção: separar página pública do artista e área privada do produtor. Dashboard só para produtor autenticado.

### 8.9 Dashboard do Produtor

```txt
src/app/dashboard-produtor/dashboard-produtor.component.html
src/app/dashboard-produtor/dashboard-produtor.component.ts
src/app/dashboard-produtor/dashboard-produtor.component.scss
src/app/dashboard-produtor/dashboard.service.ts
src/app/dashboard-produtor/dashboard.models.ts
```

Referência visual: `codex/create-musical-producer-dashboard-design` (não fazer merge).
Atenção: manter `DashboardService` real, `AuthGuard` e `ProdutorGuard`.

### 8.10 Preços/Licenças

```txt
src/app/licenca-valor/licenca-valor.component.html
src/app/licenca-valor/licenca-valor.component.ts
src/app/licenca-valor/licenca-valor.component.scss
```

Atenção: toggle 6/12 meses via estado Angular, sem links vazios.

### 8.11 Carrinho/Checkout

```txt
src/app/carrinho/*
src/app/finalizar-compra/*
src/app/services/carrinho.service.ts
src/app/cart-modal/*
```

Atenção: escolha de licença antes de adicionar ao carrinho, fluxo até finalização.

### 8.12 Footer e FAQ

```txt
src/app/footer/*
src/app/faq/*
```

Atenção: links institucionais corretos, "Termos e Condições" no lugar de "Testemunhos", LinkedIn.

---

## 9. Proibições

Não fazer sem autorização explícita: migrar Angular, trocar Bootstrap/Material, remover WaveSurfer.js, alterar endpoints sem verificar backend, remover guards de autenticação, expor dashboard para não produtores, substituir dados reais por mocks permanentes, merge direto na branch de dashboard, alterar `package.json` sem justificar, quebrar rotas existentes, usar links vazios, inserir código morto, alterar secrets, executar deploy, executar ações destrutivas de Git ou banco.

---

## 10. Relatório final

Use o formato definido em `PROJECT_RULES.md §15`.
Para relatórios de continuidade entre agentes, use `docs/ia-auditorias/TEMPLATE-agent-report.md`.

---

## 11. Continuidade entre agentes

Quando uma tarefa alternar entre Codex, Claude Code ou outro agente:

- leia `CODEX.md` e verifique relatórios relacionados em `docs/ia-auditorias/`;
- confirme o estado real do Git antes de assumir que uma etapa foi concluída;
- não desfaça alterações de outro agente sem evidência técnica;
- registre decisões, riscos e validações no relatório final.
