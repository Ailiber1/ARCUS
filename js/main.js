/* ============================================
   ARCUS Corporate Site — main.js
   ============================================ */

(function () {
  'use strict';

  /* ---- Firebase Init ---- */
  var db = null;
  if (window.firebase) {
    firebase.initializeApp({
      apiKey: 'AIzaSyDEru4I6Q_AYA4Rwi863fOBJLVzpoeg4e0',
      databaseURL: 'https://arcus-corporate-default-rtdb.firebaseio.com',
      projectId: 'arcus-corporate'
    });
    db = firebase.database();
  }

  /* ---- Page load fade-in ---- */
  window.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-loaded');
    });

    /* Init Lucide icons */
    if (window.lucide) {
      lucide.createIcons();
    }

    /* Init news (top page) */
    loadTopNews();

    /* Init news (news page) */
    loadNewsPage();

    /* Init contact form */
    initContactForm();

    /* Re-init fade-up observers for sub pages */
    initFadeUp();
  });

  /* ---- Header scroll effect ---- */
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

  /* ---- Hamburger menu ---- */
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

  /* ---- Scroll-triggered fade-up ---- */
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  /* ---- Number count-up ---- */
  var countEls = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = target % 1 !== 0 ? 1 : 0;
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = target * ease;

      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
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

  /* ---- Privacy Policy Modal ---- */
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

  /* ---- Smooth scroll for anchor links ---- */
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
     Firebase: Top Page News (3件)
     ============================================ */
  function loadTopNews() {
    var newsList = document.getElementById('news-list');
    if (!newsList || !db) return;

    var ref = db.ref('news').orderByChild('order').limitToLast(3);
    ref.once('value').then(function (snapshot) {
      var items = [];
      snapshot.forEach(function (child) {
        items.push(child.val());
      });
      items.reverse();

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
     Firebase: News Page (全件 + フィルター)
     ============================================ */
  var allNewsData = [];

  function loadNewsPage() {
    var newsPageList = document.getElementById('news-page-list');
    if (!newsPageList || !db) return;

    var ref = db.ref('news').orderByChild('order');
    ref.once('value').then(function (snapshot) {
      allNewsData = [];
      snapshot.forEach(function (child) {
        allNewsData.push(child.val());
      });
      allNewsData.reverse();

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
    items.forEach(function (item, i) {
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
        + '<div class="news-accordion__content">' + escapeHtml(item.detail || item.title || '') + '</div>'
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
    headers.forEach(function (header) {
      header.addEventListener('click', function () {
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
     Contact Form → Firebase
     ============================================ */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form || !db) return;

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

      /* Push to Firebase */
      var contactData = {
        company: company,
        name: name,
        email: email,
        phone: phone,
        inquiryType: inquiryType,
        message: message,
        timestamp: new Date().toISOString()
      };

      db.ref('contacts').push(contactData).then(function () {
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
        submitBtn.textContent = 'Send Message →';
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
