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

    document.querySelectorAll('.faculty-accordion').forEach((accordion) => {
      accordion.addEventListener('toggle', () => {
        if (!accordion.open) return;
        document.querySelectorAll('.faculty-accordion').forEach((otherAccordion) => {
          if (otherAccordion !== accordion) otherAccordion.open = false;
        });
      });
    });

    const facultyPhotoInputs = [...document.querySelectorAll('.faculty-photo-input')];
    const facultyPhotoObjectUrls = new Map();
    const facultyPhotoStatuses = new Map();
    document.querySelectorAll('.faculty-entry').forEach((entry) => {
      if (entry.querySelector('.faculty-profile-link')) return;
      const photoInput = entry.querySelector('.faculty-photo-input');
      const profileLink = document.createElement('a');
      profileLink.className = 'faculty-profile-link';
      profileLink.href = `../perfil-docente/index.html?id=${encodeURIComponent(photoInput.id)}`;
      profileLink.append(document.createTextNode('Ver perfil completo'));
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-arrow-right';
      icon.setAttribute('aria-hidden', 'true');
      profileLink.append(icon);
      entry.querySelector('.faculty-content').append(profileLink);
    });
    const facultyPhotoDatabase = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('Este navegador não disponibiliza armazenamento IndexedDB.'));
        return;
      }
      const request = window.indexedDB.open('acite-faculty-photos', 1);
      request.addEventListener('upgradeneeded', () => {
        if (!request.result.objectStoreNames.contains('photos')) {
          request.result.createObjectStore('photos', { keyPath: 'id' });
        }
      });
      request.addEventListener('success', () => resolve(request.result));
      request.addEventListener('error', () => reject(request.error || new Error('Não foi possível abrir o armazenamento de fotografias.')));
      request.addEventListener('blocked', () => reject(new Error('O armazenamento está bloqueado por outra página ACITE aberta. Feche-a e tente novamente.')));
    });

    function setPhotoStatus(input, message, state = '') {
      const status = facultyPhotoStatuses.get(input);
      status.textContent = message;
      const uploadLabel = input.closest('.faculty-photo-area').querySelector('label');
      status.hidden = state === 'success';
      uploadLabel.hidden = state === 'success';
      if (state) status.dataset.state = state;
      else delete status.dataset.state;
    }

    function showFacultyPhoto(input, blob) {
      const placeholder = input.closest('.faculty-photo-area').querySelector('.faculty-photo-placeholder');
      const oldObjectUrl = facultyPhotoObjectUrls.get(input);
      if (oldObjectUrl) URL.revokeObjectURL(oldObjectUrl);
      const objectUrl = URL.createObjectURL(blob);
      facultyPhotoObjectUrls.set(input, objectUrl);
      const image = document.createElement('img');
      image.src = objectUrl;
      image.alt = `Foto de ${input.getAttribute('aria-label').replace('Selecionar foto de ', '')}`;
      placeholder.setAttribute('role', 'button');
      placeholder.setAttribute('tabindex', '0');
      placeholder.setAttribute('aria-label', `Alterar foto de ${image.alt.replace('Foto de ', '')}`);
      placeholder.replaceChildren(image);
    }

    function readFacultyPhotos(database) {
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('photos', 'readonly');
        const request = transaction.objectStore('photos').getAll();
        let photos = [];
        request.addEventListener('success', () => { photos = request.result; });
        request.addEventListener('error', () => reject(request.error || new Error('Não foi possível ler as fotografias guardadas.')));
        transaction.addEventListener('complete', () => resolve(photos));
        transaction.addEventListener('error', () => reject(transaction.error || new Error('Erro ao ler as fotografias guardadas.')));
        transaction.addEventListener('abort', () => reject(transaction.error || new Error('A leitura das fotografias foi cancelada.')));
      });
    }

    function saveFacultyPhoto(database, input, file) {
      return new Promise((resolve, reject) => {
        const transaction = database.transaction('photos', 'readwrite');
        transaction.objectStore('photos').put({
          id: input.id,
          blob: file,
          name: file.name,
          type: file.type,
          updatedAt: new Date().toISOString()
        });
        transaction.addEventListener('complete', resolve, { once: true });
        transaction.addEventListener('error', () => reject(transaction.error || new Error('Não foi possível guardar a fotografia.')), { once: true });
        transaction.addEventListener('abort', () => reject(transaction.error || new Error('O armazenamento da fotografia foi cancelado.')), { once: true });
      });
    }

    facultyPhotoInputs.forEach((input) => {
      const status = document.createElement('p');
      status.className = 'faculty-photo-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      input.closest('.faculty-photo-area').append(status);
      facultyPhotoStatuses.set(input, status);
      const placeholder = input.closest('.faculty-photo-area').querySelector('.faculty-photo-placeholder');
      placeholder.addEventListener('click', () => input.click());
      placeholder.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          input.click();
        }
      });

      input.addEventListener('change', async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          input.value = '';
          setPhotoStatus(input, 'Selecione um ficheiro de imagem.', 'error');
          return;
        }

        setPhotoStatus(input, 'A guardar fotografia…');
        try {
          const database = await facultyPhotoDatabase;
          await saveFacultyPhoto(database, input, file);
          showFacultyPhoto(input, file);
          setPhotoStatus(input, 'Fotografia guardada neste navegador.', 'success');
        } catch (error) {
          console.error('Não foi possível guardar a fotografia do docente.', error);
          setPhotoStatus(input, `Não foi possível guardar a fotografia: ${error.message}`, 'error');
        }
      });
    });

    facultyPhotoDatabase
      .then(readFacultyPhotos)
      .then((photos) => {
        photos.forEach((photo) => {
          const input = facultyPhotoInputs.find((candidate) => candidate.id === photo.id);
          if (!input || !(photo.blob instanceof Blob)) return;
          showFacultyPhoto(input, photo.blob);
          setPhotoStatus(input, 'Fotografia guardada neste navegador.', 'success');
        });
      })
      .catch((error) => {
        console.error('Não foi possível carregar as fotografias dos docentes.', error);
        facultyPhotoInputs.forEach((input) => {
          setPhotoStatus(input, `Armazenamento indisponível: ${error.message}`, 'error');
        });
      });
