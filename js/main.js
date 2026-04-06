/* ============================================
   ARCUS Corporate Site — main.js
   ============================================ */

(function () {
  'use strict';

  /* ---- Page load fade-in ---- */
  window.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-loaded');
    });
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
      /* ease-out cubic */
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

  /* ---- Lucide icons init ---- */
  if (window.lucide) {
    lucide.createIcons();
  }
})();
