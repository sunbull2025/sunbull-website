document.addEventListener('DOMContentLoaded', () => {
  // LINK ATUALIZADO: Vai para a página inicial por enquanto
  const BUY_URL = 'https://sunpump.meme';

  // Language toggle functionality
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  
  function showLang(lang) {
    // Alterna os painéis de conteúdo principais (EN vs ZH)
    if (lang === 'en') {
      document.querySelectorAll('.lang-en').forEach(e => e.style.display = '');
      document.querySelectorAll('.lang-zh').forEach(e => e.style.display = 'none');
      btnEn.classList.add('active');
      btnZh.classList.remove('active');
      document.documentElement.lang = 'en';
    } else {
      document.querySelectorAll('.lang-en').forEach(e => e.style.display = 'none');
      document.querySelectorAll('.lang-zh').forEach(e => e.style.display = '');
      btnZh.classList.add('active');
      btnEn.classList.remove('active');
      document.documentElement.lang = 'zh';
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const i18nData = el.getAttribute('data-i18n');
      if (i18nData) {
        try {
          const dict = JSON.parse(i18nData);
          const newText = dict[lang];
          if (newText) {
            const textSpan = el.querySelector('span');
            if (textSpan && el.querySelector('img')) {
              textSpan.textContent = newText; 
            } else {
              el.textContent = newText;
            }
          }
        } catch (e) {
          console.error("i18n parsing error:", e, el);
        }
      }
    });
  }
  
  btnEn.addEventListener('click', () => showLang('en'));
  btnZh.addEventListener('click', () => showLang('zh'));
  showLang('en'); 

  // Reveal sections on scroll (IntersectionObserver)
  (function revealOnScroll() {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(e => io.observe(e));
  })();

  // Smooth scroll for nav buttons
  document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', e => {
      const targetId = btn.getAttribute('data-target');
      const dest = document.querySelector(targetId);
      if (!dest) return;
      e.preventDefault();
      const offset = 80; 
      const top = dest.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Back to Top Button Logic
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Buy button coin/sun effect and page opening
  function playBuyAndOpen(url) {
    for (let i = 0; i < 16; i++) { 
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (6 + Math.random() * 88) + '%';
      el.style.top = '-18px';
      el.style.fontSize = (18 + Math.random() * 32) + 'px'; 
      el.style.opacity = '1';
      document.body.append(el);

      requestAnimationFrame(() => {
        el.style.transform = `translateY(${120 + Math.random()*30}vh) rotate(${Math.random()*1080}deg)`; 
        el.style.transition = 'transform 1.8s cubic-bezier(.3, 1.2, .5, 1), opacity 1.8s linear'; 
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 2000);
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
        const y = window.scrollY * 0.04; 
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
