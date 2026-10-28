// Interactive STL gallery for [data-model-viewer] blocks.
// Models come from the block's <script type="application/json" class="mv-data"> list:
//   { "name", "category", "src", "summary", "tags": [], "link"?, "linkLabel"?, "proposal"? }
// Starts when scrolled into view, loads each model on first use, pauses off screen.
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (_) { return false; }
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function renderInfo(info, m) {
  info.replaceChildren();
  info.append(el('span', 'mv-info-cat', m.category || ''), el('h3', 'pf-title', m.name), el('p', 'pf-build', m.summary || ''));
  if (m.tags && m.tags.length) {
    const ul = el('ul', 'pf-tech');
    ul.setAttribute('aria-label', 'Core tech');
    m.tags.forEach(t => ul.append(el('li', null, t)));
    info.append(ul);
  }
  if (m.proposal && typeof window.openProposal === 'function') {
    const b = el('button', 'pf-link pf-link-btn', 'View the accepted proposal →');
    b.type = 'button';
    b.addEventListener('click', () => window.openProposal(m.proposal));
    info.append(b);
  }
  if (m.link) {
    const a = el('a', 'pf-link', (m.linkLabel || 'Download the model') + ' ↗');
    a.href = m.link; a.target = '_blank'; a.rel = 'noopener';
    info.append(a);
  }
}

function initViewer(root) {
  const stage = root.querySelector('.mv-stage');
  const status = root.querySelector('.mv-status');
  const info = root.querySelector('.mv-info');
  const chipsBox = root.querySelector('.mv-chips');
  const models = JSON.parse(root.querySelector('.mv-data').textContent);
  let pick = i => show(i);

  const chips = models.map((m, i) => {
    const b = el('button', 'mv-chip');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.append(el('b', null, m.name), el('span', null, m.category || ''));
    b.addEventListener('click', () => pick(i));
    chipsBox.append(b);
    return b;
  });

  if (!hasWebGL()) {
    root.classList.add('mv-fallback');
    status.textContent = '3D preview needs WebGL';
    pick = i => { renderInfo(info, models[i]); chips.forEach((c, j) => c.setAttribute('aria-pressed', String(j === i))); };
    pick(0);
    return;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 5000);

  // Warm forge lighting: soft fill, orange key, gold rim
  scene.add(new THREE.HemisphereLight(0xfff1e6, 0x1a0d05, 1.1));
  const key = new THREE.DirectionalLight(0xffb37a, 2.2); key.position.set(2, 3, 2.5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xfaac3d, 1.4); rim.position.set(-3, 1.5, -2.5); scene.add(rim);
  const under = new THREE.DirectionalLight(0xee4236, 0.5); under.position.set(0, -3, 1); scene.add(under);

  const material = new THREE.MeshStandardMaterial({ color: 0xf0782d, roughness: 0.42, metalness: 0.18 });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;          // never hijack page scroll
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.6;
  renderer.domElement.style.touchAction = 'pan-y';   // vertical swipes still scroll the page on phones
  let resumeTimer = null;
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(resumeTimer); root.classList.add('mv-touched'); });
  controls.addEventListener('end', () => { if (!reduceMotion) resumeTimer = setTimeout(() => { controls.autoRotate = true; }, 4000); });

  const loader = new STLLoader();
  const cache = new Map();
  let mesh = null, active = -1, visible = false, running = false;

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);

  function frame(geometry) {
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const fit = Math.min(1, camera.aspect);            // narrow stages need more distance
    const dist = (r / Math.sin(fov / 2)) * 1.0 / fit;
    camera.near = dist / 100; camera.far = dist * 10;
    camera.position.set(dist * 0.62, dist * 0.42, dist * 0.66);
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function prepare(geometry) {
    geometry.rotateX(-Math.PI / 2);     // STL is Z-up; three.js is Y-up
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  }

  async function show(i) {
    if (i === active) return;
    active = i;
    const m = models[i];
    chips.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    renderInfo(info, m);
    root.classList.add('mv-loading');
    status.textContent = 'Loading ' + m.name + '…';
    try {
      if (!cache.has(m.src)) cache.set(m.src, loader.loadAsync(m.src).then(prepare));
      const geometry = await cache.get(m.src);
      if (active !== i) return;          // user switched while loading
      if (mesh) scene.remove(mesh);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      frame(geometry);
      stage.setAttribute('aria-label', 'Interactive 3D model: ' + m.name + '. Drag to rotate.');
      root.classList.remove('mv-loading');
      status.textContent = '';
    } catch (err) {
      console.error('[model-viewer] failed to load', m.src, err);
      root.classList.remove('mv-loading');
      status.textContent = 'Could not load this model';
    }
  }

  function loop() {
    if (!visible || document.hidden) { running = false; return; }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  function start() { if (!running && visible && !document.hidden) { running = true; requestAnimationFrame(loop); } }
  document.addEventListener('visibilitychange', start);

  let started = false;
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !started) { started = true; resize(); show(0); }
    start();
  }, { rootMargin: '200px 0px' }).observe(root);
}

document.querySelectorAll('[data-model-viewer]').forEach(initViewer);
