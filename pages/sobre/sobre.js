
(() => {
  const routes = [...document.querySelectorAll('.pillar-journey')].map(journey => {
    const path = journey.querySelector('.route-progress');
    return { journey, path, length: path.getTotalLength(), stops: [...journey.querySelectorAll('.pillar-stop')] };
  });
  function updateProgress() {
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
