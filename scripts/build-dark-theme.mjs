// Gera public/dark-theme.css a partir de public/style.css.
// Uso: node scripts/build-dark-theme.mjs  (rode de novo sempre que style.css mudar)
//
// Cada regra com propriedades de cor ganha uma cópia prefixada por
// :root[data-theme="dark"]. Fundos claros escurecem, textos escuros clareiam e o
// matiz é preservado (OKLCH). As ilustrações (cenário, monitor, retratos,
// animações) e os botões amarelos são copiados sem alteração, para manter a
// cascata original sem mudar a arte.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/style.css');
const target = path.join(root, 'public/dark-theme.css');
const PREFIX = ':root[data-theme="dark"]';

// Seletores de arte ou de destaque que mantêm as cores originais.
const KEEP = /case-scene|\.monitor|webcam|power-led|physical-interaction|device-led|interaction-status|empty-stock-slot|action-demonstration|person-portrait|suspect-portrait|computer-screen-indicator|archive-cabinet|#lia-|detective-avatar|id-avatar|player-avatar|suspect-card img|suspect-dialog>img|evidence-card>img|evidence-detail>img|photo-preview|photo-dialog img|board-pin|\.run\b|footer b\b/;

// Como cada variável de cor do :root é usada. --bg fica um pouco abaixo dos cartões.
const VAR_ROLES = { '--bg': 'page', '--paper': 'surface', '--soft': 'surface', '--line': 'border',
  '--ink': 'ink', '--green': 'ink', '--muted': 'ink', '--yellow': 'keep' };

const BG = new Set(['background', 'background-color', 'background-image']);
const SURFACE = new Set(['border', 'border-color', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-block', 'border-inline',
  'border-block-start', 'border-block-end', 'border-inline-start', 'border-inline-end', 'box-shadow', 'text-shadow']);
const INK = new Set(['color', 'fill', 'stroke', 'outline', 'outline-color', 'caret-color', 'text-decoration',
  'text-decoration-color', 'column-rule', 'column-rule-color', '-webkit-text-fill-color', '-webkit-text-stroke']);

// --- cor: hex <-> OKLCH -----------------------------------------------------
const toLinear = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToOklch(hex) {
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map(x => x + x).join('');
  const [r, g, b] = [0, 2, 4].map(i => toLinear(parseInt(h.slice(i, i + 2), 16) / 255));
  const alpha = h.length === 8 ? h.slice(6) : '';
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: Math.atan2(B, A), alpha };
}
function oklchToRgb({ L, C, H }) {
  const A = C * Math.cos(H), B = C * Math.sin(H);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
function oklchToHex(color) {
  let rgb = oklchToRgb(color);
  // Reduz o croma até a cor caber no sRGB, preservando luminosidade e matiz.
  for (let C = color.C; rgb.some(v => v < -1e-4 || v > 1 + 1e-4) && C > 0; C -= 0.002) rgb = oklchToRgb({ ...color, C: Math.max(C, 0) });
  const hex = rgb.map(v => Math.round(toGamma(Math.min(1, Math.max(0, v))) * 255).toString(16).padStart(2, '0')).join('');
  return '#' + hex + color.alpha;
}

// Fundos e bordas claros escurecem; textos escuros clareiam. O resto fica igual.
// Cores saturadas (post-its, marcações) escurecem menos para continuar reconhecíveis.
function darkSurface(c, lift = 0) {
  if (c.L <= 0.5) return c;
  return { ...c, L: 0.5 - (c.L - 0.5) * 0.62 + lift + Math.min(0.06, c.C * 0.6), C: c.C * 0.5 };
}
function lightInk(c) {
  if (c.L >= 0.6) return c;
  return { ...c, L: 0.97 - (c.L / 0.6) ** 1.6 * 0.37, C: c.C * 0.9 };
}
const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi;
function transformValue(prop, value) {
  const name = prop.toLowerCase();
  let map = null;
  if (BG.has(name)) map = c => darkSurface(c);
  else if (SURFACE.has(name)) map = c => darkSurface(c, 0.04);
  else if (INK.has(name)) map = lightInk;
  if (!map) return value;
  // Preenchimentos verdes continuam escuros, e o texto "cor de papel" sobre eles continua claro.
  if (name === 'background' || name === 'background-color') value = value.replace(/var\(--green\)/g, '#2c6757');
  if (name === 'color') value = value.replace(/var\(--paper\)/g, '#fffcf5');
  return value.replace(HEX, hex => oklchToHex(map(hexToOklch(hex.toLowerCase()))));
}
const isColorProp = name => BG.has(name) || SURFACE.has(name) || INK.has(name);
function darkVar(name, value) {
  const role = VAR_ROLES[name];
  if (!role || role === 'keep') return value;
  return value.replace(HEX, hex => {
    const c = hexToOklch(hex.toLowerCase());
    if (role === 'ink') return oklchToHex(lightInk(c));
    const dark = darkSurface(c, role === 'border' ? 0.04 : 0);
    return oklchToHex(role === 'page' ? { ...dark, L: dark.L - 0.05 } : dark);
  });
}

// --- leitura mínima do CSS -------------------------------------------------
function parseBlocks(css) {
  const out = []; let i = 0, start = 0;
  while (i < css.length) {
    if (css[i] === '{') {
      const prelude = css.slice(start, i).trim();
      let depth = 1, j = i + 1;
      while (depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
      const inner = css.slice(i + 1, j - 1);
      out.push(/^@(media|supports)/.test(prelude) ? { at: prelude, children: parseBlocks(inner) } : { prelude, body: inner });
      i = start = j;
    } else if (css[i] === ';' && css.slice(start, i).trim().startsWith('@')) { i++; start = i; } else i++;
  }
  return out;
}
function splitTopLevel(text, sep) {
  const parts = []; let depth = 0, quote = '', last = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === quote && text[i - 1] !== '\\') quote = ''; continue; }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === sep && depth === 0) { parts.push(text.slice(last, i)); last = i + 1; }
  }
  parts.push(text.slice(last));
  return parts.map(p => p.trim()).filter(Boolean);
}
const prefixSelector = sel => splitTopLevel(sel, ',').map(s => {
  if (s.startsWith(':root')) return PREFIX + s.slice(5);
  if (/^html\b/.test(s)) return PREFIX + s.slice(4);
  return PREFIX + ' ' + s;
}).join(',');

function emit(blocks) {
  const out = [];
  for (const block of blocks) {
    if (block.children) { const inner = emit(block.children); if (inner.length) out.push(block.at + '{' + inner.join('') + '}'); continue; }
    if (block.prelude.startsWith('@')) continue; // @keyframes e @font-face ficam no style.css
    const all = splitTopLevel(block.body, ';').map(d => {
      const colon = d.indexOf(':');
      return colon < 0 ? null : { prop: d.slice(0, colon).trim(), value: d.slice(colon + 1).trim() };
    }).filter(Boolean);
    if (block.prelude === ':root') {
      const vars = all.filter(d => d.prop in VAR_ROLES).map(d => d.prop + ':' + darkVar(d.prop, d.value));
      out.push(PREFIX + '{color-scheme:dark;' + vars.join(';') + '}');
      continue;
    }
    const decls = all.filter(d => isColorProp(d.prop.toLowerCase()));
    if (!decls.length) continue;
    const keep = KEEP.test(block.prelude);
    out.push(prefixSelector(block.prelude) + '{' + decls.map(d => d.prop + ':' + (keep ? d.value : transformValue(d.prop, d.value))).join(';') + '}');
  }
  return out;
}

// Ajustes que o processo automático não deduz sozinho.
const EXTRA = `
${PREFIX} footer b{color:#213d35}
${PREFIX} .new-evidence{animation-name:found-clue-dark}
@keyframes found-clue-dark{0%,40%{background:#4d4520;box-shadow:0 0 0 4px #e9db8c55}100%{box-shadow:0 0 0 0 #e9db8c00}}
`;

const css = fs.readFileSync(source, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const header = '/* Gerado por scripts/build-dark-theme.mjs a partir de style.css. Não edite à mão. */\n';
fs.writeFileSync(target, header + emit(parseBlocks(css)).join('\n') + '\n' + EXTRA.trim() + '\n');
console.log('Tema escuro gerado em ' + path.relative(root, target));
