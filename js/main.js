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
    initHeroTitleAnimation();
    initHeroScrollScaling();
    initHeroMouseParallax();
    initImageReveal();
    initCharAnimate();
    initScrollProgress();
    initNumbersReveal();
    initServiceCardReveal();
    initNewsItemReveal();
    initScrollExperience();
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
     Number count-up — Scroll-linked counter
     Numbers change based on scroll position within the section.
     ============================================ */
  var countEls = document.querySelectorAll('[data-count]');

  /* Store metadata for each counter element */
  var countData = [];
  countEls.forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = target % 1 !== 0 ? 1 : 0;
    el.textContent = '0' + suffix;
    countData.push({
      el: el,
      target: target,
      suffix: suffix,
      decimals: decimals,
      done: false
    });
  });

  /* This function is called from the unified scroll loop */
  function updateScrollCounters() {
    var numbersSection = document.getElementById('numbers');
    if (!numbersSection || !countData.length) return;

    var rect = numbersSection.getBoundingClientRect();
    var windowH = window.innerHeight;

    /* progress: 0 when section top enters viewport, 1 when section top reaches 30% from top */
    var startY = windowH;        /* section top at viewport bottom = 0% */
    var endY = windowH * 0.3;    /* section top at 30% from top = 100% */
    var progress = Math.max(0, Math.min(1, (startY - rect.top) / (startY - endY)));

    countData.forEach(function (item) {
      var current = item.target * progress;
      item.el.textContent = current.toFixed(item.decimals) + item.suffix;

      if (progress >= 1 && !item.done) {
        item.done = true;
        var parentValue = item.el.closest('.numbers__value');
        if (parentValue) parentValue.classList.add('is-bounced');
      }
    });
  }

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

  /* ============================================
     Hero Title Cinematic Animation
     Phase 2: 1文字ずつ出現 → Phase 3: テキストマスク切り替え
     ============================================ */
  function initHeroTitleAnimation() {
    var chars = document.querySelectorAll('.hero-char');
    if (!chars.length) return;

    var title = document.getElementById('hero-title');

    /* Phase 2: 文字を出現させる（CSS transition-delay で各文字がずれて出現） */
    requestAnimationFrame(function () {
      chars.forEach(function (c) { c.classList.add('is-visible'); });
    });

    /* Phase 3: 全文字出現後にテキストマスクをワイプで切り替え
       最後の文字の delay = 4 * 0.12 + 0.5 = 0.98s、transition duration = 0.7s
       → 最後の文字完了 = 約1.68s、+ 0.3s待機 = 約2.0s */
    var lastCharDelay = (chars.length - 1) * 0.12 + 0.5;
    var totalCharTime = lastCharDelay + 0.7;
    setTimeout(function () {
      if (title) {
        /* span構造を解除してプレーンテキストに戻す（background-clip:textを正しく効かせるため） */
        title.textContent = 'ARCUS';
        title.classList.add('is-masked');
        title.classList.add('is-mask-animating');
      }
    }, (totalCharTime + 0.3) * 1000);
  }

  /* ============================================
     Motion 1: Hero Scroll Scaling
     ARCUS text scales up and fades out on scroll
     ============================================ */
  function initHeroScrollScaling() {
    var heroTitle = document.querySelector('.hero__mask-text');
    var heroSection = document.querySelector('.hero');
    if (!heroTitle || !heroSection) return;

    var ticking = false;

    function updateHeroScale() {
      var rect = heroSection.getBoundingClientRect();
      var windowH = window.innerHeight;
      /* Progress from 0 (top) to 1 (scrolled past 100vh) */
      var scrolled = -rect.top;
      var progress = Math.max(0, Math.min(1, scrolled / windowH));

      /* Scale from 1 to 1.5, opacity from 1 to 0 */
      var scale = 1 + progress * 0.5;
      var opacity = 1 - progress;

      heroTitle.style.transform = 'scale(' + scale + ')';
      heroTitle.style.opacity = opacity;

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeroScale);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================
     Motion 2: Hero Mouse Parallax (desktop only)
     Background image shifts with mouse position
     ============================================ */
  function initHeroMouseParallax() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var heroTitle = document.querySelector('.hero__mask-text');
    if (!heroTitle) return;

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var maxOffset = 20; /* px */
    var running = false;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animate() {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      var bgX = 'calc(50% + ' + currentX + 'px)';
      var bgY = 'calc(50% + ' + currentY + 'px)';
      heroTitle.style.backgroundPosition = bgX + ' ' + bgY;

      if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
        requestAnimationFrame(animate);
      } else {
        running = false;
      }
    }

    document.addEventListener('mousemove', function (e) {
      var w = window.innerWidth;
      var h = window.innerHeight;
      /* Normalize to -1..1 */
      var nx = (e.clientX / w - 0.5) * 2;
      var ny = (e.clientY / h - 0.5) * 2;

      targetX = nx * maxOffset;
      targetY = ny * maxOffset;

      if (!running) {
        running = true;
        requestAnimationFrame(animate);
      }
    }, { passive: true });
  }

  /* ============================================
     Motion 3: Image Reveal (Curtain Effect)
     Service images reveal with sliding overlay
     ============================================ */
  function initImageReveal() {
    var revealEls = document.querySelectorAll('.img-reveal');
    if (!revealEls.length) return;

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ============================================
     Motion 4: Character-by-character Animation
     Splits text into spans and animates in
     ============================================ */
  function initCharAnimate() {
    var targets = document.querySelectorAll('[data-char-animate]');
    if (!targets.length) return;

    targets.forEach(function (target) {
      /* Find the inner span with the text */
      var innerSpan = target.querySelector('.reveal-line__inner');
      var textSource = innerSpan || target;
      var text = textSource.textContent;
      var html = '';

      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (c === ' ') {
          html += '<span class="char" style="width:0.3em">&nbsp;</span>';
        } else {
          html += '<span class="char">' + c + '</span>';
        }
      }

      textSource.innerHTML = html;

      var charObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var chars = entry.target.querySelectorAll('.char');
              chars.forEach(function (ch, idx) {
                setTimeout(function () {
                  ch.classList.add('is-visible');
                }, 30 * idx);
              });
              charObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      charObserver.observe(target);
    });
  }

  /* ============================================
     Scroll Progress Bar
     ============================================ */
  function initScrollProgress() {
    var progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    var ticking = false;

    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  /* ============================================
     Numbers — Scale + Blur reveal animation
     ============================================ */
  function initNumbersReveal() {
    var numberValues = document.querySelectorAll('.numbers__value');
    if (!numberValues.length) return;

    var numbersObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            numbersObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    numberValues.forEach(function (el) {
      numbersObserver.observe(el);
    });
  }

  /* ============================================
     Service Cards — Slide-in from right with stagger
     ============================================ */
  function initServiceCardReveal() {
    var cards = document.querySelectorAll('.service-sticky__card');
    if (!cards.length) return;

    var cardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setTimeout(function () {
              entry.target.classList.add('is-visible');
            }, idx * 150);
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach(function (card) {
      cardObserver.observe(card);
    });
  }

  /* ============================================
     News Items — Stagger reveal from left
     ============================================ */
  function initNewsItemReveal() {
    /* News items are dynamically loaded, so we use MutationObserver */
    var newsList = document.getElementById('news-list');
    if (!newsList) return;

    function observeNewsItems() {
      var items = newsList.querySelectorAll('.news__item');
      if (!items.length) return;

      var newsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              /* Find index among siblings */
              var siblings = Array.prototype.slice.call(entry.target.parentElement.children);
              var idx = siblings.indexOf(entry.target);
              setTimeout(function () {
                entry.target.classList.add('is-visible');
              }, idx * 100);
              newsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
      );

      items.forEach(function (item) {
        newsObserver.observe(item);
      });
    }

    /* Observe for dynamically loaded content */
    var mutObserver = new MutationObserver(function () {
      observeNewsItems();
    });
    mutObserver.observe(newsList, { childList: true });

    /* Also try immediately in case items are already there */
    observeNewsItems();
  }

  /* ============================================
     Scroll Experience — Unified scroll loop
     All 5 scroll-driven effects in a single rAF loop.
     ============================================ */
  function initScrollExperience() {
    /* ---- 1. Background color transitions ---- */
    var bgSections = [
      { sel: '.hero',           color: '#ffffff' },
      { sel: '.numbers',        color: '#f0f9ff' },
      { sel: '.service-sticky', color: '#ffffff' },
      { sel: '.why-hscroll',    color: '#f1f5f9' },
      { sel: '.news',           color: '#ffffff' },
      { sel: '.contact-cta',    color: '#dbeafe' }
    ];

    var bgSectionEls = [];
    bgSections.forEach(function (s) {
      var el = document.querySelector(s.sel);
      if (el) bgSectionEls.push({ el: el, color: s.color });
    });

    function updateBgColor() {
      var midY = window.innerHeight * 0.4;
      var currentColor = '#ffffff';

      for (var i = bgSectionEls.length - 1; i >= 0; i--) {
        var rect = bgSectionEls[i].el.getBoundingClientRect();
        if (rect.top <= midY) {
          currentColor = bgSectionEls[i].color;
          break;
        }
      }

      document.body.style.setProperty('--scroll-bg', currentColor);
    }

    /* ---- 2. Scroll-linked counters (delegated to updateScrollCounters) ---- */

    /* ---- 3. Service card parallax ---- */
    var serviceCards = document.querySelectorAll('.service-sticky__card');

    function updateServiceParallax() {
      if (!serviceCards.length) return;

      serviceCards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var windowH = window.innerHeight;

        /* Only process cards near viewport */
        if (rect.bottom < -100 || rect.top > windowH + 100) return;

        /* scrollDelta: distance from center of viewport */
        var cardCenter = rect.top + rect.height / 2;
        var viewCenter = windowH / 2;
        var delta = cardCenter - viewCenter;

        var numEl = card.querySelector('.service-sticky__number');
        var imgEl = card.querySelector('.service-sticky__img');

        if (numEl) {
          numEl.style.transform = 'translateY(' + (delta * 0.3) + 'px)';
        }
        if (imgEl) {
          imgEl.style.transform = 'translateY(' + (delta * 0.15) + 'px)';
        }
      });
    }

    /* ---- 4. Scroll snap (desktop only) ---- */
    if (window.innerWidth >= 1024) {
      document.documentElement.classList.add('scroll-snap-active');
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) {
        document.documentElement.classList.add('scroll-snap-active');
      } else {
        document.documentElement.classList.remove('scroll-snap-active');
      }
    });

    /* ---- 5. Section title scroll-linked fade ---- */
    var fadeTitles = document.querySelectorAll('[data-scroll-fade]');

    function updateTitleFade() {
      if (!fadeTitles.length) return;

      fadeTitles.forEach(function (title) {
        var rect = title.getBoundingClientRect();
        var windowH = window.innerHeight;

        /* Entering zone: bottom 30% of viewport */
        var enterStart = windowH;
        var enterEnd = windowH * 0.6;

        /* Exiting zone: top 20% of viewport */
        var exitStart = windowH * 0.2;
        var exitEnd = -rect.height;

        var centerY = rect.top + rect.height / 2;
        var opacity = 1;
        var translateY = 0;

        if (centerY > enterStart) {
          /* Below viewport — hidden */
          opacity = 0;
          translateY = 30;
        } else if (centerY > enterEnd) {
          /* Entering — fade in */
          var enterProgress = 1 - (centerY - enterEnd) / (enterStart - enterEnd);
          opacity = enterProgress;
          translateY = 30 * (1 - enterProgress);
        } else if (centerY < exitEnd) {
          /* Above viewport — hidden */
          opacity = 0;
          translateY = -30;
        } else if (centerY < exitStart) {
          /* Exiting — fade out */
          var exitProgress = (centerY - exitEnd) / (exitStart - exitEnd);
          opacity = exitProgress;
          translateY = -30 * (1 - exitProgress);
        }

        title.style.opacity = opacity;
        title.style.transform = 'translateY(' + translateY + 'px)';
      });
    }

    /* ---- Unified scroll handler ---- */
    var scrollTicking = false;

    function onScrollExperience() {
      updateBgColor();
      updateScrollCounters();
      updateServiceParallax();
      updateTitleFade();
      scrollTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(onScrollExperience);
        scrollTicking = true;
      }
    }, { passive: true });

    /* Initial call */
    onScrollExperience();
  }

})();
