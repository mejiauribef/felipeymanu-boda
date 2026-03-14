/**
 * Main orchestrator — initializes everything on DOMContentLoaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Personalize greeting from URL ?n=
  initPersonalization();

  // 2. "Open Invitation" gate
  const btnOpen = document.getElementById('btn-open');
  const hero = document.getElementById('hero');
  const mainContent = document.getElementById('main-content');
  const musicPlayer = document.getElementById('music-player');

  btnOpen.addEventListener('click', () => {
    // Remove hero from DOM immediately
    hero.remove();

    // Reveal content
    mainContent.classList.remove('content-hidden');
    mainContent.classList.add('content-visible');

    // Show music player
    musicPlayer.classList.remove('content-hidden');

    // Start music
    startMusic();

    // Initialize modules that depend on visible content
    initCountdown();
    initScrollReveal();
    initGallery();

    // Scroll to top
    window.scrollTo(0, 0);
  });

  // 3. Music player toggle
  initMusic();

  // 4. RSVP form
  initRSVP();

  // 5. Copy account number
  initCopyAccount();
});

/**
 * RSVP form handler — sends data to Google Apps Script.
 * Replace APPS_SCRIPT_URL with your deployed web app URL.
 */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const nombre = form.querySelector('[name="nombre"]').value.trim();
    const asistencia = form.querySelector('[name="asistencia"]').value;

    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwAg2PX-bU8JMDNqt9Ux8lkbbTQtHmlcRFnpMQ7UjTGldNVqwKfDD6IbykvWEJYRSRgCg/exec';

    if (APPS_SCRIPT_URL === 'REPLACE_WITH_APPS_SCRIPT_URL') {
      // Fallback: demo mode until script URL is set
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.add('show');
      }, 800);
      return;
    }

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'nombre=' + encodeURIComponent(nombre) + '&asistencia=' + encodeURIComponent(asistencia),
      });
      form.style.display = 'none';
      success.classList.add('show');
    } catch (err) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      alert('Hubo un error al enviar. Por favor intenta de nuevo.');
    }
  });
}

/**
 * Copy bank account number to clipboard.
 */
function initCopyAccount() {
  const btn = document.getElementById('btn-copy');
  const feedback = document.getElementById('copy-feedback');

  if (!btn) return;

  btn.addEventListener('click', async () => {
    const account = btn.dataset.account;
    try {
      await navigator.clipboard.writeText(account);
      feedback.classList.add('show');
      setTimeout(() => feedback.classList.remove('show'), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = account;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      feedback.classList.add('show');
      setTimeout(() => feedback.classList.remove('show'), 2000);
    }
  });
}
