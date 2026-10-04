"""Gera o código use_figma que monta um material a partir de um plano JSON.

Uso: python scripts/chamada.py runs/<slug>/plano.json > chamada.js
O formato vem de plano["formato"] ("documento-a4" ou "apresentacao-16x9").
Cole a saída como `code` de uma chamada use_figma no arquivo rbxe2L7fFOqKELar7dZ9zD.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

LIBS = {"documento-a4": ("703:2", "LIA_A4"), "apresentacao-16x9": ("707:2", "LIA_DECK")}

TEMPLATE = """const lib = await figma.getNodeByIdAsync('%(lib)s');
if (!lib) throw new Error('motor %(name)s ausente na página Sistema — Materiais');
const %(name)s = new Function(lib.characters)();
%(cleanup)sreturn await %(name)s.build(%(plan)s);
"""


def main() -> None:
    plan = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    fmt = plan.pop("formato")
    lib, name = LIBS[fmt]
    plan.pop("fontes", None)  # mapa de origem fica no arquivo, não vai ao Figma
    replace = plan.get("doc", {}).pop("substituir", None)
    cleanup = ""
    if replace:
        cleanup = "const old = await figma.getNodeByIdAsync('%s'); if (old) old.remove();\n" % replace
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stdout.write(TEMPLATE % {"lib": lib, "name": name, "cleanup": cleanup, "plan": json.dumps(plan)})


if __name__ == "__main__":
    main()
