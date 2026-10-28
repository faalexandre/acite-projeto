(() => {
 const photoId = 'faculty-photo-1';
 const facultyName = document.querySelector('#profile-name').textContent;
      const worksInput = document.querySelector('#works-files');
      const worksStatus = document.querySelector('#works-status');
      const worksGrid = document.querySelector('#works-grid');
      const workUrls = [];
      const worksDatabase = new Promise((resolve, reject) => {
        const request = indexedDB.open('acite-author-covers', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('covers', { keyPath: 'id' });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Armazenamento bloqueado.'));
      });
      function appendCover(cover) {
        const figure = document.createElement('figure');
        figure.className = 'work-cover-card';
        const image = document.createElement('img');
        const url = URL.createObjectURL(cover.blob);
        workUrls.push(url);
        image.src = url;
        image.alt = `Capa da obra de ${facultyName}: ${cover.name}`;
        image.loading = 'lazy';
        const caption = document.createElement('figcaption');
        caption.textContent = cover.name.replace(/\.[^.]+$/, '');
        const replaceButton = document.createElement('button');
        replaceButton.type = 'button';
        replaceButton.className = 'works-upload';
        replaceButton.innerHTML = '<i class="fa-solid fa-pen" aria-hidden="true"></i>';
        replaceButton.setAttribute('aria-label', `Substituir capa: ${cover.name}`);
        const replacementInput = document.createElement('input');
        replacementInput.type = 'file';
        replacementInput.accept = 'image/*';
        replacementInput.hidden = true;
        replaceButton.addEventListener('click', () => replacementInput.click());
        image.style.cursor = 'pointer';
        image.addEventListener('click', () => replacementInput.click());
        replacementInput.addEventListener('change', async () => {
          const file = replacementInput.files[0];
          replacementInput.value = '';
          if (!file) return;
          if (!file.type.startsWith('image/')) {
            worksStatus.textContent = 'Selecione um ficheiro de imagem.';
            return;
          }
          replaceButton.disabled = true;
          const previousUrl = image.src;
          const nextUrl = URL.createObjectURL(file);
          workUrls.push(nextUrl);
          image.src = nextUrl;
          URL.revokeObjectURL(previousUrl);
          cover = { ...cover, blob: file, name: file.name };
          image.alt = `Capa da obra de ${facultyName}: ${cover.name}`;
          caption.textContent = cover.name.replace(/\.[^.]+$/, '');
          replaceButton.setAttribute('aria-label', `Substituir capa: ${cover.name}`);
          try {
            const db = await worksDatabase;
            await new Promise((resolve, reject) => {
              const tx = db.transaction('covers', 'readwrite');
              tx.objectStore('covers').put(cover);
              tx.oncomplete = resolve;
              tx.onerror = tx.onabort = () => reject(tx.error);
            });
            worksStatus.textContent = 'Capa substitu\u00edda e guardada neste navegador.';
          } catch {
            worksStatus.textContent = 'Capa substitu\u00edda apenas nesta sess\u00e3o. N\u00e3o foi poss\u00edvel guardar a imagem.';
          } finally {
            replaceButton.disabled = false;
          }
        });
        figure.append(image, caption, replaceButton, replacementInput);
        worksGrid.append(figure);
      }
      const worksLoaded = worksDatabase.then(db => new Promise((resolve, reject) => {
        const request = db.transaction('covers').objectStore('covers').getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      })).then(covers => {
        covers.filter(cover => cover.author === photoId).forEach(appendCover);
      }).catch(() => {
        worksStatus.textContent = 'As capas adicionadas ficar\u00e3o dispon\u00edveis apenas nesta sess\u00e3o.';
      });
      document.querySelector('#works-upload').addEventListener('click', () => worksInput.click());
      worksInput.addEventListener('change', async () => {
        const files = [...worksInput.files];
        worksInput.value = '';
        if (!files.length) return;
        await worksLoaded;
        let saved = 0, failed = 0, invalid = 0;
        for (const file of files) {
          if (!file.type.startsWith('image/')) { invalid++; continue; }
          const cover = { id: `${photoId}-${Date.now()}-${Math.random().toString(36).slice(2)}`, author: photoId, blob: file, name: file.name };
          appendCover(cover);
          try {
            const db = await worksDatabase;
            await new Promise((resolve, reject) => {
              const tx = db.transaction('covers', 'readwrite');
              tx.objectStore('covers').put(cover);
              tx.oncomplete = resolve;
              tx.onerror = tx.onabort = () => reject(tx.error);
            });
            saved++;
          } catch { failed++; }
        }
        worksStatus.textContent = `${saved} capa(s) guardada(s) neste navegador.` +
          (failed ? ` ${failed} capa(s) dispon\u00edvel(is) apenas nesta sess\u00e3o.` : '') +
          (invalid ? ' Selecione apenas ficheiros de imagem.' : '');
      });
      window.addEventListener('beforeunload', () => workUrls.forEach(url => URL.revokeObjectURL(url)));


})();

;

    const menuToggle = document.querySelector('.menu-toggle');
    const siteHeader = document.querySelector('.site-header');
    const mobileMenu = window.matchMedia('(max-width: 900px)');

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

    document.querySelectorAll('.profile-accordion').forEach((accordion) => {
      accordion.addEventListener('toggle', () => {
        if (!accordion.open) return;
        document.querySelectorAll('.profile-accordion').forEach((otherAccordion) => {
          if (otherAccordion !== accordion) otherAccordion.open = false;
        });
      });
    });

    function loadStoredFacultyPhoto() {
      if (!('indexedDB' in window)) return;
      const request = window.indexedDB.open('acite-faculty-photos', 1);
      request.addEventListener('upgradeneeded', () => {
        if (!request.result.objectStoreNames.contains('photos')) {
          request.result.createObjectStore('photos', { keyPath: 'id' });
        }
      });
      request.addEventListener('success', () => {
        const database = request.result;
        const transaction = database.transaction('photos', 'readonly');
        const photoRequest = transaction.objectStore('photos').get('faculty-photo-1');
        photoRequest.addEventListener('success', () => {
          const photo = photoRequest.result;
          if (!photo || !(photo.blob instanceof Blob)) return;
          const image = document.createElement('img');
          image.src = URL.createObjectURL(photo.blob);
          image.alt = 'Fotografia do Prof. Doutor Raúl Araújo';
          document.querySelector('#profile-photo').replaceChildren(image);
        });
        photoRequest.addEventListener('error', () => console.error('Não foi possível carregar a fotografia do docente.', photoRequest.error));
        transaction.addEventListener('error', () => console.error('Não foi possível aceder às fotografias guardadas.', transaction.error));
      });
      request.addEventListener('error', () => console.error('Não foi possível abrir o armazenamento de fotografias.', request.error));
    }

    loadStoredFacultyPhoto();
