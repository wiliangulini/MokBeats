---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 12. Validação, QA e critérios de aceite

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

Antes de concluir, executar comandos disponíveis verificando primeiro os scripts reais em `package.json`.

```bash
npm run build
npm test
npm run lint
npm run typecheck
```

Nunca inventar comando. Se ausente, documentar: `Não há script X configurado no projeto.`

Se um comando falhar, documentar: comando, erro, causa provável e se foi introduzido pela alteração ou já existia.

É proibido remover, desativar ou silenciar testes e validações existentes sem justificativa técnica, risco registrado e autorização.

### Fluxos a validar quando afetados

**Público:** Home, Header/menu, Login/cadastro, Músicas, Player, Filtros, Efeitos sonoros, Preços/licenças, Carrinho, Footer.

**Produtor:** Login, Menu, Upload, Dashboard, Pedidos, Dados pessoais, Formas de pagamento, Página do artista.

**Comprador:** Login, Listar músicas, Filtrar, Tocar preview, Escolher licença, Adicionar ao carrinho, Finalizar pedido.

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

### Critérios de aceite por tipo de tarefa

**Correção visual:** bug visual desaparece; não quebra responsividade; não afeta lógica.

**Correção de navegação:** link/botão leva ao destino correto; sem reload indevido; sem link vazio residual.

**Correção de player:** música toca; waveform aparece; troca de faixa funciona; dados coerentes; sem áudios conflitantes.

**Correção de upload:** campos aparecem conforme modo; validações funcionam; FormData compatível; erros exibidos com clareza.

**Dashboard:** rota protegida funciona; KPIs aparecem; filtros funcionam; tabela aparece; loading/erro tratados; visual responsivo.

**Refatoração:** estava no escopo ou necessária para reduzir risco; preservou comportamento; foi localizada; melhorou clareza ou segurança; foi validada.
