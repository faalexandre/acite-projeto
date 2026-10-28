(() => {
  const timeline = document.querySelector('.timeline');
  const selector = document.querySelector('#author-selector');
  const createButton = document.querySelector('#add-author-card');
  const feedback = document.querySelector('#author-card-feedback');
  const key = 'acite-investigacao-custom-authors';
  const template = timeline.querySelector('.timeline-entry').cloneNode(true);
  let authors = [];
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) authors = stored.filter(author => author && /^obra-custom-[a-z0-9-]+$/.test(author.id) && typeof author.name === 'string' && author.name.trim());
  } catch { /* Existing authors remain available if storage is unavailable. */ }

  function appendAuthor(author) {
    if (document.getElementById(author.id)) return;
    const entry = template.cloneNode(true);
    const card = entry.querySelector('.timeline-card');
    card.id = author.id;
    const title = entry.querySelector('.author-name');
    title.textContent = author.name;
    title.id = 'works-title-' + author.id;
    entry.querySelector('.works-section').setAttribute('aria-labelledby', title.id);
    const input = entry.querySelector('.publication-image-input');
    input.id = 'author-photo-' + author.id;
    input.dataset.photoId = 'publication-author-' + author.id;
    input.setAttribute('aria-label', 'Selecionar foto de ' + author.name);
    entry.querySelector('.publication-image-action').htmlFor = input.id;
    entry.querySelector('.works-details').href = '../autor-publicacao/index.html';
    timeline.append(entry);
    return card;
  }
  authors.forEach(appendAuthor);
  const names = new Map();
  [...timeline.querySelectorAll('.timeline-card')].forEach(card => {
    const name = card.querySelector('.author-name').textContent.trim();
    if (!names.has(name)) names.set(name, card.id);
  });
  [...names].sort((a, b) => a[0].localeCompare(b[0], 'pt'))
    .forEach(([name, id]) => selector.add(new Option(name, id)));
  selector.options[0].textContent = 'Todos os autores';
  selector.addEventListener('change', () => {
    createButton.disabled = !selector.value;
    const selectedName = selector.value ? selector.selectedOptions[0].textContent.trim() : null;
    timeline.querySelectorAll('.timeline-entry').forEach(entry => {
      const name = entry.querySelector('.author-name').textContent.trim();
      entry.hidden = Boolean(selectedName && name !== selectedName);
      if (!entry.hidden) {
        entry.classList.remove('reveal-pending');
        entry.classList.add('is-visible');
      }
    });
    timeline.classList.toggle('author-filtered', Boolean(selectedName));
    timeline.classList.remove('scroll-return');
    feedback.textContent = '';
    document.dispatchEvent(new CustomEvent('investigacao:filter-changed'));
  });
  const coverPicker = document.createElement('input');
  coverPicker.type = 'file';
  coverPicker.accept = 'image/*';
  coverPicker.hidden = true;
  document.body.append(coverPicker);
  let selectedCard;
  createButton.addEventListener('click', () => {
    if (!selector.value) return;
    selectedCard = document.getElementById(selector.value);
    coverPicker.value = '';
    coverPicker.click();
  });
  coverPicker.addEventListener('change', () => {
    const file = coverPicker.files[0];
    if (!file || !selectedCard) return;
    if (!file.type.startsWith('image/')) { feedback.textContent = 'Seleccione um ficheiro de imagem.'; return; }
    const card = selectedCard;
    card.closest('.timeline-entry').classList.remove('reveal-pending');
    card.closest('.timeline-entry').classList.add('is-visible');
    document.dispatchEvent(new CustomEvent('investigacao:add-cover', { detail: { card, file } }));
    feedback.textContent = 'Capa adicionada ao card do autor seleccionado.';
    card.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  });
})();
