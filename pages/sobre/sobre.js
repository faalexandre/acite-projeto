
(() => {
  const pillarSequence = document.querySelector('.pillar-sequence');
  let previousScrollY = window.scrollY;
  const routes = [...document.querySelectorAll('.pillar-journey')].map(journey => {
    const path = journey.querySelector('.route-progress');
    return { journey, path, length: path.getTotalLength(), stops: [...journey.querySelectorAll('.pillar-stop')] };
  });
  const connector = document.querySelector('.journey-connector');
  if (connector && routes.length >= 2) {
    const connectorRoute = { path: connector.querySelector('.route-progress'), length: 0, stops: [] };
    function layoutConnector() {
      const bounds = connector.parentElement.getBoundingClientRect();
      const first = routes[0].path.ownerSVGElement.getBoundingClientRect();
      const second = routes[1].path.ownerSVGElement.getBoundingClientRect();
      const x1 = first.left - bounds.left + first.width * .915;
      const y1 = first.top - bounds.top + first.height * 620 / 690;
      const x2 = second.left - bounds.left + second.width * .085;
      const y2 = second.top - bounds.top + second.height * 110 / 1190;
      const bend = first.bottom - bounds.top + 16;
      const right = bounds.width * .975;
      const left = bounds.width * .025;
      const d = `M ${x1} ${y1} C ${right} ${y1} ${right} ${bend} ${right - 24} ${bend} L ${left + 24} ${bend} C ${left} ${bend} ${left} ${y2} ${x2} ${y2}`;
      connector.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      connector.querySelectorAll('path').forEach(path => path.setAttribute('d', d));
      connectorRoute.length = connectorRoute.path.getTotalLength();
    }
    layoutConnector();
    routes.push(connectorRoute);
    window.addEventListener('resize', layoutConnector);
    window.addEventListener('load', layoutConnector);
    if (document.fonts) document.fonts.ready.then(() => { layoutConnector(); scheduleProgress(); });
  }
  function updateProgress() {
    const currentScrollY = window.scrollY;
    if (pillarSequence && Math.abs(currentScrollY - previousScrollY) >= 2) {
      pillarSequence.classList.toggle('scrolling-up', currentScrollY > 0 && currentScrollY < previousScrollY);
      previousScrollY = currentScrollY;
    }
    if (pillarSequence && currentScrollY === 0) pillarSequence.classList.remove('scrolling-up');
    const readingLine = window.innerHeight * .65;
    routes.forEach(({ journey, path, length, stops }) => {
      const svg = path.ownerSVGElement;
      const bounds = svg.getBoundingClientRect();
      if (!bounds.height) return;
      const targetY = (readingLine - bounds.top) / bounds.height * svg.viewBox.baseVal.height;
      // Follow the height of the winding path rather than filling each bend at once.
      let low = 0;
      let high = length;
      for (let step = 0; step < 18; step++) {
        const middle = (low + high) / 2;
        if (path.getPointAtLength(middle).y <= targetY) low = middle;
        else high = middle;
      }
      path.style.strokeDashoffset = String(1 - low / length);
      stops.forEach(stop => {
        const marker = stop.querySelector('.pillar-marker').getBoundingClientRect();
        stop.classList.toggle('is-reached', marker.top + marker.height / 2 <= readingLine);
      });
    });
  }
  let progressPending = false;
  function scheduleProgress() {
    if (progressPending) return;
    progressPending = true;
    requestAnimationFrame(() => {
      progressPending = false;
      updateProgress();
    });
  }
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  window.addEventListener('load', scheduleProgress);
  if (document.fonts) document.fonts.ready.then(scheduleProgress);
  updateProgress();
  document.querySelectorAll('.pillar-journey').forEach(journey => {
  const stops = [...journey.querySelectorAll('.pillar-stop')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    [journey, ...stops].forEach(element => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .15 });
  observer.observe(journey);
  stops.forEach(stop => {
    if (stop.getBoundingClientRect().top >= window.innerHeight) stop.classList.add('reveal-pending');
    observer.observe(stop);
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    [journey, ...stops].forEach(element => {
      element.classList.remove('reveal-pending');
      element.classList.add('is-visible');
    });
    observer.disconnect();
  });
  });
})();
