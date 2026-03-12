/**
 * Gallery lightbox with keyboard and touch navigation.
 */
let currentIndex = 0;
let galleryImages = [];

function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!items.length || !lightbox) return;

  // Collect image sources
  galleryImages = Array.from(items).map((item) => item.querySelector('img').src);

  // Open lightbox
  items.forEach((item) => {
    item.addEventListener('click', () => {
      currentIndex = parseInt(item.dataset.index, 10);
      showImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigate(-1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigate(1);
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? -1 : 1);
    }
  }, { passive: true });

  function showImage() {
    lightboxImg.src = galleryImages[currentIndex];
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
    showImage();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}
