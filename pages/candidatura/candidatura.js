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

    const courseSelect = document.querySelector('#course');
    const specialtySelect = document.querySelector('#specialty');
    const specialtiesByCourse = {
      doutoramentos: [
        ['direito-seguranca', 'Doutoramento em Direito e Segurança'],
        ['estudos-estrategicos-seguranca', 'Doutoramento em Estudos Estratégicos e de Segurança'],
      ],
      mestrados: [
        ['economia-financas-internacionais', 'Economia e finanças internacionais'],
        ['globalizacao-seguranca', 'Globalização e segurança'],
        ['direito-seguranca-inteligencia', 'Direito, Segurança e Inteligência'],
        ['engenharia-seguranca-redes', 'Engenharia e Segurança de Redes de Comunicações'],
      ],
      especializacoes: [
        ['ciberseguranca-gestao-informacao', 'Cibersegurança e gestão de segurança da informação'],
        ['administracao-gestao-financeira-publica', 'Administração e gestão financeira pública'],
        ['intelligence-estudos-seguranca', 'Intelligence e estudos de segurança'],
        ['inteligencia-economica-financeira', 'Inteligência económica e financeira'],
        ['comunicacao-estrategica-digital', 'Comunicação estratégica e digital'],
        ['ciberespaco-estado', 'Ciberespaço e Estado'],
      ],
      linguas: [
        ['lingala', 'Lingala'],
        ['swahili', 'Swahili'],
        ['frances', 'Francês'],
        ['ingles', 'Inglês'],
        ['portugues', 'Português'],
      ],
    };

    function updateSpecialties() {
      const options = specialtiesByCourse[courseSelect.value] || [];
      specialtySelect.replaceChildren(new Option(
        options.length ? 'Selecione uma especialidade' : 'Selecione primeiro o curso',
        '',
      ));
      options.forEach(([value, label]) => specialtySelect.add(new Option(label, value)));
      specialtySelect.disabled = options.length === 0;
    }

    courseSelect.addEventListener('change', updateSpecialties);
    const requestedCourse = new URLSearchParams(window.location.search).get('curso');
    if (requestedCourse && [...courseSelect.options].some((option) => option.value === requestedCourse)) {
      courseSelect.value = requestedCourse;
    }
    updateSpecialties();

    const acceptedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
    const acceptedExtensions = /\.(pdf|jpe?g|png)$/i;
    const maxFileSize = 10 * 1024 * 1024;
    document.querySelectorAll('[data-file-input]').forEach((input) => {
      input.addEventListener('change', () => {
        const status = input.closest('.upload-card').querySelector('.file-status');
        const files = [...input.files];
        const invalidFile = files.find((file) => (
          file.size > maxFileSize
          || (file.type ? !acceptedTypes.has(file.type) : !acceptedExtensions.test(file.name))
        ));

        if (invalidFile) {
          input.value = '';
          status.textContent = invalidFile.size > maxFileSize
            ? `${invalidFile.name}: ultrapassa o limite de 10 MB.`
            : `${invalidFile.name}: formato não aceite.`;
          status.classList.add('form-status--error');
          return;
        }

        status.classList.remove('form-status--error');
        status.textContent = files.length
          ? files.map((file) => `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`).join(', ')
          : 'Nenhum ficheiro selecionado.';
      });
    });

    const applicationForm = document.querySelector('#application-form');
    const formStatus = document.querySelector('#form-status');
    applicationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      formStatus.className = 'form-status';

      if (!applicationForm.reportValidity()) return;

      formStatus.classList.add('form-status--notice');
      formStatus.textContent = 'Os campos obrigatórios foram validados neste navegador, mas a candidatura não foi enviada nem guardada. O envio ficará disponível quando a ACITE configurar um serviço seguro para receber dados e documentos.';
    });
