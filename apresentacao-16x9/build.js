// LIA_DECK — motor de montagem de apresentações 16:9 (1920x1080) da Liga IA UFSCar.
// Fonte versionada deste arquivo; a cópia executável vive no nó 'lib/LIA_DECK' da página Sistema — Materiais.
// O plano está descrito em apresentacao-16x9/FORMAT.md. Retorna IDs, palavras por slide e QA.
const LIA_DECK = (() => {
  const CFG = { covers: { 1: '696:55', 2: '696:61', 3: '696:67', 4: '696:73' }, colorCollection: 'Liga / Materiais' };
  const W = 1920, H = 1080, L = 120, R = 1800, TOP = 72, CT = 264, CB = 936, FT = 960;
  const col = n => n * 118 + (n - 1) * 24; const cx = i => L + i * 142;
  const V = {}, S = {}; let MODE = 'P', doc, wrapper, slides = [], num = 0, section = '';
  const LIMIT = { P: { words: 35, bullets: 4, cards: 4 }, L: { words: 200, bullets: 6, cards: 6 } };

  async function init(mode) {
    figma.skipInvisibleInstanceChildren = false;
    MODE = mode === 'L' ? 'L' : 'P';
    const colc = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === CFG.colorCollection);
    for (const id of colc.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); V[v.name.replace('cor/', '')] = v; }
    const fonts = new Map();
    for (const s of await figma.getLocalTextStylesAsync()) if (s.name.startsWith('Deck ' + MODE + '/')) { S[s.name.split('/')[1]] = s; fonts.set(s.fontName.family + s.fontName.style, s.fontName); }
    for (const f of [['Inter', 'Semi Bold'], ['Inter', 'Regular'], ['Clash Display', 'Semibold'], ['Clash Display', 'Medium'], ['Clash Display', 'Regular'], ['JetBrains Mono', 'Regular']]) fonts.set(f.join(''), { family: f[0], style: f[1] });
    await Promise.all([...fonts.values()].map(f => figma.loadFontAsync(f)));
  }
  const paint = (name, op) => { const p = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V[name]); return op == null ? p : { ...p, opacity: op }; };
  function al(dir, name, props = {}) { const f = figma.createAutoLayout(dir, { name, ...props }); f.fills = []; return f; }
  function rect(w, h, fill, name) { const r = figma.createRectangle(); r.resize(w, h); r.fills = fill ? [fill] : []; if (name) r.name = name; return r; }
  async function text(str, style, color, width, opts = {}) {
    const t = figma.createText(); await t.setTextStyleIdAsync(S[style].id);
    const ranges = []; let plain = ''; const re = /(\*\*([^*]+)\*\*|==([^=]+)==)/g; let last = 0, m; const s0 = String(str);
    while ((m = re.exec(s0))) { plain += s0.slice(last, m.index); const inner = m[2] ?? m[3]; ranges.push([plain.length, plain.length + inner.length, m[2] != null ? 'b' : 'a']); plain += inner; last = re.lastIndex; }
    plain += s0.slice(last);
    if (width && opts.nbsp !== false) plain = plain.replace(/ (\S+)$/, String.fromCharCode(160) + '$1');
    t.characters = plain; t.fills = [paint(color)];
    // **negrito**; ==destaque== pinta com o acento do fundo (claro: acento, escuro: powder)
    for (const [a, b, k] of ranges) { if (k === 'b') t.setRangeFontName(a, b, { family: S[style].fontName.family, style: S[style].fontName.family === 'Inter' ? 'Semi Bold' : 'Semibold' }); else t.setRangeFills(a, b, [paint(opts.dark ? 'powder' : 'acento')]); }
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT'; } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
    if (opts.name) t.name = opts.name; return t;
  }
  function put(slide, node, x, y, name) { slide.appendChild(node); node.x = x; node.y = y; if (name) node.name = 'bloco/' + name; return node; }

  // ---------- moldura ----------
  function newSlide(kind, dark) {
    num++; const s = figma.createFrame(); s.resize(W, H); s.clipsContent = true; s.name = `${String(num).padStart(2, '0')} — ${kind}`;
    s.fills = [paint(dark ? 'titulo' : 'fundo')]; wrapper.appendChild(s);
    const rec = { frame: s, kind, dark, words: 0 }; slides.push(rec); return rec;
  }
  async function footer(rec) {
    const s = rec.frame;
    const left = await text([doc.footer || 'Liga IA UFSCar', section].filter(Boolean).join('  ·  '), 'Rodapé', rec.dark ? 'acento-sobre-escuro' : 'secundario', null, { nbsp: false });
    put(s, left, L, FT + 8); left.name = 'Rodapé — seção';
    const n = await text(String(num).padStart(2, '0'), 'Rodapé', rec.dark ? 'acento-sobre-escuro' : 'secundario', null, { nbsp: false });
    put(s, n, R - n.width, FT + 8); n.name = 'Rodapé — número';
  }
  async function title(rec, str, lead) {
    const t = await text(str, 'Título', rec.dark ? 'fundo' : 'titulo', col(10)); put(rec.frame, t, L, TOP, 'titulo');
    let y = t.y + t.height;
    if (lead) { const l = await text(lead, 'Lead', rec.dark ? 'powder' : 'secundario', col(9)); put(rec.frame, l, L, y + 16, 'lead'); y = l.y + l.height; }
    return Math.max(CT, y + 48);
  }
  async function bullets(items, width, dark) {
    const f = al('VERTICAL', 'Lista', { itemSpacing: MODE === 'P' ? 24 : 16 });
    for (const it of items) {
      const row = al('HORIZONTAL', 'Item', { itemSpacing: MODE === 'P' ? 24 : 16 });
      const mk = figma.createFrame(); mk.fills = []; mk.name = 'Marcador'; const lh = S.Corpo.lineHeight.value; mk.resize(12, lh);
      const d = figma.createEllipse(); const ds = MODE === 'P' ? 12 : 9; d.resize(ds, ds); d.fills = [paint(dark ? 'powder' : 'acento')]; mk.appendChild(d); d.y = (lh - ds) / 2;
      row.appendChild(mk); row.appendChild(await text(it, 'Corpo', dark ? 'fundo' : 'tinta', width - 36, { dark })); f.appendChild(row);
    }
    return f;
  }
  async function card(c, w, opts = {}) {
    const pad = MODE === 'P' ? 40 : 32;
    const f = al('VERTICAL', 'Card', { itemSpacing: 12, paddingTop: pad, paddingBottom: pad, paddingLeft: pad, paddingRight: pad });
    f.resize(w, 10); f.counterAxisSizingMode = 'FIXED'; f.primaryAxisSizingMode = 'AUTO'; f.cornerRadius = 24;
    f.fills = [paint(c.accent ? 'tinta-clara-2' : 'fundo')]; f.strokes = [paint(c.accent ? 'acento' : 'filete')]; f.strokeWeight = c.accent ? 2 : 1.5;
    if (c.eyebrow || c.label) f.appendChild(await text(c.eyebrow || c.label, 'Rótulo', c.accent ? 'acento' : 'acento-forte', w - 2 * pad, { nbsp: false }));
    if (c.title) f.appendChild(await text(c.title, 'Título de card', 'titulo', w - 2 * pad));
    if (c.text) f.appendChild(await text(c.text, opts.small ? 'Legenda' : 'Corpo', 'tinta', w - 2 * pad));
    if (c.items) f.appendChild(await bullets(c.items, w - 2 * pad, false));
    return f;
  }
  async function figureRect(img, w, h) {
    const r = rect(w, h, null, 'Imagem'); r.cornerRadius = 24; r.strokes = [paint('filete')]; r.strokeWeight = 1.5;
    if (img && img.hash) r.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL' }];
    else if (img && img.node) { const s = await figma.getNodeByIdAsync(img.node); const p = s && s.fills.find(x => x.type === 'IMAGE'); r.fills = p ? [{ ...p, scaleMode: 'FILL' }] : [paint('tinta-clara-1')]; }
    else { r.fills = [paint('tinta-clara-1')]; r.name = 'Imagem pendente: ' + ((img && img.key) || 'sem-chave'); }
    return r;
  }

  // ---------- layouts ----------
  const LAY = {};
  LAY.cover = async b => {
    const rec = newSlide('Capa', false); const s = rec.frame;
    const comp = await figma.getNodeByIdAsync(CFG.covers[b.variant || 2]);
    s.fills = comp.fills.map(p => ({ ...p }));
    const art = comp.findOne(n => n.name === 'Arte'); const ip = art.fills.find(p => p.type === 'IMAGE');
    const a = rect(864, H, { type: 'IMAGE', imageHash: ip.imageHash, scaleMode: 'FILL' }, 'Arte'); put(s, a, W - 864, 0);
    const logo = comp.findOne(n => n.name === 'Logo').clone(); logo.rescale(1.5); put(s, logo, L, TOP); logo.name = 'Logo';
    const tc = comp.findOne(n => n.name === 'Título').fills, sc = comp.findOne(n => n.name === 'Subtítulo').fills;
    const blk = al('VERTICAL', 'Bloco de título', { itemSpacing: 24 });
    if (b.seal) { const chip = al('HORIZONTAL', 'Selo', { paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20 }); chip.cornerRadius = 8; chip.fills = [paint('powder')]; chip.appendChild(await text(b.seal, 'Rótulo', 'titulo', null, { nbsp: false })); blk.appendChild(chip); }
    const t = await text(b.title + (b.titleLight ? '\n' + b.titleLight : ''), 'Capa', 'titulo', 816);
    t.setRangeFontName(0, t.characters.length, { family: 'Clash Display', style: 'Medium' });
    if (b.titleLight) t.setRangeFontName(b.title.length + 1, t.characters.length, { family: 'Clash Display', style: 'Regular' });
    t.fills = tc; blk.appendChild(t);
    if (b.subtitle) { const st = await text(b.subtitle, 'Lead', 'tinta', 760); st.fills = sc; blk.appendChild(st); }
    if (b.meta) { const mt = await text(b.meta, 'Rodapé', 'secundario', 760, { nbsp: false }); mt.fills = sc; blk.appendChild(mt); }
    put(s, blk, L, 0, 'capa'); blk.y = CB - blk.height;
    return rec;
  };
  LAY.agenda = async b => {
    const rec = newSlide('Agenda', false); let y = await title(rec, b.title || 'Agenda');
    const two = b.items.length > 3; const w = two ? col(6) : col(8);
    const grid = al('HORIZONTAL', 'Itens', { itemSpacing: 24, counterAxisSpacing: MODE === 'P' ? 40 : 32 }); grid.layoutWrap = 'WRAP'; grid.resize(two ? col(12) : col(8), 10); grid.primaryAxisSizingMode = 'FIXED'; grid.counterAxisSizingMode = 'AUTO';
    for (const [i, it] of b.items.entries()) {
      const row = al('HORIZONTAL', 'Item', { itemSpacing: 32 }); row.resize(w, 10); row.primaryAxisSizingMode = 'FIXED'; row.counterAxisSizingMode = 'AUTO';
      row.appendChild(await text(String(i + 1).padStart(2, '0'), 'Título', 'acento', null, { nbsp: false }));
      const txt = al('VERTICAL', 'Texto', { itemSpacing: 8 }); txt.appendChild(await text(it.title, 'Título de card', 'titulo', w - 160)); if (it.text) txt.appendChild(await text(it.text, 'Legenda', 'secundario', w - 160)); row.appendChild(txt);
      grid.appendChild(row);
    }
    put(rec.frame, grid, L, y, 'agenda'); await footer(rec); return rec;
  };
  LAY.divider = async b => {
    const rec = newSlide('Divisor', true); section = b.short || b.title;
    const n = await text(b.n || String(slides.filter(x => x.kind === 'Divisor').length).padStart(2, '0'), 'Numeral', 'powder', null, { nbsp: false });
    put(rec.frame, n, L - 12, 0, 'numeral'); n.y = 380 - n.height / 2 - 40;
    const t = await text(b.title, 'Divisor', 'fundo', col(10)); put(rec.frame, t, L, n.y + n.height + 24, 'titulo');
    if (b.text) { const l = await text(b.text, 'Lead', 'powder', col(8)); put(rec.frame, l, L, t.y + t.height + 24, 'lead'); }
    return rec;
  };
  LAY.statement = async b => {
    const rec = newSlide('Statement', !!b.dark);
    const t = await text(b.text, 'Statement', rec.dark ? 'fundo' : 'titulo', col(10), { dark: rec.dark }); put(rec.frame, t, L, 0, 'statement'); t.y = (H - t.height) / 2 - 24;
    if (b.author) { const a = await text(b.author, 'Legenda', rec.dark ? 'powder' : 'secundario', col(8)); put(rec.frame, a, L, t.y + t.height + 32, 'autor'); }
    await footer(rec); return rec;
  };
  LAY.content = async b => {
    const rec = newSlide('Conteúdo', false); const y = await title(rec, b.title, b.lead);
    const side = b.side; const mainW = side ? col(7) : col(8);
    if (b.text) { const p = await text(b.text, 'Corpo', 'tinta', mainW); put(rec.frame, p, L, y, 'texto'); }
    if (b.bullets) { const yy = b.text ? rec.frame.children[rec.frame.children.length - 1].y + rec.frame.children[rec.frame.children.length - 1].height + 32 : y; put(rec.frame, await bullets(b.bullets, mainW, false), L, yy, 'lista'); }
    if (side) {
      const sx = cx(8), sw = col(4);
      if (side.image) put(rec.frame, await figureRect(side.image, sw, Math.min(CB - y, Math.round(sw / (side.image.ratio || 0.8)))), sx, y, 'imagem');
      else if (side.value) { const k = al('VERTICAL', 'Destaque', { itemSpacing: 8 }); k.appendChild(await text(side.value, 'Statement', 'acento', null, { nbsp: false })); k.appendChild(await text(side.label || '', 'Título de card', 'titulo', sw)); if (side.source) k.appendChild(await text(side.source, 'Legenda', 'secundario', sw)); put(rec.frame, k, sx, y, 'destaque'); }
      else put(rec.frame, await card({ ...side, accent: true }, sw, { small: true }), sx, y, 'card');
    }
    await footer(rec); return rec;
  };
  LAY.columns = async b => {
    const rec = newSlide('Colunas', false); const y = await title(rec, b.title, b.lead);
    const n = b.cols.length, span = n === 2 ? 6 : 4; const row = al('HORIZONTAL', 'Colunas', { itemSpacing: 24 });
    for (const c of b.cols) row.appendChild(await card(c, col(span)));
    for (const c of row.children) c.layoutSizingVertical = 'FILL';
    put(rec.frame, row, L, y, 'colunas');
    if (b.verdict) { const v = await text(b.verdict, 'Lead', 'titulo', col(12)); put(rec.frame, v, L, row.y + row.height + 40, 'veredito'); }
    await footer(rec); return rec;
  };
  LAY.cards = async b => {
    const rec = newSlide('Cards', false); const y = await title(rec, b.title, b.lead);
    const n = Math.min(b.items.length, 4), span = 12 / n; const row = al('HORIZONTAL', 'Cards', { itemSpacing: 24 });
    for (const c of b.items.slice(0, 4)) row.appendChild(await card(c, col(span), { small: n === 4 }));
    for (const c of row.children) c.layoutSizingVertical = 'FILL';
    put(rec.frame, row, L, y, 'cards'); await footer(rec); return rec;
  };
  LAY.steps = async b => {
    const rec = newSlide('Passos', false); const y = await title(rec, b.title, b.lead);
    const n = b.items.length, w = Math.floor((col(12) - (n - 1) * 24) / n);
    const line = rect(col(12) - w, 3, paint('powder'), 'Conector'); put(rec.frame, line, L + w / 2, y + 36);
    for (const [i, it] of b.items.entries()) {
      const c = al('VERTICAL', `Passo ${i + 1}`, { itemSpacing: 16 }); c.resize(w, 10); c.counterAxisSizingMode = 'FIXED'; c.primaryAxisSizingMode = 'AUTO';
      const badge = figma.createAutoLayout('HORIZONTAL', { name: 'Número', primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' }); badge.resize(72, 72); badge.primaryAxisSizingMode = 'FIXED'; badge.counterAxisSizingMode = 'FIXED'; badge.cornerRadius = 36; badge.fills = [paint(i === b.current ? 'acento' : 'titulo')];
      badge.appendChild(await text(String(i + 1), 'Título de card', 'fundo', null, { nbsp: false })); c.appendChild(badge);
      c.appendChild(await text(it.title, 'Título de card', 'titulo', w)); if (it.text) c.appendChild(await text(it.text, 'Legenda', 'tinta', w));
      put(rec.frame, c, L + i * (w + 24), y, 'passo');
    }
    rec.frame.children.find(n => n.name === 'Conector').x = L + 36; rec.frame.children.find(n => n.name === 'Conector').resize((n - 1) * (w + 24), 3);
    await footer(rec); return rec;
  };
  LAY.timeline = async b => {
    const rec = newSlide('Linha do tempo', false); const y = await title(rec, b.title, b.lead);
    const n = b.items.length, w = Math.floor((col(12) - (n - 1) * 24) / n), ay = y + 24;
    put(rec.frame, rect(col(12), 3, paint('filete'), 'Eixo'), L, ay + 10);
    for (const [i, it] of b.items.entries()) {
      const x = L + i * (w + 24); const on = !!it.current;
      const d = figma.createEllipse(); d.resize(24, 24); d.fills = [paint(on ? 'acento' : 'fundo')]; d.strokes = [paint(on ? 'acento' : 'titulo')]; d.strokeWeight = 3; put(rec.frame, d, x, ay);
      const c = al('VERTICAL', 'Marco', { itemSpacing: 12 }); c.resize(w, 10); c.counterAxisSizingMode = 'FIXED'; c.primaryAxisSizingMode = 'AUTO';
      c.appendChild(await text(it.date, 'Rótulo', on ? 'acento' : 'acento-forte', w, { nbsp: false })); c.appendChild(await text(it.title, 'Título de card', 'titulo', w)); if (it.text) c.appendChild(await text(it.text, 'Legenda', 'tinta', w));
      put(rec.frame, c, x, ay + 56, 'marco');
    }
    await footer(rec); return rec;
  };
  LAY.numbers = async b => {
    const rec = newSlide('Números', false); const y = await title(rec, b.title, b.lead);
    const n = Math.min(b.items.length, MODE === 'P' ? 3 : 4), span = 12 / n; const row = al('HORIZONTAL', 'Números', { itemSpacing: 24 });
    for (const [i, k] of b.items.slice(0, n).entries()) {
      const c = al('VERTICAL', 'Número', { itemSpacing: 12 }); c.resize(col(span), 10); c.counterAxisSizingMode = 'FIXED'; c.primaryAxisSizingMode = 'AUTO';
      c.appendChild(await text(k.value, n === 1 ? 'Numeral' : 'Divisor', i === (b.focus ?? 0) ? 'acento' : 'titulo', null, { nbsp: false }));
      c.appendChild(await text(k.label, 'Título de card', 'titulo', col(span))); if (k.context) c.appendChild(await text(k.context, 'Legenda', 'secundario', col(span)));
      row.appendChild(c);
    }
    put(rec.frame, row, L, y + 24, 'numeros');
    if (b.source) { const s = await text('Fonte: ' + b.source, 'Rodapé', 'secundario', col(10), { nbsp: false }); put(rec.frame, s, L, CB - s.height, 'fonte'); }
    await footer(rec); return rec;
  };
  LAY.image = async b => {
    const rec = newSlide('Imagem', false); const y = await title(rec, b.title, b.lead);
    const iw = col(8), ih = Math.min(CB - y, Math.round(iw / (b.image.ratio || 16 / 9)));
    put(rec.frame, await figureRect(b.image, iw, ih), L, y, 'imagem');
    const side = al('VERTICAL', 'Notas', { itemSpacing: 24 }); side.resize(col(4) - 24, 10); side.counterAxisSizingMode = 'FIXED'; side.primaryAxisSizingMode = 'AUTO';
    for (const [i, nt] of (b.notes || []).entries()) {
      const row = al('HORIZONTAL', 'Nota', { itemSpacing: 16 });
      const badge = figma.createAutoLayout('HORIZONTAL', { name: 'Marcador', primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' }); badge.resize(44, 44); badge.primaryAxisSizingMode = 'FIXED'; badge.counterAxisSizingMode = 'FIXED'; badge.cornerRadius = 22; badge.fills = [paint('acento')];
      badge.appendChild(await text(String(i + 1), 'Rótulo', 'fundo', null, { nbsp: false })); row.appendChild(badge); row.appendChild(await text(nt, 'Legenda', 'tinta', col(4) - 24 - 60)); side.appendChild(row);
    }
    if (b.caption) side.appendChild(await text(b.caption, 'Legenda', 'secundario', col(4) - 24));
    put(rec.frame, side, cx(8) + 24, y, 'notas'); await footer(rec); return rec;
  };
  LAY.quote = async b => {
    const rec = newSlide('Citação', !!b.dark);
    const q = await text('“', 'Numeral', rec.dark ? 'powder' : 'acento', null, { nbsp: false }); put(rec.frame, q, L - 8, 140, 'aspas');
    const t = await text(b.text, 'Statement', rec.dark ? 'fundo' : 'titulo', col(9), { dark: rec.dark }); put(rec.frame, t, L, 360, 'citacao');
    if (b.author) { const a = await text(b.author, 'Título de card', rec.dark ? 'powder' : 'acento-forte', col(8)); put(rec.frame, a, L, t.y + t.height + 40, 'autor'); }
    await footer(rec); return rec;
  };
  LAY.table = async b => {
    const rec = newSlide('Tabela', false); const y = await title(rec, b.title, b.lead);
    const w = col(12), nc = b.head.length, fr = b.cols || Array(nc).fill(1), sum = fr.reduce((a, c) => a + c, 0);
    const cw = fr.map(c => Math.floor(w * c / sum)); cw[nc - 1] += w - cw.reduce((a, c) => a + c, 0);
    const f = al('VERTICAL', 'Tabela'); const pv = MODE === 'P' ? 16 : 12;
    const row = async (cells, head, hi) => { const r = al('HORIZONTAL', head ? 'Cabeçalho' : 'Linha'); if (hi) r.fills = [paint('tinta-clara-2')];
      for (let i = 0; i < nc; i++) { const c = al('VERTICAL', 'Célula', { paddingTop: pv, paddingBottom: pv, paddingLeft: 16, paddingRight: 16 }); c.appendChild(await text(cells[i] ?? '', head ? 'Rótulo' : 'Legenda', head ? 'titulo' : 'tinta', cw[i] - 32, { align: (b.align || [])[i] === 'r' ? 'RIGHT' : 'LEFT', nbsp: false })); r.appendChild(c); }
      for (const c of r.children) c.layoutSizingVertical = 'FILL'; return r; };
    f.appendChild(await row(b.head, true)); f.appendChild(rect(w, 2, paint('titulo'), 'Filete'));
    for (const [i, cells] of b.rows.entries()) { f.appendChild(await row(cells, false, i === b.highlight)); if (i < b.rows.length - 1) f.appendChild(rect(w, 1, paint('filete'), 'Filete')); }
    put(rec.frame, f, L, y, 'tabela');
    if (b.note) { const s = await text(b.note, 'Rodapé', 'secundario', col(10), { nbsp: false }); put(rec.frame, s, L, Math.min(CB - s.height, f.y + f.height + 16), 'fonte'); }
    await footer(rec); return rec;
  };
  LAY.closing = async b => {
    const rec = newSlide('Encerramento', true); const s = rec.frame;
    const comp = await figma.getNodeByIdAsync(CFG.covers[b.variant || 2]); const logo = comp.findOne(n => n.name === 'Logo').clone(); logo.rescale(1.5); put(s, logo, L, TOP); logo.fills = [paint('fundo')]; logo.name = 'Logo';
    const t = await text(b.title || 'Obrigado', 'Divisor', 'fundo', col(10)); put(s, t, L, 0, 'titulo'); t.y = 400;
    let y = t.y + t.height + 32;
    if (b.text) { const l = await text(b.text, 'Lead', 'powder', col(8), { dark: true }); put(s, l, L, y, 'lead'); y = l.y + l.height + 48; }
    for (const c of b.contact || []) { const k = await text(c, 'Título de card', 'fundo', col(8), { nbsp: false }); put(s, k, L, y, 'contato'); y += k.height + 12; }
    return rec;
  };

  // ---------- QA ----------
  const FAM = new Set(['Clash Display', 'Inter', 'JetBrains Mono']);
  async function qa(wrapperId, mode) {
    const wr = await figma.getNodeByIdAsync(wrapperId); const out = []; const add = (s, sev, rule, d) => out.push({ slide: s, sev, rule, detail: d });
    const M = mode || MODE; const lim = LIMIT[M]; const fr = wr.children; let run = 1, dark = 0;
    fr.forEach((s, i) => {
      const kind = s.name.split(' — ')[1] || ''; const isDark = ['Divisor', 'Encerramento'].includes(kind) || (s.fills[0] && s.fills[0].boundVariables && s.fills[0].boundVariables.color && s.fills[0].boundVariables.color.id === V.titulo.id);
      if (isDark) dark++;
      if (i && kind === (fr[i - 1].name.split(' — ')[1] || '') && !['Divisor'].includes(kind)) { run++; if (run > 3) add(s.name, 'WARNING', 'A5 layout repetido', `${run} seguidos`); } else run = 1;
      const pb = s.absoluteBoundingBox; let words = 0;
      for (const t of s.findAllWithCriteria({ types: ['TEXT'] })) {
        for (const sg of t.getStyledTextSegments(['fontName'])) if (!FAM.has(sg.fontName.family)) add(s.name, 'ERROR', 'D1 família', sg.fontName.family);
        if (/^Rodapé/.test(t.name)) continue;
        const b = t.absoluteBoundingBox, x0 = b.x - pb.x, y0 = b.y - pb.y;
        if (x0 < L - 16 || x0 + b.width > R + 1 || y0 < TOP - 1 || y0 + b.height > FT + 1) if (!/aspas|numeral/.test(t.parent.name + t.name)) add(s.name, 'ERROR', 'C1 fora da área viva', `"${t.characters.slice(0, 30)}"`);
        if (!/^bloco\/(titulo|numeral|aspas)/.test(t.name)) words += t.characters.split(/\s+/).filter(Boolean).length;
      }
      if (!['Capa', 'Divisor', 'Encerramento', 'Statement', 'Citação'].includes(kind) && words > lim.words) add(s.name, M === 'P' ? 'ERROR' : 'WARNING', 'B3 palavras', `${words} > ${lim.words} (${M})`);
      if (!['Capa', 'Divisor', 'Encerramento', 'Statement', 'Citação'].includes(kind)) {
        // densidade: conteúdo precisa ocupar a zona de conteúdo, não só o topo
        const body = s.children.filter(n => n.name.startsWith('bloco/') && !/^bloco\/(titulo|lead|fonte)$/.test(n.name));
        if (body.length) { const bottom = Math.max(...body.map(n => n.y + n.height)); const occ = (bottom - CT) / (CB - CT); const min = M === 'P' ? 0.4 : 0.6; if (occ < min) add(s.name, 'WARNING', 'C6 slide vazio embaixo', `conteúdo ocupa ${Math.round(occ * 100)}% da zona (mín. ${min * 100}%)`); }
        if (M === 'L' && words < 40) add(s.name, 'WARNING', 'G3 slide ralo', `${words} palavras (mín. 40 em L; alvo 60 a 150)`);
      }
      const tt = s.children.find(n => n.name === 'bloco/titulo');
      if (tt && tt.type === 'TEXT') { const lines = Math.round(tt.height / tt.lineHeight.value); const w = tt.characters.split(/\s+/).length; if (lines > 2) add(s.name, 'ERROR', 'B1 título > 2 linhas', `${lines} linhas`); if (w > (M === 'P' ? 12 : 15) && kind !== 'Encerramento') add(s.name, 'WARNING', 'B1 título longo', `${w} palavras`); }
      for (const n of s.findAll(n => n.name.startsWith('Imagem pendente') && !n.fills.some(f => f.type === 'IMAGE'))) add(s.name, 'REVIEW', 'imagem pendente', n.name.slice(17));
    });
    if (fr.length && dark / fr.length > 0.25) add('deck', 'WARNING', 'A5 slides escuros', `${dark}/${fr.length} > 25%`);
    return out;
  }

  async function build(plan) {
    doc = plan.doc; await init(doc.mode);
    let page; if (doc.pageId) page = await figma.getNodeByIdAsync(doc.pageId); else { page = figma.createPage(); page.name = doc.pageName || ('Apresentação — ' + doc.title); }
    await figma.setCurrentPageAsync(page);
    let maxY = 0; for (const c of page.children) maxY = Math.max(maxY, c.y + c.height);
    if (doc.resume) { wrapper = await figma.getNodeByIdAsync(doc.resume.wrapper); num = doc.resume.num; section = doc.resume.section || ''; }
    else {
      wrapper = figma.createAutoLayout('HORIZONTAL', { name: `Apresentação 16:9 (${MODE === 'P' ? 'projetar' : 'ler'}) — ${doc.title}`, itemSpacing: 80, counterAxisSpacing: 80, paddingTop: 120, paddingBottom: 120, paddingLeft: 120, paddingRight: 120 });
      wrapper.layoutWrap = 'WRAP'; wrapper.resize(3 * W + 2 * 80 + 240, 100); wrapper.primaryAxisSizingMode = 'FIXED'; wrapper.counterAxisSizingMode = 'AUTO';
      wrapper.fills = [{ type: 'SOLID', color: { r: 0.91, g: 0.93, b: 0.96 } }]; wrapper.x = 0; wrapper.y = maxY ? maxY + 600 : 0;
    }
    for (const b of plan.slides) { if (!LAY[b.t]) throw new Error('layout desconhecido: ' + b.t); await LAY[b.t](b); }
    const issues = plan.skipQA ? [] : await qa(wrapper.id);
    return { pageId: page.id, wrapper: wrapper.id, mode: MODE, resume: { wrapper: wrapper.id, num, section }, slides: slides.map(s => ({ id: s.frame.id, name: s.frame.name })), qa: issues };
  }
  return { build, qa, version: '1.2' };
})();
return LIA_DECK;
