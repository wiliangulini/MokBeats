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

Antes de alterar qualquer coisa:

1. leia este arquivo;
2. leia `AGENTS.md`;
3. leia `CLAUDE.md`, quando estiver usando Claude Code;
4. leia `README.md`, se existir;
5. identifique a branch atual;
6. verifique o estado do Git;
7. identifique a stack real e os scripts disponíveis;
8. leia os arquivos diretamente relacionados ao escopo;
9. entenda o fluxo afetado;
10. planeje a menor alteração suficiente.

Toda tarefa deve respeitar o escopo solicitado.

É proibido:

- alterar arquivos fora do escopo sem necessidade técnica clara;
- misturar feature pequena com refatoração ampla;
- modificar arquitetura global sem justificativa e validação humana;
- instalar dependências sem aprovação;
- remover código sem entender impacto;
- alterar contrato da API sem validar backend;
- alterar autenticação/autorização sem análise específica;
- executar deploy sem autorização explícita;
- declarar sucesso sem evidência de validação.

---

## 3. Stack do projeto

Stack atual conhecida:

```txt
Angular 14
TypeScript
SCSS
Bootstrap
Angular Material
WaveSurfer.js
Node.js/API
Proxy local para /api
```

Restrições:

- Não migrar Angular sem autorização.
- Não converter o projeto para arquitetura standalone sem autorização.
- Não trocar a stack principal sem autorização.
- Não remover WaveSurfer.js.
- Não substituir a estrutura existente por arquitetura nova sem necessidade.
- Não quebrar compatibilidade com a API atual.
- Não inserir regras extensas de React, Next.js, Java, Spring ou SQL como se fossem parte do MokBeats sem evidência no repositório.

---

## 4. Git, branch e segurança operacional

### Branch de implementação

```txt
dev
```

A branch `dev` é a base principal para implementação.

### Branch de referência visual do dashboard

```txt
codex/create-musical-producer-dashboard-design
```

Esta branch serve apenas como referência visual e conceitual para o dashboard do produtor.

Regras:

- Não fazer merge direto na `dev`.
- Não substituir a estrutura da `dev` pela estrutura dessa branch.
- Não copiar cegamente módulos globais, routing, guards, interceptors ou services dessa branch.
- Não remover guards, interceptors ou services da `dev`.
- Aproveitar apenas elementos visuais, ideias de layout e componentes pontuais compatíveis.
- Manter a implementação final do dashboard alinhada à estrutura real da `dev`.

Antes de iniciar uma tarefa:

- verificar branch atual;
- verificar alterações pendentes;
- evitar sobrescrever trabalho existente;
- não criar commits sem pedido explícito;
- não executar push sem autorização explícita;
- não fazer merge sem autorização explícita;
- não executar ações destrutivas de Git, arquivos, banco ou deploy.

Commits devem ser pequenos, objetivos e criados apenas quando solicitados.

---

## 5. Padrão de implementação incremental

Toda implementação deve ser:

- incremental;
- localizada;
- simples;
- testável;
- reversível;
- compatível com a arquitetura atual;
- coerente com padrões já existentes;
- pequena o suficiente para revisão humana.

Prefira:

- menor mudança suficiente;
- nomes explícitos;
- tipagem clara;
- validação de entrada;
- tratamento de erro consistente;
- reaproveitamento de componentes/services existentes;
- estado Angular/RxJS em vez de manipulação direta do DOM;
- correções localizadas antes de refatorações amplas.

Evite:

- overengineering;
- abstrações prematuras;
- duplicação desnecessária;
- lógica de negócio complexa em componentes visuais;
- código morto;
- mocks permanentes substituindo dados reais;
- dependências novas sem necessidade comprovada;
- reformatação de arquivos inteiros sem relação com a tarefa.

---

## 6. Regras gerais de arquitetura

### Angular

- Respeitar Angular 14.
- Manter estrutura baseada em módulos.
- Preservar `modules`, `components`, `services`, `guards`, `interceptors` e `routing`.
- Componentes devem conter lógica de tela, não regra de negócio extensa.
- Services devem concentrar comunicação com API e lógica reutilizável.
- Guards devem proteger rotas privadas.
- Interceptors devem preservar autenticação e comportamento HTTP existente.
- Templates devem ser simples, declarativos e com HTML válido.
- Evitar subscriptions sem cleanup em fluxos longos.
- Evitar mexer em arquivos globais sem necessidade clara.

### Estado e DOM

- Preferir estado Angular/RxJS em vez de manipulação direta do DOM.
- Evitar `document.querySelector`, `getElementById`, jQuery e manipulação manual em novas implementações.
- Quando houver legado com manipulação direta do DOM, corrigir gradualmente e com cautela.

### Rotas e navegação

- Usar `routerLink` para navegação interna.
- Usar `button` para ações que não são navegação.
- Evitar links vazios ou âncoras falsas.
- Links externos devem usar URL real e proteção adequada para nova aba quando aplicável.
- Não duplicar rotas existentes.
- Rotas privadas devem continuar protegidas.
- Verificar `app-routing.module.ts` antes de alterar navegação.

### API Node.js

- Usar `/api` como base quando o projeto estiver configurado assim.
- Não alterar endpoints sem validar backend.
- Não alterar payloads sem validar API.
- Preservar contrato atual sempre que possível.
- Validar entradas e tratar erros.
- Não logar tokens, senhas ou dados sensíveis.
- Quando endpoint não existir, registrar pendência ou criar camada temporária claramente isolada, nunca mock permanente disfarçado de integração real.

---

## 7. Autenticação e perfis

Perfis principais:

```txt
comprador
produtor
```

Regras:

- Usuário não autenticado não deve acessar áreas privadas.
- Comprador não deve acessar dashboard do produtor.
- Produtor deve acessar upload, dashboard e área do produtor.
- `AuthGuard` deve proteger rotas autenticadas.
- `ProdutorGuard` deve proteger rotas exclusivas de produtor.
- Não remover validações de perfil.
- Não quebrar login, cadastro, armazenamento de token ou leitura de perfil.
- Qualquer alteração em autenticação, autorização, guards, interceptors, token, sessão ou perfil é área sensível e exige validação específica.

---

## 8. Identidade visual e UX

O MokBeats deve ter uma interface:

- escura;
- moderna;
- musical;
- premium;
- responsiva;
- objetiva;
- coerente entre telas;
- focada em áudio, waveform e ação de compra.

Diretrizes:

- Priorizar clareza sobre excesso de efeitos.
- Evitar poluição visual.
- Destacar player, música, waveform, licença e carrinho.
- Manter consistência entre Músicas e Efeitos Sonoros.
- Dashboard deve parecer profissional e analítico.
- Área do produtor deve ser objetiva.
- Menus devem funcionar em desktop e mobile.
- Botões sem função devem ser implementados, corrigidos ou ocultados.
- Header não pode sobrepor conteúdo.
- Filtros não podem desaparecer indevidamente.
- Cards, tabelas e player devem ter tratamento responsivo.
- Evitar soluções frágeis dependentes de apenas um navegador.
- Priorizar compatibilidade com Chrome, Firefox, Edge e Safari quando possível.

---

## 9. Regras por módulo

### 9.1 Header/Menu

O header deve:

- exibir logo corretamente;
- manter navegação principal;
- conter link correto para MokBeats Hub;
- exibir carrinho quando aplicável;
- funcionar em mobile.

Regras:

- Link do MokBeats Hub deve ser tratado como link externo.
- Links internos devem usar navegação Angular.
- Contador do carrinho não deve depender de manipulação frágil do DOM.

---

### 9.2 Home

A home deve:

- apresentar proposta da plataforma;
- direcionar para músicas;
- direcionar para produtores;
- exibir músicas recentes quando disponível;
- ter botões funcionais;
- não conter links vazios.

Demandas conhecidas:

- corrigir botões “Saber mais”;
- seção de produtores deve levar para fluxo de produtor;
- preservar botão de download se estiver funcional.

---

### 9.3 Login e Cadastro

Regras:

- Manter seleção de tipo de pessoa/perfil.
- Manter valores compatíveis com backend:
  - `comprador`;
  - `produtor`.
- Corrigir bug visual dos pontinhos/fonte no tipo de perfil.
- Não quebrar login.
- Não quebrar cadastro.
- Não quebrar armazenamento de token.
- Não alterar payload de autenticação sem validar backend.

---

### 9.4 Página de Músicas

A página de músicas deve permitir:

- listar músicas paginadas;
- filtrar músicas;
- ouvir preview;
- visualizar waveform;
- curtir;
- acessar produtor/artista;
- escolher licença;
- adicionar ao carrinho;
- navegar sem bugs.

Regras:

- Waveform deve permanecer funcional.
- Player deve receber música correta.
- Não usar índice baseado em `id - 1` quando isso puder quebrar paginação.
- Nome da música não deve ser link quebrado.
- Ação de licença deve abrir seleção de licença antes do carrinho.
- Filtros devem ser acessíveis e responsivos.
- Colunas devem permanecer alinhadas.
- Não quebrar paginação dinâmica.

---

### 9.5 Player

O player deve:

- tocar música selecionada;
- exibir waveform;
- exibir dados reais da música quando disponíveis;
- suportar stems quando disponíveis;
- preservar sincronização;
- não manter metadados hard-coded;
- não ter botões falsos ou sem ação visível.

Regras:

- Destruir instâncias do WaveSurfer quando necessário.
- Evitar vazamento de memória.
- Evitar múltiplas instâncias tocando simultaneamente.
- Manter comportamento previsível ao trocar de faixa.
- Preservar integração com `music-player.service` ou service equivalente existente.

---

### 9.6 Efeitos Sonoros

A página de efeitos sonoros deve seguir o mesmo padrão de qualidade da página de músicas.

Regras:

- Visual deve ser padronizado.
- Paginação deve ser padronizada.
- Filtros devem ser claros.
- Player/waveform devem ser usados se houver áudio.
- Não deixar dados estáticos definitivos se houver API.
- Botões de licença/carrinho devem seguir fluxo de compra.
- Responsividade deve ser equivalente à página de músicas.

---

### 9.7 Licenças e Preços

A área de licenças deve:

- explicar planos com clareza;
- alternar entre 6 meses e 12 meses;
- exibir valores corretamente;
- ser responsiva;
- funcionar sem depender de links vazios.

Regras:

- Usar estado Angular para alternância.
- Preços fictícios podem ser usados enquanto valores reais não forem definidos.
- Não esconder informação importante de licença.
- Modal de licença deve informar claramente o que está sendo comprado.
- Regras comerciais reais exigem validação humana.

---

### 9.8 Carrinho e Checkout

Fluxo correto:

```txt
Usuário escolhe música/efeito
Usuário escolhe licença
Item vai ao carrinho
Usuário revisa carrinho
Usuário preenche dados do projeto/observações
Usuário aceita termos
Usuário finaliza pedido
```

Campos importantes:

- nome do projeto;
- observações/comentários;
- dados pessoais/faturamento;
- forma de pagamento;
- aceite dos termos.

Regras:

- Não adicionar licença diretamente ao carrinho sem escolha quando houver modal.
- Evitar duplicidade entre carrinho e finalizar compra.
- Carrinho deve atualizar contador de forma confiável.
- Não depender de manipulação direta do DOM para estado do carrinho.
- Preservar dados necessários para checkout.
- Gateway de pagamento e endpoint final de checkout exigem validação humana.

---

### 9.9 Upload do Produtor

O upload do produtor é área crítica.

Modos conhecidos:

```txt
Single Track
Single Track + Stems
Efeitos FX
```

#### Single Track

Deve exibir:

- arquivo principal da música;
- loops, se aplicável;
- metadados da faixa;
- termos.

Não deve exigir Stems.

#### Single Track + Stems

Deve exibir:

- arquivo principal da música;
- loops;
- stems:
  - Melodia;
  - Harmonia;
  - Ritmo;
  - Efeitos FX;
- metadados;
- termos.

#### Efeitos FX

Deve exibir:

- campos de efeitos;
- metadados necessários;
- termos.

Não deve exibir Stems de música como obrigatórios.

#### Regras técnicas

- Preservar validações de duração.
- Preservar `FormData`.
- Não alterar nomes enviados ao backend sem validação.
- Mostrar mensagens claras de erro.
- Layout deve ser organizado e responsivo.
- Single Track deve ter destaque e largura adequada.
- Não alterar payload real sem verificar backend.

---

### 9.10 Página do Artista

A página do artista deve:

- exibir dados reais quando disponíveis;
- não depender de nome hard-coded;
- listar músicas do artista correto;
- ter HTML válido;
- funcionar como página pública.

Regras:

- Corrigir tags inválidas.
- Separar página pública da área privada do produtor.
- Não misturar edição de perfil com visualização pública sem clareza.

---

### 9.11 Área do Produtor

A área do produtor deve conter navegação clara para:

1. Dashboard;
2. Assinatura;
3. Pedidos;
4. Dados Pessoais;
5. Formas de Pagamento;
6. Artista, quando aplicável.

Regras:

- Dashboard deve ser primeiro item quando o usuário for produtor.
- Menu deve respeitar autenticação.
- Não exibir opções privadas para usuários sem permissão.
- Área pública do artista e área privada do produtor devem permanecer conceitualmente separadas.

---

### 9.12 Dashboard do Produtor

O dashboard deve consolidar informações de desempenho.

Dados esperados:

- receita;
- vendas;
- curtidas;
- taxa de conversão;
- vendas por faixa;
- vendas por origem;
- receita por faixa;
- likes vs vendas;
- filtros por período;
- tabela de músicas/faixas.

Regras:

- Usar `DashboardService` existente quando disponível.
- Não deixar mocks permanentes.
- Tratar loading.
- Tratar erro.
- Manter responsividade.
- Manter rota protegida por produtor.
- Branch de design pode orientar visual, não a arquitetura.
- Exportação pode permanecer desativada se não existir backend.
- Se for necessário instalar biblioteca de gráficos, justificar antes e validar compatibilidade com Angular 14.

MVP aceitável:

- cards de KPIs;
- filtros de período;
- tabela de desempenho;
- origem das vendas;
- placeholders claros para gráficos se API ainda não estiver pronta.

---

### 9.13 Footer

O footer deve:

- exibir links institucionais corretos;
- substituir “Testemunhos” por “Termos e Condições”;
- incluir LinkedIn;
- não conter links genéricos incorretos;
- abrir links externos corretamente.

Links internos devem usar navegação Angular.

---

### 9.14 FAQ

FAQ deve:

- manter visual coerente com o site;
- responder dúvidas reais de comprador/produtor;
- ser responsiva;
- não parecer página isolada fora da identidade visual.

---

## 10. Qualidade de código

### TypeScript

- Preferir interfaces e tipos claros.
- Evitar `any` sem justificativa.
- Evitar silenciar erros sem explicação.
- Evitar `catch` vazio.
- Tratar `null` e `undefined`.
- Não acessar propriedades sem verificar existência quando dados vêm da API.
- Respeitar ESLint/Prettier quando existirem.
- Não quebrar compatibilidade com a versão configurada do projeto.

### HTML Angular

- Evitar templates muito complexos.
- Evitar links vazios.
- Usar `button` para ações.
- Usar `a` apenas para navegação real.
- Garantir tags válidas.
- Usar `aria-label` quando necessário.
- Preservar labels, estados de erro e feedbacks.

### SCSS

- Preferir estilos localizados no componente.
- Evitar estilos globais desnecessários.
- Manter responsividade.
- Evitar `!important`, exceto em correções pontuais inevitáveis.
- Não quebrar Bootstrap/Material sem necessidade.

### Services

- Services devem isolar comunicação HTTP.
- Não colocar lógica de UI dentro de service, salvo estado compartilhado simples.
- Não manipular DOM dentro de service.
- Retornar `Observable` quando usar HttpClient.
- Preservar contratos já consumidos por componentes.

---

## 11. Secrets, variáveis e deploy

### Secrets e variáveis

É proibido:

- versionar arquivos locais de ambiente;
- exibir secrets em logs;
- inventar valor de secret;
- alterar secret real sem autorização;
- usar credencial de produção em teste;
- mover secret para código fonte;
- expor token, senha ou dado sensível no client.

Quando uma variável for necessária, documentar apenas nome e finalidade.

### Deploy/VPS/Linux

Deploy só pode ser executado quando explicitamente solicitado.

Antes de qualquer deploy:

- validar build;
- verificar variáveis necessárias;
- verificar processo de rollback;
- verificar processo de execução do front/API;
- verificar proxy e SSL quando aplicável;
- não reiniciar serviços críticos sem autorização.

Configurações de VPS/Linux devem ser documentadas apenas quando forem parte do escopo.

---

## 12. Validação obrigatória e QA

Antes de concluir, executar comandos disponíveis e relevantes, verificando primeiro os scripts reais em `package.json`.

Exemplos possíveis, somente se existirem no projeto:

```bash
npm run build
npm test
npm run lint
npm run typecheck
```

Nunca inventar comando.

Se não houver script disponível, documentar:

```txt
Não há script X configurado no projeto.
```

Se um comando falhar, documentar:

- comando;
- erro;
- provável causa;
- se o erro foi introduzido pela alteração ou já existia.

### Fluxos públicos a validar quando afetados

- Home.
- Header/menu.
- Login/cadastro.
- Listagem de músicas.
- Player.
- Filtros.
- Efeitos sonoros.
- Preços/licenças.
- Carrinho.
- Footer.

### Fluxos de produtor a validar quando afetados

- Login como produtor.
- Menu de produtor.
- Upload.
- Dashboard.
- Pedidos.
- Dados pessoais.
- Formas de pagamento.
- Página do artista.

### Fluxos de comprador a validar quando afetados

- Login como comprador.
- Listar músicas.
- Filtrar.
- Tocar preview.
- Escolher licença.
- Adicionar ao carrinho.
- Finalizar pedido.

### Checklist manual mínimo

```txt
[ ] npm run build executado ou erro documentado
[ ] Tela alterada abre sem erro
[ ] Console do navegador sem erro crítico novo
[ ] Desktop validado
[ ] Mobile validado
[ ] Rotas protegidas preservadas
[ ] Links quebrados removidos
[ ] Player ainda funciona
[ ] Carrinho ainda funciona
[ ] Upload ainda envia FormData esperado
[ ] Dashboard não aparece para comprador
[ ] Código alterado é localizado
```

---

## 13. Critérios de aceite por tipo de tarefa

### Correção visual

Aceita quando:

- bug visual desaparece;
- não quebra responsividade;
- não afeta lógica sem necessidade.

### Correção de navegação

Aceita quando:

- link/botão leva ao destino correto;
- não há reload indevido;
- não há link vazio residual no fluxo corrigido.

### Correção de player

Aceita quando:

- música toca;
- waveform aparece;
- troca de faixa funciona;
- dados exibidos são coerentes;
- não há múltiplos áudios conflitantes.

### Correção de upload

Aceita quando:

- campos aparecem conforme modo;
- validações funcionam;
- FormData permanece compatível;
- erros são exibidos com clareza.

### Dashboard

Aceito quando:

- rota protegida funciona;
- KPIs aparecem;
- filtros funcionam;
- tabela aparece;
- loading/erro tratados;
- visual profissional e responsivo.

### Refatoração

Aceita quando:

- estava no escopo ou era necessária para reduzir risco;
- preservou comportamento existente;
- foi localizada;
- melhorou clareza, duplicação ou segurança;
- foi validada.

---

## 14. Decisões pendentes que exigem validação humana

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

## 15. Convenção de commits recomendada

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

## 16. Relatório obrigatório

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

---

## 17. Objetivo final do projeto

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
