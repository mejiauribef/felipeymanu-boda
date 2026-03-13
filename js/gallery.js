/**
 * Photo carousel with random order, swipe support, and lightbox.
 */
const TOTAL_PHOTOS = 47;
let carouselIndex = 0;
let shuffledPhotos = [];

function initGallery() {
  const track = document.getElementById('carousel-track');
  const dots = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!track) return;

  // Build shuffled array of photo indices [1..47]
  shuffledPhotos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => i + 1);
  shuffle(shuffledPhotos);

  // Create slides
  shuffledPhotos.forEach((n, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `<img src="assets/images/gallery/gallery-${n}.jpg" alt="Manuela y Felipe" loading="lazy">`;
    slide.addEventListener('click', () => openLightbox(i));
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

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

  // Keyboard for carousel
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') goTo(carouselIndex - 1);
    if (e.key === 'ArrowRight') goTo(carouselIndex + 1);
  });

  function goTo(index) {
    carouselIndex = (index + TOTAL_PHOTOS) % TOTAL_PHOTOS;
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === carouselIndex);
    });
  }

  // Auto-advance every 5 seconds
  let autoPlay = setInterval(() => goTo(carouselIndex + 1), 5000);

  // Pause on interaction
  [prevBtn, nextBtn, track].forEach(el => {
    el.addEventListener('pointerdown', () => {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => goTo(carouselIndex + 1), 5000);
    });
  });

  // --- Lightbox ---
  function openLightbox(index) {
    carouselIndex = index;
    lightboxImg.src = `assets/images/gallery/gallery-${shuffledPhotos[index]}.jpg`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function lightboxNav(dir) {
    carouselIndex = (carouselIndex + dir + TOTAL_PHOTOS) % TOTAL_PHOTOS;
    lightboxImg.src = `assets/images/gallery/gallery-${shuffledPhotos[carouselIndex]}.jpg`;
    // Sync carousel position
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === carouselIndex);
    });
  }

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
