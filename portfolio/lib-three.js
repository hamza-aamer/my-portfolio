// Three.js — topographic contour background
// Warm paper with slowly drifting elevation contours — like a vintage survey map
// printed on cream stock, ink just barely soaked into the fiber.
import * as THREE from 'three';

(function(){
  const canvas = document.getElementById('three-canvas');
  if(!canvas) return;

  const css = getComputedStyle(document.documentElement);
  const readHex = (name, fb) => {
    const v = css.getPropertyValue(name).trim() || fb;
    return new THREE.Color(v);
  };
  let inkC = readHex('--fg', '#1a1916');
  let accC = readHex('--accent', '#b8502c');
  let acc2C = readHex('--accent2', '#3b5a4a');

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Full-screen contour shader
  const geo = new THREE.PlaneGeometry(2, 2);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:       {value: 0},
      uScroll:     {value: 0},
      uMouse:      {value: new THREE.Vector2(0, 0)},
      uResolution: {value: new THREE.Vector2(innerWidth, innerHeight)},
      uInk:        {value: new THREE.Vector3(inkC.r, inkC.g, inkC.b)},
      uAccent:     {value: new THREE.Vector3(accC.r, accC.g, accC.b)},
      uAccent2:    {value: new THREE.Vector3(acc2C.r, acc2C.g, acc2C.b)},
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScroll;
      uniform vec2  uMouse;
      uniform vec2  uResolution;
      uniform vec3  uInk;
      uniform vec3  uAccent;
      uniform vec3  uAccent2;

      // --- Simplex 2D noise (Ashima Arts) ---
      vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                                     + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                 dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0*fract(p*C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
        vec3 g;
        g.x = a0.x*x0.x + h.x*x0.y;
        g.yz = a0.yz*x12.xz + h.yz*x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractal Brownian motion — layered noise for natural terrain
      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for(int i = 0; i < 5; i++){
          v += a * snoise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

        // Mouse parallax — subtle shift
        p -= uMouse * 0.04;
        // Scroll offset — terrain drifts upward as you read
        p.y += uScroll * 0.8;

        float t = uTime * 0.02; // very slow drift

        // Two noise layers at different scales for depth
        float elev = fbm(p * 1.8 + t * 0.3);
        float elev2 = fbm(p * 3.6 + vec2(50.0) + t * 0.15) * 0.3;
        float combined = elev + elev2;

        // --- Contour lines ---
        float contours = 14.0; // number of elevation bands
        float raw = combined * contours;
        float band = fract(raw);

        // Thin contour line at each band edge
        float lineWidth = 1.2 / uResolution.y * contours * 3.0;
        float line = smoothstep(lineWidth, 0.0, abs(band - 0.5) - 0.46);

        // Major contour every 4th line — slightly thicker
        float majorRaw = combined * (contours / 4.0);
        float majorBand = fract(majorRaw);
        float majorLine = smoothstep(lineWidth * 1.8, 0.0, abs(majorBand - 0.5) - 0.44);

        // --- Coloring ---
        // Most lines: ink at low opacity (like pencil on paper)
        vec3 lineColor = uInk;
        float alpha = line * 0.07;

        // Major lines: slightly stronger
        alpha += majorLine * 0.05;

        // Accent-tinted contours in specific elevation ranges
        float accentZone = smoothstep(0.1, 0.25, combined) * smoothstep(0.55, 0.4, combined);
        vec3 tinted = mix(lineColor, uAccent, accentZone * 0.6);

        float accent2Zone = smoothstep(-0.3, -0.15, combined) * smoothstep(0.05, -0.1, combined);
        tinted = mix(tinted, uAccent2, accent2Zone * 0.5);

        // Very faint elevation fill — like watercolor wash between contours
        float fill = smoothstep(-0.5, 0.6, combined);
        float fillAlpha = fill * 0.018;
        vec3 fillColor = mix(uAccent2, uAccent, fill);

        // Combine
        vec3 finalColor = mix(fillColor, tinted, step(0.001, alpha));
        float finalAlpha = fillAlpha + alpha;

        // Subtle vignette — edges darken slightly like aged paper
        float vig = 1.0 - smoothstep(0.4, 1.2, length((vUv - 0.5) * 1.6));
        finalAlpha *= (0.7 + vig * 0.3);

        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const quad = new THREE.Mesh(geo, mat);
  scene.add(quad);

  // --- Mouse ---
  const mouse = new THREE.Vector2(0, 0);
  const mouseTarget = new THREE.Vector2(0, 0);
  window.addEventListener('mousemove', e => {
    mouseTarget.x = (e.clientX / innerWidth) * 2 - 1;
    mouseTarget.y = -((e.clientY / innerHeight) * 2 - 1);
  });

  // --- Scroll ---
  let scrollProg = 0;
  function updateScroll(){
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollProg = Math.min(1, window.scrollY / max);
  }
  window.addEventListener('scroll', updateScroll, {passive: true});
  updateScroll();

  // --- Resize ---
  window.addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    mat.uniforms.uResolution.value.set(innerWidth, innerHeight);
  });

  // --- Animate ---
  const clock = new THREE.Clock();
  function animate(){
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mat.uniforms.uScroll.value = scrollProg;
    mouse.lerp(mouseTarget, 0.04);
    mat.uniforms.uMouse.value.copy(mouse);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // --- Palette sync (tweaks panel) ---
  const obs = new MutationObserver(() => {
    const s = getComputedStyle(document.documentElement);
    inkC = new THREE.Color(s.getPropertyValue('--fg').trim() || '#1a1916');
    accC = new THREE.Color(s.getPropertyValue('--accent').trim() || '#b8502c');
    acc2C = new THREE.Color(s.getPropertyValue('--accent2').trim() || '#3b5a4a');
    mat.uniforms.uInk.value.set(inkC.r, inkC.g, inkC.b);
    mat.uniforms.uAccent.value.set(accC.r, accC.g, accC.b);
    mat.uniforms.uAccent2.value.set(acc2C.r, acc2C.g, acc2C.b);
  });
  obs.observe(document.documentElement, {attributes: true, attributeFilter: ['style']});
})();
