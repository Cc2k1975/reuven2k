let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (localStorage.getItem('pwaPromptShown')) return;

  const btn = document.createElement('button');
  btn.textContent = '📲 הוסף את פן אקספרס למסך הבית';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#ffd700',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: '700',
    zIndex: '9999',
    boxShadow: '0 0 15px rgba(255,215,0,0.6)',
    cursor: 'pointer'
  });

  document.body.appendChild(btn);

  btn.addEventListener('click', async () => {
    btn.remove();
    localStorage.setItem('pwaPromptShown', '1');
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
});

window.addEventListener('appinstalled', () => {
  localStorage.setItem('pwaPromptShown', '1');
});
