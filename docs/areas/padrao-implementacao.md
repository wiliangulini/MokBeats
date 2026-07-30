---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 5. Padrão de implementação incremental

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

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
