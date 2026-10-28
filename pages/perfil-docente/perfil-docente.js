const faculty = {
      'faculty-photo-2': 'Prof.ª Doutora Luzia Sebastião',
      'faculty-photo-3': 'Prof. Doutor Carlos Feijó',
      'faculty-photo-4': 'Prof. Doutor Boaventura de Sousa Santos',
      'faculty-photo-5': 'Prof. Doutor André Luís de Matos Gonçalves',
      'faculty-photo-6': 'Prof. Doutor José Fontes',
      'faculty-photo-7': 'Prof. Doutor Luís Tomé',
      'faculty-photo-8': 'Prof. Doutor José Octávio S. Van-Dúnem',
      'faculty-photo-9': 'Prof. Doutor Manuel Meirinho',
      'faculty-photo-10': 'Prof. Doutor Ricardo Ramos Pinto',
      'faculty-photo-11': 'Prof. Doutor Francisco Proença Garcia',
      'faculty-photo-12': 'Prof.ª Doutora Carla Costa Guapo',
      'faculty-photo-13': 'Prof.ª Doutora Teresa Almeida e Silva',
      'faculty-photo-14': 'Prof. Doutor Pedro Dozi',
      'faculty-photo-15': 'Prof. Doutor Samuel Victorino',
      'faculty-photo-16': 'Prof. Doutor Miguel Bembe'
    };
    const photoId = new URLSearchParams(window.location.search).get('id');
    const facultyName = faculty[photoId];
    if (!facultyName) {
      window.location.replace('../organigrama/index.html');
    } else {
      document.title = `${facultyName} — ACITE`;
      document.querySelector('#profile-name').textContent = facultyName;
      document.querySelector('#breadcrumb-name').textContent = facultyName;
      document.querySelector('#profile-photo').setAttribute('aria-label', `Modificar fotografia de ${facultyName}`);
      const requestSubject = `Pedido de orientação de trabalho - ${facultyName}`;
      const requestBody = `Exmos. Senhores,%0D%0A%0D%0AGostaria de solicitar orientação para o meu trabalho.%0D%0A%0D%0ATema/título provisório:%0D%0ACurso:%0D%0AInstituição:%0D%0A%0D%0ANome:%0D%0AContacto:%0D%0A%0D%0ACom os melhores cumprimentos,`;
      document.querySelector('#orientation-request').href =
        `mailto:s.academia@acite.ao?subject=${encodeURIComponent(requestSubject)}&body=${requestBody}`;

      const luziaProfile = {
        role: 'Professora Catedrática · Direito Penal e Ciências Jurídico-Criminais',
        biography: 'A Professora Doutora Luzia Bebiana de Almeida Sebastião é uma jurista, académica, advogada e magistrada angolana. O seu percurso é marcado pelo contributo para o desenvolvimento do Direito, a formação de juristas e a consolidação do Estado Democrático de Direito em Angola.',
        education: [
          'Licenciatura em Direito pela Faculdade de Direito da Universidade Agostinho Neto.',
          'Doutoramento em Direito pela Universidade de Coimbra, Portugal.',
          'Formação especializada em Direitos Humanos, Direito Penal e outras áreas das Ciências Jurídicas.'
        ],
        career: [
          'Professora Catedrática da Faculdade de Direito da Universidade Agostinho Neto, onde desenvolveu uma extensa carreira docente e científica, com particular incidência no ensino do Direito Penal e das Ciências Jurídico-Criminais.',
          'Exerceu advocacia entre 1991 e 2008 e desempenhou funções na Ordem dos Advogados de Angola.',
          'Foi Juíza Conselheira do Tribunal Constitucional de Angola entre 2008 e 2017; encontra-se actualmente jubilada.',
          'Exerceu funções no Instituto Nacional de Estudos Judiciários (INEJ), contribuindo para a formação e capacitação dos profissionais da justiça.'
        ],
        research: [
          'Direito Penal e Ciências Jurídico-Criminais.',
          'Direito Constitucional e direitos fundamentais.',
          'Pluralismo jurídico e relação entre o Direito formal e o Direito costumeiro angolano.'
        ],
        publications: [
          {
            title: 'Sistema Legal e Direito Tradicional (2023)',
            description: 'Artigo publicado na primeira edição da revista científica A Guardiã, do Tribunal Constitucional de Angola (pp. 237 e seguintes), sobre a relação entre o sistema jurídico formal e as normas tradicionais angolanas.'
          },
          {
            title: 'Direito Penal e Direito Costumeiro em Angola',
            description: 'Estudo publicado na Revista do Direito Público Militar, dedicado à relação entre o Direito Penal e as práticas jurídicas costumeiras em Angola.'
          },
          {
            title: 'Contribuição científica para a terceira edição da revista A Guardiã (2025)',
            description: 'Participação como autora na revista científica do Tribunal Constitucional de Angola, dedicada a matérias jurídico-constitucionais.'
          },
          {
            title: 'O Direito Formal e o Direito Costumeiro à Luz da Constituição: Que Desafios?',
            description: 'Comunicação académica apresentada numa conferência organizada pelo Centro de Estudos de Direito Público e Ciências Jurídico-Públicas da Universidade Agostinho Neto, sobre o pluralismo jurídico angolano.'
          }
        ],
        contribution: 'A Professora Doutora Luzia Sebastião integra o conjunto de juristas que contribuíram significativamente para a evolução do pensamento jurídico angolano, particularmente nas Ciências Jurídico-Criminais e na articulação entre o Direito positivo e as tradições jurídicas nacionais. A sua trajectória liga investigação académica, magistratura constitucional, formação de profissionais do Direito e reflexão sobre uma justiça adaptada à realidade social e cultural angolana. A experiência como docente universitária e magistrada constitucional constitui um contributo importante para a formação de novas gerações de juristas e para o fortalecimento das instituições jurídicas de Angola.',
        publicationNote: 'A sua produção científica inclui ainda textos de apoio ao ensino, artigos e comunicações sobre Direito Penal, justiça constitucional, direitos humanos e pluralismo jurídico. A relação acima não constitui uma bibliografia completa.'
      };

      const carlosProfile = {
        role: 'Professor Catedrático · Direito Público, Constitucional e Administrativo',
        biography: 'O Professor Doutor Carlos Maria da Silva Feijó é um jurista, advogado, académico e consultor angolano, reconhecido pelo seu contributo para o desenvolvimento do Direito Público, do Direito Constitucional e do Direito Administrativo, bem como para a modernização das instituições do Estado angolano.',
        education: [
          'Licenciatura em Direito pela Universidade Agostinho Neto (1987).',
          'Mestrado em Direito (2000), com dissertação dedicada às autarquias locais em Angola.',
          'Doutoramento em Direito Público pela Faculdade de Direito da Universidade NOVA de Lisboa (2011), com Distinção e Louvor. A tese versou sobre o poder tradicional enquanto manifestação do poder local em Angola.',
          'Em 2012, alcançou o grau de Professor Titular da Faculdade de Direito da Universidade Agostinho Neto.',
          'Investigação na Universidade de Witwatersrand, na África do Sul; formação avançada em parcerias público-privadas, financiamento de projectos e regulação na Universidade de Harvard; especialização em contratos internacionais.'
        ],
        career: [
          'Professor Catedrático da Faculdade de Direito da Universidade Agostinho Neto e Professor Convidado da NOVA School of Law, com actividades de ensino, investigação e orientação académica.',
          'Exerceu funções de Vice-Ministro para a Administração Pública, Secretário de Estado da Presidência do Conselho de Ministros, Assessor do Presidente da República e Ministro de Estado e Chefe da Casa Civil do Presidente da República de Angola.',
          'Participou em processos de reforma legislativa e constitucional, incluindo matérias de organização administrativa do Estado, poder local, ordenamento do território e investimento privado.',
          'Advogado e fundador da CFA — Firma de Advogados. Desenvolveu actividade de advocacia e consultoria jurídica nos domínios do investimento, infra-estruturas, energia, contratação pública, arbitragem e governação corporativa.'
        ],
        research: [
          'Direito Público e Direito Administrativo.',
          'Direito Constitucional, governação e organização do Estado.',
          'Poder local, autarquias e autoridades tradicionais.',
          'Pluralismo jurídico e modernização das instituições públicas.'
        ],
        publications: [
          { title: 'Problemas Actuais de Direito Público Angolano: Contributos para a sua Compreensão (2001)', description: 'Principia, Lisboa. Análise de questões fundamentais do Direito Público angolano.' },
          { title: 'A Produção de Informações de Segurança no Estado Democrático de Direito (2002)', description: 'Principia, Lisboa. Estudo sobre os serviços de informações e a sua relação com os princípios do Estado de Direito.' },
          { title: 'Pluralismo e Legitimação: A Edificação Jurídica Pós-Colonial (2003)', description: 'Almedina, Coimbra. Reflexão sobre a construção dos sistemas jurídicos e a legitimidade institucional no contexto pós-colonial.' },
          { title: 'Novo Direito da Economia de Angola: Legislação Básica (2004)', description: 'Almedina, Coimbra. Enquadramento jurídico da actividade económica angolana.' },
          { title: 'A Justiça Administrativa em Angola (2008)', description: 'Estudo sobre os mecanismos de controlo jurisdicional da Administração Pública.' },
          { title: 'A Regulação do Gás Natural em Angola (2009)', description: 'Almedina, em coautoria com N’Gunu Tiny. Aborda o enquadramento jurídico e regulatório do sector do gás natural.' },
          { title: 'A Coexistência Normativa entre o Estado e as Autoridades Tradicionais na Ordem Jurídica Plural Angolana (2012)', description: 'Almedina. Obra resultante da investigação doutoral, dedicada ao pluralismo jurídico, ao poder tradicional e à organização do poder local.' },
          { title: 'Constituição da República de Angola: Enquadramento Histórico e Trabalhos Preparatórios (2015)', description: 'Almedina, sob a sua coordenação. Estudo do processo histórico e dos trabalhos preparatórios da Constituição angolana.' },
          { title: 'Constituição da República de Angola: Enquadramento Dogmático — A Nossa Visão (2015)', description: 'Almedina, sob a sua coordenação. Análise doutrinária das principais matérias constitucionais angolanas.' },
          { title: 'Manual de Direito Administrativo Angolano (2016)', description: 'Almedina, em coautoria com Diogo Freitas do Amaral. Obra de referência para o estudo do Direito Administrativo em Angola.' },
          { title: 'O Tribunal da SADC: Subsídios para a Compreensão da sua Natureza e Competências (2016)', description: 'Capítulo publicado em Liber Amicorum Fausto de Quadros, Almedina.' },
          { title: 'Estudos e Pareceres sobre Contratação Pública (2022)', description: 'Publicação dedicada a matérias jurídicas relacionadas com a contratação pública.' }
        ],
        contribution: 'O Professor Doutor Carlos Feijó tem desempenhado um papel relevante na evolução do pensamento jurídico angolano, especialmente no desenvolvimento da doutrina do Direito Administrativo, do constitucionalismo, do poder local e do pluralismo jurídico. A sua trajectória articula investigação científica, advocacia, docência universitária e participação em processos de transformação institucional e legislativa do Estado angolano. O seu percurso constitui um contributo significativo para a formação de juristas, o aperfeiçoamento da Administração Pública e a consolidação do Estado Democrático de Direito em Angola.',
        publicationNote: 'As obras de 2012, 2015 e 2016 encontram-se documentadas em catálogos académicos e editoriais, incluindo o portal de investigação da Universidade NOVA de Lisboa.'
      };

      const boaventuraProfile = {
        role: 'Sociólogo, jurista e investigador · Sociologia do Direito e Epistemologias do Sul',
        biography: 'O Professor Doutor Boaventura de Sousa Santos é um sociólogo, jurista, investigador e académico português, internacionalmente reconhecido pelos seus contributos para a Sociologia do Direito, a Teoria Social Crítica, a Sociologia Política, os Direitos Humanos, a Democracia Participativa e os Estudos Pós-Coloniais. Nasceu em Coimbra, Portugal, a 15 de novembro de 1940.',
        education: [
          'Doutoramento em Sociologia do Direito pela Universidade de Yale, nos Estados Unidos da América (1973).',
          'Doutor Honoris Causa pela Universidade McGill, no Canadá.'
        ],
        career: [
          'Professor Catedrático Jubilado da Faculdade de Economia da Universidade de Coimbra.',
          'Foi Distinguished Legal Scholar da Universidade de Wisconsin-Madison, nos Estados Unidos.',
          'Figura central no desenvolvimento do Centro de Estudos Sociais (CES) da Universidade de Coimbra, onde exerceu funções de direcção e coordenou projectos de investigação científica.',
          'Coordenou o projecto internacional ALICE — Espelhos Estranhos, Lições Imprevistas, financiado pelo Conselho Europeu de Investigação (ERC), dedicado à valorização de conhecimentos e experiências sociais produzidos em diferentes regiões do mundo.'
        ],
        research: [
          'Sociologia do Direito, pluralismo jurídico e sistemas de justiça.',
          'Teoria Social Crítica, Sociologia Política e Estudos Pós-Coloniais.',
          'Globalização, desigualdades sociais, movimentos sociais e emancipação social.',
          'Direitos Humanos, democracia participativa e acesso à justiça.',
          'Epistemologias do Sul e valorização de conhecimentos historicamente marginalizados.'
        ],
        publications: [
          { title: 'Um Discurso sobre as Ciências (1987)', description: 'Reflexão crítica sobre os paradigmas científicos e a transformação do conhecimento contemporâneo.' },
          { title: 'Pela Mão de Alice: O Social e o Político na Pós-Modernidade (1994)', description: 'Análise das transformações sociais, políticas e culturais da contemporaneidade.' },
          { title: 'A Crítica da Razão Indolente: Contra o Desperdício da Experiência (2000)', description: 'Estudo sobre a necessidade de reconhecer outras formas de conhecimento e experiência social.' },
          { title: 'Democratizar a Democracia: Os Caminhos da Democracia Participativa (2002)', description: 'Obra organizada pelo autor, dedicada às experiências de participação democrática e cidadania.' },
          { title: 'Conhecimento Prudente para uma Vida Decente: Um Discurso sobre as Ciências Revisitado (2003)', description: 'Obra organizada pelo autor sobre os desafios epistemológicos das ciências contemporâneas.' },
          { title: 'A Gramática do Tempo: Para uma Nova Cultura Política (2006)', description: 'Reflexão sobre a diversidade cultural, a transformação política e a emancipação social.' },
          { title: 'Para uma Revolução Democrática da Justiça (2007)', description: 'Análise dos desafios de democratização do sistema judicial e do acesso à justiça.' },
          { title: 'As Epistemologias do Sul (2009)', description: 'Obra organizada em colaboração com Maria Paula Meneses, dedicada à valorização dos conhecimentos produzidos em contextos historicamente marginalizados.' },
          { title: 'Sociedade e Estado em Construção: Desafios do Direito e da Democracia em Angola (2012)', description: 'Obra organizada em colaboração com José Octávio Serra Van-Dúnem, sobre desafios jurídicos, políticos e institucionais de Angola.' },
          { title: 'O Direito dos Oprimidos (2014)', description: 'Investigação sobre pluralismo jurídico, práticas sociais e formas de regulação jurídica em comunidades marginalizadas.' },
          { title: 'Se Deus Fosse um Activista dos Direitos Humanos (2013)', description: 'Reflexão sobre os direitos humanos, a religião e a justiça social.' },
          { title: 'O Fim do Império Cognitivo: A Afirmação das Epistemologias do Sul (2018/2019)', description: 'Desenvolvimento da proposta teórica de justiça cognitiva e descolonização do conhecimento.' },
          { title: 'O Futuro Começa Agora: Da Pandemia à Utopia (2020)', description: 'Análise crítica das consequências sociais, económicas e políticas da pandemia.' },
          { title: 'O Fim da Europa como a Conhecemos (2024)', description: 'Reflexão sobre os desafios políticos e sociais contemporâneos da Europa.' },
          { title: 'Direito e Epistemologias do Sul (2025)', description: 'Obra dedicada à articulação entre o pensamento jurídico e as Epistemologias do Sul.' }
        ],
        contribution: 'O Professor Doutor Boaventura de Sousa Santos ocupa um lugar de destaque no debate internacional sobre o pensamento jurídico, a justiça social e a democratização do conhecimento. O seu trabalho contribuiu para novas abordagens ao pluralismo jurídico, ao acesso à justiça, ao constitucionalismo transformador, aos direitos humanos e às relações entre o Estado e a sociedade. No contexto africano e nos PALOP, desenvolveu investigações sobre pluralismo jurídico, sistemas de justiça, organização do Estado e desafios da democracia, com especial atenção a Angola e Moçambique. A sua obra é uma referência para investigadores e estudantes das Ciências Sociais, do Direito, da Ciência Política e das Relações Internacionais.',
        publicationNote: 'A produção científica do autor possui ampla circulação internacional, com obras publicadas e traduzidas em português, inglês, francês, espanhol, italiano, alemão e chinês. As referências bibliográficas encontram-se disponíveis no catálogo de publicações do autor.'
      };

      const andreProfile = {
        role: 'Jurista e académico · Direito Público e Controlo Externo das Finanças Públicas',
        biography: 'O Professor Doutor André Luís de Matos Gonçalves é um jurista, académico e especialista brasileiro em Direito Público, Administração Pública, Gestão de Políticas Públicas e Controlo Externo das Finanças Públicas.',
        education: [
          'Doutoramento em Direito pelo Centro Universitário de Brasília (UniCEUB).',
          'Pós-doutoramento em Gestão de Políticas Públicas pela Universidade de São Paulo (USP).',
          'Pós-doutoramento em Sociedade, Políticas Públicas e Desenvolvimento Regional pela Universidade Federal do Tocantins (UFT).',
          'Mestrado pela UFT, em parceria com instituições de formação da magistratura brasileira.'
        ],
        career: [
          'Professor da Universidade Estadual do Tocantins (Unitins) e Conselheiro do Tribunal de Contas do Estado do Tocantins, no Brasil, com funções ligadas à fiscalização da Administração Pública, ao controlo da legalidade financeira e à avaliação das políticas públicas.',
          'Exerceu funções de Procurador-Geral do Estado do Tocantins, Reitor da Universidade Estadual do Tocantins e Corregedor do Tribunal de Contas do Estado do Tocantins.',
          'Participou nas Jornadas Científicas do Tribunal de Contas de Angola, em abril de 2026, no âmbito da cooperação académica e institucional entre Brasil e Angola.'
        ],
        research: [
          'Responsabilidade fiscal e protecção dos recursos públicos.',
          'Governação pública, transparência administrativa e controlo externo.',
          'Fiscalização das finanças do Estado e avaliação das políticas públicas.',
          'Aperfeiçoamento dos mecanismos institucionais de controlo.'
        ],
        publications: [
          {
            title: 'A LRF e a Necessidade de Proteção ao Erário: Uma Proposta de Acoplamento Interinstitucional e Aplicação dos Fundamentos da Hermenêutica Concretizadora',
            description: 'Capítulo publicado na obra colectiva Responsabilidade na Gestão Fiscal, em coautoria com Júlio Edstron S. Santos. Analisa a Lei de Responsabilidade Fiscal brasileira e a articulação entre instituições de controlo para a protecção dos recursos públicos.'
          },
          {
            title: 'Estudos sobre a Prescrição nos Processos de Tomada de Contas Especial',
            description: 'Produção jurídica referenciada em investigação publicada na Revista Digital de Ciências Jurídicas, volume 5 (2023), sobre prazos de prescrição, responsabilização financeira e recuperação de danos ao erário. A fonte consultada não permite confirmar o título bibliográfico exacto do trabalho original.'
          },
          {
            title: 'Controlo Superior e Qualidade da Actividade Financeira do Estado (2026)',
            description: 'Comunicação científica apresentada nas Jornadas Científicas do Tribunal de Contas de Angola, sobre fiscalização financeira, legalidade, eficiência administrativa e avaliação das políticas públicas. Trata-se de uma intervenção académica, não de um livro publicado.'
          },
          {
            title: 'O Papel dos Tribunais de Contas na Avaliação das Políticas Públicas (2026)',
            description: 'Intervenção nas Jornadas Científicas do Tribunal de Contas de Angola sobre o papel das instituições superiores de controlo na boa governação, transparência e melhoria da Administração Pública.'
          }
        ],
        contribution: 'O Professor Doutor André Luís de Matos Gonçalves articula investigação científica, docência universitária e funções de elevada responsabilidade na Administração Pública e na fiscalização financeira do Estado. O seu trabalho contribui para o aprofundamento dos estudos sobre responsabilidade fiscal, transparência na gestão dos recursos públicos, avaliação das políticas públicas e fortalecimento das instituições de controlo. A sua participação em iniciativas de cooperação entre o Brasil e Angola promove a partilha de experiências no domínio da governação, fiscalização financeira e modernização da Administração Pública.',
        publicationNote: 'A bibliografia acima é selectiva. Não foi possível confirmar, nas fontes consultadas, uma lista completa de livros de autoria individual do Professor Doutor André Luís de Matos Gonçalves.'
      };

      function renderProfile(profile) {
        document.querySelector('#profile-role').textContent = profile.role;
        document.querySelector('#profile-note').hidden = true;
        document.querySelector('#profile-biography').textContent = profile.biography;
        document.querySelector('#profile-career').replaceChildren();
        document.querySelector('#profile-research').replaceChildren();
        document.querySelector('#profile-education').replaceChildren();
        document.querySelector('#profile-publications').replaceChildren();
        document.querySelector('#profile-contribution').textContent = profile.contribution;

        function appendList(containerId, items) {
          const list = document.createElement('ul');
          items.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.append(listItem);
          });
          document.querySelector(`#${containerId}`).append(list);
        }

        appendList('profile-education', profile.education);
        appendList('profile-career', profile.career);
        appendList('profile-research', profile.research);
        const publicationList = document.createElement('ol');
        profile.publications.forEach((publication) => {
          const item = document.createElement('li');
          const title = document.createElement('strong');
          title.textContent = publication.title;
          const description = document.createElement('p');
          description.textContent = publication.description;
          item.append(title, description);
          publicationList.append(item);
        });
        document.querySelector('#profile-publications').append(publicationList);
        const publicationNote = document.createElement('p');
        publicationNote.className = 'mt-4';
        publicationNote.textContent = profile.publicationNote;
        document.querySelector('#profile-publications').append(publicationNote);
      }

      if (photoId === 'faculty-photo-2') renderProfile(luziaProfile);
      if (photoId === 'faculty-photo-3') renderProfile(carlosProfile);
      if (photoId === 'faculty-photo-4') renderProfile(boaventuraProfile);
      if (photoId === 'faculty-photo-5') renderProfile(andreProfile);


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

      const photoButton = document.querySelector('#profile-photo');
      const photoInput = document.querySelector('#profile-photo-file');
      const photoStatus = document.querySelector('#profile-photo-status');
      let photoChanged = false;
      let currentPhotoUrl;
      function showProfilePhoto(blob) {
        if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
        currentPhotoUrl = URL.createObjectURL(blob);
        const image = document.createElement('img');
        image.src = currentPhotoUrl;
        image.alt = `Fotografia de ${facultyName}`;
        photoButton.replaceChildren(image);
      }
      photoButton.addEventListener('click', () => photoInput.click());
      const photoRequest = window.indexedDB
        ? window.indexedDB.open('acite-faculty-photos', 1)
        : null;
      const photoDatabase = new Promise((resolve) => {
        if (!photoRequest) { resolve(null); return; }
        photoRequest.addEventListener('success', () => resolve(photoRequest.result));
        photoRequest.addEventListener('error', () => resolve(null));
        photoRequest.addEventListener('blocked', () => resolve(null));
      });
      photoInput.addEventListener('change', async () => {
        const file = photoInput.files[0];
        photoInput.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          photoStatus.textContent = 'Selecione um ficheiro de imagem.';
          return;
        }
        photoChanged = true;
        showProfilePhoto(file);
        photoButton.disabled = true;
        photoStatus.textContent = 'A guardar fotografia…';
        try {
          const db = await photoDatabase;
          if (!db) throw new Error('Armazenamento indisponível');
          await new Promise((resolve, reject) => {
            const tx = db.transaction('photos', 'readwrite');
            tx.objectStore('photos').put({ id: photoId, blob: file, name: file.name, type: file.type, updatedAt: new Date().toISOString() });
            tx.oncomplete = resolve;
            tx.onerror = tx.onabort = () => reject(tx.error);
          });
          photoStatus.textContent = 'Fotografia guardada neste navegador.';
        } catch {
          photoStatus.textContent = 'Fotografia alterada apenas nesta sessão. Não foi possível guardar.';
        } finally {
          photoButton.disabled = false;
        }
      });
      window.addEventListener('beforeunload', () => {
        if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
      });
      if (!photoRequest) {
        console.error('Este navegador não disponibiliza armazenamento IndexedDB para carregar a fotografia do docente.');
      } else {
        photoRequest.addEventListener('upgradeneeded', () => {
          if (!photoRequest.result.objectStoreNames.contains('photos')) {
            photoRequest.result.createObjectStore('photos', { keyPath: 'id' });
          }
        });
        photoRequest.addEventListener('success', () => {
          const database = photoRequest.result;
          const transaction = database.transaction('photos', 'readonly');
          const storedPhotoRequest = transaction.objectStore('photos').get(photoId);
          storedPhotoRequest.addEventListener('success', () => {
            const photo = storedPhotoRequest.result;
            if (photoChanged || !photo || !(photo.blob instanceof Blob)) return;
            showProfilePhoto(photo.blob);
          });
          storedPhotoRequest.addEventListener('error', () => console.error('Não foi possível carregar a fotografia guardada.', storedPhotoRequest.error));
          transaction.addEventListener('error', () => console.error('Não foi possível aceder às fotografias guardadas.', transaction.error));
        });
        photoRequest.addEventListener('error', () => console.error('Não foi possível abrir o armazenamento de fotografias.', photoRequest.error));
      }
    }
