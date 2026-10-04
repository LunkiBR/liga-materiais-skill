// LIA_A4 v1.4 — motor de montagem de documentos A4 (794x1123) da Liga IA UFSCar.
// Fonte versionada deste arquivo; a cópia executável vive no nó 'lib/LIA_A4' da página Sistema — Materiais.
// O plano está descrito em documento-a4/FORMAT.md. Retorna IDs, fólios, ocupação e avisos.
const LIA_A4 = (() => {
  const CFG = {
    covers: { 1: '696:55', 2: '696:61', 3: '696:67', 4: '696:73' },
    backcover: '696:74',
    colorCollection: 'Liga / Materiais',
    stylePrefix: 'Material A4/',
  };
  const W = 794, H = 1123, X0 = 64, Y0 = 76, YMAX = 1036, WIDE = 666, TEXT = 551;
  const COLW = { 2: 206, 3: 321, 4: 436, 5: 551, 6: 666 };
  const V = {}, S = {};
  const warn = [];
  let figN = 0;

  async function init() {
    figma.skipInvisibleInstanceChildren = false; // o Selo da capa nasce oculto
    const col = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === CFG.colorCollection);
    if (!col) throw new Error('Coleção de cores "' + CFG.colorCollection + '" não encontrada');
    for (const id of col.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); V[v.name.replace('cor/', '')] = v; }
    const fonts = new Map();
    for (const s of await figma.getLocalTextStylesAsync()) if (s.name.startsWith(CFG.stylePrefix)) { S[s.name.slice(CFG.stylePrefix.length)] = s; fonts.set(s.fontName.family + s.fontName.style, s.fontName); }
    for (const f of [{ family: 'Inter', style: 'Semi Bold' }, { family: 'JetBrains Mono', style: 'Regular' }, { family: 'Clash Display', style: 'Medium' }, { family: 'Clash Display', style: 'Regular' }, { family: 'Clash Display', style: 'Semibold' }, { family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Bold' }]) fonts.set(f.family + f.style, f);
    await Promise.all([...fonts.values()].map(f => figma.loadFontAsync(f)));
  }
  const paint = (name, opacity) => { const p = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V[name]); return opacity == null ? p : { ...p, opacity }; };
  function frame(dir, name, props = {}) { const f = figma.createAutoLayout(dir, { name, ...props }); f.fills = []; return f; }
  function rect(w, h, fill, name) { const r = figma.createRectangle(); r.resize(w, h); r.fills = fill ? [fill] : []; if (name) r.name = name; return r; }

  // Texto com estilo do sistema + marcação inline: **negrito** e `código`.
  async function text(str, style, color, width, opts = {}) {
    const t = figma.createText();
    await t.setTextStyleIdAsync(S[style].id);
    const ranges = []; let plain = '';
    const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g; let last = 0, m;
    const s0 = String(str);
    while ((m = re.exec(s0))) { plain += s0.slice(last, m.index); const inner = m[2] ?? m[3]; ranges.push([plain.length, plain.length + inner.length, m[2] != null ? 'b' : 'c']); plain += inner; last = re.lastIndex; }
    plain += s0.slice(last);
    if (opts.nbsp !== false && width) plain = plain.replace(/ (\S+)$/, String.fromCharCode(160) + '$1');
    t.characters = plain;
    for (const [a, b, k] of ranges) t.setRangeFontName(a, b, k === 'b' ? { family: 'Inter', style: 'Semi Bold' } : { family: 'JetBrains Mono', style: 'Regular' });
    t.fills = [paint(color)];
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT'; } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.name) t.name = opts.name;
    return t;
  }

  // ---------- blocos ----------
  const R = {};
  R.h2 = b => text(b.text, 'H2', 'titulo', TEXT, { name: 'H2' });
  R.h3 = b => text(b.text, 'H3', 'titulo', TEXT, { name: 'H3' });
  R.p = b => text(b.text, 'Corpo', 'tinta', TEXT, { name: 'Parágrafo' });
  R.lead = b => text(b.text, 'Lead', 'tinta', TEXT, { name: 'Lead' });
  R.list = async b => {
    const f = frame('VERTICAL', 'Lista', { itemSpacing: b.items.some(i => i.length > 70) ? 8 : 4 });
    let n = b.start || 1;
    for (const it of b.items) {
      const row = frame('HORIZONTAL', 'Item');
      const mk = figma.createFrame(); mk.name = 'Marcador'; mk.fills = []; mk.resize(20, 20);
      if (b.ordered) { const num = await text(`${n++}.`, 'Corpo forte', 'acento', null); mk.appendChild(num); num.y = 0; }
      else { const d = figma.createEllipse(); d.resize(5, 5); d.x = 3; d.y = 8; d.fills = [paint('acento')]; mk.appendChild(d); }
      row.appendChild(mk); row.appendChild(await text(it, 'Corpo', 'tinta', TEXT - 20)); f.appendChild(row);
    }
    return f;
  };
  R.checklist = async b => {
    const f = frame('VERTICAL', 'Checklist', { itemSpacing: 8 });
    for (const it of b.items) {
      const row = frame('HORIZONTAL', 'Item', { itemSpacing: 12 });
      const box = figma.createFrame(); box.name = 'Caixa'; box.resize(14, 14); box.cornerRadius = 3; box.fills = []; box.strokes = [paint('titulo')]; box.strokeWeight = 1.5;
      const wrap = figma.createFrame(); wrap.fills = []; wrap.resize(14, 20); wrap.name = 'Alinhador'; wrap.appendChild(box); box.y = 3;
      row.appendChild(wrap); row.appendChild(await text(it, 'Corpo', 'tinta', TEXT - 26)); f.appendChild(row);
    }
    return f;
  };
  R.steps = async b => {
    const f = frame('VERTICAL', 'Passos', { itemSpacing: 0 });
    let n = b.start || 1;
    const w = b.items.some(s => s.figure) ? WIDE : TEXT;
    for (const [i, s] of b.items.entries()) {
      const row = frame('HORIZONTAL', `Passo ${n}`, { itemSpacing: 16 });
      const rail = frame('VERTICAL', 'Trilho', { counterAxisAlignItems: 'CENTER', itemSpacing: 4 });
      const badge = figma.createAutoLayout('HORIZONTAL', { name: 'Número', primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
      badge.resize(28, 28); badge.primaryAxisSizingMode = 'FIXED'; badge.counterAxisSizingMode = 'FIXED'; badge.cornerRadius = 14; badge.fills = [paint('acento')];
      const num = await text(String(n++), 'Corpo forte', 'fundo', null); num.fontSize = 13; badge.appendChild(num); rail.appendChild(badge);
      const body = frame('VERTICAL', 'Conteúdo', { itemSpacing: 4, paddingBottom: i < b.items.length - 1 ? 24 : 0 });
      body.appendChild(await text(s.title, 'H3', 'titulo', w - 44));
      if (s.text) body.appendChild(await text(s.text, 'Corpo', 'tinta', w - 44));
      if (s.figure) { const fig = await R.figure({ ...s.figure, width: s.figure.width || 5 }, w - 44); fig.name = 'Figura do passo'; body.itemSpacing = 8; body.appendChild(fig); }
      row.appendChild(rail); row.appendChild(body); f.appendChild(row);
      if (i < b.items.length - 1) { const line = rect(2, 10, paint('powder'), 'Conector'); rail.appendChild(line); line.layoutGrow = 1; }
      rail.layoutSizingVertical = 'FILL';
    }
    return f;
  };
  const CALLOUT = {
    dica: ['tinta-clara-2', 'acento', 'acento-forte', 'tinta', 'Dica'],
    atencao: ['atencao-fundo', 'atencao-barra', 'atencao-texto', 'atencao-texto', 'Atenção'],
    exemplo: ['powder-claro', 'acento', 'acento-forte', 'tinta', 'Exemplo'],
  };
  R.callout = async b => {
    const [bg, bar, lab, ink, label] = CALLOUT[b.kind || 'dica'];
    const f = frame('HORIZONTAL', 'Callout ' + label, { itemSpacing: 0 }); f.fills = [paint(bg)]; f.cornerRadius = 8; f.clipsContent = true;
    const r = rect(3, 10, paint(bar), 'Barra'); f.appendChild(r);
    const body = frame('VERTICAL', 'Corpo', { itemSpacing: 4, paddingTop: 16, paddingBottom: 16, paddingLeft: 20, paddingRight: 20 });
    body.appendChild(await text(b.title || label, 'Eyebrow', lab, WIDE - 43, { nbsp: false }));
    body.appendChild(await text(b.text, 'Lateral', ink, WIDE - 43));
    f.appendChild(body); r.layoutSizingVertical = 'FILL';
    if (String(b.text).length > 280) warn.push(`callout com ${String(b.text).length} caracteres (máx. 280)`);
    return f;
  };
  R.figure = async (b, maxW) => {
    const w = maxW ? Math.min(maxW, COLW[b.width || 6]) : COLW[b.width || 6];
    const cap = b.main ? 576 : 430;
    let h = b._h || Math.round(w / (b.ratio || 16 / 9)); if (h > cap) { h = cap; if (!b._measure) warn.push(`figura "${b.key || b.caption}" recortada para altura ${cap}`); }
    const f = frame('VERTICAL', 'Figura', { itemSpacing: 8 });
    const img = rect(w, h, null, 'Imagem'); img.cornerRadius = 8; img.strokes = [paint('filete')]; img.strokeWeight = 1;
    if (b.hash) img.fills = [{ type: 'IMAGE', imageHash: b.hash, scaleMode: 'FILL' }];
    else if (b.node) { const src = await figma.getNodeByIdAsync(b.node); const p = src && src.fills.find(x => x.type === 'IMAGE'); img.fills = p ? [{ ...p, scaleMode: 'FILL' }] : [paint('tinta-clara-1')]; }
    else { img.fills = [paint('tinta-clara-1')]; img.name = 'Imagem pendente: ' + (b.key || 'sem-chave'); }
    f.appendChild(img);
    figN++;
    if (b.caption) f.appendChild(await text(`**Figura ${figN}.** ${b.caption}`, 'Legenda', 'secundario', w));
    f.name = `Figura ${figN}` + (b.key ? ` — ${b.key}` : '');
    return f;
  };
  R.table = async b => {
    const w = COLW[b.width || 6], nc = b.head.length;
    const fr = b.cols || Array(nc).fill(1); const sum = fr.reduce((a, c) => a + c, 0);
    const cw = fr.map(c => Math.floor(w * c / sum)); cw[nc - 1] += w - cw.reduce((a, c) => a + c, 0);
    const f = frame('VERTICAL', 'Tabela', { itemSpacing: 0 });
    const row = async (cells, head, zebra) => {
      const r = frame('HORIZONTAL', head ? 'Cabeçalho' : 'Linha'); if (zebra) r.fills = [paint('tinta-clara-1')];
      for (let i = 0; i < nc; i++) {
        const c = frame('VERTICAL', 'Célula', { paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 });
        c.appendChild(await text(cells[i] ?? '', head ? 'Cabeçalho de tabela' : 'Célula', head ? 'titulo' : 'tinta', cw[i] - 24, { align: (b.align || [])[i] === 'r' ? 'RIGHT' : 'LEFT', nbsp: false }));
        r.appendChild(c);
      }
      for (const c of r.children) c.layoutSizingVertical = 'FILL';
      return r;
    };
    f.appendChild(await row(b.head, true));
    f.appendChild(rect(w, 1.5, paint('titulo'), 'Filete do cabeçalho'));
    const zebra = b.rows.length > 8;
    for (const [i, cells] of b.rows.entries()) {
      f.appendChild(await row(cells, false, zebra && i % 2 === 1));
      if (!zebra && i < b.rows.length - 1) f.appendChild(rect(w, 1, paint('filete'), 'Filete'));
    }
    if (b.note) { f.appendChild(rect(w, 8, null, 'Espaço')); const n = await text(b.note, 'Nota', 'secundario', w); f.appendChild(n); n.name = 'Nota da tabela'; }
    return f;
  };
  R.kpis = async b => {
    const f = frame('HORIZONTAL', 'Destaques numéricos', { itemSpacing: 24 });
    for (const k of b.items.slice(0, 3)) {
      const c = frame('VERTICAL', 'Destaque', { itemSpacing: 4 }); c.resize(206, 10); c.counterAxisSizingMode = 'FIXED';
      c.appendChild(await text(k.value, 'Destaque numérico', 'acento', null, { nbsp: false }));
      c.appendChild(await text(k.label, 'Corpo forte', 'titulo', 206));
      if (k.source) c.appendChild(await text(k.source, 'Nota', 'secundario', 206));
      f.appendChild(c);
    }
    return f;
  };
  R.quote = async b => {
    const f = frame('HORIZONTAL', 'Citação', { itemSpacing: 20 });
    const bar = rect(3, 10, paint('acento'), 'Barra'); f.appendChild(bar);
    const body = frame('VERTICAL', 'Corpo', { itemSpacing: 8 });
    body.appendChild(await text(b.text, 'Citação', 'titulo', 436));
    if (b.author) body.appendChild(await text(b.author, 'Legenda', 'secundario', 436));
    f.appendChild(body); bar.layoutSizingVertical = 'FILL';
    return f;
  };
  R.cards = async b => {
    const f = frame('VERTICAL', 'Cards', { itemSpacing: 24 });
    for (let i = 0; i < b.items.length; i += 2) {
      const row = frame('HORIZONTAL', 'Linha de cards', { itemSpacing: 24 });
      for (const c of b.items.slice(i, i + 2)) {
        const card = frame('VERTICAL', 'Card', { itemSpacing: 8, paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 });
        card.cornerRadius = 12; card.fills = [paint('fundo')]; card.strokes = [paint('filete')]; card.strokeWeight = 1;
        if (c.eyebrow) card.appendChild(await text(c.eyebrow, 'Eyebrow', 'acento-forte', 281, { nbsp: false }));
        card.appendChild(await text(c.title, 'H3', 'titulo', 281));
        if (c.text) card.appendChild(await text(c.text, 'Lateral', 'tinta', 281));
        row.appendChild(card);
      }
      f.appendChild(row);
      for (const c of row.children) c.layoutSizingVertical = 'FILL';
    }
    return f;
  };
  R.code = async b => {
    const f = frame('VERTICAL', 'Código', { paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 });
    f.cornerRadius = 8; f.fills = [paint('tinta-clara-1')]; f.strokes = [paint('filete')]; f.strokeWeight = 1;
    f.appendChild(await text(b.text, 'Código', 'titulo', (b.width === 4 ? 436 : WIDE) - 32, { nbsp: false }));
    return f;
  };
  R.chapter = async b => {
    const f = frame('VERTICAL', 'Abertura de capítulo', { itemSpacing: 0 });
    f.appendChild(rect(32, 3, paint('acento'), 'Marcador'));
    const eb = await text(b.eyebrow || (b.n ? `Capítulo ${b.n}` : 'Capítulo'), 'Eyebrow', 'acento-forte', TEXT, { nbsp: false }); f.appendChild(eb);
    const h1 = await text(b.title, 'H1', 'titulo', TEXT); f.appendChild(h1);
    if (b.lead) { const l = await text(b.lead, 'Lead', 'tinta', TEXT); f.appendChild(l); }
    f.itemSpacing = 0;
    // espaçamentos internos: barra→eyebrow 12, eyebrow→H1 8, H1→lead 16
    const kids = f.children; const pads = [0, 12, 8, 16];
    kids.forEach((k, i) => { if (i > 0) { const sp = rect(1, pads[i], null, 'Espaço'); f.insertChild(f.children.indexOf(k), sp); } });
    return f;
  };

  // ---------- espaçamento entre blocos ----------
  const BEFORE = { h2: 40, h3: 28, p: 12, lead: 12, list: 12, checklist: 12, code: 12, steps: 24, callout: 24, figure: 24, table: 24, kpis: 24, quote: 24, cards: 24 };
  const BOXY = new Set(['figure', 'table', 'callout', 'kpis', 'quote', 'cards', 'steps', 'code']);
  function gap(prev, cur) {
    if (!prev) return 0;
    if (prev === 'h2') return 12; if (prev === 'h3') return 8; if (prev === 'chapter') return 24;
    if (BOXY.has(prev) && !['h2', 'h3'].includes(cur)) return 24;
    return BEFORE[cur] ?? 16;
  }
  const HILITE = new Set(['callout', 'kpis', 'quote', 'cards']);
  const HEAD = new Set(['h2', 'h3']);
  // mede um bloco sem efeitos colaterais (contador de figuras, avisos)
  async function measure(b) { const keep = figN, nw = warn.length; const n = await R[b.t]({ ...b, _measure: true }); const h = n.height; n.remove(); figN = keep; warn.length = nw; return h; }
  // altura mínima que precisa acompanhar um título: 3 linhas, 2 itens, 1 passo, cabeçalho + 2 linhas ou o bloco inteiro
  async function minHeight(b) {
    if (b.t === 'p') return Math.min(60, await measure(b));
    // listas e tabelas só se dividem com 2 itens de cada lado; abaixo disso o bloco é indivisível
    if (b.t === 'list' || b.t === 'checklist') return measure(b.items.length >= 4 ? { ...b, items: b.items.slice(0, 2) } : b);
    if (b.t === 'steps') return measure(b.items.length >= 2 ? { ...b, items: b.items.slice(0, 1) } : b);
    if (b.t === 'table') return measure(b.rows.length >= 4 ? { ...b, rows: b.rows.slice(0, 2), note: null } : b);
    return R[b.t] ? measure(b) : 0;
  }

  // ---------- divisão de blocos ----------
  async function split(b, avail) {
    const fits = async part => (await measure(part)) <= avail;
    if (b.t === 'p') {
      const words = String(b.text).split(' ');
      if (avail < 40 || words.length < 24) return null;
      let lo = 12, hi = words.length - 12, best = 0;
      while (lo <= hi) { const mid = (lo + hi) >> 1; if (await fits({ ...b, text: words.slice(0, mid).join(' ') })) { best = mid; lo = mid + 1; } else hi = mid - 1; }
      return best ? [{ ...b, text: words.slice(0, best).join(' ') }, { ...b, text: words.slice(best).join(' ') }] : null;
    }
    const key = b.t === 'table' ? 'rows' : 'items';
    if (!['list', 'checklist', 'steps', 'table', 'cards'].includes(b.t)) return null;
    const arr = b[key], min = b.t === 'steps' ? 1 : 2, step = b.t === 'cards' ? 2 : 1;
    for (let k = arr.length - min; k >= min; k -= step) {
      const head = { ...b, [key]: arr.slice(0, k) };
      if (b.t === 'table') delete head.note;
      if (await fits(head)) { const rest = { ...b, [key]: arr.slice(k) }; if (b.ordered || b.t === 'steps') rest.start = (b.start || 1) + k; return [head, rest]; }
    }
    return null;
  }

  // ---------- páginas ----------
  let wrapper, pages = [], cur = null, folio = 0, doc, chapterTitle = '';
  function newPageFrame(name) {
    const p = figma.createFrame(); p.resize(W, H); p.fills = [paint('fundo')]; p.clipsContent = true; p.name = name;
    wrapper.appendChild(p); return p;
  }
  async function chrome(p, opening) {
    const left = await text(doc.short || doc.title, 'Corrente', 'secundario', null, { nbsp: false }); left.name = 'Corrente — documento'; p.appendChild(left); left.x = X0; left.y = 30;
    if (!opening && chapterTitle) { const right = await text(chapterTitle, 'Corrente', 'secundario', null, { nbsp: false }); right.name = 'Corrente — capítulo'; p.appendChild(right); right.x = 730 - right.width; right.y = 30; }
    const r1 = rect(WIDE, 1, paint('filete'), 'Corrente — filete'); p.appendChild(r1); r1.x = X0; r1.y = 52;
    const r2 = rect(WIDE, 1, paint('filete'), 'Rodapé — filete'); p.appendChild(r2); r2.x = X0; r2.y = 1050;
    const org = await text(doc.org || 'Liga de Inteligência Artificial da UFSCar', 'Corrente', 'secundario', null, { nbsp: false }); org.name = 'Rodapé — assinatura'; p.appendChild(org); org.x = X0; org.y = 1056;
    const fo = await text(String(folio).padStart(2, '0'), 'Fólio', 'tinta', null, { nbsp: false }); fo.name = 'Rodapé — fólio'; p.appendChild(fo); fo.x = 730 - fo.width; fo.y = 1055;
  }
  async function openPage(opening) {
    folio++;
    const p = newPageFrame(`${String(folio).padStart(2, '0')} — ${opening ? 'Abertura' : 'Corpo'}`);
    await chrome(p, opening);
    cur = { frame: p, y: Y0, prev: null, blocks: 0, hilite: 0, words: 0, kind: opening ? 'abertura' : 'corpo', chapter: chapterTitle };
    pages.push(cur);
  }
  function place(node, b, g) {
    cur.frame.appendChild(node); node.x = X0; node.y = cur.y + g; cur.y = node.y + node.height; cur.prev = b.t; cur.blocks++; cur.last = { node, b, top: node.y - g };
    node.name = 'bloco/' + b.t + ' — ' + node.name;
    if (HILITE.has(b.t)) cur.hilite++;
    const texts = node.type === 'TEXT' ? [node] : node.findAllWithCriteria({ types: ['TEXT'] });
    cur.words += texts.reduce((a, t) => a + t.characters.split(/\s+/).length, 0);
  }

  async function flow(blocks) {
    const q = blocks.slice();
    while (q.length) {
      const b = q.shift();
      if (b.t === 'pagebreak') { await openPage(false); continue; }
      if (b.t === 'chapter') {
        // 'page': todo capítulo abre página; 'auto' (padrão): só se sobrar < 40% da página atual
        chapterTitle = b.short || b.title;
        const mode = doc.chapterBreak || 'auto';
        const room = cur ? (YMAX - cur.y) / (YMAX - Y0) : 0;
        if (!cur || (cur.blocks > 0 && (mode === 'page' || room < 0.4))) await openPage(true);
        else if (!cur.blocks) cur.kind = 'abertura';
        let n = await R.chapter(b); const g = cur.blocks ? 64 : 0;
        const need = q.length ? 24 + await minHeight(q[0]) : 0;
        if (cur.blocks && cur.y + g + n.height + need > YMAX) { n.remove(); await openPage(true); n = await R.chapter(b); place(n, b, 0); } else place(n, b, g);
        continue;
      }
      if (!cur) await openPage(false);
      let g = cur.blocks ? gap(cur.prev, b.t) : 0;
      let node = await R[b.t](b);
      // título nunca sozinho no fim: reserva o próximo bloco (ou 3 linhas)
      if (HEAD.has(b.t) && q.length) {
        const nx = q[0]; const need = await minHeight(nx);
        if (cur.y + g + node.height + gap(b.t, nx.t) + need > YMAX && cur.blocks) { await openPage(false); g = 0; }
      }
      if (cur.y + g + node.height <= YMAX) { place(node, b, g); continue; }
      const dims = b.t === 'figure' ? [node.children[0].height, node.height] : null;
      node.remove();
      // figura pode encolher até 85% da altura planejada para fechar a página
      if (dims && cur.blocks) {
        const imgH = dims[0], capH = dims[1] - imgH, room = YMAX - cur.y - g - capH;
        if (room >= 0.85 * imgH) { const n1 = await R.figure({ ...b, _h: Math.floor(room) }); place(n1, b, g); continue; }
      }
      if (cur.blocks && HILITE.has(b.t) === false) {
        const parts = await split(b, YMAX - cur.y - g);
        if (parts) { const n1 = await R[b.t](parts[0]); place(n1, b, g); q.unshift(parts[1]); await openPage(false); continue; }
      }
      if (cur.blocks) {
        // rede de segurança: título nunca fica no fim da página quando o bloco seguinte muda de página
        if (cur.blocks > 1 && (HEAD.has(cur.prev) || cur.prev === 'chapter')) { const { node: hn, b: hb, top } = cur.last; hn.remove(); cur.blocks--; cur.y = top; q.unshift(b); q.unshift(hb); if (hb.t === 'chapter') chapterTitle = cur.chapter; await openPage(hb.t === 'chapter'); continue; }
        await openPage(false); q.unshift(b); continue;
      }
      // bloco maior que uma página vazia
      const parts = await split(b, YMAX - Y0);
      if (parts) { const n1 = await R[b.t](parts[0]); place(n1, b, 0); q.unshift(parts[1]); await openPage(false); continue; }
      const n2 = await R[b.t](b); place(n2, b, 0); warn.push(`bloco ${b.t} excede a área útil na página ${folio}`);
    }
  }

  async function cover(c) {
    const comp = await figma.getNodeByIdAsync(CFG.covers[c.variant || 2]);
    const inst = comp.createInstance(); wrapper.appendChild(inst); folio++; inst.name = `${String(folio).padStart(2, '0')} — Capa`;
    const t = inst.findOne(n => n.name === 'Título'), s = inst.findOne(n => n.name === 'Subtítulo'), selo = inst.findOne(n => n.name === 'Selo');
    t.characters = c.title + (c.titleLight ? '\n' + c.titleLight : '');
    t.setRangeFontName(0, t.characters.length, { family: 'Clash Display', style: 'Medium' });
    if (c.titleLight) t.setRangeFontName(c.title.length + 1, t.characters.length, { family: 'Clash Display', style: 'Regular' });
    if (t.height > 3 * 68) { t.fontSize = 52; t.lineHeight = { unit: 'PIXELS', value: 56 }; warn.push('título da capa longo: reduzido para 52 px'); }
    s.characters = c.subtitle || '';
    s.visible = !!c.subtitle;
    if (c.seal) { selo.visible = true; selo.findOne(n => n.type === 'TEXT').characters = c.seal; } else selo.visible = false;
    const blk = inst.findOne(n => n.name === 'Bloco de título'); if (blk.y + blk.height > 470) warn.push('bloco de título da capa invade a arte');
    pages.push({ frame: inst, kind: 'capa', y: 0, blocks: 1, words: 0, hilite: 0 });
  }
  async function backcover(c) {
    const comp = await figma.getNodeByIdAsync(CFG.backcover);
    const inst = comp.createInstance(); wrapper.appendChild(inst); folio++; inst.name = `${String(folio).padStart(2, '0')} — Contracapa`;
    for (const [k, v] of Object.entries(c || {})) { const n = inst.findOne(x => x.type === 'TEXT' && x.name === k); if (n) n.characters = v; }
    pages.push({ frame: inst, kind: 'contracapa', y: 0, blocks: 1, words: 0, hilite: 0 });
  }

  // ---------- QA (FORMAT.md, seção QA) ----------
  const FAMILIES = new Set(['Clash Display', 'Inter', 'JetBrains Mono']);
  const SIZES = new Set([9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 36, 52, 56, 64, 72]);
  async function qa(wrapperId) {
    figma.skipInvisibleInstanceChildren = false;
    const wr = await figma.getNodeByIdAsync(wrapperId); const out = [];
    const frames = wr.children.filter(n => n.type === 'FRAME' || n.type === 'INSTANCE');
    const add = (page, sev, rule, detail) => out.push({ page, sev, rule, detail });
    let figSeen = 0;
    frames.forEach((p, i) => {
      if (p.type === 'INSTANCE') return; // capa e contracapa são componentes aprovados
      const pb = p.absoluteBoundingBox;
      const blocks = p.children.filter(n => n.name.startsWith('bloco/')).sort((a, b) => a.y - b.y);
      const bottom = blocks.length ? Math.max(...blocks.map(b => b.y + b.height)) : Y0;
      const occ = (bottom - Y0) / (YMAX - Y0);
      const next = frames[i + 1];
      const isLast = !next || next.type === 'INSTANCE';
      const nextOpens = next && next.type === 'FRAME' && next.children.some(n => n.name.startsWith('bloco/chapter') && Math.abs(n.y - Y0) < 2);
      const min = isLast ? 0.35 : nextOpens ? 0.5 : 0.88;
      if (occ < min) add(p.name, occ < min - 0.3 ? 'ERROR' : 'WARNING', 'Q15 ocupação', `${occ.toFixed(2)} < ${min}`);
      for (let k = 1; k < blocks.length; k++) { const gp = blocks[k].y - (blocks[k - 1].y + blocks[k - 1].height); if (gp > 80) add(p.name, 'WARNING', 'Q16 vazio entre blocos', `${Math.round(gp)} px antes de ${blocks[k].name}`); }
      const last = blocks[blocks.length - 1];
      if (last && /^bloco\/(h2|h3|chapter)/.test(last.name) && !isLast) add(p.name, 'ERROR', 'Q17 título no fim da página', last.name);
      const hl = blocks.filter(b => /^bloco\/(callout|kpis|quote|cards)/.test(b.name)).length; if (hl > 2) add(p.name, 'WARNING', 'Q21 destaques', `${hl} > 2`);
      const figs = p.findAll(n => /^Figura \d+/.test(n.name)); if (figs.length > 2) add(p.name, 'WARNING', 'Q25 figuras por página', `${figs.length} > 2`);
      // densidade: página de corpo precisa de texto, não só de caixas e respiros
      const pw = blocks.reduce((a, b) => a + (b.type === 'TEXT' ? [b] : b.findAllWithCriteria({ types: ['TEXT'] })).reduce((x, t) => x + t.characters.split(/\s+/).filter(Boolean).length, 0), 0);
      const floor = figs.length ? 120 : 200;
      if (!isLast && pw < floor) add(p.name, 'WARNING', 'Q18 página rala', `${pw} palavras (mín. ${floor}; alvo 280 a 380)`);
      for (const f of figs) { const nnum = +f.name.match(/^Figura (\d+)/)[1]; if (nnum !== figSeen + 1) add(p.name, 'ERROR', 'Q25 numeração de figuras', `${nnum} após ${figSeen}`); figSeen = nnum; }
      for (const t of p.findAllWithCriteria({ types: ['TEXT'] })) {
        for (const sg of t.getStyledTextSegments(['fontName', 'fontSize'])) {
          if (!FAMILIES.has(sg.fontName.family)) add(p.name, 'ERROR', 'Q09 família', `${sg.fontName.family} em "${t.characters.slice(0, 24)}"`);
          if (!SIZES.has(sg.fontSize)) add(p.name, 'WARNING', 'Q07 tamanho fora da escala', `${sg.fontSize}px em "${t.characters.slice(0, 24)}"`);
        }
        if (/^(Corrente|Rodapé)/.test(t.name)) continue;
        const b = t.absoluteBoundingBox; const x0 = b.x - pb.x, y0 = b.y - pb.y;
        if (x0 < X0 - 1 || x0 + b.width > 730 + 1 || y0 < Y0 - 1 || y0 + b.height > YMAX + 1) add(p.name, 'ERROR', 'Q02 fora da área útil', `"${t.characters.slice(0, 24)}"`);
      }
      for (const n of p.findAll(n => n.name.startsWith('Imagem pendente') && !n.fills.some(f => f.type === 'IMAGE'))) add(p.name, 'REVIEW', 'imagem pendente', n.name.replace('Imagem pendente: ', ''));
    });
    return out;
  }

  async function build(plan) {
    await init();
    doc = plan.doc;
    let page;
    if (doc.pageId) page = await figma.getNodeByIdAsync(doc.pageId); else { page = figma.createPage(); page.name = doc.pageName || ('Material — ' + doc.title); }
    await figma.setCurrentPageAsync(page);
    let maxY = 0; for (const c of page.children) maxY = Math.max(maxY, c.y + c.height);
    if (doc.resume) { wrapper = await figma.getNodeByIdAsync(doc.resume.wrapper); folio = doc.resume.folio; chapterTitle = doc.resume.chapter || ''; figN = doc.resume.figures || 0; }
    else {
      wrapper = figma.createAutoLayout('HORIZONTAL', { name: 'Documento A4 — ' + doc.title, itemSpacing: 40, counterAxisSpacing: 40, paddingTop: 80, paddingBottom: 80, paddingLeft: 80, paddingRight: 80 });
      wrapper.layoutWrap = 'WRAP'; wrapper.resize(80 * 2 + 5 * W + 4 * 40, 100); wrapper.primaryAxisSizingMode = 'FIXED'; wrapper.counterAxisSizingMode = 'AUTO'; wrapper.fills = [{ type: 'SOLID', color: { r: 0.91, g: 0.93, b: 0.96 } }];
      wrapper.x = 0; wrapper.y = maxY ? maxY + 400 : 0;
    }
    if (plan.cover) await cover(plan.cover);
    cur = null;
    await flow(plan.blocks || []);
    if (plan.backcover !== undefined && plan.backcover !== false) await backcover(plan.backcover);
    const report = pages.map(p => ({ id: p.frame.id, name: p.frame.name, kind: p.kind, occupancy: p.kind === 'corpo' || p.kind === 'abertura' ? +((p.y - Y0) / (YMAX - Y0)).toFixed(2) : null, words: p.words, highlights: p.hilite }));
    const pending = wrapper.findAll(n => n.name.startsWith('Imagem pendente') && !n.fills.some(f => f.type === 'IMAGE')).map(n => ({ id: n.id, name: n.name, w: n.width, h: n.height }));
    const issues = plan.skipQA ? [] : await qa(wrapper.id);
    return { pageId: page.id, wrapper: wrapper.id, resume: { wrapper: wrapper.id, folio, chapter: chapterTitle, figures: figN }, pages: report, pendingImages: pending, warnings: warn, qa: issues };
  }
  return { build, qa, version: '1.4' };
})();
return LIA_A4;
