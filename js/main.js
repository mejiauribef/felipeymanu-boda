/**
 * Main orchestrator — initializes everything on DOMContentLoaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Personalize greeting from URL ?n=
  initPersonalization();

  // 2. "Open Invitation" gate
  const btnOpen = document.getElementById('btn-open');
  const mainContent = document.getElementById('main-content');
  const musicPlayer = document.getElementById('music-player');

  btnOpen.addEventListener('click', () => {
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

    // Smooth scroll to countdown
    document.getElementById('countdown').scrollIntoView({ behavior: 'smooth' });
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

    const data = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // TODO: Replace with your Google Apps Script URL
    const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

    if (APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      // Demo mode: simulate success
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.add('show');
      }, 800);
      return;
    }

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: data,
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
