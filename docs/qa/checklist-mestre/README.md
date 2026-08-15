# Checklist Mestre de QA — MokBeats

> **Checkpoint 1 de N.** Este artefato está em construção incremental. Nesta etapa existem apenas
> este `README.md` (escopo, metodologia, template) e `MATRIZ-RASTREABILIDADE-R01-R28.md`
> (esqueleto). Os arquivos de casos por área (`00-*.md` a `17-*.md`) ainda **não existem** — cada um
> será criado em checkpoints futuros, mediante aprovação humana explícita e separada desta.

## 1. Natureza deste artefato

Este diretório não é um relatório pontual (`docs/ia-auditorias/`, histórico e datado) nem uma regra
de domínio (`docs/areas/`, normativa). É um **checklist de execução recorrente**: casos de teste
manual reexecutáveis, com campo de status, atualizados a cada ciclo de QA. Por isso vive em pasta
própria, `docs/qa/checklist-mestre/`, criada nesta etapa por aprovação explícita.

Fonte de origem: plano de Fase 1 aprovado em sessão de planejamento (`implementation-planning`,
2026-08-14), que leu integralmente os relatórios R01–R28 de `docs/ia-auditorias/` mais os relatórios
periféricos da mesma pasta, e conferiu pontos de conflito específicos contra o código atual. O plano
completo existe apenas na conversa que o originou; este `README.md` resume o que é necessário para
operar o checklist sem depender daquela conversa.

## 2. Objetivo e escopo

**Objetivo:** cobrir integralmente, em casos de teste manual executáveis, as entregas, regressões,
riscos e pendências registradas de R01 a R28, complementadas por testes de integração, autorização,
responsividade, acessibilidade, compatibilidade, resiliência, contrato e inspeção onde os relatórios,
as regras de domínio ou o código atual indicarem necessidade real.

**Escopo incluído (áreas planejadas, uma por arquivo futuro):** preparação de ambiente/personas/massa
de dados; matriz de autenticação, perfis, guards e deep links; músicas, filtros, licenças, carrinho e
checkout; player/WaveSurfer/stems; efeitos sonoros; upload do produtor; página do artista e área do
produtor; dashboard do produtor; header/home/footer/FAQ e navegação; pricing e consistência comercial;
smoke público e jornadas completas de comprador/produtor (compostas a partir dos casos atômicos das
áreas acima); responsividade/navegadores/dispositivos; acessibilidade; resiliência; exploratórios;
recomendações de automação.

**Fora de escopo deste artefato:** valores/regras comerciais reais, gateway de pagamento, endpoint
final de checkout ou de efeitos sonoros, e qualquer outro item listado em `PROJECT_RULES.md §13` —
esses permanecem `Decisão humana pendente` até validação humana explícita, nunca viram resultado
esperado presumido.

## 3. Metodologia e precedência das fontes

Ordem de precedência ao definir o **resultado esperado atual** de um caso:

1. Código-fonte atual (componente/service/rota/guard citado com caminho e trecho).
2. Regra de domínio (`.claude/rules/*`, `docs/areas/*`).
3. Relatório Rxx mais recente sobre o tema.
4. Relatório Rxx mais antigo (só quando não houver fonte mais recente nem código a conferir).

Quando o código não puder ser verificado no momento de redigir um caso, o item permanece como
hipótese/pendência — nunca vira fato assumido. Relatórios Rxx são histórico e continuidade, não fonte
de verdade (ver `docs/ia-auditorias/README.md`); ao redigir um caso, confirme no código atual antes de
fixar o resultado esperado.

Contradições entre relatórios sem resolução no código atual resultam em item `Bloqueado` ou
`Decisão humana pendente` — nunca em resultado esperado fictício. Contagens/atribuições históricas de
teste automatizado (ex.: falhas pré-existentes descritas em relatórios antigos) não são reaproveitadas
como baseline atual sem reconfirmação.

## 4. Template canônico de caso de teste

Todo caso, em qualquer arquivo `NN-*.md` futuro, usa esta tabela (uma linha por caso ou um bloco por
caso quando os passos forem longos — a decidir por arquivo, mantendo os mesmos campos):

```markdown
### <ID>

| Campo | Valor |
|---|---|
| ID | QA-<ÁREA>-<NNN> |
| Origem | R<xx> §<seção> (ou "Código atual" / "Regra <arquivo>" quando não houver Rxx de origem) |
| Área / Rota / Fluxo | |
| Tipo de teste | Funcional \| Integração \| Autorização \| Responsividade \| Acessibilidade \| Compatibilidade \| Resiliência \| Contrato \| Inspeção |
| Prioridade / Risco | Crítica \| Alta \| Média \| Baixa |
| Persona | Visitante \| Comprador \| Produtor \| Comprador+perfil incompleto \| Produtor não autenticado |
| Pré-condições e massa de dados | |
| Ambiente / Navegador / Viewport | |
| Passos atômicos | 1. ... 2. ... |
| Resultado esperado atual | |
| Evidência a capturar | Screenshot \| Vídeo \| Log de console \| Aba Network \| Outro |
| Dependências / Bloqueios | |
| Limpeza / Restauração do estado | |
| Resultado real / Observações / ID de defeito | *(preenchido na execução)* |
| Status | Não executado |
| Classificação | Vigente \| Supersedido \| Limitação conhecida \| Decisão humana pendente |
```

## 5. Campos obrigatórios — definição

- **ID:** único, estável entre execuções; prefixo por área (ex.: `QA-AUTH-001`, `QA-CART-014`) para
  permitir referência cruzada sem depender do arquivo.
- **Origem:** relatório Rxx e seção, ou "Código atual"/"Regra X" quando o caso nascer de verificação
  direta e não de um relatório histórico.
- **Área / Rota / Fluxo:** caminho real de componente/rota tocado, não descrição genérica.
- **Tipo de teste:** um dos 8 valores listados no template (§4); não inventar categoria nova sem
  necessidade.
- **Prioridade / Risco:** ver legenda em §6.
- **Persona:** quem executa o caso; obrigatório mesmo em telas públicas ("Visitante").
- **Pré-condições e massa de dados:** estado necessário antes do caso (login, itens no carrinho,
  produtor com uploads, etc.); nunca inventar dado de produção.
- **Ambiente / Navegador / Viewport:** obrigatório mesmo quando "qualquer" — declarar explicitamente.
- **Passos atômicos:** numerados, um efeito observável por passo.
- **Resultado esperado atual:** definido pela precedência de fontes (§3); se não houver fonte
  confiável, o campo diz `A confirmar — Decisão humana pendente`, nunca um valor inventado.
- **Evidência a capturar:** o que anexar ao executar (screenshot, vídeo, console, Network).
- **Dependências / Bloqueios:** outros casos que precisam rodar antes, ou impedimento conhecido
  (ex.: backend de efeitos sonoros inexistente).
- **Limpeza / Restauração do estado:** como devolver o ambiente ao estado anterior após o caso.
- **Resultado real / Observações / ID de defeito:** vazio até a execução; nunca preenchido nesta fase
  de criação de casos.
- **Status:** ver legenda em §6; todo caso nasce `Não executado`.
- **Classificação:** ver legenda em §6.

## 6. Legendas

### 6.1 Status de execução

| Status | Significado |
|---|---|
| `Não executado` | Estado inicial obrigatório de todo caso novo |
| `Passou` | Executado, resultado real igual ao esperado |
| `Falhou` | Executado, resultado real diverge do esperado — exige ID de defeito |
| `Bloqueado` | Não pôde ser executado (dependência ausente, ambiente, decisão pendente) |
| `Não aplicável` | Caso deixou de fazer sentido (ex.: fluxo removido) — exige justificativa no campo de observações |

### 6.2 Prioridade / Risco

| Nível | Critério |
|---|---|
| `Crítica` | Bloqueia compra, autenticação, autorização ou perda de dado real do usuário |
| `Alta` | Quebra visível de fluxo principal (player, upload, dashboard, carrinho) sem bloquear checkout |
| `Média` | Defeito visual/UX relevante ou pendência documentada sem impacto funcional imediato |
| `Baixa` | Cosmético, texto, ou limitação conhecida de baixo impacto |

### 6.3 Classificação (marcador de proveniência)

| Marcador | Significado |
|---|---|
| `Vigente` | Comportamento confirmado como atual (por código e/ou relatório mais recente) |
| `Supersedido` | Comportamento descrito por um Rxx antigo foi substituído por um Rxx/código mais recente; caso não testa mais a versão antiga |
| `Limitação conhecida` | Comportamento aquém do ideal, documentado e aceito (ex.: máscara de cartão que nunca funcionou nas rotas SPA); não é regressão a reabrir |
| `Decisão humana pendente` | Resultado esperado depende de decisão de negócio/produto/segurança ainda não tomada (ver `PROJECT_RULES.md §13`) |

## 7. Regras para evidências, bloqueios e decisões humanas

- Nenhum caso pode declarar `Passou` sem evidência capturada conforme o campo "Evidência a capturar".
- Um caso `Bloqueado` deve nomear o bloqueio exato (arquivo, endpoint ausente, decisão pendente) — não
  basta escrever "bloqueado" sem causa.
- Um caso `Decisão humana pendente` nunca deve ser reclassificado para `Vigente` por quem executa o
  QA; só por quem tem autoridade para a decisão de negócio/produto, com registro de quem decidiu e
  quando.
- Preço, endpoint, payload, regra comercial ou dado de produção nunca são inventados para permitir que
  um caso "passe"; a ausência de fonte confiável é, ela mesma, o resultado a registrar.
- Um caso derivado de um Rxx `Supersedido` não deve ser executado como se testasse o comportamento
  antigo; se ainda fizer sentido testar a versão atual do mesmo fluxo, nasce como novo caso `Vigente`
  com origem "Código atual", referenciando o Rxx antigo apenas como contexto histórico.

## 8. Instruções de execução e atualização

1. Antes de executar qualquer caso, confirme branch, `git status` e que o ambiente está no mínimo de
   Node exigido pelo Angular CLI atual (ver `docs/ia-auditorias/2026-07-30__migracao-angular-etapa-12__claude.md`
   e etapa 13 para o histórico da troca de test runner Karma→Vitest e do requisito de versão).
2. Execute os casos na ordem do arquivo de área; não pule dependências declaradas.
3. Atualize apenas os campos "Resultado real / Observações / ID de defeito" e "Status" durante a
   execução; não reescreva "Resultado esperado atual" no meio de uma rodada de execução — se o
   esperado mudou, é uma atualização de manutenção do checklist, não uma execução.
4. Ao encontrar defeito, registre o ID de defeito no caso e, se o projeto tiver rastreador externo,
   referencie-o; nunca corrija o código a partir deste checklist sem uma tarefa própria de implementação.
5. Atualizações de manutenção (novo caso, mudança de resultado esperado, reclassificação de marcador)
   exigem atualizar também a linha correspondente em `MATRIZ-RASTREABILIDADE-R01-R28.md`.
6. Este README é atualizado sempre que a lista de arquivos de área mudar (novo arquivo criado, arquivo
   dividido, etc.) — manter o índice abaixo em sincronia com o que existe de fato no diretório.

## 9. Índice de arquivos planejados

| Arquivo | Conteúdo | Status |
|---|---|---|
| `README.md` | Este arquivo | **Criado — Checkpoint 1** |
| `MATRIZ-RASTREABILIDADE-R01-R28.md` | Matriz Rxx → casos | **Criado — Checkpoint 1** |
| `00-preparacao-ambiente-personas-massa-dados.md` | Ambiente, Node/nvm, personas, massa de dados | Planejado |
| `01-matriz-autenticacao-guards-deep-links.md` | Auth, guards, perfis, deep links | Planejado |
| `02-musicas-filtros-licencas-carrinho-checkout.md` | Músicas, filtros, licença, carrinho, checkout | Planejado |
| `03-player-wavesurfer-stems.md` | Player, WaveSurfer, troca de faixa, stems | Planejado |
| `04-efeitos-sonoros.md` | Efeitos sonoros (capacidade real atual) | Planejado |
| `05-upload-produtor.md` | Upload Single/Stems/FX, validações, FormData | Planejado |
| `06-pagina-artista-area-produtor.md` | Página pública do artista vs. área privada | Planejado |
| `07-dashboard-produtor.md` | Dashboard: autorização, estados, gráficos, responsividade | Planejado |
| `08-header-home-footer-faq-navegacao.md` | Header, Home, Footer, FAQ, navegação sem reload | Planejado |
| `09-pricing-consistencia-comercial.md` | Pricing e consistência de preços entre telas | Planejado |
| `10-smoke-publico.md` | Smoke público (composição) | Planejado |
| `11-jornada-comprador.md` | Jornada completa do comprador (composição) | Planejado |
| `12-jornada-produtor.md` | Jornada completa do produtor (composição) | Planejado |
| `13-responsividade-navegadores-dispositivos.md` | Responsividade, navegadores, dispositivos | Planejado |
| `14-acessibilidade.md` | Teclado, foco, modal, ARIA, zoom | Planejado |
| `15-resiliencia.md` | Latência, falha de API, 401, recurso ausente | Planejado |
| `16-exploratorios.md` | Refresh, back/forward, estado residual, memória | Planejado |
| `17-recomendacoes-automacao.md` | Candidatos a automação, separados do manual | Planejado |

## 10. Histórico de checkpoints

| Checkpoint | Data | Escopo | Aprovado por |
|---|---|---|---|
| 1 | 2026-08-14 | Criação de `README.md` e `MATRIZ-RASTREABILIDADE-R01-R28.md`; nenhum caso de teste redigido | Aprovação explícita do usuário nesta sessão (`/create-code`) |
