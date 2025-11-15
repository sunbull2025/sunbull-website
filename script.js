document.addEventListener('DOMContentLoaded', () => {
  const BUY_URL = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // Language toggle
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  function showLang(lang) {
    if (lang === 'en') {
      document.querySelectorAll('.lang-en').forEach(e => e.style.display = '');
      document.querySelectorAll('.lang-zh').forEach(e => e.style.display = 'none');
      btnEn.classList.add('active');
      btnZh.classList.remove('active');
    } else {
      document.querySelectorAll('.lang-en').forEach(e => e.style.display = 'none');
      document.querySelectorAll('.lang-zh').forEach(e => e.style.display = '');
      btnZh.classList.add('active');
      btnEn.classList.remove('active');
    }
  }
  btnEn.addEventListener('click', () => showLang('en'));
  btnZh.addEventListener('click', () => showLang('zh'));
  showLang('en');

  // Reveal sections on scroll
  (function revealOnScroll() {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  })();

  // Smooth scroll for nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const targetId = btn.getAttribute('data-target');
      const dest = document.querySelector(targetId);
      if (!dest) return;
      e.preventDefault();
      const offset = Math.min(96, Math.max(50, Math.round(window.innerWidth * 0.05)));
      const top = dest.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Buy button effect
  function playBuyAndOpen(url) {
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (6 + Math.random() * 88) + '%';
      el.style.top = '-18px';
      el.style.fontSize = (12 + Math.random() * 28) + 'px';
      el.style.opacity = '1';
      document.body.append(el);

      requestAnimationFrame(() => {
        el.style.transform = `translateY(${110 + Math.random()*20}vh) rotate(${Math.random()*720}deg)`;
        el.style.transition = 'transform 1.5s cubic-bezier(.2,.9,.2,1), opacity 1.5s linear';
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 1600);
    }

    setTimeout(() => {
      try {
        window.open(url, '_blank', 'noopener');
      } catch (e) {
        window.location.href = url;
      }
    }, 800);
  }

  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      playBuyAndOpen(btn.getAttribute('href') || BUY_URL);
    });
  });

  // Protect images from drag / right-click
  (function protectImages() {
    const els = document.querySelectorAll(
      '.protected-img, .listing-card, .phase-img, .x-icon, .footer-track img'
    );
    els.forEach(el => {
      el.setAttribute('draggable', 'false');
      el.addEventListener('contextmenu', e => e.preventDefault());
      el.addEventListener('dragstart', e => e.preventDefault());
      el.addEventListener('mousedown', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });
    });
  })();

  // Footer loop pause on hover / touch
  (function footerLoop() {
    const logos = document.querySelector('.footer-track .logos');
    if (!logos) return;
    logos.addEventListener('mouseenter', () => logos.style.animationPlayState = 'paused');
    logos.addEventListener('mouseleave', () => logos.style.animationPlayState = 'running');
    logos.addEventListener('touchstart', () => logos.style.animationPlayState = 'paused', { passive: true });
    logos.addEventListener('touchend', () => logos.style.animationPlayState = 'running', { passive: true });
  })();

  // Parallax background (desktop)
  (function parallaxBg() {
    const bg = document.querySelector('.bg');
    if (!bg) return;
    function update() {
      if (window.innerWidth > 980) {
        const y = window.scrollY * 0.035;
        bg.style.transform = `translateY(${y}px)`;
      } else {
        bg.style.transform = '';
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  })();
});