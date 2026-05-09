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
    const sections = ['about', 'skills', 'services', 'experience', 'projects', 'testimonials', 'contact'];
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
  document.querySelectorAll('.project-card, .skill-category, .service-card, .testimonial-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--spot-x', `${x}%`);
      card.style.setProperty('--spot-y', `${y}%`);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99,130,255,0.06) 0%, var(--bg-card) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ---- 8. COUNTER ANIMATION ---- */
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

(function initStatsCounters() {
  const stats = document.querySelectorAll('.stat-val[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      animateCounter(el, 0, target, target > 100 ? 1200 : 900);
      observer.unobserve(el);
    });
  }, { threshold: 0.7 });

  stats.forEach(stat => observer.observe(stat));
})();


/* ---- 8B. DYNAMIC PROJECTS FROM GITHUB ---- */
(function initDynamicProjects() {
  const container = document.getElementById('project-container');
  if (!container) return;

  const githubUser = 'Michealadetuga';
  const fallbackProjects = [
    {
      title: 'Cybersecurity Practice Lab Work',
      cat: 'Security Lab',
      desc: 'Hands-on exercises exploring network scanning, vulnerability awareness, digital hygiene, and basic incident response.',
      language: 'Kali / Nmap',
      url: `https://github.com/${githubUser}`,
      featured: false,
    },
    {
      title: 'notrllymike Portfolio',
      cat: 'Web Portfolio',
      desc: 'A premium dark portfolio concept with dynamic projects, services, feedback, and polished interaction patterns.',
      language: 'HTML / CSS / JS',
      url: 'https://notrllymike.vercel.app/',
      featured: true,
    },
    {
      title: 'Mini Coding Experiments',
      cat: 'Creative Code',
      desc: 'Small tools and UI experiments built while learning, testing ideas, and improving practical development skill.',
      language: 'JavaScript',
      url: `https://github.com/${githubUser}`,
      featured: false,
    },
  ];

  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatName(name) {
    return String(name || 'Project')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  function render(projects) {
    container.innerHTML = projects.map((project, index) => {
      const isFeatured = project.featured || index === 1;
      const statusClass = isFeatured ? 'purple' : (index % 3 === 2 ? 'mixed' : '');
      const status = project.cat || project.language || 'Project';
      const tools = (project.language ? [project.language] : [])
        .concat(project.topics || [])
        .slice(0, 4);

      return `
        <article class="project-card github-card ${isFeatured ? 'featured' : ''}" data-animate>
          <div class="project-card-top">
            <div class="project-icon">${isFeatured ? '⚡' : '⌘'}</div>
            <div class="project-status ${statusClass}">${escapeHTML(status)}</div>
          </div>
          <h3 class="project-title">${escapeHTML(formatName(project.title || project.name))}</h3>
          <p class="project-desc">${escapeHTML(project.desc || project.description || 'A software project from my GitHub workspace.')}</p>
          <div class="project-meta">
            <span>${escapeHTML(project.updated || 'Active build')}</span>
            <span>${project.stars ? `${project.stars} stars` : 'Open source'}</span>
          </div>
          <div class="project-tools">
            ${tools.map(tool => `<span class="tool-tag">${escapeHTML(tool)}</span>`).join('')}
          </div>
          <div class="project-actions">
            <a href="${escapeHTML(project.url || project.html_url || `https://github.com/${githubUser}`)}" target="_blank" rel="noopener" class="btn btn-sm btn-outline">View Project</a>
          </div>
        </article>
      `;
    }).join('');

    const animated = container.querySelectorAll('[data-animate]');
    animated.forEach(el => el.classList.add('visible'));
    initInteractiveCards(container);
  }

  function showLoading() {
    container.innerHTML = '<div class="project-card loading">Syncing latest GitHub projects...</div>';
  }

  async function fetchGithubProjects() {
    showLoading();
    try {
      const res = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=9`);
      if (!res.ok) throw new Error('GitHub request failed');
      const repos = await res.json();
      const excluded = new Set(['michealadetuga', 'my-portfolio']);
      const projects = repos
        .filter(repo => !repo.fork && !excluded.has(repo.name.toLowerCase()))
        .slice(0, 6)
        .map(repo => ({
          title: repo.name,
          cat: repo.language || 'GitHub',
          desc: repo.description,
          language: repo.language || 'Code',
          topics: repo.topics || [],
          url: repo.homepage || repo.html_url,
          updated: repo.updated_at ? `Updated ${new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}` : 'Recently updated',
          stars: repo.stargazers_count,
          featured: repo.homepage,
        }));

      render(projects.length ? projects : fallbackProjects);
    } catch (error) {
      render(fallbackProjects);
    }
  }

  render(fallbackProjects);
  fetchGithubProjects();
})();


/* ---- 8C. PREMIUM INTERACTIONS ---- */
function initInteractiveCards(root = document) {
  const cards = root.querySelectorAll('.project-card, .service-card, .testimonial-card');
  cards.forEach(card => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const spotX = (x / rect.width) * 100;
      const spotY = (y / rect.height) * 100;
      const tiltX = ((y / rect.height) - 0.5) * -7;
      const tiltY = ((x / rect.width) - 0.5) * 7;
      card.style.setProperty('--spot-x', `${spotX}%`);
      card.style.setProperty('--spot-y', `${spotY}%`);
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

(function initPremiumInteractions() {
  const progress = document.getElementById('scroll-progress');
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  const glow = document.getElementById('mouse-glow');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  window.addEventListener('scroll', () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${percent}%`;
  }, { passive: true });

  if (finePointer && dot && outline && glow) {
    document.body.classList.add('has-custom-cursor');

    window.addEventListener('pointermove', e => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      outline.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
      }, { duration: 420, fill: 'forwards' });
    }, { passive: true });

    document.querySelectorAll('a, button, .project-card, .service-card, .testimonial-card, .skill-category').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  initInteractiveCards();
})();


/* ---- 9. HERO PARALLAX ---- */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let currentScroll = 0;
  let rafId = null;

  function queueFrame() {
    if (rafId) return;
    rafId = requestAnimationFrame(render);
  }

  function render() {
    rafId = null;
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentScroll += (window.scrollY - currentScroll) * 0.08;

    hero.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`);
    hero.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`);
    hero.style.setProperty('--scroll-depth', `${Math.min(currentScroll, window.innerHeight).toFixed(2)}px`);

    if (
      Math.abs(targetX - currentX) > 0.1 ||
      Math.abs(targetY - currentY) > 0.1 ||
      Math.abs(window.scrollY - currentScroll) > 0.5
    ) {
      queueFrame();
    }
  }

  hero.addEventListener('pointermove', e => {
    const rect = hero.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = relX * 42;
    targetY = relY * 34;
    queueFrame();
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    queueFrame();
  });

  window.addEventListener('scroll', () => {
    const overlay = hero.querySelector('.hero-bg-overlay');
    if (overlay) overlay.style.transform = `translateY(${window.scrollY * 0.14}px)`;
    queueFrame();
  }, { passive: true });

  queueFrame();
})();


/* ---- 10. PAGE LOAD ANIMATION ---- */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
