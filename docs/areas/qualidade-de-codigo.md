---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 10. Qualidade de código

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

### TypeScript

- Preferir interfaces e tipos claros.
- Evitar `any` sem justificativa.
- Evitar silenciar erros sem explicação.
- Não usar `@ts-ignore` nem suprimir lint sem justificativa técnica registrada.
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

### Dependências

Antes de adicionar ou atualizar uma dependência:

- verificar se o projeto já possui solução equivalente;
- justificar necessidade e alternativa sem dependência;
- validar compatibilidade com a versão vigente do Angular e o TypeScript configurado;
- avaliar impacto no bundle, build, manutenção e segurança;
- obter aprovação antes de alterar `package.json` ou arquivos de lock.

### Performance

- Medir ou apresentar evidência do gargalo antes de otimizar.
- Evitar busca de dados em excesso, renderização cara, loops desnecessários e imports pesados.
- Avaliar impacto no bundle inicial quando a mudança afetar dependências ou carregamento.
- Não trocar clareza e segurança por micro-otimização sem benefício demonstrável.

### Documentação

Atualizar documentação quando a mudança afetar:

- comportamento público;
- comando de execução ou validação;
- variável de ambiente;
- decisão arquitetural relevante;
- contrato de API;
- fluxo operacional ou procedimento de deploy.

---
