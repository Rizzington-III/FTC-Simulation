// Orbital rail: a curved scroll spine in the right third of the viewport.
// Hexagonal waypoints hang off the curve in an alternating diagonal descent and a
// double-ringed dial travels along the curve as the page scrolls.

const HEX_NODES = [
  { x: 74, y: 15, size: 132, tilt: 0 },
  { x: 44, y: 32, size: 98, tilt: 12 },
  { x: 78, y: 50, size: 150, tilt: -9 },
  { x: 48, y: 68, size: 104, tilt: 15 },
  { x: 72, y: 86, size: 126, tilt: -5 },
];

const HEX_POINTS = '50,3 93,27 93,73 50,97 7,73 7,27';

// Catmull-Rom smoothing so the line flows through every hexagon's starting point.
function smoothPath(points) {
  if (points.length < 2) return '';

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function buildRail() {
  if (document.querySelector('.orbital-rail')) return;

  const rail = document.createElement('aside');
  rail.className = 'orbital-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = `
    <svg class="rail-curve">
      <path class="rail-path rail-path-glow" />
      <path class="rail-path rail-path-main" />
      <g class="scroll-dial">
        <circle class="dial-halo" r="24" />
        <circle class="dial-ring" r="14" />
        <circle class="dial-core" r="3.5" />
        <line class="dial-tick" x1="0" y1="-14" x2="0" y2="-23" />
      </g>
    </svg>
  `;

  HEX_NODES.forEach((node) => {
    const hex = document.createElement('div');
    hex.className = 'rail-hex';
    hex.style.left = `${node.x}%`;
    hex.style.top = `${node.y}%`;
    hex.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="${HEX_POINTS}" /></svg>`;
    rail.appendChild(hex);
  });

  document.body.appendChild(rail);

  const curve = rail.querySelector('.rail-curve');
  const paths = rail.querySelectorAll('.rail-path');
  const mainPath = rail.querySelector('.rail-path-main');
  const dial = rail.querySelector('.scroll-dial');
  const hexes = Array.from(rail.querySelectorAll('.rail-hex'));

  let nodePoints = [];

  function measure() {
    const rect = rail.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (!w || !h) return;

    curve.setAttribute('viewBox', `0 0 ${w.toFixed(2)} ${h.toFixed(2)}`);
    curve.setAttribute('width', w.toFixed(2));
    curve.setAttribute('height', h.toFixed(2));

    const scale = Math.min(1, w / 520);
    hexes.forEach((hex, index) => {
      const size = HEX_NODES[index].size * scale;
      hex.style.width = `${size}px`;
      hex.style.height = `${size}px`;
      hex.style.transform = `translate(-50%, -50%) rotate(${HEX_NODES[index].tilt}deg)`;
    });

    nodePoints = HEX_NODES.map((node) => ({
      x: (w * node.x) / 100,
      y: (h * node.y) / 100,
    }));

    // Curve starts above the first hexagon and keeps drawing down past the last one.
    const pathPoints = [
      { x: nodePoints[0].x + w * 0.14, y: 18 },
      ...nodePoints,
      { x: nodePoints[nodePoints.length - 1].x - w * 0.12, y: h - 18 },
    ];

    const d = smoothPath(pathPoints);
    paths.forEach((path) => path.setAttribute('d', d));
    update();
  }

  let ticking = false;

  function update() {
    if (!nodePoints.length) return;

    const total = mainPath.getTotalLength();
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    const distance = total * progress;

    const point = mainPath.getPointAtLength(distance);
    const ahead = mainPath.getPointAtLength(Math.min(total, distance + 6));
    const behind = mainPath.getPointAtLength(Math.max(0, distance - 6));
    const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * (180 / Math.PI) + 90;

    dial.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle + progress * 180})`);

    hexes.forEach((hex, index) => {
      const node = nodePoints[index];
      hex.classList.toggle('is-active', Math.abs(point.y - node.y) < 62);
    });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }

  measure();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildRail);
} else {
  buildRail();
}
