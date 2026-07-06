/**
 * Thompson Valley Disposal — Premium Website Scripts
 * Mobile navigation, scroll reveal, gallery filter + lightbox,
 * load-more, form UX, active nav state, dynamic year.
 */

(function () {
  'use strict';

  // =========================================================
  // 1. Mobile Navigation
  // =========================================================
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

  function toggleNav() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mainNav.classList.toggle('is-open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', toggleNav);

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeNav();
      }
    });
  }

  // =========================================================
  // 2. Active Navigation State
  // =========================================================
  function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPath = href.split('/').pop();
      if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if (mainNav) {
    setActiveNav();
  }

  // =========================================================
  // 3. Scroll Reveal Animations
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // =========================================================
  // 4. Simple Markdown Parser & Content Loader
  // =========================================================
  function parseMarkdown(md) {
    if (!md) return '';

    return md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^(\s*)-\s+(.*)$/gim, '<li>$2</li>')
      .replace(/(<li>.*<\/li>)/s, function (match) {
        return '<ul>' + match + '</ul>';
      })
      .split(/\n\s*\n/)
      .map(function (block) {
        block = block.trim();
        if (!block) return '';
        if (/^<(h[123]|ul|li)/.test(block)) return block;
        return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
      })
      .join('\n');
  }

  async function loadMarkdown(element) {
    const src = element.getAttribute('data-md');
    if (!src) return;

    try {
      const response = await fetch(src, { cache: 'no-store' });
      if (!response.ok) throw new Error('Fetch failed: ' + response.status);
      const md = await response.text();
      element.innerHTML = parseMarkdown(md);
    } catch (error) {
      if (window.location.protocol === 'file:') {
        console.info('Markdown files must be served over HTTP(S) to auto-load.');
      } else {
        console.warn('Could not load', src, error);
      }
    }
  }

  document.querySelectorAll('.md-content[data-md]').forEach(loadMarkdown);

  // =========================================================
  // 5. Gallery Filter + Load More
  // =========================================================
  const gallery = document.getElementById('masonryGallery');
  const loadMoreBtn = document.getElementById('loadMoreGallery');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  function getVisibleItems() {
    if (!gallery) return [];
    return Array.from(gallery.querySelectorAll('.gallery-item:not(.filter-hidden)'));
  }

  function applyLoadMore() {
    if (!gallery || !loadMoreBtn) return;
    const items = getVisibleItems();
    const initialCount = 12;

    items.forEach(function (item, index) {
      if (index >= initialCount) {
        item.classList.add('hidden');
      } else {
        item.classList.remove('hidden');
      }
    });

    if (items.length <= initialCount) {
      loadMoreBtn.classList.add('is-hidden');
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }
  }

  if (filterBtns.length && gallery) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        const items = gallery.querySelectorAll('.gallery-item');
        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('filter-hidden');
          } else {
            item.classList.add('filter-hidden');
          }
        });

        applyLoadMore();
      });
    });
  }

  if (gallery && loadMoreBtn) {
    applyLoadMore();

    loadMoreBtn.addEventListener('click', function () {
      const hiddenItems = gallery.querySelectorAll('.gallery-item.hidden:not(.filter-hidden)');
      const batchSize = 12;
      let revealed = 0;

      hiddenItems.forEach(function (item) {
        if (revealed < batchSize) {
          item.classList.remove('hidden');
          revealed++;
        }
      });

      if (gallery.querySelectorAll('.gallery-item.hidden:not(.filter-hidden)').length === 0) {
        loadMoreBtn.classList.add('is-hidden');
      }
    });
  }

  // =========================================================
  // 6. Lightbox
  // =========================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let lightboxItems = [];
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !lightboxItems.length) return;
    currentLightboxIndex = index;
    const item = lightboxItems[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');

    lightboxImg.setAttribute('src', img.getAttribute('src'));
    lightboxImg.setAttribute('alt', img.getAttribute('alt') || '');
    lightboxCaption.textContent = caption ? caption.textContent : '';

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    if (!lightboxItems.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    openLightbox(currentLightboxIndex);
  }

  function showNext() {
    if (!lightboxItems.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
    openLightbox(currentLightboxIndex);
  }

  function initLightbox() {
    if (!gallery) return;
    lightboxItems = Array.from(gallery.querySelectorAll('.gallery-item'));

    lightboxItems.forEach(function (item, index) {
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  initLightbox();

  // =========================================================
  // 7. Contact Form UX
  // =========================================================
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      console.log('Form submission (placeholder):', data);

      if (formNote) {
        formNote.textContent = 'Thanks! We have received your message and will get back to you shortly.';
        formNote.style.color = 'var(--color-charcoal-light)';
      }

      contactForm.reset();
    });
  }

  // =========================================================
  // 8. Before / After Comparison Slider
  // =========================================================
  const comparisonSlider = document.getElementById('comparisonSlider');
  const comparisonAfter = document.getElementById('comparisonAfter');
  const comparisonHandle = document.getElementById('comparisonHandle');

  function updateComparison(x) {
    if (!comparisonSlider || !comparisonAfter || !comparisonHandle) return;
    const rect = comparisonSlider.getBoundingClientRect();
    let percentage = ((x - rect.left) / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    comparisonAfter.style.width = percentage + '%';
    comparisonHandle.style.left = percentage + '%';
  }

  if (comparisonSlider && comparisonAfter && comparisonHandle) {
    let isDragging = false;

    comparisonHandle.addEventListener('mousedown', function () { isDragging = true; });
    comparisonHandle.addEventListener('touchstart', function () { isDragging = true; }, { passive: true });

    document.addEventListener('mouseup', function () { isDragging = false; });
    document.addEventListener('touchend', function () { isDragging = false; });

    comparisonSlider.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      updateComparison(e.clientX);
    });

    comparisonSlider.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      updateComparison(e.touches[0].clientX);
    }, { passive: true });

    comparisonSlider.addEventListener('click', function (e) {
      updateComparison(e.clientX);
    });
  }

  // =========================================================
  // 9. Dynamic Footer Year
  // =========================================================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
