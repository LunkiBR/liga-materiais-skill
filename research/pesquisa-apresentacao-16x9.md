# Como desenhar apresentações 16:9 em estrutura e hierarquia (Liga IA UFSCar, canvas 1920 x 1080)

Relatório de pesquisa para o agente que monta decks no Figma. Cada regra é marcada **[F]** (vem de fonte citada, número da seção 12) ou **[H]** (heurística derivada por mim a partir das fontes; ajustável). Regras [H] foram calibradas contra a paleta da Liga: razões de contraste foram calculadas pela fórmula WCAG de luminância relativa.

Limite honesto das fontes: Duarte, Reynolds, Tufte e Minto dão princípios, quase nunca números. Os números 1920x1080 abaixo vêm de (a) guias numéricos de consultoria e de tipografia de apresentação [F], (b) WCAG [F] e (c) conversão e extrapolação minha [H].

---

## 1. Decisão de modo: projetar (P) vs. ler (L)

Fontes: Duarte define slidedoc como "documento visual" feito em software de slides, para pré-leitura, leave-behind e comunicação assíncrona, sem apresentador [F]. Reynolds defende que "slides são slides, documentos são documentos" e que o híbrido (slideument) falha nos dois usos porque a plateia lê e ouve ao mesmo tempo [F]. Tufte defende documentos densos para conteúdo técnico [F]. Duarte propõe o teste de 3 segundos (glance test) para slides projetados; a regra é mais forte para plateias grandes e menos para decks de mesa de reunião [F].

**Regra-mãe [H]:** nunca misture os modos no mesmo arquivo. Se o conteúdo precisa dos dois usos, gere dois decks (P enxuto + L completo), ambos com o mesmo grid e tokens.

| Critério | P (projetar, aula/reunião ao vivo) | L (slidedoc, enviado para leitura) |
|---|---|---|
| Quem explica | Voz do apresentador carrega o detalhe [F] | O slide se explica sozinho [F] |
| Teste de entendimento | 3 s para o ponto principal [F] | 10 s para o ponto, 45–60 s para o slide inteiro [H] |
| Palavras por slide (excl. título/rodapé) | 0–35; ideal 10–25 [H] | 60–150; máx. 200 [H] (leitura silenciosa adulta ≈ 238 wpm em não-ficção [F]; 200 palavras ≈ 50 s) |
| Slides por minuto | 1 slide por 1–2 min; transições rápidas só em statements [F/H] | Sem tempo; 1 ideia por slide, 8–20 slides total [H] |
| Corpo mínimo | 32 px (alvo 36–44) | 22 px (alvo 24–28) |
| Fonte/rodapé mínima | 22 px | 16 px |
| Elementos de texto/slide | ≤ 4 blocos | ≤ 6 blocos |
| Título | Action title curto, ≤ 12 palavras | Action title completo, ≤ 15 palavras, 2 linhas [F] |

**Como o agente decide [H]** (ordem de avaliação, primeiro que casar vence):
1. Brief diz "enviar", "pré-leitura", "sem apresentador", "relatório", "PDF" -> **L**.
2. Brief diz "aula", "reunião", "projetar", "pitch", "palestra", "workshop" -> **P**.
3. Contexto bruto tem muitas frases explicativas, tabelas, números com fonte e o brief não cita apresentador -> **L**.
4. Dúvida real -> **P** e oferecer L como segundo arquivo. Nunca decida "meio termo".
5. Sinalize o modo no nome do deck e em um token (`mode=P|L`), pois todas as checagens de tamanho dependem dele.

---

## 2. Estrutura narrativa

### 2.1 Princípios
- **Pirâmide de Minto:** resposta/mensagem principal primeiro, 3 a 4 argumentos de apoio, dados no terceiro nível [F]. Frases-título formam a espinha argumentativa.
- **Action title:** título = conclusão do slide, frase curta e específica, voz ativa, idealmente com número; máx. 15 palavras e 2 linhas; se não cabe, o slide tem duas ideias e deve ser dividido [F, fontes de prática de consultoria]. Teste: ler só os títulos deve contar a história inteira [F].
- **Uma ideia por slide** e um ponto de ênfase por slide [F: Duarte, Reynolds]. Duarte planeja uma ideia por post-it = um slide [F].
- **Ghost deck / storyline antes do design** [F: prática de consultoria; Duarte também recomenda planejar com notas antes de abrir o software]. O agente deve gerar primeiro a lista de títulos, validá-la, e só então escolher layouts.
- **Arco "o que é" -> "o que poderia ser"** alternando, terminando em chamada à ação (Duarte, Resonate) [F]. Útil em decks P persuasivos.
- **Densidade por slide em consultoria:** 2 a 4 pontos de apoio, 1 exibição principal [F].

### 2.2 Esqueleto canônico (ordem dos slides)

| # | Bloco | Obrigatório? | Regra |
|---|---|---|---|
| 1 | Capa | sim | Título do deck (tema ou conclusão), subtítulo, data, autor/Liga. 1 slide. |
| 2 | Resumo executivo / "a resposta" | L: sim; P: opcional | A conclusão e 3 argumentos antes do detalhe (Minto) [F]. |
| 3 | Agenda | só se ≥ 15 slides ou ≥ 4 seções | 3–5 itens, numerados. Reaparece como marcador nas aberturas de seção (não repetir tela cheia). [H] |
| 4 | Seções (divisor + 3–7 slides de conteúdo) | sim | Cada seção = 1 mensagem; divisor com número + título-conclusão. [H] |
| 5 | Resumo / conclusões | sim | Repete os action titles principais (≤ 4). [H] |
| 6 | Próximos passos / CTA | sim em decks de decisão/ação | ≤ 3 ações, cada uma com responsável e prazo. [H] |
| 7 | Encerramento | sim | Contato/QR/obrigado. 1 slide, sem conteúdo novo. [H] |
| – | Apêndice | opcional | Após o encerramento, marcado "Apêndice". [H] |

### 2.3 Dimensionamento [H, ancorado em F]
Referências: Kawasaki 10 slides / 20 min (1 slide a cada 2 min) [F]; consultoria ≤ 60 s por slide [F, fonte de prática]; Duarte mostrou 180 slides em 40 min, ou seja, não existe número único [F].
- Conteúdo P: ~1 slide de conteúdo por minuto de fala em slides leves; 1 por 2 min em slides com gráfico. Aula de 50 min: 20–30 slides de conteúdo. Pitch de 10 min: 6–10.
- Conteúdo L: 1 slide por ideia; deck de 10–20 slides; > 25 exige resumo executivo e agenda.
- Seções: 3–5 por deck; 3–7 slides por seção. Nunca seção com 1 slide.
- Mínimo: 1 slide de conteúdo por item da agenda.

---

## 3. Grid para 1920 x 1080

| Parâmetro | Valor | Origem |
|---|---|---|
| Zona de segurança (margem externa) | **120 px** esquerda/direita; **72 px** topo; **72 px** base | [H]; tvOS recomenda 60 pt de margem em 1920x1080 [F]; 120 px = 6,25% da largura, boa para projetor que corta bordas |
| Área viva | 1680 x 936 (x 120–1800; y 72–1008) | [H] |
| Colunas | **12** | [H] |
| Gutter | **24 px** | [H] |
| Largura de coluna | **118 px** ((1680 − 11×24)/12) | [H], aritmética |
| Unidade de espaçamento | múltiplos de **8 px** (8, 16, 24, 32, 48, 64, 96) | [H] |
| Zona de título | y 72–216 (até 2 linhas); subtítulo/lead opcional y 224–264 | [H] |
| Zona de conteúdo | y **264–936** (672 px de altura) | [H] |
| Zona de rodapé | y **960–1008** (48 px): fonte à esquerda, seção ao centro/esquerda, nº do slide à direita | [H]; "números de página em todos os slides" e fonte no rodapé [F, consultoria] |
| Respiro mínimo entre título e conteúdo | 48 px | [H] |

Spans canônicos de 12 colunas: 12 (cheio); 8+4 (texto + destaque); 6+6 (duas colunas/comparação); 4+4+4 (3 cards); 3+3+3+3 (4 cards); 7+5 (imagem + texto). Largura de texto corrido: 5–8 colunas (≈ 650–1000 px), nunca 12 colunas de parágrafo [H].

Alinhamento:
1. Todos os textos de uma coluna alinham à mesma borda esquerda (alinhamento é um dos 4 princípios de Reynolds: contraste, repetição, alinhamento, proximidade) [F].
2. Título sempre na mesma posição (x=120, y=72) nos slides de conteúdo; só capas, dividers e statements saem da regra [H, consistência; consultoria exige título e corpo alinhados em todo o deck] [F].
3. Proximidade: espaço entre grupos ≥ 2× o espaço dentro do grupo (ex.: 16 dentro, 48 entre) [H].
4. Tudo dentro da área viva; elementos decorativos/fundos podem sangrar [H].
5. Espaço vazio: ocupação de conteúdo ≤ ~65% da área viva em P; ≤ ~80% em L. "Subtraia, não adicione" [F: Reynolds]; clutter é falha de design [F: Duarte]. [H para as porcentagens].

---

## 4. Tipografia

Famílias: Clash Display (títulos, números, statements) + Inter (corpo, rótulos, fonte). Máx. **2 famílias** [F]. Pesos: Clash 500–600; Inter 400 corpo, 500–600 ênfase; evitar pesos < 400 em projeção (traço fino some em projetor) [H; tvOS recomenda medium/semibold mínimo em tela de sala] [F].

### 4.1 Escala (px em 1920x1080)

| Nível | Fonte | P (projetar) | L (ler) | Linhas máx. | Entrelinha | Tracking |
|---|---|---|---|---|---|---|
| Título de capa | Clash | 120–144 | 96–120 | 3 | 1.0–1.05 | −2% |
| Divisor de seção (título) | Clash | 96–120 | 80–96 | 2 | 1.05 | −2% |
| Numeral de seção / dado gigante | Clash | 240–320 | 160–240 | 1 | 1.0 | −3% |
| Statement | Clash | 88–112 | 72–88 | 4 | 1.1 | −1% |
| **Título de slide (action title)** | Clash | **56–64** | **44–52** | 2 | 1.1–1.15 | −1% |
| Subtítulo / lead | Inter 400–500 | 36–40 | 28–32 | 2 | 1.3 | 0 |
| **Corpo** | Inter | **36–44 (mín. 32)** | **24–28 (mín. 22)** | P: 6 / L: 12 por bloco | 1.35–1.5 | 0 |
| Título de card | Inter 600 / Clash | 32–36 | 26–28 | 2 | 1.2 | 0 |
| Rótulo/chip/legenda de gráfico | Inter 500–600 | 24–28 (mín. 24) | 18–20 (mín. 16) | 1–2 | 1.25 | +0% (CAIXA ALTA: +6–10%) |
| Legenda de imagem/anotação | Inter 400–500 | 24–28 | 18–20 | 2 | 1.3 | 0 |
| Fonte / rodapé / nº | Inter 400–500 | 22 (mín. 22) | 16–18 (mín. 16) | 1 | 1.2 | +2% |

Justificativa dos números:
- Prática de apresentação: título ≥ 28 pt, corpo mín. 12 pt e alvo 16 pt+ em slide comercial de 540 pt de altura; em keynote, corpo mín. 28 pt e alvo 48 pt+; alturas de linha ~4% (título), ~2% (corpo) da altura do slide; keynote ~6,5% [F, BrightCarbon]. Convertido a 1080 px (×2): corpo de 24–32 px em slides densos e 56+ px em keynote. Kawasaki: mín. 30 pt [F] (= 60 px; extremo, para pitch).
- Regra da distância: texto com altura ≥ 1/50 da altura da tela é legível até 8× a altura da tela [F, fonte de projeção] -> 1080/50 = 21,6 px, daí o piso de **22 px** para a menor fonte em P [H].
- Para L: tela de leitura, texto ≥ 10 pt em documento ou 12 pt em slide [F, BrightCarbon] -> 20–24 px na prática com pixel 1:1; escolhi 22 px de piso de corpo [H].
- WCAG: "texto grande" começa em 18 pt (24 px) ou 14 pt negrito (≈ 18,7 px) e exige 3:1; abaixo disso 4,5:1 [F].
- Entrelinha ≥ 1.5 como base de legibilidade em leitura [F: WCAG 1.4.12 define 1.5 como valor tolerado]; títulos display apertam para ≤ 1.15 [H].

Hierarquia:
1. Razão entre níveis adjacentes ≥ **1.25** e título ÷ corpo ≥ **1.5** [H].
2. Máx. **4 tamanhos distintos** por slide (incluindo rodapé) [H].
3. Uma única peça com maior destaque por slide (ponto focal) [F: Reynolds; Duarte "contraste e whitespace para enfatizar"].
4. Não substitua hierarquia por caixa-alta, itálico e sublinhado juntos; escolha 1 meio (tamanho, peso ou cor) por salto [H].
5. Alinhamento à esquerda; centralizado só em capa, divisor, statement, big number e citação [H].
6. Texto corrido: 45–75 caracteres por linha em L (corpo 24–28 px -> bloco de 5–7 colunas); em P, linhas curtas (≤ 40 caracteres) [H].
7. Evite viúvas: última linha com ≥ 2 palavras; balanceie títulos [H].

Limites de texto por slide: ver seção 1 (P: ≤ 35 palavras e ≤ 4 blocos; L: ≤ 150–200 palavras, ≤ 6 blocos). Bullets: P ≤ 4, cada ≤ 8 palavras; L ≤ 6, cada ≤ 20 palavras; consultoria usa até 4, preferencialmente 3 [F]. Um nível de bullet só; nunca sub-bullets [H; Tufte critica a hierarquia de bullets que separa causa de efeito] [F].

---

## 5. Layouts canônicos: anatomia e erros

Convenção: zonas T (título), C (conteúdo), R (rodapé). Fundo: L = claro; N = navy. Limites valem para modo P; em L multiplique elementos por ~1.5.

| Layout | Fundo | Anatomia (1920x1080) | Erros típicos |
|---|---|---|---|
| **Capa** | N ou claro com bloco navy | Título 120–144 px (≤ 8 palavras, ≤ 3 linhas) em x=120, ancorado à base ou ao centro vertical; subtítulo 36 px; linha com data/autor/Liga 24 px; logo 120–200 px de largura em canto; 1 elemento gráfico de marca. Sem nº de página. | Título longo; texto + logo + imagem competindo; subtítulo > 2 linhas. |
| **Agenda** | claro | T: "Hoje: 4 blocos em 40 min" (action title). C: 3–5 itens numerados, número Clash 64–96 px + título 36–40 px + (opcional) 1 linha 28 px; colunas 12/6+6 ou lista 8 col. | > 6 itens; agenda como lista de bullets sem numeração; repetir a agenda inteira em toda seção. |
| **Divisor de seção** | N (powder para número) | Numeral 240–320 px (ou outline), título da seção 96–120 px, 1 linha de apoio 36 px opcional; centro/esquerda; sem rodapé de fonte. | Divisor claro igual ao slide de conteúdo; título genérico ("Resultados"); texto longo. |
| **Statement / ideia grande** | N ou claro | 1 frase 88–112 px, ≤ 14 palavras, ≤ 4 linhas, largura 8–10 col, centralizada ou à esquerda; 1 palavra-chave em acento (≤ 3 palavras); nenhum outro elemento exceto rodapé. | Mais de uma frase; imagem decorativa; vários destaques coloridos. |
| **Título + corpo** | claro | T 56–64; C: bloco de texto em 6–8 col com ≤ 4 bullets (≤ 8 palavras cada), 36–40 px; resto do espaço = respiro ou 1 ilustração/ícone em 4 col. | Parede de texto; bullets > 4; texto em 12 col; sub-bullets. |
| **2 colunas** | claro | 6+6, gap 24+ (ideal 48 px de espaço entre blocos); cada coluna: sub-título 32–36 + ≤ 3 linhas/bullets. Colunas com mesma estrutura e mesma altura. | Colunas desbalanceadas; sem relação lógica entre as duas; subtítulos de níveis diferentes. |
| **Comparação** | claro | 2 (ou 3) colunas iguais, rótulo de cabeçalho em chip ou faixa 56–64 px, mesmas linhas/atributos alinhados horizontalmente; destaque (acento) só na opção recomendada; veredito em faixa inferior (action title já enuncia o veredito). | Acento nas duas opções; atributos fora de ordem; > 3 opções; veredito ausente. |
| **Processo / passos** | claro | 3–5 passos (máx. 6 em L) em linha horizontal: círculo/numeral 64–80 px, conector 2–3 px, título do passo 32–36, descrição ≤ 12 palavras (P) / ≤ 25 (L). Largura igual por passo (12 col ÷ n). Fluxo esquerda -> direita. | 7+ passos; passos de tamanhos diferentes; setas decorativas sem sentido; descrição longa. |
| **Linha do tempo** | claro | Eixo 3–4 px horizontal em y≈560; 4–6 marcos (máx. 8 em L) com data (Inter 600, 28 px) + título 32 px + ≤ 12 palavras; alternar acima/abaixo só se > 5. Marco atual em acento. | Datas sem escala consistente; todos os marcos com o mesmo peso; > 8 marcos. |
| **Dado em destaque (número grande)** | claro ou N | Numeral 200–320 px Clash; unidade/delta 56–72 px; rótulo 32–36 px; contexto/comparativo 28 px; fonte no rodapé. 1 número (máx. 3 em linha, 4+4+4). Número em acento ou navy; só 1 acento. | Número sem unidade/período/baseline; 5+ KPIs; número minúsculo; sem fonte. |
| **Gráfico** | claro | T: action title com o insight (ex.: "Inscrições triplicaram após o workshop"); C: 1 gráfico em ≥ 8 col (≥ 60% da área de conteúdo), rótulos diretos, série de destaque em acento, resto em cinza; callout opcional 4 col com a anotação; fonte no rodapé. Detalhes na seção 7. | Título descritivo ("Inscrições por mês"); legenda separada; arco-íris; 3D; eixo cortado; gráfico minúsculo no centro. |
| **Tabela** | claro | ≤ 5 colunas e ≤ 6 linhas (P) / ≤ 7 colunas e ≤ 12 linhas (L); cabeçalho navy-claro com texto 24–28 px (P) / 18–20 (L); linhas 64–72 px (P) / 48–56 (L); números alinhados à direita; sem bordas verticais; zebra ou 1 linha-guia 1–2 px; destaque em 1 linha/célula. | Tabela em P com > 30 células; grades pesadas; texto < 20 px. Em P, prefira gráfico ou transforme a tabela em 3 destaques. |
| **Imagem / screenshot com anotação** | claro | Imagem em 7–8 col com borda 1–2 px ou sombra suave, raio 16–24; 1–3 anotações numeradas (círculo 40–48 px, acento) + legenda 24–28 px em 4–5 col; recorte no que importa; sem texto da imagem como conteúdo essencial. | Screenshot inteira ilegível (texto da UI < 16 px após escala); anotações demais; setas desalinhadas; imagem esticada. |
| **Citação** | claro ou N | Aspas Clash 160 px em acento/powder; texto 56–72 px (≤ 25 palavras), 8 col; autor 32 px + cargo 24 px. | Texto de citação pequeno; sem atribuição; citação > 3 linhas em P. |
| **Equipe / pessoas** | claro | 3–6 pessoas (máx. 8 em L): foto circular/quadrada 200–260 px, nome 32 px 600, papel 24 px, ≤ 1 linha de apoio; grid 4 ou 6 col por pessoa. | Fotos de tamanhos/enquadramentos diferentes; biografias longas; mais de 8 pessoas. |
| **Resumo** | claro | T: "O que levamos daqui: 3 conclusões"; C: 3–4 cards numerados com a conclusão (≤ 12 palavras) e referência à seção. | Resumo que introduz informação nova; resumo = agenda reciclada. |
| **Próximos passos / CTA** | claro ou N | 1–3 ações: verbo no imperativo (≤ 8 palavras), responsável (chip), prazo (chip); 1 CTA principal em botão/bloco acento 96–120 px de altura com QR/URL 28+ px. | Lista vaga ("avaliar oportunidades"); sem dono nem data; 2+ CTAs concorrentes. |
| **Encerramento** | N | "Obrigado/Dúvidas?" 96–120 px, contato 32 px, QR 240–320 px (alvo mínimo 8% da altura), logo. | Slide novo de conteúdo; contato em fonte 18 px; repetir capa sem função. |

---

## 6. Componentes reutilizáveis

| Componente | Anatomia | Padding | Raio | Tamanhos | Máx. por slide |
|---|---|---|---|---|---|
| **Card** | fundo branco/azul-claro ou powder, borda 1–2 px ou sombra suave; ícone (opcional) + título 32–36 + corpo 24–28 | 32–40 px (L: 32) | 24 px (único raio para cards em todo o deck) | min 4 col (≈ 4 por linha); altura igual na linha | 4 (P) / 6 (L); 3 é o ideal |
| **Chip / tag** | texto 24–26 px (L: 18–20), peso 600, caixa-alta opcional com +6% | 12 px vertical / 24 px horizontal; altura 48–56 px (L: 36–40) | pílula (raio = altura/2) | largura = conteúdo | 4 por grupo; 1 grupo por slide |
| **Ícone** | linha ou preenchido, um único estilo e espessura (≥ 3 px a 64 px) | zona livre = 1/4 do lado | – | 48–64 px em card; 96–128 px como ícone-herói | 1 por card; ≤ 6 por slide |
| **Destaque numérico** | número Clash 160–320 + unidade 56–72 + rótulo 32 | 24 px entre número e rótulo | – | – | 3 em linha (P) / 4 (L) |
| **Numeral de passo** | círculo 64–80 px, número Clash 32–40, fundo acento ou navy | – | círculo | – | 6 |
| **Callout / anotação** | barra lateral acento 4–6 px + texto 28–32 px, ou caixa powder | 24 px | 12–16 px | 4–5 col | 1 (P) / 2 (L) |
| **Legenda de imagem** | 24–28 px (L: 18–20), cor secundária #4A5468 | 12 px | – | ≤ 2 linhas | 1 por imagem |
| **Fonte (source)** | "Fonte: …" Inter 22 px (L: 16–18), cor secundária, x=120, y≈972 | – | – | 1 linha, truncar com ano | obrigatória em todo slide com dado/estatística/citação externa [F: consultoria exige fonte no rodapé] |
| **Rodapé fixo** | logo pequeno (altura 24–32 px) + seção + nº do slide (22 px) | zona 960–1008 | – | – | 1; capa/divisor ocultam |
| **Linha divisória** | 1–2 px, cor navy a 15–20% | – | – | – | ≤ 1 por slide |

Regras gerais [H]: 1 só raio de card, 1 só raio de imagem; sombras no máx. 1 estilo; ícones nunca misturam outline e fill; componentes irmãos têm exatamente a mesma altura/largura; contagem total de "objetos" visuais por slide ≤ 6 em P (Duarte: "o design resolve problemas, não embeleza" [F]).

---

## 7. Visualização de dados em slides

Fontes: Knaflic (declutter, direct labels, accent color, preattentive attributes, action titles) [F]; Tufte (maximizar data-ink, eliminar chartjunk, small multiples) [F]; WCAG 1.4.11 (marcas gráficas ≥ 3:1 contra o adjacente; não depender só de cor) [F].

Regras:
1. **Um insight por gráfico**; o action title o enuncia ("Mulheres são 38% dos inscritos, ante 22% em 2023") [F].
2. **Rótulos diretos** no fim das linhas/barras; sem legenda lateral quando há ≤ 4 séries [F].
3. **Cor de destaque única:** a série/barra que sustenta o insight em acento (#4B63CE) ou navy; o contexto em cinza **#7C869C** (3,65:1 sobre branco, atende 3:1) [H calculado; F para o limite 3:1]. Nunca powder (#C4E8ED) como marca de dado sobre branco (1,3:1) [H calculado].
4. **Simplificação:** remover bordas, grade (ou 1 px a 10–15% de opacidade), eixo Y se houver rótulos diretos, 3D, sombras, gradientes [F: Tufte/Knaflic].
5. **Limites:** barras ≤ 8 categorias (P: ≤ 6); linhas ≤ 4 (P: ≤ 3); pizza/donut só com ≤ 3 fatias e 1 dominante, senão barras; barras sempre com base em zero [H].
6. **Tamanho:** gráfico ≥ 60% da zona de conteúdo (≥ 8 colunas x 600 px de altura); texto dentro do gráfico ≥ 24 px (P) / 18 px (L) [H]; rótulo de valor 28–32 px em P.
7. **Anotação:** 1 callout (P) / 2 (L) para o ponto-chave com 28–32 px (P) / 20–24 (L) [H].
8. **Fonte e unidade** sempre: unidade no eixo/rotulo, período no subtítulo, "Fonte:" no rodapé [F].
9. **Small multiples** em L quando comparar > 4 séries: 2x3 miniaturas idênticas com mesma escala [F: Tufte] [H para a grade].
10. **Cor não é o único canal:** acompanhar com rótulo, posição ou padrão [F: WCAG 1.4.1/1.4.11].
11. Dados com muita precisão: arredondar (38%, não 37,82%) exceto quando a decisão depende disso [H].

---

## 8. Cor em fundo claro

Paleta: navy #060A1B / #0C1854 (tinta), acento #4B63CE, powder #C4E8ED, fundo branco / azul muito claro (≈ #EEF3FB, valor de exemplo [H]).

Contrastes calculados (WCAG, razão luminância) [H calculado]:

| Combinação | Razão | Uso permitido |
|---|---|---|
| #060A1B sobre branco | 19,7 | qualquer texto |
| #0C1854 sobre branco | 16,5 | qualquer texto |
| #4A5468 (texto secundário sugerido) sobre branco / #EEF3FB | 7,6 / 6,8 | legenda, fonte, apoio |
| #4B63CE sobre branco | 5,3 | texto ≥ 24 px; corpo só AA; destaque de palavra, ícone, barra |
| #4B63CE sobre #EEF3FB | 4,7 | texto ≥ 24 px ou negrito ≥ 18,7 px |
| #4B63CE sobre powder #C4E8ED | 4,05 | **só texto grande (≥ 24 px)**; nunca texto pequeno |
| #4B63CE sobre navy #0C1854 | 3,1 | **proibido para texto**; só gráfico/ornamento grande (≥ 3:1 não-texto marginal) |
| Powder #C4E8ED sobre navy #060A1B / #0C1854 | 15,1 / 12,6 | texto e linhas em slides escuros |
| Branco sobre #0C1854 | 16,5 | texto em slides escuros |
| Acento claro #8FA2F0 sobre #0C1854 | 6,7 | destaque em slides escuros (substitui #4B63CE) |
| Powder sobre branco | 1,3 | **só preenchimento de fundo**, nunca texto/linha/dado |

Regras:
1. **Proporção de área [H]:** ~70% fundo (branco/azul-claro), ~20% tinta (navy em texto e formas), ≤ 10% acento; powder ≤ 10% como fundo de card/faixa. Consultoria: 3–4 cores no total e acento usado para o takeaway, uma vez por slide [F, fonte de prática].
2. Acento **uma vez por slide como ponto focal** (palavra, número, barra, botão) [F: Duarte "cinza o irrelevante"; consultoria: acento 1x] [H para "1x"].
3. Projetores perdem contraste e luz ambiente lava o claro [F]. Portanto, para P: texto de corpo ≥ **7:1** (AAA) [F: WCAG AAA 7:1], elementos gráficos ≥ **3:1**, nada cinza-claro; ambiente iluminado favorece slides escuros [F], mas a identidade clara da Liga é mantida usando tinta navy pesada (≥ 500) e pesos ≥ 500 em texto pequeno [H].
4. **Slides escuros (navy) para ritmo:** capa, divisores de seção, 1–2 statements/citações, encerramento; ≤ 20–25% do deck [H]. Não use navy em slides de dados/tabela.
5. Nunca texto sobre foto sem scrim (overlay navy ≥ 60%) [H].
6. Limiares WCAG para consulta do script: texto < 24 px (ou < 18,7 px negrito): ≥ 4,5:1 [F]; ≥ 24 px: ≥ 3:1 [F]; gráficos/ícones essenciais: ≥ 3:1 [F]; não arredondar (4,499 não passa) [F].
7. Cinza de apoio de dados: #7C869C (3,65:1); linhas-guia: 1–2 px, ≥ 1,5:1 (decorativas) [H calculado].

---

## 9. Consistência entre slides

Elementos fixos [H, consistência: consultoria exige título, corpo e rodapé alinhados em todo o deck] [F]:
- **Título:** mesma posição (120, 72), mesmo estilo, em todos os slides de conteúdo.
- **Rodapé:** logo pequeno + seção + nº, na mesma posição; capa e divisores sem rodapé.
- **Número do slide:** 22 px (L: 16–18), alinhado à direita em x=1800, sempre visível.
- **Marcador de seção:** texto "02 · Método" 22–24 px no rodapé (ou chip de 36 px no canto superior direito) para orientação em decks > 10 slides.
- **Cor de fundo por função:** claro = conteúdo; navy = abertura/divisor/fechamento.

Ritmo e variação [H]:
1. Sequência: abertura (escuro) -> ritmo "claro, claro, claro" -> respiro (statement, número gigante, imagem, divisor).
2. Nunca mais de **3 slides consecutivos** com o mesmo layout (exceto itens paralelos de uma lista); nunca mais de **5 slides consecutivos** de texto sem gráfico, imagem, número ou diagrama.
3. 1 slide de "respiro" (statement/número/imagem full-bleed) a cada 4–6 slides em P.
4. Variação controlada: usar de 6 a 9 layouts do catálogo; novo layout só se nenhum atende; todos herdam grid, tipografia e raios.
5. **Repetição** é um princípio de design [F: Reynolds]: mesmos tokens, mesmo estilo de ícone, mesmo tratamento de imagem.
6. Marca d'água, rodapés e logos grandes não devem ocupar > 5% da área do slide; Tufte observou ~30% de slides de um deck NASA como conteúdo-vazio de marca e repetição [F]: reduza overhead.
7. Animação: nenhuma por padrão; "cada mudança cria distração" [F: Duarte].

---

## 10. Erros que denunciam deck amador (checáveis)

1. Título descritivo/tópico em vez de conclusão ("Resultados", "Contexto") [F].
2. Mais de uma ideia por slide ou título > 2 linhas / > 15 palavras [F].
3. Parede de texto: > 35 palavras em P ou > 200 em L [H].
4. Bullets em excesso (> 4 em P; > 6 em L) ou sub-bullets [F/H].
5. Fonte menor que o piso (P < 22 px absoluto, corpo < 32; L < 16 absoluto, corpo < 22) [H].
6. Mais de 2 famílias de fonte, ou mais de 4 tamanhos no slide [F/H].
7. Texto com contraste < 4,5:1 (ou < 3:1 em ≥ 24 px) [F].
8. Texto/elementos fora da área viva (margens < 120 px laterais) ou colados nas bordas [H].
9. Elementos desalinhados por poucos px; colunas com alturas diferentes; espaçamento não múltiplo de 8 [H].
10. Mais de 1 acento ou arco-íris de cores; cores sem função [F].
11. Gráfico sem rótulo direto, com legenda distante, 3D, grade pesada, eixo cortado [F].
12. Dado/estatística sem fonte e sem unidade/período [F].
13. Imagem esticada, pixelada, genérica ou clip-art; imagem como decoração sem função [F/H].
14. Texto sobre imagem sem scrim; texto cruzando rostos [H].
15. Ícones de estilos diferentes; cantos/raios variados; sombras diferentes [H].
16. Slides "lotados de logo/rodapé" (overhead de marca > 5%) [F/H].
17. Layout diferente em cada slide, sem repetição; ou o mesmo layout 6x seguidos [H].
18. Agenda sem uso posterior; seção com 1 slide; conclusão que traz informação nova [H].
19. Capa ou fechamento sem função (sem data, autor, contato/CTA) [H].
20. Mistura de modos: slide "ao vivo" com 150 palavras, ou slidedoc com 12 palavras e sem contexto [F: Reynolds].
21. Centralização de parágrafos longos; alinhamento justificado [H].
22. Espaço vazio "quebrado": miolo pequeno isolado no centro enquanto há conteúdo relevante na fonte (regra do AGENTS.md para documentos de leitura contínua; em L, verificar ocupação do topo à base) [H, do projeto].

---

## 11. Checklist de QA slide a slide (para script/agente)

Entradas: `mode` (P/L), tipo de layout, tokens. Cada item retorna pass/fail; falha de severidade A bloqueia entrega.

**A. Estrutura (deck)**
- [ ] A1. Existe capa (1º) e encerramento (último); decks ≥ 15 slides ou ≥ 4 seções têm agenda. (A)
- [ ] A2. Lista só dos títulos, lida em sequência, conta a história (revisão por LLM). (A) [F]
- [ ] A3. Nº de slides de conteúdo cabe em duração: P ≤ 1 por minuto (ou ≤ 1 por 2 min com gráficos); L 8–20 (aviso > 25). (B) [H]
- [ ] A4. Seções: 3–5, cada uma com 3–7 slides de conteúdo; divisor + título. (B) [H]
- [ ] A5. Layouts: ≤ 3 consecutivos iguais; ≤ 5 slides seguidos sem visual; 6–9 layouts distintos; slides escuros ≤ 25%. (B) [H]
- [ ] A6. Mapa preservado: slide final -> template-fonte -> conteúdo de origem (AGENTS.md). (A)

**B. Conteúdo por slide**
- [ ] B1. Título é frase com verbo, ≤ 15 palavras (P: ≤ 12), ≤ 2 linhas; não é só tópico. (A) [F]
- [ ] B2. Uma ideia: o slide responde a 1 pergunta; ≤ 1 elemento focal. (A) [F]
- [ ] B3. Palavras excl. título/rodapé: P ≤ 35; L ≤ 200. (A) [H]
- [ ] B4. Bullets: P ≤ 4 de ≤ 8 palavras; L ≤ 6 de ≤ 20; sem sub-bullets. (B) [H]
- [ ] B5. Blocos de texto: P ≤ 4; L ≤ 6. Cards ≤ 4 (P)/6 (L); chips ≤ 4 por grupo. (B) [H]
- [ ] B6. Dado/estatística/citação tem fonte (rodapé) e unidade/período. (A) [F]
- [ ] B7. Último slide de seção/ação tem verbo+responsável+prazo (CTA). (B) [H]

**C. Geometria (px)**
- [ ] C1. Todo elemento de conteúdo dentro de x∈[120,1800], y∈[72,1008] (sangria só em fundo/imagem). (A) [H]
- [ ] C2. Título: x=120, topo y=72 (±8), altura ≤ 144 (2 linhas). (A) [H]
- [ ] C3. Conteúdo começa em y ≥ 264 e termina em y ≤ 936; rodapé em 960–1008. (A) [H]
- [ ] C4. Bordas esquerdas/direitas dos blocos coincidem com colunas (118 px, gutter 24 px) com tolerância ±2 px. (B) [H]
- [ ] C5. Gaps e paddings múltiplos de 8; gap entre irmãos iguais; irmãos com mesma altura. (B) [H]
- [ ] C6. Ocupação: área de conteúdo (bbox) ≥ 40% da zona de conteúdo e ≤ 65% (P)/80% (L) de preenchimento; sem bloco isolado no centro com espaço vazio > 35% da zona (L). (B) [H]
- [ ] C7. Sobreposição de elementos de texto = 0. (A) [H]

**D. Tipografia**
- [ ] D1. Famílias ∈ {Clash Display, Inter}. (A) [F]
- [ ] D2. Tamanhos: título P 56–64 / L 44–52; corpo P ≥ 32 (alvo 36–44) / L ≥ 22 (alvo 24–28); menor texto P ≥ 22 / L ≥ 16. (A) [H]
- [ ] D3. ≤ 4 tamanhos distintos; razão título/corpo ≥ 1.5. (B) [H]
- [ ] D4. Entrelinha: título 1.0–1.15; corpo 1.35–1.5; tracking título −1 a −2%, caixa-alta +6–10%. (B) [H]
- [ ] D5. Texto ≤ 75 caracteres/linha (L) e ≤ 45 (P); sem viúvas de 1 palavra; texto alinhado à esquerda (exceto capa/divisor/statement/número). (B) [H]
- [ ] D6. Pesos: texto P ≥ 400 (preferir 500 abaixo de 28 px); sem peso < 400. (B) [H]

**E. Cor e contraste**
- [ ] E1. Contraste texto/fundo ≥ 4,5:1; se tamanho ≥ 24 px (ou ≥ 18,7 px bold) ≥ 3:1; em P, texto corpo ≥ 7:1. (A) [F + H]
- [ ] E2. Gráficos, ícones e linhas essenciais ≥ 3:1 contra o adjacente. (A) [F]
- [ ] E3. Acento #4B63CE: nunca como texto sobre navy ou sobre texto < 24 px em powder; powder nunca como texto/linha. (A) [H calculado]
- [ ] E4. Cores fora da paleta ≤ 0; acento em ≤ 10% da área; ≥ 70% fundo claro em slides claros. (B) [H]
- [ ] E5. Texto sobre imagem tem scrim ≥ 60% ou área sólida. (B) [H]

**F. Componentes e dados**
- [ ] F1. Raio de card único (24); raio de imagem único; estilo de ícone único; ícones 48–64 px. (B) [H]
- [ ] F2. Gráfico: 1 insight, título com a conclusão, rótulos diretos, 1 série em destaque, sem 3D, sem legenda se ≤ 4 séries, base zero em barras, ≥ 60% da zona de conteúdo, texto ≥ 24 (P)/18 (L). (A) [F/H]
- [ ] F3. Tabela: P ≤ 5x6, L ≤ 7x12; números à direita; sem grade vertical. (B) [H]
- [ ] F4. Imagem: proporção original preservada (distorção < 2%); resolução ≥ 1x do tamanho exibido; anotações ≤ 3. (B) [H]

**G. Consistência**
- [ ] G1. Número do slide, seção e logo na mesma posição em todos os conteúdos (±2 px). (A) [F]
- [ ] G2. Overhead de marca (logos, faixas, rodapé) ≤ 5% da área. (B) [F/H]
- [ ] G3. Slide de modo P não tem > 35 palavras; modo L não tem < 40 palavras sem visual explícito (senão vira slide mudo). (B) [H]
- [ ] G4. Teste visual: renderizar em 25% (480x270); o ponto focal e o título ainda são identificáveis (glance test). (B) [F: Duarte glance test]

Procedimento sugerido: calcular D e E por node de texto (tamanho, cor, fundo efetivo); C e F por bbox; A e G por varredura do deck; B por LLM com contagem programática de palavras. Reprovar com severidade A impede entrega; B gera aviso e correção automática.

---

## 12. Fontes (URLs)

Todas acessadas na pesquisa; as regras marcadas [F] derivam delas, em geral de resumos e artigos secundários quando a fonte primária é um livro (Duarte, Reynolds, Minto, Tufte, Knaflic são livros; conferir páginas se citar formalmente).

- Duarte, Slidedocs: https://www.duarte.com/slidedocs/ (definição, pré-leitura/leave-behind)
- Duarte, Glance Test (3 s, uma ideia por slide): https://www.duarte.com/blog/the-glance-test/
- Resumo de slide:ology (3 s, "PowerPoint English", cinza no irrelevante, aplicável a plateias grandes): https://thinkinsights.net/insights/designing-effective-slides
- Review do guia Slidedocs (visual language, grids, white space): https://betterposters.substack.com/p/review-slidedocs-14-03-06
- Duarte, regra de 1 slide a cada ~2 min e contra-exemplo (180 slides/40 min): https://www.slidegenius.com/tips-tricks/youre-wrong-powerpoint-rules-following
- Reynolds, sinal/ruído: https://procomm.ieee.org/?p=5801
- Reynolds, Presentation Zen (espaço vazio, CRAP): https://www.slideshare.net/slideshow/wiki-highlights-presentation-zen/7735008
- Reynolds, slideument (slides e documentos separados): https://martinfowler.com/bliki/Slideument.html
- Minto / consultoria, estrutura de slide e SCQA: https://pptproductivity.com/blog/how-to-create-effective-consulting-slides-using-minto-principles
- Action titles estilo McKinsey (≤ 15 palavras, ≤ 2 linhas, teste só-títulos): https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey
- Padrões de slide de consultoria (1 exibição, 2–4 pontos, fonte, nº de página, 60 s/slide, 3–4 cores): https://deckary.com/blog/consulting-slide-standards
- Tufte, PowerPoint Does Rocket Science: https://www.edwardtufte.com/notebook/powerpoint-does-rocket-science-and-better-techniques-for-technical-reports/
- Tufte, data-ink, chartjunk, small multiples (resumo IEEE): https://spectrum.ieee.org/tufteisms
- Knaflic / Storytelling with Data (declutter, rótulo direto, acento): https://www.storytellingwithdata.com/blog/2016/3/1/declutter-your-data-visualizations e https://www.storytellingwithdata.com/blog/2017/3/29/declutter-this-graph
- Mayer, princípios de aprendizagem multimídia (coerência, sinalização, segmentação): https://digitallearninginstitute.com/blog/mayers-principles-multimedia-learning
- WCAG 2.2 1.4.3 Contraste mínimo (4,5:1; 3:1 grande; 18 pt/14 pt bold; sem arredondar): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2 1.4.11 Contraste não textual (3:1): https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2 1.4.12 Espaçamento de texto (1.5; 2x; 0,12; 0,16): https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- BrightCarbon, tamanhos de fonte em apresentações vs. documentos e proporções da altura do slide: https://www.brightcarbon.com/blog/presentation-font-size/
- Kawasaki 10/20/30 (30 pt mínimo): https://ahaslides.com/blog/10-20-30-rule-presentations
- Apple tvOS (corpo ≥ 29 pt, títulos ≥ 48 pt, margem 60 pt, 1920x1080; resumo secundário de HIG): https://skills.cat/skills/ehmo/platform-design-skills/tvos-design-guidelines
- Distância de visualização (1920x1080, 16 pt, 2,5x diagonal): https://ad-wiki.informatik.uni-freiburg.de/research/HowTos/ScreenSizeForPresentations
- Regra de projeção 1/50 da altura da tela / 8H, 4 mm por metro: https://www.proav.de/video/projectionrules.html
- Contraste e luz ambiente em projetores: https://www.logos.com/grow/stop-squinting-at-screens-create-contrast/
- Brysbaert (2019), velocidade de leitura (238 wpm não-ficção): https://www.Gwern.net/doc/psychology/linguistics/2019-brysbaert.pdf

Observação final: o catálogo oficial de templates `tpl-*` (Figma `198:2`) permanece a autoridade visual do projeto. Os números acima são regras de estrutura e hierarquia para escolher e verificar templates reais, não um parâmetro paralelo que substitua o catálogo (AGENTS.md); onde o template original diverge de um valor [H], vale o template, e a divergência deve ser registrada.
