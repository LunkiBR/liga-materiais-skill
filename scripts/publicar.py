"""Gera o código use_figma que publica um motor .js no nó lib/<NOME> da página Sistema — Materiais.

Uso:
  python scripts/publicar.py documento-a4/build.js LIA_A4 > publicar.js           # patch se houver cache
  python scripts/publicar.py documento-a4/build.js LIA_A4 --full > publicar.js    # publicação completa
Cole a saída inteira como `code` de uma chamada use_figma (arquivo rbxe2L7fFOqKELar7dZ9zD).
Depois que a chamada retornar a versão esperada, confirme o cache:
  python scripts/publicar.py documento-a4/build.js LIA_A4 --confirm
O cache em scripts/.publicado/<NOME>.js guarda o corpo exato que está no Figma; o patch envia só os trechos alterados.
"""

from __future__ import annotations

import difflib
import json
import re
import sys
from pathlib import Path

SYSTEM_PAGE = "696:2"
CACHE = Path(__file__).resolve().parent / ".publicado"

FULL = """function __LIB__() {
%(source)s
}
const src = __LIB__.toString();
const body = src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
const mod = new Function(body)();
if (!mod || mod.version !== %(version)s) throw new Error('versão inesperada: ' + (mod && mod.version));
const sys = await figma.getNodeByIdAsync('%(page)s');
await figma.setCurrentPageAsync(sys);
await figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Regular' });
let lib = sys.findOne(n => n.type === 'TEXT' && n.name === 'lib/%(name)s');
if (!lib) {
  lib = figma.createText(); lib.name = 'lib/%(name)s'; sys.appendChild(lib);
  lib.fontName = { family: 'JetBrains Mono', style: 'Regular' }; lib.fontSize = 4;
  let maxY = 0; for (const c of sys.children) if (c !== lib) maxY = Math.max(maxY, c.y + c.height);
  lib.x = 0; lib.y = maxY + 400; lib.resize(1600, 10); lib.textAutoResize = 'HEIGHT';
}
lib.locked = false; lib.characters = body; lib.locked = true;
return { id: lib.id, name: lib.name, chars: body.length, version: mod.version };
"""

PATCH = """const sys = await figma.getNodeByIdAsync('%(page)s');
await figma.setCurrentPageAsync(sys);
await figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Regular' });
const lib = sys.findOne(n => n.type === 'TEXT' && n.name === 'lib/%(name)s');
if (!lib) throw new Error('lib/%(name)s ausente: publique com --full');
let body = lib.characters;
const PATCHES = %(patches)s;
for (const [a, b] of PATCHES) {
  const i = body.indexOf(a);
  if (i < 0 || body.indexOf(a, i + 1) >= 0) throw new Error('patch não aplicável; publique com --full: ' + a.slice(0, 60));
  body = body.slice(0, i) + b + body.slice(i + a.length);
}
const mod = new Function(body)();
if (!mod || mod.version !== %(version)s) throw new Error('versão inesperada: ' + (mod && mod.version));
lib.locked = false; lib.characters = body; lib.locked = true;
return { id: lib.id, name: lib.name, chars: body.length, version: mod.version, patches: PATCHES.length };
"""


def body_of(source: str) -> str:
    # mesmo recorte que __LIB__.toString() produz entre as chaves
    return "\n" + source + "\n"


def version_of(source: str) -> str:
    m = re.search(r"version: '([^']+)'", source)
    if not m:
        sys.exit("motor sem `version: '...'`")
    return m.group(1)


def patches(old: str, new: str) -> list[list[str]]:
    a, b = old.splitlines(keepends=True), new.splitlines(keepends=True)
    out = []
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "equal":
            continue
        ctx = 1
        while True:
            lo, hi = max(0, i1 - ctx), min(len(a), i2 + ctx)
            old_chunk = "".join(a[lo:hi])
            if old_chunk and old.count(old_chunk) == 1:
                break
            ctx += 1
        new_chunk = "".join(a[lo:i1]) + "".join(b[j1:j2]) + "".join(a[i2:hi])
        out.append([old_chunk, new_chunk])
    return out


def main() -> None:
    path, name, *flags = sys.argv[1:]
    source = Path(path).read_text(encoding="utf-8")
    cache = CACHE / f"{name}.js"
    if "--confirm" in flags:
        CACHE.mkdir(exist_ok=True)
        cache.write_text(body_of(source), encoding="utf-8")
        print(f"cache atualizado: {cache}")
        return
    sys.stdout.reconfigure(encoding="utf-8")
    params = {"page": SYSTEM_PAGE, "name": name, "version": json.dumps(version_of(source))}
    if "--full" in flags or not cache.exists():
        sys.stdout.write(FULL % {**params, "source": source})
        return
    ps = patches(cache.read_text(encoding="utf-8"), body_of(source))
    if not ps:
        sys.exit("nada a publicar: o cache já é igual à fonte")
    sys.stdout.write(PATCH % {**params, "patches": json.dumps(ps)})


if __name__ == "__main__":
    main()
