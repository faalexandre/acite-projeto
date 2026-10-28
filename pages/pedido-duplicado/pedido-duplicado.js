const form = document.querySelector('#request-form');
const reason = document.querySelector('#reason');
const help = document.querySelector('#reason-help');
const review = document.querySelector('#review');
let summary = '';
form.elements.ano.max = new Date().getFullYear();
const guidance = {
  'Diploma danificado ou ilegível': 'Justificativo: cópia ou fotografia do diploma danificado ou ilegível.',
  'Destruição': 'Justificativo: declaração do sinistro que causou a destruição do diploma.',
  'Perda': 'Justificativo: declaração de honra de perda do diploma.',
  'Roubo': 'Justificativo: comprovativo de apresentação de queixa.',
  'Outro': 'Apresente um documento que fundamente o motivo indicado na descrição.',
};
reason.addEventListener('change', () => {
  help.textContent = guidance[reason.value] || 'Seleccione o motivo para consultar o justificativo a apresentar.';
});
for (const input of form.querySelectorAll('input[type="file"]')) {
  input.addEventListener('change', () => {
    const file = input.files[0];
    input.setCustomValidity(file && (!/\.(pdf|jpe?g|png)$/i.test(file.name) || file.size > 10 * 1024 * 1024)
      ? 'Seleccione um PDF, JPG ou PNG com até 10 MB.' : '');
    input.reportValidity();
  });
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  summary = [
    'PEDIDO DE DUPLICADO DE DIPLOMA',
    ...Object.entries({ nome: 'Nome completo', identificacao: 'BI ou passaporte', email: 'Email', telefone: 'Telefone', curso: 'Curso', estudante: 'Número de estudante', ano: 'Ano de conclusão', diploma: 'Número do diploma', motivo: 'Motivo', justificacao: 'Justificação' })
      .map(([key, label]) => `${label}: ${String(data.get(key)).trim() || 'Não indicado'}`),
    '', 'Documentos a anexar ao email:',
    `Identificação: ${data.get('documento').name}`,
    `Justificativo: ${data.get('justificativo').name}`,
    '', 'Declaro que os dados e a justificação apresentados são verdadeiros.',
  ].join('\n');
  document.querySelector('#request-summary').textContent = summary;
  form.hidden = true;
  review.hidden = false;
  document.querySelector('#review-title').focus();
});
document.querySelector('#edit').addEventListener('click', () => {
  review.hidden = true;
  form.hidden = false;
  form.elements.nome.focus();
});
document.querySelector('#open-email').addEventListener('click', () => {
  window.location.href = `mailto:s.academia@acite.ao?subject=${encodeURIComponent('Pedido de duplicado de diploma')}&body=${encodeURIComponent(summary)}`;
});
document.querySelector('#download').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([summary], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pedido-duplicado-diploma.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
