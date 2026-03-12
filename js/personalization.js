/**
 * Reads ?n= parameter from URL and personalizes the greeting.
 */
function initPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('n');
  const greeting = document.getElementById('hero-greeting');

  if (name && greeting) {
    // Sanitize: strip HTML tags and limit length
    const clean = name.replace(/<[^>]*>/g, '').trim().substring(0, 100);
    if (clean) {
      greeting.textContent = `Queridos ${clean}`;
    }
  }
}
