(() => {
 const storageKey = 'acite-opportunities';
 let jobs = [];
 let pending;

 try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) jobs = saved.filter(job => job && typeof job.title === 'string' && typeof job.company === 'string');
 } catch {}
 const filters = document.querySelector('#filters');
 document.querySelectorAll('[data-opportunity-type]').forEach(button => {
  button.addEventListener('click', () => {
   document.querySelector('#type').value = button.dataset.opportunityType;
   location.hash = 'ofertas';
   syncView();
  });
 });
 function syncView() {
  document.body.classList.toggle('jobs-view', location.hash === '#ofertas');
  document.body.classList.toggle('employer-view', location.hash === '#propor');
  updateResults();
 }
 window.addEventListener('hashchange', syncView);
 function updateResults() {
  const list = document.querySelector('#listings');
  list.replaceChildren();
  const query = document.querySelector('#search').value.trim().toLocaleLowerCase('pt');
  const type = document.querySelector('#type').value;
  document.querySelectorAll('[data-opportunity-type]').forEach(button => {
   if (button.dataset.opportunityType === type) button.setAttribute('aria-current', 'true');
   else button.removeAttribute('aria-current');
  });
  const mode = document.querySelector('#mode').value;
  const typeNames = { estagio: 'Estágio', emprego: 'Emprego' };
  const modeNames = { presencial: 'Presencial', hibrido: 'Híbrido', remoto: 'Remoto' };
  const visible = jobs.filter(job => (!query || `${job.title} ${job.company} ${job.location}`.toLocaleLowerCase('pt').includes(query)) && (!type || job.type === typeNames[type]) && (!mode || job.mode === modeNames[mode]));
  document.querySelector('#result-count').textContent = `${visible.length} oportunidades`;
  document.querySelector('#empty').hidden = visible.length > 0;
  document.querySelector('#empty h3').textContent = jobs.length ? 'Nenhuma oportunidade encontrada.' : 'Ainda não existem ofertas publicadas.';
  document.querySelector('#empty p').textContent = jobs.length ? 'Experimente outros critérios de pesquisa.' : 'As ofertas de emprego e estágio submetidas neste navegador serão apresentadas aqui.';
  visible.forEach(job => {
   const row = document.createElement('article');
   row.className = 'job-row'; row.setAttribute('role', 'listitem');
   const logo = document.createElement('span'); logo.className = 'job-logo'; logo.setAttribute('aria-hidden','true'); logo.textContent = job.company.slice(0,2).toUpperCase();
   const content = document.createElement('div'); content.className = 'job-content';
   const details = document.createElement('details');
   const summary = document.createElement('summary'); summary.textContent = job.title;
   details.append(summary);
   for (const [label, value] of [['Funções e requisitos',job.description],['Condições',job.conditions],['Candidatura',job.application]]) {
    const p = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = label + ': '; p.append(strong,document.createTextNode(value || 'Não indicado')); details.append(p);
   }
   const company = document.createElement('p'); company.textContent = `${job.company} · ${job.location} (${job.mode})`;
   const meta = document.createElement('small'); meta.textContent = `${job.type} · Candidaturas até ${job.deadline}`;
   const apply = document.createElement('a');
   apply.className = 'button secondary';
   apply.textContent = 'Candidatar-me →';
   const applicationPage = job.type === 'Estágio' ? 'candidatura-estagio' : 'candidatura-emprego';
   apply.href = `../${applicationPage}/index.html?oferta=${encodeURIComponent(job.id)}`;
   content.append(company,meta,details,apply); row.append(logo,content); list.append(row);
  });
 }
 window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  try { const saved = JSON.parse(event.newValue || '[]'); if (Array.isArray(saved)) jobs = saved.filter(job => job && typeof job.title === 'string' && typeof job.company === 'string'); updateResults(); } catch {}
 });
 filters.addEventListener('submit', event => event.preventDefault());
 filters.addEventListener('input', updateResults);
 filters.addEventListener('reset', () => setTimeout(updateResults, 0));
 syncView();
 const form = document.querySelector('#proposal');
 const review = document.querySelector('#review');
 const preview = document.querySelector('#preview');
 const status = document.querySelector('#form-status');
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const value = key => String(data.get(key) || '').trim();
  // ISO date comparison avoids timezone changes to the chosen deadline.
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Luanda', year:'numeric',month:'2-digit',day:'2-digit' }).formatToParts(new Date());
  const datePart = kind => parts.find(part => part.type === kind).value;
  const currentDate = `${datePart('year')}-${datePart('month')}-${datePart('day')}`;
  if (value('deadline') < currentDate) { status.textContent = 'Indique um prazo de candidatura actual ou futuro.'; form.elements.deadline.focus(); return; }
  const subject = `Proposta de ${value('type')} — ${value('title')}`;
  const body = `Exmos. Senhores,\n\nSolicitamos a análise desta proposta para divulgação junto da comunidade ACITE.\n\nENTIDADE EMPREGADORA\nNome: ${value('company')}\nContacto: ${value('contact')}\nEmail: ${value('email')}\nTelefone: ${value('phone') || 'Não indicado'}\n\nOPORTUNIDADE\nTítulo: ${value('title')}\nTipo: ${value('type')}\nModalidade: ${value('mode')}\nLocalização: ${value('location')}\nPrazo de candidatura: ${value('deadline')}\n\nFUNÇÕES E REQUISITOS\n${value('description')}\n\nCONDIÇÕES E DURAÇÃO\n${value('conditions')}\n\nCOMO CANDIDATAR-SE\n${value('application')}\n\nConfirmamos a representação da entidade e autorizamos o uso destas informações para análise da proposta.\n\nCom os melhores cumprimentos,\n${value('contact')}`;
  pending = Object.fromEntries(data.entries());
  preview.textContent = body;
  document.querySelector('#send-email').href = `mailto:s.academia@acite.ao?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  review.hidden = false;
  status.textContent = 'Oferta preparada. Reveja as informações antes de publicar neste navegador.';
  document.querySelector('#review-title').focus();
  review.scrollIntoView({ block:'start' });
 });
 document.querySelector('#publish').addEventListener('click', () => {
  if (!pending || !form.reportValidity()) return;
  const current = Object.fromEntries(new FormData(form).entries());
  if (JSON.stringify(current) !== JSON.stringify(pending)) { status.textContent = 'O formulário foi alterado. Reveja a proposta novamente.'; form.requestSubmit(); return; }
  try {
   const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
   const existing = Array.isArray(saved) ? saved : [];
   const offer = { ...pending, id: globalThis.crypto?.randomUUID?.() || String(Date.now()), createdAt: new Date().toISOString() };
   localStorage.setItem(storageKey, JSON.stringify([offer,...existing]));
   jobs = [offer,...existing];
   pending = null; form.reset(); review.hidden = true;
   status.textContent = ''; document.querySelector('#publication-status').textContent = 'Oferta publicada neste navegador.';
   location.hash = 'ofertas'; syncView();
   document.querySelector('#offers-title').tabIndex = -1; document.querySelector('#offers-title').focus();
  } catch { document.querySelector('#publication-status').textContent = 'Não foi possível guardar a oferta. Verifique se o armazenamento do navegador está disponível.'; }
 });
 document.querySelector('#edit').addEventListener('click', () => { review.hidden = true; form.elements.company.focus(); form.scrollIntoView({block:'start'}); });
 document.querySelector('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(preview.textContent); status.textContent = 'Proposta copiada. Pode colá-la num email para s.academia@acite.ao.'; document.querySelector('#copy').textContent = 'Proposta copiada'; }
  catch { const selection = getSelection(); const range = document.createRange(); range.selectNodeContents(preview); selection.removeAllRanges(); selection.addRange(range); document.querySelector('#copy').textContent = 'Texto seleccionado — copie manualmente'; }
 });
})();
