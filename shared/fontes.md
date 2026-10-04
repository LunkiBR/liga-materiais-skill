# Ingestão do conteúdo

Leia a fonte inteira antes de planejar qualquer estrutura.

## Por tipo de fonte

- **Markdown ou texto:** preserve títulos, ordem argumentativa, tabelas, links e notas. A origem de cada trecho é `arquivo:linha`.
- **PDF:** use a skill de PDF para extrair o texto e conferir visualmente páginas, tabelas e imagens. A origem é `p. N`. Em páginas digitalizadas, aplique OCR só com ferramenta adequada e confira os trechos críticos na imagem.
- **Word, slides, páginas web:** use a ferramenta do formato e compare com a visualização original, porque uma exportação plana perde ordem de leitura e tabelas. A origem é seção, slide ou URL.
- **Conversa ou anotações soltas:** a origem é a própria mensagem. Datas relativas viram datas absolutas.

## Inventário

Produza o inventário de **unidades**: tese, argumento, definição, passo, número, comparação, aviso, exemplo, citação, imagem e referência. Cada unidade recebe um `id` (`u1`, `u2`…), a origem, o tipo e um resumo de uma linha. O inventário vai para `fontes.unidades` do plano, e `fontes.palavras` guarda o total de palavras úteis da fonte, sem ruído como saudações, repetições de conversa e assinaturas. É contra esse inventário que o validador confere se nada foi esquecido.

- Imagens que vão entrar no material: salve o arquivo em `runs/<data>-<slug>/img/` e anote largura e altura em pixels. A proporção (`ratio` = largura/altura) é obrigatória no plano.
- Fatos sensíveis (nomes, números, prazos, critérios) mantêm a origem também no plano editorial.
- O que estiver ilegível, ambíguo ou sem fonte entra em **lacunas**. Não preencha lacuna por inferência.

A ingestão está concluída quando toda unidade tem origem e a lista de lacunas existe, mesmo vazia.
