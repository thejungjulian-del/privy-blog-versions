// Privy blog covers: every cover is drawn as one SVG (1056 x 660), so the same code
// powers the builder, the gallery and the PNG/SVG downloads.
const W = 1056, H = 660;

const PRIVY = '<path d="M78.773 12.779L78.446 12.779L74.198.5L69.222.5L69.222 1.008L75.215 18.154L81.823 18.154L87.818 1.008L87.818.5L83.058.5L78.771 12.778L78.773 12.778Z"/><path d="M67.934.5L62.986.5L62.986 18.152L67.934 18.152L67.934.5Z"/><path d="M102.533.476L107.293.476L107.293.988C107.293.988 100.748 19.716 100.617 20.084C99.645 22.844 97.641 23.708 95.069 23.708L89.044 23.708L89.044 19.619L95.209 19.619L88.699.991L88.699.48L93.675.48L97.923 12.76L98.25 12.76L102.537.478L102.533.478ZM45.284 9.305C45.284 14.757 42.228 18.606 37.76 18.606C35.304 18.606 33.33 17.044 32.485 16.019C32.452 15.98 32.418 15.932 32.384 15.886L32.077 15.886L32.077 23.703L27.065 23.703L27.065.498L31.782.498L31.782 3.288L32.086 3.288C33.398 1.142 35.5 0 37.75 0C42.077 0 45.284 3.853 45.284 9.305ZM40.275 9.307C40.275 5.685 38.586 3.834 36.254 3.834C33.922 3.834 32.312 5.645 32.312 9.307C32.312 12.968 33.922 14.779 36.254 14.779C38.625 14.779 40.275 12.929 40.275 9.307ZM57.714.478L61.386.478L61.386 4.859L56.136 4.859C53.703 4.859 53.042 6.345 53.042 8.769L53.042 18.134L48.031 18.134L48.031 8.52L48.012 8.52L48.012 5.151C47.945 4.72 47.686 4.534 47.158 4.534L45.557 4.534L45.557.48L52.731.48L52.731 3.288L53.029 3.288C53.9.865 55.391.478 57.714.478Z"/><path d="M9.329 18.594C14.48 18.594 18.658 14.431 18.658 9.297C18.658 4.163 14.48 0 9.329 0C4.178 0 0 4.163 0 9.297C0 14.431 4.178 18.594 9.329 18.594ZM9.329 24C12.85 24 15.704 23.401 15.704 22.667C15.704 21.932 12.851 21.334 9.329 21.334C5.806 21.334 2.953 21.932 2.953 22.667C2.953 23.401 5.806 24 9.329 24Z"/>';
const PRIVY_W = 107.3, PRIVY_H = 24;

const INK = '#010110', WHITE = '#FFFFFF';

const MARKET_PAL = {
  Violet: { base: '#7E77FF', blobs: [['#584FFF', .57], ['#FF9CF4', .45], ['#FC6CEA', .25], ['#584FFF', .31], ['#D8D6FF', .71], ['#FFD2F9', .51]] },
  Coral:  { base: '#FF7C6A', blobs: [['#FF4D3C', .6], ['#FFABAB', .45], ['#FC6CEA', .2], ['#FF4D3C', .35], ['#FFD3D3', .6], ['#FF9CF4', .35]] },
  Pink:   { base: '#B58CFF', blobs: [['#9A61FF', .55], ['#FC6CEA', .5], ['#FF9CF4', .35], ['#9A61FF', .3], ['#FFD2F9', .55], ['#FC6CEA', .4]] },
  Indigo: { base: '#584FFF', blobs: [['#584FFF', .7], ['#AFABFF', .4], ['#9A61FF', .3], ['#7E77FF', .4], ['#D8D6FF', .5], ['#AFABFF', .35]] },
};
const BLOB_GEO = [[792, 594, -120, 160], [1109, 172, 300, -60], [475, 198, 520, 420], [581, 363, 560, 120], [1162, 251, -80, 520], [528, 211, 40, -40]];

// Lucide icons (ISC license), drawn on a 24 grid
const ICONS = {
  coins: { label: 'Coins', body: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>' },
  route: { label: 'Route', body: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>' },
  zap: { label: 'Bolt', body: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>' },
  candle: { label: 'Chart', body: '<path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/><path d="M9 15v2"/><path d="M17 3v2"/><rect width="4" height="8" x="15" y="5" rx="1"/><path d="M17 13v3"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/>' },
  card: { label: 'Card', body: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>' },
  bank: { label: 'Bank', body: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>' },
  swap: { label: 'Swap', body: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>' },
};

// Partner marks. Ripple and Stripe: Simple Icons (CC0). TRON and Ramp: their own sites.
const PARTNERS = {
  Partner: { name: 'Partner', mark: null },
  Ripple: { name: 'Ripple', vb: [0, 0, 24, 24], mark: '<path d="M20.55 14.65c-.846-.486-1.805-.632-2.752-.666-.79-.023-1.974-.541-1.974-1.985 0-1.072.868-1.94 1.985-1.985.947-.034 1.906-.18 2.752-.666A5.018 5.018 0 0022.4 2.502 5.04 5.04 0 0015.53.674a4.993 4.993 0 00-2.504 4.343c0 .97.35 1.861.79 2.696.372.699.553 1.996-.71 2.73-.948.54-2.132.202-2.719-.745-.496-.801-1.094-1.545-1.94-2.03C6.045 6.28 2.977 7.104 1.6 9.495A5.018 5.018 0 003.44 16.34a5.025 5.025 0 005.008 0c.846-.485 1.444-1.23 1.94-2.03.406-.654 1.433-1.489 2.718-.744.948.541 1.241 1.737.711 2.73-.44.823-.79 1.725-.79 2.695A5.011 5.011 0 0018.034 24a5.011 5.011 0 005.008-5.008 4.982 4.982 0 00-2.492-4.343z"/>' },
  TRON: { name: 'TRON', vb: [290, 485, 2094, 2094], mark: '<path d="M1846.58 697.896L331.913 485L1177.89 2579L2344 1086.49L1846.58 697.896ZM2061.99 1059.18L1569.71 1164.51L1825.74 874.649L2061.92 1059.18H2061.99ZM1665.74 826.042L1349.76 1183.77L722.156 693.477L1665.74 826.108V826.042ZM1163.25 2136.79L628.569 813.313L1278.01 1320.69L1163.31 2136.79H1163.25ZM1313.88 2157.89L1427.39 1350.43L2048.6 1217.54L1313.95 2157.89H1313.88Z"/>' },
  Stripe: { name: 'Stripe', vb: [0, 0, 24, 24], mark: '<path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>' },
  Ramp: { name: 'Ramp', wordmark: true, vb: [0, 0, 71, 20], mark: '<path d="M5.098 6.736c-1.768 0-2.636 1.57-2.636 3.669v5.256H-.032V4.568h2.45v2.878h.042c.524-1.77 1.565-3.2 3.174-3.2 1.132 0 1.607.399 1.607.399L6.116 6.93s-.358-.194-1.018-.194M35.237 8.26v7.401h-2.428v-6.5c0-1.865-.58-2.853-2.064-2.853s-2.28 1.251-2.28 3.647v5.706h-2.407v-6.5c0-1.794-.574-2.853-2.043-2.853-1.676 0-2.321 1.48-2.321 3.647v5.706h-2.45V4.568h2.45V7.08h.022c.38-1.737 1.424-2.811 3.182-2.811s2.878.943 3.31 2.62c.41-1.613 1.504-2.62 3.182-2.62 2.341 0 3.847 1.479 3.847 3.99M12.141 4.249c-2.255 0-3.728 1.067-4.4 2.993l2.074.762c.378-1.162 1.167-1.823 2.37-1.823 1.355 0 2.149.602 2.149 1.523 0 .922-.633 1.14-2.064 1.374-1.59.258-5.375.344-5.375 3.56 0 1.886 1.562 3.304 3.911 3.304 1.765 0 2.97-.728 3.526-2.082h.022v1.804h2.428V8.842c0-2.986-1.491-4.59-4.643-4.59zm2.257 6.19c0 2.328-1.142 3.822-2.966 3.822-1.29 0-2.065-.73-2.065-1.782 0-.988.796-1.671 2.322-1.954 1.56-.29 2.346-.646 2.707-1.501v1.418zm29.48-6.17c-1.857 0-3.086 1.03-3.61 2.575V4.568h-2.579V19.93h2.557v-6.547h.022c.569 1.676 1.755 2.598 3.61 2.598 2.944 0 5.05-2.445 5.05-5.9 0-3.431-2.106-5.812-5.05-5.812m-.636 9.655c-2.04 0-3.17-1.492-3.17-3.81 0-2.316 1.267-3.808 3.17-3.808s3.17 1.563 3.17 3.809-1.266 3.809-3.17 3.809M70.028 15.612v.07h-9.983v-.07c1.439-.82 2.432-1.654 3.327-2.526h4.1zm-2.473-13.11L65.027 0h-.074s.042 4.664-4.205 8.906c-4.156 4.15-9.046 4.16-9.046 4.16v.074l2.578 2.546s4.819.05 9.074-4.16c4.24-4.195 4.205-9.022 4.205-9.022z"/>' },
};

// Partner logos sampled into dot grids (2 = full dot, 1 = small dot), after Andrew's dot-matrix covers
const DOTS = {
  TRON: { cell: 12.5, label: 'TRON', rows: '111110000000000000000000000000|122222221111000000000000000000|022222222222222111100000000000|012222111112222222222210000000|002222210000001111222222000000|001211221000000000012222210000|000220122200000000022101221000|000221002221000000221000122200|000122000122100002220000012221|000022000012210022200112222221|000012100001222122222222222210|000002200000022222222111012200|000002210000002221100000122000|000001220000002200000000221000|000000220000002200000002210000|000000121000002200000022200000|000000022000012200000122000000|000000022100012100001221000000|000000012200012100002210000000|000000002200012100022100000000|000000001210022000122000000000|000000000220022001220000000000|000000000221022012210000000000|000000000122122022100000000000|000000000022221222000000000000|000000000012222220000000000000|000000000002222210000000000000|000000000002222100000000000000|000000000001221000000000000000|000000000000220000000000000000|000000000000100000000000000000' },
  Ripple: { cell: 12.5, label: 'Ripple \u00b7 XRP Ledger', rows: '000000000000000000001222210000|000000000000000000022222222100|000000000000000000222222222210|000000000000000002222222222220|000000000000000002222222222221|000000000000000012222222222222|000000000000000012222222222222|000000000000000012222222222222|000000000000000012222222222222|000001111000000002222222222221|000222222210000001222222222220|002222222221000000222222222200|022222222222100000222222222000|122222222222200002222221100000|222222222222222122222000000000|222222222222222222221000000000|222222222222222222220000000000|222222222222222222221000000000|122222222222220012222100000000|022222222222200001222222220000|012222222222000000222222222100|001222222220000001222222222210|000022222100000002222222222220|000000000000000002222222222221|000000000000000012222222222222|000000000000000012222222222222|000000000000000012222222222222|000000000000000012222222222222|000000000000000002222222222221|000000000000000001222222222220|000000000000000000122222222200|000000000000000000012222222000|000000000000000000000122200000' },
  Ramp: { cell: 15, label: 'Ramp', rows: '00000000000000000000000000000000000000000100|00000000000000000000000000000000000000001210|00000000000000000000000000000000000000001220|21122022220022122012210021222100000000002210|22210220121022102220220022112210000000022200|22000000122022001200020021000220000000122100|22000222122022001200020021000220000001222000|22001200022022001200020021000220000122220000|22001200122022001200020022102210022222212210|22000222222022001200020021222200012221122221|00000000000000000000000021000000000000000000|00000000000000000000000021000000000000000000|00000000000000000000000021000000000000000000' },
};

const ANN_BOLD = { Violet: ['#584FFF', '#B9B4FF'], Coral: ['#FF4D3C', '#FFB3A8'], Pink: ['#FC6CEA', '#FFD6F8'] };
const ANN_SOFT = {
  Violet: ['#E4E2FF', [['#AFABFF', .7], ['#FFFFFF', .6], ['#7E77FF', .35]]],
  Coral: ['#FFE1DC', [['#FFABAB', .7], ['#FFFFFF', .6], ['#FF7C6A', .3]]],
  Pink: ['#FFE8FB', [['#FF9CF4', .6], ['#FFFFFF', .6], ['#DBC9FB', .5]]],
};
const ACCENT = { Violet: '#584FFF', Coral: '#FF4D3C', Pink: '#FC6CEA' };

let _uid = 0;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function frame(inner, defs, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}"><defs>${defs}</defs>${inner}</svg>`;
}
function grainDefs(id) {
  return `<filter id="g${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 -.32"/></filter>`;
}
const grain = (id, op = .55) => `<rect width="${W}" height="${H}" filter="url(#g${id})" opacity="${op}"/>`;
function blobs(id, list, geo, blur = 90) {
  return `<g filter="url(#b${id})">${list.map(([c, o], i) => { const [w, h, x, y] = geo[i]; return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${c}" opacity="${o}"/>`; }).join('')}</g>`;
}
const blurDef = (id, sd = 90) => `<filter id="b${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
function privy(x, y, h, color) { const s = h / PRIVY_H; return `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}">${PRIVY}</g>`; }

// ---------- Market ----------
const T = 168;
function tile(kind, x, y, clipId) {
  const [k, side] = kind.split('-');
  let hole;
  if (k === 'circle') hole = circlePath(T / 2, T / 2, T / 2 - 12);
  else if (k === 'half') { const m = { top: [T / 2, 0], bottom: [T / 2, T], left: [0, T / 2], right: [T, T / 2] }[side]; hole = circlePath(m[0], m[1], T / 2); }
  else { const R = k === 'arc' ? T : T - 40; const corner = { tl: [0, 0], tr: [T, 0], bl: [0, T], br: [T, T] }[side]; hole = circlePath(corner[0], corner[1], R); }
  return `<g transform="translate(${x} ${y})" clip-path="url(#${clipId})"><path fill="#fff" fill-rule="evenodd" d="M0 0H${T}V${T}H0Z ${hole}"/></g>`;
}
function circlePath(cx, cy, r) { return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`; }
const MARKET_LAYOUTS = {
  'Title top-left': { anchor: 'tl', maxW: 760, tiles: [['circle', W - T, 0], ['half-top', W - T, T], ['quarter-tr', 0, H - T]] },
  'Title bottom-left': { anchor: 'bl', maxW: 860, tiles: [['half-bottom', W - 3 * T, 0], ['half-bottom', W - 2 * T, 0], ['circle', W - T, 0]] },
  'Tile block right': { anchor: 'tl', maxW: 600, tiles: (() => { const x0 = W - 2 * T - 56, y0 = (H - 2 * T) / 2; return [['arc-br', x0, y0], ['circle', x0 + T, y0], ['circle', x0, y0 + T], ['arc-tl', x0 + T, y0 + T]]; })() },
  'Centred': { anchor: 'c', maxW: 760, tiles: [['half-bottom', 0, 0], ['half-bottom', T, 0], ['quarter-tl', W - T, H - T]] },
};
function renderMarket({ topic = 'Stablecoin\nPayments', icon = 'coins', palette = 'Violet', layout = 'Title top-left' } = {}) {
  const id = ++_uid, P = MARKET_PAL[palette] || MARKET_PAL.Violet, L = MARKET_LAYOUTS[layout] || MARKET_LAYOUTS['Title top-left'];
  const lines = topic.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 3);
  if (!lines.length) lines.push('Topic');
  lines.push('+ Privy');
  const longest = Math.max(...lines.map(l => l.length));
  const size = Math.max(52, Math.min(84, Math.floor(L.maxW / (longest * 0.53))));
  const blockH = 40 + 28 + lines.length * size;
  let x = 64, y = 64, anchor = 'start';
  if (L.anchor === 'bl') y = H - 64 - blockH;
  if (L.anchor === 'c') { x = W / 2; y = (H - blockH) / 2; anchor = 'middle'; }
  const ic = ICONS[icon] || ICONS.coins;
  const iconX = anchor === 'middle' ? x - 20 : x;
  const iconSvg = `<g transform="translate(${iconX} ${y}) scale(${40 / 24})" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ic.body}</g>`;
  const ty = y + 40 + 28;
  const text = `<text x="${x}" y="${ty}" text-anchor="${anchor}" font-family="Geist, sans-serif" font-size="${size}" letter-spacing="${-size * .02}" fill="#fff">${lines.map((l, i) => `<tspan x="${x}" y="${ty + size * (i + 0.8)}">${esc(l)}</tspan>`).join('')}</text>`;
  const clip = `<clipPath id="t${id}"><rect width="${T}" height="${T}"/></clipPath>`;
  const defs = blurDef(id) + grainDefs(id) + clip;
  const inner = `<rect width="${W}" height="${H}" fill="${P.base}"/>${blobs(id, P.blobs, BLOB_GEO)}${grain(id)}${L.tiles.map(([k, tx, ty2]) => tile(k, tx, ty2, `t${id}`)).join('')}${iconSvg}${text}`;
  return frame(inner, defs, `${lines.join(' ')} cover`);
}

// ---------- Announcements ----------
function dotField(x0, y0, color = '#fff') {
  const C = 30, cols = 16, rows = 9; let out = '';
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const d = Math.hypot((cols - 1 - j) / cols, i / rows * .9), op = Math.max(0, .75 - d * .95);
    if (op < .06) continue;
    const kind = (i * 7 + j * 3) % 5, cx = x0 + j * C + C / 2, cy = y0 + i * C + C / 2;
    if (kind < 3) { const r = [10, 7, 4.5][kind]; out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${op.toFixed(2)}"/>`; }
    else out += `<path d="M${cx} ${cy - 7}v14M${cx - 7} ${cy}h14" stroke="${color}" stroke-width="2.2" opacity="${op.toFixed(2)}"${kind === 4 ? ` transform="rotate(45 ${cx} ${cy})"` : ''}/>`;
  }
  return out;
}
function partnerSvg(key, x, cy, h, color) {
  const p = PARTNERS[key] || PARTNERS.Partner;
  if (p.wordmark) { const [vx, vy, vw, vh] = p.vb, s = (h * 1.15) / vh; return { w: vw * s, svg: `<g transform="translate(${x} ${cy - vh * s / 2}) scale(${s}) translate(${-vx} ${-vy})" fill="${color}">${p.mark}</g>` }; }
  let markSvg, mw = h;
  if (!p.mark) markSvg = `<rect x="${x}" y="${cy - h / 2}" width="${h}" height="${h}" rx="${h * .2}" fill="${color}"/>`;
  else { const [vx, vy, vw] = p.vb, s = h / vw; markSvg = `<g transform="translate(${x} ${cy - h / 2}) scale(${s}) translate(${-vx} ${-vy})" fill="${color}">${p.mark}</g>`; }
  const fs = h, tw = p.name.length * fs * .6;
  const text = `<text x="${x + mw + h * .3}" y="${cy + fs * .36}" font-family="Geist, sans-serif" font-weight="600" font-size="${fs}" letter-spacing="${-fs * .02}" fill="${color}">${esc(p.name)}</text>`;
  return { w: mw + h * .3 + tw, svg: markSvg + text };
}
function lockup(partner, cx, cy, scale, color, align = 'center') {
  const ph = 50 * scale, pw = PRIVY_W * ph / PRIVY_H, gap = 26 * scale, xw = 18 * scale;
  const part = partnerSvg(partner, 0, 0, 46 * scale, color);
  const total = pw + gap * 2 + xw + part.w;
  const x0 = align === 'center' ? cx - total / 2 : cx;
  const px = x0 + pw + gap * 2 + xw;
  const partner2 = partnerSvg(partner, px, cy, 46 * scale, color);
  return privy(x0, cy - ph / 2 - 3 * scale, ph, color) +
    `<text x="${x0 + pw + gap + xw / 2}" y="${cy + 9 * scale}" text-anchor="middle" font-family="Geist, sans-serif" font-size="${28 * scale}" fill="${color}" opacity=".6">&#215;</text>` + partner2.svg;
}
function productCard(x, y, acc) {
  const bar = (bx, by, w, h, c, o = 1, r = h / 2) => `<rect x="${x + bx}" y="${y + by}" width="${w}" height="${h}" rx="${r}" fill="${c}" opacity="${o}"/>`;
  return `<g filter="url(#shadow)"><rect x="${x}" y="${y}" width="660" height="360" rx="18" fill="#fff"/></g>` +
    `<path d="M${x} ${y + 18}a18 18 0 0 1 18 -18h624a18 18 0 0 1 18 18v38h-660z" fill="#F7F7FC"/>` +
    `<circle cx="${x + 31}" cy="${y + 28}" r="9" fill="${acc}"/>` + bar(52, 23, 90, 10, INK, .55) + [168, 232, 296, 360].map(bx => bar(bx, 23, 46, 10, acc, .3)).join('') +
    bar(32, 88, 220, 16, INK, .7) + bar(32, 124, 400, 10, acc, .3) + bar(32, 146, 360, 10, acc, .3) + bar(32, 168, 300, 10, acc, .3) +
    bar(32, 214, 170, 10, acc, .22) + bar(32, 236, 120, 10, acc, .22) + bar(32, 300, 90, 24, acc, .18, 12) +
    `<rect x="${x + 486}" y="${y + 86}" width="140" height="52" rx="10" fill="none" stroke="${INK}" stroke-opacity=".25"/>` + bar(506, 100, 90, 8, INK, .35) + bar(526, 116, 70, 8, INK, .35) + bar(486, 156, 140, 30, acc, 1, 15);
}
function renderAnnouncement({ partner = 'Partner', background = 'Bold', color = 'Violet', card = false } = {}) {
  const id = ++_uid, soft = background === 'Soft', fg = soft ? INK : WHITE;
  let bg, defs = grainDefs(id) + `<filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#1A1240" flood-opacity=".18"/></filter>`;
  if (!soft) { const [a, b] = ANN_BOLD[color] || ANN_BOLD.Violet; defs += `<linearGradient id="lg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`; bg = `<rect width="${W}" height="${H}" fill="url(#lg${id})"/>`; }
  else { const [base, bl] = ANN_SOFT[color] || ANN_SOFT.Violet; defs += blurDef(id, 80); bg = `<rect width="${W}" height="${H}" fill="${base}"/>` + blobs(id, bl, [[700, 420, -100, -80], [640, 360, 520, 300], [520, 300, 620, -120]]); }
  let body = dotField(W - 480, 0);
  if (!card) {
    body += lockup(partner, W / 2, H / 2 - 18, 1, fg);
    body += `<text x="${W / 2 - 4}" y="${H - 54}" text-anchor="end" font-family="Geist, sans-serif" font-weight="500" font-size="15" fill="${fg}">Protected by</text>` + privy(W / 2 + 4, H - 68, 17, fg);
  } else {
    body += lockup(partner, 56, 82, .62, fg, 'left') + productCard((W - 660) / 2 + 40, 200, ACCENT[color] || ACCENT.Violet);
  }
  const label = `privy × ${(PARTNERS[partner] || PARTNERS.Partner).name} cover`;
  return frame(bg + grain(id, .45) + body, defs, label);
}

// ---------- Dot-matrix (after Andrew) ----------
function renderDotMatrix({ partner = 'TRON' } = {}) {
  const id = ++_uid, D = DOTS[partner] || DOTS.TRON, rows = D.rows.split('|'), cell = D.cell;
  const lw = rows[0].length * cell, lh = rows.length * cell, x0 = (W - lw) / 2, y0 = (H - lh) / 2 - 24;
  let dots = '';
  rows.forEach((r, i) => [...r].forEach((ch, j) => { if (ch === '0') return; const rr = (ch === '2' ? cell * .78 : cell * .42) / 2; dots += `<circle cx="${(x0 + j * cell + cell / 2).toFixed(1)}" cy="${(y0 + i * cell + cell / 2).toFixed(1)}" r="${rr.toFixed(2)}"/>`; }));
  const defs = grainDefs(id) + `<pattern id="p${id}" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.5" fill="#fff" opacity=".14"/></pattern>`;
  const inner = `<rect width="${W}" height="${H}" fill="#584FFF"/><rect width="${W}" height="${H}" fill="url(#p${id})"/>${grain(id, .35)}<g fill="#fff">${dots}</g>` +
    privy(48, H - 48 - 37, 37, WHITE) + `<text x="${W - 48}" y="${H - 56}" text-anchor="end" font-family="Geist, sans-serif" font-weight="500" font-size="26" fill="#fff">${esc(D.label)}</text>`;
  return frame(inner, defs, `${D.label} dot-matrix cover`);
}

function renderCover(kind, opts) {
  if (kind === 'market') return renderMarket(opts);
  if (kind === 'announcement') return renderAnnouncement(opts);
  return renderDotMatrix(opts);
}

// ---------- Export ----------
let _fontCss = null;
async function fontCss() {
  if (_fontCss) return _fontCss;
  const toB64 = async url => { const b = await (await fetch(url)).arrayBuffer(); let s = ''; const u = new Uint8Array(b); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const faces = await Promise.all([[400, 'fonts/geist-400.woff2'], [500, 'fonts/geist-500.woff2'], [600, 'fonts/geist-600.woff2']].map(async ([w, u]) => `@font-face{font-family:'Geist';font-weight:${w};src:url(data:font/woff2;base64,${await toB64(u)}) format('woff2');}`));
  return (_fontCss = faces.join(''));
}
async function svgForExport(svg) { return svg.replace('<defs>', `<defs><style>${await fontCss()}</style>`); }
async function svgToPng(svg, scale = 2) {
  const full = await svgForExport(svg);
  const url = URL.createObjectURL(new Blob([full], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image(); img.decoding = 'sync';
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    await new Promise(r => setTimeout(r, 60));
    const c = document.createElement('canvas'); c.width = W * scale; c.height = H * scale;
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(res => c.toBlob(res, 'image/png'));
  } finally { URL.revokeObjectURL(url); }
}
