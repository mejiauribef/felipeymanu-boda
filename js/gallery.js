/**
 * Photo carousel with multi-photo view, progress bar, swipe, and lightbox.
 */
const TOTAL_PHOTOS = 64;
let carouselIndex = 0;
let shuffledPhotos = [];
let photosPerView = 3;

function initGallery() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const progressBar = document.getElementById('carousel-progress-bar');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!track) return;

  // Responsive photos per view
  function updatePhotosPerView() {
    photosPerView = window.innerWidth <= 768 ? 1 : 3;
  }
  updatePhotosPerView();
  window.addEventListener('resize', () => {
    updatePhotosPerView();
    goTo(Math.min(carouselIndex, maxIndex()));
  });

  // Build shuffled array
  shuffledPhotos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => i + 1);
  shuffle(shuffledPhotos);

  // Create slides
  shuffledPhotos.forEach((n, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `<img src="assets/images/gallery/gallery-${n}.jpg" alt="Manuela y Felipe" loading="lazy">`;
    slide.addEventListener('click', () => openLightbox(i));
    track.appendChild(slide);
  });

  function maxIndex() {
    return Math.max(0, TOTAL_PHOTOS - photosPerView);
  }

  function getSlideWidth() {
    const slide = track.querySelector('.carousel-slide');
    if (!slide) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return slide.offsetWidth + gap;
  }

  function goTo(index) {
    carouselIndex = Math.max(0, Math.min(index, maxIndex()));
    const offset = carouselIndex * getSlideWidth();
    track.style.transform = `translateX(-${offset}px)`;
    // Update progress bar
    const progress = maxIndex() > 0 ? ((carouselIndex + photosPerView) / TOTAL_PHOTOS) * 100 : 100;
    progressBar.style.width = Math.min(progress, 100) + '%';
  }

  // Initial progress
  goTo(0);

  // Navigation
  prevBtn.addEventListener('click', () => goTo(carouselIndex - 1));
  nextBtn.addEventListener('click', () => goTo(carouselIndex + 1));

  // Swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      goTo(carouselIndex + (diff > 0 ? -1 : 1));
    }
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') goTo(carouselIndex - 1);
    if (e.key === 'ArrowRight') goTo(carouselIndex + 1);
  });

  // Auto-advance
  let autoPlay = setInterval(() => goTo(carouselIndex + 1), 4000);

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(carouselIndex + 1), 4000);
  }

  [prevBtn, nextBtn, track].forEach(el => {
    el.addEventListener('pointerdown', resetAutoPlay);
  });

  // --- Lightbox ---
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = `assets/images/gallery/gallery-${shuffledPhotos[index]}.jpg`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    clearInterval(autoPlay);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    resetAutoPlay();
  }

  function lightboxNav(dir) {
    lightboxIndex = (lightboxIndex + dir + TOTAL_PHOTOS) % TOTAL_PHOTOS;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = `assets/images/gallery/gallery-${shuffledPhotos[lightboxIndex]}.jpg`;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  lightboxImg.style.transition = 'opacity 0.15s ease';

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); lightboxNav(-1); });
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); lightboxNav(1); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });

  // Lightbox swipe
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lbTouchX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - lbTouchX;
    if (Math.abs(diff) > 50) lightboxNav(diff > 0 ? -1 : 1);
  }, { passive: true });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
