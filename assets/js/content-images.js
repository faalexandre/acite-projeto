(() => {
  const base = new URL('../../', document.currentScript.src);
  const portraits = [
    [/bibiana/i, 'Bibiana.png'],
    [/lu[zi]+a.*sebasti/i, 'luiza-sebastiao.png'],
    [/carlos.*feij/i, 'carlos-feijo.png'],
    [/boaventura/i, 'boaventura-sousa.png'],
    [/oct[aá]vio|van.d[uú]nem/i, 'Jose-Octavio-Serra-Van-Dunem.jpg'],
    [/jos[eé].*abel/i, 'jose-abel.png'],
  ];
  const illustrations = ['A4 - 1.png', 'A4 - 2.png', 'A4 - 3.png', 'A4 - 6.png', 'A4 - 7.png'];
  function insertImage(container, file, alt, portrait = false) {
    if (container.querySelector('img')) return;
    const image = document.createElement('img');
    image.src = new URL(file, base).href;
    image.alt = alt;
    image.loading = 'lazy';
    image.style.cssText = `width:100%;height:100%;object-fit:${portrait ? 'cover' : 'contain'};display:block`;
    if (container.matches('.author-photo-area')) {
      container.prepend(image);
      container.classList.add('has-photo');
    } else container.replaceChildren(image);
  }
  function fillCards() {
    document.querySelectorAll('.faculty-photo-placeholder, .author-photo-area, #profile-photo').forEach(area => {
      const card = area.closest('.faculty-entry, .timeline-card');
      const name = card?.querySelector('.author-name, h3')?.textContent || document.querySelector('#profile-name')?.textContent || '';
      const file = portraits.find(([pattern]) => pattern.test(name))?.[1];
      insertImage(area, file ? `img/${file}` : 'assets/logo/logo.png', file ? `Fotografia de ${name.trim()}` : 'ACITE — fotografia não disponível', Boolean(file));
    });
    document.querySelectorAll('.investigation-cover, .cover-change').forEach((area, index) => {
      if (area.querySelector('img')) return;
      insertImage(area, `img/${illustrations[index % illustrations.length]}`, 'Imagem ilustrativa de uma publicação');
      const note = document.createElement('small');
      note.textContent = 'Imagem ilustrativa';
      note.style.cssText = 'display:block;text-align:center;color:#61717e;margin:.4rem 0';
      area.after(note);
    });
  }
  fillCards();
  new MutationObserver(fillCards).observe(document.body, { childList: true, subtree: true });
})();
