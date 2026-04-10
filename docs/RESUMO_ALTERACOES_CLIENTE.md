# Resumo das Alterações Implementadas

Data de referência: 26/03/2026

Este documento resume, em linguagem simples, as alterações que hoje aparecem como pendentes no Controle do Código-Fonte. Embora o editor mostre cerca de 21 alterações, elas fazem parte de um conjunto de entregas funcionais.

## Resumo executivo

As mudanças se concentram em 6 frentes principais:

1. Reformulação do fluxo de envio de músicas por produtores.
2. Simplificação e padronização de partes do cadastro/login.
3. Novas validações de negócio para evitar envios incorretos.
4. Ajuste de acesso ao dashboard do produtor.
5. Melhorias internas no processo de publicação do sistema.
6. Reforço de testes e ambiente de homologação.

## 1. Alterações visíveis para o cliente

### Formulário de produtores

O formulário de envio para produtores foi a área com maior mudança. A tela foi reorganizada para ficar mais clara, mais objetiva e mais fácil de preencher, inclusive no celular.

Principais mudanças visíveis:

- O formulário foi simplificado e reorganizado em um layout mais limpo.
- Campos antigos e mais burocráticos foram removidos, como confirmação de e-mail, sobrenome separado, bloco de humor/subgênero, loops obrigatórios e várias redes sociais.
- Entraram campos mais úteis para o processo comercial e de catalogação, como:
  nome/nome artístico, telefone com código do país, identificação, nome da música, categoria, gênero, BPM, tom, valor de venda e link externo.
- Foi incluído upload opcional de imagem para a música.
- O envio dos arquivos ficou mais organizado, com áreas específicas para cada tipo de arquivo.
- Foi criada uma experiência mais responsiva para mobile, com melhor distribuição dos campos.
- Quando houver erro no preenchimento, o sistema agora mostra um resumo dos pontos que precisam ser corrigidos.

### Novos formatos de envio para produtores

O processo de envio passou a trabalhar com 3 formatos bem definidos:

1. `Single track`
   envio apenas da faixa principal.
2. `Single track + Stems`
   envio da faixa principal mais 4 stems fixos: melodias, harmonias, ritmos e efeitos.
3. `Efeitos (FX)`
   envio da faixa principal mais 6 arquivos separados de efeitos.

Isso deixa o processo mais padronizado e reduz dúvida no momento do upload.

### Cadastro e login

Na tela de cadastro/login houve uma padronização visual e funcional dos seletores:

- O campo `Tipo de Pessoa` foi modernizado internamente para ficar mais estável.
- O campo `Tipo de Perfil` deixou de usar opção em rádio solta e passou a seguir o mesmo padrão visual do restante da interface.
- As opções `Mok Starters` e `Mok Makers` continuam existindo, mas agora estão melhor organizadas e com ajuda visual explicando cada perfil.

## 2. Alterações de comportamento, mesmo sem impacto visual direto

Além da interface, houve mudanças importantes nas regras do sistema.

### Validação mais forte no envio de músicas

O sistema passou a validar com mais rigor:

- campos obrigatórios do produtor;
- formato do e-mail;
- telefone e identificação;
- BPM em faixa válida;
- valor de venda maior que zero;
- links externos em formato correto;
- aceite obrigatório dos termos.

### Validação de duração dos áudios

Agora o sistema compara automaticamente a duração dos arquivos enviados.

- No modo `Single track + Stems`, os 4 stems precisam ter a mesma duração da faixa principal.
- No modo `Efeitos (FX)`, os 6 efeitos também precisam seguir a duração da faixa principal.

Isso evita uploads inconsistentes e reduz retrabalho na curadoria.

### Registro musical mais flexível

Antes o processo exigia campos mais rígidos para identificação do conteúdo. Agora o sistema ficou mais flexível:

- aceita ISRC;
- aceita UPC;
- aceita HASH;
- aceita outros tipos de registro quando necessário.

Na prática, isso reduz bloqueios desnecessários no cadastro da música e se adapta melhor a diferentes situações de catálogo.

### Acesso ao dashboard do produtor

Houve um ajuste de navegação importante:

- o produtor autenticado passou a acessar o dashboard do produtor sem depender da etapa de perfil completo como bloqueio inicial.

Impacto prático:
o produtor entra mais rápido na área dele e o fluxo de onboarding fica menos travado.

### Compatibilidade com o fluxo antigo

Mesmo com a criação do novo fluxo de produtores, o backend foi preparado para continuar aceitando o formato anterior. Isso reduz risco na transição e evita quebra imediata de integrações já existentes.

## 3. Melhorias internas que apoiam a operação

Estas alterações não são necessariamente visíveis para o cliente final, mas melhoram estabilidade, implantação e manutenção.

### Componente de upload reaproveitável

O componente de upload ganhou novas variações visuais:

- versão compacta para arquivos de áudio;
- versão específica para imagem;
- possibilidade de esconder títulos quando a tela já explica o contexto.

Isso ajudou a deixar o formulário de produtores mais organizado.

### Processo de deploy mais automatizado

O script de publicação para VPS foi refeito para reduzir etapas manuais.

Agora ele cobre de forma mais completa:

- build do frontend;
- envio do frontend e backend;
- envio opcional dos áudios;
- configuração de rotas do site;
- configuração da API no servidor;
- inicialização/reinicialização do backend;
- validações finais após a publicação.

Impacto prático:
mais segurança na hora de publicar novas versões e menor chance de erro operacional.

### Ambiente de homologação

Foi incluído um usuário de teste do tipo produtor nos dados locais de apoio. Isso facilita validação, demonstração e conferência do fluxo sem depender de cadastro manual toda vez.

## 4. Reforço de qualidade e testes

Também houve trabalho de sustentação para garantir que as mudanças sejam mais confiáveis.

Foram atualizados ou criados testes para validar:

- o novo comportamento do formulário de produtores;
- os novos modos de upload;
- a padronização dos seletores no login/cadastro;
- o componente de upload;
- a estabilidade do ambiente de testes.

Impacto prático:
menor risco de regressão e mais confiança para evoluir o sistema.

## 5. Resumo para apresentar ao cliente

Se precisar explicar de forma curta em reunião, este texto resume bem:

> Reestruturamos o fluxo de entrada de produtores na plataforma. O formulário de envio ficou mais simples, mais organizado e mais alinhado ao processo real de catálogo, com novos campos de negócio, novos formatos de upload e validações mais fortes para evitar erro de envio. Também melhoramos o cadastro, liberamos o acesso do produtor ao dashboard de forma menos travada, reforçamos a compatibilidade com o fluxo antigo e tornamos o processo de publicação e testes mais seguro.

## Conclusão

As alterações pendentes do Controle do Código-Fonte não representam 21 funcionalidades diferentes. Na prática, elas se agrupam principalmente em uma grande entrega de reformulação do fluxo de produtores, acompanhada por ajustes no cadastro, no backend, no deploy e na qualidade interna do sistema.
