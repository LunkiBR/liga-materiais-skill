# Documento A4 (794 × 1123)

Leitura contínua: playbook, guia, manual, relatório, perfil. Fundo claro, títulos em Clash Display, corpo em Inter 14/20. O motor `LIA_A4` aplica o grid (margens 64/76/87, texto em 551 px, blocos largos em 666 px), a escala tipográfica, as cores, a paginação e o cabeçalho e rodapé correntes. Os números vêm de [research/pesquisa-documento-a4.md](../research/pesquisa-documento-a4.md).

Exemplo completo: [exemplo-plano.json](exemplo-plano.json).

## Plano

```json
{
  "formato": "documento-a4",
  "fontes": {
    "origem": "caminho ou descrição da fonte",
    "palavras": 2400,
    "resumo": false,
    "unidades": [{ "id": "u1", "origem": "p. 2", "tipo": "passo", "resumo": "…" }],
    "cortes": { "u9": "motivo do corte" }
  },
  "doc": { "title": "…", "short": "…", "pageName": "Material — …" },
  "cover": { "variant": 2, "title": "…", "titleLight": "…", "subtitle": "…", "seal": "…" },
  "blocks": [ … ],
  "backcover": {}
}
```

- `fontes`: inventário da ingestão ([../shared/fontes.md](../shared/fontes.md)). Todo bloco leva `src` com o id da unidade que carrega (`"u3"` ou `["u3", "u4"]`). O validador recusa unidade sem destino, corte sem motivo e retenção abaixo de 35% das palavras da fonte. `resumo: true` só quando o usuário pediu um resumo.
- `doc.short`: texto do cabeçalho corrente, com até 45 caracteres (por exemplo "Guia do Antigravity IDE · PS 2026.2").
- `doc.pageName` cria uma página nova; `doc.pageId` usa uma página existente.
- `doc.chapterBreak`: `"auto"` (padrão) abre página nova para o capítulo só quando sobra menos de 40% da página; `"page"` força sempre. Use `"page"` em documentos a partir de 8 páginas.
- `doc.substituir`: id do `wrapper` de uma montagem anterior, que é apagado antes da nova. Use ao remontar.
- `cover.variant`: as quatro capas preservadas da Liga são `1` (feixe), `2` (planos diagonais), `3` (blocos verticais) e `4` (arcos, fundo azul). `title` fica na linha de cima em peso médio, `titleLight` na de baixo em peso regular, e `seal` é um selo curto opcional ("PS 2026.2", "RAG").
- `backcover`: `{}` usa a contracapa padrão; omita para não incluir. Também aceita textos por nome de camada (`Marca`, `Contato 1`, `Contato 2`, `Local`, `Créditos`, `Rede`, `Fim`, `Ano`).

## Blocos

Texto aceita `**negrito**` (no máximo uma expressão por parágrafo) e `` `código` ``.

| `t` | Campos | Regras |
|---|---|---|
| `chapter` | `title`, `n`, `lead`, `eyebrow`, `short` | abre a parte; `lead` de 1 a 3 linhas; `short` vai para o cabeçalho corrente |
| `h2` / `h3` | `text` | nunca dois títulos seguidos; o motor não deixa título sozinho no fim da página |
| `p` | `text` | uma ideia por parágrafo, até ~160 palavras; parágrafos longos são divididos entre páginas |
| `lead` | `text` | abertura avulsa, raro fora do capítulo |
| `list` | `items`, `ordered` | 3 a 7 itens paralelos, até 3 linhas cada |
| `checklist` | `items` | até 12 itens que o leitor executa |
| `steps` | `items[{title, text, figure}]` | ordem importa; `title` começa com verbo; `figure` opcional por passo |
| `callout` | `kind` (`dica`, `atencao`, `exemplo`), `text`, `title` | até 280 caracteres; no máximo 1 de atenção a cada 2 páginas |
| `figure` | `key`, `ratio`, `caption`, `width` (4, 5 ou 6 colunas), `main` | `ratio` = largura/altura do arquivo; a legenda diz o que olhar |
| `table` | `head`, `rows`, `cols` (pesos), `align` (`"r"` para números), `note`, `width` | até 6 colunas; `note` traz a fonte |
| `kpis` | `items[{value, label, source}]` | 1 a 3 números com unidade e fonte |
| `quote` | `text`, `author` | fala de terceiro, nunca enfeite |
| `cards` | `items[{eyebrow, title, text}]` | 2 a 4 unidades paralelas e independentes |
| `code` | `text`, `width` | comando, prompt ou trecho curto |
| `pagebreak` | — | só antes de apêndice ou referências |

No máximo dois destaques por página (callout, cards, kpis, quote). O motor conta e o QA avisa.

## Imagens

Cada `figure` sem `node` ou `hash` nasce como "Imagem pendente: <key>" no tamanho exato. A montagem devolve `pendingImages` com o id de cada nó. Envie os arquivos com `upload_assets` (`nodeIds` na mesma ordem, `scaleMode: "FILL"`) e um POST de cada arquivo com o `Content-Type` correto. Depois do envio, o QA deixa de acusar a pendência.

## Documentos longos

Uma chamada aceita cerca de 40 mil caracteres de plano. Acima disso, divida por capítulos: a primeira chamada leva `cover` e os primeiros capítulos; as seguintes repetem `doc` com `resume` igual ao `resume` devolvido pela anterior, e só a última leva `backcover`.

## QA e correção

Corrija no plano e remonte. Cada regra:

| Regra | Correção |
|---|---|
| `Q18 página rala` | menos de 200 palavras numa página de corpo sem figura (120 com figura). Desenvolva os parágrafos com o que a fonte oferece, troque caixas por texto ou junte a página com a vizinha. |
| `Q15 ocupação` | página de corpo abaixo de 88%, ou fim de seção abaixo de 50%. Mova conteúdo entre capítulos, corte o excedente que gerou a página curta, ou use `chapterBreak: "auto"`. Nunca adicione texto de enchimento. |
| `Q16 vazio entre blocos` | bloco grande empurrado para a página seguinte: divida a tabela ou lista, reduza a figura ou mude a ordem de um destaque. |
| `Q17 título no fim da página` | o título ficou sem conteúdo depois dele: confira se há conteúdo entre títulos; o motor já reserva espaço. |
| `Q21 destaques` | mais de 2 destaques na página: transforme um deles em parágrafo ou mova para outra seção. |
| `Q25 figuras` | no máximo 2 figuras por página, numeradas em ordem. |
| `Q02`, `Q07`, `Q09` | texto fora da área, tamanho ou família fora do sistema: sinal de edição manual no Figma ou de falha do motor. Remonte; se persistir, reporte como defeito do sistema. |
| `imagem pendente` | envie a imagem ou decida, com o usuário, retirar a figura. |

Depois do QA limpo, revise um screenshot de cada página e procure o que o script não mede: título que não diz o ponto, sequência confusa, destaque sem função.
