# Playbook ou documento paginado

Use esta rota quando o pedido for transformar conteúdo em playbook ou documento paginado da Liga.
O ponto de partida são os 115 frames `tpl-*` originais da página `198:2` do Figma.

## Seleção econômica

Execute os comandos abaixo a partir da pasta desta skill.

1. Planeje as páginas por função: capa, abertura, resumo, conteúdo, tutorial, comparação, caso ou referências.
   Registre a fonte de cada unidade de conteúdo.
2. Compare `python catalog.py fingerprint` com a estrutura atual no Figma conforme [a checagem de vigência](freshness.md). Se divergir, regenere o índice a partir do Figma antes de selecionar.
3. Rode `python catalog.py select INTENCAO` para obter candidatos do catálogo original.
   Consulte visualmente no Figma apenas os candidatos promissores e escolha o frame pela capacidade de leitura e pelo encaixe real do conteúdo, não pelo nome isolado.
   Para texto longo, compare primeiro candidatos de corpo com fluxo do topo à base, como `tpl-body-twocol` e `tpl-body-sidebar-v2`; use composições centralizadas como pausas editoriais, não como padrão de todas as páginas internas.
4. Clone o `tpl-*` selecionado, preserve seus elementos de marca e substitua os textos e imagens apropriados.
   Se o conteúdo não couber, use outro `tpl-*`, divida a página ou adapte o clone sem alterar o original.
   Só crie uma estrutura inédita quando nenhum template inspecionado sustentar a função editorial; registre a justificativa.

`python catalog.py intents` mostra as funções disponíveis; `families` lista as famílias; `search TERMO` devolve até dez nomes locais; `validate` confere integridade local, não vigência remota.
O catálogo local contém 115 frames em 26 grupos de nome; a ficha master enumera 27 itens ao separar dois tipos de fluxo.

## Montagem e revisão

Faça uma capa e uma página interna primeiro.
Clone diretamente do catálogo original para uma página de produção separada, usando o conector do Figma.
Mantenha para cada página o ID do template-fonte, o ID do clone e as substituições efetuadas.
Inspecione cada página renderizada: cortes, sobreposição, contraste, paginação, fontes, referências, fidelidade e distribuição vertical do conteúdo.
Em PDF ou documento de leitura contínua, a página interna deve ter um percurso legível do início ao fim da área útil.
Se um núcleo pequeno de texto ficar isolado no centro enquanto partes relevantes da fonte foram omitidas ou transferidas para páginas adicionais, reestruture: escolha um template de corpo mais denso, amplie os blocos no clone ou consolide páginas.
Preserve respiros intencionais em capas e aberturas; não acrescente texto de enchimento nem reduza margens e corpo tipográfico só para ocupar espaço.
Divida conteúdo transbordado em uma página de continuação antes de reduzir a tipografia.
Registre IDs, referências de conteúdo e estado de revisão em um mapa de execução.

Preserve a tipografia e as cores do template escolhido, que podem variar por família.
Confirme os valores atuais no Design System antes de criar estilos novos.
