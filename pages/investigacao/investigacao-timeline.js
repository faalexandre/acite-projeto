(() => {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('research-route');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const paths = ['outline', 'surface', 'dashes', 'progress'].map(kind => {
    const path = document.createElementNS(ns, 'path');
    path.classList.add('research-route-' + kind);
    if (kind === 'progress') path.setAttribute('pathLength', '1');
    svg.append(path);
    return path;
  });
  timeline.append(svg);
  timeline.classList.add('has-research-route');
  let length = 0;
  let pending = false;
  let needsLayout = true;
  function draw() {
    const bounds = timeline.getBoundingClientRect();
    const entries = [...timeline.querySelectorAll('.timeline-entry')];
    const points = entries.map(entry => {
      const card = entry.querySelector('.timeline-card');
      return { x: entry.offsetLeft + card.offsetLeft + card.offsetWidth / 2, y: entry.offsetTop + card.offsetTop - 30 };
    });
    if (!points.length) return;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let index = 1; index < points.length; index++) {
      const previous = points[index - 1];
      const point = points[index];
      if (Math.abs(previous.y - point.y) < 4) {
        d += ` L ${point.x} ${point.y}`;
      } else {
        // Route each turn through the outside gutter, clear of the cards.
        const edge = previous.x >= bounds.width / 2 ? bounds.width - 12 : 12;
        const direction = edge > previous.x ? 1 : -1;
        const radius = 18;
        const approach = point.y - 24;
        d += ` L ${edge - direction * radius} ${previous.y}`;
        d += ` Q ${edge} ${previous.y} ${edge} ${previous.y + radius}`;
        d += ` L ${edge} ${approach - radius}`;
        d += ` Q ${edge} ${approach} ${edge - direction * radius} ${approach}`;
        d += ` L ${point.x + direction * radius} ${approach}`;
        d += ` Q ${point.x} ${approach} ${point.x} ${point.y}`;
      }
    }
    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y + 8}`;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    paths.forEach(path => path.setAttribute('d', d));
    length = paths[3].getTotalLength();
  }
  function update() {
    pending = false;
    if (needsLayout) { draw(); needsLayout = false; }
    if (!length) return;
    const bounds = timeline.getBoundingClientRect();
    const readingY = window.innerHeight * .62 - bounds.top;
    let low = 0;
    let high = length;
    for (let step = 0; step < 18; step++) {
      const middle = (low + high) / 2;
      if (paths[3].getPointAtLength(middle).y <= readingY) low = middle;
      else high = middle;
    }
    paths[3].style.strokeDashoffset = String(1 - low / length);
    timeline.querySelectorAll('.timeline-entry').forEach(entry => {
      const card = entry.querySelector('.timeline-card').getBoundingClientRect();
      entry.classList.toggle('route-reached', card.top - 30 <= window.innerHeight * .62);
    });
  }
  function schedule(layout = false) {
    needsLayout ||= layout;
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', () => schedule(), { passive: true });
  window.addEventListener('resize', () => schedule(true));
  window.addEventListener('load', () => schedule(true));
  if (document.fonts) document.fonts.ready.then(() => schedule(true));
  if ('ResizeObserver' in window) new ResizeObserver(() => schedule(true)).observe(timeline);
  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === 'childList')) schedule(true);
  });
  observer.observe(timeline, { childList: true, subtree: true });
  schedule(true);
})();
