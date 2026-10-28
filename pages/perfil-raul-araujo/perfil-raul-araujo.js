

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
