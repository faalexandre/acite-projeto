const header = document.querySelector('.header');
const toggle = document.querySelector('.menu-toggle');
function closeMenu() { header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => { const open = header.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded', String(open)); });
header.querySelectorAll('nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const media = matchMedia('(min-width: 901px)');
media.addEventListener('change', closeMenu);
const links = [...document.querySelectorAll('.sidebar nav a')];
if ('IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => {
  const active = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
  if (!active) return;
  links.forEach(link => { if (link.hash === '#' + active.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
 }, { rootMargin: '-10% 0px -45% 0px' });
 document.querySelectorAll('.service-section').forEach(section => observer.observe(section));
}