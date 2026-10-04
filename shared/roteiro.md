# Do contexto ao roteiro

Contexto bruto chega como pilha: notas, conversas, rascunhos, dados soltos. O roteiro é o momento de **editar**: decidir o que o leitor precisa, em que ordem, e qual bloco carrega cada unidade. O desenho vem pronto; a qualidade do material depende desta etapa.

## 1. Enquadre em quatro linhas

Escreva no topo de `mapa.md` antes do plano:

- **Leitor:** quem é e o que já sabe.
- **Tarefa do leitor:** o que ele faz depois de ler ou assistir (decidir, executar, entender, se inscrever).
- **Tese:** a ideia central do material, em uma frase.
- **Recorte:** o que fica de fora e por quê.

Infira os quatro do contexto. Pergunte ao usuário só quando duas leituras plausíveis levariam a estruturas diferentes, e no máximo duas perguntas.

## 2. Arquitetura

- Agrupe as unidades em **3 a 6 partes**. Cada parte tem uma mensagem própria, que vira título de capítulo (documento) ou divisor e action titles (deck).
- Ordene pelo caminho do leitor: contexto curto → o que fazer → como fazer → cuidados → próximo passo. Reordene a fonte sempre que isso ajudar a leitura, mantendo a origem de cada unidade.
- Corte redundância. Se duas unidades dizem a mesma coisa, fica a mais concreta.
- Títulos dizem o ponto, não o tema: "Escolha o instalador pelo processador", não "Instalação".

## 3. Escolha do bloco pela natureza da unidade

| Unidade | Documento A4 | Deck 16:9 |
|---|---|---|
| explicação contínua | `p` | `content` com `text` |
| ideia de abertura | `lead` do capítulo | `statement` |
| ação em ordem | `steps` | `steps` |
| itens paralelos sem ordem | `list` | `content` com `bullets` |
| tarefa que o leitor confere | `checklist` | `cards` ou `content` |
| 2 a 3 opções comparadas | `cards` ou `table` | `columns` (destaque `accent` na recomendada) |
| 3 ou mais atributos comparáveis | `table` | `table` |
| 4 opções paralelas | `cards` | `cards` |
| número que sustenta o argumento | `kpis` (com fonte) | `numbers` ou `content.side.value` |
| sequência no tempo | `steps` ou `table` | `timeline` |
| risco, erro comum, custo | `callout` `atencao` | `content.side` ou `cards` |
| atalho ou recomendação | `callout` `dica` | `content.side` |
| caso curto | `callout` `exemplo` | `content` |
| fala de terceiro | `quote` | `quote` |
| comando, prompt ou código | `code` | `content` com `text` |
| screenshot ou imagem de evidência | `figure` | `image` com `notes` |

Destaques (callout, cards, kpis, quote) dão ritmo. Use-os quando a unidade é de fato diferente do texto em volta, nunca para preencher página.

## 4. Densidade: editar, não resumir

O defeito clássico de material gerado é o texto ralo: a fonte vira tópicos de três palavras, títulos soltos e caixas, e o leitor fica sem o que precisava. Este roteiro **edita** a fonte (ordena, esclarece, corta repetição) e não a resume, salvo pedido explícito de resumo.

- **Cobertura.** Toda unidade do inventário vai para um bloco (`src`) ou para `fontes.cortes` com o motivo. Nada some em silêncio.
- **Retenção.** Fora de pedido de resumo, o documento mantém de 60% a 110% das palavras da fonte (`fontes.palavras`). Abaixo de 35% o validador bloqueia. Uma fonte confusa pode até crescer: explicar bem ocupa espaço.
- **Parágrafo completo.** Cada parágrafo desenvolve uma ideia: o quê, por quê ou como, e um exemplo ou consequência. São 40 a 120 palavras. Um parágrafo de uma frase só é exceção.
- **Lista é para itens paralelos.** Cada item é uma frase completa, com 8 a 25 palavras. Explicação, argumento e contexto vão em parágrafo, não em bullet.
- **Seção com corpo.** Cada H2 traz pelo menos 60 palavras de texto antes do próximo título, e cada capítulo pelo menos 120.
- **Destaque com parcimônia.** No máximo um callout, card, número ou citação a cada ~250 palavras. Caixas demais deixam o texto ralo.
- **Fonte magra.** Quando a fonte é curta demais para o material pedido, não invente para preencher. Faça um material mais curto e liste nas pendências o que falta para desenvolvê-lo.

## 5. Orçamento por formato

- **Documento:** de 280 a 380 palavras por página de corpo (cerca de 330). Uma página com menos de 200 palavras e sem figura gera aviso no QA.
- **Deck para projetar:** de 10 a 35 palavras por slide fora do título, uma ideia por slide. O apresentador completa o resto.
- **Deck para ler:** de 60 a 150 palavras por slide (máximo de 200), ainda com uma ideia por slide. Sem apresentador, o slide precisa se explicar sozinho. Menos de 40 palavras gera aviso.

Se o conteúdo excede o orçamento, divida em mais páginas ou slides. Não reduza o texto até ele perder sentido, e não peça letra menor.

## 6. Revisão do roteiro

Antes de montar, leia em sequência só os títulos (capítulos e H2 ou action titles). Eles precisam contar a história sozinhos. Se não contam, reescreva os títulos, não o desenho.
