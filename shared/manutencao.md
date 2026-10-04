# Manutenção do sistema

Use este caminho só para mudar o visual, criar blocos ou corrigir os motores. A produção de materiais nunca edita o sistema.

## Onde vive cada coisa

| Peça | Fonte de verdade | Cópia executável |
|---|---|---|
| cores | coleção de variáveis `Liga / Materiais` no Figma | — |
| tipografia | estilos `Material A4/*`, `Deck P/*`, `Deck L/*` no Figma | — |
| capas e contracapa | componentes `A4/Capa v1–v4` e `A4/Contracapa` (página `696:2`) | — |
| motor A4 | `documento-a4/build.js` | nó `lib/LIA_A4` (`703:2`) |
| motor deck | `apresentacao-16x9/build.js` | nó `lib/LIA_DECK` (`707:2`) |
| regras e limites | `documento-a4/FORMAT.md`, `apresentacao-16x9/FORMAT.md`, `scripts/validar_plano.py` | — |
| base de pesquisa | `research/*.md` | — |

Os números dos motores vêm das pesquisas em `research/`. Ao mudar um valor, mude também o FORMAT.md, o validador e o QA do motor, para que os quatro concordem.

## Publicar um motor

1. Edite o `build.js` e aumente `version` no `return { build, qa, version }`.
2. `node -e "new Function(require('fs').readFileSync('<build.js>','utf8'))"` precisa terminar sem erro.
3. `python scripts/publicar.py <build.js> <LIA_A4|LIA_DECK>` gera um patch com os trechos alterados (ou a publicação completa com `--full`). Cole a saída como `code` de um `use_figma`.
4. Se a chamada devolver a nova versão, rode o mesmo comando com `--confirm` para atualizar o cache em `scripts/.publicado/`.
5. Remonte `documento-a4/exemplo-plano.json` ou `apresentacao-16x9/exemplo-plano.json` e revise o screenshot.

Se o patch disser "não aplicável", o Figma divergiu do cache: publique com `--full`.
Evite escapes `\uXXXX` no código dos motores, porque a transmissão para o Figma os converte. Use `String.fromCharCode` ou o caractere literal.

## Testes

`python -m unittest discover -s tests` depois de mudar scripts, exemplos ou validador.
Depois de validar a cópia de trabalho, sincronize a skill instalada em `~/.claude/skills/liga-materiais` e guarde a versão anterior em `D:\lia ufscar\backups\`.
