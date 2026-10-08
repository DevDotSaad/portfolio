// Three.js "JARVIS" orb. Loaded lazily by <Orb/> after the page is idle.
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';

const COUNT = 2000;
const CYAN = 0x22d3ee;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uEnergy;
  uniform float uSize;
  uniform float uPR;
  attribute float aRand;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    vec3 dir = normalize(position);
    float n = sin(dir.x * 3.1 + uTime * 0.55) * sin(dir.y * 2.7 + uTime * 0.45) * sin(dir.z * 3.3 + uTime * 0.6);

    vec4 mv0 = modelViewMatrix * vec4(position, 1.0);
    vec4 clip0 = projectionMatrix * mv0;
    vec2 ndc = clip0.xy / clip0.w;
    float facing = (modelViewMatrix * vec4(dir, 0.0)).z;
    float infl = smoothstep(0.75, 0.0, distance(ndc, uMouse)) * smoothstep(-0.1, 0.4, facing);

    float pulse = pow(0.5 + 0.5 * sin(dir.y * 5.0 - uTime * 1.4 + aRand * 0.6), 6.0);
    float disp = n * 0.045 + infl * (0.08 + 0.22 * uEnergy) * (0.6 + 0.4 * sin(uTime * 3.0 + aRand * 6.2831));
    vec3 p = position + dir * disp;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vGlow = clamp(infl * (0.7 + uEnergy) + pulse * 0.55, 0.0, 1.6);
    vAlpha = mix(0.18, 1.0, smoothstep(-0.6, 0.7, facing));
    gl_PointSize = uSize * uPR * (0.75 + aRand * 0.5 + vGlow * 0.9) / -mv.z;
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    vec3 base = vec3(0.133, 0.827, 0.933);
    vec3 hot = vec3(0.85, 0.98, 1.0);
    vec3 col = mix(base * 0.85, hot, clamp(vGlow * 0.7, 0.0, 1.0));
    gl_FragColor = vec4(col, a * vAlpha * (0.55 + vGlow * 0.5));
  }
`;

function ring(radius: number, segments = 160) {
  const pts: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pts, 3));
  return g;
}

export function createOrb(container: HTMLElement, onReady: () => void) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  const pr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
  renderer.setPixelRatio(pr);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0, 6.2);

  const root = new Group();
  scene.add(root);

  // Fibonacci sphere
  const positions = new Float32Array(COUNT * 3);
  const rands = new Float32Array(COUNT);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const R = 1.25;
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    positions.set([Math.cos(t) * r * R, y * R, Math.sin(t) * r * R], i * 3);
    rands[i] = Math.random();
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geo.setAttribute('aRand', new Float32BufferAttribute(rands, 1));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new Vector2(5, 5) },
    uEnergy: { value: 0 },
    uSize: { value: 15 },
    uPR: { value: pr },
  };
  const mat = new ShaderMaterial({
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const sphere = new Points(geo, mat);
  root.add(sphere);

  // Orbiting rings, each with a small satellite.
  const ringMat = new LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false });
  const satMat = new PointsMaterial({ color: 0xbff6ff, size: 0.07, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false });
  const rings = [
    { r: 1.62, tilt: [1.2, 0.2], speed: 0.12 },
    { r: 1.9, tilt: [1.45, -0.5], speed: -0.08 },
    { r: 2.2, tilt: [0.9, 0.9], speed: 0.05 },
  ].map(({ r, tilt, speed }) => {
    const g = new Group();
    g.rotation.set(tilt[0], tilt[1], 0);
    g.add(new LineLoop(ring(r), ringMat));
    const sg = new BufferGeometry();
    sg.setAttribute('position', new Float32BufferAttribute([r, 0, 0], 3));
    const spin = new Group();
    spin.add(new Points(sg, satMat));
    g.add(spin);
    root.add(g);
    return { spin, speed };
  });

  // Sizing
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Pointer → NDC relative to the canvas
  const target = new Vector2(5, 5);
  let energy = 0;
  let lastX = 0, lastY = 0;
  let hasPointer = false;
  const onMove = (e: PointerEvent) => {
    const r = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    if (hasPointer) energy = Math.min(1, energy + Math.hypot(x - lastX, y - lastY) * 2.2);
    lastX = x;
    lastY = y;
    hasPointer = true;
    target.set(x, y);
  };
  if (!coarse) window.addEventListener('pointermove', onMove, { passive: true });

  // Loop — runs only while on screen and the tab is visible.
  let raf = 0;
  let running = false;
  let visible = true;
  let prev = performance.now();
  let t = 0;
  let first = true;
  const rot = { x: 0, y: 0 };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    t += dt;

    if (coarse || !hasPointer) {
      // gentle autonomous wander for touch devices / before the first move
      target.set(Math.sin(t * 0.35) * 0.45, Math.cos(t * 0.27) * 0.35);
    }
    uniforms.uMouse.value.lerp(target, 1 - Math.pow(0.001, dt));
    energy *= Math.pow(0.25, dt);
    uniforms.uEnergy.value = energy;
    uniforms.uTime.value = t;

    const m = uniforms.uMouse.value;
    const mx = Math.max(-1.5, Math.min(1.5, m.x));
    const my = Math.max(-1.5, Math.min(1.5, m.y));
    rot.x += (-my * 0.22 - rot.x) * (1 - Math.pow(0.02, dt));
    rot.y += (mx * 0.3 - rot.y) * (1 - Math.pow(0.02, dt));
    root.rotation.x = rot.x;
    root.rotation.y = rot.y;
    sphere.rotation.y += dt * 0.09;
    rings.forEach((r) => (r.spin.rotation.z += dt * r.speed * 4));

    renderer.render(scene, camera);
    if (first) {
      first = false;
      onReady();
    }
  };

  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    prev = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(container);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  start();

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('pointermove', onMove);
    geo.dispose();
    mat.dispose();
    ringMat.dispose();
    satMat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
