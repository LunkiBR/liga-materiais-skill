# Liga Materiais

Skill que transforma contexto bruto (playbooks, guias, notas, PDFs) em materiais da Liga IA UFSCar montados no Figma, com o sistema visual da Liga.

## Como funciona

1. A IA lê a fonte e escreve um **plano**: uma lista de blocos de conteúdo (capítulos, passos, tabelas, callouts, slides…) com a origem de cada trecho.
2. Um **motor** no Figma monta o material a partir do plano. Ele aplica grid, tipografia, cores, paginação, cabeçalho, rodapé e capas.
3. O motor roda um **QA numérico** (ocupação de página, títulos órfãos, palavras por slide, fontes, margens). A IA corrige o plano até o QA ficar limpo.

## Formatos

| Formato | Pasta | Motor no Figma |
|---|---|---|
| Documento A4 / PDF | `documento-a4/` | `lib/LIA_A4` |
| Apresentação 16:9, para projetar (P) ou ler (L) | `apresentacao-16x9/` | `lib/LIA_DECK` |

O roteador em `SKILL.md` abre só a pasta do formato pedido.

## Estrutura

- `SKILL.md`: roteador e fluxo de execução.
- `shared/`: ingestão de fontes, roteiro editorial e manutenção do sistema.
- `documento-a4/`, `apresentacao-16x9/`: especificação (`FORMAT.md`), motor (`build.js`) e plano de exemplo.
- `scripts/`: `validar_plano.py`, `chamada.py` (gera a chamada ao Figma) e `publicar.py` (publica os motores).
- `research/`: pesquisas que fundamentam os números do sistema.
- `runs/`: planos e mapas de cada material produzido.
- `tests/`: `python -m unittest discover -s tests`.

## Sistema no Figma

Arquivo `rbxe2L7fFOqKELar7dZ9zD`, página **Sistema — Materiais**:

- as capas A4 v1–v4 e a contracapa (componentes);
- a coleção de cores `Liga / Materiais`;
- os estilos `Material A4/*`, `Deck P/*` e `Deck L/*`;
- os dois motores.

As páginas "Exemplo — …" mostram cada motor em uso.
