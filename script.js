// script.js — interactions (i18n, anchors, reveal, protections, buy fx + delayed open, footer control, parallax)
document.addEventListener('DOMContentLoaded', () => {
  const BUY_URL = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // I18n (EN / 中文)
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');

  function showLang(lang){
    if(lang === 'en'){
      document.querySelectorAll('.lang-en').forEach(e => e.style.display = '');
      document.querySelectorAll('.lang-zh').forEach(e => e.style.display = 'none');
      btnEn && btnEn.classList.add('active'); 
      btnZh && btnZh.classList.remove('active');
    } else {
      document.querySelectorAll('.lang-en').forEach(e => e.style.display = 'none');
      document.querySelectorAll('.lang-zh').forEach(e => e.style.display = '');
      btnZh && btnZh.classList.add('active'); 
      btnEn && btnEn.classList.remove('active');
    }
  }

  btnEn && btnEn.addEventListener('click', () => showLang('en'));
  btnZh && btnZh.addEventListener('click', () => showLang('zh'));
  showLang('en');

  // Reveal on scroll (IntersectionObserver)
  (function revealOnScroll(){
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    els.forEach(e => io.observe(e));
  })();

  // Smooth scroll for nav buttons and anchor links
  document.querySelectorAll('.nav-btn, a[href^="#"]').forEach(el=>{
    el.addEventListener('click', (e) => {
      const target = el.getAttribute('data-target') || el.getAttribute('href');
      if(!target || !target.startsWith('#')) return;
      const dest = document.querySelector(target);
      if(!dest) return;
      e.preventDefault();

      // offset to avoid covering top of section
      const headerOffset = Math.min(96, Math.max(56, Math.round(window.innerWidth * 0.06)));
      const top = dest.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: 'smooth' });
    }, {passive:false});
  });

  // Buy effect + delayed open (coin drop)
  function playBuyAndOpen(url){
    for(let i=0;i<14;i++){
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (6 + Math.random()*88) + '%';
      el.style.top = '-18px';
      el.style.fontSize = (12 + Math.random()*28) + 'px';
      el.style.opacity = '1';
      document.body.appendChild(el);

      requestAnimationFrame(()=> {
        el.style.transform = `translateY(${110 + Math.random()*20}vh) rotate(${Math.random()*720}deg)`;
        el.style.transition = 'transform 1.5s cubic-bezier(.2,.9,.2,1), opacity 1.5s linear';
        el.style.opacity = '0';
      });

      setTimeout(()=> el.remove(), 1600);
    }

    setTimeout(()=> {
      try { window.open(url, '_blank', 'noopener'); } 
      catch(e){ location.href = url; }
    }, 700);
  }

  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('href') || BUY_URL;
      playBuyAndOpen(url);
    }, {passive:false});
  });

  // Protect images (best-effort)
  (function protectImages(){
    const protectedEls = document.querySelectorAll(
      '.protected-img, .listing-card, .phase-img, .logo-main, .footer-track img, .listing-img, .x-icon'
    );

    protectedEls.forEach(el=>{
      try{
        el.setAttribute('draggable','false');
      }catch(e){}
      el.addEventListener && el.addEventListener('contextmenu', e => e.preventDefault());
      el.addEventListener && el.addEventListener('dragstart', e => e.preventDefault());
      el.addEventListener && el.addEventListener('mousedown', e => { 
        if(e.target && e.target.tagName === 'IMG') e.preventDefault(); 
      });
      el.addEventListener && el.addEventListener('touchstart', e => {}, {passive:true});
    });

    document.addEventListener('contextmenu', (e) => {
      if(e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
  })();

  // Footer loop: pause on hover/touch (desktop and mobile) and keep logos visible
  (function footerLoop(){
    const logos = document.querySelector('.footer-track .logos');
    if(!logos) return;

    logos.addEventListener('mouseenter', ()=> logos.style.animationPlayState = 'paused');
    logos.addEventListener('mouseleave', ()=> logos.style.animationPlayState = 'running');
    logos.addEventListener('touchstart', ()=> logos.style.animationPlayState = 'paused', {passive:true});
    logos.addEventListener('touchend', ()=> logos.style.animationPlayState = 'running', {passive:true});
  })();

  // Subtle parallax for background (desktop)
  (function parallaxBg(){
    const bg = document.querySelector('.bg');
    if(!bg) return;

    function update(){
      if(window.innerWidth > 980){
        const y = window.scrollY * 0.035;
        bg.style.transform = `translateY(${y}px)`;
      } else {
        bg.style.transform = '';
      }
    }

    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
  })();

  // Top X button behaviour (scroll to top + collapse hero briefly)
  const topX = document.getElementById('topX');
  topX && topX.addEventListener('click', () => {
    // smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // subtle hide hero for UX (toggle class)
    const hero = document.getElementById('hero');
    if(hero){
      hero.style.transition = 'opacity .45s ease';
      hero.style.opacity = '0';
      setTimeout(()=> hero.style.opacity = '', 800);
    }
  });

  // protect blurred listings: remove pointer events and prevent selection
  (function protectListings(){
    document.querySelectorAll('.blur .listing-img').forEach(img=>{
      img.style.pointerEvents = 'none';
      img.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('.protect-overlay').forEach(o=>{
      o.addEventListener('contextmenu', e => e.preventDefault());
      o.addEventListener('mousedown', e => e.preventDefault());
    });
  })();

  // Missing images warnings (dev only)
  document.querySelectorAll('img').forEach(img => 
    img.addEventListener('error', ()=> console.warn('Missing image:', img.getAttribute('src') || img.src))
  );

});