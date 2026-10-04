# Apresentação 16:9 (1920 × 1080)

O motor `LIA_DECK` aplica o sistema da Liga:

- **Grid:** 12 colunas, margens de 120 px nas laterais e 72 px no topo e na base; o título fica sempre em (120, 72); o conteúdo vai de y = 264 a y = 936 e o rodapé fixo de y = 960 a y = 1008.
- **Fundo:** claro para conteúdo, navy para divisores e encerramento.
- **Capa:** usa a arte das capas A4 da Liga.

Os números vêm de [research/pesquisa-apresentacao-16x9.md](../research/pesquisa-apresentacao-16x9.md).

Exemplo completo: [exemplo-plano.json](exemplo-plano.json).

## Modo: projetar (`P`) ou ler (`L`)

Decida antes de escrever. Os modos nunca se misturam no mesmo deck.

1. O pedido fala em enviar, pré-leitura, PDF, relatório ou "sem apresentador" → `L`.
2. O pedido fala em aula, reunião, palestra, pitch ou workshop → `P`.
3. Contexto denso, com tabelas e números com fonte, e sem apresentador citado → `L`.
4. Dúvida real → `P`, e ofereça uma versão `L` como segundo deck.

| | P (projetar) | L (ler) |
|---|---|---|
| palavras por slide, fora do título | até 35 (ideal 10 a 25) | até 200 (ideal 60 a 150) |
| título | até 12 palavras | até 15 palavras |
| bullets | até 4, com até 8 palavras cada | até 6 |
| corpo | 40 px | 26 px |

## Ghost deck primeiro

Antes de escolher layouts, escreva só os títulos em sequência. Cada título é um **action title**: a conclusão do slide, com verbo ("Delegar bem leva três passos", não "Passos"). Lidos em ordem, eles contam a história. Depois escolha o layout que prova cada título.

## Plano

```json
{
  "formato": "apresentacao-16x9",
  "fontes": { "origem": "…", "palavras": 900, "unidades": [ … ], "cortes": { } },
  "doc": { "title": "…", "mode": "P", "footer": "LIA News", "pageName": "Apresentação — …" },
  "slides": [ … ]
}
```

`fontes` segue o mesmo inventário do documento: cada slide leva `src` com as unidades que carrega, e nenhuma unidade some sem corte justificado. Em P, cortar detalhe é normal, porque o apresentador fala o resto. Registre esses cortes como "dito pelo apresentador" ou ofereça a versão L.

`doc.footer` vai à esquerda do rodapé, seguido da seção atual (o título do último divisor). `doc.substituir` e `doc.resume` funcionam como no documento A4. Texto aceita `**negrito**` e `==destaque==`, que pinta em acento; use destaque em no máximo 3 palavras por slide.

| `t` | Campos | Uso |
|---|---|---|
| `cover` | `variant` (1 a 4), `title`, `titleLight`, `subtitle`, `meta`, `seal` | primeiro slide; `meta` traz data e contexto |
| `agenda` | `title`, `items[{title, text}]` | só com 15 ou mais slides ou 4 ou mais seções; 3 a 5 itens |
| `divider` | `n`, `title`, `text`, `short` | abre a seção (fundo navy); o título é a mensagem da seção |
| `statement` | `text`, `author`, `dark` | uma frase de até 14 palavras, de respiro ou de tese |
| `content` | `title`, `lead`, `text`, `bullets`, `side` | o slide de trabalho. `side` aceita `{value, label, source}` (número), `{label, title, text}` (card de destaque) ou `{image: {key, ratio}}` |
| `columns` | `title`, `cols[{label, title, items, text, accent}]`, `verdict` | 2 a 3 opções; `accent: true` só na recomendada; `verdict` enuncia a conclusão |
| `cards` | `title`, `items[{eyebrow, title, text}]` | 2 a 4 unidades paralelas |
| `steps` | `title`, `items[{title, text}]`, `current` | processo de 3 a 5 passos; `current` é o índice destacado |
| `timeline` | `title`, `items[{date, title, text, current}]` | marcos no tempo, de 3 a 6 |
| `numbers` | `title`, `items[{value, label, context}]`, `focus`, `source` | 1 a 3 números (até 4 em L); `source` é obrigatória |
| `image` | `title`, `image{key, ratio}`, `notes[]`, `caption` | screenshot com até 3 anotações numeradas |
| `quote` | `text`, `author`, `dark` | fala de terceiro com atribuição |
| `table` | `title`, `head`, `rows`, `cols`, `align`, `highlight`, `note` | até 5×6 em P e 7×12 em L; `highlight` é o índice da linha em destaque |
| `closing` | `title`, `text`, `contact[]` | último slide, sem conteúdo novo |

## Ritmo

- Uma ideia por slide. Se o título precisa de "e", são dois slides.
- No máximo 3 slides seguidos com o mesmo layout e no máximo 5 seguidos só de texto.
- Em P, um slide de respiro (`statement`, `numbers`, `quote` ou `divider`) a cada 4 a 6 slides.
- Slides escuros (divisores, encerramento, `dark`) em até 25% do deck. Em decks curtos, prefira 2 ou 3 seções, ou dispense os divisores.

## Imagens, QA e correção

Imagens seguem o mesmo fluxo do documento: o motor devolve `Imagem pendente: <key>` e a IA envia o arquivo com `upload_assets` e `nodeIds`.

| Regra do QA | Correção no plano |
|---|---|
| `B3 palavras` | corte até o limite do modo, divida em dois slides ou troque o modo (com o usuário) |
| `G3 slide ralo` | slide de leitura com menos de 40 palavras: traga o contexto da fonte (por quê, como, exemplo) até 60 a 150 palavras, ou junte com o slide vizinho |
| `C6 slide vazio embaixo` | o conteúdo ocupa só o topo da zona: em P, use um layout que respire (`statement`, `numbers`) ou acrescente o apoio visual; em L, desenvolva o texto ou junte slides |
| `B1 título` | reescreva como conclusão curta |
| `A5 layout repetido` | troque um dos slides por `cards`, `columns`, `numbers` ou `statement` quando o conteúdo permitir |
| `A5 slides escuros` | reduza os divisores ou transforme um `statement` escuro em claro |
| `C1`, `D1` | texto fora da área ou fonte fora do sistema: remonte; se persistir, é defeito do motor |

Depois do QA limpo, revise o screenshot do deck inteiro. Lendo só os títulos, a história se sustenta?
