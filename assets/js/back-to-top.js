(() => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top';
  button.hidden = true;
  button.setAttribute('aria-label', 'Voltar ao início da página');
  button.title = 'Voltar ao início';
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.append(button);
  const existing = document.querySelector('.timeline-top');
  function update() {
    const bounds = existing && existing.getBoundingClientRect();
    const existingVisible = bounds && bounds.bottom > 0 && bounds.top < window.innerHeight;
    button.hidden = window.scrollY < 500 || document.documentElement.scrollHeight < window.innerHeight * 1.5 || Boolean(existingVisible);
  }
  let pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  }
  button.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
    const previousTabindex = document.body.getAttribute('tabindex');
    document.body.tabIndex = -1;
    document.body.focus({ preventScroll: true });
    if (previousTabindex === null) document.body.removeAttribute('tabindex');
    else document.body.setAttribute('tabindex', previousTabindex);
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  update();
})();
