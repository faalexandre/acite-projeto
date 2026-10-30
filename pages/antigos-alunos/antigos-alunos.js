(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const track = document.querySelector('.testimonial-track');
  const slides = [...document.querySelectorAll('.testimonial-slide')];
  const currentLabel = document.querySelector('[data-current]');
  const progress = document.querySelector('[data-progress]');
  const previousButton = document.querySelector('[data-prev]');
  const nextButton = document.querySelector('[data-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let touchStartX = null;

  menuButton?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const courseFilter = document.querySelector('#course-filter');
  const galleryCount = document.querySelector('#gallery-count');
  const alumniCards = [...document.querySelectorAll('.alumni-card')];
  const courseNames = { mestrado: 'Mestrado', doutoramento: 'Doutoramento', especializacao: 'Especialização', linguas: 'Línguas' };
  alumniCards.forEach(card => {
    const course = document.createElement('span');
    course.className = 'alumni-course';
    course.textContent = courseNames[card.dataset.course] || 'Formação ACITE';
    card.querySelector('.alumni-card-copy').append(course);
  });
  courseFilter?.addEventListener('change', () => {
    const selectedCourse = courseFilter.value;
    let visibleCount = 0;
    alumniCards.forEach(card => {
      const visible = selectedCourse === 'all' || card.dataset.course === selectedCourse;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    galleryCount.innerHTML = `<b>${visibleCount}</b> ${visibleCount === 1 ? 'perfil' : 'perfis'}`;
  });

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    currentLabel.textContent = String(current + 1).padStart(2, '0');
    progress.style.transform = `translateX(${current * 100}%)`;
  }
  previousButton?.addEventListener('click', () => showSlide(current - 1));
  nextButton?.addEventListener('click', () => showSlide(current + 1));
  const windowEl = document.querySelector('.testimonial-window');
  windowEl?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showSlide(current - 1);
    if (event.key === 'ArrowRight') showSlide(current + 1);
  });
  windowEl?.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  windowEl?.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) showSlide(current + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }), { threshold: .15 });
    document.querySelectorAll('.intro, .testimonials-heading, .closing-copy, .closing-shape, .gallery-heading, .alumni-card').forEach(element => {
      element.setAttribute('data-reveal', '');
      if (element.classList.contains('alumni-card')) element.style.setProperty('--entry-index', String([...element.parentElement.children].indexOf(element)));
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.alumni-card').forEach(card => card.classList.add('is-visible'));
  }
  document.querySelectorAll('.alumni-photo img').forEach(image => {
    const photoCard = image.closest('.alumni-photo');
    const alumniCard = photoCard.closest('.alumni-card');
    const storageKey = `acite-former-student-photo-${alumniCard.dataset.photoId}`;
    const markLoaded = () => photoCard.classList.add('has-image');
    const savedPhoto = localStorage.getItem(storageKey);
    if (savedPhoto) {
      image.src = savedPhoto;
      image.addEventListener('load', markLoaded, { once: true });
    }
    if (image.complete && image.naturalWidth > 0) markLoaded();
    const picker = photoCard.querySelector('.alumni-photo-input');
    photoCard.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      picker.click();
    });
    picker.addEventListener('change', () => {
      const file = picker.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const source = new Image();
        source.addEventListener('load', () => {
          const maxSide = 1200;
          const scale = Math.min(1, maxSide / Math.max(source.naturalWidth, source.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(source.naturalWidth * scale);
          canvas.height = Math.round(source.naturalHeight * scale);
          canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
          const optimizedPhoto = canvas.toDataURL('image/jpeg', .78);
          try {
            localStorage.setItem(storageKey, optimizedPhoto);
            image.src = optimizedPhoto;
            markLoaded();
          } catch {
      photoCard.setAttribute('aria-label', 'Esta fotografia é demasiado grande para guardar. Escolha uma imagem mais pequena.');
          }
        }, { once: true });
        source.src = reader.result;
      }, { once: true });
      reader.readAsDataURL(file);
    });
  });
  document.querySelectorAll('.testimonial-photo').forEach((photoCard, index) => {
    const image = photoCard.querySelector('img');
    const picker = photoCard.querySelector('.testimonial-photo-input');
    const storageKey = `acite-testimonial-photo-${index + 1}`;
    const markLoaded = () => photoCard.classList.add('has-image');
    const savedPhoto = localStorage.getItem(storageKey);
    if (savedPhoto) {
      image.src = savedPhoto;
      image.addEventListener('load', markLoaded, { once: true });
    }
    photoCard.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      picker.click();
    });
    picker.addEventListener('change', () => {
      const file = picker.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const source = new Image();
        source.addEventListener('load', () => {
          const maxSide = 1200;
          const scale = Math.min(1, maxSide / Math.max(source.naturalWidth, source.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(source.naturalWidth * scale);
          canvas.height = Math.round(source.naturalHeight * scale);
          canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
          const optimizedPhoto = canvas.toDataURL('image/jpeg', .78);
          try {
            localStorage.setItem(storageKey, optimizedPhoto);
            image.src = optimizedPhoto;
            markLoaded();
          } catch {
            photoCard.setAttribute('aria-label', 'A fotografia é demasiado grande para guardar. Escolha uma imagem mais pequena.');
          }
        }, { once: true });
        source.src = reader.result;
      }, { once: true });
      reader.readAsDataURL(file);
    });
  });
  showSlide(0);
})();
