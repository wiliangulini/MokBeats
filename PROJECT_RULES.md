# PROJECT_RULES.md — Regras do Projeto MokBeats

Este documento concentra as regras técnicas, funcionais e de produto do projeto **MokBeats**.

Ele deve ser lido antes de qualquer implementação, revisão ou refatoração.

---

## 1. Visão geral

O **MokBeats** é uma plataforma web para venda, licenciamento, descoberta e gerenciamento de músicas, beats, loops, stems e efeitos sonoros.

O sistema possui dois públicos principais:

1. **Compradores**
   - exploram músicas e efeitos;
   - usam filtros;
   - ouvem previews;
   - escolhem licenças;
   - adicionam itens ao carrinho;
   - finalizam pedido/compra.

2. **Produtores**
   - cadastram perfil;
   - enviam músicas;
   - enviam loops;
   - enviam stems;
   - enviam efeitos FX;
   - acompanham vendas;
   - acompanham receita;
   - acompanham curtidas/desempenho;
   - acessam dashboard.

---

## 2. Stack do projeto

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
- Não trocar a stack principal sem autorização.
- Não remover WaveSurfer.js.
- Não substituir a estrutura existente por arquitetura nova sem necessidade.
- Não quebrar compatibilidade com a API atual.

---

## 3. Branches oficiais

### Branch de implementação

```txt
dev
```

A branch `dev` é a base principal para implementação.

### Branch de referência de dashboard

```txt
codex/create-musical-producer-dashboard-design
```

Esta branch serve como referência visual para o dashboard do produtor.

Regras:

- Não fazer merge direto na `dev`.
- Não substituir a estrutura da `dev` pela estrutura dessa branch.
- Não remover guards, interceptors ou services da `dev`.
- Aproveitar apenas elementos visuais e ideias compatíveis.

---

## 4. Regras gerais de arquitetura

### Angular

- Manter estrutura baseada em módulos.
- Componentes devem conter lógica de tela.
- Services devem conter comunicação com API e regras compartilhadas.
- Guards devem proteger rotas privadas.
- Interceptors devem preservar autenticação.
- Templates devem ser simples e declarativos.

### Estado

- Preferir estado Angular/RxJS em vez de manipulação direta do DOM.
- Evitar `document.querySelector`, `getElementById` e jQuery em novas implementações.
- Quando houver legado com manipulação direta do DOM, corrigir com cautela.

### Rotas

- Usar `routerLink` para navegação interna.
- Evitar `href="#"` e `href=""`.
- Links externos devem usar `href` real, `target="_blank"` e `rel="noopener noreferrer"` quando aplicável.
- Não duplicar rotas existentes.
- Rotas privadas devem continuar protegidas.

### API

- Usar `/api` como base quando o projeto estiver configurado assim.
- Não alterar endpoints sem validar backend.
- Não alterar payloads sem validar API.
- Quando endpoint não existir, criar camada temporária clara ou registrar pendência.

---

## 5. Regras de autenticação e perfis

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

---

## 6. Identidade visual

O MokBeats deve ter uma interface:

- escura;
- moderna;
- musical;
- premium;
- responsiva;
- com foco em áudio;
- coerente entre todas as telas.

Diretrizes:

- Priorizar clareza sobre excesso de efeitos.
- Evitar poluição visual.
- Destacar player, música, waveform e ações de compra.
- Manter consistência entre Músicas e Efeitos Sonoros.
- Dashboard deve parecer profissional e analítico.
- Área de produtor deve ser objetiva.

---

## 7. Regras de UX

### Navegação

- Nenhum botão principal deve estar quebrado.
- Nenhum link interno deve usar `href="#"`.
- Nenhum clique em nome de música deve redirecionar indevidamente para home.
- Botões sem função devem ser implementados ou escondidos.
- Menus devem funcionar em desktop e mobile.

### Responsividade

Validar minimamente:

```txt
Desktop grande
Notebook
Tablet
Celular
```

Cuidados:

- Header não pode sobrepor conteúdo.
- Filtros não podem desaparecer indevidamente.
- Cards não podem quebrar largura.
- Tabelas devem ter tratamento responsivo.
- Player deve continuar acessível.

### Cross-browser

Ao implementar CSS/JS, evitar soluções frágeis dependentes de apenas um navegador.

Priorizar compatibilidade com:

```txt
Chrome
Firefox
Edge
Safari, quando possível
```

---

## 8. Regras por módulo

## 8.1 Header/Menu

O header deve:

- exibir logo corretamente;
- manter navegação principal;
- conter link correto para MokBeats Hub;
- exibir carrinho quando aplicável;
- funcionar em mobile.

O link do MokBeats Hub deve ser tratado como link externo.

---

## 8.2 Home

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

## 8.3 Login e Cadastro

Regras:

- Manter seleção de tipo de pessoa/perfil.
- Manter valores compatíveis com backend:
  - `comprador`;
  - `produtor`.
- Corrigir bug visual dos pontinhos/fonte no tipo de perfil.
- Não quebrar login.
- Não quebrar cadastro.
- Não quebrar armazenamento de token.

---

## 8.4 Página de Músicas

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

---

## 8.5 Player

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

---

## 8.6 Efeitos Sonoros

A página de efeitos sonoros deve seguir o mesmo padrão de qualidade da página de músicas.

Regras:

- Visual deve ser padronizado.
- Paginação deve ser padronizada.
- Filtros devem ser claros.
- Player/waveform devem ser usados se houver áudio.
- Não deixar dados estáticos definitivos se houver API.
- Botões de licença/carrinho devem seguir fluxo de compra.

---

## 8.7 Licenças e Preços

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
- Modal de licença deve informar o que está sendo comprado.

---

## 8.8 Carrinho e Checkout

O fluxo correto deve ser:

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

---

## 8.9 Upload do Produtor

O upload do produtor é uma área crítica.

Modos conhecidos:

```txt
Single Track
Single Track + Stems
Efeitos FX
```

### Single Track

Deve exibir:

- arquivo principal da música;
- loops, se aplicável;
- metadados da faixa;
- termos.

Não deve exigir Stems.

### Single Track + Stems

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

### Efeitos FX

Deve exibir:

- campos de efeitos;
- metadados necessários;
- termos.

Não deve exibir Stems de música como obrigatórios.

### Regras técnicas

- Preservar validações de duração.
- Preservar `FormData`.
- Não alterar nomes enviados ao backend sem validação.
- Mostrar mensagens claras de erro.
- Layout deve ser organizado e responsivo.
- Single Track deve ter destaque e largura adequada.

---

## 8.10 Página do Artista

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

## 8.11 Área do Produtor

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

---

## 8.12 Dashboard do Produtor

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

MVP aceitável:

- cards de KPIs;
- filtros de período;
- tabela de desempenho;
- origem das vendas;
- placeholders claros para gráficos se API ainda não estiver pronta.

---

## 8.13 Footer

O footer deve:

- exibir links institucionais corretos;
- substituir “Testemunhos” por “Termos e Condições”;
- incluir LinkedIn;
- não conter links genéricos incorretos;
- abrir links externos corretamente.

Links internos devem usar navegação Angular.

---

## 8.14 FAQ

FAQ deve:

- manter visual coerente com o site;
- responder dúvidas reais de comprador/produtor;
- ser responsiva;
- não parecer página isolada fora da identidade visual.

---

## 9. Regras de qualidade de código

### TypeScript

- Preferir interfaces e tipos claros.
- Evitar `any`.
- Evitar duplicação de lógica.
- Tratar `null` e `undefined`.
- Não acessar propriedades sem verificar existência quando dados vêm da API.

### HTML Angular

- Evitar templates muito complexos.
- Evitar `href="#"`.
- Usar `button` para ações.
- Usar `a` apenas para navegação real.
- Garantir tags válidas.
- Usar `aria-label` quando necessário.

### SCSS

- Evitar estilos globais desnecessários.
- Usar classes do componente.
- Manter responsividade.
- Evitar `!important`, exceto em correções pontuais inevitáveis.
- Não quebrar Bootstrap/Material sem necessidade.

### Services

- Services devem isolar comunicação HTTP.
- Não colocar lógica de UI dentro de service, salvo estado compartilhado simples.
- Não manipular DOM dentro de service.
- Retornar `Observable` quando usar HttpClient.

---

## 10. Regras de QA

Após mudanças importantes, validar:

### Fluxos públicos

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

### Fluxos de produtor

- Login como produtor.
- Menu de produtor.
- Upload.
- Dashboard.
- Pedidos.
- Dados pessoais.
- Formas de pagamento.
- Página do artista.

### Fluxos de comprador

- Login como comprador.
- Listar músicas.
- Filtrar.
- Tocar preview.
- Escolher licença.
- Adicionar ao carrinho.
- Finalizar pedido.

---

## 11. Checklist manual mínimo

Antes de considerar uma entrega pronta, verificar:

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

## 12. Critérios de aceite por tipo de tarefa

### Correção visual

Aceita quando:

- bug visual desaparece;
- não quebra responsividade;
- não afeta lógica sem necessidade.

### Correção de navegação

Aceita quando:

- link/botão leva ao destino correto;
- não há reload indevido;
- não há `href="#"` residual no fluxo corrigido.

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
- exportação de relatórios do dashboard.

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

## 15. Entrega esperada

Toda entrega deve conter:

```txt
1. arquivos alterados;
2. resumo do que foi feito;
3. comandos executados;
4. resultado dos comandos;
5. passos de validação manual;
6. riscos ou pendências.
```

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
