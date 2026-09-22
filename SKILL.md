---
name: liga-materiais
description: Criar ou adaptar materiais da Liga IA UFSCar no Figma a partir de PDF, Markdown ou outro conteúdo, usando o Design System e os templates atuais. Inclui playbooks, documentos institucionais e formatos novos; não é o fluxo de posts do Social Design.
---

# Materiais da Liga

Produza o material pedido com conteúdo fiel à fonte e composição editável no Figma.
Esta skill é independente de Social Design: não carregue suas regras de posts, hooks ou carrosséis, exceto se o usuário pedir explicitamente essa contribuição editorial.
O arquivo Figma `rbxe2L7fFOqKELar7dZ9zD` é a fonte de verdade visual: [Design System — Liga](https://www.figma.com/design/rbxe2L7fFOqKELar7dZ9zD/Liga?node-id=167-52) e [Catálogo de Templates — Documentação](https://www.figma.com/design/rbxe2L7fFOqKELar7dZ9zD/Liga?node-id=198-2).

## Roteamento

- Material paginado de leitura ou PDF, como playbook, perfil, manifesto, testamento institucional ou arquétipos: leia [a rota de documento paginado](references/playbook.md).
- Outro suporte: defina primeiro finalidade, público e unidade de leitura; então consulte no Figma apenas os tokens e templates pertinentes. Selecione e adapte os templates originais antes de considerar uma estrutura nova. Não trate o nome do material como prova de um formato fixo.
- Pedido de post, carrossel ou estratégia de canal: use Social Design, não esta skill. Se o pedido misturar um documento-base e derivados sociais, produza primeiro o documento-base aqui e trate os derivados como uma etapa separada.

## Contrato comum

1. Extraia e organize o conteúdo conforme [a ingestão](references/intake.md). Preserve afirmações, imagens, tabelas, citações e suas origens; sinalize lacunas e trechos ilegíveis.
2. Decida a arquitetura do material pela função de cada parte. Respeite a intenção do usuário e o conteúdo, sem forçar todo material ao mesmo número de páginas ou à mesma estrutura.
3. Consulte só as famílias, templates, estilos e variáveis necessários. O [índice local](index.json) é uma cópia de descoberta, não autoridade visual; valide os nós escolhidos no Figma e aplique [a checagem de vigência](references/freshness.md) quando usar o catálogo.
4. Monte uma amostra representativa no Figma e revise legibilidade, hierarquia, fidelidade, editabilidade e ocupação editorial antes de completar o material. Em documentos longos, continue em outra página antes de comprimir texto para caber.
5. Entregue links dos frames finais, mapa de fontes e limitações concretas. Não apresente placeholder, alegação sem origem ou frame não revisado como versão final.

Para cada página, selecione um `tpl-*` original da página `198:2`, inspecione sua composição visual, clone-o em uma página de produção e só então substitua o conteúdo.
Adaptações são permitidas, mas o frame original selecionado e as mudanças precisam constar no mapa de execução.
