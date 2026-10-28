(() => {
  // Institutional content is view-only. Request forms retain their file fields.
  const mediaInputs = '.faculty-photo-input, .publication-image-input, #profile-photo-file, .work-cover-card input[type="file"], .strategic-video input[type="file"]';
  const mediaControls = '.faculty-photo-placeholder, .author-photo-area, .work-photo-area, #profile-photo, .investigation-cover, .cover-change, .course-video-upload';
  function lockContent() {
    document.querySelectorAll(mediaInputs).forEach(input => { input.disabled = true; });
    document.querySelectorAll(mediaControls).forEach(control => {
      if (control instanceof HTMLButtonElement) control.disabled = true;
      control.removeAttribute('tabindex');
      control.removeAttribute('role');
      control.removeAttribute('title');
      control.removeAttribute('aria-label');
    });
    document.querySelectorAll('[contenteditable]').forEach(element => {
      element.setAttribute('contenteditable', 'false');
    });
  }
  ['click', 'keydown', 'change'].forEach(type => {
    document.addEventListener(type, event => {
      if (event.target instanceof Element && event.target.closest(`${mediaInputs}, ${mediaControls}, .publication-image-action, .faculty-photo-area label, #add-author-card`)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  });
  lockContent();
  new MutationObserver(lockContent).observe(document.body, { childList: true, subtree: true });
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
