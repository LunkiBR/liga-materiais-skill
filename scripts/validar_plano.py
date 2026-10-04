"""Valida um plano de material antes de montá-lo no Figma.

Uso: python scripts/validar_plano.py runs/<slug>/plano.json
Sai com código 1 se houver ERRO. AVISO pede julgamento, não bloqueia.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

A4_BLOCKS = {"chapter", "h2", "h3", "p", "lead", "list", "checklist", "steps", "callout", "figure", "table", "kpis", "quote", "cards", "code", "pagebreak"}
DECK_LAYOUTS = {"cover", "agenda", "divider", "statement", "content", "columns", "cards", "steps", "timeline", "numbers", "image", "quote", "table", "closing"}
DARK = {"divider", "closing"}


def words(*parts: object) -> int:
    n = 0
    for p in parts:
        if isinstance(p, str):
            n += len(p.split())
        elif isinstance(p, list):
            n += words(*p)
        elif isinstance(p, dict):
            n += words(*[v for k, v in p.items() if k not in {"t", "key", "ratio", "accent", "current", "dark", "variant", "hash", "node", "width", "main", "src", "kind", "align", "ordered", "start", "highlight", "focus", "n"}])
    return n


class Report:
    def __init__(self) -> None:
        self.items: list[tuple[str, str, str]] = []

    def err(self, where: str, msg: str) -> None:
        self.items.append(("ERRO", where, msg))

    def warn(self, where: str, msg: str) -> None:
        self.items.append(("AVISO", where, msg))

    @property
    def errors(self) -> int:
        return sum(1 for s, _, _ in self.items if s == "ERRO")


def need(r: Report, where: str, obj: dict, *keys: str) -> None:
    for k in keys:
        if not obj.get(k):
            r.err(where, f"campo obrigatório ausente: {k}")


HIGHLIGHT = {"callout", "cards", "kpis", "quote"}


def srcs(obj: object) -> set[str]:
    """Todas as referências `src` de um bloco, inclusive em itens aninhados."""
    out: set[str] = set()
    if isinstance(obj, dict):
        v = obj.get("src")
        if isinstance(v, str):
            out.add(v)
        elif isinstance(v, list):
            out.update(x for x in v if isinstance(x, str))
        for val in obj.values():
            out |= srcs(val)
    elif isinstance(obj, list):
        for val in obj:
            out |= srcs(val)
    return out


def check_coverage(plan: dict, items: list, r: Report, fmt: str) -> None:
    """Toda unidade da fonte vai para um bloco (`src`) ou para `fontes.cortes` com motivo."""
    fontes = plan.get("fontes", {})
    unidades = fontes.get("unidades")
    if not unidades:
        r.err("fontes", "plano sem inventário: liste `fontes.unidades` e aponte cada bloco com `src`")
        return
    ids = {u.get("id") for u in unidades}
    cortes = fontes.get("cortes", {})
    used = srcs(items)
    for i in sorted(used - ids):
        r.err("fontes", f"`src` aponta para unidade inexistente: {i}")
    for i in sorted(set(cortes) - ids):
        r.err("fontes.cortes", f"corte de unidade inexistente: {i}")
    for u in unidades:
        uid = u.get("id")
        if uid not in used and uid not in cortes:
            r.err("fontes", f"unidade sem destino: {uid} ({u.get('resumo', '')[:60]}). Use em um bloco ou registre o corte com motivo")
        if uid in cortes and not str(cortes[uid]).strip():
            r.err("fontes.cortes", f"corte sem motivo: {uid}")
    resumo = bool(fontes.get("resumo"))
    if not resumo and len(cortes) > 0.3 * len(ids):
        r.warn("fontes.cortes", f"{len(cortes)} de {len(ids)} unidades cortadas: o material está resumindo a fonte")
    src_words = fontes.get("palavras")
    if src_words:
        kept = words(items) / src_words
        if fmt == "documento-a4" and not resumo:
            if kept < 0.35:
                r.err("fontes", f"o plano mantém {kept:.0%} das palavras da fonte: está resumido demais (alvo 60% a 110% fora de pedido de resumo)")
            elif kept < 0.6:
                r.warn("fontes", f"o plano mantém {kept:.0%} das palavras da fonte (alvo 60% a 110%): confira se o texto não ficou telegráfico")
        if fmt == "apresentacao-16x9" and plan.get("doc", {}).get("mode") == "L" and kept < 0.3:
            r.warn("fontes", f"deck para leitura com {kept:.0%} das palavras da fonte: o leitor não terá o apresentador para completar")


def check_density_a4(blocks: list, r: Report) -> None:
    paras = [words(b.get("text", "")) for b in blocks if b.get("t") == "p"]
    if len(paras) >= 3 and sum(1 for w in paras if w < 25) > 0.4 * len(paras):
        r.warn("blocks", f"{sum(1 for w in paras if w < 25)} de {len(paras)} parágrafos com menos de 25 palavras: desenvolva a ideia (o quê, por quê, como, exemplo)")
    for i, b in enumerate(blocks):
        if b.get("t") == "list" and b.get("items"):
            avg = sum(words(x) for x in b["items"]) / len(b["items"])
            if avg < 6:
                r.warn(f"blocks[{i}]", f"itens com {avg:.0f} palavras em média: escreva frases completas ou use um parágrafo")
    # seções: palavras de corpo entre um título e o próximo
    start, title = None, None
    def close(end: int) -> None:
        if start is None:
            return
        body = words(blocks[start + 1:end])
        limit = 120 if blocks[start].get("t") == "chapter" else 60
        if body < limit:
            r.warn(f"blocks[{start}]", f"seção rasa: \"{title}\" tem {body} palavras (mín. {limit})")
    for i, b in enumerate(blocks):
        if b.get("t") in {"chapter", "h2"}:
            close(i)
            start, title = i, b.get("title") or b.get("text")
    close(len(blocks))
    total = words(blocks)
    hl = sum(1 for b in blocks if b.get("t") in HIGHLIGHT)
    if total and hl > max(2, 1.5 * total / 250):
        r.warn("blocks", f"{hl} destaques para {total} palavras: caixas demais deixam o texto ralo (≈1 a cada 250 palavras)")


def check_density_deck(slides: list, mode: str, r: Report) -> None:
    content = {"content", "columns", "cards", "steps", "timeline", "numbers", "image", "table", "agenda"}
    floor = 40 if mode == "L" else 8
    thin = []
    for i, s in enumerate(slides):
        if s.get("t") in content:
            w = words({k: v for k, v in s.items() if k != "title"})
            if w < floor:
                thin.append(i)
                r.warn(f"slides[{i}]", f"slide ralo: {w} palavras fora do título (mín. {floor} em {mode})")
    if mode == "L":
        ws = [words({k: v for k, v in s.items() if k != "title"}) for s in slides if s.get("t") in content]
        if ws and sum(ws) / len(ws) < 60:
            r.warn("slides", f"média de {sum(ws) / len(ws):.0f} palavras por slide de conteúdo (alvo 60 a 150 em L)")


def check_a4(plan: dict, r: Report) -> None:
    doc = plan.get("doc", {})
    need(r, "doc", doc, "title")
    if not doc.get("short"):
        r.warn("doc", "sem `short`: o cabeçalho corrente usará o título inteiro")
    if "cover" in plan:
        need(r, "cover", plan["cover"], "title")
        if plan["cover"].get("variant", 2) not in (1, 2, 3, 4):
            r.err("cover", "variant deve ser 1, 2, 3 ou 4")
    blocks = plan.get("blocks", [])
    total = 0
    for i, b in enumerate(blocks):
        w = f"blocks[{i}]"
        t = b.get("t")
        if t not in A4_BLOCKS:
            r.err(w, f"bloco desconhecido: {t}")
            continue
        total += words(b)
        if t in {"h2", "h3", "p", "lead", "code"}:
            need(r, w, b, "text")
        if t == "chapter":
            need(r, w, b, "title")
        if t == "p" and words(b.get("text", "")) > 160:
            r.warn(w, "parágrafo com mais de 160 palavras: divida por ideia")
        if t in {"list", "checklist"}:
            n = len(b.get("items", []))
            if n == 0:
                r.err(w, "lista vazia")
            elif t == "list" and not 3 <= n <= 7:
                r.warn(w, f"lista com {n} itens (ideal 3 a 7)")
            elif t == "checklist" and n > 12:
                r.warn(w, f"checklist com {n} itens (máx. 12 sem grupos)")
        if t == "steps":
            for j, s in enumerate(b.get("items", [])):
                need(r, f"{w}.items[{j}]", s, "title")
                if s.get("figure") and not (s["figure"].get("ratio") or s["figure"].get("node") or s["figure"].get("hash")):
                    r.err(f"{w}.items[{j}].figure", "figura sem `ratio` (largura/altura da imagem)")
        if t == "callout":
            if b.get("kind", "dica") not in {"dica", "atencao", "exemplo"}:
                r.err(w, "kind deve ser dica, atencao ou exemplo")
            if len(b.get("text", "")) > 280:
                r.err(w, f"callout com {len(b.get('text', ''))} caracteres (máx. 280)")
        if t == "figure":
            if not (b.get("ratio") or b.get("node") or b.get("hash")):
                r.err(w, "figura sem `ratio` (largura/altura da imagem)")
            if not b.get("caption"):
                r.warn(w, "figura sem legenda")
            if b.get("width", 6) not in (2, 3, 4, 5, 6):
                r.err(w, "width deve ser 2, 3, 4, 5 ou 6 colunas")
        if t == "table":
            head, rows = b.get("head", []), b.get("rows", [])
            if not head or not rows:
                r.err(w, "tabela precisa de head e rows")
            if len(head) > 6:
                r.err(w, f"tabela com {len(head)} colunas (máx. 6)")
            for j, row in enumerate(rows):
                if len(row) != len(head):
                    r.err(w, f"linha {j} com {len(row)} células para {len(head)} colunas")
            if b.get("cols") and len(b["cols"]) != len(head):
                r.err(w, "cols precisa ter um peso por coluna")
        if t == "kpis":
            n = len(b.get("items", []))
            if not 1 <= n <= 3:
                r.err(w, f"kpis com {n} itens (1 a 3)")
        if t == "cards":
            n = len(b.get("items", []))
            if not 2 <= n <= 4:
                r.warn(w, f"cards com {n} itens (2 a 4 por página)")
        if t in {"h2", "h3"} and i + 1 < len(blocks) and blocks[i + 1].get("t") in {"h2", "h3", "chapter"}:
            r.err(w, "título seguido de outro título: seção vazia")
    if blocks and blocks[-1].get("t") in {"h2", "h3", "chapter"}:
        r.err(f"blocks[{len(blocks) - 1}]", "o documento termina em um título")
    check_coverage(plan, blocks, r, "documento-a4")
    check_density_a4(blocks, r)
    pages = max(1, round(total / 330))
    r.warn("doc", f"estimativa: {total} palavras ≈ {pages} página(s) de corpo (a ~330 palavras/página)")


def check_deck(plan: dict, r: Report) -> None:
    doc = plan.get("doc", {})
    need(r, "doc", doc, "title")
    mode = doc.get("mode")
    if mode not in ("P", "L"):
        r.err("doc", "mode deve ser P (projetar) ou L (ler)")
        mode = "P"
    lim = {"P": dict(words=35, title=12, bullets=4, numbers=3, cols=5, rows=6), "L": dict(words=200, title=15, bullets=6, numbers=4, cols=7, rows=12)}[mode]
    slides = plan.get("slides", [])
    if slides and slides[0].get("t") != "cover":
        r.warn("slides[0]", "o deck não começa por uma capa")
    if slides and slides[-1].get("t") != "closing":
        r.warn(f"slides[{len(slides) - 1}]", "o deck não termina em encerramento")
    run, dark = 1, 0
    for i, s in enumerate(slides):
        w = f"slides[{i}]"
        t = s.get("t")
        if t not in DECK_LAYOUTS:
            r.err(w, f"layout desconhecido: {t}")
            continue
        if t in DARK or s.get("dark"):
            dark += 1
        if i and t == slides[i - 1].get("t") and t != "divider":
            run += 1
            if run > 3:
                r.warn(w, f"{run} slides seguidos com o layout {t}")
        else:
            run = 1
        title = s.get("title", "")
        if t not in {"cover", "divider", "statement", "quote", "closing"}:
            if not title:
                r.err(w, "slide de conteúdo sem título (action title)")
            elif words(title) > lim["title"]:
                r.warn(w, f"título com {words(title)} palavras (máx. {lim['title']} em {mode})")
            body = words({k: v for k, v in s.items() if k not in {"title"}})
            if body > lim["words"]:
                r.err(w, f"{body} palavras fora do título (máx. {lim['words']} em {mode})")
        if t == "content":
            if not (s.get("bullets") or s.get("text")):
                r.err(w, "content precisa de bullets ou text")
            if len(s.get("bullets", [])) > lim["bullets"]:
                r.err(w, f"{len(s['bullets'])} bullets (máx. {lim['bullets']} em {mode})")
        if t == "columns" and not 2 <= len(s.get("cols", [])) <= 3:
            r.err(w, "columns precisa de 2 ou 3 colunas")
        if t == "cards" and not 2 <= len(s.get("items", [])) <= 4:
            r.err(w, "cards precisa de 2 a 4 itens")
        if t == "steps" and not 3 <= len(s.get("items", [])) <= (5 if mode == "P" else 6):
            r.warn(w, "steps com quantidade fora de 3 a 5 (P) / 6 (L)")
        if t == "timeline" and not 3 <= len(s.get("items", [])) <= (6 if mode == "P" else 8):
            r.warn(w, "timeline com quantidade fora de 3 a 6 (P) / 8 (L)")
        if t == "numbers":
            n = len(s.get("items", []))
            if not 1 <= n <= lim["numbers"]:
                r.err(w, f"numbers com {n} itens (1 a {lim['numbers']} em {mode})")
            if not s.get("source"):
                r.warn(w, "números sem fonte")
        if t == "table":
            if len(s.get("head", [])) > lim["cols"] or len(s.get("rows", [])) > lim["rows"]:
                r.err(w, f"tabela grande demais para {mode} (máx. {lim['cols']}x{lim['rows']})")
        if t == "image" and not (s.get("image", {}).get("ratio") or s.get("image", {}).get("node") or s.get("image", {}).get("hash")):
            r.err(w, "imagem sem `ratio`")
        if t in {"divider", "statement", "quote", "cover"} and not (s.get("title") or s.get("text")):
            r.err(w, "slide sem texto principal")
    check_coverage(plan, slides, r, "apresentacao-16x9")
    check_density_deck(slides, mode, r)
    if slides and dark / len(slides) > 0.25:
        r.warn("doc", f"{dark}/{len(slides)} slides escuros (máx. 25%)")


def validate(plan: dict) -> Report:
    r = Report()
    fmt = plan.get("formato")
    if fmt == "documento-a4":
        check_a4(plan, r)
    elif fmt == "apresentacao-16x9":
        check_deck(plan, r)
    else:
        r.err("formato", "use 'documento-a4' ou 'apresentacao-16x9'")
    return r


def main() -> None:
    r = validate(json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")))
    sys.stdout.reconfigure(encoding="utf-8")
    for sev, where, msg in r.items:
        print(f"{sev:5} {where}: {msg}")
    print(f"{r.errors} erro(s), {len(r.items) - r.errors} aviso(s)")
    sys.exit(1 if r.errors else 0)


if __name__ == "__main__":
    main()
