let audienceProfile = "";
      const profileChoice = document.querySelector("#profile-choice");
      const profileTrigger = document.querySelector("#profile-trigger");
      const profileMenu = document.querySelector("#profile-options");
      const profileOptions = [
        ["student", "Estudante"],
        ["international", "Estudante internacional"],
        ["company", "Empresa"],
        ["journalist", "Jornalista"],
        ["graduate", "Diplomado (a)"],
      ];
      const audienceChoice = document.querySelector("#audience-choice");
      const audienceTrigger = document.querySelector("#audience-trigger");
      const audienceMenu = document.querySelector("#audience-intentions");
      const defaultIntentions = [
        ["#vida-estudantil", "Conhecer a vida estudantil"],
        ["#recursos", "Consultar recursos"],
        ["#servicos-academicos", "Encontrar servi\u00e7os acad\u00e9micos"],
        ["#plataformas", "Aceder \u00e0s plataformas"],
        ["#orientacao", "Obter orienta\u00e7\u00e3o acad\u00e9mica"],
      ];
      const studentIntentions = [
        ["../ano-lectivo/index.html", "Consultar todas informa\u00e7\u00f5es sobre o ano lectivo"],
        ["../candidatura/index.html", "Inscrever-me ou reinscrever-me na universidade"],
        ["../calendario-universitario/index.html", "Consultar o calend\u00e1rio universit\u00e1rio"],
        ["../diplomas/index.html", "Levantar o diploma"],
        ["../cursos/index.html", "Procurar uma forma\u00e7\u00e3o"],
        ["../candidatura/index.html", "Candidatar-me a uma forma\u00e7\u00e3o"],
        ["../reorientacao/index.html", "Reorientar-me"],
        ["../estudar-no-estrangeiro/index.html", "Estudar no estrangeiro"],
        ["../estagios/index.html", "Encontrar um est\u00e1gio"],
      ];
      function closeAudienceMenus() {
        profileChoice.classList.remove("is-open");
        audienceChoice.classList.remove("is-open");
        profileTrigger.setAttribute("aria-expanded", "false");
        audienceTrigger.setAttribute("aria-expanded", "false");
      }
      function updateIntentions() {
        const choices = audienceProfile === "student"
          ? studentIntentions.map((item) => Array.isArray(item) ? item : ["", item])
          : audienceProfile === "company"
            ? [
                ...defaultIntentions,
                ["../oportunidades/index.html#propor", "Publicar estágios e empregos"],
                ["../apoio-empresas/index.html#formar", "Formar os meus trabalhadores"],
                ["../apoio-empresas/index.html#servicos", "Arrendar um espaço na universidade"],
              ]
            : defaultIntentions;
        audienceMenu.replaceChildren();
        audienceTrigger.innerHTML = "...e quero <i class=\"fa-solid fa-chevron-down\" aria-hidden=\"true\"></i>";
        audienceTrigger.disabled = !audienceProfile;
        audienceChoice.classList.remove("is-open");
        audienceTrigger.setAttribute("aria-expanded", "false");
        choices.forEach(([value, label]) => {
          const option = document.createElement("button");
          option.type = "button";
          option.textContent = label;
          option.addEventListener("click", () => {
            audienceTrigger.innerHTML = `${label} <i class=\"fa-solid fa-chevron-down\" aria-hidden=\"true\"></i>`;
            audienceChoice.classList.remove("is-open");
            audienceTrigger.setAttribute("aria-expanded", "false");
            if (value.split(/[?#]/)[0].endsWith(".html")) {
              window.location.href = value;
              return;
            }
            if (value.startsWith("#")) {
              document.querySelector(value)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
          audienceMenu.append(option);
        });
      }
      profileOptions.forEach(([value, label]) => {
        const option = document.createElement("button");
        option.type = "button";
        option.textContent = label;
        option.addEventListener("click", () => {
          audienceProfile = value;
          profileTrigger.innerHTML = `${label} <i class=\"fa-solid fa-chevron-down\" aria-hidden=\"true\"></i>`;
          closeAudienceMenus();
          updateIntentions();
        });
        profileMenu.append(option);
      });
      profileTrigger.addEventListener("click", () => {
        const isOpen = profileChoice.classList.toggle("is-open");
        audienceChoice.classList.remove("is-open");
        audienceTrigger.setAttribute("aria-expanded", "false");
        profileTrigger.setAttribute("aria-expanded", String(isOpen));
      });
      audienceTrigger.addEventListener("click", () => {
        if (audienceTrigger.disabled) return;
        const isOpen = audienceChoice.classList.toggle("is-open");
        profileChoice.classList.remove("is-open");
        profileTrigger.setAttribute("aria-expanded", "false");
        audienceTrigger.setAttribute("aria-expanded", String(isOpen));
      });
      document.addEventListener("click", (event) => {
        if (!profileChoice.contains(event.target) && !audienceChoice.contains(event.target)) closeAudienceMenus();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAudienceMenus();
      });      const menuToggle = document.querySelector(".menu-toggle");
      const siteHeader = document.querySelector(".site-header");
      function closeMobileMenu() {
        siteHeader.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.querySelector("i").className = "fa-solid fa-bars";
      }
      menuToggle.addEventListener("click", () => {
        const isOpen = siteHeader.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
          "aria-label",
          isOpen ? "Fechar menu" : "Abrir menu",
        );
        menuToggle.querySelector("i").className = isOpen
          ? "fa-solid fa-xmark"
          : "fa-solid fa-bars";
      });
      siteHeader
        .querySelectorAll(".main-nav a")
        .forEach((link) => link.addEventListener("click", closeMobileMenu));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMobileMenu();
      });
