// Point clouds for the particle field. Every shape returns exactly `n` points
// in its own unit box (x and y in 0..1, aspect = width / height), plus a
// colour index per point: 0 red, 1 blue, 2 yellow, 3 ink.

const RED = 0;
const BLUE = 1;
const YELLOW = 2;
const INK = 3;

// Deterministic randomness, so a shape looks the same on every visit.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function make(n, aspect) {
  return { n, aspect, pos: new Float32Array(n * 2), col: new Float32Array(n) };
}

// Fills `out` from a list of candidate points [x, y, colour], picking evenly
// when there are too many and repeating with a little jitter when too few.
function fill(out, cands, rand, jitter = 0.002) {
  const { n } = out;
  if (!cands.length) return out;
  // Shuffle once so a cut never favours one region.
  for (let i = cands.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [cands[i], cands[j]] = [cands[j], cands[i]];
  }
  for (let i = 0; i < n; i += 1) {
    const c = cands[i % cands.length];
    const extra = i >= cands.length ? jitter : 0;
    out.pos[i * 2] = c[0] + (rand() - 0.5) * extra;
    out.pos[i * 2 + 1] = c[1] + (rand() - 0.5) * extra;
    out.col[i] = c[2];
  }
  return out;
}

// Samples the ink of a canvas drawing on a grid fine enough to give about
// 1.6× more candidates than points.
function sampleCanvas(draw, n, aspect, colourAt, seed) {
  const rand = rng(seed);
  const h = 360;
  const w = Math.round(h * aspect);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  draw(ctx, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  let inked = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) inked += 1;
  const step = Math.max(1, Math.sqrt(inked / (n * 1.6)));
  const cands = [];
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const jx = x + (rand() - 0.5) * step * 0.8;
      const jy = y + (rand() - 0.5) * step * 0.8;
      const px = Math.min(w - 1, Math.max(0, Math.round(jx)));
      const py = Math.min(h - 1, Math.max(0, Math.round(jy)));
      if (data[(py * w + px) * 4 + 3] > 128) cands.push([jx / w, jy / h, colourAt(jx / w, jy / h, rand)]);
    }
  }
  return fill(make(n, aspect), cands, rand, 1 / w);
}

export const DISPLAY_FONT = "'Archivo Variable', 'Archivo', system-ui, sans-serif";

// Text set in the display face, stretched to fill the box.
export function textShape(lines, n, aspect, seed = 3) {
  return sampleCanvas((ctx, w, h) => {
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'alphabetic';
    if ('fontStretch' in ctx) ctx.fontStretch = 'expanded';
    const rows = lines.length;
    const size = (h / rows) * 1.18;
    ctx.font = `900 ${size}px ${DISPLAY_FONT}`;
    lines.forEach((line, i) => {
      const m = ctx.measureText(line);
      const sx = (w * 0.995) / m.width;
      ctx.save();
      ctx.translate(0, (h / rows) * (i + 1) - (h / rows) * 0.07);
      ctx.scale(sx, 1);
      ctx.fillText(line, 0, 0);
      ctx.restore();
    });
  }, n, aspect, (x, y, r) => {
    // Bands of the three primaries cut across the letters, with ink flecks.
    const v = r();
    if (v < 0.12) return INK;
    const band = Math.floor((x * 3 + y * 1.4) * 1.5) % 3;
    return [RED, BLUE, YELLOW][band];
  }, seed);
}

// The portrait as a four-tone halftone of the cut-out photograph. Only the
// person is sampled (the cut-out's alpha). Hair, beard and shirt are read by
// their darkness; the face is read by its local shading, so a likeness
// survives at a few thousand points: red skin, blue shadow, white light,
// and the strong edges (eyes, brows, nose, mouth) in ink.
export function portraitShape(img, n, seed = 7) {
  const rand = rng(seed);
  const aspect = img.naturalWidth / img.naturalHeight;
  const h = 320;
  const w = Math.round(h * aspect);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  const lum = new Float32Array(w * h);
  const inside = new Uint8Array(w * h);
  const skin = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    const k = i * 4;
    lum[i] = (0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]) / 255;
    inside[i] = data[k + 3] > 140 ? 1 : 0;
    // Skin is warm (red well above blue); hair, beard and shirt are grey.
    skin[i] = inside[i] && lum[i] > 0.28 && data[k] - data[k + 2] > 35 ? 1 : 0;
  }

  // Mean brightness of the skin around each pixel (summed-area tables over
  // skin only, so hair and beard never make the skin beside them look lit):
  // darker than its surroundings is shadow, lighter is highlight.
  const W = w + 1;
  const sum = new Float64Array(W * (h + 1));
  const cnt = new Float64Array(W * (h + 1));
  for (let y = 0; y < h; y += 1) {
    let rs = 0;
    let rc = 0;
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      if (skin[i]) {
        rs += lum[i];
        rc += 1;
      }
      sum[(y + 1) * W + x + 1] = sum[y * W + x + 1] + rs;
      cnt[(y + 1) * W + x + 1] = cnt[y * W + x + 1] + rc;
    }
  }
  const R = 6;
  const box = (t, x0, y0, x1, y1) => t[y1 * W + x1] - t[y0 * W + x1] - t[y1 * W + x0] + t[y0 * W + x0];
  const mean = (x, y) => {
    const x0 = Math.max(0, x - R);
    const y0 = Math.max(0, y - R);
    const x1 = Math.min(w, x + R + 1);
    const y1 = Math.min(h, y + R + 1);
    const c = box(cnt, x0, y0, x1, y1);
    return c ? box(sum, x0, y0, x1, y1) / c : lum[y * w + x];
  };
  const edge = (x, y) => {
    if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) return 0;
    const L = (dx, dy) => lum[(y + dy) * w + x + dx];
    const gx = L(1, -1) + 2 * L(1, 0) + L(1, 1) - L(-1, -1) - 2 * L(-1, 0) - L(-1, 1);
    const gy = L(-1, 1) + 2 * L(0, 1) + L(1, 1) - L(-1, -1) - 2 * L(0, -1) - L(1, -1);
    return Math.min(1, Math.hypot(gx, gy));
  };

  const cands = [];
  let guard = 0;
  while (cands.length < n * 1.15 && guard < n * 80) {
    guard += 1;
    const x = rand();
    const y = rand();
    const px = Math.floor(x * w);
    const py = Math.floor(y * h);
    const i = py * w + px;
    if (!inside[i]) continue;
    const l = lum[i];
    // A stipple: the darker the photograph, the denser the dots, so the
    // face reads by its light and shade like an engraving.
    const e = edge(px, py);
    let keep = Math.pow(1 - l, 1.5) + 0.05 + e * 0.5;
    let tone;
    if (skin[i]) {
      const d = l - mean(px, py);
      tone = e > 0.5 || d < -0.08 ? INK : d < -0.03 ? BLUE : RED;
    } else if (y > 0.78) {
      // The shirt, kept light so it doesn't swallow the points.
      tone = BLUE;
      keep = 0.3;
    } else {
      // Grey strands in the hair and beard catch the light in blue.
      tone = l > 0.3 ? BLUE : INK;
    }
    if (rand() > keep) continue;
    cands.push([x, y, tone]);
  }
  return fill(make(n, aspect), cands, rand);
}

// Circle, square and triangle, overlapping like a Bauhaus poster.
export function bauhausShape(n, seed = 11) {
  const aspect = 1.35;
  return sampleCanvas((ctx, w, h) => {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(w * 0.3, h * 0.55, h * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.42, h * 0.08, h * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.98);
    ctx.lineTo(w * 0.995, h * 0.98);
    ctx.lineTo(w * 0.8, h * 0.4);
    ctx.closePath();
    ctx.fill();
  }, n, aspect, (x, y) => {
    const inTri = y > 0.4 + Math.abs(x - 0.8) * (0.58 / 0.195) && y < 0.98;
    if (inTri) return YELLOW;
    const inSq = x > 0.42 && x < 0.42 + 0.5 / aspect && y > 0.08 && y < 0.58;
    if (inSq) return BLUE;
    return RED;
  }, seed);
}

// A GPU die: a grid of compute blocks, a few lit, with pins around the edge.
export function chipShape(n, seed = 13) {
  const aspect = 1.25;
  const rand = rng(seed);
  const cols = 8;
  const rows = 6;
  const lit = new Set([3, 12, 13, 22, 29, 30, 31, 44]);
  return sampleCanvas((ctx, w, h) => {
    ctx.fillStyle = '#000';
    const pad = w * 0.09;
    const gw = (w - pad * 2) / cols;
    const gh = (h - pad * 2) / rows;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        ctx.fillRect(pad + c * gw + gw * 0.08, pad + r * gh + gh * 0.08, gw * 0.84, gh * 0.84);
      }
    }
    // Pins.
    for (let i = 0; i < 18; i += 1) {
      const t = pad + ((w - pad * 2) / 18) * (i + 0.5);
      ctx.fillRect(t - 2, 2, 4, pad * 0.6);
      ctx.fillRect(t - 2, h - pad * 0.6 - 2, 4, pad * 0.6);
    }
    for (let i = 0; i < 14; i += 1) {
      const t = pad + ((h - pad * 2) / 14) * (i + 0.5);
      ctx.fillRect(2, t - 2, pad * 0.6, 4);
      ctx.fillRect(w - pad * 0.6 - 2, t - 2, pad * 0.6, 4);
    }
  }, n, aspect, (x, y) => {
    const pad = 0.09;
    if (x < pad || x > 1 - pad || y < pad * aspect || y > 1 - pad * aspect) return INK;
    const c = Math.floor(((x - pad) / (1 - pad * 2)) * cols);
    const r = Math.floor(((y - pad * aspect) / (1 - pad * aspect * 2)) * rows);
    if (lit.has(r * cols + c)) return YELLOW;
    return rand() < 0.12 ? RED : BLUE;
  }, seed);
}

// A small neural network: dense nodes, and edges drawn as dotted lines.
export function networkShape(n, seed = 17) {
  const aspect = 1.5;
  const rand = rng(seed);
  const layers = [4, 7, 7, 5, 2];
  const nodes = layers.map((count, li) => Array.from({ length: count }, (_, k) => [
    0.06 + (li / (layers.length - 1)) * 0.88,
    0.5 + (k - (count - 1) / 2) * 0.13,
  ]));
  const cands = [];
  const nodeShare = Math.floor(n * 0.55);
  const all = nodes.flat();
  for (let i = 0; i < nodeShare; i += 1) {
    const [cx, cy] = all[i % all.length];
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.042;
    const li = nodes.findIndex((l) => l.some((p) => p[0] === cx && p[1] === cy));
    cands.push([cx + (Math.cos(a) * r) / aspect, cy + Math.sin(a) * r, li === 0 ? YELLOW : li === layers.length - 1 ? RED : BLUE]);
  }
  const edges = [];
  for (let li = 0; li < nodes.length - 1; li += 1) {
    for (const a of nodes[li]) for (const b of nodes[li + 1]) edges.push([a, b]);
  }
  for (let i = nodeShare; i < n; i += 1) {
    const [a, b] = edges[Math.floor(rand() * edges.length)];
    const t = rand();
    cands.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, INK]);
  }
  return fill(make(n, aspect), cands, rand);
}

// Karlsruhe, the fan city: 32 streets radiate from the palace tower.
export function fanShape(n, seed = 19) {
  const aspect = 1.6;
  const rand = rng(seed);
  const cx = 0.5;
  const cy = 0.12;
  const cands = [];
  const rays = 32;
  const tower = Math.floor(n * 0.08);
  const arc = Math.floor(n * 0.16);
  for (let i = 0; i < tower; i += 1) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.07;
    cands.push([cx + (Math.cos(a) * r) / aspect, cy + Math.sin(a) * r, RED]);
  }
  // The palace wings: an arc around the tower.
  for (let i = 0; i < arc; i += 1) {
    const a = Math.PI * (0.08 + rand() * 0.84);
    const r = 0.2 + (rand() - 0.5) * 0.04;
    cands.push([cx - (Math.cos(a) * r) / aspect, cy - Math.sin(a) * r * 0.5 + 0.02, YELLOW]);
  }
  for (let i = tower + arc; i < n; i += 1) {
    const k = Math.floor(rand() * rays);
    const a = (k / rays) * Math.PI * 2 + Math.PI / 2;
    const t = 0.09 + Math.pow(rand(), 0.8) * 1.0;
    const x = cx + (Math.cos(a) * t) / aspect;
    const y = cy + Math.sin(a) * t;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      i -= 1;
      continue;
    }
    cands.push([x, y, k % 4 === 0 ? RED : k % 4 === 2 ? BLUE : INK]);
  }
  return fill(make(n, aspect), cands, rand);
}

// Scattered over the whole viewport: the state before anything has formed.
export function scatterShape(n, aspect, seed = 23) {
  const rand = rng(seed);
  const out = make(n, aspect);
  for (let i = 0; i < n; i += 1) {
    out.pos[i * 2] = rand();
    out.pos[i * 2 + 1] = rand();
    out.col[i] = Math.floor(rand() * 4);
  }
  return out;
}
