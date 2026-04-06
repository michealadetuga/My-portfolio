/* ============================================================
   MICHEAL ADETUGA — Portfolio JavaScript
   Animations | Canvas | Typed | Nav | Scroll
   ============================================================ */

'use strict';

/* ---- 1. NAVBAR SCROLL EFFECT ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = navLinks.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translateY(7px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close menu when clicking a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  function updateActiveNavLink() {
    const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 160) current = id;
    });
    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }
})();


/* ---- 2. TYPED TEXT EFFECT ---- */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Cybersecurity Enthusiast 🔐',
    'Creative Vibecoder ⚡',
    'Problem Solver 🧠',
    'Tech Student 🎓',
    'Builder of Cool Things ✨',
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!isDeleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, isDeleting ? 40 : 80);
  }

  setTimeout(type, 800);
})();


/* ---- 3. HERO CANVAS PARTICLE NETWORK ---- */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;
  const COLORS = ['#6382ff', '#a855f7', '#22d3ee'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(p.color, 0.7);
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = hexToRgba(p.color, alpha);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
  resize();
  createParticles();
  draw();
})();


/* ---- 4. SCROLL-TRIGGERED ANIMATIONS ---- */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children
        const siblings = [...entry.target.parentElement.children].filter(el => el.hasAttribute('data-animate'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
})();


/* ---- 5. SMOOTH SCROLL FOR ALL ANCHOR LINKS ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ---- 6. SKILL TAG HOVER GLOW ---- */
(function initSkillGlow() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.boxShadow = '0 4px 16px rgba(99,130,255,0.2)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.boxShadow = '';
    });
  });
})();


/* ---- 7. PROJECT CARD SPOTLIGHT EFFECT ---- */
(function initCardSpotlight() {
  document.querySelectorAll('.project-card, .skill-category, .contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99,130,255,0.06) 0%, var(--bg-card) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ---- 8. COUNTER ANIMATION (for future use) ---- */
function animateCounter(el, start, end, duration) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


/* ---- 9. HERO PARALLAX ---- */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const overlay = hero.querySelector('.hero-bg-overlay');
    if (overlay) overlay.style.transform = `translateY(${y * 0.2}px)`;
  }, { passive: true });
})();


/* ---- 10. PAGE LOAD ANIMATION ---- */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
