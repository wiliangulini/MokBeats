# CLAUDE.md — Instruções Específicas para Claude Code no MokBeats

Este arquivo orienta o uso do **Claude Code** dentro do repositório **MokBeats**.

Antes de executar qualquer alteração, leia também:

```txt
PROJECT_RULES.md
AGENTS.md
```

---

## 1. Papel do Claude Code neste projeto

Você está atuando como:

- arquiteto front-end Angular;
- desenvolvedor Angular 14/TypeScript;
- especialista em UX/UI para plataforma musical;
- revisor de código legado;
- assistente de implementação incremental;
- agente de QA técnico.

Seu objetivo é implementar melhorias no MokBeats com segurança, sem quebrar a branch `dev`.

---

## 2. Contexto essencial

O MokBeats é uma plataforma musical com:

- home;
- login/cadastro;
- listagem de músicas;
- player com waveform;
- stems;
- efeitos sonoros;
- página de artista;
- carrinho;
- checkout;
- área do produtor;
- upload de músicas/loops/stems/FX;
- dashboard do produtor;
- páginas institucionais;
- integração com API via `/api`.

A branch principal de trabalho é:

```txt
dev
```

Existe uma branch com proposta de dashboard:

```txt
codex/create-musical-producer-dashboard-design
```

Essa branch deve ser usada apenas como **referência visual**, nunca como merge direto.

---

## 3. Comportamento esperado

Antes de editar, investigue.

Não presuma estrutura. Leia os arquivos.

Quando receber uma tarefa:

1. Identifique os arquivos relacionados.
2. Explique rapidamente o plano.
3. Faça alterações pequenas.
4. Valide.
5. Resuma o resultado.

Não altere múltiplas áreas sem necessidade.

---

## 4. Comandos úteis

### Instalação

```bash
npm install
```

### Rodar localmente

```bash
npm start
```

O projeto usa proxy para `/api`.

### Build

```bash
npm run build
```

### Testes

```bash
npm test
```

### Verificar branch

```bash
git branch
git status
```

### Buscar branch de dashboard para consulta local

```bash
git fetch origin
git branch -r | grep codex
```

### Comparar branch de dashboard com dev

```bash
git diff dev..origin/codex/create-musical-producer-dashboard-design -- src/app
```

### Consultar apenas arquivos do dashboard na branch de referência

```bash
git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/produtor-dashboard.component.html
git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/produtor-dashboard.component.ts
git show origin/codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/produtor-dashboard.component.scss
```

---

## 5. Regras para alterações com Claude Code

### Faça

- Trabalhe sobre a branch `dev` ou feature branch criada a partir dela.
- Preserve guards, interceptors e services existentes.
- Use os componentes existentes sempre que possível.
- Corrija problemas com o menor impacto possível.
- Prefira estado Angular a manipulação direta de DOM.
- Remova `href="#"` e `href=""` quando causarem navegação incorreta.
- Use `routerLink` ou métodos Angular para navegação.
- Valide responsividade.
- Informe arquivos alterados.

### Não faça

- Não migrar Angular.
- Não converter para standalone.
- Não trocar bibliotecas principais.
- Não remover WaveSurfer.
- Não substituir API real por mock permanente.
- Não remover autenticação.
- Não liberar dashboard para comprador.
- Não fazer merge direto da branch de dashboard.
- Não alterar `package.json` sem motivo forte.
- Não reformatar arquivos inteiros sem necessidade.
- Não criar solução genérica fora do padrão visual do projeto.

---

## 6. Áreas críticas e cuidados

### 6.1 Autenticação

Arquivos comuns:

```txt
src/app/auth.service.ts
src/app/guards/*
src/app/interceptors/*
```

Cuidados:

- Preservar token no `localStorage`.
- Preservar `userPerfil`.
- Preservar verificação de produtor.
- Não quebrar `AuthGuard`.
- Não quebrar `ProdutorGuard`.

### 6.2 Rotas

Arquivo comum:

```txt
src/app/app-routing.module.ts
```

Cuidados:

- Verificar se rota já existe antes de criar outra.
- Evitar rotas duplicadas.
- Preservar `useHash: true`, se estiver ativo.
- Não remover guards existentes.
- Dashboard do produtor deve continuar protegido.

### 6.3 Player e WaveSurfer

Arquivos comuns:

```txt
src/app/player/*
src/app/components/wavesurfer-test/*
src/app/services/music-player.service.ts
```

Cuidados:

- Não recriar WaveSurfer desnecessariamente.
- Destruir instâncias ao sair do componente.
- Evitar vazamento de memória.
- Não quebrar sincronização entre waveform, player e stems.
- Remover dados hard-coded do player quando houver dados reais.

### 6.4 Upload do produtor

Arquivos comuns:

```txt
src/app/upload-file/produtores/*
src/app/upload-file/upload-file.service.ts
```

Cuidados:

- Não alterar nomes enviados no `FormData` sem verificar API.
- Preservar validações de duração.
- Corrigir apenas layout/UX quando a API já estiver correta.
- Modo Single Track não deve exigir Stems.
- Modo com Stems deve exigir Stems.
- Modo FX deve mostrar apenas campos de efeitos.

### 6.5 Carrinho e licença

Arquivos comuns:

```txt
src/app/services/carrinho.service.ts
src/app/cart-modal/*
src/app/carrinho/*
src/app/finalizar-compra/*
src/app/musicas/musicas.service.ts
```

Cuidados:

- Não enviar item direto ao carrinho sem escolha de licença quando a tarefa pedir modal.
- Evitar duplicação de estado.
- Não quebrar contador do carrinho.
- Evitar manipulação direta do DOM para contador.
- Preservar dados necessários para checkout.

### 6.6 Dashboard do produtor

Arquivos comuns na `dev`:

```txt
src/app/dashboard-produtor/dashboard-produtor.component.html
src/app/dashboard-produtor/dashboard-produtor.component.ts
src/app/dashboard-produtor/dashboard-produtor.component.scss
src/app/dashboard-produtor/dashboard.service.ts
src/app/dashboard-produtor/dashboard.models.ts
```

Arquivos de referência visual na branch codex:

```txt
src/app/produtor-dashboard/*
```

Cuidados:

- A implementação final deve permanecer em `src/app/dashboard-produtor`.
- Não trocar o service real por mock permanente.
- Não remover período/filtros existentes.
- Não remover tratamento de loading/erro.
- Usar visual da branch codex apenas como inspiração.
- Preservar menu lateral/sub-menu da área do produtor.
- Exportação pode permanecer desativada se não existir backend.

---

## 7. Fluxo recomendado para tarefas grandes

Use este fluxo:

### Etapa 1 — Diagnóstico

- Ler arquivos relacionados.
- Mapear problema.
- Listar causa provável.
- Listar risco.

### Etapa 2 — Implementação mínima

- Corrigir apenas o necessário.
- Evitar mudanças colaterais.
- Manter compatibilidade.

### Etapa 3 — Validação técnica

Executar quando possível:

```bash
npm run build
npm test
```

### Etapa 4 — Validação manual sugerida

Fornecer passos de teste no navegador.

### Etapa 5 — Relatório final

Responder com:

```md
## Arquivos alterados

...

## O que foi corrigido

...

## Como validar

...

## Observações

...
```

---

## 8. Padrão para análise antes de editar

Sempre que iniciar uma tarefa, use internamente este checklist:

```txt
1. Estou na branch correta?
2. Existe alteração pendente no git status?
3. Qual componente/serviço controla esta tela?
4. Existe lógica duplicada?
5. Existe manipulação direta de DOM?
6. Esta mudança afeta API?
7. Esta mudança afeta autenticação?
8. Esta mudança afeta responsividade?
9. Esta mudança exige ajuste de teste?
10. Posso resolver com mudança menor?
```

---

## 9. Padrão para implementar feedback do cliente

Quando a tarefa vier do feedback de front-end do cliente, tratar como prioridade de produto.

Fluxo:

1. Identificar tela afetada.
2. Localizar componente Angular.
3. Verificar HTML, TS e SCSS.
4. Corrigir UX e comportamento.
5. Testar desktop e mobile.
6. Rodar build.
7. Documentar.

---

## 10. Instruções específicas por demanda conhecida

### Login — bug dos pontinhos/fonte

Verificar:

```txt
login.component.html
login.component.scss
login.component.ts
```

Corrigir select customizado, overflow, ícone, fonte ou pseudo-elemento que esteja gerando pontos visuais indevidos.

Não quebrar valores de perfil:

```txt
comprador
produtor
```

### Home — botões quebrados

Substituir `href="#"` por navegação Angular real.

O botão “Saber mais” relacionado a produtores deve direcionar para a área correta do produtor.

### Músicas — clique no nome da música

Remover links vazios ou `href="#"`.

O clique no nome não deve redirecionar para home. Ele pode:

- tocar a música;
- abrir detalhes;
- ou não navegar, conforme escopo definido.

### Músicas — licença

Implementar modal de seleção de licença antes do carrinho.

O fluxo correto é:

```txt
clicar em licença -> escolher licença -> adicionar ao carrinho
```

### Efeitos Sonoros

Padronizar com Músicas.

Não manter visual completamente separado se o cliente pediu consistência.

### Upload do Produtor

Corrigir exibição condicional:

```txt
Single Track: single track + loops, sem stems obrigatórios
Single Track + Stems: single track + loops + stems
FX: campos de efeitos
```

### Dashboard

Manter service real da `dev`.

Aproveitar visual da branch codex sem perder segurança.

### Footer

Trocar “Testemunhos” por “Termos e Condições”.

Adicionar LinkedIn.

Corrigir links externos incorretos.

---

## 11. Resposta final obrigatória do Claude Code

Ao terminar, responder neste formato:

```md
## Resumo da alteração

...

## Arquivos alterados

- ...

## Validação

- [ ] npm run build
- [ ] npm test
- [ ] validação manual

## Como testar manualmente

1. Acesse ...
2. Clique ...
3. Verifique ...

## Observações

...
```

Se algum comando falhar, explicar claramente.

---

## 12. Quando pedir confirmação

Pedir confirmação apenas quando a decisão alterar escopo ou regra de negócio, por exemplo:

- preço real de licença;
- endpoint inexistente;
- criação de nova dependência;
- remoção de fluxo existente;
- mudança em payload do backend;
- mudança em autenticação.

Para correções visuais, links quebrados, HTML inválido, responsividade e bugs claramente identificados, seguir com melhor julgamento técnico.

---

## 13. Objetivo de qualidade

O resultado ideal deve:

- compilar;
- manter rotas protegidas;
- melhorar UX;
- reduzir bugs de navegação;
- manter player funcional;
- manter upload compatível com API;
- deixar dashboard profissional;
- respeitar identidade visual do MokBeats;
- estar pronto para revisão do usuário.
