const header = document.querySelector('.header');
const toggle = document.querySelector('.menu-toggle');
function closeMenu() { header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => { const open = header.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && header.classList.contains('menu-open')) { closeMenu(); toggle.focus(); } });
const sectionLinks = [...document.querySelectorAll('.sidebar a[href^="#"]')];
const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1)));

function updateActiveSection() {
  // Use a reading line near the top of the viewport, including short sections.
  const readingLine = Math.min(160, window.innerHeight * 0.25);
  let activeIndex = 0;
  sections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= readingLine) activeIndex = index;
  });
  // The final section may never reach the reading line on a tall screen.
  if (window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
    activeIndex = sectionLinks.length - 1;
  }
  sectionLinks.forEach((link, index) => {
    const active = index === activeIndex;
    link.classList.toggle('selected', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

let scrollUpdatePending = false;
function scheduleSectionUpdate() {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(() => {
    scrollUpdatePending = false;
    updateActiveSection();
  });
}
window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
window.addEventListener('resize', scheduleSectionUpdate);
window.addEventListener('load', scheduleSectionUpdate);
window.addEventListener('hashchange', scheduleSectionUpdate);
if (document.fonts) document.fonts.ready.then(scheduleSectionUpdate);
updateActiveSection();
document.querySelector('#ano').textContent = new Date().getFullYear();
