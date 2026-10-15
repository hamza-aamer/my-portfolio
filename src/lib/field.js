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
  p += perp * sin(tp * 3.14159) * (aRand.y - 0.5) * min(len, 700.0) * 0.7 * uMotion;

  // Breathing at rest, and streaks when the page is flung.
  float t = uTime;
  p += vec2(sin(t * 0.8 + aRand.z * 40.0), cos(t * 0.7 + aRand.w * 40.0)) * 1.1 * uMotion;
  p.y += uVel * (aRand.x - 0.5) * 1.4 * uMotion;
  p.x += uVel * (aRand.w - 0.5) * 0.5 * uMotion;

  // The first arrival: from everywhere into the name.
  float ip = clamp((uIntro - aRand.y * 0.45) / 0.55, 0.0, 1.0);
  ip = 1.0 - pow(1.0 - ip, 3.0);
  vec2 scatter = vec2(aRand.z, aRand.w) * uRes * 1.2 - uRes * 0.1;
  p = mix(scatter, p, ip);

  // The pointer pushes points aside.
  vec2 d = p - uMouse;
  float dist = length(d);
  float f = 1.0 - smoothstep(0.0, uMouseR, dist);
  f = f * f;
  p += (dist > 0.001 ? d / dist : vec2(0.0)) * f * uMouseR * 0.9;

  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = mix(uSizeA, uSizeB, tp) * uDpr * (1.0 + f * 0.8);

  int ci = int(tp < 0.5 ? aColFrom : aColTo);
  vec3 c = uPal[0];
  if (ci == 1) c = uPal[1];
  if (ci == 2) c = uPal[2];
  if (ci == 3) c = uPal[3];
  vCol = c;
  vAlpha = ip;
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

export function createField(canvas, { n, motion = true }) {
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
    ['uA', 'uB', 'uT', 'uTime', 'uIntro', 'uVel', 'uDpr', 'uSizeA', 'uSizeB', 'uMotion', 'uRes', 'uMouse', 'uMouseR'].map((k) => [k, loc(k)]),
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

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
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
    const vc = h * 0.5;
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
      const below = fits[b].mid - vc;
      const span = Math.min(h * 0.85, fits[b].mid - fits[a].mid);
      t = 1 - (below - span * 0.12) / (span * 0.76);
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
