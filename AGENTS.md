# AGENTS.md — Instruções para Agentes de IA no Projeto MokBeats

Este arquivo define como agentes de IA devem atuar no repositório **MokBeats**.

Use estas regras para Codex, Claude Code, ChatGPT, extensões de IA no VS Code e qualquer outro agente que leia, edite ou revise o código deste projeto.

---

## 1. Identidade do projeto

**Projeto:** MokBeats  
**Tipo:** Plataforma web musical / marketplace de beats, músicas, efeitos sonoros, licenças e área de produtores  
**Stack principal:** Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API, WaveSurfer.js  
**Branch principal de trabalho:** `dev`  
**Branch de referência visual para dashboard:** `codex/create-musical-producer-dashboard-design`

O projeto possui uma base funcional na branch `dev` e uma branch separada com uma proposta visual de dashboard do produtor. A branch de dashboard **não deve ser mesclada diretamente** na `dev`. Ela deve ser usada apenas como referência visual e conceitual.

---

## 2. Prioridade das instruções

Ao trabalhar neste repositório, siga a seguinte ordem de prioridade:

1. Solicitação explícita do usuário/desenvolvedor.
2. `PROJECT_RULES.md`.
3. Este arquivo `AGENTS.md`.
4. `CLAUDE.md`, quando estiver usando Claude Code.
5. Código existente da branch atual.
6. Boas práticas gerais de Angular, TypeScript, SCSS, Node.js e UX.

Quando houver conflito entre instruções, preserve a estabilidade da branch `dev` e comunique o conflito antes de aplicar alterações grandes.

---

## 3. Regra principal de segurança

Nunca faça refatorações amplas, migrações de framework, alteração de arquitetura global ou troca de bibliotecas sem solicitação explícita.

O MokBeats é um projeto legado/ativo. O objetivo é evoluir com segurança, corrigindo problemas e implementando feedbacks do cliente sem quebrar o fluxo existente.

---

## 4. Branches e estratégia de trabalho

### Branch base

Use sempre a branch `dev` como base de implementação, salvo instrução contrária.

Antes de alterar código, confirme:

```bash
git branch
git status
```

Se for criar uma branch de feature, use nomes claros:

```bash
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

Ela pode conter código útil de UI, layout, cards, gráficos e tabela, mas também pode estar desatualizada em relação à `dev`.

Regras:

- Não fazer merge direto dessa branch na `dev`.
- Não copiar cegamente `app.module.ts`, `app-routing.module.ts`, guards, interceptors ou configurações globais dessa branch.
- Aproveitar apenas ideias visuais, componentes pontuais e padrões de layout.
- Manter a proteção de rota do dashboard existente na `dev`.
- Manter a integração real com `DashboardService` existente na `dev`.
- Se for necessário instalar biblioteca de gráficos, justificar antes e verificar compatibilidade com Angular 14.

---

## 5. Stack e restrições técnicas

### Angular

O projeto usa Angular 14. Portanto:

- Não migrar para Angular 15+ sem autorização.
- Não converter o projeto para arquitetura standalone sem autorização.
- Não substituir a estrutura de módulos existente por arquitetura nova.
- Evitar APIs modernas não suportadas pela versão atual.
- Manter compatibilidade com TypeScript usado pelo projeto.

### Estilização

O projeto utiliza SCSS, Bootstrap e Angular Material.

Regras:

- Preferir alterações localizadas no SCSS do componente.
- Evitar CSS global em `styles.scss`, salvo para tokens, resets ou correções compartilhadas.
- Não quebrar responsividade existente.
- Validar visualmente desktop, tablet e mobile.
- Preservar identidade visual escura/musical do MokBeats.

### JavaScript/TypeScript

- Usar tipagem explícita quando possível.
- Evitar `any`, exceto em integrações legadas onde a tipagem exata não esteja clara.
- Não adicionar lógica complexa diretamente no template.
- Evitar manipulação direta de DOM com `document.querySelector`, `getElementById`, jQuery ou acesso manual ao DOM.
- Quando houver manipulação legada de DOM, reduzir gradualmente e substituir por estado Angular.

### Dependências

Não adicionar dependências sem necessidade real.

Antes de adicionar biblioteca:

1. Verificar se já existe solução no projeto.
2. Verificar compatibilidade com Angular 14.
3. Justificar o motivo.
4. Preferir implementação simples com Angular/SCSS nativo quando possível.

---

## 6. Comandos de validação

Sempre que possível, após alterações relevantes, executar:

```bash
npm install
npm start
npm run build
npm test
```

Quando o projeto tiver problemas prévios que impeçam algum comando, registre claramente:

- comando executado;
- erro encontrado;
- se o erro parece anterior à alteração;
- arquivos alterados relacionados.

Não afirmar que validou build/testes se não executou.

---

## 7. Áreas principais do projeto

### 7.1 Header/Menu

Arquivos prováveis:

```txt
src/app/menu/menu.component.html
src/app/menu/menu.component.ts
src/app/menu/menu.component.scss
```

Objetivos conhecidos:

- Manter logo no topo.
- Corrigir link do MokBeats Hub.
- Evitar links quebrados.
- Preservar menu responsivo.
- Revisar contagem de carrinho sem depender de manipulação direta do DOM.

### 7.2 Home

Arquivos prováveis:

```txt
src/app/home/home.component.html
src/app/home/home.component.ts
src/app/home/home.component.scss
```

Objetivos conhecidos:

- Corrigir botões “Saber mais”.
- Botão da seção de produtores deve direcionar para área de produtores/cadastro/upload conforme fluxo definido.
- Evitar `href="#"` que causa navegação incorreta ou scroll indesejado.
- Manter últimas músicas carregadas dinamicamente.

### 7.3 Login/Cadastro

Arquivos prováveis:

```txt
src/app/login/login.component.html
src/app/login/login.component.ts
src/app/login/login.component.scss
```

Objetivos conhecidos:

- Corrigir bug visual dos “pontinhos”/fonte no campo “Tipo Perfil”.
- Manter opções de perfil:
  - comprador;
  - produtor.
- Preservar integração com `AuthService`.
- Não quebrar armazenamento de token e perfil.

### 7.4 Músicas

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

Objetivos conhecidos:

- Corrigir clique no nome da música que redireciona incorretamente.
- Corrigir ação de licença para abrir modal de licença antes do carrinho.
- Melhorar alinhamento das colunas.
- Corrigir filtro lateral/minimizado.
- Evitar desaparecimento indevido do filtro ao rolar a página.
- Preservar player, waveform e paginação dinâmica.

### 7.5 Player

Arquivos prováveis:

```txt
src/app/player/player.component.html
src/app/player/player.component.ts
src/app/player/player.component.scss
src/app/services/music-player.service.ts
```

Objetivos conhecidos:

- Remover metadados hard-coded.
- Exibir dados reais da música atual.
- Preservar integração com WaveSurfer.
- Preservar modo full track e stems.
- Implementar ou ocultar botões que atualmente não possuem ação real.
- Garantir que o player não quebre ao trocar de música.

### 7.6 Efeitos Sonoros

Arquivos prováveis:

```txt
src/app/efeitosSonoros/efeitosSonoros.component.html
src/app/efeitosSonoros/efeitosSonoros.component.ts
src/app/efeitosSonoros/efeitosSonoros.component.scss
src/app/efeitosSonoros/efeitosSonoros.service.ts
```

Objetivos conhecidos:

- Padronizar visual e lógica com a página de músicas.
- Usar paginação padronizada.
- Remover dados estáticos quando houver endpoint real disponível.
- Aplicar player/waveform se o fluxo de produto exigir.
- Corrigir botões, filtro e responsividade.

### 7.7 Upload do Produtor

Arquivos prováveis:

```txt
src/app/upload-file/produtores/produtores.component.html
src/app/upload-file/produtores/produtores.component.ts
src/app/upload-file/produtores/produtores.component.scss
src/app/upload-file/upload-file.service.ts
```

Objetivos conhecidos:

- Corrigir formulário de envio do produtor.
- Modo “Single Track” não deve exibir Stems como obrigatórios.
- Single Track deve ocupar largura adequada/100% conforme layout solicitado.
- Ordem visual esperada:
  1. Dados da faixa/produtor;
  2. Single Track;
  3. Loops;
  4. Stems, apenas quando aplicável;
  5. Efeitos, apenas no modo FX;
  6. Termos e envio.
- Campos de Stems devem seguir nomes claros:
  - Melodia;
  - Harmonia;
  - Ritmo;
  - Efeitos FX.
- Preservar validação de duração dos áudios.
- Preservar payload esperado pela API.
- Não alterar nomes de campos enviados ao backend sem verificar o backend.

### 7.8 Página do Artista / Área do Produtor

Arquivos prováveis:

```txt
src/app/pages/artist/*
src/app/sub-menu/*
src/app/menu-produtor/*
```

Objetivos conhecidos:

- Corrigir HTML inválido.
- Remover dados hard-coded quando houver dados reais disponíveis.
- Separar corretamente página pública do artista e área privada do produtor.
- Menu lateral do produtor deve priorizar Dashboard.
- Dashboard deve aparecer apenas para produtor autenticado.

### 7.9 Dashboard do Produtor

Arquivos prováveis na branch `dev`:

```txt
src/app/dashboard-produtor/dashboard-produtor.component.html
src/app/dashboard-produtor/dashboard-produtor.component.ts
src/app/dashboard-produtor/dashboard-produtor.component.scss
src/app/dashboard-produtor/dashboard.service.ts
src/app/dashboard-produtor/dashboard.models.ts
```

Branch de referência visual:

```txt
codex/create-musical-producer-dashboard-design
```

Regras:

- Manter `DashboardService` existente na `dev`.
- Manter `AuthGuard` e `ProdutorGuard`.
- Não substituir dados reais por mocks estáticos.
- Se precisar usar mocks temporários, deixar explicitamente isolado e fácil de remover.
- O dashboard mínimo deve mostrar receita, vendas, curtidas, conversão, período, músicas/faixas, origem das vendas e tabela de desempenho.
- Exportação pode ficar como fase futura se não houver backend pronto.

### 7.10 Preços/Licenças

Arquivos prováveis:

```txt
src/app/licenca-valor/licenca-valor.component.html
src/app/licenca-valor/licenca-valor.component.ts
src/app/licenca-valor/licenca-valor.component.scss
```

Objetivos conhecidos:

- Corrigir toggle de 6 meses e 12 meses.
- Evitar dependência de `href=""`/Bootstrap tab quebrado.
- Usar estado Angular para alternar preço e conteúdo.
- Preços fictícios são aceitáveis quando o cliente não definiu valores reais.
- Garantir responsividade cross-browser.

### 7.11 Carrinho/Checkout

Arquivos prováveis:

```txt
src/app/carrinho/*
src/app/finalizar-compra/*
src/app/services/carrinho.service.ts
src/app/cart-modal/*
```

Objetivos conhecidos:

- Licença não deve ir direto para o carrinho sem escolha/validação de licença.
- Revisar fluxo completo:
  1. usuário escolhe faixa;
  2. usuário escolhe tipo de licença;
  3. item vai para carrinho;
  4. usuário preenche dados do projeto/observações;
  5. usuário finaliza.
- Campos relevantes: nome do projeto, observações, dados de faturamento, forma de pagamento e aceite dos termos.
- Evitar duplicidade/confusão entre `CarrinhoComponent` e `FinalizarCompraComponent`.

### 7.12 Footer

Arquivos prováveis:

```txt
src/app/footer/footer.component.html
src/app/footer/footer.component.ts
src/app/footer/footer.component.scss
```

Objetivos conhecidos:

- Substituir “Testemunhos” por “Termos e Condições”.
- Revisar links institucionais.
- Adicionar LinkedIn.
- Remover links genéricos/externos incorretos.
- Garantir que links internos usem Router Angular quando aplicável.

---

## 8. Regras de implementação

### Antes de alterar

1. Ler o componente/serviço relacionado.
2. Identificar se a lógica já existe.
3. Verificar impacto em rotas, guards e serviços.
4. Planejar alteração mínima.
5. Evitar mexer em arquivos não relacionados.

### Durante a alteração

- Preferir mudanças pequenas e rastreáveis.
- Manter nomes de classes e seletores consistentes.
- Não remover código funcional sem entender dependência.
- Evitar regressões em autenticação, player, upload e carrinho.
- Preservar compatibilidade com API atual.

### Depois de alterar

Responder sempre com:

```txt
Arquivos alterados:
- caminho/do/arquivo

O que foi feito:
- item 1
- item 2

Como validar:
- comando 1
- fluxo manual 1

Riscos/observações:
- item relevante, se houver
```

---

## 9. Regras para prompts de implementação

Quando receber uma tarefa grande, divida em etapas:

1. Diagnóstico.
2. Correção isolada.
3. Validação.
4. Ajuste visual.
5. Revisão final.

Não implementar tudo de uma vez se o escopo envolver várias áreas críticas como player, upload, checkout e dashboard.

---

## 10. Proibições

Não fazer sem autorização explícita:

- Migrar Angular.
- Trocar Bootstrap/Material por outra biblioteca.
- Remover WaveSurfer.js.
- Alterar endpoints da API sem verificar backend.
- Remover guards de autenticação.
- Expor dashboard para usuários não produtores.
- Substituir dados reais por mocks permanentes.
- Dar merge direto na branch `codex/create-musical-producer-dashboard-design`.
- Reformatar o projeto inteiro.
- Alterar `package.json` sem justificar.
- Alterar configuração de build/deploy sem necessidade.
- Quebrar rotas existentes.
- Usar `href="#"` ou `href=""` para ações internas.
- Inserir código morto ou botões sem função real.

---

## 11. Padrões de UX

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

1. Usuário deve conseguir ouvir músicas facilmente.
2. Usuário deve entender tipo de licença antes de comprar.
3. Produtor deve entender como enviar faixas, stems, loops e efeitos.
4. Produtor deve acessar dashboard com clareza.
5. Filtros não devem atrapalhar navegação.
6. Player não deve quebrar fluxo de compra.

---

## 12. Padrões de resposta do agente

Ao finalizar qualquer tarefa, o agente deve responder com:

```md
## Resumo

...

## Arquivos alterados

- ...

## Validação realizada

- [x] npm run build
- [ ] npm test — não executado porque ...

## Como testar manualmente

1. ...
2. ...

## Observações

...
```

Nunca omitir falhas de validação.

---

## 13. Objetivo final

O objetivo dos agentes neste projeto é transformar o MokBeats em uma plataforma mais estável, profissional e coerente com o feedback do cliente, sem comprometer a base funcional já existente.

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
