const menuToggle = document.querySelector('.menu-toggle');
    const siteHeader = document.querySelector('.site-header');
    const mobileMenu = window.matchMedia('(max-width: 640px)');

    function closeMobileMenu() {
      siteHeader.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = siteHeader.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      menuToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    siteHeader.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', closeMobileMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });
    mobileMenu.addEventListener('change', (event) => {
      if (!event.matches) closeMobileMenu();
    });

    const catalogSearch = document.querySelector('#catalog-query');
    const degreeGroups = [...document.querySelectorAll('.degree-group')];
    const emptyState = document.querySelector('#empty-state');
    const searchStatus = document.querySelector('#search-status');
    const linkedGroup = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));

    if (linkedGroup && linkedGroup.matches('.degree-group')) linkedGroup.open = true;

    function filterCatalog() {
      const query = catalogSearch.value.trim().toLocaleLowerCase('pt');
      let visibleCount = 0;

      degreeGroups.forEach((group) => {
        const groupMatches = !query || `${group.dataset.search} ${group.querySelector(':scope > summary').textContent}`.toLocaleLowerCase('pt').includes(query);
        const items = [...group.querySelectorAll('.subject-item')];
        let matchingItems = 0;

        items.forEach((item) => {
          const itemMatches = !query
            || groupMatches
            || `${item.dataset.search} ${item.querySelector(':scope > summary').textContent} ${item.querySelector('.subject-details').textContent}`.toLocaleLowerCase('pt').includes(query);
          item.hidden = !itemMatches;
          if (itemMatches) matchingItems += 1;
        });

        const isVisible = groupMatches || matchingItems > 0;
        group.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
          if (query) group.open = true;
        }
      });

      emptyState.hidden = visibleCount !== 0;
      searchStatus.textContent = visibleCount === 1
        ? 'Foi encontrada 1 categoria.'
        : `Foram encontradas ${visibleCount} categorias.`;
    }

    catalogSearch.addEventListener('input', filterCatalog);
  
;

    (() => {
      document.querySelectorAll('.degree-group .subject-item').forEach((subject) => {
        if (subject.querySelector('.strategic-video')) return;
        const area = document.createElement('div');
        area.className = 'strategic-video';
        subject.querySelector('.subject-details').prepend(area);
      });
      const areas = [...document.querySelectorAll('.degree-group .strategic-video')];
      const urls = new Map();
      const database = new Promise((resolve, reject) => {
        const request = indexedDB.open('acite-course-videos', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('videos');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Armazenamento bloqueado.'));
      });
      database.catch(() => {});
      areas.forEach((area, index) => {
        area.removeAttribute('role');
        const course = area.closest('.subject-item').querySelector('summary').textContent.trim();
        const subject = area.closest('.subject-item');
        const group = subject.closest('.degree-group');
        const courseIndex = [...group.querySelectorAll('.subject-item')].indexOf(subject);
        const key = group.id === 'doutoramentos'
          ? `doctorate-${courseIndex}`
          : `${group.id}-${subject.dataset.search || course}`;
        area.innerHTML = `<video controls playsinline preload="metadata" hidden></video>
          <button class="course-video-upload" type="button"><i class="fa-regular fa-circle-play" aria-hidden="true"></i><span>Carregar v\u00eddeo explicativo</span></button>
          <input type="file" accept="video/*" hidden>
          <p role="status" aria-live="polite">Clique no \u00edcone para selecionar um v\u00eddeo.</p>`;
        const button = area.querySelector('button');
        const input = area.querySelector('input');
        const video = area.querySelector('video');
        const status = area.querySelector('p');
        button.setAttribute('aria-label', `Carregar v\u00eddeo: ${course}`);
        function show(blob) {
          video.pause();
          if (urls.has(key)) URL.revokeObjectURL(urls.get(key));
          const url = URL.createObjectURL(blob);
          urls.set(key, url);
          video.src = url;
          video.hidden = false;
          button.querySelector('span').textContent = 'Substituir v\u00eddeo';
        }
        video.addEventListener('error', () => {
          status.textContent = 'N\u00e3o foi poss\u00edvel reproduzir este formato. Selecione outro v\u00eddeo.';
        });
        button.addEventListener('click', () => input.click());
        let selected = false;
        input.addEventListener('change', async () => {
          const file = input.files[0];
          if (!file) return;
          input.value = '';
          if (!file.type.startsWith('video/')) {
            status.textContent = 'Selecione um ficheiro de v\u00eddeo.';
            return;
          }
          selected = true;
          show(file);
          status.textContent = 'A guardar v\u00eddeo...';
          try {
            const db = await database;
            await new Promise((resolve, reject) => {
              const tx = db.transaction('videos', 'readwrite');
              tx.objectStore('videos').put(file, key);
              tx.oncomplete = resolve;
              tx.onerror = tx.onabort = () => reject(tx.error);
            });
            status.textContent = 'V\u00eddeo guardado neste navegador.';
          } catch {
            status.textContent = 'V\u00eddeo carregado para esta sess\u00e3o. N\u00e3o foi poss\u00edvel guard\u00e1-lo neste navegador.';
          }
        });
        database.then(db => new Promise((resolve, reject) => {
          const request = db.transaction('videos').objectStore('videos').get(key);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        })).then(blob => {
          if (blob instanceof Blob && !selected) {
            show(blob);
            status.textContent = 'V\u00eddeo guardado neste navegador.';
          }
        }).catch(() => {});
      });
      window.addEventListener('beforeunload', () => {
        urls.forEach(url => URL.revokeObjectURL(url));
        urls.clear();
      });
    })();
