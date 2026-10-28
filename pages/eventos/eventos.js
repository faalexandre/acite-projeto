const header = document.querySelector('.header');
const toggle = document.querySelector('.menu-toggle');
function closeMenu() {header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');}
toggle.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
header.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
matchMedia('(min-width:769px)').addEventListener('change',closeMenu);
(() => {
 let period='all';
 const form=document.querySelector('.event-filters');
 const search=document.querySelector('#event-search');
 const category=document.querySelector('#event-category');
 const cards=[...document.querySelectorAll('.event-card')];
 const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function render(){
  const query=normalize(search.value.trim());let count=0;
  cards.forEach(card=>{const visible=(period==='all'||card.dataset.period===period)&&(!category.value||card.dataset.category===category.value)&&(!query||normalize(card.textContent).includes(query));card.hidden=!visible;if(visible)count++;});
  document.querySelector('#event-count').textContent=`${count} evento${count===1?'':'s'}`;
  document.querySelector('#empty-events').hidden=count>0;
  document.querySelector('#empty-title').textContent=period==='upcoming'?'Ainda não há próximos eventos anunciados.':'Nenhum evento encontrado';
  document.querySelector('#empty-text').textContent=period==='upcoming'?'Os novos eventos serão apresentados aqui quando os programas forem disponibilizados.':'Experimente outra pesquisa ou categoria.';
  document.querySelectorAll('.event-tabs button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.period===period)));
 }
 document.querySelectorAll('.event-tabs button').forEach(button=>button.addEventListener('click',()=>{period=button.dataset.period;render();}));
 form.addEventListener('submit',event=>event.preventDefault());form.addEventListener('input',render);form.addEventListener('reset',()=>setTimeout(render,0));
 document.querySelector('#clear-events').addEventListener('click',()=>{period='all';form.reset();render();});render();
})();