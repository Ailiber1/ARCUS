/* ============================================
   ARCUS Corporate Site — main.js
   Art Redesign: Architectural Minimalism
   ============================================ */

(function () {
  'use strict';

  /* ---- Supabase REST API ---- */
  var SUPABASE_URL = 'https://pcsggtyuwfhqbmjczraq.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjc2dndHl1d2ZocWJtamN6cmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzIwMDQsImV4cCI6MjA5MDcwODAwNH0._q1xfP1jMRXj2amFld47UpSCnM-Zl0sqeSJ6UF_79EY';

  /* ---- Page load ---- */
  window.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-loaded');
    });

    /* Init Lucide icons */
    if (window.lucide) {
      lucide.createIcons();
    }

    /* Init all modules */
    loadTopNews();
    loadNewsPage();
    initContactForm();
    initFadeUp();
    initRevealLines();
    initCustomCursor();
    initParallax();
    initMagneticButtons();
    initHorizontalScroll();
  });

  /* ============================================
     Header scroll effect
     ============================================ */
  var header = document.querySelector('.site-header');
  var scrollThreshold = 40;

  function onHeaderScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onHeaderScroll, { passive: true });

  /* ============================================
     Hamburger menu
     ============================================ */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  function toggleMenu() {
    var isOpen = hamburger.classList.toggle('is-active');
    mobileNav.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('is-active');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ============================================
     Scroll-triggered fade-up with stagger
     ============================================ */
  function initFadeUp() {
    var fadeEls = document.querySelectorAll('.fade-up');
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  /* ============================================
     Split Reveal Lines (hero text animation)
     ============================================ */
  function initRevealLines() {
    var revealEls = document.querySelectorAll('.reveal-line');
    if (!revealEls.length) return;

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            /* Also trigger parent's is-visible for stagger */
            var parent = entry.target.closest('.hero__content, .hero__copy');
            if (parent) parent.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ============================================
     Number count-up with bounce
     ============================================ */
  var countEls = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = target % 1 !== 0 ? 1 : 0;
    var duration = 2000;
    var startTime = null;
    var parentValue = el.closest('.numbers__value');

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* easeOutExpo */
      var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var current = target * ease;

      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        /* Add bounce effect after count completes */
        if (parentValue) {
          parentValue.classList.add('is-bounced');
        }
      }
    }

    requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  countEls.forEach(function (el) {
    el.textContent = '0';
    countObserver.observe(el);
  });

  /* ============================================
     Parallax effect (sub-hero bg, contact-cta bg)
     ============================================ */
  function initParallax() {
    var parallaxTargets = [];

    /* Contact CTA background */
    var ctaBg = document.querySelector('.contact-cta__bg');
    if (ctaBg) parallaxTargets.push({ el: ctaBg, speed: 0.2 });

    /* Sub-hero backgrounds */
    var subHeroBgs = document.querySelectorAll('.sub-hero__bg');
    subHeroBgs.forEach(function (bg) {
      parallaxTargets.push({ el: bg, speed: 0.25 });
    });

    if (!parallaxTargets.length) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      var windowH = window.innerHeight;

      parallaxTargets.forEach(function (item) {
        var rect = item.el.parentElement.getBoundingClientRect();
        /* Only update if in or near viewport */
        if (rect.bottom > -windowH && rect.top < windowH * 2) {
          var offset = scrollY * item.speed;
          item.el.style.transform = 'translate3d(0,' + (-offset * 0.5) + 'px,0)';
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    /* Initial call */
    updateParallax();
  }

  /* ============================================
     Horizontal Scroll — Why ARCUS (desktop only)
     ============================================ */
  function initHorizontalScroll() {
    var section = document.querySelector('.why-hscroll');
    if (!section) return;

    /* Only on desktop */
    if (window.innerWidth < 1024) return;

    var sticky = section.querySelector('.why-hscroll__sticky');
    var track = section.querySelector('.why-hscroll__track');
    if (!sticky || !track) return;

    var ticking = false;

    function updateHScroll() {
      var sectionRect = section.getBoundingClientRect();
      var sectionHeight = section.offsetHeight;
      var windowH = window.innerHeight;

      /* How far we've scrolled into the section (0 to sectionHeight - windowH) */
      var scrollIntoSection = -sectionRect.top;
      var maxScroll = sectionHeight - windowH;

      if (scrollIntoSection < 0) scrollIntoSection = 0;
      if (scrollIntoSection > maxScroll) scrollIntoSection = maxScroll;

      var progress = maxScroll > 0 ? scrollIntoSection / maxScroll : 0;

      /* Calculate how far to move the track */
      var trackWidth = track.scrollWidth;
      var viewportWidth = sticky.offsetWidth;
      var maxTranslate = trackWidth - viewportWidth + 80; /* 80px padding */

      var translateX = -progress * maxTranslate;
      track.style.transform = 'translate3d(' + translateX + 'px, 0, 0)';

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHScroll);
        ticking = true;
      }
    }, { passive: true });

    updateHScroll();

    /* Re-check on resize */
    window.addEventListener('resize', function () {
      if (window.innerWidth < 1024) {
        track.style.transform = '';
      }
    });
  }

  /* ============================================
     Custom Cursor (desktop only)
     ============================================ */
  function initCustomCursor() {
    /* Only for pointer: fine devices */
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.body.classList.add('cursor-active');

    var cursorX = 0;
    var cursorY = 0;
    var currentX = 0;
    var currentY = 0;

    document.addEventListener('mousemove', function (e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      /* Smooth follow with lerp */
      currentX += (cursorX - currentX) * 0.15;
      currentY += (cursorY - currentY) * 0.15;

      cursor.style.transform = 'translate3d(' + currentX + 'px,' + currentY + 'px,0)';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    /* Hover detection for links and buttons */
    var hoverTargets = document.querySelectorAll('a, button, .service-sticky__card, .why-hscroll__card, .contact-cta__btn');

    hoverTargets.forEach(function (target) {
      target.addEventListener('mouseenter', function () {
        cursor.classList.add('is-hover');
      });
      target.addEventListener('mouseleave', function () {
        cursor.classList.remove('is-hover');
      });
    });
  }

  /* ============================================
     Magnetic Buttons
     ============================================ */
  function initMagneticButtons() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var btns = document.querySelectorAll('.contact-cta__btn, .site-header__cta, .contact-form__submit');

    btns.forEach(function (btn) {
      btn.classList.add('magnetic-btn');

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        /* Subtle magnetic pull */
        btn.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ============================================
     Privacy Policy Modal
     ============================================ */
  var modalOverlay = document.querySelector('.modal-overlay');
  var modalOpen = document.querySelector('[data-modal-open]');
  var modalClose = document.querySelector('[data-modal-close]');

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  if (modalOpen) modalOpen.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeMenu();
    }
  });

  /* ============================================
     Smooth scroll for anchor links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     Supabase: Top Page News (3 items)
     ============================================ */
  function loadTopNews() {
    var newsList = document.getElementById('news-list');
    if (!newsList) return;

    var url = SUPABASE_URL + '/rest/v1/arcus_news?select=date,category,title&order=sort_order.desc&is_published=eq.true&limit=3';
    fetch(url, {
      headers: { 'apikey': SUPABASE_ANON_KEY }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (items) {
      var html = '';
      items.forEach(function (item) {
        var tagClass = 'news__tag--' + (item.category || 'notice').toLowerCase();
        var tagLabel = item.category || 'Notice';
        tagLabel = tagLabel.charAt(0).toUpperCase() + tagLabel.slice(1);
        html += '<a href="news.html" class="news__item">'
          + '<div class="news__meta">'
          + '<span class="news__date">' + escapeHtml(item.date || '') + '</span>'
          + '<span class="news__tag ' + tagClass + '">' + escapeHtml(tagLabel) + '</span>'
          + '</div>'
          + '<span class="news__title">' + escapeHtml(item.title || '') + '</span>'
          + '</a>';
      });
      newsList.innerHTML = html;
    }).catch(function (err) {
      console.error('News load error:', err);
    });
  }

  /* ============================================
     Supabase: News Page (all + filter)
     ============================================ */
  var allNewsData = [];

  function loadNewsPage() {
    var newsPageList = document.getElementById('news-page-list');
    if (!newsPageList) return;

    var url = SUPABASE_URL + '/rest/v1/arcus_news?select=date,category,title,content&order=sort_order.desc&is_published=eq.true';
    fetch(url, {
      headers: { 'apikey': SUPABASE_ANON_KEY }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (items) {
      allNewsData = items;
      renderNewsList(allNewsData);
      initNewsFilter();
    }).catch(function (err) {
      console.error('News page load error:', err);
    });
  }

  function renderNewsList(items) {
    var newsPageList = document.getElementById('news-page-list');
    if (!newsPageList) return;

    var html = '';
    items.forEach(function (item) {
      var tagClass = 'news__tag--' + (item.category || 'notice').toLowerCase();
      var tagLabel = item.category || 'Notice';
      tagLabel = tagLabel.charAt(0).toUpperCase() + tagLabel.slice(1);

      html += '<div class="news-accordion" data-category="' + escapeHtml((item.category || 'notice').toLowerCase()) + '">'
        + '<button class="news-accordion__header" aria-expanded="false">'
        + '<div class="news-accordion__meta">'
        + '<span class="news-accordion__date">' + escapeHtml(item.date || '') + '</span>'
        + '<span class="news__tag ' + tagClass + '">' + escapeHtml(tagLabel) + '</span>'
        + '</div>'
        + '<span class="news-accordion__title">' + escapeHtml(item.title || '') + '</span>'
        + '<span class="news-accordion__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>'
        + '</button>'
        + '<div class="news-accordion__body">'
        + '<div class="news-accordion__content">' + escapeHtml(item.content || item.title || '') + '</div>'
        + '</div>'
        + '</div>';
    });

    newsPageList.innerHTML = html;
    initAccordions();
  }

  /* ---- News Filter ---- */
  function initNewsFilter() {
    var tabs = document.querySelectorAll('.news-filter__tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        this.classList.add('is-active');

        var filter = this.getAttribute('data-filter');
        if (filter === 'all') {
          renderNewsList(allNewsData);
        } else {
          var filtered = allNewsData.filter(function (item) {
            return (item.category || '').toLowerCase() === filter;
          });
          renderNewsList(filtered);
        }
      });
    });
  }

  /* ---- Accordion ---- */
  function initAccordions() {
    var headers = document.querySelectorAll('.news-accordion__header');
    headers.forEach(function (hdr) {
      hdr.addEventListener('click', function () {
        var accordion = this.closest('.news-accordion');
        var isOpen = accordion.classList.contains('is-open');

        /* Close all */
        document.querySelectorAll('.news-accordion.is-open').forEach(function (a) {
          a.classList.remove('is-open');
          a.querySelector('.news-accordion__header').setAttribute('aria-expanded', 'false');
        });

        /* Toggle current */
        if (!isOpen) {
          accordion.classList.add('is-open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ============================================
     Contact Form → Supabase
     ============================================ */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Clear errors */
      form.querySelectorAll('.is-error').forEach(function (el) {
        el.classList.remove('is-error');
      });

      /* Get values */
      var company = form.querySelector('#company').value.trim();
      var name = form.querySelector('#name').value.trim();
      var email = form.querySelector('#email').value.trim();
      var phone = form.querySelector('#phone').value.trim();
      var inquiryType = form.querySelector('#inquiry-type').value;
      var message = form.querySelector('#message').value.trim();

      /* Validate */
      var hasError = false;

      if (!company) {
        form.querySelector('#company').classList.add('is-error');
        hasError = true;
      }
      if (!name) {
        form.querySelector('#name').classList.add('is-error');
        hasError = true;
      }
      if (!email || !isValidEmail(email)) {
        form.querySelector('#email').classList.add('is-error');
        hasError = true;
      }
      if (!inquiryType) {
        form.querySelector('#inquiry-type').classList.add('is-error');
        hasError = true;
      }
      if (!message) {
        form.querySelector('#message').classList.add('is-error');
        hasError = true;
      }

      if (hasError) return;

      /* Disable submit */
      var submitBtn = document.getElementById('contact-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';

      /* POST to Supabase */
      var contactData = {
        company: company,
        name: name,
        email: email,
        phone: phone,
        inquiry_type: inquiryType,
        message: message
      };

      fetch(SUPABASE_URL + '/rest/v1/arcus_contacts', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(contactData)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        /* Show thank you */
        form.style.display = 'none';
        var thanks = document.getElementById('contact-thanks');
        if (thanks) {
          thanks.style.display = 'block';
          if (window.lucide) lucide.createIcons();
        }
      }).catch(function (err) {
        console.error('Contact submit error:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message \u2192';
        alert('送信に失敗しました。しばらく経ってからもう一度お試しください。');
      });
    });
  }

  /* ---- Utilities ---- */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

})();
