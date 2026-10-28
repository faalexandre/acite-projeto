(() => {
 const form = document.querySelector('#application');
 const cv = document.querySelector('#cv');
 const attachments = document.querySelector('#attachments');
 const status = document.querySelector('#status');
 const review = document.querySelector('#review');
 const save = document.querySelector('#save');
 const saveStatus = document.querySelector('#save-status');
 let extra = [], pending = null, saved = null;
 const labels = {name:'Nome',email:'Email',phone:'Telefone',location:'Localidade',vacancy:'Vaga ou área',company:'Entidade',education:'Formação',institution:'Instituição',year:'Ano de frequência',internship:'Tipo de estágio',availability:'Disponibilidade',experience:'Experiência',motivation:'Motivação'};
 const mb = size => (size / 1024 / 1024).toFixed(2) + ' MB';
 function files() { return [...cv.files, ...extra]; }
 function validFiles() {
  const all = files();
  if (extra.length > 5) return 'Pode anexar até 5 documentos adicionais.';
  if (all.some(file => !/\.(pdf|doc|docx|jpe?g|png)$/i.test(file.name))) return 'Seleccione apenas PDF, DOC, DOCX, JPG ou PNG.';
  if (all.some(file => file.size === 0)) return 'Um dos ficheiros está vazio. Seleccione outro documento.';
  if (all.some(file => file.size > 10 * 1024 * 1024)) return 'Cada ficheiro deve ter no máximo 10 MB.';
  if (all.reduce((sum,file) => sum + file.size, 0) > 25 * 1024 * 1024) return 'O total de documentos não pode ultrapassar 25 MB.';
  return '';
 }
 function invalidate() { pending = null; review.hidden = true; }
 function renderFiles() {
  for (const [container, selected] of [[document.querySelector('#cv-list'),[...cv.files]],[document.querySelector('#attachment-list'),extra]]) {
   container.replaceChildren();
   selected.forEach((file,index) => {
    const row = document.createElement('div');
    const text = document.createElement('span'); text.textContent = `${file.name} · ${mb(file.size)}`;
    const remove = document.createElement('button'); remove.type='button'; remove.textContent='Remover'; remove.setAttribute('aria-label','Remover '+file.name);
    remove.addEventListener('click', () => { if(container.id==='cv-list') cv.value=''; else extra.splice(index,1); invalidate(); renderFiles(); });
    row.append(text,remove); container.append(row);
   });
  }
  status.textContent = validFiles();
 }
 cv.addEventListener('change', () => { invalidate(); renderFiles(); });
 attachments.addEventListener('change', () => { extra = [...extra,...attachments.files]; attachments.value=''; invalidate(); renderFiles(); });
 form.addEventListener('input', invalidate);
 const params = new URLSearchParams(location.search);
 try {
  const offers = JSON.parse(localStorage.getItem('acite-opportunities') || '[]');
  const offer = Array.isArray(offers) ? offers.find(item => item.id === params.get('oferta')) : null;
  if (offer) { form.elements.vacancy.value=offer.title; form.elements.company.value=offer.company; }
 } catch {}
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const error = validFiles();
  if(error) {status.textContent=error; cv.focus(); return;}
  const data = {};
  for(const [key,value] of new FormData(form)) if(labels[key]) data[key]=String(value).trim();
  for(const field of form.querySelectorAll('input[required]:not([type="file"]):not([type="checkbox"]),textarea[required]')) {
   if(!field.value.trim()) { status.textContent='Preencha todos os campos obrigatórios.'; field.focus(); return; }
  }
  pending={type:document.body.dataset.applicationType,offerId:params.get('oferta'),data,files:files().map(file=>({name:file.name,type:file.type,size:file.size,blob:file}))};
  const list=document.querySelector('#review-data'); list.replaceChildren();
  Object.entries(data).forEach(([key,value])=>{const dt=document.createElement('dt');dt.textContent=labels[key];const dd=document.createElement('dd');dd.textContent=value;list.append(dt,dd);});
  const fileList=document.querySelector('#review-files');fileList.replaceChildren();
  pending.files.forEach(file=>{const li=document.createElement('li');li.textContent=`${file.name} · ${mb(file.size)}`;fileList.append(li);});
  document.querySelector('#receipt').hidden=true;save.hidden=false;saveStatus.textContent='';review.hidden=false;
  document.querySelector('#review-title').focus();review.scrollIntoView({block:'start'});
 });
 document.querySelector('#edit').addEventListener('click',()=>{review.hidden=true;form.elements.name.focus();});
 save.addEventListener('click',async()=>{
  if(!pending || save.disabled) return;
  save.disabled=true;saveStatus.textContent='A guardar candidatura e documentos…';
  try {
   const db=await new Promise((resolve,reject)=>{
    if(!window.indexedDB)return reject(new Error('Armazenamento indisponível.'));
    const request=indexedDB.open('acite-applications',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('applications',{keyPath:'id'});
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Armazenamento bloqueado.'));
   });
   const entry={...pending,id:'ACITE-'+(crypto.randomUUID?.() || Date.now().toString(36)),createdAt:new Date().toISOString()};
   try {await new Promise((resolve,reject)=>{const tx=db.transaction('applications','readwrite');tx.objectStore('applications').add(entry);tx.oncomplete=resolve;tx.onerror=tx.onabort=()=>reject(tx.error);});} finally {db.close();}
   saved=entry;pending=null;save.hidden=true;saveStatus.textContent='Dados e ficheiros guardados com sucesso neste navegador.';
   document.querySelector('#reference').textContent='Referência local: '+entry.id;
   document.querySelector('#receipt').hidden=false;
  } catch {saveStatus.textContent='Não foi possível guardar a candidatura. Os dados permanecem no formulário. Verifique o espaço e as permissões do navegador e tente novamente.';}
  finally {save.disabled=false;}
 });
 document.querySelector('#download').addEventListener('click',()=>{
  if(!saved)return;
  const text=`COMPROVATIVO LOCAL — NÃO ENVIADO À ENTIDADE\nReferência: ${saved.id}\nTipo: ${saved.type}\nData: ${saved.createdAt}\n\n`+Object.entries(saved.data).map(([key,value])=>`${labels[key]}: ${value}`).join('\n')+'\n\nDocumentos guardados neste navegador:\n'+saved.files.map(file=>`${file.name} (${mb(file.size)})`).join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=saved.id+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
})();