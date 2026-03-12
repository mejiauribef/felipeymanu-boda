/**
 * Scroll-reveal animations using IntersectionObserver.
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-stagger, .fade-in-scale');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}
