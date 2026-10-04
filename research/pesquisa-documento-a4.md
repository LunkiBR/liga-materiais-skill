# Pesquisa: desenho de documentos A4 de leitura contínua (794 x 1123 px)

Escopo: playbooks, guias, relatórios, perfis e manuais de onboarding da Liga IA UFSCar, exportados para PDF, lidos em tela e às vezes impressos. Estética clara, Clash Display nos títulos, Inter no corpo.

**Convenção.** `[F]` = regra tirada de fonte citada (ver seção 12). `[H]` = heurística minha, derivada das fontes e calculada para este canvas. Quando uma regra mistura as duas, a parte numérica para 794x1123 é `[H]` e a base é `[F]`. Todos os números estão em px do canvas Figma (96 dpi; 1 pt = 1,333 px). Os contrastes foram calculados por mim com a fórmula WCAG.

**Observação sobre o diagnóstico.** O aspecto "documento de Word" vem de três causas: (a) tamanhos e pesos próximos demais entre os níveis, (b) espaços verticais que não obedecem a proximidade (espaço antes de título igual ao depois), (c) blocos destacados usados como enchimento. As regras abaixo atacam as três.

---

## 1. Grid da página

**Geometria base** `[H]`, com apoio em Müller-Brockmann/Lupton (grid modular com baseline) e Butterick (margens maiores que o padrão do processador de texto) `[F]`.

| Item | Valor | Nota |
|---|---|---|
| Página | 794 x 1123 | A4 a 96 dpi |
| Margem esquerda / direita | 64 / 64 | Padrão (tela primeiro). Para impressão duplex: interna 72, externa 56, espelhando páginas pares |
| Margem superior | 76 | Cabeçalho corrente fica dentro dela |
| Margem inferior | 87 | Rodapé fica dentro dela; inferior > superior evita efeito "afundado" `[F]` Butterick (diferença sugerida ~0,25") |
| Área útil | 666 x 960 | x: 64–730; y: 76–1036 |
| Colunas | 6 | largura 91, gutter 24 (6x91 + 5x24 = 666) |
| Unidade de ritmo | 4 | todo espaço vertical e todo padding é múltiplo de 4 |
| Linha de corpo | 20 | 960 / 20 = 48 linhas por página |
| Módulos verticais | 8 | 8 faixas de 120 (6 linhas de corpo cada), úteis para dimensionar figuras e cards: altura = múltiplo de 120 menos o gutter quando houver empilhamento |

O baseline de 4 px é uma disciplina de múltiplos, não um bloqueio rígido linha a linha: o Figma não prende texto ao baseline, então o agente deve garantir que alturas de bloco e espaços sejam múltiplos de 4 `[H]`.

**Colunas de texto e largura** `[H]`. Inter a 14 px tem avanço médio de ~7,4 px, logo:

| Layout | Largura | Caracteres/linha | Uso |
|---|---|---|---|
| Texto 4 col | 436 | ~59 | padrão da página de corpo |
| Lateral 2 col | 206 | ~28 | marginália: notas, definições, legenda lateral, número em destaque. Texto 12–13 px |
| 5 col | 551 | ~74 | só texto de abertura (lead) ou passo a passo com figura abaixo; limite superior |
| 6 col (666) | 666 | ~90 | proibido para texto corrido de 14 px. Permitido para figuras, tabelas, callouts largos, código |
| 2 colunas de texto | 321 cada (3 col + gutter 24 + 3 col) | ~47 a 13 px, ~43 a 14 px | só com corpo 13 px, alinhado à esquerda, para glossário, listas curtas e referências. Nunca para argumentação contínua |

Base: 45–75 caracteres para coluna única `[F]` Bringhurst; 40–50 para múltiplas colunas `[F]` Bringhurst; 45–90 `[F]` Butterick; máximo 75 `[F]` GOV.UK; máximo 80 `[F]` WCAG 1.4.8. Alvo operacional: 50–70 caracteres, tolerância 45–75 `[H]`.

**Quando usar cada layout** `[H]`:
- **Coluna de texto 4 col + lateral 2 col** (padrão): quando há notas, definições, números ou legendas que enriquecem o parágrafo sem interromper a leitura. Segue o princípio de notas marginais de Tufte (informação relacionada "o mais perto possível" do texto, fora do caminho do olho) `[F]`.
- **Coluna única 4 col centrada à esquerda e 2 col vazias**: proibido, vira "miolo pequeno isolado". Se não há conteúdo lateral, usar 5 col ou colocar uma figura/callout nas 2 col restantes, ou então expandir a figura/tabela para 6 col.
- **6 col** apenas para o elemento largo da vez; o texto vizinho continua em 4 col, alinhado à esquerda.
- **Alinhamento do texto**: esquerda, sem justificar. Justificar exige hifenização e motor profissional; navegadores e Figma ficam "grosseiros" `[F]` Butterick; WCAG 1.4.8 pede texto não justificado `[F]`.
- A página de corpo não deve ter mais de 2 larguras de elemento (436 e 666, ou 436 e 206).

**Referência clássica** `[F]`: o cânone Van de Graaf/Tschichold usa margens 1:1:2:3 (interna:superior:externa:inferior) e área de texto de proporção igual à do papel. Aplicado a A4 daria margens ~88/88/176/265, caro demais para material denso de onboarding. Mantemos só a ideia: inferior ≥ superior e mancha proporcional.

---

## 2. Tipografia de leitura contínua

**Tamanho do corpo.** Impresso: 10–12 pt (13,3–16 px) `[F]` Butterick; Inter tem x-height alta, então 14 px (10,5 pt) lê como 11 pt de uma fonte comum `[H]`. Corpo 14 px é o padrão; 13 px só em contexto secundário; abaixo de 12 px nunca para texto corrido.

**Entrelinha.** 120–145% do tamanho `[F]` Butterick; GOV.UK usa múltiplos de 5 px para o ritmo vertical (19/25, 16/20) `[F]`; Material body-medium 14/20 `[F]` parcial (confirmado: body-medium 1rem/1,5rem na versão web; 14/20 na especificação M3). WCAG 1.4.12 pede tolerância a 1,5x, não obrigação visual `[F]`. Escolha: 14/20 (143%) `[H]`.

**Escala tipográfica** (cada nível se distingue por ao menos dois eixos: tamanho, peso, família, caixa, cor) `[H]`:

| Estilo | Fonte | Peso | Tam/Linha | Tracking | Cor | Espaço antes | Espaço depois |
|---|---|---|---|---|---|---|---|
| Título de capa | Clash Display | 600 | 56/60 | -1% | #0C1854 | n/a | n/a |
| H1 (capítulo) | Clash Display | 600 | 36/40 | -0,5% | #0C1854 | 0 (topo de página) | 16 |
| H2 | Clash Display | 600 | 24/28 | 0 | #0C1854 | 40 | 12 |
| H3 | Inter | 600 | 16/24 | 0 | #0C1854 | 28 | 8 |
| Eyebrow | Inter | 600 | 10/12, caixa alta | +8% | #3A46A0 | n/a | 8 |
| Lead (abertura) | Inter | 400 | 18/28 | 0 | #060A1B | 0 | 20 |
| Corpo | Inter | 400 | 14/20 | 0 | #060A1B | 0 | 12 |
| Corpo lateral / secundário | Inter | 400 | 13/20 | 0 | #4A5270 | 0 | 8 |
| Célula de tabela | Inter | 400 | 12/16 | 0 | #060A1B | n/a | n/a |
| Cabeçalho de tabela | Inter | 600 | 11/16, caixa alta | +6% | #0C1854 | n/a | n/a |
| Legenda de figura | Inter | 400 | 12/16 | 0 | #4A5270 | 8 | 24 |
| Nota / rodapé de texto | Inter | 400 | 11/16 | 0 | #4A5270 | 4 | 4 |
| Cabeçalho/rodapé corrente | Inter | 500 | 9/12, caixa alta | +8% | #4A5270 | n/a | n/a |

Fundamentos: uma escala limitada e relacionada, em vez de tamanhos arbitrários `[F]` Bringhurst (webtypography 3.1.1); no máximo 3 níveis de título, 2 é melhor `[F]` Butterick; títulos sem caixa alta longa e sem sublinhado `[F]`; caixa alta só em rótulos curtos, com 5–12% de espaçamento entre letras `[F]` Butterick. Razão H1:H2:H3:corpo = 36:24:16:14, passos de ~1,5x e ~1,15x, mais variação de família e peso. Isso é o que quebra a monotonia "Word" `[H]`. Quatro níveis visíveis no máximo por página (H1/H2/H3/eyebrow); H4 não existe, usar corpo em 600 `[H]`.

**Proximidade** `[F]` NN/g (itens próximos formam grupo) e Butterick (espaço acima e abaixo é a forma mais sutil de dar ênfase): espaço antes do título ≥ 2x o espaço depois (40/12, 28/8). Um título nunca fica mais perto do bloco anterior do que do seguinte.

**Parágrafos** `[F]` Butterick: recuo de primeira linha OU espaço entre parágrafos, nunca os dois; espaço de 4–10 pt ou 50–100% do corpo. Escolha: sem recuo, espaço 12 px (86% de 14) `[H]`. Para texto de ficção ou memória longa, alternativa: recuo 14 px e espaço 0.

**Listas** `[H]`:
- recuo 20 (marcador em coluna de 20, texto com recuo pendente);
- marcador: círculo 5 px na cor de acento #4B63CE, ou número Inter 600 em tabular-nums, mesma cor;
- espaço entre itens: 4 (itens de 1 linha), 8 (itens de 2 ou mais linhas); espaço antes e depois da lista: 12;
- 3 a 7 itens por lista; mais que isso vira tabela ou subgrupos; um item raramente passa de 3 linhas;
- itens paralelos (todos começam pela mesma classe gramatical).

**Tabelas** `[F]` Butterick (desligar bordas por padrão e religar só se preciso; padding crescente) + `[H]`:
- célula 12/16, padding 8 vertical e 12 horizontal (altura mínima de linha 32);
- linhas: filete horizontal 1 px #D9E0EE entre linhas, 1,5 px #0C1854 sob o cabeçalho; sem bordas verticais;
- zebra (#F5F8FD) só com mais de 8 linhas; nunca zebra com filetes ao mesmo tempo;
- texto à esquerda; números à direita com tabular-nums e o mesmo alinhamento no cabeçalho da coluna `[H]`; Butterick observa que fontes proporcionais já trazem tabular figures `[F]`;
- máximo 6 colunas em 666 px, 4 em 436; coluna ≥ 80 px; sem células mescladas sem necessidade;
- cabeçalho repetido ao quebrar de página, mínimo 2 linhas de dados em cada lado.

**Citações** `[F]` Butterick: citação em bloco reduz levemente tamanho e entrelinha, tem recuo, dispensa aspas e deve ser rara (leitores a tratam como trecho "longo e chato" a pular). Escolha `[H]`: citação de bloco Inter 16/24, recuo 20, barra esquerda 3 px #4B63CE, atribuição 12/16 em #4A5270. Pull quote opcional em Clash 22/32, peso 500, 4 col, no máximo 1 por 3 páginas.

**Código** `[F]` Butterick: monoespaçada só para código; evitar no corpo `[F]`. `[H]`: inline em JetBrains Mono/mono equivalente 12,5 px, fundo #EEF3FB, padding 1/4, raio 4, cor #0C1854. Bloco: mono 12/20, padding 12/16, raio 8, fundo #F5F8FD, borda 1 px #D9E0EE, largura 436 (~56 caracteres) ou 666 (~88); quebra de linha com recuo, sem barra de rolagem; comando com `$` não selecionável não precisa; no máximo 1 bloco longo (>10 linhas) por página.

**Ênfase** `[F]` Butterick: negrito OU itálico, nunca os dois; nunca sublinhado; em sans, preferir negrito a itálico. Negrito (600) em no máximo 1 expressão por parágrafo e 3 por página `[H]`.

**Hifenização** `[F]`: mínimo 2 caracteres antes e 3 depois da quebra (webtypography 2.4.1); sem hifenização em títulos `[F]` Butterick. Em ragged-right, o agente deve evitar linha final com palavra única (NBSP entre as 2 últimas palavras) `[H]`.

---

## 3. Ritmo, densidade e fluxo

**Palavras por página** `[H]`. Coluna de 4 col, 59 caracteres, ~9,5 palavras em português por linha, 48 linhas = ~450 palavras para uma página de texto puro sem títulos. Com títulos, listas e espaços: página de corpo típica 280–380 palavras; com figura grande, 120–200; página só de tabela, 150–250 palavras de célula. Menos de 100 palavras só em capa, abertura, divisor, citação, contracapa ou página de figura inteira.

**Ocupação.** Ocupação vertical = (base do último bloco da página - 76) / 960. Metas `[H]` (compatível com o AGENTS.md do projeto: miolo pequeno isolado é defeito):
- páginas de corpo, passo a passo, checklist, tabela: ≥ 0,88;
- última página de uma seção: ≥ 0,50, ou ≥ 0,35 se for a última do documento;
- nenhum vazio contínuo ≥ 120 px (6 linhas) dentro da área útil, exceto antes de quebra de seção forçada, onde o vazio máximo é 25% da página.

**Controle de quebra** `[F]` Butterick (viúvas e órfãs; o custo é "linhas em branco no rodapé", que ele considera normal quando poucas) + `[H]` numérico:

| Regra | Valor |
|---|---|
| Órfã/viúva de parágrafo | mínimo 2 linhas de cada lado |
| Título + conteúdo | título (H2/H3) + ≥ 3 linhas ou o primeiro item/figura inteira: se o espaço restante < 40 + 28 + 60 = ~130, o título vai à página seguinte |
| Legenda | sempre colada à figura, mesmo contêiner |
| Callout, card, passo numerado, citação, KPI | indivisíveis |
| Lista | ≥ 2 itens de cada lado |
| Tabela | ≥ 2 linhas de dados + cabeçalho repetido |
| Tabela ≤ 8 linhas | indivisível |

**Fluxo** `[H]`. Empilhar blocos na ordem de origem. Se sobrar < 130 px, aplicar na ordem: (1) trocar a posição de um bloco flutuante (figura, callout, KPI) com o texto adjacente se isso não alterar a ordem lógica; (2) ajustar altura de figura entre 85% e 100% da largura planejada; (3) subir espaço de parágrafo de 12 até 16 e espaço de seção de 40 até 56; (4) dividir lista/tabela respeitando o mínimo; (5) mover o bloco inteiro e recompor as páginas anteriores. Nunca esticar corpo ou entrelinha fora de 14/20; nunca criar conteúdo só para ocupar espaço.

**Nova página** `[H]`:
- H1 (capítulo) começa em página nova se o documento tem ≥ 8 páginas; a abertura é integrada (eyebrow, H1, lead e já o início do texto), ocupando 200–280 px do topo;
- página de abertura inteira (divisor) só em documentos ≥ 24 páginas ou ao separar partes;
- H2 nunca força página nova; só vai à página seguinte pela regra do título + conteúdo;
- apêndices, glossário, referências começam em página nova;
- evitar mais de 1 quebra forçada por 6 páginas.

---

## 4. Tipos de página

Alvo comum: 6 colunas, margens da seção 1, no máximo 1 elemento de acento por página além do eyebrow.

| Tipo | Estrutura | Hierarquia | Nunca |
|---|---|---|---|
| **Capa** | Eyebrow + título 56/60 (máx. 3 linhas, 14-22 caracteres por linha, 4 col) + subtítulo 18/28 + faixa de metadados (data, versão, autoria) 11 px + logotipo; um elemento gráfico em ≤ 40% da página, ancorado na grade | título > metadados > logo | texto centralizado em bloco, foto de banco genérica, mais de 2 pesos de Clash, rodapé corrente |
| **Sumário** | H1 "Sumário" + lista com 2 níveis: capítulo (Clash 18/28 ou Inter 600 16/24) e H2 (14/20) com número de página à direita, preenchimento pontilhado ou linha 1 px #D9E0EE | número de capítulo em acento | mais de 2 níveis, sumário que ocupa só o terço superior, números sem alinhamento tabular à direita |
| **Abertura de capítulo** | Número do capítulo Clash 72/72 em acento, H1, lead 18/28 (2–4 linhas, 5 col), e o começo do texto na mesma página. Opcional: caixa "Neste capítulo" (3–5 itens) na lateral | número > H1 > lead | página inteira só com título, citação decorativa como enchimento |
| **Corpo** | H2, parágrafos, 1 lista, no máximo 1 elemento destacado; lateral opcional com 1–2 notas | H2 > H3 > corpo > lateral | mais de 3 níveis de título, parede de texto sem subtítulos por mais de 1 página inteira, cards como decoração |
| **Passo a passo (tutorial)** | Intro de 1–2 linhas, 3–5 passos numerados; screenshot 4 col sob o passo ou 6 col no fim do bloco; resultado esperado em callout ao final | número do passo (badge) > título do passo > descrição > figura | passo sem verbo de ação; quebrar um passo entre páginas; dois screenshots sem texto entre eles; screenshot menor que 436 px de largura quando contém texto de interface |
| **Checklist** | H2 + intro 1 linha + grupos de 3–7 itens com caixa de seleção 14 px; grupos com H3 | grupo > item | itens com mais de 2 linhas; checklist com mais de 12 itens por página sem grupos; caixas marcadas decorativas |
| **Comparação / tabela** | H2 + frase de leitura ("o que a tabela mostra") + tabela 6 col ou 4 col + nota de fonte 11 px | cabeçalho > primeira coluna > dados | mais de 6 colunas; rolagem; cores de célula sem texto equivalente; legenda longa |
| **Caso / exemplo** | Eyebrow "Caso" + título 16/24 + 3 blocos (contexto, o que foi feito, resultado) com subtítulo em corpo 600; dado de resultado em destaque numérico | título > resultado > descrição | caso sem resultado ou métrica; mais de 1 caso por card; mais de 2 cards por página |
| **Dado em destaque** | Número Clash 56/56 em #4B63CE + rótulo 12/16 + 1 linha de contexto/fonte; 1 a 3 por linha, em 2 col cada (206) | número > rótulo | mais de 3 KPIs por página; números sem unidade, base ou fonte; gráfico 3D |
| **Citação** | Pull quote Clash 22/32 em 4 col, atribuição 12/16, barra 3 px | citação > atribuição | aspas gigantes decorativas; citação isolada ocupando página |
| **Glossário** | 2 colunas de 321 em 13/20 (ou tabela 2 col: termo 600 + definição); ordem alfabética, 1 letra de agrupamento como eyebrow | termo > definição | definição com mais de 3 linhas; termos fora de ordem |
| **Referências** | Lista 12/16 com recuo pendente 20, ordem alfabética ou numérica, URLs com quebra segura | número/autor > título > URL | link sem título; mistura de dois formatos |
| **Contracapa** | Logotipo, contato, versão/licença, 40 palavras no máximo; ancorada na base | logo > contato | texto de marketing longo; página de rodapé corrente |

---

## 5. Componentes editoriais

Raio padrão 8 (raio 12 só em card grande ≥ 4 col); borda 1 px #D9E0EE; sem sombra por padrão (PDF e impressão) `[H]`. Limite por página: **no máximo 2 blocos destacados no total** (callout, card, citação, KPI, tabela com fundo) e **pelo menos 6 linhas (120 px) de corpo entre dois deles** `[H]`; sidebars e figuras não entram nessa contagem, mas figuras têm teto próprio (seção 6).

| Componente | Anatomia | Padding / raio | Fundo / borda | Usar quando | Não usar quando | Máx. |
|---|---|---|---|---|---|---|
| **Callout Dica** | rótulo 10 px caixa alta + ícone 16 + texto 13/20 | 16 x 20 / 8 | #EEF3FB; barra esquerda 3 px #4B63CE | atalho, recomendação que melhora o resultado | informação central do parágrafo (colocar no texto) | 1 por página |
| **Callout Atenção** | ícone de alerta + rótulo "Atenção" + texto 13/20 | 16 x 20 / 8 | #FFF4DC; barra 3 px #B26A00; texto #5C3700 (contraste 7+); rótulo tem de ser texto, nunca só cor | risco de perda de dados, custo, prazo, erro comum | dica comum, ênfase retórica | 1 por 2 páginas |
| **Callout Exemplo** | rótulo "Exemplo" + texto, opcionalmente código | 16 x 20 / 8 | #E6F5F8 (powder claro); barra 3 px #4B63CE | caso concreto curto (≤ 6 linhas) | exemplos longos (virar caso/figura) | 1 por página |
| **Passo numerado** | badge 28 circular #4B63CE, número Inter 600 13 branco (5,28:1); linha vertical 2 px #C4E8ED ligando badges; título 16/24 600; texto 14/20 | recuo do texto 44 (28 + 16); espaço entre passos 24 | sem caixa | sequência em que a ordem importa | lista de itens paralelos sem ordem | 5 por página |
| **Figura + legenda** | imagem + legenda 12/16 colada (8 abaixo) | n/a | borda 1 px #D9E0EE; raio 8 se for screenshot | evidência visual | decoração | ver seção 6 |
| **Tabela** | cabeçalho + linhas | 8 x 12 por célula | ver seção 2 | 3+ atributos comparáveis ou números | 2 colunas de rótulo/valor curtas (usar lista) | 1 por página, 2 se pequenas |
| **Card** | título 16/24, texto 13/20, métrica opcional | 20 / 12 | #FFFFFF com borda 1 px #D9E0EE (ou #F5F8FD) | unidades paralelas e independentes (funções, pessoas, trilhas) | texto contínuo, um item só | até 4 por página, grid 2 x 2 de 321 de largura (3 col cada) |
| **Citação** | barra 3 px + texto + atribuição | recuo 20 | sem fundo | declaração de terceiro | enchimento de espaço | 1 por 2 páginas |
| **Destaque numérico** | número Clash 56/56 acento + rótulo + fonte | 0 / sem caixa, ou 20 / 12 em 2 col | #FFFFFF ou #F5F8FD | 1–3 dados que sustentam o argumento | número sem contexto, mais de 3 | 1 faixa por página |
| **Lista de verificação** | caixa 14 px raio 3, borda 1,5 px #0C1854; item 14/20 | gap 8 | sem fundo | tarefas que o leitor executa | itens descritivos | 12 itens |

Regras gerais `[H]`: callout nunca contém outro callout nem tabela; um callout tem 1 título curto e até 4 linhas de texto (máx. 280 caracteres); callouts empilhados são um sinal de que a página não tem estrutura; em modo impresso em escala de cinza, o rótulo e a barra carregam o tipo, não o tom. Cartões e callouts nunca "salvam" uma página vazia.

---

## 6. Imagens e screenshots

`[H]` salvo indicação.

- **Largura**: 4 col (436) para screenshot com pouco texto de interface; 6 col (666) quando a interface tem texto menor que 12 px no original; 2 col (206) só para ícone, recorte ou miniatura na lateral. Sem larguras intermediárias.
- **Resolução**: exportar a 2x (≥ 1332 px de largura para 666) e ≥ 150 dpi efetivos para impressão (666 px a 150 dpi pede ~1040 px de origem) `[H]`.
- **Borda e sombra**: borda 1 px #D9E0EE, raio 8, sem sombra no PDF (sombras viram cinza sujo na impressão); screenshot com fundo branco sempre leva borda.
- **Altura**: no máximo 45% da área útil (430 px) por figura, 60% (576) se for a figura principal da página; screenshot muito alto é recortado na região relevante, com cortes marcados.
- **Anotação**: realce em retângulo 2 px #4B63CE, raio 4, sem preenchimento (ou preenchimento 12% de acento); marcador numerado 20 px circular acento, número 11 px 600 branco, posicionado fora da área crítica; máximo 5 marcadores por figura; cada número é explicado no texto ou na legenda. Realce em cor semântica só com ícone ou rótulo `[F]` WCAG 1.4.1.
- **Legenda**: 12/16, 8 px abaixo, largura igual à da figura, formato "**Figura 3.** Descrição curta que diz o que olhar." (rótulo em 600 acento). Numeração contínua por documento (Figura 1, 2, 3) ou por capítulo (2.1) se houver mais de 20 figuras. Toda figura é citada no texto antes de aparecer ou na mesma página.
- **Texto alternativo e contraste**: o gráfico precisa de contraste ≥ 3:1 nas partes essenciais `[F]` WCAG 1.4.11; elementos de dado não distinguidos só por cor `[F]` WCAG 1.4.1.
- **Conjuntos**: duas imagens lado a lado só com 321 de largura cada e conteúdo equivalente; mais de 2 imagens por página exige texto entre elas.

---

## 7. Cor em documento claro

Paleta: ink #060A1B (corpo), navy #0C1854 (títulos), acento #4B63CE, powder #C4E8ED, tintas #F5F8FD / #EEF3FB / #E6F5F8, filete #D9E0EE, texto secundário #4A5270.

**Contrastes calculados** (WCAG: 4,5:1 texto normal, 3:1 texto grande ≥ 18 pt ou ≥ 14 pt negrito, ou seja ~24 px / ~18,7 px negrito, 3:1 gráficos `[F]`):

| Par | Razão | Uso |
|---|---|---|
| #060A1B sobre branco | 19,7 | corpo |
| #0C1854 sobre branco | 16,5 | títulos |
| #4B63CE sobre branco | 5,28 | links, números, ícones, eyebrow (use #3A46A0 se for muito pequeno: 8,2) |
| #4B63CE sobre #EEF3FB | 4,74 | ok para texto ≥ 12 px 600 |
| #4B63CE sobre powder #C4E8ED | 4,05 | só texto grande (≥ 18,7 px 600) ou elementos gráficos; nunca texto pequeno |
| #060A1B sobre powder | 15,1 | texto sobre powder deve ser ink ou navy |
| branco sobre #4B63CE | 5,28 | badges, botões |
| #4A5270 sobre branco | 7,7 | legendas, notas |
| #6B7390 sobre branco | 4,7 | limite; não usar abaixo de 12 px |
| #D9E0EE sobre branco | 1,33 | só filete decorativo; nunca carrega informação |

**Proporções** `[H]`: ≥ 90% da área da página branca ou tinta clara; acento #4B63CE ≤ 8% da área e ≤ 3 usos visuais por página (eyebrow, números/badges, 1 componente); powder ≤ 10%, só como fundo de callout/faixa ou filete; sem gradientes no corpo; sem fundo colorido por trás de texto corrido. Texto de corpo sempre ink, nunca cinza: cinza em PDF para impressão "parece sujo" `[F]` Butterick; reserve o #4A5270 para legendas e metadados. Cor de texto no corpo só para links e rótulos; cor não é meio único de ênfase `[F]` Butterick e WCAG 1.4.1.

**Semântica**: atenção em âmbar (#B26A00 sobre #FFF4DC, texto #5C3700), erro em vermelho (#B3261E sobre #FDECEA: 5,72), sucesso em verde só em checklist com ícone. Nunca mais de 1 cor semântica por página; sempre com ícone e rótulo `[F]` WCAG 1.4.1.

**Impressão** `[H]`: fundos de tinta ≤ 8% de opacidade perdem-se em impressoras; não dependa deles, a barra de 3 px e o rótulo carregam o sentido; evitar texto branco em fundos grandes (gasta toner e "knockout" lê mal) `[F]` Butterick; permitir só em badges ≤ 40 px; capa clara sem sangria escura; texto a ≥ 9 px mesmo em rodapés.

---

## 8. Elementos correntes

`[H]`, com base em Butterick (cabeçalho e rodapé de uso discreto, sem repetir o título do capítulo na página de abertura).

| Elemento | Posição | Estilo |
|---|---|---|
| Cabeçalho corrente | texto com linha de base em y = 40; filete 1 px #D9E0EE em y = 52, de x = 64 a 730 | esquerda: título curto do documento; direita: capítulo atual (H1). 9/12 caixa alta +8% #4A5270 |
| Rodapé | linha de base em y = 1063; filete 1 px em y = 1050 | esquerda: "Liga IA UFSCar" ou versão; direita: fólio 10/12 Inter 600 tabular-nums, formato "12" (ou "12 / 24"). Documento > 24 páginas: acrescentar capítulo no rodapé |
| Fólio | contado desde a capa (capa = 1, sem exibir) | nunca 1/N na capa; contracapa sem fólio |
| Marcação de seção | eyebrow acima do H1 com "Capítulo 02" ou "Parte B"; barra 32 x 3 px #4B63CE acima do eyebrow | só em H1; H2 não leva marcador |
| Ausência | capa, contracapa e página de abertura inteira não têm cabeçalho; rodapé aparece em todas as demais | |

O cabeçalho e o rodapé ficam fora da área útil (y < 76 ou y > 1036), nunca dentro. Evitar mais de 3 informações em cada.

---

## 9. Erros que fazem o documento parecer amador (lista checável)

1. Corpo, H2 e H3 com menos de 4 px de diferença entre níveis ou todos no mesmo peso.
2. Mais de 3 níveis de título, ou 4 tamanhos de texto no meio de um mesmo parágrafo.
3. Espaço antes do título igual ao depois (título "flutuando" entre blocos).
4. Texto corrido em 666 px (90 caracteres) ou em 206 px (28 caracteres).
5. Texto justificado sem hifenização, com rios.
6. Página com área útil ocupada em menos de 88% sem ser fim de seção.
7. Miolo pequeno centralizado, com bandas vazias acima e abaixo.
8. Título de seção como última linha da página.
9. Parágrafo com 1 linha isolada no início ou fim de página.
10. Callouts, cards ou citações em toda página, empilhados ou decorativos.
11. Caixa dentro de caixa; sombras com raios diferentes; 3 raios distintos num documento.
12. Listas com marcadores de tamanhos ou cores diferentes, ou recuo irregular.
13. Tabela com bordas em todas as células, ou zebra mais filete.
14. Números de tabela alinhados à esquerda ou sem tabular-nums.
15. Mais de 2 cores de acento, ou texto pequeno em acento sobre powder (4,05:1).
16. Cinza claro em corpo ou legenda abaixo de 4,5:1.
17. Sublinhado para ênfase, negrito + itálico, caixa alta em título longo.
18. Screenshot menor que 436 px com texto ilegível, sem borda ou sem legenda.
19. Legenda separada da figura por quebra de página ou numeração inconsistente.
20. Cabeçalho/rodapé dentro da mancha ou fólio ausente.
21. Folhas de abertura só com um título e 80% de branco.
22. Passos numerados partidos entre páginas, ou numeração reiniciada sem aviso.
23. Hierarquia dependente de cor em vez de tamanho, peso e posição.
24. Ícones decorativos, emojis ou clip-art no lugar de estrutura.
25. Fontes em outra família que Clash/Inter (fallback caiu).

---

## 10. Checklist de QA para script/agente (página a página)

Medições em px do frame 794x1123. "Bloco" = filho direto de nível de conteúdo. Resultado: PASSA/FALHA por item.

**Geometria**
- Q01. Frame = 794 x 1123.
- Q02. Todo bloco de conteúdo está em x ∈ [64, 730] e y ∈ [76, 1036] (tolerância 1 px). Cabeçalho/rodapé ficam fora disso.
- Q03. Bordas esquerdas de blocos alinham a uma das âncoras de coluna: x = 64, 179, 294, 409, 524, 639 (±2); larguras pertencem a {206, 321, 436, 551, 666}.
- Q04. Largura de texto corrido: 436, ou 551 só para lead; nunca 666.
- Q05. Todo espaço vertical entre blocos e todo padding é múltiplo de 4.

**Tipografia**
- Q06. Corpo = 14/20; corpo lateral/secundário ≥ 13 px; célula ≥ 12; legenda ≥ 12; nota ≥ 11; cabeçalho/rodapé ≥ 9; nenhum texto < 9 px.
- Q07. Tamanhos usados ⊂ {9, 10, 11, 12, 13, 14, 16, 18, 24, 36, 56, 72}; qualquer outro é falha.
- Q08. Razão tamanho H2/corpo ≥ 1,6 e H1/H2 ≥ 1,4; H3 ≥ corpo + 2 px ou peso 600.
- Q09. No máximo 4 estilos de título/rótulo diferentes e 2 famílias (Clash, Inter) mais a mono do código por página.
- Q10. Entrelinha/corpo ∈ [1,20; 1,50].
- Q11. Caracteres por linha (medir a linha mais longa de cada parágrafo de corpo): 45–75 para texto corrido; abaixo de 40 só na lateral.
- Q12. Espaço antes de título ≥ 2x o depois; espaço depois de título ≤ 16 px; espaço entre parágrafos 12 (±4); nenhum recuo de primeira linha combinado com espaço.
- Q13. Texto sem justificação; sem sublinhado; nenhum parágrafo com negrito > 1 expressão.
- Q14. Última linha de parágrafo com ≥ 2 palavras ou ≥ 8 caracteres; parágrafo com 1 linha isolada no topo ou rodapé: falha.

**Ocupação e ritmo**
- Q15. Ocupação = (y máximo - 76) / 960 ≥ 0,88 em páginas de corpo; ≥ 0,50 na última de uma seção; ≥ 0,35 na última do documento.
- Q16. Menor altura livre contínua entre blocos adjacentes ≤ 80 px (exceto fim de seção, ≤ 25% da página).
- Q17. Nenhum título é o último bloco de uma página; título seguido de ≥ 3 linhas (ou bloco inteiro) na mesma página.
- Q18. Cada página tem ≥ 120 palavras (exceto capa, abertura, divisor, citação, contracapa, figura inteira); páginas de corpo tipicamente 280–380.
- Q19. Primeiro bloco de conteúdo de uma página que não seja capa/abertura começa em y ≤ 76 + 24.
- Q20. Nenhum bloco estreito (< 436) centralizado horizontalmente com bandas vazias > 100 px em ambos os lados (detecta "miolo isolado").

**Componentes**
- Q21. Blocos destacados (callout, card, citação, KPI, pull quote) ≤ 2 por página; ≥ 120 px de corpo entre dois deles; ≤ 1 callout de atenção por 2 páginas.
- Q22. Callout: padding 16/20, raio 8, barra de 3 px, rótulo em texto, ≤ 280 caracteres.
- Q23. Passo numerado: badge 28, texto com recuo 44, gap 24; ≤ 5 por página; numeração contínua e sem lacunas.
- Q24. Tabela: padding 8/12, ≤ 6 colunas, linha ≥ 32, cabeçalho em 600, números à direita, sem bordas verticais, zebra só com > 8 linhas.
- Q25. Figura: largura ∈ {206, 321, 436, 551, 666}; altura ≤ 430 (≤ 576 se principal); ≤ 2 figuras por página (3 se uma delas é ícone/miniatura); legenda 12/16 a 8 px, mesma largura; numeração crescente sem saltos; ≤ 5 marcadores por figura.
- Q26. Lista: 3–7 itens, recuo 20, marcador de um único estilo.
- Q27. Raios distintos no documento ≤ 3 {4, 8, 12}; sem sombras.

**Cor e acessibilidade**
- Q28. Todo par texto/fundo ≥ 4,5:1 (≥ 3:1 apenas para texto ≥ 24 px ou ≥ 18,7 px negrito); texto sobre powder só ink/navy.
- Q29. Texto de corpo = #060A1B; legendas/notas ≥ 4,5:1 (use #4A5270).
- Q30. Área de acento ≤ 8% da página; ≤ 1 cor semântica por página, sempre com ícone e rótulo.
- Q31. Fundos coloridos cobrem ≤ 25% da página; texto branco apenas em badges.

**Elementos correntes**
- Q32. Cabeçalho (y 40) e rodapé (y 1063) presentes em todas as páginas exceto capa, contracapa e abertura inteira; fólio sequencial, Inter 600 10 px, alinhado à direita em x = 730.
- Q33. Sumário: números de página corretos e alinhados à direita.

**Mapa**
- Q34. Cada página final tem uma linha no mapa página -> template -> conteúdo de origem (regra do AGENTS.md).

---

## 11. Pesquisa não coberta ou com lacunas declaradas

- Não consegui abrir o texto de Bringhurst nem de Müller-Brockmann (livros); as regras vêm de resumos secundários (webtypography.net, que implementa Bringhurst). As medidas de margem, grid e baseline de 794x1123 são `[H]`.
- Material Design 3: confirmei apenas parte da escala (body-medium 1rem/1,5rem em material-web.dev); 14/20 e 12/16 vêm do conhecimento da especificação M3 e estão marcados como referência parcial.
- Não encontrei guia de design de relatório de consultorias específicas com números públicos; a parte de componentes (seções 4 e 5) é `[H]`, informada por NN/g (padrões de leitura "layer-cake") e Tufte (notas marginais).
- O guia do British Dyslexia Association e a RNIB não carregaram; os números de acessibilidade usados vêm das páginas WCAG.

---

## 12. Fontes

- S1 Butterick, tamanho do corpo: https://practicaltypography.com/point-size.html
- S2 Butterick, comprimento de linha: https://practicaltypography.com/line-length.html
- S3 Butterick, entrelinha: https://practicaltypography.com/line-spacing.html
- S4 Butterick, espaço entre parágrafos: https://practicaltypography.com/space-between-paragraphs.html
- S5 Butterick, recuo de primeira linha: https://practicaltypography.com/first-line-indents.html
- S6 Butterick, títulos: https://practicaltypography.com/headings.html
- S7 Butterick, margens: https://practicaltypography.com/page-margins.html
- S8 Butterick, viúvas e órfãs: https://practicaltypography.com/widow-and-orphan-control.html
- S9 Butterick, tabelas: https://practicaltypography.com/tables.html
- S10 Butterick, citações em bloco: https://practicaltypography.com/block-quotations.html
- S11 Butterick, texto justificado: https://practicaltypography.com/justified-text.html
- S12 Butterick, cor: https://practicaltypography.com/color.html
- S13 Butterick, espaçamento de letras: https://practicaltypography.com/letterspacing.html
- S14 Butterick, negrito e itálico: https://practicaltypography.com/bold-or-italic.html
- S15 Butterick, sublinhado: https://practicaltypography.com/underlining.html
- S16 Butterick, fontes monoespaçadas: https://practicaltypography.com/monospaced-fonts.html
- S17 Butterick, texto centralizado: https://practicaltypography.com/centered-text.html
- S18 Bringhurst via webtypography.net, medida: https://webtypography.net/2.1.2
- S19 Bringhurst via webtypography.net, escala: https://webtypography.net/3.1.1
- S20 Bringhurst via webtypography.net, hifenização: https://webtypography.net/2.4.1
- S21 Canons of page construction (Van de Graaf/Tschichold): https://en.wikipedia.org/wiki/Canons_of_page_construction
- S22 GOV.UK, escala tipográfica: https://design-system.service.gov.uk/styles/type-scale
- S23 GOV.UK Design Notes, 75 caracteres: https://designnotes.blog.gov.uk/2015/09/16/tips-for-creating-good-typography
- S24 Material Web, tipografia: https://material-web.dev/theming/typography
- S25 WCAG 2.2, 1.4.3 Contraste mínimo: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- S26 WCAG 2.2, 1.4.8 Apresentação visual: https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
- S27 WCAG 2.2, 1.4.12 Espaçamento de texto: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- S28 WCAG 2.2, 1.4.11 Contraste não textual: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- S29 WCAG 2.2, 1.4.1 Uso de cor: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- S30 NN/g, proximidade: https://www.nngroup.com/articles/gestalt-proximity/
- S31 NN/g, padrões de leitura (layer-cake): https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/
- S32 NN/g, padrão F: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- S33 Tufte CSS (notas marginais, CSS): https://edwardtufte.github.io/tufte-css/ e https://raw.githubusercontent.com/edwardtufte/tufte-css/gh-pages/tufte.css
- S34 WebAIM, fontes: https://webaim.org/techniques/fonts/
