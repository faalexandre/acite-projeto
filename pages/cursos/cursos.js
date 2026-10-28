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
