(() => {
  const urls = new Set();
  const database = new Promise(resolve => {
    if (!window.indexedDB) return resolve(null);
    const request = indexedDB.open('acite-author-covers', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('covers', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = request.onblocked = () => resolve(null);
  });
  async function readCovers() {
    const db = await database;
    if (!db) return [];
    return new Promise(resolve => {
      const request = db.transaction('covers').objectStore('covers').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  }
  const coversLoaded = readCovers();
  const profilesReady = Promise.all(Array.from(document.querySelectorAll('.timeline-card'), async profile => {
    const author = 'investigacao-' + profile.id;
    const name = profile.querySelector('.author-name').textContent.trim();
    const seed = profile.querySelector('.work-seed').content;
    const seedTitle = seed.querySelector('h3').textContent.trim();
    const seedSummary = seed.querySelector('p').textContent.trim();
    const grid = profile.querySelector('[data-author-works]');
    const status = profile.querySelector('[data-author-status]');
    const stored = (await coversLoaded).filter(cover => cover.author === author).slice(0, 6);
    const works = Array.from({ length: 6 }, (_, index) => stored[index] || {
      id: index === 0 ? author + '-principal' : author + '-obra-' + (index + 1),
      author,
      title: index === 0 ? seedTitle : 'Obra por adicionar',
      description: index === 0 ? seedSummary : '',
      concepts: ''
    });
    works.forEach(work => {
      const card = document.createElement('article');
      card.className = 'work-cover-card';
      card.innerHTML = '<button class="cover-change" type="button"><span>Adicionar capa</span></button><input type="file" accept="image/*" hidden><details class="work-info"><summary>Informações da obra</summary><h4>Título</h4><h3></h3><h4>Resumo</h4><p data-summary></p><h4>Conceitos</h4><p data-concepts></p></details>';
      const button = card.querySelector('button');
      const accordion = card.querySelector('.work-info');
      accordion.setAttribute('name', 'author-work-details');
      accordion.addEventListener('toggle', () => {
        if (!accordion.open) return;
        document.querySelectorAll('.work-info[open]').forEach(other => {
          if (other !== accordion) other.open = false;
        });
      });
      const input = card.querySelector('input');
      const title = work.title || (work.name || '').replace(/\.[^.]+$/, '') || seedTitle;
      const heading = document.createElement('h3');
      heading.className = 'work-card-title';
      heading.textContent = title;
      card.insertBefore(heading, accordion);
      accordion.querySelector('h3').textContent = title;
      card.querySelector('[data-summary]').textContent = work.description || (title === seedTitle ? seedSummary : 'Resumo ainda não disponibilizado.');
      card.querySelector('[data-concepts]').textContent = Array.isArray(work.concepts) ? work.concepts.join(', ') : work.concepts || 'Conceitos ainda não disponibilizados.';
      button.setAttribute('aria-label', 'Modificar capa de ' + title);
      button.title = 'Clique para modificar a capa';
      let currentUrl;
      function showCover(blob) {
        if (currentUrl) { URL.revokeObjectURL(currentUrl); urls.delete(currentUrl); }
        currentUrl = URL.createObjectURL(blob);
        urls.add(currentUrl);
        const image = document.createElement('img');
        image.src = currentUrl;
        image.alt = 'Capa de ' + title + ' — ' + name;
        button.replaceChildren(image);
      }
      if (work.blob instanceof Blob) showCover(work.blob);
      button.addEventListener('click', () => input.click());
      input.addEventListener('change', async () => {
        const file = input.files[0];
        input.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) { status.textContent = 'Selecione um ficheiro de imagem.'; return; }
        work = { ...work, title, blob: file, name: file.name };
        showCover(file);
        button.disabled = true;
        try {
          const db = await database;
          if (!db) throw new Error('Armazenamento indisponível');
          await new Promise((resolve, reject) => {
            const tx = db.transaction('covers', 'readwrite');
            tx.objectStore('covers').put(work);
            tx.oncomplete = resolve;
            tx.onerror = tx.onabort = () => reject(tx.error);
          });
          status.textContent = 'Capa guardada neste navegador.';
        } catch { status.textContent = 'Capa alterada apenas nesta sessão. Não foi possível guardar.'; }
        finally { button.disabled = false; }
      });
      grid.append(card);
    });
  }));
  function showLinkedAuthor() {
    const profile = document.getElementById(location.hash.slice(1));
    const name = profile?.querySelector('.author-name');
    if (!name) return;
    name.tabIndex = -1;
    name.focus({ preventScroll: true });
    name.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  profilesReady.then(() => requestAnimationFrame(showLinkedAuthor));
  window.addEventListener('hashchange', () => profilesReady.then(showLinkedAuthor));
  window.addEventListener('beforeunload', () => urls.forEach(url => URL.revokeObjectURL(url)));
})();
