/**
 * Live countdown to July 18, 2026 at 3:00 PM Colombia time (UTC-5).
 */
let countdownInterval = null;

function initCountdown() {
  // July 18, 2026 3:00 PM UTC-5 = July 18, 2026 8:00 PM UTC
  const weddingDate = new Date('2026-07-18T20:00:00Z');

  function update() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      const grid = document.getElementById('countdown-grid');
      if (grid) {
        grid.innerHTML = '<p class="countdown-done">¡Hoy es el gran día!</p>';
      }
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setText('cd-days', days);
    setText('cd-hours', pad(hours));
    setText('cd-minutes', pad(minutes));
    setText('cd-seconds', pad(seconds));
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  update();
  countdownInterval = setInterval(update, 1000);
}
