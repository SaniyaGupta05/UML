/**
 * Universal Medicap Limited (UML) - Interactive Split Hero Experience
 * Built according to user reference layout and official UML brand guidelines.
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoAutoplay();
  initHeroSlider();
  initProductsCarousel();
  initModals();
  initHeaderScroll();
  initFormSubmission();
});

/* ==========================================================================
   1. CLEAN VIDEO AUTOPLAY (ZERO OVERLAYS / CONTROLS)
   ========================================================================== */
function initVideoAutoplay() {
  const video = document.getElementById('heroSplitVideo');
  if (!video) return;

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  video.play().catch(() => {
    // Autoplay fallback if blocked by browser policy
    document.addEventListener('click', () => {
      video.play().catch(() => { });
    }, { once: true });
  });
}

/* ==========================================================================
   2. HERO SLIDE CONTROLLER (SMOOTH VIDEO GLIDE TO LEFT / RIGHT)
   ========================================================================== */
function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  const btnSlide1 = document.getElementById('btnSlide1');
  const btnSlide2 = document.getElementById('btnSlide2');
  const prevBtn = document.getElementById('btnSlidePrev');
  const nextBtn = document.getElementById('btnSlideNext');
  const discoverBtn = document.getElementById('btnDiscoverUML');

  if (!slider) return;

  let currentSlide = 1;

  function setSlide(index) {
    currentSlide = index;

    if (currentSlide === 1) {
      slider.classList.remove('slide-2-active');
      if (btnSlide1) btnSlide1.classList.add('active');
      if (btnSlide2) btnSlide2.classList.remove('active');
    } else {
      slider.classList.add('slide-2-active');
      if (btnSlide1) btnSlide1.classList.remove('active');
      if (btnSlide2) btnSlide2.classList.add('active');
    }
  }

  if (btnSlide1) btnSlide1.addEventListener('click', () => setSlide(1));
  if (btnSlide2) btnSlide2.addEventListener('click', () => setSlide(2));

  if (prevBtn) prevBtn.addEventListener('click', () => setSlide(currentSlide === 1 ? 2 : 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setSlide(currentSlide === 1 ? 2 : 1));

  // "Discover UML" on Slide 1 smoothly glides video to Slide 2
  if (discoverBtn) {
    discoverBtn.addEventListener('click', () => {
      setSlide(2);
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') setSlide(2);
    if (e.key === 'ArrowLeft') setSlide(1);
  });
}

/* ==========================================================================
   3. FEATURED PRODUCTS CAROUSEL SLIDER (8 PRODUCTS, 3 PER VIEW)
   ========================================================================== */
function initProductsCarousel() {
  const track = document.getElementById('prodTrack');
  const prevBtn = document.getElementById('prodPrevBtn');
  const nextBtn = document.getElementById('prodNextBtn');
  const viewport = document.getElementById('prodViewport');

  if (!track || !prevBtn || !nextBtn || !viewport) return;

  const cards = track.querySelectorAll('.product-orange-card');
  const totalCards = cards.length;
  let currentIndex = 0;

  function getCardsPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const firstCard = cards[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 28;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Update button states
    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

    nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
  }

  prevBtn.addEventListener('click', () => {
    currentIndex--;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();
  });

  window.addEventListener('resize', () => {
    updateCarousel();
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 45) {
      currentIndex++;
      updateCarousel();
    } else if (touchEndX - touchStartX > 45) {
      currentIndex--;
      updateCarousel();
    }
  }, { passive: true });

  // Initial call
  setTimeout(updateCarousel, 50);
}

/* ==========================================================================
   3. MODALS
   ========================================================================== */
function initModals() {
  const modal = document.getElementById('sampleModal');
  const openBtns = document.querySelectorAll('[data-open-sample-modal]');
  const closeBtns = document.querySelectorAll('.modal-close-btn, [data-close-modal]');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal) modal.classList.remove('active');
  });
}

/* ==========================================================================
   4. STICKY HEADER SCROLL SHADOW
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.main-navbar-area');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   5. SAMPLE INQUIRY FORM SUBMISSION
   ========================================================================== */
function initFormSubmission() {
  const form = document.getElementById('sampleModalForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Submitting Request...';
    btn.disabled = true;

    setTimeout(() => {
      alert('Thank you for contacting Universal Medicap Limited. Your quote and technical sample request has been received. Our regulatory & formulation engineering team in Vadodara, Gujarat will contact you within 24 hours.');
      btn.innerHTML = orig;
      btn.disabled = false;
      form.reset();
      const modal = document.getElementById('sampleModal');
      if (modal) modal.classList.remove('active');
    }, 900);
  });
}
