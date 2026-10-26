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

// The portrait as a dithered print of the cut-out photograph: one point per
// printed dot, placed by error diffusion so the light and shade of the face
// survive at a few thousand points. Only the person is printed (the
// cut-out's alpha), in ink, with blue where grey catches the light in the
// hair. The face is lightened and sharpened against its surroundings so the
// features carry it; the black shirt prints as a dark texture.
export function portraitShape(img, n, seed = 7) {
  const rand = rng(seed);
  const aspect = img.naturalWidth / img.naturalHeight;
  const h = 400;
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

  // Mean brightness of the figure around each pixel, from summed-area tables.
  const W = w + 1;
  const sum = new Float64Array(W * (h + 1));
  const cnt = new Float64Array(W * (h + 1));
  for (let y = 0; y < h; y += 1) {
    let rs = 0;
    let rc = 0;
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      if (inside[i]) {
        rs += lum[i];
        rc += 1;
      }
      sum[(y + 1) * W + x + 1] = sum[y * W + x + 1] + rs;
      cnt[(y + 1) * W + x + 1] = cnt[y * W + x + 1] + rc;
    }
  }
  const box = (t, x0, y0, x1, y1) => t[y1 * W + x1] - t[y0 * W + x1] - t[y1 * W + x0] + t[y0 * W + x0];
  const mean = (x, y) => {
    const R = 6;
    const x0 = Math.max(0, x - R);
    const y0 = Math.max(0, y - R);
    const x1 = Math.min(w, x + R + 1);
    const y1 = Math.min(h, y + R + 1);
    const k = box(cnt, x0, y0, x1, y1);
    return k ? box(sum, x0, y0, x1, y1) / k : lum[y * w + x];
  };

  // The tone each pixel should print at (0 nothing, 1 solid ink).
  const SHIRT = 0.8;
  const ink = new Float32Array(w * h);
  let total = 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      if (!inside[i]) continue;
      const l0 = lum[i];
      const l = Math.min(1, Math.max(0, l0 + 1.6 * (l0 - mean(x, y))));
      let t;
      if (skin[i]) t = 1 - Math.min(1, Math.max(0, (l - 0.22) / 0.62));
      else if (y / h > SHIRT) t = 0.72;
      else t = Math.min(1, (1 - l) * 1.05);
      ink[i] = t;
      total += t;
    }
  }

  // A grid sized so that about `n` cells print, each cell the average of
  // the pixels it covers, so small features survive the step down.
  const k = Math.sqrt(n / Math.max(1, total));
  const gw = Math.max(1, Math.round(w * k));
  const gh = Math.max(1, Math.round(h * k));
  const grid = new Float32Array(gw * gh);
  const mask = new Uint8Array(gw * gh);
  const grey = new Uint8Array(gw * gh);
  for (let gy = 0; gy < gh; gy += 1) {
    const y0 = Math.floor((gy / gh) * h);
    const y1 = Math.max(y0 + 1, Math.floor(((gy + 1) / gh) * h));
    for (let gx = 0; gx < gw; gx += 1) {
      const x0 = Math.floor((gx / gw) * w);
      const x1 = Math.max(x0 + 1, Math.floor(((gx + 1) / gw) * w));
      let a = 0;
      let m = 0;
      let gr = 0;
      let all = 0;
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          const i = y * w + x;
          all += 1;
          if (!inside[i]) continue;
          m += 1;
          a += ink[i];
          if (!skin[i] && y / h <= SHIRT && lum[i] > 0.3) gr += 1;
        }
      }
      const g = gy * gw + gx;
      mask[g] = m * 2 >= all ? 1 : 0;
      grid[g] = m ? a / m : 0;
      grey[g] = gr * 2 > m ? 1 : 0;
    }
  }

  // Error diffusion (Floyd–Steinberg), serpentine so no row drifts one way.
  // Each printed cell becomes one point.
  const cands = [];
  const put = (x, y, e) => {
    if (x < 0 || x >= gw || y >= gh) return;
    const g = y * gw + x;
    if (mask[g]) grid[g] += e;
  };
  for (let gy = 0; gy < gh; gy += 1) {
    const dir = gy % 2 ? -1 : 1;
    for (let s = 0; s < gw; s += 1) {
      const gx = dir === 1 ? s : gw - 1 - s;
      const g = gy * gw + gx;
      if (!mask[g]) continue;
      const on = grid[g] > 0.5 ? 1 : 0;
      const err = grid[g] - on;
      put(gx + dir, gy, (err * 7) / 16);
      put(gx - dir, gy + 1, (err * 3) / 16);
      put(gx, gy + 1, (err * 5) / 16);
      put(gx + dir, gy + 1, err / 16);
      if (!on) continue;
      const tone = grey[g] && rand() < 0.7 ? BLUE : INK;
      cands.push([(gx + 0.5 + (rand() - 0.5) * 0.5) / gw, (gy + 0.5 + (rand() - 0.5) * 0.5) / gh, tone]);
    }
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
