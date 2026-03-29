/**
 * Reads ?n= parameter from URL and personalizes the greeting.
 * Single name  → "te invitamos a celebrar nuestro amor"
 * Two names    → "los invitamos a celebrar nuestro amor"
 */
function initPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const rawName = params.get('n');
  const greeting = document.getElementById('hero-greeting');

  if (!rawName || !greeting) return;

  const clean = rawName.replace(/<[^>]*>/g, '').trim().substring(0, 100);
  if (!clean) return;

  // Detect two names separated by " y "
  const parts = clean.split(/\s+y\s+/i);
  const isPlural = parts.length >= 2 && parts[0].trim() && parts[1].trim();

  const nameSpan = document.createElement('span');
  nameSpan.className = 'guest-name';
  nameSpan.textContent = clean;

  greeting.textContent = '';
  greeting.classList.add('hero-greeting--personalized');
  greeting.appendChild(nameSpan);
  greeting.appendChild(document.createTextNode(
    isPlural
      ? 'Los invitamos a celebrar nuestro amor'
      : 'Te invitamos a celebrar nuestro amor'
  ));
}
