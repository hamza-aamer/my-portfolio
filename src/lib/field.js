// The particle field: one WebGL draw call of a few thousand points that fly
// between the shapes the page's stages ask for. Each stage is a DOM element
// with a `data-stage` name; its shape is fitted inside that element's box, so
// the points scroll with the page, and they travel to the next stage as the
// next one reaches the middle of the screen.

const VERT = `
attribute vec2 aFrom;
attribute vec2 aTo;
attribute float aColFrom;
attribute float aColTo;
attribute vec4 aRand;
uniform vec4 uA;
uniform vec4 uB;
uniform float uT;
uniform float uTime;
uniform float uIntro;
uniform float uVel;
uniform float uDpr;
uniform float uSizeA;
uniform float uSizeB;
uniform float uMotion;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uMouseR;
uniform float uStreak;
uniform float uFlight;
uniform vec4 uShock[4];
uniform vec3 uPal[4];
varying vec3 vCol;
varying float vAlpha;

void main() {
  float tp = clamp((uT - aRand.x * 0.4) / 0.6, 0.0, 1.0);
  tp = tp * tp * (3.0 - 2.0 * tp);
  if (uMotion < 0.5) tp = step(0.5, uT);

  vec2 pa = uA.xy + aFrom * uA.zw;
  vec2 pb = uB.xy + aTo * uB.zw;
  vec2 p = mix(pa, pb, tp);

  // Points take a curved path between shapes, each its own way.
  vec2 dir = pb - pa;
  float len = length(dir);
  vec2 perp = len > 0.001 ? vec2(-dir.y, dir.x) / len : vec2(0.0);
  p += perp * sin(tp * 3.14159) * (aRand.y - 0.5) * min(len, min(700.0, uRes.x * 0.5)) * 0.7 * uMotion;

  // Breathing at rest, and streaks when the page is flung.
  float t = uTime;
  p += vec2(sin(t * 0.8 + aRand.z * 40.0), cos(t * 0.7 + aRand.w * 40.0)) * 0.45 * uMotion;
  p.y += uVel * (aRand.x - 0.5) * 1.4 * uStreak * uMotion;
  p.x += uVel * (aRand.w - 0.5) * 0.5 * uStreak * uMotion;

  // The first arrival: from everywhere into the name.
  float ip = clamp((uIntro - aRand.y * 0.45) / 0.55, 0.0, 1.0);
  ip = 1.0 - pow(1.0 - ip, 3.0);
  vec2 scatter = vec2(aRand.z, aRand.w) * uRes * 1.2 - uRes * 0.1;
  p = mix(scatter, p, ip);

  // Shockwaves from a tap or click: a ring that rolls outward, shoving the
  // points it passes and flipping them to the next colour for a moment.
  float glow = 0.0;
  for (int k = 0; k < 4; k++) {
    vec4 s = uShock[k];
    if (s.w > 0.0) {
      float e = clamp(s.z / 1.1, 0.0, 1.0);
      float radius = s.w * (1.0 - pow(1.0 - e, 3.0));
      vec2 sd = p - s.xy;
      float sl = length(sd);
      float band = exp(-pow((sl - radius) / 84.0, 2.0)) * (1.0 - e);
      p += (sl > 0.001 ? sd / sl : vec2(0.0)) * band * 72.0 * uMotion;
      glow = max(glow, band * uMotion);
    }
  }

  // The pointer pushes points aside.
  vec2 d = p - uMouse;
  float dist = length(d);
  float f = 1.0 - smoothstep(0.0, uMouseR, dist);
  f = f * f;
  p += (dist > 0.001 ? d / dist : vec2(0.0)) * f * uMouseR * 0.9;

  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  // Points in flight thin out, so text they cross on the way stays clean.
  float flight = sin(tp * 3.14159) * uFlight * uMotion;
  gl_PointSize = mix(uSizeA, uSizeB, tp) * uDpr * (1.0 + f * 0.8 + glow * 1.3) * (1.0 - flight * 0.4);

  float cf = tp < 0.5 ? aColFrom : aColTo;
  if (glow > 0.3) cf = mod(cf + 1.0, 4.0);
  int ci = int(cf + 0.5);
  vec3 c = uPal[0];
  if (ci == 1) c = uPal[1];
  if (ci == 2) c = uPal[2];
  if (ci == 3) c = uPal[3];
  vCol = c;
  vAlpha = ip * (1.0 - flight);
}
`;

const FRAG = `
precision mediump float;
varying vec3 vCol;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.36, d) * vAlpha;
  gl_FragColor = vec4(vCol * a, a);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

// The large viewport height (browser bars hidden). The canvas is sized to it
// once, so the address bar sliding in and out never re-sizes the canvas.
function largeHeight() {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const v = probe.offsetHeight;
  probe.remove();
  return Math.max(v || 0, window.innerHeight);
}

const SHOCKS = 4;

export function createField(canvas, { n, motion = true, streak = 1, compact = false }) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  const loc = (name) => gl.getUniformLocation(prog, name);
  const u = Object.fromEntries(
    ['uA', 'uB', 'uT', 'uTime', 'uIntro', 'uVel', 'uDpr', 'uSizeA', 'uSizeB', 'uMotion', 'uRes', 'uMouse', 'uMouseR', 'uStreak', 'uFlight', 'uShock'].map((k) => [k, loc(k)]),
  );
  const uPal = loc('uPal');

  function buffer(name, size, data, usage) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    const a = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, size, gl.FLOAT, false, 0, 0);
    return b;
  }

  const rand = new Float32Array(n * 4);
  for (let i = 0; i < rand.length; i += 1) rand[i] = Math.random();
  buffer('aRand', 4, rand, gl.STATIC_DRAW);
  const bFrom = buffer('aFrom', 2, new Float32Array(n * 2), gl.DYNAMIC_DRAW);
  const bTo = buffer('aTo', 2, new Float32Array(n * 2), gl.DYNAMIC_DRAW);
  const bColFrom = buffer('aColFrom', 1, new Float32Array(n), gl.DYNAMIC_DRAW);
  const bColTo = buffer('aColTo', 1, new Float32Array(n), gl.DYNAMIC_DRAW);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const upload = (b, data) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
  };

  let stages = [];
  let pair = [-1, -1];
  let palette = null;
  let target = null;
  const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, r: 0, boost: 0, speed: 0 };
  let vel = 0;
  let lastY = window.scrollY;
  let intro = motion ? 0 : 1;
  let introStart = 0;
  let raf = 0;
  let running = false;
  let w = 0;
  let h = 0;
  let dpr = 1;
  const shocks = Array.from({ length: SHOCKS }, () => ({ x: 0, y: 0, at: 0, reach: 0 }));
  const shockData = new Float32Array(SHOCKS * 4);
  let nextShock = 0;

  // Re-allocating a canvas clears it, so it only happens when the size
  // really changes: a rotation or a resized window, not a scrolling toolbar.
  function resize() {
    const nd = Math.min(window.devicePixelRatio || 1, 2);
    const nw = window.innerWidth;
    const nh = largeHeight();
    if (nw === w && nh === h && nd === dpr) return;
    dpr = nd;
    w = nw;
    h = nh;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  // The shape's own aspect is kept: it is centred inside the stage box.
  function fit(stage) {
    const r = stage.el.getBoundingClientRect();
    const a = stage.shape.aspect;
    let fw = r.width;
    let fh = r.width / a;
    if (fh > r.height) {
      fh = r.height;
      fw = r.height * a;
    }
    const ax = stage.align ?? 0.5;
    return { x: r.left + (r.width - fw) * ax, y: r.top + (r.height - fh) / 2, w: fw, h: fh, mid: r.top + r.height / 2 };
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const ready = stages.filter((s) => s.shape);
    if (!ready.length) return;
    if (!introStart) introStart = now;
    if (motion) intro = Math.min(1, (now - introStart) / 2200);

    // Where the middle of the screen sits between two stage centres.
    const fits = ready.map(fit);
    const vc = window.innerHeight * 0.5;
    let i = -1;
    for (let k = 0; k < fits.length; k += 1) if (fits[k].mid <= vc) i = k;
    let t = 0;
    let a = Math.max(i, 0);
    let b = a;
    if (i >= 0 && i < fits.length - 1) {
      b = i + 1;
      // The points stay with the shape they hold until the next stage is
      // within a screen of the middle, then rain into it. Far-apart stages
      // never leave a cloud of points hanging over the text between them.
      // On a phone the trip is shorter still: it starts once the next stage
      // is well on screen and lands before it reaches the middle.
      const below = fits[b].mid - vc;
      const span = Math.min(h * 0.85, fits[b].mid - fits[a].mid);
      const [lo, hi] = compact ? [0.1, 0.62] : [0.12, 0.88];
      t = 1 - (below - span * lo) / (span * (hi - lo));
      t = Math.min(1, Math.max(0, t));
    }
    if (pair[0] !== a || pair[1] !== b) {
      pair = [a, b];
      upload(bFrom, ready[a].shape.pos);
      upload(bTo, ready[b].shape.pos);
      upload(bColFrom, ready[a].shape.col);
      upload(bColTo, ready[b].shape.col);
    }

    // Scroll speed, smoothed: it stretches the points into streaks.
    const y = window.scrollY;
    vel += ((y - lastY) - vel) * 0.18;
    lastY = y;
    vel = Math.max(-80, Math.min(80, vel));

    // The pointer is followed with a little lag; its reach grows with speed.
    mouse.sx += (mouse.x - mouse.sx) * 0.22;
    mouse.sy += (mouse.y - mouse.sy) * 0.22;
    const reach = (w < 720 ? 70 : 100) + Math.min(mouse.speed, 80) * 1.2 + mouse.boost;
    mouse.r += (reach - mouse.r) * 0.12;
    mouse.speed *= 0.9;

    if (target) {
      if (!palette) palette = target.map((c) => [...c]);
      for (let k = 0; k < 4; k += 1) for (let j = 0; j < 3; j += 1) palette[k][j] += (target[k][j] - palette[k][j]) * 0.08;
    }

    const A = fits[a];
    const B = fits[b];
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4f(u.uA, A.x, A.y, A.w, A.h);
    gl.uniform4f(u.uB, B.x, B.y, B.w, B.h);
    gl.uniform1f(u.uT, t);
    gl.uniform1f(u.uTime, now / 1000);
    gl.uniform1f(u.uIntro, intro);
    gl.uniform1f(u.uVel, vel);
    gl.uniform1f(u.uDpr, dpr);
    gl.uniform1f(u.uSizeA, ready[a].size);
    gl.uniform1f(u.uSizeB, ready[b].size);
    gl.uniform1f(u.uMotion, motion ? 1 : 0);
    gl.uniform2f(u.uRes, w, h);
    gl.uniform2f(u.uMouse, mouse.sx, mouse.sy);
    gl.uniform1f(u.uMouseR, mouse.r);
    gl.uniform1f(u.uStreak, streak);
    gl.uniform1f(u.uFlight, compact ? 0.75 : 0.35);
    for (let k = 0; k < SHOCKS; k += 1) {
      const s = shocks[k];
      const age = (now - s.at) / 1000;
      if (s.reach && age > 1.15) s.reach = 0;
      shockData.set([s.x, s.y, age, s.reach], k * 4);
    }
    gl.uniform4fv(u.uShock, shockData);
    if (palette) gl.uniform3fv(uPal, new Float32Array(palette.flat()));
    gl.drawArrays(gl.POINTS, 0, n);
  }

  function start() {
    if (running) return;
    running = true;
    lastY = window.scrollY;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();

  return {
    setStages(list) {
      stages = list;
      pair = [-1, -1];
    },
    refresh() {
      pair = [-1, -1];
    },
    setPalette(colours) {
      target = colours.map(hex);
    },
    pointer(x, y, speed = 0) {
      if (mouse.x < -1000) {
        mouse.sx = x;
        mouse.sy = y;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.speed = Math.max(mouse.speed, speed);
    },
    leave() {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.sx = -9999;
      mouse.sy = -9999;
    },
    boost(px) {
      mouse.boost = px;
    },
    shock(x, y, strength = 1) {
      if (!motion) return;
      const s = shocks[nextShock];
      nextShock = (nextShock + 1) % SHOCKS;
      s.x = x;
      s.y = y;
      s.at = performance.now();
      s.reach = Math.hypot(w, window.innerHeight) * 0.45 * Math.min(1.6, strength);
    },
    resize,
    start,
    stop,
    // The context is left alone: React's development double-mount reuses
    // the same canvas, and a lost context cannot be revived.
    destroy() {
      stop();
    },
  };
}
