const menuToggle = document.querySelector('.menu-toggle');
    const siteHeader = document.querySelector('.header');
    const mobileMenu = window.matchMedia('(max-width: 768px)');

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
    const heroChoices = [...document.querySelectorAll('.hero-choice')];
    function closeHeroChoice(choice) {
      choice.classList.remove('is-open');
      choice.querySelector('button').setAttribute('aria-expanded', 'false');
    }
    heroChoices.forEach((choice) => {
      const button = choice.querySelector('button');
      button.addEventListener('click', () => {
        const isOpen = !choice.classList.contains('is-open');
        heroChoices.forEach(closeHeroChoice);
        choice.classList.toggle('is-open', isOpen);
        button.setAttribute('aria-expanded', String(isOpen));
      });
      choice.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeHeroChoice(choice));
      });
      choice.addEventListener('focusout', (event) => {
        if (!choice.contains(event.relatedTarget)) closeHeroChoice(choice);
      });
    });
    document.addEventListener('click', (event) => {
      heroChoices.forEach((choice) => {
        if (!choice.contains(event.target)) closeHeroChoice(choice);
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const openChoice = heroChoices.find((choice) => choice.classList.contains('is-open'));
      if (!openChoice) return;
      closeHeroChoice(openChoice);
      openChoice.querySelector('button').focus();
    });
    mobileMenu.addEventListener('change', (event) => {
      if (!event.matches) closeMobileMenu();
    });

    const newsTrack = document.querySelector('.news-track');
    const newsDots = [...document.querySelectorAll('[data-news-dot]')];
    const newsCards = [...newsTrack.querySelectorAll('.news-card')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let transitioning = false;

    function updateNewsPagination() {
      const firstNewsIndex = Number(newsTrack.firstElementChild.dataset.newsIndex);
      newsDots.forEach((dot, index) => {
        dot.setAttribute('aria-current', String(index === firstNewsIndex));
      });
    }

    function moveNews(direction) {
      if (transitioning) return;
      transitioning = true;
      const firstCard = newsTrack.firstElementChild;
      const cardWidth = firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(newsTrack).gap);
      const finishTransition = () => {
        newsTrack.removeEventListener('transitionend', finishTransition);
        if (direction > 0) {
          newsTrack.append(firstCard);
        } else {
          newsTrack.prepend(newsTrack.lastElementChild);
        }
        newsTrack.style.transition = 'none';
        newsTrack.style.transform = 'translateX(0)';
        void newsTrack.offsetWidth;
        newsTrack.style.transition = '';
        transitioning = false;
        updateNewsPagination();
      };

      if (direction < 0) {
        newsTrack.prepend(newsTrack.lastElementChild);
        newsTrack.style.transition = 'none';
        newsTrack.style.transform = `translateX(-${cardWidth}px)`;
        void newsTrack.offsetWidth;
        newsTrack.style.transition = '';
      }
      newsTrack.addEventListener('transitionend', finishTransition);
      newsTrack.style.transform = `translateX(${direction > 0 ? -cardWidth : 0}px)`;
      if (reducedMotion.matches) finishTransition();
      updateNewsPagination();
    }

    document.querySelector('[data-news-previous]').addEventListener('click', () => moveNews(-1));
    document.querySelector('[data-news-next]').addEventListener('click', () => moveNews(1));
    newsDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = Number(dot.dataset.newsDot);
        const activeIndex = Number(newsTrack.firstElementChild.dataset.newsIndex);
        if (targetIndex === activeIndex) return;
        moveNews((targetIndex - activeIndex + newsCards.length) % newsCards.length === 1 ? 1 : -1);
      });
    });

    const storedPhotoInputs = [...document.querySelectorAll('.stored-photo-input')];
    const storedPhotoUrls = new Map();
    const storedPhotoDatabase = new Promise((resolve, reject) => {
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

    function setStoredPhotoStatus(input, message, state = '') {
      const status = input.closest('[data-photo-card], .news-card').querySelector('.stored-photo-status');
      const label = input.closest('.stored-photo-visual').querySelector('.stored-photo-action');
      status.textContent = message;
      status.dataset.state = state;
      label.textContent = input.classList.contains('publication-photo-input') ? 'Adicionar capa' : 'Adicionar foto';
      label.hidden = state === 'success';
    }

    function displayStoredPhoto(input, blob) {
      const visual = input.closest('.stored-photo-visual');
      const previousUrl = storedPhotoUrls.get(input);
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      const imageUrl = URL.createObjectURL(blob);
      storedPhotoUrls.set(input, imageUrl);
      let image = visual.querySelector('img');
      if (!image) {
        image = document.createElement('img');
        visual.prepend(image);
      }
      image.src = imageUrl;
      visual.classList.add('has-photo');
      image.alt = input.classList.contains('publication-photo-input')
        ? input.closest('article').querySelector('h3').textContent
        : '';
      if (image.alt) image.removeAttribute('aria-hidden');
      else image.setAttribute('aria-hidden', 'true');
      visual.tabIndex = 0;
      visual.setAttribute('role', 'button');
      visual.setAttribute('aria-label', `Selecionar outra ${input.classList.contains('publication-photo-input') ? 'capa' : 'foto'}`);
    }

    storedPhotoInputs.forEach((input) => {
      const visual = input.closest('.stored-photo-visual');
      visual.addEventListener('click', (event) => {
        if (!visual.classList.contains('has-photo') || event.target === input || event.target.closest('.publication-author-link')) return;
        input.click();
      });
      visual.addEventListener('keydown', (event) => {
        if (!visual.classList.contains('has-photo') || event.target.closest('.publication-author-link') || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        input.click();
      });
      input.addEventListener('change', async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          input.value = '';
          setStoredPhotoStatus(input, 'Selecione um ficheiro de imagem.', 'error');
          return;
        }

        setStoredPhotoStatus(input, 'A guardar imagem…');
        try {
          const database = await storedPhotoDatabase;
          await new Promise((resolve, reject) => {
            const transaction = database.transaction('photos', 'readwrite');
            transaction.objectStore('photos').put({
              id: input.dataset.photoId,
              blob: file,
              name: file.name,
              type: file.type,
              updatedAt: new Date().toISOString()
            });
            transaction.addEventListener('complete', resolve, { once: true });
            transaction.addEventListener('error', () => reject(transaction.error || new Error('Não foi possível guardar a imagem.')), { once: true });
            transaction.addEventListener('abort', () => reject(transaction.error || new Error('O armazenamento da imagem foi cancelado.')), { once: true });
          });
          displayStoredPhoto(input, file);
          setStoredPhotoStatus(input, 'Imagem guardada neste navegador.', 'success');
        } catch (error) {
          console.error('Não foi possível guardar a imagem.', error);
          setStoredPhotoStatus(input, `Não foi possível guardar a imagem: ${error.message}`, 'error');
        }
      });
    });

    storedPhotoDatabase
      .then((database) => new Promise((resolve, reject) => {
        const transaction = database.transaction('photos', 'readonly');
        const request = transaction.objectStore('photos').getAll();
        let photos;
        request.addEventListener('success', () => { photos = request.result; });
        request.addEventListener('error', () => reject(request.error || new Error('Não foi possível ler as imagens guardadas.')));
        transaction.addEventListener('complete', () => resolve(photos));
        transaction.addEventListener('error', () => reject(transaction.error || new Error('Erro ao ler as imagens guardadas.')));
      }))
      .then((photos) => {
        photos.forEach((photo) => {
          const input = storedPhotoInputs.find((candidate) => candidate.dataset.photoId === photo.id);
          if (!input || !(photo.blob instanceof Blob)) return;
          displayStoredPhoto(input, photo.blob);
          setStoredPhotoStatus(input, 'Imagem guardada neste navegador.', 'success');
        });
      })
      .catch((error) => {
        console.error('Não foi possível carregar as imagens guardadas.', error);
        storedPhotoInputs.forEach((input) => {
          setStoredPhotoStatus(input, `Armazenamento indisponível: ${error.message}`, 'error');
        });
      });
