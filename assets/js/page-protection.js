(() => {
  // Browser-side deterrents; public page source remains accessible in browsers.
  function isEditable(target) {
    return target instanceof Element && Boolean(target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])'));
  }
  ['copy', 'cut', 'contextmenu', 'selectstart', 'dragstart'].forEach(type => {
    document.addEventListener(type, event => {
      if (!isEditable(event.target)) event.preventDefault();
    });
  });
  document.addEventListener('keydown', event => {
    if (isEditable(event.target)) return;
    const key = event.key.toLowerCase();
    const modifier = event.ctrlKey || event.metaKey;
    const inspectionShortcut = key === 'f12' || (modifier && event.shiftKey && ['i', 'j', 'c'].includes(key)) || (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key));
    if (inspectionShortcut || (modifier && ['c', 'x', 'u', 's', 'a'].includes(key))) event.preventDefault();
  });
})();
