(() => {
  'use strict';
  const supported = ['pt', 'fr', 'en'];
  const storageKey = 'acite-language';
  const bar = document.createElement('div');
  bar.className = 'language-bar notranslate';
  bar.setAttribute('translate', 'no');
  bar.innerHTML = '<select id="site-language" aria-label="Selecionar idioma"><option value="pt">PT</option><option value="fr">FR</option><option value="en">EN</option></select><span id="language-status" role="status" aria-live="polite"></span><div id="acite-translate"></div>';
  const utilityBar = [...document.body.children].find(element =>
    element.matches('.utility, .utility-bar') || element.classList.contains('bg-[#0d1832]')
  );
  if (utilityBar) {
    utilityBar.classList.add('language-host');
    const contacts = document.createElement('div');
    contacts.className = 'utility-contacts';
    contacts.append(...utilityBar.childNodes);
    utilityBar.append(contacts);
    utilityBar.append(bar);
  } else {
    const utility = document.createElement('div');
    utility.className = 'language-host language-host-standalone';
    utility.append(bar);
    document.body.prepend(utility);
  }
  const select = bar.querySelector('select');
  const status = bar.querySelector('[role="status"]');
  let preferred = 'pt';
  try { preferred = localStorage.getItem(storageKey) || 'pt'; } catch {}
  if (!supported.includes(preferred)) preferred = 'pt';
  select.value = preferred;
  let pending = preferred;
  let translatorLoaded = false;
  let observer;
  let timeout;
  function remember(language) {
    try { localStorage.setItem(storageKey, language); } catch {}
  }
  function clearTranslationCookies() {
    const paths = ['/', location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1)];
    const domains = [null, location.hostname, '.' + location.hostname];
    for (const path of paths) for (const domain of domains) {
      document.cookie = 'googtrans=; Max-Age=0; path=' + path + (domain ? '; domain=' + domain : '');
    }
  }
  function applyLanguage() {
    const combo = document.querySelector('#acite-translate select.goog-te-combo');
    if (!combo || ![...combo.options].some(option => option.value === pending)) return false;
    combo.value = pending;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
    document.documentElement.lang = pending;
    status.textContent = '';
    clearTimeout(timeout);
    return true;
  }
  function loadTranslator() {
    if (translatorLoaded) { applyLanguage(); return; }
    translatorLoaded = true;
    status.textContent = 'A carregar tradução…';
    window.aciteTranslateReady = () => {
      new window.google.translate.TranslateElement({ pageLanguage: 'pt', includedLanguages: 'en,fr', autoDisplay: false }, 'acite-translate');
      observer = new MutationObserver(() => { if (applyLanguage()) observer.disconnect(); });
      observer.observe(document.querySelector('#acite-translate'), { childList: true, subtree: true });
      if (applyLanguage()) observer.disconnect();
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=aciteTranslateReady';
    script.async = true;
    const failed = () => {
      status.textContent = 'Tradução indisponível. Verifique a ligação e tente novamente.';
      translatorLoaded = false;
      if (observer) observer.disconnect();
      script.remove();
    };
    script.onerror = failed;
    timeout = setTimeout(failed, 20000);
    document.head.append(script);
  }
  select.addEventListener('change', () => {
    pending = select.value;
    remember(pending);
    if (pending === 'pt') {
      clearTranslationCookies();
      location.reload();
      return;
    }
    loadTranslator();
  });
  if (preferred !== 'pt') loadTranslator();
})();
