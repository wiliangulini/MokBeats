---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 9.12 Dashboard do Produtor

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

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
- Se for necessário instalar biblioteca de gráficos, justificar antes e validar compatibilidade com a versão vigente do Angular.

MVP aceitável:

- cards de KPIs;
- filtros de período;
- tabela de desempenho;
- origem das vendas;
- placeholders claros para gráficos se API ainda não estiver pronta.

---


## 9.11 Área do Produtor

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
