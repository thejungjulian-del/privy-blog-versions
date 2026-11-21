// UI for the cover builder, the blog grid and the guideline cards.
const $ = s => document.querySelector(s);
document.getElementById('brand-mark').innerHTML = `<g fill="currentColor">${PRIVY}</g>`;

const state = {
  kind: 'market',
  market: { topic: 'Stablecoin\nPayments', icon: 'coins', palette: 'Violet', layout: 'Title top-left' },
  announcement: { partner: 'Ripple', background: 'Bold', color: 'Violet', card: false },
  dot: { partner: 'TRON' },
};
const SWATCH = { Violet: '#7E77FF', Coral: '#FF7C6A', Pink: '#B58CFF', Indigo: '#584FFF' };
const ANN_SWATCH = { Violet: '#584FFF', Coral: '#FF4D3C', Pink: '#FC6CEA' };

const POSTS = [
  { cat: 'Announcement', dot: '#b9b4f5', date: 'Oct 13, 2026', title: 'Building payments and agentic commerce with the XRP Ledger', kind: 'announcement', opts: { partner: 'Ripple', background: 'Bold', color: 'Violet', card: false } },
  { cat: 'Announcement', dot: '#b9b4f5', date: 'Sep 23, 2026', title: 'More ways to build on TRON with Privy', kind: 'dot', opts: { partner: 'TRON' } },
  { cat: 'Market', dot: '#5954b8', date: 'Aug 27, 2026', title: 'Stablecoin orchestration: what actually happens when money moves onchain and off', kind: 'market', opts: { topic: 'Stablecoin\nOrchestration', icon: 'route', palette: 'Coral', layout: 'Title top-left' } },
  { cat: 'Market', dot: '#5954b8', date: 'Aug 24, 2026', title: 'Pay per crawl: how businesses will sell to agents', kind: 'market', opts: { topic: 'Agentic\nCommerce', icon: 'zap', palette: 'Pink', layout: 'Tile block right' } },
  { cat: 'Market', dot: '#5954b8', date: 'Aug 12, 2026', title: '5 things to know before launching a stablecoin card program', kind: 'market', opts: { topic: 'Stablecoin\nCards', icon: 'card', palette: 'Coral', layout: 'Centred' } },
  { cat: 'Announcement', dot: '#b9b4f5', date: 'Jul 21, 2026', title: 'Ramp launches Stablecoin Accounts powered by Privy', kind: 'announcement', opts: { partner: 'Ramp', background: 'Soft', color: 'Violet', card: true } },
];
const PRESETS = [
  ['Stablecoin orchestration', 'market', POSTS[2].opts], ['Pay per crawl', 'market', POSTS[3].opts],
  ['HIP-4', 'market', { topic: 'Prediction\nMarkets', icon: 'candle', palette: 'Indigo', layout: 'Title bottom-left' }],
  ['XRP Ledger', 'announcement', POSTS[0].opts], ['TRON', 'dot', POSTS[1].opts], ['Ramp', 'announcement', POSTS[5].opts],
];
const CATS = [
  { c: '#584FFF', name: 'Product & Engineering', team: true, where: 'P&E / Background, P&E / Cover with product image', changes: 'One real UI crop (520 × 364) of the feature in the post, and the background (1 to 6).', dont: 'Screenshots of paragraphs, or made-up screens.' },
  { c: '#FF4D3C', name: 'Case studies', team: true, where: 'Case studies / Cover', changes: "The customer's logo and one of four silk colors.", dont: 'Quotes or numbers on the image. They belong in the post.' },
  { c: '#9A61FF', name: 'Market', team: false, where: 'Market / Cover', changes: 'The topic (two words at most), its icon, the color and the layout.', dont: 'The post title, or more than three lines.' },
  { c: '#FC6CEA', name: 'Announcement', team: false, where: 'Announcements / Cover, dot-matrix set', changes: 'The partner logo, the bold or soft background, and whether a product card shows.', dont: '"Introducing" headlines or sparkles. The lockup is the headline.' },
  { c: '#010110', name: 'Inside the Stack', team: true, where: 'Inside the stack / A to D', changes: 'The company variant. Pick one of A to D for the whole series and stick with it.', dont: null },
];

function current() { return renderCover(state.kind, state[state.kind]); }
function draw() { $('#preview').innerHTML = current(); }

function seg(label, key, options, opts = {}) {
  const f = document.createElement('div'); f.className = 'field';
  f.innerHTML = `<span class="label">${label}</span>`;
  const row = document.createElement('div'); row.className = 'seg' + (opts.icons ? ' icons' : opts.swatch ? ' swatches' : '');
  row.setAttribute('role', 'group'); row.setAttribute('aria-label', label);
  for (const [val, text] of options) {
    const b = document.createElement('button'); b.type = 'button';
    b.setAttribute('aria-pressed', String(state[state.kind][key] === val));
    if (opts.icons) { b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#010110" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICONS[val].body}</svg>`; b.setAttribute('aria-label', text); b.title = text; }
    else if (opts.swatch) { b.style.background = opts.swatch[val]; b.setAttribute('aria-label', text); b.title = text; }
    else b.textContent = text;
    b.onclick = () => { state[state.kind][key] = val; row.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); draw(); };
    row.appendChild(b);
  }
  f.appendChild(row); return f;
}
function buildControls() {
  const form = $('#controls'); form.innerHTML = '';
  const s = state[state.kind];
  if (state.kind === 'market') {
    const f = document.createElement('div'); f.className = 'field';
    f.innerHTML = `<label class="label" for="topic">Topic</label><textarea id="topic" rows="3" maxlength="60">${s.topic}</textarea><p class="help">Two words, one per line. "+ Privy" is added for you.</p>`;
    form.appendChild(f);
    f.querySelector('textarea').addEventListener('input', e => { s.topic = e.target.value; draw(); });
    form.appendChild(seg('Icon', 'icon', Object.entries(ICONS).map(([k, v]) => [k, v.label]), { icons: true }));
    form.appendChild(seg('Color', 'palette', Object.keys(MARKET_PAL).map(k => [k, k]), { swatch: SWATCH }));
    form.appendChild(seg('Layout', 'layout', Object.keys(MARKET_LAYOUTS).map(k => [k, k])));
  } else if (state.kind === 'announcement') {
    form.appendChild(seg('Partner', 'partner', Object.keys(PARTNERS).map(k => [k, k === 'Partner' ? 'Placeholder' : k])));
    form.appendChild(seg('Background', 'background', [['Bold', 'Bold gradient'], ['Soft', 'Soft mesh']]));
    form.appendChild(seg('Color', 'color', Object.keys(ANN_SWATCH).map(k => [k, k]), { swatch: ANN_SWATCH }));
    const t = document.createElement('label'); t.className = 'toggle field';
    t.innerHTML = `<input type="checkbox" ${s.card ? 'checked' : ''}> Show a product card`;
    t.querySelector('input').onchange = e => { s.card = e.target.checked; draw(); };
    form.appendChild(t);
  } else {
    form.appendChild(seg('Partner', 'partner', Object.keys(DOTS).map(k => [k, k])));
    const p = document.createElement('p'); p.className = 'help';
    p.textContent = "After Andrew's dot-matrix covers: the partner's real logo, sampled into dots, white on Privy indigo. Best for bigger partner launches.";
    form.appendChild(p);
  }
}
function setKind(kind) {
  state.kind = kind;
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.kind === kind)));
  buildControls(); draw();
}
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => setKind(b.dataset.kind));

function load(kind, opts) { Object.assign(state[kind], JSON.parse(JSON.stringify(opts))); setKind(kind); }
for (const [label, kind, opts] of PRESETS) {
  const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.textContent = label;
  c.onclick = () => load(kind, opts); $('#presets').appendChild(c);
}

function fileName(ext) {
  const s = state[state.kind];
  const base = state.kind === 'market' ? s.topic.replace(/\s+/g, '-') : state.kind === 'dot' ? `${s.partner}-dot-matrix` : `privy-x-${s.partner}`;
  return `privy-cover-${base.toLowerCase().replace(/[^a-z0-9-]/g, '')}.${ext}`;
}
function save(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
$('#dl-png').onclick = async e => {
  const b = e.currentTarget; b.disabled = true; b.textContent = 'Preparing…';
  try { save(await svgToPng(current()), fileName('png')); } catch (err) { alert('PNG export failed in this browser. Try Download SVG instead.'); }
  b.disabled = false; b.textContent = 'Download PNG';
};
$('#dl-svg').onclick = async () => save(new Blob([await svgForExport(current())], { type: 'image/svg+xml' }), fileName('svg'));

// hero, blog grid, guideline cards
$('#hero-covers').innerHTML = [renderMarket({ topic: 'Stablecoin\nOrchestration', icon: 'route', palette: 'Violet', layout: 'Title top-left' }), renderAnnouncement({ partner: 'Ripple', background: 'Bold', color: 'Coral' }), renderDotMatrix({ partner: 'TRON' })].map(s => `<div class="cv">${s}</div>`).join('');
const grid = $('#blog-grid');
for (const p of POSTS) {
  const b = document.createElement('button'); b.className = 'post'; b.type = 'button';
  b.innerHTML = `<div class="cv">${renderCover(p.kind, p.opts)}</div><div class="meta"><span class="dot" style="background:${p.dot}"></span>${p.cat} · ${p.date}</div><h3>${p.title}</h3>`;
  b.onclick = () => { load(p.kind, p.opts); document.getElementById('builder').scrollIntoView(); };
  grid.appendChild(b);
}
$('#cat-grid').innerHTML = CATS.map(c => `<div class="cat"><span class="tag${c.team ? ' team' : ''}">${c.team ? 'In the team Figma file' : 'On this page'}</span><h3><span class="dot" style="background:${c.c}"></span>${c.name}</h3><p class="where">${c.where}</p><h4>Changes per post</h4><p>${c.changes}</p>${c.dont ? `<h4>Don't</h4><p>${c.dont}</p>` : ''}</div>`).join('');

setKind('market');

// self-test for headless checks: ?selftest renders a PNG and reports its size in the title
if (location.search.includes('selftest')) (async () => {
  try { const b = await svgToPng(current()); document.title = 'SELFTEST OK ' + b.size; } catch (e) { document.title = 'SELFTEST FAIL ' + e; }
})();
